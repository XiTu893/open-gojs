export class TreeEdge {

  /** The from node of this edge. */
  from!: any;

  /** The to node of this edge. */
  to!: any;

  /** The label of this edge. */
  label!: string;

  /** The edge sort ID. */
  sortId!: number;

  /** Is this edge a loop. */
  isLoop!: boolean;

  /** Is this edge selected. */
  isSelected!: boolean;

  /** The edge sort ID. */
  sortIdRelative!: number;

  /** The count so far. */
  countSoFar!: number;

  /** The count so far relative. */
  countSoFarRelative!: number;

  /** The count to child. */
  countToChild!: number;

  /** The from sort ID. */
  fromSortId!: number;

  /** The to sort ID. */
  toSortId!: number;

  /** The from count so far. */
  fromCountSoFar!: number;

  /** The to count so far. */
  toCountSoFar!: number;

  /** The from count to child. */
  fromCountToChild!: number;

  /** The to count to child. */
  toCountToChild!: number;
}