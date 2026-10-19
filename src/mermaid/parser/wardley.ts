/**
 * Mermaid wardley-beta 语法分析器。
 *
 * 坐标 [visibility(0底~1顶), evolution(0左~1右)]。
 * 支持：
 *  - 头行 `wardley-beta` / `wardley`
 *  - `title 标题`、`size [宽, 高]`
 *  - `component 名 [vis, evo] [(装饰器)]`（装饰器可省略：build/buy/outsource/market/inertia）
 *  - `anchor 名 [vis, evo]`
 *  - 链接 `A -> B` / `A --> B`（依赖）、`A +> B`（flow）、`A +< B`（反向 flow，归一为 to=A,from=B）、
 *    `A +'文本'> B`（带标签 flow）
 *  - `evolve 名 目标evolution`
 *  - `note "文本" [vis, evo]`
 *
 * 名字可含连字符/空格之外的通用字符（不带引号）。容错：`%%` 注释跳过、未知行忽略。
 */
import { WardleyAST } from '../ast';

/** 合法装饰器集合 */
const DECORATORS = new Set(['build', 'buy', 'outsource', 'market', 'inertia']);

/** 去注释 + trim + 丢空行 */
function srcLines(src: string): string[] {
  return src.split(/\r?\n/)
    .map(l => l.replace(/%%.*$/, '').trim())
    .filter(l => l.length > 0);
}

/** 判断是否 wardley */
export function isWardley(text: string): boolean {
  const first = srcLines(text)[0] ?? '';
  return /^wardley(-beta)?\b/i.test(first);
}

/** 解析 `[a, b]` 坐标对 */
function parseXY(m: RegExpExecArray, vi: number, ei: number): { vis: number; evo: number } {
  return { vis: parseFloat(m[vi]), evo: parseFloat(m[ei]) };
}

/** 解析 wardley DSL */
export function parseWardley(src: string): WardleyAST {
  const ast: WardleyAST = {
    kind: 'wardley',
    components: [],
    anchors: [],
    links: [],
    evolves: [],
    notes: [],
  };

  for (const line of srcLines(src)) {
    let m: RegExpExecArray | null;
    if (/^wardley(-beta)?\b/i.test(line)) continue;

    if ((m = /^title\s+(.+)$/i.exec(line))) {
      const t = m[1].trim();
      ast.title = /^["'`](.*)["'`]$/.exec(t)?.[1] ?? t;
      continue;
    }

    if ((m = /^size\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*$/i.exec(line))) {
      const w = parseFloat(m[1]);
      const h = parseFloat(m[2]);
      if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) ast.size = [w, h];
      continue;
    }

    // component 名 [vis, evo] [(装饰器)]
    if ((m = /^component\s+(.+?)\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*(?:\(\s*([A-Za-z]+)\s*\))?\s*$/i.exec(line))) {
      const { vis, evo } = parseXY(m, 2, 3);
      if (!Number.isFinite(vis) || !Number.isFinite(evo)) continue;
      const dec = m[4] ? m[4].toLowerCase() : undefined;
      ast.components.push({
        name: m[1].trim(), vis, evo,
        decorator: dec && DECORATORS.has(dec) ? dec : undefined,
      });
      continue;
    }

    // anchor 名 [vis, evo]
    if ((m = /^anchor\s+(.+?)\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*$/i.exec(line))) {
      const { vis, evo } = parseXY(m, 2, 3);
      if (!Number.isFinite(vis) || !Number.isFinite(evo)) continue;
      ast.anchors.push({ name: m[1].trim(), vis, evo });
      continue;
    }

    // note "文本" [vis, evo]
    if ((m = /^note\s+["']([^"']*)["']\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*$/i.exec(line))) {
      const { vis, evo } = parseXY(m, 2, 3);
      if (!Number.isFinite(vis) || !Number.isFinite(evo)) continue;
      ast.notes.push({ text: m[1], vis, evo });
      continue;
    }

    // evolve 名 目标evolution
    if ((m = /^evolve\s+(.+?)\s+(-?[\d.]+)\s*$/i.exec(line))) {
      const target = parseFloat(m[2]);
      if (Number.isFinite(target)) ast.evolves.push({ name: m[1].trim(), target });
      continue;
    }

    // 带标签 flow：A +'文本'> B
    if ((m = /^(.+?)\s*\+'([^']*)'?>\s*(.+)$/.exec(line))) {
      ast.links.push({ from: m[1].trim(), to: m[3].trim(), flow: true, label: m[2] });
      continue;
    }
    // 反向 flow：A +< B  → B 流向 A
    if ((m = /^(.+?)\s*\+<\s*(.+)$/.exec(line))) {
      ast.links.push({ from: m[2].trim(), to: m[1].trim(), flow: true });
      continue;
    }
    // flow：A +> B
    if ((m = /^(.+?)\s*\+>\s*(.+)$/.exec(line))) {
      ast.links.push({ from: m[1].trim(), to: m[2].trim(), flow: true });
      continue;
    }
    // 依赖：A -> B / A --> B
    if ((m = /^(.+?)\s*(?:-->|->)\s*(.+)$/.exec(line))) {
      ast.links.push({ from: m[1].trim(), to: m[2].trim(), flow: false });
      continue;
    }
    // 未知行忽略
  }
  return ast;
}
