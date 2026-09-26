import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Set } from '../core/Set';
import { List } from '../core/List';
import { EnumValue } from '../core/EnumValues';
import { Spot } from '../core/Spot';
import {
  TreeStyleLayered, TreeStyleAlternating, TreeStyleLastParents, TreeStyleRootOnly,
  TreePathDefault, TreePathDestination, TreePathSource,
  TreeArrangementVertical, TreeArrangementHorizontal, TreeArrangementFixedRoots,
  TreeLayerStyleIndividual, TreeLayerStyleUniform, TreeLayerStyleSiblings,
  TreeSortingForwards, TreeSortingReverse, TreeSortingAscending, TreeSortingDescending,
  TreeCompactionBlock, TreeCompactionNone,
  TreeAlignmentTopLeftBus, TreeAlignmentBottomRightBus, TreeAlignmentBus, TreeAlignmentBusBranching,
  TreeAlignmentCenterChildren, TreeAlignmentCenterSubtrees, TreeAlignmentStart, TreeAlignmentEnd,
  TreeAlignmentCustom
} from '../core/EnumValues';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { Layout } from './Layout';
import { LayoutNetwork } from './LayoutNetwork';
import { TreeVertex } from './TreeVertex';
import { TreeEdge } from './TreeEdge';
import { TreeNetwork } from './TreeNetwork';

/**
 * TreeLayout — 官方 GoJS TreeLayout 的忠实移植。
 *
 * doLayout 流程（官方 doLayout）：
 *   initTrees(YB) → initializeCounts(KB) → assignTreeValues(UB) → sortTrees(GB)
 *   → addComments(vA) → layoutTreeReal(qB) → arrangeTrees → updateParts(commit)
 *
 * 关键移植说明：
 * - 与官方一致：vertex.sourceEdges = 入边（该顶点为 to）、destinationEdges = 出边（该顶点为 from）。
 * - 官方 focus 是绝对偏移 Point（LayoutVertex.focus），TreeVertex.focus 同义。
 * - 官方 K/kt/gt/mm/pm → relativePosition/subtreeSize/subtreeOffset/mm/pm。
 */
export class TreeLayout extends Layout {

  // ============ 官方存储（Gi/Ki/Ru/gm/_A/Je/te/vs/U/G/Rk/Ms） ============
  private _roots: Set<TreeVertex> = new Set<TreeVertex>();
  private _path: EnumValue = TreePathDefault;
  private _treeStyle: EnumValue = TreeStyleLayered;
  private _layerStyle: EnumValue = TreeLayerStyleIndividual;
  private _comments: boolean = true;
  private _arrangement: EnumValue = TreeArrangementVertical;
  private _arrangementSpacing: Size = new Size(10, 10);
  private _rootDefaults: TreeVertex = new TreeVertex();
  private _alternateDefaults: TreeVertex = new TreeVertex();
  private _Ms: number = 1;                       // 官方 path 解析结果（1=向子,2=向父）
  private _layerSizes: number[] = [];            // 官方 _A（Uniform 层尺寸）
  private _pool: (Point[][] | undefined)[] = []; // 官方 Rk（点数组池）

  constructor(init?: any) {
    super();
    if (init) Object.assign(this, init);
  }

  // ============ 属性（代理 rootDefaults/alternateDefaults，官方同名属性） ============

  get roots(): Set<TreeVertex> { return this._roots; }
  set roots(val: Set<TreeVertex>) { this._roots = val; this.invalidateLayout(); }

  get path(): EnumValue { return this._path; }
  set path(val: EnumValue) { this._path = val; this.invalidateLayout(); }

  get treeStyle(): EnumValue { return this._treeStyle; }
  set treeStyle(val: EnumValue) { this._treeStyle = val; this.invalidateLayout(); }

  get layerStyle(): EnumValue { return this._layerStyle; }
  set layerStyle(val: EnumValue) { this._layerStyle = val; this.invalidateLayout(); }

  get comments(): boolean { return this._comments; }
  set comments(val: boolean) { this._comments = val; this.invalidateLayout(); }

  get arrangement(): EnumValue { return this._arrangement; }
  set arrangement(val: EnumValue) { this._arrangement = val; this.invalidateLayout(); }

  get arrangementSpacing(): Size { return this._arrangementSpacing; }
  set arrangementSpacing(val: Size) { this._arrangementSpacing = val.copy(); this.invalidateLayout(); }

  get rootDefaults(): TreeVertex { return this._rootDefaults; }
  set rootDefaults(val: TreeVertex) { this._rootDefaults = val; this.invalidateLayout(); }

  get alternateDefaults(): TreeVertex { return this._alternateDefaults; }
  set alternateDefaults(val: TreeVertex) { this._alternateDefaults = val; this.invalidateLayout(); }

  get angle(): number { return this._rootDefaults.angle; }
  set angle(val: number) {
    if (this._rootDefaults.angle === val) return;
    if (val === 0 || val === 90 || val === 180 || val === 270) {
      this._rootDefaults.angle = val; this.invalidateLayout();
    }
  }

  get alignment(): EnumValue { return this._rootDefaults.alignment; }
  set alignment(val: EnumValue) { this._rootDefaults.alignment = val; this.invalidateLayout(); }

  get sorting(): EnumValue { return this._rootDefaults.sorting; }
  set sorting(val: EnumValue) { this._rootDefaults.sorting = val; this.invalidateLayout(); }

  get comparer(): (a: TreeVertex, b: TreeVertex) => number { return this._rootDefaults.comparer; }
  set comparer(val: (a: TreeVertex, b: TreeVertex) => number) { this._rootDefaults.comparer = val; this.invalidateLayout(); }

  get nodeIndent(): number { return this._rootDefaults.nodeIndent; }
  set nodeIndent(val: number) { this._rootDefaults.nodeIndent = val; this.invalidateLayout(); }

  get nodeIndentPastParent(): number { return this._rootDefaults.nodeIndentPastParent; }
  set nodeIndentPastParent(val: number) { this._rootDefaults.nodeIndentPastParent = val; this.invalidateLayout(); }

  get nodeSpacing(): number { return this._rootDefaults.nodeSpacing; }
  set nodeSpacing(val: number) { this._rootDefaults.nodeSpacing = val; this.invalidateLayout(); }

  get layerSpacing(): number { return this._rootDefaults.layerSpacing; }
  set layerSpacing(val: number) { this._rootDefaults.layerSpacing = val; this.invalidateLayout(); }

  get layerSpacingParentOverlap(): number { return this._rootDefaults.layerSpacingParentOverlap; }
  set layerSpacingParentOverlap(val: number) { this._rootDefaults.layerSpacingParentOverlap = val; this.invalidateLayout(); }

  get compaction(): EnumValue { return this._rootDefaults.compaction; }
  set compaction(val: EnumValue) { this._rootDefaults.compaction = val; this.invalidateLayout(); }

  get breadthLimit(): number { return this._rootDefaults.breadthLimit; }
  set breadthLimit(val: number) { this._rootDefaults.breadthLimit = val; this.invalidateLayout(); }

  get rowSpacing(): number { return this._rootDefaults.rowSpacing; }
  set rowSpacing(val: number) { this._rootDefaults.rowSpacing = val; this.invalidateLayout(); }

  get rowIndent(): number { return this._rootDefaults.rowIndent; }
  set rowIndent(val: number) { this._rootDefaults.rowIndent = val; this.invalidateLayout(); }

  get commentSpacing(): number { return this._rootDefaults.commentSpacing; }
  set commentSpacing(val: number) { this._rootDefaults.commentSpacing = val; this.invalidateLayout(); }

  get commentMargin(): number { return this._rootDefaults.commentMargin; }
  set commentMargin(val: number) { this._rootDefaults.commentMargin = val; this.invalidateLayout(); }

  get setsPortSpot(): boolean { return this._rootDefaults.setsPortSpot; }
  set setsPortSpot(val: boolean) { this._rootDefaults.setsPortSpot = val; this.invalidateLayout(); }

  get portSpot(): Spot { return this._rootDefaults.portSpot; }
  set portSpot(val: Spot) { this._rootDefaults.portSpot = val; this.invalidateLayout(); }

  get setsChildPortSpot(): boolean { return this._rootDefaults.setsChildPortSpot; }
  set setsChildPortSpot(val: boolean) { this._rootDefaults.setsChildPortSpot = val; this.invalidateLayout(); }

  get childPortSpot(): Spot { return this._rootDefaults.childPortSpot; }
  set childPortSpot(val: Spot) { this._rootDefaults.childPortSpot = val; this.invalidateLayout(); }

  get alternateAngle(): number { return this._alternateDefaults.angle; }
  set alternateAngle(val: number) { this._alternateDefaults.angle = val; this.invalidateLayout(); }

  get alternateAlignment(): EnumValue { return this._alternateDefaults.alignment; }
  set alternateAlignment(val: EnumValue) { this._alternateDefaults.alignment = val; this.invalidateLayout(); }

  get alternateSorting(): EnumValue { return this._alternateDefaults.sorting; }
  set alternateSorting(val: EnumValue) { this._alternateDefaults.sorting = val; this.invalidateLayout(); }

  get alternateNodeIndent(): number { return this._alternateDefaults.nodeIndent; }
  set alternateNodeIndent(val: number) { this._alternateDefaults.nodeIndent = val; this.invalidateLayout(); }

  get alternateNodeIndentPastParent(): number { return this._alternateDefaults.nodeIndentPastParent; }
  set alternateNodeIndentPastParent(val: number) { this._alternateDefaults.nodeIndentPastParent = val; this.invalidateLayout(); }

  get alternateNodeSpacing(): number { return this._alternateDefaults.nodeSpacing; }
  set alternateNodeSpacing(val: number) { this._alternateDefaults.nodeSpacing = val; this.invalidateLayout(); }

  get alternateLayerSpacing(): number { return this._alternateDefaults.layerSpacing; }
  set alternateLayerSpacing(val: number) { this._alternateDefaults.layerSpacing = val; this.invalidateLayout(); }

  get alternateLayerSpacingParentOverlap(): number { return this._alternateDefaults.layerSpacingParentOverlap; }
  set alternateLayerSpacingParentOverlap(val: number) { this._alternateDefaults.layerSpacingParentOverlap = val; this.invalidateLayout(); }

  get alternateCompaction(): EnumValue { return this._alternateDefaults.compaction; }
  set alternateCompaction(val: EnumValue) { this._alternateDefaults.compaction = val; this.invalidateLayout(); }

  get alternateBreadthLimit(): number { return this._alternateDefaults.breadthLimit; }
  set alternateBreadthLimit(val: number) { this._alternateDefaults.breadthLimit = val; this.invalidateLayout(); }

  get alternateRowSpacing(): number { return this._alternateDefaults.rowSpacing; }
  set alternateRowSpacing(val: number) { this._alternateDefaults.rowSpacing = val; this.invalidateLayout(); }

  get alternateRowIndent(): number { return this._alternateDefaults.rowIndent; }
  set alternateRowIndent(val: number) { this._alternateDefaults.rowIndent = val; this.invalidateLayout(); }

