import { Diagram } from '../diagram/Diagram';
import { InputEvent } from '../diagram/InputEvent';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import type { GraphObject } from '../view/GraphObject';
import type { Adornment } from '../view/Adornment';

/**
 * Tool - base class for all interactive tools in the diagram.
 * Provides virtual methods for mouse/keyboard/touch event handling,
 * transaction management, and standard interaction patterns.
 */
export class Tool {

  protected _diagram: Diagram | null = null;
  protected _isActive: boolean = false;
  private _isEnabled: boolean = true;
  private _name: string = '';
  private _transactionResult: string | null = null;

  constructor() { }

  // ============ Properties ============

  get diagram(): Diagram | null { return this._diagram; }
  set diagram(val: Diagram | null) { this._diagram = val; }

  get isActive(): boolean { return this._isActive; }
  set isActive(val: boolean) { this._isActive = val; }

  get isEnabled(): boolean { return this._isEnabled; }
  set isEnabled(val: boolean) { this._isEnabled = val; }

  get name(): string { return this._name; }
  set name(val: string) { this._name = val; }

  get transactionResult(): string | null { return this._transactionResult; }
  set transactionResult(val: string | null) { this._transactionResult = val; }

  // ============ Virtual Methods ============

  /** Whether this tool can start operating at the current input event. */
  canStart(): boolean {
    return false;
  }

  /** Called when this tool becomes the current tool. */
  doActivate(): void { }

  /** Cancel the tool's operation. */
  doCancel(): void {
    this.doDeactivate();
  }

  /** Called when this tool is no longer the current tool. */
  doDeactivate(): void {
    this._isActive = false;
  }

  /** Handle key-down events. */
  doKeyDown(): void { }

  /** Handle key-up events. */
  doKeyUp(): void { }

  /** Handle mouse-down events. */
  doMouseDown(): void { }

  /** Handle mouse-move events. */
  doMouseMove(): void { }

  /** Handle mouse-up events. */
  doMouseUp(): void { }

  /** Handle mouse-wheel events. */
  doMouseWheel(): void { }

  /** Called when this tool first starts. */
  doStart(): void { }

  /** Called when this tool stops. */
  doStop(): void { }

  /** Wait after a period of inactivity (e.g. for hover). */
  doWaitAfter(): void { }

  /** Whether multi-touch gestures can start this tool. */
  canStartMultiTouch(): boolean {
    return false;
  }

  /** Cancel any pending wait-after timer. */
  cancelWaitAfter(): void { }

  /** Find a tool handle at the given document point. */
  findToolHandleAt(p: Point): any | null {
    const diagram = this._diagram;
    if (!diagram) return null;

    const adornmentLayer = (diagram as any).findLayer('Adornment');
    if (!adornmentLayer) return null;

    const toolName = this._name;
    const partsIt = adornmentLayer.parts;
    const partsArray = partsIt.toArray();
    for (let i = partsArray.length - 1; i >= 0; i--) {
      const ad: Adornment = partsArray[i];
      if (!ad.visible) continue;
      const cat = (ad as any).category;
      if (cat && cat !== toolName) continue;

      const adornedPart = ad.adornedPart;
      if (!adornedPart) continue;

      const adornedBounds = adornedPart.getDocumentBounds();
      const localX = p.x - adornedBounds.x;
      const localY = p.y - adornedBounds.y;

      const found = this._findHandleInPanel(ad, localX, localY);
      if (found) return found;
    }
    return null;
  }

  private _findHandleInPanel(panel: any, x: number, y: number): GraphObject | null {
    const elements = panel._elements;
    if (!elements) return null;
    for (let i = elements.length - 1; i >= 0; i--) {
      const elem = elements[i];
      if (!elem.visible) continue;
      const bounds = elem.actualBounds;
      if (bounds.containsPoint(new Point(x, y))) {
        if ((elem as any)._elements && (elem as any)._elements.length > 0) {
          const inner = this._findHandleInPanel(elem, x - bounds.x, y - bounds.y);
          if (inner) return inner;
        }
        return elem;
      }
    }
    return null;
  }

  /** Whether the distance between two points exceeds the drag threshold. */
  isBeyondDragSize(first: Point, second: Point): boolean {
    const dx = Math.abs(first.x - second.x);
    const dy = Math.abs(first.y - second.y);
    return dx > 2 || dy > 2;
  }

  /** Standard mouse click behavior: select and raise click event. */
  standardMouseClick(): void { }

  /** Standard mouse select behavior: select parts on click. */
  standardMouseSelect(): void { }

  /** Standard mouse wheel behavior: zoom in/out. */
  standardMouseWheel(): void { }

  /** Standard pinch zoom start for multi-touch. */
  standardPinchZoomStart(): void { }

  /** Standard pinch zoom move for multi-touch. */
  standardPinchZoomMove(): void { }

  /** Standard wait-after behavior: schedule a timer. */
  standardWaitAfter(delay: number): void { }

  // ============ Transaction Methods ============

  /** Start a new transaction. */
  startTransaction(tname?: string): boolean {
    if (this._diagram) {
      return this._diagram.startTransaction(tname || this._name);
    }
    return false;
  }

  /** Stop this tool and remove it from the ToolManager. */
  stopTool(): void {
    this.doStop();
    if (this._diagram) {
      const tm = (this._diagram as any).toolManager;
      if (tm) {
        tm.currentTool = tm.defaultTool;
      }
    }
  }

  /** Stop the current transaction. */
  stopTransaction(): boolean {
    if (this._diagram) {
      const result = this._transactionResult;
      if (result !== null) {
        return this._diagram.commitTransaction(this._name);
      } else {
        return this._diagram.rollbackTransaction();
      }
    }
    return false;
  }

  /** Update adornments for relevant parts. */
  updateAdornments(part: any): void { }
}
