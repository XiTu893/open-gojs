/**
 * Mermaid usecase-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `usecase-beta`（可带方向 `usecase-beta LR`）与 `direction TD|TB|BT|LR|RL`
 *  - `actor id` / `actor id("标签")` / `actor business id`
 *  - 用例 `id("标签")`（椭圆）、`id["标签"]`（矩形）、裸 `"文本"`（自动生成 id）
 *  - `systemBoundary id["标题"] { … }` 块（成员归属该 boundary）
 *  - 关系：`-->` assoc（`-->|标签|` / `-- 标签 -->` 容错）、
 *    `..>`（标签含 include/extend ⇒ include/extend，`..> : include` 亦识别）、
 *    `--|>` generalization；关系可出现在声明之前（未声明端点补成椭圆用例）
 *  - `%%` 注释跳过、未知行忽略、解析不抛错
 */
import { UsecaseAST, FlowDir } from '../ast';

/** boundary 扩展：带成员列表（AST 原字段不含 members，故在本文件内扩展） */
export interface UsecaseBoundary {
  id: string;
  title: string;
  members: string[];
}

/** usecase AST 扩展（仅 boundaries 收窄，其余与 UsecaseAST 一致） */
export interface UsecaseASTX extends UsecaseAST {
  boundaries: UsecaseBoundary[];
}

interface Decl {
  actor?: boolean;
  business?: boolean;
  id: string;
  label: string;
  rect?: boolean;
}

/** 去掉 %% 行注释 */
function stripComment(line: string): string {
  return line.replace(/%%.*$/, '');
}

