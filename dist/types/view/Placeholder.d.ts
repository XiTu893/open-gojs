import { GraphObject } from './GraphObject';
import { Rect } from '../core/Rect';
export declare class Placeholder extends GraphObject {
    static readonly className: string;
    private _padding;
    constructor(init?: Placeholder);
    get padding(): number;
    set padding(val: number);
    get _placeholderBounds(): Rect;
    /**
     * 官方 `Placeholder.computeMemberBounds(result)`：把所属 Group 的可见成员并集写入 `result`（原地修改并返回）。
     * - 跳过不可见成员；Link 仅在 `Group.computesBoundsIncludingLinks` 时计入，且端点为本 Group 的 Link 不计入；
     * - 无有效成员 → `result = (group.location.x, group.location.y, 0, 0)`。
     */
    computeMemberBounds(result: Rect): Rect;
    /**
     * 官方 `Placeholder.computeBorder(result)`：成员并集再按 `margin` 外扩，写入 `result`（原地修改并返回）。
     * - 子图折叠（`!isSubGraphExpanded`）时宽高为 0；
     * - `Group.computesBoundsIncludingLocation` 且 group.location 有效时，把 location 并入边界。
     */
    computeBorder(result: Rect): Rect;
    /**
     * 官方 Placeholder.measure（computeBorder）：
     * 1) union 可见成员的 actualBounds（文档坐标，成员 ab 实值才计入；跳过 Link）；
     * 2) 无成员 union → border = group.location 实值点 (0×0)，否则 (0,0)；
     * 3) padding（number = 四边均匀）外扩；
     * 4) measuredBounds = (0,0,max(borderW,minW),max(borderH,minH))；
     * 5) 有成员 union 且 border x/y 实值 → group.location = border 按 group.locationSpot 锚点。
     */
    _measure(availW: number, availH: number): void;
    _arrange(bounds: Rect): void;
    private _findGroup;
    copy(): Placeholder;
}
