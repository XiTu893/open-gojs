import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { Spot } from '../core/Spot';
import { GraphObject } from '../view/GraphObject';
import { Shape } from '../view/Shape';
import { Adornment } from '../view/Adornment';
import { Link } from '../view/Link';

export class LinkReshapingTool extends Tool {

  private _handle: any = null;
  private _adornedLink: any = null;
  private _handleIndex: number = -1;
  protected _handleArchetype: GraphObject | null = null;

  constructor() {
    super();
    this.name = 'LinkReshaping';
    this._handleArchetype = this._createHandleArchetype();
  }

  private _createHandleArchetype(): GraphObject {
    const handle = new Shape();
    (handle as any).figure = 'Diamond';
    (handle as any).fill = 'dodgerblue';
    (handle as any).stroke = 'white';
    (handle as any).desiredSize = new Size(7, 7);
    (handle as any).cursor = 'crosshair';
    return handle;
  }

  get handle(): any { return this._handle; }
  set handle(val: any) { this._handle = val; }

  get adornedLink(): any { return this._adornedLink; }
  set adornedLink(val: any) { this._adornedLink = val; }

  get handleArchetype(): GraphObject | null { return this._handleArchetype; }
  set handleArchetype(val: GraphObject | null) { this._handleArchetype = val; }

  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;
    if (!(diagram as any).allowReshape) return false;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return false;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const handle = this.findToolHandleAt(point);
    return handle !== null;
  }

  doActivate(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    this._isActive = true;
    const lastInput = (diagram as any).lastInput;
    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    this._handle = this.findToolHandleAt(point);

    if (this._handle) {
      const adornment = (this._handle as any).panel;
      if (adornment) {
        this._adornedLink = adornment.adornedPart;
      }
      this._handleIndex = (this._handle as any)._handleIndex || 0;
    }

    this.startTransaction(this.name);
  }

  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput || !this._adornedLink) return;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);

    const points = this._adornedLink.points;
    if (points && this._handleIndex >= 0 && this._handleIndex < points.count) {
      points.set(this._handleIndex, point);
      this._adornedLink.points = points;
    }

    diagram.requestUpdate();
  }

  doMouseUp(): void {
    if (!this.isActive) return;
    this.transactionResult = this.name;
    this.stopTool();
    const diagram = this.diagram;
    if (diagram && this._adornedLink) {
      diagram.raiseDiagramEvent('LinkReshaped', this._adornedLink);
    }
  }

  doDeactivate(): void {
    this._handle = null;
    this._adornedLink = null;
    this._handleIndex = -1;
    super.doDeactivate();
  }

  updateAdornments(part: any): void {
    if (!part) return;
    const diagram = this.diagram;
    if (!diagram) return;

    const category = 'LinkReshaping';
    const existingAd = part.getAdornment(category);

    if (!(part instanceof Link) || !part.isSelected || !(diagram as any).allowReshape) {
      if (existingAd) {
        part.removeAdornment(category);
        const adLayer = (diagram as any).findLayer('Adornment');
        if (adLayer) adLayer.remove(existingAd);
      }
      return;
    }

    const link = part as Link;
    const points = link.points;
    if (!points || points.count < 2) return;

    const adornment = this._makeReshapeAdornment(link);
    part.addAdornment(category, adornment);

    const adLayer = (diagram as any).findLayer('Adornment');
    if (adLayer) {
      if (existingAd) adLayer.remove(existingAd);
      adLayer.add(adornment);
    }
  }

  private _makeReshapeAdornment(link: Link): Adornment {
    const adornment = new Adornment();
    (adornment as any).category = 'LinkReshaping';
    adornment.adornedObject = link;

    const points = link.points;
    for (let i = 0; i < points.count; i++) {
      if (i === 0 || i === points.count - 1) continue;

      const pt = points.get(i);
      if (!pt) continue;

      const handle = this._handleArchetype ? this._handleArchetype.copy() : this._createHandleArchetype().copy();
      (handle as any)._handleIndex = i;
      (handle as any).cursor = 'crosshair';

      const bounds = link.getDocumentBounds();
      (handle as any)._desiredBounds = new Rect(
        pt.x - bounds.x - 3.5,
        pt.y - bounds.y - 3.5,
        7, 7
      );
      (handle as any).alignment = new Spot(
        (pt.x - bounds.x) / bounds.width,
        (pt.y - bounds.y) / bounds.height
      );
      (handle as any).alignmentFocus = new Spot(0.5, 0.5);

      adornment.add(handle);
    }

    const bounds = link.getDocumentBounds();
    (adornment as any)._actualBounds = bounds.copy();
    (adornment as any)._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
    (adornment as any)._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);

    return adornment;
  }
}
