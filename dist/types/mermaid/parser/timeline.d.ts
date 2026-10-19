/**
 * Mermaid timeline 语法分析器。
 *
 * 支持：
 *  - 头行 `timeline`（可同行 `timeline title 标题`）
 *  - `title 标题`
 *  - 数据行 `阶段 : 事件1 : 事件2`（每段 trim，空段跳过）
 *
 * 容错：`%%` 注释跳过、无法识别行忽略、不抛异常。
 */
import { TimelineAST } from '../ast';
/** 判断是否 timeline */
export declare function isTimeline(text: string): boolean;
/** 解析 timeline DSL */
export declare function parseTimeline(src: string): TimelineAST;
