/**
 * Mermaid radar-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `radar-beta` / `radar`
 *  - `title 标题`
 *  - `axis 速度, 质量, 安全, 成本`（容忍 `axis id1["标签"], id2`，取引号文本为显示名）
 *  - `curve 项目A{8, 6, 7, 5}`（值按 axis 顺序；也容忍 `{8,6,7,5}` 外空白）
 *  - `ticks 5`（缺省 5）
 *  - `showLegend true|false`（缺省 true）
 *
 * 容错：`%%` 注释跳过、未知行忽略；不支持 `{axis: 值}` 对象形式（按数组容错）。
 */
import { RadarAST } from '../ast';

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

/** `id1["标签"]` → 标签；`速度` → 速度 */
function displayLabel(s: string): string {
  const q = /\[\s*["'`]([^"'`]*)["'`]\s*\]\s*$/.exec(s);
  if (q && q[1]) return q[1];
  const plain = /\[\s*([^\]]*)\s*\]\s*$/.exec(s);
  if (plain && plain[1]) return unquote(plain[1]);
  return unquote(s);
}

/** 提取所有数字 */
function numbers(s: string): number[] {
  const ms = s.match(/-?\d+(?:\.\d+)?/g);
  return ms ? ms.map(v => parseFloat(v)) : [];
}

/** 判断是否 radar */
export function isRadar(text: string): boolean {
  const first = srcLines(text)[0] ?? '';
  return /^radar(-beta)?\b/i.test(first);
}

/** 解析 radar DSL */
export function parseRadar(src: string): RadarAST {
  const ast: RadarAST = {
    kind: 'radar',
    axes: [],
    curves: [],
    ticks: 5,
    showLegend: true,
  };

  for (const line of srcLines(src)) {
    let m: RegExpExecArray | null;
    if (/^radar(-beta)?\b/i.test(line)) continue;
    if ((m = /^title\s+(.+)$/i.exec(line))) { ast.title = unquote(m[1]); continue; }

    if ((m = /^axis\s+(.*)$/i.exec(line))) {
      for (const item of m[1].split(',')) {
        const label = displayLabel(item).trim();
        if (label) ast.axes.push(label);
      }
      continue;
    }

    if ((m = /^curve\s+(.*)$/i.exec(line))) {
      const rest = m[1];
      const brace = /\{([^}]*)\}/.exec(rest);
      const values = numbers(brace ? brace[1] : rest);
      const labelPart = brace ? rest.slice(0, brace.index) : rest;
      const label = displayLabel(labelPart).trim() || `curve${ast.curves.length + 1}`;
      if (values.length > 0) ast.curves.push({ label, values });
      continue;
    }

    if ((m = /^ticks\s+(\d+)\s*$/i.exec(line))) {
      const t = parseInt(m[1], 10);
      if (t > 0) ast.ticks = t;
      continue;
    }

    if ((m = /^showLegend\s+(true|false)\s*$/i.exec(line))) {
      ast.showLegend = m[1].toLowerCase() === 'true';
      continue;
    }
    // 未知行忽略
  }
  return ast;
}
