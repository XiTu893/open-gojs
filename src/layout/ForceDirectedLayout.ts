import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Node } from '../view/Node';
import { Layout } from './Layout';
import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';
import { LayoutEdge } from './LayoutEdge';

/**
 * ForceDirectedLayout - positions nodes using a force-directed (spring-electric) algorithm.
 * Nodes repel each other (electrical charge), edges attract connected nodes (springs),
 * and gravity pulls nodes toward the center.
 */
export class ForceDirectedLayout extends Layout {
  static readonly className: string = "ForceDirectedLayout";

  /** 官方 `ForceDirectedLayout.constructor(init?)`：`t && Object.assign(this, t)` */
  constructor(init?: any) {
    super();
    if (init) Object.assign(this, init);
  }

  private _maxIterations: number = 300;
  private _defaultSpringLength: number = 50;
  private _defaultSpringStiffness: number = 0.05;
  private _defaultElectricalCharge: number = 150;
  private _defaultGravity: number = 0.1;
  private _infinityDistance: number = 1000;
  private _epsilon: number = 0.01;
  private _arrangementSpacing: Size = new Size(4, 4);
  private _arrangesToOrigin: boolean = true;
  private _defaultGravitationalMass: number = 0;
  private _theta: number = 0.9;
  private _setsPortSpots: boolean = true;
  private _springLength: number = NaN;
  private _springStiffness: number = NaN;
  private _randomNumberGenerator: (() => number) | null = null;
  private _electricalCharge: number = NaN;
  private _gravitationalMass: number = NaN;
  private _currentIteration: number = 0;
  private _comments: boolean = false;
  private _maxPrelayoutIterations: number = 100;
  private _epsilonDistance: number = 1;
  private _moveLimit: number = Infinity;
  private _defaultCommentSpringLength: number = 10;
  private _defaultCommentElectricalCharge: number = 5;
  private _prelayoutQuality: number = NaN;
  private _prelayoutSpread: number = 10;

  get maxIterations(): number { return this._maxIterations; }
  set maxIterations(val: number) { this._maxIterations = val; this.invalidateLayout(); }

  get defaultSpringLength(): number { return this._defaultSpringLength; }
  set defaultSpringLength(val: number) { this._defaultSpringLength = val; this.invalidateLayout(); }

  get defaultSpringStiffness(): number { return this._defaultSpringStiffness; }
  set defaultSpringStiffness(val: number) { this._defaultSpringStiffness = val; this.invalidateLayout(); }

  get defaultElectricalCharge(): number { return this._defaultElectricalCharge; }
  set defaultElectricalCharge(val: number) { this._defaultElectricalCharge = val; this.invalidateLayout(); }

  get defaultGravity(): number { return this._defaultGravity; }
  set defaultGravity(val: number) { this._defaultGravity = val; }

  get infinityDistance(): number { return this._infinityDistance; }
  set infinityDistance(val: number) { this._infinityDistance = val; }

  get epsilon(): number { return this._epsilon; }
  set epsilon(val: number) { this._epsilon = val; }

  get arrangementSpacing(): Size { return this._arrangementSpacing; }
  set arrangementSpacing(val: Size) { this._arrangementSpacing = val.copy(); this.invalidateLayout(); }

  get arrangesToOrigin(): boolean { return this._arrangesToOrigin; }
  set arrangesToOrigin(val: boolean) { this._arrangesToOrigin = val; }

  get defaultGravitationalMass(): number { return this._defaultGravitationalMass; }
  set defaultGravitationalMass(val: number) { this._defaultGravitationalMass = val; }

  get theta(): number { return this._theta; }
  set theta(val: number) { this._theta = val; }

  get setsPortSpots(): boolean { return this._setsPortSpots; }
  set setsPortSpots(val: boolean) { this._setsPortSpots = val; }

  get springLength(): number { return this._springLength; }
  set springLength(val: number) { this._springLength = val; this.invalidateLayout(); }

  get springStiffness(): number { return this._springStiffness; }
  set springStiffness(val: number) { this._springStiffness = val; this.invalidateLayout(); }

  get randomNumberGenerator(): (() => number) | null { return this._randomNumberGenerator; }
  set randomNumberGenerator(val: (() => number) | null) { this._randomNumberGenerator = val; }

  get electricalCharge(): number { return this._electricalCharge; }
  set electricalCharge(val: number) { this._electricalCharge = val; }

  get gravitationalMass(): number { return this._gravitationalMass; }
  set gravitationalMass(val: number) { this._gravitationalMass = val; }

  get currentIteration(): number { return this._currentIteration; }

  get comments(): boolean { return this._comments; }
  set comments(val: boolean) { this._comments = val; }

  get maxPrelayoutIterations(): number { return this._maxPrelayoutIterations; }
  set maxPrelayoutIterations(val: number) { this._maxPrelayoutIterations = val; this.invalidateLayout(); }

