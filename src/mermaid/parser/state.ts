/**
 * Mermaid stateDiagram(-v2) 语法分析器。
 *
 * 支持：
 *  - 状态声明 `state "名称" as S` / `state S { ... }` / 裸 `S : 名称`
 *  - 起止 `[*]` 起点 / `[*]` 终点
 *  - 迁移 `S1 --> S2 : 标签`
 *  - 嵌套状态（composite）简单支持
 */
import { Token, tokenize, stripComments, smartJoin } from '../lexer';
import { StateAST, StateNode, StateTransition, ParseError } from '../ast';

class StateParser {
  private toks: Token[];
  private pos = 0;
  private states = new Map<string, StateNode>();
  private transitions: StateTransition[] = [];
  private errors: ParseError[] = [];

  constructor(toks: Token[]) { this.toks = toks; }

  private peek(o = 0): Token { return this.toks[Math.min(this.pos + o, this.toks.length - 1)]; }
  private next(): Token { const t = this.toks[this.pos]; if (this.pos < this.toks.length - 1) this.pos++; return t; }
  private atEol(): boolean { const k = this.peek().kind; return k === 'newline' || k === 'eof'; }
  private skipEol(): void { while (this.peek().kind === 'newline') this.next(); }
  private readLine(): string {
    const toks: Token[] = [];
    while (!this.atEol()) toks.push(this.next());
    return smartJoin(toks).trim();
  }

  private ensureState(id: string, label?: string): StateNode {
    let s = this.states.get(id);
    if (!s) {
      s = { id, label: label ?? id, isStart: id === '[*]', isEnd: false };
      this.states.set(id, s);
    } else if (label) s.label = label;
    return s;
  }

  parse(): StateAST {
    this.skipEol();
    // 跳过类型头行 stateDiagram(-v2)
    if (this.peek().kind === 'ident' && /^stateDiagram(-v2)?$/i.test(this.peek().value)) {
      this.next();
      this.readLine();
    }
    let guard = 0;
    while (this.peek().kind !== 'eof' && guard++ < 5000) {
      const t = this.peek();
      if (t.kind === 'newline') { this.next(); continue; }
      if (t.kind === 'ws') { this.next(); continue; } // 跳过缩进/空白

      if (t.kind === 'ident' && t.value === 'title') { this.next(); this.readLine(); continue; }

      // state 声明在 token 级处理（引号别名经 lexer 后丢失引号，readLine 无法还原）
      if (t.kind === 'ident' && t.value === 'state') {
        this.parseStateDecl();
        continue;
      }

      // 整行解析
      const line = this.readLine().trim();
      if (!line) continue;
      this.handleLine(line);
    }
    // 结束态：作为目标出现的 [*]
    for (const s of this.states.values()) {
      if (s.id === '[*]' && this.transitions.some(tr => tr.to === '[*]')) s.isEnd = true;
    }
    return { kind: 'state', states: Array.from(this.states.values()), transitions: this.transitions };
  }

  /** 解析 state 声明（token 级）：state "标签" as S / state S / state S { */
  private parseStateDecl(): void {
    this.next(); // 'state'
    while (this.peek().kind === 'ws') this.next();
    const t1 = this.peek();
    if (t1.kind === 'str') {
      const label = t1.value;
      this.next();
      while (this.peek().kind === 'ws') this.next();
      if (this.peek().value === 'as') {
        this.next();
        while (this.peek().kind === 'ws') this.next();
        const id = this.atEol() ? label : this.next().value;
        this.ensureState(id, label);
      } else {
        this.ensureState(label, label);
      }
    } else if (t1.kind === 'ident') {
      const id = t1.value;
      this.next();
      while (this.peek().kind === 'ws') this.next();
      if (this.peek().value === 'as') {
        this.next();
        while (this.peek().kind === 'ws') this.next();
        const lbl = this.atEol() ? id : this.next().value;
        this.ensureState(id, lbl);
      } else {
        this.ensureState(id);
      }
    }
    this.readLine(); // 消费行内剩余（如 { ）
  }

  private handleLine(line: string): void {
    // 迁移：from --> to [: label]
    const arrowIdx = line.indexOf('-->');
    if (arrowIdx >= 0) {
      let left = line.slice(0, arrowIdx).trim();
      let right = line.slice(arrowIdx + 3).trim();
      let label: string | undefined;
      const cIdx = right.indexOf(':');
      if (cIdx >= 0) { label = right.slice(cIdx + 1).trim(); right = right.slice(0, cIdx).trim(); }
      else { const lc = left.indexOf(':'); if (lc >= 0) { label = left.slice(lc + 1).trim(); left = left.slice(0, lc).trim(); } }
      const from = left.split(/\s+/)[0];
      const to = right.split(/\s+/)[0];
      if (from && to) {
        // from 可能是 state 定义的一部分：`state A as X --> ...`（罕见，忽略）
        if (from !== 'state') {
          this.ensureState(from);
          this.ensureState(to);
          this.transitions.push({ from, to, label: label || undefined });
        }
        return;
      }
    }

    // state 声明：state "名称" as S / state S / state S { }
    if (/^state\s/.test(line)) {
      const m = /^state\s+(?:"([^"]+)"|'([^']+)')\s+as\s+([A-Za-z0-9_\u4e00-\u9fa5]\w*)/.exec(line)
        ?? /^state\s+([A-Za-z0-9_\u4e00-\u9fa5]\w*)(?:\s*\{)?/.exec(line);
      if (m) {
        const label = m[1] ?? m[2];
        const id = m[3] ?? m[1];
        this.ensureState(id, label !== id ? label : id);
        return;
      }
    }

    // 裸 `S : 名称` 描述
    const desc = /^([A-Za-z0-9_\u4e00-\u9fa5]\w*)\s*:\s*(.+)$/.exec(line);
    if (desc) {
      this.ensureState(desc[1], desc[2].trim());
      return;
    }

    // 裸状态 id（单独一行，声明存在）
    if (/^[A-Za-z0-9_\u4e00-\u9fa5]\w*$/.test(line) || line === '[*]') {
      this.ensureState(line);
      return;
    }
  }
}

/** 判断是否 stateDiagram */
export function isState(text: string): boolean {
  return /^stateDiagram(-v2)?\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 stateDiagram DSL */
export function parseState(src: string): StateAST {
  return new StateParser(stripComments(tokenize(src))).parse();
}