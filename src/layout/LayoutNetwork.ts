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

    const edge = this.linkVertexes(fromVertex, toVertex);
    edge.link = link;
    this.linkToLayoutEdge.set(link, edge);
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

  /** 官方 LayoutNetwork.addParts(parts, toplevelonly?, pred?): void */
  addParts(parts: any, toplevelonly?: boolean, pred?: ((a: any) => boolean) | null): void {
    const visit = (coll: any): void => {
      if (!coll) return;
      if (typeof coll.iterator === 'function') {
        const it = coll.iterator;
        while (it.next()) visit(it.value);
        return;
      }
      if (typeof coll.next === 'function') {
        while (coll.next()) visit(coll.value);
        return;
      }
      if (Array.isArray(coll)) {
        for (const p of coll) visit(p);
        return;
      }
      const part: any = coll;
      if (part === null || part === undefined) return;
      if (pred !== null && pred !== undefined && typeof pred === 'function' && !pred(part)) return;
      if (toplevelonly === true && typeof part.isTopLevel === 'boolean' && !part.isTopLevel) return;
      if (part instanceof Node) this.addNode(part);
      else if (part instanceof Link) this.addLink(part);
    };
    visit(parts);
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

  /** Create an edge connecting two vertexes */
  linkVertexes(fromVertex: LayoutVertex, toVertex: LayoutEdge | LayoutVertex): LayoutEdge {
    const edge = this.createEdge();
    edge.network = this;
    edge.fromVertex = fromVertex;
    edge.toVertex = toVertex as LayoutVertex;
    (toVertex as LayoutVertex).addSourceEdge(edge);
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
