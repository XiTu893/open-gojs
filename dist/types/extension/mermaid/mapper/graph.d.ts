/**
 * class/state/er AST → GraphRenderData 映射（供 render/graph.ts 渲染）。
 */
import { ClassAST, StateAST, ErAST } from '../ast';
import { GraphRenderData } from '../render/graph';
/** classDiagram AST → 通用图数据 */
export declare function mapClass(ast: ClassAST): GraphRenderData;
/** stateDiagram AST → 通用图数据 */
export declare function mapState(ast: StateAST): GraphRenderData;
/** erDiagram AST → 通用图数据（实体带属性列表，PK 标记；基数记号贴连线两端） */
export declare function mapEr(ast: ErAST): GraphRenderData;
