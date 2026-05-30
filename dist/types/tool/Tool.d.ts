import { Diagram } from '../diagram/Diagram';
import { Point } from '../core/Point';
/**
 * Tool - base class for all interactive tools in the diagram.
 * Provides virtual methods for mouse/keyboard/touch event handling,
 * transaction management, and standard interaction patterns.
 */
export declare class Tool {
    protected _diagram: Diagram | null;
    protected _isActive: boolean;
    private _isEnabled;
    private _name;
    private _transactionResult;
    constructor();
    get diagram(): Diagram | null;
    set diagram(val: Diagram | null);
    get isActive(): boolean;
    set isActive(val: boolean);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get name(): string;
    set name(val: string);
    get transactionResult(): string | null;
    set transactionResult(val: string | null);
    /** Whether this tool can start operating at the current input event. */
    canStart(): boolean;
    /** Called when this tool becomes the current tool. */
    doActivate(): void;
    /** Cancel the tool's operation. */
    doCancel(): void;
    /** Called when this tool is no longer the current tool. */
    doDeactivate(): void;
    /** Handle key-down events. */
    doKeyDown(): void;
    /** Handle key-up events. */
    doKeyUp(): void;
    /** Handle mouse-down events. */
    doMouseDown(): void;
    /** Handle mouse-move events. */
    doMouseMove(): void;
    /** Handle mouse-up events. */
    doMouseUp(): void;
    /** Handle mouse-wheel events. */
    doMouseWheel(): void;
    /** Called when this tool first starts. */
    doStart(): void;
    /** Called when this tool stops. */
    doStop(): void;
    /** Wait after a period of inactivity (e.g. for hover). */
    doWaitAfter(): void;
    /** Whether multi-touch gestures can start this tool. */
    canStartMultiTouch(): boolean;
    /** Cancel any pending wait-after timer. */
    cancelWaitAfter(): void;
    /** Find a tool handle at the given document point. */
    findToolHandleAt(p: Point): any | null;
    private _findHandleInPanel;
    /** Whether the distance between two points exceeds the drag threshold. */
    isBeyondDragSize(first: Point, second: Point): boolean;
    /** Standard mouse click behavior: select and raise click event. */
    standardMouseClick(): void;
    /** Standard mouse select behavior: select parts on click. */
    standardMouseSelect(): void;
    /** Standard mouse wheel behavior: zoom in/out. */
    standardMouseWheel(): void;
    /** Standard pinch zoom start for multi-touch. */
    standardPinchZoomStart(): void;
    /** Standard pinch zoom move for multi-touch. */
    standardPinchZoomMove(): void;
    /** Standard wait-after behavior: schedule a timer. */
    standardWaitAfter(delay: number): void;
    /** Start a new transaction. */
    startTransaction(tname?: string): boolean;
    /** Stop this tool and remove it from the ToolManager. */
    stopTool(): void;
    /** Stop the current transaction. */
    stopTransaction(): boolean;
    /** Update adornments for relevant parts. */
    updateAdornments(part: any): void;
}
