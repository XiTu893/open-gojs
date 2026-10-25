import { describe, it, expect } from 'vitest';
import { parseZenUML, isZenUML } from '../extension/mermaid/parser/zenuml';

describe('mermaid zenuml parser', () => {
  it('detects zenuml header', () => {
    expect(isZenUML('zenuml\nA->B: hi')).toBe(true);
    expect(isZenUML('  Zenuml\n')).toBe(true);
    expect(isZenUML('sequenceDiagram\nA->>B')).toBe(false);
  });

  it('produces SequenceAST with participants, arrows, title and shared line order', () => {
    const ast = parseZenUML(`zenuml
title 登录流程
// 注释行
A->B: 请求登录
B-->A: 返回令牌
while(重试) {
  A->B: 再次请求
}`);
    expect(ast.kind).toBe('sequence');
    expect(ast.title).toBe('登录流程');
    expect(ast.participants.map(p => p.id)).toEqual(['A', 'B']);
    expect(ast.participants[0].type).toBe('participant');
    expect(ast.messages.length).toBe(3);
    expect(ast.messages[0]).toEqual({ from: 'A', to: 'B', arrow: '->>', label: '请求登录', line: 0 });
    expect(ast.messages[1].arrow).toBe('-->>');
    expect(ast.messages[1].line).toBe(1);
    // notes 与 messages 共享 line 序号空间：block 在消息之前
    expect(ast.notes.length).toBe(1);
    expect(ast.notes[0]).toMatchObject({ kind: 'loop', text: '重试', line: 2 });
    expect(ast.messages[2].line).toBe(3);
    expect(ast.activations).toEqual([]);
  });

  it('maps block heads to notes (alt/opt/par) and creation messages', () => {
    const ast = parseZenUML(`zenuml
A.new B: 创建会话
if(已登录) {
  A->B: 直接进入
} else {
  A->C: 跳转登录
}
opt {
  B->A: 缓存提示
}
par {
  A->C: 并行一
}
try {
  A->B: 尝试
}
A-->>B: 收尾`);
    expect(ast.messages[0]).toMatchObject({ from: 'A', to: 'B', arrow: '->>', label: '创建会话', line: 0 });
    expect(ast.participants.map(p => p.id)).toEqual(['A', 'B', 'C']);
    const kinds = ast.notes.map(n => n.kind);
    expect(kinds).toEqual(['alt', 'alt', 'opt', 'par', 'alt']);
    expect(ast.notes[0].text).toBe('已登录');
    expect(ast.notes[1].text).toBe('else');
    expect(ast.notes[4].text).toBe('try');
    // 消息穿插在 note 之间，line 单调递增且共享序号空间
    const all = [
      ...ast.messages.map(m => m.line),
      ...ast.notes.map(n => n.line),
    ].sort((x, y) => x - y);
    expect(all).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(ast.messages[ast.messages.length - 1].arrow).toBe('-->>');
  });

  it('parses ->> -->> variants and empty labels; ignores unknown lines', () => {
    const ast = parseZenUML(`zenuml
A->>B: 同步
A-->>B:
A->B: 未知行忽略?
random garbage line
%% mermaid 注释`);
    expect(ast.messages.length).toBe(3);
    expect(ast.messages[0].arrow).toBe('->>');
    expect(ast.messages[1].arrow).toBe('-->>');
    expect(ast.messages[1].label).toBe('');
    expect(ast.messages[2].label).toBe('未知行忽略?');
    expect(ast.participants.map(p => p.id)).toEqual(['A', 'B']);
  });

  it('handles nested blocks and closing braces without throwing', () => {
    const ast = parseZenUML(`zenuml
while(外层) {
  if(内层) {
    A->B: 深层消息
  }
  A-->C: 外层消息
}`);
    expect(ast.notes.length).toBe(2);
    expect(ast.notes[0].kind).toBe('loop');
    expect(ast.notes[1].kind).toBe('alt');
    expect(ast.messages.length).toBe(2);
    expect(ast.participants.map(p => p.id)).toEqual(['A', 'B', 'C']);
    expect(() => parseZenUML('zenuml\n}\n}')).not.toThrow();
  });
});
