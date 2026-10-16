import { Link } from '../view/Link';
import { LayoutVertex } from './LayoutVertex';
import { LayoutNetwork } from './LayoutNetwork';

/**
 * LayoutEdge - represents a link in the layout network.
 */
export class LayoutEdge {
  static readonly className: string = "LayoutEdge";
  /** The network this edge belongs to */
  network: LayoutNetwork | null = null;

  /** The source vertex of this edge */
  fromVertex: LayoutVertex | null = null;

  /** The destination vertex of this edge */
  toVertex: LayoutVertex | null = null;

  /** The Link associated with this edge, if any */
  link: Link | null = null;

  /** The preferred length of this edge */
  length: number = NaN;

  /** The weight of this edge for layout calculations */
  weight: number = 1;

  /** 官方 LayeredDigraphEdge.valid：交叉约简/拉直时该边是否参与 */
  valid: boolean = false;

  /** 官方 LayeredDigraphEdge.rev：该边在去环时被反转（from/to 已交换） */
  rev: boolean = false;

  /** 官方 LayeredDigraphEdge.portFromPos：起端口在列轴上的位置（像素） */
  portFromPos: number = 0;

  /** 官方 LayeredDigraphEdge.portToPos：末端口在列轴上的位置（像素） */
  portToPos: number = 0;

  /** 官方 LayeredDigraphEdge.portFromColOffset：起端口相对焦点的列偏移（columnSpacing 单位） */
  portFromColOffset: number = 0;

  /** 官方 LayeredDigraphEdge.portToColOffset：末端口相对焦点的列偏移（columnSpacing 单位） */
  portToColOffset: number = 0;

  /** 官方 GraphLayout.Edge.getOtherVertex */
  getOtherVertex(vertex: LayoutVertex): LayoutVertex | null {
    if (vertex === this.fromVertex) return this.toVertex;
    if (vertex === this.toVertex) return this.fromVertex;
    return null;
  }

  /** 官方 `LayoutEdge.reverseEdge()`：仅交换端点字段（列表同步由 LayoutNetwork.reverseEdge 负责） */
  reverseEdge(): void {
    const t = this.fromVertex;
    this.fromVertex = this.toVertex;
    this.toVertex = t;
  }

  /**
   * 官方 `LayeredDigraphEdge.commit()` → `TreeEdge.commit` → `adjustRouteForAngleChange`。
   * 在正交路由的转角处微调连线路由点。当前为占位（未移植角度调整逻辑），
   * 仅保留调用点以对齐官方 commitLinks 流程。
   */
  commit(): void {
    // 占位：正交转角调整（adjustRouteForAngleChange）后续移植
  }
}
