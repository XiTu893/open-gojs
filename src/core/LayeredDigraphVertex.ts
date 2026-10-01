export class LayeredDigraphVertex {
  static readonly className: string = "LayeredDigraphVertex";

  /** The key of this vertex. */
  key!: any;

  /** The position of this vertex. */
  position!: any;

  /** The comments for this vertex. */
  comments!: any[];

  /** The links connected to this vertex. */
  linkConnected!: any[];

  /** The network this vertex belongs to. */
  network!: any;
}