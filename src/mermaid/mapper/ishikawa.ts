/**
 * ishikawa AST → GoJS 模型数据映射。
 *
 * 鱼骨布局（全部坐标在此算好）：
 *  - 主水平脊线（左 → 右），右端鱼头（问题）
 *  - 类别沿脊线均分锚点，斜骨上下交替（约 45°~55°）
 *  - 类别标签在骨末端；原因文本沿斜骨排布
 *  - 骨线输出为 category:'Bone' 的 geometryString 节点（渲染层只建模板）
 */
import { IshikawaAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const SPINE_X0 = 80;
const SPINE_X1 = 720;
const MID_Y = 340;
const BONE_DX = 140;  // 斜骨水平跨度
const BONE_DY = 180;  // 斜骨垂直跨度

/** 映射后的节点数据（含 Bone 线节点） */
export interface MappedIshikawaNode {
  key: string;
  category: 'Problem' | 'Category' | 'Cause' | 'Bone';
  loc: string;
  text?: string;
  geo?: string;      // Bone: geometryString
  fill?: string;
  stroke?: string;
  textCol?: string;
  bold?: boolean;
}

/** 深色底上取白字，浅底取黑字（仅黑白） */
function textOn(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length < 6) return '#000000';
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? '#000000' : '#ffffff';
}

/** 主入口 */
export function mapIshikawa(
  ast: IshikawaAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedIshikawaNode[] } {
  const nodes: MappedIshikawaNode[] = [];
  const edge = theme.edge.solid;

  // 脊线
  nodes.push({
    key: 'spine',
    category: 'Bone',
    loc: '0 0',
    geo: `M ${SPINE_X0} ${MID_Y} L ${SPINE_X1} ${MID_Y}`,
    stroke: edge,
  });

  // 鱼头（问题）
  if (ast.problem) {
    const headFill = theme.series[0];
    nodes.push({
      key: 'problem',
      category: 'Problem',
      loc: `${SPINE_X1 + 110} ${MID_Y}`, // 中心点（模板 locationSpot=Center）
      text: ast.problem,
      fill: headFill,
      stroke: '#000000',
      textCol: textOn(headFill),
    });
  }

  const cats = ast.categories;
  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i];
    const t = (i + 1) / (cats.length + 1);
    const ax = SPINE_X0 + t * (SPINE_X1 - SPINE_X0);
    const up = i % 2 === 0 ? 1 : -1; // 上下交替
    const ex = ax - BONE_DX;
    const ey = MID_Y - up * BONE_DY;

    // 类别斜骨
    nodes.push({
      key: `bone_${i}`,
      category: 'Bone',
      loc: '0 0',
      geo: `M ${Math.round(ax)} ${MID_Y} L ${Math.round(ex)} ${Math.round(ey)}`,
      stroke: edge,
    });

    // 类别标签（骨末端外侧）
    nodes.push({
      key: `cat_${i}`,
      category: 'Category',
      loc: `${Math.round(ex - 10)} ${Math.round(ey - up * 26)}`,
      text: cat.name,
      bold: true,
    });

    // 原因沿斜骨排布
    const causes = cat.causes;
    for (let j = 0; j < causes.length; j++) {
      const f = (j + 1) / (causes.length + 1);
      const cx = ax + (ex - ax) * f + 10;
      const cy = MID_Y + (ey - MID_Y) * f;
      nodes.push({
        key: `cause_${i}_${j}`,
        category: 'Cause',
        loc: `${Math.round(cx)} ${Math.round(cy - 9)}`,
        text: causes[j],
      });
    }
  }
  return { nodes };
}
