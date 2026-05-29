import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { EnumValue } from '../core/EnumValues';
import {
  GridLayoutLocation, GridLayoutCenter,
  GridArrangementLeftToRight, GridArrangementRightToLeft,
  GridArrangementTopToBottom, GridArrangementBottomToTop,
  TreeSortingForwards, TreeSortingReverse, TreeSortingAscending, TreeSortingDescending,
  GridSortingForwards, GridSortingReverse, GridSortingAscending, GridSortingDescending,
  GridAlignmentLocation, GridAlignmentPosition
} from '../core/EnumValues';
import { Node } from '../view/Node';
import { Layout } from './Layout';

/**
 * GridLayout - arranges parts in a grid pattern.
 */
export class GridLayout extends Layout {

  private _wrappingWidth: number = NaN;
  private _cellSize: Size = new Size(10, 10);
  private _spacing: Size = new Size(10, 10);
  private _alignment: EnumValue = GridLayoutLocation;
  private _arrangement: EnumValue = GridArrangementLeftToRight;
  private _sorting: EnumValue = TreeSortingForwards;

  get wrappingWidth(): number { return this._wrappingWidth; }
  set wrappingWidth(val: number) { this._wrappingWidth = val; }

  get cellSize(): Size { return this._cellSize; }
  set cellSize(val: Size) { this._cellSize = val.copy(); }

  get spacing(): Size { return this._spacing; }
  set spacing(val: Size) { this._spacing = val.copy(); }

  get alignment(): EnumValue { return this._alignment; }
  set alignment(val: EnumValue) { this._alignment = val; }

  get arrangement(): EnumValue { return this._arrangement; }
  set arrangement(val: EnumValue) { this._arrangement = val; }

  get sorting(): EnumValue { return this._sorting; }
  set sorting(val: EnumValue) { this._sorting = val; }

  copy(): GridLayout {
    const copy = new GridLayout();
    copy._arrangementOrigin = this._arrangementOrigin.copy();
    copy._wrappingWidth = this._wrappingWidth;
    copy._cellSize = this._cellSize.copy();
    copy._spacing = this._spacing.copy();
    copy._alignment = this._alignment;
    copy._arrangement = this._arrangement;
    copy._sorting = this._sorting;
    return copy;
  }

  doLayout(coll: any): void {
    const parts = this.collectParts(coll);
    if (parts.count === 0) return;

    // Separate nodes and links
    const nodes: Node[] = [];
    const it = parts.iterator;
    while (it.next()) {
      const part = it.value;
      if (part instanceof Node) {
        nodes.push(part);
      }
    }

    if (nodes.length === 0) return;

    // Sort nodes based on sorting option
    this._sortNodes(nodes);

    // Determine grid dimensions
    const isHorizontal = (
      this._arrangement === GridArrangementLeftToRight ||
      this._arrangement === GridArrangementRightToLeft
    );

    // Calculate wrapping
    let cols: number;
    if (!isNaN(this._wrappingWidth) && this._wrappingWidth > 0) {
      const cellW = this._cellSize.width + this._spacing.width;
      cols = Math.max(1, Math.floor((this._wrappingWidth - this._spacing.width) / cellW));
    } else {
      cols = Math.ceil(Math.sqrt(nodes.length));
    }
    const rows = Math.ceil(nodes.length / cols);

    // Position each node
    const origin = this.arrangementOrigin;
    for (let i = 0; i < nodes.length; i++) {
      let row: number, col: number;

      if (isHorizontal) {
        // Fill rows first (left-to-right or right-to-left)
        row = Math.floor(i / cols);
        col = i % cols;
        if (this._arrangement === GridArrangementRightToLeft) {
          col = cols - 1 - col;
        }
      } else {
        // Fill columns first (top-to-bottom or bottom-to-top)
        col = Math.floor(i / rows);
        row = i % rows;
        if (this._arrangement === GridArrangementBottomToTop) {
          row = rows - 1 - row;
        }
      }

      const bounds = this.getLayoutBounds(nodes[i]);
      const cellWidth = Math.max(this._cellSize.width, bounds.width);
      const cellHeight = Math.max(this._cellSize.height, bounds.height);

      let x = origin.x + col * (cellWidth + this._spacing.width);
      let y = origin.y + row * (cellHeight + this._spacing.height);

      // Apply alignment
      if (this._alignment === GridLayoutCenter) {
        x += (cellWidth - bounds.width) / 2;
        y += (cellHeight - bounds.height) / 2;
      }

      nodes[i].move(new Point(x, y));
    }

    this.isValidLayout = true;
  }

  private _sortNodes(nodes: Node[]): void {
    switch (this._sorting) {
      case TreeSortingReverse:
        nodes.reverse();
        break;
      case TreeSortingAscending:
        nodes.sort((a, b) => {
          const ak = (a as any).data ? String((a as any).data.key) : '';
          const bk = (b as any).data ? String((b as any).data.key) : '';
          return ak.localeCompare(bk);
        });
        break;
      case TreeSortingDescending:
        nodes.sort((a, b) => {
          const ak = (a as any).data ? String((a as any).data.key) : '';
          const bk = (b as any).data ? String((b as any).data.key) : '';
          return bk.localeCompare(ak);
        });
        break;
      case TreeSortingForwards:
      default:
        // Keep original order
        break;
    }
  }

  static Location = GridLayoutLocation;
  static Center = GridLayoutCenter;
  static Forwards = GridSortingForwards;
  static Reverse = GridSortingReverse;
  static Ascending = GridSortingAscending;
  static Descending = GridSortingDescending;
  static Position = GridAlignmentPosition;
  static smartComparer(a: any, b: any): number {
    const na = (a && a.data && a.data.name) || '';
    const nb = (b && b.data && b.data.name) || '';
    return na < nb ? -1 : na > nb ? 1 : 0;
  }
}
