import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Adornment } from '../view/Adornment';

/**
 * ContextMenuTool - shows context menus on right-click.
 * Displays the context menu for the object under the mouse.
 */
export class ContextMenuTool extends Tool {
  static readonly className: string = "ContextMenuTool";

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

  /**
   * 官方 ContextMenuTool.canStart（go.js 逐字）：
   *   isBeyondDragSize() || !lastInput.right || clickCount > 1 → false
   *   否则看 touch 的 defaultTouchContextMenu 或 findObjectWithContextMenu()
   * 注意它排在 mouseUpTools 首位，所以右键菜单在 mouseup 才弹。
   */
  canStart(): boolean {
    const diagram = this.diagram;
    if (diagram === null || !this.isEnabled) return false;

    const lastInput = diagram.lastInput;
    if (this.isBeyondDragSize() || !lastInput.rightButton || lastInput.clickCount > 1) return false;
    if (lastInput.isTouchEvent && (this as any).defaultTouchContextMenu !== null) return true;
    return this.findObjectWithContextMenu() !== null;
  }

  /** 官方 ContextMenuTool.findObjectWithContextMenu —— 沿 panel 链找 contextMenu。 */
  findObjectWithContextMenu(): any | null {
    const diagram = this.diagram;
    if (!diagram) return null;
    const hit = diagram.findObjectAt(new Point(diagram.lastInput.documentPoint.x, diagram.lastInput.documentPoint.y));
    const s: any = (hit !== null && hit.layer && hit.layer.isTemporary) ? null : hit;
    if (s !== null) {
      let n: any = s;
      while (n !== null) {
        if (n.contextMenu !== null && n.contextMenu !== undefined) return n;
        n = n.panel;
      }
    }
    const dm: any = diagram.contextMenu;
    if (dm !== null && dm !== undefined) return diagram;
    return null;
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
