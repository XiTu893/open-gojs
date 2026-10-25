/**
 * SvgRenderer —— 导出型 SVG 渲染器（对标官方 `Diagram.makeSvg` 的静态输出）。
 *
 * 复用布局/测量结果：GraphObject 的 actualBounds/naturalBounds 已由 measure+arrange 算好，
 * 本渲染器只负责把对象树"画"成 SVG DOM（形状/文字/图片/面板/连线/渐变/虚线/阴影）。
 * 交互仍由 CanvasRenderer 承担（本类不接管事件、不随模型自动增量更新）。
 */
import { GraphObject } from '../view/GraphObject';
import { Panel } from '../view/Panel';
import { Part } from '../view/Part';
import { Adornment } from '../view/Adornment';
import { Shape } from '../view/Shape';
import { TextBlock } from '../view/TextBlock';
import { Picture } from '../view/Picture';
import { Link } from '../view/Link';
import { Layer } from '../view/Layer';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Brush, BrushLike } from '../core/Brush';
import { Geometry } from '../core/Geometry';
import { PathFigure } from '../core/PathFigure';
import { getFigureGeometry } from '../figures/Figures';
import { SvgRendererOptions } from '../core/SvgRendererOptions';
import {
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable,
  PanelPosition, PanelGrid, PanelLink, PanelViewbox, PanelGraduated,
  PanelTableRow, PanelTableColumn,
  BrushSolid, BrushLinear, BrushRadial, BrushPattern,
  VerticalCenter, VerticalBottom,
  ImageStretchFill, ImageStretchUniform, ImageStretchUniformToFill,
} from '../core/EnumValues';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** makeSvg 选项（在 SvgRendererOptions 之上补充导出范围/缩放/图层过滤） */
export interface MakeSvgOptions extends Partial<SvgRendererOptions> {
  /** 缩放倍数（默认 1） */
  scale?: number;
  /** 导出范围（文档坐标；缺省用 diagram.documentBounds） */
  bounds?: Rect;
  /** 是否包含选中装饰层（默认 false） */
  includeAdornments?: boolean;
  /** 仅导出这些图层名（缺省全部可见图层，Adornment/Tool 除外） */
  layers?: string[];
}

/** 导出型 SVG 渲染器 */
export class SvgRenderer {
  static readonly className = 'SvgRenderer';

  private diagram: any;
  private svg!: SVGSVGElement;
  private defs!: SVGDefsElement;
  private scale = 1;
  private bounds!: Rect;
  private includeAdornments = false;
  private layerFilter: string[] | null = null;
  private brushSeq = 0;
  private clipSeq = 0;
  private filterSeq = 0;
  private currentShadow: { color: string; blur: number; dx: number; dy: number } | null = null;

  /** 把 diagram 当前内容渲染为一个 <svg> 元素 */
  static render(diagram: any, options?: MakeSvgOptions): SVGSVGElement {
    const r = new SvgRenderer();
    return r._render(diagram, options);
  }

  /** 把 diagram 当前内容渲染为 SVG 字符串 */
  static renderToString(diagram: any, options?: MakeSvgOptions): string {
    const svg = SvgRenderer.render(diagram, options);
    return new XMLSerializer().serializeToString(svg);
  }

  private _render(diagram: any, options?: MakeSvgOptions): SVGSVGElement {
    this.diagram = diagram;
    const opts = options || {};
    this.scale = opts.scale && isFinite(opts.scale) && opts.scale > 0 ? opts.scale : 1;
    this.includeAdornments = opts.includeAdornments === true;
    this.layerFilter = Array.isArray(opts.layers) ? opts.layers.slice() : null;

    const doc = diagram.documentBounds as Rect;
    const base = opts.bounds
      ? opts.bounds
      : new Rect(doc.x, doc.y, Math.max(doc.width, 1), Math.max(doc.height, 1));
    // 留一点边距，避免描边/阴影被 viewBox 裁掉
    const pad = 2;
    this.bounds = new Rect(base.x - pad, base.y - pad, base.width + pad * 2, base.height + pad * 2);

    const svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
    svg.setAttribute('xmlns', SVG_NS);
    svg.setAttribute('width', String(Math.ceil(this.bounds.width * this.scale)));
    svg.setAttribute('height', String(Math.ceil(this.bounds.height * this.scale)));
    svg.setAttribute('viewBox',
      `${this.bounds.x} ${this.bounds.y} ${this.bounds.width} ${this.bounds.height}`);
    svg.style.background = opts.background || '#FFFFFF';

    this.defs = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement;
    svg.appendChild(this.defs);

    // 背景（可选，覆盖导出范围）
    if (opts.background) {
      const bg = this._el('rect', {
        x: String(this.bounds.x), y: String(this.bounds.y),
        width: String(this.bounds.width), height: String(this.bounds.height),
        fill: opts.background,
      });
      svg.appendChild(bg);
    }

    // 图层（按绘制顺序）
    const layersIt = diagram.layers;
    while (layersIt.next()) {
      const layer: Layer = layersIt.value;
      this._renderLayer(layer, svg);
    }

    this.svg = svg;
    return svg;
  }

  // ============ 图层 / 部件 ============

  private _renderLayer(layer: Layer, root: SVGSVGElement): void {
    if (!layer || layer.visible === false) return;
    const name = (layer.name || '').toLowerCase();
    if (!this.includeAdornments && (name === 'adornment' || name === 'tool')) return;
    if (this.layerFilter && this.layerFilter.indexOf(layer.name) < 0) return;

    const g = this._el('g', { 'data-layer': layer.name || '' });
    const it = layer.parts;
    while (it.next()) {
      const part = it.value as Part;
      if (!part || part.visible === false) continue;
      if (!this.includeAdornments && part instanceof Adornment) continue;
      if ((part as any).isTemporary) continue;
      const ab = part.actualBounds;
      if (!ab || ab.width <= 0 || ab.height <= 0) continue;
      // 完全在导出范围外 → 跳过
      if (!this._intersects(ab, this.bounds)) continue;
      this._renderPart(part as any, g);
    }
    root.appendChild(g);
  }

