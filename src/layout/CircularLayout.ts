import { Point } from '../core/Point';
import { List } from '../core/List';
import { EnumValue } from '../core/EnumValues';
import {
  CircularArrangementConstantDistance, CircularArrangementConstantAngle,
  CircularArrangementConstantRadius, CircularArrangementConstantSpacing, CircularArrangementPacked,
  CircularDirectionClockwise, CircularDirectionCounterclockwise, CircularDirectionBidirectionalLeft, CircularDirectionBidirectionalRight,
  CircularSortingForwards, CircularSortingReverse, CircularSortingAscending, CircularSortingDescending,
  CircularSortingOptimized,
  CircularNodeDiameterFormulaCircular, CircularNodeDiameterFormulaPythagorean
} from '../core/EnumValues';
import { Node } from '../view/Node';
import { Layout } from './Layout';
import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';

/** 官方 4.0 的数字枚举值（go.d.ts），用于把样例里写的数字翻译成本项目的 EnumValue */
const CircularArrangementValues = new Map<number, EnumValue>([
  [0, CircularArrangementConstantSpacing],
  [1, CircularArrangementConstantDistance],
  [2, CircularArrangementConstantAngle],
  [3, CircularArrangementPacked]
]);
const CircularDirectionValues = new Map<number, EnumValue>([
  [10, CircularDirectionClockwise],
  [11, CircularDirectionCounterclockwise],
  [12, CircularDirectionBidirectionalLeft],
  [13, CircularDirectionBidirectionalRight]
]);
const CircularSortingValues = new Map<number, EnumValue>([
  [20, CircularSortingForwards],
  [21, CircularSortingReverse],
  [22, CircularSortingAscending],
  [23, CircularSortingDescending],
  [24, CircularSortingOptimized]
]);
const CircularNodeDiameterFormulaValues = new Map<number, EnumValue>([
  [30, CircularNodeDiameterFormulaPythagorean],
  [31, CircularNodeDiameterFormulaCircular]
]);

/**
 * CircularLayout - arranges nodes in a circle or circular pattern.
 */
export class CircularLayout extends Layout {
  static readonly className: string = "CircularLayout";

  /** 官方 `CircularLayout.constructor(init?)`：`t && Object.assign(this, t)` */
  constructor(init?: any) {
    super();
    if (init) Object.assign(this, init);
  }

  private _radius: number = NaN;
  private _startAngle: number = 0;
  private _sweepAngle: number = 360;
  private _arrangement: EnumValue = CircularArrangementConstantSpacing;
  private _spacing: number = 6;
  private _direction: EnumValue = CircularDirectionClockwise;
  private _aspectRatio: number = 1;
  private _actualXRadius: number = NaN;
  private _actualYRadius: number = NaN;
  private _sorting: EnumValue = CircularSortingOptimized;
  private _comparer: ((a: any, b: any) => number) | null = null;
  private _nodeDiameterFormula: EnumValue = CircularNodeDiameterFormulaPythagorean;
  private _actualSpacing: number = 0;
  /** 最近一次布局产生的子网络（splitIntoSubNetworks 会把顶点搬进去，
   *  主网络 vertexes 因此变空，commitNodes/commitLinks 需要遍历它们）。 */
  private _lastSubNetworks: List<LayoutNetwork> | null = null;
  private _actualCenter: Point = new Point(0, 0);

  get radius(): number { return this._radius; }
  set radius(val: number) { this._radius = val; this.invalidateLayout(); }

  get startAngle(): number { return this._startAngle; }
  set startAngle(val: number) { this._startAngle = val; this.invalidateLayout(); }

  get sweepAngle(): number { return this._sweepAngle; }
  set sweepAngle(val: number) { this._sweepAngle = val; this.invalidateLayout(); }

  get arrangement(): EnumValue { return this._arrangement; }
  set arrangement(val: EnumValue | number) { this._arrangement = this._enum(val, CircularArrangementValues); this.invalidateLayout(); }

