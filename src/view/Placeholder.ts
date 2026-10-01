import { GraphObject } from './GraphObject';
import { Rect } from '../core/Rect';
import { Point } from '../core/Point';
import type { Group } from './Group';

export class Placeholder extends GraphObject {
  static readonly className: string = "Placeholder";
  private _padding: number = 0;

  constructor(init?: Placeholder) {
    super();
    this._className = 'Placeholder';
    this._isPlaceholder = true;
    if (init) {
      this.set(init);
    }
  }

  get padding(): number {
    return this._padding;
  }
  set padding(val: number) {
    if (this._padding !== val) {
      this._padding = val;
      this._invalidateMeasure();
    }
  }

  get _placeholderBounds(): Rect {
    return this._actualBounds;
  }

  /**
   * 官方 `Placeholder.computeMemberBounds(result)`：把所属 Group 的可见成员并集写入 `result`（原地修改并返回）。
   * - 跳过不可见成员；Link 仅在 `Group.computesBoundsIncludingLinks` 时计入，且端点为本 Group 的 Link 不计入；
   * - 无有效成员 → `result = (group.location.x, group.location.y, 0, 0)`。
   */
  computeMemberBounds(result: Rect): Rect {
    const group = this._findGroup();
    if (group === null) {
      result.setTo(0, 0, 0, 0);
      return result;
    }
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    let any = false;
    const it = group.memberParts.iterator;
    while (it.next()) {
      const member = it.value;
      if (!member.isVisible()) continue;
      if ((member as unknown as { _className: string })._className === 'Link') {
        if (!group.computesBoundsIncludingLinks) continue;
        const ends = member as unknown as { fromNode: unknown; toNode: unknown };
        if (ends.fromNode === group || ends.toNode === group) continue;
      }
      const b = member.actualBounds;
      if (!Number.isFinite(b.x) || !Number.isFinite(b.y)) continue;
      any = true;
      if (b.x < left) left = b.x;
      if (b.y < top) top = b.y;
      if (b.right > right) right = b.right;
      if (b.bottom > bottom) bottom = b.bottom;
    }
    if (any && Number.isFinite(left) && Number.isFinite(top)) {
      result.setTo(left, top, right - left, bottom - top);
    } else {
      const loc = group.location;
      result.setTo(loc.x, loc.y, 0, 0);
    }
    return result;
  }

  /**
   * 官方 `Placeholder.computeBorder(result)`：成员并集再按 `margin` 外扩，写入 `result`（原地修改并返回）。
   * - 子图折叠（`!isSubGraphExpanded`）时宽高为 0；
   * - `Group.computesBoundsIncludingLocation` 且 group.location 有效时，把 location 并入边界。
   */
  computeBorder(result: Rect): Rect {
    const d = this.diagram;
    if (d !== null && d.animationManager.isAnimating) return result;
    const group = this._findGroup();
    if (group === null) return result;
    const union = new Rect();
    this.computeMemberBounds(union);
    const m = this.margin;
    if (!group.isSubGraphExpanded) {
      result.setTo(union.x - m.left, union.y - m.top, 0, 0);
    } else {
      result.setTo(
        union.x - m.left,
        union.y - m.top,
        Math.max(union.width + m.left + m.right, 0),
        Math.max(union.height + m.top + m.bottom, 0)
      );
    }
    if (group.computesBoundsIncludingLocation && group.location.isReal()) {
      result.unionPoint(group.location);
    }
    return result;
  }

  /**
   * 官方 Placeholder.measure（computeBorder）：
   * 1) union 可见成员的 actualBounds（文档坐标，成员 ab 实值才计入；跳过 Link）；
   * 2) 无成员 union → border = group.location 实值点 (0×0)，否则 (0,0)；
   * 3) padding（number = 四边均匀）外扩；
   * 4) measuredBounds = (0,0,max(borderW,minW),max(borderH,minH))；
   * 5) 有成员 union 且 border x/y 实值 → group.location = border 按 group.locationSpot 锚点。
   */
  _measure(availW: number, availH: number): void {
    const group = this._findGroup();
    if (group) {
      let union: Rect | null = null;
      const it = (group as any).memberParts.iterator;
      while (it.next()) {
        const part: any = it.value;
        if (!part.visible) continue;
        if (part._className === 'Link') continue;
        const ab = part.actualBounds;
        if (!ab || isNaN(ab.x) || isNaN(ab.y)) continue;
        if (union) {
          union = union.unionRect(ab);
        } else {
          union = ab.copy();
        }
      }
      let border: Rect;
      if (union) {
        const pad = this._padding;
        border = new Rect(union.x - pad, union.y - pad, union.width + pad * 2, union.height + pad * 2);
      } else {
        const gloc = group.location;
        border = new Rect(gloc && !isNaN(gloc.x) ? gloc.x : 0, gloc && !isNaN(gloc.y) ? gloc.y : 0, 0, 0);
      }
      const minSize = this.minSize;
      const mw = minSize && minSize.width > 0 ? minSize.width : 0;
      const mh = minSize && minSize.height > 0 ? minSize.height : 0;
      this._measuredBounds = new Rect(0, 0, Math.max(border.width, mw), Math.max(border.height, mh));
      this._naturalBounds = this._measuredBounds.copy();
      if (union && Number.isFinite(border.x) && Number.isFinite(border.y)) {
        const ls = group.locationSpot;
        const pt = new Point(
          border.x + ls.x * border.width + ls.offsetX,
          border.y + ls.y * border.height + ls.offsetY
        );
        if (!isNaN(pt.x) && !isNaN(pt.y)) {
          group.location = pt;
        }
      }
    } else {
      this._measuredBounds = new Rect(0, 0, 0, 0);
      this._naturalBounds = this._measuredBounds.copy();
    }
    this._applySizeConstraints();
  }

  _arrange(bounds: Rect): void {
    this._actualBounds = bounds.copy();
  }

  private _findGroup(): Group | null {
    let p: any = this._panel;
    while (p) {
      if (p._memberParts !== undefined) return p as Group;
      p = p._panel;
    }
    return null;
  }

  copy(): Placeholder {
    const p = new Placeholder();
    this._copyPropertiesTo(p);
    p._padding = this._padding;
    return p;
  }
}

GraphObject.defineBuilder('Placeholder', Placeholder);
