/**
 * eventmodeling AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：水平泳道带（浅灰底条 + 左侧竖排泳道标题），时间帧按 num 首次出现
 * 顺序成为 x 递增的列（列间浅分隔线 + 列头）；帧卡片按 entityType 落到
 * 对应泳道行的列格内（同格多卡纵向堆叠不重叠）。
 * 连线 = 推断（前一非 reset 帧 → 当前帧，reset 断开）+ 显式 relTo（虚线）。
 * 颜色只取 theme：卡片用 theme.series 按 entityType 轮换，泳道/分隔线用
 * categories.group；禁止硬编码彩色。
 */
import { EventModelingAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedEventNode {
    key: string;
    category: 'Lane' | 'Sep' | 'ColHead' | 'Card';
    loc: string;
    w?: number;
    h?: number;
    text?: string;
    sub?: string;
    fill?: string;
    stroke?: string;
    textCol?: string;
}
/** 映射后的连线数据 */
export interface MappedEventLink {
    key: string;
    from: string;
    to: string;
    label?: string;
    dash?: boolean;
}
/** 映射结果 */
export interface MappedEventModeling {
    nodes: MappedEventNode[];
    links: MappedEventLink[];
}
/** 主入口 */
export declare function mapEventModeling(ast: EventModelingAST, theme?: MermaidTheme): MappedEventModeling;
