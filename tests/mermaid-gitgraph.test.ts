import { describe, it, expect } from 'vitest';
import { parseGitGraph, isGitGraph } from '../extension/mermaid/parser/gitgraph';
import { mapGitGraph } from '../extension/mermaid/mapper/gitgraph';
import { defaultTheme } from '../extension/mermaid/themes';

describe('mermaid gitgraph parser', () => {
  it('detects gitGraph header', () => {
    expect(isGitGraph('gitGraph\ncommit')).toBe(true);
    expect(isGitGraph('gitgraph\ncommit')).toBe(true);
    expect(isGitGraph('flowchart TD\nA-->B')).toBe(false);
  });

  it('parses typical commits, branches, checkout and merge', () => {
    const ast = parseGitGraph(`gitGraph
  commit id:"A"
  commit id:"B" tag:"v1.0"
  branch dev
  checkout dev
  commit id:"C" label:"开发中"
  checkout main
  commit id:"D"
  merge dev`);
    expect(ast.kind).toBe('gitgraph');
    expect(ast.branches).toEqual(['main', 'dev']);
    expect(ast.commits.map(c => c.id)).toEqual(['A', 'B', 'C', 'D', 'M4']);
    expect(ast.commits[0].branch).toBe('main');
    expect(ast.commits[2].branch).toBe('dev');
    expect(ast.commits[2].label).toBe('开发中');
    expect(ast.commits[3].branch).toBe('main');
    const merge = ast.commits[4];
    expect(merge.type).toBe('merge');
    expect(merge.branch).toBe('main');
    expect(merge.parents).toEqual(['main', 'dev']);
  });

  it('tolerates comments, auto ids and unknown lines', () => {
    const ast = parseGitGraph(`%% a comment
gitGraph
  direction BT
  commit
  nonsense line
  commit id:"X"
  commit
  branch feature
  checkout feature
  commit id:"Y" shortid:"abc"`);
    expect(ast.commits.length).toBe(4);
    expect(ast.commits[0].id).toBe('C0');
    expect(ast.commits[1].id).toBe('X');
    expect(ast.commits[2].id).not.toBe('C0'); // 自动 id 去重
    expect(ast.commits[3].id).toBe('Y');
    expect(ast.commits[3].branch).toBe('feature');
    expect(ast.branches).toEqual(['main', 'feature']);
  });
});

describe('mermaid gitgraph mapper', () => {
  const ast = parseGitGraph(`gitGraph
  commit id:"A"
  commit id:"B"
  branch dev
  checkout dev
  commit id:"C"
  checkout main
  commit id:"D"
  merge dev`);

  it('lays commits left-to-right and branches on separate rows', () => {
    const { nodes } = mapGitGraph(ast, defaultTheme);
    const dots = nodes.filter(n => n.category === 'GitCommit');
    expect(dots.length).toBe(5);
    const locs = dots.map(d => d.loc.split(' ').map(Number));
    // x 严格递增（时间轴）
    for (let i = 1; i < locs.length; i++) {
      expect(locs[i][0]).toBeGreaterThan(locs[i - 1][0]);
    }
    // dev 分支行 y 不同于 main 行
    const yA = locs[0][1];
    const yC = locs[2][1];
    const yD = locs[3][1];
    expect(yC).not.toBe(yA);
    expect(yD).toBe(yA); // checkout main 后回到主行
    // 主分支点使用 series[0]，分支点使用其它轮换色
    expect(dots[0].fill).toBe(defaultTheme.series[0]);
    expect(dots[2].fill).not.toBe(defaultTheme.series[0]);
  });

  it('generates branch and merge links between commit keys', () => {
    const { links } = mapGitGraph(ast, defaultTheme);
    const branchLinks = links.filter(l => l.kind === 'branch');
    const mergeLinks = links.filter(l => l.kind === 'merge');
    // A→B、B→D（main 主干）、B→C（fork）
    expect(branchLinks).toContainEqual({ from: 'A', to: 'B', kind: 'branch' });
    expect(branchLinks).toContainEqual({ from: 'B', to: 'D', kind: 'branch' });
    expect(branchLinks).toContainEqual({ from: 'B', to: 'C', kind: 'branch' });
    // merge：C(dev 最后) → M4
    expect(mergeLinks).toEqual([{ from: 'C', to: 'M4', kind: 'merge' }]);
  });

  it('emits branch labels and text labels', () => {
    const { nodes } = mapGitGraph(ast, defaultTheme);
    const labels = nodes.filter(n => n.category === 'GitBranchLabel');
    expect(labels.map(l => l.text).sort()).toEqual(['dev', 'main']);
    // 现行设计：commit 文本合并进 GitCommit 节点（圆点 + 下方 id·label）
    const texts = nodes.filter(n => n.category === 'GitCommit' && !!n.text);
    expect(texts.length).toBe(5);
  });
});
