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
import { PanelAuto, StretchFill, StretchDefault, EnumValue, PanelLink } from '../core/EnumValues';
import {
  LayoutConditionsNone, LayoutConditionsAdded, LayoutConditionsRemoved,
  LayoutConditionsShown, LayoutConditionsHidden, LayoutConditionsNodeSized,
  LayoutConditionsGroupLayout, LayoutConditionsNodeReplaced,
  LayoutConditionsStandard, LayoutConditionsAll,
} from '../core/EnumValues';

/**
 * Part - base class for top-level visual elements (Node, Link, Adornment).
 * Extends Panel with location, selection, shadow, and adornment support.
 */
export class Part extends Panel {
  static readonly className: string = "Part";

  // ============ 官方 Part 静态 LayoutConditions 位标志 ============
  static readonly LayoutNone: number = LayoutConditionsNone;
  static readonly LayoutAdded: number = LayoutConditionsAdded;
  static readonly LayoutRemoved: number = LayoutConditionsRemoved;
  static readonly LayoutShown: number = LayoutConditionsShown;
  static readonly LayoutHidden: number = LayoutConditionsHidden;
  static readonly LayoutNodeSized: number = LayoutConditionsNodeSized;
  static readonly LayoutGroupLayout: number = LayoutConditionsGroupLayout;
  static readonly LayoutNodeReplaced: number = LayoutConditionsNodeReplaced;
  static readonly LayoutStandard: number = LayoutConditionsStandard;
  static readonly LayoutAll: number = LayoutConditionsAll;

  // ============ Private property storage ============
  protected _diagram: any = null;
  /** 所属 Layer（官方 PartSettings.Ll），由 Layer.add/remove 维护 */
  protected _layer: any = null;
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
  protected _shadowOffset: Point = new Point(6, 6);
  private _shadowColor: string = 'gray';
  private _shadowBlur: number = 4;
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
  // ---- 阶段 4：官方 Part 上由共享 PartSettings 对象承载的字段 ----
  private _groupable: boolean = true;
  private _isAnimated: boolean = true;
  private _textEditable: boolean = true;
  private _reshapable: boolean = false;
  private _resizable: boolean = false;
  private _rotatable: boolean = false;
  private _text: string = '';
  private _layoutConditions: number = LayoutConditionsStandard;
  private _minLocation: Point = new Point(-Infinity, -Infinity);
  private _maxLocation: Point = new Point(Infinity, Infinity);
  private _rotationSpot: Spot = Spot.Default.copy();
  private _resizeCellSize: Size = new Size(NaN, NaN);
  private _selectionObjectName: string = '';
  private _resizeObjectName: string = '';
  private _rotateObjectName: string = '';
  private _resizeAdornmentTemplate: Part | null = null;
  private _rotateAdornmentTemplate: Part | null = null;
  private _locationObject: GraphObject | null = null;
  private _selectionObject: GraphObject | null = null;
  private _containingGroupChanged: ((part: Part, oldGroup: unknown, newGroup: unknown) => void) | null = null;
  private _highlightedChanged: ((part: Part) => void) | null = null;
  private _layerChanged: ((part: Part, oldLayer: unknown, newLayer: unknown) => void) | null = null;
  private _selectionChanged: ((part: Part) => void) | null = null;
  private _adornmentsPending: boolean = false;

  constructor(type?: any, init?: any) {
    const [t, i] = Panel._resolveArgs(type, init);
    super(t, undefined);
    this._className = 'Part';
    if (i) {
      this.set(i);
    }
  }

  /** 官方 Part.g()：部件级失效只触发重排（measure/arrange/render），**不**失效布局 —— 官方
   * GraphObject.Ef→os 只置测量脏位；布局失效只走 Diagram.Ib（模型/绑定变更，带 isOngoing 护栏）。
   * 早先这里冒泡 `d._layoutInvalid=true`，配合 Diagram._measureArrangeAll 尾部的
   * _invalidateLinkRoutes 形成「布局→路线失效→布局」每帧死循环（gantt 样例 bar y=0 死循环元凶之一）。 */
  _invalidateMeasure(): void {
    super._invalidateMeasure();
    const d = this._diagram;
    if (d) {
      // 测量进行中（_measureArrangeAll(true)）不重武装脏位：期间 _invalidateLinkRoutes
      // →invalidateRoute→_invalidateMeasure 会无限重武装（grafcet 避障 link 每帧闪烁根因）。
      if (!(d as any)._isMeasuring) {
        (d as any)._measureInvalid = true;
        if (typeof d.requestUpdate === 'function') d.requestUpdate();
      }
    }
  }

  get visible(): boolean { return this._visible; }
  set visible(val: boolean) {
    if (this._visible === val) return;
    this._visible = val;
    this._invalidateMeasure();
  }

  // ============ Properties ============

  private _syncGuard: boolean = false;

  /**
   * 官方 Part.po 的旋转枢轴 r：measure 时算出并缓存（angle/scale 均为 1 时为 null）。
   * r 用于：① po 求 measuredBounds 包围盒；② WD 的 Fi 旋转；③ 渲染器旋转枢轴；④ 文档坐标变换。
   */
  protected _rotPivot: Point | null = null;

  /** 官方 locationObject：`locationObjectName` 指定对象优先；否则 Group/Adornment→placeholder（不可见回退 this） */
  private _resolveLocationObject(): any {
    let locObj: any = this;
    if (this._locationObjectName !== '') {
      // 官方：locationObjectName 优先（Group 也用它，不因 isGroup 走 placeholder）——
      // sequenceDiagram 的 group `locationObjectName:'HEADER'` 若被 placeholder 顶掉，
      // locationOffset 按占位符(高度=成员区)算 → position.y 整体上移 231px。
      const o = this.findObject(this._locationObjectName);
      if (o !== null && o !== undefined) locObj = o.visible ? o : this;
    } else if ((this as any)._className === 'Group' || (this as any)._className === 'Adornment') {
      const ph = (this as any).placeholder;
      if (ph) locObj = ph;
    }
    return locObj;
  }

