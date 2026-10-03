import { describe, it, expect } from 'vitest';
import { Map } from '../../src/core/Map';
import { List } from '../../src/core/List';

describe('Map', () => {
  it('should create an empty map', () => {
    const map = new Map<string, number>();
    expect(map.count).toBe(0);
    expect(map.size).toBe(0);
    expect(map.isEmpty).toBe(true);
    expect(map.first()).toBeNull();
  });

  it('should add and get items (missing key returns null, like official)', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);
    expect(map.count).toBe(2);
    expect(map.get('a')).toBe(1);
    expect(map.get('b')).toBe(2);
    expect(map.get('c')).toBeNull();
    expect(map.getValue('c')).toBeNull();
    expect(map.getValue('c', 42)).toBe(42);
    expect(map.get('c')).toBeNull();
  });

  it('should update existing key without growing', () => {
    const map = new Map<string, number>();
    map.add('a', 1);
    map.add('a', 2);
    expect(map.count).toBe(1);
    expect(map.get('a')).toBe(2);
  });

  it('should remove items (delete and remove are synonyms)', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);
    expect(map.delete('a')).toBe(true);
    expect(map.delete('a')).toBe(false);
    expect(map.remove('b')).toBe(true);
    expect(map.count).toBe(0);
    expect(map.contains('a')).toBe(false);
  });

  it('should check contains / has', () => {
    const map = new Map<string, number>();
    map.add('a', 1);
    expect(map.contains('a')).toBe(true);
    expect(map.has('a')).toBe(true);
    expect(map.contains('b')).toBe(false);
    expect(map.has('b')).toBe(false);
  });

  it('should iterate with the GoJS iterator (key + value)', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);
    const items: { key: string; value: number }[] = [];
    const it = map.iterator;
    while (it.next()) {
      items.push({ key: it.key, value: it.value });
    }
    expect(items).toEqual([
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ]);
    expect(it.count).toBe(2);
  });

  it('MapIterator.first() returns a key/value pair, not a value', () => {
    const map = new Map<string, number>();
    expect(map.iterator.first()).toBeNull();
    map.add('a', 1).add('b', 2);
    const it = map.iterator;
    expect(it.first()).toEqual({ key: 'a', value: 1 });
    expect(it.value).toBe(1);
    expect(it.key).toBe('a');
    it.reset();
    expect(it.next()).toBe(true);
    expect(it.next()).toBe(true);
    expect(it.next()).toBe(false);
  });

  it('each / any / all receive an IKeyValuePair', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);

    const seen: string[] = [];
    expect(map.each(kvp => seen.push(kvp.key + '=' + kvp.value))).toBe(map);
    expect(seen).toEqual(['a=1', 'b=2']);

    expect(map.any(kvp => kvp.key === 'b')).toBe(true);
    expect(map.any(kvp => kvp.key === 'z')).toBe(false);
    expect(map.all(kvp => kvp.value > 0)).toBe(true);
    expect(map.all(kvp => kvp.value > 1)).toBe(false);
    expect(new Map<string, number>().all(() => false)).toBe(true);
    expect(new Map<string, number>().any(() => true)).toBe(false);
  });

  it('map / filter return new Maps (not Iterators)', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2).add('c', 3);

    const doubled = map.map(kvp => kvp.value * 2);
    expect(doubled instanceof Map).toBe(true);
    expect(doubled.count).toBe(3);
    expect(doubled.get('b')).toBe(4);

    const big = map.filter(kvp => kvp.value >= 2);
    expect(big instanceof Map).toBe(true);
    expect(big.count).toBe(2);
    expect(big.get('a')).toBeNull();
    expect(big.get('c')).toBe(3);
    expect(map.count).toBe(3);
  });

  it('iteratorKeys / iteratorValues iterate keys and values', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);

    const keys: string[] = [];
    const keyOf: string[] = [];
    const kit = map.iteratorKeys;
    while (kit.next()) {
      keys.push(kit.value);
      keyOf.push(kit.key);
    }
    expect(keys).toEqual(['a', 'b']);
    expect(keyOf).toEqual(['a', 'b']);

    const vals: number[] = [];
    const valKey: number[] = [];
    const vit = map.iteratorValues;
    while (vit.next()) {
      vals.push(vit.value);
      valKey.push(vit.key);
    }
    expect(vals).toEqual([1, 2]);
    expect(valKey).toEqual([1, 2]);
  });

  it('provides JavaScript entries/keys/values iterators', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);

    expect(Array.from(map)).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
    expect(Array.from(map.entries())).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
    expect(Array.from(map.keys())).toEqual(['a', 'b']);
    expect(Array.from(map.values())).toEqual([1, 2]);
  });

  it('forEach visits (value, key, map)', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);
    const seen: string[] = [];
    map.forEach((v, k, m) => seen.push(k + '=' + v + '/' + m.count));
    expect(seen).toEqual(['a=1/2', 'b=2/2']);
  });

  it('toString matches the official "Map()#<id>" format', () => {
    const map = new Map<string, number>();
    expect(map.toString()).toMatch(/^Map\(\)#\d+$/);
    expect(Map.className).toBe('Map');
  });

  it('uses SameValueZero for keys (NaN matches NaN)', () => {
    const map = new Map<number, string>();
    map.add(NaN, 'nan');
    expect(map.count).toBe(1);
    expect(map.has(NaN)).toBe(true);
    map.add(NaN, 'nan2');
    expect(map.count).toBe(1);
    expect(map.get(NaN)).toBe('nan2');
  });

  it('should copy', () => {
    const map = new Map<string, number>();
    map.add('a', 1);
    const copy = map.copy();
    copy.add('b', 2);
    expect(map.count).toBe(1);
    expect(copy.count).toBe(2);
  });

  it('addAll accepts pairs, tuples, arrays and GoJS iterables', () => {
    const a = new Map<string, number>();
    a.addAll([
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ]);
    expect(a.count).toBe(2);

    const b = new Map<string, number>();
    b.addAll([
      ['x', 9],
      ['y', 8],
    ] as Array<[string, number]>);
    expect(b.get('x')).toBe(9);

    const c = new Map<string, number>();
    c.addAll(a);
    expect(c.count).toBe(2);
    expect(c.get('a')).toBe(1);

    const d = new Map<string, number>();
    d.addAll(null);
    expect(d.count).toBe(0);
  });

  it('toArray returns key/value pairs and toKeySet returns the keys', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);
    expect(map.toArray()).toEqual([
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ]);
    const keys = map.toKeySet();
    expect(keys.count).toBe(2);
    expect(keys.contains('a')).toBe(true);
    expect(keys.contains('z')).toBe(false);
  });

  it('map.iterator returns an empty iterator for an empty map', () => {
    const map = new Map<string, number>();
    const it = map.iterator;
    expect(it.next()).toBe(false);
    expect(it.count).toBe(0);
    expect(it.first()).toBeNull();
    expect(map.iteratorKeys.next()).toBe(false);
    expect(map.iteratorValues.next()).toBe(false);
  });

  it('constructs from another Map and from a GoJS List of pairs', () => {
    const src = new Map<string, number>();
    src.add('a', 1);
    const copy = new Map(src);
    expect(copy.count).toBe(1);
    expect(copy.get('a')).toBe(1);

    const pairs = new List<{ key: string; value: number }>();
    pairs.add({ key: 'p', value: 7 });
    const fromList = new Map(pairs);
    expect(fromList.get('p')).toBe(7);
  });
});
