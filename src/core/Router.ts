export class Router {

  /** Compute the route for a link. */
  getRoute(link: any): any[] {
    return [];
  }

  /** Compute the route for a link, taking into account nodes that must be avoided. */
  computeRoute(link: any, options?: any): any[] {
    return this.getRoute(link);
  }

  /** Get the from-port for a link. */
  getFromPort(link: any): any {
    return null;
  }

  /** Get the to-port for a link. */
  getToPort(link: any): any {
    return null;
  }

  /** invalidate the route for a link. */
  invalidateRoute(link: any): void {
    // No-op by default
  }

  /** invalidatedRoutes changed. */
  invalidatedRoutes(): void {
    // No-op by default
  }
}