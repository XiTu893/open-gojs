/**
 * 导出工具 —— 将 Diagram 画面导出为 PNG dataURL。
 *
 * 做法：保存视口 → zoomToFit 显示全部内容 → 同步渲染 → 抓取 canvas → 还原视口。
 * 本实现只读核心 Diagram（fit/position/scale/canvas），不修改任何既有 GoJS 代码。
 */
import { Diagram } from '../../src/diagram/Diagram';
export interface PngExportOptions {
    /** 缩放倍数；默认在 fit 基础上再乘该系数（用于提高清晰度） */
    scale?: number;
    /** 画布底色；默认白。传 'transparent' 则保留透明 */
    background?: string;
    /** 导出区域边距（px），默认 16 */
    margin?: number;
}
/**
 * 导出 PNG。
 * @returns base64 dataURL（`data:image/png;base64,...`）；失败返回 null。
 */
export declare function exportPng(diagram: Diagram, opts?: PngExportOptions): string | null;
/**
 * 触发浏览器下载 PNG。
 */
export declare function downloadPng(diagram: Diagram, filename?: string, opts?: PngExportOptions): boolean;
