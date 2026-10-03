import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { EnumValue } from '../core/EnumValues';
import {
  GridArrangementLeftToRight, GridArrangementRightToLeft,
  GridSortingForwards, GridSortingReverse, GridSortingAscending, GridSortingDescending,
  GridAlignmentLocation, GridAlignmentPosition,
  GridLayoutLocation, GridLayoutCenter
} from '../core/EnumValues';
import { Link } from '../view/Link';
import { Part } from '../view/Part';
import { Layout } from './Layout';

/**
 * GridLayout - arranges parts in a grid pattern.
 * 官方 GridLayout（pretty.js 31840）：sorting 默认 Ascending(comparer=standardComparer，按 part.text)、
 * alignment 默认 Location(I4)、arrangement 默认 LeftToRight、cellSize 默认 (NaN,NaN)、spacing (10,10)、
 * wrappingWidth NaN → viewportBounds.width - padding。
 */
export class GridLayout extends Layout {
  static readonly className: string = "GridLayout";

  private _wrappingWidth: number = NaN;
  private _wrappingColumn: number = NaN;
  private _cellSize: Size = new Size(NaN, NaN);
  private _spacing: Size = new Size(10, 10);
  private _alignment: EnumValue = GridLayoutLocation;
  private _arrangement: EnumValue = GridArrangementLeftToRight;
  private _sorting: EnumValue = GridSortingAscending;
  private _comparer: ((a: any, b: any) => number) | null = GridLayout.standardComparer;

  /** 官方 GridLayout 构造：默认 isViewportSized=true，`t && Object.assign(this, t)` */
  constructor(init?: any) {
    super();
    this.isViewportSized = true;
    if (init) Object.assign(this, init);
  }

  /** 官方 setter：只接受 >0 或 NaN；wrappingWidth 决定 isViewportSized = isNaN(t) */
  get wrappingWidth(): number { return this._wrappingWidth; }
  set wrappingWidth(val: number) {
    if (val > 0 || isNaN(val)) {
      this._wrappingWidth = val;
      this.isViewportSized = isNaN(val);
      this.invalidateLayout();
    }
  }

  get wrappingColumn(): number { return this._wrappingColumn; }
  set wrappingColumn(val: number) {
    if (val > 0 || isNaN(val)) {
      this._wrappingColumn = val;
      this.invalidateLayout();
    }
  }

  get comparer(): ((a: any, b: any) => number) | null { return this._comparer; }
  set comparer(val: ((a: any, b: any) => number) | null) { this._comparer = val; this.invalidateLayout(); }

  get cellSize(): Size { return this._cellSize; }
  set cellSize(val: Size) { this._cellSize = val.copy(); this.invalidateLayout(); }

  get spacing(): Size { return this._spacing; }
  set spacing(val: Size) { this._spacing = val.copy(); this.invalidateLayout(); }

  get alignment(): EnumValue { return this._alignment; }
  set alignment(val: EnumValue) { this._alignment = val; this.invalidateLayout(); }

  get arrangement(): EnumValue { return this._arrangement; }
  set arrangement(val: EnumValue) { this._arrangement = val; this.invalidateLayout(); }

  get sorting(): EnumValue { return this._sorting; }
  set sorting(val: EnumValue) { this._sorting = val; this.invalidateLayout(); }

  copy(): GridLayout {
    const copy = new (this.constructor as new () => any)();
    this.cloneProtected(copy);
    copy._wrappingWidth = this._wrappingWidth;
    copy._wrappingColumn = this._wrappingColumn;
    copy._cellSize = this._cellSize.copy();
    copy._spacing = this._spacing.copy();
    copy._alignment = this._alignment;
    copy._arrangement = this._arrangement;
    copy._sorting = this._sorting;
    copy._comparer = this._comparer;
    return copy;
  }

