/**
 * pie 渲染器 —— 用 GoJS `Pie` figure（parameter1=Start, parameter2=Sweep）画扇形。
 *
 * 扇形节点手动定位在圆心（重叠），右侧图例。采用高辨识度循环配色。
 */
import { Diagram } from '../../diagram/Diagram';
import { MermaidTheme } from '../themes';
import { PieAST } from '../ast';
/** 渲染 pie 到 div */
export declare function renderPie(divId: string, ast: PieAST, theme: MermaidTheme): Diagram;
