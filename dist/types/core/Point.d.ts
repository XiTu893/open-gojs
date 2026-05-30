/**
 * Point - 二维点
 */
export declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    /** 是否为只读 */
    private _isReadOnly;
    get isReadOnly(): boolean;
    /** 设置为只读 */
    freeze(): this;
    /** 设置坐标 */
    set(x: number, y: number): this;
    /** 复制 */
    copy(): Point;
    /** 是否等于另一个点 */
    equals(p: Point): boolean;
    /** 近似相等 */
    approximatelyEquals(p: Point, epsilon?: number): boolean;
    /** 加法 */
    add(p: Point): Point;
    /** 减法 */
    subtract(p: Point): Point;
    /** 乘以标量 */
    multiply(s: number): Point;
    /** 除以标量 */
    divide(s: number): Point;
    /** 向量长度 */
    get length(): number;
    /** 距离另一个点 */
    distanceTo(p: Point): number;
    /** 方向角（弧度） */
    direction(): number;
    /** 到另一个点的方向角（弧度） */
    directionTo(p: Point): number;
    /** 归一化 */
    normalize(): Point;
    /** 旋转（弧度） */
    rotate(angle: number): Point;
    /** 点积 */
    dot(p: Point): number;
    /** 叉积 */
    cross(p: Point): number;
    /** 线性插值 */
    static lerp(p1: Point, p2: Point, t: number): Point;
    /** 从字符串解析 "x y" */
    static parse(str: string): Point;
    /** 转换为字符串 */
    toString(): string;
    /** 原点 */
    static readonly Zero: Readonly<Point>;
    static stringify(p: Point): string;
    static stringifyFixed(digits: number): (p: Point) => string;
    static isPoint(p: any): p is Point;
}
