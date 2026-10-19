/**
 * mindmap 渲染器 —— 只建模板 + 装配模型（数据由 mapper/mindmap 提供）。
 *
 * 形状按 category（root/circle/square/rounded/hexagon）映射 figure；
 * 连线为无箭头直线（中线 Shape）。
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Link } from '../../view/Link';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import { WrapFit } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedMindmapNode, MappedMindmapLink } from '../mapper/mindmap';

/** category → GoJS figure */
function figureOf(category: string): string {
  switch (category) {
    case 'root':
    case 'circle': return 'Ellipse';
    case 'square': return 'Rectangle';
    case 'hexagon': return 'Hexagon';
    case 'rounded':
    default: return 'RoundedRectangle';
  }
}

/** 构建某形状的节点模板 */
function buildNodeTemplate(theme: MermaidTheme, category: string): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const shape = new Shape(figureOf(category));
  shape.portId = '';
  shape.fill = '#ffffff';
  shape.stroke = '#000000';
  shape.strokeWidth = 1.5;
  if (category === 'rounded') shape.parameter1 = theme.nodeRadius;
  shape.bind('fill', 'fill');
  shape.bind('stroke', 'stroke');
  node.add(shape);

  const tb = new TextBlock();
  tb.margin = category === 'root' ? new Margin(10, 16, 10, 16) : new Margin(6, 12, 6, 12);
  tb.wrap = WrapFit;
  tb.textAlign = 'center';
  tb.stroke = '#000000';
  tb.font = category === 'root'
    ? `bold ${theme.fontSize.title}px ${theme.fontFamily}`
    : `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 无箭头直线连线模板 */
function buildLinkTemplate(theme: MermaidTheme): Link {
  const link = new Link();
  link.selectable = true;
  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = theme.edge.solid;
  path.strokeWidth = 1.2;
  link.add(path);
  return link;
}

/** 渲染 mindmap 到 div（data = mapMindmap 的输出） */
export function renderMindmap(
  divId: string,
  data: { nodes: MappedMindmapNode[]; links?: MappedMindmapLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  for (const cat of ['root', 'circle', 'square', 'rounded', 'hexagon']) {
    diag.nodeTemplateMap.add(cat, buildNodeTemplate(theme, cat));
  }
  diag.linkTemplate = buildLinkTemplate(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links ?? [],
  } as any);
  return diag;
}
