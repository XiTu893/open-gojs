/** 给对象分配一个自增 id，返回该 id。 */
export declare function assignHashId(obj: object): number;
/** 读取对象的 `__gohashid`；没有则返回 0。 */
export declare function hashIdOf(obj: unknown): number;
/**
 * 读取对象的 `__gohashid`；若尚未分配则**按需分配**后返回。
 *
 * 对应官方 `GSet.ks(x)`：官方的 `GraphObject.toString()` 等用它，
 * 所以 id 是首次调用 `toString()` 时才出现的。
 */
export declare function ensureHashId(obj: object): number;
