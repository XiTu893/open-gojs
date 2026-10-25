/**
 * Mermaid cynefin-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `cynefin-beta` / `cynefin`，可选 `title 标题`
 *  - 域关键字行（complex/complicated/clear/chaotic/confusion，任意顺序、可缺省）开启域块
 *  - 域块内引号行 = items（缩进可有可无）
 *  - 顶层 `A --> B : "标签"` = transition（A==B 忽略）
 *
 * 容错：`%%` 注释跳过、未知行忽略；无当前域的引号行忽略。
 */
import { CynefinAST } from '../ast';
/** 判断是否 cynefin */
export declare function isCynefin(text: string): boolean;
/** 解析 cynefin DSL */
export declare function parseCynefin(src: string): CynefinAST;
