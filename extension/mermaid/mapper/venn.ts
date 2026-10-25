/**
 * venn AST → GoJS 模型数据映射。
 *
 * 全部坐标在本层算好：
 *  - 画布 680×460，圆心群落中心 (340,250)
 *  - 半径按 √size（钳制到 [28,110]），2 圆水平、3 圆三角、更多环形近似
 *  - 圆：半透明 series 填充 + series 描边（叠加即为交集区，无需单独画交集）
 *  - set 标签放在各圆远离群落中心的一侧；union 标签放在被引集合圆心的均值处
 * 配色只取 theme.series 轮换 + 半透明。
 */
import { VennAST } from '../ast';
import type { MermaidTheme } from '../themes';
import { defaultTheme } from '../themes';

/** 画布尺寸 */
export const VENN_CANVAS_W = 680;
export const VENN_CANVAS_H = 460;

/** 布局中心（导出供测试/示例使用） */
export const vennCenter = { cx: 340, cy: 250 };

/** 半径 = K * √size */
const RADIUS_K = 32;
const R_MIN = 40;
const R_MAX = 200;

/** 映射后的节点类别 */
export type VennNodeCategory = 'VennTitle' | 'VennCircle' | 'VennLabel' | 'VennUnionLabel';

/** 映射后的节点数据 */
export interface MappedVennNode {
  key: string;
  category: VennNodeCategory;
  loc: string;
  text?: string;
  fill?: string;
  stroke?: string;
  color?: string;
  w?: number;
  h?: number;
}

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

function withAlpha(color: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec((color || '').trim());
  if (m) {
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${alpha})`;
  }
  return `rgba(0,0,0,${alpha})`;
}

/** 由 size 求半径 */
function radiusOf(size: number): number {
  const s = Number.isFinite(size) && size > 0 ? size : 10;
  return Math.min(R_MAX, Math.max(R_MIN, RADIUS_K * Math.sqrt(s)));
}

/** 各集合圆心布局：2 水平 / 3 三角 / ≥4 环形 */
function layoutCenters(radii: number[]): { cx: number; cy: number }[] {
  const n = radii.length;
  const { cx: CX, cy: CY } = vennCenter;
  if (n === 0) return [];
  if (n === 1) return [{ cx: CX, cy: CY }];
  const rAvg = radii.reduce((s, v) => s + v, 0) / n;
  if (n === 2) {
    const d = (radii[0] + radii[1]) * 0.45;
    return [{ cx: CX - d / 2, cy: CY }, { cx: CX + d / 2, cy: CY }];
  }
  if (n === 3) {
    const d = rAvg * 0.72;
    return radii.map((_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
      return { cx: CX + d * Math.cos(a), cy: CY + d * Math.sin(a) };
    });
  }
  const d = rAvg * 1.05;
  return radii.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { cx: CX + d * Math.cos(a), cy: CY + d * Math.sin(a) };
  });
}

/** 主入口 */
export function mapVenn(ast: VennAST, theme: MermaidTheme = defaultTheme): { nodes: MappedVennNode[] } {
  const nodes: MappedVennNode[] = [];
  const colorOf = (i: number): string => theme.series[i % theme.series.length];

  if (ast.title) {
    nodes.push({ key: '__title', category: 'VennTitle', text: ast.title, loc: `${VENN_CANVAS_W / 2} 28` });
  }

  const radii = ast.sets.map(s => radiusOf(s.size));
  const centers = layoutCenters(radii);
  const centroid = centers.length
    ? {
        cx: centers.reduce((s, c) => s + c.cx, 0) / centers.length,
        cy: centers.reduce((s, c) => s + c.cy, 0) / centers.length,
      }
    : { cx: vennCenter.cx, cy: vennCenter.cy };

  // 圆（半透明叠加即为交集区）
  ast.sets.forEach((s, i) => {
    const c = centers[i];
    if (!c) return;
    const rr = radii[i];
    const color = colorOf(i);
    nodes.push({
      key: `set_${s.id}`, category: 'VennCircle',
      loc: `${r2(c.cx - rr)} ${r2(c.cy - rr)}`,
      w: r2(2 * rr), h: r2(2 * rr),
      fill: withAlpha(color, 0.3), stroke: color,
    });
  });

  // set 标签：放在圆外、远离群落中心的方向
  ast.sets.forEach((s, i) => {
    const c = centers[i];
    if (!c) return;
    let dx = c.cx - centroid.cx;
    let dy = c.cy - centroid.cy;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) { dx = 0; dy = -1; } else { dx /= len; dy /= len; }
    const rr = radii[i];
    nodes.push({
      key: `setlbl_${s.id}`, category: 'VennLabel',
      text: s.label ?? s.id,
      // 标签放在圆内部（远离群落中心的方位、距圆心 0.4r，对标官方 0.38r）
      loc: `${r2(c.cx + dx * rr * 0.4)} ${r2(c.cy + dy * rr * 0.4)}`,
      color: '#333333',
    });
  });

  // union 标签：被引集合圆心的均值（交集区中心）
  ast.unions.forEach((u, i) => {
    const cs: { cx: number; cy: number }[] = [];
    for (const id of u.ids) {
      const idx = ast.sets.findIndex(s => s.id === id);
      if (idx >= 0 && centers[idx]) cs.push(centers[idx]);
    }
    const at = cs.length
      ? { cx: cs.reduce((s, c) => s + c.cx, 0) / cs.length, cy: cs.reduce((s, c) => s + c.cy, 0) / cs.length }
      : centroid;
    nodes.push({
      key: `union_${i}`, category: 'VennUnionLabel',
      text: u.label ?? u.ids.join(' ∩ '),
      loc: `${r2(at.cx)} ${r2(at.cy)}`,
      color: '#111111',
    });
  });

  return { nodes };
}
