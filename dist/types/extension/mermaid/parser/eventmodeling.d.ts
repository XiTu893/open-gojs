/**
 * Mermaid eventmodeling 语法分析器。
 *
 * 支持：
 *  - 头行 `eventmodeling`
 *  - 时间帧：`tf 01 ui CartUI`（compact）与 `timeframe 01 ui CartUI`（relaxed）等价；
 *    `rf` / `resetframe` 代替 tf 表示 reset 帧
 *  - 类型 token：ui | pcr | cmd | rmo | evt（兼容全称 processor|command|readmodel|event）
 *  - 行尾内联数据 { ... }（取第一个 { 到最后 } 之间内容）或 [[BlockId]] 引用（原文存 data）
 *  - 行尾显式关系 `->> 03`、`->> 01, 05` → relTo（花括号内出现的 `->>` 不算）
 *  - data BlockId json{ ... } 多行数据块：容错整体跳过
 *  - 泳道推断（entityType + `Namespace.Entity` 前缀）→ AST 扩展字段 lanes
 *  - `%%` 与 `//` 注释跳过、未知行忽略、解析不抛错
 */
import { EventModelingAST } from '../ast';
export type EventEntityType = EventModelingAST['frames'][number]['entityType'];
/** 一条泳道（AST 原字段不含，故在本文件内扩展） */
export interface EventLane {
    /** 稳定键（namespace + 类型泳道名） */
    key: string;
    /** 显示标题：`Namespace / 类型泳道名` 或 `类型泳道名` */
    title: string;
    /** 属于该泳道的帧在 ast.frames 中的下标（首次出现顺序） */
    frames: number[];
}
/** eventmodeling AST 扩展：附加推断出的泳道 */
export interface EventModelingASTX extends EventModelingAST {
    lanes: EventLane[];
}
/** 类型 → 基础泳道名 */
export declare function baseEventLane(t: EventEntityType): string;
/** 泳道推断：entityType → 类型泳道；`Namespace.Entity` → `Namespace / 类型泳道`；按首次出现顺序 */
export declare function inferEventLanes(frames: EventModelingAST['frames']): EventLane[];
/** 判断是否 eventmodeling */
export declare function isEventModeling(text: string): boolean;
/** 解析 eventmodeling DSL（容错，不抛错） */
export declare function parseEventModeling(src: string): EventModelingASTX;
