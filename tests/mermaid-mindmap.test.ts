import { describe, it, expect } from 'vitest';
import { parseMindmap, isMindmap } from '../extension/mermaid/parser/mindmap';
import { mapMindmap } from '../extension/mermaid/mapper/mindmap';

describe('mermaid mindmap parser', () => {
  it('detects mindmap by header', () => {
    expect(isMindmap('mindmap\n  root((x))')).toBe(true);
    expect(isMindmap('  mindmap')).toBe(false); // 首行有缩进不算头
    expect(isMindmap('flowchart TD\nA-->B')).toBe(false);
    expect(isMindmap('mindmap')).toBe(true);
  });

  it('parses typical mindmap with shapes and depths', () => {
    const ast = parseMindmap(`mindmap
  root((mindmap))
    Origins
      Long history
      Research
    Shapes
      [(rectangle)]
      ((circle))`);
    expect(ast.kind).toBe('mindmap');
    expect(ast.nodes.length).toBe(7);
    expect(ast.nodes[0]).toEqual({ depth: 0, text: 'mindmap', shape: 'root' });
    expect(ast.nodes[1]).toEqual({ depth: 1, text: 'Origins', shape: 'rounded' });
    expect(ast.nodes[2].depth).toBe(2);
    expect(ast.nodes[2].text).toBe('Long history');
    expect(ast.nodes[5]).toEqual({ depth: 2, text: '(rectangle)', shape: 'square' });
    expect(ast.nodes[6]).toEqual({ depth: 2, text: 'circle', shape: 'circle' });
  });

  it('tolerates comments, tabs, hexagon and plain-text root', () => {
    const ast = parseMindmap(`mindmap
%% comment
\troot
\t\t{{decision}}
\t\tB
\t\t\t(c)`);
    // 注释被跳过；tab 缩进；4 个内容节点
    expect(ast.nodes.length).toBe(4);
    expect(ast.nodes[0].text).toBe('root');
    expect(ast.nodes[0].shape).toBe('root');
    expect(ast.nodes[1]).toEqual({ depth: 1, text: 'decision', shape: 'hexagon' });
    expect(ast.nodes[3]).toEqual({ depth: 2, text: 'c', shape: 'rounded' });
  });

  it('never throws on garbage input', () => {
    const ast = parseMindmap('mindmap\n\n   \n((broken');
    expect(ast.kind).toBe('mindmap');
    expect(ast.nodes.length).toBeGreaterThanOrEqual(0);
  });
});

describe('mermaid mindmap mapper', () => {
  it('assigns coordinates layer by layer', () => {
    const ast = parseMindmap(`mindmap
  root((mindmap))
    A
      A1
      A2
    B`);
    const { nodes, links } = mapMindmap(ast);
    expect(nodes.length).toBe(5);
    expect(links.length).toBe(4);
    const [root, a, a1, a2, b] = nodes;
    const rx = parseFloat(root.loc.split(' ')[0]);
    const ax = parseFloat(a.loc.split(' ')[0]);
    const a1x = parseFloat(a1.loc.split(' ')[0]);
    expect(ax).toBeGreaterThan(rx);   // 子在父右侧
    expect(a1x).toBeGreaterThan(ax);  // 孙更右
    const ys = [a, a2, b].map((n) => parseFloat(n.loc.split(' ')[1]));
    expect(new Set(ys).size).toBe(3); // 叶子 y 不重叠
  });

  it('root is vertically centered among children and uses theme series color', () => {
    const ast = parseMindmap('mindmap\n  root\n    A\n    B\n    C');
    const { nodes } = mapMindmap(ast);
    const root = nodes[0];
    const yOf = (t: string) => parseFloat(nodes.find((n) => n.text === t)!.loc.split(' ')[1]);
    expect(parseFloat(root.loc.split(' ')[1])).toBeCloseTo((yOf('A') + yOf('C')) / 2, 0);
    expect(root.fill).not.toBe('#ffffff'); // 根用 series 色
    expect(root.category).toBe('root');
  });

  it('returns empty for empty ast', () => {
    const { nodes, links } = mapMindmap({ kind: 'mindmap', nodes: [] });
    expect(nodes.length).toBe(0);
    expect(links.length).toBe(0);
  });
});
