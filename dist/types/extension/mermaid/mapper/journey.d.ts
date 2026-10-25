/**
 * journey AST → GoJS 模型数据映射。
 *
 * 横向 section 分组布局（坐标全部在此算好）：
 *  - 每 section 一个标题条 + 分组区域
 *  - section 内每任务一根柱：柱高 = clamp(score,0,10)/10 × 最大柱高
 *  - 柱下任务名、柱上分数、柱底角色小字
 *  - 底部基准线贯穿全部任务
 */
import { JourneyAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedJourneyNode {
    key: string;
    category: 'JTitle' | 'JAxis' | 'JSection' | 'JBar' | 'JScore' | 'JLabel' | 'JActors';
    loc: string;
    text?: string;
    fill?: string;
    textCol?: string;
    geo?: string;
    stroke?: string;
    w?: number;
    h?: number;
}
/** 主入口 */
export declare function mapJourney(ast: JourneyAST, theme?: MermaidTheme): {
    nodes: MappedJourneyNode[];
};
