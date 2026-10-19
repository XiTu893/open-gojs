/**
 * gantt 渲染器 —— 只建模板 + 装配模型（数据由 mapper/gantt 提供）。
 *
 * 左列任务名，右侧时间轴/网格/任务条与起止日期；section 分组标题。
 * 左列宽、刻度步长、日期位置全部由 mapper 自适应计算，此处只装配模板。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedGanttNode } from '../mapper/gantt';
/** 渲染 gantt 到 div（data = mapGantt 的输出） */
export declare function renderGantt(divId: string, data: {
    nodes: MappedGanttNode[];
}, theme: MermaidTheme): Diagram;
