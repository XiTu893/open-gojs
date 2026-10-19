/**
 * gitgraph AST → GoJS 模型数据映射。
 *
 * 布局（全部坐标在此算好）：
 *  - 水平时间轴：commit 按出现顺序 x 递增（x = MARGIN + i*STEP）
 *  - 分支 y 分行：main 一行，每个 branch 分配新行；checkout 只切当前分支（决定后续 commit 的行）
 *  - commit = 小圆点（主分支深色，其他分支取 theme.series 轮换灰阶）+ 下方 id·label 文本
 *  - 连线：同分支相邻 commit 连成主干/分支线；分支首 commit 从前一 commit 折出（fork 线）；
 *    merge = 从被合并分支最后一 commit 连回当前分支的 merge 节点
 */
import { GitGraphAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const MARGIN = 70;
const STEP = 92;      // 相邻 commit 水平间距
const ROW_H = 68;     // 分支行距
const TOP = 80;       // 首行 y
const DOT = 12;       // 圆点直径

/** 映射后的节点类别 */
export type GitNodeCategory = 'GitDot' | 'GitText' | 'GitBranchLabel';

/** 映射后的节点数据 */
export interface MappedGitGraphNode {
  key: string;
  category: GitNodeCategory;
  loc: string;
  text?: string;
  fill?: string;
  w?: number;
  h?: number;
  bold?: boolean;
}

/** 映射后的连线数据 */
export interface MappedGitLink {
  from: string;
  to: string;
  kind: 'branch' | 'merge';
}

function r1(v: number): number {
  return Math.round(v * 10) / 10;
}

/** 主入口 */
export function mapGitGraph(
  ast: GitGraphAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedGitGraphNode[]; links: MappedGitLink[] } {
  const nodes: MappedGitGraphNode[] = [];
  const links: MappedGitLink[] = [];

  // 分支行分配：main=0，其余按声明序
  const rowOf = new Map<string, number>();
  const branchOrder = ast.branches.length ? ast.branches.slice() : ['main'];
  if (!branchOrder.includes('main')) branchOrder.unshift('main');
  branchOrder.forEach((b, i) => rowOf.set(b, i));
  const yOf = (b: string): number => TOP + (rowOf.get(b) ?? 0) * ROW_H;
  const colorOf = (b: string): string => {
    const row = rowOf.get(b) ?? 0;
    return row === 0 ? theme.series[0] : theme.series[row % theme.series.length];
  };

  // 分支行标签（放在该分支首个 commit 左侧）
  const firstX = new Map<string, number>();
  ast.commits.forEach((c, i) => {
    if (!firstX.has(c.branch)) firstX.set(c.branch, MARGIN + i * STEP);
  });
  for (const b of branchOrder) {
    if (!firstX.has(b)) continue; // 无 commit 的分支不画
    nodes.push({
      key: `__branch_${b}`, category: 'GitBranchLabel',
      text: b, bold: true,
      loc: `${r1(firstX.get(b)! - 34)} ${r1(yOf(b))}`,
    });
  }

  // commit 点 + 标签
  for (let i = 0; i < ast.commits.length; i++) {
    const c = ast.commits[i];
    const x = MARGIN + i * STEP;
    const y = yOf(c.branch);
    nodes.push({
      key: c.id, category: 'GitDot',
      loc: `${r1(x)} ${r1(y)}`,
      w: DOT, h: DOT,
      fill: colorOf(c.branch),
    });
    const text = c.label ? `${c.id} · ${c.label}` : c.id;
    nodes.push({
      key: `__lbl_${c.id}`, category: 'GitText',
      text, loc: `${r1(x)} ${r1(y + 16)}`,
    });
  }

  // 连线：walk 顺序，维护每分支最后 commit
  const lastOn = new Map<string, string>();
  let prevId: string | null = null;
  for (const c of ast.commits) {
    if (c.type === 'merge') {
      // parents = [当前分支, 被合并分支]：从被合并分支的最后 commit 连回
      const merged = c.parents[1];
      const from: string | null = lastOn.get(merged) ?? lastOn.get(c.parents[0]) ?? prevId;
      if (from && from !== c.id) links.push({ from, to: c.id, kind: 'merge' });
    } else {
      const from = lastOn.get(c.branch) ?? prevId;
      if (from && from !== c.id) links.push({ from, to: c.id, kind: 'branch' });
    }
    lastOn.set(c.branch, c.id);
    prevId = c.id;
  }

  return { nodes, links };
}