  private _intersects(a: Rect, b: Rect): boolean {
    return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
  }

  private _renderPart(part: any, parent: SVGElement): void {
    const g = this._el('g', {});
    if (part.opacity !== undefined && part.opacity < 1) g.setAttribute('opacity', String(part.opacity));

    // 部件阴影（Part.isShadowed）：整部件加 feDropShadow 滤镜
    if (part.isShadowed) {
      const filterId = this._dropShadowFilter(
        part.shadowColor || 'rgba(0, 0, 0, 0.35)',
        part.shadowBlur ?? 4,
        part.shadowOffset ? part.shadowOffset.x : 0,
        part.shadowOffset ? part.shadowOffset.y : 0,
      );
      g.setAttribute('filter', `url(#${filterId})`);
    }

    // Part 的 angle/scale（镜像 CanvasRenderer._applyTransform；内容按文档坐标绘制）
    const tf = this._partTransform(part);
    if (tf) g.setAttribute('transform', tf);

    if (part instanceof Link) {
      this._renderLink(part as Link, g);
    } else {
      this._renderObject(part, g, 0, 0);
    }
    parent.appendChild(g);
  }

  /** 镜像 CanvasRenderer._applyTransform（枢轴旋转 + 缩放） */
  private _partTransform(part: any): string | null {
    const angle = part._angle as number;
    const sc = part._scale as number;
    const r: Point | null = part._rotPivot ?? null;
    if (angle && !isNaN(angle) && angle !== 0 && r !== null) {
      const ab = part.actualBounds as Rect;
      const mb = part.measuredBounds as Rect;
      const c0x = ab.x + r.x;
      const c0y = ab.y + r.y;
      const qx = ab.x + r.x * sc - (mb ? mb.x : 0);
      const qy = ab.y + r.y * sc - (mb ? mb.y : 0);
      return `translate(${num(qx)},${num(qy)})${sc !== 1 ? ` scale(${num(sc)})` : ''} rotate(${num(angle)}) translate(${num(-c0x)},${num(-c0y)})`;
    }
    if (angle && !isNaN(angle) && angle !== 0) {
      const ab = part.actualBounds as Rect;
      const cx = ab.x + ab.width / 2;
      const cy = ab.y + ab.height / 2;
      return `translate(${num(cx)},${num(cy)}) rotate(${num(angle)}) translate(${num(-cx)},${num(-cy)})`;
    }
    if (sc && sc !== 1) {
      const ab = part.actualBounds as Rect;
      return `translate(${num(ab.x)},${num(ab.y)}) scale(${num(sc)}) translate(${num(-ab.x)},${num(-ab.y)})`;
    }
    return null;
  }

  // ============ 对象树 ============

  /** offsetX/offsetY：父级原点在本对象坐标系中的偏移（与 CanvasRenderer 语义一致） */
  private _renderObject(obj: GraphObject, parent: SVGElement, offsetX: number, offsetY: number): void {
    if (!obj || obj.visible === false) return;
    const anyObj = obj as any;
    const ab = obj.actualBounds as Rect;
    if (!ab) return;

    let wrapper: SVGElement = parent;
    const needOpacity = obj.opacity !== undefined && obj.opacity < 1;
    const hasTransform = obj.angle !== 0 || obj.scale !== 1;

    if (needOpacity) {
      wrapper = this._el('g', { opacity: String(obj.opacity) });
      parent.appendChild(wrapper);
    }

    let paintBox: Rect | null = null;
    if (hasTransform) {
      const nb = (obj as any).naturalBounds as Rect;
      const lp = obj instanceof Shape ? (obj as Shape).strokeWidth : 0;
      const cx = offsetX + ab.x + ab.width / 2;
      const cy = offsetY + ab.y + ab.height / 2;
      const bw = nb.width + lp;
      const bh = nb.height + lp;
      paintBox = new Rect(cx - bw / 2, cy - bh / 2, bw, bh);
      const tx: SVGElement = this._el('g', {
        transform: this._rotateScale(obj.angle, obj.scale,
          offsetX + ab.x + ab.width / 2, offsetY + ab.y + ab.height / 2),
      });
      wrapper.appendChild(tx);
      wrapper = tx;
    }

    // 通用背景色（非 Panel）
    if ((obj as any).background && !(obj instanceof Panel)) {
      const bgRect = paintBox
        ? paintBox
        : new Rect(offsetX + ab.x, offsetY + ab.y, ab.width, ab.height);
      const paint = this._brushPaint((obj as any).background, bgRect);
      const bg = this._el('rect', {
        x: String(bgRect.x), y: String(bgRect.y),
        width: String(bgRect.width), height: String(bgRect.height),
        fill: paint,
      });
      wrapper.appendChild(bg);
    }

    if (obj instanceof Shape) {
      this._renderShape(obj as Shape, wrapper, offsetX, offsetY, paintBox);
    } else if (obj instanceof TextBlock) {
      this._renderTextBlock(obj as TextBlock, wrapper, offsetX, offsetY);
    } else if (obj instanceof Picture) {
      this._renderPicture(obj as Picture, wrapper, offsetX, offsetY);
    } else if (obj instanceof Panel) {
      this._renderPanel(obj as Panel, wrapper, offsetX, offsetY);
    }
    // Placeholder 由父 Group 面板处理（导出忽略）
  }

