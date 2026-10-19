/**
 * journey AST → GoJS 模型数据映射。
 *
 * 横向 section 分组布局（坐标全部在此算好）：
 *  - 每 section 一个标题条 + 分组区域
 *  - section 内每任务一根柱：柱高 = clamp(score,0,10)/10 × 最大柱高
 *  - 柱下任务名、柱上分数、柱底角色小字
 *  - 底部基准线贯穿全部任务
 */
import { JourneyAST } from '../ast';
import { MermaidTheme, defaultTheme, contrastText } from '../themes';

const MARGIN = 40;
const HEADER_Y = 90;      // section 标题条 Y
const HEADER_H = 26;
const MAX_BAR_H = 150;    // 满分柱高
const BASELINE_Y = 320;   // 柱基线 Y（柱底）
const TASK_W = 88;        // 每任务列宽
const BAR_W = 56;         // 柱宽
const SEC_PAD = 16;       // section 内边距
const SEC_GAP = 36;       // section 间距
const LABEL_Y = BASELINE_Y + 10;
const ACTORS_Y = BASELINE_Y + 32;

/** 映射后的节点数据 */
export interface MappedJourneyNode {
  key: string;
  category: 'JTitle' | 'JAxis' | 'JSection' | 'JBar' | 'JScore' | 'JLabel' | 'JActors';
  loc: string;
  text?: string;
  fill?: string;
  textCol?: string;
  geo?: string;
  stroke?: string;
  w?: number;
  h?: number;
}

/** 主入口 */
export function mapJourney(
  ast: JourneyAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedJourneyNode[] } {
  const nodes: MappedJourneyNode[] = [];
  const sections = ast.sections ?? [];

  if (ast.title) {
    nodes.push({ key: '__title', category: 'JTitle', text: ast.title, loc: `${MARGIN} 30` });
  }
  if (sections.length === 0) return { nodes };

  let cursor = MARGIN;
  sections.forEach((sec, si) => {
    const taskCount = Math.max(1, sec.tasks.length);
    const secW = taskCount * TASK_W + SEC_PAD * 2;
    const color = theme.series[si % theme.series.length];

    // section 标题条
    nodes.push({
      key: `sec_${si}`, category: 'JSection',
      text: sec.name, loc: `${cursor} ${HEADER_Y}`,
      fill: color, textCol: contrastText(color),
      w: secW, h: HEADER_H,
    });

    sec.tasks.forEach((t, ti) => {
      const cx = cursor + SEC_PAD + (ti + 0.5) * TASK_W;
      const clamped = Math.max(0, Math.min(10, t.score));
      const barH = Math.max(4, (clamped / 10) * MAX_BAR_H);
      // 柱
      nodes.push({
        key: `bar_${si}_${ti}`, category: 'JBar',
        loc: `${Math.round(cx - BAR_W / 2)} ${BASELINE_Y - barH}`,
        fill: color, w: BAR_W, h: barH,
      });
      // 分数（柱顶上方）
      nodes.push({
        key: `score_${si}_${ti}`, category: 'JScore',
        text: String(t.score),
        loc: `${Math.round(cx - BAR_W / 2)} ${BASELINE_Y - barH - 20}`,
      });
      // 任务名（柱下）
      nodes.push({
        key: `lbl_${si}_${ti}`, category: 'JLabel',
        text: t.label,
        loc: `${Math.round(cx - TASK_W / 2)} ${LABEL_Y}`,
      });
      // 角色（任务名下，小字）
      if (t.actors.length) {
        nodes.push({
          key: `act_${si}_${ti}`, category: 'JActors',
          text: t.actors.join(', '),
          loc: `${Math.round(cx - TASK_W / 2)} ${ACTORS_Y}`,
        });
      }
    });

    cursor += secW + SEC_GAP;
  });

  // 基准线
  if (sections.length > 0) {
    const endX = cursor - SEC_GAP;
    nodes.push({
      key: '__axis', category: 'JAxis', loc: '0 0',
      geo: `M${MARGIN},${BASELINE_Y} L${endX},${BASELINE_Y}`,
      stroke: theme.edge.solid,
    });
  }

  return { nodes };
}