  /** 官方 GridLayout.doLayout（pretty.js 31866） */
  doLayout(coll: any): void {
    this._arrangementOrigin = this.initialOrigin(this._arrangementOrigin);
    const collected = this.collectParts(coll);
    const diagram = this.diagram;

    const parts: Part[] = [];
    const it = collected.iterator;
    while (it.next()) {
      const m: any = it.value;
      // 官方：有端点的 Link 不参与网格布局
      if (m instanceof Link && (m.fromNode !== null || m.toNode !== null)) continue;
      m.ensureBounds();
      parts.push(m);
    }
    if (parts.length === 0) return;

    // 官方 sorting：20 Forward 不动 / 21 Reverse / 22 Ascending(comparer) / 23 Ascending 后 Reverse
    switch (this._sorting) {
      case GridSortingForwards:
        break;
      case GridSortingReverse:
        parts.reverse();
        break;
      case GridSortingAscending:
        if (this._comparer) parts.sort(this._comparer);
        break;
      case GridSortingDescending:
        if (this._comparer) parts.sort(this._comparer);
        parts.reverse();
        break;
      default:
        break;
    }

    let wrapCol = this._wrappingColumn;
    if (isNaN(wrapCol)) wrapCol = 0;
    let wrapWidth: number;
    if (isNaN(this._wrappingWidth) && diagram !== null) {
      const vb = diagram.viewportBounds;
      const pad = diagram.padding;
      wrapWidth = Math.max(vb.width - pad.left - pad.right, 0);
    } else {
      wrapWidth = Math.max(this._wrappingWidth, 0);
    }
    if (wrapCol <= 0 && wrapWidth <= 0) wrapCol = 1;

    let spX = this._spacing.width;
    if (!isFinite(spX)) spX = 0;
    let spY = this._spacing.height;
    if (!isFinite(spY)) spY = 0;

    if (diagram !== null) diagram.startTransaction('Layout');
    const rects: Rect[] = [];
    if (this._alignment === GridAlignmentPosition || this._alignment === GridLayoutCenter) {
      this._layoutPosition(parts, wrapWidth, wrapCol, spX, spY, rects);
    } else {
      this._layoutLocation(parts, wrapWidth, wrapCol, spX, spY, rects);
    }

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    for (const r of rects) {
      minX = Math.min(minX, r.x);
      minY = Math.min(minY, r.y);
      maxX = Math.max(maxX, r.x + r.width);
    }
    if (this._arrangement === GridArrangementRightToLeft) {
      this.commitLayers(rects, new Point(minX + spX / 2 - (maxX + minX), minY - spY / 2));
    } else {
      this.commitLayers(rects, new Point(minX - spX / 2, minY - spY / 2));
    }
    if (diagram !== null) diagram.commitTransaction('Layout');
    this.isValidLayout = true;
  }

  /** 官方 GridAlignment.Position 分支 R4（pretty.js 31927） */
  private _layoutPosition(parts: Part[], wrapWidth: number, wrapCol: number, spX: number, spY: number, out: Rect[]): void {
    const scratch = new Rect();
    let cellW = Math.max(this._cellSize.width, 1);
    if (!isFinite(cellW)) {
      cellW = 0;
      for (const p of parts) cellW = Math.max(cellW, this.getLayoutBounds(p).width);
    }
    cellW += spX;
    cellW = Math.max(cellW, 1);
    let cellH = Math.max(this._cellSize.height, 1);
    if (!isFinite(cellH)) {
      cellH = 0;
      for (const p of parts) cellH = Math.max(cellH, this.getLayoutBounds(p).height);
    }
    cellH += spY;
    cellH = Math.max(cellH, 1);

    const rtl = this._arrangement === GridArrangementRightToLeft;
    const ox = this._arrangementOrigin.x;
    const oy = this._arrangementOrigin.y;
    let cx = ox;
    let rowTop = oy;
    let colCount = 0;
    let rowH = 0;

    for (const p of parts) {
      const bounds = this.getLayoutBounds(p);
      void scratch;
      const spanCols = Math.ceil((bounds.width + spX) / cellW);
      const spanRows = Math.ceil((bounds.height + spY) / cellH);
      const stepX = spanCols * cellW;
      const stepY = spanRows * cellH;
      const right = rtl ? Math.abs(cx - bounds.width) : cx + bounds.width;
      if ((wrapCol > 0 && colCount > wrapCol - 1) || (wrapWidth > 0 && colCount > 0 && right - ox > wrapWidth)) {
        out.push(new Rect(0, rowTop, wrapWidth + spX, rowH));
        colCount = 0;
        cx = ox;
        rowTop += rowH;
        rowH = 0;
      }
      rowH = Math.max(rowH, stepY);
      const n = rtl ? -bounds.width : 0;
      p.moveTo(cx + n + p.margin.left, rowTop + p.margin.top);
      if (rtl) cx -= stepX;
      else cx += stepX;
      colCount++;
    }
    out.push(new Rect(0, rowTop, wrapWidth + spX, rowH));
  }

