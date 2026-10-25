import { SequenceAST } from '../ast';
/** 判断是否 sequenceDiagram */
export declare function isSequence(text: string): boolean;
/** 解析 sequenceDiagram DSL */
export declare function parseSequence(src: string): SequenceAST;
