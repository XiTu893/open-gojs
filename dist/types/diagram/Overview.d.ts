import { Diagram } from './Diagram';
import { Rect } from '../core/Rect';
/**
 * Overview - shows a zoomed-out view of another diagram.
 * Renders a scaled-down version of the observed diagram and shows a rectangle
 * representing the current viewport.
 */
export declare class Overview {
    private _diagram;
    private _observedDiagram;
    private _box;
    private _isViewportSized;
    constructor(divId: string | HTMLDivElement);
    /** The Diagram shown by this Overview. */
    get diagram(): Diagram;
    /** The diagram being observed by this Overview. */
    get observedDiagram(): Diagram | null;
    set observedDiagram(val: Diagram | null);
    /** The viewport box Adornment that indicates the current viewport of the observed diagram. */
    get box(): any;
    set box(val: any);
    /** Whether the Overview sizes itself to match the observed diagram's viewport. */
    get isViewportSized(): boolean;
    set isViewportSized(val: boolean);
    /** Redraw the overview. */
    update(): void;
    /** Render the observed diagram in miniature. */
    drawOverview(): void;
    /** Draw the viewport indicator box. */
    drawBox(): void;
    /** Compute the bounds of all parts in the observed diagram. */
    computeBounds(): Rect;
    /** Create a copy of this Overview. */
    copy(): Overview;
    /** Set up the overview diagram with appropriate settings. */
    private _setupOverview;
}
