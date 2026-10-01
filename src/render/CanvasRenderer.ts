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
import { computePathPoints, interpolatePath } from '../core/PathSampling';
import { getFigureGeometry } from '../figures/Figures';
import {
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable,
  PanelPosition, PanelGrid, PanelLink, PanelViewbox, PanelGraduated,
  PanelTableRow, PanelTableColumn,
  StretchFill, StretchNone, StretchUniform,
  CurveBezier, CurveNone, CurveJumpOver, CurveJumpGap,
  BrushSolid, BrushLinear, BrushRadial,
  RoutingOrthogonal,
  ImageStretchNone, ImageStretchFill, ImageStretchUniform, ImageStretchUniformToFill
} from '../core/EnumValues';

/**
 * CanvasRenderer - Canvas 2D rendering engine for the Open-GoJS diagramming library.
 * Draws GraphObject hierarchies onto an HTML5 Canvas.
 */
export class CanvasRenderer {
  static readonly className: string = "CanvasRenderer";

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
    if (!box || box.isEmpty()) return;

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

    const arr = points.toArray();
    const curve = (link as any)._curve;

    if (curve === CurveJumpOver || curve === CurveJumpGap) {
      const crossings = this._findCrossings(link);
      if (curve === CurveJumpOver) {
        this._drawPathWithJumpOver(ctx, arr, crossings, (link as any)._jumpOver || 8);
      } else {
        this._drawPathWithJumpGap(ctx, arr, crossings, (link as any)._jumpGap || 8);
      }
    } else if (curve === CurveBezier) {
      ctx.beginPath();
      ctx.moveTo(arr[0].x, arr[0].y);
      if (arr.length === 2) {
        // 用 computeCurviness()（NaN 时回落到官方默认 Link.RF = 16），
        // 直接读 _curviness 拿到的是 NaN，会走 lineTo 画成直线 ——
        // friendWheel 官方是曲线、我们全是直线就是这么来的。
        const curviness =
          typeof (link as any).computeCurviness === 'function'
            ? (link as any).computeCurviness()
            : (link as any)._curviness;
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
      const corner = (link as any)._corner || 0;
      const isOrthogonal = (link as any)._routing === RoutingOrthogonal;
      ctx.beginPath();
      ctx.moveTo(arr[0].x, arr[0].y);
      if (isOrthogonal && corner > 0 && arr.length > 2) {
        this._drawOrthogonalPathWithCorners(ctx, arr, corner);
      } else {
        for (let i = 1; i < arr.length; i++) {
          ctx.lineTo(arr[i].x, arr[i].y);
        }
      }
    }

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

  private _drawOrthogonalPathWithCorners(ctx: CanvasRenderingContext2D, arr: Point[], corner: number): void {
    for (let i = 1; i < arr.length - 1; i++) {
      const prev = arr[i - 1];
      const curr = arr[i];
      const next = arr[i + 1];

      const dx1 = curr.x - prev.x;
      const dy1 = curr.y - prev.y;
      const dx2 = next.x - curr.x;
      const dy2 = next.y - curr.y;

      const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      const r = Math.min(corner, len1 / 2, len2 / 2);
      if (r <= 0) {
        ctx.lineTo(curr.x, curr.y);
        continue;
      }

      const ux1 = dx1 / len1;
      const uy1 = dy1 / len1;
      const ux2 = dx2 / len2;
      const uy2 = dy2 / len2;

      const beforeX = curr.x - ux1 * r;
      const beforeY = curr.y - uy1 * r;
      const afterX = curr.x + ux2 * r;
      const afterY = curr.y + uy2 * r;

      ctx.lineTo(beforeX, beforeY);
      ctx.arcTo(curr.x, curr.y, afterX, afterY, r);
    }
    ctx.lineTo(arr[arr.length - 1].x, arr[arr.length - 1].y);
  }

  private _findCrossings(link: Link): number[] {
    const diagram = (this as any)._diagram;
    if (!diagram) return [];

    const myPoints = link.points.toArray();
    if (myPoints.length < 2) return [];

    const crossings: number[] = [];
    const layers = diagram._layers;
    if (!layers) return [];

    for (const layer of layers) {
      if (layer.isTemporary) continue;
      const it = layer.parts;
      while (it.next()) {
        const other = it.value;
        if (other === link) continue;
        if (!(other instanceof Link) && (other as any)._className !== 'Link') continue;
        if (!other.visible) continue;

        const otherPoints = other.points.toArray();
        if (otherPoints.length < 2) continue;

        for (let i = 0; i < myPoints.length - 1; i++) {
          const a1 = myPoints[i];
          const a2 = myPoints[i + 1];
          for (let j = 0; j < otherPoints.length - 1; j++) {
            const b1 = otherPoints[j];
            const b2 = otherPoints[j + 1];
            const pt = this._segmentIntersection(a1, a2, b1, b2);
            if (pt) {
              const dist = Math.sqrt((pt.x - myPoints[0].x) ** 2 + (pt.y - myPoints[0].y) ** 2);
              crossings.push(dist);
            }
          }
        }
      }
    }

    crossings.sort((a, b) => a - b);
    return crossings;
  }

  private _segmentIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
    const dx1 = p2.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dx2 = p4.x - p3.x;
    const dy2 = p4.y - p3.y;

    const denom = dx1 * dy2 - dy1 * dx2;
    if (Math.abs(denom) < 1e-10) return null;

    const t = ((p3.x - p1.x) * dy2 - (p3.y - p1.y) * dx2) / denom;
    const u = ((p3.x - p1.x) * dy1 - (p3.y - p1.y) * dx1) / denom;

    if (t > 0.001 && t < 0.999 && u > 0.001 && u < 0.999) {
      return new Point(p1.x + t * dx1, p1.y + t * dy1);
    }
    return null;
  }

