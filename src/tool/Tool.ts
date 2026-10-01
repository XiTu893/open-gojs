import { Diagram } from '../diagram/Diagram';
import { InputEvent } from '../diagram/InputEvent';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { iteratorToArray } from '../core/Iterable';
import type { GraphObject } from '../view/GraphObject';
import type { Adornment } from '../view/Adornment';
import type { ToolManager } from './ToolManager';

/**
 * Tool - base class for all interactive tools in the diagram.
 * Provides virtual methods for mouse/keyboard/touch event handling,
 * transaction management, and standard interaction patterns.
 */
export class Tool {
  static readonly className: string = "Tool";

  protected _diagram: Diagram | null = null;
  protected _isActive: boolean = false;
  private _isEnabled: boolean = true;
  private _name: string = '';
  private _transactionResult: string | null = null;
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
  private _toolManager: ToolManager | null = null;

  constructor() { }

  // ============ Properties ============

  get diagram(): Diagram | null {
    if (this._diagram !== null) return this._diagram;
    const tm = this._toolManager;
    return tm ? tm.diagram : null;
  }
  set diagram(val: Diagram | null) { this._diagram = val; }

  get toolManager(): ToolManager | null { return this._toolManager; }
  set toolManager(val: ToolManager | null) { this._toolManager = val; }

  get isActive(): boolean { return this._isActive; }
  set isActive(val: boolean) { this._isActive = val; }

  get isEnabled(): boolean { return this._isEnabled; }
  set isEnabled(val: boolean) { this._isEnabled = val; }

  get name(): string { return this._name; }
  set name(val: string) { this._name = val; }

  get transactionResult(): string | null { return this._transactionResult; }
  set transactionResult(val: string | null) { this._transactionResult = val; }

  // ============ Virtual Methods ============

  /** Whether this tool can start operating at the current input event. */
  canStart(): boolean {
    return false;
  }

  /** Called when this tool becomes the current tool. */
  doActivate(): void { }

  /** Cancel the tool's operation. */
  doCancel(): void {
    this.doDeactivate();
  }

  /** Called when this tool is no longer the current tool. */
  doDeactivate(): void {
    this._isActive = false;
  }

  /** Handle key-down events. */
  doKeyDown(): void { }

  /** Handle key-up events. */
  doKeyUp(): void { }

  /** Handle mouse-down events. */
  doMouseDown(): void { }

  /** Handle mouse-move events. */
  doMouseMove(): void { }

  /** Handle mouse-up events. */
  doMouseUp(): void { }

  /** Handle mouse-wheel events. */
  doMouseWheel(): void { }

  /** Called when this tool first starts. */
  doStart(): void { }

  /** Called when this tool stops. */
  doStop(): void { }

  /** Wait after a period of inactivity (e.g. for hover). */
  doWaitAfter(): void { }

  /** Whether multi-touch gestures can start this tool. */
  canStartMultiTouch(): boolean {
    return false;
  }

  /** Cancel any pending wait-after timer. */
  cancelWaitAfter(): void { }

  /** Find a tool handle at the given document point. */
  findToolHandleAt(p: Point): any | null {
    const diagram = this._diagram;
    if (!diagram) return null;

    const adornmentLayer = (diagram as any).findLayer('Adornment');
    if (!adornmentLayer) return null;

    const toolName = this._name;
    const partsIt = adornmentLayer.parts;
    const partsArray = iteratorToArray<any>(partsIt);
    for (let i = partsArray.length - 1; i >= 0; i--) {
      const ad: Adornment = partsArray[i];
      if (!ad.visible) continue;
      const cat = (ad as any).category;
      if (cat && cat !== toolName) continue;

      const adornedPart = ad.adornedPart;
      if (!adornedPart) continue;

      const adornedBounds = adornedPart.getDocumentBounds();
      const localX = p.x - adornedBounds.x;
      const localY = p.y - adornedBounds.y;

      const found = this._findHandleInPanel(ad, localX, localY);
      if (found) return found;
    }
    return null;
  }

  private _findHandleInPanel(panel: any, x: number, y: number): GraphObject | null {
    const elements = panel._elements;
    if (!elements) return null;
    for (let i = elements.length - 1; i >= 0; i--) {
      const elem = elements[i];
      if (!elem.visible) continue;
      const bounds = elem.actualBounds;
      if (bounds.containsPoint(new Point(x, y))) {
        if ((elem as any)._elements && (elem as any)._elements.length > 0) {
          const inner = this._findHandleInPanel(elem, x - bounds.x, y - bounds.y);
          if (inner) return inner;
        }
        return elem;
      }
    }
    return null;
  }

  /** Whether the distance between two points exceeds the drag threshold. */
  isBeyondDragSize(first: Point, second: Point): boolean {
    const dx = Math.abs(first.x - second.x);
    const dy = Math.abs(first.y - second.y);
    return dx > 2 || dy > 2;
  }

  /** Standard mouse click behavior: select and raise click event. */
  standardMouseClick(): void { }

  /** Standard mouse select behavior: select parts on click. */
  standardMouseSelect(): void { }

