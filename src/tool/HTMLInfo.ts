/**
 * HTMLInfo - provides custom HTML-based editing or display for tools.
 * Used by TextEditingTool and ContextMenuTool to integrate HTML elements.
 */
export class HTMLInfo {

  private _element: HTMLElement | null = null;
  private _showFunction: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null = null;
  private _hideFunction: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null = null;
  private _valueFunction: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => string) | null = null;

  constructor() { }

  // ============ Properties ============

  get element(): HTMLElement | null { return this._element; }
  set element(val: HTMLElement | null) { this._element = val; }

  get showFunction(): ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null {
    return this._showFunction;
  }
  set showFunction(val: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null) {
    this._showFunction = val;
  }

  get hideFunction(): ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null {
    return this._hideFunction;
  }
  set hideFunction(val: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null) {
    this._hideFunction = val;
  }

  get valueFunction(): ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => string) | null {
    return this._valueFunction;
  }
  set valueFunction(val: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => string) | null) {
    this._valueFunction = val;
  }
}
