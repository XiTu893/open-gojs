import { GraphObject } from './GraphObject';
import { EnumValue, BrushSolid, GeometryStretchDefault, GeometryStretchUniform, GeometryStretchNone, GeometryStretchFill, GeometryStretchUniformToFill, StretchDefault, StretchFill, StretchNone, StretchUniform, StretchUniformToFill, StretchHorizontal, StretchVertical, OrientationAlong } from '../core/EnumValues';
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

/** 官方内置箭头几何路径串（与官方 G.Nm 一致，键为箭头名） */
const ARROWHEAD_PATH_STRINGS: Record<string, string> = {
  "Standard": "F1 m 0,0 l 8,4 -8,4 2,-4 z",
  "Backward": "F1 m 8,0 l -2,4 2,4 -8,-4 z",
  "Triangle": "F1 m 0,0 l 8,4.62 -8,4.62 z",
  "BackwardTriangle": "F1 m 8,4 l 0,4 -8,-4 8,-4 0,4 z",
  "Boomerang": "F1 m 0,0 l 8,4 -8,4 4,-4 -4,-4 z",
  "BackwardBoomerang": "F1 m 8,0 l -8,4 8,4 -4,-4 4,-4 z",
  "SidewaysV": "m 0,0 l 8,4 -8,4 0,-1 6,-3 -6,-3 0,-1 z",
  "BackwardV": "m 8,0 l -8,4 8,4 0,-1 -6,-3 6,-3 0,-1 z",
  "OpenTriangle": "m 0,0 l 8,4 -8,4",
  "BackwardOpenTriangle": "m 8,0 l -8,4 8,4",
  "OpenTriangleLine": "m 0,0 l 8,4 -8,4 m 8.5,0 l 0,-8",
  "BackwardOpenTriangleLine": "m 8,0 l  -8,4 8,4 m -8.5,0 l 0,-8",
  "OpenTriangleTop": "m 0,0 l 8,4 m 0,4",
  "BackwardOpenTriangleTop": "m 8,0 l -8,4 m 0,4",
  "OpenTriangleBottom": "m 0,8 l 8,-4",
  "BackwardOpenTriangleBottom": "m 0,4 l 8,4",
  "HalfTriangleTop": "F1 m 0,0 l 0,4 8,0 z m 0,8",
  "BackwardHalfTriangleTop": "F1 m 8,0 l 0,4 -8,0 z m 0,8",
  "HalfTriangleBottom": "F1 m 0,4 l 0,4 8,-4 z",
  "BackwardHalfTriangleBottom": "F1 m 8,4 l 0,4 -8,-4 z",
  "ForwardSemiCircle": "m 4,0 b 270 180 0 4 4",
  "BackwardSemiCircle": "m 4,8 b 90 180 0 -4 4",
  "Feather": "m 0,0 l 3,4 -3,4",
  "BackwardFeather": "m 3,0 l -3,4 3,4",
  "DoubleFeathers": "m 0,0 l 3,4 -3,4 m 3,-8 l 3,4 -3,4",
  "BackwardDoubleFeathers": "m 3,0 l -3,4 3,4 m 3,-8 l -3,4 3,4",
  "TripleFeathers": "m 0,0 l 3,4 -3,4 m 3,-8 l 3,4 -3,4 m 3,-8 l 3,4 -3,4",
  "BackwardTripleFeathers": "m 3,0 l -3,4 3,4 m 3,-8 l -3,4 3,4 m 3,-8 l -3,4 3,4",
  "ForwardSlash": "m 0,8 l 5,-8",
  "BackSlash": "m 0,0 l 5,8",
  "DoubleForwardSlash": "m 0,8 l 4,-8 m -2,8 l 4,-8",
  "DoubleBackSlash": "m 0,0 l 4,8 m -2,-8 l 4,8",
  "TripleForwardSlash": "m 0,8 l 4,-8 m -2,8 l 4,-8 m -2,8 l 4,-8",
  "TripleBackSlash": "m 0,0 l 4,8 m -2,-8 l 4,8 m -2,-8 l 4,8",
  "Fork": "m 0,4 l 8,0 m -8,0 l 8,-4 m -8,4 l 8,4",
  "BackwardFork": "m 8,4 l -8,0 m 8,0 l -8,-4 m 8,4 l -8,4",
  "LineFork": "m 0,0 l 0,8 m 0,-4 l 8,0 m -8,0 l 8,-4 m -8,4 l 8,4",
  "BackwardLineFork": "m 8,4 l -8,0 m 8,0 l -8,-4 m 8,4 l -8,4 m 8,-8 l 0,8",
  "CircleFork": "F1 m 6,4 b 0 360 -3 0 3 z m 0,0 l 6,0 m -6,0 l 6,-4 m -6,4 l 6,4",
  "BackwardCircleFork": "F1 m 0,4 l 6,0 m -6,-4 l 6,4 m -6,4 l 6,-4 m 6,0 b 0 360 -3 0 3",
  "CircleLineFork": "F1 m 6,4 b 0 360 -3 0 3 z m 1,-4 l 0,8 m 0,-4 l 6,0 m -6,0 l 6,-4 m -6,4 l 6,4",
  "BackwardCircleLineFork": "F1 m 0,4 l 6,0 m -6,-4 l 6,4 m -6,4 l 6,-4 m 0,-4 l 0,8 m 7,-4 b 0 360 -3 0 3",
  "Circle": "F1 m 8,4 b 0 360 -4 0 4 z",
  "Block": "F1 m 0,0 l 0,8 8,0 0,-8 z",
  "StretchedDiamond": "F1 m 0,3 l 5,-3 5,3 -5,3 -5,-3 z",
  "Diamond": "F1 m 0,4 l 4,-4 4,4 -4,4 -4,-4 z",
  "Chevron": "F1 m 0,0 l 5,0 3,4 -3,4 -5,0 3,-4 -3,-4 z",
  "StretchedChevron": "F1 m 0,0 l 8,0 3,4 -3,4 -8,0 3,-4 -3,-4 z",
  "NormalArrow": "F1 m 0,2 l 4,0 0,-2 4,4 -4,4 0,-2 -4,0 z",
  "X": "m 0,0 l 8,8 m 0,-8 l -8,8",
  "TailedNormalArrow": "F1 m 0,0 l 2,0 1,2 3,0 0,-2 2,4 -2,4 0,-2 -3,0 -1,2 -2,0 1,-4 -1,-4 z",
  "DoubleTriangle": "F1 m 0,0 l 4,4 -4,4 0,-8 z  m 4,0 l 4,4 -4,4 0,-8 z",
  "BigEndArrow": "F1 m 0,0 l 5,2 0,-2 3,4 -3,4 0,-2 -5,2 0,-8 z",
  "ConcaveTailArrow": "F1 m 0,2 h 4 v -2 l 4,4 -4,4 v -2 h -4 l 2,-2 -2,-2 z",
  "RoundedTriangle": "F1 m 0,1 a 1,1 0 0 1 1,-1 l 7,3 a 0.5,1 0 0 1 0,2 l -7,3 a 1,1 0 0 1 -1,-1 l 0,-6 z",
  "SimpleArrow": "F1 m 1,2 l -1,-2 2,0 1,2 -1,2 -2,0 1,-2 5,0 0,-2 2,2 -2,2 0,-2 z",
  "AccelerationArrow": "F1 m 0,0 l 0,8 0.2,0 0,-8 -0.2,0 z m 2,0 l 0,8 1,0 0,-8 -1,0 z m 3,0 l 2,0 2,4 -2,4 -2,0 0,-8 z",
  "BoxArrow": "F1 m 0,0 l 4,0 0,2 2,0 0,-2 2,4 -2,4 0,-2 -2,0 0,2 -4,0 0,-8 z",
  "TriangleLine": "F1 m 8,4 l -8,-4 0,8 8,-4 z m 0.5,4 l 0,-8",
  "CircleEndedArrow": "F1 m 10,4 l -2,-3 0,2 -2,0 0,2 2,0 0,2 2,-3 z m -4,0 b 0 360 -3 0 3 z",
  "DynamicWidthArrow": "F1 m 0,3 l 2,0 2,-1 2,-2 2,4 -2,4 -2,-2 -2,-1 -2,0 0,-2 z",
  "EquilibriumArrow": "m 0,3 l 8,0 -3,-3 m 3,5 l -8,0 3,3",
  "FastForward": "F1 m 0,0 l 3.5,4 0,-4 3.5,4 0,-4 1,0 0,8 -1,0 0,-4 -3.5,4 0,-4 -3.5,4 0,-8 z",
  "Kite": "F1 m 0,4 l 2,-4 6,4 -6,4 -2,-4 z",
  "HalfArrowTop": "F1 m 0,0 l 4,4 4,0 -8,-4 z m 0,8",
  "HalfArrowBottom": "F1 m 0,8 l 4,-4 4,0 -8,4 z",
  "OpposingDirectionDoubleArrow": "F1 m 0,4 l 2,-4 0,2 4,0 0,-2 2,4 -2,4 0,-2 -4,0 0,2 -2,-4 z",
  "PartialDoubleTriangle": "F1 m 0,0 4,3 0,-3 4,4 -4,4 0,-3 -4,3 0,-8 z",
  "LineCircle": "F1 m 0,0 l 0,8 m 7 -4 b 0 360 -3 0 3 z",
  "DoubleLineCircle": "F1 m 0,0 l 0,8 m 2,-8 l 0,8 m 7 -4 b 0 360 -3 0 3 z",
  "TripleLineCircle": "F1 m 0,0 l 0,8 m 2,-8 l 0,8 m 2,-8 l 0,8 m 7 -4 b 0 360 -3 0 3 z",
  "CircleLine": "F1 m 6 4 b 0 360 -3 0 3 z m 1,-4 l 0,8",
  "DiamondCircle": "F1 m 8,4 l -4,4 -4,-4 4,-4 4,4 m 8,0 b 0 360 -4 0 4 z",
  "PlusCircle": "F1 m 8,4 b 0 360 -4 0 4 l -8 0 z m -4 -4 l 0 8",
  "OpenRightTriangleTop": "m 8,0 l 0,4 -8,0 m 0,4",
  "OpenRightTriangleBottom": "m 8,8 l 0,-4 -8,0",
  "Line": "m 0,0 l 0,8",
  "DoubleLine": "m 0,0 l 0,8 m 2,0 l 0,-8",
  "TripleLine": "m 0,0 l 0,8 m 2,0 l 0,-8 m 2,0 l 0,8",
  "PentagonArrow": "F1 m 8,4 l -4,-4 -4,0 0,8 4,0 4,-4 z",
};

