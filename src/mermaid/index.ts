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
import { ParseResult, MermaidType, MermaidAST } from './ast';
import { getTheme, MermaidTheme } from './themes';
import { WheelModeZoom } from '../core/EnumValues';
// flowchart / sequence / class / state / er / pie / gantt（原有）
import { parseFlowchart, isFlowchart } from './parser/flowchart';
import { mapFlowchart } from './mapper/flowchart';
import { renderFlowchart } from './render/flowchart';
import { parseSequence, isSequence } from './parser/sequence';
import { mapSequence } from './mapper/sequence';
import { renderSequence } from './render/sequence';
import { parseClass, isClass } from './parser/class';
import { parseState, isState } from './parser/state';
import { parseEr, isEr } from './parser/er';
import { renderGraph } from './render/graph';
import { mapClass, mapState, mapEr } from './mapper/graph';
import { parsePie, isPie } from './parser/pie';
import { mapPie } from './mapper/pie';
import { renderPie } from './render/pie';
import { parseGantt, isGantt } from './parser/gantt';
import { mapGantt } from './mapper/gantt';
import { renderGantt } from './render/gantt';
// 新增 24 种图
import { parseMindmap, isMindmap } from './parser/mindmap';
import { mapMindmap } from './mapper/mindmap';
import { renderMindmap } from './render/mindmap';
import { parseTreeView, isTreeView } from './parser/treeview';
import { mapTreeView } from './mapper/treeview';
import { renderTreeView } from './render/treeview';
import { parseTreemap, isTreemap } from './parser/treemap';
import { mapTreemap } from './mapper/treemap';
import { renderTreemap } from './render/treemap';
import { parseIshikawa, isIshikawa } from './parser/ishikawa';
import { mapIshikawa } from './mapper/ishikawa';
import { renderIshikawa } from './render/ishikawa';
import { parseTimeline, isTimeline } from './parser/timeline';
import { mapTimeline } from './mapper/timeline';
import { renderTimeline } from './render/timeline';
import { parseJourney, isJourney } from './parser/journey';
import { mapJourney } from './mapper/journey';
import { renderJourney } from './render/journey';
import { parseKanban, isKanban } from './parser/kanban';
import { mapKanban } from './mapper/kanban';
import { renderKanban } from './render/kanban';
import { parsePacket, isPacket } from './parser/packet';
import { mapPacket } from './mapper/packet';
import { renderPacket } from './render/packet';
import { parseQuadrant, isQuadrant } from './parser/quadrant';
import { mapQuadrant } from './mapper/quadrant';
import { renderQuadrant } from './render/quadrant';
import { parseXYChart, isXYChart } from './parser/xychart';
import { mapXYChart } from './mapper/xychart';
import { renderXYChart } from './render/xychart';
import { parseRadar, isRadar } from './parser/radar';
import { mapRadar } from './mapper/radar';
import { renderRadar } from './render/radar';
import { parseVenn, isVenn } from './parser/venn';
import { mapVenn } from './mapper/venn';
import { renderVenn } from './render/venn';
import { parseRequirement, isRequirement } from './parser/requirement';
import { mapRequirement } from './mapper/requirement';
import { renderRequirement } from './render/requirement';
import { parseUsecase, isUsecase } from './parser/usecase';
import { mapUsecase } from './mapper/usecase';
import { renderUsecase } from './render/usecase';
import { parseBlock, isBlock } from './parser/block';
import { mapBlock } from './mapper/block';
import { renderBlock } from './render/block';
import { parseArchitecture, isArchitecture } from './parser/architecture';
import { mapArchitecture } from './mapper/architecture';
import { renderArchitecture } from './render/architecture';
import { parseGitGraph, isGitGraph } from './parser/gitgraph';
import { mapGitGraph } from './mapper/gitgraph';
import { renderGitGraph } from './render/gitgraph';
import { parseSankey, isSankey } from './parser/sankey';
import { mapSankey } from './mapper/sankey';
import { renderSankey } from './render/sankey';
import { parseWardley, isWardley } from './parser/wardley';
import { mapWardley } from './mapper/wardley';
import { renderWardley } from './render/wardley';
import { parseCynefin, isCynefin } from './parser/cynefin';
import { mapCynefin } from './mapper/cynefin';
import { renderCynefin } from './render/cynefin';
import { parseEventModeling, isEventModeling } from './parser/eventmodeling';
import { mapEventModeling } from './mapper/eventmodeling';
import { renderEventModeling } from './render/eventmodeling';
import { parseC4, isC4 } from './parser/c4';
import { mapC4 } from './mapper/c4';
import { renderC4 } from './render/c4';
// ZenUML 复用 sequence；swimlanes 复用 flowchart（仅自写 parser）
import { parseZenUML, isZenUML } from './parser/zenuml';
import { parseSwimlanes, isSwimlanes } from './parser/swimlanes';
import { exportPng, downloadPng, PngExportOptions } from './export';

