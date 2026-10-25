/**
 * architecture-beta AST → GoJS 模型数据映射（全部坐标在此算好）。
 *
 * 布局：组（GroupBox 节点）横排在上，组内服务竖排；组外服务在下方
 * 贪心装箱。服务节点尺寸按标签估宽（有上下限），高度固定。
 * 连线保留端口（fromPort/toPort = R/L/T/B），渲染层据此绑 fromSpot/toSpot。
 * 配色只取 theme：服务用 categories.process，组盒用 categories.group。
 */
import { ArchitectureAST } from '../ast';
import { MermaidTheme, defaultTheme } from '../themes';

const MARGIN = 32;
const GAP_GROUP = 70;
const VGAP_IN_GROUP = 18;
const GROUP_TITLE = 28;
const GROUP_PAD_X = 16;
const GROUP_PAD_B = 14;
const SVC_W_MIN = 120;
const SVC_H = 56;
const LOOSE_WRAP = 860;
const LOOSE_GAP = 22;

/** 映射后的节点数据 */
export interface MappedArchitectureNode {
  key: string;
  category: 'Service' | 'GroupBox';
  loc: string;
  w: number;
  h: number;
  text: string;
  title?: string;
  members?: string[];
  fill: string;
  stroke: string;
  textCol: string;
}

/** 映射后的连线数据（带端口） */
export interface MappedArchitectureLink {
  from: string;
  fromPort: string;
  to: string;
  toPort: string;
}

/** 估算文本宽度（CJK 全宽） */
function textW(s: string, px: number): number {
  let w = 0;
  for (const ch of s) {
    w += /[⺀-鿿　-〿＀-￯]/.test(ch) ? px : px * 0.62;
  }
  return Math.ceil(w);
}

/** 端口字符兜底（非 R/L/T/B 一律归为右/左） */
function normPort(p: string): string {
  const u = (p || '').toUpperCase();
  return u === 'L' || u === 'T' || u === 'B' ? u : 'R';
}

/** 主入口 */
export function mapArchitecture(
  ast: ArchitectureAST,
  theme: MermaidTheme = defaultTheme
): { nodes: MappedArchitectureNode[]; links: MappedArchitectureLink[] } {
  const cs = theme.categories.process;
  const gcs = theme.categories.group;
  const fs = theme.fontSize.node;

  // 服务尺寸
  const svcSize = new Map<string, { w: number; h: number }>();
  const labelOf = new Map<string, string>();
  for (const s of ast.services) {
    if (svcSize.has(s.alias)) continue;
    const w = Math.max(SVC_W_MIN, textW(s.label, fs) + 26);
    svcSize.set(s.alias, { w, h: SVC_H });
    labelOf.set(s.alias, s.label);
  }

  // 服务分组（未声明的组 alias 也允许 —— 但只输出已声明组的盒子）
  const declaredGroups = new Map<string, string>(); // alias → label
  for (const g of ast.groups) declaredGroups.set(g.alias, g.label);
  const inGroup = new Map<string, string[]>(); // group alias → service aliases
  for (const s of ast.services) {
    if (s.group && declaredGroups.has(s.group)) {
      const arr = inGroup.get(s.group) ?? [];
      arr.push(s.alias);
      inGroup.set(s.group, arr);
    }
  }

  const nodes: MappedArchitectureNode[] = [];

  // ---- 组盒（横排在上） ----
  const groupRect = new Map<string, { x: number; y: number; w: number; h: number }>();
  let cursorX = MARGIN;
  const topY = MARGIN;
  let groupBandH = 0;
  const placedSvc = new Set<string>();

  for (const g of ast.groups) {
    const members = inGroup.get(g.alias) ?? [];
    const title = g.label || g.alias;
    const titleW = textW(title, fs) + GROUP_PAD_X * 2;
    let innerW = titleW;
    let y = topY + GROUP_TITLE;
    for (const id of members) {
      const s = svcSize.get(id);
      if (!s) continue;
      innerW = Math.max(innerW, s.w + GROUP_PAD_X * 2);
      nodes.push({
        key: id,
        category: 'Service',
        loc: `${Math.round(cursorX + GROUP_PAD_X)} ${Math.round(y)}`,
        w: Math.round(s.w),
        h: Math.round(s.h),
        text: labelOf.get(id) ?? id,
        fill: cs.fill,
        stroke: cs.stroke,
        textCol: cs.text,
      });
      placedSvc.add(id);
      y += s.h + VGAP_IN_GROUP;
    }
    const gh = (y - (topY + GROUP_TITLE) > 0 ? y - VGAP_IN_GROUP : topY + GROUP_TITLE) + GROUP_PAD_B - topY;
    const gw = innerW;
    groupRect.set(g.alias, { x: cursorX, y: topY, w: gw, h: Math.max(gh, GROUP_TITLE + GROUP_PAD_B) });
    groupBandH = Math.max(groupBandH, Math.max(gh, GROUP_TITLE + GROUP_PAD_B));
    cursorX += gw + GAP_GROUP;
  }

  // ---- 组外服务（下方贪心装箱） ----
  const loose = ast.services.filter(s => !placedSvc.has(s.alias));
  let lx = MARGIN;
  let ly = topY + groupBandH + MARGIN;
  let rowH = 0;
  for (const s of loose) {
    const sz = svcSize.get(s.alias);
    if (!sz) continue;
    if (lx > MARGIN && lx - MARGIN + sz.w > LOOSE_WRAP) {
      lx = MARGIN;
      ly += rowH + LOOSE_GAP;
      rowH = 0;
    }
    nodes.push({
      key: s.alias,
      category: 'Service',
      loc: `${Math.round(lx)} ${Math.round(ly)}`,
      w: Math.round(sz.w),
      h: Math.round(sz.h),
      text: labelOf.get(s.alias) ?? s.alias,
      fill: cs.fill,
      stroke: cs.stroke,
      textCol: cs.text,
    });
    lx += sz.w + LOOSE_GAP;
    rowH = Math.max(rowH, sz.h);
  }

  // ---- 组盒节点（垫底，loc 取包围盒左上） ----
  for (const [alias, r] of groupRect) {
    const title = declaredGroups.get(alias) ?? alias;
    nodes.push({
      key: alias,
      category: 'GroupBox',
      loc: `${Math.round(r.x)} ${Math.round(r.y)}`,
      w: Math.round(r.w),
      h: Math.round(r.h),
      text: '',
      title,
      members: inGroup.get(alias) ?? [],
      fill: gcs.fill,
      stroke: gcs.stroke,
      textCol: cs.text,
    });
  }

  // ---- 连线（两端服务都存在才保留；端口兜底规范化） ----
  const known = new Set(svcSize.keys());
  const links: MappedArchitectureLink[] = [];
  for (const c of ast.conns) {
    if (!known.has(c.from) || !known.has(c.to)) continue;
    links.push({
      from: c.from,
      fromPort: normPort(c.fromPort),
      to: c.to,
      toPort: normPort(c.toPort),
    });
  }

  return { nodes, links };
}
