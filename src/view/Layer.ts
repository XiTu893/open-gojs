import { List } from '../core/List';
import { Iterator } from '../core/Iterable';
import { Point } from '../core/Point';
import type { Rect } from '../core/Rect';
import { Set as GSet } from '../core/Set';
import { ChangedEventProperty } from '../core/EnumValues';
import type { Part } from './Part';
import type { GraphObject } from './GraphObject';

/**
 * Layer - 图层
 * 控制绘制顺序和可见性
 *
 * 对照 `go.d.ts` 的 `export class Layer`（10441 行起）。
 * 偏差：官方 Layer 内部维护一个 Quadtree（`Hr`）做空间索引，
 * 本项目直接按 `parts` 反向顺序线性扫描，结果语义一致、仅性能不同。
 */
export class Layer {
  static readonly className: string = "Layer";

  private _name: string = '';
  private _opacity: number = 1;
  private _visible: boolean = true;
  private _isTemporary: boolean = false;
  private _isViewportAligned: boolean = false;
  private _isInDocumentBounds: boolean = true;
  private _pickable: boolean = true;
  private _allowCopy: boolean = true;
  private _allowDelete: boolean = true;
  private _allowTextEdit: boolean = true;
  private _allowGroup: boolean = true;
  private _allowUngroup: boolean = true;
  private _allowLink: boolean = true;
  private _allowRelink: boolean = true;
  private _allowMove: boolean = true;
  private _allowReshape: boolean = true;
  private _allowResize: boolean = true;
  private _allowRotate: boolean = true;
  private _allowSelect: boolean = true;
  /** Z 序（本项目扩展，官方无此属性） */
  public zIndex: number = 0;
  /** 所属 Diagram */
  private _diagram: any = null;
  /** 图层中的 Part 集合 */
  private _parts: List<any> = new List();

  constructor(init?: Partial<Layer>) {
    if (!init) return;
    if (init.name !== undefined) this.name = init.name;
    if (init.opacity !== undefined) this.opacity = init.opacity;
    if (init.visible !== undefined) this.visible = init.visible;
    if (init.pickable !== undefined) this.pickable = init.pickable;
    if (init.isTemporary !== undefined) this.isTemporary = init.isTemporary;
    if (init.isViewportAligned !== undefined) this.isViewportAligned = init.isViewportAligned;
    if (init.isInDocumentBounds !== undefined) this.isInDocumentBounds = init.isInDocumentBounds;
    if (init.allowCopy !== undefined) this.allowCopy = init.allowCopy;
    if (init.allowDelete !== undefined) this.allowDelete = init.allowDelete;
    if (init.allowTextEdit !== undefined) this.allowTextEdit = init.allowTextEdit;
    if (init.allowGroup !== undefined) this.allowGroup = init.allowGroup;
    if (init.allowUngroup !== undefined) this.allowUngroup = init.allowUngroup;
    if (init.allowLink !== undefined) this.allowLink = init.allowLink;
    if (init.allowRelink !== undefined) this.allowRelink = init.allowRelink;
    if (init.allowMove !== undefined) this.allowMove = init.allowMove;
    if (init.allowReshape !== undefined) this.allowReshape = init.allowReshape;
    if (init.allowResize !== undefined) this.allowResize = init.allowResize;
    if (init.allowRotate !== undefined) this.allowRotate = init.allowRotate;
    if (init.allowSelect !== undefined) this.allowSelect = init.allowSelect;
    if (init.diagram !== undefined) this.diagram = init.diagram;
    if (init.zIndex !== undefined) this.zIndex = init.zIndex;
  }

  /** 官方 Layer 的属性变更通知（`Diagram.raiseChangedEvent(ChangedEvent.Property, ...)`） */
  private _raiseChanged(propertyname: string, oldval: any, newval: any): void {
    const d = this._diagram;
    if (d !== null && typeof d.raiseChangedEvent === 'function') {
      d.raiseChangedEvent(ChangedEventProperty, propertyname, this, oldval, newval);
    }
  }

  // ============ 官方 Layer.prototype 拾取方法 ============

