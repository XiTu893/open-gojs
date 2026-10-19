/**
 * kanban AST → GoJS 模型数据映射。
 *
 * 列横排布局（坐标全部在此算好）：
 *  - 每列：列头条（theme.series 轮换色底 + contrastText 文字）+ 任务卡纵排
 *  - 任务卡为圆角矩形，含 label 与可选 meta 行
 */
import { KanbanAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 卡片高度（有 meta 更高） */
export declare function kanbanCardHeight(hasMeta: boolean): number;
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
export declare function mapKanban(ast: KanbanAST, theme?: MermaidTheme): {
    nodes: MappedKanbanNode[];
};
