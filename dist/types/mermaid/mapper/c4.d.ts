/**
 * C4 AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：按声明顺序（order）网格摆放 —— 普通元素按 maxPerRow（缺省 4）成行；
 * Boundary 作为浅灰 GroupBox 容器，成员按声明顺序在其内部网格中摆放，
 * 框体尺寸由成员网格算出（框包围成员）。颜色黑白（取 theme 的
 * process/group 配色），ext 元素边框虚线 + «External» 标签。
 */
import { C4AST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedC4Node {
    key: string;
    category: 'C4Node' | 'GroupBox';
    loc: string;
    w: number;
    h: number;
    text: string;
    stereotype?: string;
    members?: string[];
    dash?: boolean;
    fill: string;
    stroke: string;
    textCol: string;
}
/** 映射后的连线数据 */
export interface MappedC4Link {
    key: string;
    from: string;
    to: string;
    label?: string;
    both?: boolean;
}
/** 映射结果 */
export interface MappedC4 {
    nodes: MappedC4Node[];
    links: MappedC4Link[];
    maxPerRow: number;
}
/** 主入口 */
export declare function mapC4(ast: C4AST, theme?: MermaidTheme): MappedC4;
