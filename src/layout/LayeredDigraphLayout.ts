import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Spot } from '../core/Spot';
import { EnumValue } from '../core/EnumValues';
import {
  LayeredDigraphDirectionDown, LayeredDigraphDirectionUp,
  LayeredDigraphDirectionLeft, LayeredDigraphDirectionRight,
  LayeredDigraphAggressiveNone, LayeredDigraphAggressiveHorizontal,
  LayeredDigraphAggressiveVertical, LayeredDigraphAggressiveAll,
  LayeredDigraphAggressiveLess, LayeredDigraphAggressiveMore,
  LayeredDigraphPackNone, LayeredDigraphPackAll, LayeredDigraphPackExpand,
  LayeredDigraphPackStraighten, LayeredDigraphPackMedian,
  LayeredDigraphCycleRemoveDepthFirst, LayeredDigraphCycleRemoveGreedy, LayeredDigraphCycleRemoveFromLayers,
  LayeredDigraphLayeringOptimalLinkLength, LayeredDigraphLayeringLongestPathSink, LayeredDigraphLayeringLongestPathSource,
  LayeredDigraphInitDepthFirstOut, LayeredDigraphInitDepthFirstIn, LayeredDigraphInitNaive,
  LayeredDigraphAlignNone, LayeredDigraphAlignUpperLeft, LayeredDigraphAlignUpperRight,
  LayeredDigraphAlignLowerLeft, LayeredDigraphAlignLowerRight, LayeredDigraphAlignAll,
  CurveBezier
} from '../core/EnumValues';
import { Node } from '../view/Node';
import { Group } from '../view/Group';
import { Link } from '../view/Link';
import { Layout } from './Layout';
import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';
import { LayoutEdge } from './LayoutEdge';
import { Map } from '../core/Map';
import { List } from '../core/List';

/** Helper: create an array of N empty arrays (ES5-compatible replacement for Array.from) */
function createArrayOfArrays<T>(length: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < length; i++) {
    result.push([]);
  }
  return result;
}

/**
 * LayeredDigraphLayout - implements a Sugiyama-style layered digraph layout.
 * Produces a layered arrangement of nodes with minimized edge crossings.
 */
export class LayeredDigraphLayout extends Layout {
  static readonly className: string = "LayeredDigraphLayout";

  /** 官方 `LayeredDigraphLayout.constructor(init?)`：`t && Object.assign(this, t)` */
  constructor(init?: any) {
    super();
    if (init) Object.assign(this, init);
  }

  private _direction: number = LayeredDigraphDirectionRight;
  private _layerSpacing: number = 25;
  private _columnSpacing: number = 25;
  private _setsPortSpots: boolean = true;
  private _aggressiveOption: EnumValue = LayeredDigraphAggressiveLess;
  private _packOption: EnumValue = LayeredDigraphPackAll;
  private _layeringOption: string = 'OptimalLinkLength';
  private _cycleRemoveOption: string = 'depthfirst';

  private _initializeOption: EnumValue = LayeredDigraphInitDepthFirstOut;
  private _iterations: number = 4;
  private _packIterations: number = 10;
  private _alignOption: EnumValue = LayeredDigraphAlignAll;
  private _centered: boolean = true;
  private _maxLayer: number = -1;
  private _maxIndex: number = -1;
  private _minIndexLayer: number = 0;
  private _maxIndexLayer: number = 0;
  /** OptimalLinkLength 归并时缓存的顶点表 */
  private _netVertexes: LayoutVertex[] = [];

  // ============ 官方 LayeredDigraphLayout 运行时状态 ============

  /** 官方 ot：最大层号 */
  private _ot: number = -1;
  /** 官方 Wt：最大列号 */
  private _Wt: number = -1;
  /** 官方 `xn`：componentPack 的分量计数 */
  private _xn: number = 0;
  /** 官方 ci：各层顶点数 */
  private _ci: Int16Array = new Int16Array(0);
  /** 官方 Lu：层表 Lu[layer][index] = vertex */
  private _Lu: LayoutVertex[][] = [];
  /** 官方 js：顶点数最多的层号 */
  private _js: number = 0;
  /** 官方 cm：顶点数最少的层号 */
  private _cm: number = 0;
  /** 官方 zw：最大层内序号-1 */
  private _zw: number = -1;
  /** 官方 $n：层表临时数组池 */
  private _dollarN: any[] = [];
  /** 官方 um：he/ds 快照缓冲 */
  private _um: Int16Array = new Int16Array(0);
  /** 官方 pk：交叉矩阵缓冲 */
  private _pk: Int16Array = new Int16Array(0);
  /** 官方 Zn：alignOption 位（默认 AlignAll=15，控制 MB 四向打包） */
  private _alignBits: number = 15;
  /** 官方 jA：列轴总跨度（commitNodes 写入） */
  private _jA: number = 0;
  /** 官方 kr：列轴打包启用时的原点偏移 */
  private _kr: Point = new Point(0, 0);
  /** 官方 Js：各层前沿空间（commitNodes） */
  private _Js: Float32Array = new Float32Array(0);
  /** 官方 Ss：各层后沿空间（commitNodes） */
  private _Ss: Float32Array = new Float32Array(0);
  /** 官方 ks：各层推进轴起点（commitNodes） */
  private _ks: Float32Array = new Float32Array(0);
  /** 官方 Yt：各层推进轴终点（commitNodes） */
  private _Yt: Float32Array = new Float32Array(0);

  get direction(): number { return this._direction; }
  set direction(val: number) { this._direction = val; this.invalidateLayout(); }

  get layerSpacing(): number { return this._layerSpacing; }
  set layerSpacing(val: number) { this._layerSpacing = val; this.invalidateLayout(); }

  get columnSpacing(): number { return this._columnSpacing; }
  set columnSpacing(val: number) { this._columnSpacing = val; this.invalidateLayout(); }

  get setsPortSpots(): boolean { return this._setsPortSpots; }
  set setsPortSpots(val: boolean) { this._setsPortSpots = val; this.invalidateLayout(); }

  get aggressiveOption(): EnumValue { return this._aggressiveOption; }
  set aggressiveOption(val: EnumValue) { this._aggressiveOption = val; this.invalidateLayout(); }

  get packOption(): EnumValue { return this._packOption; }
  set packOption(val: EnumValue) { this._packOption = val; this.invalidateLayout(); }

  get layeringOption(): string { return this._layeringOption; }
  set layeringOption(val: string) { this._layeringOption = val; this.invalidateLayout(); }

  get cycleRemoveOption(): string { return this._cycleRemoveOption; }
  set cycleRemoveOption(val: string) { this._cycleRemoveOption = val; this.invalidateLayout(); }

  get initializeOption(): EnumValue { return this._initializeOption; }
  set initializeOption(val: EnumValue) { this._initializeOption = val; this.invalidateLayout(); }

  get iterations(): number { return this._iterations; }
  set iterations(val: number) { this._iterations = val; this.invalidateLayout(); }

  get packIterations(): number { return this._packIterations; }
  set packIterations(val: number) { this._packIterations = val; }

  get alignOption(): EnumValue { return this._alignOption; }
  set alignOption(val: EnumValue) { this._alignOption = val; this.invalidateLayout(); }

  get centered(): boolean { return this._centered; }
  set centered(val: boolean) { this._centered = val; this.invalidateLayout(); }

  get maxLayer(): number { return this._maxLayer; }
  get maxIndex(): number { return this._maxIndex; }
  get minIndexLayer(): number { return this._minIndexLayer; }
  get maxIndexLayer(): number { return this._maxIndexLayer; }

  /** 官方 protected linkMinLength(edge)：默认最小长度 1 */
  linkMinLength(edge: LayoutEdge): number {
    return 1;
  }

  /** 官方 protected linkLengthWeight(edge)：默认权重 1 */
  linkLengthWeight(edge: LayoutEdge): number {
    return 1;
  }

  /** 官方 protected linkStraightenWeight(edge)：人工节点权重更高 */
  linkStraightenWeight(edge: LayoutEdge): number {
    const i = edge.fromVertex ? edge.fromVertex.node : null;
    const e = edge.toVertex ? edge.toVertex.node : null;
    return i === null && e === null ? 8 : i === null || e === null ? 4 : 1;
  }

  /** 层与层之间推进的方向：90/270 为竖直（向下/向上），0/180 为水平（向右/向左） */
  private get _isVertical(): boolean {
    return this._direction === LayeredDigraphDirectionDown || this._direction === LayeredDigraphDirectionUp;
  }
  /** 是否与正方向相反（向上/向左） */
  private get _isReversed(): boolean {
    return this._direction === LayeredDigraphDirectionUp || this._direction === LayeredDigraphDirectionLeft;
  }

  /** 官方 protected nodeMinLayerSpace(v, topleft)：焦点前/后沿推进轴预留的空间（各 +10） */
  nodeMinLayerSpace(v: LayoutVertex, topleft: boolean): number {
    if (v.node === null) return 0;
    if (this._isVertical) {
      return topleft ? v.focus.y + 10 : v.bounds.height - v.focus.y + 10;
    }
    return topleft ? v.focus.x + 10 : v.bounds.width - v.focus.x + 10;
  }

  /** 官方 protected nodeMinColumnSpace(v, topleft)：焦点前/后沿列轴占用的列数（单位 columnSpacing） */
  nodeMinColumnSpace(v: LayoutVertex, topleft: boolean): number {
    if (v.node === null) return 0;
    const cs = this._columnSpacing;
    if (cs <= 0) return 0;
    if (this._isVertical) {
      return topleft
        ? Math.floor(v.focus.x / cs) + 1
        : Math.floor((v.bounds.width - v.focus.x) / cs) + 1;
    }
    return topleft
      ? Math.floor(v.focus.y / cs) + 1
      : Math.floor((v.bounds.height - v.focus.y) / cs) + 1;
  }

  /** 官方 LayoutVertex.node setter：算 focus = locationObject 中心 − bounds 左上 */
  private _applyVertexFocus(vertexes: LayoutVertex[]): void {
    for (const v of vertexes) {
      const n = v.node;
      if (n === null || n === undefined) continue;
      // 子类布局可能在 makeNetwork 里已按业务需要自定义 focus（如 sankey 样例的
      // SankeyLayout：`v.focusX = shape.actualBounds.x; v.focusY = v.height/2`，
      // 把层内对齐点挪到条形顶端）。官方 focus 在 node setter 里只算一次，子类随后
      // 写入的值必须保留 —— 否则这里会把它覆盖回中心，列内打包全部错位。
      if (v.isFocusUserSet) continue;
      const b = v.bounds;
      let fx = b.width / 2;
      let fy = b.height / 2;
      if (!(n instanceof Group)) {
        const lo = n.locationObject;
        if (lo !== null && lo !== undefined) {
          const p = lo.getDocumentPoint(Spot.Center);
          if (p !== null && isFinite(p.x) && isFinite(p.y)) {
            fx = p.x - b.x;
            fy = p.y - b.y;
          }
        }
      }
      v.focus = new Point(fx, fy);
    }
  }

  /** 官方 protected removeCycles()：基于网络移除环 */
  removeCycles(): void {
    const net = this.network;
    if (net === null || net.vertexes.count === 0) return;
    const vertexes: LayoutVertex[] = [];
    const edges: LayoutEdge[] = [];
    const vit = net.vertexes.iterator;
    while (vit.next()) vertexes.push(vit.value);
    const eit = net.edges.iterator;
    while (eit.next()) edges.push(eit.value);
    for (let i = 0; i < vertexes.length; i++) vertexes[i]._index = i;
    const reversedEdges = this._removeCycles(vertexes, edges).reversedEdges;
    for (const edge of reversedEdges) {
      // 官方 cB/fB/uB：`network.reverseEdge(edge); edge.rev=!0` —— 只反转一次，
      // 且必须走 network.reverseEdge（同步顶点 sourceEdges/destinationEdges 列表）。
      // 早先 _removeCycles 里先手翻一次、这里再翻一次 = 净零反转，
      // 环没断 → layering 的 memo 无限递归（customExpandCollapse 栈溢出）。
      this.network?.reverseEdge(edge);
      edge.rev = true;
    }
  }

  /** 官方 protected assignLayers()：按当前 layeringOption 为网络分配层 */
  assignLayers(): void {
    const net = this.network;
    if (net === null || net.vertexes.count === 0) return;
    const vertexes: LayoutVertex[] = [];
    const edges: LayoutEdge[] = [];
    const vit = net.vertexes.iterator;
    while (vit.next()) vertexes.push(vit.value);
    const eit = net.edges.iterator;
    while (eit.next()) edges.push(eit.value);
    for (let i = 0; i < vertexes.length; i++) vertexes[i]._index = i;
    const layers = this._assignLayers(vertexes, edges);
    let max = -1;
    for (let l = 0; l < layers.length; l++) {
      for (const v of layers[l]) (v as any).layer = l;
      if (l > max) max = l;
    }
    for (const v of vertexes) {
      if ((v as any).layer === undefined) (v as any).layer = 0;
    }
    this._maxLayer = max;
    this._ot = max;
  }

  /** 官方 protected initializeIndices()：为各层节点分配索引 */
  initializeIndices(): void {
    const net = this.network;
    if (net === null || net.vertexes.count === 0) return;
    const layerCounts: number[] = [];
    const vit = net.vertexes.iterator;
    while (vit.next()) {
      const v = vit.value;
      const l = (v as any).layer as number;
      const n = layerCounts[l] !== undefined ? layerCounts[l] : 0;
      (v as any).index = n;
      layerCounts[l] = n + 1;
    }
    let maxIndex = -1;
    let maxLayer = 0;
    let minLayer = 0;
    let minCount = Infinity;
    let maxCount = -1;
    for (let l = 0; l < layerCounts.length; l++) {
      const c = layerCounts[l] !== undefined ? layerCounts[l] : 0;
      if (c > maxCount) { maxCount = c; maxLayer = l; }
      if (c < minCount) { minCount = c; minLayer = l; }
    }
    this._maxLayer = layerCounts.length - 1;
    this._maxIndex = maxIndex;
    this._minIndexLayer = minLayer;
    this._maxIndexLayer = maxLayer;
  }

  /** 官方 countCrossings()：统计当前排列下的交叉数 */
  countCrossings(): number {
    const net = this.network;
    if (net === null || net.vertexes.count === 0) return 0;
    let crossings = 0;
    const edges: LayoutEdge[] = [];
    const eit = net.edges.iterator;
    while (eit.next()) edges.push(eit.value);
    for (let i = 0; i < edges.length; i++) {
      for (let j = i + 1; j < edges.length; j++) {
        const a = edges[i];
        const b = edges[j];
        if (!a.fromVertex || !a.toVertex || !b.fromVertex || !b.toVertex) continue;
        const aFrom = (a.fromVertex as any).layer as number;
        const aTo = (a.toVertex as any).layer as number;
        const bFrom = (b.fromVertex as any).layer as number;
        const bTo = (b.toVertex as any).layer as number;
        if (aFrom !== bFrom || aTo !== bTo) continue;
        const aFIdx = (a.fromVertex as any).index as number;
        const aTIdx = (a.toVertex as any).index as number;
        const bFIdx = (b.fromVertex as any).index as number;
        const bTIdx = (b.toVertex as any).index as number;
        if ((aFIdx < bFIdx && aTIdx > bTIdx) || (aFIdx > bFIdx && aTIdx < bTIdx)) crossings++;
      }
    }
    return crossings;
  }

