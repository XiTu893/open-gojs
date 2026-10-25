/**
 * quadrantChart AST → GoJS 模型数据映射。
 *
 * 坐标系与全部布局在本层算好：
 *  - 画布 600×600，绘图区留左边距（y 轴标签）、上边距（标题）、下边距（x 轴标签）
 *  - 数据 x/y ∈ [0,1]，y=1 在绘图区顶部（画布 y 向下 → 翻转）
 *  - 象限编号对齐 mermaid：1=右上、2=左上、3=左下、4=右下
 * 配色只取 theme（灰阶轮换/主题色）或黑白灰。
 */
import { QuadrantAST } from '../ast';
import type { MermaidTheme } from '../themes';
/** 画布尺寸 */
export declare const Q_CANVAS_W = 600;
export declare const Q_CANVAS_H = 600;
/** 绘图区（导出供测试/示例使用） */
export declare const quadrantPlot: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    readonly w: number;
    readonly h: number;
};
/** 映射后的节点类别 */
export type QuadrantNodeCategory = 'QTitle' | 'QBg' | 'QFrame' | 'QLine' | 'QLabel' | 'QAxisX' | 'QAxisY' | 'QDot' | 'QPointLabel';
/** 映射后的节点数据 */
export interface MappedQuadrantNode {
    key: string;
    category: QuadrantNodeCategory;
    loc: string;
    text?: string;
    fill?: string;
    stroke?: string;
    color?: string;
    w?: number;
    h?: number;
}
/** 主入口：全部坐标算好，渲染层只建模板 */
export declare function mapQuadrant(ast: QuadrantAST, theme?: MermaidTheme): {
    nodes: MappedQuadrantNode[];
};
