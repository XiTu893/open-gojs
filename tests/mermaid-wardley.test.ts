import { describe, it, expect } from 'vitest';
import { parseWardley, isWardley } from '../extension/mermaid/parser/wardley';
import { mapWardley } from '../extension/mermaid/mapper/wardley';
import { defaultTheme } from '../extension/mermaid/themes';

const SAMPLE = `wardley-beta
title 我的地图
size [1100, 600]
anchor 用户 [0.9, 0.95]
component 界面 [0.8, 0.7]
component API [0.6, 0.7] (buy)
component 数据库 [0.4, 0.5] (inertia)
用户 +> 界面
界面 -> API
数据库 -> API
evolve API 0.85
note "关键洞察" [0.4, 0.5]`;

describe('mermaid wardley parser', () => {
  it('detects wardley header', () => {
    expect(isWardley('wardley-beta\ncomponent A [0.5, 0.5]')).toBe(true);
    expect(isWardley('wardley\ncomponent A [0.5, 0.5]')).toBe(true);
    expect(isWardley('sankey-beta\nA,B,1')).toBe(false);
  });

  it('parses title, size, components, anchors, links, evolves and notes', () => {
    const ast = parseWardley(SAMPLE);
    expect(ast.kind).toBe('wardley');
    expect(ast.title).toBe('我的地图');
    expect(ast.size).toEqual([1100, 600]);
    expect(ast.anchors).toEqual([{ name: '用户', vis: 0.9, evo: 0.95 }]);
    expect(ast.components.length).toBe(3);
    expect(ast.components[1]).toEqual({ name: 'API', vis: 0.6, evo: 0.7, decorator: 'buy' });
    expect(ast.components[2].decorator).toBe('inertia');
    expect(ast.links).toEqual([
      { from: '用户', to: '界面', flow: true },
      { from: '界面', to: 'API', flow: false },
      { from: '数据库', to: 'API', flow: false },
    ]);
    expect(ast.evolves).toEqual([{ name: 'API', target: 0.85 }]);
    expect(ast.notes).toEqual([{ text: '关键洞察', vis: 0.4, evo: 0.5 }]);
  });

  it('supports reverse flow, labeled flow, hyphen names and tolerance', () => {
    const ast = parseWardley(`%% c
wardley-beta
component my-comp [0.3, 0.2]
component other [0.5, 0.4] (outsource)
other +< my-comp
my-comp +'数据流'> other
other --> my-comp
component bad [x, y]
whatever line`);
    expect(ast.components.length).toBe(2); // bad 坐标行被忽略
    expect(ast.links).toEqual([
      { from: 'my-comp', to: 'other', flow: true },                    // 反向归一
      { from: 'my-comp', to: 'other', flow: true, label: '数据流' },   // 带标签
      { from: 'other', to: 'my-comp', flow: false },                   // --> 依赖
    ]);
    expect(ast.components.find(c => c.name === 'my-comp')).toBeDefined();
  });
});

describe('mermaid wardley mapper', () => {
  const ast = parseWardley(SAMPLE);

  it('converts visibility to y (top = high visibility)', () => {
    const { nodes } = mapWardley(ast, defaultTheme);
    const yOf = (name: string) => Number(nodes.find(n => n.key === name)!.loc.split(' ')[1]);
    const yUser = yOf('用户');   // vis 0.95 → 高（y 小）
    const yUi = yOf('界面');     // vis 0.8
    const yDb = yOf('数据库');   // vis 0.5 → 低（y 大）
    expect(yUser).toBeLessThan(yUi);
    expect(yUi).toBeLessThan(yDb);
    // evolution → x：evo 越大 x 越大
    const xOf = (name: string) => Number(nodes.find(n => n.key === name)!.loc.split(' ')[0]);
    expect(xOf('数据库')).toBeLessThan(xOf('API'));
    expect(xOf('API')).toBeLessThan(xOf('用户'));
  });

  it('emits frame, section bands, axis ticks and decorator symbols', () => {
    const { nodes } = mapWardley(ast, defaultTheme);
    expect(nodes.find(n => n.key === '__frame')?.category).toBe('WardleyFrame');
    const sections = nodes.filter(n => n.category === 'WardleySection');
    expect(sections.map(s => s.text)).toEqual(['genesis', 'custom-built', 'product', 'utility']);
    const axes = nodes.filter(n => n.category === 'WardleyAxis');
    expect(axes.length).toBeGreaterThanOrEqual(6); // 0/0.5/1 × 两轴 + 轴名
    // buy → Diamond decorator；inertia → ~ 前缀文本
    expect(nodes.find(n => n.key === '__dec_API')?.figure).toBe('Diamond');
    expect(nodes.find(n => n.key === '__lbl_数据库')?.text).toBe('~数据库');
  });

  it('maps links, evolve dashed line target and notes', () => {
    const { nodes, links } = mapWardley(ast, defaultTheme);
    expect(links.filter(l => !l.dashed).length).toBe(3);
    // evolve：目标点在组件右侧同一行 + dash 连线
    const ev = links.find(l => l.dashed);
    expect(ev).toBeDefined();
    expect(ev!.from).toBe('API');
    expect(ev!.to).toBe('__ev_API');
    const comp = nodes.find(n => n.key === 'API')!;
    const target = nodes.find(n => n.key === '__ev_API')!;
    const cy = Number(comp.loc.split(' ')[1]);
    const ty = Number(target.loc.split(' ')[1]);
    expect(Math.abs(cy - ty)).toBeLessThanOrEqual(3); // 同组件行
    const cx = Number(comp.loc.split(' ')[0]);
    const tx = Number(target.loc.split(' ')[0]);
    expect(tx).toBeGreaterThan(cx); // 目标 evolution 0.85 > 0.6
    // note
    const note = nodes.find(n => n.category === 'WardleyNote');
    expect(note?.text).toBe('关键洞察');
  });

  it('defaults size to 1100x600', () => {
    const ast2 = parseWardley('wardley-beta\ncomponent A [0.5, 0.5]');
    const { nodes } = mapWardley(ast2, defaultTheme);
    const frame = nodes.find(n => n.key === '__frame')!;
    expect(frame.w).toBeCloseTo(1100 - 70 - 36, 5);
    expect(frame.h).toBeCloseTo(600 - 48 - 56, 5);
  });
});
