import { Part } from './Part';
import { GraphObject } from './GraphObject';
import { Panel } from './Panel';
import { Node } from './Node';
import { Point } from '../core/Point';
import { Spot } from '../core/Spot';
import { List } from '../core/List';
import { Iterator } from '../core/Iterable';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { EnumValue } from '../core/EnumValues';
import {
  RoutingNone,
  LinkAdjustingNone,
  RoutingNormal, RoutingOrthogonal, RoutingAvoidsNodes, RoutingAvoidsNodesStraight,
  CurveNone, CurveBezier, CurveJumpOver, CurveJumpGap,
  LinkAdjustingEnd, LinkAdjustingScale, LinkAdjustingStretch,
  OrientationAlong, OrientationPlus90, OrientationMinus90, OrientationOpposite,
  OrientationUpright, OrientationPlus90Upright, OrientationMinus90Upright, OrientationUpright45,
  PanelLink
} from '../core/EnumValues';
import { Geometry } from '../core/Geometry';
import { PathFigure } from '../core/PathFigure';
import { PathSegment } from '../core/PathSegment';
import { Shape } from './Shape';
import { Knot, LinkInfo } from './LinkKnot';

/**
 * Link - a Part that represents a connection between two Nodes.
 */
export class Link extends Part {
  static readonly className: string = "Link";

  // ============ Official statics ============
  /** 官方 `Link.Normal = Routing.Normal` */
  static readonly Normal: EnumValue = RoutingNormal;
  /** 官方 `Link.Orthogonal = Routing.Orthogonal` */
  static readonly Orthogonal: EnumValue = RoutingOrthogonal;
  /** 官方 `Link.AvoidsNodes = Routing.AvoidsNodes` */
  static readonly AvoidsNodes: EnumValue = RoutingAvoidsNodes;
  /** 官方 `Link.AvoidsNodesStraight` */
  static readonly AvoidsNodesStraight: EnumValue = RoutingAvoidsNodesStraight;
  /** 官方 `Link.None = 0`（routing：不使用任何路由算法） */
  static readonly None: EnumValue = RoutingNone;
  /** 官方 `Link.Bezier = Curve.Bezier` */
  static readonly Bezier: EnumValue = CurveBezier;
  /** 官方 `Link.JumpGap = Curve.JumpGap` */
  static readonly JumpGap: EnumValue = CurveJumpGap;
  /** 官方 `Link.JumpOver = Curve.JumpOver` */
  static readonly JumpOver: EnumValue = CurveJumpOver;
  /** 官方 `Link.End = LinkAdjusting.End` */
  static readonly End: EnumValue = LinkAdjustingEnd;
  /** 官方 `Link.Scale = LinkAdjusting.Scale` */
  static readonly Scale: EnumValue = LinkAdjustingScale;
  /** 官方 `Link.Stretch = LinkAdjusting.Stretch` */
  static readonly Stretch: EnumValue = LinkAdjustingStretch;
  /** 官方 `Link.OrientAlong = Orientation.Along` */
  static readonly OrientAlong: EnumValue = OrientationAlong;
  /** 官方 `Link.OrientPlus90` */
  static readonly OrientPlus90: EnumValue = OrientationPlus90;
  /** 官方 `Link.OrientMinus90` */
  static readonly OrientMinus90: EnumValue = OrientationMinus90;
  /** 官方 `Link.OrientOpposite` */
  static readonly OrientOpposite: EnumValue = OrientationOpposite;
  /** 官方 `Link.OrientUpright` */
  static readonly OrientUpright: EnumValue = OrientationUpright;
  /** 官方 `Link.OrientPlus90Upright` */
  static readonly OrientPlus90Upright: EnumValue = OrientationPlus90Upright;
  /** 官方 `Link.OrientMinus90Upright` */
  static readonly OrientMinus90Upright: EnumValue = OrientationMinus90Upright;
  /** 官方 `Link.OrientUpright45` */
  static readonly OrientUpright45: EnumValue = OrientationUpright45;

  /** 官方 `Link.zF`（setRoutingParameter(1)） */
  private static _zF: number = 8;
  /** 官方 `Link.XF`（2，默认 curviness） */
  private static _XF: number = 16;
  /** 官方 `Link.Wh`（3） */
  private static _Wh: number = 8;
  /** 官方 `Link.Wh` 公开访问（AvoidsNodesRouter 端点矩形膨胀用） */
  static get Wh(): number { return Link._Wh; }
  /** 官方 `Link.yS`（4） */
  private static _yS: number = 3;
  /** 官方 `Link.YF`（5） */
  private static _YF: number = 3;
  /** 官方 `Link.KF`（6，Bezier 曲线的 spacing 倍率） */
  private static _KF: number = 1.333;
  /** 官方 `Link.rA`（7，共线判定容差） */
  private static _rA: number = 1;
  /** 官方 `Link.lA`（8，Bezier 端点长度比例） */
  private static _lA: number = 0;
  /** 官方 `Link.UF`（9） */
  private static _UF: number = 10;
  /** 官方 `Link.ou`（10） */
  private static _ou: number = 9999;
  /** 官方 `Link.GF`（11） */
  private static _GF: number = 30;
  /** 官方 `Link.qF`（12） */
  private static _qF: number = 30;
  /** 官方 `Link.hA`（13，默认 end segment length） */
  private static _hA: number = 10;
  /** 官方 `Link.HF`（14，默认 corner） */
  private static _HF: number = 10;
  /** 官方 `Link.vF`（15，默认 spacing） */
  private static _vF: number = 14;
  /** 官方 `Link.WF`（16） */
  private static _WF: number = 30;
  /** 官方 `Link.jF`（17） */
  private static _jF: number = 14;
  /** 官方 `Link.RL`（18） */
  private static _RL: number = 8;
  /** 官方 `Link.IL`（19） */
  private static _IL: number = 8;
  /** 官方 `Link.JF`（20） */
  private static _JF: number = 11;
  /** 官方 `Link.JF` 公开访问（PositionArray.Nf 每格距离场步数上限） */
  static get JF(): number { return Link._JF; }
  /** 官方 `Link.yD`（setRoutingParameter 中 30..70 区间的内部保留值） */
  private static _yD: number = NaN;

  /** 官方 `Link.setRoutingParameter(idx, value)`：设置路由算法的内部参数（1..20，以及 30..70 的保留位） */
  static setRoutingParameter(idx: number, value: number): void {
    switch (idx) {
      case 1: Link._zF = value; break;
      case 2: Link._XF = value; break;
      case 3: Link._Wh = value; break;
      case 4: Link._yS = value; break;
      case 5: Link._YF = value; break;
      case 6: Link._KF = value; break;
      case 7: Link._rA = value; break;
      case 8: Link._lA = value; break;
      case 9: Link._UF = value; break;
      case 10: Link._ou = value; break;
      case 11: Link._GF = value; break;
      case 12: Link._qF = value; break;
      case 13: Link._hA = value; break;
      case 14: Link._HF = value; break;
      case 15: Link._vF = value; break;
      case 16: Link._WF = value; break;
      case 17: Link._jF = value; break;
      case 18: Link._RL = value; break;
      case 19: Link._IL = value; break;
      case 20: Link._JF = value; break;
      default:
        if (idx > 29 && idx < 71) {
          const s = String(value).slice(0, -1);
          const n = parseInt(s, 10);
          if (!isNaN(n)) Link._yD = idx + n;
        }
        break;
    }
  }

  /** 官方 `Link.computeAngle(orientation, angle)`（静态） */
  static computeAngle(orientation: any, angle: number): number {
    const code = Link._orientationCode(orientation);
    let e = 0;
    switch (code) {
      default:
      case 0:
        e = 0;
        break;
      case 21:
        e = angle;
        break;
      case 22:
        e = angle + 90;
        break;
      case 23:
        e = angle - 90;
        break;
      case 24:
        e = angle + 180;
        break;
      case 25:
        e = Link._normalizeAngle(angle);
        if (e > 90 && e < 270) e -= 180;
        break;
      case 26:
        e = Link._normalizeAngle(angle + 90);
        if (e > 90 && e < 270) e -= 180;
        break;
      case 27:
        e = Link._normalizeAngle(angle - 90);
        if (e > 90 && e < 270) e -= 180;
        break;
      case 28:
        e = Link._normalizeAngle(angle);
        if ((e > 45 && e < 135) || (e > 225 && e < 315)) return 0;
        if (e > 90 && e < 270) e -= 180;
        break;
    }
    return Link._normalizeAngle(e);
  }

  /** 官方 `Link.computeAngle(inputAngle, u, v)`（实例，委托静态实现） */
  computeAngle(inputAngle: number, u: number, v: number): number {
    return Link.computeAngle(u, v);
  }

  /** 官方 `G.qi`：把角度归一到 [0, 360) */
  private static _normalizeAngle(a: number): number {
    let r = a % 360;
    if (r < 0) r += 360;
    return r;
  }

  /** 把 `Orientation.*` 枚举值（或数字）映射到官方 computeAngle 的分支码 */
  private static _orientationCode(o: any): number {
    if (typeof o === 'number') return o;
    if (o === OrientationAlong) return 21;
    if (o === OrientationPlus90) return 22;
    if (o === OrientationMinus90) return 23;
    if (o === OrientationOpposite) return 24;
    if (o === OrientationUpright) return 25;
    if (o === OrientationPlus90Upright) return 26;
    if (o === OrientationMinus90Upright) return 27;
    if (o === OrientationUpright45) return 28;
    return 0;
  }

  /** 供 Panel._measureLink 使用的 orientation 分支码（官方 measure 里 `L` 的值） */
  static orientationCode(o: any): number {
    return Link._orientationCode(o);
  }

  /** 官方 `G.u`（近似相等，用于正交路由的共线判定） */
  private static _approx(a: number, b: number): boolean {
    return Math.abs(a - b) < 1e-7;
  }

  /** 官方 `G.H`（近似等于 0） */
  private static _approxZero(a: number): boolean {
    return Math.abs(a) < 1e-7;
  }

  /** 官方 `Link.uA`：把 to 点沿主导方向推到无穷远处，用作正交方向参考 */
  private static _orthogonalize(from: Point, to: Point): void {
    if (Math.abs(to.x - from.x) > Math.abs(to.y - from.y)) {
      to.x = to.x >= from.x ? from.x + 9e9 : from.x - 9e9;
      to.y = from.y;
    } else {
      to.y = to.y >= from.y ? from.y + 9e9 : from.y - 9e9;
      to.x = from.x;
    }
  }

  /**
   * 官方 `GraphObject.getDocumentPoint(Spot, result)` 的等价实现：
   * - Shape 版：local = spot×(nb+sw) − sw/2 + nb.x/y（含描边），再经 D（逐级 ab−mb、
   *   带旋转 Part 走枢轴公式）变换到文档坐标；
   * - 通用版：local = spot×nb，再经 D。
   * 未旋转链下与旧实现（positionInRect(actualBounds)）严格等价：
   * ab + spot×(nb+sw) − sw/2 − (−sw/2) = ab + spot×(nb+sw)。
   */
  private static _docPoint(obj: GraphObject | null, spot: Spot, result: Point): Point {
    if (obj === null) {
      result.x = NaN;
      result.y = NaN;
      return result;
    }
    if (spot === null || spot.isNone()) {
      const c = obj.getDocumentBounds().center;
      result.x = c.x;
      result.y = c.y;
      return result;
    }
    const nb = obj.naturalBounds;
    let lx: number;
    let ly: number;
    const swRaw = (obj as any).strokeWidth;
    if (typeof swRaw === 'number' && isFinite(swRaw) && swRaw > 0 && nb !== null &&
      isFinite(nb.x) && isFinite(nb.y) && isFinite(nb.width) && isFinite(nb.height)) {
      // Shape 版官方公式
      lx = spot.x * (nb.width + swRaw) - swRaw / 2 + nb.x + spot.offsetX;
      ly = spot.y * (nb.height + swRaw) - swRaw / 2 + nb.y + spot.offsetY;
    } else if (nb !== null && isFinite(nb.width) && isFinite(nb.height)) {
      lx = spot.x * nb.width + spot.offsetX;
      ly = spot.y * nb.height + spot.offsetY;
    } else {
      const b = obj.getDocumentBounds();
      const p = spot.positionInRect(b);
      result.x = p.x;
      result.y = p.y;
      return result;
    }
    const p = obj.getDocumentPoint(new Point(lx, ly));
    result.x = p.x;
    result.y = p.y;
    return result;
  }

