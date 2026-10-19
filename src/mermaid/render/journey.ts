/**
 * journey 渲染器 —— 只建模板 + 装配模型（数据由 mapper/journey 提供）。
 *
 * section 标题条（series 色底 + 对比文字）+ 分数柱 + 分数/任务名/角色文本 + 基准线。
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import { WrapFit } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedJourneyNode } from '../mapper/journey';

/** 渲染 journey 到 div（data = mapJourney 的输出） */
export function renderJourney(divId: string, data: { nodes: MappedJourneyNode[] }, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('JTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('JAxis', buildAxisNode());
  diag.nodeTemplateMap.add('JSection', buildSectionNode(theme));
  diag.nodeTemplateMap.add('JBar', buildBarNode());
  diag.nodeTemplateMap.add('JScore', buildScoreNode(theme));
  diag.nodeTemplateMap.add('JLabel', buildLabelNode(theme));
  diag.nodeTemplateMap.add('JActors', buildActorsNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

/** 标题节点 */
function buildTitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.margin = new Margin(4);
  tb.font = `bold ${theme.fontSize.title}px ${theme.fontFamily}`;
  tb.stroke = '#222';
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 基准线（geometryString） */
function buildAxisNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const line = new Shape();
  line.portId = '';
  line.fill = 'transparent';
  line.stroke = '#000000';
  line.strokeWidth = 1;
  line.bind('geometryString', 'geo');
  line.bind('stroke', 'stroke');
  node.add(line);
  return node;
}

/** section 标题条（Spot 面板：底条 + 居中文字） */
function buildSectionNode(theme: MermaidTheme): Node {
  const node = new Node('Spot');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const bar = new Shape('Rectangle');
  bar.portId = '';
  bar.fill = '#555555';
  bar.stroke = 'transparent';
  bar.bind('fill', 'fill');
  bar.bind('width', 'w');
  bar.bind('height', 'h');
  node.add(bar);
  const tb = new TextBlock();
  tb.margin = new Margin(2, 8, 2, 8);
  tb.font = `bold ${theme.fontSize.label + 1}px ${theme.fontFamily}`;
  tb.textAlign = 'center';
  tb.stroke = '#ffffff';
  tb.wrap = WrapFit;
  tb.alignment = Spot.Center;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 分数柱 */
function buildBarNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const bar = new Shape('Rectangle');
  bar.portId = '';
  bar.fill = '#999999';
  bar.stroke = 'transparent';
  bar.bind('fill', 'fill');
  bar.bind('width', 'w');
  bar.bind('height', 'h');
  node.add(bar);
  return node;
}

/** 柱上分数 */
function buildScoreNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.margin = new Margin(0, 4, 0, 4);
  tb.font = `bold ${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#333';
  tb.textAlign = 'center';
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 柱下任务名 */
function buildLabelNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.margin = new Margin(2, 4, 2, 4);
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#333';
  tb.textAlign = 'center';
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 柱底角色小字 */
function buildActorsNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.margin = new Margin(1, 4, 1, 4);
  tb.font = `${theme.fontSize.label - 1}px ${theme.fontFamily}`;
  tb.stroke = '#777';
  tb.textAlign = 'center';
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}
