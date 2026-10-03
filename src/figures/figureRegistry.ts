import { Geometry } from '../core/Geometry';
import { Map } from '../core/Map';
import { Set } from '../core/Set';

/** 图形生成函数：与官方 `Shape.defineFigureGenerator` 的签名一致（shape 可能为 undefined）。 */
export type FigureGenerator = (shape: any, w: number, h: number) => Geometry;

/**
 * 全部图形生成器。值为生成函数，或另一个已注册图形名的字符串别名
 * （官方 `defineFigureGenerator(name, 'Other')`，如 StoredData -> DataStorage）。
 */
export const figures: Map<string, FigureGenerator | string> = new Map();

/** 官方 go.js 内置图形名（Shape.getFigureGenerators 返回的 30 个），顺序与官方一致 */
export const CORE_FIGURE_NAMES: string[] = [
  'Rectangle', 'Square', 'RoundedRectangle', 'Border',
  'RoundedTopRectangle', 'RoundedBottomRectangle', 'RoundedLeftRectangle', 'RoundedRightRectangle',
  'Ellipse', 'Circle',
  'TriangleRight', 'TriangleDown', 'TriangleLeft', 'TriangleUp', 'Triangle', 'Diamond',
  'LineH', 'LineV', 'None', 'BarH', 'BarV',
  'MinusLine', 'PlusLine', 'XLine',
  'LineRight', 'LineDown', 'LineLeft', 'LineUp',
  'Capsule', 'Borders'
];

/** 来自 extensions/Figures.js 的扩展图形名（官方未加载时不出现在 getFigureGenerators 中） */
const extensionFigureNames: Set<string> = new Set();

/** 注册一个图形生成器（官方 `Shape.defineFigureGenerator`）。 */
export function defineFigureGenerator(
  name: string,
  func: ((shape: any, w: number, h: number) => Geometry) | string
): void {
  figures.add(name, func as any);
  if (CORE_FIGURE_NAMES.indexOf(name) < 0) extensionFigureNames.add(name);
}

export function isExtensionFigure(name: string): boolean {
  return extensionFigureNames.has(name);
}
/** 按图形名取几何；`p1/p2` 对应官方传入的 parameter1/parameter2。 */
export function getFigureGeometry(name: string, w: number, h: number, p1: number = NaN, p2: number = NaN, shape?: any): Geometry | null {
  return resolveFigureGeometry(name, w, h, p1, p2, shape, new Set<string>());
}

function resolveFigureGeometry(name: string, w: number, h: number, p1: number, p2: number, shape: any, visited: Set<string>): Geometry | null {
  const func = figures.get(name);
  if (func === undefined) return null;
  if (typeof func === 'string') {
    if (visited.has(func)) return null; // 循环别名保护
    visited.add(func);
    return resolveFigureGeometry(func, w, h, p1, p2, shape, visited);
  }
  if (typeof func !== 'function') return null;
  const geo = (func as FigureGenerator)(shape || null, w, h);
  // 官方 Shape 的图形几何入口（go.js 里 `n.Ec = e; n.Uc = i;`）会把生成尺寸记在几何上，
  // 包围盒至少覆盖 (0,0,w,h)。少了这一步，按窄包围盒拉伸会让拐角出现尖刺。
  if (geo && !isNaN(w) && !isNaN(h)) geo.setSize(w, h);
  return geo;
}