  get spacing(): number { return this._spacing; }
  set spacing(val: number) { this._spacing = val; this.invalidateLayout(); }

  get direction(): EnumValue { return this._direction; }
  set direction(val: EnumValue | number) { this._direction = this._enum(val, CircularDirectionValues); this.invalidateLayout(); }

get aspectRatio(): number { return this._aspectRatio; }
  set aspectRatio(val: number) { this._aspectRatio = val; this.invalidateLayout(); }

  get actualXRadius(): number { return this._actualXRadius; }
  get actualYRadius(): number { return this._actualYRadius; }

  get sorting(): EnumValue { return this._sorting; }
  set sorting(val: EnumValue | number) { this._sorting = this._enum(val, CircularSortingValues); this.invalidateLayout(); }

  get comparer(): ((a: any, b: any) => number) | null { return this._comparer; }
  set comparer(val: ((a: any, b: any) => number) | null) { this._comparer = val; }

  get nodeDiameterFormula(): EnumValue { return this._nodeDiameterFormula; }
  set nodeDiameterFormula(val: EnumValue | number) { this._nodeDiameterFormula = this._enum(val, CircularNodeDiameterFormulaValues); this.invalidateLayout(); }

  get actualSpacing(): number { return this._actualSpacing; }

  get actualCenter(): Point { return this._actualCenter; }

  /**
   * 官方 4.0 的这些枚举是**数字**（go.d.ts: CircularArrangement 0..3、CircularDirection 10..13、
   * CircularSorting 20..24、CircularNodeDiameterFormula 30..31），官方样例也是直接写数字或
   * go.CircularArrangement.Packed。本项目内部用 EnumValue 对象，所以要把两边都接受。
   */
  private _enum(val: EnumValue | number | null | undefined, values: Map<number, EnumValue>): EnumValue {
    const first = values.values().next().value as EnumValue;
    if (val === null || val === undefined) return first;
    if (typeof val === 'number') {
      const found = values.get(val);
      return found || first;
    }
    // 已经是 EnumValue：确认它属于该枚举，不属于就取第一个
    for (const v of values.values()) if (v === val) return val;
    return first;
  }

  copy(): CircularLayout {
    const copy = new (this.constructor as new () => any)();
    this.cloneProtected(copy);
    copy._radius = this._radius;
    copy._startAngle = this._startAngle;
    copy._sweepAngle = this._sweepAngle;
    copy._arrangement = this._arrangement;
    copy._spacing = this._spacing;
    copy._direction = this._direction;
    copy._aspectRatio = this._aspectRatio;
    copy._sorting = this._sorting;
    copy._comparer = this._comparer;
    copy._nodeDiameterFormula = this._nodeDiameterFormula;
    return copy;
  }

  doLayout(coll: any): void {
    const parts = this.collectParts(coll);
    if (parts.count === 0) return;

    // Build network
    const net = this.makeNetwork(coll);
    if (net.vertexes.count === 0) return;
    // 官方在 commitNodes()/commitLinks() 之前把 network 挂上、结束后才置空。
    // 样例（friendWheel 的 WheelLayout 等）在覆写里遍历 this.network.vertexes/edges，
    // 这里不设的话它们拿到 null，径向旋转与 link.curviness 全部失效。
    this.network = net;

    // 官方 CircularLayout.doLayout **不拆连通分量**：`splitIntoSubNetworks` 只被
    // ForceDirectedLayout 使用，官方直接把 network.vertexes 全部放进同一个环
    // （H4 排序+算半径 → Iw/Ow/Ew 排布）。此前按分量拆分再横向排开是自造逻辑：
    // arrowheads 样例（Center 节点 isLayoutPositioned:false 被 canLayout 排除、
    // 40 条 link 端点解析为 null 不建边）会得到 40 个孤立顶点 → 40 个单点分量 →
    // 被排成一条水平直线；官方则是一个 40 点的环（半径按 Σ(直径+spacing)/2π
    // 从 100 生长到 257.83）。
    const origin = this.arrangementOrigin;
    this._layoutComponent(net, origin.x, origin.y);

    // 本方法不再破坏性拆分：this.network 自始至终持有全部顶点/边（官方语义），
    // 样例覆写（friendWheel 等）依赖这一点。
    this._lastSubNetworks = null;

    // 官方 CircularLayout.doLayout 的收尾就是这两步：`updateParts()` → commitNodes →
    // commitLinks。样例覆写 commitNodes/commitLinks（friendWheel 用前者做径向旋转、
    // 后者给 link.curviness 赋值）必须能跑在官方流程上，否则径向文字和贝塞尔连线都做不出来。
    this.commitNodes();
    this.commitLinks();
    this.network = null;

    this.isValidLayout = true;
  }

