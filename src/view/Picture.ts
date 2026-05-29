import { GraphObject } from './GraphObject';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { Brush, BrushLike } from '../core/Brush';
import { EnumValue, ImageStretchNone, ImageStretchFill, ImageStretchUniform, ImageStretchUniformToFill } from '../core/EnumValues';

export class Picture extends GraphObject {

  static None: EnumValue = ImageStretchNone;
  static Fill: EnumValue = ImageStretchFill;
  static Uniform: EnumValue = ImageStretchUniform;
  static UniformToFill: EnumValue = ImageStretchUniformToFill;

  private _source: string = '';
  private _image: HTMLImageElement | null = null;
  private _loadedImage: HTMLImageElement | null = null;
  private _imageStretch: EnumValue = ImageStretchUniform;
  private _imageAlignment: string = 'center';
  private _sourceRect: Rect | null = null;
  private _errorFunction: ((pic: Picture, e: Event) => void) | null = null;
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

  get crossOrigin(): string | null { return this._crossOrigin; }
  set crossOrigin(val: string | null) { this._crossOrigin = val; }

  private _loadImage(): void {
    if (!this._source) {
      this._image = null;
      this._loadedImage = null;
      return;
    }
    this._loadedImage = null;
    const img = new Image();
    if (this._crossOrigin) {
      img.crossOrigin = this._crossOrigin;
    }
    img.src = this._source;
    img.onload = () => {
      this._loadedImage = img;
      this._invalidateMeasure();
      const d = this.diagram;
      if (d && typeof d.requestUpdate === 'function') {
        d.requestUpdate();
      }
    };
    img.onerror = (e: Event | string) => {
      this._image = null;
      this._loadedImage = null;
      if (this._errorFunction) {
        this._errorFunction(this, e instanceof Event ? e : new Event(String(e)));
      }
    };
    this._image = img;
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
    pic._source = this._source;
    pic._image = this._image;
    pic._loadedImage = this._loadedImage;
    pic._imageStretch = this._imageStretch;
    pic._imageAlignment = this._imageAlignment;
    pic._sourceRect = this._sourceRect;
    pic._errorFunction = this._errorFunction;
    pic._crossOrigin = this._crossOrigin;
    return pic;
  }
}

GraphObject.defineBuilder('Picture', Picture);
