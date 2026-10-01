import { GraphObject } from './GraphObject';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { Brush, BrushLike } from '../core/Brush';
import { EnumValue, ImageStretchNone, ImageStretchFill, ImageStretchUniform, ImageStretchUniformToFill } from '../core/EnumValues';

export class Picture extends GraphObject {
  static readonly className: string = "Picture";

  static None: EnumValue = ImageStretchNone;
  static Fill: EnumValue = ImageStretchFill;
  static Uniform: EnumValue = ImageStretchUniform;
  static UniformToFill: EnumValue = ImageStretchUniformToFill;

  /**
   * 官方 `Picture.clearCache(url?)`：清空官方内部按 url 缓存的图片对象。
   * 不传 url 就清空整个缓存。
   */
  static clearCache(url?: string): void {
    if (url === undefined) Picture._imageCache.clear();
    else Picture._imageCache.delete(url);
  }

  /** 按 url 共享的 HTMLImageElement 缓存（官方内部也是这么做的） */
  private static _imageCache: Map<string, HTMLImageElement> = new Map();

  private _source: string = '';
  private _image: HTMLImageElement | null = null;
  private _loadedImage: HTMLImageElement | null = null;
  private _imageStretch: EnumValue = ImageStretchUniform;
  private _imageAlignment: string = 'center';
  private _sourceRect: Rect | null = null;
  private _errorFunction: ((pic: Picture, e: Event) => void) | null = null;
  private _successFunction: ((pic: Picture, e: Event) => void) | null = null;
  private _sourceCrossOrigin: ((pic: Picture) => string) | null = null;
  private _crossOrigin: string | null = null;

  constructor(source?: string | Partial<Picture>, init?: Partial<Picture>) {
    super();
    this._className = 'Picture';
    if (typeof source === 'string') {
      this._source = source;
      if (init) this.set(init as Partial<Picture>);
    } else if (source && typeof source === 'object') {
      this.set(source as Partial<Picture>);
    }
  }

  get source(): string { return this._source; }
  set source(val: string) {
    if (this._source !== val) {
      this._source = val;
      this._loadImage();
      this._invalidateMeasure();
    }
  }

  get element(): HTMLImageElement | null { return this._loadedImage || this._image; }

  get image(): HTMLImageElement | null { return this._image; }
  set image(val: HTMLImageElement | null) {
    if (this._image !== val) {
      this._image = val;
      this._invalidateMeasure();
    }
  }

  get imageStretch(): EnumValue { return this._imageStretch; }
  set imageStretch(val: EnumValue) {
    if (this._imageStretch !== val) {
      this._imageStretch = val;
      this._invalidateMeasure();
    }
  }

  get imageAlignment(): string { return this._imageAlignment; }
  set imageAlignment(val: string) { this._imageAlignment = val; }

  get sourceRect(): Rect | null { return this._sourceRect; }
  set sourceRect(val: Rect | null) {
    if (this._sourceRect !== val) {
      this._sourceRect = val;
      this._invalidateMeasure();
    }
  }

  get errorFunction(): ((pic: Picture, e: Event) => void) | null { return this._errorFunction; }
  set errorFunction(val: ((pic: Picture, e: Event) => void) | null) { this._errorFunction = val; }

  get successFunction(): ((pic: Picture, e: Event) => void) | null { return this._successFunction; }
  set successFunction(val: ((pic: Picture, e: Event) => void) | null) { this._successFunction = val; }

  get sourceCrossOrigin(): ((pic: Picture) => string) | null { return this._sourceCrossOrigin; }
  set sourceCrossOrigin(val: ((pic: Picture) => string) | null) { this._sourceCrossOrigin = val; }

  get crossOrigin(): string | null { return this._crossOrigin; }
  set crossOrigin(val: string | null) { this._crossOrigin = val; }

  /** 官方 `Picture.reloadSource()`：强制按当前 `source` 重新下载图片。 */
  reloadSource(): void {
    this._loadImage();
  }

