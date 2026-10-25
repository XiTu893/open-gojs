/**
 * class/state/er AST → GraphRenderData 映射（供 render/graph.ts 渲染）。
 */
import { ClassAST, StateAST, ErAST } from '../ast';
import { GraphRenderData, GraphNodeData, GraphLinkData, relationArrow } from '../render/graph';

/** classDiagram AST → 通用图数据 */
export function mapClass(ast: ClassAST): GraphRenderData {
  const nodes: GraphNodeData[] = ast.classes.map(c => {
    const members = c.members.map(m => {
      const vis = m.visibility || '';
      return vis + m.text;
    });
    const memberKind = c.members.map(m => (m.isMethod ? 'method' : 'field') as 'field' | 'method');
    return { key: c.name, title: c.name, members, memberKind, category: 'Class' };
  });
  const links: GraphLinkData[] = ast.relations.map(r => {
    const a = relationArrow(r.kind);
    // 继承 `<|--`：parser 已把 base(父类) 放到 to 端；官方布局父类在上（TB），
    // 故翻转让 base 作为 from（布局靠前），空心三角画在 base 端。
    // 依赖 `..>`、实现 `..|>` 等箭头在右、base 在左，不翻转（保持 from=base 在上）。
    if (r.kind === 'inheritance') {
      return {
        from: r.to, to: r.from, label: r.label,
        fromArrow: a.toArrow, hollowFrom: a.hollow, dashed: a.dashed,
      };
    }
    return {
      from: r.from, to: r.to, label: r.label,
      toArrow: a.toArrow, hollowTo: a.hollow, dashed: a.dashed,
    };
  });
  return { nodes, links, direction: 'down' };
}

/** stateDiagram AST → 通用图数据 */
export function mapState(ast: StateAST): GraphRenderData {
  const nodes: GraphNodeData[] = [];
  const keyOf = new Map<string, string>(); // 原状态 id → 渲染节点 key
  // 官方：`[*]` 起点/终点各画一个独立小圆（按实际连出/连入决定，避免孤立圆）。
  const hasStart = ast.transitions.some(t => t.from === '[*]');
  const hasEnd = ast.transitions.some(t => t.to === '[*]');
  for (const s of ast.states) {
    if (s.id === '[*]') continue;
    keyOf.set(s.id, s.id);
    nodes.push({ key: s.id, title: s.label, category: 'State' });
  }
  if (hasStart) nodes.unshift({ key: '__start', title: '', category: 'StateStart', fill: '#1f2937' });
  if (hasEnd) nodes.push({ key: '__end', title: '', category: 'StateEnd', fill: '#1f2937' });
  const links: GraphLinkData[] = ast.transitions.map(t => ({
    from: t.from === '[*]' ? '__start' : (keyOf.get(t.from) ?? t.from),
    to: t.to === '[*]' ? '__end' : (keyOf.get(t.to) ?? t.to),
    label: t.label,
    toArrow: 'Standard',
    hollowTo: false,
  }));
  return { nodes, links, direction: 'down' };
}

/** erDiagram AST → 通用图数据（实体带属性列表，PK 标记；基数记号贴连线两端） */
export function mapEr(ast: ErAST): GraphRenderData {
  const nodes: GraphNodeData[] = ast.entities.map(e => {
    const members = e.attrs.map(a => `${a.type ? a.type + ' ' : ''}${a.name}${a.isKey ? ' 🔑' : ''}`);
    const memberKey = e.attrs.map(a => !!a.isKey);
    return { key: e.name, title: e.name, members, memberKey, category: 'Entity' };
  });
  const links: GraphLinkData[] = ast.relations.map(r => ({
    from: r.from,
    to: r.to,
    label: r.label || undefined,
    // er 无箭头：两端用基数记号面板（见 render/graph.ts buildCardMarker）
    fromCard: r.fromCard || undefined,
    toCard: r.toCard || undefined,
    // 官方 relationshipLine 近黑
    stroke: '#333333',
  }));
  return { nodes, links, direction: 'down' };
}