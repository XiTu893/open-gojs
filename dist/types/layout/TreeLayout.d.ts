import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Set } from '../core/Set';
import { EnumValue } from '../core/EnumValues';
import { Spot } from '../core/Spot';
import { Layout } from './Layout';
import { LayoutNetwork } from './LayoutNetwork';
import { TreeVertex } from './TreeVertex';
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
export declare class TreeLayout extends Layout {
    private _roots;
    private _path;
    private _treeStyle;
    private _layerStyle;
    private _comments;
    private _arrangement;
    private _arrangementSpacing;
    private _rootDefaults;
    private _alternateDefaults;
    private _Ms;
    private _layerSizes;
    private _pool;
    constructor(init?: any);
    get roots(): Set<TreeVertex>;
    set roots(val: Set<TreeVertex>);
    get path(): EnumValue;
    set path(val: EnumValue);
    get treeStyle(): EnumValue;
    set treeStyle(val: EnumValue);
    get layerStyle(): EnumValue;
    set layerStyle(val: EnumValue);
    get comments(): boolean;
    set comments(val: boolean);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue);
    get arrangementSpacing(): Size;
    set arrangementSpacing(val: Size);
    get rootDefaults(): TreeVertex;
    set rootDefaults(val: TreeVertex);
    get alternateDefaults(): TreeVertex;
    set alternateDefaults(val: TreeVertex);
    get angle(): number;
    set angle(val: number);
    get alignment(): EnumValue;
    set alignment(val: EnumValue);
    get sorting(): EnumValue;
    set sorting(val: EnumValue);
    get comparer(): (a: TreeVertex, b: TreeVertex) => number;
    set comparer(val: (a: TreeVertex, b: TreeVertex) => number);
    get nodeIndent(): number;
    set nodeIndent(val: number);
    get nodeIndentPastParent(): number;
    set nodeIndentPastParent(val: number);
    get nodeSpacing(): number;
    set nodeSpacing(val: number);
    get layerSpacing(): number;
    set layerSpacing(val: number);
    get layerSpacingParentOverlap(): number;
    set layerSpacingParentOverlap(val: number);
    get compaction(): EnumValue;
    set compaction(val: EnumValue);
    get breadthLimit(): number;
    set breadthLimit(val: number);
    get rowSpacing(): number;
    set rowSpacing(val: number);
    get rowIndent(): number;
    set rowIndent(val: number);
    get commentSpacing(): number;
    set commentSpacing(val: number);
    get commentMargin(): number;
    set commentMargin(val: number);
    get setsPortSpot(): boolean;
    set setsPortSpot(val: boolean);
    get portSpot(): Spot;
    set portSpot(val: Spot);
    get setsChildPortSpot(): boolean;
    set setsChildPortSpot(val: boolean);
    get childPortSpot(): Spot;
    set childPortSpot(val: Spot);
    get alternateAngle(): number;
    set alternateAngle(val: number);
    get alternateAlignment(): EnumValue;
    set alternateAlignment(val: EnumValue);
    get alternateSorting(): EnumValue;
    set alternateSorting(val: EnumValue);
    get alternateNodeIndent(): number;
    set alternateNodeIndent(val: number);
    get alternateNodeIndentPastParent(): number;
    set alternateNodeIndentPastParent(val: number);
    get alternateNodeSpacing(): number;
    set alternateNodeSpacing(val: number);
    get alternateLayerSpacing(): number;
    set alternateLayerSpacing(val: number);
    get alternateLayerSpacingParentOverlap(): number;
    set alternateLayerSpacingParentOverlap(val: number);
    get alternateCompaction(): EnumValue;
    set alternateCompaction(val: EnumValue);
    get alternateBreadthLimit(): number;
    set alternateBreadthLimit(val: number);
    get alternateRowSpacing(): number;
    set alternateRowSpacing(val: number);
    get alternateRowIndent(): number;
    set alternateRowIndent(val: number);
    static PathDefault: EnumValue;
    static PathDestination: EnumValue;
    static PathSource: EnumValue;
    static SortingForwards: EnumValue;
    static SortingReverse: EnumValue;
    static SortingAscending: EnumValue;
    static SortingDescending: EnumValue;
    static AlignmentCenterSubtrees: EnumValue;
    static AlignmentCenterChildren: EnumValue;
    static AlignmentStart: EnumValue;
    static AlignmentEnd: EnumValue;
    static AlignmentBus: EnumValue;
    static AlignmentBusBranching: EnumValue;
    static AlignmentTopLeftBus: EnumValue;
    static AlignmentBottomRightBus: EnumValue;
    static CompactionNone: EnumValue;
    static CompactionBlock: EnumValue;
    static StyleLayered: EnumValue;
    static StyleLastParents: EnumValue;
    static StyleAlternating: EnumValue;
    static StyleRootOnly: EnumValue;
    static ArrangementVertical: EnumValue;
    static ArrangementHorizontal: EnumValue;
    static ArrangementFixedRoots: EnumValue;
    static LayerIndividual: EnumValue;
    static LayerSiblings: EnumValue;
    static LayerUniform: EnumValue;
    copy(): TreeLayout;
    createNetwork(): LayoutNetwork;
    /** 官方 TreeLayout.makeNetwork — 排除 Comment/linkLabel，过滤非法链接 */
    makeNetwork(coll: any): LayoutNetwork;
    doLayout(coll: any): void;
    private _allVertexes;
    private _uninitialized;
    private _initTrees;
    /** 官方 findRoots */
    private _findRoots;
    /** 官方 dI — 选连接最少的顶点作根 */
    private _pickRoot;
    /** 官方 walkTree (tT) */
    private _walkTree;
    /** 官方 walkOK (gI) */
    private _walkOK;
    /** 官方 isAncestor (vB) — a 是否为 b 的祖先 */
    private _isAncestor;
    /** 官方 removeChild (WB) */
    private _removeChild;
    private _initializeCounts;
    private _initializeTree;
    /** 官方 mom (jB) — 按 treeStyle 选择继承来源顶点 */
    private _mom;
    private _initializeTreeVertexValues;
    private _assignTreeValues;
    private _assignTree;
    private _sortTrees;
    private _sortTree;
    private _sortTreeChildren;
    private _addCommentsAll;
    /** 官方 isBusAlignment */
    isBusAlignment(a: EnumValue): boolean;
    /** 官方 vw — 是否 Bus/BusBranching */
    private _isBusBranching;
    /** 官方 iT — isLeftSideBus */
    private _isLeftSideBus;
    private _addComments;
    private _layoutTreeReal;
    private _layoutTree;
    /** 官方 orthoAngle */
    orthoAngle(v: TreeVertex): number;
    /** 官方 computeLayerSpacing */
    computeLayerSpacing(v: TreeVertex): number;
    /** 官方 computeNodeIndent */
    computeNodeIndent(v: TreeVertex): number;
    /** 官方 computeBusNodeSpacing */
    private _computeBusNodeSpacing;
    /** 官方 computeBusLastRowSpacing */
    private _computeBusLastRowSpacing;
    /** 官方 ke — 分配点数组 */
    private _ke;
    /** 官方 bn — 回收点数组 */
    private _bn;
    /** 官方 recordMidPoints (Ik) */
    private _recordMidPoints;
    /** 官方 shiftRelPos (Iu) */
    private _shiftRelPos;
    /** 官方 nT — 按 alignment 拆分偏移 */
    private _alignOffset;
    /** 官方 Bc — shiftRelPosAlign */
    private _shiftRelPosAlign;
    /** 官方 Ek — 平移点数组 */
    private _shiftPoints;
    /** 官方 calculateSubwidth (eT) */
    private _calculateSubwidth;
    /** 官方 calculateSubheight (sT) */
    private _calculateSubheight;
    /** 官方 customAlignment — 子类可覆盖 */
    protected customAlignment(_v: TreeVertex, dx: number, dy: number, w: number, h: number): number[];
    /** 官方 tV — merge fringes（垂直方向推进） */
    private _mergeFringesX;
    /** 官方 ZB */
    private _mergeFringesY;
    /** 官方 iV */
    private _mergeFringesX2;
    /** 官方 QB */
    private _mergeFringesY2;
    /** 官方 _B — minimum separation (x-fringes) */
    private _minSepX;
    /** 官方 $B — minimum separation (y-fringes) */
    private _minSepY;
    /** 官方 mergeFringes (SI) — 合并父/子边线并返回子顶点的新块位置 */
    private _mergeFringes;
    /** 官方 layoutBusChildrenPosDir (xI) */
    private _layoutBusChildrenPosDir;
    /** 官方 layoutBusChildrenNegDir (bI) */
    private _layoutBusChildrenNegDir;
    /** 官方 fixRelativePostions (Ok) */
    private _fixRelativePositions;
    private _layoutTreeNone;
    private _layoutTreeBlock;
    arrangeTrees(): void;
    /** 官方 oT — 递归赋绝对坐标（官方 vertex.x/y 即 bounds.x/y） */
    private _assignAbsolutePositions;
    commitLayout(): void;
    private _commitNodes;
    private _commitLinks;
    /** 官方 QA — Uniform 层矩形 */
    private _commitLayerRects;
    /** 官方 commitLayers — 子类可覆盖 */
    protected commitLayers(_rects: Rect[], _offset: Point): void;
    /** 官方 Vw — 遍历所有根设置端口 Spot */
    private _setPortSpotsAll;
    /** 官方 kI — 递归设置端口 Spot */
    private _setPortSpotsTree;
    /** 官方 setPortSpots */
    setPortSpots(v: TreeVertex): void;
    /** 官方 setPortSpots 中 portSpot 的默认取值 */
    private _defaultPortSpot;
    /** 官方 setPortSpots 中 childPortSpot 的默认取值 */
    private _defaultChildPortSpot;
    /** 官方 eV — setPortSpotsBus */
    private _setPortSpotsBus;
    /** 官方 layoutComments — 摆放 Comment 节点 */
    layoutComments(v: TreeVertex): void;
    /** 官方 layoutComments 内联的 Comment 链接 Spot 设置 */
    private _setCommentLinkSpots;
}
