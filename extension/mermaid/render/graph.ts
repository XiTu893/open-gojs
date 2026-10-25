/**
 * 通用图渲染器 —— class/state/er 三种"节点+连线"图共用。
 *
 * 与 flowchart 渲染器分离（模板差异：class/er 支持成员列表、关系箭头多样）。
 * 数据格式 GraphRenderData 由各图的映射器产出。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { Panel } from '../../../src/view/Panel';
import { Link } from '../../../src/view/Link';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Point } from '../../../src/core/Point';
import { Size } from '../../../src/core/Size';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import {
  WrapFit, RoutingOrthogonal, RoutingNormal, CurveNone,
  LayeredDigraphDirectionDown, LayeredDigraphDirectionRight,
  StretchHorizontal,
} from '../../../src/core/EnumValues';
import { MermaidTheme } from '../themes';
import { LayeredDigraphLayout } from '../../../src/layout/LayeredDigraphLayout';

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
  hollowFrom?: boolean; // fromArrow 空心（父类继承端）
  dashed?: boolean;
  thick?: boolean;
  /** er 基数记号（贴 from/to 端上方，如 `||`、`o{`） */
  fromCard?: string;
  toCard?: string;
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

/** 成员行之间的分隔线（官方 .divider：1px 实线横贯盒子宽度） */
function makeMemberDivider(strokeColor: string): Shape {
  const div = new Shape('Rectangle');
  div.height = 1;
  div.stretch = StretchHorizontal;
  div.fill = strokeColor;
  div.stroke = 'transparent';
  return div;
}

/** 状态起止点：小实心圆（官方 stateDiagram 的 [*] 伪状态） */
function buildStateDot(theme: MermaidTheme): Node {
  const node = new Node('Spot');
  node.selectable = false;
  const circle = new Shape('Circle');
  circle.desiredSize = new Size(10, 10);
  circle.fill = '#1f2937';
  circle.stroke = null as any;
  circle.bind('fill', 'fill');
  node.add(circle);
  return node;
}

