import { LayoutNetwork } from '../layout/LayoutNetwork';
import { LayoutEdge } from '../layout/LayoutEdge';
import { LayoutVertex } from '../layout/LayoutVertex';
import { CircularVertex } from './CircularVertex';
import { CircularEdge } from './CircularEdge';

/** 官方 `CircularNetwork extends LayoutNetwork`（go.d.ts） */
export class CircularNetwork extends LayoutNetwork {
  static readonly className: string = "CircularNetwork";

  constructor(layout?: any) {
    super();
    if (layout !== undefined && layout !== null) {
      this.layout = layout;
    }
  }

  createVertex(): LayoutVertex {
    return new CircularVertex(this);
  }

  createEdge(): LayoutEdge {
    return new CircularEdge(this);
  }
}