import { EnumValue } from '../core/EnumValues';
import { Layout } from './Layout';
/**
 * CircularLayout - arranges nodes in a circle or circular pattern.
 */
export declare class CircularLayout extends Layout {
    private _radius;
    private _startAngle;
    private _sweepAngle;
    private _arrangement;
    private _spacing;
    private _direction;
    private _aspectRatio;
    get radius(): number;
    set radius(val: number);
    get startAngle(): number;
    set startAngle(val: number);
    get sweepAngle(): number;
    set sweepAngle(val: number);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue);
    get spacing(): number;
    set spacing(val: number);
    get direction(): EnumValue;
    set direction(val: EnumValue);
    get aspectRatio(): number;
    set aspectRatio(val: number);
    copy(): CircularLayout;
    doLayout(coll: any): void;
    /**
     * Layout a single connected component in a circle.
     */
    private _layoutComponent;
    /**
     * Compute an appropriate radius based on the vertex sizes and spacing.
     */
    private _computeRadius;
    static Circular: EnumValue;
}
