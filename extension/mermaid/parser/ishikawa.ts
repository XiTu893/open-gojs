/**
 * Mermaid ishikawa-beta（鱼骨图）语法分析器。
 *
 * 支持（对齐官方：相对缩进，允许整段整体缩进）：
 *  - 头行 `ishikawa-beta`
 *  - 基准缩进 = 内容行的最小缩进；首个基准缩进行 = 问题（鱼头）
 *  - 与基准同缩进的后续行 = 类别；更深缩进 = 当前类别的原因
 *  - 无类别之前的深缩进行丢弃（容错不抛异常）
 *  - `%%` 注释行、空行跳过
 */
import { IshikawaAST } from '../ast';

function stripCommentLines(src: string): string[] {
  return src.split(/\r?\n/).map((raw) => raw.replace(/%%.*$/, ''));
}

function indentOf(line: string): number {
  const m = /^[ \t]*/.exec(line)!;
  return m[0].replace(/\t/g, '    ').length;
}

/** 判断是否 ishikawa */
export function isIshikawa(text: string): boolean {
  return /^ishikawa-beta\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 ishikawa DSL */
export function parseIshikawa(src: string): IshikawaAST {
  const ast: IshikawaAST = { kind: 'ishikawa', problem: '', categories: [] };
  const lines = stripCommentLines(src);

  // 第一遍：跳过头行，收集内容行（缩进 + 文本）
  const content: { indent: number; text: string }[] = [];
  let sawHeader = false;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (!sawHeader) {
      sawHeader = true;
      if (/^ishikawa-beta\b/i.test(trimmed)) continue;
    }
    content.push({ indent: indentOf(raw), text: trimmed });
  }
  if (!content.length) return ast;

  // 第二遍：基准缩进 = 最小缩进；首个基准行 = 问题
  const base = Math.min(...content.map((c) => c.indent));
  for (const c of content) {
    if (!ast.problem) {
      if (c.indent === base) ast.problem = c.text;
      continue; // 问题之前的更深缩进行丢弃（容错）
    }
    if (c.indent <= base) {
      ast.categories.push({ name: c.text, causes: [] });
    } else if (ast.categories.length > 0) {
      ast.categories[ast.categories.length - 1].causes.push(c.text);
    }
    // 深缩进但无类别：容错丢弃
  }
  return ast;
}
