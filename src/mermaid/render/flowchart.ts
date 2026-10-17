/**
 * flowchart 渲染器 —— 把映射后的数据装配为 GoJS Diagram。
 *
 * - 按主题构建各形状的 Node 模板（process/decision/startend/…）
 * - 连线模板支持实线/虚线/粗线、箭头、标签、双向箭头
 * - subgraph 渲染为 Group
 * - 布局按方向选用 LayeredDigraphLayout
 * - 默认开启 undo、缩放平移、链接交互（"开放基础交互"）
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Group } from '../../view/Group';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Panel } from '../../view/Panel';
import { Link } from '../../view/Link';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Point } from '../../core/Point';
import { Size } from '../../core/Size';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import {
  LayeredDigraphDirectionDown,
  LayeredDigraphDirectionRight,
  LayeredDigraphDirectionUp,
  LayeredDigraphDirectionLeft,
  WrapFit,
  RoutingOrthogonal,
  CurveNone,
} from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedFlowchart, FlowCategory } from '../mapper/flowchart';
import { LayeredDigraphLayout } from '../../layout/LayeredDigraphLayout';

/** 由 flowchart 方向映射到 LayeredDigraphLayout 方向常量 */
function layoutDirection(dir: string): number {
  switch (dir) {
    case 'BT': return LayeredDigraphDirectionUp;
    case 'LR': return LayeredDigraphDirectionRight;
    case 'RL': return LayeredDigraphDirectionLeft;
    case 'TD':
    case 'TB':
    default: return LayeredDigraphDirectionDown;
  }
}

/** 节点形状 → GoJS figure 名 */
function figureOf(category: FlowCategory): string {
  switch (category) {
    case 'Decision': return 'Diamond';
    case 'StartEnd': return 'RoundedRectangle';
    case 'Subroutine': return 'Subroutine';
    case 'Cylinder': return 'Cylinder1';
    case 'Circle': return 'Circle';
    case 'Parallelogram': return 'Parallelogram1';
    case 'Hexagon': return 'Hexagon';
    case '':
    default: return 'RoundedRectangle';
  }
}

/** 为某类别取主题配色（无则回落 process） */
function styleFor(theme: MermaidTheme, category: FlowCategory) {
  return (theme.categories as any)[category] ?? theme.categories.process;
}

/** 构建某类别的节点模板 */
function buildNodeTemplate(theme: MermaidTheme, category: FlowCategory): Node {
  const cs = styleFor(theme, category);
  const isCircle = category === 'Circle';
  const isDecision = category === 'Decision';

  const node = new Node('Auto');
  node.locationSpot = Spot.Center;
  node.selectionAdorned = true;

  const shape = new Shape(figureOf(category));
  shape.portId = '';
  shape.cursor = 'pointer';
  shape.fill = cs.fill;
  shape.stroke = cs.stroke;
  shape.strokeWidth = cs.strokeWidth;
  shape.fromLinkable = true;
  shape.toLinkable = true;
  shape.fromSpot = Spot.AllSides;
  shape.toSpot = Spot.AllSides;
  if (!isCircle && !isDecision) shape.parameter1 = theme.nodeRadius;
  node.add(shape);

  const tb = new TextBlock();
  tb.margin = isCircle || isDecision ? new Margin(6) : new Margin(8, 12, 8, 12);
  tb.maxSize = new Size(160, NaN);
  tb.wrap = WrapFit;
  tb.textAlign = 'center';
  tb.stroke = cs.text;
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  node.add(tb);

  node.isShadowed = true;
  node.shadowColor = theme.shadow.color;
  node.shadowBlur = theme.shadow.blur;
  node.shadowOffset = new Point(2, 3);
  return node;
}

/** 构建 subgraph Group 模板 */
function buildGroupTemplate(theme: MermaidTheme): Group {
  const cs = theme.categories.group;
  const g = new Group('Auto');
  const gl = new LayeredDigraphLayout({
    direction: LayeredDigraphDirectionDown,
    layerSpacing: 40,
    columnSpacing: 30,
  } as any);
  g.layout = gl;
  g.selectable = true;

  const bg = new Shape('RoundedRectangle');
  bg.fill = cs.fill;
  bg.stroke = cs.stroke;
  bg.strokeWidth = cs.strokeWidth;
  bg.parameter1 = theme.nodeRadius + 2;
  bg.strokeDashArray = [4, 3];
  g.add(bg);

  const title = new TextBlock();
  title.font = `bold ${theme.fontSize.label}px ${theme.fontFamily}`;
  title.stroke = cs.text;
  title.margin = new Margin(6, 10, 2, 10);
  title.alignment = Spot.Top;
  title.bind('text', 'text');
  g.add(title);
  return g;
}

