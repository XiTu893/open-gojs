/**
 * timeline 渲染器 —— 只建模板 + 装配模型（数据由 mapper/timeline 提供）。
 *
 * 水平时间轴：一条贯穿轴线（geometryString 带箭头）+ 每 period 轴上圆点 + 轴上方卡片。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedTimelineNode } from '../mapper/timeline';
/** 渲染 timeline 到 div（data = mapTimeline 的输出） */
export declare function renderTimeline(divId: string, data: {
    nodes: MappedTimelineNode[];
}, theme: MermaidTheme): Diagram;
