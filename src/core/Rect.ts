import { Point } from './Point';
import { Size } from './Size';
import type { Spot } from './Spot';
import type { Margin } from './Margin';

/**
 * Rect - 矩形（对齐官方 go.d.ts:2013 class Rect）
 *
 * 官方语义要点：
 * - 四种构造：()、(x,y,w,h)、(Point,Point)、(Point,Size)；宽高必须非负（NaN 允许）
 * - (Point,Point) 构造为两角包围盒（min/abs）
 * - offset/inflate/grow/union/intersect/addMargin/subtractMargin 均为**原地修改**
 * - isEmpty() 是方法且语义为 width===0 && height===0
 * - left/top setter 直接赋值；right/bottom setter 平移保持尺寸
 * - toString 为调试格式 "Rect(x,y,w,h)"
 */
export class Rect {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  constructor(x?: number | Point, y?: number | Point | Size, w?: number, h?: number) {
    if (x === undefined) {
      this._x = 0;
      this._y = 0;
      this._width = 0;
      this._height = 0;
    } else if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof w === 'number' &&
      (w >= 0 || isNaN(w)) &&
      typeof h === 'number' &&
      (h >= 0 || isNaN(h))
    ) {
      this._x = x;
      this._y = y;
      this._width = w;
      this._height = h;
    } else if (x instanceof Point) {
      const px = x.x;
      const py = x.y;
      if (y instanceof Point) {
        const qx = y.x;
        const qy = y.y;
        this._x = Math.min(px, qx);
        this._y = Math.min(py, qy);
        this._width = Math.abs(px - qx);
        this._height = Math.abs(py - qy);
      } else if (y instanceof Size) {
        this._x = px;
        this._y = py;
        this._width = y.width;
        this._height = y.height;
      } else {
        throw new Error(`Incorrect second argument supplied to Rect constructor ${y}`);
      }
    } else {
      throw new Error(`Invalid arguments to Rect constructor: ${x}, ${y}, ${w}, ${h}`);
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

  get width(): number {
    return this._width;
  }
  set width(value: number) {
    if (value < 0) throw new Error(`Rect.width is not in the range >= 0: ${value}`);
    this._width = value;
  }

  get height(): number {
    return this._height;
  }
  set height(value: number) {
    if (value < 0) throw new Error(`Rect.height is not in the range >= 0: ${value}`);
    this._height = value;
  }

  get left(): number {
    return this._x;
  }
  set left(value: number) {
    this._x = value;
  }

  get top(): number {
    return this._y;
  }
  set top(value: number) {
    this._y = value;
  }

  get right(): number {
    return this._x + this._width;
  }
  set right(value: number) {
    this._x += value - (this._x + this._width);
  }

  get bottom(): number {
    return this._y + this._height;
  }
  set bottom(value: number) {
    this._y += value - (this._y + this._height);
  }

  get position(): Point {
    return new Point(this._x, this._y);
  }
  set position(value: Point) {
    this._x = value.x;
    this._y = value.y;
  }

  get size(): Size {
    return new Size(this._width, this._height);
  }
  set size(value: Size) {
    this._width = value.width;
    this._height = value.height;
  }

  get center(): Point {
    return new Point(this._x + this._width / 2, this._y + this._height / 2);
  }
  /** 设置中心点只是平移 X/Y，不改尺寸。 */
  set center(value: Point) {
    this._x = value.x - this._width / 2;
    this._y = value.y - this._height / 2;
  }

  get centerX(): number {
    return this._x + this._width / 2;
  }
  set centerX(value: number) {
    this._x = value - this._width / 2;
  }

  get centerY(): number {
    return this._y + this._height / 2;
  }
  set centerY(value: number) {
    this._y = value - this._height / 2;
  }

  /** Modify this Rect with new X, Y, Width, and Height values. */
  setTo(x: number, y: number, w: number, h: number): this {
    this._x = x;
    this._y = y;
    this._width = w;
    this._height = h;
    return this;
  }

  /** Modify this Rect so that its X, Y, Width, and Height values are the same as the given Rect. */
  set(r: Rect): this {
    this._x = r._x;
    this._y = r._y;
    this._width = r._width;
    this._height = r._height;
    return this;
  }

  /** Modify this Rect so that its X and Y values are the same as the given Point. */
  setPoint(p: Point): this {
    this._x = p.x;
    this._y = p.y;
    return this;
  }

  /** Modify this Rect so that its Width and Height values are the same as the given Size. */
  setSize(s: Size): this {
    this._width = s.width;
    this._height = s.height;
    return this;
  }

  /** Create a copy of this Rect, with the same values. */
  copy(): Rect {
    return new Rect(this._x, this._y, this._width, this._height);
  }

  /** Indicates whether the given Rect is equal to the current Rect. */
  equals(r: Rect): boolean {
    return r instanceof Rect
      ? this._x === r._x && this._y === r._y && this._width === r._width && this._height === r._height
      : false;
  }

  /** Indicates whether the given values are equal to this Rect. */
  equalTo(x: number, y: number, w: number, h: number): boolean {
    return this._x === x && this._y === y && this._width === w && this._height === h;
  }

  /** True when the given Rect is nearly equal to this Rect（容差 0.5，官方 G.u）。 */
  equalsApprox(r: Rect): boolean {
    return (
      Math.abs(this._x - r._x) < 0.5 &&
      Math.abs(this._y - r._y) < 0.5 &&
      Math.abs(this._width - r._width) < 0.5 &&
      Math.abs(this._height - r._height) < 0.5
    );
  }

  /** True when the given values are nearly equal to this Rect（容差 0.5，官方未在 d.ts 记录）。 */
  equalsApproxTo(x: number, y: number, w: number, h: number): boolean {
    return (
      Math.abs(this._x - x) < 0.5 &&
      Math.abs(this._y - y) < 0.5 &&
      Math.abs(this._width - w) < 0.5 &&
      Math.abs(this._height - h) < 0.5
    );
  }

  /** True when the given Rect is very nearly equal to this Rect（容差 5e-8，官方 G.H）。 */
  equalsApproxClose(r: Rect): boolean {
    return (
      Math.abs(this._x - r._x) < 5e-8 &&
      Math.abs(this._y - r._y) < 5e-8 &&
      Math.abs(this._width - r._width) < 5e-8 &&
      Math.abs(this._height - r._height) < 5e-8
    );
  }

  /** Indicates whether this Rect contains the given Point（边界含）。 */
  containsPoint(p: Point): boolean {
    return this._x <= p.x && this._x + this._width >= p.x && this._y <= p.y && this._y + this._height >= p.y;
  }

  /** Indicates whether this Rect contains the given Rect（边界含）。 */
  containsRect(r: Rect): boolean {
    return (
      this._x <= r._x &&
      r._x + r._width <= this._x + this._width &&
      this._y <= r._y &&
      r._y + r._height <= this._y + this._height
    );
  }

  /** Indicates whether this Rect contains the given Point/Rect（w/h 默认 0）。 */
  contains(x: number, y: number, w: number = 0, h: number = 0): boolean {
    return this._x <= x && x + w <= this._x + this._width && this._y <= y && y + h <= this._y + this._height;
  }

  /** Modify this Rect by shifting its values with the given DX and DY offsets. */
  offset(dx: number, dy: number): this {
    this._x += dx;
    this._y += dy;
    return this;
  }

  /**
   * Modify this Rect so that its width and height are changed on all four sides.
   * 负值收缩，但不会小于零（保持中心）。
   */
  inflate(w: number, h: number): this {
    return this._grow(h, w, h, w);
  }

  /** Modify this Rect by adding the given Margin to each side of the Rect. */
  addMargin(m: Margin): this {
    return this._grow(m.top, m.right, m.bottom, m.left);
  }

  /** Modify this Rect by subtracting the given Margin from each side of the Rect. */
  subtractMargin(m: Margin): this {
    return this._grow(-m.top, -m.right, -m.bottom, -m.left);
  }

  /** Modifies this Rect by adding some distance to each side of the Rect (上右下左)。 */
  grow(t: number, r: number, b: number, l: number): this {
    return this._grow(t, r, b, l);
  }

  /** 官方内部 ux：按四边增量调整，收缩截断至 0 并保持中心。 */
  private _grow(top: number, right: number, bottom: number, left: number): this {
    const w = this._width;
    if (right + left <= -w) {
      this._x += w / 2;
      this._width = 0;
    } else {
      this._x -= left;
      this._width += right + left;
    }
    const h = this._height;
    if (top + bottom <= -h) {
      this._y += h / 2;
      this._height = 0;
    } else {
      this._y -= top;
      this._height += top + bottom;
    }
    return this;
  }

  /** Modify this Rect so that it is the intersection of this Rect and the given Rect. */
  intersectRect(r: Rect): this {
    return this._intersect(r._x, r._y, r._width, r._height);
  }

  /** Modify this Rect so that it is the intersection of this Rect and the rectangle defined by x, y, w, h. */
  intersect(x: number, y: number, w: number, h: number): this {
    return this._intersect(x, y, w, h);
  }

  private _intersect(x: number, y: number, w: number, h: number): this {
    const nx = Math.max(this._x, x);
    const ny = Math.max(this._y, y);
    const nr = Math.min(this._x + this._width, x + w);
    const nb = Math.min(this._y + this._height, y + h);
    this._x = nx;
    this._y = ny;
    this._width = Math.max(0, nr - nx);
    this._height = Math.max(0, nb - ny);
    return this;
  }

  /** Determine if a given Rect is partly or wholly inside of this Rect. */
  intersectsRect(r: Rect): boolean {
    return this.intersects(r._x, r._y, r._width, r._height);
  }

  /** Determine if this Rect partly or wholly overlaps the rectangle defined by x, y, w, h. */
  intersects(x: number, y: number, w: number, h: number): boolean {
    let rw = this._width;
    const rx = this._x;
    if (rw !== Infinity && w !== Infinity) {
      rw += rx;
      const otherRight = x + w;
      if (isNaN(otherRight) || isNaN(rw) || rx > otherRight || x > rw) return false;
    }
    let rh = this._height;
    const ry = this._y;
    if (rh !== Infinity && h !== Infinity) {
      rh += ry;
      const otherBottom = y + h;
      if (isNaN(otherBottom) || isNaN(rh) || ry > otherBottom || y > rh) return false;
    }
    return true;
  }

  /** Modify this Rect to be exactly big enough to contain both the original Rect and the given Point. */
  unionPoint(p: Point): this {
    return this._union(p.x, p.y, 0, 0);
  }

  /** Modify this Rect to be exactly big enough to contain this Rect and the given Rect. */
  unionRect(r: Rect): this {
    return this._union(r._x, r._y, r._width, r._height);
  }

  /** Modify this Rect to be exactly big enough to contain the original Rect and the given rectangular area. */
  union(x: number, y: number, w: number = 0, h: number = 0): this {
    return this._union(x, y, w, h);
  }

  private _union(x: number, y: number, w: number, h: number): this {
    const nx = Math.min(this._x, x);
    const ny = Math.min(this._y, y);
    const nr = Math.max(this._x + this._width, x + w);
    const nb = Math.max(this._y + this._height, y + h);
    this._x = nx;
    this._y = ny;
    this._width = nr - nx;
    this._height = nb - ny;
    return this;
  }

  /** Modify this Rect so that a given Spot is at a given (x,y) point using this Rect's size. */
  setSpot(x: number, y: number, spot: Spot): this {
    this._x = x - spot.offsetX - spot.x * this._width;
    this._y = y - spot.offsetY - spot.y * this._height;
    return this;
  }

  /**
   * Return which side/direction of the Rect is closest to the given x,y point.
   * @returns 0 (right), 90 (bottom), 180 (left), or 270 (top)
   */
  nearestSideDirection(x: number, y: number): number {
    return Rect._nearestSideDirection(this, x, y);
  }

  /** Return which side/direction of the Rect is closest to the given Point. */
  nearestSideDirectionPoint(p: Point): number {
    return Rect._nearestSideDirection(this, p.x, p.y);
  }

  /** 官方内部 gx：i=true 时只返回 0/90/180/270 四个正方向。 */
  private static _nearestSideDirection(r: Rect, x: number, y: number): number {
    const nx = (x - r._x) / (r._width > 0 ? r._width : 1);
    const ny = (y - r._y) / (r._height > 0 ? r._height : 1);
    if (nx > ny) {
      if (nx <= 1 - ny) return 270;
      return 0;
    }
    if (nx > 1 - ny) return 90;
    return 180;
  }

  /** True if this Rect has X, Y, Width, and Height values that are real numbers and not infinity. */
  isReal(): boolean {
    return isFinite(this._x) && isFinite(this._y) && isFinite(this._width) && isFinite(this._height);
  }

  /** True if this Rect has a Width and Height of zero. */
  isEmpty(): boolean {
    return this._width === 0 && this._height === 0;
  }

  /** 官方调试字符串："Rect(x,y,w,h)"；数据序列化请用 Rect.stringify。 */
  toString(): string {
    return `Rect(${this._x},${this._y},${this._width},${this._height})`;
  }

  /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
  static readonly className: string = 'Rect';

  // ============ 官方静态函数 ============

  /** 读入由 Rect.stringify 产生的字符串。官方容错：缺项 → 0。 */
  static parse(str: string): Rect {
    if (typeof str === 'string') {
      const parts = str.split(' ');
      let i = 0;
      let x = 0;
      for (; parts[i] === ''; ) i++;
      let n = parts[i++];
      if (n) x = parseFloat(n);
      let y = 0;
      for (; parts[i] === ''; ) i++;
      n = parts[i++];
      if (n) y = parseFloat(n);
      let w = 0;
      for (; parts[i] === ''; ) i++;
      n = parts[i++];
      if (n) w = parseFloat(n);
      let h = 0;
      for (; parts[i] === ''; ) i++;
      n = parts[i++];
      if (n) h = parseFloat(n);
      return new Rect(x, y, w, h);
    }
    return new Rect();
  }

  /** 写出可被 Rect.parse 读回的字符串："1 2 3 4"。 */
  static stringify(val: Rect): string {
    return val.x.toString() + ' ' + val.y.toString() + ' ' + val.width.toString() + ' ' + val.height.toString();
  }

  /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
  static stringifyFixed(digits: number): (val: Rect) => string {
    if (typeof digits !== 'number') throw new Error('stringifyFixed:digits must be a number');
    return (val: Rect) =>
      val.x.toFixed(digits) + ' ' + val.y.toFixed(digits) + ' ' + val.width.toFixed(digits) + ' ' + val.height.toFixed(digits);
  }

  /** This static function indicates whether a Rect contains the given Point/Rect. */
  static contains(rx: number, ry: number, rw: number, rh: number, x: number, y: number, w: number = 0, h: number = 0): boolean {
    return rx <= x && x + w <= rx + rw && ry <= y && y + h <= ry + rh;
  }

  /** This static function indicates whether a Rect partly or wholly overlaps the given Rect. */
  static intersects(rx: number, ry: number, rw: number, rh: number, x: number, y: number, w: number, h: number): boolean {
    if (rx > x + w || x > rx + rw) return false;
    if (ry > y + h || y > ry + rh) return false;
    return true;
  }

  /** True if a rectangular area is intersected by a finite straight line segment. */
  static intersectsLineSegment(x: number, y: number, w: number, h: number, p1x: number, p1y: number, p2x: number, p2y: number): boolean {
    const left = x;
    const right = x + w;
    const top = y;
    const bottom = y + h;
    // 竖直线段
    if (p1x === p2x) {
      let lo: number;
      let hi: number;
      if (p1y < p2y) {
        lo = p1y;
        hi = p2y;
      } else {
        lo = p2y;
        hi = p1y;
      }
      return left <= p1x && p1x <= right && lo <= bottom && hi >= top;
    }
    // 水平线段
    if (p1y === p2y) {
      let lo: number;
      let hi: number;
      if (p1x < p2x) {
        lo = p1x;
        hi = p2x;
      } else {
        lo = p2x;
        hi = p1x;
      }
      return top <= p1y && p1y <= bottom && lo <= right && hi >= left;
    }
    return (
      Rect.contains(x, y, w, h, p1x, p1y) ||
      Rect.contains(x, y, w, h, p2x, p2y) ||
      Point.intersectingLineSegments(left, top, left, bottom, p1x, p1y, p2x, p2y) ||
      Point.intersectingLineSegments(right, top, right, bottom, p1x, p1y, p2x, p2y) ||
      Point.intersectingLineSegments(right, bottom, left, bottom, p1x, p1y, p2x, p2y) ||
      Point.intersectingLineSegments(left, bottom, left, top, p1x, p1y, p2x, p2y)
    );
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

  /** 零矩形常量（项目扩展）。 */
  static readonly Zero = new Rect(0, 0, 0, 0).freeze();

  /** 未测量占位常量（项目扩展）。 */
  static readonly NaN = new Rect(NaN, NaN, NaN, NaN).freeze();
}
