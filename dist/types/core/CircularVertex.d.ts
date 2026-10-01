import { LayoutVertex } from '../layout/LayoutVertex';
import type { CircularNetwork } from './CircularNetwork';
/** 官方 `CircularVertex extends LayoutVertex`：多一个 diameter（由 CircularLayout 填） */
export declare class CircularVertex extends LayoutVertex {
    static readonly className: string;
    private _diameter;
    constructor(network?: CircularNetwork | null);
    get diameter(): number;
    set diameter(value: number);
}
