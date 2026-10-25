import { EnumValue } from './EnumValues';
import { Point } from './Point';
/**
 * Brush - 画刷
 * 支持 Solid（纯色）、Linear（线性渐变）、Radial（径向渐变）
 */
export declare class Brush {
    static readonly className: string;
    /** 画刷类型（官方 Brush.J；经 setter 在 NoSpot 时按类型补 start/end 默认） */
    private _type;
    /** 纯色颜色值 */
    color: string;
    /** 渐变色标 */
    private _stops;
    /** 渐变起点（Linear 默认 TopCenter=(0.5,0)、Radial 默认 Center=(0.5,0.5)；可存 Spot 实例） */
    private _start;
    /** 渐变终点（Linear 默认 BottomCenter=(0.5,1)、Radial 默认 Center=(0.5,0.5)） */
    private _end;
    /** 官方语义：start 处于 Spot.None（未按类型初始化过） */
    private _startNoSpot;
    /** 官方语义：end 处于 Spot.None（未按类型初始化过） */
    private _endNoSpot;
    /** 径向渐变中心（旧字段；renderer 渐变已按官方 makeBrush 用 start/end/startRadius/endRadius） */
    center: Point;
    /** 径向渐变焦点（旧字段） */
    focus: Point;
    /** 径向渐变半径（旧字段，max(w,h) 的分数） */
    radius: number;
    /** 官方 `Brush(type?, colorStops?)`：字符串先按 BrushType 名解析（Solid/Linear/Radial/Pattern），
     *  否则当纯色颜色；对象作第一参数时当 colorStops。色标数字键 addColorStop，其余键直接赋值
     *  （如 start/end/startRadius/endRadius）。构造按初始类型设 start/end 默认（官方 fe/Ds）。 */
    constructor(type?: EnumValue | string | Record<string, any>, colorStops?: Record<string, any>);
    get type(): EnumValue;
    /** 官方 `set type`：NoSpot 的 start/end 按新类型补默认（2→TopCenter/BottomCenter，3→Center/Center） */
    set type(value: EnumValue | string);
    get start(): Point;
    set start(value: Point);
    get end(): Point;
    set end(value: Point);
    /** BrushType 名（'Solid'/'Linear'/'Radial'/'Pattern'）→ 枚举值；非类型名返回 null（当颜色处理） */
    private static _typeFromName;
    /** EnumValue / 数字（1..4）→ BrushType 枚举值 */
    private static _typeFromValue;
    /** 官方构造/set type 的 fe/Ds 默认：Linear→TopCenter/BottomCenter，Radial→Center/Center；NoSpot 时才补 */
    private static _applyTypeStartEnd;
    /** 获取色标列表 */
    get stops(): BrushStop[];
    /** 添加色标（官方：Solid 上加色标会自动转为 Linear） */
    addColorStop(offset: number, color: string): this;
    set(props: Record<string, any>): this;
    /** 复制（官方 `copy()`：start/end/半径/色标全带过去） */
    copy(): Brush;
    /** 创建 Canvas 渐变对象（官方 makeBrush：spot 分数×bounds + offsetX/offsetY；radial 半径按官方 NaN 默认） */
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
    /** 创建径向渐变画刷（旧 API：center/focus/radius 为 max(w,h) 分数；renderer 走 start/end，
     *  这里同步把 start=focus、end=center 写进官方字段，endRadius 用官方默认 max/2 ≡ radius 0.5） */
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
    /** 官方默认 endRadius=NaN → makeBrush 里取 max(w,h)/2 */
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
