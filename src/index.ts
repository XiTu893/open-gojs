import './core/Polyfill';

export { EnumValue } from './core/EnumValues';
export {
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable,
  PanelPosition, PanelGrid, PanelViewbox, PanelGraduated, PanelLink,
  PanelTableColumn, PanelTableRow,
  StretchDefault, StretchFill, StretchNone, StretchUniform, StretchUniformToFill,
  StretchHorizontal, StretchVertical,
  FlipNone, FlipHorizontal, FlipVertical, FlipBoth,
  RoutingNormal, RoutingOrthogonal, RoutingAvoidsNodes,
  CurveNone, CurveBezier, CurveJumpOver, CurveJumpGap,
  WrapFit, WrapDesiredSize, WrapNone,
  OverflowClip, OverflowEllipsis,
  ImageStretchNone, ImageStretchFill, ImageStretchUniform, ImageStretchUniformToFill,
  SizingNone, SizingProp, SizingAuto,
  TreeStyleLayered, TreeStyleAlternating, TreeStyleLastParents, TreeStyleCompact, TreeStyleRootOnly,
  TreePathDefault, TreePathDestination, TreePathSource,
  TreeArrangementVertical, TreeArrangementHorizontal, TreeArrangementFixedRoots,
  TreeLayerStyleIndividual, TreeLayerStyleUniform, TreeLayerStyleSiblings,
  TreeSortingForwards, TreeSortingReverse, TreeSortingAscending, TreeSortingDescending,
  TreeCompactionBlock, TreeCompactionNone,
  TreeAlignmentTopLeftBus, TreeAlignmentBottomRightBus, TreeAlignmentBus,
  TreeAlignmentBusBranching, TreeAlignmentCenterChildren, TreeAlignmentCenterSubtrees,
  TreeAlignmentStart, TreeAlignmentEnd,
  CircularArrangementConstantDistance, CircularArrangementConstantAngle,
  CircularArrangementConstantRadius, CircularArrangementPacked,
  CircularDirectionClockwise, CircularDirectionBidirectionalLeft, CircularDirectionBidirectionalRight,
  CircularSortingForwards, CircularSortingReverse, CircularSortingAscending,
  CircularSortingDescending, CircularSortingOptimized,
  LayeredDigraphDirectionDown, LayeredDigraphDirectionUp,
  LayeredDigraphDirectionLeft, LayeredDigraphDirectionRight,
  LayeredDigraphAlignTop, LayeredDigraphAlignBottom, LayeredDigraphAlignCenter,
  LayeredDigraphAlignUpper, LayeredDigraphAlignLower, LayeredDigraphAlignNone,
  LayeredDigraphAggressiveNone, LayeredDigraphAggressiveHorizontal,
  LayeredDigraphAggressiveVertical, LayeredDigraphAggressiveAll,
  LayeredDigraphAggressiveLess, LayeredDigraphAggressiveMore,
  LayeredDigraphPackNone, LayeredDigraphPackAll, LayeredDigraphPackExpand,
  LayeredDigraphPackStraighten, LayeredDigraphPackMedian,
  LayeredDigraphCycleRemoveDepthFirst, LayeredDigraphCycleRemoveGreedy,
  LayeredDigraphInitDepthFirstIn, LayeredDigraphInitDepthFirstOut, LayeredDigraphInitNaive,
  LayeredDigraphLayeringLongestPathSink, LayeredDigraphLayeringLongestPathSource,
  LayeredDigraphLayeringOptimalLinkLength,
  GridLayoutLocation, GridLayoutCenter,
  GridArrangementLeftToRight, GridArrangementRightToLeft,
  GridArrangementTopToBottom, GridArrangementBottomToTop,
  GridWrappingNone, GridWrappingFit,
  GridSortingForwards, GridSortingReverse, GridSortingAscending, GridSortingDescending,
  GridAlignmentLocation, GridAlignmentPosition,
  AnimationDefault, AnimationEaseInOut, AnimationEaseIn, AnimationEaseOut,
  AnimationLinear, AnimationEaseOutBounce,
  AnimationStyleDefault, AnimationStyleAnimateLocations, AnimationStyleNone,
  AutoScaleNone, AutoScaleUniform, AutoScaleUniformToFill,
  ScrollDocument, ScrollInfinite,
  CycleAll, CycleNotDirected, CycleNotUndirected, CycleDestinationTree, CycleSourceTree,
  SegmentOrientationNone, SegmentOrientationAlong, SegmentOrientationOpposite,
  SegmentOrientationParallel, SegmentOrientationPerpendicular, SegmentOrientationOrthogonal,
  ChangedEventProperty, ChangedEventInsert, ChangedEventRemove, ChangedEventTransaction,
  PathSegmentLine, PathSegmentQuadraticBezier, PathSegmentCubicBezier,
  PathSegmentArc, PathSegmentMoveTo, PathSegmentClose,
  BrushSolid, BrushLinear, BrushRadial,
  ViewboxStretchNone, ViewboxStretchFill, ViewboxStretchUniform, ViewboxStretchUniformToFill,
  GraduatedPanNone, GraduatedPanLeft, GraduatedPanCenter, GraduatedPanRight,
  LinkAdjustingEnd, LinkAdjustingStretch,
  OrientationNone, OrientationAlong, OrientationMinus90, OrientationPlus90, OrientationPlus180,
  GestureModeNone, GestureModeCancel, GestureModeZoom,
  WheelModeZoom,
  TextEditingAcceptLostFocus,
  TextEditingStartingSingleClick,
  LayoutConditionsStandard, LayoutConditionsNodeSized,
  GeometryStretchUniform,
  GeometryTypeLine, GeometryTypePath,
  CircularNodeDiameterFormulaCircular, CircularNodeDiameterFormulaPythagorean,
  LinkingDirectionForwardsOnly,
  TriggerStartBundled,
} from './core/EnumValues';

