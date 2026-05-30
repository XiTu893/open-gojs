import { PathFigure } from './PathFigure';
import { List } from './List';
import { Rect } from './Rect';
/**
 * Geometry - 几何路径定义
 */
export declare class Geometry {
    /** 图形集合 */
    private _figures;
    /** 默认图形 */
    private _defaultFigure;
    /** 边界矩形 */
    private _bounds;
    /** 是否包含奇偶填充 */
    fillRule: string;
    /** 图形名称（用于 figure 属性） */
    name: string;
    constructor(figures?: PathFigure | PathFigure[]);
    /** 获取默认图形 */
    get defaultFigure(): PathFigure;
    /** 获取图形集合 */
    get figures(): List<PathFigure>;
    /** 添加图形 */
    add(fig: PathFigure): this;
    set(props: Record<string, any>): this;
    /** 移除图形 */
    remove(fig: PathFigure): boolean;
    /** 清空图形 */
    clear(): this;
    /** 获取边界矩形 */
    get bounds(): Rect;
    /** 计算边界矩形 */
    private computeBounds;
    copy(): Geometry;
    equals(geo: Geometry): boolean;
    /** 从 SVG 路径字符串解析 */
    static parse(str: string): Geometry;
    /** 从 GoJS 几何字符串格式解析 */
    static parseString(str: string, width?: number, height?: number): Geometry;
    /** 转换为 SVG 路径字符串 */
    toSvgString(): string;
    /** 创建矩形几何 */
    static rectangle(width: number, height: number): Geometry;
    /** 创建圆角矩形几何 */
    static roundedRectangle(width: number, height: number, cornerRadius: number): Geometry;
    /** 创建椭圆几何 */
    static ellipse(width: number, height: number): Geometry;
    /** 创建线段几何 */
    static line(x1: number, y1: number, x2: number, y2: number): Geometry;
    static triangle(width: number, height: number): Geometry;
    static diamond(width: number, height: number): Geometry;
    static string(width: number, height: number, top?: number, left?: number, bottom?: number, right?: number): Geometry;
    static isGeometry(obj: any): boolean;
    static stringify(geo: Geometry): string;
    close(): Geometry;
}
