import { Model, ObjectData } from '../model/Model';
import { GraphLinksModel } from '../model/GraphLinksModel';
import { TreeModel } from '../model/TreeModel';
import { ChangedEvent } from '../model/ChangedEvent';
import { Binding } from '../model/Binding';
import { EnumValue, AutoScaleUniform, AutoScaleUniformToFill, DiagramEventModelChanged, DiagramEventChanged } from '../core/EnumValues';
import { GraphObject } from '../view/GraphObject';
import { Panel } from '../view/Panel';
import { Part } from '../view/Part';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { Group } from '../view/Group';
import { Adornment } from '../view/Adornment';
import { Shape } from '../view/Shape';
import { TextBlock } from '../view/TextBlock';
import { Layer } from '../view/Layer';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin } from '../core/Margin';
import { List } from '../core/List';
import { Map } from '../core/Map';
import { Set } from '../core/Set';
import { Iterator, Iterable as GojsIterable, iteratorToArray } from '../core/Iterable';
import {
  ChangedEventProperty, ChangedEventInsert, ChangedEventRemove, ChangedEventTransaction,
  PanelAuto, PanelVertical, PanelLink, PanelGrid
} from '../core/EnumValues';
import { CanvasRenderer } from '../render/CanvasRenderer';
import { ToolManager } from '../tool/ToolManager';
import { CommandHandler } from '../command/CommandHandler';
import { AnimationManager } from '../animation/AnimationManager';
import { InputEvent } from './InputEvent';
import { ThemeManager } from './ThemeManager';
import { Layout } from '../layout/Layout';

/** 官方滚动条槽位宽/高（屏幕 px，实测恒为 11，与 viewSize、scale 无关） */
const SCROLLBAR_SIZE = 11;

/**
 * 官方 Diagram 的事件名清单（官方 `Diagram.RO()` 建立的 `S2`/`k2` 表）。
 * `set(options)` 遇到这些名字时不会当普通属性赋值，而是转成 addDiagramListener。
 */
const DIAGRAM_EVENT_NAMES = [
  'InitialAnimationStarting', 'AnimationStarting', 'AnimationFinished',
  'BackgroundSingleClicked', 'BackgroundDoubleClicked', 'BackgroundContextClicked',
  'ClipboardChanged', 'ClipboardPasted', 'DocumentBoundsChanged', 'ExternalObjectsDropped',
  'FocusOrVirtualPointerEnabledChanged', 'GainedFocus', 'InitialLayoutCompleted',
  'LayoutCompleted', 'LinkDrawn', 'LinkRelinked', 'LinkReshaped', 'LostFocus',
  'Modified', 'ObjectSingleClicked', 'ObjectDoubleClicked', 'ObjectContextClicked',
  'PartCreated', 'PartResized', 'PartRotated', 'SelectionMoved', 'SelectionCopied',
  'SelectionDeleting', 'SelectionDeleted', 'SelectionGrouped', 'SelectionUngrouped',
  'ChangingSelection', 'ChangedSelection', 'SubGraphCollapsed', 'SubGraphExpanded',
  'TextEdited', 'ThemeChanged', 'TreeCollapsed', 'TreeExpanded', 'ViewportBoundsChanged',
  'InvalidateDraw'
];
const DIAGRAM_EVENT_NAME_SET = new Set<string>(DIAGRAM_EVENT_NAMES);
for (const n of DIAGRAM_EVENT_NAMES) DIAGRAM_EVENT_NAME_SET.add(n.toLowerCase());

/** 官方 `Diagram.qL(name)`：是否是合法的 Diagram 事件名（大小写不敏感） */
export function isDiagramEventName(name: string): boolean {
  return DIAGRAM_EVENT_NAME_SET.has(name);
}

export class Diagram {
  static readonly className: string = "Diagram";

  // ============ 官方 Diagram 静态常量（阶段 6，对齐 go.d.ts） ============
  static readonly version: string = '4.0.4';
  static licenseKey: string = '';
  static img: string = 'image';

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

  static isUsingDOM(): boolean {
    return typeof document !== 'undefined';
  }
  static setDocument(d: any): void {
    (globalThis as any).document = d;
  }
  static useDOM(value: boolean): void {
    // 无实际操作，保留 API 对齐
  }

  private _div: HTMLDivElement | null = null;
  // 官方 new Diagram(div) 的默认 model 就是 GraphLinksModel，
  // 所以 myDiagram.model.addLinkData(...) 这类调用在没设 model 时也能用
  private _model: Model = new GraphLinksModel();
  private _modelChangeListener: ((e: any) => void) | null = null;
  private _renderer: CanvasRenderer;
  private _toolManager: ToolManager;
  private _commandHandler: CommandHandler;
  private _animationManager: AnimationManager;
  private _themeManager: ThemeManager;

  private _position: Point = Point.Zero.copy();
  private _scale: number = 1;
  private _minScale: number = 0;
  private _maxScale: number = Infinity;
  private _padding: Margin = new Margin(5);
  /**
   * 上一次 raise `DocumentBoundsChanged` 时的文档包围盒。
   * 官方是「包围盒**变了**才 raise」，而本项目以前只在 `invalidateDocumentBounds()`
   * 里无条件 raise —— 初始建模阶段那批 invalidate 全都发生在样例注册监听器**之前**，
   * 于是 gantt 的 `DocumentBoundsChanged` 监听器（给 `myTimeline` 的 `MAIN` 形状
   * 赋 `width = graduatedMax`）永远不触发，`MAIN.width` 停在 NaN，
   * 画 graduated 时间轴时报 `Invalid arguments to Rect constructor: 0, Infinity, 0, -Infinity`。
   */
  private _lastRaisedDocBounds: Rect | null = null;

  protected _allowSelect: boolean = true;
  protected _allowMove: boolean = true;
  protected _allowCopy: boolean = true;
  protected _allowDelete: boolean = true;
  protected _allowGroup: boolean = true;
  protected _allowUngroup: boolean = true;
  protected _allowLink: boolean = true;
  protected _allowRelink: boolean = true;
  protected _allowTextEdit: boolean = true;
  protected _allowDragOut: boolean = true;
  protected _allowDrop: boolean = true;
  protected _allowClipboard: boolean = true;
  protected _allowInsert: boolean = true;
  protected _allowHorizontalScroll: boolean = true;
  protected _allowVerticalScroll: boolean = true;
  protected _allowZoom: boolean = true;
  protected _allowReshape: boolean = true;
  protected _allowResize: boolean = true;
  protected _allowRotate: boolean = true;
  protected _allowUndo: boolean = true;
  protected _isReadOnly: boolean = false;
  protected _isEnabled: boolean = true;

  private _nodeTemplate: Part;
  private _nodeTemplateMap: Map<string, Part> = new Map<string, Part>();
  private _linkTemplate: Part;
  private _linkTemplateMap: Map<string, Part> = new Map<string, Part>();
  private _groupTemplate: Part | null = null;
  private _groupTemplateMap: Map<string, Part> = new Map<string, Part>();

  private _selection: Set<Part> = new Set<Part>();
  private _maxSelectionCount: number = Infinity;

  private _layout: any = null;
  private _isInitial: boolean = true;
  _layoutInvalid: boolean = false;
  private _contextMenu: any = null;

  _layers: Layer[] = [];

  /** 官方 Diagram.ms（grid Panel）与其宿主 Part（XL 创建的常驻 Part） */
  private _gridPart: Part | null = null;
  private _gridPanel: Panel | null = null;

  _parts: Map<any, Part> = new Map<any, Part>();
  _nodeKeyMap: Map<any, Node> = new Map<any, Node>();
  _treeLinkDataByChildKey: Map<any, ObjectData> = new Map<any, ObjectData>();

  _changedListeners: Function[] = [];
  _diagramListeners: Map<string, Function[]> = new Map<string, Function[]>();

  _needsRender: boolean = false;
  _animationFrameId: number = 0;

  private _resizeObserver: ResizeObserver | null = null;
  private _lastDivWidth: number = 0;
  private _lastDivHeight: number = 0;

  private _lastInput: InputEvent = new InputEvent();

  private _currentTool: ToolManager | null = null;

  constructor(divId: string | HTMLDivElement, options?: Partial<Diagram>) {
    let div: HTMLDivElement | null = null;
    if (typeof divId === 'string') {
      const el = document.getElementById(divId);
      if (el instanceof HTMLDivElement) {
        div = el;
      }
    } else {
      div = divId;
    }

    this._div = div;

    this._toolManager = new ToolManager();
    this._commandHandler = new CommandHandler();
    this._animationManager = new AnimationManager();
    this._themeManager = new ThemeManager();
    // 官方 Diagram：默认 layout = new Layout（base，极简网格摆放未定位部件）
    this._layout = new Layout();
    this._layout.diagram = this;

    if (div) {
      if (window.getComputedStyle(div, null).position === 'static') {
        div.style.position = 'relative';
      }
      (div.style as any)['-webkit-tap-highlight-color'] = 'rgba(255, 255, 255, 0)';
      div.setAttribute('tabindex', '0');
      (div as any)._goDiagram = this;
      this._renderer = new CanvasRenderer(div);
      this._renderer.diagram = this;
      this._setupResizeObserver();
      this._setupMouseEvents();
      this._setupKeyboardEvents();
    } else {
      this._renderer = null as any;
    }

    this._toolManager.diagram = this;
    this._commandHandler.diagram = this;
    this._animationManager.diagram = this;
    this._themeManager.diagram = this;
    // 官方 ThemeManager.changesDivBackground 默认 true：构造时就按主题把 div 底色设好
    ThemeManager.applyDivBackground(this);

    this._createDefaultLayers();

    this._nodeTemplate = this._createDefaultNodeTemplate();
    this._linkTemplate = this._createDefaultLinkTemplate();

    this._modelChangeListener = (e: ChangedEvent) => this._onModelChanged(e);
    this._model.addChangedListener(this._modelChangeListener);

    if (options) {
      this.set(options);
    }
  }

  // ============ Core Properties ============

  get div(): HTMLDivElement | null {
    return this._div;
  }

  get model(): Model {
    return this._model;
  }

  set model(val: Model) {
    if (this._model === val) return;
    const oldModel = this._model;
    if (this._modelChangeListener && oldModel) {
      oldModel.removeChangedListener(this._modelChangeListener);
    }
    if (oldModel) {
      for (const listener of this._modelChangeListeners) {
        oldModel.removeChangedListener(listener);
      }
    }
    this._model = val;
    if (this._modelChangeListener) {
      this._model.addChangedListener(this._modelChangeListener);
    }
    this.rebuildParts();
    // 官方会把 model-changed 监听者重新挂到新 model 上
    for (const listener of this._modelChangeListeners) {
      this._model.addChangedListener(listener);
    }
    // 官方 `Diagram.model` setter（go.js: set model(t){…}）**不会**走事务，
    // 只是 `invalidateDocumentBounds()` + 重挂监听者。
    // 以前这里额外 start/commit 了一个 'Replace Model' 事务，于是
    // `"ModelChanged": e => { if (e.isTransactionFinished) … }"` 会在
    // `myDiagram.model = …` 那一刻就触发 —— twoDiagrams 的监听器此时
    // 还没走到 `myDiagram2 = new go.Diagram(...)`，直接
    // `myDiagram2 is not defined`（ReferenceError，官方不会）。
  }

  get renderer(): CanvasRenderer {
    return this._renderer;
  }

  get toolManager(): ToolManager {
    return this._toolManager;
  }

  set toolManager(val: ToolManager) {
    if (this._toolManager) {
      this._toolManager.diagram = null;
    }
    this._toolManager = val;
    if (val) {
      val.diagram = this;
    }
  }

  get commandHandler(): CommandHandler {
    return this._commandHandler;
  }

  set commandHandler(val: CommandHandler) {
    if (this._commandHandler) {
      this._commandHandler.diagram = null;
    }
    this._commandHandler = val;
    if (val) {
      val.diagram = this;
    }
  }

  get animationManager(): AnimationManager {
    return this._animationManager;
  }

  set animationManager(val: AnimationManager) {
    if (this._animationManager) {
      this._animationManager.diagram = null;
    }
    this._animationManager = val;
    if (val) {
      val.diagram = this;
    }
  }

  get themeManager(): ThemeManager {
    return this._themeManager;
  }

  get undoManager(): any {
    return this._model.undoManager;
  }

  get lastInput(): InputEvent {
    return this._toolManager.lastInput;
  }

  set lastInput(val: InputEvent) {
    this._toolManager.lastInput = val;
  }

  get currentTool(): any {
    return this._toolManager.currentTool;
  }

  set currentTool(val: any) {
    this._toolManager.currentTool = val;
  }

  get defaultTool(): any {
    return this._toolManager.defaultTool;
  }

  // ============ Viewport Properties ============

  get position(): Point {
    return this._position;
  }
  set position(val: Point) {
    if (this._position.equals(val)) return;
    this._position = val.copy();
    this._raiseDiagramEvent('ViewportChanged');
    this.requestUpdate();
  }

  get scale(): number {
    return this._scale;
  }

  set scale(val: number) {
    val = Math.max(this._minScale, Math.min(this._maxScale, val));
    if (this._scale === val) return;
    this._scale = val;
    this._raiseDiagramEvent('ViewportChanged');
    this.requestUpdate();
  }

  get viewportBounds(): Rect {
    const vs = this.viewSize;
    const s = this._scale;
    // 官方（实测 syn_none/syn_vonly/syn_honly/syn_both @scale1 与 scale2）：
    // 某一轴的**文档屏幕尺寸**溢出 viewSize 时，另一轴预留 11px 滚动条槽位。
    // 两条判定互相独立、都只跟原始 viewSize 比；预留值是固定 11 屏幕 px（= 11/scale 文档单位）。
    // 官方占了位却**不绘制**滚动条（unit_official.png 底部 11 行全白）。
    let w = vs.width;
    let h = vs.height;
    const db = this.documentBounds;
    // 官方自身也兜底 `Math.max(St - Ht, 1)`，否则未布局的 div（clientWidth=0）会算出负尺寸。
    if (db.width * s > vs.width) h = Math.max(h - SCROLLBAR_SIZE, 1);
    if (db.height * s > vs.height) w = Math.max(w - SCROLLBAR_SIZE, 1);
    return new Rect(this._position.x, this._position.y, w / s, h / s);
  }

