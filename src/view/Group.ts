import { Node } from './Node';
import { GraphObject } from './GraphObject';
import { Panel } from './Panel';
import { Part } from './Part';
import { Point } from '../core/Point';
import { List } from '../core/List';
import { Set } from '../core/Set';
import { Iterator } from '../core/Iterable';
import type { Placeholder } from './Placeholder';
import { Layout } from '../layout/Layout';

export class Group extends Node {
  static readonly className: string = "Group";

  protected _handlesDragDrop: boolean = false;
  private _memberParts: Set<Part> = new Set<Part>();
  protected _ungroupable: boolean = false;
  private _layout: Layout | null = null;
  private _ga: boolean = false;
  private _computesBoundsAfterDrag: boolean = false;
  private _computesBoundsIncludingLinks: boolean = true;
  private _computesBoundsIncludingLocation: boolean = false;
  private _handlesDragDropForMembers: boolean = false;
  private _avoidableMembers: boolean = false;
  private _wasSubGraphExpanded: boolean = false;
  private _memberAdded: ((thisGroup: Group, newPart: Part) => void) | null = null;
  private _memberRemoved: ((thisGroup: Group, oldPart: Part) => void) | null = null;
  private _memberValidation: ((thisGroup: Group | null, part: Part) => boolean) | null = null;
  private _subGraphExpandedChanged: ((thisGroup: Group) => void) | null = null;
  /** 官方 `Diagram.isCollapsingExpanding` 的重入保护（本项目 Diagram 尚无该标志，用静态位替代） */
  private static _isCollapsingExpanding: boolean = false;

  constructor(type?: any, init?: any) {
    const [t, i] = Panel._resolveArgs(type, init);
    super(t, undefined);
    this._className = 'Group';
    // 官方 Group：默认 layout = new Layout（group 指向自己），init 可覆盖
    this._layout = new Layout();
    this._layout.group = this;
    if (i) {
      this.set(i);
    }
  }

  get handlesDragDrop(): boolean { return this._handlesDragDrop; }
  set handlesDragDrop(val: boolean) { this._handlesDragDrop = val; }

  get placeholder(): Placeholder | null {
    const findPlaceholder = (obj: GraphObject): Placeholder | null => {
      if ((obj as any)._isPlaceholder) return obj as Placeholder;
      const els = (obj as any)._elements;
      if (els) {
        for (const child of els) {
          const found = findPlaceholder(child);
          if (found) return found;
        }
      }
      return null;
    };
    return findPlaceholder(this);
  }

  get memberParts(): Set<Part> { return this._memberParts; }

  get ungroupable(): boolean { return this._ungroupable; }
  set ungroupable(val: boolean) { this._ungroupable = val; }

  /**
   * 官方 Group.computesBoundsAfterDrag：默认 false。
   * 为 true 时成员拖动后才计算组的边界（避免拖动过程中反复重算）。
   */
  get computesBoundsAfterDrag(): boolean { return this._computesBoundsAfterDrag; }
  set computesBoundsAfterDrag(val: boolean) { this._computesBoundsAfterDrag = val; }

  /** 官方 Group.computesBoundsIncludingLinks：默认 true，边界计算是否包含内部 Link。 */
  get computesBoundsIncludingLinks(): boolean { return this._computesBoundsIncludingLinks; }
  set computesBoundsIncludingLinks(val: boolean) { this._computesBoundsIncludingLinks = val; }

  /** 官方 Group.computesBoundsIncludingLocation：默认 false，是否把自身 location 计入边界。 */
  get computesBoundsIncludingLocation(): boolean { return this._computesBoundsIncludingLocation; }
  set computesBoundsIncludingLocation(val: boolean) { this._computesBoundsIncludingLocation = val; }

  get layout(): Layout | null { return this._layout; }
  set layout(val: Layout | null) {
    this._layout = val;
    if (val) {
      (val as any)._group = this;
    }
  }

  /** 官方 Group 的 Ga 标志：diagram 布局前递归组布局将其置位，diagram 布局收集后清除。 */
  get Ga(): boolean { return this._ga; }
  set Ga(val: boolean) { this._ga = val; }

