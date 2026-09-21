import { Point } from '../core/Point';
import { Set } from '../core/Set';
import { Link } from '../view/Link';
import { Diagram } from '../diagram/Diagram';
import { Group } from '../view/Group';
/**
 * AvoidsLinksRouter - a Router that adjusts orthogonal link routes to avoid
 * overlapping with nodes in the diagram.
 *
 * This is a simplified implementation of the GoJS AvoidsLinksRouter extension.
 * The full GoJS AvoidsLinksRouter separates overlapping parallel link segments;
 * this implementation focuses on adjusting link segments that intersect with nodes.
 *
 * Typical setup:
 *   myDiagram.routers.add(new AvoidsLinksRouter());
 */
export declare class AvoidsLinksRouter {
    private _isEnabled;
    private _isRealtime;
    private _name;
    private _diagram;
    private _avoidsNodes;
    private _epsilonDistance;
    private _ignoreContainingGroups;
    private _iterations;
    private _linkSpacing;
    private _avoidablePadding;
    private _isRunning;
    constructor(init?: Partial<AvoidsLinksRouter>);
    /** Whether this router is enabled. Default is true. */
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    /** Whether this router operates in realtime. Default is true. */
    get isRealtime(): boolean;
    set isRealtime(val: boolean);
    /** The name of this router. Default is 'AvoidsLinksRouter'. */
    get name(): string;
    set name(val: string);
    /** The diagram this router is associated with. */
    get diagram(): Diagram | null;
    set diagram(val: Diagram | null);
    /** Whether the router is currently running. */
    get isRunning(): boolean;
    /**
     * Whether the router should reduce spacing between separated links to avoid
     * overlap with nearby nodes. If false, all separated links will have a distance
     * of exactly linkSpacing, even if this causes them to cross over a nearby node.
     * Default is true.
     */
    get avoidsNodes(): boolean;
    set avoidsNodes(val: boolean);
    /**
     * The minimum distance between links for them to be considered "overlapping"
     * and be separated by AvoidsLinksRouter. Should be a small fraction of linkSpacing.
     * Default is 0.5.
     */
    get epsilonDistance(): number;
    set epsilonDistance(val: number);
    /**
     * Whether the router will run only once on the top-level Diagram, considering
     * all links regardless of their containing group.
     * If false, the router will separately route the top-level links against links
     * in each Group. Default is false.
     */
    get ignoreContainingGroups(): boolean;
    set ignoreContainingGroups(val: boolean);
    /**
     * The number of times the router will run iteratively.
     * In the vast majority of cases, one iteration should be enough.
     * Default is 1.
     */
    get iterations(): number;
    set iterations(val: number);
    /**
     * The desired distance between links that are separated by AvoidsLinksRouter.
     * If avoidsNodes is true, this value is the maximum allowed distance.
     * Default is 4.
     */
    get linkSpacing(): number;
    set linkSpacing(val: number);
    /**
     * Padding around nodes to avoid when checking intersections.
     * Default is 10.
     */
    get avoidablePadding(): number;
    set avoidablePadding(val: number);
    /**
     * Determine whether the AvoidsLinksRouter should operate on a given container.
     * See ignoreContainingGroups for the default behavior.
     * @param container - A Diagram or a Group
     */
    canRoute(container: Diagram | Group): boolean;
    /**
     * Check whether a given link is routable by this router.
     * Returns false for links that are not orthogonal.
     * @param link - The link to check
     * @param container - The Diagram or Group container
     */
    isRoutable(link: Link, container: Diagram | Group): boolean;
    /**
     * Main routing method that adjusts orthogonal link routes to avoid nodes.
     * This is the primary entry point called by the diagram's routing system.
     * @param links - Set of links to route
     * @param container - The Diagram or Group container
     */
    routeLinks(links: Set<Link>, container: Diagram | Group): void;
    /**
     * Convenience method to route all avoids-links in the diagram.
     * @param diagram - The diagram to route links in
     */
    routeAvoidsLinks(diagram: Diagram): void;
    /**
     * Find a route for a single link that avoids nodes.
     * This method checks each segment of the link for intersections with nodes
     * and adjusts the route by adding waypoints to go around intersecting nodes.
     *
     * @param link - The link to route
     * @param fromPt - The starting point of the link
     * @param toPt - The ending point of the link
     * @param portDirFrom - The direction from the from-port ('up', 'down', 'left', 'right')
     * @param portDirTo - The direction to the to-port ('up', 'down', 'left', 'right')
     * @returns An array of Points representing the new route, or null if no adjustment needed
     */
    findAvoidsRoute(link: Link, fromPt: Point, toPt: Point, portDirFrom: string, portDirTo: string): Point[] | null;
    /**
     * Invalidate this router, causing it to re-route on the next update.
     */
    invalidateRouter(): void;
    /**
     * Route a single link by checking for node intersections and adjusting.
     */
    private _routeSingleLink;
    /**
     * Determine the direction a port is facing based on the link point relative to the port center.
     */
    private _getPortDirection;
    /**
     * Find all nodes whose padded bounds intersect with a line segment.
     */
    private _findIntersectingNodes;
    /**
     * Get the bounding rectangle of a segment.
     */
    private _segmentBounds;
    /**
     * Check if a line segment intersects with a rectangle.
     */
    private _segmentIntersectsRect;
    /**
     * Check if two line segments intersect.
     */
    private _segmentsIntersect;
    /**
     * Adjust a segment to avoid intersecting nodes by adding waypoints.
     * For orthogonal links, segments are either horizontal or vertical.
     */
    private _adjustSegmentForNodes;
    /**
     * Choose the best direction to deflect a segment around a node.
     * Tries to pick the side with more space.
     */
    private _chooseDeflectDirection;
    /**
     * Separate overlapping parallel link segments.
     * This is a simplified version of the full GoJS algorithm.
     */
    private _separateOverlappingLinks;
    /**
     * Check and separate a pair of links that may have overlapping segments.
     */
    private _separateOverlappingPair;
    /**
     * Check if a position is safe (doesn't overlap with any node).
     */
    private _isSafePosition;
}
