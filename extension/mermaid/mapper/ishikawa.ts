/**
 * ishikawa AST → GoJS 模型数据映射。
 *
 * 完全复刻官方 mermaid 11 ishikawa 渲染器（$7t/V7t/F7t/G7t/z7t/VL）的布局坐标，
 * 坐标与 temp/_sw/off_ishikawa.svg 逐点一致：
 *  - 常量：px=250（基准高）、P7t=30、O7t=60、B7t=5、倾角 82°（wBe=cos, kBe=sin）、padding 20
 *  - 偶数索引类别在上（side=-1，子因倒序）、奇数在下（side=+1）
 *  - 高度：_=max(75, 500*evenTotal/N)、A=max(75, 500*oddTotal/N)，再各 max(max*fontSize*2)
 *  - 脊线 y = C = max(_, px)；分支起点 w=-20，每对类别后 w=min(text bbox.x)（下一对更靠左）
 *  - 鱼头：wrap 宽 max(6, floor(110/(fs*.6)))，d=max(60, w+6)、f=max(40, h*2+40)
 *
 * 骨线节点 geometry 用「局部坐标 + loc=实际最小角」策略（对标 cynefin），
 * 避免 geometry 负偏移被 GoJS 归一化撑大 documentBounds。
 *
 * 文本宽度依赖 measure 回调（浏览器 canvas measureText 精确、vitest/Node 回退 estTextW）。
 */
import { IshikawaAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

// ---- 官方常量 ----
const PX = 250;      // 基准高度 / 脊线最小 y
const P7T = 30;      // 无子因时 sub-branch 向左延伸
const FONT = 16;     // 标签字号（官方 config fontSize 默认）
const HEAD_FONT = 14; // 鱼头标签（CSS 覆盖为 14px 600）
const WBE = Math.cos((82 * Math.PI) / 180); // cos82°
const KBE = Math.sin((82 * Math.PI) / 180); // sin82°
const CAUSE_WRAP = 15; // 官方 G7t: LBe(text, 15) 原因标签换行字符数

/** 估算文本宽度（CJK=字号、其余 0.55×字号，对齐官方 trebuchet 实测） */
function estTextW(text: string, fontSize: number): number {
  let w = 0;
  for (const ch of text) w += ch.charCodeAt(0) > 0x2e7f ? fontSize : fontSize * 0.55;
  return w;
}

/** 文本宽度测量：浏览器 canvas 精确测量；无 canvas 时回退 estTextW */
function makeMeasure(theme: MermaidTheme): (text: string, fontSize: number) => number {
  let ctx: CanvasRenderingContext2D | null = null;
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
  }
  if (!ctx) return (text, fontSize) => estTextW(text, fontSize);
  return (text, fontSize) => {
    ctx.font = `${fontSize}px ${theme.fontFamily}`;
    const m = ctx.measureText(text);
    return m.width > 0 ? m.width : estTextW(text, fontSize);
  };
}

/** 映射后的节点数据 */
export interface MappedIshikawaNode {
  key: string;
  category: 'Bone' | 'Head' | 'HeadLabel' | 'CatLabel' | 'CauseLabel';
  loc: string;
  text?: string;
  geo?: string;      // Bone: line / Head: path（局部坐标）
  arrow?: string;    // Bone: 箭头三角 path（局部坐标，可选）
  sw?: number;       // Bone: strokeWidth（spine/branch 2, sub 1）
  fill?: string;
  stroke?: string;
  spot?: string;     // 节点定位点（'TopLeft' | 'Center' | 'MiddleRight'）
}

/** 文本换行（官方 LBe：贪心按宽度字符换行，join \n） */
export function wrapText(text: string, width: number): string[] {
  if (!text) return [];
  if (text.length <= width) return [text];
  const r: string[] = [];
  for (const word of text.split(/\s+/)) {
    const last = r.length - 1;
    if (last >= 0 && r[last].length + 1 + word.length <= width) r[last] += ' ' + word;
    else r.push(word);
  }
  return r;
}

/** 箭头三角（官方 marker-start，viewBox 10x10，refX=0，apex 在线起点，指向反向） */
function arrowTri(x1: number, y1: number, x2: number, y2: number, sw: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return 'M 0 0';
  const ux = dx / len;
  const uy = dy / len;
  const L = 6 * sw;
  const half = 3 * sw;
  const bx = x1 + ux * L;
  const by = y1 + uy * L;
  const px = -uy;
  const py = ux;
  return `M ${x1} ${y1} L ${bx + px * half} ${by + py * half} L ${bx - px * half} ${by - py * half} Z`;
}

