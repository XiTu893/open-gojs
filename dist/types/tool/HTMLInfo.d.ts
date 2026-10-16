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
export declare class HTMLInfo {
    static readonly className: string;
    private _show;
    private _hide;
    private _mainElement;
    private _valueFunction;
    constructor(init?: Partial<HTMLInfo>);
    /** 官方 HTMLInfo.show —— show(obj, diagram, tool) */
    get show(): ((...args: any[]) => void) | null;
    set show(val: ((...args: any[]) => void) | null);
    /** 官方 HTMLInfo.hide —— hide(diagram, tool) */
    get hide(): ((...args: any[]) => void) | null;
    set hide(val: ((...args: any[]) => void) | null);
    /** 官方 HTMLInfo.mainElement：无 show/hide 回调时兜底显示/隐藏的元素 */
    get mainElement(): HTMLElement | null;
    set mainElement(val: HTMLElement | null);
    /** 官方 HTMLInfo.valueFunction：取编辑框当前值 */
    get valueFunction(): (() => string) | null;
    set valueFunction(val: (() => string) | null);
    get showFunction(): ((...args: any[]) => void) | null;
    set showFunction(val: ((...args: any[]) => void) | null);
    get hideFunction(): ((...args: any[]) => void) | null;
    set hideFunction(val: ((...args: any[]) => void) | null);
    get element(): HTMLElement | null;
    set element(val: HTMLElement | null);
}
