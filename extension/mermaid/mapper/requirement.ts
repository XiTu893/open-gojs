/**
 * requirementDiagram AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：按关系做最长路径分层（迭代松弛，环有界），沿 direction 摆放 ——
 * TD/BT 分层为行、LR/RL 分层为列，层内居中；BT/RL 末尾整体镜像。
 * 配色只取 theme（默认黑白）：requirement/element 均用 theme.categories.process。
 */
import { RequirementAST, FlowDir } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const MARGIN = 32;
const GAP_MAIN = 68;   // 沿流向的层间距
const GAP_CROSS = 40;  // 层内间距
const LINE_H = 20;     // 文本行高
const PAD_X = 12;
const PAD_Y = 9;
const MIN_W = 150;

/** 映射后的节点数据 */
export interface MappedRequirementNode {
  key: string;
  category: 'Requirement' | 'Element';
  loc: string;
  w: number;
  h: number;
  text: string;
  fill: string;
  stroke: string;
  textCol: string;
}

/** 映射后的连线数据 */
export interface MappedRequirementLink {
  from: string;
  to: string;
  label: string;
}

/** 估算文本宽度（CJK 全宽、其余按 0.62em） */
function textW(s: string, px: number): number {
  let w = 0;
  for (const ch of s) {
    w += /[⺀-鿿　-〿＀-￯]/.test(ch) ? px : px * 0.62;
  }
  return Math.ceil(w);
}

/** 节点多行文本（requirement 4 行 / element 2~3 行） */
function nodeLines(n: RequirementAST['nodes'][number]): string[] {
  const lines: string[] = [];
  if (n.kind === 'requirement') {
    lines.push('«requirement»');
    lines.push(n.id || n.name);
    if (n.text) lines.push(n.text);
    const tail = [n.risk, n.verifymethod].filter(Boolean).join(' · ');
    if (tail) lines.push(tail);
  } else {
    lines.push('«element»');
    if (n.type) lines.push(n.type);
    if (n.docref) lines.push(`docref: ${n.docref}`);
    if (!n.type && !n.docref) lines.push(n.name);
  }
  return lines;
}

/** 主入口 */
export function mapRequirement(
  ast: RequirementAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedRequirementNode[]; links: MappedRequirementLink[]; dir: FlowDir } {
  const cs = theme.categories.process;
  const fs = theme.fontSize.node;
  const vertical = ast.dir === 'TD' || ast.dir === 'BT';

  // ---- 节点尺寸 ----
  interface Item { key: string; w: number; h: number; text: string; category: 'Requirement' | 'Element' }
  const items: Item[] = [];
  const seen = new Set<string>();
  for (const n of ast.nodes) {
    if (seen.has(n.name)) continue;
    seen.add(n.name);
    const lines = nodeLines(n);
    let maxLine = 0;
    for (const ln of lines) maxLine = Math.max(maxLine, textW(ln, fs));
    const w = Math.max(MIN_W, Math.ceil(maxLine) + PAD_X * 2 + 6);
    const h = lines.length * LINE_H + PAD_Y * 2;
    items.push({
      key: n.name,
      w,
      h,
      text: lines.join('\n'),
      category: n.kind === 'requirement' ? 'Requirement' : 'Element',
    });
  }
  const sizeOf = new Map<string, Item>();
  for (const it of items) sizeOf.set(it.key, it);

  // ---- 分层（最长路径松弛，环最多迭代 N 轮有界） ----
  const layer = new Map<string, number>();
  for (const it of items) layer.set(it.key, 0);
  const rels = ast.relations.filter(r => sizeOf.has(r.from) && sizeOf.has(r.to));
  for (let round = 0; round < items.length; round++) {
    let changed = false;
    for (const r of rels) {
      const lv = (layer.get(r.from) ?? 0) + 1;
      if (lv > (layer.get(r.to) ?? 0)) {
        layer.set(r.to, lv);
        changed = true;
      }
    }
    if (!changed) break;
  }

  // 按层分组（保持声明顺序）
  const maxLayer = items.reduce((m, it) => Math.max(m, layer.get(it.key) ?? 0), 0);
  const bands: Item[][] = [];
  for (let l = 0; l <= maxLayer; l++) bands.push([]);
  for (const it of items) bands[layer.get(it.key) ?? 0].push(it);

  // ---- 分层摆放（主轴 = 流向，副轴 = 垂直流向） ----
  const pos = new Map<string, { u: number; v: number; uSize: number; vSize: number }>();
  let maxCross = 0;
  const bandMain: number[] = [];
  for (const band of bands) {
    if (!band.length) { bandMain.push(0); continue; }
    let main = 0;
    let cross = 0;
    for (let i = 0; i < band.length; i++) {
      const it = band[i];
      const uSize = vertical ? it.h : it.w;
      const vSize = vertical ? it.w : it.h;
      main = Math.max(main, uSize);
      cross += vSize + (i > 0 ? GAP_CROSS : 0);
    }
    bandMain.push(main);
    maxCross = Math.max(maxCross, cross);
  }

  let mainPos = MARGIN;
  for (let b = 0; b < bands.length; b++) {
    const band = bands[b];
    const main = bandMain[b];
    if (!band.length) {
      mainPos += GAP_MAIN;
      continue;
    }
    let cross = 0;
    for (const it of band) cross += (vertical ? it.w : it.h) + GAP_CROSS;
    cross -= GAP_CROSS;
    let crossStart = MARGIN + (maxCross - cross) / 2;
    for (const it of band) {
      const uSize = vertical ? it.h : it.w;
      const vSize = vertical ? it.w : it.h;
      const u = mainPos + (main - uSize) / 2;
      const v = crossStart;
      pos.set(it.key, { u, v, uSize, vSize });
      crossStart += vSize + GAP_CROSS;
    }
    mainPos += main + GAP_MAIN;
  }

  // ---- 主/副轴 → 屏幕坐标（BT/RL 整体镜像） ----
  const totalMain = mainPos - GAP_MAIN + MARGIN;
  const project = (p: { u: number; v: number; uSize: number; vSize: number }): { x: number; y: number } => {
    if (vertical) {
      const y = ast.dir === 'BT' ? totalMain - p.u - p.uSize : p.u;
      return { x: p.v, y };
    }
    const x = ast.dir === 'RL' ? totalMain - p.u - p.uSize : p.u;
    return { x, y: p.v };
  };

  // ---- 输出 ----
  const nodes: MappedRequirementNode[] = [];
  for (const it of items) {
    const p = pos.get(it.key)!;
    const { x, y } = project(p);
    nodes.push({
      key: it.key,
      category: it.category,
      loc: `${Math.round(x)} ${Math.round(y)}`,
      w: Math.round(it.w),
      h: Math.round(it.h),
      text: it.text,
      fill: cs.fill,
      stroke: cs.stroke,
      textCol: cs.text,
    });
  }

  const links: MappedRequirementLink[] = [];
  for (const r of rels) {
    links.push({ from: r.from, to: r.to, label: r.type });
  }

  return { nodes, links, dir: ast.dir };
}
