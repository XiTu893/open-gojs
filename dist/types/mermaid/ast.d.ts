/**
 * Mermaid DSL 解析产物 —— AST 类型定义。
 *
 * 每种图一个根节点，结构尽量贴近 Mermaid 语义，便于映射器转换为 GoJS 模型。
 * 解析失败不抛异常，而是在 AST 根上带 `errors` 数组，便于上层降级显示。
 */
/** 图表类型 */
export type MermaidType = 'flowchart' | 'sequence' | 'class' | 'state' | 'er' | 'gantt' | 'pie' | 'journey' | 'quadrant' | 'xychart' | 'sankey' | 'mindmap' | 'timeline' | 'requirement' | 'usecase' | 'gitgraph' | 'c4' | 'zenuml' | 'block' | 'packet' | 'kanban' | 'architecture' | 'radar' | 'eventmodeling' | 'treemap' | 'venn' | 'ishikawa' | 'wardley' | 'cynefin' | 'treeview' | 'swimlanes';
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
/** 缩进树节点（mindmap / treeView / treemap 共用） */
export interface TreeItem {
    depth: number;
    text: string;
    /** treeView: 目录（尾部 /，粗体） */
    dir?: boolean;
    /** treemap: 叶子数值 */
    value?: number;
}
/** 思维导图节点 */
export interface MindmapNode {
    depth: number;
    text: string;
    shape: 'root' | 'circle' | 'square' | 'rounded' | 'hexagon';
}
/** 思维导图 AST */
export interface MindmapAST {
    kind: 'mindmap';
    nodes: MindmapNode[];
}
/** 文件树 AST（treeView-beta） */
export interface TreeViewAST {
    kind: 'treeview';
    nodes: (TreeItem & {
        desc?: string;
    })[];
}
/** 树图 AST（treemap-beta） */
export interface TreemapAST {
    kind: 'treemap';
    nodes: TreeItem[];
}
/** 鱼骨图 AST（ishikawa-beta） */
export interface IshikawaAST {
    kind: 'ishikawa';
    problem: string;
    categories: {
        name: string;
        causes: string[];
    }[];
}
/** 时间线 AST */
export interface TimelineAST {
    kind: 'timeline';
    title?: string;
    periods: {
        period: string;
        events: string[];
    }[];
}
/** 用户旅程 AST */
export interface JourneyAST {
    kind: 'journey';
    title?: string;
    sections: {
        name: string;
        tasks: {
            label: string;
            score: number;
            actors: string[];
        }[];
    }[];
}
/** 四象限图 AST */
export interface QuadrantAST {
    kind: 'quadrant';
    title?: string;
    xAxis: {
        low: string;
        high: string;
    };
    yAxis: {
        low: string;
        high: string;
    };
    quadrants: string[];
    points: {
        label: string;
        x: number;
        y: number;
    }[];
}
/** XY 图 AST（xychart-beta） */
export interface XYChartAST {
    kind: 'xychart';
    title?: string;
    xLabels: string[];
    yMin: number;
    yMax: number;
    series: {
        type: 'bar' | 'line' | 'area';
        values: number[];
    }[];
}
/** 雷达图 AST（radar-beta） */
export interface RadarAST {
    kind: 'radar';
    title?: string;
    axes: string[];
    curves: {
        label: string;
        values: number[];
    }[];
    ticks: number;
    showLegend: boolean;
}
/** 韦恩图 AST（venn-beta） */
export interface VennAST {
    kind: 'venn';
    title?: string;
    sets: {
        id: string;
        label?: string;
        size: number;
    }[];
    unions: {
        ids: string[];
        label?: string;
        size: number;
    }[];
}
/** 需求图 AST（SysML） */
export interface RequirementAST {
    kind: 'requirement';
    dir: FlowDir;
    nodes: {
        name: string;
        kind: 'requirement' | 'element';
        type?: string;
        id?: string;
        text?: string;
        risk?: string;
        verifymethod?: string;
        docref?: string;
    }[];
    relations: {
        from: string;
        to: string;
        type: string;
    }[];
}
/** 用例图 AST（usecase-beta） */
export interface UsecaseAST {
    kind: 'usecase';
    dir: FlowDir;
    actors: {
        id: string;
        label: string;
        business?: boolean;
    }[];
    cases: {
        id: string;
        label: string;
        rect?: boolean;
    }[];
    boundaries: {
        id: string;
        title: string;
    }[];
    relations: {
        from: string;
        to: string;
        kind: 'assoc' | 'include' | 'extend' | 'generalization';
        label?: string;
    }[];
}
/** 块图单元（block-beta 网格，顺序填格） */
export interface BlockCell {
    /** 占位符：space */
    space?: number;
    id?: string;
    label?: string;
    shape?: FlowShape;
    span?: number;
}
/** 块图 AST */
export interface BlockAST {
    kind: 'block';
    columns?: number;
    cells: BlockCell[];
    edges: {
        from: string;
        to: string;
        label?: string;
        arrow: boolean;
    }[];
}
/** C4 图 AST（PlantUML 兼容子集） */
export interface C4AST {
    kind: 'c4';
    variant: 'context' | 'container' | 'component' | 'dynamic' | 'deployment';
    title?: string;
    elements: {
        alias: string;
        label: string;
        type: 'person' | 'system' | 'container' | 'component' | 'node';
        ext?: boolean;
    }[];
    boundaries: {
        alias: string;
        label: string;
    }[];
    rels: {
        from: string;
        to: string;
        label?: string;
        bi?: boolean;
    }[];
}
/** 架构图连接（带端口方向 R/L/T/B） */
export interface ArchitecturePort {
    from: string;
    fromPort: string;
    to: string;
    toPort: string;
}
/** 架构图 AST（architecture-beta） */
export interface ArchitectureAST {
    kind: 'architecture';
    groups: {
        alias: string;
        label: string;
    }[];
    services: {
        alias: string;
        label: string;
        group?: string;
    }[];
    conns: ArchitecturePort[];
}
/** Git 提交图 AST */
export interface GitGraphAST {
    kind: 'gitgraph';
    commits: {
        id: string;
        type: 'commit' | 'merge';
        label?: string;
        branch: string;
        parents: string[];
    }[];
    branches: string[];
}
/** 看板 AST */
export interface KanbanAST {
    kind: 'kanban';
    columns: {
        id: string;
        title: string;
        tasks: {
            id: string;
            label: string;
            meta?: string;
        }[];
    }[];
}
/** 网络包位段 AST（packet） */
export interface PacketAST {
    kind: 'packet';
    fields: {
        start: number;
        end: number;
        label: string;
    }[];
}
/** 事件建模 AST */
export interface EventModelingAST {
    kind: 'eventmodeling';
    frames: {
        num: string;
        reset: boolean;
        entityType: 'ui' | 'pcr' | 'cmd' | 'rmo' | 'evt';
        entity: string;
        data?: string;
        relTo: string[];
    }[];
}
/** 韦恩样式属性（可选） */
export interface VennStyle {
    target: string;
    props: Record<string, string>;
}
/** 卫·里图 AST（wardley-beta） */
export interface WardleyAST {
    kind: 'wardley';
    title?: string;
    size?: [number, number];
    components: {
        name: string;
        vis: number;
        evo: number;
        decorator?: string;
    }[];
    anchors: {
        name: string;
        vis: number;
        evo: number;
    }[];
    links: {
        from: string;
        to: string;
        flow: boolean;
        label?: string;
    }[];
    evolves: {
        name: string;
        target: number;
    }[];
    notes: {
        text: string;
        vis: number;
        evo: number;
    }[];
}
/** Cynefin 框架 AST */
export interface CynefinAST {
    kind: 'cynefin';
    title?: string;
    domains: {
        domain: 'complex' | 'complicated' | 'clear' | 'chaotic' | 'confusion';
        items: string[];
    }[];
    transitions: {
        from: string;
        to: string;
        label?: string;
    }[];
}
/** 统一 AST 根 */
export type MermaidAST = FlowchartAST | SequenceAST | ClassAST | StateAST | ErAST | GanttAST | PieAST | MindmapAST | TreeViewAST | TreemapAST | IshikawaAST | TimelineAST | JourneyAST | QuadrantAST | XYChartAST | RadarAST | VennAST | RequirementAST | UsecaseAST | BlockAST | C4AST | ArchitectureAST | GitGraphAST | KanbanAST | PacketAST | EventModelingAST | WardleyAST | CynefinAST;
/** 解析结果：AST + 可选错误 */
export interface ParseResult {
    type: MermaidType;
    ast: MermaidAST | null;
    errors: ParseError[];
}
