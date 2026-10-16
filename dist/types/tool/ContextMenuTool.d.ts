import { Tool } from './Tool';
import { Point } from '../core/Point';
import { GraphObject } from '../view/GraphObject';
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
export declare class ContextMenuTool extends Tool {
    static readonly className: string;
    private _currentContextMenu;
    private _currentObject;
    private _mouseDownPoint;
    /** 官方 `o0`：openMenu 重入护栏（show 回调里再触发点击时防嵌套） */
    private _inOpen;
    /** 官方 defaultTouchContextMenu */
    private _defaultTouchContextMenu;
    constructor();
    get currentContextMenu(): any;
    set currentContextMenu(val: any);
    /** 官方 ContextMenuTool.currentObject：右键命中的 GraphObject（HTMLInfo show 的 obj 参数） */
    get currentObject(): GraphObject | null;
    set currentObject(val: GraphObject | null);
    /** 官方 ContextMenuTool.mouseDownPoint（customContextMenu 的 paste 用它定位粘贴） */
    get mouseDownPoint(): Point;
    get defaultTouchContextMenu(): any;
    set defaultTouchContextMenu(val: any);
    /**
     * 官方 ContextMenuTool.canStart（go.js 逐字）：
     *   isBeyondDragSize() || !lastInput.right || clickCount > 1 → false
     *   否则 touch 的 defaultTouchContextMenu 或 findObjectWithContextMenu()。
     */
    canStart(): boolean;
    /** 官方 doStart：记录 firstInput 文档点 */
    doStart(): void;
    /** 官方 doStop：关菜单、清 currentObject/重入位 */
    doStop(): void;
    /**
     * 官方 ContextMenuTool.doActivate(){} —— **故意空实现**：
     * 不把 isActive 置 true（基类 doActivate 会），isActive 只在 openMenu 里
     * 手动置位。调 super 会破坏 doContextClick 的 !isActive 分支（启动即激活
     * → 永远进 else → currentContextMenu===null → return，菜单永远开不了）。
     */
    doActivate(): void;
    /**
     * 官方 ContextMenuTool.findObjectWithContextMenu(obj?)：
     * 沿 panel 链找 contextMenu；命中空时回落 diagram.contextMenu。
     */
    findObjectWithContextMenu(obj?: any): any | null;
    doMouseDown(): void;
    /** 官方 doMouseUp：Adornment 菜单先让 ActionTool 处理，然后 doContextClick */
    doMouseUp(): void;
    /**
     * 官方 doContextClick：
     *   未激活 → canStart() && (openMenu(true), isActive || stopTool())
     *   已激活（菜单开着）→ 判定点击是否落在 Adornment 菜单内 → maybeStopTool
     */
    doContextClick(): void;
    /** 官方 maybeStopTool：先 stop（doStop 会 hide），若还满足 canStart 就立刻重启（连续右键换菜单） */
    private maybeStopTool;
    /**
     * 官方 openMenu(flag, obj?)：选中（右键选目标）→ 查菜单 → show。
     * HTMLInfo/Adornment 都经 showContextMenu；成功打开则 isActive=true（不 stopTool）。
     */
    openMenu(select: boolean, obj?: any): void;
    doMouseMove(): void;
    /**
     * 官方 showContextMenu(menu, obj)：
     *   menu !== currentContextMenu → 先 hideContextMenu
     *   Adornment → Tool 层 add + positionContextMenu
     *   HTMLInfo → menu.show(obj, diagram, tool)
     *   最后 currentContextMenu = menu
     */
    showContextMenu(menu: any, obj: GraphObject | null): void;
    /** 官方 positionContextMenu：摆在 lastInput 文档点，viewport 边界夹取（右/下溢出时回移） */
    private positionContextMenu;
    /**
     * 官方 hideContextMenu：Adornment → remove + 清 data/adornedObject；
     * HTMLInfo → hide(diagram, tool) 或 mainElement.display=none；
     * 末尾 currentContextMenu=null + standardMouseOver。
     */
    hideContextMenu(): void;
}
