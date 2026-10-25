/**
 * venn AST → GoJS 模型数据映射。
 *
 * 全部坐标在本层算好：
 *  - 画布 680×460，圆心群落中心 (340,250)
 *  - 半径按 √size（钳制到 [28,110]），2 圆水平、3 圆三角、更多环形近似
 *  - 圆：半透明 series 填充 + series 描边（叠加即为交集区，无需单独画交集）
 *  - set 标签放在各圆远离群落中心的一侧；union 标签放在被引集合圆心的均值处
 * 配色只取 theme.series 轮换 + 半透明。
 */
import { VennAST } from '../ast';
import type { MermaidTheme } from '../themes';
/** 画布尺寸 */
export declare const VENN_CANVAS_W = 680;
export declare const VENN_CANVAS_H = 460;
/** 布局中心（导出供测试/示例使用） */
export declare const vennCenter: {
    cx: number;
    cy: number;
};
/** 映射后的节点类别 */
export type VennNodeCategory = 'VennTitle' | 'VennCircle' | 'VennLabel' | 'VennUnionLabel';
/** 映射后的节点数据 */
export interface MappedVennNode {
    key: string;
    category: VennNodeCategory;
    loc: string;
    text?: string;
    fill?: string;
    stroke?: string;
    color?: string;
    w?: number;
    h?: number;
}
/** 主入口 */
export declare function mapVenn(ast: VennAST, theme?: MermaidTheme): {
    nodes: MappedVennNode[];
};
