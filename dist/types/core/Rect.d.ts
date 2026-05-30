import { Point } from './Point';
import { Size } from './Size';
/**
 * Rect - 矩形
 */
export declare class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(xOrPoint?: number | Point, yOrSize?: number | Size, width?: number, height?: number);
    private _isReadOnly;
    get isReadOnly(): boolean;
    freeze(): this;
    set(x: number, y: number, width: number, height: number): this;
    copy(): Rect;
    equals(r: Rect): boolean;
    approximatelyEquals(r: Rect, epsilon?: number): boolean;
    /** 左边 */
    get left(): number;
    /** 顶边 */
    get top(): number;
    /** 右边 */
    get right(): number;
    /** 底边 */
    get bottom(): number;
    /** 中心点 */
    get center(): Point;
    /** 左上角 */
    get position(): Point;
    /** 尺寸 */
    get size(): Size;
    /** 是否为空 */
    get isEmpty(): boolean;
    /** 是否有效 */
    get isReal(): boolean;
    /** 是否包含点 */
    containsPoint(p: Point): boolean;
    /** 是否包含矩形 */
    containsRect(r: Rect): boolean;
    /** 与另一个矩形相交 */
    intersect(r: Rect): Rect;
    /** 与另一个矩形合并 */
    union(r: Rect): Rect;
    /** 是否与另一个矩形相交 */
    intersects(r: Rect): boolean;
    /** 扩展边距 */
    inflate(margin: number): Rect;
    inflate(dx: number, dy: number): Rect;
    /** 偏移 */
    offset(dx: number, dy: number): Rect;
    /** 设置位置 */
    setPosition(p: Point): this;
    /** 设置尺寸 */
    setSize(s: Size): this;
    /** 从字符串解析 "x y w h" */
    static parse(str: string): Rect;
    toString(): string;
    static readonly Zero: Readonly<Rect>;
    static readonly NaN: Readonly<Rect>;
    static isRect(r: any): r is Rect;
}
