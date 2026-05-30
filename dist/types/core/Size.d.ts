/**
 * Size - 尺寸
 */
export declare class Size {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
    private _isReadOnly;
    get isReadOnly(): boolean;
    freeze(): this;
    set(width: number, height: number): this;
    copy(): Size;
    equals(s: Size): boolean;
    approximatelyEquals(s: Size, epsilon?: number): boolean;
    /** 是否为空（宽或高为0） */
    get isEmpty(): boolean;
    /** 是否有效（宽和高非负） */
    get isReal(): boolean;
    /** 加法 */
    add(s: Size): Size;
    /** 减法 */
    subtract(s: Size): Size;
    /** 乘以标量 */
    multiply(s: number): Size;
    /** 除以标量 */
    divide(s: number): Size;
    /** 从字符串解析 "w h" */
    static parse(str: string): Size;
    toString(): string;
    static readonly Zero: Readonly<Size>;
    static readonly NaN: Readonly<Size>;
    static stringify(s: Size): string;
    static isSize(s: any): s is Size;
}
