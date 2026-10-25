import { ErAST } from '../ast';
/** 判断是否 erDiagram */
export declare function isEr(text: string): boolean;
/** 解析 erDiagram DSL */
export declare function parseEr(src: string): ErAST;
