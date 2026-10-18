import { describe, it, expect } from 'vitest';
import { parseFlowchart } from '../src/mermaid/parser/flowchart';
import { mapFlowchart, categoryOfShape } from '../src/mermaid/mapper/flowchart';
import { Mermaid } from '../src/mermaid/index';

describe('mermaid flowchart mapper', () => {
  it('maps shapes to categories', () => {
    expect(categoryOfShape('process')).toBe('');
    expect(categoryOfShape('diamond')).toBe('Decision');
    expect(categoryOfShape('stadium')).toBe('StartEnd');
    expect(categoryOfShape('cylinder')).toBe('Cylinder');
    expect(categoryOfShape('circle')).toBe('Circle');
    expect(categoryOfShape('hexagon')).toBe('Hexagon');
  });

  it('maps nodes and links', () => {
    const ast = parseFlowchart(`flowchart TD
      A[开始] --> B{判断}
      B -->|是| C[(数据库)]
      B -->|否| D((结束))`);
    const m = mapFlowchart(ast);
    const byKey = (k: string) => m.nodes.find(n => n.key === k);
    expect(byKey('A')!.category).toBe('');
    expect(byKey('B')!.category).toBe('Decision');
    expect(byKey('C')!.category).toBe('Cylinder');
    expect(byKey('D')!.category).toBe('Circle');
    expect(m.links.length).toBe(3);
    expect(m.links[1].label).toBe('是');
    expect(m.links[2].label).toBe('否');
  });

  it('maps arrow kinds to dash/thickness', () => {
    const ast = parseFlowchart(`flowchart TD
      A -.-> B
      A ==> C
      A --- D`);
    const m = mapFlowchart(ast);
    const dotted = m.links.find(l => l.to === 'B')!;
    const thick = m.links.find(l => l.to === 'C')!;
    const plain = m.links.find(l => l.to === 'D')!;
    expect(dotted.strokeDashArray).toBeDefined();
    expect(thick.strokeWidth).toBe(3);
    expect(plain.arrow).toBe('none');
  });

  it('maps subgraph to background box nodes', () => {
    const ast = parseFlowchart(`flowchart LR
      subgraph one[组一]
        A --> B
      end`);
    const m = mapFlowchart(ast);
    const box = m.nodes.find(n => n.category === 'GroupBox')!;
    expect(box.key).toBe('one');
    expect(box.members).toEqual(['A', 'B']);
  });

  it('applies classDef styles', () => {
    const ast = parseFlowchart(`flowchart TD
      classDef ok fill:#2f9e44,color:#fff
      A[开始] --> B[处理]
      class B ok`);
    const m = mapFlowchart(ast);
    const b = m.nodes.find(n => n.key === 'B')!;
    expect(b.categoryDef?.fill).toBe('#2f9e44');
    expect(b.categoryDef?.color).toBe('#fff');
  });

  it('end-to-end parse via Mermaid namespace', () => {
    const r = Mermaid.parse('flowchart LR\nA --> B --> C');
    expect(r.type).toBe('flowchart');
    expect(r.ast).not.toBeNull();
    expect((r.ast as any).nodes.length).toBe(3);
    expect((r.ast as any).edges.length).toBe(2);
  });

  it('detects types', () => {
    expect(Mermaid.detectType('sequenceDiagram\nA->>B')).toBe('sequence');
    expect(Mermaid.detectType('classDiagram\nA<|--B')).toBe('class');
    expect(Mermaid.detectType('pie title x\n"a": 10')).toBe('pie');
  });
});