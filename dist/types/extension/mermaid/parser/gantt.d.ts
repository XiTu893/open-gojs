import { GanttAST } from '../ast';
/** 判断是否 gantt */
export declare function isGantt(text: string): boolean;
/** 解析 gantt DSL */
export declare function parseGantt(src: string): GanttAST;
