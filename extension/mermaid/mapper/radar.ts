/**
 * radar AST → GoJS 模型数据映射。
 *
 * 全部坐标在本层算好：
 *  - 画布 680×520，中心 (300,280)、半径 190
 *  - 网格：ticks 圈同心多边形 + 中心放射轴线（合并为单个 geometryString 多子路径节点）
 *  - 每条 curve 一条闭合多边形（'M..L..L..Z'，半透明填充 + series 描边）
 *  - 每轴标签外置在最大半径外；图例色块在右侧（showLegend 时）
 *  - 值域：min 0，max = ceil(max(all values))（全 0 时取 1）
 * 配色只取 theme.series 轮换 + 半透明。
 */
import { RadarAST } from '../ast';
import type { MermaidTheme } from '../themes';
import { defaultTheme } from '../themes';

/** 画布尺寸 */
export const RADAR_CANVAS_W = 680;
export const RADAR_CANVAS_H = 520;

/** 雷达图几何参数（导出供测试/示例使用） */
export const radarGeom = {
  cx: 300,
  cy: 280,
  r: 190,
  /** 标签环半径（最大半径外） */
  labelR: 216,
};

/** 映射后的节点类别 */
export type RadarNodeCategory =
  | 'RadarTitle' | 'RadarGrid' | 'RadarCurve' | 'RadarAxisLabel' | 'RadarLegend';

/** 映射后的节点数据 */
export interface MappedRadarNode {
  key: string;
  category: RadarNodeCategory;
  loc: string;
  text?: string;
  fill?: string;
  stroke?: string;
  color?: string;
  /** geometryString（网格/曲线路径，绝对坐标） */
  geom?: string;
  sw?: number;
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

/** 主入口 */
export function mapRadar(ast: RadarAST, theme: MermaidTheme = defaultTheme): { nodes: MappedRadarNode[] } {
  const nodes: MappedRadarNode[] = [];
  const { cx, cy, r, labelR } = radarGeom;
  const colorOf = (i: number): string => theme.series[i % theme.series.length];
  const axisN = ast.axes.length;
  const ticks = Math.max(1, ast.ticks);

  // 值域：min 0；max 向上取整
  const all = ast.curves.reduce((a: number[], c) => a.concat(c.values), []);
  const rawMax = all.length ? Math.max(...all) : 0;
  const axisMax = rawMax > 0 ? Math.ceil(rawMax) : 1;

  /** 第 i 轴、半径 rr 上的点 */
  const pt = (i: number, rr: number): { x: number; y: number } => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / Math.max(1, axisN);
    return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) };
  };
  const fmt = (p: { x: number; y: number }) => `${r2(p.x)},${r2(p.y)}`;

  // 标题
  if (ast.title) {
    nodes.push({ key: '__title', category: 'RadarTitle', text: ast.title, loc: `${RADAR_CANVAS_W / 2} 28` });
  }

  // 同心网格（ticks 圈多边形）+ 辐条：单节点多子路径
  if (axisN >= 2) {
    const parts: string[] = [];
    const bounds: { x: number; y: number }[] = [];
    for (let t = 1; t <= ticks; t++) {
      const rr = (r * t) / ticks;
      const ring = ast.axes.map((_, i) => pt(i, rr));
      parts.push(`M${ring.map(fmt).join(' L')} Z`);
      bounds.push(...ring);
    }
    for (let i = 0; i < axisN; i++) {
      const tip = pt(i, r);
      parts.push(`M${r2(cx)},${r2(cy)} L${fmt(tip)}`);
      bounds.push(tip);
    }
    const minX = Math.min(...bounds.map(p => p.x));
    const minY = Math.min(...bounds.map(p => p.y));
    nodes.push({
      key: '__grid', category: 'RadarGrid',
      loc: `${r2(minX)} ${r2(minY)}`,
      geom: parts.join(' '), stroke: 'rgba(0,0,0,0.25)', sw: 1,
    });
  }

  // 轴标签（最大半径外，居中）
  ast.axes.forEach((ax, i) => {
    const p = pt(i, labelR);
    nodes.push({
      key: `ax_${i}`, category: 'RadarAxisLabel',
      text: ax, loc: `${r2(p.x)} ${r2(p.y)}`,
      color: '#444444',
    });
  });

  // 曲线：每条一个闭合多边形
  ast.curves.forEach((c, i) => {
    const pts = ast.axes.map((_, k) => {
      const v = c.values[k] ?? 0;
      const t = axisMax > 0 ? Math.min(1, Math.max(0, v / axisMax)) : 0;
      return pt(k, r * t);
    });
    if (pts.length < 2) return;
    const d = `M${pts.map(fmt).join(' L')} Z`;
    const minX = Math.min(...pts.map(p => p.x));
    const minY = Math.min(...pts.map(p => p.y));
    const color = colorOf(i);
    nodes.push({
      key: `curve_${i}`, category: 'RadarCurve',
      loc: `${r2(minX)} ${r2(minY)}`,
      geom: d, fill: withAlpha(color, 0.25), stroke: color, sw: 2,
    });
  });

  // 图例（右侧竖排）
  if (ast.showLegend && ast.curves.length > 0) {
    ast.curves.forEach((c, i) => {
      nodes.push({
        key: `leg_${i}`, category: 'RadarLegend',
        text: c.label, fill: colorOf(i),
        loc: `${RADAR_CANVAS_W - 150} ${90 + i * 24}`,
      });
    });
  }

  return { nodes };
}
