import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { List } from '../core/List';
import { Map } from '../core/Map';
import { Set } from '../core/Set';
import { EnumValue } from '../core/EnumValues';
import {
  TreeStyleLayered, TreeStyleAlternating, TreeStyleLastParents, TreeStyleCompact, TreeStyleRootOnly,
  TreePathDefault, TreePathDestination, TreePathSource,
  TreeArrangementVertical, TreeArrangementHorizontal, TreeArrangementFixedRoots,
  TreeLayerStyleIndividual, TreeLayerStyleUniform,
  TreeSortingForwards, TreeSortingReverse, TreeSortingAscending, TreeSortingDescending,
  TreeCompactionBlock, TreeCompactionNone
} from '../core/EnumValues';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { Layout } from './Layout';
import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';
import { LayoutEdge } from './LayoutEdge';

interface TreeNodeInfo {
  vertex: LayoutVertex;
  children: TreeNodeInfo[];
  parent: TreeNodeInfo | null;
  layer: number;
  relativePosition: number;
}

/**
 * TreeLayout - arranges nodes in a tree structure.
 */
export class TreeLayout extends Layout {

  private _angle: number = 0;
  private _layerSpacing: number = 50;
  private _nodeSpacing: number = 20;
  private _treeStyle: EnumValue = TreeStyleLayered;
  private _arrangement: EnumValue = TreeArrangementVertical;
  private _layerStyle: EnumValue = TreeLayerStyleIndividual;
  private _compaction: EnumValue = TreeCompactionBlock;
  private _sorting: EnumValue = TreeSortingForwards;
  private _path: EnumValue = TreePathDefault;
  private _alternateAngle: number = 90;
  private _alternateLayerSpacing: number = NaN;
  private _alternateNodeSpacing: number = NaN;
  private _alternateAlignment: EnumValue = TreeStyleLayered;
  private _alternateCompaction: EnumValue = TreeCompactionBlock;
  private _alternateSorting: EnumValue = TreeSortingForwards;

  get angle(): number { return this._angle; }
  set angle(val: number) { this._angle = val; }

  get layerSpacing(): number { return this._layerSpacing; }
  set layerSpacing(val: number) { this._layerSpacing = val; }

  get nodeSpacing(): number { return this._nodeSpacing; }
  set nodeSpacing(val: number) { this._nodeSpacing = val; }

  get treeStyle(): EnumValue { return this._treeStyle; }
  set treeStyle(val: EnumValue) { this._treeStyle = val; }

  get arrangement(): EnumValue { return this._arrangement; }
  set arrangement(val: EnumValue) { this._arrangement = val; }

  get layerStyle(): EnumValue { return this._layerStyle; }
  set layerStyle(val: EnumValue) { this._layerStyle = val; }

  get compaction(): EnumValue { return this._compaction; }
  set compaction(val: EnumValue) { this._compaction = val; }

  get sorting(): EnumValue { return this._sorting; }
  set sorting(val: EnumValue) { this._sorting = val; }

  get path(): EnumValue { return this._path; }
  set path(val: EnumValue) { this._path = val; }

  get alternateAngle(): number { return this._alternateAngle; }
  set alternateAngle(val: number) { this._alternateAngle = val; }

  get alternateLayerSpacing(): number { return this._alternateLayerSpacing; }
  set alternateLayerSpacing(val: number) { this._alternateLayerSpacing = val; }

  get alternateNodeSpacing(): number { return this._alternateNodeSpacing; }
  set alternateNodeSpacing(val: number) { this._alternateNodeSpacing = val; }

  get alternateAlignment(): EnumValue { return this._alternateAlignment; }
  set alternateAlignment(val: EnumValue) { this._alternateAlignment = val; }

  get alternateCompaction(): EnumValue { return this._alternateCompaction; }
  set alternateCompaction(val: EnumValue) { this._alternateCompaction = val; }

  get alternateSorting(): EnumValue { return this._alternateSorting; }
  set alternateSorting(val: EnumValue) { this._alternateSorting = val; }

  copy(): TreeLayout {
    const copy = new TreeLayout();
    copy._arrangementOrigin = this._arrangementOrigin.copy();
    copy._angle = this._angle;
    copy._layerSpacing = this._layerSpacing;
    copy._nodeSpacing = this._nodeSpacing;
    copy._treeStyle = this._treeStyle;
    copy._arrangement = this._arrangement;
    copy._layerStyle = this._layerStyle;
    copy._compaction = this._compaction;
    copy._sorting = this._sorting;
    copy._path = this._path;
    copy._alternateAngle = this._alternateAngle;
    copy._alternateLayerSpacing = this._alternateLayerSpacing;
    copy._alternateNodeSpacing = this._alternateNodeSpacing;
    copy._alternateAlignment = this._alternateAlignment;
    copy._alternateCompaction = this._alternateCompaction;
    copy._alternateSorting = this._alternateSorting;
    return copy;
  }

