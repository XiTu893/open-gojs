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
