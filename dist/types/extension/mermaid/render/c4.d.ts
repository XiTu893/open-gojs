/**
 * C4 渲染器 —— 只建模板 + 装配模型（坐标由 mapper/c4 算好）。
 *
 * C4Node：矩形节点（«type» 小字 + 标签；ext 虚线边框）；
 * GroupBox：boundary 浅灰容器（垫底，zOrder=-1，尺寸/成员由 mapper 给定）；
 * 连线：正交 + 箭头（BiRel 双向）+ 标签。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedC4Node, MappedC4Link } from '../mapper/c4';
/** 渲染 C4 到 div（data = mapC4 的输出） */
export declare function renderC4(divId: string, data: {
    nodes: MappedC4Node[];
    links?: MappedC4Link[];
}, theme: MermaidTheme): Diagram;
