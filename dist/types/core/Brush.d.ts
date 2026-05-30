import { EnumValue } from './EnumValues';
import { Point } from './Point';
/**
 * Brush - 画刷
 * 支持 Solid（纯色）、Linear（线性渐变）、Radial（径向渐变）
 */
export declare class Brush {
    /** 画刷类型 */
    type: EnumValue;
    /** 纯色颜色值 */
    color: string;
    /** 渐变色标 */
    private _stops;
    /** 线性渐变起点 */
    start: Point;
    /** 线性渐变终点 */
    end: Point;
    /** 径向渐变中心 */
    center: Point;
    /** 径向渐变焦点 */
    focus: Point;
    /** 径向渐变半径 */
    radius: number;
    constructor(type?: EnumValue | string);
    /** 获取色标列表 */
    get stops(): BrushStop[];
    /** 添加色标 */
    addColorStop(offset: number, color: string): this;
    set(props: Record<string, any>): this;
    /** 复制 */
    copy(): Brush;
    /** 创建 Canvas 渐变对象 */
    _createCanvasGradient(ctx: CanvasRenderingContext2D, bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): CanvasGradient | null;
    equals(b: Brush): boolean;
    /** 创建纯色画刷 */
    static Solid(color: string): Brush;
    /** 创建线性渐变画刷 */
    static Linear(startX: number, startY: number, endX: number, endY: number): Brush;
    /** 创建径向渐变画刷 */
    static Radial(centerX: number, centerY: number, radius: number, focusX?: number, focusY?: number): Brush;
    /** 判断是否为 Brush */
    static isBrush(b: any): b is Brush;
    static randomColor(): string;
    static darken(color: string, fraction?: number): string;
    static darkenBy(color: string, fraction: number): string;
    static lighten(color: string, fraction?: number): string;
    static lightenBy(color: string, fraction: number): string;
    static isDark(color: string): boolean;
}
/** 色标 */
export interface BrushStop {
    offset: number;
    color: string;
}
/** BrushLike 类型 */
export type BrushLike = Brush | string | null;
/**
 * 颜色工具函数
 */
export declare namespace Color {
    /** 解析 CSS 颜色字符串为 RGBA */
    function parse(color: string): {
        r: number;
        g: number;
        b: number;
        a: number;
    } | null;
    /** RGBA 转字符串 */
    function toString(r: number, g: number, b: number, a?: number): string;
}
