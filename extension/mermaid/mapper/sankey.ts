/**
 * sankey AST → GoJS 模型数据映射。
 *
 * 布局 = d3-sankey 0.12.3 的忠实移植（官方 mermaid@11 就是调它），与官方坐标对齐：
 *  - depth/height：双向 BFS（有环时抛错 → 回退 legacy 分层布局）
 *  - 列分配：justify（源在最左、汇在最右）；kx = (W - nodeWidth)/(层数-1)
 *  - py = nodePadding（mermaid: 12 + showValues(15) = 27）；ky = min 各列 (H-(列长-1)*py)/值和
 *  - 列内顶对齐后把余量按 (i+1) 前插均摊；sourceLinks/targetLinks 按对方 y0 排序
 *  - 6 轮 relaxRightToLeft/relaxLeftToRight（alpha=0.99^i、beta=max(1-alpha,(i+1)/6)）
 *    + resolveCollisions（中点发散 + 画布边界钳制）
 *  - link.y0/y1 = 从节点 y0 起顺序累计的中心线（stroke 中心即带中心）
 *  - 流量带 = 中心线贝塞尔（官方 d3 linkHorizontal：C midX,y0 midX,y1 x2,y1）
 *  - 标签 = 官方半幅规则（x < W/2 → 条右伸，否则条左伸贴 6px，垂直居中）+ id/value 两行
 *  - 节点竖条（官方 nodeWidth 10）；条色按节点顺序轮换 d3 category10 调色板
 */
import { SankeyAST } from '../parser/sankey';
import { MermaidTheme, defaultTheme } from '../themes';

/** 画布尺寸（对标官方 sankey 600×400） */
export const SANKEY_W = 600;
export const SANKEY_H = 400;

const NODE_W = 10;         // 官方 sankey nodeWidth 默认 10
const NODE_PADDING = 27;   // 官方 nodePadding(12 + showValues 15) = 27
const ITERATIONS = 6;      // d3-sankey 默认 iterations 6
const MIN_H = 2;           // legacy 回退用的最小节点高度
const BASELINE_OFF = 4.8;  // 标签 loc（盒中心）→ 官方文本基线的补偿（16px 单行实测）

/** 官方 sankey 默认调色板（d3 category10） */
const D3_PALETTE = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];

/** 映射后的节点类别 */
export type SankeyNodeCategory = 'SankeyNode' | 'SankeyFlow' | 'SankeyLabel';

/** 映射后的节点数据 */
export interface MappedSankeyNode {
  key: string;
  category: SankeyNodeCategory;
  loc: string;
  text?: string;
  fill?: string;
  w?: number;
  h?: number;
  /** SankeyFlow: geometryString（闭合丝带轮廓，局部坐标 min 角在 0,0；loc=文档原点） */
  geom?: string;
  /** SankeyFlow: 描边渐变两端色 [源色, 目标色]（官方 linkColor=gradient） */
  c?: [string, string];
  /** SankeyFlow: 渐变 user-space 起止 x（官方 gradientUnits=userSpaceOnUse x1/x2） */
  gx1?: number;
  gx2?: number;
  /** SankeyLabel: 标签在节点条的哪一侧（官方半幅规则：左半→右，右半→左） */
  side?: 'left' | 'right';
}

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

// ===================== d3-sankey 0.12.3 移植 =====================

interface D3Link {
  index: number;
  value: number;
  source: D3Node;
  target: D3Node;
  width: number;
  y0: number;
  y1: number;
}
interface D3Node {
  index: number;
  id: string;
  value: number;
  depth: number;
  height: number;
  layer: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  sourceLinks: D3Link[];
  targetLinks: D3Link[];
}

/** 布局结果：节点框 + 每条连线（按 ast.links 序）的中心线两端/宽度 */
interface SankeyLayout {
  boxes: Map<string, { x: number; y: number; h: number }>;
  paths: Array<{ x1: number; yc1: number; x2: number; yc2: number; w: number } | null>;
}

