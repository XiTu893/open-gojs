import { describe, it, expect } from 'vitest';
import { officialGojs, openGojs } from './harness';

describe('Layout property default comparison', () => {
  it('GridLayout: sorting default is Ascending, cellSize NaN, spacing 10', () => {
    const off = new officialGojs.GridLayout();
    const op = new openGojs.GridLayout();
    expect(op.spacing.width).toBe(off.spacing.width);
    expect(op.spacing.height).toBe(off.spacing.height);
    // cellSize default is NaN in official
    expect(Number.isNaN(op.cellSize.width)).toBe(Number.isNaN(off.cellSize.width));
    expect(Number.isNaN(op.cellSize.height)).toBe(Number.isNaN(off.cellSize.height));
    // sorting default is Ascending (22) in official; open should be its Ascending enum
    expect(op.sorting).toBe(openGojs.GridSorting.Ascending);
    // alignment default is Location in official (1); open uses its Location enum
    expect(op.alignment).toBe(openGojs.GridLayout.Location);
    expect(op.arrangement.toString()).toBe('GridArrangementLeftToRight');
  });

  it('CircularLayout: spacing default is 6', () => {
    const off = new officialGojs.CircularLayout();
    const op = new openGojs.CircularLayout();
    expect(op.spacing).toBe(6);
    expect(off.spacing).toBe(6);
    expect(op.aspectRatio).toBe(1);
    expect(op.startAngle).toBe(0);
    expect(op.sweepAngle).toBe(360);
    // actual radii exposed
    expect('actualXRadius' in op).toBe(true);
    expect('actualYRadius' in op).toBe(true);
  });

  it('TreeLayout has rootDefaults and alternateDefaults', () => {
    const off = new officialGojs.TreeLayout();
    const op = new openGojs.TreeLayout();
    expect(!!(off as any).rootDefaults).toBe(true);
    expect(!!(op as any).rootDefaults).toBe(true);
    expect(!!(op as any).alternateDefaults).toBe(true);
  });

  it('ForceDirectedLayout has expected properties', () => {
    const off = new officialGojs.ForceDirectedLayout();
    const op = new openGojs.ForceDirectedLayout();
    expect(op.maxIterations).toBe(off.maxIterations);
    expect(op.defaultSpringLength).toBe(off.defaultSpringLength);
    expect(op.defaultElectricalCharge).toBe(off.defaultElectricalCharge);
    expect(op.defaultGravitationalMass).toBe(0);
    expect('arrangementSpacing' in op).toBe(true);
    expect('theta' in op).toBe(true);
    expect('setsPortSpots' in op).toBe(true);
    expect('randomNumberGenerator' in op).toBe(true);
    expect('springLength' in op).toBe(true);
    expect('springStiffness' in op).toBe(true);
    expect('arrangesToOrigin' in op).toBe(true);
  });
});