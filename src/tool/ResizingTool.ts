import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { Spot } from '../core/Spot';
import { GraphObject } from '../view/GraphObject';
import { Shape } from '../view/Shape';
import { Panel } from '../view/Panel';
import { Adornment } from '../view/Adornment';
import { PanelAuto, StretchFill } from '../core/EnumValues';

export class ResizingTool extends Tool {

  private _handle: GraphObject | null = null;
  private _adornedElement: GraphObject | null = null;
  private _minSize: Size = new Size(0, 0);
  private _maxSize: Size = new Size(Infinity, Infinity);
  private _originalBounds: any = null;
  private _resizeObjectName: string = '';
  protected _handleArchetype: GraphObject | null = null;

  constructor() {
    super();
    this.name = 'Resizing';
    this._handleArchetype = this._createHandleArchetype();
  }

  private _createHandleArchetype(): GraphObject {
    const handle = new Shape();
    (handle as any).figure = 'Rectangle';
    (handle as any).fill = 'dodgerblue';
    (handle as any).stroke = 'white';
    (handle as any).desiredSize = new Size(7, 7);
    (handle as any).cursor = 'move';
    return handle;
  }

  get handle(): GraphObject | null { return this._handle; }
  set handle(val: GraphObject | null) { this._handle = val; }

  get adornedElement(): GraphObject | null { return this._adornedElement; }
  set adornedElement(val: GraphObject | null) { this._adornedElement = val; }

  get minSize(): Size { return this._minSize; }
  set minSize(val: Size) { this._minSize = val; }

  get maxSize(): Size { return this._maxSize; }
  set maxSize(val: Size) { this._maxSize = val; }

  get handleArchetype(): GraphObject | null { return this._handleArchetype; }
  set handleArchetype(val: GraphObject | null) { this._handleArchetype = val; }

  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;
    if (!(diagram as any).allowResize) return false;

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
        if (this._adornedElement) {
          this._originalBounds = this._adornedElement.getDocumentBounds().copy();
        }
      }
    }

    this.startTransaction(this.name);
  }

  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive || !this._adornedElement) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
    const newSize = this.computeResize(this._adornedElement, point);

    this._adornedElement.desiredSize = newSize;
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
    this._originalBounds = null;
    super.doDeactivate();
  }

  computeResize(element: GraphObject, newPoint: Point): Size {
    const currentSize = element.desiredSize;
    let w = currentSize.width;
    let h = currentSize.height;

    if (this._originalBounds) {
      const dx = newPoint.x - this._originalBounds.x;
      const dy = newPoint.y - this._originalBounds.y;
      w = Math.abs(dx);
      h = Math.abs(dy);
    }

    w = Math.max(this._minSize.width, Math.min(this._maxSize.width, w));
    h = Math.max(this._minSize.height, Math.min(this._maxSize.height, h));

    return new Size(w, h);
  }

  updateAdornments(part: any): void {
    if (!part) return;
    const diagram = this.diagram;
    if (!diagram) return;

    const category = 'Resizing';
    const existingAd = part.getAdornment(category);

    if (!part.isSelected || !(diagram as any).allowResize) {
      if (existingAd) {
        part.removeAdornment(category);
        const adLayer = (diagram as any).findLayer('Adornment');
        if (adLayer) adLayer.remove(existingAd);
      }
      return;
    }

    const adornedObj = this._resizeObjectName
      ? part.findObject(this._resizeObjectName)
      : part;

    if (!adornedObj) return;

    const bounds = adornedObj.getDocumentBounds();
    if (bounds.width <= 0 || bounds.height <= 0) return;

    const adornment = this._makeResizeAdornment(adornedObj, bounds);
    part.addAdornment(category, adornment);

    const adLayer = (diagram as any).findLayer('Adornment');
    if (adLayer) {
      if (existingAd) adLayer.remove(existingAd);
      adLayer.add(adornment);
    }
  }

  private _makeResizeAdornment(adornedObj: GraphObject, bounds: Rect): Adornment {
    const adornment = new Adornment();
    (adornment as any).category = 'Resizing';
    adornment.adornedObject = adornedObj;

    const spotPanel = new Panel();
    (spotPanel as any)._type = PanelAuto;

    const bg = new Shape();
    (bg as any).figure = 'Rectangle';
    bg.fill = 'transparent';
    bg.stroke = 'dodgerblue';
    bg.strokeWidth = 1;
    bg.strokeDashArray = [3, 3];
    bg.isPanelMain = true;
    bg.stretch = StretchFill;
    spotPanel.add(bg);

    const positions: Array<{ align: string; cursor: string }> = [
      { align: 'TopLeft', cursor: 'nw-resize' },
      { align: 'Top', cursor: 'n-resize' },
      { align: 'TopRight', cursor: 'ne-resize' },
      { align: 'Right', cursor: 'e-resize' },
      { align: 'BottomRight', cursor: 'se-resize' },
      { align: 'Bottom', cursor: 's-resize' },
      { align: 'BottomLeft', cursor: 'sw-resize' },
      { align: 'Left', cursor: 'w-resize' },
    ];

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const handle = this._handleArchetype ? this._handleArchetype.copy() : this._createHandleArchetype().copy();
      (handle as any).cursor = pos.cursor;
      (handle as any)._alignmentIndex = i;
      (handle as any)._alignmentName = pos.align;

      const alignMap: Record<string, any> = {
        'TopLeft': { x: 0, y: 0 },
        'Top': { x: 0.5, y: 0 },
        'TopRight': { x: 1, y: 0 },
        'Right': { x: 1, y: 0.5 },
        'BottomRight': { x: 1, y: 1 },
        'Bottom': { x: 0.5, y: 1 },
        'BottomLeft': { x: 0, y: 1 },
        'Left': { x: 0, y: 0.5 },
      };
      const alignPos = alignMap[pos.align];
      if (alignPos) {
        (handle as any).alignment = new Spot(alignPos.x, alignPos.y);
        (handle as any).alignmentFocus = new Spot(0.5, 0.5);
      }

      spotPanel.add(handle);
    }

    adornment.add(spotPanel);

    (adornment as any)._actualBounds = bounds.copy();
    (adornment as any)._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
    (adornment as any)._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);

    return adornment;
  }
}
