import './core/Polyfill';
export * from './core/EnumValues';
export { Flip, TextFormat, PortSpreading, CollapsePolicy, ViewboxStretch, BrushType, ColorSpace, CircularNodeDiameterFormula, ReshapingBehavior, TextEditingState, Figures, Arrowheads, ToolNames, Builders, LayerNames, } from './core/EnumNamespaces';
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
export declare const version = "0.1.0";
export { Animation, AnimationState, AnimationConfig } from './animation/Animation';
export { AnimationTrigger } from './animation/AnimationTrigger';
export { AnimationManager } from './animation/AnimationManager';
export { CommandHandler } from './command/CommandHandler';
export { CanvasRenderer } from './render/CanvasRenderer';
export { SvgRenderer } from './render/SvgRenderer';
export type { MakeSvgOptions } from './render/SvgRenderer';
export { figures, getFigureGeometry } from './figures/Figures';
export declare const GridSorting: {
    Forwards: import("./core/EnumValues").EnumValue;
    Reverse: import("./core/EnumValues").EnumValue;
    Ascending: import("./core/EnumValues").EnumValue;
    Descending: import("./core/EnumValues").EnumValue;
};
export declare const GridAlignment: {
    Location: import("./core/EnumValues").EnumValue;
    Position: import("./core/EnumValues").EnumValue;
};
export declare const Curve: {
    None: import("./core/EnumValues").EnumValue;
    Bezier: import("./core/EnumValues").EnumValue;
    JumpOver: import("./core/EnumValues").EnumValue;
    JumpGap: import("./core/EnumValues").EnumValue;
};
export declare const AutoScale: {
    None: import("./core/EnumValues").EnumValue;
    Uniform: import("./core/EnumValues").EnumValue;
    UniformToFill: import("./core/EnumValues").EnumValue;
};
export declare const Routing: {
    Normal: import("./core/EnumValues").EnumValue;
    Orthogonal: import("./core/EnumValues").EnumValue;
    AvoidsNodes: import("./core/EnumValues").EnumValue;
    AvoidsNodesStraight: import("./core/EnumValues").EnumValue;
};
export declare const ScrollMode: {
    Document: import("./core/EnumValues").EnumValue;
    Infinite: import("./core/EnumValues").EnumValue;
};
export declare const Stretch: {
    None: import("./core/EnumValues").EnumValue;
    Default: import("./core/EnumValues").EnumValue;
    Fill: import("./core/EnumValues").EnumValue;
    Vertical: import("./core/EnumValues").EnumValue;
    Horizontal: import("./core/EnumValues").EnumValue;
};
export declare const TreeStyle: {
    Layered: import("./core/EnumValues").EnumValue;
    Alternating: import("./core/EnumValues").EnumValue;
    LastParents: import("./core/EnumValues").EnumValue;
    RootOnly: import("./core/EnumValues").EnumValue;
};
export declare const TreeAlignment: {
    TopLeftBus: import("./core/EnumValues").EnumValue;
    BottomRightBus: import("./core/EnumValues").EnumValue;
    Bus: import("./core/EnumValues").EnumValue;
    BusBranching: import("./core/EnumValues").EnumValue;
    CenterChildren: import("./core/EnumValues").EnumValue;
    CenterSubtrees: import("./core/EnumValues").EnumValue;
    Start: import("./core/EnumValues").EnumValue;
    End: import("./core/EnumValues").EnumValue;
    Custom: import("./core/EnumValues").EnumValue;
};
export declare const TreeCompaction: {
    Block: import("./core/EnumValues").EnumValue;
    None: import("./core/EnumValues").EnumValue;
};
export declare const TreeSorting: {
    Forwards: import("./core/EnumValues").EnumValue;
    Reverse: import("./core/EnumValues").EnumValue;
    Ascending: import("./core/EnumValues").EnumValue;
    Descending: import("./core/EnumValues").EnumValue;
};
export declare const TreeArrangement: {
    Vertical: import("./core/EnumValues").EnumValue;
    Horizontal: import("./core/EnumValues").EnumValue;
    FixedRoots: import("./core/EnumValues").EnumValue;
};
export declare const TreeLayerStyle: {
    Individual: import("./core/EnumValues").EnumValue;
    Uniform: import("./core/EnumValues").EnumValue;
    Siblings: import("./core/EnumValues").EnumValue;
};
export declare const TreePath: {
    Default: import("./core/EnumValues").EnumValue;
    Destination: import("./core/EnumValues").EnumValue;
    Source: import("./core/EnumValues").EnumValue;
};
export declare const CircularArrangement: {
    ConstantSpacing: import("./core/EnumValues").EnumValue;
    ConstantDistance: import("./core/EnumValues").EnumValue;
    ConstantAngle: import("./core/EnumValues").EnumValue;
    Packed: import("./core/EnumValues").EnumValue;
};
export declare const CircularSorting: {
    Forwards: import("./core/EnumValues").EnumValue;
    Reverse: import("./core/EnumValues").EnumValue;
    Ascending: import("./core/EnumValues").EnumValue;
    Descending: import("./core/EnumValues").EnumValue;
    Optimized: import("./core/EnumValues").EnumValue;
};
export declare const LayeredDigraphAggressive: {
    None: import("./core/EnumValues").EnumValue;
    Less: import("./core/EnumValues").EnumValue;
    More: import("./core/EnumValues").EnumValue;
};
export declare const LayeredDigraphAlign: {
    None: import("./core/EnumValues").EnumValue;
    UpperLeft: import("./core/EnumValues").EnumValue;
    UpperRight: import("./core/EnumValues").EnumValue;
    LowerLeft: import("./core/EnumValues").EnumValue;
    LowerRight: import("./core/EnumValues").EnumValue;
    All: import("./core/EnumValues").EnumValue;
};
export declare const LayeredDigraphPack: {
    None: import("./core/EnumValues").EnumValue;
    Expand: import("./core/EnumValues").EnumValue;
    Straighten: import("./core/EnumValues").EnumValue;
    Median: import("./core/EnumValues").EnumValue;
    MaybeExpand: import("./core/EnumValues").EnumValue;
    All: import("./core/EnumValues").EnumValue;
};
export declare const GridArrangement: {
    LeftToRight: import("./core/EnumValues").EnumValue;
    RightToLeft: import("./core/EnumValues").EnumValue;
};
export declare const PanelTypes: {
    Auto: import("./core/EnumValues").EnumValue;
    Position: import("./core/EnumValues").EnumValue;
    Vertical: import("./core/EnumValues").EnumValue;
    Horizontal: import("./core/EnumValues").EnumValue;
    Spot: import("./core/EnumValues").EnumValue;
    Table: import("./core/EnumValues").EnumValue;
    TableColumn: import("./core/EnumValues").EnumValue;
    TableRow: import("./core/EnumValues").EnumValue;
    Viewbox: import("./core/EnumValues").EnumValue;
    Link: import("./core/EnumValues").EnumValue;
    Grid: import("./core/EnumValues").EnumValue;
    Graduated: import("./core/EnumValues").EnumValue;
};
export declare const BindingMode: {
    OneWay: import("./core/EnumValues").EnumValue;
    TwoWay: import("./core/EnumValues").EnumValue;
};
export declare const CircularDirection: {
    Clockwise: import("./core/EnumValues").EnumValue;
    Counterclockwise: import("./core/EnumValues").EnumValue;
    BidirectionalLeft: import("./core/EnumValues").EnumValue;
    BidirectionalRight: import("./core/EnumValues").EnumValue;
};
export declare const LayeredDigraphDirection: {
    Down: number;
    Up: number;
    Left: number;
    Right: number;
};
export declare const LayeredDigraphInit: {
    DepthFirstOut: import("./core/EnumValues").EnumValue;
    DepthFirstIn: import("./core/EnumValues").EnumValue;
    Naive: import("./core/EnumValues").EnumValue;
};
export declare const LayeredDigraphLayering: {
    OptimalLinkLength: import("./core/EnumValues").EnumValue;
    LongestPathSink: import("./core/EnumValues").EnumValue;
    LongestPathSource: import("./core/EnumValues").EnumValue;
};
export declare const LayeredDigraphCycleRemove: {
    DepthFirst: import("./core/EnumValues").EnumValue;
    Greedy: import("./core/EnumValues").EnumValue;
    FromLayers: import("./core/EnumValues").EnumValue;
};
export declare const ImageStretch: {
    None: import("./core/EnumValues").EnumValue;
    Fill: import("./core/EnumValues").EnumValue;
    Uniform: import("./core/EnumValues").EnumValue;
    UniformToFill: import("./core/EnumValues").EnumValue;
};
export declare const Sizing: {
    Default: import("./core/EnumValues").EnumValue;
    None: import("./core/EnumValues").EnumValue;
    ProportionalExtra: import("./core/EnumValues").EnumValue;
};
export declare const Wrap: {
    None: import("./core/EnumValues").EnumValue;
    Fit: import("./core/EnumValues").EnumValue;
    DesiredSize: import("./core/EnumValues").EnumValue;
    BreakAll: import("./core/EnumValues").EnumValue;
};
export declare const CycleMode: {
    All: import("./core/EnumValues").EnumValue;
    NotDirected: import("./core/EnumValues").EnumValue;
    NotDirectedFast: import("./core/EnumValues").EnumValue;
    NotUndirected: import("./core/EnumValues").EnumValue;
    DestinationTree: import("./core/EnumValues").EnumValue;
    SourceTree: import("./core/EnumValues").EnumValue;
};
export declare const ChangeType: {
    Transaction: import("./core/EnumValues").EnumValue;
    Property: import("./core/EnumValues").EnumValue;
    Insert: import("./core/EnumValues").EnumValue;
    Remove: import("./core/EnumValues").EnumValue;
};
export { SegmentType } from './core/EnumValues';
export declare const AnimationStyle: {
    Default: import("./core/EnumValues").EnumValue;
    AnimateLocations: import("./core/EnumValues").EnumValue;
    None: import("./core/EnumValues").EnumValue;
};
export declare const LinkAdjusting: {
    None: import("./core/EnumValues").EnumValue;
    End: import("./core/EnumValues").EnumValue;
    Scale: import("./core/EnumValues").EnumValue;
    Stretch: import("./core/EnumValues").EnumValue;
};
export declare const Orientation: {
    None: import("./core/EnumValues").EnumValue;
    Along: import("./core/EnumValues").EnumValue;
    Plus90: import("./core/EnumValues").EnumValue;
    Minus90: import("./core/EnumValues").EnumValue;
    Opposite: import("./core/EnumValues").EnumValue;
    Upright: import("./core/EnumValues").EnumValue;
    Plus90Upright: import("./core/EnumValues").EnumValue;
    Minus90Upright: import("./core/EnumValues").EnumValue;
    Upright45: import("./core/EnumValues").EnumValue;
};
export declare const GestureMode: {
    None: import("./core/EnumValues").EnumValue;
    Cancel: import("./core/EnumValues").EnumValue;
    Zoom: import("./core/EnumValues").EnumValue;
};
export declare const WheelMode: {
    Scroll: import("./core/EnumValues").EnumValue;
    Zoom: import("./core/EnumValues").EnumValue;
    None: import("./core/EnumValues").EnumValue;
};
export declare const TextEditingAccept: {
    LostFocus: import("./core/EnumValues").EnumValue;
    MouseDown: import("./core/EnumValues").EnumValue;
    Tab: import("./core/EnumValues").EnumValue;
    Enter: import("./core/EnumValues").EnumValue;
};
export declare const TextEditingStarting: {
    SingleClick: import("./core/EnumValues").EnumValue;
    SingleClickSelected: import("./core/EnumValues").EnumValue;
    DoubleClick: import("./core/EnumValues").EnumValue;
};
export declare const LayoutConditions: {
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
export { GeometryStretch, GeometryType } from './core/EnumValues';
export declare const LinkingDirection: {
    Either: import("./core/EnumValues").EnumValue;
    ForwardsOnly: import("./core/EnumValues").EnumValue;
    BackwardsOnly: import("./core/EnumValues").EnumValue;
};
export declare const TriggerStart: {
    Default: import("./core/EnumValues").EnumValue;
    Immediate: import("./core/EnumValues").EnumValue;
    Bundled: import("./core/EnumValues").EnumValue;
};
export declare const Overflow: {
    Clip: import("./core/EnumValues").EnumValue;
    Ellipsis: import("./core/EnumValues").EnumValue;
};
export declare const TextOverflow: {
    Clip: import("./core/EnumValues").EnumValue;
    Ellipsis: import("./core/EnumValues").EnumValue;
};
