import { Model, ObjectData } from '../model/Model';
import { ChangedEvent } from '../model/ChangedEvent';
import { EnumValue } from '../core/EnumValues';
import { GraphObject } from '../view/GraphObject';
import { Part } from '../view/Part';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { PositionArray } from '../core/PositionArray';
import { Layer } from '../view/Layer';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin } from '../core/Margin';
import { List } from '../core/List';
import { Map } from '../core/Map';
import { Set } from '../core/Set';
import { Iterator, Iterable as GojsIterable } from '../core/Iterable';
import { CanvasRenderer } from '../render/CanvasRenderer';
import { ToolManager } from '../tool/ToolManager';
import { CommandHandler } from '../command/CommandHandler';
import { AnimationManager } from '../animation/AnimationManager';
import { InputEvent } from './InputEvent';
import { ThemeManager } from './ThemeManager';
/** 官方 `Diagram.qL(name)`：是否是合法的 Diagram 事件名（大小写不敏感） */
export declare function isDiagramEventName(name: string): boolean;
export declare class Diagram {
    static readonly className: string;
    static readonly version: string;
    static licenseKey: string;
    static img: string;
    static readonly None = 1;
    static readonly Uniform = 2;
    static readonly UniformToFill = 3;
    static readonly CycleAll = 1;
    static readonly CycleNotDirected = 2;
    static readonly CycleNotDirectedFast = 3;
    static readonly CycleNotUndirected = 4;
    static readonly CycleDestinationTree = 5;
    static readonly CycleSourceTree = 6;
    static readonly DocumentScroll = 1;
    static readonly InfiniteScroll = 2;
    static readonly TreeParentCollapsed = 1;
    static readonly AllParentsCollapsed = 2;
    static readonly AnyParentsCollapsed = 3;
    static isUsingDOM(): boolean;
    static setDocument(d: any): void;
    static useDOM(value: boolean): void;
    private _div;
    private _model;
    private _modelChangeListener;
    private _renderer;
    private _toolManager;
    private _commandHandler;
    private _animationManager;
    private _themeManager;
    private _position;
    /** 官方 set position 内部的嵌套夹取重入标志（Jt） */
    private _isClampingPosition;
    private _scale;
    private _minScale;
    private _maxScale;
    private _padding;
    /**
     * 官方 Ht（滚动条槽位宽/高，屏幕 px）。构造 NA() 置 17；首次 jM() 经
     * `setScrollWidth()` 探针量成实测值（本环境 fallback 11）。初始 Sd 必须用 17：
     * orgChartEditor 官方 scale=0.7578361209233584=(625−17)/802.284…，用 11 会得 0.7653。
     */
    private _scrollbarSlot;
    /** 官方 u2：setScrollWidth 一次性测量标志 */
    private _scrollbarMeasured;
    /**
     * 上一次 raise `DocumentBoundsChanged` 时的文档包围盒。
     * 官方是「包围盒**变了**才 raise」，而本项目以前只在 `invalidateDocumentBounds()`
     * 里无条件 raise —— 初始建模阶段那批 invalidate 全都发生在样例注册监听器**之前**，
     * 于是 gantt 的 `DocumentBoundsChanged` 监听器（给 `myTimeline` 的 `MAIN` 形状
     * 赋 `width = graduatedMax`）永远不触发，`MAIN.width` 停在 NaN，
     * 画 graduated 时间轴时报 `Invalid arguments to Rect constructor: 0, Infinity, 0, -Infinity`。
     */
    private _lastRaisedDocBounds;
    protected _allowSelect: boolean;
    protected _allowMove: boolean;
    protected _allowCopy: boolean;
    protected _allowDelete: boolean;
    protected _allowGroup: boolean;
    protected _allowUngroup: boolean;
    protected _allowLink: boolean;
    protected _allowRelink: boolean;
    protected _allowTextEdit: boolean;
    protected _allowDragOut: boolean;
    protected _allowDrop: boolean;
    protected _allowClipboard: boolean;
    protected _allowInsert: boolean;
    protected _allowHorizontalScroll: boolean;
    protected _allowVerticalScroll: boolean;
    protected _allowZoom: boolean;
    protected _allowReshape: boolean;
    protected _allowResize: boolean;
    protected _allowRotate: boolean;
    protected _allowUndo: boolean;
    protected _isReadOnly: boolean;
    protected _isEnabled: boolean;
    private _nodeTemplate;
    private _nodeTemplateMap;
    private _linkTemplate;
    private _linkTemplateMap;
    private _groupTemplate;
    private _groupTemplateMap;
    private _selection;
    private _maxSelectionCount;
    private _layout;
    private _isInitial;
    _layoutInvalid: boolean;
    private _contextMenu;
    _layers: Layer[];
    /** 官方 Diagram.ms（grid Panel）与其宿主 Part（XL 创建的常驻 Part） */
    private _gridPart;
    private _gridPanel;
    _parts: Map<any, Part>;
    _nodeKeyMap: Map<any, Node>;
    _treeLinkDataByChildKey: Map<any, ObjectData>;
    _changedListeners: Function[];
    _diagramListeners: Map<string, Function[]>;
    _needsRender: boolean;
    _animationFrameId: number;
    /** 官方 delayInitialization 的 vs 冻结位：置位期间 requestUpdate/_renderLoop 直通早退 */
    private _updateSuspended;
    private _resizeObserver;
    private _lastDivWidth;
    private _lastDivHeight;
    private _lastInput;
    private _currentTool;
    constructor(divId: string | HTMLDivElement, options?: Partial<Diagram>);
    get div(): HTMLDivElement | null;
    get model(): Model;
    set model(val: Model);
    get renderer(): CanvasRenderer;
    get toolManager(): ToolManager;
    set toolManager(val: ToolManager);
    get commandHandler(): CommandHandler;
    set commandHandler(val: CommandHandler);
    get animationManager(): AnimationManager;
    set animationManager(val: AnimationManager);
    get themeManager(): ThemeManager;
    get undoManager(): any;
    get lastInput(): InputEvent;
    set lastInput(val: InputEvent);
    get currentTool(): any;
    set currentTool(val: any);
    get defaultTool(): any;
    get position(): Point;
    set position(val: Point);
    get scale(): number;
    set scale(val: number);
    get viewportBounds(): Rect;
    get documentBounds(): Rect;
    get viewSize(): Size;
    get padding(): Margin;
    set padding(val: Margin | number);
    get minScale(): number;
    set minScale(val: number);
    get maxScale(): number;
    set maxScale(val: number);
    get allowSelect(): boolean;
    set allowSelect(val: boolean);
    get allowMove(): boolean;
    set allowMove(val: boolean);
    get allowCopy(): boolean;
    set allowCopy(val: boolean);
    get allowDelete(): boolean;
    set allowDelete(val: boolean);
    get allowGroup(): boolean;
    set allowGroup(val: boolean);
    get allowUngroup(): boolean;
    set allowUngroup(val: boolean);
    get allowLink(): boolean;
    set allowLink(val: boolean);
    get allowRelink(): boolean;
    set allowRelink(val: boolean);
    get allowTextEdit(): boolean;
    set allowTextEdit(val: boolean);
    get allowDragOut(): boolean;
    set allowDragOut(val: boolean);
    get allowDrop(): boolean;
    set allowDrop(val: boolean);
    get allowClipboard(): boolean;
    set allowClipboard(val: boolean);
    get allowInsert(): boolean;
    set allowInsert(val: boolean);
    get allowHorizontalScroll(): boolean;
    set allowHorizontalScroll(val: boolean);
    get allowVerticalScroll(): boolean;
    set allowVerticalScroll(val: boolean);
    get allowZoom(): boolean;
    set allowZoom(val: boolean);
    get allowReshape(): boolean;
    set allowReshape(val: boolean);
    get allowResize(): boolean;
    set allowResize(val: boolean);
    get allowRotate(): boolean;
    set allowRotate(val: boolean);
    get allowUndo(): boolean;
    set allowUndo(val: boolean);
    get isReadOnly(): boolean;
    set isReadOnly(val: boolean);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get nodeTemplate(): Part;
    set nodeTemplate(val: Part);
    get nodeTemplateMap(): Map<string, Part>;
    set nodeTemplateMap(val: Map<string, Part>);
    get linkTemplate(): Part;
    set linkTemplate(val: Part);
    get linkTemplateMap(): Map<string, Part>;
    set linkTemplateMap(val: Map<string, Part>);
    get groupTemplate(): Part | null;
    set groupTemplate(val: Part | null);
    get groupTemplateMap(): Map<string, Part>;
    set groupTemplateMap(val: Map<string, Part>);
    get parts(): Iterator<Part>;
    get nodes(): Iterator<Node>;
    get links(): Iterator<Link>;
    get selection(): Set<Part>;
    get maxSelectionCount(): number;
    set maxSelectionCount(val: number);
    get contextMenu(): any;
    set contextMenu(val: any);
    get layout(): any;
    set layout(val: any);
    get isInitial(): boolean;
    set isInitial(val: boolean);
    private _initialContentAlignment;
    private _initialAutoScale;
    private _initialPosition;
    private _initialScale;
    private _contentAlignment;
    protected _autoScale: EnumValue | null;
    private _hasPerformedInitialLayout;
    get initialContentAlignment(): Spot | null;
    set initialContentAlignment(val: Spot | null);
    get initialAutoScale(): EnumValue | null;
    set initialAutoScale(val: EnumValue | null);
    get initialPosition(): Point | null;
    set initialPosition(val: Point | null);
    get initialScale(): number;
    set initialScale(val: number);
    get contentAlignment(): Spot;
    set contentAlignment(val: Spot);
    get autoScale(): EnumValue | null;
    set autoScale(val: EnumValue | null);
    get layers(): Iterator<Layer>;
    addLayer(layer: Layer): void;
    removeLayer(layer: Layer): void;
    findLayer(name: string): Layer | null;
    /** 官方 `Diagram.add(part): this`：加入默认层，invalidateDocumentBounds + part.invalidateLayout(1)，返回 this */
    add(part: Part): this;
    remove(part: Part): void;
    findNodeForKey(key: any): Node | null;
    findLinkForData(data: ObjectData): Link | null;
    findPartForKey(key: any): Part | null;
    findNodesByExample(data: any): List<Node>;
    findLinksByExample(data: any): List<Link>;
    findPartAt(point: Point, selectableOnly?: boolean): Part | null;
    /** 官方 Diagram.findObjectAt：逐层向下调 Layer.findObjectAt（**不过滤 temporary**，与 findPartAt 不同） */
    findObjectAt(point: Point): GraphObject | null;
    findNodeAt(point: Point): Node | null;
    select(part: Part | null): void;
    clearSelection(): void;
    selectCollection(parts: GojsIterable<Part>): void;
    startTransaction(tname?: string): boolean;
    commitTransaction(tname?: string): boolean;
    rollbackTransaction(): boolean;
    /** 官方 `Diagram.commit(commitFunc, tname?)`：func 收到 diagram 本体；事务交给 model 处理 */
    commit(func: (d?: any) => any, tname?: string): any;
    addDiagramListener(name: string, listener: Function): void;
    removeDiagramListener(name: string, listener: Function): void;
    addChangedListener(listener: Function): void;
    removeChangedListener(listener: Function): void;
    transformDocToView(p: Point): Point;
    transformViewToDoc(p: Point): Point;
    requestUpdate(invalidate?: boolean): void;
    /**
     * 官方 `Diagram.J2(t,e)`：把一次布局整体包进 "Layout" 事务
     * （`n === undoManager.transactionLevel` 为 0 时才开事务，嵌套布局不开）。
     * 这条事务就是 UndoManager.history 的第一条 —— 探针实测官方 idle 时
     * `history=["Layout"]`、`canUndo=true`，本项目此前恒 false。
     */
    private _runLayoutInTransaction;
    layoutDiagram(invalidate?: boolean): void;
    updateAllTargetBindings(propname?: string): void;
    /**
     * 官方 zoomToFit（go.js @278931）：`save yh, yh=1, scale=Sd(2), alignDocument(Center,Center), …`。
     * yh=scrollMode（默认 None=1）——非 None 时官方补一轮 contentAlignment 对齐，
     * 本项目 scrollMode 语义尚未移植，默认路径一致故跳过。
     */
    zoomToFit(): void;
    centerRect(r: Rect): void;
    scrollToRect(r: Rect): void;
    alignDocument(docSpot: Spot, viewSpot: Spot): void;
    rebuildParts(): void;
    static GraphObject: {
        make: (type: any, ...args: any[]) => any;
    };
    static fromDiv(id: string): Diagram | null;
    set(props: Partial<Diagram>): this;
    focus(): void;
    private _createDefaultLayers;
    /** 官方 Diagram.XL()：默认 6 根网格线（1/5/10 间隔），面板默认不可见、Part 可见 */
    private _createDefaultGrid;
    get grid(): any;
    set grid(val: any);
    /**
     * 官方 Diagram.eC(t?)：按视口重设 grid 面板尺寸并把 GRID Part 吸附到网格。
     * Cf（lcm 周期 × cellSize）来自 Panel._updateGridSettings；
     * 面板尺寸 = 视口 + 2×Cf（四周留出一整个周期，平移视口时线相位保持不变）。
     */
    private _updateGridBounds;
    private _createDefaultNodeTemplate;
    private _createDefaultLinkTemplate;
    private _clearAllParts;
    private _addNodeForData;
    private _propagatePartToChildren;
    private _addLinkForData;
    private _addLinkForTreeData;
    private _removeNodeForData;
    private _removeLinksForNode;
    private _removeLinkForData;
    /**
     * 官方 `Binding.updateTarget`（`node_modules/gojs/release/go.js` 840959）把
     * 「取源值 + 调 converter + 写目标属性」整段包在 `try { ... } catch {}` 里，
     * 任何求值异常都被**静默吞掉**（既不中断布局，也不传播到 init）。
     * 之前本项目不 catch，样例里 `Brush.lightenBy(color)` 这类未定义全局
     * 直接把整个 init 打断（实测 industrialDiagram 只渲染出 1/19 个节点）。
     */
    private _resolveBindingValue;
    private _resolveBindingValueCore;
    private _applyBindings;
    /**
     * 官方 Model.ft：把目标属性写入包 try/catch，失败仅 console.log（U.et），
     * 例如数据 width: null → Size(null, NaN) 抛错时保持原值。
     */
    private _setBoundProperty;
    private _applyBindingsToObject;
    private _updateBindingsForPart;
    /** 官方 GraphObject.Zo：只应用 isToTheme 绑定，递归子对象（themeData 源数据沿 panel 链取条目 data，回退 part.data） */
    private _applyThemeBindingsOnly;
    private _updateBindingsForObject;
    _handlePartPropertyChanged(part: Part, obj: GraphObject, propname: string, value?: any): void;
    private _onModelChanged;
    /** 官方 Diagram.Ib(t) 的护栏版：Diagram.layout + 全体 Group.layout 失效 */
    private _invalidateLayoutsFromChanges;
    private _rebuildTreeLinks;
    /**
     * 官方 `Diagram.raiseChangedEvent(change, propertyName, object, oldValue, newValue, oldParam?, newParam?)`。
     * 构造一个 ChangedEvent 并分发给 diagram 的 changed 监听者。
     */
    raiseChangedEvent(change: any, propertyName: string, object: any, oldValue: any, newValue: any, oldParam?: any, newParam?: any): ChangedEvent;
    private _raiseChangedEvent;
    /** 官方 DiagramEvent：监听器收到 `{ diagram, type, subject, subjectData, args }`；官方事件名为 ViewportBoundsChanged */
    private _raiseDiagramEvent;
    raiseDiagramEvent(name: string, subject?: any, subjectData?: any, ...rest: any[]): void;
    private _findObjectInPanel;
    private _renderLoop;
    /**
     * 官方 measure+arrange 全体部件（Ht 语义）：
     * pass1 非 Group 非 Link → pass2 Group → pass3 Link；
     * 每个部件：ensureBounds（measure + bF 位置同步，仅 measure=true 时；渲染阶段只 arrange，
     * 对齐官方 render 不重新 measure）→ _arrange(原始 position, measuredBounds)
     * → syncPositionFromLocation（arrange 后 locationSpot 偏移变化时重推 position）。
     * position 为 NaN 时按原样传入（ab.x/y 保持 NaN，对齐官方）。
     */
    private _measureArrangeAll;
    /** 官方在节点布局定稿后让所有 link 重算路线 */
    private _invalidateLinkRoutes;
    private _collectGroups;
    private _performLayout;
    /**
     * 官方 tE（首次布局完成）+ on(t=true)：先定初始 scale，
     * 再按 initialDocumentSpot/initialViewportSpot 计算 position，最后用 Z2 首次夹取修正。
     */
    private _applyInitialViewport;
    /** 官方 Z2(n=true/scrollMode)：夹取 position；视口宽于文档时按对齐 spot 摆放 */
    private _clampViewportPosition;
    /**
     * 官方 Sd(t)（go.js @278343 逐字移植）：autoScale/initialAutoScale 的缩放比。
     * 官方 o=Pt+(ro?Ht:0)、r=St+(Ln?Ht:0)，而 Pt/St=raw−(flag?Ht) 恒等复原 →
     * o/r 即原始 viewSize（本实现 viewSize 一直是 raw，天然等价）。
     * scrollMargin(kh) 非零时对**较大比值轴**先减 Ht（官方 a>l/a<l 分支）；
     * t=2 min(a,l)，t=3 恒对大轴减 Ht（与 scrollMargin 无关）；
     * 依次 clamp defaultScale → minScale → maxScale。
     * Ht 用 _scrollbarSlot：初始 17（官方 NA 默认），首测后 11——orgChartEditor
     * 官方 scale=(625−17)/802.284=0.7578361209233584，按 raw/doc 会得 0.77903。
     */
    private _computeAutoScale;
    private _applyAutoScale;
    private _applyContentAlignment;
    private _updateGeometry;
    private _setupResizeObserver;
    private _checkResize;
    private _setupMouseEvents;
    private _setupKeyboardEvents;
    private _currentCursor;
    private _defaultCursor;
    private _skipsUndoManager;
    private _mouseOver;
    private _mouseEnter;
    private _mouseLeave;
    private _mouseHold;
    private _mouseHover;
    private _toolTip;
    get currentCursor(): string;
    /** 官方 `set currentCursor(t)`: `t==="" && (t=this.defaultCursor)`，并写 div/canvas style */
    set currentCursor(val: string);
    get defaultCursor(): string;
    /** 官方 `set defaultCursor(t)`: `t==="" && (t="auto")` */
    set defaultCursor(val: string);
    get skipsUndoManager(): boolean;
    set skipsUndoManager(val: boolean);
    get mouseOver(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseOver(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get mouseEnter(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseEnter(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get mouseLeave(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseLeave(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get mouseHold(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseHold(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get mouseHover(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseHover(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get toolTip(): GraphObject | string | null;
    set toolTip(val: GraphObject | string | null);
    private _firstInput;
    private _previousInput;
    private _mouseIsCaptured;
    private _opacity;
    private _fixedBounds;
    private _defaultScale;
    private _initialDocumentSpot;
    private _initialViewportSpot;
    private _positionComputation;
    private _scrollMode;
    private _scrollMargin;
    private _scrollsPageOnFocus;
    private _hasHorizontalScrollbar;
    private _hasVerticalScrollbar;
    private _autoScrollInterval;
    private _autoScrollRegion;
    private _isVirtualized;
    private _isTreePathToChildren;
    private _treeCollapsePolicy;
    private _highlighteds;
    private _isCollapsingExpanding;
    private _delaysLayout;
    private _isModelReadOnly;
    private _isModified;
    private _draggedLink;
    private _modelChangeListeners;
    get firstInput(): InputEvent;
    get previousInput(): InputEvent;
    get isMouseCaptured(): boolean;
    get opacity(): number;
    set opacity(val: number);
    get fixedBounds(): Rect | null;
    set fixedBounds(val: Rect | null);
    get defaultScale(): number;
    set defaultScale(val: number);
    get initialDocumentSpot(): Spot;
    set initialDocumentSpot(val: Spot);
    get initialViewportSpot(): Spot;
    set initialViewportSpot(val: Spot);
    get positionComputation(): ((part: Part, pt: Point, gridPt: Point) => Point) | null;
    set positionComputation(val: ((part: Part, pt: Point, gridPt: Point) => Point) | null);
    get scrollMode(): any;
    set scrollMode(val: any);
    get scrollMargin(): Margin;
    set scrollMargin(val: Margin | number);
    get scrollsPageOnFocus(): boolean;
    set scrollsPageOnFocus(val: boolean);
    get hasHorizontalScrollbar(): boolean;
    set hasHorizontalScrollbar(val: boolean);
    get hasVerticalScrollbar(): boolean;
    set hasVerticalScrollbar(val: boolean);
    get autoScrollInterval(): number;
    set autoScrollInterval(val: number);
    get autoScrollRegion(): number;
    set autoScrollRegion(val: number);
    get isVirtualized(): boolean;
    set isVirtualized(val: boolean);
    get isTreePathToChildren(): boolean;
    set isTreePathToChildren(val: boolean);
    get treeCollapsePolicy(): any;
    set treeCollapsePolicy(val: any);
    get highlighteds(): Set<Part>;
    get isCollapsingExpanding(): boolean;
    get delaysLayout(): boolean;
    set delaysLayout(val: boolean);
    get isModelReadOnly(): boolean;
    set isModelReadOnly(val: boolean);
    get isModified(): boolean;
    set isModified(val: boolean);
    get draggedLink(): any;
    set draggedLink(val: any);
    addModelChangedListener(listener: (e: any) => void): void;
    removeModelChangedListener(listener: (e: any) => void): void;
    addEventListener(type: string, listener: (e: any) => void): void;
    removeEventListener(type: string, listener: (e: any) => void): void;
    doMouseDown(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doMouseWheel(): void;
    doKeyDown(): void;
    doKeyUp(): void;
    emitMouseDown(e: InputEvent): void;
    emitMouseMove(e: InputEvent): void;
    emitMouseUp(e: InputEvent): void;
    emitMouseWheel(e: InputEvent): void;
    emitKeyDown(e: InputEvent): void;
    emitKeyUp(e: InputEvent): void;
    doFocus(): void;
    acceptEvent(e: InputEvent): boolean;
    click(e: InputEvent): void;
    doubleClick(e: InputEvent): void;
    contextClick(e: InputEvent): void;
    getMouse(): Point;
    mouseDragOver(e: InputEvent): void;
    mouseDrop(e: InputEvent): void;
    findPartForData(data: any): Part | null;
    findNodeForData(data: any): Node | null;
    findLinkForKey(key: any): Link | null;
    findPartsAt(point: Point): any;
    findObjectsAt(point: Point): any;
    findPartsIn(rect: Rect, partial?: boolean): any;
    findObjectsIn(rect: Rect, partial?: boolean): any;
    findPartsNear(center: Point, dist: number, partial?: boolean): any;
    findObjectsNear(center: Point, dist: number): any;
    findTopLevelNodesAndLinks(): any;
    findTopLevelGroups(): any;
    findTreeRoots(): any;
    computePartsBounds(parts: any, includeLinks?: boolean): Rect;
    computeBounds(): Rect;
    ensureBounds(): void;
    invalidateDocumentBounds(): void;
    /** 官方语义：文档包围盒发生变化时（且仅此时）raise `DocumentBoundsChanged` */
    private _checkDocumentBoundsChanged;
    invalidateViewport(): void;
    zoomToRect(rect: Rect): void;
    zoomPoint(factor: number): void;
    /** 官方 `Diagram.isUnoccupied(rect, ignore?)`：委托给避障网格 */
    isUnoccupied(rect: Rect, ignore?: any): boolean;
    /**
     * 官方 `Diagram.computeOccupiedArea(rect)`（getPositions.js:10 调用处
     * `const o=Rect.a(); this.computeOccupiedArea(o), o.inflate(100,100), s.Ob(o)`）：
     * 非虚拟化时把**文档范围**拷进 rect（官方 `t.f(this.documentBounds)`）。
     * 旧占位返回新 Rect(viewport) 且不写 place → 网格只有 (0,0,0,0).inflate(100)=232×232，
     * 大图节点全在网格外标不上障碍。
     */
    computeOccupiedArea(place: Rect): Rect;
    /**
     * 官方 `Diagram.scrollHorizontalLineChange`（数值属性，默认 16）。
     * 以前这里是 `scrollHorizontalLineChange(value)` 方法，语义与官方完全不同。
     */
    private _scrollHorizontalLineChange;
    get scrollHorizontalLineChange(): number;
    set scrollHorizontalLineChange(value: number);
    private _scrollVerticalLineChange;
    get scrollVerticalLineChange(): number;
    set scrollVerticalLineChange(value: number);
    /**
     * 官方 `Diagram.scroll(mode, dir, amount = 1)`（go.js 逐字）：
     *   mode ∈ pixel | line | page | document
     */
    scroll(mode?: string, dir?: string, amount?: number): void;
    /**
     * 官方 setScrollWidth(elem?)（go.js @261040 逐字移植）：向 div 里塞
     * overflow hidden→scroll 的探针 p，量 `hidden.offsetWidth − scroll.offsetWidth`
     * 得滚动条宽；e===0 且非触屏时 fallback 11。返回实测值（不落字段——官方由
     * 调用方 jM() 写 `Ht=setScrollWidth()`）。
     */
    setScrollWidth(elem?: HTMLElement): number;
    computeAutoScrollPosition(): Point;
    doAutoScroll(): void;
    stopAutoScroll(): void;
    addLayerBefore(layer: Layer, existingLayer: Layer): void;
    addLayerAfter(layer: Layer, existingLayer: Layer): void;
    partAdded(part: Part): void;
    partRemoved(part: Part): void;
    clear(): void;
    removeParts(coll: any, ensureBounds?: boolean): void;
    /**
     * 官方这几个方法都接受 Iterable（List/Set/图元集合）或者普通数组。
     * 本项目的 `List.iterator` 是**属性**（一个 Iterator 对象）而不是方法，
     * 所以不能无脑 `coll.iterator()`。
     */
    private _iterateParts;
    moveParts(coll: any, delta: Point, check?: boolean): void;
    copyParts(coll: any, targetDiagram?: any, check?: boolean): any;
    private _nodeSelectionAdornmentTemplate;
    private _linkSelectionAdornmentTemplate;
    private _groupSelectionAdornmentTemplate;
    get nodeSelectionAdornmentTemplate(): any;
    set nodeSelectionAdornmentTemplate(val: any);
    get linkSelectionAdornmentTemplate(): any;
    set linkSelectionAdornmentTemplate(val: any);
    get groupSelectionAdornmentTemplate(): any;
    set groupSelectionAdornmentTemplate(val: any);
    highlightCollection(parts: any): void;
    highlight(part: Part): void;
    clearHighlighteds(): void;
    private _renderingHints;
    private _divBackground;
    private _pixelRatio;
    private _attached;
    setRenderingHint(name: string, val: any): void;
    getRenderingHint(name: string): any;
    resetRenderingHints(): void;
    setDivBackground(value: string): void;
    computePixelRatio(): number;
    attach(): void;
    get isAttached(): boolean;
    maybeUpdate(): void;
    get isUpdateRequested(): boolean;
    private _isUpdateRequestedFlag;
    makeSVG(opts?: any): any;
    makeSvg(opts?: any): any;
    makeImageData(opts?: any): string;
    makeImage(opts?: any): any;
    private _routers;
    get routers(): List<any>;
    set routers(val: List<any> | any[] | Iterable<any>);
    /** 官方 `Diagram.findRouter(name)` */
    findRouter(name: string): any;
    addRenderer(renderer: any): void;
    removeRenderer(renderer: any): void;
    /** 官方 `Diagram.setupRouters(){this.Pf.push(new AvoidsNodesRouter)}`（go-debug 279143） */
    setupRouters(): void;
    /**
     * 官方 `Diagram.addInvalidRoute(t){this.vo?this.Ta.add(t):this.Jr.add(t)}`：
     * computePoints 成功后把 link 登记进“待避障路由”集合；vo（路由进行中）进 Ta 延迟批。
     * 本项目 doLinkRouting 直接遍历全部 link（全集 ⊇ 官方 Jr 初值），集合主要保语义。
     */
    addInvalidRoute(part: any): void;
    computeMove(part: any, pt: Point): void;
    /**
     * 官方 `Diagram.getPositions(rebuildDistances, container, ignore)`（go-debug 366380）：
     * 返回（并缓存）避障网格 PositionArray：
     * - 缓存失效（needsRebuild / 容器变化 / ignore 变化）→ 重算占用场：
     *   文档范围外扩100 后 Ob，再把各可见非临时层节点的 avoidable 矩形 fE 标占用（yC，
     *   Group 按 avoidableMembers 递归）；Group 容器则按成员包围盒 Ob。
     * - rebuildDistances=true 时 aD() 清距离场（路由前重算 BFS 距离）。
     */
    getPositions(rebuildDistances: boolean, container: any, ignore: any): PositionArray;
    /** 官方 `Diagram.hD(t)`：取最外层可避障的容器 Group，否则 null（图级） */
    private _hD;
    /** 官方 `Diagram.yC(node, ignore, rect)`：把节点 avoidable 矩形标进网格（Group 递归成员） */
    private _yC;
    /**
     * 官方 `Diagram.Fd(node?)`：节点增删/移动/avoidable 变化后把网格标为待重建
     * （`bh!==null && !bh.Qo && (t===void0 || t.canAvoid()) → Qo=true`）。
     */
    Fd(node?: any): void;
    validCycle(): boolean;
    getInputOption(prop: string): any;
    setInputOption(prop: string, val: any): void;
    setProperties(obj: any): void;
    setRTL(isRTL: boolean): void;
    /**
     * 对齐官方 `Diagram.delayInitialization(func)`（见 `node_modules/gojs/release/go.js`）：
     *   `t !== null && U.yn(() => { ...; t(this) }, 1)`
     * 即延迟到下一次 macrotask 再调用，并且**把 Diagram 自己作为参数传进去**。
     * 之前这里写成 `callback()`，既没延迟也没传参，
     * `myDiagram.delayInitialization(loadTree)` 这类样例直接
     * `Cannot read properties of undefined (reading 'model')`（实测 DragZooming）。
     */
    delayInitialization(callback?: ((d: Diagram) => void) | null): void;
    toggleKeyboardControl(shown: boolean): void;
    onViewportBoundsChanged(): void;
    updateAllRelationshipsFromData(): void;
    /** 官方 Diagram.updateAllThemeBindings：对所有部件应用 theme 绑定（PartManager.updateAllThemeBindings），并额外处理 GRID 部件（官方 `this.ms.part.Zo()`） */
    updateAllThemeBindings(): void;
    isTreePathToChildrenFn(): boolean;
    toString(): string;
    private _avoidanceCellSize;
    private _avoidanceLimit;
    /** 官方 `Diagram.Pb` 避障网格缓存（getPositions 惰性创建，needsRebuild/容器/ignore 变化时重建占用场） */
    private _positionArray;
    /** 官方 `Jr`：computePoints 成功后登记的待避障路由 link 集合 */
    private _invalidRoutes;
    /** 官方 `Ta`：路由进行中（vo=true）登记的延迟批 */
    private _invalidRoutesDuringRouting;
    /** 官方 `vo`：doLinkRouting 进行中标志（addInvalidRoute 据此分流） */
    private _routingLinks;
    /** 官方 `C0`：一旦出现 avoiding link 就置 true，且从不复位（canRoute 门控） */
    private _needsAvoidance;
    private _scaleComputation;
    private _handlesDragDropForTopLevelParts;
    private _partManager;
    get avoidanceCellSize(): Size;
    set avoidanceCellSize(val: Size);
    get avoidanceLimit(): number;
    set avoidanceLimit(val: number);
    get scaleComputation(): ((thisDiagram: Diagram, newScale: number) => number) | null;
    set scaleComputation(val: ((thisDiagram: Diagram, newScale: number) => number) | null);
    get handlesDragDropForTopLevelParts(): boolean;
    set handlesDragDropForTopLevelParts(val: boolean);
    get partManager(): any;
    set partManager(val: any);
    initializePartManager(partManager: any): void;
    diagramScroll(scrollbar: any): void;
    /** 官方 `Diagram.doLinkRouting(container)`：遍历 routers，canRoute 过滤后 routeLinks(本图 links 集合, container) */
    doLinkRouting(container?: any): void;
    /**
     * 官方 iC 尾部的路由收尾（go-debug occurrence2）：
     * `this.doLinkRouting(this), this.Jr.clear(), this.Ta.size!==0 && (最多23轮 swap+doLinkRouting)`
     * —— 无条件跑一轮（第一轮），清 Jr；路由期间新产生的 Ta 批 swap 成新 Jr 再跑，上限 23。
     */
    private _routeInvalidatedLinks;
    cacheGroupExternalLinks(start: boolean): void;
    focusObject(obj: any): void;
    raiseChanged(flag: any, details: any): void;
    redraw(): void;
    reset(): void;
}
