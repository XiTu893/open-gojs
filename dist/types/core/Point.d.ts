import type { Rect } from './Rect';
import type { Size } from './Size';
import type { Spot } from './Spot';
/**
 * Point - 二维点（对齐官方 go.d.ts:1548 class Point）
 *
 * 官方语义要点（参照 gojs@4.0.4 运行时）：
 * - add/subtract/offset/rotate/scale/normalize/set/setTo 均为**原地修改**并返回 this
 * - direction/directionPoint 返回**度数**（0-360）
 * - equalsApprox 容差为 |dx| < 0.5（官方内部 G.c）
 * - toString 为调试格式 "Point(x,y)"；数据格式用静态 stringify
 * - 构造器只接受 0 或 2 个数字参数，否则抛错
 */
export declare class Point {
    private _x;
    private _y;
    constructor(x?: number, y?: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    /** Modify this Point with new X and Y values. */
    setTo(x: number, y: number): this;
    /** Modify this Point so that its X and Y values are the same as the given Point. */
    set(p: Point): this;
    /** Create a copy of this Point, with the same values. */
    copy(): Point;
    /** Indicates whether the given Point is equal to this Point. */
    equals(p: Point): boolean;
    /** Indicates whether the given point (x, y) is equal to this Point. */
    equalTo(x: number, y: number): boolean;
    /** True when the given Point is nearly equal to this Point（容差 0.5，官方 G.c）。 */
    equalsApprox(p: Point): boolean;
    /** Modify this point so that it is the sum of this Point and the given Point. */
    add(p: Point): this;
    /** Modify this point so that it is the difference of this Point and the given Point. */
    subtract(p: Point): this;
    /** Modify this point by shifting its values with the given DX and DY offsets. */
    offset(dx: number, dy: number): this;
    /** Modify this Point so that it has been rotated about the origin by the given angle (in degrees). */
    rotate(angle: number): this;
    /** Modify this Point so that its X and Y values have been scaled by given factors. */
    scale(sx: number, sy: number): this;
    /** Returns the square of the distance from this Point to a given Point. */
    distanceSquaredPoint(p: Point): number;
    /** Returns the square of the distance from this point to a given point (px, py). */
    distanceSquared(px: number, py: number): number;
    /** Modify this Point so that its X and Y values have been normalized to a unit length. */
    normalize(): this;
    /** Compute the angle (in degrees) from this Point to a given Point. */
    directionPoint(p: Point): number;
    /** Compute the angle (in degrees) from this Point to a given (px, py) point. */
    direction(px: number, py: number): number;
    /** 官方内部 rL：由差值算方向角（度，0-360）；同点为 0。 */
    private static _angle;
    /**
     * 官方内部 G.Du：点与有限线段的比较。
     * 线段上为 0；线段左侧为正、右侧为负；
     * 在无限延长线上但超出线段端点时，越过终点为正、起点之前为负。
     */
    private static _compareWithLineSegment;
    /** If the point is on the finite line segment this returns zero. */
    static compareWithLineSegment(a1x: number, a1y: number, a2x: number, a2y: number, px: number, py: number): number;
    /** Compare this point with a finite line segment given by two Points. */
    compareWithLineSegmentPoint(p: Point, q: Point): number;
    /** 官方内部 G.kr：两条有限线段是否相交。 */
    private static _intersectingLineSegments;
    /** True if two finite straight line segments intersect each other. */
    static intersectingLineSegments(a1x: number, a1y: number, a2x: number, a2y: number, b1x: number, b1y: number, b2x: number, b2y: number): boolean;
    /**
     * 官方内部 G.Il：把本点改为线段上（或端点）离本点最近的点。
     * 返回 this（官方丢弃"是否落在线段内"的布尔结果）。
     */
    projectOntoLineSegment(px: number, py: number, qx: number, qy: number): this;
    /** Modify this point to be the closest point to this point that is on a finite line segment. */
    projectOntoLineSegmentPoint(p: Point, q: Point): this;
    /**
     * 官方内部 G.gm：吸附到无限网格。
     * @param cellwidth 必须大于 0
     * @param cellheight 必须大于 0
     */
    snapToGrid(originX: number, originY: number, cellwidth: number, cellheight: number): this;
    /** Modify this point to be at the nearest point on an infinite grid. */
    snapToGridPoint(origin: Point, cellsize: Size): this;
    /** Modify this Point so that its X and Y values correspond to a particular Spot in a given Rect. */
    setRectSpot(r: Rect, spot: Spot): this;
    /** Modify this Point so that its X and Y values correspond to a particular Spot in a given rectangle. */
    setSpot(x: number, y: number, w: number, h: number, spot: Spot): this;
    /** Returns the square of the distance from the point P to the finite line segment from A to B. */
    static distanceLineSegmentSquared(px: number, py: number, ax: number, ay: number, bx: number, by: number): number;
    /** Returns the square of the distance from the point P to the point Q. */
    static distanceSquared(px: number, py: number, qx: number, qy: number): number;
    /** Returns the angle in degrees of the line from point P to point Q. */
    static direction(px: number, py: number, qx: number, qy: number): number;
    /** True if this Point has X and Y values that are real numbers and not infinity. */
    isReal(): boolean;
    /** 官方调试字符串："Point(1,2)"；数据序列化请用 Point.stringify。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /** 读入由 Point.stringify 产生的字符串。官方容错：空串 → (0,0)，缺 y → 0。 */
    static parse(str: string): Point;
    /** 写出可被 Point.parse 读回的字符串："1 2"。 */
    static stringify(val: Point): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Point) => string;
    /** 冻结本对象（官方通过内部 Object.freeze 实现同义能力）。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /** 线性插值（项目扩展）。 */
    static lerp(p1: Point, p2: Point, t: number): Point;
    /** 原点常量（项目扩展）。 */
    static readonly Zero: Point;
}
