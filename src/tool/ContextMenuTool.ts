import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Adornment } from '../view/Adornment';
import { GraphObject } from '../view/GraphObject';
import { HTMLInfo } from './HTMLInfo';

/**
 * ContextMenuTool - shows context menus on right-click.
 * 官方 `ContextMenuTool`（go-debug 逐字复刻，customContextMenu 调试对齐）：
 *   canStart → doStart(mouseDownPoint) → doMouseUp→doContextClick → openMenu
 *   → showContextMenu(Adornment 摆位 / HTMLInfo.show(obj, diagram, tool))
 *   → 保持 isActive（不 stopTool），第二次点击经 maybeStopTool 关闭。
 * 早先实现的三个致命偏差：
 *   1. HTMLInfo 调的是 `menu.showFunction(...)`——官方 HTMLInfo 属性叫 `show`，
 *      且参数顺序 (obj, diagram, tool)，样例的 show 因此从不执行（菜单不显示）；
 *   2. doMouseUp 无条件 stopTool()——官方打开菜单后保持 currentTool=ContextMenu，
 *      关闭走 doStop→hideContextMenu；
 *   3. 缺 currentObject/mouseDownPoint 公开面（样例 paste 读 mouseDownPoint）。
 */
export class ContextMenuTool extends Tool {
  static readonly className: string = "ContextMenuTool";

  private _currentContextMenu: any = null; // Adornment | HTMLInfo
  private _currentObject: GraphObject | null = null;
  private _mouseDownPoint: Point = new Point(NaN, NaN);
  /** 官方 `o0`：openMenu 重入护栏（show 回调里再触发点击时防嵌套） */
  private _inOpen: boolean = false;
  /** 官方 defaultTouchContextMenu */
  private _defaultTouchContextMenu: any = null;

  constructor() {
    super();
    this.name = 'ContextMenu';
  }

  // ============ Properties ============

  get currentContextMenu(): any { return this._currentContextMenu; }
  set currentContextMenu(val: any) { this._currentContextMenu = val; }

  /** 官方 ContextMenuTool.currentObject：右键命中的 GraphObject（HTMLInfo show 的 obj 参数） */
  get currentObject(): GraphObject | null { return this._currentObject; }
  set currentObject(val: GraphObject | null) { this._currentObject = val; }

  /** 官方 ContextMenuTool.mouseDownPoint（customContextMenu 的 paste 用它定位粘贴） */
  get mouseDownPoint(): Point { return this._mouseDownPoint; }

  get defaultTouchContextMenu(): any { return this._defaultTouchContextMenu; }
  set defaultTouchContextMenu(val: any) { this._defaultTouchContextMenu = val; }

  // ============ 官方生命周期 ============

  /**
   * 官方 ContextMenuTool.canStart（go.js 逐字）：
   *   isBeyondDragSize() || !lastInput.right || clickCount > 1 → false
   *   否则 touch 的 defaultTouchContextMenu 或 findObjectWithContextMenu()。
   */
  canStart(): boolean {
    const diagram = this.diagram;
    if (diagram === null || !this.isEnabled) return false;

    const lastInput = diagram.lastInput;
    if (this.isBeyondDragSize() || !lastInput.right || lastInput.clickCount > 1) return false;
    if (lastInput.isTouchEvent && this._defaultTouchContextMenu !== null) return true;
    return this.findObjectWithContextMenu() !== null;
  }

  /** 官方 doStart：记录 firstInput 文档点 */
  doStart(): void {
    const diagram = this.diagram;
    if (diagram) this._mouseDownPoint = new Point(diagram.firstInput.documentPoint.x, diagram.firstInput.documentPoint.y);
  }

  /** 官方 doStop：关菜单、清 currentObject/重入位 */
  doStop(): void {
    this.hideContextMenu();
    this._currentObject = null;
    this._inOpen = false;
  }

  /**
   * 官方 ContextMenuTool.doActivate(){} —— **故意空实现**：
   * 不把 isActive 置 true（基类 doActivate 会），isActive 只在 openMenu 里
   * 手动置位。调 super 会破坏 doContextClick 的 !isActive 分支（启动即激活
   * → 永远进 else → currentContextMenu===null → return，菜单永远开不了）。
   */
  doActivate(): void { }

