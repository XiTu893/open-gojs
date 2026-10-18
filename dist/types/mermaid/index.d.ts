/**
 * Mermaid DSL 解析 + 渲染 公共入口。
 *
 * 架构：parser（DSL→AST）→ mapper（AST→GoJS 模型数据 JSON）→ render（模板+装配）。
 * 渲染层不含布局计算，只把 mapper 输出的 nodeDataArray/linkDataArray 装进模型。
 *
 * 用法：
 *   import { Mermaid } from 'open-gojs';
 *   const result = Mermaid.render(text, 'divId', { theme: 'dark' });
 *   // result.type / result.ast / result.errors / result.diagram
 */
import { Diagram } from '../diagram/Diagram';
import { ParseResult, MermaidType } from './ast';
import { MermaidTheme } from './themes';
import { isFlowchart } from './parser/flowchart';
import { isSequence } from './parser/sequence';
import { isClass } from './parser/class';
import { isState } from './parser/state';
import { isEr } from './parser/er';
import { isPie } from './parser/pie';
import { isGantt } from './parser/gantt';
import { exportPng, downloadPng, PngExportOptions } from './export';
/** 渲染选项 */
export interface RenderOptions {
    /** 主题名（default/neutral/forest/dark）或自定义主题 */
    theme?: string | MermaidTheme;
}
/** 渲染结果 */
export interface RenderResult extends ParseResult {
    diagram: Diagram | null;
}
/** 从 DSL 文本推断图类型 */
export declare function detectType(text: string): MermaidType | null;
/** 解析 DSL 文本为 AST（不渲染） */
export declare function parse(text: string): ParseResult;
/**
 * 解析并渲染到指定 div。
 * @param text Mermaid DSL 文本
 * @param divId 目标 div 的 id
 * @param opts 选项（主题等）
 */
export declare function render(text: string, divId: string, opts?: RenderOptions): RenderResult;
/** 命名空间导出 */
export declare const Mermaid: {
    parse: typeof parse;
    render: typeof render;
    detectType: typeof detectType;
    isFlowchart: typeof isFlowchart;
    isSequence: typeof isSequence;
    isClass: typeof isClass;
    isState: typeof isState;
    isEr: typeof isEr;
    isPie: typeof isPie;
    isGantt: typeof isGantt;
    exportPng: typeof exportPng;
    downloadPng: typeof downloadPng;
};
export type { PngExportOptions };
export { exportPng, downloadPng };
export { defaultTheme, neutralTheme, forestTheme, darkTheme, themes, getTheme } from './themes';
export type { MermaidTheme, NodeCategory, CategoryStyle, EdgeStyle } from './themes';
export type { ParseResult, MermaidAST, MermaidType } from './ast';