/**
 * 画一条线段骨：geometry 用局部坐标（min 角在 0,0），loc = 实际 min 角。
 * 箭头也在同一局部坐标系（用局部线端点计算）。
 */
function lineBone(
  key: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sw: number,
  withArrow: boolean
): { loc: [number, number]; geo: string; arrow?: string } {
  void key;
  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const lx1 = x1 - minX;
  const ly1 = y1 - minY;
  const lx2 = x2 - minX;
  const ly2 = y2 - minY;
  const g = `M ${lx1} ${ly1} L ${lx2} ${ly2}`;
  let arrow: string | undefined;
  if (withArrow) {
    arrow = arrowTri(lx1, ly1, lx2, ly2, sw);
  }
  return { loc: [minX, minY], geo: g, arrow };
}

/** 画一条分支（官方 V7t）及其类别标签、子因水平线 */
function drawBranch(
  out: MappedIshikawaNode[],
  cat: { name: string; causes: string[] },
  x0: number,
  y0: number,
  side: number,
  height: number,
  fontSize: number,
  measure: (text: string, fs: number) => number,
  pairTexts: { x: number; y: number; txt: string; anchor: 'mid' | 'end' }[]
): void {
  const causes = cat.causes;
  const h = height * (causes.length ? 1 : 0.2);
  const p = x0 - WBE * h;
  const m = y0 + KBE * h * side;
  const keyBase = `c${side}_${out.length}`;

  // 斜骨线 + 箭头
  const lb = lineBone(`bone_${keyBase}`, x0, y0, p, m, 2, true);
  out.push({
    key: `bone_${keyBase}`, category: 'Bone', loc: `${lb.loc[0]} ${lb.loc[1]}`,
    geo: lb.geo, arrow: lb.arrow, sw: 2, stroke: '#333333',
  });

  // 类别标签（z7t）：文本中心位于 (p, m+11*side)，盒 = bbox ±(20, 2)
  out.push({
    key: `cat_${keyBase}`, category: 'CatLabel', loc: `${p} ${m + 11 * side}`,
    text: cat.name, spot: 'Center',
  });
  pairTexts.push({ x: p, y: m + 11 * side, txt: cat.name, anchor: 'mid' });

  if (!causes.length) return;

  // flattenTree（官方 G7t）：AST 扁平 → depth 恒 2，side=-1 时子因倒序
  const entries = causes.map((c) => c);
  const list = side === -1 ? [...entries].reverse() : entries;
  const v = list.length;

  for (let k = 0; k < v; k++) {
    const y = y0 + (KBE * h * side) * ((k + 1) / (v + 1)); // x[k] = y0 + f*((S+1)/(v+1))
    const t = (y - y0) / (m - y0); // lerp 比例
    const N = x0 + (p - x0) * t;
    const A = N - P7T; // 无子因 → -30
    // 水平 sub-branch
    const sb = lineBone(`sub_${keyBase}_${k}`, N, y, A, y, 1, true);
    out.push({
      key: `sub_${keyBase}_${k}`, category: 'Bone', loc: `${sb.loc[0]} ${sb.loc[1]}`,
      geo: sb.geo, arrow: sb.arrow, sw: 1, stroke: '#333333',
    });
    // 原因标签：官方 G7t 对每个 cause 先 LBe(text,15) 贪心按字符换行（≤15 不换），
    // VL 多行块以 y 垂直居中（GoJS 用 Spot.MiddleRight 等价）
    const wrapped = wrapText(list[k], CAUSE_WRAP).join('\n');
    out.push({
      key: `cause_${keyBase}_${k}`, category: 'CauseLabel', loc: `${A} ${y}`,
      text: wrapped, spot: 'MiddleRight',
    });
    pairTexts.push({ x: A, y, txt: wrapped, anchor: 'end' });
  }
}

