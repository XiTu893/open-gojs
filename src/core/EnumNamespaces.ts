/**
 * 阶段 3 —— 官方命名空间枚举对象。
 *
 * 这里只放两类东西：
 *  1. 由 `EnumValues.ts` 常量拼装出的枚举命名空间对象（成员名与官方 gojs@4.0.4 运行时一致）；
 *  2. 官方以 `declare const {...}` 导出的**纯字符串名映射**（Figures / Arrowheads /
 *     ToolNames / Builders / LayerNames），其键值由官方运行时逐字节拷贝，保证样例代码可直接复用。
 *
 * 注意：本项目其余枚举用 `EnumValue` 单例表示（`x === y` 即可比较），
 * 唯独 `LayoutConditions` 是位掩码，见 `EnumValues.ts`。
 * 官方这些枚举在 TS 里是 `declare enum`（数字），值本身与本项目不同；
 * 本项目只保证**成员集合**与官方一致，不保证数值一致（面板类型 `Panel.Auto` 官方同样是对象而非数字）。
 */
import {
  FlipNone, FlipVertical, FlipHorizontal, FlipBoth,
  TextFormatTrim, TextFormatNone,
  PortSpreadingNone, PortSpreadingEvenly, PortSpreadingPacked,
  CollapsePolicyTreeParent, CollapsePolicyAllParents, CollapsePolicyAnyParents,
  ViewboxStretchUniform, ViewboxStretchUniformToFill,
  BrushSolid, BrushLinear, BrushRadial, BrushPattern,
  ColorSpaceLab, ColorSpaceHSL, ColorSpaceOklch,
  CircularNodeDiameterFormulaCircular, CircularNodeDiameterFormulaPythagorean,
  ReshapingBehaviorNone, ReshapingBehaviorHorizontal, ReshapingBehaviorVertical, ReshapingBehaviorAll,
  TextEditingStateNone, TextEditingStateActive, TextEditingStateEditing,
  TextEditingStateValidating, TextEditingStateInvalid, TextEditingStateValidated,
} from './EnumValues';

export const Flip = {
  None: FlipNone,
  Vertical: FlipVertical,
  Horizontal: FlipHorizontal,
  Both: FlipBoth,
};

export const TextFormat = {
  Trim: TextFormatTrim,
  None: TextFormatNone,
};

export const PortSpreading = {
  None: PortSpreadingNone,
  Evenly: PortSpreadingEvenly,
  Packed: PortSpreadingPacked,
};

export const CollapsePolicy = {
  TreeParent: CollapsePolicyTreeParent,
  AllParents: CollapsePolicyAllParents,
  AnyParents: CollapsePolicyAnyParents,
};

export const ViewboxStretch = {
  Uniform: ViewboxStretchUniform,
  UniformToFill: ViewboxStretchUniformToFill,
};

export const BrushType = {
  Solid: BrushSolid,
  Linear: BrushLinear,
  Radial: BrushRadial,
  Pattern: BrushPattern,
};

export const ColorSpace = {
  Lab: ColorSpaceLab,
  HSL: ColorSpaceHSL,
  Oklch: ColorSpaceOklch,
};

export const CircularNodeDiameterFormula = {
  Pythagorean: CircularNodeDiameterFormulaPythagorean,
  Circular: CircularNodeDiameterFormulaCircular,
};

export const ReshapingBehavior = {
  None: ReshapingBehaviorNone,
  Horizontal: ReshapingBehaviorHorizontal,
  Vertical: ReshapingBehaviorVertical,
  All: ReshapingBehaviorAll,
};

export const TextEditingState = {
  None: TextEditingStateNone,
  Active: TextEditingStateActive,
  Editing: TextEditingStateEditing,
  Validating: TextEditingStateValidating,
  Invalid: TextEditingStateInvalid,
  Validated: TextEditingStateValidated,
};

// ==== 以下为官方 `declare const {...}` 纯字符串名映射（键值照抄官方 4.0.4）====

export const Figures = {
  None: 'None', Rectangle: 'Rectangle', Square: 'Square', RoundedRectangle: 'RoundedRectangle',
  Border: 'Border', RoundedTopRectangle: 'RoundedTopRectangle',
  RoundedBottomRectangle: 'RoundedBottomRectangle',
  RoundedLeftRectangle: 'RoundedLeftRectangle', RoundedRightRectangle: 'RoundedRightRectangle',
  Ellipse: 'Ellipse', Circle: 'Circle', TriangleRight: 'TriangleRight',
  TriangleDown: 'TriangleDown', TriangleLeft: 'TriangleLeft', TriangleUp: 'TriangleUp',
  Triangle: 'Triangle', Diamond: 'Diamond', LineH: 'LineH', LineV: 'LineV', BarH: 'BarH',
  BarV: 'BarV', MinusLine: 'MinusLine', PlusLine: 'PlusLine', XLine: 'XLine',
  LineRight: 'LineRight', LineDown: 'LineDown', LineLeft: 'LineLeft', LineUp: 'LineUp',
  Capsule: 'Capsule', Borders: 'Borders',
};

