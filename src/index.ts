import './core/Polyfill';

// ==== 阶段 3: 通配导出 EnumValues，避免手工维护两份常量清单（新增枚举值自动可见）====
export * from './core/EnumValues';

// ==== 阶段 3: 官方命名空间枚举对象（成员集合与官方 gojs@4.0.4 运行时一致）====
export {
  Flip, TextFormat, PortSpreading, CollapsePolicy, ViewboxStretch, BrushType,
  ColorSpace, CircularNodeDiameterFormula, ReshapingBehavior, TextEditingState,
  Figures, Arrowheads, ToolNames, Builders, LayerNames,
} from './core/EnumNamespaces';


export { Iterable, Iterator, IMapIterator } from './core/Iterable';
export { IKeyValuePair } from './core/IKeyValuePair';
export { List } from './core/List';
export { Map } from './core/Map';
export { Set } from './core/Set';
export { Point } from './core/Point';
export { Size } from './core/Size';
export { Rect } from './core/Rect';
export { Spot } from './core/Spot';
export { Margin, MarginLike } from './core/Margin';
export { Geometry } from './core/Geometry';
export { PathFigure } from './core/PathFigure';
export { PathSegment } from './core/PathSegment';
export { Brush, BrushLike, BrushStop, Color } from './core/Brush';

export { ChangedEvent } from './model/ChangedEvent';
export { Transaction } from './model/Transaction';
export { UndoManager } from './model/UndoManager';
export { Binding } from './model/Binding';
export { Model, ObjectData, ChangedEventListener } from './model/Model';
export { GraphLinksModel } from './model/GraphLinksModel';
export { TreeModel } from './model/TreeModel';

export { GraphObject } from './view/GraphObject';
export { Shape } from './view/Shape';
export { TextBlock } from './view/TextBlock';
export { Picture } from './view/Picture';
export { Panel } from './view/Panel';
export { PanelLayout } from './view/PanelLayout';
export { Part } from './view/Part';
export { Node } from './view/Node';
export { Link } from './view/Link';
export { Group } from './view/Group';
export { Adornment } from './view/Adornment';
export { Placeholder } from './view/Placeholder';
export { Layer } from './view/Layer';
export { RowColumnDefinition } from './view/RowColumnDefinition';

export { Diagram } from './diagram/Diagram';
export { Overview } from './diagram/Overview';
export { Palette } from './diagram/Palette';
export { InputEvent } from './diagram/InputEvent';
export { DiagramEvent } from './diagram/DiagramEvent';
export { ThemeManager } from './diagram/ThemeManager';
import './view/Builders';

export { Tool } from './tool/Tool';
export { ToolManager } from './tool/ToolManager';
export { ClickSelectingTool } from './tool/ClickSelectingTool';
export { DraggingTool } from './tool/DraggingTool';
export { DragSelectingTool } from './tool/DragSelectingTool';
export { LinkingBaseTool } from './tool/LinkingBaseTool';
export { LinkingTool } from './tool/LinkingTool';
export { RelinkingTool } from './tool/RelinkingTool';
export { LinkReshapingTool } from './tool/LinkReshapingTool';
export { ResizingTool } from './tool/ResizingTool';
export { RotatingTool } from './tool/RotatingTool';
export { TextEditingTool } from './tool/TextEditingTool';
export { PanningTool } from './tool/PanningTool';
export { ContextMenuTool } from './tool/ContextMenuTool';
export { ClickCreatingTool } from './tool/ClickCreatingTool';
export { ActionTool } from './tool/ActionTool';
export { HTMLInfo } from './tool/HTMLInfo';

