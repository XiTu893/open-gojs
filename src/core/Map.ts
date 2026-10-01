import { Iterable, Iterator, IMapIterator } from './Iterable';
import { IKeyValuePair } from './IKeyValuePair';
import { List } from './List';
import { Set } from './Set';
import { assignHashId, hashIdOf } from './HashId';

/**
 * 官方内部 KeyValuePair（pretty 源码 `class KeyValuePair`），
 * `toString()` 为 `"{key:value}"`。
 *
 * 官方**不**把它暴露到 `go` 命名空间，因此这里也不导出。
 */
class KeyValuePair<K, V> implements IKeyValuePair<K, V> {
  key: K;
  value: V;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }

  toString(): string {
    return '{' + String(this.key) + ':' + String(this.value) + '}';
  }
}

/** 官方用原生 Map，键比较规则是 SameValueZero（NaN 等于 NaN）；这里在数组上模拟。 */
function sameKey(a: unknown, b: unknown): boolean {
  return a === b || (a !== a && b !== b);
}

/**
 * Map - 无序键值对集合（对齐官方 go.d.ts:1272 `class Map<K, V>`）
 *
 * 官方 Map **不** implements `Iterable<V>` —— 它的 first/each/any/all/map/filter
 * 收到的都是 `IKeyValuePair<K, V>`，迭代器是独立的 `IMapIterator<K, V>`。
 *
 * 官方 API：
 *   constructor(coll?)
 *   [Symbol.iterator]() / entries() / keys() / values() / toString()
 *   set(k,v) / add(k,v) / addAll(coll) / first() / any() / all() / each() / map() / filter()
 *   has(k) / contains(k) / get(k) / getValue(k) / delete(k) / remove(k) / clear()
 *   copy() / toArray() / toKeySet()
 *   count / size / iterator / iteratorKeys / iteratorValues / forEach
 */
export class Map<K, V> {
  private _keys: K[] = [];
  private _values: V[] = [];

  constructor(
    coll?: Iterable<IKeyValuePair<K, V>> | Array<IKeyValuePair<K, V>> | Map<K, V> | globalThis.Iterable<readonly [K, V]> | null,
  ) {
    assignHashId(this);
    if (coll !== undefined && coll !== null) this.addAll(coll);
  }

  // ============ 官方 ES 迭代 ============

  /** 官方：返回键值对的 JavaScript 迭代器。 */
  [Symbol.iterator](): globalThis.IterableIterator<[K, V]> {
    return this.entries();
  }

  /** 官方：返回键值对 ([key, value]) 的 JavaScript 迭代器。 */
  entries(): globalThis.IterableIterator<[K, V]> {
    const out: [K, V][] = [];
    for (let i = 0; i < this._keys.length; i++) out.push([this._keys[i], this._values[i]]);
    return out.values();
  }

  /** 官方：返回键的 JavaScript 迭代器。 */
  keys(): globalThis.IterableIterator<K> {
    return this._keys.values();
  }

  /** 官方：返回值的 JavaScript 迭代器。 */
  values(): globalThis.IterableIterator<V> {
    return this._values.values();
  }

  /** 官方：`"Map()#" + __gohashid` */
  toString(): string {
    return 'Map()#' + hashIdOf(this);
  }

  // ============ 官方增删改查 ============

  /** 添加/替换一个键值对，返回 this。 */
  set(key: K, val: V): this {
    const idx = this._indexOf(key);
    if (idx >= 0) this._values[idx] = val;
    else {
      this._keys.push(key);
      this._values.push(val);
    }
    return this;
  }

  /** set 的同义词（官方 add 返回 Map<K,V>）。 */
  add(key: K, val: V): this {
    return this.set(key, val);
  }

  /**
   * 批量添加键值对。
   * 若键已存在则替换其值。
   */
  addAll(
    coll: Iterable<IKeyValuePair<K, V>> | Array<IKeyValuePair<K, V>> | Map<K, V> | globalThis.Iterable<readonly [K, V]> | null,
  ): this {
    if (coll === null || coll === undefined) return this;
    if (coll instanceof Map) {
      for (let i = 0; i < coll._keys.length; i++) this.set(coll._keys[i], coll._values[i]);
      return this;
    }
    if (Array.isArray(coll)) {
      for (const e of coll as Array<IKeyValuePair<K, V> | readonly [K, V]>) {
        if (Array.isArray(e)) this.set((e as readonly [K, V])[0], (e as readonly [K, V])[1]);
        else this.set((e as IKeyValuePair<K, V>).key, (e as IKeyValuePair<K, V>).value);
      }
      return this;
    }
    if (typeof (coll as Iterable<IKeyValuePair<K, V>>).first === 'function') {
      const it = (coll as Iterable<IKeyValuePair<K, V>>).iterator;
      while (it.next()) this.set(it.value.key, it.value.value);
      return this;
    }
    for (const e of coll as globalThis.Iterable<readonly [K, V]>) {
      if (Array.isArray(e)) this.set((e as readonly [K, V])[0], (e as readonly [K, V])[1]);
      else {
        const p = e as unknown as IKeyValuePair<K, V>;
        this.set(p.key, p.value);
      }
    }
    return this;
  }