/**
 * Shape - 几何图形
 * 表示一个几何形状，支持预定义图形和自定义几何路径
 */
export class Shape extends GraphObject {
  static readonly className: string = "Shape";

  static GeometryStretchUniform: EnumValue = GeometryStretchUniform;
  static GeometryStretchNone: EnumValue = GeometryStretchNone;
  static GeometryStretchFill: EnumValue = GeometryStretchFill;
  static GeometryStretchUniformToFill: EnumValue = GeometryStretchUniformToFill;

  // ============ Shape-specific properties ============
  private _fill: BrushLike = 'black';
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
  private _strokeMiterLimit: number = 10;
  private _pathPattern: GraphObject | null = null;
  private _isGeometryPositioned: boolean = false;
  // 官方 Shape.dt：按内容尺寸缩放后的几何；_scaledFrom 是它源自的 raw geometry（官方 rn）
  private _scaledGeometry: Geometry | null = null;
  private _scaledFrom: Geometry | null = null;
  // geometryString 的惰性解析缓存（保证 geometry getter 对象身份稳定，供 _scaledFrom 比对）
  private _parsedGeometryString: string = '';
  private _parsedGeometry: Geometry | null = null;

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
  set strokeDashArray(val: number[] | null) {
    if (this._strokeDashArray !== val) {
      this._strokeDashArray = val;
      this._invalidateMeasure();
    }
  }

