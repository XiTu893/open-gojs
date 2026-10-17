/**
 * gantt 渲染器 —— 手动定位的甘特图。
 *
 * - 左列任务名，右侧时间轴与任务条
 * - 解析日期（dateFormat）与工期（Nd/Nw/Nm），支持 after 依赖顺延
 * - section 分组标题
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
const TOP = 80;           // 顶部（标题+轴）
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

/** 展平任务并解析起止（返回 天数起点/工期） */
function resolveTasks(ast: GanttAST): { task: GanttTask; startDay: number; durDays: number; section: string }[] {
  // 通过 id 建立索引以支持 after
  const byId = new Map<string, GanttTask>();
  const flat: GanttTask[] = [];
  for (const sec of ast.sections) for (const t of sec.tasks) { flat.push(t); byId.set(t.id, t); }

  // 将日期转为相对天数（以最早日期为 0）
  const times: number[] = [];
  for (const t of flat) {
    const ts = typeof t.start === 'string' ? parseDate(t.start) : (typeof t.start === 'number' ? t.start : null);
    if (ts != null) times.push(ts);
  }
  const minT = times.length ? Math.min(...times) : 0;

  const out: { task: GanttTask; startDay: number; durDays: number; section: string }[] = [];
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
        // after id 或默认接续
        const afterMatch = /^after\s+(.+)$/.exec(s);
        if (afterMatch) {
          const dep = startById.get(afterMatch[1].trim());
          startDay = dep != null ? dep : 0;
        } else {
          // 无有效起点：接在前一个任务后
          startDay = out.length ? (out[out.length - 1].startDay + out[out.length - 1].durDays) : 0;
        }
      }
      startById.set(t.id, startDay);
      out.push({ task: t, startDay, durDays: dur, section: sec.name });
    }
  }
  return out;
}

/** 渲染 gantt 到 div */
export function renderGantt(divId: string, ast: GanttAST, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('GLabel', buildLabelNode(theme));
  diag.nodeTemplateMap.add('GBar', buildBarNode(theme));
  diag.nodeTemplateMap.add('GSection', buildSectionNode(theme));
  diag.nodeTemplateMap.add('GTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('GAxis', buildAxisNode(theme));

  const resolved = resolveTasks(ast);
  const nodeDataArray: any[] = [];

  // 标题
  if (ast.title) nodeDataArray.push({ key: '__t', category: 'GTitle', text: ast.title, loc: `${MARGIN} 30` });

  // 时间轴：最大天数
  const maxDay = resolved.reduce((m, r) => Math.max(m, r.startDay + r.durDays), 1);
  nodeDataArray.push({
    key: '__axis', category: 'GAxis', text: ast.axisFormat || ast.dateFormat,
    loc: `${AXIS_X} ${TOP - 28}`, w: maxDay * DAY_PX + 40,
  });

  let row = 0;
  let lastSection: string | null = null;
  for (const r of resolved) {
    // section 标题行
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
    const barW = Math.max(6, r.durDays * DAY_PX);
    // 任务名（左列）
    nodeDataArray.push({
      key: `lbl_${r.task.id}_${row}`, category: 'GLabel', text: r.task.name,
      loc: `${MARGIN} ${y}`,
    });
    // 任务条
    nodeDataArray.push({
      key: `bar_${r.task.id}_${row}`, category: 'GBar',
      loc: `${barX} ${y + (ROW_H - BAR_H) / 2}`,
      w: barW, h: r.task.isMilestone ? BAR_H : BAR_H,
      milestone: r.task.isMilestone,
      fill: sectionColor(r.section, theme),
    });
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

function buildAxisNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  // 轴线 + 标签
  const line = new Shape('Rectangle');
  line.portId = '';
  line.height = 2;
  line.fill = '#ccc';
  line.stroke = 'transparent';
  line.bind('width', 'w');
  node.add(line);
  const tb = new TextBlock();
  tb.margin = new Margin(2, 0, 0, 0);
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#888';
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