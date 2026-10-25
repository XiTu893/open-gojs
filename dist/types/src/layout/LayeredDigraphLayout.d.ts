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
    private _minIndexLayer;
    private _maxIndexLayer;
    /** OptimalLinkLength 归并时缓存的顶点表 */
    private _netVertexes;
    /** 官方 ot：最大层号 */
    private _ot;
    /** 官方 Wt：最大列号 */
    private _Wt;
    /** 官方 `xn`：componentPack 的分量计数 */
    private _xn;
    /** 官方 ci：各层顶点数 */
    private _ci;
    /** 官方 Lu：层表 Lu[layer][index] = vertex */
    private _Lu;
    /** 官方 js：顶点数最多的层号 */
    private _js;
    /** 官方 cm：顶点数最少的层号 */
    private _cm;
    /** 官方 zw：最大层内序号-1 */
    private _zw;
    /** 官方 $n：层表临时数组池 */
    private _dollarN;
    /** 官方 um：he/ds 快照缓冲 */
    private _um;
    /** 官方 pk：交叉矩阵缓冲 */
    private _pk;
    /** 官方 Zn：alignOption 位（默认 AlignAll=15，控制 MB 四向打包） */
    private _alignBits;
    /** 官方 jA：列轴总跨度（commitNodes 写入） */
    private _jA;
    /** 官方 kr：列轴打包启用时的原点偏移 */
    private _kr;
    /** 官方 Js：各层前沿空间（commitNodes） */
    private _Js;
    /** 官方 Ss：各层后沿空间（commitNodes） */
    private _Ss;
    /** 官方 ks：各层推进轴起点（commitNodes） */
    private _ks;
    /** 官方 Yt：各层推进轴终点（commitNodes） */
    private _Yt;
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
     * 官方 `LayeredDigraphLayout.setPortSpots` 等价逻辑（`Sk(isFrom)`）：
     * 依据 direction 决定连线两端的端口点，非反向时为 MiddleRight/MiddleLeft。
     */
    private _portSpotFor;
    /**
     * Remove cycles by reversing back edges in a DFS traversal.
     */
    private _removeCycles;
    /**
     * Assign layers to vertexes using longest path from source.
     */
    private _assignLayers;
    /** 官方 `jv/Wv`：LongestPathSink。layer(v) = max over 出边 (layer(to) + linkMinLength) */
    private _networkMaxSrcLayerSpan;
    /** 官方 `cU/Jv`：LongestPathSource。layer(v) = max over 入边 (layer(from) + linkMinLength)（源=0） */
    private _networkMaxDestLayerSpan;
    /** 官方 `fU/$v/uU/dU/Ew`：OptimalLinkLength。先 LongestPathSink，再从源做组归并/双向收缩 */
    private _networkMinimizeLinkLength;
    /** 对不在任何源紧边分量中的节点，尝试上移以减小总边长（对标 Dagre network-simplex） */
    private _nlvPullUpIsolated;
    /** 官方 `$v(t)`：DFS 到所有汇，逐个做 uU(t)/dU(t) 归并 */
    private _nlvVisited;
    /** 官方 `uU(t)`：把 t 的「紧边连通分量」整体上移（减 layer），使所有边达到最小长度 */
    private _nlvMoveUp;
    /** 官方 `dU(t)`：把 t 的紧边分量整体下移（加 layer） */
    private _nlvMoveDown;
    /** 官方 `Ew(t,e,i,s,n)`：从 t 沿「紧边」（层差==最小长度）传播，把可达点并入分量 e */
    private _nlvEw;
    /** 官方 `nB()`：布局运行时状态复位（lu/zw/cm/js 等） */
    private _nB;
    /** 官方 `initializeIndices()`：按 Nu 选索引初始化器（20=DFO→kB，21=DFI→PB，22/默认→SB） */
    private _initializeIndices;
    /** 官方 `SB()`：naive 索引初始化 —— 按近邻分组后顺序赋 index */
    private _SB;
    /** 官方 `kB()`：DepthFirstOut 索引初始化 —— 从高层向低层递归 */
    private _kB;
    /** 官方 `oI(t,i)`：DFS 出边（按 portFromColOffset 排序）赋 index */
    private _oI;
    /** 官方 `PB()`：DepthFirstIn 索引初始化 —— 从低层向高层递归 */
    private _PB;
    /** 官方 `rI(t,i)`：DFS 入边（按 portToColOffset 排序）赋 index */
    private _rI;
    /** 官方 `lB()`：索引初始化 + 层表 Lu */
    private _initLayerIndexes;
    /** 官方 `hB()`：列初始化 —— 层内按 nodeMinColumnSpace 排开，算 Wt */
    private _initColumns;
    /** 官方 `ha(t)`：取/建 层 t 的顶点表（按 index），带池化复用 */
    private _ha;
    /** 官方 `aa(t,i)`：把顶点表放回池 */
    private _aa;
    /** 官方 `Xw()`：列归一化 —— 减去最小（列-minColSpace），更新 Wt */
    private _Xw;
    /** 官方 `he()`：把全部顶点的 (column,index) 快照进 um（Int16 对） */
    private _he;
    /** 官方 `ds(t)`：从快照恢复 column+index */
    private _ds;
    /** 官方 `countCrossings()`：对每层求交叉矩阵并累加三角和 */
    private _countCrossings;
    /** 官方 `Yw(t,i)`：各顶点的邻域重心（i<=0 用入边，i>=0 用出边） */
    private _barycenters;
    /** 官方 `$R(t,i)`：各顶点的邻域中位数（带端口偏移） */
    private _medians;
    /** 官方 `JR(t,i)`：交叉矩阵（i>=0 用出边、i<=0 用入边；i=1 只算出边） */
    private _crossingMatrix;
    /** 官方 `kk(t,i)`：中位数-重心交叉约简 —— 按 (median,barycenter) 排一层 */
    private _medianBarycenter;
    /** 官方 `Ps(t,i,e,s)`：贪心相邻交换交叉约简（评估交叉/拉直/中位/重心代价） */
    private _crossingReduction;
    /** 官方 `reduceCrossings()`：多轮 median/barycenter + 贪心交换 + aggressive 局部精化 */
    private _reduceCrossingsOfficial;
    /** 官方 aggressiveOption 的数值（30=None，31=Less，32=More） */
    private _aggressiveNum;
    /** 官方 packOption 的数值（位标志：1=Expand,2=Straighten,4=Median，15=All） */
    private _packNum;
    /** 官方 alignOption 的数值（位标志：1=UL,2=UR,4=LL,8=LR，15=All） */
    private _alignNum;
    /** 官方 `rB()`：网络细化 —— 算端口位置、把跨层>1的长边拆成人工顶点链 */
    private _refineNetwork;
    /** 官方 `xB(t)`：算端口方向位（bit0=起、bit1=止） */
    private _xB;
    /** 官方 `sI(t,i)`：基准方向角 */
    private _sI;
    /** 官方 `bB(t,i)`：沿有效非反转入边回溯到 t，返回对齐链 */
    private _bB;
    /** 官方 `nI(t,i)`：递归找 t（DFS 入边） */
    private _nI;
    /** 官方 `straightenAndPack()`：Zn!==0 时走 MB 四向打包 */
    private _straightenAndPack;
    /** 官方 `dm(t,i)`：bendStraighten 单层 */
    private _bendStraighten;
    /** 官方 `CB(t,i)`：shiftbendStraighten 单层 */
    private _shiftBendStraighten;
    /** 官方 `ZA(t,i)`：medianStraighten 单层 */
    private _medianStraighten;
    /** 官方 `NB()`：packAux 全列扫描 */
    private _packAux;
    /** 官方 `AB(t,i)`：packAux 单列 */
    private _packAuxCol;
    /** 官方 `TB()`：tightPackAux 全列扫描 */
    private _tightPack;
    /** 官方 `LB(t,i)`：tightPackAux 单列 */
    private _tightPackCol;
    /** 官方 `lI(t)`：componentPack —— 分量打包 */
    private _componentPack;
    /** 官方 `hI(t,i)`：componentShift —— 把跨过列 t 的分量整体平移 */
    private _componentShift;
    /** 官方 `JA(t,i,e,s,n)`：连通分量 DFS */
    private _JA;
    /** 官方 `xk(t)`：componentPack 用的代价度量 */
    private _xk;
    /** 官方 `MB()`：四向打包 —— 各方向 Pl/Pk 求 Se，FB 对齐，取中位 */
    private _MB;
    /** 官方 `DB(t,i)`：收集需要拉直的边到集合 */
    private _DB;
    /** 官方 `RB(t)`：是否为「人工→人工」链首 */
    private _RB;
    /** 官方 `Pl(t,i,e)`：按近邻链（Qn/Ec 环）串联 */
    private _Pl;
    /** 官方 `IB(t)`：初始化各顶点的环链（Ec=Qn=自身）与层内位置 */
    private _IB;
    /** 官方 `Pk(t,i,e)`：单向打包 —— OB 端口、cI 递推 Fu/Se、回写列轴位置 */
    private _Pk;
    /** 官方 `OB(t,i,e)`：沿环链累加端口偏移 _n（归一到 min=0） */
    private _OB;
    /** 官方 `cI(t,i)`：递推组内 Se（相对前一顶点） */
    private _cI;
    /** 官方 `fI(t,i)`：层内前一顶点 */
    private _fI;
    /** 官方 `FB(...)`：四向结果对齐 —— 取最佳方向并平移其余 */
    private _FB;
    /** 官方 `EB(t,i,e,s)`：单向 min/max 跨度 */
    private _EB;
    /** 官方 `commitNodes()`（LD 覆写）：推进轴 ks/Yt + 列轴 column*le + Se 覆盖 + 归一 */
    private _commitNodesOfficial;
    /** 官方 `setPortSpots`（Vw）：按 direction 设两端端口点 */
    private _commitSetPortSpots;
    /**
     * 官方 `commitLinks()`（LD 覆写）：沿人工顶点链生成多点折线路由。
     * 三阶段：①清空旧路由 ②updateRoute 重建基础路由 ③沿 dummy 链插点。
     */
    private _commitLinksOfficial;
    /** 官方 `nB()`：运行时状态复位（占位，_nB 已实现） */
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
