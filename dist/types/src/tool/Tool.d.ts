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
    /** 官方 Tool.canStartButton —— 当前输入是否为主键（左键）按下。 */
    canStartButton(): boolean;
    /** Called when this tool becomes the current tool. */
    doActivate(): void;
    /** Cancel the tool's operation. */
    doCancel(): void;
    /** Called when this tool is no longer the current tool. */
    doDeactivate(): void;
    /** Handle key-down events. 官方：Escape → doCancel。 */
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
    /** Whether multi-touch gestures can start this tool. */
    canStartMultiTouch(): boolean;
    /**
     * 官方 `Tool.findToolHandleAt(point, category)`：
     * 取指下最上层对象，沿 `panel` 链走到"其 panel 是 Adornment"的对象（即句柄本身），
     * 该 Adornment 的 category 必须等于给定 category（缺省用 `this.name`）。
     * Adornment 层在本项目里是 temporary，`findPartAt` 会跳过，所以直接遍历该层做同样的判定。
     */
    findToolHandleAt(p: Point, category?: string): any | null;
    /** 文档坐标命中测试：自上而下找最顶层元素（官方 Layer/Panel.findObjectAt 的遍历序） */
    private _findHandleInPanel;
    /**
     * 官方 Tool.isBeyondDragSize(first?, second?)
     * 默认比较 firstInput/lastInput 的 **viewPoint**，阈值取
     * `toolManager.dragSize`（默认 2×2），触摸输入额外放宽 6。
     */
    isBeyondDragSize(first?: Point, second?: Point): boolean;
    /** Standard mouse click behavior: select and raise click event. */
    standardMouseClick(): void;
    /**
     * 官方 Tool.standardMouseSelect（逐字对齐 go.js）：
     * - !allowSelect → 直接返回
     * - ctrl/meta → 切换选中；shift → 追加选中；否则 → 选中（已选中则不动作）
     * - 指下无部件时，仅在"主键且无修饰键"时 clearSelection
     */
    standardMouseSelect(): void;
    /** Standard mouse wheel behavior: zoom in/out. */
    standardMouseWheel(): void;
    /** Standard pinch zoom start for multi-touch. */
    standardPinchZoomStart(): void;
    /** Standard pinch zoom move for multi-touch. */
    standardPinchZoomMove(): void;
    private _waitTimer;
    standardWaitAfter(delay: number, input?: any): void;
    cancelWaitAfter(): void;
    doWaitAfter(_t?: any): void;
    /** Start a new transaction. 官方会先把 transactionResult 置空。 */
    startTransaction(tname?: string): boolean;
    /** Stop this tool and return to the default current tool. */
    stopTool(): void;
    /** 官方 Tool.stopTransaction —— 有 transactionResult 就 commit，否则 rollback。 */
    stopTransaction(): boolean;
    /** Update adornments for relevant parts. */
    updateAdornments(part: any): void;
    /** 上一次鼠标悬停的对象（用于 mouseEnter/mouseLeave/mouseOver 追踪）。 */
    private _overObject;
    toString(): string;
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
