/**
 * timeline AST → GoJS 模型数据映射。
 *
 * 对标官方 mermaid timeline：每 period 一列（横向均匀），列内自上而下 =
 * 年徽章（主：series 实色 + 白字）→ 顶部横向时间轴（粗黑线 + 右端箭头）→
 * 纵向黑色虚线（带下端箭头）→ 事件卡片（次：白底 + series 描边 + 深色文字）。
 * 坐标在此算好（loc 为 "x y" 字符串）。
 */
import { TimelineAST } from '../ast';
import { MermaidTheme } from '../themes';
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
export declare function mapTimeline(ast: TimelineAST, theme?: MermaidTheme): {
    nodes: MappedTimelineNode[];
};
