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
    private _renderTableSeparators;
    private _renderDragSelectBox;
    /** Render all parts in a layer */
    renderLayer(layer: Layer): void;
    renderPart(part: Part): void;
    /** Render a Link - draw the link path and its children */
    renderLink(link: Link): void;
    /** Render the main link path */
    private _renderLinkPath;
    private _drawOrthogonalPathWithCorners;
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