  private _drawPathWithJumpOver(ctx: CanvasRenderingContext2D, arr: Point[], crossings: number[], jumpSize: number): void {
    ctx.beginPath();
    ctx.moveTo(arr[0].x, arr[0].y);

    if (crossings.length === 0) {
      for (let i = 1; i < arr.length; i++) {
        ctx.lineTo(arr[i].x, arr[i].y);
      }
      return;
    }

    let cumDist = 0;
    const halfJump = jumpSize / 2;

    for (let i = 1; i < arr.length; i++) {
      const prev = arr[i - 1];
      const curr = arr[i];
      const segDx = curr.x - prev.x;
      const segDy = curr.y - prev.y;
      const segLen = Math.sqrt(segDx * segDx + segDy * segDy);
      if (segLen === 0) continue;

      const ux = segDx / segLen;
      const uy = segDy / segLen;

      let segStart = cumDist;
      const segEnd = cumDist + segLen;

      let pos = segStart;
      for (const crossDist of crossings) {
        if (crossDist <= segStart + halfJump || crossDist >= segEnd - halfJump) continue;

        const beforeDist = crossDist - segStart - halfJump;
        if (beforeDist > 0.01) {
          const t1 = (pos - segStart) / segLen;
          const t2 = (crossDist - halfJump - segStart) / segLen;
          ctx.lineTo(prev.x + segDx * t2, prev.y + segDy * t2);
        }

        const cx = prev.x + (crossDist - segStart) / segLen * segDx;
        const cy = prev.y + (crossDist - segStart) / segLen * segDy;

        const startJumpX = cx - ux * halfJump;
        const startJumpY = cy - uy * halfJump;
        const endJumpX = cx + ux * halfJump;
        const endJumpY = cy + uy * halfJump;

        const perpX = -uy;
        const perpY = ux;
        const radius = halfJump;

        ctx.arc(cx + perpX * 0, cy + perpY * 0, radius, Math.atan2(-perpX, -perpY) + Math.PI, Math.atan2(-perpX, -perpY), false);

        pos = crossDist + halfJump;
      }

      if (pos < segEnd - 0.01) {
        ctx.lineTo(curr.x, curr.y);
      }

      cumDist = segEnd;
    }
  }

