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

  /** X position of the vertex center — 官方 `x` 即 `bounds.x`（centerX setter 写 bounds.x） */
  get x(): number { return this.bounds.x; }
  set x(val: number) { this.bounds.x = val; }

  /** Y position of the vertex center — 官方 `y` 即 `bounds.y` */
  get y(): number { return this.bounds.y; }
  set y(val: number) { this.bounds.y = val; }

  /**
   * Bounding rectangle of the vertex — 官方构造默认 `Rect(0,0,10,10)`。
   * 真实节点由 `addNode` 立刻覆盖；未拿到 node 的人工顶点（dummy）保持 10×10，
   * `commitNodes`/`commitLinks` 的中心与端点计算才与官方一致。
   */
  bounds: Rect = new Rect(0, 0, 0, 0);

  /**
   * 官方 LayoutVertex.focus：bounds 左上角到「连接点」的偏移（像素）。
   * `centerX`/`centerY` 就是 `bounds.x/y + focus`。
   * 官方构造默认 `Point(5,5)`；真实节点在 `node` 被赋值时算一次。
   * 通过 `focus`/`focusX`/`focusY` 写入的值记为「调用方显式指定」，
   * `_applyVertexFocus` 不得再覆盖（如 sankey 样例 SankeyLayout.makeNetwork
   * 里 `v.focusX = shape.actualBounds.x`）。
   */
  private _focus: Point = new Point(0, 0);
  private _focusUserSet: boolean = false;

  get focus(): Point { return this._focus; }
  set focus(v: Point) { this._focus = v; this._focusUserSet = true; }

  /** 官方语义：focus 是否已被调用方显式设置 */
  get isFocusUserSet(): boolean { return this._focusUserSet; }

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

  /**
   * `focus.x` 的别名（官方 `LayoutVertex.focusX`）。
   * 官方 focusX/focusY 与 focus 是同一份数据的两个名字：子类布局
   * （如 sankey 样例的 SankeyLayout.makeNetwork 里 `v.focusX = shape.actualBounds.x`）
   * 直接写这两个字段，必须真正落到像素偏移 `focus` 上，否则列内打包读到的仍是默认值。
   */
  get focusX(): number { return this._focus.x; }
  set focusX(val: number) { this._focus.x = val; this._focusUserSet = true; }

  /** `focus.y` 的别名（官方 `LayoutVertex.focusY`） */
  get focusY(): number { return this._focus.y; }
  set focusY(val: number) { this._focus.y = val; this._focusUserSet = true; }

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

  /** 官方 LayoutVertex.layer：层号（LayeredDigraphLayout.assignLayers 写入） */
  layer: number = -1;

  /** 官方 LayoutVertex.component：OptimalLinkLength 归组用 */
  component: number = -1;

  /** 官方 LayoutVertex.oi：visited 标记（OptimalLinkLength 用） */
  oi: boolean = false;

  /** 官方 LayoutVertex.index：层内序号（= _index，官方全流水线统一用 .index） */
  get index(): number { return this._index; }
  set index(val: number) { this._index = val; }

  /** 官方 LayoutVertex.column：列号（列轴推进位，columnSpacing 单位） */
  column: number = 0;

  // ============ 官方 LayeredDigraphVertex 字段 ============

  /** 官方 LayeredDigraphVertex.near：人工顶点对齐的相邻真实顶点 */
  near: LayoutVertex | null = null;

  /** 官方 LayeredDigraphVertex.bk：人工顶点种类（1 起点旁/2 中段/3 终点旁） */
  bk: number = 0;

  /** 官方 LayeredDigraphVertex.Se：打包后的列轴位置（像素，NaN=未算） */
  Se: number = NaN;

  /** 官方 LayeredDigraphVertex._n：链上累计端口偏移（像素） */
  _n: number = 0;

  /** 官方 LayeredDigraphVertex.Qn：链上的下一个顶点（环状，单点=自身） */
  Qn: LayoutVertex | null = null;

  /** 官方 LayeredDigraphVertex.Ec：链头 */
  Ec: LayoutVertex | null = null;

  /** 官方 LayeredDigraphVertex.gs：共享组根（Fu 累计用） */
  gs: LayoutVertex | null = null;

  /** 官方 LayeredDigraphVertex.Fu：组内最小余量 */
  Fu: number = Infinity;

  /** 官方 LayeredDigraphVertex.aI：在层表中的层号位置 */
  aI: number = 0;

  /** 官方 LayeredDigraphVertex.ca：层内序号（=index） */
  ca: number = 0;

  /** 官方 LayeredDigraphVertex.yk：nodeMinColumnSpace(v, true) 缓存 */
  yk: number | null = null;

  /** 官方 LayeredDigraphVertex.wk：nodeMinColumnSpace(v, false) 缓存 */
  wk: number | null = null;

  /** 官方 LayoutVertex.centered：非居中顶点在 oB 中做同层同宽扩展 */
  centered: boolean = true;

  /** 官方 LayeredDigraphVertex.Uw：getProperSourceVertexes 缓存 */
  private _properSourceVertexes: LayoutVertex[] | null = null;
  /** 官方 LayeredDigraphVertex.Gw：getProperDestinationVertexes 缓存 */
  private _properDestinationVertexes: LayoutVertex[] | null = null;
  /** 官方 LayeredDigraphVertex.qw：getProperSourceEdges 缓存 */
  private _properSourceEdges: LayoutEdge[] | null = null;
  /** 官方 LayeredDigraphVertex.Hw：getProperDestinationEdges 缓存 */
  private _properDestinationEdges: LayoutEdge[] | null = null;

  /** 官方 LayeredDigraphVertex.getProperSourceEdges：valid 的入边 */
  getProperSourceEdges(): LayoutEdge[] {
    if (this._properSourceEdges === null) {
      const t: LayoutEdge[] = [];
      const it = this.sourceEdges.iterator;
      while (it.next()) {
        const e = it.value;
        if (e.valid) t.push(e);
      }
      this._properSourceEdges = t;
    }
    return this._properSourceEdges;
  }

  /** 官方 LayeredDigraphVertex.getProperDestinationEdges：valid 的出边 */
  getProperDestinationEdges(): LayoutEdge[] {
    if (this._properDestinationEdges === null) {
      const t: LayoutEdge[] = [];
      const it = this.destinationEdges.iterator;
      while (it.next()) {
        const e = it.value;
        if (e.valid) t.push(e);
      }
      this._properDestinationEdges = t;
    }
    return this._properDestinationEdges;
  }

  /** 官方 LayeredDigraphVertex.getProperSourceVertexes：高→低层入边的起点（按 index 排序） */
  getProperSourceVertexes(): LayoutVertex[] {
    if (this._properSourceVertexes === null) {
      const t: LayoutVertex[] = [];
      const it = this.sourceEdges.iterator;
      while (it.next()) {
        const e = it.value;
        if (!e.valid) continue;
        const fv = e.fromVertex;
        const tv = e.toVertex;
        if (fv === null || tv === null) continue;
        if (fv.layer <= tv.layer) continue;
        t.push(fv);
      }
      t.sort((a, b) => b._index - a._index);
      this._properSourceVertexes = t;
    }
    return this._properSourceVertexes;
  }

  /** 官方 LayeredDigraphVertex.getProperDestinationVertexes：高→低层出边的终点（按 index 排序） */
  getProperDestinationVertexes(): LayoutVertex[] {
    if (this._properDestinationVertexes === null) {
      const t: LayoutVertex[] = [];
      const it = this.destinationEdges.iterator;
      while (it.next()) {
        const e = it.value;
        if (!e.valid) continue;
        const fv = e.fromVertex;
        const tv = e.toVertex;
        if (fv === null || tv === null) continue;
        if (fv.layer <= tv.layer) continue;
        t.push(tv);
      }
      t.sort((a, b) => b._index - a._index);
      this._properDestinationVertexes = t;
    }
    return this._properDestinationVertexes;
  }

  /** 官方 LayeredDigraphVertex.getDestinationEdge(v)：指向 v 的 valid 出边 */
  getDestinationEdge(v: LayoutVertex): LayoutEdge {
    const list = this.getProperDestinationEdges();
    for (const e of list) {
      if (e.toVertex === v) return e;
    }
    throw new Error('Unable to find destination edge to given vertex');
  }

  /** 官方 addSourceEdge/deleteSourceEdge：同时失效 proper 缓存 */
  invalidateProperCaches(): void {
    this._properSourceVertexes = null;
    this._properDestinationVertexes = null;
    this._properSourceEdges = null;
    this._properDestinationEdges = null;
  }

  private _invalidateProper(): void {
    this.invalidateProperCaches();
  }

  /** Add an edge where this vertex is the destination */
  addDestinationEdge(edge: LayoutEdge): void {
    if (edge === null || edge === undefined) return;
    if (!this.destinationEdges.contains(edge)) this.destinationEdges.add(edge);
    this._invalidateProper();
  }

  /** Add an edge where this vertex is the source */
  addSourceEdge(edge: LayoutEdge): void {
    if (edge === null || edge === undefined) return;
    if (!this.sourceEdges.contains(edge)) this.sourceEdges.add(edge);
    this._invalidateProper();
  }

  /** 官方 LayoutVertex.deleteSourceEdge */
  deleteSourceEdge(edge: LayoutEdge): void {
    if (edge === null || edge === undefined) return;
    this.sourceEdges.remove(edge);
    this._invalidateProper();
  }

  /** 官方 LayoutVertex.deleteDestinationEdge */
  deleteDestinationEdge(edge: LayoutEdge): void {
    if (edge === null || edge === undefined) return;
    this.destinationEdges.remove(edge);
    this._invalidateProper();
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

  /** 官方 LayoutVertex.commit()：把最终 bounds 移动 Node（并写回 data.bounds） */
  commit(): void {
    const d = this.data;
    if (d !== null && d !== undefined && d.bounds) {
      const b = this.bounds;
      const db = d.bounds;
      db.x = b.x; db.y = b.y; db.width = b.width; db.height = b.height;
    }
    if (this.node !== null) {
      this.node.move(new Point(this.bounds.x, this.bounds.y));
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
