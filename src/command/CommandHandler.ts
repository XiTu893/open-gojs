/**
 * CommandHandler - handles keyboard and programmatic commands for a Diagram.
 * Provides canXxx() and doXxx() methods for each supported command.
 */
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Set } from '../core/Set';
import { List } from '../core/List';
import { Map } from '../core/Map';
import type { GraphObject } from '../view/GraphObject';
import type { Part } from '../view/Part';
import { Diagram } from '../diagram/Diagram';
import { InputEvent } from '../diagram/InputEvent';
import { Adornment } from '../view/Adornment';

export class CommandHandler {
  static readonly className: string = "CommandHandler";

  private _diagram: any = null;
  private _isEnabled: boolean = true;
  private static _clipboard: any[] = [];
  /** 官方 `Diagram.Tb`：剪贴板内容对应的 model.dataFormat（paste 前要核对） */
  private static _clipboardFormat: string | null = null;

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
    CommandHandler._clipboardFormat = this._diagram && this._diagram.model ? this._diagram.model.dataFormat : null;
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
    if (this._diagram.isReadOnly || this._diagram.isModelReadOnly) return false;
    if (!this._diagram.allowUndo) return false;
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
    if (this._diagram.isReadOnly || this._diagram.isModelReadOnly) return false;
    if (!this._diagram.allowUndo) return false;
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

  /**
   * 官方 `model.Dh()`：GraphLinksModel 支持组/链接结构（基类 Model 与 TreeModel 返回 false）。
   * canGroup/canUngroup 以此为门。model 实例没有 `_className` 字段（那是 GraphObject 家族的），
   * 走 constructor 上的 static className。
   */
  private _modelSupportsGroups(): boolean {
    const m: any = this._diagram ? this._diagram.model : null;
    return !!m && !!(m.constructor && m.constructor.className === 'GraphLinksModel');
  }

  canGroupSelection(): boolean {
    const d: any = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (d.isReadOnly || d.isModelReadOnly) return false;
    if (!d.allowInsert || !d.allowGroup) return false;
    if (!this._modelSupportsGroups()) return false;
    if (this._archetypeGroupData === null) return false;
    const it = d.selection.iterator;
    while (it.next()) {
      const p = it.value;
      if (p && typeof p.canGroup === 'function' && p.canGroup()) return true;
    }
    return false;
  }

  groupSelection(): void {
    if (!this.canGroupSelection()) return;
    // Stub: group selected parts
  }

  // ============ Ungroup ============

  canUngroupSelection(part: any = null): boolean {
    const d: any = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (d.isReadOnly || d.isModelReadOnly) return false;
    if (!d.allowDelete || !d.allowUngroup) return false;
    if (!this._modelSupportsGroups()) return false;
    if (part !== null && part !== undefined) {
      // 官方：`t instanceof Group && t.canUngroup()`
      if ((part as any)._className !== 'Group') return false;
      return part.canUngroup();
    }
    const it = d.selection.iterator;
    while (it.next()) {
      const p = it.value;
      if (p && p._className === 'Group' && p.canUngroup()) return true;
    }
    return false;
  }

  ungroupSelection(): void {
    if (!this.canUngroupSelection()) return;
    // Stub: ungroup selected groups
  }

  // ============ Edit Text ============