/** er 实体：数据库表样式 —— 深色表头条 + 属性行（行间分隔线）+ PK 行加粗 */
function buildEntityNode(theme: MermaidTheme): Node {
  const cs = theme.categories.er;
  const node = new Node('Auto');
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const box = new Shape('RoundedRectangle');
  box.fill = cs.fill;
  box.stroke = cs.stroke;
  box.strokeWidth = cs.strokeWidth;
  box.parameter1 = 4;
  box.fromLinkable = true;
  box.toLinkable = true;
  box.fromSpot = Spot.AllSides;
  box.toSpot = Spot.AllSides;
  node.add(box);

  const panel = new Panel('Vertical');
  panel.margin = new Margin(0);

  // 表头条：深色底 + 浅色粗体标题
  const header = new Panel('Vertical');
  header.margin = new Margin(0);
  header.background = cs.stroke;
  const title = new TextBlock();
  title.margin = new Margin(6, 14, 6, 14);
  title.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  title.stroke = '#ffffff';
  title.textAlign = 'center';
  title.wrap = WrapFit;
  title.bind('text', 'title');
  header.add(title);
  panel.add(header);

  // 表头分隔线（无成员时隐藏）
  const headDiv = makeMemberDivider(cs.stroke);
  headDiv.bind('visible', 'members', (m: unknown) => Array.isArray(m) && m.length > 0);
  panel.add(headDiv);

  // 属性行：itemArray 逐行克隆，每行下方一条分隔线（末行不画）
  const rowTemplate = new Panel('Vertical');
  rowTemplate.margin = new Margin(0);
  rowTemplate.alignment = Spot.Left;
  const rowText = new TextBlock();
  rowText.margin = new Margin(2, 14, 2, 14);
  rowText.alignment = Spot.Left;
  rowText.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  rowText.stroke = cs.text;
  rowText.textAlign = 'left';
  rowText.wrap = WrapFit;
  rowText.bind('text', '');
  rowText.bind('font', 'memberKey', (keys: any, obj: any) => {
    // PK 行加粗：obj(行首 TextBlock).panel(行).itemIndex → memberKey[idx]
    const idx = obj?.panel?.itemIndex;
    const bold = Array.isArray(keys) && Number.isInteger(idx) && keys[idx];
    return `${bold ? 'bold ' : ''}${theme.fontSize.label}px ${theme.fontFamily}`;
  });
  rowTemplate.add(rowText);
  const rowDiv = makeMemberDivider(cs.stroke);
  rowDiv.bind('visible', '', (_v: unknown, obj: any) => {
    const row: any = obj?.panel;
    const body: any = row?.panel;
    const arr: any[] | null = body?.itemArray;
    const idx = row?.itemIndex;
    if (!arr || !Number.isInteger(idx)) return false;
    return idx < arr.length - 1; // 末行不画下分隔线
  });
  rowTemplate.add(rowDiv);

  const body = new Panel('Vertical');
  body.margin = new Margin(0, 0, 4, 0);
  body.alignment = Spot.Left;
  body.background = cs.fill;
  body.itemTemplate = rowTemplate;
  body.bind('itemArray', 'members');
  panel.add(body);

  node.add(panel);
  node.isShadowed = true;
  node.shadowColor = theme.shadow.color;
  node.shadowBlur = theme.shadow.blur;
  node.shadowOffset = new Point(4, 6);
  return node;
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
    // 官方 umlClass.html 风格：标题 + 标题下分隔线 + 属性区 + 属性/方法间分隔线 + 方法区
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

    // 标题分隔线（无成员时隐藏）
    const titleDiv = makeMemberDivider(cs.stroke);
    titleDiv.bind('visible', 'members', (m: unknown) => Array.isArray(m) && m.length > 0);
    panel.add(titleDiv);

    // 单行模板（属性/方法共用）
    const makeRowText = (): TextBlock => {
      const t = new TextBlock();
      t.margin = new Margin(1, 14, 1, 14);
      t.alignment = Spot.Left;
      t.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
      t.stroke = cs.text;
      t.textAlign = 'left';
      t.wrap = WrapFit;
      return t;
    };

    // 属性区（fields）
    const fieldsBody = new Panel('Vertical');
    fieldsBody.margin = new Margin(0);
    fieldsBody.alignment = Spot.Left;
    fieldsBody.itemTemplate = (() => {
      const row = new Panel('Vertical');
      row.margin = new Margin(0);
      row.alignment = Spot.Left;
      const t = makeRowText();
      t.bind('text', '');
      row.add(t);
      return row;
    })();
    fieldsBody.bind('itemArray', 'members', (m: any, tgt: any) => {
      if (!Array.isArray(m)) return [];
      // open-gojs converter 第 2 参是目标对象（fieldsBody 面板）→ 沿 panel 链取 Node 数据
      const kinds = tgt?.part?.data?.memberKind;
      if (!Array.isArray(kinds)) return m;
      return m.filter((_: any, i: number) => kinds[i] === 'field');
    });
    panel.add(fieldsBody);

    // 属性/方法间分隔线（仅当两者都存在时显示）
    const midDiv = makeMemberDivider(cs.stroke);
    midDiv.bind('visible', 'memberKind', (kinds: any) => {
      if (!Array.isArray(kinds)) return false;
      return kinds.some(k => k === 'field') && kinds.some(k => k === 'method');
    });
    panel.add(midDiv);

    // 方法区（methods）
    const methodsBody = new Panel('Vertical');
    methodsBody.margin = new Margin(0, 0, 6, 0);
    methodsBody.alignment = Spot.Left;
    methodsBody.itemTemplate = (() => {
      const row = new Panel('Vertical');
      row.margin = new Margin(0);
      row.alignment = Spot.Left;
      const t = makeRowText();
      t.bind('text', '');
      row.add(t);
      return row;
    })();
    methodsBody.bind('itemArray', 'members', (m: any, tgt: any) => {
      if (!Array.isArray(m)) return [];
      const kinds = tgt?.part?.data?.memberKind;
      if (!Array.isArray(kinds)) return m;
      return m.filter((_: any, i: number) => kinds[i] === 'method');
    });
    panel.add(methodsBody);

    node.add(panel);
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
  node.shadowOffset = new Point(4, 6);
  return node;
}

