import { describe, it, expect } from 'vitest';
import { parseSequence, isSequence } from '../extension/mermaid/parser/sequence';

describe('mermaid sequence parser', () => {
  it('detects sequence header', () => {
    expect(isSequence('sequenceDiagram\nA->>B')).toBe(true);
    expect(isSequence('flowchart TD\nA-->B')).toBe(false);
  });

  it('parses participants with aliases', () => {
    const ast = parseSequence(`sequenceDiagram
      participant A as Alice
      participant B
      actor C`);
    expect(ast.participants.length).toBe(3);
    expect(ast.participants[0].alias).toBe('Alice');
    expect(ast.participants[1].alias).toBe('B');
    expect(ast.participants[2].type).toBe('actor');
  });

  it('parses messages with arrow kinds and labels', () => {
    const ast = parseSequence(`sequenceDiagram
      A->>B: 请求
      B-->>A: 响应
      A-)B: 异步
      A-xB: 丢弃`);
    expect(ast.messages.length).toBe(4);
    expect(ast.messages[0].arrow).toBe('->>');
    expect(ast.messages[0].label).toBe('请求');
    expect(ast.messages[1].arrow).toBe('-->>');
    expect(ast.messages[2].arrow).toBe('-)');
    expect(ast.messages[3].arrow).toBe('-x');
  });

  it('auto-creates participants from messages', () => {
    const ast = parseSequence('sequenceDiagram\nX->>Y: hi');
    expect(ast.participants.map(p => p.id)).toEqual(['X', 'Y']);
  });

  it('parses notes', () => {
    const ast = parseSequence(`sequenceDiagram
      A->>B: msg
      note over A,B: 说明
      note left of A: 左注`);
    const notes = ast.notes.filter(n => n.kind === 'note');
    expect(notes.length).toBe(2);
    expect(notes[0].actors).toEqual(['A', 'B']);
  });

  it('parses title and activations', () => {
    const ast = parseSequence(`sequenceDiagram
      title 时序图
      A->>B: hi
      activate B
      B->>A: yo
      deactivate B`);
    expect(ast.title).toBe('时序图');
    expect(ast.activations.length).toBe(2);
    expect(ast.activations[0].activate).toBe(true);
    expect(ast.activations[1].activate).toBe(false);
  });

  it('preserves label spacing with indented DSL', () => {
    const ast = parseSequence(`sequenceDiagram
      participant U as 用户
      U->>G: POST /api/login
      G-->>U: 200 OK`);
    expect(ast.participants[0].alias).toBe('用户');
    expect(ast.messages[0].label).toBe('POST /api/login');
    expect(ast.messages[1].label).toBe('200 OK');
  });
});