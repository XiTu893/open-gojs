/**
 * pie 渲染器 —— 只建模板 + 装配模型（数据由 mapper/pie 提供）。
 *
 * 扇形节点用 `Pie` figure（parameter1=Start, parameter2=Sweep）重叠定位在圆心，右侧图例。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedPieNode } from '../mapper/pie';
/** 渲染 pie 到 div（data = mapPie 的输出） */
export declare function renderPie(divId: string, data: {
    nodes: MappedPieNode[];
}, theme: MermaidTheme): Diagram;
