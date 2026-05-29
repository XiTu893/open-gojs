import { describe, it, expect } from 'vitest';
import { List } from '../../src/core/List';

describe('List', () => {
  it('should create an empty list', () => {
    const list = new List<number>();
    expect(list.count).toBe(0);
    expect(list.isEmpty).toBe(true);
  });

  it('should add and get items', () => {
    const list = new List<number>();
    list.add(1).add(2).add(3);
    expect(list.count).toBe(3);
    expect(list.get(0)).toBe(1);
    expect(list.get(1)).toBe(2);
    expect(list.get(2)).toBe(3);
  });

  it('should remove items', () => {
    const list = new List<number>();
    list.add(1).add(2).add(3);
    expect(list.remove(2)).toBe(true);
    expect(list.count).toBe(2);
    expect(list.contains(2)).toBe(false);
  });

  it('should iterate', () => {
    const list = new List<number>();
    list.add(1).add(2).add(3);
    const items: number[] = [];
    const it = list.iterator;
    while (it.next()) {
      items.push(it.value);
    }
    expect(items).toEqual([1, 2, 3]);
  });

  it('should convert to array', () => {
    const list = new List<number>();
    list.add(1).add(2).add(3);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('should map', () => {
    const list = new List<number>();
    list.add(1).add(2).add(3);
    const mapped = list.map(x => x * 2);
    expect(mapped.toArray()).toEqual([2, 4, 6]);
  });

  it('should filter', () => {
    const list = new List<number>();
    list.add(1).add(2).add(3).add(4);
    const filtered = list.filter(x => x % 2 === 0);
    expect(filtered.toArray()).toEqual([2, 4]);
  });

  it('should copy', () => {
    const list = new List<number>();
    list.add(1).add(2);
    const copy = list.copy();
    copy.add(3);
    expect(list.count).toBe(2);
    expect(copy.count).toBe(3);
  });
});
