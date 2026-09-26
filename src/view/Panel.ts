import { EnumValue } from '../core/EnumValues';
import {
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable,
  PanelPosition, PanelGrid, PanelViewbox, PanelGraduated, PanelLink,
  PanelTableColumn, PanelTableRow,
  StretchDefault, StretchFill, StretchNone, StretchUniform, StretchUniformToFill,
  StretchHorizontal, StretchVertical,
  SizingNone, SizingAuto, SizingProp,
  SegmentOrientationNone, SegmentOrientationAlong, SegmentOrientationOpposite,
  SegmentOrientationParallel, SegmentOrientationPerpendicular, SegmentOrientationOrthogonal
} from '../core/EnumValues';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin, MarginLike } from '../core/Margin';
import { List } from '../core/List';
import { Map } from '../core/Map';
import { Iterator } from '../core/Iterable';
import { BrushLike } from '../core/Brush';
import { Binding } from '../model/Binding';
import { GraphObject } from './GraphObject';
import { Shape } from './Shape';
import { RowColumnDefinition } from './RowColumnDefinition';

/**
 * Panel - container that arranges child GraphObjects according to its type.
 */
export class Panel extends GraphObject {

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
  private _defaultColumnSeparatorStroke: BrushLike = null;
  private _defaultColumnSeparatorStrokeWidth: number = 1;
  private _defaultRowSeparatorStroke: BrushLike = null;
  private _defaultRowSeparatorStrokeWidth: number = 1;
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
  private _graduatedMin: number = 0;
  private _graduatedMax: number = 100;
  private _graduatedTickUnit: number = 1;
  private _graduatedTickBase: number = 0;
  private _graduatedStart: number = 0;
  private _graduatedEnd: number = 1;
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

  get graduatedStart(): number { return this._graduatedStart; }
  set graduatedStart(val: number) {
    if (this._graduatedStart === val) return;
    this._graduatedStart = val;
  }

  get graduatedEnd(): number { return this._graduatedEnd; }
  set graduatedEnd(val: number) {
    if (this._graduatedEnd === val) return;
    this._graduatedEnd = val;
  }

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

  addColumnDefinition(index?: number, width?: number): RowColumnDefinition {
    const idx = index !== undefined ? index : this._columnDefinitions.length;
    this._ensureColumnDefinition(idx);
    const def = this._columnDefinitions[idx];
    if (width !== undefined) {
      def.width = width;
    }
    this._invalidateMeasure();
    return def;
  }

  getRowDefinition(index: number): RowColumnDefinition {
    this._ensureRowDefinition(index);
    return this._rowDefinitions[index];
  }

