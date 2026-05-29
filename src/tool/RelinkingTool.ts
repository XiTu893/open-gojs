import { LinkingBaseTool } from './LinkingBaseTool';
import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { Spot } from '../core/Spot';
import { GraphObject } from '../view/GraphObject';
import { Shape } from '../view/Shape';
import { Adornment } from '../view/Adornment';
import { Link } from '../view/Link';

export class RelinkingTool extends LinkingBaseTool {

  private _originalLink: Link | null = null;
  private _originalFromPort: GraphObject | null = null;
  private _originalToPort: GraphObject | null = null;
  private _fromHandleArchetype: GraphObject | null = null;
  private _toHandleArchetype: GraphObject | null = null;

  constructor() {
    super();
    this.name = 'Relinking';
    this._fromHandleArchetype = this._createHandleArchetype();
    this._toHandleArchetype = this._createHandleArchetype();
  }

  private _createHandleArchetype(): GraphObject {
    const handle = new Shape();
    (handle as any).figure = 'Diamond';
    (handle as any).fill = 'dodgerblue';
    (handle as any).stroke = 'white';
    (handle as any).desiredSize = new Size(8, 8);
    (handle as any).cursor = 'pointer';
    return handle;
  }

  get originalLink(): Link | null { return this._originalLink; }
  set originalLink(val: Link | null) { this._originalLink = val; }

  get originalFromPort(): GraphObject | null { return this._originalFromPort; }
  set originalFromPort(val: GraphObject | null) { this._originalFromPort = val; }

  get originalToPort(): GraphObject | null { return this._originalToPort; }
  set originalToPort(val: GraphObject | null) { this._originalToPort = val; }

  get fromHandleArchetype(): GraphObject | null { return this._fromHandleArchetype; }
  set fromHandleArchetype(val: GraphObject | null) { this._fromHandleArchetype = val; }

  get toHandleArchetype(): GraphObject | null { return this._toHandleArchetype; }
  set toHandleArchetype(val: GraphObject | null) { this._toHandleArchetype = val; }

  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;
    if (!(diagram as any).allowRelink) return false;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return false;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const handle = this.findToolHandleAt(point);
    if (handle) return true;

    return false;
  }

  doActivate(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    this._isActive = true;
    const lastInput = (diagram as any).lastInput;
    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const handle = this.findToolHandleAt(point);

    if (handle) {
      const adornment = (handle as any).panel;
      if (adornment) {
        const adornedPart = adornment.adornedPart;
        if (adornedPart instanceof Link) {
          this._originalLink = adornedPart;
          this._originalFromPort = adornedPart.fromNode ? (adornedPart.fromNode as any).findPortWithName(adornedPart.fromPortId) : null;
          this._originalToPort = adornedPart.toNode ? (adornedPart.toNode as any).findPortWithName(adornedPart.toPortId) : null;
        }
      }
    }

    this.startTransaction(this.name);
  }

  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive) return;

    this.targetPort = this.findTargetPort();
  }

  doMouseUp(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive) return;

    const targetPort = this.targetPort;
    if (targetPort && this._originalLink) {
      const toNode = (targetPort as any).part;
      if (this.isValidLink(this._originalLink.fromNode, this._originalFromPort!, toNode, targetPort)) {
        this._originalLink.toNode = toNode;
        this.transactionResult = this.name;
      }
    }

    this.stopTransaction();
    this.stopTool();
  }

  doDeactivate(): void {
    this._originalLink = null;
    this._originalFromPort = null;
    this._originalToPort = null;
    this.targetPort = null;
    this.temporaryLink = null;
    super.doDeactivate();
  }

  updateAdornments(part: any): void {
    if (!part) return;
    const diagram = this.diagram;
    if (!diagram) return;

    const category = 'Relinking';
    const existingAd = part.getAdornment(category);

    if (!(part instanceof Link) || !part.isSelected || !(diagram as any).allowRelink) {
      if (existingAd) {
        part.removeAdornment(category);
        const adLayer = (diagram as any).findLayer('Adornment');
        if (adLayer) adLayer.remove(existingAd);
      }
      return;
    }

    const link = part as Link;
    if (!link.fromNode && !link.toNode) return;

    const adornment = this._makeRelinkAdornment(link);
    part.addAdornment(category, adornment);

    const adLayer = (diagram as any).findLayer('Adornment');
    if (adLayer) {
      if (existingAd) adLayer.remove(existingAd);
      adLayer.add(adornment);
    }
  }

  private _makeRelinkAdornment(link: Link): Adornment {
    const adornment = new Adornment();
    (adornment as any).category = 'Relinking';
    adornment.adornedObject = link;

    const bounds = link.getDocumentBounds();
    const points = link.points;

    if (points && points.count >= 2) {
      const fromPt = points.get(0);
      const toPt = points.get(points.count - 1);

      if (fromPt && this._fromHandleArchetype) {
        const fromHandle = this._fromHandleArchetype.copy();
        (fromHandle as any).cursor = 'pointer';
        (fromHandle as any)._isFromHandle = true;
        (fromHandle as any).alignment = new Spot(
          bounds.width > 0 ? (fromPt.x - bounds.x) / bounds.width : 0,
          bounds.height > 0 ? (fromPt.y - bounds.y) / bounds.height : 0
        );
        (fromHandle as any).alignmentFocus = new Spot(0.5, 0.5);
        adornment.add(fromHandle);
      }

      if (toPt && this._toHandleArchetype) {
        const toHandle = this._toHandleArchetype.copy();
        (toHandle as any).cursor = 'pointer';
        (toHandle as any)._isToHandle = true;
        (toHandle as any).alignment = new Spot(
          bounds.width > 0 ? (toPt.x - bounds.x) / bounds.width : 1,
          bounds.height > 0 ? (toPt.y - bounds.y) / bounds.height : 1
        );
        (toHandle as any).alignmentFocus = new Spot(0.5, 0.5);
        adornment.add(toHandle);
      }
    }

    (adornment as any)._actualBounds = bounds.copy();
    (adornment as any)._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
    (adornment as any)._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);

    return adornment;
  }
}
