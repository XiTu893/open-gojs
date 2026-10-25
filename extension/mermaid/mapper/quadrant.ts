/**
 * quadrantChart AST → GoJS 模型数据映射。
 *
 * 坐标系与全部布局在本层算好：
 *  - 画布 600×600，绘图区留左边距（y 轴标签）、上边距（标题）、下边距（x 轴标签）
 *  - 数据 x/y ∈ [0,1]，y=1 在绘图区顶部（画布 y 向下 → 翻转）
 *  - 象限编号对齐 mermaid：1=右上、2=左上、3=左下、4=右下
 * 配色只取 theme（灰阶轮换/主题色）或黑白灰。
 */
import { QuadrantAST } from '../ast';
import type { MermaidTheme } from '../themes';
import { defaultTheme } from '../themes';

/** 画布尺寸 */
export const Q_CANVAS_W = 600;
export const Q_CANVAS_H = 600;

/** 绘图区（导出供测试/示例使用） */
export const quadrantPlot = {
  x0: 90,            // 左（留 y 轴标签）
  y0: 70,            // 上（留标题）
  x1: 560,           // 右
  y1: 536,           // 下（留 x 轴标签）
  get w() { return this.x1 - this.x0; },
  get h() { return this.y1 - this.y0; },
};

/** 映射后的节点类别 */
export type QuadrantNodeCategory =
  | 'QTitle' | 'QBg' | 'QFrame' | 'QLine'
  | 'QLabel' | 'QAxisX' | 'QAxisY'
  | 'QDot' | 'QPointLabel';

/** 映射后的节点数据 */
export interface MappedQuadrantNode {
  key: string;
  category: QuadrantNodeCategory;
  loc: string;
  text?: string;
  fill?: string;
  stroke?: string;
  color?: string;
  w?: number;
  h?: number;
}

/** 保留两位小数，避免坐标串过长 */
function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

function clamp01(v: number): number {
  if (Number.isNaN(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

/** 主入口：全部坐标算好，渲染层只建模板 */
export function mapQuadrant(ast: QuadrantAST, theme: MermaidTheme = defaultTheme): { nodes: MappedQuadrantNode[] } {
  const nodes: MappedQuadrantNode[] = [];
  const { x0, y0, x1, y1, w: plotW, h: plotH } = quadrantPlot;
  const midX = (x0 + x1) / 2;
  const midY = (y0 + y1) / 2;

  /** 数据点 → 画布坐标（y 翻转：1 在上） */
  const px = (x: number) => x0 + clamp01(x) * plotW;
  const py = (y: number) => y1 - clamp01(y) * plotH;

  // 标题（顶部居中）
  if (ast.title) {
    nodes.push({ key: '__title', category: 'QTitle', text: ast.title, loc: `${Q_CANVAS_W / 2} 30` });
  }

  // 四象限底色（棋盘交替：1/3 用主题背景，2/4 用半透明灰）
  const bgAlt = [theme.background, 'rgba(128,128,128,0.12)'];
  const quads: { x: number; y: number; w: number; h: number }[] = [
    { x: midX, y: y0, w: x1 - midX, h: midY - y0 },   // Q1 右上
    { x: x0, y: y0, w: midX - x0, h: midY - y0 },     // Q2 左上
    { x: x0, y: midY, w: midX - x0, h: y1 - midY },   // Q3 左下
    { x: midX, y: midY, w: x1 - midX, h: y1 - midY }, // Q4 右下
  ];
  quads.forEach((q, i) => {
    nodes.push({
      key: `qbg_${i}`, category: 'QBg',
      loc: `${r2(q.x)} ${r2(q.y)}`, w: r2(q.w), h: r2(q.h),
      fill: bgAlt[i % 2],
    });
  });

  // 外框 + 十字分割线
  nodes.push({
    key: '__frame', category: 'QFrame',
    loc: `${x0} ${y0}`, w: plotW, h: plotH,
    stroke: theme.edge.solid,
  });
  nodes.push({
    key: '__vline', category: 'QLine',
    loc: `${midX} ${y0}`, w: 1, h: plotH, fill: theme.edge.solid,
  });
  nodes.push({
    key: '__hline', category: 'QLine',
    loc: `${x0} ${midY}`, w: plotW, h: 1, fill: theme.edge.solid,
  });

  // 四象限文字（各象限中心，灰字）
  ast.quadrants.forEach((t, i) => {
    if (!t) return;
    const q = quads[i];
    nodes.push({
      key: `qlbl_${i}`, category: 'QLabel',
      text: t,
      loc: `${r2(q.x + q.w / 2)} ${r2(q.y + q.h / 2)}`,
      color: '#666666',
    });
  });

  // 轴端标签：x 低/高在绘图区下方两端；y 低(下)/高(上)在左侧
  if (ast.xAxis.low) {
    nodes.push({ key: '__xlow', category: 'QAxisX', text: ast.xAxis.low, loc: `${x0 + 50} ${y1 + 26}`, color: '#444444' });
  }
  if (ast.xAxis.high) {
    nodes.push({ key: '__xhigh', category: 'QAxisX', text: ast.xAxis.high, loc: `${x1 - 50} ${y1 + 26}`, color: '#444444' });
  }
  if (ast.yAxis.low) {
    nodes.push({ key: '__ylow', category: 'QAxisY', text: ast.yAxis.low, loc: `${x0 - 12} ${y1 - 6}`, color: '#444444' });
  }
  if (ast.yAxis.high) {
    nodes.push({ key: '__yhigh', category: 'QAxisY', text: ast.yAxis.high, loc: `${x0 - 12} ${y0 + 6}`, color: '#444444' });
  }

  // 数据点：小圆（series 灰阶轮换）+ 下方标签
  ast.points.forEach((p, i) => {
    const cx = px(p.x);
    const cy = py(p.y);
    nodes.push({
      key: `pt_${i}`, category: 'QDot',
      loc: `${r2(cx)} ${r2(cy)}`,
      fill: theme.series[i % theme.series.length],
    });
    if (p.label) {
      nodes.push({
        key: `ptlbl_${i}`, category: 'QPointLabel',
        text: p.label,
        loc: `${r2(cx)} ${r2(cy + 14)}`,
        color: '#333333',
      });
    }
  });

  return { nodes };
}
