import { describe, it, expect } from 'vitest';
import { Point } from '../../src/core/Point';

describe('Point', () => {
  it('should create a point with default values', () => {
    const p = new Point();
    expect(p.x).toBe(0);
    expect(p.y).toBe(0);
  });

  it('should create a point with given values', () => {
    const p = new Point(3, 4);
    expect(p.x).toBe(3);
    expect(p.y).toBe(4);
  });

  it('should add two points', () => {
    const p1 = new Point(1, 2);
    const p2 = new Point(3, 4);
    const result = p1.add(p2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('should subtract two points', () => {
    const p1 = new Point(5, 7);
    const p2 = new Point(2, 3);
    const result = p1.subtract(p2);
    expect(result.x).toBe(3);
    expect(result.y).toBe(4);
  });

  it('should calculate distance', () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(3, 4);
    expect(p1.distanceTo(p2)).toBe(5);
  });

  it('should calculate length', () => {
    const p = new Point(3, 4);
    expect(p.length).toBe(5);
  });

  it('should check equality', () => {
    const p1 = new Point(1, 2);
    const p2 = new Point(1, 2);
    const p3 = new Point(3, 4);
    expect(p1.equals(p2)).toBe(true);
    expect(p1.equals(p3)).toBe(false);
  });

  it('should copy', () => {
    const p = new Point(1, 2);
    const copy = p.copy();
    expect(copy.x).toBe(1);
    expect(copy.y).toBe(2);
    copy.x = 5;
    expect(p.x).toBe(1);
  });

  it('should parse from string', () => {
    const p = Point.parse('10 20');
    expect(p.x).toBe(10);
    expect(p.y).toBe(20);
  });

  it('should convert to string', () => {
    const p = new Point(10, 20);
    expect(p.toString()).toBe('10 20');
  });

  it('should normalize', () => {
    const p = new Point(3, 4);
    const n = p.normalize();
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
  });

  it('should rotate', () => {
    const p = new Point(1, 0);
    const r = p.rotate(Math.PI / 2);
    expect(r.x).toBeCloseTo(0);
    expect(r.y).toBeCloseTo(1);
  });

  it('should lerp', () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(10, 20);
    const mid = Point.lerp(p1, p2, 0.5);
    expect(mid.x).toBe(5);
    expect(mid.y).toBe(10);
  });

  it('should freeze', () => {
    const p = new Point(1, 2);
    p.freeze();
    expect(p.isReadOnly).toBe(true);
    expect(() => p.set(3, 4)).toThrow();
  });
});
