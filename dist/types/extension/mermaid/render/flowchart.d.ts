/**
 * flowchart 渲染器 —— 把映射后的数据装配为 GoJS Diagram。
 *
 * - 按主题构建各形状的 Node 模板（process/decision/startend/…）
 * - 连线模板支持实线/虚线/粗线、箭头、标签、双向箭头
 * - subgraph 渲染为 Group
 * - 布局按方向选用 LayeredDigraphLayout
 * - 默认开启 undo、缩放平移、链接交互（"开放基础交互"）
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedFlowchart } from '../mapper/flowchart';
/** 装配 Diagram（div 已就绪）。opts.lanes：swimlane-beta 列式泳道（subgraph=列，成员按行对齐） */
export declare function renderFlowchart(divId: string, data: MappedFlowchart, theme: MermaidTheme, opts?: {
    lanes?: boolean;
}): Diagram;
