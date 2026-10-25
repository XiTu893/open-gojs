/**
 * requirementDiagram AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：按关系做最长路径分层（迭代松弛，环有界），沿 direction 摆放 ——
 * TD/BT 分层为行、LR/RL 分层为列，层内居中；BT/RL 末尾整体镜像。
 * 配色只取 theme（默认黑白）：requirement/element 均用 theme.categories.process。
 */
import { RequirementAST, FlowDir } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedRequirementNode {
    key: string;
    category: 'Requirement' | 'Element';
    loc: string;
    w: number;
    h: number;
    text: string;
    fill: string;
    stroke: string;
    textCol: string;
}
/** 映射后的连线数据 */
export interface MappedRequirementLink {
    from: string;
    to: string;
    label: string;
}
/** 主入口 */
export declare function mapRequirement(ast: RequirementAST, theme?: MermaidTheme): {
    nodes: MappedRequirementNode[];
    links: MappedRequirementLink[];
    dir: FlowDir;
};
