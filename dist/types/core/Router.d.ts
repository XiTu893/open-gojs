/**
 * Router - base class for diagram routers (`diagram.routers`).
 *
 * 官方 Router 移植（go-debug `class Router`）：
 * - name/isEnabled/isRealtime/diagram 属性；set diagram 时使路由失效并 requestUpdate
 * - canRoute(container)：isEnabled=false 或（非 realtime 且图处于跳过路由状态）/动画 tick 中返回 false
 * - isRoutable(link, container) 默认 true；routeLinks(links, container) 默认空
 * - invalidateRouter()
 */
export declare class Router {
    static readonly className: string;
    private _name;
    private _isEnabled;
    private _isRealtime;
    private _diagram;
    constructor();
    get name(): string;
    set name(val: string);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get isRealtime(): boolean;
    set isRealtime(val: boolean);
    get diagram(): any;
    set diagram(val: any);
    /** 使本路由器的路由失效并触发重新路由 */
    invalidateRouter(): void;
    /** 官方：isEnabled 且（realtime 或非跳过状态），动画 tick 中不路由 */
    canRoute(container: any): boolean;
    /** 是否允许路由指定 link */
    isRoutable(link: any, container: any): boolean;
    /** 对给定 link 集合执行路由；基类为空实现 */
    routeLinks(links: any, container: any): void;
    toString(): string;
}
