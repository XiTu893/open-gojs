/**
 * cynefin 渲染器 —— 只建模板 + 装配模型（数据由 mapper/cynefin 提供，零布局数学）。
 *
 * - 四域框 = Rectangle（浅灰底黑边，w/h 数据驱动）+ 域标题粗体 + 副标题小字
 * - items 徽章 = 小 RoundedRectangle 条（纵排由 mapper 定位）
 * - confusion = 中央 Ellipse；transitions = 跨域正交箭头连线（带标签）
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Link } from '../../view/Link';
import { Panel } from '../../view/Panel';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import {
  WrapFit,
  RoutingOrthogonal,
  CurveNone,
} from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedCynefinNode, MappedCynefinLink } from '../mapper/cynefin';

/** 总标题 */
function buildTitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `bold ${theme.fontSize.title}px ${theme.fontFamily}`;
  tb.stroke = '#222222';
  tb.textAlign = 'center';
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 域框 / confusion 椭圆（figure 固定，w/h/fill/stroke 数据驱动） */
function buildBoxNode(figure: string): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const rect = new Shape(figure);
  rect.portId = '';
  rect.fill = 'rgba(0,0,0,0.05)';
  rect.stroke = '#000000';
  rect.strokeWidth = 1.5;
  rect.bind('fill', 'fill');
  rect.bind('stroke', 'stroke');
  rect.bind('width', 'w');
  rect.bind('height', 'h');
  node.add(rect);
  return node;
}

/** confusion 椭圆（中心定位） */
function buildEllipseNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = true;
  const e = new Shape('Ellipse');
  e.portId = '';
  e.fill = '#ffffff';
  e.stroke = '#000000';
  e.strokeWidth = 1.5;
  e.bind('fill', 'fill');
  e.bind('stroke', 'stroke');
  e.bind('width', 'w');
  e.bind('height', 'h');
  node.add(e);
  return node;
}

/** 域标题（粗体，支持 confusion 居中） */
function buildDomainTitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `bold ${theme.fontSize.node + 1}px ${theme.fontFamily}`;
  tb.stroke = '#111111';
  tb.wrap = WrapFit;
  tb.margin = new Margin(1, 3, 1, 3);
  tb.bind('text', 'text');
  tb.bind('textAlign', 'align');
  node.add(tb);
  return node;
}

/** 副标题小字 */
function buildSubNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${theme.fontSize.label - 1}px ${theme.fontFamily}`;
  tb.stroke = '#666666';
  tb.wrap = WrapFit;
  tb.margin = new Margin(0, 3, 0, 3);
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** items 徽章（小圆角条，w/h 数据驱动） */
function buildItemNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const bg = new Shape('RoundedRectangle');
  bg.portId = '';
  bg.parameter1 = 6;
  bg.fill = '#ffffff';
  bg.stroke = '#8c8c8c';
  bg.strokeWidth = 1;
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  node.add(bg);
  const tb = new TextBlock();
  tb.margin = new Margin(2, 8, 2, 8);
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#222222';
  tb.wrap = WrapFit;
  tb.textAlign = 'center';
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 跨域转移连线：正交箭头 + 标签 */
function buildLinkTemplate(theme: MermaidTheme): Link {
  const es = theme.edge;
  const link = new Link();
  link.routing = RoutingOrthogonal;
  link.curve = CurveNone;
  link.corner = 10;
  link.toShortLength = 4;
  link.relinkableFrom = false;
  link.relinkableTo = false;
  link.reshapable = false;
  link.selectionAdorned = true;

  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = es.solid;
  path.strokeWidth = 2;
  link.add(path);

  const arrow = new Shape();
  arrow.toArrow = 'Standard';
  arrow.scale = 1.2;
  arrow.strokeWidth = 0;
  arrow.fill = es.solid;
  link.add(arrow);

  const labelPanel = new Panel('Auto');
  labelPanel.visible = false;
  labelPanel.bind('visible', 'label', (l: string) => typeof l === 'string' && l.length > 0);
  const labelBg = new Shape('RoundedRectangle');
  labelBg.fill = es.labelBg;
  labelBg.stroke = 'transparent';
  labelBg.parameter1 = 4;
  labelPanel.add(labelBg);
  const labelText = new TextBlock();
  labelText.margin = new Margin(2, 4, 2, 4);
  labelText.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  labelText.stroke = es.label;
  labelText.bind('text', 'label');
  labelPanel.add(labelText);
  link.add(labelPanel);

  return link;
}

/** 渲染 cynefin 到 div（data = mapCynefin 的输出） */
export function renderCynefin(
  divId: string,
  data: { nodes: MappedCynefinNode[]; links: MappedCynefinLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('CynefinTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('CynefinBox', buildBoxNode('Rectangle'));
  diag.nodeTemplateMap.add('CynefinEllipse', buildEllipseNode());
  diag.nodeTemplateMap.add('CynefinDomainTitle', buildDomainTitleNode(theme));
  diag.nodeTemplateMap.add('CynefinSub', buildSubNode(theme));
  diag.nodeTemplateMap.add('CynefinItem', buildItemNode(theme));

  diag.linkTemplate = buildLinkTemplate(theme);

  const linkDataArray = data.links.map(l => ({
    from: l.from, to: l.to, label: l.label,
  }));
  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes as any[],
    linkDataArray,
  } as any);
  return diag;
}
