/**
 * 通用图渲染器 —— class/state/er 三种"节点+连线"图共用。
 *
 * 与 flowchart 渲染器分离（模板差异：class/er 支持成员列表、关系箭头多样）。
 * 数据格式 GraphRenderData 由各图的映射器产出。
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
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
  WrapFit, RoutingOrthogonal, CurveNone,
  LayeredDigraphDirectionDown, LayeredDigraphDirectionRight,
} from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { LayeredDigraphLayout } from '../../layout/LayeredDigraphLayout';

/** 图节点数据 */
export interface GraphNodeData {
  key: string;
  title: string;
  /** 成员行（class/er），每项一行 */
  members?: string[];
  /** 成员行是否为方法（class 用，可能斜体/着色） */
  memberKind?: ('field' | 'method')[];
  /** 关键字标记（er 的 PK/主键，加粗） */
  memberKey?: boolean[];
  category?: string;
  fill?: string;
  stroke?: string;
  textColor?: string;
}

/** 图连线数据 */
export interface GraphLinkData {
  from: string;
  to: string;
  label?: string;
  toArrow?: string;    // Arrowhead 名（Triangle/Diamond/Standard/OpenTriangle…）
  fromArrow?: string;
  hollowTo?: boolean;  // toArrow 空心（填充背景色）
  dashed?: boolean;
  thick?: boolean;
}

/** 图渲染输入 */
export interface GraphRenderData {
  nodes: GraphNodeData[];
  links: GraphLinkData[];
  direction?: 'down' | 'right';
}

function arrowOf(kind: string): { toArrow: string; hollow: boolean; dashed: boolean } {
  switch (kind) {
    case 'inheritance': return { toArrow: 'Triangle', hollow: true, dashed: false };
    case 'composition': return { toArrow: 'Diamond', hollow: false, dashed: false };
    case 'aggregation': return { toArrow: 'Diamond', hollow: true, dashed: false };
    case 'dependency': return { toArrow: 'OpenTriangle', hollow: true, dashed: true };
    case 'association':
    default: return { toArrow: 'Standard', hollow: false, dashed: false };
  }
}

/** 构建带成员列表的节点模板（class/er）或单文本节点（state） */
function buildNode(theme: MermaidTheme, withMembers: boolean, catFill?: string): Node {
  const cs = theme.categories.class;
  const node = new Node('Auto');
  node.locationSpot = Spot.Center;
  node.selectionAdorned = true;

  const box = new Shape('RoundedRectangle');
  box.portId = '';
  box.cursor = 'pointer';
  box.fill = catFill ?? cs.fill;
  box.stroke = cs.stroke;
  box.strokeWidth = cs.strokeWidth;
  box.parameter1 = 4;
  box.fromLinkable = true;
  box.toLinkable = true;
  box.fromSpot = Spot.AllSides;
  box.toSpot = Spot.AllSides;
  node.add(box);

  if (withMembers) {
    // 垂直面板：标题 + 分隔 + 成员
    const panel = new Panel('Vertical');
    panel.margin = new Margin(0);
    const title = new TextBlock();
    title.margin = new Margin(8, 14, 6, 14);
    title.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
    title.stroke = cs.text;
    title.textAlign = 'center';
    title.wrap = WrapFit;
    title.bind('text', 'title');
    panel.add(title);

    // 成员区（用换行文本块，简单可靠）
    const members = new TextBlock();
    members.margin = new Margin(0, 14, 8, 14);
    members.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
    members.stroke = cs.text;
    members.textAlign = 'left';
    members.wrap = WrapFit;
    // 由 model 提供的 members 数组渲染成多行
    panel.add(members);

    node.add(panel);
    // 绑定成员文本：members 数组 → 换行串
    (members as any).bind('text', 'members', (m: string[]) =>
      Array.isArray(m) ? m.join('\n') : ''
    );
  } else {
    const tb = new TextBlock();
    tb.margin = new Margin(8, 14, 8, 14);
    tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
    tb.stroke = cs.text;
    tb.textAlign = 'center';
    tb.wrap = WrapFit;
    tb.bind('text', 'title');
    node.add(tb);
  }

  node.isShadowed = true;
  node.shadowColor = theme.shadow.color;
  node.shadowBlur = theme.shadow.blur;
  node.shadowOffset = new Point(2, 3);
  return node;
}

