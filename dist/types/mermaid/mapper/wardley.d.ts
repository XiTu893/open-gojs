/**
 * wardley AST → GoJS 模型数据映射。
 *
 * 布局（全部坐标在此算好，size 缺省 [1100,600]）：
 *  - x = evolution（0左~1右）、y = visibility 反转（1-vis，上为高可见性）
 *  - 画布：演化 4 段竖向分区（genesis/custom/product/utility 各 1/4，浅灰交替底+竖分隔线+底部区段标签）
 *    + 外框 + 轴刻度（visibility 左轴、evolution 底轴）
 *  - 组件 = 小圆点（anchor 加粗标签）+ 名称标签；decorator 符号：
 *    build=Triangle、buy=Diamond、outsource=Rectangle、market=Ellipse、inertia=名称 `~` 前缀
 *  - links = 连线数据（flow 带箭头、依赖无箭头，渲染层装配）
 *  - evolve = 组件 → 目标 x 的水平虚线（dash 连线 + 目标点，同组件行）
 *  - notes = 浅底文本框（中心对齐到 [vis,evo] 点）
 */
import { WardleyAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点类别 */
export type WardleyNodeCategory = 'WardleyTitle' | 'WardleyFrame' | 'WardleyBand' | 'WardleyDivider' | 'WardleySection' | 'WardleyAxis' | 'WardleyPoint' | 'WardleyLabel' | 'WardleyDecorator' | 'WardleyNote';
/** 映射后的节点数据 */
export interface MappedWardleyNode {
    key: string;
    category: WardleyNodeCategory;
    loc: string;
    text?: string;
    fill?: string;
    stroke?: string;
    /** Shape.figure（decorator 用） */
    figure?: string;
    w?: number;
    h?: number;
    bold?: boolean;
    align?: 'left' | 'center' | 'right';
    fontSize?: number;
}
/** 映射后的连线数据 */
export interface MappedWardleyLink {
    from: string;
    to: string;
    flow: boolean;
    label?: string;
    dashed?: boolean;
}
/** 主入口 */
export declare function mapWardley(ast: WardleyAST, theme?: MermaidTheme): {
    nodes: MappedWardleyNode[];
    links: MappedWardleyLink[];
};
