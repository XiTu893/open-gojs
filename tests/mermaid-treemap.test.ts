import { describe, it, expect } from 'vitest';
import { parseTreemap, isTreemap } from '../extension/mermaid/parser/treemap';
import { mapTreemap } from '../extension/mermaid/mapper/treemap';

describe('mermaid treemap parser', () => {
  it('detects treemap-beta by header', () => {
    expect(isTreemap('treemap-beta\n  "a": 1')).toBe(true);
    expect(isTreemap('TREEMAP-BETA\na')).toBe(true);
    expect(isTreemap('mindmap\n  a')).toBe(false);
    expect(isTreemap('treemap')).toBe(false);
  });

  it('parses branches and leaf values', () => {
    const ast = parseTreemap(`treemap-beta
  "Section 1"
    "Leaf 1.1": 12
    "Leaf 1.2": 8
  "Section 2"
    "Leaf 2.1": 20`);
    expect(ast.kind).toBe('treemap');
    expect(ast.nodes.length).toBe(5);
    expect(ast.nodes[0]).toEqual({ depth: 0, text: 'Section 1' });
    expect(ast.nodes[0].value).toBeUndefined(); // 分支无 value
    expect(ast.nodes[1]).toEqual({ depth: 1, text: 'Leaf 1.1', value: 12 });
    expect(ast.nodes[2].value).toBe(8);
    expect(ast.nodes[4]).toEqual({ depth: 1, text: 'Leaf 2.1', value: 20 });
  });

  it('tolerates unquoted names, comments, decimals', () => {
    const ast = parseTreemap(`treemap-beta
%% comment
  Root
    A: 1.5
    B`);
    expect(ast.nodes.length).toBe(3);
    expect(ast.nodes[0].text).toBe('Root');
    expect(ast.nodes[1]).toEqual({ depth: 1, text: 'A', value: 1.5 });
    expect(ast.nodes[2].value).toBeUndefined();
  });

  it('never throws on garbage', () => {
    const ast = parseTreemap('treemap-beta\n  :::\n  "": 3');
    expect(ast.kind).toBe('treemap');
  });
});

describe('mermaid treemap mapper', () => {
  const ast = parseTreemap(`treemap-beta
  "Section 1"
    "Leaf 1.1": 12
    "Leaf 1.2": 8
  "Section 2"
    "Leaf 2.1": 20`);

  it('fills canvas with nested cells', () => {
    const { nodes } = mapTreemap(ast);
    expect(nodes.length).toBe(5);
    const s1 = nodes[0];
    expect(s1.loc).toBe('0 0'); // 首个顶层块贴画布左上
    expect(s1.w).toBeGreaterThan(0);
    expect(s1.h).toBeGreaterThan(0);
    expect(s1.isLeaf).toBe(false);
    expect(s1.value).toBe(20); // 12+8
    expect(s1.text).toBe('Section 1');
  });

  it('siblings split parent horizontally without overlap', () => {
    const { nodes } = mapTreemap(ast);
    const s1 = nodes.find((n) => n.text === 'Section 1')!;
    const s2 = nodes.find((n) => n.text === 'Section 2')!;
    const x1 = parseFloat(s1.loc.split(' ')[0]);
    const x2 = parseFloat(s2.loc.split(' ')[0]);
    expect(x1 + s1.w).toBeLessThanOrEqual(x2 + 1); // 不重叠
    expect(s1.value).toBe(20); // 12+8
    expect(s2.value).toBe(20);
  });

  it('leaves carry value text and series fill', () => {
    const { nodes } = mapTreemap(ast);
    const leaf = nodes.find((n) => n.isLeaf)!;
    expect(leaf.text).toMatch(/\(\d+(\.\d+)?\)$/);
    expect(leaf.fill).not.toBe('#ffffff'); // series 轮换色
    expect(leaf.textCol === '#000000' || leaf.textCol === '#ffffff').toBe(true);
  });

  it('defaults missing value to 1', () => {
    const t = parseTreemap('treemap-beta\n  A\n    B');
    const { nodes } = mapTreemap(t);
    const leafB = nodes.find((n) => n.text === 'B')!;
    expect(leafB.value).toBe(1);
  });
});
