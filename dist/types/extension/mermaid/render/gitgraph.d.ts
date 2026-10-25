/**
 * gitgraph 渲染器 —— 只建模板 + 装配模型（数据由 mapper/gitgraph 提供，零布局数学）。
 *
 * - commit = 小 Ellipse 圆点（fill 由数据驱动）+ 下方 id·label 文本
 * - 分支标签粗体；连线 = 正交折线（merge 线加粗），无箭头
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedGitGraphNode, MappedGitLink } from '../mapper/gitgraph';
/** 渲染 gitgraph 到 div（data = mapGitGraph 的输出） */
export declare function renderGitGraph(divId: string, data: {
    nodes: MappedGitGraphNode[];
    links: MappedGitLink[];
}, theme: MermaidTheme): Diagram;
