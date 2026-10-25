/**
 * packet 渲染器 —— 只建模板 + 装配模型（数据由 mapper/packet 提供）。
 *
 * 位条网格：每字段一格（白底黑边矩形，字段名居中 WrapFit）+ 行外刻度位号小字。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedPacketNode } from '../mapper/packet';
/** 渲染 packet 到 div（data = mapPacket 的输出） */
export declare function renderPacket(divId: string, data: {
    nodes: MappedPacketNode[];
}, theme: MermaidTheme): Diagram;
