import { describe, it, expect } from 'vitest';
import { parseFlowchart, isFlowchart } from '../src/mermaid/parser/flowchart';

describe('mermaid flowchart parser', () => {
  it('detects flowchart headers', () => {
    expect(isFlowchart('flowchart TD\nA --> B')).toBe(true);
    expect(isFlowchart('graph LR\nA --> B')).toBe(true);
    expect(isFlowchart('sequenceDiagram\nA->>B')).toBe(false);
  });

  it('parses direction', () => {
    expect(parseFlowchart('flowchart LR\nA --> B').dir).toBe('LR');
    expect(parseFlowchart('graph TB\nA --> B').dir).toBe('TB');
    expect(parseFlowchart('flowchart\nA --> B').dir).toBe('TD');
  });

  it('parses nodes with shapes', () => {
    const ast = parseFlowchart(`flowchart TD
      A[开始] --> B{判断}
      C[(db)] --> D((circle))
      E[[sub]] --> F([stadium])
      G{{hex}} --> H[/io/]`);
    const by = (id: string) => ast.nodes.find(n => n.id === id);
    expect(by('A')!.shape).toBe('process');
    expect(by('B')!.shape).toBe('diamond');
    expect(by('C')!.shape).toBe('cylinder');
    expect(by('D')!.shape).toBe('circle');
    expect(by('E')!.shape).toBe('subroutine');
    expect(by('F')!.shape).toBe('stadium');
    expect(by('G')!.shape).toBe('hexagon');
    expect(by('H')!.shape).toBe('parallelogram');
    expect(by('A')!.text).toBe('开始');
  });

  it('parses edges with kinds and labels', () => {
    const ast = parseFlowchart(`flowchart TD
      A --> B
      A --- C
      A ==> D
      A -.-> E
      A -->|是| F
      A -->|否| B`);
    expect(ast.edges.length).toBe(6);
    expect(ast.edges[0].kind).toBe('solid');
    expect(ast.edges[1].kind).toBe('solid');
    expect(ast.edges[1].arrow).toBe('none');
    expect(ast.edges[2].kind).toBe('thick');
    expect(ast.edges[3].kind).toBe('dotted');
    expect(ast.edges[4].label).toBe('是');
    expect(ast.edges[5].label).toBe('否');
  });

  it('parses subgraph blocks', () => {
    const ast = parseFlowchart(`flowchart TD
      subgraph one[组一]
        A --> B
      end
      C --> D`);
    expect(ast.subgraphs.length).toBe(1);
    expect(ast.subgraphs[0].id).toBe('one');
    expect(ast.subgraphs[0].title).toBe('组一');
    expect(ast.subgraphs[0].nodes).toContain('A');
    expect(ast.subgraphs[0].nodes).toContain('B');
    expect(ast.nodes.find(n => n.id === 'C')!.group).toBeUndefined();
  });

  it('parses classDef', () => {
    const ast = parseFlowchart(`flowchart TD
      classDef ok fill:#2f9e44,color:#fff
      A --> B
      class A ok`);
    expect(ast.classDefs.length).toBe(1);
    expect(ast.classDefs[0].name).toBe('ok');
    expect(ast.classDefs[0].fill).toBe('#2f9e44');
  });

  it('ignores comments', () => {
    const ast = parseFlowchart(`flowchart TD
      %% comment line
      A --> B`);
    expect(ast.nodes.length).toBe(2);
    expect(ast.edges.length).toBe(1);
  });

  it('handles chained edges on one line', () => {
    const ast = parseFlowchart('flowchart TD\nA --> B --> C');
    expect(ast.edges.length).toBe(2);
    expect(ast.edges[0].from).toBe('A');
    expect(ast.edges[0].to).toBe('B');
    expect(ast.edges[1].from).toBe('B');
    expect(ast.edges[1].to).toBe('C');
  });

  it('handles glued arrows (A-->B) without breaking hyphen ids (A-B)', () => {
    const ast = parseFlowchart('flowchart TD\nA-->|是|B\nA-B-->C\nE -.-> F');
    expect(ast.edges.length).toBe(3);
    expect(ast.edges[0].from).toBe('A');
    expect(ast.edges[0].to).toBe('B');
    expect(ast.edges[0].label).toBe('是');
    expect(ast.edges[1].from).toBe('A-B');
    expect(ast.nodes.map(n => n.id)).toContain('A-B');
  });

  it('parses multi-id class assignment (class A,B cls)', () => {
    const ast = parseFlowchart('flowchart TD\nclassDef ok fill:#2f9e44\nA --> B\nC --> D\nclass A, C ok');
    expect(ast.nodes.find(n => n.id === 'A')!.style).toEqual(['ok']);
    expect(ast.nodes.find(n => n.id === 'C')!.style).toEqual(['ok']);
    expect(ast.nodes.find(n => n.id === 'B')!.style).toBeUndefined();
  });
});