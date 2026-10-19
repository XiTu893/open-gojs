import { describe, it, expect } from 'vitest';
import { parseRequirement, isRequirement } from '../src/mermaid/parser/requirement';
import { mapRequirement } from '../src/mermaid/mapper/requirement';

describe('requirementDiagram', () => {
  it('isRequirement 识别头行', () => {
    expect(isRequirement('requirementDiagram\nr1 { id: r1 }')).toBe(true);
    expect(isRequirement('flowchart TD\na-->b')).toBe(false);
  });

  it('解析需求/元素节点与字段（去引号、注释跳过）', () => {
    const ast = parseRequirement(`
requirementDiagram
requirement r1 {
  id: "R1"
  text: 系统应支持登录
  risk: high
  verifymethod: test
}
element e1 {
  type: block
  docref: "doc.md"
}
%% 这是注释
r1 -satisfies-> e1
`);
    expect(ast.kind).toBe('requirement');
    expect(ast.nodes).toHaveLength(2);
    const r1 = ast.nodes.find(n => n.name === 'r1')!;
    expect(r1.kind).toBe('requirement');
    expect(r1.id).toBe('R1');
    expect(r1.text).toBe('系统应支持登录');
    expect(r1.risk).toBe('high');
    expect(r1.verifymethod).toBe('test');
    const e1 = ast.nodes.find(n => n.name === 'e1')!;
    expect(e1.kind).toBe('element');
    expect(e1.type).toBe('block');
    expect(e1.docref).toBe('doc.md');
    expect(ast.relations).toHaveLength(1);
    expect(ast.relations[0]).toEqual({ from: 'r1', to: 'e1', type: 'satisfies' });
  });

  it('未知类型关系被忽略；反向关系取反方向', () => {
    const ast = parseRequirement(`
requirementDiagram
requirement a { id: A }
requirement b { id: B }
a -bogus-> b
b <-verifies- a
`);
    expect(ast.relations).toHaveLength(1);
    expect(ast.relations[0]).toEqual({ from: 'a', to: 'b', type: 'verifies' });
  });

  it('functionalRequirement/interfaceRequirement 归为 requirement 节点', () => {
    const ast = parseRequirement(`
requirementDiagram
functionalRequirement f1 { id: F1 text: xx }
interfaceRequirement i1 { id: I1 text: yy }
`);
    expect(ast.nodes).toHaveLength(2);
    expect(ast.nodes.every(n => n.kind === 'requirement')).toBe(true);
  });

  it('mapper：分层布局、颜色黑白、连线保留标签', () => {
    const ast = parseRequirement(`
requirementDiagram
requirement r1 { id: R1 text: 登录 }
requirement r2 { id: R2 text: 校验 }
element e1 { type: block }
r1 -derives-> r2
r2 -satisfies-> e1
`);
    const { nodes, links, dir } = mapRequirement(ast);
    expect(dir).toBe('TD');
    expect(nodes).toHaveLength(3);
    for (const n of nodes) {
      expect(n.loc).toMatch(/^-?\d+ -?\d+$/);
      expect(n.w).toBeGreaterThan(0);
      expect(n.h).toBeGreaterThan(0);
      expect(n.fill).toBe('#ffffff');
      expect(n.stroke).toBe('#000000');
      expect(n.textCol).toBe('#000000');
    }
    // 分层：r1 在 r2 上方，r2 在 e1 上方（y 递增）
    const y = (k: string) => parseInt(nodes.find(n => n.key === k)!.loc.split(' ')[1], 10);
    expect(y('r1')).toBeLessThan(y('r2'));
    expect(y('r2')).toBeLessThan(y('e1'));
    expect(links).toHaveLength(2);
    expect(links[0]).toEqual({ from: 'r1', to: 'r2', label: 'derives' });
    expect(links[1]).toEqual({ from: 'r2', to: 'e1', label: 'satisfies' });
  });

  it('mapper：BT 方向镜像（下游在上）', () => {
    const ast = parseRequirement(`
requirementDiagram
direction BT
requirement r1 { id: R1 text: a }
requirement r2 { id: R2 text: b }
r1 -derives-> r2
`);
    const { nodes } = mapRequirement(ast);
    const y = (k: string) => parseInt(nodes.find(n => n.key === k)!.loc.split(' ')[1], 10);
    expect(y('r2')).toBeLessThan(y('r1'));
  });

  it('mapper：两端未知节点的连线被丢弃', () => {
    const ast = parseRequirement(`
requirementDiagram
requirement r1 { id: R1 text: a }
r1 -verifies-> ghost
`);
    const { links } = mapRequirement(ast);
    expect(links).toHaveLength(0);
  });
});