export { Iterable, Iterator, IMapIterator } from './core/Iterable';
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

export { Animation, AnimationState, AnimationConfig } from './animation/Animation';
export { AnimationTrigger } from './animation/AnimationTrigger';
export { AnimationManager } from './animation/AnimationManager';

export { CommandHandler } from './command/CommandHandler';

export { CanvasRenderer } from './render/CanvasRenderer';

export { figures, getFigureGeometry } from './figures/Figures';

// ============ GoJS Namespace Enum Objects ============
import {
  PanelAuto, PanelVertical, PanelHorizontal, PanelSpot, PanelTable,
  PanelPosition, PanelGrid, PanelViewbox, PanelGraduated, PanelLink,
  PanelTableColumn, PanelTableRow,
  StretchDefault, StretchFill, StretchNone, StretchUniform, StretchUniformToFill,
  StretchHorizontal, StretchVertical,
  RoutingNormal, RoutingOrthogonal, RoutingAvoidsNodes,
  CurveNone, CurveBezier, CurveJumpOver, CurveJumpGap,
  WrapFit, WrapDesiredSize, WrapNone,
  ImageStretchNone, ImageStretchFill, ImageStretchUniform, ImageStretchUniformToFill,
  SizingNone, SizingProp, SizingAuto,
  TreeStyleLayered, TreeStyleAlternating, TreeStyleLastParents, TreeStyleRootOnly,
  TreePathDefault, TreePathDestination, TreePathSource,
  TreeArrangementVertical, TreeArrangementHorizontal, TreeArrangementFixedRoots,
  TreeLayerStyleIndividual, TreeLayerStyleUniform, TreeLayerStyleSiblings,
  TreeSortingForwards, TreeSortingReverse, TreeSortingAscending, TreeSortingDescending,
  TreeCompactionBlock, TreeCompactionNone,
  TreeAlignmentTopLeftBus, TreeAlignmentBottomRightBus, TreeAlignmentBus,
  TreeAlignmentBusBranching, TreeAlignmentCenterChildren, TreeAlignmentCenterSubtrees,
  TreeAlignmentStart, TreeAlignmentEnd,
  CircularArrangementConstantDistance, CircularArrangementConstantAngle,
  CircularArrangementConstantRadius, CircularArrangementPacked,
  CircularSortingForwards, CircularSortingReverse, CircularSortingAscending,
  CircularSortingDescending, CircularSortingOptimized,
  LayeredDigraphAggressiveNone, LayeredDigraphAggressiveHorizontal,
  LayeredDigraphAggressiveVertical, LayeredDigraphAggressiveAll,
  LayeredDigraphAggressiveLess, LayeredDigraphAggressiveMore,
  LayeredDigraphAlignNone, LayeredDigraphPackNone,
  GridLayoutLocation, GridLayoutCenter,
  GridArrangementLeftToRight, GridArrangementRightToLeft,
  GridSortingForwards, GridSortingReverse, GridSortingAscending, GridSortingDescending,
  GridAlignmentLocation, GridAlignmentPosition,
  AutoScaleNone, AutoScaleUniform, AutoScaleUniformToFill,
  ScrollDocument, ScrollInfinite,
  CycleAll, CycleNotDirected, CycleNotUndirected, CycleDestinationTree, CycleSourceTree,
  ChangedEventProperty, ChangedEventInsert, ChangedEventRemove, ChangedEventTransaction,
  PathSegmentLine, PathSegmentQuadraticBezier, PathSegmentCubicBezier,
  PathSegmentArc, PathSegmentMoveTo, PathSegmentClose,
  AnimationStyleDefault, AnimationStyleAnimateLocations, AnimationStyleNone,
  LinkAdjustingEnd, LinkAdjustingStretch,
  OrientationNone, OrientationAlong, OrientationMinus90,
  GestureModeNone, GestureModeCancel, GestureModeZoom,
  WheelModeZoom, TextEditingAcceptLostFocus, TextEditingStartingSingleClick,
  LayoutConditionsStandard, LayoutConditionsNodeSized,
  GeometryStretchUniform, GeometryTypeLine, GeometryTypePath,
  LinkingDirectionForwardsOnly, TriggerStartBundled,
  OverflowClip, OverflowEllipsis,
} from './core/EnumValues';

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
};

