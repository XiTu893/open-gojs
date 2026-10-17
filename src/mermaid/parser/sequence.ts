/**
 * Mermaid sequenceDiagram 语法分析器。
 *
 * 支持：
 *  - participant A / participant A as 别名 / actor B
 *  - 消息 A->>B: 文本 / A-->>B / A-)B / A-x B / 双向 <->> 等
 *  - note over A,B: 文本 / note left of A: 文本 / note right of A: 文本
 *  - activate A / deactivate A
 *  - loop / alt / else / opt / par / and 块（简单识别为 note 级块）
 *  - autonumber / title
 */
import { Token, tokenize, stripComments } from '../lexer';
import {
  SequenceAST, SeqParticipant, SeqMessage, SeqNote, SeqActivation, ParseError,
} from '../ast';

/** 消息箭头符号集合（长→短） */
const MSG_ARROWS = ['<<->>', '<<-->', '<->>', '<-->', '-->>', '--x', '--)', '-x', '-)', '->>', '->', '<<-', '<<--'];

function matchMsgArrow(s: string): string | null {
  for (const a of MSG_ARROWS) if (s.startsWith(a)) return a;
  return null;
}

class SeqParser {
  private toks: Token[];
  private pos = 0;
  private participants: SeqParticipant[] = [];
  private messages: SeqMessage[] = [];
  private notes: SeqNote[] = [];
  private activations: SeqActivation[] = [];
  private errors: ParseError[] = [];
  private title?: string;
  private seen = new Set<string>();

  constructor(toks: Token[]) { this.toks = toks; }

  private peek(o = 0): Token {
    return this.toks[Math.min(this.pos + o, this.toks.length - 1)];
  }
  private next(): Token { const t = this.toks[this.pos]; if (this.pos < this.toks.length - 1) this.pos++; return t; }
  private atEol(): boolean { const k = this.peek().kind; return k === 'newline' || k === 'eof'; }
  private skipEol(): void { while (this.peek().kind === 'newline') this.next(); }

  /** 拼一行文本（直到换行），可选停在某分隔符 */
  private readLine(stopAt?: string): string {
    const parts: string[] = [];
    while (!this.atEol()) {
      if (stopAt && this.peek().value === stopAt) break;
      parts.push(this.next().value);
    }
    return parts.join('').trim();
  }

  /** 确保参与者存在（默认 participant） */
  private ensureParticipant(id: string, alias?: string, type: SeqParticipant['type'] = 'participant'): SeqParticipant {
    let p = this.participants.find(x => x.id === id);
    if (!p) {
      p = { id, alias: alias ?? id, type };
      this.participants.push(p);
      this.seen.add(id);
    } else if (alias) {
      p.alias = alias;
    }
    return p;
  }

  parse(): SequenceAST {
    this.skipEol();
    let guard = 0;
    while (this.peek().kind !== 'eof' && guard++ < 5000) {
      const t = this.peek();
      if (t.kind === 'newline') { this.next(); continue; }

      if (t.kind === 'ident') {
        const kw = t.value;
        // title
        if (kw === 'title') { this.next(); this.title = this.readLine(); continue; }
        // autonumber
        if (kw === 'autonumber') { this.next(); continue; }
        // participant / actor
        if (kw === 'participant' || kw === 'actor') {
          this.next();
          const id = this.atEol() ? '' : this.next().value;
          let alias: string | undefined;
          if (this.peek().value === 'as') { this.next(); alias = this.readLine(); }
          else this.readLine(); // 丢弃行内其余
          if (id) this.ensureParticipant(id, alias, kw === 'actor' ? 'actor' : 'participant');
          continue;
        }
        // note
        if (kw === 'note') { this.parseNote(); continue; }
        // activate / deactivate
        if (kw === 'activate' || kw === 'deactivate') {
          this.next();
          const who = this.atEol() ? '' : this.next().value;
          if (who) { this.ensureParticipant(who); this.activations.push({ actor: who, activate: kw === 'activate', line: t.line }); }
          this.readLine();
          continue;
        }
        // 块关键字：loop/alt/else/opt/par/and/end —— 识别并记录为 note 块
        if (kw === 'loop' || kw === 'alt' || kw === 'opt' || kw === 'par') {
          this.next();
          const lbl = this.readLine();
          this.notes.push({ kind: kw as any, text: lbl, line: t.line });
          continue;
        }
        if (kw === 'else' || kw === 'and') { this.next(); const lbl = this.readLine(); this.notes.push({ kind: 'alt', text: lbl || kw, line: t.line }); continue; }
        if (kw === 'end') { this.next(); this.readLine(); continue; }
      }

      // 消息行：id arrow id : text   或   id arrow id
      const msg = this.tryParseMessage();
      if (msg) continue;

      // 兜底：tryParseMessage 可能已消费本行内容（停在换行处），
      // 若仍在行内（非 ident/num 起始未消费）则手动跳过整行。换行由循环顶部处理。
      if (!this.atEol()) {
        while (!this.atEol()) this.next();
      }
      continue;
    }

    const ast: SequenceAST = {
      kind: 'sequence',
      title: this.title,
      participants: this.participants,
      messages: this.messages,
      notes: this.notes,
      activations: this.activations,
    };
    return ast;
  }

