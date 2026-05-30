import { Tool } from './Tool';
import { Diagram } from '../diagram/Diagram';
import { InputEvent } from '../diagram/InputEvent';
import { ClickSelectingTool } from './ClickSelectingTool';
import { DraggingTool } from './DraggingTool';
import { DragSelectingTool } from './DragSelectingTool';
import { LinkingTool } from './LinkingTool';
import { RelinkingTool } from './RelinkingTool';
import { LinkReshapingTool } from './LinkReshapingTool';
import { ResizingTool } from './ResizingTool';
import { RotatingTool } from './RotatingTool';
import { TextEditingTool } from './TextEditingTool';
import { PanningTool } from './PanningTool';
import { ContextMenuTool } from './ContextMenuTool';
import { ClickCreatingTool } from './ClickCreatingTool';
import { ActionTool } from './ActionTool';
/**
 * ToolManager - manages tool dispatch and event routing.
 * Holds lists of mouse-down, mouse-move, and mouse-up tools,
 * and dispatches events to the appropriate tool.
 */
export declare class ToolManager extends Tool {
    private _mouseDownTools;
    private _mouseMoveTools;
    private _mouseUpTools;
    private _mouseHoverTools;
    private _currentTool;
    private _defaultTool;
    private _hoverDelay;
    private _holdDelay;
    private _lastInput;
    private _previousInput;
    private _mouseDownPoint;
    constructor();
    get mouseDownTools(): Tool[];
    set mouseDownTools(val: Tool[]);
    get mouseMoveTools(): Tool[];
    set mouseMoveTools(val: Tool[]);
    get mouseUpTools(): Tool[];
    set mouseUpTools(val: Tool[]);
    get mouseHoverTools(): Tool[];
    set mouseHoverTools(val: Tool[]);
    get currentTool(): Tool | null;
    set currentTool(val: Tool | null);
    get defaultTool(): Tool;
    set defaultTool(val: Tool);
    get clickSelectingTool(): ClickSelectingTool;
    get draggingTool(): DraggingTool;
    get dragSelectingTool(): DragSelectingTool;
    get linkingTool(): LinkingTool;
    get relinkingTool(): RelinkingTool;
    get linkReshapingTool(): LinkReshapingTool;
    get resizingTool(): ResizingTool;
    get rotatingTool(): RotatingTool;
    get textEditingTool(): TextEditingTool;
    get panningTool(): PanningTool;
    get contextMenuTool(): ContextMenuTool;
    get clickCreatingTool(): ClickCreatingTool;
    get actionTool(): ActionTool;
    get hoverDelay(): number;
    set hoverDelay(val: number);
    get holdDelay(): number;
    set holdDelay(val: number);
    get lastInput(): InputEvent;
    set lastInput(val: InputEvent);
    get previousInput(): InputEvent;
    set diagram(val: Diagram | null);
    /** Dispatch mouse-down event to the appropriate tool. */
    doMouseDown(): void;
    /** Dispatch mouse-move event to the current tool. */
    doMouseMove(): void;
    /** Dispatch mouse-up event to the current tool. */
    doMouseUp(): void;
    /** Dispatch key-down event to the current tool. */
    doKeyDown(): void;
    /** Dispatch key-up event to the current tool. */
    doKeyUp(): void;
    /** Dispatch mouse-wheel event to the current tool. */
    doMouseWheel(): void;
    /** Update adornments for all relevant parts. */
    updateAdornments(part: any): void;
    /** Standard mouse wheel: zoom in/out centered on mouse position. */
    standardMouseWheel(): void;
}