  // ============ 枚举静态常量（官方 TreeLayout 静态成员） ============
  static PathDefault = TreePathDefault;
  static PathDestination = TreePathDestination;
  static PathSource = TreePathSource;
  static SortingForwards = TreeSortingForwards;
  static SortingReverse = TreeSortingReverse;
  static SortingAscending = TreeSortingAscending;
  static SortingDescending = TreeSortingDescending;
  static AlignmentCenterSubtrees = TreeAlignmentCenterSubtrees;
  static AlignmentCenterChildren = TreeAlignmentCenterChildren;
  static AlignmentStart = TreeAlignmentStart;
  static AlignmentEnd = TreeAlignmentEnd;
  static AlignmentBus = TreeAlignmentBus;
  static AlignmentBusBranching = TreeAlignmentBusBranching;
  static AlignmentTopLeftBus = TreeAlignmentTopLeftBus;
  static AlignmentBottomRightBus = TreeAlignmentBottomRightBus;
  static CompactionNone = TreeCompactionNone;
  static CompactionBlock = TreeCompactionBlock;
  static StyleLayered = TreeStyleLayered;
  static StyleLastParents = TreeStyleLastParents;
  static StyleAlternating = TreeStyleAlternating;
  static StyleRootOnly = TreeStyleRootOnly;
  static ArrangementVertical = TreeArrangementVertical;
  static ArrangementHorizontal = TreeArrangementHorizontal;
  static ArrangementFixedRoots = TreeArrangementFixedRoots;
  static LayerIndividual = TreeLayerStyleIndividual;
  static LayerSiblings = TreeLayerStyleSiblings;
  static LayerUniform = TreeLayerStyleUniform;

  copy(): TreeLayout {
    const copy = new TreeLayout();
    copy._arrangementOrigin = this._arrangementOrigin.copy();
    copy._path = this._path;
    copy._treeStyle = this._treeStyle;
    copy._layerStyle = this._layerStyle;
    copy._comments = this._comments;
    copy._arrangement = this._arrangement;
    copy._arrangementSpacing = this._arrangementSpacing.copy();
    copy._rootDefaults.copyInheritedPropertiesFrom(this._rootDefaults);
    copy._alternateDefaults.copyInheritedPropertiesFrom(this._alternateDefaults);
    return copy;
  }

  // ============ 网络构建 ============

  createNetwork(): LayoutNetwork {
    const net = new TreeNetwork();
    net.layout = this;
    return net;
  }

  /** 官方 TreeLayout.makeNetwork — 排除 Comment/linkLabel，过滤非法链接 */
  makeNetwork(coll: any): LayoutNetwork {
    const net = this.createNetwork();
    const parts = this.collectParts(coll);

    const nodeOK = (n: any): boolean => {
      if (n.isLinkLabel) return false;
      if (n.category === 'Comment') return false;
      if (typeof n.canLayout === 'function' && !n.canLayout()) return false;
      return true;
    };

    const it = parts.iterator;
    while (it.next()) {
      const part: any = it.value;
      if (part instanceof Node) {
        if (!nodeOK(part)) continue;
        const vertex = net.addNode(part) as TreeVertex;
        // 官方 node setter：先 ensureBounds()（measure + 更新 actualBounds 尺寸）
        if (typeof (part as any).ensureBounds === 'function') (part as any).ensureBounds();
        else if (typeof part._measure === 'function') part._measure(Infinity, Infinity);
        const lb = this.getLayoutBounds(part);
        const mb = part.measuredBounds;
        const ab = part.actualBounds;
        const w = mb && mb.width > 0 ? mb.width : (ab ? ab.width : 0);
        const h = mb && mb.height > 0 ? mb.height : (ab ? ab.height : 0);
        vertex.bounds = new Rect(lb.x, lb.y, w, h);
        vertex.x = lb.x;
        vertex.y = lb.y;
        // 官方 LayoutVertex.node setter：focus = locationObject 中心 - bounds 原点
        const abOK = ab && Number.isFinite(ab.x) && Number.isFinite(ab.y) &&
          Number.isFinite(ab.width) && Number.isFinite(ab.height) && ab.width > 0 && ab.height > 0;
        if (abOK) {
          const fx = (ab.x + ab.width / 2) - lb.x;
          const fy = (ab.y + ab.height / 2) - lb.y;
          vertex.focus.set(Number.isFinite(fx) ? fx : w / 2, Number.isFinite(fy) ? fy : h / 2);
        } else {
          vertex.focus.set(w / 2, h / 2);
        }
      }
    }

    const it2 = parts.iterator;
    while (it2.next()) {
      const part: any = it2.value;
      if (part instanceof Link) {
        const link = part as Link;
        const fn: any = link.fromNode;
        const tn: any = link.toNode;
        if (!fn || !tn || fn === tn) continue;
        if (!nodeOK(fn) || !nodeOK(tn)) continue;
        net.addLink(link);
      }
    }

    this._network = net;
    return net;
  }

  // ============ doLayout ============

  doLayout(coll: any): void {
    if (this._network === null) this._network = this.makeNetwork(coll);
    if (this._arrangement !== TreeArrangementFixedRoots) {
      this._arrangementOrigin = this.initialOrigin();
    }
    // 官方 path → Ms 解析
    if (this._path === TreePathDefault) {
      const diag: any = this._diagram !== null ? this._diagram : (coll && coll._layers ? coll : null);
      this._Ms = diag && diag.isTreePathToChildren === false ? 2 : 1;
    } else {
      this._Ms = this._path === TreePathDestination ? 1 : 2;
    }

    if (this._network !== null && this._network.vertexes.count > 0) {
      this._initTrees();
      this._initializeCounts();
      this._assignTreeValues();
      this._sortTrees();
      this._addCommentsAll();
      this._layoutTreeReal();
      this.arrangeTrees();
      this.updateParts();
    }
    this._network = null;
    this._roots = new Set<TreeVertex>();
    this.isValidLayout = true;
  }

  // ============ 官方 YB — 建树 ============

  private _allVertexes(): Set<TreeVertex> {
    const s = new Set<TreeVertex>();
    const it = this._network!.vertexes.iterator;
    while (it.next()) s.add(it.value as TreeVertex);
    return s;
  }

  private _uninitialized(s: Set<TreeVertex>): Set<TreeVertex> {
    const r = new Set<TreeVertex>();
    const it = s.iterator;
    while (it.next()) { if (!it.value.initialized) r.add(it.value); }
    return r;
  }

  private _initTrees(): void {
    const net = this._network!;
    net.deleteSelfEdges();
    const it = net.vertexes.iterator;
    while (it.next()) {
      const v = it.value as TreeVertex;
      v.initialized = false;
      v.level = 0;
      v.parent = null;
      v.children = [];
    }
    if (this._roots.count > 0) {
      const filtered = new Set<TreeVertex>();
      const rit = this._roots.iterator;
      while (rit.next()) {
        const r: any = rit.value;
        if (r instanceof Node) {
          const vv = net.findVertex(r);
          if (vv !== null) filtered.add(vv as TreeVertex);
        } else {
          filtered.add(r);
        }
      }
      this._roots = filtered;
    }
    if (this._roots.count === 0) this._findRoots();

    const rootsCopy = this._roots.copy();
    const rcIt = rootsCopy.iterator;
    while (rcIt.next()) {
      const n = rcIt.value;
      if (!n.initialized) { n.initialized = true; this._walkTree(n); }
    }

    let e = this._allVertexes();
    for (;;) {
      const s = this._uninitialized(e);
      if (s.count === 0) break;
      const root = this._pickRoot(s);
      if (root !== null) {
        this._roots.add(root);
        root.initialized = true;
        this._walkTree(root);
      }
      e = s;
    }
  }

  /** 官方 findRoots */
  private _findRoots(): void {
    const v = this._network!.vertexes;
    const it = v.iterator;
    while (it.next()) {
      const e = it.value as TreeVertex;
      switch (this._Ms) {
        case 1:
          // 官方：sourceEdges（入边）count === 0 → 根
          if (e.sourceEdges.count === 0) this._roots.add(e);
          break;
        case 2:
          if (e.destinationEdges.count === 0) this._roots.add(e);
          break;
      }
    }
    if (this._roots.count === 0) {
      const r = this._pickRoot(this._allVertexes());
      if (r !== null) this._roots.add(r);
    }
  }

  /** 官方 dI — 选连接最少的顶点作根 */
  private _pickRoot(s: Set<TreeVertex>): TreeVertex | null {
    let min = 999999;
    let best: TreeVertex | null = null;
    const it = s.iterator;
    while (it.next()) {
      const n = it.value;
      const cnt = this._Ms === 1 ? n.sourceEdges.count : n.destinationEdges.count;
      if (cnt < min) { min = cnt; best = n; }
    }
    return best;
  }

  /** 官方 walkTree (tT) */
  private _walkTree(v: TreeVertex): void {
    switch (this._Ms) {
      case 1: {
        if (v.destinationEdges.count > 0) {
          const list: TreeVertex[] = [];
          const seen = new Set<TreeVertex>();
          const it = v.destinationEdges.iterator;
          while (it.next()) {
            const o = it.value.toVertex as TreeVertex | null;
            if (o !== null && o !== undefined && !seen.has(o) && this._walkOK(v, o)) {
              seen.add(o); list.push(o);
            }
          }
          if (list.length > 0) v.children = list;
        }
        break;
      }
      case 2: {
        if (v.sourceEdges.count > 0) {
          const list: TreeVertex[] = [];
          const seen = new Set<TreeVertex>();
          const it = v.sourceEdges.iterator;
          while (it.next()) {
            const o = it.value.fromVertex as TreeVertex | null;
            if (o !== null && o !== undefined && !seen.has(o) && this._walkOK(v, o)) {
              seen.add(o); list.push(o);
            }
          }
          if (list.length > 0) v.children = list;
        }
        break;
      }
    }
    for (const n of v.children) {
      n.initialized = true;
      n.level = v.level + 1;
      n.parent = v;
      this._roots.delete(n);
    }
    for (const n of v.children) this._walkTree(n);
  }

  /** 官方 walkOK (gI) */
  private _walkOK(v: TreeVertex, c: TreeVertex): boolean {
    if (!c.initialized) return true;
    if (this._isAncestor(c, v) || c.level > v.level) return false;
    this._removeChild(c.parent, c);
    return true;
  }

  /** 官方 isAncestor (vB) — a 是否为 b 的祖先 */
  private _isAncestor(a: TreeVertex, b: TreeVertex): boolean {
    let e = b.parent;
    while (e !== null && e !== a) e = e.parent;
    return e === a;
  }

  /** 官方 removeChild (WB) */
  private _removeChild(p: TreeVertex | null, c: TreeVertex): void {
    if (p === null) return;
    const arr = p.children;
    let count = 0;
    for (const n of arr) if (n === c) count++;
    if (count > 0) {
      const out: TreeVertex[] = [];
      for (const n of arr) if (n !== c) out.push(n);
      p.children = out;
    }
  }

  // ============ 官方 KB — 初始化顶点值与计数 ============

  private _initializeCounts(): void {
    const it = this._roots.iterator;
    while (it.next()) {
      const i = it.value;
      if (i instanceof TreeVertex && this._roots.has(i)) this._initializeTree(i);
    }
  }

  private _initializeTree(v: TreeVertex): void {
    this._initializeTreeVertexValues(v);
    if (v.alignment === TreeAlignmentBusBranching) this._sortTreeChildren(v);
    let i = 0;
    let e = v.childrenCount;
    let s = 0;
    for (const l of v.children) {
      this._initializeTree(l);
      i += l.descendantCount + 1;
      e = Math.max(e, l.maxChildrenCount);
      s = Math.max(s, l.maxGenerationCount);
    }
    v.descendantCount = i;
    v.maxChildrenCount = e;
    v.maxGenerationCount = e > 0 ? s + 1 : 0;
  }

