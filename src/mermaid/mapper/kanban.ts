/**
 * kanban AST → GoJS 模型数据映射。
 *
 * 列横排布局（坐标全部在此算好）：
 *  - 每列：列头条（theme.series 轮换色底 + contrastText 文字）+ 任务卡纵排
 *  - 任务卡为圆角矩形，含 label 与可选 meta 行
 */
import { KanbanAST } from '../ast';
import { MermaidTheme, defaultTheme, contrastText } from '../themes';

const MARGIN = 30;
const COL_W = 200;      // 列宽
const COL_GAP = 24;     // 列间距
const HEAD_H = 32;      // 列头高
const HEAD_Y = 60;      // 列头 Y（标题下方）
const CARD_GAP = 12;    // 卡片竖向间距
const CARD_X_PAD = 12;  // 卡片在列内左右边距
const CARD_W = COL_W - CARD_X_PAD * 2;

/** 卡片高度（有 meta 更高） */
export function kanbanCardHeight(hasMeta: boolean): number {
  return hasMeta ? 58 : 38;
}

/** 映射后的节点数据 */
export interface MappedKanbanNode {
  key: string;
  category: 'KHeader' | 'KCard';
  loc: string;
  text?: string;
  meta?: string;
  fill?: string;
  textCol?: string;
  w?: number;
  h?: number;
}

/** 主入口 */
export function mapKanban(
  ast: KanbanAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedKanbanNode[] } {
  const nodes: MappedKanbanNode[] = [];
  const columns = ast.columns ?? [];

  columns.forEach((col, ci) => {
    const colX = MARGIN + ci * (COL_W + COL_GAP);
    const color = theme.series[ci % theme.series.length];

    // 列头
    nodes.push({
      key: `col_${col.id}`, category: 'KHeader',
      text: col.title || col.id,
      loc: `${colX} ${HEAD_Y}`,
      fill: color, textCol: contrastText(color),
      w: COL_W, h: HEAD_H,
    });

    // 任务卡纵排
    let y = HEAD_Y + HEAD_H + CARD_GAP;
    col.tasks.forEach((task, ti) => {
      const hasMeta = !!(task.meta && task.meta.trim());
      nodes.push({
        key: `task_${col.id}_${task.id}_${ti}`, category: 'KCard',
        text: task.label,
        meta: hasMeta ? task.meta : undefined,
        loc: `${colX + CARD_X_PAD} ${y}`,
        fill: '#ffffff',
        w: CARD_W, h: kanbanCardHeight(hasMeta),
      });
      y += kanbanCardHeight(hasMeta) + CARD_GAP;
    });
  });

  return { nodes };
}
