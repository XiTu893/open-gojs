import { Tool } from './Tool';
import { Point } from '../core/Point';

/**
 * PanningTool - pans the viewport by dragging.
 * The user drags to scroll the diagram viewport.
 */
export class PanningTool extends Tool {

  private _originalPosition: Point | null = null;
  private _startPoint: Point | null = null;

  constructor() {
    super();
    this.name = 'Panning';
  }

  /** Can start if the user clicks on the background with no part. */
  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return false;

    // Check if the diagram allows scrolling
    if (!(diagram as any).allowHorizontalScroll && !(diagram as any).allowVerticalScroll) return false;

    return true;
  }

  /** Activate the panning tool. */
  doActivate(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    this._isActive = true;
    const lastInput = (diagram as any).lastInput;
    this._startPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    this._originalPosition = diagram.position.copy();
  }

  /** Pan the viewport on mouse move. */
  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive || !this._startPoint || !this._originalPosition) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const delta = point.subtract(this._startPoint!);

    let newX = this._originalPosition.x - delta.x;
    let newY = this._originalPosition.y - delta.y;

    if (!(diagram as any).allowHorizontalScroll) newX = this._originalPosition.x;
    if (!(diagram as any).allowVerticalScroll) newY = this._originalPosition.y;

    diagram.position = new Point(newX, newY);
  }

  /** Clean up on deactivate. */
  doDeactivate(): void {
    this._originalPosition = null;
    this._startPoint = null;
    super.doDeactivate();
  }
}
