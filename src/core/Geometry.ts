import { PathFigure } from './PathFigure';
import { PathSegment } from './PathSegment';
import { List } from './List';
import { Rect } from './Rect';

/**
 * Geometry - 几何路径定义
 */
export class Geometry {
  /** 图形集合 */
  private _figures: List<PathFigure>;
  /** 默认图形 */
  private _defaultFigure: PathFigure;
  /** 边界矩形 */
  private _bounds: Rect | null = null;
  /** 是否包含奇偶填充 */
  public fillRule: string = 'evenodd';
  /** 图形名称（用于 figure 属性） */
  public name: string = '';

  constructor(figures?: PathFigure | PathFigure[]) {
    this._figures = new List<PathFigure>();
    this._defaultFigure = new PathFigure();
    if (figures) {
      if (Array.isArray(figures)) {
        for (const fig of figures) {
          this.add(fig);
        }
      } else {
        this.add(figures);
      }
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

  /** 获取边界矩形 */
  get bounds(): Rect {
    if (this._bounds === null) {
      this._bounds = this.computeBounds();
    }
    return this._bounds;
  }

  /** 计算边界矩形 */
  private computeBounds(): Rect {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    const it = this._figures.iterator;
    while (it.next()) {
      const fig = it.value;
      // 起点
      minX = Math.min(minX, fig.startX);
      minY = Math.min(minY, fig.startY);
      maxX = Math.max(maxX, fig.startX);
      maxY = Math.max(maxY, fig.startY);

      // 段
      const segIt = fig.segments.iterator;
      while (segIt.next()) {
        const seg = segIt.value;
        if (seg.type._name === 'Close') continue;
        minX = Math.min(minX, seg.endX);
        minY = Math.min(minY, seg.endY);
        maxX = Math.max(maxX, seg.endX);
        maxY = Math.max(maxY, seg.endY);
        if (!isNaN(seg.x1)) {
          minX = Math.min(minX, seg.x1);
          minY = Math.min(minY, seg.y1);
          maxX = Math.max(maxX, seg.x1);
          maxY = Math.max(maxY, seg.y1);
        }
        if (!isNaN(seg.x2)) {
          minX = Math.min(minX, seg.x2);
          minY = Math.min(minY, seg.y2);
          maxX = Math.max(maxX, seg.x2);
          maxY = Math.max(maxY, seg.y2);
        }
      }
    }

    if (!isFinite(minX)) {
      return new Rect(0, 0, 0, 0);
    }
    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  copy(): Geometry {
    const geo = new Geometry();
    geo.fillRule = this.fillRule;
    geo.name = this.name;
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

    // 简化的 SVG 路径解析
    const commands = str.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);
    if (!commands) return geo;

    let curX = 0, curY = 0;

    for (const cmd of commands) {
      const type = cmd[0];
      const args = cmd.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));

      switch (type) {
        case 'M':
          curX = args[0]; curY = args[1];
          fig.startX = curX; fig.startY = curY;
          for (let i = 2; i < args.length; i += 2) {
            curX = args[i]; curY = args[i + 1];
            fig.add(PathSegment.Line(curX, curY));
          }
          break;
        case 'm':
          curX += args[0]; curY += args[1];
          fig.startX = curX; fig.startY = curY;
          for (let i = 2; i < args.length; i += 2) {
            curX += args[i]; curY += args[i + 1];
            fig.add(PathSegment.Line(curX, curY));
          }
          break;
        case 'L':
          for (let i = 0; i < args.length; i += 2) {
            curX = args[i]; curY = args[i + 1];
            fig.add(PathSegment.Line(curX, curY));
          }
          break;
        case 'l':
          for (let i = 0; i < args.length; i += 2) {
            curX += args[i]; curY += args[i + 1];
            fig.add(PathSegment.Line(curX, curY));
          }
          break;
        case 'H':
          for (const x of args) { curX = x; fig.add(PathSegment.Line(curX, curY)); }
          break;
        case 'h':
          for (const dx of args) { curX += dx; fig.add(PathSegment.Line(curX, curY)); }
          break;
        case 'V':
          for (const y of args) { curY = y; fig.add(PathSegment.Line(curX, curY)); }
          break;
        case 'v':
          for (const dy of args) { curY += dy; fig.add(PathSegment.Line(curX, curY)); }
          break;
        case 'C':
          for (let i = 0; i < args.length; i += 6) {
            fig.add(PathSegment.CubicBezier(args[i + 4], args[i + 5], args[i], args[i + 1], args[i + 2], args[i + 3]));
            curX = args[i + 4]; curY = args[i + 5];
          }
          break;
        case 'c':
          for (let i = 0; i < args.length; i += 6) {
            fig.add(PathSegment.CubicBezier(curX + args[i + 4], curY + args[i + 5], curX + args[i], curY + args[i + 1], curX + args[i + 2], curY + args[i + 3]));
            curX += args[i + 4]; curY += args[i + 5];
          }
          break;
        case 'Q':
          for (let i = 0; i < args.length; i += 4) {
            fig.add(PathSegment.QuadraticBezier(args[i + 2], args[i + 3], args[i], args[i + 1]));
            curX = args[i + 2]; curY = args[i + 3];
          }
          break;
        case 'q':
          for (let i = 0; i < args.length; i += 4) {
            fig.add(PathSegment.QuadraticBezier(curX + args[i + 2], curY + args[i + 3], curX + args[i], curY + args[i + 1]));
            curX += args[i + 2]; curY += args[i + 3];
          }
          break;
        case 'A':
          for (let i = 0; i < args.length; i += 7) {
            fig.add(PathSegment.Arc(args[i + 5], args[i + 6], args[i], args[i + 1], args[i + 2], args[i + 3] !== 0, args[i + 4] !== 0));
            curX = args[i + 5]; curY = args[i + 6];
          }
          break;
        case 'Z':
        case 'z':
          fig.add(PathSegment.Close());
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
}