function ascendingBreadth(a: { y0: number }, b: { y0: number }): number {
  return a.y0 - b.y0;
}
function ascendingSourceBreadth(a: D3Link, b: D3Link): number {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}
function ascendingTargetBreadth(a: D3Link, b: D3Link): number {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

function reorderLinks(nodes: D3Node[]): void {
  for (const { sourceLinks, targetLinks } of nodes) {
    sourceLinks.sort(ascendingTargetBreadth);
    targetLinks.sort(ascendingSourceBreadth);
  }
}

function reorderNodeLinks({ sourceLinks, targetLinks }: D3Node): void {
  for (const { source } of targetLinks) source.sourceLinks.sort(ascendingTargetBreadth);
  for (const { target } of sourceLinks) target.targetLinks.sort(ascendingSourceBreadth);
}

/** 理想情况下 source→target 的目标顶端 y（d3 targetTop） */
function targetTop(source: D3Node, target: D3Node, py: number): number {
  let y = source.y0 - (source.sourceLinks.length - 1) * py / 2;
  for (const { target: node, width } of source.sourceLinks) {
    if (node === target) break;
    y += width + py;
  }
  for (const { source: node, width } of target.targetLinks) {
    if (node === source) break;
    y -= width;
  }
  return y;
}

/** 理想情况下 source→target 的源顶端 y（d3 sourceTop） */
function sourceTop(source: D3Node, target: D3Node, py: number): number {
  let y = target.y0 - (target.targetLinks.length - 1) * py / 2;
  for (const { source: node, width } of target.targetLinks) {
    if (node === source) break;
    y += width + py;
  }
  for (const { target: node, width } of source.sourceLinks) {
    if (node === target) break;
    y -= width;
  }
  return y;
}

function resolveCollisionsTopToBottom(nodes: D3Node[], y: number, i: number, alpha: number, py: number): void {
  for (; i < nodes.length; ++i) {
    const node = nodes[i];
    const dy = (y - node.y0) * alpha;
    if (dy > 1e-6) { node.y0 += dy; node.y1 += dy; }
    y = node.y1 + py;
  }
}

function resolveCollisionsBottomToTop(nodes: D3Node[], y: number, i: number, alpha: number, py: number): void {
  for (; i >= 0; --i) {
    const node = nodes[i];
    const dy = (node.y1 - y) * alpha;
    if (dy > 1e-6) { node.y0 -= dy; node.y1 -= dy; }
    y = node.y0 - py;
  }
}

function resolveCollisions(nodes: D3Node[], alpha: number, py: number): void {
  const i = nodes.length >> 1;
  const subject = nodes[i];
  resolveCollisionsBottomToTop(nodes, subject.y0 - py, i - 1, alpha, py);
  resolveCollisionsTopToBottom(nodes, subject.y1 + py, i + 1, alpha, py);
  resolveCollisionsBottomToTop(nodes, SANKEY_H, nodes.length - 1, alpha, py);
  resolveCollisionsTopToBottom(nodes, 0, 0, alpha, py);
}

/** d3 忠实移植（与官方坐标对齐）；有环/异常时抛错 → 上层回退 legacy */
function d3Layout(ast: SankeyAST): SankeyLayout {
  // --- computeNodeLinks ---
  const nodes: D3Node[] = [];
  const nodeById = new Map<string, D3Node>();
  const addNode = (id: string): D3Node => {
    let n = nodeById.get(id);
    if (!n) {
      n = { index: nodes.length, id, value: 0, depth: 0, height: 0, layer: 0,
            x0: 0, x1: 0, y0: 0, y1: 0, sourceLinks: [], targetLinks: [] };
      nodes.push(n);
      nodeById.set(id, n);
    }
    return n;
  };
  for (const nd of ast.nodes) addNode(nd.id);
  const links: D3Link[] = [];
  ast.links.forEach((l, i) => {
    const s = addNode(l.source);
    const t = addNode(l.target);
    const link: D3Link = { index: i, value: l.value, source: s, target: t, width: 0, y0: 0, y1: 0 };
    links.push(link);
    s.sourceLinks.push(link);
    t.targetLinks.push(link);
  });

  // --- computeNodeValues：value = max(入和, 出和) ---
  for (const n of nodes) {
    let out = 0, inc = 0;
    for (const l of n.sourceLinks) out += l.value;
    for (const l of n.targetLinks) inc += l.value;
    n.value = Math.max(out, inc);
  }

  // --- computeNodeDepths（正向 BFS；最后一波仍在的节点深度生效；有环抛错） ---
  {
    const n = nodes.length;
    let current = new Set(nodes);
    let next = new Set<D3Node>();
    let x = 0;
    while (current.size) {
      for (const node of current) {
        node.depth = x;
        for (const l of node.sourceLinks) next.add(l.target);
      }
      if (++x > n) throw new Error('circular link');
      current = next;
      next = new Set<D3Node>();
    }
  }
  // --- computeNodeHeights（反向 BFS） ---
  {
    const n = nodes.length;
    let current = new Set(nodes);
    let next = new Set<D3Node>();
    let x = 0;
    while (current.size) {
      for (const node of current) {
        node.height = x;
        for (const l of node.targetLinks) next.add(l.source);
      }
      if (++x > n) throw new Error('circular link');
      current = next;
      next = new Set<D3Node>();
    }
  }

  // --- computeNodeLayers（justify：源留 depth、汇去最右列） ---
  const xd = Math.max(...nodes.map(d => d.depth)) + 1;
  const kx = xd > 1 ? (SANKEY_W - NODE_W) / (xd - 1) : 0;
  const columns: D3Node[][] = new Array(xd);
  for (const node of nodes) {
    const layer = node.sourceLinks.length ? node.depth : xd - 1;
    node.layer = Math.max(0, Math.min(xd - 1, Math.floor(layer)));
    node.x0 = node.layer * kx;
    node.x1 = node.x0 + NODE_W;
    (columns[node.layer] = columns[node.layer] || []).push(node);
  }

  // --- py：节点间隙（官方 py = min(nodePadding, H/(最大列长-1))） ---
  const maxLen = Math.max(...columns.map(c => c.length));
  const py = Math.min(NODE_PADDING, SANKEY_H / Math.max(1, maxLen - 1));

  // --- initializeNodeBreadths ---
  let ky = Infinity;
  for (const c of columns) {
    const sum = c.reduce((s, d) => s + d.value, 0);
    if (sum > 0) ky = Math.min(ky, (SANKEY_H - (c.length - 1) * py) / sum);
  }
  if (!Number.isFinite(ky) || ky <= 0) ky = 0;
  for (const col of columns) {
    let y = 0;
    for (const node of col) {
      node.y0 = y;
      node.y1 = y + node.value * ky;
      y = node.y1 + py;
      for (const link of node.sourceLinks) link.width = link.value * ky;
    }
    const extra = (SANKEY_H - y + py) / (col.length + 1);
    for (let i = 0; i < col.length; ++i) {
      col[i].y0 += extra * (i + 1);
      col[i].y1 += extra * (i + 1);
    }
    reorderLinks(col);
  }

  // --- 6 轮松弛 ---
  const relaxLeftToRight = (alpha: number, beta: number): void => {
    for (let i = 1; i < columns.length; ++i) {
      const column = columns[i];
      for (const target of column) {
        let y = 0, w = 0;
        for (const { source, value } of target.targetLinks) {
          const v = value * (target.layer - source.layer);
          y += targetTop(source, target, py) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        const dy = (y / w - target.y0) * alpha;
        target.y0 += dy;
        target.y1 += dy;
        reorderNodeLinks(target);
      }
      column.sort(ascendingBreadth);
      resolveCollisions(column, beta, py);
    }
  };
  const relaxRightToLeft = (alpha: number, beta: number): void => {
    for (let i = columns.length - 2; i >= 0; --i) {
      const column = columns[i];
      for (const source of column) {
        let y = 0, w = 0;
        for (const { target, value } of source.sourceLinks) {
          const v = value * (target.layer - source.layer);
          y += sourceTop(source, target, py) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        const dy = (y / w - source.y0) * alpha;
        source.y0 += dy;
        source.y1 += dy;
        reorderNodeLinks(source);
      }
      column.sort(ascendingBreadth);
      resolveCollisions(column, beta, py);
    }
  };
  for (let i = 0; i < ITERATIONS; ++i) {
    const alpha = Math.pow(0.99, i);
    const beta = Math.max(1 - alpha, (i + 1) / ITERATIONS);
    relaxRightToLeft(alpha, beta);
    relaxLeftToRight(alpha, beta);
  }

  // --- computeLinkBreadths：中心线从节点 y0 起累计 ---
  for (const node of nodes) {
    let y = node.y0;
    for (const link of node.sourceLinks) {
      link.y0 = y + link.width / 2;
      y += link.width;
    }
    y = node.y0;
    for (const link of node.targetLinks) {
      link.y1 = y + link.width / 2;
      y += link.width;
    }
  }

  const boxes = new Map<string, { x: number; y: number; h: number }>();
  for (const n of nodes) boxes.set(n.id, { x: n.x0, y: n.y0, h: n.y1 - n.y0 });
  const paths = links.map(l => ({
    x1: l.source.x1, yc1: l.y0, x2: l.target.x0, yc2: l.y1, w: l.width,
  }));
  return { boxes, paths };
}

// ===================== legacy 回退（有环图时使用） =====================

/** 旧分层算法：迭代 layer（有环容错）+ 每层垂直居中 + 按 link 序累计偏移 */
function legacyLayout(ast: SankeyAST): SankeyLayout {
  const GAP = 12;
  const layer = new Map<string, number>();
  for (const n of ast.nodes) layer.set(n.id, 0);
  const rounds = Math.max(1, ast.nodes.length);
  for (let r = 0; r < rounds; r++) {
    let changed = false;
    for (const l of ast.links) {
      const ls = layer.get(l.source) ?? 0;
      const lt = layer.get(l.target) ?? 0;
      if (lt < ls + 1) { layer.set(l.target, ls + 1); changed = true; }
    }
    if (!changed) break;
  }

  const outSum = new Map<string, number>();
  const inSum = new Map<string, number>();
  for (const n of ast.nodes) { outSum.set(n.id, 0); inSum.set(n.id, 0); }
  for (const l of ast.links) {
    outSum.set(l.source, (outSum.get(l.source) ?? 0) + l.value);
    inSum.set(l.target, (inSum.get(l.target) ?? 0) + l.value);
  }
  const raw = new Map<string, number>();
  for (const n of ast.nodes) {
    raw.set(n.id, Math.max(outSum.get(n.id) ?? 0, inSum.get(n.id) ?? 0));
  }

  const maxLayer = Math.max(0, ...ast.nodes.map(n => layer.get(n.id) ?? 0));
  const byLayer: string[][] = Array.from({ length: maxLayer + 1 }, () => []);
  for (const n of ast.nodes) byLayer[layer.get(n.id) ?? 0].push(n.id);

  const plotW = SANKEY_W - NODE_W;
  const plotH = SANKEY_H;
  const layerX = (l: number): number =>
    maxLayer === 0 ? plotW / 2 : (l * plotW) / maxLayer;
  let scale = Infinity;
  for (const ids of byLayer) {
    const sum = ids.reduce((s, id) => s + (raw.get(id) ?? 0), 0);
    if (sum <= 0) continue;
    const avail = plotH - GAP * Math.max(0, ids.length - 1);
    scale = Math.min(scale, avail / sum);
  }
  if (!Number.isFinite(scale) || scale <= 0) scale = 1;

  const boxes = new Map<string, { x: number; y: number; h: number }>();
  for (const ids of byLayer) {
    const layerH = ids.reduce((s, id) => s + Math.max(MIN_H, (raw.get(id) ?? 0) * scale), 0)
      + GAP * Math.max(0, ids.length - 1);
    let cursor = Math.max(0, (plotH - layerH) / 2);
    for (const id of ids) {
      const h = Math.max(MIN_H, (raw.get(id) ?? 0) * scale);
      boxes.set(id, { x: layerX(layer.get(id) ?? 0), y: cursor, h });
      cursor += h + GAP;
    }
  }

  const offS = new Map<string, number>();
  const offT = new Map<string, number>();
  const paths = ast.links.map(l => {
    const sp = boxes.get(l.source);
    const tp = boxes.get(l.target);
    if (!sp || !tp) return null;
    const h = Math.max(0.5, l.value * scale);
    const os = offS.get(l.source) ?? 0;
    const ot = offT.get(l.target) ?? 0;
    const x1 = sp.x + NODE_W;
    const x2 = tp.x;
    offS.set(l.source, os + h);
    offT.set(l.target, ot + h);
    return { x1, yc1: sp.y + os + h / 2, x2, yc2: tp.y + ot + h / 2, w: h };
  });
  return { boxes, paths };
}

// ===================== 主入口 =====================

/** 主入口 */
export function mapSankey(
  ast: SankeyAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedSankeyNode[] } {
  void theme;
  const nodes: MappedSankeyNode[] = [];
  if (ast.nodes.length === 0) return { nodes };

  // 节点全集：ast.nodes + 仅在连线里出现的 id（防缺条）
  const nodeDefs = [...ast.nodes];
  const known = new Set(nodeDefs.map(n => n.id));
  for (const l of ast.links) {
    for (const id of [l.source, l.target]) {
      if (!known.has(id)) { known.add(id); nodeDefs.push({ id }); }
    }
  }

  // 布局：优先 d3 精确移植；有环等异常回退 legacy
  let layout: SankeyLayout;
  try {
    layout = d3Layout(ast);
  } catch {
    layout = legacyLayout(ast);
  }

  // 节点值（标签用）：max(入和, 出和)
  const outSum = new Map<string, number>();
  const inSum = new Map<string, number>();
  for (const n of nodeDefs) { outSum.set(n.id, 0); inSum.set(n.id, 0); }
  for (const l of ast.links) {
    outSum.set(l.source, (outSum.get(l.source) ?? 0) + l.value);
    inSum.set(l.target, (inSum.get(l.target) ?? 0) + l.value);
  }
  const valueOf = (id: string): number =>
    Math.max(outSum.get(id) ?? 0, inSum.get(id) ?? 0);

  // 条色按节点顺序轮换 d3 category10（官方 getNodeColor 默认同此）
  const colorOf = new Map<string, string>();
  nodeDefs.forEach((n, i) => colorOf.set(n.id, D3_PALETTE[i % D3_PALETTE.length]));

  // 流量带先输出（nodeDataArray 靠后 = 靠上绘制）：我们无 multiply 混合，
  // 标签必须压在带之上才与官方（multiply 下深色文字保持深色）视觉等价。
  // 带 = 闭合丝带轮廓（官方等价物：stroke-width=w 的中心线描边）。
  // GoJS 对描边几何整体内缩 sw/2 绘制（官方 makeSVG 实测 path transform=
  // position+sw/2），粗描边（w≈179）会偏移近 90px 与竖条脱节；sw=0 的填充
  // 轮廓无内缩，几何坐标即绘制坐标 → 与官方 mermaid SVG 逐像素对齐。
  // 几何局部化（min 角在 0,0，cynefin 同款策略）+ loc=文档原点，保证
  // documentBounds 紧贴墨迹、zoomToFit 缩放正确。
  ast.links.forEach((l, i) => {
    const path = layout.paths[i];
    if (!path) return;
    const mx = (path.x1 + path.x2) / 2;
    const h = path.w / 2;
    const yT1 = path.yc1 - h, yT2 = path.yc2 - h;  // 上缘两端
    const yB1 = path.yc1 + h, yB2 = path.yc2 + h;  // 下缘两端
    const top = Math.min(yT1, yT2);                // 贝塞尔在控制点凸包内 → 顶=top
    const x0 = r2(path.x1);
    const xl = r2(path.x2 - path.x1);              // 本地宽（x1 → 0、x2 → xl）
    const mxl = r2(mx - path.x1);
    const geom =
      `M 0 ${r2(yT1 - top)} ` +
      `C ${mxl} ${r2(yT1 - top)} ${mxl} ${r2(yT2 - top)} ${xl} ${r2(yT2 - top)} ` +
      `L ${xl} ${r2(yB2 - top)} ` +
      `C ${mxl} ${r2(yB2 - top)} ${mxl} ${r2(yB1 - top)} 0 ${r2(yB1 - top)} Z`;
    nodes.push({
      key: `__flow_${i}`, category: 'SankeyFlow',
      loc: `${x0} ${r2(top)}`,
      geom,
      w: r2(path.w),
      c: [colorOf.get(l.source) ?? '#888888', colorOf.get(l.target) ?? '#888888'],
      gx1: r2(path.x1),
      gx2: r2(path.x2),
    });
  });

  // 节点竖条 + 标签（官方半幅规则贴条边）
  for (const n of nodeDefs) {
    const p = layout.boxes.get(n.id);
    if (!p) continue;
    nodes.push({
      key: n.id, category: 'SankeyNode',
      loc: `${r2(p.x)} ${r2(p.y)}`,
      w: NODE_W, h: r2(p.h),
      fill: colorOf.get(n.id),
    });
    const side: 'left' | 'right' = p.x < SANKEY_W / 2 ? 'right' : 'left';
    const lx = side === 'right' ? p.x + NODE_W + 6 : p.x - 6;
    const value = Math.round(valueOf(n.id) * 100) / 100;
    // 官方 <text> 内换行折叠为空格 → 单行 "A 15"
    const text = `${n.label ?? n.id} ${value}`;
    nodes.push({
      key: `__lbl_${n.id}`, category: 'SankeyLabel',
      text,
      // 官方 <text y=中心> 是基线锚点；渲染端 TextBlock 盒中心对齐 loc，
      // 16px 单行下基线 ≈ 盒中心 + 4.8（实测 ink 对齐官方）→ loc 上移补偿
      loc: `${r2(lx)} ${r2(p.y + p.h / 2 - BASELINE_OFF)}`,
      side,
    });
  }

  return { nodes };
}
