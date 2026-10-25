import { Rect } from '../core/Rect';
import { SvgRendererOptions } from '../core/SvgRendererOptions';
/** makeSvg 选项（在 SvgRendererOptions 之上补充导出范围/缩放/图层过滤） */
export interface MakeSvgOptions extends Partial<SvgRendererOptions> {
    /** 缩放倍数（默认 1） */
    scale?: number;
    /** 导出范围（文档坐标；缺省用 diagram.documentBounds） */
    bounds?: Rect;
    /** 是否包含选中装饰层（默认 false） */
    includeAdornments?: boolean;
    /** 仅导出这些图层名（缺省全部可见图层，Adornment/Tool 除外） */
    layers?: string[];
}
/** 导出型 SVG 渲染器 */
export declare class SvgRenderer {
    static readonly className = "SvgRenderer";
    private diagram;
    private svg;
    private defs;
    private scale;
    private bounds;
    private includeAdornments;
    private layerFilter;
    private brushSeq;
    private clipSeq;
    private filterSeq;
    private currentShadow;
    /** 把 diagram 当前内容渲染为一个 <svg> 元素 */
    static render(diagram: any, options?: MakeSvgOptions): SVGSVGElement;
    /** 把 diagram 当前内容渲染为 SVG 字符串 */
    static renderToString(diagram: any, options?: MakeSvgOptions): string;
    private _render;
    private _renderLayer;
    private _intersects;
    private _renderPart;
    /** 镜像 CanvasRenderer._applyTransform（枢轴旋转 + 缩放） */
    private _partTransform;
    /** offsetX/offsetY：父级原点在本对象坐标系中的偏移（与 CanvasRenderer 语义一致） */
    private _renderObject;
    private _renderPanel;
    private _renderShape;
    private _applyStrokeStyle;
    private _renderTextBlock;
    private _applyFont;
    private _renderPicture;
    private _brushPaint;
    private _dropShadowFilter;
    /** 单 figure 的 SVG path 数据 */
    private _figurePathData;
    /** 把 Shape 的几何以带变换的 path 追加进 clipPath */
    private _appendShapeClip;
    /** 连线：主路径按 link.points（含端点 shortLength/圆角）绘制，箭头单独定位，其余子元素常规绘制 */
    private _renderLink;
    /** 主路径：镜像 CanvasRenderer._renderLinkPath（直线/贝塞尔/圆角） */
    private _renderLinkPath;
    private _polylinePathData;
    private _bezierPathData;
    /** 圆角采样（镜像 CanvasRenderer._roundCorners） */
    private _roundCorners;
    /** 箭头：镜像 CanvasRenderer._renderArrow（tip 定位 + 方向旋转 + 几何缩放矩阵） */
    private _renderArrow;
    private _el;
    private _translate;
    private _rotateScale;
}