/** 渲染选项 */
export interface RenderOptions {
  /** 主题名（default/neutral/forest/dark）或自定义主题 */
  theme?: string | MermaidTheme;
  /** 渲染后是否自动适配视口（默认 true） */
  autoFit?: boolean;
  /** 是否启用默认交互（滚轮缩放 + 左键空白拖拽平移，默认 true） */
  interaction?: boolean;
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
  if (/^journey\b/i.test(first)) return 'journey';
  if (/^quadrantChart\b/i.test(first)) return 'quadrant';
  if (/^xychart(-beta)?\b/i.test(first)) return 'xychart';
  if (/^sankey(-beta)?\b/i.test(first)) return 'sankey';
  if (/^mindmap\b/i.test(first)) return 'mindmap';
  if (/^timeline\b/i.test(first)) return 'timeline';
  if (/^requirementDiagram\b/i.test(first)) return 'requirement';
  if (/^usecase(-beta)?\b/i.test(first)) return 'usecase';
  if (/^gitGraph\b/i.test(first)) return 'gitgraph';
  if (/^C4(Context|Container|Component|Dynamic|Deployment)\b/i.test(first)) return 'c4';
  if (/^zenuml\b/i.test(first)) return 'zenuml';
  if (/^block(-beta)?\b/i.test(first)) return 'block';
  if (/^packet\b/i.test(first)) return 'packet';
  if (/^kanban\b/i.test(first)) return 'kanban';
  if (/^architecture(-beta)?\b/i.test(first)) return 'architecture';
  if (/^radar(-beta)?\b/i.test(first)) return 'radar';
  if (/^eventmodeling\b/i.test(first)) return 'eventmodeling';
  if (/^treemap(-beta)?\b/i.test(first)) return 'treemap';
  if (/^venn(-beta)?\b/i.test(first)) return 'venn';
  if (/^ishikawa(-beta)?\b/i.test(first)) return 'ishikawa';
  if (/^wardley(-beta)?\b/i.test(first)) return 'wardley';
  if (/^cynefin(-beta)?\b/i.test(first)) return 'cynefin';
  if (/^treeView(-beta)?\b/i.test(first)) return 'treeview';
  if (/^swimlane(-beta)?\b/i.test(first)) return 'swimlanes';
  return null;
}