  /** 官方 mom (jB) — 按 treeStyle 选择继承来源顶点 */
  private _mom(v: TreeVertex): TreeVertex {
    switch (this._treeStyle) {
      case TreeStyleRootOnly:
        return v.parent === null ? this._rootDefaults
          : (v.parent.parent === null ? this._alternateDefaults : v.parent);
      case TreeStyleAlternating:
        return v.parent !== null
          ? (v.parent.parent !== null ? v.parent.parent : this._alternateDefaults)
          : this._rootDefaults;
      case TreeStyleLastParents: {
        let allLeaves = true;
        if (v.childrenCount === 0) allLeaves = false;
        else {
          for (const c of v.children) if (c.childrenCount > 0) { allLeaves = false; break; }
        }
        return allLeaves && v.parent !== null ? this._alternateDefaults
          : (v.parent !== null ? v.parent : this._rootDefaults);
      }
      default:
      case TreeStyleLayered:
        return v.parent !== null ? v.parent : this._rootDefaults;
    }
  }

  private _initializeTreeVertexValues(v: TreeVertex): void {
    const src = this._mom(v);
    v.copyInheritedPropertiesFrom(src);
    if (v.parent !== null && v.parent.alignment === TreeAlignmentBusBranching) {
      let e = v.angle;
      const s = v.parent.children;
      let n = 0;
      while (n < s.length && v !== s[n]) n++;
      if (n % 2 === 0) {
        if (n !== s.length - 1) {
          e = e === 90 ? 180 : e === 180 ? 270 : e === 270 ? 180 : 270;
        }
      } else {
        e = e === 90 ? 0 : e === 180 ? 90 : e === 270 ? 0 : 90;
      }
      v.angle = e;
    }
    v.initialized = true;
  }

  // ============ 官方 UB — assign（官方为空实现） ============

  private _assignTreeValues(): void {
    const it = this._roots.iterator;
    while (it.next()) {
      const i = it.value;
      if (i instanceof TreeVertex) this._assignTree(i);
    }
  }

  private _assignTree(v: TreeVertex): void {
    // 官方 assignTreeVertexValues 为空
    for (const c of v.children) this._assignTree(c);
  }

  // ============ 官方 GB — 排序 ============

  private _sortTrees(): void {
    const it = this._roots.iterator;
    while (it.next()) {
      const i = it.value;
      if (i instanceof TreeVertex) this._sortTree(i);
    }
  }

  private _sortTree(v: TreeVertex): void {
    if (v.alignment !== TreeAlignmentBusBranching) this._sortTreeChildren(v);
    for (const c of v.children) this._sortTree(c);
  }

  private _sortTreeChildren(v: TreeVertex): void {
    switch (v.sorting) {
      default:
      case TreeSortingForwards:
        break;
      case TreeSortingReverse:
        v.children.reverse();
        break;
      case TreeSortingAscending:
        v.children.sort(v.comparer);
        break;
      case TreeSortingDescending:
        v.children.sort(v.comparer);
        v.children.reverse();
        break;
    }
  }

  // ============ 官方 vA — 注释 ============

  private _addCommentsAll(): void {
    if (!this._comments || this._network === null) return;
    const it = this._network.vertexes.iterator;
    while (it.next()) this._addComments(it.value as TreeVertex);
  }

  /** 官方 isBusAlignment */
  isBusAlignment(a: EnumValue): boolean {
    return a === TreeAlignmentBus || a === TreeAlignmentBusBranching ||
      a === TreeAlignmentTopLeftBus || a === TreeAlignmentBottomRightBus;
  }

  /** 官方 vw — 是否 Bus/BusBranching */
  private _isBusBranching(a: EnumValue): boolean {
    return a === TreeAlignmentBus || a === TreeAlignmentBusBranching;
  }

  /** 官方 iT — isLeftSideBus */
  private _isLeftSideBus(v: TreeVertex): boolean {
    const p = v.parent;
    if (p !== null) {
      const e = p.alignment;
      if (this.isBusAlignment(e)) {
        if (this._isBusBranching(e)) {
          const s = p.children;
          let n = 0;
          while (n < s.length && v !== s[n]) n++;
          return n % 2 === 0;
        }
        return e === TreeAlignmentTopLeftBus;
      }
    }
    return false;
  }

  private _addComments(v: TreeVertex): void {
    const i = v.angle;
    const p = v.parent;
    let s = 0;
    let n: EnumValue = TreeAlignmentCenterChildren;
    let o = false;
    if (p !== null) {
      s = p.angle;
      n = p.alignment;
      o = this.isBusAlignment(n);
    }
    const r = i === 90 || i === 270;
    const l = s === 90 || s === 270;
    const h = v.childrenCount === 0;
    let a = 0, c = 0, f = 0;
    const u = v.commentSpacing;
    if (v.node !== null) {
      const d = v.node.findNodesConnected().iterator;
      while (d.next()) {
        const m: any = d.value;
        if (m.category !== 'Comment') continue;
        if (typeof m.canLayout === 'function' && !m.canLayout()) continue;
        if (v.comments === null) v.comments = [];
        v.comments.push(m);
        m.ensureBounds();
        const g = m.measuredBounds;
        if ((r && !h) || (!o && !l && h) || (o && l && h)) {
          a = Math.max(a, g.width);
          c += g.height + Math.abs(f);
        } else {
          a += g.width + Math.abs(f);
          c = Math.max(c, g.height);
        }
        f = u;
      }
    }
    if (v.comments !== null) {
      if ((r && !h) || (!o && !l && h) || (o && l && h)) {
        a += Math.abs(v.commentMargin);
        c = Math.max(0, c - v.height);
      } else {
        c += Math.abs(v.commentMargin);
        a = Math.max(0, a - v.width);
      }
      v.bounds = new Rect(0, 0, v.bounds.width + a, v.bounds.height + c);
    }
  }

  // ============ 官方 qB — 层尺寸统一 + 树几何 ============

  private _layoutTreeReal(): void {
    const net = this._network!;
    if (this._layerStyle === TreeLayerStyleUniform) {
      const i: number[] = [];
      let it = net.vertexes.iterator;
      while (it.next()) {
        const s = it.value as TreeVertex;
        let p = s.parent;
        if (p === null) p = s;
        const horiz = p.angle === 0 || p.angle === 180;
        let r = i[s.level];
        if (r === undefined) r = 0;
        i[s.level] = Math.max(r, horiz ? s.width : s.height);
      }
      for (let k = 0; k < i.length; k++) if (i[k] === undefined) i[k] = 0;
      this._layerSizes = i;
      it = net.vertexes.iterator;
      while (it.next()) {
        const s = it.value as TreeVertex;
        let p = s.parent;
        if (p === null) p = s;
        if (p.angle === 0 || p.angle === 180) {
          if (p.angle === 180) s.focus.x += i[s.level] - s.width;
          s.width = i[s.level];
        } else {
          if (p.angle === 270) s.focus.y += i[s.level] - s.height;
          s.height = i[s.level];
        }
      }
    } else if (this._layerStyle === TreeLayerStyleSiblings) {
      const it = net.vertexes.iterator;
      while (it.next()) {
        const e = it.value as TreeVertex;
        const horiz = e.angle === 0 || e.angle === 180;
        let n = -1;
        for (const r of e.children) n = Math.max(n, horiz ? r.width : r.height);
        if (n >= 0) {
          for (const r of e.children) {
            if (horiz) {
              if (e.angle === 180) r.focus.x += n - r.width;
              r.width = n;
            } else {
              if (e.angle === 270) r.focus.y += n - r.height;
              r.height = n;
            }
          }
        }
      }
    }
    const t = this._roots.iterator;
    while (t.next()) {
      const i = t.value;
      if (i instanceof TreeVertex) this._layoutTree(i);
    }
  }

  private _layoutTree(v: TreeVertex): void {
    if (v === null) return;
    for (const n of v.children) this._layoutTree(n);
    switch (v.compaction) {
      case TreeCompactionNone:
        this._layoutTreeNone(v);
        break;
      default:
      case TreeCompactionBlock:
        if (v.alignment === TreeAlignmentBusBranching) this._layoutTreeNone(v);
        else this._layoutTreeBlock(v);
        break;
    }
  }

  /** 官方 orthoAngle */
  orthoAngle(v: TreeVertex): number {
    const i = v.angle;
    return i <= 45 ? 0 : i <= 135 ? 90 : i <= 225 ? 180 : i <= 315 ? 270 : 0;
  }

  /** 官方 computeLayerSpacing */
  computeLayerSpacing(v: TreeVertex): number {
    const i = this.orthoAngle(v);
    const e = i === 90 || i === 270;
    let s = v.layerSpacing;
    if (v.layerSpacingParentOverlap > 0) {
      const n = Math.min(1, v.layerSpacingParentOverlap);
      s -= e ? v.height * n : v.width * n;
    }
    if (s < (e ? -v.height : -v.width)) s = e ? -v.height : -v.width;
    return s;
  }

  /** 官方 computeNodeIndent */
  computeNodeIndent(v: TreeVertex): number {
    const i = this.orthoAngle(v);
    const e = i === 90 || i === 270;
    let s = v.nodeIndent;
    if (v.nodeIndentPastParent > 0) {
      const n = Math.min(1, v.nodeIndentPastParent);
      s += e ? v.width * n : v.height * n;
    }
    return s;
  }

  /** 官方 computeBusNodeSpacing */
  private _computeBusNodeSpacing(c: TreeVertex): number {
    return c.parent === null ? 0 : c.parent.nodeSpacing;
  }

  /** 官方 computeBusLastRowSpacing */
  private _computeBusLastRowSpacing(c: TreeVertex, _dir: number): number {
    return c.parent === null ? 0 : c.parent.rowSpacing;
  }

  /** 官方 ke — 分配点数组 */
  private _ke(n: number): Point[] {
    const pool = this._pool[n];
    if (pool !== undefined) {
      const s = pool.pop();
      if (s !== undefined) return s;
    }
    const e: Point[] = [];
    for (let i = 0; i < n; i++) e.push(new Point(0, 0));
    return e;
  }

  /** 官方 bn — 回收点数组 */
  private _bn(arr: Point[] | null): void {
    if (!arr) return;
    const i = arr.length;
    let e = this._pool[i];
    if (e === undefined) { e = []; this._pool[i] = e; }
    e.push(arr);
  }

  /** 官方 recordMidPoints (Ik) */
  private _recordMidPoints(v: TreeVertex, x: number, y: number): void {
    const p = v.parent;
    switch (this._Ms) {
      case 1: {
        const n = v.sourceEdges;
        const it = n.iterator;
        while (it.next()) {
          const o = it.value;
          if (o.fromVertex === p && o instanceof TreeEdge) o.relativePoint.set(x, y);
        }
        break;
      }
      case 2: {
        const n = v.destinationEdges;
        const it = n.iterator;
        while (it.next()) {
          const o = it.value;
          if (o.toVertex === p && o instanceof TreeEdge) o.relativePoint.set(x, y);
        }
        break;
      }
    }
  }

  /** 官方 shiftRelPos (Iu) */
  private _shiftRelPos(v: TreeVertex, dx: number, dy: number, from: number, to: number): void {
    if (dx === 0 && dy === 0) return;
    const ch = v.children;
    for (let r = from; r <= to; r++) {
      const h = ch[r].relativePosition;
      h.x += dx;
      h.y += dy;
    }
  }

  /** 官方 nT — 按 alignment 拆分偏移 */
  private _alignOffset(alignment: EnumValue, dx: number, dy: number): Point {
    switch (alignment) {
      case TreeAlignmentCenterSubtrees:
      case TreeAlignmentCenterChildren:
        return new Point(dx / 2, dy / 2);
      case TreeAlignmentStart:
        return new Point(0, 0);
      case TreeAlignmentEnd:
        return new Point(dx, dy);
      default:
        return new Point(dx, dy);
    }
  }

  /** 官方 Bc — shiftRelPosAlign */
  private _shiftRelPosAlign(v: TreeVertex, alignment: EnumValue, dx: number, dy: number, from: number, to: number): void {
    const r = this._alignOffset(alignment, dx, dy);
    this._shiftRelPos(v, r.x, r.y, from, to);
  }

