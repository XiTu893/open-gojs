import { GraphObject } from '../view/GraphObject';
import { Panel } from '../view/Panel';
import { Part } from '../view/Part';
import { Node } from '../view/Node';
import { Link } from '../view/Link';
import { Shape } from '../view/Shape';
import { TextBlock } from '../view/TextBlock';
import { Picture } from '../view/Picture';
import { Adornment } from '../view/Adornment';
import { Placeholder } from '../view/Placeholder';
import { Layer } from '../view/Layer';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin } from '../core/Margin';
import { Brush, BrushLike, Color } from '../core/Brush';
import { Geometry } from '../core/Geometry';
import { getFigureGeometry } from '../figures/Figures';
import {
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable,
  PanelPosition, PanelGrid, PanelLink, PanelViewbox, PanelGraduated,
  StretchFill, StretchNone, StretchUniform,
  CurveBezier, CurveNone,
  BrushSolid, BrushLinear, BrushRadial,
  RoutingOrthogonal,
  ImageStretchNone, ImageStretchFill, ImageStretchUniform, ImageStretchUniformToFill
} from '../core/EnumValues';

/**
 * CanvasRenderer - Canvas 2D rendering engine for the Open-GoJS diagramming library.
 * Draws GraphObject hierarchies onto an HTML5 Canvas.
 */
export class CanvasRenderer {

  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  diagram: any = null;
  viewportBounds: Rect = new Rect();
  scale: number = 1;
  position: Point = Point.Zero.copy();
  _needsRender: boolean = true;

  // ============ Initialization ============

  constructor(div?: HTMLDivElement) {
    if (div) {
      this.init(div);
    }
  }

  /** Create canvas, get context, set up size */
  init(div: HTMLDivElement): void {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    div.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('CanvasRenderer: could not acquire 2D rendering context');
    }
    this.ctx = ctx;

