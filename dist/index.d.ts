/**
 * EnumValue - GoJS 风格的枚举值基类
 * 每个枚举值是唯一对象实例，通过名称标识
 */
declare class EnumValue {
    static readonly className: string;
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
declare const SizingDefault: EnumValue;
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
declare const CircularDirectionCounterclockwise: EnumValue;
declare const CircularDirectionBidirectionalLeft: EnumValue;
declare const CircularDirectionBidirectionalRight: EnumValue;
/**
 * 官方 4.0 的 LayeredDigraphLayout.direction 是角度（度），
 * 只接受 0 / 90 / 180 / 270：0=向右，90=向下，180=向左，270=向上。
 */
declare const LayeredDigraphDirectionRight = 0;
declare const LayeredDigraphDirectionDown = 90;
declare const LayeredDigraphDirectionLeft = 180;
declare const LayeredDigraphDirectionUp = 270;
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
declare const DiagramEventInitialAnimationStarting = "InitialAnimationStarting";
declare const DiagramEventAnimationStarting = "AnimationStarting";
declare const DiagramEventAnimationFinished = "AnimationFinished";
declare const DiagramEventInitialLayoutCompleted = "InitialLayoutCompleted";
declare const DiagramEventLayoutCompleted = "LayoutCompleted";
declare const DiagramEventSelectionMoved = "SelectionMoved";
declare const DiagramEventSelectionCopied = "SelectionCopied";
declare const DiagramEventSelectionDeleted = "SelectionDeleted";
declare const DiagramEventSelectionGrouped = "SelectionGrouped";
declare const DiagramEventSelectionUngrouped = "SelectionUngrouped";
declare const DiagramEventSelectionMoved2 = "SelectionMoved";
declare const DiagramEventPartCreated = "PartCreated";
declare const DiagramEventPartResized = "PartResized";
declare const DiagramEventPartRotated = "PartRotated";
declare const DiagramEventLinkDrawn = "LinkDrawn";
declare const DiagramEventLinkRelinked = "LinkRelinked";
declare const DiagramEventLinkReshaped = "LinkReshaped";
declare const DiagramEventTextEdited = "TextEdited";
declare const DiagramEventGroupExpanded = "GroupExpanded";
declare const DiagramEventGroupCollapsed = "GroupCollapsed";
declare const DiagramEventSubGraphExpanded = "SubGraphExpanded";
declare const DiagramEventSubGraphCollapsed = "SubGraphCollapsed";
declare const DiagramEventViewportBoundsChanged = "ViewportBoundsChanged";
declare const DiagramEventChanged = "Changed";
declare const DiagramEventModelChanged = "ModelChanged";
declare const DiagramEventClipboardChanged = "ClipboardChanged";
declare const DiagramEventUndoManagerStateChanged = "UndoManagerStateChanged";
declare const LayerBackground = "Background";
declare const LayerGrid = "Grid";
declare const LayerForeground = "Foreground";
declare const LayerAdornment = "Adornment";
declare const LayerTool = "Tool";
declare const AdornmentSelection = "Selection";
declare const AdornmentResize = "Resize";
declare const AdornmentRotate = "Rotate";
declare const AdornmentLinkReshape = "LinkReshape";
declare const AdornmentRelink = "Relink";
declare const AdornmentToolTip = "ToolTip";
declare const AdornmentContextMenu = "ContextMenu";
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
declare const TreeAlignmentCustom: EnumValue;
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
declare const LayoutConditionsNone = 0;
declare const LayoutConditionsAdded = 1;
declare const LayoutConditionsRemoved = 2;
declare const LayoutConditionsShown = 4;
declare const LayoutConditionsHidden = 8;
declare const LayoutConditionsNodeSized = 16;
declare const LayoutConditionsGroupLayout = 32;
declare const LayoutConditionsNodeReplaced = 64;
declare const LayoutConditionsStandard = 127;
declare const LayoutConditionsAll = 16777215;
declare const GeometryStretchDefault: EnumValue;
declare const GeometryStretchUniform: EnumValue;
declare const GeometryStretchNone: EnumValue;
declare const GeometryStretchFill: EnumValue;
declare const GeometryStretchUniformToFill: EnumValue;
declare const VerticalTop: EnumValue;
declare const VerticalCenter: EnumValue;
declare const VerticalBottom: EnumValue;
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
declare const TextFormatTrim: EnumValue;
declare const TextFormatNone: EnumValue;
declare const PortSpreadingNone: EnumValue;
declare const PortSpreadingEvenly: EnumValue;
declare const PortSpreadingPacked: EnumValue;
declare const CollapsePolicyTreeParent: EnumValue;
declare const CollapsePolicyAllParents: EnumValue;
declare const CollapsePolicyAnyParents: EnumValue;
declare const ColorSpaceLab: EnumValue;
declare const ColorSpaceHSL: EnumValue;
declare const ColorSpaceOklch: EnumValue;
declare const ReshapingBehaviorNone: EnumValue;
declare const ReshapingBehaviorHorizontal: EnumValue;
declare const ReshapingBehaviorVertical: EnumValue;
declare const ReshapingBehaviorAll: EnumValue;
declare const TextEditingStateNone: EnumValue;
declare const TextEditingStateActive: EnumValue;
declare const TextEditingStateEditing: EnumValue;
declare const TextEditingStateValidating: EnumValue;
declare const TextEditingStateInvalid: EnumValue;
declare const TextEditingStateValidated: EnumValue;
declare const BrushPattern: EnumValue;
declare const CycleNotDirectedFast: EnumValue;
declare const LinkAdjustingNone: EnumValue;
declare const LinkAdjustingScale: EnumValue;
declare const RoutingAvoidsNodesStraight: EnumValue;
/** 官方 `Link.None = 0`（Link 的 routing 无路由算法；官方数值 0，本项目用独立枚举值） */
declare const RoutingNone: EnumValue;
declare const OrientationOpposite: EnumValue;
declare const OrientationUpright: EnumValue;
declare const OrientationPlus90Upright: EnumValue;
declare const OrientationMinus90Upright: EnumValue;
declare const OrientationUpright45: EnumValue;
declare const SizingProportionalExtra: EnumValue;
declare const TriggerStartDefault: EnumValue;
declare const TriggerStartImmediate: EnumValue;
declare const WrapBreakAll: EnumValue;
declare const GeometryTypeRectangle: EnumValue;
declare const GeometryTypeEllipse: EnumValue;
declare const SegmentTypeMove: EnumValue;
declare const SegmentTypeBezier: EnumValue;
declare const SegmentTypeSvgArc: EnumValue;
declare const CircularArrangementConstantSpacing: EnumValue;
declare const LayeredDigraphAlignUpperLeft: EnumValue;
declare const LayeredDigraphAlignUpperRight: EnumValue;
declare const LayeredDigraphAlignLowerLeft: EnumValue;
declare const LayeredDigraphAlignLowerRight: EnumValue;
declare const LayeredDigraphAlignAll: EnumValue;
declare const LayeredDigraphCycleRemoveFromLayers: EnumValue;
declare const LayeredDigraphPackMaybeExpand: EnumValue;
declare const LinkingDirectionEither: EnumValue;
declare const LinkingDirectionBackwardsOnly: EnumValue;
declare const TextEditingAcceptMouseDown: EnumValue;
declare const TextEditingAcceptTab: EnumValue;
declare const TextEditingAcceptEnter: EnumValue;
declare const TextEditingStartingSingleClickSelected: EnumValue;
declare const TextEditingStartingDoubleClick: EnumValue;
declare const WheelModeScroll: EnumValue;
declare const WheelModeNone: EnumValue;
/** 官方 SegmentType = {Move, Line, Bezier, QuadraticBezier, Arc, SvgArc}。
 * 本项目 PathSegment 内部的 MoveTo / Close 常量仍导出，但不进该命名空间。
 * Bezier/Move 直接映射到内部的 CubicBezier/MoveTo，使官方代码创建的三次贝塞尔
 * 与移动段能被所有内部绘制/序列化逻辑按 'CubicBezier'/'MoveTo' 处理。 */
declare const SegmentType: {
    Move: EnumValue;
    Line: EnumValue;
    Bezier: EnumValue;
    QuadraticBezier: EnumValue;
    Arc: EnumValue;
    SvgArc: EnumValue;
};
declare const GeometryStretch: {
    None: EnumValue;
    Default: EnumValue;
    Fill: EnumValue;
    Uniform: EnumValue;
};
declare const GeometryType: {
    Line: EnumValue;
    Rectangle: EnumValue;
    Ellipse: EnumValue;
    Path: EnumValue;
};

declare const Flip: {
    None: EnumValue;
    Vertical: EnumValue;
    Horizontal: EnumValue;
    Both: EnumValue;
};
declare const TextFormat: {
    Trim: EnumValue;
    None: EnumValue;
};
declare const PortSpreading: {
    None: EnumValue;
    Evenly: EnumValue;
    Packed: EnumValue;
};
declare const CollapsePolicy: {
    TreeParent: EnumValue;
    AllParents: EnumValue;
    AnyParents: EnumValue;
};
declare const ViewboxStretch: {
    Uniform: EnumValue;
    UniformToFill: EnumValue;
};
declare const BrushType: {
    Solid: EnumValue;
    Linear: EnumValue;
    Radial: EnumValue;
    Pattern: EnumValue;
};
declare const ColorSpace: {
    Lab: EnumValue;
    HSL: EnumValue;
    Oklch: EnumValue;
};
declare const CircularNodeDiameterFormula: {
    Pythagorean: EnumValue;
    Circular: EnumValue;
};
declare const ReshapingBehavior: {
    None: EnumValue;
    Horizontal: EnumValue;
    Vertical: EnumValue;
    All: EnumValue;
};
declare const TextEditingState: {
    None: EnumValue;
    Active: EnumValue;
    Editing: EnumValue;
    Validating: EnumValue;
    Invalid: EnumValue;
    Validated: EnumValue;
};
declare const Figures: {
    None: string;
    Rectangle: string;
    Square: string;
    RoundedRectangle: string;
    Border: string;
    RoundedTopRectangle: string;
    RoundedBottomRectangle: string;
    RoundedLeftRectangle: string;
    RoundedRightRectangle: string;
    Ellipse: string;
    Circle: string;
    TriangleRight: string;
    TriangleDown: string;
    TriangleLeft: string;
    TriangleUp: string;
    Triangle: string;
    Diamond: string;
    LineH: string;
    LineV: string;
    BarH: string;
    BarV: string;
    MinusLine: string;
    PlusLine: string;
    XLine: string;
    LineRight: string;
    LineDown: string;
    LineLeft: string;
    LineUp: string;
    Capsule: string;
    Borders: string;
};
declare const Arrowheads: {
    Standard: string;
    Backward: string;
    Triangle: string;
    BackwardTriangle: string;
    Boomerang: string;
    BackwardBoomerang: string;
    SidewaysV: string;
    BackwardV: string;
    OpenTriangle: string;
    BackwardOpenTriangle: string;
    OpenTriangleLine: string;
    BackwardOpenTriangleLine: string;
    OpenTriangleTop: string;
    BackwardOpenTriangleTop: string;
    OpenTriangleBottom: string;
    BackwardOpenTriangleBottom: string;
    HalfTriangleTop: string;
    BackwardHalfTriangleTop: string;
    HalfTriangleBottom: string;
    BackwardHalfTriangleBottom: string;
    ForwardSemiCircle: string;
    BackwardSemiCircle: string;
    Feather: string;
    BackwardFeather: string;
    DoubleFeathers: string;
    BackwardDoubleFeathers: string;
    TripleFeathers: string;
    BackwardTripleFeathers: string;
    ForwardSlash: string;
    BackSlash: string;
    DoubleForwardSlash: string;
    DoubleBackSlash: string;
    TripleForwardSlash: string;
    TripleBackSlash: string;
    Fork: string;
    BackwardFork: string;
    LineFork: string;
    BackwardLineFork: string;
    CircleFork: string;
    BackwardCircleFork: string;
    CircleLineFork: string;
    BackwardCircleLineFork: string;
    Circle: string;
    Block: string;
    StretchedDiamond: string;
    Diamond: string;
    Chevron: string;
    StretchedChevron: string;
    NormalArrow: string;
    X: string;
    TailedNormalArrow: string;
    DoubleTriangle: string;
    BigEndArrow: string;
    ConcaveTailArrow: string;
    RoundedTriangle: string;
    SimpleArrow: string;
    AccelerationArrow: string;
    BoxArrow: string;
    TriangleLine: string;
    CircleEndedArrow: string;
    DynamicWidthArrow: string;
    EquilibriumArrow: string;
    FastForward: string;
    Kite: string;
    HalfArrowTop: string;
    HalfArrowBottom: string;
    OpposingDirectionDoubleArrow: string;
    PartialDoubleTriangle: string;
    LineCircle: string;
    DoubleLineCircle: string;
    TripleLineCircle: string;
    CircleLine: string;
    DiamondCircle: string;
    PlusCircle: string;
    OpenRightTriangleTop: string;
    OpenRightTriangleBottom: string;
    Line: string;
    DoubleLine: string;
    TripleLine: string;
    PentagonArrow: string;
};
declare const ToolNames: {
    Action: string;
    Relinking: string;
    LinkReshaping: string;
    Rotating: string;
    Resizing: string;
    Linking: string;
    Dragging: string;
    DragSelecting: string;
    Panning: string;
    ContextMenu: string;
    TextEditing: string;
    ClickCreating: string;
    ClickSelecting: string;
};
declare const Builders: {
    Button: string;
    TreeExpanderButton: string;
    SubGraphExpanderButton: string;
    ToolTip: string;
    ContextMenu: string;
    ContextMenuButton: string;
    PanelExpanderButton: string;
    CheckBoxButton: string;
    CheckBox: string;
    AutoRepeatButton: string;
    ToggleSwitch: string;
    Toggle: string;
};
declare const LayerNames: {
    Grid: string;
    ViewportBackground: string;
    Background: string;
    Default: string;
    Foreground: string;
    ViewportForeground: string;
    Adornment: string;
    Tool: string;
};

/**
 * 官方 IKeyValuePair<K, V>（go.d.ts:538）
 * A (key, value) pair, used in {@link Map}s.
 */
interface IKeyValuePair<K, V> {
    /**
     * Gets a key for a value in a Map.
     * @returns the key uniquely identifying a value in a Map.
     */
    readonly key: K;
    /**
     * Gets a value in a Map.
     * @returns a value in a Map corresponding to a key.
     */
    readonly value: V;
}

/**
 * 官方对齐的集合迭代接口（go.d.ts 331-533 行）
 *
 * 官方 Iterable:
 *   iterator: Iterator<T>
 *   [Symbol.iterator](): IterableIterator<T>
 *   first(): T | null
 *   readonly count: number
 *
 * 官方 Iterator<T> extends Iterable<T>:
 *   iterator: Iterator<T>        (返回自身)
 *   next(): boolean
 *   hasNext(): boolean
 *   first(): T | null
 *   reset(): void
 *   any(pred): boolean
 *   all(pred): boolean
 *   each(func): void
 *   map<S>(func): Iterator<S>
 *   filter(pred): Iterator<T>
 *   readonly value: T
 *   readonly key: any            (官方 key 就是 any)
 *   readonly count: number
 *
 * 官方 IMapIterator<K, T>（独立接口，**不**继承 Iterator）:
 *   first()/any/all/each/map/filter 的参数是 IKeyValuePair<K, T>，不是 T
 */

/** 官方 Iterable<T>（go.d.ts:331） */
interface Iterable$1<T> {
    /** Gets an Iterator that can iterate over the items in the collection. */
    iterator: Iterator<T>;
    [Symbol.iterator](): IterableIterator<T>;
    /** Returns the first item in the collection, or null if there is none. */
    first(): T | null;
    /** This read-only property is the number of elements in the collection. */
    readonly count: number;
}
/**
 * 官方 Iterator<T>（go.d.ts:379）
 * GoJS iteration is quite different than ECMAScript iteration.
 */
interface Iterator<T> extends Iterable$1<T> {
    /** Returns itself, for code that expects an Iterable instead of an Iterator. */
    iterator: Iterator<T>;
    /**
     * Advance the iterator to the next item; call before accessing value.
     * @returns whether another item is available
     */
    next(): boolean;
    /** Advance to the next item; synonym for next(). */
    hasNext(): boolean;
    /** Advance to the first item and return it, or null. For Map iterators this returns a key/value pair. */
    first(): T | null;
    /** Start this iterator all over again. */
    reset(): void;
    /** True if any invocation of pred on items is true. Automatically resets. */
    any(pred: (x: T) => boolean): boolean;
    /** True if all invocations of pred on items are true. For an empty collection returns true. */
    all(pred: (x: T) => boolean): boolean;
    /** Call func on each item; returns void officially. Automatically resets. */
    each(func: (x: T) => void): void;
    /** Call func on each item and present the results in an iterator. */
    map<S>(func: (x: T) => S): Iterator<S>;
    /** Present each item for which pred returns true in an iterator. */
    filter(pred: (x: T) => boolean): Iterator<T>;
    /** Gets the current item, assuming next() has just returned true. */
    readonly value: T;
    /** Gets the current index; official type is any. */
    readonly key: any;
    /** The total number of items in the iterated collection. */
    readonly count: number;
}
/**
 * 官方 IMapIterator<K, T>（go.d.ts:489）
 * Iterating over a Map provides key and value, where value's type is T (not IKeyValuePair).
 *
 * 注意它**不继承** Iterator —— 谓词/回调收到的是 IKeyValuePair<K, T>，
 * first() 返回的也是 IKeyValuePair<K, T> | null。
 */
interface IMapIterator<K, T> {
    /** {@inheritDoc Iterator.iterator} */
    iterator: IMapIterator<K, T>;
    /** {@inheritDoc Iterator.next} */
    next(): boolean;
    /** {@inheritDoc Iterator.hasNext} */
    hasNext(): boolean;
    /**
     * Advance if needed to the first item in the collection and return it, or return null if there is none.
     * Returns a *key/value pair*, not a *value*.
     */
    first(): IKeyValuePair<K, T> | null;
    /** {@inheritDoc Iterator.reset} */
    reset(): void;
    /** {@inheritDoc Iterator.any} */
    any(pred: (x: IKeyValuePair<K, T>) => boolean): boolean;
    /** {@inheritDoc Iterator.all} */
    all(pred: (x: IKeyValuePair<K, T>) => boolean): boolean;
    /** {@inheritDoc Iterator.each} */
    each(func: (x: IKeyValuePair<K, T>) => void): IMapIterator<K, T>;
    /** {@inheritDoc Iterator.map} */
    map<S>(func: (x: IKeyValuePair<K, T>) => S): Iterator<S>;
    /** {@inheritDoc Iterator.filter} */
    filter(pred: (x: IKeyValuePair<K, T>) => boolean): Iterator<IKeyValuePair<K, T>>;
    /** Gets the current value in the collection, assuming next() has just returned true. */
    readonly value: T;
    /** Gets the current key in the collection, assuming next() has just returned true. */
    readonly key: K;
    /** {@inheritDoc Iterator.count} */
    readonly count: number;
}

/**
 * Set - 无序集合（对齐官方 go.d.ts:1009 class Set<T> implements Iterable<T>）
 *
 * 官方 API:
 *   constructor(coll?: Iterable<T> | globalThis.Iterable<T>)
 *   [Symbol.iterator]() / values() / keys() / entries() / toString()
 *   add(val) / addAll(coll) / has(val) / contains(val)
 *   containsAll(coll) / containsAny(coll)
 *   delete(val) / remove(val) / removeAll(coll) / retainAll(coll) / clear()
 *   first() / any(pred) / all(pred) / each(func) / map<S>(func) / filter(pred)
 *   copy() / toArray() / toList()
 *   count / size / iterator / forEach
 *
 * 官方对 null 的处理：add(null) 忽略；addAll/removeAll/retainAll(null) 直接返回；
 * containsAll(null) 与 containsAny(null) 都返回 true。
 */
declare class Set<T> implements Iterable$1<T> {
    protected _data: T[];
    constructor(iterable?: Iterable$1<T> | T[] | globalThis.Iterable<T> | null);
    get count(): number;
    get size(): number;
    get iterator(): Iterator<T>;
    /** 是否为空（项目扩展，官方无此成员） */
    get isEmpty(): boolean;
    [Symbol.iterator](): globalThis.IterableIterator<T>;
    /** 官方：返回值的 JavaScript 迭代器（不产生旧式 GoJS Iterator）。 */
    values(): globalThis.IterableIterator<T>;
    /** 官方：兼容 JS Set，产生值的 JavaScript 迭代器。 */
    keys(): globalThis.IterableIterator<T>;
    /** 官方：兼容 JS Set，产生 [value, value] 的 JavaScript 迭代器。 */
    entries(): globalThis.IterableIterator<[T, T]>;
    /** 官方：`"Set()#" + __gohashid` */
    toString(): string;
    /** 返回第一个元素（无则 null） */
    first(): T | null;
    /** 添加元素；null 被忽略（与官方一致）。 */
    add(item: T): this;
    /**
     * Adds all of the values of a collection to this Set.
     * @param coll - the collection of items to add; can be a GoJS Iterable or a JavaScript Iterable, including an Array
     * @returns This modified Set.
     */
    addAll(coll: Iterable$1<T> | T[] | globalThis.Iterable<T> | null): this;
    /** Returns whether the given value is in this Set. */
    contains(item: T): boolean;
    /**
     * Returns whether all of the values of a given collection are in this Set.
     * 官方：coll 为 null 时返回 true。
     */
    containsAll(coll: Iterable$1<T> | T[] | globalThis.Iterable<T> | null): boolean;
    /**
     * Returns whether any of the values of a given collection are in this Set.
     * 官方：coll 为 null 时返回 true。
     */
    containsAny(coll: Iterable$1<T> | T[] | globalThis.Iterable<T> | null): boolean;
    /** Removes all values of a given collection from this Set. 官方：null 直接返回。 */
    removeAll(coll: Iterable$1<T> | T[] | globalThis.Iterable<T> | null): this;
    /** Removes all values that are not in the given collection. 官方：null 直接返回。 */
    retainAll(coll: Iterable$1<T> | T[] | globalThis.Iterable<T> | null): this;
    /** Removes a value from this Set, if present. */
    remove(item: T): boolean;
    /** 删除元素（同 remove，ES Set 语义） */
    delete(item: T): boolean;
    /** 是否包含元素 */
    has(item: T): boolean;
    /** 清空 */
    clear(): this;
    /** 转换为数组 */
    toArray(): T[];
    /** 转换为官方 Set */
    toSet(): Set<T>;
    /** 官方：转成 List（顺序未定义）。 */
    toList(): List<T>;
    /** 遍历（官方：@param func a function to call for each value in the Set） */
    each(func: (item: T) => void): this;
    /** 官方 forEach(callbackFunc(value1, value2, map), thisArg) */
    forEach(callbackFunc: (value1: T, value2: T, map: Set<T>) => void, thisArg?: any): void;
    /** 映射（官方 map<S>(func): Set<S>） */
    map<U>(func: (item: T) => U): Set<U>;
    /** 过滤（官方 filter 返回 Set，不是 Iterator） */
    filter(func: (item: T) => boolean): Set<T>;
    /** 任一元素满足条件 */
    any(pred: (item: T) => boolean): boolean;
    /** 所有元素满足条件 */
    all(func: (item: T) => boolean): boolean;
    /** 并集 */
    union(other: Set<T>): Set<T>;
    /** 交集 */
    intersect(other: Set<T>): Set<T>;
    /** 差集 */
    subtract(other: Set<T>): Set<T>;
    /** 复制 */
    copy(): Set<T>;
    private _indexOf;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
}

/**
 * List - 有序列表（对齐官方 go.d.ts:672 class List<T> implements Iterable<T>）
 *
 * 官方 API:
 *   constructor(coll?: Iterable<T> | globalThis.Iterable<T>)
 *   add(val: T): this / push(val: T): void / addAll(coll): this
 *   contains(val) / has(val) / indexOf(val) / elt(i) / get(i) / setElt(i, val) / set(i, val)
 *   first(): T | null / last(): T | null / pop(): T | null
 *   any(pred) / all(pred) / each(func): this / map<S>(func): List<S> / filter(pred): List<T>
 *   insertAt(i, val) / remove(val): boolean / delete(val): boolean / removeAt(i): void
 *   removeRange(from, to): this / copy() / toArray() / toSet()
 *   sort(func) / sortRange(func, from?, to?) / reverse()
 *   count / size / length / iterator / iteratorBackwards / [Symbol.iterator]
 */
declare class List<T> implements Iterable$1<T> {
    private _data;
    constructor(iterable?: Iterable$1<T> | T[] | globalThis.Iterable<T> | null);
    /** This class implements the JavaScript Symbol.iterator. */
    [Symbol.iterator](): globalThis.IterableIterator<T>;
    private _cursor;
    /** 推进到下一项；调用后才读 value。 */
    next(): boolean;
    /** next() 的同义词。 */
    hasNext(): boolean;
    /** 假定刚调用过 next() 且返回 true，取当前项。 */
    get value(): T;
    /** 当前下标；官方类型是 any。 */
    get key(): any;
    /** 重置光标，让这个 List 可以重新被当迭代器走一遍。 */
    reset(): void;
    /** 官方：`"List()#" + __gohashid` */
    toString(): string;
    /** Adds a given value to the end of the List. */
    add(val: T): this;
    /** Adds a given value to the end of the List. */
    push(val: T): void;
    /**
     * Adds all of the values of a collection to the end of this List.
     * @param coll - a GoJS Iterable or a JavaScript Iterable, including an Array
     */
    addAll(coll: Iterable$1<T> | T[] | globalThis.Iterable<T> | null): this;
    /** Clears the List; sets count to zero. */
    clear(): this;
    /** Returns whether the given value is in this List. A synonym for has. */
    contains(val: T): boolean;
    /** 是否包含指定元素（同 contains） */
    has(val: T): boolean;
    /** Returns the index of the given value if it is in this List; -1 if not. */
    indexOf(val: T): number;
    /** Returns the element at the given index. */
    elt(i: number): T;
    /** Returns the element at the given index. A synonym for elt. */
    get(index: number): T;
    /** Set the element at the given index to a given value. */
    setElt(i: number, val: T): void;
    /** Set the element at the given index to a given value. */
    set(index: number, val: T): void;
    /** Returns the first item in the list, or null if there is none. */
    first(): T | null;
    /** Returns the last item in the list, or null if there is none. */
    last(): T | null;
    /** Returns the last item and removes it, or null if there is none. */
    pop(): T | null;
    /** True if any invocation of pred is true. For an empty collection this returns false. */
    any(pred: (a: T) => boolean): boolean;
    /** True if all invocations of pred are true. For an empty collection returns true. */
    all(pred: (item: T) => boolean): boolean;
    /** Call func on each item; returns this List. */
    each(func: (item: T) => void): this;
    /** 官方 map<S>(func): List<S> */
    map<U>(func: (item: T) => U): List<U>;
    /** 官方 filter(pred): List<T> —— 返回 List，不是 Iterator */
    filter(pred: (item: T) => boolean): List<T>;
    /** 在指定位置插入元素 */
    insertAt(i: number, val: T): void;
    /** Removes a given value from the List. */
    remove(item: T): boolean;
    /** Removes a value (ES synonym for remove). */
    delete(val: T): boolean;
    /** Removes the item at the given index. */
    removeAt(index: number): void;
    /** 移除第一个元素 */
    removeFirst(): T | null;
    /** 移除最后一个元素 */
    removeLast(): T | null;
    /** Removes a range of items from the list. */
    removeRange(from: number, to: number): this;
    /** 转换为数组 */
    toArray(): T[];
    /** 转换为官方 Set */
    toSet(): Set<T>;
    /** 排序 */
    sort(sortfunc?: (a: T, b: T) => number): this;
    /**
     * 官方（未在主文档中记录）：对 `[from, to)` 区间排序。
     * @param sortfunc 比较函数
     * @param from 起始下标（含），默认 0
     * @param to 结束下标（**不含**），默认列表长度
     */
    sortRange(sortfunc: (a: T, b: T) => number, from?: number, to?: number): this;
    /** 反转 */
    reverse(): this;
    /** 复制 */
    copy(): List<T>;
    get count(): number;
    get size(): number;
    get length(): number;
    get iterator(): Iterator<T>;
    get iteratorBackwards(): Iterator<T>;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
}

/**
 * Map - 无序键值对集合（对齐官方 go.d.ts:1272 `class Map<K, V>`）
 *
 * 官方 Map **不** implements `Iterable<V>` —— 它的 first/each/any/all/map/filter
 * 收到的都是 `IKeyValuePair<K, V>`，迭代器是独立的 `IMapIterator<K, V>`。
 *
 * 官方 API：
 *   constructor(coll?)
 *   [Symbol.iterator]() / entries() / keys() / values() / toString()
 *   set(k,v) / add(k,v) / addAll(coll) / first() / any() / all() / each() / map() / filter()
 *   has(k) / contains(k) / get(k) / getValue(k) / delete(k) / remove(k) / clear()
 *   copy() / toArray() / toKeySet()
 *   count / size / iterator / iteratorKeys / iteratorValues / forEach
 */
declare class Map$1<K, V> {
    private _keys;
    private _values;
    constructor(coll?: Iterable$1<IKeyValuePair<K, V>> | Array<IKeyValuePair<K, V>> | Map$1<K, V> | globalThis.Iterable<readonly [K, V]> | null);
    /** 官方：返回键值对的 JavaScript 迭代器。 */
    [Symbol.iterator](): globalThis.IterableIterator<[K, V]>;
    /** 官方：返回键值对 ([key, value]) 的 JavaScript 迭代器。 */
    entries(): globalThis.IterableIterator<[K, V]>;
    /** 官方：返回键的 JavaScript 迭代器。 */
    keys(): globalThis.IterableIterator<K>;
    /** 官方：返回值的 JavaScript 迭代器。 */
    values(): globalThis.IterableIterator<V>;
    /** 官方：`"Map()#" + __gohashid` */
    toString(): string;
    /** 添加/替换一个键值对，返回 this。 */
    set(key: K, val: V): this;
    /** set 的同义词（官方 add 返回 Map<K,V>）。 */
    add(key: K, val: V): this;
    /**
     * 批量添加键值对。
     * 若键已存在则替换其值。
     */
    addAll(coll: Iterable$1<IKeyValuePair<K, V>> | Array<IKeyValuePair<K, V>> | Map$1<K, V> | globalThis.Iterable<readonly [K, V]> | null): this;
    /** Returns the first key/value pair, or null if there is none. */
    first(): IKeyValuePair<K, V> | null;
    /** True if any invocation of pred is true. Pred receives an IKeyValuePair. */
    any(pred: (a: IKeyValuePair<K, V>) => boolean): boolean;
    /** True if all invocations of pred are true; empty Map returns true. */
    all(pred: (a: IKeyValuePair<K, V>) => boolean): boolean;
    /** Calls func on each key/value pair; returns this Map. */
    each(func: (a: IKeyValuePair<K, V>) => void): this;
    /** Returns a new Map with the same keys but values produced by func. */
    map<S>(func: (a: IKeyValuePair<K, V>) => S): Map$1<K, S>;
    /** Returns a new Map containing only the pairs for which pred returns true. */
    filter(pred: (a: IKeyValuePair<K, V>) => boolean): Map$1<K, V>;
    /** Whether the given key is in this Map. */
    has(key: K): boolean;
    /** has 的同义词。 */
    contains(key: K): boolean;
    /** Returns the value for a key, or null if not present. */
    get(key: K): V | null;
    /** get 的同义词（官方 getValue 只接一个参数）。 */
    getValue(key: K, defaultValue?: V): V | null;
    /** Removes a key if present; returns whether it was removed. */
    delete(key: K): boolean;
    /** delete 的同义词。 */
    remove(key: K): boolean;
    /** Clears the Map. */
    clear(): this;
    /** Returns a shallow copy of this Map. */
    copy(): Map$1<K, V>;
    /** Produces an Array of IKeyValuePair objects. */
    toArray(): Array<IKeyValuePair<K, V>>;
    /**
     * Produces a Set of the keys of this Map.
     *
     * 注意：官方返回的是**只读的实时视图**（内部类 `MapKeySet`），
     * 这里返回的是键的快照副本；本项目内没有依赖实时性的地方。
     */
    toKeySet(): Set<K>;
    /** The number of associations in the Map. */
    get count(): number;
    /** The number of associations in the Map. */
    get size(): number;
    /** Whether this Map is empty.（项目扩展，官方无此成员） */
    get isEmpty(): boolean;
    /** Gets an IMapIterator over the key/value pairs. */
    get iterator(): IMapIterator<K, V>;
    /** Gets an Iterator over the keys. */
    get iteratorKeys(): Iterator<K>;
    /** Gets an Iterator over the values. */
    get iteratorValues(): Iterator<V>;
    /** Calls callback once per key/value pair. */
    forEach(callback: (value: V, key: K, map: Map$1<K, V>) => void, thisArg?: unknown): void;
    /** 获取最后一个键值对。 */
    last(): IKeyValuePair<K, V> | null;
    /** 转换为普通对象（仅 string/number 键）。 */
    toObject(): Record<string, V>;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    private _indexOf;
}

/**
 * Size - 宽高尺寸（对齐官方 go.d.ts:1882 class Size）
 *
 * 官方语义要点：
 * - 宽高必须非负（负数抛错），NaN 允许
 * - 构造器只接受 0 或 2 个数字参数，否则抛错
 * - inflate 原地修改，收缩不越过 0
 * - isReal() 是方法而非属性
 * - toString 为调试格式 "Size(w,h)"
 */
declare class Size {
    private _width;
    private _height;
    constructor(width?: number, height?: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    /** Modify this Size with new Width and Height values. */
    setTo(w: number, h: number): this;
    /** Modify this Size so that its Width and Height values are the same as the given Size. */
    set(s: Size): this;
    /** Create a copy of this Size, with the same values. */
    copy(): Size;
    /** Indicates whether the given Size is equal to the current Size. */
    equals(s: Size): boolean;
    /** Indicates whether the given size (w, h) is equal to this Size. */
    equalTo(w: number, h: number): boolean;
    /** True when the given Size is nearly equal to this Size（容差 0.5，官方 G.c）。 */
    equalsApprox(s: Size): boolean;
    /**
     * Modify this Size so that its width and height are changed by the given distances.
     * 负值收缩，但不会小于零。
     */
    inflate(w: number, h: number): this;
    /** True if this Size has Width and Height values that are real numbers and not infinity. */
    isReal(): boolean;
    /** 官方调试字符串："Size(3,4)"；数据序列化请用 Size.stringify。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /** 读入由 Size.stringify 产生的字符串。官方容错：空串 → (0,0)，缺 h → 0。 */
    static parse(str: string): Size;
    /** 写出可被 Size.parse 读回的字符串："1 2"。 */
    static stringify(val: Size): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Size) => string;
    /** 冻结本对象。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /** 是否为空（宽或高 <= 0；项目扩展，官方 Size 无 isEmpty）。 */
    isEmpty(): boolean;
    /** 零尺寸常量（项目扩展）。 */
    static readonly Zero: Size;
    /** 未测量占位常量（项目扩展，等价官方内部 Size.NaN）。 */
    static readonly NaN: Size;
}

/**
 * Spot - 定位点（对齐官方 go.d.ts:2580 class Spot）
 *
 * 官方语义要点：
 * - 点位 Spot：x,y ∈ [0,1] + 绝对偏移 offsetX/offsetY；isSpot() = x,y 均非 NaN
 * - 特殊值用 NaN 表示：None=(NaN,NaN,0,0)、Default=(NaN,NaN,-1,0)、
 *   边侧 (NaN,NaN,1,位掩码)：top=1 left=2 right=4 bottom=8
 * - equals 对 NaN 做等价判断（NaN 视为相等）；isNone/isSide/... 是方法而非属性
 * - includesSide(s)：超集语义 (this.oy & s.oy) === s.oy
 * - 仅 copy() 和 opposite() 分配新对象；静态常量均被冻结
 * - set(s) 接受 Spot；setTo(x,y,offx,offy) 才是四数值
 */
declare class Spot {
    private _x;
    private _y;
    private _offsetX;
    private _offsetY;
    constructor(x?: number, y?: number, offx?: number, offy?: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get offsetX(): number;
    set offsetX(value: number);
    get offsetY(): number;
    set offsetY(value: number);
    /** Modify this Spot with new X, Y, OffsetX, and OffsetY values. */
    setTo(x: number, y: number, offx: number, offy: number): this;
    /** Modify this Spot so that its values are the same as the given Spot. */
    set(s: Spot): this;
    /** Create a copy of this Spot, with the same values. */
    copy(): Spot;
    /**
     * Two spots are equal if all four property values are the same.
     * 官方对 NaN 做等价判断（NaN 与 NaN 视为相等）。
     */
    equals(s: Spot): boolean;
    /** Return a new spot that is opposite this spot. */
    opposite(): Spot;
    /**
     * This predicate is true if this Spot is a side that includes the side(s)
     * given by the argument Spot（超集语义）。
     */
    includesSide(side: Spot): boolean;
    /** True if this is a specific spot point, not a side nor Spot.None. */
    isSpot(): boolean;
    /** True if this is an unspecific special spot, such as Spot.None or Spot.Default or one of the side spots. */
    isNoSpot(): boolean;
    /** True if this is a special spot referring to one (or more) of the sides. */
    isSide(): boolean;
    /** True if this is a special spot referring to no particular spot point or side. */
    isNone(): boolean;
    /** True if this is a special spot indicating that the real spot value will come from another source. */
    isDefault(): boolean;
    /** 官方调试字符串；数据序列化请用 Spot.stringify（非点位输出命名，如 "TopSide"）。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /** 读入由 Spot.stringify 产生的字符串；也接受命名（"TopCenter"、"TopSide"、"None" 等）。 */
    static parse(str: string): Spot;
    /** 写出可被 Spot.parse 读回的字符串；点位为 "x y ox oy"，特殊值为命名（如 "TopSide"）。 */
    static stringify(val: Spot): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Spot) => string;
    /** 冻结本对象（官方静态常量即被冻结）。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /**
     * 在给定矩形中的实际坐标（项目扩展，官方无此成员）。
     *
     * 兼容旧版（阶段 1 前）边侧/Default 的点位表示语义：
     * - 边侧 Spot 映射为旧版点位 + 偏移（见 _legacySidePoint）
     * - Default 映射为左上角（旧版 (0,0) 表示）
     * - None 保持 NaN（与旧版一致）
     */
    positionInRect(r: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): {
        x: number;
        y: number;
    };
    /** 官方位掩码（top=1 left=2 right=4 bottom=8）→ 旧版点位表示；未知组合回退中心。 */
    private static _legacySidePoint;
    /** 创建冻结的边侧 Spot（官方内部 _e 的等价物）。 */
    private static _side;
    /** 无特定位置。 */
    static readonly None: Spot;
    /** 真实值来自其他来源。 */
    static readonly Default: Spot;
    static readonly TopLeft: Spot;
    static readonly TopCenter: Spot;
    static readonly TopRight: Spot;
    static readonly LeftCenter: Spot;
    static readonly Center: Spot;
    static readonly RightCenter: Spot;
    static readonly BottomLeft: Spot;
    static readonly BottomCenter: Spot;
    static readonly BottomRight: Spot;
    /** A synonym for Spot.TopCenter. */
    static readonly MiddleTop: Spot;
    /** A synonym for Spot.LeftCenter. */
    static readonly MiddleLeft: Spot;
    /** A synonym for Spot.RightCenter. */
    static readonly MiddleRight: Spot;
    /** A synonym for Spot.BottomCenter. */
    static readonly MiddleBottom: Spot;
    /** A synonym for Spot.TopCenter. */
    static readonly Top: Spot;
    /** A synonym for Spot.LeftCenter. */
    static readonly Left: Spot;
    /** A synonym for Spot.RightCenter. */
    static readonly Right: Spot;
    /** A synonym for Spot.BottomCenter. */
    static readonly Bottom: Spot;
    static readonly TopSide: Spot;
    static readonly LeftSide: Spot;
    static readonly RightSide: Spot;
    static readonly BottomSide: Spot;
    static readonly TopBottomSides: Spot;
    static readonly LeftRightSides: Spot;
    static readonly TopLeftSides: Spot;
    static readonly TopRightSides: Spot;
    static readonly BottomLeftSides: Spot;
    static readonly BottomRightSides: Spot;
    static readonly NotTopSide: Spot;
    static readonly NotLeftSide: Spot;
    static readonly NotRightSide: Spot;
    static readonly NotBottomSide: Spot;
    static readonly AllSides: Spot;
}

/**
 * Margin - 边距（上右下左）（对齐官方 go.d.ts:2435 class Margin）
 *
 * 官方语义要点：
 * - 构造器：0 参全 0；1 参四边同值；2 参 top/bottom=第一参、right/left=第二参；3 参抛错；4 参 t,r,b,l
 * - set(m) 只接受 Margin；setTo(t,r,b,l) 四值
 * - equalsApprox 容差 0.5（官方 G.u）
 * - isReal() 是方法；toString 为调试格式 "Margin(t,r,b,l)"
 */
declare class Margin {
    private _top;
    private _right;
    private _bottom;
    private _left;
    constructor(t?: number, r?: number, b?: number, l?: number);
    get top(): number;
    set top(value: number);
    get right(): number;
    set right(value: number);
    get bottom(): number;
    set bottom(value: number);
    get left(): number;
    set left(value: number);
    /** Modify this Margin with new Top, Right, Bottom, and Left values. */
    setTo(t: number, r: number, b: number, l: number): this;
    /** Modify this Margin so that its values are the same as the given Margin. */
    set(m: Margin): this;
    /** Create a copy of this Margin, with the same values. */
    copy(): Margin;
    /** Indicates whether the given Margin is equal to this Margin. */
    equals(m: Margin): boolean;
    /** Indicates whether the given values are equal to this Margin. */
    equalTo(t: number, r: number, b: number, l: number): boolean;
    /** True when the given Margin is nearly equal to this Margin（容差 0.5，官方 G.u）。 */
    equalsApprox(m: Margin): boolean;
    /** True if this Margin has values that are real numbers and not infinity. */
    isReal(): boolean;
    /** 官方调试字符串："Margin(t,r,b,l)"；数据序列化请用 Margin.stringify。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /**
     * 读入由 Margin.stringify 产生的字符串（"t r b l"，部分缺失时按官方规则退化：
     * 1 值 → 四边同值；2 值 → t/b、r/l；3 值或更多 → 只取前两值）。
     */
    static parse(str: string): Margin;
    /** 写出可被 Margin.parse 读回的字符串："1 2 3 4"。 */
    static stringify(val: Margin): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Margin) => string;
    /** 冻结本对象。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /** 零边距常量（项目扩展，官方无 Margin.Zero）。 */
    static readonly Zero: Margin;
    /** 类型判断（项目扩展，内部 RowColumnDefinition 使用）。 */
    static isMargin(m: unknown): m is Margin;
}
/** MarginLike 类型 - 可以是 Margin 对象或数字 */
type MarginLike = Margin | number;

