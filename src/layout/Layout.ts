import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { List } from '../core/List';
import { Set } from '../core/Set';
import { Part } from '../view/Part';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { Group } from '../view/Group';
import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';

/**
 * Layout - base class for all layout algorithms.
 * Subclasses must override doLayout() to implement specific layout algorithms.
 */
export class Layout {
  static readonly className: string = "Layout";

  // ============ Protected property storage ============
  protected _arrangementOrigin: Point = new Point(0, 0);
  protected _isInitial: boolean = true;
  protected _isOngoing: boolean = true;
  protected _isRealtime: boolean = true;
  protected _isRouting: boolean = true;
  /** 官方 `Tg=!1`：Layout 构造默认无效（首次 _performLayout 才跑） */
  protected _isValidLayout: boolean = false;
  protected _isViewportSized: boolean = false;
  /** 官方签名 `(part, lay, rect) => rect` */
  protected _boundsComputation: ((part: Part, layout: Layout, bounds: Rect) => Rect) | null = null;
  protected _network: LayoutNetwork | null = null;
  protected _diagram: any = null;
  protected _group: any = null;

  /** 官方 `Layout.constructor(init?)`：`t && Object.assign(this, t)` */
  constructor(init?: any) {
    if (init) Object.assign(this, init);
  }

  // ============ Properties ============

  get arrangementOrigin(): Point { return this._arrangementOrigin; }
  set arrangementOrigin(val: Point) { this._arrangementOrigin = val.copy(); this.invalidateLayout(); }

  get isInitial(): boolean { return this._isInitial; }
  /** 官方 `set isInitial(t){...; t||(this.Tg=!0)}`：置 false 立即视为已有效 → 跳过初始布局 */
  set isInitial(val: boolean) {
    this._isInitial = val;
    if (!val) this._isValidLayout = true;
  }

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

  get boundsComputation(): ((part: Part, layout: Layout, bounds: Rect) => Rect) | null {
    return this._boundsComputation;
  }
  set boundsComputation(val: ((part: Part, layout: Layout, bounds: Rect) => Rect) | null) {
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
    // 官方用的是 GSet：Diagram 入参时 nodes / links / parts 三份一起收，
    // `parts` 里已经包含全部 node 与 link，靠 Set 去重才不会重复收集。
    // 我们以前用 List，同一个 part 会被收两遍 —— friendWheel 的 60 节点 120 连线
    // 变成 collectParts=360、网络里 240 条边，半径算错、link.curviness 被覆写两次。
    const seen = new Set<Part>();
    const parts = new List<Part>();

    if (!coll) return parts;

    // 官方 Layout.collectParts（go.js: collectParts + 私有 Ka）：
    //  - Diagram 入参：分别遍历 nodes / links / parts 三份，且**只收 isTopLevel** 的；
    //  - Group 入参：遍历 memberParts，不做 top-level 过滤；
    //  - 其它可迭代对象：直接遍历。
    //  - 过滤条件是 canLayout()，**不是** isLayoutPositioned/visible；
    //  - Node 里 isLinkLabel 跳过；`Group` 且 `layout === null` 时
    //    **递归收它的成员**而不是收这个组本身。
    //
    // 以前我们是「遍历所有非临时层 + isLayoutPositioned && visible」，既没收窄到
    // top-level、也不处理 Group 递归 —— flowgrammer 里组内成员被一起塞进网络，
    // ParallelLayout.findSplitMerge 因此看到两个 Split 分类的节点并抛
    // "Split node already exists in TreeLayout(...)"。
    if (coll._layers) {
      const diagram = coll as any;
      this._diagram = diagram;
      this._collectInto(seen, parts, diagram.nodes, true);
      this._collectInto(seen, parts, diagram.links, true);
      this._collectInto(seen, parts, diagram.parts, true);
      return parts;
    }

    if (coll instanceof Group) {
      this._collectInto(seen, parts, (coll as any).memberParts, false);
      return parts;
    }

    this._collectInto(seen, parts, coll, false);
    return parts;
  }

