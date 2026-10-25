import { PieAST } from '../ast';
/** 判断是否 pie */
export declare function isPie(text: string): boolean;
/** 解析 pie DSL */
export declare function parsePie(src: string): PieAST;
