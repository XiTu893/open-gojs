/**
 * treeView 渲染器 —— 只建模板 + 装配模型（数据由 mapper/treeview 提供）。
 *
 * 行式文件树：标签/目录（bold 由 mapper 的 font 字段控制）；
 * 父子连线为无箭头正交路由（L 形）。
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Link } from '../../view/Link';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import { WrapFit, RoutingOrthogonal, CurveNone } from '../../core/EnumValues';
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

/** 无箭头正交连线（L 形） */
function buildLinkTemplate(theme: MermaidTheme): Link {
  const link = new Link();
  link.routing = RoutingOrthogonal;
  link.curve = CurveNone;
  link.corner = 6;
  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = theme.edge.solid;
  path.strokeWidth = 1;
  link.add(path);
  return link;
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
  diag.linkTemplate = buildLinkTemplate(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links ?? [],
  } as any);
  return diag;
}
