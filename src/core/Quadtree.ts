import { Rect } from './Rect';
import { Map } from './Map';
import { Set } from './Set';

/**
 * 官方 `Quadtree<T>`（go.d.ts: class Quadtree）——
 * 四叉树空间索引，官方用于 `Diagram.findObjectsIn/near` 与 AvoidsNodesRouter。
 */
export class Quadtree<T = any> {
  static readonly className: string = "Quadtree";

  private _bounds: Rect;
  private _level: number;
  private _maxObjects: number;
  private _maxLevels: number;
  private _isLeaf: boolean;

  private _objects: Map<T, Rect> = new Map<T, Rect>();
  private _northWest: Quadtree<T> | null = null;
  private _northEast: Quadtree<T> | null = null;
  private _southWest: Quadtree<T> | null = null;
  private _southEast: Quadtree<T> | null = null;

  constructor(
    x: number, y: number, w: number, h: number,
    maxObjects: number = 8, maxLevels: number = 8, level: number = 0
  ) {
    this._bounds = new Rect(x, y, w, h);
    this._maxObjects = maxObjects;
    this._maxLevels = maxLevels;
    this._level = level;
    this._isLeaf = true;
  }

  get bounds(): Rect { return this._bounds; }
  get level(): number { return this._level; }
  get isLeaf(): boolean { return this._isLeaf; }

  /** 官方 Quadtree.clear() */
  clear(): void {
    this._objects.clear();
    this._isLeaf = true;
    this._northWest = this._northEast = this._southWest = this._southEast = null;
  }

  /** 官方 Quadtree.reinitialize(maxObjects?) */
  reinitialize(maxObjects?: number): void {
    this.clear();
    if (maxObjects !== undefined && maxObjects > 0) this._maxObjects = maxObjects;
  }

  /** 官方 Quadtree.resize(rect, inflate?) */
  resize(rect: Rect, inflate: number = 0): void {
    rect = rect.copy();
    if (inflate > 0) rect.inflate(inflate, inflate);
    this._bounds = rect;
  }

  /** 官方 Quadtree.set(obj, bounds) —— 返回 false 表示 obj 与已有对象重叠 */
  set(obj: T, bounds: Rect): boolean {
    return this.add(obj, bounds);
  }

  /** 官方 Quadtree.add(obj, bounds) */
  add(obj: T, bounds: Rect): boolean {
    if (!this._bounds.containsRect(bounds)) {
      // 官方：超出根节点范围时直接忽略
      return false;
    }
    if (this._isLeaf && this._objects.count < this._maxObjects) {
      this._objects.set(obj, bounds.copy());
      return true;
    }
    if (this._isLeaf) {
      // 满了：下钻
      if (this._level < this._maxLevels) this._split();
      else { this._objects.set(obj, bounds.copy()); return true; }
    }
    // 先把已有对象分到子节点，再放自己
    const existing: [T, Rect][] = [];
    const it = this._objects.iterator;
    while (it.next()) existing.push([it.key, it.value]);
    this._objects.clear();
    for (const [o, b] of existing) this._addToChild(o, b);
    return this._addToChild(obj, bounds);
  }

  /** 官方 Quadtree.setTo(obj, x, y, w?, h?) */
  setTo(obj: T, x: number, y: number, w: number = 0, h: number = 0): boolean {
    return this.add(obj, new Rect(x, y, w, h));
  }

  /** 官方 Quadtree.find(r, result?) —— 找出与 r 相交（或包含 r）的对象 */
  find(r: Rect, result?: Set<T>): Set<T> {
    const res = result || new Set<T>();
    if (!this._intersects(r)) return res;
    const it = this._objects.iterator;
    while (it.next()) {
      const b = it.value;
      if (b.intersectsRect(r) || r.intersectsRect(b)) res.add(it.key);
    }
    for (const sub of [this._northWest, this._northEast, this._southWest, this._southEast]) {
      if (sub) sub.find(r, res);
    }
    return res;
  }

  /** 官方 Quadtree.findIn(x, y, w?, h?) */
  findIn(x: number, y: number, w: number = 0, h: number = 0, result?: Set<T>): Set<T> {
    return this.find(new Rect(x, y, w, h), result);
  }

  /** 官方 Quadtree.delete(obj, fast?) */
  delete(obj: T, fast: boolean = false): boolean {
    if (this._objects.contains(obj)) {
      this._objects.remove(obj);
      if (fast) this._isLeaf = true;
      return true;
    }
    for (const sub of [this._northWest, this._northEast, this._southWest, this._southEast]) {
      if (sub && sub.delete(obj, fast)) return true;
    }
    return false;
  }

  /** 官方 Quadtree.remove(obj, fast?) */
  remove(obj: T, fast: boolean = false): boolean {
    return this.delete(obj, fast);
  }

  /** 官方 Quadtree.move(obj, rect, fast?) */
  move(obj: T, rect: Rect, fast: boolean = false): void {
    this.moveTo(obj, rect.x, rect.y, rect.width, rect.height, fast);
  }

  /** 官方 Quadtree.moveTo(obj, x, y, w, h, fast?) */
  moveTo(obj: T, x: number, y: number, w: number, h: number, fast: boolean = false): void {
    const old = this._find(obj);
    if (old === null) { this.add(obj, new Rect(x, y, w, h)); return; }
    old.setTo(x, y, w, h);
    // 移出子树后就从旧位置删掉
    this.delete(obj, fast);
    if (!old.intersectsRect(this._bounds)) { /* 已在新范围外，交给调用方 */ }
    else this.add(obj, old.copy());
  }

  /** 官方 Quadtree.toMap(allObjects?) */
  toMap(allObjects?: Map<T, Rect>): Map<T, Rect> {
    const res = allObjects || new Map<T, Rect>();
    const it = this._objects.iterator;
    while (it.next()) res.set(it.key, it.value);
    for (const sub of [this._northWest, this._northEast, this._southWest, this._southEast]) {
      if (sub) sub.toMap(res);
    }
    return res;
  }

  // ---- internals ----

  private _split(): void {
    const b = this._bounds;
    const hw = b.width / 2, hh = b.height / 2;
    const l = this._level + 1;
    const m = this._maxObjects, ml = this._maxLevels;
    this._northWest = new Quadtree<T>(b.x, b.y, hw, hh, m, ml, l);
    this._northEast = new Quadtree<T>(b.x + hw, b.y, hw, hh, m, ml, l);
    this._southWest = new Quadtree<T>(b.x, b.y + hh, hw, hh, m, ml, l);
    this._southEast = new Quadtree<T>(b.x + hw, b.y + hh, hw, hh, m, ml, l);
    this._isLeaf = false;
  }

  private _intersects(r: Rect): boolean {
    return this._bounds.intersectsRect(r) || this._bounds.containsRect(r) || r.containsRect(this._bounds);
  }

  private _addToChild(obj: T, bounds: Rect): boolean {
    for (const sub of [this._northWest, this._northEast, this._southWest, this._southEast]) {
      if (sub && sub._bounds.containsRect(bounds)) return sub.add(obj, bounds);
    }
    // 没有子节点能完整包含（跨界）：留在本节点
    this._objects.set(obj, bounds.copy());
    return true;
  }

  private _find(obj: T): Rect | null {
    const b = this._objects.get(obj);
    if (b !== undefined) return b;
    for (const sub of [this._northWest, this._northEast, this._southWest, this._southEast]) {
      if (sub) {
        const r = sub._find(obj);
        if (r) return r;
      }
    }
    return null;
  }
}