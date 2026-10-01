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
export class ForceDirectedVertex extends LayoutVertex {
  static readonly className: string = "ForceDirectedVertex";

  private _isFixed: boolean = false;
  private _charge: number = -30;
  private _mass: number = 1;
  private _forceX: number = 0;
  private _forceY: number = 0;

  constructor(network?: ForceDirectedNetwork | null) {
    super();
    if (network !== undefined && network !== null) {
      this.network = network as any;
    }
    // 官方默认：charge -30、mass 1
    if (network && typeof (network as any).defaultElectricalCharge === 'number') {
      this._charge = (network as any).defaultElectricalCharge;
    }
    if (network && typeof (network as any).defaultGravitationalMass === 'number') {
      this._mass = (network as any).defaultGravitationalMass;
    }
  }

  get isFixed(): boolean { return this._isFixed; }
  set isFixed(value: boolean) { this._isFixed = value; }

  get charge(): number { return this._charge; }
  set charge(value: number) { this._charge = value; }

  get mass(): number { return this._mass; }
  set mass(value: number) { this._mass = value; }

  get forceX(): number { return this._forceX; }
  set forceX(value: number) { this._forceX = value; }

  get forceY(): number { return this._forceY; }
  set forceY(value: number) { this._forceY = value; }
}