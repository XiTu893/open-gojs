import { describe, it, expect } from 'vitest';
import { parseIshikawa, isIshikawa } from '../extension/mermaid/parser/ishikawa';
import { mapIshikawa } from '../extension/mermaid/mapper/ishikawa';

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

  const by = (nodes: { category: string }[], c: string) => nodes.filter((n) => n.category === c);
  const close = (a: number, b: number, tol = 0.05) => Math.abs(a - b) <= tol;

  it('emits spine, head, bones, labels per official layout', () => {
    const { nodes } = mapIshikawa(ast);
    // 骨线：脊线 + 2 斜骨 + 3 水平子因线 = 6 个 Bone；鱼头 path 1
    expect(by(nodes, 'Bone').length).toBe(6);
    expect(by(nodes, 'Head').length).toBe(1);
    expect(by(nodes, 'HeadLabel').length).toBe(1);
    expect(by(nodes, 'CatLabel').length).toBe(2);
    expect(by(nodes, 'CauseLabel').length).toBe(3);
    expect(by(nodes, 'HeadLabel')[0].text).toBe('Website\nOutage');
  });

  it('spine sits at official y=C=333.33 spanning leftmost text to x=0', () => {
    const { nodes } = mapIshikawa(ast);
    const spine = nodes.find((n) => n.key === 'spine')!;
    // loc = min 角 = (最左文字 x, C)；geo 局部 `M 0 0 L (0-wCur) 0`
    const loc = spine.loc.split(' ').map(parseFloat);
    expect(close(loc[1], 333.333)).toBe(true); // y = C
    const m = /L\s+(-?[\d.]+)/.exec(spine.geo!)!;
    // 最左文字 = 上侧倒序子因 "Server Crash"（A=-80.927，宽度>0）→ spine x1 < -80
    expect(loc[0]).toBeLessThan(-80);
    // 右端绝对 x = loc[0] + 局部跨度 = 0
    expect(close(loc[0] + parseFloat(m[1]), 0)).toBe(true);
  });

  it('even category (Infrastructure) branches up with official tip', () => {
    const { nodes } = mapIshikawa(ast);
    const bone = nodes.find((n) => n.category === 'Bone' && /c-1_/.test(n.key))!;
    // geo 局部坐标（min 角在 0,0），loc = min 角 = (min(x0,tipX), min(y0,tipY))
    const loc = bone.loc.split(' ').map(parseFloat);
    expect(close(loc[0], -66.391)).toBe(true); // min x
    expect(close(loc[1], 3.244)).toBe(true);   // min y = tip y
    // 绝对 tip = loc + 局部终点
    const m = /M\s+(-?[\d.]+)\s+(-?[\d.]+)\s+L\s+(-?[\d.]+)\s+(-?[\d.]+)/.exec(bone.geo!)!;
    expect(close(loc[0] + parseFloat(m[3]), -66.391)).toBe(true); // tip x
    expect(close(loc[1] + parseFloat(m[4]), 3.244)).toBe(true);   // tip y
  });

  it('odd category (Code) branches down with official tip', () => {
    const { nodes } = mapIshikawa(ast);
    const bone = nodes.find((n) => n.category === 'Bone' && /c1_/.test(n.key))!;
    const loc = bone.loc.split(' ').map(parseFloat);
    const m = /M\s+(-?[\d.]+)\s+(-?[\d.]+)\s+L\s+(-?[\d.]+)\s+(-?[\d.]+)/.exec(bone.geo!)!;
    expect(close(loc[0] + parseFloat(m[3]), -43.196)).toBe(true); // tip x
    expect(close(loc[1] + parseFloat(m[4]), 498.378)).toBe(true); // tip y
  });

  it('up-side causes reversed: first DSL cause farthest from spine', () => {
    const { nodes } = mapIshikawa(ast);
    const subs = nodes.filter((n) => n.category === 'Bone' && /sub_c-1_/.test(n.key));
    const labels = nodes
      .filter((n) => n.category === 'CauseLabel' && /cause_c-1_/.test(n.key))
      .map((n) => n.text);
    // 上侧倒序：Network Failure 更近脊线(y 大)，Server Crash 更远(y 小)
    expect(labels).toEqual(['Network Failure', 'Server Crash']);
    // 子因水平线：loc = (A, y)，geo 局部 `M 0 0 L 30 0`（N-A=30）
    const s0 = subs[0];
    const loc0 = s0.loc.split(' ').map(parseFloat);
    expect(close(loc0[0], -65.464)).toBe(true); // A x（第一子因）
    expect(close(loc0[1], 223.303)).toBe(true); // y
    const m0 = /M\s+(-?[\d.]+)/.exec(s0.geo!)!;
    expect(close(parseFloat(m0[1]), 30)).toBe(true); // N-A=30（局部 M 端在 x=30，A 端在 x=0）
  });

  it('down-side cause stays in source order', () => {
    const { nodes } = mapIshikawa(ast);
    const labels = nodes
      .filter((n) => n.category === 'CauseLabel' && /cause_c1_/.test(n.key))
      .map((n) => n.text);
    // 官方 G7t: 15 字符贪心换行 → "Bug in\nDeployment"（"Network Failure"=15 不换）
    expect(labels).toEqual(['Bug in\nDeployment']);
    const lab = nodes.find((n) => n.category === 'CauseLabel' && /cause_c1_/.test(n.key))!;
    expect(close(parseFloat(lab.loc.split(' ')[1]), 415.856)).toBe(true); // 子因 y
  });

  it('head path uses official d=60 f≈105.6 and label at d/2+3', () => {
    const { nodes } = mapIshikawa(ast);
    const head = nodes.find((n) => n.category === 'Head')!;
    // "Website Outage" wrap 11 → 2 行，d=max(60, w+6)=60, f=max(40, 2*32.8+40)=105.6
    const m = /Q\s+(-?[\d.]+)/.exec(head.geo!)!;
    expect(close(parseFloat(m[1]), 144)).toBe(true); // 2.4d = 144
    const hl = nodes.find((n) => n.category === 'HeadLabel')!;
    expect(close(parseFloat(hl.loc.split(' ')[0]), 33)).toBe(true); // d/2+3=33
    expect(close(parseFloat(hl.loc.split(' ')[1]), 333.333)).toBe(true); // y=C
  });

  it('returns minimal nodes for empty problem/categories without throw', () => {
    const { nodes } = mapIshikawa({ kind: 'ishikawa', problem: '', categories: [] });
    // 退化脊线 + 鱼头 path + 鱼头标签
    expect(by(nodes, 'Bone').length).toBe(1);
    expect(by(nodes, 'Head').length).toBe(1);
    expect(by(nodes, 'HeadLabel').length).toBe(1);
  });
});