  /** 官方 protected reduceCrossings()：减少同层节点间的连线交叉 */
  reduceCrossings(): void {
    // 新版 doLayout 走内部 _reduceCrossingsOfficial；此公开入口保留为空以免误用旧路径。
  }

  /** 官方 protected straightenAndPack()：调整列位置以拉直连线并紧凑排列 */
  straightenAndPack(): void {
    // 新版 doLayout 走内部 _straightenAndPack；此公开入口保留为空以免误用旧路径。
  }

  /** 官方 protected commitLayers(layerRects, offset)：默认不做任何事 */
  commitLayers(layerRects: unknown[], offset: Point): void {
    // 官方默认实现为空
  }

  /** 官方 protected commitNodes()：按顶点位置移动各节点 */
  commitNodes(): void {
    const net = this.network;
    if (net === null) return;
    const vit = net.vertexes.iterator;
    while (vit.next()) {
      const v = vit.value;
      if (v.node && !v._isArtificial) {
        v.node.move(new Point(v.x, v.y));
      }
    }
  }

  /** 官方 protected commitLinks()：更新各连线路由 */
  commitLinks(): void {
    const net = this.network;
    if (net === null) return;
    const eit = net.edges.iterator;
    while (eit.next()) {
      const link = eit.value.link;
      if (link !== null) link.updateRoute();
    }
  }

  copy(): LayeredDigraphLayout {
    const copy = new (this.constructor as new () => any)();
    this.cloneProtected(copy);
    copy._direction = this._direction;
    copy._layerSpacing = this._layerSpacing;
    copy._columnSpacing = this._columnSpacing;
    copy._setsPortSpots = this._setsPortSpots;
    copy._aggressiveOption = this._aggressiveOption;
    copy._packOption = this._packOption;
    copy._layeringOption = this._layeringOption;
    copy._cycleRemoveOption = this._cycleRemoveOption;
    copy._initializeOption = this._initializeOption;
    copy._iterations = this._iterations;
    copy._packIterations = this._packIterations;
    copy._alignOption = this._alignOption;
    copy._centered = this._centered;
    return copy;
  }

  doLayout(coll: any): void {
    const parts = this.collectParts(coll);
    if (parts.count === 0) return;

    // Build network
    const net = this.makeNetwork(coll);
    this.network = net;
    if (net.vertexes.count === 0) {
      this.network = null;
      return;
    }
    net.deleteSelfEdges();

    const vertexes: LayoutVertex[] = [];
    const vit = net.vertexes.iterator;
    while (vit.next()) vertexes.push(vit.value);

    const edges: LayoutEdge[] = [];
    const eit = net.edges.iterator;
    while (eit.next()) edges.push(eit.value);

    // 官方在 LayoutVertex 的 node setter 里就定好 focus：
    //   非 Group → locationObject.getDocumentPoint(Spot.Center) − bounds.topLeft
    //   否则/取不到 → bounds 中心
    this._applyVertexFocus(vertexes);
    for (const v of vertexes) {
      const n: any = v.node;
      v.centered = n ? n.centered !== false : true;
      v.data = n && n.data !== undefined ? n.data : null;
      v._index = -1;
    }

    // 官方 doLayout()：nB → deleteSelfEdges → removeCycles → oB(层) → rB(端口+人工点)
    //   → lB(索引) → hB(列) → reduceCrossings → straightenAndPack(MB 打包)
    //   → commitLayout：Vw → commitNodes → QA → commitLinks
    this._nB();
    if (this._cycleRemoveOption !== 'fromlayers') this.removeCycles();

    // oB：分配层号（官方统一汇=0 的 sink 基层号），并算 ot
    this.assignLayers();

    // rB：网络细化 —— 计算端口位置，把跨层>1的长边拆成人工顶点链
    this._refineNetwork();

    // lB：索引初始化（near 对齐 + 端口偏移排序）+ 层表 Lu
    this._initLayerIndexes();

    // hB：列初始化（层内按 nodeMinColumnSpace 排开）
    this._initColumns();

    // 交叉约简（官方 kk/Ps/JR）
    this._reduceCrossingsOfficial();

    // 拉直+打包（alignOption!==0 时走 MB 四向打包，Se 写回列轴位置）
    this._straightenAndPack();

    // commitLayout
    this._commitSetPortSpots();
    this._commitNodesOfficial();

    // 官方 commitLinks：沿人工顶点链生成多点折线路由
    if (this._isRouting) this._commitLinksOfficial();

    this.network = null;
    this.isValidLayout = true;
  }

  /**
   * 官方 `LayeredDigraphLayout.setPortSpots` 等价逻辑（`Sk(isFrom)`）：
   * 依据 direction 决定连线两端的端口点，非反向时为 MiddleRight/MiddleLeft。
   */
  private _portSpotFor(isFrom: boolean): Spot {
    const d = this._direction;
    if (d === LayeredDigraphDirectionUp) return isFrom ? Spot.MiddleTop : Spot.MiddleBottom;
    if (d === LayeredDigraphDirectionDown) return isFrom ? Spot.MiddleBottom : Spot.MiddleTop;
    if (d === LayeredDigraphDirectionLeft) return isFrom ? Spot.MiddleLeft : Spot.MiddleRight;
    return isFrom ? Spot.MiddleRight : Spot.MiddleLeft;
  }

  /**
   * Remove cycles by reversing back edges in a DFS traversal.
   */
  private _removeCycles(vertexes: LayoutVertex[], edges: LayoutEdge[]): { reversedEdges: LayoutEdge[] } {
    const reversedEdges: LayoutEdge[] = [];
    const visited = new Uint8Array(vertexes.length); // 0=white, 1=gray, 2=black
    const adjList: number[][] = createArrayOfArrays<number>(vertexes.length);

    for (const edge of edges) {
      if (edge.fromVertex && edge.toVertex) {
        adjList[edge.fromVertex._index].push(edges.indexOf(edge));
      }
    }

    const dfs = (vIdx: number): void => {
      visited[vIdx] = 1; // gray (in progress)
      for (const edgeIdx of adjList[vIdx]) {
        const edge = edges[edgeIdx];
        if (!edge.toVertex) continue;
        const toIdx = edge.toVertex._index;
        if (visited[toIdx] === 1) {
          // Back edge —— 只收集，反转交给外层 removeCycles() 统一做一次
          // （network.reverseEdge + rev 标记），这里翻会和外层形成双重反转。
          reversedEdges.push(edge);
        } else if (visited[toIdx] === 0) {
          dfs(toIdx);
        }
      }
      visited[vIdx] = 2; // black (done)
    };

    for (let i = 0; i < vertexes.length; i++) {
      if (visited[i] === 0) {
        dfs(i);
      }
    }

    return { reversedEdges };
  }

  /**
   * Assign layers to vertexes using longest path from source.
   */
  private _assignLayers(vertexes: LayoutVertex[], edges: LayoutEdge[]): LayoutVertex[][] {
    const opt = String(this._layeringOption);
    if (opt === 'OptimalLinkLength') {
      this._networkMinimizeLinkLength(vertexes, edges);
    } else if (opt === 'LongestPathSink') {
      this._networkMaxSrcLayerSpan(vertexes, edges);
    } else {
      // LongestPathSource（含默认回退）：源端=0 的最长路径
      this._networkMaxDestLayerSpan(vertexes, edges);
    }
    // 规整：令最小层为 0，并按层号分桶
    let min = Infinity;
    for (const v of vertexes) if (v.layer < min) min = v.layer;
    for (const v of vertexes) v.layer -= min;
    let maxLayer = 0;
    for (const v of vertexes) if (v.layer > maxLayer) maxLayer = v.layer;
    const layers: LayoutVertex[][] = createArrayOfArrays<LayoutVertex>(maxLayer + 1);
    for (const v of vertexes) layers[v.layer].push(v);
    return layers;
  }

  /** 官方 `jv/Wv`：LongestPathSink。layer(v) = max over 出边 (layer(to) + linkMinLength) */
  private _networkMaxSrcLayerSpan(vertexes: LayoutVertex[], edges: LayoutEdge[]): void {
    const layer = new Int32Array(vertexes.length).fill(-1);
    const memo = (v: LayoutVertex): number => {
      if (v.layer >= 0) return v.layer;
      let e = 0;
      const it = v.destinationEdges.iterator;
      while (it.next()) {
        const s = it.value;
        if (!s.toVertex) continue;
        e = Math.max(e, memo(s.toVertex) + this.linkMinLength(s));
      }
      v.layer = e;
      return e;
    };
    for (const v of vertexes) { v.layer = -1; }
    for (const v of vertexes) memo(v);
  }

  /** 官方 `cU/Jv`：LongestPathSource。layer(v) = max over 入边 (layer(from) + linkMinLength)（源=0） */
  private _networkMaxDestLayerSpan(vertexes: LayoutVertex[], edges: LayoutEdge[]): void {
    const memo = (v: LayoutVertex): number => {
      if (v.layer >= 0) return v.layer;
      let e = 0;
      const it = v.sourceEdges.iterator;
      while (it.next()) {
        const s = it.value;
        if (!s.fromVertex) continue;
        e = Math.max(e, memo(s.fromVertex) + this.linkMinLength(s));
      }
      v.layer = e;
      return e;
    };
    for (const v of vertexes) v.layer = -1;
    for (const v of vertexes) memo(v);
    // 官方 mB（LongestPathSource=12）：iI 算出源=0 后立即取补，
    // 官方流水线统一使用汇=0 的 sink 基层号（commitNodes 再做推进轴镜像）。
    let mx = 0;
    for (const v of vertexes) if (v.layer > mx) mx = v.layer;
    for (const v of vertexes) v.layer = mx - v.layer;
  }

  /** 官方 `fU/$v/uU/dU/Ew`：OptimalLinkLength。先 LongestPathSink，再从源做组归并/双向收缩 */
  private _networkMinimizeLinkLength(vertexes: LayoutVertex[], edges: LayoutEdge[]): void {
    this._netVertexes = vertexes;
    this._networkMaxSrcLayerSpan(vertexes, edges);
    for (const v of vertexes) v.oi = false;
    for (const v of vertexes) {
      if (v.sourceEdges.count === 0) this._nlvVisited(v);
    }
    // 官方 pB 到此结束：全程 sink 基（汇=0，源=最大层），不再取补。
  }

  /** 官方 `$v(t)`：DFS 到所有汇，逐个做 uU(t)/dU(t) 归并 */
  private _nlvVisited(t: LayoutVertex): void {
    if (t.oi) return;
    t.oi = true;
    const it = t.destinationEdges.iterator;
    while (it.next()) {
      const to = it.value.toVertex;
      if (to) this._nlvVisited(to);
    }
    this._nlvMoveUp(t);
    this._nlvMoveDown(t);
  }

  /** 官方 `uU(t)`：把 t 的「紧边连通分量」整体上移（减 layer），使所有边达到最小长度 */
  private _nlvMoveUp(t: LayoutVertex): void {
    const vertexes = this._netVertexes;
    for (const v of vertexes) v.component = -1;
    const i = 0, s = 1;
    const src = t.sourceEdges.iterator;
    while (src.next()) {
      const l = src.value;
      const a = l.fromVertex, h = l.toVertex;
      if (!a || !h) continue;
      const c = this.linkMinLength(l);
      if (a.layer - h.layer > c) this._nlvEw(a, i, -1, true, false);
    }
    this._nlvEw(t, s, -1, true, true);
    while (t.component !== i) {
      let r = 0, l = Infinity, a = 0, h: LayoutVertex | null = null;
      for (const f of vertexes) {
        if (f.component !== s) continue;
        let u = 0, d = false;
        const m = f.sourceEdges.iterator;
        while (m.next()) {
          const y = m.value;
          const x = y.fromVertex;
          if (!x) continue;
          u += this.linkLengthWeight(y);
          if (x.component !== s) {
            r += this.linkLengthWeight(y);
            const b = x.layer - f.layer, k = this.linkMinLength(y);
            if (b - k < l) l = b - k;
          }
        }
        const g = f.destinationEdges.iterator;
        while (g.next()) {
          const y = g.value;
          const x = y.toVertex;
          if (!x) continue;
          u -= this.linkLengthWeight(y);
          if (x.component !== s) r -= this.linkLengthWeight(y);
          else d = true;
        }
        if ((h === null || u < a) && !d) { h = f; a = u; }
      }
      if (r > 0) {
        for (const f of vertexes) if (f.component === s) f.layer += l;
        t.component = i;
      } else if (h !== null) {
        h.component = i;
      } else {
        break;
      }
    }
  }

  /** 官方 `dU(t)`：把 t 的紧边分量整体下移（加 layer） */
  private _nlvMoveDown(t: LayoutVertex): void {
    const vertexes = this._netVertexes;
    for (const v of vertexes) v.component = -1;
    const i = 0, s = 1;
    this._nlvEw(t, s, -1, true, false);
    while (t.component !== i) {
      let n = 0, o = Infinity, r = 0, l: LayoutVertex | null = null;
      for (const h of vertexes) {
        if (h.component !== s) continue;
        let c = 0, f = false;
        const u = h.sourceEdges.iterator;
        while (u.next()) {
          const p = u.value;
          const y = p.fromVertex;
          if (!y) continue;
          c += this.linkLengthWeight(p);
          if (y.component !== s) n += this.linkLengthWeight(p);
          else f = true;
        }
        const m = h.destinationEdges.iterator;
        while (m.next()) {
          const p = m.value;
          const y = p.toVertex;
          if (!y) continue;
          c -= this.linkLengthWeight(p);
          if (y.component !== s) {
            n -= this.linkLengthWeight(p);
            const x = h.layer - y.layer, b = this.linkMinLength(p);
            if (x - b < o) o = x - b;
          }
        }
        if ((l === null || c > r) && !f) { l = h; r = c; }
      }
      if (n < 0) {
        for (const h of vertexes) if (h.component === s) h.layer -= o;
        t.component = i;
      } else if (l !== null) {
        l.component = i;
      } else {
        break;
      }
    }
  }

  /** 官方 `Ew(t,e,i,s,n)`：从 t 沿「紧边」（层差==最小长度）传播，把可达点并入分量 e */
  private _nlvEw(t: LayoutVertex, e: number, i: number, s: boolean, n: boolean): void {
    if (t.component !== i) return;
    t.component = e;
    if (s) {
      const it = t.destinationEdges.iterator;
      while (it.next()) {
        const a = it.value;
        const h = a.toVertex;
        if (!h) continue;
        const o = t.layer - h.layer, r = this.linkMinLength(a);
        if (o === r) this._nlvEw(h, e, i, s, n);
      }
    }
    if (n) {
      const it = t.sourceEdges.iterator;
      while (it.next()) {
        const a = it.value;
        const h = a.fromVertex;
        if (!h) continue;
        const o = h.layer - t.layer, r = this.linkMinLength(a);
        if (o === r) this._nlvEw(h, e, i, s, n);
      }
    }
  }

