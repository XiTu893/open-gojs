import { LayoutVertex } from '../layout/LayoutVertex';
import type { CircularNetwork } from './CircularNetwork';

/** 官方 `CircularVertex extends LayoutVertex`：多一个 diameter（由 CircularLayout 填） */
export class CircularVertex extends LayoutVertex {
  static readonly className: string = "CircularVertex";

  private _diameter: number = 0;

  constructor(network?: CircularNetwork | null) {
    super();
    if (network !== undefined && network !== null) {
      this.network = network as any;
    }
  }

  get diameter(): number { return this._diameter; }
  set diameter(value: number) { this._diameter = value; }
}