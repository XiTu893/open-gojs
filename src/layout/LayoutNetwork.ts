import { List } from '../core/List';
import { Set } from '../core/Set';
import { Map } from '../core/Map';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { LayoutVertex } from './LayoutVertex';
import { LayoutEdge } from './LayoutEdge';

/**
 * LayoutNetwork - the graph structure used by layouts.
 * Contains vertexes (nodes) and edges (links) for layout computation.
 */
export class LayoutNetwork {
  static readonly className: string = "LayoutNetwork";
  /** The layout that owns this network */
  layout: any = null;

  /** All vertexes in this network */
  vertexes: List<LayoutVertex> = new List<LayoutVertex>();

  /** All edges in this network */
  edges: List<LayoutEdge> = new List<LayoutEdge>();

  /** Map from Link to LayoutEdge */
  linkToLayoutEdge: Map<Link, LayoutEdge> = new Map<Link, LayoutEdge>();

  /** Map from Node to LayoutVertex */
  nodeToLayoutVertex: Map<Node, LayoutVertex> = new Map<Node, LayoutVertex>();

  /** Create a new vertex (subclasses override to return specialized vertexes) */
  createVertex(): LayoutVertex {
    return new LayoutVertex();
  }

  /** Create a new edge (subclasses override to return specialized edges) */
  createEdge(): LayoutEdge {
    return new LayoutEdge();
  }

  /** Add a vertex to this network */
  addVertex(vertex: LayoutVertex): LayoutVertex {
    vertex.network = this;
    this.vertexes.add(vertex);
    return vertex;
  }

  /**
   * 把一批顶点/边重新挂回本网络（不重复登记边到 vertex 上）。
   *
   * `splitIntoSubNetworks()` 是**破坏性**的：它把顶点/边从本网络搬到子网络，
   * 拆完主网络就空了。但官方 CircularLayout 在 commitNodes()/commitLinks() 阶段
   * `this.network` 仍然持有全部 vertexes/edges —— 样例（friendWheel 的 WheelLayout 等）
   * 覆写里遍历 `this.network.vertexes` / `this.network.edges`，
   * 一旦是空列表，径向旋转和 link.curviness 就都失效。拆分只是分组手段，
   * 所以布局算完再挂回来。
   */
  reattach(vertexes: LayoutVertex[], edges: LayoutEdge[]): void {
    for (const v of vertexes) {
      v.network = this;
      this.vertexes.add(v);
    }
    for (const e of edges) {
      e.network = this;
      this.edges.add(e);
    }
  }

  /** Add an edge to this network (官方：toVertex.addSourceEdge, fromVertex.addDestinationEdge) */
  addEdge(edge: LayoutEdge): LayoutEdge {
    edge.network = this;
    this.edges.add(edge);
    if (edge.toVertex) {
      edge.toVertex.addSourceEdge(edge);
    }
    if (edge.fromVertex) {
      edge.fromVertex.addDestinationEdge(edge);
    }
    return edge;
  }

  /**
   * 官方 `LayoutNetwork.reverseEdge(edge)`：反转边方向并同步两个顶点的边列表
   * （`from.deleteDestinationEdge → to.deleteSourceEdge → edge.reverseEdge →
   *   from.addSourceEdge → to.addDestinationEdge`）。
   * 只交换 `edge.fromVertex/toVertex` 字段是不够的 —— 顶点的
   * sourceEdges/destinationEdges 是建网时存的列表，不跟着字段走；
   * 层号分配（memo 沿 destinationEdges 递归）读的是列表，
   * 环还在 → customExpandCollapse 栈溢出。
   */
  reverseEdge(edge: LayoutEdge): void {
    const f = edge.fromVertex;
    const t = edge.toVertex;
    if (f === null || t === null) return;
    f.deleteDestinationEdge(edge);
    t.deleteSourceEdge(edge);
    edge.reverseEdge();
    f.addSourceEdge(edge);
    t.addDestinationEdge(edge);
  }

  /** Add a link to the network, creating an edge between the from/to vertexes */
  addLink(link: Link): LayoutEdge | null {
    const fromNode = link.fromNode;
    const toNode = link.toNode;
    if (!fromNode || !toNode) return null;

    let fromVertex = this.findVertex(fromNode);
    if (!fromVertex) {
      fromVertex = this.addNode(fromNode);
    }
    let toVertex = this.findVertex(toNode);
    if (!toVertex) {
      toVertex = this.addNode(toNode);
    }

    const edge = this.linkVertexes(fromVertex, toVertex, link);
    if (edge === null) return null;
    return edge;
  }

  /** Add a node to the network, creating a vertex */
  addNode(node: Node): LayoutVertex {
    let vertex = this.findVertex(node);
    if (vertex) return vertex;

    vertex = this.createVertex();
    vertex.network = this;
    vertex.node = node;
    vertex.part = node;

    // Get bounds from the node
    const bounds = node.getDocumentBounds();
    vertex.bounds = bounds.copy();
    vertex.x = bounds.x;
    vertex.y = bounds.y;

    this.vertexes.add(vertex);
    this.nodeToLayoutVertex.set(node, vertex);
    return vertex;
  }

