export interface IncrementalData {

  /** The model. */
  model: any;

  /** The changed links. */
  changedLinks: any[];

  /** The changed nodes. */
  changedNodes: any[];

  /** The added links. */
  addedLinks: any[];

  /** The added nodes. */
  addedNodes: any[];

  /** The removed links. */
  removedLinks: any[];

  /** The removed nodes. */
  removedNodes: any[];
}