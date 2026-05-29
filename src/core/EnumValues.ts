/**
 * EnumValue - GoJS 风格的枚举值基类
 * 每个枚举值是唯一对象实例，通过名称标识
 */
export class EnumValue {
  public readonly _name: string;

  constructor(name: string) {
    this._name = name;
  }

  toString(): string {
    return this._name;
  }
}

// ============ 面板类型 ============
export const PanelAuto = new EnumValue('Auto');
export const PanelVertical = new EnumValue('Vertical');
export const PanelHorizontal = new EnumValue('Horizontal');
export const PanelSpot = new EnumValue('Spot');
export const PanelTable = new EnumValue('Table');
export const PanelPosition = new EnumValue('Position');
export const PanelGrid = new EnumValue('Grid');
export const PanelViewbox = new EnumValue('Viewbox');
export const PanelGraduated = new EnumValue('Graduated');
export const PanelLink = new EnumValue('Link');
export const PanelTableColumn = new EnumValue('TableColumn');
export const PanelTableRow = new EnumValue('TableRow');

// ============ 拉伸方式 ============
export const StretchDefault = new EnumValue('Default');
export const StretchFill = new EnumValue('Fill');
export const StretchNone = new EnumValue('None');
export const StretchUniform = new EnumValue('Uniform');
export const StretchUniformToFill = new EnumValue('UniformToFill');
export const StretchHorizontal = new EnumValue('Horizontal');
export const StretchVertical = new EnumValue('Vertical');

// ============ 翻转 ============
export const FlipNone = new EnumValue('FlipNone');
export const FlipHorizontal = new EnumValue('FlipHorizontal');
export const FlipVertical = new EnumValue('FlipVertical');
export const FlipBoth = new EnumValue('FlipBoth');

// ============ 链接路由 ============
export const RoutingNormal = new EnumValue('Normal');
export const RoutingOrthogonal = new EnumValue('Orthogonal');
export const RoutingAvoidsNodes = new EnumValue('AvoidsNodes');

// ============ 链接曲线 ============
export const CurveNone = new EnumValue('CurveNone');
export const CurveBezier = new EnumValue('CurveBezier');
export const CurveJumpOver = new EnumValue('CurveJumpOver');
export const CurveJumpGap = new EnumValue('CurveJumpGap');

// ============ 文本换行 ============
export const WrapFit = new EnumValue('WrapFit');
export const WrapDesiredSize = new EnumValue('WrapDesiredSize');
export const WrapNone = new EnumValue('WrapNone');

// ============ 文本溢出 ============
export const OverflowClip = new EnumValue('OverflowClip');
export const OverflowEllipsis = new EnumValue('OverflowEllipsis');

// ============ 图片拉伸 ============
export const ImageStretchNone = new EnumValue('ImageStretchNone');
export const ImageStretchFill = new EnumValue('ImageStretchFill');
export const ImageStretchUniform = new EnumValue('ImageStretchUniform');
export const ImageStretchUniformToFill = new EnumValue('ImageStretchUniformToFill');

// ============ 表格行/列尺寸策略 ============
export const SizingNone = new EnumValue('SizingNone');
export const SizingProp = new EnumValue('SizingProp');
export const SizingAuto = new EnumValue('SizingAuto');

// ============ 树布局样式 ============
export const TreeStyleLayered = new EnumValue('TreeStyleLayered');
export const TreeStyleAlternating = new EnumValue('TreeStyleAlternating');
export const TreeStyleLastParents = new EnumValue('TreeStyleLastParents');
export const TreeStyleCompact = new EnumValue('TreeStyleCompact');
export const TreeStyleRootOnly = new EnumValue('TreeStyleRootOnly');

// ============ 树布局路径 ============
export const TreePathDefault = new EnumValue('TreePathDefault');
export const TreePathDestination = new EnumValue('TreePathDestination');
export const TreePathSource = new EnumValue('TreePathSource');

