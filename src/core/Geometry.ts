import { PathFigure } from './PathFigure';
import { PathSegment } from './PathSegment';
import { List } from './List';
import { Rect } from './Rect';
import { Point } from './Point';
import { Spot } from './Spot';
import { EnumValue, GeometryTypeLine, GeometryTypePath, GeometryTypeRectangle, GeometryTypeEllipse, PathSegmentQuadraticBezier, PathSegmentCubicBezier, PathSegmentArc } from './EnumValues';

/** 近似相等（用于 equalsApprox） */
function approxEquals(a: number, b: number): boolean {
  if (isNaN(a) && isNaN(b)) return true;
  if (isNaN(a) || isNaN(b)) return false;
  if (a === b) return true;
  const diff = Math.abs(a - b);
  return diff <= 1e-6 || diff <= Math.max(Math.abs(a), Math.abs(b)) * 1e-9;
}

/**
 * Geometry - 几何路径定义
 */
export class Geometry {
  static readonly className: string = "Geometry";
  /** 图形集合 */
  private _figures: List<PathFigure>;
  /** 默认图形 */
  private _defaultFigure: PathFigure;
  /** 边界矩形 */
  private _bounds: Rect | null = null;
  /** 是否包含偶奇填充 */
  public fillRule: string = 'evenodd';
  /** 图形名称（用于 figure 属性） */
  public name: string = '';
  /** Auto 面板内容定位用的左上锚点（官方 geometry.spot1）。
   *  官方 Geometry 构造即默认 Spot.TopLeft.copy()，这里保持一致。 */
  public spot1: any = new Spot(0, 0, 0, 0);
  /** Auto 面板内容定位用的右下锚点（官方 geometry.spot2），官方默认 Spot.BottomRight.copy()。 */
  public spot2: any = new Spot(1, 1, 0, 0);
  /** 官方 geometry.defaultStretch（0=None 2=Fill 4=Vertical 5=Horizontal 6=Uniform），默认 Fill */
  public defaultStretch: number = 2;
  /** 官方 geometry 记录的图形生成尺寸（Shape 生成图形几何时写入 width/height）。
   *  包围盒至少要覆盖 (0,0,width,height) 这个原始盒子 —— 官方 computeBounds 就是这么做的：
   *  先用 (0,0,width,height) 起步再并入实际路径。
   *  少了这一步，DataStorage 这类「原始路径比盒子窄」的图形会被按窄包围盒横向拉伸，
   *  拐角处出现尖刺。 */
  public width: number = NaN;
  /** 同 width：图形生成时的高度 */
  public height: number = NaN;

  /**
   * 官方 go.d.ts：`constructor(type?: GeometryType, init?: Partial<Geometry>)`
   * —— 第一个参数是**几何类型**（`go.GeometryType.Line` 等），不是 figures。
   * 以前这里写成 `(figures?: PathFigure | PathFigure[])`，于是
   * `new go.Geometry(go.GeometryType.Line)` 会把一个 EnumValue 当成 PathFigure
   * 塞进 `_figures`，之后 `figure.segments.iterator` 就是
   * `Cannot read properties of undefined (reading 'iterator')`
   * （实测 controlGauges / shapes）。
   * 为了兼容旧调用，仍然接受 PathFigure / PathFigure[]。
   */
  constructor(
    type?: EnumValue | PathFigure | PathFigure[] | Record<string, any>,
    init?: Partial<Geometry>
  ) {
    this._figures = new List<PathFigure>();
    this._defaultFigure = new PathFigure();
    if (type !== undefined && type !== null) {
      if (type instanceof EnumValue) {
        this._type = type;
      } else if (Array.isArray(type)) {
        for (const fig of type) this.add(fig);
      } else if (typeof (type as PathFigure).add === 'function') {
        // PathFigure（有 add 方法）
        this.add(type as PathFigure);
      } else {
        // 普通对象：等价于官方第二个参数 init
        init = type as Partial<Geometry>;
      }
    }
    if (init !== undefined && init !== null) {
      this.set(init as Record<string, any>);
    }
  }

  /** 获取默认图形 */
  get defaultFigure(): PathFigure {
    if (this._figures.count === 0) {
      this.add(this._defaultFigure);
    }
    return this._defaultFigure;
  }

  /** 获取图形集合 */
  get figures(): List<PathFigure> {
    return this._figures;
  }

  /** 添加图形 */
  add(fig: PathFigure): this {
    this._figures.add(fig);
    if (this._figures.count === 1) {
      this._defaultFigure = fig;
    }
    this._bounds = null;
    return this;
  }