  /** 官方 `nB()`：布局运行时状态复位（lu/zw/cm/js 等） */
  private _nB(): void {
    this._zw = -1;
    this._cm = 0;
    this._js = 0;
    this._Lu = [];
    this._ci = new Int16Array(0);
    for (let i = 0; i < this._dollarN.length; i++) this._dollarN[i] = null;
  }

  /** 官方 `initializeIndices()`：按 Nu 选索引初始化器（20=DFO→kB，21=DFI→PB，22/默认→SB） */
  private _initializeIndices(): void {
    const opt = this._initializeOption;
    if (opt === LayeredDigraphInitDepthFirstOut) { this._kB(); return; }
    if (opt === LayeredDigraphInitDepthFirstIn) { this._PB(); return; }
    this._SB();
  }

  /** 官方 `SB()`：naive 索引初始化 —— 按近邻分组后顺序赋 index */
  private _SB(): void {
    const net = this.network!;
    let t: Map<LayoutVertex, LayoutVertex[]> | null = null;
    const i = net.vertexes.iterator;
    while (i.next()) {
      const e = i.value;
      if (e.near && (t === null && (t = new Map()), e.layer === e.near.layer)) {
        const s = t.get(e.near) || [];
        s.push(e);
        t.set(e.near, s);
      }
    }
    for (i.reset(); i.next(); ) {
      const e = i.value;
      if (e.near) continue;
      const s = e.layer;
      e.index = this._ci[s];
      this._ci[s]++;
      if (!t) continue;
      const n = t.get(e);
      if (Array.isArray(n)) n.forEach(o => { o.index = this._ci[s]; this._ci[s]++; });
    }
  }

  /** 官方 `kB()`：DepthFirstOut 索引初始化 —— 从高层向低层递归 */
  private _kB(): void {
    const net = this.network!;
    let t: Map<LayoutVertex, LayoutVertex[]> | null = null;
    const i = net.vertexes.iterator;
    while (i.next()) {
      const e = i.value;
      if (e.near && (t === null && (t = new Map()), e.layer === e.near.layer)) {
        const s = t.get(e.near) || [];
        s.push(e);
        t.set(e.near, s);
      }
    }
    for (let e = this._ot; e >= 0; e--)
      for (i.reset(); i.next(); ) {
        const s = i.value;
        if (s.layer === e && s.index === -1) this._oI(s, t);
      }
  }

  /** 官方 `oI(t,i)`：DFS 出边（按 portFromColOffset 排序）赋 index */
  private _oI(t: LayoutVertex, i: Map<LayoutVertex, LayoutVertex[]> | null): void {
    if (t.near) return;
    const e = t.layer;
    t.index = this._ci[e];
    this._ci[e]++;
    if (i) {
      const o = i.get(t);
      if (Array.isArray(o)) o.forEach(r => { r.index = this._ci[e]; this._ci[e]++; });
    }
    const s = t.destinationEdges;
    let n = true;
    while (n) {
      n = false;
      for (let o = 0; o < s.length - 1; o++) {
        const r = s.elt(o), l = s.elt(o + 1);
        if (r.portFromColOffset > l.portFromColOffset) {
          n = true;
          s.setElt(o, l);
          s.setElt(o + 1, r);
        }
      }
    }
    for (let o = 0; o < s.length; o++) {
      const r = s.elt(o);
      if (r.valid) {
        const l = r.toVertex!;
        if (l.index === -1) this._oI(l, i);
      }
    }
  }

  /** 官方 `PB()`：DepthFirstIn 索引初始化 —— 从低层向高层递归 */
  private _PB(): void {
    const net = this.network!;
    let t: Map<LayoutVertex, LayoutVertex[]> | null = null;
    const i = net.vertexes.iterator;
    while (i.next()) {
      const e = i.value;
      if (e.near && (t === null && (t = new Map()), e.layer === e.near.layer)) {
        const s = t.get(e.near) || [];
        s.push(e);
        t.set(e.near, s);
      }
    }
    for (let e = 0; e <= this._ot; e++)
      for (i.reset(); i.next(); ) {
        const s = i.value;
        if (s.layer === e && s.index === -1) this._rI(s, t);
      }
  }

  /** 官方 `rI(t,i)`：DFS 入边（按 portToColOffset 排序）赋 index */
  private _rI(t: LayoutVertex, i: Map<LayoutVertex, LayoutVertex[]> | null): void {
    if (t.near) return;
    const e = t.layer;
    t.index = this._ci[e];
    this._ci[e]++;
    if (i) {
      const h = i.get(t);
      if (Array.isArray(h)) h.forEach(a => { a.index = this._ci[e]; this._ci[e]++; });
    }
    const s = t.sourceEdges;
    let n = true;
    while (n) {
      n = false;
      for (let o = 0; o < s.length - 1; o++) {
        const h = s.elt(o), a = s.elt(o + 1);
        if (h.portToColOffset > a.portToColOffset) {
          n = true;
          s.setElt(o, a);
          s.setElt(o + 1, h);
        }
      }
    }
    for (let o = 0; o < s.length; o++) {
      const l = s.elt(o);
      if (l.valid) {
        const r = l.fromVertex!;
        if (r.index === -1) this._rI(r, i);
      }
    }
  }

  /** 官方 `lB()`：索引初始化 + 层表 Lu */
  private _initLayerIndexes(): void {
    if (this._ci.length !== this._ot + 1) this._ci = new Int16Array(this._ot + 1);
    const t = this._ci;
    for (let e = 0; e <= this._ot; e++) t[e] = 0;
    const i = this.network!.vertexes.iterator;
    for (; i.next(); ) i.value.index = -1;
    this._initializeIndices();
    this._zw = -1;
    this._cm = 0;
    this._js = 0;
    for (let e = 0; e <= this._ot; e++) {
      if (t[e] > t[this._js]) { this._zw = t[e] - 1; this._js = e; }
      if (t[e] < t[this._cm]) this._cm = e;
    }
    this._Lu = [];
    for (let e = 0; e < t.length; e++) this._Lu[e] = [];
    for (i.reset(); i.next(); ) {
      const e = i.value;
      const s = e.layer;
      const n = this._Lu[s];
      n[e.index] = e;
    }
  }

  /** 官方 `hB()`：列初始化 —— 层内按 nodeMinColumnSpace 排开，算 Wt */
  private _initColumns(): void {
    this._Wt = -1;
    for (let t = 0; t <= this._ot; t++) {
      const i = this._ha(t);
      let e = 0;
      const s = this._ci[t];
      for (let n = 0; n < s; n++) {
        const o = i[n];
        e += this.nodeMinColumnSpace(o, true);
        o.column = e;
        e += 1;
        e += this.nodeMinColumnSpace(o, false);
      }
      this._Wt = Math.max(this._Wt, e - 1);
      this._aa(t, i);
    }
  }

  /** 官方 `ha(t)`：取/建 层 t 的顶点表（按 index），带池化复用 */
  private _ha(t: number): LayoutVertex[] {
    let i: LayoutVertex[];
    const e = this._ci[t];
    if (e >= this._dollarN.length) {
      const n: LayoutVertex[] = [];
      for (let o = 0; o < this._dollarN.length; o++) n[o] = this._dollarN[o];
      this._dollarN = n;
    }
    if (this._dollarN[e] === undefined || this._dollarN[e] === null) i = [];
    else { i = this._dollarN[e]; this._dollarN[e] = null; }
    const s = this._Lu[t];
    for (let n = 0; n < s.length; n++) {
      const o = s[n];
      i[o.index] = o;
    }
    return i;
  }

  /** 官方 `aa(t,i)`：把顶点表放回池 */
  private _aa(t: number, i: LayoutVertex[]): void {
    this._dollarN[this._ci[t]] = i;
  }

  /** 官方 `Xw()`：列归一化 —— 减去最小（列-minColSpace），更新 Wt */
  private _Xw(): void {
    let t = Infinity;
    this._Wt = -1;
    const i = this.network!.vertexes.iterator;
    while (i.next()) {
      const e = i.value;
      t = Math.min(t, e.column - this.nodeMinColumnSpace(e, true));
      this._Wt = Math.max(this._Wt, e.column + this.nodeMinColumnSpace(e, false));
    }
    for (i.reset(); i.next(); ) {
      const e = i.value;
      e.column -= t;
    }
    this._Wt -= t;
  }

  /** 官方 `he()`：把全部顶点的 (column,index) 快照进 um（Int16 对） */
  private _he(): Int16Array {
    const t = this.network!.vertexes.count;
    if (this._um.length < t * 2) this._um = new Int16Array(t * 2);
    let i = 0;
    const e = this.network!.vertexes.iterator;
    for (; e.next(); ) {
      const s = e.value;
      this._um[i] = s.column;
      i++;
      this._um[i] = s.index;
      i++;
    }
    return this._um;
  }

  /** 官方 `ds(t)`：从快照恢复 column+index */
  private _ds(t: Int16Array): void {
    let i = 0;
    const e = this.network!.vertexes.iterator;
    for (; e.next(); ) {
      const s = e.value;
      s.column = t[i];
      i++;
      s.index = t[i];
      i++;
    }
  }

  /** 官方 `countCrossings()`：对每层求交叉矩阵并累加三角和 */
  private _countCrossings(): number {
    let t = 0;
    for (let i = 0; i <= this._ot; i++) {
      const e = this._crossingMatrix(i, 1);
      const s = this._ci[i];
      for (let n = 0; n < s; n++) for (let o = n; o < s; o++) t += e[n * s + o];
    }
    return t;
  }

  /** 官方 `Yw(t,i)`：各顶点的邻域重心（i<=0 用入边，i>=0 用出边） */
  private _barycenters(t: number, i: number): Float32Array {
    const e = this._ha(t);
    const s = this._ci[t];
    const n = new Float32Array(s);
    for (let o = 0; o < s; o++) {
      const r = e[o];
      let l: List<LayoutEdge> | null = null;
      if (i <= 0) l = r.sourceEdges;
      let h: List<LayoutEdge> | null = null;
      if (i >= 0) h = r.destinationEdges;
      let a = 0, c = 0;
      const f = r.near;
      if (f !== null && f.layer === r.layer) { a += f.column - 1; c++; }
      if (l !== null) for (let d = 0; d < l.length; d++) {
        const u = l.elt(d);
        const m = u.fromVertex!;
        if (u.valid && !u.rev && m.layer !== t) { a += m.column; c++; }
      }
      if (h !== null) for (let d = 0; d < h.length; d++) {
        const u = h.elt(d);
        const m = u.toVertex!;
        if (u.valid && !u.rev && m.layer !== t) { a += m.column; c++; }
      }
      n[o] = c === 0 ? -1 : a / c;
    }
    this._aa(t, e);
    return n;
  }

  /** 官方 `$R(t,i)`：各顶点的邻域中位数（带端口偏移） */
  private _medians(t: number, i: number): Int16Array {
    const e = this._ha(t);
    const s = this._ci[t];
    const n = new Int16Array(s);
    for (let o = 0; o < s; o++) {
      const r = e[o];
      let l: List<LayoutEdge> | null = null;
      if (i <= 0) l = r.sourceEdges;
      let h: List<LayoutEdge> | null = null;
      if (i >= 0) h = r.destinationEdges;
      let a = 0;
      const c: number[] = [];
      const f = r.near;
      if (f !== null && f.layer === r.layer) { c[a] = f.column - 1; a++; }
      if (l !== null) for (let d = 0; d < l.length; d++) {
        const u = l.elt(d);
        const m = u.fromVertex!;
        if (u.valid && !u.rev && m.layer !== t) { c[a] = m.column + u.portFromColOffset; a++; }
      }
      if (h !== null) for (let d = 0; d < h.length; d++) {
        const u = h.elt(d);
        const m = u.toVertex!;
        if (u.valid && !u.rev && m.layer !== t) { c[a] = m.column + u.portToColOffset; a++; }
      }
      if (a === 0) n[o] = -1;
      else {
        c.sort((m, g) => m - g);
        const d = a >> 1;
        n[o] = (a & 1) !== 0 ? c[d] : (c[d - 1] + c[d]) >> 1;
      }
    }
    this._aa(t, e);
    return n;
  }

  /** 官方 `JR(t,i)`：交叉矩阵（i>=0 用出边、i<=0 用入边；i=1 只算出边） */
  private _crossingMatrix(t: number, i: number): Int16Array {
    const e = this._ha(t);
    const s = this._ci[t];
    if (this._pk.length < s * s) this._pk = new Int16Array(s * s);
    const n = this._pk;
    for (let o = 0; o < s; o++) {
      let r = 0;
      const l = e[o];
      const h = l.near;
      if (h !== null && h !== l && h.layer === l.layer) r += Math.max(0, Math.abs(h.index - l.index) - 1);
      let c: List<LayoutEdge>;
      let f = 0, u: LayoutEdge, d = 0, m = 0, g = 0, p: LayoutEdge, y = 0, x: LayoutEdge, b = 0, S = 0, k = 0;
      if (i >= 0) {
        c = l.sourceEdges;
        for (f = 0; f < c.length; f++) {
          u = c.elt(f);
          if (u.valid && u.fromVertex!.layer !== t) {
            d = u.fromVertex!.index;
            m = u.portToPos;
            g = u.portFromPos;
            for (y = f + 1; y < c.length; y++) {
              x = c.elt(y);
              if (x.valid && x.fromVertex!.layer !== t) {
                b = x.fromVertex!.index;
                S = x.portToPos;
                k = x.portFromPos;
                if (m < S && (d > b || (d === b && g > k))) r++;
                if (S < m && (b > d || (b === d && k > g))) r++;
              }
            }
          }
        }
      }
      if (i <= 0) {
        c = l.destinationEdges;
        for (f = 0; f < c.length; f++) {
          u = c.elt(f);
          if (u.valid && u.toVertex!.layer !== t) {
            d = u.toVertex!.index;
            m = u.portToPos;
            g = u.portFromPos;
            for (y = f + 1; y < c.length; y++) {
              x = c.elt(y);
              if (x.valid && x.toVertex!.layer !== t) {
                b = x.toVertex!.index;
                S = x.portToPos;
                k = x.portFromPos;
                if (g < k && (d > b || (d === b && m > S))) r++;
                if (k < g && (b > d || (b === d && S > m))) r++;
              }
            }
          }
        }
      }
      n[o * s + o] = r;
      for (let a = o + 1; a < s; a++) {
        let A = 0, N = 0;
        if (i >= 0) {
          const p1 = e[o].sourceEdges, P = e[a].sourceEdges;
          for (f = 0; f < p1.length; f++) {
            u = p1.elt(f);
            if (u.valid && u.fromVertex!.layer !== t) {
              d = u.fromVertex!.index;
              m = u.portToPos;
              g = u.portFromPos;
              for (y = 0; y < P.length; y++) {
                x = P.elt(y);
                if (x.valid && x.fromVertex!.layer !== t) {
                  b = x.fromVertex!.index;
                  S = x.portToPos;
                  k = x.portFromPos;
                  if (d < b || (d === b && g < k)) N++;
                  if (b < d || (b === d && k < g)) A++;
                }
              }
            }
          }
        }
        if (i <= 0) {
          const p1 = e[o].destinationEdges, P = e[a].destinationEdges;
          for (f = 0; f < p1.length; f++) {
            u = p1.elt(f);
            if (u.valid && u.toVertex!.layer !== t) {
              d = u.toVertex!.index;
              m = u.portToPos;
              g = u.portFromPos;
              for (y = 0; y < P.length; y++) {
                x = P.elt(y);
                if (x.valid && x.toVertex!.layer !== t) {
                  b = x.toVertex!.index;
                  S = x.portToPos;
                  k = x.portFromPos;
                  if (d < b || (d === b && m < S)) N++;
                  if (b < d || (b === d && S < m)) A++;
                }
              }
            }
          }
        }
        n[o * s + a] = A;
        n[a * s + o] = N;
      }
    }
    this._aa(t, e);
    return n;
  }

