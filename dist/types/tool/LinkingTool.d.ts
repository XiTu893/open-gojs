import { LinkingBaseTool } from './LinkingBaseTool';
import { GraphObject } from '../view/GraphObject';
import { Link } from '../view/Link';
/**
 * LinkingTool - creates new links by dragging from a port.
 * The user drags from an outgoing port to an incoming port to create a new link.
 */
export declare class LinkingTool extends LinkingBaseTool {
    static readonly className: string;
    private _originalFromPort;
    constructor();
    /**
     * 官方 LinkingBaseTool.canStart（go.js 逐字）：
     *   isReadOnly / isModelReadOnly / !allowLink / !canStartButton()
     *   currentTool !== this && !isBeyondDragSize() → false
     *   最后 findLinkablePort() !== null（从 **firstInput** 落点找）
     * Linking 在 mouseMoveTools 里，所以"按下不动"绝不会启动拉线。
     */
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
