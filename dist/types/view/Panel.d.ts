import { EnumValue } from '../core/EnumValues';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin, MarginLike } from '../core/Margin';
import { Map } from '../core/Map';
import { Iterator } from '../core/Iterable';
import { BrushLike } from '../core/Brush';
import { GraphObject } from './GraphObject';
import { RowColumnDefinition } from './RowColumnDefinition';
/**
 * 官方 `PanelLayoutGraduated` 的单个 mark（determineGraduatedMarks 产出）：
 * pt/angle 在 measure 阶段算好，TextBlock 的 label 额外带 actualBounds/measuredBounds/
 * naturalBounds（measureGraduatedLabels 回填，renderer pE 变换直接消费）。
 */
export interface GradMark {
    pt: Point;
    angle: number;
    text?: string;
    labelAngle?: number;
    lineCount?: number;
    lines?: unknown;
    actualBounds?: Rect;
    measuredBounds?: Rect;
    naturalBounds?: Rect;
}
/**
 * Panel - container that arranges child GraphObjects according to its type.
 */
export declare class Panel extends GraphObject {
    static readonly className: string;
    _elements: GraphObject[];
    _rowDefinitions: RowColumnDefinition[];
    _columnDefinitions: RowColumnDefinition[];
    protected _type: EnumValue;
    private _data;
    private _padding;
    private _defaultAlignment;
    private _defaultStretch;
    private _originX;
    private _originY;
    private _unionRect;
    /** 官方 `PanelLayoutLink.or`：measure 算出的 route-local 并集帧（子元素 z 都相对它） */
    private _linkOrRect;
    /** 官方 `PanelLayoutLink.qf`：measure 时按固定顺序存下的子元素 z 矩形，arrange 按序消费 */
    private _linkQfRects;
    /** 官方 `PanelLayoutGraduated.ns`：measure 顺序的子元素矩形，arrange 按序消费（arrange 末尾置 null） */
    private _gradRects;
    /** 官方 `Panel.Es`：与 `_elements` 逐下标对齐的 mark 列表 */
    private _gradMarks;
    /** 官方 `Panel.Ii`：measureGraduatedLabels 复用的临时 TextBlock（renderer 也用它逐 mark 重测） */
    private _gradTempText;
    /** 与 `_elements` 逐下标对齐的临时 TextBlock：官方 render 前会逐元素 YD(el, Ii) 重灌属性，
     *  单槽 `_gradTempText` 会让多 TextBlock 面板（thermometer 华氏 18px 黑标签 + 12px 红 32 标签）
     *  全部按最后一个元素的样式绘制 —— 这里按元素存槽等价官方逐元素重灌。 */
    private _gradTempTexts;
    private _defaultColumnSeparatorStroke;
    private _defaultColumnSeparatorStrokeWidth;
    private _defaultRowSeparatorStroke;
    private _defaultRowSeparatorStrokeWidth;
    private _defaultColumnSeparatorDashArray;
    private _defaultRowSeparatorDashArray;
    private _isOpposite;
    /** 官方 `Panel` 构造第一个参数可以是 `PanelLayout` 实例（自定义面板布局） */
    private _panelLayout;
    private _panelLayoutState;
    private _defaultSeparatorPadding;
    private _columnSizing;
    private _rowSizing;
    private _isClipping;
    private _isEnabled;
    private _alignmentFocusName;
    private _itemArray;
    private _itemTemplate;
    private _itemTemplateMap;
    private _itemCategoryProperty;
    protected _itemIndex: number;
    private _leftIndex;
    private _topIndex;
    private _gridCellSize;
    private _gridOrigin;
    /** 官方 GridPanelSettings.Cf：lcm(间隔) × gridCellSize，供 Diagram.eC 定位 */
    _gridCf: Size | null;
    /** 官方 GridPanelSettings.Yp：每个元素的同向更大 interval 排除表（pS 判定用） */
    _gridExclusions: number[][] | null;
    private _graduatedMin;
    private _graduatedMax;
    private _graduatedTickUnit;
    private _graduatedTickBase;
    private _viewboxStretch;
    _viewboxScaleX: number;
    _viewboxScaleY: number;
    constructor(type?: EnumValue | string | object | null, init?: Partial<Panel>);
    /** 官方各子类构造参数解析：string/EnumValue → type；其它对象 → init */
    protected static _resolveArgs(type: any, init: any): [any, any];
    private static _resolvePanelTypeStr;
    get type(): EnumValue;
    set type(val: EnumValue);
    get data(): any;
    set data(val: any);
    get padding(): Margin;
    set padding(val: MarginLike);
    get defaultAlignment(): Spot;
    set defaultAlignment(val: Spot);
    get defaultStretch(): EnumValue;
    set defaultStretch(val: EnumValue);
    get defaultColumnSeparatorStroke(): BrushLike;
    set defaultColumnSeparatorStroke(val: BrushLike);
    get defaultColumnSeparatorStrokeWidth(): number;
    set defaultColumnSeparatorStrokeWidth(val: number);
    get defaultRowSeparatorStroke(): BrushLike;
    set defaultRowSeparatorStroke(val: BrushLike);
    get defaultRowSeparatorStrokeWidth(): number;
    set defaultRowSeparatorStrokeWidth(val: number);
    get defaultSeparatorPadding(): Margin;
    set defaultSeparatorPadding(val: MarginLike);
    get columnSizing(): EnumValue;
    set columnSizing(val: EnumValue);
    get rowSizing(): EnumValue;
    set rowSizing(val: EnumValue);
    get isClipping(): boolean;
    set isClipping(val: boolean);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get alignmentFocusName(): string;
    set alignmentFocusName(val: string);
    get itemArray(): any[] | null;
    set itemArray(val: any[] | null);
    get itemTemplate(): Panel | null;
    set itemTemplate(val: Panel | null);
    get itemTemplateMap(): Map<string, Panel>;
    set itemTemplateMap(val: Map<string, Panel>);
    get itemCategoryProperty(): string | Function;
    set itemCategoryProperty(val: string | Function);
    get itemIndex(): number;
    get columnCount(): number;
    get rowCount(): number;
    get leftIndex(): number;
    set leftIndex(val: number);
    get topIndex(): number;
    set topIndex(val: number);
    get gridCellSize(): Size;
    set gridCellSize(val: Size);
    get gridOrigin(): Point;
    set gridOrigin(val: Point);
    /**
     * 官方 PanelLayoutGrid.u3/d3：
     * - u3：按垂直/水平方向求 interval 的 lcm → Cf = Size(lcmV·cellW, lcmH·cellH)
     * - d3：每个元素收集同向且 interval 更大的元素 → Yp（画线时被更大线覆盖的小间隔线跳过）
     */
    _updateGridSettings(): void;
    /** 官方 PanelLayoutGrid.MN：LineV/BarV 为垂直方向（影响宽度周期） */
    static _isVerticalGridFigure(figure: string): boolean;
    /** 官方 G.CT：最大公约数（含小数 interval 的欧几里得算法） */
    static _gridGCD(a: number, b: number): number;
    get graduatedMin(): number;
    set graduatedMin(val: number);
    get graduatedMax(): number;
    set graduatedMax(val: number);
    get graduatedTickUnit(): number;
    set graduatedTickUnit(val: number);
    get graduatedTickBase(): number;
    set graduatedTickBase(val: number);
    get viewboxStretch(): EnumValue;
    set viewboxStretch(val: EnumValue);
    get elements(): Iterator<GraphObject>;
    get elementCount(): number;
    /**
     * 官方 `Panel.Rf`（go-debug.js @578464）：
     * - `background !== null` → 自身 naturalBounds 矩形求交（GraphObject.Rf 路径）；
     * - 否则遍历可见子元素求交，取**离 aim 最近**的候选，且候选须满足
     *   dist²(aim, cand) < |aim − focus|²（官方初值 x = |aim−focus|²——这道闸门
     *   正是官方 processFlow 不会选中 Tank 内 width=5000 溢出面板交点 x≈4870 的原因，
     *   早前无闸门的子元素遍历即因此把 doc 拉爆到 5023）；
     * - 无候选时 result = focus，返回 false；isClipping && Spot 面板时主元素单独
     *   求交作为兜底（官方 `N > x && n.set(M)`）。
     *
     * 本项目调用约定（Link → `port.getNearestIntersectionPoint(focus, aim)`）：
     * p = focus（端口 spot/中心），q = aim（方向点）——与官方参数序 (aim, focus) 相反；
     * 语义映射：初值 result = p(focus)，候选取离 q(aim) 最近且 dist²(q,cand) < |q−p|²。
     */
    getNearestIntersectionPoint(p: Point, q: Point, result: Point): boolean;
    add(...elements: GraphObject[]): Panel;
    /** Propagate the _part reference to a child element and its descendants */
    private _propagatePart;
    /** Recursively set _part on an element and its children */
    private _setPartRecursive;
    remove(element: GraphObject): Panel;
    removeAt(index: number): Panel;
    insertAt(index: number, element: GraphObject): Panel;
    elt(index: number): GraphObject;
    findObject(name: string): GraphObject | null;
    /** 官方 findMainElement：第一个 isPanelMain，否则 elements[0]，空则 null */
    findMainElement(): GraphObject | null;
    /** 官方 `Panel.addRowColumnDefinition(rowOrColumnDef)`：把 def 的设置合并进同序号的行/列定义，返回 this */
    addRowColumnDefinition(def: RowColumnDefinition): this;
    /** 官方 `Panel.copyTemplate(freeze?)`：复制整棵视觉树作为模板，可选冻结其中的绑定 */
    copyTemplate(freeze?: boolean): this;
    get defaultColumnSeparatorDashArray(): number[] | null;
    set defaultColumnSeparatorDashArray(value: number[] | null);
    get defaultRowSeparatorDashArray(): number[] | null;
    set defaultRowSeparatorDashArray(value: number[] | null);
    /** 官方 `Panel.findColumnForLocalX(x)`：Table 面板中局部 x 落在哪一列（未命中返回列数） */
    findColumnForLocalX(x: number): number;
    /** 官方 `Panel.findRowForLocalY(y)`：Table 面板中局部 y 落在哪一行（未命中返回行数） */
    findRowForLocalY(y: number): number;
    /**
     * 官方 `Panel.findInVisualTree(func)`：深度优先遍历视觉树，
     * 返回第一个让 func 返回真值的对象；没有则返回 null。
     */
    findInVisualTree(func: (obj: GraphObject) => any): GraphObject | null;
    /** 官方 `Panel.walkVisualTreeFrom(obj, func)`：func(root, obj) 先于子树被调用 */
    walkVisualTreeFrom(obj: GraphObject, func: (root: GraphObject, obj: GraphObject) => void): void;
    /**
     * 官方 `Panel.freezeBindings()`：收集视觉树里所有 Binding 并冻结，
     * 同时解析 sourceName → 目标对象的关联，使模板的每份拷贝都能按名字找到目标。
     *
     * 本项目 `Binding` 还没有 `sourceName` / `targetId`（阶段 5 补齐），而 `copy()`
     * 已经会把 `_bindings` 深拷贝，因此这里只完成视觉树遍历这一半语义。
     */
    freezeBindings(): this;
    /** 官方 `Panel.graduatedRange` */
    get graduatedRange(): number;
    /** 官方 `Panel.graduatedPointForValue(val, result?)`：Graduated 面板把数值映射成路径上的点 */
    graduatedPointForValue(val: number, result?: Point): Point;
    /** 官方 `Panel.graduatedValueForPoint(pt)`：Graduated 面板把路径上的点反算成数值 */
    graduatedValueForPoint(pt: Point): number;
    /** 官方 `Panel.isOpposite`（官方用位标志，这里用布尔量等价表达） */
    get isOpposite(): boolean;
    set isOpposite(value: boolean);
    /** 官方 `Panel.panelLayoutState`（PanelLayout 的缓存状态，本项目尚未实现 PanelLayout） */
    get panelLayoutState(): any;
    set panelLayoutState(value: any);
    /** 主元素的几何：优先 Shape.geometry，否则按 figure + 尺寸生成 */
    private static _geometryOf;
    findItemPanelForData(data: any): Panel | null;
    getColumnDefinition(index: number): RowColumnDefinition;
    /**
     * 官方 `Panel.addRowDefinition(rowIndex, options): this`：
     * get-or-create 行定义，把 options（Partial<RowColumnDefinition> 或数字高度）合并进去，返回 this（可链式 .add）。
     * 官方实现里 height/width 共用同一存储，跨传也会生效——这里按 isRow 归一化。
     */
    addRowDefinition(index?: number, options?: Partial<RowColumnDefinition> | RowColumnDefinition | number): this;
    /**
     * 官方 `Panel.addColumnDefinition(colIndex, options): this`：
     * get-or-create 列定义，把 options 合并进去，返回 this。
     */
    addColumnDefinition(index?: number, options?: Partial<RowColumnDefinition> | RowColumnDefinition | number): this;
    private _applyRowColumnOptions;
    getRowDefinition(index: number): RowColumnDefinition;
    removeColumnDefinition(index: number, count?: number): Panel;
    removeRowDefinition(index: number, count?: number): Panel;
    rebuildItemElements(): void;
    updateTargetBindings(propname?: string): void;
    copy(): Panel;
    /** Copy Panel-specific properties to another Panel */
    protected _copyPanelPropertiesTo(copy: Panel): void;
    _measure(widthConstraint: number, heightConstraint: number, minW?: number, minH?: number): void;
    /** 就地并入 union */
    private _unionInto;
    _arrange(bounds: Rect): void;
    /**
     * Find the main element and separate others.
     * The main element is the first visible element with isPanelMain=true,
     * or the first visible element if none has isPanelMain.
     */
    private _findMainAndOthers;
    /** 官方 kN：主 Shape 的 spot1（Shape.spot1 → geometry.spot1 → TopLeft） */
    private _panelSpot1;
    /** 官方 PN：主 Shape 的 spot2 → BottomRight 兜底 */
    private _panelSpot2;
    /** 官方 PanelLayoutAuto.measure */
    private _measureAuto;
    /** 官方 PanelLayoutAuto.arrange */
    private _arrangeAuto;
    private _measureVertical;
    private _arrangeVertical;
    private _measureHorizontal;
    private _arrangeHorizontal;
    /** 官方 PanelLayoutSpot.measure（两遍） */
    private _measureSpot;
    /** 官方 PanelLayoutSpot.arrange */
    private _arrangeSpot;
    private _isRowColPanel;
    private _measureTable;
    private _arrangeTable;
    /** 官方 PanelLayoutPosition.measure：union 隐含 (0,0)（初始 union 为空点） */
    private _measurePosition;
    /** 官方 PanelLayoutPosition.arrange：pos - (union - pad) + margin */
    private _arrangePosition;
    private _measureViewbox;
    private _arrangeViewbox;
    private _measureGraduated;
    /** 官方 determineGraduatedMarks(t,e)：沿主 Shape 路径为每个元素生成 mark 列表 */
    private _determineGraduatedMarks;
    /** 官方 fE(t)：每个元素「同构造器、interval 更大」的其它元素 interval 列表 */
    private _graduatedLargerIntervals;
    /** 官方 uE(t,e,i)：与更大 interval 刻度重合则跳过本 mark */
    private _gradUnitExcluded;
    /**
     * 官方 dE(t,e,i,s,n)：段接缝处的角度平滑（V 接近 0.5/0/1 时与邻段角度混合，
     * 闭合图形首尾互借）。
     */
    private _gradDE;
    /** 官方 measureGraduatedTicks：每个 mark 旋转 4 角点求包围盒，push ns + union 面板 */
    private _measureGraduatedTicks;
    /** 官方 measureGraduatedLabels：逐 mark 测量文本并算 actualBounds L；返回本元素的临时 TextBlock */
    private _measureGraduatedLabels;
    private _arrangeGraduated;
    /** 官方 segmentOrientation → 数值分支码（21..28） */
    private static _orientCode;
    /** 官方 Link.computeAngle(orientation, angle)（按分支码） */
    private static _computeOrientAngle;
    /** 把点绕 (cx,cy) 旋转 deg 度 */
    private static _rotateAbout;
    /** 取 link 里「画线」的主图元：优先 isPanelMain，否则第一个同时有 fill/stroke 的 Shape */
    private _findLinkMainElement;
    /**
     * 官方 `PanelLayoutLink.measure(t, i, e, s, n, o, r)`（go-debug.js 全文解码）。
     *
     * 帧约定（已用官方探针数值验证）：
     * - `or`：从 routeRect(0,0,w,h) 起，依次并入 path、各主 Shape、各子元素的 z，
     *   最终 `union` 只取尺寸（x,y 归 0），link.position = routeBounds 原点 + or.origin。
     * - `qf[i]`：与「可见元素顺序（path 单独在最前）」一一对应的 z 矩形（route-local），
     *   arrange 时按同一顺序消费，child.actualBounds = z − or.origin。
     * - 子元素锚点三分支：segmentIndex 为 NaN → 几何分数点；越界（含默认 -Infinity）→
     *   路线中点；否则 → 点列线段插值。锚点均为 route-local（doc − routeBounds 原点）。
     */
    private _measureLink;
    /** 官方 `PanelLayoutLink.measureLinkPath(t, w, h, s)`：po(measuredBounds) + p3(naturalBounds) */
    private _measureLinkPath;
    /** 官方 `GraphObject.po(x,y,w,h)`：设 measuredBounds；scale/angle 非恒等时取变换后的轴对齐包围盒 */
    private _linkPo;
    /**
     * 官方 Transform 链（所有 op 都是后乘，点按调用逆序受作用）：
     * `Zs(-N.x,-N.y)` → `lt(sc)` → `Ns(a1,cx,cy)` → `Ns(a2,cx,cy)`
     * 即点先绕 (cx,cy) 旋转（两个同中心旋转可合成 a1+a2），再按 sc 缩放（绕原点），最后平移。
     */
    private static _linkXf;
    /**
     * 官方 `PanelLayoutLink.arrange(t, i, e)`：按 measure 存下的 `qf` 顺序，
     * child.actualBounds = z − or.origin（不再重算锚点/角度）；
     * 收尾把 `t.location` 同步为 position + WD 偏移。
     */
    private _arrangeLink;
    private _getPointAtDistance;
    private _getAngleAtDistance;
    /** 官方 `Panel.xL(p, navig, pred)`：找点选命中的最上层对象。 */
    _findObjectAtDoc(p: Point): GraphObject | null;
    /** 官方 `Panel.bL(p, navig, pred, coll)`：收集点选命中的全部对象。 */
    _collectObjectsAtDoc(p: Point, add: (o: GraphObject) => void): void;
    /** 官方 `Panel.m0(r, navig, pred, partialInclusion, coll)`：收集与矩形包含/相交的对象。 */
    _collectObjectsInDoc(r: Rect, add: (o: GraphObject) => void, partial: boolean): void;
    /** 官方 `Panel.SL(pt1, pt2, navig, pred, partialInclusion, coll)`：收集距离圆命中的对象。 */
    _collectObjectsNearDoc(p: Point, dist: number, add: (o: GraphObject) => void, partial: boolean): void;
    /**
     * 圆 (p, dist) 与轴对齐矩形 r 的关系：
     * 0 = 无交集，1 = 相交（但未包含），2 = 圆完全包含矩形。
     * 对应官方 `SL` 里的 `f`（相交）/ `u`（包含）判定。
     */
    private static _circleRectRelation;
    /** 官方：alignment → defaultAlignment，仍默认则 Center */
    private _resolveAlignment;
    /** 官方：alignmentFocus 默认 → 回退为该元素的 alignment（focus 落在 alignment 同一边） */
    private _resolveAlignmentFocus;
    private _focusNameTarget;
    /**
     * 官方 PanelLayoutVertical/Horizontal.arrange 里算元素宽度用的是
     *   `g = Math.max(union.width - 元素左右 margin - 面板右 padding, 0)`
     * 那个 `Math.max(…, 0)` 不能省：内容区比元素的 margin 还窄时 available 会是负数，
     * 直接喂给 `new Rect()` 会抛 `Invalid arguments to Rect constructor`
     * （实测 spreadsheet `4, 4, -8, 12`、regrouping `0, 0, -18.52, 81.05`）。
     */
    private _resolveStretchWidth;
    private _resolveStretchHeight;
    /** Compute the uniform scale factor for an element */
    private _resolveUniformScale;
    private _ensureColumnDefinition;
    private _ensureRowDefinition;
    private _findItemTemplate;
    _handleObjectPropertyChanged(obj: GraphObject, propname: string, value?: any): void;
    static Auto: EnumValue;
    static Vertical: EnumValue;
    static Horizontal: EnumValue;
    static Spot: EnumValue;
    static Table: EnumValue;
    static Position: EnumValue;
    static Grid: EnumValue;
    static Viewbox: EnumValue;
    static Graduated: EnumValue;
    static Link: EnumValue;
    static TableColumn: EnumValue;
    static TableRow: EnumValue;
    /** 官方 PanelLayout 的注册表（官方是 `PanelLayout.In` / `PanelLayout.is`） */
    private static _panelLayouts;
    /** 官方 `Panel.definePanelLayout(name, func)` */
    static definePanelLayout(name: string, func: Function): void;
    /** 官方 `Panel.isLayoutDefined(name)` */
    static isLayoutDefined(name: string): boolean;
}
