import { Tool } from './Tool';
import { Diagram } from '../diagram/Diagram';
import { InputEvent } from '../diagram/InputEvent';
import { Point } from '../core/Point';
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
import { Adornment } from '../view/Adornment';
import { GraphObject } from '../view/GraphObject';
import { List } from '../core/List';
import { Spot } from '../core/Spot';
import { Size } from '../core/Size';
import { WheelModeNone, WheelModeScroll, WheelModeZoom, GestureModeCancel, GestureModeNone, GestureModeZoom } from '../core/EnumValues';

/**
 * ToolManager - manages tool dispatch and event routing.
 * Holds lists of mouse-down, mouse-move, and mouse-up tools,
 * and dispatches events to the appropriate tool.
 */
export class ToolManager extends Tool {
  static readonly className: string = "ToolManager";

  private _mouseDownTools: List<Tool> = new List<Tool>();
  private _mouseMoveTools: List<Tool> = new List<Tool>();
  private _mouseUpTools: List<Tool> = new List<Tool>();
  private _mouseHoverTools: List<Tool> = new List<Tool>();
  /** null 表示"没有专用工具在跑，由 ToolManager 自己处理"（官方 = currentTool 为 toolManager） */
  private _currentTool: Tool | null = null;
  private _defaultTool: Tool;
  private _hoverDelay: number = 850;
  private _holdDelay: number = 850;
  private _lastInput: InputEvent = new InputEvent();
  private _previousInput: InputEvent = new InputEvent();
  private _mouseDownPoint: Point | null = null;

  constructor() {
    super();
    this.name = 'ToolManager';

    // Create default tool instances
    const clickSelectingTool = new ClickSelectingTool();
    const draggingTool = new DraggingTool();
    const dragSelectingTool = new DragSelectingTool();
    const linkingTool = new LinkingTool();
    const relinkingTool = new RelinkingTool();
    const linkReshapingTool = new LinkReshapingTool();
    const resizingTool = new ResizingTool();
    const rotatingTool = new RotatingTool();
    const textEditingTool = new TextEditingTool();
    const panningTool = new PanningTool();
    const contextMenuTool = new ContextMenuTool();
    const clickCreatingTool = new ClickCreatingTool();
    const actionTool = new ActionTool();

    // 官方 ToolManager 本身没有 defaultTool；Diagram.defaultTool 初始即 toolManager。
    // 这里把 defaultTool 设为自身，使得 Tool.stopTool() 归位到"空闲态"（_currentTool = null）。
    this._defaultTool = this;
    this._currentTool = null;

    /**
     * 官方 ToolManager.initializeStandardTools() 的三张表与顺序（go.js 逐字）：
     *   mouseDown: Action, Relinking, LinkReshaping, Rotating, Resizing
     *   mouseMove: Linking, Dragging, DragSelecting, Panning
     *   mouseUp:   ContextMenu, TextEditing, ClickCreating, ClickSelecting
     *
     * 以前 Dragging/DragSelecting/Panning/Linking 全塞在 mouseDownTools 里：
     * mousedown 一按下 DraggingTool 就激活并吞掉事件，ClickSelectingTool 永远
     * 没机会跑 → 点击选不中；而且 DraggingTool.canStart 缺 isBeyondDragSize 判定，
     * 点一下不拖也当成拖拽。这一条是"点击选不中"的根因。
     */
    this._mouseDownTools = new List<Tool>([
      actionTool,
      relinkingTool,
      linkReshapingTool,
      rotatingTool,
      resizingTool,
    ]);

    this._mouseMoveTools = new List<Tool>([
      linkingTool,
      draggingTool,
      dragSelectingTool,
      panningTool,
    ]);

    this._mouseUpTools = new List<Tool>([
      contextMenuTool,
      textEditingTool,
      clickCreatingTool,
      clickSelectingTool,
    ]);

    // Mouse-hover tools
    this._mouseHoverTools = new List<Tool>();
    this._syncTools();
  }

  // ============ Properties ============

