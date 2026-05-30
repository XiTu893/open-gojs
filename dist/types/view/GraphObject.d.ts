import { EnumValue } from '../core/EnumValues';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { Margin, MarginLike } from '../core/Margin';
import { BrushLike } from '../core/Brush';
import { Binding } from '../model/Binding';
import type { Panel } from './Panel';
import type { Part } from './Part';
type Diagram = any;
type Layer = any;
/**
 * GraphObject - base class for ALL visual objects in the GoJS diagramming library.
 * This includes shapes, text blocks, pictures, panels, and parts.
 */
export declare class GraphObject {
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
    get diagram(): Diagram | null;
    get layer(): Layer | null;
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
export {};
