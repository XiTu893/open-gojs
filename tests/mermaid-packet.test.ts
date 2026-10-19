import { describe, it, expect } from 'vitest';
import { parsePacket, isPacket } from '../src/mermaid/parser/packet';
import { mapPacket } from '../src/mermaid/mapper/packet';
import { defaultTheme } from '../src/mermaid/themes';

describe('mermaid packet parser', () => {
  it('detects packet by first-line header', () => {
    expect(isPacket('packet\n0-7: "Version"')).toBe(true);
    expect(isPacket('kanban\n  a[B]')).toBe(false);
    expect(isPacket('')).toBe(false);
  });

  it('parses absolute, relative and unit ranges', () => {
    const ast = parsePacket(`packet
0-3: "Version"
+4: "Header Length"
4-15: "Total Length"
16-31: "Flow Label"`);
    expect(ast.kind).toBe('packet');
    expect(ast.fields.length).toBe(4);
    expect(ast.fields[0]).toEqual({ start: 0, end: 3, label: 'Version' });
    // 相对续接：前一字段 end+1，宽 4
    expect(ast.fields[1]).toEqual({ start: 4, end: 7, label: 'Header Length' });
    expect(ast.fields[2]).toEqual({ start: 4, end: 15, label: 'Total Length' });
    expect(ast.fields[3]).toEqual({ start: 16, end: 31, label: 'Flow Label' });
  });

  it('parses unit ranges as start=end', () => {
    const ast = parsePacket('packet\n0-7: "V"\n16: "Flag"');
    expect(ast.fields[1]).toEqual({ start: 16, end: 16, label: 'Flag' });
  });

  it('swaps inverted ranges and accepts unquoted labels', () => {
    const ast = parsePacket(`packet
7-0: Version
16: Flag 无引号`);
    expect(ast.fields[0]).toEqual({ start: 0, end: 7, label: 'Version' });
    expect(ast.fields[1]).toEqual({ start: 16, end: 16, label: 'Flag 无引号' });
  });

  it('skips comments and unknown lines', () => {
    const ast = parsePacket(`packet
%% comment
nonsense line
0-7: "V"`);
    expect(ast.fields.length).toBe(1);
    expect(ast.fields[0].label).toBe('V');
  });
});

describe('mermaid packet mapper', () => {
  it('lays out cells by bit width with monotonic overlap fix', () => {
    const ast = parsePacket(`packet
0-7: "Version"
6-15: "Overlap"`);
    const { nodes } = mapPacket(ast, defaultTheme);
    const cells = nodes.filter(n => n.category === 'PCell');
    expect(cells.length).toBe(2);
    // 第二字段 start 被单调游标推到 8（消除与前一字段重叠）
    const x0 = parseFloat(cells[0].loc.split(' ')[0]);
    const x1 = parseFloat(cells[1].loc.split(' ')[0]);
    // BIT_W=16、GRID_X=56：字段0 宽 8 位 = 128px
    expect(cells[0].w).toBe(8 * 16);
    expect(x1 - x0).toBe(8 * 16);
    expect(cells[1].w).toBe(8 * 16); // 8-15
  });

  it('wraps rows every 32 bits with consecutive numbering', () => {
    const ast = parsePacket(`packet
0-31: "Row1"
32-63: "Row2"`);
    const { nodes } = mapPacket(ast, defaultTheme);
    const cells = nodes.filter(n => n.category === 'PCell');
    expect(cells.length).toBe(2);
    const y0 = parseFloat(cells[0].loc.split(' ')[1]);
    const y1 = parseFloat(cells[1].loc.split(' ')[1]);
    expect(y1).toBeGreaterThan(y0);
    // 每行满 32 位宽
    expect(cells[0].w).toBe(32 * 16);
    expect(cells[1].w).toBe(32 * 16);
    // 两行都有刻度：0/8/16/24/31 与 32/40/48/56/63
    const ticks = nodes.filter(n => n.category === 'PTick');
    expect(ticks.length).toBe(10);
    expect(ticks.map(t => t.text)).toContain('0');
    expect(ticks.map(t => t.text)).toContain('31');
    expect(ticks.map(t => t.text)).toContain('63');
  });

  it('splits field crossing row boundary', () => {
    const ast = parsePacket('packet\n30-35: "Cross"');
    const { nodes } = mapPacket(ast, defaultTheme);
    const cells = nodes.filter(n => n.category === 'PCell');
    expect(cells.length).toBe(2);
    expect(cells[0].w).toBe(2 * 16); // 30-31
    expect(cells[1].w).toBe(4 * 16); // 32-35
  });

  it('handles empty fields', () => {
    expect(mapPacket(parsePacket('packet'), defaultTheme).nodes).toEqual([]);
  });
});
