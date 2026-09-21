import { Point } from '../core/Point';
import { Set } from '../core/Set';
import { List } from '../core/List';
import { TreeArrangementFixedRoots } from '../core/EnumValues';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { Part } from '../view/Part';
import { Layout } from './Layout';
import { TreeLayout } from './TreeLayout';

/**
 * DoubleTreeLayout - performs two TreeLayouts in opposite directions,
 * sharing a single root node.
 *
 * The choice of direction for each subtree is determined by the
 * `directionFunction` predicate, which is called on each child node
 * of the root node.
 *
 * Set `vertical` to true for upward/downward growth instead of
 * left/right.
 */
export class DoubleTreeLayout extends Layout {

  protected _vertical: boolean = false;
  protected _directionFunction: (node: Node) => boolean = (_node) => true;
  protected _bottomRightOptions: Record<string, any> | null = null;
  protected _topLeftOptions: Record<string, any> | null = null;

  constructor() {
    super();
  }

  // ============ Properties ============

  /**
   * When false, the layout grows towards the left and towards the right.
   * When true, the layout grows upwards and downwards.
   * Default is false.
   */
  get vertical(): boolean { return this._vertical; }
  set vertical(val: boolean) {
    if (this._vertical !== val) {
      this._vertical = val;
      this.invalidateLayout();
    }
  }

  /**
   * This function is called on each child node of the root node
   * to determine whether the subtree starting from that child node
   * will grow towards larger coordinates (right/down) or smaller ones (left/up).
   * Must return true for positive direction (right/down), false otherwise.
   */
  get directionFunction(): (node: Node) => boolean { return this._directionFunction; }
  set directionFunction(val: (node: Node) => boolean) {
    if (this._directionFunction !== val) {
      this._directionFunction = val;
      this.invalidateLayout();
    }
  }

  /**
   * Options to be applied to the bottom-right TreeLayout.
   * By default null -- no properties are set on the TreeLayout
   * other than the angle, depending on `vertical` and `directionFunction`.
   */
  get bottomRightOptions(): Record<string, any> | null { return this._bottomRightOptions; }
  set bottomRightOptions(val: Record<string, any> | null) {
    if (this._bottomRightOptions !== val) {
      this._bottomRightOptions = val;
      this.invalidateLayout();
    }
  }

  /**
   * Options to be applied to the top-left TreeLayout.
   * By default null -- no properties are set on the TreeLayout
   * other than the angle, depending on `vertical` and `directionFunction`.
   */
  get topLeftOptions(): Record<string, any> | null { return this._topLeftOptions; }
  set topLeftOptions(val: Record<string, any> | null) {
    if (this._topLeftOptions !== val) {
      this._topLeftOptions = val;
      this.invalidateLayout();
    }
  }

  // ============ Methods ============

  copy(): DoubleTreeLayout {
    const copy = new DoubleTreeLayout();
    copy._arrangementOrigin = this._arrangementOrigin.copy();
    copy._vertical = this._vertical;
    copy._directionFunction = this._directionFunction;
    copy._bottomRightOptions = this._bottomRightOptions;
    copy._topLeftOptions = this._topLeftOptions;
    return copy;
  }

  /**
   * Perform two TreeLayouts by splitting the collection of Parts
   * into two separate subsets sharing only a single root Node.
   */
  doLayout(coll: any): void {
    const parts = this.collectParts(coll);
    if (parts.count === 0) return;

    const diagram = this.diagram;
    if (diagram) {
      (diagram as any).startTransaction('Double Tree Layout');
    }

    // Split the nodes and links into two Sets
    const leftParts = new Set<Part>();
    const rightParts = new Set<Part>();
    this.separatePartsForLayout(parts, leftParts, rightParts);

    // Create and perform two TreeLayouts, one in each direction
    const layout1 = this.createTreeLayout(false);
    layout1.diagram = diagram;
    layout1.angle = this._vertical ? 270 : 180;
    layout1.arrangement = TreeArrangementFixedRoots;

    const layout2 = this.createTreeLayout(true);
    layout2.diagram = diagram;
    layout2.angle = this._vertical ? 90 : 0;
    layout2.arrangement = TreeArrangementFixedRoots;

    layout1.doLayout(leftParts);
    layout2.doLayout(rightParts);

    if (diagram) {
      (diagram as any).commitTransaction('Double Tree Layout');
    }

    this.isValidLayout = true;
  }

