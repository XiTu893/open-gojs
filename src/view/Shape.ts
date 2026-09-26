import { GraphObject } from './GraphObject';
import { EnumValue, BrushSolid, GeometryStretchDefault, GeometryStretchUniform, GeometryStretchNone, GeometryStretchFill, GeometryStretchUniformToFill, StretchDefault, StretchFill, StretchNone, StretchUniform, StretchUniformToFill, StretchHorizontal, StretchVertical } from '../core/EnumValues';
import { Brush, BrushLike } from '../core/Brush';
import { Geometry } from '../core/Geometry';
import { PathFigure } from '../core/PathFigure';
import { PathSegment } from '../core/PathSegment';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { Point } from '../core/Point';
import { Spot } from '../core/Spot';
import { List } from '../core/List';
import { Map as Dict } from '../core/Map';
import { getFigureGeometry, figures, CORE_FIGURE_NAMES, isExtensionFigure } from '../figures/Figures';

/**
 * Shape - 几何图形
 * 表示一个几何形状，支持预定义图形和自定义几何路径
 */
export class Shape extends GraphObject {

  static GeometryStretchUniform: EnumValue = GeometryStretchUniform;
  static GeometryStretchNone: EnumValue = GeometryStretchNone;
  static GeometryStretchFill: EnumValue = GeometryStretchFill;
  static GeometryStretchUniformToFill: EnumValue = GeometryStretchUniformToFill;

  // ============ Shape-specific properties ============
  private _fill: BrushLike = '';
  private _stroke: BrushLike = 'black';
  private _strokeWidth: number = 1;
  private _strokeDashArray: number[] | null = null;
  private _strokeDashOffset: number = 0;
  private _strokeCap: string = 'butt';
  private _strokeJoin: string = 'miter';
  private _figure: string = 'None';
  private _geometry: Geometry | null = null;
  private _geometryString: string = '';
  private _parameter1: number = NaN;
  private _parameter2: number = NaN;
  private _toArrow: string = 'None';
  private _fromArrow: string = '';
  private _geometryStretch: EnumValue = GeometryStretchDefault;
  private _fillRule: string = 'nonzero';

  constructor(figOrGeo?: string | Geometry | Partial<Shape>, init?: Partial<Shape>) {
    super();
    this._className = 'Shape';
    if (typeof figOrGeo === 'string') {
      this._figure = figOrGeo;
    } else if (figOrGeo instanceof Geometry) {
      this._geometry = figOrGeo;
    } else if (figOrGeo && typeof figOrGeo === 'object') {
      this.set(figOrGeo as Partial<Shape>);
    }
    if (init) {
      this.set(init);
    }
  }

  // ============ Shape properties ============

  get fill(): BrushLike { return this._fill; }
  set fill(val: BrushLike) { this._fill = val ?? ''; }

  get stroke(): BrushLike { return this._stroke; }
  set stroke(val: BrushLike) { this._stroke = val ?? ''; }

  get strokeWidth(): number { return this._strokeWidth; }
  set strokeWidth(val: number) { this._strokeWidth = val; }

  get strokeDashArray(): number[] | null { return this._strokeDashArray; }
  set strokeDashArray(val: number[] | null) { this._strokeDashArray = val; }

  get strokeDashOffset(): number { return this._strokeDashOffset; }
  set strokeDashOffset(val: number) { this._strokeDashOffset = val; }

  get strokeCap(): string { return this._strokeCap; }
  set strokeCap(val: string) { this._strokeCap = val; }

  get strokeJoin(): string { return this._strokeJoin; }
  set strokeJoin(val: string) { this._strokeJoin = val; }

  get geometryStretch(): EnumValue { return this._geometryStretch; }
  set geometryStretch(val: EnumValue) {
    if (this._geometryStretch !== val) {
      this._geometryStretch = val;
      this._invalidateMeasure();
    }
  }

  get fillRule(): string { return this._fillRule; }
  set fillRule(val: string) { this._fillRule = val; }

  get figure(): string { return this._figure; }
  set figure(val: string) {
    if (this._figure !== val) {
      this._figure = val;
      this._invalidateMeasure();
    }
  }