  set(props: Record<string, any>): this {
    if (!props) return this;
    const keys = Object.keys(props);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key in this) {
        (this as any)[key] = props[key];
      }
    }
    return this;
  }

  /** 移除图形 */
  remove(fig: PathFigure): boolean {
    const result = this._figures.remove(fig);
    this._bounds = null;
    return result;
  }

  /** 清空图形 */
  clear(): this {
    this._figures.clear();
    this._bounds = null;
    return this;
  }

  /** 记录图形生成尺寸（官方 `Shape` 图形几何入口的做法），并作废已缓存的包围盒。 */
  setSize(w: number, h: number): void {
    this.width = w;
    this.height = h;
    this._bounds = null;
  }

  /** 获取边界矩形 */
  get bounds(): Rect {
    if (this._bounds === null) {
      this._bounds = this.computeBounds();
    }
    return this._bounds;
  }

  /** 计算边界矩形 */
  private computeBounds(): Rect {
    const acc = [Infinity, Infinity, -Infinity, -Infinity];
    if (!isNaN(this.width) && !isNaN(this.height)) {
      acc[0] = 0; acc[1] = 0; acc[2] = this.width; acc[3] = this.height;
    }
    this._accumulatePathBounds(acc);
    if (!isFinite(acc[0])) {
      return new Rect(0, 0, 0, 0);
    }
    return new Rect(acc[0], acc[1], acc[2] - acc[0], acc[3] - acc[1]);
  }

  /**
   * 路径几何累积包围盒 acc=[minX,minY,maxX,maxY]。
   * 官方 Geometry.DT(Path)：直线/端点直接并入，三次/二次贝塞尔与圆弧用 G.Yu 细分算法
   * 求真实曲线极值（圆弧先转三次贝塞尔），否则圆/椭圆等弧形图形包围盒高度为 0。
   */
  private _accumulatePathBounds(acc: number[]): void {
    const unionPoint = (x: number, y: number): void => {
      if (x < acc[0]) acc[0] = x;
      if (y < acc[1]) acc[1] = y;
      if (x > acc[2]) acc[2] = x;
      if (y > acc[3]) acc[3] = y;
    };
    const it = this._figures.iterator;
    while (it.next()) {
      const fig = it.value;
      unionPoint(fig.startX, fig.startY);
      let cx = fig.startX;
      let cy = fig.startY;
      const segIt = fig.segments.iterator;
      while (segIt.next()) {
        const seg = segIt.value;
        if (seg.type._name === 'Close') continue;
        if (seg.type === PathSegmentArc) {
          if (!isNaN((seg as any).startAngle) && !isNaN((seg as any).centerX)) {
            // 官方「按角度」圆弧：直接把弧覆盖到的椭圆外框并入包围盒
            const rX = Math.abs(seg.radiusX);
            const cX = (seg as any).centerX as number;
            const cY = (seg as any).centerY as number;
            const a0 = ((seg as any).startAngle as number) * Math.PI / 180;
            const swRad = (((seg as any).sweepAngle as number) || 0) * Math.PI / 180;
            const a1 = a0 + swRad;
            const rY2 = Math.abs(seg.radiusY === 0 ? seg.radiusX : seg.radiusY);
            unionPoint(cX + rX * Math.cos(a0), cY + rY2 * Math.sin(a0));
            unionPoint(cX + rX * Math.cos(a1), cY + rY2 * Math.sin(a1));
            // 椭圆弧的极值只可能出现在 0 / π/2 / π / 3π/2 四个角上（x 或 y 方向的极值）。
            // 以前这里只按 π 步长采 π/2 + kπ（只拿到上下极值），左右极值被漏掉，
            // 包围盒宽度算小 → 渲染时 geometry 被横向拉伸，圆形端头被压成平边。
            const TWO_PI = Math.PI * 2;
            const total = Math.abs(swRad);
            const dir = swRad >= 0 ? 1 : -1;
            const full = total >= TWO_PI - 1e-9;
            for (let e = 0; e < 4; e++) {
              const ang = (e * Math.PI) / 2;
              let d = (ang - a0) * dir;
              d = ((d % TWO_PI) + TWO_PI) % TWO_PI;
              if (!full && d > total + 1e-9) continue;
              unionPoint(cX + rX * Math.cos(ang), cY + rY2 * Math.sin(ang));
            }
          } else {
            const cubics = Geometry._arcToCubics(cx, cy, seg);
            for (let i = 0; i < cubics.length; i++) {
              const row = cubics[i];
              Geometry._bezierBounds(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], 0.5, acc, 0);
            }
          }
        } else if (seg.type === PathSegmentQuadraticBezier) {
          const c1x = cx + (2 / 3) * (seg.x1 - cx);
          const c1y = cy + (2 / 3) * (seg.y1 - cy);
          const c2x = seg.endX + (2 / 3) * (seg.x1 - seg.endX);
          const c2y = seg.endY + (2 / 3) * (seg.y1 - seg.endY);
          Geometry._bezierBounds(cx, cy, c1x, c1y, c2x, c2y, seg.endX, seg.endY, 0.5, acc, 0);
        } else if (seg.type === PathSegmentCubicBezier) {
          Geometry._bezierBounds(cx, cy, seg.x1, seg.y1, seg.x2, seg.y2, seg.endX, seg.endY, 0.5, acc, 0);
        } else {
          unionPoint(seg.endX, seg.endY);
          if (!isNaN(seg.x1)) unionPoint(seg.x1, seg.y1);
          if (!isNaN(seg.x2)) unionPoint(seg.x2, seg.y2);
        }
        cx = seg.endX;
        cy = seg.endY;
      }
    }
  }

  /** 官方 G.vi：点 (px,py) 是否在容差 tol 内靠近线段 (x0,y0)-(x1,y1)（含包围盒预检） */
  private static _vi(x0: number, y0: number, x1: number, y1: number, tol: number, px: number, py: number): boolean {
    if (tol <= 0) tol = 1e-6;
    let lo: number, hi: number, loY: number, hiY: number;
    if (x0 < x1) { lo = x0; hi = x1; } else { lo = x1; hi = x0; }
    if (y0 < y1) { loY = y0; hiY = y1; } else { loY = y1; hiY = y0; }
    if (x0 === x1) return loY <= py && py <= hiY && x0 - tol <= px && px <= x0 + tol;
    if (y0 === y1) return lo <= px && px <= hi && y0 - tol <= py && py <= y0 + tol;
    const right = hi + tol;
    const left = lo - tol;
    if (left <= px && px <= right) {
      const bottom = hiY + tol;
      const top = loY - tol;
      if (top <= py && py <= bottom) {
        if (right - left > bottom - top) {
          if (x0 - x1 > tol || x1 - x0 > tol) {
            const g = ((y1 - y0) / (x1 - x0)) * (px - x0) + y0;
            if (g - tol <= py && py <= g + tol) return true;
          } else return true;
        } else {
          if (y0 - y1 > tol || y1 - y0 > tol) {
            const g = ((x1 - x0) / (y1 - y0)) * (py - y0) + x0;
            if (g - tol <= px && px <= g + tol) return true;
          } else return true;
        }
      }
    }
    return false;
  }

  /** 官方 G.Yu：细分三次贝塞尔至平坦后把端点并入 acc=[minX,minY,maxX,maxY] */
  private static _bezierBounds(
    x0: number, y0: number, x1: number, y1: number,
    x2: number, y2: number, x3: number, y3: number,
    tol: number, acc: number[], depth: number
  ): void {
    if (
      depth >= 24 ||
      (Geometry._vi(x0, y0, x3, y3, tol, x1, y1) && Geometry._vi(x0, y0, x3, y3, tol, x2, y2))
    ) {
      if (x0 < acc[0]) acc[0] = x0;
      if (y0 < acc[1]) acc[1] = y0;
      if (x0 > acc[2]) acc[2] = x0;
      if (y0 > acc[3]) acc[3] = y0;
      if (x3 < acc[0]) acc[0] = x3;
      if (y3 < acc[1]) acc[1] = y3;
      if (x3 > acc[2]) acc[2] = x3;
      if (y3 > acc[3]) acc[3] = y3;
      return;
    }
    const ax = (x0 + x1) / 2;
    const ay = (y0 + y1) / 2;
    const bx = (x1 + x2) / 2;
    const by = (y1 + y2) / 2;
    const mx1 = (x2 + x3) / 2;
    const my1 = (y2 + y3) / 2;
    const dx = (ax + bx) / 2;
    const dy = (ay + by) / 2;
    const ex = (bx + mx1) / 2;
    const ey = (by + my1) / 2;
    const fx = (dx + ex) / 2;
    const fy = (dy + ey) / 2;
    Geometry._bezierBounds(x0, y0, ax, ay, dx, dy, fx, fy, tol, acc, depth + 1);
    Geometry._bezierBounds(fx, fy, ex, ey, mx1, my1, x3, y3, tol, acc, depth + 1);
  }

  copy(): Geometry {
    const geo = new Geometry();
    geo.fillRule = this.fillRule;
    geo.name = this.name;
    geo.width = this.width;
    geo.height = this.height;
    geo.spot1 = this.spot1;
    geo.spot2 = this.spot2;
    geo.defaultStretch = this.defaultStretch;
    const it = this._figures.iterator;
    while (it.next()) {
      geo.add(it.value.copy());
    }
    return geo;
  }

  equals(geo: Geometry): boolean {
    if (!(geo instanceof Geometry)) return false;
    if (this._figures.count !== geo._figures.count) return false;
    const it1 = this._figures.iterator;
    const it2 = geo._figures.iterator;
    while (it1.next() && it2.next()) {
      if (!it1.value.equals(it2.value)) return false;
    }
    return true;
  }

  /** 从 SVG 路径字符串解析 */
  static parse(str: string): Geometry {
    const geo = new Geometry();
    const fig = new PathFigure(0, 0);
    geo.add(fig);

    // GoJS 几何字符串解析：除 SVG 命令外还支持官方箭头图形用的
    // F/F1（填充标记）、b（按起始角+扫掠角画椭圆弧）、B（相对三次贝塞尔）
    const commands = str.match(/[FfMmLlHhVvCcSsQqTtAaBbZz][^FfMmLlHhVvCcSsQqTtAaBbZz]*/g);
    if (!commands) return geo;

    let curX = 0, curY = 0;
    let hasMove = false;
    let current = fig;
    // 官方 GeoStream 的 k 默认 false：无 F 前缀的图形 isFilled=false（探针确认）；
    // 见到 F/F0/F1 后 k=true 并对后续所有 figure 生效。此前本实现是反的
    // （plain F→不填充），industrialMonitor 的罐体全透明。
    let isFilled = false;

    const startFigure = (x: number, y: number): void => {
      if (hasMove || current.segments.count > 0) {
        current = new PathFigure(x, y, isFilled);
        geo.add(current);
      } else {
        current.startX = x;
        current.startY = y;
        current.isFilled = isFilled;
      }
      hasMove = true;
      curX = x;
      curY = y;
    };

    for (const cmd of commands) {
      const type = cmd[0];
      // 官方预处理 `([0-9])([+\-])→"$1 $2"` 的等价：按数字而非空白切分，
      // 否则 `Q25-3 0 3` 里的 "25-3" 被 split 后 Number()=NaN 被丢弃，
      // 隐式重复的二次贝塞尔参数整体错位（MHWT 罐体上的斜线元凶）。
      const args = (cmd.slice(1).match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || []).map(Number);

      switch (type) {
        case 'F':
        case 'F1':
        case 'F0': {
          // 官方 case"F"：F/F0/F1 都把后续 figure 置为 isFilled=true（F0 另置 evenOdd，
          // 渲染未用到 evenOdd，这里与 F1 同等处理）。
          isFilled = true;
          current.isFilled = true;
          break;
        }
        case 'M':
          startFigure(args[0], args[1]);
          for (let i = 2; i + 1 < args.length; i += 2) {
            curX = args[i]; curY = args[i + 1];
            current.add(PathSegment.Line(curX, curY));
          }
          break;
        case 'm':
          startFigure(curX + args[0], curY + args[1]);
          for (let i = 2; i + 1 < args.length; i += 2) {
            curX += args[i]; curY += args[i + 1];
            current.add(PathSegment.Line(curX, curY));
          }
          break;
        case 'L':
          for (let i = 0; i + 1 < args.length; i += 2) {
            curX = args[i]; curY = args[i + 1];
            current.add(PathSegment.Line(curX, curY));
          }
          break;
        case 'l':
          for (let i = 0; i + 1 < args.length; i += 2) {
            curX += args[i]; curY += args[i + 1];
            current.add(PathSegment.Line(curX, curY));
          }
          break;
        case 'H':
          for (const x of args) { curX = x; current.add(PathSegment.Line(curX, curY)); }
          break;
        case 'h':
          for (const dx of args) { curX += dx; current.add(PathSegment.Line(curX, curY)); }
          break;
        case 'V':
          for (const y of args) { curY = y; current.add(PathSegment.Line(curX, curY)); }
          break;
        case 'v':
          for (const dy of args) { curY += dy; current.add(PathSegment.Line(curX, curY)); }
          break;
        case 'C':
          for (let i = 0; i + 5 < args.length; i += 6) {
            current.add(PathSegment.CubicBezier(args[i + 4], args[i + 5], args[i], args[i + 1], args[i + 2], args[i + 3]));
            curX = args[i + 4]; curY = args[i + 5];
          }
          break;
        case 'c':
          for (let i = 0; i + 5 < args.length; i += 6) {
            current.add(PathSegment.CubicBezier(curX + args[i + 4], curY + args[i + 5], curX + args[i], curY + args[i + 1], curX + args[i + 2], curY + args[i + 3]));
            curX += args[i + 4]; curY += args[i + 5];
          }
          break;
        case 'Q':
          for (let i = 0; i + 3 < args.length; i += 4) {
            current.add(PathSegment.QuadraticBezier(args[i + 2], args[i + 3], args[i], args[i + 1]));
            curX = args[i + 2]; curY = args[i + 3];
          }
          break;
        case 'q':
          for (let i = 0; i + 3 < args.length; i += 4) {
            current.add(PathSegment.QuadraticBezier(curX + args[i + 2], curY + args[i + 3], curX + args[i], curY + args[i + 1]));
            curX += args[i + 2]; curY += args[i + 3];
          }
          break;
        case 'A':
        case 'a': {
          // 官方 GeoStream case"A"：弧的两个 flag 是单字符，会和终点粘连成
          // "0150"（A25 25 0 0150 25）。按官方 token 规则解码：
          //   len===1 → flag1=token, flag2=下一 token；len===2 → chars；
          //   len>2  → chars[0], chars[1], X=token.slice(2)
          // 用数字正则切参数会把 0150 当成 150 → 只剩 5 参 → 弧段被丢弃
          // （MHWT 罐体渲染成帆形的元凶）。
          const relative = type === 'a';
          const arcBody = cmd.slice(1).replace(/([0-9])([+-])/g, '$1 $2');
          const tokens = arcBody.split(/[\s,]+/).filter((t) => t.length > 0);
          let ti = 0;
          while (ti + 2 < tokens.length) {
            const rx = Math.abs(parseFloat(tokens[ti]));
            const ry = Math.abs(parseFloat(tokens[ti + 1]));
            const rot = parseFloat(tokens[ti + 2]);
            ti += 3;
            if (ti >= tokens.length) break;
            const flagTok = tokens[ti];
            let largeArc: boolean, sweep: boolean, ex: number, ey: number;
            if (flagTok.length === 1) {
              largeArc = !!parseFloat(flagTok);
              sweep = !!parseFloat(tokens[ti + 1] || '0');
              ex = parseFloat(tokens[ti + 2] || '0');
              ey = parseFloat(tokens[ti + 3] || '0');
              ti += 4;
            } else if (flagTok.length === 2) {
              largeArc = !!parseFloat(flagTok[0]);
              sweep = !!parseFloat(flagTok[1]);
              ex = parseFloat(tokens[ti + 1] || '0');
              ey = parseFloat(tokens[ti + 2] || '0');
              ti += 3;
            } else {
              largeArc = !!parseFloat(flagTok[0]);
              sweep = !!parseFloat(flagTok[1]);
              ex = parseFloat(flagTok.slice(2));
              ey = parseFloat(tokens[ti + 1] || '0');
              ti += 2;
            }
            if (relative) { ex = curX + ex; ey = curY + ey; }
            current.add(PathSegment.Arc(ex, ey, rx, ry, rot, largeArc, sweep));
            curX = ex; curY = ey;
          }
          break;
        }
        case 'B': {
          // 相对三次贝塞尔：b x1,y1 x2,y2 x,y
          if (args.length >= 6) {
            current.add(PathSegment.CubicBezier(
              curX + args[4], curY + args[5],
              curX + args[0], curY + args[1],
              curX + args[2], curY + args[3]));
            curX += args[4]; curY += args[5];
          }
          break;
        }
        case 'b': {
          // 官方椭圆弧。本项目箭头表用 5 参形式：
          //   b startAngle sweepAngle centerDx centerDy radius
          // 表示「以当前点为角度 startAngle 上的点、圆心相对当前点偏移 (dx,dy)、半径 r」
          // （例如 Circle = "F1 m 8,4 b 0 360 -4 0 4 z" → 圆心 (4,4) r=4）。
          // 这种情况必须直接生成官方那种「按角度」的 Arc 段；早先把它当成
          // 「相对终点 + 反解椭圆」处理，圆心会解到 (12,4) 而不是 (4,4)，
          // 整个带弧的箭头都平移了，包围盒也从 [0,0,8,8] 变成 [8,0,8,8]。
          if (args.length >= 5) {
            const startAngle = args[0];
            const sweep = args[1];
            const cx = curX + args[2];
            const cy = curY + args[3];
            const r = args[4];
            current.add(PathSegment.AngleArc(cx, cy, r, r, startAngle, sweep));
            // current point 走到圆弧终点
            const endAngle = (startAngle + sweep) * Math.PI / 180;
            curX = cx + r * Math.cos(endAngle);
            curY = cy + r * Math.sin(endAngle);
          } else if (args.length >= 4) {
            // 官方椭圆弧：b startAngle sweepAngle endX endY（角度单位为度）
            // 由起点、终点与扫掠角反解椭圆，再用三次贝塞尔逼近。
            const startAngle = args[0];
            const sweep = args[1];
            const ex = curX + args[2];
            const ey = curY + args[3];
            Geometry._appendAngleArc(current, curX, curY, ex, ey, startAngle, sweep);
            curX = ex; curY = ey;
          }
          break;
        }
        case 'Z':
        case 'z':
          current.add(PathSegment.Close());
          break;
      }
    }

    return geo;
  }

  /** 从 GoJS 几何字符串格式解析 */
  static parseString(str: string, width?: number, height?: number): Geometry {
    if (!str || str.trim() === '') return new Geometry();

    const geo = new Geometry();
    let currentFig: PathFigure | null = null;
    let isFilled = true;
    let lastX = 0, lastY = 0;

    const tokens = str.trim().split(/\s+/);
    let i = 0;

    while (i < tokens.length) {
      const cmd = tokens[i];

      if (cmd === 'F' || cmd === 'F1') {
        isFilled = cmd === 'F1';
        i++;
        if (i < tokens.length) {
          const sx = parseFloat(tokens[i]); i++;
          const sy = parseFloat(tokens[i]); i++;
          currentFig = new PathFigure(sx, sy, isFilled);
          lastX = sx; lastY = sy;
          geo.add(currentFig);
        }
        continue;
      }

      if (!currentFig) {
        currentFig = new PathFigure(0, 0, true);
        geo.add(currentFig);
      }

      switch (cmd) {
        case 'M': {
          const x = parseFloat(tokens[i + 1]); i += 2;
          const y = parseFloat(tokens[i]); i++;
          lastX = x; lastY = y;
          break;
        }
        case 'L': {
          const x = parseFloat(tokens[i + 1]); i += 2;
          const y = parseFloat(tokens[i]); i++;
          currentFig.add(PathSegment.Line(x, y));
          lastX = x; lastY = y;
          break;
        }
        case 'Q': {
          const x1 = parseFloat(tokens[i + 1]); i += 2;
          const y1 = parseFloat(tokens[i]); i++;
          const x = parseFloat(tokens[i]); i++;
          const y = parseFloat(tokens[i]); i++;
          currentFig.add(PathSegment.QuadraticBezier(x1, y1, x, y));
          lastX = x; lastY = y;
          break;
        }
        case 'B': {
          const x1 = parseFloat(tokens[i + 1]); i += 2;
          const y1 = parseFloat(tokens[i]); i++;
          const x2 = parseFloat(tokens[i]); i++;
          const y2 = parseFloat(tokens[i]); i++;
          const x = parseFloat(tokens[i]); i++;
          const y = parseFloat(tokens[i]); i++;
          currentFig.add(PathSegment.CubicBezier(x1, y1, x2, y2, x, y));
          lastX = x; lastY = y;
          break;
        }
        case 'A': {
          const x = parseFloat(tokens[i + 1]); i += 2;
          const y = parseFloat(tokens[i]); i++;
          const rx = parseFloat(tokens[i]); i++;
          const ry = parseFloat(tokens[i]); i++;
          const angle = parseFloat(tokens[i]); i++;
          const largeArc = tokens[i] === '1'; i++;
          const sweep = tokens[i] === '1'; i++;
          currentFig.add(PathSegment.Arc(x, y, rx, ry, angle, largeArc, sweep));
          lastX = x; lastY = y;
          break;
        }
        case 'X':
        case 'Z': {
          currentFig.add(PathSegment.Close());
          i++;
          break;
        }
        default: {
          i++;
          break;
        }
      }
    }

    return geo;
  }

  /** 转换为 SVG 路径字符串 */
  toSvgString(): string {
    let result = '';
    const it = this._figures.iterator;
    while (it.next()) {
      const fig = it.value;
      result += `M ${fig.startX} ${fig.startY} `;
      const segIt = fig.segments.iterator;
      while (segIt.next()) {
        const seg = segIt.value;
        switch (seg.type._name) {
          case 'Line':
            result += `L ${seg.endX} ${seg.endY} `;
            break;
          case 'QuadraticBezier':
            result += `Q ${seg.x1} ${seg.y1} ${seg.endX} ${seg.endY} `;
            break;
          case 'CubicBezier':
            result += `C ${seg.x1} ${seg.y1} ${seg.x2} ${seg.y2} ${seg.endX} ${seg.endY} `;
            break;
          case 'Arc':
            result += `A ${seg.radiusX} ${seg.radiusY} ${seg.xAxisRotation} ${seg.largeArc ? 1 : 0} ${seg.clockwise ? 1 : 0} ${seg.endX} ${seg.endY} `;
            break;
          case 'MoveTo':
            result += `M ${seg.endX} ${seg.endY} `;
            break;
          case 'Close':
            result += 'Z ';
            break;
        }
      }
    }
    return result.trim();
  }

  /** 创建矩形几何 */
  static rectangle(width: number, height: number): Geometry {
    const geo = new Geometry();
    const fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(width, 0));
    fig.add(PathSegment.Line(width, height));
    fig.add(PathSegment.Line(0, height));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
  }

  /** 创建圆角矩形几何 */
  static roundedRectangle(width: number, height: number, cornerRadius: number): Geometry {
    const r = Math.min(cornerRadius, width / 2, height / 2);
    const geo = new Geometry();
    const fig = new PathFigure(r, 0);
    fig.add(PathSegment.Line(width - r, 0));
    fig.add(PathSegment.Arc(width, r, r, r, 0, false, false));
    fig.add(PathSegment.Line(width, height - r));
    fig.add(PathSegment.Arc(width - r, height, r, r, 0, false, false));
    fig.add(PathSegment.Line(r, height));
    fig.add(PathSegment.Arc(0, height - r, r, r, 0, false, false));
    fig.add(PathSegment.Line(0, r));
    fig.add(PathSegment.Arc(r, 0, r, r, 0, false, false));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
  }

  /** 创建椭圆几何 */
  static ellipse(width: number, height: number): Geometry {
    const rx = width / 2;
    const ry = height / 2;
    const geo = new Geometry();
    const fig = new PathFigure(width, ry);
    fig.add(PathSegment.Arc(0, ry, rx, ry, 0, false, false));
    fig.add(PathSegment.Arc(width, ry, rx, ry, 0, false, false));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
  }

  /** 创建线段几何 */
  static line(x1: number, y1: number, x2: number, y2: number): Geometry {
    const geo = new Geometry();
    const fig = new PathFigure(x1, y1, false);
    fig.add(PathSegment.Line(x2, y2));
    geo.add(fig);
    return geo;
  }

  static triangle(width: number, height: number): Geometry {
    const geo = new Geometry();
    const fig = new PathFigure(width / 2, 0);
    fig.add(PathSegment.Line(width, height));
    fig.add(PathSegment.Line(0, height));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
  }

  static diamond(width: number, height: number): Geometry {
    const geo = new Geometry();
    const fig = new PathFigure(width / 2, 0);
    fig.add(PathSegment.Line(width, height / 2));
    fig.add(PathSegment.Line(width / 2, height));
    fig.add(PathSegment.Line(0, height / 2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
  }

  static string(width: number, height: number, top: number = 0, left: number = 0, bottom: number = 0, right: number = 0): Geometry {
    const geo = new Geometry();
    const fig = new PathFigure(left, top);
    fig.add(PathSegment.Line(width - right, top));
    fig.add(PathSegment.Line(width - right, height - bottom));
    fig.add(PathSegment.Line(left, height - bottom));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
  }

  static isGeometry(obj: any): boolean {
    return obj instanceof Geometry;
  }

  static stringify(geo: Geometry): string {
    if (!geo) return '';
    return geo.toString();
  }

  close(): Geometry {
    for (let i = 0; i < this._figures.count; i++) {
      const fig = this._figures.get(i);
      if (fig) fig.isFilled = true;
    }
    return this;
  }
  // ============ 官方 Geometry API 对齐（阶段 5） ============

  /** 官方 GeometryType（本项目用 EnumValue 而非数值，成员集合一致） */
  private _type: EnumValue = GeometryTypePath;
  private _startX: number = 0;
  private _startY: number = 0;
  private _endX: number = 0;
  private _endY: number = 0;
  private _flattenedSegments: number[][] | null = null;
  private _flattenedLengths: number[][] | null = null;
  private _flattenedTotalLength: number = NaN;

  private _invalidate(): void {
    this._bounds = null;
    this._flattenedSegments = null;
    this._flattenedLengths = null;
    this._flattenedTotalLength = NaN;
  }

  get type(): EnumValue {
    return this._type;
  }
  set type(value: EnumValue) {
    if (this._type === value) return;
    this._type = value;
    this._invalidate();
  }

  get startX(): number {
    return this._startX;
  }
  set startX(value: number) {
    if (this._startX === value) return;
    this._startX = value;
    this._invalidate();
  }

  get startY(): number {
    return this._startY;
  }
  set startY(value: number) {
    if (this._startY === value) return;
    this._startY = value;
    this._invalidate();
  }

  get endX(): number {
    return this._endX;
  }
  set endX(value: number) {
    if (this._endX === value) return;
    this._endX = value;
    this._invalidate();
  }

  get endY(): number {
    return this._endY;
  }
  set endY(value: number) {
    if (this._endY === value) return;
    this._endY = value;
    this._invalidate();
  }

  set figures(value: List<PathFigure>) {
    if (this._figures === value) return;
    this._figures = value;
    this._invalidate();
  }

  /** 官方 Geometry.setSpots：就地分配新 Spot，不走缓存 */
  setSpots(
    f1x: number,
    f1y: number,
    f2x: number,
    f2y: number,
    o1x?: number,
    o1y?: number,
    o2x?: number,
    o2y?: number
  ): this {
    this.spot1 = new Spot(f1x, f1y, o1x === undefined ? 0 : o1x, o1y === undefined ? 0 : o1y);
    this.spot2 = new Spot(f2x, f2y, o2x === undefined ? 0 : o2x, o2y === undefined ? 0 : o2y);
    return this;
  }

  /** 官方 Geometry.computeBoundsWithoutOrigin：不含原点的包围盒，可复用传入 Rect */
  computeBoundsWithoutOrigin(result?: Rect): Rect {
    const r = result === undefined ? new Rect() : result;
    if (this._type === GeometryTypePath) {
      const acc = [Infinity, Infinity, -Infinity, -Infinity];
      this._accumulatePathBounds(acc);
      if (!isFinite(acc[0])) {
        r.x = 0;
        r.y = 0;
        r.width = 0;
        r.height = 0;
        return r;
      }
      r.x = acc[0];
      r.y = acc[1];
      r.width = acc[2] - acc[0];
      r.height = acc[3] - acc[1];
      return r;
    }
    r.x = Math.min(this._startX, this._endX);
    r.y = Math.min(this._startY, this._endY);
    r.width = Math.abs(this._endX - this._startX);
    r.height = Math.abs(this._endY - this._startY);
    return r;
  }

  /** 官方 Geometry.normalize：把包围盒左上角移到原点，返回平移量 */
  normalize(): Point {
    const b = this.computeBoundsWithoutOrigin();
    const dx = -b.x;
    const dy = -b.y;
    this.offset(dx, dy);
    return new Point(dx, dy);
  }

  /** 官方 Geometry.offset：原地平移 */
  offset(x: number, y: number): this {
    this._transform(1, 0, 0, 1, x, y);
    return this;
  }

  /** 官方 Geometry.scale：原地缩放（负值用于翻转） */
  scale(x: number, y: number): this {
    this._transform(x, 0, 0, y, 0, 0);
    return this;
  }

  /** 官方 Geometry.rotate：绕 (x,y) 旋转（默认原点） */
  rotate(angle: number, x?: number, y?: number): this {
    const cx = x === undefined ? 0 : x;
    const cy = y === undefined ? 0 : y;
    const rad = (angle * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    this._transform(c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy);
    return this;
  }

  /** 官方 Geometry.D：2x3 仿射变换，作用于起点/终点或 Path 的所有控制点 */
  private _transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void {
    const nx = (px: number, py: number): number => px * m11 + py * m21 + dx;
    const ny = (px: number, py: number): number => px * m12 + py * m22 + dy;
    if (this._type !== GeometryTypePath) {
      const sx = this._startX;
      const sy = this._startY;
      this._startX = nx(sx, sy);
      this._startY = ny(sx, sy);
      const ex = this._endX;
      const ey = this._endY;
      this._endX = nx(ex, ey);
      this._endY = ny(ex, ey);
      this._invalidate();
      return;
    }
    const figs = this._figures.iterator;
    while (figs.next()) {
      const fig = figs.value;
      const fsx = fig.startX;
      const fsy = fig.startY;
      fig.startX = nx(fsx, fsy);
      fig.startY = ny(fsx, fsy);
      const sit = fig.segments.iterator;
      while (sit.next()) {
        const seg = sit.value;
        const name = seg.type._name;
        if (name === 'MoveTo' || name === 'Line') {
          const ex = seg.endX;
          const ey = seg.endY;
          seg.endX = nx(ex, ey);
          seg.endY = ny(ex, ey);
        } else if (name === 'QuadraticBezier') {
          const ex = seg.endX;
          const ey = seg.endY;
          const p1x = seg.x1;
          const p1y = seg.y1;
          seg.x1 = nx(p1x, p1y);
          seg.y1 = ny(p1x, p1y);
          seg.endX = nx(ex, ey);
          seg.endY = ny(ex, ey);
        } else if (name === 'CubicBezier') {
          const ex = seg.endX;
          const ey = seg.endY;
          const p1x = seg.x1;
          const p1y = seg.y1;
          const p2x = seg.x2;
          const p2y = seg.y2;
          seg.x1 = nx(p1x, p1y);
          seg.y1 = ny(p1x, p1y);
          seg.x2 = nx(p2x, p2y);
          seg.y2 = ny(p2x, p2y);
          seg.endX = nx(ex, ey);
          seg.endY = ny(ex, ey);
        } else if (name === 'Arc') {
          const ex = seg.endX;
          const ey = seg.endY;
          seg.endX = nx(ex, ey);
          seg.endY = ny(ex, ey);
          // 官方「按角度」圆弧的圆心也要跟随平移/缩放，
          // 否则 normalize()/offset() 之后圆弧与直线段会错位（PathSegment.centerX/centerY）。
          if (!isNaN((seg as any).startAngle) && !isNaN((seg as any).centerX)) {
            const cxx = (seg as any).centerX as number;
            const cyy = (seg as any).centerY as number;
            (seg as any).centerX = nx(cxx, cyy);
            (seg as any).centerY = ny(cxx, cyy);
            seg.radiusX *= Math.sqrt(m11 * m11 + m21 * m21);
            seg.radiusY *= Math.sqrt(m12 * m12 + m22 * m22);
            continue;
          }
          if (seg.radiusX === 0 || seg.radiusY === 0) continue;
          if (m12 !== 0) {
            let a = (Math.atan2(m12, m11) * 180) / Math.PI;
            if (a < 0) a += 360;
            seg.xAxisRotation += a;
          }
          if (m11 < 0) {
            seg.xAxisRotation = 180 - seg.xAxisRotation;
            seg.clockwise = !seg.clockwise;
          }
          if (m22 < 0) {
            seg.xAxisRotation = -seg.xAxisRotation;
            seg.clockwise = !seg.clockwise;
          }
          seg.radiusX *= Math.sqrt(m11 * m11 + m21 * m21);
          seg.radiusY *= Math.sqrt(m12 * m12 + m22 * m22);
        }
      }
    }
    this._invalidate();
  }

  /** 官方 Geometry.equalsApprox：按几何语义的近似相等 */
  equalsApprox(g: Geometry): boolean {
    if (!(g instanceof Geometry)) return false;
    if (this._type !== g._type) {
      if (this._type === GeometryTypeLine && g._type === GeometryTypePath) {
        return this._lineEqualsPath(g);
      }
      if (g._type === GeometryTypeLine && this._type === GeometryTypePath) {
        return g._lineEqualsPath(this);
      }
      return false;
    }
    if (this._type === GeometryTypePath) {
      if (this._figures.count !== g._figures.count) return false;
      const it1 = this._figures.iterator;
      const it2 = g._figures.iterator;
      while (it1.next() && it2.next()) {
        if (!it1.value.equals(it2.value)) return false;
      }
      return true;
    }
    return (
      approxEquals(this._startX, g._startX) &&
      approxEquals(this._startY, g._startY) &&
      approxEquals(this._endX, g._endX) &&
      approxEquals(this._endY, g._endY)
    );
  }

  private _lineEqualsPath(g: Geometry): boolean {
    if (g._figures.count !== 1) return false;
    const fig = g._figures.first();
    if (fig === null || fig.segments.count !== 1) return false;
    if (!approxEquals(fig.startX, this._startX) || !approxEquals(fig.startY, this._startY)) {
      return false;
    }
    const seg = fig.segments.first();
    if (seg === null || seg.type._name !== 'Line') return false;
    return approxEquals(seg.endX, this._endX) && approxEquals(seg.endY, this._endY);
  }

  /** 官方 Geometry.toString：把几何写成可被 Geometry.parse 读回的字符串 */
  toString(digits?: number): string {
    const d = digits === undefined ? -1 : digits;
    const f = (v: number): string => (v === 0 ? '0' : v.toFixed(d));
    const raw = (v: number): string => v.toString();
    const fx = d < 0 ? raw : f;
    switch (this._type) {
      case GeometryTypeLine:
        return (
          'M' + fx(this._startX) + ' ' + fx(this._startY) + 'L' + fx(this._endX) + ' ' + fx(this._endY)
        );
      case GeometryTypeRectangle: {
        const rx = Math.min(this._startX, this._endX);
        const ry = Math.min(this._startY, this._endY);
        const rr = Math.max(this._startX, this._endX);
        const rb = Math.max(this._startY, this._endY);
        return (
          'M' + fx(rx) + ' ' + fx(ry) + 'H' + fx(rr) + 'V' + fx(rb) + 'H' + fx(rx) + 'z'
        );
      }
      case GeometryTypeEllipse: {
        const ex = Math.min(this._startX, this._endX);
        const ey = Math.min(this._startY, this._endY);
        const ew = Math.abs(this._endX - this._startX);
        const eh = Math.abs(this._endY - this._startY);
        const lx = ex;
        const cy = ey + eh / 2;
        const rx = ex + ew;
        const rxx = ew / 2;
        const ryy = eh / 2;
        return (
          'M' +
          fx(lx) + ' ' + fx(cy) +
          'A' + fx(rxx) + ' ' + fx(ryy) + ' 0 0 1 ' + fx(rx) + ' ' + fx(cy) +
          'A' + fx(rxx) + ' ' + fx(ryy) + ' 0 0 1 ' + fx(lx) + ' ' + fx(cy)
        );
      }
      default: {
        const figs = this._figures;
        const n = figs.count;
        let str = '';
        for (let i = 0; i < n; i++) {
          const fig = figs.elt(i);
          if (fig === null) continue;
          if (i > 0) str += ' x ';
          if (fig.isFilled) str += 'F ';
          str += Geometry._figureToString(fig, d);
        }
        return str;
      }
    }
  }

  private static _figureToString(fig: PathFigure, d: number): string {
    const f = (v: number): string => (v === 0 ? '0' : v.toFixed(d));
    const raw = (v: number): string => v.toString();
    const fx = d < 0 ? raw : f;
    let str = 'M' + fx(fig.startX) + ' ' + fx(fig.startY);
    const it = fig.segments.iterator;
    while (it.next()) {
      const seg = it.value;
      const name = seg.type._name;
      if (name === 'Line') {
        str += 'L' + fx(seg.endX) + ' ' + fx(seg.endY);
      } else if (name === 'QuadraticBezier') {
        str += 'Q' + fx(seg.x1) + ' ' + fx(seg.y1) + ' ' + fx(seg.endX) + ' ' + fx(seg.endY);
      } else if (name === 'CubicBezier') {
        str +=
          'C' + fx(seg.x1) + ' ' + fx(seg.y1) + ' ' + fx(seg.x2) + ' ' + fx(seg.y2) +
          ' ' + fx(seg.endX) + ' ' + fx(seg.endY);
      } else if (name === 'Arc') {
        str +=
          'A' + fx(seg.radiusX) + ' ' + fx(seg.radiusY) + ' ' + fx(seg.xAxisRotation) +
          ' ' + (seg.largeArc ? 1 : 0) + ' ' + (seg.clockwise ? 1 : 0) +
          ' ' + fx(seg.endX) + ' ' + fx(seg.endY);
      } else if (name === 'MoveTo') {
        str += 'M' + fx(seg.endX) + ' ' + fx(seg.endY);
      } else if (name === 'Close') {
        str += 'z';
      }
    }
    if (fig.isFilled) str += 'z';
    return str;
  }

  /** 官方 Geometry.containsPoint：点是否落在几何内（含 sw 的描边外扩） */
  containsPoint(p: Point, sw?: number): boolean {
    const pad = sw === undefined ? 0 : sw;
    switch (this._type) {
      case GeometryTypeLine:
        return (
          Point.distanceLineSegmentSquared(
            this._startX,
            this._startY,
            this._endX,
            this._endY,
            p.x,
            p.y
          ) <= pad * pad
        );
      case GeometryTypeRectangle: {
        const x = Math.min(this._startX, this._endX) - pad;
        const y = Math.min(this._startY, this._endY) - pad;
        const w = Math.abs(this._endX - this._startX) + pad * 2;
        const h = Math.abs(this._endY - this._startY) + pad * 2;
        return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h;
      }
      case GeometryTypeEllipse: {
        const rx = Math.abs(this._endX - this._startX) / 2;
        const ry = Math.abs(this._endY - this._startY) / 2;
        if (rx <= 0 || ry <= 0) return false;
        const cx = Math.min(this._startX, this._endX) + rx;
        const cy = Math.min(this._startY, this._endY) + ry;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const k = 1 + pad / Math.max(rx, ry);
        return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= k * k;
      }
      case GeometryTypePath: {
        const it = this._figures.iterator;
        while (it.next()) {
          const fig = it.value;
          const subs = Geometry._figureSubpaths(fig);
          if (fig.isFilled) {
            if (Geometry._strokeContains(subs, p.x, p.y, pad)) return true;
            if (Geometry._fillContains(fig, subs, p.x, p.y, pad)) return true;
          } else if (Geometry._strokeContains(subs, p.x, p.y, pad + 2)) {
            return true;
          }
        }
        return false;
      }
      default:
        return false;
    }
  }

  private static _strokeContains(subs: number[][], px: number, py: number, sw: number): boolean {
    const tol = sw * sw;
    for (let s = 0; s < subs.length; s++) {
      const pts = subs[s];
      const n = pts.length;
      for (let i = 0; i + 3 < n; i += 2) {
        if (Point.distanceLineSegmentSquared(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], px, py) <= tol) {
          return true;
        }
      }
      if (n >= 4) {
        if (Point.distanceLineSegmentSquared(pts[n - 2], pts[n - 1], pts[0], pts[1], px, py) <= tol) {
          return true;
        }
      }
    }
    return false;
  }

  private static _fillContains(fig: PathFigure, subs: number[][], px: number, py: number, sw: number): boolean {
    let winding = 0;
    let crossings = 0;
    for (let s = 0; s < subs.length; s++) {
      const pts = subs[s];
      const n = pts.length;
      if (n < 4) continue;
      for (let i = 0; i + 3 < n; i += 2) {
        const x0 = pts[i];
        const y0 = pts[i + 1];
        const x1 = pts[i + 2];
        const y1 = pts[i + 3];
        if (Point.distanceLineSegmentSquared(x0, y0, x1, y1, px, py) <= sw * sw + 0.0025) return true;
        if (y0 <= py) {
          if (y1 > py && (x1 - x0) * (py - y0) - (y1 - y0) * (px - x0) > 0) winding++;
        } else if (y1 <= py && (x1 - x0) * (py - y0) - (y1 - y0) * (px - x0) < 0) {
          winding--;
        }
        if (y0 > py !== y1 > py) {
          const t = (py - y0) / (y1 - y0);
          if (px < x0 + t * (x1 - x0)) crossings++;
        }
      }
      if (n >= 4) {
        const x0 = pts[n - 2];
        const y0 = pts[n - 1];
        const x1 = pts[0];
        const y1 = pts[1];
        if (Point.distanceLineSegmentSquared(x0, y0, x1, y1, px, py) <= sw * sw + 0.0025) return true;
        if (y0 <= py) {
          if (y1 > py && (x1 - x0) * (py - y0) - (y1 - y0) * (px - x0) > 0) winding++;
        } else if (y1 <= py && (x1 - x0) * (py - y0) - (y1 - y0) * (px - x0) < 0) {
          winding--;
        }
        if (y0 > py !== y1 > py) {
          const t = (py - y0) / (y1 - y0);
          if (px < x0 + t * (x1 - x0)) crossings++;
        }
      }
    }
    if (fig.isEvenOdd) return crossings % 2 !== 0;
    return winding !== 0;
  }

  get flattenedSegments(): number[][] {
    this._ensureFlattened();
    return this._flattenedSegments as number[][];
  }

  get flattenedLengths(): number[][] {
    this._ensureFlattened();
    return this._flattenedLengths as number[][];
  }

  get flattenedTotalLength(): number {
    if (!isNaN(this._flattenedTotalLength)) return this._flattenedTotalLength;
    let total = 0;
    if (this._type === GeometryTypeLine) {
      const dx = this._endX - this._startX;
      const dy = this._endY - this._startY;
      total = Math.sqrt(dx * dx + dy * dy);
    } else if (this._type === GeometryTypeRectangle) {
      total = Math.abs(this._endX - this._startX) * 2 + Math.abs(this._endY - this._startY) * 2;
    } else {
      const lengths = this.flattenedLengths;
      for (let i = 0; i < lengths.length; i++) {
        const arr = lengths[i];
        for (let j = 0; j < arr.length; j++) total += arr[j];
      }
    }
    this._flattenedTotalLength = total;
    return total;
  }

  private _ensureFlattened(): void {
    if (this._flattenedSegments !== null && this._flattenedLengths !== null) return;
    const segs: number[][] = [];
    const lens: number[][] = [];
    if (this._type === GeometryTypeLine) {
      segs.push([this._startX, this._startY, this._endX, this._endY]);
      lens.push([Math.sqrt(Point.distanceSquared(this._startX, this._startY, this._endX, this._endY))]);
    } else if (this._type === GeometryTypeRectangle) {
      segs.push([
        this._startX, this._startY,
        this._endX, this._startY,
        this._endX, this._endY,
        this._startX, this._endY,
        this._startX, this._startY
      ]);
      lens.push([
        Math.abs(this._endX - this._startX),
        Math.abs(this._endY - this._startY),
        Math.abs(this._endX - this._startX),
        Math.abs(this._endY - this._startY)
      ]);
    } else if (this._type === GeometryTypeEllipse) {
      const rx = Math.abs(this._endX - this._startX) / 2;
      const ry = Math.abs(this._endY - this._startY) / 2;
      const cx = Math.min(this._startX, this._endX) + rx;
      const cy = Math.min(this._startY, this._endY) + ry;
      const pts: number[] = [];
      const n = 64;
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push(cx + rx * Math.cos(a), cy + ry * Math.sin(a));
      }
      segs.push(pts);
      lens.push(Geometry._pointLengths(pts));
    } else {
      const it = this._figures.iterator;
      while (it.next()) {
        const subs = Geometry._figureSubpaths(it.value);
        for (let i = 0; i < subs.length; i++) {
          if (subs[i].length >= 4) {
            segs.push(subs[i]);
            lens.push(Geometry._pointLengths(subs[i]));
          }
        }
      }
    }
    this._flattenedSegments = segs;
    this._flattenedLengths = lens;
  }

  /** 把一个 PathFigure 拆成若干折线子路径（Move 之后开新路径） */
  private static _figureSubpaths(fig: PathFigure): number[][] {
    const result: number[][] = [];
    let pts: number[] = [fig.startX, fig.startY];
    let subStartX = fig.startX;
    let subStartY = fig.startY;
    const it = fig.segments.iterator;
    while (it.next()) {
      const seg = it.value;
      const name = seg.type._name;
      if (name === 'Close') {
        pts.push(subStartX, subStartY);
        continue;
      }
      if (name === 'MoveTo') {
        if (pts.length >= 4) result.push(pts);
        pts = [seg.endX, seg.endY];
        subStartX = seg.endX;
        subStartY = seg.endY;
        continue;
      }
      if (name === 'Line') {
        pts.push(seg.endX, seg.endY);
      } else if (name === 'QuadraticBezier') {
        Geometry._sampleQuad(pts[pts.length - 2], pts[pts.length - 1], seg.x1, seg.y1, seg.endX, seg.endY, pts);
      } else if (name === 'CubicBezier') {
        Geometry._sampleCubic(
          pts[pts.length - 2],
          pts[pts.length - 1],
          seg.x1,
          seg.y1,
          seg.x2,
          seg.y2,
          seg.endX,
          seg.endY,
          pts
        );
      } else if (name === 'Arc') {
        const cubics = Geometry._arcToCubics(
          pts[pts.length - 2],
          pts[pts.length - 1],
          seg
        );
        for (let i = 0; i < cubics.length; i++) {
          const c = cubics[i];
          Geometry._sampleCubic(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], pts);
        }
        if (pts.length < 4 || pts[pts.length - 2] !== seg.endX || pts[pts.length - 1] !== seg.endY) {
          pts.push(seg.endX, seg.endY);
        }
      } else {
        pts.push(seg.endX, seg.endY);
      }
      if (seg.isClosed) pts.push(subStartX, subStartY);
    }
    if (pts.length >= 4) result.push(pts);
    return result;
  }

  private static _pointLengths(pts: number[]): number[] {
    const out: number[] = [];
    for (let i = 0; i + 3 < pts.length; i += 2) {
      out.push(Math.sqrt(Point.distanceSquared(pts[i], pts[i + 1], pts[i + 2], pts[i + 3])));
    }
    return out;
  }

  private static _sampleQuad(
    x0: number,
    y0: number,
    qx: number,
    qy: number,
    x1: number,
    y1: number,
    out: number[]
  ): void {
    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const m = 1 - t;
      out.push(m * m * x0 + 2 * m * t * qx + t * t * x1, m * m * y0 + 2 * m * t * qy + t * t * y1);
    }
  }

  private static _sampleCubic(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    out: number[]
  ): void {
    const steps = 16;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const m = 1 - t;
      const a = m * m * m;
      const b = 3 * m * m * t;
      const c = 3 * m * t * t;
      const d = t * t * t;
      out.push(
        a * x0 + b * x1 + c * x2 + d * x3,
        a * y0 + b * y1 + c * y2 + d * y3
      );
    }
  }

  /** SVG 弧段转三次贝塞尔段（端点参数化 → 圆心参数化） */
  /**
   * 官方几何串的 `b startAngle sweepAngle endX endY`（角度制，可为相对终点）。
   * 官方箭头图形用它在两点间画一段椭圆弧（如 `b 0 360 -4 0 4` 表示整圆）。
   *
   * 已知起点 (sx,sy)、终点 (ex,ey) 与扫掠角，用「圆心在弦中垂线上」的经典解法
   * 反解半径与圆心：设半弦长 d、圆心到弦中点距离 h = d / tan(|sweep|/2)，
   * 半径 r = d / |sin(sweep/2)|。随后按扫掠角切成若干段，每段用一个三次贝塞尔逼近。
   * sweep 为 360（或其整数倍）时退化为整圆，用 d=0 的极限直接取 r=|sweep| 无关的
   * 最小外接圆：以弦中点为心、半弦长（此处为 0）无法定半径，改用端点距离的一半。
   */
  private static _appendAngleArc(fig: PathFigure, sx: number, sy: number, ex: number, ey: number, startAngle: number, sweep: number): void {
    let sw = sweep;
    // 归一化到 (-360, 360]，整圈（|sweep| >= 360 视为整圆）
    const fullCircle = Math.abs(sw) >= 360 - 1e-9;
    while (sw <= -360) sw += 360;
    while (sw > 360) sw -= 360;

    const dx = ex - sx;
    const dy = ey - sy;
    const chord = Math.sqrt(dx * dx + dy * dy);

    if (fullCircle || chord < 1e-9) {
      // 整圆：以弦中点为圆心。官方整圆弧（如 Circle: m 8,4 b 0 360 -4 0 4）
      // 起点与终点相同，直径由 startAngle 无关，取端点回退半径。
      // 对 `m 8,4 b 0 360 -4 0 4`：终点 (4,4)，与起点 (8,4) 弦长 4 → 半径 2 不成立，
      // 官方语义是「以 startAngle 为起始角的整圆」，半径由 chord 与角度共同决定；
      // 这里采用：半径 = |dx| 或 |dy| 中与起点角一致者，退化时用弦长。
      const r = Math.abs(dx) > 1e-9 ? Math.abs(dx) : (Math.abs(dy) > 1e-9 ? Math.abs(dy) : 0);
      if (r <= 0) {
        fig.add(PathSegment.Line(ex, ey));
        return;
      }
      // 圆心：使 startPoint 落在 startAngle 方向上。官方多写作 `b 0 360 ...`（startAngle=0），
      // 此时圆心在起点正左方 r 处。
      const a0 = (startAngle * Math.PI) / 180;
      const cx = sx + r * Math.cos(a0);
      const cy = sy + r * Math.sin(a0);
      // 起始点在圆上的参数角
      const th0 = Math.atan2(sy - cy, sx - cx);
      const total = (sweep >= 0 ? 1 : -1) * 2 * Math.PI;
      Geometry._appendEllipseCubics(fig, cx, cy, r, r, 0, th0, th0 + total);
      return;
    }

    // 一般弧：圆心在弦中垂线上
    const half = (sw * Math.PI) / 360; // 半扫掠角（弧度）
    const sinHalf = Math.sin(half);
    if (Math.abs(sinHalf) < 1e-9) {
      fig.add(PathSegment.Line(ex, ey));
      return;
    }
    const r = chord / (2 * Math.abs(sinHalf));
    // 弦中点
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    // 弦方向单位向量与法向
    const ux = dx / chord;
    const uy = dy / chord;
    // 圆心偏移量 h = d / tan(|sweep|/2)，沿法向，符号由扫掠方向决定
    const h = (chord / 2) / Math.tan(half);
    const sign = sw >= 0 ? 1 : -1;
    const cx = mx - sign * h * -uy;
    const cy = my - sign * h * ux;
    const th0 = Math.atan2(sy - cy, sx - cx);
    const th1 = Math.atan2(ey - cy, ex - cx);
    // 选取与扫掠方向一致的终点角
    let delta = th1 - th0;
    if (sign > 0) { while (delta <= 0) delta += 2 * Math.PI; }
    else { while (delta >= 0) delta -= 2 * Math.PI; }
    Geometry._appendEllipseCubics(fig, cx, cy, r, r, 0, th0, th0 + delta);
  }

  /** 沿椭圆（圆心 cx,cy，半径 rx,ry，旋转 rot）从 th0 到 th1 输出三次贝塞尔 */
  private static _appendEllipseCubics(fig: PathFigure, cx: number, cy: number, rx: number, ry: number, rot: number, th0: number, th1: number): void {
    const delta = th1 - th0;
    const parts = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
    const step = delta / parts;
    const k = (4 / 3) * Math.tan(step / 4);
    const cosR = Math.cos((rot * Math.PI) / 180);
    const sinR = Math.sin((rot * Math.PI) / 180);
    const pt = (th: number): Point => {
      const ex = rx * Math.cos(th);
      const ey = ry * Math.sin(th);
      return new Point(cx + ex * cosR - ey * sinR, cy + ex * sinR + ey * cosR);
    };
    const dv = (th: number): Point => {
      const ex = -rx * Math.sin(th);
      const ey = ry * Math.cos(th);
      return new Point(ex * cosR - ey * sinR, ex * sinR + ey * cosR);
    };
    let th = th0;
    for (let i = 0; i < parts; i++) {
      const th2 = th + step;
      const p1 = pt(th);
      const d1 = dv(th);
      const p2 = pt(th2);
      const d2 = dv(th2);
      fig.add(PathSegment.CubicBezier(
        p2.x, p2.y,
        p1.x + k * d1.x, p1.y + k * d1.y,
        p2.x - k * d2.x, p2.y - k * d2.y));
      th = th2;
    }
  }

  private static _arcToCubics(sx: number, sy: number, seg: PathSegment): number[][] {
    const x2 = seg.endX;
    const y2 = seg.endY;
    let rx = Math.abs(seg.radiusX);
    let ry = Math.abs(seg.radiusY);
    if (rx === 0 || ry === 0 || (sx === x2 && sy === y2)) {
      return [[sx, sy, sx, sy, x2, sy, x2, y2]];
    }
    const phi = (seg.xAxisRotation * Math.PI) / 180;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const dx = (sx - x2) / 2;
    const dy = (sy - y2) / 2;
    const x1p = cosPhi * dx + sinPhi * dy;
    const y1p = -sinPhi * dx + cosPhi * dy;
    const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
    if (lambda > 1) {
      const s = Math.sqrt(lambda);
      rx *= s;
      ry *= s;
    }
    const sign = seg.largeArc !== seg.clockwise ? 1 : -1;
    const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
    const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
    const coef = den === 0 ? 0 : sign * Math.sqrt(Math.max(0, num / den));
    const cxp = (coef * rx * y1p) / ry;
    const cyp = (coef * -ry * x1p) / rx;
    const cx = cosPhi * cxp - sinPhi * cyp + (sx + x2) / 2;
    const cy = sinPhi * cxp + cosPhi * cyp + (sy + y2) / 2;
    const ux = (x1p - cxp) / rx;
    const uy = (y1p - cyp) / ry;
    const vx = (-x1p - cxp) / rx;
    const vy = (-y1p - cyp) / ry;
    const theta1 = Geometry._vecAngle(1, 0, ux, uy);
    let delta = Geometry._vecAngle(ux, uy, vx, vy);
    if (!seg.clockwise && delta > 0) delta -= 2 * Math.PI;
    if (seg.clockwise && delta < 0) delta += 2 * Math.PI;
    const parts = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
    const step = delta / parts;
    const k = (4 / 3) * Math.tan(step / 4);
    const out: number[][] = [];
    let th = theta1;
    let px = sx;
    let py = sy;
    for (let i = 0; i < parts; i++) {
      const th2 = th + step;
      const c1x = cx + rx * Math.cos(th) - k * ry * Math.sin(th);
      const c1y = cy + ry * Math.sin(th) + k * rx * Math.cos(th);
      const ex = cx + rx * Math.cos(th2);
      const ey = cy + ry * Math.sin(th2);
      const c2x = cx + rx * Math.cos(th2) + k * ry * Math.sin(th2);
      const c2y = cy + ry * Math.sin(th2) - k * rx * Math.cos(th2);
      out.push([px, py, c1x, c1y, c2x, c2y, ex, ey]);
      px = ex;
      py = ey;
      th = th2;
    }
    if (out.length > 0) {
      const last = out[out.length - 1];
      last[6] = x2;
      last[7] = y2;
    }
    return out;
  }

  private static _vecAngle(ux: number, uy: number, vx: number, vy: number): number {
    const dot = ux * vx + uy * vy;
    const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
    if (len === 0) return 0;
    let ang = Math.acos(Math.max(-1, Math.min(1, dot / len)));
    if (ux * vy - uy * vx < 0) ang = -ang;
    return ang;
  }

  /** 官方 Geometry.getPointAlongPath：路径上比例处的点 */
  getPointAlongPath(fraction: number, result?: Point): Point {
    let f = fraction;
    if (f < 0) f = 0;
    else if (f > 1) f = 1;
    const res = result === undefined ? new Point() : result;
    if (this._type === GeometryTypeLine) {
      res.x = this._startX + f * (this._endX - this._startX);
      res.y = this._startY + f * (this._endY - this._startY);
      return res;
    }
    const segs = this.flattenedSegments;
    const lens = this.flattenedLengths;
    const total = this.flattenedTotalLength;
    const target = total * f;
    let acc = 0;
    for (let h = 0; h < segs.length; h++) {
      const ls = lens[h];
      const pts = segs[h];
      for (let i = 0; i < ls.length; i++) {
        const len = ls[i];
        if (acc + len >= target) {
          const d = target - acc;
          const t = len === 0 ? 0 : d / len;
          const x0 = pts[i * 2];
          const y0 = pts[i * 2 + 1];
          const x1 = pts[i * 2 + 2];
          const y1 = pts[i * 2 + 3];
          res.x = x0 + (x1 - x0) * t;
          res.y = y0 + (y1 - y0) * t;
          return res;
        }
        acc += len;
      }
    }
    return res;
  }

  /** 官方 Geometry.getAngleAlongPath：路径上比例处的切线角 */
  getAngleAlongPath(fraction: number): number {
    let f = fraction;
    if (f < 0) f = 0;
    else if (f > 1) f = 1;
    if (this._type === GeometryTypeLine) {
      return (Math.atan2(this._endY - this._startY, this._endX - this._startX) * 180) / Math.PI;
    }
    const segs = this.flattenedSegments;
    const lens = this.flattenedLengths;
    const target = this.flattenedTotalLength * f;
    let acc = 0;
    for (let h = 0; h < segs.length; h++) {
      const ls = lens[h];
      const pts = segs[h];
      for (let i = 0; i < ls.length; i++) {
        const len = ls[i];
        if (acc + len >= target) {
          const x0 = pts[i * 2];
          const y0 = pts[i * 2 + 1];
          const x1 = pts[i * 2 + 2];
          const y1 = pts[i * 2 + 3];
          return Geometry._angleOf(x0, y0, x1, y1);
        }
        acc += len;
      }
    }
    return NaN;
  }

  /** 官方 Geometry.getPointAndAngleAlongPath：[x, y, angle] */
  getPointAndAngleAlongPath(fraction: number, result?: number[]): number[] {
    let f = fraction;
    if (f < 0) f = 0;
    else if (f > 1) f = 1;
    const res = result === undefined ? [] : result;
    res.length = 3;
    if (this._type === GeometryTypeLine) {
      res[0] = this._startX + f * (this._endX - this._startX);
      res[1] = this._startY + f * (this._endY - this._startY);
      res[2] = (Math.atan2(this._endY - this._startY, this._endX - this._startX) * 180) / Math.PI;
      return res;
    }
    const segs = this.flattenedSegments;
    const lens = this.flattenedLengths;
    const target = this.flattenedTotalLength * f;
    let acc = 0;
    for (let h = 0; h < segs.length; h++) {
      const ls = lens[h];
      const pts = segs[h];
      for (let i = 0; i < ls.length; i++) {
        const len = ls[i];
        if (acc + len >= target) {
          const d = target - acc;
          const t = len === 0 ? 0 : d / len;
          const x0 = pts[i * 2];
          const y0 = pts[i * 2 + 1];
          const x1 = pts[i * 2 + 2];
          const y1 = pts[i * 2 + 3];
          res[0] = x0 + (x1 - x0) * t;
          res[1] = y0 + (y1 - y0) * t;
          res[2] = Geometry._angleOf(x0, y0, x1, y1);
          return res;
        }
        acc += len;
      }
    }
    return res;
  }

  private static _angleOf(x0: number, y0: number, x1: number, y1: number): number {
    if (Math.abs(x1 - x0) < 1 && Math.abs(y1 - y0) < 1) return 0;
    if (Math.abs(x1 - x0) < 1) return y1 - y0 >= 0 ? 90 : 270;
    if (Math.abs(y1 - y0) < 1) return x1 - x0 >= 0 ? 0 : 180;
    return (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  }

  /** 官方 Geometry.getFractionForPoint：点在路径上的比例 */
  getFractionForPoint(pt: Point): number {
    if (this._type === GeometryTypeLine) {
      const x0 = this._startX;
      const y0 = this._startY;
      const x1 = this._endX;
      const y1 = this._endY;
      if (x0 === x1 && y0 === y1) return 0;
      if (x0 === x1) {
        const lo = Math.min(y0, y1);
        const hi = Math.max(y0, y1);
        if (pt.y <= lo) return lo === y0 ? 0 : 1;
        if (pt.y >= hi) return hi === y0 ? 0 : 1;
        return Math.abs(pt.y - y0) / (hi - lo);
      }
      if (y0 === y1) {
        const lo = Math.min(x0, x1);
        const hi = Math.max(x0, x1);
        if (pt.x <= lo) return lo === x0 ? 0 : 1;
        if (pt.x >= hi) return hi === x0 ? 0 : 1;
        return Math.abs(pt.x - x0) / (hi - lo);
      }
      const a = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
      const proj = Geometry._projectOnSegment(x0, y0, x1, y1, pt.x, pt.y);
      return Math.sqrt(((proj[0] - pt.x) * (proj[0] - pt.x) + (proj[1] - pt.y) * (proj[1] - pt.y)) / a);
    }
    if (this._type === GeometryTypeRectangle) {
      const x0 = this._startX;
      const y0 = this._startY;
      const x1 = this._endX;
      const y1 = this._endY;
      if (x0 === x1 && y0 === y1) return 0;
      const w = x1 - x0;
      const h = y1 - y0;
      const perim = w * 2 + h * 2;
      const cx = Math.min(Math.max(pt.x, x0), x1);
      const cy = Math.min(Math.max(pt.y, y0), y1);
      const dl = Math.abs(cx - x0);
      const dr = Math.abs(cx - x1);
      const dt = Math.abs(cy - y0);
      const db = Math.abs(cy - y1);
      const m = Math.min(dl, dr, dt, db);
      if (m === dt) return cx / perim;
      if (m === dr) return (w + cy) / perim;
      if (m === db) return (w * 2 + h - cx) / perim;
      if (m === dl) return (w * 2 + h * 2 - cy) / perim;
      return 0;
    }
    const segs = this.flattenedSegments;
    const lens = this.flattenedLengths;
    const total = this.flattenedTotalLength;
    let bestDist = Infinity;
    let bestAcc = 0;
    let acc = 0;
    for (let h = 0; h < segs.length; h++) {
      const ls = lens[h];
      const pts = segs[h];
      let ax = pts[0];
      let ay = pts[1];
      for (let i = 0; i < pts.length; i += 2) {
        const bx = pts[i];
        const by = pts[i + 1];
        if (i !== 0) {
          const proj = Geometry._projectOnSegment(ax, ay, bx, by, pt.x, pt.y);
          const d = (proj[0] - pt.x) * (proj[0] - pt.x) + (proj[1] - pt.y) * (proj[1] - pt.y);
          if (d < bestDist) {
            bestDist = d;
            bestAcc = acc + Math.sqrt((proj[0] - ax) * (proj[0] - ax) + (proj[1] - ay) * (proj[1] - ay));
          }
          acc += ls[(i - 2) / 2];
        }
        ax = bx;
        ay = by;
      }
    }
    if (!isFinite(total) || total === 0) return 0;
    const frac = bestAcc / total;
    if (frac < 0) return 0;
    if (frac > 1) return 1;
    return frac;
  }

  private static _projectOnSegment(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    px: number,
    py: number
  ): number[] {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return [x0, y0];
    let t = ((px - x0) * dx + (py - y0) * dy) / len2;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    return [x0 + t * dx, y0 + t * dy];
  }

  /** 官方 Geometry.polygonClosestSegment：Path 上最近的直线段 */
  polygonClosestSegment(
    pt: Point,
    dist?: number
  ): { figi: number; segi: number; ax: number; ay: number; bx: number; by: number } | null {
    const d = dist === undefined ? 10 : dist;
    if (this._type !== GeometryTypePath) return null;
    let best = Infinity;
    let figi = 0;
    let segi = 0;
    let ax = 0;
    let ay = 0;
    let bx = 0;
    let by = 0;
    let l = 0;
    this._figures.each((fig: PathFigure) => {
      let mx = fig.startX;
      let my = fig.startY;
      let h = 0;
      fig.segments.each((seg: PathSegment) => {
        const nx = seg.endX;
        const ny = seg.endY;
        let b = 0;
        if (seg.type._name === 'Line') {
          b = Point.distanceLineSegmentSquared(pt.x, pt.y, mx, my, nx, ny);
        } else {
          mx = seg.endX;
          my = seg.endY;
          h++;
          return;
        }
        if (b < best) {
          best = b;
          figi = l;
          segi = h;
          ax = mx;
          ay = my;
          bx = nx;
          by = ny;
        }
        mx = nx;
        my = ny;
        h++;
        if (seg.isClosed) {
          const sx = fig.startX;
          const sy = fig.startY;
          b = Point.distanceLineSegmentSquared(pt.x, pt.y, mx, my, sx, sy);
          if (b < best) {
            best = b;
            figi = l;
            segi = h;
            ax = mx;
            ay = my;
            bx = sx;
            by = sy;
          }
          h++;
        }
      });
      l++;
    });
    if (best < d * d) return { figi, segi, ax, ay, bx, by };
    return null;
  }

  /** 官方 Geometry.polygonArea：填充图形的多边形面积 */
  get polygonArea(): number {
    if (this._type === GeometryTypePath) {
      const it = this._figures.iterator;
      let sum = 0;
      while (it.next()) {
        const fig = it.value;
        if (!fig.isFilled) continue;
        let x = fig.startX;
        let y = fig.startY;
        const sit = fig.segments.iterator;
        while (sit.next()) {
          const seg = sit.value;
          const name = seg.type._name;
          const ex = seg.endX;
          const ey = seg.endY;
          if (name !== 'MoveTo' && name !== 'Close') sum += x * ey - y * ex;
          x = ex;
          y = ey;
        }
        sum += x * fig.startY - y * fig.startX;
      }
      return Math.abs(sum) / 2;
    }
    if (this._type === GeometryTypeRectangle) {
      return Math.abs(this._endX - this._startX) * Math.abs(this._endY - this._startY);
    }
    if (this._type === GeometryTypeEllipse) {
      const rx = Math.abs(this._endX - this._startX) / 2;
      const ry = Math.abs(this._endY - this._startY) / 2;
      return Math.PI * rx * ry;
    }
    return 0;
  }

  /** 官方 Geometry.polygonLength：把曲线当直线的总长 */
  get polygonLength(): number {
    if (this._type === GeometryTypePath) {
      const it = this._figures.iterator;
      let sum = 0;
      while (it.next()) {
        const fig = it.value;
        let x = fig.startX;
        let y = fig.startY;
        const sit = fig.segments.iterator;
        while (sit.next()) {
          const seg = sit.value;
          const name = seg.type._name;
          const ex = seg.endX;
          const ey = seg.endY;
          if (name !== 'MoveTo' && name !== 'Close') {
            sum += Math.sqrt((ex - x) * (ex - x) + (ey - y) * (ey - y));
          }
          x = ex;
          y = ey;
        }
        const last = fig.segments.last();
        if (last !== null && last.isClosed) {
          sum += Math.sqrt(
            (fig.startX - x) * (fig.startX - x) + (fig.startY - y) * (fig.startY - y)
          );
        }
      }
      return sum;
    }
    if (this._type === GeometryTypeRectangle) {
      return Math.abs(this._endX - this._startX) * 2 + Math.abs(this._endY - this._startY) * 2;
    }
    if (this._type === GeometryTypeEllipse) {
      const a = Math.abs(this._endX - this._startX) / 2;
      const b = Math.abs(this._endY - this._startY) / 2;
      if (a + b === 0) return 0;
      const h = ((a - b) * (a - b)) / ((a + b) * (a + b));
      let p = h;
      let s = 1 + p / 4;
      p *= h;
      s += p / 64;
      p *= h;
      s += p / 256;
      p *= h;
      s += (p * 25) / 16384;
      p *= h;
      s += (p * 49) / 65536;
      p *= h;
      s += (p * 441) / 1048576;
      return Math.PI * (a + b) * s;
    }
    return Math.sqrt(
      (this._endX - this._startX) * (this._endX - this._startX) +
        (this._endY - this._startY) * (this._endY - this._startY)
    );
  }

  // ============ 官方 Geometry 静态成员（阶段 5） ============

  /** @deprecated 用 GeometryType.Line（本项目取值为 EnumValue 而非官方的 1） */
  static readonly Line: EnumValue = GeometryTypeLine;
  /** @deprecated 用 GeometryType.Rectangle */
  static readonly Rectangle: EnumValue = GeometryTypeRectangle;
  /** @deprecated 用 GeometryType.Ellipse */
  static readonly Ellipse: EnumValue = GeometryTypeEllipse;
  /** @deprecated 用 GeometryType.Path */
  static readonly Path: EnumValue = GeometryTypePath;

  /** 官方 Geometry.stringifyFixed：返回固定小数位的反向转换器 */
  static stringifyFixed(digits: number): (val: Geometry) => string {
    return (val: Geometry): string => val.toString(digits);
  }

  /** 官方 Geometry.fillPath：给每个未填充的子路径补 F 标记 */
  static fillPath(str: string): string {
    if (typeof str !== 'string') throw new Error('Geometry.fillPath:str must be a string');
    const parts = str.split(/[Xx]/);
    const n = parts.length;
    let out = '';
    for (let i = 0; i < n; i++) {
      const part = parts[i];
      if (part.match(/[Ff]/) !== null) {
        out += i === 0 ? part : 'X' + (part.charAt(0) === ' ' ? '' : ' ') + part;
        continue;
      }
      out += (i === 0 ? '' : 'X ') + 'F' + (part.charAt(0) === ' ' ? '' : ' ') + part;
    }
    return out;
  }

  /** 官方 Geometry.computeConvexHull：Andrew 单调链 */
  static computeConvexHull(pts: Point[]): Point[] {
    const sorted = pts.slice();
    sorted.sort((a, b) => (a.x === b.x ? b.y - a.y : b.x - a.x));
    const lower: Point[] = [];
    for (let i = 0; i < sorted.length; i++) {
      while (
        lower.length >= 2 &&
        sorted[i].compareWithLineSegmentPoint(lower[lower.length - 2], lower[lower.length - 1]) >= 0
      ) {
        lower.pop();
      }
      lower.push(sorted[i]);
    }
    lower.pop();
    const upper: Point[] = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      while (
        upper.length >= 2 &&
        sorted[i].compareWithLineSegmentPoint(upper[upper.length - 2], upper[upper.length - 1]) >= 0
      ) {
        upper.pop();
      }
      upper.push(sorted[i]);
    }
    upper.pop();
    return lower.concat(upper);
  }

  /** 官方 Geometry.generatePolygon：由点集生成多边形/折线 Geometry */
  static generatePolygon(arr: Point[], corner?: number, closed?: boolean): Geometry {
    const radius = corner === undefined ? 0 : corner;
    const isClosed = closed === undefined ? true : closed;
    const geo = new Geometry();
    if (arr.length > 1) {
      if (radius > 0) {
        if (isClosed) {
          const pts = arr.slice();
          pts.push(arr[0]);
          pts.push(arr[1]);
          let first = true;
          const fig = new PathFigure(0, 0, isClosed);
          for (let i = 1; i < pts.length; i++) {
            const mx = (pts[i - 1].x + pts[i].x) / 2;
            const my = (pts[i - 1].y + pts[i].y) / 2;
            const c = pts[i - 1].distanceSquaredPoint(pts[i]);
            const f = (0.5 * radius) / Math.sqrt(c);
            if (f < 0.5) {
              const ix = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f;
              const iy = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f;
              if (first) {
                first = false;
                fig.startX = ix;
                fig.startY = iy;
              } else {
                fig.add(PathSegment.CubicBezier(ix, iy, pts[i - 1].x, pts[i - 1].y, pts[i - 1].x, pts[i - 1].y));
              }
              if (i < pts.length - 1) {
                const ox = pts[i].x + (pts[i - 1].x - pts[i].x) * f;
                const oy = pts[i].y + (pts[i - 1].y - pts[i].y) * f;
                fig.add(PathSegment.Line(ox, oy));
              }
            } else if (first) {
              first = false;
              fig.startX = mx;
              fig.startY = my;
            } else {
              fig.add(PathSegment.CubicBezier(mx, my, pts[i - 1].x, pts[i - 1].y, pts[i - 1].x, pts[i - 1].y));
            }
          }
          const lastSeg = fig.segments.last();
          if (lastSeg !== null) lastSeg.close();
          geo.add(fig);
        } else {
          const fig = new PathFigure(arr[0].x, arr[0].y, false);
          for (let i = 1; i < arr.length; i++) {
            const mx = (arr[i - 1].x + arr[i].x) / 2;
            const my = (arr[i - 1].y + arr[i].y) / 2;
            const c = arr[i - 1].distanceSquaredPoint(arr[i]);
            const f = (0.5 * radius) / Math.sqrt(c);
            if (f < 0.5) {
              if (i > 1) {
                const ix = arr[i - 1].x + (arr[i].x - arr[i - 1].x) * f;
                const iy = arr[i - 1].y + (arr[i].y - arr[i - 1].y) * f;
                fig.add(PathSegment.CubicBezier(ix, iy, arr[i - 1].x, arr[i - 1].y, arr[i - 1].x, arr[i - 1].y));
              }
              const ox = arr[i].x + (arr[i - 1].x - arr[i].x) * f;
              const oy = arr[i].y + (arr[i - 1].y - arr[i].y) * f;
              fig.add(PathSegment.Line(ox, oy));
            } else if (i > 1) {
              fig.add(PathSegment.CubicBezier(mx, my, arr[i - 1].x, arr[i - 1].y, arr[i - 1].x, arr[i - 1].y));
            }
            if (i === arr.length - 1) fig.add(PathSegment.Line(arr[i].x, arr[i].y));
          }
          geo.add(fig);
        }
      } else {
        const fig = new PathFigure(arr[0].x, arr[0].y, isClosed);
        for (let i = 1; i < arr.length; i++) {
          fig.add(PathSegment.Line(arr[i].x, arr[i].y));
        }
        if (isClosed) {
          const lastSeg = fig.segments.last();
          if (lastSeg !== null) lastSeg.close();
        }
        geo.add(fig);
      }
    } else if (arr.length === 1) {
      geo.add(new PathFigure(arr[0].x, arr[0].y, isClosed));
    }
    return geo;
  }

}
