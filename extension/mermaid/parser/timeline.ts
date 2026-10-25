/**
 * Mermaid timeline 语法分析器。
 *
 * 支持：
 *  - 头行 `timeline`（可同行 `timeline title 标题`）
 *  - `title 标题`
 *  - 数据行 `阶段 : 事件1 : 事件2`（每段 trim，空段跳过）
 *
 * 容错：`%%` 注释跳过、无法识别行忽略、不抛异常。
 */
import { TimelineAST } from '../ast';

/** 去注释 + trim；保留原始缩进供 kanban 类使用（timeline 不用） */
function cleanLine(raw: string): string {
  return raw.replace(/%%.*$/, '').trim();
}

/** 判断是否 timeline */
export function isTimeline(text: string): boolean {
  return /^timeline\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 timeline DSL */
export function parseTimeline(src: string): TimelineAST {
  const ast: TimelineAST = { kind: 'timeline', periods: [] };

  for (const raw of src.split(/\r?\n/)) {
    const line = cleanLine(raw);
    if (!line) continue;
    // 头行
    const head = /^timeline\b\s*(.*)$/i.exec(line);
    if (head) {
      const tm = /^title\s+(.+)$/i.exec(head[1]);
      if (tm) ast.title = tm[1].trim();
      continue;
    }
    // title
    const tm = /^title\s+(.+)$/i.exec(line);
    if (tm) { ast.title = tm[1].trim(); continue; }
    // 数据行：按冒号分隔（无冒号的行无法识别，忽略）
    if (!line.includes(':')) continue;
    const parts = line.split(':').map(s => s.trim());
    const period = parts[0];
    if (!period) continue;
    const events = parts.slice(1).filter(s => s.length > 0);
    ast.periods.push({ period, events });
  }
  return ast;
}