  get epsilonDistance(): number { return this._epsilonDistance; }
  set epsilonDistance(val: number) { this._epsilonDistance = val; this.invalidateLayout(); }

  get moveLimit(): number { return this._moveLimit; }
  set moveLimit(val: number) { this._moveLimit = val; this.invalidateLayout(); }

  get defaultCommentSpringLength(): number { return this._defaultCommentSpringLength; }
  set defaultCommentSpringLength(val: number) { this._defaultCommentSpringLength = val; this.invalidateLayout(); }

  get defaultCommentElectricalCharge(): number { return this._defaultCommentElectricalCharge; }
  set defaultCommentElectricalCharge(val: number) { this._defaultCommentElectricalCharge = val; this.invalidateLayout(); }

  get prelayoutQuality(): number { return this._prelayoutQuality; }
  set prelayoutQuality(val: number) { this._prelayoutQuality = val; this.invalidateLayout(); }

  get prelayoutSpread(): number { return this._prelayoutSpread; }
  set prelayoutSpread(val: number) { this._prelayoutSpread = val; this.invalidateLayout(); }

  // ============ 官方 ForceDirectedLayout 阶段 7 补齐的虚钩子/字段方法 ============

  needsPrelayout(): boolean {
    if (this.network === null || this.network.vertexes.count < 3) return false;
    let t = 0;
    const e = this.network.vertexes.first()?.bounds;
    const s = this.network.vertexes.iterator;
    let i = 0;
    for (; s.next(); ) {
      const n = s.value;
      const o = n.bounds;
      if (isNaN(n.x) || isNaN(n.y) || e && o.intersectsRect(e) && (t++, t > 2)) return true;
      if (i > 10) return false;
      i++;
    }
    return false;
  }

  doConnectedSubnetLayout(t: LayoutNetwork): void {
    const it = t.vertexes.iterator;
    while (it.next()) {
      const v = it.value;
      if (v.node) v.node.move(new Point(v.x, v.y));
    }
  }

  computePairwiseDistances(t: LayoutNetwork): number[][] {
    const i = t.vertexes.count;
    const e: number[][] = new Array(i);
    const vertexes: LayoutVertex[] = [];
    const vit = t.vertexes.iterator;
    while (vit.next()) vertexes.push(vit.value);
    for (let r = 0; r < i; r++) {
      e[r] = new Array(i).fill(-1);
      e[r][r] = 0;
    }
    for (let r = 0; r < i; r++) {
      const n = new Map<number, number>();
      const o: LayoutVertex[] = [];
      o.push(vertexes[r]);
      n.set(vertexes[r]._index, 0);
      let l = 0;
      while (l < o.length) {
        const h = o[l++];
        const a = h.sourceEdges.iterator;
        while (a.next()) {
          const c = a.value.toVertex;
          if (c && c !== h && !n.has(c._index)) {
            n.set(c._index, (n.get(h._index) ?? 0) + 1);
            o.push(c);
          }
        }
        const a2 = h.destinationEdges.iterator;
        while (a2.next()) {
          const c = a2.value.fromVertex;
          if (c && c !== h && !n.has(c._index)) {
            n.set(c._index, (n.get(h._index) ?? 0) + 1);
            o.push(c);
          }
        }
      }
      for (let h = 0; h < i; h++) {
        const a = Math.min(e[vertexes[r]._index][h], e[h][vertexes[r]._index]);
        const c = n.get(h) ?? 0;
        if (a < 0 || c < a) {
          e[vertexes[r]._index][h] = c;
          e[h][vertexes[r]._index] = c;
        }
      }
    }
    return e;
  }

  coarsenNetwork(t: LayoutNetwork): LayoutNetwork {
    const i = this.createNetwork();
    const e = new Map<number, LayoutVertex>();
    let s = 0;
    let n = t.vertexes.iterator;
    while (n.next()) {
      n.value._index = s++;
    }
    n = t.vertexes.iterator;
    while (n.next()) {
      const r = n.value;
      if (e.has(r._index)) continue;
      let h = null as LayoutVertex | null;
      const c = i.createVertex();
      c.x = r.x;
      c.y = r.y;
      e.set(r._index, c);
      i.addVertex(c);
      const a = r.sourceEdges.iterator;
      while (a.next()) {
        const f = a.value.toVertex;
        if (f && f !== r && !e.has(f._index) && (h === null || h._index > f._index)) h = f;
      }
      if (h !== null) e.set(h._index, c);
    }
    const o = t.edges.iterator;
    while (o.next()) {
      const r = o.value;
      const l = r.fromVertex ? e.get(r.fromVertex._index) : undefined;
      const h = r.toVertex ? e.get(r.toVertex._index) : undefined;
      if (l === undefined || h === undefined || l === h) continue;
      const a = i.createEdge();
      a.fromVertex = l;
      a.toVertex = h;
      i.addEdge(a);
    }
    return i;
  }

