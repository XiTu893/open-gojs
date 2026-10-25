/**
 * gitgraph AST → GoJS 模型数据映射。
 *
 * 布局（全部坐标在此算好）：
 *  - 水平时间轴：commit 按出现顺序 x 递增（x = MARGIN + i*STEP）
 *  - 分支 y 分行：main 一行，每个 branch 分配新行；checkout 只切当前分支（决定后续 commit 的行）
 *  - commit = 小圆点（主分支深色，其他分支取 theme.series 轮换灰阶）+ 下方 id·label 文本
 *  - 连线：同分支相邻 commit 连成主干/分支线；分支首 commit 从前一 commit 折出（fork 线）；
 *    merge = 从被合并分支最后一 commit 连回当前分支的 merge 节点
 */
import { GitGraphAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点类别 */
export type GitNodeCategory = 'GitCommit' | 'GitBranchLabel';
/** 映射后的节点数据 */
export interface MappedGitGraphNode {
    key: string;
    category: GitNodeCategory;
    loc: string;
    text?: string;
    fill?: string;
    w?: number;
    h?: number;
    bold?: boolean;
}
/** 映射后的连线数据 */
export interface MappedGitLink {
    from: string;
    to: string;
    kind: 'branch' | 'merge';
}
/** 主入口 */
export declare function mapGitGraph(ast: GitGraphAST, theme?: MermaidTheme): {
    nodes: MappedGitGraphNode[];
    links: MappedGitLink[];
};
