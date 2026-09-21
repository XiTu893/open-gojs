export class SGradient {
  private _type: string;
  private _color1: string;
  private _color2: string;
  private _angle: number;

  constructor(type: string, color1: string, color2: string, angle: number = 0) {
    this._type = type;
    this._color1 = color1;
    this._color2 = color2;
    this._angle = angle;
  }

  get type(): string { return this._type; }
  get color1(): string { return this._color1; }
  get color2(): string { return this._color2; }
  get angle(): number { return this._angle; }

  toString(): string {
    return `SGradient ${this._type}(${this._color1} => ${this._color2} at ${this._angle}°)`;
  }
}