  private _drawPathWithJumpGap(ctx: CanvasRenderingContext2D, arr: Point[], crossings: number[], gapSize: number): void {
    ctx.beginPath();
    ctx.moveTo(arr[0].x, arr[0].y);

    if (crossings.length === 0) {
      for (let i = 1; i < arr.length; i++) {
        ctx.lineTo(arr[i].x, arr[i].y);
      }
      return;
    }

    let cumDist = 0;
    const halfGap = gapSize / 2;

    for (let i = 1; i < arr.length; i++) {
      const prev = arr[i - 1];
      const curr = arr[i];
      const segDx = curr.x - prev.x;
      const segDy = curr.y - prev.y;
      const segLen = Math.sqrt(segDx * segDx + segDy * segDy);
      if (segLen === 0) continue;

      const segStart = cumDist;
      const segEnd = cumDist + segLen;

      let pos = segStart;
      for (const crossDist of crossings) {
        if (crossDist <= segStart + halfGap || crossDist >= segEnd - halfGap) continue;

        const tGapStart = (crossDist - halfGap - segStart) / segLen;
        ctx.lineTo(prev.x + segDx * tGapStart, prev.y + segDy * tGapStart);

        const tGapEnd = (crossDist + halfGap - segStart) / segLen;
        ctx.moveTo(prev.x + segDx * tGapEnd, prev.y + segDy * tGapEnd);

        pos = crossDist + halfGap;
      }

      if (pos < segEnd - 0.01) {
        ctx.lineTo(curr.x, curr.y);
      }

      cumDist = segEnd;
    }
  }

  /** Render an arrowhead at the end of a link */
  private _renderArrow(shape: Shape, link: Link): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const points = link.points;
    if (!points || points.count < 2) return;

    const arr = points.toArray();
    // 注意：Shape._toArrow 默认值是字符串 'None'（真值！），不能用 !! 判断，
    // 否则 fromArrow 的 Shape 会被当成 toArrow 画在链路末端，导致 fromArrow 不可见。
    const toArrowName = (shape as any)._toArrow;
    const fromArrowName = (shape as any)._fromArrow;
    const isToArrow = !!(toArrowName && toArrowName !== 'None');
    const arrowType = isToArrow ? toArrowName : fromArrowName;
    if (!arrowType || arrowType === 'None') return;

