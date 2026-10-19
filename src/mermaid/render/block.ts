/**
 * block-beta 渲染器 —— 只建模板 + 装配模型（数据由 mapper/block 提供）。
 *
 * 节点：Block（figure 由数据驱动的形状块）、GroupBox（zOrder=-1 垫底的标题框）。
 * 连线：正交路由 + 可选 Standard 箭头（visible 由 arrow 标志控制）+ 中点标签。
 * 坐标全部来自 mapper（loc/w/h），渲染层零布局数学。
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
import { RoutingOrthogonal, CurveNone } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedBlockNode, MappedBlockLink } from '../mapper/block';

/** 块节点：形状 figure 由数据字段驱动 */
function buildBlockNode(theme: MermaidTheme): Node {
  const cs = theme.categories.process;
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const shape = new Shape('Rectangle');
  shape.portId = '';
  shape.strokeWidth = cs.strokeWidth;
  shape.bind('figure', 'figure');
  shape.bind('parameter1', 'param');
  shape.bind('fill', 'fill');
  shape.bind('stroke', 'stroke');
  shape.bind('width', 'w');
  shape.bind('height', 'h');
  node.add(shape);

  const tb = new TextBlock();
  tb.margin = new Margin(6, 10, 6, 10);
  tb.textAlign = 'center';
  tb.isMultiline = true;
  tb.stroke = '#000000';
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 组盒（嵌套块背景，垫底 zOrder=-1） */
function buildGroupBox(theme: MermaidTheme): Node {
  const cs = theme.categories.group;
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  node.movable = false;
  node.zOrder = -1;

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

/** 连线：正交 + 可选箭头 + 标签 */
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
  path.strokeWidth = 1.5;
  link.add(path);

  const arrow = new Shape('Standard');
  arrow.scale = 1.0;
  arrow.strokeWidth = 0;
  arrow.fill = es.solid;
  arrow.bind('visible', 'arrow', (a: boolean | undefined) => a !== false);
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

/** 渲染 block 到 div（data = mapBlock 的输出） */
export function renderBlock(
  divId: string,
  data: { nodes: MappedBlockNode[]; links?: MappedBlockLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('Block', buildBlockNode(theme));
  diag.nodeTemplateMap.add('GroupBox', buildGroupBox(theme));
  diag.linkTemplate = buildLink(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links ?? [],
  } as any);
  return diag;
}