  private _renderPanel(panel: Panel, parent: SVGElement, offsetX: number, offsetY: number): void {
    const ab = panel.actualBounds as Rect;
    const panelX = offsetX + ab.x;
    const panelY = offsetY + ab.y;
    const panelW = ab.width;
    const panelH = ab.height;

    let wrapper = parent;

    // 裁剪面板：以面板矩形（或 Spot 主元素几何）裁剪
    if ((panel as any).isClipping) {
      const clipId = `svgclip${++this.clipSeq}`;
      const clipPath = this._el('clipPath', { id: clipId });
      const clipMain = panel.type === PanelSpot ? (panel as any).findMainElement() : null;
      if (clipMain instanceof Shape) {
        this._appendShapeClip(clipPath, clipMain as Shape, panelX, panelY);
      } else {
        clipPath.appendChild(this._el('rect', {
          x: String(panelX), y: String(panelY), width: String(panelW), height: String(panelH),
        }));
      }
      this.defs.appendChild(clipPath);
      wrapper = this._el('g', { 'clip-path': `url(#${clipId})` });
      parent.appendChild(wrapper);
    }

    // 面板背景
    if ((panel as any).background) {
      const paint = this._brushPaint((panel as any).background, new Rect(panelX, panelY, panelW, panelH));
      wrapper.appendChild(this._el('rect', {
        x: String(panelX), y: String(panelY),
        width: String(panelW), height: String(panelH),
        fill: paint,
      }));
    }

    // Grid：仅导出网格线以外的内容（不画 renderer 级网格线，MVP）
    if (panel.type === PanelGrid) {
      return;
    }

    // Row/Col 面板：子元素坐标在 TABLE 空间（继承父偏移）
    const isRowCol = panel.type === PanelTableRow || panel.type === PanelTableColumn;
    const childOX = isRowCol ? offsetX : panelX;
    const childOY = isRowCol ? offsetY : panelY;

    const elements = ((panel as any)._elements || []) as GraphObject[];

    if (panel.type === PanelAuto) {
      let main: GraphObject | null = null;
      const others: GraphObject[] = [];
      for (const elem of elements) {
        if (!elem.visible) continue;
        if (main === null || elem.isPanelMain) {
          if (main !== null && !main.isPanelMain) others.push(main);
          main = elem;
        } else {
          others.push(elem);
        }
      }
      if (main) this._renderObject(main, wrapper, panelX, panelY);
      for (const elem of others) this._renderObject(elem, wrapper, childOX, childOY);
      return;
    }

    if (panel.type === PanelSpot) {
      let main: GraphObject | null = null;
      const others: GraphObject[] = [];
      for (const elem of elements) {
        if (!elem.visible) continue;
        if (main === null) main = elem;
        else others.push(elem);
      }
      const skipMain = (panel as any).isClipping;
      if (main && !skipMain) this._renderObject(main, wrapper, panelX, panelY);
      for (const elem of others) this._renderObject(elem, wrapper, childOX, childOY);
      return;
    }

    // 其余面板（Vertical/Horizontal/Table/Position/Link/Viewbox/Graduated）：按顺序画子元素
    // Viewbox/Graduated 的缩放/刻度装饰暂不导出（MVP），子元素照常输出。
    for (const elem of elements) this._renderObject(elem, wrapper, childOX, childOY);
  }

  // ============ Shape ============

  private _renderShape(shape: Shape, parent: SVGElement, offsetX: number, offsetY: number, paintBox?: Rect | null): void {
    const anyShape = shape as any;
    const rawSW = shape.strokeWidth;
    const sw = typeof rawSW === 'number' && isFinite(rawSW) && rawSW > 0 ? rawSW : 0;
    const ab = shape.actualBounds as Rect;
    const shapeX = (paintBox ? paintBox.x : offsetX + ab.x) + sw / 2;
    const shapeY = (paintBox ? paintBox.y : offsetY + ab.y) + sw / 2;
    const shapeW = Math.max((paintBox ? paintBox.width : ab.width) - sw, 0);
    const shapeH = Math.max((paintBox ? paintBox.height : ab.height) - sw, 0);

    let geo = anyShape._getGeometry() as Geometry | null;
    if (geo && anyShape._figure && !anyShape._geometry && !anyShape._geometryString &&
      !(anyShape._toArrow && anyShape._toArrow !== 'None') &&
      !(anyShape._fromArrow && anyShape._fromArrow !== 'None')) {
      const rg = getFigureGeometry(anyShape._figure, shapeW, shapeH,
        anyShape._parameter1, anyShape._parameter2, shape);
      if (rg) geo = rg;
    }

    if (!geo) {
      if (shape.fill) {
        parent.appendChild(this._el('rect', {
          x: String(shapeX), y: String(shapeY),
          width: String(shapeW), height: String(shapeH),
          fill: this._brushPaint(shape.fill as BrushLike, new Rect(shapeX, shapeY, shapeW, shapeH)),
        }));
      }
      if (shape.stroke && shape.strokeWidth > 0) {
        const rect = this._el('rect', {
          x: String(shapeX), y: String(shapeY),
          width: String(shapeW), height: String(shapeH),
          fill: 'none',
          stroke: this._brushPaint(shape.stroke as BrushLike, new Rect(shapeX, shapeY, shapeW, shapeH)),
          'stroke-width': String(shape.strokeWidth),
        });
        this._applyStrokeStyle(rect, shape);
        parent.appendChild(rect);
      }
      return;
    }

    const geoBounds = geo.bounds as Rect;
    const scaleX = geoBounds.width > 0 ? shapeW / geoBounds.width : 1;
    const scaleY = geoBounds.height > 0 ? shapeH / geoBounds.height : 1;

    const g = this._el('g', {
      transform: `${this._translate(shapeX, shapeY)}${scaleX !== 1 || scaleY !== 1
        ? ` scale(${scaleX},${scaleY})` : ''
        }${!anyShape.isGeometryPositioned && (geoBounds.x !== 0 || geoBounds.y !== 0)
          ? ` translate(${-geoBounds.x},${-geoBounds.y})` : ''
        }`,
    });

    const geoRect = new Rect(0, 0, geoBounds.width, geoBounds.height);
    const doFill = !!shape.fill;
    const doStroke = !!shape.stroke && shape.strokeWidth > 0;
    const strokePaint = doStroke
      ? this._brushPaint(shape.stroke as BrushLike, geoRect)
      : 'none';
    const fillPaint = doFill
      ? this._brushPaint(shape.fill as BrushLike, geoRect)
      : 'none';

    const figIt = geo.figures.iterator;
    while (figIt.next()) {
      const fig: PathFigure = figIt.value;
      const d = this._figurePathData(fig);
      if (!d) continue;
      if (doFill && (fig as any).isFilled) {
        g.appendChild(this._el('path', { d, fill: fillPaint, stroke: 'none' }));
      }
      if (doStroke) {
        const path = this._el('path', {
          d,
          fill: 'none',
          stroke: strokePaint,
          'stroke-width': String(shape.strokeWidth / Math.max(scaleX, scaleY)),
          'stroke-linecap': (shape as any).strokeCap || 'butt',
          'stroke-linejoin': (shape as any).strokeJoin || 'miter',
        });
        this._applyStrokeStyle(path, shape);
        g.appendChild(path);
      }
    }

    parent.appendChild(g);
  }

