import { Node } from './Node';
import { Part } from './Part';
import { Point } from '../core/Point';
import { Set } from '../core/Set';
import type { Placeholder } from './Placeholder';
import type { Layout } from '../layout/Layout';
export declare class Group extends Node {
    protected _handlesDragDrop: boolean;
    private _memberParts;
    protected _ungroupable: boolean;
    private _layout;
    constructor(type?: any, init?: Partial<Group>);
    get handlesDragDrop(): boolean;
    set handlesDragDrop(val: boolean);
    get placeholder(): Placeholder | null;
    get memberParts(): Set<Part>;
    get ungroupable(): boolean;
    set ungroupable(val: boolean);
    get layout(): Layout | null;
    set layout(val: Layout | null);
    addMembers(collection: any, check?: boolean): boolean;
    removeMembers(collection: any, check?: boolean): boolean;
    move(newLoc: Point): void;
    copy(): Group;
}
