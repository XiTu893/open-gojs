/**
 * block-beta AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：按 cells 顺序做网格填充（span/space 占多列），列宽取该列最宽块
 * （span 块按宽度/列数摊分，列宽有下限），行高有下限；嵌套组由 parser 的
 * groups（成员区间）反推包围盒并外扩成 GroupBox 节点（渲染层垫底）。
 * 配色只取 theme：块用 categories.process，组盒用 categories.group。
 */
import { BlockCell, FlowShape } from '../ast';
import { BlockASTX, BlockGroup } from '../parser/block';
import { MermaidTheme, defaultTheme } from '../themes';

const MARGIN = 32;
const H_GAP = 28;
const V_GAP = 44;
const MIN_COL_W = 72;
const MIN_ROW_H = 44;
const GB_PAD_X = 14;
const GB_TITLE = 26;
const GB_PAD_B = 14;

/** 映射后的节点数据（块与组盒） */
export interface MappedBlockNode {
  key: string;
  category: 'Block' | 'GroupBox';
  loc: string;
  w: number;
  h: number;
  text: string;
  title?: string;
  members?: string[];
  figure: string;
  param?: number;
  fill: string;
  stroke: string;
  textCol: string;
}

/** 映射后的连线数据 */
export interface MappedBlockLink {
  from: string;
  to: string;
  arrow: boolean;
  label?: string;
}

/** 括号形状 → GoJS figure */
const SHAPE_FIGURE: Record<FlowShape, string> = {
  process: 'Rectangle',
  stadium: 'RoundedRectangle',
  circle: 'Ellipse',
  subroutine: 'Subroutine',
  cylinder: 'Cylinder1',
  diamond: 'Diamond',
  hexagon: 'Hexagon',
  parallelogram: 'Parallelogram1',
  parallelogramInv: 'Parallelogram1',
};

/** 估算文本宽度（CJK 全宽） */
function textW(s: string, px: number): number {
  let w = 0;
  for (const ch of s) {
    w += /[⺀-鿿　-〿＀-￯]/.test(ch) ? px : px * 0.62;
  }
  return Math.ceil(w);
}

/** 网格填充：cells → 每个带 id 的 cell 的行列位置 */
function fillGrid(
  cells: BlockCell[],
  columns: number
): { row: number; col: number; span: number; cell: BlockCell }[] {
  const out: { row: number; col: number; span: number; cell: BlockCell }[] = [];
  let row = 0;
  let col = 0;
  for (const cell of cells) {
    const span = Math.max(1, cell.space ?? cell.span ?? 1);
    if (col + span > columns) {
      col = 0;
      row++;
    }
    out.push({ row, col, span, cell });
    col += span;
    if (col >= columns) {
      col = 0;
      row++;
    }
  }
  return out;
}

