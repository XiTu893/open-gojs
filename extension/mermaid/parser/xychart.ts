/**
 * Mermaid xychart-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `xychart-beta` / `xychart`
 *  - `title 标题`
 *  - `x-axis [Q1, Q2, Q3, Q4]`（也容忍 `x-axis 低 --> 高` 两点式 / 单标签）
 *  - `y-axis 0 --> 100`（数字下限 --> 上限，也容忍 `[0, 100]`）
 *  - `bar [...]` / `line [...]` / `area [...]`（可多条，顺序保留）
 *
 * 容错：`%%` 注释跳过、未知行忽略；y 轴缺省按数据推断；x 标签缺省用序号。
 */
import { XYChartAST } from '../ast';

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

/** 取文本中 `[...]` 方括号内的内容（无方括号返回 null） */
function bracketBody(s: string): string | null {
  const m = /\[([^\]]*)\]/.exec(s);
  return m ? m[1] : null;
}

/** 提取所有数字 */
function numbers(s: string): number[] {
  const ms = s.match(/-?\d+(?:\.\d+)?/g);
  return ms ? ms.map(v => parseFloat(v)) : [];
}

/** 判断是否 xychart */
export function isXYChart(text: string): boolean {
  const first = srcLines(text)[0] ?? '';
  return /^xychart(-beta)?\b/i.test(first);
}

/** 解析 xychart DSL */
export function parseXYChart(src: string): XYChartAST {
  const ast: XYChartAST = {
    kind: 'xychart',
    xLabels: [],
    yMin: 0,
    yMax: 0,
    series: [],
  };
  let hasY = false;

  for (const line of srcLines(src)) {
    let m: RegExpExecArray | null;
    if (/^xychart(-beta)?\b/i.test(line)) continue;
    if ((m = /^title\s+(.+)$/i.exec(line))) { ast.title = unquote(m[1]); continue; }

    // x-axis：[a, b, c] / 低 --> 高 / 单标签
    if ((m = /^x-axis\s*(.*)$/i.exec(line))) {
      const rest = m[1].trim();
      const body = bracketBody(rest);
      if (body !== null) {
        ast.xLabels = body.split(',').map(s => unquote(s)).filter(s => s.length > 0);
      } else if (/-{1,2}>|→/.test(rest)) {
        const parts = rest.split(/-{1,2}>|→/).map(s => unquote(s.trim())).filter(s => s.length > 0);
        ast.xLabels = parts;
      } else if (rest) {
        ast.xLabels = [unquote(rest)];
      }
      continue;
    }

    // y-axis：低 --> 高 或 [低, 高]
    if ((m = /^y-axis\s*(.*)$/i.exec(line))) {
      const rest = m[1].trim();
      const body = bracketBody(rest);
      const nums = body !== null ? numbers(body) : numbers(rest);
      if (nums.length >= 2) {
        ast.yMin = nums[0];
        ast.yMax = nums[1];
        hasY = true;
      } else if (nums.length === 1) {
        ast.yMin = 0;
        ast.yMax = nums[0];
        hasY = true;
      }
      continue;
    }

    // bar / line / area
    if ((m = /^(bar|line|area)\s+(.*)$/i.exec(line))) {
      const type = m[1].toLowerCase() as 'bar' | 'line' | 'area';
      const body = bracketBody(m[2]);
      const vals = numbers(body !== null ? body : m[2]);
      if (vals.length > 0) ast.series.push({ type, values: vals });
      continue;
    }
    // 未知行忽略
  }

  // y 轴缺省：0 .. 数据最大值（保证区间有效）
  const all = ast.series.reduce((a: number[], s) => a.concat(s.values), []);
  const maxV = all.length ? Math.max(...all) : 1;
  const minV = all.length ? Math.min(...all) : 0;
  if (!hasY) {
    ast.yMin = Math.min(0, minV);
    ast.yMax = maxV > ast.yMin ? maxV : ast.yMin + 1;
  } else if (ast.yMax <= ast.yMin) {
    ast.yMax = ast.yMin + 1;
  }

  // x 标签缺省：按最长 series 的长度用序号
  if (ast.xLabels.length === 0) {
    const n = ast.series.reduce((mx, s) => Math.max(mx, s.values.length), 0);
    ast.xLabels = Array.from({ length: n }, (_, i) => String(i + 1));
  }
  return ast;
}
