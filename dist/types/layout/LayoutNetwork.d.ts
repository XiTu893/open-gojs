import { List } from '../core/List';
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
    /** Add a vertex to this network */
    addVertex(vertex: LayoutVertex): LayoutVertex;
    /** Add an edge to this network */
    addEdge(edge: LayoutEdge): LayoutEdge;
    /** Add a link to the network, creating an edge between the from/to vertexes */
    addLink(link: Link): LayoutEdge | null;
    /** Add a node to the network, creating a vertex */
    addNode(node: Node): LayoutVertex;
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
    /** Split this network into sub-networks of connected components */
    splitIntoSubNetworks(): List<LayoutNetwork>;
}
