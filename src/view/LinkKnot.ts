import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Spot } from '../core/Spot';

/**
 * 官方 `LinkInfo`：端口 Knot 中一条 side-spot 连线的路由信息。
 * 字段名与 go-debug.js 官方源码一致（as/jt/ye/HS/Cg/ru/yc/KS）。
 */
export class LinkInfo {
  /** 所属 Link（官方 `as`） */
  as: any;
  /** 排序角（官方 `jt`，度，已按侧规范化） */
  jt: number;
  /** 侧码（官方 `ye`：1=上,2=左,4=右,8=下） */
  ye: number;
  /** 对端点（官方 `HS`，computeOtherPoint 结果快照） */
  HS: Point;
  /** 同侧正序索引（官方 `Cg`） */
  Cg: number;
  /** 同侧总数（官方 `ru`） */
  ru: number;
  /** 本端 knot 位置（官方 `yc`，即 side-spot 端点） */
  yc: Point;
  /** 本端 endSegmentLength（官方 `KS`） */
  KS: number;

  constructor(link: any, jt: number, ye: number) {
    this.as = link;
    this.jt = jt;
    this.ye = ye;
    this.HS = new Point();
    this.Cg = 0;
    this.ru = 0;
    this.yc = new Point();
    this.KS = 0;
  }
}

/**
 * 官方 `Knot`：挂在端口（GraphObject）上的缓存，管理所有以该端口为 side-spot
 * 端点的连线的端点位置（yc）、方向（ye）、同侧排序（Cg/ru）与 endSegmentLength（KS）。
 * 官方存储于 `port.Vd`；本项目存于 `GraphObject._knot`。
 */
export class Knot {
  /** 所属 Part（Node），官方 `Ye` */
  private _part: any;
  /** 端口（GraphObject），官方 `Gs` */
  private _port: any;
  /** LinkInfo 数组，官方 `We` */
  private _infos: (LinkInfo | undefined)[];
  /** 构建重入保护，官方 `Mg` */
  private _building: boolean = false;

  constructor(part: any, port: any) {
    this._part = part;
    this._port = port;
    this._infos = [];
  }

  /** 官方 `Knot.gg()`：清空缓存（失效） */
  gg(): void {
    this._infos.length = 0;
  }

  /** 官方 `Knot.$F(link)`：取该连线在此端口的 LinkInfo（必要时先构建） */
  $F(link: any): LinkInfo | null {
    let list = this._infos;
    if (list.length === 0) {
      this.M4();
      list = this._infos;
    }
    for (let i = 0; i < list.length; i++) {
      const li = list[i];
      if (li !== undefined && li !== null && li.as === link) return li;
    }
    return null;
  }

  /** 官方 `Knot.P4(rect, spot, angle, orthogonal)`：side-spot 落到哪条边 */
  private P4(rect: Rect, spot: Spot, angle: number, orthogonal: boolean): number {
    const n = spot.offsetY;
    switch (n) {
      case 8: return 90;
      case 2: return 180;
      case 1: return 270;
      case 4: return 0;
    }
    let o = angle;
    switch (n) {
      case 9: return o > 180 ? 270 : 90;
      case 6: return (o > 90 && o <= 270) ? 180 : 0;
    }
    const r = (Math.atan2(rect.height, rect.width) * 180) / Math.PI;
    switch (n) {
      case 3: return (o > r && o <= 180 + r) ? 180 : 270;
      case 5: return (o > 180 - r && o <= 360 - r) ? 270 : 0;
      case 12: return (o > r && o <= 180 + r) ? 90 : 0;
      case 10: return (o > 180 - r && o <= 360 - r) ? 180 : 90;
      case 7: return (o > 90 && o <= 180 + r) ? 180 : (o > 180 + r && o <= 360 - r) ? 270 : 0;
      case 13: return (o > 180 && o <= 360 - r) ? 270 : (o > r && o <= 180) ? 90 : 0;
      case 14: return (o > r && o <= 180 - r) ? 90 : (o > 180 - r && o <= 270) ? 180 : 0;
      case 11: return (o > 180 - r && o <= 180 + r) ? 180 : (o > 180 + r) ? 270 : 90;
    }
    // 官方 default 分支（n===15 AllSides；s&&n!==15 的 -15° 修正为死代码，按官方原样保留）
    if (orthogonal && n !== 15) {
      o -= 15;
      if (o < 0) o += 360;
    }
    if (o > r && o < 180 - r) return 90;
    if (o >= 180 - r && o <= 180 + r) return 180;
    if (o > 180 + r && o < 360 - r) return 270;
    return 0;
  }

