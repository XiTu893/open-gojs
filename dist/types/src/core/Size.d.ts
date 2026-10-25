/**
 * Size - 宽高尺寸（对齐官方 go.d.ts:1882 class Size）
 *
 * 官方语义要点：
 * - 宽高必须非负（负数抛错），NaN 允许
 * - 构造器只接受 0 或 2 个数字参数，否则抛错
 * - inflate 原地修改，收缩不越过 0
 * - isReal() 是方法而非属性
 * - toString 为调试格式 "Size(w,h)"
 */
export declare class Size {
    private _width;
    private _height;
    constructor(width?: number, height?: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    /** Modify this Size with new Width and Height values. */
    setTo(w: number, h: number): this;
    /** Modify this Size so that its Width and Height values are the same as the given Size. */
    set(s: Size): this;
    /** Create a copy of this Size, with the same values. */
    copy(): Size;
    /** Indicates whether the given Size is equal to the current Size. */
    equals(s: Size): boolean;
    /** Indicates whether the given size (w, h) is equal to this Size. */
    equalTo(w: number, h: number): boolean;
    /** True when the given Size is nearly equal to this Size（容差 0.5，官方 G.c）。 */
    equalsApprox(s: Size): boolean;
    /**
     * Modify this Size so that its width and height are changed by the given distances.
     * 负值收缩，但不会小于零。
     */
    inflate(w: number, h: number): this;
    /** True if this Size has Width and Height values that are real numbers and not infinity. */
    isReal(): boolean;
    /** 官方调试字符串："Size(3,4)"；数据序列化请用 Size.stringify。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /** 读入由 Size.stringify 产生的字符串。官方容错：空串 → (0,0)，缺 h → 0。 */
    static parse(str: string): Size;
    /** 写出可被 Size.parse 读回的字符串："1 2"。 */
    static stringify(val: Size): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Size) => string;
    /** 冻结本对象。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /** 是否为空（宽或高 <= 0；项目扩展，官方 Size 无 isEmpty）。 */
    isEmpty(): boolean;
    /** 零尺寸常量（项目扩展）。 */
    static readonly Zero: Size;
    /** 未测量占位常量（项目扩展，等价官方内部 Size.NaN）。 */
    static readonly NaN: Size;
}
