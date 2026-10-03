import { EnumValue, PathSegmentLine, PathSegmentQuadraticBezier, PathSegmentCubicBezier, PathSegmentArc, PathSegmentMoveTo, PathSegmentClose } from './EnumValues';

/**
 * PathSegment - 路径段
 */
export class PathSegment {
  static readonly className: string = "PathSegment";
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
  /**
   * 官方「按角度」圆弧参数（`PathSegment(SegmentType.Arc, startAngle, sweepAngle, centerX, centerY, radiusX, radiusY)`）。
   * 官方对 Arc 段复用同一批存储：endX→startAngle、endY→sweepAngle、
   * point1X→centerX、point1Y→centerY、point2X→radiusX、point2Y→radiusY。
   * startAngle 为 NaN 表示不是这种用法（此时 endX/endY 仍是 SVG 弧的终点）。
   */
  public startAngle: number;
  public sweepAngle: number;
  public centerX: number;
  public centerY: number;
  /** 「按角度」圆弧的几何终点（由 center/radius/startAngle+sweepAngle 推出）。
   *  官方没有这个字段：它保留 endX/endY 为角度值，需要终点的场合（如 Close 段）用 Eo 采样结果。 */
  public arcEndX: number;
  public arcEndY: number;
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
    if (type && type._name === 'Bezier') type = PathSegmentCubicBezier;
    else if (type && type._name === 'Move') type = PathSegmentMoveTo;
    this.type = type;
    this.endX = endX;
    this.endY = endY;
    this.arcEndX = NaN;
    this.arcEndY = NaN;
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
    this.startAngle = NaN;
    this.sweepAngle = 0;
    this.centerX = NaN;
    this.centerY = NaN;
    this.isRelative = false;

    // 官方 Arc 段的「按角度」构造形式：
    //   new PathSegment(SegmentType.Arc, startAngle, sweepAngle, centerX, centerY, radiusX, radiusY)
    // 本项目内部的 SVG 弧走 PathSegment.Arc() 静态方法（只传 endX/endY，x1..y2 保持 NaN），
    // 因此识别条件放在 x2 上（见下方判断）。
    // 官方构造器把可选数值参数一律缺省为 0，所以 6 参形式
    // `new PathSegment(SegmentType.Arc, a0, sweep, cx, cy, rx)` 的 radiusY 就是 0（不是 NaN）。
    // 因此识别条件放在 x2 上：给了 x2 就是「按角度」形式；PathSegment.Arc() 静态方法
    // 只传 endX/endY，x1..y2 全为 NaN，仍走 SVG 弧分支。
    if (type === PathSegmentArc &&
      !isNaN(x1) && !isNaN(y1) && !isNaN(x2)) {
      this.startAngle = endX;
      this.sweepAngle = endY;
      this.centerX = x1;
      this.centerY = y1;
      this.radiusX = x2;
      this.radiusY = isNaN(y2) ? 0 : y2; // 官方缺省为 0
      if (isNaN(y2)) this.y2 = 0; // 同上：point2Y 也要与官方一致读到 0
      // 官方在 endX/endY 里存的就是 startAngle/sweepAngle（不是几何终点）——
      // 它的渲染器算圆弧只看 center/radius/startAngle/sweepAngle，Eo() 采样自己算终点。
      // 我们额外存一份真实终点（arcEndX/arcEndY），供渲染器沿路径推进当前点。
      const a1 = ((this.startAngle + this.sweepAngle) * Math.PI) / 180;
      this.arcEndX = this.centerX + this.radiusX * Math.cos(a1);
      this.arcEndY = this.centerY + this.radiusY * Math.sin(a1);
    }
  }

  /** 官方命名：第一个控制点 X（内部存储字段为 x1） */
  get point1X(): number { return this.x1; }
  set point1X(val: number) { this.x1 = val; }
  /** 官方命名：第一个控制点 Y（内部存储字段为 y1） */
  get point1Y(): number { return this.y1; }
  set point1Y(val: number) { this.y1 = val; }
  /** 官方命名：第二个控制点 X（内部存储字段为 x2） */
  get point2X(): number { return this.x2; }
  set point2X(val: number) { this.x2 = val; }
  /** 官方命名：第二个控制点 Y（内部存储字段为 y2） */
  get point2Y(): number { return this.y2; }
  set point2Y(val: number) { this.y2 = val; }

  copy(): PathSegment {
    const seg = new PathSegment(this.type, this.endX, this.endY, this.x1, this.y1, this.x2, this.y2);
    seg.isClosed = this.isClosed;
    seg.radiusX = this.radiusX;
    seg.radiusY = this.radiusY;
    seg.xAxisRotation = this.xAxisRotation;
    seg.largeArc = this.largeArc;
    seg.clockwise = this.clockwise;
    seg.startAngle = this.startAngle;
    seg.sweepAngle = this.sweepAngle;
    seg.centerX = this.centerX;
    seg.centerY = this.centerY;
    seg.arcEndX = this.arcEndX;
    seg.arcEndY = this.arcEndY;
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

  /**
   * 官方 4.0 的「按角度」圆弧段：`PathFigure` 里就是这种单条 Arc 表示整圆/圆弧
   * （例如箭头 Circle = 一条 Arc: center(4,4) r(4,4) startAngle 0 sweepAngle 360，
   * 包围盒 [0,0,8,8]），不是用三次贝塞尔去近似。
   */
  static AngleArc(
    centerX: number, centerY: number,
    radiusX: number, radiusY: number,
    startAngle: number, sweepAngle: number
  ): PathSegment {
    const endAngle = startAngle + sweepAngle;
    const seg = new PathSegment(PathSegmentArc, 0, endAngle);
    seg.centerX = centerX;
    seg.centerY = centerY;
    seg.radiusX = radiusX;
    seg.radiusY = radiusY;
    seg.startAngle = startAngle;
    seg.sweepAngle = sweepAngle;
    // 角度制的端点，供不需要反解椭圆的消费方使用
    seg.endX = centerX + radiusX * Math.cos(endAngle * Math.PI / 180);
    seg.endY = centerY + radiusY * Math.sin(endAngle * Math.PI / 180);
    return seg;
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
