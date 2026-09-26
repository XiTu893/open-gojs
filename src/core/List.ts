import { Iterable, Iterator } from './Iterable';
import { Set } from './Set';

/**
 * List - 有序列表（对齐官方 go.d.ts:672 class List<T> implements Iterable<T>）
 *
 * 官方 API:
 *   constructor(coll?: Iterable<T> | globalThis.Iterable<T>)
 *   add(val: T): this / push(val: T): void / addAll(coll): this
 *   contains(val) / has(val) / indexOf(val) / elt(i) / get(i) / setElt(i, val) / set(i, val)
 *   first(): T | null / last(): T | null / pop(): T | null
 *   any(pred) / all(pred) / each(func): this / map<S>(func): List<S> / filter(pred): List<T>
 *   insertAt(i, val) / remove(val): boolean / delete(val): boolean / removeAt(i): void
 *   removeRange(from, to): this / copy() / toArray() / toSet()
 *   sort(func) / sortRange(func, from?, to?) / reverse()
 *   count / size / length / iterator / iteratorBackwards / [Symbol.iterator]
 */
export class List<T> implements Iterable<T> {
  private _data: T[] = [];

  constructor(iterable?: Iterable<T> | T[] | globalThis.Iterable<T> | null) {
    if (iterable === null || iterable === undefined) return;
    if (Array.isArray(iterable)) {
      this._data = [...iterable];
      return;
    }
    if ('iterator' in (iterable as Iterable<T>)) {
      const it = (iterable as Iterable<T>).iterator;
      while (it.next()) {
        this._data.push(it.value);
      }
    } else if (typeof (iterable as unknown as { [Symbol.iterator]?: () => globalThis.IterableIterator<T> })[Symbol.iterator] === 'function') {
      for (const item of iterable as unknown as globalThis.Iterable<T>) this._data.push(item);
    }
  }

  /** This class implements the JavaScript Symbol.iterator. */
  [Symbol.iterator](): globalThis.IterableIterator<T> {
    return this._data.values();
  }

  toString(): string {
    return 'List()';
  }

  /** Adds a given value to the end of the List. */
  add(val: T): this {
    this._data.push(val);
    return this;
  }

  /** Adds a given value to the end of the List. */
  push(val: T): void {
    this._data.push(val);
  }

