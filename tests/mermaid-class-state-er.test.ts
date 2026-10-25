import { describe, it, expect } from 'vitest';
import { parseClass, isClass } from '../extension/mermaid/parser/class';
import { parseState, isState } from '../extension/mermaid/parser/state';
import { parseEr, isEr } from '../extension/mermaid/parser/er';
import { Mermaid } from '../extension/mermaid/index';

describe('mermaid class parser', () => {
  it('detects classDiagram', () => {
    expect(isClass('classDiagram\nA<|--B')).toBe(true);
    expect(isClass('flowchart TD\nA-->B')).toBe(false);
  });

  it('parses class members', () => {
    const ast = parseClass(`classDiagram
      class Animal {
        +String name
        -int age
        +makeSound(): void
      }`);
    const animal = ast.classes.find(c => c.name === 'Animal')!;
    expect(animal).toBeDefined();
    expect(animal.members.length).toBe(3);
    expect(animal.members[0].visibility).toBe('+');
    expect(animal.members[0].isMethod).toBe(false);
    expect(animal.members[2].isMethod).toBe(true);
  });

  it('parses relations', () => {
    const ast = parseClass(`classDiagram
      Animal <|-- Dog
      Dog *-- Bone
      Dog ..> Bone : eats
      Animal <|-- Cat`);
    expect(ast.relations.length).toBe(4);
    expect(ast.relations[0].kind).toBe('inheritance');
    expect(ast.relations[1].kind).toBe('composition');
    expect(ast.relations[2].kind).toBe('dependency');
    expect(ast.relations[2].label).toBe('eats');
  });

  it('creates classes from relations', () => {
    const ast = parseClass('classDiagram\nA <|-- B');
    expect(ast.classes.map(c => c.name).sort()).toEqual(['A', 'B']);
  });
});

describe('mermaid state parser', () => {
  it('detects stateDiagram', () => {
    expect(isState('stateDiagram-v2\nS1 --> S2')).toBe(true);
    expect(isState('flowchart TD\nA-->B')).toBe(false);
  });

  it('parses states and transitions', () => {
    const ast = parseState(`stateDiagram-v2
      [*] --> Idle
      Idle --> Running : start
      Running --> [*]`);
    expect(ast.states.length).toBe(3);
    expect(ast.states.find(s => s.id === '[*]')!.isStart).toBe(true);
    expect(ast.transitions.length).toBe(3);
    expect(ast.transitions[1].label).toBe('start');
  });

  it('parses state with alias', () => {
    const ast = parseState('stateDiagram-v2\nstate "运行中" as Run\nRun --> [*]');
    const run = ast.states.find(s => s.id === 'Run')!;
    expect(run.label).toBe('运行中');
  });
});

describe('mermaid er parser', () => {
  it('detects erDiagram', () => {
    expect(isEr('erDiagram\nA ||--o{ B : has')).toBe(true);
    expect(isEr('flowchart TD\nA-->B')).toBe(false);
  });

  it('parses relations with cardinality', () => {
    const ast = parseEr(`erDiagram
      CUSTOMER ||--o{ ORDER : places`);
    expect(ast.entities.map(e => e.name).sort()).toEqual(['CUSTOMER', 'ORDER']);
    expect(ast.relations.length).toBe(1);
    expect(ast.relations[0].label).toBe('places');
  });

  it('parses entity attribute blocks', () => {
    const ast = parseEr(`erDiagram
      CUSTOMER {
        string name
        int id PK
      }
      CUSTOMER ||--o{ ORDER : places`);
    const cust = ast.entities.find(e => e.name === 'CUSTOMER')!;
    expect(cust.attrs.length).toBe(2);
    expect(cust.attrs[1].isKey).toBe(true);
    expect(cust.attrs[0].type).toBe('string');
  });
});

describe('Mermaid namespace integration', () => {
  it('parses class/state/er via namespace', () => {
    expect(Mermaid.parse('classDiagram\nA<|--B').type).toBe('class');
    expect(Mermaid.parse('stateDiagram\n[*]-->S').type).toBe('state');
    expect(Mermaid.parse('erDiagram\nA ||--|| B : x').type).toBe('er');
  });
});