/**
 * sequence AST → GoJS 模型数据映射（对齐官方 sequenceDiagram.html 模型语义）。
 *
 * 输出即 GraphLinksModel 的 nodeDataArray/linkDataArray 数据：
 * - 参与者 → 生命线节点（顶部标题 + 向下生命线，生命线为连线端口）
 * - 消息   → 连线数据（row=行号，MessageLink 模板据此把端点钉在行心 Y）
 * - note / 激活盒 → 独立节点；按 DSL 行号把消息与 note 交错分配行
 *
 * 布局为确定性手动定位（时序图无图布局）：坐标全部在此算好，渲染层只建模板。
 */
import { SequenceAST } from '../ast';

const COL_W = 170;      // 参与者列宽（mapSequence 里按最长别名自适应，此为回退默认）
export const SEQ_TOP_H = 64; // 顶部标题区高度（模板的生命线长度换算复用）
const MSG_H = 48;       // 每行（消息/note）行高
const ACT_W = 12;       // 激活盒宽度
const ACT_PAD = 8;      // 激活盒上下留白（对齐官方 ActivityStart/End 紧贴消息线）
const MARGIN = 40;
const MIN_COL_W = 180;  // 参与者列宽底线
const COL_PAD = 36;     // 列内两侧留白

/** 估算文本像素宽（CJK≈1em，latin≈0.55em，em=13px） */
function textW(s: string, em = 13): number {
  let w = 0;
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    w += (c >= 0x2e80 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) ? em : em * 0.55;
  }
  return w;
}

/** 参与者 X 中心（colW 由 mapSequence 计算后传入；缺省用 COL_W） */
export function seqColX(index: number, colW: number = COL_W): number {
  return MARGIN + colW * index + colW / 2;
}

/** 行中心 Y（消息线的精确 Y；MessageLink 模板复用） */
export function seqRowY(row: number): number {
  return SEQ_TOP_H + MSG_H * (row + 1) + MARGIN / 2;
}

/** 激活盒宽度（MessageLink 端点贴盒边缘时复用） */
export const SEQ_ACT_W = ACT_W;

/** mermaid 箭头语法 → toArrow 图形名 */
function arrowFigure(arrow: string): string {
  if (arrow.includes('x')) return 'OpenTriangleLine';
  if (arrow.includes(')')) return 'Circle';
  if (arrow.includes('>>')) return 'Triangle';
  return 'OpenTriangle';
}

/** 映射后的节点数据 */
export interface MappedSeqNode {
  key: string;
  category: 'participant' | 'actor' | 'note' | 'activation';
  loc: string;
  text?: string;
  lineTo?: number; // 生命线长度（participant/actor）
  h?: number;      // 激活盒高度
}

/** 映射后的连线数据 */
export interface MappedSeqLink {
  key: string;
  from: string;
  to: string;
  row: number;     // 消息所在行号（模板按 seqRowY(row) 定位端点 Y）
  fromAct: boolean; // 两端在该行是否被激活（贴激活盒边缘）
  toAct: boolean;
  dashed: boolean;
  arrow: string;   // toArrow 图形名
  text: string;
}

/** 映射结果 */
export interface MappedSequence {
  nodes: MappedSeqNode[];
  links: MappedSeqLink[];
  /** 实际使用的参与者列宽（render 侧如需要可按此换算/复用） */
  colW: number;
}

