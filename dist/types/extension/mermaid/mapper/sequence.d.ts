/**
 * sequence AST → GoJS 模型数据映射（对齐官方 sequenceDiagram.html 模型语义）。
 *
 * 输出即 GraphLinksModel 的 nodeDataArray/linkDataArray 数据：
 * - 参与者 → 生命线节点（顶部标题 + 向下生命线，生命线为连线端口）
 * - 消息   → 连线数据（row=行号，MessageLink 模板据此把端点钉在行心 Y）
 * - note / 激活盒 → 独立节点；按 DSL 行号把消息与 note 交错分配行
 *
 * 布局为确定性手动定位（时序图无图布局）：坐标全部在此算好，渲染层只建模板。
 */
import { SequenceAST } from '../ast';
export declare const SEQ_TOP_H = 64;
/** 参与者 X 中心（colW 由 mapSequence 计算后传入；缺省用 COL_W） */
export declare function seqColX(index: number, colW?: number): number;
/** 行中心 Y（消息线的精确 Y；MessageLink 模板复用） */
export declare function seqRowY(row: number): number;
/** 激活盒宽度（MessageLink 端点贴盒边缘时复用） */
export declare const SEQ_ACT_W = 10;
/** 映射后的节点数据 */
export interface MappedSeqNode {
    key: string;
    category: 'participant' | 'actor' | 'note' | 'activation';
    loc: string;
    text?: string;
    lineTo?: number;
    h?: number;
    w?: number;
}
/** 映射后的连线数据 */
export interface MappedSeqLink {
    key: string;
    from: string;
    to: string;
    row: number;
    fromAct: boolean;
    toAct: boolean;
    dashed: boolean;
    arrow: string;
    text: string;
}
/** 映射结果 */
export interface MappedSequence {
    nodes: MappedSeqNode[];
    links: MappedSeqLink[];
    /** 实际使用的参与者列宽（render 侧如需要可按此换算/复用） */
    colW: number;
}
/** 主入口 */
export declare function mapSequence(ast: SequenceAST): MappedSequence;
