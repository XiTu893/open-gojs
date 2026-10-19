import { describe, it, expect } from 'vitest';
import { parseC4, isC4 } from '../src/mermaid/parser/c4';
import { mapC4 } from '../src/mermaid/mapper/c4';
import { defaultTheme } from '../src/mermaid/themes';

const CONTEXT = `C4Context
title 银行系统上下文
Person(cust, "银行客户")
System(bank, "核心银行系统")
System_Ext(ext, "第三方支付")
Rel(cust, bank, "使用", "HTTPS")
Rel(bank, ext, "转账")
`;

describe('mermaid c4 parser', () => {
  it('detects C4 headers', () => {
    expect(isC4(CONTEXT)).toBe(true);
    expect(isC4('C4Container\ntitle x')).toBe(true);
    expect(isC4('C4Deployment\nNode(n1, "n")')).toBe(true);
    expect(isC4('flowchart TD\nA --> B')).toBe(false);
  });

  it('parses variant, title, elements and rels', () => {
    const ast = parseC4(CONTEXT);
    expect(ast.kind).toBe('c4');
    expect(ast.variant).toBe('context');
    expect(ast.title).toBe('银行系统上下文');
    expect(ast.elements.map(e => ({ alias: e.alias, type: e.type, ext: e.ext }))).toEqual([
      { alias: 'cust', type: 'person', ext: undefined },
      { alias: 'bank', type: 'system', ext: undefined },
      { alias: 'ext', type: 'system', ext: true },
    ]);
    expect(ast.elements[1].label).toBe('核心银行系统');
    expect(ast.rels.length).toBe(2);
    expect(ast.rels[0]).toEqual({ from: 'cust', to: 'bank', label: '使用' });
    expect(ast.rels[1].label).toBe('转账');
  });

  it('parses BiRel, element suffixes, unquoted args and ignores extra params', () => {
    const ast = parseC4(`C4Container
Person(p1, 客户, 说明写这里)
ContainerDb(db1, "订单库", "关系型")
Component_Ext(c1, "老系统")
BiRel(p1, db1, "读写")
Rel(p1, c1, "调用", "REST", extra)`);
    expect(ast.variant).toBe('container');
    expect(ast.elements.find(e => e.alias === 'p1')!.label).toBe('客户');
    expect(ast.elements.find(e => e.alias === 'db1')!.type).toBe('container');
    expect(ast.elements.find(e => e.alias === 'c1')!.ext).toBe(true);
    expect(ast.rels[0].bi).toBe(true);
    expect(ast.rels[1].label).toBe('调用');
  });

  it('tracks boundary stack and assigns member boundaryAlias', () => {
    const ast = parseC4(`C4Container
Boundary(web, "Web 层") {
  Container(w1, "前端")
  Container(w2, "BFF")
}
Container(db, "数据库")
Rel(w1, db, "查询")`);
    expect(ast.boundaries).toEqual([{ alias: 'web', label: 'Web 层' }]);
    expect(ast.elements.find(e => e.alias === 'w1')!.boundaryAlias).toBe('web');
    expect(ast.elements.find(e => e.alias === 'w2')!.boundaryAlias).toBe('web');
    expect(ast.elements.find(e => e.alias === 'db')!.boundaryAlias).toBeUndefined();
    expect(ast.order.map(o => `${o.kind}:${o.alias}`)).toEqual([
      'boundary:web',
      'element:w1',
      'element:w2',
      'element:db',
    ]);
  });

  it('skips style lines and reads c4ShapeInRow; tolerates garbage', () => {
    const ast = parseC4(`C4Context
Person(a, "A")
UpdateElementStyle(a, $bgColor())
UpdateRelStyle(a, a, $lineColor())
UpdateLayoutConfig(c4ShapeInRow, 3)
Lay_Distinct(0,0)
no such line
Person(broken
Rel(only)`);
    expect(ast.elements.length).toBe(1);
    expect(ast.rels.length).toBe(0);
    expect(ast.maxPerRow).toBe(3);
    expect(() => parseC4('C4Context\nPerson(')).not.toThrow();
  });
});

describe('mermaid c4 mapper', () => {
  it('lays out elements in a maxPerRow grid with loc strings', () => {
    const m = mapC4(parseC4(`C4Context
Person(a, "A")
Person(b, "B")
Person(c, "C")
Person(d, "D")
Person(e, "E")`), defaultTheme);
    expect(m.maxPerRow).toBe(4);
    const cells = m.nodes.filter(n => n.category === 'C4Node');
    expect(cells.length).toBe(5);
    expect(cells.every(n => /^-?\d+ -?\d+$/.test(n.loc))).toBe(true);
    const row2 = cells[4];
    expect(Number(row2.loc.split(' ')[1])).toBeGreaterThan(Number(cells[0].loc.split(' ')[1]));
    expect(cells[0].stereotype).toBe('«person»');
  });

  it('wraps boundary box around its members', () => {
    const m = mapC4(parseC4(`C4Container
Boundary(web, "Web 层") {
  Container(w1, "前端")
  Container(w2, "BFF")
}
Container(db, "数据库")`), defaultTheme);
    const box = m.nodes.find(n => n.category === 'GroupBox')!;
    expect(box.text).toBe('Web 层');
    expect(box.members).toEqual(['w1', 'w2']);
    const [bx, by] = box.loc.split(' ').map(Number);
    for (const key of box.members!) {
      const cell = m.nodes.find(n => n.key === key)!;
      const [x, y] = cell.loc.split(' ').map(Number);
      expect(x).toBeGreaterThanOrEqual(bx);
      expect(y).toBeGreaterThanOrEqual(by);
      expect(x + cell.w).toBeLessThanOrEqual(bx + box.w);
      expect(y + cell.h).toBeLessThanOrEqual(by + box.h);
    }
    const db = m.nodes.find(n => n.key === 'db')!;
    expect(Number(db.loc.split(' ')[0])).toBeGreaterThanOrEqual(bx + box.w);
  });

  it('maps rels to links (bi included) and marks ext dashed', () => {
    const m = mapC4(parseC4(CONTEXT + 'BiRel(cust, ext, "通知")'), defaultTheme);
    expect(m.links.length).toBe(3);
    expect(m.links[0].label).toBe('使用');
    expect(m.links[2].both).toBe(true);
    const ext = m.nodes.find(n => n.key === 'ext')!;
    expect(ext.dash).toBe(true);
    expect(ext.stereotype).toBe('«External system»');
    expect(ext.fill).toBe(defaultTheme.categories.process.fill);
  });

  it('drops rels whose endpoints are unknown', () => {
    const m = mapC4(parseC4('C4Context\nPerson(a, "A")\nRel(a, ghost, "x")'), defaultTheme);
    expect(m.links.length).toBe(0);
  });
});
