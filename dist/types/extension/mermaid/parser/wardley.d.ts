/**
 * Mermaid wardley-beta 语法分析器。
 *
 * 坐标 [visibility(0底~1顶), evolution(0左~1右)]。
 * 支持：
 *  - 头行 `wardley-beta` / `wardley`
 *  - `title 标题`、`size [宽, 高]`
 *  - `component 名 [vis, evo] [(装饰器)]`（装饰器可省略：build/buy/outsource/market/inertia）
 *  - `anchor 名 [vis, evo]`
 *  - 链接 `A -> B` / `A --> B`（依赖）、`A +> B`（flow）、`A +< B`（反向 flow，归一为 to=A,from=B）、
 *    `A +'文本'> B`（带标签 flow）
 *  - `evolve 名 目标evolution`
 *  - `note "文本" [vis, evo]`
 *
 * 名字可含连字符/空格之外的通用字符（不带引号）。容错：`%%` 注释跳过、未知行忽略。
 */
import { WardleyAST } from '../ast';
/** 判断是否 wardley */
export declare function isWardley(text: string): boolean;
/** 解析 wardley DSL */
export declare function parseWardley(src: string): WardleyAST;
