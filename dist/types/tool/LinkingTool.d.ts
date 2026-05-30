import { LinkingBaseTool } from './LinkingBaseTool';
import { GraphObject } from '../view/GraphObject';
import { Link } from '../view/Link';
/**
 * LinkingTool - creates new links by dragging from a port.
 * The user drags from an outgoing port to an incoming port to create a new link.
 */
export declare class LinkingTool extends LinkingBaseTool {
    private _originalFromPort;
    constructor();
    /** Can start if the user clicks on a fromLinkable port. */
    canStart(): boolean;
    /** Activate the linking tool. */
    doActivate(): void;
    /** Update the temporary link on mouse move. */
    doMouseMove(): void;
    /** Complete the link on mouse up. */
    doMouseUp(): void;
    /** Clean up on deactivate. */
    doDeactivate(): void;
    /** Insert a new link into the model. */
    insertLink(fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject): Link | null;
}
