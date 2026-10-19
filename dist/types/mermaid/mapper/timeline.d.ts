/**
 * timeline AST → GoJS 模型数据映射。
 *
 * 水平时间轴布局（坐标全部在此算好，loc 为 "x y" 字符串）：
 *  - 贯穿水平轴线（geometryString，右端箭头）
 *  - 每 period 一列：轴上圆点 + 轴上方卡片（period 标题 + 事件多行文本）
 *  - 列距均匀，颜色取 theme.series 轮换
 */
import { TimelineAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedTimelineNode {
    key: string;
    category: 'TTitle' | 'TAxis' | 'TDot' | 'TCard';
    loc: string;
    text?: string;
    events?: string;
    fill?: string;
    stroke?: string;
    geo?: string;
    w?: number;
    h?: number;
}
/** 主入口 */
export declare function mapTimeline(ast: TimelineAST, theme?: MermaidTheme): {
    nodes: MappedTimelineNode[];
};
