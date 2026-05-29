/**
 * CommandHandler - handles keyboard and programmatic commands for a Diagram.
 * Provides canXxx() and doXxx() methods for each supported command.
 */
import { Point } from '../core/Point';

export class CommandHandler {

  private _diagram: any = null;
  private _isEnabled: boolean = true;
  private static _clipboard: any[] = [];

  // ============ Properties ============

  get diagram(): any {
    return this._diagram;
  }

  set diagram(val: any) {
    this._diagram = val;
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }

  set isEnabled(val: boolean) {
    this._isEnabled = val;
  }

  // ============ Delete ============

  canDeleteSelection(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    if (!this._diagram.allowDelete) return false;
    return this._diagram.selection.count > 0;
  }

  deleteSelection(): void {
    if (!this.canDeleteSelection()) return;
    this._diagram.startTransaction('delete selection');
    const selection = this._diagram.selection;
    const parts: any[] = [];
    const it = selection.iterator;
    while (it.next()) {
      parts.push(it.value);
    }

    const linksToRemove: any[] = [];
    const nodesToRemove: any[] = [];

    for (const part of parts) {
      if (!part.data) continue;
      if ((part as any)._className === 'Link') {
        linksToRemove.push(part.data);
      } else {
        nodesToRemove.push(part.data);
        const connectedLinks = this._diagram.findLinksConnected(part);
        if (connectedLinks) {
          const lit = connectedLinks.iterator;
          while (lit.next()) {
            const link = lit.value;
            if (link.data && linksToRemove.indexOf(link.data) < 0) {
              linksToRemove.push(link.data);
            }
          }
        }
      }
    }

    const model = this._diagram.model;
    const isGraphLinks = typeof (model as any).removeLinkData === 'function';
    for (const linkData of linksToRemove) {
      if (isGraphLinks) {
        (model as any).removeLinkData(linkData);
      }
    }
    for (const nodeData of nodesToRemove) {
      model.removeNodeData(nodeData);
    }

    this._diagram.commitTransaction('delete selection');
    this._diagram.raiseDiagramEvent('SelectionDeleted');
  }

  canCopy(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (!this._diagram.allowCopy) return false;
    if (!this._diagram.allowClipboard) return false;
    return this._diagram.selection.count > 0;
  }

  copySelection(): void {
    if (!this.canCopy()) return;
    CommandHandler._clipboard = [];
    const selection = this._diagram.selection;
    const it = selection.iterator;
    while (it.next()) {
      const part = it.value;
      if (part.data) {
        const dataCopy = JSON.parse(JSON.stringify(part.data));
        const isLink = (part as any)._className === 'Link';
        CommandHandler._clipboard.push({ data: dataCopy, isLink: isLink });
      }
    }
    this._diagram.raiseDiagramEvent('ClipboardChanged');
  }

  // ============ Cut ============

  canCut(): boolean {
    return this.canCopy() && this.canDeleteSelection();
  }

  cutSelection(): void {
    if (!this.canCut()) return;
    this.copySelection();
    this.deleteSelection();
  }

  // ============ Paste ============

  canPaste(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (!this._diagram.allowInsert) return false;
    if (!this._diagram.allowClipboard) return false;
    return true;
  }

  pasteSelection(): void {
    if (!this.canPaste()) return;
    if (CommandHandler._clipboard.length === 0) return;
    this._diagram.startTransaction('paste');
    const model = this._diagram.model;
    const offset = 20;
    const keyMap = new Map<any, any>();

    for (const item of CommandHandler._clipboard) {
      if (item.isLink) continue;
      const newData = JSON.parse(JSON.stringify(item.data));
      const oldKey = model.getKeyForNodeData(newData);
      if (newData.key !== undefined) {
        newData.key = model.makeKey ? model.makeKey() : model.makeUniqueKeyString ? model.makeUniqueKeyString() : newData.key + '_copy';
      }
      if (newData.loc !== undefined) {
        const parts = String(newData.loc).split(' ');
        const x = parseFloat(parts[0]) || 0;
        const y = parseFloat(parts[1]) || 0;
        newData.loc = (x + offset) + ' ' + (y + offset);
      }
      model.addNodeData(newData);
      if (oldKey !== undefined) {
        keyMap.set(oldKey, model.getKeyForNodeData(newData));
      }
    }

    const isGraphLinks = model.nodeDataArray !== undefined && typeof (model as any).addLinkData === 'function';
    if (isGraphLinks) {
      for (const item of CommandHandler._clipboard) {
        if (!item.isLink) continue;
        const newData = JSON.parse(JSON.stringify(item.data));
        const glm = model as any;
        const fromProp = glm.linkFromKeyProperty || 'from';
        const toProp = glm.linkToKeyProperty || 'to';
        const oldFrom = newData[fromProp];
        const oldTo = newData[toProp];
        if (keyMap.has(oldFrom)) newData[fromProp] = keyMap.get(oldFrom);
        if (keyMap.has(oldTo)) newData[toProp] = keyMap.get(oldTo);
        if (newData.loc !== undefined) {
          const parts = String(newData.loc).split(' ');
          const x = parseFloat(parts[0]) || 0;
          const y = parseFloat(parts[1]) || 0;
          newData.loc = (x + offset) + ' ' + (y + offset);
        }
        glm.addLinkData(newData);
      }
    }

    this._diagram.commitTransaction('paste');
  }

