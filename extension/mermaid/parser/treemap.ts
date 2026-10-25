/**
 * Mermaid treemap-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `treemap-beta`
 *  - 缩进层级；`"名称"` 或 `名称` = 分支；`"名称": 数值` 或 `名称: 数值` = 叶子（value）
 *  - `%%` 注释行跳过，无法识别行忽略（容错不抛异常）
 */
import { TreemapAST, TreeItem } from '../ast';

function stripCommentLines(src: string): string[] {
  return src.split(/\r?\n/).map((raw) => raw.replace(/%%.*$/, ''));
}

function indentOf(line: string): number {
  const m = /^[ \t]*/.exec(line)!;
  return m[0].replace(/\t/g, '    ').length;
}

/** 解析一行：返回 { text, value? }，无法识别返回 null */
function parseLine(raw: string): { text: string; value?: number } | null {
  const s = raw.trim();
  if (!s) return null;
  const m = /^(?:"([^"]+)"|([^:"]+?))\s*(?::\s*(-?\d+(?:\.\d+)?))?\s*$/.exec(s);
  if (!m) return null;
  const text = (m[1] ?? m[2] ?? '').trim();
  if (!text) return null;
  if (m[3] !== undefined) {
    const v = parseFloat(m[3]);
    if (!Number.isNaN(v)) return { text, value: v };
  }
  return { text };
}

/** 判断是否 treemap */
export function isTreemap(text: string): boolean {
  return /^treemap-beta\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 treemap DSL */
export function parseTreemap(src: string): TreemapAST {
  const nodes: TreeItem[] = [];
  const lines = stripCommentLines(src);
  let sawHeader = false;
  const stack: number[] = [];

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (!sawHeader) {
      sawHeader = true;
      if (/^treemap-beta\b/i.test(trimmed)) continue;
    }
    const parsed = parseLine(trimmed);
    if (!parsed) continue;
    const indent = indentOf(raw);
    if (stack.length === 0) stack.push(indent);
    let depth: number;
    if (indent > stack[stack.length - 1]) {
      stack.push(indent);
      depth = stack.length - 1;
    } else {
      while (stack.length > 1 && indent < stack[stack.length - 1]) stack.pop();
      depth = stack.length - 1;
    }
    const item: TreeItem = { depth, text: parsed.text };
    if (parsed.value !== undefined) item.value = parsed.value;
    nodes.push(item);
  }
  return { kind: 'treemap', nodes };
}
