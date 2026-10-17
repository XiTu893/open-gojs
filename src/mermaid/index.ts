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
import { ParseResult, MermaidType, MermaidAST } from './ast';
import { getTheme, MermaidTheme } from './themes';
import { parseFlowchart, isFlowchart } from './parser/flowchart';
import { mapFlowchart } from './mapper/flowchart';
import { renderFlowchart } from './render/flowchart';
import { parseSequence, isSequence } from './parser/sequence';
import { renderSequence } from './render/sequence';
import { parseClass, isClass } from './parser/class';
import { parseState, isState } from './parser/state';
import { parseEr, isEr } from './parser/er';
import { renderGraph } from './render/graph';
import { mapClass, mapState, mapEr } from './mapper/graph';
import { parsePie, isPie } from './parser/pie';
import { renderPie } from './render/pie';
import { parseGantt, isGantt } from './parser/gantt';
import { renderGantt } from './render/gantt';
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
export function detectType(text: string): MermaidType | null {
  const first = (text.split('\n')[0] || '').trim();
  if (/^(flowchart|graph)\b/i.test(first)) return 'flowchart';
  if (/^sequenceDiagram\b/i.test(first)) return 'sequence';
  if (/^classDiagram\b/i.test(first)) return 'class';
  if (/^stateDiagram(-v2)?\b/i.test(first)) return 'state';
  if (/^erDiagram\b/i.test(first)) return 'er';
  if (/^gantt\b/i.test(first)) return 'gantt';
  if (/^pie\b/i.test(first)) return 'pie';
  return null;
}

/** 解析 DSL 文本为 AST（不渲染） */
export function parse(text: string): ParseResult {
  const type = detectType(text);
  if (!type) {
    return { type: 'flowchart', ast: null, errors: [{ line: 1, message: '无法识别的图表类型' }] };
  }
  switch (type) {
    case 'flowchart':
      return { type, ast: parseFlowchart(text), errors: [] };
    case 'sequence':
      return { type, ast: parseSequence(text), errors: [] };
    case 'class':
      return { type, ast: parseClass(text), errors: [] };
    case 'state':
      return { type, ast: parseState(text), errors: [] };
    case 'er':
      return { type, ast: parseEr(text), errors: [] };
    case 'pie':
      return { type, ast: parsePie(text), errors: [] };
    case 'gantt':
      return { type, ast: parseGantt(text), errors: [] };
    // 全部 7 种已支持
    default:
      return {
        type,
        ast: null,
        errors: [{ line: 1, message: `${type} 解析器尚未实现` }],
      };
  }
}

/**
 * 解析并渲染到指定 div。
 * @param text Mermaid DSL 文本
 * @param divId 目标 div 的 id
 * @param opts 选项（主题等）
 */
export function render(text: string, divId: string, opts: RenderOptions = {}): RenderResult {
  const parsed = parse(text);
  const themeOpt = opts.theme;
  const theme: MermaidTheme =
    typeof themeOpt === 'string' ? getTheme(themeOpt) : themeOpt ?? getTheme('default');

  if (!parsed.ast) {
    return { ...parsed, diagram: null };
  }

  let diagram: Diagram | null = null;
  if (parsed.type === 'flowchart') {
    diagram = renderFlowchart(divId, mapFlowchart(parsed.ast as any), theme);
  } else if (parsed.type === 'sequence') {
    diagram = renderSequence(divId, parsed.ast as any, theme);
  } else if (parsed.type === 'class') {
    diagram = renderGraph(divId, mapClass(parsed.ast as any), theme, { withMembers: true });
  } else if (parsed.type === 'state') {
    diagram = renderGraph(divId, mapState(parsed.ast as any), theme, { withMembers: false });
  } else if (parsed.type === 'er') {
    diagram = renderGraph(divId, mapEr(parsed.ast as any), theme, { withMembers: true });
  } else if (parsed.type === 'pie') {
    diagram = renderPie(divId, parsed.ast as any, theme);
  } else if (parsed.type === 'gantt') {
    diagram = renderGantt(divId, parsed.ast as any, theme);
  }
  return { ...parsed, diagram };
}

/** 命名空间导出 */
export const Mermaid = {
  parse,
  render,
  detectType,
  isFlowchart,
  isSequence,
  isClass,
  isState,
  isEr,
  isPie,
  isGantt,
  exportPng,
  downloadPng,
};

export type { PngExportOptions };
export { exportPng, downloadPng };

// 主题再导出，便于外部自定义
export { defaultTheme, neutralTheme, forestTheme, darkTheme, themes, getTheme } from './themes';
export type { MermaidTheme, NodeCategory, CategoryStyle, EdgeStyle } from './themes';
export type { ParseResult, MermaidAST, MermaidType } from './ast';