  /**
   * Layout a single connected component in a circle.
   */
  private _layoutComponent(net: LayoutNetwork, centerX: number, centerY: number): void {
    const vertexes: LayoutVertex[] = [];
    const vit = net.vertexes.iterator;
    while (vit.next()) {
      vertexes.push(vit.value);
    }

    if (vertexes.length === 0) return;

    // Compute radius if not specified（须在单节点提前返回之前计算，
    // 否则 actualXRadius/actualYRadius 保持 NaN，commitNodes 会把所有节点移成 NaN）
    let radius = this._radius;
    if (isNaN(radius)) {
      radius = this._computeRadius(vertexes);
    }

    const constantDistance = this._arrangement === CircularArrangementConstantDistance ||
      this._arrangement === null || this._arrangement === undefined;

    // 环上的成员只取 isLayoutPositioned 的节点。
    // 非布局定位的节点（如 arrowheads 样例里 isLayoutPositioned:false 的中心大圆）
    // 会因为是 link 端点而进入网络（LayoutNetwork.addLink → addNode），
    // 它巨大的尺寸会把 ConstantDistance 的半径撑大到把整圈节点顶出视口。
    // 它们仍参与连通性（否则各节点会各自成单点分量），但只作为圆心成员，不计入弧长。
    const ringVertexes: LayoutVertex[] = [];
    const hubVertexes: LayoutVertex[] = [];
    for (const v of vertexes) {
      const positioned = !v.node || (v.node as any).isLayoutPositioned !== false;
      if (positioned) ringVertexes.push(v);
      else hubVertexes.push(v);
    }
    const ring = ringVertexes.length >= 2 ? ringVertexes : vertexes;

    // 官方 sorting（H4 里先 v4(t) 排序再算直径和/半径，所以必须放在弧长计算之前，
    // 否则 arcCum 会按旧顺序累加、与重排后的 ring 错位）：
    // Forwards=保持给定顺序，Reverse=反序，Asc/Descending 按 comparer 排序，
    // Optimized=$4+J4（最大基数优先取点 + 最小化连线交叉的插入排序，官方 v4 case24）。
    if (this._sorting === CircularSortingReverse) {
      ring.reverse();
    } else if (this._sorting === CircularSortingAscending || this._sorting === CircularSortingDescending) {
      const cmp = this._comparer || LayoutVertex.smartComparer;
      ring.sort((a, b) => cmp(a.node ? a.node.data : a, b.node ? b.node.data : b));
      if (this._sorting === CircularSortingDescending) ring.reverse();
    } else if (this._sorting === CircularSortingOptimized) {
      const ordered = this._optimizedOrder(ring);
      ring.length = 0;
      for (const v of ordered) ring.push(v);
    }

    // 官方 UR（ConstantDistance）语义：radius 是「最小半径」——
    // 若按该半径摆放后首尾节点仍重叠（弧长不足一整圈），官方会不断增大半径后重排。
    // 官方：radius 只是「最小半径」。ConstantSpacing/ConstantDistance 下如果给定半径
    // 装不下整圈（弧长不足一整圈），官方会增大半径后重排。
    const growsWithArc = this._arrangement === CircularArrangementConstantDistance ||
      this._arrangement === CircularArrangementConstantSpacing ||
      this._arrangement === null || this._arrangement === undefined;
    if (growsWithArc && this._sweepAngle >= 360 && ring.length > 0) {
      // 每个节点在圆周上占的弧长 = 有效直径 + spacing。
      // 周长必须正好等于 N 个节点的弧长之和，这样 N 步（每步 arc_i/radius）绕行一圈
      // 恰好回到起点；若多算一份（比如把首节点再加一次），圆周会按 N+1 个节点铺满，
      // 实际只放 N 个节点就会在收尾处留下一个空位。
      let totalArc = 0;
      for (const v of ring) {
        totalArc += this._effectiveDiameter(v) + this._spacing;
      }
      const needed = totalArc / (2 * Math.PI);
      if (needed > radius) radius = needed;
    }

    // Store the actual radii used (aspectRatio scales the Y axis).
    this._actualXRadius = radius;
    this._actualYRadius = radius * this._aspectRatio;
    this._actualSpacing = this._spacing;

    // 非环成员（中心节点）放到圆心；commit 时加上圆心偏移正好落在 actualCenter
    for (const v of hubVertexes) {
      v.x = centerX;
      v.y = centerY;
    }

    // Single node - just place at center
    if (ring.length === 1) {
      const v = ring[0];
      v.x = centerX;
      v.y = centerY;
      return;
    }

    // Determine direction multiplier
    const clockwise = this._direction === CircularDirectionClockwise;
    const dirMult = clockwise ? 1 : -1;

    // Compute angular spacing based on arrangement
    const startRad = (this._startAngle * Math.PI) / 180;
    const sweepRad = (this._sweepAngle * Math.PI) / 180;

    // ConstantDistance 用累积弧长换算角度（节点尺寸不同时也能均匀铺满整圈）。
    // 注意：这里必须无条件算出来——下面 default 分支会用到它，
    // 只在 constantDistance 时算会让其它 arrangement 拿到 undefined，角度变成 NaN。
    const arcCum: number[] = [];
    {
      let acc = 0;
      for (const v of ring) {
        arcCum.push(acc);
        acc += this._effectiveDiameter(v) + this._spacing;
      }
    }

    // Position each vertex
    for (let i = 0; i < ring.length; i++) {
      const v = ring[i];
      let angle: number;

      switch (this._arrangement) {
        case CircularArrangementConstantAngle: {
          // Equal angular spacing
          angle = startRad + dirMult * (sweepRad * i / ring.length);
          break;
        }
        case CircularArrangementConstantRadius: {
          // Constant radius but adjusted angular spacing based on node size
          angle = startRad + dirMult * (sweepRad * i / ring.length);
          break;
        }
        case CircularArrangementPacked: {
          // Pack nodes tightly along the circle
          angle = startRad + dirMult * (sweepRad * i / ring.length);
          break;
        }
        case CircularArrangementConstantSpacing:
        case CircularArrangementConstantDistance:
        default: {
          // Constant arc distance between nodes
          angle = startRad + dirMult * (arcCum[i] / radius);
          break;
        }
      }

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle) * this._aspectRatio;

      v.x = x - v.width / 2;
      v.y = y - v.height / 2;
      // 官方在排列阶段就写好 actualAngle（度）与 centerX/centerY，
      // 样例（如 friendWheel 的 WheelLayout.commitNodes）据此把节点旋转成径向、
      // 并把文字翻正。少了这一步 v.actualAngle 恒为 0，文字就不会沿法线排布。
      v.actualAngle = (angle * 180) / Math.PI;
      // centerX/centerY 在本项目里是 `bounds + focus` 的派生量，写它会反推
      // bounds.x/y（官方 centerX setter 语义），把上面刚摆好的左上角覆盖掉。
      // 官方 CircularLayout 的排列阶段只写 centerX/centerY、由 commitNodes 推位置；
      // 我们这里反过来 —— 先定左上角，故把 focus 设为半尺寸，使 centerX ≡ x，
      // 这样再写 centerX/centerY 就是幂等的，不再扰动已摆好的位置。
      v.focus.setTo(v.width / 2, v.height / 2);
      v.centerX = x;
      v.centerY = y;
    }
  }

  /**
   * Compute an appropriate radius based on the vertex sizes and spacing.
   */
  /** 官方 nodeDiameterFormula：默认 Pythagorean = sqrt(w²+h²)，Circular 取较长边 */
  private _effectiveDiameter(v: LayoutVertex): number {
    if (this._nodeDiameterFormula === CircularNodeDiameterFormulaCircular) {
      return Math.max(v.width, v.height);
    }
    return Math.sqrt(v.width * v.width + v.height * v.height);
  }

  /**
   * 官方 Qk(...)：周长 / 2π。
   * ConstantSpacing/Packed 用 Σ有效直径 + 间隙数×spacing（间隙数在整圈时等于节点数），
   * 这与官方对 4 个 25px 节点给出的 r=26.33 完全一致。
   */
  private _computeRadius(vertexes: LayoutVertex[]): number {
    const d = vertexes.length;
    if (d <= 0) return 50;
    let c = 0;
    for (const v of vertexes) c += this._effectiveDiameter(v);
    const h = this._spacing;
    const perGap = this._arrangement === CircularArrangementPacked ? h * 1.6 : h;
    const gaps = this._sweepAngle >= 360 ? d : d - 1;
    return (c + gaps * perGap) / (2 * Math.PI);
  }

  // ============ 官方 CircularLayout sorting=Optimized：$4 + J4 + Z4（v4 case 24） ============

  /** 官方 `v4` case 24：`J4($4(t))`。 */
  private _optimizedOrder(t: LayoutVertex[]): LayoutVertex[] {
    const picks = this._mcs4(t);
    const ordered: LayoutVertex[] = [];
    for (const i of picks) ordered.push(t[i]);
    return this._j4(ordered);
  }

  /**
   * 官方 `$4(t)`：最大基数贪心取点，返回选中的**下标**序列。
   * 首个取 edgesCount 最大者；此后取「已选中顶点的邻居计数」最大者（并列取下标最小者）。
   * 选中后标记 -1（不再参与选择），并给尚未选中的邻居计数 +1。
   * 无边网络所有计数恒 0、-1 挡住已选者 → 严格大于比较下退化为**原顺序**
   * （arrowheads 样例 40 个孤立顶点即此情形，官方实测也是原序）。
   */
  private _mcs4(t: LayoutVertex[]): number[] {
    const n = t.length;
    const counts: number[] = new Array(n).fill(0);
    const out: number[] = [];
    for (let s = 0; s < n; s++) {
      let best = -1;
      let bestVal = -1;
      if (s === 0) {
        for (let c = 0; c < n; c++) {
          const u = t[c].edgesCount;
          if (u > bestVal) { bestVal = u; best = c; }
        }
      } else {
        for (let c = 0; c < n; c++) {
          const f = counts[c];
          if (f > bestVal) { bestVal = f; best = c; }
        }
      }
      if (best < 0) break;
      out.push(best);
      counts[best] = -1;
      const v = t[best];
      const bump = (other: LayoutVertex | null): void => {
        if (!other) return;
        const l = t.indexOf(other);
        if (l >= 0 && counts[l] >= 0) counts[l]++;
      };
      let it = v.sourceEdges.iterator;
      while (it.next()) bump(it.value.fromVertex);
      it = v.destinationEdges.iterator;
      while (it.next()) bump(it.value.toVertex);
    }
    return out;
  }

  /**
   * 官方 `J4(t)`：按「插入后交叉数最小」把顶点排成链（t 是 $4 输出的顶点序，以下标操作）。
   * 度=0 的顶点直接按原序入结果；度=1 的顶点挂链后补插；度≥2 的顶点在链上按候选位置
   * 的 Z4 交叉计数 + 圆周距离平局裁决胜出后插入。无边网络 → 全部度=0 → 恒等输出。
   */
  private _j4(t: LayoutVertex[]): LayoutVertex[] {
    const idxOf = (v: LayoutVertex | null): number => (v ? t.indexOf(v) : -1);
    const nbr: number[][] = [];
    for (let f = 0; f < t.length; f++) {
      const adj: number[] = [];
      const push = (other: LayoutVertex | null): void => {
        const d = idxOf(other);
        if (d >= 0 && d !== f && adj.indexOf(d) < 0) adj.push(d);
      };
      let it = t[f].destinationEdges.iterator;
      while (it.next()) push(it.value.toVertex);
      it = t[f].sourceEdges.iterator;
      while (it.next()) push(it.value.fromVertex);
      nbr.push(adj);
    }
    const e: number[] = new Array(t.length).fill(0); // 顶点在链中的位置
    const s: number[] = []; // 链（顶点下标）
    const n: number[] = []; // 已记录链边的两端（顶点下标）
    const o: number[] = [];
    const r: number[] = []; // 度=1 的顶点（下标）
    const l: LayoutVertex[] = []; // 输出
    let h = 0;
    for (let f = 0; f < t.length; f++) {
      const u = nbr[f].length;
      if (u === 1) { r.push(f); continue; }
      if (u === 0) { l.push(t[f]); continue; }
      if (h === 0) { s.push(f); h++; continue; }
      let dBest = Infinity;
      let mBest = Infinity;
      let g = -1;
      const p: number[] = [];
      for (let y = 0; y < s.length; y++) {
        if (nbr[s[y]].indexOf(s[(y + 1) % s.length]) < 0) p.push((y + 1) % s.length);
      }
      if (p.length === 0) {
        for (let y = 0; y < s.length; y++) p.push(y);
      }
      for (let y = 0; y < p.length; y++) {
        const x = p[y];
        const b = this._z4(nbr[f], n, o, e, x, s);
        let S = 0;
        for (let k = 0; k < nbr[f].length; k++) {
          const P = nbr[f][k];
          const A = s.indexOf(P);
          if (A >= 0) {
            const N = Math.abs(x - (A >= x ? A + 1 : A));
            S += N < s.length + 1 - N ? N : s.length + 1 - N;
          }
        }
        for (let k = 0; k < n.length; k++) {
          let P = e[n[k]];
          let A = e[o[k]];
          if (P >= x) P++;
          if (A >= x) A++;
          if (P > A) { const tmp = A; A = P; P = tmp; }
          if ((A - P < (s.length + 2) / 2) === (P < x && x <= A)) S++;
        }
        if (b < dBest || (b === dBest && S < mBest)) { dBest = b; mBest = S; g = x; }
      }
      s.splice(g, 0, f);
      for (let y = 0; y < s.length; y++) e[s[y]] = y;
      for (let y = 0; y < nbr[f].length; y++) {
        const x = nbr[f][y];
        if (s.indexOf(x) >= 0) { n.push(f); o.push(x); }
      }
      h++;
    }
    // 官方：度=1 顶点按其唯一邻居两侧的支路方向求和决定插在邻居前还是后，
    // 邻居不在链上的先压队尾，直到全部入链。
    const c = s.length;
    for (; ;) {
      let a = true;
      for (let f = 0; f < r.length; f++) {
        const u = r[f];
        const dv = nbr[u][0];
        const m = s.indexOf(dv);
        if (m >= 0) {
          let g = 0;
          for (let p2 = 0; p2 < nbr[dv].length; p2++) {
            const y = nbr[dv][p2];
            const x = s.indexOf(y);
            if (x < 0 || x === m) continue;
            const b = x > m ? x - m : m - x;
            const S = c - b;
            g += (x < m) !== (b > S) ? 1 : -1;
          }
          s.splice(g < 0 ? m : m + 1, 0, u);
          r.splice(f, 1);
          f--;
        } else {
          a = false;
        }
      }
      if (a) break;
      s.push(r[0]);
      r.splice(0, 1);
    }
    for (let f = 0; f < s.length; f++) l.push(t[s[f]]);
    return l;
  }

  /**
   * 官方 `Z4(t, i, e, s, n, o)`：候选顶点插入链位置 n 时与**已成链的边**产生的交叉数。
   * t=候选的邻接下标；i/o=已记录边的两端（顶点下标）；s=位置数组（顶点下标→链位置）；
   * n=候选链位置；o=链（顶点下标数组）。跨过候选位置的边看「链上邻点在区间外」，
   * 不跨的边看「链上邻点在区间内」，逐个累加。
   */
  private _z4(t: number[], i: number[], e: number[], s: number[], n: number, o: number[]): number {
    let r = 0;
    for (let l = 0; l < i.length; l++) {
      const h = i[l];
      const a = e[l];
      const c = s[h];
      const f = s[a];
      const u = c < f ? c : f;
      const d = c < f ? f : c;
      if (u < n && n <= d) {
        for (let m = 0; m < t.length; m++) {
          const g = t[m];
          if (o.indexOf(g) < 0) continue;
          const pg = s[g];
          if (!(u < pg && pg < d) && u !== pg && d !== pg) r++;
        }
      } else {
        for (let m = 0; m < t.length; m++) {
          const g = t[m];
          if (o.indexOf(g) < 0) continue;
          const pg = s[g];
          if (u < pg && pg < d && u !== pg && d !== pg) r++;
        }
      }
    }
    return r;
  }

  // ============ 官方 CircularLayout.commitNodes/commitLinks（阶段 7） ============
  commitNodes(): void {
    // 官方：e = this.actualCenter（非拷贝），非 isOffset 时 e.x/y = arrangementOrigin + actual 半径，
    // 随后 vertex 坐标加上 e。官方在 isOffset 时改用 new Point(0,0)。
    const e = this._actualCenter;
    e.x = this.arrangementOrigin.x + (isNaN(this._actualXRadius) ? 0 : this._actualXRadius);
    e.y = this.arrangementOrigin.y + (isNaN(this._actualYRadius) ? 0 : this._actualYRadius);
    for (const net of this._commitNetworks()) {
      const it = net.vertexes.iterator;
      while (it.next()) {
        const v = it.value;
        const nx = v.x + e.x;
        const ny = v.y + e.y;
        if (v.node && !v._isArtificial) v.node.move(new Point(nx, ny));
      }
    }
  }

  /** 提交时要遍历的网络：有子网络就遍历子网络，否则遍历主网络 */
  private _commitNetworks(): LayoutNetwork[] {
    const out: LayoutNetwork[] = [];
    if (this._lastSubNetworks) {
      const sit = this._lastSubNetworks.iterator;
      while (sit.next()) out.push(sit.value);
    } else if (this.network !== null) {
      out.push(this.network);
    }
    return out;
  }

  commitLinks(): void {
    for (const net of this._commitNetworks()) {
      const it = net.edges.iterator;
      while (it.next()) {
        const e = it.value;
        if (e.link) e.link.updateRoute();
      }
    }
  }

  // ============ 官方 CircularLayout 静态枚举（对齐 go.d.ts，阶段 7） ============
  static ConstantSpacing = CircularArrangementConstantSpacing;
  static ConstantDistance = CircularArrangementConstantDistance;
  static ConstantAngle = CircularArrangementConstantAngle;
  static Packed = CircularArrangementPacked;
  static Clockwise = CircularDirectionClockwise;
  static Counterclockwise = CircularDirectionCounterclockwise;
  static BidirectionalLeft = CircularDirectionBidirectionalLeft;
  static BidirectionalRight = CircularDirectionBidirectionalRight;
  static Forwards = CircularSortingForwards;
  static Reverse = CircularSortingReverse;
  static Ascending = CircularSortingAscending;
  static Descending = CircularSortingDescending;
  static Optimized = CircularSortingOptimized;
  static Pythagorean = CircularNodeDiameterFormulaPythagorean;
  static Circular = CircularNodeDiameterFormulaCircular;
}
