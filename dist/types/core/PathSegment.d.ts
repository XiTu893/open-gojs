import { EnumValue } from './EnumValues';
/**
 * PathSegment - 路径段
 */
export declare class PathSegment {
    /** 段类型 */
    type: EnumValue;
    /** 控制点1 X */
    x1: number;
    /** 控制点1 Y */
    y1: number;
    /** 控制点2 X */
    x2: number;
    /** 控制点2 Y */
    y2: number;
    /** 终点 X */
    endX: number;
    /** 终点 Y */
    endY: number;
    /** 是否为闭合段 */
    isClosed: boolean;
    /** 圆弧参数 */
    radiusX: number;
    radiusY: number;
    xAxisRotation: number;
    largeArc: boolean;
    clockwise: boolean;
    /** 是否为相对坐标 */
    isRelative: boolean;
    constructor(type?: EnumValue, endX?: number, endY?: number, x1?: number, y1?: number, x2?: number, y2?: number);
    copy(): PathSegment;
    equals(seg: PathSegment): boolean;
    /** 创建直线段 */
    static Line(endX: number, endY: number): PathSegment;
    /** 创建二次贝塞尔曲线段 */
    static QuadraticBezier(endX: number, endY: number, x1: number, y1: number): PathSegment;
    /** 创建三次贝塞尔曲线段 */
    static CubicBezier(endX: number, endY: number, x1: number, y1: number, x2: number, y2: number): PathSegment;
    /** 创建圆弧段 */
    static Arc(endX: number, endY: number, radiusX: number, radiusY: number, xAxisRotation?: number, largeArc?: boolean, clockwise?: boolean): PathSegment;
    /** 创建移动段 */
    static MoveTo(x: number, y: number): PathSegment;
    close(): PathSegment;
    /** 创建闭合段 */
    static Close(): PathSegment;
}
