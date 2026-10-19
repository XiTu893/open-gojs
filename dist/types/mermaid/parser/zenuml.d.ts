/**
 * Mermaid zenuml 语法分析器 —— 产出 SequenceAST（复用现有 sequence 渲染链）。
 *
 * 支持：
 *  - 头行 `zenuml`、`title 文本`（→ SequenceAST.title）
 *  - 消息：`A->B: 标签`（sync → `->>`）、`A-->B: 标签`（reply → `-->>`）、
 *    `A->>B` / `A-->>B` 同样识别；`A.new B: 标签`（creation → `->>`，标签原样）
 *  - 花括号块：while/for/foreach/loop(...) { → note{kind:'loop'}；
 *    if/else if/else → note{kind:'alt'}；opt → 'opt'；par → 'par'；
 *    try/catch/finally → 按 alt 近似；`}` 结束块
 *  - 参与者按消息出现顺序自动发现（先 from 后 to）
 *  - `//` 与 `%%` 注释跳过、未知行忽略、解析不抛错
 *
 * line 序号：messages/notes 共享同一遍历计数（0,1,2,…），顺序即源文本顺序。
 */
import { SequenceAST } from '../ast';
/** 判断是否 zenuml */
export declare function isZenUML(text: string): boolean;
/** 解析 zenuml DSL → SequenceAST（容错，不抛错） */
export declare function parseZenUML(src: string): SequenceAST;
