/**
 * Mermaid sankey-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `sankey-beta` / `sankey`
 *  - 数据行 = CSV `源, 目标, 数值`（字段可带引号，值为数字）
 *  - 可选定义行 `id["显示名"]`（无逗号、形如 id[...]，为节点设 label）
 *
 * 节点集合 = 所有出现过的源/目标（按首次出现序）；定义行可在数据行前后任意位置。
 * 容错：`%%` 注释跳过、非法数值行忽略。
 */

/** sankey AST（ast.ts 无预定义，此处定义并导出） */
export interface SankeyAST {
  kind: 'sankey';
  nodes: { id: string; label?: string }[];
  links: { source: string; target: string; value: number }[];
}

/** 去注释 + trim + 丢空行 */
function srcLines(src: string): string[] {
  return src.split(/\r?\n/)
    .map(l => l.replace(/%%.*$/, '').trim())
    .filter(l => l.length > 0);
}

/** 判断是否 sankey */
export function isSankey(text: string): boolean {
  const first = srcLines(text)[0] ?? '';
  return /^sankey(-beta)?\b/i.test(first);
}

/** 按 CSV 规则拆行（支持引号内逗号与 "" 转义） */
function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  let q = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === q) {
        if (line[i + 1] === q) { cur += c; i++; } else inQ = false;
      } else cur += c;
    } else if (c === '"' || c === "'") {
      inQ = true; q = c;
    } else if (c === ',') {
      out.push(cur.trim()); cur = '';
    } else cur += c;
  }
  out.push(cur.trim());
  return out;
}

/** 解析 sankey DSL */
export function parseSankey(src: string): SankeyAST {
  const labels = new Map<string, string>();
  const nodeIds: string[] = [];
  const links: SankeyAST['links'] = [];
  const seen = new Set<string>();

  const touch = (id: string) => {
    if (!id) return;
    if (!seen.has(id)) { seen.add(id); nodeIds.push(id); }
  };

  for (const line of srcLines(src)) {
    if (/^sankey(-beta)?\b/i.test(line)) continue;

    // 定义行：id["显示名"]（无逗号）
    if (!line.includes(',')) {
      const dm = /^([\w\-.]+)\s*\[\s*["']([^"']*)["']\s*\]\s*$/.exec(line);
      if (dm) {
        labels.set(dm[1], dm[2]);
        touch(dm[1]);
      }
      continue; // 无逗号的非定义行一律忽略
    }

    // 数据行 CSV
    const parts = splitCsv(line);
    if (parts.length < 3) continue;
    // 字段可带 `id["显示名"]` / `id['显示名']` 标签形式（splitCsv 已剥掉引号，故用无引号括号）
    const extractId = (raw: string): { id: string; label?: string } => {
      const m = /^([\w\-.]+)\s*\[\s*([^\]\s][^\]]*)\s*\]\s*$/.exec(raw.trim());
      if (m) return { id: m[1], label: m[2].trim() };
      return { id: raw };
    };
    const es = extractId(parts[0]);
    const et = extractId(parts[1]);
    // 先记录 label/节点（即便本行 value 非法被丢弃，标签仍保留）
    if (es.label !== undefined) labels.set(es.id, es.label);
    if (et.label !== undefined) labels.set(et.id, et.label);
    touch(es.id);
    touch(et.id);
    const value = Number(parts[2]);
    if (!es.id || !et.id || parts[2].trim() === '' || !Number.isFinite(value)) continue;
    links.push({ source: es.id, target: et.id, value });
  }

  const nodes = nodeIds.map(id => {
    const label = labels.get(id);
    return label !== undefined ? { id, label } : { id };
  });
  return { kind: 'sankey', nodes, links };
}
