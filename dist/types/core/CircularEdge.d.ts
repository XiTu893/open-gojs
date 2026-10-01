import { LayoutEdge } from '../layout/LayoutEdge';
import type { CircularNetwork } from './CircularNetwork';
/** 官方 `CircularEdge extends LayoutEdge` */
export declare class CircularEdge extends LayoutEdge {
    static readonly className: string;
    constructor(network?: CircularNetwork | null);
}
