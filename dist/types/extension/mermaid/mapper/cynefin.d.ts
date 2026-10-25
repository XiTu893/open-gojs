/**
 * cynefin AST → GoJS 模型数据映射 —— 忠实移植官方 mermaid@11 cynefin 渲染器。
 *
 * 官方几何（config 默认 width 800 / height 600 / padding 40 / boundaryAmplitude 8）：
 *  - 内容画布 800×600 整体平移 (40,40)；四域各 400×300 浅色底（fill-opacity .4）
 *  - 边界 = 7 段确定性伪随机波浪线（mulberry32 种子噪声；官方种子取 svg.id 哈希，
 *    每次渲染随机 → 此处固定 seed 0，风格一致即可）：竖向 x≈400±8、横向 y≈300±8，
 *    stroke #333 宽 2 dasharray 6 3
 *  - cliff（clear 域悬崖曲线）stroke #8B0000 宽 4
 *  - confusion = 中心椭圆 rx120 ry90（p*.15/m*.15），fill #F3E5F5 op .5，虚线描边
 *  - 域标签粗体 16 #131300 于 (cx, cy-30)；固定响应模式斜体 11 于 cy-10 / cy+5
 *    （showDomainDescriptions 默认开，与 DSL 无关）；Confusion (400,290)、Disorder (400,308)
 *  - items：高 26、间距 4、文字估宽+20、rx4、stroke #333 宽 1、fill 域色 op .95，
 *    起始 cy+25（confusion cy+22，最多 3 个 + "+N more" 虚线溢出条）
 *  - transitions = 域中心到域中心的箭头（此处直线 + Standard 箭头，标签居中）
 *  - 标题粗体 18 于 (400,-20)
 */
import { CynefinAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 内容画布（导出供测试） */
export declare const CYNEFIN_W = 800;
export declare const CYNEFIN_H = 600;
/** 四周留白（官方 padding） */
export declare const CYNEFIN_PAD = 40;
/** 映射后的节点类别 */
export type CynefinNodeCategory = 'CynefinTitle' | 'CynefinBg' | 'CynefinBoundary' | 'CynefinCliff' | 'CynefinConfusion' | 'CynefinLabel' | 'CynefinSubtitle' | 'CynefinItem' | 'CynefinItemOverflow';
/** 映射后的节点数据 */
export interface MappedCynefinNode {
    key: string;
    category: CynefinNodeCategory;
    loc: string;
    text?: string;
    /** 纯色或 rgba（已含官方 fill-opacity） */
    fill?: string;
    /** 描边色（固定在模板时留空） */
    stroke?: string;
    w?: number;
    h?: number;
    /** Boundary/Cliff：geometryString（内容坐标，节点 loc 平移至 PAD） */
    geom?: string;
}
/** 映射后的连线数据 */
export interface MappedCynefinLink {
    from: string;
    to: string;
    label?: string;
}
/** 主入口 */
export declare function mapCynefin(ast: CynefinAST, theme?: MermaidTheme): {
    nodes: MappedCynefinNode[];
    links: MappedCynefinLink[];
};
