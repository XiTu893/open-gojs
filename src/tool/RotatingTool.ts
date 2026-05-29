import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { GraphObject } from '../view/GraphObject';
import { Shape } from '../view/Shape';
import { Panel } from '../view/Panel';
import { Adornment } from '../view/Adornment';
import { Spot } from '../core/Spot';
import { PanelVertical } from '../core/EnumValues';

export class RotatingTool extends Tool {

  private _handle: GraphObject | null = null;
  private _adornedElement: GraphObject | null = null;
  private _angle: number = 0;
  private _originalAngle: number = 0;
  protected _handleArchetype: GraphObject | null = null;

  constructor() {
    super();
    this.name = 'Rotating';
    this._handleArchetype = this._createHandleArchetype();
  }

  private _createHandleArchetype(): GraphObject {
    const handle = new Shape();
    (handle as any).figure = 'Ellipse';
    (handle as any).fill = 'dodgerblue';
    (handle as any).stroke = 'white';
    (handle as any).desiredSize = new Size(10, 10);
    (handle as any).cursor = 'pointer';
    return handle;
  }

  get handle(): GraphObject | null { return this._handle; }
  set handle(val: GraphObject | null) { this._handle = val; }

  get adornedElement(): GraphObject | null { return this._adornedElement; }
  set adornedElement(val: GraphObject | null) { this._adornedElement = val; }

  get angle(): number { return this._angle; }
  set angle(val: number) { this._angle = val; }

  get handleArchetype(): GraphObject | null { return this._handleArchetype; }
  set handleArchetype(val: GraphObject | null) { this._handleArchetype = val; }

  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;
    if (!(diagram as any).allowRotate) return false;

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
        this._adornedElement = adornment.adornedObject;
        this._originalAngle = this._adornedElement ? (this._adornedElement as any).angle || 0 : 0;
      }
    }

    this.startTransaction(this.name);
  }

  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive || !this._adornedElement) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    const newAngle = this.computeRotate(this._adornedElement, new Point(lastInput.documentPoint.x, lastInput.documentPoint.y));
    (this._adornedElement as any).angle = newAngle;
    this._angle = newAngle;

    diagram.requestUpdate();
  }

  doMouseUp(): void {
    if (!this.isActive) return;
    this.transactionResult = this.name;
    this.stopTool();
  }

  doDeactivate(): void {
    this._handle = null;
    this._adornedElement = null;
    super.doDeactivate();
  }

  computeRotate(element: GraphObject, newPoint: Point): number {
    const bounds = element.getDocumentBounds();
    const center = bounds.center;
    const dx = newPoint.x - center.x;
    const dy = newPoint.y - center.y;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    angle = Math.round(angle);
    return angle;
  }

  updateAdornments(part: any): void {
    if (!part) return;
    const diagram = this.diagram;
    if (!diagram) return;

    const category = 'Rotating';
    const existingAd = part.getAdornment(category);

    if (!part.isSelected || !(diagram as any).allowRotate) {
      if (existingAd) {
        part.removeAdornment(category);
        const adLayer = (diagram as any).findLayer('Adornment');
        if (adLayer) adLayer.remove(existingAd);
      }
      return;
    }

    const bounds = part.getDocumentBounds();
    if (bounds.width <= 0 || bounds.height <= 0) return;

    const adornment = this._makeRotateAdornment(part, bounds);
    part.addAdornment(category, adornment);

    const adLayer = (diagram as any).findLayer('Adornment');
    if (adLayer) {
      if (existingAd) adLayer.remove(existingAd);
      adLayer.add(adornment);
    }
  }

  private _makeRotateAdornment(adornedObj: GraphObject, bounds: Rect): Adornment {
    const adornment = new Adornment();
    (adornment as any).category = 'Rotating';
    adornment.adornedObject = adornedObj;

    const vPanel = new Panel();
    (vPanel as any)._type = PanelVertical;

    const handle = this._handleArchetype ? this._handleArchetype.copy() : this._createHandleArchetype().copy();
    (handle as any).cursor = 'pointer';
    (handle as any).alignment = Spot.TopCenter;
    (handle as any).alignmentFocus = Spot.Center;
    vPanel.add(handle);

    const line = new Shape();
    (line as any).figure = 'Rectangle';
    line.fill = 'dodgerblue';
    line.stroke = 'dodgerblue';
    line.strokeWidth = 1;
    line.width = 1;
    line.height = 20;
    vPanel.add(line);

    adornment.add(vPanel);

    (adornment as any)._actualBounds = bounds.copy();
    (adornment as any)._measuredBounds = new Rect(0, 0, bounds.width, bounds.height + 30);
    (adornment as any)._naturalBounds = new Rect(0, 0, bounds.width, bounds.height + 30);

    return adornment;
  }
}
