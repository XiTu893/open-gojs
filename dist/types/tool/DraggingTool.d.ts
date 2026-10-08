import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Map } from '../core/Map';
import type { Part } from '../view/Part';
export declare class DraggingTool extends Tool {
    static readonly className: string;
    private _isCopy;
    private _isCopyEnabled;
    private _startPoint;
    private _draggedParts;
    private _copiedParts;
    private _isDragOut;
    private _targetDiagram;
    private _dragOutParts;
    private _globalMouseMoveHandler;
    private _globalMouseUpHandler;
    constructor();
    get isCopy(): boolean;
    set isCopy(val: boolean);
    get isCopyEnabled(): boolean;
    set isCopyEnabled(val: boolean);
    get copiedParts(): Map<Part, Point> | null;
    set copiedParts(val: Map<Part, Point> | null);
    get draggedParts(): Map<Part, Point> | null;
    set draggedParts(val: Map<Part, Point> | null);
    mayCopy(): boolean;
    mayMove(): boolean;
    /**
     * 官方 DraggingTool.canStart（go.js 逐字）：
     *   !isEnabled / (isReadOnly && !allowDragOut) / (!allowMove && !allowCopy &&
     *   !allowDragOut) / !allowSelect / !canStartButton() → false
     *   currentTool !== this 时要求 isBeyondDragSize()（触摸还要过 delay）
     *   最后 findDraggablePart() !== null
     * 以前缺 canStartButton + isBeyondDragSize + allowSelect 三条，而且 Dragging
     * 被排在 mouseDownTools 里，于是"点一下不拖也算拖拽、点选永远轮不到"。
     */
    canStart(): boolean;
    /** 官方 DraggingTool.findDraggablePart —— 从 **firstInput** 落点找可拖部件。 */
    findDraggablePart(): Part | null;
    /**
     * 官方 DraggingTool.standardMouseSelect：基于 **firstInput** 落点，
     * 选中可拖部件并把它设为 currentPart（默认选区被清空成单选）。
     */
    standardMouseSelect(): void;
    private _currentPart;
    private _delay;
    get currentPart(): Part | null;
    set currentPart(val: Part | null);
    get delay(): number;
    set delay(val: number);
    doActivate(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doDeactivate(): void;
    doCancel(): void;
    computeMove(part: Part, newLoc: Point): Point;
    private _copyParts;
    private _removeCopiedParts;
    private _startDragOut;
    private _finishDragOut;
    private _findTargetDiagram;
    private _clientToDoc;
    private _setupGlobalListeners;
    private _removeGlobalListeners;
}
