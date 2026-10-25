/**
 * 导出工具 —— 将 Diagram 画面导出为 PNG dataURL。
 *
 * 做法：保存视口 → zoomToFit 显示全部内容 → 同步渲染 → 抓取 canvas → 还原视口。
 * 本实现只读核心 Diagram（fit/position/scale/canvas），不修改任何既有 GoJS 代码。
 */
import { Diagram } from '../../src/diagram/Diagram';
import { Spot } from '../../src/core/Spot';

export interface PngExportOptions {
  /** 缩放倍数；默认在 fit 基础上再乘该系数（用于提高清晰度） */
  scale?: number;
  /** 画布底色；默认白。传 'transparent' 则保留透明 */
  background?: string;
  /** 导出区域边距（px），默认 16 */
  margin?: number;
}

/** 读取 Diagram 当前的 canvas 元素（若渲染器尚未创建则返回 null） */
function getCanvas(diagram: Diagram): HTMLCanvasElement | null {
  const r: any = (diagram as any)._renderer;
  return (r && r.canvas) || null;
}

/**
 * 导出 PNG。
 * @returns base64 dataURL（`data:image/png;base64,...`）；失败返回 null。
 */
export function exportPng(diagram: Diagram, opts: PngExportOptions = {}): string | null {
  const canvas = getCanvas(diagram);
  if (!canvas || !canvas.width || !canvas.height) return null;

  const scale = opts.scale ?? 1;
  const bg = opts.background ?? '#ffffff';

  // 记录当前视口，导出后还原
  const prevScale = diagram.scale;
  const prevPos = diagram.position.copy();

  try {
    // 1. 缩放到适配全部内容
    diagram.zoomToFit();

    // 2. 在 fit 结果上再放大 scale 倍（提高清晰度），并重新居中
    if (scale !== 1) {
      diagram.scale = diagram.scale * scale;
      diagram.alignDocument(Spot.Center, Spot.Center);
    }

    // 3. 同步渲染一帧
    diagram.maybeUpdate();

    const c = getCanvas(diagram);
    if (!c) return null;

    // 4. 如需底色，先画一层背景（避免透明底意外）
    if (bg !== 'transparent') {
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.restore();
      }
    }

    return c.toDataURL('image/png');
  } catch {
    return null;
  } finally {
    // 还原视口
    try {
      diagram.scale = prevScale;
      diagram.position = prevPos;
      diagram.maybeUpdate();
    } catch {
      /* ignore */
    }
  }
}

/**
 * 触发浏览器下载 PNG。
 */
export function downloadPng(diagram: Diagram, filename = 'mermaid.png', opts: PngExportOptions = {}): boolean {
  const url = exportPng(diagram, opts);
  if (!url) return false;
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch {
    return false;
  }
}

/** SVG 导出选项 */
export interface SvgExportOptions {
  /** 缩放倍数（默认 1） */
  scale?: number;
  /** 背景色（默认白；传 'transparent' 则不画底色） */
  background?: string;
}

/**
 * 导出 SVG 字符串（静态快照，基于核心 SvgRenderer；不改变当前视口）。
 * @returns SVG 源串；失败返回 null。
 */
export function exportSvg(diagram: Diagram, opts: SvgExportOptions = {}): string | null {
  try {
    const svg = diagram.makeSvg({
      scale: opts.scale ?? 1,
      background: opts.background === 'transparent' ? undefined : (opts.background ?? '#ffffff'),
    });
    return new XMLSerializer().serializeToString(svg);
  } catch {
    return null;
  }
}

/**
 * 触发浏览器下载 SVG。
 */
export function downloadSvg(diagram: Diagram, filename = 'mermaid.svg', opts: SvgExportOptions = {}): boolean {
  const src = exportSvg(diagram, opts);
  if (!src) return false;
  try {
    const blob = new Blob([src], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return true;
  } catch {
    return false;
  }
}
