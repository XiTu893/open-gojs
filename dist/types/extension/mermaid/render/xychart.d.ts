/**
 * xychart 渲染器 —— 只建模板 + 装配模型（数据由 mapper/xychart 提供，零布局数学）。
 *
 * 结构：标题 + 图例 → y 刻度/网格 → 坐标轴线 → x 标签 → bar 柱 / line 折线 / area 填充区。
 * line/area 用 Shape + geometryString（路径由 mapper 给绝对坐标）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedXYNode } from '../mapper/xychart';
/** 渲染 xychart 到 div（data = mapXYChart 的输出） */
export declare function renderXYChart(divId: string, data: {
    nodes: MappedXYNode[];
}, theme: MermaidTheme): Diagram;
