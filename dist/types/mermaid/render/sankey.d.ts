/**
 * sankey 渲染器 —— 只建模板 + 装配模型（数据由 mapper/sankey 提供，零布局数学）。
 *
 * - 节点 = 竖条 Rectangle（w/h/fill 数据驱动）
 * - 流量 = category 'SankeyFlow' 的节点（中心线 geometryString + 源→目标渐变描边）
 * - 标签 = 侧边文本（side 绑定决定贴条左/右，字号 14 对齐官方）
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedSankeyNode } from '../mapper/sankey';
/** 渲染 sankey 到 div（data = mapSankey 的输出） */
export declare function renderSankey(divId: string, data: {
    nodes: MappedSankeyNode[];
}, theme: MermaidTheme): Diagram;
