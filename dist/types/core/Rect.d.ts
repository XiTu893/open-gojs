import { Point } from './Point';
import { Size } from './Size';
import type { Spot } from './Spot';
import type { Margin } from './Margin';
/**
 * Rect - 矩形（对齐官方 go.d.ts:2013 class Rect）
 *
 * 官方语义要点：
 * - 四种构造：()、(x,y,w,h)、(Point,Point)、(Point,Size)；宽高必须非负（NaN 允许）
 * - (Point,Point) 构造为两角包围盒（min/abs）
 * - offset/inflate/grow/union/intersect/addMargin/subtractMargin 均为**原地修改**
 * - isEmpty() 是方法且语义为 width===0 && height===0
 * - left/top setter 直接赋值；right/bottom setter 平移保持尺寸
 * - toString 为调试格式 "Rect(x,y,w,h)"
 */
export declare class Rect {
    private _x;
    private _y;
    private _width;
    private _height;
    constructor(x?: number | Point, y?: number | Point | Size, w?: number, h?: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get left(): number;
    set left(value: number);
    get top(): number;
    set top(value: number);
    get right(): number;
    set right(value: number);
    get bottom(): number;
    set bottom(value: number);
    get position(): Point;
    set position(value: Point);
    get size(): Size;
    set size(value: Size);
    get center(): Point;
    /** 设置中心点只是平移 X/Y，不改尺寸。 */
    set center(value: Point);
    get centerX(): number;
    set centerX(value: number);
    get centerY(): number;
    set centerY(value: number);
    /** Modify this Rect with new X, Y, Width, and Height values. */
    setTo(x: number, y: number, w: number, h: number): this;
    /** Modify this Rect so that its X, Y, Width, and Height values are the same as the given Rect. */
    set(r: Rect): this;
    /** Modify this Rect so that its X and Y values are the same as the given Point. */
    setPoint(p: Point): this;
    /** Modify this Rect so that its Width and Height values are the same as the given Size. */
    setSize(s: Size): this;
    /** Create a copy of this Rect, with the same values. */
    copy(): Rect;
    /** Indicates whether the given Rect is equal to the current Rect. */
    equals(r: Rect): boolean;
    /** Indicates whether the given values are equal to this Rect. */
    equalTo(x: number, y: number, w: number, h: number): boolean;
    /** True when the given Rect is nearly equal to this Rect（容差 0.5，官方 G.u）。 */
    equalsApprox(r: Rect): boolean;
    /** True when the given values are nearly equal to this Rect（容差 0.5，官方未在 d.ts 记录）。 */
    equalsApproxTo(x: number, y: number, w: number, h: number): boolean;
    /** True when the given Rect is very nearly equal to this Rect（容差 5e-8，官方 G.H）。 */
    equalsApproxClose(r: Rect): boolean;
    /** Indicates whether this Rect contains the given Point（边界含）。 */
    containsPoint(p: Point): boolean;
    /** Indicates whether this Rect contains the given Rect（边界含）。 */
    containsRect(r: Rect): boolean;
    /** Indicates whether this Rect contains the given Point/Rect（w/h 默认 0）。 */
    contains(x: number, y: number, w?: number, h?: number): boolean;
    /** Modify this Rect by shifting its values with the given DX and DY offsets. */
    offset(dx: number, dy: number): this;
    /**
     * Modify this Rect so that its width and height are changed on all four sides.
     * 负值收缩，但不会小于零（保持中心）。
     */
    inflate(w: number, h: number): this;
    /** Modify this Rect by adding the given Margin to each side of the Rect. */
    addMargin(m: Margin): this;
    /** Modify this Rect by subtracting the given Margin from each side of the Rect. */
    subtractMargin(m: Margin): this;
    /** Modifies this Rect by adding some distance to each side of the Rect (上右下左)。 */
    grow(t: number, r: number, b: number, l: number): this;
    /** 官方内部 ux：按四边增量调整，收缩截断至 0 并保持中心。 */
    private _grow;
    /** Modify this Rect so that it is the intersection of this Rect and the given Rect. */
    intersectRect(r: Rect): this;
    /** Modify this Rect so that it is the intersection of this Rect and the rectangle defined by x, y, w, h. */
    intersect(x: number, y: number, w: number, h: number): this;
    private _intersect;
    /** Determine if a given Rect is partly or wholly inside of this Rect. */
    intersectsRect(r: Rect): boolean;
    /** Determine if this Rect partly or wholly overlaps the rectangle defined by x, y, w, h. */
    intersects(x: number, y: number, w: number, h: number): boolean;
    /** Modify this Rect to be exactly big enough to contain both the original Rect and the given Point. */
    unionPoint(p: Point): this;
    /** Modify this Rect to be exactly big enough to contain this Rect and the given Rect. */
    unionRect(r: Rect): this;
    /** Modify this Rect to be exactly big enough to contain the original Rect and the given rectangular area. */
    union(x: number, y: number, w?: number, h?: number): this;
    private _union;
    /** Modify this Rect so that a given Spot is at a given (x,y) point using this Rect's size. */
    setSpot(x: number, y: number, spot: Spot): this;
    /**
     * Return which side/direction of the Rect is closest to the given x,y point.
     * @returns 0 (right), 90 (bottom), 180 (left), or 270 (top)
     */
    nearestSideDirection(x: number, y: number): number;
    /** Return which side/direction of the Rect is closest to the given Point. */
    nearestSideDirectionPoint(p: Point): number;
    /** 官方内部 gx：i=true 时只返回 0/90/180/270 四个正方向。 */
    private static _nearestSideDirection;
    /** True if this Rect has X, Y, Width, and Height values that are real numbers and not infinity. */
    isReal(): boolean;
    /** True if this Rect has a Width and Height of zero. */
    isEmpty(): boolean;
    /** 官方调试字符串："Rect(x,y,w,h)"；数据序列化请用 Rect.stringify。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /** 读入由 Rect.stringify 产生的字符串。官方容错：缺项 → 0。 */
    static parse(str: string): Rect;
    /** 写出可被 Rect.parse 读回的字符串："1 2 3 4"。 */
    static stringify(val: Rect): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Rect) => string;
    /** This static function indicates whether a Rect contains the given Point/Rect. */
    static contains(rx: number, ry: number, rw: number, rh: number, x: number, y: number, w?: number, h?: number): boolean;
    /** This static function indicates whether a Rect partly or wholly overlaps the given Rect. */
    static intersects(rx: number, ry: number, rw: number, rh: number, x: number, y: number, w: number, h: number): boolean;
    /** True if a rectangular area is intersected by a finite straight line segment. */
    static intersectsLineSegment(x: number, y: number, w: number, h: number, p1x: number, p1y: number, p2x: number, p2y: number): boolean;
    /** 冻结本对象。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /** 零矩形常量（项目扩展）。 */
    static readonly Zero: Rect;
    /** 未测量占位常量（项目扩展）。 */
    static readonly NaN: Rect;
}
