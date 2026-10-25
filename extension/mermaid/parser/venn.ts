/**
 * Mermaid venn-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `venn-beta` / `venn`
 *  - `title 标题`
 *  - `set A["前端"]: 20`（`:N` 缺省 10；标签缺省 = id）
 *  - `union A,B["全栈"]: 5`（ids 引用 set id）
 *
 * 容错：`%%` 注释跳过、未知行忽略；`text` 子语句不支持（忽略）。
 */
import { VennAST } from '../ast';

/** 去注释 + trim + 丢空行 */
function srcLines(src: string): string[] {
  return src.split(/\r?\n/)
    .map(l => l.replace(/%%.*$/, '').trim())
    .filter(l => l.length > 0);
}

/** 默认集合大小 */
const DEFAULT_SIZE = 10;

/** 拆出 `: N` 大小与 `[label]` 标签，返回剩余正文 */
function splitLabelSize(body: string): { rest: string; label?: string; size: number } {
  let rest = body.trim();
  let size = DEFAULT_SIZE;
  const sm = /^(.*?):\s*(-?\d+(?:\.\d+)?)\s*$/.exec(rest);
  if (sm) {
    rest = sm[1].trim();
    size = parseFloat(sm[2]);
    if (Number.isNaN(size)) size = DEFAULT_SIZE;
  }
  let label: string | undefined;
  const lm = /^(.*?)\[\s*["'`]([^"'`]*)["'`]\s*\]\s*$/.exec(rest);
  if (lm) {
    rest = lm[1].trim();
    label = lm[2];
  } else {
    const lm2 = /^(.*?)\[\s*([^\]]*)\s*\]\s*$/.exec(rest);
    if (lm2) {
      rest = lm2[1].trim();
      label = lm2[2].replace(/^["'`]|["'`]$/g, '');
    }
  }
  return { rest, label, size };
}

/** 判断是否 venn */
export function isVenn(text: string): boolean {
  const first = srcLines(text)[0] ?? '';
  return /^venn(-beta)?\b/i.test(first);
}

/** 解析 venn DSL */
export function parseVenn(src: string): VennAST {
  const ast: VennAST = { kind: 'venn', sets: [], unions: [] };

  for (const line of srcLines(src)) {
    let m: RegExpExecArray | null;
    if (/^venn(-beta)?\b/i.test(line)) continue;
    if ((m = /^title\s+(.+)$/i.exec(line))) {
      const t = m[1].trim();
      ast.title = /^["'`](.*)["'`]$/.exec(t)?.[1] ?? t;
      continue;
    }

    if ((m = /^set\s+(.+)$/i.exec(line))) {
      const { rest, label, size } = splitLabelSize(m[1]);
      if (rest) ast.sets.push({ id: rest, label, size });
      continue;
    }

    if ((m = /^union\s+(.+)$/i.exec(line))) {
      const { rest, label, size } = splitLabelSize(m[1]);
      const ids = rest.split(',').map(s => s.trim()).filter(s => s.length > 0);
      if (ids.length > 0) ast.unions.push({ ids, label, size });
      continue;
    }
    // 未知行忽略（含不支持的 text 子语句）
  }
  return ast;
}
