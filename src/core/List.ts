import { Iterable, Iterator } from './Iterable';

/**
 * List - 有序列表集合
 */
export class List<T> implements Iterable<T> {
  private _data: T[] = [];

  constructor(iterable?: Iterable<T> | T[]) {
    if (iterable) {
      if (Array.isArray(iterable)) {
        this._data = [...iterable];
      } else if ('iterator' in iterable) {
        const it = iterable.iterator;
        while (it.next()) {
          this._data.push(it.value);
        }
      }
    }
  }

  get count(): number {
    return this._data.length;
  }

  get length(): number {
    return this._data.length;
  }

  get size(): number {
    return this._data.length;
  }

  get iterator(): Iterator<T> {
    return new ListIterator<T>(this._data);
  }

  /** 是否为空 */
  get isEmpty(): boolean {
    return this._data.length === 0;
  }

  /** 获取第一个元素 */
  get first(): T | undefined {
    return this._data.length > 0 ? this._data[0] : undefined;
  }

  /** 获取最后一个元素 */
  get last(): T | undefined {
    return this._data.length > 0 ? this._data[this._data.length - 1] : undefined;
  }

  /** 添加元素到末尾 */
  add(item: T): this {
    this._data.push(item);
    return this;
  }

  addAll(coll: Iterable<T> | T[]): this {
    if (Array.isArray(coll)) {
      for (const item of coll) this._data.push(item);
    } else if ('iterator' in coll) {
      const it = coll.iterator;
      while (it.next()) {
        this._data.push(it.value);
      }
    }
    return this;
  }

  /** 在指定位置插入元素 */
  insert(index: number, item: T): this {
    this._data.splice(index, 0, item);
    return this;
  }

  /** 移除指定元素 */
  remove(item: T): boolean {
    const idx = this._data.indexOf(item);
    if (idx >= 0) {
      this._data.splice(idx, 1);
      return true;
    }
    return false;
  }

  /** 移除指定位置的元素 */
  removeAt(index: number): T | undefined {
    if (index >= 0 && index < this._data.length) {
      return this._data.splice(index, 1)[0];
    }
    return undefined;
  }

  /** 移除第一个元素 */
  removeFirst(): T | undefined {
    return this._data.shift();
  }

  /** 移除最后一个元素 */
  removeLast(): T | undefined {
    return this._data.pop();
  }

  /** 清空列表 */
  clear(): this {
    this._data.length = 0;
    return this;
  }

  /** 是否包含指定元素 */
  contains(item: T): boolean {
    return this._data.indexOf(item) >= 0;
  }

  /** 查找元素索引 */
  indexOf(item: T): number {
    return this._data.indexOf(item);
  }

  /** 获取指定位置的元素 */
  get(index: number): T | undefined {
    return this._data[index];
  }

  /** 设置指定位置的元素 */
  set(index: number, item: T): this {
    this._data[index] = item;
    return this;
  }

  /** 转换为数组 */
  toArray(): T[] {
    return [...this._data];
  }

  /** 遍历 */
  each(func: (item: T, index: number) => void): this {
    for (let i = 0; i < this._data.length; i++) {
      func(this._data[i], i);
    }
    return this;
  }

  /** 映射 */
  map<U>(func: (item: T, index: number) => U): List<U> {
    const result = new List<U>();
    for (let i = 0; i < this._data.length; i++) {
      result.add(func(this._data[i], i));
    }
    return result;
  }

  /** 过滤 */
  filter(func: (item: T, index: number) => boolean): List<T> {
    const result = new List<T>();
    for (let i = 0; i < this._data.length; i++) {
      if (func(this._data[i], i)) {
        result.add(this._data[i]);
      }
    }
    return result;
  }

  /** 排序 */
  sort(compare?: (a: T, b: T) => number): this {
    this._data.sort(compare);
    return this;
  }

  /** 反转 */
  reverse(): this {
    this._data.reverse();
    return this;
  }

  /** 复制 */
  copy(): List<T> {
    return new List<T>(this._data);
  }

  /** [Symbol.iterator] support - conditionally defined for ES6+ environments */
  [Symbol.iterator as any](): Iterator<T> {
    let index = 0;
    const data = this._data;
    return {
      next(): IteratorResult<T> {
        if (index < data.length) {
          return { value: data[index++], done: false };
        }
        return { value: undefined as any, done: true };
      },
    } as any;
  }
}

/**
 * ListIterator - List 的迭代器实现
 */
class ListIterator<T> implements Iterator<T> {
  private _data: T[];
  private _index: number = -1;

  constructor(data: T[]) {
    this._data = data;
  }

  get value(): T {
    if (this._index >= 0 && this._index < this._data.length) {
      return this._data[this._index];
    }
    throw new Error('Iterator is out of bounds');
  }

  next(): boolean {
    this._index++;
    return this._index < this._data.length;
  }

  reset(): void {
    this._index = -1;
  }

  toArray(): T[] {
    return [...this._data];
  }

  each(func: (item: T) => void): Iterator<T> {
    for (let i = 0; i < this._data.length; i++) {
      func(this._data[i]);
    }
    return this;
  }
}
