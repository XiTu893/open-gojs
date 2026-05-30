import { Iterable, Iterator } from './Iterable';
/**
 * List - 有序列表集合
 */
export declare class List<T> implements Iterable<T> {
    private _data;
    constructor(iterable?: Iterable<T> | T[]);
    get count(): number;
    get length(): number;
    get size(): number;
    get iterator(): Iterator<T>;
    /** 是否为空 */
    get isEmpty(): boolean;
    /** 获取第一个元素 */
    get first(): T | undefined;
    /** 获取最后一个元素 */
    get last(): T | undefined;
    /** 添加元素到末尾 */
    add(item: T): this;
    addAll(coll: Iterable<T> | T[]): this;
    /** 在指定位置插入元素 */
    insert(index: number, item: T): this;
    /** 移除指定元素 */
    remove(item: T): boolean;
    /** 移除指定位置的元素 */
    removeAt(index: number): T | undefined;
    /** 移除第一个元素 */
    removeFirst(): T | undefined;
    /** 移除最后一个元素 */
    removeLast(): T | undefined;
    /** 清空列表 */
    clear(): this;
    /** 是否包含指定元素 */
    contains(item: T): boolean;
    /** 查找元素索引 */
    indexOf(item: T): number;
    /** 获取指定位置的元素 */
    get(index: number): T | undefined;
    /** 设置指定位置的元素 */
    set(index: number, item: T): this;
    /** 转换为数组 */
    toArray(): T[];
    /** 遍历 */
    each(func: (item: T, index: number) => void): this;
    /** 映射 */
    map<U>(func: (item: T, index: number) => U): List<U>;
    /** 过滤 */
    filter(func: (item: T, index: number) => boolean): List<T>;
    /** 排序 */
    sort(compare?: (a: T, b: T) => number): this;
    /** 反转 */
    reverse(): this;
    /** 复制 */
    copy(): List<T>;
}