  /**
   * Adds all of the values of a collection to the end of this List.
   * @param coll - a GoJS Iterable or a JavaScript Iterable, including an Array
   */
  addAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): this {
    if (coll === null || coll === undefined) return this;
    if (Array.isArray(coll)) {
      for (const item of coll) this._data.push(item);
      return this;
    }
    if ('iterator' in (coll as Iterable<T>)) {
      const it = (coll as Iterable<T>).iterator;
      while (it.next()) this._data.push(it.value);
    } else {
      for (const item of coll as unknown as globalThis.Iterable<T>) {
        this._data.push(item as T);
      }
    }
    return this;
  }

  /** Clears the List; sets count to zero. */
  clear(): this {
    this._data.length = 0;
    return this;
  }

  /** Returns whether the given value is in this List. A synonym for has. */
  contains(val: T): boolean {
    return this._data.indexOf(val) !== -1;
  }

  /** 是否包含指定元素（同 contains） */
  has(val: T): boolean {
    return this._data.indexOf(val) !== -1;
  }

  /** Returns the index of the given value if it is in this List; -1 if not. */
  indexOf(val: T): number {
    return this._data.indexOf(val);
  }

  /** Returns the element at the given index. */
  elt(i: number): T {
    return this._data[i];
  }

  /** Returns the element at the given index. A synonym for elt. */
  get(index: number): T {
    return this._data[index];
  }

  /** Set the element at the given index to a given value. */
  setElt(i: number, val: T): void {
    this._data[i] = val;
  }

  /** Set the element at the given index to a given value. */
  set(index: number, val: T): void {
    this._data[index] = val;
  }

  /** Returns the first item in the list, or null if there is none. */
  first(): T | null {
    return this._data.length > 0 ? this._data[0] : null;
  }

  /** Returns the last item in the list, or null if there is none. */
  last(): T | null {
    return this._data.length > 0 ? this._data[this._data.length - 1] : null;
  }

  /** Returns the last item and removes it, or null if there is none. */
  pop(): T | null {
    const item = this._data.pop();
    return item === undefined ? null : item;
  }

  /** True if any invocation of pred is true. For an empty collection this returns false. */
  any(pred: (a: T) => boolean): boolean {
    for (let i = 0; i < this._data.length; i++) {
      if (pred(this._data[i])) return true;
    }
    return false;
  }

  /** True if all invocations of pred are true. For an empty collection returns true. */
  all(pred: (item: T) => boolean): boolean {
    for (let i = 0; i < this._data.length; i++) {
      if (!pred(this._data[i])) return false;
    }
    return true;
  }

  /** Call func on each item; returns this List. */
  each(func: (item: T) => void): this {
    for (let i = 0; i < this._data.length; i++) {
      func(this._data[i]);
    }
    return this;
  }

  /** 官方 map<S>(func): List<S> */
  map<U>(func: (item: T) => U): List<U> {
    const result = new List<U>();
    for (let i = 0; i < this._data.length; i++) {
      result.add(func(this._data[i]));
    }
    return result;
  }

  /** 官方 filter(pred): List<T> —— 返回 List，不是 Iterator */
  filter(pred: (item: T) => boolean): List<T> {
    const result = new List<T>();
    for (let i = 0; i < this._data.length; i++) {
      if (pred(this._data[i])) {
        result.add(this._data[i]);
      }
    }
    return result;
  }

  /** 在指定位置插入元素 */
  insertAt(i: number, val: T): void {
    if (i >= this._data.length) {
      this._data.push(val);
    } else {
      this._data.splice(i, 0, val);
    }
  }

  /** Removes a given value from the List. */
  remove(item: T): boolean {
    const idx = this._data.indexOf(item);
    if (idx >= 0) {
      this._data.splice(idx, 1);
      return true;
    }
    return false;
  }

  /** Removes a value (ES synonym for remove). */
  delete(val: T): boolean {
    return this.remove(val);
  }

  /** Removes the item at the given index. */
  removeAt(index: number): void {
    if (index >= 0 && index < this._data.length) {
      this._data.splice(index, 1);
    }
  }

  /** 移除第一个元素 */
  removeFirst(): T | null {
    return this._data.length > 0 ? this._data.shift() as T : null;
  }

  /** 移除最后一个元素 */
  removeLast(): T | null {
    return this._data.length > 0 ? this._data.pop() as T : null;
  }

  /** Removes a range of items from the list. */
  removeRange(from: number, to: number): this {
    const data = this._data;
    const len = this._data.length;
    if (from < 0) from = 0;
    else if (from >= this._data.length) return this;
    if (to < 0) return this;
    if (to >= this._data.length) to = this._data.length - 1;
    if (from > to) return this;
    let n = from;
    let o = to + 1;
    while (o < this._data.length) data[n++] = data[o++];
    data.length = this._data.length - (to - from + 1);
    return this;
  }


  /** 转换为数组 */
  toArray(): T[] {
    return [...this._data];
  }

  /** 转换为官方 Set */
  toSet(): Set<T> {
    const s = new Set<T>();
    for (const item of this._data) s.add(item);
    return s;
  }

  /** 排序 */
  sort(sortfunc?: (a: T, b: T) => number): this {
    this._data.sort(sortfunc);
    return this;
  }

  /** 反转 */
  reverse(): this {
    this._data.reverse();
    return this;
  }

  /** 复制 */
  copy(): List<T> {
    const result = new List<T>();
    result._data = [...this._data];
    return result;
  }

  get count(): number {
    return this._data.length;
  }

  get size(): number {
    return this._data.length;
  }

  get length(): number {
    return this._data.length;
  }

  get iterator(): Iterator<T> {
    return new ListIterator<T>(this._data);
  }

  get iteratorBackwards(): Iterator<T> {
    return new ListIteratorBackwards<T>(this._data);
  }
}

/**
 * ListIterator - List 的迭代器（对齐官方 ListIterator：first/any/all/each/map/filter/count/hasNext/key）
 */
