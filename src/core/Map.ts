import { Iterable, Iterator, IMapIterator } from './Iterable';

/**
 * Map - 键值映射集合
 */
export class Map<K, V> implements Iterable<V> {
  private _keys: K[] = [];
  private _values: V[] = [];

  constructor(iterable?: Map<K, V> | Array<[K, V]>) {
    if (iterable) {
      if (iterable instanceof Map) {
        const it = iterable.iterator;
        while (it.next()) {
          this._keys.push((it as IMapIterator<K, V>).key);
          this._values.push(it.value);
        }
      } else if (Array.isArray(iterable)) {
        for (const [k, v] of iterable) {
          this.add(k, v);
        }
      }
    }
  }

  get count(): number {
    return this._keys.length;
  }

  get size(): number {
    return this._keys.length;
  }

  get iterator(): IMapIterator<K, V> {
    return new MapIterator<K, V>(this._keys, this._values);
  }

  /** 获取所有键 */
  get keys(): Iterator<K> {
    return new MapKeyIterator<K>(this._keys);
  }

  /** 获取所有值 */
  get values(): Iterator<V> {
    return new MapValueIterator<V>(this._values);
  }

  /** 是否为空 */
  get isEmpty(): boolean {
    return this._keys.length === 0;
  }

  /** 添加键值对 */
  add(key: K, value: V): V | undefined {
    const idx = this._indexOf(key);
    let oldValue: V | undefined = undefined;
    if (idx >= 0) {
      oldValue = this._values[idx];
      this._values[idx] = value;
    } else {
      this._keys.push(key);
      this._values.push(value);
    }
    return oldValue;
  }

  set(key: K, value: V): V | undefined {
    return this.add(key, value);
  }

  /** 获取值 */
  get(key: K): V | undefined {
    const idx = this._indexOf(key);
    return idx >= 0 ? this._values[idx] : undefined;
  }

  /** 获取值，带默认值 */
  getValue(key: K, defaultValue?: V): V | undefined {
    const idx = this._indexOf(key);
    return idx >= 0 ? this._values[idx] : defaultValue;
  }

  /** 是否包含键 */
  contains(key: K): boolean {
    return this._indexOf(key) >= 0;
  }

  /** 是否包含键（同 contains） */
  has(key: K): boolean {
    return this.contains(key);
  }

  /** 移除键值对 */
  remove(key: K): V | undefined {
    const idx = this._indexOf(key);
    if (idx >= 0) {
      const oldValue = this._values[idx];
      this._keys.splice(idx, 1);
      this._values.splice(idx, 1);
      return oldValue;
    }
    return undefined;
  }

  /** 清空 */
  clear(): this {
    this._keys.length = 0;
    this._values.length = 0;
    return this;
  }

  /** 转换为对象 */
  toObject(): Record<string, V> {
    const obj: Record<string, V> = {};
    for (let i = 0; i < this._keys.length; i++) {
      const key = this._keys[i];
      if (typeof key === 'string' || typeof key === 'number') {
        obj[String(key)] = this._values[i];
      }
    }
    return obj;
  }

  toArray(): { key: K; value: V }[] {
    const result: { key: K; value: V }[] = [];
    for (let i = 0; i < this._keys.length; i++) {
      result.push({ key: this._keys[i], value: this._values[i] });
    }
    return result;
  }

  /** 遍历 */
  each(func: (value: V, key: K) => void): this {
    for (let i = 0; i < this._keys.length; i++) {
      func(this._values[i], this._keys[i]);
    }
    return this;
  }

  /** 复制 */
  copy(): Map<K, V> {
    const result = new Map<K, V>();
    result._keys = [...this._keys];
    result._values = [...this._values];
    return result;
  }

  /** 获取第一个键值对 */
  first(): { key: K; value: V } | null {
    if (this._keys.length === 0) return null;
    return { key: this._keys[0], value: this._values[0] };
  }

  /** 获取最后一个键值对 */
  last(): { key: K; value: V } | null {
    if (this._keys.length === 0) return null;
    const idx = this._keys.length - 1;
    return { key: this._keys[idx], value: this._values[idx] };
  }

  /** 添加另一个 Map 的所有条目 */
  addAll(map: Map<K, V>): this {
    const it = map.iterator;
    while (it.next()) {
      this.add((it as IMapIterator<K, V>).key, it.value);
    }
    return this;
  }

  /** 查找键索引 */
  private _indexOf(key: K): number {
    for (let i = 0; i < this._keys.length; i++) {
      if (this._keys[i] === key) return i;
    }
    return -1;
  }
}

/**
 * MapIterator - Map 的迭代器
 */
class MapIterator<K, V> implements IMapIterator<K, V> {
  private _keys: K[];
  private _values: V[];
  private _index: number = -1;

  constructor(keys: K[], values: V[]) {
    this._keys = keys;
    this._values = values;
  }

  get key(): K {
    if (this._index >= 0 && this._index < this._keys.length) {
      return this._keys[this._index];
    }
    throw new Error('Iterator is out of bounds');
  }

  get value(): V {
    if (this._index >= 0 && this._index < this._values.length) {
      return this._values[this._index];
    }
    throw new Error('Iterator is out of bounds');
  }

  next(): boolean {
    this._index++;
    return this._index < this._keys.length;
  }

  reset(): void {
    this._index = -1;
  }

  toArray(): V[] {
    return [...this._values];
  }

  each(func: (item: V) => void): Iterator<V> {
    for (let i = 0; i < this._values.length; i++) {
      func(this._values[i]);
    }
    return this;
  }
}

class MapKeyIterator<K> implements Iterator<K> {
  private _keys: K[];
  private _index: number = -1;

  constructor(keys: K[]) {
    this._keys = keys;
  }

  get value(): K {
    if (this._index >= 0 && this._index < this._keys.length) {
      return this._keys[this._index];
    }
    throw new Error('Iterator is out of bounds');
  }

  next(): boolean {
    this._index++;
    return this._index < this._keys.length;
  }

  reset(): void {
    this._index = -1;
  }

  toArray(): K[] {
    return [...this._keys];
  }

  each(func: (item: K) => void): Iterator<K> {
    for (let i = 0; i < this._keys.length; i++) {
      func(this._keys[i]);
    }
    return this;
  }
}

class MapValueIterator<V> implements Iterator<V> {
  private _values: V[];
  private _index: number = -1;

  constructor(values: V[]) {
    this._values = values;
  }

  get value(): V {
    if (this._index >= 0 && this._index < this._values.length) {
      return this._values[this._index];
    }
    throw new Error('Iterator is out of bounds');
  }

  next(): boolean {
    this._index++;
    return this._index < this._values.length;
  }

  reset(): void {
    this._index = -1;
  }

  toArray(): V[] {
    return [...this._values];
  }

  each(func: (item: V) => void): Iterator<V> {
    for (let i = 0; i < this._values.length; i++) {
      func(this._values[i]);
    }
    return this;
  }
}
