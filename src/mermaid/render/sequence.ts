/**
 * sequenceDiagram 渲染器 —— 只建模板 + 装配模型（数据由 mapper/sequence 提供）。
 *
 * - 参与者/激活盒/note 模板；消息 = MessageLink（参照官方 sequenceDiagram.html）：
 *   getLinkPoint 把端点钉在 (生命线中心 ± 激活盒半宽, seqRowY(row))，
 *   自消息画正交回环，标签用 midLabel 自动定位到路径中点上方。
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
import { MappedSequence, seqRowY, SEQ_ACT_W, SEQ_TOP_H } from '../mapper/sequence';

const LIFELINE_W = 2;   // 生命线线宽
const SELF_LOOP_W = 64; // 自消息回环宽度

/**
 * 消息连线 —— 参照官方 sequenceDiagram.html 的 MessageLink。
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
    const aw = (from ? data.fromAct : data.toAct) ? SEQ_ACT_W : 0;
    const x = op.x > p.x ? p.x + aw / 2 : p.x - aw / 2;
    out.x = x;
    out.y = seqRowY(data.row ?? 0);
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
      // 自消息：正交回环
      const p = fromNode.port.getDocumentPoint(Spot.Center);
      const y = seqRowY(data.row ?? 0);
      const aw = data.fromAct ? SEQ_ACT_W : 0;
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

/** 渲染时序图到 div（data = mapSequence 的输出） */
export function renderSequence(divId: string, data: MappedSequence, theme: MermaidTheme): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('participant', buildParticipantNode(theme, false));
  diag.nodeTemplateMap.add('actor', buildParticipantNode(theme, true));
  diag.nodeTemplateMap.add('note', buildNoteNode(theme));
  diag.nodeTemplateMap.add('activation', buildActivationNode(theme));
  diag.linkTemplate = buildMessageLinkTemplate(theme);

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes,
    linkDataArray: data.links,
  } as any);
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
  lifeline.bind('height', 'lineTo', (v: number) => v - SEQ_TOP_H);
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
  label.stroke = theme.edge.label;
  label.alignmentFocus = Spot.Bottom;
  label.segmentOffset = new Point(0, -4);
  label.bind('text', 'text');
  link.add(label);

  return link;
}

/** note 说明框节点 */
function buildNoteNode(theme: MermaidTheme): Node {
  const cs = theme.categories.note;
  const node = new Node('Auto');
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const box = new Shape('RoundedRectangle');
  box.fill = cs.fill;
  box.stroke = cs.stroke;
  box.strokeWidth = cs.strokeWidth;
  box.parameter1 = 6;
  node.add(box);
  const tb = new TextBlock();
  tb.margin = new Margin(6, 12, 6, 12);
  tb.font = `${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = cs.text;
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
  bar.width = SEQ_ACT_W;
  bar.bind('height', 'h');
  node.add(bar);
  return node;
}
