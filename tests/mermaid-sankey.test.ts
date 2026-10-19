import { describe, it, expect } from 'vitest';
import { parseSankey, isSankey, SankeyAST } from '../src/mermaid/parser/sankey';
import { mapSankey, SANKEY_W, SANKEY_H } from '../src/mermaid/mapper/sankey';
import { defaultTheme } from '../src/mermaid/themes';

/** 从 mapper 输出中取节点竖条位置 */
function barOf(nodes: { key: string; category: string; loc: string; h?: number }[], id: string) {
  const n = nodes.find(x => x.category === 'SankeyNode' && x.key === id);
  expect(n).toBeDefined();
  const [x, y] = n!.loc.split(' ').map(Number);
  return { x, y, h: n!.h ?? 0 };
}

describe('mermaid sankey parser', () => {
  it('detects sankey header', () => {
    expect(isSankey('sankey-beta\nA,B,10')).toBe(true);
    expect(isSankey('sankey\nA,B,10')).toBe(true);
    expect(isSankey('gitGraph\ncommit')).toBe(false);
  });

  it('parses CSV data lines into nodes and links', () => {
    const ast = parseSankey(`sankey-beta
A,B,10
A,C,5
B,C,8
B,D,12`);
    expect(ast.kind).toBe('sankey');
    expect(ast.nodes.map(n => n.id)).toEqual(['A', 'B', 'C', 'D']);
    expect(ast.links).toEqual([
      { source: 'A', target: 'B', value: 10 },
      { source: 'A', target: 'C', value: 5 },
      { source: 'B', target: 'C', value: 8 },
      { source: 'B', target: 'D', value: 12 },
    ]);
  });

  it('supports label definition lines, quoted fields and tolerance', () => {
    const ast = parseSankey(`%% comment
sankey-beta
A["来源甲"],B,10
"带,逗号",C,3.5
B["乙"],D,not-a-number
X["孤立"]`);
    expect(ast.nodes.find(n => n.id === 'A')?.label).toBe('来源甲');
    expect(ast.nodes.find(n => n.id === 'B')?.label).toBe('乙');
    expect(ast.nodes.find(n => n.id === '带,逗号')?.label).toBeUndefined();
    expect(ast.links.length).toBe(2); // 非法数值行被忽略
    expect(ast.links[1].value).toBe(3.5);
    expect(ast.nodes.map(n => n.id)).toContain('X'); // 定义行也可引入节点
  });
});

describe('mermaid sankey mapper', () => {
  const ast: SankeyAST = parseSankey(`sankey-beta
A,B,10
A,C,5
B,C,8
B,D,12`);

  it('assigns topological layers (sources at layer 0)', () => {
    const { nodes } = mapSankey(ast, defaultTheme);
    const a = barOf(nodes, 'A');
    const b = barOf(nodes, 'B');
    const c = barOf(nodes, 'C');
    const d = barOf(nodes, 'D');
    expect(a.x).toBeLessThan(b.x);   // A→B：A 在更左层
    expect(b.x).toBeLessThan(c.x);   // B→C
    expect(a.x).toBeLessThan(c.x);
    expect(b.x).toBeLessThan(d.x);
  });

  it('computes node heights from flow volume', () => {
    const { nodes } = mapSankey(ast, defaultTheme);
    const a = barOf(nodes, 'A'); // 出流量 15
    const d = barOf(nodes, 'D'); // 入流量 12
    expect(a.h).toBeGreaterThan(0);
    expect(d.h).toBeGreaterThan(0);
    expect(a.h / d.h).toBeCloseTo(15 / 12, 1);
    // 每层总高 ≤ 画布（分层 sankey 的正确约束：节点不越出画布底）
    for (const n of nodes.filter(n => n.category === 'SankeyNode')) {
      const [, y] = n.loc.split(' ').map(Number);
      expect(y + (n.h ?? 0)).toBeLessThanOrEqual(SANKEY_H);
    }
  });

  it('emits one filled geometry band per link, within canvas', () => {
    const { nodes } = mapSankey(ast, defaultTheme);
    const flows = nodes.filter(n => n.category === 'SankeyFlow');
    expect(flows.length).toBe(ast.links.length);
    for (const f of flows) {
      expect(f.loc).toBe('0 0');
      expect(f.geom).toMatch(/^M [\d.-]+ [\d.-]+ C /);
      expect(f.geom).toMatch(/ Z$/);
      // 带状区域 x 坐标在画布范围内
      const xs = (f.geom!.match(/[\d.-]+/g) ?? []).map(Number);
      expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
      expect(Math.max(...xs)).toBeLessThanOrEqual(SANKEY_W);
    }
  });

  it('does not overlap nodes in the same layer', () => {
    const { nodes } = mapSankey(ast, defaultTheme);
    const c = barOf(nodes, 'C');
    const d = barOf(nodes, 'D');
    expect(c.x).toBe(d.x); // C、D 同层（layer 2）
    const overlap = c.y < d.y + d.h && d.y < c.y + c.h;
    expect(overlap).toBe(false);
  });
});
