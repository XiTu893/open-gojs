import { PathFigure } from './PathFigure';
import { List } from './List';
import { Rect } from './Rect';
import { Point } from './Point';
import { EnumValue } from './EnumValues';
/**
 * Geometry - 几何路径定义
 */
export declare class Geometry {
    static readonly className: string;
    /** 图形集合 */
    private _figures;
    /** 默认图形 */
    private _defaultFigure;
    /** 边界矩形 */
    private _bounds;
    /** 是否包含偶奇填充 */
    fillRule: string;
    /** 图形名称（用于 figure 属性） */
    name: string;
    /** Auto 面板内容定位用的左上锚点（官方 geometry.spot1）。
     *  官方 Geometry 构造即默认 Spot.TopLeft.copy()，这里保持一致。 */
    spot1: any;
    /** Auto 面板内容定位用的右下锚点（官方 geometry.spot2），官方默认 Spot.BottomRight.copy()。 */
    spot2: any;
    /** 官方 geometry.defaultStretch（0=None 2=Fill 4=Vertical 5=Horizontal 6=Uniform），默认 Fill */
    defaultStretch: number;
    /** 官方 geometry 记录的图形生成尺寸（Shape 生成图形几何时写入 width/height）。
     *  包围盒至少要覆盖 (0,0,width,height) 这个原始盒子 —— 官方 computeBounds 就是这么做的：
     *  先用 (0,0,width,height) 起步再并入实际路径。
     *  少了这一步，DataStorage 这类「原始路径比盒子窄」的图形会被按窄包围盒横向拉伸，
     *  拐角处出现尖刺。 */
    width: number;
    /** 同 width：图形生成时的高度 */
    height: number;
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
    constructor(type?: EnumValue | PathFigure | PathFigure[] | Record<string, any>, init?: Partial<Geometry>);
    /** 获取默认图形 */
    get defaultFigure(): PathFigure;
    /** 获取图形集合 */
    get figures(): List<PathFigure>;
    /** 添加图形 */
    add(fig: PathFigure): this;
    set(props: Record<string, any>): this;
    /** 移除图形 */
    remove(fig: PathFigure): boolean;
    /** 清空图形 */
    clear(): this;
    /** 记录图形生成尺寸（官方 `Shape` 图形几何入口的做法），并作废已缓存的包围盒。 */
    setSize(w: number, h: number): void;
    /** 获取边界矩形 */
    get bounds(): Rect;
    /** 计算边界矩形 */
    private computeBounds;
    /**
     * 路径几何累积包围盒 acc=[minX,minY,maxX,maxY]。
     * 官方 Geometry.DT(Path)：直线/端点直接并入，三次/二次贝塞尔与圆弧用 G.Yu 细分算法
     * 求真实曲线极值（圆弧先转三次贝塞尔），否则圆/椭圆等弧形图形包围盒高度为 0。
     */
    private _accumulatePathBounds;
    /** 官方 G.vi：点 (px,py) 是否在容差 tol 内靠近线段 (x0,y0)-(x1,y1)（含包围盒预检） */
    private static _vi;
    /** 官方 G.Yu：细分三次贝塞尔至平坦后把端点并入 acc=[minX,minY,maxX,maxY] */
    private static _bezierBounds;
    copy(): Geometry;
    equals(geo: Geometry): boolean;
    /** 从 SVG 路径字符串解析 */
    static parse(str: string): Geometry;
    /** 从 GoJS 几何字符串格式解析 */
    static parseString(str: string, width?: number, height?: number): Geometry;
    /** 转换为 SVG 路径字符串 */
    toSvgString(): string;
    /** 创建矩形几何 */
    static rectangle(width: number, height: number): Geometry;
    /** 创建圆角矩形几何 */
    static roundedRectangle(width: number, height: number, cornerRadius: number): Geometry;
    /** 创建椭圆几何 */
    static ellipse(width: number, height: number): Geometry;
    /** 创建线段几何 */
    static line(x1: number, y1: number, x2: number, y2: number): Geometry;
    static triangle(width: number, height: number): Geometry;
    static diamond(width: number, height: number): Geometry;
    static string(width: number, height: number, top?: number, left?: number, bottom?: number, right?: number): Geometry;
    static isGeometry(obj: any): boolean;
    static stringify(geo: Geometry): string;
    close(): Geometry;
    /** 官方 GeometryType（本项目用 EnumValue 而非数值，成员集合一致） */
    private _type;
    private _startX;
    private _startY;
    private _endX;
    private _endY;
    private _flattenedSegments;
    private _flattenedLengths;
    private _flattenedTotalLength;
    private _invalidate;
    get type(): EnumValue;
    set type(value: EnumValue);
    get startX(): number;
    set startX(value: number);
    get startY(): number;
    set startY(value: number);
    get endX(): number;
    set endX(value: number);
    get endY(): number;
    set endY(value: number);
    set figures(value: List<PathFigure>);
    /** 官方 Geometry.setSpots：就地分配新 Spot，不走缓存 */
    setSpots(f1x: number, f1y: number, f2x: number, f2y: number, o1x?: number, o1y?: number, o2x?: number, o2y?: number): this;
    /** 官方 Geometry.computeBoundsWithoutOrigin：不含原点的包围盒，可复用传入 Rect */
    computeBoundsWithoutOrigin(result?: Rect): Rect;
    /** 官方 Geometry.normalize：把包围盒左上角移到原点，返回平移量 */
    normalize(): Point;
    /** 官方 Geometry.offset：原地平移 */
    offset(x: number, y: number): this;
    /** 官方 Geometry.scale：原地缩放（负值用于翻转） */
    scale(x: number, y: number): this;
    /** 官方 Geometry.rotate：绕 (x,y) 旋转（默认原点） */
    rotate(angle: number, x?: number, y?: number): this;
    /** 官方 Geometry.D：2x3 仿射变换，作用于起点/终点或 Path 的所有控制点 */
    private _transform;
    /** 官方 Geometry.equalsApprox：按几何语义的近似相等 */
    equalsApprox(g: Geometry): boolean;
    private _lineEqualsPath;
    /** 官方 Geometry.toString：把几何写成可被 Geometry.parse 读回的字符串 */
    toString(digits?: number): string;
    private static _figureToString;
    /** 官方 Geometry.containsPoint：点是否落在几何内（含 sw 的描边外扩） */
    containsPoint(p: Point, sw?: number): boolean;
    private static _strokeContains;
    private static _fillContains;
    get flattenedSegments(): number[][];
    get flattenedLengths(): number[][];
    get flattenedTotalLength(): number;
    private _ensureFlattened;
    /** 把一个 PathFigure 拆成若干折线子路径（Move 之后开新路径） */
    private static _figureSubpaths;
    private static _pointLengths;
    private static _sampleQuad;
    private static _sampleCubic;
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
    private static _appendAngleArc;
    /** 沿椭圆（圆心 cx,cy，半径 rx,ry，旋转 rot）从 th0 到 th1 输出三次贝塞尔 */
    private static _appendEllipseCubics;
    private static _arcToCubics;
    private static _vecAngle;
    /** 官方 Geometry.getPointAlongPath：路径上比例处的点 */
    getPointAlongPath(fraction: number, result?: Point): Point;
    /** 官方 Geometry.getAngleAlongPath：路径上比例处的切线角 */
    getAngleAlongPath(fraction: number): number;
    /** 官方 Geometry.getPointAndAngleAlongPath：[x, y, angle] */
    getPointAndAngleAlongPath(fraction: number, result?: number[]): number[];
    private static _angleOf;
    /** 官方 Geometry.getFractionForPoint：点在路径上的比例 */
    getFractionForPoint(pt: Point): number;
    private static _projectOnSegment;
    /** 官方 Geometry.polygonClosestSegment：Path 上最近的直线段 */
    polygonClosestSegment(pt: Point, dist?: number): {
        figi: number;
        segi: number;
        ax: number;
        ay: number;
        bx: number;
        by: number;
    } | null;
    /** 官方 Geometry.polygonArea：填充图形的多边形面积 */
    get polygonArea(): number;
    /** 官方 Geometry.polygonLength：把曲线当直线的总长 */
    get polygonLength(): number;
    /** @deprecated 用 GeometryType.Line（本项目取值为 EnumValue 而非官方的 1） */
    static readonly Line: EnumValue;
    /** @deprecated 用 GeometryType.Rectangle */
    static readonly Rectangle: EnumValue;
    /** @deprecated 用 GeometryType.Ellipse */
    static readonly Ellipse: EnumValue;
    /** @deprecated 用 GeometryType.Path */
    static readonly Path: EnumValue;
    /** 官方 Geometry.stringifyFixed：返回固定小数位的反向转换器 */
    static stringifyFixed(digits: number): (val: Geometry) => string;
    /** 官方 Geometry.fillPath：给每个未填充的子路径补 F 标记 */
    static fillPath(str: string): string;
    /** 官方 Geometry.computeConvexHull：Andrew 单调链 */
    static computeConvexHull(pts: Point[]): Point[];
    /** 官方 Geometry.generatePolygon：由点集生成多边形/折线 Geometry */
    static generatePolygon(arr: Point[], corner?: number, closed?: boolean): Geometry;
}