  /** Returns the first key/value pair, or null if there is none. */
  first(): IKeyValuePair<K, V> | null {
    if (this._keys.length === 0) return null;
    return new KeyValuePair(this._keys[0], this._values[0]);
  }

  /** True if any invocation of pred is true. Pred receives an IKeyValuePair. */
  any(pred: (a: IKeyValuePair<K, V>) => boolean): boolean {
    for (let i = 0; i < this._keys.length; i++) {
      if (pred(new KeyValuePair(this._keys[i], this._values[i]))) return true;
    }
    return false;
  }

  /** True if all invocations of pred are true; empty Map returns true. */
  all(pred: (a: IKeyValuePair<K, V>) => boolean): boolean {
    for (let i = 0; i < this._keys.length; i++) {
      if (!pred(new KeyValuePair(this._keys[i], this._values[i]))) return false;
    }
    return true;
  }

  /** Calls func on each key/value pair; returns this Map. */
  each(func: (a: IKeyValuePair<K, V>) => void): this {
    for (let i = 0; i < this._keys.length; i++) {
      func(new KeyValuePair(this._keys[i], this._values[i]));
    }
    return this;
  }

  /** Returns a new Map with the same keys but values produced by func. */
  map<S>(func: (a: IKeyValuePair<K, V>) => S): Map<K, S> {
    const result = new Map<K, S>();
    for (let i = 0; i < this._keys.length; i++) {
      const kvp = new KeyValuePair(this._keys[i], this._values[i]);
      result.set(kvp.key, func(kvp));
    }
    return result;
  }

  /** Returns a new Map containing only the pairs for which pred returns true. */
  filter(pred: (a: IKeyValuePair<K, V>) => boolean): Map<K, V> {
    const result = new Map<K, V>();
    for (let i = 0; i < this._keys.length; i++) {
      const kvp = new KeyValuePair(this._keys[i], this._values[i]);
      if (pred(kvp)) result.set(kvp.key, kvp.value);
    }
    return result;
  }

  /** Whether the given key is in this Map. */
  has(key: K): boolean {
    return this._indexOf(key) >= 0;
  }

  /** has 的同义词。 */
  contains(key: K): boolean {
    return this.has(key);
  }

  /** Returns the value for a key, or null if not present. */
  get(key: K): V | null {
    const idx = this._indexOf(key);
    return idx >= 0 ? this._values[idx] : null;
  }

  /** get 的同义词（官方 getValue 只接一个参数）。 */
  getValue(key: K, defaultValue?: V): V | null {
    const idx = this._indexOf(key);
    if (idx >= 0) return this._values[idx];
    return defaultValue === undefined ? null : defaultValue;
  }

  /** Removes a key if present; returns whether it was removed. */
  delete(key: K): boolean {
    const idx = this._indexOf(key);
    if (idx >= 0) {
      this._keys.splice(idx, 1);
      this._values.splice(idx, 1);
      return true;
    }
    return false;
  }

  /** delete 的同义词。 */
  remove(key: K): boolean {
    return this.delete(key);
  }

  /** Clears the Map. */
  clear(): this {
    this._keys.length = 0;
    this._values.length = 0;
    return this;
  }

  /** Returns a shallow copy of this Map. */
  copy(): Map<K, V> {
    const result = new Map<K, V>();
    result._keys = this._keys.slice();
    result._values = this._values.slice();
    return result;
  }

  /** Produces an Array of IKeyValuePair objects. */
  toArray(): Array<IKeyValuePair<K, V>> {
    const result: Array<IKeyValuePair<K, V>> = [];
    for (let i = 0; i < this._keys.length; i++) {
      result.push(new KeyValuePair(this._keys[i], this._values[i]));
    }
    return result;
  }

  /**
   * Produces a Set of the keys of this Map.
   *
   * 注意：官方返回的是**只读的实时视图**（内部类 `MapKeySet`），
   * 这里返回的是键的快照副本；本项目内没有依赖实时性的地方。
   */
  toKeySet(): Set<K> {
    const result = new Set<K>();
    for (let i = 0; i < this._keys.length; i++) result.add(this._keys[i]);
    return result;
  }

  /** The number of associations in the Map. */
  get count(): number {
    return this._keys.length;
  }

  /** The number of associations in the Map. */
  get size(): number {
    return this._keys.length;
  }

