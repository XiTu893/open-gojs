/**
 * pie AST → GoJS 模型数据映射。
 *
 * 扇形用 GoJS `Pie` figure（parameter1=Start, parameter2=Sweep），
 * 节点数据含定位/尺寸/角度/配色，渲染层只建模板。
 */
import { PieAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedPieNode {
    key: string;
    category: 'Slice' | 'Legend' | 'Title';
    loc: string;
    text?: string;
    fill?: string;
    start?: number;
    sweep?: number;
    w?: number;
    h?: number;
}
/** 主入口 */
export declare function mapPie(ast: PieAST, theme: MermaidTheme): {
    nodes: MappedPieNode[];
};
