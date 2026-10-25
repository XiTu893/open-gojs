/**
 * Mermaid quadrantChart 语法分析器。
 *
 * 支持：
 *  - 头行 `quadrantChart`
 *  - `title 标题`
 *  - `x-axis 低 --> 高` / `y-axis 低 --> 高`（无箭头则只有低端标签）
 *  - `quadrant-1..4 文本`
 *  - `points: a[0.3,0.7], b[0.8,0.8], c["标签"][0.6,0.4]`（可不带 `points:` 前缀，
 *    也容忍 mermaid 原生的 `标签: [0.3, 0.7]` 写法）
 *
 * 容错：`%%` 注释跳过、未知行忽略、缺省字段用空值，不抛异常。
 */
import { QuadrantAST } from '../ast';

/** 去注释 + trim + 丢空行 */
function srcLines(src: string): string[] {
  return src.split(/\r?\n/)
    .map(l => l.replace(/%%.*$/, '').trim())
    .filter(l => l.length > 0);
}

/** 去掉首尾引号 */
function unquote(s: string): string {
  const t = s.trim();
  const m = /^["'`](.*)["'`]$/.exec(t);
  return m ? m[1] : t;
}

/** 按 --> / -> / → 拆成左右两段（右段可为空） */
function splitArrow(s: string): [string, string] {
  const m = /^(.*?)\s*(?:-->|->|→)\s*(.*)$/.exec(s);
  if (!m) return [s.trim(), ''];
  return [m[1].trim(), m[2].trim()];
}

/** 点声明正则：`前缀[x, y]`，前缀可为 `张三` 或 `王五["算法专家"]` 或 `Q2 标签:` */
const POINT_RE = /(.+?)\s*(?::)?\s*\[\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\]/g;

/** 行内是否含形如 `[0.3, 0.7]` 的坐标对 */
function hasCoord(s: string): boolean {
  return /\[\s*-?\d*\.?\d+\s*,\s*-?\d*\.?\d+\s*\]/.test(s);
}

/** `王五["算法专家"]` → `算法专家`；`张三` → `张三` */
function pointLabel(raw: string): string {
  const q = /\[\s*["'`]([^"'`]*)["'`]\s*\]\s*$/.exec(raw);
  if (q && q[1]) return q[1];
  const cleaned = raw.replace(/\s*\[\s*["'`][^"'`]*["'`]\s*\]\s*$/, '').trim();
  return cleaned || raw.trim();
}

/** 判断是否 quadrantChart */
export function isQuadrant(text: string): boolean {
  const first = srcLines(text)[0] ?? '';
  return /^quadrantChart\b/i.test(first);
}

/** 解析 quadrantChart DSL（x/y 归一到 0..1，容错不抛错） */
export function parseQuadrant(src: string): QuadrantAST {
  const ast: QuadrantAST = {
    kind: 'quadrant',
    xAxis: { low: '', high: '' },
    yAxis: { low: '', high: '' },
    quadrants: ['', '', '', ''],
    points: [],
  };

  const collectPoints = (text: string): void => {
    POINT_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = POINT_RE.exec(text)) !== null) {
      const rawLabel = m[1].replace(/^[\s,:]+|[\s,:]+$/g, '');
      const x = parseFloat(m[2]);
      const y = parseFloat(m[3]);
      if (!rawLabel || Number.isNaN(x) || Number.isNaN(y)) continue;
      ast.points.push({ label: pointLabel(rawLabel), x, y });
    }
  };

  for (const line of srcLines(src)) {
    let m: RegExpExecArray | null;
    if (/^quadrantChart\b/i.test(line)) continue;
    if ((m = /^title\s+(.+)$/i.exec(line))) { ast.title = unquote(m[1]); continue; }
    if ((m = /^x-axis\s*(.*)$/i.exec(line))) {
      const [low, high] = splitArrow(m[1]);
      ast.xAxis = { low, high };
      continue;
    }
    if ((m = /^y-axis\s*(.*)$/i.exec(line))) {
      const [low, high] = splitArrow(m[1]);
      ast.yAxis = { low, high };
      continue;
    }
    if ((m = /^quadrant-(\d)\s*(.*)$/i.exec(line))) {
      const idx = parseInt(m[1], 10);
      if (idx >= 1 && idx <= 4) ast.quadrants[idx - 1] = unquote(m[2]);
      continue;
    }
    if (/^points\s*:/i.test(line)) {
      collectPoints(line.replace(/^points\s*:\s*/i, ''));
      continue;
    }
    if (hasCoord(line)) collectPoints(line);
    // 未知行忽略
  }
  return ast;
}
