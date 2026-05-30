/**
 * DiagramEvent - 图表事件
 */
export declare class DiagramEvent {
    /** 事件名称 */
    name: string;
    /** 图表 */
    diagram: any;
    /** 事件主体 */
    subject: any;
    /** 事件参数 */
    parameter: any;
    constructor(name: string, diagram?: any, subject?: any, parameter?: any);
}