  get geometry(): Geometry | null { return this._geometry; }
  set geometry(val: Geometry | null) {
    if (this._geometry !== val) {
      this._geometry = val;
      this._invalidateMeasure();
    }
  }

  get geometryString(): string { return this._geometryString; }
  set geometryString(val: string) {
    if (this._geometryString !== val) {
      this._geometryString = val;
      this._invalidateMeasure();
    }
  }

  get parameter1(): number { return this._parameter1; }
  set parameter1(val: number) {
    if (this._parameter1 !== val) {
      this._parameter1 = val;
      this._invalidateMeasure();
    }
  }

  get parameter2(): number { return this._parameter2; }
  set parameter2(val: number) {
    if (this._parameter2 !== val) {
      this._parameter2 = val;
      this._invalidateMeasure();
    }
  }

  private _spot1: Spot | null = null;
  private _spot2: Spot | null = null;

  get spot1(): Spot { return this._spot1 || Spot.Default; }
  set spot1(val: Spot) {
    this._spot1 = val && typeof val.copy === 'function' ? val.copy() : val;
  }

  get spot2(): Spot { return this._spot2 || Spot.Default; }
  set spot2(val: Spot) {
    this._spot2 = val && typeof val.copy === 'function' ? val.copy() : val;
  }

  get toArrow(): string { return this._toArrow; }
  set toArrow(val: string) {
    if (this._toArrow !== val) {
      this._toArrow = val;
      this._invalidateMeasure();
    }
  }

  get fromArrow(): string { return this._fromArrow; }
  set fromArrow(val: string) {
    if (this._fromArrow !== val) {
      this._fromArrow = val;
      this._invalidateMeasure();
    }
  }

  // ============ Methods ============

  /** 获取几何路径（从图形名称或自定义几何） */
  _getGeometry(): Geometry | null {
    if (this._geometry !== null) {
      return this._geometry;
    }
    if (this._geometryString) {
      return Geometry.parse(this._geometryString);
    }
    if (this._toArrow && this._toArrow !== 'None') {
      return Shape._getArrowheadGeometry(this._toArrow);
    }
    if (this._fromArrow && this._fromArrow !== 'None') {
      return Shape._getArrowheadGeometry(this._fromArrow);
    }
    if (this._figure) {
      return this._getFigureGeometry(this._figure);
    }
    return null;
  }

  private _getFigureGeometry(figureName: string): Geometry | null {
    // 优先使用 measure 记录的内容尺寸（不含描边、已解析 desiredSize/constraint）
    const gw = (this as any)._geoW;
    const gh = (this as any)._geoH;
    const w = typeof gw === 'number' && isFinite(gw) && gw > 0
      ? gw
      : (isNaN(this.width) ? 100 : this.width);
    const h = typeof gh === 'number' && isFinite(gh) && gh > 0
      ? gh
      : (isNaN(this.height) ? 100 : this.height);

    const geo = getFigureGeometry(figureName, w, h, this._parameter1, this._parameter2, this);
    if (geo) return geo;

    switch (figureName.toLowerCase()) {
      case 'rectangle':
        return Geometry.rectangle(w, h);
      case 'roundedrectangle': {
        const cornerRadius = isNaN(this._parameter1) ? 5 : this._parameter1;
        return Geometry.roundedRectangle(w, h, cornerRadius);
      }
      case 'ellipse':
        return Geometry.ellipse(w, h);
      case 'circle': {
        const d = Math.min(w, h);
        return Geometry.ellipse(d, d);
      }
      case 'line':
        return Geometry.line(0, 0, w, h);
      default:
        return Geometry.rectangle(w, h);
    }
  }

  /** 官方 Shape.Yd 的自然尺寸来源：显式 geometry → 其 bounds；figure → 官方 Shape.VN(figure)(null,100,100)；
   *  与上次测量结果无关（否则 Auto 面板反复测量会让 geometry.spot1/spot2 随几何尺寸收缩，形成级联误差） */
  private _naturalSize(): { w: number; h: number } {
    if (this._geometry !== null) {
      const b = this._geometry.bounds;
      return { w: b.width, h: b.height };
    }
    if (this._figure && this._figure !== 'None') {
      const g = getFigureGeometry(this._figure, 100, 100, NaN, NaN, null);
      if (g) {
        const b = g.bounds;
        return { w: b.width, h: b.height };
      }
    }
    if (this._geometryString) {
      try {
        const g = Geometry.parse(this._geometryString);
        const b = g.bounds;
        return { w: b.width, h: b.height };
      } catch { /* fall through */ }
    }
    if (this._toArrow && this._toArrow !== 'None') {
      const g = Shape._getArrowheadGeometry(this._toArrow);
      if (g) { const b = g.bounds; return { w: b.width, h: b.height }; }
    }
    if (this._fromArrow && this._fromArrow !== 'None') {
      const g = Shape._getArrowheadGeometry(this._fromArrow);
      if (g) { const b = g.bounds; return { w: b.width, h: b.height }; }
    }
    return { w: 0, h: 0 };
  }

