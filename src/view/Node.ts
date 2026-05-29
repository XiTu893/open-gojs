import { Part } from './Part';
import { GraphObject } from './GraphObject';
import { Panel } from './Panel';
import { Link } from './Link';
import { List } from '../core/List';
import { Set } from '../core/Set';
import { EnumValue, TreeStyleLayered, PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable, PanelPosition, PanelGrid, PanelLink } from '../core/EnumValues';
import { TreeModel } from '../model/TreeModel';
import { GraphLinksModel } from '../model/GraphLinksModel';

/**
 * Node - a Part that can be connected by Links.
 * Represents a vertex in the graph structure.
 */
export class Node extends Part {

  // ============ Private property storage ============
  protected _isTreeExpanded: boolean = true;
  protected _wasTreeExpanded: boolean = true;
  protected _isSubGraphExpanded: boolean = true;
  protected _treeExpandedDirection: EnumValue = TreeStyleLayered;

  constructor(type?: EnumValue | string, init?: Partial<Node>) {
    super(typeof type === 'string' ? Node._resolvePanelType(type) : type);
    this._className = 'Node';
    if (init) {
      this.set(init);
    }
  }

  private static _resolvePanelType(type: string): EnumValue {
    const map: Record<string, EnumValue> = {
      'Auto': PanelAuto,
      'Vertical': PanelVertical,
      'Horizontal': PanelHorizontal,
      'Spot': PanelSpot,
      'Table': PanelTable,
      'Position': PanelPosition,
      'Grid': PanelGrid,
      'Link': PanelLink,
    };
    return map[type] || PanelAuto;
  }

  // ============ Properties ============

  get isTreeExpanded(): boolean { return this._isTreeExpanded; }
  set isTreeExpanded(val: boolean) { this._isTreeExpanded = val; }

  get wasTreeExpanded(): boolean { return this._wasTreeExpanded; }
  set wasTreeExpanded(val: boolean) { this._wasTreeExpanded = val; }

  /** For compatibility with Group */
  get isSubGraphExpanded(): boolean { return this._isSubGraphExpanded; }
  set isSubGraphExpanded(val: boolean) {
    if (this._isSubGraphExpanded === val) return;
    this._isSubGraphExpanded = val;
    if ((this as any)._className === 'Group' && (this as any).memberParts) {
      const members = (this as any).memberParts;
      const it = members.iterator;
      while (it.next()) {
        const part = it.value;
        if (val) {
          if ((part as any)._wasVisible !== false) {
            part.visible = true;
          }
        } else {
          (part as any)._wasVisible = part.visible;
          part.visible = false;
        }
      }
      if ((this as any).layout) {
        (this as any).layout.invalidateLayout();
      }
    }
  }

  get treeExpandedDirection(): EnumValue { return this._treeExpandedDirection; }
  set treeExpandedDirection(val: EnumValue) { this._treeExpandedDirection = val; }

  get isTreeLeaf(): boolean {
    const children = this.findTreeChildrenNodes();
    return children.count === 0;
  }

  // ============ Link/Node connection methods (stubs) ============

