/**
 * timeline AST → GoJS 模型数据映射。
 *
 * 水平时间轴布局（坐标全部在此算好，loc 为 "x y" 字符串）：
 *  - 贯穿水平轴线（geometryString，右端箭头）
 *  - 每 period 一列：轴上圆点 + 轴上方卡片（period 标题 + 事件多行文本）
 *  - 列距均匀，颜色取 theme.series 轮换
 */
import { TimelineAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const MARGIN = 40;
const AXIS_Y = 300;   // 轴线 Y
const COL_W = 200;    // 每 period 列宽
const CARD_W = 170;   // 卡片宽
const CARD_GAP = 24;  // 卡片底 → 轴线间距
const DOT_R = 7;      // 圆点半径

/** 映射后的节点数据 */
export interface MappedTimelineNode {
  key: string;
  category: 'TTitle' | 'TAxis' | 'TDot' | 'TCard';
  loc: string;
  text?: string;   // 标题 / period 名
  events?: string; // 事件多行文本
  fill?: string;
  stroke?: string;
  geo?: string;    // 轴线 geometryString
  w?: number;
  h?: number;
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

  // 轴线（右端箭头）
  const x0 = MARGIN + 10;
  const x1 = MARGIN * 2 + periods.length * COL_W - 20;
  nodes.push({
    key: '__axis', category: 'TAxis', loc: '0 0',
    geo: `M${x0},${AXIS_Y} L${x1},${AXIS_Y} M${x1 - 10},${AXIS_Y - 6} L${x1},${AXIS_Y} L${x1 - 10},${AXIS_Y + 6}`,
    stroke: theme.edge.solid,
  });

  periods.forEach((p, i) => {
    const cx = MARGIN + (i + 0.5) * COL_W;
    const lines = Math.max(1, p.events.length);
    const cardH = 46 + lines * 18;
    // 卡片（轴上方）
    nodes.push({
      key: `card_${i}`, category: 'TCard',
      loc: `${Math.round(cx - CARD_W / 2)} ${AXIS_Y - CARD_GAP - cardH}`,
      text: p.period,
      events: p.events.join('\n'),
      fill: '#ffffff',
      stroke: theme.series[i % theme.series.length],
      w: CARD_W, h: cardH,
    });
    // 轴上圆点
    nodes.push({
      key: `dot_${i}`, category: 'TDot',
      loc: `${Math.round(cx)} ${AXIS_Y}`,
      fill: theme.series[i % theme.series.length],
      w: DOT_R * 2, h: DOT_R * 2,
    });
  });

  return { nodes };
}
