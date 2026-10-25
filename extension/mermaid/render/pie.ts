/**
 * pie 渲染器 —— 只建模板 + 装配模型（数据由 mapper/pie 提供）。
 *
 * 扇形节点用 `Pie` figure（parameter1=Start, parameter2=Sweep）重叠定位在圆心，右侧图例。
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
import { MappedPieNode } from '../mapper/pie';

/** 渲染 pie 到 div（data = mapPie 的输出） */
export function renderPie(divId: string, data: { nodes: MappedPieNode[] }, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('Slice', buildSliceNode());
  diag.nodeTemplateMap.add('SliceLabel', buildSliceLabelNode(theme));
  diag.nodeTemplateMap.add('Legend', buildLegendNode(theme));
  diag.nodeTemplateMap.add('Title', buildTitleNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes, linkDataArray: [] } as any);
  return diag;
}

/** 扇形节点 */
function buildSliceNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  node.isShadowed = false;
  const slice = new Shape('Pie');
  slice.portId = '';
  slice.stroke = '#ffffff';
  slice.strokeWidth = 2;
  slice.fill = '#555555';
  slice.bind('fill', 'fill');
  slice.bind('parameter1', 'start');
  slice.bind('parameter2', 'sweep');
  slice.bind('width', 'w');
  slice.bind('height', 'h');
  node.add(slice);
  return node;
}

/** 切片内百分比标签（白字加粗、居中对齐到扇形中部） */
function buildSliceLabelNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.textAlign = 'center';
  tb.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.stroke = '#ffffff';
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
  swatch.width = 16;
  swatch.height = 16;
  swatch.stroke = 'transparent';
  swatch.fill = '#555555';
  swatch.bind('fill', 'fill');
  node.add(swatch);
  const label = new TextBlock();
  label.margin = new Margin(2, 0, 2, 8);
  label.font = `${theme.fontSize.node}px ${theme.fontFamily}`;
  label.stroke = '#333';
  label.wrap = WrapFit;
  label.bind('text', 'text');
  node.add(label);
  return node;
}

/** 标题节点 */
function buildTitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `bold ${theme.fontSize.title}px ${theme.fontFamily}`;
  tb.stroke = '#222';
  tb.margin = new Margin(4);
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}
