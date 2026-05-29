import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { List } from '../core/List';
import { Set } from '../core/Set';
import { Part } from '../view/Part';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';

/**
 * Layout - base class for all layout algorithms.
 * Subclasses must override doLayout() to implement specific layout algorithms.
 */
export class Layout {

  // ============ Protected property storage ============
  protected _arrangementOrigin: Point = new Point(0, 0);
  protected _isInitial: boolean = true;
  protected _isOngoing: boolean = true;
  protected _isRealtime: boolean = true;
  protected _isRouting: boolean = true;
  protected _isValidLayout: boolean = true;
  protected _isViewportSized: boolean = false;
  protected _boundsComputation: ((layout: Layout, part: Part, bounds: Rect) => Rect) | null = null;
  protected _network: LayoutNetwork | null = null;
  protected _diagram: any = null;
  protected _group: any = null;

  // ============ Properties ============

  get arrangementOrigin(): Point { return this._arrangementOrigin; }
  set arrangementOrigin(val: Point) { this._arrangementOrigin = val.copy(); }

  get isInitial(): boolean { return this._isInitial; }
  set isInitial(val: boolean) { this._isInitial = val; }

  get isOngoing(): boolean { return this._isOngoing; }
  set isOngoing(val: boolean) { this._isOngoing = val; }

  get isRealtime(): boolean { return this._isRealtime; }
  set isRealtime(val: boolean) { this._isRealtime = val; }

  get isRouting(): boolean { return this._isRouting; }
  set isRouting(val: boolean) { this._isRouting = val; }

  get isValidLayout(): boolean { return this._isValidLayout; }
  set isValidLayout(val: boolean) { this._isValidLayout = val; }

  get isViewportSized(): boolean { return this._isViewportSized; }
  set isViewportSized(val: boolean) { this._isViewportSized = val; }

  get boundsComputation(): ((layout: Layout, part: Part, bounds: Rect) => Rect) | null {
    return this._boundsComputation;
  }
  set boundsComputation(val: ((layout: Layout, part: Part, bounds: Rect) => Rect) | null) {
    this._boundsComputation = val;
  }

  get network(): LayoutNetwork | null { return this._network; }
  set network(val: LayoutNetwork | null) { this._network = val; }

  get diagram(): any { return this._diagram; }
  set diagram(val: any) { this._diagram = val; }

  get group(): any { return this._group; }
  set group(val: any) { this._group = val; }

  // ============ Methods ============

  /**
   * Perform the layout on the given collection of parts.
   * @param coll - A Diagram, Iterable<Part>, or array of Parts
   */
  doLayout(coll: any): void {
    // Base implementation - subclasses override
    const parts = this.collectParts(coll);
    if (parts.count === 0) return;
    this.isValidLayout = true;
  }

  /**
   * Collect all Parts that should be laid out from the given collection.
   * @param coll - A Diagram, Iterable<Part>, or array of Parts
   */
  collectParts(coll: any): List<Part> {
    const parts = new List<Part>();

    if (!coll) return parts;

    // If it's a Diagram, collect all nodes and links
    if (coll._layers) {
      const diagram = coll as any;
      for (const layer of diagram._layers) {
        if (layer.isTemporary) continue;
        const partsIt = layer.parts;
        while (partsIt.next()) {
          const part: Part = partsIt.value;
          if (part.isLayoutPositioned && part.visible) {
            parts.add(part);
          }
        }
      }
      this._diagram = diagram;
      return parts;
    }

    // If it has an iterator (Iterable<Part>)
    if (typeof coll.iterator === 'function' || (coll.iterator && typeof coll.iterator.next === 'function')) {
      const it = coll.iterator;
      while (it.next()) {
        const part = it.value;
        if (part instanceof Part && part.isLayoutPositioned && part.visible) {
          parts.add(part);
        }
      }
      return parts;
    }

    // If it's an array
    if (Array.isArray(coll)) {
      for (const part of coll) {
        if (part instanceof Part && part.isLayoutPositioned && part.visible) {
          parts.add(part);
        }
      }
      return parts;
    }

    return parts;
  }

  /**
   * Commit the layout by moving parts to their computed positions.
   * Called after the layout algorithm has computed positions.
   */
  commitLayout(): void {
    if (!this._network) return;

    const it = this._network.vertexes.iterator;
    while (it.next()) {
      const vertex = it.value;
      if (vertex.node && !vertex._isArtificial) {
        const node = vertex.node;
        node.move(new Point(vertex.x, vertex.y));
      }
    }

    const eit = this._network.edges.iterator;
    while (eit.next()) {
      const edge = eit.value;
      if (edge.link) {
        edge.link.computePoints();
      }
    }
  }

  /**
   * Create a copy of this layout.
   */
  copy(): Layout {
    const copy = new Layout();
    copy._arrangementOrigin = this._arrangementOrigin.copy();
    copy._isInitial = this._isInitial;
    copy._isOngoing = this._isOngoing;
    copy._isRealtime = this._isRealtime;
    copy._isRouting = this._isRouting;
    copy._isValidLayout = this._isValidLayout;
    copy._isViewportSized = this._isViewportSized;
    copy._boundsComputation = this._boundsComputation;
    return copy;
  }

  /**
   * Create a new LayoutNetwork for this layout.
   */
  createNetwork(): LayoutNetwork {
    const net = new LayoutNetwork();
    net.layout = this;
    return net;
  }

  /**
   * Get the layout bounds of a part.
   * @param part - The part to get bounds for
   */
  getLayoutBounds(part: Part): Rect {
    const bounds = part.getDocumentBounds();
    if (this._boundsComputation) {
      return this._boundsComputation(this, part, bounds);
    }
    return bounds;
  }

  /**
   * Return the initial origin point for the layout.
   */
  initialOrigin(): Point {
    return this._arrangementOrigin.copy();
  }

  /**
   * Invalidate this layout, causing it to be re-performed.
   */
  invalidateLayout(): void {
    this._isValidLayout = false;
    if (this._diagram) {
      this._diagram._layoutInvalid = true;
      this._diagram.requestUpdate();
    }
    if (this._group) {
      (this._group as any)._layoutInvalid = true;
      if ((this._group as any).diagram) {
        (this._group as any).diagram.requestUpdate();
      }
    }
  }

  /**
   * Build a LayoutNetwork from the parts in the given collection.
   * @param coll - A Diagram, Iterable<Part>, or array of Parts
   */
  makeNetwork(coll: any): LayoutNetwork {
    const net = this.createNetwork();
    const parts = this.collectParts(coll);

    // Add all nodes as vertexes
    const it = parts.iterator;
    while (it.next()) {
      const part = it.value;
      if (part instanceof Node) {
        const vertex = net.addNode(part);
        const bounds = this.getLayoutBounds(part);
        vertex.bounds = bounds.copy();
        vertex.x = bounds.x;
        vertex.y = bounds.y;
      }
    }

    // Add all links as edges
    const linkIt = parts.iterator;
    while (linkIt.next()) {
      const part = linkIt.value;
      if (part instanceof Link) {
        net.addLink(part as Link);
      }
    }

    this._network = net;
    return net;
  }

  /**
   * Update the positions of parts after the layout has been computed.
   */
  updateParts(): void {
    this.commitLayout();
  }
}
