/**
 * Mermaid mindmap 语法分析器。
 *
 * 支持：
 *  - 头行 `mindmap`
 *  - 缩进树（首非空行 = 根）
 *  - 形状括号：((文本))=circle/root、[文本]=square、(文本)=rounded、{{文本}}=hexagon、纯文本=rounded
 *  - `%%` 注释行跳过，无法识别行忽略（容错不抛异常）
 */
import { MindmapAST, MindmapNode } from '../ast';

/** 去掉 %% 注释（整行或行尾），并换行拆分 */
function stripComments(src: string): string[] {
  const out: string[] = [];
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.replace(/%%.*$/, '');
    out.push(line);
  }
  return out;
}

/** 计算缩进（tab 按 4 空格） */
function indentOf(line: string): number {
  const m = /^[ \t]*/.exec(line)!;
  return m[0].replace(/\t/g, '    ').length;
}

/** 解析形状括号 → { text, shape }；isRoot 时 ((x)) 与纯文本 → 'root' */
function shapeOf(raw: string, isRoot: boolean): { text: string; shape: MindmapNode['shape'] } {
  let s = raw.trim();
  // mermaid 节点可带 id 前缀：root((mindmap))、A[text]
  const idm = /^[A-Za-z_][\w-]*(?=[\[(\{])/.exec(s);
  if (idm) s = s.slice(idm[0].length);
  let m = /^\(\((.*)\)\)$/.exec(s);
  if (m) return { text: m[1].trim(), shape: isRoot ? 'root' : 'circle' };
  m = /^\{\{(.*)\}\}$/.exec(s);
  if (m) return { text: m[1].trim(), shape: 'hexagon' };
  m = /^\[(.*)\]$/.exec(s);
  if (m) return { text: m[1].trim(), shape: 'square' };
  m = /^\((.*)\)$/.exec(s);
  if (m) return { text: m[1].trim(), shape: 'rounded' };
  return { text: s, shape: isRoot ? 'root' : 'rounded' };
}

/** 判断是否 mindmap（首行头，不 trim —— 缩进的首行不算头） */
export function isMindmap(text: string): boolean {
  const first = text.split(/\r?\n/)[0] || '';
  return /^mindmap\b/i.test(first.replace(/\r$/, ''));
}

/** 解析 mindmap DSL */
export function parseMindmap(src: string): MindmapAST {
  const nodes: MindmapNode[] = [];
  const lines = stripComments(src);
  let sawHeader = false;
  const stack: number[] = []; // 缩进栈，用于推 depth

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const indent = indentOf(raw);
    if (!sawHeader) {
      sawHeader = true;
      if (/^mindmap\b/i.test(trimmed)) continue; // 头行
    }
    if (stack.length === 0) stack.push(indent);
    let depth: number;
    if (indent > stack[stack.length - 1]) {
      stack.push(indent);
      depth = stack.length - 1;
    } else {
      while (stack.length > 1 && indent < stack[stack.length - 1]) stack.pop();
      // 介于两级之间时视为同最近的较低级
      depth = stack.length - 1;
    }
    const isRoot = nodes.length === 0;
    const { text, shape } = shapeOf(trimmed, isRoot);
    if (!text) continue;
    nodes.push({ depth: isRoot ? 0 : depth, text, shape });
  }
  return { kind: 'mindmap', nodes };
}
