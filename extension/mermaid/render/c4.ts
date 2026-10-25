/**
 * C4 渲染器 —— 只建模板 + 装配模型（坐标由 mapper/c4 算好）。
 *
 * C4Node：矩形节点（«type» 小字 + 标签；ext 虚线边框）；
 * GroupBox：boundary 浅灰容器（垫底，zOrder=-1，尺寸/成员由 mapper 给定）；
 * 连线：正交 + 箭头（BiRel 双向）+ 标签。
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
import { MappedC4Node, MappedC4Link } from '../mapper/c4';

/** 元素矩形节点 */
function buildC4Node(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.isShadowed = true;
  node.shadowColor = theme.shadow.color;
  node.shadowBlur = theme.shadow.blur;

  const bg = new Shape('Rectangle');
  bg.strokeWidth = 1.2;
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  bg.bind('fill', 'fill');
  bg.bind('stroke', 'stroke');
  bg.bind('strokeDashArray', 'dash', (d?: boolean) => (d ? [6, 4] : null));
  node.add(bg);

  const col = new Panel('Vertical');
  col.alignment = Spot.Center;

  const stereo = new TextBlock();
  stereo.margin = new Margin(6, 8, 0, 8);
  stereo.textAlign = 'center';
  stereo.font = `${Math.max(theme.fontSize.label - 1, 9)}px ${theme.fontFamily}`;
  stereo.opacity = 0.8;
  stereo.bind('text', 'stereotype');
  stereo.bind('stroke', 'textCol');
  stereo.bind('visible', 'stereotype', (s?: string) => !!s);
  col.add(stereo);

  const tb = new TextBlock();
  tb.margin = new Margin(2, 8, 8, 8);
  tb.textAlign = 'center';
  tb.isMultiline = true;
  tb.wrap = WrapFit;
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  tb.bind('maxSize', 'w', (w: number) => new Size(Math.max((w ?? 172) - 16, 40), NaN));
  col.add(tb);

  node.add(col);
  return node;
}

/** boundary 容器（垫底，尺寸由 mapper 给定） */
function buildGroupBox(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  node.movable = false;
  (node as any).zOrder = -1;

  const bg = new Shape('RoundedRectangle');
  bg.parameter1 = theme.nodeRadius + 2;
  bg.strokeDashArray = [4, 3];
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  bg.bind('fill', 'fill');
  bg.bind('stroke', 'stroke');
  node.add(bg);

  const title = new TextBlock();
  title.font = `bold ${theme.fontSize.label}px ${theme.fontFamily}`;
  title.margin = new Margin(6, 10, 2, 10);
  title.alignment = Spot.Top;
  title.bind('text', 'text');
  title.bind('stroke', 'textCol');
  node.add(title);
  return node;
}

/** 连线：正交 + 箭头（可双向）+ 标签 */
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
  link.add(path);

  const arrow = new Shape();
  arrow.toArrow = 'Standard';
  arrow.scale = 1.1;
  arrow.strokeWidth = 0;
  arrow.fill = es.solid;
  link.add(arrow);

  const arrowFrom = new Shape();
  arrowFrom.fromArrow = 'Standard';
  arrowFrom.scale = 1.1;
  arrowFrom.strokeWidth = 0;
  arrowFrom.fill = es.solid;
  arrowFrom.visible = false;
  arrowFrom.bind('visible', 'both', (b?: boolean) => !!b);
  link.add(arrowFrom);

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

/** 渲染 C4 到 div（data = mapC4 的输出） */
export function renderC4(
  divId: string,
  data: { nodes: MappedC4Node[]; links?: MappedC4Link[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('C4Node', buildC4Node(theme));
  diag.nodeTemplateMap.add('GroupBox', buildGroupBox(theme));
  diag.linkTemplate = buildLink(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links ?? [],
  } as any);
  return diag;
}
