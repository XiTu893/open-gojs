import { describe, it, expect } from 'vitest';
import { parseVenn, isVenn } from '../src/mermaid/parser/venn';
import { mapVenn, vennCenter, VENN_CANVAS_W } from '../src/mermaid/mapper/venn';
import { defaultTheme } from '../src/mermaid/themes';

const DSL = `venn-beta
title 团队重叠
set A["前端"]: 20
set B["后端"]: 16
union A,B["全栈"]: 5`;

function locOf(nodes: { key: string; loc: string }[], key: string): [number, number] {
  const n = nodes.find(x => x.key === key)!;
  expect(n).toBeDefined();
  const [x, y] = n.loc.split(/\s+/).map(Number);
  expect(Number.isFinite(x)).toBe(true);
  expect(Number.isFinite(y)).toBe(true);
  return [x, y];
}

describe('mermaid venn parser', () => {
  it('detects venn', () => {
    expect(isVenn(DSL)).toBe(true);
    expect(isVenn('venn\nset A: 3')).toBe(true);
    expect(isVenn('quadrantChart\npoints: a[0.1,0.2]')).toBe(false);
  });

  it('parses sets and unions', () => {
    const ast = parseVenn(DSL);
    expect(ast.kind).toBe('venn');
    expect(ast.title).toBe('团队重叠');
    expect(ast.sets).toEqual([
      { id: 'A', label: '前端', size: 20 },
      { id: 'B', label: '后端', size: 16 },
    ]);
    expect(ast.unions).toEqual([
      { ids: ['A', 'B'], label: '全栈', size: 5 },
    ]);
  });

  it('tolerates comments, defaults and missing label/size', () => {
    const ast = parseVenn(`%% 注释
venn
set C
set D["丁"]: 4
union C,D: 2
text 忽略我`);
    expect(ast.sets).toEqual([
      { id: 'C', label: undefined, size: 10 },
      { id: 'D', label: '丁', size: 4 },
    ]);
    expect(ast.unions).toEqual([
      { ids: ['C', 'D'], label: undefined, size: 2 },
    ]);
  });
});

describe('mermaid venn mapper', () => {
  it('lays two sets horizontally with radii from √size', () => {
    const m = mapVenn(parseVenn(DSL), defaultTheme);
    const circles = m.nodes.filter(n => n.category === 'VennCircle');
    expect(circles.length).toBe(2);
    const rA = (circles[0].w ?? 0) / 2;
    const rB = (circles[1].w ?? 0) / 2;
    expect(rA).toBeCloseTo(15.5 * Math.sqrt(20), 1);
    expect(rB).toBeCloseTo(15.5 * Math.sqrt(16), 1);
    // loc 为圆包围盒左上角（TopLeft），圆心 = loc + r
    const [ax, ay] = locOf(m.nodes, 'set_A');
    const [bx, by] = locOf(m.nodes, 'set_B');
    expect(ay + rA).toBeCloseTo(by + rB, 1);    // 2 圆水平（圆心同高）
    expect(ax).toBeLessThan(bx);                // A 在左、B 在右
    expect(circles[0].h).toBe(circles[0].w);
    expect(circles[0].fill).toMatch(/^rgba\(/);
    // 相交（圆心距 < rA + rB）
    expect(Math.abs((bx + rB) - (ax + rA))).toBeLessThan(rA + rB);
  });

  it('places set labels outside and union label at the overlap center', () => {
    const m = mapVenn(parseVenn(DSL), defaultTheme);
    const circles = m.nodes.filter(n => n.category === 'VennCircle');
    const rA = (circles[0].w ?? 0) / 2;
    const rB = (circles[1].w ?? 0) / 2;
    const [ax0] = locOf(m.nodes, 'set_A');
    const [bx0] = locOf(m.nodes, 'set_B');
    const ax = ax0 + rA;                        // 圆心
    const bx = bx0 + rB;
    const [lax] = locOf(m.nodes, 'setlbl_A');
    const [lbx] = locOf(m.nodes, 'setlbl_B');
    expect(lax).toBeLessThan(ax - rA);          // A 标签在圆左侧外
    expect(lbx).toBeGreaterThan(bx + rB);       // B 标签在圆右侧外
    const [ux, uy] = locOf(m.nodes, 'union_0');
    expect(ux).toBeCloseTo((ax + bx) / 2, 1);   // 交集中心 = 两圆圆心均值
    expect(uy).toBeCloseTo(vennCenter.cy, 1);
    const union = m.nodes.find(n => n.key === 'union_0')!;
    expect(union.text).toBe('全栈');
  });

  it('falls back to id as label and handles 3-set triangle layout', () => {
    const m = mapVenn(parseVenn('venn\nset X\nset Y\nset Z'), defaultTheme);
    const labels = m.nodes.filter(n => n.category === 'VennLabel').map(n => n.text);
    expect(labels).toEqual(['X', 'Y', 'Z']);
    const circles = m.nodes.filter(n => n.category === 'VennCircle');
    expect(circles.length).toBe(3);
    const ys = circles.map(c => Number(c.loc.split(/\s+/)[1]));
    // 三角布局：一个在上、两个在下
    expect(Math.min(...ys)).toBeLessThan(Math.max(...ys));
    for (const c of m.nodes) {
      const [x, y] = c.loc.split(/\s+/).map(Number);
      expect(x).toBeGreaterThan(-200);
      expect(x).toBeLessThan(VENN_CANVAS_W + 200);
      expect(y).toBeGreaterThan(-200);
    }
  });
});
