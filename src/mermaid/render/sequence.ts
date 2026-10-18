/**
 * sequenceDiagram 渲染器 —— 手动定位（时序图布局是确定性的，非图布局）。
 *
 * - 参与者：顶部标题框 + 向下生命线（垂直面板）
 * - 消息：每条一个独立 Node（水平线 + 箭头 + 标签），不依赖 Link 路由
 * - note：独立说明框节点
 * - activate/deactivate：参与者生命线上的激活盒（跨 activate→deactivate 行范围）
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Panel } from '../../view/Panel';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import { WrapFit } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { SequenceAST } from '../ast';

const COL_W = 170;      // 参与者列宽
const TOP_H = 64;       // 顶部标题区高度
const MSG_H = 48;       // 每条消息行高
const LIFELINE_W = 2;   // 生命线线宽
const ACT_W = 12;       // 激活盒宽度
const MARGIN = 40;

/** 参与者 X 中心 */
function colX(index: number): number {
  return MARGIN + COL_W * index + COL_W / 2;
}

/**
 * 渲染时序图到 div。全部元素手动定位（无布局）。
 */
export function renderSequence(divId: string, ast: SequenceAST, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  const parts = ast.participants;
  const colIndex = new Map<string, number>();
  parts.forEach((p, i) => colIndex.set(p.id, i));

  const totalRows = ast.messages.length + ast.notes.length;
  const totalH = TOP_H + MSG_H * Math.max(totalRows, 1) + MARGIN;

  diag.nodeTemplateMap.add('participant', buildParticipantNode(theme, false));
  diag.nodeTemplateMap.add('actor', buildParticipantNode(theme, true));
  diag.nodeTemplateMap.add('message', buildMessageNode(theme));
  diag.nodeTemplateMap.add('note', buildNoteNode(theme));
  diag.nodeTemplateMap.add('activation', buildActivationNode(theme));

  const nodeDataArray: any[] = [];

  // 参与者
  for (const p of parts) {
    const x = colX(colIndex.get(p.id)!);
    nodeDataArray.push({
      key: p.id,
      text: p.alias,
      category: p.type,
      loc: `${x} ${MARGIN}`,
      lineTo: totalH,
    });
  }

  // 行号分配：先全部消息行，再 note 行
  const rowOfMsg = new Map<number, number>();
  const rowOfNote = new Map<number, number>();
  let r = 0;
  for (let mi = 0; mi < ast.messages.length; mi++) rowOfMsg.set(mi, r++);
  for (let ni = 0; ni < ast.notes.length; ni++) rowOfNote.set(ni, r++);

  function rowY(row: number): number {
    return TOP_H + MSG_H * (row + 1) + MARGIN / 2;
  }

  // 激活盒：activate/deactivate 按行顺序穿插，跨度内画竖条
  const activeStack = new Map<string, number>();
  const actNodes: any[] = [];
  const events: { r: number; type: 'm' | 'a'; mi?: number; a?: any }[] = [];
  for (let mi = 0; mi < ast.messages.length; mi++) events.push({ r: rowOfMsg.get(mi)!, type: 'm', mi });
  // 激活事件排在消息之后（DSL 顺序近似：直接放在所有消息行后）
  let er = ast.messages.length;
  for (const a of ast.activations) events.push({ r: er++, type: 'a', a });
  for (const ev of events) {
    if (ev.type === 'm') continue;
    const a = ev.a;
    const ci = colIndex.get(a.actor);
    if (ci === undefined) continue;
    if (a.activate) {
      if (!activeStack.has(a.actor)) activeStack.set(a.actor, ev.r);
    } else {
      const stRow = activeStack.get(a.actor);
      if (stRow !== undefined) {
        activeStack.delete(a.actor);
        const span = Math.max(1, ev.r - stRow) * MSG_H;
        actNodes.push({
          key: `__act_${a.actor}_${ev.r}`,
          category: 'activation',
          loc: `${colX(ci)} ${rowY(Math.min(stRow, ev.r)) - span / 2}`,
          h: span,
        });
      }
    }
  }
  for (const nd of actNodes) nodeDataArray.push(nd);

  // 消息节点
  for (let mi = 0; mi < ast.messages.length; mi++) {
    const m = ast.messages[mi];
    const fi = colIndex.get(m.from);
    const ti = colIndex.get(m.to);
    if (fi === undefined || ti === undefined) continue;
    const x1 = colX(fi);
    const x2 = colX(ti);
    nodeDataArray.push({
      key: `__msg_${mi}`,
      category: 'message',
      loc: `${Math.min(x1, x2)} ${rowY(rowOfMsg.get(mi)!)}`,
      w: Math.max(24, Math.abs(x2 - x1)),
      reverse: x2 < x1,
      dashed: m.arrow.startsWith('--'),
      open: m.arrow.includes('x') || m.arrow.includes(')'),
      text: m.label,
      stroke: theme.categories.participant.stroke,
    });
  }

  // note 节点
  for (let ni = 0; ni < ast.notes.length; ni++) {
    const nt = ast.notes[ni];
    if (nt.kind !== 'note') continue;
    const actors = nt.actors ?? [];
    let cx = colX(parts.length - 1);
    if (actors.length) {
      const idxs = actors.map((a) => colIndex.get(a)).filter((v) => v !== undefined) as number[];
      if (idxs.length) cx = (colX(Math.min(...idxs)) + colX(Math.max(...idxs))) / 2;
    }
    nodeDataArray.push({
      key: `__note_${ni}`,
      category: 'note',
      text: nt.text ?? '',
      loc: `${cx} ${rowY(rowOfNote.get(ni)!)}`,
    });
  }

  diag.model = new GraphLinksModel({ nodeDataArray, linkDataArray: [] } as any);
  return diag;
}

