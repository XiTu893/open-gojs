/**
 * timeline 渲染器 —— 只建模板 + 装配模型（数据由 mapper/timeline 提供）。
 *
 * 水平时间轴：一条贯穿轴线（geometryString 带箭头）+ 每 period 轴上圆点 + 轴上方卡片。
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Panel } from '../../view/Panel';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Size } from '../../core/Size';
import { Spot } from '../../core/Spot';
import { WrapFit } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedTimelineNode } from '../mapper/timeline';

/** 渲染 timeline 到 div（data = mapTimeline 的输出） */
export function renderTimeline(divId: string, data: { nodes: MappedTimelineNode[] }, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('TTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('TAxis', buildAxisNode());
  diag.nodeTemplateMap.add('TDot', buildDotNode());
  diag.nodeTemplateMap.add('TCard', buildCardNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

/** 标题节点 */
function buildTitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.margin = new Margin(4);
  tb.font = `bold ${theme.fontSize.title}px ${theme.fontFamily}`;
  tb.stroke = '#222';
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 轴线：geometryString Shape（横线 + 右端箭头，无填充仅描边） */
function buildAxisNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const line = new Shape();
  line.portId = '';
  line.fill = 'transparent';
  line.stroke = '#000000';
  line.strokeWidth = 1.5;
  line.bind('geometryString', 'geo');
  line.bind('stroke', 'stroke');
  node.add(line);
  return node;
}

/** 轴上圆点 */
function buildDotNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const dot = new Shape('Ellipse');
  dot.portId = '';
  dot.fill = '#555555';
  dot.stroke = '#000000';
  dot.bind('fill', 'fill');
  dot.bind('width', 'w');
  dot.bind('height', 'h');
  node.add(dot);
  return node;
}

/** 卡片：圆角矩形 + Vertical 面板（period 粗体 + 事件多行文本） */
function buildCardNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const card = new Shape('RoundedRectangle');
  card.portId = '';
  card.parameter1 = 8;
  card.fill = '#ffffff';
  card.stroke = '#000000';
  card.strokeWidth = 1.5;
  card.bind('fill', 'fill');
  card.bind('stroke', 'stroke');
  card.bind('width', 'w');
  card.bind('height', 'h');
  node.add(card);
  const panel = new Panel('Vertical');
  panel.margin = new Margin(6, 10, 6, 10);
  const period = new TextBlock();
  period.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  period.stroke = '#222';
  period.textAlign = 'center';
  period.wrap = WrapFit;
  period.bind('text', 'text');
  period.bind('maxSize', 'w', (w: number) => new Size(Math.max(10, (w ?? 170) - 20), NaN));
  panel.add(period);
  const events = new TextBlock();
  events.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  events.stroke = '#444';
  events.wrap = WrapFit;
  events.textAlign = 'center';
  events.margin = new Margin(4, 0, 0, 0);
  events.bind('text', 'events');
  events.bind('maxSize', 'w', (w: number) => new Size(Math.max(10, (w ?? 170) - 20), NaN));
  panel.add(events);
  node.add(panel);
  return node;
}