  // ============ Private property storage ============
  private _fromNode: Node | null = null;
  private _toNode: Node | null = null;
  private _fromPortId: string = '';
  private _toPortId: string = '';
  // fromSpot and toSpot are inherited from GraphObject
  private _routing: EnumValue = RoutingNormal;
  private _curve: EnumValue = CurveNone;
  private _corner: number = 0;
  private _curviness: number = NaN;
  private _points: List<Point> = new List<Point>();
  private _resegmentable: boolean = false;
  private _adjusting: EnumValue = LinkAdjustingNone;
  private _relinkableFrom: boolean = false;
  private _relinkableTo: boolean = false;
  private _jumpOver: number = 8;
  private _jumpGap: number = 8;
  private _isTreeLink: boolean = true;
  private _labelNodes: List<Node> | null = null;
  private _fromPortChanged: ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null = null;
  private _toPortChanged: ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null = null;
  private _suspendsRouting: boolean = false;
  private _smoothness: number = 0.5;
  private _defaultFromPoint: Point = new Point(NaN, NaN);
  private _defaultToPoint: Point = new Point(NaN, NaN);
  private _isRouteValid: boolean = false;
  private _isComputingRoute: boolean = false;
  private _oldPoints: List<Point> | null = null;
  private _flattenedLengths: number[] | null = null;
  private _flattenedTotalLength: number = NaN;
  private _routeBounds: Rect = new Rect(NaN, NaN, 0, 0);
  private _routeOffset: Point = new Point(0, 0);
  private _geometry: Geometry = new Geometry();
  private _isGeometryValid: boolean = false;

  constructor(type?: any, init?: any) {
    const [t, i] = Panel._resolveArgs(type, init);
    super(t !== undefined && t !== null ? t : PanelLink, undefined);
    this._className = 'Link';
    if (i) {
      this.set(i);
    }
  }

  // ============ Properties ============

  get fromNode(): Node | null { return this._fromNode; }
  set fromNode(val: Node | null) {
    if (this._fromNode === val) return;
    const oldPort = this.fromPort;
    this._fromNode = val;
    this._ggPort(oldPort);
    this._ggPort(this.fromPort);
    this.updateContainingGroup();
  }

  get toNode(): Node | null { return this._toNode; }
  set toNode(val: Node | null) {
    if (this._toNode === val) return;
    const oldPort = this.toPort;
    this._toNode = val;
    this._ggPort(oldPort);
    this._ggPort(this.toPort);
    this.updateContainingGroup();
  }

  get fromPortId(): string { return this._fromPortId; }
  set fromPortId(val: string) {
    if (this._fromPortId === val) return;
    const oldPort = this.fromPort;
    this._fromPortId = val;
    this._ggPort(oldPort);
    this._ggPort(this.fromPort);
  }

  get toPortId(): string { return this._toPortId; }
  set toPortId(val: string) {
    if (this._toPortId === val) return;
    const oldPort = this.toPort;
    this._toPortId = val;
    this._ggPort(oldPort);
    this._ggPort(this.toPort);
  }

  /** 官方 `Node.OS/ES → ne(port)`：连线端点变更时清空端口 knot 缓存 */
  private _ggPort(port: GraphObject | null): void {
    if (port !== null && port !== undefined && typeof (port as any).invalidateConnectedLinksCache === 'function') {
      (port as any).invalidateConnectedLinksCache();
    }
  }

  /**
   * 官方 `Link.dg()`：按两端点的公共 containingGroup 更新本 Link 的从属关系。
   * 官方 Link 的 containment 不是模型 group 数据直接给的，而是
   * `fromNode.findCommonContainingGroup(toNode)` 的结果（嵌套组时取最深公共祖先）；
   * 两端都在同一 Group 内的连线 `isTopLevel === false`，
   * 布局收集（Layout.collectParts 的 toplevelonly 过滤）才不会把组内连线
   * 及其端点塞进顶层网络 —— 否则 ParallelLayout.findSplitMerge 会看到
   * 组内的多个 Split 节点而抛 "Split node already exists"（flowgrammer）。
   * 由 fromNode/toNode setter 与 Part.containingGroup 变更传播调用。
   */
  updateContainingGroup(): void {
    const f = this._fromNode;
    const t = this._toNode;
    let g: any = null;
    if (f !== null && f !== undefined) {
      g = (t !== null && t !== undefined) ? f.findCommonContainingGroup(t) : f.containingGroup;
    } else if (t !== null && t !== undefined) {
      g = t.containingGroup;
    }
    const old = this._containingGroup;
    if (old === g) return;
    // 官方 `Link.s4(t)`：老组 vN、新组 WN（成员集合 + 布局失效 + memberRemoved/Added 回调），再发 containingGroupChanged
    if (old !== null && typeof (old as any)._notifyMemberRemoved === 'function') {
      (old as any)._memberParts.remove(this);
      if ((old as any).layout && (old as any).layout.isOngoing) (old as any).layout.invalidateLayout();
      (old as any)._notifyMemberRemoved(this);
    }
    this._containingGroup = g;
    if (g !== null && typeof (g as any)._notifyMemberAdded === 'function') {
      (g as any)._memberParts.add(this);
      if ((g as any).layout && (g as any).layout.isOngoing) (g as any).layout.invalidateLayout();
      (g as any)._notifyMemberAdded(this);
    }
    const ev = this.containingGroupChanged;
    if (ev !== null) ev(this, old, g);
    // 官方 Link.dg 尾部：isLabeledLink 时把 label 节点的 containingGroup 同步为同一值
    if (this.isLabeledLink) {
      const s = this.labelNodes;
      while (s.next()) {
        const n: any = s.value;
        if (n !== null && n !== undefined && n.containingGroup !== g) n.containingGroup = g;
      }
    }
  }

  /** 官方 `Link.isTreeLink`（默认 true） */
  get isTreeLink(): boolean { return this._isTreeLink; }
  set isTreeLink(val: boolean) { this._isTreeLink = val; }

  /** 官方 `Link.labelNodes`：作为本链接标签的 Node 迭代器 */
  get labelNodes(): Iterator<Node> {
    return this._labelNodes !== null ? this._labelNodes.iterator : (new List<Node>()).iterator;
  }

  /** 官方 `Link.isLabeledLink` */
  get isLabeledLink(): boolean {
    return this._labelNodes !== null && this._labelNodes.count > 0;
  }

  /** 官方 `Link.addLabelNode`（非公开）：把 node 设为本链接的标签 */
  _addLabelNode(node: Node): void {
    if (this._labelNodes === null) this._labelNodes = new List<Node>();
    if (!this._labelNodes.contains(node)) this._labelNodes.add(node);
  }

  /** 官方 `Link.removeLabelNode`（非公开） */
  _removeLabelNode(node: Node): void {
    if (this._labelNodes !== null) {
      this._labelNodes.delete(node);
      if (this._labelNodes.count === 0) this._labelNodes = null;
    }
  }

  // fromSpot and toSpot are inherited from GraphObject

  get routing(): EnumValue { return this._routing; }
  set routing(val: EnumValue) {
    const old = this._routing;
    if (old !== val) {
      this._routing = val;
      // 官方: `this.isAvoiding && this.diagram!==null && (this.diagram.C0=!0)`（go-debug 797720）
      if (this.isAvoiding && this.diagram !== null) {
        (this.diagram as any)._needsAvoidance = true;
      }
      // 官方: `this.fr=null, this.oi()`（oi = invalidateRoute）
      this.invalidateRoute();
    }
  }

  get curve(): EnumValue { return this._curve; }
  set curve(val: EnumValue) { this._curve = val; }

  get corner(): number { return this._corner; }
  set corner(val: number) { this._corner = val; }

  get curviness(): number { return this._curviness; }
  set curviness(val: number) { this._curviness = val; }

  get jumpOver(): number { return this._jumpOver; }
  set jumpOver(val: number) { this._jumpOver = val; }

  get jumpGap(): number { return this._jumpGap; }
  set jumpGap(val: number) { this._jumpGap = val; }

  get points(): List<Point> { return this._points; }
  set points(val: List<Point>) {
    const old = this._points;
    if (old === val) return;
    const raw: any = val;
    let e: List<Point>;
    if (Array.isArray(raw)) {
      const conv = this.convertPointsArrayToList(raw);
      if (conv === null) return;
      e = conv;
    } else {
      e = raw;
    }
    this._points = e;
    this._flattenedLengths = null;
    this._flattenedTotalLength = NaN;
    this._computeRouteBounds();
    this._isRouteValid = e.count > 0;
    this._isGeometryValid = false;
  }

  get resegmentable(): boolean { return this._resegmentable; }
  set resegmentable(val: boolean) { this._resegmentable = val; }

  get adjusting(): EnumValue { return this._adjusting; }
  set adjusting(val: EnumValue) { this._adjusting = val; }

  get relinkableFrom(): boolean { return this._relinkableFrom; }
  set relinkableFrom(val: boolean) { this._relinkableFrom = val; }

  get relinkableTo(): boolean { return this._relinkableTo; }
  set relinkableTo(val: boolean) { this._relinkableTo = val; }

  // ============ Readonly computed properties ============

  /** Whether this link uses orthogonal routing（官方 `Link.isOrthogonal` = routing & 2） */
  get isOrthogonal(): boolean {
    return this._routing === RoutingOrthogonal || this._routing === RoutingAvoidsNodes ||
      this._routing === RoutingAvoidsNodesStraight;
  }

  /** 官方 `Link.isAvoiding` = routing & 4（仅 AvoidsNodes / AvoidsNodesStraight） */
  get isAvoiding(): boolean {
    return this._routing === RoutingAvoidsNodes || this._routing === RoutingAvoidsNodesStraight;
  }

  // ============ Methods ============

  /** Get the link connection point on the from port */
  getLinkPointFromPort(port: GraphObject, spot: Spot): Point {
    const bounds = port.getDocumentBounds();
    if (spot.isNone()) {
      return bounds.center;
    }
    return new Point(spot.positionInRect(bounds).x, spot.positionInRect(bounds).y);
  }

  /** Get the link connection point on the to port */
  getLinkPointToPort(port: GraphObject, spot: Spot): Point {
    const bounds = port.getDocumentBounds();
    if (spot.isNone()) {
      return bounds.center;
    }
    return new Point(spot.positionInRect(bounds).x, spot.positionInRect(bounds).y);
  }

