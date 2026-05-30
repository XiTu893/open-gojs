/**
 * HTMLInfo - provides custom HTML-based editing or display for tools.
 * Used by TextEditingTool and ContextMenuTool to integrate HTML elements.
 */
export declare class HTMLInfo {
    private _element;
    private _showFunction;
    private _hideFunction;
    private _valueFunction;
    constructor();
    get element(): HTMLElement | null;
    set element(val: HTMLElement | null);
    get showFunction(): ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null;
    set showFunction(val: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null);
    get hideFunction(): ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null;
    set hideFunction(val: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null);
    get valueFunction(): ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => string) | null;
    set valueFunction(val: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => string) | null);
}
