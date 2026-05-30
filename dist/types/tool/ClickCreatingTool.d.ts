import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Part } from '../view/Part';
/**
 * ClickCreatingTool - creates a new node on click in the background.
 * Used for quick node creation by clicking on empty diagram space.
 */
export declare class ClickCreatingTool extends Tool {
    private _archetypePartData;
    private _isDoubleClick;
    constructor();
    get archetypePartData(): any;
    set archetypePartData(val: any);
    get isDoubleClick(): boolean;
    set isDoubleClick(val: boolean);
    /** Can start if the user clicks in the background and archetype data is set. */
    canStart(): boolean;
    /** Create the part on mouse up. */
    doMouseUp(): void;
    /** Insert a new part at the given location. */
    insertPart(loc: Point): Part | null;
}
