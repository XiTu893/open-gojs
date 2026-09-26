import { Point } from '../core/Point';
import { Size } from '../core/Size';
import { Spot } from '../core/Spot';
import { EnumValue } from '../core/EnumValues';
import {
  TreeSortingForwards, TreeAlignmentCenterChildren, TreeCompactionBlock
} from '../core/EnumValues';
import { LayoutVertex } from './LayoutVertex';

/**
 * TreeVertex - TreeLayout 专用顶点（官方 TreeVertex 的移植）。
 *
 * 与基础 LayoutVertex 的差异：
 * - focus 是绝对偏移量 Point（官方 LayoutVertex.focus），不是 0-1 分数
 * - 携带树结构（parent/children/level）与几何中间量 K/kt/gt/mm/pm
 * - 携带可继承的布局属性（sorting/angle/alignment/nodeSpacing/layerSpacing/...）
 */
export class TreeVertex extends LayoutVertex {

  // ============ 树结构（官方 Bk/Vk/zk/Ar/Xk/Yk/Kk/Je） ============
  initialized: boolean = false;
  parent: TreeVertex | null = null;
  children: TreeVertex[] = [];
  level: number = 0;
  descendantCount: number = 0;
  maxChildrenCount: number = 0;
  maxGenerationCount: number = 0;
  comments: any[] | null = null;

  // ============ 布局几何中间量（官方 K/kt/gt/mm/pm） ============
  /** 官方 K — 本顶点相对父顶点的偏移 */
  relativePosition: Point = new Point(0, 0);
  /** 官方 kt — 子树包围尺寸 */
  subtreeSize: Size = new Size(0, 0);
  /** 官方 gt — 子树对齐偏移（用于父顶点的居中/总线计算） */
  subtreeOffset: Point = new Point(0, 0);
  /** 官方 mm — 起始边线（链接脊线/压缩用） */
  mm: Point[] | null = null;
  /** 官方 pm — 结束边线 */
  pm: Point[] | null = null;

  /** 官方 LayoutVertex.focus — 从 bounds 原点到节点中心的绝对偏移 */
  focus: Point = new Point(0, 0);

  // ============ 可继承属性（官方构造器默认值） ============
  sorting: EnumValue = TreeSortingForwards;
  comparer: (a: TreeVertex, b: TreeVertex) => number = TreeVertex.standardComparer;
  angle: number = 0;
  alignment: EnumValue = TreeAlignmentCenterChildren;
  nodeIndent: number = 0;
  nodeIndentPastParent: number = 0;
  nodeSpacing: number = 20;
  layerSpacing: number = 50;
  layerSpacingParentOverlap: number = 0;
  compaction: EnumValue = TreeCompactionBlock;
  breadthLimit: number = 0;
  rowSpacing: number = 25;
  rowIndent: number = 10;
  commentSpacing: number = 10;
  commentMargin: number = 20;
  setsPortSpot: boolean = true;
  portSpot: Spot = Spot.Default;
  setsChildPortSpot: boolean = true;
  childPortSpot: Spot = Spot.Default;

  get childrenCount(): number {
    return this.children.length;
  }

  /** 官方 TreeVertex.copyInheritedPropertiesFrom */
  copyInheritedPropertiesFrom(t: TreeVertex | null): void {
    if (t === null) return;
    this.sorting = t.sorting;
    this.comparer = t.comparer;
    this.angle = t.angle;
    this.alignment = t.alignment;
    this.nodeIndent = t.nodeIndent;
    this.nodeIndentPastParent = t.nodeIndentPastParent;
    this.nodeSpacing = t.nodeSpacing;
    this.layerSpacing = t.layerSpacing;
    this.layerSpacingParentOverlap = t.layerSpacingParentOverlap;
    this.compaction = t.compaction;
    this.breadthLimit = t.breadthLimit;
    this.rowSpacing = t.rowSpacing;
    this.rowIndent = t.rowIndent;
    this.commentSpacing = t.commentSpacing;
    this.commentMargin = t.commentMargin;
    this.setsPortSpot = t.setsPortSpot;
    this.portSpot = t.portSpot;
    this.setsChildPortSpot = t.setsChildPortSpot;
    this.childPortSpot = t.childPortSpot;
  }

  static standardComparer(a: TreeVertex, b: TreeVertex): number {
    const ka = a.node ? String((a.node as any).data?.key ?? '') : '';
    const kb = b.node ? String((b.node as any).data?.key ?? '') : '';
    const na = parseFloat(ka);
    const nb = parseFloat(kb);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  }
}
