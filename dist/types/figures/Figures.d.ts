import { Geometry } from '../core/Geometry';
import { Map } from '../core/Map';
export declare const figures: Map<string, (shape: any, w: number, h: number) => Geometry>;
/** 官方 go.js 内置图形名（Shape.getFigureGenerators 返回的 30 个），顺序与官方一致 */
export declare const CORE_FIGURE_NAMES: string[];
export declare function isExtensionFigure(name: string): boolean;
export declare function getFigureGeometry(name: string, w: number, h: number, p1?: number, p2?: number, shape?: any): Geometry | null;
