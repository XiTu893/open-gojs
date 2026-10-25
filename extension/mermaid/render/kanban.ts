/**
 * kanban 渲染器 —— 只建模板 + 装配模型（数据由 mapper/kanban 提供）。
 *
 * 列头条（series 色底 + contrastText 文字）+ 任务卡（圆角矩形，含 label 与 meta 行）。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { Panel } from '../../../src/view/Panel';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import { WrapFit } from '../../../src/core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedKanbanNode } from '../mapper/kanban';

/** 渲染 kanban 到 div（data = mapKanban 的输出） */
export function renderKanban(divId: string, data: { nodes: MappedKanbanNode[] }, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('KHeader', buildHeaderNode(theme));
  diag.nodeTemplateMap.add('KCard', buildCardNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

/** 列头条：Spot 面板（色底矩形 + 居中对比文字） */
function buildHeaderNode(theme: MermaidTheme): Node {
  const node = new Node('Spot');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const bg = new Shape('Rectangle');
  bg.portId = '';
  bg.fill = '#555555';
  bg.stroke = 'transparent';
  bg.bind('fill', 'fill');
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  node.add(bg);
  const tb = new TextBlock();
  tb.margin = new Margin(2, 8, 2, 8);
  tb.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.textAlign = 'center';
  tb.wrap = WrapFit;
  tb.alignment = Spot.Center;
  tb.stroke = '#ffffff';
  tb.bind('text', 'text');
  tb.bind('stroke', 'textCol');
  node.add(tb);
  return node;
}

/** 任务卡：圆角矩形 + Vertical 面板（label + 可选 meta 行） */
function buildCardNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const card = new Shape('RoundedRectangle');
  card.portId = '';
  card.parameter1 = 6;
  card.fill = '#ffffff';
  card.stroke = '#888888';
  card.strokeWidth = 1;
  card.bind('fill', 'fill');
  card.bind('width', 'w');
  card.bind('height', 'h');
  node.add(card);
  const panel = new Panel('Vertical');
  panel.margin = new Margin(6, 10, 6, 10);
  const label = new TextBlock();
  label.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  label.stroke = '#222';
  label.wrap = WrapFit;
  label.bind('text', 'text');
  panel.add(label);
  const meta = new TextBlock();
  meta.font = `${theme.fontSize.label - 1}px ${theme.fontFamily}`;
  meta.stroke = '#777';
  meta.margin = new Margin(3, 0, 0, 0);
  meta.wrap = WrapFit;
  meta.bind('text', 'meta');
  meta.bind('visible', 'meta', (m: string) => !!m);
  panel.add(meta);
  node.add(panel);
  return node;
}