  private _applyStrokeStyle(el: SVGElement, shape: Shape): void {
    const dash = (shape as any).strokeDashArray;
    if (Array.isArray(dash) && dash.length) {
      el.setAttribute('stroke-dasharray', dash.join(','));
      const off = (shape as any).strokeDashOffset;
      if (off) el.setAttribute('stroke-dashoffset', String(off));
    }
  }

  // ============ TextBlock ============

  private _renderTextBlock(tb: TextBlock, parent: SVGElement, offsetX: number, offsetY: number): void {
    const text = (tb as any).text as string;
    if (!text) return;
    const ab = tb.actualBounds as Rect;
    const tbX = offsetX + ab.x;
    const tbY = offsetY + ab.y;
    const tbW = ab.width;
    const tbH = ab.height;

    let wrapper = parent;
    if (tbW > 0 && tbH > 0) {
      const clipId = `svgclip${++this.clipSeq}`;
      const clipPath = this._el('clipPath', { id: clipId });
      clipPath.appendChild(this._el('rect', {
        x: String(tbX), y: String(tbY), width: String(tbW), height: String(tbH),
      }));
      this.defs.appendChild(clipPath);
      wrapper = this._el('g', { 'clip-path': `url(#${clipId})` });
      parent.appendChild(wrapper);
    }

    // 行数据取 measure 缓存（与 CanvasRenderer 一致）
    let cachedLines: string[] | null = null;
    let widths: number[] | null = null;
    try {
      const m = (tb as any).getMetrics();
      if (m && m[6] === text && Array.isArray(m[5])) {
        cachedLines = m[5] as string[];
        widths = Array.isArray(m[4]) ? (m[4] as number[]) : null;
      }
    } catch { /* ignore */ }

    if (cachedLines === null) return; // 未测量（隐藏/未布局）→ 不导出

    let align: string = (tb as any).textAlign;
    if (align === 'start') align = 'left';
    else if (align === 'end') align = 'right';
    else if (align !== 'center' && align !== 'right' && align !== 'left') align = 'left';
    const anchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start';

    const fill = (tb as any).stroke
      ? this._brushPaint((tb as any).stroke as BrushLike, new Rect(tbX, tbY, tbW, tbH))
      : 'black';

    const lineHeight = (tb as any).lineHeight as number;
    const spacingAbove = (tb as any).spacingAbove as number;
    const spacingBelow = (tb as any).spacingBelow as number;
    const lineCount = cachedLines.length;
    const naturalHeight = (spacingAbove + lineHeight + spacingBelow) * lineCount;
    let u = 0;
    if (tbH > naturalHeight) {
      const va = (tb as any).verticalAlignment;
      const vy = va === VerticalCenter ? 0.5 : va === VerticalBottom ? 1 : 0;
      u = vy * tbH - vy * naturalHeight;
    }

    const anchorX = align === 'center' ? tbX + tbW / 2 : align === 'right' ? tbX + tbW : tbX;
    const underlineStroke = typeof (tb as any).stroke === 'string' ? (tb as any).stroke as string : 'black';
    const thickness = Math.floor(lineHeight / 20) || 1;
    const drawLine = (lineText: string, i: number): void => {
      const baseline = tbY + u + lineHeight * 0.75;
      const t = this._el('text', {
        x: String(anchorX),
        y: String(baseline),
        fill,
        'font-family': 'inherit',
        'text-anchor': anchor,
        'xml:space': 'preserve',
      });
      t.setAttribute('font', (tb as any).font || '');
      // font 属性不是 SVG 有效属性 → 解析成 font-family/size/weight/style
      this._applyFont(t, (tb as any).font || '');
      const ls = (tb as any).letterSpacing;
      const ws = (tb as any).wordSpacing;
      if (ls) t.setAttribute('letter-spacing', String(ls));
      if (ws) t.setAttribute('word-spacing', String(ws));
      t.textContent = lineText;
      wrapper.appendChild(t);

      const lw = widths ? Math.min(widths[i], tbW) : null;
      if (((tb as any).isUnderline || (tb as any).isStrikethrough) && lw !== null) {
        let f = align === 'center' ? tbW / 2 : align === 'right' ? tbW : 0;
        if (align === 'right') f -= lw;
        else if (align === 'center') f -= lw / 2;
        const x0 = tbX + f;
        if ((tb as any).isUnderline) {
          const uy = tbY + u + lineHeight * 0.8;
          wrapper.appendChild(this._el('line', {
            x1: String(x0), y1: String(uy), x2: String(x0 + lw), y2: String(uy),
            stroke: underlineStroke, 'stroke-width': String(thickness),
          }));
        }
        if ((tb as any).isStrikethrough) {
          let sy = (tbY + u + lineHeight - lineHeight / 2.2) | 0;
          if (thickness % 2 !== 0) sy += 0.5;
          wrapper.appendChild(this._el('line', {
            x1: String(x0), y1: String(sy), x2: String(x0 + lw), y2: String(sy),
            stroke: underlineStroke, 'stroke-width': String(thickness),
          }));
        }
      }
    };

    if (lineCount === 1) {
      u += spacingAbove;
      drawLine(cachedLines[0], 0);
    } else {
      for (let i = 0; i < lineCount; i++) {
        u += spacingAbove;
        drawLine(cachedLines[i], i);
        u += lineHeight + spacingBelow;
      }
    }
  }

