import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';

/**
 * DragSelectingTool - box (rubber-band) selection tool.
 * Allows the user to draw a rectangle to select multiple parts.
 */
export class DragSelectingTool extends Tool {
  static readonly className: string = "DragSelectingTool";

  private _box: Rect | null = null;
  private _startPoint: Point | null = null;

  constructor() {
    super();
    this.name = 'DragSelecting';
  }

  // ============ Properties ============

  get box(): Rect | null { return this._box; }
  set box(val: Rect | null) { this._box = val; }

  // ============ Methods ============

  /** Can start if the user clicks in the background (no part). */
  private _delay: number = 0;
  get delay(): number { return this._delay; }
  set delay(val: number) { this._delay = val; }

  /**
   * 官方 DragSelectingTool.canStart（go.js 逐字）：
   *   !allowSelect / !canStartButton() → false
   *   currentTool !== this 时要求 isBeyondDragSize()、过 delay、指下无部件
   * 以前缺 canStartButton 与 isBeyondDragSize，右键一按就开始框选。
   */
  canStart(): boolean {
    const diagram = this.diagram;
    if (diagram === null || !this.isEnabled) return false;
    if (!diagram.allowSelect || !this.canStartButton()) return false;
    if (this.toolManager && this.toolManager.currentTool !== this) {
      if (!this.isBeyondDragSize()) return false;
      const e = diagram.lastInput;
      if (e.timestamp - diagram.firstInput.timestamp < this._delay) return false;
      if (diagram.findPartAt(new Point(e.documentPoint.x, e.documentPoint.y), true) !== null) return false;
    }
    return true;
  }

  /** Activate and start the box selection. */
  doActivate(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    this._isActive = true;
    const lastInput = (diagram as any).lastInput;
    this._startPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    this._box = new Rect(this._startPoint.x, this._startPoint.y, 0, 0);
    this.startTransaction(this.name);
  }

  /** Update the selection box on mouse move. */
  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput || !this._startPoint) return;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const x = Math.min(this._startPoint.x, point.x);
    const y = Math.min(this._startPoint.y, point.y);
    const w = Math.abs(point.x - this._startPoint.x);
    const h = Math.abs(point.y - this._startPoint.y);
    this._box = new Rect(x, y, w, h);

    diagram.requestUpdate();
  }

  /** Finalize the selection on mouse up. */
  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive) return;

    if (this._box && !this._box.isEmpty()) {
      this.selectInRect(this._box);
    }

    this.transactionResult = this.name;
    this.stopTransaction();
    this.stopTool();
  }

  /** Clean up on deactivate. */
  doDeactivate(): void {
    this.stopTransaction();
    this._box = null;
    this._startPoint = null;
    super.doDeactivate();
  }

  /** Select all parts within the given rectangle. */
  selectInRect(r: Rect): void {
    const diagram = this.diagram;
    if (!diagram) return;

    const selection = (diagram as any).selection;
    if (!selection) return;

    const lastInput = (diagram as any).lastInput;
    const toggle = lastInput && (lastInput.control || lastInput.shift);

    if (!toggle) {
      diagram.clearSelection();
    }

    // Iterate over all parts and select those within the rect
    const layers = (diagram as any)._layers;
    if (layers) {
      for (const layer of layers) {
        if (layer.isTemporary) continue;
        const partsIt = layer.parts;
        while (partsIt.next()) {
          const part = partsIt.value;
          if (!part.selectable || !part.visible) continue;
          const bounds = part.getDocumentBounds();
          if (r.intersectsRect(bounds)) {
            part.isSelected = true;
            selection.add(part);
          }
        }
      }
    }
  }
}