  /**
   * 官方 LayoutNetwork.addParts(coll, toplevelonly?, pred?): void
   * 官方是两阶段：先把**节点**入网（`Group.layout === null` 的组递归收成员，
   * 且递归时用默认谓词），再处理**连线** —— 连线端点用 `findGroupVertex`
   * 解析到「自身或网络中已有的最深祖先 vertex」，**不自动创建端点 vertex**；
   * 任一侧解析为 null 则跳过该连线。这正是 flowgrammer 组内布局
   * 不会把 L3→4 的端点 node4（属于嵌套组 -2）塞进组 -1 网络的原因。
   */
  addParts(coll: any, toplevelonly?: boolean, pred?: ((a: any) => boolean) | null): void {
    if (coll === null || coll === undefined) return;
    const toplevel = toplevelonly === true;
    const e = (pred !== null && pred !== undefined) ? pred : (n: any): boolean => {
      if (n instanceof Node) return !n.isLinkLabel;
      if (n instanceof Link) {
        const o = n.fromNode;
        if (o === null || o.isLinkLabel) return false;
        const r = n.toNode;
        return !(r === null || r.isLinkLabel);
      }
      return false;
    };
    const iterate = (fn: (n: any) => void): void => {
      const prop = (coll as any).iterator;
      if (typeof (coll as any).iterator === 'function') {
        const it = (coll as any).iterator();
        while (it.next()) fn(it.value);
        return;
      }
      if (prop && typeof prop.next === 'function') {
        while (prop.next()) fn(prop.value);
        return;
      }
      if (typeof (coll as any).next === 'function') {
        while ((coll as any).next()) fn((coll as any).value);
        return;
      }
      if (Array.isArray(coll)) {
        for (const n of coll) fn(n);
        return;
      }
      fn(coll);
    };
    // 阶段 1：节点
    iterate((n: any) => {
      if (!(n instanceof Node) || (toplevel && !n.isTopLevel)) return;
      if (typeof n.canLayout === 'function' && !n.canLayout()) return;
      if (!e(n)) return;
      // _className 判断等价 instanceof Group（避免 LayoutNetwork↔Group 循环依赖）
      if ((n as any)._className === 'Group' && (n as any).layout === null) {
        // 官方递归不透传 pred（组内成员按默认谓词收）
        this.addParts((n as any).memberParts, false);
        return;
      }
      if (this.findVertex(n) !== null) return;
      const o = this.createVertex();
      o.node = n;
      (o as any).part = n;
      this.addVertex(o);
    });
    // 阶段 2：连线
    iterate((n: any) => {
      if (!(n instanceof Link) || (toplevel && !n.isTopLevel)) return;
      if (typeof n.canLayout === 'function' && !n.canLayout()) return;
      if (!e(n)) return;
      if (this.findEdge(n) !== null) return;
      const o = n.fromNode;
      const r = n.toNode;
      if (o === null || r === null || o === r) return;
      this.linkVertexes(this.findGroupVertex(o), this.findGroupVertex(r), n);
    });
  }

  /**
   * 官方 LayoutNetwork.findGroupVertex(node)：
   * 端点解析为「自身（findVisibleNode）的 vertex，否则沿 containingGroup 向上
   * 找第一个已入网的祖先 vertex」，全都没有则 null。
   */
  findGroupVertex(node: any): LayoutVertex | null {
    if (node === null || node === undefined) return null;
    const i = (typeof node.findVisibleNode === 'function') ? node.findVisibleNode() : node;
    if (i === null) return null;
    let v = this.findVertex(i);
    if (v !== null) return v;
    let s = i.containingGroup;
    while (s !== null && s !== undefined) {
      v = this.findVertex(s);
      if (v !== null) return v;
      s = s.containingGroup;
    }
    return null;
  }

  /** 官方 LayoutNetwork.deleteVertex(vertex) */
  deleteVertex(vertex: LayoutVertex): void {
    if (!vertex) return;
    // 先摘掉相连的边
    const edges: LayoutEdge[] = [];
    let it = vertex.sourceEdges.iterator;
    while (it.next()) edges.push(it.value);
    it = vertex.destinationEdges.iterator;
    while (it.next()) edges.push(it.value);
    for (const e of edges) this.deleteEdge(e);
    this.vertexes.remove(vertex);
    if (vertex.node) this.nodeToLayoutVertex.remove(vertex.node);
  }

  /** 官方 LayoutNetwork.deleteNode(node) */
  deleteNode(node: Node): void {
    const v = this.findVertex(node);
    if (v) this.deleteVertex(v);
  }

  /** 官方 LayoutNetwork.deleteLink(link) */
  deleteLink(link: Link): void {
    const e = this.findEdge(link);
    if (e) this.deleteEdge(e);
  }

  /** 官方 LayoutNetwork.findAllParts(): Set<Part> */
  findAllParts(): Set<any> {
    const s = new Set<any>();
    let it = this.vertexes.iterator;
    while (it.next()) {
      const v = it.value;
      if (v.node) s.add(v.node);
      else if (v.part) s.add(v.part);
    }
    it = this.edges.iterator as any;
    while (it.next()) {
      const e: any = it.value;
      if (e.link) s.add(e.link);
    }
    return s;
  }

