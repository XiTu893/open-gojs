import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Adornment } from '../view/Adornment';
/**
 * ContextMenuTool - shows context menus on right-click.
 * Displays the context menu for the object under the mouse.
 */
export declare class ContextMenuTool extends Tool {
    static readonly className: string;
    private _currentContextMenu;
    private _mouseDownPoint;
    constructor();
    get currentContextMenu(): Adornment | null;
    set currentContextMenu(val: Adornment | null);
    /**
     * 官方 ContextMenuTool.canStart（go.js 逐字）：
     *   isBeyondDragSize() || !lastInput.right || clickCount > 1 → false
     *   否则看 touch 的 defaultTouchContextMenu 或 findObjectWithContextMenu()
     * 注意它排在 mouseUpTools 首位，所以右键菜单在 mouseup 才弹。
     */
    canStart(): boolean;
    /** 官方 ContextMenuTool.findObjectWithContextMenu —— 沿 panel 链找 contextMenu。 */
    findObjectWithContextMenu(): any | null;
    /** Show the context menu on mouse up (right-click). */
    doMouseUp(): void;
    /** Show the context menu at the given position. */
    showContextMenu(menu: any, point: Point): void;
    /** Hide the current context menu. */
    hideContextMenu(): void;
}
