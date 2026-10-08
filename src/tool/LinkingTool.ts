import { LinkingBaseTool } from './LinkingBaseTool';
import { Point } from '../core/Point';
import { Spot } from '../core/Spot';
import { List } from '../core/List';
import { GraphObject } from '../view/GraphObject';
import { Link } from '../view/Link';

/**
 * LinkingTool - creates new links by dragging from a port.
 * The user drags from an outgoing port to an incoming port to create a new link.
 */
export class LinkingTool extends LinkingBaseTool {
  static readonly className: string = "LinkingTool";

  private _originalFromPort: GraphObject | null = null;

  constructor() {
    super();
    this.name = 'Linking';
  }

  /**
   * 官方 LinkingBaseTool.canStart（go.js 逐字）：
   *   isReadOnly / isModelReadOnly / !allowLink / !canStartButton()
   *   currentTool !== this && !isBeyondDragSize() → false
   *   最后 findLinkablePort() !== null（从 **firstInput** 落点找）
   * Linking 在 mouseMoveTools 里，所以"按下不动"绝不会启动拉线。
   */
  canStart(): boolean {
    const diagram = this.diagram;
    if (diagram === null || !this.isEnabled) return false;
    if (diagram.isReadOnly || diagram.isModelReadOnly || !diagram.allowLink || !this.canStartButton()) return false;
    if (this.toolManager && this.toolManager.currentTool !== this && !this.isBeyondDragSize()) return false;

    const point = new Point(diagram.firstInput.documentPoint.x, diagram.firstInput.documentPoint.y);
    const obj = diagram.findObjectAt(point);
    if (!obj) return false;

    // Check if the object is a fromLinkable port
    if (obj.fromLinkable) return true;

    return false;
  }

  /** Activate the linking tool. */
  doActivate(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    this._isActive = true;
    const lastInput = (diagram as any).lastInput;
    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const obj = diagram.findObjectAt(point);

    if (obj) {
      this._originalFromPort = obj;
      this.temporaryFromPort = obj;
    }

    const tempLink = this.temporaryLink;
    if (tempLink) {
      const fromPort = this.temporaryFromPort;
      if (fromPort) {
        const fromNode = (fromPort as any).part;
        if (fromNode) {
          tempLink.fromNode = fromNode;
          const fromPortId = (fromPort as any).portId;
          if (fromPortId !== undefined) tempLink.fromPortId = fromPortId;
        }
        const fromBounds = fromPort.getDocumentBounds();
        const fromPoint = new Point(fromBounds.x + fromBounds.width / 2, fromBounds.y + fromBounds.height / 2);
        tempLink.points = new List<Point>();
        tempLink.points.add(fromPoint);
        tempLink.points.add(point);
      }
      const toolLayer = diagram.findLayer('Tool');
      if (toolLayer) toolLayer.add(tempLink);
    }

    this.startTransaction(this.name);
  }

  /** Update the temporary link on mouse move. */
  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive) return;

    this.targetPort = this.findTargetPort();

    const tempLink = this.temporaryLink;
    if (tempLink) {
      const lastInput = (diagram as any).lastInput;
      if (lastInput) {
        const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        const points = tempLink.points;
        if (points && points.count >= 2) {
          points.set(points.count - 1, point);
          tempLink.points = points;
        }
      }

      if (this.targetPort) {
        const toNode = (this.targetPort as any).part;
        if (toNode) {
          tempLink.toNode = toNode;
          const toPortId = (this.targetPort as any).portId;
          if (toPortId !== undefined) tempLink.toPortId = toPortId;
        }
      } else {
        tempLink.toNode = null;
      }
    }

    diagram.requestUpdate();
  }

  /** Complete the link on mouse up. */
  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive) return;

    const targetPort = this.targetPort;
    if (targetPort && this.temporaryFromPort) {
      const fromNode = (this.temporaryFromPort as any).part;
      const toNode = (targetPort as any).part;
      if (this.isValidLink(fromNode, this.temporaryFromPort, toNode, targetPort)) {
        this.insertLink(fromNode, this.temporaryFromPort, toNode, targetPort);
        this.transactionResult = this.name;
      }
    }

    this.stopTransaction();
    this.stopTool();
  }

  /** Clean up on deactivate. */
  doDeactivate(): void {
    const diagram = this.diagram;
    const tempLink = this.temporaryLink;
    if (tempLink && diagram) {
      const toolLayer = diagram.findLayer('Tool');
      if (toolLayer) toolLayer.remove(tempLink);
      tempLink.fromNode = null;
      tempLink.toNode = null;
    }
    this._originalFromPort = null;
    this.temporaryFromPort = null;
    this.temporaryToPort = null;
    this.targetPort = null;
    super.doDeactivate();
  }

  /** Insert a new link into the model. */
  insertLink(fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject): Link | null {
    const diagram = this.diagram;
    if (!diagram) return null;

    const model = (diagram as any).model;
    if (!model) return null;

    // Create link data and add to model
    if (typeof model.addLinkData === 'function') {
      const linkData: any = {};
      const fromKey = model.getKeyForNodeData(fromNode.data);
      const toKey = model.getKeyForNodeData(toNode.data);
      if (fromKey !== undefined) linkData[model.linkFromKeyProperty || 'from'] = fromKey;
      if (toKey !== undefined) linkData[model.linkToKeyProperty || 'to'] = toKey;
      model.addLinkData(linkData);
      const newLink = diagram.findLinkForData(linkData);
      if (newLink) {
        diagram.raiseDiagramEvent('LinkDrawn', newLink);
      }
    }

    return null;
  }
}
