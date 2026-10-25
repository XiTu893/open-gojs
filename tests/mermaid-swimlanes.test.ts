import { describe, it, expect } from 'vitest';
import { parseSwimlanes, isSwimlanes } from '../extension/mermaid/parser/swimlanes';

const DSL = `swimlane-beta
subgraph 财务[财务部]
  a[提交报销] --> b[审核]
end
subgraph IT[技术部]
  c[部署系统]
end
b --> c
`;

describe('mermaid swimlanes parser', () => {
  it('detects swimlane-beta header', () => {
    expect(isSwimlanes(DSL)).toBe(true);
    expect(isSwimlanes('swimlane-beta LR\nsubgraph A\nend')).toBe(true);
    expect(isSwimlanes('flowchart TD\nA --> B')).toBe(false);
    expect(isSwimlanes('zenuml\nA->B')).toBe(false);
  });

  it('reuses flowchart parsing: subgraphs become swimlanes', () => {
    const ast = parseSwimlanes(DSL);
    expect(ast.kind).toBe('flowchart');
    expect(ast.dir).toBe('TB');
    expect(ast.subgraphs.length).toBe(2);
    expect(ast.subgraphs[0].id).toBe('财务');
    expect(ast.subgraphs[0].title).toBe('财务部');
    expect(ast.subgraphs[0].nodes).toEqual(['a', 'b']);
    expect(ast.subgraphs[1].id).toBe('IT');
    expect(ast.subgraphs[1].title).toBe('技术部');
    expect(ast.subgraphs[1].nodes).toEqual(['c']);
  });

  it('keeps nodes, node groups and cross-lane edges', () => {
    const ast = parseSwimlanes(DSL);
    const by = (id: string) => ast.nodes.find(n => n.id === id);
    expect(by('a')!.text).toBe('提交报销');
    expect(by('a')!.group).toBe('财务');
    expect(by('c')!.group).toBe('IT');
    expect(by('b')!.group).toBe('财务');
    expect(ast.edges.length).toBe(2);
    expect(ast.edges[0]).toMatchObject({ from: 'a', to: 'b', kind: 'solid', arrow: 'forward' });
    expect(ast.edges[1]).toMatchObject({ from: 'b', to: 'c' });
    expect(ast.edges[1].label).toBeUndefined();
  });

  it('honors direction on the header line', () => {
    expect(parseSwimlanes('swimlane-beta LR\nsubgraph G\n  x[y]\nend').dir).toBe('LR');
    expect(parseSwimlanes('swimlane-beta BT\nx --> y').dir).toBe('BT');
    expect(parseSwimlanes('swimlane-beta\nx --> y').dir).toBe('TB');
    expect(parseSwimlanes('swimlane-beta XX\nx --> y').dir).toBe('TB');
  });

  it('tolerates comments, unknown lines and edge labels', () => {
    const ast = parseSwimlanes(`swimlane-beta
%% 泳道注释
// 注释
subgraph G1[组]
  s[开始] -->|是| t{判断}
  t -->|否| e[结束]
end
无意义行`);
    expect(ast.subgraphs.length).toBe(1);
    // 复用 flowchart 语义：裸词行会被当作节点 id 建节点（不报错即容错）
    expect(ast.nodes.map(n => n.id)).toEqual(['s', 't', 'e', '无意义行']);
    expect(ast.nodes.find(n => n.id === 't')!.shape).toBe('diamond');
    expect(ast.edges.length).toBe(2);
    expect(ast.edges[0].label).toBe('是');
    expect(ast.edges[1].label).toBe('否');
    expect(() => parseSwimlanes('swimlane-beta\nsubgraph\nend')).not.toThrow();
  });
});
