import { Tool } from './Tool';
import { Rect } from '../core/Rect';
/**
 * DragSelectingTool - box (rubber-band) selection tool.
 * Allows the user to draw a rectangle to select multiple parts.
 */
export declare class DragSelectingTool extends Tool {
    private _box;
    private _startPoint;
    constructor();
    get box(): Rect | null;
    set box(val: Rect | null);
    /** Can start if the user clicks in the background (no part). */
    canStart(): boolean;
    /** Activate and start the box selection. */
    doActivate(): void;
    /** Update the selection box on mouse move. */
    doMouseMove(): void;
    /** Finalize the selection on mouse up. */
    doMouseUp(): void;
    /** Clean up on deactivate. */
    doDeactivate(): void;
    /** Select all parts within the given rectangle. */
    selectInRect(r: Rect): void;
}
