/**
 * Mermaid cynefin-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `cynefin-beta` / `cynefin`，可选 `title 标题`
 *  - 域关键字行（complex/complicated/clear/chaotic/confusion，任意顺序、可缺省）开启域块
 *  - 域块内引号行 = items（缩进可有可无）
 *  - 顶层 `A --> B : "标签"` = transition（A==B 忽略）
 *
 * 容错：`%%` 注释跳过、未知行忽略；无当前域的引号行忽略。
 */
import { CynefinAST } from '../ast';

type CynefinDomain = CynefinAST['domains'][number]['domain'];

/** 合法域关键字 */
const DOMAIN_SET = new Set<string>([
  'complex', 'complicated', 'clear', 'chaotic', 'confusion',
]);

/** 去注释 + trim + 丢空行 */
function srcLines(src: string): string[] {
  return src.split(/\r?\n/)
    .map(l => l.replace(/%%.*$/, '').trim())
    .filter(l => l.length > 0);
}

/** 判断是否 cynefin */
export function isCynefin(text: string): boolean {
  const first = srcLines(text)[0] ?? '';
  return /^cynefin(-beta)?\b/i.test(first);
}

/** 解析 cynefin DSL */
export function parseCynefin(src: string): CynefinAST {
  const ast: CynefinAST = { kind: 'cynefin', domains: [], transitions: [] };
  const byDomain = new Map<string, CynefinAST['domains'][number]>();
  let current: CynefinAST['domains'][number] | null = null;

  for (const line of srcLines(src)) {
    let m: RegExpExecArray | null;
    if (/^cynefin(-beta)?\b/i.test(line)) continue;

    if ((m = /^title\s+(.+)$/i.exec(line))) {
      const t = m[1].trim();
      ast.title = /^["'`](.*)["'`]$/.exec(t)?.[1] ?? t;
      continue;
    }

    const low = line.toLowerCase();
    if (DOMAIN_SET.has(low)) {
      let entry = byDomain.get(low);
      if (!entry) {
        entry = { domain: low as CynefinDomain, items: [] };
        byDomain.set(low, entry);
        ast.domains.push(entry);
      }
      current = entry;
      continue;
    }

    // transition：A --> B : "标签"（标签可省略）
    if (/-->/.test(line)) {
      m = /^(\S+)\s*-->\s*(\S+)\s*(?::\s*(.+))?\s*$/.exec(line);
      if (m) {
        const from = m[1];
        const to = m[2];
        if (from !== to) {
          let label = m[3]?.trim();
          if (label) label = /^["'`](.*)["'`]$/.exec(label)?.[1] ?? label;
          ast.transitions.push(label ? { from, to, label } : { from, to });
        }
        continue;
      }
      continue; // 形似 transition 但解析失败 → 忽略
    }

    // 域内条目："..." 或 '...'
    m = /^["'](.*)["']$/.exec(line);
    if (m) {
      if (current) current.items.push(m[1]);
      continue;
    }
    // 未知行忽略
  }
  return ast;
}
