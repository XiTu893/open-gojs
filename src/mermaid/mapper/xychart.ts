/**
 * xychart AST → GoJS 模型数据映射。
 *
 * 标准图表布局（全部坐标在本层算好）：
 *  - 画布 760×470，绘图区留左(y 刻度)/下(x 标签)/上(标题+图例)边距
 *  - y 轴约 5 档刻度 + 浅灰网格线；x 轴标签按槽位居中
 *  - bar 多组并排；line/area 用 geometryString（折线/填充多边形）
 *  - 多 series 时输出图例；配色只取 theme.series 轮换 + 半透明
 */
import { XYChartAST } from '../ast';
import type { MermaidTheme } from '../themes';
import { defaultTheme } from '../themes';

/** 画布尺寸 */
export const XY_CANVAS_W = 760;
export const XY_CANVAS_H = 470;

/** 绘图区（导出供测试/示例使用） */
export const xyPlot = {
  x0: 76,
  y0: 76,
  x1: 736,
  y1: 414,
  get w() { return this.x1 - this.x0; },
  get h() { return this.y1 - this.y0; },
};

/** 映射后的节点类别 */
export type XYNodeCategory =
  | 'XYTitle' | 'XYGrid' | 'XYAxis' | 'XYYLabel' | 'XYXLabel'
  | 'XYBar' | 'XYLine' | 'XYArea' | 'XYLegend';

/** 映射后的节点数据 */
export interface MappedXYNode {
  key: string;
  category: XYNodeCategory;
  loc: string;
  text?: string;
  fill?: string;
  stroke?: string;
  color?: string;
  /** geometryString（line/area 的路径，绝对坐标） */
  geom?: string;
  /** 描边宽度（line/area） */
  sw?: number;
  w?: number;
  h?: number;
}

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** `#rrggbb` → 半透明 rgba；非 hex 回退灰阶 */
function withAlpha(color: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec((color || '').trim());
  if (m) {
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${alpha})`;
  }
  return `rgba(0,0,0,${alpha})`;
}

/** 数值 → 紧凑刻度文本 */
function fmtNum(v: number): string {
  if (Number.isInteger(v)) return String(v);
  return String(Math.round(v * 100) / 100);
}

/** 主入口 */
export function mapXYChart(ast: XYChartAST, theme: MermaidTheme = defaultTheme): { nodes: MappedXYNode[] } {
  const nodes: MappedXYNode[] = [];
  const { x0, y0, x1, y1, w: plotW, h: plotH } = xyPlot;
  const n = ast.xLabels.length;
  const slot = n > 0 ? plotW / n : plotW;
  const ySpan = ast.yMax - ast.yMin || 1;

  /** 数据值 → 画布 y（钳制到绘图区内） */
  const yOf = (v: number): number => {
    const t = (Math.min(ast.yMax, Math.max(ast.yMin, v)) - ast.yMin) / ySpan;
    return y1 - t * plotH;
  };
  /** 第 i 槽中心 x */
  const xCenter = (i: number): number => x0 + (i + 0.5) * slot;
  const colorOf = (i: number): string => theme.series[i % theme.series.length];

  // 标题
  if (ast.title) {
    nodes.push({ key: '__title', category: 'XYTitle', text: ast.title, loc: `${XY_CANVAS_W / 2} 28` });
  }

  // y 刻度 + 网格（5 档）
  const TICKS = 5;
  for (let i = 0; i < TICKS; i++) {
    const frac = i / (TICKS - 1);
    const ty = y1 - frac * plotH;
    const val = ast.yMin + frac * (ast.yMax - ast.yMin);
    nodes.push({
      key: `grid_${i}`, category: 'XYGrid',
      loc: `${x0} ${r2(ty)}`, w: plotW, h: 1,
      fill: 'rgba(0,0,0,0.1)',
    });
    nodes.push({
      key: `ytick_${i}`, category: 'XYYLabel',
      text: fmtNum(val), loc: `${x0 - 10} ${r2(ty)}`,
      color: '#555555',
    });
  }

  // 坐标轴线（画在网格之上）
  nodes.push({ key: '__yaxis', category: 'XYAxis', loc: `${x0} ${y0}`, w: 1, h: plotH, fill: theme.edge.solid });
  nodes.push({ key: '__xaxis', category: 'XYAxis', loc: `${x0} ${y1}`, w: plotW, h: 1, fill: theme.edge.solid });

  // x 轴标签（槽位居中）
  ast.xLabels.forEach((lb, i) => {
    nodes.push({
      key: `xtick_${i}`, category: 'XYXLabel',
      text: lb, loc: `${r2(xCenter(i))} ${y1 + 22}`,
      color: '#444444',
    });
  });

  // bar：多组并排
  const barSeries = ast.series.filter(s => s.type === 'bar');
  const groupW = slot * 0.7;
  const barW = barSeries.length > 0 ? groupW / barSeries.length : groupW;
  const groupPad = (slot - groupW) / 2;
  barSeries.forEach((s, j) => {
    const ci = ast.series.indexOf(s);
    s.values.forEach((v, i) => {
      if (n > 0 && i >= n) return;
      const top = yOf(v);
      const barH = r2(Math.max(0, y1 - top));
      if (barH <= 0) return;
      const bx = x0 + i * slot + groupPad + j * barW;
      nodes.push({
        key: `bar_${j}_${i}`, category: 'XYBar',
        loc: `${r2(bx)} ${r2(top)}`,
        w: r2(Math.max(3, barW - 4)), h: barH,
        fill: colorOf(ci),
      });
    });
  });

  // line / area：geometryString 路径（绝对坐标）
  ast.series.forEach((s, si) => {
    if (s.type !== 'line' && s.type !== 'area') return;
    const cnt = n > 0 ? Math.min(n, s.values.length) : s.values.length;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < cnt; i++) pts.push({ x: xCenter(i), y: yOf(s.values[i]) });
    if (pts.length === 0) return;
    const color = colorOf(si);
    const minX = Math.min(...pts.map(p => p.x));
    const fmt = (p: { x: number; y: number }) => `${r2(p.x)},${r2(p.y)}`;
    if (s.type === 'line') {
      const d = `M${pts.map(fmt).join(' L')}`;
      const minY = Math.min(...pts.map(p => p.y));
      nodes.push({
        key: `line_${si}`, category: 'XYLine',
        loc: `${r2(minX)} ${r2(minY)}`,
        geom: d, stroke: color, sw: 2,
      });
    } else {
      const d = `M${r2(pts[0].x)},${r2(y1)} L${pts.map(fmt).join(' L')} L${r2(pts[pts.length - 1].x)},${r2(y1)} Z`;
      const minY = Math.min(y1, ...pts.map(p => p.y));
      nodes.push({
        key: `area_${si}`, category: 'XYArea',
        loc: `${r2(minX)} ${r2(minY)}`,
        geom: d, fill: withAlpha(color, 0.35), stroke: color, sw: 1.5,
      });
    }
  });

  // 图例（多 series 时）
  if (ast.series.length >= 2) {
    let lx = x0;
    const ly = 52;
    const seen: Record<string, number> = {};
    ast.series.forEach((s, i) => {
      seen[s.type] = (seen[s.type] || 0) + 1;
      const label = `${s.type} ${seen[s.type]}`;
      nodes.push({
        key: `leg_${i}`, category: 'XYLegend',
        text: label, fill: colorOf(i),
        loc: `${lx} ${ly}`,
      });
      lx += 20 + label.length * 8 + 28;
    });
  }

  return { nodes };
}