export { Layout } from './layout/Layout';
export { LayoutNetwork } from './layout/LayoutNetwork';
export { LayoutVertex } from './layout/LayoutVertex';
export { LayoutEdge } from './layout/LayoutEdge';
export { GridLayout } from './layout/GridLayout';
export { TreeLayout } from './layout/TreeLayout';
export { ForceDirectedLayout } from './layout/ForceDirectedLayout';
export { LayeredDigraphLayout } from './layout/LayeredDigraphLayout';
export { CircularLayout } from './layout/CircularLayout';
// 阶段 3: 补齐官方已导出、本项目此前遗漏的类。
// TODO(阶段 7): ForceDirected/LayeredDigraph 的 Network 系列目前是独立桩类，
//   尚未接入各自 Layout（makeNetwork 仍返回 LayoutNetwork），也未继承 LayoutNetwork；
//   Router.getRoute() 目前返回 []，同属阶段 7。
export { TreeNetwork } from './layout/TreeNetwork';
export { TreeVertex } from './layout/TreeVertex';
export { TreeEdge } from './layout/TreeEdge';
export { CircularNetwork } from './core/CircularNetwork';
export { CircularVertex } from './core/CircularVertex';
export { CircularEdge } from './core/CircularEdge';
export { Quadtree } from './core/Quadtree';
export { Themes } from './core/Themes';
export { DraggingInfo } from './core/DraggingInfo';
export { DraggingOptions } from './tool/DraggingOptions';
export { ForceDirectedNetwork } from './core/ForceDirectedNetwork';
export { ForceDirectedVertex } from './core/ForceDirectedVertex';
export { ForceDirectedEdge } from './core/ForceDirectedEdge';
export { LayeredDigraphNetwork } from './core/LayeredDigraphNetwork';
export { LayeredDigraphVertex } from './core/LayeredDigraphVertex';
export { LayeredDigraphEdge } from './core/LayeredDigraphEdge';
export { ThemeBinding } from './core/ThemeBinding';
export { Router } from './core/Router';

/** 本包版本（官方 GoJS 同名导出 `go.version` 为 "4.0.4"，此处诚实地报告自身版本）。 */
export const version = '0.1.0';

export { Animation, AnimationState, AnimationConfig } from './animation/Animation';
export { AnimationTrigger } from './animation/AnimationTrigger';
export { AnimationManager } from './animation/AnimationManager';

export { CommandHandler } from './command/CommandHandler';

export { CanvasRenderer } from './render/CanvasRenderer';

export { figures, getFigureGeometry } from './figures/Figures';

