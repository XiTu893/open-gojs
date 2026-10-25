/**
 * cynefin 渲染器 —— 只建模板 + 装配模型（数据由 mapper/cynefin 提供，零布局数学）。
 *
 * - 四域底色 = 无描边矩形（fill 已含官方 .4/.95/.6 透明度）
 * - 分界线/悬崖 = geometryString 描边 Shape（波浪虚线 / 深红实线）
 * - confusion = 虚线描边椭圆；labels/subtitles = 居中文本
 * - items = 圆角条（rx4，w/h 数据驱动）；transitions = 直线 Standard 箭头
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { Link } from '../../../src/view/Link';
import { Panel } from '../../../src/view/Panel';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import { MermaidTheme } from '../themes';
import { MappedCynefinNode, MappedCynefinLink } from '../mapper/cynefin';

// 官方字号/颜色（themeVariables.cynefin 默认）
const LABEL_COLOR = '#131300';
const TEXT_COLOR = '#333333';
const BOUNDARY_W = 2;
const CLIFF_W = 4;

/** 总标题（官方 cynefinTitle：bold 18） */
function buildTitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `bold 18px ${theme.fontFamily}`;
  tb.stroke = LABEL_COLOR;
  tb.textAlign = 'center';
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 四域浅色底（无描边，fill 数据驱动） */
function buildBgNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const rect = new Shape('Rectangle');
  rect.portId = '';
  rect.fill = '#eeeeee';
  rect.stroke = 'transparent';
  rect.bind('fill', 'fill');
  rect.bind('width', 'w');
  rect.bind('height', 'h');
  node.add(rect);
  return node;
}

/** 波浪分界线（stroke #333 宽2 dash 6 3；geom = 竖+横两条子路径） */
function buildBoundaryNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const path = new Shape();
  path.portId = '';
  path.fill = '';
  path.stroke = TEXT_COLOR;
  path.strokeWidth = BOUNDARY_W;
  path.strokeDashArray = [6, 3];
  path.bind('geometryString', 'geom');
  node.add(path);
  return node;
}

/** 悬崖曲线（stroke #8B0000 宽4 实线） */
function buildCliffNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const path = new Shape();
  path.portId = '';
  path.fill = '';
  path.stroke = '#8B0000';
  path.strokeWidth = CLIFF_W;
  path.bind('geometryString', 'geom');
  node.add(path);
  return node;
}

/** confusion 椭圆（虚线描边，fill 数据驱动） */
function buildConfusionNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const e = new Shape('Ellipse');
  e.portId = '';
  e.fill = '#f3e5f5';
  e.stroke = TEXT_COLOR;
  e.strokeWidth = 1.5;
  e.strokeDashArray = [4, 2];
  e.bind('fill', 'fill');
  e.bind('width', 'w');
  e.bind('height', 'h');
  node.add(e);
  return node;
}

/** 域标签（官方 cynefinDomainLabel：bold 16 #131300，居中） */
function buildLabelNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `bold 16px ${theme.fontFamily}`;
  tb.stroke = LABEL_COLOR;
  tb.textAlign = 'center';
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 响应模式小字（官方 cynefinSubtitle：italic 11 #333，居中） */
function buildSubtitleNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.Center;
  node.selectable = false;
  const tb = new TextBlock();
  tb.font = `italic 11px ${theme.fontFamily}`;
  tb.stroke = TEXT_COLOR;
  tb.textAlign = 'center';
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** items 圆角条（官方 cynefinItem：rx4、stroke #333 宽1、text 12） */
function buildItemNode(theme: MermaidTheme, dashed: boolean): Node {
  const node = new Node('Auto');
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const bg = new Shape('RoundedRectangle');
  bg.portId = '';
  bg.parameter1 = 4;
  bg.fill = '#ffffff';
  bg.stroke = TEXT_COLOR;
  bg.strokeWidth = 1;
  if (dashed) bg.strokeDashArray = [3, 2];
  bg.bind('fill', 'fill');
  bg.bind('width', 'w');
  bg.bind('height', 'h');
  node.add(bg);
  const tb = new TextBlock();
  tb.margin = new Margin(0, ITEM_PAD_M, 0, ITEM_PAD_M);
  tb.font = `12px ${theme.fontFamily}`;
  tb.stroke = TEXT_COLOR;
  tb.textAlign = 'center';
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}
const ITEM_PAD_M = 10;

/** transitions：域中心到域中心的直线箭头 + 居中标签 */
function buildLinkTemplate(theme: MermaidTheme): Link {
  const link = new Link();
  link.routing = Link.Normal;
  link.toShortLength = 0;
  link.relinkableFrom = false;
  link.relinkableTo = false;
  link.reshapable = false;

  const path = new Shape();
  path.isPanelMain = true;
  path.stroke = TEXT_COLOR;
  path.strokeWidth = 2;
  link.add(path);

  const arrow = new Shape();
  arrow.toArrow = 'Standard';
  arrow.scale = 1;
  arrow.strokeWidth = 0;
  arrow.fill = TEXT_COLOR;
  link.add(arrow);

  const labelPanel = new Panel('Auto');
  labelPanel.visible = false;
  labelPanel.bind('visible', 'label', (l: unknown) => typeof l === 'string' && (l as string).length > 0);
  const labelText = new TextBlock();
  labelText.margin = new Margin(2, 3, 2, 3);
  labelText.font = `11px ${theme.fontFamily}`;
  labelText.stroke = TEXT_COLOR;
  labelText.bind('text', 'label');
  labelPanel.add(labelText);
  link.add(labelPanel);

  return link;
}

/** 渲染 cynefin 到 div（data = mapCynefin 的输出） */
export function renderCynefin(
  divId: string,
  data: { nodes: MappedCynefinNode[]; links: MappedCynefinLink[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('CynefinTitle', buildTitleNode(theme));
  diag.nodeTemplateMap.add('CynefinBg', buildBgNode());
  diag.nodeTemplateMap.add('CynefinBoundary', buildBoundaryNode());
  diag.nodeTemplateMap.add('CynefinCliff', buildCliffNode());
  diag.nodeTemplateMap.add('CynefinConfusion', buildConfusionNode());
  diag.nodeTemplateMap.add('CynefinLabel', buildLabelNode(theme));
  diag.nodeTemplateMap.add('CynefinSubtitle', buildSubtitleNode(theme));
  diag.nodeTemplateMap.add('CynefinItem', buildItemNode(theme, false));
  diag.nodeTemplateMap.add('CynefinItemOverflow', buildItemNode(theme, true));

  diag.linkTemplate = buildLinkTemplate(theme);

  const linkDataArray = data.links.map(l => ({
    from: l.from, to: l.to, label: l.label,
  }));
  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes as any[],
    linkDataArray,
  } as any);
  return diag;
}
