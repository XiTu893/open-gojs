import { List } from '../core/List';
import { Map } from '../core/Map';
import { Set } from '../core/Set';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { LayoutVertex } from './LayoutVertex';
import { LayoutEdge } from './LayoutEdge';

/**
 * LayoutNetwork - the graph structure used by layouts.
 * Contains vertexes (nodes) and edges (links) for layout computation.
 */
export class LayoutNetwork {
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

  /** Add a vertex to this network */
  addVertex(vertex: LayoutVertex): LayoutVertex {
    vertex.network = this;
    this.vertexes.add(vertex);
    return vertex;
  }

  /** Add an edge to this network */
  addEdge(edge: LayoutEdge): LayoutEdge {
    edge.network = this;
    this.edges.add(edge);
    if (edge.fromVertex) {
      edge.fromVertex.addSourceEdge(edge);
    }
    if (edge.toVertex) {
      edge.toVertex.addDestinationEdge(edge);
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

    vertex = new LayoutVertex();
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
    const edge = new LayoutEdge();
    edge.network = this;
    edge.fromVertex = fromVertex;
    edge.toVertex = toVertex as LayoutVertex;
    fromVertex.addSourceEdge(edge);
    (toVertex as LayoutVertex).addDestinationEdge(edge);
    this.edges.add(edge);
    return edge;
  }

  /** Delete an edge from the network */
  deleteEdge(edge: LayoutEdge): void {
    if (edge.fromVertex) {
      edge.fromVertex.sourceEdges.remove(edge);
    }
    if (edge.toVertex) {
      edge.toVertex.destinationEdges.remove(edge);
    }
    this.edges.remove(edge);
    if (edge.link) {
      this.linkToLayoutEdge.remove(edge.link);
    }
  }

  /** Split this network into sub-networks of connected components */
  splitIntoSubNetworks(): List<LayoutNetwork> {
    const result = new List<LayoutNetwork>();
    if (this.vertexes.count === 0) return result;

    const visited = new Set<LayoutVertex>();

    const it = this.vertexes.iterator;
    while (it.next()) {
      const startVertex = it.value;
      if (visited.has(startVertex)) continue;

      // BFS to find all connected vertexes
      const component = new LayoutNetwork();
      component.layout = this.layout;
      const queue: LayoutVertex[] = [startVertex];
      visited.add(startVertex);

      while (queue.length > 0) {
        const v = queue.shift()!;
        component.addVertex(v);

        // Traverse source edges
        const srcIt = v.sourceEdges.iterator;
        while (srcIt.next()) {
          const e = srcIt.value;
          if (e.toVertex && !visited.has(e.toVertex)) {
            visited.add(e.toVertex);
            queue.push(e.toVertex);
          }
          component.addEdge(e);
        }

        // Traverse destination edges
        const dstIt = v.destinationEdges.iterator;
        while (dstIt.next()) {
          const e = dstIt.value;
          if (e.fromVertex && !visited.has(e.fromVertex)) {
            visited.add(e.fromVertex);
            queue.push(e.fromVertex);
          }
          if (!component.edges.contains(e)) {
            component.addEdge(e);
          }
        }
      }

      result.add(component);
    }

    return result;
  }
}