  get documentBounds(): Rect {
    // 官方 KL：仅并入 isReal 的 part bounds；全无则 (0,0,0,0)，再 addMargin(padding)
    let bounds: Rect | null = null;
    const layers = this._layers;
    for (const layer of layers) {
      if (layer.isTemporary) continue;
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part: Part = partsIt.value;
        if (!part.visible) continue;
        if (!(part as any).isInDocumentBounds) continue;
        const partBounds = part.getDocumentBounds();
        if (!partBounds.isReal()) continue;
        bounds = bounds === null ? partBounds.copy() : bounds.unionRect(partBounds);
      }
    }
    if (bounds === null) bounds = new Rect(0, 0, 0, 0);
    bounds.x -= this._padding.left;
    bounds.y -= this._padding.top;
    bounds.width += this._padding.left + this._padding.right;
    bounds.height += this._padding.top + this._padding.bottom;
    return bounds;
  }

  get viewSize(): Size {
    if (this._div) {
      return new Size(this._div.clientWidth, this._div.clientHeight);
    }
    return new Size(0, 0);
  }

  get padding(): Margin {
    return this._padding;
  }

  set padding(val: Margin | number) {
    const m = typeof val === 'number' ? new Margin(val) : val;
    if (this._padding.equals(m)) return;
    this._padding = m.copy();
    this.requestUpdate();
  }

  get minScale(): number { return this._minScale; }
  set minScale(val: number) { this._minScale = val; }

  get maxScale(): number { return this._maxScale; }
  set maxScale(val: number) { this._maxScale = val; }

  // ============ Permission Properties ============

  get allowSelect(): boolean { return this._allowSelect; }
  set allowSelect(val: boolean) { this._allowSelect = val; }

  get allowMove(): boolean { return this._allowMove; }
  set allowMove(val: boolean) { this._allowMove = val; }

  get allowCopy(): boolean { return this._allowCopy; }
  set allowCopy(val: boolean) { this._allowCopy = val; }

  get allowDelete(): boolean { return this._allowDelete; }
  set allowDelete(val: boolean) { this._allowDelete = val; }

  get allowGroup(): boolean { return this._allowGroup; }
  set allowGroup(val: boolean) { this._allowGroup = val; }

  get allowUngroup(): boolean { return this._allowUngroup; }
  set allowUngroup(val: boolean) { this._allowUngroup = val; }

  get allowLink(): boolean { return this._allowLink; }
  set allowLink(val: boolean) { this._allowLink = val; }

  get allowRelink(): boolean { return this._allowRelink; }
  set allowRelink(val: boolean) { this._allowRelink = val; }

  get allowTextEdit(): boolean { return this._allowTextEdit; }
  set allowTextEdit(val: boolean) { this._allowTextEdit = val; }

  get allowDragOut(): boolean { return this._allowDragOut; }
  set allowDragOut(val: boolean) { this._allowDragOut = val; }

  get allowDrop(): boolean { return this._allowDrop; }
  set allowDrop(val: boolean) { this._allowDrop = val; }

  get allowClipboard(): boolean { return this._allowClipboard; }
  set allowClipboard(val: boolean) { this._allowClipboard = val; }

  get allowInsert(): boolean { return this._allowInsert; }
  set allowInsert(val: boolean) { this._allowInsert = val; }

  get allowHorizontalScroll(): boolean { return this._allowHorizontalScroll; }
  set allowHorizontalScroll(val: boolean) { this._allowHorizontalScroll = val; }

  get allowVerticalScroll(): boolean { return this._allowVerticalScroll; }
  set allowVerticalScroll(val: boolean) { this._allowVerticalScroll = val; }

  get allowZoom(): boolean { return this._allowZoom; }
  set allowZoom(val: boolean) { this._allowZoom = val; }

  get allowReshape(): boolean { return this._allowReshape; }
  set allowReshape(val: boolean) { this._allowReshape = val; }

  get allowResize(): boolean { return this._allowResize; }
  set allowResize(val: boolean) { this._allowResize = val; }

  get allowRotate(): boolean { return this._allowRotate; }
  set allowRotate(val: boolean) { this._allowRotate = val; }

  get allowUndo(): boolean { return this._allowUndo; }
  set allowUndo(val: boolean) { this._allowUndo = val; }

  get isReadOnly(): boolean { return this._isReadOnly; }
  set isReadOnly(val: boolean) { this._isReadOnly = val; }

  get isEnabled(): boolean { return this._isEnabled; }
  set isEnabled(val: boolean) { this._isEnabled = val; }

  // ============ Template Properties ============

  get nodeTemplate(): Part {
    return this._nodeTemplate;
  }

  set nodeTemplate(val: Part) {
    this._nodeTemplate = val;
    this.rebuildParts();
  }

  get nodeTemplateMap(): Map<string, Part> {
    return this._nodeTemplateMap;
  }

  set nodeTemplateMap(val: Map<string, Part>) {
    this._nodeTemplateMap = val;
    this.rebuildParts();
  }

  get linkTemplate(): Part {
    return this._linkTemplate;
  }

  set linkTemplate(val: Part) {
    this._linkTemplate = val;
    this.rebuildParts();
  }

  get linkTemplateMap(): Map<string, Part> {
    return this._linkTemplateMap;
  }

  set linkTemplateMap(val: Map<string, Part>) {
    this._linkTemplateMap = val;
    this.rebuildParts();
  }

  get groupTemplate(): Part | null {
    return this._groupTemplate;
  }

  set groupTemplate(val: Part | null) {
    this._groupTemplate = val;
    this.rebuildParts();
  }

  get groupTemplateMap(): Map<string, Part> {
    return this._groupTemplateMap;
  }

  set groupTemplateMap(val: Map<string, Part>) {
    this._groupTemplateMap = val;
    this.rebuildParts();
  }

  // ============ Collection Properties ============

  get parts(): Iterator<Part> {
    const result = new List<Part>();
    const it = this._parts.iteratorValues;
    while (it.next()) {
      result.add(it.value);
    }
    return result.iterator;
  }

  get nodes(): Iterator<Node> {
    const result = new List<Node>();
    const it = this._parts.iteratorValues;
    while (it.next()) {
      const part = it.value;
      if (part instanceof Node) result.add(part);
    }
    return result.iterator;
  }

  get links(): Iterator<Link> {
    const result = new List<Link>();
    const it = this._parts.iteratorValues;
    while (it.next()) {
      const part = it.value;
      if (part instanceof Link) result.add(part);
    }
    return result.iterator;
  }

  // ============ Selection Properties ============

  get selection(): Set<Part> {
    return this._selection;
  }

  get maxSelectionCount(): number {
    return this._maxSelectionCount;
  }

  set maxSelectionCount(val: number) {
    this._maxSelectionCount = val;
  }

  get contextMenu(): any { return this._contextMenu; }
  set contextMenu(val: any) { this._contextMenu = val; }

  // ============ Layout Properties ============

  get layout(): any {
    return this._layout;
  }

  set layout(val: any) {
    if (this._layout === val) return;
    if (this._layout) {
      (this._layout as any)._diagram = null;
    }
    this._layout = val;
    if (val) {
      (val as any)._diagram = this;
      this._layoutInvalid = true;
      this.requestUpdate();
    }
  }

  get isInitial(): boolean {
    return this._isInitial;
  }

  set isInitial(val: boolean) {
    this._isInitial = val;
  }

  private _initialContentAlignment: Spot | null = Spot.Default;
  private _initialAutoScale: EnumValue | null = null;
  private _initialPosition: Point | null = null;
  private _initialScale: number = NaN;
  private _contentAlignment: Spot = Spot.Default;
  protected _autoScale: EnumValue | null = null;
  private _hasPerformedInitialLayout: boolean = false;

  get initialContentAlignment(): Spot | null { return this._initialContentAlignment; }
  set initialContentAlignment(val: Spot | null) { this._initialContentAlignment = val; }

  get initialAutoScale(): EnumValue | null { return this._initialAutoScale; }
  set initialAutoScale(val: EnumValue | null) { this._initialAutoScale = val; }

  get initialPosition(): Point | null { return this._initialPosition; }
  set initialPosition(val: Point | null) { this._initialPosition = val; }

  get initialScale(): number { return this._initialScale; }
  set initialScale(val: number) { this._initialScale = val; }

  get contentAlignment(): Spot { return this._contentAlignment; }
  set contentAlignment(val: Spot) { this._contentAlignment = val; }

  get autoScale(): EnumValue | null { return this._autoScale; }
  set autoScale(val: EnumValue | null) { this._autoScale = val; }

  // ============ Layer Management ============

  get layers(): Iterator<Layer> {
    return new List<Layer>(this._layers).iterator;
  }

  addLayer(layer: Layer): void {
    layer.diagram = this;
    this._layers.push(layer);
    this.requestUpdate();
  }

  removeLayer(layer: Layer): void {
    const idx = this._layers.indexOf(layer);
    if (idx >= 0) {
      this._layers.splice(idx, 1);
      layer.diagram = null;
      this.requestUpdate();
    }
  }

  findLayer(name: string): Layer | null {
    for (const layer of this._layers) {
      if (layer.name === name) return layer;
    }
    return null;
  }

  // ============ Part Management ============

  /** 官方 `Diagram.add(part): this`：加入默认层，invalidateDocumentBounds + part.invalidateLayout(1)，返回 this */
  add(part: Part): this {
    const layerName = part.layerName || '';
    let layer = this.findLayer(layerName);
    if (!layer) layer = this.findLayer('');
    if (!layer) {
      for (const l of this._layers) {
        if (!l.isTemporary && l.name !== 'Background') {
          layer = l;
          break;
        }
      }
    }
    if (!layer && this._layers.length > 0) {
      layer = this._layers[0];
    }
    if (layer) {
      layer.add(part);
    }
    (part as any)._diagram = this;
    // 无数据部件也进入 _parts（官方 parts/nodes/links 含手动 add 的部件）；键用部件自身避免 null 键冲突
    if (part.data !== null && part.data !== undefined) {
      this._parts.set(part.data, part);
    } else {
      this._parts.set(part, part);
    }
    // 官方 Layer.Na：无数据部件在 add 时应用绑定（t.data || t.Zo()，Zo 只处理 theme 绑定）
    if (part.data === null || part.data === undefined) {
      part.updateTargetBindings();
    }
    this._layoutInvalid = true;
    this.requestUpdate();
    return this;
  }

  remove(part: Part): void {
    for (const layer of this._layers) {
      if (layer.contains(part)) {
        layer.remove(part);
        (part as any)._diagram = null;
        if (part.data !== null && part.data !== undefined) {
          if (this._parts.get(part.data) === part) this._parts.delete(part.data);
        } else {
          this._parts.delete(part);
        }
        if (part.isSelected) {
          this._selection.remove(part);
        }
        this.requestUpdate();
        return;
      }
    }
  }

  findNodeForKey(key: any): Node | null {
    return this._nodeKeyMap.get(key) || null;
  }

  findLinkForData(data: ObjectData): Link | null {
    const part = this._parts.get(data);
    if (part instanceof Link) return part;
    return null;
  }

  findPartForKey(key: any): Part | null {
    const node = this._nodeKeyMap.get(key);
    if (node) return node;
    if (this._model instanceof GraphLinksModel) {
      const linkData = (this._model as GraphLinksModel).findLinkDataForKey(key);
      if (linkData) {
        const part = this._parts.get(linkData);
        if (part) return part;
      }
    }
    return null;
  }

  findNodesByExample(data: any): List<Node> {
    const result = new List<Node>();
    if (!data) return result;
    const keys = Object.keys(data);
    const it = this._parts.iteratorValues;
    while (it.next()) {
      const part = it.value;
      if (!(part instanceof Node)) continue;
      const d = part.data;
      if (!d) continue;
      let match = true;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (d[key] !== data[key]) {
          match = false;
          break;
        }
      }
      if (match) result.add(part);
    }
    return result;
  }

  findLinksByExample(data: any): List<Link> {
    const result = new List<Link>();
    if (!data) return result;
    const keys = Object.keys(data);
    const it = this._parts.iteratorValues;
    while (it.next()) {
      const part = it.value;
      if (!(part instanceof Link)) continue;
      const d = part.data;
      if (!d) continue;
      let match = true;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (d[key] !== data[key]) {
          match = false;
          break;
        }
      }
      if (match) result.add(part);
    }
    return result;
  }

  findPartAt(point: Point, selectableOnly: boolean = false): Part | null {
    for (let i = this._layers.length - 1; i >= 0; i--) {
      const layer = this._layers[i];
      if (!layer.visible) continue;
      if (layer.isTemporary) continue;
      const partsIt = layer.parts;
      const partsArray = iteratorToArray(partsIt);
      for (let j = partsArray.length - 1; j >= 0; j--) {
        const part: Part = partsArray[j];
        if (!part.visible) continue;
        if (selectableOnly && !part.selectable) continue;
        const bounds = part.getDocumentBounds();
        if (bounds.containsPoint(point)) {
          return part;
        }
      }
    }
    return null;
  }

  findObjectAt(point: Point): GraphObject | null {
    const part = this.findPartAt(point);
    if (part) {
      const loc = part.location;
      const localPoint = new Point(point.x - loc.x, point.y - loc.y);
      return this._findObjectInPanel(part, localPoint);
    }
    return null;
  }

  findNodeAt(point: Point): Node | null {
    const part = this.findPartAt(point);
    if (part instanceof Node) return part;
    return null;
  }

  // ============ Selection Methods ============

  select(part: Part | null): void {
    this.clearSelection();
    if (part && this._allowSelect && part.selectable) {
      part.isSelected = true;
      this._selection.add(part);
    }
  }

  clearSelection(): void {
    const hadSelection = this._selection.count > 0;
    const it = this._selection.iterator;
    const parts: Part[] = [];
    while (it.next()) {
      const part = it.value;
      (part as any)._isSelected = false;
      parts.push(part);
    }
    this._selection.clear();
    for (const part of parts) {
      const ad = part.getAdornment('Selection');
      if (ad) {
        const adornmentLayer = this.findLayer('Adornment');
        if (adornmentLayer) adornmentLayer.remove(ad);
        part.removeAdornment('Selection');
      }
      if (this._toolManager) {
        this._toolManager.updateAdornments(part);
      }
    }
    if (hadSelection) {
      this.raiseDiagramEvent('ChangedSelection', this._selection);
    }
  }

  selectCollection(parts: GojsIterable<Part>): void {
    this.clearSelection();
    if (!this._allowSelect) return;
    const it = parts.iterator;
    while (it.next()) {
      const part = it.value;
      if (part.selectable && this._selection.count < this._maxSelectionCount) {
        (part as any)._isSelected = true;
        this._selection.add(part);
        if (part.selectionAdorned) {
          const ad = part._createSelectionAdornment();
          part.addAdornment('Selection', ad);
          const adornmentLayer = this.findLayer('Adornment');
          if (adornmentLayer) adornmentLayer.add(ad);
        }
        if (this._toolManager) {
          this._toolManager.updateAdornments(part);
        }
      }
    }
    if (this._selection.count > 0) {
      this.raiseDiagramEvent('ChangedSelection', this._selection);
    }
  }

  // ============ Transaction Methods ============

  startTransaction(tname: string = ''): boolean {
    return this._model.startTransaction(tname);
  }

  commitTransaction(tname: string = ''): boolean {
    return this._model.commitTransaction(tname);
  }

  rollbackTransaction(): boolean {
    return this._model.rollbackTransaction();
  }

  /** 官方 `Diagram.commit(commitFunc, tname?)`：func 收到 diagram 本体；事务交给 model 处理 */
  commit(func: (d?: any) => any, tname: string = 'commit'): any {
    return this._model.commit(() => func(this), tname);
  }

  // ============ Event Methods ============

  addDiagramListener(name: string, listener: Function): void {
    let listeners = this._diagramListeners.get(name);
    if (!listeners) {
      listeners = [];
      this._diagramListeners.set(name, listeners);
    }
    listeners.push(listener);
  }

  removeDiagramListener(name: string, listener: Function): void {
    const listeners = this._diagramListeners.get(name);
    if (listeners) {
      const idx = listeners.indexOf(listener);
      if (idx >= 0) listeners.splice(idx, 1);
    }
  }

  addChangedListener(listener: Function): void {
    this._changedListeners.push(listener);
  }

  removeChangedListener(listener: Function): void {
    const idx = this._changedListeners.indexOf(listener);
    if (idx >= 0) this._changedListeners.splice(idx, 1);
  }

  // ============ Coordinate Conversion ============

  transformDocToView(p: Point): Point {
    return new Point(
      (p.x - this._position.x) * this._scale + this._padding.left,
      (p.y - this._position.y) * this._scale + this._padding.top
    );
  }

  transformViewToDoc(p: Point): Point {
    return new Point(
      (p.x - this._padding.left) / this._scale + this._position.x,
      (p.y - this._padding.top) / this._scale + this._position.y
    );
  }

  // ============ Update Methods ============

  requestUpdate(invalidate: boolean = true): void {
    if (!this._needsRender) {
      this._needsRender = true;
      this._animationFrameId = requestAnimationFrame(() => this._renderLoop());
    }
  }

  layoutDiagram(invalidate: boolean = true): void {
    if (invalidate) {
      this._layoutInvalid = true;
    }
    this._performLayout();
    this._layoutInvalid = false;
    this.requestUpdate(invalidate);
  }

  updateAllTargetBindings(propname?: string): void {
    const it = this._parts.iteratorValues;
    while (it.next()) {
      const part = it.value;
      if (part instanceof Part) {
        this._updateBindingsForPart(part, propname);
      }
    }
    this.requestUpdate();
  }

  /**
   * 官方 zoomToFit → Td(2)：min(view/doc)，**不超过 defaultScale（通常 1.0）**，
   * 再 alignDocument(Center, Center) 居中。
   */
  zoomToFit(): void {
    const db = this.documentBounds;
    const vs = this.viewSize;
    if (db.width <= 0 || db.height <= 0 || vs.width <= 0 || vs.height <= 0) return;

    let newScale = Math.min(vs.width / db.width, vs.height / db.height);
    const def = this.defaultScale;
    if (newScale > def) newScale = def;
    if (newScale < this._minScale) newScale = this._minScale;
    if (newScale > this._maxScale) newScale = this._maxScale;
    this._scale = newScale;
    this.alignDocument(Spot.Center, Spot.Center);
    this._raiseDiagramEvent('ViewportChanged');
    this.requestUpdate();
  }

  centerRect(r: Rect): void {
    const vs = this.viewSize;
    const docW = vs.width / this._scale;
    const docH = vs.height / this._scale;
    this._position = new Point(
      r.x + r.width / 2 - docW / 2,
      r.y + r.height / 2 - docH / 2
    );
    this.requestUpdate();
  }

  scrollToRect(r: Rect): void {
    const vb = this.viewportBounds;
    let newX = this._position.x;
    let newY = this._position.y;

    if (r.x < vb.x) newX = r.x;
    else if (r.right > vb.right) newX = r.right - vb.width;

    if (r.y < vb.y) newY = r.y;
    else if (r.bottom > vb.bottom) newY = r.bottom - vb.height;

    this._position = new Point(newX, newY);
    this.requestUpdate();
  }

  alignDocument(docSpot: Spot, viewSpot: Spot): void {
    // 实测：官方 alignDocument 源码虽然写的是 viewportBounds，但它的调用点之后
    // 紧跟着再跑一次 H2（zoomToFit 等），我们没有那一步；直接照抄官方公式会让
    // animatedFocus 92.7→97.3、grouping 2.43→4.34。这里保持 viewSize 口径。
    const db = this.documentBounds;
    const vs = this.viewSize;
    const docPoint = docSpot.positionInRect(db);
    const viewPoint = viewSpot.positionInRect(new Rect(0, 0, vs.width, vs.height));
    this._position = new Point(
      docPoint.x - viewPoint.x / this._scale,
      docPoint.y - viewPoint.y / this._scale
    );
    this.requestUpdate();
  }

  // ============ Rebuild Parts ============

  rebuildParts(): void {
    this._clearAllParts();

    const model = this._model;
    if (!model) return;

    for (const nodeData of model.nodeDataArray) {
      this._addNodeForData(nodeData);
    }

    for (const nodeData of model.nodeDataArray) {
      const groupKey = model.getGroupKeyForNodeData(nodeData);
      if (groupKey !== undefined && groupKey !== null) {
        const node = this._nodeKeyMap.get(model.getKeyForNodeData(nodeData));
        const groupNode = this._nodeKeyMap.get(groupKey);
        if (node && groupNode && (groupNode as any)._memberParts !== undefined) {
          node.containingGroup = groupNode;
        }
      }
    }

    if (model instanceof GraphLinksModel) {
      const glm = model as GraphLinksModel;
      for (const linkData of glm.linkDataArray) {
        this._addLinkForData(linkData);
      }
    } else if (model instanceof TreeModel) {
      const tm = model as TreeModel;
      for (const nodeData of model.nodeDataArray) {
        const parentKey = tm.getParentKeyForNodeData(nodeData);
        if (parentKey !== undefined && parentKey !== null) {
          this._addLinkForTreeData(nodeData, parentKey);
        }
      }
    }

    // 链接创建后再对所有 Part 重跑 bindings（如 counter 的 visible/count 依赖 findLinksOutOf）
    for (const nodeData of model.nodeDataArray) {
      const node = this._nodeKeyMap.get(model.getKeyForNodeData(nodeData));
      if (node) node.updateTargetBindings();
    }
    try {
      const it = this.links;
      if (it) {
        while (it.next()) it.value.updateTargetBindings();
      }
    } catch (e) { /* links 迭代不可用时忽略 */ }

     this._layoutInvalid = true;
    this.requestUpdate();
  }

  // ============ Factory Method ============

  static GraphObject = {
    make: function(type: any, ...args: any[]): any {
      return GraphObject.make(type, ...args);
    }
  };

  static fromDiv(id: string): Diagram | null {
    const div = document.getElementById(id);
    if (div && (div as any)._goDiagram) {
      return (div as any)._goDiagram;
    }
    return null;
  }

  // ============ Batch set ============

  set(props: Partial<Diagram>): this {
    for (const key in props) {
      if (key === 'div') continue;
      if (key.indexOf('.') >= 0) {
        const parts = key.split('.');
        let target: any = this;
        for (let j = 0; j < parts.length - 1; j++) {
          target = target[parts[j]];
          if (!target) break;
        }
        if (target) {
          target[parts[parts.length - 1]] = (props as any)[key];
        }
      } else if (key === DiagramEventModelChanged) {
        // 官方 setProperties：`{ ModelChanged: fn }` 等价于 addModelChangedListener(fn)
        const fn = (props as any)[key];
        if (typeof fn === 'function') this.addModelChangedListener(fn);
      } else if (key === DiagramEventChanged) {
        // 官方 setProperties：`{ Changed: fn }` 等价于 addChangedListener(fn)
        const fn = (props as any)[key];
        if (typeof fn === 'function') this.addChangedListener(fn);
      } else if (isDiagramEventName(key)) {
        // 官方 G0：`new Diagram(div, { LayoutCompleted: fn, ... })` 这类事件名
        // 不是普通属性，而是转成 addDiagramListener 注册（官方 setProperties 同款）
        const fn = (props as any)[key];
        if (typeof fn === 'function') this.addDiagramListener(key, fn);
      } else if ((this as any)[key] !== undefined) {
        (this as any)[key] = (props as any)[key];
      }
    }
    return this;
  }

  focus(): void {
    if (this._div) {
      this._div.focus();
    }
  }

  // ============ Internal Methods ============

  private _createDefaultLayers(): void {
    // 官方 FL()：Grid 最先（网格画在最底层），Grid/Viewport*/Adornment 为 temporary
    const specs: Array<[string, boolean, boolean, boolean]> = [
      // [name, isTemporary, isViewportAligned, isInDocumentBounds]
      ['Grid', true, false, false],
      ['ViewportBackground', true, true, false],
      ['Background', false, false, true],
      ['', false, false, true],
      ['Foreground', false, false, true],
      ['ViewportForeground', true, true, false],
      ['Adornment', true, false, false],
      ['Tool', true, false, true],
    ];
    for (const [name, isTemporary, isViewportAligned, inDoc] of specs) {
      const layer = new Layer();
      layer.name = name;
      layer.diagram = this;
      layer.isTemporary = isTemporary;
      layer.isViewportAligned = isViewportAligned;
      layer.isInDocumentBounds = inDoc;
      if (name === 'Grid') {
        layer.allowSelect = false;
        layer.pickable = false;
      }
      this._layers.push(layer);
    }

    this._createDefaultGrid();
  }

  /** 官方 Diagram.XL()：默认 6 根网格线（1/5/10 间隔），面板默认不可见、Part 可见 */
  private _createDefaultGrid(): void {
    const mkLine = (figure: string, stroke: string, strokeWidth: number, interval: number, themeKey?: string): Shape => {
      const s = new Shape();
      s.figure = figure;
      s.stroke = stroke;
      s.strokeWidth = strokeWidth;
      s.interval = interval;
      if (themeKey) s.theme('stroke', themeKey);
      return s;
    };
    const gridPanel = new Panel(PanelGrid);
    gridPanel.name = 'GRID';
    gridPanel.add(
      mkLine('LineH', 'lightgray', 0.5, 1, 'gridMinor'),
      mkLine('LineV', 'lightgray', 0.5, 1, 'gridMinor'),
      mkLine('LineH', 'gray', 0.5, 5, 'gridMajor'),
      mkLine('LineV', 'gray', 0.5, 5, 'gridMajor'),
      mkLine('LineH', 'gray', 1, 10, 'gridMajor'),
      mkLine('LineV', 'gray', 1, 10, 'gridMajor'),
    );
    gridPanel.visible = false;

    const gridPart = new Part();
    gridPart.layerName = 'Grid';
    gridPart.zOrder = 0;
    gridPart.isInDocumentBounds = false;
    gridPart.isAnimated = false;
    gridPart.pickable = false;
    gridPart.locationObjectName = 'GRID';
    gridPart.add(gridPanel);

    // 官方 XL：this.add(part) 再从 parts 集合里删除（diagram.parts 不含网格部件）
    this.add(gridPart);
    this._parts.delete(gridPart);

    this._gridPart = gridPart;
    this._gridPanel = gridPanel;
  }

  get grid(): any {
    if (this._gridPanel === null) this._createDefaultGrid();
    return this._gridPanel;
  }

  set grid(val: any) {
    // 官方 set grid：同一个 GRID Part 换面板（不重建 Part），panel.name = "GRID"
    if (!(val instanceof Panel) || val.type !== (Panel as any).Grid) {
      console.warn('Diagram.grid must be a Panel of type Panel.Grid');
      return;
    }
    const part = this._gridPart;
    if (part === null) {
      this._createDefaultGrid();
    }
    const p = this._gridPart as Part;
    const old = this._gridPanel;
    if (old === val) return;
    if (old !== null) p.remove(old);
    this._gridPanel = val;
    val.name = 'GRID';
    p.add(val);
    this.requestUpdate();
    this.raiseChangedEvent(ChangedEventProperty, 'grid', this, old, val);
  }

  /**
   * 官方 Diagram.eC(t?)：按视口重设 grid 面板尺寸并把 GRID Part 吸附到网格。
   * Cf（lcm 周期 × cellSize）来自 Panel._updateGridSettings；
   * 面板尺寸 = 视口 + 2×Cf（四周留出一整个周期，平移视口时线相位保持不变）。
   */
  private _updateGridBounds(): void {
    const panel = this._gridPanel;
    if (panel === null || !panel.visible) return;
    const part: any = panel.part;
    if (part === null || part === undefined || part.layer === null) return;
    const vp = this.viewportBounds;
    if (!vp.isReal()) return;
    panel._updateGridSettings();
    const cf = panel._gridCf;
    if (cf === null || !cf.isReal()) return;

    if (part.layer.isViewportAligned) {
      panel.width = vp.width * this._scale;
      panel.height = vp.height * this._scale;
      part.alignment = Spot.TopLeft;
    } else {
      const w = vp.width + cf.width * 2;
      const h = vp.height + cf.height * 2;
      if (panel.desiredSize.width !== w || panel.desiredSize.height !== h) {
        // 直接写 desiredSize：官方 width setter 的失效冒泡到我们这里会触发整图 layout，
        // 而 eC 随后立即 ensureBounds 重测，语义等价且无副作用
        (panel as any)._desiredSize = new Size(w, h);
      }
      const loc = new Point(vp.x, vp.y);
      loc.snapToGrid(0, 0, cf.width, cf.height);
      loc.x -= cf.width;
      loc.y -= cf.height;
      part.location = loc;
    }
    part.ensureBounds();
    const pos = part.position;
    const mb = part.measuredBounds;
    part._arrange(new Rect(pos.x, pos.y, mb.width, mb.height));
    if (typeof part.syncPositionFromLocation === 'function') part.syncPositionFromLocation();
  }

  private _createDefaultNodeTemplate(): Part {
    const node = new Node(PanelAuto);
    const shape = new Shape();
    shape.figure = 'Rectangle';
    shape.fill = 'red';
    shape.stroke = 'black';
    shape.width = 40;
    shape.height = 40;
    node.add(shape);
    return node;
  }

  private _createDefaultLinkTemplate(): Part {
    const link = new Link();
    const shape = new Shape();
    shape.stroke = 'black';
    shape.strokeWidth = 1;
    shape.isPanelMain = true;
    link.add(shape);
    const arrow = new Shape();
    arrow.toArrow = 'Standard';
    arrow.fill = 'black';
    arrow.stroke = null;
    link.add(arrow);
    return link;
  }

  private _clearAllParts(): void {
    // 官方 PartManager.rebuildParts 只移除有 data 的部件；无数据部件（如 diagram.grid 的 Part）保留
    for (const layer of this._layers) {
      const toRemove: Part[] = [];
      const it = layer.parts;
      while (it.next()) {
        const part = it.value;
        if (part && part.data !== null && part.data !== undefined) toRemove.push(part);
      }
      for (const part of toRemove) layer.remove(part);
    }
    const dataKeys: Part[] = [];
    const pit = this._parts.iterator;
    while (pit.next()) {
      const k = pit.key, v = pit.value;
      if (k !== v) dataKeys.push(v);
    }
    for (const part of dataKeys) {
      this._parts.remove(part.data);
      (part as any)._diagram = null;
      if (part.isSelected) this._selection.remove(part);
    }
    this._nodeKeyMap.clear();
    this._treeLinkDataByChildKey.clear();
    this._selection.clear();
  }

  private _addNodeForData(data: ObjectData): Node | null {
    if (!data) return null;
    const category = this._model.getCategoryForNodeData(data);
    const isGroup = this._model.isGroupForNodeData(data);
    let template: Part | null = null;

    if (isGroup) {
      if (category && this._groupTemplateMap.has(category)) {
        template = this._groupTemplateMap.get(category)!;
      } else if (this._groupTemplate) {
        template = this._groupTemplate;
      } else if (this._nodeTemplateMap.has(category || '')) {
        template = this._nodeTemplateMap.get(category || '')!;
      } else {
        template = this._nodeTemplate;
      }
    } else {
      // 官方 PartManager：nodeTemplateMap.get(category) → get('') → 内置默认。
      // 以前 category 为空串/undefined 时直接掉到 this._nodeTemplate（无）→ 内置
      // “红方块 40x40”，flowchart 这种 add('', template) 注册默认分类的样例全错。
      const cat = category || '';
      template = this._nodeTemplateMap.get(cat) ?? null;
      if (!template && cat !== '') template = this._nodeTemplateMap.get('') ?? null;
      if (!template) template = this._nodeTemplate;
    }

    const node = template!.copy() as Node;
    node.data = data;
    // 官方 PartManager._addPartForData：s.sr = e（把数据的 category 落到 part.category 上）
    node.category = category || '';

    const locX = data['loc'] !== undefined ? parseFloat(String(data['loc']).split(' ')[0]) : NaN;
    const locY = data['loc'] !== undefined ? parseFloat(String(data['loc']).split(' ')[1]) : NaN;
    if (!isNaN(locX) && !isNaN(locY)) {
      node.location = new Point(locX, locY);
    }

    const key = this._model.getKeyForNodeData(data);
    if (key !== undefined) {
      this._nodeKeyMap.set(key, node);
    }

    this._parts.set(data, node);

    this.add(node);

    this._propagatePartToChildren(node);

    this._applyBindings(node, data);

    return node;
  }

  private _propagatePartToChildren(part: Part): void {
    const setPart = (obj: GraphObject) => {
      (obj as any)._part = part;
      if (obj instanceof Panel) {
        for (const child of (obj as Panel)._elements) {
          setPart(child);
        }
      }
    };
    setPart(part);
  }

  private _addLinkForData(data: ObjectData): Link | null {
    if (!data) return null;
    const model = this._model as GraphLinksModel;
    const category = model.getCategoryForLinkData(data);
    let template: Part | null = null;

    if (category && this._linkTemplateMap.has(category)) {
      template = this._linkTemplateMap.get(category)!;
    } else {
      template = this._linkTemplate;
    }

    const link = template!.copy() as Link;
    link.data = data;
    link.category = category || '';

    const fromKey = model.getFromKeyForLinkData(data);
    const toKey = model.getToKeyForLinkData(data);
    if (fromKey !== undefined) {
      link.fromNode = this._nodeKeyMap.get(fromKey) || null;
    }
    if (toKey !== undefined) {
      link.toNode = this._nodeKeyMap.get(toKey) || null;
    }

    this._parts.set(data, link);

    this.add(link);

    this._propagatePartToChildren(link);

    this._applyBindings(link, data);

    const fn = link.fromNode;
    const tn = link.toNode;
    if (fn) fn.updateTargetBindings();
    if (tn) tn.updateTargetBindings();

    return link;
  }

  private _addLinkForTreeData(childData: ObjectData, parentKey: any): Link | null {
    const parentNode = this._nodeKeyMap.get(parentKey);
    const childKey = this._model.getKeyForNodeData(childData);
    const childNode = childKey !== undefined ? this._nodeKeyMap.get(childKey) : null;

    if (!parentNode || !childNode) return null;

    const category = this._model.getCategoryForNodeData(childData);
    let template: Part | null = null;
    if (category && this._linkTemplateMap.has(category)) {
      template = this._linkTemplateMap.get(category)!;
    } else {
      template = this._linkTemplate;
    }

    const link = template!.copy() as Link;
    const linkData: ObjectData = {
      from: parentKey,
      to: childKey
    };
    link.data = linkData;
    link.fromNode = parentNode;
    link.toNode = childNode;

    if (childKey !== undefined) {
      this._treeLinkDataByChildKey.set(childKey, linkData);
    }

    this._parts.set(linkData, link);

    this.add(link);

    this._propagatePartToChildren(link);

    this._applyBindings(link, linkData);

    parentNode.updateTargetBindings();
    childNode.updateTargetBindings();

    return link;
  }

  private _removeNodeForData(data: ObjectData): void {
    const part = this._parts.get(data);
    if (part) {
      if (part instanceof Node) {
        this._removeLinksForNode(part);
      }
      const key = this._model.getKeyForNodeData(data);
      if (key !== undefined) {
        this._nodeKeyMap.remove(key);
        const linkData = this._treeLinkDataByChildKey.get(key);
        if (linkData) {
          this._treeLinkDataByChildKey.remove(key);
          const treeLink = this._parts.get(linkData);
          if (treeLink) {
            this._parts.remove(linkData);
            this.remove(treeLink);
          }
        }
      }
      this._parts.remove(data);
      this.remove(part);
    }
  }

  private _removeLinksForNode(node: Node): void {
    const linksToRemove: Link[] = [];
    for (const layer of this._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link) {
          if (part.fromNode === node || part.toNode === node) {
            linksToRemove.push(part);
          }
        }
      }
    }
    for (const link of linksToRemove) {
      const data = link.data;
      if (data) {
        this._parts.remove(data);
        if (data.to !== undefined) {
          this._treeLinkDataByChildKey.remove(data.to);
        }
      }
      this.remove(link);
    }
  }

  private _removeLinkForData(data: ObjectData): void {
    const part = this._parts.get(data);
    if (part) {
      this._parts.remove(data);
      this.remove(part);
    }
  }

  /**
   * 官方 `Binding.updateTarget`（`node_modules/gojs/release/go.js` 840959）把
   * 「取源值 + 调 converter + 写目标属性」整段包在 `try { ... } catch {}` 里，
   * 任何求值异常都被**静默吞掉**（既不中断布局，也不传播到 init）。
   * 之前本项目不 catch，样例里 `Brush.lightenBy(color)` 这类未定义全局
   * 直接把整个 init 打断（实测 industrialDiagram 只渲染出 1/19 个节点）。
   */
  private _resolveBindingValue(binding: Binding, obj: GraphObject, data: ObjectData, part: Part): any {
    try {
      return this._resolveBindingValueCore(binding, obj, data, part);
    } catch {
      return undefined;
    }
  }

  private _resolveBindingValueCore(binding: Binding, obj: GraphObject, data: ObjectData, part: Part): any {
    void part;
    // 统一走 Binding.getValueFromSource —— 主题/对象/数据/模型四种源的官方语义都在里面
    return binding.getValueFromSource(data, obj, this._model);
  }

  private _applyBindings(part: Part, data: ObjectData): void {
    this._applyBindingsToObject(part, data, part);
  }

  /**
   * 官方 Model.ft：把目标属性写入包 try/catch，失败仅 console.log（U.et），
   * 例如数据 width: null → Size(null, NaN) 抛错时保持原值。
   */
  private _setBoundProperty(obj: GraphObject, prop: string, val: any): void {
    try {
      (obj as any)[prop] = val;
    } catch (err: any) {
      if (typeof console !== 'undefined' && console.log) {
        console.log('property set error: ' + (err && err.toString ? err.toString() : String(err)));
      }
    }
  }

  private _applyBindingsToObject(obj: GraphObject, data: ObjectData, part: Part): void {
    const bindings: Binding[] = (obj as any)._bindings;
    if (bindings && bindings.length > 0) {
      for (const binding of bindings) {
        const val = this._resolveBindingValue(binding, obj, data, part);
        if (val !== undefined) {
          this._setBoundProperty(obj, binding.targetProperty, val);
        }
      }
    }
    if (obj instanceof Panel) {
      const elements = (obj as Panel)._elements;
      for (const child of elements) {
        const childData = (child as any)._data;
        this._applyBindingsToObject(
          child,
          childData !== null && childData !== undefined ? childData : data,
          part,
        );
      }
    }
  }

  private _updateBindingsForPart(part: Part, propname?: string): void {
    const data = (part as any).data;
    if (!data) {
      // 官方 Layer.Na：无数据部件仅应用 theme 绑定（t.data || t.Zo()）
      this._applyThemeBindingsOnly(part, part);
      return;
    }
    this._updateBindingsForObject(part, data, propname, part);
  }

  /** 官方 GraphObject.Zo：只应用 isToTheme 绑定，递归子对象 */
  private _applyThemeBindingsOnly(obj: GraphObject, part: Part): void {
    const bindings: Binding[] = (obj as any)._bindings;
    if (bindings && bindings.length > 0) {
      for (const binding of bindings) {
        if (!binding.isToTheme) continue;
        const val = this._resolveBindingValue(binding, obj, null as any, part);
        if (val !== undefined) {
          this._setBoundProperty(obj, binding.targetProperty, val);
        }
      }
    }
    if (obj instanceof Panel) {
      const elements = (obj as Panel)._elements;
      for (const child of elements) {
        this._applyThemeBindingsOnly(child, part);
      }
    }
  }

  private _updateBindingsForObject(obj: GraphObject, data: ObjectData, propname?: string, part?: Part): void {
    const bindings: Binding[] = (obj as any)._bindings;
    if (bindings && bindings.length > 0) {
      for (const binding of bindings) {
        if (binding.sourceObject !== null || propname === undefined || propname === binding.sourceProperty) {
          const val = this._resolveBindingValue(binding, obj, data, part!);
          if (val !== undefined) {
            this._setBoundProperty(obj, binding.targetProperty, val);
          }
        }
      }
    }
    if (obj instanceof Panel) {
      const elements = (obj as Panel)._elements;
      for (const child of elements) {
        const childData = (child as any)._data;
        this._updateBindingsForObject(
          child,
          childData !== null && childData !== undefined ? childData : data,
          propname,
          part,
        );
      }
    }
  }

  _handlePartPropertyChanged(part: Part, obj: GraphObject, propname: string, value?: any): void {
    const data = (part as any).data;
    if (!data) return;
    const bindings: Binding[] = (obj as any)._bindings;
    if (!bindings || bindings.length === 0) return;
    for (const binding of bindings) {
      if (binding.isTwoWay && binding.targetProperty === propname) {
        const targetValue = value !== undefined ? value : (obj as any)[binding.targetProperty];
        const sourceValue = binding.getValueFromTarget(targetValue, data, this._model);
        if (binding.isFromModel) {
          this._model.setModelData(binding.sourceProperty, sourceValue);
        } else if (binding.sourceObject === null) {
          this._model.setDataProperty(data, binding.sourceProperty, sourceValue);
        } else if (binding.sourceObject !== null) {
          let sourceObj: GraphObject | null = null;
          if (binding.sourceObject === '') {
            sourceObj = part as any;
          } else {
            sourceObj = part.findObject(binding.sourceObject);
          }
          if (sourceObj) {
            (sourceObj as any)[binding.sourceProperty] = sourceValue;
          }
        }
      }
    }
  }

  private _onModelChanged(e: ChangedEvent): void {
    if (e.isTransactionChange) {
      this._raiseChangedEvent(e);
      return;
    }

    if (e.isModelChange) {
      let needsLayout = false;
      if (e.isInsertChange && e.propertyName === 'nodeDataArray') {
        const data = e.newValue;
        if (data) {
          const node = this._addNodeForData(data);
          if (node) {
            const groupKey = this._model.getGroupKeyForNodeData(data);
            if (groupKey !== undefined && groupKey !== null) {
              const groupNode = this._nodeKeyMap.get(groupKey);
              if (groupNode && (groupNode as any)._memberParts !== undefined) {
                node.containingGroup = groupNode;
              }
            }
          }
          if (this._model instanceof TreeModel) {
            const parentKey = (this._model as TreeModel).getParentKeyForNodeData(data);
            if (parentKey !== undefined && parentKey !== null) {
              this._addLinkForTreeData(data, parentKey);
            }
          }
          needsLayout = true;
        }
      } else if (e.isRemoveChange && e.propertyName === 'nodeDataArray') {
        const data = e.oldValue;
        if (data) {
          this._removeNodeForData(data);
          needsLayout = true;
        }
      } else if (e.isInsertChange && e.propertyName === 'linkDataArray') {
        const data = e.newValue;
        if (data) {
          this._addLinkForData(data);
          needsLayout = true;
        }
      } else if (e.isRemoveChange && e.propertyName === 'linkDataArray') {
        const data = e.oldValue;
        if (data) {
          this._removeLinkForData(data);
          needsLayout = true;
        }
      } else if (e.isPropertyChange) {
        const data = e.object;
        if (data && data instanceof Model) {
          // 官方：Set 变更 modelChange==="nodeDataArray"/"linkDataArray" → kA(old) + xw(new)
          if (e.propertyName === 'nodeDataArray') {
            const oldArr: ObjectData[] = Array.isArray(e.oldValue) ? e.oldValue : [];
            const newArr: ObjectData[] = Array.isArray(e.newValue) ? e.newValue : [];
            for (const d of oldArr) {
              if (newArr.indexOf(d) < 0) this._removeNodeForData(d);
            }
            for (const d of newArr) {
              if (oldArr.indexOf(d) < 0) this._addNodeForData(d);
            }
            needsLayout = true;
            this.requestUpdate();
          } else if (e.propertyName === 'linkDataArray') {
            const oldArr: ObjectData[] = Array.isArray(e.oldValue) ? e.oldValue : [];
            const newArr: ObjectData[] = Array.isArray(e.newValue) ? e.newValue : [];
            for (const d of oldArr) {
              if (newArr.indexOf(d) < 0) this._removeLinkForData(d);
            }
            for (const d of newArr) {
              if (oldArr.indexOf(d) < 0) this._addLinkForData(d);
            }
            needsLayout = true;
            this.requestUpdate();
          } else {
            this.updateAllTargetBindings();
          }
        } else if (data) {
          const part = this._parts.get(data);
          if (part) {
            this._updateBindingsForPart(part, e.propertyName);
            if (e.propertyName === this._model.nodeKeyProperty && part instanceof Node) {
              this._nodeKeyMap.remove(e.oldValue);
              this._nodeKeyMap.set(e.newValue, part);
            }
            if (e.propertyName === this._model.nodeGroupKeyProperty && part instanceof Node) {
              const newGroupKey = e.newValue;
              if (newGroupKey !== undefined && newGroupKey !== null) {
                const groupNode = this._nodeKeyMap.get(newGroupKey);
                if (groupNode && (groupNode as any)._memberParts !== undefined) {
                  part.containingGroup = groupNode;
                }
              } else {
                part.containingGroup = null;
              }
              needsLayout = true;
            }
            if (part instanceof Link && this._model instanceof GraphLinksModel) {
              const glm = this._model as GraphLinksModel;
              if (e.propertyName === glm.linkFromKeyProperty) {
                part.fromNode = this._nodeKeyMap.get(e.newValue) || null;
                needsLayout = true;
              } else if (e.propertyName === glm.linkToKeyProperty) {
                part.toNode = this._nodeKeyMap.get(e.newValue) || null;
                needsLayout = true;
              }
            }
            if (this._model instanceof TreeModel) {
              const tm = this._model as TreeModel;
              if (e.propertyName === tm.nodeParentKeyProperty && part instanceof Node) {
                this._rebuildTreeLinks();
                needsLayout = true;
              }
            }
            this.requestUpdate();
          }
        }
      }
      // 官方 Diagram.Ib(false)：模型/绑定/数据属性变更 → 护栏式失效布局
      // （isOngoing/isInitial + undo/动画 tick 护栏在 Layout.invalidateLayout 内），
      // 并同步各 Group 布局（官方 Ib→oD 遍历）。早先靠 Part._invalidateMeasure
      // 冒泡实现同样效果，但那会让 link 路线失效也触发重排（gantt 死循环元凶之一）。
      this._invalidateLayoutsFromChanges();
      if (needsLayout) {
        this._layoutInvalid = true;
        this.requestUpdate();
      }
    }

    this._raiseChangedEvent(e);
  }

  /** 官方 Diagram.Ib(t) 的护栏版：Diagram.layout + 全体 Group.layout 失效 */
  private _invalidateLayoutsFromChanges(): void {
    const dl: any = this._layout;
    if (dl && typeof dl.invalidateLayout === 'function') dl.invalidateLayout();
    const groups = this._collectGroups();
    for (const g of groups) {
      const gl: any = g.layout;
      if (gl && typeof gl.invalidateLayout === 'function') gl.invalidateLayout();
    }
  }

  private _rebuildTreeLinks(): void {
    const linksToRemove: Link[] = [];
    for (const layer of this._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && part.data && !(this._model instanceof GraphLinksModel)) {
          linksToRemove.push(part);
        }
      }
    }
    for (const link of linksToRemove) {
      const data = link.data;
      if (data) {
        if (data.to !== undefined) {
          this._treeLinkDataByChildKey.remove(data.to);
        }
        this._parts.remove(data);
      }
      this.remove(link);
    }

    if (this._model instanceof TreeModel) {
      const tm = this._model as TreeModel;
      for (const nodeData of this._model.nodeDataArray) {
        const parentKey = tm.getParentKeyForNodeData(nodeData);
        if (parentKey !== undefined && parentKey !== null) {
          const childKey = this._model.getKeyForNodeData(nodeData);
          if (childKey !== undefined && !this._treeLinkDataByChildKey.has(childKey)) {
            this._addLinkForTreeData(nodeData, parentKey);
          }
        }
      }
    }
  }

  /**
   * 官方 `Diagram.raiseChangedEvent(change, propertyName, object, oldValue, newValue, oldParam?, newParam?)`。
   * 构造一个 ChangedEvent 并分发给 diagram 的 changed 监听者。
   */
  raiseChangedEvent(
    change: any, propertyName: string, object: any,
    oldValue: any, newValue: any, oldParam?: any, newParam?: any
  ): ChangedEvent {
    const e = new ChangedEvent(change, object, propertyName, oldValue, newValue);
    e.diagram = this;
    e.oldParam = oldParam === undefined ? null : oldParam;
    e.newParam = newParam === undefined ? null : newParam;
    this._raiseChangedEvent(e);
    return e;
  }

  private _raiseChangedEvent(e: ChangedEvent): void {
    // 官方语义：model 非空时 diagram 为空
    if (!e.model) e.model = this._model;
    if (!e.model) e.diagram = this;
    for (const listener of this._changedListeners) {
      listener(e);
    }
  }

  /** 官方 DiagramEvent：监听器收到 `{ diagram, type, subject, subjectData, args }`；官方事件名为 ViewportBoundsChanged */
  private _raiseDiagramEvent(name: string, subject?: any, subjectData?: any, ...rest: any[]): void {
    const names = name === 'ViewportChanged' ? ['ViewportChanged', 'ViewportBoundsChanged'] : [name];
    for (const n of names) {
      const listeners = this._diagramListeners.get(n);
      if (listeners) {
        const event = { diagram: this, type: n, subject, subjectData, args: rest };
        for (const listener of listeners) {
          listener(event);
        }
      }
    }
  }

  raiseDiagramEvent(name: string, subject?: any, subjectData?: any, ...rest: any[]): void {
    this._raiseDiagramEvent(name, subject, subjectData, ...rest);
  }

  private _findObjectInPanel(panel: Panel, localPoint: Point): GraphObject | null {
    const elements = (panel as Panel)._elements;
    for (let i = elements.length - 1; i >= 0; i--) {
      const elem = elements[i];
      if (!elem.visible) continue;
      const bounds = elem.actualBounds;
      if (bounds.containsPoint(localPoint)) {
        if (elem instanceof Panel) {
          const innerPoint = new Point(localPoint.x - bounds.x, localPoint.y - bounds.y);
          const found = this._findObjectInPanel(elem, innerPoint);
          if (found) return found;
        }
        return elem;
      }
    }
    return null;
  }

  private _renderLoop(): void {
    this._needsRender = false;
    this._animationFrameId = 0;

    this._checkResize();

    if (this._layoutInvalid) {
      this._performLayout();
      // 布局期间发生的级联失效不再触发新一轮（对齐官方：单次 layoutDiagram 通过）
      this._layoutInvalid = false;
    }

    this._updateGeometry();

    // 官方：documentBounds 真的变了才 raise DocumentBoundsChanged（见 _lastRaisedDocBounds 注释）
    this._checkDocumentBoundsChanged();

    // 官方：Or() 更新循环末尾调用 eC()（grid 面板按视口重定位）
    this._updateGridBounds();

    if (this._renderer) {
      this._renderer.render();
    }

    if (this._animationManager.isAnimating) {
      this.requestUpdate();
    }
  }

  /**
   * 官方 measure+arrange 全体部件（Ht 语义）：
   * pass1 非 Group 非 Link → pass2 Group → pass3 Link；
   * 每个部件：ensureBounds（measure + bF 位置同步，仅 measure=true 时；渲染阶段只 arrange，
   * 对齐官方 render 不重新 measure）→ _arrange(原始 position, measuredBounds)
   * → syncPositionFromLocation（arrange 后 locationSpot 偏移变化时重推 position）。
   * position 为 NaN 时按原样传入（ab.x/y 保持 NaN，对齐官方）。
   */
  private _measureArrangeAll(measure: boolean = true): void {
    const pass = (kind: 0 | 1 | 2): void => {
      for (const layer of this._layers) {
        // 这里**不能**跳过临时层（Adornment / ViewportForeground 等）。
        // 官方只在算 documentBounds 时排除临时层（见 documentBounds getter），
        // measure/arrange 照做。之前这里 `if (layer.isTemporary) continue`，
        // 于是 Adornment 层里的 Part 从来没被测量/排列，
        // gantt 的 `myTimeline`（Graduated 面板，Adornment 层）actualBounds 一直是 NaN，
        // 画 graduated 时间轴时报 `Invalid arguments to Rect constructor: 0, Infinity, 0, -Infinity`。
        const partsIt = layer.parts;
        while (partsIt.next()) {
          const part = partsIt.value as any;
          if (!part.visible) continue;
          const isLink = part instanceof Link;
          const isGroup = part._className === 'Group';
          if (kind === 0 && (isLink || isGroup)) continue;
          if (kind === 1 && !isGroup) continue;
          if (kind === 2 && !isLink) continue;
          if (measure) part.ensureBounds();
          const pos = part.position;
          const mb = part.measuredBounds;
          // 官方 Part.ensureBounds/Ht：actualBounds 一律以 position 为左上角。
          // 早先对 Link 特判「按路线中点居中」是错误简化 —— 官方 measure 里
          // position = routeBounds 原点 + or.origin，配合 union(or) 起点正好覆盖子元素，
          // 居中会让 link 包围盒偏移半个自身尺寸。
          const arr = new Rect(pos.x, pos.y, mb.width, mb.height);
          part._arrange(arr);
          if (!isLink && typeof part.syncPositionFromLocation === 'function') {
            part.syncPositionFromLocation();
          }
        }
      }
    };
    pass(0);
    pass(1);
    // 节点/组排好后端口 actualBounds 才定型。首次算路线时它们还是 null，
    // 算出的路线被标记 _isRouteValid=true 后 updateRoute() 一直短路，
    // 于是 link 永远拿着那条「陈旧路线」（实测 basic：端口最终在 x=0 / 78.16，
    // 而路线长度仍停在第一次的 3.226）。这里统一失效一次再排链接。
    // 只在 measure=true（布局期/部件重新测量）时做：渲染期（_updateGeometry→measure=false）
    // 节点位置不变、端口不动，若也失效会导致「失效→requestUpdate→再失效」的每帧空转。
    if (measure) this._invalidateLinkRoutes();
    pass(2);
  }

  /** 官方在节点布局定稿后让所有 link 重算路线 */
  private _invalidateLinkRoutes(): void {
    for (const layer of this._layers) {
      if (layer.isTemporary) continue;
      const it = layer.parts;
      while (it.next()) {
        const part = it.value as any;
        if (part instanceof Link && typeof part.invalidateRoute === 'function') {
          part.invalidateRoute();
        }
      }
    }
  }

  private _collectGroups(): any[] {
    const groups: any[] = [];
    for (const layer of this._layers) {
      if (layer.isTemporary) continue;
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value as any;
        if (part._className === 'Group') groups.push(part);
      }
    }
    return groups;
  }

  private _performLayout(): void {
    const oldPositions = new Map<Node, Point>();
    if (this._animationManager.isEnabled) {
      for (const layer of this._layers) {
        if (layer.isTemporary) continue;
        const partsIt = layer.parts;
        while (partsIt.next()) {
          const part = partsIt.value;
          if (part instanceof Node && part.isLayoutPositioned && part.visible) {
            const loc = part.location;
            if (loc && !isNaN(loc.x) && !isNaN(loc.y)) {
              oldPositions.add(part, loc.copy());
            }
          }
        }
      }
    }

    // ====== 官方 layoutDiagram(iC) 顺序 ======
    // 0) 预排：全体 measure+arrange（成员文档 ab 就绪；组内未定位时 placeholder union 为非有限 → 不设 location）
    this._measureArrangeAll();

    // 1) 递归组布局（子组优先，官方 rD）：Ga = !location.isReal()；布局后 Db = 补测重排 + 位置同步
    const allGroups = this._collectGroups();
    const visited = new Set<any>();
    const nestedGroupsOf = (g: any): any[] => {
      const out: any[] = [];
      const walk = (owner: any): void => {
        const it = owner.memberParts ? owner.memberParts.iterator : null;
        if (!it) return;
        while (it.next()) {
          const d: any = it.value;
          if (d._className === 'Group') out.push(d);
        }
      };
      walk(g);
      return out;
    };
    const visitGroup = (g: any): void => {
      if (visited.has(g)) return;
      visited.add(g);
      for (const sub of nestedGroupsOf(g)) visitGroup(sub);
      const gl = g.layout;
      if (!gl) return;
      if (gl.isInitial || !gl.isValidLayout) {
        g.Ga = isNaN(g.location.x) || isNaN(g.location.y);
        if (gl.diagram !== this) gl.diagram = this;
        const wasOngoing = gl.isOngoing;
        gl.isOngoing = true;
        gl.doLayout(g);
        gl.isValidLayout = true;
        gl.isOngoing = wasOngoing;
        // 官方 Db(group)：measure+arrange 组子树（placeholder 设 location）+ bF 位置同步
        this._measureArrangeAll();
      }
    };
    for (const g of allGroups) visitGroup(g);

    // 2) Diagram 基础布局（官方 o.doLayout(this)）
    if (this._layout && typeof this._layout.doLayout === 'function') {
      if ((this._layout as any).diagram !== this) {
        (this._layout as any).diagram = this;
      }
      const dl = this._layout as any;
      const wasOngoing = dl.isOngoing;
      dl.isOngoing = true;
      dl.doLayout(this);
      dl.isValidLayout = true;
      dl.isOngoing = wasOngoing;
    }

    // 官方 Db(this)：diagram 布局后全体补测重排 + 位置同步（否则 location 保持 NaN）
    this._measureArrangeAll();

    if (this._animationManager.isEnabled && oldPositions.count > 0) {
      const anim = this._animationManager.defaultAnimation;
      anim.clear();
      anim.duration = this._animationManager.duration;
      let hasChanges = false;
      const it = oldPositions.iterator;
      while (it.next()) {
        const node = it.key;
        const oldLoc = it.value;
        const newLoc = node.location;
        if (oldLoc.x !== newLoc.x || oldLoc.y !== newLoc.y) {
          node.location = oldLoc;
          anim.add(node, 'location', oldLoc, newLoc);
          hasChanges = true;
        }
      }
      if (hasChanges) {
        // 官方 iC 尾部：`Li=!1; t.start()` —— 走 Animation.start()（先置 isRunning 再注册+启动 tick）。
        // 早先调 animationManager.startAnimation(anim) 只注册不置 isRunning，
        // rAF tick 里 `anim.isRunning===false` 被过滤 → 动画永不执行 →
        // 节点被回写到旧位置后永远回不到新位置（gantt bar y=0 的直接成因）。
        anim.start();
      }
    }

    this._raiseDiagramEvent('LayoutCompleted');

    if (!this._hasPerformedInitialLayout) {
      this._hasPerformedInitialLayout = true;
      this._applyInitialViewport();
      this._raiseDiagramEvent('InitialLayoutCompleted');
    }

    this._applyAutoScale();
    this._applyContentAlignment();
    // 官方 layoutDiagram 收尾：o.doLayout(t) 后 this.doLinkRouting(t)
    this.doLinkRouting(this);
  }

  /**
   * 官方 tE（首次布局完成）+ on(t=true)：先定初始 scale，
   * 再按 initialDocumentSpot/initialViewportSpot 计算 position，最后用 Z2 首次夹取修正。
   */
  private _applyInitialViewport(): void {
    if (this._initialAutoScale === AutoScaleUniform) {
      this.zoomToFit();
    } else if (this._initialAutoScale === AutoScaleUniformToFill) {
      const db0 = this.documentBounds;
      const vs = this.viewSize;
      if (db0.width > 0 && db0.height > 0 && vs.width > 0 && vs.height > 0) {
        const newScale = Math.max(vs.width / db0.width, vs.height / db0.height);
        this._scale = Math.max(this._minScale, Math.min(this._maxScale, newScale));
        this._position = new Point(db0.x, db0.y);
      }
    } else {
      const c = this._initialScale;
      if (isFinite(c) && c > 0) {
        this._scale = Math.max(this._minScale, Math.min(this._maxScale, c));
      }
    }

    // on(t)：initialPosition 优先
    if (this._initialPosition && isFinite(this._initialPosition.x) && isFinite(this._initialPosition.y)) {
      this._position = this._initialPosition.copy();
      return;
    }

    // 官方：doc spot 对齐 viewport spot（NoSpot → TopLeft）
    let u = this._initialDocumentSpot;
    let d = this._initialViewportSpot;
    if (u.isNoSpot()) u = Spot.TopLeft;
    if (d.isNoSpot()) d = Spot.TopLeft;
    const db = this.documentBounds;
    const mx = db.x + u.x * db.width + u.offsetX;
    const my = db.y + u.y * db.height + u.offsetY;
    // 官方 `on(t)` 这里用的是**原始 viewSize**，不是带滚动条预留的 viewportBounds：
    // orgChartStatic 上 initialDocumentSpot=TopCenter，官方 position.x = 1182.907
    // = docCentre - 900/2；若用 viewportBounds(889) 会得 1188.407。
    const vs = this.viewSize;
    const p = new Rect(0, 0, vs.width / this._scale, vs.height / this._scale);
    const yx = p.x + d.x * p.width + d.offsetX;
    const yy = p.y + d.y * p.height + d.offsetY;
    this._position = new Point(mx - yx, my - yy);

    // 官方 on()：contentAlignment 解析（l 非 spot 且 initialContentAlignment 是 spot/default 时用后者）
    let l: Spot = this._contentAlignment;
    const h: Spot | null = this._initialContentAlignment;
    if (!l.isSpot() && h !== null && (h.isSpot() || h.isDefault())) {
      const f = this._initialDocumentSpot.isSpot() && this._initialViewportSpot.isSpot();
      l = h.isDefault() && !f ? Spot.Center : h;
    }
    // 官方 tn(true) 里 H2 的实参 = Pt/it, St/it（原始 viewSize/scale）。
    // 给 CDN 4.0.5 flowchart 打桩实测：tn(true) 时 St 还没做滚动条预留（=810）、
    // H2 收 e=682,i=810,n=true → align 得 position.y=-42.468；此后滚动条预留
    // 才生效（viewportBounds 变 682×799），但后续 H2 调用 n=false 且 s=Default，
    // 不再 align，position 不回写。早先这里传 viewportBounds(799) 会让首次
    // align 矮 5.5px——正是 flowchart 像素残差 3% 的主体。
    this._clampViewportPosition(db, vs.width / this._scale, vs.height / this._scale, l);
  }

  /** 官方 Z2(n=true/scrollMode)：夹取 position；视口宽于文档时按对齐 spot 摆放 */
  private _clampViewportPosition(t: Rect, i: number, e: number, alignSpot: Spot): void {
    let r = this._position.x;
    let l = this._position.y;
    // 官方 H2 源码写的是 `const a = this.kh`（Diagram.padding），且 documentBounds 本身
    // 也已含 padding（实测 pad=50 → doc 从 [0,0,77,14] 变 [-50,-50,177,114]，两边一致），
    // 即官方在这里是**双重计入** padding。但我们照抄会变差：
    // animatedFocus 92.7→97.3、grouping 2.43→3.06、conceptMap 3.13→3.47，故保持 0。
    const ml = 0;
    const mr = 0;
    const mt = 0;
    const mb = 0;
    if (alignSpot.isSpot()) {
      if (i > t.width) r = t.x + (alignSpot.x * t.width + alignSpot.offsetX) - (alignSpot.x * i - alignSpot.offsetX);
      if (e > t.height) l = t.y + (alignSpot.y * t.height + alignSpot.offsetY) - (alignSpot.y * e - alignSpot.offsetY);
    }
    const a = i - t.width;
    if (i < t.width + ml + mr) {
      let f = r + i / 2;
      f = Math.min(f, t.right + Math.max(a, mr) - i / 2);
      f = Math.max(f, t.left - Math.max(a, ml) + i / 2);
      r = f - i / 2;
    } else if (r > t.x) {
      r = t.x;
    } else if (r < t.right - i) {
      r = t.right - i;
    }
    const c = e - t.height;
    if (e < t.height + mt + mb) {
      let f = l + e / 2;
      f = Math.min(f, t.bottom + Math.max(c, mb) - e / 2);
      f = Math.max(f, t.top - Math.max(c, mt) + e / 2);
      l = f - e / 2;
    } else if (l > t.y) {
      l = t.y;
    } else if (l < t.bottom - e) {
      l = t.bottom - e;
    }
    if (isFinite(r) && isFinite(l)) this._position = new Point(r, l);
  }

  private _applyAutoScale(): void {
    if (this._autoScale === AutoScaleUniform) {
      this.zoomToFit();
    } else if (this._autoScale === AutoScaleUniformToFill) {
      const db = this.documentBounds;
      const vs = this.viewSize;
      if (db.width > 0 && db.height > 0 && vs.width > 0 && vs.height > 0) {
        const newScale = Math.max(vs.width / db.width, vs.height / db.height);
        this._scale = Math.max(this._minScale, Math.min(this._maxScale, newScale));
        this._position = new Point(db.x, db.y);
      }
    }
  }

  private _applyContentAlignment(): void {
    if (!this._contentAlignment || this._contentAlignment === Spot.Default) return;

    const db = this.documentBounds;
    const vs = this.viewSize;
    if (db.width <= 0 || db.height <= 0) return;

    const docW = vs.width / this._scale;
    const docH = vs.height / this._scale;

    if (db.width >= docW && db.height >= docH) return;

    this.alignDocument(this._contentAlignment, this._contentAlignment);
  }

  private _updateGeometry(): void {
    this._measureArrangeAll(false);
    for (const layer of this._layers) {
      if (!layer.visible) continue;
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (!(part instanceof Link)) continue;
        if (!part.visible) continue;
        part.computePoints();
      }
    }
  }

  private _setupResizeObserver(): void {
    if (!this._div || typeof ResizeObserver === 'undefined') return;

    this._lastDivWidth = this._div.clientWidth;
    this._lastDivHeight = this._div.clientHeight;

    this._resizeObserver = new ResizeObserver(() => {
      this._checkResize();
    });
    this._resizeObserver.observe(this._div);
  }

  private _checkResize(): void {
    if (!this._div) return;
    const w = this._div.clientWidth;
    const h = this._div.clientHeight;
    if (w !== this._lastDivWidth || h !== this._lastDivHeight) {
      this._lastDivWidth = w;
      this._lastDivHeight = h;
      if (this._renderer) {
        this._renderer.resize(w, h);
      }
      this.requestUpdate();
    }
  }

  private _setupMouseEvents(): void {
    if (!this._div) return;

    const canvas = this._renderer ? this._renderer.canvas : null;
    const target = canvas || this._div;

    target.addEventListener('mousedown', (e: any) => {
      if (e.button !== 0 && e.button !== 2) return;
      this.focus();

      const inputEvent = InputEvent.fromMouseEvent(e, this);
      inputEvent.eventType = 'mousedown';
      this._toolManager.lastInput = inputEvent;
      this._toolManager.doMouseDown();

      if (e.button === 2) {
        inputEvent.isContextMenu = true;
      }

      const onMove = (ev: MouseEvent) => {
        const moveEvent = InputEvent.fromMouseEvent(ev, this);
        moveEvent.eventType = 'mousemove';
        this._toolManager.lastInput = moveEvent;
        this._toolManager.doMouseMove();
      };

      const onUp = (ev: MouseEvent) => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);

        const upEvent = InputEvent.fromMouseEvent(ev, this);
        upEvent.eventType = 'mouseup';
        this._toolManager.lastInput = upEvent;
        this._toolManager.doMouseUp();
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    target.addEventListener('wheel', (e: any) => {
      e.preventDefault();

      const inputEvent = InputEvent.fromMouseEvent(e, this);
      inputEvent.eventType = 'wheel';
      this._toolManager.lastInput = inputEvent;
      this._toolManager.doMouseWheel();
    }, { passive: false });

    target.addEventListener('contextmenu', (e: Event) => {
      e.preventDefault();
    });

    target.addEventListener('touchstart', (e: any) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = (target as HTMLElement).getBoundingClientRect();
        const viewPoint = new Point(touch.clientX - rect.left, touch.clientY - rect.top);
        const docPoint = this.transformViewToDoc(viewPoint);

        const inputEvent = new InputEvent();
        inputEvent.eventType = 'mousedown';
        inputEvent.viewPoint = { x: viewPoint.x, y: viewPoint.y };
        inputEvent.documentPoint = { x: docPoint.x, y: docPoint.y };
        inputEvent.button = 0;
        inputEvent.timestamp = Date.now();
        inputEvent.nativeEvent = e;
        this._toolManager.lastInput = inputEvent;
        this._toolManager.doMouseDown();
      }
    }, { passive: true });

    target.addEventListener('touchmove', (e: any) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = (target as HTMLElement).getBoundingClientRect();
        const viewPoint = new Point(touch.clientX - rect.left, touch.clientY - rect.top);
        const docPoint = this.transformViewToDoc(viewPoint);

        const inputEvent = new InputEvent();
        inputEvent.eventType = 'mousemove';
        inputEvent.viewPoint = { x: viewPoint.x, y: viewPoint.y };
        inputEvent.documentPoint = { x: docPoint.x, y: docPoint.y };
        inputEvent.timestamp = Date.now();
        inputEvent.nativeEvent = e;
        this._toolManager.lastInput = inputEvent;
        this._toolManager.doMouseMove();
      }
      e.preventDefault();
    }, { passive: false });

    target.addEventListener('touchend', (e: any) => {
      const inputEvent = new InputEvent();
      inputEvent.eventType = 'mouseup';
      inputEvent.timestamp = Date.now();
      inputEvent.nativeEvent = e;
      this._toolManager.lastInput = inputEvent;
      this._toolManager.doMouseUp();
    }, { passive: true });
  }

  private _setupKeyboardEvents(): void {
    if (!this._div) return;

    this._div.addEventListener('keydown', (e: KeyboardEvent) => {
      const inputEvent = InputEvent.fromKeyboardEvent(e);
      inputEvent.eventType = 'keydown';
      this._toolManager.lastInput = inputEvent;

      this._toolManager.doKeyDown();

      if (this._commandHandler) {
        this._commandHandler.doKeyDown();
      }

      if (inputEvent.handled) {
        e.preventDefault();
      }
    });

    this._div.addEventListener('keyup', (e: KeyboardEvent) => {
      const inputEvent = InputEvent.fromKeyboardEvent(e);
      inputEvent.eventType = 'keyup';
      this._toolManager.lastInput = inputEvent;
      this._toolManager.doKeyUp();
    });
  }

  // ============ 官方 Diagram API 对齐（阶段 6，增量字段） ============

  private _currentCursor: string = '';
  private _defaultCursor: string = '';
  private _skipsUndoManager: boolean = false;
  private _mouseOver: ((e: InputEvent, diagram: Diagram) => void) | null = null;
  private _mouseEnter: ((e: InputEvent, diagram: Diagram) => void) | null = null;
  private _mouseLeave: ((e: InputEvent, diagram: Diagram) => void) | null = null;
  private _mouseHold: ((e: InputEvent, diagram: Diagram) => void) | null = null;
  private _mouseHover: ((e: InputEvent, diagram: Diagram) => void) | null = null;
  private _toolTip: GraphObject | string | null = null;

  get currentCursor(): string { return this._currentCursor; }
  set currentCursor(val: string) { this._currentCursor = val; }

  get defaultCursor(): string { return this._defaultCursor; }
  set defaultCursor(val: string) { this._defaultCursor = val; }

  get skipsUndoManager(): boolean { return this._skipsUndoManager; }
  set skipsUndoManager(val: boolean) { this._skipsUndoManager = val; }

  get mouseOver(): ((e: InputEvent, diagram: Diagram) => void) | null { return this._mouseOver; }
  set mouseOver(val: ((e: InputEvent, diagram: Diagram) => void) | null) { this._mouseOver = val; }

  get mouseEnter(): ((e: InputEvent, diagram: Diagram) => void) | null { return this._mouseEnter; }
  set mouseEnter(val: ((e: InputEvent, diagram: Diagram) => void) | null) { this._mouseEnter = val; }

  get mouseLeave(): ((e: InputEvent, diagram: Diagram) => void) | null { return this._mouseLeave; }
  set mouseLeave(val: ((e: InputEvent, diagram: Diagram) => void) | null) { this._mouseLeave = val; }

  get mouseHold(): ((e: InputEvent, diagram: Diagram) => void) | null { return this._mouseHold; }
  set mouseHold(val: ((e: InputEvent, diagram: Diagram) => void) | null) { this._mouseHold = val; }

  get mouseHover(): ((e: InputEvent, diagram: Diagram) => void) | null { return this._mouseHover; }
  set mouseHover(val: ((e: InputEvent, diagram: Diagram) => void) | null) { this._mouseHover = val; }

  get toolTip(): GraphObject | string | null { return this._toolTip; }
  set toolTip(val: GraphObject | string | null) { this._toolTip = val; }

  // ============ 官方 Diagram API 对齐（阶段 6，实例成员） ============

  // ---- 输入/事件状态字段 ----
  private _firstInput: InputEvent = new InputEvent();
  private _previousInput: InputEvent = new InputEvent();
  private _mouseIsCaptured: boolean = false;
  private _opacity: number = 1;
  private _fixedBounds: Rect | null = null;
  private _defaultScale: number = NaN;
  private _initialDocumentSpot: Spot = Spot.None;
  private _initialViewportSpot: Spot = Spot.None;
  private _positionComputation: ((part: Part, pt: Point, gridPt: Point) => Point) | null = null;
  private _scrollMode: any = null;
  private _scrollMargin: Margin = new Margin(0);
  private _scrollsPageOnFocus: boolean = false;
  private _hasHorizontalScrollbar: boolean = false;
  private _hasVerticalScrollbar: boolean = false;
  private _scrollWidth: number = 20;
  private _autoScrollInterval: number = 14;
  private _autoScrollRegion: number = 28;
  private _isVirtualized: boolean = false;
  private _isTreePathToChildren: boolean = true;
  private _treeCollapsePolicy: any = null;
  private _highlighteds: Set<Part> = new Set<Part>();
  private _isCollapsingExpanding: boolean = false;
  private _delaysLayout: boolean = false;
  private _isModelReadOnly: boolean = false;
  private _isModified: boolean = false;
  private _draggedLink: any = null;
  private _modelChangeListeners: Array<(e: any) => void> = [];

  get firstInput(): InputEvent { return this._firstInput; }
  get previousInput(): InputEvent { return this._previousInput; }
  get isMouseCaptured(): boolean { return this._mouseIsCaptured; }
  get opacity(): number { return this._opacity; }
  set opacity(val: number) {
    if (this._opacity === val) return;
    this._opacity = val;
    this.requestUpdate();
  }
  get fixedBounds(): Rect | null { return this._fixedBounds; }
  set fixedBounds(val: Rect | null) {
    if (this._fixedBounds === val) return;
    this._fixedBounds = val ? val.copy() : null;
    this.requestUpdate();
  }
  get defaultScale(): number { return isNaN(this._defaultScale) ? 1 : this._defaultScale; }
  set defaultScale(val: number) { this._defaultScale = val; }
  get initialDocumentSpot(): Spot { return this._initialDocumentSpot; }
  set initialDocumentSpot(val: Spot) { this._initialDocumentSpot = val; }
  get initialViewportSpot(): Spot { return this._initialViewportSpot; }
  set initialViewportSpot(val: Spot) { this._initialViewportSpot = val; }
  get positionComputation(): ((part: Part, pt: Point, gridPt: Point) => Point) | null { return this._positionComputation; }
  set positionComputation(val: ((part: Part, pt: Point, gridPt: Point) => Point) | null) { this._positionComputation = val; }
  get scrollMode(): any { return this._scrollMode; }
  set scrollMode(val: any) { this._scrollMode = val; }
  get scrollMargin(): Margin { return this._scrollMargin; }
  set scrollMargin(val: Margin) { this._scrollMargin = val; }
  get scrollsPageOnFocus(): boolean { return this._scrollsPageOnFocus; }
  set scrollsPageOnFocus(val: boolean) { this._scrollsPageOnFocus = val; }
  get hasHorizontalScrollbar(): boolean { return this._hasHorizontalScrollbar; }
  set hasHorizontalScrollbar(val: boolean) { this._hasHorizontalScrollbar = val; }
  get hasVerticalScrollbar(): boolean { return this._hasVerticalScrollbar; }
  set hasVerticalScrollbar(val: boolean) { this._hasVerticalScrollbar = val; }
  get autoScrollInterval(): number { return this._autoScrollInterval; }
  set autoScrollInterval(val: number) { this._autoScrollInterval = val; }
  get autoScrollRegion(): number { return this._autoScrollRegion; }
  set autoScrollRegion(val: number) { this._autoScrollRegion = val; }
  get isVirtualized(): boolean { return this._isVirtualized; }
  set isVirtualized(val: boolean) { this._isVirtualized = val; }
  get isTreePathToChildren(): boolean { return this._isTreePathToChildren; }
  set isTreePathToChildren(val: boolean) { this._isTreePathToChildren = val; }
  get treeCollapsePolicy(): any { return this._treeCollapsePolicy; }
  set treeCollapsePolicy(val: any) { this._treeCollapsePolicy = val; }
  get highlighteds(): Set<Part> { return this._highlighteds; }
  get isCollapsingExpanding(): boolean { return this._isCollapsingExpanding; }
  get delaysLayout(): boolean { return this._delaysLayout; }
  set delaysLayout(val: boolean) { this._delaysLayout = val; }
  get isModelReadOnly(): boolean { return this._isModelReadOnly; }
  set isModelReadOnly(val: boolean) { this._isModelReadOnly = val; }
  get isModified(): boolean { return this._isModified; }
  set isModified(val: boolean) { this._isModified = val; }
  get draggedLink(): any { return this._draggedLink; }
  set draggedLink(val: any) { this._draggedLink = val; }

  addModelChangedListener(listener: (e: any) => void): void {
    if (typeof listener !== 'function') throw new Error('addModelChangedListener: listener must be a function');
    if (this._modelChangeListeners.indexOf(listener) >= 0) return;
    this._modelChangeListeners.push(listener);
    // 官方 addModelChangedListener 会立刻挂到当前 model 上
    if (this._model) this._model.addChangedListener(listener);
  }
  removeModelChangedListener(listener: (e: any) => void): void {
    const idx = this._modelChangeListeners.indexOf(listener);
    if (idx >= 0) this._modelChangeListeners.splice(idx, 1);
    if (this._model) this._model.removeChangedListener(listener);
  }

  addEventListener(type: string, listener: (e: any) => void): void {
    this._raiseDiagramEvent(type);
  }
  removeEventListener(type: string, listener: (e: any) => void): void { }

  // ---- 鼠标/键盘事件分发 ----
  doMouseDown(): void { this._toolManager.doMouseDown(); }
  doMouseMove(): void { this._toolManager.doMouseMove(); }
  doMouseUp(): void { this._toolManager.doMouseUp(); }
  doMouseWheel(): void { this._toolManager.doMouseWheel(); }
  doKeyDown(): void { this._toolManager.doKeyDown(); }
  doKeyUp(): void { this._toolManager.doKeyUp(); }

  emitMouseDown(e: InputEvent): void {
    this.lastInput = e;
    this._toolManager.doMouseDown();
  }
  emitMouseMove(e: InputEvent): void {
    this.lastInput = e;
    this._toolManager.doMouseMove();
  }
  emitMouseUp(e: InputEvent): void {
    this.lastInput = e;
    this._toolManager.doMouseUp();
  }
  emitMouseWheel(e: InputEvent): void {
    this.lastInput = e;
    this._toolManager.doMouseWheel();
  }
  emitKeyDown(e: InputEvent): void {
    this.lastInput = e;
    this._toolManager.doKeyDown();
  }
  emitKeyUp(e: InputEvent): void {
    this.lastInput = e;
    this._toolManager.doKeyUp();
  }

  doFocus(): void {
    if (this._div && this._div.focus) this._div.focus();
  }

  acceptEvent(e: InputEvent): boolean {
    return e.bubbles;
  }

  click(e: InputEvent): void { this.emitMouseDown(e); }
  doubleClick(e: InputEvent): void { this.emitMouseDown(e); }
  contextClick(e: InputEvent): void { this.emitMouseDown(e); }

  getMouse(): Point {
    return this.lastInput.documentPoint ? new Point(this.lastInput.documentPoint.x, this.lastInput.documentPoint.y) : Point.Zero.copy();
  }

  mouseDragOver(e: InputEvent): void { }
  mouseDrop(e: InputEvent): void { }

  // ---- 部件查找 ----
  findPartForData(data: any): Part | null {
    const model: any = this._model;
    if (!model || !model.getKeyForNodeData) return null;
    const key = model.getKeyForNodeData(data);
    return this.findNodeForKey(key);
  }
  findNodeForData(data: any): Node | null {
    return this.findPartForData(data) as Node | null;
  }
  findLinkForKey(key: any): Link | null {
    const model: any = this._model;
    if (!model || typeof model.getLinkDataForKey !== 'function') return null;
    const linkData = model.getLinkDataForKey(key);
    if (!linkData) return null;
    for (const layer of this._layers) {
      if (layer.isTemporary) continue;
      const it = layer.parts;
      while (it.next()) {
        const p = it.value;
        if ((p as any)._className === 'Link' && (p as any).data === linkData) return p as Link;
      }
    }
    return null;
  }

  findPartsAt(point: Point): any {
    const result = new List<any>();
    const p = this.findPartAt(point, true);
    if (p) result.add(p);
    return result;
  }
  findObjectsAt(point: Point): any {
    const result = new List<any>();
    const o = this.findObjectAt(point);
    if (o) result.add(o);
    return result;
  }
  findPartsIn(rect: Rect, partial: boolean = false): any {
    const result = new List<any>();
    const layers = this._layers;
    for (const layer of layers) {
      if (layer.isTemporary) continue;
      const it = layer.parts;
      while (it.next()) {
        const p = it.value;
        const pb = p.actualBounds;
        if (pb && (partial ? rect.intersectsRect(pb) : rect.containsRect(pb))) result.add(p);
      }
    }
    return result;
  }
  findObjectsIn(rect: Rect, partial: boolean = false): any {
    const result = new List<any>();
    const parts = this.findPartsIn(rect, partial);
    const it = parts.iterator;
    while (it.next()) result.add(it.value);
    return result;
  }
  findPartsNear(center: Point, dist: number, partial: boolean = true): any {
    const result = new List<any>();
    const layers = this._layers;
    for (const layer of layers) {
      if (layer.isTemporary) continue;
      const it = layer.parts;
      while (it.next()) {
        const p = it.value;
        const pb = p.actualBounds;
        if (!pb) continue;
        const rect = pb.copy();
        rect.inflate(dist, dist);
        if (rect.containsPoint(center)) result.add(p);
      }
    }
    return result;
  }
  findObjectsNear(center: Point, dist: number): any {
    const result = new List<any>();
    const parts = this.findPartsNear(center, dist);
    const it = parts.iterator;
    while (it.next()) result.add(it.value);
    return result;
  }

  findTopLevelNodesAndLinks(): any {
    const result = new List<any>();
    const layers = this._layers;
    for (const layer of layers) {
      if (layer.isTemporary) continue;
      const it = layer.parts;
      while (it.next()) {
        const p = it.value;
        if ((p as any)._className === 'Node' || (p as any)._className === 'Link') result.add(p);
      }
    }
    return result;
  }
  findTopLevelGroups(): any {
    const result = new List<any>();
    const layers = this._layers;
    for (const layer of layers) {
      if (layer.isTemporary) continue;
      const it = layer.parts;
      while (it.next()) {
        const p = it.value;
        if ((p as any)._className === 'Group' && !(p as any).containingGroup) result.add(p);
      }
    }
    return result;
  }
  findTreeRoots(): any {
    const result = new List<any>();
    const nodes = this.findTopLevelNodesAndLinks();
    const it = nodes.iterator;
    while (it.next()) {
      const p = it.value;
      if ((p as any)._className === 'Node' && !(p as any).findTreeParentNode()) result.add(p);
    }
    return result;
  }

  // ---- 边界/几何 ----
  computePartsBounds(parts: any): Rect {
    const result = new Rect();
    if (parts === null || parts === undefined) return result;
    const items: any[] = [];
    if (Array.isArray(parts)) {
      for (const p of parts) items.push(p);
    } else {
      // 官方 `iterator` 是**属性**（返回 go.Iterator），不是方法。
      // 之前写成 `parts.iterator ? parts.iterator() : parts` 会去调用那个
      // 迭代器对象本身，直接抛 `xxx.iterator is not a function`
      // （实测 Arranging / classHierarchy）。
      let it: any = null;
      const raw = (parts as any).iterator;
      if (raw !== undefined && raw !== null) {
        it = typeof raw === 'function' ? raw.call(parts) : raw;
      } else if (typeof (parts as any).next === 'function') {
        it = parts;
      }
      if (it && typeof it.next === 'function') {
        while (it.next()) items.push(it.value);
      } else if (typeof (parts as any).each === 'function') {
        (parts as any).each((p: any) => items.push(p));
      } else if (typeof (parts as any)[Symbol.iterator] === 'function') {
        for (const p of parts as any) items.push(p);
      }
    }
    for (const p of items) {
      const b = p ? p.actualBounds : null;
      if (b && (b as any).isReal()) result.unionRect(b);
    }
    return result;
  }
  computeBounds(): Rect { return this.documentBounds; }

  ensureBounds(): void { this.invalidateDocumentBounds(); }

  invalidateDocumentBounds(): void {
    this._raiseDiagramEvent('DocumentBoundsChanged');
    this.requestUpdate();
  }

  /** 官方语义：文档包围盒发生变化时（且仅此时）raise `DocumentBoundsChanged` */
  private _checkDocumentBoundsChanged(): void {
    const b = this.documentBounds;
    const prev = this._lastRaisedDocBounds;
    if (prev !== null && prev.x === b.x && prev.y === b.y &&
        prev.width === b.width && prev.height === b.height) {
      return;
    }
    this._lastRaisedDocBounds = new Rect(b.x, b.y, b.width, b.height);
    this._raiseDiagramEvent('DocumentBoundsChanged');
  }
  invalidateViewport(): void {
    this._raiseDiagramEvent('ViewportChanged');
    this.requestUpdate();
  }

  zoomToRect(rect: Rect): void {
    const r = rect.copy();
    const vs = this.viewSize;
    const scale = Math.min(vs.width / r.width, vs.height / r.height);
    const pos = new Point(r.x + (r.width - vs.width / scale) / 2, r.y + (r.height - vs.height / scale) / 2);
    this._scale = Math.max(this._minScale, Math.min(this._maxScale, scale));
    this._position = pos;
    this.requestUpdate();
  }

  zoomPoint(factor: number): void {
    const vs = this.viewSize;
    const center = this.transformViewToDoc(new Point(vs.width / 2, vs.height / 2));
    const oldScale = this._scale;
    this.scale = this._scale * factor;
    const newScale = this._scale;
    const pos = new Point(
      center.x - (center.x - this._position.x) * (newScale / oldScale),
      center.y - (center.y - this._position.y) * (newScale / oldScale)
    );
    this._position = pos;
    this.requestUpdate();
  }

  isUnoccupied(rect: Rect): boolean {
    const parts = this.findPartsIn(rect, false);
    return parts.count === 0;
  }
  computeOccupiedArea(place: Rect): Rect {
    const vs = this.viewSize;
    const newb = new Rect(place.x, place.y, vs.width / this._scale, vs.height / this._scale);
    return newb;
  }

  // ---- 滚动/自动滚动 ----
  scrollHorizontalLineChange(value: number): void {
    this.position = new Point(this._position.x + value, this._position.y);
  }
  scrollVerticalLineChange(value: number): void {
    this.position = new Point(this._position.x, this._position.y + value);
  }
  scroll(): void {
    const d = this.documentBounds;
    const vb = this.viewportBounds;
    if (!vb.containsRect(d)) {
      this.position = new Point(Math.min(this._position.x, d.x), Math.min(this._position.y, d.y));
    }
    this.requestUpdate();
  }
  setScrollWidth(width: number): void {
    this._scrollWidth = width;
    this.requestUpdate();
  }

  computeAutoScrollPosition(): Point {
    const docPoint = this.lastInput.documentPoint;
    const vb = this.viewportBounds;
    const region = this._autoScrollRegion;
    const dx = vb.width / 2 - region;
    const dy = vb.height / 2 - region;
    let x = this._position.x, y = this._position.y;
    if (docPoint.x < vb.x + region) x -= (vb.x + region - docPoint.x) * (this._scale);
    else if (docPoint.x > vb.x + vb.width - region) x += (docPoint.x - (vb.x + vb.width - region)) * this._scale;
    if (docPoint.y < vb.y + region) y -= (vb.y + region - docPoint.y) * this._scale;
    else if (docPoint.y > vb.y + vb.height - region) y += (docPoint.y - (vb.y + vb.height - region)) * this._scale;
    return new Point(x, y);
  }
  doAutoScroll(): void {
    if (!this._mouseIsCaptured) return;
    const pt = this.computeAutoScrollPosition();
    if (pt.isReal()) this.position = pt;
  }
  stopAutoScroll(): void { }

  // ---- 模型/图层 ----
  addLayerBefore(layer: Layer, existingLayer: Layer): void {
    const idx = this._layers.indexOf(existingLayer);
    if (idx < 0) { this.addLayer(layer); return; }
    this._layers.splice(idx, 0, layer);
    layer.diagram = this;
  }
  addLayerAfter(layer: Layer, existingLayer: Layer): void {
    const idx = this._layers.indexOf(existingLayer);
    if (idx < 0) { this.addLayer(layer); return; }
    this._layers.splice(idx + 1, 0, layer);
    layer.diagram = this;
  }

  partAdded(part: Part): void {
    (part as any)._diagram = this;
  }
  partRemoved(part: Part): void {
    (part as any)._diagram = null;
  }

  clear(): void {
    this.clearSelection();
    for (const layer of this._layers) {
      if (layer.isTemporary) continue;
      const parts = iteratorToArray(layer.parts);
      for (const p of parts) {
        if ((p as any)._className !== 'Node' && (p as any)._className !== 'Link' && (p as any)._className !== 'Group') continue;
        layer.remove(p);
      }
    }
    this.requestUpdate();
  }

  removeParts(coll: any, ensureBounds: boolean = true): void {
    const model: any = this._model;
    const iter: any = this._iterateParts(coll);
    const nodes: any[] = [];
    const links: any[] = [];
    if (iter && iter.next) {
      while (iter.next()) {
        const p = iter.value;
        if (!p || !p.data) continue;
        if ((p as any)._className === 'Link') links.push(p.data);
        else nodes.push(p.data);
      }
    }
    for (const ld of links) if (typeof model.removeLinkData === 'function') model.removeLinkData(ld);
    for (const nd of nodes) model.removeNodeData(nd);
    if (ensureBounds) this.invalidateDocumentBounds();
    this.requestUpdate();
  }

  /**
   * 官方这几个方法都接受 Iterable（List/Set/图元集合）或者普通数组。
   * 本项目的 `List.iterator` 是**属性**（一个 Iterator 对象）而不是方法，
   * 所以不能无脑 `coll.iterator()`。
   */
  private _iterateParts(coll: any): any {
    if (coll == null) return null;
    if (typeof coll.iterator === 'function') return coll.iterator();
    if (coll.iterator && typeof coll.iterator.next === 'function') return coll.iterator;
    if (typeof coll.next === 'function') return coll;
    if (Array.isArray(coll)) {
      let i = 0;
      return {
        value: undefined as any,
        next: function (): boolean {
          if (i < coll.length) {
            (this as any).value = coll[i++];
            return true;
          }
          return false;
        }
      };
    }
    return null;
  }

  moveParts(coll: any, delta: Point, check: boolean = true): void {
    const iter: any = this._iterateParts(coll);
    if (iter && iter.next) {
      while (iter.next()) {
        const p = iter.value;
        if (!p || (p as any)._className === 'Link') continue;
        const np = p.position.copy();
        np.x += delta.x; np.y += delta.y;
        p.position = np;
      }
    }
    this.requestUpdate();
  }

  copyParts(coll: any, targetDiagram?: any, check: boolean = false): any {
    const result = new Map<any, any>();
    const srcModel: any = this._model;
    const dstModel: any = targetDiagram ? targetDiagram.model : srcModel;
    const iter: any = this._iterateParts(coll);
    const dataMap = new Map<any, any>();
    const items: any[] = [];
    if (iter && iter.next) {
      while (iter.next()) {
        const p = iter.value;
        if (p && p.data) items.push(p);
      }
    }
    for (const p of items) {
      const d = JSON.parse(JSON.stringify(p.data));
      const oldKey = srcModel.getKeyForNodeData(p.data);
      if (d.key !== undefined) d.key = dstModel.makeKey ? dstModel.makeKey() : (dstModel.makeUniqueKeyString ? dstModel.makeUniqueKeyString() : (d.key + '_copy'));
      const isLink = (p as any)._className === 'Link';
      if (isLink) { if (typeof dstModel.addLinkData === 'function') dstModel.addLinkData(d); }
      else dstModel.addNodeData(d);
      if (oldKey !== undefined) dataMap.add(oldKey, dstModel.getKeyForNodeData(d));
    }
    if (targetDiagram) targetDiagram.rebuildParts();
    else this.rebuildParts();
    for (const p of items) {
      const srcKey = srcModel.getKeyForNodeData(p.data);
      const dstPart = targetDiagram ? targetDiagram.findPartForData(dataMap.get(srcKey)) : this.findPartForData(dataMap.get(srcKey));
      result.add(p, dstPart);
    }
    return result;
  }

  // ---- 选择/高亮 ----
  private _nodeSelectionAdornmentTemplate: any = null;
  private _linkSelectionAdornmentTemplate: any = null;
  private _groupSelectionAdornmentTemplate: any = null;

  get nodeSelectionAdornmentTemplate(): any { return this._nodeSelectionAdornmentTemplate; }
  set nodeSelectionAdornmentTemplate(val: any) { this._nodeSelectionAdornmentTemplate = val; }
  get linkSelectionAdornmentTemplate(): any { return this._linkSelectionAdornmentTemplate; }
  set linkSelectionAdornmentTemplate(val: any) { this._linkSelectionAdornmentTemplate = val; }
  get groupSelectionAdornmentTemplate(): any { return this._groupSelectionAdornmentTemplate; }
  set groupSelectionAdornmentTemplate(val: any) { this._groupSelectionAdornmentTemplate = val; }

  highlightCollection(parts: any): void {
    const iter: any = parts && parts.iterator ? parts.iterator() : parts;
    if (iter && iter.next) {
      while (iter.next()) {
        const p = iter.value;
        if (p && !this._highlighteds.has(p)) this._highlighteds.add(p);
      }
    }
  }
  highlight(part: Part): void {
    if (part && !this._highlighteds.has(part)) this._highlighteds.add(part);
  }
  clearHighlighteds(): void {
    this._highlighteds.clear();
  }

  // ---- 渲染/导出 ----
  private _renderingHints: any = null;
  private _divBackground: string = '';
  private _pixelRatio: number = 1;
  private _attached: boolean = false;

  setRenderingHint(name: string, val: any): void {
    if (!this._renderingHints) this._renderingHints = {};
    this._renderingHints[name] = val;
  }
  getRenderingHint(name: string): any {
    return this._renderingHints ? this._renderingHints[name] : undefined;
  }
  resetRenderingHints(): void {
    this._renderingHints = {};
  }
  setDivBackground(value: string): void {
    this._divBackground = value;
    if (this._div) this._div.style.background = value;
  }
  computePixelRatio(): number {
    if (typeof window !== 'undefined' && typeof window.devicePixelRatio === 'number') return window.devicePixelRatio;
    return 1;
  }
  attach(): void {
    this._attached = true;
  }
  get isAttached(): boolean { return this._attached; }

  maybeUpdate(): void {
    if (this._attached) this.requestUpdate();
  }
  get isUpdateRequested(): boolean { return this._isUpdateRequestedFlag; }

  private _isUpdateRequestedFlag: boolean = false;

  makeSVG(opts?: any): any {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    const db = this.documentBounds;
    svg.setAttribute('width', String(db.width));
    svg.setAttribute('height', String(db.height));
    svg.setAttribute('viewBox', db.x + ' ' + db.y + ' ' + db.width + ' ' + db.height);
    return svg;
  }
  makeSvg(opts?: any): any { return this.makeSVG(opts); }
  makeImageData(opts?: any): string { return ''; }
  makeImage(opts?: any): any {
    const data = this.makeImageData(opts);
    if (!data) return null;
    const img = new Image();
    img.src = data;
    return img;
  }

  // ---- 路由/布局（占位/惰性） ----
  // 官方 go.d.ts:13868 `get routers(): List<Router>` —— 是 List 不是 Set。
  // 之前用原生 `Set`，样例写 `myDiagram.routers.push(...)` 直接
  // `push is not a function`（实测 AvoidsLinksRouter）。
  private _routers: List<any> = new List<any>();
  get routers(): List<any> { return this._routers; }
  set routers(val: List<any> | any[] | Iterable<any>) {
    this._routers = val instanceof List ? val : new List<any>(val);
  }
  findRouter(part: any): any { return null; }
  addRenderer(renderer: any): void {
    if (!this._renderer) this._renderer = renderer;
  }
  removeRenderer(renderer: any): void {
    if (this._renderer === renderer) (this._renderer as any) = null;
  }
  setupRouters(): void { }
  addInvalidRoute(part: any): void { }
  computeMove(part: any, pt: Point): void { }
  getPositions(part: any, t: any): any { return null; }
  validCycle(): boolean { return true; }
  getInputOption(prop: string): any { return undefined; }
  setInputOption(prop: string, val: any): void { }
  setProperties(obj: any): void { }
  setRTL(isRTL: boolean): void { }
  /**
   * 对齐官方 `Diagram.delayInitialization(func)`（见 `node_modules/gojs/release/go.js`）：
   *   `t !== null && U.yn(() => { ...; t(this) }, 1)`
   * 即延迟到下一次 macrotask 再调用，并且**把 Diagram 自己作为参数传进去**。
   * 之前这里写成 `callback()`，既没延迟也没传参，
   * `myDiagram.delayInitialization(loadTree)` 这类样例直接
   * `Cannot read properties of undefined (reading 'model')`（实测 DragZooming）。
   */
  delayInitialization(callback?: ((d: Diagram) => void) | null): void {
    const fn = callback === undefined ? null : callback;
    if (fn !== null) {
      setTimeout(() => { fn(this); }, 1);
    }
  }
  toggleKeyboardControl(shown: boolean): void { }
  onViewportBoundsChanged(): void { this.requestUpdate(); }
  updateAllRelationshipsFromData(): void { }
  /** 官方 Diagram.updateAllThemeBindings：对所有部件应用 theme 绑定（PartManager.updateAllThemeBindings） */
  updateAllThemeBindings(): void {
    this._parts.each(pair => {
      const part = pair.value;
      if (part) this._applyThemeBindingsOnly(part, part);
    });
  }
  isTreePathToChildrenFn(): boolean { return this._isTreePathToChildren; }

  toString(): string {
    return 'Diagram';
  }

  // ============ 官方 Diagram API 对齐（阶段 6，收尾成员） ============

  private _avoidanceCellSize: Size = new Size(1, 1);
  private _avoidanceLimit: number = 1000;
  private _scaleComputation: ((thisDiagram: Diagram, newScale: number) => number) | null = null;
  private _handlesDragDropForTopLevelParts: boolean = false;
  private _partManager: any = null;

  get avoidanceCellSize(): Size { return this._avoidanceCellSize; }
  set avoidanceCellSize(val: Size) { this._avoidanceCellSize = new Size(val.width, val.height); }
  get avoidanceLimit(): number { return this._avoidanceLimit; }
  set avoidanceLimit(val: number) { this._avoidanceLimit = val; }
  get scaleComputation(): ((thisDiagram: Diagram, newScale: number) => number) | null { return this._scaleComputation; }
  set scaleComputation(val: ((thisDiagram: Diagram, newScale: number) => number) | null) { this._scaleComputation = val; }
  get handlesDragDropForTopLevelParts(): boolean { return this._handlesDragDropForTopLevelParts; }
  set handlesDragDropForTopLevelParts(val: boolean) { this._handlesDragDropForTopLevelParts = val; }
  get partManager(): any { return this._partManager; }
  set partManager(val: any) { this._partManager = val; }

  initializePartManager(partManager: any): void { }

  diagramScroll(scrollbar: any): void {
    if (scrollbar) {
      const sp = this.documentBounds.position;
      const scale = this._scale;
      this._position = new Point(-scrollbar.scrollLeft / scale + sp.x, -scrollbar.scrollTop / scale + sp.y);
    }
    this.requestUpdate();
  }

  /** 官方 `Diagram.doLinkRouting(container)`：遍历 routers，canRoute 过滤后 routeLinks(本图 links 集合, container) */
  doLinkRouting(container?: any): void {
    const c: any = container !== undefined && container !== null ? container : this;
    const routers: any = this._routers;
    if (!routers) return;
    // 官方传的是 `go.Set<Link>`（官方 `Diagram.Kr = new GSet`，见 go.js doLinkRouting），
    // 扩展 LinkLabelRouter 会 `this.layout.activeSet = links` 再 `activeSet.has(part)`。
    // 我们以前直接传 `this.links`（一个 Iterator，没有 `has`）→
    // `_a.has is not a function`（实测 LinkLabelRouter）。
    const linkSet = new Set<Link>();
    const partsIt = this._parts.iteratorValues;
    while (partsIt.next()) {
      const p = partsIt.value;
      if (p instanceof Link) linkSet.add(p);
    }
    const visit = (r: any): void => {
      if (!r || typeof r.canRoute !== 'function') return;
      if (!r.canRoute(c)) return;
      if (typeof r.routeLinks === 'function') r.routeLinks(linkSet, c);
    };
    if (typeof routers.each === 'function') {
      routers.each((r: any) => visit(r));
    } else if (Array.isArray(routers)) {
      for (const r of routers) visit(r);
    }
  }

  cacheGroupExternalLinks(start: boolean): void { }

  focusObject(obj: any): void {
    if (!obj) { if (this._div) this._div.focus(); return; }
    const part = obj.part;
    if (part && typeof part.pick === 'function') {
      const r = part.actualBounds;
      if (r) this.centerRect(r);
    }
    this.requestUpdate();
  }

  raiseChanged(flag: any, details: any): void {
    this.requestUpdate();
  }

  redraw(): void {
    if (this._renderer && typeof this._renderer.render === 'function') {
      this._renderer.render();
    } else {
      this.requestUpdate();
    }
  }

  reset(): void {
    this.clearSelection();
    this._highlighteds.clear();
    this._position = Point.Zero.copy();
    this._scale = 1;
    this.requestUpdate();
  }
}
