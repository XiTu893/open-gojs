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
    reattach(vertexes: LayoutVertex[], edges: LayoutEdge[]): void;
    /** Add an edge to this network (官方：toVertex.addSourceEdge, fromVertex.addDestinationEdge) */
    addEdge(edge: LayoutEdge): LayoutEdge;
    /**
     * 官方 `LayoutNetwork.reverseEdge(edge)`：反转边方向并同步两个顶点的边列表
     * （`from.deleteDestinationEdge → to.deleteSourceEdge → edge.reverseEdge →
     *   from.addSourceEdge → to.addDestinationEdge`）。
     * 只交换 `edge.fromVertex/toVertex` 字段是不够的 —— 顶点的
     * sourceEdges/destinationEdges 是建网时存的列表，不跟着字段走；
     * 层号分配（memo 沿 destinationEdges 递归）读的是列表，
     * 环还在 → customExpandCollapse 栈溢出。
     */
    reverseEdge(edge: LayoutEdge): void;
    /** Add a link to the network, creating an edge between the from/to vertexes */
    addLink(link: Link): LayoutEdge | null;
    /** Add a node to the network, creating a vertex */
    addNode(node: Node): LayoutVertex;
    /**
     * 官方 LayoutNetwork.addParts(coll, toplevelonly?, pred?): void
     * 官方是两阶段：先把**节点**入网（`Group.layout === null` 的组递归收成员，
     * 且递归时用默认谓词），再处理**连线** —— 连线端点用 `findGroupVertex`
     * 解析到「自身或网络中已有的最深祖先 vertex」，**不自动创建端点 vertex**；
     * 任一侧解析为 null 则跳过该连线。这正是 flowgrammer 组内布局
     * 不会把 L3→4 的端点 node4（属于嵌套组 -2）塞进组 -1 网络的原因。
     */
    addParts(coll: any, toplevelonly?: boolean, pred?: ((a: any) => boolean) | null): void;
    /**
     * 官方 LayoutNetwork.findGroupVertex(node)：
     * 端点解析为「自身（findVisibleNode）的 vertex，否则沿 containingGroup 向上
     * 找第一个已入网的祖先 vertex」，全都没有则 null。
     */
    findGroupVertex(node: any): LayoutVertex | null;
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
    /**
     * 官方 LayoutNetwork.linkVertexes(fromVertex, toVertex, link?)：
     * 任一侧为 null 直接返回 null（不建点）；带 link 时登记 link→edge 映射。
     */
    linkVertexes(fromVertex: LayoutVertex | null, toVertex: LayoutVertex | null, link?: Link | null): LayoutEdge | null;
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
