import { Part } from './Part';
import { GraphObject } from './GraphObject';
import { Panel } from './Panel';
import { Node } from './Node';
import { Point } from '../core/Point';
import { Spot } from '../core/Spot';
import { List } from '../core/List';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { EnumValue } from '../core/EnumValues';
import {
  StretchDefault,
  RoutingNormal, RoutingOrthogonal, RoutingAvoidsNodes,
  CurveNone, CurveBezier, CurveJumpOver, CurveJumpGap,
  PanelLink
} from '../core/EnumValues';

/**
 * Link - a Part that represents a connection between two Nodes.
 */
export class Link extends Part {

  // ============ Private property storage ============
  private _fromNode: Node | null = null;
  private _toNode: Node | null = null;
  private _fromPortId: string = '';
  private _toPortId: string = '';
  // fromSpot and toSpot are inherited from GraphObject
  private _routing: EnumValue = RoutingNormal;
  private _curve: EnumValue = CurveNone;
  private _corner: number = 0;
  private _curviness: number = NaN;
  private _points: List<Point> = new List<Point>();
  private _resegmentable: boolean = false;
  private _adjusting: EnumValue = StretchDefault;
  private _relinkableFrom: boolean = false;
  private _relinkableTo: boolean = false;
  private _reshapable: boolean = false;
  private _jumpOver: number = 8;
  private _jumpGap: number = 8;

  constructor(type?: EnumValue, init?: Partial<Link>) {
    super(type || PanelLink);
    this._className = 'Link';
    if (init) {
      this.set(init);
    }
  }

  // ============ Properties ============

  get fromNode(): Node | null { return this._fromNode; }
  set fromNode(val: Node | null) { this._fromNode = val; }

  get toNode(): Node | null { return this._toNode; }
  set toNode(val: Node | null) { this._toNode = val; }

  get fromPortId(): string { return this._fromPortId; }
  set fromPortId(val: string) { this._fromPortId = val; }

  get toPortId(): string { return this._toPortId; }
  set toPortId(val: string) { this._toPortId = val; }

  // fromSpot and toSpot are inherited from GraphObject

  get routing(): EnumValue { return this._routing; }
  set routing(val: EnumValue) { this._routing = val; }

  get curve(): EnumValue { return this._curve; }
  set curve(val: EnumValue) { this._curve = val; }

  get corner(): number { return this._corner; }
  set corner(val: number) { this._corner = val; }

  get curviness(): number { return this._curviness; }
  set curviness(val: number) { this._curviness = val; }

  get jumpOver(): number { return this._jumpOver; }
  set jumpOver(val: number) { this._jumpOver = val; }

  get jumpGap(): number { return this._jumpGap; }
  set jumpGap(val: number) { this._jumpGap = val; }

  get points(): List<Point> { return this._points; }
  set points(val: List<Point>) { this._points = val; }

  get resegmentable(): boolean { return this._resegmentable; }
  set resegmentable(val: boolean) { this._resegmentable = val; }

  get adjusting(): EnumValue { return this._adjusting; }
  set adjusting(val: EnumValue) { this._adjusting = val; }

  get relinkableFrom(): boolean { return this._relinkableFrom; }
  set relinkableFrom(val: boolean) { this._relinkableFrom = val; }

  get relinkableTo(): boolean { return this._relinkableTo; }
  set relinkableTo(val: boolean) { this._relinkableTo = val; }

  get reshapable(): boolean { return this._reshapable; }
  set reshapable(val: boolean) { this._reshapable = val; }

  // ============ Readonly computed properties ============

  /** Whether this link uses orthogonal routing */
  get isOrthogonal(): boolean {
    return this._routing === RoutingOrthogonal || this._routing === RoutingAvoidsNodes;
  }

  // ============ Methods ============

  /** Get the link connection point on the from port */
  getLinkPointFromPort(port: GraphObject, spot: Spot): Point {
    const bounds = port.getDocumentBounds();
    if (spot.isNone) {
      return bounds.center;
    }
    return new Point(spot.positionInRect(bounds).x, spot.positionInRect(bounds).y);
  }

  /** Get the link connection point on the to port */
  getLinkPointToPort(port: GraphObject, spot: Spot): Point {
    const bounds = port.getDocumentBounds();
    if (spot.isNone) {
      return bounds.center;
    }
    return new Point(spot.positionInRect(bounds).x, spot.positionInRect(bounds).y);
  }

