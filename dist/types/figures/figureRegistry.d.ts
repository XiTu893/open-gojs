import { Geometry } from '../core/Geometry';
import { Map } from '../core/Map';
/** 图形生成函数：与官方 `Shape.defineFigureGenerator` 的签名一致（shape 可能为 undefined）。 */
export type FigureGenerator = (shape: any, w: number, h: number) => Geometry;
/**
 * 全部图形生成器。值为生成函数，或另一个已注册图形名的字符串别名
 * （官方 `defineFigureGenerator(name, 'Other')`，如 StoredData -> DataStorage）。
 */
export declare const figures: Map<string, FigureGenerator | string>;
/** 官方 go.js 内置图形名（Shape.getFigureGenerators 返回的 30 个），顺序与官方一致 */
export declare const CORE_FIGURE_NAMES: string[];
/** 注册一个图形生成器（官方 `Shape.defineFigureGenerator`）。 */
export declare function defineFigureGenerator(name: string, func: ((shape: any, w: number, h: number) => Geometry) | string): void;
export declare function isExtensionFigure(name: string): boolean;
/** 按图形名取几何；`p1/p2` 对应官方传入的 parameter1/parameter2。 */
export declare function getFigureGeometry(name: string, w: number, h: number, p1?: number, p2?: number, shape?: any): Geometry | null;
