/**
 * Mermaid kanban 语法分析器。
 *
 * 支持：
 *  - 头行 `kanban`
 *  - 列 = 顶格行 `列id[列标题]`
 *  - 任务 = 缩进行 `任务id[任务描述]`
 *  - 任务元数据 = 更深缩进的 `@{ assigned: 张三, ticket: 123, priority: High }`（归属最近一个任务）
 *
 * 容错：`%%` 注释跳过、无法识别行忽略、不抛异常。
 */
import { KanbanAST } from '../ast';

/** 行首缩进宽度（tab 按 4 空格计） */
function indentOf(raw: string): number {
  const m = /^[ \t]*/.exec(raw);
  return m ? m[0].replace(/\t/g, '    ').length : 0;
}

/** 去掉首尾空白与注释 */
function cleanLine(raw: string): string {
  return raw.replace(/%%.*$/, '').trim();
}

/** 判断是否 kanban */
export function isKanban(text: string): boolean {
  return /^kanban\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 kanban DSL */
export function parseKanban(src: string): KanbanAST {
  const ast: KanbanAST = { kind: 'kanban', columns: [] };
  let colIndent = -1;
  let curCol: KanbanAST['columns'][number] | null = null;
  let curTask: KanbanAST['columns'][number]['tasks'][number] | null = null;

  for (const raw of src.split(/\r?\n/)) {
    if (!raw.replace(/%%.*$/, '').trim()) continue;
    const line = cleanLine(raw);
    if (!line) continue;
    if (/^kanban\b/i.test(line)) continue;

    const indent = indentOf(raw);

    // 元数据行 @{ k: v, ... }
    const meta = /^@\{(.*)\}$/.exec(line);
    if (meta) {
      if (curTask) {
        const inner = meta[1].trim();
        // 逐段拆 key: value，重新组装成规范字符串
        const pairs = inner.split(',').map(s => s.trim()).filter(Boolean)
          .map(seg => {
            const kv = /^([^:]+)\s*:\s*(.*)$/.exec(seg);
            return kv ? `${kv[1].trim()}: ${kv[2].trim()}` : seg;
          });
        curTask.meta = pairs.join(', ');
      }
      continue;
    }

    // id[title] 形式
    const m = /^([^\[\]]+)\s*\[\s*([^\]]*)\s*\]\s*$/.exec(line);
    if (!m) continue; // 无法识别行忽略
    const id = m[1].trim();
    const title = m[2].trim();
    if (!id) continue;

    if (curCol === null || indent <= colIndent) {
      // 新列
      curCol = { id, title, tasks: [] };
      colIndent = indent;
      ast.columns.push(curCol);
      curTask = null;
    } else {
      // 缩进更深 → 任务
      curTask = { id, label: title };
      curCol.tasks.push(curTask);
    }
  }
  return ast;
}