// ============ GoJS Namespace Enum Objects ============
// 成员集合与官方 gojs@4.0.4 运行时逐一对齐（由 tests/compare/api-diff.test.ts 自动比对）。
// 注意：官方这些枚举是 TS `declare enum`（数值），本项目用 EnumValue 单例表示，
// 因此**只保证成员集合一致，不保证数值一致**；`LayoutConditions` 例外（位掩码，见 EnumValues.ts）。
import {
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable,
  PanelPosition, PanelGrid, PanelViewbox, PanelGraduated, PanelLink,
  PanelTableColumn, PanelTableRow,
  StretchDefault, StretchFill, StretchNone,
  StretchHorizontal, StretchVertical,
  RoutingNormal, RoutingOrthogonal, RoutingAvoidsNodes, RoutingAvoidsNodesStraight,
  CurveNone, CurveBezier, CurveJumpOver, CurveJumpGap,
  WrapFit, WrapDesiredSize, WrapNone, WrapBreakAll,
  ImageStretchNone, ImageStretchFill, ImageStretchUniform, ImageStretchUniformToFill,
  SizingDefault, SizingNone, SizingProportionalExtra,
  TreeStyleLayered, TreeStyleAlternating, TreeStyleLastParents, TreeStyleRootOnly,
  TreePathDefault, TreePathDestination, TreePathSource,
  TreeArrangementVertical, TreeArrangementHorizontal, TreeArrangementFixedRoots,
  TreeLayerStyleIndividual, TreeLayerStyleUniform, TreeLayerStyleSiblings,
  TreeSortingForwards, TreeSortingReverse, TreeSortingAscending, TreeSortingDescending,
  TreeCompactionBlock, TreeCompactionNone,
  TreeAlignmentTopLeftBus, TreeAlignmentBottomRightBus, TreeAlignmentBus,
  TreeAlignmentBusBranching, TreeAlignmentCenterChildren, TreeAlignmentCenterSubtrees,
  TreeAlignmentStart, TreeAlignmentEnd, TreeAlignmentCustom,
  CircularArrangementConstantDistance, CircularArrangementConstantAngle,
  CircularArrangementConstantSpacing, CircularArrangementPacked,
  CircularDirectionClockwise, CircularDirectionCounterclockwise,
  CircularDirectionBidirectionalLeft, CircularDirectionBidirectionalRight,
  CircularSortingForwards, CircularSortingReverse, CircularSortingAscending,
  CircularSortingDescending, CircularSortingOptimized,
  LayeredDigraphAggressiveNone, LayeredDigraphAggressiveLess, LayeredDigraphAggressiveMore,
  LayeredDigraphAlignNone, LayeredDigraphAlignUpperLeft, LayeredDigraphAlignUpperRight,
  LayeredDigraphAlignLowerLeft, LayeredDigraphAlignLowerRight, LayeredDigraphAlignAll,
  LayeredDigraphPackNone, LayeredDigraphPackExpand, LayeredDigraphPackStraighten,
  LayeredDigraphPackMedian, LayeredDigraphPackMaybeExpand, LayeredDigraphPackAll,
  LayeredDigraphDirectionDown, LayeredDigraphDirectionUp,
  LayeredDigraphDirectionLeft, LayeredDigraphDirectionRight,
  LayeredDigraphInitDepthFirstOut, LayeredDigraphInitDepthFirstIn, LayeredDigraphInitNaive,
  LayeredDigraphLayeringOptimalLinkLength,
  LayeredDigraphLayeringLongestPathSink, LayeredDigraphLayeringLongestPathSource,
  LayeredDigraphCycleRemoveDepthFirst, LayeredDigraphCycleRemoveGreedy,
  LayeredDigraphCycleRemoveFromLayers,
  GridLayoutLocation, GridLayoutCenter,
  GridArrangementLeftToRight, GridArrangementRightToLeft,
  GridSortingForwards, GridSortingReverse, GridSortingAscending, GridSortingDescending,
  GridAlignmentLocation, GridAlignmentPosition,
  AutoScaleNone, AutoScaleUniform, AutoScaleUniformToFill,
  ScrollDocument, ScrollInfinite,
  CycleAll, CycleNotDirected, CycleNotDirectedFast, CycleNotUndirected,
  CycleDestinationTree, CycleSourceTree,
  ChangedEventProperty, ChangedEventInsert, ChangedEventRemove, ChangedEventTransaction,
  PathSegmentLine, PathSegmentQuadraticBezier,
  PathSegmentCubicBezier, PathSegmentArc, PathSegmentMoveTo,
  SegmentTypeMove, SegmentTypeBezier, SegmentTypeSvgArc,
  AnimationStyleDefault, AnimationStyleAnimateLocations, AnimationStyleNone,
  LinkAdjustingNone, LinkAdjustingEnd, LinkAdjustingScale, LinkAdjustingStretch,
  OrientationNone, OrientationAlong, OrientationMinus90, OrientationPlus90,
  OrientationOpposite, OrientationUpright, OrientationPlus90Upright,
  OrientationMinus90Upright, OrientationUpright45,
  GestureModeNone, GestureModeCancel, GestureModeZoom,
  WheelModeScroll, WheelModeZoom, WheelModeNone,
  TextEditingAcceptLostFocus, TextEditingAcceptMouseDown, TextEditingAcceptTab,
  TextEditingAcceptEnter,
  TextEditingStartingSingleClick, TextEditingStartingSingleClickSelected,
  TextEditingStartingDoubleClick,
  LayoutConditionsNone, LayoutConditionsAdded, LayoutConditionsRemoved,
  LayoutConditionsShown, LayoutConditionsHidden, LayoutConditionsNodeSized,
  LayoutConditionsGroupLayout, LayoutConditionsNodeReplaced,
  LayoutConditionsStandard, LayoutConditionsAll,
  GeometryStretchNone, GeometryStretchDefault, GeometryStretchFill, GeometryStretchUniform,
  GeometryTypeLine, GeometryTypeRectangle, GeometryTypeEllipse, GeometryTypePath,
  LinkingDirectionEither, LinkingDirectionForwardsOnly, LinkingDirectionBackwardsOnly,
  TriggerStartDefault, TriggerStartImmediate, TriggerStartBundled,
  OverflowClip, OverflowEllipsis,
} from './core/EnumValues';