  /** 官方 `kk(t,i)`：中位数-重心交叉约简 —— 按 (median,barycenter) 排一层 */
  private _medianBarycenter(t: number, i: number): boolean {
    let e = 0, s = false;
    const n = this._ha(t);
    const o = this._ci[t];
    const r = this._medians(t, i);
    const l = this._barycenters(t, i);
    for (e = 0; e < o; e++) {
      if (l[e] === -1) l[e] = n[e].column;
      if (r[e] === -1) r[e] = n[e].column;
    }
    let h = true;
    let a: LayoutVertex;
    for (; h;) {
      h = false;
      for (e = 0; e < o - 1; e++) {
        if (r[e + 1] < r[e] || (r[e + 1] === r[e] && l[e + 1] < l[e])) {
          s = true;
          h = true;
          const f = r[e]; r[e] = r[e + 1]; r[e + 1] = f;
          const u = l[e]; l[e] = l[e + 1]; l[e + 1] = u;
          a = n[e]; n[e] = n[e + 1]; n[e + 1] = a;
        }
      }
    }
    let c = 0;
    for (e = 0; e < o; e++) {
      a = n[e];
      a.index = e;
      c += this.nodeMinColumnSpace(a, true);
      a.column = c;
      c += 1;
      c += this.nodeMinColumnSpace(a, false);
    }
    this._aa(t, n);
    return s;
  }

  /** 官方 `Ps(t,i,e,s)`：贪心相邻交换交叉约简（评估交叉/拉直/中位/重心代价） */
  private _crossingReduction(t: number, i: number, e: boolean, s: number): boolean {
    const n = this._ha(t);
    const o = this._ci[t];
    const r = this._crossingMatrix(t, i);
    let l = 0, h: number;
    let mm: Float32Array;
    if (!e || s > 0) { mm = new Float32Array(o); for (l = 0; l < o; l++) mm[l] = -1; }
    else mm = this._barycenters(t, -1);
    let a: Float32Array;
    if (!e || s < 0) { a = new Float32Array(o); for (l = 0; l < o; l++) a[l] = -1; }
    else a = this._barycenters(t, 1);
    let c = false, f = true;
    for (; f;) {
      f = false;
      for (l = 0; l < o - 1; l++) {
        const u = r[n[l].index * o + n[l + 1].index];
        const d = r[n[l + 1].index * o + n[l].index];
        let m = 0, g = 0;
        const p = n[l].column, y = n[l + 1].column;
        const x = this.nodeMinColumnSpace(n[l], true), b = this.nodeMinColumnSpace(n[l], false);
        const S = this.nodeMinColumnSpace(n[l + 1], true), k = this.nodeMinColumnSpace(n[l + 1], false);
        const P = p - x + S, A = y - b + k;
        let N = 0, M = 0, C = 0, T = 0, L = 0, D = 0, F = 0, R: LayoutEdge, I = 0, O: LayoutEdge, X = 0;
        const Y = n[l].sourceEdges.iterator;
        if (e && s <= 0) for (; Y.next();) {
          R = Y.value;
          const Rv = R.fromVertex!;
          if (R.valid && Rv.layer !== t) {
            C = this.linkStraightenWeight(R);
            T = R.portFromColOffset;
            L = R.portToColOffset;
            D = Rv.column;
            N += (Math.abs(p + L - (D + T)) + 1) * C;
            M += (Math.abs(A + L - (D + T)) + 1) * C;
          }
        }
        for (Y.reset(); Y.next();) {
          R = Y.value;
          const Rv = R.fromVertex!;
          if (R.valid && Rv.layer === t) {
            for (I = 0; I < n.length && n[I] !== Rv;) I++;
            if (I < l) { m += 2 * (l - I); g += 2 * (l + 1 - I); }
            else if (I === l + 1) { m += 1; }
            else if (I > l + 1) { m += 4 * (I - l); g += 4 * (I - (l + 1)); }
          }
        }
        const B = n[l].destinationEdges.iterator;
        if (e && s >= 0) for (; B.next();) {
          O = B.value;
          const Ov = O.toVertex!;
          if (O.valid && Ov.layer !== t) {
            C = this.linkStraightenWeight(O);
            T = O.portFromColOffset;
            L = O.portToColOffset;
            F = Ov.column;
            N += (Math.abs(p + T - (F + L)) + 1) * C;
            M += (Math.abs(A + T - (F + L)) + 1) * C;
          }
        }
        for (B.reset(); B.next();) {
          O = B.value;
          const Ov = O.toVertex!;
          if (O.valid && Ov.layer === t) {
            for (X = 0; X < n.length && n[X] !== Ov;) X++;
            if (X === l + 1) g += 1;
          }
        }
        const K = n[l + 1].sourceEdges.iterator;
        if (e && s <= 0) for (; K.next();) {
          R = K.value;
          const Rv = R.fromVertex!;
          if (R.valid && Rv.layer !== t) {
            C = this.linkStraightenWeight(R);
            T = R.portFromColOffset;
            L = R.portToColOffset;
            D = Rv.column;
            N += (Math.abs(y + L - (D + T)) + 1) * C;
            M += (Math.abs(P + L - (D + T)) + 1) * C;
          }
        }
        for (K.reset(); K.next();) {
          R = K.value;
          const Rv = R.fromVertex!;
          if (R.valid && Rv.layer === t) {
            for (I = 0; I < n.length && n[I] !== Rv;) I++;
            if (I < l) { m += 2 * (l + 1 - I); g += 2 * (l - I); }
            else if (I === l) { g += 1; }
            else if (I > l + 1) { m += 4 * (I - (l + 1)); g += 4 * (I - l); }
          }
        }
        const z = n[l + 1].destinationEdges.iterator;
        if (e && s >= 0) for (; z.next();) {
          O = z.value;
          const Ov = O.toVertex!;
          if (O.valid && Ov.layer !== t) {
            C = this.linkStraightenWeight(O);
            T = O.portFromColOffset;
            L = O.portToColOffset;
            F = Ov.column;
            N += (Math.abs(y + T - (F + L)) + 1) * C;
            M += (Math.abs(P + T - (F + L)) + 1) * C;
          }
        }
        for (z.reset(); z.next();) {
          O = z.value;
          const Ov = O.toVertex!;
          if (O.valid && Ov.layer === t) {
            for (X = 0; X < n.length && n[X] !== Ov;) X++;
            if (X === l) m += 1;
          }
        }
        let H = 0, v = 0;
        const j = mm[n[l].index], q = mm[n[l + 1].index];
        const Q = a[n[l].index], Z = a[n[l + 1].index];
        if (j !== -1) { H += Math.abs(j - p); v += Math.abs(j - A); }
        if (q !== -1) { H += Math.abs(q - y); v += Math.abs(q - P); }
        if (Q !== -1) { H += Math.abs(Q - p); v += Math.abs(Q - A); }
        if (Z !== -1) { H += Math.abs(Z - y); v += Math.abs(Z - P); }
        if (g < m - 0.5 || (g === m && d < u - 0.5) ||
            (g === m && d === u && M < N - 0.5) ||
            (g === m && d === u && M === N && v < H - 0.5)) {
          c = true;
          f = true;
          n[l].column = A;
          n[l + 1].column = P;
          const J = n[l];
          n[l] = n[l + 1];
          n[l + 1] = J;
        }
      }
    }
    for (l = 0; l < o; l++) n[l].index = l;
    this._aa(t, n);
    return c;
  }

  /** 官方 `reduceCrossings()`：多轮 median/barycenter + 贪心交换 + aggressive 局部精化 */
  private _reduceCrossingsOfficial(): void {
    let t = this._countCrossings();
    let i: Int16Array = this._he();
    let e = 0, s = 0, n = 0;
    // 官方阶段一：direction ±1，独立跑 iterations 轮
    for (e = 0; e < this._iterations; e++) {
      for (s = 0; s <= this._ot; s++) { this._medianBarycenter(s, 1); this._crossingReduction(s, 1, false, 1); }
      for (n = this._countCrossings(), n < t && (t = n, i = this._he()), s = this._ot; s >= 0; s--) { this._medianBarycenter(s, -1); this._crossingReduction(s, -1, false, -1); }
      n = this._countCrossings();
      if (n < t) { t = n; i = this._he(); }
    }
    this._ds(i);
    // 官方阶段二：direction 0，再独立跑 iterations 轮
    for (e = 0; e < this._iterations; e++) {
      for (s = 0; s <= this._ot; s++) { this._medianBarycenter(s, 0); this._crossingReduction(s, 0, false, 0); }
      for (n = this._countCrossings(), n < t && (t = n, i = this._he()), s = this._ot; s >= 0; s--) { this._medianBarycenter(s, 0); this._crossingReduction(s, 0, false, 0); }
      n = this._countCrossings();
      if (n < t) { t = n; i = this._he(); }
    }
    this._ds(i);
    let o = false, r = 0, l = 0, h = 0, a = 0;
    const aggr = this._aggressiveNum();
    if (aggr === 30) { this._ds(i); return; }
    if (aggr === 32) {
      for (h = t + 1; (a = this._countCrossings()) < h;) {
        for (h = a, r = this._ot; r >= 0; r--) for (l = 0; l <= r; l++) {
          for (o = true; o;) for (o = false, s = r; s >= l; s--) o = this._crossingReduction(s, -1, false, -1) || o;
          n = this._countCrossings(); n >= t ? this._ds(i) : (t = n, i = this._he());
          for (o = true; o;) for (o = false, s = r; s >= l; s--) o = this._crossingReduction(s, 1, false, 1) || o;
          n = this._countCrossings(); n >= t ? this._ds(i) : (t = n, i = this._he());
          for (o = true; o;) for (o = false, s = l; s <= r; s++) o = this._crossingReduction(s, 1, false, 1) || o;
          n >= t ? this._ds(i) : (t = n, i = this._he());
          for (o = true; o;) for (o = false, s = l; s <= r; s++) o = this._crossingReduction(s, -1, false, -1) || o;
          n >= t ? this._ds(i) : (t = n, i = this._he());
          for (o = true; o;) for (o = false, s = r; s >= l; s--) o = this._crossingReduction(s, 0, false, 0) || o;
          n >= t ? this._ds(i) : (t = n, i = this._he());
          for (o = true; o;) for (o = false, s = l; s <= r; s++) o = this._crossingReduction(s, 0, false, 0) || o;
          n >= t ? this._ds(i) : (t = n, i = this._he());
        }
      }
    } else {
      // 官方 default/case 31（AggressiveLess）：全层范围内 6 次扫描直到不再改善
      for (r = this._ot, l = 0, h = t + 1; (a = this._countCrossings()) < h;) {
        for (h = a, o = true; o;) for (o = false, s = r; s >= l; s--) o = this._crossingReduction(s, -1, false, -1) || o;
        n = this._countCrossings(); n >= t ? this._ds(i) : (t = n, i = this._he());
        for (o = true; o;) for (o = false, s = r; s >= l; s--) o = this._crossingReduction(s, 1, false, 1) || o;
        n = this._countCrossings(); n >= t ? this._ds(i) : (t = n, i = this._he());
        for (o = true; o;) for (o = false, s = l; s <= r; s++) o = this._crossingReduction(s, 1, false, 1) || o;
        n >= t ? this._ds(i) : (t = n, i = this._he());
        for (o = true; o;) for (o = false, s = l; s <= r; s++) o = this._crossingReduction(s, -1, false, -1) || o;
        n >= t ? this._ds(i) : (t = n, i = this._he());
        for (o = true; o;) for (o = false, s = r; s >= l; s--) o = this._crossingReduction(s, 0, false, 0) || o;
        n >= t ? this._ds(i) : (t = n, i = this._he());
        for (o = true; o;) for (o = false, s = l; s <= r; s++) o = this._crossingReduction(s, 0, false, 0) || o;
        n >= t ? this._ds(i) : (t = n, i = this._he());
      }
    }
    this._ds(i);
  }

  /** 官方 aggressiveOption 的数值（30=None，31=Less，32=More） */
  private _aggressiveNum(): number {
    const a = this._aggressiveOption;
    if (a === LayeredDigraphAggressiveMore) return 32;
    if (a === LayeredDigraphAggressiveLess) return 31;
    return 30;
  }

  /** 官方 packOption 的数值（位标志：1=Expand,2=Straighten,4=Median，15=All） */
  private _packNum(): number {
    const p = this._packOption;
    if (p === LayeredDigraphPackNone) return 0;
    if (p === LayeredDigraphPackAll) return 15;
    const nm = String(p);
    if (nm.indexOf('Straighten') >= 0) return 2;
    if (nm.indexOf('Median') >= 0) return 4;
    if (nm.indexOf('Expand') >= 0) return 1;
    return 15;
  }

  /** 官方 alignOption 的数值（位标志：1=UL,2=UR,4=LL,8=LR，15=All） */
  private _alignNum(): number {
    const a = this._alignOption;
    if (a === LayeredDigraphAlignNone) return 0;
    if (a === LayeredDigraphAlignAll) return 15;
    const nm = String(a);
    if (nm.indexOf('UpperLeft') >= 0) return 1;
    if (nm.indexOf('UpperRight') >= 0) return 2;
    if (nm.indexOf('LowerLeft') >= 0) return 4;
    if (nm.indexOf('LowerRight') >= 0) return 8;
    return 15;
  }