  /** 官方 `Picture.redraw()`：图片内容已变化但尺寸不变时，只触发重绘。 */
  redraw(): void {
    this._invalidateMeasure();
    const d = this.diagram;
    if (d && typeof d.requestUpdate === 'function') {
      d.requestUpdate();
    }
  }

  private _loadImage(): void {
    const src = this._source;
    if (!src) {
      this._image = null;
      this._loadedImage = null;
      return;
    }
    this._loadedImage = null;

    // 官方按 url 缓存 HTMLImageElement：模板被 copy() 成上百个 Picture 时
    // 共享同一个已加载的图片对象，而不是每个副本各自去加载。
    let img = Picture._imageCache.get(src);
    if (img === undefined) {
      img = new Image();
      const co = this._sourceCrossOrigin !== null ? this._sourceCrossOrigin(this) : this._crossOrigin;
      if (co) {
        img.crossOrigin = co;
      }
      img.addEventListener('load', () => {
        // 已经走到这一步说明浏览器缓存没命中过，load 一定会来
        Picture._imageCache.set(src, img!);
      });
      Picture._imageCache.set(src, img);
      img.src = src;
    }
    this._image = img;

    if (img.complete && img.naturalWidth > 0) {
      this._onImageLoad(img);
    } else if (img.complete && img.naturalWidth === 0) {
      this._onImageError(new Event('error'));
    } else {
      img.addEventListener('load', () => this._onImageLoad(img!));
      img.addEventListener('error', (e: Event) => this._onImageError(e));
    }
  }

  private _onImageLoad(img: HTMLImageElement): void {
    // source 已经被换掉的话，这次回调不算数
    if (this._image !== img) return;
    this._loadedImage = img;
    if (this._successFunction) {
      this._successFunction(this, new Event('load'));
    }
    const ds = this._desiredSize;
    if (isNaN(ds.width) || isNaN(ds.height)) {
      this._invalidateMeasure();
    }
    // 图片加载完成后一定要重绘：canvas 上已经画好的“未加载”占位框
    // 只有在再次渲染时才会被真正的图片替换掉。
    const d = this.diagram;
    if (d && typeof d.requestUpdate === 'function') {
      d.requestUpdate();
    }
  }

  private _onImageError(e: Event | string): void {
    if (this._image !== Picture._imageCache.get(this._source)) return;
    this._image = null;
    this._loadedImage = null;
    if (this._errorFunction) {
      this._errorFunction(this, e instanceof Event ? e : new Event(String(e)));
    }
    const d = this.diagram;
    if (d && typeof d.requestUpdate === 'function') {
      d.requestUpdate();
    }
  }

  _measure(widthConstraint: number, heightConstraint: number): void {
    const img = this._loadedImage || this._image;
    if (img && img.complete && img.naturalWidth > 0) {
      const w = isNaN(this.width) ? img.naturalWidth : this.width;
      const h = isNaN(this.height) ? img.naturalHeight : this.height;
      this._naturalBounds = new Rect(0, 0, w, h);
    } else {
      const w = isNaN(this.width) ? 0 : this.width;
      const h = isNaN(this.height) ? 0 : this.height;
      this._naturalBounds = new Rect(0, 0, w, h);
    }
    const measuredWidth = Math.min(this._naturalBounds.width, widthConstraint);
    const measuredHeight = Math.min(this._naturalBounds.height, heightConstraint);
    this._measuredBounds = new Rect(0, 0, measuredWidth, measuredHeight);
    this._applySizeConstraints();
  }

  copy(): Picture {
    const pic = new Picture();
    this._copyPropertiesTo(pic);
    pic._imageStretch = this._imageStretch;
    pic._imageAlignment = this._imageAlignment;
    pic._sourceRect = this._sourceRect;
    pic._errorFunction = this._errorFunction;
    pic._successFunction = this._successFunction;
    pic._sourceCrossOrigin = this._sourceCrossOrigin;
    pic._crossOrigin = this._crossOrigin;
    // 走 setter，副本自己去接上（共享的）图片对象并注册自己的 load 回调
    pic.source = this._source;
    return pic;
  }
}

GraphObject.defineBuilder('Picture', Picture);
