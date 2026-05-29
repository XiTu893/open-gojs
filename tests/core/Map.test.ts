import { describe, it, expect } from 'vitest';
import { Map } from '../../src/core/Map';

describe('Map', () => {
  it('should create an empty map', () => {
    const map = new Map<string, number>();
    expect(map.count).toBe(0);
    expect(map.isEmpty).toBe(true);
  });

  it('should add and get items', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);
    expect(map.count).toBe(2);
    expect(map.get('a')).toBe(1);
    expect(map.get('b')).toBe(2);
    expect(map.get('c')).toBeUndefined();
  });

  it('should update existing key', () => {
    const map = new Map<string, number>();
    map.add('a', 1);
    map.add('a', 2);
    expect(map.count).toBe(1);
    expect(map.get('a')).toBe(2);
  });

  it('should remove items', () => {
    const map = new Map<string, number>();
    map.add('a', 1).add('b', 2);
    expect(map.remove('a')).toBe(true);
    expect(map.count).toBe(1);
    expect(map.contains('a')).toBe(false);
  });

  it('should check contains', () => {
    const map = new Map<string, number>();
    map.add('a', 1);
    expect(map.contains('a')).toBe(true);
    expect(map.contains('b')).toBe(false);
  });

  it('should iterate', () => {
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
  });

  it('should copy', () => {
    const map = new Map<string, number>();
    map.add('a', 1);
    const copy = map.copy();
    copy.add('b', 2);
    expect(map.count).toBe(1);
    expect(copy.count).toBe(2);
  });
});