export const Arrowheads = {
  Standard: 'Standard', Backward: 'Backward', Triangle: 'Triangle',
  BackwardTriangle: 'BackwardTriangle', Boomerang: 'Boomerang',
  BackwardBoomerang: 'BackwardBoomerang', SidewaysV: 'SidewaysV', BackwardV: 'BackwardV',
  OpenTriangle: 'OpenTriangle', BackwardOpenTriangle: 'BackwardOpenTriangle',
  OpenTriangleLine: 'OpenTriangleLine', BackwardOpenTriangleLine: 'BackwardOpenTriangleLine',
  OpenTriangleTop: 'OpenTriangleTop', BackwardOpenTriangleTop: 'BackwardOpenTriangleTop',
  OpenTriangleBottom: 'OpenTriangleBottom',
  BackwardOpenTriangleBottom: 'BackwardOpenTriangleBottom', HalfTriangleTop: 'HalfTriangleTop',
  BackwardHalfTriangleTop: 'BackwardHalfTriangleTop', HalfTriangleBottom: 'HalfTriangleBottom',
  BackwardHalfTriangleBottom: 'BackwardHalfTriangleBottom',
  ForwardSemiCircle: 'ForwardSemiCircle', BackwardSemiCircle: 'BackwardSemiCircle',
  Feather: 'Feather', BackwardFeather: 'BackwardFeather', DoubleFeathers: 'DoubleFeathers',
  BackwardDoubleFeathers: 'BackwardDoubleFeathers', TripleFeathers: 'TripleFeathers',
  BackwardTripleFeathers: 'BackwardTripleFeathers', ForwardSlash: 'ForwardSlash',
  BackSlash: 'BackSlash', DoubleForwardSlash: 'DoubleForwardSlash',
  DoubleBackSlash: 'DoubleBackSlash', TripleForwardSlash: 'TripleForwardSlash',
  TripleBackSlash: 'TripleBackSlash', Fork: 'Fork', BackwardFork: 'BackwardFork',
  LineFork: 'LineFork', BackwardLineFork: 'BackwardLineFork', CircleFork: 'CircleFork',
  BackwardCircleFork: 'BackwardCircleFork', CircleLineFork: 'CircleLineFork',
  BackwardCircleLineFork: 'BackwardCircleLineFork', Circle: 'Circle', Block: 'Block',
  StretchedDiamond: 'StretchedDiamond', Diamond: 'Diamond', Chevron: 'Chevron',
  StretchedChevron: 'StretchedChevron', NormalArrow: 'NormalArrow', X: 'X',
  TailedNormalArrow: 'TailedNormalArrow', DoubleTriangle: 'DoubleTriangle',
  BigEndArrow: 'BigEndArrow', ConcaveTailArrow: 'ConcaveTailArrow',
  RoundedTriangle: 'RoundedTriangle', SimpleArrow: 'SimpleArrow',
  AccelerationArrow: 'AccelerationArrow', BoxArrow: 'BoxArrow', TriangleLine: 'TriangleLine',
  CircleEndedArrow: 'CircleEndedArrow', DynamicWidthArrow: 'DynamicWidthArrow',
  EquilibriumArrow: 'EquilibriumArrow', FastForward: 'FastForward', Kite: 'Kite',
  HalfArrowTop: 'HalfArrowTop', HalfArrowBottom: 'HalfArrowBottom',
  OpposingDirectionDoubleArrow: 'OpposingDirectionDoubleArrow',
  PartialDoubleTriangle: 'PartialDoubleTriangle', LineCircle: 'LineCircle',
  DoubleLineCircle: 'DoubleLineCircle', TripleLineCircle: 'TripleLineCircle',
  CircleLine: 'CircleLine', DiamondCircle: 'DiamondCircle', PlusCircle: 'PlusCircle',
  OpenRightTriangleTop: 'OpenRightTriangleTop',
  OpenRightTriangleBottom: 'OpenRightTriangleBottom', Line: 'Line', DoubleLine: 'DoubleLine',
  TripleLine: 'TripleLine', PentagonArrow: 'PentagonArrow',
};

export const ToolNames = {
  Action: 'Action', Relinking: 'Relinking', LinkReshaping: 'LinkReshaping',
  Rotating: 'Rotating', Resizing: 'Resizing', Linking: 'Linking', Dragging: 'Dragging',
  DragSelecting: 'DragSelecting', Panning: 'Panning', ContextMenu: 'ContextMenu',
  TextEditing: 'TextEditing', ClickCreating: 'ClickCreating', ClickSelecting: 'ClickSelecting',
};

export const Builders = {
  Button: 'Button', TreeExpanderButton: 'TreeExpanderButton',
  SubGraphExpanderButton: 'SubGraphExpanderButton', ToolTip: 'ToolTip',
  ContextMenu: 'ContextMenu', ContextMenuButton: 'ContextMenuButton',
  PanelExpanderButton: 'PanelExpanderButton', CheckBoxButton: 'CheckBoxButton',
  CheckBox: 'CheckBox', AutoRepeatButton: 'AutoRepeatButton', ToggleSwitch: 'ToggleSwitch',
  Toggle: 'Toggle',
};

export const LayerNames = {
  Grid: 'Grid', ViewportBackground: 'ViewportBackground', Background: 'Background',
  Default: '', Foreground: 'Foreground', ViewportForeground: 'ViewportForeground',
  Adornment: 'Adornment', Tool: 'Tool',
};