/** 构建连线模板 */
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

  // 主线：可由数据字段 dash/thick/stroke 控制
  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = es.solid;
  path.strokeWidth = 2;
  path.bind('strokeWidth', 'thick', (t: boolean) => (t ? 3 : 2));
  path.bind('stroke', 'stroke');
  path.bind('strokeDashArray', 'dash');
  link.add(path);

  // 箭头：noArrow 隐藏 / bothArrow 双向
  const arrow = new Shape();
  arrow.name = 'ARROW';
  arrow.toArrow = 'Standard';
  arrow.scale = 1.2;
  arrow.strokeWidth = 0;
  arrow.fill = es.solid;
  arrow.bind('fill', 'stroke');
  arrow.bind('visible', 'noArrow', (v: boolean) => !v);
  link.add(arrow);

  // 反向箭头（双向时显示）
  const arrowFrom = new Shape();
  arrowFrom.name = 'ARROWFROM';
  arrowFrom.fromArrow = 'Standard';
  arrowFrom.scale = 1.2;
  arrowFrom.strokeWidth = 0;
  arrowFrom.fill = es.solid;
  arrowFrom.visible = false;
  arrowFrom.bind('fill', 'stroke');
  arrowFrom.bind('visible', 'bothArrow');
  link.add(arrowFrom);

  // 标签
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

/** 装配 Diagram（div 已就绪） */
export function renderFlowchart(
  divId: string,
  data: MappedFlowchart,
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = true;

  // 布局
  const layout = new LayeredDigraphLayout({
    direction: layoutDirection(data.dir),
    layerSpacing: 40,
    columnSpacing: 30,
  } as any);
  diag.layout = layout;

  // 节点模板（各形状 + 默认）
  diag.nodeTemplateMap.add('', buildNodeTemplate(theme, ''));
  diag.nodeTemplateMap.add('Decision', buildNodeTemplate(theme, 'Decision'));
  diag.nodeTemplateMap.add('StartEnd', buildNodeTemplate(theme, 'StartEnd'));
  diag.nodeTemplateMap.add('Subroutine', buildNodeTemplate(theme, 'Subroutine'));
  diag.nodeTemplateMap.add('Cylinder', buildNodeTemplate(theme, 'Cylinder'));
  diag.nodeTemplateMap.add('Circle', buildNodeTemplate(theme, 'Circle'));
  diag.nodeTemplateMap.add('Parallelogram', buildNodeTemplate(theme, 'Parallelogram'));
  diag.nodeTemplateMap.add('Hexagon', buildNodeTemplate(theme, 'Hexagon'));
  diag.nodeTemplateMap.add('Group', buildGroupTemplate(theme) as any);

  // 连线模板
  diag.linkTemplate = buildLinkTemplate(theme);

  // 模型数据
  const nodeDataArray: any[] = [];
  const linkDataArray: any[] = [];
  for (const n of data.nodes) {
    const d: any = { key: n.key, text: n.text, category: n.category };
    if (n.group) d.group = n.group;
    if (n.isGroup) d.isGroup = true;
    if (n.categoryDef) {
      if (n.categoryDef.fill) d.fill = n.categoryDef.fill;
      if (n.categoryDef.stroke) d.stroke = n.categoryDef.stroke;
      if (n.categoryDef.color) d.textColor = n.categoryDef.color;
    }
    if (n.styleProps) {
      if (n.styleProps.fill) d.fill = n.styleProps.fill;
      if (n.styleProps.stroke) d.stroke = n.styleProps.stroke;
      if (n.styleProps.color) d.textColor = n.styleProps.color;
    }
    nodeDataArray.push(d);
  }
  for (const l of data.links) {
    const d: any = { from: l.from, to: l.to, label: l.label };
    if (l.kind === 'dotted' || l.kind === 'dashed') d.dash = l.strokeDashArray;
    if (l.kind === 'thick') d.thick = true;
    if (l.arrow === 'none') d.noArrow = true;
    if (l.arrow === 'both') d.bothArrow = true;
    if ((l as any).stroke) d.stroke = (l as any).stroke;
    linkDataArray.push(d);
  }

  diag.model = new GraphLinksModel({ nodeDataArray, linkDataArray } as any);
  return diag;
}