  // ============ Undo ============

  canUndo(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    const undoManager = this._diagram.undoManager;
    if (!undoManager) return false;
    return undoManager.canUndo;
  }

  undo(): void {
    if (!this.canUndo()) return;
    this._diagram.undoManager.undo();
  }

  // ============ Redo ============

  canRedo(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    const undoManager = this._diagram.undoManager;
    if (!undoManager) return false;
    return undoManager.canRedo;
  }

  redo(): void {
    if (!this.canRedo()) return;
    this._diagram.undoManager.redo();
  }

  // ============ Select All ============

  canSelectAll(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (!this._diagram.allowSelect) return false;
    return true;
  }

  selectAll(): void {
    if (!this.canSelectAll()) return;
    const parts: any[] = [];
    const layers = this._diagram._layers;
    for (const layer of layers) {
      if (layer.isTemporary) continue;
      const it = layer.parts;
      while (it.next()) {
        const part = it.value;
        if (part.selectable) {
          parts.push(part);
        }
      }
    }
    this._diagram.selectCollection({
      iterator: {
        _items: parts,
        _idx: 0,
        next() { if (this._idx < this._items.length) { this.value = this._items[this._idx++]; return true; } return false; },
        value: null as any
      }
    });
  }

  // ============ Zoom To Fit ============

  canZoomToFit(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (!this._diagram.allowZoom) return false;
    return true;
  }

  zoomToFit(): void {
    if (!this.canZoomToFit()) return;
    const db = this._diagram.documentBounds;
    const vs = this._diagram.viewSize;
    if (db.width === 0 || db.height === 0 || vs.width === 0 || vs.height === 0) return;
    const scale = Math.min(vs.width / db.width, vs.height / db.height);
    this._diagram.scale = scale;
    this._diagram.position = db.position;
  }

  // ============ Zoom In ============

  canZoomIn(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (!this._diagram.allowZoom) return false;
    return true;
  }

  zoomIn(): void {
    if (!this.canZoomIn()) return;
    this._diagram.scale = this._diagram.scale * 1.1;
  }

  // ============ Zoom Out ============

  canZoomOut(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (!this._diagram.allowZoom) return false;
    return true;
  }

  zoomOut(): void {
    if (!this.canZoomOut()) return;
    this._diagram.scale = this._diagram.scale / 1.1;
  }

  // ============ Group ============

  canGroupSelection(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    if (!this._diagram.allowGroup) return false;
    return this._diagram.selection.count > 0;
  }

  groupSelection(): void {
    if (!this.canGroupSelection()) return;
    // Stub: group selected parts
  }

  // ============ Ungroup ============

  canUngroupSelection(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    if (!this._diagram.allowUngroup) return false;
    return this._diagram.selection.count > 0;
  }

  ungroupSelection(): void {
    if (!this.canUngroupSelection()) return;
    // Stub: ungroup selected groups
  }

  // ============ Collapse SubGraph ============

