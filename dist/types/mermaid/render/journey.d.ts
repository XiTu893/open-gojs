/**
 * journey 渲染器 —— 只建模板 + 装配模型（数据由 mapper/journey 提供）。
 *
 * section 标题条（series 色底 + 对比文字）+ 分数柱 + 分数/任务名/角色文本 + 基准线。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedJourneyNode } from '../mapper/journey';
/** 渲染 journey 到 div（data = mapJourney 的输出） */
export declare function renderJourney(divId: string, data: {
    nodes: MappedJourneyNode[];
}, theme: MermaidTheme): Diagram;
