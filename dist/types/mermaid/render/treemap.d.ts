/**
 * treemap 渲染器 —— 只建模板 + 装配模型（数据由 mapper/treemap 提供）。
 *
 * 矩形单元格：固定 w/h + 左上对齐标签（叶子含 value），嵌套矩形由 mapper 算好。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedTreemapNode } from '../mapper/treemap';
/** 渲染 treemap 到 div（data = mapTreemap 的输出） */
export declare function renderTreemap(divId: string, data: {
    nodes: MappedTreemapNode[];
}, theme: MermaidTheme): Diagram;