  /** 官方 Ek — 平移点数组 */
  private _shiftPoints(arr: Point[] | null, dx: number, dy: number): void {
    if (!arr) return;
    for (const p of arr) { p.x += dx; p.y += dy; }
  }

  /** 官方 calculateSubwidth (eT) */
  private _calculateSubwidth(v: TreeVertex, w: number, x: number): number {
    switch (v.alignment) {
      case TreeAlignmentCenterChildren:
      case TreeAlignmentCenterSubtrees: {
        let s = w;
        if (x + v.width > s) s = x + v.width;
        if (x < 0) s -= x;
        return s;
      }
      case TreeAlignmentStart:
        return v.width > w ? v.width : w;
      case TreeAlignmentEnd:
        return v.focus.x * 2 > w ? v.width : w + v.width - v.focus.x * 2;
      case TreeAlignmentBus:
      case TreeAlignmentBusBranching: {
        const n = Math.min(0, x);
        const o = Math.max(w, x + v.width);
        return Math.max(v.width, o - n);
      }
      case TreeAlignmentTopLeftBus:
        return v.width - v.focus.x + v.nodeSpacing / 2 + w;
      case TreeAlignmentBottomRightBus:
        return Math.max(v.width, v.focus.x + v.nodeSpacing / 2 + w);
      default:
        return w;
    }
  }

  /** 官方 calculateSubheight (sT) */
  private _calculateSubheight(v: TreeVertex, h: number, y: number): number {
    switch (v.alignment) {
      case TreeAlignmentCenterChildren:
      case TreeAlignmentCenterSubtrees: {
        let s = h;
        if (y + v.height > s) s = y + v.height;
        if (y < 0) s -= y;
        return s;
      }
      case TreeAlignmentStart:
        return v.height > h ? v.height : h;
      case TreeAlignmentEnd:
        return v.focus.y * 2 > h ? v.height : h + v.height - v.focus.y * 2;
      case TreeAlignmentBus:
      case TreeAlignmentBusBranching: {
        const n = Math.min(0, y);
        const o = Math.max(h, y + v.height);
        return Math.max(v.height, o - n);
      }
      case TreeAlignmentTopLeftBus:
        return v.height - v.focus.y + v.nodeSpacing / 2 + h;
      case TreeAlignmentBottomRightBus:
        return Math.max(v.height, v.focus.y + v.nodeSpacing / 2 + h);
      default:
        return h;
    }
  }

  /** 官方 customAlignment — 子类可覆盖 */
  protected customAlignment(_v: TreeVertex, dx: number, dy: number, w: number, h: number): number[] {
    return [dx, dy, w, h];
  }

  // ---- 官方 fringe 合并（Block 压缩） ----

  /** 官方 tV — merge fringes（垂直方向推进） */
  private _mergeFringesX(f: Point[] | null, g: Point[] | null, e: number): Point[] | null {
    if (f === null || f.length < 2 || g === null || g.length < 2) return null;
    const s = this._ke(f.length + g.length);
    let n = 0, o = 0, r = 0;
    while (o < g.length && g[o].x < f[0].x) { const a = g[o++]; s[r++].set(a.x, a.y + e); }
    while (n < f.length) { const a = f[n++]; s[r++].set(a.x, a.y); }
    const l = f[f.length - 1].x;
    while (o < g.length && g[o].x <= l) o++;
    while (o < g.length && g[o].x > l) { const a = g[o++]; s[r++].set(a.x, a.y + e); }
    const h = this._ke(r);
    for (n = 0; n < r; n++) h[n].set(s[n].x, s[n].y);
    this._bn(s);
    return h;
  }

  /** 官方 ZB */
  private _mergeFringesY(f: Point[] | null, g: Point[] | null, e: number): Point[] | null {
    if (f === null || f.length < 2 || g === null || g.length < 2) return null;
    const s = this._ke(f.length + g.length);
    let n = 0, o = 0, r = 0;
    while (o < g.length && g[o].y < f[0].y) { const a = g[o++]; s[r++].set(a.x + e, a.y); }
    while (n < f.length) { const a = f[n++]; s[r++].set(a.x, a.y); }
    const l = f[f.length - 1].y;
    while (o < g.length && g[o].y <= l) o++;
    while (o < g.length && g[o].y > l) { const a = g[o++]; s[r++].set(a.x + e, a.y); }
    const h = this._ke(r);
    for (n = 0; n < r; n++) h[n].set(s[n].x, s[n].y);
    this._bn(s);
    return h;
  }

  /** 官方 iV */
  private _mergeFringesX2(t: Point[] | null, g: Point[] | null, e: number): Point[] | null {
    if (t === null || t.length < 2 || g === null || g.length < 2) return null;
    const s = this._ke(t.length + g.length);
    let n = 0, o = 0, r = 0;
    while (n < t.length && t[n].x < g[0].x) { const a = t[n++]; s[r++].set(a.x, a.y); }
    while (o < g.length) { const a = g[o++]; s[r++].set(a.x, a.y + e); }
    const l = g[g.length - 1].x;
    while (n < t.length && t[n].x <= l) n++;
    while (n < t.length && t[n].x > l) { const a = t[n++]; s[r++].set(a.x, a.y); }
    const h = this._ke(r);
    for (n = 0; n < r; n++) h[n].set(s[n].x, s[n].y);
    this._bn(s);
    return h;
  }

  /** 官方 QB */
  private _mergeFringesY2(t: Point[] | null, g: Point[] | null, e: number): Point[] | null {
    if (t === null || t.length < 2 || g === null || g.length < 2) return null;
    const s = this._ke(t.length + g.length);
    let n = 0, o = 0, r = 0;
    while (n < t.length && t[n].y < g[0].y) { const a = t[n++]; s[r++].set(a.x, a.y); }
    while (o < g.length) { const a = g[o++]; s[r++].set(a.x + e, a.y); }
    const l = g[g.length - 1].y;
    while (n < t.length && t[n].y <= l) n++;
    while (n < t.length && t[n].y > l) { const a = t[n++]; s[r++].set(a.x, a.y); }
    const h = this._ke(r);
    for (n = 0; n < r; n++) h[n].set(s[n].x, s[n].y);
    this._bn(s);
    return h;
  }

  /** 官方 _B — minimum separation (x-fringes) */
  private _minSepX(t: Point[] | null, g: Point[] | null, e: number): number {
    let s = 9999999;
    if (t === null || t.length < 2 || g === null || g.length < 2) return s;
    let n = 0, o = 0;
    while (n < t.length && o < g.length) {
      const r = t[n], l = g[o], h = l.x;
      let a = l.y;
      a += e;
      let c = r;
      if (n + 1 < t.length) c = t[n + 1];
      let f = l, u = f.x, d = f.y;
      if (o + 1 < g.length) { f = g[o + 1]; u = f.x; d = f.y; d += e; }
      let m = s;
      if (r.x === h) m = a - r.y;
      else if (r.x > h && r.x < u) m = a + ((r.x - h) / (u - h)) * (d - a) - r.y;
      else if (h > r.x && h < c.x) m = a - (r.y + ((h - r.x) / (c.x - r.x)) * (c.y - r.y));
      if (m < s) s = m;
      if (c.x <= r.x) n++;
      else if (u <= h) o++;
      else { if (c.x <= u) n++; if (u <= c.x) o++; }
    }
    return s;
  }

  /** 官方 $B — minimum separation (y-fringes) */
  private _minSepY(t: Point[] | null, g: Point[] | null, e: number): number {
    let s = 9999999;
    if (t === null || t.length < 2 || g === null || g.length < 2) return s;
    let n = 0, o = 0;
    while (n < t.length && o < g.length) {
      const r = t[n], l = g[o];
      let h = l.x;
      const a = l.y;
      h += e;
      let c = r;
      if (n + 1 < t.length) c = t[n + 1];
      let f = l, u = f.x, d = f.y;
      if (o + 1 < g.length) { f = g[o + 1]; u = f.x; d = f.y; u += e; }
      let m = s;
      if (r.y === a) m = h - r.x;
      else if (r.y > a && r.y < d) m = h + ((r.y - a) / (d - a)) * (u - h) - r.x;
      else if (a > r.y && a < c.y) m = h - (r.x + ((a - r.y) / (c.y - r.y)) * (c.x - r.x));
      if (m < s) s = m;
      if (c.y <= r.y) n++;
      else if (d <= a) o++;
      else { if (c.y <= d) n++; if (d <= c.y) o++; }
    }
    return s;
  }

  /** 官方 mergeFringes (SI) — 合并父/子边线并返回子顶点的新块位置 */
  private _mergeFringes(
    parent: TreeVertex, child: TreeVertex,
    f: Point[] | null, u: Point[] | null, A: number, N: number,
    r: (Point[] | null)[] | undefined, l: Rect
  ): void {
    const h = this.orthoAngle(parent);
    const a = h === 90 || h === 270;
    const c = parent.nodeSpacing;
    const g = child.mm;
    const p = child.pm;
    const y = child.subtreeSize;
    const x = a ? Math.max(N, y.height) : Math.max(A, y.width);
    let ng = g, np = p;
    if (ng === null || h !== this.orthoAngle(child)) {
      ng = this._ke(2);
      np = this._ke(2);
      if (a) {
        ng[0].set(0, 0); ng[1].set(0, y.height);
        np[0].set(y.width, 0); np[1].set(np[0].x, ng[1].y);
      } else {
        ng[0].set(0, 0); ng[1].set(y.width, 0);
        np[0].set(0, y.height); np[1].set(ng[1].x, np[0].y);
      }
    }
    if (a) {
      const b = A;
      let S = b - this._minSepY(u, ng, b);
      S += c;
      const e = this._mergeFringesY(f, ng, S);
      const s = this._mergeFringesY2(u, np, S);
      const n = Math.max(0, S) + y.width;
      const o = x;
      this._bn(f); this._bn(ng); this._bn(u); this._bn(np);
      if (r !== undefined) { r[0] = e; r[1] = s; }
      l.set(S, 0, n, o);
    } else {
      const b = N;
      let S = b - this._minSepX(u, ng, b);
      S += c;
      const e = this._mergeFringesX(f, ng, S);
      const s = this._mergeFringesX2(u, np, S);
      const n = x;
      const o = Math.max(0, S) + y.height;
      this._bn(f); this._bn(ng); this._bn(u); this._bn(np);
      if (r !== undefined) { r[0] = e; r[1] = s; }
      l.set(S, 0, n, o);
    }
  }

  // ---- 官方 xI/bI — Bus 总线布局 ----

