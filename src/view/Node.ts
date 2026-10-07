import { Part } from './Part';
import { GraphObject } from './GraphObject';
import { Panel } from './Panel';
import { Link } from './Link';
import { List } from '../core/List';
import { Set } from '../core/Set';
import { Map } from '../core/Map';
import { Iterator } from '../core/Iterable';
import { Margin } from '../core/Margin';
import { Rect } from '../core/Rect';
import { EnumValue, TreeStyleLayered, PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable, PanelPosition, PanelGrid, PanelLink } from '../core/EnumValues';
import { TreeModel } from '../model/TreeModel';
import { GraphLinksModel } from '../model/GraphLinksModel';

/**
 * Node - a Part that can be connected by Links.
 * Represents a vertex in the graph structure.
 */
export class Node extends Part {
  static readonly className: string = "Node";

  /** 官方 `Node.SpreadingNone`（PortSpreading.None = 0） */
  static SpreadingNone = 0;
  /** 官方 `Node.SpreadingEvenly`（PortSpreading.Evenly = 1，默认） */
  static SpreadingEvenly = 1;
  /** 官方 `Node.SpreadingPacked`（PortSpreading.Packed = 2） */
  static SpreadingPacked = 2;

  /** 官方 `Margin.xT` —— `Node.avoidableMargin` 的默认值 */
  private static readonly _defaultAvoidableMargin: Margin = new Margin(2, 2, 2, 2);

  // ============ Private property storage ============
  protected _isTreeExpanded: boolean = true;
  protected _wasTreeExpanded: boolean = false;
  protected _isSubGraphExpanded: boolean = true;
  protected _treeExpandedDirection: EnumValue = TreeStyleLayered;
  private _avoidable: boolean = true;
  private _avoidableMargin: Margin | null = null;
  private _portSpreading: number = Node.SpreadingEvenly;
  private _labeledLink: Link | null = null;
  private _linkConnected: ((node: Node, link: Link, port: any) => void) | null = null;
  private _linkDisconnected: ((node: Node, link: Link, port: any) => void) | null = null;
  private _linkValidation: ((node1: any, port1: any, node2: any, port2: any, link: Link | null) => boolean) | null = null;
  private _treeExpandedChanged: ((node: Node) => void) | null = null;

  constructor(type?: any, init?: any) {
    const [t, i] = Panel._resolveArgs(type, init);
    super(t, undefined);
    this._className = 'Node';
    if (i) {
      this.set(i);
    }
  }

  // ============ Properties ============

  get isTreeExpanded(): boolean { return this._isTreeExpanded; }
  set isTreeExpanded(val: boolean) { this._isTreeExpanded = val; }

  get wasTreeExpanded(): boolean { return this._wasTreeExpanded; }
  set wasTreeExpanded(val: boolean) { this._wasTreeExpanded = val; }

  /** For compatibility with Group */
  get isSubGraphExpanded(): boolean { return this._isSubGraphExpanded; }
  set isSubGraphExpanded(val: boolean) {
    if (this._isSubGraphExpanded === val) return;
    this._isSubGraphExpanded = val;
    if ((this as any)._className === 'Group' && (this as any).memberParts) {
      const members = (this as any).memberParts;
      const it = members.iterator;
      while (it.next()) {
        const part = it.value;
        if (val) {
          if ((part as any)._wasVisible !== false) {
            part.visible = true;
          }
        } else {
          (part as any)._wasVisible = part.visible;
          part.visible = false;
        }
      }
      if ((this as any).layout) {
        (this as any).layout.invalidateLayout();
      }
    }
    const diagram = this._diagram;
    if (diagram) {
      if (typeof (diagram as any)._updateBindingsForPart === 'function') {
        (diagram as any)._updateBindingsForPart(this, 'isSubGraphExpanded');
      }
      if (typeof (diagram as any)._handlePartPropertyChanged === 'function') {
        (diagram as any)._handlePartPropertyChanged(this, this, 'isSubGraphExpanded', val);
      }
    }
  }

  get treeExpandedDirection(): EnumValue { return this._treeExpandedDirection; }
  set treeExpandedDirection(val: EnumValue) { this._treeExpandedDirection = val; }

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
  private _isTreeLeafOverride: boolean | null = null;

