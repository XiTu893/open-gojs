import { Point } from '../core/Point';
import { LayoutEdge } from './LayoutEdge';
/**
 * TreeEdge - TreeLayout 专用边（官方 TreeEdge 的移植）。
 * relativePoint（官方 Uk）由布局期间的 recordMidPoints 记录，
 * 供 TreeEdge.commit 的链接路由修正使用。
 */
export declare class TreeEdge extends LayoutEdge {
    /** 官方 Uk — 相对父顶点的中途点 */
    relativePoint: Point;
}
