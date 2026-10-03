import {
  EnumValue,
  StretchDefault, StretchFill, StretchNone, StretchUniform, StretchUniformToFill,
  StretchHorizontal, StretchVertical,
  FlipNone, FlipHorizontal, FlipVertical, FlipBoth,
  SegmentOrientationNone,
  OrientationNone,
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable, PanelPosition, PanelLink,
  PanelViewbox, PanelGraduated, PanelGrid, PanelTableRow, PanelTableColumn,
  BrushSolid, BrushLinear, BrushRadial,
  ChangedEventProperty
} from '../core/EnumValues';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin, MarginLike } from '../core/Margin';
import { BrushLike, Brush } from '../core/Brush';
import { Geometry } from '../core/Geometry';
import { ensureHashId } from '../core/HashId';
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
  static readonly className: string = "GraphObject";

  // ============ Protected fields ============
  protected _panel: Panel | null = null;
  protected _part: Part | null = null;
  protected _actualBounds: Rect = new Rect(NaN, NaN, NaN, NaN);
  protected _measuredBounds: Rect = new Rect();
  protected _naturalBounds: Rect = new Rect();
  protected _bindings: Binding[] = [];
  protected _isInDocument: boolean = false;
  protected _isPlaceholder: boolean = false;
  protected _className: string = 'GraphObject';

  // ============ Private property storage ============
  protected _desiredSize: Size = Size.NaN.copy();
  protected _minSize: Size = new Size(0, 0);
  protected _maxSize: Size = new Size(Infinity, Infinity);
  protected _margin: Margin = Margin.Zero.copy();
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
  private _graduatedStart: number = 0;
  private _graduatedEnd: number = 1;
  private _graduatedSkip: ((val: number, obj: GraphObject) => boolean) | null = null;
  private _graduatedFunction: ((val: number, obj: GraphObject) => any) | null = null;
  private _flip: EnumValue = FlipNone;
  private _shadowVisible: boolean | null = null;
  private _background: BrushLike = null;
  private _pickable: boolean = true;
  private _isActionable: boolean = false;
  private _isPanelMain: boolean = false;
  private _portId: string | null = null;
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
  // 官方 LinkSettings/GraphObject 默认均为 NaN（回退链：link → port → 默认值）
  private _fromEndSegmentLength: number = NaN;
  private _toEndSegmentLength: number = NaN;
  private _fromShortLength: number = NaN;
  private _toShortLength: number = NaN;
  /** 官方 `port.Vd`：side-spot 连线端口 Knot 缓存（见 LinkKnot.ts） */
  private _knot: any = null;
  // 官方 LinkElementSettings 默认：segmentIndex = -1/0（-Infinity）、
  // segmentFraction = 0、segmentOffset = Point.kn = (0,0) 冻结点。
  // segmentIndex=-Infinity 是「沿路径中点」语义（measure 走 computeMidPoint 分支），
  // 早先的 NaN 默认会让 _arrangeLink 走「路径分数」分支，标签落点偏离官方。
  private _segmentIndex: number = -Infinity;
  private _segmentFraction: number = 0;
  private _segmentOffset: Point = new Point(0, 0);
  private _segmentOrientation: EnumValue = SegmentOrientationNone;
  protected _position: Point = new Point(NaN, NaN);

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
    if (isNaN(s.width)) s.width = 0;
    if (isNaN(s.height)) s.height = 0;
    if (this._minSize.equals(s)) return;
    this._minSize = s;
    this._invalidateMeasure();
  }

  get maxSize(): Size { return this._maxSize; }
  set maxSize(val: Size) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Size(val.width || 0, val.height || 0) : Size.NaN.copy());
    if (isNaN(s.width)) s.width = Infinity;
    if (isNaN(s.height)) s.height = Infinity;
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

  /**
   * 官方 GraphObject 的 graduated* 系列（Graduated 面板子元素用）：
   * graduatedStart/graduatedEnd 限定该元素参与的范围（0~1 比例），
   * graduatedSkip 决定某个刻度值是否跳过，graduatedFunction 自定义刻度文字。
   */
  get graduatedStart(): number { return this._graduatedStart; }
  set graduatedStart(val: number) {
    // 官方默认 0，setter 夹到 [0, 1]
    const v = val < 0 ? 0 : (val > 1 ? 1 : val);
    if (this._graduatedStart === v) return;
    this._graduatedStart = v;
    this._invalidateMeasure();
  }

  get graduatedEnd(): number { return this._graduatedEnd; }
  set graduatedEnd(val: number) {
    // 官方默认 1，setter 夹到 [0, 1]
    const v = val < 0 ? 0 : (val > 1 ? 1 : val);
    if (this._graduatedEnd === v) return;
    this._graduatedEnd = v;
    this._invalidateMeasure();
  }

  get graduatedSkip(): ((val: number, obj: GraphObject) => boolean) | null { return this._graduatedSkip; }
  set graduatedSkip(val: ((val: number, obj: GraphObject) => boolean) | null) { this._graduatedSkip = val; }

  get graduatedFunction(): ((val: number, obj: GraphObject) => any) | null { return this._graduatedFunction; }
  set graduatedFunction(val: ((val: number, obj: GraphObject) => any) | null) { this._graduatedFunction = val; }

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

  get portId(): string | null { return this._portId; }
  set portId(val: string | null) {
    if (this._portId === val) return;
    this._portId = val;
    // 官方 GraphObject.portIdChanged（tc）：端口 id 变更 → 失效该节点相连连线的 knot
    const p: any = this._part;
    if (p !== null && p !== undefined && typeof p.invalidateConnectedLinks === 'function') {
      p.invalidateConnectedLinks(undefined, this as any);
    }
  }

  /**
   * 官方 `Node.ne(port)`：清空端口上的 side-spot knot 缓存。
   * 由 Node.invalidateConnectedLinks / portId 变更 / link 端点变更触发。
   */
  invalidateConnectedLinksCache(): void {
    if (this._knot !== null && this._knot !== undefined) {
      (this._knot as any).gg();
    }
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
    // 官方 setter：t = Math.round(t)
    const t = Math.round(val);
    if (this._segmentIndex === t) return;
    this._segmentIndex = t;
  }

  get segmentFraction(): number { return this._segmentFraction; }
  set segmentFraction(val: number) {
    // 官方 setter：t<0 → 0，t>1 → 1
    let t = val;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    if (this._segmentFraction === t) return;
    this._segmentFraction = t;
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
    // 官方 setter：t === Orientation.None(0) 时把 angle 归零
    if (val === SegmentOrientationNone || val === OrientationNone || (val as any) === 0) this.angle = 0;
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
  bind(bindingOrTargetProp: Binding | string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any): this {
    if (typeof bindingOrTargetProp === 'string') {
      // Shorthand: .bind("fill", "color") or .bind("text")
      const binding = new Binding(bindingOrTargetProp, sourceProperty, conversion || undefined);
      // 官方：给出第 4 参 backconv 即视为双向绑定
      if (backConversion) binding.makeTwoWay(backConversion);
      this._bindings.push(binding);
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

  /** 官方 `GraphObject.bindTwoWay(targetprop, sourceprop?, conv?, backconv?)`：第 3 参为 source→target 转换 */
  bindTwoWay(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion || undefined);
    binding.makeTwoWay(backConversion || undefined);
    this._bindings.push(binding);
    return this;
  }

  /**
   * 官方 GraphObject.theme(targetprop, sourceprop?, themesource?, conv?, themeconv?)。
   * 官方第 3 参是 themeSource、第 4 参才是 converter —— 旧签名把 converter 放在第 3 位，
   * flowchart 的 .themeObject('stroke','isSelected',null,fn) 因此把 fn 当成了 sourceName，
   * 描边永远停在默认黑色。
   */
  theme(
    targetProperty: string,
    sourceProperty?: string,
    themeSource?: string | null,
    converter?: (value: any, targetObject: any, model: any) => any,
    themeConverter?: (value: any, targetObject: any, model?: any) => any,
  ): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, converter);
    binding.isThemeBinding = true;
    binding.sourceObject = 'theme';
    binding.themeSource = themeSource ?? null;
    binding.themeConverter = themeConverter || null;
    this._bindings.push(binding);
    return this;
  }

  /** 官方 themeData：ofData —— 源是 part.data（旧版误设成 modelData） */
  themeData(
    targetProperty: string,
    sourceProperty?: string,
    themeSource?: string | null,
    converter?: (value: any, targetObject: any, model: any) => any,
    themeConverter?: (value: any, targetObject: any, model?: any) => any,
  ): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, converter);
    binding.isThemeBinding = true;
    binding.sourceObject = null;
    binding.themeSource = themeSource ?? null;
    binding.themeConverter = themeConverter || null;
    this._bindings.push(binding);
    return this;
  }

  themeModel(
    targetProperty: string,
    sourceProperty?: string,
    themeSource?: string | null,
    converter?: (value: any, targetObject: any, model: any) => any,
    themeConverter?: (value: any, targetObject: any, model?: any) => any,
  ): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, converter);
    binding.isThemeBinding = true;
    binding.sourceObject = 'model';
    binding.themeSource = themeSource ?? null;
    binding.themeConverter = themeConverter || null;
    this._bindings.push(binding);
    return this;
  }

  /** 官方 themeObject：源是“绑定面板”（sourceName 默认 ''）上的属性 */
  themeObject(
    targetProperty: string,
    sourceProperty?: string,
    themeSource?: string | null,
    converter?: (value: any, targetObject: any, model: any) => any,
    themeConverter?: (value: any, targetObject: any, model?: any) => any,
    sourceName?: string,
  ): this {
    const binding = new Binding(targetProperty, sourceProperty || targetProperty, converter);
    binding.isThemeBinding = true;
    binding.sourceObject = sourceName !== undefined && sourceName !== null ? sourceName : '';
    binding.themeSource = themeSource ?? null;
    binding.themeConverter = themeConverter || null;
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

  // ============ 阶段 4：官方 GraphObject.prototype 缺口 ============

  /** 官方未文档化的 SVG 过滤器名（官方注释：May not work in Safari） */
  private _filter: string = '';
  /** 官方未文档化的行列跨度分配回调 */
  private _spanAllocation: ((a: GraphObject, b: RowColumnDefinition, c: number) => number) | null = null;
  /** 官方运行时存在的 svg 访问器（本项目为 Canvas 渲染，默认 null） */
  private _svg: any = null;
  /** 官方 `GraphObject.ao`：`addCopyProperty()` 登记的、clone 时额外复制的属性名 */
  private _copyProperties: string[] | null = null;

  /**
   * 官方 `GraphObject.toString()` = `"U.Jn(构造器) # hashId"`，
   * 其中 `U.Jn(constructor)` 就是该类的 `static className`。
   * Panel / Shape / TextBlock / Picture / Part / Adornment 等子类按官方各自覆盖。
   */
  toString(): string {
    const ctor = this.constructor as { className?: string };
    return `${ctor.className || 'GraphObject'}#${ensureHashId(this)}`;
  }

  /**
   * 官方 `GraphObject.clone()`：`new this.constructor()` → `cloneProtected` → 复制 `addCopyProperty` 登记项。
   * 官方所有子类的 `copy()` 都等于 `clone()`（本项目子类暂时保留各自的 `copy()` 覆盖）。
   */
  clone(): this {
    const copy = new (this.constructor as new () => this)();
    this.cloneProtected(copy);
    this._applyExtraCopyProperties(copy);
    return copy;
  }

  /**
   * 官方 `GraphObject.cloneProtected(copy)`（d.ts 标为 protected）。
   * 官方在 Panel / Shape / TextBlock / Picture / Part / Node / Link / Group / Placeholder / 各 Layout
   * 上都有覆盖；本项目基类实现等价于把 GraphObject 层状态写入 copy。
   */
  protected cloneProtected(copy: this): void {
    this._copyPropertiesTo(copy as GraphObject);
  }

  /** 官方 `GraphObject.MD(copy)`：把 `addCopyProperty` 登记的属性逐个拷过去 */
  private _applyExtraCopyProperties(copy: this): void {
    const names = this._copyProperties;
    if (names === null) return;
    for (let i = 0; i < names.length; i++) {
      (copy as any)[names[i]] = (this as any)[names[i]];
    }
  }

  /** 官方 `GraphObject.addCopyProperty(propName)`：登记 clone 时需要额外复制的属性名（重复登记被忽略） */
  addCopyProperty(propName: string): void {
    if (this._copyProperties === null) {
      this._copyProperties = [propName];
      return;
    }
    if (this._copyProperties.indexOf(propName) >= 0) return;
    this._copyProperties.push(propName);
  }

  /** 官方 `GraphObject.raiseChanged(propertyName, oldValue, newValue)` */
  raiseChanged(propertyname: string, oldval: any, newval: any): void {
    this.raiseChangedEvent(ChangedEventProperty, propertyname, this, oldval, newval);
  }

  /**
   * 官方 `GraphObject.raiseChangedEvent(change, propertyname, obj, oldval, newval, oldparam?, newparam?)`。
   * 官方实现：先交给 `part.Df(...)`（Part 层处理 elements 插删、再转发 `diagram.raiseChangedEvent`），
   * 无 Part 时直接转发给 `diagram.raiseChangedEvent`。
   * 注意：Part 自身的 `_part` 指向自己，因此这里必须走 Part 的专用管道（`raiseChangedEventFromObject`），
   * 不能递归调用 `raiseChangedEvent`，否则属性变更会无限递归（栈溢出）。
   */
  raiseChangedEvent(
    change: any, propertyname: string, obj: any,
    oldval: any, newval: any, oldparam?: any, newparam?: any
  ): void {
    const part = this._part;
    if (part !== null) {
      const partHandler = (part as any).raiseChangedEventFromObject;
      if (typeof partHandler === 'function') {
        partHandler.call(part, change, propertyname, obj, oldval, newval, oldparam, newparam);
        return;
      }
    }
    const diagram = this.diagram as any;
    if (diagram !== null && typeof diagram.raiseChangedEvent === 'function') {
      diagram.raiseChangedEvent(change, propertyname, obj, oldval, newval, oldparam, newparam);
    }
  }

  /**
   * 官方 `GraphObject.containsPoint(p)`。
   *
   * 偏差：官方靠内部 Transform 矩阵把输入点在「本对象局部坐标」与「所在 Panel 坐标」之间换算；
   * 本项目没有 Transform 矩阵，统一以**文档坐标**计算（与 `Diagram.findObjectAt(docPoint)` 一致）。
   */
  containsPoint(p: Point): boolean {
    const b = this.getDocumentBounds();
    if (!b.isReal()) return false;
    const cn = (this.constructor as { className?: string }).className;
    // 官方对 Shape/Adornment 额外放宽 5 个单位（便于点选）
    const wide = cn === 'Shape' || cn === 'Adornment';
    const rect = wide ? new Rect(b.x - 5, b.y - 5, b.width + 10, b.height + 10) : b;
    if (!rect.containsPoint(p)) return false;
    const nb = this._naturalBounds;
    const local = this.getLocalPoint(p);
    return Rect.contains(nb.x, nb.y, nb.width, nb.height, local.x, local.y);
  }

  /**
   * 官方 `GraphObject.containsRect(r)`：本对象是否包含给定矩形。
   * 偏差同 `containsPoint`：统一按文档坐标计算。
   */
  containsRect(r: Rect): boolean {
    const b = this.getDocumentBounds();
    if (this._angle === 0) return b.containsRect(r);
    const nb = this._naturalBounds;
    const c = [
      this.getDocumentPoint(new Point(nb.x, nb.y)),
      this.getDocumentPoint(new Point(nb.x + nb.width, nb.y)),
      this.getDocumentPoint(new Point(nb.x + nb.width, nb.y + nb.height)),
      this.getDocumentPoint(new Point(nb.x, nb.y + nb.height)),
    ];
    const r2 = new Rect(r.x, r.y, r.width, r.height);
    for (const p of c) {
      if (!r2.containsPoint(p)) return false;
    }
    return true;
  }

  /** 官方 `GraphObject.containedInRect(r, transform?)`：本对象是否被给定矩形包含 */
  containedInRect(r: Rect, transform?: any): boolean {
    if (transform === undefined) return r.containsRect(this.getDocumentBounds());
    const nb = this._naturalBounds;
    const c = [
      this.getDocumentPoint(new Point(nb.x, nb.y)),
      this.getDocumentPoint(new Point(nb.x + nb.width, nb.y)),
      this.getDocumentPoint(new Point(nb.x + nb.width, nb.y + nb.height)),
      this.getDocumentPoint(new Point(nb.x, nb.y + nb.height)),
    ];
    for (const p of c) {
      if (!r.containsPoint(p)) return false;
    }
    return true;
  }

  /** 官方 `GraphObject.intersectsRect(r, transform?)`：本对象是否与给定矩形相交 */
  intersectsRect(r: Rect, transform?: any): boolean {
    const b = this.getDocumentBounds();
    if (transform === undefined && this._angle === 0) return r.intersectsRect(b);
    const nb = this._naturalBounds;
    const c = [
      this.getDocumentPoint(new Point(nb.x, nb.y)),
      this.getDocumentPoint(new Point(nb.x + nb.width, nb.y)),
      this.getDocumentPoint(new Point(nb.x + nb.width, nb.y + nb.height)),
      this.getDocumentPoint(new Point(nb.x, nb.y + nb.height)),
    ];
    for (const p of c) {
      if (r.containsPoint(p)) return true;
    }
    const rc = [
      new Point(r.x, r.y),
      new Point(r.right, r.y),
      new Point(r.right, r.bottom),
      new Point(r.x, r.bottom),
    ];
    for (const p of rc) {
      if (this.containsPoint(p)) return true;
    }
    const edges: [Point, Point][] = [
      [c[0], c[1]], [c[1], c[2]], [c[2], c[3]], [c[3], c[0]],
    ];
    for (const e of edges) {
      if (Rect.intersectsLineSegment(r.x, r.y, r.width, r.height, e[0].x, e[0].y, e[1].x, e[1].y)) return true;
    }
    return false;
  }

  /**
   * 官方 `GraphObject.getNearestIntersectionPoint(p, q, result)`：
   * 把线段 pq 与本对象边界的**最近交点**写入 result；返回是否找到交点。
   * 官方实现走 `G.Bl`（四条边各做一次线段求交，取离 p 最近的那个），返回值是 boolean。
   * 偏差同 `containsPoint`：统一按文档坐标计算。
   */
  getNearestIntersectionPoint(p: Point, q: Point, result: Point): boolean {
    const b = this.getDocumentBounds();
    if (!b.isReal()) {
      result.set(q);
      return false;
    }
    return GraphObject._nearestIntersection(
      b.x, b.y, b.width, b.height, p.x, p.y, q.x, q.y, result
    );
  }

  /**
   * 官方 `G.Bl(x, y, w, h, x1, y1, x2, y2, result)` 的等价实现：
   * 线段 (x1,y1)→(x2,y2) 与矩形四条边的交点里，取离 (x1,y1) 最近的一个写入 result。
   * 找不到交点时 result 置为矩形左上角并返回 false（与官方一致）。
   */
  private static _nearestIntersection(
    x: number, y: number, w: number, h: number,
    x1: number, y1: number, x2: number, y2: number,
    result: Point
  ): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    let t0 = 0;
    let t1 = 1;
    const clip = (p: number, q: number): boolean => {
      if (p === 0) return q >= 0;
      const r = q / p;
      if (p < 0) {
        if (r > t1) return false;
        if (r > t0) t0 = r;
      } else {
        if (r < t0) return false;
        if (r < t1) t1 = r;
      }
      return true;
    };
    const inside =
      clip(-dx, x1 - x) && clip(dx, x + w - x1) &&
      clip(-dy, y1 - y) && clip(dy, y + h - y1);
    if (!inside || t0 > t1) {
      result.setTo(x, y);
      return false;
    }
    // Liang-Barsky 里 t0 恒从 0 起算：起点在矩形【内】时 t0 仍为 0，
    // 若先取 t0 就会把起点本身当成交点（连线端点落在节点中心）。
    // 正确语义：起点在外 → 取进入点 t0；起点在内 → 取离开点 t1；
    // 整段都在矩形内 → 官方四条边都求不到交点，返回 false。
    let t: number;
    if (t0 > 1e-9 && t0 <= 1) t = t0;
    else if (t1 > 1e-9 && t1 <= 1) t = t1;
    else {
      result.setTo(x, y);
      return false;
    }
    result.setTo(x1 + t * dx, y1 + t * dy);
    return true;
  }

  /**
   * 官方 `GraphObject.commonArrange(x, y, w, h)`：把本对象排布到给定矩形。
   * 官方实现会先写 actualBounds 再按 desiredSize/stretch 精简；
   * 本项目等价地落到 `_arrange()`（子类按各自 stretch 逻辑覆写）。
   */
  commonArrange(x: number, y: number, w: number, h: number): void {
    this._arrange(new Rect(x, y, w, h));
  }

  /** 官方 `GraphObject.filter`（未文档化的 SVG 过滤器名） */
  get filter(): string { return this._filter; }
  set filter(value: string) {
    if (value === this._filter) return;
    const old = this._filter;
    this._filter = value;
    this.raiseChanged('filter', old, value);
  }

  /** 官方 `GraphObject.spanAllocation`（未文档化的行列跨度分配回调） */
  get spanAllocation(): ((a: GraphObject, b: RowColumnDefinition, c: number) => number) | null {
    return this._spanAllocation;
  }
  set spanAllocation(value: ((a: GraphObject, b: RowColumnDefinition, c: number) => number) | null) {
    if (value === this._spanAllocation) return;
    const old = this._spanAllocation;
    this._spanAllocation = value;
    this.raiseChanged('spanAllocation', old, value);
  }

  /** 官方 `GraphObject.svg`（本项目为 Canvas 渲染，恒为 null） */
  get svg(): any { return this._svg; }
  set svg(value: any) {
    if (value === this._svg) return;
    const old = this._svg;
    this._svg = value;
    this.raiseChanged('svg', old, value);
  }

  /** Apply a function to this object and return it */
  apply(func: (obj: GraphObject, data?: any) => void, data?: any): GraphObject {
    func(this, data);
    return this;
  }

  /** 官方 findBindingPanel：从自身（若为 Panel）起向上找带绑定的面板 */
  findBindingPanel(): Panel | null {
    // avoid value-import of Panel (circular); duck-type via _elements
    const selfIsPanel = (this as any)._elements !== undefined;
    let panel: Panel | null = selfIsPanel ? this as unknown as Panel : this._panel;
    while (panel !== null) {
      if (panel._bindings && panel._bindings.length > 0) {
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
    while (panel !== null) {
      const panelBounds = (panel as any)._actualBounds;
      bounds.x += panelBounds.x;
      bounds.y += panelBounds.y;
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
  /** 官方 `GraphObject.trigger(propname, value?): this`：触发动画并返回自身（可链式 .add） */
  trigger(propname: string, value?: any): this {
    const panel = this._panel;
    if (panel && typeof (panel as any)._handleObjectPropertyChanged === 'function') {
      (panel as any)._handleObjectPropertyChanged(this, propname, value);
    }
    const part = this._part;
    if (part && typeof (part as any)._handleObjectPropertyChanged === 'function') {
      (part as any)._handleObjectPropertyChanged(this, propname, value);
    }
    return this;
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

  /** Measure this object within the given constraints (官方 yt：可选 minW/minH) */
  _measure(widthConstraint: number, heightConstraint: number, minW?: number, minH?: number): void {
    // Base implementation - subclasses override
    let w = Math.max(widthConstraint, minW || 0);
    let h = Math.max(heightConstraint, minH || 0);
    this._measuredBounds = new Rect(0, 0, w, h);
    this._applySizeConstraints();
  }

  /** Apply minSize/maxSize/desiredSize constraints to measured bounds */
  protected _applySizeConstraints(): void {
    const mb = this._measuredBounds;
    let w = mb.width;
    let h = mb.height;

    // Apply desiredSize per-dimension (NaN means "not set" for that axis, matching GoJS isFinite checks)
    if (!isNaN(this._desiredSize.width)) w = this._desiredSize.width;
    if (!isNaN(this._desiredSize.height)) h = this._desiredSize.height;

    // Apply minSize
    if (!isNaN(this._minSize.width) && w < this._minSize.width) w = this._minSize.width;
    if (!isNaN(this._minSize.height) && h < this._minSize.height) h = this._minSize.height;

    // Apply maxSize
    if (!isNaN(this._maxSize.width) && w > this._maxSize.width) w = this._maxSize.width;
    if (!isNaN(this._maxSize.height) && h > this._maxSize.height) h = this._maxSize.height;

    this._measuredBounds = new Rect(0, 0, w, h);
    this._applyMeasureTransform();
  }

  /**
   * 官方 GraphObject.po：scale（及 angle）作用于 measuredBounds。
   * scale 矩阵 + 绕中心旋转，取轴对齐包围盒；naturalBounds 不受影响。
   */
  protected _applyMeasureTransform(): void {
    const sc = this._scale;
    const ang = this._angle;
    if (sc === 1 && (isNaN(ang) || ang === 0)) return;
    const mb = this._measuredBounds;
    let w = mb.width * sc;
    let h = mb.height * sc;
    let x = 0;
    let y = 0;
    if (!isNaN(ang) && ang !== 0) {
      const rad = (ang * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const nw = w * cos + h * sin;
      const nh = w * sin + h * cos;
      x = w / 2 - nw / 2;
      y = h / 2 - nh / 2;
      w = nw;
      h = nh;
    }
    this._measuredBounds = new Rect(x, y, w, h);
  }

  /** 官方 GraphObject.ln(forArranging) — 解析有效 stretch */
  _getStretch(forArranging: boolean): EnumValue {
    const s = this._stretch;
    const panel = this._panel;
    if (panel === null) {
      return this._refineStretch(s === StretchDefault ? StretchNone : s, forArranging);
    }
    const ptype = panel.type;
    // 官方 ln：Table 面板子元素 → gp(rowDef, colDef, forArranging)
    if (ptype === PanelTable) {
      return this._resolveTableChildStretch(panel, forArranging);
    }
    const mainOf = (ptype === PanelAuto || ptype === PanelSpot)
      ? (panel as any).findMainElement?.() === this
      : false;
    if (mainOf && ptype === PanelAuto) return this._refineStretch(StretchFill, forArranging);
    if (s === StretchDefault) {
      if (mainOf && ptype === PanelSpot) return this._refineStretch(StretchFill, forArranging);
      const ds = panel.defaultStretch;
      return this._refineStretch(ds === StretchDefault ? StretchNone : ds, forArranging);
    }
    return this._refineStretch(s, forArranging);
  }

  /**
   * 官方 GraphObject.gp(rowDef, colDef, forArranging)：
   * 元素 stretch 为 Default 时，由所在行/列定义的 stretch + 面板 defaultStretch 推导有效 stretch。
   */
  private _resolveTableChildStretch(panel: Panel, forArranging: boolean): EnumValue {
    const s = this._stretch;
    if (s !== StretchDefault) return this._refineStretch(s, forArranging);
    const rowDef = panel.getRowDefinition(this.row);
    const colDef = panel.getColumnDefinition(this.column);
    return this._gpWithDefs(panel, rowDef, colDef, forArranging);
  }

  /** 官方 GraphObject.gp(rowDef, colDef, forArranging)（stretch 已知为 Default） */
  _gpWithDefs(panel: Panel, rowDef: RowColumnDefinition, colDef: RowColumnDefinition, forArranging: boolean): EnumValue {
    const s = this._stretch;
    if (s !== StretchDefault) return this._refineStretch(s, forArranging);
    let horiz: boolean | null = null;
    let vert: boolean | null = null;
    switch (rowDef.stretch) {
      case StretchDefault:
      case StretchHorizontal:
        break;
      case StretchVertical:
        vert = true;
        break;
      case StretchFill:
        vert = true;
        break;
    }
    switch (colDef.stretch) {
      case StretchDefault:
      case StretchVertical:
        break;
      case StretchHorizontal:
        horiz = true;
        break;
      case StretchFill:
        horiz = true;
        break;
    }
    const ds = panel.defaultStretch;
    if (horiz === null) horiz = ds === StretchHorizontal || ds === StretchFill;
    if (vert === null) vert = ds === StretchVertical || ds === StretchFill;
    let result: EnumValue;
    if (horiz === true && vert === true) result = StretchFill;
    else if (horiz === true) result = StretchHorizontal;
    else if (vert === true) result = StretchVertical;
    else result = StretchNone;
    return this._refineStretch(result, forArranging);
  }

  /** 官方 GraphObject.ir(stretch, forArranging) — 按 desiredSize 精简 stretch */
  private _refineStretch(t: EnumValue, forArranging: boolean): EnumValue {
    if (forArranging) return t;
    if (t === StretchNone) return StretchNone;
    const d = this._desiredSize;
    if (isFinite(d.width) && isFinite(d.height)) return StretchNone;
    const wFixed = !isNaN(d.width);
    const hFixed = !isNaN(d.height);
    const rot = this._angle === 90 || this._angle === 270;
    if (wFixed) {
      if (!rot) {
        if (t === StretchHorizontal) return StretchNone;
        if (t === StretchFill) return StretchVertical;
      } else {
        if (t === StretchVertical) return StretchNone;
        if (t === StretchFill) return StretchHorizontal;
      }
    }
    if (hFixed) {
      if (!rot) {
        if (t === StretchVertical) return StretchNone;
        if (t === StretchFill) return StretchHorizontal;
      } else {
        if (t === StretchHorizontal) return StretchNone;
        if (t === StretchFill) return StretchVertical;
      }
    }
    return t;
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
    // Graduated 面板相关：模板克隆时必须保留，否则 interval 回退到 1，
    // 导致刻度/标签在每个刻度值上都画一遍（thermometer 数字重叠成一片）
    copy._interval = this._interval;
    copy._graduatedStart = this._graduatedStart;
    copy._graduatedEnd = this._graduatedEnd;
    copy._graduatedSkip = this._graduatedSkip;
    copy._graduatedFunction = this._graduatedFunction;
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
  // 阶段 3: 官方 go.GraphObject 上除了 Stretch 成员外，还挂了 Flip 的四个成员
  // （go.d.ts:15927 `enum Flip`，官方运行时 GraphObject.FlipVertical/FlipHorizontal/FlipBoth 均存在）。
  static FlipVertical = FlipVertical;
  static FlipHorizontal = FlipHorizontal;
  static FlipBoth = FlipBoth;

  // ============ Static methods ============

  /** Factory method for creating GraphObjects - stub */
  static _classRegistry: Record<string, any> = {};

  static defineBuilder(name: string, func: Function): void {
    GraphObject._classRegistry[name] = func;
  }

  /** 官方 `GraphObject.isBuilderDefined(name)` */
  static isBuilderDefined(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(GraphObject._classRegistry, name);
  }

  /**
   * 官方 `GraphObject.takeBuilderArgument(args, default?, pred?)`：取出 args[1]。
   * 默认谓词为 `typeof === 'string'`；命中则从数组移除并返回，未命中且有默认值返回默认值，否则抛错。
   */
  static takeBuilderArgument(obj: any, defaultVal?: any, pred?: (v: any) => boolean): any {
    if (Array.isArray(obj)) {
      const s = obj[1];
      const ok = typeof pred === 'function' ? s !== undefined && pred(s) : typeof s === 'string';
      if (ok) {
        obj.splice(1, 1);
        return s;
      }
      if (defaultVal !== undefined) return defaultVal;
      throw new Error(
        'no ' + (typeof pred === 'function' ? 'satisfactory' : 'string') +
        ' argument for GraphObject builder ' + obj[0]);
    }
    if (defaultVal !== undefined) return defaultVal;
    return undefined;
  }

  /**
   * 官方 `GraphObject.build(type, init?, ...args)`：init 不传给 builder（builder 收 [type, ...args]），
   * 返回后再 setProperties(init)。
   */
  static build(type: any, init?: any, ...args: any[]): any {
    if (typeof type === 'string') {
      const reg = GraphObject._classRegistry;
      const builderFunc = reg[type];
      if (typeof builderFunc === 'function') {
        const builderArgs: any[] = [type].concat(args);
        const obj = builderFunc(builderArgs);
        if (obj instanceof GraphObject) {
          if (init !== null && init !== undefined) obj.setProperties(init);
          return obj;
        }
        throw new Error('GraphObject.build invoked object builder "' + type + '", but it did not return an Object');
      }
    }
    return GraphObject.make(type, init, ...args);
  }

  static make(type: any, ...args: any[]): any {
    // builder 消费掉的参数（takeBuilderArgument splice）不再参与后续属性应用
    let applyArgs: any[] = args;
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
            // 官方 make/build 给 builder 的数组是 [type, ...args]，builder 可 splice 消费参数
            const builderArgs: any[] = [type].concat(args);
            obj = builderFunc(builderArgs);
            isPanelLike = obj && typeof obj.add === 'function';
            applyArgs = builderArgs.slice(1);
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

    for (const arg of applyArgs) {
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