export const ScrollMode = {
  Document: ScrollDocument,
  Infinite: ScrollInfinite,
};

export const Stretch = {
  Default: StretchDefault,
  Fill: StretchFill,
  None: StretchNone,
  Uniform: StretchUniform,
  UniformToFill: StretchUniformToFill,
  Horizontal: StretchHorizontal,
  Vertical: StretchVertical,
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
  ConstantDistance: CircularArrangementConstantDistance,
  ConstantAngle: CircularArrangementConstantAngle,
  ConstantRadius: CircularArrangementConstantRadius,
  Packed: CircularArrangementPacked,
};

export const CircularSorting = {
  Forwards: CircularSortingForwards,
  Reverse: CircularSortingReverse,
  Ascending: CircularSortingAscending,
  Descending: CircularSortingDescending,
  Optimized: CircularSortingOptimized,
};

export const LayeredDigraphAggressive = {
  None: LayeredDigraphAggressiveNone,
  Horizontal: LayeredDigraphAggressiveHorizontal,
  Vertical: LayeredDigraphAggressiveVertical,
  All: LayeredDigraphAggressiveAll,
  Less: LayeredDigraphAggressiveLess,
  More: LayeredDigraphAggressiveMore,
};

export const LayeredDigraphAlign = {
  None: LayeredDigraphAlignNone,
};

export const LayeredDigraphPack = {
  None: LayeredDigraphPackNone,
};

export const GridArrangement = {
  LeftToRight: GridArrangementLeftToRight,
  RightToLeft: GridArrangementRightToLeft,
};

export const ImageStretch = {
  None: ImageStretchNone,
  Fill: ImageStretchFill,
  Uniform: ImageStretchUniform,
  UniformToFill: ImageStretchUniformToFill,
};

export const Sizing = {
  None: SizingNone,
  Prop: SizingProp,
  Auto: SizingAuto,
};

export const Wrap = {
  Fit: WrapFit,
  DesiredSize: WrapDesiredSize,
  None: WrapNone,
};

export const CycleMode = {
  All: CycleAll,
  NotDirected: CycleNotDirected,
  NotUndirected: CycleNotUndirected,
  DestinationTree: CycleDestinationTree,
  SourceTree: CycleSourceTree,
};

export const ChangeType = {
  Property: ChangedEventProperty,
  Insert: ChangedEventInsert,
  Remove: ChangedEventRemove,
  Transaction: ChangedEventTransaction,
};

export const SegmentType = {
  Line: PathSegmentLine,
  QuadraticBezier: PathSegmentQuadraticBezier,
  CubicBezier: PathSegmentCubicBezier,
  Arc: PathSegmentArc,
  MoveTo: PathSegmentMoveTo,
  Close: PathSegmentClose,
};

export const AnimationStyle = {
  Default: AnimationStyleDefault,
  AnimateLocations: AnimationStyleAnimateLocations,
  None: AnimationStyleNone,
};

export const LinkAdjusting = {
  End: LinkAdjustingEnd,
  Stretch: LinkAdjustingStretch,
};

export const Orientation = {
  None: OrientationNone,
  Along: OrientationAlong,
  Minus90: OrientationMinus90,
};

export const GestureMode = {
  None: GestureModeNone,
  Cancel: GestureModeCancel,
  Zoom: GestureModeZoom,
};

export const WheelMode = {
  Zoom: WheelModeZoom,
};

export const TextEditingAccept = {
  LostFocus: TextEditingAcceptLostFocus,
};

export const TextEditingStarting = {
  SingleClick: TextEditingStartingSingleClick,
};

export const LayoutConditions = {
  Standard: LayoutConditionsStandard,
  NodeSized: LayoutConditionsNodeSized,
};

export const GeometryStretch = {
  Uniform: GeometryStretchUniform,
};

export const GeometryType = {
  Line: GeometryTypeLine,
  Path: GeometryTypePath,
};

export const LinkingDirection = {
  ForwardsOnly: LinkingDirectionForwardsOnly,
};

export const TriggerStart = {
  Bundled: TriggerStartBundled,
};

export const Overflow = {
  Clip: OverflowClip,
  Ellipsis: OverflowEllipsis,
};

export const TextOverflow = {
  Clip: OverflowClip,
  Ellipsis: OverflowEllipsis,
};
