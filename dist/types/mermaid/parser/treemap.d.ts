/**
 * Mermaid treemap-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `treemap-beta`
 *  - 缩进层级；`"名称"` 或 `名称` = 分支；`"名称": 数值` 或 `名称: 数值` = 叶子（value）
 *  - `%%` 注释行跳过，无法识别行忽略（容错不抛异常）
 */
import { TreemapAST } from '../ast';
/** 判断是否 treemap */
export declare function isTreemap(text: string): boolean;
/** 解析 treemap DSL */
export declare function parseTreemap(src: string): TreemapAST;
