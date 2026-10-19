import { Tool } from './Tool';
import { Point } from '../core/Point';

/**
 * PanningTool - pans the viewport by dragging.
 * The user drags to scroll the diagram viewport.
 */
export class PanningTool extends Tool {
  static readonly className: string = "PanningTool";

  private _originalPosition: Point | null = null;
  private _startPoint: Point | null = null;

  constructor() {
    super();
    this.name = 'Panning';
  }

  /**
   * 官方 PanningTool.canStart（go.js 逐字）：
   *   !(!allowHorizontalScroll && !allowVerticalScroll ||
   *     !canStartButton() ||
   *     (currentTool !== this && !isBeyondDragSize() && !isMultiTouch))
   * 以前完全没有 button / dragSize 判定，右键或轻微点击也会被当成平移手势。
   */
  canStart(): boolean {
    const diagram = this.diagram;
    if (diagram === null || !this.isEnabled) return false;
    if (!diagram.allowHorizontalScroll && !diagram.allowVerticalScroll) return false;
    if (!this.canStartButton()) return false;
    if (this.toolManager && this.toolManager.currentTool !== this &&
        !this.isBeyondDragSize() && !diagram.lastInput.isMultiTouch) return false;
    return true;
  }

  /**
   * 官方 PanningTool.canStartButton（go.js 逐字）：**中键**按下才平移视口。
   * 基类 Tool.canStartButton 只认左键；官方 pan 语义是中键（左键空白是框选）。
   */
  canStartButton(): boolean {
    const d = this.diagram;
    if (!d) return false;
    return d.lastInput.middleButton;
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
