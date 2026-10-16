import { Rect } from '../core/Rect';
import { Point } from '../core/Point';
import { List } from '../core/List';
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
export declare class LayoutVertex {
    static readonly className: string;
    /** The network this vertex belongs to */
    network: LayoutNetwork | null;
    /** 官方 LayoutVertex.data：一般就是 Node/Link 的 data */
    data: any;
    /** X position of the vertex center — 官方 `x` 即 `bounds.x`（centerX setter 写 bounds.x） */
    get x(): number;
    set x(val: number);
    /** Y position of the vertex center — 官方 `y` 即 `bounds.y` */
    get y(): number;
    set y(val: number);
    /**
     * Bounding rectangle of the vertex — 官方构造默认 `Rect(0,0,10,10)`。
     * 真实节点由 `addNode` 立刻覆盖；未拿到 node 的人工顶点（dummy）保持 10×10，
     * `commitNodes`/`commitLinks` 的中心与端点计算才与官方一致。
     */
    bounds: Rect;
    /**
     * 官方 LayoutVertex.focus：bounds 左上角到「连接点」的偏移（像素）。
     * `centerX`/`centerY` 就是 `bounds.x/y + focus`。
     * 官方构造默认 `Point(5,5)`；真实节点在 `node` 被赋值时算一次。
     * 通过 `focus`/`focusX`/`focusY` 写入的值记为「调用方显式指定」，
     * `_applyVertexFocus` 不得再覆盖（如 sankey 样例 SankeyLayout.makeNetwork
     * 里 `v.focusX = shape.actualBounds.x`）。
     */
    private _focus;
    private _focusUserSet;
    get focus(): Point;
    set focus(v: Point);
    /** 官方语义：focus 是否已被调用方显式设置 */
    get isFocusUserSet(): boolean;
    /**
     * 官方 `LayoutVertex.actualAngle`（度）：该 vertex 最终被摆放的角度。
     * CircularLayout 在环上定位时写入；子类（如 friendWheel 的 WheelLayout）
     * 覆写 `commitNodes()` / `commitLinks()` 时靠它算节点旋转与连线曲率。
     * 之前本项目没有这个字段，`v.actualAngle` 恒为 undefined，导致
     * friendWheel 的旋转与曲率逻辑全部拿到 NaN。
     */
    actualAngle: number;
    /** Width of the vertex */
    get width(): number;
    set width(val: number);
    /** Height of the vertex */
    get height(): number;
    set height(val: number);
    /**
     * `focus.x` 的别名（官方 `LayoutVertex.focusX`）。
     * 官方 focusX/focusY 与 focus 是同一份数据的两个名字：子类布局
     * （如 sankey 样例的 SankeyLayout.makeNetwork 里 `v.focusX = shape.actualBounds.x`）
     * 直接写这两个字段，必须真正落到像素偏移 `focus` 上，否则列内打包读到的仍是默认值。
     */
    get focusX(): number;
    set focusX(val: number);
    /** `focus.y` 的别名（官方 `LayoutVertex.focusY`） */
    get focusY(): number;
    set focusY(val: number);
    /** The Part associated with this vertex, if any */
    part: Part | null;
    /** Edges where this vertex is the source */
    sourceEdges: List<LayoutEdge>;
    /** Edges where this vertex is the destination */
    destinationEdges: List<LayoutEdge>;
    /** The Node associated with this vertex, if any */
    node: Node | null;
    /** Whether this vertex is artificial (not associated with a real part) */
    _isArtificial: boolean;
    /** Internal index for algorithms */
    _index: number;
    /** 官方 LayoutVertex.layer：层号（LayeredDigraphLayout.assignLayers 写入） */
    layer: number;
    /** 官方 LayoutVertex.component：OptimalLinkLength 归组用 */
    component: number;
    /** 官方 LayoutVertex.oi：visited 标记（OptimalLinkLength 用） */
    oi: boolean;
    /** 官方 LayoutVertex.index：层内序号（= _index，官方全流水线统一用 .index） */
    get index(): number;
    set index(val: number);
    /** 官方 LayoutVertex.column：列号（列轴推进位，columnSpacing 单位） */
    column: number;
    /** 官方 LayeredDigraphVertex.near：人工顶点对齐的相邻真实顶点 */
    near: LayoutVertex | null;
    /** 官方 LayeredDigraphVertex.bk：人工顶点种类（1 起点旁/2 中段/3 终点旁） */
    bk: number;
    /** 官方 LayeredDigraphVertex.Se：打包后的列轴位置（像素，NaN=未算） */
    Se: number;
    /** 官方 LayeredDigraphVertex._n：链上累计端口偏移（像素） */
    _n: number;
    /** 官方 LayeredDigraphVertex.Qn：链上的下一个顶点（环状，单点=自身） */
    Qn: LayoutVertex | null;
    /** 官方 LayeredDigraphVertex.Ec：链头 */
    Ec: LayoutVertex | null;
    /** 官方 LayeredDigraphVertex.gs：共享组根（Fu 累计用） */
    gs: LayoutVertex | null;
    /** 官方 LayeredDigraphVertex.Fu：组内最小余量 */
    Fu: number;
    /** 官方 LayeredDigraphVertex.aI：在层表中的层号位置 */
    aI: number;
    /** 官方 LayeredDigraphVertex.ca：层内序号（=index） */
    ca: number;
    /** 官方 LayeredDigraphVertex.yk：nodeMinColumnSpace(v, true) 缓存 */
    yk: number | null;
    /** 官方 LayeredDigraphVertex.wk：nodeMinColumnSpace(v, false) 缓存 */
    wk: number | null;
    /** 官方 LayoutVertex.centered：非居中顶点在 oB 中做同层同宽扩展 */
    centered: boolean;
    /** 官方 LayeredDigraphVertex.Uw：getProperSourceVertexes 缓存 */
    private _properSourceVertexes;
    /** 官方 LayeredDigraphVertex.Gw：getProperDestinationVertexes 缓存 */
    private _properDestinationVertexes;
    /** 官方 LayeredDigraphVertex.qw：getProperSourceEdges 缓存 */
    private _properSourceEdges;
    /** 官方 LayeredDigraphVertex.Hw：getProperDestinationEdges 缓存 */
    private _properDestinationEdges;
    /** 官方 LayeredDigraphVertex.getProperSourceEdges：valid 的入边 */
    getProperSourceEdges(): LayoutEdge[];
    /** 官方 LayeredDigraphVertex.getProperDestinationEdges：valid 的出边 */
    getProperDestinationEdges(): LayoutEdge[];
    /** 官方 LayeredDigraphVertex.getProperSourceVertexes：高→低层入边的起点（按 index 排序） */
    getProperSourceVertexes(): LayoutVertex[];
    /** 官方 LayeredDigraphVertex.getProperDestinationVertexes：高→低层出边的终点（按 index 排序） */
    getProperDestinationVertexes(): LayoutVertex[];
    /** 官方 LayeredDigraphVertex.getDestinationEdge(v)：指向 v 的 valid 出边 */
    getDestinationEdge(v: LayoutVertex): LayoutEdge;
    /** 官方 addSourceEdge/deleteSourceEdge：同时失效 proper 缓存 */
    invalidateProperCaches(): void;
    private _invalidateProper;
    /** Add an edge where this vertex is the destination */
    addDestinationEdge(edge: LayoutEdge): void;
    /** Add an edge where this vertex is the source */
    addSourceEdge(edge: LayoutEdge): void;
    /** 官方 LayoutVertex.deleteSourceEdge */
    deleteSourceEdge(edge: LayoutEdge): void;
    /** 官方 LayoutVertex.deleteDestinationEdge */
    deleteDestinationEdge(edge: LayoutEdge): void;
    /** Delete an edge from both source and destination lists */
    deleteEdge(edge: LayoutEdge): void;
    /** 官方 LayoutVertex.sourceVertexes：sourceEdges 另一端的顶点 */
    get sourceVertexes(): any;
    /** 官方 LayoutVertex.destinationVertexes */
    get destinationVertexes(): any;
    /** 官方 LayoutVertex.vertexes = sourceVertexes ∪ destinationVertexes */
    get vertexes(): any;
    /**
     * 官方 LayoutVertex.edges：sourceEdges + destinationEdges 拼成的 List 的**迭代器**。
     * 官方迭代器带 `each`，扩展（RadialLayout / ParallelLayout）直接 `v.edges.each(...)`。
     */
    get edges(): any;
    /** 官方 LayoutVertex.edgesCount */
    get edgesCount(): number;
    /** 官方 LayoutVertex.commit()：把最终 bounds 移动 Node（并写回 data.bounds） */
    commit(): void;
    /** Get the center point of this vertex（官方 `bounds + focus`） */
    get center(): {
        x: number;
        y: number;
    };
    /** 官方 LayoutVertex.focus：像素偏移（兼容老的 focusX/focusY 分数写法） */
    private _focusPx;
    /** 官方 LayoutVertex.centerX = bounds.x + focus.x */
    get centerX(): number;
    set centerX(val: number);
    /** 官方 LayoutVertex.centerY = bounds.y + focus.y */
    get centerY(): number;
    set centerY(val: number);
    static smartComparer(a: LayoutVertex, b: LayoutVertex): number;
}