/** 主入口 */
export function mapSequence(ast: SequenceAST): MappedSequence {
  const parts = ast.participants;
  const colIndex = new Map<string, number>();
  parts.forEach((p, i) => colIndex.set(p.id, i));

  // 参与者列宽自适应：按最长别名撑开，避免长名溢出到相邻列
  const colW = Math.max(MIN_COL_W, parts.reduce((m, p) => Math.max(m, textW(p.alias, 13) + COL_PAD), 0));

  // 按 DSL 行号把消息与 note 交错分配行（保持原始顺序）
  const rowOfMsg = new Map<number, number>();
  const rowOfNote = new Map<number, number>();
  type SeqEv = { kind: 'msg' | 'note'; idx: number; line: number };
  const events: SeqEv[] = [];
  ast.messages.forEach((m, i) => events.push({ kind: 'msg', idx: i, line: m.line }));
  ast.notes.forEach((n, i) => events.push({ kind: 'note', idx: i, line: n.line }));
  events.sort((a, b) => a.line - b.line);
  let r = 0;
  for (const ev of events) {
    if (ev.kind === 'msg') rowOfMsg.set(ev.idx, r++);
    else rowOfNote.set(ev.idx, r++);
  }
  const totalRows = Math.max(r, 1);
  const totalH = SEQ_TOP_H + MSG_H * totalRows + MARGIN;

  const rowOfEvent = (ev: SeqEv): number =>
    ev.kind === 'msg' ? rowOfMsg.get(ev.idx)! : rowOfNote.get(ev.idx)!;

  const nodes: MappedSeqNode[] = [];

  // 参与者 → 生命线节点
  for (const p of parts) {
    const x = seqColX(colIndex.get(p.id)!, colW);
    nodes.push({
      key: p.id,
      category: p.type,
      loc: `${x} ${MARGIN}`,
      text: p.alias,
      lineTo: totalH,
    });
  }

  // 激活区间（actor → 行区间），并生成激活盒节点
  const actRanges = new Map<string, { startRow: number; endRow: number }[]>();
  const activeStart = new Map<string, number>();
  for (const a of ast.activations) {
    if (a.activate) {
      if (!activeStart.has(a.actor)) activeStart.set(a.actor, a.line);
    } else {
      const startLine = activeStart.get(a.actor);
      if (startLine === undefined) continue;
      activeStart.delete(a.actor);
      // 起始行 = startLine 之后第一行；结束行 = a.line 之前最后一行
      let startRow = -1;
      let endRow = -1;
      for (const ev of events) {
        if (ev.line > startLine && startRow === -1) startRow = rowOfEvent(ev);
        if (ev.line < a.line) endRow = rowOfEvent(ev);
      }
      if (startRow === -1) startRow = endRow;
      if (endRow === -1) endRow = startRow;
      if (startRow < 0 || endRow < 0) continue;
      const lo = Math.min(startRow, endRow);
      const hi = Math.max(startRow, endRow);
      const list = actRanges.get(a.actor) ?? [];
      list.push({ startRow: lo, endRow: hi });
      actRanges.set(a.actor, list);
      const ci = colIndex.get(a.actor);
      if (ci === undefined) continue;
      nodes.push({
        key: `__act_${a.actor}_${a.line}`,
        category: 'activation',
        loc: `${seqColX(ci, colW)} ${seqRowY(lo) - ACT_PAD}`,
        h: (hi - lo) * MSG_H + 2 * ACT_PAD,
      });
    }
  }

  function rowActive(actor: string, row: number): boolean {
    const rs = actRanges.get(actor);
    if (rs === undefined) return false;
    return rs.some((rr) => row >= rr.startRow && row <= rr.endRow);
  }

  // 消息 → 连线数据
  const links: MappedSeqLink[] = [];
  for (let mi = 0; mi < ast.messages.length; mi++) {
    const m = ast.messages[mi];
    if (!colIndex.has(m.from) || !colIndex.has(m.to)) continue;
    const row = rowOfMsg.get(mi)!;
    links.push({
      key: `__msg_${mi}`,
      from: m.from,
      to: m.to,
      row,
      fromAct: rowActive(m.from, row),
      toAct: rowActive(m.to, row),
      dashed: m.arrow.startsWith('--'),
      arrow: arrowFigure(m.arrow),
      text: m.label,
    });
  }

  // note 节点
  for (let ni = 0; ni < ast.notes.length; ni++) {
    const nt = ast.notes[ni];
    if (nt.kind !== 'note') continue;
    const actors = nt.actors ?? [];
    let cx = seqColX(parts.length - 1, colW);
    if (actors.length) {
      const idxs = actors.map((a) => colIndex.get(a)).filter((v) => v !== undefined) as number[];
      if (idxs.length) cx = (seqColX(Math.min(...idxs), colW) + seqColX(Math.max(...idxs), colW)) / 2;
    }
    nodes.push({
      key: `__note_${ni}`,
      category: 'note',
      text: nt.text ?? '',
      loc: `${cx} ${seqRowY(rowOfNote.get(ni)!)}`,
    });
  }

  return { nodes, links, colW };
}
