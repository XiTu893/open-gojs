import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { List } from '../core/List';
import { Part } from '../view/Part';
import { LayoutNetwork } from './LayoutNetwork';
/**
 * Layout - base class for all layout algorithms.
 * Subclasses must override doLayout() to implement specific layout algorithms.
 */
export declare class Layout {
    protected _arrangementOrigin: Point;
    protected _isInitial: boolean;
    protected _isOngoing: boolean;
    protected _isRealtime: boolean;
    protected _isRouting: boolean;
    protected _isValidLayout: boolean;
    protected _isViewportSized: boolean;
    protected _boundsComputation: ((layout: Layout, part: Part, bounds: Rect) => Rect) | null;
    protected _network: LayoutNetwork | null;
    protected _diagram: any;
    protected _group: any;
    get arrangementOrigin(): Point;
    set arrangementOrigin(val: Point);
    get isInitial(): boolean;
    set isInitial(val: boolean);
    get isOngoing(): boolean;
    set isOngoing(val: boolean);
    get isRealtime(): boolean;
    set isRealtime(val: boolean);
    get isRouting(): boolean;
    set isRouting(val: boolean);
    get isValidLayout(): boolean;
    set isValidLayout(val: boolean);
    get isViewportSized(): boolean;
    set isViewportSized(val: boolean);
    get boundsComputation(): ((layout: Layout, part: Part, bounds: Rect) => Rect) | null;
    set boundsComputation(val: ((layout: Layout, part: Part, bounds: Rect) => Rect) | null);
    get network(): LayoutNetwork | null;
    set network(val: LayoutNetwork | null);
    get diagram(): any;
    set diagram(val: any);
    get group(): any;
    set group(val: any);
    /**
     * Perform the layout on the given collection of parts.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    doLayout(coll: any): void;
    /**
     * Collect all Parts that should be laid out from the given collection.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    collectParts(coll: any): List<Part>;
    /**
     * Commit the layout by moving parts to their computed positions.
     * Called after the layout algorithm has computed positions.
     */
    commitLayout(): void;
    /**
     * Create a copy of this layout.
     */
    copy(): Layout;
    /**
     * Create a new LayoutNetwork for this layout.
     */
    createNetwork(): LayoutNetwork;
    /**
     * Get the layout bounds of a part.
     * @param part - The part to get bounds for
     */
    getLayoutBounds(part: Part): Rect;
    /**
     * Return the initial origin point for the layout.
     */
    initialOrigin(): Point;
    /**
     * Invalidate this layout, causing it to be re-performed.
     */
    invalidateLayout(): void;
    /**
     * Build a LayoutNetwork from the parts in the given collection.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    makeNetwork(coll: any): LayoutNetwork;
    /**
     * Update the positions of parts after the layout has been computed.
     */
    updateParts(): void;
}
