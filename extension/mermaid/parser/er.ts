/**
 * Mermaid erDiagram 语法分析器。
 *
 * 支持：
 *  - 实体属性块 `ENTITY { string name }` 与关系行
 *  - 关系：`A ||--o{ B : label`（基数记号 ||, |o, }o, }|, o{ 等）
 *  - 无属性块的简单关系行 `A ||--|| B : label`
 */
import { Token, tokenize, stripComments, smartJoin } from '../lexer';
import { ErAST, ErEntity, ErAttribute, ErRelation, ParseError } from '../ast';

/** 基数记号（左）→ 关系类别 */
const CARDINALITY = ['||--o{', '||--||', '|o--o{', '}o--||', '}o--o{', '||--o|', '|o--|', '--', 'o--', '}o--', '||--'];

class ErParser {
  private toks: Token[];
  private pos = 0;
  private entities = new Map<string, ErEntity>();
  private relations: ErRelation[] = [];
  private errors: ParseError[] = [];

  constructor(toks: Token[]) { this.toks = toks; }

  private peek(o = 0): Token { return this.toks[Math.min(this.pos + o, this.toks.length - 1)]; }
  private next(): Token { const t = this.toks[this.pos]; if (this.pos < this.toks.length - 1) this.pos++; return t; }
  private atEol(): boolean { const k = this.peek().kind; return k === 'newline' || k === 'eof'; }
  private skipEol(): void { while (this.peek().kind === 'newline') this.next(); }
  private readLine(): string {
    const toks: Token[] = [];
    while (!this.atEol()) toks.push(this.next());
    return smartJoin(toks).trim();
  }

  private ensureEntity(name: string): ErEntity {
    let e = this.entities.get(name);
    if (!e) { e = { name, attrs: [] }; this.entities.set(name, e); }
    return e;
  }

  parse(): ErAST {
    this.skipEol();
    // 跳过类型头行 erDiagram
    if (this.peek().kind === 'ident' && /^erDiagram$/i.test(this.peek().value)) {
      this.next();
      this.readLine();
    }
    let braceDepth = 0;
    let current: ErEntity | null = null;
    let guard = 0;

    while (this.peek().kind !== 'eof' && guard++ < 8000) {
      const t = this.peek();
      if (t.kind === 'newline') { this.next(); continue; }
      if (t.kind === 'ws') { this.next(); continue; } // 跳过缩进/空白

      // 关系行
      if (this.looksLikeRelation()) {
        this.parseRelation(this.readLine().trim());
        continue;
      }

      // 实体块开始：ENTITY {  或  ENTITY
      if (t.kind === 'ident' && !braceDepth) {
        let k = 1;
        while (this.peek(k).kind === 'ws') k++;
        if (this.peek(k).value === '{') {
          const name = t.value;
          this.next(); // 名字
          while (this.peek().kind === 'ws') this.next();
          this.next(); // {
          current = this.ensureEntity(name);
          braceDepth = 1;
          continue;
        }
      }

      if (braceDepth > 0 && current) {
        if (t.value === '}') { this.next(); braceDepth = 0; current = null; continue; }
        const line = this.readLine().trim();
        if (line === '}') { braceDepth = 0; current = null; continue; }
        if (line) this.parseAttr(current, line);
        continue;
      }

      // 裸实体名（作为单独声明）或含属性的关系
      const line = this.readLine().trim();
      if (line) {
        if (this.looksLikeRelationText(line)) this.parseRelation(line);
        else if (/^[A-Za-z0-9_\u4e00-\u9fa5]\w*$/.test(line)) this.ensureEntity(line);
      }
    }

    return { kind: 'er', entities: Array.from(this.entities.values()), relations: this.relations };
  }

  private looksLikeRelation(): boolean {
    let i = this.pos; let s = '';
    while (i < this.toks.length && this.toks[i].kind !== 'newline' && this.toks[i].kind !== 'eof') {
      s += this.toks[i].value; i++;
    }
    return this.looksLikeRelationText(s);
  }

  private looksLikeRelationText(s: string): boolean {
    return CARDINALITY.some(c => s.includes(c)) || /\|\|.*--.*\|\||\}o.*--|o\{.*--/.test(s);
  }

  private parseAttr(ent: ErEntity, line: string): void {
    // `string name` / `int id PK` / `type name`
    const parts = line.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const type = parts[0];
      const name = parts[1];
      const isKey = parts.slice(2).some(x => x === 'PK' || x === 'FK' || x === 'UK');
      ent.attrs.push({ name, type, isKey });
    } else if (parts.length === 1) {
      ent.attrs.push({ name: parts[0], type: '', isKey: false });
    }
  }

  private parseRelation(line: string): void {
    let label = '';
    const cIdx = line.indexOf(':');
    let core = line;
    if (cIdx >= 0) { label = line.slice(cIdx + 1).trim(); core = core.slice(0, cIdx).trim(); }

    // `A ||--o{ B [: label]` → 按 `--` 拆两端，基数记号贴各自实体：
    // 左段首 token=from、其余=fromCard；右段末 token=to、其余=toCard。
    let from = ''; let to = ''; let fromCard = ''; let toCard = '';
    const d = core.indexOf('--');
    if (d >= 0) {
      const lt = core.slice(0, d).trim().split(/\s+/).filter(Boolean);
      const rt = core.slice(d + 2).trim().split(/\s+/).filter(Boolean);
      from = lt.shift() ?? '';
      fromCard = lt.join('');
      to = rt.pop() ?? '';
      toCard = rt.join('');
      // 粘连兜底：`A||--o{B`。只剥含 | { } 的记号前/后缀，避免误伤 owner/photo 等 id。
      if (!fromCard && from) {
        const m = /^(.+?)([|o{}]*[{}|][|o{}]*)$/.exec(from);
        if (m) { from = m[1]; fromCard = m[2]; }
      }
      if (!toCard && to) {
        const m = /^([|o{}]*[{}|][|o{}]*)(.+)$/.exec(to);
        if (m) { toCard = m[1]; to = m[2]; }
      }
    }
    if (from && to) {
      this.ensureEntity(from);
      this.ensureEntity(to);
      this.relations.push({ from, to, label, fromCard, toCard });
    }
  }
}

/** 判断是否 erDiagram */
export function isEr(text: string): boolean {
  return /^erDiagram\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 erDiagram DSL */
export function parseEr(src: string): ErAST {
  return new ErParser(stripComments(tokenize(src))).parse();
}