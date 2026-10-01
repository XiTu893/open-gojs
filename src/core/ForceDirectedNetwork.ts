import { LayoutNetwork } from '../layout/LayoutNetwork';
import { LayoutEdge } from '../layout/LayoutEdge';
import { LayoutVertex } from '../layout/LayoutVertex';
import { ForceDirectedVertex } from './ForceDirectedVertex';
import { ForceDirectedEdge } from './ForceDirectedEdge';

/**
 * 官方 `ForceDirectedNetwork extends LayoutNetwork`（go.d.ts）
 *
 * 原来 `src/core/ForceDirectedNetwork.ts` 只有 21 行、`nodeArray/linkArray/commentArray`
 * 三个字段，和官方毫无关系；扩展 LinkLabelRouter 里
 * `new go.ForceDirectedNetwork(this)` + `net.addVertex(v)` 因此直接炸掉。
 */
export class ForceDirectedNetwork extends LayoutNetwork {
  static readonly className: string = "ForceDirectedNetwork";

  /** 官方 ForceDirectedNetwork.defaultSpringLength（默认弹簧长度） */
  defaultSpringLength: number = 50;
  /** 官方 defaultElectricalCharge */
  defaultElectricalCharge: number = -30;
  /** 官方 defaultGravitationalMass */
  defaultGravitationalMass: number = 1;
  /** 官方 defaultCommentSpringLength */
  defaultCommentSpringLength: number = 10;
  /** 官方 defaultCommentElectricalCharge */
  defaultCommentElectricalCharge: number = 0;

  constructor(layout?: any) {
    super();
    if (layout !== undefined && layout !== null) {
      this.layout = layout;
      // 从布局上取默认值（官方 ForceDirectedLayout.doLayout 会先 set 好这些值）
      if (typeof layout.defaultSpringLength === 'number') this.defaultSpringLength = layout.defaultSpringLength;
      if (typeof layout.defaultElectricalCharge === 'number') this.defaultElectricalCharge = layout.defaultElectricalCharge;
      if (typeof layout.defaultGravitationalMass === 'number') this.defaultGravitationalMass = layout.defaultGravitationalMass;
      if (typeof layout.defaultCommentSpringLength === 'number') this.defaultCommentSpringLength = layout.defaultCommentSpringLength;
      if (typeof layout.defaultCommentElectricalCharge === 'number') this.defaultCommentElectricalCharge = layout.defaultCommentElectricalCharge;
    }
  }

  createVertex(): LayoutVertex {
    return new ForceDirectedVertex(this);
  }

  createEdge(): LayoutEdge {
    return new ForceDirectedEdge(this);
  }
}