  get mouseDownTools(): List<Tool> { return this._mouseDownTools; }
  set mouseDownTools(val: List<Tool> | Tool[] | Iterable<Tool>) {
    this._mouseDownTools = val instanceof List ? val : new List<Tool>(val);
  }

  get mouseMoveTools(): List<Tool> { return this._mouseMoveTools; }
  set mouseMoveTools(val: List<Tool> | Tool[] | Iterable<Tool>) {
    this._mouseMoveTools = val instanceof List ? val : new List<Tool>(val);
  }

  get mouseUpTools(): List<Tool> { return this._mouseUpTools; }
  set mouseUpTools(val: List<Tool> | Tool[] | Iterable<Tool>) {
    this._mouseUpTools = val instanceof List ? val : new List<Tool>(val);
  }

  get mouseHoverTools(): List<Tool> { return this._mouseHoverTools; }
  set mouseHoverTools(val: List<Tool> | Tool[] | Iterable<Tool>) {
    this._mouseHoverTools = val instanceof List ? val : new List<Tool>(val);
  }

  /**
   * 官方语义：Diagram.currentTool 初始 = defaultTool，而 defaultTool 初始 = toolManager。
   * 这里 `_currentTool === null` 即"ToolManager 自己是当前工具"，getter 回落到 this。
   */
  get currentTool(): Tool { return this._currentTool !== null ? this._currentTool : this; }
  set currentTool(val: Tool | null) {
    // 官方：currentTool 永不为 null（null 归一化成 defaultTool = ToolManager 自身），
    // 所以"旧的当前工具"是 null 时即 ToolManager 自己，切换时它也要 doDeactivate。
    const old = this._currentTool !== null ? this._currentTool : this;
    if (old !== null) {
      if (old.isActive) old.doDeactivate();
      old.cancelWaitAfter();
      old.doStop();
    }
    let v = val;
    if (v === null || v === undefined) v = this._defaultTool;
    if (v === this || v === null || v === undefined) {
      this._currentTool = null;
      return;
    }
    this._currentTool = v;
    v.toolManager = this;
    v.diagram = this.diagram;
    v.doStart();
  }

  get defaultTool(): Tool { return this._defaultTool; }
  set defaultTool(val: Tool) {
    const prev = this._defaultTool;
    this._defaultTool = val;
    if (val && val !== this) {
      val.diagram = this.diagram;
    }
    if (prev !== val && this._currentTool === null && val && val !== this) {
      this.currentTool = val;
    }
  }

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
  private _toolOfType<T extends Tool>(type: new () => T): T | null {
    const lists = [this._mouseDownTools, this._mouseMoveTools, this._mouseUpTools];
    for (const list of lists) {
      const arr = list.toArray();
      for (const t of arr) {
        if (t instanceof type) return t as T;
      }
    }
    return null;
  }

  get clickSelectingTool(): ClickSelectingTool {
    return this._toolOfType(ClickSelectingTool) as ClickSelectingTool;
  }
  get draggingTool(): DraggingTool {
    return this._toolOfType(DraggingTool) as DraggingTool;
  }
  get dragSelectingTool(): DragSelectingTool {
    return this._toolOfType(DragSelectingTool) as DragSelectingTool;
  }
  get linkingTool(): LinkingTool {
    return this._toolOfType(LinkingTool) as LinkingTool;
  }
  get relinkingTool(): RelinkingTool {
    return this._toolOfType(RelinkingTool) as RelinkingTool;
  }
  get linkReshapingTool(): LinkReshapingTool {
    return this._toolOfType(LinkReshapingTool) as LinkReshapingTool;
  }
  get resizingTool(): ResizingTool {
    return this._toolOfType(ResizingTool) as ResizingTool;
  }
  get rotatingTool(): RotatingTool {
    return this._toolOfType(RotatingTool) as RotatingTool;
  }
  get textEditingTool(): TextEditingTool {
    return this._toolOfType(TextEditingTool) as TextEditingTool;
  }
  get panningTool(): PanningTool {
    return this._toolOfType(PanningTool) as PanningTool;
  }
  get contextMenuTool(): ContextMenuTool {
    return this._toolOfType(ContextMenuTool) as ContextMenuTool;
  }
  get clickCreatingTool(): ClickCreatingTool {
    return this._toolOfType(ClickCreatingTool) as ClickCreatingTool;
  }
  get actionTool(): ActionTool {
    return this._toolOfType(ActionTool) as ActionTool;
  }