  /** 官方 `rB()`：网络细化 —— 算端口位置、把跨层>1的长边拆成人工顶点链 */
  private _refineNetwork(): void {
    const t = this.network!;
    const i: LayoutEdge[] = [];
    const e = t.edges.iterator;
    for (; e.next();) {
      const s = e.value;
      s.valid = false;
      i.push(s);
    }
    for (let s = 0; s < i.length; s++) {
      const n = i[s];
      let o = n.fromVertex!;
      const r = n.toVertex!;
      if (n.valid || ((o.node === null && o.data === null) || (r.node === null && r.data === null)) && o.layer === r.layer) continue;
      let l = 0, h = 0, a = 0, c = 0;
      if (n.link !== null) {
        const k = n.link;
        if (k === null) continue;
        const P = o.node, A = r.node;
        if (P === null || A === null) continue;
        let N: any = k.fromNode, M: any = k.toNode, C: any = k.fromPort;
        for (; C !== null && !C.isVisibleObject();) C = C.panel;
        let T: any = k.toPort;
        for (; T !== null && !T.isVisibleObject();) T = T.panel;
        if (n.rev) { const X = N, Y = C; N = M; C = T; M = X; T = Y; }
        const L = o.focus, D = r.focus, F = n.rev ? r.bounds : o.bounds, R = new Point();
        if (P !== N) {
          if (F.isReal() && N.isVisible()) {
            if (N.actualBounds.isReal()) {
              N.getRelativePoint(C, Spot.Center, R);
              R.x += N.actualBounds.x - F.x;
              R.y += N.actualBounds.y - F.y;
            } else { N.getRelativePoint(C, Spot.Center, R); if (!R.isReal()) R.setTo(L.x, L.y); }
          } else R.setTo(L.x, L.y);
        } else if (F.isReal()) { N.getRelativePoint(C, Spot.Center, R); if (!R.isReal()) R.setTo(L.x, L.y); }
        else R.setTo(L.x, L.y);
        const I = n.rev ? o.bounds : r.bounds, O = new Point();
        if (A !== M) {
          if (I.isReal() && M.isVisible()) {
            if (M.actualBounds.isReal()) {
              M.getRelativePoint(T, Spot.Center, O);
              O.x += M.actualBounds.x - I.x;
              O.y += M.actualBounds.y - I.y;
            } else { M.getRelativePoint(T, Spot.Center, O); if (!O.isReal()) O.setTo(D.x, D.y); }
          } else O.setTo(D.x, D.y);
        } else if (I.isReal()) { M.getRelativePoint(T, Spot.Center, O); if (!O.isReal()) O.setTo(D.x, D.y); }
        else O.setTo(D.x, D.y);
        if (this._isVertical) {
          l = Math.round((R.x - L.x) / this._columnSpacing);
          a = R.x;
          h = Math.round((O.x - D.x) / this._columnSpacing);
          c = O.x;
        } else {
          l = Math.round((R.y - L.y) / this._columnSpacing);
          a = R.y;
          h = Math.round((O.y - D.y) / this._columnSpacing);
          c = O.y;
        }
        n.portFromColOffset = l;
        n.portFromPos = a;
        n.portToColOffset = h;
        n.portToPos = c;
      } else {
        n.portFromColOffset = 0; n.portFromPos = 0;
        n.portToColOffset = 0; n.portToPos = 0;
      }
      let f = o.layer;
      const u = r.layer, d = this._xB(n), m = d === 1 || d === 3, g = d === 2 || d === 3;
      let p: LayoutEdge, y: LayoutVertex, x: LayoutVertex[] | null = null, b = 0;
      if (g) {
        x = this._bB(o, r);
        b = 1;
        y = t.createVertex();
        y.node = null;
        y.bk = 1;
        y.bounds = new Rect(0, 0, 10, 10);
        y.focus = new Point(5, 5);
        y.layer = f;
        y.near = o;
        t.addVertex(y);
        p = t.linkVertexes(o, y, n.link)!;
        p.valid = false;
        p.rev = n.rev;
        p.portFromColOffset = l;
        p.portToColOffset = 0;
        p.portFromPos = a;
        p.portToPos = 0;
        o = y;
      }
      let S = 1;
      if (m) S--;
      if (f - u > S && f > 0) {
        for (n.valid = false, y = t.createVertex(), y.node = null, y.bk = 2, y.bounds = new Rect(0, 0, 10, 10), y.focus = new Point(5, 5), y.layer = f - 1, x && b < x.length && y.layer === x[b].layer && (y.near = x[b++]), t.addVertex(y), p = t.linkVertexes(o, y, n.link)!, p.valid = true, p.rev = n.rev, p.portFromColOffset = g ? 0 : l, p.portToColOffset = 0, p.portFromPos = g ? 0 : a, p.portToPos = 0, o = y, f--; f - u > S && f > 0;) {
          y = t.createVertex();
          y.node = null;
          y.bk = 3;
          y.bounds = new Rect(0, 0, 10, 10);
          y.focus = new Point(5, 5);
          y.layer = f - 1;
          if (x && b < x.length && y.layer === x[b].layer) y.near = x[b++];
          t.addVertex(y);
          p = t.linkVertexes(o, y, n.link)!;
          p.valid = true;
          p.rev = n.rev;
          p.portFromColOffset = 0;
          p.portToColOffset = 0;
          p.portFromPos = 0;
          p.portToPos = 0;
          o = y;
          f--;
        }
        p = t.linkVertexes(y, r, n.link)!;
        p.valid = !m;
        if (m) y.near = r;
        p.rev = n.rev;
        p.portFromColOffset = 0;
        p.portToColOffset = h;
        p.portFromPos = 0;
        p.portToPos = c;
      } else {
        n.valid = true;
      }
    }
  }

  /** 官方 `xB(t)`：算端口方向位（bit0=起、bit1=止） */
  private _xB(t: LayoutEdge): number {
    let i = 0;
    const e = t.link;
    if (e !== null) {
      const s: any = e.fromPort, n: any = e.toPort;
      if (s !== null && n !== null) {
        const o: any = e.fromNode, r: any = e.toNode;
        if (o !== null && r !== null) {
          const l = this._portSpotFor(true), h = this._portSpotFor(false);
          const a = this._setsPortSpots ? l : e.computeSpot(true, s);
          const c = this._setsPortSpots ? h : e.computeSpot(false, n);
          const f = e.isOrthogonal;
          if (a.isSide() && a.includesSide(h) && c.isSide() && c.includesSide(l)) return 0;
          const u = e.getLinkPoint(o, s, a, true, f, r, n, new Point());
          const d = e.getLinkDirection(o, s, u, a, true, f, r, n);
          if ((!a.isNone() && d === this._sI(t, true)) || (this._setsPortSpots && o !== null && o.ports.count === 1 && t.rev)) i += 1;
          const m = e.getLinkPoint(r, n, c, false, f, o, s, new Point());
          const g = e.getLinkDirection(r, n, m, c, false, f, o, s);
          if ((!c.isNone() && g === this._sI(t, false)) || (this._setsPortSpots && r !== null && r.ports.count === 1 && t.rev)) i += 2;
        }
      }
    }
    return i;
  }

  /** 官方 `sI(t,i)`：基准方向角 */
  private _sI(t: LayoutEdge, i: boolean): number {
    const P = this._direction;
    if (P === 90) return (i && !t.rev) || (!i && t.rev) ? 270 : 90;
    if (P === 180) return (i && !t.rev) || (!i && t.rev) ? 0 : 180;
    if (P === 270) return (i && !t.rev) || (!i && t.rev) ? 90 : 270;
    return (i && !t.rev) || (!i && t.rev) ? 180 : 0;
  }

  /** 官方 `bB(t,i)`：沿有效非反转入边回溯到 t，返回对齐链 */
  private _bB(t: LayoutVertex, i: LayoutVertex): LayoutVertex[] {
    const e: LayoutVertex[] = [];
    e.push(i);
    return this._nI(t, e) ? e.reverse() : [];
  }

  /** 官方 `nI(t,i)`：递归找 t（DFS 入边） */
  private _nI(t: LayoutVertex, i: LayoutVertex[]): boolean {
    const e = i[i.length - 1].sourceEdges.iterator;
    for (; e.next();) {
      const s = e.value;
      if (s.rev || !s.valid) continue;
      const n = s.fromVertex!;
      if (i.push(n), n === t || this._nI(t, i)) return true;
      i.pop();
    }
    return false;
  }

  /** 官方 `straightenAndPack()`：Zn!==0 时走 MB 四向打包 */
  private _straightenAndPack(): void {
    const align = this._alignNum();
    if (align !== 0) { this._MB(); return; }
    const pack = this._packNum();
    let e = (pack & 1) !== 0;
    const s = (pack & 8) !== 0;
    let t = 0, i = false;
    if (this.network!.edges.count > 1000 && s) e && (e = false);
    if (e) {
      const n: number[] = [];
      for (let o = 0; o <= this._ot; o++) n[o] = 0;
      let r = 0;
      const l = this.network!.vertexes.iterator;
      for (;l.next();) {
        const a = l.value;
        t = a.layer;
        r = a.column;
        const c = this.nodeMinColumnSpace(a, false);
        n[t] = Math.max(n[t], r + c);
      }
      const h = 8;
      for (l.reset(); l.next();) {
        const a = l.value;
        t = a.layer;
        r = a.column;
        a.column = (((this._Wt - n[t]) * h) >> 1) + r * h;
      }
      this._Wt *= h;
    }
    if ((pack & 2) !== 0) i = true;
    let nn = 0;
    for (;i && nn < this._packIterations;) {
      i = false;
      for (t = this._js + 1; t <= this._ot; t++) i = this._bendStraighten(t, 1) || i;
      for (t = this._js - 1; t >= 0; t--) i = this._bendStraighten(t, -1) || i;
      i = this._bendStraighten(this._js, 0) || i;
      nn++;
    }
    if ((pack & 4) !== 0) {
      for (t = this._js + 1; t <= this._ot; t++) this._medianStraighten(t, 1);
      for (t = this._js - 1; t >= 0; t--) this._medianStraighten(t, -1);
      this._medianStraighten(this._js, 0);
    }
    if (e && (this._componentPack(-1), this._componentPack(1)), (pack & 2) !== 0) i = true;
    nn = 0;
    for (;i && nn < this._packIterations;) {
      i = false;
      i = this._bendStraighten(this._js, 0) || i;
      for (t = this._js + 1; t <= this._ot; t++) i = this._bendStraighten(t, 0) || i;
      for (t = this._js - 1; t >= 0; t--) i = this._bendStraighten(t, 0) || i;
      nn++;
    }
  }

  /** 官方 `dm(t,i)`：bendStraighten 单层 */
  private _bendStraighten(t: number, i: number): boolean {
    let e = false;
    if (this._shiftBendStraighten(t, i)) e = true;
    return e;
  }

  /** 官方 `CB(t,i)`：shiftbendStraighten 单层 */
  private _shiftBendStraighten(t: number, i: number): boolean {
    let e = 0;
    const s = this._ha(t), n = this._ci[t], o = this._barycenters(t, -1);
    if (i > 0) for (e = 0; e < n; e++) o[e] = -1;
    const r = this._barycenters(t, 1);
    if (i < 0) for (e = 0; e < n; e++) r[e] = -1;
    let l = false, h = true;
    for (; h;) {
      h = false;
      for (e = 0; e < n; e++) {
        const a = s[e].column, c = this.nodeMinColumnSpace(s[e], true), f = this.nodeMinColumnSpace(s[e], false);
        let u = 0;
        if (e - 1 < 0 || a - s[e - 1].column - 1 > c + this.nodeMinColumnSpace(s[e - 1], false)) u = a - 1;
        else u = a;
        let d = 0;
        if (e + 1 >= n || s[e + 1].column - a - 1 > f + this.nodeMinColumnSpace(s[e + 1], true)) d = a + 1;
        else d = a;
        let m = 0, g = 0, p = 0, y = 0, x = 0, b = 0;
        if (i <= 0) {
          const M = s[e].sourceEdges.iterator;
          for (;M.next();) {
            const C = M.value, T = C.fromVertex!;
            if (C.valid && T.layer !== t) {
              y = this.linkStraightenWeight(C);
              x = C.portFromColOffset;
              b = C.portToColOffset;
              const L = T.column;
              m += (Math.abs(a + b - (L + x)) + 1) * y;
              g += (Math.abs(u + b - (L + x)) + 1) * y;
              p += (Math.abs(d + b - (L + x)) + 1) * y;
            }
          }
        }
        if (i >= 0) {
          const M = s[e].destinationEdges.iterator;
          for (;M.next();) {
            const C = M.value, T = C.toVertex!;
            if (C.valid && T.layer !== t) {
              y = this.linkStraightenWeight(C);
              x = C.portFromColOffset;
              b = C.portToColOffset;
              const L = T.column;
              m += (Math.abs(a + x - (L + b)) + 1) * y;
              g += (Math.abs(u + x - (L + b)) + 1) * y;
              p += (Math.abs(d + x - (L + b)) + 1) * y;
            }
          }
        }
        let S = 0, k = 0, P = 0;
        const A = o[s[e].index], N = r[s[e].index];
        if (A !== -1) { S += Math.abs(A - a); k += Math.abs(A - u); P += Math.abs(A - d); }
        if (N !== -1) { S += Math.abs(N - a); k += Math.abs(N - u); P += Math.abs(N - d); }
        if (g < m || (g === m && k < S)) { l = true; h = true; s[e].column = u; }
        else if (p < m || (p === m && P < S)) { l = true; h = true; s[e].column = d; }
      }
    }
    this._aa(t, s);
    this._Xw();
    return l;
  }

  /** 官方 `ZA(t,i)`：medianStraighten 单层 */
  private _medianStraighten(t: number, i: number): void {
    let e = 0;
    const s = this._ha(t), n = this._ci[t], o = this._medians(t, i), r = Int16Array.from(o);
    let l = false, h = true;
    for (; h;) {
      h = false;
      for (e = 0; e < n; e++) {
        const a = s[e].column, c = this.nodeMinColumnSpace(s[e], true), f = this.nodeMinColumnSpace(s[e], false);
        let u = 0, d = 0, m = 0, g = 0, p = 0;
        if (r[e] === -1) {
          if (e === 0 && e === n - 1) u = a;
          else if (e === 0) { d = s[e + 1].column; u = d - a === f + this.nodeMinColumnSpace(s[e + 1], true) ? a - 1 : a; }
          else if (e === n - 1) { m = s[e - 1].column; u = a - m === c + this.nodeMinColumnSpace(s[e - 1], false) ? a + 1 : a; }
          else {
            m = s[e - 1].column;
            p = m + this.nodeMinColumnSpace(s[e - 1], false) + c + 1;
            d = s[e + 1].column;
            g = d - this.nodeMinColumnSpace(s[e + 1], true) - f - 1;
            u = (p + g) / 2 | 0;
          }
        } else if (e === 0 && e === n - 1) u = r[e];
        else if (e === 0) { d = s[e + 1].column; g = d - this.nodeMinColumnSpace(s[e + 1], true) - f - 1; u = Math.min(r[e], g); }
        else if (e === n - 1) { m = s[e - 1].column; p = m + this.nodeMinColumnSpace(s[e - 1], false) + c + 1; u = Math.max(r[e], p); }
        else {
          m = s[e - 1].column;
          p = m + this.nodeMinColumnSpace(s[e - 1], false) + c + 1;
          d = s[e + 1].column;
          g = d - this.nodeMinColumnSpace(s[e + 1], true) - f - 1;
          if (p < r[e] && r[e] < g) u = r[e];
          else if (p >= r[e]) u = p;
          else if (g <= r[e]) u = g;
        }
        if (u !== a) { l = true; h = true; s[e].column = u; }
      }
    }
    this._aa(t, s);
    this._Xw();
  }

  /** 官方 `NB()`：packAux 全列扫描 */
  private _packAux(): void {
    for (let t = 0; t <= this._Wt; t++) for (; this._packAuxCol(t, 1);) {}
    this._Xw();
  }

