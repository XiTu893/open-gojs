import { Tool } from './Tool';
import { Point } from '../core/Point';
import { Map } from '../core/Map';
import { Set } from '../core/Set';
import { List } from '../core/List';
import type { Part } from '../view/Part';

export class DraggingTool extends Tool {

  private _isCopy: boolean = false;
  private _isCopyEnabled: boolean = true;
  private _startPoint: Point | null = null;
  private _draggedParts: Map<Part, Point> | null = null;
  private _copiedParts: Map<Part, Point> | null = null;
  private _isDragOut: boolean = false;
  private _targetDiagram: any = null;
  private _dragOutParts: Map<Part, Point> | null = null;
  private _globalMouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private _globalMouseUpHandler: ((e: MouseEvent) => void) | null = null;

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
    if (!(diagram as any).allowMove && !(diagram as any).allowCopy && !(diagram as any).allowDragOut) return false;
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
    this._isDragOut = false;
    this._targetDiagram = null;
    this._dragOutParts = null;
    const lastInput = (diagram as any).lastInput;
    this._startPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);

    this._draggedParts = new Map<Part, Point>();
    const selection = (diagram as any).selection;
    if (selection) {
      const selectedSet = new Set<Part>();
      const it0 = selection.iterator;
      while (it0.next()) {
        selectedSet.add(it0.value as Part);
      }
      const it = selection.iterator;
      while (it.next()) {
        const part = it.value as Part;
        const isDragOutSource = (diagram as any).allowDragOut && !part.movable;
        if (!part.movable && !part.copyable && !isDragOutSource) continue;
        let cg = part.containingGroup;
        let skip = false;
        while (cg) {
          if (selectedSet.contains(cg)) { skip = true; break; }
          cg = cg.containingGroup;
        }
        if (skip) continue;
        this._draggedParts.add(part, part.location.copy());
      }
    }

    this._isCopy = false;
    this._copiedParts = null;

    if ((diagram as any).allowDragOut) {
      this._setupGlobalListeners();
    }

    this.startTransaction(this.name);
  }

  doMouseMove(): void {
    const diagram = this.diagram;
    if (!diagram || !this.isActive || !this._startPoint) return;

    if (this._isDragOut && this._targetDiagram && this._dragOutParts) {
      const lastInput = (this._targetDiagram as any).lastInput;
      if (lastInput) {
        const point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        const it = this._dragOutParts.iterator;
        while (it.next()) {
          const part = it.key;
          const origLoc = it.value;
          const dx = point.x - this._startPoint.x;
          const dy = point.y - this._startPoint.y;
          part.move(new Point(origLoc.x + dx, origLoc.y + dy));
        }
        this._targetDiagram.requestUpdate();
      }
      return;
    }

    const lastInput = (diagram as any).lastInput;
    if (!lastInput) return;

    if ((diagram as any).allowDragOut && !this._isDragOut) {
      const div = (diagram as any).div;
      if (div && lastInput.event) {
        const evt = lastInput.event as MouseEvent;
        const rect = div.getBoundingClientRect();
        if (evt.clientX < rect.left || evt.clientX > rect.right ||
            evt.clientY < rect.top || evt.clientY > rect.bottom) {
          this._startDragOut(evt);
          return;
        }
      }
    }

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

    this._removeGlobalListeners();

    if (this._isDragOut) {
      this._finishDragOut();
      return;
    }

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
    this._removeGlobalListeners();
    this._startPoint = null;
    this._draggedParts = null;
    this._copiedParts = null;
    this._isCopy = false;
    this._isDragOut = false;
    this._targetDiagram = null;
    this._dragOutParts = null;
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

  private _startDragOut(evt: MouseEvent): void {
    const diagram = this.diagram;
    if (!diagram || !this._draggedParts) return;

    this._isDragOut = true;
    const target = this._findTargetDiagram(evt);
    if (!target) return;

    this._targetDiagram = target;
    this._dragOutParts = new Map<Part, Point>();

    const targetDocPoint = this._clientToDoc(target, evt);

    const it = this._draggedParts.iterator;
    while (it.next()) {
      const part = it.key;
      if (part.data) {
        const model = target.model;
        if (model) {
          const dataCopy = (model as any).cloneDeep(part.data);
          model.addNodeData(dataCopy);
          const newPart = target.findNodeForKey((model as any).getKeyForNodeData(dataCopy));
          if (newPart) {
            newPart.location = targetDocPoint.copy();
            this._dragOutParts.add(newPart, targetDocPoint.copy());
          }
        }
      }
    }

    this._startPoint = targetDocPoint;
  }

  private _finishDragOut(): void {
    if (this._targetDiagram && this._dragOutParts) {
      this._targetDiagram.raiseDiagramEvent('ExternalObjectsDropped');
      this._targetDiagram.requestUpdate();
    }

    const sourceDiagram = this.diagram;
    if (sourceDiagram) {
      if (this._draggedParts) {
        const it = this._draggedParts.iterator;
        while (it.next()) {
          it.key.location = it.value.copy();
        }
      }
    }

    this._isDragOut = false;
    this._targetDiagram = null;
    this._dragOutParts = null;
    this.stopTool();
  }

  private _findTargetDiagram(evt: MouseEvent): any {
    const elements = document.elementsFromPoint(evt.clientX, evt.clientY);
    for (const el of elements) {
      const div = el.closest('div');
      if (!div) continue;
      const diagram = (div as any)._goDiagram;
      if (diagram && diagram !== this.diagram) {
        return diagram;
      }
    }
    return null;
  }

  private _clientToDoc(diagram: any, evt: MouseEvent): Point {
    const div = diagram.div;
    if (!div) return new Point(0, 0);
    const rect = div.getBoundingClientRect();
    const viewX = evt.clientX - rect.left;
    const viewY = evt.clientY - rect.top;
    return diagram.transformViewToDoc(new Point(viewX, viewY));
  }

  private _setupGlobalListeners(): void {
    this._globalMouseMoveHandler = (e: MouseEvent) => {
      if (this._isDragOut && this._targetDiagram && this._dragOutParts) {
        const point = this._clientToDoc(this._targetDiagram, e);
        const it = this._dragOutParts.iterator;
        while (it.next()) {
          const part = it.key;
          const origLoc = it.value;
          const dx = point.x - this._startPoint!.x;
          const dy = point.y - this._startPoint!.y;
          part.move(new Point(origLoc.x + dx, origLoc.y + dy));
        }
        this._targetDiagram.requestUpdate();
      }
    };
    this._globalMouseUpHandler = (_e: MouseEvent) => {
      if (this._isDragOut) {
        this._removeGlobalListeners();
        this._finishDragOut();
      }
    };
    document.addEventListener('mousemove', this._globalMouseMoveHandler);
    document.addEventListener('mouseup', this._globalMouseUpHandler);
  }

  private _removeGlobalListeners(): void {
    if (this._globalMouseMoveHandler) {
      document.removeEventListener('mousemove', this._globalMouseMoveHandler);
      this._globalMouseMoveHandler = null;
    }
    if (this._globalMouseUpHandler) {
      document.removeEventListener('mouseup', this._globalMouseUpHandler);
      this._globalMouseUpHandler = null;
    }
  }
}
