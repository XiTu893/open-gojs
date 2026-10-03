import { describe, it, expect } from 'vitest';
import { Point } from '../../src/core/Point';
import { Rect } from '../../src/core/Rect';
import { Spot } from '../../src/core/Spot';

describe('Point', () => {
  it('default constructor produces Point(0,0)', () => {
    const p = new Point();
    expect(p.x).toBe(0);
    expect(p.y).toBe(0);
  });

  it('two-argument constructor', () => {
    const p = new Point(3, 4);
    expect(p.x).toBe(3);
    expect(p.y).toBe(4);
  });

  it('rejects invalid constructor arguments (official: 0 or 2 numbers only)', () => {
    expect(() => new Point(1)).toThrow();
    expect(() => new Point('1' as any, '2' as any)).toThrow();
  });

  it('setTo modifies in place and returns this', () => {
    const p = new Point(1, 2);
    const r = p.setTo(7, 8);
    expect(r).toBe(p);
    expect(p.x).toBe(7);
    expect(p.y).toBe(8);
  });

  it('set copies another Point in place', () => {
    const a = new Point(1, 2);
    const b = new Point().set(a);
    expect(b).not.toBe(a);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
    a.x = 9;
    expect(b.x).toBe(1);
  });

  it('add/subtract/offset are in-place (official semantics)', () => {
    const p = new Point(1, 2);
    expect(p.add(new Point(3, 4))).toBe(p);
    expect(p.x).toBe(4);
    expect(p.y).toBe(6);
    expect(p.subtract(new Point(1, 2))).toBe(p);
    expect(p.x).toBe(3);
    expect(p.y).toBe(4);
    expect(p.offset(10, 20)).toBe(p);
    expect(p.x).toBe(13);
    expect(p.y).toBe(24);
  });

  it('scale is in place', () => {
    const p = new Point(2, 3);
    expect(p.scale(2, 3)).toBe(p);
    expect(p.x).toBe(4);
    expect(p.y).toBe(9);
  });

  it('distanceSquaredPoint / distanceSquared give squared euclidean distance', () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(3, 4);
    expect(p1.distanceSquaredPoint(p2)).toBe(25);
    expect(p1.distanceSquared(3, 4)).toBe(25);
    expect(Point.distanceSquared(0, 0, 3, 4)).toBe(25);
    expect(Math.sqrt(p1.distanceSquaredPoint(p2))).toBe(5);
  });

  it('normalize returns unit length in place; origin stays zero', () => {
    const p = new Point(3, 4);
    expect(p.normalize()).toBe(p);
    expect(p.x).toBeCloseTo(0.6, 10);
    expect(p.y).toBeCloseTo(0.8, 10);
    const o = new Point(0, 0).normalize();
    expect(o.x).toBe(0);
    expect(o.y).toBe(0);
  });

  it('equals / equalTo / equalsApprox', () => {
    const p1 = new Point(1, 2);
    expect(p1.equals(new Point(1, 2))).toBe(true);
    expect(p1.equals(new Point(1.4, 2))).toBe(false);
    expect(p1.equalTo(1, 2)).toBe(true);
    expect(p1.equalTo(1, 3)).toBe(false);
    expect(p1.equalsApprox(new Point(1.4, 2))).toBe(true);
    expect(p1.equalsApprox(new Point(1.6, 2))).toBe(false);
  });

  it('rotate takes degrees and rotates about the origin in place', () => {
    const p = new Point(1, 0);
    expect(p.rotate(90)).toBe(p);
    expect(p.x).toBeCloseTo(0, 10);
    expect(p.y).toBeCloseTo(1, 10);
    p.rotate(-90);
    expect(p.x).toBeCloseTo(1, 10);
    expect(p.y).toBeCloseTo(0, 10);
    const z = new Point(0, 0).rotate(45);
    expect(z.x).toBe(0);
    expect(z.y).toBe(0);
  });

  it('directionPoint / direction return degrees in 0..360', () => {
    const p = new Point(0, 0);
    expect(p.directionPoint(new Point(1, 0))).toBeCloseTo(0, 10);
    expect(p.directionPoint(new Point(0, 1))).toBeCloseTo(90, 10);
    expect(p.directionPoint(new Point(-1, 0))).toBeCloseTo(180, 10);
    expect(p.directionPoint(new Point(0, -1))).toBeCloseTo(270, 10);
    expect(p.direction(3, 4)).toBeCloseTo(53.13010235415598, 10);
    expect(p.direction(0, 0)).toBe(0);
    expect(Point.direction(0, 0, 0, 1)).toBeCloseTo(90, 10);
  });

  it('copy produces an independent Point', () => {
    const p = new Point(1, 2);
    const copy = p.copy();
    expect(copy).not.toBe(p);
    copy.x = 5;
    expect(p.x).toBe(1);
  });

  it('toString is the debug format, stringify is the data format', () => {
    const p = new Point(10, 20);
    expect(p.toString()).toBe('Point(10,20)');
    expect(Point.className).toBe('Point');
    expect(Point.stringify(p)).toBe('10 20');
    expect(Point.parse(Point.stringify(p)).equals(p)).toBe(true);
    expect(Point.stringifyFixed(2)(new Point(1 / 3, 2 / 3))).toBe('0.33 0.67');
  });

  it('parse tolerates missing values', () => {
    expect(Point.parse('').equals(new Point(0, 0))).toBe(true);
    expect(Point.parse('5').equals(new Point(5, 0))).toBe(true);
    expect(Point.parse('5 6').equals(new Point(5, 6))).toBe(true);
  });

  it('isReal rejects non-finite values', () => {
    expect(new Point(1, 2).isReal()).toBe(true);
    expect(new Point(NaN, 0).isReal()).toBe(false);
    expect(new Point(Infinity, 0).isReal()).toBe(false);
  });

  it('freeze makes the Point read-only', () => {
    const p = new Point(1, 2);
    p.freeze();
    expect(p.isReadOnly).toBe(true);
    expect(() => p.setTo(3, 4)).toThrow();
    expect(() => {
      p.x = 9;
    }).toThrow();
    expect(Point.Zero.isReadOnly).toBe(true);
  });

  it('projectOntoLineSegment / snapToGrid / setSpot modify in place', () => {
    const p = new Point(5, 1).projectOntoLineSegment(0, 0, 10, 0);
    expect(p.x).toBeCloseTo(5, 10);
    expect(p.y).toBeCloseTo(0, 10);
    const g = new Point(12, 18).snapToGrid(0, 0, 10, 10);
    expect(g.x).toBe(10);
    expect(g.y).toBe(20);
    const s = new Point().setSpot(10, 10, 20, 30, Spot.Center);
    expect(s.x).toBeCloseTo(20, 10);
    expect(s.y).toBeCloseTo(25, 10);
    const rs = new Point(0, 0).setRectSpot(new Rect(0, 0, 10, 20), Spot.BottomRight);
    expect(rs.x).toBe(10);
    expect(rs.y).toBe(20);
  });

  it('static line-segment helpers', () => {
    expect(Point.compareWithLineSegment(0, 0, 10, 0, 5, 0)).toBe(0);
    expect(Point.compareWithLineSegment(0, 0, 10, 0, 5, -1)).toBeGreaterThan(0);
    expect(Point.compareWithLineSegment(0, 0, 10, 0, 5, 1)).toBeLessThan(0);
    expect(Point.intersectingLineSegments(0, 0, 10, 10, 0, 10, 10, 0)).toBe(true);
    expect(Point.intersectingLineSegments(0, 0, 1, 1, 5, 5, 6, 6)).toBe(false);
    expect(Point.distanceLineSegmentSquared(5, 5, 0, 0, 10, 0)).toBe(25);
    expect(Point.distanceLineSegmentSquared(-5, 0, 0, 0, 10, 0)).toBe(25);
  });

  it('lerp / Zero are project extensions', () => {
    const mid = Point.lerp(new Point(0, 0), new Point(10, 20), 0.5);
    expect(mid.x).toBe(5);
    expect(mid.y).toBe(10);
    expect(Point.Zero.x).toBe(0);
    expect(Point.Zero.y).toBe(0);
  });
});