  /** Find all links connected to this node */
  findLinksConnected(): List<any> {
    const result = new List<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && (part.fromNode === this || part.toNode === this)) {
          result.add(part);
        }
      }
    }
    return result;
  }

  findLinksInto(): List<any> {
    const result = new List<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && part.toNode === this) {
          result.add(part);
        }
      }
    }
    return result;
  }

  findLinksOutOf(): List<any> {
    const result = new List<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && part.fromNode === this) {
          result.add(part);
        }
      }
    }
    return result;
  }

  findNodesConnected(): List<any> {
    const result = new List<any>();
    const seen = new Set<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link) {
          let other: Node | null = null;
          if (part.fromNode === this) other = part.toNode;
          else if (part.toNode === this) other = part.fromNode;
          if (other && !seen.has(other)) {
            seen.add(other);
            result.add(other);
          }
        }
      }
    }
    return result;
  }

  findNodesInto(): List<any> {
    const result = new List<any>();
    const seen = new Set<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && part.toNode === this) {
          const fromNode = part.fromNode;
          if (fromNode && !seen.has(fromNode)) {
            seen.add(fromNode);
            result.add(fromNode);
          }
        }
      }
    }
    return result;
  }

  findNodesOutOf(): List<any> {
    const result = new List<any>();
    const seen = new Set<any>();
    const diagram = this._diagram;
    if (!diagram) return result;
    for (const layer of diagram._layers) {
      const partsIt = layer.parts;
      while (partsIt.next()) {
        const part = partsIt.value;
        if (part instanceof Link && part.fromNode === this) {
          const toNode = part.toNode;
          if (toNode && !seen.has(toNode)) {
            seen.add(toNode);
            result.add(toNode);
          }
        }
      }
    }
    return result;
  }

  /** Find a port element by name */
  findPortWithName(name: string): GraphObject | null {
    if (name === '' || name === undefined || name === null) return this;
    const findInPanel = (obj: GraphObject): GraphObject | null => {
      if (obj instanceof Panel) {
        for (const child of obj._elements) {
          if (child.portId === name) return child;
          if (child instanceof Panel) {
            const found = findInPanel(child);
            if (found) return found;
          }
        }
      }
      return null;
    };
    return findInPanel(this);
  }

  isInTreeOf(node: Node): boolean {
    let current: Node | null = this;
    while (current) {
      if (current === node) return true;
      current = current.findTreeParentNode();
    }
    return false;
  }

  findTreeParentNode(): Node | null {
    const diagram = this._diagram;
    if (!diagram) return null;
    const model = diagram.model;
    if (!model || !this.data) return null;
    if (model instanceof TreeModel) {
      const parentKey = model.getParentKeyForNodeData(this.data);
      if (parentKey !== undefined && parentKey !== null) {
        return diagram.findNodeForKey(parentKey);
      }
      return null;
    }
    if (model instanceof GraphLinksModel) {
      const linksInto = this.findLinksInto();
      const it = linksInto.iterator;
      while (it.next()) {
        const link = it.value;
        if (link.fromNode) return link.fromNode;
      }
      return null;
    }
    return null;
  }

  findTreeChildrenNodes(): List<Node> {
    const result = new List<Node>();
    const diagram = this._diagram;
    if (!diagram) return result;
    const model = diagram.model;
    if (!model || !this.data) return result;
    const key = model.getKeyForNodeData(this.data);
    if (key === undefined) return result;
    if (model instanceof TreeModel) {
      for (const nodeData of model.nodeDataArray) {
        const parentKey = model.getParentKeyForNodeData(nodeData);
        if (parentKey === key) {
          const childKey = model.getKeyForNodeData(nodeData);
          if (childKey !== undefined) {
            const childNode = diagram.findNodeForKey(childKey);
            if (childNode) result.add(childNode);
          }
        }
      }
      return result;
    }
    if (model instanceof GraphLinksModel) {
      const linksOutOf = this.findLinksOutOf();
      const seen = new Set<Node>();
      const it = linksOutOf.iterator;
      while (it.next()) {
        const link = it.value;
        if (link.toNode && !seen.has(link.toNode)) {
          seen.add(link.toNode);
          result.add(link.toNode);
        }
      }
      return result;
    }
    return result;
  }

  findTreeParentLink(): any | null {
    const linksInto = this.findLinksInto();
    const it = linksInto.iterator;
    if (it.next()) return it.value;
    return null;
  }

  findLevel(): number {
    const levelCache = new Map<any, number>();
    const computeLevel = (n: Node): number => {
      const data = n.data;
      if (!data) return 0;
      const key = n._diagram ? n._diagram.model.getKeyForNodeData(data) : undefined;
      if (key !== undefined && levelCache.has(key)) return levelCache.get(key)!;
      const parent = n.findTreeParentNode();
      const level = parent ? computeLevel(parent) + 1 : 0;
      if (key !== undefined) levelCache.set(key, level);
      return level;
    };
    return computeLevel(this);
  }

  findCommonParent(node: Node): Node | null {
    const ancestors = new Set<Node>();
    let current: Node | null = this;
    while (current) {
      ancestors.add(current);
      current = current.findTreeParentNode();
    }
    current = node;
    while (current) {
      if (ancestors.has(current)) return current;
      current = current.findTreeParentNode();
    }
    return null;
  }

  // ============ Methods ============

  /** Create a copy of this Node */
  copy(): Node {
    const c = new Node(this._type);
    this._copyPropertiesTo(c as any);
    this._copyPanelPropertiesTo(c as any);
    this._copyPartPropertiesTo(c);
    // Copy Node-specific properties
    c._isTreeExpanded = this._isTreeExpanded;
    c._wasTreeExpanded = this._wasTreeExpanded;
    c._isSubGraphExpanded = this._isSubGraphExpanded;
    c._treeExpandedDirection = this._treeExpandedDirection;
    return c;
  }
}

GraphObject.defineBuilder('Node', Node);
