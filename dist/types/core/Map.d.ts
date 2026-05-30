import { Iterable, Iterator, IMapIterator } from './Iterable';
/**
 * Map - 键值映射集合
 */
export declare class Map<K, V> implements Iterable<V> {
    private _keys;
    private _values;
    constructor(iterable?: Map<K, V> | Array<[K, V]>);
    get count(): number;
    get size(): number;
    get iterator(): IMapIterator<K, V>;
    /** 获取所有键 */
    get keys(): Iterator<K>;
    /** 获取所有值 */
    get values(): Iterator<V>;
    /** 是否为空 */
    get isEmpty(): boolean;
    /** 添加键值对 */
    add(key: K, value: V): V | undefined;
    set(key: K, value: V): V | undefined;
    /** 获取值 */
    get(key: K): V | undefined;
    /** 获取值，带默认值 */
    getValue(key: K, defaultValue?: V): V | undefined;
    /** 是否包含键 */
    contains(key: K): boolean;
    /** 是否包含键（同 contains） */
    has(key: K): boolean;
    /** 移除键值对 */
    remove(key: K): V | undefined;
    /** 清空 */
    clear(): this;
    /** 转换为对象 */
    toObject(): Record<string, V>;
    toArray(): {
        key: K;
        value: V;
    }[];
    /** 遍历 */
    each(func: (value: V, key: K) => void): this;
    /** 复制 */
    copy(): Map<K, V>;
    /** 获取第一个键值对 */
    first(): {
        key: K;
        value: V;
    } | null;
    /** 获取最后一个键值对 */
    last(): {
        key: K;
        value: V;
    } | null;
    /** 添加另一个 Map 的所有条目 */
    addAll(map: Map<K, V>): this;
    /** 查找键索引 */
    private _indexOf;
}
