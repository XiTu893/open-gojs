/**
 * EnumValue - GoJS 风格的枚举值基类
 * 每个枚举值是唯一对象实例，通过名称标识
 */
declare class EnumValue {
    readonly _name: string;
    constructor(name: string);
    toString(): string;
}
declare const PanelAuto: EnumValue;
declare const PanelVertical: EnumValue;
declare const PanelHorizontal: EnumValue;
declare const PanelSpot: EnumValue;
declare const PanelTable: EnumValue;
declare const PanelPosition: EnumValue;
declare const PanelGrid: EnumValue;
declare const PanelViewbox: EnumValue;
declare const PanelGraduated: EnumValue;
declare const PanelLink: EnumValue;
declare const PanelTableColumn: EnumValue;
declare const PanelTableRow: EnumValue;
declare const StretchDefault: EnumValue;
declare const StretchFill: EnumValue;
declare const StretchNone: EnumValue;
declare const StretchUniform: EnumValue;
declare const StretchUniformToFill: EnumValue;
declare const StretchHorizontal: EnumValue;
declare const StretchVertical: EnumValue;
declare const FlipNone: EnumValue;
declare const FlipHorizontal: EnumValue;
declare const FlipVertical: EnumValue;
declare const FlipBoth: EnumValue;
declare const RoutingNormal: EnumValue;
declare const RoutingOrthogonal: EnumValue;
declare const RoutingAvoidsNodes: EnumValue;
declare const CurveNone: EnumValue;
declare const CurveBezier: EnumValue;
declare const CurveJumpOver: EnumValue;
declare const CurveJumpGap: EnumValue;
declare const WrapFit: EnumValue;
declare const WrapDesiredSize: EnumValue;
declare const WrapNone: EnumValue;
declare const OverflowClip: EnumValue;
declare const OverflowEllipsis: EnumValue;
declare const ImageStretchNone: EnumValue;
declare const ImageStretchFill: EnumValue;
declare const ImageStretchUniform: EnumValue;
declare const ImageStretchUniformToFill: EnumValue;
declare const SizingNone: EnumValue;
declare const SizingProp: EnumValue;
declare const SizingAuto: EnumValue;
declare const TreeStyleLayered: EnumValue;
declare const TreeStyleAlternating: EnumValue;
declare const TreeStyleLastParents: EnumValue;
declare const TreeStyleCompact: EnumValue;
declare const TreeStyleRootOnly: EnumValue;
declare const TreePathDefault: EnumValue;
declare const TreePathDestination: EnumValue;
declare const TreePathSource: EnumValue;
declare const TreeArrangementVertical: EnumValue;
declare const TreeArrangementHorizontal: EnumValue;
declare const TreeArrangementFixedRoots: EnumValue;
declare const TreeLayerStyleIndividual: EnumValue;
declare const TreeLayerStyleUniform: EnumValue;
declare const TreeSortingForwards: EnumValue;
declare const TreeSortingReverse: EnumValue;
declare const TreeSortingAscending: EnumValue;
declare const TreeSortingDescending: EnumValue;
declare const TreeCompactionBlock: EnumValue;
declare const TreeCompactionNone: EnumValue;
declare const CircularArrangementConstantDistance: EnumValue;
declare const CircularArrangementConstantAngle: EnumValue;
declare const CircularArrangementConstantRadius: EnumValue;
declare const CircularArrangementPacked: EnumValue;
declare const CircularDirectionClockwise: EnumValue;
declare const CircularDirectionBidirectionalLeft: EnumValue;
declare const CircularDirectionBidirectionalRight: EnumValue;
declare const LayeredDigraphDirectionDown: EnumValue;
declare const LayeredDigraphDirectionUp: EnumValue;
declare const LayeredDigraphDirectionLeft: EnumValue;
declare const LayeredDigraphDirectionRight: EnumValue;
declare const LayeredDigraphAlignTop: EnumValue;
declare const LayeredDigraphAlignBottom: EnumValue;
declare const LayeredDigraphAlignCenter: EnumValue;
declare const LayeredDigraphAlignUpper: EnumValue;
declare const LayeredDigraphAlignLower: EnumValue;
declare const LayeredDigraphAggressiveNone: EnumValue;
declare const LayeredDigraphAggressiveHorizontal: EnumValue;
declare const LayeredDigraphAggressiveVertical: EnumValue;
declare const LayeredDigraphAggressiveAll: EnumValue;
declare const LayeredDigraphPackNone: EnumValue;
declare const LayeredDigraphPackAll: EnumValue;
declare const LayeredDigraphPackExpand: EnumValue;
declare const LayeredDigraphPackStraighten: EnumValue;
declare const LayeredDigraphPackMedian: EnumValue;
declare const GridLayoutLocation: EnumValue;
declare const GridLayoutCenter: EnumValue;
declare const GridArrangementLeftToRight: EnumValue;
declare const GridArrangementRightToLeft: EnumValue;
declare const GridArrangementTopToBottom: EnumValue;
declare const GridArrangementBottomToTop: EnumValue;
declare const GridWrappingNone: EnumValue;
declare const GridWrappingFit: EnumValue;
declare const AnimationDefault: EnumValue;
declare const AnimationEaseInOut: EnumValue;
declare const AnimationEaseIn: EnumValue;
declare const AnimationEaseOut: EnumValue;
declare const AnimationLinear: EnumValue;
declare const AnimationEaseOutBounce: EnumValue;
declare const AutoScaleNone: EnumValue;
declare const AutoScaleUniform: EnumValue;
declare const AutoScaleUniformToFill: EnumValue;
declare const ScrollDocument: EnumValue;
declare const ScrollInfinite: EnumValue;
declare const CycleAll: EnumValue;
declare const CycleNotDirected: EnumValue;
declare const CycleNotUndirected: EnumValue;
declare const CycleDestinationTree: EnumValue;
declare const CycleSourceTree: EnumValue;
declare const SegmentOrientationNone: EnumValue;
declare const SegmentOrientationAlong: EnumValue;
declare const SegmentOrientationOpposite: EnumValue;
declare const SegmentOrientationParallel: EnumValue;
declare const SegmentOrientationPerpendicular: EnumValue;
declare const SegmentOrientationOrthogonal: EnumValue;
declare const ChangedEventProperty: EnumValue;
declare const ChangedEventInsert: EnumValue;
declare const ChangedEventRemove: EnumValue;
declare const ChangedEventTransaction: EnumValue;
declare const PathSegmentLine: EnumValue;
declare const PathSegmentQuadraticBezier: EnumValue;
declare const PathSegmentCubicBezier: EnumValue;
declare const PathSegmentArc: EnumValue;
declare const PathSegmentMoveTo: EnumValue;
declare const PathSegmentClose: EnumValue;
declare const BrushSolid: EnumValue;
declare const BrushLinear: EnumValue;
declare const BrushRadial: EnumValue;
declare const ViewboxStretchNone: EnumValue;
declare const ViewboxStretchFill: EnumValue;
declare const ViewboxStretchUniform: EnumValue;
declare const ViewboxStretchUniformToFill: EnumValue;
declare const GraduatedPanNone: EnumValue;
declare const GraduatedPanLeft: EnumValue;
declare const GraduatedPanCenter: EnumValue;
declare const GraduatedPanRight: EnumValue;
declare const GridSortingForwards: EnumValue;
declare const GridSortingReverse: EnumValue;
declare const GridSortingAscending: EnumValue;
declare const GridSortingDescending: EnumValue;
declare const GridAlignmentLocation: EnumValue;
declare const GridAlignmentPosition: EnumValue;
declare const CircularSortingForwards: EnumValue;
declare const CircularSortingReverse: EnumValue;
declare const CircularSortingAscending: EnumValue;
declare const CircularSortingDescending: EnumValue;
declare const CircularSortingOptimized: EnumValue;
declare const TreeAlignmentTopLeftBus: EnumValue;
declare const TreeAlignmentBottomRightBus: EnumValue;
declare const TreeAlignmentBus: EnumValue;
declare const TreeAlignmentBusBranching: EnumValue;
declare const TreeAlignmentCenterChildren: EnumValue;
declare const TreeAlignmentCenterSubtrees: EnumValue;
declare const TreeAlignmentStart: EnumValue;
declare const TreeAlignmentEnd: EnumValue;
declare const LayeredDigraphAggressiveLess: EnumValue;
declare const LayeredDigraphAggressiveMore: EnumValue;
declare const LayeredDigraphAlignNone: EnumValue;
declare const LinkAdjustingEnd: EnumValue;
declare const LinkAdjustingStretch: EnumValue;
declare const OrientationNone: EnumValue;
declare const OrientationAlong: EnumValue;
declare const OrientationMinus90: EnumValue;
declare const OrientationPlus90: EnumValue;
declare const OrientationPlus180: EnumValue;
declare const GestureModeNone: EnumValue;
declare const GestureModeCancel: EnumValue;
declare const GestureModeZoom: EnumValue;
declare const WheelModeZoom: EnumValue;
declare const TextEditingAcceptLostFocus: EnumValue;
declare const TextEditingStartingSingleClick: EnumValue;
declare const AnimationStyleDefault: EnumValue;
declare const AnimationStyleAnimateLocations: EnumValue;
declare const AnimationStyleNone: EnumValue;
declare const LayoutConditionsStandard: EnumValue;
declare const LayoutConditionsNodeSized: EnumValue;
declare const GeometryStretchUniform: EnumValue;
declare const GeometryTypeLine: EnumValue;
declare const GeometryTypePath: EnumValue;
declare const CircularNodeDiameterFormulaCircular: EnumValue;
declare const CircularNodeDiameterFormulaPythagorean: EnumValue;
declare const LayeredDigraphCycleRemoveDepthFirst: EnumValue;
declare const LayeredDigraphCycleRemoveGreedy: EnumValue;
declare const LayeredDigraphInitDepthFirstIn: EnumValue;
declare const LayeredDigraphInitDepthFirstOut: EnumValue;
declare const LayeredDigraphInitNaive: EnumValue;
declare const LayeredDigraphLayeringLongestPathSink: EnumValue;
declare const LayeredDigraphLayeringLongestPathSource: EnumValue;
declare const LayeredDigraphLayeringOptimalLinkLength: EnumValue;
declare const LinkingDirectionForwardsOnly: EnumValue;
declare const TriggerStartBundled: EnumValue;
declare const TreeLayerStyleSiblings: EnumValue;

/**
 * 可迭代接口
 */
interface Iterable<T> {
    /** 返回迭代器 */
    iterator: Iterator<T>;
    /** 集合大小 */
    readonly count: number;
}
/**
 * 迭代器接口
 */
interface Iterator<T> {
    /** 是否有下一个元素 */
    next(): boolean;
    /** 当前元素值 */
    readonly value: T;
    /** 重置迭代器 */
    reset(): void;
    /** 转换为数组 */
    toArray(): T[];
    /** 遍历所有元素执行回调 */
    each(func: (item: T) => void): Iterator<T>;
}
/**
 * 键值对迭代器接口
 */
interface IMapIterator<K, V> extends Iterator<V> {
    /** 当前键 */
    readonly key: K;
}

/**
 * List - 有序列表集合
 */
declare class List<T> implements Iterable<T> {
    private _data;
    constructor(iterable?: Iterable<T> | T[]);
    get count(): number;
    get length(): number;
    get size(): number;
    get iterator(): Iterator<T>;
    /** 是否为空 */
    get isEmpty(): boolean;
    /** 获取第一个元素 */
    get first(): T | undefined;
    /** 获取最后一个元素 */
    get last(): T | undefined;
    /** 添加元素到末尾 */
    add(item: T): this;
    addAll(coll: Iterable<T> | T[]): this;
    /** 在指定位置插入元素 */
    insert(index: number, item: T): this;
    /** 移除指定元素 */
    remove(item: T): boolean;
    /** 移除指定位置的元素 */
    removeAt(index: number): T | undefined;
    /** 移除第一个元素 */
    removeFirst(): T | undefined;
    /** 移除最后一个元素 */
    removeLast(): T | undefined;
    /** 清空列表 */
    clear(): this;
    /** 是否包含指定元素 */
    contains(item: T): boolean;
    /** 查找元素索引 */
    indexOf(item: T): number;
    /** 获取指定位置的元素 */
    get(index: number): T | undefined;
    /** 设置指定位置的元素 */
    set(index: number, item: T): this;
    /** 转换为数组 */
    toArray(): T[];
    /** 遍历 */
    each(func: (item: T, index: number) => void): this;
    /** 映射 */
    map<U>(func: (item: T, index: number) => U): List<U>;
    /** 过滤 */
    filter(func: (item: T, index: number) => boolean): List<T>;
    /** 排序 */
    sort(compare?: (a: T, b: T) => number): this;
    /** 反转 */
    reverse(): this;
    /** 复制 */
    copy(): List<T>;
}

/**
 * Map - 键值映射集合
 */
declare class Map<K, V> implements Iterable<V> {
    private _keys;
    private _values;
    constructor(iterable?: Map<K, V> | Array<[K, V]>);
    get count(): number;
    get size(): number;
    get iterator(): IMapIterator<K, V>;
    /** 获取所有键 */
    get keys(): Iterator<K>;
    /** 获取所有值 */
    get values(): Iterator<V>;
    /** 是否为空 */
    get isEmpty(): boolean;
    /** 添加键值对 */
    add(key: K, value: V): V | undefined;
    set(key: K, value: V): V | undefined;
    /** 获取值 */
    get(key: K): V | undefined;
    /** 获取值，带默认值 */
    getValue(key: K, defaultValue?: V): V | undefined;
    /** 是否包含键 */
    contains(key: K): boolean;
    /** 是否包含键（同 contains） */
    has(key: K): boolean;
    /** 移除键值对 */
    remove(key: K): V | undefined;
    /** 清空 */
    clear(): this;
    /** 转换为对象 */
    toObject(): Record<string, V>;
    toArray(): {
        key: K;
        value: V;
    }[];
    /** 遍历 */
    each(func: (value: V, key: K) => void): this;
    /** 复制 */
    copy(): Map<K, V>;
    /** 获取第一个键值对 */
    first(): {
        key: K;
        value: V;
    } | null;
    /** 获取最后一个键值对 */
    last(): {
        key: K;
        value: V;
    } | null;
    /** 添加另一个 Map 的所有条目 */
    addAll(map: Map<K, V>): this;
    /** 查找键索引 */
    private _indexOf;
}

/**
 * Set - 无序集合
 */
declare class Set<T> implements Iterable<T> {
    private _data;
    constructor(iterable?: Iterable<T> | T[]);
    get count(): number;
    get size(): number;
    get iterator(): Iterator<T>;
    get isEmpty(): boolean;
    /** 添加元素 */
    add(item: T): this;
    /** 移除元素 */
    remove(item: T): boolean;
    /** 删除元素（同 remove） */
    delete(item: T): boolean;
    /** 是否包含元素 */
    contains(item: T): boolean;
    /** 是否包含元素（同 contains） */
    has(item: T): boolean;
    /** 清空 */
    clear(): this;
    /** 转换为数组 */
    toArray(): T[];
    /** 遍历 */
    each(func: (item: T) => void): this;
    /** 映射 */
    map<U>(func: (item: T) => U): Set<U>;
    /** 过滤 */
    filter(func: (item: T) => boolean): Set<T>;
    /** 并集 */
    union(other: Set<T>): Set<T>;
    /** 交集 */
    intersect(other: Set<T>): Set<T>;
    /** 差集 */
    subtract(other: Set<T>): Set<T>;
    /** 复制 */
    copy(): Set<T>;
    private _indexOf;
}

/**
 * Point - 二维点
 */
declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    /** 是否为只读 */
    private _isReadOnly;
    get isReadOnly(): boolean;
    /** 设置为只读 */
    freeze(): this;
    /** 设置坐标 */
    set(x: number, y: number): this;
    /** 复制 */
    copy(): Point;
    /** 是否等于另一个点 */
    equals(p: Point): boolean;
    /** 近似相等 */
    approximatelyEquals(p: Point, epsilon?: number): boolean;
    /** 加法 */
    add(p: Point): Point;
    /** 减法 */
    subtract(p: Point): Point;
    /** 乘以标量 */
    multiply(s: number): Point;
    /** 除以标量 */
    divide(s: number): Point;
    /** 向量长度 */
    get length(): number;
    /** 距离另一个点 */
    distanceTo(p: Point): number;
    /** 方向角（弧度） */
    direction(): number;
    /** 到另一个点的方向角（弧度） */
    directionTo(p: Point): number;
    /** 归一化 */
    normalize(): Point;
    /** 旋转（弧度） */
    rotate(angle: number): Point;
    /** 点积 */
    dot(p: Point): number;
    /** 叉积 */
    cross(p: Point): number;
    /** 线性插值 */
    static lerp(p1: Point, p2: Point, t: number): Point;
    /** 从字符串解析 "x y" */
    static parse(str: string): Point;
    /** 转换为字符串 */
    toString(): string;
    /** 原点 */
    static readonly Zero: Readonly<Point>;
    static stringify(p: Point): string;
    static stringifyFixed(digits: number): (p: Point) => string;
    static isPoint(p: any): p is Point;
}