  /** Compute the route points for this link */
  computePoints(): boolean {
    const from = this._fromNode;
    const to = this._toNode;
    if (!from || !to) return false;

    const fromPort = (from as any).findPortWithName ? (from as any).findPortWithName(this._fromPortId) || from : from;
    const toPort = (to as any).findPortWithName ? (to as any).findPortWithName(this._toPortId) || to : to;

    const fromBounds = fromPort.getDocumentBounds();
    const toBounds = toPort.getDocumentBounds();
    const fromCenter = fromBounds.center;
    const toCenter = toBounds.center;

    const fromSpot = this._resolveFromSpot(fromPort);
    const toSpot = this._resolveToSpot(toPort);

    let fromPoint: Point;
    let toPoint: Point;

    if (fromSpot.isNone) {
      fromPoint = this._getEdgeIntersection(fromBounds, fromCenter, toCenter);
    } else {
      const fp = fromSpot.positionInRect(fromBounds);
      fromPoint = new Point(fp.x, fp.y);
    }

    if (toSpot.isNone) {
      toPoint = this._getEdgeIntersection(toBounds, toCenter, fromCenter);
    } else {
      const tp = toSpot.positionInRect(toBounds);
      toPoint = new Point(tp.x, tp.y);
    }

    this._points.clear();
    this._points.add(fromPoint);

    if (this._routing === RoutingOrthogonal) {
      const fromSegLen = (fromPort as any).fromEndSegmentLength || 10;
      const toSegLen = (toPort as any).toEndSegmentLength || 10;

      const fromDir = this._getPortDirection(fromPort, fromSpot, fromPoint, fromCenter);
      const toDir = this._getPortDirection(toPort, toSpot, toPoint, toCenter);

      const fromEnd = this._offsetPoint(fromPoint, fromDir, fromSegLen);
      const toEnd = this._offsetPoint(toPoint, toDir, toSegLen);

      if (fromDir === toDir) {
        const perpDir = this._perpendicularDir(fromDir);
        const midDist = this._distAlongDir(fromEnd, toEnd, perpDir);
        const mid1 = this._offsetPoint(fromEnd, perpDir, midDist / 2);
        const mid2 = this._offsetPoint(toEnd, perpDir, midDist / 2);
        this._points.add(fromEnd);
        this._points.add(mid1);
        this._points.add(mid2);
        this._points.add(toEnd);
      } else if (this._isOppositeDir(fromDir, toDir)) {
        const perpDir = this._perpendicularDir(fromDir);
        const midDist = this._distAlongDir(fromEnd, toEnd, perpDir);
        const midAlong = this._distAlongDir(fromEnd, toEnd, fromDir);
        if ((midAlong > 0 && fromDir === 'right') || (midAlong > 0 && fromDir === 'down') ||
            (midAlong < 0 && fromDir === 'left') || (midAlong < 0 && fromDir === 'up')) {
          const mid1 = this._offsetPoint(fromEnd, fromDir, midAlong / 2);
          const mid2 = this._offsetPoint(toEnd, toDir, -midAlong / 2);
          this._points.add(fromEnd);
          this._points.add(mid1);
          this._points.add(mid2);
          this._points.add(toEnd);
        } else {
          const perpMid = this._distAlongDir(fromEnd, toEnd, perpDir) / 2;
          const mid1 = this._offsetPoint(fromEnd, perpDir, perpMid);
          const mid2 = this._offsetPoint(toEnd, perpDir, perpMid);
          this._points.add(fromEnd);
          this._points.add(mid1);
          this._points.add(mid2);
          this._points.add(toEnd);
        }
      } else {
        const canTurn = this._canReachWithCorner(fromEnd, fromDir, toEnd, toDir);
        if (canTurn) {
          const corner = this._cornerPoint(fromEnd, fromDir, toEnd, toDir);
          this._points.add(fromEnd);
          this._points.add(corner);
          this._points.add(toEnd);
        } else {
          const perpDir = this._perpendicularDir(fromDir);
          const mid1 = this._offsetPoint(fromEnd, perpDir, this._distAlongDir(fromEnd, toEnd, perpDir));
          this._points.add(fromEnd);
          this._points.add(mid1);
          this._points.add(toEnd);
        }
      }
    }

    this._points.add(toPoint);
    return true;
  }

  /** Resolve the effective fromSpot for this link */
  private _resolveFromSpot(port?: GraphObject): Spot {
    const fromSpot = (this as any).fromSpot as Spot;
    if (!fromSpot.isDefault) return fromSpot;
    if (port && (port as any).fromSpot) {
      const portSpot = (port as any).fromSpot as Spot;
      if (!portSpot.isDefault) return portSpot;
    }
    if (this._fromNode) {
      const nodeSpot = (this._fromNode as any).fromSpot as Spot;
      if (nodeSpot && !nodeSpot.isDefault) return nodeSpot;
    }
    return new Spot(NaN, NaN);
  }

  private _resolveToSpot(port?: GraphObject): Spot {
    const toSpot = (this as any).toSpot as Spot;
    if (!toSpot.isDefault) return toSpot;
    if (port && (port as any).toSpot) {
      const portSpot = (port as any).toSpot as Spot;
      if (!portSpot.isDefault) return portSpot;
    }
    if (this._toNode) {
      const nodeSpot = (this._toNode as any).toSpot as Spot;
      if (nodeSpot && !nodeSpot.isDefault) return nodeSpot;
    }
    return new Spot(NaN, NaN);
  }

