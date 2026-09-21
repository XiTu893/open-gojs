import { describe, it, expect } from 'vitest';
import { officialGojs, openGojs } from './harness';

// Filter out GoJS's minified internal member names (e.g. $2, $O, C3, Dd, aN, etc.)
function isPublicName(k: string): boolean {
  if (k.length <= 2) return false;
  if (k.includes('$')) return false;
  if (/^[A-Z][a-z0-9]*$/.test(k) && k.length <= 3) return false; // minified like C3, Dd, G0
  return true;
}

function collectPublicKeys(obj: any): string[] {
  const keys = new Set<string>();
  let o = obj;
  while (o && o !== Object.prototype && o !== Function.prototype) {
    for (const k of Object.getOwnPropertyNames(o)) {
      if (isPublicName(k) && k !== 'constructor') keys.add(k);
    }
    o = Object.getPrototypeOf(o);
  }
  return Array.from(keys).sort();
}

function classNames(go: any): string[] {
  return Object.keys(go).filter((k) => {
    const v = (go as any)[k];
    return typeof v === 'function' && /^[A-Z]/.test(k);
  });
}

describe('Open-GoJS vs Official GoJS API surface (public only)', () => {
  const officialClasses = classNames(officialGojs);
  const openClasses = classNames(openGojs);

  it('reports missing public classes from Open-GoJS', () => {
    const missing = officialClasses.filter((c) => !(openGojs as any)[c]);
    console.log('MISSING CLASSES:', missing.join(', ') || '(none)');
    expect(missing).toBeDefined();
  });

  it('reports missing public namespace enum objects', () => {
    const enumObjects = [
      'PanelTypes', 'Panel', 'GraphObject', 'Alignment', 'GridAlignment', 'GridSorting',
      'GridArrangement', 'GridWrapping', 'Curve', 'Routing', 'Wrap', 'Overflow', 'TextOverflow',
      'ImageStretch', 'Sizing', 'TreeStyle', 'TreePath', 'TreeArrangement', 'TreeLayerStyle',
      'TreeSorting', 'TreeCompaction', 'TreeAlignment', 'CircularArrangement', 'CircularDirection',
      'CircularSorting', 'LayeredDigraphDirection', 'LayeredDigraphAlign', 'LayeredDigraphAggressive',
      'LayeredDigraphPack', 'LayeredDigraphCycleRemove', 'LayeredDigraphInit', 'LayeredDigraphLayering',
      'BindingMode', 'AutoScale', 'ScrollMode', 'CycleMode', 'ChangeType', 'SegmentType',
      'AnimationStyle', 'LinkAdjusting', 'Orientation', 'GestureMode', 'WheelMode',
      'TextEditingAccept', 'TextEditingStarting', 'LayoutConditions', 'GeometryStretch',
      'GeometryType', 'LinkingDirection', 'TriggerStart',
    ];
    const missing = enumObjects.filter((c) => !(openGojs as any)[c]);
    console.log('MISSING ENUM OBJECTS:', missing.join(', ') || '(none)');
    expect(missing).toBeDefined();
  });

  it('reports missing prototype members per class (public)', () => {
    const focus = [
      'Diagram', 'Node', 'Link', 'Group', 'Part', 'Panel', 'Shape', 'TextBlock', 'Picture',
      'GraphLinksModel', 'TreeModel', 'Model', 'Binding', 'Layout', 'GridLayout', 'TreeLayout',
      'ForceDirectedLayout', 'CircularLayout', 'LayeredDigraphLayout', 'Point', 'Rect', 'Size',
      'Spot', 'Margin', 'Geometry', 'Brush', 'Tool', 'ToolManager', 'CommandHandler',
    ];
    for (const cls of focus) {
      const off = officialGojs[cls];
      const op = openGojs[cls];
      if (!off || !op) continue;
      const offProto = collectPublicKeys(off.prototype);
      const opProto = collectPublicKeys(op.prototype);
      const missing = offProto.filter((k) => !opProto.includes(k));
      if (missing.length) {
        console.log(`\n[${cls}] missing prototype members: ${missing.join(', ')}`);
      }
      const offStatic = collectPublicKeys(off);
      const opStatic = collectPublicKeys(op);
      const missingStatic = offStatic.filter((k) => !opStatic.includes(k));
      if (missingStatic.length) {
        console.log(`[${cls}] missing static members: ${missingStatic.join(', ')}`);
      }
    }
  });
});