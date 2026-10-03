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

  // ---- 阶段 3 新增的 15 个官方命名空间对象 ----

  it('every enum object the official runtime exports also exists here', () => {
    const officialEnums = Object.keys(officialGojs).filter(
      (k) => k !== 'version' && k !== 'default' && k.length > 2 && !k.includes('$') &&
        typeof (officialGojs as any)[k] === 'object'
    );
    const missing = officialEnums.filter((k) => !(openGojs as any)[k]);
    expect(missing).toEqual([]);
    expect(officialEnums.length).toBeGreaterThanOrEqual(60);
  });

  it('member names match official exactly for every enum object', () => {
    const officialEnums = Object.keys(officialGojs).filter(
      (k) => k !== 'version' && k !== 'default' && k.length > 2 && !k.includes('$') &&
        typeof (officialGojs as any)[k] === 'object'
    );
    for (const k of officialEnums) {
      const off = (officialGojs as any)[k];
      const op = (openGojs as any)[k];
      const officialKeys = Object.keys(off).filter((m) => !/^\d+$/.test(m));
      for (const m of officialKeys) expect(op[m]).toBeDefined();
      expect(Object.keys(op).sort()).toEqual(officialKeys.slice().sort());
    }
  });

  it('the newly added enum namespaces have the official member names', () => {
    expect(Object.keys(openGojs.Flip).sort()).toEqual(['Both', 'Horizontal', 'None', 'Vertical']);
    expect(Object.keys(openGojs.TextFormat).sort()).toEqual(['None', 'Trim']);
    expect(Object.keys(openGojs.PortSpreading).sort()).toEqual(['Evenly', 'None', 'Packed']);
    expect(Object.keys(openGojs.CollapsePolicy).sort()).toEqual(['AllParents', 'AnyParents', 'TreeParent']);
    expect(Object.keys(openGojs.ViewboxStretch).sort()).toEqual(['Uniform', 'UniformToFill']);
    expect(Object.keys(openGojs.BrushType).sort()).toEqual(['Linear', 'Pattern', 'Radial', 'Solid']);
    expect(Object.keys(openGojs.ColorSpace).sort()).toEqual(['HSL', 'Lab', 'Oklch']);
    expect(Object.keys(openGojs.CircularNodeDiameterFormula).sort()).toEqual(['Circular', 'Pythagorean']);
    expect(Object.keys(openGojs.ReshapingBehavior).sort()).toEqual(['All', 'Horizontal', 'None', 'Vertical']);
    expect(Object.keys(openGojs.TextEditingState).sort()).toEqual(
      ['Active', 'Editing', 'Invalid', 'None', 'Validated', 'Validating']
    );
  });

  it('string name maps are value===key like official', () => {
    for (const k of Object.keys(openGojs.Figures)) expect((openGojs.Figures as any)[k]).toBe(k);
    for (const k of Object.keys(openGojs.Arrowheads)) expect((openGojs.Arrowheads as any)[k]).toBe(k);
    for (const k of Object.keys(openGojs.ToolNames)) expect((openGojs.ToolNames as any)[k]).toBe(k);
    for (const k of Object.keys(openGojs.Builders)) expect((openGojs.Builders as any)[k]).toBe(k);
    expect(openGojs.LayerNames.Default).toBe('');
    expect(openGojs.LayerNames.Background).toBe('Background');
    expect(Object.keys(openGojs.Arrowheads).length).toBe(80);
    expect(Object.keys(openGojs.Figures).length).toBe(30);
    expect(Object.keys(openGojs.Builders).length).toBe(12);
    expect(Object.keys(openGojs.ToolNames).length).toBe(13);
  });

  it('LayoutConditions is a numeric bit field (official go.d.ts:21851)', () => {
    expect(openGojs.LayoutConditions.None).toBe(0);
    expect(openGojs.LayoutConditions.Added).toBe(1);
    expect(openGojs.LayoutConditions.Removed).toBe(2);
    expect(openGojs.LayoutConditions.NodeSized).toBe(16);
    expect(openGojs.LayoutConditions.Standard).toBe(127);
    expect(openGojs.LayoutConditions.Standard).toBe(
      openGojs.LayoutConditions.Added | openGojs.LayoutConditions.Removed |
      openGojs.LayoutConditions.Shown | openGojs.LayoutConditions.Hidden |
      openGojs.LayoutConditions.NodeSized | openGojs.LayoutConditions.GroupLayout |
      openGojs.LayoutConditions.NodeReplaced
    );
    expect(openGojs.LayoutConditions.All).toBe(0xffffff);
  });

  it('every exported class carries a static className', () => {
    for (const k of Object.keys(openGojs)) {
      const v = (openGojs as any)[k];
      if (typeof v !== 'function' || !/^[A-Z]/.test(k) || k.length <= 2) continue;
      expect(typeof v.className, k + '.className').toBe('string');
    }
    expect(openGojs.Diagram.className).toBe('Diagram');
    expect(openGojs.List.className).toBe('List');
    expect(openGojs.version).toBe('0.1.0');
  });

  it('GraphObject exposes the Flip statics official has', () => {
    expect(openGojs.GraphObject.FlipVertical).toBeTruthy();
    expect(openGojs.GraphObject.FlipHorizontal).toBeTruthy();
    expect(openGojs.GraphObject.FlipBoth).toBeTruthy();
    expect(openGojs.GraphObject.FlipVertical).toBe(openGojs.Flip.Vertical);
    expect(openGojs.GraphObject.Fill).toBe(openGojs.Stretch.Fill);
  });
});