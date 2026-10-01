import { Iterable, Iterator } from './Iterable';
import { List } from './List';
import { assignHashId, hashIdOf } from './HashId';

/**
 * Set - 无序集合（对齐官方 go.d.ts:1009 class Set<T> implements Iterable<T>）
 *
 * 官方 API:
 *   constructor(coll?: Iterable<T> | globalThis.Iterable<T>)
 *   [Symbol.iterator]() / values() / keys() / entries() / toString()
 *   add(val) / addAll(coll) / has(val) / contains(val)
 *   containsAll(coll) / containsAny(coll)
 *   delete(val) / remove(val) / removeAll(coll) / retainAll(coll) / clear()
 *   first() / any(pred) / all(pred) / each(func) / map<S>(func) / filter(pred)
 *   copy() / toArray() / toList()
 *   count / size / iterator / forEach
 *
 * 官方对 null 的处理：add(null) 忽略；addAll/removeAll/retainAll(null) 直接返回；
 * containsAll(null) 与 containsAny(null) 都返回 true。
 */
export class Set<T> implements Iterable<T> {
  protected _data: T[] = [];

  constructor(iterable?: Iterable<T> | T[] | globalThis.Iterable<T> | null) {
    assignHashId(this);
    if (iterable === null || iterable === undefined) return;
    if (Array.isArray(iterable)) {
      for (const item of iterable) this.add(item);
      return;
    }
    if ('iterator' in (iterable as Iterable<T>)) {
      const it = (iterable as Iterable<T>).iterator;
      while (it.next()) this.add(it.value);
    } else if (typeof (iterable as unknown as { [Symbol.iterator]?: () => globalThis.IterableIterator<T> })[Symbol.iterator] === 'function') {
      for (const item of iterable as unknown as globalThis.Iterable<T>) this.add(item);
    }
  }

  get count(): number {
    return this._data.length;
  }

  get size(): number {
    return this._data.length;
  }

  get iterator(): Iterator<T> {
    if (this._data.length === 0) return new SetIterator<T>([]);
    return new SetIterator<T>(this._data);
  }

  /** 是否为空（项目扩展，官方无此成员） */
  get isEmpty(): boolean {
    return this._data.length === 0;
  }

  [Symbol.iterator](): globalThis.IterableIterator<T> {
    return this._data.values();
  }

  /** 官方：返回值的 JavaScript 迭代器（不产生旧式 GoJS Iterator）。 */
  values(): globalThis.IterableIterator<T> {
    return this._data.values();
  }

  /** 官方：兼容 JS Set，产生值的 JavaScript 迭代器。 */
  keys(): globalThis.IterableIterator<T> {
    return this._data.values();
  }

  /** 官方：兼容 JS Set，产生 [value, value] 的 JavaScript 迭代器。 */
  entries(): globalThis.IterableIterator<[T, T]> {
    const out: [T, T][] = [];
    for (let i = 0; i < this._data.length; i++) out.push([this._data[i], this._data[i]]);
    return out.values();
  }

  /** 官方：`"Set()#" + __gohashid` */
  toString(): string {
    return 'Set()#' + hashIdOf(this);
  }

  /** 返回第一个元素（无则 null） */
  first(): T | null {
    return this._data.length > 0 ? this._data[0] : null;
  }

  /** 添加元素；null 被忽略（与官方一致）。 */
  add(item: T): this {
    if (item === null) return this;
    if (!this.contains(item)) {
      this._data.push(item);
    }
    return this;
  }

