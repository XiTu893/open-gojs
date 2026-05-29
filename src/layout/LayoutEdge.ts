import { Link } from '../view/Link';
import { LayoutVertex } from './LayoutVertex';
import { LayoutNetwork } from './LayoutNetwork';

/**
 * LayoutEdge - represents a link in the layout network.
 */
export class LayoutEdge {
  /** The network this edge belongs to */
  network: LayoutNetwork | null = null;

  /** The source vertex of this edge */
  fromVertex: LayoutVertex | null = null;

  /** The destination vertex of this edge */
  toVertex: LayoutVertex | null = null;

  /** The Link associated with this edge, if any */
  link: Link | null = null;

  /** The preferred length of this edge */
  length: number = NaN;

  /** The weight of this edge for layout calculations */
  weight: number = 1;

  /** Get the other vertex given one vertex of this edge */
  getOtherVertex(vertex: LayoutVertex): LayoutVertex | null {
    if (vertex === this.fromVertex) return this.toVertex;
    if (vertex === this.toVertex) return this.fromVertex;
    return null;
  }
}
