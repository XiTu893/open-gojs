import { EnumValue } from '../core/EnumValues';
import {
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable,
  PanelPosition, PanelGrid, PanelViewbox, PanelGraduated, PanelLink,
  PanelTableColumn, PanelTableRow,
  StretchDefault, StretchFill, StretchNone, StretchUniform, StretchUniformToFill,
  StretchHorizontal, StretchVertical,
  SizingNone, SizingAuto, SizingProp,
  SegmentOrientationNone, SegmentOrientationAlong, SegmentOrientationOpposite,
  SegmentOrientationParallel, SegmentOrientationPerpendicular, SegmentOrientationOrthogonal,
  OrientationAlong, OrientationPlus90, OrientationMinus90, OrientationOpposite,
  OrientationUpright, OrientationPlus90Upright, OrientationMinus90Upright, OrientationUpright45
} from '../core/EnumValues';
import { TextBlock } from './TextBlock';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin, MarginLike } from '../core/Margin';
import { List } from '../core/List';
import { Map } from '../core/Map';
import { Iterator } from '../core/Iterable';
import { BrushLike } from '../core/Brush';
import { Geometry } from '../core/Geometry';
import { PanelLayout } from './PanelLayout';
import { computePathPoints, interpolatePath, fractionAlongPath } from '../core/PathSampling';
import { getFigureGeometry } from '../figures/Figures';
import { Binding } from '../model/Binding';
import { GraphObject } from './GraphObject';
import { Shape } from './Shape';
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
export class Panel extends GraphObject {
  static readonly className: string = "Panel";

  // ============ Internal storage ============
  _elements: GraphObject[] = [];
  _rowDefinitions: RowColumnDefinition[] = [];
  _columnDefinitions: RowColumnDefinition[] = [];

  // ============ Private property storage ============
  // 官方 Panel 构造：type === undefined → Panel.Position
  protected _type: EnumValue = PanelPosition;
  private _data: any = null;
  private _padding: Margin = Margin.Zero.copy();
  private _defaultAlignment: Spot = Spot.Default.copy();
  private _defaultStretch: EnumValue = StretchDefault;
  private _originX: number = 0;
  private _originY: number = 0;
  private _unionRect: Rect = new Rect();
  /** 官方 `PanelLayoutLink.or`：measure 算出的 route-local 并集帧（子元素 z 都相对它） */
  private _linkOrRect: Rect | null = null;
  /** 官方 `PanelLayoutLink.qf`：measure 时按固定顺序存下的子元素 z 矩形，arrange 按序消费 */
  private _linkQfRects: Rect[] | null = null;
  /** 官方 `PanelLayoutGraduated.ns`：measure 顺序的子元素矩形，arrange 按序消费（arrange 末尾置 null） */
  private _gradRects: Rect[] | null = null;
  /** 官方 `Panel.Es`：与 `_elements` 逐下标对齐的 mark 列表 */
  private _gradMarks: GradMark[][] | null = null;
  /** 官方 `Panel.Ii`：measureGraduatedLabels 复用的临时 TextBlock（renderer 也用它逐 mark 重测） */
  private _gradTempText: TextBlock | null = null;
  /** 与 `_elements` 逐下标对齐的临时 TextBlock：官方 render 前会逐元素 YD(el, Ii) 重灌属性，
   *  单槽 `_gradTempText` 会让多 TextBlock 面板（thermometer 华氏 18px 黑标签 + 12px 红 32 标签）
   *  全部按最后一个元素的样式绘制 —— 这里按元素存槽等价官方逐元素重灌。 */
  private _gradTempTexts: (TextBlock | null)[] = [];
  private _defaultColumnSeparatorStroke: BrushLike = null;
  private _defaultColumnSeparatorStrokeWidth: number = 1;
  private _defaultRowSeparatorStroke: BrushLike = null;
  private _defaultRowSeparatorStrokeWidth: number = 1;
  // 阶段 4：官方 Panel 上的未文档化/次要属性
  private _defaultColumnSeparatorDashArray: number[] | null = null;
  private _defaultRowSeparatorDashArray: number[] | null = null;
  private _isOpposite: boolean = false;
  /** 官方 `Panel` 构造第一个参数可以是 `PanelLayout` 实例（自定义面板布局） */
  private _panelLayout: PanelLayout | null = null;
  private _panelLayoutState: any = null;
  private _defaultSeparatorPadding: Margin = Margin.Zero.copy();
  private _columnSizing: EnumValue = SizingProp;
  private _rowSizing: EnumValue = SizingProp;
  private _isClipping: boolean = false;
  private _isEnabled: boolean = true;
  private _alignmentFocusName: string = '';
  private _itemArray: any[] | null = null;
  private _itemTemplate: Panel | null = null;
  private _itemTemplateMap: Map<string, Panel> = new Map<string, Panel>();
  private _itemCategoryProperty: string | Function = 'category';
  protected _itemIndex: number = -1;
  private _leftIndex: number = 0;
  private _topIndex: number = 0;
  private _gridCellSize: Size = new Size(10, 10);
  private _gridOrigin: Point = new Point(0, 0);
  /** 官方 GridPanelSettings.Cf：lcm(间隔) × gridCellSize，供 Diagram.eC 定位 */
  _gridCf: Size | null = null;
  /** 官方 GridPanelSettings.Yp：每个元素的同向更大 interval 排除表（pS 判定用） */
  _gridExclusions: number[][] | null = null;
  private _graduatedMin: number = 0;
  private _graduatedMax: number = 100;
  private _graduatedTickUnit: number = 1;
  private _graduatedTickBase: number = 0;
  private _viewboxStretch: EnumValue = StretchUniform;
  _viewboxScaleX: number = 1;
  _viewboxScaleY: number = 1;

  constructor(type?: EnumValue | string | object | null, init?: Partial<Panel>) {
    super();
    this._className = 'Panel';
    // 官方 Panel 构造：undefined → Position；string → 按名解析；EnumValue → 直接用；其它对象 → 作为 init
    let t: any = type;
    let i: any = init;
    if (t !== undefined && t !== null) {
      if (typeof t === 'string') this._type = Panel._resolvePanelTypeStr(t);
      else if (t instanceof EnumValue) this._type = t;
      else if (t instanceof PanelLayout) this._panelLayout = t;
      else i = t;
    }
    if (i) {
      this.set(i);
    }
  }

  /** 官方各子类构造参数解析：string/EnumValue → type；其它对象 → init */
  protected static _resolveArgs(type: any, init: any): [any, any] {
    if (typeof type === 'string' || type instanceof EnumValue) return [type, init];
    if (type) return [undefined, type];
    return [undefined, init];
  }

  private static _resolvePanelTypeStr(type: string): EnumValue {
    const map: Record<string, EnumValue> = {
      'Auto': PanelAuto,
      'Vertical': PanelVertical,
      'Horizontal': PanelHorizontal,
      'Spot': PanelSpot,
      'Table': PanelTable,
      'Position': PanelPosition,
      'Grid': PanelGrid,
      'Viewbox': PanelViewbox,
      'Graduated': PanelGraduated,
      'Link': PanelLink,
      'TableRow': PanelTableRow,
      'TableColumn': PanelTableColumn,
    };
    return map[type] || PanelAuto;
  }

  // ============ Properties ============

  get type(): EnumValue { return this._type; }
  set type(val: EnumValue) {
    if (this._type === val) return;
    this._type = val;
    this._invalidateMeasure();
  }

  get data(): any { return this._data; }
  set data(val: any) {
    if (this._data === val) return;
    this._data = val;
  }

  get padding(): Margin { return this._padding; }
  set padding(val: MarginLike) {
    const m = typeof val === 'number' ? new Margin(val) : val;
    if (this._padding.equals(m)) return;
    this._padding = m.copy();
    this._invalidateMeasure();
  }

