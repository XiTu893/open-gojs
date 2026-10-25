import { GraphObject } from './GraphObject';
import { EnumValue } from '../core/EnumValues';
import { BrushLike } from '../core/Brush';
import { Geometry } from '../core/Geometry';
import { Rect } from '../core/Rect';
import { Point } from '../core/Point';
import { Spot } from '../core/Spot';
import { Map as Dict } from '../core/Map';
/**
 * Shape - 几何图形
 * 表示一个几何形状，支持预定义图形和自定义几何路径
 */
export declare class Shape extends GraphObject {
    static readonly className: string;
    static GeometryStretchUniform: EnumValue;
    static GeometryStretchNone: EnumValue;
    static GeometryStretchFill: EnumValue;
    static GeometryStretchUniformToFill: EnumValue;
    private _fill;
    private _stroke;
    private _strokeWidth;
    private _strokeDashArray;
    private _strokeDashOffset;
    private _strokeCap;
    private _strokeJoin;
    private _figure;
    private _geometry;
    private _geometryString;
    private _parameter1;
    private _parameter2;
    private _toArrow;
    private _fromArrow;
    private _geometryStretch;
    private _fillRule;
    private _strokeMiterLimit;
    private _pathPattern;
    private _isGeometryPositioned;
    private _scaledGeometry;
    private _scaledFrom;
    private _parsedGeometryString;
    private _parsedGeometry;
    constructor(figOrGeo?: string | Geometry | Partial<Shape>, init?: Partial<Shape>);
    get fill(): BrushLike;
    set fill(val: BrushLike);
    get stroke(): BrushLike;
    set stroke(val: BrushLike);
    get strokeWidth(): number;
    set strokeWidth(val: number);
    get strokeDashArray(): number[] | null;
    set strokeDashArray(val: number[] | null);
    get strokeDashOffset(): number;
    set strokeDashOffset(val: number);
    get strokeCap(): string;
    set strokeCap(val: string);
    get strokeJoin(): string;
    set strokeJoin(val: string);
    /** 官方默认 10，setter 只接受 >= 1 的值（官方 `if (e !== t && t >= 1)`） */
    get strokeMiterLimit(): number;
    set strokeMiterLimit(val: number);
    /**
     * 官方 `Shape.pathPattern`：沿本 Shape 路径重复绘制的装饰对象。
     * 该对象不计入本 Shape 的量测尺寸。
     */
    get pathPattern(): GraphObject | null;
    set pathPattern(val: GraphObject | null);
    /** 官方默认 false；为 true 时由 geometry 自己决定定位而不是按 desiredSize 拉伸 */
    get isGeometryPositioned(): boolean;
    set isGeometryPositioned(val: boolean);
    get geometryStretch(): EnumValue;
    set geometryStretch(val: EnumValue);
    get fillRule(): string;
    set fillRule(val: string);
    get figure(): string;
    set figure(val: string);
    get geometry(): Geometry | null;
    set geometry(val: Geometry | null);
    get geometryString(): string;
    set geometryString(val: string);
    get parameter1(): number;
    set parameter1(val: number);
    get parameter2(): number;
    set parameter2(val: number);
    private _spot1;
    private _spot2;
    get spot1(): Spot;
    set spot1(val: Spot);
    get spot2(): Spot;
    set spot2(val: Spot);
    get toArrow(): string;
    set toArrow(val: string);
    get fromArrow(): string;
    set fromArrow(val: string);
    /**
     * 官方 `Shape.lF()`：设置 toArrow/fromArrow 后的连带默认值。
     * `JE()` 把 segmentOrientation 置为 Along(21)；toArrow 有效 → segmentIndex=-1、
     * alignmentFocus=Spot.Right；否则 fromArrow 有效 → segmentIndex=0、Spot.Left。
     * 官方在 undo/redo 期间跳过（`diagram.undoManager.isUndoingRedoing`）。
     * 缺这一步时箭头元素在 measure 里走错锚点分支，箭头位置与官方不一致。
     */
    private _applyArrowLinkDefaults;
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
    polygonContainsRect(b: Rect): boolean;
    /** 官方 `GeometryType.Line` 判定：单个图形、单个非闭合 Line 段 */
    private static _isLineGeometry;
    /**
     * 点（几何局部坐标）是否落在几何的填充区域内。
     * 纯 Line 段图形用精确射线法；含 Arc/Bezier 的图形退回 `geo.bounds`。
     */
    private static _geometryContainsPoint;
    /** 射线法点在多边形内判断；`poly` 为扁平化的 [x0,y0,x1,y1,...] */
    private static _pointInPolygon;
    /**
     * 官方 `Shape.Rf`（`getNearestIntersectionPoint`）：官方按图形几何求线段 pq 与本
     * Shape 边界的最近交点——Ellipse/Circle 解椭圆方程、RoundedRectangle 走圆角、
     * 其它闭合图形遍历 PathFigure 的线段。
     *
     * 偏差：本实现覆盖官方最常用的两类（椭圆类解析解 + 其余按实际几何线段求交），
     * 因为 Link 端点默认取 actualBounds 矩形交点时，圆形节点的 fromArrow 会贴在
     * 外接正方形上而不是圆上。
     */
    getNearestIntersectionPoint(p: Point, q: Point, result: Point): boolean;
    /**
     * 官方 `Shape.fi()`：清掉缩放几何缓存（dt=null，geometry 暂回 raw，直到下次 measure 重建）。
     * 在 desiredSize 变更（官方 width/height/desiredSize setter 调 fi）以及
     * Link/Panel 直写 `_geometry` 后必须调用，否则 `.geometry` 会拿到过期的缩放几何。
     */
    _invalidateGeometryCache(): void;
    /** 显式几何（官方 rn）：_geometry 或 geometryString 的缓存解析结果 */
    private _explicitGeometry;
    /**
     * 官方 `dt!==null ? dt : rn` 的等价物：返回该 raw 几何对应的缩放几何。
     * 未测过或 raw 已变（直写/重新赋值）时返回 raw —— 下次 measure 会重建缓存。
     */
    private _scaledOrRaw;
    /** 获取几何路径（从图形名称或自定义几何） */
    _getGeometry(): Geometry | null;
    private _getFigureGeometry;
    /** 官方 Shape.Yd 的自然尺寸来源：显式 geometry → 其 bounds；figure → 官方 Shape.VN(figure)(null,100,100)；
     *  与上次测量结果无关（否则 Auto 面板反复测量会让 geometry.spot1/spot2 随几何尺寸收缩，形成级联误差） */
    private _naturalSize;
    /** 测量对象尺寸 — 官方 GraphObject.yt + Shape.Yd（holes=0），measuredBounds 含 strokeWidth */
    _measure(widthConstraint: number, heightConstraint: number): void;
    /** 官方 Shape.yM：geometryStretch 显式值否则 geometry/figure 的 defaultStretch */
    private _resolvedGeometryStretch;
    /** 绘制图形 */
    _draw(ctx: CanvasRenderingContext2D): void;
    /** 在 canvas 上绘制几何路径 */
    private _drawGeometry;
    /** Draw an arc segment from current point to endpoint using SVG arc parameters */
    private _drawArcSegment;
    /** 复制 */
    copy(): Shape;
    static defineFigureGenerator(name: string, func: ((shape: Shape | null, w: number, h: number) => Geometry) | string): void;
    static getFigureGenerators(): any;
    private static _arrowheadGeometries;
    /** 内部表（含小写别名键），官方对应 `Shape.En`。 */
    private static _arrowheads;
    /**
     * 官方 `Shape.getArrowheadGeometries()`：返回 `Map<string, Geometry>`（官方为 PropertyCollection 上的 GMap），
     * 只包含规范大小写的箭头名（跳过全小写别名键），供 `arrowheads.html` 等样例
     * 用 `.toKeySet().toArray()` 枚举全部箭头名。
     */
    static getArrowheadGeometries(): Dict<string, Geometry>;
    static defineArrowheadGenerator(name: string, func: (shape: Shape | null, w: number, h: number) => Geometry): void;
    /** 官方 `Shape.isFigureDefined(name)`：`name in G._n`（核心图形 + defineFigureGenerator 定义的） */
    static isFigureDefined(name: string): boolean;
    /**
     * 官方 `Shape.defineArrowheadGeometry(name, pathstr)`。
     * 官方校验：name 不得为空 / 'None' / 全小写，否则抛错。
     *
     * 偏差：官方 `Shape.En` 的小写别名存的是「规范名字符串」，由 `Shape.tF` 归一化；
     * 本项目小写别名直接指向同一 Geometry，以便 `_getArrowheadGeometry` 保持返回 Geometry。
     */
    static defineArrowheadGeometry(name: string, pathstr: Geometry | string): void;
    /**
     * 官方 `Shape.isArrowheadDefined(name)`。
     *
     * 偏差：官方实现为 `Shape.En.has(t)`，而 `Shape.En` 是 PropertyCollection（没有 `has`），
     * 所以官方在运行时会抛 `TypeError`；本项目按其文档语义返回真实结果。
     * 内部表包含小写别名键；`getArrowheadGeometries()` 返回的公开 Map 会过滤掉全小写键，
     * 因此这里先查内部表，再做一次大小写不敏感兜底。
     */
    static isArrowheadDefined(name: string): boolean;
    private static _getArrowheadGeometry;
    /** 官方内置箭头几何（与官方 G.Nm 一致的 80 条路径串，由 Geometry.parse 解析） */
    private static _createArrowheadGeometries;
}
