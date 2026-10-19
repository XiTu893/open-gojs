/**
 * xychart 渲染器 —— 只建模板 + 装配模型（数据由 mapper/xychart 提供，零布局数学）。
 *
 * 结构：标题 + 图例 → y 刻度/网格 → 坐标轴线 → x 标签 → bar 柱 / line 折线 / area 填充区。
 * line/area 用 Shape + geometryString（路径由 mapper 给绝对坐标）。
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
import { MappedXYNode } from '../mapper/xychart';

/** 渲染 xychart 到 div（data = mapXYChart 的输出） */
export function renderXYChart(
  divId: string,
  data: { nodes: MappedXYNode[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('XYTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('XYGrid', buildThinRectNode());
  diag.nodeTemplateMap.add('XYAxis', buildThinRectNode());
  diag.nodeTemplateMap.add('XYYLabel', buildRightText(theme));
  diag.nodeTemplateMap.add('XYXLabel', buildCenterText(theme));
  diag.nodeTemplateMap.add('XYBar', buildBarNode());
  diag.nodeTemplateMap.add('XYLine', buildPathNode(false));
  diag.nodeTemplateMap.add('XYArea', buildPathNode(true));
  diag.nodeTemplateMap.add('XYLegend', buildLegendNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

/** 细矩形（网格线 / 坐标轴线），尺寸由数据 w/h 驱动 */
function buildThinRectNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const rect = new Shape('Rectangle');
  rect.portId = '';
  rect.stroke = '';
  rect.fill = '#dddddd';
  rect.bind('fill', 'fill');
  rect.bind('width', 'w');
  rect.bind('height', 'h');
  node.add(rect);
  return node;
}

/** 柱形（无描边矩形，高由数据驱动） */
function buildBarNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const bar = new Shape('Rectangle');
  bar.portId = '';
  bar.stroke = '';
  bar.fill = '#888888';
  bar.bind('fill', 'fill');
  bar.bind('width', 'w');
  bar.bind('height', 'h');
  node.add(bar);
  return node;
}

/** 折线 / 填充区（geometryString；filled=true 时半透明填充 + 细描边） */
function buildPathNode(filled: boolean): Node {
  const node = new Node('Spot');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const path = new Shape();
  path.portId = '';
  path.fill = filled ? '#cccccc' : '';
  path.stroke = '#333333';
  path.strokeWidth = filled ? 1.5 : 2;
  path.bind('geometryString', 'geom');
  path.bind('fill', 'fill');
  path.bind('stroke', 'stroke');
  path.bind('strokeWidth', 'sw');
  node.add(path);
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

/** 居中文字（x 轴标签） */
function buildCenterText(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#444444';
  tb.textAlign = 'center';
  tb.margin = new Margin(2, 4, 2, 4);
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 右对齐文字（y 轴刻度） */
function buildRightText(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#555555';
  tb.textAlign = 'right';
  tb.margin = new Margin(2, 4, 2, 6);
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 图例项：色块 + 文本 */
function buildLegendNode(theme: MermaidTheme): Node {
  const node = new Node('Horizontal');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const swatch = new Shape('Rectangle');
  swatch.width = 14;
  swatch.height = 14;
  swatch.stroke = '';
  swatch.fill = '#888888';
  swatch.bind('fill', 'fill');
  node.add(swatch);
  const tb = new TextBlock();
  tb.margin = new Margin(1, 0, 1, 6);
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#333333';
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}
