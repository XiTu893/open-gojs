/**
 * Mermaid kanban 语法分析器。
 *
 * 支持：
 *  - 头行 `kanban`
 *  - 列 = 顶格行 `列id[列标题]`
 *  - 任务 = 缩进行 `任务id[任务描述]`
 *  - 任务元数据 = 更深缩进的 `@{ assigned: 张三, ticket: 123, priority: High }`（归属最近一个任务）
 *
 * 容错：`%%` 注释跳过、无法识别行忽略、不抛异常。
 */
import { KanbanAST } from '../ast';
/** 判断是否 kanban */
export declare function isKanban(text: string): boolean;
/** 解析 kanban DSL */
export declare function parseKanban(src: string): KanbanAST;
