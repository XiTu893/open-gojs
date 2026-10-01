import { Diagram } from '../diagram/Diagram';
import { InputEvent } from '../diagram/InputEvent';
import { Point } from '../core/Point';
import type { ToolManager } from './ToolManager';
/**
 * Tool - base class for all interactive tools in the diagram.
 * Provides virtual methods for mouse/keyboard/touch event handling,
 * transaction management, and standard interaction patterns.
 */
export declare class Tool {
    static readonly className: string;
    protected _diagram: Diagram | null;
    protected _isActive: boolean;
    private _isEnabled;
    private _name;
    private _transactionResult;
    /**
     * 所属 ToolManager。样例经常在 Diagram 构建完成之后才
     * `toolManager.mouseDownTools.add(new MyTool())`，此时新 Tool 的
     * `_diagram` 还是 null —— 若只靠 ToolManager 构造时的一次性赋值，
     * 后加的 Tool 在 `canStart/updateAdornments` 里取 `this.diagram`
     * 就会得到 null（实测 SectorReshaping / LinkShifting 直接抛
     * `Cannot read properties of null (reading 'isReadOnly')`）。
     * 因此这里保留 toolManager 引用，让 `diagram` 能回落到
     * `toolManager.diagram`。
     */
    private _toolManager;
    constructor();
    get diagram(): Diagram | null;
    set diagram(val: Diagram | null);
    get toolManager(): ToolManager | null;
    set toolManager(val: ToolManager | null);
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
    /** 上一次鼠标悬停的对象（用于 mouseEnter/mouseLeave/mouseOver 追踪）。 */
    private _overObject;
    toString(): string;
    /**
     * 官方 Tool.canStartButton
     * 当前工具是否可因主键（左键）按下而启动。
     * 官方使用 lastInput.left；本项目 InputEvent 提供 leftButton。
     */
    canStartButton(): boolean;
    /** 官方 Tool.doUpdateCursor —— 将图表面板光标重置为空。 */
    doUpdateCursor(t: any): void;
    /**
     * 官方 Tool.doWheelChange
     * 若滚轮位置改变（或存在水平滚轮偏移），则标记事件不再继续向外传播。
     * 注：本项目未接入该调用，属于 API 对齐的惰性实现。
     */
    doWheelChange(oldPoint: Point, newPoint: Point, input: InputEvent): void;
    /**
     * 官方 Tool.standardMouseOver
     * 标准鼠标悬停处理：计算目标对象，派发 mouseLeave/mouseEnter/mouseOver，
     * 并设置 currentCursor。本项目未接入调用，属于 API 对齐的惰性实现。
     */
    standardMouseOver(): void;
}
