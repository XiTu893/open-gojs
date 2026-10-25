/**
 * usecase 渲染器 —— 只建模板 + 装配模型（数据由 mapper/usecase 提供）。
 *
 * 节点：Actor（火柴人 + 下方标签）、Usecase（椭圆）、UsecaseRect（矩形）、
 * GroupBox（zOrder=-1 垫底的标题框）。
 * 连线：按 kind 绑 toArrow（generalization=空心 Triangle、其余 Standard）、
 * strokeDashArray（include/extend 虚线）、标签（visible 由 label 控制）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { Link } from '../../../src/view/Link';
import { Panel } from '../../../src/view/Panel';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import { RoutingOrthogonal, CurveNone } from '../../../src/core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedUsecaseNode, MappedUsecaseLink } from '../mapper/usecase';

/** Actor：火柴人 + 下方标签 */
function buildActor(theme: MermaidTheme): Node {
  const node = new Node('Vertical');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  node.isShadowed = false;

  const fig = new Shape('Actor');
  fig.width = 56;
  fig.height = 84;
  fig.fill = '#ffffff';
  fig.stroke = theme.categories.process.stroke;
  fig.strokeWidth = theme.categories.process.strokeWidth;
  node.add(fig);

  const tb = new TextBlock();
  tb.margin = new Margin(2, 4, 0, 4);
  tb.textAlign = 'center';
  tb.stroke = theme.categories.process.text;
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 椭圆用例 */
function buildUsecase(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const shape = new Shape('Ellipse');
  shape.strokeWidth = theme.categories.process.strokeWidth;
  shape.bind('fill', 'fill');
  shape.bind('stroke', 'stroke');
  shape.bind('width', 'w');
  shape.bind('height', 'h');
  node.add(shape);

  const tb = new TextBlock();
  tb.margin = new Margin(6, 14, 6, 14);
  tb.textAlign = 'center';
  tb.isMultiline = true;
  tb.stroke = '#000000';
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 矩形用例 */
function buildUsecaseRect(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const shape = new Shape('Rectangle');
  shape.strokeWidth = theme.categories.process.strokeWidth;
  shape.bind('fill', 'fill');
  shape.bind('stroke', 'stroke');
  shape.bind('width', 'w');
  shape.bind('height', 'h');
  node.add(shape);

  const tb = new TextBlock();
  tb.margin = new Margin(6, 14, 6, 14);
  tb.textAlign = 'center';
  tb.isMultiline = true;
  tb.stroke = '#000000';
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 边界组盒（垫底，zOrder=-1） */
function buildGroupBox(theme: MermaidTheme): Node {
  const cs = theme.categories.group;
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  node.movable = false;
  (node as any).zOrder = -1;

  const bg = new Shape('RoundedRectangle');
  bg.parameter1 = theme.nodeRadius + 2;
  bg.fill = cs.fill;
  bg.stroke = cs.stroke;
  bg.strokeWidth = cs.strokeWidth;
  bg.strokeDashArray = [4, 3];
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  node.add(bg);

  const title = new TextBlock();
  title.font = `bold ${theme.fontSize.label}px ${theme.fontFamily}`;
  title.stroke = cs.text;
  title.margin = new Margin(6, 10, 2, 10);
  title.alignment = Spot.Top;
  title.bind('text', 'title');
  node.add(title);
  return node;
}

/** 连线：按 kind 绑箭头/虚线/标签 */
function buildLink(theme: MermaidTheme): Link {
  const es = theme.edge;
  const link = new Link();
  link.routing = RoutingOrthogonal;
  link.curve = CurveNone;
  link.corner = 8;
  link.selectionAdorned = false;
  link.relinkableFrom = false;
  link.relinkableTo = false;
  link.reshapable = false;

  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = es.solid;
  path.strokeWidth = 1;
  path.bind('strokeDashArray', 'kind', (k: string) =>
    k === 'include' || k === 'extend' ? [4, 4] : null
  );
  link.add(path);

  const arrow = new Shape('Standard');
  arrow.scale = 1.0;
  arrow.strokeWidth = 0;
  arrow.fill = es.solid;
  arrow.bind('toArrow', 'kind', (k: string) => (k === 'generalization' ? 'Triangle' : 'Standard'));
  // generalization 用空心 Triangle（UML 泛化箭头）：填背景色 + 线色描边
  arrow.bind('fill', 'kind', (k: string) => (k === 'generalization' ? theme.background : es.solid));
  arrow.bind('stroke', 'kind', (k: string) => (k === 'generalization' ? es.solid : 'transparent'));
  arrow.bind('strokeWidth', 'kind', (k: string) => (k === 'generalization' ? 1.5 : 0));
  link.add(arrow);

  const labelPanel = new Panel('Auto');
  labelPanel.visible = false;
  labelPanel.bind('visible', 'label', (l: string | undefined) => !!l);
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

/** 渲染 usecase 到 div（data = mapUsecase 的输出） */
export function renderUsecase(
  divId: string,
  data: { nodes: MappedUsecaseNode[]; links?: MappedUsecaseLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('Actor', buildActor(theme));
  diag.nodeTemplateMap.add('Usecase', buildUsecase(theme));
  diag.nodeTemplateMap.add('UsecaseRect', buildUsecaseRect(theme));
  diag.nodeTemplateMap.add('GroupBox', buildGroupBox(theme));
  diag.linkTemplate = buildLink(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links ?? [],
  } as any);
  return diag;
}
