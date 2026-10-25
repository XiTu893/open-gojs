/**
 * treeView AST → GoJS 模型数据映射。
 *
 * 文件树行式布局：每行 y 递增、x 按 depth 缩进；目录字体 bold，
 * desc 以 "标签  (描述)" 形式并入文本。父子连线由渲染层用正交路由完成。
 */
import { TreeViewAST, TreeItem } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const ROW_H = 30;
const INDENT = 26;
const MARGIN_X = 28;
const MARGIN_Y = 28;

type TVItem = TreeItem & { desc?: string };

/** 映射后的节点数据 */
export interface MappedTreeViewNode {
  key: number;
  category: 'TVItem';
  loc: string;
  text: string;
  font: string;
  dir: boolean;
}

/** 映射后的连线 */
export interface MappedTreeViewLink {
  from: number;
  to: number;
}

interface TNode {
  i: number;
  depth: number;
  parent: TNode | null;
  kids: TNode[];
}

/** 主入口 */
export function mapTreeView(
  ast: TreeViewAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedTreeViewNode[]; links: MappedTreeViewLink[] } {
  const nodes: MappedTreeViewNode[] = [];
  const links: MappedTreeViewLink[] = [];
  const items: TVItem[] = ast.nodes;
  if (!items.length) return { nodes, links };

  // depth 列表 → 树（用于连线）
  const tn: TNode[] = items.map((_, i) => ({ i, depth: items[i].depth, parent: null, kids: [] }));
  const stack: TNode[] = [];
  for (const n of tn) {
    while (stack.length && stack[stack.length - 1].depth >= n.depth) stack.pop();
    if (stack.length) {
      n.parent = stack[stack.length - 1];
      n.parent.kids.push(n);
    }
    stack.push(n);
  }

  // 官方 mermaid 恒有合成根 "/" 行（即使首行不缩进）；items 整体 depth+1、行序后移，
  // 一级条目挂到根（key 0）下
  nodes.push({
    key: 0,
    category: 'TVItem',
    loc: `${MARGIN_X} ${MARGIN_Y}`,
    text: '/',
    font: `${theme.fontSize.node}px ${theme.fontFamily}`,
    dir: false,
  });

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const x = MARGIN_X + (it.depth + 1) * INDENT;
    const y = MARGIN_Y + (i + 1) * ROW_H;
    const label = it.desc ? `${it.text}  (${it.desc})` : it.text;
    const font = `${it.dir ? 'bold ' : ''}${theme.fontSize.node}px ${theme.fontFamily}`;
    nodes.push({
      key: i + 1,
      category: 'TVItem',
      loc: `${Math.round(x)} ${Math.round(y)}`,
      text: label,
      font,
      dir: !!it.dir,
    });
    const parentKey = tn[i].parent ? tn[i].parent!.i + 1 : 0;
    links.push({ from: parentKey, to: i + 1 });
  }
  return { nodes, links };
}
