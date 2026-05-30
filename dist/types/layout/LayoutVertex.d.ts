import { Rect } from '../core/Rect';
import { List } from '../core/List';
import { Part } from '../view/Part';
import { Node } from '../view/Node';
import { LayoutEdge } from './LayoutEdge';
import { LayoutNetwork } from './LayoutNetwork';
/**
 * LayoutVertex - represents a node in the layout network.
 */
export declare class LayoutVertex {
    /** The network this vertex belongs to */
    network: LayoutNetwork | null;
    /** X position of the vertex center */
    x: number;
    /** Y position of the vertex center */
    y: number;
    /** Bounding rectangle of the vertex */
    bounds: Rect;
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
    /** Delete an edge from both source and destination lists */
    deleteEdge(edge: LayoutEdge): void;
    /** Get the center point of this vertex */
    get center(): {
        x: number;
        y: number;
    };
    static smartComparer(a: LayoutVertex, b: LayoutVertex): number;
}
