/**
 * sankey AST → GoJS 模型数据映射。
 *
 * 分层布局（全部坐标在此算好）：
 *  - 层号：无入度=源层(0)；迭代 layer[t] = max(layer[s]+1)（有环容错，迭代 ≤ 节点数次）
 *  - 节点高度 = 该节点总流量的归一化高度（源=出流量和、汇=入流量和、中间=较大者）；
 *    全局缩放系数取各层最紧约束，所有节点高度和 ≈ 画布可用高（留层内间隙）
 *  - 同层节点 y 自上而下均分；x = 层号 × 层距
 *  - 流量带 = 每条 link 一个 geometryString 填充 Shape 节点（三次贝塞尔带状区域），
 *    源/目标端 y 偏移按带的顺序累计分配，避免叠压
 *  - 节点 = 竖条 Rectangle；配色只取 theme.series 轮换 + 半透明
 */
import { SankeyAST } from '../parser/sankey';
import { MermaidTheme, defaultTheme } from '../themes';

/** 画布尺寸（导出供测试使用） */
export const SANKEY_W = 960;
export const SANKEY_H = 600;

const NODE_W = 14;        // 节点竖条宽
const PAD_L = 60;
const PAD_R = 150;        // 右侧留标签
const PAD_T = 30;
const PAD_B = 30;
const GAP = 16;           // 同层节点间隙
const MIN_H = 2;          // 最小节点高度

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
  /** SankeyFlow: geometryString（绝对坐标，loc 固定 0 0） */
  geom?: string;
}

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** hex → rgba 半透明 */
function withAlpha(color: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec((color || '').trim());
  if (m) {
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${alpha})`;
  }
  return `rgba(0,0,0,${alpha})`;
}

/** 计算各节点层号（迭代法，有环容错） */
function assignLayers(ast: SankeyAST): Map<string, number> {
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
  return layer;
}

/** 主入口 */
export function mapSankey(
  ast: SankeyAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedSankeyNode[] } {
  const nodes: MappedSankeyNode[] = [];
  if (ast.nodes.length === 0) return { nodes };

  const layer = assignLayers(ast);

  // 原始流量权重：源=出流量和、汇=入流量和、中间=较大者
  const outSum = new Map<string, number>();
  const inSum = new Map<string, number>();
  for (const n of ast.nodes) { outSum.set(n.id, 0); inSum.set(n.id, 0); }
  for (const l of ast.links) {
    outSum.set(l.source, (outSum.get(l.source) ?? 0) + l.value);
    inSum.set(l.target, (inSum.get(l.target) ?? 0) + l.value);
  }
  const raw = new Map<string, number>();
  for (const n of ast.nodes) {
    const o = outSum.get(n.id) ?? 0;
    const i = inSum.get(n.id) ?? 0;
    raw.set(n.id, Math.max(o, i));
  }

  // 按层分组（保持首次出现序）
  const maxLayer = Math.max(0, ...ast.nodes.map(n => layer.get(n.id) ?? 0));
  const byLayer: string[][] = Array.from({ length: maxLayer + 1 }, () => []);
  for (const n of ast.nodes) byLayer[layer.get(n.id) ?? 0].push(n.id);

  // 全局缩放：取各层最紧约束
  const plotW = SANKEY_W - PAD_L - PAD_R - NODE_W;
  const plotH = SANKEY_H - PAD_T - PAD_B;
  const layerX = (l: number): number =>
    PAD_L + (maxLayer === 0 ? plotW / 2 : (l * plotW) / maxLayer);
  let scale = Infinity;
  for (const ids of byLayer) {
    const sum = ids.reduce((s, id) => s + (raw.get(id) ?? 0), 0);
    if (sum <= 0) continue;
    const avail = plotH - GAP * Math.max(0, ids.length - 1);
    scale = Math.min(scale, avail / sum);
  }
  if (!Number.isFinite(scale) || scale <= 0) scale = 1;

  // 每层 y 均分
  const pos = new Map<string, { x: number; y: number; h: number }>();
  for (const ids of byLayer) {
    let cursor = PAD_T;
    for (const id of ids) {
      const h = Math.max(MIN_H, (raw.get(id) ?? 0) * scale);
      pos.set(id, { x: layerX(layer.get(id) ?? 0), y: cursor, h });
      cursor += h + GAP;
    }
  }

  // 节点竖条 + 标签
  for (const n of ast.nodes) {
    const p = pos.get(n.id)!;
    nodes.push({
      key: n.id, category: 'SankeyNode',
      loc: `${r2(p.x)} ${r2(p.y)}`,
      w: NODE_W, h: r2(p.h),
      fill: theme.series[0],
    });
    nodes.push({
      key: `__lbl_${n.id}`, category: 'SankeyLabel',
      text: n.label ?? n.id,
      loc: `${r2(p.x + NODE_W + 6)} ${r2(p.y + p.h / 2 - 7)}`,
    });
  }

  // 流量带：geometryString（绝对坐标，loc 固定 0 0），端点偏移按顺序累计
  const offS = new Map<string, number>();
  const offT = new Map<string, number>();
  ast.links.forEach((l, i) => {
    const sp = pos.get(l.source);
    const tp = pos.get(l.target);
    if (!sp || !tp) return;
    const h = Math.max(0.5, l.value * scale);
    const os = offS.get(l.source) ?? 0;
    const ot = offT.get(l.target) ?? 0;
    const x1 = sp.x + NODE_W;
    const y1 = sp.y + os;
    const x2 = tp.x;
    const y2 = tp.y + ot;
    const mx = (x1 + x2) / 2;
    offS.set(l.source, os + h);
    offT.set(l.target, ot + h);
    const geom =
      `M ${r2(x1)} ${r2(y1)} ` +
      `C ${r2(mx)} ${r2(y1)} ${r2(mx)} ${r2(y2)} ${r2(x2)} ${r2(y2)} ` +
      `L ${r2(x2)} ${r2(y2 + h)} ` +
      `C ${r2(mx)} ${r2(y2 + h)} ${r2(mx)} ${r2(y1 + h)} ${r2(x1)} ${r2(y1 + h)} Z`;
    nodes.push({
      key: `__flow_${i}`, category: 'SankeyFlow',
      loc: '0 0',
      geom,
      fill: withAlpha(theme.series[i % theme.series.length], 0.35),
    });
  });

  return { nodes };
}