/** 连线模板（可配箭头） */
function buildLink(theme: MermaidTheme): Link {
  const es = theme.edge;
  const link = new Link();
  link.routing = RoutingOrthogonal;
  link.curve = CurveNone;
  link.corner = 8;
  link.toShortLength = 3;

  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = es.solid;
  path.strokeWidth = 2;
  path.bind('strokeWidth', 'thick', (t: boolean) => (t ? 3 : 2));
  path.bind('strokeDashArray', 'dashed', (d: boolean) => (d ? [6, 4] : null));
  link.add(path);

  // toArrow（数据驱动箭头名）
  const arrow = new Shape();
  arrow.name = 'TOARROW';
  arrow.strokeWidth = 0;
  arrow.scale = 1.3;
  arrow.bind('toArrow', 'toArrow', (a: string) => a || 'None');
  arrow.bind('fill', 'hollowTo', (h: boolean, obj: any, model: any) => {
    // 空心箭头填背景色，实心填线色
    return h ? theme.background : es.solid;
  });
  // hollow 需要描边表现轮廓
  arrow.bind('stroke', 'hollowTo', (h: boolean) => (h ? es.solid : 'transparent'));
  arrow.bind('strokeWidth', 'hollowTo', (h: boolean) => (h ? 1.5 : 0));
  link.add(arrow);

  // fromArrow（双向/组合关系另一端）
  const arrowF = new Shape();
  arrowF.name = 'FROMARROW';
  arrowF.strokeWidth = 0;
  arrowF.scale = 1.3;
  arrowF.visible = false;
  arrowF.bind('fromArrow', 'fromArrow', (a: string) => a || 'None');
  arrowF.bind('visible', 'fromArrow', (a: string) => !!a && a !== 'None');
  arrowF.bind('fill', 'fromArrow', () => es.solid);
  link.add(arrowF);

  // 标签
  const lp = new Panel('Auto');
  lp.visible = false;
  lp.bind('visible', 'label', (l: string) => !!l);
  const bg = new Shape('RoundedRectangle');
  bg.fill = theme.background;
  bg.stroke = 'transparent';
  bg.parameter1 = 4;
  lp.add(bg);
  const lt = new TextBlock();
  lt.margin = new Margin(2, 5, 2, 5);
  lt.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  lt.stroke = es.label;
  lt.bind('text', 'label');
  lp.add(lt);
  link.add(lp);

  return link;
}

/** 渲染通用图到 div */
export function renderGraph(
  divId: string,
  data: GraphRenderData,
  theme: MermaidTheme,
  opts: { withMembers: boolean }
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  const dir = data.direction === 'right'
    ? LayeredDigraphDirectionRight
    : LayeredDigraphDirectionDown;
  diag.layout = new LayeredDigraphLayout({
    direction: dir,
    layerSpacing: 60,
    columnSpacing: 50,
  } as any);

  // 节点模板（默认 + 可能的分组类别）
  diag.nodeTemplateMap.add('', buildNode(theme, opts.withMembers));
  diag.nodeTemplateMap.add('Class', buildNode(theme, opts.withMembers));
  diag.nodeTemplateMap.add('Entity', buildNode(theme, opts.withMembers));
  diag.nodeTemplateMap.add('State', buildNode(theme, false));

  diag.linkTemplate = buildLink(theme);

  const nodeDataArray: any[] = data.nodes.map(n => {
    const d: any = { key: n.key, title: n.title, category: n.category ?? '' };
    if (n.members) d.members = n.members;
    if (n.fill) d.fill = n.fill;
    if (n.stroke) d.stroke = n.stroke;
    if (n.textColor) d.textColor = n.textColor;
    return d;
  });
  const linkDataArray: any[] = data.links.map(l => {
    const d: any = { from: l.from, to: l.to, label: l.label };
    if (l.toArrow) { d.toArrow = l.toArrow; d.hollowTo = l.hollowTo; }
    if (l.fromArrow) d.fromArrow = l.fromArrow;
    if (l.dashed) d.dashed = true;
    if (l.thick) d.thick = true;
    return d;
  });

  diag.model = new GraphLinksModel({ nodeDataArray, linkDataArray } as any);
  return diag;
}

/** 关系语义 → 箭头属性（供映射器使用） */
export function relationArrow(kind: string) {
  return arrowOf(kind);
}