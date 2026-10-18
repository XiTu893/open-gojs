/**
 * Mermaid classDiagram 语法分析器。
 *
 * 支持：
 *  - 标题 classDiagram
 *  - 类定义：`class A { ... }` 或块 `class A {` ... `}`
 *  - 成员：`+method(): void` / `-field: type` / `#protected` / `~package`
 *  - 关系：`A <|-- B` 继承 / `*--o B` 组合 / `o--* B` 聚合 / `--> B` 关联 / `..> B` 依赖 / `..|>` 实现
 *  - 关系可带标签 `A --|> B : 实现`
 *  - 注释 `%%` 与 `%%` 行
 */
import { Token, tokenize, stripComments, smartJoin } from '../lexer';
import { ClassAST, ClassDecl, ClassMember, ClassRelation, ParseError } from '../ast';

/** 关系箭头（长→短）匹配，映射到语义类型。正则不锚定 ^，用于在行内定位。 */
const RELATIONS: { pat: RegExp; kind: ClassRelation['kind'] }[] = [
  { pat: /<\|--/, kind: 'inheritance' },
  { pat: /\.\.\|>/, kind: 'dependency' },
  { pat: /<\|---/, kind: 'inheritance' },
  { pat: /\*--o/, kind: 'composition' },
  { pat: /o--\*/, kind: 'aggregation' },
  { pat: /o--/, kind: 'aggregation' },
  { pat: /\*--/, kind: 'composition' },
  { pat: /--\|>/, kind: 'inheritance' },
  { pat: /\.\.>/, kind: 'dependency' },
  { pat: /-->/, kind: 'association' },
  { pat: /<--/, kind: 'association' },
  { pat: /--/, kind: 'association' },
  { pat: /\.\./, kind: 'dependency' },
];

class ClassParser {
  private toks: Token[];
  private pos = 0;
  private classes = new Map<string, ClassDecl>();
  private relations: ClassRelation[] = [];
  private errors: ParseError[] = [];
  private title?: string;
  private pendingRel: { from: string; kind: ClassRelation['kind'] } | null = null;

  constructor(toks: Token[]) { this.toks = toks; }

  private peek(o = 0): Token { return this.toks[Math.min(this.pos + o, this.toks.length - 1)]; }
  private next(): Token { const t = this.toks[this.pos]; if (this.pos < this.toks.length - 1) this.pos++; return t; }
  private atEol(): boolean { const k = this.peek().kind; return k === 'newline' || k === 'eof'; }
  private skipEol(): void { while (this.peek().kind === 'newline') this.next(); }

  private ensureClass(name: string): ClassDecl {
    let c = this.classes.get(name);
    if (!c) { c = { name, members: [] }; this.classes.set(name, c); }
    return c;
  }

  /** 拼一行原始文本 */
  private readLine(stopAt?: string): string {
    const toks: Token[] = [];
    while (!this.atEol()) {
      if (stopAt && this.peek().value === stopAt) break;
      toks.push(this.next());
    }
    return smartJoin(toks).trim();
  }

  parse(): ClassAST {
    this.skipEol();
    // 跳过类型头行 classDiagram
    if (this.peek().kind === 'ident' && /^classDiagram$/i.test(this.peek().value)) {
      this.next();
      this.readLine();
    }
    let braceDepth = 0;
    let currentClass: ClassDecl | null = null;
    let guard = 0;

    while (this.peek().kind !== 'eof' && guard++ < 8000) {
      const t = this.peek();
      if (t.kind === 'newline') { this.next(); continue; }
      if (t.kind === 'ws') { this.next(); continue; } // 跳过缩进/空白

      if (t.kind === 'ident' && t.value === 'title') {
        this.next(); this.title = this.readLine().trim(); continue;
      }

      // 关系行：含箭头符号（lexer 里 sequence/flow 箭头不识别，这里读整行正则匹配）
      if (this.looksLikeRelation()) {
        this.parseRelationLine();
        continue;
      }

      // class 定义
      if (t.kind === 'ident' && t.value === 'class') {
        this.next();
        while (this.peek().kind === 'ws') this.next();
        const name = this.atEol() ? '' : this.next().value;
        if (!name) { this.readLine(); continue; }
        currentClass = this.ensureClass(name);
        // 同行可能有 { 或成员
        const rest = this.readLine();
        const body = rest.trim();
        if (body.startsWith('{')) {
          braceDepth = 1;
          const inline = body.slice(1).replace(/\}$/, '');
          if (inline.trim()) this.parseMemberLine(currentClass, inline);
          if (body.includes('}')) braceDepth = 0;
        }
        continue;
      }

      // 花括号块内：成员
      if (braceDepth > 0 && currentClass) {
        if (t.value === '}') { this.next(); braceDepth = 0; continue; }
        const line = this.readLine().trim();
        if (line === '}') { braceDepth = 0; continue; }
        if (line) this.parseMemberLine(currentClass, line);
        continue;
      }

      // 无 class 前缀的关系/成员，兜底跳过行
      const line = this.readLine().trim();
      if (line) this.tryLooseLine(line);
    }

