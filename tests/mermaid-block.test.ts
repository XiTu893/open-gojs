import { describe, it, expect } from 'vitest';
import { parseBlock, isBlock } from '../extension/mermaid/parser/block';
import { mapBlock } from '../extension/mermaid/mapper/block';

describe('block-beta', () => {
  it('isBlock 识别头行', () => {
    expect(isBlock('block-beta\ncolumns 2\na b')).toBe(true);
    expect(isBlock('block\na b')).toBe(true);
    expect(isBlock('flowchart TD\na-->b')).toBe(false);
  });

  it('解析列数/形状/边（含标签）', () => {
    const ast = parseBlock(`
block-beta
columns 3
a["A"] b("B") c[("C")]
d(("D")) e{"E"} f[["F"]]
a -- go --> d
b --- e
`);
    expect(ast.kind).toBe('block');
    expect(ast.columns).toBe(3);
    expect(ast.cells).toHaveLength(6);
    expect(ast.cells[0]).toEqual({ id: 'a', label: 'A', shape: 'process' });
    expect(ast.cells[1]).toEqual({ id: 'b', label: 'B', shape: 'stadium' });
    expect(ast.cells[2]).toEqual({ id: 'c', label: 'C', shape: 'cylinder' });
    expect(ast.cells[3]).toEqual({ id: 'd', label: 'D', shape: 'circle' });
    expect(ast.cells[4]).toEqual({ id: 'e', label: 'E', shape: 'diamond' });
    expect(ast.cells[5]).toEqual({ id: 'f', label: 'F', shape: 'subroutine' });
    expect(ast.edges).toEqual([
      { from: 'a', to: 'd', arrow: true, label: 'go' },
      { from: 'b', to: 'e', arrow: false },
    ]);
  });

  it('解析 span/space 占位与嵌套组（含组前 space）', () => {
    const ast = parseBlock(`
block-beta
columns 2
a["A"] space
g1["组"] {
  b
  c
}
outer {
  x
  inner {
    y
  }
}
`);
    // cells：a(0) space(1) b(2) c(3) x(4) y(5) —— 组开/闭不占 cell
    expect(ast.cells.filter(c => !c.space)).toHaveLength(5);
    expect(ast.cells[1]).toEqual({ space: 1 });
    const g1 = ast.groups.find(g => g.id === 'g1')!;
    expect(g1).toEqual({ id: 'g1', label: '组', start: 2, end: 4 });
    const inner = ast.groups.find(g => g.id === 'inner')!;
    expect(inner.start).toBe(5);
    expect(inner.end).toBe(6);
    const outer = ast.groups.find(g => g.id === 'outer')!;
    expect(outer.start).toBe(4);
    expect(outer.end).toBe(6);
  });

  it('mapper：网格按序填格（span 占宽、space 跳过），shape 映射 figure', () => {
    const ast = parseBlock(`
block-beta
columns 3
a["A"] b("B") c[("C")]
d(("D")) e{"E"} f[["F"]]
`);
    const { nodes, links } = mapBlock(ast);
    expect(links).toHaveLength(0);
    const byKey = new Map(nodes.map(n => [n.key, n]));
    expect(byKey.get('a')!.figure).toBe('Rectangle');
    expect(byKey.get('b')!.figure).toBe('RoundedRectangle');
    expect(byKey.get('b')!.param).toBeGreaterThan(0);
    expect(byKey.get('c')!.figure).toBe('Cylinder1');
    expect(byKey.get('d')!.figure).toBe('Ellipse');
    expect(byKey.get('e')!.figure).toBe('Diamond');
    expect(byKey.get('f')!.figure).toBe('Subroutine');
    for (const n of nodes) {
      expect(n.loc).toMatch(/^-?\d+ -?\d+$/);
      expect(n.w).toBeGreaterThan(0);
      expect(n.h).toBeGreaterThan(0);
      expect(n.fill).toBe('#00A6ED');
      expect(n.stroke).toBe('#0077B6');
    }
    const xy = (k: string) => byKey.get(k)!.loc.split(' ').map(Number);
    // 3 列网格：a b c 同一行（y 相同），d/e/f 第二行（y 更大）；同列 x 相同
    expect(xy('a')[1]).toBe(xy('b')[1]);
    expect(xy('b')[1]).toBe(xy('c')[1]);
    expect(xy('d')[1]).toBeGreaterThan(xy('a')[1]);
    expect(xy('a')[0]).toBeLessThan(xy('b')[0]);
    expect(xy('b')[0]).toBeLessThan(xy('c')[0]);
    // 同列上下对齐
    expect(xy('a')[0]).toBe(xy('d')[0]);
  });

  it('mapper：group 包围盒含全部成员（组前有 space 也不丢成员），连线带标签', () => {
    const ast = parseBlock(`
block-beta
columns 2
a["A"] space
g1 {
  b["B"]
  c["C"]
}
d["D"]
b -- go --> c
x --> ghost
`);
    const { nodes, links } = mapBlock(ast);
    const g1 = nodes.find(n => n.key === 'g1')!;
    expect(g1.category).toBe('GroupBox');
    expect(g1.members).toEqual(['b', 'c']);
    // 组盒包围成员
    const [gx, gy] = g1.loc.split(' ').map(Number);
    for (const m of g1.members!) {
      const n = nodes.find(x => x.key === m)!;
      const [x, y] = n.loc.split(' ').map(Number);
      expect(x).toBeGreaterThanOrEqual(gx);
      expect(y).toBeGreaterThanOrEqual(gy);
      expect(x + n.w).toBeLessThanOrEqual(gx + g1.w);
      expect(y + n.h).toBeLessThanOrEqual(gy + g1.h);
    }
    // 已知端点连线保留 + 标签；未知端点丢弃
    expect(links).toHaveLength(1);
    expect(links[0]).toEqual({ from: 'b', to: 'c', arrow: true, label: 'go' });
  });

  it('mapper：无 columns 时取首行块数；注释与未知行容错', () => {
    const ast = parseBlock(`
block-beta
%% 注释行
a b
c d
`);
    expect(ast.columns).toBe(2);
    const { nodes } = mapBlock(ast);
    expect(nodes).toHaveLength(4);
  });
});
