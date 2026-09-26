/**
 * 官方对齐的集合迭代接口（go.d.ts 331-500 行）
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
 */

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
 */
export interface IMapIterator<K, T> {
  iterator: IMapIterator<K, T>;
  next(): boolean;
  hasNext(): boolean;
  /** Advance to first item and return it, or null. */
  first(): T | null;
  reset(): void;
  any(pred: (x: T) => boolean): boolean;
  all(pred: (x: T) => boolean): boolean;
  each(func: (x: T) => void): void;
  map<S>(func: (x: T) => S): IMapIterator<K, S>;
  filter(pred: (x: T) => boolean): IMapIterator<K, T>;
  /** Gets the current value. */
  readonly value: T;
  /** Gets the current key. */
  readonly key: K;
  /** The total number of items in the iterated collection. */
  readonly count: number;
}
