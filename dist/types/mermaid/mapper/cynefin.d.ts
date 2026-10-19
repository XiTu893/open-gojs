/**
 * cynefin AST → GoJS 模型数据映射。
 *
 * 固定布局（画布 800×600，全部坐标在此算好）：
 *  - complex 左上、complicated 右上、chaotic 左下、clear 右下（各 ~45% 宽高浅灰底框，四框间小间隙）
 *  - 每框：标题粗体 + 副标题小字 + items 徽章（RoundedRectangle 小条纵排）
 *  - confusion = 中央 Ellipse 椭圆压四框交界（白底黑边）；items 只显示前 3 个 + `+N more`
 *  - transitions = 框到框的连线数据（跨域箭头 + 标签，渲染层装配）
 *
 * 注：原生 Cynefin 的波浪边界此处简化为直线框（固定布局测试报告已注明）。
 */
import { CynefinAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 画布尺寸（导出供测试） */
export declare const CYNEFIN_W = 800;
export declare const CYNEFIN_H = 600;
/** 映射后的节点类别 */
export type CynefinNodeCategory = 'CynefinTitle' | 'CynefinBox' | 'CynefinDomainTitle' | 'CynefinSub' | 'CynefinItem' | 'CynefinEllipse';
/** 映射后的节点数据 */
export interface MappedCynefinNode {
    key: string;
    category: CynefinNodeCategory;
    loc: string;
    text?: string;
    fill?: string;
    stroke?: string;
    w?: number;
    h?: number;
    bold?: boolean;
    align?: 'left' | 'center';
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
