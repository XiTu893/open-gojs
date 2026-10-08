import { Tool } from './Tool';
import { Rect } from '../core/Rect';
/**
 * DragSelectingTool - box (rubber-band) selection tool.
 * Allows the user to draw a rectangle to select multiple parts.
 */
export declare class DragSelectingTool extends Tool {
    static readonly className: string;
    private _box;
    private _startPoint;
    constructor();
    get box(): Rect | null;
    set box(val: Rect | null);
    /** Can start if the user clicks in the background (no part). */
    private _delay;
    get delay(): number;
    set delay(val: number);
    /**
     * 官方 DragSelectingTool.canStart（go.js 逐字）：
     *   !allowSelect / !canStartButton() → false
     *   currentTool !== this 时要求 isBeyondDragSize()、过 delay、指下无部件
     * 以前缺 canStartButton 与 isBeyondDragSize，右键一按就开始框选。
     */
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
