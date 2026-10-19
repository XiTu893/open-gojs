/**
 * Mermaid treeView-beta（文件树）语法分析器。
 *
 * 支持：
 *  - 头行 `treeView-beta`
 *  - 缩进定义深度；尾部 `/` = 目录（dir:true）
 *  - 行内 `## 描述` → desc
 *  - 引号标签支持空格（自动去引号）
 *  - box-drawing 行（├──/└──/│ 前缀，按分支字符列位置推深度）
 *  - 忽略 :::class 行与 icon(...)（容错不抛异常）
 */
import { TreeViewAST, TreeItem } from '../ast';

type TVItem = TreeItem & { desc?: string };

function stripCommentLines(src: string): string[] {
  const out: string[] = [];
  for (const raw of src.split(/\r?\n/)) {
    const noComment = raw.replace(/%%.*$/, '');
    out.push(noComment);
  }
  return out;
}

function indentOf(line: string): number {
  const m = /^[ \t]*/.exec(line)!;
  return m[0].replace(/\t/g, '    ').length;
}

/** 解析单行 label：去 icon()、引号、尾部 /、## desc */
function parseLabel(raw: string): TVItem {
  let s = raw.replace(/icon\([^)]*\)\s*/g, '').trim();
  let desc: string | undefined;
  const dm = /^(.*?)\s*##\s*(.+)$/.exec(s);
  if (dm) {
    s = dm[1].trim();
    desc = dm[2].trim();
  }
  let dir = false;
  const qm = /^"([^"]*)"\s*(.*)$/.exec(s);
  if (qm) {
    s = qm[1];
    const rest = qm[2].trim();
    if (rest.endsWith('/')) dir = true;
  } else if (s.endsWith('/')) {
    dir = true;
    s = s.slice(0, -1).trim();
  }
  const item: TVItem = { depth: 0, text: s };
  if (dir) item.dir = true;
  if (desc) item.desc = desc;
  return item;
}

/** box-drawing 行 → 深度 + label；非 box 行返回 null */
function parseBoxLine(line: string): { depth: number; label: string } | null {
  const m = /^([│ ]*)([├└])(─+)\s*(.*)$/.exec(line);
  if (!m) return null;
  const depth = Math.floor(m[1].length / 4);
  return { depth, label: m[4].trim() };
}

/** 判断是否 treeView */
export function isTreeView(text: string): boolean {
  return /^treeview-beta\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 treeView DSL */
export function parseTreeView(src: string): TreeViewAST {
  const nodes: TVItem[] = [];
  const lines = stripCommentLines(src);
  let sawHeader = false;
  const stack: number[] = [];

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (/^:::/.test(trimmed)) continue; // :::class 忽略
    if (!sawHeader) {
      sawHeader = true;
      if (/^treeview-beta\b/i.test(trimmed)) continue;
    }
    const box = parseBoxLine(raw.trim());
    if (box) {
      const item = parseLabel(box.label);
      item.depth = box.depth;
      if (item.text) nodes.push(item);
      continue;
    }
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
    const item = parseLabel(trimmed);
    if (!item.text) continue;
    item.depth = depth;
    nodes.push(item);
  }
  return { kind: 'treeview', nodes };
}
