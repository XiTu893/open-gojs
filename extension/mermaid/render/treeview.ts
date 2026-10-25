/**
 * treeView 渲染器 —— 只建模板 + 装配模型（数据由 mapper/treeview 提供）。
 *
 * 行式文件树：标签/目录（bold 由 mapper 的 font 字段控制）；
 * 父子连线为无箭头正交路由（L 形）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { Link } from '../../../src/view/Link';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Point } from '../../../src/core/Point';
import { Spot } from '../../../src/core/Spot';
import { WrapFit, RoutingOrthogonal, CurveNone } from '../../../src/core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedTreeViewNode, MappedTreeViewLink } from '../mapper/treeview';

/** 构建文件树行节点模板 */
function buildItemNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const tb = new TextBlock();
  tb.margin = new Margin(4, 6, 4, 6);
  tb.wrap = WrapFit;
  tb.stroke = '#000000';
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('font', 'font');
  node.add(tb);
  return node;
}

/** treeview 连线：官方行式"父文字 x 竖直肘 + 子行刻线"几何（自算点）。
 * 必须用子类：Part.copy 多态构造保留原型方法，实例属性覆写不会被复制 */
class TreeLink extends Link {
  computePoints(): boolean {
    const f = this.fromNode as any;
    const t = this.toNode as any;
    if (!f || !t) return false;
    const fb = f.actualBounds;
    const tb = t.actualBounds;
    if (!fb || !tb || !isFinite(fb.x) || !isFinite(tb.x)) return false;
    const list: any = (this as any).points; // 活引用 List<Point>
    list.clear();
    list.add(new Point(fb.x + 6, fb.y + fb.height));
    list.add(new Point(fb.x + 6, tb.y + tb.height / 2));
    list.add(new Point(tb.x + 1, tb.y + tb.height / 2));
    return true;
  }
}

/** 无箭头连线：竖直肘 + 横刻线 */
function buildLinkTemplate(theme: MermaidTheme): Link {
  const link = new TreeLink();
  link.routing = RoutingOrthogonal;
  link.curve = CurveNone;
  link.corner = 0;
  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = theme.edge.solid;
  path.strokeWidth = 1;
  link.add(path);
  return link;
}

/** 根行 "/" 左侧的刻线节点（10px 横线，终于文字前 5px） */
function buildTickNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  node.movable = false;
  const bar = new Shape('Rectangle');
  bar.width = 10;
  bar.height = 1;
  bar.fill = theme.edge.solid;
  bar.strokeWidth = 0;
  node.add(bar);
  return node;
}

/** 渲染 treeView 到 div（data = mapTreeView 的输出） */
export function renderTreeView(
  divId: string,
  data: { nodes: MappedTreeViewNode[]; links?: MappedTreeViewLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('TVItem', buildItemNode(theme));
  diag.nodeTemplateMap.add('TVTick', buildTickNode(theme));
  diag.linkTemplate = buildLinkTemplate(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links ?? [],
  } as any);

  // 根 "/" 行自带刻线：终于文字前 5px，始于文字 x-15（无父行，独立节点，
  // 位置依赖首行测量结果，故在首次布局后插入）
  (diag as any).maybeUpdate();
  const rootN = (diag as any).findNodeForKey ? diag.findNodeForKey(0) : null;
  if (rootN) {
    const b = rootN.actualBounds as any;
    if (b && isFinite(b.x) && isFinite(b.y)) {
      (diag.model as any).commit((m: any) => {
        m.addNodeData({ key: '__tv_tick', category: 'TVTick', loc: `${b.x + 6 - 15} ${b.y + b.height / 2 - 0.5}` });
      }, 'root tick');
      (diag as any).maybeUpdate();
    }
  }
  return diag;
}
