import { Iterable, Iterator } from './Iterable';
import { List, ListIterator } from './List';

/**
 * Set - 无序集合（对齐官方 go.d.ts:1009 class Set<T> implements Iterable<T>）
 *
 * 官方 API:
 *   constructor(coll?: Iterable<T> | globalThis.Iterable<T>)
 *   add(val: T): this
 *   addAll(coll: Iterable<T> | globalThis.Iterable<T>): this
 *   contains(val: T): boolean   / has(val: T): boolean
 *   containsAll(coll): boolean  / containsAny(coll): boolean
 *   remove(val): boolean        / removeAll(coll): this
 *   retainAll(coll): this
 *   each(func): this            / map<S>(func): Set<S> / filter(pred): Set<T>
 *   any(pred) / all(pred) / first() / toArray() / toSet() / copy() / clear()
 *   count / size / iterator / [Symbol.iterator]
 */
export class Set<T> implements Iterable<T> {
  private _data: T[] = [];

  constructor(iterable?: Iterable<T> | T[] | globalThis.Iterable<T> | null) {
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
    return new SetIterator<T>(this._data);
  }

  get isEmpty(): boolean {
    return this._data.length === 0;
  }

  [Symbol.iterator](): globalThis.IterableIterator<T> {
    return this._data.values();
  }

  /** 返回第一个元素（无则 null） */
  first(): T | null {
    return this._data.length > 0 ? this._data[0] : null;
  }

  /** 添加元素 */
  add(item: T): this {
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
    }
    return this;
  }

  /** Returns whether the given value is in this Set. */
  contains(item: T): boolean {
    return this._indexOf(item) >= 0;
  }

  /**
   * Returns whether all of the values of a given collection are in this Set.
   * @param coll - the collection of items to check for.
   */
  containsAll(coll: Iterable<T> | T[] | globalThis.Iterable<T>): boolean {
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

  /** Returns whether any of the values of a given collection are in this Set. */
  containsAny(coll: Iterable<T> | T[] | globalThis.Iterable<T>): boolean {
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

  /** Removes all values of a given collection from this Set. */
  removeAll(coll: Iterable<T> | T[] | globalThis.Iterable<T>): this {
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
    }
    return this;
  }

  /** Removes all values that are not in the given collection. */
  retainAll(coll: Iterable<T> | T[] | globalThis.Iterable<T>): this {
    const keep: T[] = [];
    if (Array.isArray(coll)) {
      for (const item of this._data) {
        if (coll.indexOf(item) >= 0) keep.push(item);
      }
    } else if ('iterator' in (coll as Iterable<T>)) {
      const set = new Set<T>();
      const it = (coll as Iterable<T>).iterator;
      while (it.next()) {
        keep.push(it.value);
      }
      this._data = this._data.filter(item => keep.indexOf(item) >= 0);
    }
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
      if (this._data[i] === item) return i;
    }
    return -1;
  }
}

/**
 * SetIterator（对齐官方：first/any/all/each/map/filter/count/hasNext）
 */
export class SetIterator<T> implements Iterator<T> {
  private _data: T[];
  private _index: number = -1;

  constructor(data: T[]) {
    this._data = data;
  }

  get value(): T {
    if (this._index >= 0 && this._index < this._data.length) {
      return this._data[this._index];
    }
    return null as unknown as T;
  }

  next(): boolean {
    this._index++;
    return this._index < this._data.length;
  }

  hasNext(): boolean {
    return this.next();
  }

  reset(): void {
    this._index = -1;
  }

  first(): T | null {
    this._index = 0;
    return this._data.length > 0 ? this._data[0] : null;
  }

  any(func: (item: T) => boolean): boolean {
    this._index = -1;
    for (let i = 0; i < this._data.length; i++) {
      if (func(this._data[i])) return true;
    }
    return false;
  }

  all(func: (item: T) => boolean): boolean {
    this._index = -1;
    for (let i = 0; i < this._data.length; i++) {
      if (!func(this._data[i])) return false;
    }
    return true;
  }

  each(func: (item: T) => void): this {
    this._index = -1;
    for (let i = 0; i < this._data.length; i++) {
      func(this._data[i]);
    }
    return this;
  }

  map<U>(func: (item: T) => U): ListIterator<U> {
    const out: U[] = [];
    for (let i = 0; i < this._data.length; i++) {
      out.push(func(this._data[i]));
    }
    const l = new List<U>();
    (l as any)._data = out;
    return l.iterator as unknown as ListIterator<U>;
  }

  filter(func: (item: T) => boolean): ListIterator<T> {
    const out: T[] = [];
    for (let i = 0; i < this._data.length; i++) {
      if (func(this._data[i])) out.push(this._data[i]);
    }
    const l = new List<T>();
    (l as any)._data = out;
    return l.iterator as unknown as ListIterator<T>;
  }

  get count(): number {
    return this._data.length;
  }

  toArray(): T[] {
    return [...this._data];
  }
}
