/**
 * gantt AST → GoJS 模型数据映射。
 *
 * 日期解析（dateFormat）、工期（Nd/Nw/Nm）、after 依赖顺延、
 * 时间轴刻度/网格、任务条坐标全部在此算好，渲染层只建模板。
 */
import { GanttAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedGanttNode {
    key: string;
    category: 'GLabel' | 'GBar' | 'GDate' | 'GSection' | 'GTitle' | 'GAxis' | 'GGrid';
    loc: string;
    text?: string;
    fill?: string;
    w?: number;
    h?: number;
    milestone?: boolean;
    /** 任务名单元格最大宽（超长时自动加宽左列） */
    mw?: number;
    /** 日期文本宽（用于自适应换行/避让） */
    dw?: number;
}
/** 主入口 */
export declare function mapGantt(ast: GanttAST, theme: MermaidTheme): {
    nodes: MappedGanttNode[];
};