/**
 * Size - 尺寸
 */
declare class Size {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
    private _isReadOnly;
    get isReadOnly(): boolean;
    freeze(): this;
    set(width: number, height: number): this;
    copy(): Size;
    equals(s: Size): boolean;
    approximatelyEquals(s: Size, epsilon?: number): boolean;
    /** 是否为空（宽或高为0） */
    get isEmpty(): boolean;
    /** 是否有效（宽和高非负） */
    get isReal(): boolean;
    /** 加法 */
    add(s: Size): Size;
    /** 减法 */
    subtract(s: Size): Size;
    /** 乘以标量 */
    multiply(s: number): Size;
    /** 除以标量 */
    divide(s: number): Size;
    /** 从字符串解析 "w h" */
    static parse(str: string): Size;
    toString(): string;
    static readonly Zero: Readonly<Size>;
    static readonly NaN: Readonly<Size>;
    static stringify(s: Size): string;
    static isSize(s: any): s is Size;
}

/**
 * Rect - 矩形
 */
declare class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(xOrPoint?: number | Point, yOrSize?: number | Size, width?: number, height?: number);
    private _isReadOnly;
    get isReadOnly(): boolean;
    freeze(): this;
    set(x: number, y: number, width: number, height: number): this;
    copy(): Rect;
    equals(r: Rect): boolean;
    approximatelyEquals(r: Rect, epsilon?: number): boolean;
    /** 左边 */
    get left(): number;
    /** 顶边 */
    get top(): number;
    /** 右边 */
    get right(): number;
    /** 底边 */
    get bottom(): number;
    /** 中心点 */
    get center(): Point;
    /** 左上角 */
    get position(): Point;
    /** 尺寸 */
    get size(): Size;
    /** 是否为空 */
    get isEmpty(): boolean;
    /** 是否有效 */
    get isReal(): boolean;
    /** 是否包含点 */
    containsPoint(p: Point): boolean;
    /** 是否包含矩形 */
    containsRect(r: Rect): boolean;
    /** 与另一个矩形相交 */
    intersect(r: Rect): Rect;
    /** 与另一个矩形合并 */
    union(r: Rect): Rect;
    /** 是否与另一个矩形相交 */
    intersects(r: Rect): boolean;
    /** 扩展边距 */
    inflate(margin: number): Rect;
    inflate(dx: number, dy: number): Rect;
    /** 偏移 */
    offset(dx: number, dy: number): Rect;
    /** 设置位置 */
    setPosition(p: Point): this;
    /** 设置尺寸 */
    setSize(s: Size): this;
    /** 从字符串解析 "x y w h" */
    static parse(str: string): Rect;
    toString(): string;
    static readonly Zero: Readonly<Rect>;
    static readonly NaN: Readonly<Rect>;
    static isRect(r: any): r is Rect;
}

/**
 * Spot - 定位点
 * 用归一化坐标 (0-1) + 偏移量表示一个位置
 */
declare class Spot {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    constructor(x?: number, y?: number, offsetX?: number, offsetY?: number);
    private _isReadOnly;
    get isReadOnly(): boolean;
    freeze(): this;
    set(x: number, y: number, offsetX?: number, offsetY?: number): this;
    copy(): Spot;
    equals(s: Spot): boolean;
    approximatelyEquals(s: Spot, epsilon?: number): boolean;
    /** 是否为默认值 */
    get isDefault(): boolean;
    /** 是否为无特殊位置 */
    get isNone(): boolean;
    /** 是否无偏移 */
    get hasNoOffset(): boolean;
    /** 在给定矩形中的实际坐标 */
    positionInRect(r: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): {
        x: number;
        y: number;
    };
    toString(): string;
    static readonly TopLeft: Spot;
    static readonly Top: Spot;
    static readonly TopCenter: Spot;
    static readonly TopRight: Spot;
    static readonly Left: Spot;
    static readonly CenterLeft: Spot;
    static readonly Center: Spot;
    static readonly CenterRight: Spot;
    static readonly Right: Spot;
    static readonly BottomLeft: Spot;
    static readonly Bottom: Spot;
    static readonly BottomCenter: Spot;
    static readonly BottomRight: Spot;
    static readonly Default: Spot;
    static readonly None: Spot;
    static readonly TopSide: Spot;
    static readonly BottomSide: Spot;
    static readonly LeftSide: Spot;
    static readonly RightSide: Spot;
    static readonly TopLeftSides: Spot;
    static readonly TopRightSides: Spot;
    static readonly BottomLeftSides: Spot;
    static readonly BottomRightSides: Spot;
    static readonly LeftRightSides: Spot;
    static readonly TopBottomSides: Spot;
    static readonly AllSides: Spot;
    static parse(str: string): Spot;
    static stringify(s: Spot): string;
    static isSpot(s: any): s is Spot;
}

/**
 * Margin - 边距（上右下左）
 */
declare class Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
    constructor(margin: number);
    constructor(top: number, right: number, bottom: number, left: number);
    constructor(topBottom?: number, right?: number, bottom?: number, left?: number);
    private _isReadOnly;
    get isReadOnly(): boolean;
    freeze(): this;
    set(top: number, right?: number, bottom?: number, left?: number): this;
    copy(): Margin;
    equals(m: Margin): boolean;
    /** 是否所有边距都为0 */
    get isZero(): boolean;
    /** 水平边距总和 */
    get horizontal(): number;
    /** 垂直边距总和 */
    get vertical(): number;
    /** 加法 */
    add(m: Margin): Margin;
    /** 减法 */
    subtract(m: Margin): Margin;
    /** 从字符串解析 "t r b l" 或 "all" */
    static parse(str: string): Margin;
    toString(): string;
    static readonly Zero: Readonly<Margin>;
    static isMargin(m: any): m is Margin;
}
/** MarginLike 类型 - 可以是 Margin 对象或数字 */
type MarginLike = Margin | number;

/**
 * PathSegment - 路径段
 */
declare class PathSegment {
    /** 段类型 */
    type: EnumValue;
    /** 控制点1 X */
    x1: number;
    /** 控制点1 Y */
    y1: number;
    /** 控制点2 X */
    x2: number;
    /** 控制点2 Y */
    y2: number;
    /** 终点 X */
    endX: number;
    /** 终点 Y */
    endY: number;
    /** 是否为闭合段 */
    isClosed: boolean;
    /** 圆弧参数 */
    radiusX: number;
    radiusY: number;
    xAxisRotation: number;
    largeArc: boolean;
    clockwise: boolean;
    /** 是否为相对坐标 */
    isRelative: boolean;
    constructor(type?: EnumValue, endX?: number, endY?: number, x1?: number, y1?: number, x2?: number, y2?: number);
    copy(): PathSegment;
    equals(seg: PathSegment): boolean;
    /** 创建直线段 */
    static Line(endX: number, endY: number): PathSegment;
    /** 创建二次贝塞尔曲线段 */
    static QuadraticBezier(endX: number, endY: number, x1: number, y1: number): PathSegment;
    /** 创建三次贝塞尔曲线段 */
    static CubicBezier(endX: number, endY: number, x1: number, y1: number, x2: number, y2: number): PathSegment;
    /** 创建圆弧段 */
    static Arc(endX: number, endY: number, radiusX: number, radiusY: number, xAxisRotation?: number, largeArc?: boolean, clockwise?: boolean): PathSegment;
    /** 创建移动段 */
    static MoveTo(x: number, y: number): PathSegment;
    close(): PathSegment;
    /** 创建闭合段 */
    static Close(): PathSegment;
}

/**
 * PathFigure - 路径图形（起点 + 段集合）
 */
declare class PathFigure {
    /** 起点 X */
    startX: number;
    /** 起点 Y */
    startY: number;
    /** 是否闭合 */
    isFilled: boolean;
    /** 是否描边 */
    isShadowed: boolean;
    /** 段集合 */
    private _segments;
    constructor(startX?: number, startY?: number, isFilled?: boolean);
    /** 获取段集合 */
    get segments(): List<PathSegment>;
    /** 添加段 */
    add(seg: PathSegment): this;
    /** 移除段 */
    remove(seg: PathSegment): boolean;
    /** 清空段 */
    clear(): this;
    copy(): PathFigure;
    equals(fig: PathFigure): boolean;
}

/**
 * Geometry - 几何路径定义
 */
declare class Geometry {
    /** 图形集合 */
    private _figures;
    /** 默认图形 */
    private _defaultFigure;
    /** 边界矩形 */
    private _bounds;
    /** 是否包含奇偶填充 */
    fillRule: string;
    /** 图形名称（用于 figure 属性） */
    name: string;
    constructor(figures?: PathFigure | PathFigure[]);
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
    /** 获取边界矩形 */
    get bounds(): Rect;
    /** 计算边界矩形 */
    private computeBounds;
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
}

/**
 * Brush - 画刷
 * 支持 Solid（纯色）、Linear（线性渐变）、Radial（径向渐变）
 */
declare class Brush {
    /** 画刷类型 */
    type: EnumValue;
    /** 纯色颜色值 */
    color: string;
    /** 渐变色标 */
    private _stops;
    /** 线性渐变起点 */
    start: Point;
    /** 线性渐变终点 */
    end: Point;
    /** 径向渐变中心 */
    center: Point;
    /** 径向渐变焦点 */
    focus: Point;
    /** 径向渐变半径 */
    radius: number;
    constructor(type?: EnumValue | string);
    /** 获取色标列表 */
    get stops(): BrushStop[];
    /** 添加色标 */
    addColorStop(offset: number, color: string): this;
    set(props: Record<string, any>): this;
    /** 复制 */
    copy(): Brush;
    /** 创建 Canvas 渐变对象 */
    _createCanvasGradient(ctx: CanvasRenderingContext2D, bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): CanvasGradient | null;
    equals(b: Brush): boolean;
    /** 创建纯色画刷 */
    static Solid(color: string): Brush;
    /** 创建线性渐变画刷 */
    static Linear(startX: number, startY: number, endX: number, endY: number): Brush;
    /** 创建径向渐变画刷 */
    static Radial(centerX: number, centerY: number, radius: number, focusX?: number, focusY?: number): Brush;
    /** 判断是否为 Brush */
    static isBrush(b: any): b is Brush;
    static randomColor(): string;
    static darken(color: string, fraction?: number): string;
    static darkenBy(color: string, fraction: number): string;
    static lighten(color: string, fraction?: number): string;
    static lightenBy(color: string, fraction: number): string;
    static isDark(color: string): boolean;
}
/** 色标 */
interface BrushStop {
    offset: number;
    color: string;
}
/** BrushLike 类型 */
type BrushLike = Brush | string | null;
/**
 * 颜色工具函数
 */
declare namespace Color {
    /** 解析 CSS 颜色字符串为 RGBA */
    function parse(color: string): {
        r: number;
        g: number;
        b: number;
        a: number;
    } | null;
    /** RGBA 转字符串 */
    function toString(r: number, g: number, b: number, a?: number): string;
}

/**
 * ChangedEvent - 变更事件
 * 记录模型或图表的属性/插入/删除变更
 */
declare class ChangedEvent {
    /** 变更类型 */
    change: EnumValue;
    /** 变更主体对象 */
    object: any;
    /** 属性名 */
    propertyName: string;
    /** 旧值 */
    oldValue: any;
    /** 新值 */
    newValue: any;
    /** 索引（用于数组操作） */
    index: number;
    /** 事务名称 */
    transactionName: string;
    /** 是否来自模型 */
    isModelChange: boolean;
    /** 产生此事件的 Model */
    model: any;
    /** 额外参数 */
    parameter: any;
    constructor();
    constructor(change: EnumValue, object: any, propertyName?: string, oldValue?: any, newValue?: any, index?: number);
    /** 是否为属性变更 */
    get isPropertyChange(): boolean;
    /** 是否为插入变更 */
    get isInsertChange(): boolean;
    /** 是否为删除变更 */
    get isRemoveChange(): boolean;
    get isTransactionChange(): boolean;
    get isTransactionFinished(): boolean;
    /** 复制 */
    copy(): ChangedEvent;
    /** 重置 */
    clear(): void;
    toString(): string;
}

/**
 * Transaction - 事务
 * 组合多个 ChangedEvent，支持嵌套
 */
declare class Transaction {
    name: string;
    private _changes;
    private _level;
    private _nestedNames;
    constructor(name?: string);
    get changes(): ChangedEvent[];
    get level(): number;
    get nestedNames(): string[];
    addNestedName(name: string): void;
    /** 添加变更事件 */
    addChange(change: ChangedEvent): void;
    begin(): void;
    end(): void;
    /** 是否已完成（无嵌套） */
    get isComplete(): boolean;
    /** 变更数量 */
    get count(): number;
    clear(): void;
    copy(): Transaction;
    toString(): string;
}

/**
 * UndoManager - 撤销管理器
 */
declare class UndoManager {
    private _undoStack;
    private _redoStack;
    private _currentTransaction;
    private _transactionLevel;
    private _maxHistory;
    private _isEnabled;
    private _hasUndo;
    private _hasRedo;
    private _model;
    private _changes;
    private _stateChangedListeners;
    private _skipsUndoManager;
    private _handlesModelChanges;
    constructor();
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get model(): any;
    set model(val: any);
    get transactionLevel(): number;
    get isInTransaction(): boolean;
    get hasUndo(): boolean;
    get hasRedo(): boolean;
    get canUndo(): boolean;
    get canRedo(): boolean;
    get transactionToUndo(): Transaction | null;
    get transactionToRedo(): Transaction | null;
    get currentTransaction(): Transaction | null;
    get undoStack(): Transaction[];
    get redoStack(): Transaction[];
    get maxHistory(): number;
    set maxHistory(val: number);
    startTransaction(name?: string): boolean;
    commitTransaction(name?: string): boolean;
    rollbackTransaction(): boolean;
    handleChanged(change: ChangedEvent): void;
    get handlesModelChanges(): boolean;
    set handlesModelChanges(val: boolean);
    undo(): boolean;
    redo(): boolean;
    /** 清空历史 */
    clear(): void;
    private _undoChange;
    private _redoChange;
    /** 修剪历史记录 */
    private _trimHistory;
    /** 添加状态变更监听器 */
    addStateChangedListener(listener: (manager: UndoManager) => void): void;
    /** 移除状态变更监听器 */
    removeStateChangedListener(listener: (manager: UndoManager) => void): void;
    private _fireStateChanged;
    private _fireTransactionEvent;
}

declare class Binding {
    static OneWay: EnumValue;
    static TwoWay: EnumValue;
    targetProperty: string;
    sourceProperty: string;
    conversion: ((value: any, targetObject: any, model: any) => any) | null;
    backConversion: ((value: any, sourceData: any, model: any) => any) | null;
    mode: EnumValue;
    sourceObject: string | null;
    name: string;
    constructor(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any);
    get isTwoWay(): boolean;
    get isFromModel(): boolean;
    get isToData(): boolean;
    makeTwoWay(backConversion?: (value: any, sourceData: any, model: any) => any): Binding;
    ofModel(): Binding;
    ofObject(name?: string): Binding;
    copy(): Binding;
    getValueFromSource(data: any, targetObject: any, model: any): any;
    getValueFromTarget(targetValue: any, data: any, model: any): any;
    toString(): string;
}

/**
 * ObjectData - 节点/链接数据对象类型
 */
type ObjectData = Record<string, any>;
/**
 * ChangedEventListener - 变更事件监听器
 */
type ChangedEventListener = (e: ChangedEvent) => void;
/**
 * Model - 基础模型
 * 管理 nodeDataArray，支持数据绑定、事务和撤销/重做
 */
