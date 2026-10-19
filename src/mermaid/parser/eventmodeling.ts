/**
 * Mermaid eventmodeling 语法分析器。
 *
 * 支持：
 *  - 头行 `eventmodeling`
 *  - 时间帧：`tf 01 ui CartUI`（compact）与 `timeframe 01 ui CartUI`（relaxed）等价；
 *    `rf` / `resetframe` 代替 tf 表示 reset 帧
 *  - 类型 token：ui | pcr | cmd | rmo | evt（兼容全称 processor|command|readmodel|event）
 *  - 行尾内联数据 { ... }（取第一个 { 到最后 } 之间内容）或 [[BlockId]] 引用（原文存 data）
 *  - 行尾显式关系 `->> 03`、`->> 01, 05` → relTo（花括号内出现的 `->>` 不算）
 *  - data BlockId json{ ... } 多行数据块：容错整体跳过
 *  - 泳道推断（entityType + `Namespace.Entity` 前缀）→ AST 扩展字段 lanes
 *  - `%%` 与 `//` 注释跳过、未知行忽略、解析不抛错
 */
import { EventModelingAST } from '../ast';

export type EventEntityType = EventModelingAST['frames'][number]['entityType'];

/** 一条泳道（AST 原字段不含，故在本文件内扩展） */
export interface EventLane {
  /** 稳定键（namespace + 类型泳道名） */
  key: string;
  /** 显示标题：`Namespace / 类型泳道名` 或 `类型泳道名` */
  title: string;
  /** 属于该泳道的帧在 ast.frames 中的下标（首次出现顺序） */
  frames: number[];
}

/** eventmodeling AST 扩展：附加推断出的泳道 */
export interface EventModelingASTX extends EventModelingAST {
  lanes: EventLane[];
}

/** 简写 / 全称 → 类型 token */
const TYPE_ALIAS: Record<string, EventEntityType> = {
  ui: 'ui',
  pcr: 'pcr',
  cmd: 'cmd',
  rmo: 'rmo',
  evt: 'evt',
  processor: 'pcr',
  command: 'cmd',
  readmodel: 'rmo',
  event: 'evt',
};

/** 类型 → 基础泳道名 */
export function baseEventLane(t: EventEntityType): string {
  if (t === 'ui' || t === 'pcr') return 'UI/Automation';
  if (t === 'cmd' || t === 'rmo') return 'Command/Read Model';
  return 'Events';
}

/** 泳道推断：entityType → 类型泳道；`Namespace.Entity` → `Namespace / 类型泳道`；按首次出现顺序 */
export function inferEventLanes(frames: EventModelingAST['frames']): EventLane[] {
  const lanes: EventLane[] = [];
  const byKey = new Map<string, EventLane>();
  frames.forEach((f, i) => {
    const base = baseEventLane(f.entityType);
    const dot = f.entity.indexOf('.');
    const ns = dot > 0 ? f.entity.slice(0, dot) : '';
    const id = `${ns}|${base}`;
    let lane = byKey.get(id);
    if (!lane) {
      lane = { key: id, title: ns ? `${ns} / ${base}` : base, frames: [] };
      byKey.set(id, lane);
      lanes.push(lane);
    }
    lane.frames.push(i);
  });
  return lanes;
}

/** 剥离注释：`%%` 到行尾；`//` 起（行首或空白后）到行尾（避免吞掉 http:// 之类） */
function stripComment(line: string): string {
  let s = line.replace(/%%.*$/, '');
  const start = s.replace(/^\s+/, '');
  if (start.startsWith('//')) return '';
  const m = /\s\/\/.*$/.exec(s);
  if (m) {
    const before = s.slice(0, m.index);
    if (((before.match(/"/g) || []).length) % 2 === 0) s = before;
  }
  return s;
}

/** 大括号深度增量 */
function braceDelta(s: string): number {
  let d = 0;
  for (const ch of s) {
    if (ch === '{') d++;
    else if (ch === '}') d--;
  }
  return d;
}

/** 解析帧行尾部：花括号外的 `->> a, b` → relTo；`{ ... }` / `[[BlockId]]` → data */
function parseFrameTail(tail: string): { relTo: string[]; data?: string } {
  const relTo: string[] = [];
  let depth = 0;
  let out = '';
  for (let i = 0; i < tail.length; i++) {
    const ch = tail[i];
    if (ch === '{') { depth++; out += ch; continue; }
    if (ch === '}') { depth = Math.max(0, depth - 1); out += ch; continue; }
    if (depth === 0 && tail.startsWith('->>', i)) {
      const m = /^->>\s*([0-9]+(?:\s*,\s*[0-9]+)*)/.exec(tail.slice(i));
      if (m) {
        for (const p of m[1].split(',')) {
          const v = p.trim();
          if (v && !relTo.includes(v)) relTo.push(v);
        }
        i += m[0].length - 1;
        out += ' ';
        continue;
      }
    }
    out += ch;
  }
  let data: string | undefined;
  const bi = out.indexOf('{');
  if (bi >= 0) {
    const li = out.lastIndexOf('}');
    if (li > bi) data = out.slice(bi + 1, li).trim();
  }
  if (data === undefined || data === '') {
    const ref = /\[\[[^\]]*\]\]/.exec(out);
    if (ref) data = ref[0];
  }
  const res: { relTo: string[]; data?: string } = { relTo };
  if (data !== undefined && data !== '') res.data = data;
  return res;
}

const FRAME_RE = /^(tf|rf|timeframe|resetframe)\s+(\S+)\s+([A-Za-z]+)\s+(\S+)\s*(.*)$/;

/** 判断是否 eventmodeling */
export function isEventModeling(text: string): boolean {
  return /^eventmodeling\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 eventmodeling DSL（容错，不抛错） */
export function parseEventModeling(src: string): EventModelingASTX {
  const frames: EventModelingAST['frames'] = [];
  let headerSeen = false;
  let skipDepth = 0; // >0：处于多行 data 块中
  let guard = 0;

  for (const raw of src.split(/\r?\n/)) {
    if (guard++ > 20000) break;
    const line = stripComment(raw).trim();
    if (!line) continue;

    // 头行
    if (!headerSeen) {
      headerSeen = true;
      if (/^eventmodeling\b/i.test(line)) continue;
    }

    // 多行数据块容错跳过
    if (skipDepth > 0) {
      skipDepth += braceDelta(line);
      if (skipDepth <= 0) skipDepth = 0;
      continue;
    }
    if (/^data\s+/i.test(line)) {
      const d = braceDelta(line);
      if (d > 0) skipDepth = d;
      continue;
    }

    // 时间帧行
    const m = FRAME_RE.exec(line);
    if (m) {
      const kw = m[1].toLowerCase();
      const type = TYPE_ALIAS[m[3].toLowerCase()];
      if (!type) continue; // 未知类型 token → 忽略本行
      const tail = parseFrameTail(m[5] ?? '');
      const frame: EventModelingAST['frames'][number] = {
        num: m[2],
        reset: kw === 'rf' || kw === 'resetframe',
        entityType: type,
        entity: m[4],
        relTo: tail.relTo,
      };
      if (tail.data !== undefined) frame.data = tail.data;
      frames.push(frame);
      continue;
    }

    // 未知行：忽略（容错）
  }

  return { kind: 'eventmodeling', frames, lanes: inferEventLanes(frames) };
}
