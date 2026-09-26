import { GraphObject } from './GraphObject';
import { Rect } from '../core/Rect';
export declare class Placeholder extends GraphObject {
    private _padding;
    constructor(init?: Placeholder);
    get padding(): number;
    set padding(val: number);
    get _placeholderBounds(): Rect;
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
