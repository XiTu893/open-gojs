import { Rect } from '../core/Rect';
import { Point } from '../core/Point';
import { List } from '../core/List';
import { Set } from '../core/Set';
import { Part } from '../view/Part';
import { Node } from '../view/Node';
import { LayoutEdge } from './LayoutEdge';
import { LayoutNetwork } from './LayoutNetwork';

/**
 * LayoutVertex - represents a node in the layout network.
 *
 * 本类以前只有 `width/height/centerX/centerY/addXxxEdge` 几个成员，官方
 * `LayoutVertex` 的其余公开面（go.d.ts: class LayoutVertex）全缺，扩展一碰就挂：
 * `RadialLayout.findDistances` 的 `least.edges.each(...)` →
 * `Cannot read properties of undefined (reading 'each')`（实测 radialPartition）。
 */
export class LayoutVertex {
  static readonly className: string = "LayoutVertex";
  /** The network this vertex belongs to */
  network: LayoutNetwork | null = null;

  /** 官方 LayoutVertex.data：一般就是 Node/Link 的 data */
  data: any = null;

  /** X position of the vertex center */
  x: number = 0;

  /** Y position of the vertex center */
  y: number = 0;

  /** Bounding rectangle of the vertex */
  bounds: Rect = new Rect(0, 0, 0, 0);

  /**
   * 官方 LayoutVertex.focus：bounds 左上角到「连接点」的偏移（像素）。
   * `centerX`/`centerY` 就是 `bounds.x/y + focus`。
   */
  focus: Point = new Point(0, 0);

  /**
   * 官方 `LayoutVertex.actualAngle`（度）：该 vertex 最终被摆放的角度。
   * CircularLayout 在环上定位时写入；子类（如 friendWheel 的 WheelLayout）
   * 覆写 `commitNodes()` / `commitLinks()` 时靠它算节点旋转与连线曲率。
   * 之前本项目没有这个字段，`v.actualAngle` 恒为 undefined，导致
   * friendWheel 的旋转与曲率逻辑全部拿到 NaN。
   */
  actualAngle: number = 0;

  /** Width of the vertex */
  get width(): number {
    return this.bounds.width;
  }
  set width(val: number) {
    this.bounds.width = val;
  }

  /** Height of the vertex */
  get height(): number {
    return this.bounds.height;
  }
  set height(val: number) {
    this.bounds.height = val;
  }

  /** Focus X offset (0-1 relative to width) for connection points */
  focusX: number = 0.5;

  /** Focus Y offset (0-1 relative to height) for connection points */
  focusY: number = 0.5;

  /** The Part associated with this vertex, if any */
  part: Part | null = null;

  /** Edges where this vertex is the source */
  sourceEdges: List<LayoutEdge> = new List<LayoutEdge>();

  /** Edges where this vertex is the destination */
  destinationEdges: List<LayoutEdge> = new List<LayoutEdge>();

  /** The Node associated with this vertex, if any */
  node: Node | null = null;

  /** Whether this vertex is artificial (not associated with a real part) */
  _isArtificial: boolean = false;

  /** Internal index for algorithms */
  _index: number = -1;

  /** Add an edge where this vertex is the destination */
  addDestinationEdge(edge: LayoutEdge): void {
    if (edge === null || edge === undefined) return;
    if (!this.destinationEdges.contains(edge)) this.destinationEdges.add(edge);
  }

  /** Add an edge where this vertex is the source */
  addSourceEdge(edge: LayoutEdge): void {
    if (edge === null || edge === undefined) return;
    if (!this.sourceEdges.contains(edge)) this.sourceEdges.add(edge);
  }

  /** 官方 LayoutVertex.deleteSourceEdge */
  deleteSourceEdge(edge: LayoutEdge): void {
    if (edge === null || edge === undefined) return;
    this.sourceEdges.remove(edge);
  }

  /** 官方 LayoutVertex.deleteDestinationEdge */
  deleteDestinationEdge(edge: LayoutEdge): void {
    if (edge === null || edge === undefined) return;
    this.destinationEdges.remove(edge);
  }