  /**
   * 官方 `Layer.findObjectAt(p, navig, pred)`（go.d.ts:10461）。
   * `p` 是**文档坐标**；`navig` 把命中的对象映射成结果类型，`pred` 再过滤。
   */
  findObjectAt<T extends GraphObject>(
    p: Point,
    navig?: ((a: GraphObject) => (T | null)) | null,
    pred?: ((a: T) => boolean) | null
  ): T | null {
    if (!this._pickable) return null;
    const it = this._parts.iteratorBackwards;
    while (it.next()) {
      const part: Part = it.value;
      if (!part.isVisible()) continue;
      const hit = part._findObjectAtDoc(p);
      if (hit === null) continue;
      const mapped = navig ? navig(hit) : (hit as unknown as T);
      if (mapped === null || mapped === undefined) continue;
      if (!pred || pred(mapped)) return mapped;
    }
    return null;
  }

  /** 官方 `Layer.findObjectsAt(p, navig, pred, coll)`（go.d.ts:10480）。 */
  findObjectsAt<T extends GraphObject, S extends List<T> | GSet<T> = GSet<T>>(
    p: Point,
    navig?: ((a: GraphObject) => (T | null)) | null,
    pred?: ((a: T) => boolean) | null,
    coll?: S
  ): S {
    const c: any = coll !== undefined && coll !== null ? coll : new GSet<T>();
    if (!this._pickable) return c as S;
    const add = Layer._collector(navig, pred, c);
    const it = this._parts.iteratorBackwards;
    while (it.next()) {
      const part: Part = it.value;
      if (!part.isVisible()) continue;
      part._collectObjectsAtDoc(p, add);
    }
    return c as S;
  }

  /** 官方 `Layer.findObjectsIn(r, navig, pred, partialInclusion, coll)`（go.d.ts:10499）。 */
  findObjectsIn<T extends GraphObject, S extends List<T> | GSet<T> = GSet<T>>(
    r: Rect,
    navig?: ((a: GraphObject) => (T | null)) | null,
    pred?: ((a: T) => boolean) | null,
    partialInclusion?: boolean,
    coll?: S
  ): S {
    const c: any = coll !== undefined && coll !== null ? coll : new GSet<T>();
    if (!this._pickable) return c as S;
    const partial = partialInclusion === undefined ? false : partialInclusion;
    const add = Layer._collector(navig, pred, c);
    const it = this._parts.iteratorBackwards;
    while (it.next()) {
      const part: Part = it.value;
      if (!part.isVisible()) continue;
      part._collectObjectsInDoc(r, add, partial);
    }
    return c as S;
  }

  /** 官方 `Layer.findObjectsNear(p, dist, navig, pred, partialInclusion, coll)`（go.d.ts:10522）。 */
  findObjectsNear<T extends GraphObject, S extends List<T> | GSet<T> = GSet<T>>(
    p: Point,
    dist: number,
    navig?: ((a: GraphObject) => (T | null)) | null,
    pred?: ((a: T) => boolean) | null,
    partialInclusion?: boolean | S,
    coll?: S
  ): S {
    // 官方：第 5 参既可以是 boolean，也可以直接传集合
    let partial = true;
    let explicit: any = undefined;
    if (partialInclusion !== undefined && partialInclusion !== null) {
      if (typeof partialInclusion === 'boolean') partial = partialInclusion;
      else explicit = partialInclusion;
    }
    const c: any = explicit !== undefined && explicit !== null
      ? explicit
      : (coll !== undefined && coll !== null ? coll : new GSet<T>());
    if (!this._pickable) return c as S;
    const add = Layer._collector(navig, pred, c);
    const it = this._parts.iteratorBackwards;
    while (it.next()) {
      const part: Part = it.value;
      if (!part.isVisible()) continue;
      part._collectObjectsNearDoc(p, dist, add, partial);
    }
    return c as S;
  }

  /** 生成官方 `navig → pred → coll.add` 的回调。 */
  private static _collector<T extends GraphObject>(
    navig: ((a: GraphObject) => (T | null)) | null | undefined,
    pred: ((a: T) => boolean) | null | undefined,
    coll: any
  ): (o: GraphObject) => void {
    return (o: GraphObject): void => {
      const mapped = navig ? navig(o) : (o as unknown as T);
      if (mapped === null || mapped === undefined) return;
      if (!pred || pred(mapped)) coll.add(mapped);
    };
  }

  // ============ Part 集合 ============

  get parts(): Iterator<Part> {
    return this._parts.iterator;
  }

  get partsBackwards(): Iterator<Part> {
    return this._parts.iteratorBackwards;
  }

  get partsCount(): number {
    return this._parts.count;
  }