  get isTreeLeaf(): boolean {
    if (this._isTreeLeafOverride !== null) return this._isTreeLeafOverride;
    const children = this.findTreeChildrenNodes();
    return children.count === 0;
  }
  set isTreeLeaf(val: boolean) {
    this._isTreeLeafOverride = val;
  }

  // ============ Link/Node connection methods (stubs) ============

  /** Find all links connected to this node */
  findLinksConnected(): List<any> {
    const result = new List<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && (part.fromNode === this || part.toNode === this)) {
          result.add(part);
        }
      }
    }
    return result;
  }

  findLinksInto(): List<any> {
    const result = new List<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && part.toNode === this) {
          result.add(part);
        }
      }
    }
    return result;
  }

  findLinksOutOf(): List<any> {
    const result = new List<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && part.fromNode === this) {
          result.add(part);
        }
      }
    }
    return result;
  }

  findNodesConnected(): List<any> {
    const result = new List<any>();
    const seen = new Set<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link) {
          let other: Node | null = null;
          if (part.fromNode === this) other = part.toNode;
          else if (part.toNode === this) other = part.fromNode;
          if (other && !seen.has(other)) {
            seen.add(other);
            result.add(other);
          }
        }
      }
    }
    return result;
  }

  findNodesInto(): List<any> {
    const result = new List<any>();
    const seen = new Set<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && part.toNode === this) {
          const fromNode = part.fromNode;
          if (fromNode && !seen.has(fromNode)) {
            seen.add(fromNode);
            result.add(fromNode);
          }
        }
      }
    }
    return result;
  }

  findNodesOutOf(): List<any> {
    const result = new List<any>();
    const seen = new Set<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && part.fromNode === this) {
          const toNode = part.toNode;
          if (toNode && !seen.has(toNode)) {
            seen.add(toNode);
            result.add(toNode);
          }
        }
      }
    }
    return result;
  }

  /** Find a port element by name */
  findPortWithName(name: string): GraphObject | null {
    if (name === '' || name === undefined || name === null) return this;
    const findInPanel = (obj: GraphObject): GraphObject | null => {
      if (obj instanceof Panel) {
        for (const child of obj._elements) {
          if (child.portId === name) return child;
          if (child instanceof Panel) {
            const found = findInPanel(child);
            if (found) return found;
          }
        }
      }
      return null;
    };
    return findInPanel(this);
  }

  isInTreeOf(node: Node): boolean {
    if (node === null || node === undefined || node === this) return false;
    let current: Node | null = this;
    const guard = new Set<Node>();
    while (current) {
      if (current === node) return true;
      if (guard.has(current)) return false;
      guard.add(current);
      current = current.findTreeParentNode();
    }
    return false;
  }

  findTreeParentNode(): Node | null {
    const diagram = this._diagram;
    if (!diagram) return null;
    const model = diagram.model;
    if (!model || !this.data) return null;
    if (model instanceof TreeModel) {
      const parentKey = model.getParentKeyForNodeData(this.data);
      if (parentKey !== undefined && parentKey !== null) {
        return diagram.findNodeForKey(parentKey);
      }
      return null;
    }
    if (model instanceof GraphLinksModel) {
      // 官方 findTreeParentNode：遍历全部连接链，跳过非树链，
      // 按 diagram.isTreePathToChildren（默认 true）取父端，o!==this 即返回。
      const pathToChildren = diagram.isTreePathToChildren !== false;
      const it = this.linksConnected;
      while (it.next()) {
        const link = it.value;
        if (!link.isTreeLink) continue;
        const other = pathToChildren ? link.fromNode : link.toNode;
        if (other !== this) return other;
      }
      return null;
    }
    return null;
  }

  findTreeChildrenNodes(): List<Node> {
    const result = new List<Node>();
    const diagram = this._diagram;
    if (!diagram) return result;
    const model = diagram.model;
    if (!model || !this.data) return result;
    const key = model.getKeyForNodeData(this.data);
    if (key === undefined) return result;
    if (model instanceof TreeModel) {
      for (const nodeData of model.nodeDataArray) {
        const parentKey = model.getParentKeyForNodeData(nodeData);
        if (parentKey === key) {
          const childKey = model.getKeyForNodeData(nodeData);
          if (childKey !== undefined) {
            const childNode = diagram.findNodeForKey(childKey);
            if (childNode) result.add(childNode);
          }
        }
      }
      return result;
    }
    if (model instanceof GraphLinksModel) {
      // 官方 findTreeChildrenNodes：只认 isTreeLink，按方向取子端并去重。
      const pathToChildren = diagram.isTreePathToChildren !== false;
      const seen = new Set<Node>();
      const it = this.linksConnected;
      while (it.next()) {
        const link = it.value;
        if (!link.isTreeLink) continue;
        const child = pathToChildren ? link.toNode : link.fromNode;
        if (child !== null && child !== undefined && child !== this && !seen.has(child)) {
          seen.add(child);
          result.add(child);
        }
      }
      return result;
    }
    return result;
  }

  findTreeParentLink(): any | null {
    // 官方 findTreeParentLink：第一棵 isTreeLink 且对端不是本节点的连接链
    // （pathToChildren=true 时即首条 fromNode!==this 的入向树链）。
    const diagram = this._diagram;
    const pathToChildren = diagram ? diagram.isTreePathToChildren !== false : true;
    const it = this.linksConnected;
    while (it.next()) {
      const link = it.value;
      if (!link.isTreeLink) continue;
      const otherEnd = pathToChildren ? link.fromNode : link.toNode;
      if (otherEnd !== this) return link;
    }
    return null;
  }

  findLevel(): number {
    const levelCache = new Map<any, number>();
    const computeLevel = (n: Node): number => {
      const data = n.data;
      if (!data) return 0;
      const key = n._diagram ? n._diagram.model.getKeyForNodeData(data) : undefined;
      if (key !== undefined && levelCache.has(key)) return levelCache.get(key)!;
      const parent = n.findTreeParentNode();
      const level = parent ? computeLevel(parent) + 1 : 0;
      if (key !== undefined) levelCache.set(key, level);
      return level;
    };
    return computeLevel(this);
  }

  findCommonParent(node: Node): Node | null {
    const ancestors = new Set<Node>();
    let current: Node | null = this;
    while (current) {
      ancestors.add(current);
      current = current.findTreeParentNode();
    }
    current = node;
    while (current) {
      if (ancestors.has(current)) return current;
      current = current.findTreeParentNode();
    }
    return null;
  }

  // ============ 官方 Node 缺失成员（阶段 4 对齐） ============

  /** 官方 `Node.linksConnected`：与本节点相连的 Link 迭代器 */
  get linksConnected(): Iterator<Link> {
    return this.findLinksConnected().iterator;
  }

  /** 官方 `Node.portSpreading`（默认 PortSpreading.Evenly） */
  get portSpreading(): number { return this._portSpreading; }
  set portSpreading(val: number) {
    const old = this._portSpreading;
    if (old === val) return;
    this._portSpreading = val;
    this.raiseChanged('portSpreading', old, val);
    const diagram: any = this._diagram;
    if (diagram !== null && diagram !== undefined && diagram.undoManager && diagram.undoManager.isUndoingRedoing) return;
    this.invalidateConnectedLinks();
  }

  /** 官方 `Node.avoidable`（默认 true，参与 AvoidsNodes 路由的避让） */
  get avoidable(): boolean { return this._avoidable; }
  set avoidable(val: boolean) {
    const old = this._avoidable;
    if (old === val) return;
    this._avoidable = val;
    this.raiseChanged('avoidable', old, val);
    // 官方 setter 末尾 → Diagram.Fd(node)（占用场标待重建）
    const dg: any = this._diagram;
    if (dg && typeof dg.Fd === 'function') dg.Fd(this);
  }

  /** 官方 `Node.avoidableMargin`（默认 Margin(2,2,2,2)，接受 number） */
  get avoidableMargin(): Margin {
    return this._avoidableMargin !== null ? this._avoidableMargin : Node._defaultAvoidableMargin;
  }
  set avoidableMargin(val: Margin | number) {
    const m = typeof val === 'number' ? new Margin(val) : val;
    const old = this.avoidableMargin;
    if (old.equals(m)) return;
    this._avoidableMargin = m.copy();
    this.raiseChanged('avoidableMargin', old, m);
    // 官方 setter 末尾 → Diagram.Fd(node)
    const dg: any = this._diagram;
    if (dg && typeof dg.Fd === 'function') dg.Fd(this);
  }

  /** 官方 `Node.canAvoid()` */
  canAvoid(): boolean {
    return this.avoidable && !this.isLinkLabel;
  }

  /** 官方 `Node.getAvoidableRect(result)`：actualBounds 外扩 avoidableMargin */
  getAvoidableRect(result: Rect): Rect {
    result.set(this.actualBounds);
    result.addMargin(this.avoidableMargin);
    return result;
  }

  /** 官方 `Node.findVisibleNode()`：沿 containingGroup 向上找到第一个可见的 */
  findVisibleNode(): Node | null {
    let n: any = this;
    while (n !== null && n !== undefined && !n.isVisible()) n = n.containingGroup;
    return n;
  }

  /** 官方 `Node.findVisiblePort(obj)` */
  findVisiblePort(obj: GraphObject | null): GraphObject {
    let o: GraphObject | null = obj;
    while (o !== null && (!o.actualBounds.isReal() || !o.isVisibleObject())) {
      o = o.panel;
    }
    return o === null ? this.port : o;
  }

  /**
   * 官方 `Node.findPort(pid)`：按 portId 查找端口，找不到时回退 `''`，再回退本节点。
   * 官方有 ports 缓存（pe），本项目每次重建视觉树（偏差：无缓存）。
   */
  findPort(pid: string): GraphObject {
    const map = this._collectPorts();
    const p = map.get(pid);
    if (p !== null) return p;
    if (pid !== '') {
      const d = map.get('');
      if (d !== null) return d;
    }
    return this;
  }

  /** 官方 `Node.port` === `findPort("")` */
  get port(): GraphObject {
    return this.findPort('');
  }

  /** 官方 `Node.ports`：全部命名端口的迭代器（无命名端口时只有本节点） */
  get ports(): Iterator<GraphObject> {
    return this._collectPorts().iteratorValues;
  }

  private _collectPorts(): Map<string, GraphObject> {
    const map = new Map<string, GraphObject>();
    this.walkVisualTreeFrom(this, (_root, obj) => {
      const id = obj.portId;
      // 官方 portId 默认 null 跳过；显式 portId === '' 的对象是“整个节点的默认端口”，
      // 必须收录（canvases 的 Picture 就靠它成为 link 的端点）。
      if (id !== null && id !== undefined) map.set(id, obj);
    });
    if (map.count === 0) map.set('', this);
    return map;
  }

  /** 官方 `Node.isLinkLabel` */
  get isLinkLabel(): boolean {
    return this._labeledLink !== null;
  }

  /** 官方 `Node.labeledLink` */
  get labeledLink(): Link | null { return this._labeledLink; }
  set labeledLink(val: Link | null) {
    const old = this._labeledLink;
    if (old === val) return;
    if (old !== null) {
      const rm = (old as any)._removeLabelNode;
      if (typeof rm === 'function') rm.call(old, this);
    }
    this._labeledLink = val;
    if (val !== null) {
      const add = (val as any)._addLabelNode;
      if (typeof add === 'function') add.call(val, this);
    }
    this.raiseChanged('labeledLink', old, val);
  }

  /** 官方 `Node.linkConnected` */
  get linkConnected(): ((node: Node, link: Link, port: any) => void) | null {
    return this._linkConnected;
  }
  set linkConnected(val: ((node: Node, link: Link, port: any) => void) | null) {
    const old = this._linkConnected;
    if (old === val) return;
    this._linkConnected = val;
    this.raiseChanged('linkConnected', old, val);
  }

  /** 官方 `Node.linkDisconnected` */
  get linkDisconnected(): ((node: Node, link: Link, port: any) => void) | null {
    return this._linkDisconnected;
  }
  set linkDisconnected(val: ((node: Node, link: Link, port: any) => void) | null) {
    const old = this._linkDisconnected;
    if (old === val) return;
    this._linkDisconnected = val;
    this.raiseChanged('linkDisconnected', old, val);
  }

  /** 官方 `Node.linkValidation` */
  get linkValidation(): ((node1: any, port1: any, node2: any, port2: any, link: Link | null) => boolean) | null {
    return this._linkValidation;
  }
  set linkValidation(val: ((node1: any, port1: any, node2: any, port2: any, link: Link | null) => boolean) | null) {
    const old = this._linkValidation;
    if (old === val) return;
    this._linkValidation = val;
    this.raiseChanged('linkValidation', old, val);
  }

  /** 官方 `Node.treeExpandedChanged` */
  get treeExpandedChanged(): ((node: Node) => void) | null {
    return this._treeExpandedChanged;
  }
  set treeExpandedChanged(val: ((node: Node) => void) | null) {
    const old = this._treeExpandedChanged;
    if (old === val) return;
    this._treeExpandedChanged = val;
    this.raiseChanged('treeExpandedChanged', old, val);
  }

  /** 官方 `Node.isTreeRoot`：没有指向自己的树链接即为根 */
  get isTreeRoot(): boolean {
    return this.findTreeParentLink() === null;
  }

  /** 官方 `Node.invalidateConnectedLinks(newkeys?, oldport?)` */
  invalidateConnectedLinks(newkeys?: Set<any> | null, oldport?: GraphObject | null): void {
    const it = this.linksConnected;
    while (it.next()) {
      const link = it.value;
      if (newkeys !== null && newkeys !== undefined && newkeys.has(link)) continue;
      if (oldport !== null && oldport !== undefined) {
        const fp = (link as any).fromPort;
        const tp = (link as any).toPort;
        if (fp !== oldport && tp !== oldport) continue;
      }
      const portOf = (p: any): any => p;
      const fromPort = portOf((link as any).fromPort);
      if (fromPort && typeof fromPort.invalidateConnectedLinksCache === 'function') {
        fromPort.invalidateConnectedLinksCache();
      }
      const toPort = portOf((link as any).toPort);
      if (toPort && typeof toPort.invalidateConnectedLinksCache === 'function') {
        toPort.invalidateConnectedLinksCache();
      }
      // 官方 Node.invalidateConnectedLinks：逐链 `ne(fromPort)/ne(toPort)/oi()` ——
      // 只清端口 knot 缓存 + `link.invalidateRoute()`（oi），**不同步重算路线**。
      // 早先这里紧跟 `updateRoute()`，动画回写 location 时会把不可见树链也同步算出
      // 2 点路线（gantt 的 2>21、32>324 pts=2 vs 官方 0 的成因）；不可见链官方
      // 永不重算（渲染跳过 → 永不触发懒计算）。
      if (typeof link.invalidateRoute === 'function') {
        link.invalidateRoute();
      }
    }
  }

  /**
   * 官方 `Node.invalidateLinkBundle(othernode, pid?, otherpid?)`：
   * 官方在 link bundles 里找到同端口对的 bundle 并置脏。
   * 本项目没有 link bundle 语义（偏差：保留签名，无操作）。
   */
  invalidateLinkBundle(_othernode?: Node | null, _pid?: string | null, _otherpid?: string | null): void {
    /* 阶段 6：link bundle 尚未实现 */
  }

  /** 官方 `Node.findLinksBetween(othernode, pid?, otherpid?)` */
  findLinksBetween(othernode: Node, pid?: string | null, otherpid?: string | null): Iterator<Link> {
    const p = pid === undefined ? null : pid;
    const q = otherpid === undefined ? null : otherpid;
    const list = this.findLinksConnected() as List<Link>;
    return list.filter((l) =>
      (l.fromNode === this && l.toNode === othernode && (p === null || l.fromPortId === p) && (q === null || l.toPortId === q)) ||
      (l.fromNode === othernode && l.toNode === this && (q === null || l.fromPortId === q) && (p === null || l.toPortId === p))
    ).iterator;
  }

  /** 官方 `Node.findLinksTo(othernode, pid?, otherpid?)` */
  findLinksTo(othernode: Node, pid?: string | null, otherpid?: string | null): Iterator<Link> {
    const p = pid === undefined ? null : pid;
    const q = otherpid === undefined ? null : otherpid;
    const list = this.findLinksConnected() as List<Link>;
    return list.filter((l) =>
      l.fromNode === this &&
      l.toNode === othernode &&
      (p === null || l.fromPortId === p) &&
      (q === null || l.toPortId === q)
    ).iterator;
  }

  /** 官方 `Node.findSuccessorParts(newset?)`：沿出边可达的全部 Part（不含自身） */
  findSuccessorParts(newset?: Set<any>): Set<any> {
    const s = newset === undefined ? new Set<any>() : newset;
    this._collectSuccessorParts(this, s);
    s.delete(this);
    return s;
  }

  private _collectSuccessorParts(node: any, out: Set<any>): void {
    if (node === null || node === undefined || out.has(node)) return;
    out.add(node);
    const links = node.findLinksOutOf() as List<Link>;
    const it = links.iterator;
    while (it.next()) {
      const link = it.value;
      if (out.has(link)) continue;
      out.add(link);
      const child = link.toNode;
      if (child !== null && child !== undefined) this._collectSuccessorParts(child, out);
    }
  }

  /** 官方 `Node.findPredecessorParts(newset?)`：沿入边可达的全部 Part（不含自身） */
  findPredecessorParts(newset?: Set<any>): Set<any> {
    const s = newset === undefined ? new Set<any>() : newset;
    this._collectPredecessorParts(this, s);
    s.delete(this);
    return s;
  }

  private _collectPredecessorParts(node: any, out: Set<any>): void {
    if (node === null || node === undefined || out.has(node)) return;
    out.add(node);
    const links = node.findLinksInto() as List<Link>;
    const it = links.iterator;
    while (it.next()) {
      const link = it.value;
      if (out.has(link)) continue;
      out.add(link);
      const parent = link.fromNode;
      if (parent !== null && parent !== undefined) this._collectPredecessorParts(parent, out);
    }
  }

  /**
   * 官方 `Node.findTreeParts(level?, newset?)`：
   * 从本节点沿**路径方向**（isTreePathToChildren ? 出边 : 入边）逐层收集节点与其链接，
   * level=1 只收集自身；level=2 再收集直接相邻的链接与邻居节点。
   */
  findTreeParts(level?: number, newset?: Set<any>): Set<any> {
    const lv = level === undefined ? Infinity : level;
    const s = newset === undefined ? new Set<any>() : newset;
    const toChildren = this._isTreePathToChildren();
    this._collectTreeParts(this, s, lv, toChildren);
    return s;
  }

  private _collectTreeParts(node: any, out: Set<any>, level: number, toChildren: boolean): void {
    if (node === null || node === undefined || level < 1 || out.has(node)) return;
    out.add(node);
    if (level === 1) return;
    const links = (toChildren ? node.findLinksOutOf() : node.findLinksInto()) as List<Link>;
    const it = links.iterator;
    while (it.next()) {
      const link = it.value;
      if (out.has(link)) continue;
      out.add(link);
      const next = toChildren ? link.toNode : link.fromNode;
      if (next !== null && next !== undefined) {
        this._collectTreeParts(next, out, level - 1, toChildren);
      }
    }
  }

  /** 官方 `Node.findTreeParentChain(newset?)`：自身 + 父链接 + 父节点…（带环保护） */
  findTreeParentChain(newset?: Set<any>): Set<any> {
    const s = newset === undefined ? new Set<any>() : newset;
    this._collectTreeParentChain(this, s, new Set<any>());
    return s;
  }

  private _collectTreeParentChain(node: any, out: Set<any>, guard: Set<any>): void {
    if (node === null || node === undefined || guard.has(node)) return;
    guard.add(node);
    out.add(node);
    const link = node.findTreeParentLink();
    if (link !== null && link !== undefined) {
      out.add(link);
      const parent = node.findTreeParentNode();
      if (parent !== null && parent !== undefined && parent !== node) {
        this._collectTreeParentChain(parent, out, guard);
      }
    }
  }

  /** 官方 `Node.findTreeChildrenLinks()`：沿路径方向的子树链接 */
  findTreeChildrenLinks(): Iterator<Link> {
    const toChildren = this._isTreePathToChildren();
    const all = this.findLinksConnected() as List<Link>;
    return all.filter((l) => l.isTreeLink !== false && (toChildren ? l.fromNode === this : l.toNode === this)).iterator;
  }

  /** 官方 `Node.findTreeLevel()`：父链上的节点数 */
  findTreeLevel(): number {
    let level = 0;
    const guard = new Set<Node>();
    let p: any = this.findTreeParentNode();
    while (p !== null && p !== undefined && p !== this && !guard.has(p)) {
      guard.add(p);
      level++;
      p = p.findTreeParentNode();
    }
    return level;
  }

  /**
   * 官方 `Node.findTreeRoot()`：沿树链接向上走到根。
   * 官方逐条检查 `ai`（链接插入顺序）并排除 `this` 作为候选父节点，本项目按同样规则实现。
   */
  findTreeRoot(): Node {
    const toChildren = this._isTreePathToChildren();
    const guard = new Set<Node>();
    let e: any = this;
    for (;;) {
      if (guard.has(e)) return e;
      guard.add(e);
      let s: any = null;
      const it = e.findLinksConnected().iterator;
      while (it.next()) {
        const link: any = it.value;
        if (link.isTreeLink === false) continue;
        const p = toChildren ? link.fromNode : link.toNode;
        s = p;
        if (s !== null && s !== undefined && s !== e && s !== this) break;
      }
      if (s === this) return this;
      if (s === null || s === undefined || s === e) return e;
      e = s;
    }
  }

  /** 官方 `Node.findCommonTreeParent(other)` */
  findCommonTreeParent(other: Node): Node | null {
    if (other === null || other === undefined) return null;
    if (this === other) return this;
    const anc = new Set<any>();
    let n: any = this;
    while (n !== null && n !== undefined && !anc.has(n)) {
      anc.add(n);
      n = n.findTreeParentNode();
    }
    n = other;
    const seen = new Set<any>();
    while (n !== null && n !== undefined && !seen.has(n)) {
      if (anc.has(n)) return n;
      seen.add(n);
      n = n.findTreeParentNode();
    }
    return null;
  }

  /** 官方 `Node.findExternalTreeLinksConnected()`：子树范围外的链接 */
  findExternalTreeLinksConnected(): Iterator<Link> {
    const visited = new Set<any>();
    const external = new Set<Link>();
    const toChildren = this._isTreePathToChildren();
    this._collectExternalTreeLinks(this, visited, external, toChildren);
    return external.iterator;
  }

  private _collectExternalTreeLinks(
    node: any,
    visited: Set<any>,
    external: Set<Link>,
    toChildren: boolean
  ): void {
    if (node === null || node === undefined || visited.has(node)) return;
    visited.add(node);
    const it = node.findLinksConnected().iterator;
    while (it.next()) {
      const link: any = it.value;
      if (link.isTreeLink !== false) {
        const child = toChildren
          ? (link.fromNode === node ? link.toNode : null)
          : (link.toNode === node ? link.fromNode : null);
        if (child !== null && child !== undefined && child !== node) {
          this._collectExternalTreeLinks(child, visited, external, toChildren);
        }
      } else {
        external.add(link);
      }
    }
  }

  /**
   * 官方 `Node.collapseTree(level=1)`：把子树内节点的 isTreeExpanded 置为 false。
   * 偏差：本项目 `Part.isVisible()` 不受 isTreeExpanded 影响，也无 `diagram.isCollapsingExpanding`
   * 事务标记，因此这里只做状态位的递归更新，不改变可见性/不触发布局事务。
   */
  collapseTree(level?: number): void {
    const lv = level !== undefined && level >= 1 ? Math.floor(level) : 1;
    const toChildren = this._isTreePathToChildren();
    const visited = new Set<any>();
    visited.add(this);
    this._collapseTreeWalk(this, visited, toChildren, lv);
    if (this._treeExpandedChanged !== null) this._treeExpandedChanged(this);
  }

  private _collapseTreeWalk(
    node: any,
    visited: Set<any>,
    toChildren: boolean,
    level: number
  ): void {
    const links = (toChildren ? node.findLinksOutOf() : node.findLinksInto()) as List<Link>;
    const it = links.iterator;
    while (it.next()) {
      const link = it.value;
      if (link.isTreeLink === false) continue;
      const other: any = toChildren ? link.toNode : link.fromNode;
      if (other === null || other === undefined || other === node || visited.has(other)) continue;
      visited.add(other);
      if (level > 1) {
        other.wasTreeExpanded = other.isTreeExpanded;
        other.isTreeExpanded = false;
        this._collapseTreeWalk(other, visited, toChildren, level - 1);
        if (other._treeExpandedChanged !== null) other._treeExpandedChanged(other);
      } else {
        other.wasTreeExpanded = other.isTreeExpanded;
        other.isTreeExpanded = false;
        if (other._treeExpandedChanged !== null) other._treeExpandedChanged(other);
      }
    }
    if (node !== this) {
      node.wasTreeExpanded = node.isTreeExpanded;
      node.isTreeExpanded = false;
    }
  }

  /**
   * 官方 `Node.expandTree(level=2)`：把子树内节点的 isTreeExpanded 置为 true。
   * 偏差说明同 `collapseTree`。
   */
  expandTree(level?: number): void {
    const lv = level !== undefined && level >= 2 ? Math.floor(level) : 2;
    const toChildren = this._isTreePathToChildren();
    const visited = new Set<any>();
    visited.add(this);
    this._expandTreeWalk(this, visited, toChildren, lv);
    if (this._treeExpandedChanged !== null) this._treeExpandedChanged(this);
  }

  private _expandTreeWalk(
    node: any,
    visited: Set<any>,
    toChildren: boolean,
    level: number
  ): void {
    node.isTreeExpanded = true;
    if (node !== this && node._treeExpandedChanged !== null) node._treeExpandedChanged(node);
    if (level < 2) return;
    const links = (toChildren ? node.findLinksOutOf() : node.findLinksInto()) as List<Link>;
    const it = links.iterator;
    while (it.next()) {
      const link = it.value;
      if (link.isTreeLink === false) continue;
      const other: any = toChildren ? link.toNode : link.fromNode;
      if (other === null || other === undefined || other === node || visited.has(other)) continue;
      visited.add(other);
      if (other.wasTreeExpanded || level > 2) {
        other.wasTreeExpanded = false;
        this._expandTreeWalk(other, visited, toChildren, level - 1);
      } else {
        other.isTreeExpanded = true;
        if (other._treeExpandedChanged !== null) other._treeExpandedChanged(other);
      }
    }
  }

  /** 官方 `Diagram.isTreePathToChildren`（默认 true） */
  private _isTreePathToChildren(): boolean {
    const d: any = this._diagram;
    if (d === null || d === undefined) return true;
    return d.isTreePathToChildren !== false;
  }

  // ============ Methods ============

  /** Create a copy of this Node */
  copy(): Node {
    // 官方：`new this.constructor`（无参，type 由 _copyPanelPropertiesTo 复制）
    const c = new Node(this._type); // WIP-BISECT
    this._copyPropertiesTo(c as any);
    this._copyPanelPropertiesTo(c as any);
    this._copyPartPropertiesTo(c);
    // Copy Node-specific properties
    c._isTreeExpanded = this._isTreeExpanded;
    c._wasTreeExpanded = this._wasTreeExpanded;
    c._isSubGraphExpanded = this._isSubGraphExpanded;
    c._treeExpandedDirection = this._treeExpandedDirection;
    c._avoidable = this._avoidable;
    c._avoidableMargin = this._avoidableMargin !== null ? this._avoidableMargin.copy() : null;
    c._portSpreading = this._portSpreading;
    c._linkConnected = this._linkConnected;
    c._linkDisconnected = this._linkDisconnected;
    c._linkValidation = this._linkValidation;
    c._treeExpandedChanged = this._treeExpandedChanged;
    return c;
  }
}

GraphObject.defineBuilder('Node', Node);
