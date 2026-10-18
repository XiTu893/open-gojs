/**
 * gantt 渲染器 —— 手动定位的甘特图。
 *
 * - 左列任务名，右侧时间轴与任务条
 * - 解析日期（dateFormat）与工期（Nd/Nw/Nm），支持 after 依赖顺延
 * - section 分组标题
 * - 时间轴：每天一根网格线 + 日期刻度标签；任务条旁显示起止日期
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Size } from '../../core/Size';
import { Spot } from '../../core/Spot';
import { MermaidTheme } from '../themes';
import { GanttAST, GanttTask } from '../ast';

const LABEL_W = 220;      // 左列宽
const AXIS_X = LABEL_W + 20;
const ROW_H = 30;
const TOP = 96;           // 顶部（标题+轴）
const BAR_H = 18;
const DAY_PX = 40;        // 每天像素
const MARGIN = 20;

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

/** 根据总天数选择日期刻度步长（避免标签重叠） */
function stepFor(maxDay: number): number {
  if (maxDay <= 10) return 1;
  if (maxDay <= 30) return 2;
  if (maxDay <= 80) return 5;
  if (maxDay <= 200) return 10;
  return 30;
}

/** 展平任务并解析起止（返回 天数起点/工期/最小时间戳） */
function resolveTasks(ast: GanttAST): { tasks: { task: GanttTask; startDay: number; durDays: number; section: string }[]; minT: number; maxDay: number } {
  const byId = new Map<string, GanttTask>();
  const flat: GanttTask[] = [];
  for (const sec of ast.sections) for (const t of sec.tasks) { flat.push(t); byId.set(t.id, t); }

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
      startById.set(t.id, startDay);
      tasks.push({ task: t, startDay, durDays: dur, section: sec.name });
    }
  }
  const maxDay = tasks.reduce((m, r) => Math.max(m, r.startDay + r.durDays), 1);
  return { tasks, minT, maxDay };
}

/** 渲染 gantt 到 div */
export function renderGantt(divId: string, ast: GanttAST, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('GLabel', buildLabelNode(theme));
  diag.nodeTemplateMap.add('GBar', buildBarNode(theme));
  diag.nodeTemplateMap.add('GDate', buildDateNode(theme));
  diag.nodeTemplateMap.add('GSection', buildSectionNode(theme));
  diag.nodeTemplateMap.add('GTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('GAxis', buildAxisNode(theme));
  diag.nodeTemplateMap.add('GGrid', buildGridNode(theme));

  const { tasks, minT, maxDay } = resolveTasks(ast);
  const nodeDataArray: any[] = [];
  const axisW = maxDay * DAY_PX + 20;

  // 标题
  if (ast.title) nodeDataArray.push({ key: '__t', category: 'GTitle', text: ast.title, loc: `${MARGIN} 30` });

  // 时间轴刻度标签 + 网格线
  const step = stepFor(maxDay);
  for (let d = 0; d <= maxDay; d++) {
    const x = AXIS_X + d * DAY_PX;
    // 竖向网格线（贯穿整张图）
    nodeDataArray.push({
      key: `__grid_${d}`, category: 'GGrid',
      loc: `${x} ${TOP}`, h: Math.max(ROW_H, (tasks.length + 2) * ROW_H),
    });
    if (d % step === 0) {
      nodeDataArray.push({
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
      nodeDataArray.push({
        key: `__sec_${row}`, category: 'GSection', text: r.section,
        loc: `${MARGIN} ${TOP + row * ROW_H}`,
      });
      row++;
    }
    const y = TOP + row * ROW_H;
    const barX = AXIS_X + r.startDay * DAY_PX;
    const barW = Math.max(8, r.durDays * DAY_PX);
    // 任务名（左列）
    nodeDataArray.push({
      key: `lbl_${r.task.id}_${row}`, category: 'GLabel', text: r.task.name,
      loc: `${MARGIN} ${y}`,
    });
    // 任务条
    const startDate = fmtDate(minT + r.startDay * 86400000);
    const endDate = fmtDate(minT + (r.startDay + r.durDays) * 86400000 - 1);
    nodeDataArray.push({
      key: `bar_${r.task.id}_${row}`, category: 'GBar',
      loc: `${barX} ${y + (ROW_H - BAR_H) / 2}`,
      w: barW, h: BAR_H,
      milestone: r.task.isMilestone,
      fill: sectionColor(r.section, theme),
    });
    // 任务起止日期（条右侧或里程碑上方）
    if (!r.task.isMilestone) {
      nodeDataArray.push({
        key: `dt_${r.task.id}_${row}`, category: 'GDate',
        text: `${startDate} ~ ${endDate}`,
        loc: `${Math.min(barX + barW + 6, AXIS_X + axisW + 10)} ${y + (ROW_H - BAR_H) / 2 - 6}`,
      });
    } else {
      nodeDataArray.push({
        key: `dt_${r.task.id}_${row}`, category: 'GDate',
        text: `◆ ${startDate}`,
        loc: `${barX + barW + 6} ${y + (ROW_H - BAR_H) / 2 - 6}`,
      });
    }
    row++;
  }

  diag.model = new GraphLinksModel({ nodeDataArray, linkDataArray: [] } as any);
  return diag;
}

function sectionColor(sec: string, theme: MermaidTheme): string {
  const palette = ['#4f6df5', '#2f9e44', '#f5a623', '#9b6bf5', '#1c9ad6', '#e05b8d'];
  let h = 0;
  for (let i = 0; i < sec.length; i++) h = (h * 31 + sec.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function buildLabelNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.margin = new Margin(6, 8, 6, 8);
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#333';
  tb.maxSize = new Size(LABEL_W - 16, NaN);
  node.add(tb);
  (tb as any).bind('text', 'text');
  return node;
}

function buildBarNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const bar = new Shape('RoundedRectangle');
  bar.portId = '';
  bar.parameter1 = 4;
  bar.fill = '#4f6df5';
  bar.stroke = 'transparent';
  bar.bind('fill', 'fill');
  bar.bind('width', 'w');
  bar.bind('height', 'h');
  node.add(bar);
  return node;
}

/** 任务日期文本节点 */
function buildDateNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${theme.fontSize.label - 1}px ${theme.fontFamily}`;
  tb.stroke = '#777';
  node.add(tb);
  (tb as any).bind('text', 'text');
  return node;
}

function buildSectionNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.margin = new Margin(4, 8, 4, 8);
  tb.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.stroke = '#222';
  node.add(tb);
  (tb as any).bind('text', 'text');
  return node;
}

function buildTitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `bold ${theme.fontSize.title}px ${theme.fontFamily}`;
  tb.stroke = '#222';
  node.add(tb);
  (tb as any).bind('text', 'text');
  return node;
}

/** 时间轴刻度标签节点（竖线 + 日期文本） */
function buildAxisNode(theme: MermaidTheme): Node {
  const node = new Node('Vertical');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const tb = new TextBlock();
  tb.textAlign = 'center';
  tb.font = `${theme.fontSize.label - 1}px ${theme.fontFamily}`;
  tb.stroke = '#888';
  node.add(tb);
  (tb as any).bind('text', 'text');
  return node;
}

/** 竖向网格线节点 */
function buildGridNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const line = new Shape('Rectangle');
  line.portId = '';
  line.width = 1;
  line.fill = '#e3e6eb';
  line.stroke = 'transparent';
  line.bind('height', 'h');
  node.add(line);
  return node;
}