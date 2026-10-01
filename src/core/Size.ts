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
export class Size {
  private _width: number;
  private _height: number;

  constructor(width?: number, height?: number) {
    if (width === undefined) {
      this._width = 0;
      this._height = 0;
    } else if (
      typeof width === 'number' &&
      (width >= 0 || isNaN(width)) &&
      typeof height === 'number' &&
      (height >= 0 || isNaN(height))
    ) {
      this._width = width;
      this._height = height;
    } else {
      throw new Error(`Invalid arguments to Size constructor: ${width}, ${height}`);
    }
  }

  // ============ 官方属性 ============

  get width(): number {
    return this._width;
  }
  set width(value: number) {
    if (value < 0) throw new Error(`Size.width is not in the range >= 0: ${value}`);
    this._width = value;
  }

  get height(): number {
    return this._height;
  }
  set height(value: number) {
    if (value < 0) throw new Error(`Size.height is not in the range >= 0: ${value}`);
    this._height = value;
  }

  /** Modify this Size with new Width and Height values. */
  setTo(w: number, h: number): this {
    this._width = w;
    this._height = h;
    return this;
  }

  /** Modify this Size so that its Width and Height values are the same as the given Size. */
  set(s: Size): this {
    this._width = s._width;
    this._height = s._height;
    return this;
  }

  /** Create a copy of this Size, with the same values. */
  copy(): Size {
    return new Size(this._width, this._height);
  }

  /** Indicates whether the given Size is equal to the current Size. */
  equals(s: Size): boolean {
    return s instanceof Size ? this._width === s._width && this._height === s._height : false;
  }

  /** Indicates whether the given size (w, h) is equal to this Size. */
  equalTo(w: number, h: number): boolean {
    return this._width === w && this._height === h;
  }

  /** True when the given Size is nearly equal to this Size（容差 0.5，官方 G.c）。 */
  equalsApprox(s: Size): boolean {
    return Math.abs(this._width - s._width) < 0.5 && Math.abs(this._height - s._height) < 0.5;
  }

  /**
   * Modify this Size so that its width and height are changed by the given distances.
   * 负值收缩，但不会小于零。
   */
  inflate(w: number, h: number): this {
    const nw = this._width + w;
    this._width = nw >= 0 ? nw : 0;
    const nh = this._height + h;
    this._height = nh >= 0 ? nh : 0;
    return this;
  }

  /** True if this Size has Width and Height values that are real numbers and not infinity. */
  isReal(): boolean {
    return isFinite(this._width) && isFinite(this._height);
  }

  /** 官方调试字符串："Size(3,4)"；数据序列化请用 Size.stringify。 */
  toString(): string {
    return `Size(${this._width},${this._height})`;
  }

  /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
  static readonly className: string = 'Size';

  // ============ 官方静态函数 ============

  /** 读入由 Size.stringify 产生的字符串。官方容错：空串 → (0,0)，缺 h → 0。 */
  static parse(str: string): Size {
    if (typeof str === 'string') {
      const parts = str.split(' ');
      let i = 0;
      let w = 0;
      for (; parts[i] === ''; ) i++;
      let n = parts[i++];
      if (n) w = parseFloat(n);
      let h = 0;
      for (; parts[i] === ''; ) i++;
      n = parts[i++];
      if (n) h = parseFloat(n);
      return new Size(w, h);
    }
    return new Size();
  }

  /** 写出可被 Size.parse 读回的字符串："1 2"。 */
  static stringify(val: Size): string {
    return val.width.toString() + ' ' + val.height.toString();
  }

  /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
  static stringifyFixed(digits: number): (val: Size) => string {
    if (typeof digits !== 'number') throw new Error('stringifyFixed:digits must be a number');
    return (val: Size) => val.width.toFixed(digits) + ' ' + val.height.toFixed(digits);
  }

  // ============ 项目扩展（官方无此成员，内部代码使用） ============

  /** 冻结本对象。 */
  freeze(): this {
    Object.freeze(this);
    return this;
  }

  /** 是否已被冻结为只读。 */
  get isReadOnly(): boolean {
    return Object.isFrozen(this);
  }

  /** 是否为空（宽或高 <= 0；项目扩展，官方 Size 无 isEmpty）。 */
  isEmpty(): boolean {
    return this._width <= 0 || this._height <= 0;
  }

  /** 零尺寸常量（项目扩展）。 */
  static readonly Zero = new Size(0, 0).freeze();

  /** 未测量占位常量（项目扩展，等价官方内部 Size.NaN）。 */
  static readonly NaN = new Size(NaN, NaN).freeze();
}