// ============ 树布局排列 ============
export const TreeArrangementVertical = new EnumValue('TreeArrangementVertical');
export const TreeArrangementHorizontal = new EnumValue('TreeArrangementHorizontal');
export const TreeArrangementFixedRoots = new EnumValue('TreeArrangementFixedRoots');

// ============ 树布局层样式 ============
export const TreeLayerStyleIndividual = new EnumValue('TreeLayerStyleIndividual');
export const TreeLayerStyleUniform = new EnumValue('TreeLayerStyleUniform');

// ============ 树布局排序 ============
export const TreeSortingForwards = new EnumValue('TreeSortingForwards');
export const TreeSortingReverse = new EnumValue('TreeSortingReverse');
export const TreeSortingAscending = new EnumValue('TreeSortingAscending');
export const TreeSortingDescending = new EnumValue('TreeSortingDescending');

// ============ 树布局压缩 ============
export const TreeCompactionBlock = new EnumValue('TreeCompactionBlock');
export const TreeCompactionNone = new EnumValue('TreeCompactionNone');

// ============ 环形布局排列 ============
export const CircularArrangementConstantDistance = new EnumValue('CircularArrangementConstantDistance');
export const CircularArrangementConstantAngle = new EnumValue('CircularArrangementConstantAngle');
export const CircularArrangementConstantRadius = new EnumValue('CircularArrangementConstantRadius');
export const CircularArrangementPacked = new EnumValue('CircularArrangementPacked');

// ============ 环形布局方向 ============
export const CircularDirectionClockwise = new EnumValue('CircularDirectionClockwise');
export const CircularDirectionBidirectionalLeft = new EnumValue('CircularDirectionBidirectionalLeft');
export const CircularDirectionBidirectionalRight = new EnumValue('CircularDirectionBidirectionalRight');

// ============ 分层有向图布局方向 ============
export const LayeredDigraphDirectionDown = new EnumValue('LayeredDigraphDirectionDown');
export const LayeredDigraphDirectionUp = new EnumValue('LayeredDigraphDirectionUp');
export const LayeredDigraphDirectionLeft = new EnumValue('LayeredDigraphDirectionLeft');
export const LayeredDigraphDirectionRight = new EnumValue('LayeredDigraphDirectionRight');

// ============ 分层有向图对齐 ============
export const LayeredDigraphAlignTop = new EnumValue('LayeredDigraphAlignTop');
export const LayeredDigraphAlignBottom = new EnumValue('LayeredDigraphAlignBottom');
export const LayeredDigraphAlignCenter = new EnumValue('LayeredDigraphAlignCenter');
export const LayeredDigraphAlignUpper = new EnumValue('LayeredDigraphAlignUpper');
export const LayeredDigraphAlignLower = new EnumValue('LayeredDigraphAlignLower');

// ============ 分层有向图激进选项 ============
export const LayeredDigraphAggressiveNone = new EnumValue('LayeredDigraphAggressiveNone');
export const LayeredDigraphAggressiveHorizontal = new EnumValue('LayeredDigraphAggressiveHorizontal');
export const LayeredDigraphAggressiveVertical = new EnumValue('LayeredDigraphAggressiveVertical');
export const LayeredDigraphAggressiveAll = new EnumValue('LayeredDigraphAggressiveAll');

// ============ 分层有向图打包选项 ============
export const LayeredDigraphPackNone = new EnumValue('LayeredDigraphPackNone');
export const LayeredDigraphPackAll = new EnumValue('LayeredDigraphPackAll');
export const LayeredDigraphPackExpand = new EnumValue('LayeredDigraphPackExpand');
export const LayeredDigraphPackStraighten = new EnumValue('LayeredDigraphPackStraighten');
export const LayeredDigraphPackMedian = new EnumValue('LayeredDigraphPackMedian');

// ============ 网格布局对齐 ============
export const GridLayoutLocation = new EnumValue('GridLayoutLocation');
export const GridLayoutCenter = new EnumValue('GridLayoutCenter');

