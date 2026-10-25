/**
 * sankey AST → GoJS 模型数据映射。
 *
 * 布局 = d3-sankey 0.12.3 的忠实移植（官方 mermaid@11 就是调它），与官方坐标对齐：
 *  - depth/height：双向 BFS（有环时抛错 → 回退 legacy 分层布局）
 *  - 列分配：justify（源在最左、汇在最右）；kx = (W - nodeWidth)/(层数-1)
 *  - py = nodePadding（mermaid: 12 + showValues(15) = 27）；ky = min 各列 (H-(列长-1)*py)/值和
 *  - 列内顶对齐后把余量按 (i+1) 前插均摊；sourceLinks/targetLinks 按对方 y0 排序
 *  - 6 轮 relaxRightToLeft/relaxLeftToRight（alpha=0.99^i、beta=max(1-alpha,(i+1)/6)）
 *    + resolveCollisions（中点发散 + 画布边界钳制）
 *  - link.y0/y1 = 从节点 y0 起顺序累计的中心线（stroke 中心即带中心）
 *  - 流量带 = 中心线贝塞尔（官方 d3 linkHorizontal：C midX,y0 midX,y1 x2,y1）
 *  - 标签 = 官方半幅规则（x < W/2 → 条右伸，否则条左伸贴 6px，垂直居中）+ id/value 两行
 *  - 节点竖条（官方 nodeWidth 10）；条色按节点顺序轮换 d3 category10 调色板
 */
import { SankeyAST } from '../parser/sankey';
import { MermaidTheme } from '../themes';
/** 画布尺寸（对标官方 sankey 600×400） */
export declare const SANKEY_W = 600;
export declare const SANKEY_H = 400;
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
    /** SankeyFlow: geometryString（闭合丝带轮廓，局部坐标 min 角在 0,0；loc=文档原点） */
    geom?: string;
    /** SankeyFlow: 描边渐变两端色 [源色, 目标色]（官方 linkColor=gradient） */
    c?: [string, string];
    /** SankeyFlow: 渐变 user-space 起止 x（官方 gradientUnits=userSpaceOnUse x1/x2） */
    gx1?: number;
    gx2?: number;
    /** SankeyLabel: 标签在节点条的哪一侧（官方半幅规则：左半→右，右半→左） */
    side?: 'left' | 'right';
}
/** 主入口 */
export declare function mapSankey(ast: SankeyAST, theme?: MermaidTheme): {
    nodes: MappedSankeyNode[];
};