  /** Whether this Map is empty.（项目扩展，官方无此成员） */
  get isEmpty(): boolean {
    return this._keys.length === 0;
  }

  /** Gets an IMapIterator over the key/value pairs. */
  get iterator(): IMapIterator<K, V> {
    if (this._keys.length === 0) return new MapIterator<K, V>([], []);
    return new MapIterator<K, V>(this._keys, this._values);
  }

  /** Gets an Iterator over the keys. */
  get iteratorKeys(): Iterator<K> {
    return new MapKeyIterator<K>(this._keys);
  }

  /** Gets an Iterator over the values. */
  get iteratorValues(): Iterator<V> {
    return new MapValueIterator<V>(this._values);
  }

  /** Calls callback once per key/value pair. */
  forEach(callback: (value: V, key: K, map: Map<K, V>) => void, thisArg?: unknown): void {
    for (let i = 0; i < this._keys.length; i++) {
      callback.call(thisArg, this._values[i], this._keys[i], this);
    }
  }

  // ============ 项目扩展（官方无，但被本项目使用） ============

  /** 获取最后一个键值对。 */
  last(): IKeyValuePair<K, V> | null {
    const n = this._keys.length;
    if (n === 0) return null;
    return new KeyValuePair(this._keys[n - 1], this._values[n - 1]);
  }

  /** 转换为普通对象（仅 string/number 键）。 */
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

  // ============ 官方静态函数 ============

  /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
  static readonly className: string = 'Map';

  // ============ 内部 ============

  private _indexOf(key: K): number {
    for (let i = 0; i < this._keys.length; i++) {
      if (sameKey(this._keys[i], key)) return i;
    }
    return -1;
  }
}

/**
 * MapIterator - Map 的 IMapIterator（对齐官方 `class MapIterator`）
 *
 * first() 返回**键值对**，any/all/each/map/filter 的回调也收到键值对。
 */
class MapIterator<K, V> implements IMapIterator<K, V> {
  private _keys: K[];
  private _values: V[];
  private _index = -1;
  private _key: K | null = null;
  private _value: V | null = null;

  constructor(keys: K[], values: V[]) {
    this._keys = keys;
    this._values = values;
  }

  [Symbol.iterator](): globalThis.IterableIterator<[K, V]> {
    const out: [K, V][] = [];
    for (let i = 0; i < this._keys.length; i++) out.push([this._keys[i], this._values[i]]);
    return out.values();
  }

  /** 官方：iterator 返回自身。 */
  get iterator(): IMapIterator<K, V> {
    return this;
  }

  get key(): K {
    return this._key as K;
  }

  get value(): V {
    return this._value as V;
  }

  get count(): number {
    return this._keys.length;
  }

  next(): boolean {
    this._index++;
    if (this._index < this._keys.length) {
      this._key = this._keys[this._index];
      this._value = this._values[this._index];
      return true;
    }
    this._key = null;
    this._value = null;
    return false;
  }

  hasNext(): boolean {
    return this.next();
  }

  reset(): void {
    this._index = -1;
    this._key = null;
    this._value = null;
  }

  /** 官方：返回键值对，而不是值。 */
  first(): IKeyValuePair<K, V> | null {
    if (this._keys.length === 0) return null;
    this._index = 0;
    this._key = this._keys[0];
    this._value = this._values[0];
    return new KeyValuePair(this._key, this._value);
  }

  any(pred: (x: IKeyValuePair<K, V>) => boolean): boolean {
    this.reset();
    for (let i = 0; i < this._keys.length; i++) {
      if (pred(new KeyValuePair(this._keys[i], this._values[i]))) return true;
    }
    return false;
  }

  all(pred: (x: IKeyValuePair<K, V>) => boolean): boolean {
    this.reset();
    for (let i = 0; i < this._keys.length; i++) {
      if (!pred(new KeyValuePair(this._keys[i], this._values[i]))) return false;
    }
    return true;
  }

  each(func: (x: IKeyValuePair<K, V>) => void): MapIterator<K, V> {
    this.reset();
    for (let i = 0; i < this._keys.length; i++) {
      func(new KeyValuePair(this._keys[i], this._values[i]));
    }
    return this;
  }

  /** 官方 Iterator.map 返回 List 的迭代器。 */
  map<S>(func: (x: IKeyValuePair<K, V>) => S): Iterator<S> {
    const out = new List<S>();
    for (let i = 0; i < this._keys.length; i++) {
      out.add(func(new KeyValuePair(this._keys[i], this._values[i])));
    }
    return out.iterator;
  }

  /** 官方 Iterator.filter 返回 List 的迭代器（元素是键值对）。 */
  filter(pred: (x: IKeyValuePair<K, V>) => boolean): Iterator<IKeyValuePair<K, V>> {
    const out = new List<IKeyValuePair<K, V>>();
    for (let i = 0; i < this._keys.length; i++) {
      const kvp = new KeyValuePair(this._keys[i], this._values[i]);
      if (pred(kvp)) out.add(kvp);
    }
    return out.iterator;
  }

