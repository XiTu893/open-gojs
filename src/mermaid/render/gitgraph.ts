/**
 * gitgraph 渲染器 —— 只建模板 + 装配模型（数据由 mapper/gitgraph 提供，零布局数学）。
 *
 * - commit = 小 Ellipse 圆点（fill 由数据驱动）+ 下方 id·label 文本
 * - 分支标签粗体；连线 = 正交折线（merge 线加粗），无箭头
 */
import { Diagram } from '../../diagram/Diagram';
import { Node } from '../../view/Node';
import { Shape } from '../../view/Shape';
import { TextBlock } from '../../view/TextBlock';
import { Link } from '../../view/Link';
import { GraphLinksModel } from '../../model/GraphLinksModel';
import { Margin } from '../../core/Margin';
import { Spot } from '../../core/Spot';
import {
  WrapFit,
  RoutingOrthogonal,
  CurveNone,
} from '../../core/EnumValues';
import { MermaidTheme } from '../themes';
import { MappedGitGraphNode, MappedGitLink } from '../mapper/gitgraph';

/** commit 圆点 */
function buildDotNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = true;
  const dot = new Shape('Ellipse');
  dot.portId = '';
  dot.fill = '#1a1a1a';
  dot.stroke = '#000000';
  dot.strokeWidth = 1;
  dot.bind('fill', 'fill');
  dot.bind('width', 'w');
  dot.bind('height', 'h');
  node.add(dot);
  return node;
}

/** commit 标签（id · label） */
function buildTextLabelNode(theme: MermaidTheme, bold = false): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `${bold ? 'bold ' : ''}${theme.fontSize.label}px ${theme.fontFamily}`;
  tb.stroke = '#222222';
  tb.textAlign = 'center';
  tb.wrap = WrapFit;
  tb.margin = new Margin(1, 4, 1, 4);
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 连线：正交折线，merge 线更粗（无箭头） */
function buildLinkTemplate(theme: MermaidTheme): Link {
  const link = new Link();
  link.routing = RoutingOrthogonal;
  link.curve = CurveNone;
  link.corner = 10;
  link.relinkableFrom = false;
  link.relinkableTo = false;
  link.reshapable = false;
  link.selectionAdorned = true;

  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = theme.edge.solid;
  path.strokeWidth = 2;
  path.bind('strokeWidth', 'kind', (k: string) => (k === 'merge' ? 3.5 : 2));
  link.add(path);
  return link;
}

/** 渲染 gitgraph 到 div（data = mapGitGraph 的输出） */
export function renderGitGraph(
  divId: string,
  data: { nodes: MappedGitGraphNode[]; links: MappedGitLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('GitDot', buildDotNode());
  diag.nodeTemplateMap.add('GitText', buildTextLabelNode(theme));
  diag.nodeTemplateMap.add('GitBranchLabel', buildTextLabelNode(theme, true));

  diag.linkTemplate = buildLinkTemplate(theme);

  const linkDataArray = data.links.map(l => ({ from: l.from, to: l.to, kind: l.kind }));
  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes as any[],
    linkDataArray,
  } as any);
  return diag;
}
