import { describe, it, expect } from 'vitest';
import { parseEventModeling, isEventModeling, inferEventLanes } from '../src/mermaid/parser/eventmodeling';
import { mapEventModeling } from '../src/mermaid/mapper/eventmodeling';
import { defaultTheme } from '../src/mermaid/themes';

const DSL = `eventmodeling
tf 01 ui CartUI
tf 02 cmd AddItem { itemId: 1 }
tf 03 evt ItemAdded
tf 04 rmo Inventory
rf 05 evt OtherEvent ->> 03
`;

describe('mermaid eventmodeling parser', () => {
  it('detects eventmodeling header', () => {
    expect(isEventModeling(DSL)).toBe(true);
    expect(isEventModeling('flowchart TD\nA --> B')).toBe(false);
    expect(isEventModeling('  eventmodeling\n')).toBe(true);
  });

  it('parses timeframe lines with types, data and relTo', () => {
    const ast = parseEventModeling(DSL);
    expect(ast.kind).toBe('eventmodeling');
    expect(ast.frames.length).toBe(5);
    expect(ast.frames[0]).toMatchObject({ num: '01', reset: false, entityType: 'ui', entity: 'CartUI' });
    expect(ast.frames[1].entityType).toBe('cmd');
    expect(ast.frames[1].data).toBe('itemId: 1');
    expect(ast.frames[3].entityType).toBe('rmo');
    expect(ast.frames[4].reset).toBe(true);
    expect(ast.frames[4].relTo).toEqual(['03']);
    expect(ast.frames[0].relTo).toEqual([]);
  });

  it('accepts relaxed keywords, [[Block]] data and multiple relTo', () => {
    const ast = parseEventModeling(`eventmodeling
timeframe 01 processor Checkout
rf 02 event Saved [[DataBlock1]] ->> 01, 03
timeframe 03 ui CartUI ->> 01`);
    expect(ast.frames[0].entityType).toBe('pcr');
    expect(ast.frames[1].reset).toBe(true);
    expect(ast.frames[1].data).toBe('[[DataBlock1]]');
    expect(ast.frames[1].relTo).toEqual(['01', '03']);
    expect(ast.frames[2].relTo).toEqual(['01']);
  });

  it('infers lanes by entity type and namespace', () => {
    const ast = parseEventModeling(`eventmodeling
tf 01 ui CartUI
tf 02 pcr Pricing.Worker
tf 03 evt ItemAdded
tf 04 ui Pricing.CartUI
tf 05 rmo Inventory`);
    expect(ast.lanes.map(l => l.title)).toEqual([
      'UI/Automation',
      'Pricing / UI/Automation',
      'Events',
      'Command/Read Model',
    ]);
    expect(ast.lanes[0].frames).toEqual([0]);        // 无 namespace 的 ui
    expect(ast.lanes[1].frames).toEqual([1, 3]);     // Pricing.Worker + Pricing.CartUI 同泳道
  });

  it('tolerates comments, unknown lines and multi-line data blocks', () => {
    const ast = parseEventModeling(`eventmodeling
%% comment
// another comment
unknown line here
tf 09 nonsense Broken
data Block1 \`json\`{
  "a": 1
  tf 07 ui Nested
}
tf 10 ui CartUI`);
    expect(ast.frames.length).toBe(1);
    expect(ast.frames[0].num).toBe('10');
    expect(() => parseEventModeling('eventmodeling\ntf')).not.toThrow();
  });

  it('lane inference is standalone-callable', () => {
    const lanes = inferEventLanes([
      { num: '1', reset: false, entityType: 'cmd', entity: 'Sales.DoIt', relTo: [] },
      { num: '2', reset: false, entityType: 'cmd', entity: 'Sales.DoThat', relTo: [] },
    ]);
    expect(lanes.length).toBe(1);
    expect(lanes[0].title).toBe('Sales / Command/Read Model');
    expect(lanes[0].frames).toEqual([0, 1]);
  });
});

describe('mermaid eventmodeling mapper', () => {
  it('maps lanes, columns and cards with loc strings', () => {
    const m = mapEventModeling(parseEventModeling(DSL), defaultTheme);
    const lanes = m.nodes.filter(n => n.category === 'Lane');
    const cards = m.nodes.filter(n => n.category === 'Card');
    const heads = m.nodes.filter(n => n.category === 'ColHead');
    expect(lanes.length).toBe(3);
    expect(lanes.map(l => l.text)).toEqual(['UI/Automation', 'Command/Read Model', 'Events']);
    expect(cards.length).toBe(5);
    expect(heads.length).toBe(5);
    expect(cards.every(n => /^-?\d+ -?\d+$/.test(n.loc))).toBe(true);
    expect(cards[0].text).toBe('01 · CartUI');
    expect(cards[1].sub).toBe('itemId: 1');
    // 泳道纵向排布不重叠
    expect(Number(lanes[1].loc.split(' ')[1])).toBeGreaterThan(Number(lanes[0].loc.split(' ')[1]) + Number(lanes[0].h!));
  });

  it('links chain frames, breaks on reset and adds explicit relTo dashed', () => {
    const m = mapEventModeling(parseEventModeling(DSL), defaultTheme);
    expect(m.links.length).toBe(4); // 0→1→2→3 链（4 为 reset 断开）+ 4→2 显式
    expect(m.links.filter(l => l.dash).length).toBe(1);
    const explicit = m.links.find(l => l.dash)!;
    expect(explicit.from).toBe('f_4');
    expect(explicit.to).toBe('f_2');
    expect(m.links.find(l => l.from === 'f_3' && l.to === 'f_4')).toBeUndefined();
  });

  it('colors cards from theme series without hardcoded colors', () => {
    const m = mapEventModeling(parseEventModeling(DSL), defaultTheme);
    const fills = m.nodes.filter(n => n.category === 'Card').map(n => n.fill);
    expect(fills[0]).toBe(defaultTheme.series[0]); // ui
    expect(fills[1]).toBe(defaultTheme.series[2]); // cmd
    expect(fills[2]).toBe(defaultTheme.series[4]); // evt
    expect(fills.every(f => defaultTheme.series.includes(f!))).toBe(true);
  });

  it('stacks multiple cards in the same lane/column without overlap', () => {
    const m = mapEventModeling(parseEventModeling(`eventmodeling
tf 01 ui A
tf 01 ui B`), defaultTheme);
    const cards = m.nodes.filter(n => n.category === 'Card');
    expect(cards.length).toBe(2);
    expect(cards[1].loc).not.toBe(cards[0].loc);
    expect(Number(cards[1].loc.split(' ')[1]))
      .toBeGreaterThan(Number(cards[0].loc.split(' ')[1]));
  });
});
