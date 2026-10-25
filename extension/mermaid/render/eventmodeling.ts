/**
 * eventmodeling 渲染器 —— 只建模板 + 装配模型（坐标由 mapper/eventmodeling 算好）。
 *
 * Lane：浅灰泳道带（垫底，左侧竖排标题）；Sep：列间浅分隔线（垫底）；
 * ColHead：列头（num）；Card：RoundedRectangle 帧卡片（标题 + data 小字）。
 * 连线：正交路由 + 箭头 + 虚线/标签。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { Panel } from '../../../src/view/Panel';
import { Link } from '../../../src/view/Link';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import { Size } from '../../../src/core/Size';
import { RoutingOrthogonal, CurveNone, WrapFit } from '../../../src/core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedEventNode, MappedEventLink } from '../mapper/eventmodeling';

/** 泳道带（垫底 + 左侧竖排标题） */
function buildLane(theme: MermaidTheme): Node {
  const cs = theme.categories.group;
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  node.movable = false;
  (node as any).zOrder = -1;

  const bg = new Shape('Rectangle');
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  bg.fill = cs.fill;
  bg.stroke = cs.stroke;
  bg.strokeWidth = cs.strokeWidth;
  node.add(bg);

  const title = new TextBlock();
  title.angle = 270;
  title.alignment = Spot.Left;
  title.margin = new Margin(0, 0, 0, 14);
  title.font = `bold ${theme.fontSize.label}px ${theme.fontFamily}`;
  title.stroke = cs.text;
  title.bind('text', 'text');
  title.bind('stroke', 'textCol');
  node.add(title);
  return node;
}

/** 列间分隔线（垫底） */
function buildSep(): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  node.movable = false;
  (node as any).zOrder = -1;
  const line = new Shape('Rectangle');
  line.width = 1;
  line.bind('height', 'h');
  line.stroke = 'transparent';
  line.bind('fill', 'fill');
  node.add(line);
  return node;
}

/** 列头（时间帧行号） */
function buildColHead(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `bold ${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#000000';
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 帧卡片：RoundedRectangle + 标题 + data 小字 */
function buildCard(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.isShadowed = true;
  node.shadowColor = theme.shadow.color;
  node.shadowBlur = theme.shadow.blur;

  const bg = new Shape('RoundedRectangle');
  bg.parameter1 = theme.nodeRadius;
  bg.strokeWidth = 1;
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  bg.bind('fill', 'fill');
  bg.bind('stroke', 'stroke');
  node.add(bg);

  const col = new Panel('Vertical');
  col.alignment = Spot.Center;

  const tb = new TextBlock();
  tb.margin = new Margin(6, 8, 2, 8);
  tb.textAlign = 'center';
  tb.isMultiline = true;
  tb.wrap = WrapFit;
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  tb.bind('maxSize', 'w', (w: number) => new Size(Math.max((w ?? 150) - 16, 40), NaN));
  col.add(tb);

  const sub = new TextBlock();
  sub.margin = new Margin(0, 8, 6, 8);
  sub.textAlign = 'center';
  sub.isMultiline = true;
  sub.wrap = WrapFit;
  sub.opacity = 0.78;
  sub.font = `${Math.max(theme.fontSize.label - 1, 9)}px ${theme.fontFamily}`;
  sub.bind('text', 'sub');
  sub.bind('stroke', 'textCol');
  sub.bind('visible', 'sub', (s?: string) => !!s);
  col.add(sub);

  node.add(col);
  return node;
}

/** 连线：正交 + 箭头 + 虚线 + 标签 */
function buildLink(theme: MermaidTheme): Link {
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
  path.strokeWidth = 2;
  path.bind('strokeDashArray', 'dash', (d?: boolean) => (d ? [6, 4] : null));
  link.add(path);

  const arrow = new Shape();
  arrow.toArrow = 'Standard';
  arrow.scale = 1.1;
  arrow.strokeWidth = 0;
  arrow.fill = es.solid;
  link.add(arrow);

  const labelPanel = new Panel('Auto');
  labelPanel.visible = false;
  labelPanel.bind('visible', 'label', (l?: string) => typeof l === 'string' && l.length > 0);
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

/** 渲染 eventmodeling 到 div（data = mapEventModeling 的输出） */
export function renderEventModeling(
  divId: string,
  data: { nodes: MappedEventNode[]; links?: MappedEventLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('Lane', buildLane(theme));
  diag.nodeTemplateMap.add('Sep', buildSep());
  diag.nodeTemplateMap.add('ColHead', buildColHead(theme));
  diag.nodeTemplateMap.add('Card', buildCard(theme));
  diag.linkTemplate = buildLink(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links ?? [],
  } as any);
  return diag;
}
