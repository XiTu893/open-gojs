import { describe, it, expect } from 'vitest';
import { parsePie, isPie } from '../extension/mermaid/parser/pie';
import { parseGantt, isGantt } from '../extension/mermaid/parser/gantt';
import { Mermaid } from '../extension/mermaid/index';

describe('mermaid pie parser', () => {
  it('detects pie', () => {
    expect(isPie('pie title Pets\n"dogs": 10')).toBe(true);
    expect(isPie('flowchart TD\nA-->B')).toBe(false);
  });

  it('parses title and slices', () => {
    const ast = parsePie(`pie title 宠物
      "dogs": 10
      "cats": 8
      "fish": 5`);
    expect(ast.title).toBe('宠物');
    expect(ast.data.length).toBe(3);
    expect(ast.data[0]).toEqual({ label: 'dogs', value: 10 });
    expect(ast.data[2]).toEqual({ label: 'fish', value: 5 });
  });

  it('handles showData and unquoted labels', () => {
    const ast = parsePie(`pie
      showData
      dogs : 6
      cats : 4`);
    expect(ast.data.length).toBe(2);
    expect(ast.data[0].label).toBe('dogs');
  });
});

describe('mermaid gantt parser', () => {
  it('detects gantt', () => {
    expect(isGantt('gantt\ntitle X')).toBe(true);
    expect(isPie('flowchart TD\nA-->B')).toBe(false);
  });

  it('parses title, sections, and tasks', () => {
    const ast = parseGantt(`gantt
      title 项目计划
      dateFormat YYYY-MM-DD
      section 设计
      需求分析 :a1, 2024-01-01, 3d
      概要设计 :a2, 2024-01-04, 2d
      section 开发
      编码 :a3, after a1, 5d`);
    expect(ast.title).toBe('项目计划');
    expect(ast.dateFormat).toBe('YYYY-MM-DD');
    expect(ast.sections.length).toBe(2);
    expect(ast.sections[0].name).toBe('设计');
    expect(ast.sections[0].tasks.length).toBe(2);
    expect(ast.sections[0].tasks[0].name).toBe('需求分析');
    expect(ast.sections[0].tasks[0].start).toBe('2024-01-01');
    expect(ast.sections[1].tasks[0].start).toBe('after a1');
  });
});

describe('Mermaid namespace all types', () => {
  it('parses all 7 types', () => {
    expect(Mermaid.parse('flowchart TD\nA-->B').type).toBe('flowchart');
    expect(Mermaid.parse('sequenceDiagram\nA->>B').type).toBe('sequence');
    expect(Mermaid.parse('classDiagram\nA<|--B').type).toBe('class');
    expect(Mermaid.parse('stateDiagram\n[*]-->S').type).toBe('state');
    expect(Mermaid.parse('erDiagram\nA ||--|| B : x').type).toBe('er');
    expect(Mermaid.parse('pie\n"a": 1').type).toBe('pie');
    expect(Mermaid.parse('gantt\ntitle X').type).toBe('gantt');
  });
});