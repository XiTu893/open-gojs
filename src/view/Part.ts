import { Panel } from './Panel';
import { GraphObject } from './GraphObject';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Map } from '../core/Map';
import { List } from '../core/List';
import { Iterator } from '../core/Iterable';
import { Shape } from './Shape';
import { PanelAuto, StretchFill, StretchDefault, EnumValue } from '../core/EnumValues';

/**
 * Part - base class for top-level visual elements (Node, Link, Adornment).
 * Extends Panel with location, selection, shadow, and adornment support.
 */
export class Part extends Panel {

  // ============ Private property storage ============
  protected _diagram: any = null;
  protected _location: Point = new Point(NaN, NaN);
  protected _locationSpot: Spot = Spot.TopLeft.copy();
  protected _locationObjectName: string = '';
  protected _movable: boolean = true;
  protected _copyable: boolean = true;
  protected _deletable: boolean = true;
  protected _selectable: boolean = true;
  protected _isSelected: boolean = false;
  protected _isHighlighted: boolean = false;
  protected _isLayoutPositioned: boolean = true;
  private _isInDocumentBounds: boolean = true;
  protected _isShadowed: boolean = false;
  protected _shadowOffset: Point = new Point(5, 5);
  private _shadowColor: string = 'rgba(0,0,0,0.3)';
  private _shadowBlur: number = 5;
  private _layerName: string = '';
  private _zOrder: number = 0;
  private _canStart: boolean = true;
  private _dragComputation: ((part: Part, newLoc: Point, snappedLoc: Point) => Point) | null = null;
  protected _selectionAdorned: boolean = true;
  private _selectionAdornmentTemplate: any = null;
  private _adornments: Map<string, any> = new Map<string, any>();
  private _category: string = '';
  protected _itemIndex: number = -1;
  protected _containingGroup: any = null;

  constructor(type?: any, init?: any) {
    const [t, i] = Panel._resolveArgs(type, init);
    super(t, undefined);
    this._className = 'Part';
    if (i) {
      this.set(i);
    }
  }

  /** 官方 Part.g()：部件级失效向 Diagram 冒泡（图片加载/文本变更 → 重排） */
  _invalidateMeasure(): void {
    super._invalidateMeasure();
    const d = this._diagram;
    if (d) {
      d._layoutInvalid = true;
      if (typeof d.requestUpdate === 'function') d.requestUpdate();
    }
  }

  get visible(): boolean { return this._visible; }
  set visible(val: boolean) {
    if (this._visible === val) return;
    this._visible = val;
    this._invalidateMeasure();
    if (this._diagram && this._isLayoutPositioned) {
      const layout = this._diagram.layout;
      if (layout && layout.isOngoing) {
        layout.invalidateLayout();
      }
      if (this._containingGroup && this._containingGroup.layout && this._containingGroup.layout.isOngoing) {
        this._containingGroup.layout.invalidateLayout();
      }
    }
  }

  // ============ Properties ============

  private _syncGuard: boolean = false;

  /** 官方 WD：location 点相对 bounds TL 的偏移（locationObject = part 本身，naturalBounds + locationSpot） */
  private _locationOffset(out?: Point): Point {
    const p = out || new Point();
    // 官方 WD：Group 的 locationObject = placeholder（偏移 = placeholder 在 group 局部的链偏移 + spot）
    let locObj: any = this;
    if ((this as any)._className === 'Group') {
      const ph = (this as any).placeholder;
      if (ph) locObj = ph;
    }
    const sp = this._locationSpot;
    const nb = locObj._naturalBounds;
    let w = nb ? nb.width : 0;
    let h = nb ? nb.height : 0;
    if (!(w > 0)) w = locObj._measuredBounds ? locObj._measuredBounds.width : 0;
    if (!(h > 0)) h = locObj._measuredBounds ? locObj._measuredBounds.height : 0;
    if (!(w > 0)) w = 0;
    if (!(h > 0)) h = 0;
    let cx = 0;
    let cy = 0;
    if (locObj !== this) {
      const chain = this.localOffsetTo(locObj);
      if (chain) {
        cx = chain.x;
        cy = chain.y;
      }
    }
    p.x = cx + sp.x * w + sp.offsetX - (this._measuredBounds ? this._measuredBounds.x : 0);
    p.y = cy + sp.y * h + sp.offsetY - (this._measuredBounds ? this._measuredBounds.y : 0);
    return p;
  }

