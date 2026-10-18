/**
 * Mermaid DSL 解析产物 —— AST 类型定义。
 *
 * 每种图一个根节点，结构尽量贴近 Mermaid 语义，便于映射器转换为 GoJS 模型。
 * 解析失败不抛异常，而是在 AST 根上带 `errors` 数组，便于上层降级显示。
 */
/** 图表类型 */
export type MermaidType = 'flowchart' | 'sequence' | 'class' | 'state' | 'er' | 'gantt' | 'pie';
/** 错误信息（容错解析用） */
export interface ParseError {
    line: number;
    message: string;
}
/** 流程图方向 */
export type FlowDir = 'TD' | 'BT' | 'LR' | 'RL';
/** 流程图节点形状 */
export type FlowShape = 'process' | 'stadium' | 'subroutine' | 'cylinder' | 'circle' | 'diamond' | 'hexagon' | 'parallelogram';
/** 流程图节点 */
export interface FlowNode {
    id: string;
    text: string;
    shape: FlowShape;
    group?: string;
    style?: string[];
    styleProps?: Record<string, string>;
}
/** 流程图连线 */
export interface FlowEdge {
    from: string;
    to: string;
    kind: 'solid' | 'dotted' | 'thick' | 'dashed';
    label?: string;
    arrow: 'forward' | 'both' | 'none';
    /** 连线样式键（linkStyle 序号 → 样式） */
    styleKey?: number;
}
/** 子图 subgraph */
export interface FlowSubgraph {
    id: string;
    title: string;
    nodes: string[];
}
/** 节点样式声明 classDef */
export interface FlowClassDef {
    name: string;
    fill?: string;
    stroke?: string;
    color?: string;
    style?: string;
}
/** 流程图 AST */
export interface FlowchartAST {
    kind: 'flowchart';
    dir: FlowDir;
    nodes: FlowNode[];
    edges: FlowEdge[];
    subgraphs: FlowSubgraph[];
    classDefs: FlowClassDef[];
    /** linkStyle 序号 → 样式属性 */
    linkStyles?: Record<number, Record<string, string>>;
}
/** 时序图参与者 */
export interface SeqParticipant {
    id: string;
    alias: string;
    type: 'participant' | 'actor';
}
/** 时序图消息 */
export interface SeqMessage {
    from: string;
    to: string;
    arrow: string;
    label: string;
    line: number;
}
/** 时序图说明/块 */
export interface SeqNote {
    kind: 'note' | 'loop' | 'alt' | 'opt' | 'par';
    text?: string;
    actors?: string[];
    line: number;
}
/** 激活/取消 */
export interface SeqActivation {
    actor: string;
    activate: boolean;
    line: number;
}
/** 时序图 AST */
export interface SequenceAST {
    kind: 'sequence';
    title?: string;
    participants: SeqParticipant[];
    messages: SeqMessage[];
    notes: SeqNote[];
    activations: SeqActivation[];
}
/** 类图成员 */
export interface ClassMember {
    visibility: '' | '+' | '-' | '#';
    isMethod: boolean;
    text: string;
}
/** 类图类 */
export interface ClassDecl {
    name: string;
    members: ClassMember[];
    namespace?: string;
}
/** 类图关系 */
export interface ClassRelation {
    from: string;
    to: string;
    kind: 'inheritance' | 'composition' | 'aggregation' | 'association' | 'dependency';
    label?: string;
}
/** 类图 AST */
export interface ClassAST {
    kind: 'class';
    title?: string;
    classes: ClassDecl[];
    relations: ClassRelation[];
}
/** 状态图状态 */
export interface StateNode {
    id: string;
    label: string;
    isStart: boolean;
    isEnd: boolean;
    composite?: StateNode[];
}
/** 状态迁移 */
export interface StateTransition {
    from: string;
    to: string;
    label?: string;
}
/** 状态图 AST */
export interface StateAST {
    kind: 'state';
    states: StateNode[];
    transitions: StateTransition[];
}
/** ER 实体属性 */
export interface ErAttribute {
    name: string;
    type: string;
    isKey: boolean;
}
/** ER 实体 */
export interface ErEntity {
    name: string;
    attrs: ErAttribute[];
}
/** ER 关系 */
export interface ErRelation {
    from: string;
    to: string;
    label: string;
    fromCard: string;
    toCard: string;
}
/** ER AST */
export interface ErAST {
    kind: 'er';
    entities: ErEntity[];
    relations: ErRelation[];
}
/** 甘特任务 */
export interface GanttTask {
    section: string;
    name: string;
    id: string;
    start: string | number;
    duration: string | number;
    isMilestone: boolean;
}
/** 甘特 AST */
export interface GanttAST {
    kind: 'gantt';
    title?: string;
    dateFormat: string;
    axisFormat?: string;
    sections: {
        name: string;
        tasks: GanttTask[];
    }[];
}
/** 饼图数据 */
export interface PieSlice {
    label: string;
    value: number;
}
/** 饼图 AST */
export interface PieAST {
    kind: 'pie';
    title?: string;
    data: PieSlice[];
}
/** 统一 AST 根 */
export type MermaidAST = FlowchartAST | SequenceAST | ClassAST | StateAST | ErAST | GanttAST | PieAST;
/** 解析结果：AST + 可选错误 */
export interface ParseResult {
    type: MermaidType;
    ast: MermaidAST | null;
    errors: ParseError[];
}
