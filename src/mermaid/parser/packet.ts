/**
 * Mermaid packet 语法分析器（packet-beta 位段图）。
 *
 * 支持每行 `位范围: "标签"`：
 *  - `0-7: "Version"`   绝对范围（起 > 止自动交换）
 *  - `+4: "Header Length"` 相对续接（宽 4，start = 前一字段 end + 1）
 *  - `16: "Flag"`       单位（start = end = 16）
 * 标签可无引号。
 *
 * 相对续接在 parser 内解析为绝对 start/end（AST 为绝对值）。
 * 容错：`%%` 注释跳过、无法识别行忽略、不抛异常。
 */
import { PacketAST } from '../ast';

function cleanLine(raw: string): string {
  return raw.replace(/%%.*$/, '').trim();
}

/** 去掉首尾引号 */
function unquote(s: string): string {
  const t = s.trim();
  const m = /^["'`](.*)["'`]$/.exec(t);
  return m ? m[1] : t;
}

/** 判断是否 packet */
export function isPacket(text: string): boolean {
  return /^packet\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 packet DSL（相对续接转绝对范围） */
export function parsePacket(src: string): PacketAST {
  const ast: PacketAST = { kind: 'packet', fields: [] };
  let prevEnd = -1;

  for (const raw of src.split(/\r?\n/)) {
    const line = cleanLine(raw);
    if (!line) continue;
    if (/^packet\b/i.test(line)) continue;

    const m = /^([+-]?\d+(?:\s*-\s*[+-]?\d+)?)\s*:\s*(.+)$/.exec(line);
    if (!m) continue; // 无法识别行忽略
    const range = m[1].replace(/\s+/g, '');
    const label = unquote(m[2]);
    if (!label) continue;

    if (range.startsWith('+')) {
      // 相对续接：宽 = N，start = 前一字段 end + 1
      const w = parseInt(range.slice(1), 10);
      if (Number.isNaN(w) || w <= 0) continue;
      const start = prevEnd + 1;
      const end = start + w - 1;
      ast.fields.push({ start, end, label });
      prevEnd = end;
    } else if (range.includes('-')) {
      // 绝对范围（起 > 止自动交换）
      const [a, b] = range.split('-');
      let start = parseInt(a, 10);
      let end = parseInt(b, 10);
      if (Number.isNaN(start) || Number.isNaN(end)) continue;
      if (start > end) [start, end] = [end, start];
      ast.fields.push({ start, end, label });
      prevEnd = end;
    } else {
      // 单位：start = end
      const v = parseInt(range, 10);
      if (Number.isNaN(v)) continue;
      ast.fields.push({ start: v, end: v, label });
      prevEnd = v;
    }
  }
  return ast;
}
