import { Point } from '../core/Point';
import { EnumValue } from '../core/EnumValues';
import {
  CircularArrangementConstantDistance, CircularArrangementConstantAngle,
  CircularArrangementConstantRadius, CircularArrangementPacked,
  CircularDirectionClockwise, CircularDirectionBidirectionalLeft, CircularDirectionBidirectionalRight,
  CircularNodeDiameterFormulaCircular
} from '../core/EnumValues';
import { Node } from '../view/Node';
import { Layout } from './Layout';
import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';

/**
 * CircularLayout - arranges nodes in a circle or circular pattern.
 */
export class CircularLayout extends Layout {

  private _radius: number = NaN;
  private _startAngle: number = 0;
  private _sweepAngle: number = 360;
  private _arrangement: EnumValue = CircularArrangementConstantDistance;
  private _spacing: number = 20;
  private _direction: EnumValue = CircularDirectionClockwise;
  private _aspectRatio: number = 1;

  get radius(): number { return this._radius; }
  set radius(val: number) { this._radius = val; }

  get startAngle(): number { return this._startAngle; }
  set startAngle(val: number) { this._startAngle = val; }

  get sweepAngle(): number { return this._sweepAngle; }
  set sweepAngle(val: number) { this._sweepAngle = val; }

  get arrangement(): EnumValue { return this._arrangement; }
  set arrangement(val: EnumValue) { this._arrangement = val; }

  get spacing(): number { return this._spacing; }
  set spacing(val: number) { this._spacing = val; }

  get direction(): EnumValue { return this._direction; }
  set direction(val: EnumValue) { this._direction = val; }

  get aspectRatio(): number { return this._aspectRatio; }
  set aspectRatio(val: number) { this._aspectRatio = val; }

  copy(): CircularLayout {
    const copy = new CircularLayout();
    copy._arrangementOrigin = this._arrangementOrigin.copy();
    copy._radius = this._radius;
    copy._startAngle = this._startAngle;
    copy._sweepAngle = this._sweepAngle;
    copy._arrangement = this._arrangement;
    copy._spacing = this._spacing;
    copy._direction = this._direction;
    copy._aspectRatio = this._aspectRatio;
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

    // Single node - just place at center
    if (vertexes.length === 1) {
      const v = vertexes[0];
      v.x = centerX;
      v.y = centerY;
      if (v.node) {
        v.node.move(new Point(v.x, v.y));
      }
      return;
    }

    // Compute radius if not specified
    let radius = this._radius;
    if (isNaN(radius)) {
      radius = this._computeRadius(vertexes);
    }

    // Determine direction multiplier
    const clockwise = this._direction === CircularDirectionClockwise;
    const dirMult = clockwise ? 1 : -1;

    // Compute angular spacing based on arrangement
    const startRad = (this._startAngle * Math.PI) / 180;
    const sweepRad = (this._sweepAngle * Math.PI) / 180;

    // Position each vertex
    for (let i = 0; i < vertexes.length; i++) {
      const v = vertexes[i];
      let angle: number;

      switch (this._arrangement) {
        case CircularArrangementConstantAngle: {
          // Equal angular spacing
          angle = startRad + dirMult * (sweepRad * i / vertexes.length);
          break;
        }
        case CircularArrangementConstantRadius: {
          // Constant radius but adjusted angular spacing based on node size
          angle = startRad + dirMult * (sweepRad * i / vertexes.length);
          break;
        }
        case CircularArrangementPacked: {
          // Pack nodes tightly along the circle
          angle = startRad + dirMult * (sweepRad * i / vertexes.length);
          break;
        }
        case CircularArrangementConstantDistance:
        default: {
          // Constant arc distance between nodes
          const nodeSize = Math.max(v.width, v.height);
          const arcLength = nodeSize + this._spacing;
          const angleStep = arcLength / radius;
          angle = startRad + dirMult * angleStep * i;
          break;
        }
      }

      const x = centerX + radius * Math.cos(angle) * this._aspectRatio;
      const y = centerY + radius * Math.sin(angle);

      v.x = x - v.width / 2;
      v.y = y - v.height / 2;

      if (v.node) {
        v.node.move(new Point(v.x, v.y));
      }
    }
  }

  /**
   * Compute an appropriate radius based on the vertex sizes and spacing.
   */
  private _computeRadius(vertexes: LayoutVertex[]): number {
    let totalSize = 0;
    for (const v of vertexes) {
      totalSize += Math.max(v.width, v.height) + this._spacing;
    }
    // Circumference = 2 * PI * r, so r = circumference / (2 * PI)
    const circumference = totalSize;
    return Math.max(circumference / (2 * Math.PI), 50);
  }

  static Circular = CircularNodeDiameterFormulaCircular;
}
