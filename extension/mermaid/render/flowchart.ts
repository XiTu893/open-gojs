/**
 * flowchart 渲染器 —— 把映射后的数据装配为 GoJS Diagram。
 *
 * - 按主题构建各形状的 Node 模板（process/decision/startend/…）
 * - 连线模板支持实线/虚线/粗线、箭头、标签、双向箭头
 * - subgraph 渲染为 Group
 * - 布局按方向选用 LayeredDigraphLayout
 * - 默认开启 undo、缩放平移、链接交互（"开放基础交互"）
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { Panel } from '../../../src/view/Panel';
import { Link } from '../../../src/view/Link';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Point } from '../../../src/core/Point';
import { Rect } from '../../../src/core/Rect';
import { Size } from '../../../src/core/Size';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import {
  LayeredDigraphDirectionDown,
  LayeredDigraphDirectionRight,
  LayeredDigraphDirectionUp,
  LayeredDigraphDirectionLeft,
  WrapFit,
  RoutingAvoidsNodes,
  CurveNone,
} from '../../../src/core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedFlowchart, FlowCategory } from '../mapper/flowchart';
import { LayeredDigraphLayout } from '../../../src/layout/LayeredDigraphLayout';

/** 泳道列标题带高度（swimlane-title），与 arrangeLaneColumns 预留的标题区一致 */
const LANE_HEADER_H = 34;

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
    case 'Parallelogram':
    case 'ParallelogramInv': return 'Parallelogram1';
    case 'Hexagon': return 'Hexagon';
    case '':
    default: return 'RoundedRectangle';
  }
}

/** FlowCategory（驼峰）→ 主题 categories key（小写语义键） */
const THEME_KEY: Record<string, string> = {
  '': 'process',
  Decision: 'decision',
  StartEnd: 'startend',
  Subroutine: 'subroutine',
  Cylinder: 'storage',
  Parallelogram: 'inputoutput',
  ParallelogramInv: 'inputoutput',
  Group: 'group',
  GroupBox: 'group',
};

/** 为某类别取主题配色（无则回落 process）。注意 FlowCategory 是驼峰，theme key 是小写——
 * 黑白主题时期两边值相同掩盖了直接索引不命中的问题，彩色化后必须显式映射 */
function styleFor(theme: MermaidTheme, category: FlowCategory) {
  const k = THEME_KEY[category] ?? String(category).toLowerCase();
  return (theme.categories as any)[k] ?? theme.categories.process;
}

/**
 * 文字量估算（只上偏不下偏）——供菱形等内接形状计算 margin。
 * 口径对齐 TextBlock 官方语义：
 * - isMultiline=false：首个 \n 截断（与 _measureText 一致）
 * - 仅空格分词贪心换行；断不开的长词不另起行（宽按 maxSize 160 截）
 * - 行高取 1.6×fontSize（实测环境 1.54×，浏览器约 1.15~1.2×，取上包络）
 */
function estimateTextSize(text: unknown, fontSize: number): Size {
  const src = String(text ?? '').split('\n')[0];
  const wOf = (s: string): number => {
    let w = 0;
    for (const ch of s) w += ch.charCodeAt(0) > 0x2e7f ? fontSize : fontSize * 0.62;
    return w;
  };
  const spaceW = fontSize * 0.62;
  const maxW = 160; // 与 TextBlock.maxSize 一致
  let lines = 1;
  let curW = 0;
  for (const tk of src.split(' ')) {
    const tw = wOf(tk);
    if (curW <= 0) { curW = tw; continue; }
    if (curW + spaceW + tw <= maxW) curW += spaceW + tw;
    else { lines++; curW = tw; }
  }
  return new Size(Math.min(Math.max(curW, 1), maxW), Math.max(lines, 1) * fontSize * 1.6);
}

/**
 * 菱形内接 margin：Auto 面板 + 均匀 margin m 时，文字矩形内接菱形的充要条件是
 * w·h ≤ 4m²（即 m ≥ √(w·h)/2）。按估算文字量取 m 并乘 1.05 安全系数。
 */
