import { describe, it, expect } from 'vitest';
import { parseJourney, isJourney } from '../src/mermaid/parser/journey';
import { mapJourney } from '../src/mermaid/mapper/journey';
import { defaultTheme } from '../src/mermaid/themes';

describe('mermaid journey parser', () => {
  it('detects journey by first-line header', () => {
    expect(isJourney('journey\ntitle 购物体验')).toBe(true);
    expect(isJourney('timeline\n2000 : x')).toBe(false);
    expect(isJourney('')).toBe(false);
  });

  it('parses title, sections, tasks with scores and actors', () => {
    const ast = parseJourney(`journey
title 购物体验
section 浏览
  搜索商品: 5: 用户, 系统
  查看详情: 7: 用户
section 下单
  结算支付: 9: 用户, 支付网关`);
    expect(ast.kind).toBe('journey');
    expect(ast.title).toBe('购物体验');
    expect(ast.sections.length).toBe(2);
    expect(ast.sections[0].name).toBe('浏览');
    expect(ast.sections[0].tasks.length).toBe(2);
    expect(ast.sections[0].tasks[0]).toEqual({ label: '搜索商品', score: 5, actors: ['用户', '系统'] });
    expect(ast.sections[1].tasks[0].score).toBe(9);
  });

  it('ignores non-numeric score lines and unknown lines', () => {
    const ast = parseJourney(`journey
section S
  坏行: abc: 用户
  正常: 3
  ???`);
    expect(ast.sections.length).toBe(1);
    expect(ast.sections[0].tasks.length).toBe(1);
    expect(ast.sections[0].tasks[0].label).toBe('正常');
    expect(ast.sections[0].tasks[0].actors).toEqual([]);
  });

  it('puts tasks without section into implicit section', () => {
    const ast = parseJourney('journey\n  自由任务: 4: 游客');
    expect(ast.sections.length).toBe(1);
    expect(ast.sections[0].tasks[0].label).toBe('自由任务');
  });
});

describe('mermaid journey mapper', () => {
  const ast = parseJourney(`journey
title 购物体验
section 浏览
  搜索商品: 5: 用户, 系统
  查看详情: 10: 用户`);

  it('maps section header, bars, labels and baseline', () => {
    const { nodes } = mapJourney(ast, defaultTheme);
    const headers = nodes.filter(n => n.category === 'JSection');
    const bars = nodes.filter(n => n.category === 'JBar');
    const labels = nodes.filter(n => n.category === 'JLabel');
    const scores = nodes.filter(n => n.category === 'JScore');
    const axis = nodes.filter(n => n.category === 'JAxis');
    expect(headers.length).toBe(1);
    expect(headers[0].text).toBe('浏览');
    expect(bars.length).toBe(2);
    expect(labels.length).toBe(2);
    expect(scores.length).toBe(2);
    expect(axis.length).toBe(1);
    expect(axis[0].geo).toContain('M40,320');
  });

  it('bar height proportional to clamped score', () => {
    const { nodes } = mapJourney(ast, defaultTheme);
    const bars = nodes.filter(n => n.category === 'JBar');
    // score 5 → 75px；score 10 → 150px（MAX_BAR_H=150）
    expect(bars[0].h).toBe(75);
    expect(bars[1].h).toBe(150);
    // 柱底对齐基线 y=320
    expect(parseFloat(bars[0].loc.split(' ')[1]) + (bars[0].h ?? 0)).toBe(320);
    expect(parseFloat(bars[1].loc.split(' ')[1]) + (bars[1].h ?? 0)).toBe(320);
  });

  it('clamps out-of-range scores and colors by series', () => {
    const over = parseJourney('journey\nsection S\n  超分: 15: A');
    const under = parseJourney('journey\nsection S\n  负分: -3: A');
    const hOver = mapJourney(over, defaultTheme).nodes.find(n => n.category === 'JBar')?.h;
    const hUnder = mapJourney(under, defaultTheme).nodes.find(n => n.category === 'JBar')?.h;
    expect(hOver).toBe(150); // clamp(15,0,10)=10
    expect(hUnder).toBe(4);  // clamp(-3,0,10)=0 → 最小 4px
    const { nodes } = mapJourney(ast, defaultTheme);
    const header = nodes.find(n => n.category === 'JSection');
    expect(header?.fill).toBe(defaultTheme.series[0]);
  });
});
