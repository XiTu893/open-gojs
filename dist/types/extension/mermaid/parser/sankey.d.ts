/**
 * Mermaid sankey-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `sankey-beta` / `sankey`
 *  - 数据行 = CSV `源, 目标, 数值`（字段可带引号，值为数字）
 *  - 可选定义行 `id["显示名"]`（无逗号、形如 id[...]，为节点设 label）
 *
 * 节点集合 = 所有出现过的源/目标（按首次出现序）；定义行可在数据行前后任意位置。
 * 容错：`%%` 注释跳过、非法数值行忽略。
 */
/** sankey AST（ast.ts 无预定义，此处定义并导出） */
export interface SankeyAST {
    kind: 'sankey';
    nodes: {
        id: string;
        label?: string;
    }[];
    links: {
        source: string;
        target: string;
        value: number;
    }[];
}
/** 判断是否 sankey */
export declare function isSankey(text: string): boolean;
/** 解析 sankey DSL */
export declare function parseSankey(src: string): SankeyAST;
