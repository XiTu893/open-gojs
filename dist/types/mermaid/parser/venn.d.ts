/**
 * Mermaid venn-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `venn-beta` / `venn`
 *  - `title 标题`
 *  - `set A["前端"]: 20`（`:N` 缺省 10；标签缺省 = id）
 *  - `union A,B["全栈"]: 5`（ids 引用 set id）
 *
 * 容错：`%%` 注释跳过、未知行忽略；`text` 子语句不支持（忽略）。
 */
import { VennAST } from '../ast';
/** 判断是否 venn */
export declare function isVenn(text: string): boolean;
/** 解析 venn DSL */
export declare function parseVenn(src: string): VennAST;
