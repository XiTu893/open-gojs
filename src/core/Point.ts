import type { Rect } from './Rect';
import type { Size } from './Size';
import type { Spot } from './Spot';

/**
 * Point - 二维点（对齐官方 go.d.ts:1548 class Point）
 *
 * 官方语义要点（参照 gojs@4.0.4 运行时）：
 * - add/subtract/offset/rotate/scale/normalize/set/setTo 均为**原地修改**并返回 this
 * - direction/directionPoint 返回**度数**（0-360）
 * - equalsApprox 容差为 |dx| < 0.5（官方内部 G.c）
 * - toString 为调试格式 "Point(x,y)"；数据格式用静态 stringify
 * - 构造器只接受 0 或 2 个数字参数，否则抛错
 */
export class Point {
  private _x: number;
  private _y: number;

  constructor(x?: number, y?: number) {
    if (x === undefined) {
      this._x = 0;
      this._y = 0;
    } else if (typeof x === 'number' && typeof y === 'number') {
      this._x = x;
      this._y = y;
    } else {
      throw new Error(`Invalid arguments to Point constructor: ${x}, ${y}`);
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

  /** Modify this Point with new X and Y values. */
  setTo(x: number, y: number): this {
    this._x = x;
    this._y = y;
    return this;
  }

  /** Modify this Point so that its X and Y values are the same as the given Point. */
  set(p: Point): this {
    this._x = p._x;
    this._y = p._y;
    return this;
  }

  /** Create a copy of this Point, with the same values. */
  copy(): Point {
    return new Point(this._x, this._y);
  }

  /** Indicates whether the given Point is equal to this Point. */
  equals(p: Point): boolean {
    return p instanceof Point ? this._x === p._x && this._y === p._y : false;
  }

  /** Indicates whether the given point (x, y) is equal to this Point. */
  equalTo(x: number, y: number): boolean {
    return this._x === x && this._y === y;
  }

  /** True when the given Point is nearly equal to this Point（容差 0.5，官方 G.c）。 */
  equalsApprox(p: Point): boolean {
    return Math.abs(this._x - p._x) < 0.5 && Math.abs(this._y - p._y) < 0.5;
  }

  /** Modify this point so that it is the sum of this Point and the given Point. */
  add(p: Point): this {
    this._x += p._x;
    this._y += p._y;
    return this;
  }

  /** Modify this point so that it is the difference of this Point and the given Point. */
  subtract(p: Point): this {
    this._x -= p._x;
    this._y -= p._y;
    return this;
  }

  /** Modify this point by shifting its values with the given DX and DY offsets. */
  offset(dx: number, dy: number): this {
    this._x += dx;
    this._y += dy;
    return this;
  }

  /** Modify this Point so that it has been rotated about the origin by the given angle (in degrees). */
  rotate(angle: number): this {
    if (angle === 0) return this;
    const x = this._x;
    const y = this._y;
    if (x === 0 && y === 0) return this;
    let s: number;
    let n: number;
    // 官方 G.qi：只做单步归一化
    if (angle >= 360) angle -= 360;
    else if (angle < 0) angle += 360;
    if (angle === 90) {
      s = 0;
      n = 1;
    } else if (angle === 180) {
      s = -1;
      n = 0;
    } else if (angle === 270) {
      s = 0;
      n = -1;
    } else {
      const rad = (angle * Math.PI) / 180;
      s = Math.cos(rad);
      n = Math.sin(rad);
    }
    this._x = s * x - n * y;
    this._y = n * x + s * y;
    return this;
  }

  /** Modify this Point so that its X and Y values have been scaled by given factors. */
  scale(sx: number, sy: number): this {
    this._x *= sx;
    this._y *= sy;
    return this;
  }

  /** Returns the square of the distance from this Point to a given Point. */
  distanceSquaredPoint(p: Point): number {
    const dx = p._x - this._x;
    const dy = p._y - this._y;
    return dx * dx + dy * dy;
  }

  /** Returns the square of the distance from this point to a given point (px, py). */
  distanceSquared(px: number, py: number): number {
    const dx = px - this._x;
    const dy = py - this._y;
    return dx * dx + dy * dy;
  }

  /** Modify this Point so that its X and Y values have been normalized to a unit length. */
  normalize(): this {
    const x = this._x;
    const y = this._y;
    const len = Math.sqrt(x * x + y * y);
    if (len > 0) {
      this._x = x / len;
      this._y = y / len;
    }
    return this;
  }

  /** Compute the angle (in degrees) from this Point to a given Point. */
  directionPoint(p: Point): number {
    return Point._angle(p._x - this._x, p._y - this._y);
  }

  /** Compute the angle (in degrees) from this Point to a given (px, py) point. */
  direction(px: number, py: number): number {
    return Point._angle(px - this._x, py - this._y);
  }

  /** 官方内部 rL：由差值算方向角（度，0-360）；同点为 0。 */
  private static _angle(dx: number, dy: number): number {
    if (dx === 0) return dy > 0 ? 90 : dy < 0 ? 270 : 0;
    if (dy === 0) return dx > 0 ? 0 : 180;
    if (isNaN(dx) || isNaN(dy)) return 0;
    let a = (Math.atan(Math.abs(dy / dx)) * 180) / Math.PI;
    if (dx < 0) {
      a = dy < 0 ? a + 180 : 180 - a;
    } else if (dy < 0) {
      a = 360 - a;
    }
    return a;
  }

  /**
   * 官方内部 G.Du：点与有限线段的比较。
   * 线段上为 0；线段左侧为正、右侧为负；
   * 在无限延长线上但超出线段端点时，越过终点为正、起点之前为负。
   */
  private static _compareWithLineSegment(
    a1x: number, a1y: number, a2x: number, a2y: number, px: number, py: number
  ): number {
    const dx = a2x - a1x;
    const dy = a2y - a1y;
    let ex = px - a1x;
    let ey = py - a1y;
    let h = ex * dy - ey * dx;
    if (h === 0) {
      h = ex * dx + ey * dy;
      if (h > 0) {
        ex -= dx;
        ey -= dy;
        h = ex * dx + ey * dy;
        if (h < 0) h = 0;
      }
    }
    return h;
  }

  /** If the point is on the finite line segment this returns zero. */
  static compareWithLineSegment(a1x: number, a1y: number, a2x: number, a2y: number, px: number, py: number): number {
    return Point._compareWithLineSegment(a1x, a1y, a2x, a2y, px, py);
  }

  /** Compare this point with a finite line segment given by two Points. */
  compareWithLineSegmentPoint(p: Point, q: Point): number {
    return Point._compareWithLineSegment(p._x, p._y, q._x, q._y, this._x, this._y);
  }

  /** 官方内部 G.kr：两条有限线段是否相交。 */
  private static _intersectingLineSegments(
    a1x: number, a1y: number, a2x: number, a2y: number,
    b1x: number, b1y: number, b2x: number, b2y: number
  ): boolean {
    if (a1x === a2x && a1y === a2y && b1x === b2x && b1y === b2y) {
      return a1x === b1x && a1y === b1y;
    }
    return (
      Point._compareWithLineSegment(a1x, a1y, a2x, a2y, b1x, b1y) *
        Point._compareWithLineSegment(a1x, a1y, a2x, a2y, b2x, b2y) <=
        0 &&
      Point._compareWithLineSegment(b1x, b1y, b2x, b2y, a1x, a1y) *
        Point._compareWithLineSegment(b1x, b1y, b2x, b2y, a2x, a2y) <=
        0
    );
  }

  /** True if two finite straight line segments intersect each other. */
  static intersectingLineSegments(
    a1x: number, a1y: number, a2x: number, a2y: number,
    b1x: number, b1y: number, b2x: number, b2y: number
  ): boolean {
    return Point._intersectingLineSegments(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y);
  }

  /**
   * 官方内部 G.Il：把本点改为线段上（或端点）离本点最近的点。
   * 返回 this（官方丢弃"是否落在线段内"的布尔结果）。
   */
  projectOntoLineSegment(px: number, py: number, qx: number, qy: number): this {
    if (Math.abs(px - qx) < 5e-8) {
      // 竖直线段：夹住 y
      let lo: number;
      let hi: number;
      if (py < qy) {
        lo = py;
        hi = qy;
      } else {
        lo = qy;
        hi = py;
      }
      this._x = px;
      if (this._y < lo) this._y = lo;
      else if (this._y > hi) this._y = hi;
      return this;
    }
    if (Math.abs(py - qy) < 5e-8) {
      // 水平线段：夹住 x
      let lo: number;
      let hi: number;
      if (px < qx) {
        lo = px;
        hi = qx;
      } else {
        lo = qx;
        hi = px;
      }
      this._y = py;
      if (this._x < lo) this._x = lo;
      else if (this._x > hi) this._x = hi;
      return this;
    }
    const dist2 = (px - qx) * (px - qx) + (py - qy) * (py - qy);
    const t = ((px - this._x) * (px - qx) + (py - this._y) * (py - qy)) / dist2;
    if (t < -5e-6) {
      this._x = px;
      this._y = py;
      return this;
    }
    if (t > 1.000005) {
      this._x = qx;
      this._y = qy;
      return this;
    }
    this._x = px + t * (qx - px);
    this._y = py + t * (qy - py);
    return this;
  }

  /** Modify this point to be the closest point to this point that is on a finite line segment. */
  projectOntoLineSegmentPoint(p: Point, q: Point): this {
    return this.projectOntoLineSegment(p._x, p._y, q._x, q._y);
  }

  /**
   * 官方内部 G.gm：吸附到无限网格。
   * @param cellwidth 必须大于 0
   * @param cellheight 必须大于 0
   */
  snapToGrid(originX: number, originY: number, cellwidth: number, cellheight: number): this {
    const gx = Math.floor((this._x - originX) / cellwidth) * cellwidth + originX;
    const gy = Math.floor((this._y - originY) / cellheight) * cellheight + originY;
    let sx = gx;
    if (gx + cellwidth - this._x < cellwidth / 2) sx = gx + cellwidth;
    let sy = gy;
    if (gy + cellheight - this._y < cellheight / 2) sy = gy + cellheight;
    this._x = sx;
    this._y = sy;
    return this;
  }

  /** Modify this point to be at the nearest point on an infinite grid. */
  snapToGridPoint(origin: Point, cellsize: Size): this {
    return this.snapToGrid(origin._x, origin._y, cellsize.width, cellsize.height);
  }

  /** Modify this Point so that its X and Y values correspond to a particular Spot in a given Rect. */
  setRectSpot(r: Rect, spot: Spot): this {
    this._x = r.x + spot.x * r.width + spot.offsetX;
    this._y = r.y + spot.y * r.height + spot.offsetY;
    return this;
  }

  /** Modify this Point so that its X and Y values correspond to a particular Spot in a given rectangle. */
  setSpot(x: number, y: number, w: number, h: number, spot: Spot): this {
    this._x = x + spot.x * w + spot.offsetX;
    this._y = y + spot.y * h + spot.offsetY;
    return this;
  }

  /** Returns the square of the distance from the point P to the finite line segment from A to B. */
  static distanceLineSegmentSquared(
    px: number, py: number, ax: number, ay: number, bx: number, by: number
  ): number {
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const hx = ax - px;
    const hy = ay - py;
    const dot = -hx * dx - hy * dy;
    if (dot <= 0 || dot >= len2) {
      const gx = bx - px;
      const gy = by - py;
      return Math.min(hx * hx + hy * hy, gx * gx + gy * gy);
    }
    const cross = dx * hy - dy * hx;
    return (cross * cross) / len2;
  }

  /** Returns the square of the distance from the point P to the point Q. */
  static distanceSquared(px: number, py: number, qx: number, qy: number): number {
    const dx = qx - px;
    const dy = qy - py;
    return dx * dx + dy * dy;
  }

  /** Returns the angle in degrees of the line from point P to point Q. */
  static direction(px: number, py: number, qx: number, qy: number): number {
    return Point._angle(qx - px, qy - py);
  }

  /** True if this Point has X and Y values that are real numbers and not infinity. */
  isReal(): boolean {
    return isFinite(this._x) && isFinite(this._y);
  }

  /** 官方调试字符串："Point(1,2)"；数据序列化请用 Point.stringify。 */
  toString(): string {
    return `Point(${this._x},${this._y})`;
  }

  /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
  static readonly className: string = 'Point';

  // ============ 官方静态函数 ============

  /** 读入由 Point.stringify 产生的字符串。官方容错：空串 → (0,0)，缺 y → 0。 */
  static parse(str: string): Point {
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
      return new Point(x, y);
    }
    return new Point();
  }

  /** 写出可被 Point.parse 读回的字符串："1 2"。 */
  static stringify(val: Point): string {
    return val.x.toString() + ' ' + val.y.toString();
  }

  /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
  static stringifyFixed(digits: number): (val: Point) => string {
    if (typeof digits !== 'number') throw new Error('stringifyFixed:digits must be a number');
    return (val: Point) => val.x.toFixed(digits) + ' ' + val.y.toFixed(digits);
  }

  // ============ 项目扩展（官方无此成员，内部代码使用） ============

  /** 冻结本对象（官方通过内部 Object.freeze 实现同义能力）。 */
  freeze(): this {
    Object.freeze(this);
    return this;
  }

  /** 是否已被冻结为只读。 */
  get isReadOnly(): boolean {
    return Object.isFrozen(this);
  }

  /** 线性插值（项目扩展）。 */
  static lerp(p1: Point, p2: Point, t: number): Point {
    return new Point(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
  }

  /** 原点常量（项目扩展）。 */
  static readonly Zero = new Point(0, 0).freeze();
}
