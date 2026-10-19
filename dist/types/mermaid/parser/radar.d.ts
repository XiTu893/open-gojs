/**
 * Mermaid radar-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `radar-beta` / `radar`
 *  - `title 标题`
 *  - `axis 速度, 质量, 安全, 成本`（容忍 `axis id1["标签"], id2`，取引号文本为显示名）
 *  - `curve 项目A{8, 6, 7, 5}`（值按 axis 顺序；也容忍 `{8,6,7,5}` 外空白）
 *  - `ticks 5`（缺省 5）
 *  - `showLegend true|false`（缺省 true）
 *
 * 容错：`%%` 注释跳过、未知行忽略；不支持 `{axis: 值}` 对象形式（按数组容错）。
 */
import { RadarAST } from '../ast';
/** 判断是否 radar */
export declare function isRadar(text: string): boolean;
/** 解析 radar DSL */
export declare function parseRadar(src: string): RadarAST;
