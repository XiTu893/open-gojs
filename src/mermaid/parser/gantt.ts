/**
 * Mermaid gantt 语法分析器。
 *
 * 支持：
 *  - `gantt` / `title X` / `dateFormat YYYY-MM-DD` / `axisFormat %m-%d`
 *  - `section 名称`
 *  - 任务行 `任务名 :id, 2024-01-01, 5d` 或 `:id, after a1, 3d` 或 `:milestone, 2024-01-01, 0d`
 *  - after/starts/ends 关键字简化处理
 */
import { Token, tokenize, stripComments } from '../lexer';
import { GanttAST, GanttTask, ParseError } from '../ast';

class GanttParser {
  private toks: Token[];
  private pos = 0;
  private title?: string;
  private dateFormat = 'YYYY-MM-DD';
  private axisFormat?: string;
  private sections: { name: string; tasks: GanttTask[] }[] = [];
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

  private currentSection(): { name: string; tasks: GanttTask[] } {
    if (!this.sections.length) this.sections.push({ name: '', tasks: [] });
    return this.sections[this.sections.length - 1];
  }

  parse(): GanttAST {
    this.skipEol();
    // 首行 gantt
    if (this.peek().kind === 'ident' && this.peek().value === 'gantt') { this.next(); this.readLine(); }
    this.skipEol();
    let guard = 0;
    while (this.peek().kind !== 'eof' && guard++ < 4000) {
      if (this.peek().kind === 'newline') { this.next(); continue; }
      const line = this.readLine();
      if (!line) continue;

      if (/^title\s+/.test(line)) { this.title = line.replace(/^title\s+/, '').trim(); continue; }
      if (/^dateFormat\s+/.test(line)) { this.dateFormat = line.replace(/^dateFormat\s+/, '').trim(); continue; }
      if (/^axisFormat\s+/.test(line)) { this.axisFormat = line.replace(/^axisFormat\s+/, '').trim(); continue; }
      if (/^(excludes|todayMarker)\b/.test(line)) continue;

      const sec = /^section\s+(.+)$/.exec(line);
      if (sec) { this.sections.push({ name: sec[1].trim(), tasks: [] }); continue; }

      // 任务行：name :id, start, dur
      const task = this.parseTaskLine(line);
      if (task) this.currentSection().tasks.push(task);
    }
    return {
      kind: 'gantt',
      title: this.title,
      dateFormat: this.dateFormat,
      axisFormat: this.axisFormat,
      sections: this.sections.filter(s => s.tasks.length || s.name),
    };
  }

  private parseTaskLine(line: string): GanttTask | null {
    const cIdx = line.indexOf(':');
    if (cIdx < 0) return null;
    const name = line.slice(0, cIdx).trim();
    if (!name) return null;
    const rest = line.slice(cIdx + 1);
    // 逗号分段
    const parts = rest.split(',').map(s => s.trim()).filter(Boolean);
    let id = name;
    let start: string | number = '';
    let duration: string | number = '';
    let isMilestone = false;

    // 形式：id, start, dur  |  id, after xx, dur  |  milestone,...
    const segs = parts;
    if (segs.length >= 1 && /^[A-Za-z0-9_-]+$/.test(segs[0]) && !/\d/.test(segs[0][0] ?? '')) {
      id = segs[0];
      // 后续是 start 与 dur
      if (segs[1]) start = segs[1];
      if (segs[2]) duration = segs[2];
    } else {
      // 无 id 前缀，直接 start
      if (segs[0]) start = segs[0];
      if (segs[1]) duration = segs[1];
    }
    // milestone 标记
    if (parts.some(p => /milestone/i.test(p))) isMilestone = true;
    // after 关键字保留在 start 中（由渲染阶段解析依赖）

    const task: GanttTask = { section: '', name, id, start, duration, isMilestone };
    return task;
  }
}

/** 判断是否 gantt */
export function isGantt(text: string): boolean {
  return /^gantt\b/i.test((text.split('\n')[0] || '').trim());
}

/** 解析 gantt DSL */
export function parseGantt(src: string): GanttAST {
  return new GanttParser(stripComments(tokenize(src))).parse();
}