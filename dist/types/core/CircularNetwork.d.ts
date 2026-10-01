import { LayoutNetwork } from '../layout/LayoutNetwork';
import { LayoutEdge } from '../layout/LayoutEdge';
import { LayoutVertex } from '../layout/LayoutVertex';
/** 官方 `CircularNetwork extends LayoutNetwork`（go.d.ts） */
export declare class CircularNetwork extends LayoutNetwork {
    static readonly className: string;
    constructor(layout?: any);
    createVertex(): LayoutVertex;
    createEdge(): LayoutEdge;
}
