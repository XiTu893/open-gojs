/**
 * eventmodeling AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：水平泳道带（浅灰底条 + 左侧竖排泳道标题），时间帧按 num 首次出现
 * 顺序成为 x 递增的列（列间浅分隔线 + 列头）；帧卡片按 entityType 落到
 * 对应泳道行的列格内（同格多卡纵向堆叠不重叠）。
 * 连线 = 推断（前一非 reset 帧 → 当前帧，reset 断开）+ 显式 relTo（虚线）。
 * 颜色只取 theme：卡片用 theme.series 按 entityType 轮换，泳道/分隔线用
 * categories.group；禁止硬编码彩色。
 */
import { EventModelingAST } from '../ast';
import { MermaidTheme, defaultTheme, contrastText } from '../themes';
import { EventLane, EventModelingASTX, inferEventLanes } from '../parser/eventmodeling';

const MARGIN = 24;
const TITLE_W = 120;    // 左侧竖排泳道标题带宽
const HEADER_H = 40;    // 顶部列头高度
const CARD_W_MIN = 150;
const CARD_H = 56;
const CARD_GAP = 10;    // 同格堆叠间距
const COL_GAP = 36;     // 列间距
const LANE_PAD = 14;    // 泳道上下留白
const LANE_GAP = 10;    // 泳道带间距

const ENTITY_TYPES: EventModelingAST['frames'][number]['entityType'][] = ['ui', 'pcr', 'cmd', 'rmo', 'evt'];

/** 估算文本宽度（CJK 全宽） */
function textW(s: string, px: number): number {
  let w = 0;
  for (const ch of s) {
    w += /[⺀-鿿　-〿＀-￯]/.test(ch) ? px : px * 0.62;
  }
  return Math.ceil(w);
}

/** 映射后的节点数据 */
export interface MappedEventNode {
  key: string;
  category: 'Lane' | 'Sep' | 'ColHead' | 'Card';
  loc: string;
  w?: number;
  h?: number;
  text?: string;
  sub?: string;
  fill?: string;
  stroke?: string;
  textCol?: string;
}

/** 映射后的连线数据 */
export interface MappedEventLink {
  key: string;
  from: string;
  to: string;
  label?: string;
  dash?: boolean;
}

/** 映射结果 */
export interface MappedEventModeling {
  nodes: MappedEventNode[];
  links: MappedEventLink[];
}

