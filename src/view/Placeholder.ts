import { GraphObject } from './GraphObject';
import { Rect } from '../core/Rect';
import { Point } from '../core/Point';
import { Margin } from '../core/Margin';
import type { Group } from './Group';

export class Placeholder extends GraphObject {
  static readonly className: string = "Placeholder";
  /** 官方 Placeholder.padding：number 或 Margin（官方 setter 把 number 归一成 Margin） */
  private _padding: number | Margin = 0;

  constructor(init?: Placeholder) {
    super();
    this._className = 'Placeholder';
    this._isPlaceholder = true;
    if (init) {
      this.set(init);
    }
  }

  get padding(): number | Margin {
    return this._padding;
  }
  set padding(val: number | Margin) {
    const old = this._padding;
    const differs = (typeof val === 'number' || typeof old === 'number')
      ? val !== old
      : !(old as Margin).equals || !(old as Margin).equals(val as Margin);
    if (!differs) return;
    this._padding = val;
    this._invalidateMeasure();
  }

  /** padding 的四边值（number 四边均匀；Margin 按 top/right/bottom/left） */
  private _padSides(): { t: number; r: number; b: number; l: number } {
    const p = this._padding;
    if (typeof p === 'number') return { t: p, r: p, b: p, l: p };
    const m = p as Margin;
    const nz = (v: any): number => (typeof v === 'number' && isFinite(v) ? v : 0);
    return { t: nz((m as any).top), r: nz((m as any).right), b: nz((m as any).bottom), l: nz((m as any).left) };
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
   * 官方 `Placeholder.computeBorder(result)`：成员并集再按 `padding`（Margin）外扩，写入 `result`。
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
    const p = this._padSides();
    if (!group.isSubGraphExpanded) {
      result.setTo(union.x - p.l, union.y - p.t, 0, 0);
    } else {
      result.setTo(
        union.x - p.l,
        union.y - p.t,
        Math.max(union.width + p.l + p.r, 0),
        Math.max(union.height + p.t + p.b, 0)
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
        const pad = this._padSides();
        border = new Rect(
          union.x - pad.l,
          union.y - pad.t,
          union.width + pad.l + pad.r,
          union.height + pad.t + pad.b
        );
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
