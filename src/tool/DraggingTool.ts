import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Map } from '../core/Map';
import { List } from '../core/List';
import type { Part } from '../view/Part';

export class DraggingTool extends Tool {

  private _isCopy: boolean = false;
  private _isCopyEnabled: boolean = true;
  private _startPoint: Point | null = null;
  private _draggedParts: Map<Part, Point> | null = null;
  private _copiedParts: Map<Part, Point> | null = null;

  constructor() {
    super();
    this.name = 'Dragging';
  }

  get isCopy(): boolean { return this._isCopy; }
  set isCopy(val: boolean) { this._isCopy = val; }

  get isCopyEnabled(): boolean { return this._isCopyEnabled; }
  set isCopyEnabled(val: boolean) { this._isCopyEnabled = val; }

  get copiedParts(): Map<Part, Point> | null { return this._copiedParts; }
  set copiedParts(val: Map<Part, Point> | null) { this._copiedParts = val; }

  get draggedParts(): Map<Part, Point> | null { return this._draggedParts; }
  set draggedParts(val: Map<Part, Point> | null) { this._draggedParts = val; }

  mayCopy(): boolean {
    const diagram = this.diagram;
    if (!diagram) return false;
    if (!this._isCopyEnabled) return false;
    if (!(diagram as any).allowCopy) return false;
    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return false;
    return lastInput.control || lastInput.meta;
  }

  mayMove(): boolean {
    const diagram = this.diagram;
    if (!diagram) return false;
    if (!(diagram as any).allowMove) return false;
    return true;
  }

  canStart(): boolean {
    const diagram = this.diagram;
    if (!diagram || !this.isEnabled) return false;
    if (!(diagram as any).allowMove && !(diagram as any).allowCopy) return false;
    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return false;
    const part = diagram.findPartAt(new Point(lastInput.documentPoint.x, lastInput.documentPoint.y), true);
    if (!part) return false;
    if (!part.movable && !part.copyable) return false;
    return true;
  }

  doActivate(): void {
    const diagram = this.diagram;
    if (!diagram) return;

    this._isActive = true;
    const lastInput = (diagram as any).lastInput;
    this._startPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);

    this._draggedParts = new Map<Part, Point>();
    const selection = (diagram as any).selection;
    if (selection) {
      const it = selection.iterator;
      while (it.next()) {
        const part = it.value as Part;
        if (part.movable || part.copyable) {
          this._draggedParts.add(part, part.location.copy());
        }
      }
    }

    this._isCopy = false;
    this._copiedParts = null;

    this.startTransaction(this.name);
  }

  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive || !this._startPoint) return;

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    const wasCopy = this._isCopy;
    this._isCopy = this.mayCopy();

    if (this._isCopy && !wasCopy) {
      this._copyParts();
    } else if (!this._isCopy && wasCopy) {
      this._removeCopiedParts();
    }

    const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);

    if (this._isCopy && this._copiedParts) {
      const it = this._copiedParts.iterator;
      while (it.next()) {
        const part = it.key;
        const origLoc = it.value;
        const dx = point.x - this._startPoint.x;
        const dy = point.y - this._startPoint.y;
        part.move(new Point(origLoc.x + dx, origLoc.y + dy));
      }
    } else if (this._draggedParts) {
      const it = this._draggedParts.iterator;
      while (it.next()) {
        const part = it.key;
        const origLoc = it.value;
        const dx = point.x - this._startPoint.x;
        const dy = point.y - this._startPoint.y;
        const newLoc = this.computeMove(part, new Point(origLoc.x + dx, origLoc.y + dy));
        part.move(newLoc);
      }
    }

    diagram.requestUpdate();
  }

  doMouseUp(): void {
    if (!this.isActive) return;

    if (this._isCopy && this._copiedParts) {
      this._copiedParts = null;
    }

    this.transactionResult = this._isCopy ? 'Copy' : this.name;
    this.stopTool();

    const diagram = this.diagram;
    if (diagram) {
      diagram.raiseDiagramEvent(this._isCopy ? 'SelectionCopied' : 'SelectionMoved');
    }
  }

  doDeactivate(): void {
    this._startPoint = null;
    this._draggedParts = null;
    this._copiedParts = null;
    this._isCopy = false;
    super.doDeactivate();
  }

  doCancel(): void {
    if (this._copiedParts) {
      const diagram = this.diagram;
      if (diagram) {
        const it = this._copiedParts.iterator;
        while (it.next()) {
          diagram.remove(it.key);
        }
      }
      this._copiedParts = null;
    }
    if (this._draggedParts) {
      const it = this._draggedParts.iterator;
      while (it.next()) {
        it.key.location = it.value.copy();
      }
    }
    this._isCopy = false;
    super.doCancel();
  }

  computeMove(part: Part, newLoc: Point): Point {
    if ((part as any).dragComputation) {
      return (part as any).dragComputation(part, newLoc, newLoc);
    }
    return newLoc;
  }

  private _copyParts(): void {
    const diagram = this.diagram;
    if (!diagram || !this._draggedParts) return;

    this._copiedParts = new Map<Part, Point>();
    const copiedList = new List<Part>();
    const it = this._draggedParts.iterator;
    while (it.next()) {
      const part = it.key;
      if (!part.copyable) continue;

      if (part.data) {
        const model = diagram.model;
        const dataCopy = (model as any).cloneDeep(part.data);
        model.addNodeData(dataCopy);
        const newPart = diagram.findNodeForKey((model as any).getKeyForNodeData(dataCopy));
        if (newPart) {
          newPart.location = part.location.copy();
          this._copiedParts.add(newPart, part.location.copy());
          copiedList.add(newPart);
        }
      } else {
        const copy = part.copy() as Part;
        copy.location = part.location.copy();
        diagram.add(copy);
        this._copiedParts.add(copy, part.location.copy());
        copiedList.add(copy);
      }
    }

    diagram.selectCollection(copiedList);
  }

  private _removeCopiedParts(): void {
    const diagram = this.diagram;
    if (!diagram || !this._copiedParts) return;

    const it = this._copiedParts.iterator;
    while (it.next()) {
      diagram.remove(it.key);
    }
    this._copiedParts = null;
  }
}
