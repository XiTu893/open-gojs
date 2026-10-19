/**
 * ishikawa 渲染器 —— 只建模板 + 装配模型（数据由 mapper/ishikawa 提供）。
 *
 * 骨线全部是 category:'Bone' 的 geometryString 节点（mapper 已算好坐标）；
 * 鱼头 = 问题（大圆角矩形），类别粗体标签，原因普通文本。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedIshikawaNode } from '../mapper/ishikawa';
/** 渲染 ishikawa 到 div（data = mapIshikawa 的输出） */
export declare function renderIshikawa(divId: string, data: {
    nodes: MappedIshikawaNode[];
}, theme: MermaidTheme): Diagram;
