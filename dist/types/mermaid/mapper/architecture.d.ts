/**
 * architecture-beta AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：组（GroupBox 节点）横排在上，组内服务竖排；组外服务在下方
 * 贪心装箱。服务节点尺寸按标签估宽（有上下限），高度固定。
 * 连线保留端口（fromPort/toPort = R/L/T/B），渲染层据此绑 fromSpot/toSpot。
 * 配色只取 theme：服务用 categories.process，组盒用 categories.group。
 */
import { ArchitectureAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedArchitectureNode {
    key: string;
    category: 'Service' | 'GroupBox';
    loc: string;
    w: number;
    h: number;
    text: string;
    title?: string;
    members?: string[];
    fill: string;
    stroke: string;
    textCol: string;
}
/** 映射后的连线数据（带端口） */
export interface MappedArchitectureLink {
    from: string;
    fromPort: string;
    to: string;
    toPort: string;
}
/** 主入口 */
export declare function mapArchitecture(ast: ArchitectureAST, theme?: MermaidTheme): {
    nodes: MappedArchitectureNode[];
    links: MappedArchitectureLink[];
};