/** 主入口 */
export function mapEventModeling(
  ast: EventModelingAST,
  theme: MermaidTheme = defaultTheme
): MappedEventModeling {
  const frames = ast.frames ?? [];
  const lanes: EventLane[] =
    (ast as EventModelingASTX).lanes?.length
      ? (ast as EventModelingASTX).lanes
      : inferEventLanes(frames);
  const gcs = theme.categories.group;
  const ecs = theme.categories.process;

  // ---- 列：num 首次出现顺序 ----
  const colOfNum = new Map<string, number>();
  for (const f of frames) if (!colOfNum.has(f.num)) colOfNum.set(f.num, colOfNum.size);
  const nCols = Math.max(colOfNum.size, 1);

  // ---- 卡片尺寸：取最宽文本 ----
  let cardW = CARD_W_MIN;
  for (const f of frames) cardW = Math.max(cardW, textW(`${f.num} · ${f.entity}`, theme.fontSize.node) + 24);

  // ---- 每帧所在泳道/列/堆叠序 ----
  const laneIdxOfFrame = new Map<number, number>();
  lanes.forEach((lane, li) => lane.frames.forEach(fi => laneIdxOfFrame.set(fi, li)));
  const stackCount = new Map<string, number>(); // `${lane}:${col}` → 已放数量
  const frameCell: { lane: number; col: number; stack: number }[] = [];
  frames.forEach((f, i) => {
    const lane = laneIdxOfFrame.get(i) ?? 0;
    const col = colOfNum.get(f.num) ?? 0;
    const ck = `${lane}:${col}`;
    const stack = stackCount.get(ck) ?? 0;
    stackCount.set(ck, stack + 1);
    frameCell.push({ lane, col, stack });
  });

  // ---- 泳道带高度（含竖排标题所需最小高度） ----
  const laneTop: number[] = [];
  const laneH: number[] = [];
  let y = MARGIN + HEADER_H;
  lanes.forEach((lane, li) => {
    let maxStack = 1;
    for (let i = 0; i < frames.length; i++) {
      if (frameCell[i].lane === li) maxStack = Math.max(maxStack, frameCell[i].stack + 1);
    }
    const contentH = LANE_PAD * 2 + maxStack * CARD_H + (maxStack - 1) * CARD_GAP;
    const titleH = textW(lane.title, theme.fontSize.label) + LANE_PAD * 2;
    laneTop.push(y);
    laneH.push(Math.max(contentH, titleH, 48));
    y += laneH[li] + LANE_GAP;
  });
  if (!lanes.length) { laneTop.push(y); laneH.push(60); }

  const bandW = TITLE_W + nCols * (cardW + COL_GAP) - COL_GAP + MARGIN;
  const totalBottom = laneTop[laneTop.length - 1] + laneH[laneH.length - 1];
  const colX = (col: number) => MARGIN + TITLE_W + col * (cardW + COL_GAP);

  const nodes: MappedEventNode[] = [];

  // ---- 泳道带（垫底） ----
  lanes.forEach((lane, li) => {
    nodes.push({
      key: `lane_${li}`,
      category: 'Lane',
      loc: `${MARGIN} ${laneTop[li]}`,
      w: Math.round(bandW),
      h: Math.round(laneH[li]),
      text: lane.title,
      fill: gcs.fill,
      stroke: gcs.stroke,
      textCol: gcs.text,
    });
  });

  // ---- 列头 + 分隔线（每列只发一次） ----
  const headSeen = new Set<number>();
  for (const f of frames) {
    const c = colOfNum.get(f.num)!;
    if (headSeen.has(c)) continue;
    headSeen.add(c);
    nodes.push({
      key: `col_${c}`,
      category: 'ColHead',
      loc: `${Math.round(colX(c) + cardW / 2)} ${MARGIN + HEADER_H / 2}`,
      text: f.num,
      textCol: gcs.text,
    });
    if (c > 0) {
      nodes.push({
        key: `sep_${c}`,
        category: 'Sep',
        loc: `${Math.round(colX(c) - COL_GAP / 2)} ${MARGIN + HEADER_H}`,
        h: Math.round(totalBottom - (MARGIN + HEADER_H)),
        fill: gcs.stroke,
      });
    }
  }

  // ---- 帧卡片 ----
  frames.forEach((f, i) => {
    const { lane, col, stack } = frameCell[i];
    const x = colX(col);
    const ty = laneTop[lane] + LANE_PAD + stack * (CARD_H + CARD_GAP);
    const ti = ENTITY_TYPES.indexOf(f.entityType);
    const fill = theme.series[(ti < 0 ? 0 : ti) % theme.series.length];
    nodes.push({
      key: `f_${i}`,
      category: 'Card',
      loc: `${Math.round(x)} ${Math.round(ty)}`,
      w: Math.round(cardW),
      h: CARD_H,
      text: `${f.num} · ${f.entity}`,
      sub: f.data,
      fill,
      stroke: ecs.stroke,
      textCol: contrastText(fill),
    });
  });

  // ---- 连线：推断链 + 显式 relTo ----
  const links: MappedEventLink[] = [];
  const seen = new Set<string>();
  const addLink = (from: number, to: number, dash: boolean): void => {
    const k = `${from}>${to}`;
    if (from === to || seen.has(k) || !frames[from] || !frames[to]) return;
    seen.add(k);
    const l: MappedEventLink = { key: `l_${from}_${to}`, from: `f_${from}`, to: `f_${to}` };
    if (dash) l.dash = true;
    links.push(l);
  };
  let prev = -1;
  frames.forEach((f, i) => {
    if (!f.reset && prev >= 0) addLink(prev, i, false);
    prev = i;
  });
  frames.forEach((f, i) => {
    for (const t of f.relTo) {
      const ti = frames.findIndex(x => x.num === t);
      if (ti >= 0) addLink(i, ti, true);
    }
  });

  return { nodes, links };
}
