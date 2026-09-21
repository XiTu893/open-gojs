export class ForceDirectedVertex {

  /** The name/key of this vertex. */
  key: any;

  /** The position of this vertex. */
  position: any;

  /** The comments for this vertex. */
  comments: any[];

  /** The links connected to this vertex. */
  linkConnected: any[];

  /** The mass of this vertex. */
  mass: number;

  /** The charge of this vertex */
  charge: number;

  constructor() {
    this.key = null;
    this.position = null;
    this.comments = [];
    this.linkConnected = [];
    this.mass = 1;
    this.charge = -30;
  }
}