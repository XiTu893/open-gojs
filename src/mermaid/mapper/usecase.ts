/**
 * usecase AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：三层带状 —— actors 层 → boundary 层（组盒含内部网格）→ 松散用例层，
 * 层内按方向排布；BT/RL 末尾整体镜像（镜像保持包含关系）。
 * 组盒是 category='GroupBox' 的普通节点（渲染层 zOrder=-1 垫底）。
 * 配色只取 theme：actors/cases 用 categories.process，组盒用 categories.sequence.group。
 */
import { FlowDir } from '../ast';
import { UsecaseASTX } from '../parser/usecase';
import { MermaidTheme, defaultTheme } from '../themes';

const MARGIN = 32;
const GAP_MAIN = 56;    // 层间距
const GAP_CELL = 26;    // 网格单元间距
const BAND_MAX = 920;   // 带内最大宽度
const GBOX_TITLE = 26;  // 组盒标题带
const GBOX_PAD_X = 14;
const GBOX_PAD_B = 14;
const ACTOR_W = 56;
const ACTOR_H = 84;     // 火柴人
const CASE_W_MIN = 124;
const CASE_H_MIN = 56;
const RECT_W_MIN = 116;
const RECT_H_MIN = 46;
const LINE_H = 18;

/** 映射后的节点数据 */
export interface MappedUsecaseNode {
  key: string;
  category: 'Actor' | 'Usecase' | 'UsecaseRect' | 'GroupBox';
  loc: string;
  w: number;
  h: number;
  text: string;
  title?: string;
  members?: string[];
  fill: string;
  stroke: string;
  textCol: string;
}

/** 映射后的连线数据 */
export interface MappedUsecaseLink {
  from: string;
  to: string;
  kind: 'assoc' | 'include' | 'extend' | 'generalization';
  label?: string;
}

/** 估算文本宽度（CJK 全宽） */
function textW(s: string, px: number): number {
  let w = 0;
  for (const ch of s) {
    w += /[⺀-鿿　-〿＀-￯]/.test(ch) ? px : px * 0.62;
  }
  return Math.ceil(w);
}

