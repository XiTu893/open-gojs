import { Tool } from './Tool';
import { Point } from '../core/Point';
import { GraphObject } from '../view/GraphObject';
export declare class RotatingTool extends Tool {
    private _handle;
    private _adornedElement;
    private _angle;
    private _originalAngle;
    protected _handleArchetype: GraphObject | null;
    constructor();
    private _createHandleArchetype;
    get handle(): GraphObject | null;
    set handle(val: GraphObject | null);
    get adornedElement(): GraphObject | null;
    set adornedElement(val: GraphObject | null);
    get angle(): number;
    set angle(val: number);
    get handleArchetype(): GraphObject | null;
    set handleArchetype(val: GraphObject | null);
    canStart(): boolean;
    doActivate(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doDeactivate(): void;
    computeRotate(element: GraphObject, newPoint: Point): number;
    updateAdornments(part: any): void;
    private _makeRotateAdornment;
}