/** 主入口 */
export function mapBlock(
  ast: BlockASTX,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedBlockNode[]; links: MappedBlockLink[] } {
  const cs = theme.categories.process;
  const gcs = theme.categories.group;
  const fs = theme.fontSize.node;

  // 列数（parser 已补默认，仍兜底）
  let columns = ast.columns ?? 0;
  if (!columns) {
    for (const c of ast.cells) {
      if (!c.space) columns += c.span ?? 1;
    }
    columns = Math.max(1, columns);
  }

  // 网格 + 列宽/行高
  const placed = fillGrid(ast.cells, columns).filter(p => p.cell.id);
  const colW: number[] = [];
  const rowH: number[] = [];
  for (const p of placed) {
    const label = p.cell.label ?? p.cell.id ?? '';
    const natural = textW(label, fs) + 24;
    const perCol = Math.max(MIN_COL_W, natural / p.span);
    for (let c = 0; c < p.span; c++) {
      const ci = p.col + c;
      colW[ci] = Math.max(colW[ci] ?? MIN_COL_W, perCol);
    }
    // 多行标签按 '\n' 估高
    const lines = label.split('\n').length;
    rowH[p.row] = Math.max(rowH[p.row] ?? MIN_ROW_H, lines * (fs + 6) + 16);
  }
  // 空列兜底
  for (let c = 0; c < columns; c++) colW[c] = colW[c] ?? MIN_COL_W;

  // 列起点 x / 行起点 y
  const colX: number[] = [];
  let x = MARGIN;
  for (let c = 0; c < columns; c++) {
    colX[c] = x;
    x += colW[c] + H_GAP;
  }
  const rowCount = rowH.length;
  const rowY: number[] = [];
  let y = MARGIN;
  for (let r = 0; r < rowCount; r++) {
    rowY[r] = y;
    y += (rowH[r] ?? MIN_ROW_H) + V_GAP;
  }

  // 块节点
  const nodes: MappedBlockNode[] = [];
  const rectOf = new Map<string, { x: number; y: number; w: number; h: number }>();
  for (const p of placed) {
    const id = p.cell.id!;
    let w = 0;
    for (let c = 0; c < p.span; c++) w += colW[p.col + c] + H_GAP;
    w -= H_GAP;
    const h = rowH[p.row] ?? MIN_ROW_H;
    const bx = colX[p.col];
    const by = rowY[p.row];
    rectOf.set(id, { x: bx, y: by, w, h });
    const figure = p.cell.shape ? SHAPE_FIGURE[p.cell.shape] : 'Rectangle';
    const param = p.cell.shape === 'stadium' ? Math.min(w, h) / 2 : undefined;
    const node: MappedBlockNode = {
      key: id,
      category: 'Block',
      loc: `${Math.round(bx)} ${Math.round(by)}`,
      w: Math.round(w),
      h: Math.round(h),
      text: p.cell.label ?? id,
      figure,
      fill: cs.fill,
      stroke: cs.stroke,
      textCol: cs.text,
    };
    if (param !== undefined) node.param = Math.round(param);
    nodes.push(node);
  }

  // 组盒：成员区间 → 包围盒外扩
  const membersOf = (g: BlockGroup): string[] => {
    const ids: string[] = [];
    // g.start/g.end 是 cells 原始下标（含 space 占位），不能对过滤后的 placed 切片
    const seg = ast.cells.slice(g.start, g.end);
    for (const c of seg) {
      if (c.id && rectOf.has(c.id)) ids.push(c.id);
    }
    // 递归并入嵌套组
    for (const sub of ast.groups) {
      if (sub === g) continue;
      if (sub.start >= g.start && sub.end <= g.end && sub.start < g.end) {
        ids.push(sub.id);
      }
    }
    return ids;
  };

  for (const g of ast.groups) {
    const memberIds = membersOf(g);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let hit = false;
    for (const id of memberIds) {
      const r = rectOf.get(id);
      if (!r) continue;
      hit = true;
      minX = Math.min(minX, r.x);
      minY = Math.min(minY, r.y);
      maxX = Math.max(maxX, r.x + r.w);
      maxY = Math.max(maxY, r.y + r.h);
    }
    if (!hit) continue;
    const title = g.label ?? g.id;
    const gw = Math.max(maxX - minX + GB_PAD_X * 2, textW(title, fs) + 40);
    const gh = maxY - minY + GB_TITLE + GB_PAD_B;
    const gx = minX - GB_PAD_X;
    const gy = minY - GB_TITLE;
    nodes.push({
      key: g.id,
      category: 'GroupBox',
      loc: `${Math.round(gx)} ${Math.round(gy)}`,
      w: Math.round(gw),
      h: Math.round(gh),
      text: '',
      title,
      members: memberIds,
      figure: 'Rectangle',
      fill: gcs.fill,
      stroke: gcs.stroke,
      textCol: cs.text,
    });
  }

  // 连线（只保留两端已知块）
  const known = new Set(rectOf.keys());
  const links: MappedBlockLink[] = [];
  for (const e of ast.edges) {
    if (!known.has(e.from) || !known.has(e.to)) continue;
    const link: MappedBlockLink = { from: e.from, to: e.to, arrow: e.arrow };
    if (e.label) link.label = e.label;
    links.push(link);
  }

  return { nodes, links };
}
