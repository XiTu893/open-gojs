/**
 * Mermaid DSL 词法分析器 —— 逐字符扫描产出 Token 流。
 *
 * 按换行为语句分隔，识别标识符/字符串/数字/连边符号/形状括号/关键字。
 * `%%` 到行尾视为注释，忽略。
 */
/** Token 类别 */
export type TokenKind = 'ident' | 'str' | 'num' | 'arrow' | 'shapeOpen' | 'shapeClose' | 'punct' | 'ws' | 'newline' | 'comment' | 'eof';
/** Token */
export interface Token {
    kind: TokenKind;
    value: string;
    line: number;
    col: number;
}
/** 箭头符号里可能嵌的标签分隔（|text| 或 :text） */
export declare const PUNCT: Set<string>;
/**
 * 词法分析主入口。
 * @param src Mermaid DSL 文本
 * @returns Token 数组（含 eof 结尾）
 */
export declare function tokenize(src: string): Token[];
/**
 * 去掉注释与空白 token，返回有效 token 流（保留 newline/eof）。
 */
export declare function stripComments(tokens: Token[]): Token[];
/**
 * 智能把 token 拼回文本：连续两个词型 token 之间补空格，
 * 符号/箭头/标点紧贴（保证 `A<|--B` 连续、`int id PK` 分词）。
 * 用于需要还原行文本的解析器（成员/属性/关系行）。
 */
export declare function smartJoin(tokens: Token[]): string;
