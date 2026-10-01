/**
 * Spot - 定位点（对齐官方 go.d.ts:2580 class Spot）
 *
 * 官方语义要点：
 * - 点位 Spot：x,y ∈ [0,1] + 绝对偏移 offsetX/offsetY；isSpot() = x,y 均非 NaN
 * - 特殊值用 NaN 表示：None=(NaN,NaN,0,0)、Default=(NaN,NaN,-1,0)、
 *   边侧 (NaN,NaN,1,位掩码)：top=1 left=2 right=4 bottom=8
 * - equals 对 NaN 做等价判断（NaN 视为相等）；isNone/isSide/... 是方法而非属性
 * - includesSide(s)：超集语义 (this.oy & s.oy) === s.oy
 * - 仅 copy() 和 opposite() 分配新对象；静态常量均被冻结
 * - set(s) 接受 Spot；setTo(x,y,offx,offy) 才是四数值
 */
export declare class Spot {
    private _x;
    private _y;
    private _offsetX;
    private _offsetY;
    constructor(x?: number, y?: number, offx?: number, offy?: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get offsetX(): number;
    set offsetX(value: number);
    get offsetY(): number;
    set offsetY(value: number);
    /** Modify this Spot with new X, Y, OffsetX, and OffsetY values. */
    setTo(x: number, y: number, offx: number, offy: number): this;
    /** Modify this Spot so that its values are the same as the given Spot. */
    set(s: Spot): this;
    /** Create a copy of this Spot, with the same values. */
    copy(): Spot;
    /**
     * Two spots are equal if all four property values are the same.
     * 官方对 NaN 做等价判断（NaN 与 NaN 视为相等）。
     */
    equals(s: Spot): boolean;
    /** Return a new spot that is opposite this spot. */
    opposite(): Spot;
    /**
     * This predicate is true if this Spot is a side that includes the side(s)
     * given by the argument Spot（超集语义）。
     */
    includesSide(side: Spot): boolean;
    /** True if this is a specific spot point, not a side nor Spot.None. */
    isSpot(): boolean;
    /** True if this is an unspecific special spot, such as Spot.None or Spot.Default or one of the side spots. */
    isNoSpot(): boolean;
    /** True if this is a special spot referring to one (or more) of the sides. */
    isSide(): boolean;
    /** True if this is a special spot referring to no particular spot point or side. */
    isNone(): boolean;
    /** True if this is a special spot indicating that the real spot value will come from another source. */
    isDefault(): boolean;
    /** 官方调试字符串；数据序列化请用 Spot.stringify（非点位输出命名，如 "TopSide"）。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /** 读入由 Spot.stringify 产生的字符串；也接受命名（"TopCenter"、"TopSide"、"None" 等）。 */
    static parse(str: string): Spot;
    /** 写出可被 Spot.parse 读回的字符串；点位为 "x y ox oy"，特殊值为命名（如 "TopSide"）。 */
    static stringify(val: Spot): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Spot) => string;
    /** 冻结本对象（官方静态常量即被冻结）。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /**
     * 在给定矩形中的实际坐标（项目扩展，官方无此成员）。
     *
     * 兼容旧版（阶段 1 前）边侧/Default 的点位表示语义：
     * - 边侧 Spot 映射为旧版点位 + 偏移（见 _legacySidePoint）
     * - Default 映射为左上角（旧版 (0,0) 表示）
     * - None 保持 NaN（与旧版一致）
     */
    positionInRect(r: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): {
        x: number;
        y: number;
    };
    /** 官方位掩码（top=1 left=2 right=4 bottom=8）→ 旧版点位表示；未知组合回退中心。 */
    private static _legacySidePoint;
    /** 创建冻结的边侧 Spot（官方内部 _e 的等价物）。 */
    private static _side;
    /** 无特定位置。 */
    static readonly None: Spot;
    /** 真实值来自其他来源。 */
    static readonly Default: Spot;
    static readonly TopLeft: Spot;
    static readonly TopCenter: Spot;
    static readonly TopRight: Spot;
    static readonly LeftCenter: Spot;
    static readonly Center: Spot;
    static readonly RightCenter: Spot;
    static readonly BottomLeft: Spot;
    static readonly BottomCenter: Spot;
    static readonly BottomRight: Spot;
    /** A synonym for Spot.TopCenter. */
    static readonly MiddleTop: Spot;
    /** A synonym for Spot.LeftCenter. */
    static readonly MiddleLeft: Spot;
    /** A synonym for Spot.RightCenter. */
    static readonly MiddleRight: Spot;
    /** A synonym for Spot.BottomCenter. */
    static readonly MiddleBottom: Spot;
    /** A synonym for Spot.TopCenter. */
    static readonly Top: Spot;
    /** A synonym for Spot.LeftCenter. */
    static readonly Left: Spot;
    /** A synonym for Spot.RightCenter. */
    static readonly Right: Spot;
    /** A synonym for Spot.BottomCenter. */
    static readonly Bottom: Spot;
    static readonly TopSide: Spot;
    static readonly LeftSide: Spot;
    static readonly RightSide: Spot;
    static readonly BottomSide: Spot;
    static readonly TopBottomSides: Spot;
    static readonly LeftRightSides: Spot;
    static readonly TopLeftSides: Spot;
    static readonly TopRightSides: Spot;
    static readonly BottomLeftSides: Spot;
    static readonly BottomRightSides: Spot;
    static readonly NotTopSide: Spot;
    static readonly NotLeftSide: Spot;
    static readonly NotRightSide: Spot;
    static readonly NotBottomSide: Spot;
    static readonly AllSides: Spot;
}
