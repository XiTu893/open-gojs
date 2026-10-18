/**
 * sequenceDiagram 渲染器 —— 对齐官方 sequenceDiagram.html 架构：
 * - 参与者 = 生命线节点（顶部标题 + 垂直生命线，生命线为端口）
 * - 消息 = 自定义 MessageLink（继承 go.Link）：getLinkPoint 把端点精确钉在
 *   (生命线中心 ± 激活盒半宽, 消息行 Y)，getLinkDirection 控制箭头朝向，
 *   自消息画正交回环；标签用 link midLabel 自动定位到路径中点上方
 * - note / 激活盒 = 独立节点，按 DSL 行号与消息交错分配行
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Link } from '../../view/Link';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Panel } from '../../view/Panel';
import { GraphObject } from '../../view/GraphObject';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Point } from '../../core/Point';
import { Spot } from '../../core/Spot';
import { WrapFit, RoutingNormal, CurveNone } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { SequenceAST } from '../ast';

const COL_W = 170;      // 参与者列宽
const TOP_H = 64;       // 顶部标题区高度
const MSG_H = 48;       // 每行（消息/note）行高
const LIFELINE_W = 2;   // 生命线线宽
const ACT_W = 12;       // 激活盒宽度
const MARGIN = 40;
const SELF_LOOP_W = 64; // 自消息回环宽度

/** 参与者 X 中心 */
function colX(index: number): number {
  return MARGIN + COL_W * index + COL_W / 2;
}

/** 行中心 Y（消息线/激活起点的精确 Y） */
function rowY(row: number): number {
  return TOP_H + MSG_H * (row + 1) + MARGIN / 2;
}

/** mermaid 箭头语法 → toArrow 图形名 */
function arrowFigure(arrow: string): string {
  if (arrow.includes('x')) return 'OpenTriangleLine';
  if (arrow.includes(')')) return 'Circle';
  if (arrow.includes('>>')) return 'Triangle';
  return 'OpenTriangle';
}

/**
 * 消息连线 —— 参照官方 sequenceDiagram.html 的 MessageLink：
 * 端点 Y 精确落在消息行、激活时贴激活盒边缘、自消息正交回环。
 */
class MessageLink extends Link {
  override getLinkPoint(
    node: Node | null, port: GraphObject, spot: Spot, from: boolean, ortho: boolean,
    othernode: Node | null, otherport: GraphObject, result?: Point
  ): Point {
    const out = result !== undefined && result !== null ? result : new Point();
    const p = port.getDocumentPoint(Spot.Center);
    const op = otherport.getDocumentPoint(Spot.Center);
    const data: any = this.data ?? {};
    const aw = (from ? data.fromAct : data.toAct) ? ACT_W : 0;
    const x = op.x > p.x ? p.x + aw / 2 : p.x - aw / 2;
    out.x = x;
    out.y = rowY(data.row ?? 0);
    return out;
  }

  override getLinkDirection(
    node: Node | null, port: GraphObject | null, linkpoint: Point, spot: Spot, from: boolean,
    ortho: boolean, othernode: Node | null, otherport: GraphObject | null
  ): number {
    if (port === null || otherport === null) return 0;
    const p = port.getDocumentPoint(Spot.Center);
    const op = otherport.getDocumentPoint(Spot.Center);
    return op.x > p.x ? 0 : 180;
  }

  override computePoints(): boolean {
    const data: any = this.data ?? {};
    const fromNode = this.fromNode;
    if (fromNode !== null && fromNode === this.toNode) {
      // 自消息：正交回环（右出 → 下折 → 回到生命线）
      const p = fromNode.port.getDocumentPoint(Spot.Center);
      const y = rowY(data.row ?? 0);
      const aw = data.fromAct ? ACT_W : 0;
      const x = p.x + aw / 2;
      this.points.clear();
      this.addPoint(new Point(x, y));
      this.addPoint(new Point(x + SELF_LOOP_W, y));
      this.addPoint(new Point(x + SELF_LOOP_W, y + 10));
      this.addPoint(new Point(x, y + 10));
      return true;
    }
    return super.computePoints();
  }
}

/**
 * 渲染时序图到 div。参与者/激活盒/note 手动定位，消息由 MessageLink 精确路由。
 */
