/**
 * treeView AST → GoJS 模型数据映射。
 *
 * 文件树行式布局：每行 y 递增、x 按 depth 缩进；目录字体 bold，
 * desc 以 "标签  (描述)" 形式并入文本。父子连线由渲染层用正交路由完成。
 */
import { TreeViewAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedTreeViewNode {
    key: number;
    category: 'TVItem';
    loc: string;
    text: string;
    font: string;
    dir: boolean;
}
/** 映射后的连线 */
export interface MappedTreeViewLink {
    from: number;
    to: number;
}
/** 主入口 */
export declare function mapTreeView(ast: TreeViewAST, theme?: MermaidTheme): {
    nodes: MappedTreeViewNode[];
    links: MappedTreeViewLink[];
};