  /** 官方 collectParts 内部的收集过程（对应官方私有 Ka 方法） */
  private _collectInto(seen: Set<Part>, out: List<Part>, coll: any, toplevelonly: boolean): void {
    if (!coll) return;
    const it: any = (typeof coll.iterator === 'function')
      ? coll.iterator()
      : (coll.iterator && typeof coll.iterator.next === 'function' ? coll.iterator : null);
    if (!it) return;
    while (it.next()) {
      const part: any = it.value;
      if (!part) continue;
      if (seen.contains(part)) continue; // diagram.parts 里已有的 node/link 不再收第二遍
      if (toplevelonly && part.isTopLevel === false) continue;
      // 官方的 collectParts 不看 visible，但本项目里临时层（Adornment 等）的 part
      // 也会被 diagram.parts 带进来；不排除不可见件会让布局凭空多出占位
      // （实测 shapes 20.5% → 31.6%）。这里保留原有的 visible 过滤。
      if (part.visible === false) continue;
      if (typeof part.canLayout === 'function' && !part.canLayout()) continue;
      if (part instanceof Node) {
        if (part.isLinkLabel) continue;
        if (part instanceof Group && (part as any).layout === null) {
          this._collectInto(seen, out, (part as any).memberParts, false);
          continue;
        }
        if (typeof part.ensureBounds === 'function') part.ensureBounds();
        seen.add(part);
        out.add(part);
      } else if (part instanceof Link) {
        seen.add(part);
        out.add(part);
      } else {
        if (typeof part.ensureBounds === 'function') part.ensureBounds();
        seen.add(part);
        out.add(part);
      }
    }
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
   * 官方 `Layout.cloneProtected`：把受保护字段复制到一个已构造好的新实例。
   * 官方实现：`t.Tg=this.Tg, t.Kr=this.Kr, t.Lg=this.Lg, t.Dg.f(this.Dg), t.vo=this.vo, t.Il=this.Il, t.Fg=this.Fg, t.Rg=!0`
   * （字段名对应 isInitial/isOngoing/isRealtime/arrangementOrigin/isRouting/isViewportSized/boundsComputation/isValidLayout）
   */
  protected cloneProtected(copy: Layout): void {
    copy._arrangementOrigin = this._arrangementOrigin.copy();
    copy._isInitial = this._isInitial;
    copy._isOngoing = this._isOngoing;
    copy._isRealtime = this._isRealtime;
    copy._isRouting = this._isRouting;
    // 官方 `t.Rg=!0`：copy 出的布局视为已有效
    copy._isValidLayout = true;
    copy._isViewportSized = this._isViewportSized;
    copy._boundsComputation = this._boundsComputation;
  }

  /**
   * Create a copy of this layout.
   * 官方：`const t = new this.constructor; return this.cloneProtected(t), t`
   */
  copy(): Layout {
    const copy = new (this.constructor as new () => any)();
    this.cloneProtected(copy);
    return copy;
  }

  /**
   * 官方 `Layout.toString()`：
   * `U.to(this.constructor) + "()"`，若 `group !== null` 追加 `" in " + group`，若 `diagram !== null` 追加 `" for " + diagram`。
   */
  toString(): string {
    const ctor = this.constructor as { className?: string };
    let s = (ctor.className || 'Layout') + '(';
    if (this.group !== null && this.group !== undefined) s += ' in ' + this.group;
    if (this.diagram !== null && this.diagram !== undefined) s += ' for ' + this.diagram;
    s += ')';
    return s;
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
   * 官方 `Layout.getLayoutBounds(t, rect?)`（go.js）：
   *   boundsComputation 非空 → bc(t, this, rect)；
   *   否则 rect.set(t.actualBounds); rect.addMargin(t.margin)（margin 全 0 快路返回 actualBounds）。
   * kanban 泳道 Group margin (0,2) → 宽 162+4=166（步进 166），漏 margin 会得 162。
   * @param part - The part to get bounds for
   */
  getLayoutBounds(part: Part): Rect {
    const bounds = part.getDocumentBounds();
    if (this._boundsComputation) {
      return this._boundsComputation(part, this, bounds);
    }
    const m = part.margin;
    if (!m.equalTo(0, 0, 0, 0)) bounds.addMargin(m);
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
   *
   * 官方 `Layout.invalidateLayout()` 三重护栏：
   * 1) 已无效 → 直接返回（幂等）；
   * 2) undo/redo 期间返回；
   * 3) 动画 tick 期间返回（官方 `i.isTicking || (...)`）——否则动画回写 location 每帧都会重排。
   * 之后才按 `(isOngoing && diagram 已完成首排) || (isInitial && 未完成首排)` 置无效
   * （官方 `t.ga` = Diagram 已完成一次 update/首排；此处用 `_hasPerformedInitialLayout` 近似）。
   */
invalidateLayout(): void {
    if (!this._isValidLayout) return;
    const d: any = this._diagram;
    if (d) {
      if (d.undoManager && d.undoManager.isUndoingRedoing) return;
      const am = d.animationManager;
      if (am && am.isTicking) return;
      if (am && am.defaultAnimation && am.defaultAnimation.isAnimating) am.stopAnimation();
      const done = !!d._hasPerformedInitialLayout;
      if ((this._isOngoing && done) || (this._isInitial && !done)) {
        this._isValidLayout = false;
        d._layoutInvalid = true;
        if (typeof d.requestUpdate === 'function') d.requestUpdate();
      }
    } else {
      this._isValidLayout = false;
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

    // Add all links as edges（官方 addParts 阶段 2：findGroupVertex 解析端点，
    // 不自动建端点 vertex；任一侧为 null 则跳过）
    const linkIt = parts.iterator;
    while (linkIt.next()) {
      const part = linkIt.value;
      if (part instanceof Link) {
        const link = part as Link;
        const fn: any = link.fromNode;
        const tn: any = link.toNode;
        if (!fn || !tn || fn === tn) continue;
        net.linkVertexes(net.findGroupVertex(fn), net.findGroupVertex(tn), link);
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
