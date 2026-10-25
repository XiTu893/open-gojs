/**
 * Mermaid ishikawa-beta（鱼骨图）语法分析器。
 *
 * 支持（对齐官方：相对缩进，允许整段整体缩进）：
 *  - 头行 `ishikawa-beta`
 *  - 基准缩进 = 内容行的最小缩进；首个基准缩进行 = 问题（鱼头）
 *  - 与基准同缩进的后续行 = 类别；更深缩进 = 当前类别的原因
 *  - 无类别之前的深缩进行丢弃（容错不抛异常）
 *  - `%%` 注释行、空行跳过
 */
import { IshikawaAST } from '../ast';
/** 判断是否 ishikawa */
export declare function isIshikawa(text: string): boolean;
/** 解析 ishikawa DSL */
export declare function parseIshikawa(src: string): IshikawaAST;