  /** 测量对象尺寸 — 官方 GraphObject.yt + Shape.Yd（holes=0），measuredBounds 含 strokeWidth */
  _measure(widthConstraint: number, heightConstraint: number): void {
    const strokeW = this._strokeWidth;
    const m = this._margin;
    const mH = m.left + m.right;
    const mV = m.top + m.bottom;
    const ds = this._desiredSize;
    // 官方 yt：约束减去 margin，desiredSize 覆盖（+stroke 作为“含描边”约束）
    let t = Math.max(widthConstraint - mH, 0);
    let i = Math.max(heightConstraint - mV, 0);
    if (isFinite(ds.width)) t = ds.width + strokeW;
    if (isFinite(ds.height)) i = ds.height + strokeW;

    // 官方 ln(!0)：raw stretch 解析（Auto 主元素 → Fill 等）
    const st = this._getStretch(true);
    const nat = this._naturalSize();
    let e = 0; // holes（本调用链恒为 0）
    let s = 0;
    let aW = nat.w;
    let aH = nat.h;
    if (st === StretchNone) {
      e = 0;
      s = 0;
    } else if (st === StretchVertical) {
      aW = Math.max(t - strokeW, 0);
      s = 0;
    } else if (st === StretchHorizontal) {
      e = 0;
      aH = Math.max(i - strokeW, 0);
    } else {
      // Fill（及非官方 Uniform 等按 Fill 处理）：内容可超过自然尺寸
      aW = Math.max(t - strokeW, 0);
      aH = Math.max(i - strokeW, 0);
    }
    if (isFinite(ds.width)) aW = ds.width;
    if (isFinite(ds.height)) aH = ds.height;
    const maxS = this._maxSize;
    const minS = this._minSize;
    e = Math.max(e - strokeW, minS.width);
    s = Math.max(s - strokeW, minS.height);
    aW = Math.min(maxS.width, aW);
    aH = Math.min(maxS.height, aH);
    aW = isFinite(aW) ? Math.max(e, aW) : Math.max(nat.w, e);
    aH = isFinite(aH) ? Math.max(s, aH) : Math.max(nat.h, s);

    // 官方 Yd 的 yM：geometryStretch 决定生成几何的宽高
    const yM = this._resolvedGeometryStretch();
    let gW = aW;
    let gH = aH;
    if (yM === 0) {
      gW = nat.w;
      gH = nat.h;
    } else if (yM === 6) {
      const k = nat.w > 0 && nat.h > 0 ? Math.min(aW / nat.w, aH / nat.h) : 1;
      gW = nat.w * k;
      gH = nat.h * k;
    }
    // 2（Fill）及以上默认：gW/gH = 内容尺寸
    (this as any)._geoW = gW;
    (this as any)._geoH = gH;
    this._naturalBounds = new Rect(0, 0, aW, aH);
    this._measuredBounds = new Rect(0, 0, aW + strokeW, aH + strokeW);
    this._applyMeasureTransform();
  }

  /** 官方 Shape.yM：geometryStretch 显式值否则 geometry/figure 的 defaultStretch */
  private _resolvedGeometryStretch(): number {
    const gs = this._geometryStretch;
    if (gs !== GeometryStretchDefault) {
      if (gs === GeometryStretchNone) return 0;
      if (gs === GeometryStretchUniform) return 6;
      return 2; // Fill / UniformToFill（非官方按 Fill）
    }
    // Default：显式 geometry → 官方 t===1 ? 2 : t；figure → figure geometry 的 defaultStretch
    if (this._geometry !== null) return this._geometry.defaultStretch !== undefined ? (this._geometry.defaultStretch === 1 ? 2 : this._geometry.defaultStretch) : 2;
    if (this._figure && this._figure !== 'None') {
      const g = getFigureGeometry(this._figure, 100, 100, NaN, NaN, null);
      if (g) return g.defaultStretch !== undefined ? (g.defaultStretch === 1 ? 2 : g.defaultStretch) : 2;
    }
    return 2;
  }

