/**
 * gantt AST → GoJS 模型数据映射。
 *
 * 日期解析（dateFormat）、工期（Nd/Nw/Nm）、after 依赖顺延、
 * 时间轴刻度/网格、任务条坐标全部在此算好，渲染层只建模板。
 */
import { GanttAST, GanttTask } from '../ast';
import { MermaidTheme } from '../themes';

const BASE_LABEL_W = 220;  // 左列宽底线（任务名超长时自动加宽，见 mapGantt）
const ROW_H = 30;
const TOP = 96;            // 顶部（标题+轴）
const BAR_H = 18;
const DAY_PX = 40;         // 每天像素
const MARGIN = 20;

/** 估算文本像素宽（CJK≈1em，latin≈0.55em，em=13px） */
function textW(s: string, em = 13): number {
  let w = 0;
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    w += (c >= 0x2e80 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) ? em : em * 0.55;
  }
  return w;
}

/** 根据总天数与标签像素宽选刻度步长（保证标签不重叠） */
function stepFor(maxDay: number, labelW: number): number {
  const minStep = Math.max(1, Math.ceil((labelW + 8) / DAY_PX));
  if (maxDay <= 10) return Math.max(1, minStep);
  if (maxDay <= 30) return Math.max(2, minStep);
  if (maxDay <= 80) return Math.max(5, minStep);
  if (maxDay <= 200) return Math.max(10, minStep);
  return Math.max(30, minStep);
}

