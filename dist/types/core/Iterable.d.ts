/**
 * 官方对齐的集合迭代接口（go.d.ts 331-533 行）
 *
 * 官方 Iterable:
 *   iterator: Iterator<T>
 *   [Symbol.iterator](): IterableIterator<T>
 *   first(): T | null
 *   readonly count: number
 *
 * 官方 Iterator<T> extends Iterable<T>:
 *   iterator: Iterator<T>        (返回自身)
 *   next(): boolean
 *   hasNext(): boolean
 *   first(): T | null
 *   reset(): void
 *   any(pred): boolean
 *   all(pred): boolean
 *   each(func): void
 *   map<S>(func): Iterator<S>
 *   filter(pred): Iterator<T>
 *   readonly value: T
 *   readonly key: any            (官方 key 就是 any)
 *   readonly count: number
 *
 * 官方 IMapIterator<K, T>（独立接口，**不**继承 Iterator）:
 *   first()/any/all/each/map/filter 的参数是 IKeyValuePair<K, T>，不是 T
 */
import { IKeyValuePair } from './IKeyValuePair';
/** 官方 Iterable<T>（go.d.ts:331） */
export interface Iterable<T> {
    /** Gets an Iterator that can iterate over the items in the collection. */
    iterator: Iterator<T>;
    [Symbol.iterator](): IterableIterator<T>;
    /** Returns the first item in the collection, or null if there is none. */
    first(): T | null;
    /** This read-only property is the number of elements in the collection. */
    readonly count: number;
}
/**
 * 官方 Iterator<T>（go.d.ts:379）
 * GoJS iteration is quite different than ECMAScript iteration.
 */
export interface Iterator<T> extends Iterable<T> {
    /** Returns itself, for code that expects an Iterable instead of an Iterator. */
    iterator: Iterator<T>;
    /**
     * Advance the iterator to the next item; call before accessing value.
     * @returns whether another item is available
     */
    next(): boolean;
    /** Advance to the next item; synonym for next(). */
    hasNext(): boolean;
    /** Advance to the first item and return it, or null. For Map iterators this returns a key/value pair. */
    first(): T | null;
    /** Start this iterator all over again. */
    reset(): void;
    /** True if any invocation of pred on items is true. Automatically resets. */
    any(pred: (x: T) => boolean): boolean;
    /** True if all invocations of pred on items are true. For an empty collection returns true. */
    all(pred: (x: T) => boolean): boolean;
    /** Call func on each item; returns void officially. Automatically resets. */
    each(func: (x: T) => void): void;
    /** Call func on each item and present the results in an iterator. */
    map<S>(func: (x: T) => S): Iterator<S>;
    /** Present each item for which pred returns true in an iterator. */
    filter(pred: (x: T) => boolean): Iterator<T>;
    /** Gets the current item, assuming next() has just returned true. */
    readonly value: T;
    /** Gets the current index; official type is any. */
    readonly key: any;
    /** The total number of items in the iterated collection. */
    readonly count: number;
}
/**
 * 官方 IMapIterator<K, T>（go.d.ts:489）
 * Iterating over a Map provides key and value, where value's type is T (not IKeyValuePair).
 *
 * 注意它**不继承** Iterator —— 谓词/回调收到的是 IKeyValuePair<K, T>，
 * first() 返回的也是 IKeyValuePair<K, T> | null。
 */
export interface IMapIterator<K, T> {
    /** {@inheritDoc Iterator.iterator} */
    iterator: IMapIterator<K, T>;
    /** {@inheritDoc Iterator.next} */
    next(): boolean;
    /** {@inheritDoc Iterator.hasNext} */
    hasNext(): boolean;
    /**
     * Advance if needed to the first item in the collection and return it, or return null if there is none.
     * Returns a *key/value pair*, not a *value*.
     */
    first(): IKeyValuePair<K, T> | null;
    /** {@inheritDoc Iterator.reset} */
    reset(): void;
    /** {@inheritDoc Iterator.any} */
    any(pred: (x: IKeyValuePair<K, T>) => boolean): boolean;
    /** {@inheritDoc Iterator.all} */
    all(pred: (x: IKeyValuePair<K, T>) => boolean): boolean;
    /** {@inheritDoc Iterator.each} */
    each(func: (x: IKeyValuePair<K, T>) => void): IMapIterator<K, T>;
    /** {@inheritDoc Iterator.map} */
    map<S>(func: (x: IKeyValuePair<K, T>) => S): Iterator<S>;
    /** {@inheritDoc Iterator.filter} */
    filter(pred: (x: IKeyValuePair<K, T>) => boolean): Iterator<IKeyValuePair<K, T>>;
    /** Gets the current value in the collection, assuming next() has just returned true. */
    readonly value: T;
    /** Gets the current key in the collection, assuming next() has just returned true. */
    readonly key: K;
    /** {@inheritDoc Iterator.count} */
    readonly count: number;
}
/**
 * 内部工具（非官方 API）：把一个 GoJS Iterator 收集成数组。
 * 官方 Iterator 没有 toArray() 方法，只能这样循环。
 */
export declare function iteratorToArray<T>(it: Iterator<T>): T[];