  /** 绘制图形 */
  _draw(ctx: CanvasRenderingContext2D): void {
    const geo = this._getGeometry();
    if (!geo) return;

    ctx.save();

    // 填充
    if (this._fill) {
      if (Brush.isBrush(this._fill)) {
        const grad = (this._fill as Brush)._createCanvasGradient(ctx, this._actualBounds);
        if (grad) ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = this._fill as string;
      }
      this._drawGeometry(ctx, geo);
      ctx.fill(this._fillRule as CanvasFillRule);
    }

    if (this._stroke && this._strokeWidth > 0) {
      if (Brush.isBrush(this._stroke)) {
        const grad = (this._stroke as Brush)._createCanvasGradient(ctx, this._actualBounds);
        if (grad) ctx.strokeStyle = grad;
      } else {
        ctx.strokeStyle = this._stroke as string;
      }
      ctx.lineWidth = this._strokeWidth;
      ctx.lineCap = this._strokeCap as CanvasLineCap;
      ctx.lineJoin = this._strokeJoin as CanvasLineJoin;
      if (this._strokeDashArray) {
        ctx.setLineDash(this._strokeDashArray);
      }
      ctx.lineDashOffset = this._strokeDashOffset;
      this._drawGeometry(ctx, geo);
      ctx.stroke();
    }

    ctx.restore();
  }

