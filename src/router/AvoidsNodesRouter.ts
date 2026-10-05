import { Router } from '../core/Router';
import { PositionArray } from '../core/PositionArray';
import { Group } from '../view/Group';
import { Link } from '../view/Link';
import { Point } from '../core/Point';

/**
 * Approximate equality — 官方 `G.u(w,t)`：`|w-t| < 0.5`（go-debug 64965）。
 */
function u(w: number, t: number): boolean {
  const d = w - t;
  return d < 0.5 && d > -0.5;
}

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
export class AvoidsNodesRouter extends Router {
  constructor(props?: object) {
    super();
    this.name = 'AvoidsNodes';
    if (props) Object.assign(this, props);
  }

  /** 官方：`container.C0`（container 是 Diagram）或 `container.diagram.C0`（Group）才允许路由 */
  canRoute(container: any): boolean {
    if (container === null || container === undefined) return false;
    // 鸭子类型替代官方 `container instanceof Diagram`（避免 router → Diagram 循环 import）
    const c0 =
      typeof container.getPositions === 'function'
        ? (container as any)._needsAvoidance
        : container.diagram !== null && container.diagram !== undefined
          ? (container.diagram as any)._needsAvoidance
          : false;
    return c0 ? super.canRoute(container) : false;
  }

  /** 官方逐字：避免要求 + 容器匹配 + 双端节点 + 已有 >=4 点 */
  isRoutable(link: any, container: any): boolean {
    return !(
      !link.isAvoiding ||
      link.containingGroup !== (container instanceof Group ? container : null) ||
      link.toNode === null ||
      link.fromNode === null ||
      link.pointsCount < 4
    );
  }

  /** 官方 `routeLinks(links, container)`：对每条可路由 link 判定并重路由 */
  routeLinks(links: any, container: any): void {
    // 官方：`i instanceof Diagram ? null : i` —— 容器为 Diagram 时用整图占用场
    const containerGroup =
      container !== null && container !== undefined && typeof container.getPositions === 'function'
        ? null
        : container;
    const positions: PositionArray = this.diagram.getPositions(true, containerGroup, null);
    const it = links.iterator;
    while (it.next()) {
      const link: Link = it.value;
      if (!this.isRoutable(link, container)) continue;
      const fn = link.fromNode;
      const tn = link.toNode;
      if (fn === null || tn === null) continue;
      link.startRoute();
      const count = link.pointsCount;
      const startPt = link.getPoint(1);
      const endPt = link.getPoint(count - 2);
      const fromRect = fn.actualBounds.copy();
      fromRect.inflate(Link.Wh, Link.Wh);
      fromRect.unionPoint(link.getPoint(0));
      const toRect = tn.actualBounds.copy();
      toRect.inflate(Link.Wh, Link.Wh);
      toRect.unionPoint(link.getPoint(count - 1));
      if (this._oV(link, fromRect, toRect, positions)) {
        this._rV(link, startPt, link.sA, endPt, link.nA, fromRect, toRect, positions);
      }
      link.commitRoute();
    }
  }

  /**
   * 官方 `oV(link, fromRect, toRect, positions)` —— 是否需要重路由（true = 某段压到障碍格）。
   */
  private _oV(link: Link, fromRect: any, toRect: any, positions: PositionArray): boolean {
    const dg = link.diagram;
    const count = link.pointsCount;
    const fn = link.fromNode;
    const tn = link.toNode;
    if (
      dg === null ||
      dg === undefined ||
      !fn ||
      !tn ||
      fn === tn ||
      !link.layer ||
      link.layer.isTemporary ||
      (fromRect.containsPoint(link.getPoint(count - 1)) && !tn.isMemberOf(fn)) ||
      (toRect.containsPoint(link.getPoint(0)) && !fn.isMemberOf(tn)) ||
      !link.isOrthogonal
    ) {
      return false;
    }
    if (link.segmentIndex === 17) return true;
    const p1 = link.getPoint(1);
    const pN2 = link.getPoint(count - 2);
    const p2 = link.getPoint(2);
    if (
      !positions.isUnoccupied(
        Math.min(p1.x, p2.x),
        Math.min(p1.y, p2.y),
        Math.abs(p1.x - p2.x),
        Math.abs(p1.y - p2.y)
      )
    ) {
      return true;
    }
    for (let i = 2; i < count - 3; i++) {
      const a = link.getPoint(i);
      const b = link.getPoint(i + 1);
      if (
        !positions.isUnoccupied(
          Math.min(a.x, b.x),
          Math.min(a.y, b.y),
          Math.abs(a.x - b.x),
          Math.abs(a.y - b.y)
        )
      ) {
        return true;
      }
    }
    const pN3 = link.getPoint(count - 3);
    return !positions.isUnoccupied(
      Math.min(pN3.x, pN2.x),
      Math.min(pN3.y, pN2.y),
      Math.abs(pN3.x - pN2.x),
      Math.abs(pN3.y - pN2.y)
    );
  }

