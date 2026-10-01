import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { GraphObject } from '../view/GraphObject';
import { Link } from '../view/Link';
import { Node } from '../view/Node';
import { Shape } from '../view/Shape';
import { PanelAuto } from '../core/EnumValues';

/**
 * LinkingBaseTool - base class for LinkingTool and RelinkingTool.
 * Provides shared logic for finding valid ports, validating links,
 * and creating temporary link visuals.
 */
export class LinkingBaseTool extends Tool {
  static readonly className: string = "LinkingBaseTool";

  private _portProperty: string = 'portId';
  private _targetPort: GraphObject | null = null;
  private _isForwardsOnly: boolean = false;
  private _isBackwardsOnly: boolean = false;
  private _linkValidation: ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject, link: Link | null) => boolean) | null = null;
  private _portValidation: ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject) => boolean) | null = null;
  private _temporaryLink: Link | null = null;
  private _temporaryFromNode: Node | null = null;
  private _temporaryFromPort: GraphObject | null = null;
  private _temporaryToNode: Node | null = null;
  private _temporaryToPort: GraphObject | null = null;
  private _portGravity: number = 100;
  private _isUnconnectedLinkValid: boolean = false;
  private _linkingCursor: string = 'pointer';

  /**
   * 对齐官方 `LinkingBaseTool` 构造（go.js 里 `this.zS=new Link({layerName:"Tool"})…`）。
   * 本项目以前只在构造函数里造了一个灰线 `temporaryLink`，
   * `temporaryFromPort` / `temporaryToPort` 一直是 `null`，
   * 于是样例里 `linkingTool.temporaryFromPort.opacity = 0` 直接
   * `Cannot set properties of null (setting 'opacity')`（实测 leaflet）。
   */
  constructor() {
    super();
    const tempLink = new Link({ layerName: 'Tool' });
    tempLink.add(
      new Shape({ isPanelMain: true, stroke: 'blue' }).theme('stroke', 'tempLink'),
      new Shape({ toArrow: 'Standard', fill: 'blue', stroke: 'blue' })
        .theme('fill', 'tempLink')
        .theme('stroke', 'tempLink')
    );
    this._temporaryLink = tempLink;

    const fromPort = new Shape('Rectangle', {
      portId: '', fill: null, stroke: 'magenta', strokeWidth: 2, desiredSize: new Size(10, 10)
    }).theme('stroke', 'tempPort');
    this._temporaryFromPort = fromPort;
    const fromNode = new Node({ selectable: false, layerName: 'Tool' });
    fromNode.add(fromPort);
    this._temporaryFromNode = fromNode;

    const toPort = new Shape('Rectangle', {
      portId: '', fill: null, stroke: 'magenta', strokeWidth: 2, desiredSize: new Size(10, 10)
    }).theme('stroke', 'tempPort');
    this._temporaryToPort = toPort;
    const toNode = new Node({ selectable: false, layerName: 'Tool' });
    toNode.add(toPort);
    this._temporaryToNode = toNode;
  }

  // ============ Properties ============

  get portGravity(): number { return this._portGravity; }
  set portGravity(val: number) {
    if (val >= 0) this._portGravity = val;
  }

  get isUnconnectedLinkValid(): boolean { return this._isUnconnectedLinkValid; }
  set isUnconnectedLinkValid(val: boolean) { this._isUnconnectedLinkValid = val; }

  get linkingCursor(): string { return this._linkingCursor; }
  set linkingCursor(val: string) { this._linkingCursor = val; }

  get portProperty(): string { return this._portProperty; }
  set portProperty(val: string) { this._portProperty = val; }

  get targetPort(): GraphObject | null { return this._targetPort; }
  set targetPort(val: GraphObject | null) { this._targetPort = val; }

  get isForwardsOnly(): boolean { return this._isForwardsOnly; }
  set isForwardsOnly(val: boolean) { this._isForwardsOnly = val; }

  get isBackwardsOnly(): boolean { return this._isBackwardsOnly; }
  set isBackwardsOnly(val: boolean) { this._isBackwardsOnly = val; }

  get linkValidation(): ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject, link: Link | null) => boolean) | null {
    return this._linkValidation;
  }
  set linkValidation(val: ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject, link: Link | null) => boolean) | null) {
    this._linkValidation = val;
  }

  get portValidation(): ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject) => boolean) | null {
    return this._portValidation;
  }
  set portValidation(val: ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject) => boolean) | null) {
    this._portValidation = val;
  }

  get temporaryLink(): Link | null { return this._temporaryLink; }
  set temporaryLink(val: Link | null) { this._temporaryLink = val; }

  get temporaryFromPort(): GraphObject | null { return this._temporaryFromPort; }
  set temporaryFromPort(val: GraphObject | null) { this._temporaryFromPort = val; }

  get temporaryFromNode(): Node | null { return this._temporaryFromNode; }
  set temporaryFromNode(val: Node | null) {
    this._temporaryFromNode = val;
    if (val) this._temporaryFromPort = val.port;
  }

  get temporaryToPort(): GraphObject | null { return this._temporaryToPort; }
  set temporaryToPort(val: GraphObject | null) { this._temporaryToPort = val; }

  get temporaryToNode(): Node | null { return this._temporaryToNode; }
  set temporaryToNode(val: Node | null) {
    this._temporaryToNode = val;
    if (val) this._temporaryToPort = val.port;
  }

  // ============ Methods ============

  /** Find a target port at the current mouse point. */
  findTargetPort(): GraphObject | null {
    const diagram = this.diagram;
    if (!diagram) return null;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return null;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const obj = diagram.findObjectAt(point);
    if (obj) {
      if (obj.portId !== undefined && obj.portId !== null) {
        return obj;
      }
    }
    const node = diagram.findNodeAt(point);
    if (node) return node;
    return null;
  }

  /** Check whether a link from fromPort to toPort is valid. */
  isValidLink(fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject): boolean {
    if (!fromNode || !toNode) return false;
    if (fromNode === toNode) {
      if (!fromPort.fromLinkableSelfNode || !toPort.toLinkableSelfNode) return false;
    }
    if (this._isForwardsOnly && fromNode === toNode) return false;
    if (this._isBackwardsOnly && fromNode === toNode) return false;

    if (!fromPort.fromLinkable || !toPort.toLinkable) return false;

    if (fromPort.fromMaxLinks > 0) {
      const existingCount = this._countLinksFromPort(fromPort);
      if (existingCount >= fromPort.fromMaxLinks) return false;
    }
    if (toPort.toMaxLinks > 0) {
      const existingCount = this._countLinksToPort(toPort);
      if (existingCount >= toPort.toMaxLinks) return false;
    }

    if (!fromPort.fromLinkableDuplicates || !toPort.toLinkableDuplicates) {
      if (this._hasDuplicateLink(fromPort, toPort)) return false;
    }

    if (this._portValidation) {
      if (!this._portValidation(fromNode, fromPort, toNode, toPort)) return false;
    }

    if (this._linkValidation) {
      if (!this._linkValidation(fromNode, fromPort, toNode, toPort, null)) return false;
    }

    return true;
  }

  private _countLinksFromPort(port: GraphObject): number {
    const part = port.part;
    if (!part || !part.diagram) return 0;
    let count = 0;
    const links = part.diagram.links;
    while (links.next()) {
      const link = links.value;
      if (link.fromPort === port) count++;
    }
    return count;
  }

  private _countLinksToPort(port: GraphObject): number {
    const part = port.part;
    if (!part || !part.diagram) return 0;
    let count = 0;
    const links = part.diagram.links;
    while (links.next()) {
      const link = links.value;
      if (link.toPort === port) count++;
    }
    return count;
  }

  private _hasDuplicateLink(fromPort: GraphObject, toPort: GraphObject): boolean {
    const part = fromPort.part;
    if (!part || !part.diagram) return false;
    const links = part.diagram.links;
    while (links.next()) {
      const link = links.value;
      if (link.fromPort === fromPort && link.toPort === toPort) return true;
    }
    return false;
  }

  /** Insert a new link into the model. Returns the new link or null. */
  insertLink(fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject): Link | null {
    // Stub - requires model integration
    return null;
  }
}