  addComments(v: LayoutVertex): void {
    if (this.network === null) return;
    const node = v.node;
    if (node !== null) {
      const e = node.findNodesConnected() as any;
      while (e.next()) {
        const s = e.value;
        if (s.category !== "Comment" || !s.isVisible()) continue;
        let n = this.network.findVertex(s);
        if (n === null) n = this.network.addNode(s);
        (n as any).charge = this.defaultCommentElectricalCharge;
        let o: LayoutEdge | null = null;
        const r = n.destinationEdges.iterator;
        while (r.next()) {
          const l = r.value;
          if (l.toVertex === v) {
            o = l;
            break;
          }
        }
        if (o === null) {
          const l = n.sourceEdges.iterator;
          while (l.next()) {
            const h = l.value;
            if (h.fromVertex === v) {
              o = h;
              break;
            }
          }
        }
        if (o === null) o = this.network.linkVertexes(v, n);
        if (o !== null) o.length = this.defaultCommentSpringLength;
      }
    }
  }

  moveVertex(v: LayoutVertex): number {
    const fx = (v as any).forceX || 0;
    const fy = (v as any).forceY || 0;
    const s = fx * fx + fy * fy;
    const n = Math.min(this._defaultSpringLength, this._moveLimit);
    const o = Math.max(n, this._epsilonDistance);
    const r = o * o;
    let i = fx, e = fy;
    if (s > r) {
      const l = o / Math.sqrt(s);
      i *= l;
      e *= l;
    }
    v.x += i;
    v.y += e;
    return i * i + e * e;
  }

  shouldInteract(v1: LayoutVertex, v2: LayoutVertex): boolean {
    return true;
  }

  moveFixedVertex(v: LayoutVertex): void {
    // 官方默认空实现：被固定的顶点不移动
  }

  commitNodes(): void {
    if (!this.network) return;
    const it = this.network.vertexes.iterator;
    while (it.next()) {
      const v = it.value;
      if (v.node && !v._isArtificial) v.node.move(new Point(v.x, v.y));
    }
  }

  commitLinks(): void {
    if (!this.network) return;
    const it = this.network.edges.iterator;
    while (it.next()) {
      const e = it.value;
      if (e.link) e.link.updateRoute();
    }
  }

  electricalFieldX(x: number, y: number): number {
    return 0;
  }

  electricalFieldY(x: number, y: number): number {
    return 0;
  }

  gravitationalFieldX(x: number, y: number): number {
    return 0;
  }

  gravitationalFieldY(x: number, y: number): number {
    return 0;
  }

  isFixed(v: LayoutVertex): boolean {
    return !!(v as any).isFixed;
  }

  copy(): ForceDirectedLayout {
    const copy = new (this.constructor as new () => any)();
    this.cloneProtected(copy);
    copy._maxIterations = this._maxIterations;
    copy._defaultSpringLength = this._defaultSpringLength;
    copy._defaultSpringStiffness = this._defaultSpringStiffness;
    copy._defaultElectricalCharge = this._defaultElectricalCharge;
    copy._defaultGravity = this._defaultGravity;
    copy._infinityDistance = this._infinityDistance;
    copy._epsilon = this._epsilon;
    copy._arrangementSpacing = this._arrangementSpacing.copy();
    copy._arrangesToOrigin = this._arrangesToOrigin;
    copy._defaultGravitationalMass = this._defaultGravitationalMass;
    copy._theta = this._theta;
    copy._setsPortSpots = this._setsPortSpots;
    copy._springLength = this._springLength;
    copy._springStiffness = this._springStiffness;
    copy._randomNumberGenerator = this._randomNumberGenerator;
    copy._electricalCharge = this._electricalCharge;
    copy._gravitationalMass = this._gravitationalMass;
    return copy;
  }

