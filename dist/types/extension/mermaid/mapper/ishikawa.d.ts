/**
 * ishikawa AST → GoJS 模型数据映射。
 *
 * 完全复刻官方 mermaid 11 ishikawa 渲染器（$7t/V7t/F7t/G7t/z7t/VL）的布局坐标，
 * 坐标与 temp/_sw/off_ishikawa.svg 逐点一致：
 *  - 常量：px=250（基准高）、P7t=30、O7t=60、B7t=5、倾角 82°（wBe=cos, kBe=sin）、padding 20
 *  - 偶数索引类别在上（side=-1，子因倒序）、奇数在下（side=+1）
 *  - 高度：_=max(75, 500*evenTotal/N)、A=max(75, 500*oddTotal/N)，再各 max(max*fontSize*2)
 *  - 脊线 y = C = max(_, px)；分支起点 w=-20，每对类别后 w=min(text bbox.x)（下一对更靠左）
 *  - 鱼头：wrap 宽 max(6, floor(110/(fs*.6)))，d=max(60, w+6)、f=max(40, h*2+40)
 *
 * 骨线节点 geometry 用「局部坐标 + loc=实际最小角」策略（对标 cynefin），
 * 避免 geometry 负偏移被 GoJS 归一化撑大 documentBounds。
 *
 * 文本宽度依赖 measure 回调（浏览器 canvas measureText 精确、vitest/Node 回退 estTextW）。
 */
import { IshikawaAST } from '../ast';
import { MermaidTheme } from '../themes';
/** 映射后的节点数据 */
export interface MappedIshikawaNode {
    key: string;
    category: 'Bone' | 'Head' | 'HeadLabel' | 'CatLabel' | 'CauseLabel';
    loc: string;
    text?: string;
    geo?: string;
    arrow?: string;
    sw?: number;
    fill?: string;
    stroke?: string;
    spot?: string;
}
/** 文本换行（官方 LBe：贪心按宽度字符换行，join \n） */
export declare function wrapText(text: string, width: number): string[];
/** 主入口 */
export declare function mapIshikawa(ast: IshikawaAST, theme?: MermaidTheme): {
    nodes: MappedIshikawaNode[];
};
