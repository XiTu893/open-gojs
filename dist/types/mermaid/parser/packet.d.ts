/**
 * Mermaid packet 语法分析器（packet-beta 位段图）。
 *
 * 支持每行 `位范围: "标签"`：
 *  - `0-7: "Version"`   绝对范围（起 > 止自动交换）
 *  - `+4: "Header Length"` 相对续接（宽 4，start = 前一字段 end + 1）
 *  - `16: "Flag"`       单位（start = end = 16）
 * 标签可无引号。
 *
 * 相对续接在 parser 内解析为绝对 start/end（AST 为绝对值）。
 * 容错：`%%` 注释跳过、无法识别行忽略、不抛异常。
 */
import { PacketAST } from '../ast';
/** 判断是否 packet */
export declare function isPacket(text: string): boolean;
/** 解析 packet DSL（相对续接转绝对范围） */
export declare function parsePacket(src: string): PacketAST;
