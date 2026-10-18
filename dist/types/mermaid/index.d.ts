/**
 * Mermaid DSL 解析 + 渲染 公共入口。
 *
 * 用法：
 *   import { Mermaid } from 'open-gojs';
 *   const result = Mermaid.render(text, 'divId', { theme: 'dark' });
 *   // result.type / result.ast / result.errors / result.diagram
 *
 * 当前完整支持 flowchart；sequence/class/state/er/gantt/pie 走各自解析器，
 * 渲染按阶段推进（未支持的图类型返回 ast 但 diagram 为 null 并带 errors 提示）。
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
