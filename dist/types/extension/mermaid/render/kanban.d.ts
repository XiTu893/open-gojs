/**
 * kanban 渲染器 —— 只建模板 + 装配模型（数据由 mapper/kanban 提供）。
 *
 * 列头条（series 色底 + contrastText 文字）+ 任务卡（圆角矩形，含 label 与 meta 行）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedKanbanNode } from '../mapper/kanban';
/** 渲染 kanban 到 div（data = mapKanban 的输出） */
export declare function renderKanban(divId: string, data: {
    nodes: MappedKanbanNode[];
}, theme: MermaidTheme): Diagram;
