/**
 * DiagramEvent - 图表事件
 */
export class DiagramEvent {
  /** 事件名称 */
  public name: string;
  /** 图表 */
  public diagram: any;
  /** 事件主体 */
  public subject: any;
  /** 事件参数 */
  public parameter: any;

  constructor(name: string, diagram?: any, subject?: any, parameter?: any) {
    this.name = name;
    this.diagram = diagram || null;
    this.subject = subject || null;
    this.parameter = parameter || null;
  }
}
