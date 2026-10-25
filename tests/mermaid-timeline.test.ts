import { describe, it, expect } from 'vitest';
import { parseTimeline, isTimeline } from '../extension/mermaid/parser/timeline';
import { mapTimeline } from '../extension/mermaid/mapper/timeline';
import { defaultTheme } from '../extension/mermaid/themes';

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
  const dsl = `timeline
title 工业革命
  1760 : 纺织机械化 : 蒸汽机
  1840 : 铁路扩张
  1900 : 电气化`;

  it('emits badges, horizontal axis, vertical dashed lines and event cards', () => {
    const { nodes } = mapTimeline(parseTimeline(dsl), defaultTheme);
    const badges = nodes.filter(n => n.category === 'TBadge');
    const events = nodes.filter(n => n.category === 'TEvent');
    const lines = nodes.filter(n => n.category === 'TLine');
    const axis = nodes.filter(n => n.category === 'TAxis');
    expect(badges.length).toBe(3);
    expect(events.length).toBe(4);
    expect(lines.length).toBe(3);
    expect(axis.length).toBe(1);

    // 横向时间轴：粗黑线 + 右端箭头三角，位于徽章下方
    const ax = axis[0];
    expect(ax.stroke).toBe('#000000');
    expect(ax.sw).toBe(4);
    expect(ax.geo).toContain('Z M');
    const axisY = parseFloat(ax.geo!.match(/M [\d.]+,([\d.]+)/)![1]);
    for (const b of badges) {
      expect(parseFloat(b.loc.split(' ')[1])).toBeLessThan(axisY);
    }

    // 纵向虚线：黑色 + dash，列心等距，位于内容之后（顶层）
    for (const l of lines) {
      expect(l.stroke).toBe('#000000');
      expect(l.dash).toEqual([5, 5]);
      expect(nodes.indexOf(l)).toBeGreaterThan(nodes.indexOf(badges[0]));
    }
    const lineXs = lines.map(l => parseFloat(l.geo!.match(/M ([\d.]+),/)![1]));
    expect(lineXs[1] - lineXs[0]).toBeCloseTo(lineXs[2] - lineXs[1], 5);
    for (let i = 0; i < badges.length; i++) {
      const bx = parseFloat(badges[i].loc.split(' ')[0]) + badges[i].w! / 2;
      expect(lineXs[i]).toBeCloseTo(bx, 5);
    }

    // 主次区分：徽章 = series 实色；事件 = 白底 + series 描边
    expect(badges[0].fill).toBe(defaultTheme.series[0]);
    expect(events[0].fill).toBe('#ffffff');
    expect(events[0].stroke).toBe(defaultTheme.series[0]);

    // 事件卡片在时间轴下方（次内容）
    for (const e of events) {
      expect(parseFloat(e.loc.split(' ')[1])).toBeGreaterThan(axisY);
    }
  });

  it('emits title node', () => {
    const ast = parseTimeline('timeline\ntitle T\n  a : x');
    const { nodes } = mapTimeline(ast, defaultTheme);
    const title = nodes.find(n => n.category === 'TTitle');
    expect(title?.text).toBe('T');
  });

  it('handles empty periods without axis', () => {
    const { nodes } = mapTimeline(parseTimeline('timeline'), defaultTheme);
    expect(nodes.filter(n => n.category === 'TEvent').length).toBe(0);
    expect(nodes.filter(n => n.category === 'TAxis').length).toBe(0);
  });
});
