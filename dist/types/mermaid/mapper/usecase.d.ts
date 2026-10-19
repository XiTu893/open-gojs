/**
 * usecase AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：三层带状 —— actors 层 → boundary 层（组盒含内部网格）→ 松散用例层，
 * 层内按方向排布；BT/RL 末尾整体镜像（镜像保持包含关系）。
 * 组盒是 category='GroupBox' 的普通节点（渲染层 zOrder=-1 垫底）。
 * 配色只取 theme：actors/cases 用 categories.process，组盒用 categories.sequence.group。
 */
import { FlowDir } from '../ast';
import { UsecaseASTX } from '../parser/usecase';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedUsecaseNode {
    key: string;
    category: 'Actor' | 'Usecase' | 'UsecaseRect' | 'GroupBox';
    loc: string;
    w: number;
    h: number;
    text: string;
    title?: string;
    members?: string[];
    fill: string;
    stroke: string;
    textCol: string;
}
/** 映射后的连线数据 */
export interface MappedUsecaseLink {
    from: string;
    to: string;
    kind: 'assoc' | 'include' | 'extend' | 'generalization';
    label?: string;
}
/** 主入口 */
export declare function mapUsecase(ast: UsecaseASTX, theme?: MermaidTheme): {
    nodes: MappedUsecaseNode[];
    links: MappedUsecaseLink[];
    dir: FlowDir;
};
