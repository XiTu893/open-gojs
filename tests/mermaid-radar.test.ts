import { describe, it, expect } from 'vitest';
import { parseRadar, isRadar } from '../extension/mermaid/parser/radar';
import { mapRadar, radarGeom } from '../extension/mermaid/mapper/radar';
import { defaultTheme } from '../extension/mermaid/themes';

const DSL = `radar-beta
title 能力雷达
axis 速度, 质量, 安全, 成本
curve 项目A{8, 6, 7, 5}
curve 项目B{5, 9, 6, 8}
ticks 5
showLegend true`;

function locOf(nodes: { key: string; loc: string }[], key: string): [number, number] {
  const n = nodes.find(x => x.key === key)!;
  expect(n).toBeDefined();
  const [x, y] = n.loc.split(/\s+/).map(Number);
  expect(Number.isFinite(x)).toBe(true);
  expect(Number.isFinite(y)).toBe(true);
  return [x, y];
}

describe('mermaid radar parser', () => {
  it('detects radar', () => {
    expect(isRadar(DSL)).toBe(true);
    expect(isRadar('radar\naxis a, b')).toBe(true);
    expect(isRadar('venn-beta\nset A: 2')).toBe(false);
  });

  it('parses axes, curves, ticks and legend flag', () => {
    const ast = parseRadar(DSL);
    expect(ast.kind).toBe('radar');
    expect(ast.title).toBe('能力雷达');
    expect(ast.axes).toEqual(['速度', '质量', '安全', '成本']);
    expect(ast.curves).toEqual([
      { label: '项目A', values: [8, 6, 7, 5] },
      { label: '项目B', values: [5, 9, 6, 8] },
    ]);
    expect(ast.ticks).toBe(5);
    expect(ast.showLegend).toBe(true);
  });

  it('tolerates comments, id["label"] axes and missing options', () => {
    const ast = parseRadar(`%% 注释
radar
axis id1["标签一"], id2, id3["标签三"]
curve 未知行
curve s1{1, 2, 3}
showLegend false`);
    expect(ast.axes).toEqual(['标签一', 'id2', '标签三']);
    expect(ast.curves.length).toBe(1);
    expect(ast.curves[0].label).toBe('s1');
    expect(ast.curves[0].values).toEqual([1, 2, 3]);
    expect(ast.ticks).toBe(5);       // 缺省
    expect(ast.showLegend).toBe(false);
  });
});

describe('mermaid radar mapper', () => {
  it('draws concentric grid rings plus spokes', () => {
    const m = mapRadar(parseRadar(DSL), defaultTheme);
    const grid = m.nodes.find(n => n.category === 'RadarGrid')!;
    expect(grid).toBeDefined();
    // ticks 圈（每圈一个闭合子路径）+ 每轴一条辐条
    expect((grid.geom!.match(/Z/g) || []).length).toBe(5);
    expect((grid.geom!.match(/M/g) || []).length).toBe(5 + 4);
    const [gx, gy] = locOf(m.nodes, '__grid');
    expect(gx).toBeLessThanOrEqual(radarGeom.cx);
    expect(gy).toBeLessThanOrEqual(radarGeom.cy - radarGeom.r + 1);
  });

  it('maps each curve to a closed polygon scaled to the value range', () => {
    const m = mapRadar(parseRadar(DSL), defaultTheme);
    const curves = m.nodes.filter(n => n.category === 'RadarCurve');
    expect(curves.length).toBe(2);
    // max = ceil(9) = 9：项目A 第一轴 8/9 半径，角度 -90° → 正上方
    const c0 = curves[0];
    expect(c0.geom!.endsWith('Z')).toBe(true);
    expect((c0.geom!.match(/L/g) || []).length).toBe(3);
    expect(c0.geom!.startsWith(`M${radarGeom.cx},${(radarGeom.cy - radarGeom.r * 8 / 9).toFixed(2)}`)).toBe(true);
    expect(c0.stroke).toBe(defaultTheme.series[0]);
    expect(c0.fill).toMatch(/^rgba\(/);
    expect(curves[1].stroke).toBe(defaultTheme.series[1]);
    // 曲线多边形位于画布内
    for (const c of curves) {
      const [x, y] = c.loc.split(/\s+/).map(Number);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
    }
  });

  it('places axis labels outside and honors showLegend', () => {
    const m = mapRadar(parseRadar(DSL), defaultTheme);
    expect(m.nodes.filter(n => n.category === 'RadarAxisLabel').length).toBe(4);
    const ax0 = m.nodes.find(n => n.key === 'ax_0')!;
    expect(ax0.text).toBe('速度');
    const [, ay0] = locOf(m.nodes, 'ax_0');
    expect(ay0).toBeLessThan(radarGeom.cy - radarGeom.r); // 顶部轴标签在圆外
    expect(m.nodes.filter(n => n.category === 'RadarLegend').length).toBe(2);

    const noLegend = mapRadar(parseRadar('radar\naxis a, b, c\ncurve c1{1, 2, 3}\nshowLegend false'), defaultTheme);
    expect(noLegend.nodes.some(n => n.category === 'RadarLegend')).toBe(false);
    expect(noLegend.nodes.filter(n => n.category === 'RadarCurve').length).toBe(1);
  });
});
