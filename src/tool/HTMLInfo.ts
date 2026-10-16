/**
 * HTMLInfo - provides custom HTML-based editing or display for tools.
 * Used by TextEditingTool and ContextMenuTool to integrate HTML elements.
 * 官方 `HTMLInfo`（go-debug 逐字对齐）：
 *   constructor(t) { ...; t && Object.assign(this, t) } —— `{show, hide}` 直接落到 setter；
 *   属性名是 **show/hide/mainElement/valueFunction**（不是 showFunction/hideFunction）。
 *   回调签名：show(obj, diagram, tool)、hide(diagram, tool)。
 * 样例 customContextMenu `new go.HTMLInfo({show, hide})`、vendingPlanogram
 * `customEditor.show = (textBlock, diagram, tool) => ...` 都走这套名字。
 */
export class HTMLInfo {
  static readonly className: string = "HTMLInfo";

  private _show: ((...args: any[]) => void) | null = null;
  private _hide: ((...args: any[]) => void) | null = null;
  private _mainElement: HTMLElement | null = null;
  private _valueFunction: (() => string) | null = null;

  constructor(init?: Partial<HTMLInfo>) {
    if (init) {
      // 官方 `Object.assign(this, t)`：经 setter 赋值，同时允许样例挂任意扩展字段
      // （vendingPlanogram 的 `customEditor._textBlockName = ...`）。
      Object.assign(this, init);
    }
  }

  // ============ Properties ============

  /** 官方 HTMLInfo.show —— show(obj, diagram, tool) */
  get show(): ((...args: any[]) => void) | null {
    return this._show;
  }
  set show(val: ((...args: any[]) => void) | null) {
    this._show = val;
  }

  /** 官方 HTMLInfo.hide —— hide(diagram, tool) */
  get hide(): ((...args: any[]) => void) | null {
    return this._hide;
  }
  set hide(val: ((...args: any[]) => void) | null) {
    this._hide = val;
  }

  /** 官方 HTMLInfo.mainElement：无 show/hide 回调时兜底显示/隐藏的元素 */
  get mainElement(): HTMLElement | null {
    return this._mainElement;
  }
  set mainElement(val: HTMLElement | null) {
    this._mainElement = val;
  }

  /** 官方 HTMLInfo.valueFunction：取编辑框当前值 */
  get valueFunction(): (() => string) | null {
    return this._valueFunction;
  }
  set valueFunction(val: (() => string) | null) {
    this._valueFunction = val;
  }

  // ---- 兼容别名（早先实现的名字，保留避免外部代码断裂） ----
  get showFunction(): ((...args: any[]) => void) | null { return this._show; }
  set showFunction(val: ((...args: any[]) => void) | null) { this._show = val; }
  get hideFunction(): ((...args: any[]) => void) | null { return this._hide; }
  set hideFunction(val: ((...args: any[]) => void) | null) { this._hide = val; }
  get element(): HTMLElement | null { return this._mainElement; }
  set element(val: HTMLElement | null) { this._mainElement = val; }
}
