import { describe, it, expect } from 'vitest';
import { Margin } from '../../src/core/Margin';

describe('Margin', () => {
  it('default constructor produces all-zero margins', () => {
    const m = new Margin();
    expect([m.top, m.right, m.bottom, m.left]).toEqual([0, 0, 0, 0]);
  });

  it('one argument applies to all four sides', () => {
    const m = new Margin(5);
    expect([m.top, m.right, m.bottom, m.left]).toEqual([5, 5, 5, 5]);
  });

  it('two arguments set top/bottom and right/left', () => {
    const m = new Margin(3, 4);
    expect([m.top, m.right, m.bottom, m.left]).toEqual([3, 4, 3, 4]);
  });

  it('four arguments set top/right/bottom/left', () => {
    const m = new Margin(1, 2, 3, 4);
    expect([m.top, m.right, m.bottom, m.left]).toEqual([1, 2, 3, 4]);
  });

  it('three arguments are rejected (official: 0, 1, 2 or 4)', () => {
    expect(() => new Margin(1, 2, 3)).toThrow();
  });

  it('setTo / set modify in place and return this', () => {
    const m = new Margin();
    expect(m.setTo(1, 2, 3, 4)).toBe(m);
    expect([m.top, m.right, m.bottom, m.left]).toEqual([1, 2, 3, 4]);
    const n = new Margin().set(new Margin(5, 6, 7, 8));
    expect([n.top, n.right, n.bottom, n.left]).toEqual([5, 6, 7, 8]);
  });

  it('copy produces an independent Margin', () => {
    const m = new Margin(1, 2, 3, 4);
    const c = m.copy();
    expect(c).not.toBe(m);
    c.top = 9;
    expect(m.top).toBe(1);
  });

  it('equals / equalTo / equalsApprox', () => {
    const m = new Margin(1, 2, 3, 4);
    expect(m.equals(new Margin(1, 2, 3, 4))).toBe(true);
    expect(m.equals(new Margin(1, 2, 3, 5))).toBe(false);
    expect(m.equalTo(1, 2, 3, 4)).toBe(true);
    expect(m.equalTo(1, 2, 3, 9)).toBe(false);
    expect(m.equalsApprox(new Margin(1.2, 2, 3, 4))).toBe(true);
    expect(m.equalsApprox(new Margin(1, 2, 3, 9))).toBe(false);
  });

  it('isReal rejects non-finite values', () => {
    expect(new Margin(1, 2, 3, 4).isReal()).toBe(true);
    expect(new Margin(NaN, 0, 0, 0).isReal()).toBe(false);
  });

  it('toString / parse / stringify round-trip', () => {
    const m = new Margin(1, 2, 3, 4);
    expect(m.toString()).toBe('Margin(1,2,3,4)');
    expect(Margin.className).toBe('Margin');
    expect(Margin.stringify(m)).toBe('1 2 3 4');
    expect(Margin.parse(Margin.stringify(m)).equals(m)).toBe(true);
    expect(Margin.stringifyFixed(1)(new Margin(1 / 3, 2, 3, 4))).toBe('0.3 2.0 3.0 4.0');
  });

  it('parse degrades gracefully for missing values', () => {
    expect(Margin.parse('').equals(new Margin())).toBe(true);
    expect(Margin.parse('5').equals(new Margin(5))).toBe(true);
    expect(Margin.parse('3 4').equals(new Margin(3, 4))).toBe(true);
    expect(Margin.parse('1 2 3').equals(new Margin(1, 2))).toBe(true);
  });

  it('freeze makes the Margin read-only', () => {
    const m = new Margin(1, 2, 3, 4);
    m.freeze();
    expect(m.isReadOnly).toBe(true);
    expect(() => m.setTo(0, 0, 0, 0)).toThrow();
    expect(Margin.Zero.isReadOnly).toBe(true);
    expect(Margin.Zero.equalTo(0, 0, 0, 0)).toBe(true);
  });

  it('isMargin type guard', () => {
    expect(Margin.isMargin(new Margin())).toBe(true);
    expect(Margin.isMargin(5)).toBe(false);
    expect(Margin.isMargin(null)).toBe(false);
  });
});
