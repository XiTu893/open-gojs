import { EnumValue } from '../core/EnumValues';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin, MarginLike } from '../core/Margin';
import { Map } from '../core/Map';
import { Iterator } from '../core/Iterable';
import { BrushLike } from '../core/Brush';
import { GraphObject } from './GraphObject';
import { RowColumnDefinition } from './RowColumnDefinition';
/**
 * Panel - container that arranges child GraphObjects according to its type.
 */
export declare class Panel extends GraphObject {
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
    private _measureLink;
    private _arrangeLink;
    private _getPointAtDistance;
    private _getAngleAtDistance;
    /** 官方：alignment → defaultAlignment，仍默认则 Center */
    private _resolveAlignment;
    /** 官方：alignmentFocus 默认 → 回退为该元素的 alignment（focus 落在 alignment 同一边） */
    private _resolveAlignmentFocus;
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
}