  private _applyFont(el: SVGElement, font: string): void {
    // 形如 "bold 13px Segoe UI, Arial, sans-serif" / "italic 600 13px serif"
    const m = /^\s*(?:(italic|oblique)\s+)?(?:(bold|bolder|lighter|[1-9]00)\s+)?([\d.]+)px\s+(.+)$/i.exec(font || '');
    if (!m) { el.setAttribute('font-family', font || 'sans-serif'); return; }
    if (m[1]) el.setAttribute('font-style', m[1]);
    if (m[2]) el.setAttribute('font-weight', m[2]);
    el.setAttribute('font-size', m[3] + 'px');
    el.setAttribute('font-family', m[4].trim());
  }

  // ============ Picture ============

  private _renderPicture(pic: Picture, parent: SVGElement, offsetX: number, offsetY: number): void {
    const anyPic = pic as any;
    const ab = pic.actualBounds as Rect;
    const x = offsetX + ab.x;
    const y = offsetY + ab.y;
    const el = anyPic.element as HTMLImageElement | HTMLCanvasElement | null;
    const src = anyPic.source as string | null;
    let href: string | null = null;
    if (el && (el as HTMLImageElement).src) href = (el as HTMLImageElement).src;
    else if (src) href = src;
    if (!href) return;

    const stretch = anyPic.imageStretch;
    const par = stretch === ImageStretchFill
      ? 'none'
      : stretch === ImageStretchUniform
        ? 'xMidYMid meet'
        : stretch === ImageStretchUniformToFill
          ? 'xMidYMid slice'
          : 'xMidYMid meet';
    const img = this._el('image', {
      x: String(x), y: String(y),
      width: String(ab.width), height: String(ab.height),
      preserveAspectRatio: par,
    });
    img.setAttribute('href', href);
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
    parent.appendChild(img);
  }

  // ============ 画笔 → SVG paint ============

  private _brushPaint(brush: BrushLike, bounds: Rect): string {
    if (!brush) return 'transparent';
    if (typeof brush === 'string') return brush;
    if (!Brush.isBrush(brush)) return 'black';

    if (brush.type === BrushSolid) return brush.color || 'black';

    if (brush.type === BrushLinear) {
      const s: any = brush.start, e: any = brush.end;
      const x1 = bounds.x + s.x * bounds.width + (s.offsetX || 0);
      const y1 = bounds.y + s.y * bounds.height + (s.offsetY || 0);
      const x2 = bounds.x + e.x * bounds.width + (e.offsetX || 0);
      const y2 = bounds.y + e.y * bounds.height + (e.offsetY || 0);
      if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
        return brush.color || 'transparent';
      }
      const id = `svggrad${++this.brushSeq}`;
      const grad = this._el('linearGradient', {
        id, gradientUnits: 'userSpaceOnUse',
        x1: String(x1), y1: String(y1), x2: String(x2), y2: String(y2),
      });
      for (const stop of brush.stops) {
        grad.appendChild(this._el('stop', {
          offset: String(stop.offset), 'stop-color': stop.color,
        }));
      }
      this.defs.appendChild(grad);
      return `url(#${id})`;
    }

    if (brush.type === BrushRadial) {
      const s: any = brush.start, e: any = brush.end;
      const fx = bounds.x + s.x * bounds.width + (s.offsetX || 0);
      const fy = bounds.y + s.y * bounds.height + (s.offsetY || 0);
      const cx = bounds.x + e.x * bounds.width + (e.offsetX || 0);
      const cy = bounds.y + e.y * bounds.height + (e.offsetY || 0);
      const maxWH = Math.max(bounds.width, bounds.height);
      let er = (brush as any).endRadius;
      let sr: number;
      if (isNaN((brush as any).startRadius)) { sr = 0; er = maxWH / 2; }
      else { sr = (brush as any).startRadius; if (isNaN(er)) er = maxWH / 2; }
      if (!isFinite(fx) || !isFinite(fy) || !isFinite(cx) || !isFinite(cy) || !isFinite(sr) || !isFinite(er)) {
        return brush.color || 'transparent';
      }
      const id = `svggrad${++this.brushSeq}`;
      const grad = this._el('radialGradient', {
        id, gradientUnits: 'userSpaceOnUse',
        cx: String(cx), cy: String(cy), r: String(er),
        fx: String(fx), fy: String(fy),
      });
      for (const stop of brush.stops) {
        grad.appendChild(this._el('stop', {
          offset: String(stop.offset), 'stop-color': stop.color,
        }));
      }
      this.defs.appendChild(grad);
      return `url(#${id})`;
    }

    if (brush.type === BrushPattern) {
      const pat = (brush as any).pattern as HTMLImageElement | HTMLCanvasElement | null;
      if (!pat) return 'black';
      let href: string | null = null;
      if (pat instanceof HTMLImageElement) href = pat.src;
      else if (pat instanceof HTMLCanvasElement) {
        try { href = pat.toDataURL('image/png'); } catch { href = null; }
      }
      if (!href) return 'black';
      const id = `svgpat${++this.brushSeq}`;
      const pw = (pat as any).width || 10;
      const ph = (pat as any).height || 10;
      const pattern = this._el('pattern', {
        id, patternUnits: 'userSpaceOnUse',
        width: String(pw), height: String(ph),
      });
      const img = this._el('image', { x: '0', y: '0', width: String(pw), height: String(ph) });
      img.setAttribute('href', href);
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
      pattern.appendChild(img);
      this.defs.appendChild(pattern);
      return `url(#${id})`;
    }

