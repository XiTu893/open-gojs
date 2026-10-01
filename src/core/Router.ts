/**
 * Router - base class for diagram routers (`diagram.routers`).
 *
 * 官方 Router 移植（go-debug `class Router`）：
 * - name/isEnabled/isRealtime/diagram 属性；set diagram 时使路由失效并 requestUpdate
 * - canRoute(container)：isEnabled=false 或（非 realtime 且图处于跳过路由状态）/动画 tick 中返回 false
 * - isRoutable(link, container) 默认 true；routeLinks(links, container) 默认空
 * - invalidateRouter()
 */
export class Router {
  static readonly className: string = "Router";

  private _name: string = "";
  private _isEnabled: boolean = true;
  private _isRealtime: boolean = true;
  private _diagram: any = null;

  constructor() {}

  get name(): string { return this._name; }
  set name(val: string) { this._name = val; }

  get isEnabled(): boolean { return this._isEnabled; }
  set isEnabled(val: boolean) { this._isEnabled = val; }

  get isRealtime(): boolean { return this._isRealtime; }
  set isRealtime(val: boolean) { this._isRealtime = val; }

  get diagram(): any { return this._diagram; }
  set diagram(val: any) {
    if (this._diagram !== val) {
      this._diagram = val;
      if (val) {
        (val as any)._linkRoutingInvalid = true;
        if (typeof val.requestUpdate === 'function') val.requestUpdate();
      }
    }
  }

  /** 使本路由器的路由失效并触发重新路由 */
  invalidateRouter(): void {
    if (this._diagram !== null && this._diagram !== undefined) {
      (this._diagram as any)._linkRoutingInvalid = true;
      if (typeof (this._diagram as any).requestUpdate === 'function') {
        (this._diagram as any).requestUpdate();
      }
    }
  }

  /** 官方：isEnabled 且（realtime 或非跳过状态），动画 tick 中不路由 */
  canRoute(container: any): boolean {
    if (!this.isEnabled) return false;
    const d: any = this.diagram;
    if (d && d.animationManager && d.animationManager.isTicking) return false;
    return true;
  }

  /** 是否允许路由指定 link */
  isRoutable(link: any, container: any): boolean {
    return true;
  }

  /** 对给定 link 集合执行路由；基类为空实现 */
  routeLinks(links: any, container: any): void {}

  toString(): string {
    return this.name !== "" ? this.name + " Router" : "Router";
  }
}
