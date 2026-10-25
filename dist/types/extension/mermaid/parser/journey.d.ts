/**
 * Mermaid journey 语法分析器。
 *
 * 支持：
 *  - 头行 `journey`（可同行 `journey title 标题`）
 *  - `title 标题`
 *  - `section 名称` 分组
 *  - 任务行 `任务文本: 分数: 角色1, 角色2`（分数须为数字（0-10，越界由 mapper clamp），非数字忽略该行；角色可省略）
 *
 * 容错：`%%` 注释跳过、无法识别行忽略、不抛异常。
 */
import { JourneyAST } from '../ast';
/** 判断是否 journey */
export declare function isJourney(text: string): boolean;
/** 解析 journey DSL */
export declare function parseJourney(src: string): JourneyAST;
