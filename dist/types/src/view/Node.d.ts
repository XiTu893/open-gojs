import { Part } from './Part';
import { GraphObject } from './GraphObject';
import { Link } from './Link';
import { List } from '../core/List';
import { Set } from '../core/Set';
import { Iterator } from '../core/Iterable';
import { Margin } from '../core/Margin';
import { Rect } from '../core/Rect';
import { EnumValue } from '../core/EnumValues';
/**
 * Node - a Part that can be connected by Links.
 * Represents a vertex in the graph structure.
 */
export declare class Node extends Part {
    static readonly className: string;
    /** 官方 `Node.SpreadingNone`（PortSpreading.None = 0） */
    static SpreadingNone: number;
    /** 官方 `Node.SpreadingEvenly`（PortSpreading.Evenly = 1，默认） */
    static SpreadingEvenly: number;
    /** 官方 `Node.SpreadingPacked`（PortSpreading.Packed = 2） */
    static SpreadingPacked: number;
    /** 官方 `Margin.xT` —— `Node.avoidableMargin` 的默认值 */
    private static readonly _defaultAvoidableMargin;
    protected _isTreeExpanded: boolean;
    protected _wasTreeExpanded: boolean;
    protected _isSubGraphExpanded: boolean;
    protected _treeExpandedDirection: EnumValue;
    private _avoidable;
    private _avoidableMargin;
    private _portSpreading;
    private _labeledLink;
    private _linkConnected;
    private _linkDisconnected;
    private _linkValidation;
    private _treeExpandedChanged;
    constructor(type?: any, init?: any);
    get isTreeExpanded(): boolean;
    set isTreeExpanded(val: boolean);
    get wasTreeExpanded(): boolean;
    set wasTreeExpanded(val: boolean);
    /** For compatibility with Group */
    get isSubGraphExpanded(): boolean;
    set isSubGraphExpanded(val: boolean);
    get treeExpandedDirection(): EnumValue;
    set treeExpandedDirection(val: EnumValue);
    /**
     * 官方 `Node.isTreeLeaf`（go.d.ts:24089 同时声明了 get 和 set）。
     * 官方把它当**存储字段**维护：模板里写 `isTreeLeaf: false` 会直接落到实例上，
     * 连接/断开 tree link 时再增量更新。
     * 本项目没有那套增量维护，所以默认回落到「按子节点动态算」；
     * 一旦样例显式 set 过，就以 set 的值为准。
     * 以前这里只有 getter，样例 `new go.Node('Spot', { isTreeLeaf: false })`
     * 会在 `GraphObject.set` 里抛 `which has only a getter`
     * （实测 OverviewResizing / incrementalTree 直接崩）。
     */
    private _isTreeLeafOverride;
    get isTreeLeaf(): boolean;
    set isTreeLeaf(val: boolean);
    /** Find all links connected to this node */
    findLinksConnected(): List<any>;
    findLinksInto(): List<any>;
    findLinksOutOf(): List<any>;
    findNodesConnected(): List<any>;
    findNodesInto(): List<any>;
    findNodesOutOf(): List<any>;
    /** Find a port element by name */
    findPortWithName(name: string): GraphObject | null;
    isInTreeOf(node: Node): boolean;
    findTreeParentNode(): Node | null;
    findTreeChildrenNodes(): List<Node>;
    findTreeParentLink(): any | null;
    findLevel(): number;
    findCommonParent(node: Node): Node | null;
    /** 官方 `Node.linksConnected`：与本节点相连的 Link 迭代器 */
    get linksConnected(): Iterator<Link>;
    /** 官方 `Node.portSpreading`（默认 PortSpreading.Evenly） */
    get portSpreading(): number;
    set portSpreading(val: number);
    /** 官方 `Node.avoidable`（默认 true，参与 AvoidsNodes 路由的避让） */
    get avoidable(): boolean;
    set avoidable(val: boolean);
    /** 官方 `Node.avoidableMargin`（默认 Margin(2,2,2,2)，接受 number） */
    get avoidableMargin(): Margin;
    set avoidableMargin(val: Margin | number);
    /** 官方 `Node.canAvoid()` */
    canAvoid(): boolean;
    /** 官方 `Node.getAvoidableRect(result)`：actualBounds 外扩 avoidableMargin */
    getAvoidableRect(result: Rect): Rect;
    /** 官方 `Node.findVisibleNode()`：沿 containingGroup 向上找到第一个可见的 */
    findVisibleNode(): Node | null;
    /** 官方 `Node.findVisiblePort(obj)` */
    findVisiblePort(obj: GraphObject | null): GraphObject;
    /**
     * 官方 `Node.findPort(pid)`：按 portId 查找端口，找不到时回退 `''`，再回退本节点。
     * 官方有 ports 缓存（pe），本项目每次重建视觉树（偏差：无缓存）。
     */
    findPort(pid: string): GraphObject;
    /** 官方 `Node.port` === `findPort("")` */
    get port(): GraphObject;
    /** 官方 `Node.ports`：全部命名端口的迭代器（无命名端口时只有本节点） */
    get ports(): Iterator<GraphObject>;
    private _collectPorts;
    /** 官方 `Node.isLinkLabel` */
    get isLinkLabel(): boolean;
    /** 官方 `Node.labeledLink` */
    get labeledLink(): Link | null;
    set labeledLink(val: Link | null);
    /** 官方 `Node.linkConnected` */
    get linkConnected(): ((node: Node, link: Link, port: any) => void) | null;
    set linkConnected(val: ((node: Node, link: Link, port: any) => void) | null);
    /** 官方 `Node.linkDisconnected` */
    get linkDisconnected(): ((node: Node, link: Link, port: any) => void) | null;
    set linkDisconnected(val: ((node: Node, link: Link, port: any) => void) | null);
    /** 官方 `Node.linkValidation` */
    get linkValidation(): ((node1: any, port1: any, node2: any, port2: any, link: Link | null) => boolean) | null;
    set linkValidation(val: ((node1: any, port1: any, node2: any, port2: any, link: Link | null) => boolean) | null);
    /** 官方 `Node.treeExpandedChanged` */
    get treeExpandedChanged(): ((node: Node) => void) | null;
    set treeExpandedChanged(val: ((node: Node) => void) | null);
    /** 官方 `Node.isTreeRoot`：没有指向自己的树链接即为根 */
    get isTreeRoot(): boolean;
    /** 官方 `Node.invalidateConnectedLinks(newkeys?, oldport?)` */
    invalidateConnectedLinks(newkeys?: Set<any> | null, oldport?: GraphObject | null): void;
    /**
     * 官方 `Node.invalidateLinkBundle(othernode, pid?, otherpid?)`：
     * 官方在 link bundles 里找到同端口对的 bundle 并置脏。
     * 本项目没有 link bundle 语义（偏差：保留签名，无操作）。
     */
    invalidateLinkBundle(_othernode?: Node | null, _pid?: string | null, _otherpid?: string | null): void;
    /** 官方 `Node.findLinksBetween(othernode, pid?, otherpid?)` */
    findLinksBetween(othernode: Node, pid?: string | null, otherpid?: string | null): Iterator<Link>;
    /** 官方 `Node.findLinksTo(othernode, pid?, otherpid?)` */
    findLinksTo(othernode: Node, pid?: string | null, otherpid?: string | null): Iterator<Link>;
    /** 官方 `Node.findSuccessorParts(newset?)`：沿出边可达的全部 Part（不含自身） */
    findSuccessorParts(newset?: Set<any>): Set<any>;
    private _collectSuccessorParts;
    /** 官方 `Node.findPredecessorParts(newset?)`：沿入边可达的全部 Part（不含自身） */
    findPredecessorParts(newset?: Set<any>): Set<any>;
    private _collectPredecessorParts;
    /**
     * 官方 `Node.findTreeParts(level?, newset?)`：
     * 从本节点沿**路径方向**（isTreePathToChildren ? 出边 : 入边）逐层收集节点与其链接，
     * level=1 只收集自身；level=2 再收集直接相邻的链接与邻居节点。
     */
    findTreeParts(level?: number, newset?: Set<any>): Set<any>;
    private _collectTreeParts;
    /** 官方 `Node.findTreeParentChain(newset?)`：自身 + 父链接 + 父节点…（带环保护） */
    findTreeParentChain(newset?: Set<any>): Set<any>;
    private _collectTreeParentChain;
    /** 官方 `Node.findTreeChildrenLinks()`：沿路径方向的子树链接 */
    findTreeChildrenLinks(): Iterator<Link>;
    /** 官方 `Node.findTreeLevel()`：父链上的节点数 */
    findTreeLevel(): number;
    /**
     * 官方 `Node.findTreeRoot()`：沿树链接向上走到根。
     * 官方逐条检查 `ai`（链接插入顺序）并排除 `this` 作为候选父节点，本项目按同样规则实现。
     */
    findTreeRoot(): Node;
    /** 官方 `Node.findCommonTreeParent(other)` */
    findCommonTreeParent(other: Node): Node | null;
    /** 官方 `Node.findExternalTreeLinksConnected()`：子树范围外的链接 */
    findExternalTreeLinksConnected(): Iterator<Link>;
    private _collectExternalTreeLinks;
    /**
     * 官方 `Node.collapseTree(level=1)`：把子树内节点的 isTreeExpanded 置为 false。
     * 偏差：本项目 `Part.isVisible()` 不受 isTreeExpanded 影响，也无 `diagram.isCollapsingExpanding`
     * 事务标记，因此这里只做状态位的递归更新，不改变可见性/不触发布局事务。
     */
    collapseTree(level?: number): void;
    private _collapseTreeWalk;
    /**
     * 官方 `Node.expandTree(level=2)`：把子树内节点的 isTreeExpanded 置为 true。
     * 偏差说明同 `collapseTree`。
     */
    expandTree(level?: number): void;
    private _expandTreeWalk;
    /** 官方 `Diagram.isTreePathToChildren`（默认 true） */
    private _isTreePathToChildren;
    /** Create a copy of this Node */
    copy(): Node;
}
