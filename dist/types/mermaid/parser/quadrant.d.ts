/**
 * Mermaid quadrantChart 语法分析器。
 *
 * 支持：
 *  - 头行 `quadrantChart`
 *  - `title 标题`
 *  - `x-axis 低 --> 高` / `y-axis 低 --> 高`（无箭头则只有低端标签）
 *  - `quadrant-1..4 文本`
 *  - `points: a[0.3,0.7], b[0.8,0.8], c["标签"][0.6,0.4]`（可不带 `points:` 前缀，
 *    也容忍 mermaid 原生的 `标签: [0.3, 0.7]` 写法）
 *
 * 容错：`%%` 注释跳过、未知行忽略、缺省字段用空值，不抛异常。
 */
import { QuadrantAST } from '../ast';
/** 判断是否 quadrantChart */
export declare function isQuadrant(text: string): boolean;
/** 解析 quadrantChart DSL（x/y 归一到 0..1，容错不抛错） */
export declare function parseQuadrant(src: string): QuadrantAST;
