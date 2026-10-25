/**
 * cynefin AST → GoJS 模型数据映射 —— 忠实移植官方 mermaid@11 cynefin 渲染器。
 *
 * 官方几何（config 默认 width 800 / height 600 / padding 40 / boundaryAmplitude 8）：
 *  - 内容画布 800×600 整体平移 (40,40)；四域各 400×300 浅色底（fill-opacity .4）
 *  - 边界 = 7 段确定性伪随机波浪线（mulberry32 种子噪声；官方种子取 svg.id 哈希，
 *    每次渲染随机 → 此处固定 seed 0，风格一致即可）：竖向 x≈400±8、横向 y≈300±8，
 *    stroke #333 宽 2 dasharray 6 3
 *  - cliff（clear 域悬崖曲线）stroke #8B0000 宽 4
 *  - confusion = 中心椭圆 rx120 ry90（p*.15/m*.15），fill #F3E5F5 op .5，虚线描边
 *  - 域标签粗体 16 #131300 于 (cx, cy-30)；固定响应模式斜体 11 于 cy-10 / cy+5
 *    （showDomainDescriptions 默认开，与 DSL 无关）；Confusion (400,290)、Disorder (400,308)
 *  - items：高 26、间距 4、文字估宽+20、rx4、stroke #333 宽 1、fill 域色 op .95，
 *    起始 cy+25（confusion cy+22，最多 3 个 + "+N more" 虚线溢出条）
 *  - transitions = 域中心到域中心的箭头（此处直线 + Standard 箭头，标签居中）
 *  - 标题粗体 18 于 (400,-20)
 */
import { CynefinAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

/** 内容画布（导出供测试） */
export const CYNEFIN_W = 800;
export const CYNEFIN_H = 600;
/** 四周留白（官方 padding） */
export const CYNEFIN_PAD = 40;

// 官方 themeVariables.cynefin 默认色板
const COMPLEX_BG = '#E8F5E9';
const COMPLICATED_BG = '#E3F2FD';
const CHAOTIC_BG = '#FBE9E7';
const CLEAR_BG = '#FFF8E1';
const CONFUSION_BG = '#F3E5F5';
const BOUNDARY_COLOR = '#333333';
const CLIFF_COLOR = '#8B0000';

const ITEM_H = 26;
const ITEM_GAP = 4;
const ITEM_PAD = 10;
const CONFUSION_MAX_ITEMS = 3;

const DOMAIN_ORDER = ['complex', 'complicated', 'chaotic', 'clear'] as const;
const BG: Record<string, string> = {
  complex: COMPLEX_BG, complicated: COMPLICATED_BG,
  chaotic: CHAOTIC_BG, clear: CLEAR_BG,
};

/** 官方固定响应模式（showDomainDescriptions 默认开） */
const DESCRIPTIONS: Record<string, { model: string; practice: string }> = {
  complex: { model: 'Probe → Sense → Respond', practice: 'Emergent Practices' },
  complicated: { model: 'Sense → Analyse → Respond', practice: 'Good Practices' },
  chaotic: { model: 'Act → Sense → Respond', practice: 'Novel Practices' },
  clear: { model: 'Sense → Categorise → Respond', practice: 'Best Practices' },
};

/** 映射后的节点类别 */
export type CynefinNodeCategory =
  | 'CynefinTitle' | 'CynefinBg' | 'CynefinBoundary' | 'CynefinCliff'
  | 'CynefinConfusion' | 'CynefinLabel' | 'CynefinSubtitle'
  | 'CynefinItem' | 'CynefinItemOverflow';

/** 映射后的节点数据 */
export interface MappedCynefinNode {
  key: string;
  category: CynefinNodeCategory;
  loc: string;
  text?: string;
  /** 纯色或 rgba（已含官方 fill-opacity） */
  fill?: string;
  /** 描边色（固定在模板时留空） */
  stroke?: string;
  w?: number;
  h?: number;
  /** Boundary/Cliff：geometryString（内容坐标，节点 loc 平移至 PAD） */
  geom?: string;
}

/** 映射后的连线数据 */
export interface MappedCynefinLink {
  from: string;
  to: string;
  label?: string;
}

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** hex → rgba（官方 fill-opacity 合并进颜色，避免模板再算） */
function rgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/** 官方 mulberry32 单步噪声（seededRandom） */
function seeded(e: number): number {
  let t = e + 1831565813 | 0;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

/** 竖向波浪分界线（官方 generateFoldPath：x = 宽/2 ± 振幅噪声，7 段） */
function foldPath(seed: number, amp: number): string {
  const halfW = CYNEFIN_W / 2;
  const segs = 7;
  const segH = CYNEFIN_H / segs;
  const pts: { x: number; y: number }[] = [];
  for (let d = 0; d <= segs; d++) {
    pts.push({ x: halfW + seeded(seed + d * 17) * amp * 2 - amp, y: d * segH });
  }
  let p = `M${r2(pts[0].x)},${r2(pts[0].y)}`;
  for (let d = 0; d < pts.length - 1; d++) {
    const a = pts[d], b = pts[d + 1];
    const m = (a.y + b.y) / 2;
    const g = d % 2 === 0 ? 1 : -1;
    const c = amp * 1.5 * g * seeded(seed + d * 31 + 7);
    p += ` C${r2(a.x + c)},${r2(m)} ${r2(b.x - c)},${r2(m)} ${r2(b.x)},${r2(b.y)}`;
  }
  return p;
}

/** 横向波浪分界线（官方 generateHorizontalBoundary：y = 高/2 ± 噪声，seed+100） */
function horizontalPath(seed: number, amp: number): string {
  const halfH = CYNEFIN_H / 2;
  const segs = 7;
  const segW = CYNEFIN_W / segs;
  const pts: { x: number; y: number }[] = [];
  for (let d = 0; d <= segs; d++) {
    pts.push({ x: d * segW, y: halfH + seeded(seed + d * 23) * amp * 2 - amp });
  }
  let p = `M${r2(pts[0].x)},${r2(pts[0].y)}`;
  for (let d = 0; d < pts.length - 1; d++) {
    const a = pts[d], b = pts[d + 1];
    const m = (a.x + b.x) / 2;
    const g = d % 2 === 0 ? 1 : -1;
    const c = amp * 1.5 * g * seeded(seed + d * 37 + 11);
    p += ` C${r2(m)},${r2(a.y + c)} ${r2(m)},${r2(b.y - c)} ${r2(b.x)},${r2(b.y)}`;
  }
  return p;
}

/** clear 域悬崖曲线（官方 generateCliffPath） */
function cliffPath(): string {
  const cx = CYNEFIN_W / 2;
  const y0 = CYNEFIN_H / 2;
  const y1 = CYNEFIN_H;
  const a = CYNEFIN_W * 0.03;
  const seg = (f: number): number => y0 + (y1 - y0) * f;
  return `M${cx},${r2(y0)} C${r2(cx + a)},${r2(seg(0.2))} ${r2(cx - 1.5 * a)},${r2(seg(0.55))} ` +
    `${r2(cx + 0.5 * a)},${r2(seg(0.75))} C${r2(cx - a)},${r2(seg(0.85))} ${r2(cx + 0.3 * a)},${r2(seg(0.95))} ` +
    `${cx},${r2(y1)}`;
}

/** 官方 item 文字宽度（CJK=字号、其余 0.62×字号，对标 getBBox 实测） */
function estTextW(text: string, fontSize: number): number {
  let w = 0;
  for (const ch of text) w += ch.charCodeAt(0) > 0x2e7f ? fontSize : fontSize * 0.62;
  return w;
}

/** 域名首字母大写（官方 charAt(0).toUpperCase()） */
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** 主入口 */
export function mapCynefin(
  ast: CynefinAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedCynefinNode[]; links: MappedCynefinLink[] } {
  void theme;
  const nodes: MappedCynefinNode[] = [];
  const links: MappedCynefinLink[] = [];
  const P = CYNEFIN_PAD;
  const AMP = 8; // 官方 boundaryAmplitude

  // 域布局（官方 getDomainLayouts：r=W/2, n=H/2）
  const r = CYNEFIN_W / 2;
  const n = CYNEFIN_H / 2;
  const layout: Record<string, { x: number; y: number; w: number; h: number; cx: number; cy: number }> = {
    complex: { x: 0, y: 0, w: r, h: n, cx: r / 2, cy: n / 2 },
    complicated: { x: r, y: 0, w: r, h: n, cx: r + r / 2, cy: n / 2 },
    chaotic: { x: 0, y: n, w: r, h: n, cx: r / 2, cy: n + n / 2 },
    clear: { x: r, y: n, w: r, h: n, cx: r + r / 2, cy: n + n / 2 },
  };

  const byDomain = new Map<string, CynefinAST['domains'][number]>();
  for (const d of ast.domains) byDomain.set(d.domain, d);

  // 1) 四域浅色底（key = 域名 → transitions 连线锚在矩形中心 = 官方域中心）
  for (const dom of DOMAIN_ORDER) {
    const L = layout[dom];
    nodes.push({
      key: dom, category: 'CynefinBg',
      loc: `${r2(L.x + P)} ${r2(L.y + P)}`,
      w: r2(L.w), h: r2(L.h),
      fill: rgba(BG[dom], 0.4),
    });
  }

  // 2) 波浪分界线 + 悬崖（官方 seed=svg.id 哈希，每次渲染随机 → 固定 0 保确定性）
  const seed = 0;
  nodes.push({
    key: '__boundary_v', category: 'CynefinBoundary',
    loc: `${P} ${P}`,
    geom: `${foldPath(seed, AMP)} ${horizontalPath(seed + 100, AMP)}`,
    stroke: BOUNDARY_COLOR,
  });
  nodes.push({
    key: '__cliff', category: 'CynefinCliff',
    loc: `${P} ${P}`,
    geom: cliffPath(),
    stroke: CLIFF_COLOR,
  });

  // 3) confusion 椭圆（中心、rx=p*.15 ry=m*.15）
  const rx = CYNEFIN_W * 0.15;
  const ry = CYNEFIN_H * 0.15;
  nodes.push({
    key: '__confusion_ellipse', category: 'CynefinConfusion',
    loc: `${r2(r - rx + P)} ${r2(n - ry + P)}`,
    w: r2(rx * 2), h: r2(ry * 2),
    fill: rgba(CONFUSION_BG, 0.5),
  });

  // 4) 域标签 + 固定响应模式（showDomainDescriptions 默认开）
  for (const dom of DOMAIN_ORDER) {
    const L = layout[dom];
    nodes.push({
      key: `__lbl_${dom}`, category: 'CynefinLabel',
      text: cap(dom),
      loc: `${r2(L.cx + P)} ${r2(L.cy - 30 + P)}`,
    });
    const d = DESCRIPTIONS[dom];
    nodes.push({
      key: `__sub_${dom}_m`, category: 'CynefinSubtitle',
      text: d.model,
      loc: `${r2(L.cx + P)} ${r2(L.cy - 10 + P)}`,
    });
    nodes.push({
      key: `__sub_${dom}_p`, category: 'CynefinSubtitle',
      text: d.practice,
      loc: `${r2(L.cx + P)} ${r2(L.cy + 5 + P)}`,
    });
  }
  nodes.push({
    key: '__lbl_confusion', category: 'CynefinLabel',
    text: 'Confusion',
    loc: `${r2(r + P)} ${r2(n - 10 + P)}`,
  });
  nodes.push({
    key: '__sub_confusion', category: 'CynefinSubtitle',
    text: 'Disorder',
    loc: `${r2(r + P)} ${r2(n + 8 + P)}`,
  });

  // 5) items（官方顺序 complex→complicated→chaotic→clear→confusion）
  const pushItems = (dom: string, cx: number, startY: number, cap3: boolean): void => {
    let items = byDomain.get(dom)?.items ?? [];
    let overflow = 0;
    if (cap3 && items.length > CONFUSION_MAX_ITEMS) {
      overflow = items.length - CONFUSION_MAX_ITEMS;
      items = items.slice(0, CONFUSION_MAX_ITEMS);
    }
    items.forEach((label, j) => {
      const w = estTextW(label, 12) + ITEM_PAD * 2;
      nodes.push({
        key: `__i_${dom}_${j}`, category: 'CynefinItem',
        text: label,
        loc: `${r2(cx - w / 2 + P)} ${r2(startY + j * (ITEM_H + ITEM_GAP) + P)}`,
        w: r2(w), h: ITEM_H,
        fill: rgba(BG[dom] ?? '#ffffff', 0.95),
      });
    });
    if (overflow > 0) {
      const lbl = `+${overflow} more`;
      const w = estTextW(lbl, 12) + ITEM_PAD * 2;
      nodes.push({
        key: `__i_${dom}_more`, category: 'CynefinItemOverflow',
        text: lbl,
        loc: `${r2(cx - w / 2 + P)} ${r2(startY + items.length * (ITEM_H + ITEM_GAP) + P)}`,
        w: r2(w), h: ITEM_H,
        fill: rgba(BG[dom] ?? CONFUSION_BG, 0.6),
      });
    }
  };
  for (const dom of DOMAIN_ORDER) {
    const L = layout[dom];
    pushItems(dom, L.cx, L.cy + 25, false);
  }
  const confusion = byDomain.get('confusion');
  if (confusion) pushItems('confusion', r, n + 22, true);

  // 6) transitions：端点须为已知域（A==B 已在 parser 忽略）
  const known = new Set<string>([...DOMAIN_ORDER, 'confusion']);
  for (const t of ast.transitions) {
    if (!known.has(t.from) || !known.has(t.to)) continue;
    links.push(t.label
      ? { from: t.from, to: t.to, label: t.label }
      : { from: t.from, to: t.to });
  }

  // 7) 标题（官方 (p/2, -g/2)）
  if (ast.title) {
    nodes.push({
      key: '__title', category: 'CynefinTitle',
      text: ast.title,
      loc: `${r2(r + P)} ${r2(-CYNEFIN_PAD / 2 + P)}`,
    });
  }

  return { nodes, links };
}