  /** Delete all artificial vertexes from the network */
  deleteArtificialVertexes(): void {
    const toRemove: LayoutVertex[] = [];
    const it = this.vertexes.iterator;
    while (it.next()) {
      const v = it.value;
      if (v._isArtificial) {
        toRemove.push(v);
      }
    }
    for (const v of toRemove) {
      // Remove all edges connected to this vertex
      const edgesToRemove: LayoutEdge[] = [];
      const srcIt = v.sourceEdges.iterator;
      while (srcIt.next()) {
        edgesToRemove.push(srcIt.value);
      }
      const dstIt = v.destinationEdges.iterator;
      while (dstIt.next()) {
        edgesToRemove.push(dstIt.value);
      }
      for (const e of edgesToRemove) {
        this.deleteEdge(e);
      }
      this.vertexes.remove(v);
    }
  }

  /** Delete self-loop edges (where fromVertex === toVertex) */
  deleteSelfEdges(): void {
    const toRemove: LayoutEdge[] = [];
    const it = this.edges.iterator;
    while (it.next()) {
      const e = it.value;
      if (e.fromVertex === e.toVertex) {
        toRemove.push(e);
      }
    }
    for (const e of toRemove) {
      this.deleteEdge(e);
    }
  }

  /** Find the vertex associated with a node */
  findVertex(node: Node): LayoutVertex | null {
    return this.nodeToLayoutVertex.get(node) || null;
  }

  /** Find the edge associated with a link */
  findEdge(link: Link): LayoutEdge | null {
    return this.linkToLayoutEdge.get(link) || null;
  }

  /**
   * 官方 LayoutNetwork.linkVertexes(fromVertex, toVertex, link?)：
   * 任一侧为 null 直接返回 null（不建点）；带 link 时登记 link→edge 映射。
   */
  linkVertexes(fromVertex: LayoutVertex | null, toVertex: LayoutVertex | null, link?: Link | null): LayoutEdge | null {
    if (fromVertex === null || toVertex === null) return null;
    const edge = this.createEdge();
    edge.network = this;
    edge.fromVertex = fromVertex;
    edge.toVertex = toVertex;
    if (link !== null && link !== undefined) {
      edge.link = link;
      this.linkToLayoutEdge.set(link, edge);
    }
    toVertex.addSourceEdge(edge);
    fromVertex.addDestinationEdge(edge);
    this.edges.add(edge);
    return edge;
  }

  /** Delete an edge from the network */
  deleteEdge(edge: LayoutEdge): void {
    if (edge.toVertex) {
      edge.toVertex.sourceEdges.remove(edge);
    }
    if (edge.fromVertex) {
      edge.fromVertex.destinationEdges.remove(edge);
    }
    this.edges.remove(edge);
    if (edge.link) {
      this.linkToLayoutEdge.remove(edge.link);
    }
  }

  /**
   * 官方 `LayoutNetwork.splitIntoSubNetworks()` 的连通分量拆分（对照官方 `F4`）：
   * 只在“本网络 → 子网络”之间搬移顶点/边的归属，不改动顶点上的
   * `sourceEdges`/`destinationEdges`。
   * 旧实现在遍历 `v.sourceEdges` 的同时调用 `addEdge`（又会向同一 List 追加该边），
   * 导致 List 无限增长直至 `RangeError: Invalid array length`。
   */
  splitIntoSubNetworks(): List<LayoutNetwork> {
    const result = new List<LayoutNetwork>();
    if (this.vertexes.count === 0) return result;

    const starts = this.vertexes.toArray();
    for (const startVertex of starts) {
      if (startVertex.network !== this) continue; // 已归入其它子网络

      const component = new LayoutNetwork();
      component.layout = this.layout;
      const stack: LayoutVertex[] = [startVertex];

      while (stack.length > 0) {
        const v = stack.pop()!;
        if (v.network === component) continue;
        this.vertexes.remove(v);
        component.addVertex(v);

        // sourceEdges：v 是终点，另一端是 fromVertex
        const srcIt = v.sourceEdges.iterator;
        while (srcIt.next()) {
          const e = srcIt.value;
          if (e.network !== component) {
            this._moveEdgeTo(e, component);
            if (e.fromVertex) stack.push(e.fromVertex);
          }
        }

        // destinationEdges：v 是起点，另一端是 toVertex
        const dstIt = v.destinationEdges.iterator;
        while (dstIt.next()) {
          const e = dstIt.value;
          if (e.network !== component) {
            this._moveEdgeTo(e, component);
            if (e.toVertex) stack.push(e.toVertex);
          }
        }
      }

      result.add(component);
    }

    return result;
  }

  /** 官方 `bA(edge)` + `xA(edge)`：把边从原网络搬进目标网络（不动顶点边表） */
  private _moveEdgeTo(edge: LayoutEdge, target: LayoutNetwork): void {
    if (edge.network && edge.network !== target) edge.network.edges.remove(edge);
    if (!target.edges.contains(edge)) target.edges.add(edge);
    edge.network = target;
  }
}