  /** 官方 `Group.handlesDragDropForMembers`（默认 false） */
  get handlesDragDropForMembers(): boolean { return this._handlesDragDropForMembers; }
  set handlesDragDropForMembers(val: boolean) {
    const old = this._handlesDragDropForMembers;
    if (old === val) return;
    this._handlesDragDropForMembers = val;
    this.raiseChanged('handlesDragDropForMembers', old, val);
  }

  /** 官方 `Group.avoidableMembers`（默认 false，成员是否参与连线避让） */
  get avoidableMembers(): boolean { return this._avoidableMembers; }
  set avoidableMembers(val: boolean) {
    const old = this._avoidableMembers;
    if (old === val) return;
    this._avoidableMembers = val;
    this.raiseChanged('avoidableMembers', old, val);
  }

  /** 官方 `Group.memberAdded`（默认 null） */
  get memberAdded(): ((thisGroup: Group, newPart: Part) => void) | null { return this._memberAdded; }
  set memberAdded(val: ((thisGroup: Group, newPart: Part) => void) | null) {
    const old = this._memberAdded;
    if (old === val) return;
    this._memberAdded = val;
    this.raiseChanged('memberAdded', old, val);
  }

  /** 官方 `Group.memberRemoved`（默认 null） */
  get memberRemoved(): ((thisGroup: Group, oldPart: Part) => void) | null { return this._memberRemoved; }
  set memberRemoved(val: ((thisGroup: Group, oldPart: Part) => void) | null) {
    const old = this._memberRemoved;
    if (old === val) return;
    this._memberRemoved = val;
    this.raiseChanged('memberRemoved', old, val);
  }

  /** 官方 `Group.memberValidation`（默认 null，决定某 Part 能否成为本组成员） */
  get memberValidation(): ((thisGroup: Group | null, part: Part) => boolean) | null { return this._memberValidation; }
  set memberValidation(val: ((thisGroup: Group | null, part: Part) => boolean) | null) {
    const old = this._memberValidation;
    if (old === val) return;
    this._memberValidation = val;
    this.raiseChanged('memberValidation', old, val);
  }

  /** 官方 `Group.subGraphExpandedChanged`（默认 null） */
  get subGraphExpandedChanged(): ((thisGroup: Group) => void) | null { return this._subGraphExpandedChanged; }
  set subGraphExpandedChanged(val: ((thisGroup: Group) => void) | null) {
    const old = this._subGraphExpandedChanged;
    if (old === val) return;
    this._subGraphExpandedChanged = val;
    this.raiseChanged('subGraphExpandedChanged', old, val);
  }

  /** 官方 `Group.wasSubGraphExpanded`（默认 false，折叠前是否展开） */
  get wasSubGraphExpanded(): boolean { return this._wasSubGraphExpanded; }
  set wasSubGraphExpanded(val: boolean) {
    const old = this._wasSubGraphExpanded;
    if (old === val) return;
    this._wasSubGraphExpanded = val;
    this.raiseChanged('wasSubGraphExpanded', old, val);
  }

  /** 内部：memberAdded / memberRemoved 回调（官方由 `Group.WN` / `Group.vN` 调用） */
  _notifyMemberAdded(part: Part): void {
    const f = this._memberAdded;
    if (f !== null) f(this, part);
  }

  /** 内部：见 `_notifyMemberAdded` */
  _notifyMemberRemoved(part: Part): void {
    const f = this._memberRemoved;
    if (f !== null) f(this, part);
  }

  /** 官方 `Group.canAddMembers(coll)` */
  canAddMembers(coll: any): boolean {
    const d: any = this.diagram;
    if (d === null) return false;
    const ch = d.commandHandler;
    if (ch === null || ch === undefined || typeof ch.isValidMember !== 'function') return false;
    const list: any[] = [];
    if (coll !== null && coll !== undefined && typeof coll.iterator === 'function') {
      const it = coll.iterator;
      while (it.next()) list.push(it.value);
    } else if (Array.isArray(coll)) {
      for (let i = 0; i < coll.length; i++) list.push(coll[i]);
    } else if (coll !== null && coll !== undefined && typeof coll.next === 'function') {
      while (coll.next()) list.push(coll.value);
    }
    for (let i = 0; i < list.length; i++) {
      if (!ch.isValidMember(this, list[i])) return false;
    }
    return true;
  }

