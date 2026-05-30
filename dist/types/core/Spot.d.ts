/**
 * Spot - 定位点
 * 用归一化坐标 (0-1) + 偏移量表示一个位置
 */
export declare class Spot {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    constructor(x?: number, y?: number, offsetX?: number, offsetY?: number);
    private _isReadOnly;
    get isReadOnly(): boolean;
    freeze(): this;
    set(x: number, y: number, offsetX?: number, offsetY?: number): this;
    copy(): Spot;
    equals(s: Spot): boolean;
    approximatelyEquals(s: Spot, epsilon?: number): boolean;
    /** 是否为默认值 */
    get isDefault(): boolean;
    /** 是否为无特殊位置 */
    get isNone(): boolean;
    /** 是否无偏移 */
    get hasNoOffset(): boolean;
    /** 在给定矩形中的实际坐标 */
    positionInRect(r: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): {
        x: number;
        y: number;
    };
    toString(): string;
    static readonly TopLeft: Spot;
    static readonly Top: Spot;
    static readonly TopCenter: Spot;
    static readonly TopRight: Spot;
    static readonly Left: Spot;
    static readonly CenterLeft: Spot;
    static readonly Center: Spot;
    static readonly CenterRight: Spot;
    static readonly Right: Spot;
    static readonly BottomLeft: Spot;
    static readonly Bottom: Spot;
    static readonly BottomCenter: Spot;
    static readonly BottomRight: Spot;
    static readonly Default: Spot;
    static readonly None: Spot;
    static readonly TopSide: Spot;
    static readonly BottomSide: Spot;
    static readonly LeftSide: Spot;
    static readonly RightSide: Spot;
    static readonly TopLeftSides: Spot;
    static readonly TopRightSides: Spot;
    static readonly BottomLeftSides: Spot;
    static readonly BottomRightSides: Spot;
    static readonly LeftRightSides: Spot;
    static readonly TopBottomSides: Spot;
    static readonly AllSides: Spot;
    static parse(str: string): Spot;
    static stringify(s: Spot): string;
    static isSpot(s: any): s is Spot;
}
