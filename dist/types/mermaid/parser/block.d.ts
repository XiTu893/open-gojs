/**
 * Mermaid block-beta（block）语法分析器。
 *
 * 支持：
 *  - 头行 `block-beta` / `block`
 *  - `columns N` 列数声明（缺省 = 第一行块数，由解析器补齐）
 *  - 块 `id["标签"]`、`id:span`、`id["标签"]:span`（span 附加在行尾）
 *  - 占位 `space` / `space:k`
 *  - 括号形状（容错）：`(…) stadium`、`((…)) circle`、`{…} diamond`、
 *    `[[…]] subroutine`、`{{…}} hexagon`、`[(…)] cylinder`
 *  - 嵌套块 `父 {` … `}`（多行）→ groups（start/end 为 cells 中的成员区间）
 *  - 边 `a --> b`、`a --- b`、`a -- 文本 --> b`、`a -- 文本 --- b`
 *  - `%%` 注释跳过、未知行忽略、解析不抛错
 *
 * AST 原生字段不含嵌套组信息，故在本文件内扩展 `BlockASTX`（groups）。
 */
import { BlockAST } from '../ast';
/** 嵌套组：members = cells[start, end)（按书写顺序） */
export interface BlockGroup {
    id: string;
    label?: string;
    start: number;
    end: number;
}
/** block AST 扩展（附加 groups，其余与 BlockAST 一致） */
export interface BlockASTX extends BlockAST {
    groups: BlockGroup[];
}
/** 判断是否 block / block-beta */
export declare function isBlock(text: string): boolean;
/** 解析 block DSL */
export declare function parseBlock(src: string): BlockASTX;
