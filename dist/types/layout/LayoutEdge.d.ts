import { Link } from '../view/Link';
import { LayoutVertex } from './LayoutVertex';
import { LayoutNetwork } from './LayoutNetwork';
/**
 * LayoutEdge - represents a link in the layout network.
 */
export declare class LayoutEdge {
    /** The network this edge belongs to */
    network: LayoutNetwork | null;
    /** The source vertex of this edge */
    fromVertex: LayoutVertex | null;
    /** The destination vertex of this edge */
    toVertex: LayoutVertex | null;
    /** The Link associated with this edge, if any */
    link: Link | null;
    /** The preferred length of this edge */
    length: number;
    /** The weight of this edge for layout calculations */
    weight: number;
    /** Get the other vertex given one vertex of this edge */
    getOtherVertex(vertex: LayoutVertex): LayoutVertex | null;
}