/**
 * Rect - 矩形（对齐官方 go.d.ts:2013 class Rect）
 *
 * 官方语义要点：
 * - 四种构造：()、(x,y,w,h)、(Point,Point)、(Point,Size)；宽高必须非负（NaN 允许）
 * - (Point,Point) 构造为两角包围盒（min/abs）
 * - offset/inflate/grow/union/intersect/addMargin/subtractMargin 均为**原地修改**
 * - isEmpty() 是方法且语义为 width===0 && height===0
 * - left/top setter 直接赋值；right/bottom setter 平移保持尺寸
 * - toString 为调试格式 "Rect(x,y,w,h)"
 */
declare class Rect {
    private _x;
    private _y;
    private _width;
    private _height;
    constructor(x?: number | Point, y?: number | Point | Size, w?: number, h?: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get left(): number;
    set left(value: number);
    get top(): number;
    set top(value: number);
    get right(): number;
    set right(value: number);
    get bottom(): number;
    set bottom(value: number);
    get position(): Point;
    set position(value: Point);
    get size(): Size;
    set size(value: Size);
    get center(): Point;
    /** 设置中心点只是平移 X/Y，不改尺寸。 */
    set center(value: Point);
    get centerX(): number;
    set centerX(value: number);
    get centerY(): number;
    set centerY(value: number);
    /** Modify this Rect with new X, Y, Width, and Height values. */
    setTo(x: number, y: number, w: number, h: number): this;
    /** Modify this Rect so that its X, Y, Width, and Height values are the same as the given Rect. */
    set(r: Rect): this;
    /** Modify this Rect so that its X and Y values are the same as the given Point. */
    setPoint(p: Point): this;
    /** Modify this Rect so that its Width and Height values are the same as the given Size. */
    setSize(s: Size): this;
    /** Create a copy of this Rect, with the same values. */
    copy(): Rect;
    /** Indicates whether the given Rect is equal to the current Rect. */
    equals(r: Rect): boolean;
    /** Indicates whether the given values are equal to this Rect. */
    equalTo(x: number, y: number, w: number, h: number): boolean;
    /** True when the given Rect is nearly equal to this Rect（容差 0.5，官方 G.u）。 */
    equalsApprox(r: Rect): boolean;
    /** True when the given values are nearly equal to this Rect（容差 0.5，官方未在 d.ts 记录）。 */
    equalsApproxTo(x: number, y: number, w: number, h: number): boolean;
    /** True when the given Rect is very nearly equal to this Rect（容差 5e-8，官方 G.H）。 */
    equalsApproxClose(r: Rect): boolean;
    /** Indicates whether this Rect contains the given Point（边界含）。 */
    containsPoint(p: Point): boolean;
    /** Indicates whether this Rect contains the given Rect（边界含）。 */
    containsRect(r: Rect): boolean;
    /** Indicates whether this Rect contains the given Point/Rect（w/h 默认 0）。 */
    contains(x: number, y: number, w?: number, h?: number): boolean;
    /** Modify this Rect by shifting its values with the given DX and DY offsets. */
    offset(dx: number, dy: number): this;
    /**
     * Modify this Rect so that its width and height are changed on all four sides.
     * 负值收缩，但不会小于零（保持中心）。
     */
    inflate(w: number, h: number): this;
    /** Modify this Rect by adding the given Margin to each side of the Rect. */
    addMargin(m: Margin): this;
    /** Modify this Rect by subtracting the given Margin from each side of the Rect. */
    subtractMargin(m: Margin): this;
    /** Modifies this Rect by adding some distance to each side of the Rect (上右下左)。 */
    grow(t: number, r: number, b: number, l: number): this;
    /** 官方内部 ux：按四边增量调整，收缩截断至 0 并保持中心。 */
    private _grow;
    /** Modify this Rect so that it is the intersection of this Rect and the given Rect. */
    intersectRect(r: Rect): this;
    /** Modify this Rect so that it is the intersection of this Rect and the rectangle defined by x, y, w, h. */
    intersect(x: number, y: number, w: number, h: number): this;
    private _intersect;
    /** Determine if a given Rect is partly or wholly inside of this Rect. */
    intersectsRect(r: Rect): boolean;
    /** Determine if this Rect partly or wholly overlaps the rectangle defined by x, y, w, h. */
    intersects(x: number, y: number, w: number, h: number): boolean;
    /** Modify this Rect to be exactly big enough to contain both the original Rect and the given Point. */
    unionPoint(p: Point): this;
    /** Modify this Rect to be exactly big enough to contain this Rect and the given Rect. */
    unionRect(r: Rect): this;
    /** Modify this Rect to be exactly big enough to contain the original Rect and the given rectangular area. */
    union(x: number, y: number, w?: number, h?: number): this;
    private _union;
    /** Modify this Rect so that a given Spot is at a given (x,y) point using this Rect's size. */
    setSpot(x: number, y: number, spot: Spot): this;
    /**
     * Return which side/direction of the Rect is closest to the given x,y point.
     * @returns 0 (right), 90 (bottom), 180 (left), or 270 (top)
     */
    nearestSideDirection(x: number, y: number): number;
    /** Return which side/direction of the Rect is closest to the given Point. */
    nearestSideDirectionPoint(p: Point): number;
    /** 官方内部 gx：i=true 时只返回 0/90/180/270 四个正方向。 */
    private static _nearestSideDirection;
    /** True if this Rect has X, Y, Width, and Height values that are real numbers and not infinity. */
    isReal(): boolean;
    /** True if this Rect has a Width and Height of zero. */
    isEmpty(): boolean;
    /** 官方调试字符串："Rect(x,y,w,h)"；数据序列化请用 Rect.stringify。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /** 读入由 Rect.stringify 产生的字符串。官方容错：缺项 → 0。 */
    static parse(str: string): Rect;
    /** 写出可被 Rect.parse 读回的字符串："1 2 3 4"。 */
    static stringify(val: Rect): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Rect) => string;
    /** This static function indicates whether a Rect contains the given Point/Rect. */
    static contains(rx: number, ry: number, rw: number, rh: number, x: number, y: number, w?: number, h?: number): boolean;
    /** This static function indicates whether a Rect partly or wholly overlaps the given Rect. */
    static intersects(rx: number, ry: number, rw: number, rh: number, x: number, y: number, w: number, h: number): boolean;
    /** True if a rectangular area is intersected by a finite straight line segment. */
    static intersectsLineSegment(x: number, y: number, w: number, h: number, p1x: number, p1y: number, p2x: number, p2y: number): boolean;
    /** 冻结本对象。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /** 零矩形常量（项目扩展）。 */
    static readonly Zero: Rect;
    /** 未测量占位常量（项目扩展）。 */
    static readonly NaN: Rect;
}

/**
 * Point - 二维点（对齐官方 go.d.ts:1548 class Point）
 *
 * 官方语义要点（参照 gojs@4.0.4 运行时）：
 * - add/subtract/offset/rotate/scale/normalize/set/setTo 均为**原地修改**并返回 this
 * - direction/directionPoint 返回**度数**（0-360）
 * - equalsApprox 容差为 |dx| < 0.5（官方内部 G.c）
 * - toString 为调试格式 "Point(x,y)"；数据格式用静态 stringify
 * - 构造器只接受 0 或 2 个数字参数，否则抛错
 */
