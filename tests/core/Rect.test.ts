import { describe, it, expect } from 'vitest';
import { Rect } from '../../src/core/Rect';
import { Point } from '../../src/core/Point';
import { Size } from '../../src/core/Size';

describe('Rect', () => {
  it('should create a rect with default values', () => {
    const r = new Rect();
    expect(r.x).toBe(0);
    expect(r.y).toBe(0);
    expect(r.width).toBe(0);
    expect(r.height).toBe(0);
  });

  it('should create a rect with given values', () => {
    const r = new Rect(1, 2, 3, 4);
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(3);
    expect(r.height).toBe(4);
  });

  it('should create a rect from Point and Size', () => {
    const r = new Rect(new Point(1, 2), new Size(3, 4));
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(3);
    expect(r.height).toBe(4);
  });

  it('should calculate edges', () => {
    const r = new Rect(10, 20, 30, 40);
    expect(r.left).toBe(10);
    expect(r.top).toBe(20);
    expect(r.right).toBe(40);
    expect(r.bottom).toBe(60);
  });

  it('should calculate center', () => {
    const r = new Rect(0, 0, 10, 20);
    expect(r.center.x).toBe(5);
    expect(r.center.y).toBe(10);
  });

  it('should check containsPoint', () => {
    const r = new Rect(0, 0, 10, 10);
    expect(r.containsPoint(new Point(5, 5))).toBe(true);
    expect(r.containsPoint(new Point(15, 15))).toBe(false);
  });

  it('should intersect two rects', () => {
    const r1 = new Rect(0, 0, 10, 10);
    const r2 = new Rect(5, 5, 10, 10);
    const inter = r1.intersect(r2);
    expect(inter.x).toBe(5);
    expect(inter.y).toBe(5);
    expect(inter.width).toBe(5);
    expect(inter.height).toBe(5);
  });

  it('should union two rects', () => {
    const r1 = new Rect(0, 0, 10, 10);
    const r2 = new Rect(5, 5, 10, 10);
    const union = r1.union(r2);
    expect(union.x).toBe(0);
    expect(union.y).toBe(0);
    expect(union.width).toBe(15);
    expect(union.height).toBe(15);
  });

  it('should check intersects', () => {
    const r1 = new Rect(0, 0, 10, 10);
    const r2 = new Rect(5, 5, 10, 10);
    const r3 = new Rect(20, 20, 10, 10);
    expect(r1.intersects(r2)).toBe(true);
    expect(r1.intersects(r3)).toBe(false);
  });

  it('should inflate', () => {
    const r = new Rect(10, 10, 20, 20);
    const inflated = r.inflate(5);
    expect(inflated.x).toBe(5);
    expect(inflated.y).toBe(5);
    expect(inflated.width).toBe(30);
    expect(inflated.height).toBe(30);
  });

  it('should parse from string', () => {
    const r = Rect.parse('1 2 3 4');
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(3);
    expect(r.height).toBe(4);
  });
});
