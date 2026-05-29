import { Diagram } from './Diagram';
import { Rect } from '../core/Rect';
import { Point } from '../core/Point';
import { Size } from '../core/Size';

/**
 * Overview - shows a zoomed-out view of another diagram.
 * Renders a scaled-down version of the observed diagram and shows a rectangle
 * representing the current viewport.
 */
export class Overview {

  private _diagram: Diagram;
  private _observedDiagram: Diagram | null = null;
  private _box: any = null;
  private _isViewportSized: boolean = false;

  constructor(divId: string | HTMLDivElement) {
    this._diagram = new Diagram(divId);
    this._setupOverview();
  }

  // ============ Properties ============

  /** The Diagram shown by this Overview. */
  get diagram(): Diagram {
    return this._diagram;
  }

  /** The diagram being observed by this Overview. */
  get observedDiagram(): Diagram | null {
    return this._observedDiagram;
  }

  set observedDiagram(val: Diagram | null) {
    if (this._observedDiagram === val) return;
    this._observedDiagram = val;
    this.update();
  }

  /** The viewport box Adornment that indicates the current viewport of the observed diagram. */
  get box(): any {
    return this._box;
  }

  set box(val: any) {
    this._box = val;
  }

  /** Whether the Overview sizes itself to match the observed diagram's viewport. */
  get isViewportSized(): boolean {
    return this._isViewportSized;
  }

  set isViewportSized(val: boolean) {
    if (this._isViewportSized === val) return;
    this._isViewportSized = val;
    this.update();
  }

  // ============ Methods ============

  /** Redraw the overview. */
  update(): void {
    this.drawOverview();
    this.drawBox();
  }

  /** Render the observed diagram in miniature. */
  drawOverview(): void {
    if (!this._observedDiagram) return;
    // Scale the overview to fit the observed diagram's document bounds
    const docBounds = this._observedDiagram.documentBounds;
    if (docBounds.isEmpty) return;
    const viewSize = this._diagram.viewSize;
    if (viewSize.isEmpty) return;
    const scale = Math.min(
      viewSize.width / docBounds.width,
      viewSize.height / docBounds.height
    );
    this._diagram.scale = scale;
    this._diagram.position = new Point(docBounds.x, docBounds.y);
    this._diagram.requestUpdate();
  }

  /** Draw the viewport indicator box. */
  drawBox(): void {
    if (!this._observedDiagram) return;
    const vpBounds = this._observedDiagram.viewportBounds;
    if (vpBounds.isEmpty) return;
    // The box represents the viewport rectangle in overview coordinates
    // Stub: actual box drawing would create/update an Adornment on the overview diagram
    if (this._box) {
      (this._box as any).position = new Point(vpBounds.x, vpBounds.y);
      (this._box as any).width = vpBounds.width;
      (this._box as any).height = vpBounds.height;
    }
  }

  /** Compute the bounds of all parts in the observed diagram. */
  computeBounds(): Rect {
    if (!this._observedDiagram) return new Rect();
    return this._observedDiagram.documentBounds;
  }

  /** Create a copy of this Overview. */
  copy(): Overview {
    const overview = new Overview(this._diagram.div || '');
    overview.observedDiagram = this._observedDiagram;
    overview.isViewportSized = this._isViewportSized;
    return overview;
  }

  // ============ Internal Methods ============

  /** Set up the overview diagram with appropriate settings. */
  private _setupOverview(): void {
    this._diagram.isReadOnly = true;
    this._diagram.allowSelect = false;
    this._diagram.allowMove = false;
    this._diagram.allowCopy = false;
    this._diagram.allowDelete = false;
    this._diagram.allowZoom = false;
    this._diagram.allowHorizontalScroll = false;
    this._diagram.allowVerticalScroll = false;
  }
}
