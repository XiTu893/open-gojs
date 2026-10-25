/**
 * packet AST → GoJS 模型数据映射。
 *
 * 位条网格布局（坐标全部在此算好）：
 *  - 按 bitsPerRow=32 折行，每行内位号连续（第 1 行 0-31、第 2 行 32-63 …）
 *  - 跨行字段按行边界切分单元；与前一字段重叠时单调游标规整（start 只向后推）
 *  - 行外刻度位号 0/8/16/24/31（加行基值）
 *  - 单元宽 = 位宽 × 每位像素宽，白底黑边
 */
import { PacketAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedPacketNode {
    key: string;
    category: 'PCell' | 'PTick';
    loc: string;
    text?: string;
    fill?: string;
    stroke?: string;
    w?: number;
    h?: number;
}
/** 主入口 */
export declare function mapPacket(ast: PacketAST, _theme?: MermaidTheme): {
    nodes: MappedPacketNode[];
};
