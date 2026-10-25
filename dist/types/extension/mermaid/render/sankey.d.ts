/**
 * sankey 渲染器 —— 只建模板 + 装配模型（数据由 mapper/sankey 提供，零布局数学）。
 *
 * - 节点 = 竖条 Rectangle（w/h/fill 数据驱动）
 * - 流量 = category 'SankeyFlow' 的节点（闭合丝带轮廓填充 + 源→目标 user-space 渐变）
 * - 标签 = 侧边单行文本（side 绑定决定贴条左/右，字号 16、色 #333 对齐官方）
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedSankeyNode } from '../mapper/sankey';
/** 渲染 sankey 到 div（data = mapSankey 的输出） */
export declare function renderSankey(divId: string, data: {
    nodes: MappedSankeyNode[];
}, theme: MermaidTheme): Diagram;
