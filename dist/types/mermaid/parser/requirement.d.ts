/**
 * Mermaid requirementDiagram 语法分析器（SysML 需求图）。
 *
 * 支持：
 *  - 头行 `requirementDiagram`、方向 `direction TD|TB|BT|LR|RL`
 *  - 块声明 `requirement r1 { id: … text: … risk: … verifymethod: … }`
 *    与 `element e1 { type: … docref: … }`
 *    （functionalRequirement / interfaceRequirement 等枚举首 token 归为 requirement 节点）
 *  - 关系 `源 -类型-> 目标`，类型 ∈ contains/copies/derives/satisfies/verifies/refines/traces；
 *    反向写法 `源 <-类型- 目标` 解析为（目标 → 源）；未知类型的关系行忽略
 *  - 字段值可带引号；`%%` 注释跳过；未知行忽略；解析不抛错
 */
import { RequirementAST } from '../ast';
/** 判断是否 requirementDiagram */
export declare function isRequirement(text: string): boolean;
/** 解析 requirementDiagram DSL */
export declare function parseRequirement(src: string): RequirementAST;
