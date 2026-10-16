import { GraphObject } from '../view/GraphObject';
import { Panel } from '../view/Panel';
import { Part } from '../view/Part';
import { Link } from '../view/Link';
import { Shape } from '../view/Shape';
import { TextBlock } from '../view/TextBlock';
import { Picture } from '../view/Picture';
import { Layer } from '../view/Layer';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { BrushLike } from '../core/Brush';
import { Geometry } from '../core/Geometry';
/**
 * CanvasRenderer - Canvas 2D rendering engine for the Open-GoJS diagramming library.
 * Draws GraphObject hierarchies onto an HTML5 Canvas.
 */
export declare class CanvasRenderer {
    static readonly className: string;
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    diagram: any;
    viewportBounds: Rect;
    scale: number;
    position: Point;
    _needsRender: boolean;
    constructor(div?: HTMLDivElement);
    /** Create canvas, get context, set up size */
    init(div: HTMLDivElement): void;
    /** Resize canvas to match the given dimensions */
    resize(width: number, height: number): void;
    /** Main render entry: clear, apply viewport transform, render each layer */
    render(layers?: Layer[]): void;
    /** 官方 PanelLayoutTable.ck：n=true → 只画 coversSeparators=false 的背景（分隔线之前） */
    private _renderTableBackgrounds;
    /** 官方 PanelLayoutTable.HD：首个已定义的行/列 index */
    private _firstDefIndex;
    /** 官方 PanelLayoutTable.SN：ck(n=true, 非覆盖背景) → KD(分隔线) → ck(n=false, 覆盖背景)，须在子元素之前调用 */
    private _renderTableRules;
    /** 官方 PanelLayoutTable.KD：按 row/column 定义画分隔线（首个非零行/列之上不画） */
    private _renderTableSeparators;
    private _renderDragSelectBox;
    /** Render all parts in a layer */
    renderLayer(layer: Layer): void;
    renderPart(part: Part): void;
    /** Render a Link - draw the link path and its children */
    renderLink(link: Link): void;
    /** Render the main link path */
    private _renderLinkPath;
    /** 官方 `Shape.R3` 的链接路径平铺：先按已绘制曲线把 arr 采样成密折线，再平铺装饰。 */
    private _renderLinkPathPattern;
    /** 把链接路径（含贝塞尔）采样成 [x0,y0,x1,y1,...] 密折线，与 _renderLinkPath 的画法一致。 */
    private _sampleLinkPolyline;
    private _sampleQuad;
    private _sampleCubic;
    /** 官方 `Shape.hg`：沿密折线逐格平铺 pathPattern 装饰几何（t=ctx, e=折线, s=装饰 Shape）。 */
    private _drawPathPatternTiling;
    /** 官方 `Shape.Xh` 的平铺格绘制：把 pathPattern 的几何 fill+stroke 画在当前变换下。 */
    private _drawPatternTile;
    /**
     * 官方 `Link` 拐角圆角（`computeCorner()` → 几何构建时把折线拐点改写成
     * 「控制点落在拐点」的二次贝塞尔圆角）。
     *
     * 官方对**任意角度**的折线拐角都圆滑，不只正交段 —— PERT 的路由点
     * `(120,71) → (145,206) → (276,206)` 是「斜线接水平」，早期实现只认
     * 水平↔垂直两种正交情形，斜线拐角完全没被圆角化，渲染出直角折线。
     *
     * 半径封顶与官方一致：`c = min(corner, |拐点-上一点|/2, |下一点-拐点|/2)`，
     * `c < 0.5` 视作不圆角；共线（straight-through）点跳过不圆角。
     */
    private _roundCorners;
    private _findCrossings;
    private _segmentIntersection;
    private _drawPathWithJumpOver;
    private _drawPathWithJumpGap;
    /** Render an arrowhead at the end of a link */
    private _renderArrow;
    /** Render any GraphObject by dispatching to the appropriate handler */
    renderGraphObject(obj: GraphObject, offsetX: number, offsetY: number): void;
    /** Render a Panel and its children */
    renderPanel(panel: Panel, offsetX: number, offsetY: number): void;
    /** 把某 Shape 的几何按其 actualBounds 缩放后画进当前路径（供 isClipping 做裁剪区）。 */
    private _clipToShapeGeometry;
    /** Render a Shape */
    renderShape(shape: Shape, offsetX: number, offsetY: number, paintBox?: Rect | null): void;
    /** Render a TextBlock —— 官方 TextBlock.draw + aF 管线逐条复刻 */
    renderTextBlock(tb: TextBlock, offsetX: number, offsetY: number): void;
    /** Render a Picture (stub - image loading not yet implemented) */
    renderPicture(pic: Picture, offsetX: number, offsetY: number): void;
    /**
     * 官方 PanelLayoutGrid.$i/g3：在 panel 自然边界内裁剪，逐元素按 interval 画网格线。
     * 坐标为文档坐标（panelX/panelY = 面板左上角文档位置），线位置 = panelX + F·cell + origin。
     */
    renderGrid(panel: Panel, panelX: number, panelY: number): void;
    /** 官方 PanelLayoutGrid.pS：interval/segmentIndex 判定 + 同向更大 interval 覆盖时跳过 */
    private _gridLinePass;
    /** Render a Viewbox panel - scales its child to fit while maintaining aspect ratio */
    private _renderViewbox;
    private _renderGraduated;
    private _getShapeGeometry;
    private _computePathPoints;
    private _interpolatePath;
    private _drawGeometryPath;
    /** Apply position, scale, angle transforms for a Part */
    _applyTransform(part: Part): void;
    /** Restore canvas state after part transform */
    _restoreTransform(): void;
    /** Trace a geometry path on the canvas context */
    _drawGeometry(ctx: CanvasRenderingContext2D, geo: Geometry): void;
    /**
     * 开一条新路径并画单个 figure。
     *
     * 官方 Geometry（type 4）是**逐 figure** 提交的：`... endPath(p)` 里的 `p` 就是
     * figure 序号，所以「填不填」是按 figure 自己判定的。本项目以前把整个 geometry
     * 当成一条路径统一 fill，导致 `PathFigure(..., false)` 的图形（CircleLine、
     * Curve1/2、AsteriskLine、Terminator…）被涂色，与官方差一大片。
     */
    private _drawFigure;
    /** 把单个 figure 的线段追加到当前路径（不 beginPath） */
    private _drawFigureSegments;
    /** Draw an arc segment from current point using SVG arc parameterization */
    private _drawArcSegment;
    /** 官方：stroke 前 shadowsOff、stroke 后 shadowsOn（只有 fill 投影，stroke 不投影）。
     *  用 shadowColor 透明等价关闭，比改 offset/blur 更轻。 */
    private _strokeNoShadow;
    private _strokeRectNoShadow;
    /** Resolve a BrushLike to a fill style string or CanvasGradient */
    _applyBrush(ctx: CanvasRenderingContext2D, brush: BrushLike, bounds: Rect): string | CanvasGradient | CanvasPattern;
    /** Update viewportBounds from current canvas size, scale, and position */
    private _updateViewportBounds;
    /** Convert a point from document coordinates to view (canvas pixel) coordinates */
    documentToView(p: Point): Point;
    /** Convert a point from view (canvas pixel) coordinates to document coordinates */
    viewToDocument(p: Point): Point;
    /** Check if a rectangle in document coordinates is within the viewport */
    isInViewport(r: Rect): boolean;
}
