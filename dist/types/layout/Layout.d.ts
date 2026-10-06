import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { List } from '../core/List';
import { Part } from '../view/Part';
import { LayoutNetwork } from './LayoutNetwork';
/**
 * Layout - base class for all layout algorithms.
 * Subclasses must override doLayout() to implement specific layout algorithms.
 */
export declare class Layout {
    static readonly className: string;
    protected _arrangementOrigin: Point;
    protected _isInitial: boolean;
    protected _isOngoing: boolean;
    protected _isRealtime: boolean;
    protected _isRouting: boolean;
    /** 官方 `Tg=!1`：Layout 构造默认无效（首次 _performLayout 才跑） */
    protected _isValidLayout: boolean;
    protected _isViewportSized: boolean;
    /** 官方签名 `(part, lay, rect) => rect` */
    protected _boundsComputation: ((part: Part, layout: Layout, bounds: Rect) => Rect) | null;
    protected _network: LayoutNetwork | null;
    protected _diagram: any;
    protected _group: any;
    /** 官方 `Layout.constructor(init?)`：`t && Object.assign(this, t)` */
    constructor(init?: any);
    get arrangementOrigin(): Point;
    set arrangementOrigin(val: Point);
    get isInitial(): boolean;
    /** 官方 `set isInitial(t){...; t||(this.Tg=!0)}`：置 false 立即视为已有效 → 跳过初始布局 */
    set isInitial(val: boolean);
    get isOngoing(): boolean;
    set isOngoing(val: boolean);
    get isRealtime(): boolean;
    set isRealtime(val: boolean);
    get isRouting(): boolean;
    set isRouting(val: boolean);
    get isValidLayout(): boolean;
    set isValidLayout(val: boolean);
    get isViewportSized(): boolean;
    set isViewportSized(val: boolean);
    get boundsComputation(): ((part: Part, layout: Layout, bounds: Rect) => Rect) | null;
    set boundsComputation(val: ((part: Part, layout: Layout, bounds: Rect) => Rect) | null);
    get network(): LayoutNetwork | null;
    set network(val: LayoutNetwork | null);
    get diagram(): any;
    set diagram(val: any);
    get group(): any;
    set group(val: any);
    /**
     * Perform the layout on the given collection of parts.
     * 官方 base Layout.doLayout：收集未定位的顶层部件（doMinimalNoNetworkLayout 的 Ga 谓词），
     * 按 ceil(sqrt(n)) 列的极简网格摆放（仅对 location/position 均为 NaN 的部件）。
     * @param coll - A Diagram, Group, Iterable<Part>, or array of Parts
     */
    doLayout(coll: any): void;
    /**
     * 官方 Layout.Zh（base 版收集，谓词 = Ga(t)）：
     * - Diagram：nodes(topLevelOnly) + parts(topLevelOnly) 两趟
     * - Group：memberParts(topLevelOnly=false)
     * - 其他可迭代集合：addAll，不带谓词
     * 谓词 Ga(t) = (!location实值 && !position实值) || (Group && t.Ga)
     * Node 分支：Group.layout===null 时递归 memberParts；其余 ensureBounds 后加入。
     */
    collectMinimalParts(coll: any): Part[];
    /**
     * 官方 Layout.doMinimalNoNetworkLayout：
     * arrangementOrigin = initialOrigin(arrangementOrigin)（原地变更），
     * cols = ceil(sqrt(n))，步长 max(w,50)+20，行高 max(max(h,50))，moveTo 后 Group.Ga=false。
     */
    doMinimalNoNetworkLayout(parts: Part[]): void;
    /**
     * Collect all Parts that should be laid out from the given collection.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    collectParts(coll: any): List<Part>;
    /** 官方 collectParts 内部的收集过程（对应官方私有 Ka 方法） */
    private _collectInto;
    /**
     * Commit the layout by moving parts to their computed positions.
     * Called after the layout algorithm has computed positions.
     */
    commitLayout(): void;
    /**
     * 官方 `Layout.cloneProtected`：把受保护字段复制到一个已构造好的新实例。
     * 官方实现：`t.Tg=this.Tg, t.Kr=this.Kr, t.Lg=this.Lg, t.Dg.f(this.Dg), t.vo=this.vo, t.Il=this.Il, t.Fg=this.Fg, t.Rg=!0`
     * （字段名对应 isInitial/isOngoing/isRealtime/arrangementOrigin/isRouting/isViewportSized/boundsComputation/isValidLayout）
     */
    protected cloneProtected(copy: Layout): void;
    /**
     * Create a copy of this layout.
     * 官方：`const t = new this.constructor; return this.cloneProtected(t), t`
     */
    copy(): Layout;
    /**
     * 官方 `Layout.toString()`：
     * `U.to(this.constructor) + "()"`，若 `group !== null` 追加 `" in " + group`，若 `diagram !== null` 追加 `" for " + diagram`。
     */
    toString(): string;
    /**
     * Create a new LayoutNetwork for this layout.
     */
    createNetwork(): LayoutNetwork;
    /**
     * Get the layout bounds of a part.
     * 官方 `Layout.getLayoutBounds(t, rect?)`（go.js）：
     *   boundsComputation 非空 → bc(t, this, rect)；
     *   否则 rect.set(t.actualBounds); rect.addMargin(t.margin)（margin 全 0 快路返回 actualBounds）。
     * kanban 泳道 Group margin (0,2) → 宽 162+4=166（步进 166），漏 margin 会得 162。
     * @param part - The part to get bounds for
     */
    getLayoutBounds(part: Part): Rect;
    /**
     * Return the initial origin point for the layout.
     * 官方 Layout.initialOrigin：
     * - group 有 placeholder → placeholder 文档 TopLeft（NaN → 回退 origin）+ padding
     * - group 无 placeholder → group.position（NaN → 回退 origin）
     * - 无 group → origin
     */
    initialOrigin(t?: Point): Point;
    private _findPlaceholder;
    /** target 在 group 面板内的局部偏移（沿 actualBounds 局部链累加）；找不到 → null */
    private _panelLocalPoint;
    /**
     * Invalidate this layout, causing it to be re-performed.
     *
     * 官方 `Layout.invalidateLayout()` 三重护栏：
     * 1) 已无效 → 直接返回（幂等）；
     * 2) undo/redo 期间返回；
     * 3) 动画 tick 期间返回（官方 `i.isTicking || (...)`）——否则动画回写 location 每帧都会重排。
     * 之后才按 `(isOngoing && diagram 已完成首排) || (isInitial && 未完成首排)` 置无效
     * （官方 `t.ga` = Diagram 已完成一次 update/首排；此处用 `_hasPerformedInitialLayout` 近似）。
     */
    invalidateLayout(): void;
    /**
     * Build a LayoutNetwork from the parts in the given collection.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    makeNetwork(coll: any): LayoutNetwork;
    /**
     * Update the positions of parts after the layout has been computed.
     */
    updateParts(): void;
}
