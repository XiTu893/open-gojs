import { Point } from '../core/Point';
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
  LayeredDigraphAlignLowerLeft, LayeredDigraphAlignLowerRight, LayeredDigraphAlignAll
} from '../core/EnumValues';
import { Node } from '../view/Node';
import { Layout } from './Layout';
import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';
import { LayoutEdge } from './LayoutEdge';
import { Map } from '../core/Map';

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
  private _layerSpacing: number = 50;
  private _columnSpacing: number = 30;
  private _setsPortSpots: boolean = true;
  private _aggressiveOption: EnumValue = LayeredDigraphAggressiveNone;
  private _packOption: EnumValue = LayeredDigraphPackAll;
  private _layeringOption: string = 'longestpathsource';
  private _cycleRemoveOption: string = 'depthfirst';

  private _initializeOption: EnumValue = LayeredDigraphInitDepthFirstOut;
  private _iterations: number = 4;
  private _packIterations: number = 10;
  private _alignOption: EnumValue = LayeredDigraphAlignAll;
  private _centered: boolean = true;
  private _maxLayer: number = -1;
  private _maxIndex: number = -1;
  private _maxColumn: number = -1;
  private _minIndexLayer: number = 0;
  private _maxIndexLayer: number = 0;

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
  get maxColumn(): number { return this._maxColumn; }
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

  /** 官方 protected nodeMinLayerSpace(v, topleft)：默认预留的层内空间 */
  nodeMinLayerSpace(v: LayoutVertex, topleft: boolean): number {
    if (v.node === null) return 0;
    const horizontal = this._isVertical;
    return topleft
      ? (horizontal ? v.focusX + 10 : v.focusY + 10)
      : (horizontal ? v.bounds.width - v.focusX + 10 : v.bounds.height - v.focusY + 10);
  }

  /** 官方 protected nodeMinColumnSpace(v, topleft)：默认按 columnSpacing 折算列空间 */
  nodeMinColumnSpace(v: LayoutVertex, topleft: boolean): number {
    if (v.node === null) return 0;
    const horizontal = this._isVertical;
    return topleft
      ? (horizontal ? Math.ceil(v.focusX / this._columnSpacing) : Math.ceil(v.focusY / this._columnSpacing))
      : (horizontal ? Math.ceil((v.bounds.width - v.focusX) / this._columnSpacing) : Math.ceil((v.bounds.height - v.focusY) / this._columnSpacing));
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
      const temp = edge.fromVertex;
      edge.fromVertex = edge.toVertex;
      edge.toVertex = temp;
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
    const net = this.network;
    if (net === null || net.vertexes.count === 0) return;
    const vertexes: LayoutVertex[] = [];
    const edges: LayoutEdge[] = [];
    const vit = net.vertexes.iterator;
    while (vit.next()) vertexes.push(vit.value);
    const eit = net.edges.iterator;
    while (eit.next()) edges.push(eit.value);
    const maxLayer = this._maxLayer;
    const layers: LayoutVertex[][] = createArrayOfArrays<LayoutVertex>(maxLayer + 1);
    for (const v of vertexes) {
      const l = (v as any).layer as number;
      if (l >= 0 && l <= maxLayer) layers[l].push(v);
    }
    this._reduceCrossings(layers, edges);
  }

  /** 官方 protected straightenAndPack()：调整列位置以拉直连线并紧凑排列 */
  straightenAndPack(): void {
    const net = this.network;
    if (net === null || net.vertexes.count === 0) return;
    const vertexes: LayoutVertex[] = [];
    const vit = net.vertexes.iterator;
    while (vit.next()) vertexes.push(vit.value);
    const layers: LayoutVertex[][] = createArrayOfArrays<LayoutVertex>(this._maxLayer + 1);
    for (const v of vertexes) {
      const l = (v as any).layer as number;
      if (l >= 0 && l <= this._maxLayer) layers[l].push(v);
    }
    this._positionNodes(layers);
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
    const copy = new LayeredDigraphLayout();
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
    if (net.vertexes.count === 0) return;

    const vertexes: LayoutVertex[] = [];
    const vit = net.vertexes.iterator;
    while (vit.next()) {
      vertexes.push(vit.value);
    }

    const edges: LayoutEdge[] = [];
    const eit = net.edges.iterator;
    while (eit.next()) {
      edges.push(eit.value);
    }

    if (vertexes.length === 0) return;

    // Assign indices
    for (let i = 0; i < vertexes.length; i++) {
      vertexes[i]._index = i;
    }

    // Step 1: Remove cycles using DFS
    const { reversedEdges } = this._removeCycles(vertexes, edges);

    // Step 2: Assign layers
    const layers = this._assignLayers(vertexes, edges);

    // Step 3: Order nodes within layers (crossing reduction)
    this._reduceCrossings(layers, edges);

    // Step 4: Position nodes
    this._positionNodes(layers);

    // Restore reversed edges
    for (const edge of reversedEdges) {
      const temp = edge.fromVertex;
      edge.fromVertex = edge.toVertex;
      edge.toVertex = temp;
    }

    // Commit positions
    const origin = this.arrangementOrigin;
    const isVertical = this._isVertical;
    const isReversed = this._isReversed;

    for (const v of vertexes) {
      if (v.node && !v._isArtificial) {
        let x: number, y: number;
        if (isVertical) {
          x = origin.x + v.x;
          y = isReversed ? origin.y - v.y : origin.y + v.y;
        } else {
          y = origin.y + v.x;
          x = isReversed ? origin.x - v.y : origin.x + v.y;
        }
        v.node.move(new Point(x, y));
      }
    }

    this.isValidLayout = true;
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
          // Back edge - reverse it
          const temp = edge.fromVertex;
          edge.fromVertex = edge.toVertex;
          edge.toVertex = temp;
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
    const inDegree = new Int32Array(vertexes.length);
    const adjList: number[][] = createArrayOfArrays<number>(vertexes.length);

    for (const edge of edges) {
      if (edge.fromVertex && edge.toVertex) {
        inDegree[edge.toVertex._index]++;
        adjList[edge.fromVertex._index].push(edge.toVertex._index);
      }
    }

    // Compute layer using longest path from sources
    const layer = new Int32Array(vertexes.length).fill(-1);
    const queue: number[] = [];

    // Find sources (in-degree 0)
    for (let i = 0; i < vertexes.length; i++) {
      if (inDegree[i] === 0) {
        layer[i] = 0;
        queue.push(i);
      }
    }

    // Topological sort with layer assignment
    const topoOrder: number[] = [];
    while (queue.length > 0) {
      const v = queue.shift()!;
      topoOrder.push(v);
      for (const toIdx of adjList[v]) {
        layer[toIdx] = Math.max(layer[toIdx], layer[v] + 1);
        inDegree[toIdx]--;
        if (inDegree[toIdx] === 0) {
          queue.push(toIdx);
        }
      }
    }

    // Handle any remaining unassigned (from cycles that weren't fully broken)
    for (let i = 0; i < vertexes.length; i++) {
      if (layer[i] === -1) layer[i] = 0;
    }

    // Build layers
    let maxLayer = 0;
    for (let i = 0; i < vertexes.length; i++) {
      if (layer[i] > maxLayer) maxLayer = layer[i];
    }
    const layers: LayoutVertex[][] = createArrayOfArrays<LayoutVertex>(maxLayer + 1);

    for (let i = 0; i < vertexes.length; i++) {
      layers[layer[i]].push(vertexes[i]);
    }

    return layers;
  }

  /**
   * Reduce edge crossings using barycenter heuristic.
   */
  private _reduceCrossings(layers: LayoutVertex[][], edges: LayoutEdge[]): void {
    // Build adjacency info
    const vertexIndex = new Map<LayoutVertex, number>();
    for (const layer of layers) {
      for (let i = 0; i < layer.length; i++) {
        vertexIndex.set(layer[i], i);
      }
    }

    // Multiple passes of barycenter ordering
    for (let pass = 0; pass < 4; pass++) {
      // Forward pass (top to bottom)
      for (let l = 1; l < layers.length; l++) {
        this._barycenterOrder(layers[l], layers[l - 1], edges, true);
      }
      // Backward pass (bottom to top)
      for (let l = layers.length - 2; l >= 0; l--) {
        this._barycenterOrder(layers[l], layers[l + 1], edges, false);
      }
    }
  }

  /**
   * Reorder a layer based on barycenter of neighbors.
   */
  private _barycenterOrder(
    layer: LayoutVertex[],
    neighborLayer: LayoutVertex[],
    edges: LayoutEdge[],
    isDownward: boolean
  ): void {
    const neighborPos = new Map<LayoutVertex, number>();
    for (let i = 0; i < neighborLayer.length; i++) {
      neighborPos.set(neighborLayer[i], i);
    }

    // Compute barycenter for each vertex in the layer
    const barycenters = new Map<LayoutVertex, number>();
    for (const v of layer) {
      let sum = 0;
      let count = 0;

      for (const edge of edges) {
        const source = isDownward ? edge.fromVertex : edge.toVertex;
        const target = isDownward ? edge.toVertex : edge.fromVertex;

        if (target === v && source && neighborPos.has(source)) {
          sum += neighborPos.get(source)!;
          count++;
        }
      }

      barycenters.set(v, count > 0 ? sum / count : 0);
    }

    // Sort by barycenter
    layer.sort((a, b) => (barycenters.get(a) || 0) - (barycenters.get(b) || 0));
  }

  /**
   * Position nodes within each layer.
   *
   * v.x is the coordinate along the within-layer axis and v.y along the
   * layer-progression axis; both are measured from 0. Official GoJS advances
   * the layer axis by the previous layer's maximum thickness plus
   * layerSpacing, and spaces nodes inside a layer by their own breadth plus
   * columnSpacing - so nodes never overlap.
   */
  private _positionNodes(layers: LayoutVertex[][]): void {
    // Layer axis: cumulative, so each layer clears the previous one.
    let layerOffset = 0;
    for (const layer of layers) {
      let layerThick = 0;
      for (const v of layer) {
        const t = this._isVertical ? v.bounds.height : v.bounds.width;
        if (t > layerThick) layerThick = t;
        v.y = layerOffset;
      }
      layerOffset += layerThick + this._layerSpacing;
    }

    // Within-layer axis: laid out left-to-right, then the whole thing is
    // shifted so the leftmost node starts at 0.
    let maxAcross = 0;
    for (const layer of layers) {
      let across = 0;
      for (const v of layer) {
        const size = this._isVertical ? v.bounds.width : v.bounds.height;
        v.x = across + size / 2;
        across += size + this._columnSpacing;
      }
      if (across > maxAcross) maxAcross = across;
    }
    for (const layer of layers) {
      for (const v of layer) v.x -= maxAcross / 2;
    }
  }

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
