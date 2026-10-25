import { describe, it, expect } from 'vitest';
import { parseKanban, isKanban } from '../extension/mermaid/parser/kanban';
import { mapKanban, kanbanCardHeight } from '../extension/mermaid/mapper/kanban';
import { defaultTheme } from '../extension/mermaid/themes';

describe('mermaid kanban parser', () => {
  it('detects kanban by first-line header', () => {
    expect(isKanban('kanban\n  todo[X]')).toBe(true);
    expect(isKanban('packet\n0-7: "V"')).toBe(false);
    expect(isKanban('')).toBe(false);
  });

  it('parses columns, tasks and meta', () => {
    const ast = parseKanban(`kanban
  todo[待办]
    t1[写文档]
      @{ assigned: 张三, priority: High }
    t2[评审]
  done[完成]
    t3[需求分析]`);
    expect(ast.kind).toBe('kanban');
    expect(ast.columns.length).toBe(2);
    expect(ast.columns[0].id).toBe('todo');
    expect(ast.columns[0].title).toBe('待办');
    expect(ast.columns[0].tasks.length).toBe(2);
    expect(ast.columns[0].tasks[0]).toEqual({ id: 't1', label: '写文档', meta: 'assigned: 张三, priority: High' });
    expect(ast.columns[0].tasks[1].meta).toBeUndefined();
    expect(ast.columns[1].tasks[0].id).toBe('t3');
  });

  it('tolerates unknown lines and orphan meta', () => {
    const ast = parseKanban(`kanban
  todo[待办]
    这不是任务行
      @{ assigned: 李四 }
    t1[任务]
garbage without brackets`);
    expect(ast.columns.length).toBe(1);
    // 孤立 meta（前面无任务）被忽略；正常任务解析成功
    expect(ast.columns[0].tasks.length).toBe(1);
    expect(ast.columns[0].tasks[0].id).toBe('t1');
    expect(ast.columns[0].tasks[0].meta).toBeUndefined();
  });

  it('handles empty board', () => {
    expect(parseKanban('kanban').columns).toEqual([]);
  });
});

describe('mermaid kanban mapper', () => {
  const ast = parseKanban(`kanban
  todo[待办]
    t1[写文档]
      @{ assigned: 张三, priority: High }
    t2[评审]
  done[完成]
    t3[需求分析]`);

  it('lays out columns horizontally with headers and stacked cards', () => {
    const { nodes } = mapKanban(ast, defaultTheme);
    const headers = nodes.filter(n => n.category === 'KHeader');
    const cards = nodes.filter(n => n.category === 'KCard');
    expect(headers.length).toBe(2);
    expect(cards.length).toBe(3);
    // 列横排：第二列 x 更大
    const hx = headers.map(h => parseFloat(h.loc.split(' ')[0]));
    expect(hx[1]).toBeGreaterThan(hx[0]);
    // 列头使用 series 轮换色
    expect(headers[0].fill).toBe(defaultTheme.series[0]);
    expect(headers[1].fill).toBe(defaultTheme.series[1]);
    // 同列卡片纵排：t2 在 t1 下方
    const todoCards = cards.filter(c => c.loc.split(' ')[0] === cards[0].loc.split(' ')[0]);
    expect(todoCards.length).toBe(2);
    const y1 = parseFloat(todoCards[0].loc.split(' ')[1]);
    const y2 = parseFloat(todoCards[1].loc.split(' ')[1]);
    expect(y2).toBeGreaterThan(y1);
    // 有 meta 的卡片更高
    expect(todoCards[0].h).toBe(kanbanCardHeight(true));
    expect(todoCards[1].h).toBe(kanbanCardHeight(false));
    expect(todoCards[0].meta).toBe('assigned: 张三, priority: High');
  });

  it('handles empty columns list', () => {
    expect(mapKanban(parseKanban('kanban'), defaultTheme).nodes).toEqual([]);
  });
});
