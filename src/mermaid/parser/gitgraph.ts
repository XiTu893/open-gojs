/**
 * Mermaid gitGraph 语法分析器。
 *
 * 支持子集：
 *  - 头行 `gitGraph` / `gitgraph`，可选 `direction LR|BT`（垂直方向忽略，仅 LR 有意义，此处不改变 AST）
 *  - `commit`（无参自动生成 id）
 *  - `commit id:"x"`、`commit id:"x" label:"y"`（tag:/shortid: 容错忽略）
 *  - `branch <名>`（只声明，不切换）、`checkout <名>`（切换当前分支）、`merge <名>`
 *
 * AST：按出现顺序记录每条 commit（含其当前分支）；
 * merge 的 parents = [当前分支, 被合并分支]；branches 按声明序（隐含 main 在首位）。
 * 容错：`%%` 注释跳过、未知行忽略、重复 id 自动去重。
 */
import { GitGraphAST } from '../ast';

type GitCommit = GitGraphAST['commits'][number];

/** 去注释 + trim + 丢空行 */
function srcLines(src: string): string[] {
  return src.split(/\r?\n/)
    .map(l => l.replace(/%%.*$/, '').trim())
    .filter(l => l.length > 0);
}

/** 判断是否 gitGraph */
export function isGitGraph(text: string): boolean {
  const first = srcLines(text)[0] ?? '';
  return /^gitGraph\b/i.test(first);
}

/** 提取 `key:"值"` / `key:值` 形式的属性 */
function attrsOf(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /(?:^|\s)(id|label|tag|shortid)\s*:\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    out[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return out;
}

/** 解析 gitGraph DSL */
export function parseGitGraph(src: string): GitGraphAST {
  const commits: GitCommit[] = [];
  const branches: string[] = ['main'];
  let current = 'main';
  let seq = 0;
  const used = new Set<string>();

  /** 生成不重复 id */
  const uniq = (want: string): string => {
    let id = want;
    let n = 2;
    while (used.has(id)) id = `${want}_${n++}`;
    used.add(id);
    return id;
  };

  for (const line of srcLines(src)) {
    let m: RegExpExecArray | null;
    if (/^gitGraph\b/i.test(line)) continue;
    // direction 只有 LR 有意义；BT/TD 等垂直方向忽略（布局始终水平时间轴）
    if (/^direction\s+/i.test(line)) continue;

    if (/^commit\b/i.test(line)) {
      const a = attrsOf(line.replace(/^commit\b/i, '').trim());
      const id = uniq(a.id && a.id.length > 0 ? a.id : `C${seq}`);
      seq++;
      commits.push({
        id,
        type: 'commit',
        label: a.label && a.label.length > 0 ? a.label : undefined,
        branch: current,
        parents: [],
      });
      continue;
    }

    if ((m = /^branch\s+(\S+)\s*$/i.exec(line))) {
      if (!branches.includes(m[1])) branches.push(m[1]);
      continue;
    }

    if ((m = /^checkout\s+(\S+)\s*$/i.exec(line))) {
      current = m[1];
      if (!branches.includes(current)) branches.push(current);
      continue;
    }

    if ((m = /^merge\s+(\S+)\s*$/i.exec(line))) {
      const id = uniq(`M${seq}`);
      seq++;
      commits.push({
        id,
        type: 'merge',
        label: undefined,
        branch: current,
        parents: [current, m[1]],
      });
      continue;
    }
    // 未知行忽略
  }
  return { kind: 'gitgraph', commits, branches };
}
