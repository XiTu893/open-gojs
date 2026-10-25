import { FlowchartAST } from '../ast';
/** 判断 DSL 首行类型是否为 flowchart */
export declare function isFlowchart(text: string): boolean;
/** 解析 flowchart DSL 文本 */
export declare function parseFlowchart(src: string): FlowchartAST;
