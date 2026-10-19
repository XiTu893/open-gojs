/**
 * Mermaid zenuml 语法分析器 —— 产出 SequenceAST（复用现有 sequence 渲染链）。
 *
 * 支持：
 *  - 头行 `zenuml`、`title 文本`（→ SequenceAST.title）
 *  - 消息：`A->B: 标签`（sync → `->>`）、`A-->B: 标签`（reply → `-->>`）、
 *    `A->>B` / `A-->>B` 同样识别；`A.new B: 标签`（creation → `->>`，标签原样）
 *  - 花括号块：while/for/foreach/loop(...) { → note{kind:'loop'}；
 *    if/else if/else → note{kind:'alt'}；opt → 'opt'；par → 'par'；
 *    try/catch/finally → 按 alt 近似；`}` 结束块
 *  - 参与者按消息出现顺序自动发现（先 from 后 to）
 *  - `//` 与 `%%` 注释跳过、未知行忽略、解析不抛错
 *
 * line 序号：messages/notes 共享同一遍历计数（0,1,2,…），顺序即源文本顺序。
 */
import { SequenceAST, SeqMessage, SeqNote, SeqParticipant } from '../ast';

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

/** 参与者标识（含中文） */
const ID = '[A-Za-z0-9_\\u4e00-\\u9fa5][\\w\\u4e00-\\u9fa5]*';

/** 块头行 → note（kind/text；open 表示带 `{`，计入深度） */
function parseBlockHead(l: string): { kind: SeqNote['kind']; text?: string; open: boolean } | null {
  let m = new RegExp(`^(while|for|foreach|loop)\\s*\\(([\\s\\S]*)\\)\\s*(\\{)?\\s*$`, 'i').exec(l);
  if (m) return { kind: 'loop', text: (m[2] ?? '').trim(), open: !!m[3] };
  m = new RegExp(`^(else\\s+if|if)\\s*\\(([\\s\\S]*)\\)\\s*(\\{)?\\s*$`, 'i').exec(l);
  if (m) return { kind: 'alt', text: (m[2] ?? '').trim(), open: !!m[3] };
  if (/^else\s*(\{)?\s*$/i.test(l)) return { kind: 'alt', text: 'else', open: l.includes('{') };
  if (/^opt\s*(\{)?\s*$/i.test(l)) return { kind: 'opt', text: '', open: l.includes('{') };
  if (/^par\s*(\{)?\s*$/i.test(l)) return { kind: 'par', text: '', open: l.includes('{') };
  m = /^(try|catch|finally)\b/i.exec(l);
  if (m) return { kind: 'alt', text: l.replace(/\s*\{\s*$/, '').trim(), open: l.includes('{') };
  return null;
}

/** 消息行 → SeqMessage（不含 line）；非消息返回 null */
function parseMessage(l: string): { from: string; to: string; arrow: string; label: string } | null {
  // creation：A.new B: label（先于箭头识别，A.new 含点号）
  let m = new RegExp(`^(${ID})\\s*\\.new\\s+(${ID})\\s*(?::\\s*([\\s\\S]*))?$`).exec(l);
  if (m) return { from: m[1], to: m[2], arrow: '->>', label: (m[3] ?? '').trim() };
  // 箭头：-->> / ->> / --> / -> （长的在前，--> 先于 ->）
  m = new RegExp(
    `^(${ID})\\s*(-->>|->>|-->|->)\\s*(${ID})\\s*(?::\\s*([\\s\\S]*))?$`
  ).exec(l);
  if (!m) return null;
  const arrow = m[2] === '-->' || m[2] === '-->>' ? '-->>' : '->>';
  return { from: m[1], to: m[3], arrow, label: (m[4] ?? '').trim() };
}

/** 判断是否 zenuml */
export function isZenUML(text: string): boolean {
  return /^zenuml\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 zenuml DSL → SequenceAST（容错，不抛错） */
export function parseZenUML(src: string): SequenceAST {
  const participants: SeqParticipant[] = [];
  const messages: SeqMessage[] = [];
  const notes: SeqNote[] = [];
  const seen = new Set<string>();
  let title: string | undefined;
  let seq = 0;   // messages/notes 共享的遍历序号
  let depth = 0; // 花括号块深度
  let headerSeen = false;
  let guard = 0;

  const ensure = (id: string): void => {
    if (id && !seen.has(id)) {
      seen.add(id);
      participants.push({ id, alias: id, type: 'participant' });
    }
  };

  for (const raw of src.split(/\r?\n/)) {
    if (guard++ > 20000) break;
    const l = stripComment(raw).trim();
    if (!l) continue;

    // 头行
    if (!headerSeen) {
      headerSeen = true;
      if (/^zenuml\b/i.test(l)) continue;
    }

    // 行首可能带一个或多个 `}`（如 `} else {`），先消费掉
    let work = l;
    while (work.startsWith('}')) {
      if (depth > 0) depth--;
      work = work.slice(1).trim();
    }
    if (!work) continue;

    // 块开始
    const block = parseBlockHead(work);
    if (block) {
      const note: SeqNote = { kind: block.kind, line: seq++ };
      if (block.text !== undefined) note.text = block.text;
      notes.push(note);
      if (block.open) depth++;
      continue;
    }

    // title
    const tm = /^title\s+([\s\S]+)$/.exec(work);
    if (tm) { title = tm[1].trim(); continue; }

    // 消息
    const msg = parseMessage(work);
    if (msg) {
      ensure(msg.from);
      ensure(msg.to);
      messages.push({ ...msg, line: seq++ });
      continue;
    }

    // 未知行：忽略（容错）
  }

  return { kind: 'sequence', title, participants, messages, notes, activations: [] };
}
