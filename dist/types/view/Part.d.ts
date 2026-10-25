import { Panel } from './Panel';
import { GraphObject } from './GraphObject';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Map } from '../core/Map';
import { Iterator } from '../core/Iterable';
/**
 * Part - base class for top-level visual elements (Node, Link, Adornment).
 * Extends Panel with location, selection, shadow, and adornment support.
 */
export declare class Part extends Panel {
    static readonly className: string;
    static readonly LayoutNone: number;
    static readonly LayoutAdded: number;
    static readonly LayoutRemoved: number;
    static readonly LayoutShown: number;
    static readonly LayoutHidden: number;
    static readonly LayoutNodeSized: number;
    static readonly LayoutGroupLayout: number;
    static readonly LayoutNodeReplaced: number;
    static readonly LayoutStandard: number;
    static readonly LayoutAll: number;
    protected _diagram: any;
    /** 所属 Layer（官方 PartSettings.Ll），由 Layer.add/remove 维护 */
    protected _layer: any;
    protected _location: Point;
    protected _locationSpot: Spot;
    protected _locationObjectName: string;
    protected _movable: boolean;
    protected _copyable: boolean;
    protected _deletable: boolean;
    protected _selectable: boolean;
    protected _isSelected: boolean;
    protected _isHighlighted: boolean;
    protected _isLayoutPositioned: boolean;
    private _isInDocumentBounds;
    protected _isShadowed: boolean;
    protected _shadowOffset: Point;
    private _shadowColor;
    private _shadowBlur;
    private _layerName;
    private _zOrder;
    private _canStart;
    private _dragComputation;
    protected _selectionAdorned: boolean;
    private _selectionAdornmentTemplate;
    private _adornments;
    private _category;
    protected _itemIndex: number;
    protected _containingGroup: any;
    private _groupable;
    private _isAnimated;
    private _textEditable;
    private _reshapable;
    private _resizable;
    private _rotatable;
    private _text;
    private _layoutConditions;
    private _minLocation;
    private _maxLocation;
    private _rotationSpot;
    private _resizeCellSize;
    private _selectionObjectName;
    private _resizeObjectName;
    private _rotateObjectName;
    private _resizeAdornmentTemplate;
    private _rotateAdornmentTemplate;
    private _locationObject;
    private _selectionObject;
    private _containingGroupChanged;
    private _highlightedChanged;
    private _layerChanged;
    private _selectionChanged;
    private _adornmentsPending;
    constructor(type?: any, init?: any);
    /** 官方 Part.g()：部件级失效只触发重排（measure/arrange/render），**不**失效布局 —— 官方
     * GraphObject.Ef→os 只置测量脏位；布局失效只走 Diagram.Ib（模型/绑定变更，带 isOngoing 护栏）。
     * 早先这里冒泡 `d._layoutInvalid=true`，配合 Diagram._measureArrangeAll 尾部的
     * _invalidateLinkRoutes 形成「布局→路线失效→布局」每帧死循环（gantt 样例 bar y=0 死循环元凶之一）。 */
    _invalidateMeasure(): void;
    get visible(): boolean;
    set visible(val: boolean);
    private _syncGuard;
    /**
     * 官方 Part.po 的旋转枢轴 r：measure 时算出并缓存（angle/scale 均为 1 时为 null）。
     * r 用于：① po 求 measuredBounds 包围盒；② WD 的 Fi 旋转；③ 渲染器旋转枢轴；④ 文档坐标变换。
     */
    protected _rotPivot: Point | null;
    /** 官方 locationObject：`locationObjectName` 指定对象优先；否则 Group/Adornment→placeholder（不可见回退 this） */
    private _resolveLocationObject;
    /**
     * 官方 Part.op 的 r：
     * - locationObject !== this：r = locationSpot × lo.naturalBounds（含 nb.x/y），
     *   逐级减去 lo 及其祖先面板（至 part 为止）的 measuredBounds 原点（官方 lo.Fi.Pt/a.Fi.Pt 略过——
     *   locationObject 自身带 scale/angle 的场景极罕见且 Fi 依赖其自身 r）。
     * - locationObject === this：r = locationSpot × (0,0,nb.w,nb.h)（官方 setSpot(po 入参)）。
     */
    private _computeRotPivot;
    /**
     * 官方 GraphObject.po 的 Part 覆写：Fi = scale(原点) → 绕 r 旋转（官方 Ns：M = S·T(r)·R·T(−r)，
     * 即 p' = sc·(r + R(p−r))）；measuredBounds = km(Fi,(0,0,nb.w,nb.h)) 的轴对齐包围盒
     * （mb.x/y = 官方 (ax,ay)）。naturalBounds 不受影响。
     */
    protected _applyMeasureTransform(): void;
    /** 官方 WD/op：location 点相对文档的偏移（官方 Part.WD(t) 的等价实现） */
    private _locationOffset;
    get location(): Point;
    set location(val: Point);
    /** 官方 Part.position（GraphObject.position 的 Part 覆盖：与 location 按 locationSpot 同步） */
    get position(): Point;
    set position(val: Point);
    /**
     * 官方 bF（location 驱动）：arrange 后 locationSpot 偏移变化时，用 location 重新推导 position。
     */
    syncPositionFromLocation(): void;
    /**
     * 从 this 到后代 target 的面板局部偏移累加（基于 actualBounds 局部坐标链）。
     */
    localOffsetTo(target: GraphObject): Point | null;
    get locationSpot(): Spot;
    set locationSpot(val: Spot);
    get locationObjectName(): string;
    set locationObjectName(val: string);
    get movable(): boolean;
    set movable(val: boolean);
    get copyable(): boolean;
    set copyable(val: boolean);
    get deletable(): boolean;
    set deletable(val: boolean);
    get selectable(): boolean;
    set selectable(val: boolean);
    get selectionAdorned(): boolean;
    set selectionAdorned(val: boolean);
    get selectionAdornmentTemplate(): any;
    set selectionAdornmentTemplate(val: any);
    get isSelected(): boolean;
    set isSelected(val: boolean);
    get isHighlighted(): boolean;
    set isHighlighted(val: boolean);
    get isLayoutPositioned(): boolean;
    set isLayoutPositioned(val: boolean);
    get isInDocumentBounds(): boolean;
    set isInDocumentBounds(val: boolean);
    get isShadowed(): boolean;
    set isShadowed(val: boolean);
    get shadowOffset(): Point;
    set shadowOffset(val: Point);
    get shadowColor(): string;
    set shadowColor(val: string);
    get shadowBlur(): number;
    set shadowBlur(val: number);
    get layerName(): string;
    set layerName(val: string);
    /**
     * 官方 `Part.layer`（只读，返回本 Part 所属 Layer）。
     * 必须覆盖 `GraphObject.layer`（后者为 `this.part.layer`），
     * 否则 Part 自身 `_part === this` 时会无限递归。
     * 由 `Layer.add/remove` 维护。
     */
    get layer(): any;
    get zOrder(): number;
    set zOrder(val: number);
    get canStart(): boolean;
    set canStart(val: boolean);
    get dragComputation(): ((part: Part, newLoc: Point, snappedLoc: Point) => Point) | null;
    set dragComputation(val: ((part: Part, newLoc: Point, snappedLoc: Point) => Point) | null);
    get adornments(): Map<string, any>;
    set adornments(val: Map<string, any>);
    get category(): string;
    set category(val: string);
    get itemIndex(): number;
    set itemIndex(val: number);
    /**
     * 官方 `Part.diagram` 直读本部件的 diagram 字段。GraphObject.diagram 走
     * `this.part` 链——Adornment 等 Part 自身 `_panel` 为 null 时 part 解析为 null，
     * 会把 `_diagram` 明明有值的装饰读成 null，导致 removeAdornment 跳过
     * `diagram.remove` → 装饰永久残留在 Adornment 层（选择框不消失）。
     */
    get diagram(): any;
    get isTopLevel(): boolean;
    /** 官方 Part.canLayout */
    canLayout(): boolean;
    get isVirtual(): boolean;
    get containingGroup(): any;
    set containingGroup(val: any);
    /**
     * 官方 Part.set containingGroup 尾部的连线传播：
     * - 本 Part 是 Group（有 memberParts）：官方 `Part.Lh(n,this,!0,0,!0)` 收集本组
     *   及其全部成员（递归下钻嵌套组），对其中每个 Node 的所有连线调用 `Link.dg`；
     * - 本 Part 是 Node（含 Group 自身）：自身 linksConnected 与 labeledLink 也重算。
     * 用鸭子类型代替 instanceof，避免 Part ↔ Node 的循环 import。
     */
    private _propagateContainingGroupToLinks;
    get adornmentStream(): Iterator<any>;
    /** Find a named GraphObject within this Part */
    findObject(name: string): GraphObject | null;
    /**
     * 官方 `Part.Df(change, propertyname, obj, oldval, newval, oldparam?, newparam?)`：
     * GraphObject 属性变更经所属 Part 转发到 Diagram 的管道。
     * Part 自身的 `_part` 指向自己，故此方法必须独立于 `GraphObject.raiseChangedEvent`，
     * 否则会自调用死循环。
     */
    raiseChangedEventFromObject(change: any, propertyname: string, obj: any, oldval: any, newval: any, oldparam?: any, newparam?: any): void;
    /** Ensure the bounds of this Part are computed (official: measure + updateBounds + sync position/location) */
    ensureBounds(): void;
    /** 官方 `Part.getDocumentBounds(rect?)`：返回文档坐标包围盒（给出 rect 时写入并返回该 rect） */
    getDocumentBounds(rect?: Rect): Rect;
    /** 官方 Part.move(newLoc, isLocation?)：isLocation=true 移动 location，否则移动 position */
    move(newLoc: Point, isLocation?: boolean): void;
    /** 官方 Part.moveTo(x, y, isLocation?) */
    moveTo(x: number, y: number, isLocation?: boolean): void;
    /**
     * 官方 `Part.addAdornment(category, ad)`：
     * 同类别旧装饰先从图中移除；同步 `ad.category`；把装饰加入 diagram；
     * 最后用 `adornedObject.findBindingPanel().data` 作为装饰的数据上下文
     * （选择装饰里所有 data 绑定都靠这一句拿到节点数据）。
     */
    addAdornment(category: string, ad: any): void;
    /** 官方 `Part.removeAdornment(category)`：从 diagram 摘除并清空 data */
    removeAdornment(category: string): void;
    /** Get the adornment for the given category */
    getAdornment(category: string): any | null;
    /** 官方 `Part.clearAdornments()`：逐个 removeAdornment（从图中摘除），不是只清 map */
    clearAdornments(): void;
    /**
     * 官方默认选择装饰（diagram.nodeSelectionAdornmentTemplate 缺省时的兜底）：
     * `Adornment(Auto, Shape(fill:null, stroke:dodgerblue, strokeWidth:2, isPanelMain, stretch:Fill), Placeholder())。
     * 只负责造模板，**不设 adornedObject / 不预设 bounds** —— 由 `_updateSelectionAdornment` 统一挂载，
     * 尺寸与位置由 Placeholder.measure 按被装饰对象推出。
     */
    _createSelectionAdornment(): any;
    /** 官方 Part.canCopy() */
    canCopy(): boolean;
    /** 官方 Part.canDelete() */
    canDelete(): boolean;
    /** 官方 Part.canEdit() */
    canEdit(): boolean;
    /** 官方 Part.canGroup() */
    canGroup(): boolean;
    /** 官方 Part.canMove() */
    canMove(): boolean;
    /** 官方 Part.canReshape() */
    canReshape(): boolean;
    /** 官方 Part.canResize() */
    canResize(): boolean;
    /** 官方 Part.canRotate() */
    canRotate(): boolean;
    /** 官方 Part.canSelect() */
    canSelect(): boolean;
    get groupable(): boolean;
    set groupable(val: boolean);
    get textEditable(): boolean;
    set textEditable(val: boolean);
    get isAnimated(): boolean;
    set isAnimated(val: boolean);
    get reshapable(): boolean;
    set reshapable(val: boolean);
    get resizable(): boolean;
    set resizable(val: boolean);
    get rotatable(): boolean;
    set rotatable(val: boolean);
    get text(): string;
    set text(val: string);
    /** 官方 `Part.key`：只读，取 model 里对应数据的 key */
    get key(): unknown;
    /** 官方 `Part.self` 只读侧 */
    get self(): Part;
    /**
     * 官方 `Part.self` 的 setter 走 `Part.HN(newData, oldCat, newCat)`（按新 category 从模板
     * 整体重建部件）。本项目没有模板重建管线，这里退化为「把 value 的可观察状态同步进本部件」。
     */
    set self(value: Part);
    get containingGroupChanged(): ((part: Part, oldGroup: unknown, newGroup: unknown) => void) | null;
    set containingGroupChanged(val: ((part: Part, oldGroup: unknown, newGroup: unknown) => void) | null);
    get highlightedChanged(): ((part: Part) => void) | null;
    set highlightedChanged(val: ((part: Part) => void) | null);
    get layerChanged(): ((part: Part, oldLayer: unknown, newLayer: unknown) => void) | null;
    set layerChanged(val: ((part: Part, oldLayer: unknown, newLayer: unknown) => void) | null);
    get selectionChanged(): ((part: Part) => void) | null;
    set selectionChanged(val: ((part: Part) => void) | null);
    get layoutConditions(): number;
    set layoutConditions(val: number);
    /** 官方 `Part.locationObject`（只读，带缓存） */
    get locationObject(): GraphObject;
    get minLocation(): Point;
    set minLocation(val: Point);
    get maxLocation(): Point;
    set maxLocation(val: Point);
    get selectionObjectName(): string;
    set selectionObjectName(val: string);
    /** 官方 `Part.selectionObject`（只读，带缓存） */
    get selectionObject(): GraphObject;
    get resizeObjectName(): string;
    set resizeObjectName(val: string);
    /** 官方 `Part.resizeObject`（只读） */
    get resizeObject(): GraphObject;
    get rotateObjectName(): string;
    set rotateObjectName(val: string);
    /** 官方 `Part.rotateObject`（只读） */
    get rotateObject(): GraphObject;
    get rotationSpot(): Spot;
    set rotationSpot(val: Spot);
    get resizeCellSize(): Size;
    set resizeCellSize(val: Size);
    get resizeAdornmentTemplate(): Part | null;
    set resizeAdornmentTemplate(val: Part | null);
    get rotateAdornmentTemplate(): Part | null;
    set rotateAdornmentTemplate(val: Part | null);
    /** 官方 `Part.findAdornment(category)` */
    findAdornment(category: string): unknown | null;
    /** 官方 `Part.hasPlaceholder()`（Adornment 覆写为 true） */
    hasPlaceholder(): boolean;
    /** 官方 `Part.isVisible()`：还要看图层可见性与所属 Group 是否展开 */
    isVisible(): boolean;
    /** 官方 `Part.findSubGraphLevel()` */
    findSubGraphLevel(): number;
    private static _subGraphLevel;
    /** 官方 `Part.findTopLevelPart()` */
    findTopLevelPart(): Part;
    private static _topLevelPart;
    /** 官方：Node 上的 `labeledLink`（本项目 Phase 4 稍后补该属性，此处鸭子类型取用） */
    private static _labeledLinkOf;
    /** 官方 `Part.isMemberOf(group)` */
    isMemberOf(group: unknown): boolean;
    private static _isMemberOf;
    /**
     * 官方 `Part.findCommonContainingGroup(other)`。
     * 官方用 Part 上的临时标志位（`Mk(true)`/`CF()`）做标记；本项目用临时 Set，等价且不污染部件状态。
     */
    findCommonContainingGroup(other: Part | null): Part | null;
    /** 官方遍历链：Node 优先走 labeledLink，再取 containingGroup */
    private static _chainParent;
    /** 官方 `Part.getRelativePoint(el, spot, result?)` */
    getRelativePoint(el: GraphObject, spot: Spot, result?: Point): Point;
    /**
     * 官方 `Part.invalidateLayout(condition?)`（go.d.ts:22860 附近）。
     * 条件与 `layoutConditions` 位与为 0 时直接忽略。
     */
    invalidateLayout(condition?: number): void;
    private _canInvalidateLayout;
    /** 官方 `Part.invalidateAdornments()`：标记装饰失效并立刻按需重建 */
    invalidateAdornments(): void;
    /** 官方 `Part.updateAdornments()` = `YE`（选择装饰）+ 各装饰 invalidateMeasure + updateTargetBindings */
    updateAdornments(): void;
    /** 官方 `Part.YE(diagram)`：按 selectionAdornmentTemplate / diagram 默认模板创建 "Selection" 装饰 */
    private _updateSelectionAdornment;
    /** 官方 `Part.updateRelationshipsFromData()` */
    updateRelationshipsFromData(): void;
    copy(): Part;
    /** Copy Part-specific properties to another Part */
    protected _copyPartPropertiesTo(copy: Part): void;
    /** Update target bindings for a given property, or all if no property name given */
    updateTargetBindings(propname?: string): void;
}
