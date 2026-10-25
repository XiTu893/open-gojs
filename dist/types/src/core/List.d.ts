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
export declare class List<T> implements Iterable<T> {
    private _data;
    constructor(iterable?: Iterable<T> | T[] | globalThis.Iterable<T> | null);
    /** This class implements the JavaScript Symbol.iterator. */
    [Symbol.iterator](): globalThis.IterableIterator<T>;
    private _cursor;
    /** 推进到下一项；调用后才读 value。 */
    next(): boolean;
    /** next() 的同义词。 */
    hasNext(): boolean;
    /** 假定刚调用过 next() 且返回 true，取当前项。 */
    get value(): T;
    /** 当前下标；官方类型是 any。 */
    get key(): any;
    /** 重置光标，让这个 List 可以重新被当迭代器走一遍。 */
    reset(): void;
    /** 官方：`"List()#" + __gohashid` */
    toString(): string;
    /** Adds a given value to the end of the List. */
    add(val: T): this;
    /** Adds a given value to the end of the List. */
    push(val: T): void;
    /**
     * Adds all of the values of a collection to the end of this List.
     * @param coll - a GoJS Iterable or a JavaScript Iterable, including an Array
     */
    addAll(coll: Iterable<T> | T[] | globalThis.Iterable<T> | null): this;
    /** Clears the List; sets count to zero. */
    clear(): this;
    /** Returns whether the given value is in this List. A synonym for has. */
    contains(val: T): boolean;
    /** 是否包含指定元素（同 contains） */
    has(val: T): boolean;
    /** Returns the index of the given value if it is in this List; -1 if not. */
    indexOf(val: T): number;
    /** Returns the element at the given index. */
    elt(i: number): T;
    /** Returns the element at the given index. A synonym for elt. */
    get(index: number): T;
    /** Set the element at the given index to a given value. */
    setElt(i: number, val: T): void;
    /** Set the element at the given index to a given value. */
    set(index: number, val: T): void;
    /** Returns the first item in the list, or null if there is none. */
    first(): T | null;
    /** Returns the last item in the list, or null if there is none. */
    last(): T | null;
    /** Returns the last item and removes it, or null if there is none. */
    pop(): T | null;
    /** True if any invocation of pred is true. For an empty collection this returns false. */
    any(pred: (a: T) => boolean): boolean;
    /** True if all invocations of pred are true. For an empty collection returns true. */
    all(pred: (item: T) => boolean): boolean;
    /** Call func on each item; returns this List. */
    each(func: (item: T) => void): this;
    /** 官方 map<S>(func): List<S> */
    map<U>(func: (item: T) => U): List<U>;
    /** 官方 filter(pred): List<T> —— 返回 List，不是 Iterator */
    filter(pred: (item: T) => boolean): List<T>;
    /** 在指定位置插入元素 */
    insertAt(i: number, val: T): void;
    /** Removes a given value from the List. */
    remove(item: T): boolean;
    /** Removes a value (ES synonym for remove). */
    delete(val: T): boolean;
    /** Removes the item at the given index. */
    removeAt(index: number): void;
    /** 移除第一个元素 */
    removeFirst(): T | null;
    /** 移除最后一个元素 */
    removeLast(): T | null;
    /** Removes a range of items from the list. */
    removeRange(from: number, to: number): this;
    /** 转换为数组 */
    toArray(): T[];
    /** 转换为官方 Set */
    toSet(): Set<T>;
    /** 排序 */
    sort(sortfunc?: (a: T, b: T) => number): this;
    /**
     * 官方（未在主文档中记录）：对 `[from, to)` 区间排序。
     * @param sortfunc 比较函数
     * @param from 起始下标（含），默认 0
     * @param to 结束下标（**不含**），默认列表长度
     */
    sortRange(sortfunc: (a: T, b: T) => number, from?: number, to?: number): this;
    /** 反转 */
    reverse(): this;
    /** 复制 */
    copy(): List<T>;
    get count(): number;
    get size(): number;
    get length(): number;
    get iterator(): Iterator<T>;
    get iteratorBackwards(): Iterator<T>;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
}
/**
 * ListIterator - List 的迭代器（对齐官方 ListIterator：first/any/all/each/map/filter/count/hasNext/key）
 */
export declare class ListIterator<T> implements Iterator<T> {
    static readonly className: string;
    private _data;
    private _index;
    constructor(data: T[]);
    /** 官方：iterator 返回自身 */
    get iterator(): ListIterator<T>;
    get value(): T;
    /** 当前索引（官方 key 类型为 any） */
    get key(): number;
    next(): boolean;
    hasNext(): boolean;
    reset(): void;
    first(): T | null;
    any(pred: (item: T) => boolean): boolean;
    all(pred: (item: T) => boolean): boolean;
    each(func: (item: T) => void): this;
    map<S>(func: (item: T) => S): ListIterator<S>;
    filter(pred: (item: T) => boolean): ListIterator<T>;
    get count(): number;
    toArray(): T[];
    [Symbol.iterator](): globalThis.IterableIterator<T>;
}
/**
 * ListIteratorBackwards - 反向迭代器（官方 iteratorBackwards）
 */
export declare class ListIteratorBackwards<T> implements Iterator<T> {
    static readonly className: string;
    private _data;
    private _index;
    constructor(data: T[]);
    get iterator(): ListIteratorBackwards<T>;
    get value(): T;
    get key(): number;
    next(): boolean;
    hasNext(): boolean;
    reset(): void;
    first(): T | null;
    any(pred: (item: T) => boolean): boolean;
    all(pred: (item: T) => boolean): boolean;
    each(func: (item: T) => void): this;
    map<S>(func: (item: T) => S): ListIterator<S>;
    filter(pred: (item: T) => boolean): ListIterator<T>;
    get count(): number;
    toArray(): T[];
    [Symbol.iterator](): globalThis.IterableIterator<T>;
}
