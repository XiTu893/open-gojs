import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { EnumValue } from '../core/EnumValues';
import { LayoutVertex } from './LayoutVertex';
/**
 * TreeVertex - TreeLayout 专用顶点（官方 TreeVertex 的移植）。
 *
 * 与基础 LayoutVertex 的差异：
 * - focus 是绝对偏移量 Point（官方 LayoutVertex.focus），不是 0-1 分数
 * - 携带树结构（parent/children/level）与几何中间量 K/kt/gt/mm/pm
 * - 携带可继承的布局属性（sorting/angle/alignment/nodeSpacing/layerSpacing/...）
 */
export declare class TreeVertex extends LayoutVertex {
    initialized: boolean;
    parent: TreeVertex | null;
    children: TreeVertex[];
    level: number;
    descendantCount: number;
    maxChildrenCount: number;
    maxGenerationCount: number;
    comments: any[] | null;
    /** 官方 K — 本顶点相对父顶点的偏移 */
    relativePosition: Point;
    /** 官方 kt — 子树包围尺寸 */
    subtreeSize: Size;
    /** 官方 gt — 子树对齐偏移（用于父顶点的居中/总线计算） */
    subtreeOffset: Point;
    /** 官方 mm — 起始边线（链接脊线/压缩用） */
    mm: Point[] | null;
    /** 官方 pm — 结束边线 */
    pm: Point[] | null;
    /** 官方 LayoutVertex.focus — 从 bounds 原点到节点中心的绝对偏移 */
    focus: Point;
    sorting: EnumValue;
    comparer: (a: TreeVertex, b: TreeVertex) => number;
    angle: number;
    alignment: EnumValue;
    nodeIndent: number;
    nodeIndentPastParent: number;
    nodeSpacing: number;
    layerSpacing: number;
    layerSpacingParentOverlap: number;
    compaction: EnumValue;
    breadthLimit: number;
    rowSpacing: number;
    rowIndent: number;
    commentSpacing: number;
    commentMargin: number;
    setsPortSpot: boolean;
    portSpot: Spot;
    setsChildPortSpot: boolean;
    childPortSpot: Spot;
    get childrenCount(): number;
    /** 官方 TreeVertex.copyInheritedPropertiesFrom */
    copyInheritedPropertiesFrom(t: TreeVertex | null): void;
    static standardComparer(a: TreeVertex, b: TreeVertex): number;
}
