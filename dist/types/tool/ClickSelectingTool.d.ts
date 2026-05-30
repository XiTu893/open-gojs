import { Tool } from './Tool';
export declare class ClickSelectingTool extends Tool {
    private _lastClickTime;
    private _lastClickObj;
    constructor();
    canStart(): boolean;
    doMouseUp(): void;
    private _handleSingleClick;
    private _handleDoubleClick;
    private _handleContextClick;
    standardMouseSelect(): void;
}
