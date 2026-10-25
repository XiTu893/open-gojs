/**
 * mindmap 渲染器 —— 只建模板 + 装配模型（数据由 mapper/mindmap 提供）。
 *
 * 形状按 category（root/circle/square/rounded/hexagon）映射 figure；
 * 连线为无箭头直线（中线 Shape）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedMindmapNode, MappedMindmapLink } from '../mapper/mindmap';
/** 渲染 mindmap 到 div（data = mapMindmap 的输出） */
export declare function renderMindmap(divId: string, data: {
    nodes: MappedMindmapNode[];
    links?: MappedMindmapLink[];
}, theme: MermaidTheme): Diagram;
