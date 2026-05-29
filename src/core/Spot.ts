/**
 * Spot - 定位点
 * 用归一化坐标 (0-1) + 偏移量表示一个位置
 */
export class Spot {
  public x: number;
  public y: number;
  public offsetX: number;
  public offsetY: number;

  constructor(x: number = 0, y: number = 0, offsetX: number = 0, offsetY: number = 0) {
    this.x = x;
    this.y = y;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  private _isReadOnly: boolean = false;
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  freeze(): this {
    this._isReadOnly = true;
    return this;
  }

  set(x: number, y: number, offsetX: number = 0, offsetY: number = 0): this {
    if (this._isReadOnly) throw new Error('Cannot modify readonly Spot');
    this.x = x;
    this.y = y;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    return this;
  }

  copy(): Spot {
    return new Spot(this.x, this.y, this.offsetX, this.offsetY);
  }

  equals(s: Spot): boolean {
    return s instanceof Spot &&
      this.x === s.x && this.y === s.y &&
      this.offsetX === s.offsetX && this.offsetY === s.offsetY;
  }

  approximatelyEquals(s: Spot, epsilon: number = 0.5): boolean {
    return Math.abs(this.x - s.x) < epsilon &&
      Math.abs(this.y - s.y) < epsilon &&
      Math.abs(this.offsetX - s.offsetX) < epsilon &&
      Math.abs(this.offsetY - s.offsetY) < epsilon;
  }

  /** 是否为默认值 */
  get isDefault(): boolean {
    return this.x === 0 && this.y === 0 && this.offsetX === 0 && this.offsetY === 0;
  }

  /** 是否为无特殊位置 */
  get isNone(): boolean {
    return isNaN(this.x) && isNaN(this.y);
  }

  /** 是否无偏移 */
  get hasNoOffset(): boolean {
    return this.offsetX === 0 && this.offsetY === 0;
  }

  /** 在给定矩形中的实际坐标 */
  positionInRect(r: { x: number; y: number; width: number; height: number }): { x: number; y: number } {
    return {
      x: r.x + this.x * r.width + this.offsetX,
      y: r.y + this.y * r.height + this.offsetY,
    };
  }

  toString(): string {
    if (this.offsetX === 0 && this.offsetY === 0) {
      return `${this.x} ${this.y}`;
    }
    return `${this.x} ${this.y} ${this.offsetX} ${this.offsetY}`;
  }

  // ============ 预定义常量 ============
  static readonly TopLeft = Object.freeze(new Spot(0, 0)) as Spot;
  static readonly Top = Object.freeze(new Spot(0.5, 0)) as Spot;
  static readonly TopCenter = Object.freeze(new Spot(0.5, 0)) as Spot;
  static readonly TopRight = Object.freeze(new Spot(1, 0)) as Spot;
  static readonly Left = Object.freeze(new Spot(0, 0.5)) as Spot;
  static readonly CenterLeft = Object.freeze(new Spot(0, 0.5)) as Spot;
  static readonly Center = Object.freeze(new Spot(0.5, 0.5)) as Spot;
  static readonly CenterRight = Object.freeze(new Spot(1, 0.5)) as Spot;
  static readonly Right = Object.freeze(new Spot(1, 0.5)) as Spot;
  static readonly BottomLeft = Object.freeze(new Spot(0, 1)) as Spot;
  static readonly Bottom = Object.freeze(new Spot(0.5, 1)) as Spot;
  static readonly BottomCenter = Object.freeze(new Spot(0.5, 1)) as Spot;
  static readonly BottomRight = Object.freeze(new Spot(1, 1)) as Spot;
  static readonly Default = Object.freeze(new Spot(0, 0)) as Spot;
  static readonly None = Object.freeze(new Spot(NaN, NaN)) as Spot;
  static readonly TopSide = Object.freeze(new Spot(0.5, 0, 0, -1)) as Spot;
  static readonly BottomSide = Object.freeze(new Spot(0.5, 1, 0, 1)) as Spot;
  static readonly LeftSide = Object.freeze(new Spot(0, 0.5, -1, 0)) as Spot;
  static readonly RightSide = Object.freeze(new Spot(1, 0.5, 1, 0)) as Spot;
  static readonly TopLeftSides = Object.freeze(new Spot(0, 0, -1, -1)) as Spot;
  static readonly TopRightSides = Object.freeze(new Spot(1, 0, 1, -1)) as Spot;
  static readonly BottomLeftSides = Object.freeze(new Spot(0, 1, -1, 1)) as Spot;
  static readonly BottomRightSides = Object.freeze(new Spot(1, 1, 1, 1)) as Spot;
  static readonly LeftRightSides = Object.freeze(new Spot(0.5, 0.5, 0, 0)) as Spot;
  static readonly TopBottomSides = Object.freeze(new Spot(0.5, 0.5, 0, 0)) as Spot;
  static readonly AllSides = Object.freeze(new Spot(0.5, 0.5, 0, 0)) as Spot;

  static parse(str: string): Spot {
    const parts = str.split(/\s+/);
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    const ox = parts.length > 2 ? parseFloat(parts[2]) : 0;
    const oy = parts.length > 3 ? parseFloat(parts[3]) : 0;
    return new Spot(x, y, ox, oy);
  }

  static stringify(s: Spot): string {
    return s.x + ' ' + s.y + ' ' + s.offsetX + ' ' + s.offsetY;
  }

  static isSpot(s: any): s is Spot {
    return s instanceof Spot;
  }
}
