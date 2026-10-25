/**
 * radar 渲染器 —— 只建模板 + 装配模型（数据由 mapper/radar 提供，零布局数学）。
 *
 * 结构：标题 → 同心网格+辐条（geometryString 多子路径）→ 轴标签 → 每 curve 一条闭合多边形 → 图例。
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
import { MappedRadarNode } from '../mapper/radar';

/** 渲染 radar 到 div（data = mapRadar 的输出） */
export function renderRadar(
  divId: string,
  data: { nodes: MappedRadarNode[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('RadarTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('RadarGrid', buildGridNode());
  diag.nodeTemplateMap.add('RadarCurve', buildCurveNode());
  diag.nodeTemplateMap.add('RadarAxisLabel', buildAxisLabelNode(theme));
  diag.nodeTemplateMap.add('RadarLegend', buildLegendNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

/** 同心网格 + 辐条（无填充、浅灰描边） */
function buildGridNode(): Node {
  const node = new Node('Spot');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const path = new Shape();
  path.portId = '';
  path.fill = '';
  path.stroke = 'rgba(0,0,0,0.25)';
  path.strokeWidth = 1;
  path.bind('geometryString', 'geom');
  path.bind('stroke', 'stroke');
  path.bind('strokeWidth', 'sw');
  node.add(path);
  return node;
}

/** 曲线多边形（半透明填充 + series 描边） */
function buildCurveNode(): Node {
  const node = new Node('Spot');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const path = new Shape();
  path.portId = '';
  path.fill = 'rgba(0,0,0,0.25)';
  path.stroke = '#333333';
  path.strokeWidth = 2;
  path.bind('geometryString', 'geom');
  path.bind('fill', 'fill');
  path.bind('stroke', 'stroke');
  path.bind('strokeWidth', 'sw');
  node.add(path);
  return node;
}

/** 轴标签（居中，外置在半径外） */
function buildAxisLabelNode(theme: MermaidTheme): Node {
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
