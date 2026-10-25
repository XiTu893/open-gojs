/**
 * gantt 渲染器 —— 只建模板 + 装配模型（数据由 mapper/gantt 提供）。
 *
 * 左列任务名，右侧时间轴/网格/任务条与起止日期；section 分组标题。
 * 左列宽、刻度步长、日期位置全部由 mapper 自适应计算，此处只装配模板。
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Size } from '../../../src/core/Size';
import { Spot } from '../../../src/core/Spot';
import { MermaidTheme } from '../themes';
import { MappedGanttNode } from '../mapper/gantt';

const BASE_LABEL_W = 220; // 渲染层回退值（以 mapper 传入的 mw 为准）

/** 渲染 gantt 到 div（data = mapGantt 的输出） */
export function renderGantt(divId: string, data: { nodes: MappedGanttNode[] }, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('GLabel', buildLabelNode(theme));
  diag.nodeTemplateMap.add('GBar', buildBarNode(theme));
  diag.nodeTemplateMap.add('GDate', buildDateNode(theme));
  diag.nodeTemplateMap.add('GSection', buildSectionNode(theme));
  diag.nodeTemplateMap.add('GTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('GAxis', buildAxisNode(theme));
  diag.nodeTemplateMap.add('GGrid', buildGridNode());

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

function buildLabelNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.margin = new Margin(6, 8, 6, 8);
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#000000';
  tb.bind('maxSize', 'mw', (v: number | undefined) => new Size((v ?? BASE_LABEL_W) - 16, NaN));
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 构建任务条模板：条 + 居中任务名（写进度条上，对标官方，更紧凑） */
function buildBarNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const bar = new Shape('RoundedRectangle');
  bar.portId = '';
  bar.parameter1 = 4;
  bar.fill = '#999999';
  bar.stroke = 'transparent';
  bar.bind('fill', 'fill');
  bar.bind('width', 'w');
  bar.bind('height', 'h');
  node.add(bar);
  // 任务名：进度条内居中；颜色按条背景亮度取黑/白（浅黄条白字不可读 → 取黑字）
  const label = new TextBlock();
  label.textAlign = 'center';
  label.alignment = Spot.Center;
  label.stroke = '#ffffff';
  label.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  label.bind('text', 'text');
  label.bind('stroke', 'textCol');
  label.bind('visible', 'text', (t: string | undefined) => !!t);
  node.add(label);
  return node;
}

/** 任务日期文本节点 */
function buildDateNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${theme.fontSize.label - 1}px ${theme.fontFamily}`;
  tb.stroke = '#777';
  node.add(tb);
  (tb as any).bind('text', 'text');
  return node;
}

function buildSectionNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.margin = new Margin(4, 8, 4, 8);
  tb.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.stroke = '#222';
  node.add(tb);
  (tb as any).bind('text', 'text');
  return node;
}

function buildTitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `bold ${theme.fontSize.title}px ${theme.fontFamily}`;
  tb.stroke = '#222';
  node.add(tb);
  (tb as any).bind('text', 'text');
  return node;
}

/** 时间轴刻度标签节点 */
function buildAxisNode(theme: MermaidTheme): Node {
  const node = new Node('Vertical');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.textAlign = 'center';
  tb.font = `${theme.fontSize.label - 1}px ${theme.fontFamily}`;
  tb.stroke = '#888';
  node.add(tb);
  (tb as any).bind('text', 'text');
  return node;
}

/** 竖向网格线节点 */
function buildGridNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const line = new Shape('Rectangle');
  line.portId = '';
  line.width = 1;
  line.fill = '#e3e6eb';
  line.stroke = 'transparent';
  line.bind('height', 'h');
  node.add(line);
  return node;
}