  /** 官方 layoutBusChildrenPosDir (xI) */
  private _layoutBusChildrenPosDir(
    v: TreeVertex, ch: TreeVertex[], e: number, s: number, n: number, o: number, r: Rect
  ): Rect {
    const l = ch.length;
    if (l === 0) { r.set(e, 0, n, o); return r; }
    if (l === 1) {
      const y = ch[0];
      n = y.subtreeSize.width;
      o = y.subtreeSize.height;
      r.set(e, 0, n, o);
      return r;
    }
    const h = v.nodeSpacing;
    const a = v.rowSpacing;
    const f = this.orthoAngle(v) === 90;
    let u = 0, d = 0, m = 0;
    for (let y = 0; y < l; y++) {
      if (y % 2 !== 0 || (l > 1 && y === l - 1)) continue;
      const x = ch[y], b = x.subtreeSize, S = u === 0 ? 0 : a;
      if (f) {
        const k = this._computeBusNodeSpacing(x) - h;
        x.relativePosition.set(e - (b.width + k), m + S);
        n = Math.max(n, b.width + k);
        o = Math.max(o, m + S + b.height);
        m += S + b.height;
      } else {
        const k = this._computeBusNodeSpacing(x) - h;
        x.relativePosition.set(d + S, e - (b.height + k));
        o = Math.max(o, b.height + k);
        n = Math.max(n, d + S + b.width);
        d += S + b.width;
      }
      u++;
    }
    u = 0;
    const g = d, p = m;
    if (f) { d = e + h; m = 0; } else { d = 0; m = e + h; }
    for (let y = 0; y < l; y++) {
      if (y % 2 === 0) continue;
      const x = ch[y], b = x.subtreeSize, S = u === 0 ? 0 : a;
      if (f) {
        const k = this._computeBusNodeSpacing(x) - h;
        x.relativePosition.set(d + k, m + S);
        n = Math.max(n, d + b.width + k);
        o = Math.max(o, m + S + b.height);
        m += S + b.height;
      } else {
        const k = this._computeBusNodeSpacing(x) - h;
        x.relativePosition.set(d + S, m + k);
        n = Math.max(n, d + S + b.width);
        o = Math.max(o, m + b.height + k);
        d += S + b.width;
      }
      u++;
    }
    if (l > 1 && l % 2 === 1) {
      const y = ch[l - 1], x = y.subtreeSize;
      const b = this._computeBusLastRowSpacing(y, f ? Math.max(Math.abs(p), Math.abs(m)) : Math.max(Math.abs(g), Math.abs(d)));
      if (f) {
        const S = e + h / 2 - y.focus.x - y.subtreeOffset.x;
        y.relativePosition.set(S, o + b);
        n = Math.max(n, S + x.width);
        if (S < 0) n -= S;
        o = Math.max(o, Math.max(p, m) + b + x.height);
        if (y.relativePosition.x < 0) e = this._fixRelativePositions(v, y.relativePosition.x, false, e, h);
      } else {
        const S = e + h / 2 - y.focus.y - y.subtreeOffset.y;
        y.relativePosition.set(n + b, S);
        n = Math.max(n, Math.max(g, d) + b + x.width);
        o = Math.max(o, S + x.height);
        if (S < 0) o -= S;
        if (y.relativePosition.y < 0) e = this._fixRelativePositions(v, y.relativePosition.y, true, e, h);
      }
    }
    r.set(e, 0, n, o);
    return r;
  }

  /** 官方 layoutBusChildrenNegDir (bI) */
  private _layoutBusChildrenNegDir(
    v: TreeVertex, ch: TreeVertex[], e: number, s: number, n: number, o: number, r: Rect
  ): Rect {
    const l = ch.length;
    if (l === 0) { r.set(e, 0, n, o); return r; }
    if (l === 1) {
      const y = ch[0];
      n = y.subtreeSize.width;
      o = y.subtreeSize.height;
      r.set(e, 0, n, o);
      return r;
    }
    const h = v.nodeSpacing;
    const a = v.rowSpacing;
    const f = this.orthoAngle(v) === 270;
    let u = 0, d = 0, m = 0;
    for (let y = 0; y < l; y++) {
      if (y % 2 !== 0 || (l > 1 && y === l - 1)) continue;
      const x = ch[y], b = x.subtreeSize, S = u === 0 ? 0 : a;
      if (f) {
        const k = this._computeBusNodeSpacing(x) - h;
        m -= S + b.height;
        x.relativePosition.set(e - (b.width + k), m);
        n = Math.max(n, b.width + k);
        o = Math.max(o, Math.abs(m));
      } else {
        const k = this._computeBusNodeSpacing(x) - h;
        d -= S + b.width;
        x.relativePosition.set(d, e - (b.height + k));
        o = Math.max(o, b.height + k);
        n = Math.max(n, Math.abs(d));
      }
      u++;
    }
    u = 0;
    const g = d, p = m;
    if (f) { d = e + h; m = 0; } else { d = 0; m = e + h; }
    for (let y = 0; y < l; y++) {
      if (y % 2 === 0) continue;
      const x = ch[y], b = x.subtreeSize, S = u === 0 ? 0 : a;
      if (f) {
        const k = this._computeBusNodeSpacing(x) - h;
        m -= S + b.height;
        x.relativePosition.set(d + k, m);
        n = Math.max(n, d + b.width + k);
        o = Math.max(o, Math.abs(m));
      } else {
        const k = this._computeBusNodeSpacing(x) - h;
        d -= S + b.width;
        x.relativePosition.set(d, m + k);
        o = Math.max(o, m + b.height + k);
        n = Math.max(n, Math.abs(d));
      }
      u++;
    }
    if (l > 1 && l % 2 === 1) {
      const y = ch[l - 1], x = y.subtreeSize;
      const b = this._computeBusLastRowSpacing(y, f ? Math.max(Math.abs(p), Math.abs(m)) : Math.max(Math.abs(g), Math.abs(d)));
      if (f) {
        const S = e + h / 2 - y.focus.x - y.subtreeOffset.x;
        y.relativePosition.set(S, -o - x.height - b);
        n = Math.max(n, S + x.width);
        if (S < 0) n -= S;
        o = Math.max(o, Math.abs(Math.min(p, m)) + b + x.height);
        if (y.relativePosition.x < 0) e = this._fixRelativePositions(v, y.relativePosition.x, false, e, h);
      } else {
        const S = e + h / 2 - y.focus.y - y.subtreeOffset.y;
        y.relativePosition.set(-n - x.width - b, S);
        n = Math.max(n, Math.abs(Math.min(g, d)) + b + x.width);
        o = Math.max(o, S + x.height);
        if (S < 0) o -= S;
        if (y.relativePosition.y < 0) e = this._fixRelativePositions(v, y.relativePosition.y, true, e, h);
      }
    }
    for (let y = 0; y < l; y++) {
      const x = ch[y];
      if (f) x.relativePosition.set(x.relativePosition.x, x.relativePosition.y + o);
      else x.relativePosition.set(x.relativePosition.x + n, x.relativePosition.y);
    }
    r.set(e, 0, n, o);
    return r;
  }

  /** 官方 fixRelativePostions (Ok) */
  private _fixRelativePositions(v: TreeVertex, delta: number, vertical: boolean, e: number, spacing: number): number {
    const o = v.children;
    const r = o.length;
    for (let h = 0; h < r; h++) {
      if (vertical) o[h].relativePosition.set(o[h].relativePosition.x, o[h].relativePosition.y - delta);
      else o[h].relativePosition.set(o[h].relativePosition.x - delta, o[h].relativePosition.y);
    }
    const l = o[r - 1];
    return Math.max(e, vertical ? l.subtreeOffset.y + l.focus.y - spacing / 2 : l.subtreeOffset.x + l.focus.x - spacing / 2);
  }

  // ============ 官方 wI — layoutTreeNone（compaction = None） ============

  private _layoutTreeNone(v: TreeVertex): void {
    if (v.childrenCount === 0) {
      let R = false, I = 0, O: EnumValue = TreeAlignmentCenterChildren;
      if (v.parent !== null) {
        I = v.parent.angle;
        O = v.parent.alignment;
        R = this.isBusAlignment(O);
      }
      const X = this._isLeftSideBus(v);
      v.relativePosition.set(0, 0);
      v.subtreeSize.set(v.width, v.height);
      if (v.parent !== null && v.comments !== null) {
        if (((I === 180 || I === 270) && !R) || X) {
          if ((I === 180 && !R) || ((I === 90 || I === 270) && X)) v.subtreeOffset.set(v.width - v.focus.x * 2, 0);
          else v.subtreeOffset.set(0, v.height - v.focus.y * 2);
        } else v.subtreeOffset.set(0, 0);
      } else v.subtreeOffset.set(0, 0);
      return;
    }
    const i = this.orthoAngle(v);
    const e = i === 90 || i === 270;
    let s = 0;
    const n = v.children, o = n.length;
    for (let R = 0; R < o; R++) {
      const I = n[R];
      s = Math.max(s, e ? I.subtreeSize.width : I.subtreeSize.height);
    }
    const r = v.alignment;
    const l = r === TreeAlignmentStart;
    const h = r === TreeAlignmentEnd;
    const a = this.isBusAlignment(r);
    const c = Math.max(0, v.breadthLimit);
    const f = this.computeLayerSpacing(v);
    const u = v.nodeSpacing;
    const d = this.computeNodeIndent(v);
    const m = l || h ? 0 : d / 2;
    const g = v.rowSpacing;
    let p = 0;
    if (l || h) p = Math.max(0, v.rowIndent);
    const y = v.width, x = v.height;
    let b = 0, S = 0, k = 0, P = 0, A = 0, N = 0, M = 0, C = 0, T = 0, L = 0;
    if (a && !this._isBusBranching(r) && i > 135) n.reverse();
    if (this._isBusBranching(r)) {
      if (o > 1) {
        for (let R = 0; R < o; R++) {
          const I = n[R], O = I.subtreeSize;
          if (R % 2 === 0 && R !== o - 1) T = Math.max(T, (e ? O.width : O.height) + this._computeBusNodeSpacing(I) - u);
          else if (R % 2 !== 0) L = Math.max(L, (e ? O.width : O.height) + this._computeBusNodeSpacing(I) - u);
        }
      } else if (o === 1) {
        T = e ? n[0].subtreeSize.width : n[0].subtreeSize.height;
      }
    }
    if (a) {
      switch (r) {
        case TreeAlignmentBus:
        case TreeAlignmentBusBranching: {
          const R = new Rect(0, 0, 0, 0);
          if (i < 135) this._layoutBusChildrenPosDir(v, n, T, L, b, S, R);
          else this._layoutBusChildrenNegDir(v, n, T, L, b, S, R);
          T = R.x; b = R.width; S = R.height;
          break;
        }
        case TreeAlignmentTopLeftBus:
          for (let I = 0; I < o; I++) {
            const O = n[I], X = O.subtreeSize, Y = M === 0 ? 0 : g;
            if (e) {
              O.relativePosition.set(s - X.width, A + Y);
              b = Math.max(b, X.width);
              S = Math.max(S, A + Y + X.height);
              A += Y + X.height;
            } else {
              O.relativePosition.set(P + Y, s - X.height);
              b = Math.max(b, P + Y + X.width);
              S = Math.max(S, X.height);
              P += Y + X.width;
            }
            M++;
          }
          break;
        case TreeAlignmentBottomRightBus:
          for (let I = 0; I < o; I++) {
            const O = n[I], X = O.subtreeSize, Y = M === 0 ? 0 : g;
            if (e) {
              O.relativePosition.set(u / 2 + v.focus.x, A + Y);
              b = Math.max(b, X.width);
              S = Math.max(S, A + Y + X.height);
              A += Y + X.height;
            } else {
              O.relativePosition.set(P + Y, u / 2 + v.focus.y);
              b = Math.max(b, P + Y + X.width);
              S = Math.max(S, X.height);
              P += Y + X.width;
            }
            M++;
          }
          break;
      }
    } else {
      for (let R = 0; R < o; R++) {
        const I = n[R], O = I.subtreeSize;
        if (e) {
          if (c > 0 && M > 0 && P + u + O.width > c) {
            if (P < s) this._shiftRelPosAlign(v, r, s - P, 0, C, R - 1);
            N++; M = 0; C = R; k = S; P = 0;
            A = i > 135 ? -S - g : S + g;
          }
          const X = M === 0 ? m : u;
          this._recordMidPoints(I, 0, A);
          I.relativePosition.set(P + X, A);
          b = Math.max(b, P + X + O.width);
          S = Math.max(S, k + (N === 0 ? 0 : g) + O.height);
          P += X + O.width;
        } else {
          if (c > 0 && M > 0 && A + u + O.height > c) {
            if (A < s) this._shiftRelPosAlign(v, r, 0, s - A, C, R - 1);
            N++; M = 0; C = R; k = b; A = 0;
            P = i > 135 ? -b - g : b + g;
          }
          const X = M === 0 ? m : u;
          this._recordMidPoints(I, P, 0);
          I.relativePosition.set(P, A + X);
          S = Math.max(S, A + X + O.height);
          b = Math.max(b, k + (N === 0 ? 0 : g) + O.width);
          A += X + O.height;
        }
        M++;
      }
    }
    if (N > 0) {
      if (e) {
        S += Math.max(0, f);
        if (P < b) this._shiftRelPosAlign(v, r, b - P, 0, C, o - 1);
        if (p > 0) {
          if (!h) this._shiftRelPos(v, p, 0, 0, o - 1);
          b += p;
        }
      } else {
        b += Math.max(0, f);
        if (A < S) this._shiftRelPosAlign(v, r, 0, S - A, C, o - 1);
        if (p > 0) {
          if (!h) this._shiftRelPos(v, 0, p, 0, o - 1);
          S += p;
        }
      }
    }
    let D = 0, F = 0;
    switch (r) {
      case TreeAlignmentCenterSubtrees:
        if (e) D += b / 2 - v.focus.x - d / 2;
        else F += S / 2 - v.focus.y - d / 2;
        break;
      default:
      case TreeAlignmentCenterChildren:
        if (N > 0) {
          if (e) D += b / 2 - v.focus.x - d / 2;
          else F += S / 2 - v.focus.y - d / 2;
        } else {
          const I = o;
          if (e) {
            const O = n[0].relativePosition.x + n[0].subtreeOffset.x;
            const X = n[I - 1].relativePosition.x + n[I - 1].subtreeOffset.x + n[I - 1].focus.x * 2;
            D += O + (X - O) / 2 - v.focus.x - d / 2;
          } else {
            const O = n[0].relativePosition.y + n[0].subtreeOffset.y;
            const X = n[I - 1].relativePosition.y + n[I - 1].subtreeOffset.y + n[I - 1].focus.y * 2;
            F += O + (X - O) / 2 - v.focus.y - d / 2;
          }
        }
        break;
      case TreeAlignmentStart:
        if (e) { D -= d; b += d; } else { F -= d; S += d; }
        break;
      case TreeAlignmentEnd:
        if (e) { D += b - v.width + d; b += d; } else { F += S - v.height + d; S += d; }
        break;
      case TreeAlignmentBus:
      case TreeAlignmentBusBranching:
        if (e) {
          if (o > 1) D += T + u / 2 - v.focus.x;
          else D += n[0].focus.x - v.focus.x + n[0].subtreeOffset.x;
        } else {
          if (o > 1) F += T + u / 2 - v.focus.y;
          else F += n[0].focus.y - v.focus.y + n[0].subtreeOffset.y;
        }
        break;
      case TreeAlignmentTopLeftBus:
        if (e) D += b + u / 2 - v.focus.x;
        else F += S + u / 2 - v.focus.y;
        break;
      case TreeAlignmentBottomRightBus:
        break;
      case TreeAlignmentCustom: {
        const R = this.customAlignment(v, D, F, b, S);
        D = R[0]; F = R[1]; b = R[2]; S = R[3];
        break;
      }
    }
    for (let R = 0; R < o; R++) {
      const I = n[R];
      if (e) {
        I.relativePosition.set(
          I.relativePosition.x + I.subtreeOffset.x - D,
          I.relativePosition.y + (i > 135 ? (a ? -S : -I.subtreeSize.height) + I.subtreeOffset.y - f : x + f + I.subtreeOffset.y)
        );
      } else {
        I.relativePosition.set(
          I.relativePosition.x + (i > 135 ? (a ? -b : -I.subtreeSize.width) + I.subtreeOffset.x - f : y + f + I.subtreeOffset.x),
          I.relativePosition.y + I.subtreeOffset.y - F
        );
      }
    }
    if (e) {
      b = this._calculateSubwidth(v, b, D);
      if (D < 0) D = 0;
      if (i > 135) F += S + f;
      S = Math.max(Math.max(S, x), S + x + f);
    } else {
      if (i > 135) D += b + f;
      b = Math.max(Math.max(b, y), b + y + f);
      S = this._calculateSubheight(v, S, F);
      if (F < 0) F = 0;
    }
    v.subtreeOffset.set(D, F);
    v.subtreeSize.set(b, S);
  }

