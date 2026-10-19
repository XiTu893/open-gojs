/**
 * architecture-beta 渲染器 —— 只建模板 + 装配模型（数据由 mapper/architecture 提供）。
 *
 * 节点：Service（矩形，文本两行 = alias + label）、GroupBox（zOrder=-1 垫底标题框）。
 * 连线：正交路由 + Standard 箭头；fromPort/toPort（R/L/T/B）绑到 fromSpot/toSpot，
 * 端点即源/目标矩形对应边（无端口精确坐标计算，走 GoJS spot 路由）。
 * 坐标全部来自 mapper（loc/w/h），渲染层零布局数学。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedArchitectureNode, MappedArchitectureLink } from '../mapper/architecture';
/** 渲染 architecture 到 div（data = mapArchitecture 的输出） */
export declare function renderArchitecture(divId: string, data: {
    nodes: MappedArchitectureNode[];
    links?: MappedArchitectureLink[];
}, theme: MermaidTheme): Diagram;