/**
 * er 基数记号面板：贴连线端点绘制（||=双横杠、o=圆圈、{/}=鸟足）。
 * 本引擎实测：link 子面板的 segmentIndex=0 锚定源端、=-1 锚定目标端；
 * alignmentFocus 控制锚点（源端用顶边、目标端用底边）。ER 布局恒为竖向连线。
 */
function buildCardMarker(bindProp: 'fromCard' | 'toCard', color: string): Panel {
  const from = bindProp === 'fromCard';
  const panel = new Panel('Position');
  // 源端：面板顶边=源节点边缘，记号向连线方向延伸（+y）；
  // 目标端：面板底边=目标节点边缘，记号沿 -y 延伸（圆圈远端 30、鸟足居边缘）。
  // 实测：segmentIndex=-1 落在倒数第二段末（距目标节点边 10）→ 面板加高并由 edgeY 补偿
  panel.desiredSize = new Size(22, from ? 40 : 64);
  panel.segmentIndex = from ? 0 : -1;
  panel.segmentFraction = from ? 0 : 1;
  panel.alignmentFocus = from ? new Spot(0.5, 0) : new Spot(0.5, 1);
  // 非 er 连线没有基数数据 → 整块隐藏，避免影响连线包围盒
  panel.bind('visible', bindProp, (v: string) => !!v);
  const edgeY = from ? 0 : 74;
  const out = (v: number) => (from ? edgeY + v : edgeY - v);
  const rect = (x: number, y: number, w: number, h: number): Shape => {
    const s = new Shape('Rectangle');
    s.desiredSize = new Size(w, h);
    s.fill = color;
    s.stroke = 'transparent';
    s.position = new Point(x, y);
    return s;
  };
  // 两根横杠（|| 与 |o 共用第一条）
  const bars: Shape[] = [];
  [9, 15].forEach((off, i) => {
    const b = rect(2, out(off) - 1, 18, 2);
    b.visible = false;
    if (i === 0) {
      b.bind('visible', bindProp, (v: string) => !!v && v.includes('|'));
    } else {
      b.bind('visible', bindProp, (v: string) => !!v && v.includes('||'));
    }
    bars.push(b);
    panel.add(b);
  });
  // 圆圈（o）：距端点 30（o{/}o）或 21（|o）
  const circ = new Shape('Circle');
  circ.visible = false;
  circ.desiredSize = new Size(12, 12);
  // 官方圈为白色填充（遮住后方连线）
  circ.fill = '#ffffff';
  circ.stroke = color;
  circ.strokeWidth = 1.3;
  circ.bind('position', bindProp, (v: string) => {
    const s = (v || '');
    const off = s.includes('{') || s.includes('}') ? 30 : 21;
    return new Point(5, out(off) - 6);
  });
  circ.bind('visible', bindProp, (v: string) => !!v && (v || '').includes('o'));
  panel.add(circ);
  // 鸟足（{ 或 }）：居端点处的尖叶形
  // 鸟足：官方是半张开的「{(」形（非闭合叶形）——
  // 两根弧形在节点侧聚成尖端，另一端张开（朝圆圈方向），整体跨度 ±18 沿连线、±9 垂直。
  const prong = (side: -1 | 1): Shape => {
    const pr = new Shape();
    pr.visible = false;
    pr.stroke = color;
    pr.strokeWidth = 1.3;
    pr.fill = 'transparent';
    pr.bind('geometryString', bindProp, (v: string) => {
      const card = v || '';
      if (!card.includes('{') && !card.includes('}')) return '';
      // 尖端（闭合）朝圆圈侧，两根弧向节点边张开（官方可见的外半张形态）
      const sy = from ? -18 : 18;
      const cy = from ? -9 : 9;
      return 'M 0,0 Q ' + (side * 9) + ',' + cy + ' ' + (side * 9) + ',' + sy;
    });
    // 左弧 bbox x -9..0 → 位置 2；右弧 bbox 0..9 → 位置 11（弧尖同在 x=11 = 连线中心）
    pr.bind('position', bindProp, () => new Point(side < 0 ? 2 : 11, from ? edgeY + 18 : edgeY - 18));
    pr.bind('visible', bindProp, (v: string) => !!v && ((v || '').includes('{') || (v || '').includes('}')));
    return pr;
  };
  panel.add(prong(-1));
  panel.add(prong(1));
  return panel;
}


