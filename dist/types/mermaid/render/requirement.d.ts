/**
 * requirementDiagram 渲染器 —— 只建模板 + 装配模型（数据由 mapper/requirement 提供）。
 *
 * 节点：'Requirement'/'Element' 均为 Auto 包矩形 + 单个多行 TextBlock（WrapNone），
 * 形状 fromSpot/toSpot 按方向（TD/BT=Bottom/Top，LR/RL=Right/Left）。
 * 连线：正交路由 + Standard 箭头 + 中点标签（visible 由 label 控制）。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedRequirementNode, MappedRequirementLink } from '../mapper/requirement';
/** 渲染 requirementDiagram 到 div（data = mapRequirement 的输出） */
export declare function renderRequirement(divId: string, data: {
    nodes: MappedRequirementNode[];
    links?: MappedRequirementLink[];
    dir?: string;
}, theme: MermaidTheme): Diagram;
