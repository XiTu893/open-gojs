/**
 * 通用图渲染器 —— class/state/er 三种"节点+连线"图共用。
 *
 * 与 flowchart 渲染器分离（模板差异：class/er 支持成员列表、关系箭头多样）。
 * 数据格式 GraphRenderData 由各图的映射器产出。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
/** 图节点数据 */
export interface GraphNodeData {
    key: string;
    title: string;
    /** 成员行（class/er），每项一行 */
    members?: string[];
    /** 成员行是否为方法（class 用，可能斜体/着色） */
    memberKind?: ('field' | 'method')[];
    /** 关键字标记（er 的 PK/主键，加粗） */
    memberKey?: boolean[];
    category?: string;
    fill?: string;
    stroke?: string;
    textColor?: string;
}
/** 图连线数据 */
export interface GraphLinkData {
    from: string;
    to: string;
    label?: string;
    toArrow?: string;
    fromArrow?: string;
    hollowTo?: boolean;
    hollowFrom?: boolean;
    dashed?: boolean;
    thick?: boolean;
    /** er 基数记号（贴 from/to 端上方，如 `||`、`o{`） */
    fromCard?: string;
    toCard?: string;
}
/** 图渲染输入 */
export interface GraphRenderData {
    nodes: GraphNodeData[];
    links: GraphLinkData[];
    direction?: 'down' | 'right';
}
/** 渲染通用图到 div */
export declare function renderGraph(divId: string, data: GraphRenderData, theme: MermaidTheme, opts: {
    withMembers: boolean;
    straight?: boolean;
    cards?: boolean;
}): Diagram;
/** 关系语义 → 箭头属性（供映射器使用） */
export declare function relationArrow(kind: string): {
    toArrow: string;
    hollow: boolean;
    dashed: boolean;
};