    return {
      kind: 'class',
      title: this.title,
      classes: Array.from(this.classes.values()),
      relations: this.relations,
    };
  }

  /** 判断本行是否为关系行（含关系箭头） */
  private looksLikeRelation(): boolean {
    // 收集到行尾的文本快照（不消费）
    let i = this.pos;
    let s = '';
    while (i < this.toks.length && this.toks[i].kind !== 'newline' && this.toks[i].kind !== 'eof') {
      s += this.toks[i].value; i++;
    }
    return RELATIONS.some(r => r.pat.test(s.trim()));
  }

  /** 解析关系行 */
  private parseRelationLine(): void {
    const lineNum = this.peek().line;
    const line = this.readLine().trim();
    // 形式：A <|-- B [: label]
    let label = '';
    const colonIdx = line.indexOf(':');
    let core = line;
    if (colonIdx >= 0) { label = line.slice(colonIdx + 1).trim(); core = line.slice(0, colonIdx).trim(); }

    // 找关系符号位置（在两端标识符之间）
    for (const r of RELATIONS) {
      const m = r.pat.exec(core);
      if (m) {
        const relLen = m[0].length;
        const left = core.slice(0, m.index).trim();
        const right = core.slice(m.index + relLen).trim();
        // left/right 可能是 `A ` 和 ` B`
        const from = left.split(/\s+/)[0] || left;
        const to = right.split(/\s+/)[0] || right;
        if (from && to) {
          this.ensureClass(from);
          this.ensureClass(to);
          this.relations.push({ from, to, kind: r.kind, label: label || undefined });
        }
        return;
      }
    }
  }

  /** 解析成员行：+name(type): ret / -field: type */
  private parseMemberLine(cls: ClassDecl, line: string): void {
    const s = line.trim();
    if (!s) return;
    let visibility: ClassMember['visibility'] = '';
    let body = s;
    const first = s[0];
    if (first === '+' || first === '-' || first === '#' || first === '~') {
      visibility = first as ClassMember['visibility'];
      body = s.slice(1).trim();
    }
    const isMethod = body.includes('(');
    cls.members.push({ visibility, isMethod, text: body });
  }

  /** 兜底：无 class 前缀的成员/关系 */
  private tryLooseLine(line: string): void {
    if (RELATIONS.some(r => r.pat.test(line))) {
      // 复用关系解析（重新读不需要，因为已读）
      this.parseRelationFromText(line);
      return;
    }
    // 成员行（归属最近的类，若无则跳过）
    if (/[+\-#~]/.test(line[0] ?? '') || line.includes('(')) {
      // 需要一个"当前类"；classDiagram 中裸成员通常在块内，此处忽略
    }
  }

  private parseRelationFromText(line: string): void {
    let label = '';
    const colonIdx = line.indexOf(':');
    let core = line;
    if (colonIdx >= 0) { label = line.slice(colonIdx + 1).trim(); core = line.slice(0, colonIdx).trim(); }
    for (const r of RELATIONS) {
      const m = r.pat.exec(core);
      if (m) {
        const left = core.slice(0, m.index).trim();
        const right = core.slice(m.index + m[0].length).trim();
        const from = left.split(/\s+/)[0] || left;
        const to = right.split(/\s+/)[0] || right;
        if (from && to) {
          this.ensureClass(from); this.ensureClass(to);
          this.relations.push({ from, to, kind: r.kind, label: label || undefined });
        }
        return;
      }
    }
  }
}

/** 判断是否 classDiagram */
export function isClass(text: string): boolean {
  return /^classDiagram\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 classDiagram DSL */
export function parseClass(src: string): ClassAST {
  return new ClassParser(stripComments(tokenize(src))).parse();
}