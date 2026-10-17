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
    return {
      from: r.from,
      to: r.to,
      label: r.label,
      toArrow: a.toArrow,
      hollowTo: a.hollow,
      dashed: a.dashed,
    };
  });
  return { nodes, links, direction: 'down' };
}

/** stateDiagram AST → 通用图数据 */
export function mapState(ast: StateAST): GraphRenderData {
  const nodes: GraphNodeData[] = ast.states.map(s => ({
    key: s.id,
    title: s.id === '[*]' ? '●' : s.label,
    category: 'State',
    // 起止态用小圆点/深色区分
    fill: s.id === '[*]' ? '#2f9e44' : undefined,
  }));
  const links: GraphLinkData[] = ast.transitions.map(t => ({
    from: t.from,
    to: t.to,
    label: t.label,
    toArrow: 'Standard',
    hollowTo: false,
  }));
  return { nodes, links, direction: 'down' };
}

/** erDiagram AST → 通用图数据（实体带属性列表） */
export function mapEr(ast: ErAST): GraphRenderData {
  const nodes: GraphNodeData[] = ast.entities.map(e => {
    const members = e.attrs.map(a => `${a.type ? a.type + ' ' : ''}${a.name}${a.isKey ? ' 🔑' : ''}`);
    return { key: e.name, title: e.name, members, category: 'Entity' };
  });
  const links: GraphLinkData[] = ast.relations.map(r => ({
    from: r.from,
    to: r.to,
    label: r.label || `${r.fromCard || ''} ${r.toCard || ''}`.trim() || undefined,
    toArrow: 'Standard',
    hollowTo: false,
  }));
  return { nodes, links, direction: 'right' };
}