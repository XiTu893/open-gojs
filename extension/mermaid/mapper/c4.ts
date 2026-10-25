/**
 * C4 AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：按声明顺序（order）网格摆放 —— 普通元素按 maxPerRow（缺省 4）成行；
 * Boundary 作为浅灰 GroupBox 容器，成员按声明顺序在其内部网格中摆放，
 * 框体尺寸由成员网格算出（框包围成员）。颜色黑白（取 theme 的
 * process/group 配色），ext 元素边框虚线 + «External» 标签。
 */
import { C4AST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';
import { C4ASTX, C4ElementX } from '../parser/c4';

const MARGIN = 28;
const CELL_W = 172;
const CELL_H = 74;
const GAP = 26;
const GBOX_TITLE = 30;  // 组盒标题带
const GBOX_PAD = 14;    // 组盒内边距

/** 映射后的节点数据 */
export interface MappedC4Node {
  key: string;
  category: 'C4Node' | 'GroupBox';
  loc: string;
  w: number;
  h: number;
  text: string;
  stereotype?: string;
  members?: string[];
  dash?: boolean;
  fill: string;
  stroke: string;
  textCol: string;
}

/** 映射后的连线数据 */
export interface MappedC4Link {
  key: string;
  from: string;
  to: string;
  label?: string;
  both?: boolean;
}

/** 映射结果 */
export interface MappedC4 {
  nodes: MappedC4Node[];
  links: MappedC4Link[];
  maxPerRow: number;
}

/** 主入口 */
export function mapC4(ast: C4AST, theme: MermaidTheme = defaultTheme): MappedC4 {
  const xs = ast as C4ASTX;
  const maxPerRow = Math.max(1, xs.maxPerRow ?? 4);
  const bandW = maxPerRow * CELL_W + (maxPerRow - 1) * GAP;
  const ecs = theme.categories.process;
  const gcs = theme.categories.group;

  // 元素索引（去重，先声明优先）
  const els = new Map<string, C4ElementX>();
  for (const e of ast.elements) if (!els.has(e.alias)) els.set(e.alias, e as C4ElementX);

  const order = xs.order ?? ast.elements.map(e => ({ kind: 'element' as const, alias: e.alias }));
  const placed = new Set<string>();
  const nodes: MappedC4Node[] = [];

  const cellNode = (e: C4ElementX, x: number, y: number): MappedC4Node => ({
    key: e.alias,
    category: 'C4Node',
    loc: `${Math.round(x)} ${Math.round(y)}`,
    w: CELL_W,
    h: CELL_H,
    text: e.label || e.alias,
    stereotype: e.ext ? `«External ${e.type}»` : `«${e.type}»`,
    dash: !!e.ext,
    fill: ecs.fill,
    stroke: ecs.stroke,
    textCol: ecs.text,
  });

  // 纵向链式布局（对标官方 C4 的竖向观感，且更规整）：顶层元素自上而下逐个摆放、
  // 水平居中；Boundary 容器同样纵向排布，成员在其内部网格。比横向一行更紧凑可读。
  const laneW = Math.min(bandW, maxPerRow * CELL_W + (maxPerRow - 1) * GAP);
  let cursorY = MARGIN;
  const blockX = (w: number): number => MARGIN + Math.max(0, (laneW - w) / 2);

  for (const item of order) {
    if (item.kind === 'element') {
      const e = els.get(item.alias);
      if (!e || placed.has(item.alias)) continue;
      const x = blockX(CELL_W);
      nodes.push(cellNode(e, x, cursorY));
      placed.add(item.alias);
      cursorY += CELL_H + GAP;
      continue;
    }

    // Boundary：容器节点 + 成员内部网格
    const b = ast.boundaries.find(x => x.alias === item.alias);
    if (!b) continue;
    const memberAliases = ast.elements
      .filter(e => (e as C4ElementX).boundaryAlias === b.alias && !placed.has(e.alias))
      .map(e => e.alias);
    const n = Math.max(memberAliases.length, 1);
    const cols = Math.max(1, Math.min(maxPerRow, Math.ceil(Math.sqrt(n))));
    const rows = Math.ceil(n / cols);
    const gw = cols * CELL_W + (cols - 1) * GAP + GBOX_PAD * 2;
    const gh = GBOX_TITLE + rows * CELL_H + (rows - 1) * GAP + GBOX_PAD * 2;

    memberAliases.forEach((alias, i) => {
      const e = els.get(alias);
      if (!e) return;
      const c = i % cols;
      const r = Math.floor(i / cols);
      nodes.push(cellNode(e, blockX(gw) + GBOX_PAD + c * (CELL_W + GAP), cursorY + GBOX_TITLE + r * (CELL_H + GAP)));
      placed.add(alias);
    });
    nodes.push({
      key: b.alias,
      category: 'GroupBox',
      loc: `${Math.round(blockX(gw))} ${Math.round(cursorY)}`,
      w: Math.round(gw),
      h: Math.round(gh),
      text: b.label || b.alias,
      members: memberAliases,
      fill: gcs.fill,
      stroke: gcs.stroke,
      textCol: gcs.text,
    });
    cursorY += gh + GAP;
  }

  // ---- 连线（两端须为已知节点） ----
  const keys = new Set(nodes.map(n => n.key));
  const links: MappedC4Link[] = [];
  ast.rels.forEach((r, i) => {
    if (!r.from || !r.to || r.from === r.to) return;
    if (!keys.has(r.from) || !keys.has(r.to)) return;
    const l: MappedC4Link = { key: `r_${i}`, from: r.from, to: r.to };
    if (r.label) l.label = r.label;
    if (r.bi) l.both = true;
    links.push(l);
  });

  return { nodes, links, maxPerRow };
}
