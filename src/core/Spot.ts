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
export class Spot {
  private _x: number;
  private _y: number;
  private _offsetX: number;
  private _offsetY: number;

  constructor(x?: number, y?: number, offx?: number, offy?: number) {
    if (x === undefined) {
      this._x = 0;
      this._y = 0;
      this._offsetX = 0;
      this._offsetY = 0;
    } else {
      this._x = x;
      this._y = y === undefined ? 0 : y;
      this._offsetX = offx === undefined ? 0 : offx;
      this._offsetY = offy === undefined ? 0 : offy;
    }
  }

  // ============ 官方属性 ============

  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
  }

  get offsetX(): number {
    return this._offsetX;
  }
  set offsetX(value: number) {
    this._offsetX = value;
  }

  get offsetY(): number {
    return this._offsetY;
  }
  set offsetY(value: number) {
    this._offsetY = value;
  }

  /** Modify this Spot with new X, Y, OffsetX, and OffsetY values. */
  setTo(x: number, y: number, offx: number, offy: number): this {
    this._x = x;
    this._y = y;
    this._offsetX = offx;
    this._offsetY = offy;
    return this;
  }

  /** Modify this Spot so that its values are the same as the given Spot. */
  set(s: Spot): this {
    this._x = s._x;
    this._y = s._y;
    this._offsetX = s._offsetX;
    this._offsetY = s._offsetY;
    return this;
  }

  /** Create a copy of this Spot, with the same values. */
  copy(): Spot {
    return new Spot(this._x, this._y, this._offsetX, this._offsetY);
  }

  /**
   * Two spots are equal if all four property values are the same.
   * 官方对 NaN 做等价判断（NaN 与 NaN 视为相等）。
   */
  equals(s: Spot): boolean {
    if (!(s instanceof Spot)) return false;
    const xs = this._x === s._x || (isNaN(this._x) && isNaN(s._x));
    const ys = this._y === s._y || (isNaN(this._y) && isNaN(s._y));
    return xs && ys && this._offsetX === s._offsetX && this._offsetY === s._offsetY;
  }

  /** Return a new spot that is opposite this spot. */
  opposite(): Spot {
    return new Spot(1 - this._x, 1 - this._y, -this._offsetX, -this._offsetY);
  }

  /**
   * This predicate is true if this Spot is a side that includes the side(s)
   * given by the argument Spot（超集语义）。
   */
  includesSide(side: Spot): boolean {
    if (!this.isSide()) return false;
    let s = side;
    if (!s.isSide()) {
      if (s.equals(Spot.Left)) s = Spot.LeftSide;
      else if (s.equals(Spot.Right)) s = Spot.RightSide;
      else if (s.equals(Spot.Top)) s = Spot.TopSide;
      else if (s.equals(Spot.Bottom)) s = Spot.BottomSide;
      else return false;
    }
    return (this._offsetY & s._offsetY) === s._offsetY;
  }

  /** True if this is a specific spot point, not a side nor Spot.None. */
  isSpot(): boolean {
    return !isNaN(this._x) && !isNaN(this._y);
  }

  /** True if this is an unspecific special spot, such as Spot.None or Spot.Default or one of the side spots. */
  isNoSpot(): boolean {
    return isNaN(this._x) || isNaN(this._y);
  }

  /** True if this is a special spot referring to one (or more) of the sides. */
  isSide(): boolean {
    return isNaN(this._x) && isNaN(this._y) && this._offsetX === 1 && this._offsetY !== 0;
  }

  /** True if this is a special spot referring to no particular spot point or side. */
  isNone(): boolean {
    return isNaN(this._x) && isNaN(this._y) && this._offsetX === 0 && this._offsetY === 0;
  }

  /** True if this is a special spot indicating that the real spot value will come from another source. */
  isDefault(): boolean {
    return isNaN(this._x) && isNaN(this._y) && this._offsetX === -1 && this._offsetY === 0;
  }

  /** 官方调试字符串；数据序列化请用 Spot.stringify（非点位输出命名，如 "TopSide"）。 */
  toString(): string {
    if (this.isSpot()) {
      return this._offsetX === 0 && this._offsetY === 0
        ? `Spot(${this._x},${this._y})`
        : `Spot(${this._x},${this._y},${this._offsetX},${this._offsetY})`;
    }
    if (this.equals(Spot.None)) return 'None';
    if (this.equals(Spot.TopSide)) return 'TopSide';
    if (this.equals(Spot.LeftSide)) return 'LeftSide';
    if (this.equals(Spot.RightSide)) return 'RightSide';
    if (this.equals(Spot.BottomSide)) return 'BottomSide';
    if (this.equals(Spot.TopBottomSides)) return 'TopBottomSides';
    if (this.equals(Spot.LeftRightSides)) return 'LeftRightSides';
    if (this.equals(Spot.TopLeftSides)) return 'TopLeftSides';
    if (this.equals(Spot.TopRightSides)) return 'TopRightSides';
    if (this.equals(Spot.BottomLeftSides)) return 'BottomLeftSides';
    if (this.equals(Spot.BottomRightSides)) return 'BottomRightSides';
    if (this.equals(Spot.NotTopSide)) return 'NotTopSide';
    if (this.equals(Spot.NotLeftSide)) return 'NotLeftSide';
    if (this.equals(Spot.NotRightSide)) return 'NotRightSide';
    if (this.equals(Spot.NotBottomSide)) return 'NotBottomSide';
    if (this.equals(Spot.AllSides)) return 'AllSides';
    if (this.equals(Spot.Default)) return 'Default';
    return 'None';
  }

  /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
  static readonly className: string = 'Spot';

  // ============ 官方静态函数 ============

  /** 读入由 Spot.stringify 产生的字符串；也接受命名（"TopCenter"、"TopSide"、"None" 等）。 */
  static parse(str: string): Spot {
    if (typeof str !== 'string') return new Spot();
    const t = str.trim();
    if (t === 'None') return Spot.None;
    if (t === 'TopLeft') return Spot.TopLeft;
    if (t === 'Top' || t === 'TopCenter' || t === 'MiddleTop') return Spot.TopCenter;
    if (t === 'TopRight') return Spot.TopRight;
    if (t === 'Left' || t === 'LeftCenter' || t === 'MiddleLeft') return Spot.LeftCenter;
    if (t === 'Center') return Spot.Center;
    if (t === 'Right' || t === 'RightCenter' || t === 'MiddleRight') return Spot.RightCenter;
    if (t === 'BottomLeft') return Spot.BottomLeft;
    if (t === 'Bottom' || t === 'BottomCenter' || t === 'MiddleBottom') return Spot.BottomCenter;
    if (t === 'BottomRight') return Spot.BottomRight;
    if (t === 'TopSide') return Spot.TopSide;
    if (t === 'LeftSide') return Spot.LeftSide;
    if (t === 'RightSide') return Spot.RightSide;
    if (t === 'BottomSide') return Spot.BottomSide;
    if (t === 'TopBottomSides') return Spot.TopBottomSides;
    if (t === 'LeftRightSides') return Spot.LeftRightSides;
    if (t === 'TopLeftSides') return Spot.TopLeftSides;
    if (t === 'TopRightSides') return Spot.TopRightSides;
    if (t === 'BottomLeftSides') return Spot.BottomLeftSides;
    if (t === 'BottomRightSides') return Spot.BottomRightSides;
    if (t === 'NotTopSide') return Spot.NotTopSide;
    if (t === 'NotLeftSide') return Spot.NotLeftSide;
    if (t === 'NotRightSide') return Spot.NotRightSide;
    if (t === 'NotBottomSide') return Spot.NotBottomSide;
    if (t === 'AllSides') return Spot.AllSides;
    if (t === 'Default') return Spot.Default;
    const parts = t.split(' ');
    let i = 0;
    let x = 0;
    for (; parts[i] === ''; ) i++;
    let n = parts[i++];
    if (n !== undefined && n.length > 0) x = parseFloat(n);
    let y = 0;
    for (; parts[i] === ''; ) i++;
    n = parts[i++];
    if (n !== undefined && n.length > 0) y = parseFloat(n);
    let ox = 0;
    for (; parts[i] === ''; ) i++;
    n = parts[i++];
    if (n !== undefined && n.length > 0) ox = parseFloat(n);
    let oy = 0;
    for (; parts[i] === ''; ) i++;
    n = parts[i++];
    if (n !== undefined && n.length > 0) oy = parseFloat(n);
    return new Spot(x, y, ox, oy);
  }

  /** 写出可被 Spot.parse 读回的字符串；点位为 "x y ox oy"，特殊值为命名（如 "TopSide"）。 */
  static stringify(val: Spot): string {
    return val.isSpot()
      ? val._x.toString() + ' ' + val._y.toString() + ' ' + val._offsetX.toString() + ' ' + val._offsetY.toString()
      : val.toString();
  }

  /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
  static stringifyFixed(digits: number): (val: Spot) => string {
    if (typeof digits !== 'number') throw new Error('stringifyFixed:digits must be a number');
    return (val: Spot) =>
      val._x.toFixed(digits) + ' ' + val._y.toFixed(digits) + ' ' + val._offsetX.toFixed(digits) + ' ' + val._offsetY.toFixed(digits);
  }

  // ============ 项目扩展（官方无此成员，内部代码使用） ============

  /** 冻结本对象（官方静态常量即被冻结）。 */
  freeze(): this {
    Object.freeze(this);
    return this;
  }

  /** 是否已被冻结为只读。 */
  get isReadOnly(): boolean {
    return Object.isFrozen(this);
  }

  /**
   * 在给定矩形中的实际坐标（项目扩展，官方无此成员）。
   *
   * 兼容旧版（阶段 1 前）边侧/Default 的点位表示语义：
   * - 边侧 Spot 映射为旧版点位 + 偏移（见 _legacySidePoint）
   * - Default 映射为左上角（旧版 (0,0) 表示）
   * - None 保持 NaN（与旧版一致）
   */
  positionInRect(r: { x: number; y: number; width: number; height: number }): { x: number; y: number } {
    if (this.isSide()) {
      const m = Spot._legacySidePoint(this._offsetY);
      return { x: r.x + m.x * r.width + m.ox, y: r.y + m.y * r.height + m.oy };
    }
    if (this.isDefault()) {
      return { x: r.x, y: r.y };
    }
    return { x: r.x + this._x * r.width + this._offsetX, y: r.y + this._y * r.height + this._offsetY };
  }

  /** 官方位掩码（top=1 left=2 right=4 bottom=8）→ 旧版点位表示；未知组合回退中心。 */
  private static _legacySidePoint(bits: number): { x: number; y: number; ox: number; oy: number } {
    switch (bits) {
      case 1: return { x: 0.5, y: 0, ox: 0, oy: -1 };   // TopSide
      case 8: return { x: 0.5, y: 1, ox: 0, oy: 1 };    // BottomSide
      case 2: return { x: 0, y: 0.5, ox: -1, oy: 0 };   // LeftSide
      case 4: return { x: 1, y: 0.5, ox: 1, oy: 0 };    // RightSide
      case 3: return { x: 0, y: 0, ox: -1, oy: -1 };    // TopLeftSides
      case 5: return { x: 1, y: 0, ox: 1, oy: -1 };     // TopRightSides
      case 10: return { x: 0, y: 1, ox: -1, oy: 1 };    // BottomLeftSides
      case 12: return { x: 1, y: 1, ox: 1, oy: 1 };     // BottomRightSides
      default: return { x: 0.5, y: 0.5, ox: 0, oy: 0 }; // 6/9/15/Not* → 旧版均为中心
    }
  }

  /** 创建冻结的边侧 Spot（官方内部 _e 的等价物）。 */
  private static _side(bits: number): Spot {
    const s = new Spot(NaN, NaN, 1, bits);
    return s.freeze();
  }

  // ============ 官方静态常量 ============

  /** 无特定位置。 */
  static readonly None = new Spot(NaN, NaN, 0, 0).freeze();
  /** 真实值来自其他来源。 */
  static readonly Default = new Spot(NaN, NaN, -1, 0).freeze();

  static readonly TopLeft = new Spot(0, 0, 0, 0).freeze();
  static readonly TopCenter = new Spot(0.5, 0, 0, 0).freeze();
  static readonly TopRight = new Spot(1, 0, 0, 0).freeze();
  static readonly LeftCenter = new Spot(0, 0.5, 0, 0).freeze();
  static readonly Center = new Spot(0.5, 0.5, 0, 0).freeze();
  static readonly RightCenter = new Spot(1, 0.5, 0, 0).freeze();
  static readonly BottomLeft = new Spot(0, 1, 0, 0).freeze();
  static readonly BottomCenter = new Spot(0.5, 1, 0, 0).freeze();
  static readonly BottomRight = new Spot(1, 1, 0, 0).freeze();

  /** A synonym for Spot.TopCenter. */
  static readonly MiddleTop = Spot.TopCenter;
  /** A synonym for Spot.LeftCenter. */
  static readonly MiddleLeft = Spot.LeftCenter;
  /** A synonym for Spot.RightCenter. */
  static readonly MiddleRight = Spot.RightCenter;
  /** A synonym for Spot.BottomCenter. */
  static readonly MiddleBottom = Spot.BottomCenter;
  /** A synonym for Spot.TopCenter. */
  static readonly Top = Spot.TopCenter;
  /** A synonym for Spot.LeftCenter. */
  static readonly Left = Spot.LeftCenter;
  /** A synonym for Spot.RightCenter. */
  static readonly Right = Spot.RightCenter;
  /** A synonym for Spot.BottomCenter. */
  static readonly Bottom = Spot.BottomCenter;

  static readonly TopSide = Spot._side(1);
  static readonly LeftSide = Spot._side(2);
  static readonly RightSide = Spot._side(4);
  static readonly BottomSide = Spot._side(8);
  static readonly TopBottomSides = Spot._side(9);
  static readonly LeftRightSides = Spot._side(6);
  static readonly TopLeftSides = Spot._side(3);
  static readonly TopRightSides = Spot._side(5);
  static readonly BottomLeftSides = Spot._side(10);
  static readonly BottomRightSides = Spot._side(12);
  static readonly NotTopSide = Spot._side(14);
  static readonly NotLeftSide = Spot._side(13);
  static readonly NotRightSide = Spot._side(11);
  static readonly NotBottomSide = Spot._side(7);
  static readonly AllSides = Spot._side(15);
}
