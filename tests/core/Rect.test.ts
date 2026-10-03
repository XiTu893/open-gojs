import { describe, it, expect } from 'vitest';
import { Rect } from '../../src/core/Rect';
import { Point } from '../../src/core/Point';
import { Size } from '../../src/core/Size';
import { Margin } from '../../src/core/Margin';
import { Spot } from '../../src/core/Spot';

describe('Rect', () => {
  it('default constructor produces the empty Rect', () => {
    const r = new Rect();
    expect(r.x).toBe(0);
    expect(r.y).toBe(0);
    expect(r.width).toBe(0);
    expect(r.height).toBe(0);
  });

  it('four-number constructor', () => {
    const r = new Rect(1, 2, 3, 4);
    expect([r.x, r.y, r.width, r.height]).toEqual([1, 2, 3, 4]);
  });

  it('Point+Size and Point+Point constructors', () => {
    const a = new Rect(new Point(1, 2), new Size(3, 4));
    expect([a.x, a.y, a.width, a.height]).toEqual([1, 2, 3, 4]);
    const b = new Rect(new Point(5, 9), new Point(1, 2));
    expect([b.x, b.y, b.width, b.height]).toEqual([1, 2, 4, 7]);
  });

  it('rejects invalid constructor arguments', () => {
    expect(() => new Rect('a' as any)).toThrow();
    expect(() => new Rect(1, 2, -1, 4)).toThrow();
  });

  it('setTo / set / setPoint / setSize modify in place', () => {
    const r = new Rect();
    expect(r.setTo(1, 2, 3, 4)).toBe(r);
    expect([r.x, r.y, r.width, r.height]).toEqual([1, 2, 3, 4]);
    r.set(new Rect(5, 6, 7, 8));
    expect([r.x, r.y, r.width, r.height]).toEqual([5, 6, 7, 8]);
    r.setPoint(new Point(9, 10));
    expect([r.x, r.y]).toEqual([9, 10]);
    r.setSize(new Size(11, 12));
    expect([r.width, r.height]).toEqual([11, 12]);
  });

  it('exposes edges, center, position and size', () => {
    const r = new Rect(10, 20, 30, 40);
    expect([r.left, r.top, r.right, r.bottom]).toEqual([10, 20, 40, 60]);
    expect(r.center.x).toBe(25);
    expect(r.center.y).toBe(40);
    expect(r.position.x).toBe(10);
    expect(r.position.y).toBe(20);
    expect(r.size.width).toBe(30);
    expect(r.size.height).toBe(40);
    r.center = new Point(0, 0);
    expect([r.x, r.y]).toEqual([-15, -20]);
  });

  it('containsPoint / containsRect / contains', () => {
    const r = new Rect(0, 0, 10, 10);
    expect(r.containsPoint(new Point(5, 5))).toBe(true);
    expect(r.containsPoint(new Point(15, 15))).toBe(false);
    expect(r.containsRect(new Rect(1, 1, 8, 8))).toBe(true);
    expect(r.containsRect(new Rect(5, 5, 8, 8))).toBe(false);
    expect(r.contains(5, 5)).toBe(true);
    expect(r.contains(5, 5, 10, 10)).toBe(false);
    expect(Rect.contains(0, 0, 10, 10, 5, 5)).toBe(true);
  });

  it('offset is in place', () => {
    const r = new Rect(0, 0, 10, 10);
    expect(r.offset(5, 5)).toBe(r);
    expect([r.x, r.y]).toEqual([5, 5]);
    expect([r.width, r.height]).toEqual([10, 10]);
  });

  it('inflate(w, h) grows all four sides in place', () => {
    const r = new Rect(10, 10, 20, 20);
    expect(r.inflate(5, 5)).toBe(r);
    expect([r.x, r.y, r.width, r.height]).toEqual([5, 5, 30, 30]);
  });

  it('inflate with a large negative amount clamps to zero keeping the center', () => {
    const r = new Rect(10, 10, 20, 20);
    r.inflate(-100, -100);
    expect(r.width).toBe(0);
    expect(r.height).toBe(0);
    expect(r.x).toBe(20);
    expect(r.y).toBe(20);
  });

  it('addMargin / subtractMargin / grow', () => {
    const r = new Rect(10, 10, 20, 20);
    r.addMargin(new Margin(1, 2, 3, 4));
    expect([r.x, r.y, r.width, r.height]).toEqual([6, 9, 26, 24]);
    r.subtractMargin(new Margin(1, 2, 3, 4));
    expect([r.x, r.y, r.width, r.height]).toEqual([10, 10, 20, 20]);
    r.grow(1, 2, 3, 4);
    expect([r.x, r.y, r.width, r.height]).toEqual([6, 9, 26, 24]);
  });

  it('intersectRect / intersect produce the intersection in place', () => {
    const r1 = new Rect(0, 0, 10, 10);
    expect(r1.intersectRect(new Rect(5, 5, 10, 10))).toBe(r1);
    expect([r1.x, r1.y, r1.width, r1.height]).toEqual([5, 5, 5, 5]);
    const r2 = new Rect(0, 0, 10, 10);
    r2.intersect(5, 5, 10, 10);
    expect([r2.x, r2.y, r2.width, r2.height]).toEqual([5, 5, 5, 5]);
  });

  it('intersect of disjoint rects yields an empty rect', () => {
    const r = new Rect(0, 0, 10, 10).intersectRect(new Rect(20, 20, 10, 10));
    expect(r.width).toBe(0);
    expect(r.height).toBe(0);
  });

  it('intersectsRect / intersects test overlap', () => {
    const r1 = new Rect(0, 0, 10, 10);
    expect(r1.intersectsRect(new Rect(5, 5, 10, 10))).toBe(true);
    expect(r1.intersectsRect(new Rect(20, 20, 10, 10))).toBe(false);
    expect(r1.intersects(5, 5, 10, 10)).toBe(true);
    expect(r1.intersects(20, 20, 10, 10)).toBe(false);
    expect(Rect.intersects(0, 0, 10, 10, 5, 5, 10, 10)).toBe(true);
    expect(Rect.intersects(0, 0, 10, 10, 20, 20, 10, 10)).toBe(false);
  });

  it('unionRect / unionPoint / union grow in place', () => {
    const r1 = new Rect(0, 0, 10, 10);
    expect(r1.unionRect(new Rect(5, 5, 10, 10))).toBe(r1);
    expect([r1.x, r1.y, r1.width, r1.height]).toEqual([0, 0, 15, 15]);
    const r2 = new Rect(0, 0, 10, 10).unionPoint(new Point(20, 30));
    expect([r2.x, r2.y, r2.width, r2.height]).toEqual([0, 0, 20, 30]);
    const r3 = new Rect(0, 0, 10, 10).union(5, 5);
    expect([r3.x, r3.y, r3.width, r3.height]).toEqual([0, 0, 10, 10]);
  });

  it('setSpot places the given Spot at the given point', () => {
    const r = new Rect(0, 0, 100, 50);
    expect(r.setSpot(0, 0, Spot.Center)).toBe(r);
    expect([r.x, r.y]).toEqual([-50, -25]);
  });

  it('equals / equalTo / equalsApprox', () => {
    const r = new Rect(1, 2, 3, 4);
    expect(r.equals(new Rect(1, 2, 3, 4))).toBe(true);
    expect(r.equals(new Rect(1, 2, 3, 5))).toBe(false);
    expect(r.equalTo(1, 2, 3, 4)).toBe(true);
    expect(r.equalTo(1, 2, 3, 9)).toBe(false);
    expect(r.equalsApprox(new Rect(1.2, 2, 3, 4))).toBe(true);
    expect(r.equalsApprox(new Rect(1, 2, 3, 9))).toBe(false);
    expect(r.equalsApproxTo(1.2, 2, 3, 4)).toBe(true);
    expect(r.equalsApproxTo(1, 2, 3, 9)).toBe(false);
    expect(r.equalsApproxClose(new Rect(1, 2, 3, 4))).toBe(true);
    expect(r.equalsApproxClose(new Rect(1.2, 2, 3, 4))).toBe(false);
    expect(r.equalsApproxClose(new Rect(1 + 1e-9, 2, 3, 4))).toBe(true);
  });

  it('className matches the official debug name', () => {
    expect(Rect.className).toBe('Rect');
  });

  it('isReal / isEmpty', () => {
    expect(new Rect(1, 2, 3, 4).isReal()).toBe(true);
    expect(new Rect(NaN, 0, 1, 1).isReal()).toBe(false);
    expect(new Rect(0, 0, 0, 0).isEmpty()).toBe(true);
    expect(new Rect(0, 0, 1, 0).isEmpty()).toBe(false);
  });

  it('nearestSideDirection reports the closest side', () => {
    const r = new Rect(0, 0, 10, 10);
    expect(r.nearestSideDirection(5, -1)).toBe(270);
    expect(r.nearestSideDirection(5, 11)).toBe(90);
    expect(r.nearestSideDirection(-1, 5)).toBe(180);
    expect(r.nearestSideDirection(11, 5)).toBe(0);
    expect(r.nearestSideDirectionPoint(new Point(11, 5))).toBe(0);
  });

  it('toString / parse / stringify round-trip', () => {
    const r = new Rect(1, 2, 3, 4);
    expect(r.toString()).toBe('Rect(1,2,3,4)');
    expect(Rect.stringify(r)).toBe('1 2 3 4');
    expect(Rect.parse(Rect.stringify(r)).equals(r)).toBe(true);
    expect(Rect.parse('1 2').equals(new Rect(1, 2, 0, 0))).toBe(true);
    expect(Rect.stringifyFixed(1)(new Rect(1 / 3, 2 / 3, 3, 4))).toBe('0.3 0.7 3.0 4.0');
  });

  it('freeze makes the Rect read-only', () => {
    const r = new Rect(1, 2, 3, 4);
    r.freeze();
    expect(r.isReadOnly).toBe(true);
    expect(() => r.setTo(0, 0, 1, 1)).toThrow();
    expect(Rect.Zero.isReadOnly).toBe(true);
    expect(Rect.Zero.isEmpty()).toBe(true);
    expect(Rect.NaN.isReal()).toBe(false);
  });

  it('static contains / intersectsLineSegment', () => {
    expect(Rect.intersectsLineSegment(0, 0, 10, 10, -5, 5, 15, 5)).toBe(true);
    expect(Rect.intersectsLineSegment(0, 0, 10, 10, 20, 20, 30, 30)).toBe(false);
  });
});
