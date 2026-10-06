import { EnumValue } from '../core/EnumValues';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin, MarginLike } from '../core/Margin';
import { BrushLike } from '../core/Brush';
import { Binding } from '../model/Binding';
import { RowColumnDefinition } from './RowColumnDefinition';
import type { Panel } from './Panel';
import type { Part } from './Part';
type Diagram = any;
type Layer = any;
/**
 * GraphObject - base class for ALL visual objects in the GoJS diagramming library.
 * This includes shapes, text blocks, pictures, panels, and parts.
 */
export declare class GraphObject {
    static readonly className: string;
    protected _panel: Panel | null;
    protected _part: Part | null;
    protected _actualBounds: Rect;
    protected _measuredBounds: Rect;
    protected _naturalBounds: Rect;
    protected _bindings: Binding[];
    protected _isInDocument: boolean;
    protected _isPlaceholder: boolean;
    protected _className: string;
    protected _desiredSize: Size;
    protected _minSize: Size;
    protected _maxSize: Size;
    protected _margin: Margin;
    private _alignment;
    private _alignmentFocus;
    private _angle;
    private _opacity;
    protected _visible: boolean;
    private _stretch;
    private _cursor;
    private _name;
    private _column;
    private _columnSpan;
    private _row;
    private _rowSpan;
    private _scale;
    private _interval;
    private _graduatedStart;
    private _graduatedEnd;
    private _graduatedSkip;
    private _graduatedFunction;
    private _flip;
    private _shadowVisible;
    private _background;
    private _pickable;
    private _isActionable;
    private _isPanelMain;
    private _portId;
    private _contextMenu;
    private _toolTip;
    private _fromLinkable;
    private _toLinkable;
    private _fromLinkableDuplicates;
    private _toLinkableDuplicates;
    private _fromLinkableSelfNode;
    private _toLinkableSelfNode;
    private _fromMaxLinks;
    private _toMaxLinks;
    private _fromSpot;
    private _toSpot;
    private _fromEndSegmentLength;
    private _toEndSegmentLength;
    private _fromShortLength;
    private _toShortLength;
    /** 官方 `port.Vd`：side-spot 连线端口 Knot 缓存（见 LinkKnot.ts） */
    private _knot;
    private _segmentIndex;
    private _segmentFraction;
    private _segmentOffset;
    private _segmentOrientation;
    protected _position: Point;
    private _click;
    private _doubleClick;
    private _contextClick;
    private _mouseEnter;
    private _mouseLeave;
    private _mouseOver;
    private _mouseHover;
    private _mouseHold;
    private _mouseDragEnter;
    private _mouseDragLeave;
    private _mouseDrop;
    private _actionDown;
    private _actionMove;
    private _actionUp;
    private _actionCancel;
    private _enabledChanged;
    constructor();
    /** Convenience property for desiredSize.width */
    get width(): number;
    set width(val: number);
    /** Convenience property for desiredSize.height */
    get height(): number;
    set height(val: number);
    get desiredSize(): Size;
    set desiredSize(val: Size);
    /**
     * 官方 `Shape.fi()` 钩子：desiredSize 变更时清掉缩放几何缓存
     * （官方 width/height/desiredSize setter 里 `this instanceof Shape && this.fi()`）。
     * 基类 no-op；Shape 覆写为清 `_scaledGeometry`。
     */
    _invalidateGeometryCache(): void;
    get minSize(): Size;
    set minSize(val: Size);
    get maxSize(): Size;
    set maxSize(val: Size);
    get margin(): Margin;
    set margin(val: MarginLike);
    get alignment(): Spot;
    set alignment(val: Spot);
    get alignmentFocus(): Spot;
    set alignmentFocus(val: Spot);
    get angle(): number;
    set angle(val: number);
    get opacity(): number;
    set opacity(val: number);
    get visible(): boolean;
    set visible(val: boolean);
    get stretch(): EnumValue;
    set stretch(val: EnumValue);
    get cursor(): string;
    set cursor(val: string);
    get name(): string;
    set name(val: string);
    get position(): Point;
    set position(val: Point);
    get column(): number;
    set column(val: number);
    get columnSpan(): number;
    set columnSpan(val: number);
    get row(): number;
    set row(val: number);
    get rowSpan(): number;
    set rowSpan(val: number);
    get interval(): number;
    set interval(val: number);
    /**
     * 官方 GraphObject 的 graduated* 系列（Graduated 面板子元素用）：
     * graduatedStart/graduatedEnd 限定该元素参与的范围（0~1 比例），
     * graduatedSkip 决定某个刻度值是否跳过，graduatedFunction 自定义刻度文字。
     */
    get graduatedStart(): number;
    set graduatedStart(val: number);
    get graduatedEnd(): number;
    set graduatedEnd(val: number);
    get graduatedSkip(): ((val: number, obj: GraphObject) => boolean) | null;
    set graduatedSkip(val: ((val: number, obj: GraphObject) => boolean) | null);
    get graduatedFunction(): ((val: number, obj: GraphObject) => any) | null;
    set graduatedFunction(val: ((val: number, obj: GraphObject) => any) | null);
    get scale(): number;
    set scale(val: number);
    get flip(): EnumValue;
    set flip(val: EnumValue);
    get shadowVisible(): boolean | null;
    set shadowVisible(val: boolean | null);
    get background(): BrushLike;
    set background(val: BrushLike);
    get pickable(): boolean;
    set pickable(val: boolean);
    get isActionable(): boolean;
    set isActionable(val: boolean);
    get isPanelMain(): boolean;
    set isPanelMain(val: boolean);
    get portId(): string | null;
    set portId(val: string | null);
    /**
     * 官方 `Node.ne(port)`：清空端口上的 side-spot knot 缓存。
     * 由 Node.invalidateConnectedLinks / portId 变更 / link 端点变更触发。
     */
    invalidateConnectedLinksCache(): void;
    get contextMenu(): any;
    set contextMenu(val: any);
    get toolTip(): any;
    set toolTip(val: any);
    get fromLinkable(): boolean;
    set fromLinkable(val: boolean);
    get toLinkable(): boolean;
    set toLinkable(val: boolean);
    get fromLinkableDuplicates(): boolean;
    set fromLinkableDuplicates(val: boolean);
    get toLinkableDuplicates(): boolean;
    set toLinkableDuplicates(val: boolean);
    get fromLinkableSelfNode(): boolean;
    set fromLinkableSelfNode(val: boolean);
    get toLinkableSelfNode(): boolean;
    set toLinkableSelfNode(val: boolean);
    get fromMaxLinks(): number;
    set fromMaxLinks(val: number);
    get toMaxLinks(): number;
    set toMaxLinks(val: number);
    get fromSpot(): Spot;
    set fromSpot(val: Spot);
    get toSpot(): Spot;
    set toSpot(val: Spot);
    get fromEndSegmentLength(): number;
    set fromEndSegmentLength(val: number);
    get toEndSegmentLength(): number;
    set toEndSegmentLength(val: number);
    get fromShortLength(): number;
    set fromShortLength(val: number);
    get toShortLength(): number;
    set toShortLength(val: number);
    get segmentIndex(): number;
    set segmentIndex(val: number);
    get segmentFraction(): number;
    set segmentFraction(val: number);
    get segmentOffset(): Point;
    set segmentOffset(val: Point);
    get segmentOrientation(): EnumValue;
    set segmentOrientation(val: EnumValue);
    get actualBounds(): Rect;
    get measuredBounds(): Rect;
    get naturalBounds(): Rect;
    get panel(): Panel | null;
    get part(): Part | null;
    get diagram(): Diagram | null;
    get layer(): Layer | null;
    get click(): ((e: any, obj: GraphObject) => void) | null;
    set click(val: ((e: any, obj: GraphObject) => void) | null);
    get doubleClick(): ((e: any, obj: GraphObject) => void) | null;
    set doubleClick(val: ((e: any, obj: GraphObject) => void) | null);
    get contextClick(): ((e: any, obj: GraphObject) => void) | null;
    set contextClick(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseEnter(): ((e: any, obj: GraphObject) => void) | null;
    set mouseEnter(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseLeave(): ((e: any, obj: GraphObject) => void) | null;
    set mouseLeave(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseOver(): ((e: any, obj: GraphObject) => void) | null;
    set mouseOver(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseHover(): ((e: any, obj: GraphObject) => void) | null;
    set mouseHover(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseHold(): ((e: any, obj: GraphObject) => void) | null;
    set mouseHold(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseDragEnter(): ((e: any, obj: GraphObject) => void) | null;
    set mouseDragEnter(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseDragLeave(): ((e: any, obj: GraphObject) => void) | null;
    set mouseDragLeave(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseDrop(): ((e: any, obj: GraphObject) => void) | null;
    set mouseDrop(val: ((e: any, obj: GraphObject) => void) | null);
    get actionDown(): ((e: any, obj: GraphObject) => void) | null;
    set actionDown(val: ((e: any, obj: GraphObject) => void) | null);
    get actionMove(): ((e: any, obj: GraphObject) => void) | null;
    set actionMove(val: ((e: any, obj: GraphObject) => void) | null);
    get actionUp(): ((e: any, obj: GraphObject) => void) | null;
    set actionUp(val: ((e: any, obj: GraphObject) => void) | null);
    get actionCancel(): ((e: any, obj: GraphObject) => void) | null;
    set actionCancel(val: ((e: any, obj: GraphObject) => void) | null);
    get enabledChanged(): ((obj: GraphObject) => void) | null;
    set enabledChanged(val: ((obj: GraphObject) => void) | null);
    /** Add a data binding to this object */
    bind(bindingOrTargetProp: Binding | string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any): this;
    bindObject(targetProperty: string, sourceProperty: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any, sourceObject?: string): this;
    /** 官方 `GraphObject.bindTwoWay(targetprop, sourceprop?, conv?, backconv?)`：第 3 参为 source→target 转换 */
    bindTwoWay(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any): this;
    /**
     * 官方 GraphObject.theme(targetprop, sourceprop?, themesource?, conv?, themeconv?)。
     * 官方第 3 参是 themeSource、第 4 参才是 converter —— 旧签名把 converter 放在第 3 位，
     * flowchart 的 .themeObject('stroke','isSelected',null,fn) 因此把 fn 当成了 sourceName，
     * 描边永远停在默认黑色。
     */
    theme(targetProperty: string, sourceProperty?: string, themeSource?: string | null, converter?: (value: any, targetObject: any, model: any) => any, themeConverter?: (value: any, targetObject: any, model?: any) => any): this;
    /** 官方 themeData：ofData —— 源是 part.data（旧版误设成 modelData） */
    themeData(targetProperty: string, sourceProperty?: string, themeSource?: string | null, converter?: (value: any, targetObject: any, model: any) => any, themeConverter?: (value: any, targetObject: any, model?: any) => any): this;
    themeModel(targetProperty: string, sourceProperty?: string, themeSource?: string | null, converter?: (value: any, targetObject: any, model: any) => any, themeConverter?: (value: any, targetObject: any, model?: any) => any): this;
    /** 官方 themeObject：源是“绑定面板”（sourceName 默认 ''）上的属性 */
    themeObject(targetProperty: string, sourceProperty?: string, themeSource?: string | null, converter?: (value: any, targetObject: any, model: any) => any, themeConverter?: (value: any, targetObject: any, model?: any) => any, sourceName?: string): this;
    bindModel(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this;
    setProperties(props: Record<string, any>): this;
    /** Batch set properties */
    set(props: Partial<GraphObject>): this;
    /** Virtual copy - creates a shallow copy of this GraphObject */
    copy(): GraphObject;
    /** 官方未文档化的 SVG 过滤器名（官方注释：May not work in Safari） */
    private _filter;
    /** 官方未文档化的行列跨度分配回调 */
    private _spanAllocation;
    /** 官方运行时存在的 svg 访问器（本项目为 Canvas 渲染，默认 null） */
    private _svg;
    /** 官方 `GraphObject.ao`：`addCopyProperty()` 登记的、clone 时额外复制的属性名 */
    private _copyProperties;
    /**
     * 官方 `GraphObject.toString()` = `"U.Jn(构造器) # hashId"`，
     * 其中 `U.Jn(constructor)` 就是该类的 `static className`。
     * Panel / Shape / TextBlock / Picture / Part / Adornment 等子类按官方各自覆盖。
     */
    toString(): string;
    /**
     * 官方 `GraphObject.clone()`：`new this.constructor()` → `cloneProtected` → 复制 `addCopyProperty` 登记项。
     * 官方所有子类的 `copy()` 都等于 `clone()`（本项目子类暂时保留各自的 `copy()` 覆盖）。
     */
    clone(): this;
    /**
     * 官方 `GraphObject.cloneProtected(copy)`（d.ts 标为 protected）。
     * 官方在 Panel / Shape / TextBlock / Picture / Part / Node / Link / Group / Placeholder / 各 Layout
     * 上都有覆盖；本项目基类实现等价于把 GraphObject 层状态写入 copy。
     */
    protected cloneProtected(copy: this): void;
    /** 官方 `GraphObject.MD(copy)`：把 `addCopyProperty` 登记的属性逐个拷过去 */
    private _applyExtraCopyProperties;
    /** 官方 `GraphObject.addCopyProperty(propName)`：登记 clone 时需要额外复制的属性名（重复登记被忽略） */
    addCopyProperty(propName: string): void;
    /** 官方 `GraphObject.raiseChanged(propertyName, oldValue, newValue)` */
    raiseChanged(propertyname: string, oldval: any, newval: any): void;
    /**
     * 官方 `GraphObject.raiseChangedEvent(change, propertyname, obj, oldval, newval, oldparam?, newparam?)`。
     * 官方实现：先交给 `part.Df(...)`（Part 层处理 elements 插删、再转发 `diagram.raiseChangedEvent`），
     * 无 Part 时直接转发给 `diagram.raiseChangedEvent`。
     * 注意：Part 自身的 `_part` 指向自己，因此这里必须走 Part 的专用管道（`raiseChangedEventFromObject`），
     * 不能递归调用 `raiseChangedEvent`，否则属性变更会无限递归（栈溢出）。
     */
    raiseChangedEvent(change: any, propertyname: string, obj: any, oldval: any, newval: any, oldparam?: any, newparam?: any): void;
    /**
     * 官方 `GraphObject.containsPoint(p)`。
     *
     * 偏差：官方靠内部 Transform 矩阵把输入点在「本对象局部坐标」与「所在 Panel 坐标」之间换算；
     * 本项目没有 Transform 矩阵，统一以**文档坐标**计算（与 `Diagram.findObjectAt(docPoint)` 一致）。
     */
    containsPoint(p: Point): boolean;
    /**
     * 官方 `GraphObject.containsRect(r)`：本对象是否包含给定矩形。
     * 偏差同 `containsPoint`：统一按文档坐标计算。
     */
    containsRect(r: Rect): boolean;
    /** 官方 `GraphObject.containedInRect(r, transform?)`：本对象是否被给定矩形包含 */
    containedInRect(r: Rect, transform?: any): boolean;
    /** 官方 `GraphObject.intersectsRect(r, transform?)`：本对象是否与给定矩形相交 */
    intersectsRect(r: Rect, transform?: any): boolean;
    /**
     * 官方 `GraphObject.getNearestIntersectionPoint(p, q, result)`：
     * 把线段 pq 与本对象边界的**最近交点**写入 result；返回是否找到交点。
     * 官方实现走 `G.Bl`（四条边各做一次线段求交，取离 p 最近的那个），返回值是 boolean。
     * 偏差同 `containsPoint`：统一按文档坐标计算。
     */
    getNearestIntersectionPoint(p: Point, q: Point, result: Point): boolean;
    /**
     * 官方 `G.Bl(x, y, w, h, x1, y1, x2, y2, result)` 的等价实现：
     * 线段 (x1,y1)→(x2,y2) 与矩形四条边的交点里，取离 (x1,y1) 最近的一个写入 result。
     * 找不到交点时 result 置为矩形左上角并返回 false（与官方一致）。
     */
    private static _nearestIntersection;
    /**
     * 官方 `GraphObject.commonArrange(x, y, w, h)`：把本对象排布到给定矩形。
     * 官方实现会先写 actualBounds 再按 desiredSize/stretch 精简；
     * 本项目等价地落到 `_arrange()`（子类按各自 stretch 逻辑覆写）。
     */
    commonArrange(x: number, y: number, w: number, h: number): void;
    /** 官方 `GraphObject.filter`（未文档化的 SVG 过滤器名） */
    get filter(): string;
    set filter(value: string);
    /** 官方 `GraphObject.spanAllocation`（未文档化的行列跨度分配回调） */
    get spanAllocation(): ((a: GraphObject, b: RowColumnDefinition, c: number) => number) | null;
    set spanAllocation(value: ((a: GraphObject, b: RowColumnDefinition, c: number) => number) | null);
    /** 官方 `GraphObject.svg`（本项目为 Canvas 渲染，恒为 null） */
    get svg(): any;
    set svg(value: any);
    /** Apply a function to this object and return it */
    apply(func: (obj: GraphObject, data?: any) => void, data?: any): GraphObject;
    /** 官方 findBindingPanel：从自身（若为 Panel）起向上找带绑定的面板 */
    findBindingPanel(): Panel | null;
    attach(props: Record<string, any>): this;
    /** Get the total angle of this object in document coordinates */
    getDocumentAngle(): number;
    /** Get the bounding rectangle of this object in document coordinates */
    getDocumentBounds(): Rect;
    /** Convert a local point to document coordinates */
    getDocumentPoint(local: Point): Point;
    /** Get the total scale of this object in document coordinates */
    getDocumentScale(): number;
    /** Convert a document point to local coordinates */
    getLocalPoint(p: Point): Point;
    /** Check if this object is contained by the given panel */
    isContainedBy(panel: Panel): boolean;
    /** Check if this object is effectively enabled */
    isEnabledObject(): boolean;
    /** Check if this object is effectively visible */
    isVisibleObject(): boolean;
    /** Trigger a property change notification */
    /** 官方 `GraphObject.trigger(propname, value?): this`：触发动画并返回自身（可链式 .add） */
    trigger(propname: string, value?: any): this;
    /** Invalidate the measurement of this object and its ancestors */
    _invalidateMeasure(): void;
    /** Invalidate the arrangement of this object and its ancestors */
    _invalidateArrange(): void;
    /** Measure this object within the given constraints (官方 yt：可选 minW/minH) */
    _measure(widthConstraint: number, heightConstraint: number, minW?: number, minH?: number): void;
    /** Apply minSize/maxSize/desiredSize constraints to measured bounds */
    protected _applySizeConstraints(): void;
    /**
     * 官方 GraphObject.po：scale（及 angle）作用于 measuredBounds。
     * scale 矩阵 + 绕中心旋转，取轴对齐包围盒；naturalBounds 不受影响。
     */
    protected _applyMeasureTransform(): void;
    /** 官方 GraphObject.ln(forArranging) — 解析有效 stretch */
    _getStretch(forArranging: boolean): EnumValue;
    /**
     * 官方 GraphObject.gp(rowDef, colDef, forArranging)：
     * 元素 stretch 为 Default 时，由所在行/列定义的 stretch + 面板 defaultStretch 推导有效 stretch。
     */
    private _resolveTableChildStretch;
    /** 官方 GraphObject.gp(rowDef, colDef, forArranging)（stretch 已知为 Default） */
    _gpWithDefs(panel: Panel, rowDef: RowColumnDefinition, colDef: RowColumnDefinition, forArranging: boolean): EnumValue;
    /** 官方 GraphObject.ir(stretch, forArranging) — 按 desiredSize 精简 stretch */
    private _refineStretch;
    /** Arrange this object within the given bounds */
    _arrange(bounds: Rect): void;
    /** Copy all properties to another GraphObject (used by copy()) */
    protected _copyPropertiesTo(copy: GraphObject): void;
    static Default: EnumValue;
    static Fill: EnumValue;
    static Horizontal: EnumValue;
    static Vertical: EnumValue;
    static None: EnumValue;
    static Uniform: EnumValue;
    static UniformToFill: EnumValue;
    static FlipVertical: EnumValue;
    static FlipHorizontal: EnumValue;
    static FlipBoth: EnumValue;
    /** Factory method for creating GraphObjects - stub */
    static _classRegistry: Record<string, any>;
    static defineBuilder(name: string, func: Function): void;
    /** 官方 `GraphObject.isBuilderDefined(name)` */
    static isBuilderDefined(name: string): boolean;
    /**
     * 官方 `GraphObject.takeBuilderArgument(args, default?, pred?)`：取出 args[1]。
     * 默认谓词为 `typeof === 'string'`；命中则从数组移除并返回，未命中且有默认值返回默认值，否则抛错。
     */
    static takeBuilderArgument(obj: any, defaultVal?: any, pred?: (v: any) => boolean): any;
    /**
     * 官方 `GraphObject.build(type, init?, ...args)`：init 不传给 builder（builder 收 [type, ...args]），
     * 返回后再 setProperties(init)。
     */
    static build(type: any, init?: any, ...args: any[]): any;
    static make(type: any, ...args: any[]): any;
}
export {};
