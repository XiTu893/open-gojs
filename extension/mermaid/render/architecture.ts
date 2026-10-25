/**
 * architecture-beta 渲染器 —— 只建模板 + 装配模型（数据由 mapper/architecture 提供）。
 *
 * 节点：Service（矩形，文本两行 = alias + label）、GroupBox（zOrder=-1 垫底标题框）。
 * 连线：正交路由 + Standard 箭头；fromPort/toPort（R/L/T/B）绑到 fromSpot/toSpot，
 * 端点即源/目标矩形对应边（无端口精确坐标计算，走 GoJS spot 路由）。
 * 坐标全部来自 mapper（loc/w/h），渲染层零布局数学。
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
import { MappedArchitectureNode, MappedArchitectureLink } from '../mapper/architecture';

/** 端口字符 → 边中点 spot */
function spotOfPort(p: string | undefined): Spot {
  switch ((p || '').toUpperCase()) {
    case 'L': return Spot.Left;
    case 'T': return Spot.Top;
    case 'B': return Spot.Bottom;
    case 'R':
    default: return Spot.Right;
  }
}

/** 服务节点：矩形 + 两行文本（alias\nlabel） */
function buildServiceNode(theme: MermaidTheme): Node {
  const cs = theme.categories.process;
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const shape = new Shape('Rectangle');
  shape.portId = '';
  shape.strokeWidth = cs.strokeWidth;
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
  // 整包数据绑定：alias + label 两行显示
  tb.bind('text', '', (d: any) => {
    if (!d) return '';
    const key = d.key ?? '';
    const label = d.text ?? '';
    return key && label && key !== label ? `${key}\n${label}` : (label || key);
  });
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 组盒（服务容器背景，垫底 zOrder=-1） */
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

/** 连线：端口 spot + 正交 + Standard 箭头 */
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
  link.bind('fromSpot', 'fromPort', (p: string) => spotOfPort(p));
  link.bind('toSpot', 'toPort', (p: string) => spotOfPort(p));

  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = es.solid;
  path.strokeWidth = 1.5;
  link.add(path);

  const arrow = new Shape('Standard');
  arrow.scale = 1.0;
  arrow.strokeWidth = 0;
  arrow.fill = es.solid;
  link.add(arrow);

  return link;
}

/** 渲染 architecture 到 div（data = mapArchitecture 的输出） */
export function renderArchitecture(
  divId: string,
  data: { nodes: MappedArchitectureNode[]; links?: MappedArchitectureLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('Service', buildServiceNode(theme));
  diag.nodeTemplateMap.add('GroupBox', buildGroupBox(theme));
  diag.linkTemplate = buildLink(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links ?? [],
  } as any);
  return diag;
}