  /**
   * Adds all of the values of a collection to this Set.
   * @param coll - the collection of items to add; can be a GoJS Iterable or a JavaScript Iterable, including an Array
   * @returns This modified Set.
   */
  addAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): this {
    if (coll === null || coll === undefined) return this;
    if (Array.isArray(coll)) {
      for (const item of coll) this.add(item);
      return this;
    }
    if ('iterator' in (coll as Iterable<T>)) {
      const it = (coll as Iterable<T>).iterator;
      while (it.next()) this.add(it.value);
    } else if (typeof (coll as unknown as { [Symbol.iterator]?: () => globalThis.IterableIterator<T> })[Symbol.iterator] === 'function') {
      for (const item of coll as unknown as globalThis.Iterable<T>) this.add(item);
    }
    return this;
  }

  /** Returns whether the given value is in this Set. */
  contains(item: T): boolean {
    return this._indexOf(item) >= 0;
  }

  /**
   * Returns whether all of the values of a given collection are in this Set.
   * 官方：coll 为 null 时返回 true。
   */
  containsAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): boolean {
    if (coll === null || coll === undefined) return true;
    if (Array.isArray(coll)) {
      return coll.every(item => this.contains(item));
    }
    if ('iterator' in (coll as Iterable<T>)) {
      const it = (coll as Iterable<T>).iterator;
      while (it.next()) {
        if (!this.contains(it.value)) return false;
      }
      return true;
    }
    for (const item of coll as unknown as globalThis.Iterable<T>) {
      if (!this.contains(item as T)) return false;
    }
    return true;
  }

  /**
   * Returns whether any of the values of a given collection are in this Set.
   * 官方：coll 为 null 时返回 true。
   */
  containsAny(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): boolean {
    if (coll === null || coll === undefined) return true;
    if (Array.isArray(coll)) {
      return coll.some(item => this.contains(item));
    }
    if ('iterator' in (coll as Iterable<T>)) {
      const it = (coll as Iterable<T>).iterator;
      while (it.next()) {
        if (this.contains(it.value)) return true;
      }
      return false;
    }
    for (const item of coll as unknown as globalThis.Iterable<T>) {
      if (this.contains(item as T)) return true;
    }
    return false;
  }

  /** Removes all values of a given collection from this Set. 官方：null 直接返回。 */
  removeAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): this {
    if (coll === null || coll === undefined) return this;
    if (Array.isArray(coll)) {
      for (const item of coll) this.remove(item);
      return this;
    }
    if ('iterator' in (coll as Iterable<T>)) {
      const it = (coll as Iterable<T>).iterator;
      while (it.next()) {
        this.remove(it.value);
      }
      return this;
    }
    for (const item of coll as unknown as globalThis.Iterable<T>) {
      this.remove(item as T);
    }
    return this;
  }

  /** Removes all values that are not in the given collection. 官方：null 直接返回。 */
  retainAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): this {
    if (coll === null || coll === undefined) return this;
    if (this._data.length === 0) return this;
    const keep = new Set<T>();
    if (Array.isArray(coll)) {
      for (const item of coll) keep.add(item);
    } else if ('iterator' in (coll as Iterable<T>)) {
      const it = (coll as Iterable<T>).iterator;
      while (it.next()) keep.add(it.value);
    } else {
      for (const item of coll as unknown as globalThis.Iterable<T>) keep.add(item as T);
    }
    this._data = this._data.filter(item => keep.contains(item));
    return this;
  }

  /** Removes a value from this Set, if present. */
  remove(item: T): boolean {
    const idx = this._indexOf(item);
    if (idx >= 0) {
      this._data.splice(idx, 1);
      return true;
    }
    return false;
  }

  /** 删除元素（同 remove，ES Set 语义） */
  delete(item: T): boolean {
    return this.remove(item);
  }

  /** 是否包含元素 */
  has(item: T): boolean {
    return this.contains(item);
  }

  /** 清空 */
  clear(): this {
    this._data.length = 0;
    return this;
  }

  /** 转换为数组 */
  toArray(): T[] {
    return [...this._data];
  }

  /** 转换为官方 Set */
  toSet(): Set<T> {
    return this.copy();
  }

  /** 官方：转成 List（顺序未定义）。 */
  toList(): List<T> {
    const result = new List<T>();
    for (let i = 0; i < this._data.length; i++) result.add(this._data[i]);
    return result;
  }

  /** 遍历（官方：@param func a function to call for each value in the Set） */
  each(func: (item: T) => void): this {
    for (let i = 0; i < this._data.length; i++) {
      func(this._data[i]);
    }
    return this;
  }

  /** 官方 forEach(callbackFunc(value1, value2, map), thisArg) */
  forEach(callbackFunc: (value1: T, value2: T, map: Set<T>) => void, thisArg?: any): void {
    for (let i = 0; i < this._data.length; i++) {
      callbackFunc.call(thisArg, this._data[i], this._data[i], this);
    }
  }

  /** 映射（官方 map<S>(func): Set<S>） */
  map<U>(func: (item: T) => U): Set<U> {
    const result = new Set<U>();
    for (let i = 0; i < this._data.length; i++) {
      result.add(func(this._data[i]));
    }
    return result;
  }

  /** 过滤（官方 filter 返回 Set，不是 Iterator） */
  filter(func: (item: T) => boolean): Set<T> {
    const result = new Set<T>();
    for (let i = 0; i < this._data.length; i++) {
      if (func(this._data[i])) {
        result.add(this._data[i]);
      }
    }
    return result;
  }

  /** 任一元素满足条件 */
  any(pred: (item: T) => boolean): boolean {
    for (let i = 0; i < this._data.length; i++) {
      if (pred(this._data[i])) return true;
    }
    return false;
  }

  /** 所有元素满足条件 */
  all(func: (item: T) => boolean): boolean {
    for (let i = 0; i < this._data.length; i++) {
      if (!func(this._data[i])) return false;
    }
    return true;
  }

  /** 并集 */
  union(other: Set<T>): Set<T> {
    const result = this.copy();
    const it = other.iterator;
    while (it.next()) {
      result.add(it.value);
    }
    return result;
  }

  /** 交集 */
  intersect(other: Set<T>): Set<T> {
    const result = new Set<T>();
    const it = this.iterator;
    while (it.next()) {
      if (other.contains(it.value)) {
        result.add(it.value);
      }
    }
    return result;
  }

  /** 差集 */
  subtract(other: Set<T>): Set<T> {
    const result = new Set<T>();
    const it = this.iterator;
    while (it.next()) {
      if (!other.contains(it.value)) {
        result.add(it.value);
      }
    }
    return result;
  }

  /** 复制 */
  copy(): Set<T> {
    const result = new Set<T>();
    result._data = [...this._data];
    return result;
  }

  private _indexOf(item: T): number {
    for (let i = 0; i < this._data.length; i++) {
      const cur = this._data[i];
      if (cur === item || (cur !== cur && item !== item)) return i;
    }
    return -1;
  }

  // ============ 官方静态函数 ============

  /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
  static readonly className: string = 'Set';
}

