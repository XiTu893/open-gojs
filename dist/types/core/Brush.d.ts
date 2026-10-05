import { EnumValue } from './EnumValues';
import { Point } from './Point';
/**
 * Brush - 画刷
 * 支持 Solid（纯色）、Linear（线性渐变）、Radial（径向渐变）
 */
export declare class Brush {
    static readonly className: string;
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
    /** 官方 `Brush(type?, colorStops?)`：colorStops 对象中数字键为色标，其余键直接赋值（如 start/end） */
    constructor(type?: EnumValue | string, colorStops?: Record<string, any>);
    /** 获取色标列表 */
    get stops(): BrushStop[];
    /** 添加色标（官方：Solid 上加色标会自动转为 Linear） */
    addColorStop(offset: number, color: string): this;
    set(props: Record<string, any>): this;
    /** 复制（官方 `copy()`：pattern/zp 共享引用） */
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
    /** 官方 U.wm：crypto.getRandomValues 单位浮点 */
    private static _wm;
    /** 官方 Brush.randomColor(min=128, max=max(min,255))：'#rrggbb'，经 crypto 随机 */
    static randomColor(min?: number, max?: number): string;
    static darken(color: string, fraction?: number, space?: number): string;
    static darkenBy(color: string, fraction: number, space?: number): string;
    static lighten(color: string, fraction?: number, space?: number): string;
    static lightenBy(color: string, fraction: number, space?: number): string;
    /** 官方 sRGB gamma 解码（sRGB → 线性） */
    private static _yN;
    /** 官方 sRGB gamma 编码（线性 → sRGB） */
    private static _wN;
    /**
     * 官方 Brush.Wd/Ho：解析颜色 → 按颜色空间调整明度（space=3 官方默认 OKLCh）→
     * 返回官方格式 "rgba(r, g, b, a)"。仅实现官方默认的 OKLCh（+未用到的 HSL/Lab 不实现，
     * space 非 3 时原样返回）。
     */
    private static _wd;
    static isDark(color: string): boolean;
    private _startRadius;
    private _endRadius;
    private _pattern;
    /** 官方 Brush.startRadius（Radial 起始半径） */
    get startRadius(): number;
    set startRadius(value: number);
    /** 官方 Brush.endRadius（Radial 结束半径） */
    get endRadius(): number;
    set endRadius(value: number);
    /** 官方 Brush.pattern（BrushType.Pattern 使用的位图） */
    get pattern(): HTMLCanvasElement | HTMLImageElement | null;
    set pattern(value: HTMLCanvasElement | HTMLImageElement | null);
    /**
     * 官方 Brush.colorStops：offset → color 的 Map 视图（本项目内部用 BrushStop[] 存储）。
     * 无色标时与官方一样返回 null。
     */
    get colorStops(): Map<number, string> | null;
    set colorStops(value: Map<number, string> | null);
    /** 官方 Brush.toString */
    toString(): string;
    /** 官方 Brush.lightenBy（实例版，就地变亮） */
    lightenBy(fraction?: number, mode?: EnumValue): this;
    /** 官方 Brush.darkenBy（实例版，就地变暗） */
    darkenBy(fraction?: number, mode?: EnumValue): this;
    /** 官方 Brush.isDark（实例版） */
    isDark(): boolean;
    /** 官方 Brush.isValidColor */
    static isValidColor(color: string): boolean;
    /** 官方 Brush.mix：把两个颜色按 fraction 混合 */
    static mix(color1: string, color2: string, fraction?: number): string;
    /** @deprecated 用 ColorSpace.HSL */
    static readonly HSL: EnumValue;
    /** @deprecated 用 BrushType.Pattern */
    static readonly Pattern: EnumValue;
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
