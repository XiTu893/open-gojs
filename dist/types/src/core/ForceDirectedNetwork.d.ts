import { LayoutNetwork } from '../layout/LayoutNetwork';
import { LayoutEdge } from '../layout/LayoutEdge';
import { LayoutVertex } from '../layout/LayoutVertex';
/**
 * 官方 `ForceDirectedNetwork extends LayoutNetwork`（go.d.ts）
 *
 * 原来 `src/core/ForceDirectedNetwork.ts` 只有 21 行、`nodeArray/linkArray/commentArray`
 * 三个字段，和官方毫无关系；扩展 LinkLabelRouter 里
 * `new go.ForceDirectedNetwork(this)` + `net.addVertex(v)` 因此直接炸掉。
 */
export declare class ForceDirectedNetwork extends LayoutNetwork {
    static readonly className: string;
    /** 官方 ForceDirectedNetwork.defaultSpringLength（默认弹簧长度） */
    defaultSpringLength: number;
    /** 官方 defaultElectricalCharge */
    defaultElectricalCharge: number;
    /** 官方 defaultGravitationalMass */
    defaultGravitationalMass: number;
    /** 官方 defaultCommentSpringLength */
    defaultCommentSpringLength: number;
    /** 官方 defaultCommentElectricalCharge */
    defaultCommentElectricalCharge: number;
    constructor(layout?: any);
    createVertex(): LayoutVertex;
    createEdge(): LayoutEdge;
}
