/**
 * timeline 渲染器 —— 只建模板 + 装配模型（数据由 mapper/timeline 提供）。
 *
 * 纵向时间轴（对标官方）：每 period 一列 = 顶部年徽章 + 向下虚线轴 + 事件 pill 竖排。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import { MermaidTheme } from '../themes';
import { MappedTimelineNode } from '../mapper/timeline';

/** 渲染 timeline 到 div（data = mapTimeline 的输出） */
export function renderTimeline(divId: string, data: { nodes: MappedTimelineNode[] }, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('TTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('TBadge', buildBadgeNode(theme));
  diag.nodeTemplateMap.add('TAxis', buildLineNode(true));
  diag.nodeTemplateMap.add('TLine', buildLineNode(false));
  diag.nodeTemplateMap.add('TEvent', buildEventNode(theme));

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

/** 年徽章：圆角卡（series 填色 + 白字居中） */
function buildBadgeNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const bg = new Shape('RoundedRectangle');
  bg.portId = '';
  bg.parameter1 = 8;
  bg.fill = '#555555';
  bg.stroke = '#555555';
  bg.bind('fill', 'fill');
  bg.bind('stroke', 'stroke');
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  node.add(bg);
  const tb = new TextBlock();
  tb.textAlign = 'center';
  tb.stroke = '#ffffff';
  tb.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/**
 * 轴线：geometryString Shape。
 * - 横向时间轴：粗实线 + 右端箭头（sw=4、无 dash）
 * - 纵向虚线：黑虚线 + 下端箭头（sw=2、dash=[5,5]）
 * 箭头作为几何里的实心三角，与本线同色。
 */
function buildLineNode(axis: boolean): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const line = new Shape();
  line.portId = '';
  line.fill = axis ? '#000000' : '#000000';
  line.stroke = '#000000';
  line.strokeWidth = axis ? 4 : 2;
  line.strokeDashArray = axis ? (null as any) : [5, 5];
  line.bind('geometryString', 'geo');
  line.bind('stroke', 'stroke');
  line.bind('fill', 'fill');
  line.bind('strokeWidth', 'sw');
  line.bind('strokeDashArray', 'dash');
  node.add(line);
  return node;
}

/** 事件 pill：圆角小卡（series 填色 + 白字居中） */
function buildEventNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const bg = new Shape('RoundedRectangle');
  bg.portId = '';
  bg.parameter1 = 8;
  bg.fill = '#555555';
  bg.stroke = '#555555';
  bg.bind('fill', 'fill');
  bg.bind('stroke', 'stroke');
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  node.add(bg);
  const tb = new TextBlock();
  tb.textAlign = 'center';
  tb.stroke = '#333333';
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}