  /** 官方 GridAlignment.Location 分支 I4（pretty.js 31957，默认） */
  private _layoutLocation(parts: Part[], wrapWidth: number, wrapCol: number, spX: number, spY: number, out: Rect[]): void {
    const scratch = new Rect();
    let cellW = Math.max(this._cellSize.width, 1);
    let maxLeft = 0;
    let maxRight = 0;
    let maxTop = 0;
    const tPt = new Point();
    for (const p of parts) {
      const bounds = this.getLayoutBounds(p);
      const t = p.getRelativePoint(p.locationObject, p.locationSpot, tPt);
      maxLeft = Math.max(maxLeft, t.x);
      maxRight = Math.max(maxRight, bounds.width - t.x);
      maxTop = Math.max(maxTop, t.y);
    }
    const rtl = this._arrangement === GridArrangementRightToLeft;
    if (rtl) maxLeft += spX;
    else maxRight += spX;
    cellW = isFinite(cellW) ? Math.max(cellW + spX, 1) : Math.max(maxLeft + maxRight, 1);

    const ox = this._arrangementOrigin.x;
    const oy = this._arrangementOrigin.y;
    let cx = ox;
    let rowTop = oy;
    let inRow = 0;
    let rowStartX = 0;
    let minOffset = 0;
    const cellH = Math.max(this._cellSize.height, 1);
    let rowMaxY = 0;
    let rowH = 0;
    let isFirstRow = true;
    const rPt = new Point();
    if (wrapWidth >= maxLeft) wrapWidth -= maxLeft;

    for (let n = 0; n < parts.length; n++) {
      const p = parts[n];
      const bounds = this.getLayoutBounds(p);
      const t = p.getRelativePoint(p.locationObject, p.locationSpot, tPt);
      if (inRow > 0) {
        // 官方：光标对齐到 cell 网格
        let d = rtl ? (cx - ox - (bounds.width - t.x)) / cellW : (cx - ox + t.x) / cellW;
        const rd = Math.round(d);
        d = Math.abs(rd - d) <= 1e-8 ? rd : (rtl ? Math.floor(d) : Math.ceil(d));
        cx = d * cellW + ox;
      } else {
        rowStartX = rtl ? cx + t.x + bounds.width : cx - t.x;
      }
      let right = rtl ? -(cx + t.x) + rowStartX : cx + bounds.width - t.x - rowStartX;
      if ((wrapCol > 0 && inRow > wrapCol - 1) || (wrapWidth > 0 && inRow > 0 && right > wrapWidth)) {
        out.push(new Rect(0, isFirstRow ? rowTop - rowMaxY : rowTop, wrapWidth + spX, rowH + rowMaxY + spY));
        for (let d = 0; d < inRow && n !== inRow; d++) {
          const fp = parts[n - inRow + d];
          const rt = fp.getRelativePoint(fp.locationObject, fp.locationSpot, rPt);
          fp.moveTo(fp.position.x, fp.position.y + rowMaxY - rt.y);
        }
        rowH += spY;
        if (isFirstRow) rowTop += rowH;
        else rowTop += rowH + rowMaxY;
        rowMaxY = 0;
        rowH = 0;
        inRow = 0;
        cx = ox;
        isFirstRow = false;
      }
      if (cx === ox) {
        minOffset = rtl ? Math.max(minOffset, bounds.width - t.x) : Math.min(minOffset, -t.x);
      }
      rowMaxY = Math.max(rowMaxY, t.y);
      rowH = Math.max(rowH, bounds.height - t.y);
      if (isFinite(cellH)) rowH = Math.max(rowH, Math.max(bounds.height, cellH) - t.y);
      if (isFirstRow) p.moveTo(cx - t.x, rowTop - t.y);
      else p.moveTo(cx - t.x, rowTop);
      if (rtl) cx -= t.x + spX;
      else cx += bounds.width - t.x + spX;
      inRow++;
    }
    out.push(new Rect(0, rowTop, wrapWidth + spX, (isFirstRow ? rowH : rowH + rowMaxY) + spY));
    if (parts.length !== inRow) {
      for (let d = 0; d < inRow; d++) {
        const p = parts[parts.length - inRow + d];
        const rt = p.getRelativePoint(p.locationObject, p.locationSpot, rPt);
        p.moveTo(p.position.x, p.position.y + rowMaxY - rt.y);
      }
    }
    for (const r of out) {
      if (rtl) {
        r.width += minOffset;
        r.x -= minOffset;
      } else if (r.x > minOffset) {
        r.width += r.x - minOffset;
        r.x = minOffset;
      }
    }
    void maxTop;
  }

