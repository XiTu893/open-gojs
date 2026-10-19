/**
 * Mermaid flowchart 语法分析器 —— 基于"按行/按分号切语句"的递归下降解析。
 *
 * 支持：
 *  - 方向声明 flowchart TD|TB|BT|LR|RL / graph LR
 *  - 节点形状 [text] (text) {text} [[text]] [(text)] ((text)) ([text]) {{text}} [/text/] [\text\]
 *  - 连边 --> --- ==> -.-> <-- 以及链式 A --> B --> C
 *  - 边标签 A -->|yes| B / A -- yes --> B
 *  - subgraph 块、end、direction
 *  - classDef / class / style / linkStyle
 *  - %% 注释与 ; 语句分隔
 */
import { Token, tokenize, stripComments } from '../lexer';
import {
  FlowchartAST, FlowDir, FlowNode, FlowEdge, FlowSubgraph, FlowClassDef, ParseError,
} from '../ast';

/** 形状开闭配对 */
const SHAPE_PAIR: Record<string, string> = {
  '[': ']', '(': ')', '{': '}', '[[': ']]', '((': '))',
  '[(': ')]', '([': ')]', '[/': '/]', '[\\': '\\]', '{{': '}}',
};

/** 按开符号映射到节点形状 */
function shapeOf(open: string): FlowNode['shape'] {
  switch (open) {
    case '[': return 'process';
    case '(': return 'stadium';
    case '{': return 'diamond';
    case '[[': return 'subroutine';
    case '[(': return 'cylinder';
    case '((': return 'circle';
    case '([': return 'stadium';
    case '{{': return 'hexagon';
    case '[/': return 'parallelogram';
    case '[\\': return 'parallelogramInv';
    default: return 'process';
  }
}

/** 是否"词"型 token（可作 id / 文本） */
function isWord(t?: Token): t is Token {
  return !!t && (t.kind === 'ident' || t.kind === 'num' || t.kind === 'str');
}

/** 把词数组拼成可读文本：词-词间加空格，符号两侧贴紧 */
function joinParts(parts: string[]): string {
  let out = '';
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === 0) { out = p; continue; }
    const prev = parts[i - 1];
    const sticky = (s: string) => /^[#.,:;!?)\]}\-~+=|&<>/\\]$/.test(s);
    out += sticky(prev) || sticky(p) ? p : ' ' + p;
  }
  return out.trim();
}

/** 箭头是否带"头部"（有指向），用于区分 -- text --> 标签写法 */
function arrowHasHead(a: string): boolean {
  return /[>x)<]/.test(a);
}

/** 由箭头原文推导边样式 */
function arrowStyle(a: string): { kind: FlowEdge['kind']; arrow: FlowEdge['arrow'] } {
  const thick = a.includes('=');
  const dotted = a.includes('.');
  const none = !arrowHasHead(a);
  const kind: FlowEdge['kind'] = thick ? 'thick' : dotted ? 'dotted' : 'solid';
  const arrow: FlowEdge['arrow'] = none ? 'none' : a.includes('<') ? 'both' : 'forward';
  return { kind, arrow };
}

/** 解析器 */
class FlowParser {
  private nodes = new Map<string, FlowNode>();
  private edges: FlowEdge[] = [];
  private subgraphs: FlowSubgraph[] = [];
  private classDefs: FlowClassDef[] = [];
  private linkStyles: Record<number, Record<string, string>> = {};
  private errors: ParseError[] = [];
  private dir: FlowDir = 'TD';
  private subStack: string[] = [];

  /** 确保节点存在；可选补充形状/文本/分组 */
  private ensureNode(id: string, shape?: FlowNode['shape'], text?: string): FlowNode {
    let n = this.nodes.get(id);
    if (!n) {
      n = { id, text: text ?? id, shape: shape ?? 'process' };
      const g = this.subStack[this.subStack.length - 1];
      if (g) {
        n.group = g;
        const sg = this.subgraphs.find(s => s.id === g);
        if (sg && !sg.nodes.includes(id)) sg.nodes.push(id);
      }
      this.nodes.set(id, n);
      return n;
    }
    if (shape && shape !== 'process') n.shape = shape;
    if (text && (!n.text || n.text === id)) n.text = text;
    return n;
  }

  /** 从 stmt[i]（形状开符号处）解析形状与文本，返回下一位置 */
  private parseShapeTail(stmt: Token[], i: number, id: string): number {
    const openTok = stmt[i];
    const close = SHAPE_PAIR[openTok.value];
    let j = i + 1;
    const parts: string[] = [];
    let matched = false;
    while (j < stmt.length) {
      if (stmt[j].value === close && (stmt[j].kind === 'shapeClose' || close === stmt[j].value)) {
        matched = true; j++; break;
      }
      parts.push(stmt[j].value);
      j++;
    }
    if (!matched) this.errors.push({ line: openTok.line, message: `节点 ${id} 形状未闭合` });
    this.ensureNode(id, shapeOf(openTok.value), parts.length ? joinParts(parts) : undefined);
    return j;
  }