  // ============ 官方 JB — layoutTreeBlock（compaction = Block） ============

  private _layoutTreeBlock(v: TreeVertex): void {
    if (v.childrenCount === 0) {
      const par = v.parent;
      let pa = 0;
      let pr: EnumValue = TreeAlignmentCenterChildren;
      let pb = false;
      if (par !== null) {
        pa = par.angle;
        pr = par.alignment;
        pb = this.isBusAlignment(pr);
      }
      const left = this._isLeftSideBus(v);
      v.relativePosition.set(0, 0);
      v.subtreeSize.set(v.width, v.height);
      if (v.parent !== null && v.comments !== null &&
          (((pa === 180 || pa === 270) && !pb) || left)) {
        if ((pa === 180 && !pb) || ((pa === 90 || pa === 270) && left)) {
          v.subtreeOffset.set(v.width - v.focus.x * 2, 0);
        } else {
          v.subtreeOffset.set(0, v.height - v.focus.y * 2);
        }
      } else {
        v.subtreeOffset.set(0, 0);
      }
      v.mm = null;
      v.pm = null;
      return;
    }
    const i = this.orthoAngle(v);
    const e = i === 90 || i === 270;
    let s = 0;
    const n = v.children, o = n.length;
    for (let z = 0; z < o; z++) {
      const ch = n[z];
      s = Math.max(s, e ? ch.subtreeSize.width : ch.subtreeSize.height);
    }
    const r = v.alignment;
    const l = r === TreeAlignmentStart;
    const h = r === TreeAlignmentEnd;
    const a = this.isBusAlignment(r);
    const c = Math.max(0, v.breadthLimit);
    const f = this.computeLayerSpacing(v);
    const u = v.nodeSpacing;
    const d = this.computeNodeIndent(v);
    const m = v.rowSpacing;
    let g = 0;
    if (l || h) g = Math.max(0, v.rowIndent);
    const p = v.width, y = v.height;
    let x = 0, b = 0, S = 0;             // 子树总宽/总高/主轴已排长度
    let k: Point[] | null = null, P: Point[] | null = null;   // 起止边线
    let A = 0, N = 0;                    // 当前合并块宽/高
    let M = 0, C = 0;                    // 交叉轴/主轴当前位置
    let T = 0, L = 0, D = 0;             // 换行数/本行计数/换行起始下标
    let F = 0, R = 0;                    // Bus 两侧最大值

    if (a && !this._isBusBranching(r) && i > 135) n.reverse();
    if (this._isBusBranching(r)) {
      if (o > 1) {
        for (let z = 0; z < o; z++) {
          const size = n[z].subtreeSize;
          const dim = e ? size.width : size.height;
          if (z % 2 === 0 && z !== o - 1) F = Math.max(F, dim + this._computeBusNodeSpacing(n[z]) - u);
          else if (z % 2 !== 0) R = Math.max(R, dim + this._computeBusNodeSpacing(n[z]) - u);
        }
      } else if (o === 1) {
        F = e ? n[0].subtreeSize.width : n[0].subtreeSize.height;
      }
    }
    if (a) {
      switch (r) {
        case TreeAlignmentBus:
        case TreeAlignmentBusBranching: {
          const rect = new Rect(0, 0, 0, 0);
          if (i < 135) this._layoutBusChildrenPosDir(v, n, F, R, x, b, rect);
          else this._layoutBusChildrenNegDir(v, n, F, R, x, b, rect);
          F = rect.x; x = rect.width; b = rect.height;
          break;
        }
        case TreeAlignmentTopLeftBus:
          for (let z = 0; z < o; z++) {
            const ch = n[z], size = ch.subtreeSize, gap = L === 0 ? 0 : m;
            if (e) {
              ch.relativePosition.set(s - size.width, C + gap);
              x = Math.max(x, size.width);
              b = Math.max(b, C + gap + size.height);
              C += gap + size.height;
            } else {
              ch.relativePosition.set(M + gap, s - size.height);
              x = Math.max(x, M + gap + size.width);
              b = Math.max(b, size.height);
              M += gap + size.width;
            }
            L++;
          }
          break;
        case TreeAlignmentBottomRightBus:
          for (let z = 0; z < o; z++) {
            const ch = n[z], size = ch.subtreeSize, gap = L === 0 ? 0 : m;
            if (e) {
              ch.relativePosition.set(u / 2 + v.focus.x, C + gap);
              x = Math.max(x, size.width);
              b = Math.max(b, C + gap + size.height);
              C += gap + size.height;
            } else {
              ch.relativePosition.set(M + gap, u / 2 + v.focus.y);
              x = Math.max(x, M + gap + size.width);
              b = Math.max(b, size.height);
              M += gap + size.width;
            }
            L++;
          }
          break;
      }
      k = this._ke(2); P = this._ke(2);
      if (e) {
        k[0].set(0, 0); k[1].set(0, b);
        P[0].set(x, 0); P[1].set(x, b);
      } else {
        k[0].set(0, 0); k[1].set(x, 0);
        P[0].set(0, b); P[1].set(x, b);
      }
    } else {
      for (let z = 0; z < o; z++) {
        const H = n[z], size = H.subtreeSize;
        if (e) {
          if (c > 0 && L > 0 && M + u + size.width > c) {
            if (M < s) this._shiftRelPosAlign(v, r, s - M, 0, D, z - 1);
            T++; L = 0; D = z; S = b; M = 0;
            C = i > 135 ? -b - m : b + m;
          }
          this._recordMidPoints(H, 0, C);
          let j = 0;
          if (L === 0) {
            k = H.mm; P = H.pm; A = size.width; N = size.height;
            if (k === null || P === null || i !== this.orthoAngle(H)) {
              k = this._ke(2); P = this._ke(2);
              k[0].set(0, 0); k[1].set(0, N);
              P[0].set(A, 0); P[1].set(A, N);
            }
          } else {
            const tmp: (Point[] | null)[] = [null, null];
            const rect = new Rect(0, 0, 0, 0);
            this._mergeFringes(v, H, k, P, A, N, tmp, rect);
            j = rect.x; k = tmp[0]; P = tmp[1]; A = rect.width; N = rect.height;
            if (M < size.width && j < 0) {
              this._shiftRelPos(v, -j, 0, D, z - 1);
              this._shiftPoints(k, -j, 0);
              this._shiftPoints(P, -j, 0);
              j = 0;
            }
          }
          H.relativePosition.set(j, C);
          x = Math.max(x, A);
          b = Math.max(b, S + (T === 0 ? 0 : m) + size.height);
          M = A;
        } else {
          if (c > 0 && L > 0 && C + u + size.height > c) {
            if (C < s) this._shiftRelPosAlign(v, r, 0, s - C, D, z - 1);
            T++; L = 0; D = z; S = x; C = 0;
            M = i > 135 ? -x - m : x + m;
          }
          this._recordMidPoints(H, M, 0);
          let j = 0;
          if (L === 0) {
            k = H.mm; P = H.pm; A = size.width; N = size.height;
            if (k === null || P === null || i !== this.orthoAngle(H)) {
              k = this._ke(2); P = this._ke(2);
              k[0].set(0, 0); k[1].set(A, 0);
              P[0].set(0, N); P[1].set(A, N);
            }
          } else {
            const tmp: (Point[] | null)[] = [null, null];
            const rect = new Rect(0, 0, 0, 0);
            this._mergeFringes(v, H, k, P, A, N, tmp, rect);
            j = rect.x; k = tmp[0]; P = tmp[1]; A = rect.width; N = rect.height;
            if (C < size.height && j < 0) {
              this._shiftRelPos(v, 0, -j, D, z - 1);
              this._shiftPoints(k, 0, -j);
              this._shiftPoints(P, 0, -j);
              j = 0;
            }
          }
          H.relativePosition.set(M, j);
          b = Math.max(b, N);
          x = Math.max(x, S + (T === 0 ? 0 : m) + size.width);
          C = N;
        }
        L++;
      }
    }
    if (T > 0) {
      if (e) {
        b += Math.max(0, f);
        if (M < x) this._shiftRelPosAlign(v, r, x - M, 0, D, o - 1);
        if (g > 0) {
          if (!h) this._shiftRelPos(v, g, 0, 0, o - 1);
          x += g;
        }
      } else {
        x += Math.max(0, f);
        if (C < b) this._shiftRelPosAlign(v, r, 0, b - C, D, o - 1);
        if (g > 0) {
          if (!h) this._shiftRelPos(v, 0, g, 0, o - 1);
          b += g;
        }
      }
    }
    let I = 0, O = 0;
    switch (r) {
      case TreeAlignmentCenterSubtrees:
        if (e) I += x / 2 - v.focus.x - d / 2;
        else O += b / 2 - v.focus.y - d / 2;
        break;
      default:
      case TreeAlignmentCenterChildren:
        if (T > 0) {
          if (e) I += x / 2 - v.focus.x - d / 2;
          else O += b / 2 - v.focus.y - d / 2;
        } else {
          const len = o;
          if (e) {
            const first = n[0].relativePosition.x + n[0].subtreeOffset.x;
            const last = n[len - 1].relativePosition.x + n[len - 1].subtreeOffset.x + n[len - 1].focus.x * 2;
            I += first + (last - first) / 2 - v.focus.x - d / 2;
          } else {
            const first = n[0].relativePosition.y + n[0].subtreeOffset.y;
            const last = n[len - 1].relativePosition.y + n[len - 1].subtreeOffset.y + n[len - 1].focus.y * 2;
            O += first + (last - first) / 2 - v.focus.y - d / 2;
          }
        }
        break;
      case TreeAlignmentStart:
        if (e) { I -= d; x += d; } else { O -= d; b += d; }
        break;
      case TreeAlignmentEnd:
        if (e) { I += x - v.width + d; x += d; } else { O += b - v.height + d; b += d; }
        break;
      case TreeAlignmentBus:
        if (e) {
          if (o > 1) I += F + u / 2 - v.focus.x;
          else I += n[0].focus.x - v.focus.x + n[0].subtreeOffset.x;
        } else {
          if (o > 1) O += F + u / 2 - v.focus.y;
          else O += n[0].focus.y - v.focus.y + n[0].subtreeOffset.y;
        }
        break;
      case TreeAlignmentTopLeftBus:
        if (e) I += x + u / 2 - v.focus.x;
        else O += b + u / 2 - v.focus.y;
        break;
      case TreeAlignmentBottomRightBus:
        break;
      case TreeAlignmentCustom: {
        const z = this.customAlignment(v, I, O, x, b);
        I = z[0]; O = z[1]; x = z[2]; b = z[3];
        break;
      }
    }
    for (let z = 0; z < o; z++) {
      const H = n[z];
      if (e) {
        H.relativePosition.set(
          H.relativePosition.x + H.subtreeOffset.x - I,
          H.relativePosition.y + (i > 135
            ? (a ? -b : -H.subtreeSize.height) + H.subtreeOffset.y - f
            : y + f + H.subtreeOffset.y)
        );
      } else {
        H.relativePosition.set(
          H.relativePosition.x + (i > 135
            ? (a ? -x : -H.subtreeSize.width) + H.subtreeOffset.x - f
            : p + f + H.subtreeOffset.x),
          H.relativePosition.y + H.subtreeOffset.y - O
        );
      }
    }
    let X = 0, Y = 0;
    if (a) {
      if (e) {
        x = this._calculateSubwidth(v, x, I);
        if (I < 0) I = 0;
        if (i > 135) O += b + f;
        b += y + f;
        if (r === TreeAlignmentBottomRightBus) X += u / 2 + v.focus.x;
        Y += y + f;
      } else {
        if (i > 135) I += x + f;
        x += p + f;
        b = this._calculateSubheight(v, b, O);
        if (O < 0) O = 0;
        if (r === TreeAlignmentBottomRightBus) Y += u / 2 + v.focus.y;
        X += p + f;
      }
    } else if (e) {
      if (v.comments === null) {
        if (p > x) {
          const z = this._alignOffset(r, p - x, 0);
          X = z.x; Y = z.y; x = p; I = 0;
        }
      } else {
        x = this._calculateSubwidth(v, x, I);
      }
      if (I < 0) { X -= I; I = 0; }
      if (i > 135) O += b + f;
      b = Math.max(Math.max(b, y), b + y + f);
      Y += y + f;
    } else {
      if (i > 135) I += x + f;
      x = Math.max(Math.max(x, p), x + p + f);
      if (v.comments === null) {
        if (y > b) {
          const z = this._alignOffset(r, 0, y - b);
          X = z.x; Y = z.y; b = y; O = 0;
        }
      } else {
        b = this._calculateSubheight(v, b, O);
      }
      if (O < 0) { Y -= O; O = 0; }
      X += p + f;
    }
    let B: Point[], K: Point[];
    if (T > 0) {
      B = this._ke(4); K = this._ke(4);
      if (e) {
        B[2].set(0, y + f); B[3].set(B[2].x, b);
        K[2].set(x, B[2].y); K[3].set(K[2].x, B[3].y);
      } else {
        B[2].set(p + f, 0); B[3].set(x, B[2].y);
        K[2].set(B[2].x, b); K[3].set(B[3].x, K[2].y);
      }
    } else {
      const kk = k !== null ? k : [];
      const pp = P !== null ? P : [];
      B = this._ke(kk.length + 2);
      K = this._ke(pp.length + 2);
      for (let z = 0; z < kk.length; z++) B[z + 2].set(kk[z].x + X, kk[z].y + Y);
      for (let z = 0; z < pp.length; z++) K[z + 2].set(pp[z].x + X, pp[z].y + Y);
    }
    if (e) {
      B[0].set(I, 0); B[1].set(B[0].x, y);
      if (B[2].y < B[1].y) { if (B[2].x > B[0].x) B[2].set(B[1].x, B[1].y); else B[1].set(B[2].x, B[2].y); }
      if (B[3].y < B[2].y) { if (B[3].x > B[0].x) B[3].set(B[2].x, B[2].y); else B[2].set(B[3].x, B[3].y); }
      K[0].set(I + p, 0); K[1].set(K[0].x, y);
      if (K[2].y < K[1].y) { if (K[2].x < K[0].x) K[2].set(K[1].x, K[1].y); else K[1].set(K[2].x, K[2].y); }
      if (K[3].y < K[2].y) { if (K[3].x < K[0].x) K[3].set(K[2].x, K[2].y); else K[2].set(K[3].x, K[3].y); }
      B[2].y -= f / 2; K[2].y -= f / 2;
    } else {
      B[0].set(0, O); B[1].set(p, B[0].y);
      if (B[2].x < B[1].x) { if (B[2].y > B[0].y) B[2].set(B[1].x, B[1].y); else B[1].set(B[2].x, B[2].y); }
      if (B[3].x < B[2].x) { if (B[3].y > B[0].y) B[3].set(B[2].x, B[2].y); else B[2].set(B[3].x, B[3].y); }
      K[0].set(0, O + y); K[1].set(p, K[0].y);
      if (K[2].x < K[1].x) { if (K[2].y < K[0].y) K[2].set(K[1].x, K[1].y); else K[1].set(K[2].x, K[2].y); }
      if (K[3].x < K[2].x) { if (K[3].y < K[0].y) K[3].set(K[2].x, K[2].y); else K[2].set(K[3].x, K[3].y); }
      B[2].x -= f / 2; K[2].x -= f / 2;
    }
    this._bn(k);
    this._bn(P);
    v.mm = B;
    v.pm = K;
    v.subtreeOffset.set(I, O);
    v.subtreeSize.set(x, b);
  }