  /**
   * 官方 ContextMenuTool.findObjectWithContextMenu(obj?)：
   * 沿 panel 链找 contextMenu；命中空时回落 diagram.contextMenu。
   */
  findObjectWithContextMenu(obj?: any): any | null {
    const diagram = this.diagram;
    if (diagram === null) return null;
    const input = diagram.lastInput;

    let hit: any = null;
    if (obj instanceof GraphObject) {
      hit = obj;
    } else if (obj !== null && obj !== undefined && obj.toolManager && obj.div !== undefined) {
      // 官方 `t instanceof Diagram`（避免 import Diagram 形成环，用鸭子类型判）
      hit = obj;
    } else {
      hit = diagram.findObjectAt(
        new Point(input.documentPoint.x, input.documentPoint.y),
        (n: any) => !(n.layer && n.layer.isTemporary)
      );
    }

    if (hit !== null) {
      let n: any = hit;
      while (n !== null) {
        if (n.contextMenu !== null && n.contextMenu !== undefined) return n;
        n = n.panel;
      }
      if (input.isTouchEvent && this._defaultTouchContextMenu !== null) return hit.part;
    } else if (diagram.contextMenu !== null && diagram.contextMenu !== undefined) {
      return diagram;
    }
    return null;
  }

  doMouseDown(): void {
    super.doMouseDown();
    if (this.isActive && this._currentContextMenu instanceof Adornment) {
      const t = this.diagram ? this.diagram.toolManager.findTool('Action') : null;
      if (t !== null && t.canStart()) {
        t.doActivate();
        t.doMouseDown();
        t.doDeactivate();
      }
    }
    const dm: any = this.diagram;
    const mt = dm && dm.toolManager ? dm.toolManager.mouseDownTools : null;
    // 官方：ContextMenuTool 若被注册进 mouseDownTools，mousedown 也走一次 doContextClick
    if (mt && typeof mt.has === 'function' && mt.has(this)) {
      this.doContextClick();
    }
  }

  /** 官方 doMouseUp：Adornment 菜单先让 ActionTool 处理，然后 doContextClick */
  doMouseUp(): void {
    if (this.isActive && this._currentContextMenu instanceof Adornment) {
      const t = this.diagram ? this.diagram.toolManager.findTool('Action') : null;
      if (t !== null && t.canStart()) {
        t.doActivate();
        t.doCancel();
        t.doDeactivate();
      }
    }
    this.doContextClick();
  }

  /**
   * 官方 doContextClick：
   *   未激活 → canStart() && (openMenu(true), isActive || stopTool())
   *   已激活（菜单开着）→ 判定点击是否落在 Adornment 菜单内 → maybeStopTool
   */
  doContextClick(): void {
    if (!this.isActive) {
      if (this.canStart()) {
        this.openMenu(true);
        if (!this.isActive) this.stopTool();
      }
      return;
    }
    const menu = this._currentContextMenu;
    if (menu === null) return;
    let inside: any = null;
    if (!(menu instanceof HTMLInfo)) {
      const diagram = this.diagram;
      if (diagram) {
        const hit = diagram.findObjectAt(new Point(diagram.lastInput.documentPoint.x, diagram.lastInput.documentPoint.y));
        if (hit !== null && hit.isContainedBy && hit.isContainedBy(menu)) {
          this.standardMouseClick();
          inside = hit;
        }
      }
    }
    this.maybeStopTool(inside);
  }

  /** 官方 maybeStopTool：先 stop（doStop 会 hide），若还满足 canStart 就立刻重启（连续右键换菜单） */
  private maybeStopTool(_hit: any): void {
    this.stopTool();
    if (this.canStart()) {
      const d = this.diagram;
      if (d) d.currentTool = this;
      this.doMouseUp();
    }
  }

