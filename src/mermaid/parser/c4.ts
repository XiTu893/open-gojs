/**
 * Mermaid C4（PlantUML 兼容子集）语法分析器。
 *
 * 支持：
 *  - 头行 `C4Context` / `C4Container` / `C4Component` / `C4Dynamic` / `C4Deployment`
 *  - `title 文本`
 *  - 元素声明：Person / System / Container / Component / Deployment_Node / Node
 *    及 `_Ext` / `Db` / `Queue` 后缀（参数可无引号容错；desc 及之后参数忽略）
 *  - 边界：`Boundary(alias, "Label") {` … `}` —— 维护 boundary 栈，
 *    成员元素挂 boundaryAlias（AST 原字段不含，在本文件内扩展）
 *  - 关系：`Rel(from, to, "label", tech?, ...)`、`BiRel(...)`（bi=true），多余参数忽略
 *  - `UpdateElementStyle` / `UpdateRelStyle` / `UpdateLayoutConfig` / `Lay_*` 样式行跳过；
 *    UpdateLayoutConfig 中的 c4ShapeInRow 数值读入 maxPerRow（缺省 4）
 *  - `%%` / `//` 注释跳过、未知行忽略、解析不抛错
 */
import { C4AST } from '../ast';

/** 元素扩展：归属的 boundary（AST elements 无此字段） */
type C4ElementBase = C4AST['elements'][number];
export interface C4ElementX extends C4ElementBase {
  boundaryAlias?: string;
}

/** 声明顺序项（元素与 boundary 交错，供映射器按源顺序摆放） */
export type C4OrderItem =
  | { kind: 'element'; alias: string }
  | { kind: 'boundary'; alias: string };

/** C4 AST 扩展：boundary 成员归属 + 声明顺序 + 每行元素数 */
export interface C4ASTX extends C4AST {
  elements: C4ElementX[];
  order: C4OrderItem[];
  maxPerRow?: number;
}

/** 元素构造 → 类型/外部标记 */
const ELEMENT_KINDS: Record<string, { type: C4AST['elements'][number]['type']; ext?: boolean }> = {
  Person: { type: 'person' },
  Person_Ext: { type: 'person', ext: true },
  System: { type: 'system' },
  System_Ext: { type: 'system', ext: true },
  SystemDb: { type: 'system' },
  SystemQueue: { type: 'system' },
  Container: { type: 'container' },
  ContainerDb: { type: 'container' },
  Container_Ext: { type: 'container', ext: true },
  Component: { type: 'component' },
  ComponentDb: { type: 'component' },
  Component_Ext: { type: 'component', ext: true },
  Deployment_Node: { type: 'node' },
  Node: { type: 'node' },
  Node_Ext: { type: 'node', ext: true },
};

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

/** 去掉成对引号 */
function unquote(s: string): string {
  const t = s.trim();
  const m = /^(['"`])([\s\S]*)\1$/.exec(t);
  return m ? m[2] : t;
}

/** 顶层逗号切参（跳过引号与嵌套括号） */
function splitArgs(s: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q: string | null = null;
  let depth = 0;
  for (const ch of s) {
    if (q) {
      if (ch === q) q = null;
      cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { q = ch; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const HEADER_RE = /^C4(Context|Container|Component|Dynamic|Deployment)\b/i;

/** 判断是否 C4 图 */
export function isC4(text: string): boolean {
  return HEADER_RE.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 C4 DSL（容错，不抛错） */
export function parseC4(src: string): C4ASTX {
  let variant: C4AST['variant'] = 'context';
  let title: string | undefined;
  const elements: C4ElementX[] = [];
  const boundaries: C4AST['boundaries'] = [];
  const rels: C4AST['rels'] = [];
  const order: C4OrderItem[] = [];
  let maxPerRow: number | undefined;
  const stack: string[] = []; // boundary 栈
  let headerSeen = false;
  let guard = 0;

  for (const raw of src.split(/\r?\n/)) {
    if (guard++ > 20000) break;
    const line = stripComment(raw).trim();
    if (!line) continue;

    // 头行
    if (!headerSeen) {
      headerSeen = true;
      const hm = HEADER_RE.exec(line);
      if (hm) {
        variant = hm[1].toLowerCase() as C4AST['variant'];
        continue;
      }
    }

    // 边界收尾
    if (line === '}') {
      if (stack.length) stack.pop();
      continue;
    }

    // title
    const tm = /^title\s+(.*)$/i.exec(line);
    if (tm) { title = tm[1].trim(); continue; }

    // 样式/布局行：跳过；UpdateLayoutConfig 的数值参数读入 maxPerRow
    if (/^(UpdateElementStyle|UpdateRelStyle|UpdateLayoutConfig|Lay_)/i.test(line)) {
      const lm = /^UpdateLayoutConfig\s*\((.*)\)\s*$/i.exec(line);
      if (lm) {
        for (const a of splitArgs(lm[1])) {
          const num = /^(\d+)$/.exec(unquote(a));
          if (num) { maxPerRow = parseInt(num[1], 10); break; }
          const named = /c4ShapeInRow\D*(\d+)/i.exec(a);
          if (named) { maxPerRow = parseInt(named[1], 10); break; }
        }
      }
      continue;
    }

    // Boundary 开
    const bm = /^Boundary\s*\((.*)\)\s*\{?\s*$/i.exec(line);
    if (bm) {
      const args = splitArgs(bm[1]);
      if (args.length >= 1) {
        const alias = unquote(args[0]);
        if (alias) {
          const label = args.length >= 2 ? unquote(args[1]) : '';
          boundaries.push({ alias, label: label || alias });
          order.push({ kind: 'boundary', alias });
          stack.push(alias);
        }
      }
      continue;
    }

    // 关系
    const rm = /^(Rel|BiRel)\s*\((.*)\)\s*$/i.exec(line);
    if (rm) {
      const args = splitArgs(rm[2]);
      if (args.length >= 2) {
        const from = unquote(args[0]);
        const to = unquote(args[1]);
        if (from && to) {
          const rel: C4AST['rels'][number] = { from, to };
          const lab = args.length >= 3 ? unquote(args[2]) : '';
          if (lab) rel.label = lab;
          if (rm[1].toLowerCase() === 'birel') rel.bi = true;
          rels.push(rel);
        }
      }
      continue;
    }

    // 元素声明
    const em = /^([A-Za-z][A-Za-z0-9_]*)\s*\((.*)\)\s*$/.exec(line);
    if (em) {
      const spec = ELEMENT_KINDS[em[1]];
      if (spec) {
        const args = splitArgs(em[2]);
        if (args.length >= 1) {
          const alias = unquote(args[0]);
          if (alias) {
            const label = args.length >= 2 ? unquote(args[1]) : '';
            const boundaryAlias = stack.length ? stack[stack.length - 1] : undefined;
            const existing = elements.find(e => e.alias === alias);
            if (existing) {
              if (boundaryAlias && !existing.boundaryAlias) existing.boundaryAlias = boundaryAlias;
            } else {
              const el: C4ElementX = { alias, label: label || alias, type: spec.type };
              if (spec.ext) el.ext = true;
              if (boundaryAlias) el.boundaryAlias = boundaryAlias;
              elements.push(el);
              order.push({ kind: 'element', alias });
            }
          }
        }
        continue;
      }
    }

    // 未知行：忽略（容错）
  }

  const ast: C4ASTX = { kind: 'c4', variant, title, elements, boundaries, rels, order };
  if (maxPerRow !== undefined && maxPerRow > 0) ast.maxPerRow = maxPerRow;
  return ast;
}
