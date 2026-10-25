/**
 * timeline 渲染器 —— 只建模板 + 装配模型（数据由 mapper/timeline 提供）。
 *
 * 纵向时间轴（对标官方）：每 period 一列 = 顶部年徽章 + 向下虚线轴 + 事件 pill 竖排。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedTimelineNode } from '../mapper/timeline';
/** 渲染 timeline 到 div（data = mapTimeline 的输出） */
export declare function renderTimeline(divId: string, data: {
    nodes: MappedTimelineNode[];
}, theme: MermaidTheme): Diagram;