  /** 从 stmt[i] 解析 id+形状定义（如 A[标题]），返回 id 与下一位置 */
  private parseNodeDefAt(stmt: Token[], i: number): { id: string; next: number } {
    const id = stmt[i].value;
    const next = this.parseShapeTail(stmt, i + 1, id);
    return { id, next };
  }

  /**
   * 解析一条边链语句（可能含多个箭头）。
   * @param stmt 语句 token 列表（不含换行）
   */
  private parseEdgeStmt(stmt: Token[]): void {
    let i = 0;
    // 起点：可能是节点定义，也可能是裸 id
    let sourceId: string;
    if (isWord(stmt[0]) && stmt[1]?.kind === 'shapeOpen') {
      const r = this.parseNodeDefAt(stmt, 0);
      sourceId = r.id;
      i = r.next;
    } else if (isWord(stmt[0])) {
      sourceId = stmt[0].value;
      this.ensureNode(sourceId);
      i = 1;
    } else {
      return;
    }

    while (i < stmt.length && stmt[i].kind === 'arrow') {
      const arrowTok = stmt[i];
      let arrowVal = arrowTok.value;
      i++;
      let label: string | undefined;

      // 形式一：箭头后紧跟 |label| 或 :label 或引号串
      const t1 = stmt[i];
      if (t1 && t1.kind === 'punct' && (t1.value === '|' || t1.value === ':')) {
        const close = t1.value;
        i++;
        const parts: string[] = [];
        while (i < stmt.length && !(stmt[i].kind === 'punct' && stmt[i].value === close)) {
          parts.push(stmt[i].value);
          i++;
        }
        if (i < stmt.length) i++; // 跳过闭合分隔符
        label = joinParts(parts) || undefined;
      } else if (t1 && t1.kind === 'str') {
        label = t1.value;
        i++;
      } else if (!arrowHasHead(arrowVal)) {
        // 形式二：-- text --> target（无头箭头 + 后续还有箭头 ⇒ 中间词为标签）
        let k = i;
        while (k < stmt.length && stmt[k].kind !== 'arrow') k++;
        if (k < stmt.length && k > i) {
          const parts = stmt.slice(i, k).map(t => t.value);
          label = joinParts(parts) || undefined;
          arrowVal = stmt[k].value; // 用带头部的完整箭头样式
          i = k + 1;
        }
      }

      // 目标 id
      if (!isWord(stmt[i])) {
        this.errors.push({ line: arrowTok.line, message: `连边缺少目标节点（${sourceId} 之后）` });
        return;
      }
      const toId = stmt[i].value;
      i++;
      // 目标可能带形状定义：B{判断}
      if (stmt[i]?.kind === 'shapeOpen') {
        i = this.parseShapeTail(stmt, i, toId);
      } else {
        this.ensureNode(toId);
      }

      const { kind, arrow } = arrowStyle(arrowVal);
      this.edges.push({ from: sourceId, to: toId, kind, arrow, label });
      sourceId = toId; // 链式连边
    }
  }

  /** subgraph one[标题] / subgraph 标题 */
  private parseSubgraphStmt(stmt: Token[]): void {
    const id = isWord(stmt[1]) ? stmt[1].value : undefined;
    let i = id ? 2 : 1;
    let title = id ?? '';
    if (stmt[i]?.kind === 'shapeOpen') {
      const close = SHAPE_PAIR[stmt[i].value];
      i++;
      const parts: string[] = [];
      while (i < stmt.length && stmt[i].value !== close) { parts.push(stmt[i].value); i++; }
      if (i < stmt.length) i++;
      title = joinParts(parts) || title;
    }
    const sgId = id ?? `sg${this.subgraphs.length}`;
    this.subgraphs.push({ id: sgId, title: title || sgId, nodes: [] });
    this.subStack.push(sgId);
  }

  /** 解析 prop:value,... 序列（style/classDef/linkStyle 共用） */
  private parseProps(stmt: Token[], start: number): Record<string, string> {
    const props: Record<string, string> = {};
    let i = start;
    while (i < stmt.length) {
      if (stmt[i].kind === 'ident') {
        const key = stmt[i].value;
        if (stmt[i + 1]?.value === ':') {
          i += 2;
          const parts: string[] = [];
          while (i < stmt.length && !(stmt[i].kind === 'punct' && (stmt[i].value === ',' || stmt[i].value === ';'))) {
            parts.push(stmt[i].value);
            i++;
          }
          props[key] = joinParts(parts);
        } else {
          i++;
        }
      } else {
        i++;
      }
      // 跳过逗号分隔符
      if (i < stmt.length && stmt[i].kind === 'punct' && stmt[i].value === ',') i++;
    }
    return props;
  }

