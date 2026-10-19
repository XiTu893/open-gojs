/**
 * wardley 渲染器 —— 只建模板 + 装配模型（数据由 mapper/wardley 提供，零布局数学）。
 *
 * - 背景：外框 / 分区浅灰带 / 竖分隔线 / 区段与轴标签 / 标题
 * - 组件 = Ellipse 小点 + 名称标签；decorator = Triangle/Diamond/Rectangle/Ellipse 小符号
 * - 连线：flow 带箭头、依赖无箭头；evolve = dash + 箭头（水平虚线，同组件行）
 * - note = 浅底圆角文本框（中心对齐）
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
import { MappedWardleyNode, MappedWardleyLink } from '../mapper/wardley';

/** 有固定 w/h 的矩形底（外框/灰带/分隔线） */
function buildRectNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const rect = new Shape('Rectangle');
  rect.portId = '';
  rect.fill = 'transparent';
  rect.stroke = 'transparent';
  rect.bind('fill', 'fill');
  rect.bind('stroke', 'stroke');
  rect.bind('width', 'w');
  rect.bind('height', 'h');
  node.add(rect);
  return node;
}

/** 文本节点（标题/区段/轴/标签），textAlign 与 bold 可由数据驱动 */
function buildTextNode(theme: MermaidTheme, size: 'title' | 'node' | 'label', bold = false): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${bold ? 'bold ' : ''}${theme.fontSize[size]}px ${theme.fontFamily}`;
  tb.stroke = '#222222';
  tb.wrap = WrapFit;
  tb.margin = new Margin(1, 3, 1, 3);
  tb.bind('text', 'text');
  tb.bind('font', 'bold', (b: boolean) =>
    `${b ? 'bold ' : ''}${theme.fontSize[size]}px ${theme.fontFamily}`);
  tb.bind('textAlign', 'align');
  node.add(tb);
  return node;
}

/** 组件/anchor 圆点 */
function buildPointNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const dot = new Shape('Ellipse');
  dot.portId = '';
  dot.fill = '#555555';
  dot.stroke = '#000000';
  dot.strokeWidth = 1;
  dot.bind('fill', 'fill');
  dot.bind('stroke', 'stroke');
  dot.bind('width', 'w');
  dot.bind('height', 'h');
  node.add(dot);
  return node;
}

/** decorator 符号（figure 由数据驱动） */
function buildDecoratorNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const s = new Shape('Triangle');
  s.portId = '';
  s.fill = '#ffffff';
  s.stroke = '#000000';
  s.strokeWidth = 1;
  s.bind('figure', 'figure');
  s.bind('fill', 'fill');
  s.bind('stroke', 'stroke');
  s.bind('width', 'w');
  s.bind('height', 'h');
  node.add(s);
  return node;
}

/** note 浅底文本框（中心对齐到 [vis,evo] 点） */
function buildNoteNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const bg = new Shape('RoundedRectangle');
  bg.portId = '';
  bg.parameter1 = 6;
  bg.fill = 'rgba(255,255,255,0.92)';
  bg.stroke = theme.edge.dashed;
  bg.strokeWidth = 1;
  node.add(bg);
  const tb = new TextBlock();
  tb.margin = new Margin(5, 9, 5, 9);
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#333333';
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 连线：flow 带箭头 / 依赖无箭头；dashed 驱动虚线；label 驱动标签 */
function buildLinkTemplate(theme: MermaidTheme): Link {
  const es = theme.edge;
  const link = new Link();
  link.routing = RoutingOrthogonal;
  link.curve = CurveNone;
  link.corner = 8;
  link.toShortLength = 4;
  link.relinkableFrom = false;
  link.relinkableTo = false;
  link.reshapable = false;
  link.selectionAdorned = true;

  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = es.solid;
  path.strokeWidth = 1.5;
  path.bind('strokeDashArray', 'dashed', (d: boolean) => (d ? [5, 4] : undefined));
  link.add(path);

  const arrow = new Shape();
  arrow.toArrow = 'Standard';
  arrow.scale = 1.1;
  arrow.strokeWidth = 0;
  arrow.fill = es.solid;
  arrow.bind('visible', 'flow');
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

/** 渲染 wardley 到 div（data = mapWardley 的输出） */
export function renderWardley(
  divId: string,
  data: { nodes: MappedWardleyNode[]; links: MappedWardleyLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('WardleyTitle', buildTextNode(theme, 'title', true));
  diag.nodeTemplateMap.add('WardleyFrame', buildRectNode());
  diag.nodeTemplateMap.add('WardleyBand', buildRectNode());
  diag.nodeTemplateMap.add('WardleyDivider', buildRectNode());
  diag.nodeTemplateMap.add('WardleySection', buildTextNode(theme, 'label'));
  diag.nodeTemplateMap.add('WardleyAxis', buildTextNode(theme, 'label'));
  diag.nodeTemplateMap.add('WardleyPoint', buildPointNode());
  diag.nodeTemplateMap.add('WardleyLabel', buildTextNode(theme, 'node'));
  diag.nodeTemplateMap.add('WardleyDecorator', buildDecoratorNode());
  diag.nodeTemplateMap.add('WardleyNote', buildNoteNode(theme));

  diag.linkTemplate = buildLinkTemplate(theme);

  const linkDataArray = data.links.map(l => ({
    from: l.from, to: l.to, flow: l.flow, label: l.label, dashed: l.dashed,
  }));
  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes as any[],
    linkDataArray,
  } as any);
  return diag;
}