  /** Compute the route points for this link */
  computePoints(): boolean {
    if (this._diagram === null || this._diagram === undefined) return false;
    let from = this._fromNode;
    let to = this._toNode;
    if (!from || !to) return false;

    let fromPort: GraphObject | null = (from as any).findPort ? (from as any).findPort(this._fromPortId) : from;
    let toPort: GraphObject | null = (to as any).findPort ? (to as any).findPort(this._toPortId) : to;

    // 官方：节点不可见时 findVisibleNode 上移并改用其默认端口；
    // 随后 findVisiblePort 沿 panel 链跳过不可见/未测量端口（gantt 隐藏
    // TreeExpanderButton 回落到节点本身，避免 NaN 路由点）。
    if (fromPort !== null && !from.isVisible()) {
      const m = from.findVisibleNode();
      if (m !== null && m !== from) {
        from = m;
        fromPort = m.port;
      } else {
        from = m;
      }
    }
    if (toPort !== null && !to.isVisible()) {
      const m = to.findVisibleNode();
      if (m !== null && m !== to) {
        to = m;
        toPort = m.port;
      } else {
        to = m;
      }
    }
    if (from === null || to === null || !(from.location && from.location.isReal()) ||
        fromPort === null || toPort === null) return false;
    fromPort = from.findVisiblePort(fromPort);
    toPort = to.findVisiblePort(toPort);
    if (fromPort === null || toPort === null) return false;

    if (from === to) {
      // 官方同端口（c）走 else 分支自链接逻辑；本项目保留同节点自链接快路径（偏差同前）。
      return this._computeSelfLinkPoints(fromPort.getDocumentBounds());
    }

    // ---- 官方 computePoints 主流程（go-debug.js 761432..764750）----
    const o = this.pointsCount;
    const r = this.computeSpot(true, fromPort);
    const l = this.computeSpot(false, toPort);
    const h = this._isCenterSpot(r);
    const a = this._isCenterSpot(l);
    const c = fromPort === toPort && fromPort !== null;
    const f = this.isOrthogonal;
    const d = this.computeAdjusting() === LinkAdjustingNone || c;

    if (!f && !c && h && a) {
      // 官方 r4/o4 快速路径：非正交 + 两端无方向 spot
      let ok = false;
      if (!d && o >= 3) {
        let g = this.getLinkPoint(from, fromPort, r, true, false, to, toPort);
        let p = this.getLinkPoint(to, toPort, l, false, false, from, fromPort);
        ok = this.adjustPoints(0, g, o - 1, p);
        if (ok) {
          g = this.getLinkPoint(from, fromPort, r, true, false, to, toPort);
          p = this.getLinkPoint(to, toPort, l, false, false, from, fromPort);
          ok = this.adjustPoints(0, g, o - 1, p);
        }
      }
      if (!ok) {
        const g = this.getLinkPoint(from, fromPort, r, true, false, to, toPort);
        const p = this.getLinkPoint(to, toPort, l, false, false, from, fromPort);
        this._points.clear();
        this.addPoint(g);
        this.addPoint(p);
        if (this._curve === CurveBezier) {
          this._o4(from, fromPort, r, to, toPort, l);
        } else if (this.hasCurviness()) {
          this._r4Mid(g, p);
        }
        // 官方 r4 内的 ZF（节点重叠端点修正）未移植（flowchart 不触发）。
      }
      return true;
    }

    if (d && ((f && this.isAvoiding) || c)) this._points.clear();
    const g = this.getLinkPoint(from, fromPort, r, true, f, to, toPort);
    const p = this.getLinkPoint(to, toPort, l, false, f, from, fromPort);

    let y = 0;
    let x = 0;
    let b = 0;
    if (f || !h || c) {
      b = this.getLinkDirection(from, fromPort, g, r, true, f, to, toPort);
      const M = this.computeEndSegmentLength(from, fromPort, r, true, b);
      b = Link._normalizeAngle(b);
      if (b === 0) y = M;
      else if (b === 90) x = M;
      else if (b === 180) y = -M;
      else if (b === 270) x = -M;
      else {
        y = M * Math.cos((b * Math.PI) / 180);
        x = M * Math.sin((b * Math.PI) / 180);
      }
    }

    let S = 0;
    let k = 0;
    let P = 0;
    if (f || !a || c) {
      P = this.getLinkDirection(to, toPort, p, l, false, f, from, fromPort);
      const M = this.computeEndSegmentLength(to, toPort, l, false, P);
      P = Link._normalizeAngle(P);
      if (P === 0) S = M;
      else if (P === 90) k = M;
      else if (P === 180) S = -M;
      else if (P === 270) k = -M;
      else {
        S = M * Math.cos((P * Math.PI) / 180);
        k = M * Math.sin((P * Math.PI) / 180);
      }
    }

    let A = g;
    if (f || !h || c) A = new Point(g.x + y, g.y + x);
    let N = p;
    if (f || !a || c) N = new Point(p.x + S, p.y + k);

    if (!d && !f && h && o > 3 && this.adjustPoints(0, g, o - 2, N)) {
      this.setPoint(o - 1, p);
    } else if (!d && !f && a && o > 3 && this.adjustPoints(1, A, o - 1, p)) {
      this.setPoint(0, g);
    } else if (!d && (f ? o >= 6 : o > 4) && this.adjustPoints(1, A, o - 2, N)) {
      this.setPoint(0, g);
      this.setPoint(o - 1, p);
    } else {
      this._points.clear();
      this.addPoint(g);
      if (f || !h || c) this.addPoint(A);
      if (f) this.addOrthoPoints(A, b, N, P, from, to);
      if (f || !a || c) this.addPoint(N);
      this.addPoint(p);
    }
    // 官方唯一 exit: `return t.addInvalidRoute(this), !0`（go-debug 764588）——
    // 完整重算成功后把本 link 登记进待避障路由集合（快路径 adjustPoints 不登记，与官方一致）。
    const dg = this.diagram;
    if (dg !== null && dg !== undefined) dg.addInvalidRoute(this);
    return true;
  }

  /** 官方 `Link.r4` 的 curviness 中点插入（非 Bezier 快路径，显式设置 curviness 时） */
  private _r4Mid(g: Point, p: Point): void {
    const h3 = p.x - g.x;
    const a3 = p.y - g.y;
    const c3 = this.computeCurviness();
    const f3 = c3;
    const mx = g.x + h3 / 2;
    const my = g.y + a3 / 2;
    let mmx = mx;
    let mmy = my;
    if (Link._approxZero(a3)) {
      if (h3 > 0) mmy -= f3;
      else mmy += f3;
    } else {
      const pp = -h3 / a3;
      let yy = Math.sqrt((f3 * f3) / (pp * pp + 1));
      if (c3 < 0) yy = -yy;
      mmx = (a3 < 0 ? -1 : 1) * yy + mx;
      mmy = pp * (mmx - mx) + my;
    }
    this.insertPointAt(1, mmx, mmy);
  }

  /** 官方 `Link.o4`：Bezier 快路径插入两个控制点并重算端点 */
  private _o4(
    from: Node, fromPort: GraphObject, r: Spot,
    to: Node, toPort: GraphObject, l: Spot
  ): void {
    const g = this.getPoint(0);
    const p = this.getPoint(1);
    const h3 = p.x - g.x;
    const a3 = p.y - g.y;
    const c3 = this.computeCurviness();
    let f3 = 0;
    let u3 = 0;
    let d1 = g.x + h3 / 3;
    let m1 = g.y + a3 / 3;
    let g1 = d1;
    let p1 = m1;
    if (Link._approxZero(a3)) {
      if (h3 > 0) p1 -= c3;
      else p1 += c3;
    } else {
      f3 = -h3 / a3;
      u3 = Math.sqrt((c3 * c3) / (f3 * f3 + 1));
      if (c3 < 0) u3 = -u3;
      g1 = (a3 < 0 ? -1 : 1) * u3 + d1;
      p1 = f3 * (g1 - d1) + m1;
    }
    d1 = g.x + (2 * h3) / 3;
    m1 = g.y + (2 * a3) / 3;
    let g2 = d1;
    let p2 = m1;
    if (Link._approxZero(a3)) {
      if (h3 > 0) p2 -= c3;
      else p2 += c3;
    } else {
      g2 = (a3 < 0 ? -1 : 1) * u3 + d1;
      p2 = f3 * (g2 - d1) + m1;
    }
    this.insertPointAt(1, g1, p1);
    this.insertPointAt(2, g2, p2);
    this.setPoint(0, this.getLinkPoint(from, fromPort, r, true, false, to, toPort));
    this.setPoint(3, this.getLinkPoint(to, toPort, l, false, false, from, fromPort));
  }

  /** Resolve the effective fromSpot for this link */
  private _resolveFromSpot(port?: GraphObject): Spot {
    const fromSpot = (this as any).fromSpot as Spot;
    if (!fromSpot.isDefault()) return fromSpot;
    if (port && (port as any).fromSpot) {
      const portSpot = (port as any).fromSpot as Spot;
      if (!portSpot.isDefault()) return portSpot;
    }
    if (this._fromNode) {
      const nodeSpot = (this._fromNode as any).fromSpot as Spot;
      if (nodeSpot && !nodeSpot.isDefault()) return nodeSpot;
    }
    return new Spot(NaN, NaN);
  }

  private _resolveToSpot(port?: GraphObject): Spot {
    const toSpot = (this as any).toSpot as Spot;
    if (!toSpot.isDefault()) return toSpot;
    if (port && (port as any).toSpot) {
      const portSpot = (port as any).toSpot as Spot;
      if (!portSpot.isDefault()) return portSpot;
    }
    if (this._toNode) {
      const nodeSpot = (this._toNode as any).toSpot as Spot;
      if (nodeSpot && !nodeSpot.isDefault()) return nodeSpot;
    }
    return new Spot(NaN, NaN);
  }

  private _getPortDirection(port: GraphObject, spot: Spot, portPoint: Point, center: Point): string {
    if (spot && !spot.isNone() && !spot.isDefault()) {
      if (spot.x <= 0.01) return 'left';
      if (spot.x >= 0.99) return 'right';
      if (spot.y <= 0.01) return 'up';
      if (spot.y >= 0.99) return 'down';
    }
    const bounds = port.getDocumentBounds();
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;
    const dx = portPoint.x - cx;
    const dy = portPoint.y - cy;
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
  }

  private _offsetPoint(pt: Point, dir: string, dist: number): Point {
    switch (dir) {
      case 'right': return new Point(pt.x + dist, pt.y);
      case 'left': return new Point(pt.x - dist, pt.y);
      case 'down': return new Point(pt.x, pt.y + dist);
      case 'up': return new Point(pt.x, pt.y - dist);
      default: return pt;
    }
  }

  private _perpendicularDir(dir: string): string {
    switch (dir) {
      case 'right': case 'left': return 'down';
      case 'down': case 'up': return 'right';
      default: return 'right';
    }
  }

  private _isOppositeDir(dir1: string, dir2: string): boolean {
    return (dir1 === 'right' && dir2 === 'left') || (dir1 === 'left' && dir2 === 'right') ||
           (dir1 === 'down' && dir2 === 'up') || (dir1 === 'up' && dir2 === 'down');
  }

  private _distAlongDir(from: Point, to: Point, dir: string): number {
    switch (dir) {
      case 'right': return to.x - from.x;
      case 'left': return from.x - to.x;
      case 'down': return to.y - from.y;
      case 'up': return from.y - to.y;
      default: return 0;
    }
  }

  private _canReachWithCorner(from: Point, fromDir: string, to: Point, toDir: string): boolean {
    if ((fromDir === 'right' || fromDir === 'left') && (toDir === 'up' || toDir === 'down')) {
      return true;
    }
    if ((fromDir === 'up' || fromDir === 'down') && (toDir === 'right' || toDir === 'left')) {
      return true;
    }
    return false;
  }

  private _cornerPoint(from: Point, fromDir: string, to: Point, toDir: string): Point {
    if (fromDir === 'right' || fromDir === 'left') {
      return new Point(from.x, to.y);
    }
    return new Point(to.x, from.y);
  }

  /** Get the intersection of a line from center to target with the rectangle edge */
  /**
   * 官方 Link.getLinkPointFromPoint 的等价入口：优先用端口内元素的图形几何求交
   * （Shape.getNearestIntersectionPoint 会按 figure 解椭圆/线段），
   * 没有可用图形元素时回退到 actualBounds 矩形求交。
   */
  private _connectionPoint(port: any, bounds: Rect, center: Point, target: Point): Point {
    const start = new Point(center.x, center.y);
    const out = new Point(target.x, target.y);
    try {
      // 端口自身（Panel/Port）实现了图形感知求交时优先使用
      if (port && typeof port.getNearestIntersectionPoint === 'function' &&
        typeof port.isPanel === 'boolean' && port.isPanel) {
        if (port.getNearestIntersectionPoint(start, target, out)) return out;
      }
      // 端口的主元素（Node 的 Shape）
      if (port && typeof port.findMainElement === 'function') {
        const main = port.findMainElement();
        if (main && typeof main.getNearestIntersectionPoint === 'function') {
          if (main.getNearestIntersectionPoint(start, target, out)) return out;
        }
      }
      // 直接对端口本身求交
      if (port && typeof port.getNearestIntersectionPoint === 'function') {
        if (port.getNearestIntersectionPoint(start, target, out)) return out;
      }
    } catch {
      /* 几何不可用时回退矩形 */
    }
    return this._getEdgeIntersection(bounds, center, target);
  }

  private _getEdgeIntersection(rect: Rect, center: Point, target: Point): Point {
    const dx = target.x - center.x;
    const dy = target.y - center.y;

    if (dx === 0 && dy === 0) return center;

    let t = Infinity;

    // Check intersection with each edge
    if (dx !== 0) {
      const tx = (dx > 0 ? rect.right : rect.x) - center.x;
      const t1 = tx / dx;
      const y1 = center.y + t1 * dy;
      if (y1 >= rect.y && y1 <= rect.bottom && t1 > 0 && t1 < t) {
        t = t1;
      }
    }
    if (dy !== 0) {
      const ty = (dy > 0 ? rect.bottom : rect.y) - center.y;
      const t2 = ty / dy;
      const x2 = center.x + t2 * dx;
      if (x2 >= rect.x && x2 <= rect.right && t2 > 0 && t2 < t) {
        t = t2;
      }
    }

    if (t === Infinity) return center;
    return new Point(center.x + t * dx, center.y + t * dy);
  }

