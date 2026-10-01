/**
 * Margin - 边距（上右下左）（对齐官方 go.d.ts:2435 class Margin）
 *
 * 官方语义要点：
 * - 构造器：0 参全 0；1 参四边同值；2 参 top/bottom=第一参、right/left=第二参；3 参抛错；4 参 t,r,b,l
 * - set(m) 只接受 Margin；setTo(t,r,b,l) 四值
 * - equalsApprox 容差 0.5（官方 G.u）
 * - isReal() 是方法；toString 为调试格式 "Margin(t,r,b,l)"
 */
export class Margin {
  private _top: number;
  private _right: number;
  private _bottom: number;
  private _left: number;

  constructor(t?: number, r?: number, b?: number, l?: number) {
    if (t === undefined) {
      this._top = 0;
      this._right = 0;
      this._bottom = 0;
      this._left = 0;
    } else if (r === undefined) {
      this._top = t;
      this._right = t;
      this._bottom = t;
      this._left = t;
    } else if (b === undefined) {
      this._top = t;
      this._right = r;
      this._bottom = t;
      this._left = r;
    } else if (l !== undefined) {
      this._top = t;
      this._right = r;
      this._bottom = b;
      this._left = l;
    } else {
      throw new Error(`Invalid arguments to Margin constructor: ${t}, ${r}, ${b}, ${l}`);
    }
  }

  // ============ 官方属性 ============

  get top(): number {
    return this._top;
  }
  set top(value: number) {
    this._top = value;
  }

  get right(): number {
    return this._right;
  }
  set right(value: number) {
    this._right = value;
  }

  get bottom(): number {
    return this._bottom;
  }
  set bottom(value: number) {
    this._bottom = value;
  }

  get left(): number {
    return this._left;
  }
  set left(value: number) {
    this._left = value;
  }

  /** Modify this Margin with new Top, Right, Bottom, and Left values. */
  setTo(t: number, r: number, b: number, l: number): this {
    this._top = t;
    this._right = r;
    this._bottom = b;
    this._left = l;
    return this;
  }

  /** Modify this Margin so that its values are the same as the given Margin. */
  set(m: Margin): this {
    this._top = m._top;
    this._right = m._right;
    this._bottom = m._bottom;
    this._left = m._left;
    return this;
  }

  /** Create a copy of this Margin, with the same values. */
  copy(): Margin {
    const m = new Margin();
    m._top = this._top;
    m._right = this._right;
    m._bottom = this._bottom;
    m._left = this._left;
    return m;
  }

  /** Indicates whether the given Margin is equal to this Margin. */
  equals(m: Margin): boolean {
    return m instanceof Margin
      ? this._top === m._top && this._right === m._right && this._bottom === m._bottom && this._left === m._left
      : false;
  }

  /** Indicates whether the given values are equal to this Margin. */
  equalTo(t: number, r: number, b: number, l: number): boolean {
    return this._top === t && this._right === r && this._bottom === b && this._left === l;
  }

  /** True when the given Margin is nearly equal to this Margin（容差 0.5，官方 G.u）。 */
  equalsApprox(m: Margin): boolean {
    return (
      Math.abs(this._top - m._top) < 0.5 &&
      Math.abs(this._right - m._right) < 0.5 &&
      Math.abs(this._bottom - m._bottom) < 0.5 &&
      Math.abs(this._left - m._left) < 0.5
    );
  }

  /** True if this Margin has values that are real numbers and not infinity. */
  isReal(): boolean {
    return isFinite(this._top) && isFinite(this._right) && isFinite(this._bottom) && isFinite(this._left);
  }

  /** 官方调试字符串："Margin(t,r,b,l)"；数据序列化请用 Margin.stringify。 */
  toString(): string {
    return `Margin(${this._top},${this._right},${this._bottom},${this._left})`;
  }

  /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
  static readonly className: string = 'Margin';

  // ============ 官方静态函数 ============

  /**
   * 读入由 Margin.stringify 产生的字符串（"t r b l"，部分缺失时按官方规则退化：
   * 1 值 → 四边同值；2 值 → t/b、r/l；3 值或更多 → 只取前两值）。
   */
  static parse(str: string): Margin {
    if (typeof str === 'string') {
      const parts = str.split(' ');
      let i = 0;
      let s = NaN;
      for (; parts[i] === ''; ) i++;
      let n = parts[i++];
      if (n) s = parseFloat(n);
      if (isNaN(s)) return new Margin();
      let o = NaN;
      for (; parts[i] === ''; ) i++;
      n = parts[i++];
      if (n) o = parseFloat(n);
      if (isNaN(o)) return new Margin(s);
      let r = NaN;
      for (; parts[i] === ''; ) i++;
      n = parts[i++];
      if (n) r = parseFloat(n);
      if (isNaN(r)) return new Margin(s, o);
      let l = NaN;
      for (; parts[i] === ''; ) i++;
      n = parts[i++];
      if (n) l = parseFloat(n);
      if (isNaN(l)) return new Margin(s, o);
      return new Margin(s, o, r, l);
    }
    return new Margin();
  }

  /** 写出可被 Margin.parse 读回的字符串："1 2 3 4"。 */
  static stringify(val: Margin): string {
    return val._top.toString() + ' ' + val._right.toString() + ' ' + val._bottom.toString() + ' ' + val._left.toString();
  }

  /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
  static stringifyFixed(digits: number): (val: Margin) => string {
    if (typeof digits !== 'number') throw new Error('stringifyFixed:digits must be a number');
    return (val: Margin) =>
      val._top.toFixed(digits) + ' ' + val._right.toFixed(digits) + ' ' + val._bottom.toFixed(digits) + ' ' + val._left.toFixed(digits);
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

  /** 零边距常量（项目扩展，官方无 Margin.Zero）。 */
  static readonly Zero = new Margin(0, 0, 0, 0).freeze();

  /** 类型判断（项目扩展，内部 RowColumnDefinition 使用）。 */
  static isMargin(m: unknown): m is Margin {
    return m instanceof Margin;
  }
}

/** MarginLike 类型 - 可以是 Margin 对象或数字 */
export type MarginLike = Margin | number;
