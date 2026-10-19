/**
 * packet 渲染器 —— 只建模板 + 装配模型（数据由 mapper/packet 提供）。
 *
 * 位条网格：每字段一格（白底黑边矩形，字段名居中 WrapFit）+ 行外刻度位号小字。
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Size } from '../../core/Size';
import { Spot } from '../../core/Spot';
import { WrapFit } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedPacketNode } from '../mapper/packet';

/** 渲染 packet 到 div（data = mapPacket 的输出） */
export function renderPacket(divId: string, data: { nodes: MappedPacketNode[] }, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('PCell', buildCellNode(theme));
  diag.nodeTemplateMap.add('PTick', buildTickNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

/** 位格：Spot 面板（白底黑边矩形 + 居中字段名，窄格 WrapFit 缩放换行） */
function buildCellNode(theme: MermaidTheme): Node {
  const node = new Node('Spot');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const cell = new Shape('Rectangle');
  cell.portId = '';
  cell.fill = '#ffffff';
  cell.stroke = '#000000';
  cell.strokeWidth = 1;
  cell.bind('fill', 'fill');
  cell.bind('stroke', 'stroke');
  cell.bind('width', 'w');
  cell.bind('height', 'h');
  node.add(cell);
  const tb = new TextBlock();
  tb.margin = new Margin(1, 2, 1, 2);
  tb.font = `${theme.fontSize.label - 1}px ${theme.fontFamily}`;
  tb.stroke = '#000000';
  tb.textAlign = 'center';
  tb.alignment = Spot.Center;
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  tb.bind('maxSize', 'w', (w: number) => new Size(Math.max(6, (w ?? 64) - 4), NaN));
  node.add(tb);
  return node;
}

/** 刻度位号小字 */
function buildTickNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${theme.fontSize.label - 2}px ${theme.fontFamily}`;
  tb.stroke = '#666';
  tb.margin = new Margin(0, 2, 0, 2);
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}
