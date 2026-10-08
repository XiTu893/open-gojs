import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Part } from '../view/Part';

/**
 * ClickCreatingTool - creates a new node on click in the background.
 * Used for quick node creation by clicking on empty diagram space.
 */
export class ClickCreatingTool extends Tool {
  static readonly className: string = "ClickCreatingTool";

  private _archetypePartData: any = null;
  private _isDoubleClick: boolean = false;

  constructor() {
    super();
    this.name = 'ClickCreating';
  }

  // ============ Properties ============

  get archetypePartData(): any { return this._archetypePartData; }
  set archetypePartData(val: any) { this._archetypePartData = val; }

  get isDoubleClick(): boolean { return this._isDoubleClick; }
  set isDoubleClick(val: boolean) { this._isDoubleClick = val; }

  // ============ Methods ============

  /**
   * 官方 ClickCreatingTool.canStart（go.js 逐字）：
   *   !isEnabled || archetypeNodeData === null → false
   *   isReadOnly / isModelReadOnly / !allowInsert / !canStartButton() /
   *   isBeyondDragSize() → false
   *   clickCount 必须匹配 isDoubleClick 设置
   *   最后 currentTool !== this && 指下有部件 → false
   */
  canStart(): boolean {
    const diagram = this.diagram;
    if (diagram === null || !this.isEnabled || this._archetypePartData === null) return false;
    if (diagram.isReadOnly || diagram.isModelReadOnly || !diagram.allowInsert ||
        !this.canStartButton() || this.isBeyondDragSize()) return false;

    const lastInput = diagram.lastInput;
    if (this._isDoubleClick) {
      if (lastInput.clickCount !== 2) return false;
    } else if (lastInput.clickCount !== 1) {
      return false;
    }

    // Only start if clicking on the background
    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    if (this.toolManager && this.toolManager.currentTool !== this &&
        diagram.findPartAt(point, true) !== null) return false;
    return true;
  }

  /** Create the part on mouse up. */
  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    if (this.isActive) {
      const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
      this.insertPart(point);
    }
    this.stopTool();
  }

  /** Insert a new part at the given location. */
  insertPart(loc: Point): Part | null {
    const diagram = this.diagram;
    if (!diagram || !this._archetypePartData) return null;

    this.startTransaction(this.name);

    const model = (diagram as any).model;
    if (model) {
      const data: any = {};
      for (const key in this._archetypePartData) {
        if (Object.prototype.hasOwnProperty.call(this._archetypePartData, key)) {
          data[key] = this._archetypePartData[key];
        }
      }
      data.loc = loc.x + ' ' + loc.y;
      model.addNodeData(data);
    }

    this.transactionResult = this.name;
    this.stopTransaction();

    return null;
  }
}
