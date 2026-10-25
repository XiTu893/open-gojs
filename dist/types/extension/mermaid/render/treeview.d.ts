/**
 * treeView 渲染器 —— 只建模板 + 装配模型（数据由 mapper/treeview 提供）。
 *
 * 行式文件树：标签/目录（bold 由 mapper 的 font 字段控制）；
 * 父子连线为无箭头正交路由（L 形）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedTreeViewNode, MappedTreeViewLink } from '../mapper/treeview';
/** 渲染 treeView 到 div（data = mapTreeView 的输出） */
export declare function renderTreeView(divId: string, data: {
    nodes: MappedTreeViewNode[];
    links?: MappedTreeViewLink[];
}, theme: MermaidTheme): Diagram;
