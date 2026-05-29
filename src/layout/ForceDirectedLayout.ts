import { Point } from '../core/Point';
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

  private _maxIterations: number = 300;
  private _defaultSpringLength: number = 50;
  private _defaultSpringStiffness: number = 0.05;
  private _defaultElectricalCharge: number = 150;
  private _defaultGravity: number = 0.1;
  private _infinityDistance: number = 1000;
  private _epsilon: number = 0.01;

  get maxIterations(): number { return this._maxIterations; }
  set maxIterations(val: number) { this._maxIterations = val; }

  get defaultSpringLength(): number { return this._defaultSpringLength; }
  set defaultSpringLength(val: number) { this._defaultSpringLength = val; }

  get defaultSpringStiffness(): number { return this._defaultSpringStiffness; }
  set defaultSpringStiffness(val: number) { this._defaultSpringStiffness = val; }

  get defaultElectricalCharge(): number { return this._defaultElectricalCharge; }
  set defaultElectricalCharge(val: number) { this._defaultElectricalCharge = val; }

  get defaultGravity(): number { return this._defaultGravity; }
  set defaultGravity(val: number) { this._defaultGravity = val; }

  get infinityDistance(): number { return this._infinityDistance; }
  set infinityDistance(val: number) { this._infinityDistance = val; }

  get epsilon(): number { return this._epsilon; }
  set epsilon(val: number) { this._epsilon = val; }

  copy(): ForceDirectedLayout {
    const copy = new ForceDirectedLayout();
    copy._arrangementOrigin = this._arrangementOrigin.copy();
    copy._maxIterations = this._maxIterations;
    copy._defaultSpringLength = this._defaultSpringLength;
    copy._defaultSpringStiffness = this._defaultSpringStiffness;
    copy._defaultElectricalCharge = this._defaultElectricalCharge;
    copy._defaultGravity = this._defaultGravity;
    copy._infinityDistance = this._infinityDistance;
    copy._epsilon = this._epsilon;
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
    this._initializePositions(vertexes, net);

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

    // Normalize positions to origin
    let minX = Infinity, minY = Infinity;
    for (const v of vertexes) {
      minX = Math.min(minX, v.x);
      minY = Math.min(minY, v.y);
    }

    // Commit positions
    for (const v of vertexes) {
      if (v.node && !v._isArtificial) {
        const x = origin.x + (v.x - minX);
        const y = origin.y + (v.y - minY);
        v.node.move(new Point(x, y));
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
    }
  }
}
