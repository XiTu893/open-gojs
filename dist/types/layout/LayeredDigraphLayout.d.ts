import { Point } from '../core/Point';
import { EnumValue } from '../core/EnumValues';
import { Layout } from './Layout';
import { LayoutVertex } from './LayoutVertex';
import { LayoutEdge } from './LayoutEdge';
/**
 * LayeredDigraphLayout - implements a Sugiyama-style layered digraph layout.
 * Produces a layered arrangement of nodes with minimized edge crossings.
 */
export declare class LayeredDigraphLayout extends Layout {
    static readonly className: string;
    /** 官方 `LayeredDigraphLayout.constructor(init?)`：`t && Object.assign(this, t)` */
    constructor(init?: any);
    private _direction;
    private _layerSpacing;
    private _columnSpacing;
    private _setsPortSpots;
    private _aggressiveOption;
    private _packOption;
    private _layeringOption;
    private _cycleRemoveOption;
    private _initializeOption;
    private _iterations;
    private _packIterations;
    private _alignOption;
    private _centered;
    private _maxLayer;
    private _maxIndex;
    private _maxColumn;
    private _minIndexLayer;
    private _maxIndexLayer;
    get direction(): number;
    set direction(val: number);
    get layerSpacing(): number;
    set layerSpacing(val: number);
    get columnSpacing(): number;
    set columnSpacing(val: number);
    get setsPortSpots(): boolean;
    set setsPortSpots(val: boolean);
    get aggressiveOption(): EnumValue;
    set aggressiveOption(val: EnumValue);
    get packOption(): EnumValue;
    set packOption(val: EnumValue);
    get layeringOption(): string;
    set layeringOption(val: string);
    get cycleRemoveOption(): string;
    set cycleRemoveOption(val: string);
    get initializeOption(): EnumValue;
    set initializeOption(val: EnumValue);
    get iterations(): number;
    set iterations(val: number);
    get packIterations(): number;
    set packIterations(val: number);
    get alignOption(): EnumValue;
    set alignOption(val: EnumValue);
    get centered(): boolean;
    set centered(val: boolean);
    get maxLayer(): number;
    get maxIndex(): number;
    get maxColumn(): number;
    get minIndexLayer(): number;
    get maxIndexLayer(): number;
    /** 官方 protected linkMinLength(edge)：默认最小长度 1 */
    linkMinLength(edge: LayoutEdge): number;
    /** 官方 protected linkLengthWeight(edge)：默认权重 1 */
    linkLengthWeight(edge: LayoutEdge): number;
    /** 官方 protected linkStraightenWeight(edge)：人工节点权重更高 */
    linkStraightenWeight(edge: LayoutEdge): number;
    /** 层与层之间推进的方向：90/270 为竖直（向下/向上），0/180 为水平（向右/向左） */
    private get _isVertical();
    /** 是否与正方向相反（向上/向左） */
    private get _isReversed();
    /** 官方 protected nodeMinLayerSpace(v, topleft)：焦点前/后沿推进轴预留的空间（各 +10） */
    nodeMinLayerSpace(v: LayoutVertex, topleft: boolean): number;
    /** 官方 protected nodeMinColumnSpace(v, topleft)：焦点前/后沿列轴占用的列数（单位 columnSpacing） */
    nodeMinColumnSpace(v: LayoutVertex, topleft: boolean): number;
    /** 官方 LayoutVertex.node setter：算 focus = locationObject 中心 − bounds 左上 */
    private _applyVertexFocus;
    /** 官方 protected removeCycles()：基于网络移除环 */
    removeCycles(): void;
    /** 官方 protected assignLayers()：按当前 layeringOption 为网络分配层 */
    assignLayers(): void;
    /** 官方 protected initializeIndices()：为各层节点分配索引 */
    initializeIndices(): void;
    /** 官方 countCrossings()：统计当前排列下的交叉数 */
    countCrossings(): number;
    /** 官方 protected reduceCrossings()：减少同层节点间的连线交叉 */
    reduceCrossings(): void;
    /** 官方 protected straightenAndPack()：调整列位置以拉直连线并紧凑排列 */
    straightenAndPack(): void;
    /** 官方 protected commitLayers(layerRects, offset)：默认不做任何事 */
    commitLayers(layerRects: unknown[], offset: Point): void;
    /** 官方 protected commitNodes()：按顶点位置移动各节点 */
    commitNodes(): void;
    /** 官方 protected commitLinks()：更新各连线路由 */
    commitLinks(): void;
    copy(): LayeredDigraphLayout;
    doLayout(coll: any): void;
    /**
     * Remove cycles by reversing back edges in a DFS traversal.
     */
    private _removeCycles;
    /**
     * Assign layers to vertexes using longest path from source.
     */
    private _assignLayers;
    /**
     * Reduce edge crossings using barycenter heuristic.
     */
    private _reduceCrossings;
    /**
     * Reorder a layer based on barycenter of neighbors.
     */
    private _barycenterOrder;
    /**
     * Position nodes within each layer.
     *
     * 移植官方 `LayeredDigraphLayout.commitNodes()` 的坐标生成：
     * 1) 推进轴（direction 决定 x/y）：每层取 `nodeMinLayerSpace(v, before/after)`
     *    的最大值（焦点前/后各 +10），再按 `layerSpacing/2` 两侧累加，
     *    得到该层的「焦点线」——这正是官方层间距 = layerSpacing + 20 的来源。
     * 2) 列轴：层内按 `columnSpacing` 逐个排开，再把该层的**焦点跨度**居中
     *    （`centered=true` 时官方文档原话："aligned in the center of its layer
     *    according to its LayoutVertex.focus"）。
     * 3) 两轴各自归一化到 0，由 doLayout 的 commit 再加 arrangementOrigin。
     */
    private _positionNodes;
    static CycleDepthFirst: EnumValue;
    static CycleGreedy: EnumValue;
    static CycleFromLayers: EnumValue;
    static LayerOptimalLinkLength: EnumValue;
    static LayerLongestPathSink: EnumValue;
    static LayerLongestPathSource: EnumValue;
    static InitDepthFirstOut: EnumValue;
    static InitDepthFirstIn: EnumValue;
    static InitNaive: EnumValue;
    static AggressiveNone: EnumValue;
    static AggressiveLess: EnumValue;
    static AggressiveMore: EnumValue;
    static PackNone: EnumValue;
    static PackExpand: EnumValue;
    static PackStraighten: EnumValue;
    static PackMedian: EnumValue;
    static PackAll: EnumValue;
    static AlignNone: EnumValue;
    static AlignUpperLeft: EnumValue;
    static AlignUpperRight: EnumValue;
    static AlignLowerLeft: EnumValue;
    static AlignLowerRight: EnumValue;
    static AlignAll: EnumValue;
}
