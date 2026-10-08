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

  /** 官方 Tool.canStartButton —— 当前输入是否为主键（左键）按下。 */
  canStartButton(): boolean {
    const d = this.diagram;
    if (!d) return false;
    return d.lastInput.left;
  }

  /** Called when this tool becomes the current tool. */
  doActivate(): void {
    this._isActive = true;
  }

  /** Cancel the tool's operation. */
  doCancel(): void {
    this.transactionResult = null;
    this.stopTool();
  }

  /** Called when this tool is no longer the current tool. */
  doDeactivate(): void {
    this._isActive = false;
  }

  /** Handle key-down events. 官方：Escape → doCancel。 */
  doKeyDown(): void {
    const d = this.diagram;
    if (d && d.lastInput.key === 'Escape') this.doCancel();
  }

  /** Handle key-up events. */
  doKeyUp(): void { }

  /** Handle mouse-down events. */
  doMouseDown(): void {
    if (!this.isActive && this.canStart()) this.doActivate();
  }

  /** Handle mouse-move events. */
  doMouseMove(): void { }

  /** Handle mouse-up events. */
  doMouseUp(): void {
    this.stopTool();
  }

  /** Handle mouse-wheel events. */
  doMouseWheel(): void { }

  /** Called when this tool first starts. */
  doStart(): void { }

  /** Called when this tool stops. */
  doStop(): void { }

  /** Whether multi-touch gestures can start this tool. */
  canStartMultiTouch(): boolean {
    return false;
  }

  /**
   * 官方 `Tool.findToolHandleAt(point, category)`：
   * 取指下最上层对象，沿 `panel` 链走到"其 panel 是 Adornment"的对象（即句柄本身），
   * 该 Adornment 的 category 必须等于给定 category（缺省用 `this.name`）。
   * Adornment 层在本项目里是 temporary，`findPartAt` 会跳过，所以直接遍历该层做同样的判定。
   */
  findToolHandleAt(p: Point, category?: string): any | null {
    const diagram = this._diagram;
    if (!diagram) return null;

    const adornmentLayer = (diagram as any).findLayer('Adornment');
    if (!adornmentLayer) return null;

    const cat = category !== undefined ? category : this._name;
    const partsArray = iteratorToArray<any>(adornmentLayer.parts);
    for (let i = partsArray.length - 1; i >= 0; i--) {
      const ad: Adornment = partsArray[i];
      if (!ad.visible) continue;
      const found = this._findHandleInPanel(ad, p);
      if (found !== null) return (ad as any).category === cat ? found : null;
    }
    return null;
  }

  /** 文档坐标命中测试：自上而下找最顶层元素（官方 Layer/Panel.findObjectAt 的遍历序） */
  private _findHandleInPanel(panel: any, p: Point): GraphObject | null {
    const elements = panel._elements;
    if (!elements) return null;
    for (let i = elements.length - 1; i >= 0; i--) {
      const elem = elements[i];
      if (!elem.visible) continue;
      const bounds = elem.getDocumentBounds ? elem.getDocumentBounds() : elem.actualBounds;
      if (bounds && bounds.containsPoint(p)) {
        if ((elem as any)._elements && (elem as any)._elements.length > 0) {
          const inner = this._findHandleInPanel(elem, p);
          if (inner) return inner;
        }
        return elem;
      }
    }
    return null;
  }

  /**
   * 官方 Tool.isBeyondDragSize(first?, second?)
   * 默认比较 firstInput/lastInput 的 **viewPoint**，阈值取
   * `toolManager.dragSize`（默认 2×2），触摸输入额外放宽 6。
   */
  isBeyondDragSize(first?: Point, second?: Point): boolean {
    const d = this.diagram;
    if (!d) return false;
    const f = first !== undefined ? first : d.firstInput.viewPoint;
    const s = second !== undefined ? second : d.lastInput.viewPoint;
    const ds = this.toolManager ? this.toolManager.dragSize : null;
    let w = ds ? ds.width : 2;
    let h = ds ? ds.height : 2;
    if (d.firstInput.isTouchEvent) { w += 6; h += 6; }
    return Math.abs(s.x - f.x) > w || Math.abs(s.y - f.y) > h;
  }

  /** Standard mouse click behavior: select and raise click event. */
  standardMouseClick(): void { }

  /**
   * 官方 Tool.standardMouseSelect（逐字对齐 go.js）：
   * - !allowSelect → 直接返回
   * - ctrl/meta → 切换选中；shift → 追加选中；否则 → 选中（已选中则不动作）
   * - 指下无部件时，仅在"主键且无修饰键"时 clearSelection
   */
  standardMouseSelect(): void {
    const t = this.diagram;
    if (!t || !t.allowSelect) return;
    const i = t.lastInput;
    const e = t.findPartAt(i.documentPoint as any, false);
    if (e !== null) {
      if (i.meta || i.control) {
        t.raiseDiagramEvent('ChangingSelection', t.selection);
        let s: any = e;
        for (; s !== null && !s.canSelect(); ) s = s.containingGroup;
        if (s !== null) s.isSelected = !s.isSelected;
        t.raiseDiagramEvent('ChangedSelection', t.selection);
      } else if (i.shift) {
        if (!e.isSelected) {
          t.raiseDiagramEvent('ChangingSelection', t.selection);
          let s: any = e;
          for (; s !== null && !s.canSelect(); ) s = s.containingGroup;
          if (s !== null) s.isSelected = true;
          t.raiseDiagramEvent('ChangedSelection', t.selection);
        }
      } else if (!e.isSelected) {
        let s: any = e;
        for (; s !== null && !s.canSelect(); ) s = s.containingGroup;
        if (s !== null) t.select(s);
      }
    } else if (this.canStartButton() && !(i.meta || i.control) && !i.shift) {
      t.clearSelection();
    }
  }

  /** Standard mouse wheel behavior: zoom in/out. */
  standardMouseWheel(): void { }

  /** Standard pinch zoom start for multi-touch. */
  standardPinchZoomStart(): void { }

  /** Standard pinch zoom move for multi-touch. */
  standardPinchZoomMove(): void { }

  // ---- 官方 Tool.standardWaitAfter / cancelWaitAfter / doWaitAfter ----

  private _waitTimer: any = -1;

  standardWaitAfter(delay: number, input?: any): void {
    if (typeof delay !== 'number') return;
    this.cancelWaitAfter();
    const d = this.diagram;
    if (!d) return;
    const src = input !== undefined && input !== null ? input : d.lastInput;
    const saved = src.copy();
    const self = this;
    this._waitTimer = setTimeout(() => {
      self._waitTimer = -1;
      self.doWaitAfter(saved);
    }, delay);
  }

  cancelWaitAfter(): void {
    if (this._waitTimer !== -1 && this._waitTimer !== null) {
      clearTimeout(this._waitTimer);
      this._waitTimer = -1;
    }
  }

  doWaitAfter(_t?: any): void { }

  // ============ Transaction Methods ============

  /** Start a new transaction. 官方会先把 transactionResult 置空。 */
  startTransaction(tname?: string): boolean {
    const d = this.diagram;
    this._transactionResult = null;
    if (d) {
      return d.startTransaction(tname !== undefined && tname !== null ? tname : this._name);
    }
    return false;
  }

  /** Stop this tool and return to the default current tool. */
  stopTool(): void {
    // 官方 Tool.stopTool: `t.currentTool===this && (t.currentTool=null, t.currentCursor="")`
    const d = this.diagram;
    if (!d) return;
    if (d.currentTool !== this) return;
    d.currentTool = null;
    d.currentCursor = '';
  }

  /** 官方 Tool.stopTransaction —— 有 transactionResult 就 commit，否则 rollback。 */
  stopTransaction(): boolean {
    const d = this.diagram;
    if (d) {
      const result = this._transactionResult;
      if (result !== null) {
        return d.commitTransaction(result);
      } else {
        return d.rollbackTransaction();
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

      // 沿 panel 链向上找第一个带 cursor 的对象；找不到则回落到默认光标
      let cur = targ;
      while (cur && (cur.cursor === '' || cur.cursor === undefined || cur.cursor === null)) { cur = cur.panel; }
      d.currentCursor = (cur && cur.cursor) ? cur.cursor : '';

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
