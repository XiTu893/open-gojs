import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Adornment } from '../view/Adornment';

/**
 * ContextMenuTool - shows context menus on right-click.
 * Displays the context menu for the object under the mouse.
 */
export class ContextMenuTool extends Tool {

  private _currentContextMenu: Adornment | null = null;
  private _mouseDownPoint: Point | null = null;

  constructor() {
    super();
    this.name = 'ContextMenu';
  }

  // ============ Properties ============

  get currentContextMenu(): Adornment | null { return this._currentContextMenu; }
  set currentContextMenu(val: Adornment | null) { this._currentContextMenu = val; }

  // ============ Methods ============

  /** Can start if the user right-clicks. */
  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return false;

    return lastInput.isContextMenu || lastInput.button === 2;
  }

  /** Show the context menu on mouse up (right-click). */
  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const obj = diagram.findObjectAt(point);

    // Look for contextMenu on the part or object
    let menu: any = null;
    if (obj) {
      const part = (obj as any).part;
      if (part && (part as any).contextMenu) {
        menu = (part as any).contextMenu;
      }
    }

    // Look for diagram-level context menu
    if (!menu && (diagram as any).contextMenu) {
      menu = (diagram as any).contextMenu;
    }

    if (menu) {
      this.showContextMenu(menu, point);
    }

    this.stopTool();
  }

  /** Show the context menu at the given position. */
  showContextMenu(menu: any, point: Point): void {
    this._currentContextMenu = menu;

    if (menu instanceof Adornment) {
      menu.location = point;
      const diagram = this.diagram;
      if (diagram) {
        diagram.add(menu);
      }
    }

    // If menu has a showFunction (HTMLInfo), call it
    if (menu && typeof menu.showFunction === 'function') {
      menu.showFunction(menu, this, point);
    }
  }

  /** Hide the current context menu. */
  hideContextMenu(): void {
    if (this._currentContextMenu) {
      const diagram = this.diagram;
      if (diagram) {
        diagram.remove(this._currentContextMenu);
      }
      this._currentContextMenu = null;
    }
  }
}
