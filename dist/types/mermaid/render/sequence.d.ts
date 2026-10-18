/**
 * sequenceDiagram 渲染器 —— 手动定位（时序图布局是确定性的，非图布局）。
 *
 * - 参与者：顶部标题框 + 向下生命线（垂直面板）
 * - 消息：每条一个独立 Node（水平线 + 箭头 + 标签），不依赖 Link 路由
 * - note：独立说明框节点
 * - activate/deactivate：参与者生命线上的激活盒（跨 activate→deactivate 行范围）
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { SequenceAST } from '../ast';
/**
 * 渲染时序图到 div。全部元素手动定位（无布局）。
 */
export declare function renderSequence(divId: string, ast: SequenceAST, theme: MermaidTheme): Diagram;
