/**
 * Mermaid gitGraph 语法分析器。
 *
 * 支持子集：
 *  - 头行 `gitGraph` / `gitgraph`，可选 `direction LR|BT`（垂直方向忽略，仅 LR 有意义，此处不改变 AST）
 *  - `commit`（无参自动生成 id）
 *  - `commit id:"x"`、`commit id:"x" label:"y"`（tag:/shortid: 容错忽略）
 *  - `branch <名>`（只声明，不切换）、`checkout <名>`（切换当前分支）、`merge <名>`
 *
 * AST：按出现顺序记录每条 commit（含其当前分支）；
 * merge 的 parents = [当前分支, 被合并分支]；branches 按声明序（隐含 main 在首位）。
 * 容错：`%%` 注释跳过、未知行忽略、重复 id 自动去重。
 */
import { GitGraphAST } from '../ast';
/** 判断是否 gitGraph */
export declare function isGitGraph(text: string): boolean;
/** 解析 gitGraph DSL */
export declare function parseGitGraph(src: string): GitGraphAST;