  get diagram(): any {
    return this._diagram;
  }
  set diagram(val: any) {
    if (this._diagram === val) return;
    this._diagram = val;
  }

  get name(): string { return this._name; }
  set name(val: string) {
    if (this._name === val) return;
    this._raiseChanged('name', this._name, val);
    this._name = val;
  }

  get opacity(): number { return this._opacity; }
  set opacity(val: number) {
    if (this._opacity === val) return;
    // 官方要求 0 <= value <= 1，超出范围抛错；本项目按官方约束直接拒绝非法值
    if (val < 0 || val > 1) {
      throw new Error('Layer.opacity: expected 0 <= value <= 1, got ' + val);
    }
    this._raiseChanged('opacity', this._opacity, val);
    this._opacity = val;
    const d = this._diagram;
    if (d !== null && typeof d.requestUpdate === 'function') d.requestUpdate();
  }

  get isViewportAligned(): boolean { return this._isViewportAligned; }
  set isViewportAligned(val: boolean) {
    if (this._isViewportAligned === val) return;
    this._raiseChanged('isViewportAligned', this._isViewportAligned, val);
    this._isViewportAligned = val;
    const d = this._diagram;
    if (d !== null && typeof d.requestUpdate === 'function') d.requestUpdate();
    // 官方：设为 true 时强制 isInDocumentBounds = false
    if (val) this.isInDocumentBounds = false;
  }

  get isTemporary(): boolean { return this._isTemporary; }
  set isTemporary(val: boolean) {
    if (this._isTemporary === val) return;
    this._raiseChanged('isTemporary', this._isTemporary, val);
    this._isTemporary = val;
  }

  get visible(): boolean { return this._visible; }
  set visible(val: boolean) {
    if (this._visible === val) return;
    this._raiseChanged('visible', this._visible, val);
    this._visible = val;
    // 官方：连带切换本层所有 Part 的 visible
    const it = this._parts.iterator;
    while (it.next()) it.value.visible = val;
    const d = this._diagram;
    if (d !== null && typeof d.requestUpdate === 'function') d.requestUpdate();
  }

  get pickable(): boolean { return this._pickable; }
  set pickable(val: boolean) {
    if (this._pickable === val) return;
    this._raiseChanged('pickable', this._pickable, val);
    this._pickable = val;
  }

  get isInDocumentBounds(): boolean { return this._isInDocumentBounds; }
  set isInDocumentBounds(val: boolean) {
    if (this._isInDocumentBounds === val) return;
    this._raiseChanged('isInDocumentBounds', this._isInDocumentBounds, val);
    this._isInDocumentBounds = val;
    const d = this._diagram;
    if (d !== null && typeof d.invalidateDocumentBounds === 'function') d.invalidateDocumentBounds();
  }

  get allowCopy(): boolean { return this._allowCopy; }
  set allowCopy(val: boolean) {
    if (this._allowCopy === val) return;
    this._raiseChanged('allowCopy', this._allowCopy, val);
    this._allowCopy = val;
  }

  get allowDelete(): boolean { return this._allowDelete; }
  set allowDelete(val: boolean) {
    if (this._allowDelete === val) return;
    this._raiseChanged('allowDelete', this._allowDelete, val);
    this._allowDelete = val;
  }

  get allowTextEdit(): boolean { return this._allowTextEdit; }
  set allowTextEdit(val: boolean) {
    if (this._allowTextEdit === val) return;
    this._raiseChanged('allowTextEdit', this._allowTextEdit, val);
    this._allowTextEdit = val;
  }

  get allowGroup(): boolean { return this._allowGroup; }
  set allowGroup(val: boolean) {
    if (this._allowGroup === val) return;
    this._raiseChanged('allowGroup', this._allowGroup, val);
    this._allowGroup = val;
  }

  get allowUngroup(): boolean { return this._allowUngroup; }
  set allowUngroup(val: boolean) {
    if (this._allowUngroup === val) return;
    this._raiseChanged('allowUngroup', this._allowUngroup, val);
    this._allowUngroup = val;
  }

  get allowLink(): boolean { return this._allowLink; }
  set allowLink(val: boolean) {
    if (this._allowLink === val) return;
    this._raiseChanged('allowLink', this._allowLink, val);
    this._allowLink = val;
  }

  get allowRelink(): boolean { return this._allowRelink; }
  set allowRelink(val: boolean) {
    if (this._allowRelink === val) return;
    this._raiseChanged('allowRelink', this._allowRelink, val);
    this._allowRelink = val;
  }

