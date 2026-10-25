import { Router } from '../core/Router';
/**
 * AvoidsNodesRouter - 官方 `class AvoidsNodesRouter extends Router`（go-debug ~1102399，
 * 全文参考 temp/official/Routers.js）。
 *
 * 后处理避障路由器：`Diagram.doLinkRouting` 在基础正交路由（addOrthoPoints）之后
 * 遍历 routers，本路由器把压到障碍格的折线用 PositionArray 距离场重算成绕行折线。
 *
 * - canRoute：门控 `Diagram.C0`（一旦出现 avoiding link 置 true，从不复位）
 * - routeLinks：getPositions(true, container|忽略, null) → startRoute → oV 判定 → rV 重路由 → commitRoute
 * - rV：端点方向 GS/qS 距离场 + hT 回溯内点 + 端部角度吸附
 * - hT：沿距离场 u-1 下坡回溯，拐点按格中心吸附后 insertPointAt(pointsCount-2, ...)
 *
 * 虚拟化（Diagram.isVirtualized）分支需要官方 G.Ul 线段求交，本项目未移植；
 * 非虚拟化时 f/u 恒为 NaN 点，行为与官方逐字一致。
 */
export declare class AvoidsNodesRouter extends Router {
    constructor(props?: object);
    /** 官方：`container.C0`（container 是 Diagram）或 `container.diagram.C0`（Group）才允许路由 */
    canRoute(container: any): boolean;
    /** 官方逐字：避免要求 + 容器匹配 + 双端节点 + 已有 >=4 点 */
    isRoutable(link: any, container: any): boolean;
    /** 官方 `routeLinks(links, container)`：对每条可路由 link 判定并重路由 */
    routeLinks(links: any, container: any): void;
    /**
     * 官方 `oV(link, fromRect, toRect, positions)` —— 是否需要重路由（true = 某段压到障碍格）。
     */
    private _oV;
    /**
     * 官方 `rV(link, i=startPt, e=startDir, s=endPt, n=endDir, o=fromRect, r=toRect, l=positions)`：
     * 1. bounds = (fromRect ∪ toRect) 外扩 Nf 格 → tR(usePath=true) 建距离场
     * 2. `To(终点)` >= kg（不可达）→ aD 清场，bounds 再扩 mC/pC 格，tR(usePath=false) 重算
     * 3. 可达且终点未被占 → removeRange 中段 → hT 沿距离场回溯插点 → 端部角度吸附微调
     */
    private _rV;
    /**
     * 官方 `hT(link, positions, e, s, dir, firstCall)`：
     * 从终点（或拐点）沿距离场 `u-1` 下坡回溯到 Sc；firstCall 时先做 fA 方向矫正、
     * 回溯后按格中心吸附单轴；中途回溯不动（未到 Sc）则找 90° 转向格递归；
     * 最后 `insertPointAt(pointsCount-2, d, m)` 把本段点插到末点前。
     */
    private _hT;
}