  /** Delete an edge from both source and destination lists */
  deleteEdge(edge: LayoutEdge): void {
    this.sourceEdges.remove(edge);
    this.destinationEdges.remove(edge);
  }

  /** 官方 LayoutVertex.sourceVertexes：sourceEdges 另一端的顶点 */
  get sourceVertexes(): any {
    const s = new Set<LayoutVertex>();
    const it = this.sourceEdges.iterator;
    while (it.next()) {
      const e: any = it.value;
      if (e && e.fromVertex) s.add(e.fromVertex);
    }
    return s.iterator;
  }

  /** 官方 LayoutVertex.destinationVertexes */
  get destinationVertexes(): any {
    const s = new Set<LayoutVertex>();
    const it = this.destinationEdges.iterator;
    while (it.next()) {
      const e: any = it.value;
      if (e && e.toVertex) s.add(e.toVertex);
    }
    return s.iterator;
  }

  /** 官方 LayoutVertex.vertexes = sourceVertexes ∪ destinationVertexes */
  get vertexes(): any {
    const s = new Set<LayoutVertex>();
    let it = this.sourceEdges.iterator;
    while (it.next()) {
      const e: any = it.value;
      if (e && e.fromVertex) s.add(e.fromVertex);
    }
    it = this.destinationEdges.iterator;
    while (it.next()) {
      const e: any = it.value;
      if (e && e.toVertex) s.add(e.toVertex);
    }
    return s.iterator;
  }

  /**
   * 官方 LayoutVertex.edges：sourceEdges + destinationEdges 拼成的 List 的**迭代器**。
   * 官方迭代器带 `each`，扩展（RadialLayout / ParallelLayout）直接 `v.edges.each(...)`。
   */
  get edges(): any {
    const l = new List<LayoutEdge>();
    for (const e of this.sourceEdges) l.add(e);
    for (const e of this.destinationEdges) l.add(e);
    return l.iterator;
  }

  /** 官方 LayoutVertex.edgesCount */
  get edgesCount(): number {
    return this.sourceEdges.count + this.destinationEdges.count;
  }

  /** 官方 LayoutVertex.commit()：把最终 bounds 写回 data.bounds（TreeVertex 覆写） */
  commit(): void {
    const d = this.data;
    if (d !== null && d !== undefined && d.bounds) {
      const b = this.bounds;
      const db = d.bounds;
      db.x = b.x; db.y = b.y; db.width = b.width; db.height = b.height;
    }
  }

  /** Get the center point of this vertex（官方 `bounds + focus`） */
  get center(): { x: number; y: number } {
    return { x: this.bounds.x + this.focus.x, y: this.bounds.y + this.focus.y };
  }

  /** 官方 LayoutVertex.focus：像素偏移（兼容老的 focusX/focusY 分数写法） */
  private _focusPx(): { x: number; y: number } {
    return { x: this.focus.x, y: this.focus.y };
  }

  /** 官方 LayoutVertex.centerX = bounds.x + focus.x */
  get centerX(): number {
    return this.bounds.x + this.focus.x;
  }
  set centerX(val: number) {
    this.bounds.x = val - this.focus.x;
  }

  /** 官方 LayoutVertex.centerY = bounds.y + focus.y */
  get centerY(): number {
    return this.bounds.y + this.focus.y;
  }
  set centerY(val: number) {
    this.bounds.y = val - this.focus.y;
  }

  static smartComparer(a: LayoutVertex, b: LayoutVertex): number {
    const na = (a as any).data ? String((a as any).data.key) : '';
    const nb = (b as any).data ? String((b as any).data.key) : '';
    const naNum = parseFloat(na);
    const nbNum = parseFloat(nb);
    if (!isNaN(naNum) && !isNaN(nbNum)) return naNum - nbNum;
    return na < nb ? -1 : na > nb ? 1 : 0;
  }
}