// ============ 网格布局排列 ============
export const GridArrangementLeftToRight = new EnumValue('GridArrangementLeftToRight');
export const GridArrangementRightToLeft = new EnumValue('GridArrangementRightToLeft');
export const GridArrangementTopToBottom = new EnumValue('GridArrangementTopToBottom');
export const GridArrangementBottomToTop = new EnumValue('GridArrangementBottomToTop');

// ============ 网格布局换行 ============
export const GridWrappingNone = new EnumValue('GridWrappingNone');
export const GridWrappingFit = new EnumValue('GridWrappingFit');

// ============ 动画样式 ============
export const AnimationDefault = new EnumValue('AnimationDefault');
export const AnimationEaseInOut = new EnumValue('AnimationEaseInOut');
export const AnimationEaseIn = new EnumValue('AnimationEaseIn');
export const AnimationEaseOut = new EnumValue('AnimationEaseOut');
export const AnimationLinear = new EnumValue('AnimationLinear');
export const AnimationEaseOutBounce = new EnumValue('AnimationEaseOutBounce');

// ============ 自动缩放 ============
export const AutoScaleNone = new EnumValue('AutoScaleNone');
export const AutoScaleUniform = new EnumValue('AutoScaleUniform');
export const AutoScaleUniformToFill = new EnumValue('AutoScaleUniformToFill');

// ============ 滚动模式 ============
export const ScrollDocument = new EnumValue('ScrollDocument');
export const ScrollInfinite = new EnumValue('ScrollInfinite');

// ============ 有效循环 ============
export const CycleAll = new EnumValue('CycleAll');
export const CycleNotDirected = new EnumValue('CycleNotDirected');
export const CycleNotUndirected = new EnumValue('CycleNotUndirected');
export const CycleDestinationTree = new EnumValue('CycleDestinationTree');
export const CycleSourceTree = new EnumValue('CycleSourceTree');

// ============ 链接段方向 ============
export const SegmentOrientationNone = new EnumValue('SegmentOrientationNone');
export const SegmentOrientationAlong = new EnumValue('SegmentOrientationAlong');
export const SegmentOrientationOpposite = new EnumValue('SegmentOrientationOpposite');
export const SegmentOrientationParallel = new EnumValue('SegmentOrientationParallel');
export const SegmentOrientationPerpendicular = new EnumValue('SegmentOrientationPerpendicular');
export const SegmentOrientationOrthogonal = new EnumValue('SegmentOrientationOrthogonal');

// ============ 变更事件类型 ============
export const ChangedEventProperty = new EnumValue('Property');
export const ChangedEventInsert = new EnumValue('Insert');
export const ChangedEventRemove = new EnumValue('Remove');
export const ChangedEventTransaction = new EnumValue('Transaction');

// ============ 图表事件名称 ============
export const DiagramEventInitialAnimationStarting = 'InitialAnimationStarting';
export const DiagramEventAnimationStarting = 'AnimationStarting';
export const DiagramEventAnimationFinished = 'AnimationFinished';
export const DiagramEventInitialLayoutCompleted = 'InitialLayoutCompleted';
export const DiagramEventLayoutCompleted = 'LayoutCompleted';
export const DiagramEventSelectionMoved = 'SelectionMoved';
export const DiagramEventSelectionCopied = 'SelectionCopied';
export const DiagramEventSelectionDeleted = 'SelectionDeleted';
export const DiagramEventSelectionGrouped = 'SelectionGrouped';
export const DiagramEventSelectionUngrouped = 'SelectionUngrouped';
export const DiagramEventSelectionMoved2 = 'SelectionMoved';
export const DiagramEventPartCreated = 'PartCreated';
export const DiagramEventPartResized = 'PartResized';
export const DiagramEventPartRotated = 'PartRotated';
export const DiagramEventLinkDrawn = 'LinkDrawn';
export const DiagramEventLinkRelinked = 'LinkRelinked';
export const DiagramEventLinkReshaped = 'LinkReshaped';
export const DiagramEventTextEdited = 'TextEdited';
export const DiagramEventGroupExpanded = 'GroupExpanded';
export const DiagramEventGroupCollapsed = 'GroupCollapsed';
export const DiagramEventSubGraphExpanded = 'SubGraphExpanded';
export const DiagramEventSubGraphCollapsed = 'SubGraphCollapsed';
export const DiagramEventViewportBoundsChanged = 'ViewportBoundsChanged';
export const DiagramEventChanged = 'Changed';
export const DiagramEventModelChanged = 'ModelChanged';
export const DiagramEventClipboardChanged = 'ClipboardChanged';
export const DiagramEventUndoManagerStateChanged = 'UndoManagerStateChanged';

