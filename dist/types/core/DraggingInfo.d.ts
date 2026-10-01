import { Point } from './Point';
/**
 * 官方 `DraggingInfo`（go.d.ts: class DraggingInfo）—— 拖动过程中被拖对象的初始位置。
 */
export declare class DraggingInfo {
    static readonly className: string;
    private _point;
    constructor(pt?: Point);
    get point(): Point;
    set point(value: Point);
}
