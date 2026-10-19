/**
 * treemap AST → GoJS 模型数据映射。
 *
 * 矩形嵌套填充布局（slice-and-dice 简化版）：每层按 value 占比分割父矩形，
 * 水平/垂直逐层交替；值缺省 = 1，分支值 = 子树之和。
 * 叶子填充用 theme.series 轮换，分支白底；坐标/尺寸全部在此算好。
 */
import { TreemapAST, TreeItem } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const CANVAS_W = 960;
const CANVAS_H = 620;
const PAD = 3; // 子格与父框内边距

/** 映射后的节点数据 */
export interface MappedTreemapNode {
  key: number | string;
  category: 'TMCell';
  loc: string;
  text: string;
  w: number;
  h: number;
  fill: string;
  stroke: string;
  textCol: string;
  depth: number;
  value: number;
  isLeaf: boolean;
}

interface TNode {
  key: number | string;
  depth: number;
  parent: TNode | null;
  kids: TNode[];
  text: string;
  value: number;
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
export function mapTreemap(
  ast: TreemapAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedTreemapNode[] } {
  const nodes: MappedTreemapNode[] = [];
  const items: TreeItem[] = ast.nodes;
  if (!items.length) return { nodes };

  // depth 列表 → 树（多个顶层项挂在虚拟根下，按 value 均分画布）
  const tn: TNode[] = items.map((_, i) => ({
    key: i,
    depth: items[i].depth,
    parent: null,
    kids: [],
    text: items[i].text,
    value: 0,
  }));
  const stack: TNode[] = [];
  for (const n of tn) {
    while (stack.length && stack[stack.length - 1].depth >= n.depth) stack.pop();
    if (stack.length) {
      n.parent = stack[stack.length - 1];
      n.parent.kids.push(n);
    }
    stack.push(n);
  }
  const roots = tn.filter((n) => !n.parent);
  const virtualRoot: TNode = { key: '__root', depth: -1, parent: null, kids: roots, text: '', value: 0 };
  for (const r of roots) r.parent = virtualRoot;

  // 自底向上求 value：叶子用显式值（缺省 1），分支 = 子之和
  const calc = (n: TNode): number => {
    if (!n.kids.length) {
      const v = items[n.key as number].value;
      n.value = v !== undefined && v > 0 ? v : 1;
    } else {
      n.value = n.kids.reduce((s, k) => s + calc(k), 0);
    }
    return n.value;
  };
  calc(virtualRoot);

  let leafIdx = 0;
  const layout = (n: TNode, x: number, y: number, w: number, h: number, depth: number): void => {
    const isLeaf = n.kids.length === 0;
    const isVirtual = n.key === '__root';
    const fill = isLeaf ? theme.series[leafIdx++ % theme.series.length] : '#ffffff';
    if (!isVirtual) {
      const it = items[n.key as number];
      nodes.push({
        key: n.key,
        category: 'TMCell',
        loc: `${Math.round(x)} ${Math.round(y)}`,
        text: isLeaf && it.value !== undefined ? `${n.text} (${it.value})` : n.text,
        w: Math.max(1, Math.round(w)),
        h: Math.max(1, Math.round(h)),
        fill,
        stroke: '#000000',
        textCol: isLeaf ? textOn(fill) : '#000000',
        depth,
        value: n.value,
        isLeaf,
      });
    }
    if (isLeaf) return;
    // 逐层水平/垂直交替切分（虚拟根恒水平）
    const horiz = depth % 2 === 0;
    const total = n.value || 1;
    let ox = x;
    let oy = y;
    for (const k of n.kids) {
      const frac = k.value / total;
      if (horiz) {
        const kw = w * frac;
        layout(k, ox + (isVirtual ? 0 : PAD), y + (isVirtual ? 0 : PAD), Math.max(1, kw - (isVirtual ? 0 : 2 * PAD)), Math.max(1, h - (isVirtual ? 0 : 2 * PAD)), depth + 1);
        ox += kw;
      } else {
        const kh = h * frac;
        layout(k, x + PAD, oy + PAD, Math.max(1, w - 2 * PAD), Math.max(1, kh - 2 * PAD), depth + 1);
        oy += kh;
      }
    }
  };
  layout(virtualRoot, 0, 0, CANVAS_W, CANVAS_H, 0);

  return { nodes };
}
