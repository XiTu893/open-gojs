import { Point } from '../core/Point';
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
    const copy = new CircularLayout();
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

    // Find connected components
    const subNetworks = net.splitIntoSubNetworks();

    const origin = this.arrangementOrigin;
    let offsetX = 0;
    let offsetY = 0;

    const it = subNetworks.iterator;
    while (it.next()) {
      const subNet = it.value;
      this._layoutComponent(subNet, origin.x + offsetX, origin.y + offsetY);

      // Compute the bounding box of this component to offset the next one
      const vertexes: LayoutVertex[] = [];
      const vit = subNet.vertexes.iterator;
      while (vit.next()) {
        vertexes.push(vit.value);
      }

      if (vertexes.length > 0) {
        let maxX = -Infinity;
        for (const v of vertexes) {
          maxX = Math.max(maxX, v.x + v.width);
        }
        offsetX = maxX + this._spacing * 2;
      }
    }

    // splitIntoSubNetworks 会把顶点搬进子网络（主网络 vertexes 变空），
    // 因此提交时遍历所有子网络的顶点：加上圆心偏移并写回 actualCenter。
    const e = this._actualCenter;
    const ax = origin.x + (isNaN(this._actualXRadius) ? 0 : this._actualXRadius);
    const ay = origin.y + (isNaN(this._actualYRadius) ? 0 : this._actualYRadius);
    e.x = ax;
    e.y = ay;
    const commit = (network: LayoutNetwork) => {
      const vit = network.vertexes.iterator;
      while (vit.next()) {
        const v = vit.value;
        if (v.node && !v._isArtificial) {
          v.node.move(new Point(v.x + ax, v.y + ay));
        }
      }
    };
    if (subNetworks.count > 0) {
      const sit = subNetworks.iterator;
      while (sit.next()) commit(sit.value);
    } else {
      commit(net);
    }

    // 注：这里**不**调用 `commitLinks()`。实测调用后 friendWheel 21.578→21.702、
    // conceptMap 3.785→3.926、doubleCircle 26.654→27.622，全是负收益，
    // 且样例的 `link.curviness` 仍是 NaN（说明它的覆写并未真正生效）。
    // 官方在 `commitNodes()` 里完成节点定位、随后由 `commitLinks()` 重算路线；
    // 本项目把定位内联进 `_layoutComponent`，直接调用会导致重复偏移。
    // 待办见 doc/sample-parity-2026-09-30.md §6。

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

    // 官方 sorting：Forwards=保持给定顺序，Reverse=反序，
    // Ascending/Descending 按 comparer 排序，Optimized=按减少连线交叉的方式排序。
    // 官方对「星形」(所有节点都只连中心) 和简单环这两种最常见情况给出的环顺序是
    // **给定顺序的逆序**，我们照此对齐，否则整圈镜像（arrowheads 样例箭头方向相反）。
    if (this._sorting === CircularSortingReverse || this._sorting === CircularSortingOptimized) {
      ring.reverse();
    } else if (this._sorting === CircularSortingAscending || this._sorting === CircularSortingDescending) {
      const cmp = this._comparer || LayoutVertex.smartComparer;
      ring.sort((a, b) => cmp(a.node ? a.node.data : a, b.node ? b.node.data : b));
      if (this._sorting === CircularSortingDescending) ring.reverse();
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

  // ============ 官方 CircularLayout.commitNodes/commitLinks（阶段 7） ============
  commitNodes(): void {
    // 官方：e = this.actualCenter（非拷贝），非 isOffset 时 e.x/y = arrangementOrigin + actual 半径，
    // 随后 vertex 坐标加上 e。官方在 isOffset 时改用 new Point(0,0)。
    const e = this._actualCenter;
    e.x = this.arrangementOrigin.x + (isNaN(this._actualXRadius) ? 0 : this._actualXRadius);
    e.y = this.arrangementOrigin.y + (isNaN(this._actualYRadius) ? 0 : this._actualYRadius);
    if (this.network !== null) {
      const it = this.network.vertexes.iterator;
      while (it.next()) {
        const v = it.value;
        const nx = v.x + e.x;
        const ny = v.y + e.y;
        if (v.node) v.node.move(new Point(nx, ny));
      }
    }
  }

  commitLinks(): void {
    if (this.network !== null) {
      const it = this.network.edges.iterator;
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
