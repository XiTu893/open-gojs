/**
 * cynefin AST → GoJS 模型数据映射。
 *
 * 固定布局（画布 800×600，全部坐标在此算好）：
 *  - complex 左上、complicated 右上、chaotic 左下、clear 右下（各 ~45% 宽高浅灰底框，四框间小间隙）
 *  - 每框：标题粗体 + 副标题小字 + items 徽章（RoundedRectangle 小条纵排）
 *  - confusion = 中央 Ellipse 椭圆压四框交界（白底黑边）；items 只显示前 3 个 + `+N more`
 *  - transitions = 框到框的连线数据（跨域箭头 + 标签，渲染层装配）
 *
 * 注：原生 Cynefin 的波浪边界此处简化为直线框（固定布局测试报告已注明）。
 */
import { CynefinAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

/** 画布尺寸（导出供测试） */
export const CYNEFIN_W = 800;
export const CYNEFIN_H = 600;

const PAD = 24;
const TOP = 52;          // 顶部留给总标题
const GAP = 18;          // 四框间隙
const BOX_TITLE_H = 56;  // 框内标题+副标题占高
const BADGE_H = 22;
const BADGE_GAP = 6;

/** 副标题（Cynefin 经典响应模式） */
const SUBTITLES: Record<string, string> = {
  complex: 'probe - sense - respond',
  complicated: 'analyse - sense - respond',
  chaotic: 'act - sense - respond',
  clear: 'sense - categorise - respond',
  confusion: '',
};

/** 映射后的节点类别 */
export type CynefinNodeCategory =
  | 'CynefinTitle' | 'CynefinBox' | 'CynefinDomainTitle' | 'CynefinSub'
  | 'CynefinItem' | 'CynefinEllipse';

/** 映射后的节点数据 */
export interface MappedCynefinNode {
  key: string;
  category: CynefinNodeCategory;
  loc: string;
  text?: string;
  fill?: string;
  stroke?: string;
  w?: number;
  h?: number;
  bold?: boolean;
  align?: 'left' | 'center';
}

/** 映射后的连线数据 */
export interface MappedCynefinLink {
  from: string;
  to: string;
  label?: string;
}

function r1(v: number): number {
  return Math.round(v * 10) / 10;
}

/** 四象限固定位置（左上/右上/左下/右下） */
const QUAD: Record<string, { x: number; y: number }> = {
  complex: { x: PAD, y: TOP },
  complicated: { x: 0, y: TOP },          // x 稍后填
  chaotic: { x: PAD, y: 0 },              // y 稍后填
  clear: { x: 0, y: 0 },
};

/** 主入口 */
export function mapCynefin(
  ast: CynefinAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedCynefinNode[]; links: MappedCynefinLink[] } {
  const nodes: MappedCynefinNode[] = [];
  const links: MappedCynefinLink[] = [];

  const boxW = (CYNEFIN_W - 2 * PAD - GAP) / 2;
  const boxH = (CYNEFIN_H - TOP - PAD - GAP) / 2;
  QUAD.complex = { x: PAD, y: TOP };
  QUAD.complicated = { x: PAD + boxW + GAP, y: TOP };
  QUAD.chaotic = { x: PAD, y: TOP + boxH + GAP };
  QUAD.clear = { x: PAD + boxW + GAP, y: TOP + boxH + GAP };

  // 总标题
  if (ast.title) {
    nodes.push({
      key: '__title', category: 'CynefinTitle',
      text: ast.title, loc: `${r1(CYNEFIN_W / 2)} 22`,
    });
  }

  const byDomain = new Map<string, CynefinAST['domains'][number]>();
  for (const d of ast.domains) byDomain.set(d.domain, d);

  // 四个固定框（缺省域也画空框）
  const quadDomains = ['complex', 'complicated', 'chaotic', 'clear'] as const;
  for (const dom of quadDomains) {
    const q = QUAD[dom];
    nodes.push({
      key: dom, category: 'CynefinBox',
      loc: `${r1(q.x)} ${r1(q.y)}`, w: r1(boxW), h: r1(boxH),
      fill: 'rgba(0,0,0,0.05)', stroke: '#000000',
    });
    nodes.push({
      key: `__t_${dom}`, category: 'CynefinDomainTitle',
      text: dom, bold: true,
      loc: `${r1(q.x + 14)} ${r1(q.y + 12)}`,
    });
    nodes.push({
      key: `__s_${dom}`, category: 'CynefinSub',
      text: SUBTITLES[dom],
      loc: `${r1(q.x + 14)} ${r1(q.y + 34)}`,
    });
    const entry = byDomain.get(dom);
    const items = entry?.items ?? [];
    items.forEach((item, j) => {
      nodes.push({
        key: `__i_${dom}_${j}`, category: 'CynefinItem',
        text: item,
        loc: `${r1(q.x + 14)} ${r1(q.y + BOX_TITLE_H + j * (BADGE_H + BADGE_GAP))}`,
        w: r1(boxW - 28), h: BADGE_H,
      });
    });
  }

  // confusion 椭圆（仅当声明时绘制），items 截断前 3 + "+N more"
  const confusion = byDomain.get('confusion');
  if (confusion) {
    const cx = PAD + boxW + GAP / 2;
    const cy = TOP + boxH + GAP / 2;
    const ew = 220;
    const eh = 128;
    nodes.push({
      key: 'confusion', category: 'CynefinEllipse',
      loc: `${r1(cx)} ${r1(cy)}`, w: ew, h: eh,
      fill: '#ffffff', stroke: '#000000',
    });
    nodes.push({
      key: '__t_confusion', category: 'CynefinDomainTitle',
      text: 'confusion', bold: true, align: 'center',
      loc: `${r1(cx)} ${r1(cy - eh / 2 + 14)}`,
    });
    const shown = confusion.items.slice(0, 3);
    const extra = confusion.items.length - shown.length;
    const badgeW = 160;
    shown.forEach((item, j) => {
      nodes.push({
        key: `__i_confusion_${j}`, category: 'CynefinItem',
        text: item,
        loc: `${r1(cx - badgeW / 2)} ${r1(cy - 22 + j * (BADGE_H + 2))}`,
        w: badgeW, h: BADGE_H - 4,
      });
    });
    if (extra > 0) {
      nodes.push({
        key: `__i_confusion_more`, category: 'CynefinItem',
        text: `+${extra} more`,
        loc: `${r1(cx - badgeW / 2)} ${r1(cy - 22 + shown.length * (BADGE_H + 2))}`,
        w: badgeW, h: BADGE_H - 4,
      });
    }
  }

  // transitions：端点须为已知域，A==B 已在 parser 忽略
  const known = new Set<string>(['complex', 'complicated', 'chaotic', 'clear']);
  if (confusion) known.add('confusion');
  for (const t of ast.transitions) {
    if (!known.has(t.from) || !known.has(t.to)) continue;
    links.push(t.label
      ? { from: t.from, to: t.to, label: t.label }
      : { from: t.from, to: t.to });
  }

  return { nodes, links };
}
