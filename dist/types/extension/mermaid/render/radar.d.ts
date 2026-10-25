/**
 * radar 渲染器 —— 只建模板 + 装配模型（数据由 mapper/radar 提供，零布局数学）。
 *
 * 结构：标题 → 同心网格+辐条（geometryString 多子路径）→ 轴标签 → 每 curve 一条闭合多边形 → 图例。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedRadarNode } from '../mapper/radar';
/** 渲染 radar 到 div（data = mapRadar 的输出） */
export declare function renderRadar(divId: string, data: {
    nodes: MappedRadarNode[];
}, theme: MermaidTheme): Diagram;
