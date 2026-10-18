import { StateAST } from '../ast';
/** 判断是否 stateDiagram */
export declare function isState(text: string): boolean;
/** 解析 stateDiagram DSL */
export declare function parseState(src: string): StateAST;
