import { EnumValue, PathSegmentLine, PathSegmentQuadraticBezier, PathSegmentCubicBezier, PathSegmentArc, PathSegmentMoveTo, PathSegmentClose } from './EnumValues';

/**
 * PathSegment - 路径段
 */
export class PathSegment {
  /** 段类型 */
  public type: EnumValue;
  /** 控制点1 X */
  public x1: number;
  /** 控制点1 Y */
  public y1: number;
  /** 控制点2 X */
  public x2: number;
  /** 控制点2 Y */
  public y2: number;
  /** 终点 X */
  public endX: number;
  /** 终点 Y */
  public endY: number;
  /** 是否为闭合段 */
  public isClosed: boolean;
  /** 圆弧参数 */
  public radiusX: number;
  public radiusY: number;
  public xAxisRotation: number;
  public largeArc: boolean;
  public clockwise: boolean;
  /** 是否为相对坐标 */
  public isRelative: boolean;

  constructor(
    type: EnumValue = PathSegmentLine,
    endX: number = 0,
    endY: number = 0,
    x1: number = NaN,
    y1: number = NaN,
    x2: number = NaN,
    y2: number = NaN
  ) {
    this.type = type;
    this.endX = endX;
    this.endY = endY;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.isClosed = false;
    this.radiusX = 0;
    this.radiusY = 0;
    this.xAxisRotation = 0;
    this.largeArc = false;
    this.clockwise = false;
    this.isRelative = false;
  }

  copy(): PathSegment {
    const seg = new PathSegment(this.type, this.endX, this.endY, this.x1, this.y1, this.x2, this.y2);
    seg.isClosed = this.isClosed;
    seg.radiusX = this.radiusX;
    seg.radiusY = this.radiusY;
    seg.xAxisRotation = this.xAxisRotation;
    seg.largeArc = this.largeArc;
    seg.clockwise = this.clockwise;
    seg.isRelative = this.isRelative;
    return seg;
  }

  equals(seg: PathSegment): boolean {
    return seg instanceof PathSegment &&
      this.type === seg.type &&
      this.endX === seg.endX && this.endY === seg.endY &&
      this.x1 === seg.x1 && this.y1 === seg.y1 &&
      this.x2 === seg.x2 && this.y2 === seg.y2;
  }

  /** 创建直线段 */
  static Line(endX: number, endY: number): PathSegment {
    return new PathSegment(PathSegmentLine, endX, endY);
  }

  /** 创建二次贝塞尔曲线段 */
  static QuadraticBezier(endX: number, endY: number, x1: number, y1: number): PathSegment {
    return new PathSegment(PathSegmentQuadraticBezier, endX, endY, x1, y1);
  }

  /** 创建三次贝塞尔曲线段 */
  static CubicBezier(endX: number, endY: number, x1: number, y1: number, x2: number, y2: number): PathSegment {
    return new PathSegment(PathSegmentCubicBezier, endX, endY, x1, y1, x2, y2);
  }

  /** 创建圆弧段 */
  static Arc(
    endX: number, endY: number,
    radiusX: number, radiusY: number,
    xAxisRotation: number = 0,
    largeArc: boolean = false,
    clockwise: boolean = false
  ): PathSegment {
    const seg = new PathSegment(PathSegmentArc, endX, endY);
    seg.radiusX = radiusX;
    seg.radiusY = radiusY;
    seg.xAxisRotation = xAxisRotation;
    seg.largeArc = largeArc;
    seg.clockwise = clockwise;
    return seg;
  }

  /** 创建移动段 */
  static MoveTo(x: number, y: number): PathSegment {
    return new PathSegment(PathSegmentMoveTo, x, y);
  }

  close(): PathSegment {
    this.isClosed = true;
    return this;
  }

  /** 创建闭合段 */
  static Close(): PathSegment {
    const seg = new PathSegment(PathSegmentClose);
    seg.isClosed = true;
    return seg;
  }
}
