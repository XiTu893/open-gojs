import {
  EnumValue,
  StretchDefault, StretchFill, StretchNone, StretchUniform, StretchUniformToFill,
  StretchHorizontal, StretchVertical,
  FlipNone, FlipHorizontal, FlipVertical, FlipBoth,
  SegmentOrientationNone,
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable, PanelPosition, PanelLink,
  PanelViewbox, PanelGraduated, PanelGrid, PanelTableRow, PanelTableColumn,
  BrushSolid, BrushLinear, BrushRadial
} from '../core/EnumValues';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin, MarginLike } from '../core/Margin';
import { BrushLike, Brush } from '../core/Brush';
import { Geometry } from '../core/Geometry';
import { Binding } from '../model/Binding';
import { RowColumnDefinition } from './RowColumnDefinition';
import type { Panel } from './Panel';
import type { Part } from './Part';
import type { TextBlock } from './TextBlock';
import type { Shape } from './Shape';
import type { Picture } from './Picture';

type Diagram = any;
type Layer = any;

/**
 * GraphObject - base class for ALL visual objects in the GoJS diagramming library.
 * This includes shapes, text blocks, pictures, panels, and parts.
 */
export class GraphObject {

  // ============ Protected fields ============
  protected _panel: Panel | null = null;
  protected _part: Part | null = null;
  protected _actualBounds: Rect = new Rect();
  protected _measuredBounds: Rect = new Rect();
  protected _naturalBounds: Rect = new Rect();
  protected _bindings: Binding[] = [];
  protected _isInDocument: boolean = false;
  protected _isPlaceholder: boolean = false;
  protected _className: string = 'GraphObject';

  // ============ Private property storage ============
  private _desiredSize: Size = Size.NaN.copy();
  private _minSize: Size = new Size(0, 0);
  private _maxSize: Size = new Size(Infinity, Infinity);
  private _margin: Margin = Margin.Zero.copy();
  private _alignment: Spot = Spot.Default.copy();
  private _alignmentFocus: Spot = Spot.Default.copy();
  private _angle: number = 0;
  private _opacity: number = 1;
  protected _visible: boolean = true;
  private _stretch: EnumValue = StretchDefault;
  private _cursor: string = '';
  private _name: string = '';
  private _column: number = 0;
  private _columnSpan: number = 1;
  private _row: number = 0;
  private _rowSpan: number = 1;
  private _scale: number = 1;
  private _interval: number = 1;
  private _flip: EnumValue = FlipNone;
  private _shadowVisible: boolean | null = null;
  private _background: BrushLike = '';
  private _pickable: boolean = true;
  private _isActionable: boolean = false;
  private _isPanelMain: boolean = false;
  private _portId: string = '';
  private _contextMenu: any = null;
  private _toolTip: any = null;
  private _fromLinkable: boolean = false;
  private _toLinkable: boolean = false;
  private _fromLinkableDuplicates: boolean = false;
  private _toLinkableDuplicates: boolean = false;
  private _fromLinkableSelfNode: boolean = false;
  private _toLinkableSelfNode: boolean = false;
  private _fromMaxLinks: number = Infinity;
  private _toMaxLinks: number = Infinity;
  private _fromSpot: Spot = Spot.Default.copy();
  private _toSpot: Spot = Spot.Default.copy();
  private _fromEndSegmentLength: number = 10;
  private _toEndSegmentLength: number = 10;
  private _fromShortLength: number = 0;
  private _toShortLength: number = 0;
  private _segmentIndex: number = NaN;
  private _segmentFraction: number = 0;
  private _segmentOffset: Point = new Point(NaN, NaN);
  private _segmentOrientation: EnumValue = SegmentOrientationNone;
  private _position: Point = new Point(NaN, NaN);

  // ============ Event handlers ============
  private _click: ((e: any, obj: GraphObject) => void) | null = null;
  private _doubleClick: ((e: any, obj: GraphObject) => void) | null = null;
  private _contextClick: ((e: any, obj: GraphObject) => void) | null = null;
  private _mouseEnter: ((e: any, obj: GraphObject) => void) | null = null;
  private _mouseLeave: ((e: any, obj: GraphObject) => void) | null = null;
  private _mouseOver: ((e: any, obj: GraphObject) => void) | null = null;
  private _mouseHover: ((e: any, obj: GraphObject) => void) | null = null;
  private _mouseHold: ((e: any, obj: GraphObject) => void) | null = null;
  private _mouseDragEnter: ((e: any, obj: GraphObject) => void) | null = null;
  private _mouseDragLeave: ((e: any, obj: GraphObject) => void) | null = null;
  private _mouseDrop: ((e: any, obj: GraphObject) => void) | null = null;
  private _actionDown: ((e: any, obj: GraphObject) => void) | null = null;
  private _actionMove: ((e: any, obj: GraphObject) => void) | null = null;
  private _actionUp: ((e: any, obj: GraphObject) => void) | null = null;
  private _actionCancel: ((e: any, obj: GraphObject) => void) | null = null;
  private _enabledChanged: ((obj: GraphObject) => void) | null = null;