/** 去掉成对引号 */
function unquote(s: string): string {
  const m = /^(['"`])([\s\S]*)\1$/.exec(s);
  return m ? m[2] : s;
}

/** 方向归一（TB → TD） */
function normDir(d: string): FlowDir {
  const u = d.toUpperCase();
  if (u === 'BT') return 'BT';
  if (u === 'LR') return 'LR';
  if (u === 'RL') return 'RL';
  return 'TD';
}

/** 非词字符 → '_'（生成裸引号文本的 id；保留 CJK 等全角文字，避免不同文本坍缩成同一 id） */
function makeId(s: string): string {
  return s.replace(/[^\w\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/g, '_');
}

/** 行内是否含用例关系箭头 */
function hasArrow(line: string): boolean {
  return /-->|\.\.>|--\|>/.test(line);
}

/** include/extend 标签归一 */
function normKindLabel(kind: 'include' | 'extend', label?: string): string | undefined {
  if (!label) return undefined;
  const low = label.toLowerCase().replace(/[<>]/g, '').trim();
  if (low === kind) return `<<${kind}>>`;
  return label;
}

/** 解析一行关系 */
function parseRelation(line: string): UsecaseAST['relations'][number] | null {
  let m: RegExpExecArray | null;
  // A -- 标签 --> B
  m = /^(\S+)\s+--\s+(.+?)\s+(-->|\.\.>|--\|>)\s*(\S+)$/.exec(line);
  if (m) return buildRel(m[1], m[4], m[3], m[2]);
  // A -->|标签| B
  m = /^(\S+)\s*(-->|\.\.>|--\|>)\s*\|([^|]*)\|\s*(\S+)$/.exec(line);
  if (m) return buildRel(m[1], m[4], m[2], m[3]);
  // A --> B : 标签
  m = /^(\S+)\s*(-->|\.\.>|--\|>)\s*(\S+)\s*:\s*(.+)$/.exec(line);
  if (m) return buildRel(m[1], m[3], m[2], m[4]);
  // A --> B（含粘连 A-->B）
  m = /^(\S+)\s*(-->|\.\.>|--\|>)\s*(\S+)$/.exec(line);
  if (m) return buildRel(m[1], m[3], m[2]);
  return null;
}

function buildRel(
  from: string,
  to: string,
  arrow: string,
  label?: string
): UsecaseAST['relations'][number] {
  let kind: UsecaseAST['relations'][number]['kind'] = 'assoc';
  const raw = (label ?? '').trim();
  if (arrow === '--|>') kind = 'generalization';
  else if (arrow === '..>') {
    const low = raw.toLowerCase().replace(/[<>]/g, '');
    kind = low.includes('extend') ? 'extend' : 'include';
  }
  const rel: UsecaseAST['relations'][number] = { from, to, kind };
  let lab = raw || undefined;
  if (kind === 'include' || kind === 'extend') lab = normKindLabel(kind, lab);
  else if (kind === 'generalization') lab = lab || undefined;
  if (lab) rel.label = lab;
  return rel;
}

/** 解析声明行（actor 前缀可选）；无法识别返回 null */
function parseDecl(line: string): Decl | null {
  let s = line;
  let actor = false;
  let business = false;
  const am = /^actor\s+(.*)$/.exec(s);
  if (am) {
    actor = true;
    s = am[1].trim();
    const bm = /^business\s+(\S.*)$/.exec(s);
    if (bm) {
      business = true;
      s = bm[1].trim();
    }
  }
  if (!s) return null;

  // 裸引号文本："标签"
  const qm = /^(['"`])([\s\S]*)\1$/.exec(s);
  if (qm) {
    const label = qm[2];
    const d: Decl = { id: makeId(label), label };
    if (actor) d.actor = true;
    if (business) d.business = true;
    return d;
  }

  // id[标签] / id(标签) / 纯 id
  const dm = /^([^\s[\](){}]+)(?:\[\s*([\s\S]*?)\s*\]|\(\s*([\s\S]*?)\s*\))?$/.exec(s);
  if (!dm) return null;
  const id = dm[1];
  const d: Decl = { id, label: id };
  if (dm[2] !== undefined) {
    d.label = unquote(dm[2].trim()) || id;
    d.rect = true;
  } else if (dm[3] !== undefined) {
    d.label = unquote(dm[3].trim()) || id;
    d.rect = false;
  }
  if (actor) d.actor = true;
  if (business) d.business = true;
  return d;
}

/** 解析 systemBoundary 头：`systemBoundary id["标题"] {` */
function parseBoundaryHead(line: string): UsecaseBoundary | null {
  const m = /^systemBoundary\s+([^\s[\](){}]+)\s*(?:\[\s*([\s\S]*?)\s*\]|\(\s*([\s\S]*?)\s*\))?\s*\{$/.exec(line);
  if (!m) return null;
  const id = m[1];
  const rawTitle = m[2] !== undefined ? m[2] : m[3];
  const title = rawTitle !== undefined ? unquote(rawTitle.trim()) : '';
  return { id, title: title || id, members: [] };
}

/** 判断是否 usecase-beta */
export function isUsecase(text: string): boolean {
  return /^usecase-beta\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 usecase DSL */
export function parseUsecase(src: string): UsecaseASTX {
  const actors: UsecaseAST['actors'] = [];
  const cases: UsecaseAST['cases'] = [];
  const boundaries: UsecaseBoundary[] = [];
  const relations: UsecaseAST['relations'] = [];
  let dir: FlowDir = 'TD';
  let cur: UsecaseBoundary | null = null;
  let headerSeen = false;
  let guard = 0;

  const hasActor = (id: string) => actors.some(a => a.id === id);
  const hasCase = (id: string) => cases.some(c => c.id === id);

  /** 登记 actor（去重 + id 冲突改名） */
  const ensureActor = (d: Decl): string => {
    let id = d.id;
    if (hasActor(id) || hasCase(id)) {
      if (hasActor(id)) return id;
      let k = 2;
      while (hasActor(`${id}_${k}`) || hasCase(`${id}_${k}`)) k++;
      id = `${id}_${k}`;
    }
    const a: UsecaseAST['actors'][number] = { id, label: d.label };
    if (d.business) a.business = true;
    actors.push(a);
    return id;
  };

  /** 登记用例（去重 + id 冲突改名） */
  const ensureCase = (d: Decl): string => {
    let id = d.id;
    if (hasActor(id) || hasCase(id)) {
      if (hasCase(id)) return id;
      let k = 2;
      while (hasActor(`${id}_${k}`) || hasCase(`${id}_${k}`)) k++;
      id = `${id}_${k}`;
    }
    const c: UsecaseAST['cases'][number] = { id, label: d.label };
    if (d.rect) c.rect = true;
    cases.push(c);
    return id;
  };

  const lines = src.split(/\r?\n/);
  for (let li = 0; li < lines.length && guard++ < 5000; li++) {
    const line = stripComment(lines[li]).trim();
    if (!line) continue;

    // 头行
    if (!headerSeen) {
      headerSeen = true;
      const hm = /^usecase-beta(?:\s+(\S+))?\b/i.exec(line);
      if (hm) {
        if (hm[1] && /^(TD|TB|BT|LR|RL)$/i.test(hm[1])) dir = normDir(hm[1]);
        continue;
      }
    }

    // direction
    const dm = /^direction\s+(\S+)\s*$/i.exec(line);
    if (dm) {
      dir = normDir(dm[1]);
      continue;
    }

    // boundary 收尾
    if (line === '}') {
      cur = null;
      continue;
    }

    // boundary 开
    const bh = parseBoundaryHead(line);
    if (bh) {
      boundaries.push(bh);
      cur = bh;
      continue;
    }

    // 关系行（含箭头）
    if (hasArrow(line)) {
      const rel = parseRelation(line);
      if (rel) relations.push(rel);
      continue;
    }

    // 声明行
    const decl = parseDecl(line);
    if (decl) {
      // 纯裸标识符只在 boundary 内视为成员引用；顶层按未知行忽略
      const looksBare = !/^actor\b/.test(line) && !/[\[('"`]/.test(line);
      if (looksBare && !cur) continue;
      const id = decl.actor ? ensureActor(decl) : ensureCase(decl);
      if (cur && !cur.members.includes(id)) cur.members.push(id);
      continue;
    }

    // 未知行：忽略（容错）
  }

  // 关系端点补成隐式椭圆用例（关系可先于声明出现；boundary id 不补 —— 避免与组盒 key 冲突）
  for (const r of relations) {
    for (const id of [r.from, r.to]) {
      if (!hasActor(id) && !hasCase(id) && !boundaries.some(b => b.id === id)) {
        cases.push({ id, label: id });
      }
    }
  }

  return { kind: 'usecase', dir, actors, cases, boundaries, relations };
}
