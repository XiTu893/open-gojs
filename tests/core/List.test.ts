import { describe, it, expect } from 'vitest';
import { List } from '../../src/core/List';

describe('List', () => {
  it('should create an empty list', () => {
    const list = new List<number>();
    expect(list.count).toBe(0);
    expect(list.toArray()).toEqual([]);
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

  it('sortRange sorts [from, to) and leaves the rest alone', () => {
    const list = new List<number>();
    list.add(5).add(4).add(3).add(2).add(1);

    list.sortRange((a, b) => a - b, 1, 4);
    expect(list.toArray()).toEqual([5, 2, 3, 4, 1]);

    list.sortRange((a, b) => a - b);
    expect(list.toArray()).toEqual([1, 2, 3, 4, 5]);
  });

  it('sortRange handles the two-element fast path and no-op ranges', () => {
    const list = new List<number>();
    list.add(3).add(1).add(2);
    list.sortRange((a, b) => a - b, 0, 2);
    expect(list.toArray()).toEqual([1, 3, 2]);

    const same = new List<number>();
    same.add(1).add(2).add(3);
    same.sortRange((a, b) => a - b, 1, 1);
    expect(same.toArray()).toEqual([1, 2, 3]);
    same.sortRange((a, b) => a - b, 2, 0);
    expect(same.toArray()).toEqual([1, 2, 3]);
  });

  it('toString matches the official "List()#<id>" format', () => {
    const list = new List<number>();
    expect(list.toString()).toMatch(/^List\(\)#\d+$/);
    expect(List.className).toBe('List');
  });

  it('iteratorBackwards walks from the end to the start', () => {
    const list = new List<number>();
    list.add(1).add(2).add(3);
    const it = list.iteratorBackwards;
    const items: number[] = [];
    const keys: number[] = [];
    while (it.next()) {
      items.push(it.value);
      keys.push(it.key);
    }
    expect(items).toEqual([3, 2, 1]);
    expect(keys).toEqual([2, 1, 0]);
    expect(list.iteratorBackwards.first()).toBe(3);
    expect(new List<number>().iteratorBackwards.first()).toBeNull();
  });

  it('first / last / pop on empty and non-empty lists', () => {
    const list = new List<number>();
    expect(list.first()).toBeNull();
    expect(list.last()).toBeNull();
    expect(list.pop()).toBeNull();

    list.add(1).add(2);
    expect(list.first()).toBe(1);
    expect(list.last()).toBe(2);
    expect(list.pop()).toBe(2);
    expect(list.count).toBe(1);
  });

  it('removeRange removes an inclusive index range', () => {
    const list = new List<number>();
    list.add(1).add(2).add(3).add(4).add(5);
    list.removeRange(1, 3);
    expect(list.toArray()).toEqual([1, 5]);

    const unchanged = new List<number>();
    unchanged.add(1).add(2);
    unchanged.removeRange(3, 4);
    expect(unchanged.toArray()).toEqual([1, 2]);
    unchanged.removeRange(2, 1);
    expect(unchanged.toArray()).toEqual([1, 2]);
  });
});
