import { Part } from './Part';
import { GraphObject } from './GraphObject';
import { Node } from './Node';
import { Point } from '../core/Point';
import { Spot } from '../core/Spot';
import { List } from '../core/List';
import { Iterator } from '../core/Iterable';
import { Rect } from '../core/Rect';
import { EnumValue } from '../core/EnumValues';
import { Geometry } from '../core/Geometry';
/**
 * Link - a Part that represents a connection between two Nodes.
 */
export declare class Link extends Part {
    static readonly className: string;
    /** 官方 `Link.Normal = Routing.Normal` */
    static readonly Normal: EnumValue;
    /** 官方 `Link.Orthogonal = Routing.Orthogonal` */
    static readonly Orthogonal: EnumValue;
    /** 官方 `Link.AvoidsNodes = Routing.AvoidsNodes` */
    static readonly AvoidsNodes: EnumValue;
    /** 官方 `Link.AvoidsNodesStraight` */
    static readonly AvoidsNodesStraight: EnumValue;
    /** 官方 `Link.None = 0`（routing：不使用任何路由算法） */
    static readonly None: EnumValue;
    /** 官方 `Link.Bezier = Curve.Bezier` */
    static readonly Bezier: EnumValue;
    /** 官方 `Link.JumpGap = Curve.JumpGap` */
    static readonly JumpGap: EnumValue;
    /** 官方 `Link.JumpOver = Curve.JumpOver` */
    static readonly JumpOver: EnumValue;
    /** 官方 `Link.End = LinkAdjusting.End` */
    static readonly End: EnumValue;
    /** 官方 `Link.Scale = LinkAdjusting.Scale` */
    static readonly Scale: EnumValue;
    /** 官方 `Link.Stretch = LinkAdjusting.Stretch` */
    static readonly Stretch: EnumValue;
    /** 官方 `Link.OrientAlong = Orientation.Along` */
    static readonly OrientAlong: EnumValue;
    /** 官方 `Link.OrientPlus90` */
    static readonly OrientPlus90: EnumValue;
    /** 官方 `Link.OrientMinus90` */
    static readonly OrientMinus90: EnumValue;
    /** 官方 `Link.OrientOpposite` */
    static readonly OrientOpposite: EnumValue;
    /** 官方 `Link.OrientUpright` */
    static readonly OrientUpright: EnumValue;
    /** 官方 `Link.OrientPlus90Upright` */
    static readonly OrientPlus90Upright: EnumValue;
    /** 官方 `Link.OrientMinus90Upright` */
    static readonly OrientMinus90Upright: EnumValue;
    /** 官方 `Link.OrientUpright45` */
    static readonly OrientUpright45: EnumValue;
    /** 官方 `Link.zF`（setRoutingParameter(1)） */
    private static _zF;
    /** 官方 `Link.XF`（2，默认 curviness） */
    private static _XF;
    /** 官方 `Link.Wh`（3） */
    private static _Wh;
    /** 官方 `Link.Wh` 公开访问（AvoidsNodesRouter 端点矩形膨胀用） */
    static get Wh(): number;
    /** 官方 `Link.yS`（4） */
    private static _yS;
    /** 官方 `Link.YF`（5） */
    private static _YF;
    /** 官方 `Link.KF`（6，Bezier 曲线的 spacing 倍率） */
    private static _KF;
    /** 官方 `Link.rA`（7，共线判定容差） */
    private static _rA;
    /** 官方 `Link.lA`（8，Bezier 端点长度比例） */
    private static _lA;
    /** 官方 `Link.UF`（9） */
    private static _UF;
    /** 官方 `Link.ou`（10） */
    private static _ou;
    /** 官方 `Link.GF`（11） */
    private static _GF;
    /** 官方 `Link.qF`（12） */
    private static _qF;
    /** 官方 `Link.hA`（13，默认 end segment length） */
    private static _hA;
    /** 官方 `Link.HF`（14，默认 corner） */
    private static _HF;
    /** 官方 `Link.vF`（15，默认 spacing） */
    private static _vF;
    /** 官方 `Link.WF`（16） */
    private static _WF;
    /** 官方 `Link.jF`（17） */
    private static _jF;
    /** 官方 `Link.RL`（18） */
    private static _RL;
    /** 官方 `Link.IL`（19） */
    private static _IL;
    /** 官方 `Link.JF`（20） */
    private static _JF;
    /** 官方 `Link.JF` 公开访问（PositionArray.Nf 每格距离场步数上限） */
    static get JF(): number;
    /** 官方 `Link.yD`（setRoutingParameter 中 30..70 区间的内部保留值） */
    private static _yD;
    /** 官方 `Link.setRoutingParameter(idx, value)`：设置路由算法的内部参数（1..20，以及 30..70 的保留位） */
    static setRoutingParameter(idx: number, value: number): void;
    /** 官方 `Link.computeAngle(orientation, angle)`（静态） */
    static computeAngle(orientation: any, angle: number): number;
    /** 官方 `Link.computeAngle(inputAngle, u, v)`（实例，委托静态实现） */
    computeAngle(inputAngle: number, u: number, v: number): number;
    /** 官方 `G.qi`：把角度归一到 [0, 360) */
    private static _normalizeAngle;
    /** 把 `Orientation.*` 枚举值（或数字）映射到官方 computeAngle 的分支码 */
    private static _orientationCode;
    /** 供 Panel._measureLink 使用的 orientation 分支码（官方 measure 里 `L` 的值） */
    static orientationCode(o: any): number;
    /** 官方 `G.u`（近似相等，用于正交路由的共线判定） */
    private static _approx;
    /** 官方 `G.H`（近似等于 0） */
    private static _approxZero;
    /** 官方 `G.G`（严格近似相等，|a-b| < 5e-8）——`Link.cT` 用它判定点重合/共线 */
    private static _gG;
    /** 官方 `G.c`（宽松近似相等，|a-b| < 0.5）——`Link.f3` 用它判定向量是否为正交 */
    private static _gC;
    /** 官方 `Link.uA`：把 to 点沿主导方向推到无穷远处，用作正交方向参考 */
    private static _orthogonalize;
    /**
     * 官方 `GraphObject.getDocumentPoint(Spot, result)` 的等价实现：
     * - Shape 版：local = spot×(nb+sw) − sw/2 + nb.x/y（含描边），再经 D（逐级 ab−mb、
     *   带旋转 Part 走枢轴公式）变换到文档坐标；
     * - 通用版：local = spot×nb，再经 D。
     * 未旋转链下与旧实现（positionInRect(actualBounds)）严格等价：
     * ab + spot×(nb+sw) − sw/2 − (−sw/2) = ab + spot×(nb+sw)。
     */
    private static _docPoint;
    private _fromNode;
    private _toNode;
    private _fromPortId;
    private _toPortId;
    private _routing;
    private _curve;
    private _corner;
    private _curviness;
    private _points;
    private _resegmentable;
    private _adjusting;
    private _relinkableFrom;
    private _relinkableTo;
    private _jumpOver;
    private _jumpGap;
    private _isTreeLink;
    private _labelNodes;
    private _fromPortChanged;
    private _toPortChanged;
    private _suspendsRouting;
    private _smoothness;
    private _defaultFromPoint;
    private _defaultToPoint;
    private _isRouteValid;
    private _isComputingRoute;
    private _oldPoints;
    private _flattenedLengths;
    private _flattenedTotalLength;
    private _routeBounds;
    private _routeOffset;
    private _geometry;
    private _isGeometryValid;
    constructor(type?: any, init?: any);
    get fromNode(): Node | null;
    set fromNode(val: Node | null);
    get toNode(): Node | null;
    set toNode(val: Node | null);
    get fromPortId(): string;
    set fromPortId(val: string);
    get toPortId(): string;
    set toPortId(val: string);
    /** 官方 `Node.OS/ES → ne(port)`：连线端点变更时清空端口 knot 缓存 */
    private _ggPort;
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
    updateContainingGroup(): void;
    /** 官方 `Link.isTreeLink`（默认 true） */
    get isTreeLink(): boolean;
    set isTreeLink(val: boolean);
    /** 官方 `Link.labelNodes`：作为本链接标签的 Node 迭代器 */
    get labelNodes(): Iterator<Node>;
    /** 官方 `Link.isLabeledLink` */
    get isLabeledLink(): boolean;
    /** 官方 `Link.addLabelNode`（非公开）：把 node 设为本链接的标签 */
    _addLabelNode(node: Node): void;
    /** 官方 `Link.removeLabelNode`（非公开） */
    _removeLabelNode(node: Node): void;
    get routing(): EnumValue;
    set routing(val: EnumValue);
    get curve(): EnumValue;
    set curve(val: EnumValue);
    get corner(): number;
    set corner(val: number);
    get curviness(): number;
    set curviness(val: number);
    get jumpOver(): number;
    set jumpOver(val: number);
    get jumpGap(): number;
    set jumpGap(val: number);
    get points(): List<Point>;
    set points(val: List<Point>);
    get resegmentable(): boolean;
    set resegmentable(val: boolean);
    get adjusting(): EnumValue;
    set adjusting(val: EnumValue);
    get relinkableFrom(): boolean;
    set relinkableFrom(val: boolean);
    get relinkableTo(): boolean;
    set relinkableTo(val: boolean);
    /** Whether this link uses orthogonal routing（官方 `Link.isOrthogonal` = routing & 2） */
    get isOrthogonal(): boolean;
    /** 官方 `Link.isAvoiding` = routing & 4（仅 AvoidsNodes / AvoidsNodesStraight） */
    get isAvoiding(): boolean;
    /** Get the link connection point on the from port */
    getLinkPointFromPort(port: GraphObject, spot: Spot): Point;
    /** Get the link connection point on the to port */
    getLinkPointToPort(port: GraphObject, spot: Spot): Point;
    /** Compute the route points for this link */
    computePoints(): boolean;
    /** 官方 `Link.r4` 的 curviness 中点插入（非 Bezier 快路径，显式设置 curviness 时） */
    private _r4Mid;
    /** 官方 `Link.o4`：Bezier 快路径插入两个控制点并重算端点 */
    private _o4;
    /** Resolve the effective fromSpot for this link */
    private _resolveFromSpot;
    private _resolveToSpot;
    private _getPortDirection;
    private _offsetPoint;
    private _perpendicularDir;
    private _isOppositeDir;
    private _distAlongDir;
    private _canReachWithCorner;
    private _cornerPoint;
    /** Get the intersection of a line from center to target with the rectangle edge */
    /**
     * 官方 Link.getLinkPointFromPoint 的等价入口：优先用端口内元素的图形几何求交
     * （Shape.getNearestIntersectionPoint 会按 figure 解椭圆/线段），
     * 没有可用图形元素时回退到 actualBounds 矩形求交。
     */
    private _connectionPoint;
    private _getEdgeIntersection;
    private _computeSelfLinkPoints;
    /** 官方 `Link.midPoint`：先 updateRoute 再取中点 */
    get midPoint(): Point;
    findClosestSegment(p: Point): number;
    /** 官方 `Link.path`：主元素是 Shape 时即连线的绘制形状 */
    get path(): GraphObject | null;
    /** 官方 `Link.fromPort` */
    get fromPort(): GraphObject | null;
    /** 官方 `Link.toPort` */
    get toPort(): GraphObject | null;
    get fromPortChanged(): ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null;
    set fromPortChanged(val: ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null);
    get toPortChanged(): ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null;
    set toPortChanged(val: ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null);
    /** 官方 `Link.suspendsRouting`（默认 false） */
    get suspendsRouting(): boolean;
    set suspendsRouting(val: boolean);
    /** 官方 `Link.smoothness`（默认 0.5） */
    get smoothness(): number;
    set smoothness(val: number);
    /** 官方 `Link.defaultFromPoint`（非实数时归一为 Point(NaN,NaN)） */
    get defaultFromPoint(): Point;
    set defaultFromPoint(val: Point);
    /** 官方 `Link.defaultToPoint` */
    get defaultToPoint(): Point;
    set defaultToPoint(val: Point);
    /** 官方 `Link.pointsCount` */
    get pointsCount(): number;
    /** 官方 `Link.getPoint(i)` */
    getPoint(i: number): Point;
    /** 官方 `Link.setPoint(i, p)` */
    setPoint(i: number, p: Point): void;
    /** 官方 `Link.setPointAt(i, x, y)` */
    setPointAt(i: number, x: number, y: number): void;
    /** 官方 `Link.insertPoint(i, p)` */
    insertPoint(i: number, p: Point): void;
    /** 官方 `Link.insertPointAt(i, x, y)` */
    insertPointAt(i: number, x: number, y: number): void;
    /** 官方 `Link.addPoint(p)` */
    addPoint(p: Point): void;
    /** 官方 `Link.addPointAt(x, y)` */
    addPointAt(x: number, y: number): void;
    /** 官方 `Link.removePoint(i)` */
    removePoint(i: number): void;
    /** 官方 `Link.clearPoints()` */
    clearPoints(): void;
    /** 官方 `Link.convertPointsArrayToList`：兼容数字数组 `[x,y,...]` 与对象数组 `[{x,y},...]` */
    convertPointsArrayToList(arr: any[]): List<Point> | null;
    /** 官方 `Link.canRelinkFrom()` */
    canRelinkFrom(): boolean;
    /** 官方 `Link.canRelinkTo()` */
    canRelinkTo(): boolean;
    /** 官方 `Link.getOtherNode(node)` */
    getOtherNode(node?: GraphObject | null): Node | null;
    /** 官方 `Link.getOtherPort(port)` */
    getOtherPort(port?: GraphObject | null): GraphObject | null;
    /** 官方 `Link.computeAdjusting()` */
    computeAdjusting(): EnumValue;
    /** 官方 `Link.computeCurve()`（自链接 + 非正交 → Bezier） */
    computeCurve(): EnumValue;
    /** 官方 `Link.computeCorner()` */
    computeCorner(): number;
    /** 官方 `Link.computeCurviness()`（本项目无 link bundle，只取默认值 16） */
    computeCurviness(): number;
    /** 官方 `Link.hasCurviness()`（无 bundle） */
    hasCurviness(): boolean;
    /** 官方 `Link.computeThickness()` */
    computeThickness(): number;
    /** 官方 `Link.computeSpot(isFrom, port?)` */
    computeSpot(isFrom: boolean, port?: GraphObject | null): Spot;
    /** 官方 `Link.Rl(spot)`：是否为无方向约束的 spot（None 或正中心） */
    private _isCenterSpot;
    /** 官方 `Link.Sg(spot, isFrom)` */
    private _resolveLinkSpot;
    /** 官方 `Link.computeShortLength(isFrom)` */
    computeShortLength(isFrom: boolean): number;
    /** 官方 `Link.computeEndSegmentLength(node, port, spot, isFrom, dir?)` */
    computeEndSegmentLength(node: Node | null, port: GraphObject | null, spot: Spot, isFrom: boolean, dir?: number): number;
    /** 官方 `Link.l4(port, link)`：只查已有 knot，不创建 */
    private _l4;
    /** 官方 `Link.YS(port)`：取（必要时创建）端口 Knot 中本连线的 LinkInfo */
    private _ys;
    /** 官方 `Link.computeOtherPoint(othernode, otherport, otherspot?, from?, result?)` */
    computeOtherPoint(othernode: Node, otherport: GraphObject, otherspot?: Spot, from?: boolean, result?: Point): Point;
    /** 官方 `Link.getLinkPointFromPoint(node, port, focus, p, from, result?)` */
    getLinkPointFromPoint(node: Node | null, port: GraphObject | null, focus: Point, p: Point, from: boolean, result?: Point): Point;
    /** 官方 `Link.getLinkPoint(node, port, spot, from, ortho, othernode, otherport, result?)` */
    getLinkPoint(node: Node | null, port: GraphObject, spot: Spot, from: boolean, ortho: boolean, othernode: Node | null, otherport: GraphObject, result?: Point): Point;
    /** 官方 `Link.getLinkDirection(node, port, linkpoint, spot, from, ortho, othernode, otherport)` */
    getLinkDirection(node: Node | null, port: GraphObject | null, linkpoint: Point, spot: Spot, from: boolean, ortho: boolean, othernode: Node | null, otherport: GraphObject | null): number;
    /** 官方 `Link.h4(...)`（getLinkDirection 内核） */
    private _h4;
    /** 官方 `G.Sx(null, spot.x, spot.y)`：点位 spot → 方向角（含 45/135/225/315 对角方向） */
    private static _spotDirection;
    /** 官方 `Link.computeSpacing()` */
    computeSpacing(): number;
    /** 官方 `Link.findMidLabel()`：没有指定 segmentIndex 的中间标签元素 */
    findMidLabel(): GraphObject | null;
    /** 官方 `Link.arrangeBundledLinks(links, recompute)`（本项目无 bundle，仅按官方语义失效路由） */
    arrangeBundledLinks(links: Link[], recompute: boolean): void;
    /** 官方 `Link.usesSamePort(other)` */
    usesSamePort(other: Link): boolean;
    get firstPickIndex(): number;
    get lastPickIndex(): number;
    /** 官方 `Link.flattenedLengths` */
    get flattenedLengths(): number[];
    /** 官方 `Link.flattenedTotalLength` */
    get flattenedTotalLength(): number;
    /** 官方 `Link.computeMidPoint(result)`（Bezier 分支走中间段 t=0.5，其余走 flattened 长度） */
    computeMidPoint(result: Point): Point;
    /** 官方 `Link.midAngle` */
    get midAngle(): number;
    /** 官方 `Link.computeMidAngle()` */
    computeMidAngle(): number;
    /** 官方 `Transform`（缩放后绕原点旋转）作用于点：`p' = scale * R(angle) * p` */
    private static _xfPt;
    /**
     * 官方 `Link.hE(labelNode, pointsCount, points)`：把 link 标签节点摆到路径上。
     * `PanelLayoutLink.arrange` 收尾、`location` 同步之前逐个调用。
     */
    positionLabelNode(t: any): void;
    /** 官方 `Link.routeBounds` */
    get routeBounds(): Rect;
    /** 官方 `Link.cA()`（混淆名 nT）：按官方分支计算 routeBounds + routeOffset（BS/Lk） */
    private _computeRouteBounds;
    /** 路线点是否全部有限（NaN/±Infinity 时降级走点列并集分支） */
    private static _allPointsFinite;
    /**
     * 官方 `G.Iu(p0,c1,c2,p3, 0.5, rect)`：把三次贝塞尔真实包围盒并入 t。
     * 复用 Geometry._bezierBounds（同一细分算法），经 acc 数组桥接。
     */
    private static _curveBounds;
    /** 官方 `Link.startRoute()` */
    startRoute(): void;
    /** 官方 `Link.commitRoute()`：`ge()`（invalidateGeometry）→ `zS()`（finalize）→ raiseChanged */
    commitRoute(): void;
    /** 官方 `Link.rollbackRoute()` */
    rollbackRoute(): void;
    /** 官方 `Link.zS()`：标记路由有效并刷新派生缓存 */
    private _finalizeRoute;
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
    private _applyBezierCurve;
    /** 官方 `Link.updateRoute()` */
    updateRoute(): void;
    /** 官方：把 link 的几何同步给 `path` 以及所有 isPanelMain 的 Shape 元素 */
    private _syncGeometryToMainShapes;
    /** 官方 `Link.invalidateRoute()`（= `oi()`，本项目无 invalid-route 集合，只做失效标记） */
    invalidateRoute(): void;
    /** 官方 `Link.invalidateGeometry()`（= `ge()`） */
    invalidateGeometry(): void;
    /** 官方 `Link.geometry` */
    get geometry(): Geometry;
    /**
     * 官方 `Link.wc(t, isFrom, ref)`：把几何端点沿首/末线段向内缩短
     * `computeShortLength`（2 点时上限为半段长，多点时上限为整段长）。
     * 官方在 makeGeometry 内对几何做短化（link.points 本身不含短化）。
     * 经官方坐标系（平移到 min、ref=min/0,0）化简后等价于对原始坐标直接缩短。
     */
    private _wcPoint;
    /**
     * 官方 `Link.cT(p, i, flag)`：从下标 i 起跳过与 p 重合、以及沿当前轴共线且单调的点，
     * 返回下一个「拐点」的下标（不会小于 i）。
     */
    private _skipCollinear;
    /** 官方 `Link.zn(fig, dx, dy, from, to, flag)` 的直线部分（跳过 Line 曲线的挖洞分支） */
    private _addLine;
    /**
     * 官方 `Link.f3(fig, dx, dy, from, corner, after, out, prev, radius, flag)`：
     * 画 `from→corner` 直线段，再在拐点处朝 `after` 方向做半径 `radius` 的圆角，
     * 并把 `out` 更新为圆角终点（作为下一段的起点）。圆角是「控制点落在拐点」的二次贝塞尔。
     * `from` 与 `out` 是同一个对象（官方即如此）。坐标均为未平移原始坐标，平移在内部施加。
     */
    private _addCornerSegment;
    /** 官方 `Link.makeGeometry()`（本项目无 Transform 矩阵，按点列构造折线/贝塞尔几何） */
    makeGeometry(): Geometry;
    /** 官方 `Link.adjustPoints(start, p1, end, p2)` */
    adjustPoints(start: number, p1: Point, end: number, p2: Point): boolean;
    /** 官方 `Link.f4`（LinkAdjusting.Scale：保持形状的仿射变换） */
    private _adjustScale;
    /** 官方 `Link.u4`（LinkAdjusting.Stretch：端点对齐的拉伸） */
    private _adjustStretch;
    /** 官方 `Link.d4`（LinkAdjusting.End：只改端点；本项目无 positions 网格，跳过占用校验） */
    private _adjustEnd;
    /** 官方 `Link.ZL()`：正交路由是否撞到已占用区域（本项目无 positions 网格，恒不重叠） */
    private _positionsOverlap;
    /** 官方 `Link.computeMidOrthoPosition(fromX, fromY, toX, toY, vertical)` */
    computeMidOrthoPosition(fromX: number, fromY: number, toX: number, toY: number, vertical: boolean): number;
    /**
     * 官方 `Link.addOrthoPoints(startFrom, fromDir, endTo, toDir, fromnode, tonode)`。
     * 逐分支转译自 go-debug.js 778104..784083（含 fA/sA/nA 路由状态与尾部两点追加）。
     */
    addOrthoPoints(startFrom: Point, fromDir: number, endTo: Point, toDir: number, fromnode: Node, tonode: Node): void;
    /** 官方 Link 路由状态字段：fA=toDir 被吸附, sA=fromDir 吸附值, nA=toDir 吸附值 */
    private _fA;
    private _sA;
    private _nA;
    /** 官方 `Link.sA`：addOrthoPoints 吸附后的 from 方向（AvoidsNodesRouter.rV 读取） */
    get sA(): number;
    /** 官方 `Link.nA`：吸附后的 to 方向 */
    get nA(): number;
    /** 官方 `Link.fA`：端点方向是否被节点边缘吸附 */
    get fA(): boolean;
    /** 官方 `Link.invalidateOtherJumpOvers(bounds)`（本项目不做 jump 几何缓存，仅让同批 JumpOver/Gap 失效） */
    invalidateOtherJumpOvers(bounds: Rect): void;
    copy(): Link;
}
