/**
 * wardley 渲染器 —— 只建模板 + 装配模型（数据由 mapper/wardley 提供，零布局数学）。
 *
 * - 背景：外框 / 分区浅灰带 / 竖分隔线 / 区段与轴标签 / 标题
 * - 组件 = Ellipse 小点 + 名称标签；decorator = Triangle/Diamond/Rectangle/Ellipse 小符号
 * - 连线：flow 带箭头、依赖无箭头；evolve = dash + 箭头（水平虚线，同组件行）
 * - note = 浅底圆角文本框（中心对齐）
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedWardleyNode, MappedWardleyLink } from '../mapper/wardley';
/** 渲染 wardley 到 div（data = mapWardley 的输出） */
export declare function renderWardley(divId: string, data: {
    nodes: MappedWardleyNode[];
    links: MappedWardleyLink[];
}, theme: MermaidTheme): Diagram;