declare class Model {
    /** 数据格式名称 */
    dataFormat: string;
    /** 模型名称 */
    name: string;
    /** 节点 key 属性名 */
    nodeKeyProperty: string;
    /** 节点分类属性名 */
    nodeCategoryProperty: string;
    /** 是否只读 */
    isReadOnly: boolean;
    /** 复制时是否深拷贝数组中的对象 */
    copiesArrayObjects: boolean;
    /** 复制时是否深拷贝数组 */
    copiesArrays: boolean;
    /** 复制时是否保留 key */
    copiesKey: boolean;
    /** 点坐标小数位数 */
    pointsDigits: number;
    /** 是否跳过撤销管理器 */
    skipsUndoManager: boolean;
    /** 模型级别数据 */
    modelData: ObjectData;
    /** 自定义 key 生成函数 */
    makeUniqueKeyFunction: ((model: Model, data: ObjectData) => any) | null;
    /** 自定义节点数据复制函数 */
    copyNodeDataFunction: ((data: ObjectData, model: Model) => ObjectData) | null;
    /** 节点是否为分组的属性名 */
    nodeIsGroupProperty: string;
    /** 节点所属分组 key 的属性名 */
    nodeGroupKeyProperty: string;
    /** 链接标签 key 数组的属性名 */
    linkLabelKeysProperty: string;
    /** 自定义链接 key 生成函数 */
    makeUniqueLinkKeyFunction: ((model: Model, data: ObjectData) => any) | null;
    /** 自定义链接数据复制函数 */
    copyLinkDataFunction: ((data: ObjectData, model: Model) => ObjectData) | null;
    private _nodeDataArray;
    private _undoManager;
    private _changedListeners;
    private _keyMap;
    private _nextKey;
    constructor();
    constructor(init: Partial<Model> | ObjectData[]);
    get nodeDataArray(): ObjectData[];
    set nodeDataArray(val: ObjectData[]);
    /** 添加节点数据 */
    addNodeData(data: ObjectData): void;
    /** 添加节点数据集合 */
    addNodeDataCollection(coll: ObjectData[] | List<ObjectData>): void;
    /** 移除节点数据 */
    removeNodeData(data: ObjectData): boolean;
    /** 移除节点数据集合 */
    removeNodeDataCollection(coll: ObjectData[] | List<ObjectData>): void;
    /** 是否包含节点数据 */
    containsNodeData(data: ObjectData): boolean;
    /** 根据 key 查找节点数据 */
    findNodeDataForKey(key: any): ObjectData | undefined;
    /** 获取节点的 key */
    getKeyForNodeData(data: ObjectData): any;
    /** 设置节点的 key */
    setKeyForNodeData(data: ObjectData, key: any): void;
    /** 获取节点的分类 */
    getCategoryForNodeData(data: ObjectData): string;
    /** 设置节点的分类 */
    setCategoryForNodeData(data: ObjectData, category: string): void;
    /** 判断节点是否为分组 */
    isGroupForNodeData(data: ObjectData): boolean;
    /** 设置节点是否为分组 */
    setIsGroupForNodeData(data: ObjectData, flag: boolean): void;
    /** 获取节点的分组 key */
    getGroupKeyForNodeData(data: ObjectData): any;
    /** 设置节点的分组 key */
    setGroupKeyForNodeData(data: ObjectData, key: any): void;
    /** 获取 modelData 中的属性 */
    getModelData(key: string): any;
    /** 设置 modelData 中的属性（支持撤销） */
    setModelData(key: string, value: any): void;
    /** 设置数据属性（支持撤销） */
    setDataProperty(data: ObjectData, propname: string, value: any): void;
    /** 向数组添加项 */
    addArrayItem(arr: any[], item: any): void;
    /** 在数组指定位置插入项 */
    insertArrayItem(arr: any[], index: number, item: any): void;
    /** 移除数组项 */
    removeArrayItem(arr: any[], index?: number): void;
    /** 确保 key 唯一 */
    ensureUniqueKey(data: ObjectData): void;
    /** 复制节点数据 */
    copyNodeData(data: ObjectData): ObjectData;
    /** 深度克隆 */
    cloneDeep(obj: any): any;
    get undoManager(): UndoManager;
    startTransaction(tname?: string): boolean;
    commitTransaction(tname?: string): boolean;
    rollbackTransaction(): boolean;
    /** 在事务中执行函数 */
    commit(func: () => any, tname?: string): any;
    addChangedListener(listener: ChangedEventListener): void;
    removeChangedListener(listener: ChangedEventListener): void;
    raiseChangedEvent(change: any, object: any, propertyName: string, oldValue: any, newValue: any, index?: number): ChangedEvent;
    raiseTransactionEvent(propertyName: string, tname: string, transObj?: any): ChangedEvent;
    /** 更新目标绑定 */
    updateTargetBindings(propname?: string): void;
    /** 序列化为 JSON */
    toJson(): string;
    /** 从 JSON 反序列化 */
    static fromJson(json: string | object): Model;
    static fromJSON(json: string | object): Model;
    /** 重建 key 映射 */
    private _rebuildKeyMap;
    /** 清空 */
    clear(): void;
    /** 复制模型 */
    copy(): Model;
    /** 模板方法：复制属性到新模型 */
    cloneProtected(copy: Model): void;
    /** 批量设置属性 */
    set(props: Partial<Model>): this;
}

/**
 * GraphLinksModel - 图连接模型
 * 额外管理 linkDataArray，支持任意拓扑
 */
declare class GraphLinksModel extends Model {
    /** 链接 from 属性名 */
    linkFromKeyProperty: string;
    /** 链接 to 属性名 */
    linkToKeyProperty: string;
    /** 链接 fromPort 属性名 */
    linkFromPortIdProperty: string;
    /** 链接 toPort 属性名 */
    linkToPortIdProperty: string;
    /** 链接分类属性名 */
    linkCategoryProperty: string;
    /** 链接点数据属性名 */
    linkKeyProperty: string;
    /** 是否自动创建缺失的节点 */
    createMissingNodeData: boolean;
    private _linkDataArray;
    private _linkKeyMap;
    private _nextLinkKey;
    constructor();
    constructor(init: Partial<GraphLinksModel> | ObjectData[], linkDataArray?: ObjectData[]);
    get linkDataArray(): ObjectData[];
    set linkDataArray(val: ObjectData[]);
    /** 添加链接数据 */
    addLinkData(data: ObjectData): void;
    /** 移除链接数据 */
    removeLinkData(data: ObjectData): boolean;
    /** 是否包含链接数据 */
    containsLinkData(data: ObjectData): boolean;
    /** 根据 key 查找链接数据 */
    findLinkDataForKey(key: any): ObjectData | undefined;
    /** 获取链接的 from key */
    getFromKeyForLinkData(data: ObjectData): any;
    /** 设置链接的 from key */
    setFromKeyForLinkData(data: ObjectData, key: any): void;
    /** 获取链接的 to key */
    getToKeyForLinkData(data: ObjectData): any;
    /** 设置链接的 to key */
    setToKeyForLinkData(data: ObjectData, key: any): void;
    /** 获取链接的 fromPort */
    getFromPortIdForLinkData(data: ObjectData): string;
    /** 设置链接的 fromPort */
    setFromPortIdForLinkData(data: ObjectData, portId: string): void;
    /** 获取链接的 toPort */
    getToPortIdForLinkData(data: ObjectData): string;
    /** 设置链接的 toPort */
    setToPortIdForLinkData(data: ObjectData, portId: string): void;
    /** 获取链接的标签 key 数组 */
    getLabelKeysForLinkData(data: ObjectData): any[];
    /** 设置链接的标签 key 数组 */
    setLabelKeysForLinkData(data: ObjectData, keys: any[]): void;
    /** 获取链接分类 */
    getCategoryForLinkData(data: ObjectData): string;
    /** 设置链接分类 */
    setCategoryForLinkData(data: ObjectData, category: string): void;
    /** 获取链接 key */
    getLinkKeyForData(data: ObjectData): any;
    /** 设置链接 key */
    setLinkKeyForData(data: ObjectData, key: any): void;
    toJson(): string;
    static fromJson(json: string | object): GraphLinksModel;
    private _rebuildLinkKeyMap;
    clear(): void;
    copy(): GraphLinksModel;
    cloneProtected(copy: Model): void;
}

/**
 * TreeModel - 树模型
 * 通过 parentKey 属性定义层级关系，无需 linkDataArray
 */
declare class TreeModel extends Model {
    nodeParentKeyProperty: string;
    constructor();
    constructor(init: Partial<TreeModel> | ObjectData[]);
    /** 获取节点的父节点 key */
    getParentKeyForNodeData(data: ObjectData): any;
    /** 设置节点的父节点 key */
    setParentKeyForNodeData(data: ObjectData, key: any): void;
    toJson(): string;
    static fromJson(json: string | object): TreeModel;
    copy(): TreeModel;
    cloneProtected(copy: Model): void;
}

/**
 * RowColumnDefinition - defines the sizing and appearance of a row or column in a Table panel.
 */
declare class RowColumnDefinition {
    private _row;
    private _column;
    private _height;
    private _width;
    private _minimum;
    private _maximum;
    private _sizing;
    private _separatorStroke;
    private _separatorStrokeWidth;
    private _separatorDashArray;
    private _background;
    private _coversSeparators;
    constructor();
    set(props: Record<string, any>): this;
    get row(): number;
    set row(val: number);
    get column(): number;
    set column(val: number);
    get height(): number;
    set height(val: number);
    get width(): number;
    set width(val: number);
    get minimum(): number;
    set minimum(val: number);
    get maximum(): number;
    set maximum(val: number);
    get sizing(): EnumValue;
    set sizing(val: EnumValue);
    get separatorStroke(): any;
    set separatorStroke(val: any);
    get separatorStrokeWidth(): number;
    set separatorStrokeWidth(val: number);
    get separatorDashArray(): number[] | null;
    set separatorDashArray(val: number[] | null);
    get background(): any;
    set background(val: any);
    get coversSeparators(): boolean;
    set coversSeparators(val: boolean);
    copy(): RowColumnDefinition;
}

/**
 * Panel - container that arranges child GraphObjects according to its type.
 */
declare class Panel extends GraphObject {
    _elements: GraphObject[];
    _rowDefinitions: RowColumnDefinition[];
    _columnDefinitions: RowColumnDefinition[];
    protected _type: EnumValue;
    private _data;
    private _padding;
    private _defaultAlignment;
    private _defaultStretch;
    private _defaultColumnSeparatorStroke;
    private _defaultColumnSeparatorStrokeWidth;
    private _defaultRowSeparatorStroke;
    private _defaultRowSeparatorStrokeWidth;
    private _defaultSeparatorPadding;
    private _columnSizing;
    private _rowSizing;
    private _isClipping;
    private _isEnabled;
    private _alignmentFocusName;
    private _itemArray;
    private _itemTemplate;
    private _itemTemplateMap;
    private _itemCategoryProperty;
    protected _itemIndex: number;
    private _leftIndex;
    private _topIndex;
    private _gridCellSize;
    private _gridOrigin;
    private _graduatedMin;
    private _graduatedMax;
    private _graduatedTickUnit;
    private _graduatedTickBase;
    private _graduatedStart;
    private _graduatedEnd;
    private _viewboxStretch;
    _viewboxScaleX: number;
    _viewboxScaleY: number;
    constructor(type?: EnumValue, init?: Partial<Panel>);
    get type(): EnumValue;
    set type(val: EnumValue);
    get data(): any;
    set data(val: any);
    get padding(): Margin;
    set padding(val: MarginLike);
    get defaultAlignment(): Spot;
    set defaultAlignment(val: Spot);
    get defaultStretch(): EnumValue;
    set defaultStretch(val: EnumValue);
    get defaultColumnSeparatorStroke(): BrushLike;
    set defaultColumnSeparatorStroke(val: BrushLike);
    get defaultColumnSeparatorStrokeWidth(): number;
    set defaultColumnSeparatorStrokeWidth(val: number);
    get defaultRowSeparatorStroke(): BrushLike;
    set defaultRowSeparatorStroke(val: BrushLike);
    get defaultRowSeparatorStrokeWidth(): number;
    set defaultRowSeparatorStrokeWidth(val: number);
    get defaultSeparatorPadding(): Margin;
    set defaultSeparatorPadding(val: MarginLike);
    get columnSizing(): EnumValue;
    set columnSizing(val: EnumValue);
    get rowSizing(): EnumValue;
    set rowSizing(val: EnumValue);
    get isClipping(): boolean;
    set isClipping(val: boolean);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get alignmentFocusName(): string;
    set alignmentFocusName(val: string);
    get itemArray(): any[] | null;
    set itemArray(val: any[] | null);
    get itemTemplate(): Panel | null;
    set itemTemplate(val: Panel | null);
    get itemTemplateMap(): Map<string, Panel>;
    set itemTemplateMap(val: Map<string, Panel>);
    get itemCategoryProperty(): string | Function;
    set itemCategoryProperty(val: string | Function);
    get itemIndex(): number;
    get columnCount(): number;
    get rowCount(): number;
    get leftIndex(): number;
    set leftIndex(val: number);
    get topIndex(): number;
    set topIndex(val: number);
    get gridCellSize(): Size;
    set gridCellSize(val: Size);
    get gridOrigin(): Point;
    set gridOrigin(val: Point);
    get graduatedMin(): number;
    set graduatedMin(val: number);
    get graduatedMax(): number;
    set graduatedMax(val: number);
    get graduatedTickUnit(): number;
    set graduatedTickUnit(val: number);
    get graduatedTickBase(): number;
    set graduatedTickBase(val: number);
    get graduatedStart(): number;
    set graduatedStart(val: number);
    get graduatedEnd(): number;
    set graduatedEnd(val: number);
    get viewboxStretch(): EnumValue;
    set viewboxStretch(val: EnumValue);
    get elements(): Iterator<GraphObject>;
    get elementCount(): number;
    add(element: GraphObject): Panel;
    /** Propagate the _part reference to a child element and its descendants */
    private _propagatePart;
    /** Recursively set _part on an element and its children */
    private _setPartRecursive;
    remove(element: GraphObject): Panel;
    removeAt(index: number): Panel;
    insertAt(index: number, element: GraphObject): Panel;
    elt(index: number): GraphObject;
    findObject(name: string): GraphObject | null;
    findMainElement(): GraphObject | null;
    findItemPanelForData(data: any): Panel | null;
    getColumnDefinition(index: number): RowColumnDefinition;
    addColumnDefinition(index?: number, width?: number): RowColumnDefinition;
    getRowDefinition(index: number): RowColumnDefinition;
    addRowDefinition(index?: number, height?: number): RowColumnDefinition;
    removeColumnDefinition(index: number, count?: number): Panel;
    removeRowDefinition(index: number, count?: number): Panel;
    rebuildItemElements(): void;
    updateTargetBindings(propname?: string): void;
    copy(): Panel;
    /** Copy Panel-specific properties to another Panel */
    protected _copyPanelPropertiesTo(copy: Panel): void;
    _measure(widthConstraint: number, heightConstraint: number): void;
    _arrange(bounds: Rect): void;
    /**
     * Find the main element and separate others.
     * The main element is the first visible element with isPanelMain=true,
     * or the first visible element if none has isPanelMain.
     */
    private _findMainAndOthers;
    private _measureAuto;
    private _arrangeAuto;
    private _measureVertical;
    private _arrangeVertical;
    private _measureHorizontal;
    private _arrangeHorizontal;
    private _measureSpot;
    private _arrangeSpot;
    private _measureTable;
    private _arrangeTable;
    private _measurePosition;
    private _arrangePosition;
    private _measureViewbox;
    private _arrangeViewbox;
    private _measureGraduated;
    private _arrangeGraduated;
    private _measureLink;
    private _arrangeLink;
    private _getPointAtDistance;
    private _getAngleAtDistance;
    private _resolveAlignment;
    private _resolveAlignmentFocus;
    private _resolveStretchWidth;
    private _resolveStretchHeight;
    /** Compute the uniform scale factor for an element */
    private _resolveUniformScale;
    private _ensureColumnDefinition;
    private _ensureRowDefinition;
    private _computeColumnWidths;
    private _computeRowHeights;
    private _findItemTemplate;
    _handleObjectPropertyChanged(obj: GraphObject, propname: string, value?: any): void;
    static Auto: EnumValue;
    static Vertical: EnumValue;
    static Horizontal: EnumValue;
    static Spot: EnumValue;
    static Table: EnumValue;
    static Position: EnumValue;
    static Grid: EnumValue;
    static Viewbox: EnumValue;
    static Graduated: EnumValue;
    static Link: EnumValue;
    static TableColumn: EnumValue;
    static TableRow: EnumValue;
}

/**
 * Part - base class for top-level visual elements (Node, Link, Adornment).
 * Extends Panel with location, selection, shadow, and adornment support.
 */
