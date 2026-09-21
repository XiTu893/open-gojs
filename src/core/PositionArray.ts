export class PositionArray {
  private _positions: number[] = [];

  constructor(positions?: number[]) {
    if (positions) {
      this._positions = positions.slice();
    }
  }

  get count(): number {
    return Math.floor(this._positions.length / 2);
  }

  getPoint(i: number): { x: number; y: number } {
    const offset = i * 2;
    return {
      x: this._positions[offset],
      y: this._positions[offset + 1]
    };
  }

  setPoint(i: number, x: number, y: number): void {
    const offset = i * 2;
    this._positions[offset] = x;
    this._positions[offset + 1] = y;
  }

  addPoint(x: number, y: number): void {
    this._positions.push(x, y);
  }

  insertPoint(i: number, x: number, y: number): void {
    const offset = i * 2;
    const existing = this._positions.length;
    this._positions.splice(offset, 0, x, y);
  }

  removePoint(i: number): void {
    const offset = i * 2;
    this._positions.splice(offset, 2);
  }

  toArray(): number[] {
    return this._positions.slice();
  }

  equals(other: PositionArray): boolean {
    if (other === this) return true;
    if (other._positions.length !== this._positions.length) return false;
    for (let i = 0; i < this._positions.length; i++) {
      if (this._positions[i] !== other._positions[i]) return false;
    }
    return true;
  }

  clone(): PositionArray {
    return new PositionArray(this._positions.slice());
  }
}