// ============ 图层名称 ============
export const LayerBackground = 'Background';
export const LayerGrid = 'Grid';
export const LayerForeground = 'Foreground';
export const LayerAdornment = 'Adornment';
export const LayerTool = 'Tool';

// ============ 装饰类别 ============
export const AdornmentSelection = 'Selection';
export const AdornmentResize = 'Resize';
export const AdornmentRotate = 'Rotate';
export const AdornmentLinkReshape = 'LinkReshape';
export const AdornmentRelink = 'Relink';
export const AdornmentToolTip = 'ToolTip';
export const AdornmentContextMenu = 'ContextMenu';

// ============ 路径段类型 ============
export const PathSegmentLine = new EnumValue('Line');
export const PathSegmentQuadraticBezier = new EnumValue('QuadraticBezier');
export const PathSegmentCubicBezier = new EnumValue('CubicBezier');
export const PathSegmentArc = new EnumValue('Arc');
export const PathSegmentMoveTo = new EnumValue('MoveTo');
export const PathSegmentClose = new EnumValue('Close');

// ============ 画刷类型 ============
export const BrushSolid = new EnumValue('Solid');
export const BrushLinear = new EnumValue('Linear');
export const BrushRadial = new EnumValue('Radial');

// ============ Viewbox 拉伸 ============
export const ViewboxStretchNone = new EnumValue('ViewboxStretchNone');
export const ViewboxStretchFill = new EnumValue('ViewboxStretchFill');
export const ViewboxStretchUniform = new EnumValue('ViewboxStretchUniform');
export const ViewboxStretchUniformToFill = new EnumValue('ViewboxStretchUniformToFill');

// ============ Graduated 面板属性 ============
export const GraduatedPanNone = new EnumValue('GraduatedPanNone');
export const GraduatedPanLeft = new EnumValue('GraduatedPanLeft');
export const GraduatedPanCenter = new EnumValue('GraduatedPanCenter');
export const GraduatedPanRight = new EnumValue('GraduatedPanRight');

// ============ GridSorting ============
export const GridSortingForwards = new EnumValue('Forwards');
export const GridSortingReverse = new EnumValue('Reverse');
export const GridSortingAscending = new EnumValue('Ascending');
export const GridSortingDescending = new EnumValue('Descending');

// ============ GridAlignment ============
export const GridAlignmentLocation = new EnumValue('Location');
export const GridAlignmentPosition = new EnumValue('Position');

// ============ CircularSorting ============
export const CircularSortingForwards = new EnumValue('CircularSortingForwards');
export const CircularSortingReverse = new EnumValue('CircularSortingReverse');
export const CircularSortingAscending = new EnumValue('CircularSortingAscending');
export const CircularSortingDescending = new EnumValue('CircularSortingDescending');
export const CircularSortingOptimized = new EnumValue('CircularSortingOptimized');

// ============ TreeAlignment ============
export const TreeAlignmentTopLeftBus = new EnumValue('TopLeftBus');
export const TreeAlignmentBottomRightBus = new EnumValue('BottomRightBus');
export const TreeAlignmentBus = new EnumValue('Bus');
export const TreeAlignmentBusBranching = new EnumValue('BusBranching');
export const TreeAlignmentCenterChildren = new EnumValue('CenterChildren');
export const TreeAlignmentCenterSubtrees = new EnumValue('CenterSubtrees');
export const TreeAlignmentStart = new EnumValue('Start');
export const TreeAlignmentEnd = new EnumValue('End');

