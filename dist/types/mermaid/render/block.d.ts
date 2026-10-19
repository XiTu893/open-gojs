/**
 * block-beta 渲染器 —— 只建模板 + 装配模型（数据由 mapper/block 提供）。
 *
 * 节点：Block（figure 由数据驱动的形状块）、GroupBox（zOrder=-1 垫底的标题框）。
 * 连线：正交路由 + 可选 Standard 箭头（visible 由 arrow 标志控制）+ 中点标签。
 * 坐标全部来自 mapper（loc/w/h），渲染层零布局数学。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedBlockNode, MappedBlockLink } from '../mapper/block';
/** 渲染 block 到 div（data = mapBlock 的输出） */
export declare function renderBlock(divId: string, data: {
    nodes: MappedBlockNode[];
    links?: MappedBlockLink[];
}, theme: MermaidTheme): Diagram;