  /** 在 canvas 上绘制几何路径 */
  private _drawGeometry(ctx: CanvasRenderingContext2D, geo: Geometry): void {
    // Fast path for rounded rectangles: the native roundRect draws a
    // perfectly convex, seamlessly-joined border (avoids concave arcs and
    // gaps at the straight/arc junctions when stroking).
    if (
      !this._geometry &&
      !this._geometryString &&
      (!this._toArrow || this._toArrow === 'None') &&
      (!this._fromArrow || this._fromArrow === 'None') &&
      this._figure && this._figure.toLowerCase() === 'roundedrectangle'
    ) {
      const ab = this._actualBounds;
      const w = ab.width;
      const h = ab.height;
      if (w > 0 && h > 0) {
        let r = isNaN(this._parameter1) ? 5 : this._parameter1;
        r = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        if (typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(ab.x, ab.y, w, h, r);
        } else {
          ctx.rect(ab.x, ab.y, w, h);
        }
        return;
      }
    }

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

  /** Draw an arc segment from current point to endpoint using SVG arc parameters */
  private _drawArcSegment(ctx: CanvasRenderingContext2D, curX: number, curY: number, seg: any): void {
    const rx = seg.radiusX;
    const ry = seg.radiusY;
    const endX = seg.endX;
    const endY = seg.endY;

    if (rx <= 0 || ry <= 0) {
      ctx.lineTo(endX, endY);
      return;
    }

    // Use canvas ellipse() to draw the arc
    // We need to compute the center of the ellipse from the SVG arc parameters
    // Using the SVG arc endpoint parameterization algorithm
    const rotation = (seg.xAxisRotation || 0) * Math.PI / 180;
    const largeArc = !!seg.largeArc;
    const sweep = !!seg.clockwise;

    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    // Step 1: Compute (x1', y1') - transformed midpoint
    const dx = (curX - endX) / 2;
    const dy = (curY - endY) / 2;
    const x1p = cos * dx + sin * dy;
    const y1p = -sin * dx + cos * dy;

    // Step 2: Compute (cx', cy') - transformed center
    const x1p2 = x1p * x1p;
    const y1p2 = y1p * y1p;
    const rx2 = rx * rx;
    const ry2 = ry * ry;

    // Check if radii are large enough; if not, scale them
    let lambda = x1p2 / rx2 + y1p2 / ry2;
    let rxScaled = rx;
    let ryScaled = ry;
    if (lambda > 1) {
      const sqrtLambda = Math.sqrt(lambda);
      rxScaled = rx * sqrtLambda;
      ryScaled = ry * sqrtLambda;
    }

    const rxScaled2 = rxScaled * rxScaled;
    const ryScaled2 = ryScaled * ryScaled;

    let num = rxScaled2 * ryScaled2 - rxScaled2 * y1p2 - ryScaled2 * x1p2;
    const den = rxScaled2 * y1p2 + ryScaled2 * x1p2;
    let sq = Math.max(0, num / den);
    sq = Math.sqrt(sq);
    if (largeArc === sweep) sq = -sq;

    const cxp = sq * rxScaled * y1p / ryScaled;
    const cyp = -sq * ryScaled * x1p / rxScaled;

    // Step 3: Compute (cx, cy) - actual center
    const cx = cos * cxp - sin * cyp + (curX + endX) / 2;
    const cy = sin * cxp + cos * cyp + (curY + endY) / 2;

    // Step 4: Compute start and end angles
    const ux = (x1p - cxp) / rxScaled;
    const uy = (y1p - cyp) / ryScaled;
    const vx = (-x1p - cxp) / rxScaled;
    const vy = (-y1p - cyp) / ryScaled;

    let startAngle = Math.atan2(uy, ux);
    let endAngle = Math.atan2(vy, vx);

    // Adjust for sweep direction
    let sweepAngle = endAngle - startAngle;
    if (sweep && sweepAngle < 0) {
      sweepAngle += 2 * Math.PI;
    } else if (!sweep && sweepAngle > 0) {
      sweepAngle -= 2 * Math.PI;
    }

    // Use ellipse() if available (modern browsers)
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, rxScaled, ryScaled, rotation, startAngle, startAngle + sweepAngle, !sweep);
    } else {
      // Fallback: approximate arc with line segments
      const steps = Math.max(8, Math.ceil(Math.abs(sweepAngle) * 8 / Math.PI));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const angle = startAngle + t * sweepAngle;
        const px = cx + rxScaled * Math.cos(angle) * Math.cos(rotation) - ryScaled * Math.sin(angle) * Math.sin(rotation);
        const py = cy + rxScaled * Math.cos(angle) * Math.sin(rotation) + ryScaled * Math.sin(angle) * Math.cos(rotation);
        ctx.lineTo(px, py);
      }
    }
  }

  /** 复制 */
  copy(): Shape {
    const shape = new Shape();
    this._copyPropertiesTo(shape);
    shape._fill = Brush.isBrush(this._fill) ? this._fill.copy() : this._fill;
    shape._stroke = Brush.isBrush(this._stroke) ? this._stroke.copy() : this._stroke;
    shape._strokeWidth = this._strokeWidth;
    shape._strokeDashArray = this._strokeDashArray ? [...this._strokeDashArray] : null;
    shape._strokeDashOffset = this._strokeDashOffset;
    shape._strokeCap = this._strokeCap;
    shape._strokeJoin = this._strokeJoin;
    shape._figure = this._figure;
    shape._geometry = this._geometry ? this._geometry.copy() : null;
    shape._geometryString = this._geometryString;
    shape._parameter1 = this._parameter1;
    shape._parameter2 = this._parameter2;
    shape._toArrow = this._toArrow;
    shape._fromArrow = this._fromArrow;
    shape._geometryStretch = this._geometryStretch;
    shape._fillRule = this._fillRule;
    shape._spot1 = this._spot1 ? this._spot1.copy() : null;
    shape._spot2 = this._spot2 ? this._spot2.copy() : null;
    return shape;
  }

  static defineFigureGenerator(name: string, func: (shape: Shape | null, w: number, h: number) => Geometry): void {
    figures.add(name, func);
  }

  static getFigureGenerators(): any {
    // 官方返回 G.Mn 中所有非小写名（内置 30 个 + 运行时 defineFigureGenerator 定义的），
    // 不含 extensions/Figures.js 的扩展图形（官方样例未加载该文件）
    const result = new Dict<string, any>();
    for (const name of CORE_FIGURE_NAMES) {
      const f = figures.get(name);
      if (f !== undefined) result.add(name, f);
    }
    const it = figures.iterator;
    while (it.next()) {
      const name = (it as any).key;
      if (CORE_FIGURE_NAMES.indexOf(name) < 0 && !isExtensionFigure(name)) result.add(name, it.value);
    }
    return result;
  }

  private static _arrowheadGeometries: Record<string, Geometry> | null = null;

  static getArrowheadGeometries(): Record<string, Geometry> {
    if (!Shape._arrowheadGeometries) {
      Shape._arrowheadGeometries = Shape._createArrowheadGeometries();
    }
    return Shape._arrowheadGeometries;
  }

  static defineArrowheadGenerator(name: string, func: (shape: Shape | null, w: number, h: number) => Geometry): void {
    if (!Shape._arrowheadGeometries) {
      Shape._arrowheadGeometries = Shape._createArrowheadGeometries();
    }
    Shape._arrowheadGeometries[name] = func(null, 10, 10);
  }

  private static _getArrowheadGeometry(name: string): Geometry | null {
    const geos = Shape.getArrowheadGeometries();
    return geos[name] || geos['Standard'] || null;
  }

  private static _createArrowheadGeometries(): Record<string, Geometry> {
    const geos: Record<string, Geometry> = {};

    const makeGeo = (figs: any[]) => {
      const geo = new Geometry();
      for (const fig of figs) {
        geo.add(fig);
      }
      return geo;
    };

    const fig = (sx: number, sy: number, segs: any[]) => {
      const f = new PathFigure(sx, sy, true);
      for (const s of segs) f.add(s);
      return f;
    };

    const line = (x: number, y: number) => PathSegment.Line(x, y);
    const close = () => PathSegment.Close();

    geos['Standard'] = makeGeo([fig(0, -5, [line(10, 0), line(0, 5), line(2.5, 0), close()])]);
    geos['Triangle'] = makeGeo([fig(0, -4, [line(15, 0), line(0, 4), close()])]);
    geos['Backward'] = makeGeo([fig(0, -5, [line(10, 0), line(0, 5), close()])]);
    geos['OpenTriangle'] = makeGeo([fig(0, -5, [line(10, 0), line(0, 5)])]);
    geos['BackwardOpenTriangle'] = makeGeo([fig(0, -5, [line(10, 0), line(0, 5)])]);
    geos['Circle'] = makeGeo([fig(0, 0, [PathSegment.Arc(0, 0, 5, 5)])]);
    geos['BackwardCircle'] = makeGeo([fig(0, 0, [PathSegment.Arc(0, 0, 5, 5)])]);
    geos['Diamond'] = makeGeo([fig(0, 0, [line(5, -5), line(10, 0), line(5, 5), close()])]);
    geos['BackwardDiamond'] = makeGeo([fig(0, 0, [line(-5, -5), line(-10, 0), line(-5, 5), close()])]);
    geos['Chevron'] = makeGeo([fig(0, -5, [line(10, 0), line(0, 5)])]);
    geos['BackwardChevron'] = makeGeo([fig(0, -5, [line(-10, 0), line(0, 5)])]);
    geos['DoubleTriangle'] = makeGeo([
      fig(0, -5, [line(5, 0), line(5, 5), close()]),
      fig(0, 5, [line(5, 0), line(5, -5), close()])
    ]);
    geos['DoubleChevron'] = makeGeo([fig(0, -5, [line(5, 0), line(0, 5)]), fig(0, 5, [line(5, 0), line(0, -5)])]);
    geos['HalfTriangle'] = makeGeo([fig(0, 0, [line(10, 0), line(10, 5), close()])]);
    geos['BackwardHalfTriangle'] = makeGeo([fig(0, 0, [line(-10, 0), line(-10, 5), close()])]);
    geos['StretchedDiamond'] = makeGeo([fig(0, 0, [line(5, -5), line(10, 0), line(5, 5), close()])]);
    geos['ThinTriangle'] = makeGeo([fig(0, 0, [line(10, 0), line(0, 2), close()])]);
    geos['BackwardThinTriangle'] = makeGeo([fig(0, 0, [line(-10, 0), line(-10, 2), close()])]);
    geos['Line'] = makeGeo([fig(0, 0, [line(10, 0)])]);
    geos['None'] = new Geometry();

    return geos;
  }
}

GraphObject.defineBuilder('Shape', Shape);
