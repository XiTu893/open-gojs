/**
 * mindmap AST → GoJS 模型数据映射。
 *
 * 树形分层布局：根居左，每层等间距缩进；叶子顺序排布，父节点纵向居中于子树。
 * 坐标全部在此算好（loc 为 "x y" 字符串，兼容 GoJS 默认 loc 绑定）。
 */
import { MindmapAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const ROW_H = 44;   // 同层行距
const COL_W = 150;  // 层间水平距
const MARGIN = 48;

/** 映射后的节点数据 */
export interface MappedMindmapNode {
  key: number;
  category: string; // root | circle | square | rounded | hexagon
  loc: string;
  text: string;
  fill: string;
  stroke: string;
  textCol: string;
}

/** 映射后的连线 */
export interface MappedMindmapLink {
  from: number;
  to: number;
}

interface TNode {
  i: number;
  depth: number;
  parent: TNode | null;
  kids: TNode[];
  y: number;
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
export function mapMindmap(
  ast: MindmapAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedMindmapNode[]; links: MappedMindmapLink[] } {
  const nodes: MappedMindmapNode[] = [];
  const links: MappedMindmapLink[] = [];
  const items = ast.nodes;
  if (!items.length) return { nodes, links };

  // depth 列表 → 树
  const tn: TNode[] = items.map((_, i) => ({ i, depth: items[i].depth, parent: null, kids: [], y: 0 }));
  const stack: TNode[] = [];
  for (const n of tn) {
    while (stack.length && stack[stack.length - 1].depth >= n.depth) stack.pop();
    if (stack.length) {
      n.parent = stack[stack.length - 1];
      n.parent.kids.push(n);
    }
    stack.push(n);
  }

  // 叶子顺序排 y，父节点取首末子中点
  let cursor = 0;
  const place = (n: TNode): number => {
    if (!n.kids.length) {
      n.y = cursor * ROW_H;
      cursor++;
    } else {
      const ys = n.kids.map(place);
      n.y = (ys[0] + ys[ys.length - 1]) / 2;
    }
    return n.y;
  };
  place(tn[0]);
  // 容错：后续 depth-0 节点（多根）依次排在其后
  for (const r of tn) if (!r.parent && r !== tn[0]) place(r);

  for (const n of tn) {
    const it = items[n.i];
    const x = MARGIN + n.depth * COL_W;
    const y = MARGIN + n.y;
    const fill = n.depth === 0 ? theme.series[0] : '#ffffff';
    nodes.push({
      key: n.i,
      category: it.shape,
      loc: `${Math.round(x)} ${Math.round(y)}`,
      text: it.text,
      fill,
      stroke: '#000000',
      textCol: n.depth === 0 ? textOn(fill) : '#000000',
    });
    if (n.parent) links.push({ from: n.parent.i, to: n.i });
  }
  return { nodes, links };
}
