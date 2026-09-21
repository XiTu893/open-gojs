export class TreeNetwork {

  /** The name of this network. */
  name: string;

  /** The nodes in this network. */
  nodeArray: any[];

  /** The edges in this network. */
  edgeArray: any[];

  /** The comments in this network. */
  commentArray: any[];

  constructor(name: string) {
    this.name = name;
    this.nodeArray = [];
    this.edgeArray = [];
    this.commentArray = [];
  }
}