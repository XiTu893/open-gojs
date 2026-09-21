export class LayeredDigraphNetwork {

  /** The name of this network. */
  name: string;

  /** The vertices in this network. */
  vertexArray: any[];

  /** The edges in this network. */
  edgeArray: any[];

  /** The comments in this network. */
  commentArray: any[];

  constructor(name: string) {
    this.name = name;
    this.vertexArray = [];
    this.edgeArray = [];
    this.commentArray = [];
  }
}