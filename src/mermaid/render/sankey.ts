/**
 * sankey 渲染器 —— 只建模板 + 装配模型（数据由 mapper/sankey 提供，零布局数学）。
 *
 * - 节点 = 竖条 Rectangle（w/h/fill 数据驱动）
 * - 流量带 = category 'SankeyFlow' 的节点（Shape + geometryString 填充，无 links）
 * - 标签 = 侧边文本
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
import { MappedSankeyNode } from '../mapper/sankey';

/** 节点竖条 */
function buildBarNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const bar = new Shape('Rectangle');
  bar.portId = '';
  bar.fill = '#1a1a1a';
  bar.stroke = 'transparent';
  bar.bind('fill', 'fill');
  bar.bind('width', 'w');
  bar.bind('height', 'h');
  node.add(bar);
  return node;
}

/** 流量带：geometryString 填充 Shape（绝对坐标，loc 固定 0 0） */
function buildFlowNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const band = new Shape();
  band.portId = '';
  band.fill = 'rgba(0,0,0,0.25)';
  band.stroke = 'transparent';
  band.bind('geometryString', 'geom');
  band.bind('fill', 'fill');
  node.add(band);
  return node;
}

/** 节点标签 */
function buildLabelNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#222222';
  tb.wrap = WrapFit;
  tb.margin = new Margin(0, 4, 0, 4);
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 渲染 sankey 到 div（data = mapSankey 的输出） */
export function renderSankey(
  divId: string,
  data: { nodes: MappedSankeyNode[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('SankeyNode', buildBarNode());
  diag.nodeTemplateMap.add('SankeyFlow', buildFlowNode());
  diag.nodeTemplateMap.add('SankeyLabel', buildLabelNode(theme));

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes as any[],
    linkDataArray: [],
  } as any);
  return diag;
}
