import { LayoutEdge } from '../layout/LayoutEdge';
import type { CircularNetwork } from './CircularNetwork';

/** 官方 `CircularEdge extends LayoutEdge` */
export class CircularEdge extends LayoutEdge {
  static readonly className: string = "CircularEdge";

  constructor(network?: CircularNetwork | null) {
    super();
    if (network !== undefined && network !== null) {
      this.network = network as any;
    }
  }
}