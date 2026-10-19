/**
 * packet AST → GoJS 模型数据映射。
 *
 * 位条网格布局（坐标全部在此算好）：
 *  - 按 bitsPerRow=32 折行，每行内位号连续（第 1 行 0-31、第 2 行 32-63 …）
 *  - 跨行字段按行边界切分单元；与前一字段重叠时单调游标规整（start 只向后推）
 *  - 行外刻度位号 0/8/16/24/31（加行基值）
 *  - 单元宽 = 位宽 × 每位像素宽，白底黑边
 */
import { PacketAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const BITS_PER_ROW = 32;
const BIT_W = 16;      // 每位像素宽
const ROW_H = 34;      // 行高
const ROW_GAP = 30;    // 行间距（含刻度空间）
const GRID_X = 56;     // 网格左边界
const GRID_Y = 48;     // 第一行 Y

/** 映射后的节点数据 */
export interface MappedPacketNode {
  key: string;
  category: 'PCell' | 'PTick';
  loc: string;
  text?: string;
  fill?: string;
  stroke?: string;
  w?: number;
  h?: number;
}

/** 主入口 */
export function mapPacket(
  ast: PacketAST,
  _theme: MermaidTheme = defaultTheme
): { nodes: MappedPacketNode[] } {
  const nodes: MappedPacketNode[] = [];
  const fields = ast.fields ?? [];
  if (fields.length === 0) return { nodes };

  // 单调游标规整：start 只向后推，消除重叠/倒置
  let cursor = 0;
  const norm: { start: number; end: number; label: string }[] = [];
  for (const f of fields) {
    let s = Math.min(f.start, f.end);
    let e = Math.max(f.start, f.end);
    if (s < cursor) s = cursor;
    if (e < s) e = s;
    norm.push({ start: s, end: e, label: f.label });
    cursor = e + 1;
  }

  // 按行切分单元
  for (const f of norm) {
    const row0 = Math.floor(f.start / BITS_PER_ROW);
    const row1 = Math.floor(f.end / BITS_PER_ROW);
    for (let r = row0; r <= row1; r++) {
      const base = r * BITS_PER_ROW;
      const cs = Math.max(f.start, base);
      const ce = Math.min(f.end, base + BITS_PER_ROW - 1);
      const bits = ce - cs + 1;
      const x = GRID_X + (cs - base) * BIT_W;
      const y = GRID_Y + r * (ROW_H + ROW_GAP);
      nodes.push({
        key: `cell_${f.label}_${r}_${cs}`,
        category: 'PCell',
        text: f.label,
        loc: `${x} ${y}`,
        fill: '#ffffff',
        stroke: '#000000',
        w: bits * BIT_W, h: ROW_H,
      });
    }
  }

  // 刻度位号（每行 0/8/16/24/31 + 行基值）
  const maxEnd = norm.reduce((m, f) => Math.max(m, f.end), 0);
  const lastRow = Math.floor(maxEnd / BITS_PER_ROW);
  for (let r = 0; r <= lastRow; r++) {
    const base = r * BITS_PER_ROW;
    const y = GRID_Y + r * (ROW_H + ROW_GAP) - 18;
    for (const b of [0, 8, 16, 24, 31]) {
      const x = GRID_X + b * BIT_W - 8;
      nodes.push({
        key: `tick_${r}_${b}`,
        category: 'PTick',
        text: String(base + b),
        loc: `${x} ${y}`,
      });
    }
  }

  return { nodes };
}