/** 主入口 */
export function mapIshikawa(
  ast: IshikawaAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedIshikawaNode[] } {
  const nodes: MappedIshikawaNode[] = [];
  const measure = makeMeasure(theme);
  const d = FONT;
  const hasCats = ast.categories.length > 0;

  // 鱼头尺寸（官方 F7t）
  const hw = Math.max(6, Math.floor(110 / (d * 0.6))); // wrap 宽（字符）
  const headLines = wrapText(ast.problem, hw);
  const headW = headLines.length ? Math.max(...headLines.map((l) => measure(l, HEAD_FONT))) : 0;
  const headH = headLines.length
    ? (headLines.length - 1) * (d * 1.05) + HEAD_FONT * 1.143
    : 0;
  const dd = Math.max(60, headW + 6);
  const ff = Math.max(40, headH * 2 + 40);

  if (!hasCats) {
    // 退化脊线 + 鱼头（官方：脊线 (0,250)-(0,250) + 鱼头在 (0,250)）
    const spine = lineBone('spine', PX, PX, PX, PX, 2, false);
    nodes.push({ key: 'spine', category: 'Bone', loc: `${spine.loc[0]} ${spine.loc[1]}`, geo: spine.geo, sw: 2, stroke: '#333333' });
    nodes.push(headNode(PX, dd, ff));
    nodes.push(headLabelNode(PX, dd, headLines.join('\n')));
    return { nodes };
  }

  // ---- 类别/原因布局（官方 $7t 主体）----
  const cats = ast.categories;
  const countDesc = (cat: { causes: string[] }): number => cat.causes.length;
  const sideStats = (list: typeof cats) =>
    list.reduce(
      (acc, cat) => {
        const c = countDesc(cat);
        acc.total += c;
        acc.max = Math.max(acc.max, c);
        return acc;
      },
      { total: 0, max: 0 }
    );

  const even = cats.filter((_, i) => i % 2 === 0);
  const odd = cats.filter((_, i) => i % 2 === 1);
  const EM = sideStats(even);
  const OM = sideStats(odd);
  const N = EM.total + OM.total;
  let upH = PX;
  let dnH = PX;
  if (N > 0) {
    const L = PX * 2;
    const B = PX * 0.3;
    upH = Math.max(B, (L * EM.total) / N);
    dnH = Math.max(B, (L * OM.total) / N);
  }
  const I = d * 2;
  upH = Math.max(upH, EM.max * I);
  dnH = Math.max(dnH, OM.max * I);
  const CY = Math.max(upH, PX); // 脊线 y（只看上侧高度）

  let wCur = -20; // 分支起点（官方 w -= 20）
  const pairCount = Math.ceil(cats.length / 2);
  for (let pi = 0; pi < pairCount; pi++) {
    const pairNodes: MappedIshikawaNode[] = [];
    const pairTexts: { x: number; y: number; txt: string; anchor: 'mid' | 'end' }[] = [];

    const evenCat = cats[pi * 2];
    const oddCat = cats[pi * 2 + 1];
    if (evenCat) drawBranch(pairNodes, evenCat, wCur, CY, -1, upH, d, measure, pairTexts);
    if (oddCat) drawBranch(pairNodes, oddCat, wCur, CY, 1, dnH, d, measure, pairTexts);

    // w = min(text bbox.x) over pair group（官方 getBBox().x：多行取最宽行）
    let minTextX = Infinity;
    for (const t of pairTexts) {
      let tw = 0;
      for (const ln of t.txt.split('\n')) tw = Math.max(tw, measure(ln, d));
      const x0 = t.anchor === 'mid' ? t.x - tw / 2 : t.x - tw;
      minTextX = Math.min(minTextX, x0);
    }
    if (Number.isFinite(minTextX)) wCur = minTextX;

    for (const nd of pairNodes) nodes.push(nd);
  }

  // 鱼头在最终 y=CY
  nodes.push(headNode(CY, dd, ff));
  nodes.push(headLabelNode(CY, dd, headLines.join('\n')));

  // 脊线：x1 = wCur（最左文字 x），y = CY
  const spine = lineBone('spine', wCur, CY, 0, CY, 2, false);
  nodes.push({ key: 'spine', category: 'Bone', loc: `${spine.loc[0]} ${spine.loc[1]}`, geo: spine.geo, sw: 2, stroke: '#333333' });

  return { nodes };
}

/** 鱼头 path 节点（局部坐标：min y 在 0，loc = (0, C-f/2)） */
function headNode(CY: number, dd: number, ff: number): MappedIshikawaNode {
  const minY = CY - ff / 2;
  // 原绝对 path: M 0 C-f/2 L 0 C+f/2 Q 2.4d C 0 C-f/2 Z；平移 -minY
  const path = `M 0 0 L 0 ${ff} Q ${dd * 2.4} ${ff / 2} 0 0 Z`;
  return {
    key: 'head', category: 'Head', loc: `0 ${minY}`,
    geo: path, fill: '#ECECFF', stroke: '#333333', sw: 2,
  };
}

/** 鱼头标签节点（中心 x = d/2+3，y = CY） */
function headLabelNode(CY: number, dd: number, text: string): MappedIshikawaNode {
  const hcx = dd / 2 + 3;
  return {
    key: 'head_label', category: 'HeadLabel', loc: `${hcx} ${CY}`,
    text, spot: 'Center',
  };
}