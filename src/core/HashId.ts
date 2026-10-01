/**
 * 内部工具（非官方公开 API）：为集合类分配官方风格的 `__gohashid`。
 *
 * 官方在 List / Set / Map 的构造器里调用 `GSet.se(this)` 分配自增 id，
 * `toString()` 返回 `"List()#" + GSet.Cs(this)` 这样的形式。
 *
 * 这里的 id 属性设为**不可枚举**，避免影响 `toEqual` / `JSON.stringify`。
 */
let nextHashId = 1;

/** 给对象分配一个自增 id，返回该 id。 */
export function assignHashId(obj: object): number {
  const id = nextHashId++;
  Object.defineProperty(obj, '__gohashid', {
    value: id,
    enumerable: false,
    writable: false,
    configurable: true,
  });
  return id;
}

/** 读取对象的 `__gohashid`；没有则返回 0。 */
export function hashIdOf(obj: unknown): number {
  const id = (obj as { __gohashid?: number }).__gohashid;
  return id === undefined ? 0 : id;
}

/**
 * 读取对象的 `__gohashid`；若尚未分配则**按需分配**后返回。
 *
 * 对应官方 `GSet.ks(x)`：官方的 `GraphObject.toString()` 等用它，
 * 所以 id 是首次调用 `toString()` 时才出现的。
 */
export function ensureHashId(obj: object): number {
  const id = (obj as { __gohashid?: number }).__gohashid;
  if (typeof id === 'number') return id;
  return assignHashId(obj);
}

