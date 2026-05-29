import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Part } from '../view/Part';

/**
 * ClickCreatingTool - creates a new node on click in the background.
 * Used for quick node creation by clicking on empty diagram space.
 */
export class ClickCreatingTool extends Tool {

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

  /** Can start if the user clicks in the background and archetype data is set. */
  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;
    if (!(diagram as any).allowInsert) return false;
    if (!this._archetypePartData) return false;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return false;

    // Only start if clicking on the background
    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const part = diagram.findPartAt(point, true);
    return part === null;
  }

  /** Create the part on mouse up. */
  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    this.insertPart(point);
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