  get allowMove(): boolean { return this._allowMove; }
  set allowMove(val: boolean) {
    if (this._allowMove === val) return;
    this._raiseChanged('allowMove', this._allowMove, val);
    this._allowMove = val;
  }

  get allowReshape(): boolean { return this._allowReshape; }
  set allowReshape(val: boolean) {
    if (this._allowReshape === val) return;
    this._raiseChanged('allowReshape', this._allowReshape, val);
    this._allowReshape = val;
  }

  get allowResize(): boolean { return this._allowResize; }
  set allowResize(val: boolean) {
    if (this._allowResize === val) return;
    this._raiseChanged('allowResize', this._allowResize, val);
    this._allowResize = val;
  }

  get allowRotate(): boolean { return this._allowRotate; }
  set allowRotate(val: boolean) {
    if (this._allowRotate === val) return;
    this._raiseChanged('allowRotate', this._allowRotate, val);
    this._allowRotate = val;
  }

  get allowSelect(): boolean { return this._allowSelect; }
  set allowSelect(val: boolean) {
    if (this._allowSelect === val) return;
    this._raiseChanged('allowSelect', this._allowSelect, val);
    this._allowSelect = val;
  }

  /**
   * 官方 `Layer.toString(details?: number)`（运行时实现，go.d.ts 未声明）。
   * `details <= 0` → `Layer "<name>"`；`> 0` 追加计数；`> 1` 再逐个列出 Part。
   */
  toString(details?: number): string {
    const d = details === undefined ? 0 : details;
    const head = 'Layer "' + this.name + '"';
    if (d <= 0) return head;
    let parts = 0, nodes = 0, groups = 0, links = 0, adorns = 0;
    const it = this._parts.iterator;
    while (it.next()) {
      const p: any = it.value;
      const cn = p.constructor && p.constructor.className;
      if (cn === 'Group') groups++;
      else if (cn === 'Node') nodes++;
      else if (cn === 'Link') links++;
      else if (cn === 'Adornment') adorns++;
      else parts++;
    }
    let detail = '';
    if (parts > 0) detail += parts + ' Parts ';
    if (nodes > 0) detail += nodes + ' Nodes ';
    if (groups > 0) detail += groups + ' Groups ';
    if (links > 0) detail += links + ' Links ';
    if (adorns > 0) detail += adorns + ' Adornments ';
    if (d > 1) {
      const it2 = this._parts.iterator;
      while (it2.next()) {
        const p: any = it2.value;
        detail += '\n    ' + p.toString();
        const data = p.data;
        if (data !== null && data !== undefined) {
          const id = (data as any).__gohashid;
          if (id !== undefined) detail += ' #' + id;
          detail += ' ' + (typeof data === 'object' ? JSON.stringify(data) : String(data));
        }
      }
    }
    return head + ' ' + this._parts.count + ': ' + detail;
  }

  // ============ Part 集合操作（本项目沿用；官方为内部方法） ============

  /** 添加 Part */
  add(part: any): void {
    this._parts.add(part);
    if (part) {
      (part as any)._layer = this;
      // 官方 Layer.add 会经由 diagram.partAdded 给 part 打上 diagram 标记；
      // 没有这一步，Part 及其子对象的 .diagram 会一直是 null（例如 Picture 加载完
      // 图片后无法触发重绘）。
      const d = this._diagram;
      if (d) {
        (part as any)._diagram = d;
        if (typeof d.partAdded === 'function') d.partAdded(part);
      }
    }
  }

  /** 移除 Part */
  remove(part: any): boolean {
    const ok = this._parts.remove(part);
    if (ok && part && (part as any)._layer === this) {
      (part as any)._layer = null;
      const d = this._diagram;
      if (d) {
        (part as any)._diagram = null;
        if (typeof d.partRemoved === 'function') d.partRemoved(part);
      }
    }
    return ok;
  }

  /** 清空 */
  clear(): void {
    const it = this._parts.iterator;
    while (it.next()) {
      const part = it.value;
      if (part && (part as any)._layer === this) {
        (part as any)._layer = null;
        const d = this._diagram;
        if (d && typeof d.partRemoved === 'function') d.partRemoved(part);
      }
    }
    this._parts.clear();
  }

  /** 是否包含 Part */
  contains(part: any): boolean {
    return this._parts.contains(part);
  }
}
