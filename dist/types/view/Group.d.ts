import { Node } from './Node';
import { Part } from './Part';
import { Point } from '../core/Point';
import { Set } from '../core/Set';
import type { Placeholder } from './Placeholder';
import { Layout } from '../layout/Layout';
export declare class Group extends Node {
    protected _handlesDragDrop: boolean;
    private _memberParts;
    protected _ungroupable: boolean;
    private _layout;
    private _ga;
    constructor(type?: any, init?: any);
    get handlesDragDrop(): boolean;
    set handlesDragDrop(val: boolean);
    get placeholder(): Placeholder | null;
    get memberParts(): Set<Part>;
    get ungroupable(): boolean;
    set ungroupable(val: boolean);
    get layout(): Layout | null;
    set layout(val: Layout | null);
    /** 官方 Group 的 Ga 标志：diagram 布局前递归组布局将其置位，diagram 布局收集后清除。 */
    get Ga(): boolean;
    set Ga(val: boolean);
    addMembers(collection: any, check?: boolean): boolean;
    removeMembers(collection: any, check?: boolean): boolean;
    move(newLoc: Point, isLocation?: boolean): void;
    copy(): Group;
}