  get hoverDelay(): number { return this._hoverDelay; }
  set hoverDelay(val: number) { this._hoverDelay = val; }

  get holdDelay(): number { return this._holdDelay; }
  set holdDelay(val: number) { this._holdDelay = val; }

  get lastInput(): InputEvent { return this._lastInput; }
  set lastInput(val: InputEvent) { this._lastInput = val; }

  get previousInput(): InputEvent { return this._previousInput; }

  // ============ Override Diagram setter ============

  /**
   * 必须显式再声明一次 getter：子类里只写 `set diagram` 会**遮蔽**
   * 父类 `Tool` 的 getter —— JS 访问器描述符里 `get` 会变成 undefined，
   * `this.diagram` 直接返回 undefined，于是 `doMouseDown/doMouseUp/...`
   * 全部在第一行 `if (!diagram) return;` 处早退，整个 ToolManager 失效。
   */
  get diagram(): Diagram | null { return this._diagram; }
  set diagram(val: Diagram | null) {
    this._diagram = val;
    // Propagate diagram to all managed tools
    for (const tool of this._mouseDownTools) { tool.diagram = val; }
    for (const tool of this._mouseMoveTools) { tool.diagram = val; }
    for (const tool of this._mouseUpTools) { tool.diagram = val; }
    for (const tool of this._mouseHoverTools) { tool.diagram = val; }
    if (this._defaultTool && this._defaultTool !== this) { this._defaultTool.diagram = val; }
    if (this._currentTool) { this._currentTool.diagram = val; }
    this._syncTools();
  }

  /**
   * 样例通常在 Diagram 构建完之后才往三个工具表里 `add`/`insertAt` 新工具，
   * 这些后加的工具既没有 `toolManager` 也没有 `diagram`。
   * 在每次事件分发前统一补齐，避免 `this.diagram` 取到 null。
   */
  private _syncTools(): void {
    const link = (list: List<Tool>): void => {
      list.each(t => {
        t.diagram = this._diagram;
        t.toolManager = this;
      });
    };
    link(this._mouseDownTools);
    link(this._mouseMoveTools);
    link(this._mouseUpTools);
    link(this._mouseHoverTools);
  }

  // ============ Event Dispatch Methods ============

