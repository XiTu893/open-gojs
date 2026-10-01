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
    /** X position of the vertex center */
    x: number;
    /** Y position of the vertex center */
    y: number;
    /** Bounding rectangle of the vertex */
    bounds: Rect;
    /**
     * 官方 LayoutVertex.focus：bounds 左上角到「连接点」的偏移（像素）。
     * `centerX`/`centerY` 就是 `bounds.x/y + focus`。
     */
    focus: Point;
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
    /** Focus X offset (0-1 relative to width) for connection points */
    focusX: number;
    /** Focus Y offset (0-1 relative to height) for connection points */
    focusY: number;
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
    /** 官方 LayoutVertex.commit()：把最终 bounds 写回 data.bounds（TreeVertex 覆写） */
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