  private _computeSelfLinkPoints(nodeBounds: Rect): boolean {
    const w = nodeBounds.width;
    const h = nodeBounds.height;
    const bottom = nodeBounds.bottom;

    const fromX = nodeBounds.x + w * 0.7;
    const toX = nodeBounds.x + w * 0.3;
    const cpY = bottom + h * 1.0;
    const cpXOffset = Math.max(w * 0.5, 20);

    this._points.clear();
    this._points.add(new Point(fromX, bottom));
    this._points.add(new Point(fromX + cpXOffset, cpY));
    this._points.add(new Point(toX - cpXOffset, cpY));
    this._points.add(new Point(toX, bottom));

    this._curve = CurveBezier;
    return true;
  }

  /** 官方 `Link.midPoint`：先 updateRoute 再取中点 */
  get midPoint(): Point {
    this.updateRoute();
    return this.computeMidPoint(new Point());
  }

  findClosestSegment(p: Point): number {
    const pts = this._points;
    const count = pts.count;
    if (count < 2) return -1;
    let bestDist = Infinity;
    let bestIdx = 0;
    for (let i = 0; i < count - 1; i++) {
      const a = pts.get(i)!;
      const b = pts.get(i + 1)!;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const lenSq = dx * dx + dy * dy;
      let t = lenSq > 0 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq : 0;
      t = Math.max(0, Math.min(1, t));
      const cx = a.x + t * dx;
      const cy = a.y + t * dy;
      const distSq = (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy);
      if (distSq < bestDist) {
        bestDist = distSq;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  // ============ Route / geometry (official Link members) ============

  /** 官方 `Link.path`：主元素是 Shape 时即连线的绘制形状 */
  get path(): GraphObject | null {
    const t = this.findMainElement();
    return t instanceof Shape ? t : null;
  }

  /** 官方 `Link.fromPort` */
  get fromPort(): GraphObject | null {
    const n = this._fromNode;
    if (n === null) return null;
    return n.findPort(this._fromPortId);
  }

  /** 官方 `Link.toPort` */
  get toPort(): GraphObject | null {
    const n = this._toNode;
    if (n === null) return null;
    return n.findPort(this._toPortId);
  }

  get fromPortChanged(): ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null {
    return this._fromPortChanged;
  }
  set fromPortChanged(val: ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null) {
    const old = this._fromPortChanged;
    if (old === val) return;
    this._fromPortChanged = val;
    this.raiseChanged('fromPortChanged', old, val);
  }

  get toPortChanged(): ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null {
    return this._toPortChanged;
  }
  set toPortChanged(val: ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null) {
    const old = this._toPortChanged;
    if (old === val) return;
    this._toPortChanged = val;
    this.raiseChanged('toPortChanged', old, val);
  }

  /** 官方 `Link.suspendsRouting`（默认 false） */
  get suspendsRouting(): boolean { return this._suspendsRouting; }
  set suspendsRouting(val: boolean) {
    const old = this._suspendsRouting;
    if (old === val) return;
    this._suspendsRouting = val;
    this.raiseChanged('suspendsRouting', old, val);
  }

  /** 官方 `Link.smoothness`（默认 0.5） */
  get smoothness(): number { return this._smoothness; }
  set smoothness(val: number) {
    const old = this._smoothness;
    if (old === val) return;
    this._smoothness = val;
    this.invalidateGeometry();
    this.raiseChanged('smoothness', old, val);
  }

  /** 官方 `Link.defaultFromPoint`（非实数时归一为 Point(NaN,NaN)） */
  get defaultFromPoint(): Point { return this._defaultFromPoint; }
  set defaultFromPoint(val: Point) {
    this._defaultFromPoint = val !== null && val !== undefined && val.isReal() ? val.copy() : new Point(NaN, NaN);
  }

  /** 官方 `Link.defaultToPoint` */
  get defaultToPoint(): Point { return this._defaultToPoint; }
  set defaultToPoint(val: Point) {
    this._defaultToPoint = val !== null && val !== undefined && val.isReal() ? val.copy() : new Point(NaN, NaN);
  }

  /** 官方 `Link.pointsCount` */
  get pointsCount(): number { return this._points.count; }

  /** 官方 `Link.getPoint(i)` */
  getPoint(i: number): Point { return this._points.elt(i); }

  /** 官方 `Link.setPoint(i, p)` */
  setPoint(i: number, p: Point): void { this._points.setElt(i, p); }

  /** 官方 `Link.setPointAt(i, x, y)` */
  setPointAt(i: number, x: number, y: number): void { this._points.setElt(i, new Point(x, y)); }

  /** 官方 `Link.insertPoint(i, p)` */
  insertPoint(i: number, p: Point): void { this._points.insertAt(i, p); }

  /** 官方 `Link.insertPointAt(i, x, y)` */
  insertPointAt(i: number, x: number, y: number): void { this._points.insertAt(i, new Point(x, y)); }

  /** 官方 `Link.addPoint(p)` */
  addPoint(p: Point): void { this._points.add(p); }

  /** 官方 `Link.addPointAt(x, y)` */
  addPointAt(x: number, y: number): void { this._points.add(new Point(x, y)); }

  /** 官方 `Link.removePoint(i)` */
  removePoint(i: number): void { this._points.removeAt(i); }

  /** 官方 `Link.clearPoints()` */
  clearPoints(): void { this._points.clear(); }

  /** 官方 `Link.convertPointsArrayToList`：兼容数字数组 `[x,y,...]` 与对象数组 `[{x,y},...]` */
  convertPointsArrayToList(arr: any[]): List<Point> | null {
    if (!Array.isArray(arr)) return null;
    const l = arr.length;
    let numeric = l % 2 === 0;
    if (numeric) {
      for (let i = 0; i < l; i++) {
        if (typeof arr[i] !== 'number' || isNaN(arr[i])) { numeric = false; break; }
      }
    }
    const out = new List<Point>();
    if (numeric) {
      for (let i = 0; i < l / 2; i++) out.add(new Point(arr[i * 2], arr[i * 2 + 1]));
      return out;
    }
    let ok = true;
    for (let i = 0; i < l; i++) {
      const o = arr[i];
      if (o === null || typeof o !== 'object' || typeof o.x !== 'number' || isNaN(o.x) ||
        typeof o.y !== 'number' || isNaN(o.y)) { ok = false; break; }
    }
    if (!ok) return null;
    for (let i = 0; i < l; i++) out.add(new Point(arr[i].x, arr[i].y));
    return out;
  }

  /** 官方 `Link.canRelinkFrom()` */
  canRelinkFrom(): boolean {
    if (!this.relinkableFrom) return false;
    const layer: any = this.layer;
    if (layer === null) return true;
    if (!layer.allowRelink) return false;
    const d: any = layer.diagram;
    return !(d !== null && d !== undefined && !d.allowRelink);
  }

  /** 官方 `Link.canRelinkTo()` */
  canRelinkTo(): boolean {
    if (!this.relinkableTo) return false;
    const layer: any = this.layer;
    if (layer === null) return true;
    if (!layer.allowRelink) return false;
    const d: any = layer.diagram;
    return !(d !== null && d !== undefined && !d.allowRelink);
  }

  /** 官方 `Link.getOtherNode(node)` */
  getOtherNode(node?: GraphObject | null): Node | null {
    const f = this._fromNode;
    return node === f ? this._toNode : f;
  }

  /** 官方 `Link.getOtherPort(port)` */
  getOtherPort(port?: GraphObject | null): GraphObject | null {
    const f = this.fromPort;
    return port === f ? this.toPort : f;
  }

  /** 官方 `Link.computeAdjusting()` */
  computeAdjusting(): EnumValue {
    const d: any = this.diagram;
    if (this.isAvoiding && d !== null && d !== undefined) {
      const am = d.animationManager;
      if (am && am.defaultAnimation && am.defaultAnimation.isAnimating) return LinkAdjustingEnd;
    }
    return this._adjusting;
  }

  /** 官方 `Link.computeCurve()`（自链接 + 非正交 → Bezier） */
  computeCurve(): EnumValue {
    const from = this.fromPort;
    const samePort = from !== null && from === this.toPort;
    return samePort && !this.isOrthogonal ? CurveBezier : this._curve;
  }

  /** 官方 `Link.computeCorner()` */
  computeCorner(): number {
    if (this._curve === CurveBezier) return 0;
    let c = this._corner;
    if (isNaN(c) || c < 0) c = Link._HF;
    return c;
  }

  /** 官方 `Link.computeCurviness()`（本项目无 link bundle，只取默认值 16） */
  computeCurviness(): number {
    let c = this._curviness;
    if (isNaN(c)) c = Link._XF;
    return c;
  }

  /** 官方 `Link.hasCurviness()`（无 bundle） */
  hasCurviness(): boolean { return !isNaN(this._curviness); }

  /** 官方 `Link.computeThickness()` */
  computeThickness(): number {
    if (!this.isVisible()) return 0;
    const p = this.path;
    return p !== null ? Math.max((p as Shape).strokeWidth, 1) : 1;
  }

  /** 官方 `Link.computeSpot(isFrom, port?)` */
  computeSpot(isFrom: boolean, port?: GraphObject | null): Spot {
    const p = port !== undefined && port !== null ? port : (isFrom ? this.fromPort : this.toPort);
    if (isFrom) {
      if (p === null) return Spot.Center;
      let s = this.fromSpot;
      if (s.isDefault()) s = p.fromSpot;
      return s.isDefault() ? Spot.None : s;
    }
    if (p === null) return Spot.Center;
    let s = this.toSpot;
    if (s.isDefault()) s = p.toSpot;
    return s.isDefault() ? Spot.None : s;
  }

  /** 官方 `Link.Rl(spot)`：是否为无方向约束的 spot（None 或正中心） */
  private _isCenterSpot(spot: Spot): boolean {
    return spot.isNone() || (spot.x === 0.5 && spot.y === 0.5);
  }

  /** 官方 `Link.Sg(spot, isFrom)` */
  private _resolveLinkSpot(spot: Spot): Spot {
    return spot.x === 0.5 && spot.y === 0.5 ? spot : Spot.Center;
  }

  /** 官方 `Link.computeShortLength(isFrom)` */
  computeShortLength(isFrom: boolean): number {
    let v = isFrom ? this.fromShortLength : this.toShortLength;
    if (isNaN(v)) {
      const p = isFrom ? this.fromPort : this.toPort;
      if (p !== null) v = isFrom ? p.fromShortLength : p.toShortLength;
    }
    return isNaN(v) ? 0 : v;
  }

  /** 官方 `Link.computeEndSegmentLength(node, port, spot, isFrom, dir?)` */
  computeEndSegmentLength(node: Node | null, port: GraphObject | null, spot: Spot, isFrom: boolean, dir?: number): number {
    // 官方：side spot → 端口 Knot 的 KS（优先于 link/port 自身设置）
    if (port !== null && spot !== null && spot.isSide()) {
      const li = this._ys(port);
      if (li !== null) return li.KS;
    }
    let o = isFrom ? this.fromEndSegmentLength : this.toEndSegmentLength;
    if (port !== null && isNaN(o)) {
      const d = dir !== undefined && !isNaN(dir) ? dir : NaN;
      if (Link._lA > 0 && this.computeCurve() === CurveBezier && !isNaN(d) && spot.isSpot()) {
        const other = this.getOtherPort(port);
        if (other !== null) {
          const a = port.getDocumentBounds().center;
          const b = other.getDocumentBounds().center;
          const horizontal = d >= 315 || d <= 45 || (d >= 135 && d <= 225);
          const u = Math.abs(horizontal ? a.x - b.x : a.y - b.y) / Link._lA;
          return Math.max(u, Link._hA);
        }
      }
      o = isFrom ? port.fromEndSegmentLength : port.toEndSegmentLength;
    }
    return isNaN(o) ? Link._hA : o;
  }

  /** 官方 `Link.l4(port, link)`：只查已有 knot，不创建 */
  private _l4(port: GraphObject | null): LinkInfo | null {
    if (port === null || port === undefined) return null;
    const k = (port as any)._knot;
    if (k === null || k === undefined) return null;
    return k.$F(this);
  }

  /** 官方 `Link.YS(port)`：取（必要时创建）端口 Knot 中本连线的 LinkInfo */
  private _ys(port: GraphObject | null): LinkInfo | null {
    if (port === null || port === undefined) return null;
    let k = (port as any)._knot;
    if (k === null || k === undefined) {
      k = new Knot((port as any).part, port);
      (port as any)._knot = k;
    }
    return k.$F(this);
  }

  /** 官方 `Link.computeOtherPoint(othernode, otherport, otherspot?, from?, result?)` */
  computeOtherPoint(othernode: Node, otherport: GraphObject, otherspot?: Spot, from?: boolean, result?: Point): Point {
    const out = result !== undefined && result !== null ? result : new Point();
    if (this.computeAdjusting() !== LinkAdjustingNone && this.pointsCount > 4) {
      const p = this.getPoint(Math.floor(this.pointsCount / 2));
      out.x = p.x;
      out.y = p.y;
      return out;
    }
    // 官方 l4：对端口已有 side-spot knot → 直接用它的端点位置
    const li = this._l4(otherport);
    if (li !== null) {
      out.set(li.yc);
      return out;
    }
    if (otherport === null || otherport === undefined) {
      out.x = NaN;
      out.y = NaN;
      return out;
    }
    if (otherspot !== undefined && otherspot !== null) return Link._docPoint(otherport, otherspot, out);
    const c = otherport.getDocumentBounds().center;
    out.x = c.x;
    out.y = c.y;
    return out;
  }

  /** 官方 `Link.getLinkPointFromPoint(node, port, focus, p, from, result?)` */
  getLinkPointFromPoint(node: Node | null, port: GraphObject | null, focus: Point, p: Point, from: boolean, result?: Point): Point {
    const out = result !== undefined && result !== null ? result : new Point();
    if (node === null || port === null) {
      out.x = focus.x;
      out.y = focus.y;
      return out;
    }
    if (!node.isVisible()) {
      const u = node.findVisibleNode();
      if (u !== null && u !== node) {
        node = u;
        port = u.port;
      }
    }
    if (port === null) {
      out.x = p.x;
      out.y = p.y;
      return out;
    }
    // 官方 `getLinkPointFromPoint` 尾部：focus/p 逆变换到 port 局部坐标后调
    // `port.Rf(...)`（= getNearestIntersectionPoint），结果再乘回矩阵。本项目
    // GraphObject 没有独立文档矩阵（旋转经 getDocumentBounds 体现），直接按
    // 文档坐标求交；参数方向按本项目实现族的 (中心 focus, 目标 p) 语义。
    // 官方 Rf 失败时 result=focus；本项目 Rf 对部分端口（gantt 内 Panel 端口）
    // 会返回反方向外推点，故保留矩形求交回退兜底，避免端点塌回中心。
    if (!port.getNearestIntersectionPoint(focus, p, out)) {
      const bounds = port.getDocumentBounds();
      const origin = bounds.containsPoint(focus) ? focus : bounds.center;
      const hit = this._getEdgeIntersection(bounds, origin, p);
      out.x = hit.x;
      out.y = hit.y;
    }
    return out;
  }

  /** 官方 `Link.getLinkPoint(node, port, spot, from, ortho, othernode, otherport, result?)` */
  getLinkPoint(
    node: Node | null, port: GraphObject, spot: Spot, from: boolean, ortho: boolean,
    othernode: Node | null, otherport: GraphObject, result?: Point
  ): Point {
    const out = result !== undefined && result !== null ? result : new Point();
    if (spot !== null && spot.isSpot() && !this._isCenterSpot(spot)) return Link._docPoint(port, spot, out);
    if (spot !== null && spot.isSide()) {
      const li = this._ys(port);
      if (li !== null) {
        out.set(li.yc);
        return out;
      }
      // 官方 routing===7（AvoidsNodesStraight）跨侧协调分支未移植；knot 缺失时落入中心逻辑
    }
    const focus = Link._docPoint(port, this._resolveLinkSpot(spot), new Point());
    const a = new Point();
    if (this.pointsCount > (ortho ? 6 : 2)) {
      a.set(this.getPoint(from ? 1 : this.pointsCount - 2));
      if (ortho) Link._orthogonalize(focus, a);
    } else if (otherport !== null && otherport !== undefined) {
      // 官方 gA：aim = 对端口按其对应 spot 的文档点（Sg 后非点位 spot 即中心）
      const os = this.computeSpot(!from, otherport);
      Link._docPoint(otherport, this._resolveLinkSpot(os), a);
      if (ortho) Link._orthogonalize(focus, a);
    } else {
      a.set(focus);
    }
    return this.getLinkPointFromPoint(node, port, focus, a, from, out);
  }

  /** 官方 `Link.getLinkDirection(node, port, linkpoint, spot, from, ortho, othernode, otherport)` */
  getLinkDirection(
    node: Node | null, port: GraphObject | null, linkpoint: Point, spot: Spot, from: boolean,
    ortho: boolean, othernode: Node | null, otherport: GraphObject | null
  ): number {
    let h = this._h4(node, port, linkpoint, spot, from, ortho, othernode, otherport);
    // 官方 getLinkDirection 中的 Group 包含关系（isMemberOf）分支未移植：
    // 本项目连线不经过 Group 归属翻转。
    if (this._isCenterSpot(spot) || port === null) return h;
    const angle = port.getDocumentAngle();
    if (angle === 0) return h;
    if (angle >= 45 && angle < 135) h += 90;
    else if (angle >= 135 && angle < 225) h += 180;
    else if (angle >= 225 && angle < 315) h += 270;
    return Link._normalizeAngle(h);
  }

  /** 官方 `Link.h4(...)`（getLinkDirection 内核） */
  private _h4(
    node: Node | null, port: GraphObject | null, linkpoint: Point, spot: Spot, from: boolean,
    ortho: boolean, othernode: Node | null, otherport: GraphObject | null
  ): number {
    void node;
    void othernode;
    if (spot !== null && spot.isSpot()) return Link._spotDirection(spot);
    if (spot !== null && spot.isSide()) {
      const li = port !== null ? this._ys(port) : null;
      if (li !== null) {
        switch (li.ye) {
          case 1: return 270;
          case 8: return 90;
          case 2: return 180;
          default: return 0;
        }
      }
      if (spot.includesSide(Spot.TopSide)) return 270;
      if (spot.includesSide(Spot.BottomSide)) return 90;
      if (spot.includesSide(Spot.LeftSide)) return 180;
      return 0;
    }
    if (port === null || otherport === null) return 0;
    const center = port.getDocumentBounds().center;
    const a = new Point();
    if (this.pointsCount > (ortho ? 6 : 2)) {
      if (ortho) {
        a.set(this.getPoint(from ? 1 : this.pointsCount - 2));
        Link._orthogonalize(center, a);
      } else {
        a.set(linkpoint);
      }
    } else {
      a.set(otherport.getDocumentBounds().center);
    }
    let c: number;
    if (Math.abs(a.x - center.x) > Math.abs(a.y - center.y)) c = a.x >= center.x ? 0 : 180;
    else c = a.y >= center.y ? 90 : 270;
    return c;
  }

  /** 官方 `G.Sx(null, spot.x, spot.y)`：点位 spot → 方向角（含 45/135/225/315 对角方向） */
  private static _spotDirection(s: Spot): number {
    const n = s.x;
    const o = s.y;
    let ret = 0;
    if (n > o) {
      if (!(n > 1 - o)) ret = n < 1 - o ? 270 : 315;
    } else if (n < o) {
      if (n > 1 - o) ret = 90;
      else ret = n < 1 - o ? 180 : 135;
    } else {
      if (n < 0.5) ret = 225;
      else if (n > 0.5) ret = 45;
    }
    return ret;
  }

  /** 官方 `Link.computeSpacing()` */
  computeSpacing(): number {
    if (!this.isVisible()) return 0;
    let t = Link._vF;
    t = Math.max(t, this.computeThickness());
    const from = this.fromPort;
    const to = this.toPort;
    if (from !== null && to !== null) {
      const label: any = this.findMidLabel();
      if (label !== null) {
        const nb = label.naturalBounds;
        const m = label.margin;
        const w = isNaN(nb.width) ? Link._WF : nb.width * label.scale + m.left + m.right;
        const h = isNaN(nb.height) ? Link._jF : nb.height * label.scale + m.top + m.bottom;
        const orient = label.segmentOrientation;
        if (orient === OrientationAlong || orient === OrientationUpright || orient === OrientationOpposite) {
          t = Math.max(t, h);
        } else if (orient === OrientationMinus90 || orient === OrientationMinus90Upright ||
          orient === OrientationPlus90 || orient === OrientationPlus90Upright) {
          t = Math.max(t, w);
        } else {
          const c = Link._docPoint(from, Spot.Center, new Point()).directionPoint(
            Link._docPoint(to, Spot.Center, new Point())) / 180 * Math.PI;
          t = Math.max(t, Math.abs(Math.sin(c) * w) + Math.abs(Math.cos(c) * h) + 1);
        }
        if (this._curve === CurveBezier) t *= Link._KF;
      }
    }
    return t;
  }

  /** 官方 `Link.findMidLabel()`：没有指定 segmentIndex 的中间标签元素 */
  findMidLabel(): GraphObject | null {
    const main = this.path;
    const els = (this as any)._elements;
    if (Array.isArray(els)) {
      for (let i = 0; i < els.length; i++) {
        const o: any = els[i];
        if (o === main || o.isPanelMain) continue;
        const si = o.segmentIndex;
        if (si === -Infinity || isNaN(si)) return o;
      }
    }
    const it = this.labelNodes;
    while (it.next()) {
      const n: any = it.value;
      if (n.segmentIndex === -Infinity || isNaN(n.segmentIndex)) return n;
    }
    return null;
  }

  /** 官方 `Link.arrangeBundledLinks(links, recompute)`（本项目无 bundle，仅按官方语义失效路由） */
  arrangeBundledLinks(links: Link[], recompute: boolean): void {
    if (recompute) {
      for (let i = 0; i < links.length; i++) {
        const s = links[i];
        if (s.computeAdjusting() === LinkAdjustingNone) s.invalidateRoute();
      }
    }
  }

  /** 官方 `Link.usesSamePort(other)` */
  usesSamePort(other: Link): boolean {
    const n = this.pointsCount;
    const m = other.pointsCount;
    if (n > 0 && m > 0) {
      const a1 = this.getPoint(0);
      const b1 = other.getPoint(0);
      if (a1.equalsApprox(b1)) return true;
      const a2 = this.getPoint(n - 1);
      const b2 = other.getPoint(m - 1);
      if (a2.equalsApprox(b2) || a1.equalsApprox(b2) || a2.equalsApprox(b1)) return true;
      return false;
    }
    return this.fromNode === other.fromNode || this.toNode === other.toNode ||
      this.fromNode === other.toNode || this.toNode === other.fromNode;
  }

  get firstPickIndex(): number {
    return this.pointsCount <= 2 ? 0 : (this.isOrthogonal || !this._isCenterSpot(this.computeSpot(true)) ? 1 : 0);
  }

  get lastPickIndex(): number {
    const n = this.pointsCount;
    if (n === 0) return 0;
    return n <= 2 ? n - 1 : (this.isOrthogonal || !this._isCenterSpot(this.computeSpot(false)) ? n - 2 : n - 1);
  }

  /** 官方 `Link.flattenedLengths` */
  get flattenedLengths(): number[] {
    if (this._flattenedLengths !== null) return this._flattenedLengths;
    const arr: number[] = [];
    const n = this.pointsCount;
    for (let i = 0; i < n - 1; i++) {
      const a = this.getPoint(i);
      const b = this.getPoint(i + 1);
      let s: number;
      if (Link._approxZero(a.x - b.x)) s = Math.abs(b.y - a.y);
      else if (Link._approxZero(a.y - b.y)) s = Math.abs(b.x - a.x);
      else s = Math.sqrt(a.distanceSquaredPoint(b));
      arr.push(s);
    }
    this._flattenedLengths = arr;
    return arr;
  }

  /** 官方 `Link.flattenedTotalLength` */
  get flattenedTotalLength(): number {
    let t = this._flattenedTotalLength;
    if (isNaN(t)) {
      const a = this.flattenedLengths;
      t = 0;
      for (let i = 0; i < a.length; i++) t += a[i];
      this._flattenedTotalLength = t;
    }
    return t;
  }

  /** 官方 `Link.computeMidPoint(result)`（本项目无 Transform，跳过 Geometry 沿路径取中点分支） */
  computeMidPoint(result: Point): Point {
    const n = this.pointsCount;
    if (n === 0) { result.x = NaN; result.y = NaN; return result; }
    if (n === 1) {
      const p = this.getPoint(0);
      result.x = p.x;
      result.y = p.y;
      return result;
    }
    if (n === 2) {
      const a = this.getPoint(0);
      const b = this.getPoint(1);
      result.x = (a.x + b.x) / 2;
      result.y = (a.y + b.y) / 2;
      return result;
    }
    const lens = this.flattenedLengths;
    const total = this.flattenedTotalLength;
    let acc = 0;
    let i = 0;
    let seg = 0;
    while (acc < total / 2 && i < n && i < lens.length) {
      seg = lens[i];
      if (acc + seg > total / 2) break;
      acc += seg;
      i++;
    }
    if (i >= n) i = n - 1;
    const l = this.getPoint(i);
    const h = this.getPoint(Math.min(i + 1, n - 1));
    const rest = total / 2 - acc;
    if (Math.abs(l.x - h.x) < 1) {
      result.x = l.x;
      result.y = l.y > h.y ? l.y - rest : l.y + rest;
    } else if (Math.abs(l.y - h.y) < 1) {
      result.y = l.y;
      result.x = l.x > h.x ? l.x - rest : l.x + rest;
    } else {
      const f = seg > 0 ? rest / seg : 0;
      result.x = l.x + f * (h.x - l.x);
      result.y = l.y + f * (h.y - l.y);
    }
    return result;
  }

  /** 官方 `Link.midAngle` */
  get midAngle(): number {
    this.updateRoute();
    return this.computeMidAngle();
  }

  /** 官方 `Link.computeMidAngle()` */
  computeMidAngle(): number {
    const n = this.pointsCount;
    if (n < 2) return NaN;
    if (n === 2) return this.getPoint(0).directionPoint(this.getPoint(1));
    const lens = this.flattenedLengths;
    const total = this.flattenedTotalLength;
    let acc = 0;
    let i = 0;
    let seg = 0;
    while (acc < total / 2 && i < n && i < lens.length) {
      seg = lens[i];
      if (acc + seg > total / 2) break;
      acc += seg;
      i++;
    }
    if (i > n - 2) i = n - 2;
    if (i < 0) i = 0;
    const r = this.getPoint(i);
    const l = this.getPoint(i + 1);
    const tol = Link._rA;
    if (Math.abs(r.x - l.x) < 0.5 && Math.abs(r.y - l.y) < tol) {
      if (i > 0 && i < n - 2) {
        const a = this.getPoint(i - 1);
        const b = this.getPoint(i + 2);
        return a.x < b.x ? 0 : a.x > b.x ? 180 : a.y < b.y ? 90 : 270;
      }
    } else if (Math.abs(r.y - l.y) < 0.5 && Math.abs(r.x - l.x) < tol && i > 0 && i < n - 2) {
      const a = this.getPoint(i - 1);
      const b = this.getPoint(i + 2);
      return a.y < b.y ? 90 : a.y > b.y ? 270 : a.x < b.x ? 0 : 180;
    }
    return r.directionPoint(l);
  }

  /** 官方 `Link.routeBounds` */
  get routeBounds(): Rect {
    this.updateRoute();
    return this._routeBounds;
  }

  /** 官方 `Link.cA()`：按点列计算 routeBounds（本项目无 Bezier 控制点外扩，等价于包围盒） */
  private _computeRouteBounds(): void {
    const t = this._routeBounds;
    const n = this.pointsCount;
    if (n === 0) {
      t.setTo(NaN, NaN, 0, 0);
      this._routeOffset.setTo(0, 0);
      return;
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    // 官方 cA 用 Math.min/Math.max 累积：**NaN 会传播**（布局前路线点为 NaN 时
    // routeBounds 变成 NaN 而非 ±Infinity）。若用 `if (p.x < minX)` 比较，
    // NaN 全部落空 → minX/maxX 保持 ±Infinity → 宽高为 -Infinity →
    // Panel._measureLink 里 `new Rect(0,0,-Infinity,-Infinity)` 抛错，
    // 整个 _performLayout 中断、TreeLayout 根本没机会执行（faultTree 全部节点
    // position=NaN、104 个 Rect 报错）。
    for (let i = 0; i < n; i++) {
      const p = this.getPoint(i);
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    t.setTo(minX, minY, maxX - minX, maxY - minY);
    this._routeOffset.setTo(0, 0);

    // 官方 `Link.cA()` 只写 routeBounds + routeOffset（BS），
    // 不碰 position / naturalBounds / measuredBounds / actualBounds ——
    // 这些由 Panel._measureLink（官方 PanelLayoutLink.measure）在测量阶段写入：
    //   position = routeBounds 原点 + or.origin，
    //   natural = measured = (0,0,or.width,or.height)，
    //   actualBounds = (position, measured)（由 Part.ensureBounds 派生）。
    // 早先这里按路线中点居中回写 position/bounds 是错误简化，已移除。
  }

  /** 官方 `Link.startRoute()` */
  startRoute(): void {
    if (this._oldPoints === null) {
      this._oldPoints = this._points;
      this._points = this._points.copy();
    }
  }

  /** 官方 `Link.commitRoute()` */
  commitRoute(): void {
    if (this._oldPoints === null) return;
    const old = this._oldPoints;
    const neu = this._points;
    this._oldPoints = null;
    this._finalizeRoute();
    this.raiseChanged('points', old, neu);
  }

  /** 官方 `Link.rollbackRoute()` */
  rollbackRoute(): void {
    if (this._oldPoints !== null) {
      this._points = this._oldPoints;
      this._oldPoints = null;
      this._computeRouteBounds();
    }
  }

  /** 官方 `Link.zS()`：标记路由有效并刷新派生缓存 */
  private _finalizeRoute(): void {
    if (this._points.count === 0) {
      this._isRouteValid = false;
      return;
    }
    this._isRouteValid = true;
    this._computeRouteBounds();
    this._flattenedLengths = null;
    this._flattenedTotalLength = NaN;
    const p0 = this.getPoint(0);
    this.defaultFromPoint = p0;
    this.defaultToPoint = this.getPoint(this.pointsCount - 1);
  }

  /**
   * 官方对 `curve === CurveBezier` 的两点路线**在 computePoints 里就插入两个
   * 控制点**，使 `link.points` 变成 4 点的三次贝塞尔，而不是留到渲染时再弯。
   * 实测 friendWheel：官方 `link0.points` 为 4 点
   * `[[594.46,53.7],[595.46,74.25],[597.86,75.39],[614.47,63.25]]`；
   * 修复前我们是 2 点，画出来是直线。
   *
   * 官方 `Link.RF = 16`，即未显式设置 curviness 时的默认值。
   * 控制点取弦上 1/3、2/3 处，再沿弦法线偏移 curviness：
   * 水平弦（h≈0）直接改 y，其余按斜率 f = -a/h 投影。
   */
  private _applyBezierCurve(): void {
    if (this.computeCurve() !== CurveBezier) return;
    const pts = this._points;
    if (pts.count !== 2) return;
    const r = pts.get(0);
    const l = pts.get(1);
    if (!r || !l) return;
    const a = l.x - r.x;
    const h = l.y - r.y;
    if (a === 0 && h === 0) return;
    const c = this.computeCurviness();
    if (!c) return;

    let f = 0;
    let u = 0;
    if (h === 0) {
      // 水平弦：控制点直接上下平移 curviness
      u = a > 0 ? -c : c;
    } else {
      f = -a / h;
      u = Math.sqrt((c * c) / (f * f + 1));
      if (c < 0) u = -u;
    }

    const sign = h < 0 ? -1 : 1;
    const d1 = r.x + a / 3;
    const m1 = r.y + h / 3;
    const d2 = r.x + (2 * a) / 3;
    const m2 = r.y + (2 * h) / 3;

    let g1: number;
    let p1: number;
    let g2: number;
    let p2: number;
    if (h === 0) {
      g1 = d1;
      p1 = m1 + (a > 0 ? -c : c);
      g2 = d2;
      p2 = m2 + (a > 0 ? -c : c);
    } else {
      g1 = sign * u + d1;
      p1 = f * (g1 - d1) + m1;
      g2 = sign * u + d2;
      p2 = f * (g2 - d2) + m2;
    }
    pts.insertAt(1, new Point(g1, p1));
    pts.insertAt(2, new Point(g2, p2));
  }

  /** 官方 `Link.updateRoute()` */
  updateRoute(): void {
    if (this._isRouteValid || this._isComputingRoute) return;
    let ok = true;
    try {
      this._isComputingRoute = true;
      this.startRoute();
      ok = this.computePoints();
    } catch (e) {
      this._isComputingRoute = false;
      this.rollbackRoute();
    } finally {
      this._isComputingRoute = false;
      if (ok) this.commitRoute();
      else this.rollbackRoute();
      if (ok) this._applyBezierCurve();
      // 官方 `Link.xN()` / `h3()`：算完路线后把 Link 的几何**直接写进主 Shape 的
      // _geometry 字段**（绕过 Shape.geometry setter，避免每次算路线都触发重新测量）。
      // 官方是无条件同步的（`this.dt` 初始就是一个空 Geometry），所以哪怕
      // pointsCount < 2，`link.path.geometry` 也是个 Geometry 而不是 null。
      // 不做这一步：`pathAnimation` 的 `link.path.geometry.getPointAlongPath(frac)`、
      // `treeLoadAnimation` 的 `link.elt(0).geometry.copy()` 都会抛
      // `Cannot read properties of null`。
      this._syncGeometryToMainShapes();
    }
  }

  /** 官方：把 link 的几何同步给 `path` 以及所有 isPanelMain 的 Shape 元素 */
  private _syncGeometryToMainShapes(): void {
    // 官方 `Link.CN()`：几何无效时先重建（`pointsCount>=2 → bt=makeGeometry()`，
    // 否则也把 jh 置 true），再同步给 path 与各主 Shape。
    // 早先这里直接读可能过期的 `_geometry`，route 重算后主 Shape 拿到旧几何，
    // measureLinkPath 量出的 path bounds 与官方不符。
    if (!this._isGeometryValid) {
      if (this.pointsCount >= 2) this._geometry = this.makeGeometry();
      this._isGeometryValid = true;
    }
    const geo = this._geometry;
    if (!geo) return;
    const path = this.path;
    if (path !== null) {
      (path as any)._geometry = geo;
      (path as any)._invalidateGeometryCache();
    }
    const els: any = (this as any)._elements;
    if (!els || !els.length) return;
    for (const o of els) {
      if (o !== path && o.isPanelMain === true && o instanceof Shape) {
        (o as any)._geometry = geo;
        (o as any)._invalidateGeometryCache();
      }
    }
  }

  /** 官方 `Link.invalidateRoute()`（= `oi()`，本项目无 invalid-route 集合，只做失效标记） */
  invalidateRoute(): void {
    if (this._suspendsRouting) return;
    if (this.path === null) return;
    // 已失效则幂等返回（对齐官方 invalidateGeometry 的 `if(!isGeometryValid)` 护栏）——
    // 避免同一布局趟内重复触发 _invalidateMeasure/requestUpdate。
    if (!this._isRouteValid && !this._isGeometryValid) return;
    const d: any = this.diagram;
    if (d !== null && d !== undefined) {
      const um = d.undoManager;
      if (um && um.isUndoingRedoing) return;
      const am = d.animationManager;
      if (am && am.isTicking && !am.isAnimating) return;
      if (this._oldPoints !== null && !(am && am.isTicking)) this._oldPoints = null;
    }
    this._isRouteValid = false;
    this._isGeometryValid = false;
    this._invalidateMeasure();
  }

  /** 官方 `Link.invalidateGeometry()`（= `ge()`） */
  invalidateGeometry(): void {
    if (this._isGeometryValid) {
      this._isGeometryValid = false;
      this._invalidateMeasure();
    }
  }

  /** 官方 `Link.geometry` */
  get geometry(): Geometry {
    if (!this._isGeometryValid) {
      this.updateRoute();
      if (this.pointsCount < 2) {
        this._isGeometryValid = true;
        return this._geometry;
      }
      this._geometry = this.makeGeometry();
      this._isGeometryValid = true;
    }
    return this._geometry;
  }

  /**
   * 官方 `Link.wc(t, isFrom, ref)`：把几何端点沿首/末线段向内缩短
   * `computeShortLength`（2 点时上限为半段长，多点时上限为整段长）。
   * 官方在 makeGeometry 内对几何做短化（link.points 本身不含短化）。
   * 经官方坐标系（平移到 min、ref=min/0,0）化简后等价于对原始坐标直接缩短。
   */
  private _wcPoint(t: Point, isFrom: boolean): void {
    const s = this.pointsCount;
    if (s < 2) return;
    const nb = isFrom ? this.getPoint(1) : this.getPoint(s - 2);
    const dx = nb.x - t.x;
    const dy = nb.y - t.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return;
    const h = s === 2 ? len * 0.5 : len;
    let a = this.computeShortLength(isFrom);
    if (isNaN(a) || a <= 0) return;
    if (a > h) a = h;
    t.x += (a * dx) / len;
    t.y += (a * dy) / len;
  }

  /** 官方 `Link.makeGeometry()`（本项目无 Transform 矩阵，按点列构造折线/贝塞尔几何） */
  makeGeometry(): Geometry {
    const n = this.pointsCount;
    const geo = new Geometry();
    if (n < 2) return geo;
    const pts = this._points;
    // 官方：n = min(points.x) - BS.x，o = min(points.y) - BS.y，所有点减 (n,o) ——
    // 几何原点是点列 bbox 左上角（route-local 帧），不是文档坐标。
    // BS = routeOffset（本项目恒 (0,0)，仍按官方参与平移）。
    let nx = Infinity;
    let ny = Infinity;
    for (let i = 0; i < n; i++) {
      const p = pts.elt(i);
      if (p.x < nx) nx = p.x;
      if (p.y < ny) ny = p.y;
    }
    if (!isFinite(nx) || !isFinite(ny)) { nx = 0; ny = 0; }
    const bs = this._routeOffset;
    nx -= bs.x;
    ny -= bs.y;
    // 官方先平移再用「原始」首点 ref 做短化：与「先短化再平移」等价（平移是均匀的）。
    const first = pts.elt(0).copy();
    if (this.computeShortLength(true) !== 0) this._wcPoint(first, true);
    const last = pts.elt(n - 1).copy();
    if (this.computeShortLength(false) !== 0) this._wcPoint(last, false);
    first.x -= nx; first.y -= ny;
    last.x -= nx; last.y -= ny;
    const at = (i: number): Point =>
      i === n - 1 ? last : i === 0 ? first : new Point(pts.elt(i).x - nx, pts.elt(i).y - ny);
    const fig = new PathFigure(first.x, first.y, false);
    const bezier = this.computeCurve() === CurveBezier;
    if (bezier && !this.isOrthogonal && n >= 4 && (n - 1) % 3 === 0) {
      for (let i = 1; i + 2 < n; i += 3) {
        const p1 = new Point(pts.elt(i).x - nx, pts.elt(i).y - ny);
        const p2 = new Point(pts.elt(i + 1).x - nx, pts.elt(i + 1).y - ny);
        const p3 = at(i + 2);
        fig.add(PathSegment.CubicBezier(p3.x, p3.y, p1.x, p1.y, p2.x, p2.y));
      }
    } else if (bezier && n === 3) {
      const p1 = new Point(pts.elt(1).x - nx, pts.elt(1).y - ny);
      const p2 = at(2);
      fig.add(PathSegment.QuadraticBezier(p2.x, p2.y, p1.x, p1.y));
    } else {
      for (let i = 1; i < n; i++) {
        const p = at(i);
        fig.add(PathSegment.Line(p.x, p.y));
      }
    }
    geo.add(fig);
    return geo;
  }

  /** 官方 `Link.adjustPoints(start, p1, end, p2)` */
  adjustPoints(start: number, p1: Point, end: number, p2: Point): boolean {
    let n: EnumValue = this.computeAdjusting();
    if (this.isOrthogonal) {
      if (n === LinkAdjustingScale) return false;
      if (n === LinkAdjustingStretch) n = LinkAdjustingEnd;
    }
    if (n === LinkAdjustingScale) return this._adjustScale(start, end, p1, p2);
    if (n === LinkAdjustingStretch) return this._adjustStretch(start, end, p1, p2);
    if (n === LinkAdjustingEnd) return this._adjustEnd(start, end, p1, p2);
    return false;
  }

  /** 官方 `Link.f4`（LinkAdjusting.Scale：保持形状的仿射变换） */
  private _adjustScale(t: number, i: number, e: Point, s: Point): boolean {
    const n = this.getPoint(t);
    const o = this.getPoint(i);
    if (n.equalsApprox(e) && o.equalsApprox(s)) return true;
    const r = n.x, l = n.y, h = o.x, a = o.y;
    let c = h - r, f = a - l;
    const u = Math.sqrt(c * c + f * f);
    if (Link._approxZero(u)) return true;
    let d: number;
    if (Link._approxZero(c)) d = f < 0 ? -Math.PI / 2 : Math.PI / 2;
    else {
      d = Math.atan(f / Math.abs(c));
      if (c < 0) d = Math.PI - d;
    }
    const m = e.x, g = e.y, p = s.x, y = s.y;
    const x = p - m, b = y - g;
    const S = Math.sqrt(x * x + b * b);
    let k: number;
    if (Link._approxZero(x)) k = b < 0 ? -Math.PI / 2 : Math.PI / 2;
    else {
      k = Math.atan(b / Math.abs(x));
      if (x < 0) k = Math.PI - k;
    }
    const P = S / u;
    const A = k - d;
    this.setPoint(t, e);
    for (let N = t + 1; N < i; N++) {
      const M = this.getPoint(N);
      c = M.x - r;
      f = M.y - l;
      const C = Math.sqrt(c * c + f * f);
      if (Link._approxZero(C)) continue;
      let T: number;
      if (Link._approxZero(c)) T = f < 0 ? -Math.PI / 2 : Math.PI / 2;
      else {
        T = Math.atan(f / Math.abs(c));
        if (c < 0) T = Math.PI - T;
      }
      const L = T + A;
      const D = C * P;
      this.setPointAt(N, m + D * Math.cos(L), g + D * Math.sin(L));
    }
    return (this.setPoint(i, s), true);
  }

  /** 官方 `Link.u4`（LinkAdjusting.Stretch：端点对齐的拉伸） */
  private _adjustStretch(t: number, i: number, e: Point, s: Point): boolean {
    const n = this.getPoint(t);
    const o = this.getPoint(i);
    if (n.equalsApprox(e) && o.equalsApprox(s)) return true;
    const r = n.x, l = n.y, h = o.x, a = o.y;
    const c = (h - r) * (h - r) + (a - l) * (a - l);
    const f = e.x, u = e.y, d = s.x, m = s.y;
    let g = 0, p = 1;
    if (d - f !== 0) {
      g = (m - u) / (d - f);
      p = Math.sqrt(1 + 1 / (g * g));
    } else g = 9e9;
    this.setPoint(t, e);
    for (let y = t + 1; y < i; y++) {
      const x = this.getPoint(y);
      const b = x.x, S = x.y;
      let k = 0.5;
      if (c !== 0) k = ((r - b) * (r - h) + (l - S) * (l - a)) / c;
      const P = r + k * (h - r);
      const A = l + k * (a - l);
      let N = Math.sqrt((b - P) * (b - P) + (S - A) * (S - A));
      if (S < g * (b - P) + A) N = -N;
      if (g > 0) N = -N;
      const M = f + k * (d - f);
      const C = u + k * (m - u);
      if (g !== 0) {
        const T = M + N / p;
        this.setPointAt(y, T, C - (T - M) / g);
      } else this.setPointAt(y, M, C + N);
    }
    return (this.setPoint(i, s), true);
  }

  /** 官方 `Link.d4`（LinkAdjusting.End：只改端点；本项目无 positions 网格，跳过占用校验） */
  private _adjustEnd(t: number, i: number, e: Point, s: Point): boolean {
    if (this.isOrthogonal) {
      let n = this.getPoint(t);
      let o = this.getPoint(t + 1);
      let r = this.getPoint(t + 2);
      let l = o.x, h = o.y;
      const a = l, c = h;
      if (Link._approx(n.y, o.y)) {
        if (Link._approx(o.x, r.x)) h = e.y;
        else if (Link._approx(o.y, r.y)) l = e.x;
      } else if (Link._approx(n.x, o.x)) {
        if (Link._approx(o.y, r.y)) l = e.x;
        else if (Link._approx(o.x, r.x)) h = e.y;
      }
      this.setPointAt(t + 1, l, h);
      n = this.getPoint(i);
      o = this.getPoint(i - 1);
      r = this.getPoint(i - 2);
      let f = o.x, u = o.y;
      const d = f, m = u;
      if (Link._approx(n.y, o.y)) {
        if (Link._approx(o.x, r.x)) u = s.y;
        else if (Link._approx(o.y, r.y)) f = s.x;
      } else if (Link._approx(n.x, o.x)) {
        if (Link._approx(o.y, r.y)) f = s.x;
        else if (Link._approx(o.x, r.x)) u = s.y;
      }
      this.setPointAt(i - 1, f, u);
      if (this._positionsOverlap()) {
        this.setPointAt(t + 1, a, c);
        this.setPointAt(i - 1, d, m);
        return false;
      }
    }
    this.setPoint(t, e);
    this.setPoint(i, s);
    return true;
  }

  /** 官方 `Link.ZL()`：正交路由是否撞到已占用区域（本项目无 positions 网格，恒不重叠） */
  private _positionsOverlap(): boolean {
    return false;
  }

  /** 官方 `Link.computeMidOrthoPosition(fromX, fromY, toX, toY, vertical)` */
  computeMidOrthoPosition(fromX: number, fromY: number, toX: number, toY: number, vertical: boolean): number {
    let extra = 0;
    if (this.hasCurviness() && !this.computeSpot(true, this.fromPort).isSide() &&
      !this.computeSpot(false, this.toPort).isSide()) {
      extra = this.computeCurviness();
    }
    return vertical ? (fromY + toY) / 2 + extra : (fromX + toX) / 2 + extra;
  }

  /**
   * 官方 `Link.addOrthoPoints(startFrom, fromDir, endTo, toDir, fromnode, tonode)`。
   * 逐分支转译自 go-debug.js 778104..784083（含 fA/sA/nA 路由状态与尾部两点追加）。
   */
  addOrthoPoints(startFrom: Point, fromDir: number, endTo: Point, toDir: number, fromnode: Node, tonode: Node): void {
    let i = Link._normalizeAngle(fromDir);
    let s = Link._normalizeAngle(toDir);
    const c = s;
    if (i >= 315 || i < 45) i = 0;
    else if (i >= 45 && i < 135) i = 90;
    else if (i >= 135 && i < 225) i = 180;
    else i = 270;
    if (s >= 315 || s < 45) s = 0;
    else if (s >= 45 && s < 135) s = 90;
    else if (s >= 135 && s < 225) s = 180;
    else s = 270;

    const f = startFrom;
    const u = endTo;
    const d = fromnode.getDocumentBounds().copy();
    const m = tonode.getDocumentBounds().copy();
    d.inflate(Link._Wh, Link._Wh);
    m.inflate(Link._Wh, Link._Wh);
    d.unionPoint(startFrom);
    m.unionPoint(endTo);
    const g = new Point();
    const p = new Point();
    const mid = (x1: number, y1: number, x2: number, y2: number, vertical: boolean): number =>
      this.computeMidOrthoPosition(x1, y1, x2, y2, vertical);

    if (i === 0) {
      if (u.x > f.x || (s === 270 && u.y < f.y && m.right > f.x) || (s === 90 && u.y > f.y && m.right > f.x)) {
        g.setTo(u.x, f.y);
        p.setTo(u.x, (f.y + u.y) / 2);
        if (s === 180) {
          g.x = mid(f.x, f.y, u.x, u.y, false);
          p.x = g.x;
          p.y = u.y;
        } else if ((s === 270 && u.y < f.y) || (s === 90 && u.y > f.y)) {
          if (f.x < m.left) g.x = mid(f.x, f.y, m.left, u.y, false);
          else if (f.x < m.right && ((s === 270 && f.y < m.top) || (s === 90 && f.y > m.bottom)))
            g.x = mid(f.x, f.y, u.x, u.y, false);
          else g.x = m.right;
          p.x = g.x;
          p.y = u.y;
        } else if (s === 0 && f.x < m.left && f.y > m.top && f.y < m.bottom) {
          g.x = f.x;
          g.y = f.y < u.y ? Math.min(u.y, m.top) : Math.max(u.y, m.bottom);
          p.y = g.y;
        }
      } else {
        g.setTo(f.x, u.y);
        p.setTo((f.x + u.x) / 2, u.y);
        if (s === 180 || (s === 90 && u.y < d.top) || (s === 270 && u.y > d.bottom)) {
          const y = m.containsPoint(f) || d.containsPoint(u);
          if (s === 180 && y) g.y = mid(f.x, f.y, u.x, u.y, true);
          else if (u.y < f.y && (s === 180 || s === 90)) {
            const x = y ? Math.min(u.y, m.bottom) : Math.max(u.y, m.bottom);
            g.y = mid(f.x, d.top, u.x, x, true);
          } else if (u.y > f.y && (s === 180 || s === 270)) {
            const x = y ? Math.max(u.y, m.top) : Math.min(u.y, m.top);
            g.y = mid(f.x, d.bottom, u.x, x, true);
          }
          p.x = u.x;
          p.y = g.y;
        }
        if (g.y > d.top && g.y < d.bottom) {
          if ((u.x >= d.left && u.x <= f.x) || (f.x <= m.right && f.x >= u.x)) {
            if (s === 90 || s === 270) {
              g.setTo(Math.max((f.x + u.x) / 2, f.x), f.y);
              p.setTo(g.x, u.y);
            }
          } else {
            if (s === 270 || ((s === 0 || s === 180) && u.y < f.y))
              g.y = Math.min(u.y, s === 0 ? d.top : Math.min(d.top, m.top));
            else
              g.y = Math.max(u.y, s === 0 ? d.bottom : Math.max(d.bottom, m.bottom));
            p.x = u.x;
            p.y = g.y;
          }
        }
      }
    } else if (i === 180) {
      if (u.x < f.x || (s === 270 && u.y < f.y && m.left < f.x) || (s === 90 && u.y > f.y && m.left < f.x)) {
        g.setTo(u.x, f.y);
        p.setTo(u.x, (f.y + u.y) / 2);
        if (s === 0) {
          g.x = mid(f.x, f.y, u.x, u.y, false);
          p.x = g.x;
          p.y = u.y;
        } else if ((s === 270 && u.y < f.y) || (s === 90 && u.y > f.y)) {
          if (f.x > m.right) g.x = mid(f.x, f.y, m.right, u.y, false);
          else if (f.x > m.left && ((s === 270 && f.y < m.top) || (s === 90 && f.y > m.bottom)))
            g.x = mid(f.x, f.y, u.x, u.y, false);
          else g.x = m.left;
          p.x = g.x;
          p.y = u.y;
        } else if (s === 180 && f.x > m.right && f.y > m.top && f.y < m.bottom) {
          g.x = f.x;
          g.y = f.y < u.y ? Math.min(u.y, m.top) : Math.max(u.y, m.bottom);
          p.y = g.y;
        }
      } else {
        g.setTo(f.x, u.y);
        p.setTo((f.x + u.x) / 2, u.y);
        if (s === 0 || (s === 90 && u.y < d.top) || (s === 270 && u.y > d.bottom)) {
          const y = m.containsPoint(f) || d.containsPoint(u);
          if (s === 0 && y) g.y = mid(f.x, f.y, u.x, u.y, true);
          else if (u.y < f.y && (s === 0 || s === 90)) {
            const x = y ? Math.min(u.y, m.bottom) : Math.max(u.y, m.bottom);
            g.y = mid(f.x, d.top, u.x, x, true);
          } else if (u.y > f.y && (s === 0 || s === 270)) {
            const x = y ? Math.max(u.y, m.top) : Math.min(u.y, m.top);
            g.y = mid(f.x, d.bottom, u.x, x, true);
          }
          p.x = u.x;
          p.y = g.y;
        }
        if (g.y > d.top && g.y < d.bottom) {
          if ((u.x <= d.right && u.x >= f.x) || (f.x >= m.left && f.x <= u.x)) {
            if (s === 90 || s === 270) {
              g.setTo(Math.min((f.x + u.x) / 2, f.x), f.y);
              p.setTo(g.x, u.y);
            }
          } else {
            if (s === 270 || ((s === 0 || s === 180) && u.y < f.y))
              g.y = Math.min(u.y, s === 180 ? d.top : Math.min(d.top, m.top));
            else
              g.y = Math.max(u.y, s === 180 ? d.bottom : Math.max(d.bottom, m.bottom));
            p.x = u.x;
            p.y = g.y;
          }
        }
      }
    } else if (i === 90) {
      if (u.y > f.y || (s === 180 && u.x < f.x && m.bottom > f.y) || (s === 0 && u.x > f.x && m.bottom > f.y)) {
        g.setTo(f.x, u.y);
        p.setTo((f.x + u.x) / 2, u.y);
        if (s === 270) {
          g.y = mid(f.x, f.y, u.x, u.y, true);
          p.x = u.x;
          p.y = g.y;
        } else if ((s === 180 && u.x < f.x) || (s === 0 && u.x > f.x)) {
          if (f.y < m.top) g.y = mid(f.x, f.y, u.x, m.top, true);
          else if (f.y < m.bottom && ((s === 180 && f.x < m.left) || (s === 0 && f.x > m.right)))
            g.y = mid(f.x, f.y, u.x, u.y, true);
          else g.y = m.bottom;
          p.x = u.x;
          p.y = g.y;
        } else if (s === 90 && f.y < m.top && f.x > m.left && f.x < m.right) {
          if (f.x < u.x) g.x = Math.min(u.x, m.left);
          else g.x = Math.max(u.x, m.right);
          g.y = f.y;
          p.x = g.x;
        }
      } else {
        g.setTo(u.x, f.y);
        p.setTo(u.x, (f.y + u.y) / 2);
        if (s === 270 || (s === 0 && u.x < d.left) || (s === 180 && u.x > d.right)) {
          const y = m.containsPoint(f) || d.containsPoint(u);
          if (s === 270 && y) g.x = mid(f.x, f.y, u.x, u.y, false);
          else if (u.x < f.x && (s === 270 || s === 0)) {
            const x = y ? Math.min(u.x, m.right) : Math.max(u.x, m.right);
            g.x = mid(d.left, f.y, x, u.y, false);
          } else if (u.x > f.x && (s === 270 || s === 180)) {
            const x = y ? Math.max(u.x, m.left) : Math.min(u.x, m.left);
            g.x = mid(d.right, f.y, x, u.y, false);
          }
          p.x = g.x;
          p.y = u.y;
        }
        if (g.x > d.left && g.x < d.right) {
          if ((u.y >= d.top && u.y <= f.y) || (f.y <= m.bottom && f.y >= u.y)) {
            if (s === 0 || s === 180) {
              g.setTo(f.x, Math.max((f.y + u.y) / 2, f.y));
              p.setTo(u.x, g.y);
            }
          } else {
            if (s === 180 || ((s === 90 || s === 270) && u.x < f.x))
              g.x = Math.min(u.x, s === 90 ? d.left : Math.min(d.left, m.left));
            else
              g.x = Math.max(u.x, s === 90 ? d.right : Math.max(d.right, m.right));
            p.x = g.x;
            p.y = u.y;
          }
        }
      }
    } else {
      // i === 270
      if (u.y < f.y || (s === 180 && u.x < f.x && m.top < f.y) || (s === 0 && u.x > f.x && m.top < f.y)) {
        g.setTo(f.x, u.y);
        p.setTo((f.x + u.x) / 2, u.y);
        if (s === 90) {
          g.y = mid(f.x, f.y, u.x, u.y, true);
          p.x = u.x;
          p.y = g.y;
        } else if ((s === 180 && u.x < f.x) || (s === 0 && u.x >= f.x)) {
          if (f.y > m.bottom) g.y = mid(f.x, f.y, u.x, m.bottom, true);
          else if (f.y > m.top && ((s === 180 && f.x < m.left) || (s === 0 && f.x > m.right)))
            g.y = mid(f.x, f.y, u.x, u.y, true);
          else g.y = m.top;
          p.x = u.x;
          p.y = g.y;
        } else if (s === 270 && f.y > m.bottom && f.x > m.left && f.x < m.right) {
          if (f.x < u.x) g.x = Math.min(u.x, m.left);
          else g.x = Math.max(u.x, m.right);
          g.y = f.y;
          p.x = g.x;
        }
      } else {
        g.setTo(u.x, f.y);
        p.setTo(u.x, (f.y + u.y) / 2);
        if (s === 90 || (s === 0 && u.x < d.left) || (s === 180 && u.x > d.right)) {
          const y = m.containsPoint(f) || d.containsPoint(u);
          if (s === 90 && y) g.x = mid(f.x, f.y, u.x, u.y, false);
          else if (u.x < f.x && (s === 90 || s === 0)) {
            const x = y ? Math.min(u.x, m.right) : Math.max(u.x, m.right);
            g.x = mid(d.left, f.y, x, u.y, false);
          } else if (u.x > f.x && (s === 90 || s === 180)) {
            const x = y ? Math.max(u.x, m.left) : Math.min(u.x, m.left);
            g.x = mid(d.right, f.y, x, u.y, false);
          }
          p.x = g.x;
          p.y = u.y;
        }
        if (g.x > d.left && g.x < d.right) {
          if ((u.y <= d.bottom && u.y >= f.y) || (f.y >= m.top && f.y <= u.y)) {
            if (s === 0 || s === 180) {
              g.setTo(f.x, Math.min((f.y + u.y) / 2, f.y));
              p.setTo(u.x, g.y);
            }
          } else {
            if (s === 180 || ((s === 90 || s === 270) && u.x < f.x))
              g.x = Math.min(u.x, s === 270 ? d.left : Math.min(d.left, m.left));
            else
              g.x = Math.max(u.x, s === 270 ? d.right : Math.max(d.right, m.right));
            p.x = g.x;
            p.y = u.y;
          }
        }
      }
    }

    this._fA = s !== c;
    this._sA = i;
    this._nA = s;
    this.addPoint(g.copy());
    this.addPoint(p.copy());
  }

  /** 官方 Link 路由状态字段：fA=toDir 被吸附, sA=fromDir 吸附值, nA=toDir 吸附值 */
  private _fA: boolean = false;
  private _sA: number = 0;
  private _nA: number = 0;

  /** 官方 `Link.sA`：addOrthoPoints 吸附后的 from 方向（AvoidsNodesRouter.rV 读取） */
  get sA(): number { return this._sA; }
  /** 官方 `Link.nA`：吸附后的 to 方向 */
  get nA(): number { return this._nA; }
  /** 官方 `Link.fA`：端点方向是否被节点边缘吸附 */
  get fA(): boolean { return this._fA; }

  /** 官方 `Link.invalidateOtherJumpOvers(bounds)`（本项目不做 jump 几何缓存，仅让同批 JumpOver/Gap 失效） */
  invalidateOtherJumpOvers(bounds: Rect): void {
    const layer: any = this.layer;
    if (layer === null || !layer.visible || layer.isTemporary) return;
    const d: any = layer.diagram;
    if (d === null || d === undefined) return;
    const am = d.animationManager;
    if (am && am.isTicking) return;
    const layers = d.layers;
    if (!layers) return;
    while (layers.next()) {
      const l: any = layers.value;
      if (!l.visible || l.isTemporary) continue;
      const parts = l.parts;
      if (!parts) continue;
      while (parts.next()) {
        const p: any = parts.value;
        if (!(p instanceof Link) || p === this) continue;
        const curve = p.computeCurve();
        if (curve !== CurveJumpOver && curve !== CurveJumpGap) continue;
        const rb = p.routeBounds;
        const intersects = !this.routeBounds.intersectsRect(rb) && !bounds.intersectsRect(rb);
        if (intersects || this.usesSamePort(p) || p._positionsOverlap()) p.invalidateRoute();
      }
    }
  }

  // ============ end official Link members ============

  copy(): Link {
    const c = new Link(this._type);
    this._copyPropertiesTo(c as any);
    this._copyPanelPropertiesTo(c as any);
    this._copyPartPropertiesTo(c);
    // Copy Link-specific properties
    c._routing = this._routing;
    c._curve = this._curve;
    c._corner = this._corner;
    c._curviness = this._curviness;
    c._resegmentable = this._resegmentable;
    c._adjusting = this._adjusting;
    c._relinkableFrom = this._relinkableFrom;
    c._relinkableTo = this._relinkableTo;
    c._isTreeLink = this._isTreeLink;
    c._fromPortChanged = this._fromPortChanged;
    c._toPortChanged = this._toPortChanged;
    c._suspendsRouting = this._suspendsRouting;
    c._smoothness = this._smoothness;
    c._defaultFromPoint = this._defaultFromPoint.copy();
    c._defaultToPoint = this._defaultToPoint.copy();
    if (this._labelNodes !== null) c._labelNodes = this._labelNodes.copy();
    return c;
  }
}

GraphObject.defineBuilder('Link', Link);
