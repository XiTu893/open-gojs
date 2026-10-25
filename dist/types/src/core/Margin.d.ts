/**
 * Margin - 边距（上右下左）（对齐官方 go.d.ts:2435 class Margin）
 *
 * 官方语义要点：
 * - 构造器：0 参全 0；1 参四边同值；2 参 top/bottom=第一参、right/left=第二参；3 参抛错；4 参 t,r,b,l
 * - set(m) 只接受 Margin；setTo(t,r,b,l) 四值
 * - equalsApprox 容差 0.5（官方 G.u）
 * - isReal() 是方法；toString 为调试格式 "Margin(t,r,b,l)"
 */
export declare class Margin {
    private _top;
    private _right;
    private _bottom;
    private _left;
    constructor(t?: number, r?: number, b?: number, l?: number);
    get top(): number;
    set top(value: number);
    get right(): number;
    set right(value: number);
    get bottom(): number;
    set bottom(value: number);
    get left(): number;
    set left(value: number);
    /** Modify this Margin with new Top, Right, Bottom, and Left values. */
    setTo(t: number, r: number, b: number, l: number): this;
    /** Modify this Margin so that its values are the same as the given Margin. */
    set(m: Margin): this;
    /** Create a copy of this Margin, with the same values. */
    copy(): Margin;
    /** Indicates whether the given Margin is equal to this Margin. */
    equals(m: Margin): boolean;
    /** Indicates whether the given values are equal to this Margin. */
    equalTo(t: number, r: number, b: number, l: number): boolean;
    /** True when the given Margin is nearly equal to this Margin（容差 0.5，官方 G.u）。 */
    equalsApprox(m: Margin): boolean;
    /** True if this Margin has values that are real numbers and not infinity. */
    isReal(): boolean;
    /** 官方调试字符串："Margin(t,r,b,l)"；数据序列化请用 Margin.stringify。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /**
     * 读入由 Margin.stringify 产生的字符串（"t r b l"，部分缺失时按官方规则退化：
     * 1 值 → 四边同值；2 值 → t/b、r/l；3 值或更多 → 只取前两值）。
     */
    static parse(str: string): Margin;
    /** 写出可被 Margin.parse 读回的字符串："1 2 3 4"。 */
    static stringify(val: Margin): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Margin) => string;
    /** 冻结本对象。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /** 零边距常量（项目扩展，官方无 Margin.Zero）。 */
    static readonly Zero: Margin;
    /** 类型判断（项目扩展，内部 RowColumnDefinition 使用）。 */
    static isMargin(m: unknown): m is Margin;
}
/** MarginLike 类型 - 可以是 Margin 对象或数字 */
export type MarginLike = Margin | number;