  canCollapseSubGraph(group?: any): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    return true;
  }

  collapseSubGraph(group?: any): void {
    if (!this.canCollapseSubGraph(group)) return;
    const diagram = this._diagram;
    if (!diagram) return;
    diagram.startTransaction('collapseSubGraph');
    if (group && typeof group.isSubGraphExpanded !== 'undefined') {
      group.isSubGraphExpanded = false;
    } else {
      diagram.selection.each((part: any) => {
        if (part.isSubGraphExpanded !== undefined) {
          part.isSubGraphExpanded = false;
        }
      });
    }
    diagram.commitTransaction('collapseSubGraph');
  }

  // ============ Expand SubGraph ============

  canExpandSubGraph(group?: any): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    return true;
  }

  expandSubGraph(group?: any): void {
    if (!this.canExpandSubGraph(group)) return;
    const diagram = this._diagram;
    if (!diagram) return;
    diagram.startTransaction('expandSubGraph');
    if (group && typeof group.isSubGraphExpanded !== 'undefined') {
      group.isSubGraphExpanded = true;
    } else {
      diagram.selection.each((part: any) => {
        if (part.isSubGraphExpanded !== undefined) {
          part.isSubGraphExpanded = true;
        }
      });
    }
    diagram.commitTransaction('expandSubGraph');
  }

  // ============ Collapse Tree ============

  canCollapseTree(node?: any): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    return true;
  }

  collapseTree(node?: any): void {
    if (!this.canCollapseTree(node)) return;
    const diagram = this._diagram;
    if (!diagram) return;
    diagram.startTransaction('collapseTree');
    if (node && typeof node.isTreeExpanded !== 'undefined') {
      node.isTreeExpanded = false;
    } else {
      diagram.selection.each((part: any) => {
        if (part.isTreeExpanded !== undefined) {
          part.isTreeExpanded = false;
        }
      });
    }
    diagram.commitTransaction('collapseTree');
  }

  // ============ Expand Tree ============

  canExpandTree(node?: any): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    return true;
  }

  expandTree(node?: any): void {
    if (!this.canExpandTree(node)) return;
    const diagram = this._diagram;
    if (!diagram) return;
    diagram.startTransaction('expandTree');
    if (node && typeof node.isTreeExpanded !== 'undefined') {
      node.isTreeExpanded = true;
    } else {
      diagram.selection.each((part: any) => {
        if (part.isTreeExpanded !== undefined) {
          part.isTreeExpanded = true;
        }
      });
    }
    diagram.commitTransaction('expandTree');
  }

  // ============ Align ============

  canAlignSelection(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    return this._diagram.selection.count > 0;
  }

  alignSelection(alignment: string): void {
    if (!this.canAlignSelection()) return;
    // Stub: align selected parts
  }

  // ============ Rotate ============

  canRotate(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    if (!this._diagram.allowRotate) return false;
    return this._diagram.selection.count > 0;
  }

  rotate(angle: number): void {
    if (!this.canRotate()) return;
    // Stub: rotate selected parts by angle
  }

  // ============ Bring To Front ============

  canBringToFront(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    return this._diagram.selection.count > 0;
  }

  bringToFront(): void {
    if (!this.canBringToFront()) return;
    // Stub: bring selected parts to front
  }

  // ============ Send To Back ============

  canSendToBack(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    return this._diagram.selection.count > 0;
  }

  sendToBack(): void {
    if (!this.canSendToBack()) return;
    // Stub: send selected parts to back
  }

  canMoveSelection(): boolean {
    if (!this._isEnabled) return false;
    if (!this._diagram) return false;
    if (this._diagram.isReadOnly) return false;
    if (!this._diagram.allowMove) return false;
    return this._diagram.selection.count > 0;
  }

  moveSelection(dx: number, dy: number): void {
    if (!this.canMoveSelection()) return;
    this._diagram.startTransaction('move selection');
    const sel = this._diagram.selection;
    const it = sel.iterator;
    while (it.next()) {
      const part = it.value;
      if ((part as any)._className === 'Node' || (part as any)._className === 'Group') {
        const pos = part.position;
        if (pos) {
          part.move(new Point(pos.x + dx, pos.y + dy));
        }
      }
    }
    this._diagram.commitTransaction('move selection');
  }

  // ============ Keyboard Handling ============

  doKeyDown(): void {
    if (!this._isEnabled || !this._diagram) return;

    const e = this._diagram.lastInput;
    if (!e) return;

    const key = e.key;
    const control = e.control || e.meta;
    const shift = e.shift;

    if (control && key === 'z' && !shift) {
      if (this.canUndo()) this.undo();
    } else if (control && key === 'z' && shift) {
      if (this.canRedo()) this.redo();
    } else if (control && key === 'y') {
      if (this.canRedo()) this.redo();
    } else if (control && key === 'a') {
      if (this.canSelectAll()) this.selectAll();
    } else if (control && key === 'c') {
      if (this.canCopy()) this.copySelection();
    } else if (control && key === 'x') {
      if (this.canCut()) this.cutSelection();
    } else if (control && key === 'v') {
      if (this.canPaste()) this.pasteSelection();
    } else if (key === 'Delete' || key === 'Backspace') {
      if (this.canDeleteSelection()) this.deleteSelection();
    } else if (key === '+' || key === '=') {
      if (control && this.canZoomIn()) this.zoomIn();
    } else if (key === '-' || key === '_') {
      if (control && this.canZoomOut()) this.zoomOut();
    } else if (key === '0') {
      if (control && this.canZoomToFit()) this.zoomToFit();
    } else if (control && key === 'g') {
      if (shift) {
        if (this.canUngroupSelection()) this.ungroupSelection();
      } else {
        if (this.canGroupSelection()) this.groupSelection();
      }
    } else if (key === 'ArrowLeft') {
      if (this.canMoveSelection()) this.moveSelection(shift ? -10 : -1, 0);
    } else if (key === 'ArrowRight') {
      if (this.canMoveSelection()) this.moveSelection(shift ? 10 : 1, 0);
    } else if (key === 'ArrowUp') {
      if (this.canMoveSelection()) this.moveSelection(0, shift ? -10 : -1);
    } else if (key === 'ArrowDown') {
      if (this.canMoveSelection()) this.moveSelection(0, shift ? 10 : 1);
    }
  }
}
