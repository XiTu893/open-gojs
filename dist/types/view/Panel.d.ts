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
    private _arrangeGraduated;
    /** 取 link 里「画线」的主图元：优先 isPanelMain，否则第一个同时有 fill/stroke 的 Shape */
    private _findLinkMainElement;
    private _measureLink;
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
