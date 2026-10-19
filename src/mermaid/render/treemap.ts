/**
 * treemap 渲染器 —— 只建模板 + 装配模型（数据由 mapper/treemap 提供）。
 *
 * 矩形单元格：固定 w/h + 左上对齐标签（叶子含 value），嵌套矩形由 mapper 算好。
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import { WrapFit } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedTreemapNode } from '../mapper/treemap';

/** 构建矩形单元格模板 */
function buildCellNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const rect = new Shape('Rectangle');
  rect.portId = '';
  rect.strokeWidth = 1;
  rect.fill = '#ffffff';
  rect.stroke = '#000000';
  rect.bind('width', 'w');
  rect.bind('height', 'h');
  rect.bind('fill', 'fill');
  rect.bind('stroke', 'stroke');
  node.add(rect);

  const tb = new TextBlock();
  tb.margin = new Margin(4, 6, 4, 6);
  tb.alignment = Spot.TopLeft;
  tb.wrap = WrapFit;
  tb.textAlign = 'left';
  tb.stroke = '#000000';
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 渲染 treemap 到 div（data = mapTreemap 的输出） */
export function renderTreemap(
  divId: string,
  data: { nodes: MappedTreemapNode[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('TMCell', buildCellNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}