import { Binding } from './model/Binding';

export const GridSorting = {
  Forwards: GridSortingForwards,
  Reverse: GridSortingReverse,
  Ascending: GridSortingAscending,
  Descending: GridSortingDescending,
};

export const GridAlignment = {
  Location: GridAlignmentLocation,
  Position: GridAlignmentPosition,
};

export const Curve = {
  None: CurveNone,
  Bezier: CurveBezier,
  JumpOver: CurveJumpOver,
  JumpGap: CurveJumpGap,
};

export const AutoScale = {
  None: AutoScaleNone,
  Uniform: AutoScaleUniform,
  UniformToFill: AutoScaleUniformToFill,
};

export const Routing = {
  Normal: RoutingNormal,
  Orthogonal: RoutingOrthogonal,
  AvoidsNodes: RoutingAvoidsNodes,
  AvoidsNodesStraight: RoutingAvoidsNodesStraight,
};

export const ScrollMode = {
  Document: ScrollDocument,
  Infinite: ScrollInfinite,
};

// 官方 go.Stretch = {None, Default, Fill, Vertical, Horizontal}；
// Uniform / UniformToFill 在官方属于 GraphObject 的静态成员（与 ViewboxStretch 共用数值 6/7），
// 因此不放进 Stretch，但 StretchUniform / StretchUniformToFill 常量仍然导出。
export const Stretch = {
  None: StretchNone,
  Default: StretchDefault,
  Fill: StretchFill,
  Vertical: StretchVertical,
  Horizontal: StretchHorizontal,
};

export const TreeStyle = {
  Layered: TreeStyleLayered,
  Alternating: TreeStyleAlternating,
  LastParents: TreeStyleLastParents,
  RootOnly: TreeStyleRootOnly,
};

export const TreeAlignment = {
  TopLeftBus: TreeAlignmentTopLeftBus,
  BottomRightBus: TreeAlignmentBottomRightBus,
  Bus: TreeAlignmentBus,
  BusBranching: TreeAlignmentBusBranching,
  CenterChildren: TreeAlignmentCenterChildren,
  CenterSubtrees: TreeAlignmentCenterSubtrees,
  Start: TreeAlignmentStart,
  End: TreeAlignmentEnd,
  Custom: TreeAlignmentCustom,
};

export const TreeCompaction = {
  Block: TreeCompactionBlock,
  None: TreeCompactionNone,
};

export const TreeSorting = {
  Forwards: TreeSortingForwards,
  Reverse: TreeSortingReverse,
  Ascending: TreeSortingAscending,
  Descending: TreeSortingDescending,
};

export const TreeArrangement = {
  Vertical: TreeArrangementVertical,
  Horizontal: TreeArrangementHorizontal,
  FixedRoots: TreeArrangementFixedRoots,
};

export const TreeLayerStyle = {
  Individual: TreeLayerStyleIndividual,
  Uniform: TreeLayerStyleUniform,
  Siblings: TreeLayerStyleSiblings,
};

export const TreePath = {
  Default: TreePathDefault,
  Destination: TreePathDestination,
  Source: TreePathSource,
};

export const CircularArrangement = {
  ConstantSpacing: CircularArrangementConstantSpacing,
  ConstantDistance: CircularArrangementConstantDistance,
  ConstantAngle: CircularArrangementConstantAngle,
  Packed: CircularArrangementPacked,
};

