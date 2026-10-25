import { Iterable, Iterator, IMapIterator } from './Iterable';
import { IKeyValuePair } from './IKeyValuePair';
import { Set } from './Set';
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
export declare class Map<K, V> {
    private _keys;
    private _values;
    constructor(coll?: Iterable<IKeyValuePair<K, V>> | Array<IKeyValuePair<K, V>> | Map<K, V> | globalThis.Iterable<readonly [K, V]> | null);
    /** 官方：返回键值对的 JavaScript 迭代器。 */
    [Symbol.iterator](): globalThis.IterableIterator<[K, V]>;
    /** 官方：返回键值对 ([key, value]) 的 JavaScript 迭代器。 */
    entries(): globalThis.IterableIterator<[K, V]>;
    /** 官方：返回键的 JavaScript 迭代器。 */
    keys(): globalThis.IterableIterator<K>;
    /** 官方：返回值的 JavaScript 迭代器。 */
    values(): globalThis.IterableIterator<V>;
    /** 官方：`"Map()#" + __gohashid` */
    toString(): string;
    /** 添加/替换一个键值对，返回 this。 */
    set(key: K, val: V): this;
    /** set 的同义词（官方 add 返回 Map<K,V>）。 */
    add(key: K, val: V): this;
    /**
     * 批量添加键值对。
     * 若键已存在则替换其值。
     */
    addAll(coll: Iterable<IKeyValuePair<K, V>> | Array<IKeyValuePair<K, V>> | Map<K, V> | globalThis.Iterable<readonly [K, V]> | null): this;
    /** Returns the first key/value pair, or null if there is none. */
    first(): IKeyValuePair<K, V> | null;
    /** True if any invocation of pred is true. Pred receives an IKeyValuePair. */
    any(pred: (a: IKeyValuePair<K, V>) => boolean): boolean;
    /** True if all invocations of pred are true; empty Map returns true. */
    all(pred: (a: IKeyValuePair<K, V>) => boolean): boolean;
    /** Calls func on each key/value pair; returns this Map. */
    each(func: (a: IKeyValuePair<K, V>) => void): this;
    /** Returns a new Map with the same keys but values produced by func. */
    map<S>(func: (a: IKeyValuePair<K, V>) => S): Map<K, S>;
    /** Returns a new Map containing only the pairs for which pred returns true. */
    filter(pred: (a: IKeyValuePair<K, V>) => boolean): Map<K, V>;
    /** Whether the given key is in this Map. */
    has(key: K): boolean;
    /** has 的同义词。 */
    contains(key: K): boolean;
    /** Returns the value for a key, or null if not present. */
    get(key: K): V | null;
    /** get 的同义词（官方 getValue 只接一个参数）。 */
    getValue(key: K, defaultValue?: V): V | null;
    /** Removes a key if present; returns whether it was removed. */
    delete(key: K): boolean;
    /** delete 的同义词。 */
    remove(key: K): boolean;
    /** Clears the Map. */
    clear(): this;
    /** Returns a shallow copy of this Map. */
    copy(): Map<K, V>;
    /** Produces an Array of IKeyValuePair objects. */
    toArray(): Array<IKeyValuePair<K, V>>;
    /**
     * Produces a Set of the keys of this Map.
     *
     * 注意：官方返回的是**只读的实时视图**（内部类 `MapKeySet`），
     * 这里返回的是键的快照副本；本项目内没有依赖实时性的地方。
     */
    toKeySet(): Set<K>;
    /** The number of associations in the Map. */
    get count(): number;
    /** The number of associations in the Map. */
    get size(): number;
    /** Whether this Map is empty.（项目扩展，官方无此成员） */
    get isEmpty(): boolean;
    /** Gets an IMapIterator over the key/value pairs. */
    get iterator(): IMapIterator<K, V>;
    /** Gets an Iterator over the keys. */
    get iteratorKeys(): Iterator<K>;
    /** Gets an Iterator over the values. */
    get iteratorValues(): Iterator<V>;
    /** Calls callback once per key/value pair. */
    forEach(callback: (value: V, key: K, map: Map<K, V>) => void, thisArg?: unknown): void;
    /** 获取最后一个键值对。 */
    last(): IKeyValuePair<K, V> | null;
    /** 转换为普通对象（仅 string/number 键）。 */
    toObject(): Record<string, V>;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    private _indexOf;
}
