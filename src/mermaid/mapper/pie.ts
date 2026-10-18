/**
 * pie AST → GoJS 模型数据映射。
 *
 * 扇形用 GoJS `Pie` figure（parameter1=Start, parameter2=Sweep），
 * 节点数据含定位/尺寸/角度/配色，渲染层只建模板。
 */
import { PieAST } from '../ast';
import { MermaidTheme } from '../themes';

const R = 150;        // 饼半径
const CX = 210;       // 圆心 X
const CY = 200;       // 圆心 Y
const LEGEND_X = 420; // 图例起始 X
const LEGEND_ROW = 30;// 图例行高

/** 映射后的节点数据 */
export interface MappedPieNode {
  key: string;
  category: 'Slice' | 'Legend' | 'Title';
  loc: string;
  text?: string;
  fill?: string;
  start?: number; // 扇形起始角
  sweep?: number; // 扇形扫过角
  w?: number;
  h?: number;
}

function normalizeAngle(a: number): number {
  let s = a % 360;
  if (s < 0) s += 360;
  return s;
}

/** 主入口 */
export function mapPie(ast: PieAST, theme: MermaidTheme): { nodes: MappedPieNode[] } {
  const total = ast.data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
  const nodes: MappedPieNode[] = [];
  const size = 2 * R;
  const colorOf = (i: number) => theme.series[i % theme.series.length];

  // 扇形（从 12 点方向开始顺时针）
  let angle = -90;
  ast.data.forEach((d, i) => {
    const frac = Math.max(0, d.value) / total;
    const sweep = frac * 360;
    if (sweep <= 0) return;
    nodes.push({
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
    nodes.push({
      key: `legend_${i}`,
      category: 'Legend',
      text: `${d.label}  ${d.value}`,
      fill: colorOf(i),
      loc: `${LEGEND_X} ${CY - R + i * LEGEND_ROW}`,
    });
  });

  // 标题（顶部）
  if (ast.title) {
    nodes.push({ key: '__title', category: 'Title', text: ast.title, loc: `${CX} 40` });
  }

  return { nodes };
}