// ============ LayeredDigraphAggressive ============
export const LayeredDigraphAggressiveLess = new EnumValue('Less');
export const LayeredDigraphAggressiveMore = new EnumValue('More');

// ============ LayeredDigraphAlign ============
export const LayeredDigraphAlignNone = new EnumValue('LayeredDigraphAlignNone');

// ============ LinkAdjusting ============
export const LinkAdjustingEnd = new EnumValue('End');
export const LinkAdjustingStretch = new EnumValue('Stretch');

// ============ Orientation ============
export const OrientationNone = new EnumValue('OrientationNone');
export const OrientationAlong = new EnumValue('Along');
export const OrientationMinus90 = new EnumValue('Minus90');
export const OrientationPlus90 = new EnumValue('Plus90');
export const OrientationPlus180 = new EnumValue('Plus180');

// ============ GestureMode ============
export const GestureModeNone = new EnumValue('GestureModeNone');
export const GestureModeCancel = new EnumValue('Cancel');
export const GestureModeZoom = new EnumValue('Zoom');

// ============ WheelMode ============
export const WheelModeZoom = new EnumValue('Zoom');

// ============ TextEditingAccept ============
export const TextEditingAcceptLostFocus = new EnumValue('LostFocus');

// ============ TextEditingStarting ============
export const TextEditingStartingSingleClick = new EnumValue('SingleClick');

// ============ AnimationStyle ============
export const AnimationStyleDefault = new EnumValue('AnimationStyleDefault');
export const AnimationStyleAnimateLocations = new EnumValue('AnimateLocations');
export const AnimationStyleNone = new EnumValue('AnimationStyleNone');

// ============ LayoutConditions ============
export const LayoutConditionsStandard = new EnumValue('Standard');
export const LayoutConditionsNodeSized = new EnumValue('NodeSized');

// ============ GeometryStretch ============
export const GeometryStretchUniform = new EnumValue('Uniform');
export const GeometryStretchNone = new EnumValue('GeometryStretchNone');
export const GeometryStretchFill = new EnumValue('GeometryStretchFill');
export const GeometryStretchUniformToFill = new EnumValue('GeometryStretchUniformToFill');

// ============ VerticalAlignment ============
export const VerticalTop = new EnumValue('VerticalTop');
export const VerticalCenter = new EnumValue('VerticalCenter');
export const VerticalBottom = new EnumValue('VerticalBottom');

// ============ GeometryType ============
export const GeometryTypeLine = new EnumValue('Line');
export const GeometryTypePath = new EnumValue('Path');

// ============ CircularNodeDiameterFormula ============
export const CircularNodeDiameterFormulaCircular = new EnumValue('Circular');
export const CircularNodeDiameterFormulaPythagorean = new EnumValue('Pythagorean');

// ============ LayeredDigraphCycleRemove ============
export const LayeredDigraphCycleRemoveDepthFirst = new EnumValue('DepthFirst');
export const LayeredDigraphCycleRemoveGreedy = new EnumValue('Greedy');

// ============ LayeredDigraphInit ============
export const LayeredDigraphInitDepthFirstIn = new EnumValue('DepthFirstIn');
export const LayeredDigraphInitDepthFirstOut = new EnumValue('DepthFirstOut');
export const LayeredDigraphInitNaive = new EnumValue('Naive');

// ============ LayeredDigraphLayering ============
export const LayeredDigraphLayeringLongestPathSink = new EnumValue('LongestPathSink');
export const LayeredDigraphLayeringLongestPathSource = new EnumValue('LongestPathSource');
export const LayeredDigraphLayeringOptimalLinkLength = new EnumValue('OptimalLinkLength');

// ============ LinkingDirection ============
export const LinkingDirectionForwardsOnly = new EnumValue('ForwardsOnly');

// ============ TriggerStart ============
export const TriggerStartBundled = new EnumValue('Bundled');

// ============ TreeLayerStyle ============
export const TreeLayerStyleSiblings = new EnumValue('Siblings');
