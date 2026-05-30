import { Part } from './Part';
import { GraphObject } from './GraphObject';
import { Node } from './Node';
import { Point } from '../core/Point';
import { Spot } from '../core/Spot';
import { List } from '../core/List';
import { EnumValue } from '../core/EnumValues';
/**
 * Link - a Part that represents a connection between two Nodes.
 */
export declare class Link extends Part {
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
