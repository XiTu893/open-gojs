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
  protected _type: EnumValue = PanelAuto;
  private _data: any = null;
  private _padding: Margin = Margin.Zero.copy();
  private _defaultAlignment: Spot = Spot.Default.copy();
  private _defaultStretch: EnumValue = StretchDefault;
  private _defaultColumnSeparatorStroke: BrushLike = '';
  private _defaultColumnSeparatorStrokeWidth: number = 1;
  private _defaultRowSeparatorStroke: BrushLike = '';
  private _defaultRowSeparatorStrokeWidth: number = 1;
  private _defaultSeparatorPadding: Margin = Margin.Zero.copy();
  private _columnSizing: EnumValue = SizingNone;
  private _rowSizing: EnumValue = SizingNone;
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

  constructor(type?: EnumValue, init?: Partial<Panel>) {
    super();
    this._className = 'Panel';
    if (type !== undefined) {
      this._type = type;
    }
    if (init) {
      this.set(init);
    }
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

  add(element: GraphObject): Panel {
    if (!(element instanceof GraphObject)) {
      throw new Error('Panel.add: argument must be a GraphObject');
    }
    (element as any)._panel = this;
    this._elements.push(element);
    this._invalidateMeasure();
    // Propagate _part to child elements
    this._propagatePart(element);
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

  findMainElement(): GraphObject | null {
    for (const elem of this._elements) {
      if (elem.isPanelMain) return elem;
    }
    return null;
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
    // Elements that were generated from itemArray have _itemIndex >= 0
    for (let i = this._elements.length - 1; i >= 0; i--) {
      const elem = this._elements[i];
      if (elem instanceof Panel && (elem as Panel)._itemIndex >= 0) {
        (elem as any)._panel = null;
        this._elements.splice(i, 1);
      }
    }
    // Rebuild from itemArray
    const arr = this._itemArray;
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      const itemData = arr[i];
      const template = this._findItemTemplate(itemData);
      if (template) {
        const copy = template.copy() as Panel;
        copy._data = itemData;
        copy._itemIndex = i;
        copy.updateTargetBindings();
        (copy as any)._panel = this;
        this._elements.push(copy);
      }
    }
    this._invalidateMeasure();
  }

  updateTargetBindings(propname?: string): void {
    for (const elem of this._elements) {
      if (elem instanceof Panel) {
        (elem as Panel).updateTargetBindings(propname);
      }
      const bindings: Binding[] = (elem as any)._bindings;
      if (bindings && bindings.length > 0) {
        const data = this._data;
        if (data) {
          for (const binding of bindings) {
            if (propname === undefined || propname === binding.sourceProperty) {
              const val = binding.getValueFromSource(data, elem, null);
              (elem as any)[binding.targetProperty] = val;
            }
          }
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

  _measure(widthConstraint: number, heightConstraint: number): void {
    const pad = this._padding;
    const availW = Math.max(0, widthConstraint - pad.left - pad.right);
    const availH = Math.max(0, heightConstraint - pad.top - pad.bottom);

    let measuredW = 0;
    let measuredH = 0;

    if (this._type === PanelAuto) {
      this._measureAuto(availW, availH);
      return;
    } else if (this._type === PanelVertical) {
      this._measureVertical(availW, availH);
      return;
    } else if (this._type === PanelHorizontal) {
      this._measureHorizontal(availW, availH);
      return;
    } else if (this._type === PanelSpot) {
      this._measureSpot(availW, availH);
      return;
    } else if (this._type === PanelTable) {
      this._measureTable(availW, availH);
      return;
    } else if (this._type === PanelPosition) {
      this._measurePosition(availW, availH);
      return;
    } else if (this._type === PanelLink) {
      this._measureLink(widthConstraint, heightConstraint);
      return;
    } else if (this._type === PanelViewbox) {
      this._measureViewbox(availW, availH);
      return;
    } else if (this._type === PanelGraduated) {
      this._measureGraduated(availW, availH);
      return;
    } else if (this._type === PanelGrid) {
      this._measuredBounds = new Rect(0, 0, 0, 0);
      return;
    }

    // Default fallback: measure all elements
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      elem._measure(availW, availH);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      measuredW = Math.max(measuredW, mb.width + m.left + m.right);
      measuredH = Math.max(measuredH, mb.height + m.top + m.bottom);
    }

    this._measuredBounds = new Rect(0, 0,
      Math.min(measuredW + pad.left + pad.right, widthConstraint),
      Math.min(measuredH + pad.top + pad.bottom, heightConstraint)
    );
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
    let main: GraphObject | null = null;
    const others: GraphObject[] = [];
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      if (main === null || elem.isPanelMain) {
        if (main !== null && !main.isPanelMain) others.push(main);
        main = elem;
      } else {
        others.push(elem);
      }
    }
    return { main, others };
  }

  private _measureAuto(availW: number, availH: number): void {
    const pad = this._padding;
    const { main, others } = this._findMainAndOthers();

    // Step 1: Measure all non-main elements first (they determine the content size)
    let contentW = 0;
    let contentH = 0;
    for (const elem of others) {
      elem._measure(availW, availH);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      contentW = Math.max(contentW, mb.width + m.left + m.right);
      contentH = Math.max(contentH, mb.height + m.top + m.bottom);
    }

    // Step 2: Measure the main element, sized to fit around the content
    if (main !== null) {
      const m = main.margin;
      const mainAvailW = Math.min(availW, contentW + m.left + m.right);
      const mainAvailH = Math.min(availH, contentH + m.top + m.bottom);
      main._measure(mainAvailW, mainAvailH);

      // The main element should be at least as large as the content area
      const mb = main.measuredBounds;
      const mainW = Math.max(mb.width + m.left + m.right, contentW + m.left + m.right);
      const mainH = Math.max(mb.height + m.top + m.bottom, contentH + m.top + m.bottom);

      this._measuredBounds = new Rect(0, 0,
        mainW + pad.left + pad.right,
        mainH + pad.top + pad.bottom
      );
    } else if (others.length > 0) {
      this._measuredBounds = new Rect(0, 0,
        contentW + pad.left + pad.right,
        contentH + pad.top + pad.bottom
      );
    } else {
      this._measuredBounds = new Rect(0, 0, pad.left + pad.right, pad.top + pad.bottom);
    }
  }

  private _arrangeAuto(innerX: number, innerY: number, innerW: number, innerH: number): void {
    const { main, others } = this._findMainAndOthers();

    if (main !== null) {
      // Arrange the main element to fill the entire panel area
      const m = main.margin;
      main._arrange(new Rect(
        innerX + m.left,
        innerY + m.top,
        innerW - m.left - m.right,
        innerH - m.top - m.bottom
      ));
    }

    // Position other elements by alignment within the panel area (default: centered)
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

  // ============ PanelVertical measure/arrange ============

  private _measureVertical(availW: number, availH: number): void {
    const pad = this._padding;
    let totalH = 0;
    let maxW = 0;

    for (const elem of this._elements) {
      if (!elem.visible) continue;
      elem._measure(availW, availH - totalH);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      totalH += mb.height + m.top + m.bottom;
      maxW = Math.max(maxW, mb.width + m.left + m.right);
    }

    this._measuredBounds = new Rect(0, 0,
      maxW + pad.left + pad.right,
      totalH + pad.top + pad.bottom
    );
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

    this._measuredBounds = new Rect(0, 0,
      totalW + pad.left + pad.right,
      maxH + pad.top + pad.bottom
    );
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

  private _measureSpot(availW: number, availH: number): void {
    const pad = this._padding;
    const { main, others } = this._findMainAndOthers();

    let measuredW = 0;
    let measuredH = 0;

    if (main !== null) {
      main._measure(availW, availH);
      const mb = main.measuredBounds;
      const m = main.margin;
      measuredW = mb.width + m.left + m.right;
      measuredH = mb.height + m.top + m.bottom;
    }

    for (const elem of others) {
      elem._measure(availW, availH);
    }

    this._measuredBounds = new Rect(0, 0,
      measuredW + pad.left + pad.right,
      measuredH + pad.top + pad.bottom
    );
  }

  private _arrangeSpot(innerX: number, innerY: number, innerW: number, innerH: number): void {
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

  // ============ PanelTable measure/arrange (simplified) ============

  private _measureTable(availW: number, availH: number): void {
    const pad = this._padding;
    // Determine column widths and row heights
    const colWidths = this._computeColumnWidths(availW);
    const rowHeights = this._computeRowHeights(availH);

    // Measure each element with its cell constraints
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const col = elem.column;
      const row = elem.row;
      const colSpan = elem.columnSpan;
      const rowSpan = elem.rowSpan;

      let cellW = 0;
      for (let c = col; c < col + colSpan && c < colWidths.length; c++) {
        cellW += colWidths[c];
      }
      let cellH = 0;
      for (let r = row; r < row + rowSpan && r < rowHeights.length; r++) {
        cellH += rowHeights[r];
      }

      elem._measure(cellW, cellH);
    }

    let totalW = 0;
    for (const w of colWidths) totalW += w;
    let totalH = 0;
    for (const h of rowHeights) totalH += h;

    this._measuredBounds = new Rect(0, 0,
      totalW + pad.left + pad.right,
      totalH + pad.top + pad.bottom
    );
  }

  private _arrangeTable(innerX: number, innerY: number, innerW: number, innerH: number): void {
    const colWidths = this._computeColumnWidths(innerW);
    const rowHeights = this._computeRowHeights(innerH);

    (this as any)._lastColWidths = colWidths;
    (this as any)._lastRowHeights = rowHeights;

    // Compute column x positions
    const colX: number[] = [];
    let cx = innerX;
    for (const w of colWidths) {
      colX.push(cx);
      cx += w;
    }

    // Compute row y positions
    const rowY: number[] = [];
    let ry = innerY;
    for (const h of rowHeights) {
      rowY.push(ry);
      ry += h;
    }

    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const col = elem.column;
      const row = elem.row;
      const colSpan = elem.columnSpan;
      const rowSpan = elem.rowSpan;

      let cellX = col < colX.length ? colX[col] : innerX;
      let cellY = row < rowY.length ? rowY[row] : innerY;
      let cellW = 0;
      for (let c = col; c < col + colSpan && c < colWidths.length; c++) {
        cellW += colWidths[c];
      }
      let cellH = 0;
      for (let r = row; r < row + rowSpan && r < rowHeights.length; r++) {
        cellH += rowHeights[r];
      }

      const m = elem.margin;
      const mb = elem.measuredBounds;
      const alignment = this._resolveAlignment(elem);
      const focus = this._resolveAlignmentFocus(elem);

      const availW = cellW - m.left - m.right;
      const availH = cellH - m.top - m.bottom;
      const elemW = this._resolveStretchWidth(elem, availW, mb.width);
      const elemH = this._resolveStretchHeight(elem, availH, mb.height);

      const pos = alignment.positionInRect(new Rect(cellX + m.left, cellY + m.top, availW, availH));
      const focusPos = focus.positionInRect(new Rect(0, 0, elemW, elemH));

      elem._arrange(new Rect(
        pos.x - focusPos.x,
        pos.y - focusPos.y,
        elemW,
        elemH
      ));
    }
  }

  // ============ PanelPosition measure/arrange ============

  private _measurePosition(availW: number, availH: number): void {
    const pad = this._padding;
    let maxW = 0;
    let maxH = 0;

    for (const elem of this._elements) {
      if (!elem.visible) continue;
      elem._measure(availW, availH);
      const mb = elem.measuredBounds;
      const m = elem.margin;
      // Position panels use the element's position (x, y) for placement
      // The measured size is the union of all positioned elements
      const posX = isNaN(elem.position.x) ? 0 : elem.position.x;
      const posY = isNaN(elem.position.y) ? 0 : elem.position.y;
      const elemRight = posX + mb.width + m.left + m.right;
      const elemBottom = posY + mb.height + m.top + m.bottom;
      maxW = Math.max(maxW, elemRight);
      maxH = Math.max(maxH, elemBottom);
    }

    this._measuredBounds = new Rect(0, 0,
      maxW + pad.left + pad.right,
      maxH + pad.top + pad.bottom
    );
  }

  private _arrangePosition(innerX: number, innerY: number, innerW: number, innerH: number): void {
    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const mb = elem.measuredBounds;
      const m = elem.margin;
      const posX = isNaN(elem.position.x) ? 0 : elem.position.x;
      const posY = isNaN(elem.position.y) ? 0 : elem.position.y;
      elem._arrange(new Rect(
        innerX + posX + m.left,
        innerY + posY + m.top,
        mb.width,
        mb.height
      ));
    }
  }

  // ============ PanelViewbox measure/arrange ============

  private _measureViewbox(availW: number, availH: number): void {
    const pad = this._padding;
    const child = this._elements.find(e => e.visible) || null;

    if (child) {
      child._measure(Infinity, Infinity);
      const mb = child.measuredBounds;
      const m = child.margin;
      const w = Math.min(availW, mb.width + m.left + m.right);
      const h = Math.min(availH, mb.height + m.top + m.bottom);
      this._measuredBounds = new Rect(0, 0, w + pad.left + pad.right, h + pad.top + pad.bottom);
    } else {
      this._measuredBounds = new Rect(0, 0, pad.left + pad.right, pad.top + pad.bottom);
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
    const pad = this._padding;
    const { main, others } = this._findMainAndOthers();

    let measuredW = 0;
    let measuredH = 0;

    if (main !== null) {
      main._measure(availW, availH);
      const mb = main.measuredBounds;
      const m = main.margin;
      measuredW = mb.width + m.left + m.right;
      measuredH = mb.height + m.top + m.bottom;
    }

    for (const elem of others) {
      elem._measure(availW, availH);
    }

    this._measuredBounds = new Rect(0, 0,
      measuredW + pad.left + pad.right,
      measuredH + pad.top + pad.bottom
    );
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

  private _measureLink(widthConstraint: number, heightConstraint: number): void {
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
      this._measuredBounds = new Rect(0, 0, maxX - minX, maxY - minY);
    } else {
      this._measuredBounds = new Rect(0, 0, 1, 1);
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

  private _resolveAlignment(elem: GraphObject): Spot {
    const a = elem.alignment;
    if (!a.isDefault) return a;
    // Auto and Spot panels default to centering non-main elements
    if (this._type === PanelAuto || this._type === PanelSpot) {
      return new Spot(0.5, 0.5);
    }
    return this._defaultAlignment;
  }

  private _resolveAlignmentFocus(elem: GraphObject): Spot {
    const af = elem.alignmentFocus;
    if (!af.isDefault) return af;
    if (this._alignmentFocusName) {
      const named = this.findObject(this._alignmentFocusName);
      if (named) return named.alignmentFocus;
    }
    // Auto and Spot panels default to centering the element's focus
    if (this._type === PanelAuto || this._type === PanelSpot) {
      return new Spot(0.5, 0.5);
    }
    return Spot.Default.copy();
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
      this._columnDefinitions.push(new RowColumnDefinition());
    }
  }

  private _ensureRowDefinition(index: number): void {
    while (this._rowDefinitions.length <= index) {
      this._rowDefinitions.push(new RowColumnDefinition());
    }
  }

  private _computeColumnWidths(availW: number): number[] {
    const colCount = Math.max(this.columnCount, this._columnDefinitions.length);
    if (colCount === 0) return [];

    const widths: number[] = new Array(colCount).fill(0);
    const defined: boolean[] = new Array(colCount).fill(false);

    for (let i = 0; i < colCount; i++) {
      const def = i < this._columnDefinitions.length ? this._columnDefinitions[i] : null;
      if (def && !isNaN(def.width) && def.width > 0) {
        widths[i] = def.width;
        defined[i] = true;
      }
    }

    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const col = elem.column;
      const colSpan = elem.columnSpan;
      if (colSpan > 1) continue;

      if (!defined[col]) {
        elem._measure(Infinity, Infinity);
        const mb = elem.measuredBounds;
        const m = elem.margin;
        const needed = mb.width + m.left + m.right;
        if (needed > widths[col]) {
          widths[col] = needed;
        }
      }
    }

    for (let i = 0; i < colCount; i++) {
      const def = i < this._columnDefinitions.length ? this._columnDefinitions[i] : null;
      if (def) {
        widths[i] = Math.max(def.minimum, Math.min(def.maximum, widths[i]));
      }
    }

    let totalDefined = 0;
    let undefinedCount = 0;
    for (let i = 0; i < colCount; i++) {
      if (defined[i]) {
        totalDefined += widths[i];
      } else {
        undefinedCount++;
      }
    }

    const remaining = Math.max(0, availW - totalDefined);
    if (undefinedCount > 0 && remaining > 0) {
      let autoCount = 0;
      let propTotal = 0;
      for (let i = 0; i < colCount; i++) {
        if (defined[i]) continue;
        const def = i < this._columnDefinitions.length ? this._columnDefinitions[i] : null;
        if (def && def.sizing === SizingProp) {
          propTotal += (widths[i] > 0 ? widths[i] : 1);
        } else {
          autoCount++;
        }
      }

      const autoRemaining = Math.max(0, remaining - propTotal);
      for (let i = 0; i < colCount; i++) {
        if (defined[i]) continue;
        const def = i < this._columnDefinitions.length ? this._columnDefinitions[i] : null;
        if (def && def.sizing === SizingProp) {
          const ratio = propTotal > 0 ? (widths[i] > 0 ? widths[i] : 1) / propTotal : 1 / colCount;
          widths[i] = remaining * ratio;
        } else if (def && def.sizing === SizingAuto) {
          // keep the auto-calculated width
        } else if (autoCount > 0) {
          widths[i] = Math.max(widths[i], autoRemaining / autoCount);
        }
      }
    }

    return widths;
  }

  private _computeRowHeights(availH: number): number[] {
    const rowCount = Math.max(this.rowCount, this._rowDefinitions.length);
    if (rowCount === 0) return [];

    const heights: number[] = new Array(rowCount).fill(0);
    const defined: boolean[] = new Array(rowCount).fill(false);

    for (let i = 0; i < rowCount; i++) {
      const def = i < this._rowDefinitions.length ? this._rowDefinitions[i] : null;
      if (def && !isNaN(def.height) && def.height > 0) {
        heights[i] = def.height;
        defined[i] = true;
      }
    }

    for (const elem of this._elements) {
      if (!elem.visible) continue;
      const row = elem.row;
      const rowSpan = elem.rowSpan;
      if (rowSpan > 1) continue;

      if (!defined[row]) {
        elem._measure(Infinity, Infinity);
        const mb = elem.measuredBounds;
        const m = elem.margin;
        const needed = mb.height + m.top + m.bottom;
        if (needed > heights[row]) {
          heights[row] = needed;
        }
      }
    }

    for (let i = 0; i < rowCount; i++) {
      const def = i < this._rowDefinitions.length ? this._rowDefinitions[i] : null;
      if (def) {
        heights[i] = Math.max(def.minimum, Math.min(def.maximum, heights[i]));
      }
    }

    let totalDefined = 0;
    let undefinedCount = 0;
    for (let i = 0; i < rowCount; i++) {
      if (defined[i]) {
        totalDefined += heights[i];
      } else {
        undefinedCount++;
      }
    }

    const remaining = Math.max(0, availH - totalDefined);
    if (undefinedCount > 0 && remaining > 0) {
      let autoCount = 0;
      let propTotal = 0;
      for (let i = 0; i < rowCount; i++) {
        if (defined[i]) continue;
        const def = i < this._rowDefinitions.length ? this._rowDefinitions[i] : null;
        if (def && def.sizing === SizingProp) {
          propTotal += (heights[i] > 0 ? heights[i] : 1);
        } else {
          autoCount++;
        }
      }

      const autoRemaining = Math.max(0, remaining - propTotal);
      for (let i = 0; i < rowCount; i++) {
        if (defined[i]) continue;
        const def = i < this._rowDefinitions.length ? this._rowDefinitions[i] : null;
        if (def && def.sizing === SizingProp) {
          const ratio = propTotal > 0 ? (heights[i] > 0 ? heights[i] : 1) / propTotal : 1 / rowCount;
          heights[i] = remaining * ratio;
        } else if (def && def.sizing === SizingAuto) {
          // keep the auto-calculated height
        } else if (autoCount > 0) {
          heights[i] = Math.max(heights[i], autoRemaining / autoCount);
        }
      }
    }

    return heights;
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