export function renderSequence(divId: string, ast: SequenceAST, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  const parts = ast.participants;
  const colIndex = new Map<string, number>();
  parts.forEach((p, i) => colIndex.set(p.id, i));

  // 按 DSL 行号把消息与 note 交错分配行（保持原始顺序）
  const rowOfMsg = new Map<number, number>();
  const rowOfNote = new Map<number, number>();
  type SeqEv = { kind: 'msg' | 'note'; idx: number; line: number };
  const events: SeqEv[] = [];
  ast.messages.forEach((m, i) => events.push({ kind: 'msg', idx: i, line: m.line }));
  ast.notes.forEach((n, i) => events.push({ kind: 'note', idx: i, line: n.line }));
  events.sort((a, b) => a.line - b.line);
  let r = 0;
  for (const ev of events) {
    if (ev.kind === 'msg') rowOfMsg.set(ev.idx, r++);
    else rowOfNote.set(ev.idx, r++);
  }
  const totalRows = Math.max(r, 1);
  const totalH = TOP_H + MSG_H * totalRows + MARGIN;

  const rowOfEvent = (ev: SeqEv): number =>
    ev.kind === 'msg' ? rowOfMsg.get(ev.idx)! : rowOfNote.get(ev.idx)!;

  diag.nodeTemplateMap.add('participant', buildParticipantNode(theme, false));
  diag.nodeTemplateMap.add('actor', buildParticipantNode(theme, true));
  diag.nodeTemplateMap.add('note', buildNoteNode(theme));
  diag.nodeTemplateMap.add('activation', buildActivationNode(theme));
  diag.linkTemplate = buildMessageLinkTemplate(theme);

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

  // 激活区间（actor → 行区间列表），并生成激活盒节点
  const actRanges = new Map<string, { startRow: number; endRow: number }[]>();
  const activeStart = new Map<string, number>();
  for (const a of ast.activations) {
    if (a.activate) {
      if (!activeStart.has(a.actor)) activeStart.set(a.actor, a.line);
    } else {
      const startLine = activeStart.get(a.actor);
      if (startLine === undefined) continue;
      activeStart.delete(a.actor);
      // 起始行 = startLine 之后第一行（消息或 note）；结束行 = a.line 之前最后一行
      let startRow = -1;
      let endRow = -1;
      for (const ev of events) {
        if (ev.line > startLine && startRow === -1) startRow = rowOfEvent(ev);
        if (ev.line < a.line) endRow = rowOfEvent(ev);
      }
      if (startRow === -1) startRow = endRow;
      if (endRow === -1) endRow = startRow;
      if (startRow < 0 || endRow < 0) continue;
      const lo = Math.min(startRow, endRow);
      const hi = Math.max(startRow, endRow);
      const list = actRanges.get(a.actor) ?? [];
      list.push({ startRow: lo, endRow: hi });
      actRanges.set(a.actor, list);
      const ci = colIndex.get(a.actor);
      if (ci === undefined) continue;
      nodeDataArray.push({
        key: `__act_${a.actor}_${a.line}`,
        category: 'activation',
        loc: `${colX(ci)} ${rowY(lo) - MSG_H / 2}`,
        h: (hi - lo + 1) * MSG_H,
      });
    }
  }

  function rowActive(actor: string, row: number): boolean {
    const rs = actRanges.get(actor);
    if (rs === undefined) return false;
    return rs.some((rr) => row >= rr.startRow && row <= rr.endRow);
  }

  // 消息 → linkDataArray（MessageLink 从 data 读 row/fromAct/toAct 精确定位）
  const linkDataArray: any[] = [];
  for (let mi = 0; mi < ast.messages.length; mi++) {
    const m = ast.messages[mi];
    if (!colIndex.has(m.from) || !colIndex.has(m.to)) continue;
    const row = rowOfMsg.get(mi)!;
    linkDataArray.push({
      key: `__msg_${mi}`,
      from: m.from,
      to: m.to,
      row,
      fromAct: rowActive(m.from, row),
      toAct: rowActive(m.to, row),
      dashed: m.arrow.startsWith('--'),
      arrow: arrowFigure(m.arrow),
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

  diag.model = new GraphLinksModel({ nodeDataArray, linkDataArray } as any);
  return diag;
}

/** 参与者节点：垂直面板 = 顶部标题框 + 向下生命线（生命线为连线端口） */
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

/** 消息连线模板：主线 + 目标端箭头 + 中点标签（贴在线上方） */
function buildMessageLinkTemplate(theme: MermaidTheme): Link {
  const stroke = theme.categories.participant.stroke;
  const link = new MessageLink();
  link.selectable = false;
  link.routing = RoutingNormal;
  link.curve = CurveNone;
  link.corner = 0;
  link.toShortLength = 0;

  const line = new Shape();
  line.isPanelMain = true;
  line.stroke = stroke;
  line.strokeWidth = 2;
  line.fill = null;
  line.bind('strokeDashArray', 'dashed', (d: boolean) => (d ? [4, 4] : null));
  link.add(line);

  const arrow = new Shape();
  arrow.toArrow = 'OpenTriangle';
  arrow.scale = 1.4;
  arrow.stroke = stroke;
  arrow.fill = stroke;
  arrow.bind('toArrow', 'arrow', (a: string) => a || 'OpenTriangle');
  link.add(arrow);

  const label = new TextBlock();
  label.margin = new Margin(2, 10, 2, 10);
  label.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  label.stroke = '#333';
  label.alignmentFocus = Spot.Bottom;
  label.segmentOffset = new Point(0, -4);
  label.bind('text', 'text');
  link.add(label);

  return link;
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