  /** 端口 → 文档坐标下的 spot 点（官方 `GraphObject.getDocumentPoint(spot)`） */
  private _docPoint(spot: Spot): Point {
    if (spot === null || spot.isNone()) {
      const b = this._port.getDocumentBounds();
      return new Point(b.x + b.width / 2, b.y + b.height / 2);
    }
    return this._port.getDocumentPoint(spot);
  }

  /** 官方 `Knot.M4()`：构建 LinkInfo 列表 */
  private M4(): void {
    if (this._building) return;
    this._building = true;
    try {
      const s = this._part;
      if (!s) return;
      // 官方 Group 分支（isSubGraphExpanded=false 时用 findExternalLinksConnected +
      // 子图过滤）未移植：本项目暂不支持 Group 内 link bundle 语义。
      let links: any;
      if (s.isTreeExpanded) links = s.findLinksConnected();
      else links = s.findExternalTreeLinksConnected();
      this._infos.length = 0;
      let o = 0;
      const tl = this._docPoint(Spot.TopLeft);
      const br = this._docPoint(Spot.BottomRight);
      const h = new Rect(tl.x, tl.y, 0, 0);
      h.unionPoint(br);
      const a = new Point(h.x + h.width / 2, h.y + h.height / 2);
      const c = this._port.getDocumentAngle();
      const it: any = links && links.iterator ? links.iterator : links;
      while (it && it.next()) {
        const g = it.value;
        if (!g.isVisible()) continue;
        const p = g.fromPort;
        const y = g.toPort;
        if (p === y) continue;
        if (p !== this._port && y !== this._port) continue;
        const x = p === this._port;
        const b = g.computeSpot(x, this._port);
        if (!b.isSide()) continue;
        let S: any = x ? y : p;
        if (S === null || S === undefined) continue;
        let k = S.part;
        if (k === null || k === undefined) continue;
        const P = k.findVisibleNode();
        if (P !== null && P !== k) {
          k = P;
          S = k.port;
        }
        const A = g.computeOtherPoint(k, S);
        let N = a.directionPoint(A);
        if (c !== 0) {
          N -= c;
          if (N >= 360) N -= 360;
          else if (N < 0) N += 360;
        }
        const M = this.P4(h, b, N, g.isOrthogonal);
        let C: number;
        if (M === 0) {
          C = 4;
          if (N > 180) N -= 360;
        } else if (M === 90) {
          C = 8;
          if (N > 270) N -= 360;
        } else if (M === 180) {
          C = 2;
        } else {
          C = 1;
          if (N < 90) N += 360;
        }
        let T = this._infos[o];
        if (T === undefined || T === null) {
          T = new LinkInfo(g, N, C);
          this._infos[o] = T;
        } else {
          T.as = g;
          T.jt = N;
          T.ye = C;
        }
        T.HS.set(A);
        o++;
      }
      this.C4();
      const u = this._infos.length;
      let d = -1;
      let m = 0;
      for (let i = 0; i < u; i++) {
        const g = this._infos[i];
        if (g !== undefined && g !== null) {
          if (g.ye !== d) {
            d = g.ye;
            m = 0;
          }
          g.Cg = m;
          m++;
        }
      }
      d = -1;
      m = 0;
      for (let i = u - 1; i >= 0; i--) {
        const g = this._infos[i];
        if (g !== undefined && g !== null) {
          if (g.ye !== d) {
            d = g.ye;
            m = g.Cg + 1;
          }
          g.ru = m;
        }
      }
      this.N4(this._infos);
      this.A4(this._infos);
    } finally {
      this._building = false;
    }
  }

  /** 官方 `Knot.T4(t, i)` 比较器（侧码 ye → 排序角 jt） */
  private T4(t: LinkInfo | undefined | null, i: LinkInfo | undefined | null): number {
    if (t === i) return 0;
    if (t === undefined || t === null) return -1;
    if (i === undefined || i === null) return 1;
    if (t.ye !== i.ye) return t.ye < i.ye ? -1 : 1;
    if (t.jt !== i.jt) return t.jt < i.jt ? -1 : 1;
    return 0;
  }

  /** 官方 `Knot.C4()`：按 (ye, jt) 排序 */
  private C4(): void {
    this._infos.sort((a, b) => this.T4(a, b));
  }

