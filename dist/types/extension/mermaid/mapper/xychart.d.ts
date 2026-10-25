/**
 * xychart AST → GoJS 模型数据映射。
 *
 * 标准图表布局（全部坐标在本层算好）：
 *  - 画布 760×470，绘图区留左(y 刻度)/下(x 标签)/上(标题+图例)边距
 *  - y 轴约 5 档刻度 + 浅灰网格线；x 轴标签按槽位居中
 *  - bar 多组并排；line/area 用 geometryString（折线/填充多边形）
 *  - 多 series 时输出图例；配色只取 theme.series 轮换 + 半透明
 */
import { XYChartAST } from '../ast';
import type { MermaidTheme } from '../themes';
/** 画布尺寸 */
export declare const XY_CANVAS_W = 760;
export declare const XY_CANVAS_H = 470;
/** 绘图区（导出供测试/示例使用） */
export declare const xyPlot: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    readonly w: number;
    readonly h: number;
};
/** 映射后的节点类别 */
export type XYNodeCategory = 'XYTitle' | 'XYGrid' | 'XYAxis' | 'XYYLabel' | 'XYXLabel' | 'XYBar' | 'XYLine' | 'XYArea' | 'XYLegend';
/** 映射后的节点数据 */
export interface MappedXYNode {
    key: string;
    category: XYNodeCategory;
    loc: string;
    text?: string;
    fill?: string;
    stroke?: string;
    color?: string;
    /** geometryString（line/area 的路径，绝对坐标） */
    geom?: string;
    /** 描边宽度（line/area） */
    sw?: number;
    w?: number;
    h?: number;
}
/** 主入口 */
export declare function mapXYChart(ast: XYChartAST, theme?: MermaidTheme): {
    nodes: MappedXYNode[];
};
