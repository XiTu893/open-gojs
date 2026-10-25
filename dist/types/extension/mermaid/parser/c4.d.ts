/**
 * Mermaid C4（PlantUML 兼容子集）语法分析器。
 *
 * 支持：
 *  - 头行 `C4Context` / `C4Container` / `C4Component` / `C4Dynamic` / `C4Deployment`
 *  - `title 文本`
 *  - 元素声明：Person / System / Container / Component / Deployment_Node / Node
 *    及 `_Ext` / `Db` / `Queue` 后缀（参数可无引号容错；desc 及之后参数忽略）
 *  - 边界：`Boundary(alias, "Label") {` … `}` —— 维护 boundary 栈，
 *    成员元素挂 boundaryAlias（AST 原字段不含，在本文件内扩展）
 *  - 关系：`Rel(from, to, "label", tech?, ...)`、`BiRel(...)`（bi=true），多余参数忽略
 *  - `UpdateElementStyle` / `UpdateRelStyle` / `UpdateLayoutConfig` / `Lay_*` 样式行跳过；
 *    UpdateLayoutConfig 中的 c4ShapeInRow 数值读入 maxPerRow（缺省 4）
 *  - `%%` / `//` 注释跳过、未知行忽略、解析不抛错
 */
import { C4AST } from '../ast';
/** 元素扩展：归属的 boundary（AST elements 无此字段） */
type C4ElementBase = C4AST['elements'][number];
export interface C4ElementX extends C4ElementBase {
    boundaryAlias?: string;
}
/** 声明顺序项（元素与 boundary 交错，供映射器按源顺序摆放） */
export type C4OrderItem = {
    kind: 'element';
    alias: string;
} | {
    kind: 'boundary';
    alias: string;
};
/** C4 AST 扩展：boundary 成员归属 + 声明顺序 + 每行元素数 */
export interface C4ASTX extends C4AST {
    elements: C4ElementX[];
    order: C4OrderItem[];
    maxPerRow?: number;
}
/** 判断是否 C4 图 */
export declare function isC4(text: string): boolean;
/** 解析 C4 DSL（容错，不抛错） */
export declare function parseC4(src: string): C4ASTX;
export {};
