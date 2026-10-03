import { GraphObject } from './GraphObject';
import { Rect } from '../core/Rect';
import { EnumValue } from '../core/EnumValues';
export declare class Picture extends GraphObject {
    static readonly className: string;
    static None: EnumValue;
    static Fill: EnumValue;
    static Uniform: EnumValue;
    static UniformToFill: EnumValue;
    /**
     * 官方 `Picture.clearCache(url?)`：清空官方内部按 url 缓存的图片对象。
     * 不传 url 就清空整个缓存。
     */
    static clearCache(url?: string): void;
    /** 按 url 共享的 HTMLImageElement 缓存（官方内部也是这么做的） */
    private static _imageCache;
    private _source;
    private _image;
    private _loadedImage;
    /** source 直接是 <canvas>/<img>/<video> 元素时的可绘制对象（官方 4.x 支持）。 */
    private _canvasSource;
    private _imageStretch;
    private _imageAlignment;
    private _sourceRect;
    private _errorFunction;
    private _successFunction;
    private _sourceCrossOrigin;
    private _crossOrigin;
    constructor(source?: string | Partial<Picture>, init?: Partial<Picture>);
    get source(): string;
    set source(val: string);
    /**
     * 官方 4.x 的 `Picture.element`：直接给一个 <canvas>/<img>/<video> 元素来绘制
     * （canvases 样例用 Chart.js 画到 canvas 上再 `.bind('element', 'datasets', fn)`）。
     * 官方只接受 Image/Canvas/Video 三种，其他类型直接报错。
     */
    get element(): HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null;
    set element(val: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null);
    get image(): HTMLImageElement | null;
    set image(val: HTMLImageElement | null);
    get imageStretch(): EnumValue;
    set imageStretch(val: EnumValue);
    get imageAlignment(): string;
    set imageAlignment(val: string);
    get sourceRect(): Rect | null;
    set sourceRect(val: Rect | null);
    get errorFunction(): ((pic: Picture, e: Event) => void) | null;
    set errorFunction(val: ((pic: Picture, e: Event) => void) | null);
    get successFunction(): ((pic: Picture, e: Event) => void) | null;
    set successFunction(val: ((pic: Picture, e: Event) => void) | null);
    get sourceCrossOrigin(): ((pic: Picture) => string) | null;
    set sourceCrossOrigin(val: ((pic: Picture) => string) | null);
    get crossOrigin(): string | null;
    set crossOrigin(val: string | null);
    /** 官方 `Picture.reloadSource()`：强制按当前 `source` 重新下载图片。 */
    reloadSource(): void;
    /** 官方 `Picture.redraw()`：图片内容已变化但尺寸不变时，只触发重绘。 */
    redraw(): void;
    private _loadImage;
    private _onImageLoad;
    private _onImageError;
    _measure(widthConstraint: number, heightConstraint: number): void;
    copy(): Picture;
}