  /** 官方 `Knot.N4(list)`：按端口 spreading 计算每条 LinkInfo 的端点位置 yc */
  private N4(t: (LinkInfo | undefined)[]): void {
    const i = this._port;
    const e = this._part.portSpreading;
    const s = this._docPoint(Spot.TopLeft);
    const n = this._docPoint(Spot.TopRight);
    const o = this._docPoint(Spot.BottomRight);
    const r = this._docPoint(Spot.BottomLeft);
    let l = 0;
    let h = 0;
    let a = 0;
    let c = 0;
    if (e === 2) {
      for (let x = 0; x < t.length; x++) {
        const b = t[x];
        if (b === null || b === undefined) continue;
        const S = b.as.computeThickness();
        switch (b.ye) {
          case 8: a += S; break;
          case 2: c += S; break;
          case 1: l += S; break;
          default: case 4: h += S; break;
        }
      }
    }
    let f = 0;
    let u = 0;
    let d = 1;
    let m = n;
    let g = o;
    let p = 0;
    let y = 0;
    for (let x = 0; x < t.length; x++) {
      const b = t[x];
      if (b === null || b === undefined) continue;
      if (f !== b.ye) {
        switch (f = b.ye) {
          case 8: m = o; g = r; break;
          case 2: m = r; g = s; break;
          case 1: m = s; g = n; break;
          default: case 4: m = n; g = o; break;
        }
        p = g.x - m.x;
        y = g.y - m.y;
        switch (f) {
          case 8: if (a > Math.abs(p)) { d = Math.abs(p) / a; a = Math.abs(p); } else d = 1; break;
          case 2: if (c > Math.abs(y)) { d = Math.abs(y) / c; c = Math.abs(y); } else d = 1; break;
          case 1: if (l > Math.abs(p)) { d = Math.abs(p) / l; l = Math.abs(p); } else d = 1; break;
          default: case 4: if (h > Math.abs(y)) { d = Math.abs(y) / h; h = Math.abs(y); } else d = 1; break;
        }
        u = 0;
      }
      const S = b.yc;
      if (e === 2) {
        let k = b.as.computeThickness();
        k *= d;
        S.set(m);
        switch (f) {
          case 8: S.x = m.x + p / 2 + a / 2 - u - k / 2; break;
          case 2: S.y = m.y + y / 2 + c / 2 - u - k / 2; break;
          case 1: S.x = m.x + p / 2 - l / 2 + u + k / 2; break;
          default: case 4: S.y = m.y + y / 2 - h / 2 + u + k / 2; break;
        }
        u += k;
      } else {
        let k = 0.5;
        if (e === 1) k = (b.Cg + 1) / (b.ru + 1);
        S.x = m.x + p * k;
        S.y = m.y + y * k;
      }
    }
    // 官方对 Point.a() 池化点的回收在本项目无池，忽略。
    void i;
  }

  /** 官方 `Knot.A4(list)`：计算每条 LinkInfo 的 endSegmentLength */
  private A4(t: (LinkInfo | undefined)[]): void {
    for (let i = 0; i < t.length; i++) {
      const e = t[i];
      if (e !== undefined && e !== null) e.KS = this.L4(e, i);
    }
  }

  /** 官方 `Knot.L4(t, i)` */
  private L4(t: LinkInfo, i: number): number {
    const e = t.as;
    const s = e.fromPort === this._port;
    let n = 0;
    switch (t.ye) {
      case 1: n = 270; break;
      case 2: n = 180; break;
      case 4: n = 0; break;
      case 8: n = 90; break;
    }
    const o = e.computeEndSegmentLength(this._part, this._port, Spot.None, s, n);
    let r = t.Cg;
    if (r < 0) return o;
    const l = t.ru;
    if (l <= 1 || !e.isOrthogonal) return o;
    const a = t.HS;
    const c = t.yc;
    const f = t.ye === 2 || t.ye === 8;
    if (f) r = l - 1 - r;
    const u = (e.constructor as any)._zF;
    const d = t.ye === 2 || t.ye === 4;
    const m = r <= 0 ? c : (this._infos[f ? i + 1 : i - 1] as LinkInfo).yc;
    const g = r >= l - 1 ? c : (this._infos[f ? i - 1 : i + 1] as LinkInfo).yc;
    if (d ? (a.y >= m.y && a.y <= g.y) : (a.x >= m.x && a.x <= g.x)) return o;
    if (d ? a.y < c.y : a.x < c.x) return o + r * u;
    return o + (l - 1 - r) * u;
  }
}