/** 解析 DSL 文本为 AST（不渲染） */
export function parse(text: string): ParseResult {
  const type = detectType(text);
  if (!type) {
    return { type: 'flowchart', ast: null, errors: [{ line: 1, message: '无法识别的图表类型' }] };
  }
  switch (type) {
    case 'flowchart': return { type, ast: parseFlowchart(text), errors: [] };
    case 'sequence': return { type, ast: parseSequence(text), errors: [] };
    case 'class': return { type, ast: parseClass(text), errors: [] };
    case 'state': return { type, ast: parseState(text), errors: [] };
    case 'er': return { type, ast: parseEr(text), errors: [] };
    case 'pie': return { type, ast: parsePie(text), errors: [] };
    case 'gantt': return { type, ast: parseGantt(text), errors: [] };
    case 'mindmap': return { type, ast: parseMindmap(text), errors: [] };
    case 'treeview': return { type, ast: parseTreeView(text), errors: [] };
    case 'treemap': return { type, ast: parseTreemap(text), errors: [] };
    case 'ishikawa': return { type, ast: parseIshikawa(text), errors: [] };
    case 'timeline': return { type, ast: parseTimeline(text), errors: [] };
    case 'journey': return { type, ast: parseJourney(text), errors: [] };
    case 'kanban': return { type, ast: parseKanban(text), errors: [] };
    case 'packet': return { type, ast: parsePacket(text), errors: [] };
    case 'quadrant': return { type, ast: parseQuadrant(text), errors: [] };
    case 'xychart': return { type, ast: parseXYChart(text), errors: [] };
    case 'radar': return { type, ast: parseRadar(text), errors: [] };
    case 'venn': return { type, ast: parseVenn(text), errors: [] };
    case 'requirement': return { type, ast: parseRequirement(text), errors: [] };
    case 'usecase': return { type, ast: parseUsecase(text), errors: [] };
    case 'block': return { type, ast: parseBlock(text), errors: [] };
    case 'architecture': return { type, ast: parseArchitecture(text), errors: [] };
    case 'gitgraph': return { type, ast: parseGitGraph(text), errors: [] };
    case 'sankey': return { type, ast: parseSankey(text) as any, errors: [] };
    case 'wardley': return { type, ast: parseWardley(text), errors: [] };
    case 'cynefin': return { type, ast: parseCynefin(text), errors: [] };
    case 'eventmodeling': return { type, ast: parseEventModeling(text), errors: [] };
    case 'c4': return { type, ast: parseC4(text), errors: [] };
    case 'zenuml': return { type, ast: parseZenUML(text), errors: [] };
    case 'swimlanes': return { type, ast: parseSwimlanes(text), errors: [] };
    default:
      return { type, ast: null, errors: [{ line: 1, message: `${type} 解析器尚未实现` }] };
  }
}

