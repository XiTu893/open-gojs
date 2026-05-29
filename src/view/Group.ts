import { Node } from './Node';
import { GraphObject } from './GraphObject';
import { Panel } from './Panel';
import { Part } from './Part';
import { Point } from '../core/Point';
import { List } from '../core/List';
import { Set } from '../core/Set';
import type { Placeholder } from './Placeholder';
import type { Layout } from '../layout/Layout';

export class Group extends Node {

  protected _handlesDragDrop: boolean = false;
  private _memberParts: Set<Part> = new Set<Part>();
  protected _ungroupable: boolean = false;
  private _layout: Layout | null = null;

  constructor(type?: any, init?: Partial<Group>) {
    super(type);
    this._className = 'Group';
    if (init) {
      this.set(init);
    }
  }

  get handlesDragDrop(): boolean { return this._handlesDragDrop; }
  set handlesDragDrop(val: boolean) { this._handlesDragDrop = val; }

  get placeholder(): Placeholder | null {
    const findPlaceholder = (obj: GraphObject): Placeholder | null => {
      if ('_placeholderBounds' in obj && obj.constructor.name === 'Placeholder') return obj as Placeholder;
      if ('_elements' in obj) {
        for (const child of (obj as any)._elements) {
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

  addMembers(collection: any, check?: boolean): boolean {
    const it = collection.iterator;
    while (it.next()) {
      const part = it.value;
      if (part === this) continue;
      if (part.containingGroup === this) continue;
      part.containingGroup = this;
      this._memberParts.add(part);
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

  move(newLoc: Point): void {
    const oldLoc = this.location;
    super.move(newLoc);
    const dx = newLoc.x - oldLoc.x;
    const dy = newLoc.y - oldLoc.y;
    if (dx !== 0 || dy !== 0) {
      const it = this._memberParts.iterator;
      while (it.next()) {
        const part = it.value;
        const partLoc = part.location;
        part.move(new Point(partLoc.x + dx, partLoc.y + dy));
      }
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
    return c;
  }
}

GraphObject.defineBuilder('Group', Group);
