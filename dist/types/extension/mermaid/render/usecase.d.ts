/**
 * usecase 渲染器 —— 只建模板 + 装配模型（数据由 mapper/usecase 提供）。
 *
 * 节点：Actor（火柴人 + 下方标签）、Usecase（椭圆）、UsecaseRect（矩形）、
 * GroupBox（zOrder=-1 垫底的标题框）。
 * 连线：按 kind 绑 toArrow（generalization=空心 Triangle、其余 Standard）、
 * strokeDashArray（include/extend 虚线）、标签（visible 由 label 控制）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedUsecaseNode, MappedUsecaseLink } from '../mapper/usecase';
/** 渲染 usecase 到 div（data = mapUsecase 的输出） */
export declare function renderUsecase(divId: string, data: {
    nodes: MappedUsecaseNode[];
    links?: MappedUsecaseLink[];
}, theme: MermaidTheme): Diagram;
