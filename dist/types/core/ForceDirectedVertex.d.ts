import { LayoutVertex } from '../layout/LayoutVertex';
import { ForceDirectedNetwork } from './ForceDirectedNetwork';
/**
 * 官方 `ForceDirectedVertex`（go.d.ts: class ForceDirectedVertex extends LayoutVertex）
 *
 * 以前本文件是一个与 LayoutVertex **毫无关系**的空壳（key/position/mass/charge），
 * 于是 `ForceDirectedLayout.doLayout` 与扩展（LinkLabelRouter 的 `LabelVertex extends
 * go.ForceDirectedVertex`、`new go.ForceDirectedNetwork(this)`、`net.addVertex(v)`）
 * 完全对不上——`net.addVertex is not a function` 就是这么来的。
 */
export declare class ForceDirectedVertex extends LayoutVertex {
    static readonly className: string;
    private _isFixed;
    private _charge;
    private _mass;
    private _forceX;
    private _forceY;
    constructor(network?: ForceDirectedNetwork | null);
    get isFixed(): boolean;
    set isFixed(value: boolean);
    get charge(): number;
    set charge(value: number);
    get mass(): number;
    set mass(value: number);
    get forceX(): number;
    set forceX(value: number);
    get forceY(): number;
    set forceY(value: number);
}