/** 解析日期字符串为毫秒时间戳（支持 YYYY-MM-DD / YYYY/MM/DD） */
function parseDate(s: string): number | null {
  if (!s) return null;
  const t = s.trim().replace(/\//g, '-');
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(t);
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const n = Number(t);
  if (!Number.isNaN(n) && t !== '') return n;
  return null;
}

/** 解析工期 "5d"/"3w"/"2m" → 天数（粗略，m=30d, w=7d） */
function parseDuration(s: string): number {
  if (!s) return 1;
  const m = /^(-?\d+(?:\.\d+)?)\s*([dwmy])?/i.exec(s.trim());
  if (!m) return 1;
  const n = parseFloat(m[1]);
  const u = (m[2] || 'd').toLowerCase();
  const mult = u === 'w' ? 7 : u === 'm' ? 30 : u === 'y' ? 365 : 1;
  return Math.max(1, n * mult) || 1;
}

/** 毫秒时间戳 → "YYYY-MM-DD"（UTC） */
function fmtDate(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/** 展平任务并解析起止 */
function resolveTasks(ast: GanttAST): {
  tasks: { task: GanttTask; startDay: number; durDays: number; section: string }[];
  minT: number;
  maxDay: number;
} {
  const flat: GanttTask[] = [];
  for (const sec of ast.sections) for (const t of sec.tasks) flat.push(t);

  const times: number[] = [];
  for (const t of flat) {
    const ts = typeof t.start === 'string' ? parseDate(t.start) : (typeof t.start === 'number' ? t.start : null);
    if (ts != null) times.push(ts);
  }
  const minT = times.length ? Math.min(...times) : 0;

  const tasks: { task: GanttTask; startDay: number; durDays: number; section: string }[] = [];
  const startById = new Map<string, number>();
  for (const sec of ast.sections) {
    for (const t of sec.tasks) {
      const dur = parseDuration(String(t.duration || '1d'));
      let startDay = 0;
      const s = typeof t.start === 'string' ? t.start.trim() : String(t.start ?? '');
      const ts = parseDate(s);
      if (ts != null) {
        startDay = (ts - minT) / 86400000;
      } else {
        const afterMatch = /^after\s+(.+)$/.exec(s);
        if (afterMatch) {
          const dep = startById.get(afterMatch[1].trim());
          startDay = dep != null ? dep : 0;
        } else {
          startDay = tasks.length ? (tasks[tasks.length - 1].startDay + tasks[tasks.length - 1].durDays) : 0;
        }
      }
      startById.set(t.id, startDay + dur);
      tasks.push({ task: t, startDay, durDays: dur, section: sec.name });
    }
  }
  const maxDay = tasks.reduce((m, r) => Math.max(m, r.startDay + r.durDays), 1);
  return { tasks, minT, maxDay };
}

function sectionColor(sec: string, theme: MermaidTheme): string {
  const palette = theme.series;
  let h = 0;
  for (let i = 0; i < sec.length; i++) h = (h * 31 + sec.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

/** 映射后的节点数据 */
export interface MappedGanttNode {
  key: string;
  category: 'GLabel' | 'GBar' | 'GDate' | 'GSection' | 'GTitle' | 'GAxis' | 'GGrid';
  loc: string;
  text?: string;
  fill?: string;
  w?: number;
  h?: number;
  milestone?: boolean;
  /** 任务名单元格最大宽（超长时自动加宽左列） */
  mw?: number;
  /** 日期文本宽（用于自适应换行/避让） */
  dw?: number;
}

/** 主入口 */
export function mapGantt(ast: GanttAST, theme: MermaidTheme): { nodes: MappedGanttNode[] } {
  const nodes: MappedGanttNode[] = [];
  const { tasks, minT, maxDay } = resolveTasks(ast);
  const axisW = maxDay * DAY_PX + 20;

  // 左列宽自适应：任务名最长者决定（底线 BASE_LABEL_W，超长自动加宽）
  const labelW = Math.max(BASE_LABEL_W, tasks.reduce((m, r) => Math.max(m, textW(r.task.name, 13)), 0) + 16);
  const AXIS_X = labelW + 20;

  // 标题
  if (ast.title) nodes.push({ key: '__t', category: 'GTitle', text: ast.title, loc: `${MARGIN} 30` });

  // 时间轴刻度标签 + 网格线（步长按日期标签像素宽自适应，避免重叠）
  const dateLabelW = textW(fmtDate(minT + maxDay * 86400000), 10);
  const step = stepFor(maxDay, dateLabelW);
  for (let d = 0; d <= maxDay; d++) {
    const x = AXIS_X + d * DAY_PX;
    nodes.push({
      key: `__grid_${d}`, category: 'GGrid',
      loc: `${x} ${TOP}`, h: Math.max(ROW_H, (tasks.length + 2) * ROW_H),
    });
    if (d % step === 0) {
      nodes.push({
        key: `__tick_${d}`, category: 'GAxis', text: fmtDate(minT + d * 86400000),
        loc: `${x} ${TOP - 26}`,
      });
    }
  }

  // 任务行
  let row = 0;
  let lastSection: string | null = null;
  for (const r of tasks) {
    if (r.section && r.section !== lastSection) {
      lastSection = r.section;
      nodes.push({
        key: `__sec_${row}`, category: 'GSection', text: r.section,
        loc: `${MARGIN} ${TOP + row * ROW_H}`,
      });
      row++;
    }
    const y = TOP + row * ROW_H;
    const barX = AXIS_X + r.startDay * DAY_PX;
    const barW = Math.max(8, r.durDays * DAY_PX);
    nodes.push({
      key: `lbl_${r.task.id}_${row}`, category: 'GLabel', text: r.task.name,
      loc: `${MARGIN} ${y}`, mw: labelW,
    });
    const startDate = fmtDate(minT + r.startDay * 86400000);
    const endDate = fmtDate(minT + (r.startDay + r.durDays) * 86400000 - 1);
    const dateText = r.task.isMilestone ? `◆ ${startDate}` : `${startDate} ~ ${endDate}`;
    const dw = textW(dateText, 11);
    // 日期自适应位置：条右→条左→条下（避免与条/网格重叠）
    let dx = barX + barW + 6;
    if (dx + dw > AXIS_X + axisW + 10) {
      dx = barX - dw - 6;
      if (dx < AXIS_X) dx = AXIS_X; // 仍放不下就贴轴左，会与网格线轻微重叠但不越界
    }
    nodes.push({
      key: `dt_${r.task.id}_${row}`, category: 'GDate',
      text: dateText,
      loc: `${dx} ${y + (ROW_H - BAR_H) / 2 - 6}`,
      dw,
    });
    nodes.push({
      key: `bar_${r.task.id}_${row}`, category: 'GBar',
      loc: `${barX} ${y + (ROW_H - BAR_H) / 2}`,
      w: barW, h: BAR_H,
      milestone: r.task.isMilestone,
      fill: sectionColor(r.section, theme),
    });
    row++;
  }

  return { nodes };
}