  // ============ 官方 GridLayout.commitLayers（与官方一致的空钩子） ============
  commitLayers(grid: any, origin: Point): void {
    void grid;
    void origin;
  }

  static Location = GridLayoutLocation;
  static Center = GridLayoutCenter;
  static Forwards = GridSortingForwards;
  static Forward = GridSortingForwards;
  static Reverse = GridSortingReverse;
  static Ascending = GridSortingAscending;
  static Descending = GridSortingDescending;
  static Position = GridAlignmentPosition;
  static LeftToRight = GridArrangementLeftToRight;
  static RightToLeft = GridArrangementRightToLeft;

  /** 官方 GridLayout.standardComparer：按 part.text 比较 */
  static standardComparer(a: Part, b: Part): number {
    const ea = a.text;
    const eb = b.text;
    return ea < eb ? -1 : ea > eb ? 1 : 0;
  }

  /** 官方 GridLayout.smartComparer：按 part.text 忽略大小写并数字感知比较 */
  static smartComparer(a: Part, b: Part): number {
    if (a !== null) {
      if (b !== null) {
        const sa = a.text.toLocaleLowerCase();
        const sb = b.text.toLocaleLowerCase();
        const na = sa.split(/([+-]?[.]?\d+(?:\.\d*)?(?:e[+-]?\d+)?)/);
        const nb = sb.split(/([+-]?[.]?\d+(?:\.\d*)?(?:e[+-]?\d+)?)/);
        let r = 0;
        for (let i = 0; i < na.length; i++) {
          if (nb[i] !== '' && nb[i] !== undefined) {
            const la = parseFloat(na[i]);
            const lb = parseFloat(nb[i]);
            if (isNaN(la)) {
              if (isNaN(lb)) {
                if (na[i].localeCompare(nb[i]) !== 0) return na[i].localeCompare(nb[i]);
                continue;
              }
              return 1;
            } else {
              if (isNaN(lb)) return -1;
              if (la - lb !== 0) return la - lb;
              continue;
            }
          } else {
            if (na[i] === '') continue;
            return 1;
          }
        }
        return nb[na.length] !== '' && nb[na.length] !== undefined ? -1 : 0;
      }
      return 1;
    }
    return b !== null ? -1 : 0;
  }
}
