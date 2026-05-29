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
});
