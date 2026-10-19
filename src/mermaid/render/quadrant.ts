/**
 * quadrantChart 渲染器 —— 只建模板 + 装配模型（数据由 mapper/quadrant 提供，零布局数学）。
 *
 * 结构：棋盘底色 4 块 → 外框 + 十字分割线 → 象限文字 → 轴端标签 → 数据点圆 + 标签。
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
import { MappedQuadrantNode } from '../mapper/quadrant';

/** 渲染 quadrantChart 到 div（data = mapQuadrant 的输出） */
export function renderQuadrant(
  divId: string,
  data: { nodes: MappedQuadrantNode[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('QTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('QBg', buildRectNode());
  diag.nodeTemplateMap.add('QFrame', buildFrameNode());
  diag.nodeTemplateMap.add('QLine', buildRectNode());
  diag.nodeTemplateMap.add('QLabel', buildCenterText(theme, '#666666', theme.fontSize.node));
  diag.nodeTemplateMap.add('QAxisX', buildCenterText(theme, '#444444', theme.fontSize.label));
  diag.nodeTemplateMap.add('QAxisY', buildRightText(theme));
  diag.nodeTemplateMap.add('QDot', buildDotNode());
  diag.nodeTemplateMap.add('QPointLabel', buildCenterText(theme, '#333333', theme.fontSize.label));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

/** 无描边填充矩形（底色块/分割线共用，尺寸由数据 w/h 驱动） */
function buildRectNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const rect = new Shape('Rectangle');
  rect.portId = '';
  rect.stroke = '';
  rect.fill = '#f5f5f5';
  rect.bind('fill', 'fill');
  rect.bind('width', 'w');
  rect.bind('height', 'h');
  node.add(rect);
  return node;
}

/** 绘图区外框（透明填充 + 描边） */
function buildFrameNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const rect = new Shape('Rectangle');
  rect.portId = '';
  rect.fill = '';
  rect.stroke = '#000000';
  rect.strokeWidth = 1.5;
  rect.bind('stroke', 'stroke');
  rect.bind('width', 'w');
  rect.bind('height', 'h');
  node.add(rect);
  return node;
}

/** 数据点小圆 */
function buildDotNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = true;
  const dot = new Shape('Ellipse');
  dot.portId = '';
  dot.width = 10;
  dot.height = 10;
  dot.fill = '#333333';
  dot.stroke = '#ffffff';
  dot.strokeWidth = 1;
  dot.bind('fill', 'fill');
  node.add(dot);
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

/** 居中灰字（象限名 / x 轴端 / 点标签） */
function buildCenterText(theme: MermaidTheme, stroke: string, fontSize: number): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${fontSize}px ${theme.fontFamily}`;
  tb.stroke = stroke;
  tb.textAlign = 'center';
  tb.margin = new Margin(2, 4, 2, 4);
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 右对齐灰字（y 轴端，贴在绘图区左侧） */
function buildRightText(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#444444';
  tb.textAlign = 'right';
  tb.margin = new Margin(2, 4, 2, 6);
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}
