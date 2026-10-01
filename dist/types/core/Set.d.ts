import { Iterable, Iterator } from './Iterable';
import { List } from './List';
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
export declare class Set<T> implements Iterable<T> {
    protected _data: T[];
    constructor(iterable?: Iterable<T> | T[] | globalThis.Iterable<T> | null);
    get count(): number;
    get size(): number;
    get iterator(): Iterator<T>;
    /** 是否为空（项目扩展，官方无此成员） */
    get isEmpty(): boolean;
    [Symbol.iterator](): globalThis.IterableIterator<T>;
    /** 官方：返回值的 JavaScript 迭代器（不产生旧式 GoJS Iterator）。 */
    values(): globalThis.IterableIterator<T>;
    /** 官方：兼容 JS Set，产生值的 JavaScript 迭代器。 */
    keys(): globalThis.IterableIterator<T>;
    /** 官方：兼容 JS Set，产生 [value, value] 的 JavaScript 迭代器。 */
    entries(): globalThis.IterableIterator<[T, T]>;
    /** 官方：`"Set()#" + __gohashid` */
    toString(): string;
    /** 返回第一个元素（无则 null） */
    first(): T | null;
    /** 添加元素；null 被忽略（与官方一致）。 */
    add(item: T): this;
    /**
     * Adds all of the values of a collection to this Set.
     * @param coll - the collection of items to add; can be a GoJS Iterable or a JavaScript Iterable, including an Array
     * @returns This modified Set.
     */
    addAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): this;
    /** Returns whether the given value is in this Set. */
    contains(item: T): boolean;
    /**
     * Returns whether all of the values of a given collection are in this Set.
     * 官方：coll 为 null 时返回 true。
     */
    containsAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): boolean;
    /**
     * Returns whether any of the values of a given collection are in this Set.
     * 官方：coll 为 null 时返回 true。
     */
    containsAny(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): boolean;
    /** Removes all values of a given collection from this Set. 官方：null 直接返回。 */
    removeAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): this;
    /** Removes all values that are not in the given collection. 官方：null 直接返回。 */
    retainAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): this;
    /** Removes a value from this Set, if present. */
    remove(item: T): boolean;
    /** 删除元素（同 remove，ES Set 语义） */
    delete(item: T): boolean;
    /** 是否包含元素 */
    has(item: T): boolean;
    /** 清空 */
    clear(): this;
    /** 转换为数组 */
    toArray(): T[];
    /** 转换为官方 Set */
    toSet(): Set<T>;
    /** 官方：转成 List（顺序未定义）。 */
    toList(): List<T>;
    /** 遍历（官方：@param func a function to call for each value in the Set） */
    each(func: (item: T) => void): this;
    /** 官方 forEach(callbackFunc(value1, value2, map), thisArg) */
    forEach(callbackFunc: (value1: T, value2: T, map: Set<T>) => void, thisArg?: any): void;
    /** 映射（官方 map<S>(func): Set<S>） */
    map<U>(func: (item: T) => U): Set<U>;
    /** 过滤（官方 filter 返回 Set，不是 Iterator） */
    filter(func: (item: T) => boolean): Set<T>;
    /** 任一元素满足条件 */
    any(pred: (item: T) => boolean): boolean;
    /** 所有元素满足条件 */
    all(func: (item: T) => boolean): boolean;
    /** 并集 */
    union(other: Set<T>): Set<T>;
    /** 交集 */
    intersect(other: Set<T>): Set<T>;
    /** 差集 */
    subtract(other: Set<T>): Set<T>;
    /** 复制 */
    copy(): Set<T>;
    private _indexOf;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
}
/**
 * SetIterator（对齐官方 `class SetIterator`）
 *
 * 官方 next() 里 `key` 与 `value` 都是当前元素；first() 返回首个元素（不改 key/value）。
 */
export declare class SetIterator<T> implements Iterator<T> {
    static readonly className: string;
    private _data;
    private _index;
    private _current;
    constructor(data: T[]);
    [Symbol.iterator](): globalThis.IterableIterator<T>;
    /** 官方：iterator 返回自身。 */
    get iterator(): SetIterator<T>;
    /** 官方 Set 迭代器的 key 与 value 相同，都是当前元素。 */
    get key(): T;
    get value(): T;
    next(): boolean;
    hasNext(): boolean;
    reset(): void;
    first(): T | null;
    any(func: (item: T) => boolean): boolean;
    all(func: (item: T) => boolean): boolean;
    each(func: (item: T) => void): SetIterator<T>;
    /** 官方 Iterator.map 返回 List 的迭代器。 */
    map<U>(func: (item: T) => U): Iterator<U>;
    /** 官方 Iterator.filter 返回 List 的迭代器。 */
    filter(func: (item: T) => boolean): Iterator<T>;
    get count(): number;
    toArray(): T[];
    toString(): string;
}
