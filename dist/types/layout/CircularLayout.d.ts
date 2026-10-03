import { Point } from '../core/Point';
import { EnumValue } from '../core/EnumValues';
import { Layout } from './Layout';
/**
 * CircularLayout - arranges nodes in a circle or circular pattern.
 */
export declare class CircularLayout extends Layout {
    static readonly className: string;
    /** 官方 `CircularLayout.constructor(init?)`：`t && Object.assign(this, t)` */
    constructor(init?: any);
    private _radius;
    private _startAngle;
    private _sweepAngle;
    private _arrangement;
    private _spacing;
    private _direction;
    private _aspectRatio;
    private _actualXRadius;
    private _actualYRadius;
    private _sorting;
    private _comparer;
    private _nodeDiameterFormula;
    private _actualSpacing;
    /** 最近一次布局产生的子网络（splitIntoSubNetworks 会把顶点搬进去，
     *  主网络 vertexes 因此变空，commitNodes/commitLinks 需要遍历它们）。 */
    private _lastSubNetworks;
    private _actualCenter;
    get radius(): number;
    set radius(val: number);
    get startAngle(): number;
    set startAngle(val: number);
    get sweepAngle(): number;
    set sweepAngle(val: number);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue | number);
    get spacing(): number;
    set spacing(val: number);
    get direction(): EnumValue;
    set direction(val: EnumValue | number);
    get aspectRatio(): number;
    set aspectRatio(val: number);
    get actualXRadius(): number;
    get actualYRadius(): number;
    get sorting(): EnumValue;
    set sorting(val: EnumValue | number);
    get comparer(): ((a: any, b: any) => number) | null;
    set comparer(val: ((a: any, b: any) => number) | null);
    get nodeDiameterFormula(): EnumValue;
    set nodeDiameterFormula(val: EnumValue | number);
    get actualSpacing(): number;
    get actualCenter(): Point;
    /**
     * 官方 4.0 的这些枚举是**数字**（go.d.ts: CircularArrangement 0..3、CircularDirection 10..13、
     * CircularSorting 20..24、CircularNodeDiameterFormula 30..31），官方样例也是直接写数字或
     * go.CircularArrangement.Packed。本项目内部用 EnumValue 对象，所以要把两边都接受。
     */
    private _enum;
    copy(): CircularLayout;
    doLayout(coll: any): void;
    /**
     * Layout a single connected component in a circle.
     */
    private _layoutComponent;
    /**
     * Compute an appropriate radius based on the vertex sizes and spacing.
     */
    /** 官方 nodeDiameterFormula：默认 Pythagorean = sqrt(w²+h²)，Circular 取较长边 */
    private _effectiveDiameter;
    /**
     * 官方 Qk(...)：周长 / 2π。
     * ConstantSpacing/Packed 用 Σ有效直径 + 间隙数×spacing（间隙数在整圈时等于节点数），
     * 这与官方对 4 个 25px 节点给出的 r=26.33 完全一致。
     */
    private _computeRadius;
    /** 官方 `v4` case 24：`J4($4(t))`。 */
    private _optimizedOrder;
    /**
     * 官方 `$4(t)`：最大基数贪心取点，返回选中的**下标**序列。
     * 首个取 edgesCount 最大者；此后取「已选中顶点的邻居计数」最大者（并列取下标最小者）。
     * 选中后标记 -1（不再参与选择），并给尚未选中的邻居计数 +1。
     * 无边网络所有计数恒 0、-1 挡住已选者 → 严格大于比较下退化为**原顺序**
     * （arrowheads 样例 40 个孤立顶点即此情形，官方实测也是原序）。
     */
    private _mcs4;
    /**
     * 官方 `J4(t)`：按「插入后交叉数最小」把顶点排成链（t 是 $4 输出的顶点序，以下标操作）。
     * 度=0 的顶点直接按原序入结果；度=1 的顶点挂链后补插；度≥2 的顶点在链上按候选位置
     * 的 Z4 交叉计数 + 圆周距离平局裁决胜出后插入。无边网络 → 全部度=0 → 恒等输出。
     */
    private _j4;
    /**
     * 官方 `Z4(t, i, e, s, n, o)`：候选顶点插入链位置 n 时与**已成链的边**产生的交叉数。
     * t=候选的邻接下标；i/o=已记录边的两端（顶点下标）；s=位置数组（顶点下标→链位置）；
     * n=候选链位置；o=链（顶点下标数组）。跨过候选位置的边看「链上邻点在区间外」，
     * 不跨的边看「链上邻点在区间内」，逐个累加。
     */
    private _z4;
    commitNodes(): void;
    /** 提交时要遍历的网络：有子网络就遍历子网络，否则遍历主网络 */
    private _commitNetworks;
    commitLinks(): void;
    static ConstantSpacing: EnumValue;
    static ConstantDistance: EnumValue;
    static ConstantAngle: EnumValue;
    static Packed: EnumValue;
    static Clockwise: EnumValue;
    static Counterclockwise: EnumValue;
    static BidirectionalLeft: EnumValue;
    static BidirectionalRight: EnumValue;
    static Forwards: EnumValue;
    static Reverse: EnumValue;
    static Ascending: EnumValue;
    static Descending: EnumValue;
    static Optimized: EnumValue;
    static Pythagorean: EnumValue;
    static Circular: EnumValue;
}
