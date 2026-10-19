/**
 * Mermaid ishikawa-beta（鱼骨图）语法分析器。
 *
 * 支持：
 *  - 头行 `ishikawa-beta`
 *  - 首个无缩进非空行 = 问题（鱼头）
 *  - 后续无缩进行 = 类别；缩进行 = 该类别下的原因
 *  - `%%` 注释行跳过，无法识别行忽略（容错不抛异常）
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
  let sawHeader = false;

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (!sawHeader) {
      sawHeader = true;
      if (/^ishikawa-beta\b/i.test(trimmed)) continue;
    }
    const indented = indentOf(raw) > 0;
    if (!indented) {
      if (!ast.problem) {
        ast.problem = trimmed;
      } else {
        ast.categories.push({ name: trimmed, causes: [] });
      }
    } else {
      // 缩进行：归入最近类别；没有类别则容错丢弃
      if (ast.categories.length > 0) {
        ast.categories[ast.categories.length - 1].causes.push(trimmed);
      }
    }
  }
  return ast;
}
