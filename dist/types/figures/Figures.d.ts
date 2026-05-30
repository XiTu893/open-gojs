import { Geometry } from '../core/Geometry';
import { Map } from '../core/Map';
export declare const figures: Map<string, (shape: any, w: number, h: number) => Geometry>;
export declare function getFigureGeometry(name: string, w: number, h: number, p1?: number, p2?: number, shape?: any): Geometry | null;
