import { describe, it, expect } from 'vitest';
import { parseTreeView, isTreeView } from '../src/mermaid/parser/treeview';
import { mapTreeView } from '../src/mermaid/mapper/treeview';

describe('mermaid treeview parser', () => {
  it('detects treeView-beta by header', () => {
    expect(isTreeView('treeView-beta\n  a')).toBe(true);
    expect(isTreeView('TreeView-BETA\na')).toBe(true);
    expect(isTreeView('mindmap\n  a')).toBe(false);
    expect(isTreeView('treeView')).toBe(false);
  });

  it('parses dirs, desc, and quoted labels', () => {
    const ast = parseTreeView(`treeView-beta
    my-project/
        src/
            index.js ## entry point
        "my file.txt"`);
    expect(ast.kind).toBe('treeview');
    expect(ast.nodes.length).toBe(4);
    expect(ast.nodes[0]).toEqual({ depth: 0, text: 'my-project', dir: true });
    expect(ast.nodes[1].dir).toBe(true);
    expect(ast.nodes[2].text).toBe('index.js');
    expect(ast.nodes[2].desc).toBe('entry point');
    expect(ast.nodes[3].text).toBe('my file.txt'); // 引号去除，支持空格
    expect(ast.nodes[3].dir).toBeFalsy();
  });

  it('supports box-drawing prefixes and skips :::class/icon', () => {
    const ast = parseTreeView(`treeView-beta
├── src/
│   ├── index.js
│   └── util.ts
└── "package json" icon(x)`);
    expect(ast.nodes.length).toBe(4);
    expect(ast.nodes[0]).toEqual({ depth: 0, text: 'src', dir: true });
    expect(ast.nodes[1].depth).toBe(1);
    expect(ast.nodes[1].text).toBe('index.js');
    expect(ast.nodes[3].text).toBe('package json'); // icon() 剔除
  });

  it('tolerates comments and blank lines', () => {
    const ast = parseTreeView(`treeView-beta
%% comment

    a
        b`);
    expect(ast.nodes.length).toBe(2);
    expect(ast.nodes[0].depth).toBe(0);
    expect(ast.nodes[1].depth).toBe(1);
  });
});

describe('mermaid treeview mapper', () => {
  it('lays out rows with depth indent', () => {
    const ast = parseTreeView(`treeView-beta
    root/
        a
        b
        c`);
    const { nodes, links } = mapTreeView(ast);
    expect(nodes.length).toBe(4);
    expect(links.length).toBe(3);
    const root = nodes[0];
    const rx = parseFloat(root.loc.split(' ')[0]);
    const ry = parseFloat(root.loc.split(' ')[1]);
    const ay = parseFloat(nodes[1].loc.split(' ')[1]);
    expect(parseFloat(nodes[1].loc.split(' ')[0])).toBeGreaterThan(rx);
    expect(ay).toBeGreaterThan(ry); // 每行 y 递增
    const ys = nodes.map((n) => n.loc.split(' ')[1]);
    expect(new Set(ys).size).toBe(4);
  });

  it('dir nodes get bold font, desc appended to text', () => {
    const ast = parseTreeView(`treeView-beta
    src/ ## sources
        index.js`);
    const { nodes } = mapTreeView(ast);
    expect(nodes[0].font.startsWith('bold ')).toBe(true);
    expect(nodes[0].text).toBe('src  (sources)');
    expect(nodes[1].font.startsWith('bold ')).toBe(false);
  });

  it('returns empty for empty ast', () => {
    const { nodes, links } = mapTreeView({ kind: 'treeview', nodes: [] });
    expect(nodes.length).toBe(0);
    expect(links.length).toBe(0);
  });
});
