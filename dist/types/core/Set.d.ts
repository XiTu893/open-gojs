import { Iterable, Iterator } from './Iterable';
/**
 * Set - 无序集合
 */
export declare class Set<T> implements Iterable<T> {
    private _data;
    constructor(iterable?: Iterable<T> | T[]);
    get count(): number;
    get size(): number;
    get iterator(): Iterator<T>;
    get isEmpty(): boolean;
    /** 添加元素 */
    add(item: T): this;
    /** 移除元素 */
    remove(item: T): boolean;
    /** 删除元素（同 remove） */
    delete(item: T): boolean;
    /** 是否包含元素 */
    contains(item: T): boolean;
    /** 是否包含元素（同 contains） */
    has(item: T): boolean;
    /** 清空 */
    clear(): this;
    /** 转换为数组 */
    toArray(): T[];
    /** 遍历 */
    each(func: (item: T) => void): this;
    /** 映射 */
    map<U>(func: (item: T) => U): Set<U>;
    /** 过滤 */
    filter(func: (item: T) => boolean): Set<T>;
    /** 并集 */
    union(other: Set<T>): Set<T>;
    /** 交集 */
    intersect(other: Set<T>): Set<T>;
    /** 差集 */
    subtract(other: Set<T>): Set<T>;
    /** 复制 */
    copy(): Set<T>;
    private _indexOf;
}
