/**
 * 可迭代接口
 */
export interface Iterable<T> {
  /** 返回迭代器 */
  iterator: Iterator<T>;
  /** 集合大小 */
  readonly count: number;
}

/**
 * 迭代器接口
 */
export interface Iterator<T> {
  /** 是否有下一个元素 */
  next(): boolean;
  /** 当前元素值 */
  readonly value: T;
  /** 重置迭代器 */
  reset(): void;
  /** 转换为数组 */
  toArray(): T[];
  /** 遍历所有元素执行回调 */
  each(func: (item: T) => void): Iterator<T>;
}

/**
 * 键值对迭代器接口
 */
export interface IMapIterator<K, V> extends Iterator<V> {
  /** 当前键 */
  readonly key: K;
}
