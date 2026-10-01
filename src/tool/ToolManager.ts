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
  private _currentTool: Tool | null = null;
  private _defaultTool: Tool;
  private _hoverDelay: number = 0;
  private _holdDelay: number = 0;
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

    // Default tool is ClickSelectingTool
    this._defaultTool = clickSelectingTool;
    this._currentTool = this._defaultTool;

    // Mouse-down tools (checked in order on mouse-down)
    this._mouseDownTools = new List<Tool>([
      actionTool,
      relinkingTool,
      linkReshapingTool,
      resizingTool,
      rotatingTool,
      linkingTool,
      draggingTool,
      dragSelectingTool,
      panningTool,
      contextMenuTool,
    ]);

    // Mouse-move tools (checked in order on mouse-move)
    this._mouseMoveTools = new List<Tool>([
      draggingTool,
      dragSelectingTool,
      linkingTool,
      relinkingTool,
      linkReshapingTool,
      resizingTool,
      rotatingTool,
      panningTool,
    ]);

    // Mouse-up tools (checked in order on mouse-up)
    // 顺序对齐官方 go.d.ts:5159：ContextMenuTool / TextEditingTool /
    // ClickCreatingTool / ClickSelectingTool。
    // 以前 TextEditingTool 根本不在任何一张表里（`toolManager.textEditingTool`
    // 拿到 undefined，实测 audioEditor 崩），而 ClickSelectingTool 排在最前，
    // 它 canStart() 恒为 true，会把 ClickCreatingTool 完全挡住。
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

  get currentTool(): Tool | null { return this._currentTool; }
  set currentTool(val: Tool | null) {
    if (this._currentTool && this._currentTool.isActive) {
      this._currentTool.doDeactivate();
    }
    this._currentTool = val;
    if (val) {
      val.toolManager = this;
      val.diagram = this.diagram;
      val.doStart();
    }
  }

  get defaultTool(): Tool { return this._defaultTool; }
  set defaultTool(val: Tool) {
    this._defaultTool = val;
    if (val) {
      val.diagram = this.diagram;
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
    if (this._defaultTool) { this._defaultTool.diagram = val; }
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

  /** Dispatch mouse-down event to the appropriate tool. */
  doMouseDown(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).isEnabled) return;
    this._syncTools();

    // Save the previous input
    this._previousInput = this._lastInput.copy();

    // Store the mouse-down point
    this._mouseDownPoint = new Point(this._lastInput.documentPoint.x, this._lastInput.documentPoint.y);

    // If there is a current active tool, let it handle the event
    if (this._currentTool && this._currentTool.isActive) {
      this._currentTool.doMouseDown();
      return;
    }

    // Try each mouse-down tool in order
    for (const tool of this._mouseDownTools) {
      if (!tool.isEnabled) continue;
      if (tool.canStart()) {
        this.currentTool = tool;
        tool.doActivate();
        tool.doMouseDown();
        return;
      }
    }

    // No tool could start - use default tool
    this.currentTool = this._defaultTool;
    if (this._currentTool) {
      this._currentTool.doMouseDown();
    }
  }

  /** Dispatch mouse-move event to the current tool. */
  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).isEnabled) return;

    this._previousInput = this._lastInput.copy();

    if (this._currentTool) {
      this._currentTool.doMouseMove();
    }
  }

  /** Dispatch mouse-up event to the current tool. */
  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).isEnabled) return;
    this._syncTools();

    this._previousInput = this._lastInput.copy();

    // If there is a current active tool, let it handle the event
    if (this._currentTool && this._currentTool.isActive) {
      this._currentTool.doMouseUp();
      return;
    }

    // Try each mouse-up tool in order
    for (const tool of this._mouseUpTools) {
      if (!tool.isEnabled) continue;
      if (tool.canStart()) {
        this.currentTool = tool;
        tool.doActivate();
        tool.doMouseUp();
        return;
      }
    }

    // No tool could start - use default tool
    this.currentTool = this._defaultTool;
    if (this._currentTool) {
      this._currentTool.doMouseUp();
    }
  }

  /** Dispatch key-down event to the current tool. */
  doKeyDown(): void {
    if (this._currentTool) {
      this._currentTool.doKeyDown();
    }
  }

  /** Dispatch key-up event to the current tool. */
  doKeyUp(): void {
    if (this._currentTool) {
      this._currentTool.doKeyUp();
    }
  }

  /** Dispatch mouse-wheel event to the current tool. */
  doMouseWheel(): void {
    if (this._currentTool && this._currentTool.isActive) {
      this._currentTool.doMouseWheel();
    } else {
      this.standardMouseWheel();
    }
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

  /** Standard mouse wheel: zoom in/out centered on mouse position. */
  standardMouseWheel(): void {
    const diagram = this.diagram;
    if (!diagram || !(diagram as any).allowZoom) return;

    const e = this._lastInput;
    if (!e || !e.nativeEvent) return;

    const wheelEvent = e.nativeEvent as WheelEvent;
    const delta = wheelEvent.deltaMode === 1 ? wheelEvent.deltaY * 40 : wheelEvent.deltaY;

    if (wheelEvent.ctrlKey || Math.abs(delta) < 40) {
      const oldScale = diagram.scale;
      const factor = delta > 0 ? 0.9 : 1.1;
      let newScale = oldScale * factor;
      newScale = Math.max(diagram.minScale, Math.min(diagram.maxScale, newScale));

      const viewPoint = new Point(e.viewPoint.x, e.viewPoint.y);
      const padding = diagram.padding;
      const mouseDocX = (viewPoint.x - padding.left) / oldScale + diagram.position.x;
      const mouseDocY = (viewPoint.y - padding.top) / oldScale + diagram.position.y;

      diagram.scale = newScale;
      diagram.position = new Point(
        mouseDocX - (viewPoint.x - padding.left) / newScale,
        mouseDocY - (viewPoint.y - padding.top) / newScale
      );
    } else {
      const scrollX = wheelEvent.shiftKey ? delta : 0;
      const scrollY = wheelEvent.shiftKey ? 0 : delta;
      if ((diagram as any).allowHorizontalScroll || (diagram as any).allowVerticalScroll) {
        const pos = diagram.position;
        diagram.position = new Point(
          pos.x + scrollX / diagram.scale,
          pos.y + scrollY / diagram.scale
        );
      }
    }
  }

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
