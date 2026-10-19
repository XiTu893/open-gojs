/**
 * Mermaid requirementDiagram 语法分析器（SysML 需求图）。
 *
 * 支持：
 *  - 头行 `requirementDiagram`、方向 `direction TD|TB|BT|LR|RL`
 *  - 块声明 `requirement r1 { id: … text: … risk: … verifymethod: … }`
 *    与 `element e1 { type: … docref: … }`
 *    （functionalRequirement / interfaceRequirement 等枚举首 token 归为 requirement 节点）
 *  - 关系 `源 -类型-> 目标`，类型 ∈ contains/copies/derives/satisfies/verifies/refines/traces；
 *    反向写法 `源 <-类型- 目标` 解析为（目标 → 源）；未知类型的关系行忽略
 *  - 字段值可带引号；`%%` 注释跳过；未知行忽略；解析不抛错
 */
import { RequirementAST, FlowDir } from '../ast';

/** 关系类型白名单（mermaid requirementDiagram 规定的 7 种） */
const REL_TYPES = new Set([
  'contains', 'copies', 'derives', 'satisfies', 'verifies', 'refines', 'traces',
]);

/** requirement 类型枚举（首 token）→ 归为 requirement 节点 */
const REQ_KEYWORDS = new Set(['requirement', 'functionalRequirement', 'interfaceRequirement']);

/** 去掉引号外的 %% 行注释 */
function stripComment(line: string): string {
  let out = '';
  let quote = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      out += c;
      if (c === quote) quote = '';
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c;
      out += c;
      continue;
    }
    if (c === '%' && line[i + 1] === '%') break;
    out += c;
  }
  return out;
}

/** 去掉成对引号（容错，不匹配则原样返回） */
function unquote(s: string): string {
  const m = /^(['"`])([\s\S]*)\1$/.exec(s);
  return m ? m[2] : s;
}

/** 方向归一（TB 与 TD 同义） */
function normDir(d: string): FlowDir {
  const u = d.toUpperCase();
  if (u === 'BT') return 'BT';
  if (u === 'LR') return 'LR';
  if (u === 'RL') return 'RL';
  return 'TD';
}

/** 解析一行关系；无法识别返回 null */
function parseRelation(line: string): RequirementAST['relations'][number] | null {
  // 正向：源 -类型-> 目标（类型与箭头间可有空格）
  let m = /^([^\s<]+)\s*-\s*([A-Za-z]+)\s*->\s*([^\s]+)\s*$/.exec(line);
  if (m && REL_TYPES.has(m[2].toLowerCase())) {
    return { from: m[1], to: m[3], type: m[2].toLowerCase() };
  }
  // 反向：源 <-类型- 目标 ⇒ 方向取反（目标 → 源）
  m = /^([^\s]+)\s*<-\s*([A-Za-z]+)\s*-\s*([^\s]+)\s*$/.exec(line);
  if (m && REL_TYPES.has(m[2].toLowerCase())) {
    return { from: m[3], to: m[1], type: m[2].toLowerCase() };
  }
  return null;
}

/** 判断是否 requirementDiagram */
export function isRequirement(text: string): boolean {
  return /^requirementDiagram\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 requirementDiagram DSL */
export function parseRequirement(src: string): RequirementAST {
  const nodes: RequirementAST['nodes'] = [];
  const relations: RequirementAST['relations'] = [];
  let dir: FlowDir = 'TD';
  let headerSeen = false;
  let guard = 0;

  const lines = src.split(/\r?\n/);
  for (let li = 0; li < lines.length && guard++ < 5000; li++) {
    const line = stripComment(lines[li]).trim();
    if (!line) continue;

    // 首个非空行：头行
    if (!headerSeen) {
      headerSeen = true;
      if (/^requirementDiagram\b/i.test(line)) continue;
    }

    // direction TD|TB|BT|LR|RL
    const dm = /^direction\s+(\S+)\s*$/i.exec(line);
    if (dm) {
      dir = normDir(dm[1]);
      continue;
    }

    // 块声明 keyword name { ... }（单行/多行块体）
    const bm = /^(requirement|functionalRequirement|interfaceRequirement|element)\s+([^\s{]+)\s*\{(.*)$/.exec(line);
    if (bm) {
      const keyword = bm[1];
      const name = bm[2];
      const rest = bm[3].trim();
      const isElement = /^element$/i.test(keyword);
      const fields: Record<string, string> = {};

      const applyField = (inner: string) => {
        const fm = /^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/.exec(inner);
        if (fm) fields[fm[1].toLowerCase()] = unquote(fm[2].trim());
      };

      if (rest) {
        // 单行块体：`id: F1 text: xx`（} 可在同一行结尾）
        const body = rest.replace(/\}\s*$/, '').trim();
        // 以 key: 切分（value 内可含空格）
        const parts = body.split(/(?<=[^\s])\s+(?=[A-Za-z_][A-Za-z0-9_]*\s*:)/);
        for (const p of parts) applyField(p.trim());
      } else {
        // 读取多行块体直到 }
        while (li + 1 < lines.length) {
          li++;
          const inner = stripComment(lines[li]).trim();
          if (!inner) continue;
          if (/^\}/.test(inner)) break;
          applyField(inner);
        }
      }

      if (nodes.some(n => n.name === name)) continue; // 重复声明忽略
      if (isElement) {
        const n: RequirementAST['nodes'][number] = { name, kind: 'element' };
        if (fields['type'] !== undefined) n.type = fields['type'];
        if (fields['docref'] !== undefined) n.docref = fields['docref'];
        nodes.push(n);
      } else {
        const n: RequirementAST['nodes'][number] = { name, kind: 'requirement' };
        if (fields['id'] !== undefined) n.id = fields['id'];
        if (fields['text'] !== undefined) n.text = fields['text'];
        if (fields['risk'] !== undefined) n.risk = fields['risk'];
        if (fields['verifymethod'] !== undefined) n.verifymethod = fields['verifymethod'];
        if (fields['docref'] !== undefined) n.docref = fields['docref'];
        nodes.push(n);
      }
      continue;
    }

    // 关系行
    const rel = parseRelation(line);
    if (rel) {
      relations.push(rel);
      continue;
    }

    // 其余未知行：忽略（容错）
  }
  return { kind: 'requirement', dir, nodes, relations };
}
