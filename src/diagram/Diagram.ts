import { Model, ObjectData } from '../model/Model';
import { GraphLinksModel } from '../model/GraphLinksModel';
import { TreeModel } from '../model/TreeModel';
import { ChangedEvent } from '../model/ChangedEvent';
import { Binding } from '../model/Binding';
import { EnumValue, AutoScaleUniform, AutoScaleUniformToFill } from '../core/EnumValues';
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
import { Iterator, Iterable as GojsIterable } from '../core/Iterable';
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

export class Diagram {

  private _div: HTMLDivElement | null = null;
  private _model: Model = new Model();
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
  private _padding: Margin = new Margin(0);

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

  _parts: Map<any, Part> = new Map<any, Part>();
  _nodeKeyMap: Map<any, Node> = new Map<any, Node>();

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

    if (div) {
      div.style.position = 'relative';
      div.style.overflow = 'hidden';
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
    if (this._modelChangeListener) {
      this._model.removeChangedListener(this._modelChangeListener);
    }
    this._model = val;
    if (this._modelChangeListener) {
      this._model.addChangedListener(this._modelChangeListener);
    }
    this.rebuildParts();
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
    return new Rect(this._position.x, this._position.y, vs.width / this._scale, vs.height / this._scale);
  }

  get documentBounds(): Rect {
    let bounds = new Rect();
    const layers = this._layers;
    for (const layer of layers) {
      if (layer.isTemporary) continue;
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part: Part = partsIt.value;
        if (!part.visible) continue;
        if (!(part as any).isInDocumentBounds) continue;
        const partBounds = part.getDocumentBounds();
        bounds = bounds.union(partBounds);
      }
    }
    if (bounds.isReal) {
      bounds = new Rect(
        bounds.x - this._padding.left,
        bounds.y - this._padding.top,
        bounds.width + this._padding.left + this._padding.right,
        bounds.height + this._padding.top + this._padding.bottom
      );
    }
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
    const it = this._parts.values;
    while (it.next()) {
      result.add(it.value);
    }
    return result.iterator;
  }

  get nodes(): Iterator<Node> {
    const result = new List<Node>();
    const it = this._parts.values;
    while (it.next()) {
      const part = it.value;
      if (part instanceof Node) result.add(part);
    }
    return result.iterator;
  }

  get links(): Iterator<Link> {
    const result = new List<Link>();
    const it = this._parts.values;
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

  private _initialContentAlignment: Spot | null = null;
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

  add(part: Part): void {
    const layerName = part.layerName || '';
    let layer = this.findLayer(layerName);
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
    this.requestUpdate();
  }

  remove(part: Part): void {
    for (const layer of this._layers) {
      if (layer.contains(part)) {
        layer.remove(part);
        (part as any)._diagram = null;
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
    const it = this._parts.values;
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
    const it = this._parts.values;
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
      const partsArray = partsIt.toArray();
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

  select(part: Part): void {
    this.clearSelection();
    if (this._allowSelect && part.selectable) {
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

  commit(func: () => any, tname: string = 'commit'): any {
    return this._model.commit(func, tname);
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
    this.requestUpdate(invalidate);
  }

  updateAllTargetBindings(propname?: string): void {
    const it = this._parts.values;
    while (it.next()) {
      const part = it.value;
      if (part instanceof Part) {
        this._updateBindingsForPart(part, propname);
      }
    }
    this.requestUpdate();
  }

  zoomToFit(): void {
    const db = this.documentBounds;
    const vs = this.viewSize;
    if (db.width <= 0 || db.height <= 0 || vs.width <= 0 || vs.height <= 0) return;

    const scaleX = vs.width / db.width;
    const scaleY = vs.height / db.height;
    const newScale = Math.min(scaleX, scaleY);

    this._scale = Math.max(this._minScale, Math.min(this._maxScale, newScale));
    this._position = new Point(db.x, db.y);
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
    const db = this.documentBounds;
    const vs = this.viewSize;
    const docPoint = docSpot.positionInRect(db);
    const viewPoint = viewSpot.positionInRect(new Rect(0, 0, vs.width, vs.height));
    const docW = vs.width / this._scale;
    const docH = vs.height / this._scale;
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

    if (this._isInitial && this._layout) {
      this._layoutInvalid = true;
    }

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
      if (key === 'model' || key === 'div') continue;
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
    const names = ['Background', 'Grid', '', 'Foreground', 'Adornment', 'Tool'];
    for (const name of names) {
      const layer = new Layer();
      layer.name = name;
      layer.diagram = this;
      if (name === 'Adornment' || name === 'Tool') {
        layer.isTemporary = true;
      }
      this._layers.push(layer);
    }

    this._createDefaultGrid();
  }

  private _createDefaultGrid(): void {
    const gridPanel = new Panel(PanelGrid);
    (gridPanel as any)._gridCellSize = new Size(50, 50);

    const lineH = new Shape();
    (lineH as any).figure = 'LineH';
    lineH.stroke = 'lightgray';
    lineH.strokeWidth = 0.5;
    gridPanel.add(lineH);

    const lineV = new Shape();
    (lineV as any).figure = 'LineV';
    lineV.stroke = 'lightgray';
    lineV.strokeWidth = 0.5;
    gridPanel.add(lineV);

    const gridPart = new Part();
    gridPart.add(gridPanel);
    (gridPart as any).isInDocumentBounds = false;
    gridPart.layerName = 'Grid';
    gridPart.visible = false;

    const gridLayer = this.findLayer('Grid');
    if (gridLayer) {
      gridLayer.add(gridPart);
    }

    (this as any)._gridPart = gridPart;
  }

  get grid(): any {
    const gridLayer = this.findLayer('Grid');
    if (!gridLayer) return null;
    const it = gridLayer.parts;
    while (it.next()) {
      const part = it.value;
      const panel = (part as any)._elements && (part as any)._elements.length > 0 ? (part as any)._elements[0] : null;
      if (panel && (panel as any)._type === PanelGrid) {
        return panel;
      }
    }
    return null;
  }

  set grid(val: any) {
    const gridLayer = this.findLayer('Grid');
    if (!gridLayer) return;

    gridLayer.clear();

    if (val) {
      const gridPart = new Part();
      gridPart.add(val);
      (gridPart as any).isInDocumentBounds = false;
      gridPart.layerName = 'Grid';
      gridLayer.add(gridPart);
    }
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
    shape.isPanelMain = true;
    link.add(shape);
    return link;
  }

  private _clearAllParts(): void {
    for (const layer of this._layers) {
      layer.clear();
    }
    this._parts.clear();
    this._nodeKeyMap.clear();
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
      if (category && this._nodeTemplateMap.has(category)) {
        template = this._nodeTemplateMap.get(category)!;
      } else {
        template = this._nodeTemplate;
      }
    }

    const node = template!.copy() as Node;
    node.data = data;

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

    this._applyBindings(link, data);

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
    link.data = childData;
    link.fromNode = parentNode;
    link.toNode = childNode;

    this._parts.set(childData, link);

    this.add(link);

    this._applyBindings(link, childData);

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

  private _resolveBindingValue(binding: Binding, obj: GraphObject, data: ObjectData, part: Part): any {
    if (binding.isFromModel) {
      let val = this._model ? this._model.modelData[binding.sourceProperty] : undefined;
      if (binding.conversion) val = binding.conversion(val, obj, this._model);
      return val;
    } else if (binding.sourceObject !== null) {
      const sourceName = binding.sourceObject;
      let sourceObj: GraphObject | null = null;
      if (sourceName === '') {
        sourceObj = part as any;
      } else {
        sourceObj = part.findObject(sourceName);
      }
      let val: any;
      if (sourceObj) {
        val = (sourceObj as any)[binding.sourceProperty];
      } else {
        val = undefined;
      }
      if (binding.conversion) val = binding.conversion(val, obj, this._model);
      return val;
    } else {
      return binding.getValueFromSource(data, obj, this._model);
    }
  }

  private _applyBindings(part: Part, data: ObjectData): void {
    this._applyBindingsToObject(part, data, part);
  }

  private _applyBindingsToObject(obj: GraphObject, data: ObjectData, part: Part): void {
    const bindings: Binding[] = (obj as any)._bindings;
    if (bindings && bindings.length > 0) {
      for (const binding of bindings) {
        const val = this._resolveBindingValue(binding, obj, data, part);
        (obj as any)[binding.targetProperty] = val;
      }
    }
    if (obj instanceof Panel) {
      const elements = (obj as Panel)._elements;
      for (const child of elements) {
        this._applyBindingsToObject(child, data, part);
      }
    }
  }

  private _updateBindingsForPart(part: Part, propname?: string): void {
    const data = (part as any).data;
    if (!data) return;
    this._updateBindingsForObject(part, data, propname, part);
  }

  private _updateBindingsForObject(obj: GraphObject, data: ObjectData, propname?: string, part?: Part): void {
    const bindings: Binding[] = (obj as any)._bindings;
    if (bindings && bindings.length > 0) {
      for (const binding of bindings) {
        if (binding.sourceObject !== null || propname === undefined || propname === binding.sourceProperty) {
          const val = this._resolveBindingValue(binding, obj, data, part!);
          (obj as any)[binding.targetProperty] = val;
        }
      }
    }
    if (obj instanceof Panel) {
      const elements = (obj as Panel)._elements;
      for (const child of elements) {
        this._updateBindingsForObject(child, data, propname, part);
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
          this._addNodeForData(data);
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
          this.updateAllTargetBindings();
        } else if (data) {
          const part = this._parts.get(data);
          if (part) {
            this._updateBindingsForPart(part, e.propertyName);
            if (e.propertyName === this._model.nodeKeyProperty && part instanceof Node) {
              this._nodeKeyMap.remove(e.oldValue);
              this._nodeKeyMap.set(e.newValue, part);
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
      if (needsLayout && this._layout && (this._layout as any).isOngoing) {
        (this._layout as any).invalidateLayout();
      }
    }

    this._raiseChangedEvent(e);
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
        this._parts.remove(data);
      }
      this.remove(link);
    }

    if (this._model instanceof TreeModel) {
      const tm = this._model as TreeModel;
      for (const nodeData of this._model.nodeDataArray) {
        const parentKey = tm.getParentKeyForNodeData(nodeData);
        if (parentKey !== undefined && parentKey !== null) {
          if (!this._parts.has(nodeData)) {
            this._addLinkForTreeData(nodeData, parentKey);
          }
        }
      }
    }
  }

  private _raiseChangedEvent(e: ChangedEvent): void {
    for (const listener of this._changedListeners) {
      listener(e);
    }
  }

  private _raiseDiagramEvent(name: string, ...args: any[]): void {
    const listeners = this._diagramListeners.get(name);
    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }
  }

  raiseDiagramEvent(name: string, ...args: any[]): void {
    this._raiseDiagramEvent(name, ...args);
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
      this._layoutInvalid = false;
      this._performLayout();
    }

    this._updateGeometry();

    if (this._renderer) {
      this._renderer.render();
    }

    if (this._animationManager.isAnimating) {
      this.requestUpdate();
    }
  }

  private _performLayout(): void {
    if (this._layout && typeof this._layout.doLayout === 'function') {
      if ((this._layout as any).diagram !== this) {
        (this._layout as any).diagram = this;
      }
      if ((this._layout as any).isInitial || !(this._layout as any).isValidLayout) {
        this._layout.doLayout(this);
      }
    }
    for (const layer of this._layers) {
      if (layer.isTemporary) continue;
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if ((part as any)._className === 'Group' && (part as any).layout) {
          const groupLayout = (part as any).layout;
          if ((groupLayout as any).isInitial || !(groupLayout as any).isValidLayout) {
            (groupLayout as any).diagram = this;
            groupLayout.doLayout(part);
          }
        }
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
  }

  private _applyInitialViewport(): void {
    if (this._initialAutoScale === AutoScaleUniform) {
      this.zoomToFit();
    } else if (this._initialAutoScale === AutoScaleUniformToFill) {
      const db = this.documentBounds;
      const vs = this.viewSize;
      if (db.width > 0 && db.height > 0 && vs.width > 0 && vs.height > 0) {
        const newScale = Math.max(vs.width / db.width, vs.height / db.height);
        this._scale = Math.max(this._minScale, Math.min(this._maxScale, newScale));
        this._position = new Point(db.x, db.y);
      }
    } else if (!isNaN(this._initialScale)) {
      this._scale = Math.max(this._minScale, Math.min(this._maxScale, this._initialScale));
    }

    if (this._initialPosition) {
      this._position = this._initialPosition.copy();
    } else if (this._initialContentAlignment) {
      this.alignDocument(this._initialContentAlignment, Spot.Center);
    }
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
    const viewSize = this.viewSize;
    const availW = viewSize.width > 0 ? viewSize.width : 800;
    const availH = viewSize.height > 0 ? viewSize.height : 600;

    const partsToLayout: Part[] = [];
    for (const layer of this._layers) {
      if (!layer.visible) continue;
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part: Part = partsIt.value;
        if (!part.visible) continue;

        part._measure(Infinity, Infinity);
        partsToLayout.push(part);
      }
    }

    if (!this._layout) {
      let autoX = 50;
      let autoY = 50;
      const spacing = 20;
      let rowMaxHeight = 0;
      const maxWidth = availW - 100;

      for (const part of partsToLayout) {
        if (part instanceof Link) continue;

        const loc = part.location;
        if (isNaN(loc.x) || isNaN(loc.y)) {
          const mb = part.measuredBounds;
          if (autoX + mb.width > maxWidth && autoX > 50) {
            autoX = 50;
            autoY += rowMaxHeight + spacing;
            rowMaxHeight = 0;
          }
          part.location = new Point(autoX, autoY);
          autoX += mb.width + spacing;
          rowMaxHeight = Math.max(rowMaxHeight, mb.height);
        }
      }
    }

    for (const part of partsToLayout) {
      const loc = part.location;
      const x = isNaN(loc.x) ? 0 : loc.x;
      const y = isNaN(loc.y) ? 0 : loc.y;
      const mb = part.measuredBounds;
      part._arrange(new Rect(x, y, mb.width, mb.height));

      if (part instanceof Link) {
        (part as Link).computePoints();
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
}