function decisionMargin(text: unknown, fontSize: number): Margin {
  const s = estimateTextSize(text, fontSize);
  const m = Math.max(6, (Math.sqrt(s.width * s.height) / 2) * 1.05);
  return new Margin(m, m, m, m);
}

/** 构建某类别的节点模板 */
function buildNodeTemplate(theme: MermaidTheme, category: FlowCategory, dir?: string): Node {
  const cs = styleFor(theme, category);
  const isCircle = category === 'Circle';
  const isDecision = category === 'Decision';
  const vertical = dir === 'TD' || dir === 'TB' || dir === 'BT';
  // 固定连接边：避免 AllSides 在特殊形状（Diamond 等）上产生错误的正交路由中间点
  // 斜边/内缩形状（六边形左右竖边内缩于包围盒、平行四边形左右为斜边）：side spot 落在
  // 包围盒上、悬空于真实轮廓之外 → 用 None spot 走 getLinkPointFromPoint 与图形几何求交
  const outlineShape = category === 'Hexagon' || category === 'Parallelogram' || category === 'ParallelogramInv';
  const fromSpot = outlineShape ? Spot.None : vertical ? Spot.Bottom : Spot.Right;
  const toSpot = outlineShape ? Spot.None : vertical ? Spot.Top : Spot.Left;

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
  shape.fromSpot = fromSpot;
  shape.toSpot = toSpot;
  const isParallelogram = category === 'Parallelogram' || category === 'ParallelogramInv';
  const isSubroutine = category === 'Subroutine';
  if (!isCircle && !isDecision && !isParallelogram && !isSubroutine) shape.parameter1 = theme.nodeRadius;
  if (isParallelogram) shape.parameter1 = category === 'Parallelogram' ? 0.1 : -0.1;
  if (isSubroutine) shape.parameter1 = 0.1;
  node.add(shape);

  const tb = new TextBlock();
  tb.margin = isCircle || isDecision ? new Margin(6) : new Margin(8, 12, 8, 12);
  tb.maxSize = new Size(160, NaN);
  tb.wrap = WrapFit;
  tb.textAlign = 'center';
  tb.stroke = cs.text;
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  // 菱形：按文字量动态 margin，保证文字矩形内接菱形（否则 Auto+固定 margin 必溢出到尖角区）
  if (isDecision) tb.bind('margin', 'text', (t: unknown) => decisionMargin(t, theme.fontSize.node));
  node.add(tb);

  node.isShadowed = true;
  // pageFlow 风格：按类别取彩色阴影（缺省回落主题全局阴影）
  node.shadowColor = cs.shadow ?? theme.shadow.color;
  node.shadowBlur = theme.shadow.blur;
  node.shadowOffset = new Point(4, 6);
  return node;
}

/** 构建 subgraph 背景框模板（普通 Node，不参与布局定位，垫底显示） */
function buildGroupBoxTemplate(theme: MermaidTheme): Node {
  const cs = theme.categories.group;
  const node = new Node('Auto');
  node.isLayoutPositioned = false; // 由渲染阶段手动定位，不参与 layout
  node.selectable = false;
  node.resizable = false;
  node.movable = false;
  // 包围盒由渲染阶段按成员 bounds（泳道模式按列）算出
  node.bind('width', 'w');
  node.bind('height', 'h');

  // 泳道样式（对标官方 swimlane）：上方标题带 + 下方主体框
  const headerFill = cs.fill;
  const border = cs.stroke;
  const hdrH = LANE_HEADER_H;

  // 主体框：占满整列，边框线（官方 swimlane-body）
  const bg = new Shape('Rectangle');
  bg.fill = 'transparent';
  bg.stroke = border;
  bg.strokeWidth = cs.strokeWidth;
  node.add(bg);

  // 标题带：顶部长条，填色 + 描边（官方 swimlane-title）
  const hdr = new Shape('Rectangle');
  hdr.fill = headerFill;
  hdr.stroke = border;
  hdr.strokeWidth = cs.strokeWidth;
  hdr.alignment = Spot.TopLeft;
  hdr.bind('width', 'w');
  hdr.height = hdrH;
  node.add(hdr);

  // 标题：标题带内水平居中、垂直居中
  const title = new TextBlock();
  title.font = `bold ${theme.fontSize.label}px ${theme.fontFamily}`;
  title.stroke = cs.text;
  title.textAlign = 'center';
  title.alignment = Spot.TopLeft;
  title.margin = new Margin(Math.max(2, (hdrH - theme.fontSize.label) / 2 - 4), 0, 0, 0);
  title.bind('width', 'w');
  title.bind('text', 'text');
  node.add(title);
  return node;
}

