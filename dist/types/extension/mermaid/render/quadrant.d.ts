/**
 * quadrantChart 渲染器 —— 只建模板 + 装配模型（数据由 mapper/quadrant 提供，零布局数学）。
 *
 * 结构：棋盘底色 4 块 → 外框 + 十字分割线 → 象限文字 → 轴端标签 → 数据点圆 + 标签。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedQuadrantNode } from '../mapper/quadrant';
/** 渲染 quadrantChart 到 div（data = mapQuadrant 的输出） */
export declare function renderQuadrant(divId: string, data: {
    nodes: MappedQuadrantNode[];
}, theme: MermaidTheme): Diagram;
