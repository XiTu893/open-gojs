/**
 * venn 渲染器 —— 只建模板 + 装配模型（数据由 mapper/venn 提供，零布局数学）。
 *
 * 结构：标题 → 半透明圆（叠加即交集区）→ set 标签（圆外）→ union 标签（交集中心）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedVennNode } from '../mapper/venn';
/** 渲染 venn 到 div（data = mapVenn 的输出） */
export declare function renderVenn(divId: string, data: {
    nodes: MappedVennNode[];
}, theme: MermaidTheme): Diagram;