/**
 * 解析并渲染到指定 div。
 * @param text Mermaid DSL 文本
 * @param divId 目标 div 的 id
 * @param opts 选项（主题、自动适配视口等）
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
  switch (parsed.type) {
    case 'flowchart': diagram = renderFlowchart(divId, mapFlowchart(parsed.ast as any), theme); break;
    case 'sequence': diagram = renderSequence(divId, mapSequence(parsed.ast as any), theme); break;
    case 'class': diagram = renderGraph(divId, mapClass(parsed.ast as any), theme, { withMembers: true }); break;
    case 'state': diagram = renderGraph(divId, mapState(parsed.ast as any), theme, { withMembers: false }); break;
    case 'er': diagram = renderGraph(divId, mapEr(parsed.ast as any), theme, { withMembers: true }); break;
    case 'pie': diagram = renderPie(divId, mapPie(parsed.ast as any, theme), theme); break;
    case 'gantt': diagram = renderGantt(divId, mapGantt(parsed.ast as any, theme), theme); break;
    case 'mindmap': diagram = renderMindmap(divId, mapMindmap(parsed.ast as any, theme), theme); break;
    case 'treeview': diagram = renderTreeView(divId, mapTreeView(parsed.ast as any, theme), theme); break;
    case 'treemap': diagram = renderTreemap(divId, mapTreemap(parsed.ast as any, theme), theme); break;
    case 'ishikawa': diagram = renderIshikawa(divId, mapIshikawa(parsed.ast as any, theme), theme); break;
    case 'timeline': diagram = renderTimeline(divId, mapTimeline(parsed.ast as any, theme), theme); break;
    case 'journey': diagram = renderJourney(divId, mapJourney(parsed.ast as any, theme), theme); break;
    case 'kanban': diagram = renderKanban(divId, mapKanban(parsed.ast as any, theme), theme); break;
    case 'packet': diagram = renderPacket(divId, mapPacket(parsed.ast as any, theme), theme); break;
    case 'quadrant': diagram = renderQuadrant(divId, mapQuadrant(parsed.ast as any, theme), theme); break;
    case 'xychart': diagram = renderXYChart(divId, mapXYChart(parsed.ast as any, theme), theme); break;
    case 'radar': diagram = renderRadar(divId, mapRadar(parsed.ast as any, theme), theme); break;
    case 'venn': diagram = renderVenn(divId, mapVenn(parsed.ast as any, theme), theme); break;
    case 'requirement': diagram = renderRequirement(divId, mapRequirement(parsed.ast as any, theme), theme); break;
    case 'usecase': diagram = renderUsecase(divId, mapUsecase(parsed.ast as any, theme), theme); break;
    case 'block': diagram = renderBlock(divId, mapBlock(parsed.ast as any, theme), theme); break;
    case 'architecture': diagram = renderArchitecture(divId, mapArchitecture(parsed.ast as any, theme), theme); break;
    case 'gitgraph': diagram = renderGitGraph(divId, mapGitGraph(parsed.ast as any, theme), theme); break;
    case 'sankey': diagram = renderSankey(divId, mapSankey(parsed.ast as any, theme), theme); break;
    case 'wardley': diagram = renderWardley(divId, mapWardley(parsed.ast as any, theme), theme); break;
    case 'cynefin': diagram = renderCynefin(divId, mapCynefin(parsed.ast as any, theme), theme); break;
    case 'eventmodeling': diagram = renderEventModeling(divId, mapEventModeling(parsed.ast as any, theme), theme); break;
    case 'c4': diagram = renderC4(divId, mapC4(parsed.ast as any, theme), theme); break;
    case 'zenuml': diagram = renderSequence(divId, mapSequence(parsed.ast as any), theme); break;
    case 'swimlanes': diagram = renderFlowchart(divId, mapFlowchart(parsed.ast as any), theme); break;
    default: break;
  }

  // 默认自动适配视口（对标官方 Diagram autoScale=Uniform 的观感）；
  // 关闭选项可传 opts.autoFit=false（如导出 PNG 时通常由 exportPng 自行 fit）
  if (diagram && opts.autoFit !== false) {
    diagram.zoomToFit();
  }

  // 默认交互（对标官方，仅做 mermaid 侧配置）：
  //  - 滚轮：官方 ToolManager 默认 Scroll（需 ctrl 才缩放）；图表场景改为 Zoom，滚轮即缩放
  //  - pan：官方 PanningTool 默认中键拖拽平移（core 已对标），左键空白保持官方框选
  if (diagram && opts.interaction !== false) {
    const tm: any = (diagram as any).toolManager;
    if (tm && typeof tm.mouseWheelBehavior !== 'undefined') {
      tm.mouseWheelBehavior = WheelModeZoom;
    }
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
  isMindmap,
  isTreeView,
  isTreemap,
  isIshikawa,
  isTimeline,
  isJourney,
  isKanban,
  isPacket,
  isQuadrant,
  isXYChart,
  isRadar,
  isVenn,
  isRequirement,
  isUsecase,
  isBlock,
  isArchitecture,
  isGitGraph,
  isSankey,
  isWardley,
  isCynefin,
  isEventModeling,
  isC4,
  isZenUML,
  isSwimlanes,
  exportPng,
  downloadPng,
};

export type { PngExportOptions };
export { exportPng, downloadPng };

// 主题再导出，便于外部自定义
export { defaultTheme, neutralTheme, forestTheme, darkTheme, themes, getTheme } from './themes';
export type { MermaidTheme, NodeCategory, CategoryStyle, EdgeStyle } from './themes';
export type { ParseResult, MermaidAST, MermaidType } from './ast';