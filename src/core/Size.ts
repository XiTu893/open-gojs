/**
 * Size - 尺寸
 */
export class Size {
  public width: number;
  public height: number;

  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
  }

  private _isReadOnly: boolean = false;
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  freeze(): this {
    this._isReadOnly = true;
    return this;
  }

  set(width: number, height: number): this {
    if (this._isReadOnly) throw new Error('Cannot modify readonly Size');
    this.width = width;
    this.height = height;
    return this;
  }

  copy(): Size {
    return new Size(this.width, this.height);
  }

  equals(s: Size): boolean {
    return s instanceof Size && this.width === s.width && this.height === s.height;
  }

  approximatelyEquals(s: Size, epsilon: number = 0.5): boolean {
    return Math.abs(this.width - s.width) < epsilon && Math.abs(this.height - s.height) < epsilon;
  }

  /** 是否为空（宽或高为0） */
  get isEmpty(): boolean {
    return this.width <= 0 || this.height <= 0;
  }

  /** 是否有效（宽和高非负） */
  get isReal(): boolean {
    return isFinite(this.width) && isFinite(this.height) && this.width >= 0 && this.height >= 0;
  }

  /** 加法 */
  add(s: Size): Size {
    return new Size(this.width + s.width, this.height + s.height);
  }

  /** 减法 */
  subtract(s: Size): Size {
    return new Size(this.width - s.width, this.height - s.height);
  }

  /** 乘以标量 */
  multiply(s: number): Size {
    return new Size(this.width * s, this.height * s);
  }

  /** 除以标量 */
  divide(s: number): Size {
    return new Size(this.width / s, this.height / s);
  }

  /** 从字符串解析 "w h" */
  static parse(str: string): Size {
    const parts = str.trim().split(/\s+/);
    return new Size(parseFloat(parts[0]), parseFloat(parts[1]));
  }

  toString(): string {
    return `${this.width} ${this.height}`;
  }

  static readonly Zero = Object.freeze(new Size(0, 0));
  static readonly NaN = Object.freeze(new Size(NaN, NaN));

  static stringify(s: Size): string {
    return s.width + ' ' + s.height;
  }

  static isSize(s: any): s is Size {
    return s instanceof Size;
  }
}