export const CircularSorting = {
  Forwards: CircularSortingForwards,
  Reverse: CircularSortingReverse,
  Ascending: CircularSortingAscending,
  Descending: CircularSortingDescending,
  Optimized: CircularSortingOptimized,
};

// 官方只有 {None, Less, More}；Horizontal / Vertical / All 是本项目历史扩展，常量仍导出。
export const LayeredDigraphAggressive = {
  None: LayeredDigraphAggressiveNone,
  Less: LayeredDigraphAggressiveLess,
  More: LayeredDigraphAggressiveMore,
};

export const LayeredDigraphAlign = {
  None: LayeredDigraphAlignNone,
  UpperLeft: LayeredDigraphAlignUpperLeft,
  UpperRight: LayeredDigraphAlignUpperRight,
  LowerLeft: LayeredDigraphAlignLowerLeft,
  LowerRight: LayeredDigraphAlignLowerRight,
  All: LayeredDigraphAlignAll,
};

export const LayeredDigraphPack = {
  None: LayeredDigraphPackNone,
  Expand: LayeredDigraphPackExpand,
  Straighten: LayeredDigraphPackStraighten,
  Median: LayeredDigraphPackMedian,
  MaybeExpand: LayeredDigraphPackMaybeExpand,
  All: LayeredDigraphPackAll,
};

// 官方没有 GridArrangement.TopToBottom / BottomToTop（那是本项目历史扩展），常量仍导出。
export const GridArrangement = {
  LeftToRight: GridArrangementLeftToRight,
  RightToLeft: GridArrangementRightToLeft,
};

export const PanelTypes = {
  Auto: PanelAuto,
  Position: PanelPosition,
  Vertical: PanelVertical,
  Horizontal: PanelHorizontal,
  Spot: PanelSpot,
  Table: PanelTable,
  TableColumn: PanelTableColumn,
  TableRow: PanelTableRow,
  Viewbox: PanelViewbox,
  Link: PanelLink,
  Grid: PanelGrid,
  Graduated: PanelGraduated,
};

export const BindingMode = {
  OneWay: Binding.OneWay,
  TwoWay: Binding.TwoWay,
};

export const CircularDirection = {
  Clockwise: CircularDirectionClockwise,
  Counterclockwise: CircularDirectionCounterclockwise,
  BidirectionalLeft: CircularDirectionBidirectionalLeft,
  BidirectionalRight: CircularDirectionBidirectionalRight,
};

// 官方运行时并未导出 go.LayeredDigraphDirection（go.d.ts 里也没有 declare enum），
// 保留为本项目历史扩展。
export const LayeredDigraphDirection = {
  Down: LayeredDigraphDirectionDown,
  Up: LayeredDigraphDirectionUp,
  Left: LayeredDigraphDirectionLeft,
  Right: LayeredDigraphDirectionRight,
};

export const LayeredDigraphInit = {
  DepthFirstOut: LayeredDigraphInitDepthFirstOut,
  DepthFirstIn: LayeredDigraphInitDepthFirstIn,
  Naive: LayeredDigraphInitNaive,
};

export const LayeredDigraphLayering = {
  OptimalLinkLength: LayeredDigraphLayeringOptimalLinkLength,
  LongestPathSink: LayeredDigraphLayeringLongestPathSink,
  LongestPathSource: LayeredDigraphLayeringLongestPathSource,
};

export const LayeredDigraphCycleRemove = {
  DepthFirst: LayeredDigraphCycleRemoveDepthFirst,
  Greedy: LayeredDigraphCycleRemoveGreedy,
  FromLayers: LayeredDigraphCycleRemoveFromLayers,
};

export const ImageStretch = {
  None: ImageStretchNone,
  Fill: ImageStretchFill,
  Uniform: ImageStretchUniform,
  UniformToFill: ImageStretchUniformToFill,
};

