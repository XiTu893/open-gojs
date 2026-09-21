export declare class Router {
    /** Compute the route for a link. */
    getRoute(link: any): any[];
    /** Compute the route for a link, taking into account nodes that must be avoided. */
    computeRoute(link: any, options?: any): any[];
    /** Get the from-port for a link. */
    getFromPort(link: any): any;
    /** Get the to-port for a link. */
    getToPort(link: any): any;
    /** invalidate the route for a link. */
    invalidateRoute(link: any): void;
    /** invalidatedRoutes changed. */
    invalidatedRoutes(): void;
}