  /** 官方 `AB(t,i)`：packAux 单列 */
  private _packAuxCol(t: number, i: number): boolean {
    let e = true;
    const s = this.network!.vertexes.iterator;
    for (;s.next();) {
      const o = s.value, r = this.nodeMinColumnSpace(o, true), l = this.nodeMinColumnSpace(o, false);
      if (o.column - r <= t && o.column + l >= t) { e = false; break; }
    }
    let n = false;
    if (e) {
      if (i > 0) for (s.reset(); s.next();) { const o = s.value; if (o.column > t) { o.column -= 1; n = true; } }
      if (i < 0) for (s.reset(); s.next();) { const o = s.value; if (o.column < t) { o.column += 1; n = true; } }
    }
    return n;
  }

  /** 官方 `TB()`：tightPackAux 全列扫描 */
  private _tightPack(): void {
    this._packAux();
    for (let t = 0; t < this._Wt; t++) for (; this._tightPackCol(t, 1);) {}
    this._Xw();
  }

  /** 官方 `LB(t,i)`：tightPackAux 单列 */
  private _tightPackCol(t: number, i: number): boolean {
    let e = t;
    if (i > 0) e = t + 1;
    if (i < 0) e = t - 1;
    let s = 0;
    const n: boolean[] = [], o: boolean[] = [];
    for (s = 0; s <= this._ot; s++) { n[s] = false; o[s] = false; }
    const r = this.network!.vertexes.iterator;
    for (;r.next();) {
      const a = r.value, c = a.column - this.nodeMinColumnSpace(a, true), f = a.column + this.nodeMinColumnSpace(a, false);
      if (c <= t && f >= t) n[a.layer] = true;
      if (c <= e && f >= e) o[a.layer] = true;
    }
    let l = true, h = false;
    for (s = 0; s <= this._ot; s++) l = l && !(n[s] && o[s]);
    if (l) {
      if (i > 0) for (r.reset(); r.next();) { const a = r.value; if (a.column > t) { a.column -= 1; h = true; } }
      if (i < 0) for (r.reset(); r.next();) { const a = r.value; if (a.column < t) { a.column += 1; h = true; } }
    }
    return h;
  }

  /** 官方 `lI(t)`：componentPack —— 分量打包 */
  private _componentPack(t: number): void {
    this._tightPack();
    let i = 0, e: Int16Array, s = 0, n = 0, o = 0;
    if (t > 0) for (i = 0; i <= this._Wt; i++) for (e = this._he(), s = this._xk(true), n = s + 1; s < n;) { n = s; this._componentShift(i, 1); o = this._xk(true); if (o > s) this._ds(e); else if (o < s) { s = o; e = this._he(); } }
    if (t < 0) for (i = this._Wt; i >= 0; i--) for (e = this._he(), s = this._xk(true), n = s + 1; s < n;) { n = s; this._componentShift(i, -1); o = this._xk(true); if (o > s) this._ds(e); else if (o < s) { s = o; e = this._he(); } }
    this._Xw();
  }

  /** 官方 `hI(t,i)`：componentShift —— 把跨过列 t 的分量整体平移 */
  private _componentShift(t: number, i: number): boolean {
    this._xn = 0;
    const e = this.network!.vertexes.iterator;
    for (;e.next();) e.value.component = -1;
    if (i > 0) for (e.reset(); e.next();) { const c = e.value; if (c.column - this.nodeMinColumnSpace(c, true) <= t) c.component = this._xn; }
    if (i < 0) for (e.reset(); e.next();) { const c = e.value; if (c.column + this.nodeMinColumnSpace(c, false) >= t) c.component = this._xn; }
    for (this._xn++, e.reset(); e.next();) { const c = e.value; if (c.component === -1) { this._JA(c, this._xn, -1, true, true); this._xn++; } }
    let s = 0;
    const n: boolean[] = [];
    for (s = 0; s < this._xn * this._xn; s++) n[s] = false;
    const o: number[] = [];
    for (s = 0; s < (this._ot + 1) * (this._Wt + 1); s++) o[s] = -1;
    for (e.reset(); e.next();) {
      const c = e.value, f = c.layer, u = Math.max(0, c.column - this.nodeMinColumnSpace(c, true)), d = Math.min(this._Wt, c.column + this.nodeMinColumnSpace(c, false));
      for (let m = u; m <= d; m++) o[f * (this._Wt + 1) + m] = c.component;
    }
    for (let c = 0; c <= this._ot; c++) {
      if (i > 0) for (let f = 0; f < this._Wt; f++) if (o[c * (this._Wt + 1) + f] !== -1 && o[c * (this._Wt + 1) + f + 1] !== -1 && o[c * (this._Wt + 1) + f] !== o[c * (this._Wt + 1) + f + 1]) n[o[c * (this._Wt + 1) + f] * this._xn + o[c * (this._Wt + 1) + f + 1]] = true;
      if (i < 0) for (let f = this._Wt; f > 0; f--) if (o[c * (this._Wt + 1) + f] !== -1 && o[c * (this._Wt + 1) + f - 1] !== -1 && o[c * (this._Wt + 1) + f] !== o[c * (this._Wt + 1) + f - 1]) n[o[c * (this._Wt + 1) + f] * this._xn + o[c * (this._Wt + 1) + f - 1]] = true;
    }
    const r: boolean[] = [];
    for (s = 0; s < this._xn; s++) r[s] = true;
    const l: number[] = [];
    l.push(0);
    let h = 0;
    for (; l.length !== 0;) {
      h = l[l.length - 1];
      l.pop();
      if (r[h]) {
        r[h] = false;
        for (s = 0; s < this._xn; s++) if (n[h * this._xn + s]) l.splice(0, 0, s);
      }
    }
    let a = false;
    if (i > 0) for (e.reset(); e.next();) { const c = e.value; if (r[c.component]) { c.column -= 1; a = true; } }
    if (i < 0) for (e.reset(); e.next();) { const c = e.value; if (r[c.component]) { c.column += 1; a = true; } }
    return a;
  }

  /** 官方 `JA(t,i,e,s,n)`：连通分量 DFS */
  private _JA(t: LayoutVertex, i: number, e: number, s: boolean, n: boolean): void {
    if (t.component !== e) return;
    t.component = i;
    if (s) { const l = t.destinationEdges.iterator; for (; l.next();) { const h = l.value; this._JA(h.toVertex!, i, e, s, n); } }
    if (n) { const l = t.sourceEdges.iterator; for (; l.next();) { const h = l.value; this._JA(h.fromVertex!, i, e, s, n); } }
  }

  /** 官方 `xk(t)`：componentPack 用的代价度量 */
  private _xk(t: boolean): number {
    let i = 0;
    const e = this.network!.vertexes.iterator;
    for (; e.next();) {
      const s = e.value;
      if (t) i += s.column;
    }
    return i;
  }

  /** 官方 `MB()`：四向打包 —— 各方向 Pl/Pk 求 Se，FB 对齐，取中位 */
  private _MB(): void {
    const t: LayoutVertex[][] = [];
    const i = this._Lu.length;
    for (let u = 0; u <= i; u++) t[u] = [];
    const e = this.network!.vertexes.iterator;
    for (;e.next();) {
      const u = e.value, d = i - u.layer, m = t[d];
      m[u.index] = u;
    }
    const s = new Set<LayoutEdge>();
    this._DB(t, s);
    let n: Map<LayoutVertex, number> | null = null, o: Map<LayoutVertex, number> | null = null, r: Map<LayoutVertex, number> | null = null, l: Map<LayoutVertex, number> | null = null;
    const h = (this._alignNum() & 1) !== 0, a = (this._alignNum() & 2) !== 0, c = (this._alignNum() & 4) !== 0, f = (this._alignNum() & 8) !== 0;
    if (h) { this._Pl(t, s, true); n = this._Pk(t, true, false); }
    t.reverse();
    if (c) { this._Pl(t, s, false); r = this._Pk(t, false, false); }
    for (const u of t) u.reverse();
    if (f) { this._Pl(t, s, false); l = this._Pk(t, false, true); }
    t.reverse();
    if (a) { this._Pl(t, s, true); o = this._Pk(t, true, true); }
    this._FB(n, o, r, l);
    this.network!.vertexes.each(u => {
      const d = u, m: number[] = [];
      if (h && n) m.push(n.get(d)!);
      if (a && o) m.push(o.get(d)!);
      if (c && r) m.push(r.get(d)!);
      if (f && l) m.push(l.get(d)!);
      m.sort((b, S) => b - S);
      const g = m.length, p = Math.floor((g - 1) / 2), y = Math.ceil((g - 1) / 2), x = (m[p] + m[y]) / 2;
      d.Se = x;
    });
  }

  /** 官方 `DB(t,i)`：收集需要拉直的边到集合 */
  private _DB(t: LayoutVertex[][], i: Set<LayoutEdge>): void {
    const e = t.length;
    for (let s = 1; s < e - 1; s++) {
      let n = 0, o = 0;
      const r = t[s], l = t[s + 1];
      for (let h = 0; o < l.length; h++) {
        const a = l[h], c = this._RB(a);
        if (h === l.length - 1 || c) {
          let f = r.length - 1;
          if (c) f = a.getProperSourceVertexes()[0].index;
          for (; o <= h;) {
            const d = l[o].getProperSourceEdges();
            for (const m of d) {
              const p = m.fromVertex!.index;
              if (p < n || p > f) i.add(m);
            }
            o++;
          }
          n = f;
        }
      }
    }
  }

  /** 官方 `RB(t)`：是否为「人工→人工」链首 */
  private _RB(t: LayoutVertex): boolean {
    if (t.node === null) {
      const i = t.getProperSourceVertexes();
      if (i.length > 0) return i[0].node === null;
    }
    return false;
  }

  /** 官方 `Pl(t,i,e)`：按近邻链（Qn/Ec 环）串联 */
  private _Pl(t: LayoutVertex[][], i: Set<LayoutEdge>, e: boolean): void {
    this._IB(t);
    for (const s of t) {
      let n = -1;
      for (const o of s) {
        const r = e ? o.getProperSourceVertexes() : o.getProperDestinationVertexes(), l = r.length;
        if (l > 0) {
          r.sort((a, c) => a.ca - c.ca);
          const h = (l - 1) / 2;
          for (let a = Math.floor(h), c = Math.ceil(h); a <= c; a++) {
            if (o.Qn === o) {
              const f = r[a];
              let u: LayoutEdge;
              if (e) u = f.getDestinationEdge(o);
              else u = o.getDestinationEdge(f);
              if (!i.has(u) && n < f.ca) { f.Qn = o; o.Ec = f.Ec; o.Qn = f.Ec; n = f.ca; }
            }
          }
        }
      }
    }
  }

  /** 官方 `IB(t)`：初始化各顶点的环链（Ec=Qn=自身）与层内位置 */
  private _IB(t: LayoutVertex[][]): void {
    for (let i = 0; i < t.length; i++) {
      const e = t[i];
      for (let s = 0; s < e.length; s++) {
        const n = e[s];
        n.Ec = n;
        n.Qn = n;
        n.aI = i;
        n.ca = s;
      }
    }
  }

  /** 官方 `Pk(t,i,e)`：单向打包 —— OB 端口、cI 递推 Fu/Se、回写列轴位置 */
  private _Pk(t: LayoutVertex[][], i: boolean, e: boolean): Map<LayoutVertex, number> {
    const s = this._isVertical;
    for (const o of t) for (const r of o) { r.gs = r; r.Fu = Infinity; r.Se = NaN; r._n = 0; }
    this._OB(t, i, e);
    for (const o of t) for (const r of o) if (r.Ec === r) this._cI(r, t);
    for (let o = 0; o < t.length; o++) {
      if (t[o].length <= 0) continue;
      const r = t[o][0];
      if (r.gs !== r) continue;
      if (r.gs!.Fu === Infinity) r.gs!.Fu = 0;
      let l = o, h = 0, a: LayoutVertex;
      do {
        for (a = t[l][h]; a.Qn !== a.Ec;) {
          if (a = a.Qn!, l++, a.ca > 0) {
            const c = this._fI(a, t), f = s ? c.width : c.height, u = a.gs!.Fu + a.Se! + a._n! - (c.Se! + c._n! + f + this._columnSpacing);
            c.gs!.Fu = Math.min(c.gs!.Fu, u);
          }
        }
        h = a.ca + 1;
      } while (l < t.length && h < t[l].length && a.gs === t[l][h].gs);
    }
    const n = new Map<LayoutVertex, number>();
    for (const o of t) for (const r of o) {
      r.Se = r.Se! + r.gs!.Fu + r._n!;
      const l = s ? r.width : r.height;
      n.set(r, e ? -r.Se! - l : r.Se!);
    }
    return n;
  }

  /** 官方 `OB(t,i,e)`：沿环链累加端口偏移 _n（归一到 min=0） */
  private _OB(t: LayoutVertex[][], i: boolean, e: boolean): void {
    const s = this._isVertical;
    for (const n of t) for (const o of n) {
      if (o.Ec !== o) continue;
      let r = 0, l = o;
      for (; l.Qn !== o;) {
        const h = l.Qn!, a = s ? l.width : l.height, c = s ? h.width : h.height;
        let f: LayoutEdge, u: number, d: number, m: number;
        if (i) {
          f = l.getDestinationEdge(h);
          u = f.portFromPos;
          d = f.portToPos;
          if (f.link !== null) {
            if (l.node && l.node !== f.link.fromNode) u = s ? l.focus.x : l.focus.y;
            if (h.node && h.node !== f.link.toNode) d = s ? h.focus.x : h.focus.y;
          }
          if (e) m = l._n! + (a - u) - (c - d);
          else m = l._n! + u - d;
        } else {
          f = h.getDestinationEdge(l);
          u = f.portToPos;
          d = f.portFromPos;
          if (f.link !== null) {
            if (l.node && l.node !== f.link.toNode) u = s ? l.focus.x : l.focus.y;
            if (h.node && h.node !== f.link.fromNode) d = s ? h.focus.x : h.focus.y;
          }
          if (e) m = l._n! + (a - u) - (c - d);
          else m = l._n! + u - d;
        }
        h._n = m;
        r = Math.min(r, m);
        l = h;
      }
      l = o;
      do { l._n = l._n! - r; l = l.Qn!; } while (l !== o);
    }
  }

  /** 官方 `cI(t,i)`：递推组内 Se（相对前一顶点） */
  private _cI(t: LayoutVertex, i: LayoutVertex[][]): void {
    if (!isNaN(t.Se!)) return;
    t.Se = 0;
    let e = t;
    do {
      if (e.ca > 0) {
        const s = this._fI(e, i), n = s.Ec!;
        this._cI(n, i);
        if (t.gs === t) t.gs = n.gs;
        const o = this._isVertical ? s.width : s.height;
        if (t.gs === n.gs) {
          const r = n.Se! + s._n! + o - e._n! + this._columnSpacing;
          t.Se = Math.max(t.Se!, r);
        }
      }
      e = e.Qn!;
    } while (e !== t);
    // 官方：e 此时===t；从 t 出发沿链把 Se/gs 拷贝给其余顶点（含 t.Qn）
    for (; e.Qn !== t;) {
      e = e.Qn!;
      e.Se = t.Se;
      e.gs = t.gs;
    }
  }

