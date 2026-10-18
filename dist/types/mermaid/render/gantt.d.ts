/**
 * gantt 渲染器 —— 手动定位的甘特图。
 *
 * - 左列任务名，右侧时间轴与任务条
 * - 解析日期（dateFormat）与工期（Nd/Nw/Nm），支持 after 依赖顺延
 * - section 分组标题
 * - 时间轴：每天一根网格线 + 日期刻度标签；任务条旁显示起止日期
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { GanttAST } from '../ast';
/** 渲染 gantt 到 div */
export declare function renderGantt(divId: string, ast: GanttAST, theme: MermaidTheme): Diagram;
