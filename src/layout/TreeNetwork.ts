import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';
import { LayoutEdge } from './LayoutEdge';
import { TreeVertex } from './TreeVertex';
import { TreeEdge } from './TreeEdge';

/**
 * TreeNetwork - TreeLayout 使用的网络，顶点为 TreeVertex，边为 TreeEdge。
 */
export class TreeNetwork extends LayoutNetwork {
  createVertex(): LayoutVertex {
    return new TreeVertex();
  }

  createEdge(): LayoutEdge {
    return new TreeEdge();
  }
}
