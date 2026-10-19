/**
 * ishikawa AST → GoJS 模型数据映射。
 *
 * 鱼骨布局（全部坐标在此算好）：
 *  - 主水平脊线（左 → 右），右端鱼头（问题）
 *  - 类别沿脊线均分锚点，斜骨上下交替（约 45°~55°）
 *  - 类别标签在骨末端；原因文本沿斜骨排布
 *  - 骨线输出为 category:'Bone' 的 geometryString 节点（渲染层只建模板）
 */
import { IshikawaAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据（含 Bone 线节点） */
export interface MappedIshikawaNode {
    key: string;
    category: 'Problem' | 'Category' | 'Cause' | 'Bone';
    loc: string;
    text?: string;
    geo?: string;
    fill?: string;
    stroke?: string;
    textCol?: string;
    bold?: boolean;
}
/** 主入口 */
export declare function mapIshikawa(ast: IshikawaAST, theme?: MermaidTheme): {
    nodes: MappedIshikawaNode[];
};
