import { Point } from './Point';
import { Rect } from './Rect';

/**
 * 官方 `DraggingInfo`（go.d.ts: class DraggingInfo）—— 拖动过程中被拖对象的初始位置。
 */
export class DraggingInfo {
  static readonly className: string = "DraggingInfo";

  private _point: Point;

  constructor(pt?: Point) {
    this._point = pt ? pt.copy() : new Point(NaN, NaN);
  }

  get point(): Point { return this._point; }
  set point(value: Point) {
    this._point = value ? value.copy() : new Point(NaN, NaN);
  }
}