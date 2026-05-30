import { Tool } from './Tool';
/**
 * PanningTool - pans the viewport by dragging.
 * The user drags to scroll the diagram viewport.
 */
export declare class PanningTool extends Tool {
    private _originalPosition;
    private _startPoint;
    constructor();
    /** Can start if the user clicks on the background with no part. */
    canStart(): boolean;
    /** Activate the panning tool. */
    doActivate(): void;
    /** Pan the viewport on mouse move. */
    doMouseMove(): void;
    /** Clean up on deactivate. */
    doDeactivate(): void;
}