  /**
   * Create a TreeLayout instance, applying the appropriate options.
   * @param positive - true for growth downward or rightward
   */
  createTreeLayout(positive: boolean): TreeLayout {
    const lay = new TreeLayout();
    const opts = positive ? this._bottomRightOptions : this._topLeftOptions;
    if (opts) {
      for (const key of Object.keys(opts)) {
        (lay as any)[key] = opts[key];
      }
    }
    return lay;
  }

  /**
   * Split the collection of Nodes and Links into two Sets,
   * one for the subtrees growing towards the left/up,
   * and one for the subtrees growing towards the right/down.
   */
  separatePartsForLayout(
    coll: List<Part>,
    leftParts: Set<Part>,
    rightParts: Set<Part>
  ): void {
    let root: Node | null = null;
    const roots = new Set<Node>();

    // Find root nodes (nodes with no tree parent)
    const it = coll.iterator;
    while (it.next()) {
      const part = it.value;
      if (part instanceof Node) {
        if (part.findTreeParentNode() === null) {
          roots.add(part);
        }
      }
    }

    if (roots.count === 0) {
      // No root found (cycles) -- pick the first node
      const collIt = coll.iterator;
      while (collIt.next()) {
        if (collIt.value instanceof Node) {
          root = collIt.value;
          break;
        }
      }
    } else if (roots.count === 1) {
      // Normal case: single root
      const rootIt = roots.iterator;
      rootIt.next();
      root = rootIt.value;
    } else {
      // Multiple roots -- create a dummy root node
      root = new Node();
      root.location = new Point(0, 0);
      // Make dummy links from the root to each child root
      roots.each((child) => {
        const link = new Link();
        link.fromNode = root;
        link.toNode = child;
      });
    }

    if (root === null) return;

    // The ROOT node is shared by both subtrees
    leftParts.add(root);
    rightParts.add(root);

    // Look at all immediate children of the ROOT node
    const children = root.findTreeChildrenNodes();
    const childIt = children.iterator;
    while (childIt.next()) {
      const child = childIt.value;
      const bottomRight = this.isPositiveDirection(child);
      const parts = bottomRight ? rightParts : leftParts;

      // Add the whole subtree starting with this child node
      this._addSubtreeParts(child, parts);

      // Also add the link from the ROOT node to this child node
      const parentLink = child.findTreeParentLink();
      if (parentLink !== null) {
        parts.add(parentLink);
      }
    }
  }

  /**
   * Recursively add all nodes and links in the subtree rooted at `node`
   * to the given set.
   */
  private _addSubtreeParts(node: Node, parts: Set<Part>): void {
    parts.add(node);
    // Add links into this node (from parent)
    const linksInto = node.findLinksInto().iterator;
    while (linksInto.next()) {
      parts.add(linksInto.value);
    }
    // Recurse into children
    const children = node.findTreeChildrenNodes();
    const childIt = children.iterator;
    while (childIt.next()) {
      this._addSubtreeParts(childIt.value, parts);
    }
  }

  /**
   * Predicate called on each child node of the root node.
   * Returns true if this child's subtree should grow rightwards/downwards.
   */
  isPositiveDirection(child: Node): boolean {
    const f = this._directionFunction;
    if (!f) {
      throw new Error('No DoubleTreeLayout.directionFunction supplied on the layout');
    }
    return f(child);
  }
}
