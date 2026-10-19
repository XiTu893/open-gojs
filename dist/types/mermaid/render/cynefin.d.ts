/**
 * cynefin 渲染器 —— 只建模板 + 装配模型（数据由 mapper/cynefin 提供，零布局数学）。
 *
 * - 四域框 = Rectangle（浅灰底黑边，w/h 数据驱动）+ 域标题粗体 + 副标题小字
 * - items 徽章 = 小 RoundedRectangle 条（纵排由 mapper 定位）
 * - confusion = 中央 Ellipse；transitions = 跨域正交箭头连线（带标签）
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedCynefinNode, MappedCynefinLink } from '../mapper/cynefin';
/** 渲染 cynefin 到 div（data = mapCynefin 的输出） */
export declare function renderCynefin(divId: string, data: {
    nodes: MappedCynefinNode[];
    links: MappedCynefinLink[];
}, theme: MermaidTheme): Diagram;