// 官方 Sizing = {Default, None, ProportionalExtra}；SizingProp / SizingAuto 是本项目历史扩展。
export const Sizing = {
  Default: SizingDefault,
  None: SizingNone,
  ProportionalExtra: SizingProportionalExtra,
};

export const Wrap = {
  None: WrapNone,
  Fit: WrapFit,
  DesiredSize: WrapDesiredSize,
  BreakAll: WrapBreakAll,
};

export const CycleMode = {
  All: CycleAll,
  NotDirected: CycleNotDirected,
  NotDirectedFast: CycleNotDirectedFast,
  NotUndirected: CycleNotUndirected,
  DestinationTree: CycleDestinationTree,
  SourceTree: CycleSourceTree,
};

export const ChangeType = {
  Transaction: ChangedEventTransaction,
  Property: ChangedEventProperty,
  Insert: ChangedEventInsert,
  Remove: ChangedEventRemove,
};

// 定义在 core/EnumValues.ts，供 src/figures 的生成文件共用（见该处注释）。
export { SegmentType } from './core/EnumValues';

export const AnimationStyle = {
  Default: AnimationStyleDefault,
  AnimateLocations: AnimationStyleAnimateLocations,
  None: AnimationStyleNone,
};

export const LinkAdjusting = {
  None: LinkAdjustingNone,
  End: LinkAdjustingEnd,
  Scale: LinkAdjustingScale,
  Stretch: LinkAdjustingStretch,
};

export const Orientation = {
  None: OrientationNone,
  Along: OrientationAlong,
  Plus90: OrientationPlus90,
  Minus90: OrientationMinus90,
  Opposite: OrientationOpposite,
  Upright: OrientationUpright,
  Plus90Upright: OrientationPlus90Upright,
  Minus90Upright: OrientationMinus90Upright,
  Upright45: OrientationUpright45,
};

export const GestureMode = {
  None: GestureModeNone,
  Cancel: GestureModeCancel,
  Zoom: GestureModeZoom,
};

export const WheelMode = {
  Scroll: WheelModeScroll,
  Zoom: WheelModeZoom,
  None: WheelModeNone,
};

export const TextEditingAccept = {
  LostFocus: TextEditingAcceptLostFocus,
  MouseDown: TextEditingAcceptMouseDown,
  Tab: TextEditingAcceptTab,
  Enter: TextEditingAcceptEnter,
};

export const TextEditingStarting = {
  SingleClick: TextEditingStartingSingleClick,
  SingleClickSelected: TextEditingStartingSingleClickSelected,
  DoubleClick: TextEditingStartingDoubleClick,
};

// 位掩码（官方 go.d.ts:21851 "combined as flags"），值为 number 而非 EnumValue。
export const LayoutConditions = {
  None: LayoutConditionsNone,
  Added: LayoutConditionsAdded,
  Removed: LayoutConditionsRemoved,
  Shown: LayoutConditionsShown,
  Hidden: LayoutConditionsHidden,
  NodeSized: LayoutConditionsNodeSized,
  GroupLayout: LayoutConditionsGroupLayout,
  NodeReplaced: LayoutConditionsNodeReplaced,
  Standard: LayoutConditionsStandard,
  All: LayoutConditionsAll,
};



export { GeometryStretch, GeometryType } from './core/EnumValues';

export const LinkingDirection = {
  Either: LinkingDirectionEither,
  ForwardsOnly: LinkingDirectionForwardsOnly,
  BackwardsOnly: LinkingDirectionBackwardsOnly,
};

export const TriggerStart = {
  Default: TriggerStartDefault,
  Immediate: TriggerStartImmediate,
  Bundled: TriggerStartBundled,
};

// 官方运行时导出的是 go.TextOverflow；go.Overflow 是本项目历史扩展，保留。
export const Overflow = {
  Clip: OverflowClip,
  Ellipsis: OverflowEllipsis,
};

export const TextOverflow = {
  Clip: OverflowClip,
  Ellipsis: OverflowEllipsis,
};
