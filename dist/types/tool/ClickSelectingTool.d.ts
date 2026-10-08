import { Tool } from './Tool';
export declare class ClickSelectingTool extends Tool {
    static readonly className: string;
    private _lastClickTime;
    private _lastClickObj;
    constructor();
    /**
     * 官方 ClickSelectingTool.canStart（go.js 逐字）：
     *   return !(!this.isEnabled || this.isBeyondDragSize())
     * 以前缺 isBeyondDragSize 判定；而 ClickSelectingTool 排在 mouseUpTools 末位，
     * 拖拽后本不该再触发点选。
     */
    canStart(): boolean;
    doMouseUp(): void;
    private _handleSingleClick;
    private _handleDoubleClick;
    private _handleContextClick;
    standardMouseSelect(): void;
}