declare class Point {
    private _x;
    private _y;
    constructor(x?: number, y?: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    /** Modify this Point with new X and Y values. */
    setTo(x: number, y: number): this;
    /** Modify this Point so that its X and Y values are the same as the given Point. */
    set(p: Point): this;
    /** Create a copy of this Point, with the same values. */
    copy(): Point;
    /** Indicates whether the given Point is equal to this Point. */
    equals(p: Point): boolean;
    /** Indicates whether the given point (x, y) is equal to this Point. */
    equalTo(x: number, y: number): boolean;
    /** True when the given Point is nearly equal to this Point（容差 0.5，官方 G.c）。 */
    equalsApprox(p: Point): boolean;
    /** Modify this point so that it is the sum of this Point and the given Point. */
    add(p: Point): this;
    /** Modify this point so that it is the difference of this Point and the given Point. */
    subtract(p: Point): this;
    /** Modify this point by shifting its values with the given DX and DY offsets. */
    offset(dx: number, dy: number): this;
    /** Modify this Point so that it has been rotated about the origin by the given angle (in degrees). */
    rotate(angle: number): this;
    /** Modify this Point so that its X and Y values have been scaled by given factors. */
    scale(sx: number, sy: number): this;
    /** Returns the square of the distance from this Point to a given Point. */
    distanceSquaredPoint(p: Point): number;
    /** Returns the square of the distance from this point to a given point (px, py). */
    distanceSquared(px: number, py: number): number;
    /** Modify this Point so that its X and Y values have been normalized to a unit length. */
    normalize(): this;
    /** Compute the angle (in degrees) from this Point to a given Point. */
    directionPoint(p: Point): number;
    /** Compute the angle (in degrees) from this Point to a given (px, py) point. */
    direction(px: number, py: number): number;
    /** 官方内部 rL：由差值算方向角（度，0-360）；同点为 0。 */
    private static _angle;
    /**
     * 官方内部 G.Du：点与有限线段的比较。
     * 线段上为 0；线段左侧为正、右侧为负；
     * 在无限延长线上但超出线段端点时，越过终点为正、起点之前为负。
     */
    private static _compareWithLineSegment;
    /** If the point is on the finite line segment this returns zero. */
    static compareWithLineSegment(a1x: number, a1y: number, a2x: number, a2y: number, px: number, py: number): number;
    /** Compare this point with a finite line segment given by two Points. */
    compareWithLineSegmentPoint(p: Point, q: Point): number;
    /** 官方内部 G.kr：两条有限线段是否相交。 */
    private static _intersectingLineSegments;
    /** True if two finite straight line segments intersect each other. */
    static intersectingLineSegments(a1x: number, a1y: number, a2x: number, a2y: number, b1x: number, b1y: number, b2x: number, b2y: number): boolean;
    /**
     * 官方内部 G.Il：把本点改为线段上（或端点）离本点最近的点。
     * 返回 this（官方丢弃"是否落在线段内"的布尔结果）。
     */
    projectOntoLineSegment(px: number, py: number, qx: number, qy: number): this;
    /** Modify this point to be the closest point to this point that is on a finite line segment. */
    projectOntoLineSegmentPoint(p: Point, q: Point): this;
    /**
     * 官方内部 G.gm：吸附到无限网格。
     * @param cellwidth 必须大于 0
     * @param cellheight 必须大于 0
     */
    snapToGrid(originX: number, originY: number, cellwidth: number, cellheight: number): this;
    /** Modify this point to be at the nearest point on an infinite grid. */
    snapToGridPoint(origin: Point, cellsize: Size): this;
    /** Modify this Point so that its X and Y values correspond to a particular Spot in a given Rect. */
    setRectSpot(r: Rect, spot: Spot): this;
    /** Modify this Point so that its X and Y values correspond to a particular Spot in a given rectangle. */
    setSpot(x: number, y: number, w: number, h: number, spot: Spot): this;
    /** Returns the square of the distance from the point P to the finite line segment from A to B. */
    static distanceLineSegmentSquared(px: number, py: number, ax: number, ay: number, bx: number, by: number): number;
    /** Returns the square of the distance from the point P to the point Q. */
    static distanceSquared(px: number, py: number, qx: number, qy: number): number;
    /** Returns the angle in degrees of the line from point P to point Q. */
    static direction(px: number, py: number, qx: number, qy: number): number;
    /** True if this Point has X and Y values that are real numbers and not infinity. */
    isReal(): boolean;
    /** 官方调试字符串："Point(1,2)"；数据序列化请用 Point.stringify。 */
    toString(): string;
    /** 官方用于调试消息的类名（未在 d.ts 记录，但运行时存在）。 */
    static readonly className: string;
    /** 读入由 Point.stringify 产生的字符串。官方容错：空串 → (0,0)，缺 y → 0。 */
    static parse(str: string): Point;
    /** 写出可被 Point.parse 读回的字符串："1 2"。 */
    static stringify(val: Point): string;
    /** 返回给 Binding 用的反向转换函数，按固定小数位输出。 */
    static stringifyFixed(digits: number): (val: Point) => string;
    /** 冻结本对象（官方通过内部 Object.freeze 实现同义能力）。 */
    freeze(): this;
    /** 是否已被冻结为只读。 */
    get isReadOnly(): boolean;
    /** 线性插值（项目扩展）。 */
    static lerp(p1: Point, p2: Point, t: number): Point;
    /** 原点常量（项目扩展）。 */
    static readonly Zero: Point;
}

/**
 * PathSegment - 路径段
 */
declare class PathSegment {
    static readonly className: string;
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
    /**
     * 官方「按角度」圆弧参数（`PathSegment(SegmentType.Arc, startAngle, sweepAngle, centerX, centerY, radiusX, radiusY)`）。
     * 官方对 Arc 段复用同一批存储：endX→startAngle、endY→sweepAngle、
     * point1X→centerX、point1Y→centerY、point2X→radiusX、point2Y→radiusY。
     * startAngle 为 NaN 表示不是这种用法（此时 endX/endY 仍是 SVG 弧的终点）。
     */
    startAngle: number;
    sweepAngle: number;
    centerX: number;
    centerY: number;
    /** 「按角度」圆弧的几何终点（由 center/radius/startAngle+sweepAngle 推出）。
     *  官方没有这个字段：它保留 endX/endY 为角度值，需要终点的场合（如 Close 段）用 Eo 采样结果。 */
    arcEndX: number;
    arcEndY: number;
    /** 是否为相对坐标 */
    isRelative: boolean;
    constructor(type?: EnumValue, endX?: number, endY?: number, x1?: number, y1?: number, x2?: number, y2?: number);
    /** 官方命名：第一个控制点 X（内部存储字段为 x1） */
    get point1X(): number;
    set point1X(val: number);
    /** 官方命名：第一个控制点 Y（内部存储字段为 y1） */
    get point1Y(): number;
    set point1Y(val: number);
    /** 官方命名：第二个控制点 X（内部存储字段为 x2） */
    get point2X(): number;
    set point2X(val: number);
    /** 官方命名：第二个控制点 Y（内部存储字段为 y2） */
    get point2Y(): number;
    set point2Y(val: number);
    copy(): PathSegment;
    equals(seg: PathSegment): boolean;
    /** 创建直线段 */
    static Line(endX: number, endY: number): PathSegment;
    /** 创建二次贝塞尔曲线段 */
    static QuadraticBezier(endX: number, endY: number, x1: number, y1: number): PathSegment;
    /** 创建三次贝塞尔曲线段 */
    static CubicBezier(endX: number, endY: number, x1: number, y1: number, x2: number, y2: number): PathSegment;
    /**
     * 官方 4.0 的「按角度」圆弧段：`PathFigure` 里就是这种单条 Arc 表示整圆/圆弧
     * （例如箭头 Circle = 一条 Arc: center(4,4) r(4,4) startAngle 0 sweepAngle 360，
     * 包围盒 [0,0,8,8]），不是用三次贝塞尔去近似。
     */
    static AngleArc(centerX: number, centerY: number, radiusX: number, radiusY: number, startAngle: number, sweepAngle: number): PathSegment;
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
    static readonly className: string;
    /** 起点 X */
    startX: number;
    /** 起点 Y */
    startY: number;
    /** 是否闭合 */
    isFilled: boolean;
    /** 是否描边 */
    isShadowed: boolean;
    /** 官方 PathFigure.isEvenOdd：偶奇填充规则 */
    isEvenOdd: boolean;
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

/**
 * Brush - 画刷
 * 支持 Solid（纯色）、Linear（线性渐变）、Radial（径向渐变）
 */
declare class Brush {
    static readonly className: string;
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
    /** 官方 `Brush(type?, colorStops?)`：colorStops 对象中数字键为色标，其余键直接赋值（如 start/end） */
    constructor(type?: EnumValue | string, colorStops?: Record<string, any>);
    /** 获取色标列表 */
    get stops(): BrushStop[];
    /** 添加色标（官方：Solid 上加色标会自动转为 Linear） */
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
    /** 官方 U.wm：crypto.getRandomValues 单位浮点 */
    private static _wm;
    /** 官方 Brush.randomColor(min=128, max=max(min,255))：'#rrggbb'，经 crypto 随机 */
    static randomColor(min?: number, max?: number): string;
    static darken(color: string, fraction?: number, space?: number): string;
    static darkenBy(color: string, fraction: number, space?: number): string;
    static lighten(color: string, fraction?: number, space?: number): string;
    static lightenBy(color: string, fraction: number, space?: number): string;
    /** 官方 sRGB gamma 解码（sRGB → 线性） */
    private static _yN;
    /** 官方 sRGB gamma 编码（线性 → sRGB） */
    private static _wN;
    /**
     * 官方 Brush.Wd/Ho：解析颜色 → 按颜色空间调整明度（space=3 官方默认 OKLCh）→
     * 返回官方格式 "rgba(r, g, b, a)"。仅实现官方默认的 OKLCh（+未用到的 HSL/Lab 不实现，
     * space 非 3 时原样返回）。
     */
    private static _wd;
    static isDark(color: string): boolean;
    private _startRadius;
    private _endRadius;
    private _pattern;
    /** 官方 Brush.startRadius（Radial 起始半径） */
    get startRadius(): number;
    set startRadius(value: number);
    /** 官方 Brush.endRadius（Radial 结束半径） */
    get endRadius(): number;
    set endRadius(value: number);
    /** 官方 Brush.pattern（BrushType.Pattern 使用的位图） */
    get pattern(): HTMLCanvasElement | HTMLImageElement | null;
    set pattern(value: HTMLCanvasElement | HTMLImageElement | null);
    /**
     * 官方 Brush.colorStops：offset → color 的 Map 视图（本项目内部用 BrushStop[] 存储）。
     * 无色标时与官方一样返回 null。
     */
    get colorStops(): Map<number, string> | null;
    set colorStops(value: Map<number, string> | null);
    /** 官方 Brush.toString */
    toString(): string;
    /** 官方 Brush.lightenBy（实例版，就地变亮） */
    lightenBy(fraction?: number, mode?: EnumValue): this;
    /** 官方 Brush.darkenBy（实例版，就地变暗） */
    darkenBy(fraction?: number, mode?: EnumValue): this;
    /** 官方 Brush.isDark（实例版） */
    isDark(): boolean;
    /** 官方 Brush.isValidColor */
    static isValidColor(color: string): boolean;
    /** 官方 Brush.mix：把两个颜色按 fraction 混合 */
    static mix(color1: string, color2: string, fraction?: number): string;
    /** @deprecated 用 ColorSpace.HSL */
    static readonly HSL: EnumValue;
    /** @deprecated 用 BrushType.Pattern */
    static readonly Pattern: EnumValue;
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
    static readonly className: string;
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
    /** 产生此事件的 Diagram（官方 ChangedEvent.diagram） */
    diagram: any;
    /** 额外参数 */
    parameter: any;
    /** 旧的附加参数（官方 ChangedEvent.oldParam） */
    oldParam: any;
    /** 新的附加参数（官方 ChangedEvent.newParam） */
    newParam: any;
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
    /** 官方 ChangedEvent.modelChange：模型数据级变更名（'nodeDataArray' / 'linkDataArray' / 'modelData.x'…） */
    modelChange: string;
    /** @deprecated 官方静态别名，等价于 ChangeType.Transaction */
    static readonly Transaction: EnumValue;
    /** @deprecated 官方静态别名，等价于 ChangeType.Property */
    static readonly Property: EnumValue;
    /** @deprecated 官方静态别名，等价于 ChangeType.Insert */
    static readonly Insert: EnumValue;
    /** @deprecated 官方静态别名，等价于 ChangeType.Remove */
    static readonly Remove: EnumValue;
    /** 官方 ChangedEvent.getValue：undo 取旧值，否则取新值 */
    getValue(undo: boolean): any;
    /** 官方 ChangedEvent.getParam：undo 取旧参数，否则取新参数 */
    getParam(undo: boolean): any;
    /** 官方 ChangedEvent.canUndo */
    canUndo(): boolean;
    /** 官方 ChangedEvent.undo：把对象状态倒回旧值 */
    undo(): void;
    /** 官方 ChangedEvent.canRedo */
    canRedo(): boolean;
    /** 官方 ChangedEvent.redo：把对象状态推进到新值 */
    redo(): void;
}

/**
 * Transaction - 事务
 * 组合多个 ChangedEvent，支持嵌套
 */
declare class Transaction {
    static readonly className: string;
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
    /** 官方 Transaction.canUndo：事务完整才可撤销 */
    canUndo(): boolean;
    /** 官方.Transaction.undo：倒序回放所有变更 */
    undo(): void;
    /** 官方 Transaction.canRedo */
    canRedo(): boolean;
    /** 官方 Transaction.redo：正序重放所有变更 */
    redo(): void;
    /** 官方 Transaction.thaw：本项目的 changes 是普通数组，无冻结语义，保持空实现 */
    thaw(): void;
    /**
     * 官方 Transaction.optimize：把同一对象同一属性的连续 Property 变更合并成最后一条。
     * 官方实现先把被合并项置为 null 再压紧数组；这里等价地重建数组，避免数组里出现 null。
     */
    optimize(): void;
    /** 官方 Transaction.WI：把另一份变更列表追加到本事务尾部 */
    addAllChanges(changes: ChangedEvent[]): void;
}

/**
 * UndoManager - 撤销管理器
 */
declare class UndoManager {
    static readonly className: string;
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
    private _hasStartedFirstTransaction;
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
    private _models;
    private _nestedTransactionNames;
    private _checksTransactionLevel;
    private _isJustDiscarded;
    /** 官方 UndoManager.models：所有关联模型的迭代器 */
    get models(): Iterator<any>;
    /** 官方 UndoManager.addModel */
    addModel(model: any): void;
    /** 官方 UndoManager.removeModel */
    removeModel(model: any): void;
    /**
     * 官方 UndoManager.history：已提交事务的历史。
     * 官方是一条 List（historyIndex 指向最近一次可撤销的事务）；
     * 本项目内部是 undo/redo 两个栈，这里按官方语义拼出等价快照：
     * 顺序 = 撤销栈正序 + 重做栈逆序。
     */
    get history(): List<Transaction>;
    /** 官方 UndoManager.historyIndex：最近一条可撤销事务在 history 中的下标 */
    get historyIndex(): number;
    /** 官方 UndoManager.maxHistoryLength（本项目默认 0 表示不限长度，官方默认 999） */
    get maxHistoryLength(): number;
    set maxHistoryLength(value: number);
    /** 官方 UndoManager.nestedTransactionNames */
    get nestedTransactionNames(): List<string>;
    /** 官方 UndoManager.checksTransactionLevel */
    get checksTransactionLevel(): boolean;
    set checksTransactionLevel(value: boolean);
    /** 官方 UndoManager.isUndoingRedoing：撤销/重放过程中为 true */
    get isUndoingRedoing(): boolean;
    /** 官方 UndoManager.isJustDiscarded */
    get isJustDiscarded(): boolean;
    /** 官方 UndoManager.discardHistoryAfterIndex：丢掉 historyIndex 之后（可重做）的事务 */
    discardHistoryAfterIndex(): void;
    /**
     * 官方 UndoManager.combineTransactions：把紧跟在 target 之后的那条事务
     * 的全部变更并入 target，并从历史里删掉它。不传 target 时合并最后两条。
     */
    combineTransactions(target?: Transaction): void;
    /** 官方 UndoManager.copyProperties：只拷贝三个可配置属性 */
    copyProperties(other: UndoManager): void;
    /** 官方 UndoManager.thaw：本项目历史是普通数组，无冻结语义，保持空实现 */
    thaw(): void;
    /** 官方 UndoManager.skipsEvent：临时层对象与事务事件本身不进历史 */
    skipsEvent(e: ChangedEvent | null): boolean;
    /** 官方 UndoManager.toString */
    toString(level?: number): string;
}

declare class Binding {
    static readonly className: string;
    static OneWay: EnumValue;
    static TwoWay: EnumValue;
    targetProperty: string;
    sourceProperty: string;
    conversion: ((value: any, targetObject: any, model: any) => any) | null;
    backConversion: ((value: any, sourceData: any, model: any) => any) | null;
    mode: EnumValue;
    sourceObject: string | null;
    name: string;
    /** 官方 ThemeBinding.themeConverter：findValue 之后的转换 */
    themeConverter: ((value: any, targetObject: any, model?: any) => any) | null;
    /** 官方 ThemeBinding.themeSource：findValue 的 theme 子路径（'colors' / 'levels' ...） */
    themeSource: string | null;
    /** 官方 theme()/themeObject()/themeData()/themeModel() 建立的主题绑定（flags&16） */
    isThemeBinding: boolean;
    constructor(targetProperty?: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any);
    get isTwoWay(): boolean;
    get isFromModel(): boolean;
    get isToData(): boolean;
    makeTwoWay(backConversion?: (value: any, sourceData: any, model: any) => any): Binding;
    ofModel(): Binding;
    ofObject(name?: string): Binding;
    copy(): Binding;
    getValueFromSource(data: any, targetObject: any, model: any): any;
    /**
     * 官方 ThemeBinding 求值（GraphObject.qo - Binding.updateTarget - ThemeBinding.pv）：
     *  - theme()（sourceObject === 'theme'，官方 PT 标志）：key 直接用 sourceProperty，
     *    findValue 后接 themeConverter；
     *  - themeObject()/themeData()/themeModel()：先按 source 求源值，源值 undefined 整段跳过，
     *    再跑 converter 得到主题 key，findValue 后接 themeConverter。
     */
    private _getThemeValue;
    /**
     * 官方 GraphObject.CD(sourceName) + freezeBindings(Ut) 语义：
     * 官方在模板冻结时把所有子对象的绑定收集进 part.Xs，求值时 RN/DD 的 `this`=part，
     * 因此 sourceName='' → DD('')=this=**part**（实测官方 updateTarget 收到的源对象是 Node）。
     * 官方 RN 末尾的覆盖：'/'→elt.part、'.'→elt、'..'→elt.panel；
     * 本实现中绑定就挂在 elt（owner）上，故 ''/'/' 取 part、'.' 取自身、'..' 取所在面板。
     * 具名对象从 part.findObject(name) 找。
     */
    private _findSourceObject;
    getValueFromTarget(targetValue: any, data: any, model: any): any;
    toString(): string;
    private _targetId;
    /** 官方 Binding.targetId：绑定目标在同名对象中的序号 */
    get targetId(): number;
    set targetId(value: number);
    /** 官方 Binding.sourceName（本项目内部字段叫 sourceObject） */
    get sourceName(): string | null;
    set sourceName(value: string | null);
    /** 官方 Binding.converter（本项目内部字段叫 conversion） */
    get converter(): ((value: any, targetObject: any, model?: any) => any) | null;
    set converter(value: ((value: any, targetObject: any, model?: any) => any) | null);
    /** 官方 Binding.backConverter（本项目内部字段叫 backConversion） */
    get backConverter(): ((value: any, sourceData: any, model?: any) => any) | null;
    set backConverter(value: ((value: any, sourceData: any, model?: any) => any) | null);
    /** 官方 Binding.isToModel：源是 Model.modelData */
    get isToModel(): boolean;
    /** 官方 Binding.isToObject：源是某个 GraphObject（theme 绑定不算） */
    get isToObject(): boolean;
    /** 官方 Binding.isToTheme：theme/themeObject/themeData/themeModel 的主题绑定（flags&16） */
    get isToTheme(): boolean;
    /** 官方 Binding.cloneProtected */
    cloneProtected(copy: Binding): void;
    /**
     * 官方 Binding.check：绑定建立前的静态校验。
     * 官方只在 Debug 下向控制台告警，这里保持无副作用（不产生任何输出）。
     */
    check(target: any): void;
    /**
     * 官方 Binding.updateTarget：把源数据写到目标对象上。
     * 官方签名 updateTarget(target, srcData, srcPropName, themeContext)，
     * 第 4 参在官方是 ThemeManager，本项目用作"设置目标属性的写入器"。
     */
    updateTarget(target: any, srcData: any, srcPropName?: string, targetSetter?: any): void;
    /**
     * 官方 Binding.updateSource：TwoWay 绑定时把目标属性写回数据。
     * 第 4 参在官方是目标 Part/Panel，本项目用作"承载数据的对象"。
     */
    updateSource(target: any, srcData: any, srcPropName?: string, targetContext?: any): void;
    private static _setTargetProperty;
    private static _setSourceProperty;
    /** 官方 Binding.parseEnum：把字符串解析成 ctor 上定义的枚举值 */
    static parseEnum(ctor: any, defval: any): (name: string) => any;
    /** 官方 Binding.toString：把任意值转成可读字符串 */
    static toString(val?: any): string;
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
 * IncrementalData - 官方 Model.toIncrementalData 的输出结构
 * 所有属性都是可选的，仅在发生了相应变更时出现
 */
interface IncrementalData {
    modelData?: ObjectData;
    insertedNodeKeys?: any[];
    modifiedNodeData?: ObjectData[];
    removedNodeKeys?: any[];
    insertedLinkKeys?: any[];
    modifiedLinkData?: ObjectData[];
    removedLinkKeys?: any[];
}
/**
 * Model - 基础模型
 * 管理 nodeDataArray，支持数据绑定、事务和撤销/重做
 */
declare class Model {
    static readonly className: string;
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
    findNodeDataForKey(key: any): ObjectData | null;
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
    commit(func: (owner?: any) => any, tname?: string): any;
    addChangedListener(listener: ChangedEventListener): void;
    removeChangedListener(listener: ChangedEventListener): void;
    raiseChangedEvent(change: any, object: any, propertyName: string, oldValue: any, newValue: any, index?: number): ChangedEvent;
    raiseTransactionEvent(propertyName: string, tname: string, transObj?: any): ChangedEvent;
    /** 更新目标绑定 */
    updateTargetBindings(propname?: string): void;
    /** 序列化为 JSON */
    toJson(_classname?: string): string;
    /**
     * `toJson()` 写出的 `class` 名 → `{ ctor, apply }` 的注册表。
     * 官方靠内部注册表解析；这里由各子类在模块求值时自注册，
     * 避免在 `Model.ts` 里 `require('./GraphLinksModel')` —— 那是 CommonJS
     * 调用，在浏览器 bundle 里会抛 `require is not defined`，
     * 导致所有走 `Model.fromJson()` 的样例直接崩（实测 13 个）。
     */
    private static readonly _ctors;
    /**
     * 由子类模块在顶层调用：
     *   `Model.registerClass('TreeModel', TreeModel, (m, d) => { ... })`
     * `apply` 只负责该子类**自己**的额外字段；公共字段由 `fromJson` 统一处理。
     */
    static registerClass(name: string, ctor: new () => Model, apply?: (m: Model, data: any) => void): void;
    /**
     * 解析 `class` 字段 → 构造器 + `apply`。
     * 对齐官方 `Model.I3()`（`node_modules/gojs/release/go.js`）：
     *  - `go.Xxx` → 只查内部注册表（去掉 `go.` 前缀）
     *  - `Xxx`    → 先查内部注册表，查不到再查全局 `globalThis.Xxx`
     *  - 只有"可构造的函数"才会被采用，否则返回 null
     */
    private static _resolveClass;
    /**
     * 从 JSON 反序列化。
     * 语义对齐官方 `Model.fromJson(t, e)`（见 `node_modules/gojs/release/go.js`）：
     *  - 字符串 → `JSON.parse`，**解析失败静默降级为 null**（官方用 try/catch 吞掉）
     *  - 非字符串非对象 → 抛 `Unable to construct a Model from: <t>`
     *  - `class` 未注册 → 回落到普通 `Model`（官方 `I3()` 返回 null 后走 `Mv()`）
     */
    static fromJson(json: string | object, target?: Model): Model;
    static fromJSON(json: string | object): Model;
    private _afterCopyFunction;
    get afterCopyFunction(): ((map: Map$1<any, any>, destModel: Model, srcModel: Model) => void) | null;
    set afterCopyFunction(value: ((map: Map$1<any, any>, destModel: Model, srcModel: Model) => void) | null);
    /** 官方 Model.type：序列化时使用的类名 */
    get type(): string;
    /** 官方 Model.toString(level)：level>1 返回 JSON，level>0 附带节点数据摘要 */
    toString(level?: number): string;
    /** 官方 Model.isKeyType：只有 number/string 才能作为 key */
    isKeyType(key: any): boolean;
    /** 官方 Model.raiseChanged：object 恒为 Model 自身 */
    raiseChanged(propertyName: string, oldValue: any, newValue: any, oldParam?: any, newParam?: any): void;
    /** 官方 Model.raiseDataChanged：object 为发生变更的那份数据对象 */
    raiseDataChanged(data: ObjectData, propertyname: string, oldval: any, newval: any, oldparam?: any, newparam?: any): void;
    /** 官方 Model.changeState：由 UndoManager 正放/倒放一条变更 */
    changeState(e: ChangedEvent, undo: boolean): void;
    /** 官方 Model.makeNodeDataKeyUnique */
    makeNodeDataKeyUnique(nodedata: ObjectData): void;
    /** 官方 Model.mergeNodeDataArray：按 key 合并一份数据进来 */
    mergeNodeDataArray(arr: ObjectData[]): void;
    /** 官方 Model.assignAllDataProperties */
    assignAllDataProperties(data: ObjectData, props: ObjectData): void;
    /** 官方 Model.quote：把 charCode >= 127 的字符转成 \\uXXXX */
    quote(val: any): string;
    /** 官方 Model.toJSON */
    toJSON(classname?: string): string;
    /** 官方 Model.toIncrementalData */
    toIncrementalData(e: ChangedEvent): IncrementalData | null;
    /** 官方 Model.toIncrementalJson */
    toIncrementalJson(e: ChangedEvent, classname?: string): string;
    /** 官方 Model.toIncrementalJSON */
    toIncrementalJSON(e: ChangedEvent, classname?: string): string;
    /** 官方 Model.applyIncrementalJson */
    applyIncrementalJson(s: string | ObjectData): void;
    /** 官方 Model.applyIncrementalJSON */
    applyIncrementalJSON(s: string | ObjectData): void;
    /** 官方 Model.replaceJsonObjects：就地把 JSON 里的 {class:"go.*"} 换回真实对象 */
    replaceJsonObjects(t: any): any;
    /** 官方 Model.replaceJsonPropertyValue：points 数字数组 -> List of Point */
    replaceJsonPropertyValue(x: ObjectData, p: string, replaced: any): void;
    /** 官方 Model.writeJsonValue */
    writeJsonValue(t: any): string;
    /** 官方 Model.writeJsonPropertyValue */
    writeJsonPropertyValue(p: string, v: any): string;
    /** 官方 cloneProtected 需要一并复制的分类属性 */
    protected copyCategory(from: ObjectData, to: ObjectData): void;
    private static _stringify;
    private static _escapeNonAscii;
    private static _skipProperty;
    private static _isPlainObject;
    /** 官方 Model.FA：数据里不该出现的 Diagram/Part 引用 */
    private _isDiagramReference;
    private _raiseModelEvent;
    private _attachNodeData;
    private _detachNodeData;
    private _sharedPartData;
    /** 官方 Model.MR：找出引用了 target 的那些节点数据 */
    private _referencedNodeData;
    private _findReference;
    private _collectIncremental;
    /** 官方 Model.vg：模型自身属性的 JSON 片段 */
    private _modelPropsJson;
    private _modelDataJson;
    private _writeArray;
    private _writeNumber;
    private _roundPoints;
    private _parseNumber;
    /** 官方 Model.NR：把一个对象写成 JSON 文本（几何类序列化成 {class:"go.*"}） */
    private _writeJsonObject;
    /** 官方 Model.K4：把 {class:"go.*"} 还原成真实对象 */
    private _restoreJsonValue;
    /** 官方 Model.Nw：应用增量 JSON 的数据部分 */
    private _applyIncremental;
    private _applyModelData;
    /** 重建 key 映射 */
    private _rebuildKeyMap;
    /** 清空 */
    clear(): void;
    /** 复制模型 */
    copy(): Model;
    /** 模板方法：复制属性到新模型 */
    cloneProtected(copy: Model): void;
    /**
     * 官方 `Model.set` 有两个签名（go.d.ts）：
     * - `set(props: Partial<Model>): this` —— 批量设置模型自身属性；
     * - `set(data: ObjectData, propname: string, val: any): void` —— 给某个**数据对象**
     *   赋属性并 raise changed event（`Model.setDataProperty` 的同义词）。
     * 以前只实现了第一个签名，于是样例里 `model.set(node.data, 'start', 7)` 被当成
     * 「用 node.data 批量设模型属性」，静默什么都不做
     * （实测 gantt：`assignTimes` 永远填不上 start/duration，任务条 x 全是 NaN）。
     */
    set(props: Partial<Model>): this;
    set(data: any, propname: string, val: any): void;
}

/**
 * GraphLinksModel - 图连接模型
 * 额外管理 linkDataArray，支持任意拓扑
 */
declare class GraphLinksModel extends Model {
    static readonly className: string;
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
    /**
     * 官方 `GraphLinksModel` 行为：link data 引用的节点 key 若不在 nodeDataArray 中，
     * 且设置了 archetypeNodeData，则复制 archetype 生成该 key 的节点数据并加入 nodeDataArray。
     */
    private _ensureArchetypeNodesForLinkData;
    /** 添加链接数据 */
    addLinkData(data: ObjectData): void;
    /** 移除链接数据 */
    removeLinkData(data: ObjectData): boolean;
    /** 是否包含链接数据 */
    containsLinkData(data: ObjectData): boolean;
    /** 根据 key 查找链接数据（官方 findLinkDataForKey 返回 null） */
    findLinkDataForKey(key: any): ObjectData | null;
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
    static readonly EmptyArray: readonly any[];
    private _archetypeNodeData;
    /** 官方 GraphLinksModel.archetypeNodeData */
    get archetypeNodeData(): ObjectData | null;
    set archetypeNodeData(value: ObjectData | null);
    get type(): string;
    /** 官方 GraphLinksModel.getKeyForLinkData */
    getKeyForLinkData(data: ObjectData): any;
    /** 官方 GraphLinksModel.setKeyForLinkData */
    setKeyForLinkData(data: ObjectData, key: any): void;
    /** 官方 GraphLinksModel.makeLinkDataKeyUnique */
    makeLinkDataKeyUnique(data: ObjectData): void;
    /** 官方 GraphLinksModel.addLabelKeyForLinkData */
    addLabelKeyForLinkData(linkdata: ObjectData, key: any): void;
    /** 官方 GraphLinksModel.removeLabelKeyForLinkData */
    removeLabelKeyForLinkData(linkdata: ObjectData, key: any): void;
    /** 官方 GraphLinksModel.addLinkDataCollection */
    addLinkDataCollection(coll: ObjectData[] | List<ObjectData>): void;
    /** 官方 GraphLinksModel.removeLinkDataCollection */
    removeLinkDataCollection(coll: ObjectData[] | List<ObjectData>): void;
    /** 官方 GraphLinksModel.mergeLinkDataArray */
    mergeLinkDataArray(arr: ObjectData[]): void;
    /** 官方 GraphLinksModel.copyLinkData */
    copyLinkData(data: ObjectData): ObjectData;
    /** 官方 GraphLinksModel.isGroupForData */
    isGroupForData(data: ObjectData): boolean;
    /** 官方 GraphLinksModel.getGroupForData */
    getGroupForData(data: ObjectData): any;
    /** 官方 GraphLinksModel.setGroupForData */
    setGroupForData(data: ObjectData, groupKey: any): void;
    /** 官方 GraphLinksModel.getLinkCategoryForData */
    getLinkCategoryForData(data: ObjectData): string;
    /** 官方 GraphLinksModel.setLinkCategoryForData */
    setLinkCategoryForData(data: ObjectData, cat: string): void;
    protected copyCategory(from: ObjectData, to: ObjectData): void;
    /** 官方 GraphLinksModel.zR：合并/复制链接数据时搬运各类属性 */
    private _copyLinkDataProperties;
    toJson(_classname?: string): string;
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
    static readonly className: string;
    nodeParentKeyProperty: string;
    constructor();
    constructor(init: Partial<TreeModel> | ObjectData[]);
    /** 获取节点的父节点 key */
    getParentKeyForNodeData(data: ObjectData): any;
    /** 设置节点的父节点 key */
    setParentKeyForNodeData(data: ObjectData, key: any): void;
    private _parentLinkCategoryProperty;
    /** 官方 TreeModel.parentLinkCategoryProperty */
    get parentLinkCategoryProperty(): string;
    set parentLinkCategoryProperty(value: string);
    /** 官方 TreeModel.linkCategoryProperty（TreeModel 里是 parentLinkCategoryProperty 的别名） */
    get linkCategoryProperty(): string;
    set linkCategoryProperty(value: string);
    get type(): string;
    /** 官方 TreeModel.maybeEnsureLinkReference */
    maybeEnsureLinkReference(key: any): any;
    /** 官方 TreeModel.getParentLinkCategoryForNodeData */
    getParentLinkCategoryForNodeData(data: ObjectData): string;
    /** 官方 TreeModel.getLinkCategoryForData */
    getLinkCategoryForData(data: ObjectData): string;
    /** 官方 TreeModel.setParentLinkCategoryForNodeData */
    setParentLinkCategoryForNodeData(data: ObjectData, cat: string): void;
    /** 官方 TreeModel.setLinkCategoryForData */
    setLinkCategoryForData(data: ObjectData, cat: string): void;
    toString(level?: number): string;
    private static _stringifyData;
    toJson(_classname?: string): string;
    static fromJson(json: string | object): TreeModel;
    copy(): TreeModel;
    cloneProtected(copy: Model): void;
}

/**
 * Panel - container that arranges child GraphObjects according to its type.
 */
declare class Panel extends GraphObject {
    static readonly className: string;
    _elements: GraphObject[];
    _rowDefinitions: RowColumnDefinition[];
    _columnDefinitions: RowColumnDefinition[];
    protected _type: EnumValue;
    private _data;
    private _padding;
    private _defaultAlignment;
    private _defaultStretch;
    private _originX;
    private _originY;
    private _unionRect;
    /** 官方 `PanelLayoutLink.or`：measure 算出的 route-local 并集帧（子元素 z 都相对它） */
    private _linkOrRect;
    /** 官方 `PanelLayoutLink.qf`：measure 时按固定顺序存下的子元素 z 矩形，arrange 按序消费 */
    private _linkQfRects;
    private _defaultColumnSeparatorStroke;
    private _defaultColumnSeparatorStrokeWidth;
    private _defaultRowSeparatorStroke;
    private _defaultRowSeparatorStrokeWidth;
    private _defaultColumnSeparatorDashArray;
    private _defaultRowSeparatorDashArray;
    private _isOpposite;
    /** 官方 `Panel` 构造第一个参数可以是 `PanelLayout` 实例（自定义面板布局） */
    private _panelLayout;
    private _panelLayoutState;
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
    /** 官方 GridPanelSettings.Cf：lcm(间隔) × gridCellSize，供 Diagram.eC 定位 */
    _gridCf: Size | null;
    /** 官方 GridPanelSettings.Yp：每个元素的同向更大 interval 排除表（pS 判定用） */
    _gridExclusions: number[][] | null;
    private _graduatedMin;
    private _graduatedMax;
    private _graduatedTickUnit;
    private _graduatedTickBase;
    private _viewboxStretch;
    _viewboxScaleX: number;
    _viewboxScaleY: number;
    constructor(type?: EnumValue | string | object | null, init?: Partial<Panel>);
    /** 官方各子类构造参数解析：string/EnumValue → type；其它对象 → init */
    protected static _resolveArgs(type: any, init: any): [any, any];
    private static _resolvePanelTypeStr;
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
    get itemTemplateMap(): Map$1<string, Panel>;
    set itemTemplateMap(val: Map$1<string, Panel>);
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
    /**
     * 官方 PanelLayoutGrid.u3/d3：
     * - u3：按垂直/水平方向求 interval 的 lcm → Cf = Size(lcmV·cellW, lcmH·cellH)
     * - d3：每个元素收集同向且 interval 更大的元素 → Yp（画线时被更大线覆盖的小间隔线跳过）
     */
    _updateGridSettings(): void;
    /** 官方 PanelLayoutGrid.MN：LineV/BarV 为垂直方向（影响宽度周期） */
    static _isVerticalGridFigure(figure: string): boolean;
    /** 官方 G.CT：最大公约数（含小数 interval 的欧几里得算法） */
    static _gridGCD(a: number, b: number): number;
    get graduatedMin(): number;
    set graduatedMin(val: number);
    get graduatedMax(): number;
    set graduatedMax(val: number);
    get graduatedTickUnit(): number;
    set graduatedTickUnit(val: number);
    get graduatedTickBase(): number;
    set graduatedTickBase(val: number);
    get viewboxStretch(): EnumValue;
    set viewboxStretch(val: EnumValue);
    get elements(): Iterator<GraphObject>;
    get elementCount(): number;
    add(...elements: GraphObject[]): Panel;
    /** Propagate the _part reference to a child element and its descendants */
    private _propagatePart;
    /** Recursively set _part on an element and its children */
    private _setPartRecursive;
    remove(element: GraphObject): Panel;
    removeAt(index: number): Panel;
    insertAt(index: number, element: GraphObject): Panel;
    elt(index: number): GraphObject;
    findObject(name: string): GraphObject | null;
    /** 官方 findMainElement：第一个 isPanelMain，否则 elements[0]，空则 null */
    findMainElement(): GraphObject | null;
    /** 官方 `Panel.addRowColumnDefinition(rowOrColumnDef)`：把 def 的设置合并进同序号的行/列定义，返回 this */
    addRowColumnDefinition(def: RowColumnDefinition): this;
    /** 官方 `Panel.copyTemplate(freeze?)`：复制整棵视觉树作为模板，可选冻结其中的绑定 */
    copyTemplate(freeze?: boolean): this;
    get defaultColumnSeparatorDashArray(): number[] | null;
    set defaultColumnSeparatorDashArray(value: number[] | null);
    get defaultRowSeparatorDashArray(): number[] | null;
    set defaultRowSeparatorDashArray(value: number[] | null);
    /** 官方 `Panel.findColumnForLocalX(x)`：Table 面板中局部 x 落在哪一列（未命中返回列数） */
    findColumnForLocalX(x: number): number;
    /** 官方 `Panel.findRowForLocalY(y)`：Table 面板中局部 y 落在哪一行（未命中返回行数） */
    findRowForLocalY(y: number): number;
    /**
     * 官方 `Panel.findInVisualTree(func)`：深度优先遍历视觉树，
     * 返回第一个让 func 返回真值的对象；没有则返回 null。
     */
    findInVisualTree(func: (obj: GraphObject) => any): GraphObject | null;
    /** 官方 `Panel.walkVisualTreeFrom(obj, func)`：func(root, obj) 先于子树被调用 */
    walkVisualTreeFrom(obj: GraphObject, func: (root: GraphObject, obj: GraphObject) => void): void;
    /**
     * 官方 `Panel.freezeBindings()`：收集视觉树里所有 Binding 并冻结，
     * 同时解析 sourceName → 目标对象的关联，使模板的每份拷贝都能按名字找到目标。
     *
     * 本项目 `Binding` 还没有 `sourceName` / `targetId`（阶段 5 补齐），而 `copy()`
     * 已经会把 `_bindings` 深拷贝，因此这里只完成视觉树遍历这一半语义。
     */
    freezeBindings(): this;
    /** 官方 `Panel.graduatedRange` */
    get graduatedRange(): number;
    /** 官方 `Panel.graduatedPointForValue(val, result?)`：Graduated 面板把数值映射成路径上的点 */
    graduatedPointForValue(val: number, result?: Point): Point;
    /** 官方 `Panel.graduatedValueForPoint(pt)`：Graduated 面板把路径上的点反算成数值 */
    graduatedValueForPoint(pt: Point): number;
    /** 官方 `Panel.isOpposite`（官方用位标志，这里用布尔量等价表达） */
    get isOpposite(): boolean;
    set isOpposite(value: boolean);
    /** 官方 `Panel.panelLayoutState`（PanelLayout 的缓存状态，本项目尚未实现 PanelLayout） */
    get panelLayoutState(): any;
    set panelLayoutState(value: any);
    /** 主元素的几何：优先 Shape.geometry，否则按 figure + 尺寸生成 */
    private static _geometryOf;
    findItemPanelForData(data: any): Panel | null;
    getColumnDefinition(index: number): RowColumnDefinition;
    /**
     * 官方 `Panel.addRowDefinition(rowIndex, options): this`：
     * get-or-create 行定义，把 options（Partial<RowColumnDefinition> 或数字高度）合并进去，返回 this（可链式 .add）。
     * 官方实现里 height/width 共用同一存储，跨传也会生效——这里按 isRow 归一化。
     */
    addRowDefinition(index?: number, options?: Partial<RowColumnDefinition> | RowColumnDefinition | number): this;
    /**
     * 官方 `Panel.addColumnDefinition(colIndex, options): this`：
     * get-or-create 列定义，把 options 合并进去，返回 this。
     */
    addColumnDefinition(index?: number, options?: Partial<RowColumnDefinition> | RowColumnDefinition | number): this;
    private _applyRowColumnOptions;
    getRowDefinition(index: number): RowColumnDefinition;
    removeColumnDefinition(index: number, count?: number): Panel;
    removeRowDefinition(index: number, count?: number): Panel;
    rebuildItemElements(): void;
    updateTargetBindings(propname?: string): void;
    copy(): Panel;
    /** Copy Panel-specific properties to another Panel */
    protected _copyPanelPropertiesTo(copy: Panel): void;
    _measure(widthConstraint: number, heightConstraint: number, minW?: number, minH?: number): void;
    /** 就地并入 union */
    private _unionInto;
    _arrange(bounds: Rect): void;
    /**
     * Find the main element and separate others.
     * The main element is the first visible element with isPanelMain=true,
     * or the first visible element if none has isPanelMain.
     */
    private _findMainAndOthers;
    /** 官方 kN：主 Shape 的 spot1（Shape.spot1 → geometry.spot1 → TopLeft） */
    private _panelSpot1;
    /** 官方 PN：主 Shape 的 spot2 → BottomRight 兜底 */
    private _panelSpot2;
    /** 官方 PanelLayoutAuto.measure */
    private _measureAuto;
    /** 官方 PanelLayoutAuto.arrange */
    private _arrangeAuto;
    private _measureVertical;
    private _arrangeVertical;
    private _measureHorizontal;
    private _arrangeHorizontal;
    /** 官方 PanelLayoutSpot.measure（两遍） */
    private _measureSpot;
    /** 官方 PanelLayoutSpot.arrange */
    private _arrangeSpot;
    private _isRowColPanel;
    private _measureTable;
    private _arrangeTable;
    /** 官方 PanelLayoutPosition.measure：union 隐含 (0,0)（初始 union 为空点） */
    private _measurePosition;
    /** 官方 PanelLayoutPosition.arrange：pos - (union - pad) + margin */
    private _arrangePosition;
    private _measureViewbox;
    private _arrangeViewbox;
    private _measureGraduated;
    private _arrangeGraduated;
    /** 取 link 里「画线」的主图元：优先 isPanelMain，否则第一个同时有 fill/stroke 的 Shape */
    private _findLinkMainElement;
    /**
     * 官方 `PanelLayoutLink.measure(t, i, e, s, n, o, r)`（go-debug.js 全文解码）。
     *
     * 帧约定（已用官方探针数值验证）：
     * - `or`：从 routeRect(0,0,w,h) 起，依次并入 path、各主 Shape、各子元素的 z，
     *   最终 `union` 只取尺寸（x,y 归 0），link.position = routeBounds 原点 + or.origin。
     * - `qf[i]`：与「可见元素顺序（path 单独在最前）」一一对应的 z 矩形（route-local），
     *   arrange 时按同一顺序消费，child.actualBounds = z − or.origin。
     * - 子元素锚点三分支：segmentIndex 为 NaN → 几何分数点；越界（含默认 -Infinity）→
     *   路线中点；否则 → 点列线段插值。锚点均为 route-local（doc − routeBounds 原点）。
     */
    private _measureLink;
    /** 官方 `PanelLayoutLink.measureLinkPath(t, w, h, s)`：po(measuredBounds) + p3(naturalBounds) */
    private _measureLinkPath;
    /** 官方 `GraphObject.po(x,y,w,h)`：设 measuredBounds；scale/angle 非恒等时取变换后的轴对齐包围盒 */
    private _linkPo;
    /**
     * 官方 Transform 链（所有 op 都是后乘，点按调用逆序受作用）：
     * `Zs(-N.x,-N.y)` → `lt(sc)` → `Ns(a1,cx,cy)` → `Ns(a2,cx,cy)`
     * 即点先绕 (cx,cy) 旋转（两个同中心旋转可合成 a1+a2），再按 sc 缩放（绕原点），最后平移。
     */
    private static _linkXf;
    /**
     * 官方 `PanelLayoutLink.arrange(t, i, e)`：按 measure 存下的 `qf` 顺序，
     * child.actualBounds = z − or.origin（不再重算锚点/角度）；
     * 收尾把 `t.location` 同步为 position + WD 偏移。
     */
    private _arrangeLink;
    private _getPointAtDistance;
    private _getAngleAtDistance;
    /** 官方 `Panel.xL(p, navig, pred)`：找点选命中的最上层对象。 */
    _findObjectAtDoc(p: Point): GraphObject | null;
    /** 官方 `Panel.bL(p, navig, pred, coll)`：收集点选命中的全部对象。 */
    _collectObjectsAtDoc(p: Point, add: (o: GraphObject) => void): void;
    /** 官方 `Panel.m0(r, navig, pred, partialInclusion, coll)`：收集与矩形包含/相交的对象。 */
    _collectObjectsInDoc(r: Rect, add: (o: GraphObject) => void, partial: boolean): void;
    /** 官方 `Panel.SL(pt1, pt2, navig, pred, partialInclusion, coll)`：收集距离圆命中的对象。 */
    _collectObjectsNearDoc(p: Point, dist: number, add: (o: GraphObject) => void, partial: boolean): void;
    /**
     * 圆 (p, dist) 与轴对齐矩形 r 的关系：
     * 0 = 无交集，1 = 相交（但未包含），2 = 圆完全包含矩形。
     * 对应官方 `SL` 里的 `f`（相交）/ `u`（包含）判定。
     */
    private static _circleRectRelation;
    /** 官方：alignment → defaultAlignment，仍默认则 Center */
    private _resolveAlignment;
    /** 官方：alignmentFocus 默认 → 回退为该元素的 alignment（focus 落在 alignment 同一边） */
    private _resolveAlignmentFocus;
    /**
     * 官方 PanelLayoutVertical/Horizontal.arrange 里算元素宽度用的是
     *   `g = Math.max(union.width - 元素左右 margin - 面板右 padding, 0)`
     * 那个 `Math.max(…, 0)` 不能省：内容区比元素的 margin 还窄时 available 会是负数，
     * 直接喂给 `new Rect()` 会抛 `Invalid arguments to Rect constructor`
     * （实测 spreadsheet `4, 4, -8, 12`、regrouping `0, 0, -18.52, 81.05`）。
     */
    private _resolveStretchWidth;
    private _resolveStretchHeight;
    /** Compute the uniform scale factor for an element */
    private _resolveUniformScale;
    private _ensureColumnDefinition;
    private _ensureRowDefinition;
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
    /** 官方 PanelLayout 的注册表（官方是 `PanelLayout.In` / `PanelLayout.is`） */
    private static _panelLayouts;
    /** 官方 `Panel.definePanelLayout(name, func)` */
    static definePanelLayout(name: string, func: Function): void;
    /** 官方 `Panel.isLayoutDefined(name)` */
    static isLayoutDefined(name: string): boolean;
}

/**
 * RowColumnDefinition - defines the sizing and appearance of a row or column in a Table panel.
 *
 * 官方 RowColumnDefinition 语义移植：
 * - actual(Z): 实际计算尺寸（setter 按 minimum/maximum/width(height) 夹取）
 * - measured(Mi): 内容需求累计（measure 阶段填充）
 * - position(wt): arrange 前由 measure 写入的列/行起始位置
 * - sizing: Default → 取面板 rowSizing/columnSizing；None → 固定；ProportionalExtra → 按比例分配富余
 * - computeEffectiveSpacing/Top: 分隔线 + separatorPadding 的间距贡献
 */
declare class RowColumnDefinition {
    static readonly className: string;
    /** 官方 RowColumnDefinition 默认 isRow=true、index=0，因此默认行号为 0 */
    private _row;
    private _column;
    private _height;
    private _width;
    private _minimum;
    private _maximum;
    private _sizing;
    private _stretch;
    private _alignment;
    private _separatorStroke;
    private _separatorStrokeWidth;
    private _separatorDashArray;
    private _separatorPadding;
    private _background;
    private _coversSeparators;
    private _spanAllocation;
    /** 官方 Z：实际尺寸 */
    private _actual;
    /** 官方 Mi：内容需求累计 */
    private _measured;
    /** 官方 wt：位置偏移 */
    private _position;
    /** 官方 rn：所属面板 */
    private _panel;
    constructor();
    set(props: Record<string, any>): this;
    /** 官方 _a：设置所属面板 */
    _setPanel(panel: Panel | null): void;
    get panel(): Panel | null;
    get isRow(): boolean;
    get index(): number;
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
    get stretch(): EnumValue;
    set stretch(val: EnumValue);
    get alignment(): Spot;
    set alignment(val: Spot);
    get separatorStroke(): any;
    set separatorStroke(val: any);
    get separatorStrokeWidth(): number;
    set separatorStrokeWidth(val: number);
    get separatorDashArray(): number[] | null;
    set separatorDashArray(val: number[] | null);
    get separatorPadding(): Margin | null;
    set separatorPadding(val: MarginLike | null);
    get background(): any;
    set background(val: any);
    get coversSeparators(): boolean;
    set coversSeparators(val: boolean);
    get spanAllocation(): ((elt: any, def: RowColumnDefinition, extra: number) => number) | null;
    set spanAllocation(val: ((elt: any, def: RowColumnDefinition, extra: number) => number) | null);
    /** 官方 actual(Z) */
    get actual(): number;
    set actual(val: number);
    /** 官方 measured(Mi) */
    get measured(): number;
    set measured(val: number);
    /** 官方 wt */
    get position(): number;
    set position(val: number);
    /** 官方 total = Z + spacing */
    get total(): number;
    /** 官方 mS：sizing Default → 面板 rowSizing/columnSizing */
    effectiveSizing(): EnumValue;
    /** 官方 computeEffectiveSpacingTop(t)：首个非零定义之前的分隔间距（上方/左方） */
    computeEffectiveSpacingTop(firstIdx: number): number;
    /** 官方 computeEffectiveSpacing() */
    computeEffectiveSpacing(): number;
    /** 官方 RowColumnDefinition.ek(other)：把 other 上已设置的值合并进本定义（供 Panel.addRowColumnDefinition 使用） */
    _setValuesFrom(other: RowColumnDefinition): void;
    /** 官方 Us：登记在本定义上的 Binding 列表 */
    private _bindings;
    /**
     * 官方 `RowColumnDefinition.bind(targetprop, sourceprop?, conv?, backconv?)`
     * 以及 `bind(binding)` 重载。
     * 官方 `Of(t,e,i,s)`：首参为 Binding 实例则直接登记，否则新建 Binding；
     * 指定 `backconv` 时自动切换为 TwoWay。
     */
    bind(bindingOrTargetProp: Binding | string, sourceprop?: string, conv?: (value: any, targetObject: any, model: any) => any, backconv?: (value: any, sourceData: any, model: any) => any): this;
    /**
     * 官方 `RowColumnDefinition.bindTwoWay(...)`：等价于 `bind(...)` 后调用 `Binding.makeTwoWay()`。
     * 官方 `s === void 0 && n.makeTwoWay()`（未显式给 backconv 时也做双向绑定）。
     */
    bindTwoWay(bindingOrTargetProp: Binding | string, sourceprop?: string, conv?: (value: any, targetObject: any, model: any) => any, backconv?: (value: any, sourceData: any, model: any) => any): this;
    theme(targetprop: string, sourceprop?: string, themeSource?: string, conv?: (value: any, targetObject: any, model: any) => any, themeconv?: (value: any, targetObject: any, model: any) => any): this;
    themeData(targetprop: string, sourceprop?: string, themeSource?: string, conv?: (value: any, targetObject: any, model: any) => any, themeconv?: (value: any, targetObject: any, model: any) => any): this;
    themeObject(targetprop: string, sourceprop?: string, themeSource?: string, conv?: (value: any, targetObject: any, model: any) => any, themeconv?: (value: any, targetObject: any, model: any) => any, objectSrcname?: string): this;
    themeModel(targetprop: string, sourceprop?: string, themeSource?: string, conv?: (value: any, targetObject: any, model: any) => any, themeconv?: (value: any, targetObject: any, model: any) => any): this;
    /** 官方：`"RowColumnDefinition (Row 0) #26"` / `"RowColumnDefinition (Column 3) #27"` */
    toString(): string;
    copy(): RowColumnDefinition;
    static Default: EnumValue;
    static None: EnumValue;
    static ProportionalExtra: EnumValue;
}

/**
 * Part - base class for top-level visual elements (Node, Link, Adornment).
 * Extends Panel with location, selection, shadow, and adornment support.
 */
declare class Part extends Panel {
    static readonly className: string;
    static readonly LayoutNone: number;
    static readonly LayoutAdded: number;
    static readonly LayoutRemoved: number;
    static readonly LayoutShown: number;
    static readonly LayoutHidden: number;
    static readonly LayoutNodeSized: number;
    static readonly LayoutGroupLayout: number;
    static readonly LayoutNodeReplaced: number;
    static readonly LayoutStandard: number;
    static readonly LayoutAll: number;
    protected _diagram: any;
    /** 所属 Layer（官方 PartSettings.Ll），由 Layer.add/remove 维护 */
    protected _layer: any;
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
    private _groupable;
    private _isAnimated;
    private _textEditable;
    private _reshapable;
    private _resizable;
    private _rotatable;
    private _text;
    private _layoutConditions;
    private _minLocation;
    private _maxLocation;
    private _rotationSpot;
    private _resizeCellSize;
    private _selectionObjectName;
    private _resizeObjectName;
    private _rotateObjectName;
    private _resizeAdornmentTemplate;
    private _rotateAdornmentTemplate;
    private _locationObject;
    private _selectionObject;
    private _containingGroupChanged;
    private _highlightedChanged;
    private _layerChanged;
    private _selectionChanged;
    private _adornmentsPending;
    constructor(type?: any, init?: any);
    /** 官方 Part.g()：部件级失效只触发重排（measure/arrange/render），**不**失效布局 —— 官方
     * GraphObject.Ef→os 只置测量脏位；布局失效只走 Diagram.Ib（模型/绑定变更，带 isOngoing 护栏）。
     * 早先这里冒泡 `d._layoutInvalid=true`，配合 Diagram._measureArrangeAll 尾部的
     * _invalidateLinkRoutes 形成「布局→路线失效→布局」每帧死循环（gantt 样例 bar y=0 死循环元凶之一）。 */
    _invalidateMeasure(): void;
    get visible(): boolean;
    set visible(val: boolean);
    private _syncGuard;
    /** 官方 WD：location 点相对 bounds TL 的偏移（locationObject = part 本身，naturalBounds + locationSpot） */
    private _locationOffset;
    get location(): Point;
    set location(val: Point);
    /** 官方 Part.position（GraphObject.position 的 Part 覆盖：与 location 按 locationSpot 同步） */
    get position(): Point;
    set position(val: Point);
    /**
     * 官方 bF（location 驱动）：arrange 后 locationSpot 偏移变化时，用 location 重新推导 position。
     */
    syncPositionFromLocation(): void;
    /**
     * 从 this 到后代 target 的面板局部偏移累加（基于 actualBounds 局部坐标链）。
     */
    localOffsetTo(target: GraphObject): Point | null;
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
    /**
     * 官方 `Part.layer`（只读，返回本 Part 所属 Layer）。
     * 必须覆盖 `GraphObject.layer`（后者为 `this.part.layer`），
     * 否则 Part 自身 `_part === this` 时会无限递归。
     * 由 `Layer.add/remove` 维护。
     */
    get layer(): any;
    get zOrder(): number;
    set zOrder(val: number);
    get canStart(): boolean;
    set canStart(val: boolean);
    get dragComputation(): ((part: Part, newLoc: Point, snappedLoc: Point) => Point) | null;
    set dragComputation(val: ((part: Part, newLoc: Point, snappedLoc: Point) => Point) | null);
    get adornments(): Map$1<string, any>;
    set adornments(val: Map$1<string, any>);
    get category(): string;
    set category(val: string);
    get itemIndex(): number;
    set itemIndex(val: number);
    get isTopLevel(): boolean;
    /** 官方 Part.canLayout */
    canLayout(): boolean;
    get isVirtual(): boolean;
    get containingGroup(): any;
    set containingGroup(val: any);
    /**
     * 官方 Part.set containingGroup 尾部的连线传播：
     * - 本 Part 是 Group（有 memberParts）：官方 `Part.Lh(n,this,!0,0,!0)` 收集本组
     *   及其全部成员（递归下钻嵌套组），对其中每个 Node 的所有连线调用 `Link.dg`；
     * - 本 Part 是 Node（含 Group 自身）：自身 linksConnected 与 labeledLink 也重算。
     * 用鸭子类型代替 instanceof，避免 Part ↔ Node 的循环 import。
     */
    private _propagateContainingGroupToLinks;
    get adornmentStream(): Iterator<any>;
    /** Find a named GraphObject within this Part */
    findObject(name: string): GraphObject | null;
    /**
     * 官方 `Part.Df(change, propertyname, obj, oldval, newval, oldparam?, newparam?)`：
     * GraphObject 属性变更经所属 Part 转发到 Diagram 的管道。
     * Part 自身的 `_part` 指向自己，故此方法必须独立于 `GraphObject.raiseChangedEvent`，
     * 否则会自调用死循环。
     */
    raiseChangedEventFromObject(change: any, propertyname: string, obj: any, oldval: any, newval: any, oldparam?: any, newparam?: any): void;
    /** Ensure the bounds of this Part are computed (official: measure + updateBounds + sync position/location) */
    ensureBounds(): void;
    /** 官方 `Part.getDocumentBounds(rect?)`：返回文档坐标包围盒（给出 rect 时写入并返回该 rect） */
    getDocumentBounds(rect?: Rect): Rect;
    /** 官方 Part.move(newLoc, isLocation?)：isLocation=true 移动 location，否则移动 position */
    move(newLoc: Point, isLocation?: boolean): void;
    /** 官方 Part.moveTo(x, y, isLocation?) */
    moveTo(x: number, y: number, isLocation?: boolean): void;
    /** Add an adornment for the given category */
    addAdornment(category: string, ad: any): void;
    /** Remove the adornment for the given category */
    removeAdornment(category: string): void;
    /** Get the adornment for the given category */
    getAdornment(category: string): any | null;
    /** Remove all adornments */
    clearAdornments(): void;
    _createSelectionAdornment(): any;
    /** 官方 Part.canCopy() */
    canCopy(): boolean;
    /** 官方 Part.canDelete() */
    canDelete(): boolean;
    /** 官方 Part.canEdit() */
    canEdit(): boolean;
    /** 官方 Part.canGroup() */
    canGroup(): boolean;
    /** 官方 Part.canMove() */
    canMove(): boolean;
    /** 官方 Part.canReshape() */
    canReshape(): boolean;
    /** 官方 Part.canResize() */
    canResize(): boolean;
    /** 官方 Part.canRotate() */
    canRotate(): boolean;
    /** 官方 Part.canSelect() */
    canSelect(): boolean;
    get groupable(): boolean;
    set groupable(val: boolean);
    get textEditable(): boolean;
    set textEditable(val: boolean);
    get isAnimated(): boolean;
    set isAnimated(val: boolean);
    get reshapable(): boolean;
    set reshapable(val: boolean);
    get resizable(): boolean;
    set resizable(val: boolean);
    get rotatable(): boolean;
    set rotatable(val: boolean);
    get text(): string;
    set text(val: string);
    /** 官方 `Part.key`：只读，取 model 里对应数据的 key */
    get key(): unknown;
    /** 官方 `Part.self` 只读侧 */
    get self(): Part;
    /**
     * 官方 `Part.self` 的 setter 走 `Part.HN(newData, oldCat, newCat)`（按新 category 从模板
     * 整体重建部件）。本项目没有模板重建管线，这里退化为「把 value 的可观察状态同步进本部件」。
     */
    set self(value: Part);
    get containingGroupChanged(): ((part: Part, oldGroup: unknown, newGroup: unknown) => void) | null;
    set containingGroupChanged(val: ((part: Part, oldGroup: unknown, newGroup: unknown) => void) | null);
    get highlightedChanged(): ((part: Part) => void) | null;
    set highlightedChanged(val: ((part: Part) => void) | null);
    get layerChanged(): ((part: Part, oldLayer: unknown, newLayer: unknown) => void) | null;
    set layerChanged(val: ((part: Part, oldLayer: unknown, newLayer: unknown) => void) | null);
    get selectionChanged(): ((part: Part) => void) | null;
    set selectionChanged(val: ((part: Part) => void) | null);
    get layoutConditions(): number;
    set layoutConditions(val: number);
    /** 官方 `Part.locationObject`（只读，带缓存） */
    get locationObject(): GraphObject;
    get minLocation(): Point;
    set minLocation(val: Point);
    get maxLocation(): Point;
    set maxLocation(val: Point);
    get selectionObjectName(): string;
    set selectionObjectName(val: string);
    /** 官方 `Part.selectionObject`（只读，带缓存） */
    get selectionObject(): GraphObject;
    get resizeObjectName(): string;
    set resizeObjectName(val: string);
    /** 官方 `Part.resizeObject`（只读） */
    get resizeObject(): GraphObject;
    get rotateObjectName(): string;
    set rotateObjectName(val: string);
    /** 官方 `Part.rotateObject`（只读） */
    get rotateObject(): GraphObject;
    get rotationSpot(): Spot;
    set rotationSpot(val: Spot);
    get resizeCellSize(): Size;
    set resizeCellSize(val: Size);
    get resizeAdornmentTemplate(): Part | null;
    set resizeAdornmentTemplate(val: Part | null);
    get rotateAdornmentTemplate(): Part | null;
    set rotateAdornmentTemplate(val: Part | null);
    /** 官方 `Part.findAdornment(category)` */
    findAdornment(category: string): unknown | null;
    /** 官方 `Part.hasPlaceholder()`（Adornment 覆写为 true） */
    hasPlaceholder(): boolean;
    /** 官方 `Part.isVisible()`：还要看图层可见性与所属 Group 是否展开 */
    isVisible(): boolean;
    /** 官方 `Part.findSubGraphLevel()` */
    findSubGraphLevel(): number;
    private static _subGraphLevel;
    /** 官方 `Part.findTopLevelPart()` */
    findTopLevelPart(): Part;
    private static _topLevelPart;
    /** 官方：Node 上的 `labeledLink`（本项目 Phase 4 稍后补该属性，此处鸭子类型取用） */
    private static _labeledLinkOf;
    /** 官方 `Part.isMemberOf(group)` */
    isMemberOf(group: unknown): boolean;
    private static _isMemberOf;
    /**
     * 官方 `Part.findCommonContainingGroup(other)`。
     * 官方用 Part 上的临时标志位（`Mk(true)`/`CF()`）做标记；本项目用临时 Set，等价且不污染部件状态。
     */
    findCommonContainingGroup(other: Part | null): Part | null;
    /** 官方遍历链：Node 优先走 labeledLink，再取 containingGroup */
    private static _chainParent;
    /** 官方 `Part.getRelativePoint(el, spot, result?)` */
    getRelativePoint(el: GraphObject, spot: Spot, result?: Point): Point;
    /**
     * 官方 `Part.invalidateLayout(condition?)`（go.d.ts:22860 附近）。
     * 条件与 `layoutConditions` 位与为 0 时直接忽略。
     */
    invalidateLayout(condition?: number): void;
    private _canInvalidateLayout;
    /** 官方 `Part.invalidateAdornments()`：标记装饰失效并立刻按需重建 */
    invalidateAdornments(): void;
    /** 官方 `Part.updateAdornments()` */
    updateAdornments(): void;
    /** 官方 `Part.updateRelationshipsFromData()` */
    updateRelationshipsFromData(): void;
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
    static readonly className: string;
    protected _panel: Panel | null;
    protected _part: Part | null;
    protected _actualBounds: Rect;
    protected _measuredBounds: Rect;
    protected _naturalBounds: Rect;
    protected _bindings: Binding[];
    protected _isInDocument: boolean;
    protected _isPlaceholder: boolean;
    protected _className: string;
    protected _desiredSize: Size;
    protected _minSize: Size;
    protected _maxSize: Size;
    protected _margin: Margin;
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
    private _graduatedStart;
    private _graduatedEnd;
    private _graduatedSkip;
    private _graduatedFunction;
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
    /** 官方 `port.Vd`：side-spot 连线端口 Knot 缓存（见 LinkKnot.ts） */
    private _knot;
    private _segmentIndex;
    private _segmentFraction;
    private _segmentOffset;
    private _segmentOrientation;
    protected _position: Point;
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
    /**
     * 官方 GraphObject 的 graduated* 系列（Graduated 面板子元素用）：
     * graduatedStart/graduatedEnd 限定该元素参与的范围（0~1 比例），
     * graduatedSkip 决定某个刻度值是否跳过，graduatedFunction 自定义刻度文字。
     */
    get graduatedStart(): number;
    set graduatedStart(val: number);
    get graduatedEnd(): number;
    set graduatedEnd(val: number);
    get graduatedSkip(): ((val: number, obj: GraphObject) => boolean) | null;
    set graduatedSkip(val: ((val: number, obj: GraphObject) => boolean) | null);
    get graduatedFunction(): ((val: number, obj: GraphObject) => any) | null;
    set graduatedFunction(val: ((val: number, obj: GraphObject) => any) | null);
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
    get portId(): string | null;
    set portId(val: string | null);
    /**
     * 官方 `Node.ne(port)`：清空端口上的 side-spot knot 缓存。
     * 由 Node.invalidateConnectedLinks / portId 变更 / link 端点变更触发。
     */
    invalidateConnectedLinksCache(): void;
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
    bind(bindingOrTargetProp: Binding | string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any): this;
    bindObject(targetProperty: string, sourceProperty: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any, sourceObject?: string): this;
    /** 官方 `GraphObject.bindTwoWay(targetprop, sourceprop?, conv?, backconv?)`：第 3 参为 source→target 转换 */
    bindTwoWay(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any, backConversion?: (value: any, sourceData: any, model: any) => any): this;
    /**
     * 官方 GraphObject.theme(targetprop, sourceprop?, themesource?, conv?, themeconv?)。
     * 官方第 3 参是 themeSource、第 4 参才是 converter —— 旧签名把 converter 放在第 3 位，
     * flowchart 的 .themeObject('stroke','isSelected',null,fn) 因此把 fn 当成了 sourceName，
     * 描边永远停在默认黑色。
     */
    theme(targetProperty: string, sourceProperty?: string, themeSource?: string | null, converter?: (value: any, targetObject: any, model: any) => any, themeConverter?: (value: any, targetObject: any, model?: any) => any): this;
    /** 官方 themeData：ofData —— 源是 part.data（旧版误设成 modelData） */
    themeData(targetProperty: string, sourceProperty?: string, themeSource?: string | null, converter?: (value: any, targetObject: any, model: any) => any, themeConverter?: (value: any, targetObject: any, model?: any) => any): this;
    themeModel(targetProperty: string, sourceProperty?: string, themeSource?: string | null, converter?: (value: any, targetObject: any, model: any) => any, themeConverter?: (value: any, targetObject: any, model?: any) => any): this;
    /** 官方 themeObject：源是“绑定面板”（sourceName 默认 ''）上的属性 */
    themeObject(targetProperty: string, sourceProperty?: string, themeSource?: string | null, converter?: (value: any, targetObject: any, model: any) => any, themeConverter?: (value: any, targetObject: any, model?: any) => any, sourceName?: string): this;
    bindModel(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any): this;
    setProperties(props: Record<string, any>): this;
    /** Batch set properties */
    set(props: Partial<GraphObject>): this;
    /** Virtual copy - creates a shallow copy of this GraphObject */
    copy(): GraphObject;
    /** 官方未文档化的 SVG 过滤器名（官方注释：May not work in Safari） */
    private _filter;
    /** 官方未文档化的行列跨度分配回调 */
    private _spanAllocation;
    /** 官方运行时存在的 svg 访问器（本项目为 Canvas 渲染，默认 null） */
    private _svg;
    /** 官方 `GraphObject.ao`：`addCopyProperty()` 登记的、clone 时额外复制的属性名 */
    private _copyProperties;
    /**
     * 官方 `GraphObject.toString()` = `"U.Jn(构造器) # hashId"`，
     * 其中 `U.Jn(constructor)` 就是该类的 `static className`。
     * Panel / Shape / TextBlock / Picture / Part / Adornment 等子类按官方各自覆盖。
     */
    toString(): string;
    /**
     * 官方 `GraphObject.clone()`：`new this.constructor()` → `cloneProtected` → 复制 `addCopyProperty` 登记项。
     * 官方所有子类的 `copy()` 都等于 `clone()`（本项目子类暂时保留各自的 `copy()` 覆盖）。
     */
    clone(): this;
    /**
     * 官方 `GraphObject.cloneProtected(copy)`（d.ts 标为 protected）。
     * 官方在 Panel / Shape / TextBlock / Picture / Part / Node / Link / Group / Placeholder / 各 Layout
     * 上都有覆盖；本项目基类实现等价于把 GraphObject 层状态写入 copy。
     */
    protected cloneProtected(copy: this): void;
    /** 官方 `GraphObject.MD(copy)`：把 `addCopyProperty` 登记的属性逐个拷过去 */
    private _applyExtraCopyProperties;
    /** 官方 `GraphObject.addCopyProperty(propName)`：登记 clone 时需要额外复制的属性名（重复登记被忽略） */
    addCopyProperty(propName: string): void;
    /** 官方 `GraphObject.raiseChanged(propertyName, oldValue, newValue)` */
    raiseChanged(propertyname: string, oldval: any, newval: any): void;
    /**
     * 官方 `GraphObject.raiseChangedEvent(change, propertyname, obj, oldval, newval, oldparam?, newparam?)`。
     * 官方实现：先交给 `part.Df(...)`（Part 层处理 elements 插删、再转发 `diagram.raiseChangedEvent`），
     * 无 Part 时直接转发给 `diagram.raiseChangedEvent`。
     * 注意：Part 自身的 `_part` 指向自己，因此这里必须走 Part 的专用管道（`raiseChangedEventFromObject`），
     * 不能递归调用 `raiseChangedEvent`，否则属性变更会无限递归（栈溢出）。
     */
    raiseChangedEvent(change: any, propertyname: string, obj: any, oldval: any, newval: any, oldparam?: any, newparam?: any): void;
    /**
     * 官方 `GraphObject.containsPoint(p)`。
     *
     * 偏差：官方靠内部 Transform 矩阵把输入点在「本对象局部坐标」与「所在 Panel 坐标」之间换算；
     * 本项目没有 Transform 矩阵，统一以**文档坐标**计算（与 `Diagram.findObjectAt(docPoint)` 一致）。
     */
    containsPoint(p: Point): boolean;
    /**
     * 官方 `GraphObject.containsRect(r)`：本对象是否包含给定矩形。
     * 偏差同 `containsPoint`：统一按文档坐标计算。
     */
    containsRect(r: Rect): boolean;
    /** 官方 `GraphObject.containedInRect(r, transform?)`：本对象是否被给定矩形包含 */
    containedInRect(r: Rect, transform?: any): boolean;
    /** 官方 `GraphObject.intersectsRect(r, transform?)`：本对象是否与给定矩形相交 */
    intersectsRect(r: Rect, transform?: any): boolean;
    /**
     * 官方 `GraphObject.getNearestIntersectionPoint(p, q, result)`：
     * 把线段 pq 与本对象边界的**最近交点**写入 result；返回是否找到交点。
     * 官方实现走 `G.Bl`（四条边各做一次线段求交，取离 p 最近的那个），返回值是 boolean。
     * 偏差同 `containsPoint`：统一按文档坐标计算。
     */
    getNearestIntersectionPoint(p: Point, q: Point, result: Point): boolean;
    /**
     * 官方 `G.Bl(x, y, w, h, x1, y1, x2, y2, result)` 的等价实现：
     * 线段 (x1,y1)→(x2,y2) 与矩形四条边的交点里，取离 (x1,y1) 最近的一个写入 result。
     * 找不到交点时 result 置为矩形左上角并返回 false（与官方一致）。
     */
    private static _nearestIntersection;
    /**
     * 官方 `GraphObject.commonArrange(x, y, w, h)`：把本对象排布到给定矩形。
     * 官方实现会先写 actualBounds 再按 desiredSize/stretch 精简；
     * 本项目等价地落到 `_arrange()`（子类按各自 stretch 逻辑覆写）。
     */
    commonArrange(x: number, y: number, w: number, h: number): void;
    /** 官方 `GraphObject.filter`（未文档化的 SVG 过滤器名） */
    get filter(): string;
    set filter(value: string);
    /** 官方 `GraphObject.spanAllocation`（未文档化的行列跨度分配回调） */
    get spanAllocation(): ((a: GraphObject, b: RowColumnDefinition, c: number) => number) | null;
    set spanAllocation(value: ((a: GraphObject, b: RowColumnDefinition, c: number) => number) | null);
    /** 官方 `GraphObject.svg`（本项目为 Canvas 渲染，恒为 null） */
    get svg(): any;
    set svg(value: any);
    /** Apply a function to this object and return it */
    apply(func: (obj: GraphObject, data?: any) => void, data?: any): GraphObject;
    /** 官方 findBindingPanel：从自身（若为 Panel）起向上找带绑定的面板 */
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
    /** 官方 `GraphObject.trigger(propname, value?): this`：触发动画并返回自身（可链式 .add） */
    trigger(propname: string, value?: any): this;
    /** Invalidate the measurement of this object and its ancestors */
    _invalidateMeasure(): void;
    /** Invalidate the arrangement of this object and its ancestors */
    _invalidateArrange(): void;
    /** Measure this object within the given constraints (官方 yt：可选 minW/minH) */
    _measure(widthConstraint: number, heightConstraint: number, minW?: number, minH?: number): void;
    /** Apply minSize/maxSize/desiredSize constraints to measured bounds */
    protected _applySizeConstraints(): void;
    /**
     * 官方 GraphObject.po：scale（及 angle）作用于 measuredBounds。
     * scale 矩阵 + 绕中心旋转，取轴对齐包围盒；naturalBounds 不受影响。
     */
    protected _applyMeasureTransform(): void;
    /** 官方 GraphObject.ln(forArranging) — 解析有效 stretch */
    _getStretch(forArranging: boolean): EnumValue;
    /**
     * 官方 GraphObject.gp(rowDef, colDef, forArranging)：
     * 元素 stretch 为 Default 时，由所在行/列定义的 stretch + 面板 defaultStretch 推导有效 stretch。
     */
    private _resolveTableChildStretch;
    /** 官方 GraphObject.gp(rowDef, colDef, forArranging)（stretch 已知为 Default） */
    _gpWithDefs(panel: Panel, rowDef: RowColumnDefinition, colDef: RowColumnDefinition, forArranging: boolean): EnumValue;
    /** 官方 GraphObject.ir(stretch, forArranging) — 按 desiredSize 精简 stretch */
    private _refineStretch;
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
    static FlipVertical: EnumValue;
    static FlipHorizontal: EnumValue;
    static FlipBoth: EnumValue;
    /** Factory method for creating GraphObjects - stub */
    static _classRegistry: Record<string, any>;
    static defineBuilder(name: string, func: Function): void;
    /** 官方 `GraphObject.isBuilderDefined(name)` */
    static isBuilderDefined(name: string): boolean;
    /**
     * 官方 `GraphObject.takeBuilderArgument(args, default?, pred?)`：取出 args[1]。
     * 默认谓词为 `typeof === 'string'`；命中则从数组移除并返回，未命中且有默认值返回默认值，否则抛错。
     */
    static takeBuilderArgument(obj: any, defaultVal?: any, pred?: (v: any) => boolean): any;
    /**
     * 官方 `GraphObject.build(type, init?, ...args)`：init 不传给 builder（builder 收 [type, ...args]），
     * 返回后再 setProperties(init)。
     */
    static build(type: any, init?: any, ...args: any[]): any;
    static make(type: any, ...args: any[]): any;
}

/**
 * Shape - 几何图形
 * 表示一个几何形状，支持预定义图形和自定义几何路径
 */
declare class Shape extends GraphObject {
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
    static getArrowheadGeometries(): Map$1<string, Geometry>;
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

/**
 * HTMLInfo - provides custom HTML-based editing or display for tools.
 * Used by TextEditingTool and ContextMenuTool to integrate HTML elements.
 */
declare class HTMLInfo {
    static readonly className: string;
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
 * Link - a Part that represents a connection between two Nodes.
 */
declare class Link extends Part {
    static readonly className: string;
    /** 官方 `Link.Normal = Routing.Normal` */
    static readonly Normal: EnumValue;
    /** 官方 `Link.Orthogonal = Routing.Orthogonal` */
    static readonly Orthogonal: EnumValue;
    /** 官方 `Link.AvoidsNodes = Routing.AvoidsNodes` */
    static readonly AvoidsNodes: EnumValue;
    /** 官方 `Link.AvoidsNodesStraight` */
    static readonly AvoidsNodesStraight: EnumValue;
    /** 官方 `Link.None = 0`（routing：不使用任何路由算法） */
    static readonly None: EnumValue;
    /** 官方 `Link.Bezier = Curve.Bezier` */
    static readonly Bezier: EnumValue;
    /** 官方 `Link.JumpGap = Curve.JumpGap` */
    static readonly JumpGap: EnumValue;
    /** 官方 `Link.JumpOver = Curve.JumpOver` */
    static readonly JumpOver: EnumValue;
    /** 官方 `Link.End = LinkAdjusting.End` */
    static readonly End: EnumValue;
    /** 官方 `Link.Scale = LinkAdjusting.Scale` */
    static readonly Scale: EnumValue;
    /** 官方 `Link.Stretch = LinkAdjusting.Stretch` */
    static readonly Stretch: EnumValue;
    /** 官方 `Link.OrientAlong = Orientation.Along` */
    static readonly OrientAlong: EnumValue;
    /** 官方 `Link.OrientPlus90` */
    static readonly OrientPlus90: EnumValue;
    /** 官方 `Link.OrientMinus90` */
    static readonly OrientMinus90: EnumValue;
    /** 官方 `Link.OrientOpposite` */
    static readonly OrientOpposite: EnumValue;
    /** 官方 `Link.OrientUpright` */
    static readonly OrientUpright: EnumValue;
    /** 官方 `Link.OrientPlus90Upright` */
    static readonly OrientPlus90Upright: EnumValue;
    /** 官方 `Link.OrientMinus90Upright` */
    static readonly OrientMinus90Upright: EnumValue;
    /** 官方 `Link.OrientUpright45` */
    static readonly OrientUpright45: EnumValue;
    /** 官方 `Link.zF`（setRoutingParameter(1)） */
    private static _zF;
    /** 官方 `Link.XF`（2，默认 curviness） */
    private static _XF;
    /** 官方 `Link.Wh`（3） */
    private static _Wh;
    /** 官方 `Link.yS`（4） */
    private static _yS;
    /** 官方 `Link.YF`（5） */
    private static _YF;
    /** 官方 `Link.KF`（6，Bezier 曲线的 spacing 倍率） */
    private static _KF;
    /** 官方 `Link.rA`（7，共线判定容差） */
    private static _rA;
    /** 官方 `Link.lA`（8，Bezier 端点长度比例） */
    private static _lA;
    /** 官方 `Link.UF`（9） */
    private static _UF;
    /** 官方 `Link.ou`（10） */
    private static _ou;
    /** 官方 `Link.GF`（11） */
    private static _GF;
    /** 官方 `Link.qF`（12） */
    private static _qF;
    /** 官方 `Link.hA`（13，默认 end segment length） */
    private static _hA;
    /** 官方 `Link.HF`（14，默认 corner） */
    private static _HF;
    /** 官方 `Link.vF`（15，默认 spacing） */
    private static _vF;
    /** 官方 `Link.WF`（16） */
    private static _WF;
    /** 官方 `Link.jF`（17） */
    private static _jF;
    /** 官方 `Link.RL`（18） */
    private static _RL;
    /** 官方 `Link.IL`（19） */
    private static _IL;
    /** 官方 `Link.JF`（20） */
    private static _JF;
    /** 官方 `Link.yD`（setRoutingParameter 中 30..70 区间的内部保留值） */
    private static _yD;
    /** 官方 `Link.setRoutingParameter(idx, value)`：设置路由算法的内部参数（1..20，以及 30..70 的保留位） */
    static setRoutingParameter(idx: number, value: number): void;
    /** 官方 `Link.computeAngle(orientation, angle)`（静态） */
    static computeAngle(orientation: any, angle: number): number;
    /** 官方 `Link.computeAngle(inputAngle, u, v)`（实例，委托静态实现） */
    computeAngle(inputAngle: number, u: number, v: number): number;
    /** 官方 `G.qi`：把角度归一到 [0, 360) */
    private static _normalizeAngle;
    /** 把 `Orientation.*` 枚举值（或数字）映射到官方 computeAngle 的分支码 */
    private static _orientationCode;
    /** 供 Panel._measureLink 使用的 orientation 分支码（官方 measure 里 `L` 的值） */
    static orientationCode(o: any): number;
    /** 官方 `G.u`（近似相等，用于正交路由的共线判定） */
    private static _approx;
    /** 官方 `G.H`（近似等于 0） */
    private static _approxZero;
    /** 官方 `Link.uA`：把 to 点沿主导方向推到无穷远处，用作正交方向参考 */
    private static _orthogonalize;
    /** 官方 `GraphObject.getDocumentPoint(Spot, result)` 在无 Transform 时的等价实现 */
    private static _docPoint;
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
    private _jumpOver;
    private _jumpGap;
    private _isTreeLink;
    private _labelNodes;
    private _fromPortChanged;
    private _toPortChanged;
    private _suspendsRouting;
    private _smoothness;
    private _defaultFromPoint;
    private _defaultToPoint;
    private _isRouteValid;
    private _isComputingRoute;
    private _oldPoints;
    private _flattenedLengths;
    private _flattenedTotalLength;
    private _routeBounds;
    private _routeOffset;
    private _geometry;
    private _isGeometryValid;
    constructor(type?: any, init?: any);
    get fromNode(): Node | null;
    set fromNode(val: Node | null);
    get toNode(): Node | null;
    set toNode(val: Node | null);
    get fromPortId(): string;
    set fromPortId(val: string);
    get toPortId(): string;
    set toPortId(val: string);
    /** 官方 `Node.OS/ES → ne(port)`：连线端点变更时清空端口 knot 缓存 */
    private _ggPort;
    /**
     * 官方 `Link.dg()`：按两端点的公共 containingGroup 更新本 Link 的从属关系。
     * 官方 Link 的 containment 不是模型 group 数据直接给的，而是
     * `fromNode.findCommonContainingGroup(toNode)` 的结果（嵌套组时取最深公共祖先）；
     * 两端都在同一 Group 内的连线 `isTopLevel === false`，
     * 布局收集（Layout.collectParts 的 toplevelonly 过滤）才不会把组内连线
     * 及其端点塞进顶层网络 —— 否则 ParallelLayout.findSplitMerge 会看到
     * 组内的多个 Split 节点而抛 "Split node already exists"（flowgrammer）。
     * 由 fromNode/toNode setter 与 Part.containingGroup 变更传播调用。
     */
    updateContainingGroup(): void;
    /** 官方 `Link.isTreeLink`（默认 true） */
    get isTreeLink(): boolean;
    set isTreeLink(val: boolean);
    /** 官方 `Link.labelNodes`：作为本链接标签的 Node 迭代器 */
    get labelNodes(): Iterator<Node>;
    /** 官方 `Link.isLabeledLink` */
    get isLabeledLink(): boolean;
    /** 官方 `Link.addLabelNode`（非公开）：把 node 设为本链接的标签 */
    _addLabelNode(node: Node): void;
    /** 官方 `Link.removeLabelNode`（非公开） */
    _removeLabelNode(node: Node): void;
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
    /** Whether this link uses orthogonal routing（官方 `Link.isOrthogonal` = routing & 2） */
    get isOrthogonal(): boolean;
    /** 官方 `Link.isAvoiding` = routing & 4（仅 AvoidsNodes / AvoidsNodesStraight） */
    get isAvoiding(): boolean;
    /** Get the link connection point on the from port */
    getLinkPointFromPort(port: GraphObject, spot: Spot): Point;
    /** Get the link connection point on the to port */
    getLinkPointToPort(port: GraphObject, spot: Spot): Point;
    /** Compute the route points for this link */
    computePoints(): boolean;
    /** 官方 `Link.r4` 的 curviness 中点插入（非 Bezier 快路径，显式设置 curviness 时） */
    private _r4Mid;
    /** 官方 `Link.o4`：Bezier 快路径插入两个控制点并重算端点 */
    private _o4;
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
    /**
     * 官方 Link.getLinkPointFromPoint 的等价入口：优先用端口内元素的图形几何求交
     * （Shape.getNearestIntersectionPoint 会按 figure 解椭圆/线段），
     * 没有可用图形元素时回退到 actualBounds 矩形求交。
     */
    private _connectionPoint;
    private _getEdgeIntersection;
    private _computeSelfLinkPoints;
    /** 官方 `Link.midPoint`：先 updateRoute 再取中点 */
    get midPoint(): Point;
    findClosestSegment(p: Point): number;
    /** 官方 `Link.path`：主元素是 Shape 时即连线的绘制形状 */
    get path(): GraphObject | null;
    /** 官方 `Link.fromPort` */
    get fromPort(): GraphObject | null;
    /** 官方 `Link.toPort` */
    get toPort(): GraphObject | null;
    get fromPortChanged(): ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null;
    set fromPortChanged(val: ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null);
    get toPortChanged(): ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null;
    set toPortChanged(val: ((link: Link, oldPort: GraphObject | null, newPort: GraphObject | null) => void) | null);
    /** 官方 `Link.suspendsRouting`（默认 false） */
    get suspendsRouting(): boolean;
    set suspendsRouting(val: boolean);
    /** 官方 `Link.smoothness`（默认 0.5） */
    get smoothness(): number;
    set smoothness(val: number);
    /** 官方 `Link.defaultFromPoint`（非实数时归一为 Point(NaN,NaN)） */
    get defaultFromPoint(): Point;
    set defaultFromPoint(val: Point);
    /** 官方 `Link.defaultToPoint` */
    get defaultToPoint(): Point;
    set defaultToPoint(val: Point);
    /** 官方 `Link.pointsCount` */
    get pointsCount(): number;
    /** 官方 `Link.getPoint(i)` */
    getPoint(i: number): Point;
    /** 官方 `Link.setPoint(i, p)` */
    setPoint(i: number, p: Point): void;
    /** 官方 `Link.setPointAt(i, x, y)` */
    setPointAt(i: number, x: number, y: number): void;
    /** 官方 `Link.insertPoint(i, p)` */
    insertPoint(i: number, p: Point): void;
    /** 官方 `Link.insertPointAt(i, x, y)` */
    insertPointAt(i: number, x: number, y: number): void;
    /** 官方 `Link.addPoint(p)` */
    addPoint(p: Point): void;
    /** 官方 `Link.addPointAt(x, y)` */
    addPointAt(x: number, y: number): void;
    /** 官方 `Link.removePoint(i)` */
    removePoint(i: number): void;
    /** 官方 `Link.clearPoints()` */
    clearPoints(): void;
    /** 官方 `Link.convertPointsArrayToList`：兼容数字数组 `[x,y,...]` 与对象数组 `[{x,y},...]` */
    convertPointsArrayToList(arr: any[]): List<Point> | null;
    /** 官方 `Link.canRelinkFrom()` */
    canRelinkFrom(): boolean;
    /** 官方 `Link.canRelinkTo()` */
    canRelinkTo(): boolean;
    /** 官方 `Link.getOtherNode(node)` */
    getOtherNode(node?: GraphObject | null): Node | null;
    /** 官方 `Link.getOtherPort(port)` */
    getOtherPort(port?: GraphObject | null): GraphObject | null;
    /** 官方 `Link.computeAdjusting()` */
    computeAdjusting(): EnumValue;
    /** 官方 `Link.computeCurve()`（自链接 + 非正交 → Bezier） */
    computeCurve(): EnumValue;
    /** 官方 `Link.computeCorner()` */
    computeCorner(): number;
    /** 官方 `Link.computeCurviness()`（本项目无 link bundle，只取默认值 16） */
    computeCurviness(): number;
    /** 官方 `Link.hasCurviness()`（无 bundle） */
    hasCurviness(): boolean;
    /** 官方 `Link.computeThickness()` */
    computeThickness(): number;
    /** 官方 `Link.computeSpot(isFrom, port?)` */
    computeSpot(isFrom: boolean, port?: GraphObject | null): Spot;
    /** 官方 `Link.Rl(spot)`：是否为无方向约束的 spot（None 或正中心） */
    private _isCenterSpot;
    /** 官方 `Link.Sg(spot, isFrom)` */
    private _resolveLinkSpot;
    /** 官方 `Link.computeShortLength(isFrom)` */
    computeShortLength(isFrom: boolean): number;
    /** 官方 `Link.computeEndSegmentLength(node, port, spot, isFrom, dir?)` */
    computeEndSegmentLength(node: Node | null, port: GraphObject | null, spot: Spot, isFrom: boolean, dir?: number): number;
    /** 官方 `Link.l4(port, link)`：只查已有 knot，不创建 */
    private _l4;
    /** 官方 `Link.YS(port)`：取（必要时创建）端口 Knot 中本连线的 LinkInfo */
    private _ys;
    /** 官方 `Link.computeOtherPoint(othernode, otherport, otherspot?, from?, result?)` */
    computeOtherPoint(othernode: Node, otherport: GraphObject, otherspot?: Spot, from?: boolean, result?: Point): Point;
    /** 官方 `Link.getLinkPointFromPoint(node, port, focus, p, from, result?)` */
    getLinkPointFromPoint(node: Node | null, port: GraphObject | null, focus: Point, p: Point, from: boolean, result?: Point): Point;
    /** 官方 `Link.getLinkPoint(node, port, spot, from, ortho, othernode, otherport, result?)` */
    getLinkPoint(node: Node | null, port: GraphObject, spot: Spot, from: boolean, ortho: boolean, othernode: Node | null, otherport: GraphObject, result?: Point): Point;
    /** 官方 `Link.getLinkDirection(node, port, linkpoint, spot, from, ortho, othernode, otherport)` */
    getLinkDirection(node: Node | null, port: GraphObject | null, linkpoint: Point, spot: Spot, from: boolean, ortho: boolean, othernode: Node | null, otherport: GraphObject | null): number;
    /** 官方 `Link.h4(...)`（getLinkDirection 内核） */
    private _h4;
    /** 官方 `G.Sx(null, spot.x, spot.y)`：点位 spot → 方向角（含 45/135/225/315 对角方向） */
    private static _spotDirection;
    /** 官方 `Link.computeSpacing()` */
    computeSpacing(): number;
    /** 官方 `Link.findMidLabel()`：没有指定 segmentIndex 的中间标签元素 */
    findMidLabel(): GraphObject | null;
    /** 官方 `Link.arrangeBundledLinks(links, recompute)`（本项目无 bundle，仅按官方语义失效路由） */
    arrangeBundledLinks(links: Link[], recompute: boolean): void;
    /** 官方 `Link.usesSamePort(other)` */
    usesSamePort(other: Link): boolean;
    get firstPickIndex(): number;
    get lastPickIndex(): number;
    /** 官方 `Link.flattenedLengths` */
    get flattenedLengths(): number[];
    /** 官方 `Link.flattenedTotalLength` */
    get flattenedTotalLength(): number;
    /** 官方 `Link.computeMidPoint(result)`（本项目无 Transform，跳过 Geometry 沿路径取中点分支） */
    computeMidPoint(result: Point): Point;
    /** 官方 `Link.midAngle` */
    get midAngle(): number;
    /** 官方 `Link.computeMidAngle()` */
    computeMidAngle(): number;
    /** 官方 `Link.routeBounds` */
    get routeBounds(): Rect;
    /** 官方 `Link.cA()`：按点列计算 routeBounds（本项目无 Bezier 控制点外扩，等价于包围盒） */
    private _computeRouteBounds;
    /** 官方 `Link.startRoute()` */
    startRoute(): void;
    /** 官方 `Link.commitRoute()` */
    commitRoute(): void;
    /** 官方 `Link.rollbackRoute()` */
    rollbackRoute(): void;
    /** 官方 `Link.zS()`：标记路由有效并刷新派生缓存 */
    private _finalizeRoute;
    /**
     * 官方对 `curve === CurveBezier` 的两点路线**在 computePoints 里就插入两个
     * 控制点**，使 `link.points` 变成 4 点的三次贝塞尔，而不是留到渲染时再弯。
     * 实测 friendWheel：官方 `link0.points` 为 4 点
     * `[[594.46,53.7],[595.46,74.25],[597.86,75.39],[614.47,63.25]]`；
     * 修复前我们是 2 点，画出来是直线。
     *
     * 官方 `Link.RF = 16`，即未显式设置 curviness 时的默认值。
     * 控制点取弦上 1/3、2/3 处，再沿弦法线偏移 curviness：
     * 水平弦（h≈0）直接改 y，其余按斜率 f = -a/h 投影。
     */
    private _applyBezierCurve;
    /** 官方 `Link.updateRoute()` */
    updateRoute(): void;
    /** 官方：把 link 的几何同步给 `path` 以及所有 isPanelMain 的 Shape 元素 */
    private _syncGeometryToMainShapes;
    /** 官方 `Link.invalidateRoute()`（= `oi()`，本项目无 invalid-route 集合，只做失效标记） */
    invalidateRoute(): void;
    /** 官方 `Link.invalidateGeometry()`（= `ge()`） */
    invalidateGeometry(): void;
    /** 官方 `Link.geometry` */
    get geometry(): Geometry;
    /**
     * 官方 `Link.wc(t, isFrom, ref)`：把几何端点沿首/末线段向内缩短
     * `computeShortLength`（2 点时上限为半段长，多点时上限为整段长）。
     * 官方在 makeGeometry 内对几何做短化（link.points 本身不含短化）。
     * 经官方坐标系（平移到 min、ref=min/0,0）化简后等价于对原始坐标直接缩短。
     */
    private _wcPoint;
    /** 官方 `Link.makeGeometry()`（本项目无 Transform 矩阵，按点列构造折线/贝塞尔几何） */
    makeGeometry(): Geometry;
    /** 官方 `Link.adjustPoints(start, p1, end, p2)` */
    adjustPoints(start: number, p1: Point, end: number, p2: Point): boolean;
    /** 官方 `Link.f4`（LinkAdjusting.Scale：保持形状的仿射变换） */
    private _adjustScale;
    /** 官方 `Link.u4`（LinkAdjusting.Stretch：端点对齐的拉伸） */
    private _adjustStretch;
    /** 官方 `Link.d4`（LinkAdjusting.End：只改端点；本项目无 positions 网格，跳过占用校验） */
    private _adjustEnd;
    /** 官方 `Link.ZL()`：正交路由是否撞到已占用区域（本项目无 positions 网格，恒不重叠） */
    private _positionsOverlap;
    /** 官方 `Link.computeMidOrthoPosition(fromX, fromY, toX, toY, vertical)` */
    computeMidOrthoPosition(fromX: number, fromY: number, toX: number, toY: number, vertical: boolean): number;
    /**
     * 官方 `Link.addOrthoPoints(startFrom, fromDir, endTo, toDir, fromnode, tonode)`。
     * 逐分支转译自 go-debug.js 778104..784083（含 fA/sA/nA 路由状态与尾部两点追加）。
     */
    addOrthoPoints(startFrom: Point, fromDir: number, endTo: Point, toDir: number, fromnode: Node, tonode: Node): void;
    /** 官方 Link 路由状态字段：fA=toDir 被吸附, sA=fromDir 吸附值, nA=toDir 吸附值 */
    private _fA;
    private _sA;
    private _nA;
    /** 官方 `Link.invalidateOtherJumpOvers(bounds)`（本项目不做 jump 几何缓存，仅让同批 JumpOver/Gap 失效） */
    invalidateOtherJumpOvers(bounds: Rect): void;
    copy(): Link;
}

/**
 * Node - a Part that can be connected by Links.
 * Represents a vertex in the graph structure.
 */
declare class Node extends Part {
    static readonly className: string;
    /** 官方 `Node.SpreadingNone`（PortSpreading.None = 0） */
    static SpreadingNone: number;
    /** 官方 `Node.SpreadingEvenly`（PortSpreading.Evenly = 1，默认） */
    static SpreadingEvenly: number;
    /** 官方 `Node.SpreadingPacked`（PortSpreading.Packed = 2） */
    static SpreadingPacked: number;
    /** 官方 `Margin.xT` —— `Node.avoidableMargin` 的默认值 */
    private static readonly _defaultAvoidableMargin;
    protected _isTreeExpanded: boolean;
    protected _wasTreeExpanded: boolean;
    protected _isSubGraphExpanded: boolean;
    protected _treeExpandedDirection: EnumValue;
    private _avoidable;
    private _avoidableMargin;
    private _portSpreading;
    private _labeledLink;
    private _linkConnected;
    private _linkDisconnected;
    private _linkValidation;
    private _treeExpandedChanged;
    constructor(type?: any, init?: any);
    get isTreeExpanded(): boolean;
    set isTreeExpanded(val: boolean);
    get wasTreeExpanded(): boolean;
    set wasTreeExpanded(val: boolean);
    /** For compatibility with Group */
    get isSubGraphExpanded(): boolean;
    set isSubGraphExpanded(val: boolean);
    get treeExpandedDirection(): EnumValue;
    set treeExpandedDirection(val: EnumValue);
    /**
     * 官方 `Node.isTreeLeaf`（go.d.ts:24089 同时声明了 get 和 set）。
     * 官方把它当**存储字段**维护：模板里写 `isTreeLeaf: false` 会直接落到实例上，
     * 连接/断开 tree link 时再增量更新。
     * 本项目没有那套增量维护，所以默认回落到「按子节点动态算」；
     * 一旦样例显式 set 过，就以 set 的值为准。
     * 以前这里只有 getter，样例 `new go.Node('Spot', { isTreeLeaf: false })`
     * 会在 `GraphObject.set` 里抛 `which has only a getter`
     * （实测 OverviewResizing / incrementalTree 直接崩）。
     */
    private _isTreeLeafOverride;
    get isTreeLeaf(): boolean;
    set isTreeLeaf(val: boolean);
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
    /** 官方 `Node.linksConnected`：与本节点相连的 Link 迭代器 */
    get linksConnected(): Iterator<Link>;
    /** 官方 `Node.portSpreading`（默认 PortSpreading.Evenly） */
    get portSpreading(): number;
    set portSpreading(val: number);
    /** 官方 `Node.avoidable`（默认 true，参与 AvoidsNodes 路由的避让） */
    get avoidable(): boolean;
    set avoidable(val: boolean);
    /** 官方 `Node.avoidableMargin`（默认 Margin(2,2,2,2)，接受 number） */
    get avoidableMargin(): Margin;
    set avoidableMargin(val: Margin | number);
    /** 官方 `Node.canAvoid()` */
    canAvoid(): boolean;
    /** 官方 `Node.getAvoidableRect(result)`：actualBounds 外扩 avoidableMargin */
    getAvoidableRect(result: Rect): Rect;
    /** 官方 `Node.findVisibleNode()`：沿 containingGroup 向上找到第一个可见的 */
    findVisibleNode(): Node | null;
    /** 官方 `Node.findVisiblePort(obj)` */
    findVisiblePort(obj: GraphObject | null): GraphObject;
    /**
     * 官方 `Node.findPort(pid)`：按 portId 查找端口，找不到时回退 `''`，再回退本节点。
     * 官方有 ports 缓存（pe），本项目每次重建视觉树（偏差：无缓存）。
     */
    findPort(pid: string): GraphObject;
    /** 官方 `Node.port` === `findPort("")` */
    get port(): GraphObject;
    /** 官方 `Node.ports`：全部命名端口的迭代器（无命名端口时只有本节点） */
    get ports(): Iterator<GraphObject>;
    private _collectPorts;
    /** 官方 `Node.isLinkLabel` */
    get isLinkLabel(): boolean;
    /** 官方 `Node.labeledLink` */
    get labeledLink(): Link | null;
    set labeledLink(val: Link | null);
    /** 官方 `Node.linkConnected` */
    get linkConnected(): ((node: Node, link: Link, port: any) => void) | null;
    set linkConnected(val: ((node: Node, link: Link, port: any) => void) | null);
    /** 官方 `Node.linkDisconnected` */
    get linkDisconnected(): ((node: Node, link: Link, port: any) => void) | null;
    set linkDisconnected(val: ((node: Node, link: Link, port: any) => void) | null);
    /** 官方 `Node.linkValidation` */
    get linkValidation(): ((node1: any, port1: any, node2: any, port2: any, link: Link | null) => boolean) | null;
    set linkValidation(val: ((node1: any, port1: any, node2: any, port2: any, link: Link | null) => boolean) | null);
    /** 官方 `Node.treeExpandedChanged` */
    get treeExpandedChanged(): ((node: Node) => void) | null;
    set treeExpandedChanged(val: ((node: Node) => void) | null);
    /** 官方 `Node.isTreeRoot`：没有指向自己的树链接即为根 */
    get isTreeRoot(): boolean;
    /** 官方 `Node.invalidateConnectedLinks(newkeys?, oldport?)` */
    invalidateConnectedLinks(newkeys?: Set<any> | null, oldport?: GraphObject | null): void;
    /**
     * 官方 `Node.invalidateLinkBundle(othernode, pid?, otherpid?)`：
     * 官方在 link bundles 里找到同端口对的 bundle 并置脏。
     * 本项目没有 link bundle 语义（偏差：保留签名，无操作）。
     */
    invalidateLinkBundle(_othernode?: Node | null, _pid?: string | null, _otherpid?: string | null): void;
    /** 官方 `Node.findLinksBetween(othernode, pid?, otherpid?)` */
    findLinksBetween(othernode: Node, pid?: string | null, otherpid?: string | null): Iterator<Link>;
    /** 官方 `Node.findLinksTo(othernode, pid?, otherpid?)` */
    findLinksTo(othernode: Node, pid?: string | null, otherpid?: string | null): Iterator<Link>;
    /** 官方 `Node.findSuccessorParts(newset?)`：沿出边可达的全部 Part（不含自身） */
    findSuccessorParts(newset?: Set<any>): Set<any>;
    private _collectSuccessorParts;
    /** 官方 `Node.findPredecessorParts(newset?)`：沿入边可达的全部 Part（不含自身） */
    findPredecessorParts(newset?: Set<any>): Set<any>;
    private _collectPredecessorParts;
    /**
     * 官方 `Node.findTreeParts(level?, newset?)`：
     * 从本节点沿**路径方向**（isTreePathToChildren ? 出边 : 入边）逐层收集节点与其链接，
     * level=1 只收集自身；level=2 再收集直接相邻的链接与邻居节点。
     */
    findTreeParts(level?: number, newset?: Set<any>): Set<any>;
    private _collectTreeParts;
    /** 官方 `Node.findTreeParentChain(newset?)`：自身 + 父链接 + 父节点…（带环保护） */
    findTreeParentChain(newset?: Set<any>): Set<any>;
    private _collectTreeParentChain;
    /** 官方 `Node.findTreeChildrenLinks()`：沿路径方向的子树链接 */
    findTreeChildrenLinks(): Iterator<Link>;
    /** 官方 `Node.findTreeLevel()`：父链上的节点数 */
    findTreeLevel(): number;
    /**
     * 官方 `Node.findTreeRoot()`：沿树链接向上走到根。
     * 官方逐条检查 `ai`（链接插入顺序）并排除 `this` 作为候选父节点，本项目按同样规则实现。
     */
    findTreeRoot(): Node;
    /** 官方 `Node.findCommonTreeParent(other)` */
    findCommonTreeParent(other: Node): Node | null;
    /** 官方 `Node.findExternalTreeLinksConnected()`：子树范围外的链接 */
    findExternalTreeLinksConnected(): Iterator<Link>;
    private _collectExternalTreeLinks;
    /**
     * 官方 `Node.collapseTree(level=1)`：把子树内节点的 isTreeExpanded 置为 false。
     * 偏差：本项目 `Part.isVisible()` 不受 isTreeExpanded 影响，也无 `diagram.isCollapsingExpanding`
     * 事务标记，因此这里只做状态位的递归更新，不改变可见性/不触发布局事务。
     */
    collapseTree(level?: number): void;
    private _collapseTreeWalk;
    /**
     * 官方 `Node.expandTree(level=2)`：把子树内节点的 isTreeExpanded 置为 true。
     * 偏差说明同 `collapseTree`。
     */
    expandTree(level?: number): void;
    private _expandTreeWalk;
    /** 官方 `Diagram.isTreePathToChildren`（默认 true） */
    private _isTreePathToChildren;
    /** Create a copy of this Node */
    copy(): Node;
}

/**
 * Layer - 图层
 * 控制绘制顺序和可见性
 *
 * 对照 `go.d.ts` 的 `export class Layer`（10441 行起）。
 * 偏差：官方 Layer 内部维护一个 Quadtree（`Hr`）做空间索引，
 * 本项目直接按 `parts` 反向顺序线性扫描，结果语义一致、仅性能不同。
 */
declare class Layer {
    static readonly className: string;
    private _name;
    private _opacity;
    private _visible;
    private _isTemporary;
    private _isViewportAligned;
    private _isInDocumentBounds;
    private _pickable;
    private _allowCopy;
    private _allowDelete;
    private _allowTextEdit;
    private _allowGroup;
    private _allowUngroup;
    private _allowLink;
    private _allowRelink;
    private _allowMove;
    private _allowReshape;
    private _allowResize;
    private _allowRotate;
    private _allowSelect;
    /** Z 序（本项目扩展，官方无此属性） */
    zIndex: number;
    /** 所属 Diagram */
    private _diagram;
    /** 图层中的 Part 集合 */
    private _parts;
    constructor(init?: Partial<Layer>);
    /** 官方 Layer 的属性变更通知（`Diagram.raiseChangedEvent(ChangedEvent.Property, ...)`） */
    private _raiseChanged;
    /**
     * 官方 `Layer.findObjectAt(p, navig, pred)`（go.d.ts:10461）。
     * `p` 是**文档坐标**；`navig` 把命中的对象映射成结果类型，`pred` 再过滤。
     */
    findObjectAt<T extends GraphObject>(p: Point, navig?: ((a: GraphObject) => (T | null)) | null, pred?: ((a: T) => boolean) | null): T | null;
    /** 官方 `Layer.findObjectsAt(p, navig, pred, coll)`（go.d.ts:10480）。 */
    findObjectsAt<T extends GraphObject, S extends List<T> | Set<T> = Set<T>>(p: Point, navig?: ((a: GraphObject) => (T | null)) | null, pred?: ((a: T) => boolean) | null, coll?: S): S;
    /** 官方 `Layer.findObjectsIn(r, navig, pred, partialInclusion, coll)`（go.d.ts:10499）。 */
    findObjectsIn<T extends GraphObject, S extends List<T> | Set<T> = Set<T>>(r: Rect, navig?: ((a: GraphObject) => (T | null)) | null, pred?: ((a: T) => boolean) | null, partialInclusion?: boolean, coll?: S): S;
    /** 官方 `Layer.findObjectsNear(p, dist, navig, pred, partialInclusion, coll)`（go.d.ts:10522）。 */
    findObjectsNear<T extends GraphObject, S extends List<T> | Set<T> = Set<T>>(p: Point, dist: number, navig?: ((a: GraphObject) => (T | null)) | null, pred?: ((a: T) => boolean) | null, partialInclusion?: boolean | S, coll?: S): S;
    /** 生成官方 `navig → pred → coll.add` 的回调。 */
    private static _collector;
    get parts(): Iterator<Part>;
    get partsBackwards(): Iterator<Part>;
    get partsCount(): number;
    get diagram(): any;
    set diagram(val: any);
    get name(): string;
    set name(val: string);
    get opacity(): number;
    set opacity(val: number);
    get isViewportAligned(): boolean;
    set isViewportAligned(val: boolean);
    get isTemporary(): boolean;
    set isTemporary(val: boolean);
    get visible(): boolean;
    set visible(val: boolean);
    get pickable(): boolean;
    set pickable(val: boolean);
    get isInDocumentBounds(): boolean;
    set isInDocumentBounds(val: boolean);
    get allowCopy(): boolean;
    set allowCopy(val: boolean);
    get allowDelete(): boolean;
    set allowDelete(val: boolean);
    get allowTextEdit(): boolean;
    set allowTextEdit(val: boolean);
    get allowGroup(): boolean;
    set allowGroup(val: boolean);
    get allowUngroup(): boolean;
    set allowUngroup(val: boolean);
    get allowLink(): boolean;
    set allowLink(val: boolean);
    get allowRelink(): boolean;
    set allowRelink(val: boolean);
    get allowMove(): boolean;
    set allowMove(val: boolean);
    get allowReshape(): boolean;
    set allowReshape(val: boolean);
    get allowResize(): boolean;
    set allowResize(val: boolean);
    get allowRotate(): boolean;
    set allowRotate(val: boolean);
    get allowSelect(): boolean;
    set allowSelect(val: boolean);
    /**
     * 官方 `Layer.toString(details?: number)`（运行时实现，go.d.ts 未声明）。
     * `details <= 0` → `Layer "<name>"`；`> 0` 追加计数；`> 1` 再逐个列出 Part。
     */
    toString(details?: number): string;
    /** 添加 Part */
    add(part: any): void;
    /** 移除 Part */
    remove(part: any): boolean;
    /** 清空 */
    clear(): void;
    /** 是否包含 Part */
    contains(part: any): boolean;
}

declare class Picture extends GraphObject {
    static readonly className: string;
    static None: EnumValue;
    static Fill: EnumValue;
    static Uniform: EnumValue;
    static UniformToFill: EnumValue;
    /**
     * 官方 `Picture.clearCache(url?)`：清空官方内部按 url 缓存的图片对象。
     * 不传 url 就清空整个缓存。
     */
    static clearCache(url?: string): void;
    /** 按 url 共享的 HTMLImageElement 缓存（官方内部也是这么做的） */
    private static _imageCache;
    private _source;
    private _image;
    private _loadedImage;
    /** source 直接是 <canvas>/<img>/<video> 元素时的可绘制对象（官方 4.x 支持）。 */
    private _canvasSource;
    private _imageStretch;
    private _imageAlignment;
    private _sourceRect;
    private _errorFunction;
    private _successFunction;
    private _sourceCrossOrigin;
    private _crossOrigin;
    constructor(source?: string | Partial<Picture>, init?: Partial<Picture>);
    get source(): string;
    set source(val: string);
    /**
     * 官方 4.x 的 `Picture.element`：直接给一个 <canvas>/<img>/<video> 元素来绘制
     * （canvases 样例用 Chart.js 画到 canvas 上再 `.bind('element', 'datasets', fn)`）。
     * 官方只接受 Image/Canvas/Video 三种，其他类型直接报错。
     */
    get element(): HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null;
    set element(val: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null);
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
    get successFunction(): ((pic: Picture, e: Event) => void) | null;
    set successFunction(val: ((pic: Picture, e: Event) => void) | null);
    get sourceCrossOrigin(): ((pic: Picture) => string) | null;
    set sourceCrossOrigin(val: ((pic: Picture) => string) | null);
    get crossOrigin(): string | null;
    set crossOrigin(val: string | null);
    /** 官方 `Picture.reloadSource()`：强制按当前 `source` 重新下载图片。 */
    reloadSource(): void;
    /** 官方 `Picture.redraw()`：图片内容已变化但尺寸不变时，只触发重绘。 */
    redraw(): void;
    private _loadImage;
    private _onImageLoad;
    private _onImageError;
    _measure(widthConstraint: number, heightConstraint: number): void;
    copy(): Picture;
}

/**
 * CanvasRenderer - Canvas 2D rendering engine for the Open-GoJS diagramming library.
 * Draws GraphObject hierarchies onto an HTML5 Canvas.
 */
declare class CanvasRenderer {
    static readonly className: string;
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
    /** Render any GraphObject by dispatching to the appropriate handler */
    renderGraphObject(obj: GraphObject, offsetX: number, offsetY: number): void;
    /** Render a Panel and its children */
    renderPanel(panel: Panel, offsetX: number, offsetY: number): void;
    /** Render a Shape */
    renderShape(shape: Shape, offsetX: number, offsetY: number, paintBox?: Rect | null): void;
    /** Render a TextBlock */
    renderTextBlock(tb: TextBlock, offsetX: number, offsetY: number): void;
    /** Render a Picture (stub - image loading not yet implemented) */
    renderPicture(pic: Picture, offsetX: number, offsetY: number): void;
    /**
     * 官方 PanelLayoutGrid.$i/g3：在 panel 自然边界内裁剪，逐元素按 interval 画网格线。
     * 坐标为文档坐标（panelX/panelY = 面板左上角文档位置），线位置 = panelX + F·cell + origin。
     */
    renderGrid(panel: Panel, panelX: number, panelY: number): void;
    /** 官方 PanelLayoutGrid.pS：interval/segmentIndex 判定 + 同向更大 interval 覆盖时跳过 */
    private _gridLinePass;
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
    /**
     * 开一条新路径并画单个 figure。
     *
     * 官方 Geometry（type 4）是**逐 figure** 提交的：`... endPath(p)` 里的 `p` 就是
     * figure 序号，所以「填不填」是按 figure 自己判定的。本项目以前把整个 geometry
     * 当成一条路径统一 fill，导致 `PathFigure(..., false)` 的图形（CircleLine、
     * Curve1/2、AsteriskLine、Terminator…）被涂色，与官方差一大片。
     */
    private _drawFigure;
    /** 把单个 figure 的线段追加到当前路径（不 beginPath） */
    private _drawFigureSegments;
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
 * InputEvent - 输入事件
 * 封装鼠标/键盘/触摸事件信息
 */
declare class InputEvent {
    static readonly className: string;
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
    /**
     * 官方 InputEvent.bubbles
     * 当 InputEvent 作用于某个 GraphObject 并向其父级 Panel 冒泡时是否被处理。
     */
    bubbles: boolean;
    /**
     * 官方 InputEvent.targetObject（官方类型为 GraphObject | null）
     * 此处用 any 以避免与 view 层产生循环依赖。
     */
    targetObject: any;
    /**
     * 官方 InputEvent.event（本项目内部字段名为 nativeEvent）。
     */
    get event(): Event | null;
    set event(value: Event | null);
    /**
     * 官方 InputEvent.isTouchEvent
     * 是否为触摸事件。
     */
    get isTouchEvent(): boolean;
    /**
     * 官方 InputEvent.left
     * 逻辑左键是否被按住。
     * 若为 mousedown/mouseup 事件，使用 button；否则使用 buttons 的第 0 位。
     */
    get left(): boolean;
    set left(value: boolean);
    /** 官方 InputEvent.down —— 逻辑主键是否为按下状态。 */
    down: boolean;
    /** 官方 InputEvent.up —— 逻辑主键是否处于抬起状态。 */
    up: boolean;
}

declare class ClickSelectingTool extends Tool {
    static readonly className: string;
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
    static readonly className: string;
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
    get copiedParts(): Map$1<Part, Point> | null;
    set copiedParts(val: Map$1<Part, Point> | null);
    get draggedParts(): Map$1<Part, Point> | null;
    set draggedParts(val: Map$1<Part, Point> | null);
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
    static readonly className: string;
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
    static readonly className: string;
    private _portProperty;
    private _targetPort;
    private _isForwardsOnly;
    private _isBackwardsOnly;
    private _linkValidation;
    private _portValidation;
    private _temporaryLink;
    private _temporaryFromNode;
    private _temporaryFromPort;
    private _temporaryToNode;
    private _temporaryToPort;
    private _portGravity;
    private _isUnconnectedLinkValid;
    private _linkingCursor;
    /**
     * 对齐官方 `LinkingBaseTool` 构造（go.js 里 `this.zS=new Link({layerName:"Tool"})…`）。
     * 本项目以前只在构造函数里造了一个灰线 `temporaryLink`，
     * `temporaryFromPort` / `temporaryToPort` 一直是 `null`，
     * 于是样例里 `linkingTool.temporaryFromPort.opacity = 0` 直接
     * `Cannot set properties of null (setting 'opacity')`（实测 leaflet）。
     */
    constructor();
    get portGravity(): number;
    set portGravity(val: number);
    get isUnconnectedLinkValid(): boolean;
    set isUnconnectedLinkValid(val: boolean);
    get linkingCursor(): string;
    set linkingCursor(val: string);
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
    get temporaryFromNode(): Node | null;
    set temporaryFromNode(val: Node | null);
    get temporaryToPort(): GraphObject | null;
    set temporaryToPort(val: GraphObject | null);
    get temporaryToNode(): Node | null;
    set temporaryToNode(val: Node | null);
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
    static readonly className: string;
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
    static readonly className: string;
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
    static readonly className: string;
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
    static readonly className: string;
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
    static readonly className: string;
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

/**
 * PanningTool - pans the viewport by dragging.
 * The user drags to scroll the diagram viewport.
 */
declare class PanningTool extends Tool {
    static readonly className: string;
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

declare class Placeholder extends GraphObject {
    static readonly className: string;
    /** 官方 Placeholder.padding：number 或 Margin（官方 setter 把 number 归一成 Margin） */
    private _padding;
    constructor(init?: Placeholder);
    get padding(): number | Margin;
    set padding(val: number | Margin);
    /** padding 的四边值（number 四边均匀；Margin 按 top/right/bottom/left） */
    private _padSides;
    get _placeholderBounds(): Rect;
    /**
     * 官方 `Placeholder.computeMemberBounds(result)`：把所属 Group 的可见成员并集写入 `result`（原地修改并返回）。
     * - 跳过不可见成员；Link 仅在 `Group.computesBoundsIncludingLinks` 时计入，且端点为本 Group 的 Link 不计入；
     * - 无有效成员 → `result = (group.location.x, group.location.y, 0, 0)`。
     */
    computeMemberBounds(result: Rect): Rect;
    /**
     * 官方 `Placeholder.computeBorder(result)`：成员并集再按 `padding`（Margin）外扩，写入 `result`。
     * - 子图折叠（`!isSubGraphExpanded`）时宽高为 0；
     * - `Group.computesBoundsIncludingLocation` 且 group.location 有效时，把 location 并入边界。
     */
    computeBorder(result: Rect): Rect;
    /**
     * 官方 Placeholder.measure（computeBorder）：
     * 1) union 可见成员的 actualBounds（文档坐标，成员 ab 实值才计入；跳过 Link）；
     * 2) 无成员 union → border = group.location 实值点 (0×0)，否则 (0,0)；
     * 3) padding（number = 四边均匀）外扩；
     * 4) measuredBounds = (0,0,max(borderW,minW),max(borderH,minH))；
     * 5) 有成员 union 且 border x/y 实值 → group.location = border 按 group.locationSpot 锚点。
     */
    _measure(availW: number, availH: number): void;
    _arrange(bounds: Rect): void;
    private _findGroup;
    copy(): Placeholder;
}

/**
 * Adornment - 装饰
 * 用于选择手柄、工具提示、上下文菜单等
 */
declare class Adornment extends Part {
    static readonly className: string;
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
    /**
     * 官方 `Adornment.placeholder`：本 Adornment 面板树中第一个 Placeholder。
     * 官方缓存在内部字段（`vt`），本项目按需递归查找。
     */
    get placeholder(): Placeholder | null;
    private static _findPlaceholder;
    hasPlaceholder(): boolean;
    copy(): Adornment;
}

/**
 * ContextMenuTool - shows context menus on right-click.
 * Displays the context menu for the object under the mouse.
 */
declare class ContextMenuTool extends Tool {
    static readonly className: string;
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
    static readonly className: string;
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
    static readonly className: string;
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
    static readonly className: string;
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
    get mouseDownTools(): List<Tool>;
    set mouseDownTools(val: List<Tool> | Tool[] | Iterable<Tool>);
    get mouseMoveTools(): List<Tool>;
    set mouseMoveTools(val: List<Tool> | Tool[] | Iterable<Tool>);
    get mouseUpTools(): List<Tool>;
    set mouseUpTools(val: List<Tool> | Tool[] | Iterable<Tool>);
    get mouseHoverTools(): List<Tool>;
    set mouseHoverTools(val: List<Tool> | Tool[] | Iterable<Tool>);
    get currentTool(): Tool | null;
    set currentTool(val: Tool | null);
    get defaultTool(): Tool;
    set defaultTool(val: Tool);
    /**
     * 官方 ToolManager 暴露的每个内置工具实例都能被样例拿到，
     * 不管它被放进哪张工具表 —— 样例大量写
     * `myDiagram.toolManager.clickSelectingTool.standardMouseSelect = fn`、
     * `myDiagram.toolManager.textEditingTool.acceptText = fn`。
     * 以前每个 getter 只在**某一张**表里找（`clickSelectingTool` 找 mouseDownTools、
     * `textEditingTool` 找 mouseDownTools），找不到就返回 undefined，
     * 样例赋值时直接 `Cannot set properties of undefined`（实测 distances / audioEditor）。
     * 这里三张表全查。
     */
    private _toolOfType;
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
    /**
     * 必须显式再声明一次 getter：子类里只写 `set diagram` 会**遮蔽**
     * 父类 `Tool` 的 getter —— JS 访问器描述符里 `get` 会变成 undefined，
     * `this.diagram` 直接返回 undefined，于是 `doMouseDown/doMouseUp/...`
     * 全部在第一行 `if (!diagram) return;` 处早退，整个 ToolManager 失效。
     */
    get diagram(): Diagram | null;
    set diagram(val: Diagram | null);
    /**
     * 样例通常在 Diagram 构建完之后才往三个工具表里 `add`/`insertAt` 新工具，
     * 这些后加的工具既没有 `toolManager` 也没有 `diagram`。
     * 在每次事件分发前统一补齐，避免 `this.diagram` 取到 null。
     */
    private _syncTools;
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
    /**
     * Update adornments for all relevant parts.
     * 对齐官方 `Diagram.selectCollection`：
     *   `mouseDownTools.each(i => { i.isEnabled && i.updateAdornments(part) })`
     */
    updateAdornments(part: any): void;
    /** Standard mouse wheel: zoom in/out centered on mouse position. */
    standardMouseWheel(): void;
    static WheelScroll: EnumValue;
    static WheelZoom: EnumValue;
    static WheelNone: EnumValue;
    static GestureZoom: EnumValue;
    static GestureCancel: EnumValue;
    static GestureNone: EnumValue;
    private _mouseWheelBehavior;
    private _gestureBehavior;
    private _dragSize;
    private _toolTipDuration;
    private _toolTipTimer;
    private _currentToolTip;
    private _toolTipAdornment;
    get mouseWheelBehavior(): any;
    set mouseWheelBehavior(val: any);
    get gestureBehavior(): any;
    set gestureBehavior(val: any);
    get toolTipDuration(): number;
    set toolTipDuration(val: number);
    get dragSize(): Size;
    set dragSize(val: Size);
    get currentToolTip(): any;
    set currentToolTip(val: any);
    initializeStandardTools(): this;
    findTool(name: string): Tool | null;
    private _findToolIn;
    replaceTool(name: string, newtool: Tool | null): Tool | null;
    private _replaceToolIn;
    replaceStandardTool(name: string, newtool: Tool | null, list: List<Tool>): void;
    showToolTip(toolTip: any, obj?: GraphObject | null): void;
    positionToolTip(toolTip: any, obj?: GraphObject | null): void;
    extendToolTip(duration?: number): void;
    hideToolTip(): void;
    doToolTip(): void;
    doMouseHover(): void;
}

/**
 * CommandHandler - handles keyboard and programmatic commands for a Diagram.
 * Provides canXxx() and doXxx() methods for each supported command.
 */

declare class CommandHandler {
    static readonly className: string;
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
    private _memberValidation;
    /** 官方 `CommandHandler.memberValidation`（默认 null） */
    get memberValidation(): ((group: any, part: any) => boolean) | null;
    set memberValidation(val: ((group: any, part: any) => boolean) | null);
    /**
     * 官方 `CommandHandler.isValidMember(group, part)`。
     * group 为 null 时跳过 group 侧校验（Node.isValidMember/GraphLinksModel.isValidLink 同源语义）。
     */
    isValidMember(group: any, part: any): boolean;
    private static _modifierNames;
    static getModifierNames(): Array<string>;
    static setModifierNames(names: Array<string>): void;
    private _copiesConnectedLinks;
    private _deletesConnectedLinks;
    private _copiesTree;
    private _deletesTree;
    private _copiesParentKey;
    private _copiesGroupKey;
    private _copiesClipboardData;
    private _storageLocation;
    private _archetypeGroupData;
    private _zoomFactor;
    private _isZoomToFitRestoreEnabled;
    private _defaultScale;
    get copiesConnectedLinks(): boolean;
    set copiesConnectedLinks(val: boolean);
    get deletesConnectedLinks(): boolean;
    set deletesConnectedLinks(val: boolean);
    get copiesTree(): boolean;
    set copiesTree(val: boolean);
    get deletesTree(): boolean;
    set deletesTree(val: boolean);
    get copiesParentKey(): boolean;
    set copiesParentKey(val: boolean);
    get copiesGroupKey(): boolean;
    set copiesGroupKey(val: boolean);
    get copiesClipboardData(): boolean;
    set copiesClipboardData(val: boolean);
    get storageLocation(): 'memory' | 'sessionStorage' | 'localStorage' | 'systemClipboard';
    set storageLocation(val: 'memory' | 'sessionStorage' | 'localStorage' | 'systemClipboard');
    get archetypeGroupData(): any;
    set archetypeGroupData(val: any);
    get zoomFactor(): number;
    set zoomFactor(val: number);
    get isZoomToFitRestoreEnabled(): boolean;
    set isZoomToFitRestoreEnabled(val: boolean);
    get defaultScale(): number;
    set defaultScale(val: number);
    doStart(): void;
    doStop(): void;
    canCopySelection(): boolean;
    canCutSelection(): boolean;
    canPasteSelection(pos?: Point): boolean;
    pasteSelectionAsync(pos?: Point): void;
    /**
     * 计算给定 Part 集合中实际要移动/拷贝的集合。
     * 返回 Map<Part, {point}>。这里复用 Diagram 的连通/组内/树扩展能力（若存在），否则退化为原集合。
     */
    computeEffectiveCollection(parts: Iterable<any>, options?: any): Map$1<any, any>;
    copyToClipboard(coll: any): void;
    pasteFromClipboard(): any;
    canDecreaseZoom(factor?: number): boolean;
    decreaseZoom(factor?: number): void;
    canIncreaseZoom(factor?: number): boolean;
    increaseZoom(factor?: number): void;
    canResetZoom(newscale?: number): boolean;
    resetZoom(newscale?: number): void;
    canScrollToPart(part?: any): boolean;
    private _scrollToPartPause;
    get scrollToPartPause(): number;
    set scrollToPartPause(val: number);
    scrollToPart(part?: any): void;
    canEditTextBlock(textblock?: any): boolean;
    editTextBlock(textblock?: any): void;
    canShowContextMenu(obj?: any): boolean;
    showContextMenu(obj?: any): void;
    canStopCommand(): boolean;
    stopCommand(): void;
    canDownloadSvg(options?: any): boolean;
    downloadSVG(options?: any): void;
    downloadSvg(options?: any): void;
    private _downloadData;
    addTopLevelParts(coll: any, check?: boolean): boolean;
    toString(): string;
    private _isFocusEnabled;
    private _focusBox;
    private _focus;
    private _focusChanged;
    private _liveElementId;
    private _isUsingAriaLive;
    private _isVirtualPointerEnabled;
    private _isVirtualPointerShown;
    private _virtualPointerBox;
    private _virtualPointerChanged;
    private _virtualPointerLocation;
    private _isVirtualPointerDown;
    private _virtualPointerShiftMove;
    private _virtualPointerControlMove;
    private _nextFocusFormula;
    get isFocusEnabled(): boolean;
    set isFocusEnabled(enabled: boolean);
    get focusBox(): any;
    set focusBox(adornment: any);
    get focus(): any;
    set focus(obj: any);
    get focusChanged(): ((oldobj: any, newobj: any, cmd: any) => void) | null;
    set focusChanged(value: ((oldobj: any, newobj: any, cmd: any) => void) | null);
    get liveElementId(): string;
    set liveElementId(val: string);
    get isUsingAriaLive(): boolean;
    set isUsingAriaLive(val: boolean);
    onFocusChanged(oldobj: any, newobj: any): void;
    private static _liveCounter;
    describe(oldobj: any, newobj: any): string;
    updateFocusBox(): void;
    findFirstFocus(): any;
    findNextFocus(dir: number): any;
    get nextFocusFormula(): string;
    set nextFocusFormula(val: string);
    get isVirtualPointerEnabled(): boolean;
    set isVirtualPointerEnabled(enabled: boolean);
    get isVirtualPointerShown(): boolean;
    set isVirtualPointerShown(value: boolean);
    get isVirtualPointerDown(): boolean;
    set isVirtualPointerDown(value: boolean);
    get virtualPointerLocation(): Point;
    set virtualPointerLocation(pt: Point);
    get virtualPointerBox(): any;
    set virtualPointerBox(part: any);
    get virtualPointerChanged(): ((box: any, cmd: any) => void) | null;
    set virtualPointerChanged(value: ((box: any, cmd: any) => void) | null);
    get virtualPointerShiftMove(): number;
    set virtualPointerShiftMove(value: number);
    get virtualPointerControlMove(): number;
    set virtualPointerControlMove(value: number);
    cancelVirtualPointer(): void;
    updateVirtualPointer(): void;
    doVirtualPointerEvent(e: InputEvent, act: boolean): void;
    protected onVirtualPointerEvent(e: InputEvent, act: boolean): void;
    doVirtualFocusKeyDown(): boolean;
    doVirtualFocusKeyUp(): boolean;
    doKeyUp(): void;
}

declare class Animation {
    static readonly className: string;
    static EaseLinear(t: number): number;
    static EaseInOut(t: number): number;
    static EaseIn(t: number): number;
    static EaseOut(t: number): number;
    static EaseInOutQuad(t: number): number;
    static EaseInQuad(t: number): number;
    static EaseOutQuad(t: number): number;
    static EaseInExpo(t: number): number;
    static EaseOutExpo(t: number): number;
    private _isRunning;
    private _duration;
    private _easing;
    private _reversible;
    /** 官方 `Animation.runCount`：跑几遍；Infinity 表示无限循环（belts 的传送带就是它） */
    private _runCount;
    private _isViewportUnconstrained;
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
    get runCount(): number;
    set runCount(val: number);
    get isViewportUnconstrained(): boolean;
    set isViewportUnconstrained(val: boolean);
    get state(): string;
    get manager(): any;
    set manager(val: any);
    get finished(): (() => void) | null;
    set finished(val: (() => void) | null);
    /**
     * 官方 `Animation.add(obj, effectName, startValue, endValue, cosmetic?): this`
     * （链式返回）。`from` 为 undefined 时用对象当前值当起点。
     */
    add(targetOrConfig: object | AnimationConfig, property?: string, fromValue?: any, toValue?: any): this;
    clear(): void;
    /** 官方 `Animation.start(): this` —— 自己找到目标对象的 Diagram，取它的 animationManager 注册自己 */
    start(): this;
    stop(): this;
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
    static readonly className: string;
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
    /** 官方对应 `AnimationManager` 内部把动画从活动列表里摘掉的动作（go.js 里是 `oO` 的反向） */
    unregisterAnimation(anim: Animation): void;
    /** 官方 `AnimationManager.activeAnimations: Set<Animation>` */
    get activeAnimations(): Set<Animation>;
    /** 官方 `AnimationManager.defineAnimationEffect(effectName, animationFunction)`（静态） */
    static defineAnimationEffect(name: string, effect: (obj: object, from: any, to: any, duration: number) => Animation): void;
    static getEffect(name: string): ((obj: object, from: any, to: any, duration: number) => Animation) | undefined;
    updateAnimation(): void;
    private _startTicking;
    private _stopTicking;
    private _tick;
    private static _effects;
}

/** 官方 ThemeManager：内置 light/dark 主题（Themes.Light / Themes.Dark），findValue 按目标属性类别取值 */
declare class ThemeManager {
    static readonly className: string;
    private _diagram;
    private _themes;
    private _currentTheme;
    private _defaultTheme;
    /** 官方 ThemeManager.changesDivBackground —— go.js 里初值是 `UP=!1`，即**默认 false**。
     *  之前设成 true 会强行用主题 colors.div 覆盖样例 htmlContent 自带的 div 底色，
     *  arrowheads/orgChartStatic/connectionBoxNode 的 diff 直接从 5%/9%/17% 飙到 98%/63%/94%。 */
    private _changesDivBackground;
    constructor();
    get diagram(): any;
    set diagram(val: any);
    get currentTheme(): string;
    set currentTheme(val: string);
    get changesDivBackground(): boolean;
    set changesDivBackground(val: boolean);
    get defaultTheme(): string;
    set defaultTheme(val: string);
    /** 官方 ThemeManager.themeMap: Map<string, Theme> */
    get themeMap(): Map$1<string, any>;
    set themeMap(val: Map$1<string, any>);
    /** 官方 findTheme(themeName): Theme | null */
    findTheme(themeName: string): any;
    /**
     * 官方 `ThemeManager.set(themeName, props): this`
     * （go.js：`set(t,e){t===""&&(t=this.IP); t==="system"&&(t=this.um); …}`）
     * - `''` 表示「当前默认主题」，不是新建一个空名主题；
     * - 已存在的主题按类别（colors/fonts/numbers/…）**浅合并**，只覆盖给出的键；
     * - 返回 this。
     * 以前我们是整体替换且不处理 `''`，icons 样例
     * `themeManager.set('', {colors:{div:'#6495ED',…}})` 之后
     * `changesDivBackground = true` 取到的还是 light 的 `#fff`，整块底色不对。
     */
    set(themeName: string, themeData: any): this;
    private static _mergeTheme;
    private _applyTheme;
    findColor(colorName: string, themeName?: string): string;
    /**
     * 官方 ThemeManager.findValue(key, path, targetProperty)：
     * 先按目标属性查类别（stroke/fill→colors、font→fonts…），再在 currentTheme → defaultTheme 里取值。
     */
    findValue(sourceKey: string, path: string | null, targetProperty: string): any;
    /**
     * 官方 `Diagram.setDivBackground(color)`：把主题的 `colors.div` 写到 div 的
     * background-color 上。官方 `ThemeManager.changesDivBackground`（默认 true）
     * 会在 addDiagram / currentTheme 变化时对所有注册图调用它。
     * 以前本项目没有这一步，于是 icons 样例整块底色是白的（官方是主题的 div 色）。
     */
    static applyDivBackground(diagram: any): void;
    /** 官方 ThemeManager.nV：目标属性 → 主题子类别 */
    private static _categoryOf;
}

declare class Diagram {
    static readonly className: string;
    static readonly version: string;
    static licenseKey: string;
    static img: string;
    static readonly None = 1;
    static readonly Uniform = 2;
    static readonly UniformToFill = 3;
    static readonly CycleAll = 1;
    static readonly CycleNotDirected = 2;
    static readonly CycleNotDirectedFast = 3;
    static readonly CycleNotUndirected = 4;
    static readonly CycleDestinationTree = 5;
    static readonly CycleSourceTree = 6;
    static readonly DocumentScroll = 1;
    static readonly InfiniteScroll = 2;
    static readonly TreeParentCollapsed = 1;
    static readonly AllParentsCollapsed = 2;
    static readonly AnyParentsCollapsed = 3;
    static isUsingDOM(): boolean;
    static setDocument(d: any): void;
    static useDOM(value: boolean): void;
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
    /**
     * 上一次 raise `DocumentBoundsChanged` 时的文档包围盒。
     * 官方是「包围盒**变了**才 raise」，而本项目以前只在 `invalidateDocumentBounds()`
     * 里无条件 raise —— 初始建模阶段那批 invalidate 全都发生在样例注册监听器**之前**，
     * 于是 gantt 的 `DocumentBoundsChanged` 监听器（给 `myTimeline` 的 `MAIN` 形状
     * 赋 `width = graduatedMax`）永远不触发，`MAIN.width` 停在 NaN，
     * 画 graduated 时间轴时报 `Invalid arguments to Rect constructor: 0, Infinity, 0, -Infinity`。
     */
    private _lastRaisedDocBounds;
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
    /** 官方 Diagram.ms（grid Panel）与其宿主 Part（XL 创建的常驻 Part） */
    private _gridPart;
    private _gridPanel;
    _parts: Map$1<any, Part>;
    _nodeKeyMap: Map$1<any, Node>;
    _treeLinkDataByChildKey: Map$1<any, ObjectData>;
    _changedListeners: Function[];
    _diagramListeners: Map$1<string, Function[]>;
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
    get nodeTemplateMap(): Map$1<string, Part>;
    set nodeTemplateMap(val: Map$1<string, Part>);
    get linkTemplate(): Part;
    set linkTemplate(val: Part);
    get linkTemplateMap(): Map$1<string, Part>;
    set linkTemplateMap(val: Map$1<string, Part>);
    get groupTemplate(): Part | null;
    set groupTemplate(val: Part | null);
    get groupTemplateMap(): Map$1<string, Part>;
    set groupTemplateMap(val: Map$1<string, Part>);
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
    /** 官方 `Diagram.add(part): this`：加入默认层，invalidateDocumentBounds + part.invalidateLayout(1)，返回 this */
    add(part: Part): this;
    remove(part: Part): void;
    findNodeForKey(key: any): Node | null;
    findLinkForData(data: ObjectData): Link | null;
    findPartForKey(key: any): Part | null;
    findNodesByExample(data: any): List<Node>;
    findLinksByExample(data: any): List<Link>;
    findPartAt(point: Point, selectableOnly?: boolean): Part | null;
    findObjectAt(point: Point): GraphObject | null;
    findNodeAt(point: Point): Node | null;
    select(part: Part | null): void;
    clearSelection(): void;
    selectCollection(parts: Iterable$1<Part>): void;
    startTransaction(tname?: string): boolean;
    commitTransaction(tname?: string): boolean;
    rollbackTransaction(): boolean;
    /** 官方 `Diagram.commit(commitFunc, tname?)`：func 收到 diagram 本体；事务交给 model 处理 */
    commit(func: (d?: any) => any, tname?: string): any;
    addDiagramListener(name: string, listener: Function): void;
    removeDiagramListener(name: string, listener: Function): void;
    addChangedListener(listener: Function): void;
    removeChangedListener(listener: Function): void;
    transformDocToView(p: Point): Point;
    transformViewToDoc(p: Point): Point;
    requestUpdate(invalidate?: boolean): void;
    layoutDiagram(invalidate?: boolean): void;
    updateAllTargetBindings(propname?: string): void;
    /**
     * 官方 zoomToFit → Td(2)：min(view/doc)，**不超过 defaultScale（通常 1.0）**，
     * 再 alignDocument(Center, Center) 居中。
     */
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
    /** 官方 Diagram.XL()：默认 6 根网格线（1/5/10 间隔），面板默认不可见、Part 可见 */
    private _createDefaultGrid;
    get grid(): any;
    set grid(val: any);
    /**
     * 官方 Diagram.eC(t?)：按视口重设 grid 面板尺寸并把 GRID Part 吸附到网格。
     * Cf（lcm 周期 × cellSize）来自 Panel._updateGridSettings；
     * 面板尺寸 = 视口 + 2×Cf（四周留出一整个周期，平移视口时线相位保持不变）。
     */
    private _updateGridBounds;
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
    /**
     * 官方 `Binding.updateTarget`（`node_modules/gojs/release/go.js` 840959）把
     * 「取源值 + 调 converter + 写目标属性」整段包在 `try { ... } catch {}` 里，
     * 任何求值异常都被**静默吞掉**（既不中断布局，也不传播到 init）。
     * 之前本项目不 catch，样例里 `Brush.lightenBy(color)` 这类未定义全局
     * 直接把整个 init 打断（实测 industrialDiagram 只渲染出 1/19 个节点）。
     */
    private _resolveBindingValue;
    private _resolveBindingValueCore;
    private _applyBindings;
    /**
     * 官方 Model.ft：把目标属性写入包 try/catch，失败仅 console.log（U.et），
     * 例如数据 width: null → Size(null, NaN) 抛错时保持原值。
     */
    private _setBoundProperty;
    private _applyBindingsToObject;
    private _updateBindingsForPart;
    /** 官方 GraphObject.Zo：只应用 isToTheme 绑定，递归子对象 */
    private _applyThemeBindingsOnly;
    private _updateBindingsForObject;
    _handlePartPropertyChanged(part: Part, obj: GraphObject, propname: string, value?: any): void;
    private _onModelChanged;
    /** 官方 Diagram.Ib(t) 的护栏版：Diagram.layout + 全体 Group.layout 失效 */
    private _invalidateLayoutsFromChanges;
    private _rebuildTreeLinks;
    /**
     * 官方 `Diagram.raiseChangedEvent(change, propertyName, object, oldValue, newValue, oldParam?, newParam?)`。
     * 构造一个 ChangedEvent 并分发给 diagram 的 changed 监听者。
     */
    raiseChangedEvent(change: any, propertyName: string, object: any, oldValue: any, newValue: any, oldParam?: any, newParam?: any): ChangedEvent;
    private _raiseChangedEvent;
    /** 官方 DiagramEvent：监听器收到 `{ diagram, type, subject, subjectData, args }`；官方事件名为 ViewportBoundsChanged */
    private _raiseDiagramEvent;
    raiseDiagramEvent(name: string, subject?: any, subjectData?: any, ...rest: any[]): void;
    private _findObjectInPanel;
    private _renderLoop;
    /**
     * 官方 measure+arrange 全体部件（Ht 语义）：
     * pass1 非 Group 非 Link → pass2 Group → pass3 Link；
     * 每个部件：ensureBounds（measure + bF 位置同步，仅 measure=true 时；渲染阶段只 arrange，
     * 对齐官方 render 不重新 measure）→ _arrange(原始 position, measuredBounds)
     * → syncPositionFromLocation（arrange 后 locationSpot 偏移变化时重推 position）。
     * position 为 NaN 时按原样传入（ab.x/y 保持 NaN，对齐官方）。
     */
    private _measureArrangeAll;
    /** 官方在节点布局定稿后让所有 link 重算路线 */
    private _invalidateLinkRoutes;
    private _collectGroups;
    private _performLayout;
    /**
     * 官方 tE（首次布局完成）+ on(t=true)：先定初始 scale，
     * 再按 initialDocumentSpot/initialViewportSpot 计算 position，最后用 Z2 首次夹取修正。
     */
    private _applyInitialViewport;
    /** 官方 Z2(n=true/scrollMode)：夹取 position；视口宽于文档时按对齐 spot 摆放 */
    private _clampViewportPosition;
    private _applyAutoScale;
    private _applyContentAlignment;
    private _updateGeometry;
    private _setupResizeObserver;
    private _checkResize;
    private _setupMouseEvents;
    private _setupKeyboardEvents;
    private _currentCursor;
    private _defaultCursor;
    private _skipsUndoManager;
    private _mouseOver;
    private _mouseEnter;
    private _mouseLeave;
    private _mouseHold;
    private _mouseHover;
    private _toolTip;
    get currentCursor(): string;
    set currentCursor(val: string);
    get defaultCursor(): string;
    set defaultCursor(val: string);
    get skipsUndoManager(): boolean;
    set skipsUndoManager(val: boolean);
    get mouseOver(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseOver(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get mouseEnter(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseEnter(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get mouseLeave(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseLeave(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get mouseHold(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseHold(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get mouseHover(): ((e: InputEvent, diagram: Diagram) => void) | null;
    set mouseHover(val: ((e: InputEvent, diagram: Diagram) => void) | null);
    get toolTip(): GraphObject | string | null;
    set toolTip(val: GraphObject | string | null);
    private _firstInput;
    private _previousInput;
    private _mouseIsCaptured;
    private _opacity;
    private _fixedBounds;
    private _defaultScale;
    private _initialDocumentSpot;
    private _initialViewportSpot;
    private _positionComputation;
    private _scrollMode;
    private _scrollMargin;
    private _scrollsPageOnFocus;
    private _hasHorizontalScrollbar;
    private _hasVerticalScrollbar;
    private _scrollWidth;
    private _autoScrollInterval;
    private _autoScrollRegion;
    private _isVirtualized;
    private _isTreePathToChildren;
    private _treeCollapsePolicy;
    private _highlighteds;
    private _isCollapsingExpanding;
    private _delaysLayout;
    private _isModelReadOnly;
    private _isModified;
    private _draggedLink;
    private _modelChangeListeners;
    get firstInput(): InputEvent;
    get previousInput(): InputEvent;
    get isMouseCaptured(): boolean;
    get opacity(): number;
    set opacity(val: number);
    get fixedBounds(): Rect | null;
    set fixedBounds(val: Rect | null);
    get defaultScale(): number;
    set defaultScale(val: number);
    get initialDocumentSpot(): Spot;
    set initialDocumentSpot(val: Spot);
    get initialViewportSpot(): Spot;
    set initialViewportSpot(val: Spot);
    get positionComputation(): ((part: Part, pt: Point, gridPt: Point) => Point) | null;
    set positionComputation(val: ((part: Part, pt: Point, gridPt: Point) => Point) | null);
    get scrollMode(): any;
    set scrollMode(val: any);
    get scrollMargin(): Margin;
    set scrollMargin(val: Margin);
    get scrollsPageOnFocus(): boolean;
    set scrollsPageOnFocus(val: boolean);
    get hasHorizontalScrollbar(): boolean;
    set hasHorizontalScrollbar(val: boolean);
    get hasVerticalScrollbar(): boolean;
    set hasVerticalScrollbar(val: boolean);
    get autoScrollInterval(): number;
    set autoScrollInterval(val: number);
    get autoScrollRegion(): number;
    set autoScrollRegion(val: number);
    get isVirtualized(): boolean;
    set isVirtualized(val: boolean);
    get isTreePathToChildren(): boolean;
    set isTreePathToChildren(val: boolean);
    get treeCollapsePolicy(): any;
    set treeCollapsePolicy(val: any);
    get highlighteds(): Set<Part>;
    get isCollapsingExpanding(): boolean;
    get delaysLayout(): boolean;
    set delaysLayout(val: boolean);
    get isModelReadOnly(): boolean;
    set isModelReadOnly(val: boolean);
    get isModified(): boolean;
    set isModified(val: boolean);
    get draggedLink(): any;
    set draggedLink(val: any);
    addModelChangedListener(listener: (e: any) => void): void;
    removeModelChangedListener(listener: (e: any) => void): void;
    addEventListener(type: string, listener: (e: any) => void): void;
    removeEventListener(type: string, listener: (e: any) => void): void;
    doMouseDown(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doMouseWheel(): void;
    doKeyDown(): void;
    doKeyUp(): void;
    emitMouseDown(e: InputEvent): void;
    emitMouseMove(e: InputEvent): void;
    emitMouseUp(e: InputEvent): void;
    emitMouseWheel(e: InputEvent): void;
    emitKeyDown(e: InputEvent): void;
    emitKeyUp(e: InputEvent): void;
    doFocus(): void;
    acceptEvent(e: InputEvent): boolean;
    click(e: InputEvent): void;
    doubleClick(e: InputEvent): void;
    contextClick(e: InputEvent): void;
    getMouse(): Point;
    mouseDragOver(e: InputEvent): void;
    mouseDrop(e: InputEvent): void;
    findPartForData(data: any): Part | null;
    findNodeForData(data: any): Node | null;
    findLinkForKey(key: any): Link | null;
    findPartsAt(point: Point): any;
    findObjectsAt(point: Point): any;
    findPartsIn(rect: Rect, partial?: boolean): any;
    findObjectsIn(rect: Rect, partial?: boolean): any;
    findPartsNear(center: Point, dist: number, partial?: boolean): any;
    findObjectsNear(center: Point, dist: number): any;
    findTopLevelNodesAndLinks(): any;
    findTopLevelGroups(): any;
    findTreeRoots(): any;
    computePartsBounds(parts: any): Rect;
    computeBounds(): Rect;
    ensureBounds(): void;
    invalidateDocumentBounds(): void;
    /** 官方语义：文档包围盒发生变化时（且仅此时）raise `DocumentBoundsChanged` */
    private _checkDocumentBoundsChanged;
    invalidateViewport(): void;
    zoomToRect(rect: Rect): void;
    zoomPoint(factor: number): void;
    isUnoccupied(rect: Rect): boolean;
    computeOccupiedArea(place: Rect): Rect;
    scrollHorizontalLineChange(value: number): void;
    scrollVerticalLineChange(value: number): void;
    scroll(): void;
    setScrollWidth(width: number): void;
    computeAutoScrollPosition(): Point;
    doAutoScroll(): void;
    stopAutoScroll(): void;
    addLayerBefore(layer: Layer, existingLayer: Layer): void;
    addLayerAfter(layer: Layer, existingLayer: Layer): void;
    partAdded(part: Part): void;
    partRemoved(part: Part): void;
    clear(): void;
    removeParts(coll: any, ensureBounds?: boolean): void;
    /**
     * 官方这几个方法都接受 Iterable（List/Set/图元集合）或者普通数组。
     * 本项目的 `List.iterator` 是**属性**（一个 Iterator 对象）而不是方法，
     * 所以不能无脑 `coll.iterator()`。
     */
    private _iterateParts;
    moveParts(coll: any, delta: Point, check?: boolean): void;
    copyParts(coll: any, targetDiagram?: any, check?: boolean): any;
    private _nodeSelectionAdornmentTemplate;
    private _linkSelectionAdornmentTemplate;
    private _groupSelectionAdornmentTemplate;
    get nodeSelectionAdornmentTemplate(): any;
    set nodeSelectionAdornmentTemplate(val: any);
    get linkSelectionAdornmentTemplate(): any;
    set linkSelectionAdornmentTemplate(val: any);
    get groupSelectionAdornmentTemplate(): any;
    set groupSelectionAdornmentTemplate(val: any);
    highlightCollection(parts: any): void;
    highlight(part: Part): void;
    clearHighlighteds(): void;
    private _renderingHints;
    private _divBackground;
    private _pixelRatio;
    private _attached;
    setRenderingHint(name: string, val: any): void;
    getRenderingHint(name: string): any;
    resetRenderingHints(): void;
    setDivBackground(value: string): void;
    computePixelRatio(): number;
    attach(): void;
    get isAttached(): boolean;
    maybeUpdate(): void;
    get isUpdateRequested(): boolean;
    private _isUpdateRequestedFlag;
    makeSVG(opts?: any): any;
    makeSvg(opts?: any): any;
    makeImageData(opts?: any): string;
    makeImage(opts?: any): any;
    private _routers;
    get routers(): List<any>;
    set routers(val: List<any> | any[] | Iterable<any>);
    findRouter(part: any): any;
    addRenderer(renderer: any): void;
    removeRenderer(renderer: any): void;
    setupRouters(): void;
    addInvalidRoute(part: any): void;
    computeMove(part: any, pt: Point): void;
    getPositions(part: any, t: any): any;
    validCycle(): boolean;
    getInputOption(prop: string): any;
    setInputOption(prop: string, val: any): void;
    setProperties(obj: any): void;
    setRTL(isRTL: boolean): void;
    /**
     * 对齐官方 `Diagram.delayInitialization(func)`（见 `node_modules/gojs/release/go.js`）：
     *   `t !== null && U.yn(() => { ...; t(this) }, 1)`
     * 即延迟到下一次 macrotask 再调用，并且**把 Diagram 自己作为参数传进去**。
     * 之前这里写成 `callback()`，既没延迟也没传参，
     * `myDiagram.delayInitialization(loadTree)` 这类样例直接
     * `Cannot read properties of undefined (reading 'model')`（实测 DragZooming）。
     */
    delayInitialization(callback?: ((d: Diagram) => void) | null): void;
    toggleKeyboardControl(shown: boolean): void;
    onViewportBoundsChanged(): void;
    updateAllRelationshipsFromData(): void;
    /** 官方 Diagram.updateAllThemeBindings：对所有部件应用 theme 绑定（PartManager.updateAllThemeBindings） */
    updateAllThemeBindings(): void;
    isTreePathToChildrenFn(): boolean;
    toString(): string;
    private _avoidanceCellSize;
    private _avoidanceLimit;
    private _scaleComputation;
    private _handlesDragDropForTopLevelParts;
    private _partManager;
    get avoidanceCellSize(): Size;
    set avoidanceCellSize(val: Size);
    get avoidanceLimit(): number;
    set avoidanceLimit(val: number);
    get scaleComputation(): ((thisDiagram: Diagram, newScale: number) => number) | null;
    set scaleComputation(val: ((thisDiagram: Diagram, newScale: number) => number) | null);
    get handlesDragDropForTopLevelParts(): boolean;
    set handlesDragDropForTopLevelParts(val: boolean);
    get partManager(): any;
    set partManager(val: any);
    initializePartManager(partManager: any): void;
    diagramScroll(scrollbar: any): void;
    /** 官方 `Diagram.doLinkRouting(container)`：遍历 routers，canRoute 过滤后 routeLinks(本图 links 集合, container) */
    doLinkRouting(container?: any): void;
    cacheGroupExternalLinks(start: boolean): void;
    focusObject(obj: any): void;
    raiseChanged(flag: any, details: any): void;
    redraw(): void;
    reset(): void;
}

/**
 * Tool - base class for all interactive tools in the diagram.
 * Provides virtual methods for mouse/keyboard/touch event handling,
 * transaction management, and standard interaction patterns.
 */
declare class Tool {
    static readonly className: string;
    protected _diagram: Diagram | null;
    protected _isActive: boolean;
    private _isEnabled;
    private _name;
    private _transactionResult;
    /**
     * 所属 ToolManager。样例经常在 Diagram 构建完成之后才
     * `toolManager.mouseDownTools.add(new MyTool())`，此时新 Tool 的
     * `_diagram` 还是 null —— 若只靠 ToolManager 构造时的一次性赋值，
     * 后加的 Tool 在 `canStart/updateAdornments` 里取 `this.diagram`
     * 就会得到 null（实测 SectorReshaping / LinkShifting 直接抛
     * `Cannot read properties of null (reading 'isReadOnly')`）。
     * 因此这里保留 toolManager 引用，让 `diagram` 能回落到
     * `toolManager.diagram`。
     */
    private _toolManager;
    constructor();
    get diagram(): Diagram | null;
    set diagram(val: Diagram | null);
    get toolManager(): ToolManager | null;
    set toolManager(val: ToolManager | null);
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
    /** 上一次鼠标悬停的对象（用于 mouseEnter/mouseLeave/mouseOver 追踪）。 */
    private _overObject;
    toString(): string;
    /**
     * 官方 Tool.canStartButton
     * 当前工具是否可因主键（左键）按下而启动。
     * 官方使用 lastInput.left；本项目 InputEvent 提供 leftButton。
     */
    canStartButton(): boolean;
    /** 官方 Tool.doUpdateCursor —— 将图表面板光标重置为空。 */
    doUpdateCursor(t: any): void;
    /**
     * 官方 Tool.doWheelChange
     * 若滚轮位置改变（或存在水平滚轮偏移），则标记事件不再继续向外传播。
     * 注：本项目未接入该调用，属于 API 对齐的惰性实现。
     */
    doWheelChange(oldPoint: Point, newPoint: Point, input: InputEvent): void;
    /**
     * 官方 Tool.standardMouseOver
     * 标准鼠标悬停处理：计算目标对象，派发 mouseLeave/mouseEnter/mouseOver，
     * 并设置 currentCursor。本项目未接入调用，属于 API 对齐的惰性实现。
     */
    standardMouseOver(): void;
}

declare class TextEditingTool extends Tool {
    static readonly className: string;
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

declare class TextBlock extends GraphObject {
    static readonly className: string;
    static WrapFit: EnumValue;
    static WrapDesiredSize: EnumValue;
    static WrapNone: EnumValue;
    static WrapBreakAll: EnumValue;
    static OverflowClip: EnumValue;
    static OverflowEllipsis: EnumValue;
    static FormatTrim: EnumValue;
    static FormatNone: EnumValue;
    static VerticalTop: EnumValue;
    static VerticalCenter: EnumValue;
    static VerticalBottom: EnumValue;
    /** 官方 TextBlock 省略号（overflow = Ellipsis 时使用），默认 "..." */
    private static _ellipsis;
    /** 官方基线位置回调，null 表示默认 `textHeight * 0.75` */
    private static _baseline;
    /** 官方下划线位置回调，null 表示默认 `textHeight * 0.8` */
    private static _underline;
    static getEllipsis(): string;
    static setEllipsis(val: string): void;
    static getBaseline(): ((textBlock: TextBlock, textHeight: number) => number) | null;
    static setBaseline(value: ((textBlock: TextBlock, textHeight: number) => number) | null): void;
    static getUnderline(): ((textBlock: TextBlock, textHeight: number) => number) | null;
    static setUnderline(value: ((textBlock: TextBlock, textHeight: number) => number) | null): void;
    /** 官方 `TextBlock.isValidFont(font)`：优先用 CSS.supports，环境不支持时保守返回 true */
    static isValidFont(font: string): boolean;
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
    private _textEditor;
    private _errorFunction;
    private _textValidation;
    private _textEdited;
    private _letterSpacing;
    private _wordSpacing;
    private _formatting;
    private _maxLines;
    private _choices;
    private _isOverflowed;
    private _metricsWidth;
    private _metricsConstraint;
    private _metricsFontHeight;
    private _metricsLinesAdded;
    private _metricsArrSize;
    private _metricsArrText;
    private _metricsText;
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
    get textEditor(): HTMLInfo | null;
    set textEditor(val: HTMLInfo | null);
    get errorFunction(): ((tool: TextEditingTool, oldString: string, newString: string) => void) | null;
    set errorFunction(val: ((tool: TextEditingTool, oldString: string, newString: string) => void) | null);
    get textValidation(): ((thisTextBlock: TextBlock, oldString: string, newString: string) => boolean) | null;
    set textValidation(val: ((thisTextBlock: TextBlock, oldString: string, newString: string) => boolean) | null);
    get textEdited(): ((thisTextBlock: TextBlock, oldString: string, newString: string) => void) | null;
    set textEdited(val: ((thisTextBlock: TextBlock, oldString: string, newString: string) => void) | null);
    get letterSpacing(): string;
    set letterSpacing(val: string);
    get wordSpacing(): string;
    set wordSpacing(val: string);
    get formatting(): EnumValue;
    set formatting(val: EnumValue);
    get maxLines(): number;
    set maxLines(val: number);
    get choices(): string[] | null;
    set choices(val: string[] | null);
    /** 官方只读：measure 时因 maxLines 截断产生（`TextBlock.isOverflowed`） */
    get isOverflowed(): boolean;
    /** 官方只读：单行文本高度（不含 spacingAbove/spacingBelow） */
    get lineHeight(): number;
    /** 官方 measure 缓存的七元组：[maxLineWidth, measure 宽约束, fontHeight, 本次量测行数, arrSize, arrText, text] */
    getMetrics(): Array<number | number[] | string[] | string | null>;
    /** 官方 `TextBlock.metrics`：measure 结果快照 */
    get metrics(): {
        arrSize: number[];
        arrText: Array<string | null>;
        maxLineWidth: number;
        fontHeight: number | null;
    };
    /** 官方 `TextBlock.getStringWidth(str)`：用本对象字体量测字符串宽度 */
    getStringWidth(str: string): number;
    get naturalSize(): Size;
    measure(width: number, height: number): void;
    _measure(widthConstraint: number, heightConstraint: number): void;
    private _getLineHeight;
    private _applySpacing;
    _measureText(ctx: CanvasRenderingContext2D, widthConstraint: number): {
        width: number;
        height: number;
        lineCount: number;
        lines: string[];
        lineWidths: number[];
        lineHeight: number;
    };
    private _wrapText;
    private static _getFontSize;
    private static _tempCanvas;
    /**
     * 官方 TextBlock 的对齐语义：textAlign 决定文本在自身 actualBounds 内的水平位置。
     * 返回 fillText 使用的锚点 x（文本左边缘），配合 ctx.textAlign='left'。
     */
    private _alignX;
    _draw(ctx: CanvasRenderingContext2D): void;
    copy(): TextBlock;
}

/**
 * PanelLayout - 官方 go.d.ts:921309 的抽象基类。
 *
 * 官方 `Panel` / `Part` / `Node` / `Group` / `Adornment` 的构造签名都是
 * `constructor(type?: PanelLayout | string, init?)`：第一个参数既可以是内置面板类型名
 * （`'Auto'` / `'Table'` …），也可以是一个 **PanelLayout 实例**（自定义面板布局）。
 *
 * 本项目以前只支持字符串/EnumValue，落到 else 分支被当成 `init`，
 * 于是扩展 `PanelLayoutFlow.js` 里的 `class PanelLayoutFlow extends go.PanelLayout`
 * 直接抛 `Class extends value undefined is not a constructor`（实测 PanelLayoutFlow）。
 */
declare class PanelLayout {
    static readonly className: string;
    private _name;
    get name(): string;
    set name(value: string);
    constructor(init?: Record<string, any>);
    /**
     * 官方：`measure(panel, width, height, elements, union, minw, minh): void`
     * 子类必须对每个元素调 `measureElement`，并把预期并集写进 `union`。
     */
    measure(_panel: any, _width: number, _height: number, _elements: GraphObject[], union: Rect, _minw: number, _minh: number): void;
    /** 官方 `PanelLayout.measureElement(obj, width, height, minw, minh)`：设 obj.measuredBounds */
    measureElement(obj: GraphObject, width: number, height: number, minw: number, minh: number): void;
    /** 官方：`arrange(panel, elements, union): void` */
    arrange(_panel: any, _elements: GraphObject[], _union: Rect): void;
    /** 官方 `PanelLayout.arrangeElement(obj, x, y, width, height, clipRect?)`：设 obj.actualBounds */
    arrangeElement(obj: GraphObject, x: number, y: number, width: number, height: number, clipRect?: Rect): void;
    /** 官方 `PanelLayout.remeasureObject(obj)`：改动元素属性前调用，避免上层重新测量 */
    remeasureObject(obj: GraphObject): void;
}

/**
 * LayoutEdge - represents a link in the layout network.
 */
declare class LayoutEdge {
    static readonly className: string;
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
 *
 * 本类以前只有 `width/height/centerX/centerY/addXxxEdge` 几个成员，官方
 * `LayoutVertex` 的其余公开面（go.d.ts: class LayoutVertex）全缺，扩展一碰就挂：
 * `RadialLayout.findDistances` 的 `least.edges.each(...)` →
 * `Cannot read properties of undefined (reading 'each')`（实测 radialPartition）。
 */
declare class LayoutVertex {
    static readonly className: string;
    /** The network this vertex belongs to */
    network: LayoutNetwork | null;
    /** 官方 LayoutVertex.data：一般就是 Node/Link 的 data */
    data: any;
    /** X position of the vertex center */
    x: number;
    /** Y position of the vertex center */
    y: number;
    /** Bounding rectangle of the vertex */
    bounds: Rect;
    /**
     * 官方 LayoutVertex.focus：bounds 左上角到「连接点」的偏移（像素）。
     * `centerX`/`centerY` 就是 `bounds.x/y + focus`。
     */
    focus: Point;
    /**
     * 官方 `LayoutVertex.actualAngle`（度）：该 vertex 最终被摆放的角度。
     * CircularLayout 在环上定位时写入；子类（如 friendWheel 的 WheelLayout）
     * 覆写 `commitNodes()` / `commitLinks()` 时靠它算节点旋转与连线曲率。
     * 之前本项目没有这个字段，`v.actualAngle` 恒为 undefined，导致
     * friendWheel 的旋转与曲率逻辑全部拿到 NaN。
     */
    actualAngle: number;
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
    /** 官方 LayoutVertex.deleteSourceEdge */
    deleteSourceEdge(edge: LayoutEdge): void;
    /** 官方 LayoutVertex.deleteDestinationEdge */
    deleteDestinationEdge(edge: LayoutEdge): void;
    /** Delete an edge from both source and destination lists */
    deleteEdge(edge: LayoutEdge): void;
    /** 官方 LayoutVertex.sourceVertexes：sourceEdges 另一端的顶点 */
    get sourceVertexes(): any;
    /** 官方 LayoutVertex.destinationVertexes */
    get destinationVertexes(): any;
    /** 官方 LayoutVertex.vertexes = sourceVertexes ∪ destinationVertexes */
    get vertexes(): any;
    /**
     * 官方 LayoutVertex.edges：sourceEdges + destinationEdges 拼成的 List 的**迭代器**。
     * 官方迭代器带 `each`，扩展（RadialLayout / ParallelLayout）直接 `v.edges.each(...)`。
     */
    get edges(): any;
    /** 官方 LayoutVertex.edgesCount */
    get edgesCount(): number;
    /** 官方 LayoutVertex.commit()：把最终 bounds 写回 data.bounds（TreeVertex 覆写） */
    commit(): void;
    /** Get the center point of this vertex（官方 `bounds + focus`） */
    get center(): {
        x: number;
        y: number;
    };
    /** 官方 LayoutVertex.focus：像素偏移（兼容老的 focusX/focusY 分数写法） */
    private _focusPx;
    /** 官方 LayoutVertex.centerX = bounds.x + focus.x */
    get centerX(): number;
    set centerX(val: number);
    /** 官方 LayoutVertex.centerY = bounds.y + focus.y */
    get centerY(): number;
    set centerY(val: number);
    static smartComparer(a: LayoutVertex, b: LayoutVertex): number;
}

/**
 * LayoutNetwork - the graph structure used by layouts.
 * Contains vertexes (nodes) and edges (links) for layout computation.
 */
declare class LayoutNetwork {
    static readonly className: string;
    /** The layout that owns this network */
    layout: any;
    /** All vertexes in this network */
    vertexes: List<LayoutVertex>;
    /** All edges in this network */
    edges: List<LayoutEdge>;
    /** Map from Link to LayoutEdge */
    linkToLayoutEdge: Map$1<Link, LayoutEdge>;
    /** Map from Node to LayoutVertex */
    nodeToLayoutVertex: Map$1<Node, LayoutVertex>;
    /** Create a new vertex (subclasses override to return specialized vertexes) */
    createVertex(): LayoutVertex;
    /** Create a new edge (subclasses override to return specialized edges) */
    createEdge(): LayoutEdge;
    /** Add a vertex to this network */
    addVertex(vertex: LayoutVertex): LayoutVertex;
    /**
     * 把一批顶点/边重新挂回本网络（不重复登记边到 vertex 上）。
     *
     * `splitIntoSubNetworks()` 是**破坏性**的：它把顶点/边从本网络搬到子网络，
     * 拆完主网络就空了。但官方 CircularLayout 在 commitNodes()/commitLinks() 阶段
     * `this.network` 仍然持有全部 vertexes/edges —— 样例（friendWheel 的 WheelLayout 等）
     * 覆写里遍历 `this.network.vertexes` / `this.network.edges`，
     * 一旦是空列表，径向旋转和 link.curviness 就都失效。拆分只是分组手段，
     * 所以布局算完再挂回来。
     */
    reattach(vertexes: LayoutVertex[], edges: LayoutEdge[]): void;
    /** Add an edge to this network (官方：toVertex.addSourceEdge, fromVertex.addDestinationEdge) */
    addEdge(edge: LayoutEdge): LayoutEdge;
    /** Add a link to the network, creating an edge between the from/to vertexes */
    addLink(link: Link): LayoutEdge | null;
    /** Add a node to the network, creating a vertex */
    addNode(node: Node): LayoutVertex;
    /**
     * 官方 LayoutNetwork.addParts(coll, toplevelonly?, pred?): void
     * 官方是两阶段：先把**节点**入网（`Group.layout === null` 的组递归收成员，
     * 且递归时用默认谓词），再处理**连线** —— 连线端点用 `findGroupVertex`
     * 解析到「自身或网络中已有的最深祖先 vertex」，**不自动创建端点 vertex**；
     * 任一侧解析为 null 则跳过该连线。这正是 flowgrammer 组内布局
     * 不会把 L3→4 的端点 node4（属于嵌套组 -2）塞进组 -1 网络的原因。
     */
    addParts(coll: any, toplevelonly?: boolean, pred?: ((a: any) => boolean) | null): void;
    /**
     * 官方 LayoutNetwork.findGroupVertex(node)：
     * 端点解析为「自身（findVisibleNode）的 vertex，否则沿 containingGroup 向上
     * 找第一个已入网的祖先 vertex」，全都没有则 null。
     */
    findGroupVertex(node: any): LayoutVertex | null;
    /** 官方 LayoutNetwork.deleteVertex(vertex) */
    deleteVertex(vertex: LayoutVertex): void;
    /** 官方 LayoutNetwork.deleteNode(node) */
    deleteNode(node: Node): void;
    /** 官方 LayoutNetwork.deleteLink(link) */
    deleteLink(link: Link): void;
    /** 官方 LayoutNetwork.findAllParts(): Set<Part> */
    findAllParts(): Set<any>;
    /** Delete all artificial vertexes from the network */
    deleteArtificialVertexes(): void;
    /** Delete self-loop edges (where fromVertex === toVertex) */
    deleteSelfEdges(): void;
    /** Find the vertex associated with a node */
    findVertex(node: Node): LayoutVertex | null;
    /** Find the edge associated with a link */
    findEdge(link: Link): LayoutEdge | null;
    /**
     * 官方 LayoutNetwork.linkVertexes(fromVertex, toVertex, link?)：
     * 任一侧为 null 直接返回 null（不建点）；带 link 时登记 link→edge 映射。
     */
    linkVertexes(fromVertex: LayoutVertex | null, toVertex: LayoutVertex | null, link?: Link | null): LayoutEdge | null;
    /** Delete an edge from the network */
    deleteEdge(edge: LayoutEdge): void;
    /**
     * 官方 `LayoutNetwork.splitIntoSubNetworks()` 的连通分量拆分（对照官方 `F4`）：
     * 只在“本网络 → 子网络”之间搬移顶点/边的归属，不改动顶点上的
     * `sourceEdges`/`destinationEdges`。
     * 旧实现在遍历 `v.sourceEdges` 的同时调用 `addEdge`（又会向同一 List 追加该边），
     * 导致 List 无限增长直至 `RangeError: Invalid array length`。
     */
    splitIntoSubNetworks(): List<LayoutNetwork>;
    /** 官方 `bA(edge)` + `xA(edge)`：把边从原网络搬进目标网络（不动顶点边表） */
    private _moveEdgeTo;
}

/**
 * Layout - base class for all layout algorithms.
 * Subclasses must override doLayout() to implement specific layout algorithms.
 */
declare class Layout {
    static readonly className: string;
    protected _arrangementOrigin: Point;
    protected _isInitial: boolean;
    protected _isOngoing: boolean;
    protected _isRealtime: boolean;
    protected _isRouting: boolean;
    protected _isValidLayout: boolean;
    protected _isViewportSized: boolean;
    /** 官方签名 `(part, lay, rect) => rect` */
    protected _boundsComputation: ((part: Part, layout: Layout, bounds: Rect) => Rect) | null;
    protected _network: LayoutNetwork | null;
    protected _diagram: any;
    protected _group: any;
    /** 官方 `Layout.constructor(init?)`：`t && Object.assign(this, t)` */
    constructor(init?: any);
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
    get boundsComputation(): ((part: Part, layout: Layout, bounds: Rect) => Rect) | null;
    set boundsComputation(val: ((part: Part, layout: Layout, bounds: Rect) => Rect) | null);
    get network(): LayoutNetwork | null;
    set network(val: LayoutNetwork | null);
    get diagram(): any;
    set diagram(val: any);
    get group(): any;
    set group(val: any);
    /**
     * Perform the layout on the given collection of parts.
     * 官方 base Layout.doLayout：收集未定位的顶层部件（doMinimalNoNetworkLayout 的 Ga 谓词），
     * 按 ceil(sqrt(n)) 列的极简网格摆放（仅对 location/position 均为 NaN 的部件）。
     * @param coll - A Diagram, Group, Iterable<Part>, or array of Parts
     */
    doLayout(coll: any): void;
    /**
     * 官方 Layout.Zh（base 版收集，谓词 = Ga(t)）：
     * - Diagram：nodes(topLevelOnly) + parts(topLevelOnly) 两趟
     * - Group：memberParts(topLevelOnly=false)
     * - 其他可迭代集合：addAll，不带谓词
     * 谓词 Ga(t) = (!location实值 && !position实值) || (Group && t.Ga)
     * Node 分支：Group.layout===null 时递归 memberParts；其余 ensureBounds 后加入。
     */
    collectMinimalParts(coll: any): Part[];
    /**
     * 官方 Layout.doMinimalNoNetworkLayout：
     * arrangementOrigin = initialOrigin(arrangementOrigin)（原地变更），
     * cols = ceil(sqrt(n))，步长 max(w,50)+20，行高 max(max(h,50))，moveTo 后 Group.Ga=false。
     */
    doMinimalNoNetworkLayout(parts: Part[]): void;
    /**
     * Collect all Parts that should be laid out from the given collection.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    collectParts(coll: any): List<Part>;
    /** 官方 collectParts 内部的收集过程（对应官方私有 Ka 方法） */
    private _collectInto;
    /**
     * Commit the layout by moving parts to their computed positions.
     * Called after the layout algorithm has computed positions.
     */
    commitLayout(): void;
    /**
     * 官方 `Layout.cloneProtected`：把受保护字段复制到一个已构造好的新实例。
     * 官方实现：`t.Tg=this.Tg, t.Kr=this.Kr, t.Lg=this.Lg, t.Dg.f(this.Dg), t.vo=this.vo, t.Il=this.Il, t.Fg=this.Fg, t.Rg=!0`
     * （字段名对应 isInitial/isOngoing/isRealtime/arrangementOrigin/isRouting/isViewportSized/boundsComputation/isValidLayout）
     */
    protected cloneProtected(copy: Layout): void;
    /**
     * Create a copy of this layout.
     * 官方：`const t = new this.constructor; return this.cloneProtected(t), t`
     */
    copy(): Layout;
    /**
     * 官方 `Layout.toString()`：
     * `U.to(this.constructor) + "()"`，若 `group !== null` 追加 `" in " + group`，若 `diagram !== null` 追加 `" for " + diagram`。
     */
    toString(): string;
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
     * 官方 Layout.initialOrigin：
     * - group 有 placeholder → placeholder 文档 TopLeft（NaN → 回退 origin）+ padding
     * - group 无 placeholder → group.position（NaN → 回退 origin）
     * - 无 group → origin
     */
    initialOrigin(t?: Point): Point;
    private _findPlaceholder;
    /** target 在 group 面板内的局部偏移（沿 actualBounds 局部链累加）；找不到 → null */
    private _panelLocalPoint;
    /**
     * Invalidate this layout, causing it to be re-performed.
     *
     * 官方 `Layout.invalidateLayout()` 三重护栏：
     * 1) 已无效 → 直接返回（幂等）；
     * 2) undo/redo 期间返回；
     * 3) 动画 tick 期间返回（官方 `i.isTicking || (...)`）——否则动画回写 location 每帧都会重排。
     * 之后才按 `(isOngoing && diagram 已完成首排) || (isInitial && 未完成首排)` 置无效
     * （官方 `t.ga` = Diagram 已完成一次 update/首排；此处用 `_hasPerformedInitialLayout` 近似）。
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
    static readonly className: string;
    protected _handlesDragDrop: boolean;
    private _memberParts;
    protected _ungroupable: boolean;
    private _layout;
    private _ga;
    private _computesBoundsAfterDrag;
    private _computesBoundsIncludingLinks;
    private _computesBoundsIncludingLocation;
    private _handlesDragDropForMembers;
    private _avoidableMembers;
    private _wasSubGraphExpanded;
    private _memberAdded;
    private _memberRemoved;
    private _memberValidation;
    private _subGraphExpandedChanged;
    /** 官方 `Diagram.isCollapsingExpanding` 的重入保护（本项目 Diagram 尚无该标志，用静态位替代） */
    private static _isCollapsingExpanding;
    constructor(type?: any, init?: any);
    get handlesDragDrop(): boolean;
    set handlesDragDrop(val: boolean);
    get placeholder(): Placeholder | null;
    get memberParts(): Set<Part>;
    get ungroupable(): boolean;
    set ungroupable(val: boolean);
    /**
     * 官方 Group.computesBoundsAfterDrag：默认 false。
     * 为 true 时成员拖动后才计算组的边界（避免拖动过程中反复重算）。
     */
    get computesBoundsAfterDrag(): boolean;
    set computesBoundsAfterDrag(val: boolean);
    /** 官方 Group.computesBoundsIncludingLinks：默认 true，边界计算是否包含内部 Link。 */
    get computesBoundsIncludingLinks(): boolean;
    set computesBoundsIncludingLinks(val: boolean);
    /** 官方 Group.computesBoundsIncludingLocation：默认 false，是否把自身 location 计入边界。 */
    get computesBoundsIncludingLocation(): boolean;
    set computesBoundsIncludingLocation(val: boolean);
    get layout(): Layout | null;
    set layout(val: Layout | null);
    /** 官方 Group 的 Ga 标志：diagram 布局前递归组布局将其置位，diagram 布局收集后清除。 */
    get Ga(): boolean;
    set Ga(val: boolean);
    /** 官方 `Group.handlesDragDropForMembers`（默认 false） */
    get handlesDragDropForMembers(): boolean;
    set handlesDragDropForMembers(val: boolean);
    /** 官方 `Group.avoidableMembers`（默认 false，成员是否参与连线避让） */
    get avoidableMembers(): boolean;
    set avoidableMembers(val: boolean);
    /** 官方 `Group.memberAdded`（默认 null） */
    get memberAdded(): ((thisGroup: Group, newPart: Part) => void) | null;
    set memberAdded(val: ((thisGroup: Group, newPart: Part) => void) | null);
    /** 官方 `Group.memberRemoved`（默认 null） */
    get memberRemoved(): ((thisGroup: Group, oldPart: Part) => void) | null;
    set memberRemoved(val: ((thisGroup: Group, oldPart: Part) => void) | null);
    /** 官方 `Group.memberValidation`（默认 null，决定某 Part 能否成为本组成员） */
    get memberValidation(): ((thisGroup: Group | null, part: Part) => boolean) | null;
    set memberValidation(val: ((thisGroup: Group | null, part: Part) => boolean) | null);
    /** 官方 `Group.subGraphExpandedChanged`（默认 null） */
    get subGraphExpandedChanged(): ((thisGroup: Group) => void) | null;
    set subGraphExpandedChanged(val: ((thisGroup: Group) => void) | null);
    /** 官方 `Group.wasSubGraphExpanded`（默认 false，折叠前是否展开） */
    get wasSubGraphExpanded(): boolean;
    set wasSubGraphExpanded(val: boolean);
    /** 内部：memberAdded / memberRemoved 回调（官方由 `Group.WN` / `Group.vN` 调用） */
    _notifyMemberAdded(part: Part): void;
    /** 内部：见 `_notifyMemberAdded` */
    _notifyMemberRemoved(part: Part): void;
    /** 官方 `Group.canAddMembers(coll)` */
    canAddMembers(coll: any): boolean;
    /** 官方 `Group.canUngroup()` */
    canUngroup(): boolean;
    /**
     * 官方 `Group.findSubGraphParts()`：本组（含嵌套组）的全部成员 Node/Link 与标签节点，不含本组自身。
     */
    findSubGraphParts(): Set<Part>;
    /** 官方 `Group.findExternalLinksConnected()` */
    findExternalLinksConnected(): Iterator<any>;
    /** 官方 `Group.findExternalNodesConnected()` */
    findExternalNodesConnected(): Iterator<any>;
    /** 官方 `Group.collapseSubGraph()` */
    collapseSubGraph(): void;
    /** 官方 `Group.expandSubGraph()` */
    expandSubGraph(): void;
    /** 官方 `Group.eR` / `Group.sR`：隐藏/显示成员并递归处理嵌套组 */
    private _subGraphStep;
    addMembers(collection: any, check?: boolean): boolean;
    removeMembers(collection: any, check?: boolean): boolean;
    move(newLoc: Point, isLocation?: boolean): void;
    copy(): Group;
}

declare class Overview {
    static readonly className: string;
    static _dbg: boolean;
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
    private _observedDiagramChangedListener;
    private _observedLayoutListener;
    private _boundModel;
    /**
     * 官方 `Overview(div?, init?)`：第一参可为 div 或 init 对象；
     * 默认 box 为带 BOXSHAPE 的 Part（官方 Overview ctor 同款）。
     */
    constructor(divOrOptions?: string | HTMLDivElement | Record<string, any>, options?: Record<string, any>);
    /** 官方 Overview 为 Diagram 子类，div 可读（如 `overview.div.style`） */
    get div(): string | HTMLDivElement | null;
    /** 官方 Overview 为 Diagram 子类，add/remove 作用于其内部图纸 */
    add(part: any): any;
    remove(part: any): void;
    get diagram(): Diagram;
    get observedDiagram(): Diagram | null;
    /** 官方属性名就是 `Overview.observed` */
    get observed(): Diagram | null;
    set observed(val: Diagram | null);
    set observedDiagram(val: Diagram | null);
    get box(): any;
    set box(val: any);
    get isViewportSized(): boolean;
    set isViewportSized(val: boolean);
    update(): void;
    /**
     * 官方 Overview（Diagram 子类）直接渲染 observed 的部件；
     * 本项目让内部图纸共享 observed 的 model + 模板自建同位置部件。
     * 模板可能在 observed 设置之后才赋值，故每次 update 都同步。
     */
    private _syncInnerFromObserved;
    /** 抄回 observed 部件位置（内部部件由共享 model 重建，需与 observed 对齐） */
    private _copyObservedPositions;
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
    static readonly className: string;
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
    static readonly className: string;
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
 * GridLayout - arranges parts in a grid pattern.
 * 官方 GridLayout（pretty.js 31840）：sorting 默认 Ascending(comparer=standardComparer，按 part.text)、
 * alignment 默认 Location(I4)、arrangement 默认 LeftToRight、cellSize 默认 (NaN,NaN)、spacing (10,10)、
 * wrappingWidth NaN → viewportBounds.width - padding。
 */
declare class GridLayout extends Layout {
    static readonly className: string;
    private _wrappingWidth;
    private _wrappingColumn;
    private _cellSize;
    private _spacing;
    private _alignment;
    private _arrangement;
    private _sorting;
    private _comparer;
    /** 官方 GridLayout 构造：默认 isViewportSized=true，`t && Object.assign(this, t)` */
    constructor(init?: any);
    /** 官方 setter：只接受 >0 或 NaN；wrappingWidth 决定 isViewportSized = isNaN(t) */
    get wrappingWidth(): number;
    set wrappingWidth(val: number);
    get wrappingColumn(): number;
    set wrappingColumn(val: number);
    get comparer(): ((a: any, b: any) => number) | null;
    set comparer(val: ((a: any, b: any) => number) | null);
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
    /** 官方 GridLayout.doLayout（pretty.js 31866） */
    doLayout(coll: any): void;
    /** 官方 GridAlignment.Position 分支 R4（pretty.js 31927） */
    private _layoutPosition;
    /** 官方 GridAlignment.Location 分支 I4（pretty.js 31957，默认） */
    private _layoutLocation;
    commitLayers(grid: any, origin: Point): void;
    static Location: EnumValue;
    static Center: EnumValue;
    static Forwards: EnumValue;
    static Forward: EnumValue;
    static Reverse: EnumValue;
    static Ascending: EnumValue;
    static Descending: EnumValue;
    static Position: EnumValue;
    static LeftToRight: EnumValue;
    static RightToLeft: EnumValue;
    /** 官方 GridLayout.standardComparer：按 part.text 比较 */
    static standardComparer(a: Part, b: Part): number;
    /** 官方 GridLayout.smartComparer：按 part.text 忽略大小写并数字感知比较 */
    static smartComparer(a: Part, b: Part): number;
}

/**
 * TreeVertex - TreeLayout 专用顶点（官方 TreeVertex 的移植）。
 *
 * 与基础 LayoutVertex 的差异：
 * - focus 是绝对偏移量 Point（官方 LayoutVertex.focus），不是 0-1 分数
 * - 携带树结构（parent/children/level）与几何中间量 K/kt/gt/mm/pm
 * - 携带可继承的布局属性（sorting/angle/alignment/nodeSpacing/layerSpacing/...）
 */
declare class TreeVertex extends LayoutVertex {
    static readonly className: string;
    initialized: boolean;
    parent: TreeVertex | null;
    children: TreeVertex[];
    level: number;
    descendantCount: number;
    maxChildrenCount: number;
    maxGenerationCount: number;
    comments: any[] | null;
    /** 官方 K — 本顶点相对父顶点的偏移 */
    relativePosition: Point;
    /** 官方 kt — 子树包围尺寸 */
    subtreeSize: Size;
    /** 官方 gt — 子树对齐偏移（用于父顶点的居中/总线计算） */
    subtreeOffset: Point;
    /** 官方 mm — 起始边线（链接脊线/压缩用） */
    mm: Point[] | null;
    /** 官方 pm — 结束边线 */
    pm: Point[] | null;
    /** 官方 LayoutVertex.focus — 从 bounds 原点到节点中心的绝对偏移 */
    focus: Point;
    sorting: EnumValue;
    comparer: (a: TreeVertex, b: TreeVertex) => number;
    angle: number;
    alignment: EnumValue;
    nodeIndent: number;
    nodeIndentPastParent: number;
    nodeSpacing: number;
    layerSpacing: number;
    layerSpacingParentOverlap: number;
    compaction: EnumValue;
    breadthLimit: number;
    rowSpacing: number;
    rowIndent: number;
    commentSpacing: number;
    commentMargin: number;
    setsPortSpot: boolean;
    portSpot: Spot;
    setsChildPortSpot: boolean;
    childPortSpot: Spot;
    get childrenCount(): number;
    /** 官方 TreeVertex.copyInheritedPropertiesFrom */
    copyInheritedPropertiesFrom(t: TreeVertex | null): void;
    static standardComparer(a: TreeVertex, b: TreeVertex): number;
}

/**
 * TreeLayout — 官方 GoJS TreeLayout 的忠实移植。
 *
 * doLayout 流程（官方 doLayout）：
 *   initTrees(YB) → initializeCounts(KB) → assignTreeValues(UB) → sortTrees(GB)
 *   → addComments(vA) → layoutTreeReal(qB) → arrangeTrees → updateParts(commit)
 *
 * 关键移植说明：
 * - 与官方一致：vertex.sourceEdges = 入边（该顶点为 to）、destinationEdges = 出边（该顶点为 from）。
 * - 官方 focus 是绝对偏移 Point（LayoutVertex.focus），TreeVertex.focus 同义。
 * - 官方 K/kt/gt/mm/pm → relativePosition/subtreeSize/subtreeOffset/mm/pm。
 */
declare class TreeLayout extends Layout {
    static readonly className: string;
    private _roots;
    private _path;
    private _treeStyle;
    private _layerStyle;
    private _comments;
    private _arrangement;
    private _arrangementSpacing;
    private _rootDefaults;
    private _alternateDefaults;
    private _Ms;
    private _layerSizes;
    private _pool;
    constructor(init?: any);
    get roots(): Set<TreeVertex>;
    set roots(val: Set<TreeVertex>);
    get path(): EnumValue;
    set path(val: EnumValue);
    get treeStyle(): EnumValue;
    set treeStyle(val: EnumValue);
    get layerStyle(): EnumValue;
    set layerStyle(val: EnumValue);
    get comments(): boolean;
    set comments(val: boolean);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue);
    get arrangementSpacing(): Size;
    set arrangementSpacing(val: Size);
    get rootDefaults(): TreeVertex;
    set rootDefaults(val: TreeVertex);
    get alternateDefaults(): TreeVertex;
    set alternateDefaults(val: TreeVertex);
    get angle(): number;
    set angle(val: number);
    get alignment(): EnumValue;
    set alignment(val: EnumValue);
    get sorting(): EnumValue;
    set sorting(val: EnumValue);
    get comparer(): (a: TreeVertex, b: TreeVertex) => number;
    set comparer(val: (a: TreeVertex, b: TreeVertex) => number);
    get nodeIndent(): number;
    set nodeIndent(val: number);
    get nodeIndentPastParent(): number;
    set nodeIndentPastParent(val: number);
    get nodeSpacing(): number;
    set nodeSpacing(val: number);
    get layerSpacing(): number;
    set layerSpacing(val: number);
    get layerSpacingParentOverlap(): number;
    set layerSpacingParentOverlap(val: number);
    get compaction(): EnumValue;
    set compaction(val: EnumValue);
    get breadthLimit(): number;
    set breadthLimit(val: number);
    get rowSpacing(): number;
    set rowSpacing(val: number);
    get rowIndent(): number;
    set rowIndent(val: number);
    get commentSpacing(): number;
    set commentSpacing(val: number);
    get commentMargin(): number;
    set commentMargin(val: number);
    get setsPortSpot(): boolean;
    set setsPortSpot(val: boolean);
    get portSpot(): Spot;
    set portSpot(val: Spot);
    get setsChildPortSpot(): boolean;
    set setsChildPortSpot(val: boolean);
    get childPortSpot(): Spot;
    set childPortSpot(val: Spot);
    get alternateAngle(): number;
    set alternateAngle(val: number);
    get alternateAlignment(): EnumValue;
    set alternateAlignment(val: EnumValue);
    get alternateSorting(): EnumValue;
    set alternateSorting(val: EnumValue);
    get alternateNodeIndent(): number;
    set alternateNodeIndent(val: number);
    get alternateNodeIndentPastParent(): number;
    set alternateNodeIndentPastParent(val: number);
    get alternateNodeSpacing(): number;
    set alternateNodeSpacing(val: number);
    get alternateLayerSpacing(): number;
    set alternateLayerSpacing(val: number);
    get alternateLayerSpacingParentOverlap(): number;
    set alternateLayerSpacingParentOverlap(val: number);
    get alternateCompaction(): EnumValue;
    set alternateCompaction(val: EnumValue);
    get alternateBreadthLimit(): number;
    set alternateBreadthLimit(val: number);
    get alternateRowSpacing(): number;
    set alternateRowSpacing(val: number);
    get alternateRowIndent(): number;
    set alternateRowIndent(val: number);
    static PathDefault: EnumValue;
    static PathDestination: EnumValue;
    static PathSource: EnumValue;
    static SortingForwards: EnumValue;
    static SortingReverse: EnumValue;
    static SortingAscending: EnumValue;
    static SortingDescending: EnumValue;
    static AlignmentCenterSubtrees: EnumValue;
    static AlignmentCenterChildren: EnumValue;
    static AlignmentStart: EnumValue;
    static AlignmentEnd: EnumValue;
    static AlignmentBus: EnumValue;
    static AlignmentBusBranching: EnumValue;
    static AlignmentTopLeftBus: EnumValue;
    static AlignmentBottomRightBus: EnumValue;
    static CompactionNone: EnumValue;
    static CompactionBlock: EnumValue;
    static StyleLayered: EnumValue;
    static StyleLastParents: EnumValue;
    static StyleAlternating: EnumValue;
    static StyleRootOnly: EnumValue;
    static ArrangementVertical: EnumValue;
    static ArrangementHorizontal: EnumValue;
    static ArrangementFixedRoots: EnumValue;
    static LayerIndividual: EnumValue;
    static LayerSiblings: EnumValue;
    static LayerUniform: EnumValue;
    copy(): TreeLayout;
    createNetwork(): LayoutNetwork;
    /** 官方 TreeLayout.makeNetwork — 排除 Comment/linkLabel，过滤非法链接 */
    makeNetwork(coll: any): LayoutNetwork;
    doLayout(coll: any): void;
    private _allVertexes;
    private _uninitialized;
    private _initTrees;
    /** 官方 findRoots */
    private _findRoots;
    /** 官方 dI — 选连接最少的顶点作根 */
    private _pickRoot;
    /** 官方 walkTree (tT) */
    private _walkTree;
    /** 官方 walkOK (gI) */
    private _walkOK;
    /** 官方 isAncestor (vB) — a 是否为 b 的祖先 */
    private _isAncestor;
    /** 官方 removeChild (WB) */
    private _removeChild;
    private _initializeCounts;
    private _initializeTree;
    /** 官方 mom (jB) — 按 treeStyle 选择继承来源顶点 */
    private _mom;
    private _initializeTreeVertexValues;
    private _assignTreeValues;
    private _assignTree;
    private _sortTrees;
    private _sortTree;
    private _sortTreeChildren;
    private _addCommentsAll;
    /** 官方 isBusAlignment */
    isBusAlignment(a: EnumValue): boolean;
    /** 官方 vw — 是否 Bus/BusBranching */
    private _isBusBranching;
    /** 官方 iT — isLeftSideBus */
    private _isLeftSideBus;
    private _addComments;
    private _layoutTreeReal;
    private _layoutTree;
    /** 官方 orthoAngle */
    orthoAngle(v: TreeVertex): number;
    /** 官方 computeLayerSpacing */
    computeLayerSpacing(v: TreeVertex): number;
    /** 官方 computeNodeIndent */
    computeNodeIndent(v: TreeVertex): number;
    /** 官方 computeBusNodeSpacing */
    private _computeBusNodeSpacing;
    /** 官方 computeBusLastRowSpacing */
    private _computeBusLastRowSpacing;
    /** 官方 ke — 分配点数组 */
    private _ke;
    /** 官方 bn — 回收点数组 */
    private _bn;
    /** 官方 recordMidPoints (Ik) */
    private _recordMidPoints;
    /** 官方 shiftRelPos (Iu) */
    private _shiftRelPos;
    /** 官方 nT — 按 alignment 拆分偏移 */
    private _alignOffset;
    /** 官方 Bc — shiftRelPosAlign */
    private _shiftRelPosAlign;
    /** 官方 Ek — 平移点数组 */
    private _shiftPoints;
    /** 官方 calculateSubwidth (eT) */
    private _calculateSubwidth;
    /** 官方 calculateSubheight (sT) */
    private _calculateSubheight;
    /** 官方 customAlignment — 子类可覆盖 */
    protected customAlignment(_v: TreeVertex, dx: number, dy: number, w: number, h: number): number[];
    /** 官方 tV — merge fringes（垂直方向推进） */
    private _mergeFringesX;
    /** 官方 ZB */
    private _mergeFringesY;
    /** 官方 iV */
    private _mergeFringesX2;
    /** 官方 QB */
    private _mergeFringesY2;
    /** 官方 _B — minimum separation (x-fringes) */
    private _minSepX;
    /** 官方 $B — minimum separation (y-fringes) */
    private _minSepY;
    /** 官方 mergeFringes (SI) — 合并父/子边线并返回子顶点的新块位置 */
    private _mergeFringes;
    /** 官方 layoutBusChildrenPosDir (xI) */
    private _layoutBusChildrenPosDir;
    /** 官方 layoutBusChildrenNegDir (bI) */
    private _layoutBusChildrenNegDir;
    /** 官方 fixRelativePostions (Ok) */
    private _fixRelativePositions;
    private _layoutTreeNone;
    private _layoutTreeBlock;
    arrangeTrees(): void;
    /** 官方 oT — 递归赋绝对坐标（官方 vertex.x/y 即 bounds.x/y） */
    private _assignAbsolutePositions;
    commitLayout(): void;
    private _commitNodes;
    private _commitLinks;
    /** 官方 QA — Uniform 层矩形 */
    private _commitLayerRects;
    /** 官方 commitLayers — 子类可覆盖 */
    protected commitLayers(_rects: Rect[], _offset: Point): void;
    /** 官方 Vw — 遍历所有根设置端口 Spot */
    private _setPortSpotsAll;
    /** 官方 kI — 递归设置端口 Spot */
    private _setPortSpotsTree;
    /** 官方 setPortSpots */
    setPortSpots(v: TreeVertex): void;
    /** 官方 setPortSpots 中 portSpot 的默认取值 */
    private _defaultPortSpot;
    /** 官方 setPortSpots 中 childPortSpot 的默认取值 */
    private _defaultChildPortSpot;
    /** 官方 eV — setPortSpotsBus */
    private _setPortSpotsBus;
    /** 官方 layoutComments — 摆放 Comment 节点 */
    layoutComments(v: TreeVertex): void;
    /** 官方 layoutComments 内联的 Comment 链接 Spot 设置 */
    private _setCommentLinkSpots;
    get alternateChildPortSpot(): Spot;
    set alternateChildPortSpot(val: Spot);
    get alternatePortSpot(): Spot;
    set alternatePortSpot(val: Spot);
    get alternateSetsChildPortSpot(): boolean;
    set alternateSetsChildPortSpot(val: boolean);
    get alternateSetsPortSpot(): boolean;
    set alternateSetsPortSpot(val: boolean);
    get alternateComparer(): (a: TreeVertex, b: TreeVertex) => number;
    set alternateComparer(val: (a: TreeVertex, b: TreeVertex) => number);
    get alternateCommentMargin(): number;
    set alternateCommentMargin(val: number);
    get alternateCommentSpacing(): number;
    set alternateCommentSpacing(val: number);
    findRoots(): void;
    initializeTreeVertexValues(v: TreeVertex): void;
    assignTreeVertexValues(v: TreeVertex): void;
    sortTreeVertexChildren(v: TreeVertex): void;
    layoutTree(v: TreeVertex): void;
    addComments(v: TreeVertex): void;
    computeBusNodeSpacing(c: TreeVertex): number;
    computeBusLastRowSpacing(c: TreeVertex, dir: number): number;
    commitNodes(): void;
    commitLinks(): void;
}

/**
 * ForceDirectedLayout - positions nodes using a force-directed (spring-electric) algorithm.
 * Nodes repel each other (electrical charge), edges attract connected nodes (springs),
 * and gravity pulls nodes toward the center.
 */
declare class ForceDirectedLayout extends Layout {
    static readonly className: string;
    /** 官方 `ForceDirectedLayout.constructor(init?)`：`t && Object.assign(this, t)` */
    constructor(init?: any);
    private _maxIterations;
    private _defaultSpringLength;
    private _defaultSpringStiffness;
    private _defaultElectricalCharge;
    private _defaultGravity;
    private _infinityDistance;
    private _epsilon;
    private _arrangementSpacing;
    private _arrangesToOrigin;
    private _defaultGravitationalMass;
    private _theta;
    private _setsPortSpots;
    private _springLength;
    private _springStiffness;
    private _randomNumberGenerator;
    private _electricalCharge;
    private _gravitationalMass;
    private _currentIteration;
    private _comments;
    private _maxPrelayoutIterations;
    private _epsilonDistance;
    private _moveLimit;
    private _defaultCommentSpringLength;
    private _defaultCommentElectricalCharge;
    private _prelayoutQuality;
    private _prelayoutSpread;
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
    get arrangementSpacing(): Size;
    set arrangementSpacing(val: Size);
    get arrangesToOrigin(): boolean;
    set arrangesToOrigin(val: boolean);
    get defaultGravitationalMass(): number;
    set defaultGravitationalMass(val: number);
    get theta(): number;
    set theta(val: number);
    get setsPortSpots(): boolean;
    set setsPortSpots(val: boolean);
    get springLength(): number;
    set springLength(val: number);
    get springStiffness(): number;
    set springStiffness(val: number);
    get randomNumberGenerator(): (() => number) | null;
    set randomNumberGenerator(val: (() => number) | null);
    get electricalCharge(): number;
    set electricalCharge(val: number);
    get gravitationalMass(): number;
    set gravitationalMass(val: number);
    get currentIteration(): number;
    get comments(): boolean;
    set comments(val: boolean);
    get maxPrelayoutIterations(): number;
    set maxPrelayoutIterations(val: number);
    get epsilonDistance(): number;
    set epsilonDistance(val: number);
    get moveLimit(): number;
    set moveLimit(val: number);
    get defaultCommentSpringLength(): number;
    set defaultCommentSpringLength(val: number);
    get defaultCommentElectricalCharge(): number;
    set defaultCommentElectricalCharge(val: number);
    get prelayoutQuality(): number;
    set prelayoutQuality(val: number);
    get prelayoutSpread(): number;
    set prelayoutSpread(val: number);
    needsPrelayout(): boolean;
    doConnectedSubnetLayout(t: LayoutNetwork): void;
    computePairwiseDistances(t: LayoutNetwork): number[][];
    coarsenNetwork(t: LayoutNetwork): LayoutNetwork;
    addComments(v: LayoutVertex): void;
    moveVertex(v: LayoutVertex): number;
    shouldInteract(v1: LayoutVertex, v2: LayoutVertex): boolean;
    moveFixedVertex(v: LayoutVertex): void;
    commitNodes(): void;
    commitLinks(): void;
    electricalFieldX(x: number, y: number): number;
    electricalFieldY(x: number, y: number): number;
    gravitationalFieldX(x: number, y: number): number;
    gravitationalFieldY(x: number, y: number): number;
    isFixed(v: LayoutVertex): boolean;
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
    static readonly className: string;
    /** 官方 `LayeredDigraphLayout.constructor(init?)`：`t && Object.assign(this, t)` */
    constructor(init?: any);
    private _direction;
    private _layerSpacing;
    private _columnSpacing;
    private _setsPortSpots;
    private _aggressiveOption;
    private _packOption;
    private _layeringOption;
    private _cycleRemoveOption;
    private _initializeOption;
    private _iterations;
    private _packIterations;
    private _alignOption;
    private _centered;
    private _maxLayer;
    private _maxIndex;
    private _maxColumn;
    private _minIndexLayer;
    private _maxIndexLayer;
    get direction(): number;
    set direction(val: number);
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
    get initializeOption(): EnumValue;
    set initializeOption(val: EnumValue);
    get iterations(): number;
    set iterations(val: number);
    get packIterations(): number;
    set packIterations(val: number);
    get alignOption(): EnumValue;
    set alignOption(val: EnumValue);
    get centered(): boolean;
    set centered(val: boolean);
    get maxLayer(): number;
    get maxIndex(): number;
    get maxColumn(): number;
    get minIndexLayer(): number;
    get maxIndexLayer(): number;
    /** 官方 protected linkMinLength(edge)：默认最小长度 1 */
    linkMinLength(edge: LayoutEdge): number;
    /** 官方 protected linkLengthWeight(edge)：默认权重 1 */
    linkLengthWeight(edge: LayoutEdge): number;
    /** 官方 protected linkStraightenWeight(edge)：人工节点权重更高 */
    linkStraightenWeight(edge: LayoutEdge): number;
    /** 层与层之间推进的方向：90/270 为竖直（向下/向上），0/180 为水平（向右/向左） */
    private get _isVertical();
    /** 是否与正方向相反（向上/向左） */
    private get _isReversed();
    /** 官方 protected nodeMinLayerSpace(v, topleft)：默认预留的层内空间 */
    nodeMinLayerSpace(v: LayoutVertex, topleft: boolean): number;
    /** 官方 protected nodeMinColumnSpace(v, topleft)：默认按 columnSpacing 折算列空间 */
    nodeMinColumnSpace(v: LayoutVertex, topleft: boolean): number;
    /** 官方 protected removeCycles()：基于网络移除环 */
    removeCycles(): void;
    /** 官方 protected assignLayers()：按当前 layeringOption 为网络分配层 */
    assignLayers(): void;
    /** 官方 protected initializeIndices()：为各层节点分配索引 */
    initializeIndices(): void;
    /** 官方 countCrossings()：统计当前排列下的交叉数 */
    countCrossings(): number;
    /** 官方 protected reduceCrossings()：减少同层节点间的连线交叉 */
    reduceCrossings(): void;
    /** 官方 protected straightenAndPack()：调整列位置以拉直连线并紧凑排列 */
    straightenAndPack(): void;
    /** 官方 protected commitLayers(layerRects, offset)：默认不做任何事 */
    commitLayers(layerRects: unknown[], offset: Point): void;
    /** 官方 protected commitNodes()：按顶点位置移动各节点 */
    commitNodes(): void;
    /** 官方 protected commitLinks()：更新各连线路由 */
    commitLinks(): void;
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
     *
     * v.x is the coordinate along the within-layer axis and v.y along the
     * layer-progression axis; both are measured from 0. Official GoJS advances
     * the layer axis by the previous layer's maximum thickness plus
     * layerSpacing, and spaces nodes inside a layer by their own breadth plus
     * columnSpacing - so nodes never overlap.
     */
    private _positionNodes;
    static CycleDepthFirst: EnumValue;
    static CycleGreedy: EnumValue;
    static CycleFromLayers: EnumValue;
    static LayerOptimalLinkLength: EnumValue;
    static LayerLongestPathSink: EnumValue;
    static LayerLongestPathSource: EnumValue;
    static InitDepthFirstOut: EnumValue;
    static InitDepthFirstIn: EnumValue;
    static InitNaive: EnumValue;
    static AggressiveNone: EnumValue;
    static AggressiveLess: EnumValue;
    static AggressiveMore: EnumValue;
    static PackNone: EnumValue;
    static PackExpand: EnumValue;
    static PackStraighten: EnumValue;
    static PackMedian: EnumValue;
    static PackAll: EnumValue;
    static AlignNone: EnumValue;
    static AlignUpperLeft: EnumValue;
    static AlignUpperRight: EnumValue;
    static AlignLowerLeft: EnumValue;
    static AlignLowerRight: EnumValue;
    static AlignAll: EnumValue;
}

/**
 * CircularLayout - arranges nodes in a circle or circular pattern.
 */
declare class CircularLayout extends Layout {
    static readonly className: string;
    /** 官方 `CircularLayout.constructor(init?)`：`t && Object.assign(this, t)` */
    constructor(init?: any);
    private _radius;
    private _startAngle;
    private _sweepAngle;
    private _arrangement;
    private _spacing;
    private _direction;
    private _aspectRatio;
    private _actualXRadius;
    private _actualYRadius;
    private _sorting;
    private _comparer;
    private _nodeDiameterFormula;
    private _actualSpacing;
    /** 最近一次布局产生的子网络（splitIntoSubNetworks 会把顶点搬进去，
     *  主网络 vertexes 因此变空，commitNodes/commitLinks 需要遍历它们）。 */
    private _lastSubNetworks;
    private _actualCenter;
    get radius(): number;
    set radius(val: number);
    get startAngle(): number;
    set startAngle(val: number);
    get sweepAngle(): number;
    set sweepAngle(val: number);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue | number);
    get spacing(): number;
    set spacing(val: number);
    get direction(): EnumValue;
    set direction(val: EnumValue | number);
    get aspectRatio(): number;
    set aspectRatio(val: number);
    get actualXRadius(): number;
    get actualYRadius(): number;
    get sorting(): EnumValue;
    set sorting(val: EnumValue | number);
    get comparer(): ((a: any, b: any) => number) | null;
    set comparer(val: ((a: any, b: any) => number) | null);
    get nodeDiameterFormula(): EnumValue;
    set nodeDiameterFormula(val: EnumValue | number);
    get actualSpacing(): number;
    get actualCenter(): Point;
    /**
     * 官方 4.0 的这些枚举是**数字**（go.d.ts: CircularArrangement 0..3、CircularDirection 10..13、
     * CircularSorting 20..24、CircularNodeDiameterFormula 30..31），官方样例也是直接写数字或
     * go.CircularArrangement.Packed。本项目内部用 EnumValue 对象，所以要把两边都接受。
     */
    private _enum;
    copy(): CircularLayout;
    doLayout(coll: any): void;
    /**
     * Layout a single connected component in a circle.
     */
    private _layoutComponent;
    /**
     * Compute an appropriate radius based on the vertex sizes and spacing.
     */
    /** 官方 nodeDiameterFormula：默认 Pythagorean = sqrt(w²+h²)，Circular 取较长边 */
    private _effectiveDiameter;
    /**
     * 官方 Qk(...)：周长 / 2π。
     * ConstantSpacing/Packed 用 Σ有效直径 + 间隙数×spacing（间隙数在整圈时等于节点数），
     * 这与官方对 4 个 25px 节点给出的 r=26.33 完全一致。
     */
    private _computeRadius;
    commitNodes(): void;
    /** 提交时要遍历的网络：有子网络就遍历子网络，否则遍历主网络 */
    private _commitNetworks;
    commitLinks(): void;
    static ConstantSpacing: EnumValue;
    static ConstantDistance: EnumValue;
    static ConstantAngle: EnumValue;
    static Packed: EnumValue;
    static Clockwise: EnumValue;
    static Counterclockwise: EnumValue;
    static BidirectionalLeft: EnumValue;
    static BidirectionalRight: EnumValue;
    static Forwards: EnumValue;
    static Reverse: EnumValue;
    static Ascending: EnumValue;
    static Descending: EnumValue;
    static Optimized: EnumValue;
    static Pythagorean: EnumValue;
    static Circular: EnumValue;
}

/**
 * TreeNetwork - TreeLayout 使用的网络，顶点为 TreeVertex，边为 TreeEdge。
 */
declare class TreeNetwork extends LayoutNetwork {
    static readonly className: string;
    createVertex(): LayoutVertex;
    createEdge(): LayoutEdge;
}

/**
 * TreeEdge - TreeLayout 专用边（官方 TreeEdge 的移植）。
 * relativePoint（官方 Uk）由布局期间的 recordMidPoints 记录，
 * 供 TreeEdge.commit 的链接路由修正使用。
 */
declare class TreeEdge extends LayoutEdge {
    static readonly className: string;
    /** 官方 Uk — 相对父顶点的中途点 */
    relativePoint: Point;
}

/** 官方 `CircularNetwork extends LayoutNetwork`（go.d.ts） */
declare class CircularNetwork extends LayoutNetwork {
    static readonly className: string;
    constructor(layout?: any);
    createVertex(): LayoutVertex;
    createEdge(): LayoutEdge;
}

/** 官方 `CircularVertex extends LayoutVertex`：多一个 diameter（由 CircularLayout 填） */
declare class CircularVertex extends LayoutVertex {
    static readonly className: string;
    private _diameter;
    constructor(network?: CircularNetwork | null);
    get diameter(): number;
    set diameter(value: number);
}

/** 官方 `CircularEdge extends LayoutEdge` */
declare class CircularEdge extends LayoutEdge {
    static readonly className: string;
    constructor(network?: CircularNetwork | null);
}

/**
 * 官方 `Quadtree<T>`（go.d.ts: class Quadtree）——
 * 四叉树空间索引，官方用于 `Diagram.findObjectsIn/near` 与 AvoidsNodesRouter。
 */
declare class Quadtree<T = any> {
    static readonly className: string;
    private _bounds;
    private _level;
    private _maxObjects;
    private _maxLevels;
    private _isLeaf;
    private _objects;
    private _northWest;
    private _northEast;
    private _southWest;
    private _southEast;
    constructor(x: number, y: number, w: number, h: number, maxObjects?: number, maxLevels?: number, level?: number);
    get bounds(): Rect;
    get level(): number;
    get isLeaf(): boolean;
    /** 官方 Quadtree.clear() */
    clear(): void;
    /** 官方 Quadtree.reinitialize(maxObjects?) */
    reinitialize(maxObjects?: number): void;
    /** 官方 Quadtree.resize(rect, inflate?) */
    resize(rect: Rect, inflate?: number): void;
    /** 官方 Quadtree.set(obj, bounds) —— 返回 false 表示 obj 与已有对象重叠 */
    set(obj: T, bounds: Rect): boolean;
    /** 官方 Quadtree.add(obj, bounds) */
    add(obj: T, bounds: Rect): boolean;
    /** 官方 Quadtree.setTo(obj, x, y, w?, h?) */
    setTo(obj: T, x: number, y: number, w?: number, h?: number): boolean;
    /** 官方 Quadtree.find(r, result?) —— 找出与 r 相交（或包含 r）的对象 */
    find(r: Rect, result?: Set<T>): Set<T>;
    /** 官方 Quadtree.findIn(x, y, w?, h?) */
    findIn(x: number, y: number, w?: number, h?: number, result?: Set<T>): Set<T>;
    /** 官方 Quadtree.delete(obj, fast?) */
    delete(obj: T, fast?: boolean): boolean;
    /** 官方 Quadtree.remove(obj, fast?) */
    remove(obj: T, fast?: boolean): boolean;
    /** 官方 Quadtree.move(obj, rect, fast?) */
    move(obj: T, rect: Rect, fast?: boolean): void;
    /** 官方 Quadtree.moveTo(obj, x, y, w, h, fast?) */
    moveTo(obj: T, x: number, y: number, w: number, h: number, fast?: boolean): void;
    /** 官方 Quadtree.toMap(allObjects?) */
    toMap(allObjects?: Map$1<T, Rect>): Map$1<T, Rect>;
    private _split;
    private _intersects;
    private _addToChild;
    private _find;
}

/**
 * 官方 `Themes`（go.d.ts: class Themes）—— ThemeManager 内置的 light / dark 两套主题。
 * 值与官方 go.js 里的 `Themes.Light` / `Themes.Dark` 逐项一致。
 */
declare class Themes {
    static readonly className: string;
    static readonly Light: {
        colors: {
            text: string;
            comment: string;
            link: string;
            group: string;
            outline: string;
            selection: string;
            div: string;
            gridMinor: string;
            gridMajor: string;
            overviewBox: string;
            tempLink: string;
            tempPort: string;
            adornmentFill: string;
            adornmentStroke: string;
            dragSelect: string;
        };
        fonts: {
            normal: string;
            bold: string;
        };
        numbers: {
            group: number;
            selection: number;
        };
        margins: {
            group: Margin;
        };
        arrowheads: {
            toArrow: string;
        };
    };
    static readonly Dark: {
        colors: {
            text: string;
            comment: string;
            link: string;
            group: string;
            outline: string;
            selection: string;
            div: string;
            gridMinor: string;
            gridMajor: string;
            overviewBox: string;
            tempLink: string;
            tempPort: string;
            adornmentFill: string;
            adornmentStroke: string;
            dragSelect: string;
        };
        fonts: {
            normal: string;
            bold: string;
        };
        numbers: {
            group: number;
            selection: number;
        };
        margins: {
            group: Margin;
        };
        arrowheads: {
            toArrow: string;
        };
    };
}

/**
 * 官方 `DraggingInfo`（go.d.ts: class DraggingInfo）—— 拖动过程中被拖对象的初始位置。
 */
declare class DraggingInfo {
    static readonly className: string;
    private _point;
    constructor(pt?: Point);
    get point(): Point;
    set point(value: Point);
}

/**
 * 官方 `DraggingOptions`（go.d.ts: class DraggingOptions）——
 * DraggingTool / RelinkingTool / ResizingTool 共用的一组拖动选项。
 */
declare class DraggingOptions {
    static readonly className: string;
    isGridSnapEnabled: boolean;
    isGridSnapRealtime: boolean;
    gridSnapCellSize: Size;
    gridSnapCellSpot: Spot;
    gridSnapOrigin: Point;
    dragsLink: boolean;
    dragsTree: boolean;
    groupsSnapMembers: boolean;
    groupsAlwaysMove: boolean;
    dragsMembers: boolean;
    /** 官方 DraggingOptions.draggingInfo（可多个；工具内部用来记录拖动起点） */
    draggingInfo: DraggingInfo[];
    constructor(init?: Partial<DraggingOptions>);
    copy(): DraggingOptions;
}

/**
 * 官方 `ForceDirectedNetwork extends LayoutNetwork`（go.d.ts）
 *
 * 原来 `src/core/ForceDirectedNetwork.ts` 只有 21 行、`nodeArray/linkArray/commentArray`
 * 三个字段，和官方毫无关系；扩展 LinkLabelRouter 里
 * `new go.ForceDirectedNetwork(this)` + `net.addVertex(v)` 因此直接炸掉。
 */
declare class ForceDirectedNetwork extends LayoutNetwork {
    static readonly className: string;
    /** 官方 ForceDirectedNetwork.defaultSpringLength（默认弹簧长度） */
    defaultSpringLength: number;
    /** 官方 defaultElectricalCharge */
    defaultElectricalCharge: number;
    /** 官方 defaultGravitationalMass */
    defaultGravitationalMass: number;
    /** 官方 defaultCommentSpringLength */
    defaultCommentSpringLength: number;
    /** 官方 defaultCommentElectricalCharge */
    defaultCommentElectricalCharge: number;
    constructor(layout?: any);
    createVertex(): LayoutVertex;
    createEdge(): LayoutEdge;
}

/**
 * 官方 `ForceDirectedVertex`（go.d.ts: class ForceDirectedVertex extends LayoutVertex）
 *
 * 以前本文件是一个与 LayoutVertex **毫无关系**的空壳（key/position/mass/charge），
 * 于是 `ForceDirectedLayout.doLayout` 与扩展（LinkLabelRouter 的 `LabelVertex extends
 * go.ForceDirectedVertex`、`new go.ForceDirectedNetwork(this)`、`net.addVertex(v)`）
 * 完全对不上——`net.addVertex is not a function` 就是这么来的。
 */
declare class ForceDirectedVertex extends LayoutVertex {
    static readonly className: string;
    private _isFixed;
    private _charge;
    private _mass;
    private _forceX;
    private _forceY;
    constructor(network?: ForceDirectedNetwork | null);
    get isFixed(): boolean;
    set isFixed(value: boolean);
    get charge(): number;
    set charge(value: number);
    get mass(): number;
    set mass(value: number);
    get forceX(): number;
    set forceX(value: number);
    get forceY(): number;
    set forceY(value: number);
}

/**
 * 官方 `ForceDirectedEdge`（go.d.ts: class ForceDirectedEdge extends LayoutEdge）
 *
 * 原来是与 LayoutEdge 无关的空壳（from/to/length/route/stroke…），
 * `ForceDirectedLayout` 与扩展拿到的边没有 `fromVertex`/`toVertex`/`stiffness`。
 */
declare class ForceDirectedEdge extends LayoutEdge {
    static readonly className: string;
    private _stiffness;
    private _springLength;
    constructor(network?: ForceDirectedNetwork | null);
    get stiffness(): number;
    set stiffness(value: number);
    /** 弹簧的自然长度（官方默认取 network.defaultSpringLength） */
    get springLength(): number;
    set springLength(value: number);
}

declare class LayeredDigraphNetwork {
    static readonly className: string;
    /** The name of this network. */
    name: string;
    /** The vertices in this network. */
    vertexArray: any[];
    /** The edges in this network. */
    edgeArray: any[];
    /** The comments in this network. */
    commentArray: any[];
    constructor(name: string);
}

declare class LayeredDigraphVertex {
    static readonly className: string;
    /** The key of this vertex. */
    key: any;
    /** The position of this vertex. */
    position: any;
    /** The comments for this vertex. */
    comments: any[];
    /** The links connected to this vertex. */
    linkConnected: any[];
    /** The network this vertex belongs to. */
    network: any;
}

declare class LayeredDigraphEdge {
    static readonly className: string;
    /** The from vertex of this edge. */
    fromVertex: any;
    /** The to vertex of this edge. */
    toVertex: any;
    /** The label of this edge. */
    label: string;
    /** The directed edge index. */
    directedEdge: number;
    /** The relative so far. */
    relativeSoFar: number;
    /** The count of so far. */
    countSoFar: number;
    /** The count of so far relative. */
    countSoFarRelative: number;
    /** The count to child. */
    countToChild: number;
    /** The count to child relative. */
    countToChildRelative: number;
    /** Is this edge already routed. */
    isRouted: boolean;
    /** Is this edge routed from child. */
    isRoutedFromChild: boolean;
    /** Is this edge from left. */
    isFromLeft: boolean;
    /** Is this edge from right. */
    isFromRight: boolean;
    /** Is this edge from top. */
    isFromTop: boolean;
    /** Is this edge from bottom. */
    isFromBottom: boolean;
    /** Is this edge from left child. */
    isFromLeftChild: boolean;
    /** Is this edge from right child. */
    isFromRightChild: boolean;
    /** Is this edge from top child. */
    isFromTopChild: boolean;
    /** Is this edge from bottom child. */
    isFromBottomChild: boolean;
    /** Is this edge from left sibling. */
    isFromLeftSibling: boolean;
    /** Is this edge from right sibling. */
    isFromRightSibling: boolean;
    /** Is this edge from top sibling. */
    isFromTopSibling: boolean;
    /** Is this edge from bottom sibling. */
    isFromBottomSibling: boolean;
}

declare class ThemeBinding {
    static readonly className: string;
    /** The name of the binding. */
    name: string;
    /** The source property name. */
    sourceProperty: string;
    /** The target property name. */
    targetProperty: string;
    /** The converter function. */
    converter: (value: any) => any;
    /** The target object. */
    target: any;
    constructor(name: string, sourceProperty: string, targetProperty: string, converter?: (value: any) => any);
}

/**
 * Router - base class for diagram routers (`diagram.routers`).
 *
 * 官方 Router 移植（go-debug `class Router`）：
 * - name/isEnabled/isRealtime/diagram 属性；set diagram 时使路由失效并 requestUpdate
 * - canRoute(container)：isEnabled=false 或（非 realtime 且图处于跳过路由状态）/动画 tick 中返回 false
 * - isRoutable(link, container) 默认 true；routeLinks(links, container) 默认空
 * - invalidateRouter()
 */
declare class Router {
    static readonly className: string;
    private _name;
    private _isEnabled;
    private _isRealtime;
    private _diagram;
    constructor();
    get name(): string;
    set name(val: string);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    get isRealtime(): boolean;
    set isRealtime(val: boolean);
    get diagram(): any;
    set diagram(val: any);
    /** 使本路由器的路由失效并触发重新路由 */
    invalidateRouter(): void;
    /** 官方：isEnabled 且（realtime 或非跳过状态），动画 tick 中不路由 */
    canRoute(container: any): boolean;
    /** 是否允许路由指定 link */
    isRoutable(link: any, container: any): boolean;
    /** 对给定 link 集合执行路由；基类为空实现 */
    routeLinks(links: any, container: any): void;
    toString(): string;
}

/**
 * AnimationTrigger - defines an animation that should run when a named property changes.
 */
declare class AnimationTrigger {
    static readonly className: string;
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

/** 图形生成函数：与官方 `Shape.defineFigureGenerator` 的签名一致（shape 可能为 undefined）。 */
type FigureGenerator = (shape: any, w: number, h: number) => Geometry;
/**
 * 全部图形生成器。值为生成函数，或另一个已注册图形名的字符串别名
 * （官方 `defineFigureGenerator(name, 'Other')`，如 StoredData -> DataStorage）。
 */
declare const figures: Map$1<string, FigureGenerator | string>;
/** 按图形名取几何；`p1/p2` 对应官方传入的 parameter1/parameter2。 */
declare function getFigureGeometry(name: string, w: number, h: number, p1?: number, p2?: number, shape?: any): Geometry | null;

/** 本包版本（官方 GoJS 同名导出 `go.version` 为 "4.0.4"，此处诚实地报告自身版本）。 */
declare const version = "0.1.0";

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
    AvoidsNodesStraight: EnumValue;
};
declare const ScrollMode: {
    Document: EnumValue;
    Infinite: EnumValue;
};
declare const Stretch: {
    None: EnumValue;
    Default: EnumValue;
    Fill: EnumValue;
    Vertical: EnumValue;
    Horizontal: EnumValue;
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
    Custom: EnumValue;
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
    ConstantSpacing: EnumValue;
    ConstantDistance: EnumValue;
    ConstantAngle: EnumValue;
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
    Less: EnumValue;
    More: EnumValue;
};
declare const LayeredDigraphAlign: {
    None: EnumValue;
    UpperLeft: EnumValue;
    UpperRight: EnumValue;
    LowerLeft: EnumValue;
    LowerRight: EnumValue;
    All: EnumValue;
};
declare const LayeredDigraphPack: {
    None: EnumValue;
    Expand: EnumValue;
    Straighten: EnumValue;
    Median: EnumValue;
    MaybeExpand: EnumValue;
    All: EnumValue;
};
declare const GridArrangement: {
    LeftToRight: EnumValue;
    RightToLeft: EnumValue;
};
declare const PanelTypes: {
    Auto: EnumValue;
    Position: EnumValue;
    Vertical: EnumValue;
    Horizontal: EnumValue;
    Spot: EnumValue;
    Table: EnumValue;
    TableColumn: EnumValue;
    TableRow: EnumValue;
    Viewbox: EnumValue;
    Link: EnumValue;
    Grid: EnumValue;
    Graduated: EnumValue;
};
declare const BindingMode: {
    OneWay: EnumValue;
    TwoWay: EnumValue;
};
declare const CircularDirection: {
    Clockwise: EnumValue;
    Counterclockwise: EnumValue;
    BidirectionalLeft: EnumValue;
    BidirectionalRight: EnumValue;
};
declare const LayeredDigraphDirection: {
    Down: number;
    Up: number;
    Left: number;
    Right: number;
};
declare const LayeredDigraphInit: {
    DepthFirstOut: EnumValue;
    DepthFirstIn: EnumValue;
    Naive: EnumValue;
};
declare const LayeredDigraphLayering: {
    OptimalLinkLength: EnumValue;
    LongestPathSink: EnumValue;
    LongestPathSource: EnumValue;
};
declare const LayeredDigraphCycleRemove: {
    DepthFirst: EnumValue;
    Greedy: EnumValue;
    FromLayers: EnumValue;
};
declare const ImageStretch: {
    None: EnumValue;
    Fill: EnumValue;
    Uniform: EnumValue;
    UniformToFill: EnumValue;
};
declare const Sizing: {
    Default: EnumValue;
    None: EnumValue;
    ProportionalExtra: EnumValue;
};
declare const Wrap: {
    None: EnumValue;
    Fit: EnumValue;
    DesiredSize: EnumValue;
    BreakAll: EnumValue;
};
declare const CycleMode: {
    All: EnumValue;
    NotDirected: EnumValue;
    NotDirectedFast: EnumValue;
    NotUndirected: EnumValue;
    DestinationTree: EnumValue;
    SourceTree: EnumValue;
};
declare const ChangeType: {
    Transaction: EnumValue;
    Property: EnumValue;
    Insert: EnumValue;
    Remove: EnumValue;
};

declare const AnimationStyle: {
    Default: EnumValue;
    AnimateLocations: EnumValue;
    None: EnumValue;
};
declare const LinkAdjusting: {
    None: EnumValue;
    End: EnumValue;
    Scale: EnumValue;
    Stretch: EnumValue;
};
declare const Orientation: {
    None: EnumValue;
    Along: EnumValue;
    Plus90: EnumValue;
    Minus90: EnumValue;
    Opposite: EnumValue;
    Upright: EnumValue;
    Plus90Upright: EnumValue;
    Minus90Upright: EnumValue;
    Upright45: EnumValue;
};
declare const GestureMode: {
    None: EnumValue;
    Cancel: EnumValue;
    Zoom: EnumValue;
};
declare const WheelMode: {
    Scroll: EnumValue;
    Zoom: EnumValue;
    None: EnumValue;
};
declare const TextEditingAccept: {
    LostFocus: EnumValue;
    MouseDown: EnumValue;
    Tab: EnumValue;
    Enter: EnumValue;
};
declare const TextEditingStarting: {
    SingleClick: EnumValue;
    SingleClickSelected: EnumValue;
    DoubleClick: EnumValue;
};
declare const LayoutConditions: {
    None: number;
    Added: number;
    Removed: number;
    Shown: number;
    Hidden: number;
    NodeSized: number;
    GroupLayout: number;
    NodeReplaced: number;
    Standard: number;
    All: number;
};

declare const LinkingDirection: {
    Either: EnumValue;
    ForwardsOnly: EnumValue;
    BackwardsOnly: EnumValue;
};
declare const TriggerStart: {
    Default: EnumValue;
    Immediate: EnumValue;
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

export { ActionTool, Adornment, AdornmentContextMenu, AdornmentLinkReshape, AdornmentRelink, AdornmentResize, AdornmentRotate, AdornmentSelection, AdornmentToolTip, Animation, AnimationDefault, AnimationEaseIn, AnimationEaseInOut, AnimationEaseOut, AnimationEaseOutBounce, AnimationLinear, AnimationManager, AnimationState, AnimationStyle, AnimationStyleAnimateLocations, AnimationStyleDefault, AnimationStyleNone, AnimationTrigger, Arrowheads, AutoScale, AutoScaleNone, AutoScaleUniform, AutoScaleUniformToFill, Binding, BindingMode, Brush, BrushLinear, BrushPattern, BrushRadial, BrushSolid, BrushType, Builders, CanvasRenderer, ChangeType, ChangedEvent, ChangedEventInsert, ChangedEventProperty, ChangedEventRemove, ChangedEventTransaction, CircularArrangement, CircularArrangementConstantAngle, CircularArrangementConstantDistance, CircularArrangementConstantRadius, CircularArrangementConstantSpacing, CircularArrangementPacked, CircularDirection, CircularDirectionBidirectionalLeft, CircularDirectionBidirectionalRight, CircularDirectionClockwise, CircularDirectionCounterclockwise, CircularEdge, CircularLayout, CircularNetwork, CircularNodeDiameterFormula, CircularNodeDiameterFormulaCircular, CircularNodeDiameterFormulaPythagorean, CircularSorting, CircularSortingAscending, CircularSortingDescending, CircularSortingForwards, CircularSortingOptimized, CircularSortingReverse, CircularVertex, ClickCreatingTool, ClickSelectingTool, CollapsePolicy, CollapsePolicyAllParents, CollapsePolicyAnyParents, CollapsePolicyTreeParent, Color, ColorSpace, ColorSpaceHSL, ColorSpaceLab, ColorSpaceOklch, CommandHandler, ContextMenuTool, Curve, CurveBezier, CurveJumpGap, CurveJumpOver, CurveNone, CycleAll, CycleDestinationTree, CycleMode, CycleNotDirected, CycleNotDirectedFast, CycleNotUndirected, CycleSourceTree, Diagram, DiagramEvent, DiagramEventAnimationFinished, DiagramEventAnimationStarting, DiagramEventChanged, DiagramEventClipboardChanged, DiagramEventGroupCollapsed, DiagramEventGroupExpanded, DiagramEventInitialAnimationStarting, DiagramEventInitialLayoutCompleted, DiagramEventLayoutCompleted, DiagramEventLinkDrawn, DiagramEventLinkRelinked, DiagramEventLinkReshaped, DiagramEventModelChanged, DiagramEventPartCreated, DiagramEventPartResized, DiagramEventPartRotated, DiagramEventSelectionCopied, DiagramEventSelectionDeleted, DiagramEventSelectionGrouped, DiagramEventSelectionMoved, DiagramEventSelectionMoved2, DiagramEventSelectionUngrouped, DiagramEventSubGraphCollapsed, DiagramEventSubGraphExpanded, DiagramEventTextEdited, DiagramEventUndoManagerStateChanged, DiagramEventViewportBoundsChanged, DragSelectingTool, DraggingInfo, DraggingOptions, DraggingTool, EnumValue, Figures, Flip, FlipBoth, FlipHorizontal, FlipNone, FlipVertical, ForceDirectedEdge, ForceDirectedLayout, ForceDirectedNetwork, ForceDirectedVertex, Geometry, GeometryStretch, GeometryStretchDefault, GeometryStretchFill, GeometryStretchNone, GeometryStretchUniform, GeometryStretchUniformToFill, GeometryType, GeometryTypeEllipse, GeometryTypeLine, GeometryTypePath, GeometryTypeRectangle, GestureMode, GestureModeCancel, GestureModeNone, GestureModeZoom, GraduatedPanCenter, GraduatedPanLeft, GraduatedPanNone, GraduatedPanRight, GraphLinksModel, GraphObject, GridAlignment, GridAlignmentLocation, GridAlignmentPosition, GridArrangement, GridArrangementBottomToTop, GridArrangementLeftToRight, GridArrangementRightToLeft, GridArrangementTopToBottom, GridLayout, GridLayoutCenter, GridLayoutLocation, GridSorting, GridSortingAscending, GridSortingDescending, GridSortingForwards, GridSortingReverse, GridWrappingFit, GridWrappingNone, Group, HTMLInfo, ImageStretch, ImageStretchFill, ImageStretchNone, ImageStretchUniform, ImageStretchUniformToFill, InputEvent, Layer, LayerAdornment, LayerBackground, LayerForeground, LayerGrid, LayerNames, LayerTool, LayeredDigraphAggressive, LayeredDigraphAggressiveAll, LayeredDigraphAggressiveHorizontal, LayeredDigraphAggressiveLess, LayeredDigraphAggressiveMore, LayeredDigraphAggressiveNone, LayeredDigraphAggressiveVertical, LayeredDigraphAlign, LayeredDigraphAlignAll, LayeredDigraphAlignBottom, LayeredDigraphAlignCenter, LayeredDigraphAlignLower, LayeredDigraphAlignLowerLeft, LayeredDigraphAlignLowerRight, LayeredDigraphAlignNone, LayeredDigraphAlignTop, LayeredDigraphAlignUpper, LayeredDigraphAlignUpperLeft, LayeredDigraphAlignUpperRight, LayeredDigraphCycleRemove, LayeredDigraphCycleRemoveDepthFirst, LayeredDigraphCycleRemoveFromLayers, LayeredDigraphCycleRemoveGreedy, LayeredDigraphDirection, LayeredDigraphDirectionDown, LayeredDigraphDirectionLeft, LayeredDigraphDirectionRight, LayeredDigraphDirectionUp, LayeredDigraphEdge, LayeredDigraphInit, LayeredDigraphInitDepthFirstIn, LayeredDigraphInitDepthFirstOut, LayeredDigraphInitNaive, LayeredDigraphLayering, LayeredDigraphLayeringLongestPathSink, LayeredDigraphLayeringLongestPathSource, LayeredDigraphLayeringOptimalLinkLength, LayeredDigraphLayout, LayeredDigraphNetwork, LayeredDigraphPack, LayeredDigraphPackAll, LayeredDigraphPackExpand, LayeredDigraphPackMaybeExpand, LayeredDigraphPackMedian, LayeredDigraphPackNone, LayeredDigraphPackStraighten, LayeredDigraphVertex, Layout, LayoutConditions, LayoutConditionsAdded, LayoutConditionsAll, LayoutConditionsGroupLayout, LayoutConditionsHidden, LayoutConditionsNodeReplaced, LayoutConditionsNodeSized, LayoutConditionsNone, LayoutConditionsRemoved, LayoutConditionsShown, LayoutConditionsStandard, LayoutEdge, LayoutNetwork, LayoutVertex, Link, LinkAdjusting, LinkAdjustingEnd, LinkAdjustingNone, LinkAdjustingScale, LinkAdjustingStretch, LinkReshapingTool, LinkingBaseTool, LinkingDirection, LinkingDirectionBackwardsOnly, LinkingDirectionEither, LinkingDirectionForwardsOnly, LinkingTool, List, Map$1 as Map, Margin, Model, Node, Orientation, OrientationAlong, OrientationMinus90, OrientationMinus90Upright, OrientationNone, OrientationOpposite, OrientationPlus180, OrientationPlus90, OrientationPlus90Upright, OrientationUpright, OrientationUpright45, Overflow, OverflowClip, OverflowEllipsis, Overview, Palette, Panel, PanelAuto, PanelGraduated, PanelGrid, PanelHorizontal, PanelLayout, PanelLink, PanelPosition, PanelSpot, PanelTable, PanelTableColumn, PanelTableRow, PanelTypes, PanelVertical, PanelViewbox, PanningTool, Part, PathFigure, PathSegment, PathSegmentArc, PathSegmentClose, PathSegmentCubicBezier, PathSegmentLine, PathSegmentMoveTo, PathSegmentQuadraticBezier, Picture, Placeholder, Point, PortSpreading, PortSpreadingEvenly, PortSpreadingNone, PortSpreadingPacked, Quadtree, Rect, RelinkingTool, ReshapingBehavior, ReshapingBehaviorAll, ReshapingBehaviorHorizontal, ReshapingBehaviorNone, ReshapingBehaviorVertical, ResizingTool, RotatingTool, Router, Routing, RoutingAvoidsNodes, RoutingAvoidsNodesStraight, RoutingNone, RoutingNormal, RoutingOrthogonal, RowColumnDefinition, ScrollDocument, ScrollInfinite, ScrollMode, SegmentOrientationAlong, SegmentOrientationNone, SegmentOrientationOpposite, SegmentOrientationOrthogonal, SegmentOrientationParallel, SegmentOrientationPerpendicular, SegmentType, SegmentTypeBezier, SegmentTypeMove, SegmentTypeSvgArc, Set, Shape, Size, Sizing, SizingAuto, SizingDefault, SizingNone, SizingProp, SizingProportionalExtra, Spot, Stretch, StretchDefault, StretchFill, StretchHorizontal, StretchNone, StretchUniform, StretchUniformToFill, StretchVertical, TextBlock, TextEditingAccept, TextEditingAcceptEnter, TextEditingAcceptLostFocus, TextEditingAcceptMouseDown, TextEditingAcceptTab, TextEditingStarting, TextEditingStartingDoubleClick, TextEditingStartingSingleClick, TextEditingStartingSingleClickSelected, TextEditingState, TextEditingStateActive, TextEditingStateEditing, TextEditingStateInvalid, TextEditingStateNone, TextEditingStateValidated, TextEditingStateValidating, TextEditingTool, TextFormat, TextFormatNone, TextFormatTrim, TextOverflow, ThemeBinding, ThemeManager, Themes, Tool, ToolManager, ToolNames, Transaction, TreeAlignment, TreeAlignmentBottomRightBus, TreeAlignmentBus, TreeAlignmentBusBranching, TreeAlignmentCenterChildren, TreeAlignmentCenterSubtrees, TreeAlignmentCustom, TreeAlignmentEnd, TreeAlignmentStart, TreeAlignmentTopLeftBus, TreeArrangement, TreeArrangementFixedRoots, TreeArrangementHorizontal, TreeArrangementVertical, TreeCompaction, TreeCompactionBlock, TreeCompactionNone, TreeEdge, TreeLayerStyle, TreeLayerStyleIndividual, TreeLayerStyleSiblings, TreeLayerStyleUniform, TreeLayout, TreeModel, TreeNetwork, TreePath, TreePathDefault, TreePathDestination, TreePathSource, TreeSorting, TreeSortingAscending, TreeSortingDescending, TreeSortingForwards, TreeSortingReverse, TreeStyle, TreeStyleAlternating, TreeStyleCompact, TreeStyleLastParents, TreeStyleLayered, TreeStyleRootOnly, TreeVertex, TriggerStart, TriggerStartBundled, TriggerStartDefault, TriggerStartImmediate, UndoManager, VerticalBottom, VerticalCenter, VerticalTop, ViewboxStretch, ViewboxStretchFill, ViewboxStretchNone, ViewboxStretchUniform, ViewboxStretchUniformToFill, WheelMode, WheelModeNone, WheelModeScroll, WheelModeZoom, Wrap, WrapBreakAll, WrapDesiredSize, WrapFit, WrapNone, figures, getFigureGeometry, version };
export type { AnimationConfig, BrushLike, BrushStop, ChangedEventListener, IKeyValuePair, IMapIterator, Iterable$1 as Iterable, Iterator, MarginLike, ObjectData };