  get defaultAlignment(): Spot { return this._defaultAlignment; }
  set defaultAlignment(val: Spot) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
    if (this._defaultAlignment.equals(s)) return;
    this._defaultAlignment = s;
    this._invalidateArrange();
  }

  get defaultStretch(): EnumValue { return this._defaultStretch; }
  set defaultStretch(val: EnumValue) {
    if (this._defaultStretch === val) return;
    this._defaultStretch = val;
    this._invalidateMeasure();
  }

  get defaultColumnSeparatorStroke(): BrushLike { return this._defaultColumnSeparatorStroke; }
  set defaultColumnSeparatorStroke(val: BrushLike) {
    this._defaultColumnSeparatorStroke = val;
  }

  get defaultColumnSeparatorStrokeWidth(): number { return this._defaultColumnSeparatorStrokeWidth; }
  set defaultColumnSeparatorStrokeWidth(val: number) {
    if (this._defaultColumnSeparatorStrokeWidth === val) return;
    this._defaultColumnSeparatorStrokeWidth = val;
  }

  get defaultRowSeparatorStroke(): BrushLike { return this._defaultRowSeparatorStroke; }
  set defaultRowSeparatorStroke(val: BrushLike) {
    this._defaultRowSeparatorStroke = val;
  }

  get defaultRowSeparatorStrokeWidth(): number { return this._defaultRowSeparatorStrokeWidth; }
  set defaultRowSeparatorStrokeWidth(val: number) {
    if (this._defaultRowSeparatorStrokeWidth === val) return;
    this._defaultRowSeparatorStrokeWidth = val;
  }

  get defaultSeparatorPadding(): Margin { return this._defaultSeparatorPadding; }
  set defaultSeparatorPadding(val: MarginLike) {
    const m = typeof val === 'number' ? new Margin(val) : val;
    if (this._defaultSeparatorPadding.equals(m)) return;
    this._defaultSeparatorPadding = m.copy();
  }

  get columnSizing(): EnumValue { return this._columnSizing; }
  set columnSizing(val: EnumValue) {
    if (this._columnSizing === val) return;
    this._columnSizing = val;
    this._invalidateMeasure();
  }

  get rowSizing(): EnumValue { return this._rowSizing; }
  set rowSizing(val: EnumValue) {
    if (this._rowSizing === val) return;
    this._rowSizing = val;
    this._invalidateMeasure();
  }

  get isClipping(): boolean { return this._isClipping; }
  set isClipping(val: boolean) {
    if (this._isClipping === val) return;
    this._isClipping = val;
  }

  get isEnabled(): boolean { return this._isEnabled; }
  set isEnabled(val: boolean) {
    if (this._isEnabled === val) return;
    this._isEnabled = val;
  }

  get alignmentFocusName(): string { return this._alignmentFocusName; }
  set alignmentFocusName(val: string) {
    if (this._alignmentFocusName === val) return;
    this._alignmentFocusName = val;
  }

  get itemArray(): any[] | null { return this._itemArray; }
  set itemArray(val: any[] | null) {
    if (this._itemArray === val) return;
    this._itemArray = val;
    this.rebuildItemElements();
  }

  get itemTemplate(): Panel | null { return this._itemTemplate; }
  set itemTemplate(val: Panel | null) {
    if (this._itemTemplate === val) return;
    this._itemTemplate = val;
    this.rebuildItemElements();
  }

  get itemTemplateMap(): Map<string, Panel> { return this._itemTemplateMap; }
  set itemTemplateMap(val: Map<string, Panel>) {
    this._itemTemplateMap = val;
    this.rebuildItemElements();
  }

  get itemCategoryProperty(): string | Function { return this._itemCategoryProperty; }
  set itemCategoryProperty(val: string | Function) {
    if (this._itemCategoryProperty === val) return;
    this._itemCategoryProperty = val;
  }

  get itemIndex(): number { return this._itemIndex; }

  get columnCount(): number {
    let maxCol = 0;
    for (const elem of this._elements) {
      const col = elem.column + elem.columnSpan;
      if (col > maxCol) maxCol = col;
    }
    return maxCol;
  }

  get rowCount(): number {
    let maxRow = 0;
    for (const elem of this._elements) {
      const row = elem.row + elem.rowSpan;
      if (row > maxRow) maxRow = row;
    }
    return maxRow;
  }

  get leftIndex(): number { return this._leftIndex; }
  set leftIndex(val: number) {
    if (this._leftIndex === val) return;
    this._leftIndex = val;
  }

  get topIndex(): number { return this._topIndex; }
  set topIndex(val: number) {
    if (this._topIndex === val) return;
    this._topIndex = val;
  }

  get gridCellSize(): Size { return this._gridCellSize; }
  set gridCellSize(val: Size) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Size(val.width || 0, val.height || 0) : Size.NaN.copy());
    if (this._gridCellSize.equals(s)) return;
    this._gridCellSize = s;
    this._invalidateMeasure();
  }

  get gridOrigin(): Point { return this._gridOrigin; }
  set gridOrigin(val: Point) {
    const p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : Point.Zero.copy());
    if (this._gridOrigin.equals(p)) return;
    this._gridOrigin = p;
    // 官方：gridOrigin setter → panel.L()（失效重绘）；是 diagram.grid 时再 Ld()
    const d = this.diagram;
    if (d) d.requestUpdate();
  }

  /**
   * 官方 PanelLayoutGrid.u3/d3：
   * - u3：按垂直/水平方向求 interval 的 lcm → Cf = Size(lcmV·cellW, lcmH·cellH)
   * - d3：每个元素收集同向且 interval 更大的元素 → Yp（画线时被更大线覆盖的小间隔线跳过）
   */
  _updateGridSettings(): void {
    const elems = this._elements;
    const cell = this._gridCellSize;
    let wPeriod = 1;
    let hPeriod = 1;
    for (const el of elems) {
      const a = Math.abs((el as any).interval);
      if (a < 2) continue;
      if (Panel._isVerticalGridFigure((el as any).figure)) {
        wPeriod = (wPeriod * a) / Panel._gridGCD(wPeriod, a);
      } else {
        hPeriod = (hPeriod * a) / Panel._gridGCD(hPeriod, a);
      }
    }
    this._gridCf = new Size(wPeriod * cell.width, hPeriod * cell.height);
    const ys: number[][] = [];
    for (let n = 0; n < elems.length; n++) {
      const row: number[] = [];
      ys.push(row);
      const o: any = elems[n];
      if (!o.visible) continue;
      const l = o.interval;
      if (l < 0) continue;
      const vertical = Panel._isVerticalGridFigure(o.figure);
      for (let c = 0; c < elems.length; c++) {
        if (c === n) continue;
        const f: any = elems[c];
        if (!f.visible) continue;
        if (Panel._isVerticalGridFigure(f.figure) !== vertical) continue;
        const d = f.interval;
        if (d > l) row.push(d);
      }
    }
    this._gridExclusions = ys;
  }

  /** 官方 PanelLayoutGrid.MN：LineV/BarV 为垂直方向（影响宽度周期） */
  static _isVerticalGridFigure(figure: string): boolean {
    return figure === 'LineV' || figure === 'BarV';
  }

  /** 官方 G.CT：最大公约数（含小数 interval 的欧几里得算法） */
  static _gridGCD(a: number, b: number): number {
    let i = Math.max(a, b);
    let e = Math.min(a, b);
    let s = 1;
    let n = 1;
    do {
      s = i % e;
      n = e;
      i = e;
      e = s;
    } while (s > 0);
    return n;
  }

  get graduatedMin(): number { return this._graduatedMin; }
  set graduatedMin(val: number) {
    if (this._graduatedMin === val) return;
    this._graduatedMin = val;
    this._invalidateMeasure();
  }

  get graduatedMax(): number { return this._graduatedMax; }
  set graduatedMax(val: number) {
    if (this._graduatedMax === val) return;
    this._graduatedMax = val;
    this._invalidateMeasure();
  }

  get graduatedTickUnit(): number { return this._graduatedTickUnit; }
  set graduatedTickUnit(val: number) {
    if (this._graduatedTickUnit === val) return;
    this._graduatedTickUnit = val;
    this._invalidateMeasure();
  }

  get graduatedTickBase(): number { return this._graduatedTickBase; }
  set graduatedTickBase(val: number) {
    if (this._graduatedTickBase === val) return;
    this._graduatedTickBase = val;
  }

  // graduatedStart / graduatedEnd 继承自 GraphObject（官方两者都在 GraphObject 上）

  get viewboxStretch(): EnumValue { return this._viewboxStretch; }
  set viewboxStretch(val: EnumValue) {
    if (this._viewboxStretch === val) return;
    this._viewboxStretch = val;
    this._invalidateMeasure();
  }

  // ============ Readonly computed properties ============

  get elements(): Iterator<GraphObject> {
    return new List<GraphObject>(this._elements).iterator;
  }

  get elementCount(): number {
    return this._elements.length;
  }

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
  getNearestIntersectionPoint(p: Point, q: Point, result: Point): boolean {
    if (this.background !== null && this.background !== undefined) {
      return super.getNearestIntersectionPoint(p, q, result);
    }
    result.setTo(p.x, p.y);
    const fdx = q.x - p.x;
    const fdy = q.y - p.y;
    let minD = fdx * fdx + fdy * fdy;
    let found = false;
    const tmp = new Point();
    const els = this._elements;
    const clipMain = this.isClipping && this.type === PanelSpot;
    let mainEl: GraphObject | null = null;
    let mainPt = new Point();
    let mainD = Infinity;
    let mainFound = false;
    if (clipMain) {
      mainEl = this.findMainElement();
      if (mainEl !== null) {
        mainFound = mainEl.getNearestIntersectionPoint(p, q, mainPt);
        const mdx = mainPt.x - q.x;
        const mdy = mainPt.y - q.y;
        mainD = mainFound ? mdx * mdx + mdy * mdy : Infinity;
        found = mainFound;
      }
    }
    for (const el of els) {
      if (!el.visible || el === mainEl) continue;
      if (!el.getNearestIntersectionPoint(p, q, tmp)) continue;
      found = true;
      const dx = tmp.x - q.x;
      const dy = tmp.y - q.y;
      const d = dx * dx + dy * dy;
      if (d < minD) {
        minD = d;
        result.setTo(tmp.x, tmp.y);
      }
    }
    if (clipMain && mainFound && mainD > minD) {
      result.setTo(mainPt.x, mainPt.y);
    }
    return found;
  }

  // ============ Public methods ============

  add(...elements: GraphObject[]): Panel {
    for (const element of elements) {
      if (!(element instanceof GraphObject)) {
        throw new Error('Panel.add: argument must be a GraphObject');
      }
      (element as any)._panel = this;
      this._elements.push(element);
      this._invalidateMeasure();
      // Propagate _part to child elements
      this._propagatePart(element);
    }
    return this;
  }

  /** Propagate the _part reference to a child element and its descendants */
  private _propagatePart(element: GraphObject): void {
    // Find the top-level Part
    let part: any = this;
    while ((part as any)._panel && !((part as any).isTopLevel)) {
      part = (part as any)._panel;
    }
    if (part && (part as any).isTopLevel) {
      this._setPartRecursive(element, part);
    }
  }

  /** Recursively set _part on an element and its children */
  private _setPartRecursive(element: GraphObject, part: any): void {
    (element as any)._part = part;
    if (element instanceof Panel) {
      for (const child of (element as Panel)._elements) {
        this._setPartRecursive(child, part);
      }
    }
  }

  remove(element: GraphObject): Panel {
    const idx = this._elements.indexOf(element);
    if (idx >= 0) {
      (element as any)._panel = null;
      this._elements.splice(idx, 1);
      this._invalidateMeasure();
    }
    return this;
  }

  removeAt(index: number): Panel {
    if (index >= 0 && index < this._elements.length) {
      (this._elements[index] as any)._panel = null;
      this._elements.splice(index, 1);
      this._invalidateMeasure();
    }
    return this;
  }

  insertAt(index: number, element: GraphObject): Panel {
    if (!(element instanceof GraphObject)) {
      throw new Error('Panel.insertAt: argument must be a GraphObject');
    }
    (element as any)._panel = this;
    this._elements.splice(index, 0, element);
    this._invalidateMeasure();
    return this;
  }

  elt(index: number): GraphObject {
    return this._elements[index];
  }

  findObject(name: string): GraphObject | null {
    if (this.name === name) return this;
    for (const elem of this._elements) {
      if (elem.name === name) return elem;
      if (elem instanceof Panel) {
        const found = (elem as Panel).findObject(name);
        if (found !== null) return found;
      }
    }
    return null;
  }

  /** 官方 findMainElement：第一个 isPanelMain，否则 elements[0]，空则 null */
  findMainElement(): GraphObject | null {
    const els = this._elements;
    const len = els.length;
    if (len === 0) return null;
    for (let i = 0; i < len; i++) {
      if (els[i].isPanelMain === true) return els[i];
    }
    return els[0];
  }

  // ============ 阶段 4：官方 Panel.prototype 缺口 ============

  /** 官方 `Panel.addRowColumnDefinition(rowOrColumnDef)`：把 def 的设置合并进同序号的行/列定义，返回 this */
  addRowColumnDefinition(def: RowColumnDefinition): this {
    if (!def) return this;
    const existing = def.isRow
      ? this.getRowDefinition(def.index)
      : this.getColumnDefinition(def.index);
    if (existing) existing._setValuesFrom(def);
    this._invalidateMeasure();
    return this;
  }

  /** 官方 `Panel.copyTemplate(freeze?)`：复制整棵视觉树作为模板，可选冻结其中的绑定 */
  copyTemplate(freeze?: boolean): this {
    const copy = this.copy() as this;
    if (freeze === true) copy.freezeBindings();
    return copy;
  }

  get defaultColumnSeparatorDashArray(): number[] | null { return this._defaultColumnSeparatorDashArray; }
  set defaultColumnSeparatorDashArray(value: number[] | null) {
    if (value === this._defaultColumnSeparatorDashArray) return;
    const old = this._defaultColumnSeparatorDashArray;
    this._defaultColumnSeparatorDashArray = value;
    this.raiseChanged('defaultColumnSeparatorDashArray', old, value);
  }

  get defaultRowSeparatorDashArray(): number[] | null { return this._defaultRowSeparatorDashArray; }
  set defaultRowSeparatorDashArray(value: number[] | null) {
    if (value === this._defaultRowSeparatorDashArray) return;
    const old = this._defaultRowSeparatorDashArray;
    this._defaultRowSeparatorDashArray = value;
    this.raiseChanged('defaultRowSeparatorDashArray', old, value);
  }

  /** 官方 `Panel.findColumnForLocalX(x)`：Table 面板中局部 x 落在哪一列（未命中返回列数） */
  findColumnForLocalX(x: number): number {
    if (x < 0 || this._type !== PanelTable || this.columnCount === 0) return -1;
    let total = 0;
    const defs = this._columnDefinitions;
    const len = defs.length;
    let i = this._leftIndex;
    for (; i < len; i++) {
      const def = defs[i];
      if (def !== undefined && def !== null) {
        total += def.total;
        if (x < total) return i;
      }
    }
    return i;
  }

  /** 官方 `Panel.findRowForLocalY(y)`：Table 面板中局部 y 落在哪一行（未命中返回行数） */
  findRowForLocalY(y: number): number {
    if (y < 0 || this._type !== PanelTable || this.rowCount === 0) return -1;
    let total = 0;
    const defs = this._rowDefinitions;
    const len = defs.length;
    let i = this._topIndex;
    for (; i < len; i++) {
      const def = defs[i];
      if (def !== undefined && def !== null) {
        total += def.total;
        if (y < total) return i;
      }
    }
    return i;
  }

  /**
   * 官方 `Panel.findInVisualTree(func)`：深度优先遍历视觉树，
   * 返回第一个让 func 返回真值的对象；没有则返回 null。
   */
  findInVisualTree(func: (obj: GraphObject) => any): GraphObject | null {
    if (func(this)) return this;
    if (this instanceof Panel) {
      for (const child of this._elements) {
        const found = child instanceof Panel
          ? (child as Panel).findInVisualTree(func)
          : (func(child) ? child : null);
        if (found !== null) return found;
      }
    }
    return null;
  }

  /** 官方 `Panel.walkVisualTreeFrom(obj, func)`：func(root, obj) 先于子树被调用 */
  walkVisualTreeFrom(obj: GraphObject, func: (root: GraphObject, obj: GraphObject) => void): void {
    func(this, obj);
    if (obj instanceof Panel) {
      for (const child of (obj as Panel)._elements) {
        this.walkVisualTreeFrom(child, func);
      }
    }
  }

  /**
   * 官方 `Panel.freezeBindings()`：收集视觉树里所有 Binding 并冻结，
   * 同时解析 sourceName → 目标对象的关联，使模板的每份拷贝都能按名字找到目标。
   *
   * 本项目 `Binding` 还没有 `sourceName` / `targetId`（阶段 5 补齐），而 `copy()`
   * 已经会把 `_bindings` 深拷贝，因此这里只完成视觉树遍历这一半语义。
   */
  freezeBindings(): this {
    this.walkVisualTreeFrom(this, () => { /* 阶段 5：绑定冻结/解析在这里补 */ });
    return this;
  }

  /** 官方 `Panel.graduatedRange` */
  get graduatedRange(): number { return this._graduatedMax - this._graduatedMin; }

  /** 官方 `Panel.graduatedPointForValue(val, result?)`：Graduated 面板把数值映射成路径上的点 */
  graduatedPointForValue(val: number, result?: Point): Point {
    if (result === undefined) result = new Point(NaN, NaN);
    if (this._type !== PanelGraduated) {
      result.setTo(NaN, NaN);
      return result;
    }
    const v = Math.min(Math.max(val, this._graduatedMin), this._graduatedMax);
    const main = this.findMainElement();
    if (main === null) {
      result.setTo(NaN, NaN);
      return result;
    }
    const range = this.graduatedRange;
    const frac = range === 0 ? 0 : (v - this._graduatedMin) / range;
    const geo = Panel._geometryOf(main);
    const pt = geo !== null
      ? interpolatePath(computePathPoints(geo), frac)
      : { x: frac * main.actualBounds.width, y: 0, angle: 0, len: 0 };
    // 官方最后一步 `main.T.wt(e)`：把主元素局部坐标换算到本 Panel 坐标。
    // 官方的几何已归一化（bounds 原点 0），其 T 含 +strokeWidth/2 - bounds.origin；
    // 我们的几何可能带负原点（如表盘弧 bounds [-100,-100]），必须同样补偿，
    // 否则指针角度从中心算出来整体偏（226.8° vs 官方 229.5°）。
    let ox = main.actualBounds.x;
    let oy = main.actualBounds.y;
    if (geo !== null) {
      const bb = geo.bounds;
      const sw = (main as Shape).strokeWidth || 0;
      ox += sw / 2 - bb.x;
      oy += sw / 2 - bb.y;
    }
    result.setTo(pt.x + ox, pt.y + oy);
    return result;
  }

  /** 官方 `Panel.graduatedValueForPoint(pt)`：Graduated 面板把路径上的点反算成数值 */
  graduatedValueForPoint(pt: Point): number {
    if (this._type !== PanelGraduated) return NaN;
    const main = this.findMainElement();
    if (main === null) return NaN;
    const geo = Panel._geometryOf(main);
    if (geo === null) return NaN;
    // 官方 `main.T.Di(pt)`：本 Panel 坐标 → 主元素局部坐标
    const local = new Point(pt.x - main.actualBounds.x, pt.y - main.actualBounds.y);
    const frac = fractionAlongPath(computePathPoints(geo), local.x, local.y);
    return frac * this.graduatedRange + this._graduatedMin;
  }

  /** 官方 `Panel.isOpposite`（官方用位标志，这里用布尔量等价表达） */
  get isOpposite(): boolean { return this._isOpposite; }
  set isOpposite(value: boolean) {
    if (value === this._isOpposite) return;
    const old = this._isOpposite;
    this._isOpposite = value;
    this._invalidateMeasure();
    this.raiseChanged('isOpposite', old, value);
  }

  /** 官方 `Panel.panelLayoutState`（PanelLayout 的缓存状态，本项目尚未实现 PanelLayout） */
  get panelLayoutState(): any { return this._panelLayoutState; }
  set panelLayoutState(value: any) { this._panelLayoutState = value; }

  /** 主元素的几何：优先 Shape.geometry，否则按 figure + 尺寸生成 */
  private static _geometryOf(elem: GraphObject): Geometry | null {
    if (!(elem instanceof Shape)) return null;
    const shape = elem as Shape;
    const geo = shape.geometry;
    if (geo) return geo;
    const w = shape.desiredSize.width > 0 ? shape.desiredSize.width : shape.measuredBounds.width;
    const h = shape.desiredSize.height > 0 ? shape.desiredSize.height : shape.measuredBounds.height;
    return getFigureGeometry(shape.figure, w, h) || null;
  }

  findItemPanelForData(data: any): Panel | null {
    for (const elem of this._elements) {
      if (elem instanceof Panel && (elem as Panel).data === data) {
        return elem as Panel;
      }
    }
    return null;
  }

  getColumnDefinition(index: number): RowColumnDefinition {
    this._ensureColumnDefinition(index);
    return this._columnDefinitions[index];
  }

  /**
   * 官方 `Panel.addRowDefinition(rowIndex, options): this`：
   * get-or-create 行定义，把 options（Partial<RowColumnDefinition> 或数字高度）合并进去，返回 this（可链式 .add）。
   * 官方实现里 height/width 共用同一存储，跨传也会生效——这里按 isRow 归一化。
   */
  addRowDefinition(index?: number, options?: Partial<RowColumnDefinition> | RowColumnDefinition | number): this {
    const idx = index !== undefined && index !== null ? index : this._rowDefinitions.length;
    const def = this.getRowDefinition(idx);
    this._applyRowColumnOptions(def, true, options);
    this._invalidateMeasure();
    return this;
  }

  /**
   * 官方 `Panel.addColumnDefinition(colIndex, options): this`：
   * get-or-create 列定义，把 options 合并进去，返回 this。
   */
  addColumnDefinition(index?: number, options?: Partial<RowColumnDefinition> | RowColumnDefinition | number): this {
    const idx = index !== undefined && index !== null ? index : this._columnDefinitions.length;
    const def = this.getColumnDefinition(idx);
    this._applyRowColumnOptions(def, false, options);
    this._invalidateMeasure();
    return this;
  }

  private _applyRowColumnOptions(
    def: RowColumnDefinition,
    isRow: boolean,
    options?: Partial<RowColumnDefinition> | RowColumnDefinition | number
  ): void {
    if (options === undefined || options === null || !def) return;
    if (typeof options === 'number') {
      if (isRow) def.height = options;
      else def.width = options;
      return;
    }
    if (options instanceof RowColumnDefinition) {
      def._setValuesFrom(options);
      return;
    }
    const rec = options as Record<string, any>;
    // 官方 height/width 同存储：未按行列区分传入时互相兜底
    const sizeVal = isRow
      ? (rec.height !== undefined ? rec.height : rec.width)
      : (rec.width !== undefined ? rec.width : rec.height);
    if (sizeVal !== undefined) {
      if (isRow) def.height = sizeVal;
      else def.width = sizeVal;
    }
    for (const key of Object.keys(rec)) {
      if (key === 'width' || key === 'height') continue;
      if (key in def) (def as any)[key] = rec[key];
    }
  }

  getRowDefinition(index: number): RowColumnDefinition {
    this._ensureRowDefinition(index);
    return this._rowDefinitions[index];
  }

  removeColumnDefinition(index: number, count: number = 1): Panel {
    if (index >= 0 && index < this._columnDefinitions.length) {
      this._columnDefinitions.splice(index, count);
      this._invalidateMeasure();
    }
    return this;
  }

  removeRowDefinition(index: number, count: number = 1): Panel {
    if (index >= 0 && index < this._rowDefinitions.length) {
      this._rowDefinitions.splice(index, count);
      this._invalidateMeasure();
    }
    return this;
  }

  rebuildItemElements(): void {
    // Remove existing item-generated elements
    for (let i = this._elements.length - 1; i >= 0; i--) {
      const elem = this._elements[i];
      if (elem instanceof Panel && (elem as Panel)._itemIndex >= 0) {
        (elem as any)._panel = null;
        this._elements.splice(i, 1);
      }
    }
    const arr = this._itemArray;
    if (!arr || arr.length === 0) {
      this._invalidateMeasure();
      return;
    }
    // official Qp(): leading non-item count (Auto/Spot -> min(len,1), Table -> 0)
    let start = 0;
    if (this._type === PanelAuto || this._type === PanelSpot) {
      start = Math.min(this._elements.length, 1);
    }
    for (let i = 0; i < arr.length; i++) {
      const itemData = arr[i];
      const template = this._findItemTemplate(itemData);
      if (template) {
        const copy = template.copy() as Panel;
        copy._itemIndex = i;
        (copy as any)._panel = this;
        this._elements.splice(start + i, 0, copy);
        copy._data = itemData;
        // 与 Panel.add 一致：把所属 Part 传播到条目子树（克隆体的 _part 不随 copy 带过来），
        // 否则条目内部的 theme 绑定拿不到 diagram/themeManager。
        if (this._part) this._setPartRecursive(copy, this._part);
        copy.updateTargetBindings();
      }
    }
    // official EN(start, 0): TableRow -> row = element index, TableColumn -> column = element index
    let s = start, n = 0;
    while (s < this._elements.length) {
      const o = this._elements[s];
      if (o instanceof Panel) {
        if (o._type === PanelTableRow) {
          (o as any).row = s;
        } else if (o._type === PanelTableColumn) {
          (o as any).column = s;
        }
        (o as any)._itemIndex = n;
      }
      s++;
      n++;
    }
    this._invalidateMeasure();
  }

  updateTargetBindings(propname?: string): void {
    for (const elem of this._elements) {
      // 官方 RN：每个对象用自己的 data（子对象 _data 覆盖继承）
      const data = (elem as any)._data !== null && (elem as any)._data !== undefined
        ? (elem as any)._data : this._data;
      const bindings: Binding[] = (elem as any)._bindings;
      if (bindings && bindings.length > 0) {
        for (const binding of bindings) {
          // 官方：theme 绑定不依赖 data（无数据部件也要应用）
          if (!data && !binding.isToTheme) continue;
          // 官方 Binding.RN：source=''（监听任意属性）或 propname 未给或同名 → 应用
          if (propname === undefined || binding.sourceProperty === '' || propname === binding.sourceProperty) {
            // 官方 Binding.updateTarget：取源值 + converter + 写目标属性整段
            // 包在 try/catch 里，异常静默吞掉（见 Diagram._resolveBindingValue 注释）
            try {
              const val = binding.getValueFromSource(data, elem, null);
              // 官方：源值为 undefined 时整体跳过（不赋值），保留模板默认值
              if (val !== undefined) {
                (elem as any)[binding.targetProperty] = val;
              }
            } catch {
              /* 与官方一致：静默忽略 */
            }
          }
        }
      }
      if (elem instanceof Panel) {
        // 递归时向子面板传递 data（子面板 _data 未设则继承）
        if ((elem as Panel)._data === null || (elem as Panel)._data === undefined) {
          if (data !== this._data) {
            const saved = this._data;
            (this as any)._data = data;
            (elem as Panel).updateTargetBindings(propname);
            (this as any)._data = saved;
          } else {
            (elem as Panel).updateTargetBindings(propname);
          }
        } else {
          (elem as Panel).updateTargetBindings(propname);
        }
      }
    }
  }

  copy(): Panel {
    const copy = new Panel(this._type);
    this._copyPropertiesTo(copy);
    this._copyPanelPropertiesTo(copy);
    return copy;
  }

  /** Copy Panel-specific properties to another Panel */
  protected _copyPanelPropertiesTo(copy: Panel): void {
    copy._data = this._data;
    copy._padding = this._padding.copy();
    copy._defaultAlignment = this._defaultAlignment.copy();
    copy._defaultStretch = this._defaultStretch;
    copy._defaultColumnSeparatorStroke = this._defaultColumnSeparatorStroke;
    copy._defaultColumnSeparatorStrokeWidth = this._defaultColumnSeparatorStrokeWidth;
    copy._defaultColumnSeparatorDashArray = this._defaultColumnSeparatorDashArray ? [...this._defaultColumnSeparatorDashArray] : null;
    copy._defaultRowSeparatorStroke = this._defaultRowSeparatorStroke;
    copy._defaultRowSeparatorStrokeWidth = this._defaultRowSeparatorStrokeWidth;
    copy._defaultRowSeparatorDashArray = this._defaultRowSeparatorDashArray ? [...this._defaultRowSeparatorDashArray] : null;
    copy._isOpposite = this._isOpposite;
    copy._defaultSeparatorPadding = this._defaultSeparatorPadding.copy();
    copy._columnSizing = this._columnSizing;
    copy._rowSizing = this._rowSizing;
    copy._isClipping = this._isClipping;
    copy._isEnabled = this._isEnabled;
    copy._alignmentFocusName = this._alignmentFocusName;
    copy._itemArray = this._itemArray;
    copy._itemTemplate = this._itemTemplate;
    copy._itemTemplateMap = this._itemTemplateMap.copy();
    copy._itemCategoryProperty = this._itemCategoryProperty;
    copy._leftIndex = this._leftIndex;
    copy._topIndex = this._topIndex;
    copy._gridCellSize = this._gridCellSize.copy();
    copy._gridOrigin = this._gridOrigin.copy();
    copy._graduatedMin = this._graduatedMin;
    copy._graduatedMax = this._graduatedMax;
    copy._graduatedTickUnit = this._graduatedTickUnit;
    copy._graduatedTickBase = this._graduatedTickBase;
    // graduatedStart/graduatedEnd 已由 GraphObject._copyPropertiesTo 复制
    copy._viewboxStretch = this._viewboxStretch;
    copy._viewboxScaleX = this._viewboxScaleX;
    copy._viewboxScaleY = this._viewboxScaleY;
    // Copy elements
    for (const elem of this._elements) {
      const elemCopy = elem.copy();
      (elemCopy as any)._panel = copy;
      copy._elements.push(elemCopy);
      if ((this as any)._part && (this as any).isTopLevel) {
        copy._setPartRecursive(elemCopy, (this as any)._part);
      }
    }
    // Copy row/column definitions
    for (const def of this._rowDefinitions) {
      copy._rowDefinitions.push(def.copy());
    }
    for (const def of this._columnDefinitions) {
      copy._columnDefinitions.push(def.copy());
    }
  }

  // ============ Override _measure and _arrange ============

  _measure(widthConstraint: number, heightConstraint: number, minW?: number, minH?: number): void {
    const pad = this._padding;
    const mar = this._margin;
    const minS = this._minSize;
    const maxS = this._maxSize;
    const ds = this._desiredSize;
    // 官方 GraphObject.yt：约束/最小值先减去本对象 margin
    let t = Math.max(widthConstraint - mar.left - mar.right, 0);
    let i = Math.max(heightConstraint - mar.top - mar.bottom, 0);
    let e = Math.max((minW || 0) - mar.left - mar.right, 0);
    let s = Math.max((minH || 0) - mar.top - mar.bottom, 0);
    // 官方 yt：desiredSize 覆盖（Panel lp() = 0）
    if (isFinite(ds.width)) t = ds.width;
    if (isFinite(ds.height)) i = ds.height;
    // 官方 yt：按本面板有效 stretch 预处理；Panel 特有——None/Vertical/Horizontal 把约束置为 Infinity
    const S = this._getStretch(true);
    let f = e;
    let u = s;
    if (S === StretchNone) {
      f = 0;
      u = 0;
      t = Infinity;
      i = Infinity;
    } else if (S === StretchFill) {
      if (isFinite(t) && t > e) f = t;
      if (isFinite(i) && i > s) u = i;
    } else if (S === StretchHorizontal) {
      if (isFinite(t) && t > e) f = t;
      u = 0;
      i = Infinity;
    } else if (S === StretchVertical) {
      f = 0;
      if (isFinite(i) && i > s) u = i;
      t = Infinity;
    }
    // 官方 Panel.Yd：stretch 预处理（None/Vertical/Horizontal 会把约束置 Infinity）后按 desiredSize 回填
    if (isFinite(ds.width)) t = Math.min(ds.width, maxS.width);
    if (isFinite(ds.height)) i = Math.min(ds.height, maxS.height);
    // 官方 yt：min/max 夹取
    if (f > maxS.width && minS.width < maxS.width) f = maxS.width;
    if (u > maxS.height && minS.height < maxS.height) u = maxS.height;
    e = Math.max(f, minS.width);
    s = Math.max(u, minS.height);
    if (maxS.width < e) e = Math.min(minS.width, e);
    if (maxS.height < s) s = Math.min(minS.height, s);
    t = Math.min(maxS.width, t);
    i = Math.min(maxS.height, i);
    t = Math.max(e, t);
    i = Math.max(s, i);
    // 官方 Panel.Yd：可用尺寸扣除 padding
    const availW = Math.max(t - pad.left - pad.right, 0);
    const availH = Math.max(i - pad.top - pad.bottom, 0);
    const union = this._unionRect;
    union.setTo(0, 0, 0, 0);

    if (this._type === PanelAuto) {
      this._measureAuto(availW, availH);
    } else if (this._panelLayout !== null) {
      // 官方：构造第一个参数给了 PanelLayout 就走自定义布局的 measure
      const els = this._elements.filter(el => el.visible);
      this._panelLayout.measure(this, t, i, els, this._unionRect, e, s);
    } else if (this._type === PanelVertical) {
      this._measureVertical(availW, availH);
    } else if (this._type === PanelHorizontal) {
      this._measureHorizontal(availW, availH);
    } else if (this._type === PanelSpot) {
      this._measureSpot(availW, availH);
    } else if (this._type === PanelTable) {
      this._measureTable(availW, availH, e, s);
    } else if (this._type === PanelPosition) {
      this._measurePosition(availW, availH);
    } else if (this._type === PanelLink) {
      this._measureLink(availW, availH);
    } else if (this._type === PanelViewbox) {
      this._measureViewbox(availW, availH);
    } else if (this._type === PanelGraduated) {
      this._measureGraduated(availW, availH);
    } else if (this._type === PanelGrid) {
      // union 保持 (0,0,0,0)；官方 PanelLayoutGrid.measure 同步 u3/d3 设置
      this._updateGridSettings();
    } else {
      // 默认：所有可见元素包围盒
      let maxW = 0;
      let maxH = 0;
      for (const elem of this._elements) {
        if (!elem.visible) continue;
        elem._measure(availW, availH);
        const mb = elem.measuredBounds;
        const m = elem.margin;
        maxW = Math.max(maxW, mb.width + m.left + m.right);
        maxH = Math.max(maxH, mb.height + m.top + m.bottom);
      }
      union.setTo(0, 0, maxW, maxH);
    }

    // 官方 Panel.Yd：union 内容 + padding；desired/max/min 夹取；不被 constraint 夹
    let c = union.width + pad.left + pad.right;
    let fh = union.height + pad.top + pad.bottom;
    if (isFinite(ds.width)) c = ds.width;
    if (isFinite(ds.height)) fh = ds.height;
    c = Math.min(maxS.width, c);
    fh = Math.min(maxS.height, fh);
    c = Math.max(minS.width, c);
    fh = Math.max(minS.height, fh);
    c = Math.max(e, c);
    fh = Math.max(s, fh);
    this._originX = union.x;
    this._originY = union.y;
    union.setTo(union.x, union.y, c, fh);
    this._naturalBounds = new Rect(0, 0, c, fh);
    this._measuredBounds = new Rect(0, 0, c, fh);
    this._applyMeasureTransform();
  }

  /** 就地并入 union */
  private _unionInto(x: number, y: number, w: number, h: number): void {
    const u = this._unionRect;
    const nx = Math.min(u.x, x);
    const ny = Math.min(u.y, y);
    const nr = Math.max(u.right, x + w);
    const nb = Math.max(u.bottom, y + h);
    u.setTo(nx, ny, nr - nx, nb - ny);
  }

  _arrange(bounds: Rect): void {
    this._actualBounds = bounds.copy();

    if (this._type === PanelLink) {
      this._arrangeLink(bounds);
      return;
    }

    const pad = this._padding;
    // 官方 Panel.Vh 尾：`it.arrange(this, els, this.or)` —— 子元素排布用 measure 时的
    // or（naturalBounds 尺寸、未旋转未缩放），而不是传入的 actualBounds(AABB)。
    // 对未旋转/未缩放对象 or 尺寸 == bounds 尺寸（等价）；对带 angle/scale 的 Part，
    // 用 AABB 宽高排布会让子元素按旋转后的包围盒居中（Valve2 SHAPE x=7.2078 vs 官方 1.5747）。
    let baseW = bounds.width;
    let baseH = bounds.height;
    const ang = this.angle;
    const transformed = (typeof ang === 'number' && !isNaN(ang) && ang !== 0) || this.scale !== 1;
    if (transformed && (this as any)._rotPivot !== undefined) {
      const u = this._unionRect;
      if (u !== null && isFinite(u.width) && u.width > 0 && isFinite(u.height) && u.height > 0) {
        baseW = u.width;
        baseH = u.height;
      }
    }
    // Children are arranged relative to this panel's origin (0,0)
    const innerX = pad.left;
    const innerY = pad.top;
    const innerW = Math.max(0, baseW - pad.left - pad.right);
    const innerH = Math.max(0, baseH - pad.top - pad.bottom);

    if (this._type === PanelAuto) {
      this._arrangeAuto(innerX, innerY, innerW, innerH);
    } else if (this._panelLayout !== null) {
      // 官方：自定义 PanelLayout 的 arrange 用的是 measure 时算出的 union
      const els = this._elements.filter(el => el.visible);
      this._panelLayout.arrange(this, els, this._unionRect);
    } else if (this._type === PanelVertical) {
      this._arrangeVertical(innerX, innerY, innerW, innerH);
    } else if (this._type === PanelHorizontal) {
      this._arrangeHorizontal(innerX, innerY, innerW, innerH);
    } else if (this._type === PanelSpot) {
      this._arrangeSpot(innerX, innerY, innerW, innerH);
    } else if (this._type === PanelTable) {
      this._arrangeTable(innerX, innerY, innerW, innerH);
    } else if (this._type === PanelPosition) {
      this._arrangePosition(innerX, innerY, innerW, innerH);
    } else if (this._type === PanelGrid) {
      // 官方 PanelLayoutGrid.arrange 为空：网格线只由 renderGrid 按 panel 边界绘制
    } else if (this._type === PanelViewbox) {
      this._arrangeViewbox(innerX, innerY, innerW, innerH);
    } else if (this._type === PanelGraduated) {
      this._arrangeGraduated();
    } else {
      // Default: arrange all elements to fill
      for (const elem of this._elements) {
        if (!elem.visible) continue;
        elem._arrange(new Rect(innerX, innerY, innerW, innerH));
      }
    }
  }

  // ============ PanelAuto measure/arrange ============

  /**
   * Find the main element and separate others.
   * The main element is the first visible element with isPanelMain=true,
   * or the first visible element if none has isPanelMain.
   */
  private _findMainAndOthers(): { main: GraphObject | null; others: GraphObject[] } {
    const main = this.findMainElement();
    const others: GraphObject[] = [];
    for (const elem of this._elements) {
      if (elem !== main) others.push(elem);
    }
    return { main, others };
  }

  /** 官方 kN：主 Shape 的 spot1（Shape.spot1 → geometry.spot1 → TopLeft） */
  private _panelSpot1(g: GraphObject): Spot {
    if (g instanceof Shape) {
      const s = g.spot1;
      if (s !== Spot.Default) return s;
      const geo = g._getGeometry();
      if (geo !== null && geo.spot1) return geo.spot1;
    }
    return Spot.TopLeft;
  }

  /** 官方 PN：主 Shape 的 spot2 → BottomRight 兜底 */
  private _panelSpot2(g: GraphObject): Spot {
    if (g instanceof Shape) {
      const s = g.spot2;
      if (s !== Spot.Default) return s;
      const geo = g._getGeometry();
      if (geo !== null && geo.spot2) return geo.spot2;
    }
    return Spot.BottomRight;
  }

  /** 官方 PanelLayoutAuto.measure */
  private _measureAuto(availW: number, availH: number): void {
    const els = this._elements;
    if (els.length === 0) return;
    const main = this.findMainElement()!;
    const ma = main.margin;
    const u = ma.right + ma.left;
    const d = ma.top + ma.bottom;
    main._measure(availW, availH);
    let mb = main.measuredBounds;
    let stroke = 0;
    let mainUniform = false;
    if (main instanceof Shape) {
      stroke = (main as Shape).strokeWidth * main.scale;
      mainUniform = (main as any)._resolvedGeometryStretch() === 6;
    }
    let y = Math.max(mb.width + u, 0);
    let x = Math.max(mb.height + d, 0);
    const s1 = this._panelSpot1(main);
    const s2 = this._panelSpot2(main);
    let holeW = availW;
    let holeH = availH;
    if (isFinite(availW)) holeW = Math.max(Math.abs(s1.x * y + s1.offsetX - (s2.x * y + s2.offsetX)) - stroke, 0);
    if (isFinite(availH)) holeH = Math.max(Math.abs(s1.y * x + s1.offsetY - (s2.y * x + s2.offsetY)) - stroke, 0);
    // 官方 PanelLayoutAuto：holeW/holeH 只有在面板约束有限时才用主元素尺寸改写；
    // 约束为 Infinity 时**保持 Infinity** 直接传给其余子元素
    //（TextBlock 随后只按自身 maxSize 换行 —— flowchart 默认模板 maxSize 160）。
    // 约束有限的节点（如 absolute.html 的 size:'50 50'）走上面 isFinite 分支，不受影响。
    let maxT = 0;
    let maxTh = 0;
    for (const el of els) {
      if (el === main || !el.visible) continue;
      const em = el.margin;
      el._measure(holeW, holeH);
      mb = el.measuredBounds;
      y = Math.max(mb.width + em.left + em.right, 0);
      x = Math.max(mb.height + em.top + em.bottom, 0);
      maxT = Math.max(maxT, y);
      maxTh = Math.max(maxTh, x);
    }
    const union = this._unionRect;
    if (els.length === 1) {
      mb = main.measuredBounds;
      union.setTo(0, 0, Math.max(mb.width + u, 0), Math.max(mb.height + d, 0));
      return;
    }
    let D = 0;
    let F = 0;
    if (s2.x !== s1.x && s2.y !== s1.y) {
      D = maxT / Math.abs(s2.x - s1.x);
      F = maxTh / Math.abs(s2.y - s1.y);
    }
    D += Math.abs(s1.offsetX) + Math.abs(s2.offsetX) + stroke;
    F += Math.abs(s1.offsetY) + Math.abs(s2.offsetY) + stroke;
    // 官方：p.yM()===6（geometryStretch Uniform）→ D=F=max(D,F)
    if (mainUniform) D = F = Math.max(D, F);
    let R = main.stretch;
    if (R === StretchDefault) R = main._getStretch(false);
    if (R === StretchFill) {
      if (isFinite(availW)) D = availW;
      if (isFinite(availH)) F = availH;
    } else if (R === StretchHorizontal) {
      if (isFinite(availW)) D = availW;
    } else if (R === StretchVertical) {
      if (isFinite(availH)) F = availH;
    }
    main._measure(D, F);
    mb = main.measuredBounds;
    union.setTo(0, 0, Math.max(mb.width + u, 0), Math.max(mb.height + d, 0));
  }

  /** 官方 PanelLayoutAuto.arrange */
  private _arrangeAuto(innerX: number, innerY: number, innerW: number, innerH: number): void {
    const els = this._elements;
    if (els.length === 0) return;
    const main = this.findMainElement()!;
    const ma = main.margin;
    const pad = this._padding;
    const mb = main.measuredBounds;
    main._arrange(new Rect(pad.left + ma.left, pad.top + ma.top, mb.width, mb.height));
    const s1 = this._panelSpot1(main);
    const s2 = this._panelSpot2(main);
    const hx1 = s1.x * mb.width + s1.offsetX;
    const hy1 = s1.y * mb.height + s1.offsetY;
    const hx2 = s2.x * mb.width + s2.offsetX;
    const hy2 = s2.y * mb.height + s2.offsetY;
    const holeX = Math.min(hx1, hx2) + ma.left + pad.left;
    const holeY = Math.min(hy1, hy2) + ma.top + pad.top;
    const holeW = Math.abs(hx2 - hx1);
    const holeH = Math.abs(hy2 - hy1);
    for (const el of els) {
      if (el === main || !el.visible) continue;
      const eMb = el.measuredBounds;
      const em = el.margin;
      const boxW = Math.max(eMb.width + em.left + em.right, 0);
      const boxH = Math.max(eMb.height + em.top + em.bottom, 0);
      const A = this._resolveAlignment(el);
      const x = holeW * A.x + A.offsetX - boxW * A.x + em.left + holeX;
      const yy = holeH * A.y + A.offsetY - boxH * A.y + em.top + holeY;
      el._arrange(new Rect(x, yy, eMb.width, eMb.height));
    }
  }

  // ============ PanelVertical measure/arrange ============

  private _measureVertical(availW: number, availH: number): void {
    const pad = this._padding;
    let totalH = 0;
    let maxW = 0;
    // 官方 PanelLayoutVertical.measure 两阶段：第一遍只量 {None, Vertical} stretch 子元素
    // （只有它们决定面板内容宽），得到内容宽 maxW；第二遍把其余子元素（Fill/Horizontal/
    // Uniform 等随面板宽的）按内容宽量测（不扩展面板）。
    const fillElems: GraphObject[] = [];

    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const st = elem._getStretch(false);
      if (st !== StretchNone && st !== StretchVertical) {
        fillElems.push(elem);
        continue;
      }
      elem._measure(availW, Infinity);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      totalH += mb.height + m.top + m.bottom;
      maxW = Math.max(maxW, mb.width + m.left + m.right);
    }

    // 官方：i = desiredSize.width ? min(ds, maxSize) : (内容宽非0 ? min(内容宽, maxSize) : 原 availW)
    let contentW = availW;
    if (!isNaN(this._desiredSize.width)) {
      contentW = Math.min(this._desiredSize.width, this._maxSize.width);
    } else if (maxW !== 0) {
      contentW = Math.min(maxW, this._maxSize.width);
    }

    for (const elem of fillElems) {
      if (!elem.visible) continue;
      // 官方：u.yt(i, ...) —— 子元素自身 margin 在其 _measure（GraphObject.yt）内扣除
      elem._measure(contentW, Infinity);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      totalH += mb.height + m.top + m.bottom;
      maxW = Math.max(maxW, mb.width + m.left + m.right);
    }

    this._unionRect.setTo(0, 0, maxW, totalH);
  }

  private _arrangeVertical(innerX: number, innerY: number, innerW: number, innerH: number): void {
    let y = innerY;
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const m = elem.margin;
      const mb = elem.measuredBounds;
      const elemW = this._resolveStretchWidth(elem, innerW - m.left - m.right, mb.width);
      const alignment = this._resolveAlignment(elem);
      const xPos = alignment.positionInRect(new Rect(innerX, 0, innerW, 0));

      elem._arrange(new Rect(
        innerX + m.left + (alignment.x * (innerW - m.left - m.right - elemW)),
        y + m.top,
        elemW,
        mb.height
      ));
      y += mb.height + m.top + m.bottom;
    }
  }

  // ============ PanelHorizontal measure/arrange ============

  private _measureHorizontal(availW: number, availH: number): void {
    let totalW = 0;
    let maxH = 0;
    // 官方 PanelLayoutHorizontal.measure 两阶段：第一遍只量 {None, Horizontal} stretch 子元素
    // （决定内容高与宽累加），第二遍把其余（Fill/Vertical/Uniform 随面板高的）按内容高量测。
    // 宽一律按 `width = Infinity` 测量（`u.yt(1/0, i, 0, r)`），子元素自己按
    // desiredSize/maxSize 决定宽度（以前这里传 availW-totalW，累加超宽后会变负数，
    // 喂给 TextBlock 就是负宽 → `new Rect(0,0,-18.52,81.05)` 抛错，实测 regrouping）。
    const fillElems: GraphObject[] = [];

    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const st = elem._getStretch(false);
      if (st !== StretchNone && st !== StretchHorizontal) {
        fillElems.push(elem);
        continue;
      }
      elem._measure(Infinity, availH);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      totalW += mb.width + m.left + m.right;
      maxH = Math.max(maxH, mb.height + m.top + m.bottom);
    }

    let contentH = availH;
    if (!isNaN(this._desiredSize.height)) {
      contentH = Math.min(this._desiredSize.height, this._maxSize.height);
    } else if (maxH !== 0) {
      contentH = Math.min(maxH, this._maxSize.height);
    }

    for (const elem of fillElems) {
      if (!elem.visible) continue;
      elem._measure(Infinity, contentH);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      totalW += mb.width + m.left + m.right;
      maxH = Math.max(maxH, mb.height + m.top + m.bottom);
    }

    this._unionRect.setTo(0, 0, totalW, maxH);
  }

  private _arrangeHorizontal(innerX: number, innerY: number, innerW: number, innerH: number): void {
    let x = innerX;
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const m = elem.margin;
      const mb = elem.measuredBounds;
      const elemH = this._resolveStretchHeight(elem, innerH - m.top - m.bottom, mb.height);
      const alignment = this._resolveAlignment(elem);

      elem._arrange(new Rect(
        x + m.left,
        innerY + m.top + (alignment.y * (innerH - m.top - m.bottom - elemH)),
        mb.width,
        elemH
      ));
      x += mb.width + m.left + m.right;
    }
  }

  // ============ PanelSpot measure/arrange ============

  /** 官方 PanelLayoutSpot.measure（两遍） */
  private _measureSpot(availW: number, availH: number): void {
    const els = this._elements;
    if (els.length === 0) return;
    const main = this.findMainElement()!;
    const ma = main.margin;
    const u = ma.right + ma.left;
    const d = ma.top + ma.bottom;
    main._measure(availW, availH);
    const union = this._unionRect;
    // 第一遍：对齐参照盒 k = (0,0,mainW,mainH)；S = main margin 盒
    const mB = main.measuredBounds;
    let kw = mB.width;
    let kh = mB.height;
    const sBoxX = -ma.left;
    const sBoxY = -ma.top;
    const sBoxW = Math.max(mB.width + u, 0);
    const sBoxH = Math.max(mB.height + d, 0);
    let hasOther = false;
    for (const el of els) {
      if (el === main || !el.visible) continue;
      const em = el.margin;
      let D = em.left;
      let F = em.top;
      let cw = em.right + em.left;
      let ch = em.top + em.bottom;
      let T = availW;
      let L = availH;
      const R = el._getStretch(false);
      if (R === StretchFill) {
        T = kw;
        L = kh;
        cw = 0;
        ch = 0;
        D = 0;
        F = 0;
      } else if (R === StretchHorizontal) {
        T = kw;
        cw = 0;
        D = 0;
      } else if (R === StretchVertical) {
        L = kh;
        ch = 0;
        F = 0;
      }
      el._measure(T, L);
      const mb = el.measuredBounds;
      const y = Math.max(mb.width + cw, 0);
      const x = Math.max(mb.height + ch, 0);
      let A = el.alignment;
      if (A.isDefault()) A = this._defaultAlignment;
      if (A.isDefault() || isNaN(A.x) || isNaN(A.y)) A = Spot.Center;
      let I = el.alignmentFocus;
      if (I.isDefault()) I = Spot.Center;
      const ft = this._focusNameTarget(el, I);
      const X = -D + A.x * kw + A.offsetX - (ft !== null ? ft.x : I.x * mb.width + I.offsetX);
      const Y = -F + A.y * kh + A.offsetY - (ft !== null ? ft.y : I.y * mb.height + I.offsetY);
      if (!hasOther) {
        hasOther = true;
        union.setTo(X, Y, y, x);
      } else {
        this._unionInto(X, Y, y, x);
      }
    }
    if (!hasOther) union.setTo(sBoxX, sBoxY, sBoxW, sBoxH);
    else this._unionInto(sBoxX, sBoxY, sBoxW, sBoxH);
    // 主元素 stretch 早退（官方 switch）
    let R = main.stretch;
    if (R === StretchDefault) R = main._getStretch(false);
    if (R === StretchNone) return;
    if (R === StretchFill && !isFinite(availW) && !isFinite(availH)) return;
    if (R === StretchHorizontal && !isFinite(availW)) return;
    if (R === StretchVertical && !isFinite(availH)) return;
    // 第二遍：参照盒为 main margin 盒（不含 k.x 偏移）
    const mB2 = main.measuredBounds;
    kw = Math.max(mB2.width + u, 0);
    kh = Math.max(mB2.height + d, 0);
    if (!hasOther) return;
    for (const el of els) {
      if (el === main || !el.visible) continue;
      const em = el.margin;
      const mb = el.measuredBounds;
      const y = Math.max(mb.width + em.right + em.left, 0);
      const x = Math.max(mb.height + em.top + em.bottom, 0);
      let A = el.alignment;
      if (A.isDefault()) A = this._defaultAlignment;
      if (A.isDefault() || isNaN(A.x) || isNaN(A.y)) A = Spot.Center;
      let I = el.alignmentFocus;
      if (I.isDefault()) I = Spot.Center;
      const ft = this._focusNameTarget(el, I);
      const X = A.x * kw + A.offsetX - (ft !== null ? ft.x : I.x * mb.width + I.offsetX) - em.left;
      const Y = A.y * kh + A.offsetY - (ft !== null ? ft.y : I.y * mb.height + I.offsetY) - em.top;
      this._unionInto(X, Y, y, x);
    }
    this._unionInto(sBoxX, sBoxY, sBoxW, sBoxH);
  }

  /** 官方 PanelLayoutSpot.arrange */
  private _arrangeSpot(innerX: number, innerY: number, innerW: number, innerH: number): void {
    const els = this._elements;
    if (els.length === 0) return;
    const main = this.findMainElement()!;
    const pad = this._padding;
    const mb = main.measuredBounds;
    const fx = pad.left - this._originX;
    const fy = pad.top - this._originY;
    main._arrange(new Rect(fx, fy, mb.width, mb.height));
    const dw = mb.width;
    const dh = mb.height;
    for (const el of els) {
      if (el === main || !el.visible) continue;
      const eMb = el.measuredBounds;
      let A = el.alignment;
      if (A.isDefault()) A = this._defaultAlignment;
      if (A.isDefault() || isNaN(A.x) || isNaN(A.y)) A = Spot.Center;
      let I = el.alignmentFocus;
      if (I.isDefault()) I = Spot.Center;
      const ft = this._focusNameTarget(el, I);
      let f = A.x * dw + A.offsetX - (ft !== null ? ft.x : I.x * eMb.width + I.offsetX);
      let uu = A.y * dh + A.offsetY - (ft !== null ? ft.y : I.y * eMb.height + I.offsetY);
      f += -this._originX;
      uu += -this._originY;
      el._arrange(new Rect(pad.left + f, pad.top + uu, eMb.width, eMb.height));
    }
  }

  // ============ PanelTable measure/arrange (官方 PanelLayoutTable 移植) ============

  private _isRowColPanel(obj: GraphObject): obj is Panel {
    return obj instanceof Panel && (obj.type === PanelTableRow || obj.type === PanelTableColumn);
  }

  private _measureTable(availW: number, availH: number, minW: number, minH: number): void {
    const elements = this._elements;

    // 官方 measure：hoist TableRow/TableColumn 子元素到扁平单元格列表
    const flat: GraphObject[] = [];
    const hoisted: Panel[] = [];
    for (const E of elements) {
      if (this._isRowColPanel(E) && E.visible) {
        hoisted.push(E);
        for (const et of E._elements) {
          if (E.type === PanelTableRow) (et as GraphObject).row = (E as Panel).row;
          else (et as GraphObject).column = (E as Panel).column;
          flat.push(et);
        }
      } else {
        flat.push(E);
      }
    }

    if (flat.length === 0) {
      this.getRowDefinition(0);
      this.getColumnDefinition(0);
    }

    // 单元格映射 c[row][col] = [elements]
    const cells: (GraphObject[] | undefined)[][] = [];
    for (const E of flat) {
      if (!E.visible) continue;
      const r = E.row;
      const c = E.column;
      if (!cells[r]) cells[r] = [];
      if (!cells[r][c]) cells[r][c] = [];
      cells[r][c]!.push(E);
    }

    const spanElems: GraphObject[] = [];            // 官方 u
    const singleElems: GraphObject[] = [];          // 官方 d
    const colFillMark: (number | null | undefined)[] = [];  // 官方 m
    const rowFillMark: (number | null | undefined)[] = [];  // 官方 g
    const colDefTouched: boolean[] = [];             // 官方 f

    let p = availW;   // 剩余宽度预算
    let y = availH;   // 剩余高度预算

    // 重置已存在的定义
    for (const def of this._rowDefinitions) { def.actual = 0; def.measured = 0; }
    for (const def of this._columnDefinitions) { def.actual = 0; def.measured = 0; }

    const topIndex = Math.min(this.topIndex, cells.length - 1);
    const leftIndex = Math.min(this.leftIndex,
      cells.reduce((mx, row) => Math.max(mx, row ? row.length : 0), 0) - 1);

    // ============ PASS 1：内容自然测量（yt(∞,∞,0,0)）并增长行/列定义 ============
    const rowCount = cells.length;
    for (let V = 0; V < rowCount; V++) {
      if (!cells[V]) continue;
      const P = cells[V]!.length;
      const rowDef = this.getRowDefinition(V);
      rowDef.actual = 0;
      rowDef.measured = 0;
      for (let W = 0; W < P; W++) {
        const list = cells[V][W];
        if (!list) continue;
        const colDef = this.getColumnDefinition(W);
        if (colDefTouched[W] === undefined) {
          colDef.actual = 0;
          colDef.measured = 0;
          colDefTouched[W] = true;
        }
        for (const nt of list) {
          if (!nt.visible) continue;
          const rowSpan1 = nt.rowSpan <= 1;
          const colSpan1 = nt.columnSpan <= 1;
          if ((!rowSpan1 || !colSpan1) && !(V < topIndex) && !(W < leftIndex)) spanElems.push(nt);
          const mg = nt.margin;
          const mh = mg.right + mg.left;
          const mv = mg.top + mg.bottom;
          const C = nt._gpWithDefs(this, rowDef, colDef, false);
          const dsz = nt.desiredSize;
          const wSet = !isNaN(dsz.width);
          const hSet = !isNaN(dsz.height);
          if (C !== StretchNone && !(wSet && hSet) && !(V < topIndex) && !(W < leftIndex)) {
            if (colSpan1 && colFillMark[W] === undefined &&
                (C === StretchFill || C === StretchHorizontal)) {
              colFillMark[W] = -1;
            }
            if (rowSpan1 && rowFillMark[V] === undefined &&
                (C === StretchFill || C === StretchVertical)) {
              rowFillMark[V] = -1;
            }
            if (rowSpan1 && colSpan1) singleElems.push(nt);
          }
          nt._measure(Infinity, Infinity, 0, 0);
          if (V < topIndex || W < leftIndex) continue;
          const mb = nt.measuredBounds;
          const gw = Math.max(mb.width + mh, 0);
          const gh = Math.max(mb.height + mv, 0);
          if (rowSpan1 && (C === StretchNone || C === StretchHorizontal)) {
            const spacing = rowDef.computeEffectiveSpacing();
            const wasZero = rowDef.actual === 0;
            let grow = Math.max(gh - rowDef.actual, 0);
            if (grow + (wasZero ? spacing : 0) > y) grow = Math.max(y - spacing, 0);
            rowDef.measured = rowDef.measured + grow;
            rowDef.actual = rowDef.actual + grow;
            y = Math.max(y - (grow + (wasZero ? spacing : 0)), 0);
          }
          if (colSpan1 && (C === StretchNone || C === StretchVertical)) {
            const spacing = colDef.computeEffectiveSpacing();
            const wasZero = colDef.actual === 0;
            let grow = Math.max(gw - colDef.actual, 0);
            if (grow + (wasZero ? spacing : 0) > p) grow = Math.max(p - spacing, 0);
            colDef.measured = colDef.measured + grow;
            colDef.actual = colDef.actual + grow;
            p = Math.max(p - (grow + (wasZero ? spacing : 0)), 0);
          }
        }
      }
    }

    // ============ 固定尺寸合计 L/D，重算剩余预算 ============
    let L = 0;   // 列内容合计
    let D = 0;   // 行内容合计
    const colCount = this._columnDefinitions.length;
    for (let V = 0; V < colCount; V++) {
      const def = this._columnDefinitions[V];
      if (def === undefined) continue;
      L += isNaN(def.width) ? def.measured : def.width;
      if (def.measured !== 0) L += def.computeEffectiveSpacing();
    }
    const rowsDefCount = this._rowDefinitions.length;
    for (let V = 0; V < rowsDefCount; V++) {
      const def = this._rowDefinitions[V];
      if (def === undefined) continue;
      D += isNaN(def.height) ? def.measured : def.height;
      if (def.measured !== 0) D += def.computeEffectiveSpacing();
    }
    p = Math.max(availW - L, 0);
    y = Math.max(availH - D, 0);
    let F = y;   // 行剩余预算（供单格元素分配）
    let R = p;   // 列剩余预算

    // ============ d 通道：单格元素的内容最大值 m/g ============
    for (const E of singleElems) {
      const rowDef = this.getRowDefinition(E.row);
      const colDef = this.getColumnDefinition(E.column);
      const mb = E.measuredBounds;
      const mg = E.margin;
      const mh = mg.right + mg.left;
      const mv = mg.top + mg.bottom;
      if (colDef.measured === 0 && colFillMark[E.column] !== undefined) {
        colFillMark[E.column] = Math.max(mb.width + mh, colFillMark[E.column] as number);
      } else {
        colFillMark[E.column] = null;
      }
      if (rowDef.measured === 0 && rowFillMark[E.row] !== undefined) {
        rowFillMark[E.row] = Math.max(mb.height + mv, rowFillMark[E.row] as number);
      } else {
        rowFillMark[E.row] = null;
      }
    }
    let O = 0;
    for (let i = 0; i < colFillMark.length; i++) {
      if (colFillMark[i] !== undefined) O += colFillMark[i] as any;
    }
    let I = 0;
    for (let i = 0; i < rowFillMark.length; i++) {
      if (rowFillMark[i] !== undefined) I += rowFillMark[i] as any;
    }

    // ============ 单元格通道：按单元格约束二次测量 ============
    let cw = 0;   // 当前单元格宽
    let ch = 0;   // 当前单元格高
    for (const E of singleElems) {
      const rowDef = this.getRowDefinition(E.row);
      const colDef = this.getColumnDefinition(E.column);
      let cellW: number;
      if (isFinite(colDef.width)) cellW = colDef.width;
      else if (isFinite(p) && colFillMark[E.column] !== null) {
        cellW = O === 0 ? colDef.actual + p : (colFillMark[E.column] as number) / O * R;
      } else if (colFillMark[E.column] !== null) cellW = p;
      else cellW = colDef.actual || p;
      cellW = Math.max(0, cellW - colDef.computeEffectiveSpacing());
      let cellH: number;
      if (isFinite(rowDef.height)) cellH = rowDef.height;
      else if (isFinite(y) && rowFillMark[E.row] !== null) {
        cellH = I === 0 ? rowDef.actual + y : (rowFillMark[E.row] as number) / I * F;
      } else if (rowFillMark[E.row] !== null) cellH = y;
      else cellH = rowDef.actual || y;
      cellH = Math.max(0, cellH - rowDef.computeEffectiveSpacing());
      cw = Math.max(colDef.minimum, Math.min(cellW, colDef.maximum));
      ch = Math.max(rowDef.minimum, Math.min(cellH, rowDef.maximum));
      const C = E._gpWithDefs(this, rowDef, colDef, false);
      if (C === StretchHorizontal) ch = Math.max(ch, rowDef.actual + y);
      else if (C === StretchVertical) cw = Math.max(cw, colDef.actual + p);
      const mg = E.margin;
      const mh = mg.right + mg.left;
      const mv = mg.top + mg.bottom;
      let at = colDef.minimum;
      let ct = rowDef.minimum;
      const mb = E.measuredBounds;
      if (mb.width === 0 && colFillMark[E.column] !== null) at = Math.max(at, colFillMark[E.column] as any);
      if (mb.height === 0 && rowFillMark[E.row] !== null) ct = Math.max(at, rowFillMark[E.row] as any);
      E._measure(cw, ch, at, ct);
      const mb2 = E.measuredBounds;
      let fw = Math.max(mb2.width + mh, 0);
      let fh = Math.max(mb2.height + mv, 0);
      if (isFinite(p)) fw = Math.min(fw, cw);
      if (isFinite(y)) fh = Math.min(fh, ch);
      const prevH = rowDef.actual;
      rowDef.actual = Math.max(rowDef.actual, fh);
      rowDef.measured = Math.max(rowDef.measured, fh);
      const growH = rowDef.actual - prevH;
      y = Math.max(y - growH, 0);
      if (rowFillMark[E.row] === null) F = Math.max(F - growH, 0);
      const prevW = colDef.actual;
      colDef.actual = Math.max(colDef.actual, fw);
      colDef.measured = Math.max(colDef.measured, fw);
      const growW = colDef.actual - prevW;
      p = Math.max(p - growW, 0);
      if (colFillMark[E.column] === null) R = Math.max(R - growW, 0);
    }

    // ============ 跨行/列元素通道 ============
    if (spanElems.length > 0) {
      const K: (number | undefined)[] = [];   // 行 actual 快照
      const z: (number | undefined)[] = [];   // 列 actual 快照
      for (let V = 0; V < rowCount; V++) {
        if (!cells[V]) continue;
        K[V] = this.getRowDefinition(V).actual;
        for (let W = 0; W < cells[V]!.length; W++) {
          if (!cells[V][W]) continue;
          z[W] = this.getColumnDefinition(W).actual;
        }
      }
      const Yw = { w: 0 };
      const Yh = { h: 0 };
      const spanExtra = { w: 0, h: 0 };
      for (const E of spanElems) {
        if (!E.visible) continue;
        const rowDef = this.getRowDefinition(E.row);
        const colDef = this.getColumnDefinition(E.column);
        Yw.w = Math.max(colDef.minimum, Math.min(availW, colDef.maximum));
        Yh.h = Math.max(rowDef.minimum, Math.min(availH, rowDef.maximum));
        const C = E._gpWithDefs(this, rowDef, colDef, false);
        if (C === StretchFill) {
          if (z[E.column] !== 0 && z[E.column] !== undefined) Yw.w = Math.min(Yw.w, z[E.column] as number);
          if (K[E.row] !== 0 && K[E.row] !== undefined) Yh.h = Math.min(Yh.h, K[E.row] as number);
        } else if (C === StretchHorizontal) {
          if (z[E.column] !== 0 && z[E.column] !== undefined) Yw.w = Math.min(Yw.w, z[E.column] as number);
        } else if (C === StretchVertical) {
          if (K[E.row] !== 0 && K[E.row] !== undefined) Yh.h = Math.min(Yh.h, K[E.row] as number);
        }
        if (C === StretchFill || C === StretchVertical) {
          let extra = 0;
          for (let st = 0; st < this._rowDefinitions.length; st++) {
            if (st >= E.row && st < E.row + E.rowSpan) continue;
            const rd = this._rowDefinitions[st];
            if (rd !== undefined) {
              extra += K[st] || 0;
              if (rd.measured !== 0) extra += rd.computeEffectiveSpacing();
            }
          }
          Yh.h = Math.max(Yh.h - extra, 0);
        }
        if (C === StretchFill || C === StretchHorizontal) {
          let extra = 0;
          for (let st = 0; st < this._columnDefinitions.length; st++) {
            if (st >= E.column && st < E.column + E.columnSpan) continue;
            const cd = this._columnDefinitions[st];
            if (cd !== undefined) {
              extra += z[st] || 0;
              if (cd.measured !== 0) extra += cd.computeEffectiveSpacing();
            }
          }
          Yw.w = Math.max(Yw.w - extra, 0);
        }
        if (isFinite(colDef.width)) Yw.w = colDef.width;
        if (isFinite(rowDef.height)) Yh.h = rowDef.height;
        spanExtra.w = 0;
        spanExtra.h = 0;
        let at = colDef.minimum;
        let ct = rowDef.minimum;
        let lastRowDef = rowDef;
        for (let st = 1; st < E.rowSpan && !(E.row + st >= this._rowDefinitions.length); st++) {
          const rd = this.getRowDefinition(E.row + st);
          lastRowDef = rd;
          if (C === StretchFill || C === StretchVertical) {
            if (rd.actual === 0) continue;
            spanExtra.h += Math.max(rd.minimum, Math.min(rd.actual, rd.maximum));
          } else {
            spanExtra.h += Math.max(rd.minimum, isNaN(rd.height) ? rd.maximum : Math.min(rd.height, rd.maximum));
          }
          ct += rd.minimum;
        }
        let lastColDef = colDef;
        for (let st = 1; st < E.columnSpan && !(E.column + st >= this._columnDefinitions.length); st++) {
          const cd = this.getColumnDefinition(E.column + st);
          lastColDef = cd;
          if (C === StretchFill || C === StretchHorizontal) {
            if (cd.actual === 0) continue;
            spanExtra.w += Math.max(cd.minimum, Math.min(cd.actual, cd.maximum));
          } else {
            spanExtra.w += Math.max(cd.minimum, isNaN(cd.width) ? cd.maximum : Math.min(cd.width, cd.maximum));
          }
          at += cd.minimum;
        }
        Yw.w += spanExtra.w;
        Yh.h += spanExtra.h;
        const mg = E.margin;
        const mh = mg.right + mg.left;
        const mv = mg.top + mg.bottom;
        E._measure(Yw.w, Yh.h, at, ct);
        const mb = E.measuredBounds;
        const fw = Math.max(mb.width + mh, 0);
        const fh = Math.max(mb.height + mv, 0);
        // 行跨度增长
        let spanTotal = 0;
        let growDef = lastRowDef;
        for (let st = 0; st < E.rowSpan && !(E.row + st >= this._rowDefinitions.length); st++) {
          const rd = this.getRowDefinition(E.row + st);
          growDef = rd;
          spanTotal += rd.total || 0;
        }
        if (spanTotal < fh) {
          let remain = fh - spanTotal;
          if (rowDef.spanAllocation !== null) {
            const alloc = rowDef.spanAllocation;
            for (let ut = 0; ut < E.rowSpan && !(remain <= 0 || E.row + ut >= this._rowDefinitions.length); ut++) {
              const rd = this.getRowDefinition(E.row + ut);
              const base = rd.actual;
              const add = alloc(E, rd, fh - spanTotal);
              rd.actual = Math.min(rd.maximum, base + add);
              if (rd.actual !== base) remain -= rd.actual - base;
            }
          }
          let g = growDef;
          while (remain > 0 && g !== undefined) {
            const base = g.actual;
            if (isNaN(g.height) && g.maximum > base) {
              g.actual = Math.min(g.maximum, base + remain);
              if (g.actual !== base) remain -= g.actual - base;
            }
            if (g.index === 0) break;
            g = this.getRowDefinition(g.index - 1);
          }
        }
        // 列跨度增长
        let spanTotalC = 0;
        let growDefC = lastColDef;
        for (let st = 0; st < E.columnSpan && !(E.column + st >= this._columnDefinitions.length); st++) {
          const cd = this.getColumnDefinition(E.column + st);
          growDefC = cd;
          spanTotalC += cd.total || 0;
        }
        if (spanTotalC < fw) {
          let remain = fw - spanTotalC;
          if (colDef.spanAllocation !== null) {
            const alloc = colDef.spanAllocation;
            for (let ut = 0; ut < E.columnSpan && !(remain <= 0 || E.column + ut >= this._columnDefinitions.length); ut++) {
              const cd = this.getColumnDefinition(E.column + ut);
              const base = cd.actual;
              const add = alloc(E, cd, fw - spanTotalC);
              cd.actual = Math.min(cd.maximum, base + add);
              if (cd.actual !== base) remain -= cd.actual - base;
            }
          }
          let g = growDefC;
          while (remain > 0 && g !== undefined) {
            const base = g.actual;
            if (isNaN(g.width) && g.maximum > base) {
              g.actual = Math.min(g.maximum, base + remain);
              if (g.actual !== base) remain -= g.actual - base;
            }
            if (g.index === 0) break;
            g = this.getColumnDefinition(g.index - 1);
          }
        }
      }
    }

    // ============ 最终列/行缩放与位置 ============
    const ds = this._desiredSize;
    const maxS = this._maxSize;
    const C = this._getStretch(true);
    let L2 = 0;
    let D2 = 0;
    let q = 0;   // 固定列宽合计
    let Q = 0;   // 固定行高合计
    for (let V = 0; V < colCount; V++) {
      const def = this._columnDefinitions[V];
      if (def === undefined) continue;
      if (isFinite(def.width)) {
        q += def.width;
        q += def.computeEffectiveSpacing();
        continue;
      }
      if (def.effectiveSizing() === SizingNone) {
        q += def.actual;
        q += def.computeEffectiveSpacing();
        continue;
      }
      if (def.actual !== 0) {
        L2 += def.actual;
        L2 += def.computeEffectiveSpacing();
      }
    }
    let H = 0;
    if (isFinite(ds.width)) H = Math.min(ds.width, maxS.width);
    else if (C !== StretchNone && isFinite(availW)) H = availW;
    else H = L2;
    H = Math.max(H, isFinite(availW) ? Math.min(minW, availW) : minW);
    H = Math.max(H - q, 0);
    const J = L2 === 0 ? 1 : Math.max(H / L2, 1);
    let offX = 0;
    for (let V = 0; V < colCount; V++) {
      const def = this._columnDefinitions[V];
      if (def === undefined) continue;
      if (!isFinite(def.width) && def.effectiveSizing() !== SizingNone) def.actual = def.actual * J;
      def.position = offX;
      if (def.actual !== 0) {
        offX += def.actual;
        offX += def.computeEffectiveSpacing();
      }
    }
    let v = 0;
    for (let V = 0; V < rowsDefCount; V++) {
      const def = this._rowDefinitions[V];
      if (def === undefined) continue;
      if (isFinite(def.height)) {
        Q += def.height;
        Q += def.computeEffectiveSpacing();
        continue;
      }
      if (def.effectiveSizing() === SizingNone) {
        Q += def.actual;
        Q += def.computeEffectiveSpacing();
        continue;
      }
      if (def.actual !== 0) {
        D2 += def.actual;
        D2 += def.computeEffectiveSpacing();
      }
    }
    if (isFinite(ds.height)) v = Math.min(ds.height, maxS.height);
    else if (C !== StretchNone && isFinite(availH)) v = availH;
    else v = D2;
    v = Math.max(v, isFinite(availH) ? Math.min(minH, availH) : minH);
    v = Math.max(v - Q, 0);
    const TT = D2 === 0 ? 1 : Math.max(v / D2, 1);
    let offY = 0;
    for (let V = 0; V < rowsDefCount; V++) {
      const def = this._rowDefinitions[V];
      if (def === undefined) continue;
      if (!isFinite(def.height) && def.effectiveSizing() !== SizingNone) def.actual = def.actual * TT;
      def.position = offY;
      if (def.actual !== 0) {
        offY += def.actual;
        offY += def.computeEffectiveSpacing();
      }
    }

    // hoisted TableRow/TableColumn 面板自身的 measuredBounds
    for (const E of hoisted) {
      let w = 0;
      let h = 0;
      if (E.type === PanelTableRow) {
        w = offX;
        h = this.getRowDefinition(E.row).actual;
      } else {
        w = this.getColumnDefinition(E.column).actual;
        h = offY;
      }
      E._measuredBounds = new Rect(0, 0, w, h);
      E._naturalBounds = new Rect(0, 0, w, h);
    }

    // 官方：单元格缓存 t.Gh 供 arrange 使用；n 内容尺寸 → union
    (this as any)._lastCells = cells;
    this._unionRect.setTo(0, 0, offX, offY);
  }

  private _arrangeTable(innerX: number, innerY: number, innerW: number, innerH: number): void {
    const cells = (this as any)._lastCells as (GraphObject[] | undefined)[][] | undefined;
    if (!cells) return;
    const pad = this._padding;
    const padL = pad.left;
    const padT = pad.top;
    const fullW = innerW + padL + pad.right;
    const fullH = innerH + padT + pad.bottom;

    const rowDefs = this._rowDefinitions;
    const colDefs = this._columnDefinitions;
    const c = cells.length;
    let f = 0;
    for (let N = 0; N < c; N++) {
      if (cells[N]) f = Math.max(f, cells[N]!.length);
    }

    // 首个非零 actual 的行/列偏移（topIndex/leftIndex 滚动）
    let pIdx = Math.min(this.topIndex, c - 1);
    let rowOffset = 0;
    if (rowDefs.length > 0) {
      while (pIdx !== c && (rowDefs[pIdx] === undefined || rowDefs[pIdx].actual === 0)) pIdx++;
      pIdx = Math.max(Math.min(pIdx, c - 1), 0);
      rowOffset = -(rowDefs[pIdx] ? rowDefs[pIdx].position : 0);
    }
    let yIdx = Math.min(this.leftIndex, f - 1);
    let colOffset = 0;
    if (colDefs.length > 0) {
      while (yIdx !== f && (colDefs[yIdx] === undefined || colDefs[yIdx].actual === 0)) yIdx++;
      yIdx = Math.max(Math.min(yIdx, f - 1), 0);
      colOffset = -(colDefs[yIdx] ? colDefs[yIdx].position : 0);
    }
    let firstRowIdx = 0;
    while (firstRowIdx !== c && rowDefs[firstRowIdx] === undefined) firstRowIdx++;
    let firstColIdx = 0;
    while (firstColIdx !== f && colDefs[firstColIdx] === undefined) firstColIdx++;

    // ============ 第一遍：hoisted TableRow/TableColumn 面板自身矩形 ============
    for (const M of this._elements) {
      if (!this._isRowColPanel(M) || !M.visible) continue;
      let k: RowColumnDefinition;
      let Pc: RowColumnDefinition;
      let cellY: number;
      let cellX: number;
      if (M.type === PanelTableRow) {
        k = this.getRowDefinition(M.row);
        Pc = this.getColumnDefinition(firstColIdx);
        cellY = k.position + rowOffset + padT;
        if (k.actual !== 0) cellY += k.computeEffectiveSpacingTop(Math.max(firstRowIdx, pIdx));
        cellX = Pc.position + colOffset + padL;
        if (Pc.actual !== 0) cellX += Pc.computeEffectiveSpacingTop(Math.max(firstColIdx, yIdx));
      } else {
        k = this.getRowDefinition(firstRowIdx);
        Pc = this.getColumnDefinition(M.column);
        cellY = k.position + rowOffset + padT;
        if (k.actual !== 0) cellY += k.computeEffectiveSpacingTop(Math.max(firstRowIdx, pIdx));
        cellX = Pc.position + colOffset + padL;
        if (Pc.actual !== 0) cellX += Pc.computeEffectiveSpacingTop(Math.max(firstColIdx, yIdx));
      }
      const mb = M.measuredBounds;
      const x = M.type === PanelTableRow ? padL : cellX;
      const yy = M.type === PanelTableColumn ? padT : cellY;
      M._actualBounds = new Rect(x, yy, mb.width, mb.height);
      M._naturalBounds = new Rect(0, 0, mb.width, mb.height);
    }

    // ============ 第二遍：单元格内元素对齐排布 ============
    for (let N = 0; N < c; N++) {
      const row = cells[N];
      if (!row) continue;
      const M = this.getRowDefinition(N);
      let a = M.position + rowOffset + padT;
      if (M.actual !== 0) a += M.computeEffectiveSpacingTop(Math.max(firstRowIdx, pIdx));
      for (let Cc = 0; Cc < row.length; Cc++) {
        const list = row[Cc];
        if (!list) continue;
        const T = this.getColumnDefinition(Cc);
        let h = T.position + colOffset + padL;
        if (T.actual !== 0) h += T.computeEffectiveSpacingTop(Math.max(firstColIdx, yIdx));
        for (const R of list) {
          const I = R.measuredBounds;
          let spanW = 0;
          let spanH = 0;
          for (let st = 1; st < R.rowSpan && !(N + st >= rowDefs.length); st++) {
            const rd = rowDefs[N + st];
            if (rd !== undefined && rd.actual !== 0) spanH += rd.total;
          }
          for (let st = 1; st < R.columnSpan && !(Cc + st >= colDefs.length); st++) {
            const cd = colDefs[Cc + st];
            if (cd !== undefined && cd.actual !== 0) spanW += cd.total;
          }
          const O = T.actual + spanW;      // 单元格宽
          const X = M.actual + spanH;      // 单元格高
          const cellX = h;
          const cellY = a;
          const clipX = h;
          const clipY = a;
          let clipW = O;
          let clipH = X;
          if (cellX + O > fullW) clipW = Math.max(fullW - cellX, 0);
          if (cellY + X > fullH) clipH = Math.max(fullH - cellY, 0);

          let q = R.alignment;
          let Q: number, Jv: number, tt: number, Vv: number;
          if (q.isDefault()) {
            let dq = this._defaultAlignment;
            if (dq.isDefault() || isNaN(dq.x) || isNaN(dq.y)) dq = Spot.Center;
            Q = dq.x; Jv = dq.y; tt = dq.offsetX; Vv = dq.offsetY;
            const colAl = T.alignment;
            const rowAl = M.alignment;
            if (!colAl.isDefault() && !isNaN(colAl.x) && !isNaN(colAl.y)) {
              Q = colAl.x;
              tt = colAl.offsetX;
            }
            if (!rowAl.isDefault() && !isNaN(rowAl.x) && !isNaN(rowAl.y)) {
              Jv = rowAl.y;
              Vv = rowAl.offsetY;
            }
          } else {
            Q = q.x; Jv = q.y; tt = q.offsetX; Vv = q.offsetY;
          }
          if (isNaN(Q) || isNaN(Jv)) {
            Q = 0.5; Jv = 0.5; tt = 0; Vv = 0;
          }

          let Ew = I.width;
          let Wh = I.height;
          const mg = R.margin;
          const mh = mg.right + mg.left;
          const mv = mg.top + mg.bottom;
          const C = R._gpWithDefs(this, M, T, false);
          if (isNaN(R.desiredSize.width) && (C === StretchFill || C === StretchHorizontal)) {
            Ew = Math.max(O - mh, 0);
          }
          if (isNaN(R.desiredSize.height) && (C === StretchFill || C === StretchVertical)) {
            Wh = Math.max(X - mv, 0);
          }
          Ew = Math.min(R.maxSize.width, Ew);
          Wh = Math.min(R.maxSize.height, Wh);
          Ew = Math.max(R.minSize.width, Ew);
          Wh = Math.max(R.minSize.height, Wh);
          const boxW = Ew + mh;
          const boxH = Wh + mv;
          const ex = cellX + O * Q - boxW * Q + tt + mg.left;
          const ey = cellY + X * Jv - boxH * Jv + Vv + mg.top;
          if (R.visible) {
            const contains = ex >= clipX && ey >= clipY &&
              ex + I.width <= clipX + clipW && ey + I.height <= clipY + clipH;
            if (contains) {
              R._arrange(new Rect(ex, ey, Ew, Wh));
            } else {
              R._arrange(new Rect(ex, ey, Ew, Wh));
            }
          }
        }
      }
    }
  }

  // ============ PanelPosition measure/arrange ============

  /** 官方 PanelLayoutPosition.measure：union 隐含 (0,0)（初始 union 为空点） */
  private _measurePosition(availW: number, availH: number): void {
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      elem._measure(availW, availH);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      const boxW = Math.max(mb.width + m.left + m.right, 0);
      const boxH = Math.max(mb.height + m.top + m.bottom, 0);
      let px = elem.position.x;
      let py = elem.position.y;
      if (!isFinite(px)) px = 0;
      if (!isFinite(py)) py = 0;
      // isGeometryPositioned 的 Shape 把几何画在父面板坐标系里（原始几何坐标），
      // 其 measuredBounds 的原点就是几何原点，必须计入并集，
      // 否则面板量出的尺寸小于实际绘制范围（pieCharts 会出现两个饼重叠）。
      if ((elem as any).isGeometryPositioned === true) {
        px += mb.x;
        py += mb.y;
      }
      this._unionInto(px, py, boxW, boxH);
    }
  }

  /** 官方 PanelLayoutPosition.arrange：pos - (union - pad) + margin */
  private _arrangePosition(innerX: number, innerY: number, innerW: number, innerH: number): void {
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const mb = elem.measuredBounds;
      const m = elem.margin;
      let px = elem.position.x;
      let py = elem.position.y;
      if (!isFinite(px)) px = 0;
      if (!isFinite(py)) py = 0;
      elem._arrange(new Rect(
        innerX + px + m.left,
        innerY + py + m.top,
        mb.width,
        mb.height
      ));
    }
  }

  // ============ PanelViewbox measure/arrange ============

  private _measureViewbox(availW: number, availH: number): void {
    const child = this._elements.find(e => e.visible) || null;

    if (child) {
      child._measure(Infinity, Infinity);
      const mb = child.measuredBounds;
      const m = child.margin;
      const w = Math.min(availW, mb.width + m.left + m.right);
      const h = Math.min(availH, mb.height + m.top + m.bottom);
      this._unionRect.setTo(0, 0, w, h);
    }
  }

  private _arrangeViewbox(innerX: number, innerY: number, width: number, height: number): void {
    const child = this._elements.find(e => e.visible) || null;
    if (!child) {
      this._viewboxScaleX = 1;
      this._viewboxScaleY = 1;
      return;
    }

    const mb = child.measuredBounds;
    const m = child.margin;
    const childW = mb.width;
    const childH = mb.height;
    const availW = Math.max(0, width - m.left - m.right);
    const availH = Math.max(0, height - m.top - m.bottom);

    let scaleX = 1;
    let scaleY = 1;

    if (childW > 0 && childH > 0 && (availW > 0 || availH > 0)) {
      const stretch = this._viewboxStretch;
      if (stretch === StretchFill) {
        scaleX = availW / childW;
        scaleY = availH / childH;
      } else if (stretch === StretchUniformToFill) {
        const scale = Math.max(availW / childW, availH / childH);
        scaleX = scale;
        scaleY = scale;
      } else if (stretch === StretchUniform) {
        const scale = Math.min(availW / childW, availH / childH);
        scaleX = scale;
        scaleY = scale;
      }
    }

    this._viewboxScaleX = scaleX;
    this._viewboxScaleY = scaleY;

    const scaledW = childW * scaleX;
    const scaledH = childH * scaleY;
    const offsetX = (width - scaledW) / 2;
    const offsetY = (height - scaledH) / 2;

    child._arrange(new Rect(innerX + offsetX, innerY + offsetY, childW, childH));
  }

  // ============ PanelGraduated measure/arrange ============
  // 官方 PanelLayoutGraduated（go.js 534824）：
  // measure → ns[0] = 主元素矩形(-margin) → determineGraduatedMarks 生成逐元素 mark →
  // measureGraduatedTicks/Labels 算每个刻度/标签的包围盒并 union 进面板包围盒；
  // arrange → 子元素 actualBounds = ns 矩形 − union(tr) 原点（不按面板 bounds 拉伸、不加 padding）。

  private _measureGraduated(availW: number, availH: number): void {
    const rects: Rect[] = [];
    this._gradRects = rects;
    this._gradMarks = null;
    this._gradTempTexts = [];
    const main = this.findMainElement();
    if (!(main instanceof Shape)) return;

    const m = main.margin;
    main._measure(availW, availH);
    const mb = main.measuredBounds;
    const mainRect = new Rect(
      -m.left, -m.top,
      Math.max(mb.width + m.left + m.right, 0),
      Math.max(mb.height + m.top + m.bottom, 0)
    );
    rects.push(mainRect);
    this._unionRect.setTo(mainRect.x, mainRect.y, mainRect.width, mainRect.height);

    const marks: GradMark[][] = this._determineGraduatedMarks(main);

    const els = this._elements;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      const mk = marks[i];
      if (!el.visible || el === main || mk === undefined || mk.length === 0) continue;
      if (el instanceof Shape) this._measureGraduatedTicks(el, mk);
      else if (el instanceof TextBlock) this._gradTempTexts[i] = this._measureGraduatedLabels(el, mk);
    }
  }

  /** 官方 determineGraduatedMarks(t,e)：沿主 Shape 路径为每个元素生成 mark 列表 */
  private _determineGraduatedMarks(main: Shape): GradMark[][] {
    const els = this._elements;
    const out: GradMark[][] = [];
    this._gradMarks = out;
    const geo = main.geometry;
    if (geo === null) {
      for (let i = 0; i < els.length; i++) out.push([]);
      return out;
    }
    const segs = geo.flattenedSegments;
    const lens = geo.flattenedLengths;
    const total = geo.flattenedTotalLength;
    // 逐段角度数组（度，0..360）：每 figure 跳过首点
    const angleArrays: number[][] = [];
    for (let f = 0; f < segs.length; f++) {
      const pts = segs[f];
      const arr: number[] = [];
      let ax = 0, ay = 0;
      for (let s = 0; s < pts.length; s += 2) {
        const px = pts[s], py = pts[s + 1];
        if (s === 0) { ax = px; ay = py; continue; }
        let ang = (Math.atan2(py - ay, px - ax) * 180) / Math.PI;
        if (ang < 0) ang += 360;
        arr.push(ang);
        ax = px;
        ay = py;
      }
      angleArrays.push(arr);
    }
    const larger = this._graduatedLargerIntervals();
    const sw = main.strokeWidth;
    const gb = geo.bounds;
    const mainScale = main.scale;
    const tickUnit = this._graduatedTickUnit;
    const gmin = this._graduatedMin;
    const gmax = this._graduatedMax;
    const range = this.graduatedRange;
    const base0 = this._graduatedTickBase;

    for (let ei = 0; ei < els.length; ei++) {
      const el = els[ei];
      const y: GradMark[] = [];
      out.push(y);
      if (!el.visible || el === main) continue;
      if (lens.length === 0 || lens[0].length === 0) continue;
      const interval = Math.abs(el.interval);
      if ((tickUnit * interval * total) / range < 2 && el.graduatedSkip === null) continue;
      // 段游标在**单个元素内**持久推进（mark 的弧长单调递增）
      let S = lens[0][0], T = 0, N = 0;
      const gLo = total * el.graduatedStart - 1e-4;
      const gHi = total * el.graduatedEnd + 1e-4;
      const step = tickUnit * interval;
      let C = base0;
      if (C < gmin) {
        let F = (gmin - C) / step;
        F = F % 1 === 0 ? F : Math.floor(F + 1);
        C += F * step;
      } else if (C > gmin + step) {
        const F = Math.floor((C - gmin) / step);
        C -= F * step;
      }
      const A0 = C;
      const eps = gmax * 1e-6;
      const largerEi = larger[ei];
      const skipFn = el.graduatedSkip;
      for (let F = 1; C <= gmax + eps; F++) {
        if (this._gradUnitExcluded(C - base0, largerEi)) {
          C = A0 + F * step;
          continue;
        }
        if (C > gmax) C = gmax;
        const skipOk =
          skipFn === null ||
          (((el instanceof TextBlock) || (el instanceof Shape)) && !skipFn(C, el));
        if (skipOk) {
          let m = ((C - gmin) * total) / range;
          if (m > total) m = total;
          if (m >= gLo && m <= gHi && m === m) {
            let v = angleArrays[T][N], R = lens[T][N];
            for (; T < lens.length; ) {
              while (m > S && N < lens[T].length - 1) {
                N++;
                v = angleArrays[T][N];
                R = lens[T][N];
                S += R;
              }
              if (m <= S) break;
              T++;
              N = 0;
              if (T >= lens.length) break;
              v = angleArrays[T][N];
              R = lens[T][N];
              S += R;
            }
            if (T < lens.length && R > 0) {
              const O = segs[T];
              const z = O[N * 2], X = O[N * 2 + 1], E = O[N * 2 + 2], Y = O[N * 2 + 3];
              const V = (m - (S - R)) / R;
              let Hx = z + (E - z) * V + sw / 2 - gb.x;
              let Hy = X + (Y - X) * V + sw / 2 - gb.y;
              if (mainScale !== 1) {
                Hx *= mainScale;
                Hy *= mainScale;
              }
              const ang = this._gradDE(v, V, O, angleArrays[T], N);
              if (isFinite(Hx) && isFinite(Hy)) {
                if (el instanceof TextBlock) {
                  let q = '';
                  const fn = el.graduatedFunction;
                  if (fn !== null) {
                    const r = fn(C, el);
                    q = r !== null && r !== undefined ? String(r) : '';
                  } else {
                    q = (+C.toFixed(2)).toString();
                  }
                  if (q !== '') y.push({ pt: new Point(Hx, Hy), angle: ang, text: q });
                } else {
                  y.push({ pt: new Point(Hx, Hy), angle: ang });
                }
              }
            }
          }
        }
        C = A0 + F * step;
      }
    }
    return out;
  }

  /** 官方 fE(t)：每个元素「同构造器、interval 更大」的其它元素 interval 列表 */
  private _graduatedLargerIntervals(): number[][] {
    const els = this._elements;
    const res: number[][] = [];
    for (let n = 0; n < els.length; n++) {
      const r: number[] = [];
      res.push(r);
      const o = els[n];
      if (!o.visible) continue;
      const l = o.interval;
      if (!(l < 0)) {
        for (let a = 0; a < els.length; a++) {
          if (a === n) continue;
          const h = els[a];
          if (!h.visible || o.constructor !== h.constructor) continue;
          const c = h.interval;
          if (c > l) r.push(c);
        }
      }
    }
    return res;
  }

  /** 官方 uE(t,e,i)：与更大 interval 刻度重合则跳过本 mark */
  private _gradUnitExcluded(val: number, larger: number[]): boolean {
    const unit = this._graduatedTickUnit;
    for (let i = 0; i < larger.length; i++) {
      const oo = larger[i] * unit;
      const r = val % oo;
      const eps = unit * 1e-6;
      if (r < eps && r > -eps) return true;
    }
    return false;
  }

  /**
   * 官方 dE(t,e,i,s,n)：段接缝处的角度平滑（V 接近 0.5/0/1 时与邻段角度混合，
   * 闭合图形首尾互借）。
   */
  private _gradDE(angle: number, V: number, figPts: number[], figAngles: number[], segIdx: number): number {
    if (V < 0.5005 && V > 0.4995) return angle;
    const closed =
      figPts[0] === figPts[figPts.length - 2] && figPts[1] === figPts[figPts.length - 1];
    let o = angle;
    if (V < 0.5) {
      if (segIdx > 0) o = figAngles[segIdx - 1];
      else if (closed) o = figAngles[figAngles.length - 1];
    } else if (V > 0.5) {
      if (segIdx + 1 < figAngles.length) o = figAngles[segIdx + 1];
      else if (closed) o = figAngles[0];
    }
    if (angle !== o) {
      let t = angle;
      let r = Math.abs(t - o);
      if (r > 180) {
        if (t < o) t += 360;
        else o += 360;
        r = Math.abs(t - o);
      }
      if (V < 5e-4 || V > 0.9995) return ((t + o) / 2) % 360;
      if (r < 10) {
        const l = 1 - Math.abs(0.5 - V);
        return (t * l + o * (1 - l)) % 360;
      }
    }
    return angle;
  }

  /** 官方 measureGraduatedTicks：每个 mark 旋转 4 角点求包围盒，push ns + union 面板 */
  private _measureGraduatedTicks(el: Shape, marks: GradMark[]): void {
    let focus = el.alignmentFocus;
    if (focus.isNoSpot()) focus = Spot.TopCenter;
    const savedAngle = el.angle;
    el.angle = 0;
    el._measure(Infinity, Infinity);
    el.angle = savedAngle;
    const mb = el.measuredBounds;
    const w = mb.width, h = mb.height;
    const spot = new Point().setRectSpot(new Rect(0, 0, w, h), focus);
    const fx = -spot.x, fy = -spot.y;
    const d = new Rect();
    const rot = savedAngle; // el.angle（已恢复）
    for (let g = 0; g < marks.length; g++) {
      const mk = marks[g];
      const px = mk.pt.x, py = mk.pt.y, a = mk.angle + rot;
      for (let k = 0; k < 4; k++) {
        let cx = fx, cy = fy;
        if (k === 1) cx = fx + w;
        else if (k === 2) cy = fy + h;
        else if (k === 3) { cx = fx + w; cy = fy + h; }
        const p = new Point(cx, cy);
        p.rotate(a);
        p.offset(px, py);
        if (g === 0 && k === 0) d.setTo(p.x, p.y, 0, 0);
        else d.unionPoint(p);
      }
    }
    if (this._gradRects !== null) this._gradRects.push(d);
    this._unionInto(d.x, d.y, d.width, d.height);
  }

  /** 官方 measureGraduatedLabels：逐 mark 测量文本并算 actualBounds L；返回本元素的临时 TextBlock */
  private _measureGraduatedLabels(el: TextBlock, marks: GradMark[]): TextBlock {
    const temp = el.copy();
    this._gradTempText = temp;
    let focus = el.alignmentFocus;
    if (focus.isNoSpot()) focus = Spot.TopCenter;
    const code = Panel._orientCode(el.segmentOrientation);
    const segOffset = el.segmentOffset;
    const a = new Rect();
    for (let g = 0; g < marks.length; g++) {
      const mk = marks[g];
      let hx = mk.pt.x, hy = mk.pt.y;
      const f = mk.angle;
      let d = el.angle;
      let u = el.angle;
      if (code !== 0) {
        if (code === 21 || code === 25) d = f + el.angle;
        else d = f;
        u = Panel._computeOrientAngle(code, d);
      }
      temp.angle = u;
      temp.text = mk.text || '';
      temp._measure(Infinity, Infinity);
      const y = temp.measuredBounds;
      const x = temp.naturalBounds;
      const b = x.width, k = x.height;
      // P = translate(-y.origin) ∘ scale ∘ rotate(d+special, 中心)（点序：旋转→缩放→平移）
      const T = new Point();
      T.setRectSpot(new Rect(0, 0, b, k), focus);
      let special = 0;
      if (code === 22 || code === 26) special = 90;
      else if (code === 23 || code === 27) special = -90;
      else if (code === 28 && ((f > 45 && f < 135) || (f > 225 && f < 315))) special = -f;
      Panel._rotateAbout(T, d + special, b / 2, k / 2);
      if (temp.scale !== 1) {
        T.x *= temp.scale;
        T.y *= temp.scale;
      }
      T.x -= y.x;
      T.y -= y.y;
      const N = -T.x, M = -T.y;
      const C = segOffset.copy();
      if (isNaN(C.x)) C.x = b / 2 + 3;
      if (isNaN(C.y)) C.y = -(k / 2 + 3);
      C.rotate(f);
      hx += C.x + N;
      hy += C.y + M;
      const L = new Rect(hx, hy, y.width, y.height);
      const A = new Rect(y.x, y.y, y.width, y.height);
      const D = new Rect(x.x, x.y, x.width, x.height);
      mk.labelAngle = u;
      mk.lines = temp.getMetrics();
      mk.lineCount = (mk.lines as Array<number | number[] | string[] | string | null>)[3] as number;
      mk.actualBounds = L;
      mk.measuredBounds = A;
      mk.naturalBounds = D;
      if (g === 0) a.setTo(L.x, L.y, L.width, L.height);
      else a.unionRect(L);
    }
    if (this._gradRects !== null) this._gradRects.push(a);
    this._unionInto(a.x, a.y, a.width, a.height);
    return temp;
  }

  private _arrangeGraduated(): void {
    const rects = this._gradRects;
    const marks = this._gradMarks;
    if (rects === null || marks === null) return;
    const union = this._unionRect;
    const ux = union.x, uy = union.y;
    const main = this.findMainElement();
    let r = 0;
    if (main !== null && r < rects.length) {
      const l = rects[r];
      r++;
      main._arrange(new Rect(l.x - ux, l.y - uy, l.width, l.height));
    }
    const els = this._elements;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      const mk = marks[i];
      if (!el.visible || el === main || mk === undefined || mk.length === 0) continue;
      if (r >= rects.length) break;
      const l = rects[r];
      r++;
      el._arrange(new Rect(l.x - ux, l.y - uy, l.width, l.height));
    }
    this._gradRects = null;
  }

  /** 官方 segmentOrientation → 数值分支码（21..28） */
  private static _orientCode(o: unknown): number {
    if (typeof o === 'number') return o;
    if (o === OrientationAlong) return 21;
    if (o === OrientationPlus90) return 22;
    if (o === OrientationMinus90) return 23;
    if (o === OrientationOpposite) return 24;
    if (o === OrientationUpright) return 25;
    if (o === OrientationPlus90Upright) return 26;
    if (o === OrientationMinus90Upright) return 27;
    if (o === OrientationUpright45) return 28;
    return 0;
  }

  /** 官方 Link.computeAngle(orientation, angle)（按分支码） */
  private static _computeOrientAngle(code: number, angle: number): number {
    const norm = (v: number): number => {
      let r = v % 360;
      if (r < 0) r += 360;
      return r;
    };
    let e = 0;
    switch (code) {
      case 21: e = angle; break;
      case 22: e = angle + 90; break;
      case 23: e = angle - 90; break;
      case 24: e = angle + 180; break;
      case 25:
        e = norm(angle);
        if (e > 90 && e < 270) e -= 180;
        break;
      case 26:
        e = norm(angle + 90);
        if (e > 90 && e < 270) e -= 180;
        break;
      case 27:
        e = norm(angle - 90);
        if (e > 90 && e < 270) e -= 180;
        break;
      case 28: {
        e = norm(angle);
        if ((e > 45 && e < 135) || (e > 225 && e < 315)) return 0;
        if (e > 90 && e < 270) e -= 180;
        break;
      }
      default: e = 0;
    }
    return norm(e);
  }

  /** 把点绕 (cx,cy) 旋转 deg 度 */
  private static _rotateAbout(p: Point, deg: number, cx: number, cy: number): void {
    if (deg === 0) return;
    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rx = p.x - cx, ry = p.y - cy;
    p.x = cx + rx * cos - ry * sin;
    p.y = cy + rx * sin + ry * cos;
  }

  // ============ PanelLink measure/arrange ============

  /** 取 link 里「画线」的主图元：优先 isPanelMain，否则第一个同时有 fill/stroke 的 Shape */
  private _findLinkMainElement(): any {
    let fallback: any = null;
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      if (elem.isPanelMain) return elem;
      if (!fallback && 'fill' in elem && 'stroke' in elem) fallback = elem;
    }
    return fallback;
  }

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
  private _measureLink(_availW: number, _availH: number): void {
    const panel: any = this;
    const host: any =
      typeof panel.updateRoute === 'function'
        ? panel
        : panel.adornedPart !== undefined ? panel.adornedPart : null;
    // 官方：t 不是 Link/Adornment、或取不到 Link 时直接 return（union 保持 (0,0,0,0)）
    if (host === null || host === undefined || typeof host.routeBounds !== 'object') return;

    const els = this._elements; // 官方 s = this.E.h（**全部**元素，含不可见）
    if (els.length === 0) return; // 官方 l===0 分支

    const isAdorn = host !== panel;
    const pathEl: Shape | null = isAdorn ? null : (panel.path as Shape | null);

    try { host.updateRoute(); } catch { /* 无端口/未入图时按空路线处理 */ }
    // 官方 h.CN()/a.CN()：重建 link 几何并同步给各主 Shape
    try {
      if (typeof host._syncGeometryToMainShapes === 'function') host._syncGeometryToMainShapes();
    } catch { /* ignore */ }
    if (isAdorn) {
      const geo = (host as any).geometry;
      if (geo) {
        for (const e of this._elements) {
          if ((e as any).isPanelMain && e instanceof Shape) {
            (e as any)._geometry = geo;
            (e as any)._invalidateGeometryCache();
          }
        }
      }
    }

    const u: Rect = host.routeBounds;
    const d = new Rect(0, 0, u.width, u.height);
    this._linkOrRect = d;
    const qf: Rect[] = [];
    this._linkQfRects = qf;

    const p = u.width;
    const y = u.height;
    if (pathEl !== null) {
      this._measureLinkPath(pathEl, host, p, y);
      const P = pathEl.measuredBounds;
      d.unionRect(P);
      qf.push(P.copy());
    }

    const g: number = host.pointsCount;
    const pts: List<Point> = host.points;
    const mid = new Point();
    for (const A of els) {
      if (A === pathEl) continue;
      if ((A as any).isPanelMain && A instanceof Shape) {
        this._measureLinkPath(A, host, p, y);
        const P = A.measuredBounds;
        d.unionRect(P);
        qf.push(P.copy());
        continue;
      }
      if (g < 2) {
        A._measure(Infinity, Infinity, 0, 0);
        const P = A.measuredBounds;
        d.unionRect(P);
        qf.push(P.copy());
        continue;
      }

      const M = A.segmentIndex;
      const C = A.segmentFraction;
      let T = A.alignmentFocus;
      if (T === null || T === undefined || T.isNoSpot()) T = Spot.Center;
      const code: number =
        typeof host.constructor.orientationCode === 'function'
          ? host.constructor.orientationCode(A.segmentOrientation)
          : typeof A.segmentOrientation === 'number' ? A.segmentOrientation : 0;
      const D = A.segmentOffset;
      let F = 0;
      let R = 0;
      let O = 0;
      if (isNaN(M)) {
        // 官方：几何上的分数点（几何原点即 route-local，故不再减 u）
        const q = host.geometry.getPointAndAngleAlongPath(C);
        O = q[2];
        F = q[0];
        R = q[1];
      } else if (M < -g || M >= g) {
        // 默认 segmentIndex = -Infinity 落这里：路线中点（doc → 减 u 转 route-local）
        host.computeMidPoint(mid);
        O = host.midAngle;
        F = mid.x - u.x;
        R = mid.y - u.y;
      } else {
        let q: Point;
        let Q: Point;
        let J = 0;
        if (M >= 0) {
          q = pts.elt(M);
          Q = M < g - 1 ? pts.elt(M + 1) : q;
        } else {
          J = g + M;
          q = pts.elt(J);
          Q = J > 0 ? pts.elt(J - 1) : q;
        }
        if (q.equalsApprox(Q)) {
          let tt: Point;
          let V: Point;
          if (M >= 0) {
            tt = M > 0 ? pts.elt(M - 1) : q;
            V = M < g - 2 ? pts.elt(M + 2) : Q;
          } else {
            tt = J < g - 1 ? pts.elt(J + 1) : q;
            V = J > 1 ? pts.elt(J - 2) : Q;
          }
          const E = tt.distanceSquaredPoint(q);
          const W = Q.distanceSquaredPoint(V);
          if (E > W + 10) O = M >= 0 ? tt.directionPoint(q) : q.directionPoint(tt);
          else if (W > E + 10) O = M >= 0 ? Q.directionPoint(V) : V.directionPoint(Q);
          else O = M >= 0 ? tt.directionPoint(V) : V.directionPoint(tt);
        } else {
          O = M >= 0 ? q.directionPoint(Q) : Q.directionPoint(q);
        }
        F = q.x + (Q.x - q.x) * C - u.x;
        R = q.y + (Q.y - q.y) * C - u.y;
      }

      if (code !== 0) {
        // 官方 A.jt = I（直写 angle 字段；须在 yt 之前，po 要用新 angle）
        (A as any)._angle = host.computeAngle(0, A.segmentOrientation as any, O);
      }
      A._measure(Infinity, Infinity, 0, 0);

      const N = A.measuredBounds;
      const X = A.naturalBounds;
      let Y = 0;
      if (A instanceof Shape) Y = (A as Shape).strokeWidth;
      const B = X.width + Y;
      const K = X.height + Y;

      // 官方 b：绕 (B/2,K/2) 旋转 (L===0 ? A.angle : O) + 各 Orientation 修正角
      const mainAng = code === 0 ? A.angle : O;
      let extra = 0;
      if (code === 22 || code === 26) extra = 90;
      else if (code === 23 || code === 27) extra = -90;
      else if (code === 28 && ((O > 45 && O < 135) || (O > 225 && O < 315))) extra = -O;

      const S0 = new Point();
      S0.setRectSpot(new Rect(0, 0, B, K), T);
      const S = Panel._linkXf(S0.x, S0.y, B / 2, K / 2, mainAng + extra, A.scale, -N.x, -N.y);
      const H = -S.x + (Y / 2) * A.scale;
      const v = -S.y + (Y / 2) * A.scale;

      // segmentOffset（官方默认 (0,0) → rotate 无效；NaN 分支按官方转录）
      const k = new Point(D.x, D.y);
      const jx = isNaN(D.x);
      const jy = isNaN(D.y);
      if (jx || jy) {
        const yS: number = (host.constructor as any)._yS !== undefined ? (host.constructor as any)._yS : 3;
        const q2 = B / 2 + yS;
        const Q2 = K / 2 + yS;
        const Jd = O >= 45 && O <= 135;
        const td = O >= 225 && O <= 315;
        const fracCond = M >= 0 || (isNaN(M) && C < 0.5);
        if (code === 0 && (Jd || td)) {
          k.x = jy ? q2 : D.y;
          k.y = jx ? Q2 : D.x;
          if (Jd) {
            if (!fracCond && jx) k.y = -Q2;
          } else {
            if (fracCond && jx) k.y = -Q2;
            if (jy) k.x = -q2;
          }
        } else {
          if (jx) k.x = fracCond ? q2 : -q2;
          if (jy) k.y = -Q2;
          k.rotate(O);
        }
      } else {
        k.rotate(O);
      }

      F += k.x;
      R += k.y;
      const z = new Rect(F + H, R + v, N.width, N.height);
      qf.push(z);
      d.unionRect(z);
    }

    // 官方 labelNodes：只测量，不并入 union
    try {
      const it = host.labelNodes;
      if (it) {
        while (it.next()) {
          const nd: any = it.value;
          if (nd && typeof nd._measure === 'function') nd._measure(Infinity, Infinity);
        }
      }
    } catch { /* ignore */ }

    // 官方收尾：t.or=d；t.position = u.origin + d.origin；union 只取尺寸（x,y 保持 0）
    const pos = panel.position;
    if (pos) {
      pos.x = u.x + d.x;
      pos.y = u.y + d.y;
    }
    this._unionRect.setTo(0, 0, d.width || 0, d.height || 0);
  }

  /** 官方 `PanelLayoutLink.measureLinkPath(t, w, h, s)`：po(measuredBounds) + p3(naturalBounds) */
  private _measureLinkPath(shape: any, host: any, routeW: number, routeH: number): void {
    const sc: number = shape.scale !== undefined && shape.scale !== null ? shape.scale : 1;
    const n: number = (shape.strokeWidth || 0) * sc;
    const geo = host && host.geometry ? host.geometry : null;
    if (geo) {
      const o = geo.bounds;
      this._linkPo(shape, o.x - n / 2, o.y - n / 2, o.width + n, o.height + n);
    } else {
      this._linkPo(shape, -n / 2, -n / 2, routeW + n, routeH + n);
    }
    // 官方尾部 s.p3()：naturalBounds = (desiredSize 实值 ? desiredSize : geometry.bounds)
    const ds = shape._desiredSize;
    const sgeo = shape._geometry;
    if (ds && !ds.isReal() && sgeo) {
      shape._naturalBounds = sgeo.bounds.copy();
    } else {
      shape._naturalBounds = new Rect(0, 0, ds ? ds.width : 0, ds ? ds.height : 0);
    }
  }

  /** 官方 `GraphObject.po(x,y,w,h)`：设 measuredBounds；scale/angle 非恒等时取变换后的轴对齐包围盒 */
  private _linkPo(shape: any, x: number, y: number, w: number, h: number): void {
    const sc: number = shape.scale;
    const ang: number = shape.angle;
    if (sc === 1 && (isNaN(ang) || ang === 0)) {
      shape._measuredBounds = new Rect(x, y, w, h);
      return;
    }
    const cx = x + w / 2;
    const cy = y + h / 2;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const corners: number[][] = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]];
    for (const c of corners) {
      const p = Panel._linkXf(c[0], c[1], cx, cy, ang, sc, 0, 0);
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    shape._measuredBounds = new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  /**
   * 官方 Transform 链（所有 op 都是后乘，点按调用逆序受作用）：
   * `Zs(-N.x,-N.y)` → `lt(sc)` → `Ns(a1,cx,cy)` → `Ns(a2,cx,cy)`
   * 即点先绕 (cx,cy) 旋转（两个同中心旋转可合成 a1+a2），再按 sc 缩放（绕原点），最后平移。
   */
  private static _linkXf(x: number, y: number, cx: number, cy: number, ang: number, sc: number, dx: number, dy: number): Point {
    let a = ang;
    if (a >= 360) a -= 360;
    else if (a < 0) a += 360;
    let cos = 1;
    let sin = 0;
    if (a === 90) { cos = 0; sin = 1; }
    else if (a === 180) { cos = -1; sin = 0; }
    else if (a === 270) { cos = 0; sin = -1; }
    else if (a !== 0) {
      const r = (a * Math.PI) / 180;
      cos = Math.cos(r);
      sin = Math.sin(r);
    }
    const px = x - cx;
    const py = y - cy;
    const rx = px * cos - py * sin + cx;
    const ry = px * sin + py * cos + cy;
    return new Point(rx * sc + dx, ry * sc + dy);
  }

  /**
   * 官方 `PanelLayoutLink.arrange(t, i, e)`：按 measure 存下的 `qf` 顺序，
   * child.actualBounds = z − or.origin（不再重算锚点/角度）；
   * 收尾把 `t.location` 同步为 position + WD 偏移。
   */
  private _arrangeLink(_bounds: Rect): void {
    const panel: any = this;
    const qf = this._linkQfRects;
    const or = this._linkOrRect;
    const host: any =
      typeof panel.updateRoute === 'function'
        ? panel
        : panel.adornedPart !== undefined ? panel.adornedPart : null;
    const pathEl: Shape | null =
      host !== null && host !== undefined && host === panel ? (panel.path as Shape | null) : null;

    if (qf !== null && or !== null && qf.length !== 0) {
      let idx = 0;
      if (pathEl !== null && idx < qf.length) {
        const r = qf[idx++];
        pathEl._arrange(new Rect(r.x - or.x, r.y - or.y, r.width, r.height));
      }
      for (const m of this._elements) {
        if (m === pathEl) continue;
        if (idx >= qf.length) break;
        const r = qf[idx++];
        m._arrange(new Rect(r.x - or.x, r.y - or.y, r.width, r.height));
      }
    } else {
      for (const m of this._elements) {
        const mb = m.measuredBounds;
        m._arrange(new Rect(0, 0, mb.width, mb.height));
      }
    }

    // 官方：t.location.e(t.position.x + WD.x, t.position.y + WD.y)
    const pos = panel.position;
    if (pos && !isNaN(pos.x) && !isNaN(pos.y) && typeof panel._locationOffset === 'function') {
      const off = panel._locationOffset();
      const loc = panel._location;
      if (loc) {
        loc.x = pos.x + off.x;
        loc.y = pos.y + off.y;
      }
    }
  }

  private _getPointAtDistance(pts: Point[], segLengths: number[], distance: number): Point {
    let accumulated = 0;
    for (let i = 0; i < segLengths.length; i++) {
      if (accumulated + segLengths[i] >= distance) {
        const remaining = distance - accumulated;
        const fraction = segLengths[i] > 0 ? remaining / segLengths[i] : 0;
        return Point.lerp(pts[i], pts[i + 1], fraction);
      }
      accumulated += segLengths[i];
    }
    return pts[pts.length - 1].copy();
  }

  private _getAngleAtDistance(pts: Point[], segLengths: number[], distance: number): number {
    let accumulated = 0;
    for (let i = 0; i < segLengths.length; i++) {
      if (accumulated + segLengths[i] >= distance) {
        return pts[i].directionPoint(pts[i + 1]);
      }
      accumulated += segLengths[i];
    }
    if (pts.length >= 2) {
      return pts[pts.length - 2].directionPoint(pts[pts.length - 1]);
    }
    return 0;
  }

  // ============ Internal helpers ============

  // ---- 官方拾取实现（Panel.xL / bL / m0 / SL）----
  // 供 Layer.findObjectAt / findObjectsAt / findObjectsIn / findObjectsNear 使用。
  // 偏差：官方靠内部 Transform 矩阵在「本对象局部坐标」与「所在 Panel 坐标」之间换算，
  // 本项目没有 Transform，统一按**文档坐标**（与 GraphObject.containsPoint / getDocumentBounds 同约定）。

  /** 官方 `Panel.xL(p, navig, pred)`：找点选命中的最上层对象。 */
  _findObjectAtDoc(p: Point): GraphObject | null {
    if (!this.pickable || !this.visible) return null;
    const b = this.getDocumentBounds();
    if (!b.isReal()) return null;
    // 官方 extraTouchArea 默认 10（面向触控放宽），命中区外扩 5
    if (!Rect.contains(b.x - 5, b.y - 5, b.width + 10, b.height + 10, p.x, p.y)) return null;
    const els = this._elements;
    for (let i = els.length - 1; i >= 0; i--) {
      const child = els[i];
      if (!child.visible) continue;
      const hit = child instanceof Panel
        ? child._findObjectAtDoc(p)
        : (child.pickable && child.containsPoint(p) ? child : null);
      if (hit !== null) return hit;
    }
    if (this.background !== null && Rect.contains(b.x, b.y, b.width, b.height, p.x, p.y)) return this;
    return null;
  }

  /** 官方 `Panel.bL(p, navig, pred, coll)`：收集点选命中的全部对象。 */
  _collectObjectsAtDoc(p: Point, add: (o: GraphObject) => void): void {
    if (!this.pickable) return;
    const b = this.getDocumentBounds();
    if (!b.isReal() || !Rect.contains(b.x, b.y, b.width, b.height, p.x, p.y)) return;
    const els = this._elements;
    for (let i = els.length - 1; i >= 0; i--) {
      const child = els[i];
      if (!child.visible) continue;
      if (child instanceof Panel) child._collectObjectsAtDoc(p, add);
      else if (child.pickable && child.containsPoint(p)) add(child);
    }
    if (this.background !== null) add(this);
  }

  /** 官方 `Panel.m0(r, navig, pred, partialInclusion, coll)`：收集与矩形包含/相交的对象。 */
  _collectObjectsInDoc(r: Rect, add: (o: GraphObject) => void, partial: boolean): void {
    if (!this.pickable) return;
    const b = this.getDocumentBounds();
    if (!b.isReal()) return;
    const inside = r.containsRect(b);
    const overlaps = r.intersectsRect(b);
    if (!inside && !overlaps) return;
    const els = this._elements;
    for (let i = els.length - 1; i >= 0; i--) {
      const child = els[i];
      if (!child.visible) continue;
      if (child instanceof Panel) child._collectObjectsInDoc(r, add, partial);
      else if (child.pickable && (partial ? child.intersectsRect(r) : child.containsRect(r))) add(child);
    }
    if (inside) add(this);
    else if (this.background !== null && partial) add(this);
  }

  /** 官方 `Panel.SL(pt1, pt2, navig, pred, partialInclusion, coll)`：收集距离圆命中的对象。 */
  _collectObjectsNearDoc(p: Point, dist: number, add: (o: GraphObject) => void, partial: boolean): void {
    if (!this.pickable) return;
    const b = this.getDocumentBounds();
    if (!b.isReal()) return;
    const rel = Panel._circleRectRelation(b, p, dist);
    if (rel === 0) return;
    const els = this._elements;
    for (let i = els.length - 1; i >= 0; i--) {
      const child = els[i];
      if (!child.visible) continue;
      if (child instanceof Panel) child._collectObjectsNearDoc(p, dist, add, partial);
      else {
        const cr = Panel._circleRectRelation(child.getDocumentBounds(), p, dist);
        if (cr === 0) continue;
        if (partial ? cr >= 1 : cr === 2) add(child);
      }
    }
    if (rel === 2) add(this);
    else if (this.background !== null && partial) add(this);
  }

  /**
   * 圆 (p, dist) 与轴对齐矩形 r 的关系：
   * 0 = 无交集，1 = 相交（但未包含），2 = 圆完全包含矩形。
   * 对应官方 `SL` 里的 `f`（相交）/ `u`（包含）判定。
   */
  private static _circleRectRelation(r: Rect, p: Point, dist: number): 0 | 1 | 2 {
    const d2 = dist * dist;
    const dx = Math.max(r.x - p.x, 0, p.x - r.right);
    const dy = Math.max(r.y - p.y, 0, p.y - r.bottom);
    if (dx * dx + dy * dy > d2) return 0;
    const c1 = (r.x - p.x) * (r.x - p.x) + (r.y - p.y) * (r.y - p.y);
    const c2 = (r.right - p.x) * (r.right - p.x) + (r.y - p.y) * (r.y - p.y);
    const c3 = (r.right - p.x) * (r.right - p.x) + (r.bottom - p.y) * (r.bottom - p.y);
    const c4 = (r.x - p.x) * (r.x - p.x) + (r.bottom - p.y) * (r.bottom - p.y);
    if (c1 <= d2 && c2 <= d2 && c3 <= d2 && c4 <= d2) return 2;
    return 1;
  }

  /** 官方：alignment → defaultAlignment，仍默认则 Center */
  private _resolveAlignment(elem: GraphObject): Spot {
    let a = elem.alignment;
    if (a.isDefault()) a = this._defaultAlignment;
    if (a.isDefault() || isNaN(a.x) || isNaN(a.y)) return Spot.Center;
    return a;
  }

  /** 官方：alignmentFocus 默认 → 回退为该元素的 alignment（focus 落在 alignment 同一边） */
  private _resolveAlignmentFocus(elem: GraphObject): Spot {
    const af = elem.alignmentFocus;
    if (af.isDefault()) return this._resolveAlignment(elem);
    return af;
  }

  private _focusNameTarget(el: GraphObject, I: Spot): Point | null {
    if (!(el instanceof Panel)) return null;
    const nm = el.alignmentFocusName;
    if (nm === '') return null;
    const target = el.findObject(nm);
    if (target === null || target === el) return null;
    const S = target.actualBounds;
    const p = new Point(S.x + I.x * S.width - I.offsetX, S.y + I.y * S.height - I.offsetY);
    if (!isFinite(p.x) || !isFinite(p.y)) return null;
    for (let q = target.panel; q !== null && q !== el; q = q.panel) {
      p.x += q.actualBounds.x;
      p.y += q.actualBounds.y;
    }
    return p;
  }

  /**
   * 官方 PanelLayoutVertical/Horizontal.arrange 里算元素宽度用的是
   *   `g = Math.max(union.width - 元素左右 margin - 面板右 padding, 0)`
   * 那个 `Math.max(…, 0)` 不能省：内容区比元素的 margin 还窄时 available 会是负数，
   * 直接喂给 `new Rect()` 会抛 `Invalid arguments to Rect constructor`
   * （实测 spreadsheet `4, 4, -8, 12`、regrouping `0, 0, -18.52, 81.05`）。
   */
private _resolveStretchWidth(elem: GraphObject, available: number, measured: number): number {
    const stretch = elem.stretch !== StretchDefault ? elem.stretch : this._defaultStretch;
    if (stretch === StretchFill || stretch === StretchHorizontal) return Math.max(available, 0);
    if (stretch === StretchUniform) {
      if (measured <= 0) return measured;
      const scale = Math.min(available / measured, this._resolveUniformScale(elem, available, measured));
      return measured * scale;
    }
    return measured;
  }

  private _resolveStretchHeight(elem: GraphObject, available: number, measured: number): number {
    const stretch = elem.stretch !== StretchDefault ? elem.stretch : this._defaultStretch;
    if (stretch === StretchFill || stretch === StretchVertical) return Math.max(available, 0);
    if (stretch === StretchUniform) {
      if (measured <= 0) return measured;
      const scale = Math.min(available / measured, this._resolveUniformScale(elem, available, measured));
      return measured * scale;
    }
    return measured;
  }

  /** Compute the uniform scale factor for an element */
  private _resolveUniformScale(elem: GraphObject, availW: number, availH: number): number {
    const mb = elem.measuredBounds;
    if (mb.width <= 0 || mb.height <= 0) return 1;
    return Math.min(availW / mb.width, availH / mb.height);
  }

  private _ensureColumnDefinition(index: number): void {
    while (this._columnDefinitions.length <= index) {
      const def = new RowColumnDefinition();
      def.column = this._columnDefinitions.length;
      def._setPanel(this);
      this._columnDefinitions.push(def);
    }
  }

  private _ensureRowDefinition(index: number): void {
    while (this._rowDefinitions.length <= index) {
      const def = new RowColumnDefinition();
      def.row = this._rowDefinitions.length;
      def._setPanel(this);
      this._rowDefinitions.push(def);
    }
  }

  private _findItemTemplate(data: any): Panel | null {
    if (!data) return this._itemTemplate;
    let category: string | undefined;
    if (typeof this._itemCategoryProperty === 'function') {
      category = this._itemCategoryProperty(data);
    } else if (typeof this._itemCategoryProperty === 'string') {
      category = data[this._itemCategoryProperty];
    }
    if (category && this._itemTemplateMap.has(category)) {
      return this._itemTemplateMap.get(category)!;
    }
    return this._itemTemplate;
  }

  _handleObjectPropertyChanged(obj: GraphObject, propname: string, value?: any): void {
    const panel = this._panel;
    if (panel && typeof (panel as any)._handleObjectPropertyChanged === 'function') {
      (panel as any)._handleObjectPropertyChanged(obj, propname, value);
    }
    const part = this._part;
    if (part && (part as any).isTopLevel) {
      const diagram = (part as any)._diagram;
      if (diagram && typeof (diagram as any)._handlePartPropertyChanged === 'function') {
        (diagram as any)._handlePartPropertyChanged(part, obj, propname, value);
      }
    }
  }

  // ============ Static constants ============

  static Auto = PanelAuto;
  static Vertical = PanelVertical;
  static Horizontal = PanelHorizontal;
  static Spot = PanelSpot;
  static Table = PanelTable;
  static Position = PanelPosition;
  static Grid = PanelGrid;
  static Viewbox = PanelViewbox;
  static Graduated = PanelGraduated;
  static Link = PanelLink;
  static TableColumn = PanelTableColumn;
  static TableRow = PanelTableRow;

  /** 官方 PanelLayout 的注册表（官方是 `PanelLayout.In` / `PanelLayout.is`） */
  private static _panelLayouts: Record<string, Function> = {};

  /** 官方 `Panel.definePanelLayout(name, func)` */
  static definePanelLayout(name: string, func: Function): void {
    Panel._panelLayouts[name] = func;
  }

  /** 官方 `Panel.isLayoutDefined(name)` */
  static isLayoutDefined(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(Panel._panelLayouts, name);
  }
}

GraphObject.defineBuilder('Panel', Panel);
