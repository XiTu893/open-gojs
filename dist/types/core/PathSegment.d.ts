import { EnumValue } from './EnumValues';
/**
 * PathSegment - 路径段
 */
export declare class PathSegment {
    static readonly className: string;
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
    /**
     * 官方「按角度」圆弧参数（`PathSegment(SegmentType.Arc, startAngle, sweepAngle, centerX, centerY, radiusX, radiusY)`）。
     * 官方对 Arc 段复用同一批存储：endX→startAngle、endY→sweepAngle、
     * point1X→centerX、point1Y→centerY、point2X→radiusX、point2Y→radiusY。
     * startAngle 为 NaN 表示不是这种用法（此时 endX/endY 仍是 SVG 弧的终点）。
     */
    startAngle: number;
    sweepAngle: number;
    centerX: number;
    centerY: number;
    /** 「按角度」圆弧的几何终点（由 center/radius/startAngle+sweepAngle 推出）。
     *  官方没有这个字段：它保留 endX/endY 为角度值，需要终点的场合（如 Close 段）用 Eo 采样结果。 */
    arcEndX: number;
    arcEndY: number;
    /** 是否为相对坐标 */
    isRelative: boolean;
    constructor(type?: EnumValue, endX?: number, endY?: number, x1?: number, y1?: number, x2?: number, y2?: number);
    /** 官方命名：第一个控制点 X（内部存储字段为 x1） */
    get point1X(): number;
    set point1X(val: number);
    /** 官方命名：第一个控制点 Y（内部存储字段为 y1） */
    get point1Y(): number;
    set point1Y(val: number);
    /** 官方命名：第二个控制点 X（内部存储字段为 x2） */
    get point2X(): number;
    set point2X(val: number);
    /** 官方命名：第二个控制点 Y（内部存储字段为 y2） */
    get point2Y(): number;
    set point2Y(val: number);
    copy(): PathSegment;
    equals(seg: PathSegment): boolean;
    /** 创建直线段 */
    static Line(endX: number, endY: number): PathSegment;
    /** 创建二次贝塞尔曲线段 */
    static QuadraticBezier(endX: number, endY: number, x1: number, y1: number): PathSegment;
    /** 创建三次贝塞尔曲线段 */
    static CubicBezier(endX: number, endY: number, x1: number, y1: number, x2: number, y2: number): PathSegment;
    /**
     * 官方 4.0 的「按角度」圆弧段：`PathFigure` 里就是这种单条 Arc 表示整圆/圆弧
     * （例如箭头 Circle = 一条 Arc: center(4,4) r(4,4) startAngle 0 sweepAngle 360，
     * 包围盒 [0,0,8,8]），不是用三次贝塞尔去近似。
     */
    static AngleArc(centerX: number, centerY: number, radiusX: number, radiusY: number, startAngle: number, sweepAngle: number): PathSegment;
    /** 创建圆弧段 */
    static Arc(endX: number, endY: number, radiusX: number, radiusY: number, xAxisRotation?: number, largeArc?: boolean, clockwise?: boolean): PathSegment;
    /** 创建移动段 */
    static MoveTo(x: number, y: number): PathSegment;
    close(): PathSegment;
    /** 创建闭合段 */
    static Close(): PathSegment;
}
