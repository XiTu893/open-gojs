/**
 * eventmodeling 渲染器 —— 只建模板 + 装配模型（坐标由 mapper/eventmodeling 算好）。
 *
 * Lane：浅灰泳道带（垫底，左侧竖排标题）；Sep：列间浅分隔线（垫底）；
 * ColHead：列头（num）；Card：RoundedRectangle 帧卡片（标题 + data 小字）。
 * 连线：正交路由 + 箭头 + 虚线/标签。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedEventNode, MappedEventLink } from '../mapper/eventmodeling';
/** 渲染 eventmodeling 到 div（data = mapEventModeling 的输出） */
export declare function renderEventModeling(divId: string, data: {
    nodes: MappedEventNode[];
    links?: MappedEventLink[];
}, theme: MermaidTheme): Diagram;
