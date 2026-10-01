import { LayoutEdge } from '../layout/LayoutEdge';
import { ForceDirectedNetwork } from './ForceDirectedNetwork';

/**
 * 官方 `ForceDirectedEdge`（go.d.ts: class ForceDirectedEdge extends LayoutEdge）
 *
 * 原来是与 LayoutEdge 无关的空壳（from/to/length/route/stroke…），
 * `ForceDirectedLayout` 与扩展拿到的边没有 `fromVertex`/`toVertex`/`stiffness`。
 */
export class ForceDirectedEdge extends LayoutEdge {
  static readonly className: string = "ForceDirectedEdge";

  private _stiffness: number = 0;
  private _springLength: number = 0;

  constructor(network?: ForceDirectedNetwork | null) {
    super();
    this.length = 0;
    this.weight = 0;
    if (network !== undefined && network !== null) {
      this.network = network as any;
      if (typeof (network as any).defaultSpringLength === 'number') {
        this._springLength = (network as any).defaultSpringLength;
        this.length = this._springLength;
      }
    }
  }

  get stiffness(): number { return this._stiffness; }
  set stiffness(value: number) { this._stiffness = value; }

  /** 弹簧的自然长度（官方默认取 network.defaultSpringLength） */
  get springLength(): number { return this._springLength; }
  set springLength(value: number) { this._springLength = value; }


}