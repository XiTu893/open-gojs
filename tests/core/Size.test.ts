import { describe, it, expect } from 'vitest';
import { Size } from '../../src/core/Size';

describe('Size', () => {
  it('default constructor produces Size(0,0)', () => {
    const s = new Size();
    expect(s.width).toBe(0);
    expect(s.height).toBe(0);
  });

  it('two-argument constructor', () => {
    const s = new Size(3, 4);
    expect(s.width).toBe(3);
    expect(s.height).toBe(4);
  });

  it('rejects invalid or negative arguments (official: 0 or 2 non-negative numbers)', () => {
    expect(() => new Size(1)).toThrow();
    expect(() => new Size(-1, 2)).toThrow();
    expect(() => new Size(1, -2)).toThrow();
    expect(new Size(NaN, NaN).isReal()).toBe(false);
  });

  it('setTo / set modify in place and return this', () => {
    const s = new Size();
    expect(s.setTo(5, 6)).toBe(s);
    expect([s.width, s.height]).toEqual([5, 6]);
    const t = new Size().set(new Size(7, 8));
    expect([t.width, t.height]).toEqual([7, 8]);
  });

  it('width / height setters reject negatives', () => {
    const s = new Size(1, 1);
    expect(() => {
      s.width = -1;
    }).toThrow();
    expect(() => {
      s.height = -1;
    }).toThrow();
    s.width = 2;
    expect(s.width).toBe(2);
  });

  it('copy produces an independent Size', () => {
    const s = new Size(1, 2);
    const c = s.copy();
    expect(c).not.toBe(s);
    c.width = 9;
    expect(s.width).toBe(1);
  });

  it('equals / equalTo / equalsApprox', () => {
    const s = new Size(1, 2);
    expect(s.equals(new Size(1, 2))).toBe(true);
    expect(s.equals(new Size(1, 3))).toBe(false);
    expect(s.equalTo(1, 2)).toBe(true);
    expect(s.equalTo(1, 9)).toBe(false);
    expect(s.equalsApprox(new Size(1.4, 2))).toBe(true);
    expect(s.equalsApprox(new Size(1.6, 2))).toBe(false);
  });

  it('inflate changes width/height in place and clamps at zero', () => {
    const s = new Size(10, 10);
    expect(s.inflate(5, 5)).toBe(s);
    expect([s.width, s.height]).toEqual([15, 15]);
    s.inflate(-100, -100);
    expect([s.width, s.height]).toEqual([0, 0]);
  });

  it('isReal / isEmpty', () => {
    expect(new Size(1, 2).isReal()).toBe(true);
    expect(new Size(Infinity, 2).isReal()).toBe(false);
    expect(new Size(0, 5).isEmpty()).toBe(true);
    expect(new Size(5, 5).isEmpty()).toBe(false);
  });

  it('toString / parse / stringify round-trip', () => {
    const s = new Size(3, 4);
    expect(s.toString()).toBe('Size(3,4)');
    expect(Size.className).toBe('Size');
    expect(Size.stringify(s)).toBe('3 4');
    expect(Size.parse(Size.stringify(s)).equals(s)).toBe(true);
    expect(Size.parse('5').equals(new Size(5, 0))).toBe(true);
    expect(Size.parse('').equals(new Size(0, 0))).toBe(true);
    expect(Size.stringifyFixed(1)(new Size(1 / 3, 2))).toBe('0.3 2.0');
  });

  it('freeze makes the Size read-only', () => {
    const s = new Size(1, 2);
    s.freeze();
    expect(s.isReadOnly).toBe(true);
    expect(() => s.setTo(0, 0)).toThrow();
    expect(Size.Zero.isReadOnly).toBe(true);
    expect(Size.Zero.width).toBe(0);
    expect(Size.NaN.isReal()).toBe(false);
  });
});
