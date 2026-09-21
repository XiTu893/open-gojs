export class ForceDirectedEdge {

  /** The from node of this edge. */
  from: any;

  /** The to node of this edge. */
  to: any;

  /** The label of this edge. */
  label: string;

  /** The length of this edge. */
  length: number;

  /** The curvature of this edge. */
  curvature: number;

  /** The route of this edge. */
  route: any[];

  /** The stroke of this edge. */
  stroke: string;

  /** The stroke width of this edge. */
  strokeWidth: number;

  /** The dash array of this edge. */
  strokeDashArray: number[];

  /** The dash offset of this edge. */
  strokeDashOffset: number;

  /** The arrow head of this edge. */
  toArrow: string;

  /** The from arrow head of this edge. */
  fromArrow: string;

  constructor() {
    this.from = null;
    this.to = null;
    this.label = '';
    this.length = 100;
    this.curvature = 0;
    this.route = [];
    this.stroke = 'blue';
    this.strokeWidth = 1;
    this.strokeDashArray = [];
    this.strokeDashOffset = 0;
    this.toArrow = 'Standard';
    this.fromArrow = 'None';
  }
}