import { LayoutEdge } from '../layout/LayoutEdge';
import { ForceDirectedNetwork } from './ForceDirectedNetwork';
/**
 * 官方 `ForceDirectedEdge`（go.d.ts: class ForceDirectedEdge extends LayoutEdge）
 *
 * 原来是与 LayoutEdge 无关的空壳（from/to/length/route/stroke…），
 * `ForceDirectedLayout` 与扩展拿到的边没有 `fromVertex`/`toVertex`/`stiffness`。
 */
export declare class ForceDirectedEdge extends LayoutEdge {
    static readonly className: string;
    private _stiffness;
    private _springLength;
    constructor(network?: ForceDirectedNetwork | null);
    get stiffness(): number;
    set stiffness(value: number);
    /** 弹簧的自然长度（官方默认取 network.defaultSpringLength） */
    get springLength(): number;
    set springLength(value: number);
}
