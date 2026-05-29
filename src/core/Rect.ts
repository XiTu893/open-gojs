import { Point } from './Point';
import { Size } from './Size';

/**
 * Rect - 矩形
 */
export class Rect {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(xOrPoint?: number | Point, yOrSize?: number | Size, width?: number, height?: number) {
    if (xOrPoint instanceof Point) {
      this.x = xOrPoint.x;
      this.y = xOrPoint.y;
      if (yOrSize instanceof Size) {
        this.width = yOrSize.width;
        this.height = yOrSize.height;
      } else {
        this.width = 0;
        this.height = 0;
      }
    } else {
      this.x = xOrPoint || 0;
      this.y = (typeof yOrSize === 'number' ? yOrSize : 0);
      this.width = width || 0;
      this.height = height || 0;
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

  set(x: number, y: number, width: number, height: number): this {
    if (this._isReadOnly) throw new Error('Cannot modify readonly Rect');
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    return this;
  }

  copy(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  equals(r: Rect): boolean {
    return r instanceof Rect &&
      this.x === r.x && this.y === r.y &&
      this.width === r.width && this.height === r.height;
  }

  approximatelyEquals(r: Rect, epsilon: number = 0.5): boolean {
    return Math.abs(this.x - r.x) < epsilon &&
      Math.abs(this.y - r.y) < epsilon &&
      Math.abs(this.width - r.width) < epsilon &&
      Math.abs(this.height - r.height) < epsilon;
  }

  /** 左边 */
  get left(): number {
    return this.x;
  }

  /** 顶边 */
  get top(): number {
    return this.y;
  }

  /** 右边 */
  get right(): number {
    return this.x + this.width;
  }

  /** 底边 */
  get bottom(): number {
    return this.y + this.height;
  }

  /** 中心点 */
  get center(): Point {
    return new Point(this.x + this.width / 2, this.y + this.height / 2);
  }

  /** 左上角 */
  get position(): Point {
    return new Point(this.x, this.y);
  }

  /** 尺寸 */
  get size(): Size {
    return new Size(this.width, this.height);
  }

  /** 是否为空 */
  get isEmpty(): boolean {
    return this.width <= 0 || this.height <= 0;
  }

  /** 是否有效 */
  get isReal(): boolean {
    return isFinite(this.x) && isFinite(this.y) &&
      isFinite(this.width) && isFinite(this.height);
  }

  /** 是否包含点 */
  containsPoint(p: Point): boolean {
    return p.x >= this.x && p.x <= this.right &&
      p.y >= this.y && p.y <= this.bottom;
  }

  /** 是否包含矩形 */
  containsRect(r: Rect): boolean {
    return r.x >= this.x && r.y >= this.y &&
      r.right <= this.right && r.bottom <= this.bottom;
  }

  /** 与另一个矩形相交 */
  intersect(r: Rect): Rect {
    const x = Math.max(this.x, r.x);
    const y = Math.max(this.y, r.y);
    const right = Math.min(this.right, r.right);
    const bottom = Math.min(this.bottom, r.bottom);
    if (right < x || bottom < y) {
      return new Rect(x, y, 0, 0);
    }
    return new Rect(x, y, right - x, bottom - y);
  }

  /** 与另一个矩形合并 */
  union(r: Rect): Rect {
    const x = Math.min(this.x, r.x);
    const y = Math.min(this.y, r.y);
    const right = Math.max(this.right, r.right);
    const bottom = Math.max(this.bottom, r.bottom);
    return new Rect(x, y, right - x, bottom - y);
  }

  /** 是否与另一个矩形相交 */
  intersects(r: Rect): boolean {
    return !(r.x > this.right || r.right < this.x ||
      r.y > this.bottom || r.bottom < this.y);
  }

  /** 扩展边距 */
  inflate(margin: number): Rect;
  inflate(dx: number, dy: number): Rect;
  inflate(dx: number, dy?: number): Rect {
    const dyy = dy !== undefined ? dy : dx;
    return new Rect(this.x - dx, this.y - dyy, this.width + dx * 2, this.height + dyy * 2);
  }

  /** 偏移 */
  offset(dx: number, dy: number): Rect {
    return new Rect(this.x + dx, this.y + dy, this.width, this.height);
  }

  /** 设置位置 */
  setPosition(p: Point): this {
    if (this._isReadOnly) throw new Error('Cannot modify readonly Rect');
    this.x = p.x;
    this.y = p.y;
    return this;
  }

  /** 设置尺寸 */
  setSize(s: Size): this {
    if (this._isReadOnly) throw new Error('Cannot modify readonly Rect');
    this.width = s.width;
    this.height = s.height;
    return this;
  }

  /** 从字符串解析 "x y w h" */
  static parse(str: string): Rect {
    const parts = str.trim().split(/\s+/);
    return new Rect(
      parseFloat(parts[0]),
      parseFloat(parts[1]),
      parseFloat(parts[2]),
      parseFloat(parts[3])
    );
  }

  toString(): string {
    return `${this.x} ${this.y} ${this.width} ${this.height}`;
  }

  static readonly Zero = Object.freeze(new Rect(0, 0, 0, 0));
  static readonly NaN = Object.freeze(new Rect(NaN, NaN, NaN, NaN));

  static isRect(r: any): r is Rect {
    return r instanceof Rect;
  }
}
