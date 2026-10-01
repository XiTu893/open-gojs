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
export declare class LayoutNetwork {
    static readonly className: string;
    /** The layout that owns this network */
    layout: any;
    /** All vertexes in this network */
    vertexes: List<LayoutVertex>;
    /** All edges in this network */
    edges: List<LayoutEdge>;
    /** Map from Link to LayoutEdge */
    linkToLayoutEdge: Map<Link, LayoutEdge>;
    /** Map from Node to LayoutVertex */
    nodeToLayoutVertex: Map<Node, LayoutVertex>;
    /** Create a new vertex (subclasses override to return specialized vertexes) */
    createVertex(): LayoutVertex;
    /** Create a new edge (subclasses override to return specialized edges) */
    createEdge(): LayoutEdge;
    /** Add a vertex to this network */
    addVertex(vertex: LayoutVertex): LayoutVertex;
    /** Add an edge to this network (官方：toVertex.addSourceEdge, fromVertex.addDestinationEdge) */
    addEdge(edge: LayoutEdge): LayoutEdge;
    /** Add a link to the network, creating an edge between the from/to vertexes */
    addLink(link: Link): LayoutEdge | null;
    /** Add a node to the network, creating a vertex */
    addNode(node: Node): LayoutVertex;
    /** 官方 LayoutNetwork.addParts(parts, toplevelonly?, pred?): void */
    addParts(parts: any, toplevelonly?: boolean, pred?: ((a: any) => boolean) | null): void;
    /** 官方 LayoutNetwork.deleteVertex(vertex) */
    deleteVertex(vertex: LayoutVertex): void;
    /** 官方 LayoutNetwork.deleteNode(node) */
    deleteNode(node: Node): void;
    /** 官方 LayoutNetwork.deleteLink(link) */
    deleteLink(link: Link): void;
    /** 官方 LayoutNetwork.findAllParts(): Set<Part> */
    findAllParts(): Set<any>;
    /** Delete all artificial vertexes from the network */
    deleteArtificialVertexes(): void;
    /** Delete self-loop edges (where fromVertex === toVertex) */
    deleteSelfEdges(): void;
    /** Find the vertex associated with a node */
    findVertex(node: Node): LayoutVertex | null;
    /** Find the edge associated with a link */
    findEdge(link: Link): LayoutEdge | null;
    /** Create an edge connecting two vertexes */
    linkVertexes(fromVertex: LayoutVertex, toVertex: LayoutEdge | LayoutVertex): LayoutEdge;
    /** Delete an edge from the network */
    deleteEdge(edge: LayoutEdge): void;
    /**
     * 官方 `LayoutNetwork.splitIntoSubNetworks()` 的连通分量拆分（对照官方 `F4`）：
     * 只在“本网络 → 子网络”之间搬移顶点/边的归属，不改动顶点上的
     * `sourceEdges`/`destinationEdges`。
     * 旧实现在遍历 `v.sourceEdges` 的同时调用 `addEdge`（又会向同一 List 追加该边），
     * 导致 List 无限增长直至 `RangeError: Invalid array length`。
     */
    splitIntoSubNetworks(): List<LayoutNetwork>;
    /** 官方 `bA(edge)` + `xA(edge)`：把边从原网络搬进目标网络（不动顶点边表） */
    private _moveEdgeTo;
}
