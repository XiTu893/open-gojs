import { describe, it, expect } from 'vitest';
import { parseTimeline, isTimeline } from '../src/mermaid/parser/timeline';
import { mapTimeline } from '../src/mermaid/mapper/timeline';
import { defaultTheme } from '../src/mermaid/themes';

describe('mermaid timeline parser', () => {
  it('detects timeline by first-line header', () => {
    expect(isTimeline('timeline\ntitle 工业革命')).toBe(true);
    expect(isTimeline('timeline title 工业革命\n1760 : 纺织机械化')).toBe(true);
    expect(isTimeline('journey\ntitle X')).toBe(false);
    expect(isTimeline('')).toBe(false);
  });

  it('parses title and periods with events', () => {
    const ast = parseTimeline(`timeline
title 工业革命
  1760 : 纺织机械化 : 蒸汽机
  1840 : 铁路扩张`);
    expect(ast.kind).toBe('timeline');
    expect(ast.title).toBe('工业革命');
    expect(ast.periods.length).toBe(2);
    expect(ast.periods[0]).toEqual({ period: '1760', events: ['纺织机械化', '蒸汽机'] });
    expect(ast.periods[1]).toEqual({ period: '1840', events: ['铁路扩张'] });
  });

  it('skips comments and ignores unknown lines', () => {
    const ast = parseTimeline(`timeline
%% 这是注释
title 标题

这不是冒号行因此忽略
  2000 : 互联网爆发`);
    expect(ast.title).toBe('标题');
    expect(ast.periods.length).toBe(1);
    expect(ast.periods[0].period).toBe('2000');
  });

  it('handles empty events and empty input', () => {
    expect(parseTimeline('timeline').periods).toEqual([]);
    const ast = parseTimeline('timeline\n  1990 :');
    expect(ast.periods.length).toBe(1);
    expect(ast.periods[0].events).toEqual([]);
  });
});

describe('mermaid timeline mapper', () => {
  it('places cards above axis with uniform column spacing', () => {
    const ast = parseTimeline(`timeline
title 工业革命
  1760 : 纺织机械化 : 蒸汽机
  1840 : 铁路扩张
  1900 : 电气化`);
    const { nodes } = mapTimeline(ast, defaultTheme);
    const cards = nodes.filter(n => n.category === 'TCard');
    const dots = nodes.filter(n => n.category === 'TDot');
    const axis = nodes.filter(n => n.category === 'TAxis');
    expect(cards.length).toBe(3);
    expect(dots.length).toBe(3);
    expect(axis.length).toBe(1);
    // 卡片在轴线（y=300）上方
    for (const c of cards) {
      const y = parseFloat(c.loc.split(' ')[1]);
      expect(y).toBeLessThan(300);
    }
    // 圆点在轴线上、列距均匀
    const xs = dots.map(d => parseFloat(d.loc.split(' ')[0]));
    expect(xs[1] - xs[0]).toBe(xs[2] - xs[1]);
    for (const d of dots) {
      expect(parseFloat(d.loc.split(' ')[1])).toBe(300);
    }
    // 卡片水平对齐对应圆点
    expect(parseFloat(cards[0].loc.split(' ')[0])).toBeLessThan(xs[0]);
  });

  it('emits title node and uses theme series colors', () => {
    const ast = parseTimeline('timeline\ntitle T\n  a : x');
    const { nodes } = mapTimeline(ast, defaultTheme);
    const title = nodes.find(n => n.category === 'TTitle');
    expect(title?.text).toBe('T');
    const dot = nodes.find(n => n.category === 'TDot');
    expect(dot?.fill).toBe(defaultTheme.series[0]);
  });

  it('handles empty periods without axis', () => {
    const { nodes } = mapTimeline(parseTimeline('timeline'), defaultTheme);
    expect(nodes.filter(n => n.category === 'TCard').length).toBe(0);
    expect(nodes.filter(n => n.category === 'TAxis').length).toBe(0);
  });
});
