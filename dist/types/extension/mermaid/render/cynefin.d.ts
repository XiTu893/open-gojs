/**
 * cynefin 渲染器 —— 只建模板 + 装配模型（数据由 mapper/cynefin 提供，零布局数学）。
 *
 * - 四域底色 = 无描边矩形（fill 已含官方 .4/.95/.6 透明度）
 * - 分界线/悬崖 = geometryString 描边 Shape（波浪虚线 / 深红实线）
 * - confusion = 虚线描边椭圆；labels/subtitles = 居中文本
 * - items = 圆角条（rx4，w/h 数据驱动）；transitions = 直线 Standard 箭头
 */
import { Diagram } from '../../../src/diagram/Diagram';
import { MermaidTheme } from '../themes';
import { MappedCynefinNode, MappedCynefinLink } from '../mapper/cynefin';
/** 渲染 cynefin 到 div（data = mapCynefin 的输出） */
export declare function renderCynefin(divId: string, data: {
    nodes: MappedCynefinNode[];
    links: MappedCynefinLink[];
}, theme: MermaidTheme): Diagram;
