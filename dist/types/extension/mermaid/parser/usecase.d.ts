/**
 * Mermaid usecase-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `usecase-beta`（可带方向 `usecase-beta LR`）与 `direction TD|TB|BT|LR|RL`
 *  - `actor id` / `actor id("标签")` / `actor business id`
 *  - 用例 `id("标签")`（椭圆）、`id["标签"]`（矩形）、裸 `"文本"`（自动生成 id）
 *  - `systemBoundary id["标题"] { … }` 块（成员归属该 boundary）
 *  - 关系：`-->` assoc（`-->|标签|` / `-- 标签 -->` 容错）、
 *    `..>`（标签含 include/extend ⇒ include/extend，`..> : include` 亦识别）、
 *    `--|>` generalization；关系可出现在声明之前（未声明端点补成椭圆用例）
 *  - `%%` 注释跳过、未知行忽略、解析不抛错
 */
import { UsecaseAST } from '../ast';
/** boundary 扩展：带成员列表（AST 原字段不含 members，故在本文件内扩展） */
export interface UsecaseBoundary {
    id: string;
    title: string;
    members: string[];
}
/** usecase AST 扩展（仅 boundaries 收窄，其余与 UsecaseAST 一致） */
export interface UsecaseASTX extends UsecaseAST {
    boundaries: UsecaseBoundary[];
}
/** 判断是否 usecase-beta */
export declare function isUsecase(text: string): boolean;
/** 解析 usecase DSL */
export declare function parseUsecase(src: string): UsecaseASTX;