  /**
   * 官方 Part.op 的 r：
   * - locationObject !== this：r = locationSpot × lo.naturalBounds（含 nb.x/y），
   *   逐级减去 lo 及其祖先面板（至 part 为止）的 measuredBounds 原点（官方 lo.Fi.Pt/a.Fi.Pt 略过——
   *   locationObject 自身带 scale/angle 的场景极罕见且 Fi 依赖其自身 r）。
   * - locationObject === this：r = locationSpot × (0,0,nb.w,nb.h)（官方 setSpot(po 入参)）。
   */
  private _computeRotPivot(): Point {
    const ls = this._locationSpot;
    const spot = ls && (typeof ls.isSpot !== 'function' || ls.isSpot()) ? ls : new Spot(0.5, 0.5);
    const p = new Point();
    const locObj = this._resolveLocationObject();
    const nb = locObj._naturalBounds;
    const real = nb !== null && nb !== undefined &&
      isFinite(nb.x) && isFinite(nb.y) && isFinite(nb.width) && isFinite(nb.height);
    const bw = real ? nb.width : 0;
    const bh = real ? nb.height : 0;
    if (locObj !== this) {
      p.x = (real ? nb.x : 0) + spot.x * bw + spot.offsetX;
      p.y = (real ? nb.y : 0) + spot.y * bh + spot.offsetY;
      let cur: any = locObj;
      let guard = 0;
      while (cur !== null && cur !== this && guard++ < 64) {
        const mb = cur._measuredBounds;
        if (mb && isFinite(mb.x) && isFinite(mb.y)) {
          p.x -= mb.x;
          p.y -= mb.y;
        }
        cur = cur._panel;
      }
    } else {
      p.x = spot.x * bw + spot.offsetX;
      p.y = spot.y * bh + spot.offsetY;
    }
    return p;
  }