/** 参与者节点：垂直面板 = 顶部标题框 + 向下生命线 */
function buildParticipantNode(theme: MermaidTheme, isActor: boolean): Node {
  const cs = theme.categories.participant;
  const node = new Node('Vertical');
  node.locationSpot = Spot.Top;
  node.selectable = true;

  const header = new Panel('Auto');
  const box = new Shape(isActor ? 'Rectangle' : 'RoundedRectangle');
  box.fill = cs.fill;
  box.stroke = cs.stroke;
  box.strokeWidth = cs.strokeWidth;
  box.parameter1 = 5;
  header.add(box);
  const tb = new TextBlock();
  tb.margin = new Margin(6, 14, 6, 14);
  tb.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.stroke = cs.text;
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  header.add(tb);
  node.add(header);

  const lifeline = new Shape('Rectangle');
  lifeline.portId = '';
  lifeline.fill = cs.stroke;
  lifeline.stroke = 'transparent';
  lifeline.width = LIFELINE_W;
  lifeline.bind('height', 'lineTo', (v: number) => v - TOP_H);
  node.add(lifeline);
  return node;
}

/** 消息节点：Table 面板 = 标签行(上方) + 箭头+线行(下方)。箭头按方向放目标端 */
function buildMessageNode(theme: MermaidTheme): Node {
  const stroke = theme.categories.participant.stroke;
  const node = new Node('Table', { locationSpot: Spot.Left } as any);
  node.selectable = true;
  const ARR = 12; // 箭头区域宽

  // 标签：占满整行，垂直顶部，文字居中
  const label = new TextBlock();
  label.row = 0;
  label.column = 0;
  label.columnSpan = 3;
  label.textAlign = 'center';
  label.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  label.stroke = '#333';
  label.margin = new Margin(0, 8, 4, 8);
  label.wrap = WrapFit;
  label.bind('text', 'text');
  node.add(label);

  // 左箭头（反向时显示，指左）
  const arrowL = new Shape('Triangle');
  arrowL.row = 1;
  arrowL.column = 0;
  arrowL.width = ARR;
  arrowL.height = 10;
  arrowL.fill = stroke;
  arrowL.angle = 180;
  arrowL.bind('visible', 'reverse', (r: boolean) => !!r);
  node.add(arrowL);

  // 主线（中间列）
  const line = new Shape('Rectangle');
  line.row = 1;
  line.column = 1;
  line.portId = '';
  line.fill = stroke;
  line.stroke = 'transparent';
  line.height = 2;
  line.bind('width', 'w', (w: number) => Math.max(0, w - 2 * ARR));
  line.bind('fill', 'stroke');
  line.bind('strokeDashArray', 'dashed', (d: boolean) => (d ? [4, 4] : null));
  node.add(line);

  // 右箭头（正向显示，指右）
  const arrowR = new Shape('Triangle');
  arrowR.row = 1;
  arrowR.column = 2;
  arrowR.width = ARR;
  arrowR.height = 10;
  arrowR.fill = stroke;
  arrowR.angle = 0;
  arrowR.bind('visible', 'reverse', (r: boolean) => !r);
  node.add(arrowR);

  return node;
}

/** note 说明框节点 */
function buildNoteNode(theme: MermaidTheme): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const box = new Shape('RoundedRectangle');
  box.fill = '#fff8dc';
  box.stroke = '#d9b84a';
  box.strokeWidth = 1;
  box.parameter1 = 6;
  node.add(box);
  const tb = new TextBlock();
  tb.margin = new Margin(6, 12, 6, 12);
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#5a4a12';
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 激活盒节点：参与者生命线上的窄竖条 */
function buildActivationNode(theme: MermaidTheme): Node {
  const node = new Node('Spot');
  node.locationSpot = Spot.Top;
  node.selectable = false;
  const bar = new Shape('Rectangle');
  bar.fill = theme.categories.participant.fill;
  bar.stroke = theme.categories.participant.stroke;
  bar.strokeWidth = 1;
  bar.width = ACT_W;
  bar.bind('height', 'h');
  node.add(bar);
  return node;
}