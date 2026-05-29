import { Point } from '../core/Point';
import { EnumValue } from '../core/EnumValues';
import {
  LayeredDigraphDirectionDown, LayeredDigraphDirectionUp,
  LayeredDigraphDirectionLeft, LayeredDigraphDirectionRight,
  LayeredDigraphAggressiveNone, LayeredDigraphAggressiveHorizontal,
  LayeredDigraphAggressiveVertical, LayeredDigraphAggressiveAll,
  LayeredDigraphPackNone, LayeredDigraphPackAll, LayeredDigraphPackExpand,
  LayeredDigraphPackStraighten, LayeredDigraphPackMedian
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

  private _direction: EnumValue = LayeredDigraphDirectionDown;
  private _layerSpacing: number = 50;
  private _columnSpacing: number = 30;
  private _setsPortSpots: boolean = true;
  private _aggressiveOption: EnumValue = LayeredDigraphAggressiveNone;
  private _packOption: EnumValue = LayeredDigraphPackAll;
  private _layeringOption: string = 'longestpathsource';
  private _cycleRemoveOption: string = 'depthfirst';

  get direction(): EnumValue { return this._direction; }
  set direction(val: EnumValue) { this._direction = val; }

  get layerSpacing(): number { return this._layerSpacing; }
  set layerSpacing(val: number) { this._layerSpacing = val; }

  get columnSpacing(): number { return this._columnSpacing; }
  set columnSpacing(val: number) { this._columnSpacing = val; }

  get setsPortSpots(): boolean { return this._setsPortSpots; }
  set setsPortSpots(val: boolean) { this._setsPortSpots = val; }

  get aggressiveOption(): EnumValue { return this._aggressiveOption; }
  set aggressiveOption(val: EnumValue) { this._aggressiveOption = val; }

  get packOption(): EnumValue { return this._packOption; }
  set packOption(val: EnumValue) { this._packOption = val; }

  get layeringOption(): string { return this._layeringOption; }
  set layeringOption(val: string) { this._layeringOption = val; }

  get cycleRemoveOption(): string { return this._cycleRemoveOption; }
  set cycleRemoveOption(val: string) { this._cycleRemoveOption = val; }

  copy(): LayeredDigraphLayout {
    const copy = new LayeredDigraphLayout();
    copy._arrangementOrigin = this._arrangementOrigin.copy();
    copy._direction = this._direction;
    copy._layerSpacing = this._layerSpacing;
    copy._columnSpacing = this._columnSpacing;
    copy._setsPortSpots = this._setsPortSpots;
    copy._aggressiveOption = this._aggressiveOption;
    copy._packOption = this._packOption;
    copy._layeringOption = this._layeringOption;
    copy._cycleRemoveOption = this._cycleRemoveOption;
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
    const isVertical = (this._direction === LayeredDigraphDirectionDown || this._direction === LayeredDigraphDirectionUp);
    const isReversed = (this._direction === LayeredDigraphDirectionUp || this._direction === LayeredDigraphDirectionLeft);

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
   */
  private _positionNodes(layers: LayoutVertex[][]): void {
    for (let l = 0; l < layers.length; l++) {
      const layer = layers[l];
      let totalWidth = 0;
      for (const v of layer) {
        totalWidth += v.width;
      }
      totalWidth += (layer.length - 1) * this._columnSpacing;

      let x = -totalWidth / 2;
      for (let i = 0; i < layer.length; i++) {
        const v = layer[i];
        v.x = x + v.width / 2;
        v.y = l * this._layerSpacing;
        x += v.width + this._columnSpacing;
      }
    }
  }
}
