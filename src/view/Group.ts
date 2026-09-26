import { Node } from './Node';
import { GraphObject } from './GraphObject';
import { Panel } from './Panel';
import { Part } from './Part';
import { Point } from '../core/Point';
import { List } from '../core/List';
import { Set } from '../core/Set';
import type { Placeholder } from './Placeholder';
import { Layout } from '../layout/Layout';

export class Group extends Node {

  protected _handlesDragDrop: boolean = false;
  private _memberParts: Set<Part> = new Set<Part>();
  protected _ungroupable: boolean = false;
  private _layout: Layout | null = null;
  private _ga: boolean = false;

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
    const c = new Group(this._type);
    this._copyPropertiesTo(c as any);
    this._copyPanelPropertiesTo(c as any);
    this._copyPartPropertiesTo(c);
    c._isTreeExpanded = this._isTreeExpanded;
    c._wasTreeExpanded = this._wasTreeExpanded;
    c._isSubGraphExpanded = this._isSubGraphExpanded;
    c._treeExpandedDirection = this._treeExpandedDirection;
    c._handlesDragDrop = this._handlesDragDrop;
    c._ungroupable = this._ungroupable;
    if (this._layout) {
      const lo = this._layout.copy();
      lo.group = c;
      c._layout = lo;
    }
    return c;
  }
}

GraphObject.defineBuilder('Group', Group);
