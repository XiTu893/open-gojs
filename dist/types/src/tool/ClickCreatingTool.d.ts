import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Part } from '../view/Part';
/**
 * ClickCreatingTool - creates a new node on click in the background.
 * Used for quick node creation by clicking on empty diagram space.
 */
export declare class ClickCreatingTool extends Tool {
    static readonly className: string;
    private _archetypePartData;
    private _isDoubleClick;
    constructor();
    get archetypePartData(): any;
    set archetypePartData(val: any);
    get isDoubleClick(): boolean;
    set isDoubleClick(val: boolean);
    /**
     * 官方 ClickCreatingTool.canStart（go.js 逐字）：
     *   !isEnabled || archetypeNodeData === null → false
     *   isReadOnly / isModelReadOnly / !allowInsert / !canStartButton() /
     *   isBeyondDragSize() → false
     *   clickCount 必须匹配 isDoubleClick 设置
     *   最后 currentTool !== this && 指下有部件 → false
     */
    canStart(): boolean;
    /** Create the part on mouse up. */
    doMouseUp(): void;
    /** Insert a new part at the given location. */
    insertPart(loc: Point): Part | null;
}