/** 构建连线模板 */
function buildLinkTemplate(theme: MermaidTheme): Link {
  const es = theme.edge;
  const link = new Link();
  // RoutingAvoidsNodes：正交折线 + 官方 AvoidsNodesRouter 避障。
  // 纯 RoutingOrthogonal 时 LayeredDigraphLayout 的 dummy 链走廊可能压过节点本体
  // （实测回边 G-->E 的竖直走廊落在源节点内部）；避障路由器只重绕压到占用格的段，
  // 其余链路保持布局路由，穿模段被绕开（矩阵实测 0 穿模）。
  link.routing = RoutingAvoidsNodes;
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

/** 装配 Diagram（div 已就绪）。opts.lanes：swimlane-beta 列式泳道（subgraph=列，成员按行对齐） */
export function renderFlowchart(
  divId: string,
  data: MappedFlowchart,
  theme: MermaidTheme,
  opts?: { lanes?: boolean }
): Diagram {
  const lanes = !!opts?.lanes;
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = true;

  // 布局：泳道模式手动定位（layout=null），其余用 LayeredDigraph
  if (!lanes) {
    const layout = new LayeredDigraphLayout({
      direction: layoutDirection(data.dir),
      layerSpacing: 40,
      columnSpacing: 30,
    } as any);
    // 官方 LayeredDigraphLayout.setPortSpots(Vw) 默认会强制覆盖所有 link 的 fromSpot/toSpot，
    // 压制端口侧的 None spot（斜边形状的几何交点贴轮廓）→ 关闭，改由节点模板端口 spot 决定
    layout.setsPortSpots = false;
    diag.layout = layout;
  }

  // 节点模板（各形状 + 默认）；泳道按 TD 取上下端口（成员纵向堆叠）
  const dir = lanes ? 'TD' : data.dir;
  diag.nodeTemplateMap.add('', buildNodeTemplate(theme, '', dir));
  diag.nodeTemplateMap.add('Decision', buildNodeTemplate(theme, 'Decision', dir));
  diag.nodeTemplateMap.add('StartEnd', buildNodeTemplate(theme, 'StartEnd', dir));
  diag.nodeTemplateMap.add('Subroutine', buildNodeTemplate(theme, 'Subroutine', dir));
  diag.nodeTemplateMap.add('Cylinder', buildNodeTemplate(theme, 'Cylinder', dir));
  diag.nodeTemplateMap.add('Circle', buildNodeTemplate(theme, 'Circle', dir));
  diag.nodeTemplateMap.add('Parallelogram', buildNodeTemplate(theme, 'Parallelogram', dir));
  diag.nodeTemplateMap.add('ParallelogramInv', buildNodeTemplate(theme, 'ParallelogramInv', dir));
  diag.nodeTemplateMap.add('Hexagon', buildNodeTemplate(theme, 'Hexagon', dir));
  diag.nodeTemplateMap.add('GroupBox', buildGroupBoxTemplate(theme));

  // 连线模板
  diag.linkTemplate = buildLinkTemplate(theme);

  // 模型数据：成员 + 连线（背景框暂不加入，等 layout 定位后再加）
  const memberNodes: any[] = [];
  const boxNodes: any[] = [];
  const linkDataArray: any[] = [];
  for (const n of data.nodes) {
    const d: any = { key: n.key, text: n.text, category: n.category };
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
    if (n.category === 'GroupBox') {
      d.members = n.members;
      boxNodes.push(d);
    } else {
      memberNodes.push(d);
    }
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

  diag.model = new GraphLinksModel({ nodeDataArray: memberNodes, linkDataArray } as any);

  // 有 subgraph 时：先停动画并禁用（group 框要基于成员最终 bounds 定位，
  // 若 layout 动画挂起会在我们手动移位后把成员又拉回布局坐标 → 成员跑出 group 框）。
  const am: any = (diag as any).animationManager;
  const hadAnimEnabled = am && am.isEnabled;
  if (boxNodes.length && hadAnimEnabled) { if (am.stopAnimation) am.stopAnimation(); am.isEnabled = false; }

  // 第一次布局：成员 + 连线（不含背景框，避免 group 嵌套触发 update 死循环）
  (diag as any).maybeUpdate();

  // 计算背景框包围盒（基于成员实际 bounds），置底显示
  if (boxNodes.length) {
    if (lanes) {
      arrangeLaneColumns(diag, boxNodes, memberNodes);
    } else {
      const HDR = LANE_HEADER_H;
      const PAD = 12;
      const memberBox = (b: any): { x0: number; y0: number; x1: number; y1: number } => {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const mk of b.members ?? []) {
          const n = diag.findNodeForKey(mk) as any;
          if (!n) continue;
          const r = n.actualBounds as any;
          x0 = Math.min(x0, r.x);
          y0 = Math.min(y0, r.y);
          x1 = Math.max(x1, r.x + r.width);
          y1 = Math.max(y1, r.y + r.height);
        }
        return { x0, y0, x1, y1 };
      };
      // 先用平铺布局得到的成员 bounds 算初始框（此后 layout 还会再跑一次）
      for (const b of boxNodes) {
        const m = memberBox(b);
        if (!isFinite(m.x0)) continue;
        b.loc = `${m.x0 - PAD} ${m.y0 - HDR - PAD}`;
        b.w = m.x1 - m.x0 + PAD * 2;
        b.h = m.y1 - m.y0 + HDR + PAD * 2;
      }
    }
    (diag.model as any).commit((m: any) => {
      for (const b of boxNodes) m.addNodeData(b);
    }, 'add groupboxes');
    // 置底：渲染器按 Layer._parts 的插入顺序绘制（先插入先画、在最底层；
    // zOrder 只是记录、渲染不读），后加的背景框会盖住成员 → 把框的 part 挪到层首
    (diag as any).maybeUpdate();

    // 最后一次布局之后：分离重叠的 group 框。平铺布局会把不同 subgraph 的成员交错
    // 排布 → 背景框相互重叠、标签被相邻组内容遮挡。沿与主流程垂直的轴（LR→y，
    // TD→x）把重叠的 group 整体推开（移动成员 + 重算框 + 更新框数据 + 重排连线）。
    if (!lanes && boxNodes.length > 1) {
      const HDR2 = LANE_HEADER_H;
      const PAD2 = 12;
      const horiz = data.dir === 'LR' || data.dir === 'RL';
      const GAP = 24;
      const memberBox2 = (b: any): { x0: number; y0: number; x1: number; y1: number } => {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const mk of b.members ?? []) {
          const n = diag.findNodeForKey(mk) as any;
          if (!n) continue;
          const r = n.actualBounds as any;
          x0 = Math.min(x0, r.x);
          y0 = Math.min(y0, r.y);
          x1 = Math.max(x1, r.x + r.width);
          y1 = Math.max(y1, r.y + r.height);
        }
        return { x0, y0, x1, y1 };
      };
      const boxes = [];
      for (const b of boxNodes) {
        const m = memberBox2(b);
        if (!isFinite(m.x0)) continue;
        boxes.push({
          b, m,
          full: { x0: m.x0 - PAD2, y0: m.y0 - HDR2 - PAD2, x1: m.x1 + PAD2, y1: m.y1 + PAD2 },
          dx: 0, dy: 0,
        });
      }
      boxes.sort((p, q) => (horiz ? p.full.y0 - q.full.y0 : p.full.x0 - q.full.x0));
      for (let i = 1; i < boxes.length; i++) {
        const prev = boxes[i - 1], cur = boxes[i];
        if (horiz) {
          const s = cur.full.y0 + cur.dy, e = prev.full.y1 + prev.dy;
          if (s < e + GAP) cur.dy += (e + GAP) - s;
        } else {
          const s = cur.full.x0 + cur.dx, e = prev.full.x1 + prev.dx;
          if (s < e + GAP) cur.dx += (e + GAP) - s;
        }
      }
      // 标记所有成员为非布局定位，避免后续 layout 再把它们拉回平铺坐标
      for (const bx of boxes) {
        for (const mk of bx.b.members ?? []) {
          const n = diag.findNodeForKey(mk) as any;
          if (n) n.isLayoutPositioned = false;
        }
      }
      // 把位移应用到成员节点
      for (const bx of boxes) {
        if (!bx.dx && !bx.dy) continue;
        for (const mk of bx.b.members ?? []) {
          const n = diag.findNodeForKey(mk) as any;
          if (!n) continue;
          const loc = n.location as Point;
          n.location = new Point(loc.x + bx.dx, loc.y + bx.dy);
        }
      }
      (diag.model as any).commit((m: any) => {
        for (const bx of boxes) {
          const mm = memberBox2(bx.b);
          if (!isFinite(mm.x0)) continue;
          const bn = diag.findNodeForKey(bx.b.key) as any;
          if (!bn) continue;
          // loc 非绑定属性：直接设 part 位置；w/h 是绑定属性：走 model 数据更新
          bn.position = new Point(mm.x0 - PAD2, mm.y0 - HDR2 - PAD2);
          m.set(bn.data, 'w', mm.x1 - mm.x0 + PAD2 * 2);
          m.set(bn.data, 'h', mm.y1 - mm.y0 + HDR2 + PAD2 * 2);
        }
      }, 'move groupboxes');
      (diag as any).maybeUpdate(); // 成员位移 → 重排连线
    }

    if (boxNodes.length) {
      const layer = ((diag.findNodeForKey(boxNodes[0].key) as any)?.layer as any);
      if (layer && layer._parts) {
        const list = layer._parts;
        const boxParts: any[] = [];
        for (const b of boxNodes) {
          const bn = diag.findNodeForKey(b.key) as any;
          if (bn && list.remove(bn)) boxParts.push(bn);
        }
        // 倒序插到最前，保持框之间原有相对顺序
        for (let i = boxParts.length - 1; i >= 0; i--) list.insertAt(0, boxParts[i]);
      }
    }
    // 恢复动画
    if (boxNodes.length && hadAnimEnabled && am) am.isEnabled = true;
    // 泳道成员按列/行网格定位后，连线固定的「下→上」端口在跨列场景会穿过源节点
    // （实测 b→c 从 b 底边向上穿过 b 本体再绕到 c）。按两节点几何中点比较选最合适的端口侧。
    applyLaneLinkSpots(diag);
    (diag as any).maybeUpdate();
  }
  return diag;
}

