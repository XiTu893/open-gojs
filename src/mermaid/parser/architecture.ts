/**
 * Mermaid architecture-beta 语法分析器。
 *
 * 支持：
 *  - 头行 `architecture-beta` / `architecture`
 *  - `group 别名(图标)[标题]`（图标 token 忽略 —— 本项目无图标库）
 *  - `service 别名(图标)[标题] [in 组别名]`
 *  - `db 别名(图标)[标题] [in 组别名]`（db 声明头同样当 service）
 *  - 连接 `源别名:源端口 -> 目标端口:目标别名`（端口 R/L/T/B = 右/左/上/下）
 *    容错：无端口写法 `a -> b`（默认 R→L）
 *  - `%%` 注释跳过、未知行忽略、解析不抛错
 */
import { ArchitectureAST, ArchitecturePort } from '../ast';

/** 端口字符 → 大写（非 R/L/T/B 的字符原样保留，由映射层容错） */
function normPort(p: string): string {
  const u = p.toUpperCase();
  return u === 'R' || u === 'L' || u === 'T' || u === 'B' ? u : u;
}

function unquote(s: string): string {
  const m = /^(['"`])([\s\S]*)\1$/.exec(s);
  return m ? m[2] : s;
}

/** 判断是否 architecture（-beta） */
export function isArchitecture(text: string): boolean {
  return /^(architecture-beta|architecture)\b/i.test((text.split(/\r?\n/)[0] || '').trim());
}

/** 解析 architecture DSL */
export function parseArchitecture(src: string): ArchitectureAST {
  const groups: ArchitectureAST['groups'] = [];
  const services: ArchitectureAST['services'] = [];
  const conns: ArchitecturePort[] = [];
  let headerSeen = false;
  let guard = 0;

  const lines = src.split(/\r?\n/);
  for (const raw of lines) {
    if (guard++ > 5000) break;
    const line = raw.replace(/%%.*$/, '').trim();
    if (!line) continue;

    if (!headerSeen) {
      headerSeen = true;
      if (/^architecture(?:-beta)?\b/i.test(line)) continue;
    }

    // group 别名(图标)[标题]（图标可省略）
    let m = /^group\s+([^\s[\]()]+)\s*(?:\([^)]*\))?\s*\[\s*([\s\S]*?)\s*\]\s*$/.exec(line);
    if (m) {
      const alias = m[1];
      const label = unquote(m[2].trim()) || alias;
      if (!groups.some(g => g.alias === alias)) groups.push({ alias, label });
      continue;
    }

    // service / db 头：别名(图标)[标题] [in 组别名]
    m = /^(?:service|db)\s+([^\s[\]()]+)\s*(?:\([^)]*\))?\s*\[\s*([\s\S]*?)\s*\](?:\s+in\s+(\S+))?\s*$/.exec(line);
    if (m) {
      const alias = m[1];
      const label = unquote(m[2].trim()) || alias;
      const grp = m[3];
      const s: ArchitectureAST['services'][number] = { alias, label };
      if (grp) s.group = grp;
      if (!services.some(x => x.alias === alias)) services.push(s);
      continue;
    }

    // 连接：源:源端口 -> 目标端口:目标
    m = /^([^\s:]+):([A-Za-z])\s*->\s*([A-Za-z]):([^\s:]+)$/.exec(line);
    if (m) {
      conns.push({
        from: m[1], fromPort: normPort(m[2]),
        to: m[4], toPort: normPort(m[3]),
      });
      continue;
    }
    // 容错：无端口 a -> b（默认 R → L）
    m = /^([^\s:]+)\s*->\s*([^\s:]+)$/.exec(line);
    if (m) {
      conns.push({ from: m[1], fromPort: 'R', to: m[2], toPort: 'L' });
      continue;
    }

    // 未知行：忽略
  }

  return { kind: 'architecture', groups, services, conns };
}
