import { describe, it, expect } from 'vitest';
import { Set } from '../../src/core/Set';

describe('Set', () => {
  it('should create an empty set', () => {
    const set = new Set<number>();
    expect(set.count).toBe(0);
    expect(set.isEmpty).toBe(true);
  });

  it('should add items without duplicates', () => {
    const set = new Set<number>();
    set.add(1).add(2).add(1).add(3);
    expect(set.count).toBe(3);
  });

  it('should remove items', () => {
    const set = new Set<number>();
    set.add(1).add(2).add(3);
    expect(set.remove(2)).toBe(true);
    expect(set.count).toBe(2);
    expect(set.contains(2)).toBe(false);
  });

  it('should check contains', () => {
    const set = new Set<number>();
    set.add(1).add(2);
    expect(set.contains(1)).toBe(true);
    expect(set.contains(3)).toBe(false);
  });

  it('should iterate', () => {
    const set = new Set<number>();
    set.add(1).add(2).add(3);
    const items: number[] = [];
    const it = set.iterator;
    while (it.next()) {
      items.push(it.value);
    }
    expect(items.sort()).toEqual([1, 2, 3]);
  });

  it('should union', () => {
    const s1 = new Set<number>();
    s1.add(1).add(2);
    const s2 = new Set<number>();
    s2.add(2).add(3);
    const result = s1.union(s2);
    expect(result.count).toBe(3);
  });

  it('should intersect', () => {
    const s1 = new Set<number>();
    s1.add(1).add(2);
    const s2 = new Set<number>();
    s2.add(2).add(3);
    const result = s1.intersect(s2);
    expect(result.count).toBe(1);
    expect(result.contains(2)).toBe(true);
  });

  it('provides JavaScript values/keys/entries iterators', () => {
    const set = new Set<number>();
    set.add(1).add(2);
    expect(Array.from(set)).toEqual([1, 2]);
    expect(Array.from(set.values())).toEqual([1, 2]);
    expect(Array.from(set.keys())).toEqual([1, 2]);
    expect(Array.from(set.entries())).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  it('toString matches the official "Set()#<id>" format', () => {
    const set = new Set<number>();
    expect(set.toString()).toMatch(/^Set\(\)#\d+$/);
    expect(Set.className).toBe('Set');
  });

  it('toList converts to a List', () => {
    const set = new Set<number>();
    set.add(1).add(2);
    const list = set.toList();
    expect(list.count).toBe(2);
    expect(list.contains(1)).toBe(true);
    expect(list.contains(2)).toBe(true);
  });

  it('follows official null handling', () => {
    const set = new Set<number>();
    set.add(null as unknown as number);
    expect(set.count).toBe(0);

    expect(set.addAll(null)).toBe(set);
    expect(set.removeAll(null)).toBe(set);
    expect(set.retainAll(null)).toBe(set);

    expect(set.containsAll(null)).toBe(true);
    expect(set.containsAny(null)).toBe(true);

    set.add(1);
    expect(set.containsAll([1])).toBe(true);
    expect(set.containsAll([1, 9])).toBe(false);
    expect(set.containsAny([9])).toBe(false);
    expect(set.containsAny([1, 9])).toBe(true);
  });

  it('retainAll keeps only the given values (array and GoJS iterable)', () => {
    const s1 = new Set<number>();
    s1.add(1).add(2).add(3);
    s1.retainAll([2, 3]);
    expect(s1.count).toBe(2);
    expect(s1.contains(2)).toBe(true);
    expect(s1.contains(1)).toBe(false);

    const keep = new Set<number>();
    keep.add(3);
    const s2 = new Set<number>();
    s2.add(1).add(2).add(3);
    s2.retainAll(keep);
    expect(s2.toArray()).toEqual([3]);
  });

  it('SetIterator exposes iterator/key/value like official', () => {
    const set = new Set<number>();
    set.add(10).add(20);
    const it = set.iterator;
    expect(it.iterator).toBe(it);
    expect(it.count).toBe(2);

    expect(it.next()).toBe(true);
    expect(it.value).toBe(10);
    expect(it.key).toBe(10);
    expect(it.next()).toBe(true);
    expect(it.value).toBe(20);
    expect(it.key).toBe(20);
    expect(it.next()).toBe(false);

    expect(it.first()).toBe(10);
    expect(set.iterator.first()).toBe(10);
    expect(new Set<number>().iterator.first()).toBeNull();
  });

  it('SetIterator map/filter produce List iterators', () => {
    const set = new Set<number>();
    set.add(1).add(2).add(3);

    const mapped = set.iterator.map(x => x * 10);
    expect(mapped.count).toBe(3);
    const out: number[] = [];
    while (mapped.next()) out.push(mapped.value);
    expect(out).toEqual([10, 20, 30]);

    const filtered = set.iterator.filter(x => x > 1);
    const out2: number[] = [];
    while (filtered.next()) out2.push(filtered.value);
    expect(out2).toEqual([2, 3]);
  });
});
