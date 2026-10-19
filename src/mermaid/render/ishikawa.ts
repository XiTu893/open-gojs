/**
 * ishikawa 渲染器 —— 只建模板 + 装配模型（数据由 mapper/ishikawa 提供）。
 *
 * 骨线全部是 category:'Bone' 的 geometryString 节点（mapper 已算好坐标）；
 * 鱼头 = 问题（大圆角矩形），类别粗体标签，原因普通文本。
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
import { MappedIshikawaNode } from '../mapper/ishikawa';

/** 骨线：geometryString Shape（无填充，仅描边） */
function buildBoneNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  node.isLayoutPositioned = false;

  const line = new Shape();
  line.portId = '';
  line.fill = 'transparent';
  line.stroke = theme.edge.solid;
  line.strokeWidth = 1.5;
  line.bind('geometryString', 'geo');
  line.bind('stroke', 'stroke');
  node.add(line);
  return node;
}

/** 鱼头（问题） */
function buildProblemNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.Center;
  node.selectable = true;

  const shape = new Shape('RoundedRectangle');
  shape.portId = '';
  shape.parameter1 = 14;
  shape.fill = '#ffffff';
  shape.stroke = '#000000';
  shape.strokeWidth = 2;
  shape.bind('fill', 'fill');
  shape.bind('stroke', 'stroke');
  node.add(shape);

  const tb = new TextBlock();
  tb.margin = new Margin(12, 18, 12, 18);
  tb.wrap = WrapFit;
  tb.textAlign = 'center';
  tb.stroke = '#000000';
  tb.font = `bold ${theme.fontSize.title}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 类别标签（粗体） */
function buildCategoryNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const tb = new TextBlock();
  tb.margin = new Margin(2, 6, 2, 6);
  tb.wrap = WrapFit;
  tb.stroke = '#000000';
  tb.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 原因文本 */
function buildCauseNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const tb = new TextBlock();
  tb.margin = new Margin(1, 4, 1, 4);
  tb.wrap = WrapFit;
  tb.stroke = '#000000';
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 渲染 ishikawa 到 div（data = mapIshikawa 的输出） */
export function renderIshikawa(
  divId: string,
  data: { nodes: MappedIshikawaNode[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('Bone', buildBoneNode(theme));
  diag.nodeTemplateMap.add('Problem', buildProblemNode(theme));
  diag.nodeTemplateMap.add('Category', buildCategoryNode(theme));
  diag.nodeTemplateMap.add('Cause', buildCauseNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}
