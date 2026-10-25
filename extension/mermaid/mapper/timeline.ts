/**
 * timeline AST → GoJS 模型数据映射。
 *
 * 对标官方 mermaid timeline：每 period 一列（横向均匀），列内自上而下 =
 * 年徽章（主：series 实色 + 白字）→ 顶部横向时间轴（粗黑线 + 右端箭头）→
 * 纵向黑色虚线（带下端箭头）→ 事件卡片（次：白底 + series 描边 + 深色文字）。
 * 坐标在此算好（loc 为 "x y" 字符串）。
 */
import { TimelineAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const MARGIN = 40; // 左留白
const COL_W = 200;      // 每 period 列宽
const BADGE_TOP = 56;   // 年徽章顶 y
const BADGE_H = 46;     // 年徽章高
const EVENT_W = 150;    // 事件卡宽
const EVENT_H = 40;     // 事件卡高
const EVENT_GAP = 16;   // 事件间距
const LINE_PAD = 12;    // 徽章底 → 虚线起点
const AXIS_GAP = 56;    // 徽章底 → 横向时间轴
const EVENTS_GAP = 60;  // 时间轴 → 首行事件

/** 映射后的节点数据 */
export interface MappedTimelineNode {
  key: string;
  category: 'TTitle' | 'TBadge' | 'TLine' | 'TEvent' | 'TAxis';
  loc: string;
  text?: string;
  fill?: string;
  stroke?: string;
  geo?: string;
  w?: number;
  h?: number;
  sw?: number;
  dash?: number[];
}

/** 主入口 */
export function mapTimeline(
  ast: TimelineAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedTimelineNode[] } {
  const nodes: MappedTimelineNode[] = [];
  const periods = ast.periods ?? [];

  if (ast.title) {
    nodes.push({ key: '__title', category: 'TTitle', text: ast.title, loc: `${MARGIN} 30` });
  }
  if (periods.length === 0) return { nodes };

  const badgeBottom = BADGE_TOP + BADGE_H;
  const axisY = badgeBottom + AXIS_GAP;
  const eventY0 = axisY + EVENTS_GAP;
  const lastCx = MARGIN + (periods.length - 0.5) * COL_W;
  const axisX1 = MARGIN - 10;
  const axisX2 = lastCx + COL_W / 2 + 20;

  // 横向时间轴（粗黑线 + 右端箭头）——先画，位于所有内容之下
  nodes.push({
    key: '__axis', category: 'TAxis', loc: '0 0',
    geo: `M ${r(axisX1)},${axisY} L ${r(axisX2 - 14)},${axisY} Z` +
      ` M ${r(axisX2)},${axisY} L ${r(axisX2 - 14)},${axisY - 7} L ${r(axisX2 - 14)},${axisY + 7} Z`,
    stroke: '#000000', fill: '#000000', sw: 4,
  });

  // 绘制层序对标官方：轴 → 徽章 → 纵向虚线 → 事件卡（事件盖住虚线段）
  const badgeNodes: MappedTimelineNode[] = [];
  const eventNodes: MappedTimelineNode[] = [];
  const lineNodes: MappedTimelineNode[] = [];

  periods.forEach((p, i) => {
    const color = theme.series[i % theme.series.length];
    const cx = MARGIN + (i + 0.5) * COL_W;
    const badgeW = Math.max(EVENT_W, Math.min(COL_W - 40, textW(p.period) + 40));

    // 年徽章（主内容：series 实色 + 白字，bolder）
    badgeNodes.push({
      key: `badge_${i}`, category: 'TBadge',
      loc: `${r(cx - badgeW / 2)} ${BADGE_TOP}`,
      text: p.period,
      fill: color,
      stroke: color,
      w: r(badgeW), h: BADGE_H,
    });

    // 事件卡（次内容：白底 + series 描边）
    p.events.forEach((ev, j) => {
      const ey = eventY0 + j * (EVENT_H + EVENT_GAP);
      eventNodes.push({
        key: `ev_${i}_${j}`, category: 'TEvent',
        loc: `${r(cx - EVENT_W / 2)} ${ey}`,
        text: ev,
        fill: '#ffffff',
        stroke: color,
        w: EVENT_W, h: EVENT_H,
      });
    });

    // 纵向黑色虚线 + 下端箭头：徽章底 → 事件区底
    const evBottom = p.events.length > 0
      ? eventY0 + p.events.length * (EVENT_H + EVENT_GAP) - EVENT_GAP + EVENT_H
      : eventY0;
    const lineTop = badgeBottom + LINE_PAD;
    const lineBottom = evBottom + 40;
    lineNodes.push({
      key: `line_${i}`, category: 'TLine', loc: '0 0',
      geo: `M ${r(cx)},${lineTop} L ${r(cx)},${lineBottom - 12} Z` +
        ` M ${r(cx)},${lineBottom} L ${r(cx - 7)},${lineBottom - 12} L ${r(cx + 7)},${lineBottom - 12} Z`,
      stroke: '#000000', fill: '#000000', sw: 2, dash: [5, 5],
    });
  });

  nodes.push(...badgeNodes, ...lineNodes, ...eventNodes);
  return { nodes };
}

/** 取整（避免 loc 字符串出现长小数） */
function r(v: number): number {
  return Math.round(v * 10) / 10;
}

/** 估算文本像素宽（CJK≈1em，latin≈0.55em，em=13） */
function textW(s: string, em = 13): number {
  let w = 0;
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    w += (c >= 0x2e80 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) ? em : em * 0.55;
  }
  return w;
}
