/**
 * Mermaid block-beta（block）语法分析器。
 *
 * 支持：
 *  - 头行 `block-beta` / `block`
 *  - `columns N` 列数声明（缺省 = 第一行块数，由解析器补齐）
 *  - 块 `id["标签"]`、`id:span`、`id["标签"]:span`（span 附加在行尾）
 *  - 占位 `space` / `space:k`
 *  - 括号形状（容错）：`(…) stadium`、`((…)) circle`、`{…} diamond`、
 *    `[[…]] subroutine`、`{{…}} hexagon`、`[(…)] cylinder`
 *  - 嵌套块 `父 {` … `}`（多行）→ groups（start/end 为 cells 中的成员区间）
 *  - 边 `a --> b`、`a --- b`、`a -- 文本 --> b`、`a -- 文本 --- b`
 *  - `%%` 注释跳过、未知行忽略、解析不抛错
 *
 * AST 原生字段不含嵌套组信息，故在本文件内扩展 `BlockASTX`（groups）。
 */
import { BlockAST, BlockCell, FlowShape } from '../ast';

/** 嵌套组：members = cells[start, end)（按书写顺序） */
export interface BlockGroup {
  id: string;
  label?: string;
  start: number;
  end: number;
}

/** block AST 扩展（附加 groups，其余与 BlockAST 一致） */
export interface BlockASTX extends BlockAST {
  groups: BlockGroup[];
}

/** 开括号 → [闭括号, 形状] */
const BRACKETS: [string, string, FlowShape][] = [
  ['[[', ']]', 'subroutine'],
  ['((', '))', 'circle'],
  ['{{', '}}', 'hexagon'],
  ['[(', ')]', 'cylinder'],
  ['[', ']', 'process'],
  ['(', ')', 'stadium'],
  ['{', '}', 'diamond'],
];

function unquote(s: string): string {
  const m = /^(['"`])([\s\S]*)\1$/.exec(s);
  return m ? m[2] : s;
}

/** 解析一行边（无括号的行才调用） */
function parseEdge(line: string): BlockAST['edges'][number] | null {
  if (line.includes('[') || line.includes(']') || line.includes('(') ||
      line.includes(')') || line.includes('{') || line.includes('}')) return null;
  // a -- 文本 --> b / a -- 文本 --- b
  let m = /^(\S+)\s+--\s+(.+?)\s+(-->|---)\s*(\S+)$/.exec(line);
  if (m) return { from: m[1], to: m[4], arrow: m[3] === '-->', label: m[2].trim() };
  // a --> b / a --- b（含粘连 a-->b）
  m = /^(\S+)\s*(-->|---)\s*(\S+)$/.exec(line);
  if (m) return { from: m[1], to: m[3], arrow: m[2] === '-->' };
  return null;
}

interface GroupFrame {
  id: string;
  label?: string;
  start: number;
}

/** 关闭最内层组 */
function closeGroup(stack: GroupFrame[], groups: BlockGroup[], cellIdx: number): void {
  const g = stack.pop();
  if (!g) return;
  if (cellIdx > g.start) {
    const out: BlockGroup = { id: g.id, start: g.start, end: cellIdx };
    if (g.label !== undefined) out.label = g.label;
    groups.push(out);
  }
}

/** 扫描一行块声明（可产出多个 cell / 组开 / 组闭） */
function scanLine(
  line: string,
  cells: BlockCell[],
  stack: GroupFrame[],
  groups: BlockGroup[]
): void {
  const n = line.length;
  let i = 0;
  while (i < n) {
    while (i < n && /\s/.test(line[i])) i++;
    if (i >= n) break;

    // 组收尾
    if (line[i] === '}') {
      closeGroup(stack, groups, cells.length);
      i++;
      continue;
    }

    // space 占位
    const sp = /^space(?::(\d+))?/.exec(line.slice(i));
    if (sp) {
      const nx = line[i + sp[0].length];
      if (nx === undefined || /[\s}]/.test(nx)) {
        const k = sp[1] ? Math.max(1, parseInt(sp[1], 10)) : 1;
        cells.push({ space: k });
        i += sp[0].length;
        continue;
      }
    }

    // id
    const idm = /^[^\s[\](){}:]+/.exec(line.slice(i));
    if (!idm) {
      i++;
      continue;
    }
    const id = idm[0];
    i += idm[0].length;

    let label: string | undefined;
    let shape: FlowShape | undefined;
    let span: number | undefined;
    let opened = false;

    // 行尾 '{' ⇒ 嵌套组开
    if (line.slice(i).trim() === '{') {
      stack.push({ id, label, start: cells.length });
      opened = true;
      i = n;
    }

    if (!opened) {
      // 标签括号
      for (const [o, c, sh] of BRACKETS) {
        if (!line.startsWith(o, i)) continue;
        const closeIdx = line.indexOf(c, i + o.length);
        if (closeIdx >= 0) {
          label = unquote(line.slice(i + o.length, closeIdx).trim());
          shape = sh;
          i = closeIdx + c.length;
        } else if (o === '{') {
          // 未闭合 '{'：按组开处理
          stack.push({ id, start: cells.length });
          opened = true;
          i = n;
        } else {
          i += o.length;
        }
        break;
      }
    }

    if (!opened) {
      // span
      const sm = /^:(\d+)/.exec(line.slice(i));
      if (sm) {
        span = Math.max(1, parseInt(sm[1], 10));
        i += sm[0].length;
      }
      // 括号/ span 之后的行尾 '{' ⇒ 嵌套组开（带标签）
      if (line.slice(i).trim() === '{') {
        stack.push({ id, label, start: cells.length });
        opened = true;
        i = n;
      }
    }

    if (opened) continue;

    const cell: BlockCell = { id };
    if (label !== undefined) cell.label = label;
    if (shape !== undefined) cell.shape = shape;
    if (span !== undefined) cell.span = span;
    cells.push(cell);
  }
}

/** 判断是否 block / block-beta */
export function isBlock(text: string): boolean {
  return /^block\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 block DSL */
export function parseBlock(src: string): BlockASTX {
  const cells: BlockCell[] = [];
  const edges: BlockAST['edges'] = [];
  const groups: BlockGroup[] = [];
  const stack: GroupFrame[] = [];
  let columns: number | undefined;
  let firstLineCells = 0;
  let firstLineDone = false;
  let headerSeen = false;
  let guard = 0;

  const lines = src.split(/\r?\n/);
  for (const raw of lines) {
    if (guard++ > 5000) break;
    const line = raw.replace(/%%.*$/, '').trim();
    if (!line) continue;

    if (!headerSeen) {
      headerSeen = true;
      if (/^block(?:-beta)?\b/i.test(line)) continue;
    }

    const cm = /^columns\s+(\d+)\s*$/i.exec(line);
    if (cm) {
      columns = Math.max(1, parseInt(cm[1], 10));
      continue;
    }

    const edge = parseEdge(line);
    if (edge) {
      edges.push(edge);
      continue;
    }

    const before = cells.length;
    scanLine(line, cells, stack, groups);
    const added = cells.length - before;
    if (added > 0 && !firstLineDone) {
      firstLineCells = added;
      firstLineDone = true;
    }
  }
  // 未闭合的组
  while (stack.length) closeGroup(stack, groups, cells.length);

  if (columns === undefined && firstLineCells > 0) columns = firstLineCells;

  const ast: BlockASTX = { kind: 'block', cells, edges, groups };
  if (columns !== undefined) ast.columns = columns;
  return ast;
}
