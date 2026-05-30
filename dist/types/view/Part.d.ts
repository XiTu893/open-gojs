import { Panel } from './Panel';
import { GraphObject } from './GraphObject';
import { Point } from '../core/Point';
import { Rect } from '../core/Rect';
import { Spot } from '../core/Spot';
import { Map } from '../core/Map';
import { Iterator } from '../core/Iterable';
import { EnumValue } from '../core/EnumValues';
/**
 * Part - base class for top-level visual elements (Node, Link, Adornment).
 * Extends Panel with location, selection, shadow, and adornment support.
 */
export declare class Part extends Panel {
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