  private _getPortDirection(port: GraphObject, spot: Spot, portPoint: Point, center: Point): string {
    if (spot && !spot.isNone && !spot.isDefault) {
      if (spot.x <= 0.01) return 'left';
      if (spot.x >= 0.99) return 'right';
      if (spot.y <= 0.01) return 'up';
      if (spot.y >= 0.99) return 'down';
    }
    const bounds = port.getDocumentBounds();
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;
    const dx = portPoint.x - cx;
    const dy = portPoint.y - cy;
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
  }

  private _offsetPoint(pt: Point, dir: string, dist: number): Point {
    switch (dir) {
      case 'right': return new Point(pt.x + dist, pt.y);
      case 'left': return new Point(pt.x - dist, pt.y);
      case 'down': return new Point(pt.x, pt.y + dist);
      case 'up': return new Point(pt.x, pt.y - dist);
      default: return pt;
    }
  }

  private _perpendicularDir(dir: string): string {
    switch (dir) {
      case 'right': case 'left': return 'down';
      case 'down': case 'up': return 'right';
      default: return 'right';
    }
  }

  private _isOppositeDir(dir1: string, dir2: string): boolean {
    return (dir1 === 'right' && dir2 === 'left') || (dir1 === 'left' && dir2 === 'right') ||
           (dir1 === 'down' && dir2 === 'up') || (dir1 === 'up' && dir2 === 'down');
  }

  private _distAlongDir(from: Point, to: Point, dir: string): number {
    switch (dir) {
      case 'right': return to.x - from.x;
      case 'left': return from.x - to.x;
      case 'down': return to.y - from.y;
      case 'up': return from.y - to.y;
      default: return 0;
    }
  }

  private _canReachWithCorner(from: Point, fromDir: string, to: Point, toDir: string): boolean {
    if ((fromDir === 'right' || fromDir === 'left') && (toDir === 'up' || toDir === 'down')) {
      return true;
    }
    if ((fromDir === 'up' || fromDir === 'down') && (toDir === 'right' || toDir === 'left')) {
      return true;
    }
    return false;
  }

  private _cornerPoint(from: Point, fromDir: string, to: Point, toDir: string): Point {
    if (fromDir === 'right' || fromDir === 'left') {
      return new Point(from.x, to.y);
    }
    return new Point(to.x, from.y);
  }

  /** Get the intersection of a line from center to target with the rectangle edge */
  private _getEdgeIntersection(rect: Rect, center: Point, target: Point): Point {
    const dx = target.x - center.x;
    const dy = target.y - center.y;

    if (dx === 0 && dy === 0) return center;

    let t = Infinity;

    // Check intersection with each edge
    if (dx !== 0) {
      const tx = (dx > 0 ? rect.right : rect.x) - center.x;
      const t1 = tx / dx;
      const y1 = center.y + t1 * dy;
      if (y1 >= rect.y && y1 <= rect.bottom && t1 > 0 && t1 < t) {
        t = t1;
      }
    }
    if (dy !== 0) {
      const ty = (dy > 0 ? rect.bottom : rect.y) - center.y;
      const t2 = ty / dy;
      const x2 = center.x + t2 * dx;
      if (x2 >= rect.x && x2 <= rect.right && t2 > 0 && t2 < t) {
        t = t2;
      }
    }

    if (t === Infinity) return center;
    return new Point(center.x + t * dx, center.y + t * dy);
  }

  get midPoint(): Point {
    const pts = this._points;
    const count = pts.count;
    if (count === 0) return new Point(NaN, NaN);
    if (count === 1) return pts.get(0)!.copy();
    const midIndex = (count - 1) / 2;
    const i = Math.floor(midIndex);
    const frac = midIndex - i;
    const p1 = pts.get(i);
    const p2 = pts.get(i + 1);
    if (!p1 || !p2) return p1 ? p1.copy() : new Point(NaN, NaN);
    return new Point(p1.x + (p2.x - p1.x) * frac, p1.y + (p2.y - p1.y) * frac);
  }

  findClosestSegment(p: Point): number {
    const pts = this._points;
    const count = pts.count;
    if (count < 2) return -1;
    let bestDist = Infinity;
    let bestIdx = 0;
    for (let i = 0; i < count - 1; i++) {
      const a = pts.get(i)!;
      const b = pts.get(i + 1)!;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const lenSq = dx * dx + dy * dy;
      let t = lenSq > 0 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq : 0;
      t = Math.max(0, Math.min(1, t));
      const cx = a.x + t * dx;
      const cy = a.y + t * dy;
      const distSq = (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy);
      if (distSq < bestDist) {
        bestDist = distSq;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  copy(): Link {
    const c = new Link(this._type);
    this._copyPropertiesTo(c as any);
    this._copyPanelPropertiesTo(c as any);
    this._copyPartPropertiesTo(c);
    // Copy Link-specific properties
    c._routing = this._routing;
    c._curve = this._curve;
    c._corner = this._corner;
    c._curviness = this._curviness;
    c._resegmentable = this._resegmentable;
    c._adjusting = this._adjusting;
    c._relinkableFrom = this._relinkableFrom;
    c._relinkableTo = this._relinkableTo;
    c._reshapable = this._reshapable;
    return c;
  }
}

GraphObject.defineBuilder('Link', Link);
