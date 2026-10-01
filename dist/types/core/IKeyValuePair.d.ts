/**
 * 官方 IKeyValuePair<K, V>（go.d.ts:538）
 * A (key, value) pair, used in {@link Map}s.
 */
export interface IKeyValuePair<K, V> {
    /**
     * Gets a key for a value in a Map.
     * @returns the key uniquely identifying a value in a Map.
     */
    readonly key: K;
    /**
     * Gets a value in a Map.
     * @returns a value in a Map corresponding to a key.
     */
    readonly value: V;
}
