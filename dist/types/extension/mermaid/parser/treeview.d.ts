/**
 * Mermaid treeView-beta（文件树）语法分析器。
 *
 * 支持：
 *  - 头行 `treeView-beta`
 *  - 缩进定义深度；尾部 `/` = 目录（dir:true）
 *  - 行内 `## 描述` → desc
 *  - 引号标签支持空格（自动去引号）
 *  - box-drawing 行（├──/└──/│ 前缀，按分支字符列位置推深度）
 *  - 忽略 :::class 行与 icon(...)（容错不抛异常）
 */
import { TreeViewAST } from '../ast';
/** 判断是否 treeView */
export declare function isTreeView(text: string): boolean;
/** 解析 treeView DSL */
export declare function parseTreeView(src: string): TreeViewAST;