  /** Standard mouse wheel behavior: zoom in/out. */
  standardMouseWheel(): void { }

  /** Standard pinch zoom start for multi-touch. */
  standardPinchZoomStart(): void { }

  /** Standard pinch zoom move for multi-touch. */
  standardPinchZoomMove(): void { }

  /** Standard wait-after behavior: schedule a timer. */
  standardWaitAfter(delay: number): void { }

  // ============ Transaction Methods ============

  /** Start a new transaction. */
  startTransaction(tname?: string): boolean {
    if (this._diagram) {
      return this._diagram.startTransaction(tname || this._name);
    }
    return false;
  }

  /** Stop this tool and remove it from the ToolManager. */
  stopTool(): void {
    this.doStop();
    if (this._diagram) {
      const tm = (this._diagram as any).toolManager;
      if (tm) {
        tm.currentTool = tm.defaultTool;
      }
    }
  }

  /** Stop the current transaction. */
  stopTransaction(): boolean {
    if (this._diagram) {
      const result = this._transactionResult;
      if (result !== null) {
        return this._diagram.commitTransaction(this._name);
      } else {
        return this._diagram.rollbackTransaction();
      }
    }
    return false;
  }

  /** Update adornments for relevant parts. */
  updateAdornments(part: any): void { }

  // ============ 官方 Tool API 对齐（阶段 6） ============

  /** 上一次鼠标悬停的对象（用于 mouseEnter/mouseLeave/mouseOver 追踪）。 */
  private _overObject: GraphObject | null = null;

  toString(): string {
    if (this.name !== '') return this.name + ' Tool';
    const ctor = this.constructor as any;
    if (ctor && typeof ctor.className === 'string') return ctor.className + ' Tool';
    const n = this.constructor && (this.constructor as any).name;
    return (typeof n === 'string' && n.length > 0) ? n : 'Tool';
  }

  /**
   * 官方 Tool.canStartButton
   * 当前工具是否可因主键（左键）按下而启动。
   * 官方使用 lastInput.left；本项目 InputEvent 提供 leftButton。
   */
  canStartButton(): boolean {
    const d = this.diagram;
    if (!d) return false;
    return d.lastInput.leftButton;
  }

  /** 官方 Tool.doUpdateCursor —— 将图表面板光标重置为空。 */
  doUpdateCursor(t: any): void {
    const d = this.diagram;
    if (d) d.currentCursor = '';
  }

  /**
   * 官方 Tool.doWheelChange
   * 若滚轮位置改变（或存在水平滚轮偏移），则标记事件不再继续向外传播。
   * 注：本项目未接入该调用，属于 API 对齐的惰性实现。
   */
  doWheelChange(oldPoint: Point, newPoint: Point, input: InputEvent): void {
    if (!oldPoint.equals(newPoint)) {
      input.bubbles = false;
      return;
    }
    const ne = input.nativeEvent as WheelEvent | null;
    if (ne !== null && typeof (ne as any).wheelDeltaX === 'number' && (ne as any).wheelDeltaX !== 0) {
      input.bubbles = false;
    }
  }

  /**
   * 官方 Tool.standardMouseOver
   * 标准鼠标悬停处理：计算目标对象，派发 mouseLeave/mouseEnter/mouseOver，
   * 并设置 currentCursor。本项目未接入调用，属于 API 对齐的惰性实现。
   */
  standardMouseOver(): void {
    const d = this.diagram;
    if (!d) return;
    const input = d.lastInput;
    const am: any = d.animationManager;
    if (am && typeof am.isProcessing === 'boolean' && am.isProcessing === true) return;

    const savesSkips = d.skipsUndoManager;
    d.skipsUndoManager = true;
    try {
      const dp = new Point(input.documentPoint.x, input.documentPoint.y);
      let targ: GraphObject | null =
        d.viewportBounds.containsPoint(dp) ? d.findObjectAt(dp) : null;
      input.targetObject = targ;

      // 沿 panel 链向上找第一个带 cursor 的对象
      while (targ && !targ.cursor) { targ = targ.panel; }
      if (targ) d.currentCursor = targ.cursor;

      const evType = input.nativeEvent ? input.nativeEvent.type : '';
      const isOver = evType === 'mouseover';
      const isMove = evType === 'mousemove';
      if (!isOver && !isMove) return;

      const prevObj = this._overObject;
      const newObj = input.targetObject as GraphObject | null;

      // mouseLeave：离开旧对象
      if (prevObj && prevObj !== newObj && prevObj.mouseLeave) {
        prevObj.mouseLeave(input, prevObj);
      }
      // mouseEnter / mouseOver：进入新对象
      if (newObj) {
        if (newObj !== prevObj && newObj.mouseEnter) newObj.mouseEnter(input, newObj);
        if (newObj.mouseOver) newObj.mouseOver(input, newObj);
      }
      // 无具体对象时派发 Diagram 级别的 mouseOver
      if (!newObj && d.mouseOver) d.mouseOver(input, d);

      this._overObject = newObj;
    } finally {
      d.skipsUndoManager = savesSkips;
    }
  }
}