  /** note over A,B: text / note left of A: text */
  private parseNote(): void {
    const line = this.peek().line;
    this.next(); // 'note'
    // 位置词
    let pos = 'over';
    const w1 = this.peek();
    if (w1.kind === 'ident' && /^(left|right|over)$/.test(w1.value)) { pos = w1.value; this.next(); }
    // 可能有 "of"
    if (this.peek().value === 'of') this.next();
    // actor 列表（逗号分隔）直到 ':'
    const actors: string[] = [];
    while (!this.atEol() && this.peek().value !== ':') {
      const v = this.next().value;
      if (v === ',') continue;
      actors.push(v);
      this.ensureParticipant(v);
    }
    let text = '';
    if (this.peek().value === ':') { this.next(); text = this.readLine(); }
    this.notes.push({ kind: 'note', text: text || pos, actors, line });
  }

  /** 尝试解析一条消息，成功返回消息，否则 null */
  private tryParseMessage(): SeqMessage | null {
    const start = this.pos;
    const fromTok = this.peek();
    if (fromTok.kind !== 'ident' && fromTok.kind !== 'num') return null;
    // 找箭头（可能中间无空格，箭头是独立 token 或并入 ident）
    // 由于 lexer 可能把 "A->>" 作为一个 ident（含 > 字符？不会，> 非 ident 字符）
    // 所以箭头应是独立 arrow token，但我们的 lexer 只识别 flowchart 箭头；sequence 箭头如 ->> 不在 ARROWS 集合里。
    // 回退策略：扫描本行文本做正则匹配。
    this.pos = start;
    return this.parseMessageByLine(fromTok);
  }

  /** 通过行文本正则解析消息（更稳） */
  private parseMessageByLine(fromTok: Token): SeqMessage | null {
    // 收集整行原始文本
    const parts: string[] = [];
    while (!this.atEol()) parts.push(this.next().value);
    const line = parts.join('');
    // 匹配：标识符 箭头 标识符 [: 文本]
    const m = /^([A-Za-z0-9_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*)\s*(<<->>|<<-->|<->>|<-->|-->>|--x|--\)|-x|-\)|->>|->|<<-|<<--)\s*([A-Za-z0-9_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*)\s*(?::\s*(.*))?$/.exec(line);
    if (!m) return null;
    const [, from, arrow, to, label] = m;
    this.ensureParticipant(from);
    this.ensureParticipant(to);
    const msg: SeqMessage = { from, to, arrow, label: (label || '').trim(), line: fromTok.line };
    this.messages.push(msg);
    return msg;
  }
}

/** 判断是否 sequenceDiagram */
export function isSequence(text: string): boolean {
  return /^sequenceDiagram\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 sequenceDiagram DSL */
export function parseSequence(src: string): SequenceAST {
  return new SeqParser(stripComments(tokenize(src))).parse();
}