  toString(): string {
    return 'MapIterator';
  }
}

/**
 * MapKeyIterator - 只遍历键（官方 `MapKeySetIterator`）
 * 官方 key === value，两者都是当前键。
 */
class MapKeyIterator<K> implements Iterator<K> {
  private _keys: K[];
  private _index = -1;
  private _key: K | null = null;

  constructor(keys: K[]) {
    this._keys = keys;
  }

  [Symbol.iterator](): globalThis.IterableIterator<K> {
    return this._keys.values();
  }

  get iterator(): Iterator<K> {
    return this;
  }

  /** 官方 key 与 value 相同，都是当前键。 */
  get key(): K {
    return this._key as K;
  }

  get value(): K {
    return this._key as K;
  }

  get count(): number {
    return this._keys.length;
  }

  next(): boolean {
    this._index++;
    if (this._index < this._keys.length) {
      this._key = this._keys[this._index];
      return true;
    }
    this._key = null;
    return false;
  }

  hasNext(): boolean {
    return this.next();
  }

  reset(): void {
    this._index = -1;
    this._key = null;
  }

  first(): K | null {
    if (this._keys.length === 0) return null;
    this._index = 0;
    this._key = this._keys[0];
    return this._key;
  }

  any(pred: (x: K) => boolean): boolean {
    this.reset();
    for (let i = 0; i < this._keys.length; i++) {
      if (pred(this._keys[i])) return true;
    }
    return false;
  }

  all(pred: (x: K) => boolean): boolean {
    this.reset();
    for (let i = 0; i < this._keys.length; i++) {
      if (!pred(this._keys[i])) return false;
    }
    return true;
  }

  each(func: (x: K) => void): MapKeyIterator<K> {
    this.reset();
    for (let i = 0; i < this._keys.length; i++) func(this._keys[i]);
    return this;
  }

  map<S>(func: (x: K) => S): Iterator<S> {
    const out = new List<S>();
    for (let i = 0; i < this._keys.length; i++) out.add(func(this._keys[i]));
    return out.iterator;
  }

  filter(pred: (x: K) => boolean): Iterator<K> {
    const out = new List<K>();
    for (let i = 0; i < this._keys.length; i++) {
      if (pred(this._keys[i])) out.add(this._keys[i]);
    }
    return out.iterator;
  }

  toString(): string {
    return 'MapKeySetIterator';
  }
}

/**
 * MapValueIterator - 只遍历值（官方 `MapValueSetIterator`）
 * 官方 key === value，两者都是当前值。
 */
class MapValueIterator<V> implements Iterator<V> {
  private _values: V[];
  private _index = -1;
  private _value: V | null = null;

  constructor(values: V[]) {
    this._values = values;
  }

  [Symbol.iterator](): globalThis.IterableIterator<V> {
    return this._values.values();
  }

  get iterator(): Iterator<V> {
    return this;
  }

  get key(): V {
    return this._value as V;
  }

  get value(): V {
    return this._value as V;
  }

  get count(): number {
    return this._values.length;
  }

  next(): boolean {
    this._index++;
    if (this._index < this._values.length) {
      this._value = this._values[this._index];
      return true;
    }
    this._value = null;
    return false;
  }

  hasNext(): boolean {
    return this.next();
  }

  reset(): void {
    this._index = -1;
    this._value = null;
  }

  first(): V | null {
    if (this._values.length === 0) return null;
    this._index = 0;
    this._value = this._values[0];
    return this._value;
  }

  any(pred: (x: V) => boolean): boolean {
    this.reset();
    for (let i = 0; i < this._values.length; i++) {
      if (pred(this._values[i])) return true;
    }
    return false;
  }

  all(pred: (x: V) => boolean): boolean {
    this.reset();
    for (let i = 0; i < this._values.length; i++) {
      if (!pred(this._values[i])) return false;
    }
    return true;
  }

  each(func: (x: V) => void): MapValueIterator<V> {
    this.reset();
    for (let i = 0; i < this._values.length; i++) func(this._values[i]);
    return this;
  }

  map<S>(func: (x: V) => S): Iterator<S> {
    const out = new List<S>();
    for (let i = 0; i < this._values.length; i++) out.add(func(this._values[i]));
    return out.iterator;
  }

  filter(pred: (x: V) => boolean): Iterator<V> {
    const out = new List<V>();
    for (let i = 0; i < this._values.length; i++) {
      if (pred(this._values[i])) out.add(this._values[i]);
    }
    return out.iterator;
  }

  toString(): string {
    return 'MapValueSetIterator';
  }
}