  doLayout(coll: any): void {
    const parts = this.collectParts(coll);
    if (parts.count === 0) return;

    // Build network
    const net = this.makeNetwork(coll);
    if (net.vertexes.count === 0) return;

    const vertexes: LayoutVertex[] = [];
    const vit = net.vertexes.iterator;
    while (vit.next()) {
      vertexes.push(vit.value);
    }

    if (vertexes.length === 0) return;

    // Initialize positions if they are all at the same location
    if (this._maxIterations > 0) {
      this._initializePositions(vertexes, net);
    }

    // Force-directed iteration
    const origin = this.arrangementOrigin;

    // Velocity storage for each vertex
    const vx = new Float64Array(vertexes.length);
    const vy = new Float64Array(vertexes.length);

    const dt = 1.0;
    const damping = 0.9;

    for (let iter = 0; iter < this._maxIterations; iter++) {
      // Compute forces
      const fx = new Float64Array(vertexes.length);
      const fy = new Float64Array(vertexes.length);

      // 1. Electrical repulsion between all pairs of nodes
      for (let i = 0; i < vertexes.length; i++) {
        for (let j = i + 1; j < vertexes.length; j++) {
          const vi = vertexes[i];
          const vj = vertexes[j];

          const ci = vi.center;
          const cj = vj.center;

          let dx = cj.x - ci.x;
          let dy = cj.y - ci.y;

          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this._epsilon) dist = this._epsilon;
          if (dist > this._infinityDistance) continue;

          // Coulomb's law: F = k * q1 * q2 / r^2
          const force = this._defaultElectricalCharge * this._defaultElectricalCharge / (dist * dist);

          const fxComp = force * dx / dist;
          const fyComp = force * dy / dist;

          fx[i] -= fxComp;
          fy[i] -= fyComp;
          fx[j] += fxComp;
          fy[j] += fyComp;
        }
      }

      // 2. Spring attraction along edges
      const eit = net.edges.iterator;
      while (eit.next()) {
        const edge = eit.value;
        if (!edge.fromVertex || !edge.toVertex) continue;

        const i = vertexes.indexOf(edge.fromVertex);
        const j = vertexes.indexOf(edge.toVertex);
        if (i < 0 || j < 0) continue;

        const ci = edge.fromVertex.center;
        const cj = edge.toVertex.center;

        let dx = cj.x - ci.x;
        let dy = cj.y - ci.y;

        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this._epsilon) dist = this._epsilon;

        // Hooke's law: F = -k * (dist - restLength)
        const springLength = isNaN(edge.length) ? this._defaultSpringLength : edge.length;
        const force = this._defaultSpringStiffness * (dist - springLength);

        const fxComp = force * dx / dist;
        const fyComp = force * dy / dist;

        fx[i] += fxComp;
        fy[i] += fyComp;
        fx[j] -= fxComp;
        fy[j] -= fyComp;
      }

      // 3. Gravity toward center
      let centerX = 0, centerY = 0;
      for (let i = 0; i < vertexes.length; i++) {
        const c = vertexes[i].center;
        centerX += c.x;
        centerY += c.y;
      }
      centerX /= vertexes.length;
      centerY /= vertexes.length;

      for (let i = 0; i < vertexes.length; i++) {
        const c = vertexes[i].center;
        const dx = centerX - c.x;
        const dy = centerY - c.y;
        fx[i] += dx * this._defaultGravity;
        fy[i] += dy * this._defaultGravity;
      }

      // Update positions with velocity
      let totalMovement = 0;
      for (let i = 0; i < vertexes.length; i++) {
        vx[i] = (vx[i] + fx[i] * dt) * damping;
        vy[i] = (vy[i] + fy[i] * dt) * damping;

        const v = vertexes[i];
        v.x += vx[i] * dt;
        v.y += vy[i] * dt;

        totalMovement += Math.abs(vx[i]) + Math.abs(vy[i]);
      }

      // Early termination if layout has stabilized
      if (totalMovement < this._epsilon * vertexes.length) break;
    }

    // Commit positions
    if (this._maxIterations > 0) {
      // Normalize positions to origin
      let minX = Infinity, minY = Infinity;
      for (const v of vertexes) {
        minX = Math.min(minX, v.x);
        minY = Math.min(minY, v.y);
      }
      for (const v of vertexes) {
        if (v.node && !v._isArtificial) {
          const x = origin.x + (v.x - minX);
          const y = origin.y + (v.y - minY);
          v.node.move(new Point(x, y));
        }
      }
    } else {
      // maxIterations === 0: preserve initial positions
      for (const v of vertexes) {
        if (v.node && !v._isArtificial) {
          v.node.move(new Point(v.x, v.y));
        }
      }
    }

    this.isValidLayout = true;
  }

  /**
   * Initialize vertex positions in a circle if they are all at the same location.
   */
  private _initializePositions(vertexes: LayoutVertex[], net: LayoutNetwork): void {
    // Check if all vertexes are at the same position
    let allSame = true;
    const first = vertexes[0];
    for (let i = 1; i < vertexes.length; i++) {
      if (vertexes[i].x !== first.x || vertexes[i].y !== first.y) {
        allSame = false;
        break;
      }
    }

    if (!allSame) return;

    // Place vertexes in a circle
    const radius = this._defaultSpringLength * Math.sqrt(vertexes.length);
    for (let i = 0; i < vertexes.length; i++) {
      const angle = (2 * Math.PI * i) / vertexes.length;
      vertexes[i].x = radius * Math.cos(angle);
      vertexes[i].y = radius * Math.sin(angle);
      if (vertexes[i].node) {
        (vertexes[i].node as Node).move(new Point(vertexes[i].x, vertexes[i].y));
      }
    }
  }
}
