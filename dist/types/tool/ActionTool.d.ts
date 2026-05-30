import { Tool } from './Tool';
import { GraphObject } from '../view/GraphObject';
/**
 * ActionTool - handles isActionable objects.
 * Dispatches mouse events to GraphObjects that have isActionable set to true.
 */
export declare class ActionTool extends Tool {
    private _actionableObject;
    constructor();
    get actionableObject(): GraphObject | null;
    set actionableObject(val: GraphObject | null);
    /** Can start if the user clicks on an isActionable object. */
    canStart(): boolean;
    /** Dispatch mouse-down to the actionable object. */
    doMouseDown(): void;
    /** Dispatch mouse-move to the actionable object. */
    doMouseMove(): void;
    /** Dispatch mouse-up to the actionable object. */
    doMouseUp(): void;
}
