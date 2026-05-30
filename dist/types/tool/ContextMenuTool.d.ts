import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Adornment } from '../view/Adornment';
/**
 * ContextMenuTool - shows context menus on right-click.
 * Displays the context menu for the object under the mouse.
 */
export declare class ContextMenuTool extends Tool {
    private _currentContextMenu;
    private _mouseDownPoint;
    constructor();
    get currentContextMenu(): Adornment | null;
    set currentContextMenu(val: Adornment | null);
    /** Can start if the user right-clicks. */
    canStart(): boolean;
    /** Show the context menu on mouse up (right-click). */
    doMouseUp(): void;
    /** Show the context menu at the given position. */
    showContextMenu(menu: any, point: Point): void;
    /** Hide the current context menu. */
    hideContextMenu(): void;
}
