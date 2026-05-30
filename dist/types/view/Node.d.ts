import { Part } from './Part';
import { GraphObject } from './GraphObject';
import { List } from '../core/List';
import { EnumValue } from '../core/EnumValues';
/**
 * Node - a Part that can be connected by Links.
 * Represents a vertex in the graph structure.
 */
export declare class Node extends Part {
    protected _isTreeExpanded: boolean;
    protected _wasTreeExpanded: boolean;
    protected _isSubGraphExpanded: boolean;
    protected _treeExpandedDirection: EnumValue;
    constructor(type?: EnumValue | string, init?: Partial<Node>);
    private static _resolvePanelType;
    get isTreeExpanded(): boolean;
    set isTreeExpanded(val: boolean);
    get wasTreeExpanded(): boolean;
    set wasTreeExpanded(val: boolean);
    /** For compatibility with Group */
    get isSubGraphExpanded(): boolean;
    set isSubGraphExpanded(val: boolean);
    get treeExpandedDirection(): EnumValue;
    set treeExpandedDirection(val: EnumValue);
    get isTreeLeaf(): boolean;
    /** Find all links connected to this node */
    findLinksConnected(): List<any>;
    findLinksInto(): List<any>;
    findLinksOutOf(): List<any>;
    findNodesConnected(): List<any>;
    findNodesInto(): List<any>;
    findNodesOutOf(): List<any>;
    /** Find a port element by name */
    findPortWithName(name: string): GraphObject | null;
    isInTreeOf(node: Node): boolean;
    findTreeParentNode(): Node | null;
    findTreeChildrenNodes(): List<Node>;
    findTreeParentLink(): any | null;
    findLevel(): number;
    findCommonParent(node: Node): Node | null;
    /** Create a copy of this Node */
    copy(): Node;
}
