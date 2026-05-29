import { Rect } from '../core/Rect';
import { List } from '../core/List';
import { Part } from '../view/Part';
import { Node } from '../view/Node';
import { LayoutEdge } from './LayoutEdge';
import { LayoutNetwork } from './LayoutNetwork';

/**
 * LayoutVertex - represents a node in the layout network.
 */
export class LayoutVertex {
  /** The network this vertex belongs to */
  network: LayoutNetwork | null = null;

  /** X position of the vertex center */
  x: number = 0;

  /** Y position of the vertex center */
  y: number = 0;

  /** Bounding rectangle of the vertex */
  bounds: Rect = new Rect(0, 0, 0, 0);

  /** Width of the vertex */
  get width(): number {
    return this.bounds.width;
  }
  set width(val: number) {
    this.bounds.width = val;
  }

  /** Height of the vertex */
  get height(): number {
    return this.bounds.height;
  }
  set height(val: number) {
    this.bounds.height = val;
  }

  /** Focus X offset (0-1 relative to width) for connection points */
  focusX: number = 0.5;

  /** Focus Y offset (0-1 relative to height) for connection points */
  focusY: number = 0.5;

  /** The Part associated with this vertex, if any */
  part: Part | null = null;

  /** Edges where this vertex is the source */
  sourceEdges: List<LayoutEdge> = new List<LayoutEdge>();

  /** Edges where this vertex is the destination */
  destinationEdges: List<LayoutEdge> = new List<LayoutEdge>();

  /** The Node associated with this vertex, if any */
  node: Node | null = null;

  /** Whether this vertex is artificial (not associated with a real part) */
  _isArtificial: boolean = false;

  /** Internal index for algorithms */
  _index: number = -1;

  /** Add an edge where this vertex is the destination */
  addDestinationEdge(edge: LayoutEdge): void {
    this.destinationEdges.add(edge);
  }

  /** Add an edge where this vertex is the source */
  addSourceEdge(edge: LayoutEdge): void {
    this.sourceEdges.add(edge);
  }

  /** Delete an edge from both source and destination lists */
  deleteEdge(edge: LayoutEdge): void {
    this.sourceEdges.remove(edge);
    this.destinationEdges.remove(edge);
  }

  /** Get the center point of this vertex */
  get center(): { x: number; y: number } {
    return {
      x: this.x + this.width * this.focusX,
      y: this.y + this.height * this.focusY
    };
  }

  static smartComparer(a: LayoutVertex, b: LayoutVertex): number {
    const na = (a as any).data ? String((a as any).data.key) : '';
    const nb = (b as any).data ? String((b as any).data.key) : '';
    const naNum = parseFloat(na);
    const nbNum = parseFloat(nb);
    if (!isNaN(naNum) && !isNaN(nbNum)) return naNum - nbNum;
    return na < nb ? -1 : na > nb ? 1 : 0;
  }
}
