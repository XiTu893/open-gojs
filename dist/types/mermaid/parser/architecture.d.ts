/**
 * Mermaid architecture-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `architecture-beta` / `architecture`
 *  - `group 别名(图标)[标题]`（图标 token 忽略 —— 本项目无图标库）
 *  - `service 别名(图标)[标题] [in 组别名]`
 *  - `db 别名(图标)[标题] [in 组别名]`（db 声明头同样当 service）
 *  - 连接 `源别名:源端口 -> 目标端口:目标别名`（端口 R/L/T/B = 右/左/上/下）
 *    容错：无端口写法 `a -> b`（默认 R→L）
 *  - `%%` 注释跳过、未知行忽略、解析不抛错
 */
import { ArchitectureAST } from '../ast';
/** 判断是否 architecture（-beta） */
export declare function isArchitecture(text: string): boolean;
/** 解析 architecture DSL */
export declare function parseArchitecture(src: string): ArchitectureAST;
