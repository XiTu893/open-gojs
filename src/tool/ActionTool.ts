import { Tool } from './Tool';
import { Point } from '../core/Point';
import { GraphObject } from '../view/GraphObject';

/**
 * ActionTool - handles isActionable objects.
 * Dispatches mouse events to GraphObjects that have isActionable set to true.
 */
export class ActionTool extends Tool {

  private _actionableObject: GraphObject | null = null;

  constructor() {
    super();
    this.name = 'Action';
  }

  // ============ Properties ============

  get actionableObject(): GraphObject | null { return this._actionableObject; }
  set actionableObject(val: GraphObject | null) { this._actionableObject = val; }

  // ============ Methods ============

  /** Can start if the user clicks on an isActionable object. */
  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return false;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const obj = diagram.findObjectAt(point);
    if (obj && obj.isActionable) {
      this._actionableObject = obj;
      return true;
    }

    return false;
  }

  /** Dispatch mouse-down to the actionable object. */
  doMouseDown(): void {
    if (!this._actionableObject) return;

    const diagram = this.diagram;
    if (!diagram) return;

    this._isActive = true;

    const lastInput = (diagram as any).lastInput;
    if (this._actionableObject.actionDown) {
      this._actionableObject.actionDown(lastInput, this._actionableObject);
    }
  }

  /** Dispatch mouse-move to the actionable object. */
  doMouseMove(): void {
    if (!this._actionableObject) return;

    const diagram = this.diagram;
    if (!diagram) return;

    const lastInput = (diagram as any).lastInput;
    if (this._actionableObject.actionMove) {
      this._actionableObject.actionMove(lastInput, this._actionableObject);
    }
  }

  /** Dispatch mouse-up to the actionable object. */
  doMouseUp(): void {
    if (!this._actionableObject) return;

    const diagram = this.diagram;
    if (!diagram) return;

    const lastInput = (diagram as any).lastInput;
    if (this._actionableObject.actionUp) {
      this._actionableObject.actionUp(lastInput, this._actionableObject);
    }

    this._actionableObject = null;
    this.stopTool();
  }
}