  /** 官方 `Group.canUngroup()` */
  canUngroup(): boolean {
    if (!this._ungroupable) return false;
    const layer: any = this.layer;
    if (layer === null || !layer.allowUngroup) return false;
    const d: any = layer.diagram;
    return !(d !== null && d !== undefined && !d.allowUngroup);
  }

  /**
   * 官方 `Group.findSubGraphParts()`：本组（含嵌套组）的全部成员 Node/Link 与标签节点，不含本组自身。
   */
  findSubGraphParts(): Set<Part> {
    const out = new Set<Part>();
    const walk = (g: any): void => {
      const it = g._memberParts.iterator;
      while (it.next()) {
        const p: any = it.value;
        if (p === null || p === undefined || out.has(p)) continue;
        out.add(p);
        if (p._className === 'Group') walk(p);
        else if (p._className === 'Link') {
          const ln = p.labelNodes;
          while (ln.next()) {
            if (!out.has(ln.value)) out.add(ln.value);
          }
        }
      }
    };
    walk(this);
    out.delete(this);
    return out;
  }

  /** 官方 `Group.findExternalLinksConnected()` */
  findExternalLinksConnected(): Iterator<any> {
    const parts = this.findSubGraphParts();
    parts.add(this);
    const out = new Set<any>();
    const it = parts.iterator;
    while (it.next()) {
      const n: any = it.value;
      if (n === null || n === undefined || typeof n.linksConnected !== 'function') continue;
      const links = n.linksConnected;
      while (links.next()) {
        const l = links.value;
        if (!parts.has(l)) out.add(l);
      }
    }
    return out.iterator;
  }

  /** 官方 `Group.findExternalNodesConnected()` */
  findExternalNodesConnected(): Iterator<any> {
    const t = this.findSubGraphParts();
    t.add(this);
    const out = new Set<any>();
    const e = t.iterator;
    while (e.next()) {
      const s: any = e.value;
      if (s === null || s === undefined || typeof s.linksConnected !== 'function') continue;
      const links = s.linksConnected;
      while (links.next()) {
        const o: any = links.value;
        const r = o.fromNode;
        if (r !== null && r !== undefined && (!t.has(r) || r === this)) out.add(r);
        const l = o.toNode;
        if (l !== null && l !== undefined && (!t.has(l) || l === this)) out.add(l);
      }
    }
    return out.iterator;
  }

  /** 官方 `Group.collapseSubGraph()` */
  collapseSubGraph(): void {
    if (this.diagram === null) return;
    if (Group._isCollapsingExpanding) return;
    Group._isCollapsingExpanding = true;
    try {
      const parts = this.findSubGraphParts();
      this._subGraphStep(false, parts);
    } finally {
      Group._isCollapsingExpanding = false;
    }
  }

  /** 官方 `Group.expandSubGraph()` */
  expandSubGraph(): void {
    if (this.diagram === null) return;
    if (Group._isCollapsingExpanding) return;
    Group._isCollapsingExpanding = true;
    try {
      const parts = this.findSubGraphParts();
      this._subGraphStep(true, parts);
    } finally {
      Group._isCollapsingExpanding = false;
    }
  }

  /** 官方 `Group.eR` / `Group.sR`：隐藏/显示成员并递归处理嵌套组 */
  private _subGraphStep(expand: boolean, parts: Set<Part>): void {
    const s = this._memberParts.iterator;
    while (s.next()) {
      const n: any = s.value;
      n.visible = expand;
      if (n._className === 'Group') {
        if (expand && n.wasSubGraphExpanded) {
          n.wasSubGraphExpanded = false;
          n._subGraphStep(expand, parts);
        } else if (!expand && n.isSubGraphExpanded) {
          n.wasSubGraphExpanded = n.isSubGraphExpanded;
          n._subGraphStep(expand, parts);
        }
      }
      if (n._className === 'Link') {
        const ln = n.labelNodes;
        while (ln.next()) {
          const label = ln.value;
          if (typeof label.invalidateConnectedLinks === 'function') label.invalidateConnectedLinks(parts);
        }
      } else if (typeof n.invalidateConnectedLinks === 'function') {
        n.invalidateConnectedLinks(parts);
      }
    }
    this.isSubGraphExpanded = expand;
  }