  get strokeDashOffset(): number { return this._strokeDashOffset; }
  set strokeDashOffset(val: number) {
    if (this._strokeDashOffset !== val) {
      this._strokeDashOffset = val;
      // 官方 Shape 画笔属性 setter 会失效 paint/measure，触发重绘。
      // 漏掉它：belts 的传送带动画每帧改 strokeDashOffset，但 Shape 永不重绘，
      // 皮带静止（`_renderLoop` 只在 measure 失效时重画该 part）。
      this._invalidateMeasure();
    }
  }

  get strokeCap(): string { return this._strokeCap; }
  set strokeCap(val: string) { this._strokeCap = val; }

  get strokeJoin(): string { return this._strokeJoin; }
  set strokeJoin(val: string) { this._strokeJoin = val; }

  /** 官方默认 10，setter 只接受 >= 1 的值（官方 `if (e !== t && t >= 1)`） */
  get strokeMiterLimit(): number { return this._strokeMiterLimit; }
  set strokeMiterLimit(val: number) {
    if (this._strokeMiterLimit !== val && val >= 1) {
      this._strokeMiterLimit = val;
      this._invalidateMeasure();
    }
  }

  /**
   * 官方 `Shape.pathPattern`：沿本 Shape 路径重复绘制的装饰对象。
   * 该对象不计入本 Shape 的量测尺寸。
   */
  get pathPattern(): GraphObject | null { return this._pathPattern; }
  set pathPattern(val: GraphObject | null) {
    if (this._pathPattern !== val) {
      this._pathPattern = val;
      this._invalidateMeasure();
    }
  }

  /** 官方默认 false；为 true 时由 geometry 自己决定定位而不是按 desiredSize 拉伸 */
  get isGeometryPositioned(): boolean { return this._isGeometryPositioned; }
  set isGeometryPositioned(val: boolean) {
    if (this._isGeometryPositioned !== val) {
      this._isGeometryPositioned = val;
      this._invalidateMeasure();
    }
  }