  addRowDefinition(index?: number, height?: number): RowColumnDefinition {
    const idx = index !== undefined ? index : this._rowDefinitions.length;
    this._ensureRowDefinition(idx);
    const def = this._rowDefinitions[idx];
    if (height !== undefined) {
      def.height = height;
    }
    this._invalidateMeasure();
    return def;
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
        if (data) {
          for (const binding of bindings) {
            if (propname === undefined || propname === binding.sourceProperty) {
              const val = binding.getValueFromSource(data, elem, null);
              (elem as any)[binding.targetProperty] = val;
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
    copy._defaultRowSeparatorStroke = this._defaultRowSeparatorStroke;
    copy._defaultRowSeparatorStrokeWidth = this._defaultRowSeparatorStrokeWidth;
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
    copy._graduatedStart = this._graduatedStart;
    copy._graduatedEnd = this._graduatedEnd;
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
    union.set(0, 0, 0, 0);

    if (this._type === PanelAuto) {
      this._measureAuto(availW, availH);
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
      // union 保持 (0,0,0,0)
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
      union.set(0, 0, maxW, maxH);
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
    union.set(union.x, union.y, c, fh);
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
    u.set(nx, ny, nr - nx, nb - ny);
  }

  _arrange(bounds: Rect): void {
    this._actualBounds = bounds.copy();

    if (this._type === PanelLink) {
      this._arrangeLink(bounds);
      return;
    }

    const pad = this._padding;
    // Children are arranged relative to this panel's origin (0,0)
    const innerX = pad.left;
    const innerY = pad.top;
    const innerW = Math.max(0, bounds.width - pad.left - pad.right);
    const innerH = Math.max(0, bounds.height - pad.top - pad.bottom);

    if (this._type === PanelAuto) {
      this._arrangeAuto(innerX, innerY, innerW, innerH);
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
    } else if (this._type === PanelViewbox) {
      this._arrangeViewbox(innerX, innerY, innerW, innerH);
    } else if (this._type === PanelGraduated) {
      this._arrangeGraduated(innerX, innerY, innerW, innerH);
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
    if (main instanceof Shape) stroke = (main as Shape).strokeWidth * main.scale;
    let y = Math.max(mb.width + u, 0);
    let x = Math.max(mb.height + d, 0);
    const s1 = this._panelSpot1(main);
    const s2 = this._panelSpot2(main);
    let holeW = availW;
    let holeH = availH;
    if (isFinite(availW)) holeW = Math.max(Math.abs(s1.x * y + s1.offsetX - (s2.x * y + s2.offsetX)) - stroke, 0);
    if (isFinite(availH)) holeH = Math.max(Math.abs(s1.y * x + s1.offsetY - (s2.y * x + s2.offsetY)) - stroke, 0);
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
      union.set(0, 0, Math.max(mb.width + u, 0), Math.max(mb.height + d, 0));
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
    union.set(0, 0, Math.max(mb.width + u, 0), Math.max(mb.height + d, 0));
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
    // 官方 PanelLayoutVertical.measure 两阶段：先 measure {None, Vertical} stretch 子元素
    // 得到内容宽 maxW；然后 Fill/Horizontal stretch 子元素按内容宽 measure（不扩展面板）。
    const fillElems: GraphObject[] = [];

    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const st = elem._getStretch(false);
      if (st === StretchFill || st === StretchHorizontal) {
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

    this._unionRect.set(0, 0, maxW, totalH);
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
    const pad = this._padding;
    let totalW = 0;
    let maxH = 0;

    for (const elem of this._elements) {
      if (!elem.visible) continue;
      elem._measure(availW - totalW, availH);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      totalW += mb.width + m.left + m.right;
      maxH = Math.max(maxH, mb.height + m.top + m.bottom);
    }

    this._unionRect.set(0, 0, totalW, maxH);
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
      if (A.isDefault) A = this._defaultAlignment;
      if (A.isDefault || isNaN(A.x) || isNaN(A.y)) A = Spot.Center;
      let I = el.alignmentFocus;
      if (I.isDefault) I = Spot.Center;
      const X = -D + A.x * kw + A.offsetX - (I.x * mb.width + I.offsetX);
      const Y = -F + A.y * kh + A.offsetY - (I.y * mb.height + I.offsetY);
      if (!hasOther) {
        hasOther = true;
        union.set(X, Y, y, x);
      } else {
        this._unionInto(X, Y, y, x);
      }
    }
    if (!hasOther) union.set(sBoxX, sBoxY, sBoxW, sBoxH);
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
      if (A.isDefault) A = this._defaultAlignment;
      if (A.isDefault || isNaN(A.x) || isNaN(A.y)) A = Spot.Center;
      let I = el.alignmentFocus;
      if (I.isDefault) I = Spot.Center;
      const X = A.x * kw + A.offsetX - (I.x * mb.width + I.offsetX) - em.left;
      const Y = A.y * kh + A.offsetY - (I.y * mb.height + I.offsetY) - em.top;
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
      if (A.isDefault) A = this._defaultAlignment;
      if (A.isDefault || isNaN(A.x) || isNaN(A.y)) A = Spot.Center;
      let I = el.alignmentFocus;
      if (I.isDefault) I = Spot.Center;
      let f = A.x * dw + A.offsetX - (I.x * eMb.width + I.offsetX);
      let uu = A.y * dh + A.offsetY - (I.y * eMb.height + I.offsetY);
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
    this._unionRect.set(0, 0, offX, offY);
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
          if (q.isDefault) {
            let dq = this._defaultAlignment;
            if (dq.isDefault || isNaN(dq.x) || isNaN(dq.y)) dq = Spot.Center;
            Q = dq.x; Jv = dq.y; tt = dq.offsetX; Vv = dq.offsetY;
            const colAl = T.alignment;
            const rowAl = M.alignment;
            if (!colAl.isDefault && !isNaN(colAl.x) && !isNaN(colAl.y)) {
              Q = colAl.x;
              tt = colAl.offsetX;
            }
            if (!rowAl.isDefault && !isNaN(rowAl.x) && !isNaN(rowAl.y)) {
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
        innerX + px - this._originX + m.left,
        innerY + py - this._originY + m.top,
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
      this._unionRect.set(0, 0, w, h);
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

  private _measureGraduated(availW: number, availH: number): void {
    const { main, others } = this._findMainAndOthers();

    if (main !== null && main.visible) {
      main._measure(availW, availH);
      const mb = main.measuredBounds;
      const m = main.margin;
      this._unionRect.set(0, 0, Math.max(mb.width + m.left + m.right, 0), Math.max(mb.height + m.top + m.bottom, 0));
    }

    for (const elem of others) {
      if (!elem.visible) continue;
      elem._measure(availW, availH);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      this._unionInto(0, 0, Math.max(mb.width + m.left + m.right, 0), Math.max(mb.height + m.top + m.bottom, 0));
    }
  }

  private _arrangeGraduated(innerX: number, innerY: number, innerW: number, innerH: number): void {
    const { main, others } = this._findMainAndOthers();

    if (main !== null) {
      const m = main.margin;
      main._arrange(new Rect(
        innerX + m.left,
        innerY + m.top,
        innerW - m.left - m.right,
        innerH - m.top - m.bottom
      ));
    }

    for (const elem of others) {
      const mb = elem.measuredBounds;
      const alignment = this._resolveAlignment(elem);
      const pos = alignment.positionInRect(new Rect(innerX, innerY, innerW, innerH));
      const focus = this._resolveAlignmentFocus(elem);
      const focusPos = focus.positionInRect(new Rect(0, 0, mb.width, mb.height));
      elem._arrange(new Rect(
        pos.x - focusPos.x,
        pos.y - focusPos.y,
        mb.width,
        mb.height
      ));
    }
  }

  // ============ PanelLink measure/arrange ============

  private _measureLink(availW: number, availH: number): void {
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      elem._measure(Infinity, Infinity);
    }

    const link = this as any;
    const points: List<Point> | undefined = link.points;

    if (points && points.count >= 2) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      const it = points.iterator;
      while (it.next()) {
        const p = it.value;
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
      this._unionRect.set(0, 0, maxX - minX, maxY - minY);
    } else {
      this._unionRect.set(0, 0, 1, 1);
    }
  }

  private _arrangeLink(bounds: Rect): void {
    const link = this as any;
    const points: List<Point> | undefined = link.points;

    if (!points || points.count < 2) {
      for (const elem of this._elements) {
        if (!elem.visible) continue;
        const mb = elem.measuredBounds;
        elem._arrange(new Rect(0, 0, mb.width, mb.height));
      }
      return;
    }

    const pts = points.toArray();

    let minX = Infinity;
    let minY = Infinity;
    for (const p of pts) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
    }

    const segLengths: number[] = [];
    let totalLength = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const len = pts[i].distanceTo(pts[i + 1]);
      segLengths.push(len);
      totalLength += len;
    }

    let mainElement: GraphObject | null = null;
    let foundPanelMain = false;
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      if (elem.isPanelMain) {
        mainElement = elem;
        foundPanelMain = true;
        break;
      }
    }
    if (!foundPanelMain) {
      for (const elem of this._elements) {
        if (!elem.visible) continue;
        if ('fill' in elem && 'stroke' in elem) {
          mainElement = elem;
          break;
        }
      }
    }

    for (const elem of this._elements) {
      if (!elem.visible) continue;

      if (elem === mainElement) {
        elem._arrange(new Rect(0, 0, bounds.width, bounds.height));
        continue;
      }

      const mb = elem.measuredBounds;
      const segIndex = elem.segmentIndex;
      const segFraction = elem.segmentFraction;
      const segOffset = elem.segmentOffset;
      const segOrientation = elem.segmentOrientation;

      let basePos: Point;
      let segAngle: number;

      if (isNaN(segIndex)) {
        if (totalLength > 0) {
          const targetDist = segFraction * totalLength;
          basePos = this._getPointAtDistance(pts, segLengths, targetDist);
          segAngle = this._getAngleAtDistance(pts, segLengths, targetDist);
        } else {
          basePos = pts[0].copy();
          segAngle = 0;
        }
      } else {
        const idx = segIndex < 0 ? pts.length - 1 + segIndex : segIndex;
        const clampedIdx = Math.max(0, Math.min(idx, pts.length - 2));
        const startPt = pts[clampedIdx];
        const endPt = pts[clampedIdx + 1];
        basePos = Point.lerp(startPt, endPt, segFraction);
        segAngle = startPt.directionTo(endPt);
      }

      basePos = new Point(basePos.x - minX, basePos.y - minY);

      const offsetX = isNaN(segOffset.x) ? 0 : segOffset.x;
      const offsetY = isNaN(segOffset.y) ? 0 : segOffset.y;
      basePos = new Point(basePos.x + offsetX, basePos.y + offsetY);

      let rotationAngle = 0;
      if (segOrientation === SegmentOrientationAlong || segOrientation === SegmentOrientationParallel) {
        rotationAngle = segAngle * 180 / Math.PI;
      } else if (segOrientation === SegmentOrientationOpposite) {
        rotationAngle = segAngle * 180 / Math.PI + 180;
      } else if (segOrientation === SegmentOrientationPerpendicular) {
        rotationAngle = segAngle * 180 / Math.PI + 90;
      } else if (segOrientation === SegmentOrientationOrthogonal) {
        rotationAngle = Math.round(segAngle * 180 / Math.PI / 90) * 90;
      }

      elem._arrange(new Rect(
        basePos.x - mb.width / 2,
        basePos.y - mb.height / 2,
        mb.width,
        mb.height
      ));

      if (rotationAngle !== 0) {
        elem.angle = rotationAngle;
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
        return pts[i].directionTo(pts[i + 1]);
      }
      accumulated += segLengths[i];
    }
    if (pts.length >= 2) {
      return pts[pts.length - 2].directionTo(pts[pts.length - 1]);
    }
    return 0;
  }

  // ============ Internal helpers ============

  /** 官方：alignment → defaultAlignment，仍默认则 Center */
  private _resolveAlignment(elem: GraphObject): Spot {
    let a = elem.alignment;
    if (a.isDefault) a = this._defaultAlignment;
    if (a.isDefault || isNaN(a.x) || isNaN(a.y)) return Spot.Center;
    return a;
  }

  /** 官方：alignmentFocus 默认 → 回退为该元素的 alignment（focus 落在 alignment 同一边） */
  private _resolveAlignmentFocus(elem: GraphObject): Spot {
    const af = elem.alignmentFocus;
    if (af.isDefault) return this._resolveAlignment(elem);
    return af;
  }

  private _resolveStretchWidth(elem: GraphObject, available: number, measured: number): number {
    const stretch = elem.stretch !== StretchDefault ? elem.stretch : this._defaultStretch;
    if (stretch === StretchFill || stretch === StretchHorizontal) return available;
    if (stretch === StretchUniform) {
      if (measured <= 0) return measured;
      const scale = Math.min(available / measured, this._resolveUniformScale(elem, available, measured));
      return measured * scale;
    }
    return measured;
  }

  private _resolveStretchHeight(elem: GraphObject, available: number, measured: number): number {
    const stretch = elem.stretch !== StretchDefault ? elem.stretch : this._defaultStretch;
    if (stretch === StretchFill || stretch === StretchVertical) return available;
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
}

GraphObject.defineBuilder('Panel', Panel);