    return 'black';
  }

  private _dropShadowFilter(color: string, blur: number, dx: number, dy: number): string {
    const id = `svgshadow${++this.filterSeq}`;
    const f = this._el('filter', {
      id,
      x: '-50%', y: '-50%', width: '200%', height: '200%',
      filterUnits: 'userSpaceOnUse',
    });
    f.appendChild(this._el('feDropShadow', {
      dx: String(dx), dy: String(dy),
      stdDeviation: String(Math.max(0, blur / 2)),
      'flood-color': color,
    }));
    this.defs.appendChild(f);
    return id;
  }

  // ============ 几何 → path d ============

  /** 单 figure 的 SVG path 数据 */
  private _figurePathData(fig: PathFigure): string {
    const parts: string[] = [];
    let curX = fig.startX;
    let curY = fig.startY;
    parts.push(`M ${num(curX)} ${num(curY)}`);
    const it = (fig as any).segments.iterator;
    while (it.next()) {
      const seg: any = it.value;
      const typeName: string = seg.type && seg.type._name ? seg.type._name : '';
      switch (typeName) {
        case 'Line':
          parts.push(`L ${num(seg.endX)} ${num(seg.endY)}`);
          curX = seg.endX; curY = seg.endY;
          break;
        case 'QuadraticBezier':
          parts.push(`Q ${num(seg.x1)} ${num(seg.y1)} ${num(seg.endX)} ${num(seg.endY)}`);
          curX = seg.endX; curY = seg.endY;
          break;
        case 'CubicBezier':
        case 'Bezier':
          parts.push(`C ${num(seg.x1)} ${num(seg.y1)} ${num(seg.x2)} ${num(seg.y2)} ${num(seg.endX)} ${num(seg.endY)}`);
          curX = seg.endX; curY = seg.endY;
          break;
        case 'Arc': {
          if (!isNaN(seg.startAngle) && !isNaN(seg.centerX)) {
            // 「按角度」圆弧 → 采样为多段 SVG 弧
            const rX = Math.abs(seg.radiusX), rY = Math.abs(seg.radiusY);
            if (rX > 0 && rY > 0) {
              const a0 = seg.startAngle;
              const sweepAng = seg.sweepAngle || 0;
              const steps = Math.max(1, Math.ceil(Math.abs(sweepAng) / 90));
              for (let k = 0; k < steps; k++) {
                const aStart = a0 + sweepAng * (k / steps);
                const aEnd = a0 + sweepAng * ((k + 1) / steps);
                const x0 = seg.centerX + rX * Math.cos(aStart * Math.PI / 180);
                const y0 = seg.centerY + rY * Math.sin(aStart * Math.PI / 180);
                const x1 = seg.centerX + rX * Math.cos(aEnd * Math.PI / 180);
                const y1 = seg.centerY + rY * Math.sin(aEnd * Math.PI / 180);
                if (k === 0) parts.push(`L ${num(x0)} ${num(y0)}`);
                parts.push(`A ${num(rX)} ${num(rY)} 0 0 ${sweepAng >= 0 ? 1 : 0} ${num(x1)} ${num(y1)}`);
              }
              curX = seg.centerX + rX * Math.cos((a0 + sweepAng) * Math.PI / 180);
              curY = seg.centerY + rY * Math.sin((a0 + sweepAng) * Math.PI / 180);
              break;
            }
            parts.push(`L ${num(seg.arcEndX ?? seg.endX)} ${num(seg.arcEndY ?? seg.endY)}`);
            curX = seg.arcEndX ?? seg.endX; curY = seg.arcEndY ?? seg.endY;
            break;
          }
          const rx = seg.radiusX, ry = seg.radiusY;
          if (rx > 0 && ry > 0) {
            parts.push(`A ${num(rx)} ${num(ry)} ${num(seg.xAxisRotation || 0)} ${seg.largeArc ? 1 : 0} ${seg.clockwise ? 1 : 0} ${num(seg.endX)} ${num(seg.endY)}`);
          } else {
            parts.push(`L ${num(seg.endX)} ${num(seg.endY)}`);
          }
          curX = seg.endX; curY = seg.endY;
          break;
        }
        case 'MoveTo':
          parts.push(`M ${num(seg.endX)} ${num(seg.endY)}`);
          curX = seg.endX; curY = seg.endY;
          break;
        case 'Close':
          parts.push('Z');
          curX = fig.startX; curY = fig.startY;
          break;
        default:
          break;
      }
      if (seg.isClosed && typeName !== 'Close') {
        parts.push('Z');
        curX = fig.startX; curY = fig.startY;
      }
    }
    return parts.join(' ');
  }

  /** 把 Shape 的几何以带变换的 path 追加进 clipPath */
  private _appendShapeClip(clipPath: SVGElement, shape: Shape, docX: number, docY: number): void {
    const anyShape = shape as any;
    const ab = shape.actualBounds as Rect;
    const geo = anyShape._getGeometry() as Geometry | null;
    if (!geo || ab.width <= 0 || ab.height <= 0) {
      clipPath.appendChild(this._el('rect', {
        x: String(docX + ab.x), y: String(docY + ab.y),
        width: String(Math.max(ab.width, 0)), height: String(Math.max(ab.height, 0)),
      }));
      return;
    }
    const gb = geo.bounds as Rect;
    const sx = gb.width > 0 ? ab.width / gb.width : 1;
    const sy = gb.height > 0 ? ab.height / gb.height : 1;
    const tf = `translate(${num(docX + ab.x)},${num(docY + ab.y)})${sx !== 1 || sy !== 1 ? ` scale(${num(sx)},${num(sy)})` : ''}${gb.x !== 0 || gb.y !== 0 ? ` translate(${num(-gb.x)},${num(-gb.y)})` : ''}`;
    const it = geo.figures.iterator;
    while (it.next()) {
      const d = this._figurePathData(it.value as PathFigure);
      if (!d) continue;
      clipPath.appendChild(this._el('path', { d, transform: tf }));
    }
  }

  // ============ Link ============

  /** 连线：主路径按 link.points（含端点 shortLength/圆角）绘制，箭头单独定位，其余子元素常规绘制 */
  private _renderLink(link: Link, parent: SVGElement): void {
    const points = link.points;
    if (!points || points.count < 2) return;
    const lgb = link.getDocumentBounds();
    const ox = lgb.x;
    const oy = lgb.y;
    const elements = ((link as any)._elements || []) as GraphObject[];
    let hasExplicitMain = false;
    for (const elem of elements) {
      if (elem instanceof Shape && elem.isPanelMain) { hasExplicitMain = true; break; }
    }
    let firstShape = true;
    for (const elem of elements) {
      if (!elem.visible) continue;
      if (elem instanceof Shape) {
        const shape = elem as Shape;
        const isMain = shape.isPanelMain || (!hasExplicitMain && firstShape);
        firstShape = false;
        if (isMain) {
          this._renderLinkPath(shape, link, parent);
        } else if ((shape as any)._toArrow || (shape as any)._fromArrow) {
          this._renderArrow(shape, link, parent);
        } else {
          this._renderObject(elem, parent, ox, oy);
        }
      } else {
        this._renderObject(elem, parent, ox, oy);
      }
    }
  }

  /** 主路径：镜像 CanvasRenderer._renderLinkPath（直线/贝塞尔/圆角） */
  private _renderLinkPath(shape: Shape, link: Link, parent: SVGElement): void {
    const points = link.points;
    let arr = points.toArray() as Point[];
    const curve = (link as any)._curve;

    const applyShort = (isFrom: boolean): void => {
      const li = (link as any).computeShortLength as ((f: boolean) => number) | undefined;
      if (typeof li !== 'function') return;
      const a = li.call(link, isFrom);
      if (!isFinite(a) || a === 0) return;
      const i = isFrom ? 0 : arr.length - 1;
      const j = isFrom ? 1 : arr.length - 2;
      if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return;
      const dx = arr[j].x - arr[i].x;
      const dy = arr[j].y - arr[i].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) return;
      const cap = points.count === 2 ? len * 0.5 : len;
      const k = a > cap ? cap : a;
      arr[i] = new Point(arr[i].x + (k * dx) / len, arr[i].y + (k * dy) / len);
    };
    applyShort(true);
    applyShort(false);

    const bezier = curve === 'Bezier';
    if (!bezier) {
      const radius = typeof (link as any).computeCorner === 'function'
        ? (link as any).computeCorner()
        : 0;
      if (radius > 0) arr = this._roundCorners(arr, radius);
    }

    const d = bezier ? this._bezierPathData(arr, link) : this._polylinePathData(arr);
    if (!d) return;

    const bounds = link.getDocumentBounds();
    const paint = shape.stroke ? this._brushPaint(shape.stroke as any, bounds) : 'none';
    const path = this._el('path', {
      d, fill: 'none', stroke: paint,
      'stroke-width': String(shape.strokeWidth || 1),
      'stroke-linecap': (shape as any).strokeCap || 'butt',
      'stroke-linejoin': (shape as any).strokeJoin || 'miter',
    });
    this._applyStrokeStyle(path, shape);
    parent.appendChild(path);
  }

  private _polylinePathData(arr: Point[]): string {
    if (!arr.length) return '';
    const parts = [`M ${num(arr[0].x)} ${num(arr[0].y)}`];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].x === arr[i - 1].x && arr[i].y === arr[i - 1].y) continue;
      parts.push(`L ${num(arr[i].x)} ${num(arr[i].y)}`);
    }
    return parts.join(' ');
  }

  private _bezierPathData(arr: Point[], link: Link): string {
    if (arr.length < 2) return '';
    const parts = [`M ${num(arr[0].x)} ${num(arr[0].y)}`];
    if (arr.length === 2) {
      const curviness = typeof (link as any).computeCurviness === 'function'
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
        parts.push(`Q ${num(cx)} ${num(cy)} ${num(arr[1].x)} ${num(arr[1].y)}`);
      } else {
        parts.push(`L ${num(arr[1].x)} ${num(arr[1].y)}`);
      }
    } else if (arr.length === 3) {
      parts.push(`Q ${num(arr[1].x)} ${num(arr[1].y)} ${num(arr[2].x)} ${num(arr[2].y)}`);
    } else {
      for (let i = 1; i < arr.length - 2; i += 3) {
        parts.push(`C ${num(arr[i].x)} ${num(arr[i].y)} ${num(arr[i + 1].x)} ${num(arr[i + 1].y)} ${num(arr[i + 2].x)} ${num(arr[i + 2].y)}`);
      }
      const remaining = (arr.length - 1) % 3;
      if (remaining === 1) {
        parts.push(`L ${num(arr[arr.length - 1].x)} ${num(arr[arr.length - 1].y)}`);
      } else if (remaining === 2) {
        parts.push(`Q ${num(arr[arr.length - 2].x)} ${num(arr[arr.length - 2].y)} ${num(arr[arr.length - 1].x)} ${num(arr[arr.length - 1].y)}`);
      }
    }
    return parts.join(' ');
  }

  /** 圆角采样（镜像 CanvasRenderer._roundCorners） */
  private _roundCorners(src: Point[], radius: number): Point[] {
    const n = src.length;
    if (!(radius > 0) || n < 3) return src;
    const out: Point[] = [src[0]];
    for (let i = 1; i < n - 1; i++) {
      const prev = src[i - 1], nn = src[i], next = src[i + 1];
      let d1x = prev.x - nn.x, d1y = prev.y - nn.y;
      let d2x = next.x - nn.x, d2y = next.y - nn.y;
      const l1 = Math.sqrt(d1x * d1x + d1y * d1y);
      const l2 = Math.sqrt(d2x * d2x + d2y * d2y);
      if (!(l1 > 1e-6) || !(l2 > 1e-6)) { out.push(nn); continue; }
      d1x /= l1; d1y /= l1; d2x /= l2; d2y /= l2;
      if (Math.abs(d1x + d2x) < 1e-6 && Math.abs(d1y + d2y) < 1e-6) { out.push(nn); continue; }
      let c = radius;
      if (c > l1 / 2) c = l1 / 2;
      if (c > l2 / 2) c = l2 / 2;
      if (c < 0.5) { out.push(nn); continue; }
      const sx = nn.x + d1x * c, sy = nn.y + d1y * c;
      const ex = nn.x + d2x * c, ey = nn.y + d2y * c;
      out.push(new Point(sx, sy));
      for (let k = 1; k <= 4; k++) {
        const t = k / 5;
        const m = 1 - t;
        out.push(new Point(
          m * m * sx + 2 * m * t * nn.x + t * t * ex,
          m * m * sy + 2 * m * t * nn.y + t * t * ey,
        ));
      }
      out.push(new Point(ex, ey));
    }
    out.push(src[n - 1]);
    return out;
  }

  /** 箭头：镜像 CanvasRenderer._renderArrow（tip 定位 + 方向旋转 + 几何缩放矩阵） */
  private _renderArrow(shape: Shape, link: Link, parent: SVGElement): void {
    const points = link.points;
    if (!points || points.count < 2) return;
    const arr = points.toArray() as Point[];
    const toArrowName = (shape as any)._toArrow;
    const fromArrowName = (shape as any)._fromArrow;
    const isToArrow = !!(toArrowName && toArrowName !== 'None');
    const arrowType = isToArrow ? toArrowName : fromArrowName;
    if (!arrowType || arrowType === 'None') return;

    let tipX: number, tipY: number, dirX = 0, dirY = 0;
    if (isToArrow) {
      const tip = arr[arr.length - 1];
      tipX = tip.x; tipY = tip.y;
      for (let i = arr.length - 2; i >= 0; i--) {
        const dx = tip.x - arr[i].x, dy = tip.y - arr[i].y;
        if (dx !== 0 || dy !== 0) { dirX = dx; dirY = dy; break; }
      }
    } else {
      const tip = arr[0];
      tipX = tip.x; tipY = tip.y;
      for (let i = 1; i < arr.length; i++) {
        const dx = arr[i].x - tip.x, dy = arr[i].y - tip.y;
        if (dx !== 0 || dy !== 0) { dirX = dx; dirY = dy; break; }
      }
    }
    const len = Math.sqrt(dirX * dirX + dirY * dirY);
    if (len === 0) return;
    dirX /= len; dirY /= len;

    const geoFn = (Shape as any)._getArrowheadGeometry;
    const geo: Geometry | null = typeof geoFn === 'function' ? geoFn.call(Shape, arrowType || 'Standard') : null;
    if (!geo) return;

    const arrowScale = (shape as any).scale || 1;
    const arrowW = (shape as any).width;
    const arrowH = (shape as any).height;
    const stroke = (shape as any)._stroke;
    const fill = (shape as any)._fill;
    const strokeWidth = (shape as any)._strokeWidth || 1;
    const gbounds = geo.bounds as Rect;

    let tf = `translate(${num(tipX)},${num(tipY)}) rotate(${num(Math.atan2(dirY, dirX) * 180 / Math.PI)})`;
    if (gbounds.width > 0 && gbounds.height > 0) {
      const dir = isToArrow ? 1 : -1;
      const sx = typeof arrowW === 'number' && !isNaN(arrowW) && arrowW > 0
        ? dir * arrowW / gbounds.width : dir * arrowScale;
      const sy = typeof arrowH === 'number' && !isNaN(arrowH) && arrowH > 0
        ? arrowH / gbounds.height : arrowScale;
      const inset = (strokeWidth * arrowScale) / 2;
      const tx = -(gbounds.x + gbounds.width) * sx + (isToArrow ? -inset : inset);
      const ty = -(gbounds.y + gbounds.height / 2) * sy;
      tf += ` matrix(${num(sx)} 0 0 ${num(sy)} ${num(tx)} ${num(ty)})`;
    }

    const g = this._el('g', { transform: tf });
    const it = geo.figures.iterator;
    while (it.next()) {
      const d = this._figurePathData(it.value as PathFigure);
      if (!d) continue;
      const attrs: Record<string, string> = { d };
      if (fill) attrs.fill = typeof fill === 'string' ? fill : '#000000';
      if (stroke) {
        attrs.stroke = typeof stroke === 'string' ? stroke : '#000000';
        attrs['stroke-width'] = String(strokeWidth * arrowScale);
      }
      if (!fill && !stroke) attrs.fill = '#000000';
      if (!attrs.fill && !attrs.stroke) attrs.fill = '#000000';
      g.appendChild(this._el('path', attrs));
    }
    parent.appendChild(g);
  }

  // ============ 小工具 ============

  private _el(name: string, attrs?: Record<string, string>): SVGElement {
    const el = document.createElementNS(SVG_NS, name) as SVGElement;
    if (attrs) {
      for (const k of Object.keys(attrs)) {
        el.setAttribute(k, attrs[k]);
      }
    }
    return el;
  }

  private _translate(x: number, y: number): string {
    return `translate(${num(x)},${num(y)})`;
  }

  private _rotateScale(angle: number, scale: number, cx: number, cy: number): string {
    const parts: string[] = [];
    parts.push(`translate(${num(cx)},${num(cy)})`);
    if (angle) parts.push(`rotate(${num(angle)})`);
    if (scale !== 1) parts.push(`scale(${num(scale)})`);
    parts.push(`translate(${num(-cx)},${num(-cy)})`);
    return parts.join(' ');
  }
}

/** 数字格式化（保留 3 位，避免科学计数法） */
function num(v: number): string {
  if (!isFinite(v)) return '0';
  const r = Math.round(v * 1000) / 1000;
  return String(r);
}