    this.resize(div.clientWidth, div.clientHeight);
  }

  /** Resize canvas to match the given dimensions */
  resize(width: number, height: number): void {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this._updateViewportBounds();
    this._needsRender = true;
  }

  // ============ Main render loop ============

  /** Main render entry: clear, apply viewport transform, render each layer */
  render(layers?: Layer[]): void {
    const ctx = this.ctx;
    if (!ctx || !this.canvas) return;

    // If no layers provided, get them from the diagram
    const renderLayers = layers || (this.diagram ? this.diagram._layers : []);

    // Sync viewport position and scale from diagram
    if (this.diagram) {
      this.position = this.diagram.position;
      this.scale = this.diagram.scale;
    }

    const dpr = window.devicePixelRatio || 1;

    // Clear entire canvas
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply viewport transform: translate by -position, scale by scale
    ctx.setTransform(dpr * this.scale, 0, 0, dpr * this.scale, -this.position.x * dpr * this.scale, -this.position.y * dpr * this.scale);

    // Render each visible layer in order
    for (const layer of renderLayers) {
      if (layer.visible) {
        this.renderLayer(layer);
      }
    }

    this._renderDragSelectBox();

    this._needsRender = false;
  }

  private _renderTableSeparators(panel: any, panelX: number, panelY: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const rowDefs = panel._rowDefinitions || [];
    const colDefs = panel._columnDefinitions || [];
    if (rowDefs.length === 0 && colDefs.length === 0) return;

    const defaultRowSep = panel.defaultRowSeparatorStroke;
    const defaultColSep = panel.defaultColumnSeparatorStroke;
    const defaultRowSepWidth = panel.defaultRowSeparatorStrokeWidth || 1;
    const defaultColSepWidth = panel.defaultColumnSeparatorStrokeWidth || 1;

    const bounds = panel.actualBounds;
    if (!bounds || bounds.width <= 0 || bounds.height <= 0) return;

    const colWidths = (panel as any)._lastColWidths;
    const rowHeights = (panel as any)._lastRowHeights;
    if (!colWidths || !rowHeights) return;

    ctx.save();

    let y = panelY;
    for (let i = 0; i < rowHeights.length; i++) {
      y += rowHeights[i];
      const def = i < rowDefs.length ? rowDefs[i] : null;
      const stroke = (def && def.separatorStroke !== undefined) ? def.separatorStroke : defaultRowSep;
      const strokeWidth = (def && def.separatorStrokeWidth !== undefined) ? def.separatorStrokeWidth : defaultRowSepWidth;
      const dashArray = (def && def.separatorDashArray) ? def.separatorDashArray : null;

      if (stroke && y < panelY + bounds.height) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.setLineDash(dashArray || []);
        ctx.beginPath();
        ctx.moveTo(panelX, y);
        ctx.lineTo(panelX + bounds.width, y);
        ctx.stroke();
      }
    }

    let x = panelX;
    for (let i = 0; i < colWidths.length; i++) {
      x += colWidths[i];
      const def = i < colDefs.length ? colDefs[i] : null;
      const stroke = (def && def.separatorStroke !== undefined) ? def.separatorStroke : defaultColSep;
      const strokeWidth = (def && def.separatorStrokeWidth !== undefined) ? def.separatorStrokeWidth : defaultColSepWidth;
      const dashArray = (def && def.separatorDashArray) ? def.separatorDashArray : null;

      if (stroke && x < panelX + bounds.width) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.setLineDash(dashArray || []);
        ctx.beginPath();
        ctx.moveTo(x, panelY);
        ctx.lineTo(x, panelY + bounds.height);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);
    ctx.restore();
  }

  private _renderDragSelectBox(): void {
    const ctx = this.ctx;
    if (!ctx || !this.diagram) return;

    const toolManager = (this.diagram as any)._toolManager;
    if (!toolManager) return;

    const currentTool = toolManager._currentTool;
    if (!currentTool || !(currentTool as any)._box) return;

    const box: Rect = (currentTool as any)._box;
    if (!box || box.isEmpty) return;

    ctx.save();
    ctx.fillStyle = 'rgba(30, 144, 255, 0.15)';
    ctx.strokeStyle = 'dodgerblue';
    ctx.lineWidth = 1 / this.scale;
    ctx.fillRect(box.x, box.y, box.width, box.height);
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    ctx.restore();
  }

  /** Render all parts in a layer */
  renderLayer(layer: Layer): void {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.save();

    // Apply layer opacity
    if (layer.opacity < 1) {
      ctx.globalAlpha = layer.opacity;
    }

    const it = layer.parts;
    while (it.next()) {
      const part = it.value;
      if (part && part.visible) {
        this.renderPart(part);
      }
    }

    ctx.restore();
  }

  renderPart(part: Part): void {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.save();

    if (part instanceof Adornment) {
      const adornedPart = part.adornedPart;
      if (adornedPart) {
        const bounds = adornedPart.getDocumentBounds();
        (part as any)._actualBounds = bounds.copy();
        (part as any)._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
        (part as any)._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
        const elements = (part as any)._elements as GraphObject[];
        for (const elem of elements) {
          (elem as any)._actualBounds = new Rect(0, 0, bounds.width, bounds.height);
          (elem as any)._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
          (elem as any)._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
        }
      }
    }

    this._applyTransform(part);

    if (part.opacity < 1) {
      ctx.globalAlpha *= part.opacity;
    }

    if ((part as any)._isShadowed) {
      ctx.shadowOffsetX = (part as any)._shadowOffset.x;
      ctx.shadowOffsetY = (part as any)._shadowOffset.y;
      ctx.shadowColor = (part as any)._shadowColor || 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = (part as any)._shadowBlur || 5;
    }

    if (part instanceof Link) {
      this.renderLink(part as Link);
    } else {
      this.renderPanel(part as Panel, 0, 0);
    }

    ctx.restore();
  }

  /** Render a Link - draw the link path and its children */
  renderLink(link: Link): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const points = link.points;
    if (!points || points.count < 2) return;

    // Draw each child element of the link panel
    const elements = (link as any)._elements as GraphObject[];
    // In Link panels, the first Shape is automatically the main shape
    // (unless another Shape has isPanelMain=true)
    let hasExplicitMain = false;
    for (const elem of elements) {
      if (elem instanceof Shape && elem.isPanelMain) {
        hasExplicitMain = true;
        break;
      }
    }
    let firstShape = true;

    for (const elem of elements) {
      if (!elem.visible) continue;

      if (elem instanceof Shape) {
        const shape = elem as Shape;
        const isMain = shape.isPanelMain || (!hasExplicitMain && firstShape);
        firstShape = false;

        if (isMain) {
          // This is the main link path shape
          this._renderLinkPath(shape, link);
        } else if ((shape as any)._toArrow || (shape as any)._fromArrow) {
          // This is an arrowhead
          this._renderArrow(shape, link);
        } else {
          // Other shapes on the link
          this.renderGraphObject(elem, 0, 0);
        }
      } else if (elem instanceof TextBlock) {
        // Render label at midpoint
        this._renderLinkLabel(elem as TextBlock, link);
      } else {
        this.renderGraphObject(elem, 0, 0);
      }
    }
  }

  /** Render the main link path */
  private _renderLinkPath(shape: Shape, link: Link): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const points = link.points;
    if (!points || points.count < 2) return;

    ctx.save();

    // Build the path
    ctx.beginPath();
    const arr = points.toArray();
    ctx.moveTo(arr[0].x, arr[0].y);

    if ((link as any)._curve === CurveBezier) {
      if (arr.length === 2) {
        const curviness = (link as any)._curviness;
        if (curviness && isFinite(curviness) && curviness !== 0) {
          const dx = arr[1].x - arr[0].x;
          const dy = arr[1].y - arr[0].y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = len > 0 ? -dy / len : 0;
          const ny = len > 0 ? dx / len : 1;
          const cx = (arr[0].x + arr[1].x) / 2 + nx * curviness;
          const cy = (arr[0].y + arr[1].y) / 2 + ny * curviness;
          ctx.quadraticCurveTo(cx, cy, arr[1].x, arr[1].y);
        } else {
          ctx.lineTo(arr[1].x, arr[1].y);
        }
      } else if (arr.length === 3) {
        ctx.quadraticCurveTo(arr[1].x, arr[1].y, arr[2].x, arr[2].y);
      } else if (arr.length >= 4) {
        for (let i = 1; i < arr.length - 2; i += 3) {
          ctx.bezierCurveTo(arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y, arr[i + 2].x, arr[i + 2].y);
        }
        const remaining = (arr.length - 1) % 3;
        if (remaining === 1) {
          ctx.lineTo(arr[arr.length - 1].x, arr[arr.length - 1].y);
        } else if (remaining === 2) {
          ctx.quadraticCurveTo(arr[arr.length - 2].x, arr[arr.length - 2].y, arr[arr.length - 1].x, arr[arr.length - 1].y);
        }
      }
    } else {
      for (let i = 1; i < arr.length; i++) {
        ctx.lineTo(arr[i].x, arr[i].y);
      }
    }

    // Stroke the path
    if (shape.stroke && shape.strokeWidth > 0) {
      ctx.strokeStyle = this._applyBrush(ctx, shape.stroke, link.getDocumentBounds());
      ctx.lineWidth = shape.strokeWidth;
      if (shape.strokeDashArray) {
        ctx.setLineDash(shape.strokeDashArray);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  /** Render an arrowhead at the end of a link */
  private _renderArrow(shape: Shape, link: Link): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const points = link.points;
    if (!points || points.count < 2) return;

    const arr = points.toArray();
    const isToArrow = !!(shape as any)._toArrow;
    const arrowType = isToArrow ? (shape as any)._toArrow : (shape as any)._fromArrow;
    if (arrowType === 'None') return;

    let tipX: number, tipY: number, dirX: number, dirY: number;
    if (isToArrow) {
      const tip = arr[arr.length - 1];
      const prev = arr[arr.length - 2];
      tipX = tip.x;
      tipY = tip.y;
      dirX = prev.x - tip.x;
      dirY = prev.y - tip.y;
    } else {
      const tip = arr[0];
      const next = arr[1];
      tipX = tip.x;
      tipY = tip.y;
      dirX = next.x - tip.x;
      dirY = next.y - tip.y;
    }

    const len = Math.sqrt(dirX * dirX + dirY * dirY);
    if (len === 0) return;
    dirX /= len;
    dirY /= len;

    const arrowW = (shape as any).width || 10;
    const arrowH = (shape as any).height || 10;

    const geo = (Shape as any)._getArrowheadGeometry(arrowType || 'Standard');
    if (!geo) return;

    ctx.save();
    ctx.translate(tipX, tipY);
    const angle = Math.atan2(dirY, dirX);
    ctx.rotate(angle);

    const stroke = (shape as any)._stroke;
    const fill = (shape as any)._fill;
    const strokeWidth = (shape as any)._strokeWidth || 1;

    this._drawGeometryPath(ctx, geo, arrowW, arrowH);

    if (fill) {
      ctx.fillStyle = typeof fill === 'string' ? fill : 'black';
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = typeof stroke === 'string' ? stroke : 'black';
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
    if (!fill && !stroke) {
      ctx.fillStyle = 'black';
      ctx.fill();
    }

    ctx.restore();
  }

  private _renderLinkLabel(tb: TextBlock, link: Link): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const ab = tb.actualBounds;
    if (ab.width === 0 && ab.height === 0) return;

    const segIdx = (tb as any).segmentIndex;
    const segFrac = (tb as any).segmentFraction;
    const segOff = (tb as any).segmentOffset;
    const segOrient = (tb as any).segmentOrientation;

    const points = link.points;
    if (!points || points.count < 2) return;

    const arr = points.toArray();
    let labelX: number = 0, labelY: number = 0, angle: number = 0;

    const si = (segIdx !== undefined && segIdx !== null && !isNaN(segIdx)) ? segIdx : -1;
    const sf = (segFrac !== undefined && segFrac !== null && !isNaN(segFrac)) ? segFrac : 0.5;

    if (si >= 0 && si < arr.length - 1) {
      const a = arr[si];
      const b = arr[si + 1];
      labelX = a.x + (b.x - a.x) * sf;
      labelY = a.y + (b.y - a.y) * sf;
      angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    } else {
      let totalLen = 0;
      const segLens: number[] = [];
      for (let i = 0; i < arr.length - 1; i++) {
        const dx = arr[i + 1].x - arr[i].x;
        const dy = arr[i + 1].y - arr[i].y;
        const len = Math.sqrt(dx * dx + dy * dy);
        segLens.push(len);
        totalLen += len;
      }
      let targetDist = totalLen * sf;
      let cumDist = 0;
      for (let i = 0; i < segLens.length; i++) {
        if (cumDist + segLens[i] >= targetDist) {
          const t = segLens[i] > 0 ? (targetDist - cumDist) / segLens[i] : 0;
          labelX = arr[i].x + (arr[i + 1].x - arr[i].x) * t;
          labelY = arr[i].y + (arr[i + 1].y - arr[i].y) * t;
          angle = Math.atan2(arr[i + 1].y - arr[i].y, arr[i + 1].x - arr[i].x) * 180 / Math.PI;
          break;
        }
        cumDist += segLens[i];
      }
      if (totalLen === 0) {
        labelX = arr[0].x;
        labelY = arr[0].y;
      }
    }

    const offX = (segOff && typeof segOff.x === 'number' && isFinite(segOff.x)) ? segOff.x : 0;
    const offY = (segOff && typeof segOff.y === 'number' && isFinite(segOff.y)) ? segOff.y : 0;
    labelX += offX;
    labelY += offY;

    const mb = tb.measuredBounds;
    const af = tb.alignmentFocus;
    const alignOffX = af ? af.offsetX - af.x * mb.width : 0;
    const alignOffY = af ? af.offsetY - af.y * mb.height : 0;

    tb._arrange(new Rect(labelX - mb.width / 2 + alignOffX, labelY - mb.height / 2 + alignOffY, mb.width, mb.height));

    ctx.save();
    if (segOrient !== undefined && segOrient !== null && segOrient !== 0) {
      ctx.translate(labelX, labelY);
      ctx.rotate(angle * Math.PI / 180);
      ctx.translate(-labelX, -labelY);
    }

    this.renderTextBlock(tb, 0, 0);
    ctx.restore();
  }

  /** Render any GraphObject by dispatching to the appropriate handler */
  renderGraphObject(obj: GraphObject, offsetX: number, offsetY: number): void {
    if (!obj.visible) return;

    const ctx = this.ctx;
    if (!ctx) return;

    // Apply opacity
    if (obj.opacity < 1) {
      ctx.save();
      ctx.globalAlpha *= obj.opacity;
    }

    // Apply angle and scale
    const ab = obj.actualBounds;
    const cx = offsetX + ab.x + ab.width / 2;
    const cy = offsetY + ab.y + ab.height / 2;

    if (obj.angle !== 0 || obj.scale !== 1) {
      ctx.save();
      ctx.translate(cx, cy);
      if (obj.angle !== 0) {
        ctx.rotate(obj.angle * Math.PI / 180);
      }
      if (obj.scale !== 1) {
        ctx.scale(obj.scale, obj.scale);
      }
      ctx.translate(-cx, -cy);
    }

    // Dispatch by type
    if (obj instanceof Shape) {
      this.renderShape(obj as Shape, offsetX, offsetY);
    } else if (obj instanceof TextBlock) {
      this.renderTextBlock(obj as TextBlock, offsetX, offsetY);
    } else if (obj instanceof Picture) {
      this.renderPicture(obj as Picture, offsetX, offsetY);
    } else if (obj instanceof Panel) {
      this.renderPanel(obj as Panel, offsetX, offsetY);
    } else if (obj instanceof Placeholder) {
      // Placeholder rendering is handled by its parent Group panel
    }

    // Restore angle/scale transform
    if (obj.angle !== 0 || obj.scale !== 1) {
      ctx.restore();
    }

    // Restore opacity
    if (obj.opacity < 1) {
      ctx.restore();
    }
  }

  /** Render a Panel and its children */
  renderPanel(panel: Panel, offsetX: number, offsetY: number): void {
    if (!panel.visible) return;

    const ctx = this.ctx;
    if (!ctx) return;

    const ab = panel.actualBounds;
    const panelX = offsetX + ab.x;
    const panelY = offsetY + ab.y;
    const panelW = ab.width;
    const panelH = ab.height;

    // Render panel background
    if (panel.background) {
      ctx.save();
      ctx.fillStyle = this._applyBrush(ctx, panel.background, new Rect(panelX, panelY, panelW, panelH));
      ctx.fillRect(panelX, panelY, panelW, panelH);
      ctx.restore();
    }

    // Apply clipping if isClipping is true
    if (panel.isClipping) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(panelX, panelY, panelW, panelH);
      ctx.clip();
    }

    const panelType = panel.type;

    // Render grid background for Grid panels
    if (panelType === PanelGrid) {
      this.renderGrid(panel);
    }

    // Render children based on panel type
    if (panelType === PanelAuto) {
      // Auto: render main element first (fills panel), then others on top
      let main: GraphObject | null = null;
      const others: GraphObject[] = [];
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        if (!elem.visible) continue;
        if (main === null || elem.isPanelMain) {
          if (main !== null && !main.isPanelMain) others.push(main);
          main = elem;
        } else {
          others.push(elem);
        }
      }
      if (main !== null) {
        this.renderGraphObject(main, panelX, panelY);
      }
      for (const elem of others) {
        this.renderGraphObject(elem, panelX, panelY);
      }
    } else if (panelType === PanelVertical || panelType === PanelHorizontal) {
      // Vertical/Horizontal: render children in order
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, panelX, panelY);
      }
    } else if (panelType === PanelSpot) {
      // Spot: render children with their alignment positions
      // First element is main, others are positioned by alignment
      let main: GraphObject | null = null;
      const others: GraphObject[] = [];
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        if (!elem.visible) continue;
        if (main === null) {
          main = elem;
        } else {
          others.push(elem);
        }
      }
      if (main !== null) {
        this.renderGraphObject(main, panelX, panelY);
      }
      for (const elem of others) {
        this.renderGraphObject(elem, panelX, panelY);
      }
    } else if (panelType === PanelTable) {
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, panelX, panelY);
      }
      this._renderTableSeparators(panel, panelX, panelY);
    } else if (panelType === PanelPosition) {
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, panelX, panelY);
      }
    } else if (panelType === PanelViewbox) {
      this._renderViewbox(panel, panelX, panelY, panelW, panelH);
    } else if (panelType === PanelGraduated) {
      this._renderGraduated(panel, panelX, panelY, panelW, panelH);
    } else if (panelType === PanelLink) {
      // Link: render children (the link shape and label)
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, panelX, panelY);
      }
    } else {
      // Default: render all children
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, panelX, panelY);
      }
    }

    // Restore clipping
    if (panel.isClipping) {
      ctx.restore();
    }
  }

  /** Render a Shape */
  renderShape(shape: Shape, offsetX: number, offsetY: number): void {
    if (!shape.visible) return;

    const ctx = this.ctx;
    if (!ctx) return;

    const ab = shape.actualBounds;
    const shapeX = offsetX + ab.x;
    const shapeY = offsetY + ab.y;
    const shapeW = ab.width;
    const shapeH = ab.height;

    // Get geometry
    const geo = shape._getGeometry();
    if (!geo) {
      // No geometry: just fill/stroke a rectangle if fill or stroke is set
      if (shape.fill) {
        ctx.save();
        ctx.fillStyle = this._applyBrush(ctx, shape.fill, new Rect(shapeX, shapeY, shapeW, shapeH));
        ctx.fillRect(shapeX, shapeY, shapeW, shapeH);
        ctx.restore();
      }
      if (shape.stroke && shape.strokeWidth > 0) {
        ctx.save();
        ctx.strokeStyle = this._applyBrush(ctx, shape.stroke, new Rect(shapeX, shapeY, shapeW, shapeH));
        ctx.lineWidth = shape.strokeWidth;
        if (shape.strokeDashArray) {
          ctx.setLineDash(shape.strokeDashArray);
        }
        ctx.strokeRect(shapeX, shapeY, shapeW, shapeH);
        ctx.restore();
      }
      return;
    }

    // Scale geometry to fit the shape's actual bounds
    const geoBounds = geo.bounds;
    const scaleX = geoBounds.width > 0 ? shapeW / geoBounds.width : 1;
    const scaleY = geoBounds.height > 0 ? shapeH / geoBounds.height : 1;

    ctx.save();

    // Translate to shape position and scale geometry to fit
    ctx.translate(shapeX, shapeY);
    if (scaleX !== 1 || scaleY !== 1) {
      ctx.scale(scaleX, scaleY);
    }

    // Fill
    if (shape.fill) {
      ctx.fillStyle = this._applyBrush(ctx, shape.fill, new Rect(0, 0, geoBounds.width, geoBounds.height));
      this._drawGeometry(ctx, geo);
      ctx.fill();
    }

    // Stroke
    if (shape.stroke && shape.strokeWidth > 0) {
      ctx.strokeStyle = this._applyBrush(ctx, shape.stroke, new Rect(0, 0, geoBounds.width, geoBounds.height));
      ctx.lineWidth = shape.strokeWidth / Math.max(scaleX, scaleY);
      ctx.lineCap = shape.strokeCap as CanvasLineCap;
      ctx.lineJoin = shape.strokeJoin as CanvasLineJoin;
      if (shape.strokeDashArray) {
        ctx.setLineDash(shape.strokeDashArray);
      }
      this._drawGeometry(ctx, geo);
      ctx.stroke();
    }

    ctx.restore();
  }

  /** Render a TextBlock */
  renderTextBlock(tb: TextBlock, offsetX: number, offsetY: number): void {
    if (!tb.visible || !tb.text) return;

    const ctx = this.ctx;
    if (!ctx) return;

    const ab = tb.actualBounds;
    const tbX = offsetX + ab.x;
    const tbY = offsetY + ab.y;
    const tbW = ab.width;
    const tbH = ab.height;

    ctx.save();

    ctx.font = tb.font;
    ctx.textAlign = tb.textAlign as CanvasTextAlign;
    ctx.textBaseline = 'top';

    // Set text color
    if (tb.stroke) {
      ctx.fillStyle = this._applyBrush(ctx, tb.stroke, new Rect(tbX, tbY, tbW, tbH));
    } else {
      ctx.fillStyle = 'black';
    }

    // Apply clipping for text overflow
    if (tbW > 0 && tbH > 0) {
      ctx.beginPath();
      ctx.rect(tbX, tbY, tbW, tbH);
      ctx.clip();
    }

    const fontSize = this._getFontSize(tb.font);
    const lineHeight = fontSize * 1.2;

    if (!tb.isMultiline || (tb as any)._wrap === StretchNone) {
      // Single line
      ctx.fillText(tb.text, tbX, tbY);
    } else {
      // Multiline: split by \n and wrap
      const lines = this._wrapText(ctx, tb.text, tbW > 0 ? tbW : Infinity);
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], tbX, tbY + i * lineHeight);
      }
    }

    ctx.restore();
  }

  /** Render a Picture (stub - image loading not yet implemented) */
  renderPicture(pic: Picture, offsetX: number, offsetY: number): void {
    if (!pic.visible) return;

    const ctx = this.ctx;
    if (!ctx) return;

    const ab = pic.actualBounds;
    const picX = offsetX + ab.x;
    const picY = offsetY + ab.y;
    const picW = ab.width;
    const picH = ab.height;

    const loadedImage = (pic as any)._loadedImage as HTMLImageElement | null;

    if (loadedImage && loadedImage.complete && loadedImage.naturalWidth > 0) {
      const imgW = loadedImage.naturalWidth;
      const imgH = loadedImage.naturalHeight;
      const stretch = pic.imageStretch;

      ctx.save();

      if (stretch === ImageStretchNone) {
        ctx.drawImage(loadedImage, picX, picY, imgW, imgH);
      } else if (stretch === ImageStretchFill) {
        ctx.drawImage(loadedImage, picX, picY, picW, picH);
      } else if (stretch === ImageStretchUniform) {
        const scaleX = picW / imgW;
        const scaleY = picH / imgH;
        const scale = Math.min(scaleX, scaleY);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const drawX = picX + (picW - drawW) / 2;
        const drawY = picY + (picH - drawH) / 2;
        ctx.drawImage(loadedImage, drawX, drawY, drawW, drawH);
      } else if (stretch === ImageStretchUniformToFill) {
        const scaleX = picW / imgW;
        const scaleY = picH / imgH;
        const scale = Math.max(scaleX, scaleY);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const drawX = picX + (picW - drawW) / 2;
        const drawY = picY + (picH - drawH) / 2;
        ctx.beginPath();
        ctx.rect(picX, picY, picW, picH);
        ctx.clip();
        ctx.drawImage(loadedImage, drawX, drawY, drawW, drawH);
      }

      ctx.restore();
    } else {
      ctx.save();
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(picX, picY, picW, picH);

      ctx.beginPath();
      ctx.moveTo(picX, picY);
      ctx.lineTo(picX + picW, picY + picH);
      ctx.moveTo(picX + picW, picY);
      ctx.lineTo(picX, picY + picH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
  }

  renderGrid(panel: Panel): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const ab = panel.actualBounds;
    const cellSize = (panel as any)._gridCellSize as Size;
    const gridOrigin = (panel as any)._gridOrigin as Point;

    if (!cellSize || cellSize.width <= 0 || cellSize.height <= 0) return;

    const part = panel.part;
    if (!part) return;

    const docBounds = part.getDocumentBounds();
    const startX = docBounds.x + gridOrigin.x;
    const startY = docBounds.y + gridOrigin.y;

    const diagram = this.diagram;
    const vb = diagram ? (diagram as any).viewportBounds : ab;
    const clipX = vb.x;
    const clipY = vb.y;
    const clipX2 = vb.x + vb.width;
    const clipY2 = vb.y + vb.height;

    const elements = (panel as any)._elements as GraphObject[];
    if (elements.length === 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 0.5;
      for (let x = Math.floor((clipX - startX) / cellSize.width) * cellSize.width + startX; x <= clipX2; x += cellSize.width) {
        ctx.beginPath();
        ctx.moveTo(x, clipY);
        ctx.lineTo(x, clipY2);
        ctx.stroke();
      }
      for (let y = Math.floor((clipY - startY) / cellSize.height) * cellSize.height + startY; y <= clipY2; y += cellSize.height) {
        ctx.beginPath();
        ctx.moveTo(clipX, y);
        ctx.lineTo(clipX2, y);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    ctx.save();
    for (const elem of elements) {
      if (!elem.visible) continue;
      const shape = elem as any;
      const figure = shape._figure || shape.figure || '';
      const interval = shape._interval || 1;
      const stroke = shape._stroke || shape.stroke || 'rgba(0,0,0,0.1)';
      const strokeWidth = shape._strokeWidth || shape.strokeWidth || 0.5;

      if (stroke === 'transparent' || stroke === 'rgba(0,0,0,0)') continue;

      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;

      if (figure === 'LineH' || figure === 'BarH') {
        const step = cellSize.height * interval;
        if (step <= 0) continue;
        const height = shape._height || shape.height || 0;
        for (let y = Math.floor((clipY - startY) / step) * step + startY; y <= clipY2; y += step) {
          ctx.beginPath();
          ctx.moveTo(clipX, y);
          ctx.lineTo(clipX2, y);
          ctx.stroke();
          if (height > 0 && shape._fill) {
            ctx.fillStyle = shape._fill;
            ctx.fillRect(clipX, y, clipX2 - clipX, Math.min(height, step));
          }
        }
      } else if (figure === 'LineV' || figure === 'BarV') {
        const step = cellSize.width * interval;
        if (step <= 0) continue;
        const width = shape._width || shape.width || 0;
        for (let x = Math.floor((clipX - startX) / step) * step + startX; x <= clipX2; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, clipY);
          ctx.lineTo(x, clipY2);
          ctx.stroke();
          if (width > 0 && shape._fill) {
            ctx.fillStyle = shape._fill;
            ctx.fillRect(x, clipY, Math.min(width, step), clipY2 - clipY);
          }
        }
      }
    }
    ctx.restore();
  }

  /** Render a Viewbox panel - scales its child to fit while maintaining aspect ratio */
  private _renderViewbox(panel: Panel, panelX: number, panelY: number, panelW: number, panelH: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const elements = (panel as any)._elements as GraphObject[];
    const child = elements.find((e: GraphObject) => e.visible);
    if (!child) return;

    const scaleX = (panel as any)._viewboxScaleX as number;
    const scaleY = (panel as any)._viewboxScaleY as number;

    ctx.save();

    ctx.beginPath();
    ctx.rect(panelX, panelY, panelW, panelH);
    ctx.clip();

    const ab = child.actualBounds;
    const childRenderX = panelX + ab.x;
    const childRenderY = panelY + ab.y;

    ctx.translate(childRenderX, childRenderY);
    ctx.scale(scaleX, scaleY);

    const mb = child.measuredBounds;
    const origBounds = child.actualBounds.copy();
    (child as any)._actualBounds = new Rect(0, 0, mb.width, mb.height);
    this.renderGraphObject(child, 0, 0);
    (child as any)._actualBounds = origBounds;

    ctx.restore();
  }

  private _renderGraduated(panel: Panel, panelX: number, panelY: number, panelW: number, panelH: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const elements = (panel as any)._elements as GraphObject[];
    const mainElement = this._findGraduatedMain(elements);
    if (!mainElement) return;

    this.renderGraphObject(mainElement, panelX, panelY);

    const gradMin = (panel as any)._graduatedMin as number;
    const gradMax = (panel as any)._graduatedMax as number;
    const tickUnit = (panel as any)._graduatedTickUnit as number;
    const tickBase = (panel as any)._graduatedTickBase as number;
    const gradStart = (panel as any)._graduatedStart as number;
    const gradEnd = (panel as any)._graduatedEnd as number;
    const pad = (panel as any)._padding as Margin;

    const range = gradMax - gradMin;
    if (range <= 0 || tickUnit <= 0) return;

    const effectiveStart = gradStart;
    const effectiveEnd = gradEnd;

    const mainAb = mainElement.actualBounds;
    const mainX = panelX + mainAb.x;
    const mainY = panelY + mainAb.y;
    const mainW = mainAb.width;
    const mainH = mainAb.height;

    const geo = this._getShapeGeometry(mainElement);
    const pathPoints = geo ? this._computePathPoints(geo, mainW, mainH) : null;

    const templates = elements.filter(e => e !== mainElement && e.visible);

    for (let val = gradMin; val <= gradMax + tickUnit * 0.001; val += tickUnit) {
      const fraction = (val - gradMin) / range;
      if (fraction < -0.001 || fraction > 1.001) continue;

      let px: number, py: number, angle: number;
      if (pathPoints && pathPoints.length >= 2) {
        const pathFraction = effectiveStart + fraction * (effectiveEnd - effectiveStart);
        const pt = this._interpolatePath(pathPoints, pathFraction);
        px = mainX + pt.x;
        py = mainY + pt.y;
        angle = pt.angle;
      } else {
        const pathFraction = effectiveStart + fraction * (effectiveEnd - effectiveStart);
        px = mainX + pathFraction * mainW;
        py = mainY + mainH / 2;
        angle = 0;
      }

      for (const tmpl of templates) {
        const interval = (tmpl as any)._interval || 1;
        const tickIndex = Math.round((val - gradMin) / tickUnit);
        if (tickIndex % interval !== 0) continue;

        const focus = (tmpl as any)._alignmentFocus || Spot.Default;
        const mb = tmpl.measuredBounds;
        const focusX = focus.x * mb.width + (focus.offsetX || 0);
        const focusY = focus.y * mb.height + (focus.offsetY || 0);

        const segOffset = (tmpl as any)._segmentOffset;
        let offX = 0, offY = 0;
        if (segOffset && !isNaN(segOffset.x)) offX = segOffset.x;
        if (segOffset && !isNaN(segOffset.y)) offY = segOffset.y;

        const drawX = px - focusX + offX;
        const drawY = py - focusY + offY;

        if (tmpl instanceof Shape) {
          this._renderGraduatedShape(tmpl, drawX, drawY, mb.width, mb.height, angle);
        } else if (tmpl instanceof TextBlock) {
          this._renderGraduatedText(tmpl, val, tickBase, drawX, drawY, mb.width, mb.height, angle);
        }
      }
    }
  }

  private _renderGraduatedShape(shape: Shape, x: number, y: number, w: number, h: number, angle: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const geo = this._getShapeGeometry(shape);
    if (!geo) return;

    ctx.save();
    ctx.translate(x, y);

    const stroke = (shape as any)._stroke;
    if (stroke) {
      ctx.strokeStyle = typeof stroke === 'string' ? stroke : 'black';
    }
    const strokeWidth = (shape as any)._strokeWidth;
    if (strokeWidth !== undefined) {
      ctx.lineWidth = strokeWidth;
    }

    this._drawGeometryPath(ctx, geo, w, h);
    ctx.stroke();
    ctx.restore();
  }

  private _renderGraduatedText(textBlock: TextBlock, val: number, tickBase: number, x: number, y: number, w: number, h: number, angle: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const text = String(Math.round(val + tickBase));
    const font = (textBlock as any)._font || '10px sans-serif';
    const stroke = (textBlock as any)._stroke || 'black';

    ctx.save();
    ctx.translate(x, y);
    ctx.font = font;
    ctx.fillStyle = typeof stroke === 'string' ? stroke : 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);
    ctx.restore();
  }

  private _getShapeGeometry(elem: GraphObject): Geometry | null {
    if (!(elem instanceof Shape)) return null;
    const shape = elem as Shape;
    const geo = (shape as any)._geometry as Geometry | null;
    if (geo) return geo;
    const figName = (shape as any)._figure as string;
    if (figName) {
      const w = shape.desiredSize.width > 0 ? shape.desiredSize.width : shape.measuredBounds.width;
      const h = shape.desiredSize.height > 0 ? shape.desiredSize.height : shape.measuredBounds.height;
      return getFigureGeometry(figName, w, h) || null;
    }
    const geoStr = (shape as any)._geometryString as string;
    if (geoStr) {
      return Geometry.parse(geoStr);
    }
    return null;
  }

  private _computePathPoints(geo: Geometry, width: number, height: number): Array<{x: number, y: number, angle: number}> {
    const points: Array<{x: number, y: number, angle: number}> = [];
    const it = geo.figures.iterator;
    while (it.next()) {
      const fig = it.value;
      let prevX = fig.startX;
      let prevY = fig.startY;
      points.push({ x: prevX, y: prevY, angle: 0 });

      const segIt = fig.segments.iterator;
      while (segIt.next()) {
        const seg = segIt.value;
        const segName = seg.type._name;
        if (segName === 'Close') continue;
        const endX = seg.endX;
        const endY = seg.endY;
        const angle = Math.atan2(endY - prevY, endX - prevX) * 180 / Math.PI;
        points.push({ x: endX, y: endY, angle: angle });
        prevX = endX;
        prevY = endY;
      }
    }
    return points;
  }

  private _interpolatePath(points: Array<{x: number, y: number, angle: number}>, fraction: number): {x: number, y: number, angle: number} {
    if (points.length === 0) return { x: 0, y: 0, angle: 0 };
    if (points.length === 1) return { x: points[0].x, y: points[0].y, angle: 0 };

    let totalLen = 0;
    const segLens: number[] = [];
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      segLens.push(len);
      totalLen += len;
    }
    if (totalLen === 0) return { x: points[0].x, y: points[0].y, angle: 0 };

    const targetLen = fraction * totalLen;
    let accum = 0;
    for (let i = 0; i < segLens.length; i++) {
      if (accum + segLens[i] >= targetLen || i === segLens.length - 1) {
        const segFrac = segLens[i] > 0 ? (targetLen - accum) / segLens[i] : 0;
        const clampedFrac = Math.max(0, Math.min(1, segFrac));
        const x = points[i].x + (points[i + 1].x - points[i].x) * clampedFrac;
        const y = points[i].y + (points[i + 1].y - points[i].y) * clampedFrac;
        const angle = points[i + 1].angle;
        return { x, y, angle };
      }
      accum += segLens[i];
    }
    return { x: points[points.length - 1].x, y: points[points.length - 1].y, angle: points[points.length - 1].angle };
  }

  private _drawGeometryPath(ctx: CanvasRenderingContext2D, geo: Geometry, w: number, h: number): void {
    const it = geo.figures.iterator;
    ctx.beginPath();
    while (it.next()) {
      const fig = it.value;
      ctx.moveTo(fig.startX, fig.startY);
      const segIt = fig.segments.iterator;
      while (segIt.next()) {
        const seg = segIt.value;
        const segName = seg.type._name;
        if (segName === 'Line') {
          ctx.lineTo(seg.endX, seg.endY);
        } else if (segName === 'MoveTo') {
          ctx.moveTo(seg.endX, seg.endY);
        } else if (segName === 'Close') {
          ctx.closePath();
        } else if (segName === 'QuadraticBezier' && !isNaN(seg.x1)) {
          ctx.quadraticCurveTo(seg.x1, seg.y1, seg.endX, seg.endY);
        } else if (segName === 'CubicBezier' && !isNaN(seg.x1) && !isNaN(seg.x2)) {
          ctx.bezierCurveTo(seg.x1, seg.y1, seg.x2, seg.y2, seg.endX, seg.endY);
        } else {
          ctx.lineTo(seg.endX, seg.endY);
        }
      }
    }
  }

  private _findGraduatedMain(elements: GraphObject[]): GraphObject | null {
    for (const elem of elements) {
      if (elem.visible && elem.isPanelMain) return elem;
    }
    for (const elem of elements) {
      if (elem.visible) return elem;
    }
    return null;
  }

  // ============ Internal methods ============

  /** Apply position, scale, angle transforms for a Part */
  _applyTransform(part: Part): void {
    const ctx = this.ctx;
    if (!ctx) return;

    // The part's actualBounds already includes its location position,
    // so we don't need to translate by location again.
    // Only apply angle and scale transforms.

    const angle = (part as any)._angle as number;
    if (angle && angle !== 0) {
      const ab = part.actualBounds;
      const cx = ab.x + ab.width / 2;
      const cy = ab.y + ab.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate(angle * Math.PI / 180);
      ctx.translate(-cx, -cy);
    }

    const partScale = (part as any)._scale as number;
    if (partScale && partScale !== 1) {
      const ab = part.actualBounds;
      const cx = ab.x + ab.width / 2;
      const cy = ab.y + ab.height / 2;
      ctx.translate(cx, cy);
      ctx.scale(partScale, partScale);
      ctx.translate(-cx, -cy);
    }
  }

  /** Restore canvas state after part transform */
  _restoreTransform(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.restore();
  }

  /** Trace a geometry path on the canvas context */
  _drawGeometry(ctx: CanvasRenderingContext2D, geo: Geometry): void {
    ctx.beginPath();
    const it = geo.figures.iterator;
    while (it.next()) {
      const fig = it.value;
      let curX = fig.startX;
      let curY = fig.startY;
      ctx.moveTo(fig.startX, fig.startY);
      const segIt = fig.segments.iterator;
      while (segIt.next()) {
        const seg = segIt.value;
        switch (seg.type._name) {
          case 'Line':
            ctx.lineTo(seg.endX, seg.endY);
            curX = seg.endX;
            curY = seg.endY;
            break;
          case 'QuadraticBezier':
            ctx.quadraticCurveTo(seg.x1, seg.y1, seg.endX, seg.endY);
            curX = seg.endX;
            curY = seg.endY;
            break;
          case 'CubicBezier':
            ctx.bezierCurveTo(seg.x1, seg.y1, seg.x2, seg.y2, seg.endX, seg.endY);
            curX = seg.endX;
            curY = seg.endY;
            break;
          case 'Arc':
            this._drawArcSegment(ctx, curX, curY, seg);
            curX = seg.endX;
            curY = seg.endY;
            break;
          case 'MoveTo':
            ctx.moveTo(seg.endX, seg.endY);
            curX = seg.endX;
            curY = seg.endY;
            break;
          case 'Close':
            ctx.closePath();
            curX = fig.startX;
            curY = fig.startY;
            break;
        }
      }
    }
  }

  /** Draw an arc segment from current point using SVG arc parameterization */
  private _drawArcSegment(ctx: CanvasRenderingContext2D, curX: number, curY: number, seg: any): void {
    const rx = seg.radiusX;
    const ry = seg.radiusY;
    const endX = seg.endX;
    const endY = seg.endY;

    if (rx <= 0 || ry <= 0) {
      ctx.lineTo(endX, endY);
      return;
    }

    const rotation = (seg.xAxisRotation || 0) * Math.PI / 180;
    const largeArc = !!seg.largeArc;
    const sweep = !!seg.clockwise;

    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);

    const dx = (curX - endX) / 2;
    const dy = (curY - endY) / 2;
    const x1p = cosR * dx + sinR * dy;
    const y1p = -sinR * dx + cosR * dy;

    const x1p2 = x1p * x1p;
    const y1p2 = y1p * y1p;
    const rx2 = rx * rx;
    const ry2 = ry * ry;

    let lambda = x1p2 / rx2 + y1p2 / ry2;
    let rxS = rx;
    let ryS = ry;
    if (lambda > 1) {
      const sqrtL = Math.sqrt(lambda);
      rxS = rx * sqrtL;
      ryS = ry * sqrtL;
    }

    const rxS2 = rxS * rxS;
    const ryS2 = ryS * ryS;
    let num = rxS2 * ryS2 - rxS2 * y1p2 - ryS2 * x1p2;
    const den = rxS2 * y1p2 + ryS2 * x1p2;
    let sq = Math.max(0, num / den);
    sq = Math.sqrt(sq);
    if (largeArc === sweep) sq = -sq;

    const cxp = sq * rxS * y1p / ryS;
    const cyp = -sq * ryS * x1p / rxS;

    const cx = cosR * cxp - sinR * cyp + (curX + endX) / 2;
    const cy = sinR * cxp + cosR * cyp + (curY + endY) / 2;

    const ux = (x1p - cxp) / rxS;
    const uy = (y1p - cyp) / ryS;
    const vx = (-x1p - cxp) / rxS;
    const vy = (-y1p - cyp) / ryS;

    const startAngle = Math.atan2(uy, ux);
    const endAngle = Math.atan2(vy, vx);

    let sweepAngle = endAngle - startAngle;
    if (sweep && sweepAngle < 0) {
      sweepAngle += 2 * Math.PI;
    } else if (!sweep && sweepAngle > 0) {
      sweepAngle -= 2 * Math.PI;
    }

    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, rxS, ryS, rotation, startAngle, startAngle + sweepAngle, !sweep);
    } else {
      const steps = Math.max(8, Math.ceil(Math.abs(sweepAngle) * 8 / Math.PI));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const angle = startAngle + t * sweepAngle;
        const px = cx + rxS * Math.cos(angle) * cosR - ryS * Math.sin(angle) * sinR;
        const py = cy + rxS * Math.cos(angle) * sinR + ryS * Math.sin(angle) * cosR;
        ctx.lineTo(px, py);
      }
    }
  }

  /** Resolve a BrushLike to a fill style string or CanvasGradient */
  _applyBrush(ctx: CanvasRenderingContext2D, brush: BrushLike, bounds: Rect): string | CanvasGradient {
    if (!brush) {
      return 'transparent';
    }

    if (typeof brush === 'string') {
      return brush;
    }

    if (Brush.isBrush(brush)) {
      if (brush.type === BrushSolid) {
        return brush.color || 'black';
      }

      if (brush.type === BrushLinear) {
        const x1 = bounds.x + brush.start.x * bounds.width;
        const y1 = bounds.y + brush.start.y * bounds.height;
        const x2 = bounds.x + brush.end.x * bounds.width;
        const y2 = bounds.y + brush.end.y * bounds.height;
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        for (const stop of brush.stops) {
          gradient.addColorStop(stop.offset, stop.color);
        }
        return gradient;
      }

      if (brush.type === BrushRadial) {
        const cx = bounds.x + brush.center.x * bounds.width;
        const cy = bounds.y + brush.center.y * bounds.height;
        const r = brush.radius * Math.max(bounds.width, bounds.height);
        const fx = bounds.x + brush.focus.x * bounds.width;
        const fy = bounds.y + brush.focus.y * bounds.height;
        const gradient = ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
        for (const stop of brush.stops) {
          gradient.addColorStop(stop.offset, stop.color);
        }
        return gradient;
      }
    }

    return 'black';
  }

  // ============ Text helpers ============

  /** Extract font size from a CSS font string */
  private _getFontSize(font: string): number {
    const match = font.match(/(\d+(?:\.\d+)?)px/);
    if (match) {
      return parseFloat(match[1]);
    }
    return 10;
  }

  /** Wrap text into lines respecting maxWidth */
  private _wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split('\n');

    for (const paragraph of paragraphs) {
      if (paragraph === '') {
        lines.push('');
        continue;
      }

      const words = paragraph.split(/(\s+)/);
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine.replace(/\s+$/, ''));
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine.replace(/\s+$/, ''));
      }
    }

    return lines.length > 0 ? lines : [''];
  }

  // ============ Viewport helpers ============

  /** Update viewportBounds from current canvas size, scale, and position */
  private _updateViewportBounds(): void {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const viewWidth = this.canvas.width / dpr / this.scale;
    const viewHeight = this.canvas.height / dpr / this.scale;
    this.viewportBounds = new Rect(
      this.position.x,
      this.position.y,
      viewWidth,
      viewHeight
    );
  }

  /** Convert a point from document coordinates to view (canvas pixel) coordinates */
  documentToView(p: Point): Point {
    return new Point(
      (p.x - this.position.x) * this.scale,
      (p.y - this.position.y) * this.scale
    );
  }

  /** Convert a point from view (canvas pixel) coordinates to document coordinates */
  viewToDocument(p: Point): Point {
    return new Point(
      p.x / this.scale + this.position.x,
      p.y / this.scale + this.position.y
    );
  }

  /** Check if a rectangle in document coordinates is within the viewport */
  isInViewport(r: Rect): boolean {
    return this.viewportBounds.intersects(r);
  }
}