  /** 官方 `fI(t,i)`：层内前一顶点 */
  private _fI(t: LayoutVertex, i: LayoutVertex[][]): LayoutVertex {
    return i[t.aI][t.ca - 1];
  }

  /** 官方 `FB(...)`：四向结果对齐 —— 取最佳方向并平移其余 */
  private _FB(...t: (Map<LayoutVertex, number> | null)[]): void {
    let i = -1;
    const e: number[] = [], s: number[] = [];
    let n = Infinity;
    for (let o = 0; o < 4; o++) {
      if (!t[o]) continue;
      const r = this._EB(t[o]!, e, s, o);
      if (r < n) { i = o; n = r; }
    }
    for (let o = 0; o < 4; o++) {
      const r = t[o];
      if (!r) continue;
      const l = o === 0 || o === 2 ? e[i] - e[o] : s[i] - s[o];
      if (l !== 0) r.each(h => { r.set(h.key, h.value + l); });
    }
  }

  /** 官方 `EB(t,i,e,s)`：单向 min/max 跨度 */
  private _EB(t: Map<LayoutVertex, number>, i: number[], e: number[], s: number): number {
    if (!t || t.size === 0) { i[s] = 0; e[s] = 0; return Infinity; }
    let n = Infinity, o = -Infinity;
    t.each(r => {
      const l = r.key, h = r.value, a = this._isVertical ? l.width : l.height;
      if (h < n) n = h;
      if (h + a > o) o = h + a;
    });
    i[s] = n;
    e[s] = o;
    return o - n;
  }

  /** 官方 `commitNodes()`（LD 覆写）：推进轴 ks/Yt + 列轴 column*le + Se 覆盖 + 归一 */
  private _commitNodesOfficial(): void {
    const ot = this._ot;
    if (this._Js.length !== ot + 1) this._Js = new Float32Array(ot + 1);
    if (this._Ss.length !== ot + 1) this._Ss = new Float32Array(ot + 1);
    if (this._ks.length !== ot + 1) this._ks = new Float32Array(ot + 1);
    if (this._Yt.length !== ot + 1) this._Yt = new Float32Array(ot + 1);
    for (let d = 0; d <= ot; d++) { this._Js[d] = 0; this._Ss[d] = 0; this._ks[d] = 0; this._Yt[d] = 0; }
    const t = this.network!.vertexes.iterator;
    for (; t.next();) {
      const d = t.value, m = d.layer;
      this._Js[m] = Math.max(this._Js[m], this.nodeMinLayerSpace(d, true));
      this._Ss[m] = Math.max(this._Ss[m], this.nodeMinLayerSpace(d, false));
    }
    let i = 0;
    const e = this._layerSpacing;
    for (let d = 0; d <= ot; d++) {
      let m = e;
      if (this._Js[d] + this._Ss[d] <= 0) m = 0;
      if (d > 0) i += m / 2;
      if (this._direction === 90 || this._direction === 0) { i += this._Ss[d]; this._ks[d] = i; i += this._Js[d]; }
      else { i += this._Js[d]; this._ks[d] = i; i += this._Ss[d]; }
      if (d < ot) i += m / 2;
      this._Yt[d] = i;
    }
    const s = i, n = this.arrangementOrigin;
    for (let d = 0; d <= ot; d++) {
      if (this._direction === 270) this._ks[d] = n.y + this._ks[d];
      else if (this._direction === 90) { this._ks[d] = n.y + s - this._ks[d]; this._Yt[d] = s - this._Yt[d]; }
      else if (this._direction === 180) this._ks[d] = n.x + this._ks[d];
      else { this._ks[d] = n.x + s - this._ks[d]; this._Yt[d] = s - this._Yt[d]; }
    }
    const o = this._alignNum() !== 0;
    t.reset();
    const r = this._direction === 270 || this._direction === 90;
    let l = Infinity, h = Infinity, a = Infinity, c = -Infinity;
    for (; t.next();) {
      const d = t.value, m = d.layer, g = d.column | 0;
      let p = 0, y = 0;
      if (r) { p = n.x + this._columnSpacing * g; y = this._ks[m]; }
      else { p = this._ks[m]; y = n.y + this._columnSpacing * g; }
      d.centerX = p;
      d.centerY = y;
      if (o && isFinite(d.Se!)) {
        if (r) { if (d.node) d.x = n.x + d.Se!; else d.centerX = n.x + d.Se!; }
        else { if (d.node) d.y = n.y + d.Se!; else d.centerY = n.y + d.Se!; }
      }
      l = Math.min(d.x, l);
      h = Math.min(d.y, h);
      if (r) { a = l; c = Math.max(c, d.bounds.right); }
      else { a = h; c = Math.max(c, d.bounds.bottom); }
    }
    this._jA = c - a;
    const f = n.x - l, u = n.y - h;
    this._kr = new Point(o && r ? 0 : f, o && !r ? 0 : u);
    t.reset();
    for (; t.next();) {
      const d = t.value;
      d.x += f;
      d.y += u;
      d.commit();
    }
  }

  /** 官方 `setPortSpots`（Vw）：按 direction 设两端端口点 */
  private _commitSetPortSpots(): void {
    if (!this._setsPortSpots) return;
    const fromSpot = this._portSpotFor(true);
    const toSpot = this._portSpotFor(false);
    const net = this.network!;
    const spit = net.edges.iterator;
    while (spit.next()) {
      const link = spit.value.link;
      if (link !== null) {
        link.fromSpot = fromSpot;
        link.toSpot = toSpot;
      }
    }
  }

