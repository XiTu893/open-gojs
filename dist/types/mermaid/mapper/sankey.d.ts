/**
 * sankey AST → GoJS 模型数据映射。
 *
 * 分层布局（全部坐标在此算好）：
 *  - 层号：无入度=源层(0)；迭代 layer[t] = max(layer[s]+1)（有环容错，迭代 ≤ 节点数次）
 *  - 节点高度 = 该节点总流量的归一化高度（源=出流量和、汇=入流量和、中间=较大者）；
 *    全局缩放系数取各层最紧约束，所有节点高度和 ≈ 画布可用高（留层内间隙）
 *  - 同层节点 y 自上而下均分；x = 层号 × 层距
 *  - 流量带 = 每条 link 一个 geometryString 填充 Shape 节点（三次贝塞尔带状区域），
 *    源/目标端 y 偏移按带的顺序累计分配，避免叠压
 *  - 节点 = 竖条 Rectangle；配色只取 theme.series 轮换 + 半透明
 */
import { SankeyAST } from '../parser/sankey';
import { MermaidTheme } from '../themes';
/** 画布尺寸（导出供测试使用） */
export declare const SANKEY_W = 960;
export declare const SANKEY_H = 600;
/** 映射后的节点类别 */
export type SankeyNodeCategory = 'SankeyNode' | 'SankeyFlow' | 'SankeyLabel';
/** 映射后的节点数据 */
export interface MappedSankeyNode {
    key: string;
    category: SankeyNodeCategory;
    loc: string;
    text?: string;
    fill?: string;
    w?: number;
    h?: number;
    /** SankeyFlow: geometryString（绝对坐标，loc 固定 0 0） */
    geom?: string;
}
/** 主入口 */
export declare function mapSankey(ast: SankeyAST, theme?: MermaidTheme): {
    nodes: MappedSankeyNode[];
};
