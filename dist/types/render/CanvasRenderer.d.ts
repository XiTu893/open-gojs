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
    private _renderLinkLabel;
    /** Render any GraphObject by dispatching to the appropriate handler */
    renderGraphObject(obj: GraphObject, offsetX: number, offsetY: number): void;
    /** Render a Panel and its children */
    renderPanel(panel: Panel, offsetX: number, offsetY: number): void;
    /** Render a Shape */
    renderShape(shape: Shape, offsetX: number, offsetY: number): void;
    /** Render a TextBlock */
    renderTextBlock(tb: TextBlock, offsetX: number, offsetY: number): void;
    /** Render a Picture (stub - image loading not yet implemented) */
    renderPicture(pic: Picture, offsetX: number, offsetY: number): void;
    renderGrid(panel: Panel): void;
    /** Render a Viewbox panel - scales its child to fit while maintaining aspect ratio */
    private _renderViewbox;
    private _renderGraduated;
    private _renderGraduatedShape;
    private _renderGraduatedText;
    private _getShapeGeometry;
    private _computePathPoints;
    private _interpolatePath;
    private _drawGeometryPath;
    private _findGraduatedMain;
    /** Apply position, scale, angle transforms for a Part */
    _applyTransform(part: Part): void;
    /** Restore canvas state after part transform */
    _restoreTransform(): void;
    /** Trace a geometry path on the canvas context */
    _drawGeometry(ctx: CanvasRenderingContext2D, geo: Geometry): void;
    /** Draw an arc segment from current point using SVG arc parameterization */
    private _drawArcSegment;
    /** Resolve a BrushLike to a fill style string or CanvasGradient */
    _applyBrush(ctx: CanvasRenderingContext2D, brush: BrushLike, bounds: Rect): string | CanvasGradient;
    /** Extract font size from a CSS font string */
    private _getFontSize;
    /** Wrap text into lines respecting maxWidth */
    private _wrapText;
    /** Update viewportBounds from current canvas size, scale, and position */
    private _updateViewportBounds;
    /** Convert a point from document coordinates to view (canvas pixel) coordinates */
    documentToView(p: Point): Point;
    /** Convert a point from view (canvas pixel) coordinates to document coordinates */
    viewToDocument(p: Point): Point;
    /** Check if a rectangle in document coordinates is within the viewport */
    isInViewport(r: Rect): boolean;
}