interface Placed {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 贪心装箱成行：宽超 BAND_MAX 换行；返回已放置列表与总尺寸 */
function packRows(
  entries: { key: string; w: number; h: number }[],
  startX: number,
  startY: number
): { placed: Placed[]; w: number; h: number } {
  const placed: Placed[] = [];
  let x = startX;
  let y = startY;
  let rowH = 0;
  let maxW = 0;
  for (const e of entries) {
    if (x > startX && x - startX + e.w > BAND_MAX) {
      x = startX;
      y += rowH + GAP_CELL;
      rowH = 0;
    }
    placed.push({ key: e.key, x, y, w: e.w, h: e.h });
    x += e.w + GAP_CELL;
    rowH = Math.max(rowH, e.h);
    maxW = Math.max(maxW, x - startX - GAP_CELL);
  }
  return { placed, w: Math.max(maxW, 0), h: y + rowH - startY };
}

/** 主入口 */
export function mapUsecase(
  ast: UsecaseASTX,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedUsecaseNode[]; links: MappedUsecaseLink[]; dir: FlowDir } {
  const cs = theme.categories.process;
  const gcs = theme.categories.group;
  const fs = theme.fontSize.node;
  const vertical = ast.dir === 'TD' || ast.dir === 'BT';

  interface Size { w: number; h: number }
  const sizeOf = new Map<string, Size>();
  const catOf = new Map<string, 'Actor' | 'Usecase' | 'UsecaseRect'>();
  const labelOf = new Map<string, string>();

  for (const a of ast.actors) {
    const lw = textW(a.label, fs);
    const w = Math.max(ACTOR_W, lw);
    sizeOf.set(a.id, { w, h: ACTOR_H + LINE_H });
    catOf.set(a.id, 'Actor');
    labelOf.set(a.id, a.label);
  }
  for (const c of ast.cases) {
    if (sizeOf.has(c.id)) continue;
    const lw = textW(c.label, fs);
    const w = c.rect
      ? Math.max(RECT_W_MIN, lw + 28)
      : Math.max(CASE_W_MIN, lw + 36);
    const h = c.rect ? RECT_H_MIN : CASE_H_MIN;
    sizeOf.set(c.id, { w, h });
    catOf.set(c.id, c.rect ? 'UsecaseRect' : 'Usecase');
    labelOf.set(c.id, c.label);
  }

  // ---- 三层摆放（先按 TD/LR 计算，末尾按需镜像） ----
  const placed = new Map<string, Placed>();
  const groupBoxes: MappedUsecaseNode[] = [];

  const actorEntries = ast.actors.map(a => ({
    key: a.id, w: sizeOf.get(a.id)!.w, h: sizeOf.get(a.id)!.h,
  }));
  const actorsPack = packRows(actorEntries, MARGIN, MARGIN);
  for (const p of actorsPack.placed) placed.set(p.key, p);

  const bandY = MARGIN + (actorsPack.h > 0 ? actorsPack.h + GAP_MAIN : 0);

  // boundary 层（左→右一排，内部网格装箱）
  const gboxLayouts: { g: Placed; members: string[] }[] = [];
  let cursorX = MARGIN;
  for (const b of ast.boundaries) {
    const members = b.members.filter(id => sizeOf.has(id));
    const cols = Math.max(1, Math.ceil(Math.sqrt(members.length)));
    const mSizes = members.map(id => sizeOf.get(id)!);
    const rows = Math.ceil(members.length / cols);
    // 每列最宽 / 每行最高
    const colW: number[] = [];
    const rowH: number[] = [];
    for (let i = 0; i < members.length; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      colW[c] = Math.max(colW[c] ?? 0, mSizes[i].w);
      rowH[r] = Math.max(rowH[r] ?? 0, mSizes[i].h);
    }
    let gridW = 0;
    for (let c = 0; c < cols; c++) gridW += (colW[c] ?? 0) + GAP_CELL;
    if (cols > 0) gridW -= GAP_CELL;
    let gridH = 0;
    for (let r = 0; r < rows; r++) gridH += (rowH[r] ?? 0) + GAP_CELL;
    if (rows > 0) gridH -= GAP_CELL;
    const gw = Math.max(gridW, textW(b.title, fs) + 40) + GBOX_PAD_X * 2;
    const gh = GBOX_TITLE + gridH + GBOX_PAD_B;
    const gx = cursorX;
    const gy = bandY;
    gboxLayouts.push({ g: { key: b.id, x: gx, y: gy, w: gw, h: gh }, members });
    // 成员网格坐标
    const colXs: number[] = [];
    let cx = gx + GBOX_PAD_X;
    for (let c = 0; c < cols; c++) { colXs[c] = cx; cx += (colW[c] ?? 0) + GAP_CELL; }
    const rowYs: number[] = [];
    let ry = gy + GBOX_TITLE;
    for (let r = 0; r < rows; r++) { rowYs[r] = ry; ry += (rowH[r] ?? 0) + GAP_CELL; }
    for (let i = 0; i < members.length; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const s = mSizes[i];
      placed.set(members[i], {
        key: members[i], x: colXs[c], y: rowYs[r], w: s.w, h: s.h,
      });
    }
    cursorX += gw + 70;
  }

  // 松散用例层（未进任何 boundary）
  const inGroup = new Set<string>();
  for (const { members } of gboxLayouts) for (const m of members) inGroup.add(m);
  const loose = [...sizeOf.keys()].filter(id => !inGroup.has(id) && catOf.get(id) !== 'Actor');
  const loosePack = packRows(
    loose.map(id => ({ key: id, w: sizeOf.get(id)!.w, h: sizeOf.get(id)!.h })),
    MARGIN,
    bandY + Math.max(...gboxLayouts.map(g => g.g.h), 0) + GAP_MAIN
  );
  for (const p of loosePack.placed) placed.set(p.key, p);

  // ---- 镜像（BT 镜像 y、RL 镜像 x） ----
  let maxU = 0;
  let maxV = 0;
  for (const p of placed.values()) {
    const u = vertical ? p.y : p.x;
    const v = vertical ? p.x : p.y;
    maxU = Math.max(maxU, u + p.h);
    maxV = Math.max(maxV, v + p.w);
  }
  for (const gb of gboxLayouts) {
    maxU = Math.max(maxU, vertical ? gb.g.y + gb.g.h : gb.g.x + gb.g.w);
    maxV = Math.max(maxV, vertical ? gb.g.x + gb.g.w : gb.g.y + gb.g.h);
  }
  const totalU = maxU + MARGIN;
  const flipU = (vertical && ast.dir === 'BT') || (!vertical && ast.dir === 'RL');

  const project = (p: Placed): { x: number; y: number } => {
    if (vertical) {
      const y = flipU ? totalU - p.y - p.h : p.y;
      return { x: p.x, y };
    }
    const x = flipU ? totalU - p.x - p.w : p.x;
    return { x, y: p.y };
  };

  // ---- 输出节点 ----
  const nodes: MappedUsecaseNode[] = [];
  for (const [key, p] of placed) {
    const cat = catOf.get(key) ?? 'Usecase';
    const { x, y } = project(p);
    nodes.push({
      key,
      category: cat,
      loc: `${Math.round(x)} ${Math.round(y)}`,
      w: Math.round(p.w),
      h: Math.round(p.h),
      text: labelOf.get(key) ?? key,
      fill: cs.fill,
      stroke: cs.stroke,
      textCol: cs.text,
    });
  }
  for (const gb of gboxLayouts) {
    const { x, y } = project(gb.g);
    const title = ast.boundaries.find(b => b.id === gb.g.key)?.title ?? gb.g.key;
    groupBoxes.push({
      key: gb.g.key,
      category: 'GroupBox',
      loc: `${Math.round(x)} ${Math.round(y)}`,
      w: Math.round(gb.g.w),
      h: Math.round(gb.g.h),
      text: '',
      title,
      members: gb.members,
      fill: gcs.fill,
      stroke: gcs.stroke,
      textCol: cs.text,
    });
  }
  nodes.push(...groupBoxes);

  // ---- 连线（只保留两端已知节点） ----
  const links: MappedUsecaseLink[] = [];
  for (const r of ast.relations) {
    if (!sizeOf.has(r.from) || !sizeOf.has(r.to)) continue;
    const link: MappedUsecaseLink = { from: r.from, to: r.to, kind: r.kind };
    if (r.label) link.label = r.label;
    links.push(link);
  }

  return { nodes, links, dir: ast.dir };
}
