import { Set } from '../core/Set';
import { List } from '../core/List';
import { Node } from '../view/Node';
import { Part } from '../view/Part';
import { Layout } from './Layout';
import { TreeLayout } from './TreeLayout';
/**
 * DoubleTreeLayout - performs two TreeLayouts in opposite directions,
 * sharing a single root node.
 *
 * The choice of direction for each subtree is determined by the
 * `directionFunction` predicate, which is called on each child node
 * of the root node.
 *
 * Set `vertical` to true for upward/downward growth instead of
 * left/right.
 */
export declare class DoubleTreeLayout extends Layout {
    protected _vertical: boolean;
    protected _directionFunction: (node: Node) => boolean;
    protected _bottomRightOptions: Record<string, any> | null;
    protected _topLeftOptions: Record<string, any> | null;
    constructor();
    /**
     * When false, the layout grows towards the left and towards the right.
     * When true, the layout grows upwards and downwards.
     * Default is false.
     */
    get vertical(): boolean;
    set vertical(val: boolean);
    /**
     * This function is called on each child node of the root node
     * to determine whether the subtree starting from that child node
     * will grow towards larger coordinates (right/down) or smaller ones (left/up).
     * Must return true for positive direction (right/down), false otherwise.
     */
    get directionFunction(): (node: Node) => boolean;
    set directionFunction(val: (node: Node) => boolean);
    /**
     * Options to be applied to the bottom-right TreeLayout.
     * By default null -- no properties are set on the TreeLayout
     * other than the angle, depending on `vertical` and `directionFunction`.
     */
    get bottomRightOptions(): Record<string, any> | null;
    set bottomRightOptions(val: Record<string, any> | null);
    /**
     * Options to be applied to the top-left TreeLayout.
     * By default null -- no properties are set on the TreeLayout
     * other than the angle, depending on `vertical` and `directionFunction`.
     */
    get topLeftOptions(): Record<string, any> | null;
    set topLeftOptions(val: Record<string, any> | null);
    copy(): DoubleTreeLayout;
    /**
     * Perform two TreeLayouts by splitting the collection of Parts
     * into two separate subsets sharing only a single root Node.
     */
    doLayout(coll: any): void;
    /**
     * Create a TreeLayout instance, applying the appropriate options.
     * @param positive - true for growth downward or rightward
     */
    createTreeLayout(positive: boolean): TreeLayout;
    /**
     * Split the collection of Nodes and Links into two Sets,
     * one for the subtrees growing towards the left/up,
     * and one for the subtrees growing towards the right/down.
     */
    separatePartsForLayout(coll: List<Part>, leftParts: Set<Part>, rightParts: Set<Part>): void;
    /**
     * Recursively add all nodes and links in the subtree rooted at `node`
     * to the given set.
     */
    private _addSubtreeParts;
    /**
     * Predicate called on each child node of the root node.
     * Returns true if this child's subtree should grow rightwards/downwards.
     */
    isPositiveDirection(child: Node): boolean;
}