  get location(): Point { return this._location; }
  set location(val: Point) {
    const p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : new Point(NaN, NaN));
    const old = this._location;
    const differs = (old.x !== p.x && (!isNaN(old.x) || !isNaN(p.x))) || (old.y !== p.y && (!isNaN(old.y) || !isNaN(p.y)));
    if (!differs) return;
    this._location = p;
    if (!this._syncGuard) {
      this._syncGuard = true;
      // 官方 t4：position 为实值时平移；position 为 NaN 时留给 ensureBounds/bF
      const pos = this._position;
      if (!isNaN(pos.x) && !isNaN(pos.y)) {
        if (!isNaN(old.x) && !isNaN(old.y)) {
          const np = new Point(pos.x + (p.x - old.x), pos.y + (p.y - old.y));
          this._position = np;
          this._actualBounds.x = np.x;
          this._actualBounds.y = np.y;
        } else {
          const off = this._locationOffset();
          this._position = new Point(p.x - off.x, p.y - off.y);
          this._actualBounds.x = this._position.x;
          this._actualBounds.y = this._position.y;
        }
      }
      this._syncGuard = false;
    }
    if (this._diagram && this._isLayoutPositioned) {
      const layout = this._diagram.layout;
      if (layout && layout.isOngoing) {
        layout.invalidateLayout();
      }
    }
    if (this._containingGroup && this._containingGroup.layout && this._containingGroup.layout.isOngoing) {
      this._containingGroup.layout.invalidateLayout();
    }
  }

  /** 官方 Part.position（GraphObject.position 的 Part 覆盖：与 location 按 locationSpot 同步） */
  get position(): Point { return this._position; }
  set position(val: Point) {
    const p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : new Point(NaN, NaN));
    const old = this._position;
    const differs = (old.x !== p.x && (!isNaN(old.x) || !isNaN(p.x))) || (old.y !== p.y && (!isNaN(old.y) || !isNaN(p.y)));
    if (!differs) return;
    this._position = p;
    this._invalidateArrange();
    if (!this._syncGuard) {
      this._syncGuard = true;
      // 官方 cN：仅当 position 与 location 均为实值时按 Δ 平移 location
      // （position 为 NaN 时不动 location —— location 为权威来源，由 ensureBounds/sync 推导 position）
      const pos = this._position;
      const oldPosReal = !isNaN(old.x) && !isNaN(old.y);
      if (oldPosReal && !isNaN(pos.x) && !isNaN(pos.y)) {
        this._location = new Point(this._location.x + (p.x - old.x), this._location.y + (p.y - old.y));
      }
      this._syncGuard = false;
    }
    this._actualBounds.x = p.x;
    this._actualBounds.y = p.y;
  }

  /**
   * 官方 bF（location 驱动）：arrange 后 locationSpot 偏移变化时，用 location 重新推导 position。
   */
  syncPositionFromLocation(): void {
    const loc = this._location;
    if (isNaN(loc.x) || isNaN(loc.y)) return;
    const off = this._locationOffset();
    const p = new Point(loc.x - off.x, loc.y - off.y);
    this._position = p;
    this._actualBounds.x = p.x;
    this._actualBounds.y = p.y;
  }

  /**
   * 从 this 到后代 target 的面板局部偏移累加（基于 actualBounds 局部坐标链）。
   */
  localOffsetTo(target: GraphObject): Point | null {
    const contains = (o: any): boolean =>
      o === target || (o._elements ? o._elements.some((c: any) => contains(c)) : false);
    const acc = (obj: any, px: number, py: number): { x: number; y: number } | null => {
      const els = obj._elements;
      if (!els) return null;
      for (const ch of els) {
        const ab = ch._actualBounds;
        const nx = px + (ab && !isNaN(ab.x) ? ab.x : 0);
        const ny = py + (ab && !isNaN(ab.y) ? ab.y : 0);
        if (ch === target) return { x: nx, y: ny };
        if (contains(ch)) {
          const r = acc(ch, nx, ny);
          if (r) return r;
        }
      }
      return null;
    };
    const r = acc(this, 0, 0);
    return r ? new Point(r.x, r.y) : null;
  }

  get locationSpot(): Spot { return this._locationSpot; }
  set locationSpot(val: Spot) {
    const s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
    if (this._locationSpot.equals(s)) return;
    this._locationSpot = s;
  }

  get locationObjectName(): string { return this._locationObjectName; }
  set locationObjectName(val: string) { this._locationObjectName = val; }

  get movable(): boolean { return this._movable; }
  set movable(val: boolean) { this._movable = val; }

  get copyable(): boolean { return this._copyable; }
  set copyable(val: boolean) { this._copyable = val; }

  get deletable(): boolean { return this._deletable; }
  set deletable(val: boolean) { this._deletable = val; }

  get selectable(): boolean { return this._selectable; }
  set selectable(val: boolean) { this._selectable = val; }

  get selectionAdorned(): boolean { return this._selectionAdorned; }
  set selectionAdorned(val: boolean) { this._selectionAdorned = val; }

  get selectionAdornmentTemplate(): any { return this._selectionAdornmentTemplate; }
  set selectionAdornmentTemplate(val: any) { this._selectionAdornmentTemplate = val; }

  get isSelected(): boolean { return this._isSelected; }
  set isSelected(val: boolean) {
    if (this._isSelected === val) return;
    this._isSelected = val;
    if (val && this._selectionAdorned) {
      const ad = this._createSelectionAdornment();
      this.addAdornment('Selection', ad);
      if (this._diagram) {
        const adornmentLayer = this._diagram.findLayer('Adornment');
        if (adornmentLayer) {
          adornmentLayer.add(ad);
        }
        this._diagram.selection.add(this);
      }
    } else {
      const ad = this.getAdornment('Selection');
      if (ad) {
        if (this._diagram) {
          const adornmentLayer = this._diagram.findLayer('Adornment');
          if (adornmentLayer) {
            adornmentLayer.remove(ad);
          }
        }
        this.removeAdornment('Selection');
      }
      if (this._diagram) {
        this._diagram.selection.remove(this);
      }
    }
    if (this._diagram && (this._diagram as any)._toolManager) {
      (this._diagram as any)._toolManager.updateAdornments(this);
    }
  }

  get isHighlighted(): boolean { return this._isHighlighted; }
  set isHighlighted(val: boolean) { this._isHighlighted = val; }

  get isLayoutPositioned(): boolean { return this._isLayoutPositioned; }
  set isLayoutPositioned(val: boolean) { this._isLayoutPositioned = val; }

  get isInDocumentBounds(): boolean { return this._isInDocumentBounds; }
  set isInDocumentBounds(val: boolean) { this._isInDocumentBounds = val; }

  get isShadowed(): boolean { return this._isShadowed; }
  set isShadowed(val: boolean) { this._isShadowed = val; }

  get shadowOffset(): Point { return this._shadowOffset; }
  set shadowOffset(val: Point) {
    const p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : Point.Zero.copy());
    if (this._shadowOffset.equals(p)) return;
    this._shadowOffset = p;
  }

  get shadowColor(): string { return this._shadowColor; }
  set shadowColor(val: string) { this._shadowColor = val; }

  get shadowBlur(): number { return this._shadowBlur; }
  set shadowBlur(val: number) { this._shadowBlur = val; }

  get layerName(): string { return this._layerName; }
  set layerName(val: string) { this._layerName = val; }

  get zOrder(): number { return this._zOrder; }
  set zOrder(val: number) { this._zOrder = val; }

  get canStart(): boolean { return this._canStart; }
  set canStart(val: boolean) { this._canStart = val; }

  get dragComputation(): ((part: Part, newLoc: Point, snappedLoc: Point) => Point) | null {
    return this._dragComputation;
  }
  set dragComputation(val: ((part: Part, newLoc: Point, snappedLoc: Point) => Point) | null) {
    this._dragComputation = val;
  }

  get adornments(): Map<string, any> { return this._adornments; }
  set adornments(val: Map<string, any>) { this._adornments = val; }

  get category(): string { return this._category; }
  set category(val: string) { this._category = val; }

  get itemIndex(): number { return this._itemIndex; }
  set itemIndex(val: number) { this._itemIndex = val; }

  // ============ Readonly properties ============

  get isTopLevel(): boolean { return this._containingGroup === null; }

  /** 官方 Part.canLayout */
  canLayout(): boolean {
    if (!this._isLayoutPositioned || !this._visible) return false;
    if ((this as any).isLinkLabel) return false;
    return true;
  }

  get isVirtual(): boolean { return false; }

  get containingGroup(): any { return this._containingGroup; }
  set containingGroup(val: any) {
    if (this._containingGroup === val) return;
    const old = this._containingGroup;
    if (old && typeof old._memberParts !== 'undefined') {
      old._memberParts.remove(this);
      if ((old as any).layout && (old as any).layout.isOngoing) {
        (old as any).layout.invalidateLayout();
      }
    }
    this._containingGroup = val;
    if (val && typeof val._memberParts !== 'undefined') {
      val._memberParts.add(this);
      if ((val as any).layout && (val as any).layout.isOngoing) {
        (val as any).layout.invalidateLayout();
      }
    }
  }

  get adornmentStream(): Iterator<any> { return this._adornments.values; }

  // ============ Methods ============

  /** Find a named GraphObject within this Part */
  findObject(name: string): GraphObject | null {
    return typeof super.findObject === 'function' ? super.findObject(name) : null;
  }

  /** Ensure the bounds of this Part are computed (official: measure + updateBounds + sync position/location) */
  ensureBounds(): void {
    if (typeof (this as any)._measure === 'function') (this as any)._measure(Infinity, Infinity);
    const mb = this._measuredBounds;
    if (mb && Number.isFinite(mb.width) && Number.isFinite(mb.height) && mb.width > 0 && mb.height > 0) {
      this._actualBounds.width = mb.width;
      this._actualBounds.height = mb.height;
    }
    const pos = this._position;
    const loc = this._location;
    const posReal = !isNaN(pos.x) && !isNaN(pos.y);
    const locReal = !isNaN(loc.x) && !isNaN(loc.y);
    if (!locReal && posReal) {
      const off = this._locationOffset();
      this._location = new Point(pos.x + off.x, pos.y + off.y);
    } else if (locReal && !posReal) {
      this.position = loc; // setter derives position from location offset
    }
    this._actualBounds.x = this._position.x;
    this._actualBounds.y = this._position.y;
  }

  /** Get the bounding rectangle in document coordinates */
  getDocumentBounds(): Rect {
    return this._actualBounds.copy();
  }

  /** 官方 Part.move(newLoc, isLocation?)：isLocation=true 移动 location，否则移动 position */
  move(newLoc: Point, isLocation?: boolean): void {
    if (isLocation === true) {
      this.location = newLoc;
    } else {
      this.position = newLoc;
    }
  }

  /** 官方 Part.moveTo(x, y, isLocation?) */
  moveTo(x: number, y: number, isLocation?: boolean): void {
    this.move(new Point(x, y), isLocation);
  }

  /** Add an adornment for the given category */
  addAdornment(category: string, ad: any): void {
    this._adornments.set(category, ad);
  }

  /** Remove the adornment for the given category */
  removeAdornment(category: string): void {
    this._adornments.remove(category);
  }

  /** Get the adornment for the given category */
  getAdornment(category: string): any | null {
    return this._adornments.get(category) ?? null;
  }

  /** Remove all adornments */
  clearAdornments(): void {
    this._adornments.clear();
  }

  _createSelectionAdornment(): any {
    if (this._selectionAdornmentTemplate) {
      const ad = this._selectionAdornmentTemplate.copy();
      ad.adornedObject = this;
      const bounds = this.getDocumentBounds();
      ad._actualBounds = bounds.copy();
      ad._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
      ad._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
      return ad;
    }
    const AdornmentCtor = GraphObject._classRegistry['Adornment'];
    const adornment = new AdornmentCtor(PanelAuto);
    const shape = new Shape();
    shape.fill = '';
    shape.stroke = 'dodgerblue';
    shape.strokeWidth = 2;
    shape.strokeDashArray = [4, 2];
    shape.isPanelMain = true;
    shape.stretch = StretchFill;
    adornment.add(shape);
    adornment.adornedObject = this;
    const bounds = this.getDocumentBounds();
    adornment._actualBounds = bounds.copy();
    adornment._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
    adornment._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
    (shape as any)._actualBounds = new Rect(0, 0, bounds.width, bounds.height);
    (shape as any)._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
    (shape as any)._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
    return adornment;
  }

  copy(): Part {
    const copy = new Part();
    this._copyPropertiesTo(copy as any);
    this._copyPanelPropertiesTo(copy as any);
    this._copyPartPropertiesTo(copy);
    return copy;
  }

  /** Copy Part-specific properties to another Part */
  protected _copyPartPropertiesTo(copy: Part): void {
    copy._location = this._location.copy();
    copy._locationSpot = this._locationSpot.copy();
    copy._locationObjectName = this._locationObjectName;
    copy._movable = this._movable;
    copy._copyable = this._copyable;
    copy._deletable = this._deletable;
    copy._selectable = this._selectable;
    copy._isSelected = this._isSelected;
    copy._isHighlighted = this._isHighlighted;
    copy._isLayoutPositioned = this._isLayoutPositioned;
    copy._isInDocumentBounds = this._isInDocumentBounds;
    copy._isShadowed = this._isShadowed;
    copy._shadowOffset = this._shadowOffset.copy();
    (copy as any)._shadowColor = (this as any)._shadowColor;
    (copy as any)._shadowBlur = (this as any)._shadowBlur;
    (copy as any)._layerName = (this as any)._layerName;
    (copy as any)._zOrder = (this as any)._zOrder;
    (copy as any)._canStart = (this as any)._canStart;
    (copy as any)._dragComputation = (this as any)._dragComputation;
    (copy as any)._category = (this as any)._category;
  }

  /** Update target bindings for a given property, or all if no property name given */
  updateTargetBindings(propname?: string): void {
    const d = this._diagram;
    if (d && typeof d._updateBindingsForPart === 'function') {
      d._updateBindingsForPart(this, propname);
    }
  }
}

GraphObject.defineBuilder('Part', Part);
