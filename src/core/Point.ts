/**
 * Point - 二维点
 */
export class Point {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /** 是否为只读 */
  private _isReadOnly: boolean = false;
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  /** 设置为只读 */
  freeze(): this {
    this._isReadOnly = true;
    return this;
  }

  /** 设置坐标 */
  set(x: number, y: number): this {
    if (this._isReadOnly) throw new Error('Cannot modify readonly Point');
    this.x = x;
    this.y = y;
    return this;
  }

  /** 复制 */
  copy(): Point {
    return new Point(this.x, this.y);
  }

  /** 是否等于另一个点 */
  equals(p: Point): boolean {
    return p instanceof Point && this.x === p.x && this.y === p.y;
  }

  /** 近似相等 */
  approximatelyEquals(p: Point, epsilon: number = 0.5): boolean {
    return Math.abs(this.x - p.x) < epsilon && Math.abs(this.y - p.y) < epsilon;
  }

  /** 加法 */
  add(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  /** 减法 */
  subtract(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }

  /** 乘以标量 */
  multiply(s: number): Point {
    return new Point(this.x * s, this.y * s);
  }

  /** 除以标量 */
  divide(s: number): Point {
    return new Point(this.x / s, this.y / s);
  }

  /** 向量长度 */
  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /** 距离另一个点 */
  distanceTo(p: Point): number {
    const dx = this.x - p.x;
    const dy = this.y - p.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** 方向角（弧度） */
  direction(): number {
    return Math.atan2(this.y, this.x);
  }

  /** 到另一个点的方向角（弧度） */
  directionTo(p: Point): number {
    return Math.atan2(p.y - this.y, p.x - this.x);
  }

  /** 归一化 */
  normalize(): Point {
    const len = this.length;
    if (len === 0) return new Point(0, 0);
    return new Point(this.x / len, this.y / len);
  }

  /** 旋转（弧度） */
  rotate(angle: number): Point {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Point(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  /** 点积 */
  dot(p: Point): number {
    return this.x * p.x + this.y * p.y;
  }

  /** 叉积 */
  cross(p: Point): number {
    return this.x * p.y - this.y * p.x;
  }

  /** 线性插值 */
  static lerp(p1: Point, p2: Point, t: number): Point {
    return new Point(
      p1.x + (p2.x - p1.x) * t,
      p1.y + (p2.y - p1.y) * t
    );
  }

  /** 从字符串解析 "x y" */
  static parse(str: string): Point {
    const parts = str.trim().split(/\s+/);
    return new Point(parseFloat(parts[0]), parseFloat(parts[1]));
  }

  /** 转换为字符串 */
  toString(): string {
    return `${this.x} ${this.y}`;
  }

  /** 原点 */
  static readonly Zero = Object.freeze(new Point(0, 0));

  static stringify(p: Point): string {
    return p.x + ' ' + p.y;
  }

  static stringifyFixed(digits: number): (p: Point) => string {
    return function(p: Point): string {
      return p.x.toFixed(digits) + ' ' + p.y.toFixed(digits);
    };
  }

  static isPoint(p: any): p is Point {
    return p instanceof Point;
  }
}