  /**
   * 官方 ToolManager.doMouseDown（go.js 逐字）：
   * 1. 遍历 mouseDownTools，canStart 的那个成为 currentTool 并激活；
   * 2. 中键则切换 mouseWheelBehavior（Scroll ↔ Zoom）；
   * 3. 否则 ToolManager 自己 doActivate()，把这次手势接管过来。
   */
  doMouseDown(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).isEnabled) return;
    this._syncTools();

    const input = this._lastInput;
    this._previousInput = this._lastInput.copy();
    this._mouseDownPoint = new Point(input.documentPoint.x, input.documentPoint.y);

    // 已有专用工具在跑 → 交给它
    const cur = this._currentTool;
    if (cur !== null && cur.isActive) {
      cur.doMouseDown();
      return;
    }

    for (const tool of this._mouseDownTools) {
      if (!tool.isEnabled) continue;
      if (tool.canStart()) {
        diagram.doFocus();
        this.currentTool = tool;
        if (this._currentTool === tool) {
          if (!tool.isActive) tool.doActivate();
          if (this._currentTool === tool) tool.doMouseDown();
        }
        return;
      }
    }

    if (input.button === 1) {
      this.mouseWheelBehavior = this.mouseWheelBehavior === WheelModeScroll
        ? WheelModeZoom
        : (this.mouseWheelBehavior === WheelModeZoom ? WheelModeScroll : this.mouseWheelBehavior);
    }

    // 没有工具启动：ToolManager 接管本次手势（官方 this.doActivate()）
    const stale = this._currentTool;
    if (stale !== null) {
      if (stale.isActive) stale.doDeactivate();
      stale.cancelWaitAfter();
      stale.doStop();
    }
    this._currentTool = null;
    this.doActivate();
    this.standardWaitAfter(this.holdDelay, input);
  }

  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).isEnabled) return;

    this._previousInput = this._lastInput.copy();

    const cur = this._currentTool;
    if (cur !== null) {
      // 专用工具（Dragging/Linking/...）激活时由它自己处理
      if (cur.isActive) cur.doMouseMove();
      return;
    }

    if (this.isActive) {
      for (const tool of this._mouseMoveTools) {
        if (!tool.isEnabled) continue;
        if (tool.canStart()) {
          diagram.doFocus();
          this.currentTool = tool;
          if (this._currentTool === tool) {
            if (!tool.isActive) tool.doActivate();
            if (this._currentTool === tool) tool.doMouseMove();
          }
          return;
        }
      }
    }

    // 空闲：标准悬停（cursor / mouseEnter / mouseLeave / mouseOver）
    this.standardMouseOver();
    if (this.isBeyondDragSize()) {
      this.standardWaitAfter(this.isActive ? this.holdDelay : this.hoverDelay, this._lastInput);
    } else {
      this.cancelWaitAfter();
    }
  }

  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).isEnabled) return;
    this._syncTools();

    this.cancelWaitAfter();
    this._previousInput = this._lastInput.copy();

    const cur = this._currentTool;
    if (cur !== null) {
      if (cur.isActive) cur.doMouseUp();
      else this.currentTool = null;
      return;
    }

    if (this.isActive) {
      for (const tool of this._mouseUpTools) {
        if (!tool.isEnabled) continue;
        if (tool.canStart()) {
          diagram.doFocus();
          this.currentTool = tool;
          if (this._currentTool === tool) {
            if (!tool.isActive) tool.doActivate();
            if (this._currentTool === tool) tool.doMouseUp();
          }
          return;
        }
      }
      this.doDeactivate();
    }
  }

  /** 官方 ToolManager.doWaitAfter —— 悬停延迟到点后触发 hover 与 tooltip。 */
  doWaitAfter(t?: any): void {
    const d = this.diagram;
    if (!d) return;
    const saved = d.lastInput;
    if (t) d.lastInput = t;
    this.doMouseHover();
    if (!this.isActive) this.doToolTip();
    if (t && t.isTouchEvent && !d.lastInput.handled) {
      const s = t.copy();
      s.button = 2;
      d.lastInput = s;
      this.doMouseUp();
    }
    d.lastInput = saved;
  }

  /** Dispatch key-down event to the current tool. */
  doKeyDown(): void {
    const cur = this._currentTool;
    if (cur !== null) cur.doKeyDown();
    else if (this.isActive) Tool.prototype.doKeyDown.call(this);
  }

  /** Dispatch key-up event to the current tool. */
  doKeyUp(): void {
    const cur = this._currentTool;
    if (cur !== null) cur.doKeyUp();
    else if (this.isActive) Tool.prototype.doKeyUp.call(this);
  }

  /** Dispatch mouse-wheel event to the current tool. */
  doMouseWheel(): void {
    const cur = this._currentTool;
    if (cur !== null && cur.isActive) cur.doMouseWheel();
    else this.standardMouseWheel();
  }

  /**
   * Update adornments for all relevant parts.
   * 对齐官方 `Diagram.selectCollection`：
   *   `mouseDownTools.each(i => { i.isEnabled && i.updateAdornments(part) })`
   */
  updateAdornments(part: any): void {
    this._syncTools();
    this._mouseDownTools.each(tool => {
      if (tool.isEnabled) tool.updateAdornments(part);
    });
  }

  /**
   * 官方 Tool.standardMouseWheel（go.js 逐字，含 mouseWheelBehavior 分支）：
   *   WheelScroll(1) + ctrl  → 缩放；WheelZoom(2) + 非 shift → 缩放
   *   WheelZoom(2) + shift   → 滚动；WheelScroll(1) + 非 ctrl → 滚动
   * 以前无脑"ctrl 或小步长就缩放"，mouseWheelBehavior 形同虚设。
   */
  standardMouseWheel(): void {
    const d = this.diagram;
    if (!d) return;
    const i = this._lastInput;
    let e = i.delta;
    if (e === 0 || !d.documentBounds.isReal()) return;
    const s = d.commandHandler;
    const n = this.mouseWheelBehavior;

    if (s !== null && ((n === WheelModeZoom && !i.shift) || (n === WheelModeScroll && i.control))) {
      if (e > 0 ? s.canIncreaseZoom() : s.canDecreaseZoom()) {
        this._zoomAt(new Point(i.viewPoint.x, i.viewPoint.y), e > 0);
      }
      i.bubbles = false;
    } else if ((n === WheelModeZoom && i.shift) || (n === WheelModeScroll && !i.control)) {
      const oldPos = d.position.copy();
      const ne2: any = i.nativeEvent;
      const mode = (ne2 && typeof ne2.deltaMode === 'number')
        ? (ne2.deltaMode === 1 ? 'line' : (ne2.deltaMode === 2 ? 'page' : 'pixel'))
        : 'pixel';
      let h = (ne2 && typeof ne2.deltaX === 'number') ? ne2.deltaX : 0;
      let a = (ne2 && typeof ne2.deltaY === 'number') ? ne2.deltaY : 0;
      if ((h !== 0 || a !== 0) && !i.shift) {
        const lh = d.scrollHorizontalLineChange;
        const lv = d.scrollVerticalLineChange;
        if (h !== 0 && d.allowHorizontalScroll) {
          const v = h * (lh / 16);
          d.scroll(mode, v > 0 ? 'right' : 'left', Math.abs(v));
        }
        if (a !== 0 && d.allowVerticalScroll) {
          const v = a * (lv / 16);
          d.scroll(mode, v > 0 ? 'down' : 'up', Math.abs(v));
        }
      } else if (!i.shift && d.allowVerticalScroll) {
        const v = e * 3 * d.scrollVerticalLineChange;
        d.scroll(mode, v > 0 ? 'up' : 'down', Math.abs(v));
      } else if (i.shift && d.allowHorizontalScroll) {
        const v = e * 3 * d.scrollHorizontalLineChange;
        d.scroll(mode, v > 0 ? 'left' : 'right', Math.abs(v));
      }
      this.doWheelChange(oldPos, d.position, i);
    }
  }

  /** 以 viewPoint 为锚点缩放（等价官方 `zoomPoint = viewPoint; increaseZoom()`）。 */
  private _zoomAt(viewPoint: Point, up: boolean): void {
    const d = this.diagram;
    if (!d) return;
    const zf = (d.commandHandler && (d.commandHandler as any).zoomFactor) || 1.05;
    const f = up ? zf : 1 / zf;
    const oldScale = d.scale;
    let ns = oldScale * f;
    ns = Math.max(d.minScale, Math.min(d.maxScale, ns));
    if (ns === oldScale) return;
    const doc = d.transformViewToDoc(new Point(viewPoint.x, viewPoint.y));
    d.scale = ns;
    const doc2 = d.transformViewToDoc(new Point(viewPoint.x, viewPoint.y));
    d.position = new Point(
      d.position.x + (doc.x - doc2.x),
      d.position.y + (doc.y - doc2.y)
    );
  }

  /** 官方 ToolManager.doMouseWheel = standardMouseWheel。 */

  // ============ 官方 ToolManager API 对齐（阶段 6） ============

  static WheelScroll = WheelModeScroll;
  static WheelZoom = WheelModeZoom;
  static WheelNone = WheelModeNone;
  static GestureZoom = GestureModeZoom;
  static GestureCancel = GestureModeCancel;
  static GestureNone = GestureModeNone;

  private _mouseWheelBehavior: any = WheelModeScroll;
  private _gestureBehavior: any = GestureModeZoom;
  private _dragSize: Size = new Size(2, 2);
  private _toolTipDuration: number = 5000;
  private _toolTipTimer: number = -1;
  private _currentToolTip: any = null;
  private _toolTipAdornment: Adornment | null = null;

  get mouseWheelBehavior(): any { return this._mouseWheelBehavior; }
  set mouseWheelBehavior(val: any) { this._mouseWheelBehavior = val; }

  get gestureBehavior(): any { return this._gestureBehavior; }
  set gestureBehavior(val: any) { this._gestureBehavior = val; }

  get toolTipDuration(): number { return this._toolTipDuration; }
  set toolTipDuration(val: number) { this._toolTipDuration = val; }

  get dragSize(): Size { return this._dragSize; }
  set dragSize(val: Size) { this._dragSize = new Size(val.width, val.height); }

  get currentToolTip(): any { return this._currentToolTip; }
  set currentToolTip(val: any) {
    this._currentToolTip = val;
    if (val !== null && val instanceof Adornment) {
      this._toolTipAdornment = val;
    } else {
      this._toolTipAdornment = null;
    }
  }

  initializeStandardTools(): this { return this; }

  findTool(name: string): Tool | null {
    if (typeof name !== 'string') throw new Error('ToolManager.findTool: name must be a string');
    let t = this._findToolIn(this._mouseDownTools, name);
    if (t) return t;
    t = this._findToolIn(this._mouseMoveTools, name);
    if (t) return t;
    return this._findToolIn(this._mouseUpTools, name);
  }

  private _findToolIn(list: List<Tool>, name: string): Tool | null {
    for (const tool of list) {
      if (tool.name === name) return tool;
    }
    return null;
  }

  replaceTool(name: string, newtool: Tool | null): Tool | null {
    if (typeof name !== 'string') throw new Error('ToolManager.replaceTool: name must be a string');
    if (newtool !== null) newtool.diagram = this.diagram;
    let old = this._replaceToolIn(this._mouseDownTools, name, newtool);
    if (old) return old;
    old = this._replaceToolIn(this._mouseMoveTools, name, newtool);
    if (old) return old;
    return this._replaceToolIn(this._mouseUpTools, name, newtool);
  }

  private _replaceToolIn(list: List<Tool>, name: string, newtool: Tool | null): Tool | null {
    for (let i = 0; i < list.count; i++) {
      const tool = list.elt(i);
      if (tool.name === name) {
        if (newtool === null) list.removeAt(i);
        else list.setElt(i, newtool);
        return tool;
      }
    }
    return null;
  }

  replaceStandardTool(name: string, newtool: Tool | null, list: List<Tool>): void {
    if (typeof name !== 'string') throw new Error('ToolManager.replaceStandardTool: name must be a string');
    if (newtool !== null) { newtool.name = name; newtool.diagram = this.diagram; }
    if (this.findTool(name)) this.replaceTool(name, newtool);
    else if (newtool !== null) list.push(newtool);
  }

  // ---- 工具提示（ToolTip） ----

  showToolTip(toolTip: any, obj?: GraphObject | null): void {
    const d = this.diagram;
    if (!d) return;
    const cur = this.currentToolTip;
    if (cur !== null && cur === toolTip) return;
    this.hideToolTip();
    if (toolTip instanceof Adornment) {
      if (obj) toolTip.adornedObject = obj;
      if (!toolTip.adornedPart) toolTip.adornedObject = d.findPartAt(d.lastInput.documentPoint as any);
      let part: any = obj ? obj.part : toolTip.adornedPart;
      if (part && !part.isTopLevel) part = part.containingGroup;
      if (part) toolTip.adornedObject = part;
      this._toolTipAdornment = toolTip;
    } else {
      const a = new Adornment();
      a.adornedObject = obj || null;
      const part2: any = obj ? obj.part : d.findPartAt(d.lastInput.documentPoint as any);
      if (part2) a.adornedObject = part2;
      this._toolTipAdornment = a;
      (a as any).add(toolTip);
      this.positionToolTip(a, obj);
      d.add(a);
    }
    this.positionToolTip(toolTip, obj);
    this.currentToolTip = toolTip;
    this.extendToolTip();
    if (toolTip instanceof Adornment) toolTip.visible = true;
    d.add(toolTip);
  }

  positionToolTip(toolTip: any, obj?: GraphObject | null): void {
    const d = this.diagram;
    if (!d) return;
    const lastInput = d.lastInput;
    const pos = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const vb = d.viewportBounds;
    const m = 8;
    if (obj) {
      const gdp: any = obj.getDocumentPoint;
      if (typeof gdp === 'function') {
        const tl: any = gdp.call(obj, Spot.TopLeft);
        const br: any = gdp.call(obj, Spot.BottomRight);
        if (tl && br) {
          const b = toolTip.measuredBounds || {};
          const x = tl.x > vb.x + vb.width / 2 ? tl.x - (b.width || 0) - m : br.x + m;
          const y = tl.y > vb.y + vb.height / 2 ? tl.y - (b.height || 0) - m : br.y + m;
          toolTip.position = new Point(x, y);
          return;
        }
      }
    }
    const b2 = toolTip.measuredBounds || {};
    const x2 = pos.x + vb.x + 2 > vb.right - (b2.width || 0) ? pos.x - (b2.width || 0) : pos.x + 2;
    const y2 = pos.y + vb.y + 2 > vb.bottom - (b2.height || 0) ? pos.y - (b2.height || 0) : pos.y + 2;
    toolTip.position = new Point(x2, y2);
  }

  extendToolTip(duration?: number): void {
    if (this._toolTipTimer >= 0) { clearTimeout(this._toolTipTimer); this._toolTipTimer = -1; }
    const ms = (typeof duration === 'number') ? duration : this._toolTipDuration;
    if (ms === Infinity || this._currentToolTip === null) return;
    this._toolTipTimer = window.setTimeout(() => {
      this.hideToolTip();
    }, ms);
  }

  hideToolTip(): void {
    if (this._toolTipAdornment === null) return;
    const ad = this._toolTipAdornment;
    const adornedPart = ad.adornedPart;
    const category = ad.category;
    this._toolTipAdornment = null;
    if (this._currentToolTip) { this._currentToolTip = null; }
    this._toolTipTimer = -1;
    const d = this.diagram;
    if (d && adornedPart) (adornedPart as any).removeAdornment(category);
    if (d) d.remove(ad);
  }

  doToolTip(): void {
    const d = this.diagram;
    if (!d) return;
    const input = d.lastInput;
    let targ: any = input.targetObject;
    if (targ === null) targ = d.findObjectAt(input.documentPoint as any);
    if (targ !== null && targ.toolTip) {
      this.showToolTip(targ.toolTip, targ);
    } else if (d.toolTip) {
      this.showToolTip(d.toolTip, null);
    }
  }

  doMouseHover(): void {
    const d = this.diagram;
    if (!d) return;
    const input = d.lastInput;
    if (input.targetObject === null) {
      input.targetObject = d.findObjectAt(input.documentPoint as any);
    }
    let e = input.targetObject as any;
    if (e !== null) {
      input.handled = false;
      while (e !== null) {
        const fn = this.isActive ? e.mouseHold : e.mouseHover;
        if (typeof fn === 'function') {
          fn(input, e);
          if (input.handled) break;
        }
        e = e.panel;
      }
    } else {
      const fn = this.isActive ? d.mouseHold : d.mouseHover;
      if (typeof fn === 'function') fn(input, d);
    }
  }
}
