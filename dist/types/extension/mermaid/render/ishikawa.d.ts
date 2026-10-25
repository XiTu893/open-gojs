/**
 * ishikawa 渲染器 —— 只建模板 + 装配模型（数据由 mapper/ishikawa 提供，零布局数学）。
 *
 * 复刻官方 mermaid 11 ishikawa 视觉：
 *  - 骨线 stroke #333、spine/branch 宽 2、sub-branch 宽 1、fill none
 *  - 箭头 = 三角（fill #333）由 mapper 算好，附在骨线起端
 *  - 类别标签 = Auto 盒（#ECECFF 填充、#333 描边宽 2）+ 16px 文字，margin(2,20)（= 官方 bbox±20 横、±2 纵）
 *  - 原因标签 = 纯文字，anchor end（spot MiddleRight），16px
 *  - 鱼头 = 鱼头路径（#ECECFF 填充、#333 描边宽 2）+ 居中 14px/600 标签
 *  - diag.padding = 20（对标官方 applyPaddedViewBox diagramPadding）
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedIshikawaNode } from '../mapper/ishikawa';
/** 渲染 ishikawa 到 div（data = mapIshikawa 的输出） */
export declare function renderIshikawa(divId: string, data: {
    nodes: MappedIshikawaNode[];
}, theme: MermaidTheme): Diagram;
