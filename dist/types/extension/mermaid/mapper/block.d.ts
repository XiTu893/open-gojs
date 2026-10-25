import { BlockASTX } from '../parser/block';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据（块与组盒） */
export interface MappedBlockNode {
    key: string;
    category: 'Block' | 'GroupBox';
    loc: string;
    w: number;
    h: number;
    text: string;
    title?: string;
    members?: string[];
    figure: string;
    param?: number;
    fill: string;
    stroke: string;
    textCol: string;
}
/** 映射后的连线数据 */
export interface MappedBlockLink {
    from: string;
    to: string;
    arrow: boolean;
    label?: string;
}
/** 主入口 */
export declare function mapBlock(ast: BlockASTX, theme?: MermaidTheme): {
    nodes: MappedBlockNode[];
    links: MappedBlockLink[];
};
