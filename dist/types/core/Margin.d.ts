/**
 * Margin - 边距（上右下左）
 */
export declare class Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
    constructor(margin: number);
    constructor(top: number, right: number, bottom: number, left: number);
    constructor(topBottom?: number, right?: number, bottom?: number, left?: number);
    private _isReadOnly;
    get isReadOnly(): boolean;
    freeze(): this;
    set(top: number, right?: number, bottom?: number, left?: number): this;
    copy(): Margin;
    equals(m: Margin): boolean;
    /** 是否所有边距都为0 */
    get isZero(): boolean;
    /** 水平边距总和 */
    get horizontal(): number;
    /** 垂直边距总和 */
    get vertical(): number;
    /** 加法 */
    add(m: Margin): Margin;
    /** 减法 */
    subtract(m: Margin): Margin;
    /** 从字符串解析 "t r b l" 或 "all" */
    static parse(str: string): Margin;
    toString(): string;
    static readonly Zero: Readonly<Margin>;
    static isMargin(m: any): m is Margin;
}
/** MarginLike 类型 - 可以是 Margin 对象或数字 */
export type MarginLike = Margin | number;
