import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { List } from '../core/List';
import { Set } from '../core/Set';
import { Link } from '../view/Link';
import { Node } from '../view/Node';
import { Diagram } from '../diagram/Diagram';
import { Group } from '../view/Group';
import { RoutingOrthogonal, RoutingAvoidsNodes } from '../core/EnumValues';

/**
 * AvoidsLinksRouter - a Router that adjusts orthogonal link routes to avoid
 * overlapping with nodes in the diagram.
 *
 * This is a simplified implementation of the GoJS AvoidsLinksRouter extension.
 * The full GoJS AvoidsLinksRouter separates overlapping parallel link segments;
 * this implementation focuses on adjusting link segments that intersect with nodes.
 *
 * Typical setup:
 *   myDiagram.routers.add(new AvoidsLinksRouter());
 */
export class AvoidsLinksRouter {

  // ============ Private property storage ============
  private _isEnabled: boolean = true;
  private _isRealtime: boolean = true;
  private _name: string = 'AvoidsLinksRouter';
  private _diagram: Diagram | null = null;

  private _avoidsNodes: boolean = true;
  private _epsilonDistance: number = 0.5;
  private _ignoreContainingGroups: boolean = false;
  private _iterations: number = 1;
  private _linkSpacing: number = 4;
  private _avoidablePadding: number = 10;
  private _isRunning: boolean = false;

  constructor(init?: Partial<AvoidsLinksRouter>) {
    if (init) {
      const keys = Object.keys(init) as (keyof AvoidsLinksRouter)[];
      for (const key of keys) {
        const val = init[key];
        if (val !== undefined) {
          (this as any)[key] = val;
        }
      }
    }
  }

  // ============ Router base properties (GoJS API compatible) ============

  /** Whether this router is enabled. Default is true. */
  get isEnabled(): boolean { return this._isEnabled; }
  set isEnabled(val: boolean) { this._isEnabled = val; }

  /** Whether this router operates in realtime. Default is true. */
  get isRealtime(): boolean { return this._isRealtime; }
  set isRealtime(val: boolean) { this._isRealtime = val; }

  /** The name of this router. Default is 'AvoidsLinksRouter'. */
  get name(): string { return this._name; }
  set name(val: string) { this._name = val; }

  /** The diagram this router is associated with. */
  get diagram(): Diagram | null { return this._diagram; }
  set diagram(val: Diagram | null) { this._diagram = val; }

  /** Whether the router is currently running. */
  get isRunning(): boolean { return this._isRunning; }

  // ============ AvoidsLinksRouter specific properties ============

  /**
   * Whether the router should reduce spacing between separated links to avoid
   * overlap with nearby nodes. If false, all separated links will have a distance
   * of exactly linkSpacing, even if this causes them to cross over a nearby node.
   * Default is true.
   */
  get avoidsNodes(): boolean { return this._avoidsNodes; }
  set avoidsNodes(val: boolean) { this._avoidsNodes = val; }

  /**
   * The minimum distance between links for them to be considered "overlapping"
   * and be separated by AvoidsLinksRouter. Should be a small fraction of linkSpacing.
   * Default is 0.5.
   */
  get epsilonDistance(): number { return this._epsilonDistance; }
  set epsilonDistance(val: number) { this._epsilonDistance = val; }

  /**
   * Whether the router will run only once on the top-level Diagram, considering
   * all links regardless of their containing group.
   * If false, the router will separately route the top-level links against links
   * in each Group. Default is false.
   */
  get ignoreContainingGroups(): boolean { return this._ignoreContainingGroups; }
  set ignoreContainingGroups(val: boolean) { this._ignoreContainingGroups = val; }

  /**
   * The number of times the router will run iteratively.
   * In the vast majority of cases, one iteration should be enough.
   * Default is 1.
   */
  get iterations(): number { return this._iterations; }
  set iterations(val: number) { this._iterations = val; }

  /**
   * The desired distance between links that are separated by AvoidsLinksRouter.
   * If avoidsNodes is true, this value is the maximum allowed distance.
   * Default is 4.
   */
  get linkSpacing(): number { return this._linkSpacing; }
  set linkSpacing(val: number) { this._linkSpacing = val; }

  /**
   * Padding around nodes to avoid when checking intersections.
   * Default is 10.
   */
  get avoidablePadding(): number { return this._avoidablePadding; }
  set avoidablePadding(val: number) { this._avoidablePadding = val; }