  /**
   * 官方 GraphObject.po 的 Part 覆写：Fi = scale(原点) → 绕 r 旋转（官方 Ns：M = S·T(r)·R·T(−r)，
   * 即 p' = sc·(r + R(p−r))）；measuredBounds = km(Fi,(0,0,nb.w,nb.h)) 的轴对齐包围盒
   * （mb.x/y = 官方 (ax,ay)）。naturalBounds 不受影响。
   */
  protected _applyMeasureTransform(): void {
    const sc = this.scale;
    const ang = this.angle;
    const rotated = !isNaN(ang) && ang !== 0;
    if (sc === 1 && !rotated) {
      this._rotPivot = null;
      return;
    }
    const nb = this._naturalBounds;
    const w = nb !== null && isFinite(nb.width) ? nb.width : this._measuredBounds.width;
    const h = nb !== null && isFinite(nb.height) ? nb.height : this._measuredBounds.height;
    if (!rotated) {
      // 官方 angle=0：op 提前返回，Fi 仅 scale（about 原点）
      this._rotPivot = null;
      this._measuredBounds = new Rect(0, 0, w * sc, h * sc);
      return;
    }
    const r = this._computeRotPivot();
    this._rotPivot = r;
    let cs = 1;
    let sn = 0;
    if (ang === 90) { cs = 0; sn = 1; } else if (ang === 180) { cs = -1; sn = 0; } else if (ang === 270) { cs = 0; sn = -1; }
    else { const rd = (ang * Math.PI) / 180; cs = Math.cos(rd); sn = Math.sin(rd); }
    const corners: number[][] = [[0, 0], [w, 0], [0, h], [w, h]];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const c of corners) {
      const dx = c[0] - r.x;
      const dy = c[1] - r.y;
      const qx = sc * (r.x + dx * cs - dy * sn);
      const qy = sc * (r.y + dx * sn + dy * cs);
      if (qx < minX) minX = qx;
      if (qy < minY) minY = qy;
      if (qx > maxX) maxX = qx;
      if (qy > maxY) maxY = qy;
    }
    this._measuredBounds = new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  /** 官方 WD/op：location 点相对文档的偏移（官方 Part.WD(t) 的等价实现） */
  private _locationOffset(out?: Point): Point {
    const p = out || new Point();
    const ls = this._locationSpot;
    const spot = ls && (typeof ls.isSpot !== 'function' || ls.isSpot()) ? ls : new Spot(0.5, 0.5);
    const locObj = this._resolveLocationObject();
    const nb = locObj._naturalBounds;
    const real = nb !== null && nb !== undefined && isFinite(nb.width) && isFinite(nb.height);
    const bw = real ? nb.width : 0;
    const bh = real ? nb.height : 0;
    const n = locObj !== this && locObj instanceof Shape
      ? (isFinite((locObj as Shape).strokeWidth) && (locObj as Shape).strokeWidth > 0 ? (locObj as Shape).strokeWidth : 0)
      : 0;
    // 官方：t.setSpot(0, 0, s.width + n, s.height + n, locationSpot)
    p.x = spot.x * (bw + n) + spot.offsetX;
    p.y = spot.y * (bh + n) + spot.offsetY;
    if (locObj !== this) {
      p.x -= n / 2;
      p.y -= n / 2;
      // 官方：e.D.Pt(t) + 逐级 panel 的 o.D.Pt(t)（D = ab + p − mb）
      let cur: any = locObj;
      let guard = 0;
      while (cur !== null && cur !== this && guard++ < 64) {
        const ab = cur._actualBounds;
        const mb = cur._measuredBounds;
        if (ab && isFinite(ab.x) && isFinite(ab.y)) { p.x += ab.x; p.y += ab.y; }
        if (mb && isFinite(mb.x) && isFinite(mb.y)) { p.x -= mb.x; p.y -= mb.y; }
        cur = cur._panel;
      }
    }
    // 官方：this.Fi !== null && this.Fi.Pt(t)（scale(原点) + 绕 r 旋转：p' = sc·(r + R(p−r))）
    const ang = this.angle;
    const sc = this.scale;
    if (!isNaN(ang) && ang !== 0) {
      const r = this._rotPivot !== null && this._rotPivot !== undefined ? this._rotPivot : this._computeRotPivot();
      let cs = 1;
      let sn = 0;
      if (ang === 90) { cs = 0; sn = 1; } else if (ang === 180) { cs = -1; sn = 0; } else if (ang === 270) { cs = 0; sn = -1; }
      else { const rd = (ang * Math.PI) / 180; cs = Math.cos(rd); sn = Math.sin(rd); }
      const dx = p.x - r.x;
      const dy = p.y - r.y;
      p.x = r.x + dx * cs - dy * sn;
      p.y = r.y + dx * sn + dy * cs;
    }
    if (sc !== 1) { p.x *= sc; p.y *= sc; }
    // 官方：t.offset(−this.me.x, −this.me.y)（AABB 原点扣除）
    const mb = this._measuredBounds;
    if (mb && isFinite(mb.x) && isFinite(mb.y)) {
      p.x -= mb.x;
      p.y -= mb.y;
    }
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
          // 官方 WE() 末尾：`this.t("position", n, i.copy())`
          this.raiseChanged('position', pos.copy(), np.copy());
        } else {
          const off = this._locationOffset();
          const np2 = new Point(p.x - off.x, p.y - off.y);
          this._position = np2;
          this._actualBounds.x = np2.x;
          this._actualBounds.y = np2.y;
          this.raiseChanged('position', pos.copy(), np2.copy());
        }
      }
      this._syncGuard = false;
    }
    // 官方 `Part.set location` 末尾：`this.t("location", s, t.copy())`
    this.raiseChanged('location', old.copy(), p.copy());
    // 官方 Part.location setter 只有 t4（同步 position）+ raiseChanged，**没有**布局失效 ——
    // 早先在这里 invalidateLayout()（isOngoing 默认 true）让 _performLayout 的动画回写
    // （location=旧值）触发重排 → 重排又回写 → gantt 死循环元凶之二。
    // 官方布局失效唯一入口是 Diagram.Ib（模型/绑定变更处，本项目在 _onModelChanged 里实现）。
    // 官方 Part.location：Node 位置变化 → invalidateConnectedLinks
    // （清端口 side-spot knot 并重算相连连线；undo/redo 期间跳过）
    if (typeof (this as any).invalidateConnectedLinks === 'function') {
      const dm: any = this._diagram;
      const um = dm && dm.undoManager;
      if (!um || !um.isUndoingRedoing) (this as any).invalidateConnectedLinks();
    }
    // 官方：Node location 变化 → Diagram.Fd(node)（占用场标待重建，Only nodes matter）
    if (typeof (this as any).canAvoid === 'function' && this._diagram && typeof (this._diagram as any).Fd === 'function') {
      (this._diagram as any).Fd(this);
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
      // 官方 cN：position 变化时同步 location。
      // 旧 position 为实值时按 Δ 平移；旧 position 为 NaN（首次定位）时，
      // 由新 position 反推 location（否则 location 永远停在 NaN，布局结果丢失）。
      const pos = this._position;
      const oldPosReal = !isNaN(old.x) && !isNaN(old.y);
      if (oldPosReal && !isNaN(pos.x) && !isNaN(pos.y)) {
        this._location = new Point(this._location.x + (p.x - old.x), this._location.y + (p.y - old.y));
      } else if (!oldPosReal && !isNaN(pos.x) && !isNaN(pos.y)) {
        const off = this._locationOffset();
        this._location = new Point(p.x + off.x, p.y + off.y);
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
  set locationObjectName(val: string) {
    if (this._locationObjectName === val) return;
    this._locationObjectName = val;
    this._locationObject = null;
  }

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
    const d = this._diagram;
    if (d !== null) {
      if (val) d.selection.add(this);
      else d.selection.remove(this);
      this.updateAdornments();
      if ((d as any)._toolManager) (d as any)._toolManager.updateAdornments(this);
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

  /**
   * 官方 `Part.layer`（只读，返回本 Part 所属 Layer）。
   * 必须覆盖 `GraphObject.layer`（后者为 `this.part.layer`），
   * 否则 Part 自身 `_part === this` 时会无限递归。
   * 由 `Layer.add/remove` 维护。
   */
  get layer(): any {
    return this._layer;
  }

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
    // 临时层（Grid/ViewportBackground/Adornment/Tool 等）里的 Part 不参与布局 ——
    // 官方 canLayout 要求 isLayoutPositioned，而临时层部件的该标志为 false；
    // 否则 PERT 图例(legend) 会混进 LD 网络，拉偏末层间距 41px。
    if (this._layer && (this._layer as any).isTemporary) return false;
    return true;
  }

  get isVirtual(): boolean { return false; }

  get containingGroup(): any { return this._containingGroup; }
  set containingGroup(val: any) {
    if (this._containingGroup === val) return;
    const old = this._containingGroup;
    // 官方 Part.set containingGroup：先按「移除」条件失效（此时 Hh 仍是 old，失效打到旧组布局）
    this.invalidateLayout(2 /* LayoutConditions.Removed */);
    if (old && typeof old._memberParts !== 'undefined') {
      old._memberParts.remove(this);
      if ((old as any).layout && (old as any).layout.isOngoing) {
        (old as any).layout.invalidateLayout();
      }
      // 官方 `Group.vN`：成员移除回调（默认 null，未设置时零开销）
      if (typeof old._notifyMemberRemoved === 'function') old._notifyMemberRemoved(this);
    }
    this._containingGroup = val;
    if (val && typeof val._memberParts !== 'undefined') {
      val._memberParts.add(this);
      if ((val as any).layout && (val as any).layout.isOngoing) {
        (val as any).layout.invalidateLayout();
      }
      // 官方 `Group.WN`：成员加入回调（默认 null，未设置时零开销）
      if (typeof val._notifyMemberAdded === 'function') val._notifyMemberAdded(this);
    }
    // 官方：挂到新组后再按「添加」条件失效（打到新组布局）
    this.invalidateLayout(1 /* LayoutConditions.Added */);
    // 官方 Part.set containingGroup 尾部：成员图内相关连线的 `Link.dg()` 重算
    this._propagateContainingGroupToLinks();
    const ev = this.containingGroupChanged;
    if (ev !== null) ev(this, old, val);
    this.raiseChanged('containingGroup', old, val);
  }

  /**
   * 官方 Part.set containingGroup 尾部的连线传播：
   * - 本 Part 是 Group（有 memberParts）：官方 `Part.Lh(n,this,!0,0,!0)` 收集本组
   *   及其全部成员（递归下钻嵌套组），对其中每个 Node 的所有连线调用 `Link.dg`；
   * - 本 Part 是 Node（含 Group 自身）：自身 linksConnected 与 labeledLink 也重算。
   * 用鸭子类型代替 instanceof，避免 Part ↔ Node 的循环 import。
   */
  private _propagateContainingGroupToLinks(): void {
    const dgLink = (l: any): void => {
      if (l !== null && l !== undefined && typeof l.updateContainingGroup === 'function') {
        l.updateContainingGroup();
      }
    };
    const dgNodeLinks = (n: any): void => {
      if (n === null || n === undefined || typeof n.linksConnected === 'undefined') return;
      const it = n.linksConnected;
      while (it.next()) dgLink(it.value);
      if (n.labeledLink !== null && n.labeledLink !== undefined) dgLink(n.labeledLink);
    };
    if (typeof (this as any).memberParts !== 'undefined') {
      const seen: Part[] = [];
      const collect = (p: any): void => {
        if (p === null || p === undefined || seen.indexOf(p) >= 0) return;
        seen.push(p);
        if (typeof p.memberParts !== 'undefined') {
          const it = p.memberParts.iterator;
          while (it.next()) collect(it.value);
        }
      };
      collect(this);
      for (let i = 0; i < seen.length; i++) dgNodeLinks(seen[i]);
    }
    dgNodeLinks(this);
  }

  get adornmentStream(): Iterator<any> { return this._adornments.iteratorValues; }

  // ============ Methods ============

  /** Find a named GraphObject within this Part */
  findObject(name: string): GraphObject | null {
    return typeof super.findObject === 'function' ? super.findObject(name) : null;
  }

  /**
   * 官方 `Part.Df(change, propertyname, obj, oldval, newval, oldparam?, newparam?)`：
   * GraphObject 属性变更经所属 Part 转发到 Diagram 的管道。
   * Part 自身的 `_part` 指向自己，故此方法必须独立于 `GraphObject.raiseChangedEvent`，
   * 否则会自调用死循环。
   */
  raiseChangedEventFromObject(
    change: any, propertyname: string, obj: any,
    oldval: any, newval: any, oldparam?: any, newparam?: any
  ): void {
    const diagram = this.diagram as any;
    if (diagram !== null && typeof diagram.raiseChangedEvent === 'function') {
      diagram.raiseChangedEvent(change, propertyname, obj, oldval, newval, oldparam, newparam);
    }
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
      // 官方 ensureBounds 的 bF 分支（pos=NaN、loc 实）：kF = position 由
      // location − locationOffset 推出，**直接写入**。
      // 早先这里写 `this.position = loc` 指望 setter 按 spot 派生——但 setter
      // （官方 cN 同样）从不按 spot 派生 position，反而触发 position→location
      // 反推，把 location 覆盖成 loc+off：flowchart 全部节点停在 loc 原值
      // （少了半尺寸），且与 location 形成 kF 自洽环固化（实测 -1 节点
      // pos=-237,41 / loc=-203.5,60.6 即此）。
      this.syncPositionFromLocation();
    }
    this._actualBounds.x = this._position.x;
    this._actualBounds.y = this._position.y;
    // 官方 `Part.ensureBounds()` = `this.yt(Infinity, Infinity); this.Ht();`
    // 即 measure 之后还要 arrange 一次。放在 isTemporary 图层（如 ViewportBackground）
    // 上的 Part 不会经过 Diagram._measureArrangeAll，若不在这里 arrange，
    // 其子元素的 actualBounds 会一直是 NaN 而画不出来（absolute.html 的背景矩形缺失）。
    if (typeof (this as any)._arrange === 'function' &&
      Number.isFinite(this._actualBounds.width) && Number.isFinite(this._actualBounds.height)) {
      (this as any)._arrange(new Rect(
        this._actualBounds.x, this._actualBounds.y,
        this._actualBounds.width, this._actualBounds.height));
    }
  }

  /** 官方 `Part.getDocumentBounds(rect?)`：返回文档坐标包围盒（给出 rect 时写入并返回该 rect） */
  getDocumentBounds(rect?: Rect): Rect {
    let b = this._actualBounds;
    // 官方 getDocumentBounds 由 naturalBounds 经变换矩阵推导，起点为 (0,0)；
    // 未 arrange 过的 Part（position/location 为 NaN）也应返回有效包围盒，而不是 NaN
    if (isNaN(b.x) || isNaN(b.y) || isNaN(b.width) || isNaN(b.height)) {
      const nb = this.naturalBounds;
      b = new Rect(0, 0, nb.width, nb.height);
    }
    if (rect) {
      rect.x = b.x;
      rect.y = b.y;
      rect.width = b.width;
      rect.height = b.height;
      return rect;
    }
    return b.copy();
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

  /**
   * 官方 `Part.addAdornment(category, ad)`：
   * 同类别旧装饰先从图中移除；同步 `ad.category`；把装饰加入 diagram；
   * 最后用 `adornedObject.findBindingPanel().data` 作为装饰的数据上下文
   * （选择装饰里所有 data 绑定都靠这一句拿到节点数据）。
   */
  addAdornment(category: string, ad: any): void {
    if (ad === null || ad === undefined) return;
    const old = this._adornments.get(category) ?? null;
    if (old === ad) return;
    if (old !== null) {
      const d = (old as any).diagram;
      if (d !== null && d !== undefined) d.remove(old);
    }
    if (ad.category !== category) ad.category = category;
    this._adornments.set(category, ad);
    const d = this._diagram;
    if (d !== null && d !== undefined) {
      d.add(ad);
    }
  }

  /** 官方 `Part.removeAdornment(category)`：从 diagram 摘除并清空 data */
  removeAdornment(category: string): void {
    const ad = this._adornments.get(category) ?? null;
    if (ad !== null) {
      const d = (ad as any).diagram;
      if (d !== null && d !== undefined) d.remove(ad);
      ad.data = null;
    }
    this._adornments.delete(category);
  }

  /** Get the adornment for the given category */
  getAdornment(category: string): any | null {
    return this._adornments.get(category) ?? null;
  }

  /** Remove all adornments */
  clearAdornments(): void {
    this._adornments.clear();
  }

  /**
   * 官方默认选择装饰（diagram.nodeSelectionAdornmentTemplate 缺省时的兜底）：
   * `Adornment(Auto, Shape(fill:null, stroke:dodgerblue, strokeWidth:2, isPanelMain, stretch:Fill), Placeholder())。
   * 只负责造模板，**不设 adornedObject / 不预设 bounds** —— 由 `_updateSelectionAdornment` 统一挂载，
   * 尺寸与位置由 Placeholder.measure 按被装饰对象推出。
   */
  _createSelectionAdornment(): any {
    if (this._selectionAdornmentTemplate) {
      return this._selectionAdornmentTemplate.copy();
    }
    const AdornmentCtor = GraphObject._classRegistry['Adornment'];
    const PlaceholderCtor = GraphObject._classRegistry['Placeholder'];
    const adornment = new AdornmentCtor(PanelAuto);
    const shape = new Shape();
    shape.fill = '';
    shape.stroke = 'dodgerblue';
    shape.strokeWidth = 2;
    shape.strokeDashArray = [4, 2];
    shape.isPanelMain = true;
    shape.stretch = StretchFill;
    adornment.add(shape);
    if (PlaceholderCtor) adornment.add(new PlaceholderCtor());
    return adornment;
  }

  // ============ 阶段 4：官方 Part.prototype 缺口 ============

  /** 官方 Part.canCopy() */
  canCopy(): boolean {
    if (!this._copyable) return false;
    const layer = this.layer;
    if (layer === null) return true;
    if (!layer.allowCopy) return false;
    const d = layer.diagram;
    return d === null ? true : !!d.allowCopy;
  }

  /** 官方 Part.canDelete() */
  canDelete(): boolean {
    if (!this._deletable) return false;
    const layer = this.layer;
    if (layer === null) return true;
    if (!layer.allowDelete) return false;
    const d = layer.diagram;
    return d === null ? true : !!d.allowDelete;
  }

  /** 官方 Part.canEdit() */
  canEdit(): boolean {
    if (!this._textEditable) return false;
    const layer = this.layer;
    if (layer === null) return true;
    if (!layer.allowTextEdit) return false;
    const d = layer.diagram;
    return d === null ? true : !!d.allowTextEdit;
  }

  /** 官方 Part.canGroup() */
  canGroup(): boolean {
    if (!this._groupable) return false;
    const layer = this.layer;
    if (layer === null) return true;
    if (!layer.allowGroup) return false;
    const d = layer.diagram;
    return d === null ? true : !!d.allowGroup;
  }

  /** 官方 Part.canMove() */
  canMove(): boolean {
    if (!this._movable) return false;
    const layer = this.layer;
    if (layer === null) return true;
    if (!layer.allowMove) return false;
    const d = layer.diagram;
    return d === null ? true : !!d.allowMove;
  }

  /** 官方 Part.canReshape() */
  canReshape(): boolean {
    if (!this._reshapable) return false;
    const layer = this.layer;
    if (layer === null) return true;
    if (!layer.allowReshape) return false;
    const d = layer.diagram;
    return d === null ? true : !!d.allowReshape;
  }

  /** 官方 Part.canResize() */
  canResize(): boolean {
    if (!this._resizable) return false;
    const layer = this.layer;
    if (layer === null) return true;
    if (!layer.allowResize) return false;
    const d = layer.diagram;
    return d === null ? true : !!d.allowResize;
  }

  /** 官方 Part.canRotate() */
  canRotate(): boolean {
    if (!this._rotatable) return false;
    const layer = this.layer;
    if (layer === null) return true;
    if (!layer.allowRotate) return false;
    const d = layer.diagram;
    return d === null ? true : !!d.allowRotate;
  }

  /** 官方 Part.canSelect() */
  canSelect(): boolean {
    if (!this._selectable) return false;
    const layer = this.layer;
    if (layer === null) return true;
    if (!layer.allowSelect) return false;
    const d = layer.diagram;
    return d === null ? true : !!d.allowSelect;
  }

  get groupable(): boolean { return this._groupable; }
  set groupable(val: boolean) {
    if (this._groupable === val) return;
    const old = this._groupable;
    this._groupable = val;
    this.raiseChanged('groupable', old, val);
  }

  get textEditable(): boolean { return this._textEditable; }
  set textEditable(val: boolean) {
    if (this._textEditable === val) return;
    const old = this._textEditable;
    this._textEditable = val;
    this.raiseChanged('textEditable', old, val);
    this.invalidateAdornments();
  }

  get isAnimated(): boolean { return this._isAnimated; }
  set isAnimated(val: boolean) {
    if (this._isAnimated === val) return;
    const old = this._isAnimated;
    this._isAnimated = val;
    this.raiseChanged('isAnimated', old, val);
  }

  get reshapable(): boolean { return this._reshapable; }
  set reshapable(val: boolean) {
    if (this._reshapable === val) return;
    const old = this._reshapable;
    this._reshapable = val;
    this.raiseChanged('reshapable', old, val);
    this.invalidateAdornments();
  }

  get resizable(): boolean { return this._resizable; }
  set resizable(val: boolean) {
    if (this._resizable === val) return;
    const old = this._resizable;
    this._resizable = val;
    this.raiseChanged('resizable', old, val);
    this.invalidateAdornments();
  }

  get rotatable(): boolean { return this._rotatable; }
  set rotatable(val: boolean) {
    if (this._rotatable === val) return;
    const old = this._rotatable;
    this._rotatable = val;
    this.raiseChanged('rotatable', old, val);
    this.invalidateAdornments();
  }

  get text(): string { return this._text; }
  set text(val: string) {
    if (this._text === val) return;
    const old = this._text;
    this._text = val;
    this.raiseChanged('text', old, val);
  }

  /** 官方 `Part.key`：只读，取 model 里对应数据的 key */
  get key(): unknown {
    const d = this._diagram;
    if (d === null || d.model === null || d.model === undefined) return undefined;
    return d.model.getKeyForNodeData(this.data);
  }

  /** 官方 `Part.self` 只读侧 */
  get self(): Part { return this; }
  /**
   * 官方 `Part.self` 的 setter 走 `Part.HN(newData, oldCat, newCat)`（按新 category 从模板
   * 整体重建部件）。本项目没有模板重建管线，这里退化为「把 value 的可观察状态同步进本部件」。
   */
  set self(value: Part) {
    if (value === this || value === null || value === undefined) return;
    this.clearAdornments();
    this.category = value.category;
    this.data = value.data;
    this.text = value.text;
    this.layerName = value.layerName;
    this.updateTargetBindings();
  }

  // ---- 事件处理函数属性（官方挂在共享的 PartSettings 对象上） ----

  get containingGroupChanged(): ((part: Part, oldGroup: unknown, newGroup: unknown) => void) | null {
    return this._containingGroupChanged;
  }
  set containingGroupChanged(val: ((part: Part, oldGroup: unknown, newGroup: unknown) => void) | null) {
    const old = this.containingGroupChanged;
    if (old === val) return;
    this._containingGroupChanged = val;
    this.raiseChanged('containingGroupChanged', old, val);
  }

  get highlightedChanged(): ((part: Part) => void) | null { return this._highlightedChanged; }
  set highlightedChanged(val: ((part: Part) => void) | null) {
    const old = this.highlightedChanged;
    if (old === val) return;
    this._highlightedChanged = val;
    this.raiseChanged('highlightedChanged', old, val);
  }

  get layerChanged(): ((part: Part, oldLayer: unknown, newLayer: unknown) => void) | null {
    return this._layerChanged;
  }
  set layerChanged(val: ((part: Part, oldLayer: unknown, newLayer: unknown) => void) | null) {
    const old = this.layerChanged;
    if (old === val) return;
    this._layerChanged = val;
    this.raiseChanged('layerChanged', old, val);
  }

  get selectionChanged(): ((part: Part) => void) | null { return this._selectionChanged; }
  set selectionChanged(val: ((part: Part) => void) | null) {
    const old = this.selectionChanged;
    if (old === val) return;
    this._selectionChanged = val;
    this.raiseChanged('selectionChanged', old, val);
  }

  get layoutConditions(): number { return this._layoutConditions; }
  set layoutConditions(val: number) {
    const old = this._layoutConditions;
    if (old === val) return;
    this._layoutConditions = val;
    this.raiseChanged('layoutConditions', old, val);
  }

  // ---- 位置/装饰相关属性 ----

  /** 官方 `Part.locationObject`（只读，带缓存） */
  get locationObject(): GraphObject {
    if (this._locationObject === null) {
      if (this._locationObjectName !== '') {
        const o = this.findObject(this._locationObjectName);
        this._locationObject = o !== null ? o : this;
      } else {
        this._locationObject = this;
      }
    }
    return this._locationObject.visible ? this._locationObject : this;
  }

  get minLocation(): Point { return this._minLocation; }
  set minLocation(val: Point) {
    if (this.minLocation.equals(val)) return;
    const old = this._minLocation.copy();
    this._minLocation = val.copy();
    this.raiseChanged('minLocation', old, val);
  }

  get maxLocation(): Point { return this._maxLocation; }
  set maxLocation(val: Point) {
    if (this.maxLocation.equals(val)) return;
    const old = this._maxLocation.copy();
    this._maxLocation = val.copy();
    this.raiseChanged('maxLocation', old, val);
  }

  get selectionObjectName(): string { return this._selectionObjectName; }
  set selectionObjectName(val: string) {
    if (this._selectionObjectName === val) return;
    const old = this._selectionObjectName;
    this._selectionObjectName = val;
    this._selectionObject = null;
    this.raiseChanged('selectionObjectName', old, val);
  }

  /** 官方 `Part.selectionObject`（只读，带缓存） */
  get selectionObject(): GraphObject {
    if (this._selectionObject === null) {
      const n = this._selectionObjectName;
      if (n !== null && n !== '') {
        const o = this.findObject(n);
        this._selectionObject = o !== null ? o : this;
      } else {
        this._selectionObject = this;
      }
    }
    return this._selectionObject;
  }

  get resizeObjectName(): string { return this._resizeObjectName; }
  set resizeObjectName(val: string) {
    if (this._resizeObjectName === val) return;
    const old = this._resizeObjectName;
    this._resizeObjectName = val;
    this.raiseChanged('resizeObjectName', old, val);
  }

  /** 官方 `Part.resizeObject`（只读） */
  get resizeObject(): GraphObject {
    if (this._resizeObjectName !== '') {
      const o = this.findObject(this._resizeObjectName);
      if (o !== null) return o;
    }
    return this;
  }

  get rotateObjectName(): string { return this._rotateObjectName; }
  set rotateObjectName(val: string) {
    if (this._rotateObjectName === val) return;
    const old = this._rotateObjectName;
    this._rotateObjectName = val;
    this.raiseChanged('rotateObjectName', old, val);
  }

  /** 官方 `Part.rotateObject`（只读） */
  get rotateObject(): GraphObject {
    if (this._rotateObjectName !== '') {
      const o = this.findObject(this._rotateObjectName);
      if (o !== null) return o;
    }
    return this;
  }

  get rotationSpot(): Spot { return this._rotationSpot; }
  set rotationSpot(val: Spot) {
    if (this._rotationSpot.equals(val)) return;
    const old = this._rotationSpot.copy();
    this._rotationSpot = val.copy();
    this.raiseChanged('rotationSpot', old, val);
  }

  get resizeCellSize(): Size { return this._resizeCellSize; }
  set resizeCellSize(val: Size) {
    if (this._resizeCellSize.equals(val)) return;
    const old = this._resizeCellSize.copy();
    this._resizeCellSize = val.copy();
    this.raiseChanged('resizeCellSize', old, val);
  }

  get resizeAdornmentTemplate(): Part | null { return this._resizeAdornmentTemplate; }
  set resizeAdornmentTemplate(val: Part | null) {
    const old = this.resizeAdornmentTemplate;
    if (old === val) return;
    this._resizeAdornmentTemplate = val;
    this.raiseChanged('resizeAdornmentTemplate', old, val);
  }

  get rotateAdornmentTemplate(): Part | null { return this._rotateAdornmentTemplate; }
  set rotateAdornmentTemplate(val: Part | null) {
    const old = this.rotateAdornmentTemplate;
    if (old === val) return;
    this._rotateAdornmentTemplate = val;
    this.raiseChanged('rotateAdornmentTemplate', old, val);
  }

  // ---- 查询/遍历 ----

  /** 官方 `Part.findAdornment(category)` */
  findAdornment(category: string): unknown | null {
    return this._adornments.get(category);
  }

  /** 官方 `Part.hasPlaceholder()`（Adornment 覆写为 true） */
  hasPlaceholder(): boolean { return false; }

  /** 官方 `Part.isVisible()`：还要看图层可见性与所属 Group 是否展开 */
  isVisible(): boolean {
    if (!this._visible) return false;
    const layer = this.layer;
    if (layer !== null) {
      if (!layer.visible) return false;
      const d = layer.diagram;
      if (d !== null && d.animationManager !== undefined && d.animationManager !== null &&
          typeof d.animationManager.isAnimatingPart === 'function' &&
          d.animationManager.isAnimatingPart(this)) return true;
    }
    const group = this._containingGroup;
    return !(group !== null && (!group.isSubGraphExpanded || !group.isVisible()));
  }

  /** 官方 `Part.findSubGraphLevel()` */
  findSubGraphLevel(): number {
    return Part._subGraphLevel(this);
  }

  private static _subGraphLevel(p: Part): number {
    const group = p.containingGroup;
    if (group !== null) return 1 + Part._subGraphLevel(group);
    const link = Part._labeledLinkOf(p);
    if (link !== null) return Part._subGraphLevel(link);
    return 0;
  }

  /** 官方 `Part.findTopLevelPart()` */
  findTopLevelPart(): Part {
    return Part._topLevelPart(this);
  }

  private static _topLevelPart(p: Part): Part {
    const group = p.containingGroup;
    if (group !== null) return Part._topLevelPart(group);
    const link = Part._labeledLinkOf(p);
    if (link !== null) return Part._topLevelPart(link);
    return p;
  }

  /** 官方：Node 上的 `labeledLink`（本项目 Phase 4 稍后补该属性，此处鸭子类型取用） */
  private static _labeledLinkOf(p: Part): Part | null {
    const l = (p as Part & { labeledLink?: Part | null }).labeledLink;
    return l !== undefined && l !== null ? l : null;
  }

  /** 官方 `Part.isMemberOf(group)` */
  isMemberOf(group: unknown): boolean {
    if (group === null || group === undefined) return false;
    if ((group as { className?: string }).className !== 'Group') return false;
    return Part._isMemberOf(this, group as Part);
  }

  private static _isMemberOf(p: Part, target: Part): boolean {
    if (p === target || target === null) return false;
    const group = p.containingGroup;
    if (group !== null && (group === target || Part._isMemberOf(group, target))) return true;
    const link = Part._labeledLinkOf(p);
    if (link !== null) return Part._isMemberOf(link, target);
    return false;
  }

  /**
   * 官方 `Part.findCommonContainingGroup(other)`。
   * 官方用 Part 上的临时标志位（`Mk(true)`/`CF()`）做标记；本项目用临时 Set，等价且不污染部件状态。
   */
  findCommonContainingGroup(other: Part | null): Part | null {
    if (other === null) return null;
    if (this === other) return this.containingGroup;
    const marked = new Set<Part>();
    let p: Part | null = this;
    while (p !== null) {
      marked.add(p);
      p = Part._chainParent(p);
    }
    let result: Part | null = null;
    p = other;
    while (p !== null) {
      if (marked.has(p)) { result = p; break; }
      p = Part._chainParent(p);
    }
    return result;
  }

  /** 官方遍历链：Node 优先走 labeledLink，再取 containingGroup */
  private static _chainParent(p: Part): Part | null {
    const link = Part._labeledLinkOf(p);
    const cur: Part = link !== null ? link : p;
    return cur.containingGroup;
  }

  /** 官方 `Part.getRelativePoint(el, spot, result?)` */
  getRelativePoint(el: GraphObject, spot: Spot, result?: Point): Point {
    const res: Point = result !== undefined && result !== null ? result : new Point();
    const s: Spot = spot.isNoSpot() ? Spot.Center : spot;
    const nb = el.naturalBounds;
    res.setTo(nb.width * s.x + s.offsetX, nb.height * s.y + s.offsetY);
    if (el === null || el === this) return res;
    // 官方沿 Transform 链换算到本部件坐标；本项目无 Transform，逐层累加 actualBounds 原点等价
    let p: GraphObject | null = el;
    while (p !== null && p !== this) {
      const b = p.actualBounds;
      res.offset(b.x, b.y);
      p = p.panel;
    }
    return res;
  }

  // ---- 失效/更新 ----

  /**
   * 官方 `Part.invalidateLayout(condition?)`（go.d.ts:22860 附近）。
   * 条件与 `layoutConditions` 位与为 0 时直接忽略。
   */
  invalidateLayout(condition?: number): void {
    const mask = condition === undefined ? Part.LayoutAll : condition;
    if (!this._canInvalidateLayout(mask)) return;
    const group = this._containingGroup;
    if (group !== null) {
      const gl = group.layout;
      if (gl !== null && gl !== undefined) gl.invalidateLayout();
      else group.invalidateLayout(mask);
    } else {
      const d = this._diagram;
      if (d !== null && d.layout !== null && d.layout !== undefined) d.layout.invalidateLayout();
    }
  }

  private _canInvalidateLayout(mask: number): boolean {
    if (!this._isLayoutPositioned) return false;
    if ((mask & this._layoutConditions) === 0) return false;
    const layer = this.layer;
    if (layer !== null && layer.isTemporary) return false;
    const linkLabel = (this as Part & { isLinkLabel?: boolean }).isLinkLabel;
    if (linkLabel === true) return false;
    const d = this._diagram;
    if (d !== null && d.undoManager !== undefined && d.undoManager !== null &&
        d.undoManager.isUndoingRedoing) return false;
    return true;
  }

  /** 官方 `Part.invalidateAdornments()`：标记装饰失效并立刻按需重建 */
  invalidateAdornments(): void {
    const d = this._diagram;
    if (d !== null && typeof d.invalidateAdornments === 'function') d.invalidateAdornments();
    this._adornmentsPending = true;
    this.updateAdornments();
  }

  /** 官方 `Part.updateAdornments()` = `YE`（选择装饰）+ 各装饰 invalidateMeasure + updateTargetBindings */
  updateAdornments(): void {
    const d = this._diagram;
    if (d === null) return;
    this._updateSelectionAdornment(d);
    const first = this._adornments.iteratorValues;
    while (first.next()) {
      const ad: any = first.value;
      if (ad === null || ad === undefined) continue;
      if (typeof ad._invalidateMeasure === 'function') ad._invalidateMeasure();
      const ph = typeof ad.hasPlaceholder === 'function' && ad.hasPlaceholder() ? ad.placeholder : null;
      if (ph !== null && typeof ph._invalidateMeasure === 'function') ph._invalidateMeasure();
    }
    const second = this._adornments.iteratorValues;
    while (second.next()) {
      const ad: any = second.value;
      if (ad !== null && ad !== undefined && typeof ad.updateTargetBindings === 'function') {
        ad.updateTargetBindings();
      }
    }
    this._adornmentsPending = false;
  }

  /** 官方 `Part.YE(diagram)`：按 selectionAdornmentTemplate / diagram 默认模板创建 "Selection" 装饰 */
  private _updateSelectionAdornment(d: any): void {
    const cat = 'Selection';
    if (this._isSelected && this._selectionAdorned) {
      const i = this.selectionObject;
      if (
        i !== null &&
        this.actualBounds.isReal() &&
        this.isVisible() &&
        i.isVisibleObject() &&
        i.actualBounds.isReal()
      ) {
        let s: any = this._adornments.get(cat) ?? null;
        if (s === null) {
          let n: any = this._selectionAdornmentTemplate;
          if (n === null || n === undefined) {
            if (this._className === 'Link') n = d.linkSelectionAdornmentTemplate;
            else if (this._className === 'Group') n = d.groupSelectionAdornmentTemplate;
            else n = d.nodeSelectionAdornmentTemplate;
          }
          s = n ? n.copy() : this._createSelectionAdornment();
          if (s !== null && s !== undefined) {
            if (this._className === 'Link' && i === (this as any).path) s.type = PanelLink;
            s.adornedObject = i;
          }
        }
        if (s !== null && s !== undefined) {
          this.addAdornment(cat, s);
          return;
        }
      }
    }
    this.removeAdornment(cat);
  }

  /** 官方 `Part.updateRelationshipsFromData()` */
  updateRelationshipsFromData(): void {
    if (this.data === null || this.data === undefined) return;
    const d = this._diagram;
    if (d !== null && d.partManager !== undefined && d.partManager !== null) {
      d.partManager.updateRelationshipsFromData(this);
    }
  }

  copy(): Part {
    // 官方 Part.copy：`const t=new this.constructor; cloneProtected(t)` ——
    // 多态构造，子类模板（BarLink 等）复制后仍是子类。旧实现硬编码
    // `new Part()`，自定义 Link 子类模板全部退化成基础类。
    const copy = new (this as any).constructor();
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
    copy._category = this._category;
    copy._groupable = this._groupable;
    copy._isAnimated = this._isAnimated;
    copy._textEditable = this._textEditable;
    copy._reshapable = this._reshapable;
    copy._resizable = this._resizable;
    copy._rotatable = this._rotatable;
    copy._text = this._text;
    copy._layoutConditions = this._layoutConditions;
    copy._minLocation = this._minLocation.copy();
    copy._maxLocation = this._maxLocation.copy();
    copy._rotationSpot = this._rotationSpot.copy();
    copy._resizeCellSize = this._resizeCellSize.copy();
    copy._selectionObjectName = this._selectionObjectName;
    copy._selectionAdorned = this._selectionAdorned;
    copy._selectionAdornmentTemplate = this._selectionAdornmentTemplate;
    copy._resizeObjectName = this._resizeObjectName;
    copy._rotateObjectName = this._rotateObjectName;
    copy._resizeAdornmentTemplate = this._resizeAdornmentTemplate;
    copy._rotateAdornmentTemplate = this._rotateAdornmentTemplate;
    copy._containingGroupChanged = this._containingGroupChanged;
    copy._highlightedChanged = this._highlightedChanged;
    copy._layerChanged = this._layerChanged;
    copy._selectionChanged = this._selectionChanged;
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