    let tipX: number, tipY: number, dirX: number, dirY: number;
    if (isToArrow) {
      const tip = arr[arr.length - 1];
      const prev = arr[arr.length - 2];
      tipX = tip.x;
      tipY = tip.y;
      dirX = tip.x - prev.x;
      dirY = tip.y - prev.y;
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

    // 官方把箭头 Shape 当普通子图元画：几何按 `Shape.scale` 放大，描边按 scale 加粗，
    // 且 measuredBounds 把描边算进盒子 → 几何相对实际盒子内缩半个描边。
    // （原先用 `width || 10` 会把 8×8 的几何画成 10×10，官方是 8×3=24。）
    const arrowScale = (shape as any).scale || 1;
    const arrowW = (shape as any).width;
    const arrowH = (shape as any).height;

    const geo = (Shape as any)._getArrowheadGeometry(arrowType || 'Standard');
    if (!geo) return;

    ctx.save();
    ctx.translate(tipX, tipY);
    const angle = Math.atan2(dirY, dirX);
    ctx.rotate(angle);

    const stroke = (shape as any)._stroke;
    const fill = (shape as any)._fill;
    const strokeWidth = (shape as any)._strokeWidth || 1;

    const gbounds = geo.bounds;
    if (gbounds.width > 0 && gbounds.height > 0) {
      const dir = isToArrow ? 1 : -1;
      // 显式指定 width/height 时按官方以它为准，否则按 scale 放大自然几何
      const sx = gbounds.width > 0 && typeof arrowW === 'number' && !isNaN(arrowW) && arrowW > 0
        ? dir * arrowW / gbounds.width : dir * arrowScale;
      const sy = typeof arrowH === 'number' && !isNaN(arrowH) && arrowH > 0
        ? arrowH / gbounds.height : arrowScale;
      const inset = (strokeWidth * arrowScale) / 2;
      const tx = -(gbounds.x + gbounds.width) * sx + (isToArrow ? -inset : inset);
      const ty = -(gbounds.y + gbounds.height / 2) * sy;
      ctx.transform(sx, 0, 0, sy, tx, ty);
    }

    ctx.beginPath();
    const fit = geo.figures.iterator;
    while (fit.next()) {
      const fig = fit.value;
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
        } else if (segName === 'QuadraticBezier') {
          ctx.quadraticCurveTo(seg.x1, seg.y1, seg.endX, seg.endY);
        } else if (segName === 'CubicBezier') {
          ctx.bezierCurveTo(seg.x1, seg.y1, seg.x2, seg.y2, seg.endX, seg.endY);
        } else if (segName === 'Arc') {
          this._drawArcSegment(ctx, fig.startX, fig.startY, seg);
        } else {
          ctx.lineTo(seg.endX, seg.endY);
        }
      }
    }

    if (fill) {
      ctx.fillStyle = typeof fill === 'string' ? fill : 'black';
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = typeof stroke === 'string' ? stroke : 'black';
      ctx.lineWidth = strokeWidth * arrowScale;
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
    const hasTransform = obj.angle !== 0 || obj.scale !== 1;

    // 官方 GraphObject.tS/op：scale/angle 由对象矩阵 about naturalBounds 中心施加，
    // 而 measuredBounds/actualBounds 已含 scale/angle 后的包围盒。因此变换对象需先在
    // actualBounds 中心处按 naturalBounds(+stroke) 尺寸作画，再经矩阵变换到位。
    let paintBox: Rect | null = null;
    if (hasTransform) {
      const nb = obj.naturalBounds;
      const lp = obj instanceof Shape ? (obj as Shape).strokeWidth : 0;
      const bw = nb.width + lp;
      const bh = nb.height + lp;
      paintBox = new Rect(cx - bw / 2, cy - bh / 2, bw, bh);
    }

    if (hasTransform) {
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

    // 官方 GraphObject.background（GraphObject.iS）：非 Panel 对象先在自身边界内铺底色
    //（官方 rect = naturalBounds ± strokeWidth/2 = paintBox），再画对象本体；
    // Panel 的 background 在 renderPanel 中处理。
    if (obj.background && !(obj instanceof Panel)) {
      const bgRect = paintBox ? paintBox : new Rect(offsetX + ab.x, offsetY + ab.y, ab.width, ab.height);
      ctx.save();
      ctx.fillStyle = this._applyBrush(ctx, obj.background, bgRect);
      ctx.fillRect(bgRect.x, bgRect.y, bgRect.width, bgRect.height);
      ctx.restore();
    }

    // Dispatch by type
    if (obj instanceof Shape) {
      this.renderShape(obj as Shape, offsetX, offsetY, paintBox);
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

    // Apply clipping if isClipping is true（官方：先 clip 再画 background）
    if (panel.isClipping) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(panelX, panelY, panelW, panelH);
      ctx.clip();
    }

    // Render panel background
    if (panel.background) {
      ctx.save();
      ctx.fillStyle = this._applyBrush(ctx, panel.background, new Rect(panelX, panelY, panelW, panelH));
      ctx.fillRect(panelX, panelY, panelW, panelH);
      ctx.restore();
    }

    const panelType = panel.type;

    // Grid 面板：官方 PanelLayoutGrid.$i 只画网格线，不再按普通子元素渲染
    if (panelType === PanelGrid) {
      this.renderGrid(panel, panelX, panelY);
      if (panel.isClipping) ctx.restore();
      return;
    }

    // Row/col panels do not offset their children (official Bn() == false):
    // grandchildren coords are in TABLE space, so inherit this panel's offset
    const isRowCol = panelType === PanelTableRow || panelType === PanelTableColumn;
    const childOX = isRowCol ? offsetX : panelX;
    const childOY = isRowCol ? offsetY : panelY;

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
        this.renderGraphObject(elem, childOX, childOY);
      }
    } else if (panelType === PanelVertical || panelType === PanelHorizontal) {
      // Vertical/Horizontal: render children in order
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, childOX, childOY);
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
        this.renderGraphObject(elem, childOX, childOY);
      }
    } else if (panelType === PanelTable) {
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, childOX, childOY);
      }
      this._renderTableSeparators(panel, panelX, panelY);
    } else if (panelType === PanelPosition) {
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, childOX, childOY);
      }
    } else if (panelType === PanelViewbox) {
      this._renderViewbox(panel, panelX, panelY, panelW, panelH);
    } else if (panelType === PanelGraduated) {
      this._renderGraduated(panel, panelX, panelY, panelW, panelH);
    } else if (panelType === PanelLink) {
      // Link: render children (the link shape and label)
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, childOX, childOY);
      }
    } else {
      // Default: render all children
      const elements = (panel as any)._elements as GraphObject[];
      for (const elem of elements) {
        this.renderGraphObject(elem, childOX, childOY);
      }
    }

    // Restore clipping
    if (panel.isClipping) {
      ctx.restore();
    }
  }

  /** Render a Shape */
  renderShape(shape: Shape, offsetX: number, offsetY: number, paintBox?: Rect | null): void {
    if (!shape.visible) return;

    const ctx = this.ctx;
    if (!ctx) return;

    // GoJS measures a Shape's naturalBounds as (0,0,aW,aH) and its measuredBounds as
    // (-sw/2,-sw/2,aW+sw,aH+sw), so the geometry is painted inset by strokeWidth/2
    // within actualBounds (the stroke, drawn with lineWidth=sw, then covers exactly
    // actualBounds). Paint at that same inset so that adjacent shapes whose actual
    // bounds touch keep a visible stroke-width gap instead of merging together.
    // paintBox（scale/angle 对象）：已含 offsetX/offsetY 的 naturalBounds+stroke 盒。
    const rawSW = shape.strokeWidth;
    const sw = typeof rawSW === 'number' && isFinite(rawSW) && rawSW > 0 ? rawSW : 0;
    const shapeX = (paintBox ? paintBox.x : offsetX + shape.actualBounds.x) + sw / 2;
    const shapeY = (paintBox ? paintBox.y : offsetY + shape.actualBounds.y) + sw / 2;
    const shapeW = Math.max((paintBox ? paintBox.width : shape.actualBounds.width) - sw, 0);
    const shapeH = Math.max((paintBox ? paintBox.height : shape.actualBounds.height) - sw, 0);

    // Get geometry
    let geo = shape._getGeometry();
    if (geo && (shape as any)._figure && !(shape as any)._geometry && !(shape as any)._geometryString &&
        !((shape as any)._toArrow && (shape as any)._toArrow !== 'None') && !((shape as any)._fromArrow && (shape as any)._fromArrow !== 'None')) {
      // Figure geometry is generated at a nominal size (e.g. 100x100). Regenerate it
      // at the actual size so that we do NOT non-uniformly scale the path. Otherwise
      // the stroke width gets distorted by the non-uniform scale (e.g. on a wide, short
      // shape the top/bottom borders would be thinner than the left/right borders).
      const rg = getFigureGeometry(
        (shape as any)._figure, shapeW, shapeH,
        (shape as any)._parameter1, (shape as any)._parameter2, shape
      );
      if (rg) geo = rg;
    }
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
    // isGeometryPositioned 的 Shape 把几何画在【父面板】坐标系里（原始几何坐标，
    // 例如 pieCharts 的扇形），不能归一化；其余 Shape 要把几何平移到自身包围盒，
    // 否则像 sparklineGraphs 那种 y 为负的 geometryString 会整体画到盒子外面。
    if (!(shape as any).isGeometryPositioned && (geoBounds.x !== 0 || geoBounds.y !== 0)) {
      ctx.translate(-geoBounds.x, -geoBounds.y);
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
    // 对齐换算成锚点 x（fillText 的 x 语义是文本左边缘）。
    // 若保留 ctx.textAlign='center' 却把 x 传成文本框左边缘，文本会以左边缘为中心绘制，
    // 一半溢出到框外并被下面的 clip 裁掉（多行居中文本会左右各缺一段）。
    ctx.textAlign = 'left';
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

    // 官方 TextBlock 语义：textAlign 决定文本在自身 actualBounds 内的水平位置
    const alignX = (textWidth: number): number => {
      const a = tb.textAlign;
      if (a === 'center') return tbX + (tbW - textWidth) / 2;
      if (a === 'right' || a === 'end') return tbX + tbW - textWidth;
      return tbX;
    };

    if (!tb.isMultiline || (tb as any)._wrap === StretchNone) {
      // Single line
      ctx.fillText(tb.text, alignX(ctx.measureText(tb.text).width), tbY);
    } else {
      // Multiline: split by \n and wrap
      const lines = this._wrapText(ctx, tb.text, tbW > 0 ? tbW : Infinity);
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], alignX(ctx.measureText(lines[i]).width), tbY + i * lineHeight);
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

  /**
   * 官方 PanelLayoutGrid.$i/g3：在 panel 自然边界内裁剪，逐元素按 interval 画网格线。
   * 坐标为文档坐标（panelX/panelY = 面板左上角文档位置），线位置 = panelX + F·cell + origin。
   */
  renderGrid(panel: Panel, panelX: number, panelY: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const cell = panel.gridCellSize;
    if (!cell || !(cell.width > 0) || !(cell.height > 0)) return;
    const nb = panel.naturalBounds;
    const a = nb.width;
    const c = nb.height;
    if (!(a > 0) || !(c > 0)) return;
    if (panel._gridExclusions === null) panel._updateGridSettings();
    const ys = panel._gridExclusions as number[][];

    const origin = panel.gridOrigin;
    const m = origin.x;
    const g = origin.y;
    const o = cell.width;
    const r = cell.height;

    const diagram = this.diagram;
    let s = panel.getDocumentScale() * (diagram ? diagram.scale : 1);
    if (!(s > 0)) s = 1;

    const f = Math.ceil(a / o);
    const u = Math.ceil(c / r);

    const elements = (panel as any)._elements as GraphObject[];

    ctx.save();
    ctx.beginPath();
    ctx.rect(panelX, panelY, a, c);
    ctx.clip();

    for (let b = 0; b < elements.length; b++) {
      const S: any = elements[b];
      if (!S.visible) continue;
      const k = S.interval || 1;
      const P = Math.abs(k);
      if (o * P * s < 2) continue;
      let A: number = S.segmentIndex;
      if (!isFinite(A) || isNaN(A)) A = 0;
      if (A < 0) A = P - Math.min(-A, P);
      A = Math.round(A % P);
      const N: number = S.opacity;
      let M = 1;
      if (N !== 1) {
        if (N === 0) continue;
        M = ctx.globalAlpha;
        ctx.globalAlpha = M * N;
      }
      const C = ys[b] || [];
      let T = false;
      const L: number[] | null = S.strokeDashArray;
      if (L !== null && L !== undefined) {
        T = true;
        ctx.setLineDash(L);
        ctx.lineDashOffset = S.strokeDashOffset || 0;
      }
      const stroke = S.stroke;
      if (stroke !== null && stroke !== undefined && stroke !== '' && S.strokeWidth > 0 &&
          (S.figure === 'LineV' || S.figure === 'LineH')) {
        ctx.lineWidth = S.strokeWidth;
        ctx.strokeStyle = this._applyBrush(ctx, stroke, new Rect(panelX, panelY, a, c));
        ctx.beginPath();
        if (S.figure === 'LineV') {
          const D = Math.floor((m - o) / o);
          for (let F = D; F <= D + f; F++) {
            const R = F * o + m;
            if (R >= 0 && R <= a && this._gridLinePass(F, k, A, C)) {
              ctx.moveTo(panelX + R, panelY);
              ctx.lineTo(panelX + R, panelY + c);
            }
          }
        } else {
          const D = Math.floor((g - r) / r);
          for (let F = D; F <= D + u; F++) {
            const R = F * r + g;
            if (R >= 0 && R <= c && this._gridLinePass(F, k, A, C)) {
              ctx.moveTo(panelX, panelY + R);
              ctx.lineTo(panelX + a, panelY + R);
            }
          }
        }
        ctx.stroke();
      } else if (S.fill !== null && S.fill !== undefined && S.fill !== '') {
        ctx.fillStyle = this._applyBrush(ctx, S.fill, new Rect(panelX, panelY, a, c));
        if (S.figure === 'BarV') {
          let D: number = S.width;
          if (isNaN(D)) D = o;
          const D0 = Math.floor((m - o) / o);
          for (let F = D0; F <= D0 + f; F++) {
            const I = F * o + m;
            if (I + D >= 0 && I <= a && this._gridLinePass(F, k, A, C)) {
              ctx.fillRect(panelX + I, panelY, D, c);
            }
          }
        } else if (S.figure === 'BarH') {
          let D: number = S.height;
          if (isNaN(D)) D = r;
          const D0 = Math.floor((g - r) / r);
          for (let F = D0; F <= D0 + u; F++) {
            const I = F * r + g;
            if (I + D >= 0 && I <= c && this._gridLinePass(F, k, A, C)) {
              ctx.fillRect(panelX, panelY + I, a, D);
            }
          }
        }
      }
      if (T) {
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;
      }
      if (N !== 1) ctx.globalAlpha = M;
    }

    ctx.restore();
  }

  /** 官方 PanelLayoutGrid.pS：interval/segmentIndex 判定 + 同向更大 interval 覆盖时跳过 */
  private _gridLinePass(F: number, interval: number, segmentIndex: number, exclusions: number[]): boolean {
    if (interval < 0) return F % interval === segmentIndex;
    if (F % interval !== segmentIndex) return false;
    for (let i = 0; i < exclusions.length; i++) {
      if (F % exclusions[i] === segmentIndex) return false;
    }
    return true;
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
    // 主元素的几何在渲染时会平移 -geoBounds.origin 后再绘制，
    // 刻度定位必须用同一套坐标，否则 graduatedMin 会落到形状顶端（刻度倒置）。
    const mainGeoBounds = geo ? geo.bounds : null;
    const mainOffX = mainGeoBounds ? mainGeoBounds.x : 0;
    const mainOffY = mainGeoBounds ? mainGeoBounds.y : 0;

    const templates = elements.filter(e => e !== mainElement && e.visible);

    for (let val = gradMin; val <= gradMax + tickUnit * 0.001; val += tickUnit) {
      const fraction = (val - gradMin) / range;
      if (fraction < -0.001 || fraction > 1.001) continue;

      let px: number, py: number, angle: number;
      if (pathPoints && pathPoints.length >= 2) {
        const pathFraction = effectiveStart + fraction * (effectiveEnd - effectiveStart);
        const pt = this._interpolatePath(pathPoints, pathFraction);
        px = mainX + pt.x - mainOffX;
        py = mainY + pt.y - mainOffY;
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
        // 官方 graduatedSkip(elem, value)：返回 true 表示跳过该刻度
        const skipFn = (tmpl as any)._graduatedSkip;
        if (typeof skipFn === 'function' && skipFn(val, tmpl)) continue;

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
    // 官方：刻度元素以「自身盒子底边中心」为锚点落在路径点上，再按路径切线角旋转。
    // 锚点取错（例如用盒子左上角）会让竖直标尺上的刻度线朝反方向延伸，
    // 被管道/节点盖住而看不见（thermometer 刻度只在顶部露出一小段）。
    ctx.translate(x + w / 2, y + h);
    if (angle) {
      ctx.rotate((angle * Math.PI) / 180);
    }
    ctx.translate(-w / 2, -h);
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

    // 官方：优先用 graduatedFunction 自定义刻度文字，否则用刻度值本身
    const gf = (textBlock as any)._graduatedFunction;
    let text: string;
    if (typeof gf === 'function') {
      const v = gf(val, textBlock);
      text = v === null || v === undefined ? '' : v.toString();
    } else {
      text = (+val.toFixed(2)).toString();
    }
    if (text === '') return;

    const font = (textBlock as any)._font || '13px sans-serif';
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
    // figure 为空或 'None' 时必须继续走 geometryString 分支：
    // Shape._figure 默认就是 'None'，若在此提前返回 'None' 图形（一个矩形），
    // 只设了 geometryString 的形状就会拿到错误几何
    // （thermometer 的 graduated 主元素/刻度线会变成矩形，导致刻度倒置、刻度线不可见）。
    if (figName && figName !== 'None') {
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
    return computePathPoints(geo);
  }

  private _interpolatePath(points: Array<{x: number, y: number, angle: number}>, fraction: number): {x: number, y: number, angle: number} {
    return interpolatePath(points, fraction);
  }

  private _drawGeometryPath(ctx: CanvasRenderingContext2D, geo: Geometry, w: number, h: number): void {
    const bounds = geo.bounds;
    const bw = bounds.width || 1;
    const bh = bounds.height || 1;
    const sx = w / bw;
    const sy = h / bh;
    const tx = -bounds.x * sx;
    const ty = -bounds.y * sy;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.scale(sx, sy);

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
        if (seg.isClosed && segName !== 'Close') {
          ctx.closePath();
        }
      }
    }

    ctx.restore();
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
        if (seg.isClosed && seg.type._name !== 'Close') {
          ctx.closePath();
          curX = fig.startX;
          curY = fig.startY;
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

    // 官方「按角度」圆弧：new PathSegment(SegmentType.Arc, startAngle, sweepAngle, cx, cy, rx, ry)
    if (!isNaN(seg.startAngle) && !isNaN(seg.centerX)) {
      const rX = Math.abs(rx);
      const rY = Math.abs(ry === 0 ? rx : ry);
      if (rX <= 0 || rY <= 0) {
        ctx.lineTo(endX, endY);
        return;
      }
      const a0 = (seg.startAngle * Math.PI) / 180;
      const sweepAng = seg.sweepAngle || 0;
      const a1 = ((seg.startAngle + sweepAng) * Math.PI) / 180;
      ctx.ellipse(seg.centerX, seg.centerY, rX, rY, 0, a0, a1, sweepAng < 0);
      return;
    }

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
        if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
          if (typeof console !== 'undefined' && console.log) {
            console.log('brush NaN: bounds=' + bounds.x + ',' + bounds.y + ',' + bounds.width + ',' + bounds.height +
              ' start=' + brush.start + ' end=' + brush.end);
          }
          return brush.color || 'transparent';
        }
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
        if (!isFinite(cx) || !isFinite(cy) || !isFinite(r) || !isFinite(fx) || !isFinite(fy)) {
          if (typeof console !== 'undefined' && console.log) {
            console.log('brush NaN radial: bounds=' + bounds.x + ',' + bounds.y + ',' + bounds.width + ',' + bounds.height);
          }
          return brush.color || 'transparent';
        }
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
    const px = font.match(/(\d+(?:\.\d+)?)px/);
    if (px) {
      return parseFloat(px[1]);
    }
    const pt = font.match(/(\d+(?:\.\d+)?)pt\b/);
    if (pt) {
      return parseFloat(pt[1]) * 4 / 3;
    }
    const em = font.match(/(\d+(?:\.\d+)?)em\b/);
    if (em) {
      return parseFloat(em[1]) * 16;
    }
    const pct = font.match(/(\d+(?:\.\d+)?)%/);
    if (pct) {
      return parseFloat(pct[1]) * 0.16;
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
    return this.viewportBounds.intersectsRect(r);
  }
}