  // ============ Methods ============

  /**
   * Determine whether the AvoidsLinksRouter should operate on a given container.
   * See ignoreContainingGroups for the default behavior.
   * @param container - A Diagram or a Group
   */
  canRoute(container: Diagram | Group): boolean {
    if (!this._isEnabled) return false;
    if (container instanceof Diagram) return true;
    // If ignoring containing groups, only route at the diagram level
    if (this._ignoreContainingGroups) return false;
    return true;
  }

  /**
   * Check whether a given link is routable by this router.
   * Returns false for links that are not orthogonal.
   * @param link - The link to check
   * @param container - The Diagram or Group container
   */
  isRoutable(link: Link, container: Diagram | Group): boolean {
    if (!link.isOrthogonal) return false;
    if (!this._ignoreContainingGroups && container instanceof Diagram) {
      // Only route top-level links when container is the diagram
      const linkGroup = link.containingGroup;
      if (linkGroup !== null) return false;
    }
    return true;
  }

  /**
   * Main routing method that adjusts orthogonal link routes to avoid nodes.
   * This is the primary entry point called by the diagram's routing system.
   * @param links - Set of links to route
   * @param container - The Diagram or Group container
   */
  routeLinks(links: Set<Link>, container: Diagram | Group): void {
    if (!this.canRoute(container)) return;

    this._isRunning = true;
    try {
      const diagram = container instanceof Diagram ? container : container.diagram;
      if (!diagram) return;

      for (let iter = 0; iter < this._iterations; iter++) {
        const linkIt = links.iterator;
        while (linkIt.next()) {
          const link = linkIt.value;
          if (!this.isRoutable(link, container)) continue;
          this._routeSingleLink(link, diagram);
        }

        // If avoidsNodes is enabled, also separate overlapping parallel segments
        if (this._avoidsNodes) {
          this._separateOverlappingLinks(links, container);
        }
      }
    } finally {
      this._isRunning = false;
    }
  }

