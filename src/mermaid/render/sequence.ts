/**
 * sequenceDiagram 渲染器 —— 手动定位（时序图布局是确定性的，非图布局）。
 *
 * - 参与者作为顶部标题节点，向下画生命线
 * - 消息按行递增 Y，画水平箭头（含激活盒）
 * - note 画在对应 Y 的浅色说明框
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Panel } from '../../view/Panel';
import { Link } from '../../view/Link';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Point } from '../../core/Point';
import { Size } from '../../core/Size';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import { WrapFit, RoutingNone, CurveNone } from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { SequenceAST } from '../ast';

const COL_W = 160;      // 参与者列宽
const TOP_H = 60;       // 顶部标题高度
const MSG_H = 44;       // 每条消息行高
const LIFELINE_W = 2;   // 生命线线宽
const ACT_W = 14;       // 激活盒宽度
const MARGIN = 40;

/** 参与者 X 中心 */
function colX(index: number): number {
  return MARGIN + COL_W * index + COL_W / 2;
}

/**
 * 渲染时序图到 div。
 * 采用"参与者节点 + 手动 Link points"的方式：生命线由参与者节点内的长条 Shape 承担，
 * 消息用 Link 设定固定 points 连接两个参与者节点。
 */
export function renderSequence(divId: string, ast: SequenceAST, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  const parts = ast.participants;
  const colIndex = new Map<string, number>();
  parts.forEach((p, i) => colIndex.set(p.id, i));

  // 计算总行数（消息 + note）
  const totalRows = ast.messages.length + ast.notes.length;
  const totalH = TOP_H + MSG_H * Math.max(totalRows, 1) + MARGIN;

  // 节点模板：参与者（顶部标题 + 生命线）
  diag.nodeTemplateMap.add('participant', buildParticipantNode(theme, false));
  diag.nodeTemplateMap.add('actor', buildParticipantNode(theme, true));

  // 模型：每个参与者一个节点，带 loc
  const nodeDataArray: any[] = [];
  for (const p of parts) {
    const x = colX(colIndex.get(p.id)!);
    nodeDataArray.push({
      key: p.id,
      text: p.alias,
      category: p.type,
      loc: `${x} ${TOP_H / 2 + MARGIN / 2}`,
      lineTo: totalH - MARGIN / 2, // 生命线底部 Y
    });
  }

  // 消息：Link，手动 points
  const linkDataArray: any[] = [];
  let row = 0;
  for (let mi = 0; mi < ast.messages.length; mi++) {
    const m = ast.messages[mi];
    const fi = colIndex.get(m.from);
    const ti = colIndex.get(m.to);
    if (fi === undefined || ti === undefined) continue;
    const y = TOP_H + MSG_H * (row + 1) + MARGIN / 2;
    const x1 = colX(fi);
    const x2 = colX(ti);
    const forward = x2 >= x1;
    linkDataArray.push({
      from: m.from,
      to: m.to,
      label: m.label,
      // 手动点：从生命线到生命线
      points: `${x1} ${y} ${x2} ${y}`,
      dashed: m.arrow.startsWith('--'),
      open: m.arrow.includes('x') || m.arrow.includes(')'),
      arrowEnd: !m.arrow.includes('x'),
    });
    row++;
  }

  diag.model = new GraphLinksModel({ nodeDataArray, linkDataArray } as any);

  // note 作为独立节点（无连线），手动 loc
  const noteNodeData: any[] = [];
  let nrow = ast.messages.length;
  for (const nt of ast.notes) {
    if (nt.kind !== 'note') continue;
    const actors = nt.actors ?? [];
    let cx = colX(parts.length - 1);
    if (actors.length) {
      const idxs = actors.map(a => colIndex.get(a)).filter(v => v !== undefined) as number[];
      if (idxs.length) cx = (colX(Math.min(...idxs)) + colX(Math.max(...idxs))) / 2;
    }
    const y = TOP_H + MSG_H * (nrow + 1) + MARGIN / 2;
    noteNodeData.push({
      key: `__note_${nrow}`,
      text: nt.text ?? '',
      category: 'note',
      loc: `${cx} ${y}`,
    });
    nrow++;
  }
  if (noteNodeData.length) {
    // 追加 note 节点到模型
    const model = diag.model as GraphLinksModel;
    model.commit((m: any) => {
      for (const nd of noteNodeData) m.addNodeData(nd);
    }, 'add notes');
  }

  return diag;
}

/** 参与者节点模板：顶部方框 + 向下生命线 */
function buildParticipantNode(theme: MermaidTheme, isActor: boolean): Node {
  const cs = theme.categories.participant;
  const node = new Node('Spot');
  node.locationSpot = Spot.Top;
  node.selectable = true;

  // 生命线（从标题底部向下延伸）
  const lifeline = new Shape('Rectangle');
  lifeline.portId = '';
  lifeline.fill = cs.stroke;
  lifeline.stroke = 'transparent';
  lifeline.width = LIFELINE_W;
  lifeline.alignment = Spot.Top;
  lifeline.alignmentFocus = Spot.Top;
  // 高度由 loc + lineTo 决定：用绑定让高度自适应
  node.add(lifeline);

  // 顶部标题框
  const header = new Panel('Auto');
  header.alignment = Spot.Top;
  header.alignmentFocus = Spot.Top;
  const box = new Shape(isActor ? 'Rectangle' : 'RoundedRectangle');
  box.fill = cs.fill;
  box.stroke = cs.stroke;
  box.strokeWidth = cs.strokeWidth;
  box.parameter1 = 4;
  header.add(box);
  const tb = new TextBlock();
  tb.margin = new Margin(6, 12, 6, 12);
  tb.font = `bold ${theme.fontSize.node}px ${theme.fontFamily}`;
  tb.stroke = cs.text;
  tb.wrap = WrapFit;
  tb.bind('text', 'text');
  header.add(tb);
  node.add(header);

  return node;
}