  doLayout(coll: any): void {
    const parts = this.collectParts(coll);
    if (parts.count === 0) return;

    // Build network
    const net = this.makeNetwork(coll);
    if (net.vertexes.count === 0) return;

    // Build tree structure from links
    const nodeToInfo = new Map<Node, TreeNodeInfo>();
    const vertexToInfo = new Map<LayoutVertex, TreeNodeInfo>();

    // Create TreeNodeInfo for each vertex
    const vit = net.vertexes.iterator;
    while (vit.next()) {
      const vertex = vit.value;
      if (vertex.node) {
        const info: TreeNodeInfo = {
          vertex,
          children: [],
          parent: null,
          layer: 0,
          relativePosition: 0
        };
        nodeToInfo.set(vertex.node, info);
        vertexToInfo.set(vertex, info);
      }
    }

    // Build parent-child relationships from edges
    const eit = net.edges.iterator;
    while (eit.next()) {
      const edge = eit.value;
      if (!edge.fromVertex || !edge.toVertex) continue;

      const parentInfo = vertexToInfo.get(edge.fromVertex);
      const childInfo = vertexToInfo.get(edge.toVertex);

      if (parentInfo && childInfo) {
        // Determine direction based on path
        if (this._path === TreePathSource) {
          // Parent is fromVertex
          parentInfo.children.push(childInfo);
          childInfo.parent = parentInfo;
        } else if (this._path === TreePathDestination) {
          // Parent is toVertex
          childInfo.children.push(parentInfo);
          parentInfo.parent = childInfo;
        } else {
          // Default: from is parent, to is child
          parentInfo.children.push(childInfo);
          childInfo.parent = parentInfo;
        }
      }
    }

    // Sort children based on sorting option
    const allInfos: TreeNodeInfo[] = [];
    nodeToInfo.each((info) => { allInfos.push(info); });
    for (const info of allInfos) {
      this._sortChildren(info.children);
    }

    // Find roots (nodes with no parent)
    const roots: TreeNodeInfo[] = [];
    for (const info of allInfos) {
      if (info.parent === null) {
        roots.push(info);
      }
    }

    // If no roots found (cyclic graph), pick the first vertex as root
    if (roots.length === 0 && allInfos.length > 0) {
      roots.push(allInfos[0]);
    }

    // Assign layers (depth) to each node
    for (const root of roots) {
      this._assignLayers(root, 0);
    }

    // Position nodes
    const origin = this.arrangementOrigin;
    const isVertical = (this._angle === 0 || this._angle === 180);
    const isReversed = (this._angle === 180 || this._angle === 270);

    for (const root of roots) {
      this._layoutTree(root, isVertical, isReversed);
    }

    // Offset all positions to the arrangement origin
    // Find the minimum position
    let minX = Infinity, minY = Infinity;
    for (const info of allInfos) {
      minX = Math.min(minX, info.vertex.x);
      minY = Math.min(minY, info.vertex.y);
    }

    // Move all nodes relative to origin
    for (const info of allInfos) {
      const v = info.vertex;
      const x = origin.x + (v.x - minX);
      const y = origin.y + (v.y - minY);
      if (v.node) {
        v.node.move(new Point(x, y));
      }
    }

    this.isValidLayout = true;
  }

  private _sortChildren(children: TreeNodeInfo[]): void {
    switch (this._sorting) {
      case TreeSortingAscending:
        children.sort((a, b) => {
          const ak = a.vertex.node ? String((a.vertex.node as any).data?.key ?? '') : '';
          const bk = b.vertex.node ? String((b.vertex.node as any).data?.key ?? '') : '';
          return ak.localeCompare(bk);
        });
        break;
      case TreeSortingDescending:
        children.sort((a, b) => {
          const ak = a.vertex.node ? String((a.vertex.node as any).data?.key ?? '') : '';
          const bk = b.vertex.node ? String((b.vertex.node as any).data?.key ?? '') : '';
          return bk.localeCompare(ak);
        });
        break;
      case TreeSortingReverse:
        children.reverse();
        break;
      case TreeSortingForwards:
      default:
        break;
    }
  }

  private _assignLayers(node: TreeNodeInfo, layer: number): void {
    node.layer = layer;
    for (const child of node.children) {
      this._assignLayers(child, layer + 1);
    }
  }

  private _layoutTree(root: TreeNodeInfo, isVertical: boolean, isReversed: boolean): void {
    // Compute subtree widths
    this._computeSubtreeWidth(root, isVertical);

    // Position the tree
    this._positionTree(root, 0, 0, isVertical, isReversed);
  }

  private _computeSubtreeWidth(node: TreeNodeInfo, isVertical: boolean): number {
    if (node.children.length === 0) {
      // Leaf node width is its own size
      const size = isVertical ? node.vertex.width : node.vertex.height;
      return size;
    }

    let totalWidth = 0;
    for (const child of node.children) {
      const childWidth = this._computeSubtreeWidth(child, isVertical);
      totalWidth += childWidth;
    }
    // Add spacing between children
    totalWidth += (node.children.length - 1) * this._nodeSpacing;

    const ownSize = isVertical ? node.vertex.width : node.vertex.height;
    return Math.max(totalWidth, ownSize);
  }

  private _positionTree(
    node: TreeNodeInfo,
    offsetX: number,
    offsetY: number,
    isVertical: boolean,
    isReversed: boolean
  ): void {
    // Position this node
    const subtreeWidth = this._computeSubtreeWidth(node, isVertical);

    if (isVertical) {
      // Vertical tree: layers go top-to-bottom, children spread horizontally
      const layerOffset = isReversed ? -node.layer * this._layerSpacing : node.layer * this._layerSpacing;
      node.vertex.x = offsetX + subtreeWidth / 2 - node.vertex.width / 2;
      node.vertex.y = offsetY + layerOffset;
    } else {
      // Horizontal tree: layers go left-to-right, children spread vertically
      const layerOffset = isReversed ? -node.layer * this._layerSpacing : node.layer * this._layerSpacing;
      node.vertex.x = offsetX + layerOffset;
      node.vertex.y = offsetY + subtreeWidth / 2 - node.vertex.height / 2;
    }

    // Position children
    let childOffset = 0;
    for (const child of node.children) {
      const childSubtreeWidth = this._computeSubtreeWidth(child, isVertical);

      if (isVertical) {
        this._positionTree(child, offsetX + childOffset, offsetY, isVertical, isReversed);
      } else {
        this._positionTree(child, offsetX, offsetY + childOffset, isVertical, isReversed);
      }

      childOffset += childSubtreeWidth + this._nodeSpacing;
    }
  }
}
