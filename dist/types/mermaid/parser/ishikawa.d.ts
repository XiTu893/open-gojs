/**
 * Mermaid ishikawa-beta（鱼骨图）语法分析器。
 *
 * 支持：
 *  - 头行 `ishikawa-beta`
 *  - 首个无缩进非空行 = 问题（鱼头）
 *  - 后续无缩进行 = 类别；缩进行 = 该类别下的原因
 *  - `%%` 注释行跳过，无法识别行忽略（容错不抛异常）
 */
import { IshikawaAST } from '../ast';
/** 判断是否 ishikawa */
export declare function isIshikawa(text: string): boolean;
/** 解析 ishikawa DSL */
export declare function parseIshikawa(src: string): IshikawaAST;
