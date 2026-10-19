/**
 * flowchart AST → GoJS 模型映射。
 *
 * 把 FlowchartAST 转成 GraphLinksModel 可用的节点/连线数据：
 *  - 每个节点按形状分配 `category`（供模板取色/取形）
 *  - classDef/style 直接样式写入节点数据的 `styleProps`
 *  - subgraph 转为 GoJS Group（isGroup），组内节点带 group 字段
 *  - 连线按 kind/arrow/label 转成 from/to + 样式字段
 */
import {
  FlowchartAST, FlowNode, FlowEdge, FlowShape, FlowClassDef,
} from '../ast';

/** 供渲染模板使用的节点类别 */
export type FlowCategory =
  | ''            // 默认 process
  | 'Decision'
  | 'StartEnd'
  | 'Subroutine'
  | 'Cylinder'
  | 'Circle'
  | 'Parallelogram'
  | 'ParallelogramInv'
  | 'Hexagon'
  | 'Group'
  | 'GroupBox';

/** 由节点形状推导模板类别 */
export function categoryOfShape(shape: FlowShape): FlowCategory {
  switch (shape) {
    case 'diamond': return 'Decision';
    case 'stadium': return 'StartEnd';
    case 'subroutine': return 'Subroutine';
    case 'cylinder': return 'Cylinder';
    case 'circle': return 'Circle';
    case 'parallelogram': return 'Parallelogram';
    case 'parallelogramInv': return 'ParallelogramInv';
    case 'hexagon': return 'Hexagon';
    case 'process':
    default: return '';
  }
}

/** 映射后的节点数据（含渲染所需字段） */
export interface MappedNode {
  key: string;
  text: string;
  category: FlowCategory;
  categoryDef?: FlowClassDef;
  styleProps?: Record<string, string>;
  members?: string[]; // GroupBox：成员节点 key 列表（渲染阶段用于计算包围框）
}
/** 映射后的连线数据 */
export interface MappedLink {
  from: string;
  to: string;
  kind: FlowEdge['kind'];
  arrow: FlowEdge['arrow'];
  label?: string;
  strokeDashArray?: number[];
  strokeWidth?: number;
}

/** 映射结果 */
export interface MappedFlowchart {
  nodes: MappedNode[];
  links: MappedLink[];
  dir: FlowchartAST['dir'];
}

/** classDef 名 → 定义 */
function buildClassMap(defs: FlowClassDef[]): Map<string, FlowClassDef> {
  const m = new Map<string, FlowClassDef>();
  for (const d of defs) m.set(d.name, d);
  return m;
}

/** 连线虚线样式（dotted/dashed） */
function dashOf(kind: FlowEdge['kind']): number[] | undefined {
  if (kind === 'dotted') return [1, 3];
  if (kind === 'dashed') return [6, 4];
  return undefined;
}

/** 连线线宽 */
function widthOf(kind: FlowEdge['kind']): number {
  return kind === 'thick' ? 3 : 2;
}

/** 主入口 */
export function mapFlowchart(ast: FlowchartAST): MappedFlowchart {
  const classMap = buildClassMap(ast.classDefs);
  const nodeIds = new Set(ast.nodes.map(n => n.id));

  // 节点映射
  const nodes: MappedNode[] = [];
  for (const n of ast.nodes) {
    const category = categoryOfShape(n.shape);
    // 取第一个命中的 classDef 作为整体配色覆盖
    let catDef: FlowClassDef | undefined;
    if (n.style?.length) {
      for (const cn of n.style) {
        if (classMap.has(cn)) { catDef = classMap.get(cn); break; }
      }
    }
    const mn: MappedNode = {
      key: n.id,
      text: n.text || n.id,
      category,
      categoryDef: catDef,
      styleProps: n.styleProps,
    };
    nodes.push(mn);
  }

  // subgraph → 静态背景框节点（非 GoJS Group 嵌套 —— 避免 LayeredDigraphLayout 在
  // 组成员↔组外连线上进入 update 死循环）。members 供渲染阶段定位用。
  for (const sg of ast.subgraphs) {
    const members = sg.nodes.filter(id => nodeIds.has(id));
    if (!members.length) continue;
    nodes.push({
      key: sg.id,
      text: sg.title || sg.id,
      category: 'GroupBox',
      members,
    });
  }

  // 连线映射
  const links: MappedLink[] = [];
  for (const e of ast.edges) {
    // 端点必须存在（解析时已保证，但双保险）
    if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) continue;
    const link: MappedLink = {
      from: e.from,
      to: e.to,
      kind: e.kind,
      arrow: e.arrow,
      label: e.label,
      strokeDashArray: dashOf(e.kind),
      strokeWidth: widthOf(e.kind),
    };
    // linkStyle 覆盖
    const ls = ast.linkStyles?.[ast.edges.indexOf(e)];
    if (ls?.stroke) (link as any).stroke = ls.stroke;
    links.push(link);
  }

  return { nodes, links, dir: ast.dir };
}