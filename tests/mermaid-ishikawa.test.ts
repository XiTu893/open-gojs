import { describe, it, expect } from 'vitest';
import { parseIshikawa, isIshikawa } from '../src/mermaid/parser/ishikawa';
import { mapIshikawa } from '../src/mermaid/mapper/ishikawa';

describe('mermaid ishikawa parser', () => {
  it('detects ishikawa-beta by header', () => {
    expect(isIshikawa('ishikawa-beta\nProblem')).toBe(true);
    expect(isIshikawa('ISHIKAWA-BETA\nP')).toBe(true);
    expect(isIshikawa('mindmap\n  a')).toBe(false);
    expect(isIshikawa('ishikawa')).toBe(false);
  });

  it('parses problem, categories and causes', () => {
    const ast = parseIshikawa(`ishikawa-beta
Website Outage
Infrastructure
  Server Crash
  Network Failure
Code
  Bug in Deployment`);
    expect(ast.kind).toBe('ishikawa');
    expect(ast.problem).toBe('Website Outage');
    expect(ast.categories.length).toBe(2);
    expect(ast.categories[0].name).toBe('Infrastructure');
    expect(ast.categories[0].causes).toEqual(['Server Crash', 'Network Failure']);
    expect(ast.categories[1].name).toBe('Code');
    expect(ast.categories[1].causes).toEqual(['Bug in Deployment']);
  });

  it('tolerates comments, blank lines and tab indent', () => {
    const ast = parseIshikawa(`ishikawa-beta
%% header comment
Problem X

Cat A
\tcause1
\tcause2
Cat B`);
    expect(ast.problem).toBe('Problem X');
    expect(ast.categories.length).toBe(2);
    expect(ast.categories[0].causes).toEqual(['cause1', 'cause2']);
    expect(ast.categories[1].causes).toEqual([]); // 无原因的类别也保留
  });

  it('indented lines before any category are ignored (no throw)', () => {
    const ast = parseIshikawa('ishikawa-beta\n  orphan cause\nProblem\nCat\n  c1');
    expect(ast.problem).toBe('Problem');
    expect(ast.categories.length).toBe(1);
    expect(ast.categories[0].causes).toEqual(['c1']);
  });
});

describe('mermaid ishikawa mapper', () => {
  const ast = parseIshikawa(`ishikawa-beta
Website Outage
Infrastructure
  Server Crash
  Network Failure
Code
  Bug in Deployment`);

  it('emits spine, problem, bones, categories and causes', () => {
    const { nodes } = mapIshikawa(ast);
    const by = (c: string) => nodes.filter((n) => n.category === c);
    expect(by('Bone').length).toBe(3);     // 脊线 + 2 斜骨
    expect(by('Problem').length).toBe(1);
    expect(by('Category').length).toBe(2);
    expect(by('Cause').length).toBe(3);
    expect(by('Problem')[0].text).toBe('Website Outage');
  });

  it('problem sits at right end of spine', () => {
    const { nodes } = mapIshikawa(ast);
    const spine = nodes.find((n) => n.key === 'spine')!;
    const problem = nodes.find((n) => n.key === 'problem')!;
    // 脊线几何终点 x = 720；鱼头中心在其右侧
    const m = /M\s+\d+\s+\d+\s+L\s+(\d+)/.exec(spine.geo!)!;
    expect(parseFloat(problem.loc.split(' ')[0])).toBeGreaterThan(parseFloat(m[1]));
  });

  it('categories alternate above and below the spine', () => {
    const { nodes } = mapIshikawa(ast);
    const cat0 = nodes.find((n) => n.key === 'cat_0')!;
    const cat1 = nodes.find((n) => n.key === 'cat_1')!;
    const mid = 340;
    const y0 = parseFloat(cat0.loc.split(' ')[1]);
    const y1 = parseFloat(cat1.loc.split(' ')[1]);
    expect(y0).toBeLessThan(mid); // 第 1 类在上
    expect(y1).toBeGreaterThan(mid); // 第 2 类在下
  });

  it('returns empty-ish for empty problem/categories without throw', () => {
    const { nodes } = mapIshikawa({ kind: 'ishikawa', problem: '', categories: [] });
    expect(nodes.length).toBe(1); // 只有脊线
    expect(nodes[0].category).toBe('Bone');
  });
});
