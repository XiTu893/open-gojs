import { Tool } from './Tool';
/**
 * PanningTool - pans the viewport by dragging.
 * The user drags to scroll the diagram viewport.
 */
export declare class PanningTool extends Tool {
    static readonly className: string;
    private _originalPosition;
    private _startPoint;
    constructor();
    /**
     * 官方 PanningTool.canStart（go.js 逐字）：
     *   !(!allowHorizontalScroll && !allowVerticalScroll ||
     *     !canStartButton() ||
     *     (currentTool !== this && !isBeyondDragSize() && !isMultiTouch))
     * 以前完全没有 button / dragSize 判定，右键或轻微点击也会被当成平移手势。
     */
    canStart(): boolean;
    /** Activate the panning tool. */
    doActivate(): void;
    /** Pan the viewport on mouse move. */
    doMouseMove(): void;
    /** Clean up on deactivate. */
    doDeactivate(): void;
}
