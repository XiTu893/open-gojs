/**
 * Margin - 边距（上右下左）
 */
export class Margin {
  public top: number;
  public right: number;
  public bottom: number;
  public left: number;

  constructor(margin: number);
  constructor(top: number, right: number, bottom: number, left: number);
  constructor(topBottom?: number, right?: number, bottom?: number, left?: number);
  constructor(topBottom: number = 0, right?: number, bottom?: number, left?: number) {
    if (right === undefined) {
      this.top = topBottom;
      this.right = topBottom;
      this.bottom = topBottom;
      this.left = topBottom;
    } else {
      this.top = topBottom;
      this.right = right;
      this.bottom = bottom !== undefined ? bottom : topBottom;
      this.left = left !== undefined ? left : right;
    }
  }

  private _isReadOnly: boolean = false;
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  freeze(): this {
    this._isReadOnly = true;
    return this;
  }

  set(top: number, right?: number, bottom?: number, left?: number): this {
    if (this._isReadOnly) throw new Error('Cannot modify readonly Margin');
    if (right === undefined) {
      this.top = top;
      this.right = top;
      this.bottom = top;
      this.left = top;
    } else {
      this.top = top;
      this.right = right;
      this.bottom = bottom !== undefined ? bottom : top;
      this.left = left !== undefined ? left : right;
    }
    return this;
  }

  copy(): Margin {
    return new Margin(this.top, this.right, this.bottom, this.left);
  }

  equals(m: Margin): boolean {
    return m instanceof Margin &&
      this.top === m.top && this.right === m.right &&
      this.bottom === m.bottom && this.left === m.left;
  }

  /** 是否所有边距都为0 */
  get isZero(): boolean {
    return this.top === 0 && this.right === 0 && this.bottom === 0 && this.left === 0;
  }

  /** 水平边距总和 */
  get horizontal(): number {
    return this.left + this.right;
  }

  /** 垂直边距总和 */
  get vertical(): number {
    return this.top + this.bottom;
  }

  /** 加法 */
  add(m: Margin): Margin {
    return new Margin(
      this.top + m.top,
      this.right + m.right,
      this.bottom + m.bottom,
      this.left + m.left
    );
  }

  /** 减法 */
  subtract(m: Margin): Margin {
    return new Margin(
      this.top - m.top,
      this.right - m.right,
      this.bottom - m.bottom,
      this.left - m.left
    );
  }

  /** 从字符串解析 "t r b l" 或 "all" */
  static parse(str: string): Margin {
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) {
      return new Margin(parseFloat(parts[0]));
    } else if (parts.length === 4) {
      return new Margin(
        parseFloat(parts[0]),
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        parseFloat(parts[3])
      );
    }
    throw new Error('Invalid Margin string: ' + str);
  }

  toString(): string {
    if (this.top === this.right && this.right === this.bottom && this.bottom === this.left) {
      return `${this.top}`;
    }
    return `${this.top} ${this.right} ${this.bottom} ${this.left}`;
  }

  static readonly Zero = Object.freeze(new Margin(0));

  static isMargin(m: any): m is Margin {
    return m instanceof Margin;
  }
}

/** MarginLike 类型 - 可以是 Margin 对象或数字 */
export type MarginLike = Margin | number;