  /**
   * Convenience method to route all avoids-links in the diagram.
   * @param diagram - The diagram to route links in
   */
  routeAvoidsLinks(diagram: Diagram): void {
    if (!this._isEnabled) return;

    const routableLinks = new Set<Link>();
    for (const layer of diagram._layers) {
      if (layer.isTemporary) continue;
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && this.isRoutable(part, diagram)) {
          routableLinks.add(part);
        }
      }
    }

    this.routeLinks(routableLinks, diagram);
  }

  /**
   * Find a route for a single link that avoids nodes.
   * This method checks each segment of the link for intersections with nodes
   * and adjusts the route by adding waypoints to go around intersecting nodes.
   *
   * @param link - The link to route
   * @param fromPt - The starting point of the link
   * @param toPt - The ending point of the link
   * @param portDirFrom - The direction from the from-port ('up', 'down', 'left', 'right')
   * @param portDirTo - The direction to the to-port ('up', 'down', 'left', 'right')
   * @returns An array of Points representing the new route, or null if no adjustment needed
   */
  findAvoidsRoute(
    link: Link,
    fromPt: Point,
    toPt: Point,
    portDirFrom: string,
    portDirTo: string
  ): Point[] | null {
    const diagram = link.diagram as Diagram;
    if (!diagram) return null;

    const currentPoints = link.points.toArray();
    if (currentPoints.length < 2) return null;

    // Collect avoidable nodes (exclude the link's own from/to nodes)
    const fromNode = link.fromNode;
    const toNode = link.toNode;
    const avoidRects: { rect: Rect; node: Node }[] = [];

    for (const layer of diagram._layers) {
      if (layer.isTemporary) continue;
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Node && part !== fromNode && part !== toNode) {
          const bounds = part.getDocumentBounds();
          if (bounds.isReal && !bounds.isEmpty) {
            const paddedRect = bounds.inflate(this._avoidablePadding);
            avoidRects.push({ rect: paddedRect, node: part });
          }
        }
      }
    }

    if (avoidRects.length === 0) return null;

    // Check each segment for intersection with avoidable nodes
    const newPoints: Point[] = [currentPoints[0].copy()];
    let modified = false;

    for (let i = 0; i < currentPoints.length - 1; i++) {
      const segStart = currentPoints[i];
      const segEnd = currentPoints[i + 1];

      // Find all nodes that intersect this segment
      const intersectingNodes = this._findIntersectingNodes(segStart, segEnd, avoidRects);

      if (intersectingNodes.length === 0) {
        newPoints.push(segEnd.copy());
        continue;
      }

      // Adjust the segment to avoid intersecting nodes
      const adjustedPoints = this._adjustSegmentForNodes(
        segStart, segEnd, intersectingNodes, portDirFrom, portDirTo
      );

      if (adjustedPoints !== null) {
        // Remove the last point (segEnd) since adjustedPoints includes it
        for (let j = 1; j < adjustedPoints.length; j++) {
          newPoints.push(adjustedPoints[j]);
        }
        modified = true;
      } else {
        newPoints.push(segEnd.copy());
      }
    }

    return modified ? newPoints : null;
  }

  /**
   * Invalidate this router, causing it to re-route on the next update.
   */
  invalidateRouter(): void {
    if (this._diagram) {
      this._diagram._layoutInvalid = true;
      this._diagram.requestUpdate();
    }
  }

  // ============ Private implementation methods ============

  /**
   * Route a single link by checking for node intersections and adjusting.
   */
  private _routeSingleLink(link: Link, diagram: Diagram): void {
    const currentPoints = link.points.toArray();
    if (currentPoints.length < 2) return;

    // Get port directions
    const fromNode = link.fromNode;
    const toNode = link.toNode;
    if (!fromNode || !toNode) return;

    const fromPort = (fromNode as any).findPortWithName
      ? (fromNode as any).findPortWithName(link.fromPortId) || fromNode
      : fromNode;
    const toPort = (toNode as any).findPortWithName
      ? (toNode as any).findPortWithName(link.toPortId) || toNode
      : toNode;

    const fromBounds = fromPort.getDocumentBounds();
    const toBounds = toPort.getDocumentBounds();
    const fromCenter = fromBounds.center;
    const toCenter = toBounds.center;

    const fromSpot = (link as any)._resolveFromSpot
      ? (link as any)._resolveFromSpot(fromPort)
      : new Point(NaN, NaN);
    const toSpot = (link as any)._resolveToSpot
      ? (link as any)._resolveToSpot(toPort)
      : new Point(NaN, NaN);

    const fromPt = currentPoints[0];
    const toPt = currentPoints[currentPoints.length - 1];

    const portDirFrom = this._getPortDirection(fromPort, fromPt, fromCenter);
    const portDirTo = this._getPortDirection(toPort, toPt, toCenter);

    const newRoute = this.findAvoidsRoute(link, fromPt, toPt, portDirFrom, portDirTo);
    if (newRoute !== null && newRoute.length >= 2) {
      link.points = new List<Point>(newRoute);
    }
  }

  /**
   * Determine the direction a port is facing based on the link point relative to the port center.
   */
  private _getPortDirection(port: any, portPoint: Point, center: Point): string {
    const bounds = port.getDocumentBounds ? port.getDocumentBounds() : new Rect(0, 0, 0, 0);
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;
    const dx = portPoint.x - cx;
    const dy = portPoint.y - cy;
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
  }

  /**
   * Find all nodes whose padded bounds intersect with a line segment.
   */
  private _findIntersectingNodes(
    segStart: Point,
    segEnd: Point,
    avoidRects: { rect: Rect; node: Node }[]
  ): { rect: Rect; node: Node }[] {
    const result: { rect: Rect; node: Node }[] = [];

    // Create a bounding box for the segment
    const segBounds = this._segmentBounds(segStart, segEnd);

    for (const entry of avoidRects) {
      // Quick bounding box check
      if (!segBounds.intersects(entry.rect)) continue;

      // Precise segment-rect intersection check
      if (this._segmentIntersectsRect(segStart, segEnd, entry.rect)) {
        result.push(entry);
      }
    }

    return result;
  }

  /**
   * Get the bounding rectangle of a segment.
   */
  private _segmentBounds(a: Point, b: Point): Rect {
    const minX = Math.min(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxX = Math.max(a.x, b.x);
    const maxY = Math.max(a.y, b.y);
    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  /**
   * Check if a line segment intersects with a rectangle.
   */
  private _segmentIntersectsRect(a: Point, b: Point, rect: Rect): boolean {
    // Check if either endpoint is inside the rect
    if (rect.containsPoint(a) || rect.containsPoint(b)) return true;

    // Check if the segment intersects any edge of the rectangle
    const edges: [Point, Point][] = [
      [new Point(rect.left, rect.top), new Point(rect.right, rect.top)],
      [new Point(rect.right, rect.top), new Point(rect.right, rect.bottom)],
      [new Point(rect.right, rect.bottom), new Point(rect.left, rect.bottom)],
      [new Point(rect.left, rect.bottom), new Point(rect.left, rect.top)]
    ];

    for (const [e1, e2] of edges) {
      if (this._segmentsIntersect(a, b, e1, e2)) return true;
    }

    return false;
  }

  /**
   * Check if two line segments intersect.
   */
  private _segmentsIntersect(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
    const d1x = a2.x - a1.x;
    const d1y = a2.y - a1.y;
    const d2x = b2.x - b1.x;
    const d2y = b2.y - b1.y;

    const cross = d1x * d2y - d1y * d2x;
    if (Math.abs(cross) < 1e-10) return false; // parallel

    const dx = b1.x - a1.x;
    const dy = b1.y - a1.y;

    const t = (dx * d2y - dy * d2x) / cross;
    const u = (dx * d1y - dy * d1x) / cross;

    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }

  /**
   * Adjust a segment to avoid intersecting nodes by adding waypoints.
   * For orthogonal links, segments are either horizontal or vertical.
   */
  private _adjustSegmentForNodes(
    segStart: Point,
    segEnd: Point,
    intersectingNodes: { rect: Rect; node: Node }[],
    portDirFrom: string,
    portDirTo: string
  ): Point[] | null {
    if (intersectingNodes.length === 0) return null;

    const isHorizontal = Math.abs(segStart.y - segEnd.y) < 0.5;
    const isVertical = Math.abs(segStart.x - segEnd.x) < 0.5;

    if (!isHorizontal && !isVertical) return null; // not orthogonal

    // Find the combined bounds of all intersecting nodes
    let combinedRect = intersectingNodes[0].rect;
    for (let i = 1; i < intersectingNodes.length; i++) {
      combinedRect = combinedRect.union(intersectingNodes[i].rect);
    }

    const spacing = this._linkSpacing;
    const points: Point[] = [segStart.copy()];

    if (isHorizontal) {
      // Horizontal segment - deflect vertically
      const segY = segStart.y;
      const isAbove = segY < combinedRect.top;
      const isBelow = segY > combinedRect.bottom;

      if (isAbove || isBelow) {
        // Segment is at the edge of the padded rect, slight adjustment needed
        const deflectY = isAbove
          ? combinedRect.top - spacing
          : combinedRect.bottom + spacing;
        points.push(new Point(segEnd.x, deflectY));
      } else {
        // Segment passes through the node - route around it
        const deflectY = this._chooseDeflectDirection(
          segStart, combinedRect, portDirFrom, portDirTo, 'horizontal'
        );

        // Create a detour: go around the node
        const leftX = combinedRect.left - spacing;
        const rightX = combinedRect.right + spacing;

        if (segStart.x < combinedRect.left && segEnd.x > combinedRect.right) {
          // Segment spans the full width of the node
          points.push(new Point(leftX, segY));
          points.push(new Point(leftX, deflectY));
          points.push(new Point(rightX, deflectY));
          points.push(new Point(rightX, segY));
        } else if (segStart.x < combinedRect.left) {
          // Segment starts left of node
          points.push(new Point(leftX, segY));
          points.push(new Point(leftX, deflectY));
          points.push(new Point(segEnd.x, deflectY));
        } else if (segEnd.x > combinedRect.right) {
          // Segment ends right of node
          points.push(new Point(rightX, segY));
          points.push(new Point(rightX, deflectY));
          points.push(new Point(segEnd.x, deflectY));
        } else {
          // Both endpoints are within the node bounds
          points.push(new Point(segStart.x, deflectY));
        }
      }
    } else {
      // Vertical segment - deflect horizontally
      const segX = segStart.x;
      const isLeft = segX < combinedRect.left;
      const isRight = segX > combinedRect.right;

      if (isLeft || isRight) {
        const deflectX = isLeft
          ? combinedRect.left - spacing
          : combinedRect.right + spacing;
        points.push(new Point(deflectX, segEnd.y));
      } else {
        // Segment passes through the node - route around it
        const deflectX = this._chooseDeflectDirection(
          segStart, combinedRect, portDirFrom, portDirTo, 'vertical'
        );

        const topY = combinedRect.top - spacing;
        const bottomY = combinedRect.bottom + spacing;

        if (segStart.y < combinedRect.top && segEnd.y > combinedRect.bottom) {
          // Segment spans the full height of the node
          points.push(new Point(segX, topY));
          points.push(new Point(deflectX, topY));
          points.push(new Point(deflectX, bottomY));
          points.push(new Point(segX, bottomY));
        } else if (segStart.y < combinedRect.top) {
          // Segment starts above node
          points.push(new Point(segX, topY));
          points.push(new Point(deflectX, topY));
          points.push(new Point(deflectX, segEnd.y));
        } else if (segEnd.y > combinedRect.bottom) {
          // Segment ends below node
          points.push(new Point(segX, bottomY));
          points.push(new Point(deflectX, bottomY));
          points.push(new Point(deflectX, segEnd.y));
        } else {
          // Both endpoints are within the node bounds
          points.push(new Point(deflectX, segStart.y));
        }
      }
    }

    points.push(segEnd.copy());
    return points;
  }

  /**
   * Choose the best direction to deflect a segment around a node.
   * Tries to pick the side with more space.
   */
  private _chooseDeflectDirection(
    segStart: Point,
    nodeRect: Rect,
    portDirFrom: string,
    portDirTo: string,
    segOrientation: 'horizontal' | 'vertical'
  ): number {
    const spacing = this._linkSpacing;

    if (segOrientation === 'horizontal') {
      // Deflect vertically - choose above or below
      const aboveY = nodeRect.top - spacing;
      const belowY = nodeRect.bottom + spacing;

      // Prefer the side that's closer to the segment's original position
      const distAbove = Math.abs(segStart.y - aboveY);
      const distBelow = Math.abs(segStart.y - belowY);

      return distAbove <= distBelow ? aboveY : belowY;
    } else {
      // Deflect horizontally - choose left or right
      const leftX = nodeRect.left - spacing;
      const rightX = nodeRect.right + spacing;

      const distLeft = Math.abs(segStart.x - leftX);
      const distRight = Math.abs(segStart.x - rightX);

      return distLeft <= distRight ? leftX : rightX;
    }
  }

  /**
   * Separate overlapping parallel link segments.
   * This is a simplified version of the full GoJS algorithm.
   */
  private _separateOverlappingLinks(links: Set<Link>, container: Diagram | Group): void {
    const diagram = container instanceof Diagram ? container : container.diagram;
    if (!diagram) return;

    const linkArray = links.toArray();
    if (linkArray.length < 2) return;

    // Group links by their overlapping segments
    for (let i = 0; i < linkArray.length; i++) {
      for (let j = i + 1; j < linkArray.length; j++) {
        this._separateOverlappingPair(linkArray[i], linkArray[j], diagram);
      }
    }
  }

  /**
   * Check and separate a pair of links that may have overlapping segments.
   */
  private _separateOverlappingPair(linkA: Link, linkB: Link, diagram: Diagram): void {
    const pointsA = linkA.points.toArray();
    const pointsB = linkB.points.toArray();
    if (pointsA.length < 2 || pointsB.length < 2) return;

    const epsilon = this._epsilonDistance;
    const spacing = this._linkSpacing;

    // Check each segment pair for overlap
    for (let i = 0; i < pointsA.length - 1; i++) {
      const a1 = pointsA[i];
      const a2 = pointsA[i + 1];
      const isHorizA = Math.abs(a1.y - a2.y) < epsilon;

      for (let j = 0; j < pointsB.length - 1; j++) {
        const b1 = pointsB[j];
        const b2 = pointsB[j + 1];
        const isHorizB = Math.abs(b1.y - b2.y) < epsilon;

        // Both segments must be the same orientation
        if (isHorizA !== isHorizB) continue;

        if (isHorizA) {
          // Both horizontal - check if they're at similar Y and overlapping in X
          const yDiff = Math.abs(a1.y - b1.y);
          if (yDiff < epsilon + spacing) {
            // Check X overlap
            const aMinX = Math.min(a1.x, a2.x);
            const aMaxX = Math.max(a1.x, a2.x);
            const bMinX = Math.min(b1.x, b2.x);
            const bMaxX = Math.max(b1.x, b2.x);
            const overlapMinX = Math.max(aMinX, bMinX);
            const overlapMaxX = Math.min(aMaxX, bMaxX);

            if (overlapMaxX > overlapMinX + epsilon) {
              // Segments overlap - separate them vertically
              const offset = spacing / 2;
              const newYA = a1.y - offset;
              const newYB = b1.y + offset;

              // Check if new positions would overlap with nodes
              if (this._avoidsNodes) {
                const safeA = this._isSafePosition(newYA, 'horizontal', overlapMinX, overlapMaxX, diagram, linkA);
                const safeB = this._isSafePosition(newYB, 'horizontal', overlapMinX, overlapMaxX, diagram, linkB);

                if (safeA) {
                  pointsA[i] = new Point(a1.x, newYA);
                  pointsA[i + 1] = new Point(a2.x, newYA);
                }
                if (safeB) {
                  pointsB[j] = new Point(b1.x, newYB);
                  pointsB[j + 1] = new Point(b2.x, newYB);
                }
              } else {
                pointsA[i] = new Point(a1.x, newYA);
                pointsA[i + 1] = new Point(a2.x, newYA);
                pointsB[j] = new Point(b1.x, newYB);
                pointsB[j + 1] = new Point(b2.x, newYB);
              }
            }
          }
        } else {
          // Both vertical - check if they're at similar X and overlapping in Y
          const xDiff = Math.abs(a1.x - b1.x);
          if (xDiff < epsilon + spacing) {
            const aMinY = Math.min(a1.y, a2.y);
            const aMaxY = Math.max(a1.y, a2.y);
            const bMinY = Math.min(b1.y, b2.y);
            const bMaxY = Math.max(b1.y, b2.y);
            const overlapMinY = Math.max(aMinY, bMinY);
            const overlapMaxY = Math.min(aMaxY, bMaxY);

            if (overlapMaxY > overlapMinY + epsilon) {
              const offset = spacing / 2;
              const newXA = a1.x - offset;
              const newXB = b1.x + offset;

              if (this._avoidsNodes) {
                const safeA = this._isSafePosition(newXA, 'vertical', overlapMinY, overlapMaxY, diagram, linkA);
                const safeB = this._isSafePosition(newXB, 'vertical', overlapMinY, overlapMaxY, diagram, linkB);

                if (safeA) {
                  pointsA[i] = new Point(newXA, a1.y);
                  pointsA[i + 1] = new Point(newXA, a2.y);
                }
                if (safeB) {
                  pointsB[j] = new Point(newXB, b1.y);
                  pointsB[j + 1] = new Point(newXB, b2.y);
                }
              } else {
                pointsA[i] = new Point(newXA, a1.y);
                pointsA[i + 1] = new Point(newXA, a2.y);
                pointsB[j] = new Point(newXB, b1.y);
                pointsB[j + 1] = new Point(newXB, b2.y);
              }
            }
          }
        }
      }
    }

    // Apply modified points back to links
    linkA.points = new List<Point>(pointsA);
    linkB.points = new List<Point>(pointsB);
  }

  /**
   * Check if a position is safe (doesn't overlap with any node).
   */
  private _isSafePosition(
    pos: number,
    orientation: 'horizontal' | 'vertical',
    rangeMin: number,
    rangeMax: number,
    diagram: Diagram,
    link: Link
  ): boolean {
    const fromNode = link.fromNode;
    const toNode = link.toNode;

    for (const layer of diagram._layers) {
      if (layer.isTemporary) continue;
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (!(part instanceof Node) || part === fromNode || part === toNode) continue;

        const bounds = part.getDocumentBounds();
        const paddedRect = bounds.inflate(this._avoidablePadding);

        if (orientation === 'horizontal') {
          // Check if horizontal line at pos overlaps with node
          if (pos >= paddedRect.top && pos <= paddedRect.bottom &&
              rangeMin < paddedRect.right && rangeMax > paddedRect.left) {
            return false;
          }
        } else {
          // Check if vertical line at pos overlaps with node
          if (pos >= paddedRect.left && pos <= paddedRect.right &&
              rangeMin < paddedRect.bottom && rangeMax > paddedRect.top) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