declare class Part extends Panel {
    protected _diagram: any;
    protected _location: Point;
    protected _locationSpot: Spot;
    protected _locationObjectName: string;
    protected _movable: boolean;
    protected _copyable: boolean;
    protected _deletable: boolean;
    protected _selectable: boolean;
    protected _isSelected: boolean;
    protected _isHighlighted: boolean;
    protected _isLayoutPositioned: boolean;
    private _isInDocumentBounds;
    protected _isShadowed: boolean;
    protected _shadowOffset: Point;
    private _shadowColor;
    private _shadowBlur;
    private _layerName;
    private _zOrder;
    private _canStart;
    private _dragComputation;
    protected _selectionAdorned: boolean;
    private _selectionAdornmentTemplate;
    private _adornments;
    private _category;
    protected _itemIndex: number;
    protected _containingGroup: any;
    constructor(type?: EnumValue);
    get visible(): boolean;
    set visible(val: boolean);
    get location(): Point;
    set location(val: Point);
    get locationSpot(): Spot;
    set locationSpot(val: Spot);
    get locationObjectName(): string;
    set locationObjectName(val: string);
    get movable(): boolean;
    set movable(val: boolean);
    get copyable(): boolean;
    set copyable(val: boolean);
    get deletable(): boolean;
    set deletable(val: boolean);
    get selectable(): boolean;
    set selectable(val: boolean);
    get selectionAdorned(): boolean;
    set selectionAdorned(val: boolean);
    get selectionAdornmentTemplate(): any;
    set selectionAdornmentTemplate(val: any);
    get isSelected(): boolean;
    set isSelected(val: boolean);
    get isHighlighted(): boolean;
    set isHighlighted(val: boolean);
    get isLayoutPositioned(): boolean;
    set isLayoutPositioned(val: boolean);
    get isInDocumentBounds(): boolean;
    set isInDocumentBounds(val: boolean);
    get isShadowed(): boolean;
    set isShadowed(val: boolean);
    get shadowOffset(): Point;
    set shadowOffset(val: Point);
    get shadowColor(): string;
    set shadowColor(val: string);
    get shadowBlur(): number;
    set shadowBlur(val: number);
    get layerName(): string;
    set layerName(val: string);
    get zOrder(): number;
    set zOrder(val: number);
    get canStart(): boolean;
    set canStart(val: boolean);
    get dragComputation(): ((part: Part, newLoc: Point, snappedLoc: Point) => Point) | null;
    set dragComputation(val: ((part: Part, newLoc: Point, snappedLoc: Point) => Point) | null);
    get adornments(): Map<string, any>;
    set adornments(val: Map<string, any>);
    get category(): string;
    set category(val: string);
    get itemIndex(): number;
    set itemIndex(val: number);
    get isTopLevel(): boolean;
    get isVirtual(): boolean;
    get containingGroup(): any;
    set containingGroup(val: any);
    get adornmentStream(): Iterator<any>;
    /** Find a named GraphObject within this Part */
    findObject(name: string): GraphObject | null;
    /** Find the main element of this Part */
    findMainElement(): GraphObject | null;
    /** Ensure the bounds of this Part are computed */
    ensureBounds(): void;
    /** Get the bounding rectangle in document coordinates */
    getDocumentBounds(): Rect;
    /** Move this Part to a new location */
    move(newLoc: Point): void;
    /** Add an adornment for the given category */
    addAdornment(category: string, ad: any): void;
    /** Remove the adornment for the given category */
    removeAdornment(category: string): void;
    /** Get the adornment for the given category */
    getAdornment(category: string): any | null;
    /** Remove all adornments */
    clearAdornments(): void;
    _createSelectionAdornment(): any;
    copy(): Part;
    /** Copy Part-specific properties to another Part */
    protected _copyPartPropertiesTo(copy: Part): void;
    /** Update target bindings for a given property, or all if no property name given */
    updateTargetBindings(propname?: string): void;
}

type Diagram$1 = any;
type Layer$1 = any;
/**
 * GraphObject - base class for ALL visual objects in the GoJS diagramming library.
 * This includes shapes, text blocks, pictures, panels, and parts.
 */