  /**
   * 官方 `commitLinks()`（LD 覆写）：沿人工顶点链生成多点折线路由。
   * 三阶段：①清空旧路由 ②updateRoute 重建基础路由 ③沿 dummy 链插点。
   */
  private _commitLinksOfficial(): void {
    const net = this.network;
    if (net === null) return;
    const dir = this._direction;
    const ls = this._layerSpacing;
    const colSp = this._columnSpacing;
    // 官方 `Link.Rl(spot)`：spot 为 None 或中心(0.5,0.5)
    const relink = (s: Spot): boolean => s === Spot.None || (s.x === 0.5 && s.y === 0.5);

    let link: Link | null = null;
    let it = net.edges.iterator;
    // 阶段①：清空所有已有点
    while (it.next()) {
      link = it.value.link;
      if (link !== null && link.pointsCount > 0) {
        link.startRoute();
        link.clearPoints();
        link.commitRoute();
      }
    }
    // 阶段②：重建基础路由
    for (it.reset(); it.next();) {
      link = it.value.link;
      if (link !== null) link.updateRoute();
    }
    // 阶段③：主路由（沿 dummy 链插点）
    for (it.reset(); it.next();) {
      const edge = it.value;
      link = edge.link;
      if (link === null || link.pointsCount === 0) continue;
      link.startRoute();
      const lnk = link;
      let fromN = lnk.fromNode, toN = lnk.toNode;
      let fromP = lnk.fromPort, toP = lnk.toPort;
      if (fromN !== null) {
        const vis = fromN.findVisibleNode();
        if (vis !== null && vis !== fromN) { fromN = vis; fromP = vis.port; }
      }
      if (toN !== null) {
        const vis = toN.findVisibleNode();
        if (vis !== null && vis !== toN) { toN = vis; toP = vis.port; }
      }
      const fromSpot = lnk.computeSpot(true, fromP);
      const toSpot = lnk.computeSpot(false, toP);
      let fromV: LayoutVertex = edge.fromVertex!;
      let toV: LayoutVertex = edge.toVertex!;

      if (edge.valid) {
        // 有效边（无 dummy）：直接端点处理
        if (lnk.curve === CurveBezier && lnk.pointsCount === 4) {
          if (fromV.column === toV.column && this._alignNum() === 0) {
            const sp = lnk.getLinkPoint(fromN!, fromP!, fromSpot, true, false, toN!, toP!);
            const tp = lnk.getLinkPoint(toN!, toP!, toSpot, false, false, fromN!, fromP!);
            if (!sp.isReal()) sp.set(fromN!.actualBounds.center);
            if (!tp.isReal()) tp.set(toN!.actualBounds.center);
            lnk.clearPoints();
            lnk.addPointAt(sp.x, sp.y);
            lnk.addPointAt((2 * sp.x + tp.x) / 3, (2 * sp.y + tp.y) / 3);
            lnk.addPointAt((sp.x + 2 * tp.x) / 3, (sp.y + 2 * tp.y) / 3);
            lnk.addPointAt(tp.x, tp.y);
          } else {
            let needFrom = false, needTo = false;
            if (fromP !== null && relink(fromSpot)) needFrom = true;
            if (toP !== null && relink(toSpot)) needTo = true;
            if (needFrom || needTo) {
              let L: Point | null = null;
              if (needFrom) {
                L = lnk.getLinkPointFromPoint(fromN!, fromP!, fromP!.getDocumentPoint(Spot.Center), lnk.getPoint(3), true);
                if (!L.isReal()) L.set(fromN!.actualBounds.center);
                lnk.setPointAt(0, L.x, L.y);
              }
              let D: Point | null = null;
              if (needTo) {
                D = lnk.getLinkPointFromPoint(toN!, toP!, toP!.getDocumentPoint(Spot.Center), lnk.getPoint(0), false);
                if (!D.isReal()) D.set(toN!.actualBounds.center);
                lnk.setPointAt(3, D.x, D.y);
              }
              if (L) {
                const f = lnk.getPoint(2);
                lnk.setPointAt(1, (L.x * 2 + f.x) / 3, (L.y * 2 + f.y) / 3);
              }
              if (D) {
                const f = lnk.getPoint(1);
                lnk.setPointAt(2, (D.x * 2 + f.x) / 3, (D.y * 2 + f.y) / 3);
              }
            }
          }
        }
        lnk.commitRoute();
        continue;
      }
      if (fromV.layer === toV.layer) {
        lnk.commitRoute();
        continue;
      }

      const isBezier = lnk.curve === CurveBezier;
      const isOrtho = lnk.isOrthogonal;
      let g = 0;
      let p = lnk.firstPickIndex + 1;
      if (isOrtho) {
        g = lnk.pointsCount;
        if (g > 4) lnk.points.removeRange(2, g - 3);
      } else if (isBezier) {
        g = lnk.pointsCount;
        if (g > 4) lnk.points.removeRange(2, g - 3);
        if (g === 4) p = 2;
      } else {
        g = lnk.pointsCount;
        const noFrom = fromSpot === Spot.None, noTo = toSpot === Spot.None;
        if (g > 2 && noFrom && noTo) lnk.points.removeRange(1, g - 2);
        else if (g > 3 && noFrom && !noTo) lnk.points.removeRange(1, g - 3);
        else if (g > 3 && !noFrom && noTo) lnk.points.removeRange(2, g - 2);
        else if (g > 4 && !noFrom && !noTo) lnk.points.removeRange(2, g - 3);
      }

      let dummy: LayoutVertex | null = null, other: LayoutVertex | null = null;
      let bx = 0, by = 0, cx = 0, cy = 0, A = 0, N = 0, M = 0;

      if (edge.rev) {
        // 反向边：从 toV 向 fromV 走 dummy 链
        for (; toV !== null && fromV !== toV;) {
          dummy = null; other = null;
          const se = toV.sourceEdges.iterator;
          for (; se.next();) {
            const de = se.value;
            if (de.link === lnk && (dummy = de.fromVertex!, other = de.toVertex!, dummy.node === null)) break;
          }
          if (dummy === null) break;
          if (dummy !== fromV) {
            bx = lnk.getPoint(p - 1).x; by = lnk.getPoint(p - 1).y;
            cx = dummy.centerX; cy = dummy.centerY;
            if (isOrtho) {
              if (dir === 180 || dir === 0) {
                if (p === lnk.firstPickIndex + 1) {
                  lnk.insertPointAt(p++, bx, by); lnk.insertPointAt(p++, bx, cy);
                } else if ((other !== null ? other.centerY : by) !== cy) {
                  A = this._Yt[dummy.layer - 1] + this._kr.x;
                  lnk.insertPointAt(p++, A, by); lnk.insertPointAt(p++, A, cy);
                }
              } else {
                if (p === lnk.firstPickIndex + 1) {
                  lnk.insertPointAt(p++, bx, by); lnk.insertPointAt(p++, cx, by);
                } else if ((other !== null ? other.centerX : bx) !== cx) {
                  A = this._Yt[dummy.layer - 1] + this._kr.y;
                  lnk.insertPointAt(p++, bx, A); lnk.insertPointAt(p++, cx, A);
                }
              }
            } else {
              if (p === lnk.firstPickIndex + 1) {
                N = Math.max(10, this._Js[toV.layer]); M = Math.max(10, this._Ss[toV.layer]);
                if (isBezier) {
                  if (dir === 180) {
                    if (cx <= toV.bounds.x) { const e2 = toV.bounds.x; lnk.insertPointAt(p++, e2 - N, cy); lnk.insertPointAt(p++, e2, cy); lnk.insertPointAt(p++, e2 + M, cy); }
                    else { lnk.insertPointAt(p++, cx - N, cy); lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx + M, cy); }
                  } else if (dir === 90) {
                    if (cy >= toV.bounds.bottom) { const e2 = toV.bounds.y + toV.bounds.height; lnk.insertPointAt(p++, cx, e2 + M); lnk.insertPointAt(p++, cx, e2); lnk.insertPointAt(p++, cx, e2 - N); }
                    else { lnk.insertPointAt(p++, cx, cy + M); lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy - N); }
                  } else if (dir === 270) {
                    if (cy <= toV.bounds.y) { const e2 = toV.bounds.y; lnk.insertPointAt(p++, cx, e2 - N); lnk.insertPointAt(p++, cx, e2); lnk.insertPointAt(p++, cx, e2 + M); }
                    else { lnk.insertPointAt(p++, cx, cy - N); lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy + M); }
                  } else if (dir === 0) {
                    if (cx >= toV.bounds.right) { const e2 = toV.bounds.x + toV.bounds.width; lnk.insertPointAt(p++, e2 + M, cy); lnk.insertPointAt(p++, e2, cy); lnk.insertPointAt(p++, e2 - N, cy); }
                    else { lnk.insertPointAt(p++, cx + M, cy); lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx - N, cy); }
                  }
                } else {
                  lnk.insertPointAt(p++, bx, by);
                  let L2 = 0;
                  if (dir === 180 || dir === 0) {
                    if ((dir === 180 ? cx >= toV.bounds.right : cx <= toV.bounds.x)) L2 = (dir === 0 ? -N : M) / 2;
                    lnk.insertPointAt(p++, bx + L2, cy);
                  } else {
                    if ((dir === 270 ? cy >= toV.bounds.bottom : cy <= toV.bounds.y)) L2 = (dir === 90 ? -N : M) / 2;
                    lnk.insertPointAt(p++, cx, by + L2);
                  }
                  lnk.insertPointAt(p++, cx, cy);
                }
              } else {
                N = Math.max(10, this._Js[dummy.layer]); M = Math.max(10, this._Ss[dummy.layer]);
                if (isBezier) {
                  if (dir === 180) {
                    lnk.insertPointAt(p++, cx - N - Math.max(10, ls), cy);
                    lnk.insertPointAt(p++, Math.min(cx - N + ls / 2, cx), cy);
                    lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy);
                    lnk.insertPointAt(p++, Math.max(cx + M - ls / 2, cx), cy);
                    lnk.insertPointAt(p++, cx + M + ls, cy);
                  } else if (dir === 90) {
                    lnk.insertPointAt(p++, cx, cy + M + Math.max(10, ls));
                    lnk.insertPointAt(p++, cx, Math.max(cy + M - ls / 2, cy));
                    lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy);
                    lnk.insertPointAt(p++, cx, Math.min(cy - N + ls / 2, cy));
                    lnk.insertPointAt(p++, cx, cy - N - ls);
                  } else if (dir === 270) {
                    lnk.insertPointAt(p++, cx, cy - N - Math.max(10, ls));
                    lnk.insertPointAt(p++, cx, Math.min(cy - N + ls / 2, cy));
                    lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy);
                    lnk.insertPointAt(p++, cx, Math.max(cy + M - ls / 2, cy));
                    lnk.insertPointAt(p++, cx, cy + M + ls);
                  } else {
                    lnk.insertPointAt(p++, cx + M + Math.max(10, ls), cy);
                    lnk.insertPointAt(p++, Math.max(cx + M - ls / 2, cx), cy);
                    lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy);
                    lnk.insertPointAt(p++, Math.min(cx - N + ls / 2, cx), cy);
                    lnk.insertPointAt(p++, cx - N - ls, cy);
                  }
                } else {
                  if (dir === 180 || dir === 90 || dir === 270) { /* noop */ }
                  lnk.insertPointAt(p++, cx, cy);
                }
              }
            }
            toV = dummy;
          } else {
            // dummy === fromV（链尾）
            if (p === lnk.firstPickIndex + 1) {
              // 保持原样（首个插点位置）
            }
            // 从 fromV 侧收尾
            if (toP === null || fromSpot !== Spot.None || isOrtho) {
              bx = lnk.getPoint(p - 1).x; by = lnk.getPoint(p - 1).y;
              cx = lnk.getPoint(p).x; cy = lnk.getPoint(p).y;
              if (isOrtho) {
                const T2 = this._Ss[fromV.layer];
                let L2 = 0;
                if (dir === 180 || dir === 0) {
                  L2 = by;
                  if (L2 >= fromV.bounds.y && L2 <= fromV.bounds.bottom && (dir === 180 ? cx >= fromV.bounds.x : cx <= fromV.bounds.right)) {
                    A = fromV.centerX + (dir === 180 ? -T2 : T2);
                    L2 = L2 < fromV.bounds.y + fromV.bounds.height / 2 ? fromV.bounds.y - colSp / 2 : fromV.bounds.bottom + colSp / 2;
                    lnk.insertPointAt(p++, A, by); lnk.insertPointAt(p++, A, L2);
                  }
                  lnk.insertPointAt(p++, cx, L2); lnk.insertPointAt(p++, cx, cy);
                } else {
                  L2 = bx;
                  if (L2 >= fromV.bounds.x && L2 <= fromV.bounds.right && (dir === 270 ? cy >= fromV.bounds.y : cy <= fromV.bounds.bottom)) {
                    A = fromV.centerY + (dir === 270 ? -T2 : T2);
                    L2 = L2 < fromV.bounds.x + fromV.bounds.width / 2 ? fromV.bounds.x - colSp / 2 : fromV.bounds.right + colSp / 2;
                    lnk.insertPointAt(p++, bx, A); lnk.insertPointAt(p++, L2, A);
                  }
                  lnk.insertPointAt(p++, L2, cy); lnk.insertPointAt(p++, cx, cy);
                }
              } else if (isBezier) {
                N = Math.max(10, this._Js[fromV.layer]); M = Math.max(10, this._Ss[fromV.layer]);
                if (dir === 180 && cx >= fromV.bounds.x) { const e2 = fromV.bounds.x + fromV.bounds.width; lnk.setPointAt(p - 2, e2, by); lnk.setPointAt(p - 1, e2 + M, by); }
                else if (dir === 90 && cy <= fromV.bounds.bottom) { const e2 = fromV.bounds.y; lnk.setPointAt(p - 2, bx, e2); lnk.setPointAt(p - 1, bx, e2 - N); }
                else if (dir === 270 && cy >= fromV.bounds.y) { const e2 = fromV.bounds.y + fromV.bounds.height; lnk.setPointAt(p - 2, bx, e2); lnk.setPointAt(p - 1, bx, e2 + M); }
                else if (dir === 0 && cx <= fromV.bounds.right) { const e2 = fromV.bounds.x; lnk.setPointAt(p - 2, e2, by); lnk.setPointAt(p - 1, e2 - N, by); }
              } else {
                N = Math.max(10, this._Js[fromV.layer]); M = Math.max(10, this._Ss[fromV.layer]);
                let T2 = 0;
                if (dir === 180 || dir === 0) {
                  if ((dir === 180 ? cx <= fromV.bounds.x : cx >= fromV.bounds.right)) T2 = (dir === 0 ? M : -N) / 2;
                  lnk.insertPointAt(p++, cx + T2, by);
                } else {
                  if ((dir === 270 ? cy <= fromV.bounds.y : cy >= fromV.bounds.bottom)) T2 = (dir === 90 ? M : -N) / 2;
                  lnk.insertPointAt(p++, bx, cy + T2);
                }
                lnk.insertPointAt(p++, cx, cy);
              }
            }
            break;
          }
        }
      } else {
        // 正向边：从 fromV 向 toV 走 dummy 链
        for (; fromV !== null && fromV !== toV;) {
          dummy = null; other = null;
          const de2 = fromV.destinationEdges.iterator;
          for (; de2.next();) {
            const te = de2.value;
            if (te.link === lnk && (dummy = te.toVertex!, other = te.fromVertex!, other.node !== null && (other = null), dummy.node === null)) break;
          }
          if (dummy === null) break;
          if (dummy !== toV) {
            bx = lnk.getPoint(p - 1).x; by = lnk.getPoint(p - 1).y;
            cx = dummy.centerX; cy = dummy.centerY;
            if (isOrtho) {
              if (dir === 180 || dir === 0) {
                if ((other !== null ? other.centerY : by) !== cy) {
                  A = this._Yt[dummy.layer] + this._kr.x;
                  if (p === lnk.firstPickIndex + 1) A = dir === 0 ? Math.max(A, bx) : Math.min(A, bx);
                  lnk.insertPointAt(p++, A, by); lnk.insertPointAt(p++, A, cy);
                }
              } else {
                if ((other !== null ? other.centerX : bx) !== cx) {
                  A = this._Yt[dummy.layer] + this._kr.y;
                  if (p === lnk.firstPickIndex + 1) A = dir === 90 ? Math.max(A, by) : Math.min(A, by);
                  lnk.insertPointAt(p++, bx, A); lnk.insertPointAt(p++, cx, A);
                }
              }
            } else {
              N = Math.max(10, this._Js[dummy.layer]); M = Math.max(10, this._Ss[dummy.layer]);
              if (isBezier) {
                if (dir === 180) {
                  lnk.insertPointAt(p++, cx + M + Math.max(10, ls), cy);
                  lnk.insertPointAt(p++, Math.max(cx + M - ls / 2, cx), cy);
                  lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy);
                  lnk.insertPointAt(p++, Math.min(cx - N + ls / 2, cx), cy);
                  lnk.insertPointAt(p++, cx - N - ls, cy);
                } else if (dir === 90) {
                  lnk.insertPointAt(p++, cx, cy - N - Math.max(10, ls));
                  lnk.insertPointAt(p++, cx, Math.min(cy - N + ls / 2, cy));
                  lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy);
                  lnk.insertPointAt(p++, cx, Math.max(cy + M - ls / 2, cy));
                  lnk.insertPointAt(p++, cx, cy + M + ls);
                } else if (dir === 270) {
                  lnk.insertPointAt(p++, cx, cy + M + Math.max(10, ls));
                  lnk.insertPointAt(p++, cx, Math.max(cy + M - ls / 2, cy));
                  lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy);
                  lnk.insertPointAt(p++, cx, Math.min(cy - N + ls / 2, cy));
                  lnk.insertPointAt(p++, cx, cy - N - ls);
                } else {
                  lnk.insertPointAt(p++, cx - N - Math.max(10, ls), cy);
                  lnk.insertPointAt(p++, Math.min(cx - N + ls / 2, cx), cy);
                  lnk.insertPointAt(p++, cx, cy); lnk.insertPointAt(p++, cx, cy);
                  lnk.insertPointAt(p++, Math.max(cx + M - ls / 2, cx), cy);
                  lnk.insertPointAt(p++, cx + M + ls, cy);
                }
              } else {
                if (dir === 180) { lnk.insertPointAt(p++, cx + M, cy); lnk.insertPointAt(p++, cx - N, cy); }
                else if (dir === 90) { lnk.insertPointAt(p++, cx, cy - N); lnk.insertPointAt(p++, cx, cy + M); }
                else if (dir === 270) { lnk.insertPointAt(p++, cx, cy + M); lnk.insertPointAt(p++, cx, cy - N); }
                else { lnk.insertPointAt(p++, cx - N, cy); lnk.insertPointAt(p++, cx + M, cy); }
              }
            }
            fromV = dummy;
          } else {
            // dummy === toV（链尾）：从 toV 侧收尾
            if (isOrtho) {
              bx = lnk.getPoint(p - 1).x; by = lnk.getPoint(p - 1).y;
              cx = lnk.getPoint(p).x; cy = lnk.getPoint(p).y;
              if (dir === 180 || dir === 0) {
                if (by !== cy) {
                  A = dir === 0 ? Math.min(Math.max((cx + bx) / 2, this._Yt[toV.layer] + this._kr.x), cx) : Math.max(Math.min((cx + bx) / 2, this._Yt[toV.layer] + this._kr.x), cx);
                  lnk.insertPointAt(p++, A, by); lnk.insertPointAt(p++, A, cy);
                }
              } else {
                if (bx !== cx) {
                  A = dir === 90 ? Math.min(Math.max((cy + by) / 2, this._Yt[toV.layer] + this._kr.y), cy) : Math.max(Math.min((cy + by) / 2, this._Yt[toV.layer] + this._kr.y), cy);
                  lnk.insertPointAt(p++, bx, A); lnk.insertPointAt(p++, cx, A);
                }
              }
            }
            break;
          }
        }
      }

      if (isBezier && lnk.pointsCount >= 4) {
        if (fromN !== null && fromP !== null && relink(fromSpot)) {
          const cc = fromP.getDocumentPoint(Spot.Center);
          if (!cc.isReal()) cc.setTo(fromN.actualBounds.centerX, fromN.actualBounds.centerY);
          const t3 = lnk.getPoint(3), t2 = lnk.getPoint(2);
          if (dir === 90 || dir === 270) {
            lnk.setPointAt(1, t3.x, (t2.y + t3.y) / 2);
            lnk.setPointAt(2, t3.x, (t2.y + t3.y) / 2);
          } else {
            lnk.setPointAt(1, (t2.x + t3.x) / 2, t3.y);
            lnk.setPointAt(2, (t2.x + t3.x) / 2, t3.y);
          }
          const d0 = lnk.getLinkPointFromPoint(fromN, fromP, cc, lnk.getPoint(1), true);
          lnk.setPointAt(0, d0.x, d0.y);
        }
        if (toN !== null && toP !== null && relink(toSpot)) {
          const cc = toP.getDocumentPoint(Spot.Center);
          if (!cc.isReal()) cc.setTo(toN.actualBounds.centerX, toN.actualBounds.centerY);
          const tN4 = lnk.getPoint(lnk.pointsCount - 4);
          const lEnd = lnk.getLinkPointFromPoint(toN, toP, cc, tN4, false);
          const tN3 = lnk.getPoint(lnk.pointsCount - 3);
          if (dir === 90 || dir === 270) {
            lnk.setPointAt(lnk.pointsCount - 2, tN4.x, (tN3.y + lEnd.y) / 2);
            lnk.setPointAt(lnk.pointsCount - 3, tN4.x, (tN3.y + lEnd.y) / 2);
          } else {
            lnk.setPointAt(lnk.pointsCount - 2, (tN3.x + lEnd.x) / 2, tN4.y);
            lnk.setPointAt(lnk.pointsCount - 3, (tN3.x + lEnd.x) / 2, tN4.y);
          }
          const dN = lnk.getLinkPointFromPoint(toN, toP, cc, lnk.getPoint(lnk.pointsCount - 2), false);
          lnk.setPointAt(lnk.pointsCount - 1, dN.x, dN.y);
        }
      }
      lnk.commitRoute();
      // 登记布局提交的路线：官方里 commitNodes 的 Kd 失效被紧随的 commitLinks
      // 重新提交吸收；本项目测量趟快照比对会在布局后再失效一次，靠 _measureArrangeAll
      // 里的恢复逻辑沿用本条路线（LayeredDigraph 沿 dummy 链插的多点折线，重算会丢）。
      const _dgt: any = this.diagram;
      if (_dgt !== null && _dgt !== undefined) _dgt._layoutCommittedRoutes.add(lnk);
      edge.commit();
    }
  }

  /** 官方 `nB()`：运行时状态复位（占位，_nB 已实现） */

  // ============ 官方 LayeredDigraphLayout 静态枚举（对齐 go.d.ts，阶段 7） ============
  static CycleDepthFirst = LayeredDigraphCycleRemoveDepthFirst;
  static CycleGreedy = LayeredDigraphCycleRemoveGreedy;
  static CycleFromLayers = LayeredDigraphCycleRemoveFromLayers;
  static LayerOptimalLinkLength = LayeredDigraphLayeringOptimalLinkLength;
  static LayerLongestPathSink = LayeredDigraphLayeringLongestPathSink;
  static LayerLongestPathSource = LayeredDigraphLayeringLongestPathSource;
  static InitDepthFirstOut = LayeredDigraphInitDepthFirstOut;
  static InitDepthFirstIn = LayeredDigraphInitDepthFirstIn;
  static InitNaive = LayeredDigraphInitNaive;
  static AggressiveNone = LayeredDigraphAggressiveNone;
  static AggressiveLess = LayeredDigraphAggressiveLess;
  static AggressiveMore = LayeredDigraphAggressiveMore;
  static PackNone = LayeredDigraphPackNone;
  static PackExpand = LayeredDigraphPackExpand;
  static PackStraighten = LayeredDigraphPackStraighten;
  static PackMedian = LayeredDigraphPackMedian;
  static PackAll = LayeredDigraphPackAll;
  static AlignNone = LayeredDigraphAlignNone;
  static AlignUpperLeft = LayeredDigraphAlignUpperLeft;
  static AlignUpperRight = LayeredDigraphAlignUpperRight;
  static AlignLowerLeft = LayeredDigraphAlignLowerLeft;
  static AlignLowerRight = LayeredDigraphAlignLowerRight;
  static AlignAll = LayeredDigraphAlignAll;
}
