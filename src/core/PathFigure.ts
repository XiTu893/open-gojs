import { PathSegment } from './PathSegment';
import { List } from './List';

/**
 * PathFigure - 路径图形（起点 + 段集合）
 */
export class PathFigure {
  /** 起点 X */
  public startX: number;
  /** 起点 Y */
  public startY: number;
  /** 是否闭合 */
  public isFilled: boolean;
  /** 是否描边 */
  public isShadowed: boolean;
  /** 段集合 */
  private _segments: List<PathSegment>;

  constructor(startX: number = 0, startY: number = 0, isFilled: boolean = true) {
    this.startX = startX;
    this.startY = startY;
    this.isFilled = isFilled;
    this.isShadowed = false;
    this._segments = new List<PathSegment>();
  }

  /** 获取段集合 */
  get segments(): List<PathSegment> {
    return this._segments;
  }

  /** 添加段 */
  add(seg: PathSegment): this {
    this._segments.add(seg);
    return this;
  }

  /** 移除段 */
  remove(seg: PathSegment): boolean {
    return this._segments.remove(seg);
  }

  /** 清空段 */
  clear(): this {
    this._segments.clear();
    return this;
  }

  copy(): PathFigure {
    const fig = new PathFigure(this.startX, this.startY, this.isFilled);
    fig.isShadowed = this.isShadowed;
    const it = this._segments.iterator;
    while (it.next()) {
      fig.add(it.value.copy());
    }
    return fig;
  }

  equals(fig: PathFigure): boolean {
    if (!(fig instanceof PathFigure)) return false;
    if (this.startX !== fig.startX || this.startY !== fig.startY) return false;
    if (this._segments.count !== fig._segments.count) return false;
    const it1 = this._segments.iterator;
    const it2 = fig._segments.iterator;
    while (it1.next() && it2.next()) {
      if (!it1.value.equals(it2.value)) return false;
    }
    return true;
  }
}