  /** classDef name fill:... stroke:... */
  private parseClassDefStmt(stmt: Token[]): void {
    if (!isWord(stmt[1])) return;
    const name = stmt[1].value;
    const props = this.parseProps(stmt, 2);
    const def: FlowClassDef = { name, ...props } as FlowClassDef;
    this.classDefs.push(def);
  }

  /** style A fill:#fff,stroke:#000 */
  private parseStyleStmt(stmt: Token[]): void {
    if (!isWord(stmt[1])) return;
    const id = stmt[1].value;
    const props = this.parseProps(stmt, 2);
    const n = this.ensureNode(id);
    n.styleProps = { ...(n.styleProps ?? {}), ...props };
  }

  /** class A,B className */
  private parseClassAssignStmt(stmt: Token[]): void {
    // `class A,B cls`：逗号是独立 punct token，故收集全部词型 token，
    // 最后一个词是类名，其余都是节点 id。
    const words = stmt.slice(1).filter(t => t.kind === 'ident').map(t => t.value);
    if (words.length < 2) return;
    const className = words[words.length - 1];
    for (const id of words.slice(0, -1)) {
      const n = this.ensureNode(id);
      (n.style ??= []).push(className);
    }
  }

  /** linkStyle 0,1 stroke:#f00 */
  private parseLinkStyleStmt(stmt: Token[]): void {
    // 收集序号
    const idxs: number[] = [];
    let i = 1;
    while (i < stmt.length && (stmt[i].kind === 'num' || stmt[i].value === ',')) {
      if (stmt[i].kind === 'num') idxs.push(parseInt(stmt[i].value, 10));
      i++;
    }
    const props = this.parseProps(stmt, i);
    for (const idx of idxs) {
      this.linkStyles[idx] = { ...(this.linkStyles[idx] ?? {}), ...props };
      if (this.edges[idx]) this.edges[idx].styleKey = idx;
    }
  }

  /** 处理一条语句（已按 ; 切分，不含换行） */
  private parseStatement(stmt: Token[]): void {
    if (!stmt.length) return;
    const t0 = stmt[0];
    if (t0.kind === 'ident') {
      switch (t0.value) {
        case 'subgraph': this.parseSubgraphStmt(stmt); return;
        case 'end':
          if (this.subStack.length) { this.subStack.pop(); return; }
          break;
        case 'classDef': this.parseClassDefStmt(stmt); return;
        case 'linkStyle': this.parseLinkStyleStmt(stmt); return;
        case 'class': this.parseClassAssignStmt(stmt); return;
        case 'style': this.parseStyleStmt(stmt); return;
        case 'direction': return; // 子图内方向（渲染阶段可扩展）
        case 'flowchart':
        case 'graph':
        case 'title':
        case 'click':
        case 'accTitle':
        case 'accDescr':
        case 'subGraph':
          return;
        default: break;
      }
    }
    this.parseEdgeStmt(stmt);
  }

  /** 把 token 流切成语句：换行与 ; 为分隔，注释已剥离 */
  private splitStatements(toks: Token[]): Token[][] {
    const stmts: Token[][] = [];
    let cur: Token[] = [];
    for (const t of toks) {
      if (t.kind === 'newline' || t.kind === 'eof') {
        if (cur.length) { stmts.push(cur); cur = []; }
      } else if (t.kind === 'punct' && t.value === ';') {
        if (cur.length) { stmts.push(cur); cur = []; }
      } else if (t.kind !== 'ws') {
        cur.push(t);
      }
    }
    return stmts;
  }

  /** 主入口 */
  parse(src: string): FlowchartAST {
    const toks = stripComments(tokenize(src));
    const stmts = this.splitStatements(toks);
    let first = true;
    for (const stmt of stmts) {
      if (first) {
        first = false;
        const kw = stmt[0]?.value;
        if (kw === 'flowchart' || kw === 'graph') {
          // 方向关键字
          const d = stmt[1]?.value?.toUpperCase();
          if (d && /^(TD|TB|BT|LR|RL|DU|UD)$/.test(d)) this.dir = d as FlowDir;
          continue; // 整行即方向声明（罕见情况方向后还有语句则忽略剩余）
        }
        // 无方向声明，默认 TD
      }
      this.parseStatement(stmt);
    }
    return {
      kind: 'flowchart',
      dir: this.dir,
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
      subgraphs: this.subgraphs,
      classDefs: this.classDefs,
      linkStyles: this.linkStyles,
    };
  }
}

/** 判断 DSL 首行类型是否为 flowchart */
export function isFlowchart(text: string): boolean {
  const firstLine = text.split('\n')[0].trim();
  return /^(flowchart|graph)\b/i.test(firstLine);
}

/** 解析 flowchart DSL 文本 */
export function parseFlowchart(src: string): FlowchartAST {
  return new FlowParser().parse(src);
}