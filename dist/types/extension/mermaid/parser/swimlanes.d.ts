/**
 * Mermaid swimlane-beta 语法分析器 —— 复用 flowchart 全链。
 *
 * 首行 `swimlane-beta [方向]` 当作 flowchart 头处理：
 * 把首行替换为 `flowchart TB`（或按方向 LR 等）后调用 parseFlowchart，
 * 返回 FlowchartAST。顶层 subgraph 即泳道（现有 flowchart render 的
 * GroupBox 已能呈现容器效果）。
 */
import { FlowchartAST } from '../ast';
/** 判断是否 swimlane-beta */
export declare function isSwimlanes(text: string): boolean;
/** 解析 swimlanes DSL（内部转成 flowchart 文本后复用 parseFlowchart） */
export declare function parseSwimlanes(src: string): FlowchartAST;
