/**
 * sankey 渲染器 —— 只建模板 + 装配模型（数据由 mapper/sankey 提供，零布局数学）。
 *
 * - 节点 = 竖条 Rectangle（w/h/fill 数据驱动）
 * - 流量 = category 'SankeyFlow' 的节点（闭合丝带轮廓填充 + 源→目标 user-space 渐变）
 * - 标签 = 侧边单行文本（side 绑定决定贴条左/右，字号 16、色 #333 对齐官方）
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { Node } from '../../../src/view/Node';
import { Shape } from '../../../src/view/Shape';
import { TextBlock } from '../../../src/view/TextBlock';
import { GraphLinksModel } from '../../../src/model/GraphLinksModel';
import { Margin } from '../../../src/core/Margin';
import { Spot } from '../../../src/core/Spot';
import { Brush } from '../../../src/core/Brush';
import { Geometry } from '../../../src/core/Geometry';
import { MermaidTheme } from '../themes';
import { MappedSankeyNode } from '../mapper/sankey';

/** 节点竖条 */
function buildBarNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = true;
  const bar = new Shape('Rectangle');
  bar.portId = '';
  bar.fill = '#1a1a1a';
  bar.stroke = 'transparent';
  bar.bind('fill', 'fill');
  bar.bind('width', 'w');
  bar.bind('height', 'h');
  node.add(bar);
  return node;
}

/** 流量：闭合丝带轮廓填充（官方等价：stroke-width=w 中心线描边 + 0.5 透明度；
 * GoJS 描边内缩 sw/2 会偏移粗带 → 改用 sw=0 填充轮廓，几何坐标即绘制坐标） */
function buildFlowNode(): Node {
  const node = new Node();
  node.locationSpot = Spot.TopLeft;
  node.selectable = false;
  const band = new Shape();
  band.portId = '';
  band.strokeWidth = 0;
  band.fill = 'transparent'; // 占位；applyFlowGradients 布局后按 gx1/gx2 装配渐变
  band.opacity = 0.5;
  // Geometry.parse(str, true)：GeoStream 默认 figure isFilled=false，须显式置真才填充
  band.bind('geometry', 'geom', (v: unknown) =>
    (typeof v === 'string' ? Geometry.parse(v, true) : null));
  node.add(band);
  return node;
}

/** 布局后给每条流量装配 user-space 填充渐变（官方 gradientUnits=userSpaceOnUse
 * x1=源条右缘 gx1、x2=目标条左缘 gx2）。丝带几何已局部化（min 角在 0,0），
 * 节点 loc 即局部原点的文档位置 → 渐变偏移 = gx - loc；填充求值于 geoRect
 * =(0,0,geoW,geoH) 局部空间，Spot 分数 0 + 偏移即可精确定位。 */
function applyFlowGradients(diag: Diagram): void {
  diag.nodes.each((n: any) => {
    const cat = n.data && n.data.category;
    if (cat !== 'SankeyFlow' || !n.data) return;
    const gx1 = n.data.gx1;
    const gx2 = n.data.gx2;
    const c = n.data.c;
    if (!Array.isArray(c) || c.length < 2) return;
    if (typeof gx1 !== 'number' || typeof gx2 !== 'number') return;
    // 找 band Shape（band 是节点内唯一 Shape）
    let band: any = null;
    n.elements.each((el: any) => {
      if (!band && el instanceof Shape) band = el;
    });
    if (!band) return;
    const loc = n.location;
    const brush = new Brush('Linear');
    brush.start = new Spot(0, 0.5, gx1 - loc.x, 0) as any;
    brush.end = new Spot(0, 0.5, gx2 - loc.x, 0) as any;
    brush.addColorStop(0, c[0] as string);
    brush.addColorStop(1, c[1] as string);
    band.fill = brush;
  });
}

/** 节点标签：官方 node-labels 字号 14；side 绑定贴条边（左半→条右，右半→条左） */
function buildLabelNode(theme: MermaidTheme): Node {
  const node = new Node();
  node.locationSpot = Spot.LeftCenter;
  node.selectable = false;
  node.bind('locationSpot', 'side', (s: unknown) =>
    s === 'left' ? Spot.RightCenter : Spot.LeftCenter);
  const tb = new TextBlock();
  // 官方 node-labels：font-size 16px、fill #333（无描边晕圈能力，跳过 #ECECFF halo）
  tb.font = `16px ${theme.fontFamily}`;
  tb.stroke = '#333333';
  tb.margin = new Margin(0);
  tb.bind('text', 'text');
  node.add(tb);
  return node;
}

/** 渲染 sankey 到 div（data = mapSankey 的输出） */
export function renderSankey(
  divId: string,
  data: { nodes: MappedSankeyNode[] },
  theme: MermaidTheme
): Diagram {
  const diag = new Diagram(divId);
  (diag as any).undoManager.isEnabled = false;

  diag.nodeTemplateMap.add('SankeyNode', buildBarNode());
  diag.nodeTemplateMap.add('SankeyFlow', buildFlowNode());
  diag.nodeTemplateMap.add('SankeyLabel', buildLabelNode(theme));

  diag.model = new GraphLinksModel({
    nodeDataArray: data.nodes as any[],
    linkDataArray: [],
  } as any);
  diag.maybeUpdate();
  applyFlowGradients(diag);
  diag.maybeUpdate();
  return diag;
}
