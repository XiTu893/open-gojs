/**
 * wardley AST → GoJS 模型数据映射。
 *
 * 布局（全部坐标在此算好，size 缺省 [1100,600]）：
 *  - x = evolution（0左~1右）、y = visibility 反转（1-vis，上为高可见性）
 *  - 画布：演化 4 段竖向分区（genesis/custom/product/utility 各 1/4，浅灰交替底+竖分隔线+底部区段标签）
 *    + 外框 + 轴刻度（visibility 左轴、evolution 底轴）
 *  - 组件 = 小圆点（anchor 加粗标签）+ 名称标签；decorator 符号：
 *    build=Triangle、buy=Diamond、outsource=Rectangle、market=Ellipse、inertia=名称 `~` 前缀
 *  - links = 连线数据（flow 带箭头、依赖无箭头，渲染层装配）
 *  - evolve = 组件 → 目标 x 的水平虚线（dash 连线 + 目标点，同组件行）
 *  - notes = 浅底文本框（中心对齐到 [vis,evo] 点）
 */
import { WardleyAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const PAD_L = 70;
const PAD_R = 36;
const PAD_T = 48;
const PAD_B = 56;
const DOT = 12;

/** 映射后的节点类别 */
export type WardleyNodeCategory =
  | 'WardleyTitle' | 'WardleyFrame' | 'WardleyBand' | 'WardleyDivider'
  | 'WardleySection' | 'WardleyAxis' | 'WardleyPoint' | 'WardleyLabel'
  | 'WardleyDecorator' | 'WardleyNote';

/** 映射后的节点数据 */
export interface MappedWardleyNode {
  key: string;
  category: WardleyNodeCategory;
  loc: string;
  text?: string;
  fill?: string;
  stroke?: string;
  /** Shape.figure（decorator 用） */
  figure?: string;
  w?: number;
  h?: number;
  bold?: boolean;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
}

/** 映射后的连线数据 */
export interface MappedWardleyLink {
  from: string;
  to: string;
  flow: boolean;
  label?: string;
  dashed?: boolean;
  /** 端口侧简写 T/B/L/R（避开右侧标签区） */
  fromSpot?: string;
  toSpot?: string;
}

function r1(v: number): number {
  return Math.round(v * 10) / 10;
}

/** 演化分区名（按 x 段序） */
const SECTIONS = ['genesis', 'custom-built', 'product', 'utility'];

/** 主入口 */
export function mapWardley(
  ast: WardleyAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedWardleyNode[]; links: MappedWardleyLink[] } {
  const nodes: MappedWardleyNode[] = [];
  const links: MappedWardleyLink[] = [];

  const [W, H] = ast.size ?? [1100, 600];
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const X = (evo: number): number => PAD_L + evo * plotW;
  const Y = (vis: number): number => PAD_T + (1 - vis) * plotH;

  // 标题
  if (ast.title) {
    nodes.push({
      key: '__title', category: 'WardleyTitle',
      text: ast.title, bold: true, loc: `${r1(W / 2)} 20`,
    });
  }

  // 4 段交替浅灰底 + 竖分隔线 + 底部区段标签
  for (let i = 0; i < 4; i++) {
    const x0 = X(i / 4);
    const segW = plotW / 4;
    if (i % 2 === 1) {
      nodes.push({
        key: `__band_${i}`, category: 'WardleyBand',
        loc: `${r1(x0)} ${PAD_T}`, w: r1(segW), h: r1(plotH),
        fill: 'rgba(0,0,0,0.04)',
      });
    }
    nodes.push({
      key: `__sec_${i}`, category: 'WardleySection',
      text: SECTIONS[i],
      loc: `${r1(x0 + segW / 2)} ${r1(H - PAD_B + 18)}`,
      align: 'center',
    });
  }
  for (let i = 1; i < 4; i++) {
    nodes.push({
      key: `__div_${i}`, category: 'WardleyDivider',
      loc: `${r1(X(i / 4))} ${PAD_T}`, w: 1, h: r1(plotH),
      fill: theme.edge.dashed,
    });
  }

  // 外框
  nodes.push({
    key: '__frame', category: 'WardleyFrame',
    loc: `${PAD_L} ${PAD_T}`, w: r1(plotW), h: r1(plotH),
    fill: 'transparent', stroke: '#000000',
  });

  // 轴刻度：visibility 左轴 0/0.5/1，evolution 底轴 0/0.5/1
  for (const v of [0, 0.5, 1]) {
    nodes.push({
      key: `__vy_${v}`, category: 'WardleyAxis',
      text: String(v), align: 'right',
      loc: `${PAD_L - 12} ${r1(Y(v))}`,
    });
    nodes.push({
      key: `__vx_${v}`, category: 'WardleyAxis',
      text: String(v), align: 'center',
      loc: `${r1(X(v))} ${r1(H - PAD_B + 2)}`,
    });
  }
  nodes.push({
    key: '__axvis', category: 'WardleyAxis', text: 'visibility', align: 'right',
    loc: `${PAD_L - 12} ${PAD_T - 14}`,
  });
  nodes.push({
    key: '__axevo', category: 'WardleyAxis', text: 'evolution', align: 'right',
    loc: `${r1(W - PAD_R)} ${r1(H - PAD_B + 34)}`,
  });

  // 组件点 + 标签 + decorator 符号
  const pointFill = theme.series[2];
  const DECOR_FIGURE: Record<string, string> = {
    build: 'Triangle', buy: 'Diamond', outsource: 'Rectangle', market: 'Ellipse',
  };
  const pointPos = new Map<string, { x: number; y: number }>();
  for (const c of ast.components) {
    const x = X(c.evo);
    const y = Y(c.vis);
    pointPos.set(c.name, { x, y });
    nodes.push({
      key: c.name, category: 'WardleyPoint',
      loc: `${r1(x - DOT / 2)} ${r1(y - DOT / 2)}`, w: DOT, h: DOT,
      fill: pointFill, stroke: '#000000',
    });
    // inertia：名称加 ~ 前缀（文本表示）
    const text = c.decorator === 'inertia' ? `~${c.name}` : c.name;
    nodes.push({
      key: `__lbl_${c.name}`, category: 'WardleyLabel',
      // 标签略上移，避免水平连线（如 evolve 虚线）从文字中线穿过
      text, loc: `${r1(x + DOT / 2 + 16)} ${r1(y - 11)}`,
    });
    if (c.decorator && DECOR_FIGURE[c.decorator]) {
      nodes.push({
        key: `__dec_${c.name}`, category: 'WardleyDecorator',
        figure: DECOR_FIGURE[c.decorator],
        loc: `${r1(x - 5)} ${r1(y + 14)}`, w: 10, h: 10,
        fill: '#ffffff', stroke: '#000000',
      });
    }
  }

  // anchor（粗体标签，稍大点）
  for (const a of ast.anchors) {
    const x = X(a.evo);
    const y = Y(a.vis);
    pointPos.set(a.name, { x, y });
    nodes.push({
      key: a.name, category: 'WardleyPoint',
      loc: `${r1(x - 7)} ${r1(y - 7)}`, w: 14, h: 14,
      fill: theme.series[0], stroke: '#000000',
    });
    nodes.push({
      key: `__lbl_${a.name}`, category: 'WardleyLabel',
      text: a.name, bold: true, loc: `${r1(x + 7 + 6)} ${r1(y - 11)}`,
    });
  }

  // links（端点必须存在，否则忽略）；端口侧按相对方位选择，且绕开点右侧的标签区。
  // 返回 fromSpot/toSpot 简写（T/B/L/R），由渲染层转 Spot。
  const spotsOf = (a: { x: number; y: number } | undefined, b: { x: number; y: number } | undefined) => {
    if (!a || !b) return { fs: 'B', ts: 'T' };
    const dx = b.x - a.x, dy = b.y - a.y;
    let fs: string, ts: string;
    if (Math.abs(dy) >= Math.abs(dx)) {
      fs = dy >= 0 ? 'B' : 'T';
      ts = dy >= 0 ? 'T' : 'B';
    } else {
      fs = dx >= 0 ? 'R' : 'L';
      ts = dx >= 0 ? 'L' : 'R';
    }
    // 组件标签在点右侧 → 右侧出入会穿过标签，改走上下
    if (fs === 'R') fs = dy >= 0 ? 'B' : 'T';
    if (ts === 'R') ts = dy >= 0 ? 'T' : 'B';
    return { fs, ts };
  };
  for (const l of ast.links) {
    if (!pointPos.has(l.from) || !pointPos.has(l.to)) continue;
    const sp = spotsOf(pointPos.get(l.from), pointPos.get(l.to));
    const base = { from: l.from, to: l.to, flow: l.flow, fromSpot: sp.fs, toSpot: sp.ts };
    links.push(l.label ? { ...base, label: l.label } : base);
  }

  // evolve：目标点 + 水平虚线（同组件行，dash 由连线数据驱动）
  for (const ev of ast.evolves) {
    const p = pointPos.get(ev.name);
    if (!p) continue;
    const tx = X(ev.target);
    const key = `__ev_${ev.name}`;
    nodes.push({
      key, category: 'WardleyPoint',
      loc: `${r1(tx - 5)} ${r1(p.y - 5)}`, w: 10, h: 10,
      fill: '#ffffff', stroke: theme.edge.dashed,
    });
    links.push({ from: ev.name, to: key, flow: true, dashed: true });
  }

  // notes：浅底文本框（中心对齐到点）；与组件点重合时上移，避免压住组件标签
  const placed = [...pointPos.values()];
  for (let i = 0; i < ast.notes.length; i++) {
    const n = ast.notes[i];
    let nx = X(n.evo);
    let ny = Y(n.vis);
    const collide = placed.some(p => Math.abs(p.x - nx) < 8 && Math.abs(p.y - ny) < 8);
    if (collide) ny += 46; // 下移到点下方空白（上方常有连线经过）
    nodes.push({
      key: `__note_${i}`, category: 'WardleyNote',
      text: n.text,
      loc: `${r1(nx)} ${r1(ny)}`,
    });
  }

  return { nodes, links };
}
