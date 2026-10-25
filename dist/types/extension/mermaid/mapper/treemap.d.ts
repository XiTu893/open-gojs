/**
 * treemap AST → GoJS 模型数据映射。
 *
 * 矩形嵌套填充布局（slice-and-dice 简化版）：每层按 value 占比分割父矩形，
 * 水平/垂直逐层交替；值缺省 = 1，分支值 = 子树之和。
 * 叶子填充用 theme.series 轮换，分支白底；坐标/尺寸全部在此算好。
 */
import { TreemapAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedTreemapNode {
    key: number | string;
    category: 'TMCell';
    loc: string;
    text: string;
    w: number;
    h: number;
    fill: string;
    stroke: string;
    textCol: string;
    depth: number;
    value: number;
    isLeaf: boolean;
    /** 随单元格尺寸自适应的字号（矩形大则字大，避免矩形与文字比例失衡） */
    fontSize: number;
}
/** 主入口 */
export declare function mapTreemap(ast: TreemapAST, theme?: MermaidTheme): {
    nodes: MappedTreemapNode[];
};