declare class GraphObject {
    protected _panel: Panel | null;
    protected _part: Part | null;
    protected _actualBounds: Rect;
    protected _measuredBounds: Rect;
    protected _naturalBounds: Rect;
    protected _bindings: Binding[];
    protected _isInDocument: boolean;
    protected _isPlaceholder: boolean;
    protected _className: string;
    private _desiredSize;
    private _minSize;
    private _maxSize;
    private _margin;
    private _alignment;
    private _alignmentFocus;
    private _angle;
    private _opacity;
    protected _visible: boolean;
    private _stretch;
    private _cursor;
    private _name;
    private _column;
    private _columnSpan;
    private _row;
    private _rowSpan;
    private _scale;
    private _interval;
    private _flip;
    private _shadowVisible;
    private _background;
    private _pickable;
    private _isActionable;
    private _isPanelMain;
    private _portId;
    private _contextMenu;
    private _toolTip;
    private _fromLinkable;
    private _toLinkable;
    private _fromLinkableDuplicates;
    private _toLinkableDuplicates;
    private _fromLinkableSelfNode;
    private _toLinkableSelfNode;
    private _fromMaxLinks;
    private _toMaxLinks;
    private _fromSpot;
    private _toSpot;
    private _fromEndSegmentLength;
    private _toEndSegmentLength;
    private _fromShortLength;
    private _toShortLength;
    private _segmentIndex;
    private _segmentFraction;
    private _segmentOffset;
    private _segmentOrientation;
    private _position;
    private _click;
    private _doubleClick;
    private _contextClick;
    private _mouseEnter;
    private _mouseLeave;
    private _mouseOver;
    private _mouseHover;
    private _mouseHold;
    private _mouseDragEnter;
    private _mouseDragLeave;
    private _mouseDrop;
    private _actionDown;
    private _actionMove;
    private _actionUp;
    private _actionCancel;
    private _enabledChanged;
    constructor();
    /** Convenience property for desiredSize.width */
    get width(): number;
    set width(val: number);
    /** Convenience property for desiredSize.height */
    get height(): number;
    set height(val: number);
    get desiredSize(): Size;
    set desiredSize(val: Size);
    get minSize(): Size;
    set minSize(val: Size);
    get maxSize(): Size;
    set maxSize(val: Size);
    get margin(): Margin;
    set margin(val: MarginLike);
    get alignment(): Spot;
    set alignment(val: Spot);
    get alignmentFocus(): Spot;
    set alignmentFocus(val: Spot);
    get angle(): number;
    set angle(val: number);
    get opacity(): number;
    set opacity(val: number);
    get visible(): boolean;
    set visible(val: boolean);
    get stretch(): EnumValue;
    set stretch(val: EnumValue);
    get cursor(): string;
    set cursor(val: string);
    get name(): string;
    set name(val: string);
    get position(): Point;
    set position(val: Point);
    get column(): number;
    set column(val: number);
    get columnSpan(): number;
    set columnSpan(val: number);
    get row(): number;
    set row(val: number);
    get rowSpan(): number;
    set rowSpan(val: number);
    get interval(): number;
    set interval(val: number);
    get scale(): number;
    set scale(val: number);
    get flip(): EnumValue;
    set flip(val: EnumValue);
    get shadowVisible(): boolean | null;
    set shadowVisible(val: boolean | null);
    get background(): BrushLike;
    set background(val: BrushLike);
    get pickable(): boolean;
    set pickable(val: boolean);
    get isActionable(): boolean;
    set isActionable(val: boolean);
    get isPanelMain(): boolean;
    set isPanelMain(val: boolean);
    get portId(): string;
    set portId(val: string);
    get contextMenu(): any;
    set contextMenu(val: any);
    get toolTip(): any;
    set toolTip(val: any);
    get fromLinkable(): boolean;
    set fromLinkable(val: boolean);
    get toLinkable(): boolean;
    set toLinkable(val: boolean);
    get fromLinkableDuplicates(): boolean;
    set fromLinkableDuplicates(val: boolean);
    get toLinkableDuplicates(): boolean;
    set toLinkableDuplicates(val: boolean);
    get fromLinkableSelfNode(): boolean;
    set fromLinkableSelfNode(val: boolean);
    get toLinkableSelfNode(): boolean;
    set toLinkableSelfNode(val: boolean);
    get fromMaxLinks(): number;
    set fromMaxLinks(val: number);
    get toMaxLinks(): number;
    set toMaxLinks(val: number);
    get fromSpot(): Spot;
    set fromSpot(val: Spot);
    get toSpot(): Spot;
    set toSpot(val: Spot);
    get fromEndSegmentLength(): number;
    set fromEndSegmentLength(val: number);
    get toEndSegmentLength(): number;
    set toEndSegmentLength(val: number);
    get fromShortLength(): number;
    set fromShortLength(val: number);
    get toShortLength(): number;
    set toShortLength(val: number);
    get segmentIndex(): number;
    set segmentIndex(val: number);
    get segmentFraction(): number;
    set segmentFraction(val: number);
    get segmentOffset(): Point;
    set segmentOffset(val: Point);
    get segmentOrientation(): EnumValue;
    set segmentOrientation(val: EnumValue);
    get actualBounds(): Rect;
    get measuredBounds(): Rect;
    get naturalBounds(): Rect;
    get panel(): Panel | null;
    get part(): Part | null;
    get diagram(): Diagram$1 | null;
    get layer(): Layer$1 | null;
    get click(): ((e: any, obj: GraphObject) => void) | null;
    set click(val: ((e: any, obj: GraphObject) => void) | null);
    get doubleClick(): ((e: any, obj: GraphObject) => void) | null;
    set doubleClick(val: ((e: any, obj: GraphObject) => void) | null);
    get contextClick(): ((e: any, obj: GraphObject) => void) | null;
    set contextClick(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseEnter(): ((e: any, obj: GraphObject) => void) | null;
    set mouseEnter(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseLeave(): ((e: any, obj: GraphObject) => void) | null;
    set mouseLeave(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseOver(): ((e: any, obj: GraphObject) => void) | null;
    set mouseOver(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseHover(): ((e: any, obj: GraphObject) => void) | null;
    set mouseHover(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseHold(): ((e: any, obj: GraphObject) => void) | null;
    set mouseHold(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseDragEnter(): ((e: any, obj: GraphObject) => void) | null;
    set mouseDragEnter(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseDragLeave(): ((e: any, obj: GraphObject) => void) | null;
    set mouseDragLeave(val: ((e: any, obj: GraphObject) => void) | null);
    get mouseDrop(): ((e: any, obj: GraphObject) => void) | null;
    set mouseDrop(val: ((e: any, obj: GraphObject) => void) | null);
    get actionDown(): ((e: any, obj: GraphObject) => void) | null;
    set actionDown(val: ((e: any, obj: GraphObject) => void) | null);
    get actionMove(): ((e: any, obj: GraphObject) => void) | null;
    set actionMove(val: ((e: any, obj: GraphObject) => void) | null);
    get actionUp(): ((e: any, obj: GraphObject) => void) | null;
    set actionUp(val: ((e: any, obj: GraphObject) => void) | null);
    get actionCancel(): ((e: any, obj: GraphObject) => void) | null;
    set actionCancel(val: ((e: any, obj: GraphObject) => void) | null);
    get enabledChanged(): ((obj: GraphObject) => void) | null;
    set enabledChanged(val: ((obj: GraphObject) => void) | null);
    /** Add a data binding to this object */
    bind(bindingOrTargetProp: Binding | string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this;
    bindObject(targetProperty: string, sourceProperty: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any, sourceObject?: string): this;
    bindTwoWay(targetProperty: string, sourceProperty?: string, backConversion?: (value: any, sourceData: any, model: any) => any, conversion?: (value: any, targetObject: any, model: any) => any): this;
    theme(targetProperty: string, sourceProperty: string, conversion?: (value: any, targetObject: any, model: any) => any): this;
    themeData(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this;
    themeModel(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this;
    themeObject(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any, objectname?: string): this;
    bindModel(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this;
    setProperties(props: Record<string, any>): this;
    /** Batch set properties */
    set(props: Partial<GraphObject>): this;
    /** Virtual copy - creates a shallow copy of this GraphObject */
    copy(): GraphObject;
    /** Apply a function to this object and return it */
    apply(func: (obj: GraphObject) => void): GraphObject;
    /** Find the nearest panel that has data bound to it */
    findBindingPanel(): Panel | null;
    attach(props: Record<string, any>): this;
    /** Get the total angle of this object in document coordinates */
    getDocumentAngle(): number;
    /** Get the bounding rectangle of this object in document coordinates */
    getDocumentBounds(): Rect;
    /** Convert a local point to document coordinates */
    getDocumentPoint(local: Point): Point;
    /** Get the total scale of this object in document coordinates */
    getDocumentScale(): number;
    /** Convert a document point to local coordinates */
    getLocalPoint(p: Point): Point;
    /** Check if this object is contained by the given panel */
    isContainedBy(panel: Panel): boolean;
    /** Check if this object is effectively enabled */
    isEnabledObject(): boolean;
    /** Check if this object is effectively visible */
    isVisibleObject(): boolean;
    /** Trigger a property change notification */
    trigger(propname: string, value?: any): void;
    /** Invalidate the measurement of this object and its ancestors */
    _invalidateMeasure(): void;
    /** Invalidate the arrangement of this object and its ancestors */
    _invalidateArrange(): void;
    /** Measure this object within the given constraints */
    _measure(widthConstraint: number, heightConstraint: number): void;
    /** Apply minSize/maxSize/desiredSize constraints to measured bounds */
    protected _applySizeConstraints(): void;
    /** Arrange this object within the given bounds */
    _arrange(bounds: Rect): void;
    /** Copy all properties to another GraphObject (used by copy()) */
    protected _copyPropertiesTo(copy: GraphObject): void;
    static Default: EnumValue;
    static Fill: EnumValue;
    static Horizontal: EnumValue;
    static Vertical: EnumValue;
    static None: EnumValue;
    static Uniform: EnumValue;
    static UniformToFill: EnumValue;
    /** Factory method for creating GraphObjects - stub */
    static _classRegistry: Record<string, any>;
    static build: typeof GraphObject.make;
    static defineBuilder(name: string, func: Function): void;
    static takeBuilderArgument(obj: any, arg: any, def?: any): any;
    static make(type: any, ...args: any[]): any;
}

/**
 * Shape - 几何图形
 * 表示一个几何形状，支持预定义图形和自定义几何路径
 */
declare class Shape extends GraphObject {
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
    /** 获取几何路径（从图形名称或自定义几何） */
    _getGeometry(): Geometry | null;
    private _getFigureGeometry;
    /** 测量对象尺寸 */
    _measure(widthConstraint: number, heightConstraint: number): void;
    /** 绘制图形 */
    _draw(ctx: CanvasRenderingContext2D): void;
    /** 在 canvas 上绘制几何路径 */
    private _drawGeometry;
    /** Draw an arc segment from current point to endpoint using SVG arc parameters */
    private _drawArcSegment;
    /** 复制 */
    copy(): Shape;
    static defineFigureGenerator(name: string, func: (shape: Shape | null, w: number, h: number) => Geometry): void;
    static getFigureGenerators(): any;
    private static _arrowheadGeometries;
    static getArrowheadGeometries(): Record<string, Geometry>;
    static defineArrowheadGenerator(name: string, func: (shape: Shape | null, w: number, h: number) => Geometry): void;
    private static _getArrowheadGeometry;
    private static _createArrowheadGeometries;
}

declare class TextBlock extends GraphObject {
    static WrapFit: EnumValue;
    static WrapDesiredSize: EnumValue;
    static WrapNone: EnumValue;
    static OverflowClip: EnumValue;
    static OverflowEllipsis: EnumValue;
    static VerticalTop: EnumValue;
    static VerticalCenter: EnumValue;
    static VerticalBottom: EnumValue;
    private _text;
    private _font;
    private _stroke;
    private _textAlign;
    private _isMultiline;
    private _editable;
    private _wrap;
    private _overflow;
    private _lineCount;
    private _spacingAbove;
    private _spacingBelow;
    private _isUnderline;
    private _isStrikethrough;
    private _verticalAlignment;
    constructor(text?: string | Partial<TextBlock>, init?: Partial<TextBlock>);
    get text(): string;
    set text(val: string);
    get font(): string;
    set font(val: string);
    get stroke(): BrushLike;
    set stroke(val: BrushLike);
    get textAlign(): string;
    set textAlign(val: string);
    get isMultiline(): boolean;
    set isMultiline(val: boolean);
    get editable(): boolean;
    set editable(val: boolean);
    get wrap(): EnumValue;
    set wrap(val: EnumValue);
    get overflow(): EnumValue;
    set overflow(val: EnumValue);
    get lineCount(): number;
    get spacingAbove(): number;
    set spacingAbove(val: number);
    get spacingBelow(): number;
    set spacingBelow(val: number);
    get isUnderline(): boolean;
    set isUnderline(val: boolean);
    get isStrikethrough(): boolean;
    set isStrikethrough(val: boolean);
    get verticalAlignment(): EnumValue;
    set verticalAlignment(val: EnumValue);
    get naturalSize(): Size;
    measure(width: number, height: number): void;
    _measure(widthConstraint: number, heightConstraint: number): void;
    _measureText(ctx: CanvasRenderingContext2D, widthConstraint: number): {
        width: number;
        height: number;
        lineCount: number;
    };
    private _wrapText;
    private static _getFontSize;
    private static _tempCanvas;
    _draw(ctx: CanvasRenderingContext2D): void;
    copy(): TextBlock;
}

declare class Picture extends GraphObject {
    static None: EnumValue;
    static Fill: EnumValue;
    static Uniform: EnumValue;
    static UniformToFill: EnumValue;
    private _source;
    private _image;
    private _loadedImage;
    private _imageStretch;
    private _imageAlignment;
    private _sourceRect;
    private _errorFunction;
    private _crossOrigin;
    constructor(source?: string | Partial<Picture>, init?: Partial<Picture>);
    get source(): string;
    set source(val: string);
    get element(): HTMLImageElement | null;
    get image(): HTMLImageElement | null;
    set image(val: HTMLImageElement | null);
    get imageStretch(): EnumValue;
    set imageStretch(val: EnumValue);
    get imageAlignment(): string;
    set imageAlignment(val: string);
    get sourceRect(): Rect | null;
    set sourceRect(val: Rect | null);
    get errorFunction(): ((pic: Picture, e: Event) => void) | null;
    set errorFunction(val: ((pic: Picture, e: Event) => void) | null);
    get crossOrigin(): string | null;
    set crossOrigin(val: string | null);
    private _loadImage;
    _measure(widthConstraint: number, heightConstraint: number): void;
    copy(): Picture;
}

/**
 * Node - a Part that can be connected by Links.
 * Represents a vertex in the graph structure.
 */
declare class Node extends Part {
    protected _isTreeExpanded: boolean;
    protected _wasTreeExpanded: boolean;
    protected _isSubGraphExpanded: boolean;
    protected _treeExpandedDirection: EnumValue;
    constructor(type?: EnumValue | string, init?: Partial<Node>);
    private static _resolvePanelType;
    get isTreeExpanded(): boolean;
    set isTreeExpanded(val: boolean);
    get wasTreeExpanded(): boolean;
    set wasTreeExpanded(val: boolean);
    /** For compatibility with Group */
    get isSubGraphExpanded(): boolean;
    set isSubGraphExpanded(val: boolean);
    get treeExpandedDirection(): EnumValue;
    set treeExpandedDirection(val: EnumValue);
    get isTreeLeaf(): boolean;
    /** Find all links connected to this node */
    findLinksConnected(): List<any>;
    findLinksInto(): List<any>;
    findLinksOutOf(): List<any>;
    findNodesConnected(): List<any>;
    findNodesInto(): List<any>;
    findNodesOutOf(): List<any>;
    /** Find a port element by name */
    findPortWithName(name: string): GraphObject | null;
    isInTreeOf(node: Node): boolean;
    findTreeParentNode(): Node | null;
    findTreeChildrenNodes(): List<Node>;
    findTreeParentLink(): any | null;
    findLevel(): number;
    findCommonParent(node: Node): Node | null;
    /** Create a copy of this Node */
    copy(): Node;
}

/**
 * Link - a Part that represents a connection between two Nodes.
 */
declare class Link extends Part {
    private _fromNode;
    private _toNode;
    private _fromPortId;
    private _toPortId;
    private _routing;
    private _curve;
    private _corner;
    private _curviness;
    private _points;
    private _resegmentable;
    private _adjusting;
    private _relinkableFrom;
    private _relinkableTo;
    private _reshapable;
    private _jumpOver;
    private _jumpGap;
    constructor(type?: EnumValue, init?: Partial<Link>);
    get fromNode(): Node | null;
    set fromNode(val: Node | null);
    get toNode(): Node | null;
    set toNode(val: Node | null);
    get fromPortId(): string;
    set fromPortId(val: string);
    get toPortId(): string;
    set toPortId(val: string);
    get routing(): EnumValue;
    set routing(val: EnumValue);
    get curve(): EnumValue;
    set curve(val: EnumValue);
    get corner(): number;
    set corner(val: number);
    get curviness(): number;
    set curviness(val: number);
    get jumpOver(): number;
    set jumpOver(val: number);
    get jumpGap(): number;
    set jumpGap(val: number);
    get points(): List<Point>;
    set points(val: List<Point>);
    get resegmentable(): boolean;
    set resegmentable(val: boolean);
    get adjusting(): EnumValue;
    set adjusting(val: EnumValue);
    get relinkableFrom(): boolean;
    set relinkableFrom(val: boolean);
    get relinkableTo(): boolean;
    set relinkableTo(val: boolean);
    get reshapable(): boolean;
    set reshapable(val: boolean);
    /** Whether this link uses orthogonal routing */
    get isOrthogonal(): boolean;
    /** Get the link connection point on the from port */
    getLinkPointFromPort(port: GraphObject, spot: Spot): Point;
    /** Get the link connection point on the to port */
    getLinkPointToPort(port: GraphObject, spot: Spot): Point;
    /** Compute the route points for this link */
    computePoints(): boolean;
    /** Resolve the effective fromSpot for this link */
    private _resolveFromSpot;
    private _resolveToSpot;
    private _getPortDirection;
    private _offsetPoint;
    private _perpendicularDir;
    private _isOppositeDir;
    private _distAlongDir;
    private _canReachWithCorner;
    private _cornerPoint;
    /** Get the intersection of a line from center to target with the rectangle edge */
    private _getEdgeIntersection;
    get midPoint(): Point;
    findClosestSegment(p: Point): number;
    copy(): Link;
}

declare class Placeholder extends GraphObject {
    private _padding;
    constructor();
    get padding(): number;
    set padding(val: number);
    get _placeholderBounds(): Rect;
    _measure(availW: number, availH: number): void;
    _arrange(bounds: Rect): void;
    private _findGroup;
    copy(): Placeholder;
}

/**
 * LayoutEdge - represents a link in the layout network.
 */
declare class LayoutEdge {
    /** The network this edge belongs to */
    network: LayoutNetwork | null;
    /** The source vertex of this edge */
    fromVertex: LayoutVertex | null;
    /** The destination vertex of this edge */
    toVertex: LayoutVertex | null;
    /** The Link associated with this edge, if any */
    link: Link | null;
    /** The preferred length of this edge */
    length: number;
    /** The weight of this edge for layout calculations */
    weight: number;
    /** Get the other vertex given one vertex of this edge */
    getOtherVertex(vertex: LayoutVertex): LayoutVertex | null;
}

/**
 * LayoutVertex - represents a node in the layout network.
 */
declare class LayoutVertex {
    /** The network this vertex belongs to */
    network: LayoutNetwork | null;
    /** X position of the vertex center */
    x: number;
    /** Y position of the vertex center */
    y: number;
    /** Bounding rectangle of the vertex */
    bounds: Rect;
    /** Width of the vertex */
    get width(): number;
    set width(val: number);
    /** Height of the vertex */
    get height(): number;
    set height(val: number);
    /** Focus X offset (0-1 relative to width) for connection points */
    focusX: number;
    /** Focus Y offset (0-1 relative to height) for connection points */
    focusY: number;
    /** The Part associated with this vertex, if any */
    part: Part | null;
    /** Edges where this vertex is the source */
    sourceEdges: List<LayoutEdge>;
    /** Edges where this vertex is the destination */
    destinationEdges: List<LayoutEdge>;
    /** The Node associated with this vertex, if any */
    node: Node | null;
    /** Whether this vertex is artificial (not associated with a real part) */
    _isArtificial: boolean;
    /** Internal index for algorithms */
    _index: number;
    /** Add an edge where this vertex is the destination */
    addDestinationEdge(edge: LayoutEdge): void;
    /** Add an edge where this vertex is the source */
    addSourceEdge(edge: LayoutEdge): void;
    /** Delete an edge from both source and destination lists */
    deleteEdge(edge: LayoutEdge): void;
    /** Get the center point of this vertex */
    get center(): {
        x: number;
        y: number;
    };
    static smartComparer(a: LayoutVertex, b: LayoutVertex): number;
}

/**
 * LayoutNetwork - the graph structure used by layouts.
 * Contains vertexes (nodes) and edges (links) for layout computation.
 */
declare class LayoutNetwork {
    /** The layout that owns this network */
    layout: any;
    /** All vertexes in this network */
    vertexes: List<LayoutVertex>;
    /** All edges in this network */
    edges: List<LayoutEdge>;
    /** Map from Link to LayoutEdge */
    linkToLayoutEdge: Map<Link, LayoutEdge>;
    /** Map from Node to LayoutVertex */
    nodeToLayoutVertex: Map<Node, LayoutVertex>;
    /** Add a vertex to this network */
    addVertex(vertex: LayoutVertex): LayoutVertex;
    /** Add an edge to this network */
    addEdge(edge: LayoutEdge): LayoutEdge;
    /** Add a link to the network, creating an edge between the from/to vertexes */
    addLink(link: Link): LayoutEdge | null;
    /** Add a node to the network, creating a vertex */
    addNode(node: Node): LayoutVertex;
    /** Delete all artificial vertexes from the network */
    deleteArtificialVertexes(): void;
    /** Delete self-loop edges (where fromVertex === toVertex) */
    deleteSelfEdges(): void;
    /** Find the vertex associated with a node */
    findVertex(node: Node): LayoutVertex | null;
    /** Find the edge associated with a link */
    findEdge(link: Link): LayoutEdge | null;
    /** Create an edge connecting two vertexes */
    linkVertexes(fromVertex: LayoutVertex, toVertex: LayoutEdge | LayoutVertex): LayoutEdge;
    /** Delete an edge from the network */
    deleteEdge(edge: LayoutEdge): void;
    /** Split this network into sub-networks of connected components */
    splitIntoSubNetworks(): List<LayoutNetwork>;
}

/**
 * Layout - base class for all layout algorithms.
 * Subclasses must override doLayout() to implement specific layout algorithms.
 */
declare class Layout {
    protected _arrangementOrigin: Point;
    protected _isInitial: boolean;
    protected _isOngoing: boolean;
    protected _isRealtime: boolean;
    protected _isRouting: boolean;
    protected _isValidLayout: boolean;
    protected _isViewportSized: boolean;
    protected _boundsComputation: ((layout: Layout, part: Part, bounds: Rect) => Rect) | null;
    protected _network: LayoutNetwork | null;
    protected _diagram: any;
    protected _group: any;
    get arrangementOrigin(): Point;
    set arrangementOrigin(val: Point);
    get isInitial(): boolean;
    set isInitial(val: boolean);
    get isOngoing(): boolean;
    set isOngoing(val: boolean);
    get isRealtime(): boolean;
    set isRealtime(val: boolean);
    get isRouting(): boolean;
    set isRouting(val: boolean);
    get isValidLayout(): boolean;
    set isValidLayout(val: boolean);
    get isViewportSized(): boolean;
    set isViewportSized(val: boolean);
    get boundsComputation(): ((layout: Layout, part: Part, bounds: Rect) => Rect) | null;
    set boundsComputation(val: ((layout: Layout, part: Part, bounds: Rect) => Rect) | null);
    get network(): LayoutNetwork | null;
    set network(val: LayoutNetwork | null);
    get diagram(): any;
    set diagram(val: any);
    get group(): any;
    set group(val: any);
    /**
     * Perform the layout on the given collection of parts.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    doLayout(coll: any): void;
    /**
     * Collect all Parts that should be laid out from the given collection.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    collectParts(coll: any): List<Part>;
    /**
     * Commit the layout by moving parts to their computed positions.
     * Called after the layout algorithm has computed positions.
     */
    commitLayout(): void;
    /**
     * Create a copy of this layout.
     */
    copy(): Layout;
    /**
     * Create a new LayoutNetwork for this layout.
     */
    createNetwork(): LayoutNetwork;
    /**
     * Get the layout bounds of a part.
     * @param part - The part to get bounds for
     */
    getLayoutBounds(part: Part): Rect;
    /**
     * Return the initial origin point for the layout.
     */
    initialOrigin(): Point;
    /**
     * Invalidate this layout, causing it to be re-performed.
     */
    invalidateLayout(): void;
    /**
     * Build a LayoutNetwork from the parts in the given collection.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    makeNetwork(coll: any): LayoutNetwork;
    /**
     * Update the positions of parts after the layout has been computed.
     */
    updateParts(): void;
}

declare class Group extends Node {
    protected _handlesDragDrop: boolean;
    private _memberParts;
    protected _ungroupable: boolean;
    private _layout;
    constructor(type?: any, init?: Partial<Group>);
    get handlesDragDrop(): boolean;
    set handlesDragDrop(val: boolean);
    get placeholder(): Placeholder | null;
    get memberParts(): Set<Part>;
    get ungroupable(): boolean;
    set ungroupable(val: boolean);
    get layout(): Layout | null;
    set layout(val: Layout | null);
    addMembers(collection: any, check?: boolean): boolean;
    removeMembers(collection: any, check?: boolean): boolean;
    move(newLoc: Point): void;
    copy(): Group;
}

/**
 * Adornment - 装饰
 * 用于选择手柄、工具提示、上下文菜单等
 */
declare class Adornment extends Part {
    /** 被装饰的 GraphObject */
    private _adornedObject;
    /** 装饰类别 */
    private _adornmentCategory;
    constructor();
    constructor(type: any);
    constructor(type: any, init?: any);
    get adornedObject(): GraphObject | null;
    set adornedObject(val: GraphObject | null);
    get adornedPart(): Part | null;
    get adornedElement(): GraphObject | null;
    get category(): string;
    set category(val: string);
    /** 是否为占位装饰 */
    get isPlaceholder(): boolean;
    hasPlaceholder(): boolean;
    copy(): Adornment;
}

/**
 * Layer - 图层
 * 控制绘制顺序和可见性
 */
declare class Layer {
    /** 图层名称 */
    name: string;
    /** 不透明度 */
    opacity: number;
    /** 是否可见 */
    visible: boolean;
    /** 是否为临时图层 */
    isTemporary: boolean;
    /** Z 序 */
    zIndex: number;
    /** 所属 Diagram */
    private _diagram;
    /** 图层中的 Part 集合 */
    private _parts;
    constructor();
    get diagram(): any;
    set diagram(val: any);
    get parts(): Iterator<any>;
    get partsCount(): number;
    /** 添加 Part */
    add(part: any): void;
    /** 移除 Part */
    remove(part: any): boolean;
    /** 清空 */
    clear(): void;
    /** 是否包含 Part */
    contains(part: any): boolean;
}

/**
 * CanvasRenderer - Canvas 2D rendering engine for the Open-GoJS diagramming library.
 * Draws GraphObject hierarchies onto an HTML5 Canvas.
 */
declare class CanvasRenderer {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    diagram: any;
    viewportBounds: Rect;
    scale: number;
    position: Point;
    _needsRender: boolean;
    constructor(div?: HTMLDivElement);
    /** Create canvas, get context, set up size */
    init(div: HTMLDivElement): void;
    /** Resize canvas to match the given dimensions */
    resize(width: number, height: number): void;
    /** Main render entry: clear, apply viewport transform, render each layer */
    render(layers?: Layer[]): void;
    private _renderTableSeparators;
    private _renderDragSelectBox;
    /** Render all parts in a layer */
    renderLayer(layer: Layer): void;
    renderPart(part: Part): void;
    /** Render a Link - draw the link path and its children */
    renderLink(link: Link): void;
    /** Render the main link path */
    private _renderLinkPath;
    private _drawOrthogonalPathWithCorners;
    private _findCrossings;
    private _segmentIntersection;
    private _drawPathWithJumpOver;
    private _drawPathWithJumpGap;
    /** Render an arrowhead at the end of a link */
    private _renderArrow;
    private _renderLinkLabel;
    /** Render any GraphObject by dispatching to the appropriate handler */
    renderGraphObject(obj: GraphObject, offsetX: number, offsetY: number): void;
    /** Render a Panel and its children */
    renderPanel(panel: Panel, offsetX: number, offsetY: number): void;
    /** Render a Shape */
    renderShape(shape: Shape, offsetX: number, offsetY: number): void;
    /** Render a TextBlock */
    renderTextBlock(tb: TextBlock, offsetX: number, offsetY: number): void;
    /** Render a Picture (stub - image loading not yet implemented) */
    renderPicture(pic: Picture, offsetX: number, offsetY: number): void;
    renderGrid(panel: Panel): void;
    /** Render a Viewbox panel - scales its child to fit while maintaining aspect ratio */
    private _renderViewbox;
    private _renderGraduated;
    private _renderGraduatedShape;
    private _renderGraduatedText;
    private _getShapeGeometry;
    private _computePathPoints;
    private _interpolatePath;
    private _drawGeometryPath;
    private _findGraduatedMain;
    /** Apply position, scale, angle transforms for a Part */
    _applyTransform(part: Part): void;
    /** Restore canvas state after part transform */
    _restoreTransform(): void;
    /** Trace a geometry path on the canvas context */
    _drawGeometry(ctx: CanvasRenderingContext2D, geo: Geometry): void;
    /** Draw an arc segment from current point using SVG arc parameterization */
    private _drawArcSegment;
    /** Resolve a BrushLike to a fill style string or CanvasGradient */
    _applyBrush(ctx: CanvasRenderingContext2D, brush: BrushLike, bounds: Rect): string | CanvasGradient;
    /** Extract font size from a CSS font string */
    private _getFontSize;
    /** Wrap text into lines respecting maxWidth */
    private _wrapText;
    /** Update viewportBounds from current canvas size, scale, and position */
    private _updateViewportBounds;
    /** Convert a point from document coordinates to view (canvas pixel) coordinates */
    documentToView(p: Point): Point;
    /** Convert a point from view (canvas pixel) coordinates to document coordinates */
    viewToDocument(p: Point): Point;
    /** Check if a rectangle in document coordinates is within the viewport */
    isInViewport(r: Rect): boolean;
}

/**
 * Tool - base class for all interactive tools in the diagram.
 * Provides virtual methods for mouse/keyboard/touch event handling,
 * transaction management, and standard interaction patterns.
 */
declare class Tool {
    protected _diagram: Diagram | null;
    protected _isActive: boolean;
    private _isEnabled;
    private _name;
    private _transactionResult;
    constructor();
    get diagram(): Diagram | null;
    set diagram(val: Diagram | null);
    get isActive(): boolean;
    set isActive(val: boolean);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get name(): string;
    set name(val: string);
    get transactionResult(): string | null;
    set transactionResult(val: string | null);
    /** Whether this tool can start operating at the current input event. */
    canStart(): boolean;
    /** Called when this tool becomes the current tool. */
    doActivate(): void;
    /** Cancel the tool's operation. */
    doCancel(): void;
    /** Called when this tool is no longer the current tool. */
    doDeactivate(): void;
    /** Handle key-down events. */
    doKeyDown(): void;
    /** Handle key-up events. */
    doKeyUp(): void;
    /** Handle mouse-down events. */
    doMouseDown(): void;
    /** Handle mouse-move events. */
    doMouseMove(): void;
    /** Handle mouse-up events. */
    doMouseUp(): void;
    /** Handle mouse-wheel events. */
    doMouseWheel(): void;
    /** Called when this tool first starts. */
    doStart(): void;
    /** Called when this tool stops. */
    doStop(): void;
    /** Wait after a period of inactivity (e.g. for hover). */
    doWaitAfter(): void;
    /** Whether multi-touch gestures can start this tool. */
    canStartMultiTouch(): boolean;
    /** Cancel any pending wait-after timer. */
    cancelWaitAfter(): void;
    /** Find a tool handle at the given document point. */
    findToolHandleAt(p: Point): any | null;
    private _findHandleInPanel;
    /** Whether the distance between two points exceeds the drag threshold. */
    isBeyondDragSize(first: Point, second: Point): boolean;
    /** Standard mouse click behavior: select and raise click event. */
    standardMouseClick(): void;
    /** Standard mouse select behavior: select parts on click. */
    standardMouseSelect(): void;
    /** Standard mouse wheel behavior: zoom in/out. */
    standardMouseWheel(): void;
    /** Standard pinch zoom start for multi-touch. */
    standardPinchZoomStart(): void;
    /** Standard pinch zoom move for multi-touch. */
    standardPinchZoomMove(): void;
    /** Standard wait-after behavior: schedule a timer. */
    standardWaitAfter(delay: number): void;
    /** Start a new transaction. */
    startTransaction(tname?: string): boolean;
    /** Stop this tool and remove it from the ToolManager. */
    stopTool(): void;
    /** Stop the current transaction. */
    stopTransaction(): boolean;
    /** Update adornments for relevant parts. */
    updateAdornments(part: any): void;
}

/**
 * InputEvent - 输入事件
 * 封装鼠标/键盘/触摸事件信息
 */
declare class InputEvent {
    /** 事件类型 */
    eventType: string;
    /** 文档坐标 X */
    documentPoint: {
        x: number;
        y: number;
    };
    /** 视图坐标 X */
    viewPoint: {
        x: number;
        y: number;
    };
    /** 修饰键状态 */
    alt: boolean;
    control: boolean;
    shift: boolean;
    meta: boolean;
    /** 鼠标按钮 */
    button: number;
    /** 按键代码 */
    key: string;
    /** 是否已处理 */
    handled: boolean;
    /** 原生事件 */
    nativeEvent: Event | null;
    /** 时间戳 */
    timestamp: number;
    /** 是否为右键 */
    isContextMenu: boolean;
    /** 点击次数 */
    clickCount: number;
    /** 滚轮增量 */
    delta: number;
    get leftButton(): boolean;
    get middleButton(): boolean;
    get rightButton(): boolean;
    constructor();
    /** 从鼠标事件初始化 */
    static fromMouseEvent(e: MouseEvent, diagram: any): InputEvent;
    /** 从键盘事件初始化 */
    static fromKeyboardEvent(e: KeyboardEvent): InputEvent;
    copy(): InputEvent;
}

declare class ClickSelectingTool extends Tool {
    private _lastClickTime;
    private _lastClickObj;
    constructor();
    canStart(): boolean;
    doMouseUp(): void;
    private _handleSingleClick;
    private _handleDoubleClick;
    private _handleContextClick;
    standardMouseSelect(): void;
}

declare class DraggingTool extends Tool {
    private _isCopy;
    private _isCopyEnabled;
    private _startPoint;
    private _draggedParts;
    private _copiedParts;
    private _isDragOut;
    private _targetDiagram;
    private _dragOutParts;
    private _globalMouseMoveHandler;
    private _globalMouseUpHandler;
    constructor();
    get isCopy(): boolean;
    set isCopy(val: boolean);
    get isCopyEnabled(): boolean;
    set isCopyEnabled(val: boolean);
    get copiedParts(): Map<Part, Point> | null;
    set copiedParts(val: Map<Part, Point> | null);
    get draggedParts(): Map<Part, Point> | null;
    set draggedParts(val: Map<Part, Point> | null);
    mayCopy(): boolean;
    mayMove(): boolean;
    canStart(): boolean;
    doActivate(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doDeactivate(): void;
    doCancel(): void;
    computeMove(part: Part, newLoc: Point): Point;
    private _copyParts;
    private _removeCopiedParts;
    private _startDragOut;
    private _finishDragOut;
    private _findTargetDiagram;
    private _clientToDoc;
    private _setupGlobalListeners;
    private _removeGlobalListeners;
}

/**
 * DragSelectingTool - box (rubber-band) selection tool.
 * Allows the user to draw a rectangle to select multiple parts.
 */
declare class DragSelectingTool extends Tool {
    private _box;
    private _startPoint;
    constructor();
    get box(): Rect | null;
    set box(val: Rect | null);
    /** Can start if the user clicks in the background (no part). */
    canStart(): boolean;
    /** Activate and start the box selection. */
    doActivate(): void;
    /** Update the selection box on mouse move. */
    doMouseMove(): void;
    /** Finalize the selection on mouse up. */
    doMouseUp(): void;
    /** Clean up on deactivate. */
    doDeactivate(): void;
    /** Select all parts within the given rectangle. */
    selectInRect(r: Rect): void;
}

/**
 * LinkingBaseTool - base class for LinkingTool and RelinkingTool.
 * Provides shared logic for finding valid ports, validating links,
 * and creating temporary link visuals.
 */
declare class LinkingBaseTool extends Tool {
    private _portProperty;
    private _targetPort;
    private _isForwardsOnly;
    private _isBackwardsOnly;
    private _linkValidation;
    private _portValidation;
    private _temporaryLink;
    private _temporaryFromPort;
    private _temporaryToPort;
    constructor();
    get portProperty(): string;
    set portProperty(val: string);
    get targetPort(): GraphObject | null;
    set targetPort(val: GraphObject | null);
    get isForwardsOnly(): boolean;
    set isForwardsOnly(val: boolean);
    get isBackwardsOnly(): boolean;
    set isBackwardsOnly(val: boolean);
    get linkValidation(): ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject, link: Link | null) => boolean) | null;
    set linkValidation(val: ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject, link: Link | null) => boolean) | null);
    get portValidation(): ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject) => boolean) | null;
    set portValidation(val: ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject) => boolean) | null);
    get temporaryLink(): Link | null;
    set temporaryLink(val: Link | null);
    get temporaryFromPort(): GraphObject | null;
    set temporaryFromPort(val: GraphObject | null);
    get temporaryToPort(): GraphObject | null;
    set temporaryToPort(val: GraphObject | null);
    /** Find a target port at the current mouse point. */
    findTargetPort(): GraphObject | null;
    /** Check whether a link from fromPort to toPort is valid. */
    isValidLink(fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject): boolean;
    private _countLinksFromPort;
    private _countLinksToPort;
    private _hasDuplicateLink;
    /** Insert a new link into the model. Returns the new link or null. */
    insertLink(fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject): Link | null;
}

/**
 * LinkingTool - creates new links by dragging from a port.
 * The user drags from an outgoing port to an incoming port to create a new link.
 */
declare class LinkingTool extends LinkingBaseTool {
    private _originalFromPort;
    constructor();
    /** Can start if the user clicks on a fromLinkable port. */
    canStart(): boolean;
    /** Activate the linking tool. */
    doActivate(): void;
    /** Update the temporary link on mouse move. */
    doMouseMove(): void;
    /** Complete the link on mouse up. */
    doMouseUp(): void;
    /** Clean up on deactivate. */
    doDeactivate(): void;
    /** Insert a new link into the model. */
    insertLink(fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject): Link | null;
}

declare class RelinkingTool extends LinkingBaseTool {
    private _originalLink;
    private _originalFromPort;
    private _originalToPort;
    private _fromHandleArchetype;
    private _toHandleArchetype;
    constructor();
    private _createHandleArchetype;
    get originalLink(): Link | null;
    set originalLink(val: Link | null);
    get originalFromPort(): GraphObject | null;
    set originalFromPort(val: GraphObject | null);
    get originalToPort(): GraphObject | null;
    set originalToPort(val: GraphObject | null);
    get fromHandleArchetype(): GraphObject | null;
    set fromHandleArchetype(val: GraphObject | null);
    get toHandleArchetype(): GraphObject | null;
    set toHandleArchetype(val: GraphObject | null);
    canStart(): boolean;
    doActivate(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doDeactivate(): void;
    updateAdornments(part: any): void;
    private _makeRelinkAdornment;
}

declare class LinkReshapingTool extends Tool {
    private _handle;
    private _adornedLink;
    private _handleIndex;
    protected _handleArchetype: GraphObject | null;
    constructor();
    private _createHandleArchetype;
    get handle(): any;
    set handle(val: any);
    get adornedLink(): any;
    set adornedLink(val: any);
    get handleArchetype(): GraphObject | null;
    set handleArchetype(val: GraphObject | null);
    canStart(): boolean;
    doActivate(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doDeactivate(): void;
    updateAdornments(part: any): void;
    private _makeReshapeAdornment;
}

declare class ResizingTool extends Tool {
    private _handle;
    private _adornedElement;
    private _minSize;
    private _maxSize;
    private _originalBounds;
    private _resizeObjectName;
    protected _handleArchetype: GraphObject | null;
    constructor();
    private _createHandleArchetype;
    get handle(): GraphObject | null;
    set handle(val: GraphObject | null);
    get adornedElement(): GraphObject | null;
    set adornedElement(val: GraphObject | null);
    get minSize(): Size;
    set minSize(val: Size);
    get maxSize(): Size;
    set maxSize(val: Size);
    get handleArchetype(): GraphObject | null;
    set handleArchetype(val: GraphObject | null);
    canStart(): boolean;
    doActivate(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doDeactivate(): void;
    computeResize(element: GraphObject, newPoint: Point): Size;
    updateAdornments(part: any): void;
    private _makeResizeAdornment;
}

declare class RotatingTool extends Tool {
    private _handle;
    private _adornedElement;
    private _angle;
    private _originalAngle;
    protected _handleArchetype: GraphObject | null;
    constructor();
    private _createHandleArchetype;
    get handle(): GraphObject | null;
    set handle(val: GraphObject | null);
    get adornedElement(): GraphObject | null;
    set adornedElement(val: GraphObject | null);
    get angle(): number;
    set angle(val: number);
    get handleArchetype(): GraphObject | null;
    set handleArchetype(val: GraphObject | null);
    canStart(): boolean;
    doActivate(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doDeactivate(): void;
    computeRotate(element: GraphObject, newPoint: Point): number;
    updateAdornments(part: any): void;
    private _makeRotateAdornment;
}

declare class TextEditingTool extends Tool {
    private _textBlock;
    private _defaultText;
    private _currentText;
    private _textBox;
    constructor();
    get textBlock(): TextBlock | null;
    set textBlock(val: TextBlock | null);
    get defaultText(): string;
    set defaultText(val: string);
    get currentText(): string;
    set currentText(val: string);
    get textBox(): HTMLTextAreaElement | HTMLInputElement | null;
    set textBox(val: HTMLTextAreaElement | HTMLInputElement | null);
    canStart(): boolean;
    doActivate(): void;
    doKeyDown(): void;
    doDeactivate(): void;
    acceptText(): void;
    cancelText(): void;
    private _removeElement;
}

/**
 * PanningTool - pans the viewport by dragging.
 * The user drags to scroll the diagram viewport.
 */
declare class PanningTool extends Tool {
    private _originalPosition;
    private _startPoint;
    constructor();
    /** Can start if the user clicks on the background with no part. */
    canStart(): boolean;
    /** Activate the panning tool. */
    doActivate(): void;
    /** Pan the viewport on mouse move. */
    doMouseMove(): void;
    /** Clean up on deactivate. */
    doDeactivate(): void;
}

/**
 * ContextMenuTool - shows context menus on right-click.
 * Displays the context menu for the object under the mouse.
 */
declare class ContextMenuTool extends Tool {
    private _currentContextMenu;
    private _mouseDownPoint;
    constructor();
    get currentContextMenu(): Adornment | null;
    set currentContextMenu(val: Adornment | null);
    /** Can start if the user right-clicks. */
    canStart(): boolean;
    /** Show the context menu on mouse up (right-click). */
    doMouseUp(): void;
    /** Show the context menu at the given position. */
    showContextMenu(menu: any, point: Point): void;
    /** Hide the current context menu. */
    hideContextMenu(): void;
}

/**
 * ClickCreatingTool - creates a new node on click in the background.
 * Used for quick node creation by clicking on empty diagram space.
 */
declare class ClickCreatingTool extends Tool {
    private _archetypePartData;
    private _isDoubleClick;
    constructor();
    get archetypePartData(): any;
    set archetypePartData(val: any);
    get isDoubleClick(): boolean;
    set isDoubleClick(val: boolean);
    /** Can start if the user clicks in the background and archetype data is set. */
    canStart(): boolean;
    /** Create the part on mouse up. */
    doMouseUp(): void;
    /** Insert a new part at the given location. */
    insertPart(loc: Point): Part | null;
}

/**
 * ActionTool - handles isActionable objects.
 * Dispatches mouse events to GraphObjects that have isActionable set to true.
 */
declare class ActionTool extends Tool {
    private _actionableObject;
    constructor();
    get actionableObject(): GraphObject | null;
    set actionableObject(val: GraphObject | null);
    /** Can start if the user clicks on an isActionable object. */
    canStart(): boolean;
    /** Dispatch mouse-down to the actionable object. */
    doMouseDown(): void;
    /** Dispatch mouse-move to the actionable object. */
    doMouseMove(): void;
    /** Dispatch mouse-up to the actionable object. */
    doMouseUp(): void;
}

/**
 * ToolManager - manages tool dispatch and event routing.
 * Holds lists of mouse-down, mouse-move, and mouse-up tools,
 * and dispatches events to the appropriate tool.
 */
declare class ToolManager extends Tool {
    private _mouseDownTools;
    private _mouseMoveTools;
    private _mouseUpTools;
    private _mouseHoverTools;
    private _currentTool;
    private _defaultTool;
    private _hoverDelay;
    private _holdDelay;
    private _lastInput;
    private _previousInput;
    private _mouseDownPoint;
    constructor();
    get mouseDownTools(): Tool[];
    set mouseDownTools(val: Tool[]);
    get mouseMoveTools(): Tool[];
    set mouseMoveTools(val: Tool[]);
    get mouseUpTools(): Tool[];
    set mouseUpTools(val: Tool[]);
    get mouseHoverTools(): Tool[];
    set mouseHoverTools(val: Tool[]);
    get currentTool(): Tool | null;
    set currentTool(val: Tool | null);
    get defaultTool(): Tool;
    set defaultTool(val: Tool);
    get clickSelectingTool(): ClickSelectingTool;
    get draggingTool(): DraggingTool;
    get dragSelectingTool(): DragSelectingTool;
    get linkingTool(): LinkingTool;
    get relinkingTool(): RelinkingTool;
    get linkReshapingTool(): LinkReshapingTool;
    get resizingTool(): ResizingTool;
    get rotatingTool(): RotatingTool;
    get textEditingTool(): TextEditingTool;
    get panningTool(): PanningTool;
    get contextMenuTool(): ContextMenuTool;
    get clickCreatingTool(): ClickCreatingTool;
    get actionTool(): ActionTool;
    get hoverDelay(): number;
    set hoverDelay(val: number);
    get holdDelay(): number;
    set holdDelay(val: number);
    get lastInput(): InputEvent;
    set lastInput(val: InputEvent);
    get previousInput(): InputEvent;
    set diagram(val: Diagram | null);
    /** Dispatch mouse-down event to the appropriate tool. */
    doMouseDown(): void;
    /** Dispatch mouse-move event to the current tool. */
    doMouseMove(): void;
    /** Dispatch mouse-up event to the current tool. */
    doMouseUp(): void;
    /** Dispatch key-down event to the current tool. */
    doKeyDown(): void;
    /** Dispatch key-up event to the current tool. */
    doKeyUp(): void;
    /** Dispatch mouse-wheel event to the current tool. */
    doMouseWheel(): void;
    /** Update adornments for all relevant parts. */
    updateAdornments(part: any): void;
    /** Standard mouse wheel: zoom in/out centered on mouse position. */
    standardMouseWheel(): void;
}

declare class CommandHandler {
    private _diagram;
    private _isEnabled;
    private static _clipboard;
    get diagram(): any;
    set diagram(val: any);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    canDeleteSelection(): boolean;
    deleteSelection(): void;
    canCopy(): boolean;
    copySelection(): void;
    canCut(): boolean;
    cutSelection(): void;
    canPaste(): boolean;
    pasteSelection(): void;
    canUndo(): boolean;
    undo(): void;
    canRedo(): boolean;
    redo(): void;
    canSelectAll(): boolean;
    selectAll(): void;
    canZoomToFit(): boolean;
    zoomToFit(): void;
    canZoomIn(): boolean;
    zoomIn(): void;
    canZoomOut(): boolean;
    zoomOut(): void;
    canGroupSelection(): boolean;
    groupSelection(): void;
    canUngroupSelection(): boolean;
    ungroupSelection(): void;
    canCollapseSubGraph(group?: any): boolean;
    collapseSubGraph(group?: any): void;
    canExpandSubGraph(group?: any): boolean;
    expandSubGraph(group?: any): void;
    canCollapseTree(node?: any): boolean;
    collapseTree(node?: any): void;
    canExpandTree(node?: any): boolean;
    expandTree(node?: any): void;
    canAlignSelection(): boolean;
    alignSelection(alignment: string): void;
    canRotate(): boolean;
    rotate(angle: number): void;
    canBringToFront(): boolean;
    bringToFront(): void;
    canSendToBack(): boolean;
    sendToBack(): void;
    canMoveSelection(): boolean;
    moveSelection(dx: number, dy: number): void;
    doKeyDown(): void;
}

declare class Animation {
    static EaseLinear(t: number): number;
    static EaseInOut(t: number): number;
    static EaseIn(t: number): number;
    static EaseOut(t: number): number;
    private _isRunning;
    private _duration;
    private _easing;
    private _reversible;
    private _state;
    private _animations;
    private _startTime;
    private _manager;
    private _finished;
    get isRunning(): boolean;
    get duration(): number;
    set duration(val: number);
    get easing(): (t: number) => number;
    set easing(val: (t: number) => number);
    get reversible(): boolean;
    set reversible(val: boolean);
    get state(): string;
    get manager(): any;
    set manager(val: any);
    get finished(): (() => void) | null;
    set finished(val: (() => void) | null);
    add(targetOrConfig: object | AnimationConfig, property?: string, fromValue?: any, toValue?: any): void;
    clear(): void;
    start(): void;
    stop(): void;
    finish(): void;
    restart(): void;
    update(now: number): void;
    private _interpolate;
    private _setPropertyValue;
}
declare enum AnimationState {
    Inactive = "Inactive",
    Running = "Running",
    Stopped = "Stopped",
    Finished = "Finished"
}
interface AnimationConfig {
    target: object;
    property: string;
    from: any;
    to: any;
    onFinish?: () => void;
}

declare class AnimationManager {
    private _diagram;
    private _isEnabled;
    private _duration;
    private _isAnimating;
    private _isInitial;
    private _isTicking;
    private _activeAnimations;
    private _frameId;
    private _defaultAnimation;
    get diagram(): any;
    set diagram(val: any);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get duration(): number;
    set duration(val: number);
    get isAnimating(): boolean;
    get isInitial(): boolean;
    set isInitial(val: boolean);
    get isTicking(): boolean;
    get defaultAnimation(): Animation;
    private _createDefaultAnimation;
    startAnimation(anim?: Animation): void;
    stopAnimation(): void;
    registerAnimation(anim: Animation): void;
    defineAnimationEffect(name: string, effect: (obj: object, from: any, to: any, duration: number) => Animation): void;
    static getEffect(name: string): ((obj: object, from: any, to: any, duration: number) => Animation) | undefined;
    updateAnimation(): void;
    private _startTicking;
    private _stopTicking;
    private _tick;
    private static _effects;
}

declare class ThemeManager {
    private _diagram;
    private _themes;
    private _currentTheme;
    get diagram(): any;
    set diagram(val: any);
    get currentTheme(): string;
    set currentTheme(val: string);
    set(themeName: string, themeData: any): void;
    private _applyTheme;
    findColor(colorName: string, themeName?: string): string;
}

declare class Diagram {
    private _div;
    private _model;
    private _modelChangeListener;
    private _renderer;
    private _toolManager;
    private _commandHandler;
    private _animationManager;
    private _themeManager;
    private _position;
    private _scale;
    private _minScale;
    private _maxScale;
    private _padding;
    protected _allowSelect: boolean;
    protected _allowMove: boolean;
    protected _allowCopy: boolean;
    protected _allowDelete: boolean;
    protected _allowGroup: boolean;
    protected _allowUngroup: boolean;
    protected _allowLink: boolean;
    protected _allowRelink: boolean;
    protected _allowTextEdit: boolean;
    protected _allowDragOut: boolean;
    protected _allowDrop: boolean;
    protected _allowClipboard: boolean;
    protected _allowInsert: boolean;
    protected _allowHorizontalScroll: boolean;
    protected _allowVerticalScroll: boolean;
    protected _allowZoom: boolean;
    protected _allowReshape: boolean;
    protected _allowResize: boolean;
    protected _allowRotate: boolean;
    protected _allowUndo: boolean;
    protected _isReadOnly: boolean;
    protected _isEnabled: boolean;
    private _nodeTemplate;
    private _nodeTemplateMap;
    private _linkTemplate;
    private _linkTemplateMap;
    private _groupTemplate;
    private _groupTemplateMap;
    private _selection;
    private _maxSelectionCount;
    private _layout;
    private _isInitial;
    _layoutInvalid: boolean;
    private _contextMenu;
    _layers: Layer[];
    _parts: Map<any, Part>;
    _nodeKeyMap: Map<any, Node>;
    _changedListeners: Function[];
    _diagramListeners: Map<string, Function[]>;
    _needsRender: boolean;
    _animationFrameId: number;
    private _resizeObserver;
    private _lastDivWidth;
    private _lastDivHeight;
    private _lastInput;
    private _currentTool;
    constructor(divId: string | HTMLDivElement, options?: Partial<Diagram>);
    get div(): HTMLDivElement | null;
    get model(): Model;
    set model(val: Model);
    get renderer(): CanvasRenderer;
    get toolManager(): ToolManager;
    set toolManager(val: ToolManager);
    get commandHandler(): CommandHandler;
    set commandHandler(val: CommandHandler);
    get animationManager(): AnimationManager;
    set animationManager(val: AnimationManager);
    get themeManager(): ThemeManager;
    get undoManager(): any;
    get lastInput(): InputEvent;
    set lastInput(val: InputEvent);
    get currentTool(): any;
    set currentTool(val: any);
    get defaultTool(): any;
    get position(): Point;
    set position(val: Point);
    get scale(): number;
    set scale(val: number);
    get viewportBounds(): Rect;
    get documentBounds(): Rect;
    get viewSize(): Size;
    get padding(): Margin;
    set padding(val: Margin | number);
    get minScale(): number;
    set minScale(val: number);
    get maxScale(): number;
    set maxScale(val: number);
    get allowSelect(): boolean;
    set allowSelect(val: boolean);
    get allowMove(): boolean;
    set allowMove(val: boolean);
    get allowCopy(): boolean;
    set allowCopy(val: boolean);
    get allowDelete(): boolean;
    set allowDelete(val: boolean);
    get allowGroup(): boolean;
    set allowGroup(val: boolean);
    get allowUngroup(): boolean;
    set allowUngroup(val: boolean);
    get allowLink(): boolean;
    set allowLink(val: boolean);
    get allowRelink(): boolean;
    set allowRelink(val: boolean);
    get allowTextEdit(): boolean;
    set allowTextEdit(val: boolean);
    get allowDragOut(): boolean;
    set allowDragOut(val: boolean);
    get allowDrop(): boolean;
    set allowDrop(val: boolean);
    get allowClipboard(): boolean;
    set allowClipboard(val: boolean);
    get allowInsert(): boolean;
    set allowInsert(val: boolean);
    get allowHorizontalScroll(): boolean;
    set allowHorizontalScroll(val: boolean);
    get allowVerticalScroll(): boolean;
    set allowVerticalScroll(val: boolean);
    get allowZoom(): boolean;
    set allowZoom(val: boolean);
    get allowReshape(): boolean;
    set allowReshape(val: boolean);
    get allowResize(): boolean;
    set allowResize(val: boolean);
    get allowRotate(): boolean;
    set allowRotate(val: boolean);
    get allowUndo(): boolean;
    set allowUndo(val: boolean);
    get isReadOnly(): boolean;
    set isReadOnly(val: boolean);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get nodeTemplate(): Part;
    set nodeTemplate(val: Part);
    get nodeTemplateMap(): Map<string, Part>;
    set nodeTemplateMap(val: Map<string, Part>);
    get linkTemplate(): Part;
    set linkTemplate(val: Part);
    get linkTemplateMap(): Map<string, Part>;
    set linkTemplateMap(val: Map<string, Part>);
    get groupTemplate(): Part | null;
    set groupTemplate(val: Part | null);
    get groupTemplateMap(): Map<string, Part>;
    set groupTemplateMap(val: Map<string, Part>);
    get parts(): Iterator<Part>;
    get nodes(): Iterator<Node>;
    get links(): Iterator<Link>;
    get selection(): Set<Part>;
    get maxSelectionCount(): number;
    set maxSelectionCount(val: number);
    get contextMenu(): any;
    set contextMenu(val: any);
    get layout(): any;
    set layout(val: any);
    get isInitial(): boolean;
    set isInitial(val: boolean);
    private _initialContentAlignment;
    private _initialAutoScale;
    private _initialPosition;
    private _initialScale;
    private _contentAlignment;
    protected _autoScale: EnumValue | null;
    private _hasPerformedInitialLayout;
    get initialContentAlignment(): Spot | null;
    set initialContentAlignment(val: Spot | null);
    get initialAutoScale(): EnumValue | null;
    set initialAutoScale(val: EnumValue | null);
    get initialPosition(): Point | null;
    set initialPosition(val: Point | null);
    get initialScale(): number;
    set initialScale(val: number);
    get contentAlignment(): Spot;
    set contentAlignment(val: Spot);
    get autoScale(): EnumValue | null;
    set autoScale(val: EnumValue | null);
    get layers(): Iterator<Layer>;
    addLayer(layer: Layer): void;
    removeLayer(layer: Layer): void;
    findLayer(name: string): Layer | null;
    add(part: Part): void;
    remove(part: Part): void;
    findNodeForKey(key: any): Node | null;
    findLinkForData(data: ObjectData): Link | null;
    findPartForKey(key: any): Part | null;
    findNodesByExample(data: any): List<Node>;
    findLinksByExample(data: any): List<Link>;
    findPartAt(point: Point, selectableOnly?: boolean): Part | null;
    findObjectAt(point: Point): GraphObject | null;
    findNodeAt(point: Point): Node | null;
    select(part: Part): void;
    clearSelection(): void;
    selectCollection(parts: Iterable<Part>): void;
    startTransaction(tname?: string): boolean;
    commitTransaction(tname?: string): boolean;
    rollbackTransaction(): boolean;
    commit(func: () => any, tname?: string): any;
    addDiagramListener(name: string, listener: Function): void;
    removeDiagramListener(name: string, listener: Function): void;
    addChangedListener(listener: Function): void;
    removeChangedListener(listener: Function): void;
    transformDocToView(p: Point): Point;
    transformViewToDoc(p: Point): Point;
    requestUpdate(invalidate?: boolean): void;
    layoutDiagram(invalidate?: boolean): void;
    updateAllTargetBindings(propname?: string): void;
    zoomToFit(): void;
    centerRect(r: Rect): void;
    scrollToRect(r: Rect): void;
    alignDocument(docSpot: Spot, viewSpot: Spot): void;
    rebuildParts(): void;
    static GraphObject: {
        make: (type: any, ...args: any[]) => any;
    };
    static fromDiv(id: string): Diagram | null;
    set(props: Partial<Diagram>): this;
    focus(): void;
    private _createDefaultLayers;
    private _createDefaultGrid;
    get grid(): any;
    set grid(val: any);
    private _createDefaultNodeTemplate;
    private _createDefaultLinkTemplate;
    private _clearAllParts;
    private _addNodeForData;
    private _propagatePartToChildren;
    private _addLinkForData;
    private _addLinkForTreeData;
    private _removeNodeForData;
    private _removeLinksForNode;
    private _removeLinkForData;
    private _resolveBindingValue;
    private _applyBindings;
    private _applyBindingsToObject;
    private _updateBindingsForPart;
    private _updateBindingsForObject;
    _handlePartPropertyChanged(part: Part, obj: GraphObject, propname: string, value?: any): void;
    private _onModelChanged;
    private _rebuildTreeLinks;
    private _raiseChangedEvent;
    private _raiseDiagramEvent;
    raiseDiagramEvent(name: string, ...args: any[]): void;
    private _findObjectInPanel;
    private _renderLoop;
    private _performLayout;
    private _applyInitialViewport;
    private _applyAutoScale;
    private _applyContentAlignment;
    private _updateGeometry;
    private _setupResizeObserver;
    private _checkResize;
    private _setupMouseEvents;
    private _setupKeyboardEvents;
}

declare class Overview {
    private _diagram;
    private _observedDiagram;
    private _box;
    private _isViewportSized;
    private _canvas;
    private _isDragging;
    private _dragStart;
    private _observedPositionAtDragStart;
    private _viewportChangedListener;
    private _observedModelChangedListener;
    constructor(divId: string | HTMLDivElement);
    get diagram(): Diagram;
    get observedDiagram(): Diagram | null;
    set observedDiagram(val: Diagram | null);
    get box(): any;
    set box(val: any);
    get isViewportSized(): boolean;
    set isViewportSized(val: boolean);
    update(): void;
    drawOverview(): void;
    drawBox(): void;
    computeBounds(): Rect;
    copy(): Overview;
    private _setupOverview;
    private _drawViewportBox;
    private _onMouseDown;
    private _onMouseMove;
    private _onMouseUp;
    private _addListeners;
    private _removeListeners;
}

declare class Palette extends Diagram {
    constructor(divId: string | HTMLDivElement);
    get isReadOnly(): boolean;
    set isReadOnly(_val: boolean);
    get allowSelect(): boolean;
    set allowSelect(val: boolean);
    get allowDragOut(): boolean;
    set allowDragOut(val: boolean);
    get allowMove(): boolean;
    set allowMove(_val: boolean);
    get allowDelete(): boolean;
    set allowDelete(_val: boolean);
    get allowCopy(): boolean;
    set allowCopy(_val: boolean);
    get autoScale(): EnumValue;
    set autoScale(val: EnumValue);
    copy(): Palette;
    private _setupPalette;
}

/**
 * DiagramEvent - 图表事件
 */
declare class DiagramEvent {
    /** 事件名称 */
    name: string;
    /** 图表 */
    diagram: any;
    /** 事件主体 */
    subject: any;
    /** 事件参数 */
    parameter: any;
    constructor(name: string, diagram?: any, subject?: any, parameter?: any);
}

/**
 * HTMLInfo - provides custom HTML-based editing or display for tools.
 * Used by TextEditingTool and ContextMenuTool to integrate HTML elements.
 */
declare class HTMLInfo {
    private _element;
    private _showFunction;
    private _hideFunction;
    private _valueFunction;
    constructor();
    get element(): HTMLElement | null;
    set element(val: HTMLElement | null);
    get showFunction(): ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null;
    set showFunction(val: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null);
    get hideFunction(): ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null;
    set hideFunction(val: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => void) | null);
    get valueFunction(): ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => string) | null;
    set valueFunction(val: ((htmlInfo: HTMLInfo, tool: any, ...args: any[]) => string) | null);
}

/**
 * GridLayout - arranges parts in a grid pattern.
 */
declare class GridLayout extends Layout {
    private _wrappingWidth;
    private _cellSize;
    private _spacing;
    private _alignment;
    private _arrangement;
    private _sorting;
    get wrappingWidth(): number;
    set wrappingWidth(val: number);
    get cellSize(): Size;
    set cellSize(val: Size);
    get spacing(): Size;
    set spacing(val: Size);
    get alignment(): EnumValue;
    set alignment(val: EnumValue);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue);
    get sorting(): EnumValue;
    set sorting(val: EnumValue);
    copy(): GridLayout;
    doLayout(coll: any): void;
    private _sortNodes;
    static Location: EnumValue;
    static Center: EnumValue;
    static Forwards: EnumValue;
    static Reverse: EnumValue;
    static Ascending: EnumValue;
    static Descending: EnumValue;
    static Position: EnumValue;
    static smartComparer(a: any, b: any): number;
}

/**
 * TreeLayout - arranges nodes in a tree structure.
 */
declare class TreeLayout extends Layout {
    private _angle;
    private _layerSpacing;
    private _nodeSpacing;
    private _treeStyle;
    private _arrangement;
    private _layerStyle;
    private _compaction;
    private _sorting;
    private _path;
    private _alternateAngle;
    private _alternateLayerSpacing;
    private _alternateNodeSpacing;
    private _alternateAlignment;
    private _alternateCompaction;
    private _alternateSorting;
    get angle(): number;
    set angle(val: number);
    get layerSpacing(): number;
    set layerSpacing(val: number);
    get nodeSpacing(): number;
    set nodeSpacing(val: number);
    get treeStyle(): EnumValue;
    set treeStyle(val: EnumValue);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue);
    get layerStyle(): EnumValue;
    set layerStyle(val: EnumValue);
    get compaction(): EnumValue;
    set compaction(val: EnumValue);
    get sorting(): EnumValue;
    set sorting(val: EnumValue);
    get path(): EnumValue;
    set path(val: EnumValue);
    get alternateAngle(): number;
    set alternateAngle(val: number);
    get alternateLayerSpacing(): number;
    set alternateLayerSpacing(val: number);
    get alternateNodeSpacing(): number;
    set alternateNodeSpacing(val: number);
    get alternateAlignment(): EnumValue;
    set alternateAlignment(val: EnumValue);
    get alternateCompaction(): EnumValue;
    set alternateCompaction(val: EnumValue);
    get alternateSorting(): EnumValue;
    set alternateSorting(val: EnumValue);
    copy(): TreeLayout;
    doLayout(coll: any): void;
    private _sortChildren;
    private _assignLayers;
    private _layoutTree;
    private _computeSubtreeWidth;
    private _positionTree;
}

/**
 * ForceDirectedLayout - positions nodes using a force-directed (spring-electric) algorithm.
 * Nodes repel each other (electrical charge), edges attract connected nodes (springs),
 * and gravity pulls nodes toward the center.
 */
declare class ForceDirectedLayout extends Layout {
    private _maxIterations;
    private _defaultSpringLength;
    private _defaultSpringStiffness;
    private _defaultElectricalCharge;
    private _defaultGravity;
    private _infinityDistance;
    private _epsilon;
    get maxIterations(): number;
    set maxIterations(val: number);
    get defaultSpringLength(): number;
    set defaultSpringLength(val: number);
    get defaultSpringStiffness(): number;
    set defaultSpringStiffness(val: number);
    get defaultElectricalCharge(): number;
    set defaultElectricalCharge(val: number);
    get defaultGravity(): number;
    set defaultGravity(val: number);
    get infinityDistance(): number;
    set infinityDistance(val: number);
    get epsilon(): number;
    set epsilon(val: number);
    copy(): ForceDirectedLayout;
    doLayout(coll: any): void;
    /**
     * Initialize vertex positions in a circle if they are all at the same location.
     */
    private _initializePositions;
}

/**
 * LayeredDigraphLayout - implements a Sugiyama-style layered digraph layout.
 * Produces a layered arrangement of nodes with minimized edge crossings.
 */
declare class LayeredDigraphLayout extends Layout {
    private _direction;
    private _layerSpacing;
    private _columnSpacing;
    private _setsPortSpots;
    private _aggressiveOption;
    private _packOption;
    private _layeringOption;
    private _cycleRemoveOption;
    get direction(): EnumValue;
    set direction(val: EnumValue);
    get layerSpacing(): number;
    set layerSpacing(val: number);
    get columnSpacing(): number;
    set columnSpacing(val: number);
    get setsPortSpots(): boolean;
    set setsPortSpots(val: boolean);
    get aggressiveOption(): EnumValue;
    set aggressiveOption(val: EnumValue);
    get packOption(): EnumValue;
    set packOption(val: EnumValue);
    get layeringOption(): string;
    set layeringOption(val: string);
    get cycleRemoveOption(): string;
    set cycleRemoveOption(val: string);
    copy(): LayeredDigraphLayout;
    doLayout(coll: any): void;
    /**
     * Remove cycles by reversing back edges in a DFS traversal.
     */
    private _removeCycles;
    /**
     * Assign layers to vertexes using longest path from source.
     */
    private _assignLayers;
    /**
     * Reduce edge crossings using barycenter heuristic.
     */
    private _reduceCrossings;
    /**
     * Reorder a layer based on barycenter of neighbors.
     */
    private _barycenterOrder;
    /**
     * Position nodes within each layer.
     */
    private _positionNodes;
}

/**
 * CircularLayout - arranges nodes in a circle or circular pattern.
 */
declare class CircularLayout extends Layout {
    private _radius;
    private _startAngle;
    private _sweepAngle;
    private _arrangement;
    private _spacing;
    private _direction;
    private _aspectRatio;
    get radius(): number;
    set radius(val: number);
    get startAngle(): number;
    set startAngle(val: number);
    get sweepAngle(): number;
    set sweepAngle(val: number);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue);
    get spacing(): number;
    set spacing(val: number);
    get direction(): EnumValue;
    set direction(val: EnumValue);
    get aspectRatio(): number;
    set aspectRatio(val: number);
    copy(): CircularLayout;
    doLayout(coll: any): void;
    /**
     * Layout a single connected component in a circle.
     */
    private _layoutComponent;
    /**
     * Compute an appropriate radius based on the vertex sizes and spacing.
     */
    private _computeRadius;
    static Circular: EnumValue;
}

/**
 * AnimationTrigger - defines an animation that should run when a named property changes.
 */
declare class AnimationTrigger {
    private _propertyName;
    private _animation;
    private _startsOn;
    get propertyName(): string;
    set propertyName(val: string);
    get animation(): Animation | null;
    set animation(val: Animation | null);
    get startsOn(): string;
    set startsOn(val: string);
    copy(): AnimationTrigger;
}

declare const figures: Map<string, (shape: any, w: number, h: number) => Geometry>;
declare function getFigureGeometry(name: string, w: number, h: number, p1?: number, p2?: number, shape?: any): Geometry | null;

declare const GridSorting: {
    Forwards: EnumValue;
    Reverse: EnumValue;
    Ascending: EnumValue;
    Descending: EnumValue;
};
declare const GridAlignment: {
    Location: EnumValue;
    Position: EnumValue;
};
declare const Curve: {
    None: EnumValue;
    Bezier: EnumValue;
    JumpOver: EnumValue;
    JumpGap: EnumValue;
};
declare const AutoScale: {
    None: EnumValue;
    Uniform: EnumValue;
    UniformToFill: EnumValue;
};
declare const Routing: {
    Normal: EnumValue;
    Orthogonal: EnumValue;
    AvoidsNodes: EnumValue;
};
declare const ScrollMode: {
    Document: EnumValue;
    Infinite: EnumValue;
};
declare const Stretch: {
    Default: EnumValue;
    Fill: EnumValue;
    None: EnumValue;
    Uniform: EnumValue;
    UniformToFill: EnumValue;
    Horizontal: EnumValue;
    Vertical: EnumValue;
};
declare const TreeStyle: {
    Layered: EnumValue;
    Alternating: EnumValue;
    LastParents: EnumValue;
    RootOnly: EnumValue;
};
declare const TreeAlignment: {
    TopLeftBus: EnumValue;
    BottomRightBus: EnumValue;
    Bus: EnumValue;
    BusBranching: EnumValue;
    CenterChildren: EnumValue;
    CenterSubtrees: EnumValue;
    Start: EnumValue;
    End: EnumValue;
};
declare const TreeCompaction: {
    Block: EnumValue;
    None: EnumValue;
};
declare const TreeSorting: {
    Forwards: EnumValue;
    Reverse: EnumValue;
    Ascending: EnumValue;
    Descending: EnumValue;
};
declare const TreeArrangement: {
    Vertical: EnumValue;
    Horizontal: EnumValue;
    FixedRoots: EnumValue;
};
declare const TreeLayerStyle: {
    Individual: EnumValue;
    Uniform: EnumValue;
    Siblings: EnumValue;
};
declare const TreePath: {
    Default: EnumValue;
    Destination: EnumValue;
    Source: EnumValue;
};
declare const CircularArrangement: {
    ConstantDistance: EnumValue;
    ConstantAngle: EnumValue;
    ConstantRadius: EnumValue;
    Packed: EnumValue;
};
declare const CircularSorting: {
    Forwards: EnumValue;
    Reverse: EnumValue;
    Ascending: EnumValue;
    Descending: EnumValue;
    Optimized: EnumValue;
};
declare const LayeredDigraphAggressive: {
    None: EnumValue;
    Horizontal: EnumValue;
    Vertical: EnumValue;
    All: EnumValue;
    Less: EnumValue;
    More: EnumValue;
};
declare const LayeredDigraphAlign: {
    None: EnumValue;
};
declare const LayeredDigraphPack: {
    None: EnumValue;
};
declare const GridArrangement: {
    LeftToRight: EnumValue;
    RightToLeft: EnumValue;
};
declare const ImageStretch: {
    None: EnumValue;
    Fill: EnumValue;
    Uniform: EnumValue;
    UniformToFill: EnumValue;
};
declare const Sizing: {
    None: EnumValue;
    Prop: EnumValue;
    Auto: EnumValue;
};
declare const Wrap: {
    Fit: EnumValue;
    DesiredSize: EnumValue;
    None: EnumValue;
};
declare const CycleMode: {
    All: EnumValue;
    NotDirected: EnumValue;
    NotUndirected: EnumValue;
    DestinationTree: EnumValue;
    SourceTree: EnumValue;
};
declare const ChangeType: {
    Property: EnumValue;
    Insert: EnumValue;
    Remove: EnumValue;
    Transaction: EnumValue;
};
declare const SegmentType: {
    Line: EnumValue;
    QuadraticBezier: EnumValue;
    CubicBezier: EnumValue;
    Arc: EnumValue;
    MoveTo: EnumValue;
    Close: EnumValue;
};
declare const AnimationStyle: {
    Default: EnumValue;
    AnimateLocations: EnumValue;
    None: EnumValue;
};
declare const LinkAdjusting: {
    End: EnumValue;
    Stretch: EnumValue;
};
declare const Orientation: {
    None: EnumValue;
    Along: EnumValue;
    Minus90: EnumValue;
};
declare const GestureMode: {
    None: EnumValue;
    Cancel: EnumValue;
    Zoom: EnumValue;
};
declare const WheelMode: {
    Zoom: EnumValue;
};
declare const TextEditingAccept: {
    LostFocus: EnumValue;
};
declare const TextEditingStarting: {
    SingleClick: EnumValue;
};
declare const LayoutConditions: {
    Standard: EnumValue;
    NodeSized: EnumValue;
};
declare const GeometryStretch: {
    Uniform: EnumValue;
};
declare const GeometryType: {
    Line: EnumValue;
    Path: EnumValue;
};
declare const LinkingDirection: {
    ForwardsOnly: EnumValue;
};
declare const TriggerStart: {
    Bundled: EnumValue;
};
declare const Overflow: {
    Clip: EnumValue;
    Ellipsis: EnumValue;
};
declare const TextOverflow: {
    Clip: EnumValue;
    Ellipsis: EnumValue;
};

export { ActionTool, Adornment, Animation, AnimationDefault, AnimationEaseIn, AnimationEaseInOut, AnimationEaseOut, AnimationEaseOutBounce, AnimationLinear, AnimationManager, AnimationState, AnimationStyle, AnimationStyleAnimateLocations, AnimationStyleDefault, AnimationStyleNone, AnimationTrigger, AutoScale, AutoScaleNone, AutoScaleUniform, AutoScaleUniformToFill, Binding, Brush, BrushLinear, BrushRadial, BrushSolid, CanvasRenderer, ChangeType, ChangedEvent, ChangedEventInsert, ChangedEventProperty, ChangedEventRemove, ChangedEventTransaction, CircularArrangement, CircularArrangementConstantAngle, CircularArrangementConstantDistance, CircularArrangementConstantRadius, CircularArrangementPacked, CircularDirectionBidirectionalLeft, CircularDirectionBidirectionalRight, CircularDirectionClockwise, CircularLayout, CircularNodeDiameterFormulaCircular, CircularNodeDiameterFormulaPythagorean, CircularSorting, CircularSortingAscending, CircularSortingDescending, CircularSortingForwards, CircularSortingOptimized, CircularSortingReverse, ClickCreatingTool, ClickSelectingTool, Color, CommandHandler, ContextMenuTool, Curve, CurveBezier, CurveJumpGap, CurveJumpOver, CurveNone, CycleAll, CycleDestinationTree, CycleMode, CycleNotDirected, CycleNotUndirected, CycleSourceTree, Diagram, DiagramEvent, DragSelectingTool, DraggingTool, EnumValue, FlipBoth, FlipHorizontal, FlipNone, FlipVertical, ForceDirectedLayout, Geometry, GeometryStretch, GeometryStretchUniform, GeometryType, GeometryTypeLine, GeometryTypePath, GestureMode, GestureModeCancel, GestureModeNone, GestureModeZoom, GraduatedPanCenter, GraduatedPanLeft, GraduatedPanNone, GraduatedPanRight, GraphLinksModel, GraphObject, GridAlignment, GridAlignmentLocation, GridAlignmentPosition, GridArrangement, GridArrangementBottomToTop, GridArrangementLeftToRight, GridArrangementRightToLeft, GridArrangementTopToBottom, GridLayout, GridLayoutCenter, GridLayoutLocation, GridSorting, GridSortingAscending, GridSortingDescending, GridSortingForwards, GridSortingReverse, GridWrappingFit, GridWrappingNone, Group, HTMLInfo, ImageStretch, ImageStretchFill, ImageStretchNone, ImageStretchUniform, ImageStretchUniformToFill, InputEvent, Layer, LayeredDigraphAggressive, LayeredDigraphAggressiveAll, LayeredDigraphAggressiveHorizontal, LayeredDigraphAggressiveLess, LayeredDigraphAggressiveMore, LayeredDigraphAggressiveNone, LayeredDigraphAggressiveVertical, LayeredDigraphAlign, LayeredDigraphAlignBottom, LayeredDigraphAlignCenter, LayeredDigraphAlignLower, LayeredDigraphAlignNone, LayeredDigraphAlignTop, LayeredDigraphAlignUpper, LayeredDigraphCycleRemoveDepthFirst, LayeredDigraphCycleRemoveGreedy, LayeredDigraphDirectionDown, LayeredDigraphDirectionLeft, LayeredDigraphDirectionRight, LayeredDigraphDirectionUp, LayeredDigraphInitDepthFirstIn, LayeredDigraphInitDepthFirstOut, LayeredDigraphInitNaive, LayeredDigraphLayeringLongestPathSink, LayeredDigraphLayeringLongestPathSource, LayeredDigraphLayeringOptimalLinkLength, LayeredDigraphLayout, LayeredDigraphPack, LayeredDigraphPackAll, LayeredDigraphPackExpand, LayeredDigraphPackMedian, LayeredDigraphPackNone, LayeredDigraphPackStraighten, Layout, LayoutConditions, LayoutConditionsNodeSized, LayoutConditionsStandard, LayoutEdge, LayoutNetwork, LayoutVertex, Link, LinkAdjusting, LinkAdjustingEnd, LinkAdjustingStretch, LinkReshapingTool, LinkingBaseTool, LinkingDirection, LinkingDirectionForwardsOnly, LinkingTool, List, Map, Margin, Model, Node, Orientation, OrientationAlong, OrientationMinus90, OrientationNone, OrientationPlus180, OrientationPlus90, Overflow, OverflowClip, OverflowEllipsis, Overview, Palette, Panel, PanelAuto, PanelGraduated, PanelGrid, PanelHorizontal, PanelLink, PanelPosition, PanelSpot, PanelTable, PanelTableColumn, PanelTableRow, PanelVertical, PanelViewbox, PanningTool, Part, PathFigure, PathSegment, PathSegmentArc, PathSegmentClose, PathSegmentCubicBezier, PathSegmentLine, PathSegmentMoveTo, PathSegmentQuadraticBezier, Picture, Placeholder, Point, Rect, RelinkingTool, ResizingTool, RotatingTool, Routing, RoutingAvoidsNodes, RoutingNormal, RoutingOrthogonal, RowColumnDefinition, ScrollDocument, ScrollInfinite, ScrollMode, SegmentOrientationAlong, SegmentOrientationNone, SegmentOrientationOpposite, SegmentOrientationOrthogonal, SegmentOrientationParallel, SegmentOrientationPerpendicular, SegmentType, Set, Shape, Size, Sizing, SizingAuto, SizingNone, SizingProp, Spot, Stretch, StretchDefault, StretchFill, StretchHorizontal, StretchNone, StretchUniform, StretchUniformToFill, StretchVertical, TextBlock, TextEditingAccept, TextEditingAcceptLostFocus, TextEditingStarting, TextEditingStartingSingleClick, TextEditingTool, TextOverflow, ThemeManager, Tool, ToolManager, Transaction, TreeAlignment, TreeAlignmentBottomRightBus, TreeAlignmentBus, TreeAlignmentBusBranching, TreeAlignmentCenterChildren, TreeAlignmentCenterSubtrees, TreeAlignmentEnd, TreeAlignmentStart, TreeAlignmentTopLeftBus, TreeArrangement, TreeArrangementFixedRoots, TreeArrangementHorizontal, TreeArrangementVertical, TreeCompaction, TreeCompactionBlock, TreeCompactionNone, TreeLayerStyle, TreeLayerStyleIndividual, TreeLayerStyleSiblings, TreeLayerStyleUniform, TreeLayout, TreeModel, TreePath, TreePathDefault, TreePathDestination, TreePathSource, TreeSorting, TreeSortingAscending, TreeSortingDescending, TreeSortingForwards, TreeSortingReverse, TreeStyle, TreeStyleAlternating, TreeStyleCompact, TreeStyleLastParents, TreeStyleLayered, TreeStyleRootOnly, TriggerStart, TriggerStartBundled, UndoManager, ViewboxStretchFill, ViewboxStretchNone, ViewboxStretchUniform, ViewboxStretchUniformToFill, WheelMode, WheelModeZoom, Wrap, WrapDesiredSize, WrapFit, WrapNone, figures, getFigureGeometry };
export type { AnimationConfig, BrushLike, BrushStop, ChangedEventListener, IMapIterator, Iterable, Iterator, MarginLike, ObjectData };
