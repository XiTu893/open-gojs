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
  set arrangementOrigin(val: Point) { this._arrangementOrigin = val.copy(); this.invalidateLayout(); }

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
   * 官方 base Layout.doLayout：收集未定位的顶层部件（doMinimalNoNetworkLayout 的 Ga 谓词），
   * 按 ceil(sqrt(n)) 列的极简网格摆放（仅对 location/position 均为 NaN 的部件）。
   * @param coll - A Diagram, Group, Iterable<Part>, or array of Parts
   */
  doLayout(coll: any): void {
    const parts = this.collectMinimalParts(coll);
    if (parts.length > 0) {
      this.doMinimalNoNetworkLayout(parts);
    }
    this.isValidLayout = true;
  }

  /**
   * 官方 Layout.Zh（base 版收集，谓词 = Ga(t)）：
   * - Diagram：nodes(topLevelOnly) + parts(topLevelOnly) 两趟
   * - Group：memberParts(topLevelOnly=false)
   * - 其他可迭代集合：addAll，不带谓词
   * 谓词 Ga(t) = (!location实值 && !position实值) || (Group && t.Ga)
   * Node 分支：Group.layout===null 时递归 memberParts；其余 ensureBounds 后加入。
   */
  collectMinimalParts(coll: any): Part[] {
    const out: Part[] = [];
    const seen = new Set<Part>();
    if (!coll) return out;

    const ga = (h: any): boolean => {
      const loc = h.location;
      const pos = h.position;
      const locReal = loc && !isNaN(loc.x) && !isNaN(loc.y);
      const posReal = pos && !isNaN(pos.x) && !isNaN(pos.y);
      return (!locReal && !posReal) || (h._className === 'Group' && h.Ga === true);
    };

    const add = (h: any): void => {
      if (seen.has(h)) return;
      seen.add(h);
      out.push(h);
    };

    const zh = (it: any, topLevelOnly: boolean): void => {
      if (!it) return;
      while (it.next && it.next()) {
        const h: any = it.value;
        if (topLevelOnly && !h.isTopLevel) continue;
        if (!ga(h)) continue;
        if (typeof h.canLayout === 'function' ? !h.canLayout() : (h.isLayoutPositioned === false || h.visible === false)) continue;
        if (h instanceof Node) {
          if ((h as any).isLinkLabel) continue;
          if ((h as any)._className === 'Group' && (h as any).layout === null) {
            zh((h as any).memberParts.iterator, false);
          } else {
            h.ensureBounds();
            add(h);
          }
        } else if (!(h instanceof Link)) {
          h.ensureBounds();
          add(h);
        }
      }
    };

    if (coll._layers !== undefined || (typeof coll.nodes !== 'undefined' && typeof coll.links !== 'undefined')) {
      // Diagram：nodes + parts 两趟（均为 topLevelOnly）
      zh(coll.nodes, true);
      if (coll.parts) zh(coll.parts, true);
    } else if (coll.memberParts !== undefined) {
      // Group
      zh(coll.memberParts.iterator, false);
    } else if (Array.isArray(coll)) {
      for (const p of coll) add(p);
    } else if (coll.iterator) {
      const it2 = coll.iterator;
      while (it2.next()) add(it2.value);
    } else if (typeof coll.next === 'function') {
      zh(coll, false);
    }
    return out;
  }

  /**
   * 官方 Layout.doMinimalNoNetworkLayout：
   * arrangementOrigin = initialOrigin(arrangementOrigin)（原地变更），
   * cols = ceil(sqrt(n))，步长 max(w,50)+20，行高 max(max(h,50))，moveTo 后 Group.Ga=false。
   */
  doMinimalNoNetworkLayout(parts: Part[]): void {
    const count = parts.length;
    if (count === 0) return;
    const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
    this._arrangementOrigin = this.initialOrigin(this._arrangementOrigin);
    const sx = this._arrangementOrigin.x;
    const sy = this._arrangementOrigin.y;
    let x = sx;
    let y = sy;
    let col = 0;
    let rowH = 0;
    for (const c of parts) {
      c.ensureBounds();
      const f = c.measuredBounds;
      const w = f ? f.width : 0;
      const h = f ? f.height : 0;
      c.moveTo(x, y);
      if ((c as any)._className === 'Group') {
        (c as any).Ga = false;
      }
      x += Math.max(w, 50) + 20;
      rowH = Math.max(rowH, Math.max(h, 50));
      if (col >= cols - 1) {
        col = 0;
        x = sx;
        y += rowH + 20;
        rowH = 0;
      } else {
        col++;
      }
    }
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
   * 官方 Layout.initialOrigin：
   * - group 有 placeholder → placeholder 文档 TopLeft（NaN → 回退 origin）+ padding
   * - group 无 placeholder → group.position（NaN → 回退 origin）
   * - 无 group → origin
   */
  initialOrigin(t?: Point): Point {
    const origin = t ? t : this._arrangementOrigin;
    const g = this._group;
    if (g) {
      const ph = this._findPlaceholder(g);
      if (ph) {
        // 文档坐标 = group.position（NaN 不计入，视作 0）+ placeholder 局部链偏移
        const local = this._panelLocalPoint(g, ph);
        const pos = g.position;
        let sx = local ? local.x : NaN;
        let sy = local ? local.y : NaN;
        if (pos && !isNaN(pos.x) && !isNaN(pos.y)) {
          sx += pos.x;
          sy += pos.y;
        }
        if (isNaN(sx) || isNaN(sy)) {
          sx = origin.x;
          sy = origin.y;
        }
        const pad = typeof ph._padding === 'number' ? ph._padding : 0;
        return new Point(sx + pad, sy + pad);
      }
      const pos = g.position;
      if (pos && !isNaN(pos.x) && !isNaN(pos.y)) return pos.copy();
      return origin.copy();
    }
    return origin.copy();
  }

  private _findPlaceholder(group: any): any | null {
    const search = (obj: any): any | null => {
      if (!obj) return null;
      if (obj._isPlaceholder) return obj;
      const els = obj._elements;
      if (els) {
        for (const ch of els) {
          const r = search(ch);
          if (r) return r;
        }
      }
      return null;
    };
    return search(group);
  }

  /** target 在 group 面板内的局部偏移（沿 actualBounds 局部链累加）；找不到 → null */
  private _panelLocalPoint(group: any, target: any): Point | null {
    const contains = (o: any): boolean =>
      o === target || (o._elements ? o._elements.some((c: any) => contains(c)) : false);
    const acc = (obj: any, px: number, py: number): Point | null => {
      const els = obj._elements;
      if (!els) return null;
      for (const ch of els) {
        const ab = ch.actualBounds;
        const nx = px + (ab ? ab.x : NaN);
        const ny = py + (ab ? ab.y : NaN);
        if (ch === target) return new Point(nx, ny);
        if (ch._elements && contains(ch)) {
          const r = acc(ch, nx, ny);
          if (r) return r;
        }
      }
      return null;
    };
    return acc(group, 0, 0);
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
        if (part._measure) {
          part._measure(Infinity, Infinity);
        }
        let bounds = this.getLayoutBounds(part);
        const mb = part.measuredBounds;
        if (mb && mb.width > 0 && mb.height > 0) {
          bounds = new Rect(bounds.x, bounds.y, mb.width, mb.height);
        }
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