  // ============ 官方 arrangeTrees / oT — 绝对坐标 ============

  arrangeTrees(): void {
    if (this._arrangement === TreeArrangementFixedRoots) {
      const it = this._roots.iterator;
      while (it.next()) {
        const v = it.value;
        if (!(v instanceof TreeVertex)) continue;
        const node: any = v.node;
        if (node === null) continue;
        const pos: Point = node.position || new Point(0, 0);
        let x = pos.x, y = pos.y;
        if (!Number.isFinite(x)) x = 0;
        if (!Number.isFinite(y)) y = 0;
        this._assignAbsolutePositions(v, x, y);
      }
    } else {
      const arr: TreeVertex[] = [];
      const it = this._roots.iterator;
      while (it.next()) {
        const v = it.value;
        if (v instanceof TreeVertex) arr.push(v);
      }
      switch (this.sorting) {
        default:
        case TreeSortingForwards:
          break;
        case TreeSortingReverse:
          arr.reverse();
          break;
        case TreeSortingAscending:
          arr.sort(this.comparer);
          break;
        case TreeSortingDescending:
          arr.sort(this.comparer);
          arr.reverse();
          break;
      }
      const origin = this.arrangementOrigin;
      let sx = origin.x, sy = origin.y;
      for (const v of arr) {
        this._assignAbsolutePositions(v, sx + v.subtreeOffset.x, sy + v.subtreeOffset.y);
        if (this._arrangement === TreeArrangementVertical) {
          sy += v.subtreeSize.height + this._arrangementSpacing.height;
        } else {
          sx += v.subtreeSize.width + this._arrangementSpacing.width;
        }
      }
    }
  }

  /** 官方 oT — 递归赋绝对坐标（官方 vertex.x/y 即 bounds.x/y） */
  private _assignAbsolutePositions(v: TreeVertex | null, x: number, y: number): void {
    if (v === null) return;
    v.x = x; v.y = y;
    v.bounds.x = x; v.bounds.y = y;
    for (const ch of v.children) {
      this._assignAbsolutePositions(ch, x + ch.relativePosition.x, y + ch.relativePosition.y);
    }
  }

  // ============ 官方 commitLayout / commitNodes / setPortSpots ============

  commitLayout(): void {
    this._setPortSpotsAll();
    this._commitNodes();
    this._commitLayerRects();
    if (this._isRouting) this._commitLinks();
  }

  private _commitNodes(): void {
    if (this._network === null) return;
    const it = this._network.vertexes.iterator;
    while (it.next()) {
      const v = it.value;
      if (v._isArtificial) continue;
      const node: any = v.node;
      if (node === null) continue;
      const b = v.bounds;
      const margin = node.margin;
      const ml = margin ? (Number.isFinite(margin.left) ? margin.left : 0) : 0;
      const mt = margin ? (Number.isFinite(margin.top) ? margin.top : 0) : 0;
      node.move(new Point(b.x + ml, b.y + mt));
    }
    const it2 = this._network.vertexes.iterator;
    while (it2.next()) this.layoutComments(it2.value as TreeVertex);
  }

  private _commitLinks(): void {
    if (this._network === null) return;
    const it = this._network.edges.iterator;
    while (it.next()) {
      const link: any = it.value.link;
      if (link !== null && link !== undefined && typeof link.computePoints === 'function') {
        link.computePoints();
      }
    }
  }