  constructor() {
    // Base constructor - subclasses extend
  }

  // ============ Properties with change notification ============

  /** Convenience property for desiredSize.width */
  get width(): number { return this._desiredSize.width; }
  set width(val: number) {
    if (this._desiredSize.width === val) return;
    this._desiredSize = new Size(val, this._desiredSize.height);
    this._invalidateMeasure();
  }

  /** Convenience property for desiredSize.height */
  get height(): number { return this._desiredSize.height; }
  set height(val: number) {
    if (this._desiredSize.height === val) return;
    this._desiredSize = new Size(this._desiredSize.width, val);
    this._invalidateMeasure();
  }

  get desiredSize(): Size { return this._desiredSize; }
  set desiredSize(val: Size) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Size(val.width || 0, val.height || 0) : Size.NaN.copy());
    if (this._desiredSize.equals(s)) return;
    this._desiredSize = s;
    this._invalidateMeasure();
  }

  get minSize(): Size { return this._minSize; }
  set minSize(val: Size) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Size(val.width || 0, val.height || 0) : Size.Zero.copy());
    if (this._minSize.equals(s)) return;
    this._minSize = s;
    this._invalidateMeasure();
  }

  get maxSize(): Size { return this._maxSize; }
  set maxSize(val: Size) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Size(val.width || 0, val.height || 0) : Size.NaN.copy());
    if (this._maxSize.equals(s)) return;
    this._maxSize = s;
    this._invalidateMeasure();
  }

  get margin(): Margin { return this._margin; }
  set margin(val: MarginLike) {
    const m = typeof val === 'number' ? new Margin(val) : val;
    const c = m && typeof (m as any).copy === 'function' ? (m as any).copy() : (m ? new Margin((m as any).top || 0, (m as any).right || 0, (m as any).bottom || 0, (m as any).left || 0) : Margin.Zero.copy());
    if (this._margin.equals(c)) return;
    this._margin = c;
    this._invalidateMeasure();
  }

  get alignment(): Spot { return this._alignment; }
  set alignment(val: Spot) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
    if (this._alignment.equals(s)) return;
    this._alignment = s;
    this._invalidateArrange();
  }

  get alignmentFocus(): Spot { return this._alignmentFocus; }
  set alignmentFocus(val: Spot) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
    if (this._alignmentFocus.equals(s)) return;
    this._alignmentFocus = s;
    this._invalidateArrange();
  }

  get angle(): number { return this._angle; }
  set angle(val: number) {
    if (this._angle === val) return;
    this._angle = val;
    this._invalidateArrange();
  }

  get opacity(): number { return this._opacity; }
  set opacity(val: number) {
    if (this._opacity === val) return;
    this._opacity = val;
  }

  get visible(): boolean { return this._visible; }
  set visible(val: boolean) {
    if (this._visible === val) return;
    this._visible = val;
    this._invalidateMeasure();
  }

  get stretch(): EnumValue { return this._stretch; }
  set stretch(val: EnumValue) {
    if (this._stretch === val) return;
    this._stretch = val;
    this._invalidateMeasure();
  }

  get cursor(): string { return this._cursor; }
  set cursor(val: string) {
    this._cursor = val;
  }

  get name(): string { return this._name; }
  set name(val: string) {
    this._name = val;
  }

  get position(): Point { return this._position; }
  set position(val: Point) {
    const p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : Point.Zero.copy());
    if (this._position.equals(p)) return;
    this._position = p;
    this._invalidateArrange();
  }

  get column(): number { return this._column; }
  set column(val: number) {
    if (this._column === val) return;
    this._column = val;
    this._invalidateMeasure();
  }

  get columnSpan(): number { return this._columnSpan; }
  set columnSpan(val: number) {
    if (this._columnSpan === val) return;
    this._columnSpan = val;
    this._invalidateMeasure();
  }

  get row(): number { return this._row; }
  set row(val: number) {
    if (this._row === val) return;
    this._row = val;
    this._invalidateMeasure();
  }

  get rowSpan(): number { return this._rowSpan; }
  set rowSpan(val: number) {
    if (this._rowSpan === val) return;
    this._rowSpan = val;
    this._invalidateMeasure();
  }

  get interval(): number { return this._interval; }
  set interval(val: number) { this._interval = val; }

  get scale(): number { return this._scale; }
  set scale(val: number) {
    if (this._scale === val) return;
    this._scale = val;
    this._invalidateArrange();
  }

  get flip(): EnumValue { return this._flip; }
  set flip(val: EnumValue) {
    if (this._flip === val) return;
    this._flip = val;
    this._invalidateArrange();
  }

  get shadowVisible(): boolean | null { return this._shadowVisible; }
  set shadowVisible(val: boolean | null) {
    if (this._shadowVisible === val) return;
    this._shadowVisible = val;
  }

  get background(): BrushLike { return this._background; }
  set background(val: BrushLike) {
    this._background = val;
  }

  get pickable(): boolean { return this._pickable; }
  set pickable(val: boolean) {
    this._pickable = val;
  }

  get isActionable(): boolean { return this._isActionable; }
  set isActionable(val: boolean) {
    this._isActionable = val;
  }

  get isPanelMain(): boolean { return this._isPanelMain; }
  set isPanelMain(val: boolean) {
    this._isPanelMain = val;
  }

  get portId(): string { return this._portId; }
  set portId(val: string) {
    this._portId = val;
  }

  get contextMenu(): any { return this._contextMenu; }
  set contextMenu(val: any) { this._contextMenu = val; }

  get toolTip(): any { return this._toolTip; }
  set toolTip(val: any) { this._toolTip = val; }

  get fromLinkable(): boolean { return this._fromLinkable; }
  set fromLinkable(val: boolean) {
    this._fromLinkable = val;
  }

  get toLinkable(): boolean { return this._toLinkable; }
  set toLinkable(val: boolean) {
    this._toLinkable = val;
  }

  get fromLinkableDuplicates(): boolean { return this._fromLinkableDuplicates; }
  set fromLinkableDuplicates(val: boolean) {
    this._fromLinkableDuplicates = val;
  }

  get toLinkableDuplicates(): boolean { return this._toLinkableDuplicates; }
  set toLinkableDuplicates(val: boolean) {
    this._toLinkableDuplicates = val;
  }

  get fromLinkableSelfNode(): boolean { return this._fromLinkableSelfNode; }
  set fromLinkableSelfNode(val: boolean) {
    this._fromLinkableSelfNode = val;
  }

  get toLinkableSelfNode(): boolean { return this._toLinkableSelfNode; }
  set toLinkableSelfNode(val: boolean) {
    this._toLinkableSelfNode = val;
  }

  get fromMaxLinks(): number { return this._fromMaxLinks; }
  set fromMaxLinks(val: number) {
    this._fromMaxLinks = val;
  }

  get toMaxLinks(): number { return this._toMaxLinks; }
  set toMaxLinks(val: number) {
    this._toMaxLinks = val;
  }

  get fromSpot(): Spot { return this._fromSpot; }
  set fromSpot(val: Spot) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
    if (this._fromSpot.equals(s)) return;
    this._fromSpot = s;
  }

  get toSpot(): Spot { return this._toSpot; }
  set toSpot(val: Spot) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
    if (this._toSpot.equals(s)) return;
    this._toSpot = s;
  }

  get fromEndSegmentLength(): number { return this._fromEndSegmentLength; }
  set fromEndSegmentLength(val: number) {
    this._fromEndSegmentLength = val;
  }

  get toEndSegmentLength(): number { return this._toEndSegmentLength; }
  set toEndSegmentLength(val: number) {
    this._toEndSegmentLength = val;
  }

  get fromShortLength(): number { return this._fromShortLength; }
  set fromShortLength(val: number) {
    this._fromShortLength = val;
  }

  get toShortLength(): number { return this._toShortLength; }
  set toShortLength(val: number) {
    this._toShortLength = val;
  }

  get segmentIndex(): number { return this._segmentIndex; }
  set segmentIndex(val: number) {
    if (this._segmentIndex === val) return;
    this._segmentIndex = val;
  }

  get segmentFraction(): number { return this._segmentFraction; }
  set segmentFraction(val: number) {
    if (this._segmentFraction === val) return;
    this._segmentFraction = val;
  }

  get segmentOffset(): Point { return this._segmentOffset; }
  set segmentOffset(val: Point) {
    const p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : Point.Zero.copy());
    if (this._segmentOffset.equals(p)) return;
    this._segmentOffset = p;
  }

  get segmentOrientation(): EnumValue { return this._segmentOrientation; }
  set segmentOrientation(val: EnumValue) {
    if (this._segmentOrientation === val) return;
    this._segmentOrientation = val;
  }

  // ============ Read-only computed properties ============

  get actualBounds(): Rect { return this._actualBounds; }

  get measuredBounds(): Rect { return this._measuredBounds; }

  get naturalBounds(): Rect { return this._naturalBounds; }

  get panel(): Panel | null { return this._panel; }

  get part(): Part | null { return this._part; }

  get diagram(): Diagram | null {
    const p = this._part;
    return p ? (p as any)._diagram : null;
  }

  get layer(): Layer | null {
    const p = this._part;
    return p ? (p as any).layer : null;
  }

  // ============ Event handler properties ============

  get click(): ((e: any, obj: GraphObject) => void) | null { return this._click; }
  set click(val: ((e: any, obj: GraphObject) => void) | null) { this._click = val; }

  get doubleClick(): ((e: any, obj: GraphObject) => void) | null { return this._doubleClick; }
  set doubleClick(val: ((e: any, obj: GraphObject) => void) | null) { this._doubleClick = val; }

  get contextClick(): ((e: any, obj: GraphObject) => void) | null { return this._contextClick; }
  set contextClick(val: ((e: any, obj: GraphObject) => void) | null) { this._contextClick = val; }

  get mouseEnter(): ((e: any, obj: GraphObject) => void) | null { return this._mouseEnter; }
  set mouseEnter(val: ((e: any, obj: GraphObject) => void) | null) { this._mouseEnter = val; }

  get mouseLeave(): ((e: any, obj: GraphObject) => void) | null { return this._mouseLeave; }
  set mouseLeave(val: ((e: any, obj: GraphObject) => void) | null) { this._mouseLeave = val; }

  get mouseOver(): ((e: any, obj: GraphObject) => void) | null { return this._mouseOver; }
  set mouseOver(val: ((e: any, obj: GraphObject) => void) | null) { this._mouseOver = val; }

  get mouseHover(): ((e: any, obj: GraphObject) => void) | null { return this._mouseHover; }
  set mouseHover(val: ((e: any, obj: GraphObject) => void) | null) { this._mouseHover = val; }

  get mouseHold(): ((e: any, obj: GraphObject) => void) | null { return this._mouseHold; }
  set mouseHold(val: ((e: any, obj: GraphObject) => void) | null) { this._mouseHold = val; }

  get mouseDragEnter(): ((e: any, obj: GraphObject) => void) | null { return this._mouseDragEnter; }
  set mouseDragEnter(val: ((e: any, obj: GraphObject) => void) | null) { this._mouseDragEnter = val; }

  get mouseDragLeave(): ((e: any, obj: GraphObject) => void) | null { return this._mouseDragLeave; }
  set mouseDragLeave(val: ((e: any, obj: GraphObject) => void) | null) { this._mouseDragLeave = val; }

  get mouseDrop(): ((e: any, obj: GraphObject) => void) | null { return this._mouseDrop; }
  set mouseDrop(val: ((e: any, obj: GraphObject) => void) | null) { this._mouseDrop = val; }

  get actionDown(): ((e: any, obj: GraphObject) => void) | null { return this._actionDown; }
  set actionDown(val: ((e: any, obj: GraphObject) => void) | null) { this._actionDown = val; }

  get actionMove(): ((e: any, obj: GraphObject) => void) | null { return this._actionMove; }
  set actionMove(val: ((e: any, obj: GraphObject) => void) | null) { this._actionMove = val; }

  get actionUp(): ((e: any, obj: GraphObject) => void) | null { return this._actionUp; }
  set actionUp(val: ((e: any, obj: GraphObject) => void) | null) { this._actionUp = val; }

  get actionCancel(): ((e: any, obj: GraphObject) => void) | null { return this._actionCancel; }
  set actionCancel(val: ((e: any, obj: GraphObject) => void) | null) { this._actionCancel = val; }

  get enabledChanged(): ((obj: GraphObject) => void) | null { return this._enabledChanged; }
  set enabledChanged(val: ((obj: GraphObject) => void) | null) { this._enabledChanged = val; }

  // ============ Public methods ============

  /** Add a data binding to this object */
  bind(bindingOrTargetProp: Binding | string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this {
    if (typeof bindingOrTargetProp === 'string') {
      // Shorthand: .bind("fill", "color") or .bind("text")
      this._bindings.push(new Binding(bindingOrTargetProp, sourceProperty, conversion));
    } else {
      this._bindings.push(bindingOrTargetProp);
    }
    return this;
  }

  bindObject(targetProperty: string, sourceProperty: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any, sourceObject?: string): this {
    const binding = new Binding(targetProperty, sourceProperty, conversion || undefined);
    binding.sourceObject = sourceObject !== undefined ? sourceObject : '';
    if (backConversion) {
      binding.makeTwoWay(backConversion);
    }
    this._bindings.push(binding);
    return this;
  }

  bindTwoWay(targetProperty: string, sourceProperty?: string, backConversion?: (value: any, sourceData: any, model: any) => any, conversion?: (value: any, targetObject: any, model: any) => any): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion || undefined);
    binding.makeTwoWay(backConversion || undefined);
    this._bindings.push(binding);
    return this;
  }

  theme(targetProperty: string, sourceProperty: string, conversion?: (value: any, targetObject: any, model: any) => any): this {
    const binding = new Binding(targetProperty, sourceProperty, conversion);
    binding.sourceObject = '';
    this._bindings.push(binding);
    return this;
  }

  themeData(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion);
    binding.sourceObject = 'model';
    this._bindings.push(binding);
    return this;
  }

  themeModel(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion);
    binding.sourceObject = 'theme';
    this._bindings.push(binding);
    return this;
  }

  themeObject(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any, objectname?: string): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion);
    binding.sourceObject = objectname || '';
    this._bindings.push(binding);
    return this;
  }

  bindModel(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion);
    binding.sourceObject = 'model';
    this._bindings.push(binding);
    return this;
  }

  setProperties(props: Record<string, any>): this {
    return this.set(props as any);
  }

  /** Batch set properties */
  set(props: Partial<GraphObject>): this {
    if (!props) return this;
    const keys = Object.keys(props);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.charAt(0) === '_') continue;
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
      } else if (key in this) {
        (this as any)[key] = (props as any)[key];
      }
    }
    return this;
  }

  /** Virtual copy - creates a shallow copy of this GraphObject */
  copy(): GraphObject {
    const copy = new GraphObject();
    this._copyPropertiesTo(copy);
    return copy;
  }

  /** Apply a function to this object and return it */
  apply(func: (obj: GraphObject) => void): GraphObject {
    func(this);
    return this;
  }

  /** Find the nearest panel that has data bound to it */
  findBindingPanel(): Panel | null {
    let panel: Panel | null = this._panel;
    while (panel !== null) {
      if ((panel as any).data !== null && (panel as any).data !== undefined) {
        return panel;
      }
      panel = (panel as any)._panel;
    }
    return null;
  }

  attach(props: Record<string, any>): this {
    if (!props) return this;
    const keys = Object.keys(props);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.indexOf('.') >= 0) {
        const parts = key.split('.');
        let target: any = this;
        for (let j = 0; j < parts.length - 1; j++) {
          target = target[parts[j]];
          if (!target) break;
        }
        if (target) {
          target[parts[parts.length - 1]] = props[key];
        }
      } else {
        (this as any)[key] = props[key];
      }
    }
    return this;
  }

  /** Get the total angle of this object in document coordinates */
  getDocumentAngle(): number {
    let angle = this._angle;
    let panel: Panel | null = this._panel;
    while (panel !== null) {
      angle += (panel as any)._angle || 0;
      panel = (panel as any)._panel;
    }
    return angle;
  }

  /** Get the bounding rectangle of this object in document coordinates */
  getDocumentBounds(): Rect {
    const bounds = this._actualBounds.copy();
    let panel: Panel | null = this._panel;
    let obj: GraphObject = this;
    while (panel !== null) {
      const panelBounds = (panel as any)._actualBounds;
      const margin = (obj as any)._margin as Margin;
      bounds.x += panelBounds.x + margin.left;
      bounds.y += panelBounds.y + margin.top;
      obj = panel as any;
      panel = (panel as any)._panel;
    }
    return bounds;
  }

  /** Convert a local point to document coordinates */
  getDocumentPoint(local: Point): Point {
    const bounds = this.getDocumentBounds();
    return new Point(bounds.x + local.x, bounds.y + local.y);
  }

  /** Get the total scale of this object in document coordinates */
  getDocumentScale(): number {
    let scale = this._scale;
    let panel: Panel | null = this._panel;
    while (panel !== null) {
      scale *= (panel as any)._scale || 1;
      panel = (panel as any)._panel;
    }
    return scale;
  }

  /** Convert a document point to local coordinates */
  getLocalPoint(p: Point): Point {
    const bounds = this.getDocumentBounds();
    return new Point(p.x - bounds.x, p.y - bounds.y);
  }

  /** Check if this object is contained by the given panel */
  isContainedBy(panel: Panel): boolean {
    let p: Panel | null = this._panel;
    while (p !== null) {
      if (p === panel) return true;
      p = (p as any)._panel;
    }
    return false;
  }

  /** Check if this object is effectively enabled */
  isEnabledObject(): boolean {
    if (!this._pickable) return false;
    let obj: GraphObject | null = this;
    while (obj !== null) {
      if (!obj._visible) return false;
      obj = obj._panel as any;
    }
    return true;
  }

  /** Check if this object is effectively visible */
  isVisibleObject(): boolean {
    let obj: GraphObject | null = this;
    while (obj !== null) {
      if (!obj._visible) return false;
      obj = obj._panel as any;
    }
    return true;
  }

  /** Trigger a property change notification */
  trigger(propname: string, value?: any): void {
    const panel = this._panel;
    if (panel && typeof (panel as any)._handleObjectPropertyChanged === 'function') {
      (panel as any)._handleObjectPropertyChanged(this, propname, value);
    }
    const part = this._part;
    if (part && typeof (part as any)._handleObjectPropertyChanged === 'function') {
      (part as any)._handleObjectPropertyChanged(this, propname, value);
    }
  }

  // ============ Internal methods ============

  /** Invalidate the measurement of this object and its ancestors */
  _invalidateMeasure(): void {
    const panel = this._panel;
    if (panel && typeof (panel as any)._invalidateMeasure === 'function') {
      (panel as any)._invalidateMeasure();
    }
  }

  /** Invalidate the arrangement of this object and its ancestors */
  _invalidateArrange(): void {
    const panel = this._panel;
    if (panel && typeof (panel as any)._invalidateArrange === 'function') {
      (panel as any)._invalidateArrange();
    }
  }

  /** Measure this object within the given constraints */
  _measure(widthConstraint: number, heightConstraint: number): void {
    // Base implementation - subclasses override
    this._measuredBounds = new Rect(0, 0, widthConstraint, heightConstraint);
    this._applySizeConstraints();
  }

  /** Apply minSize/maxSize/desiredSize constraints to measured bounds */
  protected _applySizeConstraints(): void {
    const mb = this._measuredBounds;
    let w = mb.width;
    let h = mb.height;

    // Apply desiredSize if set (overrides natural size)
    if (!this._desiredSize.isReal) {
      // desiredSize not set, use natural size
    } else {
      if (!isNaN(this._desiredSize.width)) w = this._desiredSize.width;
      if (!isNaN(this._desiredSize.height)) h = this._desiredSize.height;
    }

    // Apply minSize
    if (!isNaN(this._minSize.width) && w < this._minSize.width) w = this._minSize.width;
    if (!isNaN(this._minSize.height) && h < this._minSize.height) h = this._minSize.height;

    // Apply maxSize
    if (!isNaN(this._maxSize.width) && w > this._maxSize.width) w = this._maxSize.width;
    if (!isNaN(this._maxSize.height) && h > this._maxSize.height) h = this._maxSize.height;

    this._measuredBounds = new Rect(0, 0, w, h);
  }

  /** Arrange this object within the given bounds */
  _arrange(bounds: Rect): void {
    // Base implementation - subclasses override
    this._actualBounds = bounds.copy();
  }

  // ============ Protected helpers ============

  /** Copy all properties to another GraphObject (used by copy()) */
  protected _copyPropertiesTo(copy: GraphObject): void {
    copy._desiredSize = this._desiredSize.copy();
    copy._minSize = this._minSize.copy();
    copy._maxSize = this._maxSize.copy();
    copy._margin = this._margin.copy();
    copy._alignment = this._alignment.copy();
    copy._alignmentFocus = this._alignmentFocus.copy();
    copy._angle = this._angle;
    copy._opacity = this._opacity;
    copy._visible = this._visible;
    copy._stretch = this._stretch;
    copy._cursor = this._cursor;
    copy._name = this._name;
    copy._position = this._position.copy();
    copy._column = this._column;
    copy._columnSpan = this._columnSpan;
    copy._row = this._row;
    copy._rowSpan = this._rowSpan;
    copy._scale = this._scale;
    copy._flip = this._flip;
    copy._shadowVisible = this._shadowVisible;
    copy._background = this._background;
    copy._pickable = this._pickable;
    copy._isActionable = this._isActionable;
    copy._isPanelMain = this._isPanelMain;
    copy._portId = this._portId;
    copy._contextMenu = this._contextMenu;
    copy._toolTip = this._toolTip;
    copy._fromLinkable = this._fromLinkable;
    copy._toLinkable = this._toLinkable;
    copy._fromLinkableDuplicates = this._fromLinkableDuplicates;
    copy._toLinkableDuplicates = this._toLinkableDuplicates;
    copy._fromLinkableSelfNode = this._fromLinkableSelfNode;
    copy._toLinkableSelfNode = this._toLinkableSelfNode;
    copy._fromMaxLinks = this._fromMaxLinks;
    copy._toMaxLinks = this._toMaxLinks;
    copy._fromSpot = this._fromSpot.copy();
    copy._toSpot = this._toSpot.copy();
    copy._fromEndSegmentLength = this._fromEndSegmentLength;
    copy._toEndSegmentLength = this._toEndSegmentLength;
    copy._fromShortLength = this._fromShortLength;
    copy._toShortLength = this._toShortLength;
    copy._segmentIndex = this._segmentIndex;
    copy._segmentFraction = this._segmentFraction;
    copy._segmentOffset = this._segmentOffset.copy();
    copy._segmentOrientation = this._segmentOrientation;
    // Copy bindings
    copy._bindings = this._bindings.map(b => b.copy());
    // Copy event handlers
    copy._click = this._click;
    copy._doubleClick = this._doubleClick;
    copy._contextClick = this._contextClick;
    copy._mouseEnter = this._mouseEnter;
    copy._mouseLeave = this._mouseLeave;
    copy._mouseOver = this._mouseOver;
    copy._mouseHover = this._mouseHover;
    copy._mouseHold = this._mouseHold;
    copy._mouseDragEnter = this._mouseDragEnter;
    copy._mouseDragLeave = this._mouseDragLeave;
    copy._mouseDrop = this._mouseDrop;
    copy._actionDown = this._actionDown;
    copy._actionMove = this._actionMove;
    copy._actionUp = this._actionUp;
    copy._actionCancel = this._actionCancel;
    copy._enabledChanged = this._enabledChanged;
  }

  // ============ Static constants ============

  static Default = StretchDefault;
  static Fill = StretchFill;
  static Horizontal = StretchHorizontal;
  static Vertical = StretchVertical;
  static None = StretchNone;
  static Uniform = StretchUniform;
  static UniformToFill = StretchUniformToFill;

  // ============ Static methods ============

  /** Factory method for creating GraphObjects - stub */
  static _classRegistry: Record<string, any> = {};

  static build: typeof GraphObject.make = GraphObject.make;

  static defineBuilder(name: string, func: Function): void {
    GraphObject._classRegistry[name] = func;
  }

  static takeBuilderArgument(obj: any, arg: any, def?: any): any {
    return arg !== undefined ? arg : def;
  }

  static make(type: any, ...args: any[]): any {
    const panelTypeMap: Record<string, EnumValue> = {
      'Auto': PanelAuto,
      'Vertical': PanelVertical,
      'Horizontal': PanelHorizontal,
      'Spot': PanelSpot,
      'Table': PanelTable,
      'Position': PanelPosition,
      'Link': PanelLink,
      'Viewbox': PanelViewbox,
      'Graduated': PanelGraduated,
      'Grid': PanelGrid,
      'TableRow': PanelTableRow,
      'TableColumn': PanelTableColumn,
    };

    const reg = GraphObject._classRegistry;
    let obj: any;
    let isPanelLike = false;

    if (typeof type === 'string') {
      switch (type) {
        case 'Auto':
        case 'Vertical':
        case 'Horizontal':
        case 'Spot':
        case 'Table':
        case 'Position':
        case 'Viewbox':
        case 'Graduated':
        case 'Grid':
        case 'TableRow':
        case 'TableColumn':
          obj = new reg['Panel'](panelTypeMap[type]);
          isPanelLike = true;
          break;
        case 'Node':
          obj = new reg['Node'](PanelAuto);
          isPanelLike = true;
          break;
        case 'Link':
          obj = new reg['Link']();
          isPanelLike = true;
          break;
        case 'Shape':
          obj = new reg['Shape']();
          break;
        case 'TextBlock':
          obj = new reg['TextBlock']();
          break;
        case 'Picture':
          obj = new reg['Picture']();
          break;
        case 'Panel':
          obj = new reg['Panel'](PanelAuto);
          isPanelLike = true;
          break;
        case 'Group':
          obj = new reg['Group']();
          isPanelLike = true;
          break;
        case 'Placeholder':
          obj = new reg['Placeholder']();
          break;
        case 'Adornment':
          obj = new reg['Adornment'](PanelAuto);
          isPanelLike = true;
          break;
        case 'Brush':
          obj = new Brush();
          break;
        case 'Geometry':
          obj = new Geometry();
          break;
        case 'RowColumnDefinition':
          obj = new RowColumnDefinition();
          break;
        default: {
          const builderFunc = reg[type];
          if (typeof builderFunc === 'function') {
            obj = builderFunc(args);
            isPanelLike = obj && typeof obj.add === 'function';
          } else {
            throw new Error('GraphObject.make: unknown type string: ' + type);
          }
          break;
        }
      }
    } else if (typeof type === 'function') {
      if (type === Brush) {
        obj = new Brush();
      } else if (type === Geometry) {
        obj = new Geometry();
      } else if (type === RowColumnDefinition) {
        obj = new RowColumnDefinition();
      } else {
        obj = new type();
        isPanelLike = typeof obj.add === 'function';
      }
    } else if (type instanceof EnumValue) {
      if (reg['Panel']) {
        obj = new reg['Panel'](type);
        isPanelLike = true;
      } else {
        throw new Error('GraphObject.make: Panel class not registered');
      }
    } else {
      throw new Error('GraphObject.make: first argument must be a string or a constructor function');
    }

    for (const arg of args) {
      if (arg === null || arg === undefined) continue;
      if (Array.isArray(arg)) {
        for (const item of arg) {
          if (item instanceof GraphObject && typeof obj.add === 'function') {
            obj.add(item);
          } else if (item instanceof RowColumnDefinition && typeof obj.addRowDefinition === 'function') {
            obj.addRowDefinition(item.row !== undefined ? item.row : undefined, item.height !== undefined ? item.height : undefined);
          }
        }
      } else if (arg instanceof RowColumnDefinition) {
        if (typeof obj.addRowDefinition === 'function') {
          obj.addRowDefinition(arg.row !== undefined ? arg.row : undefined, arg.height !== undefined ? arg.height : undefined);
        }
      } else if (typeof arg === 'string') {
        if (obj instanceof Brush) {
          if (arg === 'Linear') obj.type = BrushLinear;
          else if (arg === 'Radial') obj.type = BrushRadial;
          else if (arg === 'Solid') obj.type = BrushSolid;
          else { obj.type = BrushSolid; obj.color = arg; }
        } else if (obj instanceof Geometry) {
          const parsed = Geometry.parse(arg);
          if (parsed) {
            (obj as any).figures.clear();
            const it = parsed.figures.iterator;
            while (it.next()) {
              (obj as any).add(it.value);
            }
            (obj as any)._bounds = null;
          }
        } else if (isPanelLike && panelTypeMap[arg] !== undefined) {
          obj.type = panelTypeMap[arg];
        } else if ((obj as any)._className === 'TextBlock') {
          (obj as any).text = arg;
        } else if ((obj as any)._className === 'Shape') {
          (obj as any).figure = arg;
        } else if ((obj as any)._className === 'Picture') {
          (obj as any).source = arg;
        } else {
          obj.name = arg;
        }
      } else if (arg instanceof Binding) {
        if (typeof obj.bind === 'function') {
          obj.bind(arg);
        }
      } else if (arg instanceof GraphObject) {
        if (typeof obj.add === 'function') {
          obj.add(arg);
        }
      } else if (typeof arg === 'function') {
        arg(obj);
      } else if (typeof arg === 'number') {
        if (obj instanceof Brush) {
          const idx = args.indexOf(arg);
          const nextArg = idx >= 0 && idx + 1 < args.length ? args[idx + 1] : '';
          if (typeof nextArg === 'string') obj.addColorStop(arg, nextArg);
        }
      } else if (arg !== null && typeof arg === 'object' && !(arg instanceof EnumValue)) {
        if (typeof obj.set === 'function') {
          obj.set(arg);
        } else {
          const keys = Object.keys(arg);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key in obj) {
              obj[key] = arg[key];
            }
          }
        }
      }
    }

    return obj;
  }
}
