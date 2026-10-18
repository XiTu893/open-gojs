import { ClassAST } from '../ast';
/** 判断是否 classDiagram */
export declare function isClass(text: string): boolean;
/** 解析 classDiagram DSL */
export declare function parseClass(src: string): ClassAST;
