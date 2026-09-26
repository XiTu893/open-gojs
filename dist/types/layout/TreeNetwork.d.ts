import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';
import { LayoutEdge } from './LayoutEdge';
/**
 * TreeNetwork - TreeLayout 使用的网络，顶点为 TreeVertex，边为 TreeEdge。
 */
export declare class TreeNetwork extends LayoutNetwork {
    createVertex(): LayoutVertex;
    createEdge(): LayoutEdge;
}
