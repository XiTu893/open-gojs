import { describe, it, expect } from 'vitest';
import { tokenize, stripComments } from '../extension/mermaid/lexer';

describe('mermaid lexer', () => {
  it('tokenizes a simple flowchart', () => {
    const src = `flowchart TD
  A[开始] --> B{判断}
  B -->|是| C[处理]
`;
    const toks = stripComments(tokenize(src));
    const values = toks.map(t => t.value);
    expect(values).toContain('flowchart');
    expect(values).toContain('TD');
    expect(values).toContain('-->');
    expect(values).toContain('是');
  });

  it('handles dotted/thick arrows', () => {
    const src = `A -.-> B
C ==> D
E --- F`;
    const toks = stripComments(tokenize(src));
    const arrows = toks.filter(t => t.kind === 'arrow').map(t => t.value);
    expect(arrows).toContain('-.->');
    expect(arrows).toContain('==>');
    expect(arrows).toContain('---');
  });

  it('ignores comments', () => {
    const src = `%% this is a comment
A --> B`;
    const toks = tokenize(src);
    expect(toks.filter(t => t.kind === 'comment').length).toBeGreaterThan(0);
    const stripped = stripComments(toks);
    expect(stripped.some(t => t.value.includes('comment'))).toBe(false);
  });

  it('handles shapes', () => {
    const src = `A[(database)] --> B[[subroutine]]
C((circle)) --> D{{hexagon}}`;
    const toks = stripComments(tokenize(src));
    const opens = toks.filter(t => t.kind === 'shapeOpen').map(t => t.value);
    expect(opens).toContain('[(');
    expect(opens).toContain('[[');
    expect(opens).toContain('((');
    expect(opens).toContain('{{');
  });

  it('handles quoted strings', () => {
    const src = `A -->|"hello world"| B`;
    const toks = stripComments(tokenize(src));
    expect(toks.some(t => t.kind === 'str' && t.value === 'hello world')).toBe(true);
  });
});