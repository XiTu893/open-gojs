import { describe, it, expect } from 'vitest';
import { Spot } from '../../src/core/Spot';

describe('Spot', () => {
  it('default constructor produces the origin spot', () => {
    const s = new Spot();
    expect([s.x, s.y, s.offsetX, s.offsetY]).toEqual([0, 0, 0, 0]);
  });

  it('constructors default missing values to zero', () => {
    const a = new Spot(0.5);
    expect([a.x, a.y, a.offsetX, a.offsetY]).toEqual([0.5, 0, 0, 0]);
    const b = new Spot(0.5, 0.5, 3);
    expect([b.x, b.y, b.offsetX, b.offsetY]).toEqual([0.5, 0.5, 3, 0]);
    const c = new Spot(1, 1, 2, 3);
    expect([c.x, c.y, c.offsetX, c.offsetY]).toEqual([1, 1, 2, 3]);
  });

  it('setTo / set modify in place and return this', () => {
    const s = new Spot();
    expect(s.setTo(0.5, 0.5, 1, 2)).toBe(s);
    expect([s.x, s.y, s.offsetX, s.offsetY]).toEqual([0.5, 0.5, 1, 2]);
    const t = new Spot().set(Spot.Center);
    expect(t).not.toBe(Spot.Center);
    expect(t.equals(Spot.Center)).toBe(true);
  });

  it('copy produces an independent Spot', () => {
    const s = Spot.TopLeft.copy();
    expect(s).not.toBe(Spot.TopLeft);
    s.x = 0.5;
    expect(Spot.TopLeft.x).toBe(0);
  });

  it('isSpot / isNoSpot / isNone / isDefault / isSide are methods', () => {
    expect(Spot.Center.isSpot()).toBe(true);
    expect(Spot.Center.isNoSpot()).toBe(false);
    expect(Spot.None.isSpot()).toBe(false);
    expect(Spot.None.isNoSpot()).toBe(true);
    expect(Spot.None.isNone()).toBe(true);
    expect(Spot.None.isDefault()).toBe(false);
    expect(Spot.None.isSide()).toBe(false);
    expect(Spot.Default.isDefault()).toBe(true);
    expect(Spot.Default.isNone()).toBe(false);
    expect(Spot.Default.isSide()).toBe(false);
    expect(Spot.TopSide.isSide()).toBe(true);
    expect(Spot.TopSide.isNone()).toBe(false);
    expect(Spot.TopSide.isSpot()).toBe(false);
    expect(Spot.TopSide.isNoSpot()).toBe(true);
    expect(Spot.AllSides.isSide()).toBe(true);
  });

  it('special spots use the official NaN encoding', () => {
    expect([Spot.None.x, Spot.None.y, Spot.None.offsetX, Spot.None.offsetY]).toEqual([NaN, NaN, 0, 0]);
    expect([Spot.Default.offsetX, Spot.Default.offsetY]).toEqual([-1, 0]);
    expect([Spot.TopSide.offsetX, Spot.TopSide.offsetY]).toEqual([1, 1]);
    expect([Spot.LeftSide.offsetX, Spot.LeftSide.offsetY]).toEqual([1, 2]);
    expect([Spot.RightSide.offsetX, Spot.RightSide.offsetY]).toEqual([1, 4]);
    expect([Spot.BottomSide.offsetX, Spot.BottomSide.offsetY]).toEqual([1, 8]);
    expect(Spot.TopBottomSides.offsetY).toBe(9);
    expect(Spot.LeftRightSides.offsetY).toBe(6);
    expect(Spot.AllSides.offsetY).toBe(15);
    expect(Spot.NotTopSide.offsetY).toBe(14);
  });

  it('equals treats NaN as equivalent', () => {
    expect(Spot.None.equals(Spot.None)).toBe(true);
    expect(Spot.None.equals(Spot.Center)).toBe(false);
    expect(Spot.Center.equals(new Spot(0.5, 0.5))).toBe(true);
    expect(Spot.TopLeft.equals(Spot.TopLeft)).toBe(true);
    expect(Spot.Center.equals(null as any)).toBe(false);
  });

  it('opposite returns the mirrored spot', () => {
    expect(Spot.TopLeft.opposite().equals(Spot.BottomRight)).toBe(true);
    expect(Spot.BottomLeft.opposite().equals(Spot.TopRight)).toBe(true);
    const o = new Spot(0.5, 0.5, 3, 4).opposite();
    expect([o.x, o.y, o.offsetX, o.offsetY]).toEqual([0.5, 0.5, -3, -4]);
    expect(Spot.Center.opposite().equals(Spot.Center)).toBe(true);
  });

  it('includesSide is a superset test and maps point spots to sides', () => {
    expect(Spot.AllSides.includesSide(Spot.TopSide)).toBe(true);
    expect(Spot.AllSides.includesSide(Spot.BottomSide)).toBe(true);
    expect(Spot.TopBottomSides.includesSide(Spot.TopSide)).toBe(true);
    expect(Spot.TopBottomSides.includesSide(Spot.LeftSide)).toBe(false);
    expect(Spot.TopSide.includesSide(Spot.AllSides)).toBe(false);
    expect(Spot.TopSide.includesSide(Spot.Top)).toBe(true);
    expect(Spot.LeftSide.includesSide(Spot.Left)).toBe(true);
    expect(Spot.Center.includesSide(Spot.TopSide)).toBe(false);
    expect(Spot.Center.includesSide(Spot.Center)).toBe(false);
  });

  it('named constants alias the official names', () => {
    expect(Spot.Top.equals(Spot.TopCenter)).toBe(true);
    expect(Spot.MiddleTop.equals(Spot.TopCenter)).toBe(true);
    expect(Spot.Left.equals(Spot.LeftCenter)).toBe(true);
    expect(Spot.MiddleLeft.equals(Spot.LeftCenter)).toBe(true);
    expect(Spot.Right.equals(Spot.RightCenter)).toBe(true);
    expect(Spot.Bottom.equals(Spot.BottomCenter)).toBe(true);
    expect([Spot.TopCenter.x, Spot.TopCenter.y]).toEqual([0.5, 0]);
    expect([Spot.LeftCenter.x, Spot.LeftCenter.y]).toEqual([0, 0.5]);
    expect([Spot.BottomCenter.x, Spot.BottomCenter.y]).toEqual([0.5, 1]);
    expect([Spot.Center.x, Spot.Center.y]).toEqual([0.5, 0.5]);
  });

  it('toString / stringify / parse', () => {
    expect(Spot.Center.toString()).toBe('Spot(0.5,0.5)');
    expect(new Spot(0.5, 0, 1, 2).toString()).toBe('Spot(0.5,0,1,2)');
    expect(Spot.None.toString()).toBe('None');
    expect(Spot.className).toBe('Spot');
    expect(Spot.Default.toString()).toBe('Default');
    expect(Spot.TopSide.toString()).toBe('TopSide');
    expect(Spot.AllSides.toString()).toBe('AllSides');
    expect(Spot.stringify(Spot.Center)).toBe('0.5 0.5 0 0');
    expect(Spot.stringify(Spot.TopSide)).toBe('TopSide');
    const s = new Spot(0.5, 0.25, 1, 2);
    expect(Spot.parse(Spot.stringify(s)).equals(s)).toBe(true);
    expect(Spot.parse('Center').equals(Spot.Center)).toBe(true);
    expect(Spot.parse('Top').equals(Spot.TopCenter)).toBe(true);
    expect(Spot.parse('MiddleTop').equals(Spot.TopCenter)).toBe(true);
    expect(Spot.parse('Left').equals(Spot.LeftCenter)).toBe(true);
    expect(Spot.parse('TopSide').equals(Spot.TopSide)).toBe(true);
    expect(Spot.parse('None').equals(Spot.None)).toBe(true);
    expect(Spot.parse('0.5 0.5 0 0').equals(Spot.Center)).toBe(true);
    expect(Spot.stringifyFixed(2)(new Spot(1 / 3, 2 / 3, 0, 0))).toBe('0.33 0.67 0.00 0.00');
  });

  it('freeze makes the Spot read-only', () => {
    const s = new Spot(0.5, 0.5, 0, 0);
    s.freeze();
    expect(s.isReadOnly).toBe(true);
    expect(() => s.setTo(0, 0, 0, 0)).toThrow();
    expect(Spot.Center.isReadOnly).toBe(true);
    expect(Spot.None.isReadOnly).toBe(true);
    expect(Spot.TopSide.isReadOnly).toBe(true);
  });

  it('positionInRect maps spots and sides onto a rectangle (project extension)', () => {
    const r = { x: 10, y: 20, width: 100, height: 50 };
    expect(Spot.Center.positionInRect(r)).toEqual({ x: 60, y: 45 });
    expect(Spot.TopLeft.positionInRect(r)).toEqual({ x: 10, y: 20 });
    expect(Spot.BottomRight.positionInRect(r)).toEqual({ x: 110, y: 70 });
    // side spots follow the legacy point+offset representation
    expect(Spot.TopSide.positionInRect(r)).toEqual({ x: 60, y: 19 });
    expect(Spot.BottomSide.positionInRect(r)).toEqual({ x: 60, y: 71 });
    expect(Spot.LeftSide.positionInRect(r)).toEqual({ x: 9, y: 45 });
    expect(Spot.RightSide.positionInRect(r)).toEqual({ x: 111, y: 45 });
    // Spot.Default resolves to the top-left, Spot.None stays NaN
    expect(Spot.Default.positionInRect(r)).toEqual({ x: 10, y: 20 });
    expect(Number.isNaN(Spot.None.positionInRect(r).x)).toBe(true);
  });
});
