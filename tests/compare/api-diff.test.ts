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
    // 阶段 3 起改为从官方运行时**自动**推导枚举对象清单（只取非函数的顶层导出），
    // 避免手写清单里混入官方根本没有的名字（旧清单里的 Alignment / GridWrapping / Overflow
    // 在 gojs@4.0.4 运行时都不存在）。
    const enumObjects = Object.keys(officialGojs)
      .filter(
        (k) =>
          k !== 'version' && k !== 'default' && k.length > 2 && !k.includes('$') &&
          typeof (officialGojs as any)[k] === 'object'
      )
      .sort();
    const missing = enumObjects.filter((c) => !(openGojs as any)[c]);
    console.log('OFFICIAL ENUM OBJECTS: ' + enumObjects.length);
    console.log('MISSING ENUM OBJECTS:', missing.join(', ') || '(none)');
    expect(missing).toEqual([]);
  });

  it('every official enum object exposes the same member names', () => {
    const enumObjects = Object.keys(officialGojs).filter(
      (k) =>
        k !== 'version' && k !== 'default' && k.length > 2 && !k.includes('$') &&
        typeof (officialGojs as any)[k] === 'object'
    );
    const bad: string[] = [];
    for (const k of enumObjects) {
      const off = (officialGojs as any)[k];
      const op = (openGojs as any)[k];
      if (!op) { bad.push(k + ' (missing object)'); continue; }
      // 官方 TS enum 带数字反向映射（"0" -> "None"），比较时跳过纯数字键
      const officialKeys = Object.keys(off).filter((m) => !/^\d+$/.test(m));
      const ourKeys = new Set(Object.keys(op));
      const miss = officialKeys.filter((m) => !ourKeys.has(m));
      const extra = Object.keys(op).filter((m) => !officialKeys.includes(m));
      if (miss.length) bad.push(k + ' missing[' + miss.join(',') + ']');
      if (extra.length) bad.push(k + ' extra[' + extra.join(',') + ']');
    }
    console.log('ENUM MEMBER DIFFS:', bad.join(' | ') || '(none)');
    expect(bad).toEqual([]);
  });

  it('reports missing prototype members per class (public)', () => {
    const focus = [
      'Diagram', 'Node', 'Link', 'Group', 'Part', 'Panel', 'Shape', 'TextBlock', 'Picture',
      'GraphLinksModel', 'TreeModel', 'Model', 'Binding', 'Layout', 'GridLayout', 'TreeLayout',
      'ForceDirectedLayout', 'CircularLayout', 'LayeredDigraphLayout', 'Point', 'Rect', 'Size',
      'Spot', 'Margin', 'Geometry', 'Brush', 'Tool', 'ToolManager', 'CommandHandler',
      'List', 'Set', 'Map',
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