/**
 * venn 渲染器 —— 只建模板 + 装配模型（数据由 mapper/venn 提供，零布局数学）。
 *
 * 结构：标题 → 半透明圆（叠加即交集区）→ set 标签（圆外）→ union 标签（交集中心）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import { WrapFit } from '../../../src/core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedVennNode } from '../mapper/venn';

/** 渲染 venn 到 div（data = mapVenn 的输出） */
export function renderVenn(
  divId: string,
  data: { nodes: MappedVennNode[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('VennTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('VennCircle', buildCircleNode());
  diag.nodeTemplateMap.add('VennLabel', buildLabelNode(theme, '#333333'));
  diag.nodeTemplateMap.add('VennUnionLabel', buildLabelNode(theme, '#111111', true));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

/** 集合圆（半径由数据 w/h 驱动，半透明填充） */
function buildCircleNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const circle = new Shape('Ellipse');
  circle.portId = '';
  circle.fill = 'rgba(0,0,0,0.3)';
  circle.stroke = '#555555';
  circle.strokeWidth = 1.5;
  circle.bind('fill', 'fill');
  circle.bind('stroke', 'stroke');
  circle.bind('width', 'w');
  circle.bind('height', 'h');
  node.add(circle);
  return node;
}

/** 居中文字（set 标签 / union 标签） */
function buildLabelNode(theme: MermaidTheme, stroke: string, bold = false): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${bold ? 'bold ' : ''}${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = stroke;
  tb.textAlign = 'center';
  tb.margin = new Margin(2, 4, 2, 4);
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 标题节点 */
function buildTitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `bold ${theme.fontSize.title}px ${theme.fontFamily}`;
  tb.stroke = '#222222';
  tb.margin = new Margin(4);
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}
