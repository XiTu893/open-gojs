import { describe, it, expect } from 'vitest';
import { parseQuadrant, isQuadrant } from '../src/mermaid/parser/quadrant';
import { mapQuadrant, quadrantPlot, Q_CANVAS_W, Q_CANVAS_H } from '../src/mermaid/mapper/quadrant';
import { defaultTheme } from '../src/mermaid/themes';

const DSL = `quadrantChart
title 团队能力矩阵
x-axis 低技能 --> 高技能
y-axis 低影响 --> 高影响
quadrant-1 重点培养
quadrant-2 核心骨干
quadrant-3 待观察
quadrant-4 潜力新星
points: 张三[0.3, 0.7], 李四[0.8, 0.8], 王五["算法专家"][0.6, 0.4]`;

function locOf(nodes: { key: string; loc: string }[], key: string): [number, number] {
  const n = nodes.find(x => x.key === key)!;
  expect(n).toBeDefined();
  const [x, y] = n.loc.split(/\s+/).map(Number);
  expect(Number.isFinite(x)).toBe(true);
  expect(Number.isFinite(y)).toBe(true);
  return [x, y];
}

describe('mermaid quadrantChart parser', () => {
  it('detects quadrantChart', () => {
    expect(isQuadrant(DSL)).toBe(true);
    expect(isQuadrant('quadrantChart\nx-axis a --> b')).toBe(true);
    expect(isQuadrant('xychart-beta\nbar [1]')).toBe(false);
  });

  it('parses axes, quadrants and both point forms', () => {
    const ast = parseQuadrant(DSL);
    expect(ast.kind).toBe('quadrant');
    expect(ast.title).toBe('团队能力矩阵');
    expect(ast.xAxis).toEqual({ low: '低技能', high: '高技能' });
    expect(ast.yAxis).toEqual({ low: '低影响', high: '高影响' });
    expect(ast.quadrants).toEqual(['重点培养', '核心骨干', '待观察', '潜力新星']);
    expect(ast.points.length).toBe(3);
    expect(ast.points[0]).toEqual({ label: '张三', x: 0.3, y: 0.7 });
    expect(ast.points[1]).toEqual({ label: '李四', x: 0.8, y: 0.8 });
    // id["标签"][x,y] → 取引号文本为 label
    expect(ast.points[2]).toEqual({ label: '算法专家', x: 0.6, y: 0.4 });
  });

  it('tolerates comments, unknown lines and prefix-less points', () => {
    const ast = parseQuadrant(`%%{init: {'theme':'base'}}%%
quadrantChart
这里是一行未知指令
x-axis Low
points
A[0.1, 0.2], B["点B"][0.9, 0.1]
C: [0.5, 0.5]`);
    expect(ast.points.length).toBe(3);
    expect(ast.points[0]).toEqual({ label: 'A', x: 0.1, y: 0.2 });
    expect(ast.points[1]).toEqual({ label: '点B', x: 0.9, y: 0.1 });
    expect(ast.points[2]).toEqual({ label: 'C', x: 0.5, y: 0.5 });
    // 只有低端的 x 轴容错
    expect(ast.xAxis).toEqual({ low: 'Low', high: '' });
    expect(ast.quadrants).toEqual(['', '', '', '']);
  });
});

describe('mermaid quadrantChart mapper', () => {
  it('flips y and keeps points inside the plot', () => {
    const ast = parseQuadrant(DSL);
    const m = mapQuadrant(ast, defaultTheme);
    const [x0, y0] = locOf(m.nodes, 'pt_0');
    const [x1, y1] = locOf(m.nodes, 'pt_1');
    expect(x0).toBeCloseTo(quadrantPlot.x0 + 0.3 * quadrantPlot.w, 1);
    expect(y0).toBeCloseTo(quadrantPlot.y1 - 0.7 * quadrantPlot.h, 1);
    expect(x1).toBeCloseTo(quadrantPlot.x0 + 0.8 * quadrantPlot.w, 1);
    // y=0.8 更靠上（画布 y 向下）
    expect(y1).toBeLessThan(y0);
    for (const n of m.nodes) {
      const [x, y] = n.loc.split(/\s+/).map(Number);
      expect(x).toBeGreaterThanOrEqual(-200);
      expect(x).toBeLessThanOrEqual(Q_CANVAS_W + 200);
      expect(y).toBeGreaterThanOrEqual(-200);
      expect(y).toBeLessThanOrEqual(Q_CANVAS_H + 200);
    }
  });

  it('clamps out-of-range coordinates to the plot area', () => {
    const ast = parseQuadrant('quadrantChart\npoints: P[2, -1]');
    const m = mapQuadrant(ast, defaultTheme);
    const [x, y] = locOf(m.nodes, 'pt_0');
    expect(x).toBeCloseTo(quadrantPlot.x1, 1);  // x 钳到 1
    expect(y).toBeCloseTo(quadrantPlot.y1, 1);  // y 钳到 0（底部）
  });

  it('emits frame, cross lines, quadrant and axis labels', () => {
    const m = mapQuadrant(parseQuadrant(DSL), defaultTheme);
    const keys = m.nodes.map(n => n.key);
    expect(keys).toContain('__frame');
    expect(keys).toContain('__vline');
    expect(keys).toContain('__hline');
    expect(m.nodes.filter(n => n.category === 'QBg').length).toBe(4);
    expect(m.nodes.filter(n => n.category === 'QLabel').length).toBe(4);
    expect(m.nodes.filter(n => n.category === 'QDot').length).toBe(3);
    expect(m.nodes.filter(n => n.category === 'QPointLabel').length).toBe(3);
    const frame = m.nodes.find(n => n.key === '__frame')!;
    expect(frame.w).toBe(quadrantPlot.w);
    expect(frame.h).toBe(quadrantPlot.h);
    // 象限底色为两色棋盘交替
    const bg = m.nodes.filter(n => n.category === 'QBg').map(n => n.fill);
    expect(new Set(bg).size).toBe(2);
  });
});