  addMembers(collection: any, check?: boolean): boolean {
    const it = collection.iterator;
    while (it.next()) {
      const part = it.value;
      if (part === this) continue;
      if (part.containingGroup === this) continue;
      part.containingGroup = this;
      this._memberParts.add(part);
    }
    if (this._layout && this._layout.isOngoing) {
      this._layout.invalidateLayout();
    }
    return true;
  }

  removeMembers(collection: any, check?: boolean): boolean {
    const it = collection.iterator;
    while (it.next()) {
      const part = it.value;
      if (part.containingGroup === this) {
        part.containingGroup = null;
      }
      this._memberParts.remove(part);
    }
    return true;
  }

  move(newLoc: Point, isLocation?: boolean): void {
    const src = isLocation === true ? this.location : this.position;
    const sNaNx = isNaN(src.x);
    const sNaNy = isNaN(src.y);
    const tNaNx = isNaN(newLoc.x);
    const tNaNy = isNaN(newLoc.y);
    if ((src.x === newLoc.x || (sNaNx && tNaNx)) && (src.y === newLoc.y || (sNaNy && tNaNy))) return;
    const dx = newLoc.x - (sNaNx ? 0 : src.x);
    const dy = newLoc.y - (sNaNy ? 0 : src.y);
    super.move(newLoc, isLocation);
    if (dx !== 0 || dy !== 0) {
      const seen = new Set<Part>();
      const walk = (g: Group): void => {
        const it = g._memberParts.iterator;
        while (it.next()) {
          const d: any = it.value;
          if (seen.has(d)) continue;
          seen.add(d);
          if (d.isLinkLabel) continue;
          if (d._className === 'Link') continue;
          const pos = d.position;
          if (!isNaN(pos.x) && !isNaN(pos.y)) {
            d.position = new Point(pos.x + dx, pos.y + dy);
          } else {
            const loc = d.location;
            if (!isNaN(loc.x) && !isNaN(loc.y)) {
              d.location = new Point(loc.x + dx, loc.y + dy);
            }
          }
          if (d._className === 'Group') walk(d);
        }
      };
      walk(this);
    }
  }

  copy(): Group {
    // 官方：`new this.constructor`（无参，type 由 _copyPanelPropertiesTo 复制）
    const c = new Group(this._type); // WIP-BISECT
    this._copyPropertiesTo(c as any);
    this._copyPanelPropertiesTo(c as any);
    this._copyPartPropertiesTo(c);
    c._isTreeExpanded = this._isTreeExpanded;
    c._wasTreeExpanded = this._wasTreeExpanded;
    c._isSubGraphExpanded = this._isSubGraphExpanded;
    c._treeExpandedDirection = this._treeExpandedDirection;
    c._handlesDragDrop = this._handlesDragDrop;
    c._ungroupable = this._ungroupable;
    c._handlesDragDropForMembers = this._handlesDragDropForMembers;
    c._avoidableMembers = this._avoidableMembers;
    c._wasSubGraphExpanded = this._wasSubGraphExpanded;
    c._memberAdded = this._memberAdded;
    c._memberRemoved = this._memberRemoved;
    c._memberValidation = this._memberValidation;
    c._subGraphExpandedChanged = this._subGraphExpandedChanged;
    c._computesBoundsAfterDrag = this._computesBoundsAfterDrag;
    c._computesBoundsIncludingLinks = this._computesBoundsIncludingLinks;
    c._computesBoundsIncludingLocation = this._computesBoundsIncludingLocation;
    if (this._layout) {
      const lo = this._layout.copy();
      lo.group = c;
      c._layout = lo;
    }
    return c;
  }
}

GraphObject.defineBuilder('Group', Group);
