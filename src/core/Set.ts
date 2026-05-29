import { Iterable, Iterator } from './Iterable';

/**
 * Set - 无序集合
 */
export class Set<T> implements Iterable<T> {
  private _data: T[] = [];

  constructor(iterable?: Iterable<T> | T[]) {
    if (iterable) {
      if (Array.isArray(iterable)) {
        for (const item of iterable) {
          this.add(item);
        }
      } else if ('iterator' in iterable) {
        const it = iterable.iterator;
        while (it.next()) {
          this.add(it.value);
        }
      }
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

  /** 添加元素 */
  add(item: T): this {
    if (!this.contains(item)) {
      this._data.push(item);
    }
    return this;
  }

  /** 移除元素 */
  remove(item: T): boolean {
    const idx = this._indexOf(item);
    if (idx >= 0) {
      this._data.splice(idx, 1);
      return true;
    }
    return false;
  }

  /** 删除元素（同 remove） */
  delete(item: T): boolean {
    return this.remove(item);
  }

  /** 是否包含元素 */
  contains(item: T): boolean {
    return this._indexOf(item) >= 0;
  }

  /** 是否包含元素（同 contains） */
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

  /** 遍历 */
  each(func: (item: T) => void): this {
    for (let i = 0; i < this._data.length; i++) {
      func(this._data[i]);
    }
    return this;
  }

  /** 映射 */
  map<U>(func: (item: T) => U): Set<U> {
    const result = new Set<U>();
    for (let i = 0; i < this._data.length; i++) {
      result.add(func(this._data[i]));
    }
    return result;
  }

  /** 过滤 */
  filter(func: (item: T) => boolean): Set<T> {
    const result = new Set<T>();
    for (let i = 0; i < this._data.length; i++) {
      if (func(this._data[i])) {
        result.add(this._data[i]);
      }
    }
    return result;
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
 * SetIterator
 */
class SetIterator<T> implements Iterator<T> {
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