  // graduatedStart / graduatedEnd / graduatedSkip 继承自 GraphObject（官方都在 GraphObject 上）

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
      this._invalidateGeometryCache();
      this._invalidateMeasure();
    }
  }

  get geometry(): Geometry | null {
    if (this._geometry === null) {
      // 官方 Link 的路线是惰性算的，算完由 Link 把几何同步给主 Shape
      // （见 src/view/Link.ts 的 _syncGeometryToMainShapes）。
      // 样例代码常直接读 `link.elt(0).geometry` / `link.path.geometry`，
      // 若这条 Link 还没算过路线就会拿到 null（treeLoadAnimation 就是这么挂的）。
      // 这里按需补算一次；updateRoute 内部有 _isComputingRoute 保护，不会递归。
      const part: any = (this as any).part;
      if (part && typeof part.updateRoute === 'function' && typeof part.computePoints === 'function') {
        part.updateRoute();
      }
      if (this._geometry === null) {
        // 官方 Shape.geometry 对 geometryString/figure 是**惰性解析且直接可见**的；
        // 此前只返回 _geometry，导致 geometryString 形状的 geometry 恒为 null
        // （Graduated 面板 graduatedPointForValue 拿不到路径 → 表盘指针角度错）。
        const g = this._getGeometry();
        if (g !== null) return this._scaledOrRaw(g);
        return null;
      }
    }
    return this._scaledOrRaw(this._geometry);
  }
  set geometry(val: Geometry | null) {
    if (this._geometry !== val) {
      this._geometry = val;
      this._invalidateGeometryCache();
      this._invalidateMeasure();
    }
  }

  get geometryString(): string { return this._geometryString; }
  set geometryString(val: string) {
    if (this._geometryString !== val) {
      this._geometryString = val;
      this._parsedGeometryString = '';
      this._parsedGeometry = null;
      // 官方 `set geometryString(t){const e=Geometry.parse(t),i=e.normalize();
      // this.geometry=e; this.position=Point.O(-i.x,-i.y)}`：
      // 解析后立即 normalize（包围盒左上角移到原点），position 记录原生左上角，
      // 绘制时 position + 归一化路径 = 原生坐标（官方 geometryString 恒画原生位置）。
      // 关键：normalize 后 bounds 不含原点外扩（否则负坐标 geometryString 如
      // sparklineGraphs 的高度会因并入 (0,0) 而虚高，节点布局错位）。
      try {
        const parsed = Geometry.parse(val);
        if (parsed) {
          const off = parsed.normalize(); // 官方 e.normalize()：包围盒左上角移到原点
          this.geometry = parsed;
          this.position = new Point(-off.x, -off.y); // 官方 position=(-i.x,-i.y)=原生左上角
        }
      } catch {
        // 解析失败时保留字符串，走原来的惰性解析路径（在那里同样会失败）
      }
      this._invalidateGeometryCache();
      this._invalidateMeasure();
    }
  }

  get parameter1(): number { return this._parameter1; }
  set parameter1(val: number) {
    if (this._parameter1 !== val) {
      this._parameter1 = val;
      this._invalidateGeometryCache();
      this._invalidateMeasure();
    }
  }

  get parameter2(): number { return this._parameter2; }
  set parameter2(val: number) {
    if (this._parameter2 !== val) {
      this._parameter2 = val;
      this._invalidateGeometryCache();
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
      this._invalidateGeometryCache();
      this._invalidateMeasure();
      this._applyArrowLinkDefaults();
    }
  }

  get fromArrow(): string { return this._fromArrow; }
  set fromArrow(val: string) {
    if (this._fromArrow !== val) {
      this._fromArrow = val;
      this._invalidateGeometryCache();
      this._invalidateMeasure();
      this._applyArrowLinkDefaults();
    }
  }

  /**
   * 官方 `Shape.lF()`：设置 toArrow/fromArrow 后的连带默认值。
   * `JE()` 把 segmentOrientation 置为 Along(21)；toArrow 有效 → segmentIndex=-1、
   * alignmentFocus=Spot.Right；否则 fromArrow 有效 → segmentIndex=0、Spot.Left。
   * 官方在 undo/redo 期间跳过（`diagram.undoManager.isUndoingRedoing`）。
   * 缺这一步时箭头元素在 measure 里走错锚点分支，箭头位置与官方不一致。
   */
  private _applyArrowLinkDefaults(): void {
    const d: any = this.diagram;
    if (d && d.undoManager && d.undoManager.isUndoingRedoing) return;
    this.segmentOrientation = OrientationAlong;
    const hasTo = !!this._toArrow && this._toArrow !== 'None';
    const hasFrom = !!this._fromArrow && this._fromArrow !== 'None';
    if (hasTo) {
      this.segmentIndex = -1;
      this.alignmentFocus = Spot.Right;
    } else if (hasFrom) {
      this.segmentIndex = 0;
      this.alignmentFocus = Spot.Left;
    }
  }

  // ============ Methods ============

  /**
   * 官方 `Shape.polygonContainsRect(b)`：本 Shape 的填充多边形是否包含给定矩形。
   *
   * 步骤与官方一致：① 所属 Part 的 `actualBounds` 必须包含 b；② 矩形四个角必须都在几何内部；
   * ③ 官方 `GeometryType.Line`（单段直线）没有面积，恒 false。
   *
   * 偏差：官方的 ②/③ 走 `Geometry.containsPoint` / `Geometry.type`（见阶段 5 Geometry 补齐），
   * 本项目在本类内实现等价判断 —— 纯 Line 段图形用精确射线法，含曲线的图形暂退回
   * `Geometry.bounds` 包含判断（非凸图形会在阶段 5 修正）。
   */
  polygonContainsRect(b: Rect): boolean {
    const part = this.part;
    if (part === null || !part.actualBounds.containsRect(b)) return false;
    const geo = this.geometry;
    if (geo === null) return false;
    if (Shape._isLineGeometry(geo)) return false;
    const corners: Point[] = [new Point(b.x, b.y)];
    if (b.width > 0 && b.height > 0) corners.push(new Point(b.right, b.bottom));
    if (b.width > 0) corners.push(new Point(b.right, b.y));
    if (b.height > 0) corners.push(new Point(b.x, b.bottom));
    for (const corner of corners) {
      const local = this.getLocalPoint(corner);
      if (!Shape._geometryContainsPoint(geo, local)) return false;
    }
    return true;
  }

  /** 官方 `GeometryType.Line` 判定：单个图形、单个非闭合 Line 段 */
  private static _isLineGeometry(geo: Geometry): boolean {
    const figs = geo.figures;
    if (figs.count !== 1) return false;
    const fig = figs.first();
    if (fig === null) return false;
    const segs = fig.segments;
    if (segs.count !== 1) return false;
    const seg = segs.first();
    return seg !== null && seg.type._name === 'Line';
  }

  /**
   * 点（几何局部坐标）是否落在几何的填充区域内。
   * 纯 Line 段图形用精确射线法；含 Arc/Bezier 的图形退回 `geo.bounds`。
   */
  private static _geometryContainsPoint(geo: Geometry, p: Point): boolean {
    if (!geo.bounds.containsPoint(p)) return false;
    const it = geo.figures.iterator;
    while (it.next()) {
      const fig = it.value;
      if (!fig.isFilled) continue;
      const poly: number[] = [fig.startX, fig.startY];
      let curved = false;
      let cx = fig.startX;
      let cy = fig.startY;
      const segIt = fig.segments.iterator;
      while (segIt.next()) {
        const seg = segIt.value;
        const name = seg.type._name;
        if (name === 'Close') {
          poly.push(fig.startX, fig.startY);
          continue;
        }
        if (name !== 'Line') curved = true;
        if (name === 'MoveTo') {
          poly.length = 0;
          poly.push(seg.endX, seg.endY);
          cx = seg.endX;
          cy = seg.endY;
          continue;
        }
        poly.push(seg.endX, seg.endY);
        cx = seg.endX;
        cy = seg.endY;
      }
      if (cx !== fig.startX || cy !== fig.startY) poly.push(fig.startX, fig.startY);
      if (curved) continue;
      if (Shape._pointInPolygon(poly, p.x, p.y)) return true;
    }
    return false;
  }

  /** 射线法点在多边形内判断；`poly` 为扁平化的 [x0,y0,x1,y1,...] */
  private static _pointInPolygon(poly: number[], x: number, y: number): boolean {
    const n = poly.length / 2;
    if (n < 3) return false;
    let inside = false;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = poly[i * 2];
      const yi = poly[i * 2 + 1];
      const xj = poly[j * 2];
      const yj = poly[j * 2 + 1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }

  /**
   * 官方 `Shape.Rf`（`getNearestIntersectionPoint`）：官方按图形几何求线段 pq 与本
   * Shape 边界的最近交点——Ellipse/Circle 解椭圆方程、RoundedRectangle 走圆角、
   * 其它闭合图形遍历 PathFigure 的线段。
   *
   * 偏差：本实现覆盖官方最常用的两类（椭圆类解析解 + 其余按实际几何线段求交），
   * 因为 Link 端点默认取 actualBounds 矩形交点时，圆形节点的 fromArrow 会贴在
   * 外接正方形上而不是圆上。
   */
  getNearestIntersectionPoint(p: Point, q: Point, result: Point): boolean {
    const figName = (this._figure || '').toLowerCase();
    const ab = this.getDocumentBounds();
    if (!ab.isReal()) {
      result.setTo(q.x, q.y);
      return false;
    }

    // 椭圆类：解射线与椭圆方程，天然贴合圆/椭圆轮廓
    if (figName === 'circle' || figName === 'ellipse' || figName === 'circlefork' || figName === 'linecircle') {
      const cx = ab.x + ab.width / 2;
      const cy = ab.y + ab.height / 2;
      const rx = ab.width / 2;
      const ry = ab.height / 2;
      if (rx > 0 && ry > 0) {
        const dx = q.x - p.x;
        const dy = q.y - p.y;
        if (dx !== 0 || dy !== 0) {
          // ((p.x-cx)+t*dx)^2/rx^2 + ((p.y-cy)+t*dy)^2/ry^2 = 1
          const px = p.x - cx;
          const py = p.y - cy;
          const a = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
          const b = 2 * ((px * dx) / (rx * rx) + (py * dy) / (ry * ry));
          const c = (px * px) / (rx * rx) + (py * py) / (ry * ry) - 1;
          const disc = b * b - 4 * a * c;
          if (a > 0 && disc >= 0) {
            const sq = Math.sqrt(disc);
            const t1 = (-b - sq) / (2 * a);
            const t2 = (-b + sq) / (2 * a);
            // 官方 Rf 语义（参数序反转后）：交点取离 q(aim) 最近的那个，且满足
            // 官方闸门 dist²(cand,q) < dist²(p,q)——共线射线时等价于 0<t<2。
            let t = NaN;
            const ok = (tt: number): boolean => tt > 1e-9 && tt < 2;
            if (ok(t1) && ok(t2)) t = Math.abs(1 - t1) < Math.abs(1 - t2) ? t1 : t2;
            else if (ok(t1)) t = t1;
            else if (ok(t2)) t = t2;
            if (!isNaN(t)) {
              result.setTo(p.x + t * dx, p.y + t * dy);
              return true;
            }
          }
        }
      }
      // 官方 Rf：射线与椭圆无交点时返回 false，不做矩形兑底
      // （兑底会让“未命中的子形状包围盒角点”混进 Panel 聚合候选，
      //   端点被吸到方形角上——donutCharts 对角 link 贴到方角就是这个原因）。
      result.setTo(q.x, q.y);
      return false;
    }

    // 其它图形：用实际几何的各条线段与 pq 求交，取离 p 最近者
    const geo = this._getGeometry();
    if (geo) {
      // 必须用【文档坐标】包围盒把图形局部坐标映射到文档坐标：
      // actualBounds 是相对父面板的局部坐标，而 p/q 都是文档坐标，
      // 混用会把节点的 width/height 当成 x/y（表现为 link 端点乱飞）。
      const ab2 = ab;
      const geoBounds = geo.bounds;
      if (geoBounds.isReal() && (geoBounds.width > 0 || geoBounds.height > 0)) {
        const sx = geoBounds.width > 0 ? ab2.width / geoBounds.width : 1;
        const sy = geoBounds.height > 0 ? ab2.height / geoBounds.height : 1;
        // 文档坐标 = actualBounds 左上 + 图形局部坐标经 (sx,sy) 缩放
        const toDoc = (lx: number, ly: number): Point =>
          new Point(ab2.x + (lx - geoBounds.x) * sx, ab2.y + (ly - geoBounds.y) * sy);

        // 官方 Rf 语义（本项目参数序 (p=focus, q=aim) 反转后）：候选交点必须过
        // 闸门 dist²(cand,q) < dist²(p,q)，并在其中取离 q(aim) 最近的那个——
        // 注意不能取“离 p 最近”：节点中心在孔洞里时最近交点会落在内圈/标签上，
        // 端点就缩进图形内部（donutCharts 的 link 全部偏短偏里就是这个原因）。
        const gateDx = q.x - p.x;
        const gateDy = q.y - p.y;
        const gate = gateDx * gateDx + gateDy * gateDy;
        let bestD2 = Infinity;
        let bestX = 0;
        let bestY = 0;
        let found = false;
        const dx = q.x - p.x;
        const dy = q.y - p.y;

        const hitSeg = (x1: number, y1: number, x2: number, y2: number): void => {
          const ex = x2 - x1;
          const ey = y2 - y1;
          const den = dx * ey - dy * ex;
          if (Math.abs(den) < 1e-12) return; // 平行
          const t = ((x1 - p.x) * ey - (y1 - p.y) * ex) / den;
          const u = ((x1 - p.x) * dy - (y1 - p.y) * dx) / den;
          if (t > 1e-9 && u >= 0 && u <= 1) {
            const hx = p.x + t * dx;
            const hy = p.y + t * dy;
            const gx = hx - q.x;
            const gy = hy - q.y;
            const d2 = gx * gx + gy * gy;
            if (d2 < gate && d2 < bestD2) {
              bestD2 = d2;
              bestX = hx;
              bestY = hy;
              found = true;
            }
          }
        };

        const fit = geo.figures.iterator;
        while (fit.next()) {
          const f = fit.value;
          let cx = f.startX;
          let cy = f.startY;
          const sit = f.segments.iterator;
          while (sit.next()) {
            const seg = sit.value;
            const name = seg.type._name;
            if (name === 'MoveTo') {
              cx = seg.endX; cy = seg.endY;
            } else if (name === 'Close') {
              const a = toDoc(cx, cy);
              const b = toDoc(f.startX, f.startY);
              hitSeg(a.x, a.y, b.x, b.y);
              cx = f.startX; cy = f.startY;
            } else if (name === 'Line') {
              const a = toDoc(cx, cy);
              const b = toDoc(seg.endX, seg.endY);
              hitSeg(a.x, a.y, b.x, b.y);
              cx = seg.endX; cy = seg.endY;
            } else if (name === 'Arc' && !isNaN(seg.startAngle)) {
              // 「按角度」圆弧（PathSegment(SegmentType.Arc, a0, sw, cx, cy, rx, ry)）：
              // 按角度采样成折线求交（10° 步长，r=70 时弦高误差 <0.5px）。
              // 沿用渲染器同一套约定：点 = center + (rx·cosθ, ry·sinθ)，
              // 半径 Y 缺省为 0 时按圆处理（官方 6 参构造的 radiusY 默认 0）。
              const rx = seg.radiusX;
              const ry = seg.radiusY === 0 ? seg.radiusX : seg.radiusY;
              const a0 = seg.startAngle;
              const sw = seg.sweepAngle;
              const steps = Math.max(8, Math.ceil(Math.abs(sw) / 10));
              let px = cx;
              let py = cy;
              for (let i = 1; i <= steps; i++) {
                const th = ((a0 + (sw * i) / steps) * Math.PI) / 180;
                const ex = seg.centerX + rx * Math.cos(th);
                const ey = seg.centerY + ry * Math.sin(th);
                const pa = toDoc(px, py);
                const pb = toDoc(ex, ey);
                hitSeg(pa.x, pa.y, pb.x, pb.y);
                px = ex; py = ey;
              }
              // 终点按同一套采样约定推导（PathSegment.AngleArc 不填 arcEndX，
              // 只在构造器路径里才有；统一重算避免 NaN 污染后续段的当前点）。
              const endTh = ((a0 + sw) * Math.PI) / 180;
              cx = seg.centerX + rx * Math.cos(endTh);
              cy = seg.centerY + ry * Math.sin(endTh);
            } else if (name === 'Arc') {
              // SVG 端点弧（PathSegment.Arc()）：本项目图库不使用这种形式，
              // 缺圆心参数不作求交，跳过（最终无候选时落矩形兑底，与既往行为一致）。
              cx = seg.endX; cy = seg.endY;
            } else {
              // 曲线段：按多段折线近似求交（步长足够细，误差远小于一个像素）
              const steps = 16;
              let px = cx;
              let py = cy;
              for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const mt = 1 - t;
                let ex: number;
                let ey: number;
                if (name === 'QuadraticBezier') {
                  ex = mt * mt * cx + 2 * mt * t * seg.x1 + t * t * seg.endX;
                  ey = mt * mt * cy + 2 * mt * t * seg.y1 + t * t * seg.endY;
                } else {
                  const a = mt * mt * mt;
                  const bq = 3 * mt * mt * t;
                  const cq = 3 * mt * t * t;
                  const dq = t * t * t;
                  ex = a * cx + bq * seg.x1 + cq * seg.x2 + dq * seg.endX;
                  ey = a * cy + bq * seg.y1 + cq * seg.y2 + dq * seg.endY;
                }
                const pa = toDoc(px, py);
                const pb = toDoc(ex, ey);
                hitSeg(pa.x, pa.y, pb.x, pb.y);
                px = ex; py = ey;
              }
              cx = seg.endX; cy = seg.endY;
            }
            // 官方：任何段带 isClosed 标志都补一段“当前点 → figure 起点”的闭合边
            // （donutCharts 的环形楔子就是 Arc(...).close()，闭合边是第二条径向边）。
            if (seg.isClosed && name !== 'Close') {
              const a = toDoc(cx, cy);
              const b = toDoc(f.startX, f.startY);
              hitSeg(a.x, a.y, b.x, b.y);
              cx = f.startX; cy = f.startY;
            }
          }
        }
        if (found) {
          result.setTo(bestX, bestY);
          return true;
        }
        // 显式几何存在但射线没命中任何段：官方 Rf 返回 false（不做矩形兑底），
        // 让 Panel 聚合跳过该形状、由 Link 层在全军覆没时统一兑底。
        result.setTo(q.x, q.y);
        return false;
      }
    }

    return super.getNearestIntersectionPoint(p, q, result);
  }

  /**
   * 官方 `Shape.fi()`：清掉缩放几何缓存（dt=null，geometry 暂回 raw，直到下次 measure 重建）。
   * 在 desiredSize 变更（官方 width/height/desiredSize setter 调 fi）以及
   * Link/Panel 直写 `_geometry` 后必须调用，否则 `.geometry` 会拿到过期的缩放几何。
   */
  _invalidateGeometryCache(): void {
    this._scaledGeometry = null;
    this._scaledFrom = null;
  }

  /** 显式几何（官方 rn）：_geometry 或 geometryString 的缓存解析结果 */
  private _explicitGeometry(): Geometry | null {
    if (this._geometry !== null) return this._geometry;
    if (this._geometryString) return this._getGeometry();
    return null;
  }

  /**
   * 官方 `dt!==null ? dt : rn` 的等价物：返回该 raw 几何对应的缩放几何。
   * 未测过或 raw 已变（直写/重新赋值）时返回 raw —— 下次 measure 会重建缓存。
   */
  private _scaledOrRaw(raw: Geometry): Geometry {
    return this._scaledGeometry !== null && this._scaledFrom === raw ? this._scaledGeometry : raw;
  }

  /** 获取几何路径（从图形名称或自定义几何） */
  _getGeometry(): Geometry | null {
    if (this._geometry !== null) {
      return this._geometry;
    }
    if (this._geometryString) {
      // 缓存解析结果：geometry getter 要靠对象身份与 _scaledFrom 比对命中缩放缓存
      if (this._parsedGeometryString !== this._geometryString) {
        const parsed = Geometry.parse(this._geometryString);
        this._parsedGeometry = parsed;
        this._parsedGeometryString = this._geometryString;
      }
      return this._parsedGeometry;
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
      // 官方 Shape.FN[figure] 缓存：裸生成器（null,100,100）不记尺寸（Ec/Uc=NaN），
      // 包围盒 = 路径 ∪ 原点 → LineV 自然宽 50 而非 100。setSize=false 对齐之。
      const g = getFigureGeometry(this._figure, 100, 100, NaN, NaN, null, false);
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
    } else if (st === StretchHorizontal) {
      // 官方 case5：宽随约束，高取自然；清掉长高的 min
      aW = Math.max(t - strokeW, 0);
      s = 0;
    } else if (st === StretchVertical) {
      // 官方 case4：高随约束，宽取自然；清掉长宽的 min
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
    // 官方 yt 后半段：grow 目标 f/u → e/s，再收敛约束 t/i（用于 Yd 的 Infinity 分支判定）
    let ft = 0;
    let fi = 0;
    if (st === StretchFill) {
      if (isFinite(t)) ft = t;
      if (isFinite(i)) fi = i;
    } else if (st === StretchHorizontal) {
      if (isFinite(t)) ft = t;
    } else if (st === StretchVertical) {
      if (isFinite(i)) fi = i;
    }
    if (ft > maxS.width && minS.width < maxS.width) ft = maxS.width;
    if (fi > maxS.height && minS.height < maxS.height) fi = maxS.height;
    let ey = Math.max(ft, minS.width);
    let sy = Math.max(fi, minS.height);
    if (maxS.width < ey) ey = Math.min(minS.width, ey);
    if (maxS.height < sy) sy = Math.min(minS.height, sy);
    const tY = Math.max(ey, Math.min(maxS.width, t));
    const iY = Math.max(sy, Math.min(maxS.height, i));

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
    // 官方 Yd：l===0 → 0.001
    if (gW === 0) gW = 0.001;
    if (gH === 0) gH = 0.001;
    (this as any)._geoW = gW;
    (this as any)._geoH = gH;
    // 官方 Yd 尾部 `dt = rn.UR(l,a)`：显式几何按内容尺寸（gW/gH）缩放。
    // 这样 geometry.bounds/路径长度与官方一致 —— graduated marks、
    // graduatedPointForValue 才会落在正确的长度上（如 thermometer 竖线 400→250）。
    const expl = this._explicitGeometry();
    if (expl !== null) {
      const b = expl.bounds;
      let sx = gW / b.width;
      let sy = gH / b.height;
      // 官方 UR：宽/高为 0 时商为 ±Infinity/NaN → isFinite 失败 → 1
      if (!isFinite(sx)) sx = 1;
      if (!isFinite(sy)) sy = 1;
      this._scaledGeometry = sx === 1 && sy === 1 ? expl : expl.copy().scale(sx, sy);
      this._scaledFrom = expl;
    } else {
      this._scaledGeometry = null;
      this._scaledFrom = null;
    }
    // 官方 Yd 尾部：约束有一维 Infinity → measuredBounds = 实际几何 bounds（Uniform letterbox 生效，
    // 如 Square width=85 + 竖排面板高度 Infinity → 85×85 而非 85×100）
    let gb: Rect | null = null;
    // 只有 isGeometryPositioned 的 Shape 才把「图形自身原点」带进 measuredBounds：
    // 它的几何是画在父面板坐标系里的（pieCharts 的多个扇形原点各异），
    // 父面板必须按原点并集才能量出覆盖整块饼的尺寸。
    // 普通 Shape（含 sparklineGraphs 的负 y geometryString）在绘制时会被归一化到
    // 自身包围盒，原点不应影响测量。
    let keepOrigin = false;
    if (expl !== null) {
      const raw = expl;
      const yM0 = yM === 0 || yM === 2;
      if (yM0 && this._isGeometryPositioned) {
        gb = raw.bounds.copy();
        keepOrigin = true;
      } else {
        // 官方 qI(l,h)：归一到 (0,0,l,h)，绘制时再由渲染器贴回包围盒
        gb = new Rect(0, 0, gW, gH);
      }
    } else {
      const geo = this._getGeometry();
      if (geo) gb = geo.bounds;
    }
    // 官方 Shape.Yd 尾部 po(−sw/2, −sw/2, w+sw, h+sw)：measuredBounds 原点含
    // 描边外扩（Infinity 约束分支为 po(gb.x−sw/2, gb.y−sw/2, …)）。
    // 该原点被官方 Part.op（旋转枢轴 r 的 −lo.mb）、Part.WD（location 偏移链的
    // −mb）、GraphObject.getDocumentPoint（逐级 D = ab + p − mb）读取——
    // origin 取 0 会让这些公式整体偏 sw/2（Valve1 pos 0.5px、Valve2 mb.ay 1px）。
    const orgX = keepOrigin && gb ? gb.x : -strokeW / 2;
    const orgY = keepOrigin && gb ? gb.y : -strokeW / 2;
    if ((tY === Infinity || iY === Infinity) && gb) {
      this._measuredBounds = new Rect(gb.x - strokeW / 2, gb.y - strokeW / 2, gb.width + strokeW, gb.height + strokeW);
    } else {
      this._measuredBounds = new Rect(orgX, orgY, aW + strokeW, aH + strokeW);
    }
    // 官方 _i（naturalBounds）：desiredSize 双有限 → ds 收敛；否则 → 几何 bounds
    if (isFinite(ds.width) && isFinite(ds.height)) {
      const nw = Math.max(minS.width, Math.min(maxS.width, ds.width));
      const nh = Math.max(minS.height, Math.min(maxS.height, ds.height));
      this._naturalBounds = new Rect(0, 0, nw, nh);
    } else if (gb) {
      this._naturalBounds = new Rect(gb.x, gb.y, gb.width, gb.height);
    } else {
      this._naturalBounds = new Rect(0, 0, aW, aH);
    }
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
    // Default：官方 fM() —— 显式 geometry（rn!==null，含 geometryString）恒为 2，
    // **不读** geometry.defaultStretch；只有 figure（rn===null）才回落到
    // figure geometry 的 defaultStretch（Shape.FN[figure].defaultStretch）。
    if (this._geometry === null && !this._geometryString && this._figure && this._figure !== 'None') {
      const g = getFigureGeometry(this._figure, 100, 100, NaN, NaN, null, false);
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
        if (seg.isClosed && seg.type._name !== 'Close') {
          ctx.closePath();
          curX = fig.startX;
          curY = fig.startY;
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

    // 官方「按角度」圆弧：new PathSegment(SegmentType.Arc, startAngle, sweepAngle, cx, cy, rx, ry)
    if (!isNaN(seg.startAngle) && !isNaN(seg.centerX)) {
      const rX = Math.abs(rx);
      const rY = Math.abs(ry === 0 ? rx : ry);
      if (rX <= 0 || rY <= 0) {
        ctx.lineTo(endX, endY);
        return;
      }
      const a0 = (seg.startAngle * Math.PI) / 180;
      const sweep = seg.sweepAngle || 0;
      const a1 = ((seg.startAngle + sweep) * Math.PI) / 180;
      // 官方以「起始角 + 扫掠角」描述，扫掠为正表示角度增大方向
      ctx.ellipse(seg.centerX, seg.centerY, rX, rY, 0, a0, a1, sweep < 0);
      return;
    }

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
    shape._strokeMiterLimit = this._strokeMiterLimit;
    shape._pathPattern = this._pathPattern;
    shape._isGeometryPositioned = this._isGeometryPositioned;
    // graduated* 已由 GraphObject._copyPropertiesTo 复制
    shape._spot1 = this._spot1 ? this._spot1.copy() : null;
    shape._spot2 = this._spot2 ? this._spot2.copy() : null;
    return shape;
  }

  static defineFigureGenerator(name: string, func: ((shape: Shape | null, w: number, h: number) => Geometry) | string): void {
    figures.add(name, func as any);
  }

  static getFigureGenerators(): any {
    // 官方返回 G.Mn 里所有**非小写**名（内置 30 个 + 运行时 defineFigureGenerator 定义的），
    // **包括 extensions/Figures.js 注册的扩展图形** —— shapes 样例正是靠
    // `Shape.getFigureGenerators().toArray()` 当 nodeDataArray，把扩展图形也画出来
    // （官方 277 个图形 / 281 个节点）。
    // 以前这里用 `!isExtensionFigure(name)` 把扩展图形全过滤掉了，
    // 于是 shapes 只有 249 个节点（少 32 个），diff 一直下不来。
    const result = new Dict<string, any>();
    for (const name of CORE_FIGURE_NAMES) {
      const f = figures.get(name);
      if (f !== undefined) result.add(name, f);
    }
    const it = figures.iterator;
    while (it.next()) {
      const name = (it as any).key;
      if (CORE_FIGURE_NAMES.indexOf(name) < 0) result.add(name, it.value);
    }
    return result;
  }

  private static _arrowheadGeometries: Dict<string, Geometry> | null = null;

  /** 内部表（含小写别名键），官方对应 `Shape.En`。 */
  private static _arrowheads(): Dict<string, Geometry> {
    if (!Shape._arrowheadGeometries) {
      Shape._arrowheadGeometries = Shape._createArrowheadGeometries();
    }
    return Shape._arrowheadGeometries;
  }

  /**
   * 官方 `Shape.getArrowheadGeometries()`：返回 `Map<string, Geometry>`（官方为 PropertyCollection 上的 GMap），
   * 只包含规范大小写的箭头名（跳过全小写别名键），供 `arrowheads.html` 等样例
   * 用 `.toKeySet().toArray()` 枚举全部箭头名。
   */
  static getArrowheadGeometries(): Dict<string, Geometry> {
    const src = Shape._arrowheads();
    const result = new Dict<string, Geometry>();
    const it = src.iterator;
    while (it.next()) {
      const key = it.key;
      if (key === key.toLowerCase()) continue; // 跳过全小写别名
      const val = it.value;
      if (val) result.set(key, val);
    }
    return result;
  }

  static defineArrowheadGenerator(name: string, func: (shape: Shape | null, w: number, h: number) => Geometry): void {
    Shape._arrowheads().set(name, func(null, 10, 10));
  }

  /** 官方 `Shape.isFigureDefined(name)`：`name in G._n`（核心图形 + defineFigureGenerator 定义的） */
  static isFigureDefined(name: string): boolean {
    return figures.has(name);
  }

  /**
   * 官方 `Shape.defineArrowheadGeometry(name, pathstr)`。
   * 官方校验：name 不得为空 / 'None' / 全小写，否则抛错。
   *
   * 偏差：官方 `Shape.En` 的小写别名存的是「规范名字符串」，由 `Shape.tF` 归一化；
   * 本项目小写别名直接指向同一 Geometry，以便 `_getArrowheadGeometry` 保持返回 Geometry。
   */
  static defineArrowheadGeometry(name: string, pathstr: Geometry | string): void {
    const lower = name === undefined || name === null ? '' : name.toLowerCase();
    if (!name || lower === 'none' || lower === name) {
      throw new Error('Shape.defineArrowheadGeometry name must not be empty or None or all-lower-case: ' + name);
    }
    const geo = typeof pathstr === 'string' ? Geometry.parse(pathstr) : pathstr;
    const geos = Shape._arrowheads();
    geos.set(name, geo);
    geos.set(lower, geo);
  }

  /**
   * 官方 `Shape.isArrowheadDefined(name)`。
   *
   * 偏差：官方实现为 `Shape.En.has(t)`，而 `Shape.En` 是 PropertyCollection（没有 `has`），
   * 所以官方在运行时会抛 `TypeError`；本项目按其文档语义返回真实结果。
   * 内部表包含小写别名键；`getArrowheadGeometries()` 返回的公开 Map 会过滤掉全小写键，
   * 因此这里先查内部表，再做一次大小写不敏感兜底。
   */
  static isArrowheadDefined(name: string): boolean {
    const geos = Shape._arrowheads();
    if (geos.has(name)) return true;
    const lower = name.toLowerCase();
    if (geos.has(lower)) return true;
    const it = geos.iterator;
    while (it.next()) {
      if (it.key.toLowerCase() === lower) return true;
    }
    return false;
  }

  private static _getArrowheadGeometry(name: string): Geometry | null {
    // 官方 'None'/'' 表示不画箭头，必须返回空几何而不是回退到 Standard
    if (!name || name === 'None' || name.toLowerCase() === 'none') return new Geometry();
    const geos = Shape._arrowheads();
    const direct = geos.get(name);
    if (direct) return direct;
    const lower = name.toLowerCase();
    const byLower = geos.get(lower);
    if (byLower) return byLower;
    // 官方 `Shape.rF` 会大小写不敏感地在内置箭头名里回退查找
    const it = geos.iterator;
    while (it.next()) {
      if (it.key.toLowerCase() === lower) return it.value;
    }
    return geos.get('Standard') || null;
  }

  /** 官方内置箭头几何（与官方 G.Nm 一致的 80 条路径串，由 Geometry.parse 解析） */
  private static _createArrowheadGeometries(): Dict<string, Geometry> {
    const result = new Dict<string, Geometry>();
    for (const name in ARROWHEAD_PATH_STRINGS) {
      const pathstr = ARROWHEAD_PATH_STRINGS[name];
      let geo: Geometry;
      try {
        geo = Geometry.parse(pathstr);
      } catch {
        continue;
      }
      result.set(name, geo);
      const lower = name.toLowerCase();
      if (lower !== name) result.set(lower, geo);
    }
    // 官方 G.Nm 中没有 'None' 项（官方内部表以 '' 空串表示），公开名单因此正好 80 个。
    // 'None' 由 _getArrowheadGeometry 单独处理为空几何，不进入名单，否则样例会多生成一条链接。
    return result;
  }
}

GraphObject.defineBuilder('Shape', Shape);
