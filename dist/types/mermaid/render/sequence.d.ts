/**
 * sequenceDiagram 渲染器 —— 对齐官方 sequenceDiagram.html 架构：
 * - 参与者 = 生命线节点（顶部标题 + 垂直生命线，生命线为端口）
 * - 消息 = 自定义 MessageLink（继承 go.Link）：getLinkPoint 把端点精确钉在
 *   (生命线中心 ± 激活盒半宽, 消息行 Y)，getLinkDirection 控制箭头朝向，
 *   自消息画正交回环；标签用 link midLabel 自动定位到路径中点上方
 * - note / 激活盒 = 独立节点，按 DSL 行号与消息交错分配行
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { SequenceAST } from '../ast';
/**
 * 渲染时序图到 div。参与者/激活盒/note 手动定位，消息由 MessageLink 精确路由。
 */
export declare function renderSequence(divId: string, ast: SequenceAST, theme: MermaidTheme): Diagram;
