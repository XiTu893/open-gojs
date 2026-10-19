/**
 * flowchart AST → GoJS 模型映射。
 *
 * 把 FlowchartAST 转成 GraphLinksModel 可用的节点/连线数据：
 *  - 每个节点按形状分配 `category`（供模板取色/取形）
 *  - classDef/style 直接样式写入节点数据的 `styleProps`
 *  - subgraph 转为 GoJS Group（isGroup），组内节点带 group 字段
 *  - 连线按 kind/arrow/label 转成 from/to + 样式字段
 */
import { FlowchartAST, FlowEdge, FlowShape, FlowClassDef } from '../ast';
/** 供渲染模板使用的节点类别 */
export type FlowCategory = '' | 'Decision' | 'StartEnd' | 'Subroutine' | 'Cylinder' | 'Circle' | 'Parallelogram' | 'ParallelogramInv' | 'Hexagon' | 'Group' | 'GroupBox';
/** 由节点形状推导模板类别 */
export declare function categoryOfShape(shape: FlowShape): FlowCategory;
/** 映射后的节点数据（含渲染所需字段） */
export interface MappedNode {
    key: string;
    text: string;
    category: FlowCategory;
    categoryDef?: FlowClassDef;
    styleProps?: Record<string, string>;
    members?: string[];
}
/** 映射后的连线数据 */
export interface MappedLink {
    from: string;
    to: string;
    kind: FlowEdge['kind'];
    arrow: FlowEdge['arrow'];
    label?: string;
    strokeDashArray?: number[];
    strokeWidth?: number;
}
/** 映射结果 */
export interface MappedFlowchart {
    nodes: MappedNode[];
    links: MappedLink[];
    dir: FlowchartAST['dir'];
}
/** 主入口 */
export declare function mapFlowchart(ast: FlowchartAST): MappedFlowchart;