/**
 * SetIterator（对齐官方 `class SetIterator`）
 *
 * 官方 next() 里 `key` 与 `value` 都是当前元素；first() 返回首个元素（不改 key/value）。
 */
export class SetIterator<T> implements Iterator<T> {
  static readonly className: string = "SetIterator";
  private _data: T[];
  private _index: number = -1;
  private _current: T | null = null;

  constructor(data: T[]) {
    this._data = data;
  }

  [Symbol.iterator](): globalThis.IterableIterator<T> {
    return this._data.values();
  }

  /** 官方：iterator 返回自身。 */
  get iterator(): SetIterator<T> {
    return this;
  }

  /** 官方 Set 迭代器的 key 与 value 相同，都是当前元素。 */
  get key(): T {
    return this._current as T;
  }

  get value(): T {
    return this._current as T;
  }

  next(): boolean {
    this._index++;
    if (this._index < this._data.length) {
      this._current = this._data[this._index];
      return true;
    }
    this._current = null;
    return false;
  }

  hasNext(): boolean {
    return this.next();
  }

  reset(): void {
    this._index = -1;
    this._current = null;
  }

  first(): T | null {
    if (this._data.length === 0) return null;
    this._index = 0;
    this._current = this._data[0];
    return this._current;
  }

  any(func: (item: T) => boolean): boolean {
    this.reset();
    for (let i = 0; i < this._data.length; i++) {
      if (func(this._data[i])) return true;
    }
    return false;
  }

  all(func: (item: T) => boolean): boolean {
    this.reset();
    for (let i = 0; i < this._data.length; i++) {
      if (!func(this._data[i])) return false;
    }
    return true;
  }

  each(func: (item: T) => void): SetIterator<T> {
    this.reset();
    for (let i = 0; i < this._data.length; i++) {
      func(this._data[i]);
    }
    return this;
  }

  /** 官方 Iterator.map 返回 List 的迭代器。 */
  map<U>(func: (item: T) => U): Iterator<U> {
    const l = new List<U>();
    for (let i = 0; i < this._data.length; i++) l.add(func(this._data[i]));
    return l.iterator;
  }

  /** 官方 Iterator.filter 返回 List 的迭代器。 */
  filter(func: (item: T) => boolean): Iterator<T> {
    const l = new List<T>();
    for (let i = 0; i < this._data.length; i++) {
      if (func(this._data[i])) l.add(this._data[i]);
    }
    return l.iterator;
  }

  get count(): number {
    return this._data.length;
  }

  toArray(): T[] {
    return [...this._data];
  }

  toString(): string {
    return 'SetIterator';
  }
}
