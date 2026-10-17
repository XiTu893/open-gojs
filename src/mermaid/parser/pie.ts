/**
 * Mermaid pie 语法分析器。
 *
 * 支持：
 *  - `pie` / `pie title 标题` / `showData`
 *  - 数据行 `"标签": 数值` 或 `标签 : 数值`
 */
import { Token, tokenize, stripComments } from '../lexer';
import { PieAST, PieSlice, ParseError } from '../ast';

class PieParser {
  private toks: Token[];
  private pos = 0;
  private title?: string;
  private data: PieSlice[] = [];
  private errors: ParseError[] = [];

  constructor(toks: Token[]) { this.toks = toks; }

  private peek(o = 0): Token { return this.toks[Math.min(this.pos + o, this.toks.length - 1)]; }
  private next(): Token { const t = this.toks[this.pos]; if (this.pos < this.toks.length - 1) this.pos++; return t; }
  private atEol(): boolean { const k = this.peek().kind; return k === 'newline' || k === 'eof'; }
  private skipEol(): void { while (this.peek().kind === 'newline') this.next(); }
  private readLine(): string {
    const toks: Token[] = [];
    while (!this.atEol()) toks.push(this.next());
    let out = '';
    for (let i = 0; i < toks.length; i++) {
      if (i > 0 && (toks[i - 1].kind === 'ident' || toks[i - 1].kind === 'num') &&
          (toks[i].kind === 'ident' || toks[i].kind === 'num')) out += ' ';
      out += toks[i].value;
    }
    return out.trim();
  }

  parse(): PieAST {
    this.skipEol();
    // 首行 pie（可带 title）
    if (this.peek().kind === 'ident' && this.peek().value === 'pie') {
      this.next();
      const rest = this.readLine();
      const m = /^title\s+(.+)$/.exec(rest);
      if (m) this.title = m[1].trim();
    }
    this.skipEol();
    let guard = 0;
    while (this.peek().kind !== 'eof' && guard++ < 2000) {
      if (this.peek().kind === 'newline') { this.next(); continue; }
      const line = this.readLine();
      if (!line) continue;
      if (/^title\s+/.test(line)) { this.title = line.replace(/^title\s+/, '').trim(); continue; }
      if (/^showData$/i.test(line) || /^"([^"]+)"\s*$/.test(line)) continue;
      // "标签": 数值  或  标签: 数值
      const m = /^(?:"([^"]+)"|([^:]+?))\s*:\s*(-?\d+(?:\.\d+)?)\s*$/.exec(line);
      if (m) {
        const label = (m[1] ?? m[2] ?? '').trim();
        const value = parseFloat(m[3]);
        if (label && !Number.isNaN(value)) this.data.push({ label, value });
      }
    }
    return { kind: 'pie', title: this.title, data: this.data };
  }
}

/** 判断是否 pie */
export function isPie(text: string): boolean {
  return /^pie\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 pie DSL */
export function parsePie(src: string): PieAST {
  return new PieParser(stripComments(tokenize(src))).parse();
}