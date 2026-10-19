/**
 * requirementDiagram 渲染器 —— 只建模板 + 装配模型（数据由 mapper/requirement 提供）。
 *
 * 节点：'Requirement'/'Element' 均为 Auto 包矩形 + 单个多行 TextBlock（WrapNone），
 * 形状 fromSpot/toSpot 按方向（TD/BT=Bottom/Top，LR/RL=Right/Left）。
 * 连线：正交路由 + Standard 箭头 + 中点标签（visible 由 label 控制）。
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Link } from '../../view/Link';
import { Panel } from '../../view/Panel';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import { RoutingOrthogonal, CurveNone } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedRequirementNode, MappedRequirementLink } from '../mapper/requirement';

/** 端点 spot：随方向 */
function endsOf(dir: string): { from: Spot; to: Spot } {
  if (dir === 'BT') return { from: Spot.Top, to: Spot.Bottom };
  if (dir === 'LR') return { from: Spot.Right, to: Spot.Left };
  if (dir === 'RL') return { from: Spot.Left, to: Spot.Right };
  return { from: Spot.Bottom, to: Spot.Top };
}

/** 节点模板（Requirement / Element 共用，仅配色一致） */
function buildReqNode(theme: MermaidTheme, dir: string): Node {
  const { from, to } = endsOf(dir);
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;

  const shape = new Shape('Rectangle');
  shape.strokeWidth = theme.categories.process.strokeWidth;
  shape.portId = '';
  shape.fromSpot = from;
  shape.toSpot = to;
  shape.bind('fill', 'fill');
  shape.bind('stroke', 'stroke');
  shape.bind('width', 'w');
  shape.bind('height', 'h');
  node.add(shape);

  const tb = new TextBlock();
  tb.margin = new Margin(9, 12, 9, 12);
  tb.isMultiline = true;
  tb.textAlign = 'left';
  tb.stroke = '#000000';
  tb.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 连线模板：正交 + Standard 箭头 + 中点标签 */
function buildReqLink(theme: MermaidTheme): Link {
  const link = new Link();
  link.routing = RoutingOrthogonal;
  link.curve = CurveNone;
  link.corner = 8;
  link.selectionAdorned = false;

  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = theme.edge.solid;
  path.strokeWidth = 1;
  path.bind('stroke', 'dashed', (d: boolean) => (d ? theme.edge.dashed : theme.edge.solid));
  link.add(path);

  const head = new Shape('Standard');
  head.scale = 0.8;
  head.stroke = theme.edge.solid;
  head.fill = theme.edge.solid;
  link.add(head);

  const labelPanel = new Panel('Horizontal');
  labelPanel.visible = false;
  labelPanel.bind('visible', 'label', (l: string | undefined) => !!l);
  labelPanel.alignmentFocus = Spot.TopCenter;
  labelPanel.alignment = Spot.Bottom;
  const label = new TextBlock();
  label.margin = new Margin(2, 4, 2, 4);
  label.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  label.stroke = theme.edge.label;
  label.background = theme.edge.labelBg;
  label.bind('text', 'label');
  labelPanel.add(label);
  link.add(labelPanel);
  return link;
}

/** 渲染 requirementDiagram 到 div（data = mapRequirement 的输出） */
export function renderRequirement(
  divId: string,
  data: { nodes: MappedRequirementNode[]; links?: MappedRequirementLink[]; dir?: string },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  const dir = data.dir ?? 'TD';
  diag.nodeTemplateMap.add('Requirement', buildReqNode(theme, dir));
  diag.nodeTemplateMap.add('Element', buildReqNode(theme, dir));
  diag.linkTemplate = buildReqLink(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links ?? [],
  } as any);
  return diag;
}