/**
 * 泳道连线端口侧选择：比较两节点中心偏移，主轴方向上取相对侧。
 * - 水平为主（|dx|≥|dy|）：右→左 或 左→右
 * - 垂直为主：下→上 或 上→下
 * 结果直接写在 Link 的 fromSpot/toSpot（非 Default 时覆盖端口 spot），并触发重路由。
 */
function applyLaneLinkSpots(diag: Diagram): void {
  (diag.model as any).commit((m: any) => {
    diag.links.each((l: any) => {
      const a = diag.findNodeForKey(l.data.from) as any;
      const b = diag.findNodeForKey(l.data.to) as any;
      if (!a || !b) return;
      const A = a.actualBounds, B = b.actualBounds;
      if (!A || !B || !A.width || !B.width) return;
      const dx = (B.x + B.width / 2) - (A.x + A.width / 2);
      const dy = (B.y + B.height / 2) - (A.y + A.height / 2);
      let fs: any, ts: any;
      if (Math.abs(dx) >= Math.abs(dy)) {
        fs = dx >= 0 ? Spot.Right : Spot.Left;
        ts = dx >= 0 ? Spot.Left : Spot.Right;
      } else {
        fs = dy >= 0 ? Spot.Bottom : Spot.Top;
        ts = dy >= 0 ? Spot.Top : Spot.Bottom;
      }
      l.fromSpot = fs;
      l.toSpot = ts;
      // 端口侧变了必须让避障路由失效重算（否则沿用旧路由点）
      if (typeof (l as any).invalidateRoute === 'function') (l as any).invalidateRoute();
      (diag as any)._needsAvoidance = true;
      m.set(l.data, 'laneFromSpot', fs === Spot.Right ? 'R' : fs === Spot.Left ? 'L' : fs === Spot.Bottom ? 'B' : 'T');
      m.set(l.data, 'laneToSpot', ts === Spot.Right ? 'R' : ts === Spot.Left ? 'L' : ts === Spot.Bottom ? 'B' : 'T');
    });
  }, 'lane link spots');
}

