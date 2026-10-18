/**
 * sequenceDiagram 渲染器 —— 只建模板 + 装配模型（数据由 mapper/sequence 提供）。
 *
 * - 参与者/激活盒/note 模板；消息 = MessageLink（参照官方 sequenceDiagram.html）：
 *   getLinkPoint 把端点钉在 (生命线中心 ± 激活盒半宽, seqRowY(row))，
 *   自消息画正交回环，标签用 midLabel 自动定位到路径中点上方。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedSequence } from '../mapper/sequence';
/** 渲染时序图到 div（data = mapSequence 的输出） */
export declare function renderSequence(divId: string, data: MappedSequence, theme: MermaidTheme): Diagram;
