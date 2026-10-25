/**
 * Mermaid xychart-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `xychart-beta` / `xychart`
 *  - `title 标题`
 *  - `x-axis [Q1, Q2, Q3, Q4]`（也容忍 `x-axis 低 --> 高` 两点式 / 单标签）
 *  - `y-axis 0 --> 100`（数字下限 --> 上限，也容忍 `[0, 100]`）
 *  - `bar [...]` / `line [...]` / `area [...]`（可多条，顺序保留）
 *
 * 容错：`%%` 注释跳过、未知行忽略；y 轴缺省按数据推断；x 标签缺省用序号。
 */
import { XYChartAST } from '../ast';
/** 判断是否 xychart */
export declare function isXYChart(text: string): boolean;
/** 解析 xychart DSL */
export declare function parseXYChart(src: string): XYChartAST;