export class ListIterator<T> implements Iterator<T> {
  private _data: T[];
  private _index: number = -1;

  constructor(data: T[]) {
    this._data = data;
  }

  /** 官方：iterator 返回自身 */
  get iterator(): ListIterator<T> {
    return this;
  }

  get value(): T {
    if (this._index >= 0 && this._index < this._data.length) {
      return this._data[this._index];
    }
    return null as unknown as T;
  }

  /** 当前索引（官方 key 类型为 any） */
  get key(): number {
    return this._index;
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

  any(pred: (item: T) => boolean): boolean {
    this._index = -1;
    for (let i = 0; i < this._data.length; i++) {
      if (pred(this._data[i])) return true;
    }
    return false;
  }

  all(pred: (item: T) => boolean): boolean {
    this._index = -1;
    for (let i = 0; i < this._data.length; i++) {
      if (!pred(this._data[i])) return false;
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

  map<S>(func: (item: T) => S): ListIterator<S> {
    this._index = -1;
    const out: S[] = [];
    for (let i = 0; i < this._data.length; i++) {
      out.push(func(this._data[i]));
    }
    const l = new List<S>();
    (l as unknown as { _data: S[] })._data = out;
    return new ListIterator<S>(out);
  }

  filter(pred: (item: T) => boolean): ListIterator<T> {
    this._index = -1;
    const out: T[] = [];
    for (let i = 0; i < this._data.length; i++) {
      if (pred(this._data[i])) out.push(this._data[i]);
    }
    return new ListIterator<T>(out);
  }

  get count(): number {
    return this._data.length;
  }

  toArray(): T[] {
    return [...this._data];
  }

  [Symbol.iterator](): globalThis.IterableIterator<T> {
    return this._data.values();
  }
}

/**
 * ListIteratorBackwards - 反向迭代器（官方 iteratorBackwards）
 */
export class ListIteratorBackwards<T> implements Iterator<T> {
  private _data: T[];
  private _index: number;

  constructor(data: T[]) {
    this._data = data;
    this._index = data.length;
  }

  get iterator(): ListIteratorBackwards<T> {
    return this;
  }

  get value(): T {
    if (this._index >= 0 && this._index < this._data.length) {
      return this._data[this._index];
    }
    return null as unknown as T;
  }

  get key(): number {
    return this._index;
  }

  next(): boolean {
    this._index--;
    return this._index >= 0;
  }

  hasNext(): boolean {
    return this._index - 1 >= 0;
  }

  reset(): void {
    this._index = this._data.length;
  }

  first(): T | null {
    const i = this._data.length - 1;
    this._index = i;
    return i >= 0 ? this._data[i] : null;
  }

  any(pred: (item: T) => boolean): boolean {
    this._index = this._data.length;
    for (let i = this._data.length - 1; i >= 0; i--) {
      if (pred(this._data[i])) return true;
    }
    return false;
  }

  all(pred: (item: T) => boolean): boolean {
    this._index = this._data.length;
    for (let i = this._data.length - 1; i >= 0; i--) {
      if (!pred(this._data[i])) return false;
    }
    return true;
  }

  each(func: (item: T) => void): this {
    this._index = this._data.length;
    for (let i = this._data.length - 1; i >= 0; i--) {
      func(this._data[i]);
    }
    return this;
  }

  map<S>(func: (item: T) => S): ListIterator<S> {
    const out: S[] = [];
    for (let i = this._data.length - 1; i >= 0; i--) {
      out.push(func(this._data[i]));
    }
    return new ListIterator<S>(out);
  }

  filter(pred: (item: T) => boolean): ListIterator<T> {
    const out: T[] = [];
    for (let i = this._data.length - 1; i >= 0; i--) {
      if (pred(this._data[i])) out.push(this._data[i]);
    }
    return new ListIterator<T>(out);
  }

  get count(): number {
    return this._data.length;
  }

  toArray(): T[] {
    return [...this._data];
  }

  [Symbol.iterator](): globalThis.IterableIterator<T> {
    return [...this._data].reverse().values();
  }
}