/**
 * swimlane-beta 列式泳道：subgraph = 列（左右并排），成员按行对齐
 * （第 i 个成员同排，行高取跨列最大），框 = 列包围盒（含标题区），非成员节点置于下方。
 * 对齐官方 swimlane-body：每列等高、标题在列顶。
 */
function arrangeLaneColumns(diag: Diagram, boxNodes: any[], memberNodes: any[]): void {
  const M = 24;        // 画布边距
  const TITLE_H = LANE_HEADER_H; // 列标题带占位（与模板 LANE_HEADER_H 一致）
  const VGAP = 30;     // 行间距
  const HGAP = 48;     // 列间距
  const PAD = 16;      // 列内边距

  const rows = Math.max(0, ...boxNodes.map((b) => (b.members ?? []).length));
  const nodeOf = (key: string) => diag.findNodeForKey(key) as any;

  // 列宽 = 列内最宽成员；行高 = 跨列同排最宽成员
  const laneW: number[] = boxNodes.map((b) => {
    let w = 0;
    for (const mk of b.members ?? []) {
      const n = nodeOf(mk);
      if (n) w = Math.max(w, n.actualBounds.width);
    }
    return w;
  });
  const rowH: number[] = [];
  const rowY: number[] = [];
  let y = M + TITLE_H;
  for (let r = 0; r < rows; r++) {
    let h = 0;
    for (const b of boxNodes) {
      const mk = (b.members ?? [])[r];
      const n = mk !== undefined ? nodeOf(mk) : null;
      if (n) h = Math.max(h, n.actualBounds.height);
    }
    rowH[r] = h;
    rowY[r] = y;
    y += h + VGAP;
  }
  const contentBottom = (rows > 0 ? y - VGAP : M + TITLE_H) + PAD;

  const inLane = new Set<string>();
  // 按"目标包围盒左上角"落位：locationSpot=Center 的节点（flowchart 节点）
  // 需换算为中心点，TopLeft 的（背景框）原样
  const placeAt = (n: any, x: number, y: number): void => {
    const w = n.actualBounds.width;
    const h = n.actualBounds.height;
    n.location = n.locationSpot.positionInRect(new Rect(x, y, w, h));
  };
  let x = M;
  for (let li = 0; li < boxNodes.length; li++) {
    const b = boxNodes[li];
    const members: string[] = b.members ?? [];
    for (let r = 0; r < members.length; r++) {
      const n = nodeOf(members[r]);
      if (!n) continue;
      inLane.add(members[r]);
      const w = n.actualBounds.width;
      placeAt(n, x + (laneW[li] - w) / 2, rowY[r]);
    }
    b.loc = `${x - PAD} ${M}`;
    b.w = laneW[li] + 2 * PAD;
    b.h = contentBottom - M;
    x += laneW[li] + 2 * PAD + HGAP;
  }

  // 不在任何泳道中的成员节点：放到全部泳道下方
  let oy = contentBottom + 40;
  let ox = M;
  for (const d of memberNodes) {
    if (inLane.has(d.key)) continue;
    const n = nodeOf(d.key);
    if (!n) continue;
    placeAt(n, ox, oy);
    ox += n.actualBounds.width + 40;
  }
}