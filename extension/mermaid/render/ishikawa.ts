/**
 * ishikawa 渲染器 —— 只建模板 + 装配模型（数据由 mapper/ishikawa 提供，零布局数学）。
 *
 * 复刻官方 mermaid 11 ishikawa 视觉：
 *  - 骨线 stroke #333、spine/branch 宽 2、sub-branch 宽 1、fill none
 *  - 箭头 = 三角（fill #333）由 mapper 算好，附在骨线起端
 *  - 类别标签 = Auto 盒（#ECECFF 填充、#333 描边宽 2）+ 16px 文字，margin(2,20)（= 官方 bbox±20 横、±2 纵）
 *  - 原因标签 = 纯文字，anchor end（spot MiddleRight），16px
 *  - 鱼头 = 鱼头路径（#ECECFF 填充、#333 描边宽 2）+ 居中 14px/600 标签
 *  - diag.padding = 20（对标官方 applyPaddedViewBox diagramPadding）
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import { MermaidTheme } from '../themes';
import { MappedIshikawaNode } from '../mapper/ishikawa';

/** 骨线：geometryString（线 + 箭头三角双 Shape），无填充仅描边 */
function buildBoneNode(theme: MermaidTheme): Node {
  void theme;
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  node.isLayoutPositioned = false;

  const line = new Shape();
  line.portId = '';
  line.fill = 'transparent';
  line.stroke = '#333333';
  line.bind('geometryString', 'geo');
  line.bind('strokeWidth', 'sw');
  line.bind('stroke', 'stroke');
  node.add(line);

  // 箭头三角（fill #333，无描边）；无 arrow 时不可见。
  // 关键：Geometry.parse 默认 isFilled=false → fill 被 fig.isFilled 门控不画，
  // 官方 GeoStream F1 前缀置 isFilled=true（与 sankey fill 同一机制）。
  const arrow = new Shape();
  arrow.portId = '';
  arrow.fill = '#333333';
  arrow.stroke = 'transparent';
  arrow.bind('geometryString', 'arrow', (v?: string) => (v ? `F1 ${v}` : v));
  node.add(arrow)
  return node;
}

/** 鱼头路径节点（F1 前缀 → isFilled=true，否则 #ECECFF 不填充） */
function buildHeadNode(theme: MermaidTheme): Node {
  void theme;
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;

  const shape = new Shape();
  shape.portId = '';
  shape.fill = '#ECECFF';
  shape.stroke = '#333333';
  shape.strokeWidth = 2;
  shape.bind('geometryString', 'geo', (v?: string) => (v ? `F1 ${v}` : v));
  shape.bind('fill', 'fill');
  shape.bind('stroke', 'stroke');
  node.add(shape);
  return node;
}

/** 鱼头标签（14px/600 居中） */
function buildHeadLabelNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = true;

  const tb = new TextBlock();
  // 不要 WrapNone：其 measure/draw 单行路径不拆 \n（mapper 已预换行，
  // 默认 WrapDesiredSize 按段落拆行且行宽不超测量值，不会二次换行）
  tb.textAlign = 'center';
  tb.stroke = '#111111'; // 文字近黑（骨线仍 #333）
  tb.font = `600 ${14}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 类别标签：Auto 盒 + 文字（margin 2,20 横纵 = 官方 ±20/±2） */
function buildCatLabelNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.Center;
  node.selectable = true;

  const rect = new Shape('Rectangle');
  rect.portId = '';
  rect.fill = '#ECECFF';
  rect.stroke = '#333333';
  rect.strokeWidth = 2;
  node.add(rect);

  const tb = new TextBlock();
  tb.margin = new Margin(2, 20, 2, 20); // 官方盒 = text bbox ±20 横、±2 纵
  tb.stroke = '#111111'; // 文字近黑（骨线仍 #333）
  tb.font = `${16}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 原因标签：纯文字，anchor end（MiddleRight），16px */
function buildCauseLabelNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.MiddleRight;
  node.selectable = true;

  const tb = new TextBlock();
  tb.stroke = '#111111'; // 文字近黑（骨线仍 #333）
  tb.font = `${16}px ${theme.fontFamily}`;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 渲染 ishikawa 到 div（data = mapIshikawa 的输出） */
export function renderIshikawa(
  divId: string,
  data: { nodes: MappedIshikawaNode[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;
  diag.padding = new Margin(20);

  diag.nodeTemplateMap.add('Bone', buildBoneNode(theme));
  diag.nodeTemplateMap.add('Head', buildHeadNode(theme));
  diag.nodeTemplateMap.add('HeadLabel', buildHeadLabelNode(theme));
  diag.nodeTemplateMap.add('CatLabel', buildCatLabelNode(theme));
  diag.nodeTemplateMap.add('CauseLabel', buildCauseLabelNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray: data.nodes as any[], linkDataArray: [] } as any);
  return diag;
}