/**
 * pie 渲染器 —— 用 GoJS `Pie` figure（parameter1=Start, parameter2=Sweep）画扇形。
 *
 * 扇形节点手动定位在圆心（重叠），右侧图例。采用高辨识度循环配色。
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Panel } from '../../view/Panel';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Point } from '../../core/Point';
import { Size } from '../../core/Size';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import { WrapFit } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { PieAST } from '../ast';

/** 饼图配色（高饱和高对比，循环使用） */
const PIE_COLORS = [
  '#4f6df5', '#f5a623', '#2f9e44', '#e05b8d', '#9b6bf5',
  '#1c9ad6', '#f4772e', '#16a085', '#d4344f', '#7d3c98',
  '#00838f', '#c0392b', '#2874a6', '#b7950b', '#117864',
];

const R = 150;              // 饼半径
const CX = 210;             // 圆心 X
const CY = 200;             // 圆心 Y
const LEGEND_X = 420;       // 图例起始 X
const LEGEND_ROW = 30;      // 图例行高

/** 渲染 pie 到 div */
export function renderPie(divId: string, ast: PieAST, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  // 扇形节点模板（figure='Pie'）
  diag.nodeTemplateMap.add('Slice', buildSliceNode());
  // 图例项模板
  diag.nodeTemplateMap.add('Legend', buildLegendNode(theme));

  const total = ast.data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
  const nodeDataArray: any[] = [];
  const size = 2 * R;

  let angle = -90; // 从 12 点方向开始，顺时针
  const colorOf = (i: number) => PIE_COLORS[i % PIE_COLORS.length];

  ast.data.forEach((d, i) => {
    const frac = Math.max(0, d.value) / total;
    const sweep = frac * 360;
    if (sweep <= 0) return;
    nodeDataArray.push({
      key: `slice_${i}`,
      category: 'Slice',
      start: normalizeAngle(angle),
      sweep,
      fill: colorOf(i),
      loc: `${CX - R} ${CY - R}`,
      w: size,
      h: size,
    });
    angle += sweep;
  });

  // 图例（右侧竖排）
  ast.data.forEach((d, i) => {
    if (Math.max(0, d.value) <= 0 && total > 0) return;
    nodeDataArray.push({
      key: `legend_${i}`,
      category: 'Legend',
      text: `${d.label}  ${d.value}`,
      fill: colorOf(i),
      loc: `${LEGEND_X} ${CY - R + i * LEGEND_ROW}`,
    });
  });

  // 标题（顶部）
  if (ast.title) {
    nodeDataArray.push({
      key: '__title',
      category: 'Title',
      text: ast.title,
      loc: `${CX} 40`,
    });
  }

  diag.nodeTemplateMap.add('Title', buildTitleNode(theme));

  diag.model = new GraphLinksModel({ nodeDataArray, linkDataArray: [] } as any);
  return diag;
}

function normalizeAngle(a: number): number {
  let s = a % 360;
  if (s < 0) s += 360;
  return s;
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
  slice.fill = '#4f6df5';
  slice.bind('fill', 'fill');
  slice.bind('parameter1', 'start');
  slice.bind('parameter2', 'sweep');
  slice.bind('width', 'w');
  slice.bind('height', 'h');
  node.add(slice);
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
  swatch.fill = '#4f6df5';
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