import { describe, it, expect } from 'vitest';
import { officialGojs, openGojs } from './harness';

describe('Open-GoJS namespace enum objects', () => {
  it('PanelTypes exists and has expected keys', () => {
    expect(openGojs.PanelTypes).toBeDefined();
    for (const k of ['Auto', 'Position', 'Vertical', 'Horizontal', 'Spot', 'Table', 'TableRow', 'TableColumn', 'Viewbox', 'Link', 'Grid', 'Graduated']) {
      expect((openGojs.PanelTypes as any)[k]).toBeTruthy();
    }
  });

  it('BindingMode exists with OneWay/TwoWay', () => {
    expect(openGojs.BindingMode).toBeDefined();
    expect(openGojs.BindingMode.OneWay).toBeTruthy();
    expect(openGojs.BindingMode.TwoWay).toBeTruthy();
  });

  it('CircularDirection exists with Clockwise/Counterclockwise', () => {
    expect(openGojs.CircularDirection).toBeDefined();
    expect(openGojs.CircularDirection.Clockwise).toBeTruthy();
    expect(openGojs.CircularDirection.Counterclockwise).toBeTruthy();
    expect(openGojs.CircularDirection.BidirectionalLeft).toBeTruthy();
    expect(openGojs.CircularDirection.BidirectionalRight).toBeTruthy();
  });

  it('LayeredDigraphInit/Layering/CycleRemove/Direction exist', () => {
    expect(openGojs.LayeredDigraphInit).toBeDefined();
    expect(openGojs.LayeredDigraphInit.DepthFirstOut).toBeTruthy();
    expect(openGojs.LayeredDigraphInit.Naive).toBeTruthy();
    expect(openGojs.LayeredDigraphLayering).toBeDefined();
    expect(openGojs.LayeredDigraphLayering.OptimalLinkLength).toBeTruthy();
    expect(openGojs.LayeredDigraphCycleRemove).toBeDefined();
    expect(openGojs.LayeredDigraphCycleRemove.DepthFirst).toBeTruthy();
    expect(openGojs.LayeredDigraphDirection).toBeDefined();
    expect(openGojs.LayeredDigraphDirection.Down).toBeTruthy();
  });
});