  /**
   * 官方 `canEditTextBlock(t=null)`：
   * `isReadOnly||isModelReadOnly||!allowTextEdit||!toolManager.findTool("TextEditing") → false`；
   * t 指定时须为 TextBlock 且其 Part.canEdit()；否则选中任一 Part canEdit 且
   * findInVisualTree 内存在 editable TextBlock。
   */
  canEditTextBlock(part: any = null): boolean {
    const d: any = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (d.isReadOnly || d.isModelReadOnly) return false;
    if (!d.allowTextEdit) return false;
    if (!d.toolManager || typeof d.toolManager.findTool !== 'function' || !d.toolManager.findTool('TextEditing')) return false;
    if (part !== null && part !== undefined) {
      if ((part as any)._className !== 'TextBlock') return false;
      const p = part.part;
      return p !== null && p !== undefined && p.canEdit();
    }
    const it = d.selection.iterator;
    while (it.next()) {
      const p = it.value;
      if (p && typeof p.canEdit === 'function' && p.canEdit() && typeof p.findInVisualTree === 'function') {
        const tb = p.findInVisualTree((n: any) => n && n._className === 'TextBlock' && n.editable);
        if (tb !== null) return true;
      }
    }
    return false;
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

  // ============ 官方 CommandHandler.memberValidation / isValidMember ============

  private _memberValidation: ((group: any, part: any) => boolean) | null = null;

  /** 官方 `CommandHandler.memberValidation`（默认 null） */
  get memberValidation(): ((group: any, part: any) => boolean) | null {
    return this._memberValidation;
  }
  set memberValidation(val: ((group: any, part: any) => boolean) | null) {
    const old = this._memberValidation;
    if (old === val) return;
    this._memberValidation = val;
  }

  /**
   * 官方 `CommandHandler.isValidMember(group, part)`。
   * group 为 null 时跳过 group 侧校验（Node.isValidMember/GraphLinksModel.isValidLink 同源语义）。
   */
  isValidMember(group: any, part: any): boolean {
    if (part === null || part === undefined || group === part || (part as any)._className === 'Link') return false;
    let e: any;
    if (group !== null && group !== undefined) {
      const gd = group.data === undefined ? null : group.data;
      const pd = part.data === undefined ? null : part.data;
      if (group === part ||
        (typeof group.isMemberOf === 'function' && group.isMemberOf(part)) ||
        ((e = group.memberValidation) !== null && e !== undefined && !e(group, part)) ||
        (gd === null && pd !== null) ||
        (gd !== null && pd === null)) {
        return false;
      }
    }
    e = this._memberValidation;
    return e !== null ? e(group, part) : true;
  }

  // ============ 官方 CommandHandler API 对齐（阶段 6） ============

  // ---- 静态成员 ----
  private static _modifierNames: Array<string> = ['Ctrl', 'Shft', 'Alt', 'Meta'];

  static getModifierNames(): Array<string> {
    return CommandHandler._modifierNames;
  }
  static setModifierNames(names: Array<string>): void {
    CommandHandler._modifierNames = names;
  }

  // ---- 复制/删除 相关属性 ----
  private _copiesConnectedLinks: boolean = true;
  private _deletesConnectedLinks: boolean = true;
  private _copiesTree: boolean = false;
  private _deletesTree: boolean = false;
  private _copiesParentKey: boolean = false;
  private _copiesGroupKey: boolean = false;
  private _copiesClipboardData: boolean = true;
  private _storageLocation: 'memory' | 'sessionStorage' | 'localStorage' | 'systemClipboard' = 'memory';
  private _archetypeGroupData: any = null;
  private _zoomFactor: number = 1.05;
  private _isZoomToFitRestoreEnabled: boolean = false;
  private _defaultScale: number = NaN;

  get copiesConnectedLinks(): boolean { return this._copiesConnectedLinks; }
  set copiesConnectedLinks(val: boolean) { this._copiesConnectedLinks = val; }
  get deletesConnectedLinks(): boolean { return this._deletesConnectedLinks; }
  set deletesConnectedLinks(val: boolean) { this._deletesConnectedLinks = val; }
  get copiesTree(): boolean { return this._copiesTree; }
  set copiesTree(val: boolean) { this._copiesTree = val; }
  get deletesTree(): boolean { return this._deletesTree; }
  set deletesTree(val: boolean) { this._deletesTree = val; }
  get copiesParentKey(): boolean { return this._copiesParentKey; }
  set copiesParentKey(val: boolean) { this._copiesParentKey = val; }
  get copiesGroupKey(): boolean { return this._copiesGroupKey; }
  set copiesGroupKey(val: boolean) { this._copiesGroupKey = val; }
  get copiesClipboardData(): boolean { return this._copiesClipboardData; }
  set copiesClipboardData(val: boolean) { this._copiesClipboardData = val; }
  get storageLocation(): 'memory' | 'sessionStorage' | 'localStorage' | 'systemClipboard' { return this._storageLocation; }
  set storageLocation(val: 'memory' | 'sessionStorage' | 'localStorage' | 'systemClipboard') { this._storageLocation = val; }
  get archetypeGroupData(): any { return this._archetypeGroupData; }
  set archetypeGroupData(val: any) { this._archetypeGroupData = val; }
  get zoomFactor(): number { return this._zoomFactor; }
  set zoomFactor(val: number) { this._zoomFactor = val; }
  get isZoomToFitRestoreEnabled(): boolean { return this._isZoomToFitRestoreEnabled; }
  set isZoomToFitRestoreEnabled(val: boolean) { this._isZoomToFitRestoreEnabled = val; }
  get defaultScale(): number {
    const d = this._diagram;
    return (d && typeof d.defaultScale === 'number') ? d.defaultScale : this._defaultScale;
  }
  set defaultScale(val: number) {
    const d = this._diagram;
    if (d && 'defaultScale' in d) d.defaultScale = val;
    else this._defaultScale = val;
  }

  // ---- 生命周期 ----
  doStart(): void { }
  doStop(): void { }

  // ---- 拷贝/粘贴（官方命名入口，复用已有内存剪贴板实现） ----
  canCopySelection(): boolean {
    const d = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (d.isReadOnly || (d as any).isModelReadOnly) return false;
    if (!d.allowCopy || !d.allowClipboard) return false;
    return d.selection.count > 0;
  }

  canCutSelection(): boolean {
    const d = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (d.isReadOnly || (d as any).isModelReadOnly) return false;
    if (!d.allowCopy || !d.allowDelete || !d.allowClipboard) return false;
    return d.selection.count > 0;
  }

  canPasteSelection(pos?: Point): boolean {
    const d = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (d.isReadOnly || (d as any).isModelReadOnly) return false;
    if (!d.allowInsert || !d.allowClipboard) return false;
    if (this._storageLocation === 'systemClipboard') return true;
    if (this._storageLocation !== 'memory') {
      try {
        const s: any = (globalThis as any)[this._storageLocation];
        if (!s) return false;
        const e = s.getItem('gojs-copy');
        const n = s.getItem('gojs-dataFormat');
        return !(e === null || e === '' || n !== d.model.dataFormat);
      } catch {
        return false;
      }
    }
    // memory：剪贴板为空或格式不符 → 不可粘贴
    // （customContextMenu 右键菜单 paste 项：官方空剪贴板隐藏，我方早先恒 true 多显示一项）
    if (CommandHandler._clipboard === null || CommandHandler._clipboard.length === 0) return false;
    if (CommandHandler._clipboardFormat !== null && CommandHandler._clipboardFormat !== d.model.dataFormat) return false;
    return true;
  }

pasteSelectionAsync(pos?: Point): void {
    this.pasteSelection();
  }

  /**
   * 计算给定 Part 集合中实际要移动/拷贝的集合。
   * 返回 Map<Part, {point}>。这里复用 Diagram 的连通/组内/树扩展能力（若存在），否则退化为原集合。
   */
  computeEffectiveCollection(parts: Iterable<any>, options?: any): Map<any, any> {
    const result = new Map<any, any>();
    const d: any = this._diagram;
    if (typeof d.findPartsConnected === 'function') {
      const connected = d.findPartsConnected(parts);
      const it = connected.iterator;
      while (it.next()) {
        const p = it.value;
        result.add(p, { point: new Point(p.position.x, p.position.y) });
      }
      return result;
    }
    const iter: any = (parts as any) && (parts as any).iterator ? (parts as any).iterator() : parts;
    if (iter && iter.next) {
      while (iter.next()) {
        const p = iter.value;
        if (p && !result.has(p)) {
          result.add(p, { point: new Point(p.position.x, p.position.y) });
        }
      }
    }
    return result;
  }

  copyToClipboard(coll: any): void {
    if (coll === null) {
      CommandHandler._clipboard = [];
      CommandHandler._clipboardFormat = null;
      return;
    }
    CommandHandler._clipboard = [];
    CommandHandler._clipboardFormat = this._diagram && this._diagram.model ? this._diagram.model.dataFormat : null;
    const iter: any = coll && coll.iterator ? coll.iterator() : coll;
    if (iter && iter.next) {
      while (iter.next()) {
        const part = iter.value;
        if (part && part.data) {
          const dataCopy = JSON.parse(JSON.stringify(part.data));
          const isLink = (part as any)._className === 'Link';
          CommandHandler._clipboard.push({ data: dataCopy, isLink: isLink });
        }
      }
    }
    if (this._diagram) this._diagram.raiseDiagramEvent('ClipboardChanged');
  }

  pasteFromClipboard(): any {
    const pasted = new (Set as any)();
    if (!this._diagram || CommandHandler._clipboard.length === 0) return pasted;
    const d = this._diagram;
    const offset = 20;
    const model = d.model;
    const keyMap = new Map<any, any>();
    for (const item of CommandHandler._clipboard) {
      if (item.isLink) continue;
      const newData = JSON.parse(JSON.stringify(item.data));
      const oldKey = model.getKeyForNodeData(newData);
      if (newData.key !== undefined) {
        newData.key = model.makeKey ? model.makeKey() : (model.makeUniqueKeyString ? model.makeUniqueKeyString() : (newData.key + '_copy'));
      }
      if (newData.loc !== undefined) {
        const parts = String(newData.loc).split(' ');
        newData.loc = ((parseFloat(parts[0]) || 0) + offset) + ' ' + ((parseFloat(parts[1]) || 0) + offset);
      }
      model.addNodeData(newData);
      if (oldKey !== undefined) keyMap.add(oldKey, model.getKeyForNodeData(newData));
    }
    if (model.nodeDataArray !== undefined && typeof model.addLinkData === 'function') {
      for (const item of CommandHandler._clipboard) {
        if (!item.isLink) continue;
        const newData = JSON.parse(JSON.stringify(item.data));
        const fromProp = model.linkFromKeyProperty || 'from';
        const toProp = model.linkToKeyProperty || 'to';
        if (keyMap.has(newData[fromProp])) newData[fromProp] = keyMap.get(newData[fromProp]);
        if (keyMap.has(newData[toProp])) newData[toProp] = keyMap.get(newData[toProp]);
        if (newData.loc !== undefined) {
          const parts = String(newData.loc).split(' ');
          newData.loc = ((parseFloat(parts[0]) || 0) + offset) + ' ' + ((parseFloat(parts[1]) || 0) + offset);
        }
        model.addLinkData(newData);
      }
    }
    return pasted;
  }

  // ---- 缩放进位 ----
  canDecreaseZoom(factor?: number): boolean {
    const d = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (!d.allowZoom) return false;
    const f = (typeof factor === 'number') ? factor : (1 / this._zoomFactor);
    const newScale = d.scale * f;
    return newScale >= d.minScale && newScale <= d.maxScale;
  }

  decreaseZoom(factor?: number): void {
    if (!this.canDecreaseZoom(factor)) return;
    const f = (typeof factor === 'number') ? factor : (1 / this._zoomFactor);
    this._diagram.scale = this._diagram.scale * f;
  }

  canIncreaseZoom(factor?: number): boolean {
    const d = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (!d.allowZoom) return false;
    const f = (typeof factor === 'number') ? factor : this._zoomFactor;
    const newScale = d.scale * f;
    return newScale >= d.minScale && newScale <= d.maxScale;
  }

  increaseZoom(factor?: number): void {
    if (!this.canIncreaseZoom(factor)) return;
    const f = (typeof factor === 'number') ? factor : this._zoomFactor;
    this._diagram.scale = this._diagram.scale * f;
  }

  canResetZoom(newscale?: number): boolean {
    const d = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (!d.allowZoom) return false;
    const s = (typeof newscale === 'number') ? newscale : this.defaultScale;
    return s >= d.minScale && s <= d.maxScale;
  }

  resetZoom(newscale?: number): void {
    if (!this.canResetZoom(newscale)) return;
    const s = (typeof newscale === 'number') ? newscale : this.defaultScale;
    this._diagram.scale = s;
  }

  // ---- 滚动到部件 ----
  /** 官方 `canScrollToPart(t=null)`：t 非 Part → false；无选中且无高亮 → false；否则看横纵滚动许可 */
  canScrollToPart(part?: any): boolean {
    const d = this._diagram;
    if (!this._isEnabled || !d) return false;
    if (part !== null && part !== undefined) {
      // 官方 `t instanceof Part`；本项目实例用 `_className`（constructor.name 风格字段）
      const cn = (part as any)._className;
      if (cn !== 'Link' && cn !== 'Node' && cn !== 'Group' && cn !== 'Part' && cn !== 'Adornment') return false;
    }
    if (d.selection.count === 0 && (!d.highlighteds || d.highlighteds.count === 0)) return false;
    return !!(d.allowHorizontalScroll && d.allowVerticalScroll);
  }

  private _scrollToPartPause: number = 200;

  get scrollToPartPause(): number { return this._scrollToPartPause; }
  set scrollToPartPause(val: number) { this._scrollToPartPause = val; }

  scrollToPart(part?: any): void {
    if (!this.canScrollToPart(part)) return;
    const d = this._diagram;
    d.ensureBounds();
    let p = part;
    if (!p) {
      const it = d.selection.iterator;
      if (it.next()) p = it.value;
    }
    if (!p) return;
    // 官方 scrollToPart 主路径：直接 centerRect(t.actualBounds)。
    // 早期实现把单个 part 传给 computePartsBounds——官方 computePartsBounds
    // 只接受集合，单 part 走迭代器分支拿不到任何项，空集返回 NaN 矩形，
    // position 变成 NaN（animatedFocus 视口整个丢失）。
    const r = p.actualBounds;
    if (r) d.centerRect(r);
  }

  // ---- 文本编辑 ----
  editTextBlock(textblock?: any): void {
    if (!this.canEditTextBlock(textblock)) return;
    const d: any = this._diagram;
    const tm: any = d.toolManager;
    if (!tm || typeof tm.startTransaction !== 'function') return;
    tm.startTransaction('editTextBlock');
    tm.currentTool = tm.textEditingTool;
    if (tm.textEditingTool) tm.textEditingTool.doActivate();
    tm.commitTransaction('editTextBlock');
  }

  // ---- 上下文菜单 ----
  canShowContextMenu(obj?: any): boolean {
    const d = this._diagram;
    if (!this._isEnabled || !d) return false;
    return true;
  }

  showContextMenu(obj?: any): void {
    if (!this.canShowContextMenu(obj)) return;
    const d: any = this._diagram;
    const tm: any = d.toolManager;
    if (!tm || !tm.contextMenuTool) return;
    const cmt = tm.contextMenuTool;
    if (obj && typeof obj.contextMenu !== 'undefined') {
      cmt.currentObject = obj;
      if (cmt.currentContextMenu === null) cmt.currentContextMenu = obj.contextMenu;
      cmt.showMenu(obj.contextMenu);
    } else {
      let first: any = null;
      const it = d.selection.iterator;
      if (it.next()) first = it.value;
      const target = first || d;
      cmt.currentObject = target;
      cmt.currentContextMenu = target.contextMenu;
      cmt.showMenu(target.contextMenu);
    }
  }

  // ---- 停止命令 ----
  canStopCommand(): boolean { return true; }

  stopCommand(): void {
    if (!this.canStopCommand()) return;
    const d: any = this._diagram;
    if (!d) return;
    const tm = d.toolManager;
    if (tm && tm.currentTool && tm.currentTool !== tm && typeof tm.currentTool.doCancel === 'function') {
      tm.currentTool.doCancel();
    }
  }

  // ---- SVG 下载 ----
  canDownloadSvg(options?: any): boolean {
    const d = this._diagram;
    return !!(this._isEnabled && d);
  }

  downloadSVG(options?: any): void { this.downloadSvg(options); }

  downloadSvg(options?: any): void {
    if (!this.canDownloadSvg(options)) return;
    const d: any = this._diagram;
    const name = (options && typeof options.name === 'string') ? options.name : 'diagram.svg';
    if (typeof d.makeSVG !== 'function') {
      if (d.div) {
        const data = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        this._downloadData(name, data, 'image/svg+xml');
      }
      return;
    }
    try {
      const svg = d.makeSVG(options);
      const xml = new XMLSerializer().serializeToString(svg);
      this._downloadData(name, xml, 'image/svg+xml');
    } catch {
      /* ignore */
    }
  }

  private _downloadData(name: string, data: string, type: string): void {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---- 顶层部件 ----
  addTopLevelParts(coll: any, check?: boolean): boolean {
    const d: any = this._diagram;
    if (!d) return false;
    let ok = true;
    const iter: any = coll && coll.iterator ? coll.iterator() : coll;
    const toRemove: any[] = [];
    if (iter && iter.next) {
      while (iter.next()) {
        const part = iter.value;
        if (!part || (part as any)._className === 'Link') continue;
        if (check && !this.isValidMember(null, part)) { ok = false; continue; }
        toRemove.push(part);
      }
    }
    for (const p of toRemove) {
      p.containingGroup = null;
    }
    return ok;
  }

  // ---- toString ----
  toString(): string {
    return (this as any).className || 'CommandHandler';
  }

  // ============ 焦点（Focus）与虚拟指针（Virtual Pointer）子系统 ============
  private _isFocusEnabled: boolean = false;
  private _focusBox: any = null;
  private _focus: any = null;
  private _focusChanged: ((oldobj: any, newobj: any, cmd: any) => void) | null = null;
  private _liveElementId: string = '';
  private _isUsingAriaLive: boolean = false;
  private _isVirtualPointerEnabled: boolean = false;
  private _isVirtualPointerShown: boolean = false;
  private _virtualPointerBox: any = null;
  private _virtualPointerChanged: ((box: any, cmd: any) => void) | null = null;
  private _virtualPointerLocation: Point = new Point(NaN, NaN);
  private _isVirtualPointerDown: boolean = false;
  private _virtualPointerShiftMove: number = 10;
  private _virtualPointerControlMove: number = 1;
  private _nextFocusFormula: string = 'distance';

  get isFocusEnabled(): boolean { return this._isFocusEnabled; }
  set isFocusEnabled(enabled: boolean) {
    if (this._isFocusEnabled === enabled) return;
    this._isFocusEnabled = enabled;
    if (!enabled) this._focus = null;
  }

  get focusBox(): any { return this._focusBox; }
  set focusBox(adornment: any) {
    this._focusBox = adornment;
    this.updateFocusBox();
  }

  get focus(): any { return this._focus; }
  set focus(obj: any) {
    if (!this._isFocusEnabled) return;
    const old = this._focus;
    if (old === obj) return;
    this._focus = obj;
    this.isVirtualPointerDown = false;
    this.onFocusChanged(old, obj);
    this.updateFocusBox();
  }

  get focusChanged(): ((oldobj: any, newobj: any, cmd: any) => void) | null { return this._focusChanged; }
  set focusChanged(value: ((oldobj: any, newobj: any, cmd: any) => void) | null) { this._focusChanged = value; }

  get liveElementId(): string { return this._liveElementId; }
  set liveElementId(val: string) { this._liveElementId = val; }

  get isUsingAriaLive(): boolean { return this._isUsingAriaLive; }
  set isUsingAriaLive(val: boolean) { this._isUsingAriaLive = val; }

  onFocusChanged(oldobj: any, newobj: any): void {
    if (this._focusChanged) {
      this._focusChanged(oldobj, newobj, this);
      return;
    }
    if (this._diagram && this._diagram.div) {
      let el = this._liveElementId ? document.getElementById(this._liveElementId) : null;
      if (!el) {
        el = document.createElement('output');
        (this._diagram.div as HTMLElement).appendChild(el);
        this._liveElementId = el.id || ('go_focus_' + CommandHandler._liveCounter++);
        el.id = this._liveElementId;
      }
      el.textContent = this.describe(oldobj, newobj);
    }
  }

  private static _liveCounter: number = 0;

  describe(oldobj: any, newobj: any): string {
    if (!newobj) return '';
    const part = newobj.part;
    const data = part && part.data;
    if (data) {
      const k = data.key;
      if (k !== undefined) return String(k);
      const text = data.text;
      if (text !== undefined) return String(text);
    }
    if (newobj instanceof (Adornment as any)) return '';
    const text2 = newobj.text;
    if (typeof text2 === 'string' && text2.length > 0) return text2;
    return 'object';
  }

  updateFocusBox(): void {
    const d: any = this._diagram;
    if (!d) return;
    if (this._focusBox && this._focus) {
      this._focusBox.adornedObject = this._focus;
      if (typeof d.add === 'function') d.add(this._focusBox);
    }
  }

  findFirstFocus(): any {
    const d: any = this._diagram;
    if (!d) return null;
    const it = d.selection.iterator;
    if (it.next()) return it.value;
    const layers = d._layers;
    if (layers) {
      for (const layer of layers) {
        if (layer.isTemporary) continue;
        const lit = layer.parts;
        while (lit.next()) {
          const p = lit.value;
          if (p && p.selectable) return p;
        }
      }
    }
    return null;
  }

  findNextFocus(dir: number): any {
    if (!this._focus) return null;
    const d: any = this._diagram;
    if (!d) return this._focus;
    const current = this._focus;
    const parts: any[] = [];
    const layers = d._layers;
    if (layers) {
      for (const layer of layers) {
        if (layer.isTemporary) continue;
        const lit = layer.parts;
        while (lit.next()) parts.push(lit.value);
      }
    }
    const cx = current.actualBounds ? current.actualBounds.centerX : current.position.x;
    const cy = current.actualBounds ? current.actualBounds.centerY : current.position.y;
    const dx = dir === 0 ? 0 : dir === 1 ? 1 : dir === 2 ? 0 : -1;
    const dy = dir === 0 ? -1 : dir === 1 ? 0 : dir === 2 ? 1 : 0;
    let best: any = current;
    let bestScore = Infinity;
    for (const p of parts) {
      if (p === current) continue;
      const px = p.actualBounds ? p.actualBounds.centerX : p.position.x;
      const py = p.actualBounds ? p.actualBounds.centerY : p.position.y;
      const vx = px - cx, vy = py - cy;
      const dot = vx * dx + vy * dy;
      if (dot <= 0) continue;
      const dist = Math.sqrt(vx * vx + vy * vy);
      let score = dist;
      if (this._nextFocusFormula === 'linear') {
        const cross = Math.abs(vx * dy - vy * dx);
        score = cross;
      }
      if (score < bestScore) { bestScore = score; best = p; }
    }
    return best;
  }

  get nextFocusFormula(): string { return this._nextFocusFormula; }
  set nextFocusFormula(val: string) { this._nextFocusFormula = val; }

  // ---- 虚拟指针 ----
  get isVirtualPointerEnabled(): boolean { return this._isVirtualPointerEnabled; }
  set isVirtualPointerEnabled(enabled: boolean) {
    if (this._isVirtualPointerEnabled === enabled) return;
    this._isVirtualPointerEnabled = enabled;
    if (!enabled) { this._isVirtualPointerShown = false; this._isVirtualPointerDown = false; }
  }

  get isVirtualPointerShown(): boolean { return this._isVirtualPointerShown; }
  set isVirtualPointerShown(value: boolean) {
    if (this._isVirtualPointerShown === value) return;
    this._isVirtualPointerShown = value;
    if (!value) { this._isVirtualPointerDown = false; }
    this.updateVirtualPointer();
  }

  get isVirtualPointerDown(): boolean { return this._isVirtualPointerDown; }
  set isVirtualPointerDown(value: boolean) {
    if (this._isVirtualPointerDown === value) return;
    this._isVirtualPointerDown = value;
    this.updateVirtualPointer();
  }

  get virtualPointerLocation(): Point { return this._virtualPointerLocation; }
  set virtualPointerLocation(pt: Point) {
    if (this._virtualPointerLocation.equals(pt)) return;
    this._virtualPointerLocation = pt;
    this.updateVirtualPointer();
  }

  get virtualPointerBox(): any { return this._virtualPointerBox; }
  set virtualPointerBox(part: any) {
    if (this._virtualPointerBox === part) return;
    this._virtualPointerBox = part;
    if (this._virtualPointerChanged) this._virtualPointerChanged(part, this);
  }

  get virtualPointerChanged(): ((box: any, cmd: any) => void) | null { return this._virtualPointerChanged; }
  set virtualPointerChanged(value: ((box: any, cmd: any) => void) | null) { this._virtualPointerChanged = value; }

  get virtualPointerShiftMove(): number { return this._virtualPointerShiftMove; }
  set virtualPointerShiftMove(value: number) { this._virtualPointerShiftMove = value; }

  get virtualPointerControlMove(): number { return this._virtualPointerControlMove; }
  set virtualPointerControlMove(value: number) { this._virtualPointerControlMove = value; }

  cancelVirtualPointer(): void {
    this._isVirtualPointerShown = false;
    this._isVirtualPointerDown = false;
    const d: any = this._diagram;
    if (d && d.toolManager && d.toolManager.currentTool && typeof d.toolManager.currentTool.doCancel === 'function') {
      d.toolManager.currentTool.doCancel();
    }
    this.updateVirtualPointer();
  }

  updateVirtualPointer(): void {
    const d: any = this._diagram;
    if (!d) return;
    if (this._isVirtualPointerShown && this._virtualPointerBox) {
      this._virtualPointerBox.location = this._virtualPointerLocation;
      if (typeof d.add === 'function') d.add(this._virtualPointerBox);
    } else if (this._virtualPointerBox && typeof d.remove === 'function') {
      d.remove(this._virtualPointerBox);
    }
  }

  doVirtualPointerEvent(e: InputEvent, act: boolean): void {
    const d: any = this._diagram;
    if (!d) return;
    if (act) {
      if (e.down) d.doMouseDown(e);
      else if (e.up) d.doMouseUp(e);
      else d.doMouseMove(e);
    }
    this.onVirtualPointerEvent(e, act);
  }

  protected onVirtualPointerEvent(e: InputEvent, act: boolean): void { }

  doVirtualFocusKeyDown(): boolean {
    const d: any = this._diagram;
    if (!d) return false;
    const e: any = d.lastInput;
    if (!e) return false;
    const key = e.key;
    const shift = e.shift;
    const ctrl = e.control;
    if (key === 'Enter') {
      if (this._isVirtualPointerShown) {
        this.isVirtualPointerDown = !this.isVirtualPointerDown;
        const docPoint = this._virtualPointerLocation;
        const ie = new InputEvent();
        ie.eventType = 'mousedown';
        ie.documentPoint = { x: docPoint.x, y: docPoint.y };
        ie.button = this.isVirtualPointerDown ? 0 : -1;
        ie.shift = shift; ie.control = ctrl;
        ie.down = this.isVirtualPointerDown;
        ie.up = !this.isVirtualPointerDown;
        this.doVirtualPointerEvent(ie, true);
      }
      return true;
    }
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      if (this._isVirtualPointerShown) {
        const step = ctrl ? this._virtualPointerControlMove : this._virtualPointerShiftMove;
        let nx = this._virtualPointerLocation.x, ny = this._virtualPointerLocation.y;
        if (key === 'ArrowLeft') nx -= step;
        else if (key === 'ArrowRight') nx += step;
        else if (key === 'ArrowUp') ny -= step;
        else if (key === 'ArrowDown') ny += step;
        this._virtualPointerLocation = new Point(nx, ny);
        const ie = new InputEvent();
        ie.eventType = 'mousemove';
        ie.documentPoint = { x: nx, y: ny };
        ie.shift = shift; ie.control = ctrl;
        this.doVirtualPointerEvent(ie, true);
        return true;
      }
      if (this._isFocusEnabled) {
        const dir = key === 'ArrowUp' ? 0 : key === 'ArrowRight' ? 1 : key === 'ArrowDown' ? 2 : 3;
        this.focus = this.findNextFocus(dir);
        return true;
      }
    }
    if (key === 'Escape') {
      if (this._isVirtualPointerShown) { this.cancelVirtualPointer(); return true; }
      return false;
    }
    if (key === ' ' && !shift) {
      if (this._isFocusEnabled) this.scrollToPart();
      return true;
    }
    return false;
  }

  doVirtualFocusKeyUp(): boolean {
    const d: any = this._diagram;
    if (!d) return false;
    const e: any = d.lastInput;
    if (!e) return false;
    const key = e.key;
    if (key === 'Shift') {
      if (this._isVirtualPointerShown) this._isVirtualPointerShown = false;
      return this._isVirtualPointerEnabled;
    }
    if (this._isVirtualPointerShown && this.isVirtualPointerDown && (key === 'Enter')) {
      const docPoint = this._virtualPointerLocation;
      const ie = new InputEvent();
      ie.eventType = 'mouseup';
      ie.documentPoint = { x: docPoint.x, y: docPoint.y };
      ie.button = -1;
      ie.down = false; ie.up = true;
      this.isVirtualPointerDown = false;
      this.doVirtualPointerEvent(ie, true);
      return true;
    }
    return false;
  }

  doKeyUp(): void {
    if (!this._isEnabled || !this._diagram) return;
    const d: any = this._diagram;
    if (this._isFocusEnabled || this._isVirtualPointerEnabled) {
      this.doVirtualFocusKeyUp();
    }
  }
}
