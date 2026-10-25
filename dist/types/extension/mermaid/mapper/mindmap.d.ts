/**
 * mindmap AST → GoJS 模型数据映射。
 *
 * 树形分层布局：根居左，每层等间距缩进；叶子顺序排布，父节点纵向居中于子树。
 * 坐标全部在此算好（loc 为 "x y" 字符串，兼容 GoJS 默认 loc 绑定）。
 */
import { MindmapAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedMindmapNode {
    key: number;
    category: string;
    loc: string;
    text: string;
    fill: string;
    stroke: string;
    textCol: string;
}
/** 映射后的连线 */
export interface MappedMindmapLink {
    from: number;
    to: number;
}
/** 主入口 */
export declare function mapMindmap(ast: MindmapAST, theme?: MermaidTheme): {
    nodes: MappedMindmapNode[];
    links: MappedMindmapLink[];
};
