/**
 * Mermaid mindmap 语法分析器。
 *
 * 支持：
 *  - 头行 `mindmap`
 *  - 缩进树（首非空行 = 根）
 *  - 形状括号：((文本))=circle/root、[文本]=square、(文本)=rounded、{{文本}}=hexagon、纯文本=rounded
 *  - `%%` 注释行跳过，无法识别行忽略（容错不抛异常）
 */
import { MindmapAST } from '../ast';
/** 判断是否 mindmap（首行头，不 trim —— 缩进的首行不算头） */
export declare function isMindmap(text: string): boolean;
/** 解析 mindmap DSL */
export declare function parseMindmap(src: string): MindmapAST;
