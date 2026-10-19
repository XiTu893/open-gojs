/**
 * radar AST → GoJS 模型数据映射。
 *
 * 全部坐标在本层算好：
 *  - 画布 680×520，中心 (300,280)、半径 190
 *  - 网格：ticks 圈同心多边形 + 中心放射轴线（合并为单个 geometryString 多子路径节点）
 *  - 每条 curve 一条闭合多边形（'M..L..L..Z'，半透明填充 + series 描边）
 *  - 每轴标签外置在最大半径外；图例色块在右侧（showLegend 时）
 *  - 值域：min 0，max = ceil(max(all values))（全 0 时取 1）
 * 配色只取 theme.series 轮换 + 半透明。
 */
import { RadarAST } from '../ast';
import type { MermaidTheme } from '../themes';
/** 画布尺寸 */
export declare const RADAR_CANVAS_W = 680;
export declare const RADAR_CANVAS_H = 520;
/** 雷达图几何参数（导出供测试/示例使用） */
export declare const radarGeom: {
    cx: number;
    cy: number;
    r: number;
    /** 标签环半径（最大半径外） */
    labelR: number;
};
/** 映射后的节点类别 */
export type RadarNodeCategory = 'RadarTitle' | 'RadarGrid' | 'RadarCurve' | 'RadarAxisLabel' | 'RadarLegend';
/** 映射后的节点数据 */
export interface MappedRadarNode {
    key: string;
    category: RadarNodeCategory;
    loc: string;
    text?: string;
    fill?: string;
    stroke?: string;
    color?: string;
    /** geometryString（网格/曲线路径，绝对坐标） */
    geom?: string;
    sw?: number;
    w?: number;
    h?: number;
}
/** 主入口 */
export declare function mapRadar(ast: RadarAST, theme?: MermaidTheme): {
    nodes: MappedRadarNode[];
};