/** er 基数记号箭头几何（对标官方 SVG marker）：||=仅一、|o=零或一、o{=零或多、}o=一或多 */
function buildLink(theme: MermaidTheme, straight = false, cards = false): Link {
  const es = theme.edge;
  const link = new Link();
  // state 竖直排布用直线（RoutingNormal，线更直）；class/er 用正交折线
  link.routing = straight ? RoutingNormal : RoutingOrthogonal;
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
  arrowF.bind('fill', 'hollowFrom', (h: boolean) => (h ? theme.background : es.solid));
  arrowF.bind('stroke', 'hollowFrom', (h: boolean) => (h ? es.solid : 'transparent'));
  arrowF.bind('strokeWidth', 'hollowFrom', (h: boolean) => (h ? 1.5 : 0));
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

  // 基数记号（er 的 ||--o{ 等）：from/to 端各一，贴近端点绘制
  // 官方 er 记号近黑（#333），与连线色（藏青）区分
  link.add(buildCardMarker('fromCard', '#333333'));
  link.add(buildCardMarker('toCard', '#333333'));

  return link;
}

/** 画一条竖短线（用于双竖线/鸟足） */
function mkStroke(x: number, y: number, w: number, h: number, color: string): Shape {
  const s = new Shape('Rectangle');
  s.desiredSize = new Size(w, h);
  s.fill = color;
  s.stroke = 'transparent';
  s.position = new Point(x, y);
  return s;
}


/** 渲染通用图到 div */
export function renderGraph(
  divId: string,
  data: GraphRenderData,
  theme: MermaidTheme,
  opts: { withMembers: boolean; straight?: boolean; cards?: boolean }
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
  diag.nodeTemplateMap.add('Entity', buildEntityNode(theme));
  diag.nodeTemplateMap.add('State', buildNode(theme, false));
  diag.nodeTemplateMap.add('StateStart', buildStateDot(theme));
  diag.nodeTemplateMap.add('StateEnd', buildStateDot(theme));

  diag.linkTemplate = buildLink(theme, opts.straight, opts.cards);

  const nodeDataArray: any[] = data.nodes.map(n => {
    const d: any = { key: n.key, title: n.title, category: n.category ?? '' };
    if (n.members) d.members = n.members;
    if (n.memberKind) d.memberKind = n.memberKind;
    if (n.memberKey) d.memberKey = n.memberKey;
    if (n.fill) d.fill = n.fill;
    if (n.stroke) d.stroke = n.stroke;
    if (n.textColor) d.textColor = n.textColor;
    return d;
  });
  const linkDataArray: any[] = data.links.map(l => {
    const d: any = { from: l.from, to: l.to, label: l.label };
    if (l.toArrow) { d.toArrow = l.toArrow; d.hollowTo = l.hollowTo; }
    if (l.fromArrow) { d.fromArrow = l.fromArrow; d.hollowFrom = l.hollowFrom; }
    if (l.dashed) d.dashed = true;
    if (l.thick) d.thick = true;
    if (l.fromCard) d.fromCard = l.fromCard;
    if (l.toCard) d.toCard = l.toCard;
    return d;
  });

  diag.model = new GraphLinksModel({ nodeDataArray, linkDataArray } as any);
  return diag;
}

/** 关系语义 → 箭头属性（供映射器使用） */
export function relationArrow(kind: string) {
  return arrowOf(kind);
}