  /**
   * 官方 `rV(link, i=startPt, e=startDir, s=endPt, n=endDir, o=fromRect, r=toRect, l=positions)`：
   * 1. bounds = (fromRect ∪ toRect) 外扩 Nf 格 → tR(usePath=true) 建距离场
   * 2. `To(终点)` >= kg（不可达）→ aD 清场，bounds 再扩 mC/pC 格，tR(usePath=false) 重算
   * 3. 可达且终点未被占 → removeRange 中段 → hT 沿距离场回溯插点 → 端部角度吸附微调
   */
  private _rV(
    link: Link,
    i: Point,
    e: number,
    s: Point,
    n: number,
    o: any,
    r: any,
    l: PositionArray
  ): void {
    const dg = link.diagram;
    if (dg === null || dg === undefined) return;
    const a = i;
    const c = s;
    // 虚拟化分支（官方 if(h.isVirtualized){...}）未移植：非虚拟化下二者保持 NaN
    const f = new Point(NaN, NaN);
    const uu = new Point(NaN, NaN);

    const d = o.copy().unionRect(r);
    d.inflate(l.cellWidth * l.Nf, l.cellHeight * l.Nf);
    l.tR(i, e, s, n, d, true);
    let m = l.To(s.x, s.y);
    if (!l.tooClose && m >= PositionArray.kg) {
      l.aD();
      d.inflate(l.cellWidth * l.mC, l.cellHeight * l.pC);
      l.tR(i, e, s, n, d, false);
      m = l.To(s.x, s.y);
    }
    if (!l.tooClose && m < PositionArray.kg && !l.S4(s.x, s.y)) {
      link.points.removeRange(2, link.pointsCount - 3);
      this._hT(link, l, s.x, s.y, n, true);
      const g = 0;
      const p = 90;
      const y = 180;
      const x = 270;
      const b = link.getPoint(2);
      if (link.pointsCount < 4) {
        if (e === g || e === y) {
          b.x = i.x;
          b.y = s.y;
        } else {
          b.x = s.x;
          b.y = i.y;
        }
        link.setPointAt(2, b.x, b.y);
        link.insertPointAt(3, b.x, b.y);
      } else {
        const S = link.getPoint(3);
        if (e === g || e === y) {
          if (u(b.x, S.x)) {
            const k = e === g ? Math.max(b.x, i.x) : Math.min(b.x, i.x);
            link.setPointAt(2, k, i.y);
            link.setPointAt(3, k, S.y);
          } else if (u(b.y, S.y)) {
            if (Math.abs(i.y - b.y) <= l.cellHeight / 2) {
              link.setPointAt(2, b.x, i.y);
              link.setPointAt(3, S.x, i.y);
            }
            link.insertPointAt(2, b.x, i.y);
          } else {
            link.setPointAt(2, i.x, b.y);
          }
        } else if (e === p || e === x) {
          if (u(b.y, S.y)) {
            const k = e === p ? Math.max(b.y, i.y) : Math.min(b.y, i.y);
            link.setPointAt(2, i.x, k);
            link.setPointAt(3, S.x, k);
          } else if (u(b.x, S.x)) {
            if (Math.abs(i.x - b.x) <= l.cellWidth / 2) {
              link.setPointAt(2, i.x, b.y);
              link.setPointAt(3, i.x, S.y);
            }
            link.insertPointAt(2, i.x, b.y);
          } else {
            link.setPointAt(2, b.x, i.y);
          }
        }
      }
      // 官方 f/u 端点吸附补偿段（虚拟化专用，非虚拟化下 isReal()=false 自然跳过）
      if (f.isReal()) {
        const S1 = link.getPoint(1);
        const k1 = link.getPoint(2);
        if (S1.x !== k1.x && S1.y !== k1.y) {
          if (e === g || e === y) link.insertPointAt(2, S1.x, k1.y);
          else link.insertPointAt(2, k1.x, S1.y);
        } else if (e === g || e === y) {
          link.insertPointAt(2, a.x, f.y);
        } else {
          link.insertPointAt(2, f.x, a.y);
        }
      }
      if (uu.isReal()) {
        const cnt = link.pointsCount;
        const S2 = link.getPoint(cnt - 2);
        if (n === g || n === y) link.insertPointAt(cnt - 2, c.x, uu.y);
        else link.insertPointAt(cnt - 2, uu.x, c.y);
      }
    }
  }

