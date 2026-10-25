/**
 * Mermaid journey 语法分析器。
 *
 * 支持：
 *  - 头行 `journey`（可同行 `journey title 标题`）
 *  - `title 标题`
 *  - `section 名称` 分组
 *  - 任务行 `任务文本: 分数: 角色1, 角色2`（分数须为数字（0-10，越界由 mapper clamp），非数字忽略该行；角色可省略）
 *
 * 容错：`%%` 注释跳过、无法识别行忽略、不抛异常。
 */
import { JourneyAST } from '../ast';

function cleanLine(raw: string): string {
  return raw.replace(/%%.*$/, '').trim();
}

/** 判断是否 journey */
export function isJourney(text: string): boolean {
  return /^journey\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 journey DSL */
export function parseJourney(src: string): JourneyAST {
  const ast: JourneyAST = { kind: 'journey', sections: [] };
  let cur: JourneyAST['sections'][number] | null = null;

  for (const raw of src.split(/\r?\n/)) {
    const line = cleanLine(raw);
    if (!line) continue;
    const head = /^journey\b\s*(.*)$/i.exec(line);
    if (head) {
      const tm = /^title\s+(.+)$/i.exec(head[1]);
      if (tm) ast.title = tm[1].trim();
      continue;
    }
    const tm = /^title\s+(.+)$/i.exec(line);
    if (tm) { ast.title = tm[1].trim(); continue; }
    const sec = /^section\s+(.+)$/i.exec(line);
    if (sec) {
      cur = { name: sec[1].trim(), tasks: [] };
      ast.sections.push(cur);
      continue;
    }
    // 任务行：label: score[: actors]
    const m = /^([^:]+?)\s*:\s*(-?\d+(?:\.\d+)?)\s*(?::\s*(.*))?$/.exec(line);
    if (m) {
      const label = m[1].trim();
      const score = parseFloat(m[2]);
      if (!label || Number.isNaN(score)) continue;
      const actors = (m[3] ?? '').split(',').map(s => s.trim()).filter(s => s.length > 0);
      if (!cur) {
        cur = { name: '', tasks: [] };
        ast.sections.push(cur);
      }
      cur.tasks.push({ label, score, actors });
    }
    // 未知行忽略
  }
  return ast;
}