  /** 官方 QA — Uniform 层矩形 */
  private _commitLayerRects(): void {
    if (this._network === null || this._layerStyle !== TreeLayerStyleUniform) return;
    const sizes = this._layerSizes;
    const spacings: number[] = [];
    let total: Rect | null = null;
    const it = this._network.vertexes.iterator;
    while (it.next()) {
      const v = it.value as TreeVertex;
      const b = v.bounds;
      if (total === null) total = b.copy();
      else {
        const x0 = Math.min(total.x, b.x), y0 = Math.min(total.y, b.y);
        const x1 = Math.max(total.x + total.width, b.x + b.width);
        const y1 = Math.max(total.y + total.height, b.y + b.height);
        total.set(x0, y0, x1 - x0, y1 - y0);
      }
      let sp = spacings[v.level];
      const cs = this.computeLayerSpacing(v);
      sp = sp === undefined ? cs : Math.max(sp, cs);
      spacings[v.level] = sp;
    }
    if (total === null) return;
    for (let k = 0; k < spacings.length; k++) if (spacings[k] === undefined) spacings[k] = 0;
    let offset: Point;
    if (this.angle === 90 || this.angle === 270) {
      total.inflate(this.nodeSpacing / 2, this.layerSpacing);
      offset = new Point(-this.nodeSpacing / 2, -this.layerSpacing / 2);
    } else {
      total.inflate(this.layerSpacing, this.nodeSpacing / 2);
      offset = new Point(-this.layerSpacing / 2, -this.nodeSpacing / 2);
    }
    const rects: Rect[] = [];
    const r = (this.angle === 90 || this.angle === 270) ? total.width : total.height;
    let l = 0;
    if (this.angle === 180 || this.angle === 270) {
      for (let k = 0; k < sizes.length; k++) l += sizes[k] + spacings[k];
    }
    for (let k = 0; k < sizes.length; k++) {
      const a = sizes[k] + spacings[k];
      if (this.angle === 270) { l -= a; rects.push(new Rect(0, l, r, a)); }
      else if (this.angle === 90) { rects.push(new Rect(0, l, r, a)); l += a; }
      else if (this.angle === 180) { l -= a; rects.push(new Rect(l, 0, a, r)); }
      else { rects.push(new Rect(l, 0, a, r)); l += a; }
    }
    this.commitLayers(rects, offset);
  }

  /** 官方 commitLayers — 子类可覆盖 */
  protected commitLayers(_rects: Rect[], _offset: Point): void { }

  /** 官方 Vw — 遍历所有根设置端口 Spot */
  private _setPortSpotsAll(): void {
    const it = this._roots.iterator;
    while (it.next()) {
      const v = it.value;
      if (v instanceof TreeVertex) this._setPortSpotsTree(v);
    }
  }

  /** 官方 kI — 递归设置端口 Spot */
  private _setPortSpotsTree(v: TreeVertex): void {
    if (v === null) return;
    this.setPortSpots(v);
    for (const ch of v.children) this._setPortSpotsTree(ch);
  }

  /** 官方 setPortSpots */
  setPortSpots(v: TreeVertex): void {
    const al = v.alignment;
    if (this.isBusAlignment(al)) {
      this._setPortSpotsBus(v, al);
      return;
    }
    const ang = this.orthoAngle(v);
    const childFirst = this._Ms === 1;
    // 官方：Ms=1 用 destinationEdges（出边）、Ms=2 用 sourceEdges（入边）
    const edges = childFirst ? v.destinationEdges : v.sourceEdges;
    const it = edges.iterator;
    while (it.next()) {
      const link: any = it.value.link;
      if (link === null || link === undefined) continue;
      const fromSpot = childFirst ? 'fromSpot' : 'toSpot';
      const toSpot = childFirst ? 'toSpot' : 'fromSpot';
      if (v.setsPortSpot) {
        link[fromSpot] = v.portSpot.isDefault ? this._defaultPortSpot(ang) : v.portSpot;
      }
      if (v.setsChildPortSpot) {
        link[toSpot] = v.childPortSpot.isDefault ? this._defaultChildPortSpot(ang) : v.childPortSpot;
      }
    }
  }

  /** 官方 setPortSpots 中 portSpot 的默认取值 */
  private _defaultPortSpot(ang: number): Spot {
    switch (ang) {
      case 0: return Spot.Right;
      case 90: return Spot.Bottom;
      case 180: return Spot.Left;
      default: return Spot.Top;
    }
  }

  /** 官方 setPortSpots 中 childPortSpot 的默认取值 */
  private _defaultChildPortSpot(ang: number): Spot {
    switch (ang) {
      case 0: return Spot.Left;
      case 90: return Spot.Top;
      case 180: return Spot.Right;
      default: return Spot.Bottom;
    }
  }

  /** 官方 eV — setPortSpotsBus */
  private _setPortSpotsBus(v: TreeVertex, al: EnumValue): void {
    const childFirst = this._Ms === 1;
    const ang = this.orthoAngle(v);
    const n = this._defaultPortSpot(ang);
    const ch = v.children;
    const len = ch.length;
    switch (al) {
      case TreeAlignmentBus:
      case TreeAlignmentBusBranching: {
        for (let idx = 0; idx < len; idx++) {
          const child = ch[idx];
          const list = childFirst ? child.sourceEdges : child.destinationEdges;
          const edge = list.first();
          if (edge === undefined || edge === null) continue;
          const link: any = edge.link;
          if (link === null || link === undefined) continue;
          let f: Spot = (ang === 90 || ang === 270) ? Spot.Left : Spot.Top;
          if (len === 1 || (idx === len - 1 && len % 2 === 1)) {
            switch (ang) {
              case 0: f = Spot.Left; break;
              case 90: f = Spot.Top; break;
              case 180: f = Spot.Right; break;
              default: f = Spot.Bottom; break;
            }
          } else if (idx % 2 === 0) {
            f = (ang === 90 || ang === 270) ? Spot.Right : Spot.Bottom;
          }
          if (childFirst) {
            if (v.setsPortSpot) link.fromSpot = n;
            if (v.setsChildPortSpot) link.toSpot = f;
          } else {
            if (v.setsPortSpot) link.fromSpot = f;
            if (v.setsChildPortSpot) link.toSpot = n;
          }
        }
        break;
      }
      case TreeAlignmentTopLeftBus: {
        const l: Spot = (ang === 90 || ang === 270) ? Spot.Right : Spot.Bottom;
        const edges = childFirst ? v.destinationEdges : v.sourceEdges;
        const it = edges.iterator;
        while (it.next()) {
          const link: any = it.value.link;
          if (link === null || link === undefined) continue;
          if (childFirst) {
            if (v.setsPortSpot) link.fromSpot = n;
            if (v.setsChildPortSpot) link.toSpot = l;
          } else {
            if (v.setsPortSpot) link.fromSpot = l;
            if (v.setsChildPortSpot) link.toSpot = n;
          }
        }
        break;
      }
      case TreeAlignmentBottomRightBus: {
        const l: Spot = (ang === 90 || ang === 270) ? Spot.Left : Spot.Top;
        const edges = childFirst ? v.destinationEdges : v.sourceEdges;
        const it = edges.iterator;
        while (it.next()) {
          const link: any = it.value.link;
          if (link === null || link === undefined) continue;
          if (childFirst) {
            if (v.setsPortSpot) link.fromSpot = n;
            if (v.setsChildPortSpot) link.toSpot = l;
          } else {
            if (v.setsPortSpot) link.fromSpot = l;
            if (v.setsChildPortSpot) link.toSpot = n;
          }
        }
        break;
      }
    }
  }

  /** 官方 layoutComments — 摆放 Comment 节点 */
  layoutComments(v: TreeVertex): void {
    if (v.comments === null) return;
    const node: any = v.node;
    if (node === null) return;
    const nb = node.measuredBounds;
    const par = v.parent;
    const ang = v.angle;
    let pAng = 0;
    let pAl: EnumValue = TreeAlignmentCenterChildren;
    let pBus = false;
    if (par !== null) {
      pAng = par.angle;
      pAl = par.alignment;
      pBus = this.isBusAlignment(pAl);
    }
    const vert = ang === 90 || ang === 270;
    const pVert = pAng === 90 || pAng === 270;
    const leaf = v.childrenCount === 0;
    const left = this._isLeftSideBus(v);
    let u = 0;
    const list = v.comments;
    const count = list.length;
    for (let idx = 0; idx < count; idx++) {
      const comment: any = list[idx];
      const cb = comment.measuredBounds;
      if ((vert && !leaf) || (!pBus && !pVert && leaf) || (pBus && pVert && leaf)) {
        if ((pAng > 135 && !pBus) || (pVert && left)) {
          if (v.commentMargin >= 0) {
            comment.move(new Point(v.bounds.x - v.commentMargin - cb.width, v.bounds.y + u));
            this._setCommentLinkSpots(comment, Spot.Left, Spot.Right);
          } else {
            comment.move(new Point(v.bounds.x + v.focus.x * 2 - v.commentMargin, v.bounds.y + u));
            this._setCommentLinkSpots(comment, Spot.Right, Spot.Left);
          }
        } else if (v.commentMargin >= 0) {
          comment.move(new Point(v.bounds.x + v.focus.x * 2 + v.commentMargin, v.bounds.y + u));
          this._setCommentLinkSpots(comment, Spot.Right, Spot.Left);
        } else {
          comment.move(new Point(v.bounds.x + v.commentMargin - cb.width, v.bounds.y + u));
          this._setCommentLinkSpots(comment, Spot.Left, Spot.Right);
        }
        if (v.commentSpacing >= 0) u += cb.height + v.commentSpacing;
        else u += v.commentSpacing - cb.height;
      } else {
        if ((pAng > 135 && !pBus) || (!pVert && left)) {
          if (v.commentMargin >= 0) {
            comment.move(new Point(v.bounds.x + u, v.bounds.y - v.commentMargin - cb.height));
            this._setCommentLinkSpots(comment, Spot.Top, Spot.Bottom);
          } else {
            comment.move(new Point(v.bounds.x + u, v.bounds.y + v.focus.y * 2 - v.commentMargin));
            this._setCommentLinkSpots(comment, Spot.Bottom, Spot.Top);
          }
        } else if (v.commentMargin >= 0) {
          comment.move(new Point(v.bounds.x + u, v.bounds.y + v.focus.y * 2 + v.commentMargin));
          this._setCommentLinkSpots(comment, Spot.Bottom, Spot.Top);
        } else {
          comment.move(new Point(v.bounds.x + u, v.bounds.y + v.commentMargin - cb.height));
          this._setCommentLinkSpots(comment, Spot.Top, Spot.Bottom);
        }
        if (v.commentSpacing >= 0) u += cb.width + v.commentSpacing;
        else u += v.commentSpacing - cb.width;
      }
    }
    const p = u - v.commentSpacing - (vert ? nb.height : nb.width);
    const childFirst = this._Ms === 1;
    const edges = childFirst ? v.destinationEdges : v.sourceEdges;
    const it = edges.iterator;
    while (it.next()) {
      const link: any = it.value.link;
      if (link === null || link === undefined) continue;
      if ((link as any).isAvoiding) continue;
      if (childFirst) link.fromEndSegmentLength = p > 0 ? p : NaN;
      else link.toEndSegmentLength = p > 0 ? p : NaN;
    }
  }

  /** 官方 layoutComments 内联的 Comment 链接 Spot 设置 */
  private _setCommentLinkSpots(comment: any, from: Spot, to: Spot): void {
    if (!comment || typeof comment.findLinksInto !== 'function') return;
    const it = comment.findLinksInto();
    while (it.next()) {
      const link: any = it.value;
      if (link === null || link === undefined) continue;
      link.fromSpot = from;
      link.toSpot = to;
    }
  }
}
