import { describe, it, expect } from 'vitest';
import { parseXYChart, isXYChart } from '../src/mermaid/parser/xychart';
import { mapXYChart, xyPlot, XY_CANVAS_W } from '../src/mermaid/mapper/xychart';
import { defaultTheme } from '../src/mermaid/themes';

const DSL = `xychart-beta
title 销售额
x-axis [Q1, Q2, Q3, Q4]
y-axis 0 --> 100
bar [30, 55, 80, 66]
line [25, 50, 75, 70]
area [10, 20, 30, 40]`;

function locOf(nodes: { key: string; loc: string }[], key: string): [number, number] {
  const n = nodes.find(x => x.key === key)!;
  expect(n).toBeDefined();
  const [x, y] = n.loc.split(/\s+/).map(Number);
  expect(Number.isFinite(x)).toBe(true);
  expect(Number.isFinite(y)).toBe(true);
  return [x, y];
}

describe('mermaid xychart parser', () => {
  it('detects xychart', () => {
    expect(isXYChart(DSL)).toBe(true);
    expect(isXYChart('xychart\nbar [1]')).toBe(true);
    expect(isXYChart('radar-beta\naxis a, b')).toBe(false);
  });

  it('parses title, axes and ordered series', () => {
    const ast = parseXYChart(DSL);
    expect(ast.kind).toBe('xychart');
    expect(ast.title).toBe('销售额');
    expect(ast.xLabels).toEqual(['Q1', 'Q2', 'Q3', 'Q4']);
    expect(ast.yMin).toBe(0);
    expect(ast.yMax).toBe(100);
    expect(ast.series.map(s => s.type)).toEqual(['bar', 'line', 'area']);
    expect(ast.series[0].values).toEqual([30, 55, 80, 66]);
    expect(ast.series[1].values).toEqual([25, 50, 75, 70]);
    expect(ast.series[2].values).toEqual([10, 20, 30, 40]);
  });

  it('tolerates comments, duplicate series and missing axes', () => {
    const ast = parseXYChart(`%% 注释
xychart
title "T"
bar [1, 2, 3]
bar [4, 5, 6]`);
    expect(ast.title).toBe('T');
    expect(ast.series.length).toBe(2);
    expect(ast.series.every(s => s.type === 'bar')).toBe(true);
    // y 轴缺省：0 .. 最大值；x 标签缺省：序号
    expect(ast.yMin).toBe(0);
    expect(ast.yMax).toBe(6);
    expect(ast.xLabels).toEqual(['1', '2', '3']);
  });
});

describe('mermaid xychart mapper', () => {
  it('lays out bars inside each category slot', () => {
    const m = mapXYChart(parseXYChart(DSL), defaultTheme);
    const bars = m.nodes.filter(n => n.category === 'XYBar');
    expect(bars.length).toBe(4);
    const slot = xyPlot.w / 4;
    const [bx, by] = locOf(m.nodes, 'bar_0_0');
    expect(bx).toBeGreaterThan(xyPlot.x0);
    expect(bx).toBeLessThan(xyPlot.x0 + slot);
    const bar0 = bars[0];
    expect(bar0.loc.split(' ')[0]).toBe(String(bx));
    // 值越大柱越高（顶部 y 越小）
    const [, y30] = locOf(m.nodes, 'bar_0_0');
    const [, y80] = locOf(m.nodes, 'bar_0_2');
    expect(y80).toBeLessThan(y30);
    expect(by).toBeGreaterThanOrEqual(xyPlot.y0);
    expect(by).toBeLessThanOrEqual(xyPlot.y1);
  });

  it('builds line and area geometry paths', () => {
    const m = mapXYChart(parseXYChart(DSL), defaultTheme);
    const line = m.nodes.find(n => n.key === 'line_1')!;
    expect(line.category).toBe('XYLine');
    expect(line.geom!.startsWith('M')).toBe(true);
    expect((line.geom!.match(/L/g) || []).length).toBe(3);
    expect(line.geom).not.toContain('Z');
    expect(line.stroke).toBe(defaultTheme.series[1]);

    const area = m.nodes.find(n => n.key === 'area_2')!;
    expect(area.category).toBe('XYArea');
    expect(area.geom!.endsWith('Z')).toBe(true);
    expect(area.fill).toMatch(/^rgba\(/);
    // 填充区从基线闭合回基线
    expect(area.geom!.startsWith(`M${xyPlot.x0 + xyPlot.w / 8},`)).toBe(true);
  });

  it('emits grid, ticks, axis lines and legend', () => {
    const m = mapXYChart(parseXYChart(DSL), defaultTheme);
    expect(m.nodes.filter(n => n.category === 'XYGrid').length).toBe(5);
    expect(m.nodes.filter(n => n.category === 'XYYLabel').length).toBe(5);
    expect(m.nodes.filter(n => n.category === 'XYXLabel').length).toBe(4);
    expect(m.nodes.filter(n => n.category === 'XYAxis').length).toBe(2);
    expect(m.nodes.filter(n => n.category === 'XYLegend').length).toBe(3);
    const yLabels = m.nodes.filter(n => n.category === 'XYYLabel').map(n => n.text);
    expect(yLabels[0]).toBe('0');
    expect(yLabels[4]).toBe('100');
    const legend = m.nodes.find(n => n.key === 'leg_0')!;
    expect(legend.text).toBe('bar 1');
    expect(legend.fill).toBe(defaultTheme.series[0]);
    // 所有柱都在画布内
    for (const b of m.nodes.filter(n => n.category === 'XYBar')) {
      const [x, y] = b.loc.split(' ').map(Number);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(XY_CANVAS_W);
      expect(y + (b.h || 0)).toBeLessThanOrEqual(xyPlot.y1 + 1);
    }
  });
});