  /**
   * 官方 `hT(link, positions, e, s, dir, firstCall)`：
   * 从终点（或拐点）沿距离场 `u-1` 下坡回溯到 Sc；firstCall 时先做 fA 方向矫正、
   * 回溯后按格中心吸附单轴；中途回溯不动（未到 Sc）则找 90° 转向格递归；
   * 最后 `insertPointAt(pointsCount-2, d, m)` 把本段点插到末点前。
   */
  private _hT(link: Link, i: PositionArray, e: number, s: number, n: number, o: boolean): void {
    const c = i.cellWidth;
    const f = i.cellHeight;
    let uu = i.To(e, s);
    let d = e;
    let m = s;
    let g = d;
    let p = m;
    // 官方 for-init：先沿 dir 一步 + fA 端点方向矫正
    if (n === 0) g += c;
    else if (n === 90) p += f;
    else if (n === 180) g -= c;
    else p -= f;
    if (link.fA && uu > PositionArray.Sc && i.To(g, p) !== uu - 1) {
      if (i.To(d - c, m) === uu - 1) {
        n = 180;
        g = d - c;
        p = m;
      } else if (i.To(d + c, m) === uu - 1) {
        n = 0;
        g = d + c;
        p = m;
      } else if (i.To(d, m - f) === uu - 1) {
        n = 270;
        g = d;
        p = m - f;
      } else if (i.To(d, m + f) === uu - 1) {
        n = 90;
        g = d;
        p = m + f;
      }
    }
    // 官方 walk：下坡 u-1 直到断链
    while (uu > PositionArray.Sc && i.To(g, p) === uu - 1) {
      d = g;
      m = p;
      if (n === 0) g += c;
      else if (n === 90) p += f;
      else if (n === 180) g -= c;
      else p -= f;
      uu -= 1;
    }
    // 官方 snap：firstCall 只吸附垂直于行进方向的单轴；否则两轴都吸到格中心
    if (o) {
      if (uu > PositionArray.Sc) {
        if (n === 180 || n === 0) {
          d = Math.floor(d / c) * c + c / 2;
        } else if (n === 90 || n === 270) {
          m = Math.floor(m / f) * f + f / 2;
        }
      }
    } else {
      d = Math.floor(d / c) * c + c / 2;
      m = Math.floor(m / f) * f + f / 2;
    }
    // 官方：仍未到 Sc → 尝试 90° 转向继续
    if (uu > PositionArray.Sc) {
      let y = n;
      let x = d;
      let b = m;
      if (n === 0) {
        y = 90;
        b += f;
      } else if (n === 90) {
        y = 180;
        x -= c;
      } else if (n === 180) {
        y = 270;
        b -= f;
      } else if (n === 270) {
        y = 0;
        x += c;
      }
      if (i.To(x, b) === uu - 1) {
        this._hT(link, i, x, b, y, false);
      } else {
        let k = d;
        let P = m;
        if (n === 0) {
          y = 270;
          P -= f;
        } else if (n === 90) {
          y = 0;
          k += c;
        } else if (n === 180) {
          y = 90;
          P += f;
        } else if (n === 270) {
          y = 180;
          k -= c;
        }
        if (i.To(k, P) === uu - 1) {
          this._hT(link, i, k, P, y, false);
        }
      }
    }
    link.insertPointAt(link.pointsCount - 2, d, m);
  }
}
