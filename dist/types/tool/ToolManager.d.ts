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
import { GraphObject } from '../view/GraphObject';
import { List } from '../core/List';
import { Size } from '../core/Size';
/**
 * ToolManager - manages tool dispatch and event routing.
 * Holds lists of mouse-down, mouse-move, and mouse-up tools,
 * and dispatches events to the appropriate tool.
 */
export declare class ToolManager extends Tool {
    static readonly className: string;
    private _mouseDownTools;
    private _mouseMoveTools;
    private _mouseUpTools;
    private _mouseHoverTools;
    /** null 表示"没有专用工具在跑，由 ToolManager 自己处理"（官方 = currentTool 为 toolManager） */
    private _currentTool;
    private _defaultTool;
    private _hoverDelay;
    private _holdDelay;
    private _lastInput;
    private _previousInput;
    private _mouseDownPoint;
    constructor();
    get mouseDownTools(): List<Tool>;
    set mouseDownTools(val: List<Tool> | Tool[] | Iterable<Tool>);
    get mouseMoveTools(): List<Tool>;
    set mouseMoveTools(val: List<Tool> | Tool[] | Iterable<Tool>);
    get mouseUpTools(): List<Tool>;
    set mouseUpTools(val: List<Tool> | Tool[] | Iterable<Tool>);
    get mouseHoverTools(): List<Tool>;
    set mouseHoverTools(val: List<Tool> | Tool[] | Iterable<Tool>);
    /**
     * 官方语义：Diagram.currentTool 初始 = defaultTool，而 defaultTool 初始 = toolManager。
     * 这里 `_currentTool === null` 即"ToolManager 自己是当前工具"，getter 回落到 this。
     */
    get currentTool(): Tool;
    set currentTool(val: Tool | null);
    get defaultTool(): Tool;
    set defaultTool(val: Tool);
    /**
     * 官方 ToolManager 暴露的每个内置工具实例都能被样例拿到，
     * 不管它被放进哪张工具表 —— 样例大量写
     * `myDiagram.toolManager.clickSelectingTool.standardMouseSelect = fn`、
     * `myDiagram.toolManager.textEditingTool.acceptText = fn`。
     * 以前每个 getter 只在**某一张**表里找（`clickSelectingTool` 找 mouseDownTools、
     * `textEditingTool` 找 mouseDownTools），找不到就返回 undefined，
     * 样例赋值时直接 `Cannot set properties of undefined`（实测 distances / audioEditor）。
     * 这里三张表全查。
     */
    private _toolOfType;
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
    /**
     * 必须显式再声明一次 getter：子类里只写 `set diagram` 会**遮蔽**
     * 父类 `Tool` 的 getter —— JS 访问器描述符里 `get` 会变成 undefined，
     * `this.diagram` 直接返回 undefined，于是 `doMouseDown/doMouseUp/...`
     * 全部在第一行 `if (!diagram) return;` 处早退，整个 ToolManager 失效。
     */
    get diagram(): Diagram | null;
    set diagram(val: Diagram | null);
    /**
     * 样例通常在 Diagram 构建完之后才往三个工具表里 `add`/`insertAt` 新工具，
     * 这些后加的工具既没有 `toolManager` 也没有 `diagram`。
     * 在每次事件分发前统一补齐，避免 `this.diagram` 取到 null。
     */
    private _syncTools;
    /**
     * 官方 ToolManager.doMouseDown（go.js 逐字）：
     * 1. 遍历 mouseDownTools，canStart 的那个成为 currentTool 并激活；
     * 2. 中键则切换 mouseWheelBehavior（Scroll ↔ Zoom）；
     * 3. 否则 ToolManager 自己 doActivate()，把这次手势接管过来。
     */
    doMouseDown(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    /** 官方 ToolManager.doWaitAfter —— 悬停延迟到点后触发 hover 与 tooltip。 */
    doWaitAfter(t?: any): void;
    /** Dispatch key-down event to the current tool. */
    doKeyDown(): void;
    /** Dispatch key-up event to the current tool. */
    doKeyUp(): void;
    /** Dispatch mouse-wheel event to the current tool. */
    doMouseWheel(): void;
    /**
     * Update adornments for all relevant parts.
     * 对齐官方 `Diagram.selectCollection`：
     *   `mouseDownTools.each(i => { i.isEnabled && i.updateAdornments(part) })`
     */
    updateAdornments(part: any): void;
    /**
     * 官方 Tool.standardMouseWheel（go.js 逐字，含 mouseWheelBehavior 分支）：
     *   WheelScroll(1) + ctrl  → 缩放；WheelZoom(2) + 非 shift → 缩放
     *   WheelZoom(2) + shift   → 滚动；WheelScroll(1) + 非 ctrl → 滚动
     * 以前无脑"ctrl 或小步长就缩放"，mouseWheelBehavior 形同虚设。
     */
    standardMouseWheel(): void;
    /** 以 viewPoint 为锚点缩放（等价官方 `zoomPoint = viewPoint; increaseZoom()`）。 */
    private _zoomAt;
    /** 官方 ToolManager.doMouseWheel = standardMouseWheel。 */
    static WheelScroll: import("../core/EnumValues").EnumValue;
    static WheelZoom: import("../core/EnumValues").EnumValue;
    static WheelNone: import("../core/EnumValues").EnumValue;
    static GestureZoom: import("../core/EnumValues").EnumValue;
    static GestureCancel: import("../core/EnumValues").EnumValue;
    static GestureNone: import("../core/EnumValues").EnumValue;
    private _mouseWheelBehavior;
    private _gestureBehavior;
    private _dragSize;
    private _toolTipDuration;
    private _toolTipTimer;
    private _currentToolTip;
    private _toolTipAdornment;
    get mouseWheelBehavior(): any;
    set mouseWheelBehavior(val: any);
    get gestureBehavior(): any;
    set gestureBehavior(val: any);
    get toolTipDuration(): number;
    set toolTipDuration(val: number);
    get dragSize(): Size;
    set dragSize(val: Size);
    get currentToolTip(): any;
    set currentToolTip(val: any);
    initializeStandardTools(): this;
    findTool(name: string): Tool | null;
    private _findToolIn;
    replaceTool(name: string, newtool: Tool | null): Tool | null;
    private _replaceToolIn;
    replaceStandardTool(name: string, newtool: Tool | null, list: List<Tool>): void;
    showToolTip(toolTip: any, obj?: GraphObject | null): void;
    positionToolTip(toolTip: any, obj?: GraphObject | null): void;
    extendToolTip(duration?: number): void;
    hideToolTip(): void;
    doToolTip(): void;
    doMouseHover(): void;
}