  /**
   * 官方 openMenu(flag, obj?)：选中（右键选目标）→ 查菜单 → show。
   * HTMLInfo/Adornment 都经 showContextMenu；成功打开则 isActive=true（不 stopTool）。
   */
  openMenu(select: boolean, obj?: any): void {
    if (this._inOpen) return;
    this._inOpen = true;
    if (select) this.standardMouseSelect();
    this.standardMouseClick();
    this._inOpen = false;

    if (!this.isActive) this._isActive = true;

    let target = obj !== undefined ? obj : this.findObjectWithContextMenu();
    const defaultMenu = (ContextMenuTool as any)._defaultMenu;
    if (target !== null && target !== undefined) {
      const n = target.contextMenu;
      if (n !== null && n !== undefined) {
        this._currentObject = target instanceof GraphObject ? target : null;
        this.showContextMenu(n, this._currentObject);
      } else if (defaultMenu !== null && defaultMenu !== undefined) {
        this.showContextMenu(defaultMenu, this._currentObject);
      }
    } else if (defaultMenu !== null && defaultMenu !== undefined) {
      this.showContextMenu(defaultMenu, null);
    }

    const cm = this._currentContextMenu;
    if (cm instanceof Adornment && !cm.visible) this.stopTool();
  }

  doMouseMove(): void {
    const d = this.diagram;
    if (!d) return;
    const action: any = d.toolManager.findTool('Action');
    if (action !== null) action.doMouseMove();
    if (this.isActive) d.toolManager.doMouseMove();
  }

  /**
   * 官方 showContextMenu(menu, obj)：
   *   menu !== currentContextMenu → 先 hideContextMenu
   *   Adornment → Tool 层 add + positionContextMenu
   *   HTMLInfo → menu.show(obj, diagram, tool)
   *   最后 currentContextMenu = menu
   */
  showContextMenu(menu: any, obj: GraphObject | null): void {
    const diagram = this.diagram;
    if (diagram === null) return;

    if (menu !== this._currentContextMenu) this.hideContextMenu();

    if (menu instanceof Adornment) {
      menu.layerName = 'Tool';
      menu.selectable = false;
      menu.scale = 1 / diagram.scale;
      menu.category = this.name;
      if (menu.hasPlaceholder && menu.hasPlaceholder() && menu.placeholder) {
        menu.placeholder.scale = diagram.scale;
      }
      const cur = menu.diagram;
      if (cur !== null && cur !== diagram) diagram.remove(menu);
      diagram.add(menu);
      if (obj !== null) menu.adornedObject = obj;
      else menu.data = diagram.model;
      menu.ensureBounds();
      this.positionContextMenu(menu, obj);
    } else if (menu && typeof menu.show === 'function') {
      // 官方：`t.show(i, e, this)` = show(obj, diagram, tool)
      menu.show(obj, diagram, this);
    }
    this._currentContextMenu = menu;
  }

  /** 官方 positionContextMenu：摆在 lastInput 文档点，viewport 边界夹取（右/下溢出时回移） */
  private positionContextMenu(adornment: Adornment, _obj: GraphObject | null): void {
    if (adornment.hasPlaceholder && adornment.hasPlaceholder()) return;
    const diagram = this.diagram;
    if (!diagram) return;
    const input = diagram.lastInput;
    const pt = new Point(input.documentPoint.x, input.documentPoint.y);
    const size = adornment.measuredBounds;
    const vp = diagram.viewportBounds;

    if (input.isTouchEvent) pt.x -= size.width;
    if (pt.x + size.width > vp.right) pt.x -= size.width + 5 / diagram.scale;
    if (pt.x < vp.x) pt.x = vp.x;
    if (pt.y + size.height > vp.bottom) pt.y -= size.height + 5 / diagram.scale;
    if (pt.y < vp.y) pt.y = vp.y;
    adornment.location = pt;
  }

  /**
   * 官方 hideContextMenu：Adornment → remove + 清 data/adornedObject；
   * HTMLInfo → hide(diagram, tool) 或 mainElement.display=none；
   * 末尾 currentContextMenu=null + standardMouseOver。
   */
  hideContextMenu(): void {
    const diagram = this.diagram;
    const menu = this._currentContextMenu;
    if (menu === null || menu === undefined) return;
    if (diagram !== null) {
      if (menu instanceof Adornment) {
        diagram.remove(menu);
        menu.data = null;
        menu.adornedObject = null;
      } else if (typeof menu.hide === 'function') {
        menu.hide(diagram, this);
      } else if (menu.mainElement !== null && menu.mainElement !== undefined) {
        menu.mainElement.style.display = 'none';
      }
    }
    this._currentContextMenu = null;
    this.standardMouseOver();
  }
}
