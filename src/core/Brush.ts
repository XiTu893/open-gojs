import { EnumValue, BrushSolid, BrushLinear, BrushRadial, BrushPattern, ColorSpaceHSL } from './EnumValues';
import { BrushType } from './EnumNamespaces';
import { Point } from './Point';

/**
 * Brush - 画刷
 * 支持 Solid（纯色）、Linear（线性渐变）、Radial（径向渐变）
 */
export class Brush {
  static readonly className: string = "Brush";
  /** 画刷类型（官方 Brush.J；经 setter 在 NoSpot 时按类型补 start/end 默认） */
  private _type: EnumValue;
  /** 纯色颜色值 */
  public color: string;
  /** 渐变色标 */
  private _stops: BrushStop[];
  /** 渐变起点（Linear 默认 TopCenter=(0.5,0)、Radial 默认 Center=(0.5,0.5)；可存 Spot 实例） */
  private _start: Point;
  /** 渐变终点（Linear 默认 BottomCenter=(0.5,1)、Radial 默认 Center=(0.5,0.5)） */
  private _end: Point;
  /** 官方语义：start 处于 Spot.None（未按类型初始化过） */
  private _startNoSpot: boolean;
  /** 官方语义：end 处于 Spot.None（未按类型初始化过） */
  private _endNoSpot: boolean;
  /** 径向渐变中心（旧字段；renderer 渐变已按官方 makeBrush 用 start/end/startRadius/endRadius） */
  public center: Point;
  /** 径向渐变焦点（旧字段） */
  public focus: Point;
  /** 径向渐变半径（旧字段，max(w,h) 的分数） */
  public radius: number;

  /** 官方 `Brush(type?, colorStops?)`：字符串先按 BrushType 名解析（Solid/Linear/Radial/Pattern），
   *  否则当纯色颜色；对象作第一参数时当 colorStops。色标数字键 addColorStop，其余键直接赋值
   *  （如 start/end/startRadius/endRadius）。构造按初始类型设 start/end 默认（官方 fe/Ds）。 */
  constructor(type?: EnumValue | string | Record<string, any>, colorStops?: Record<string, any>) {
    this._stops = [];
    this._start = new Point(0, 0);
    this._end = new Point(1, 0);
    this._startNoSpot = true;
    this._endNoSpot = true;
    this.center = new Point(0.5, 0.5);
    this.focus = new Point(0.5, 0.5);
    this.radius = 0.5;
    this.color = 'black';
    let stopsArg: Record<string, any> | undefined = colorStops;
    if (type === undefined || type === null) {
      this._type = BrushSolid;
    } else if (typeof type === 'string') {
      const t = Brush._typeFromName(type);
      if (t !== null) this._type = t;
      else { this._type = BrushSolid; this.color = type; }
    } else if (typeof type === 'object' && !(type instanceof EnumValue)) {
      this._type = BrushSolid;
      stopsArg = type as Record<string, any>;
    } else {
      this._type = Brush._typeFromValue(type) || BrushSolid;
    }
    Brush._applyTypeStartEnd(this, this._type);
    if (stopsArg) {
      for (const key of Object.keys(stopsArg)) {
        const n = parseFloat(key);
        if (isFinite(n)) this.addColorStop(n, stopsArg[key]);
        else (this as any)[key] = stopsArg[key];
      }
    }
  }

  get type(): EnumValue {
    return this._type;
  }
  /** 官方 `set type`：NoSpot 的 start/end 按新类型补默认（2→TopCenter/BottomCenter，3→Center/Center） */
  set type(value: EnumValue | string) {
    let t: any = value;
    if (typeof value === 'string') {
      const r = Brush._typeFromName(value);
      if (r !== null) t = r;
    }
    this._type = t;
    Brush._applyTypeStartEnd(this, t);
  }

  get start(): Point {
    return this._start;
  }
  set start(value: Point) {
    this._start = value;
    this._startNoSpot = false;
  }

  get end(): Point {
    return this._end;
  }
  set end(value: Point) {
    this._end = value;
    this._endNoSpot = false;
  }

  /** BrushType 名（'Solid'/'Linear'/'Radial'/'Pattern'）→ 枚举值；非类型名返回 null（当颜色处理） */
  private static _typeFromName(name: string): EnumValue | null {
    const t = (BrushType as Record<string, EnumValue>)[name];
    return t === undefined ? null : t;
  }

  /** EnumValue / 数字（1..4）→ BrushType 枚举值 */
  private static _typeFromValue(v: EnumValue | number): EnumValue | null {
    if (v instanceof EnumValue) return Brush._typeFromName(v._name);
    if (typeof v === 'number') {
      if (v === 1) return BrushSolid;
      if (v === 2) return BrushLinear;
      if (v === 3) return BrushRadial;
      if (v === 4) return BrushPattern;
    }
    return null;
  }

  /** 官方构造/set type 的 fe/Ds 默认：Linear→TopCenter/BottomCenter，Radial→Center/Center；NoSpot 时才补 */
  private static _applyTypeStartEnd(b: Brush, t: EnumValue): void {
    if (b._startNoSpot) {
      if (t === BrushLinear) { b._start = new Point(0.5, 0); b._startNoSpot = false; }
      else if (t === BrushRadial) { b._start = new Point(0.5, 0.5); b._startNoSpot = false; }
    }
    if (b._endNoSpot) {
      if (t === BrushLinear) { b._end = new Point(0.5, 1); b._endNoSpot = false; }
      else if (t === BrushRadial) { b._end = new Point(0.5, 0.5); b._endNoSpot = false; }
    }
  }

  /** 获取色标列表 */
  get stops(): BrushStop[] {
    return this._stops;
  }

  /** 添加色标（官方：Solid 上加色标会自动转为 Linear） */
  addColorStop(offset: number, color: string): this {
    if (this.type === BrushSolid) {
      this.type = BrushLinear;
    }
    this._stops.push({ offset, color });
    this._stops.sort((a, b) => a.offset - b.offset);
    return this;
  }

  set(props: Record<string, any>): this {
    if (!props) return this;
    const keys = Object.keys(props);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === 'stops') {
        const stops = props[key];
        if (Array.isArray(stops)) {
          for (const s of stops) {
            if (typeof s === 'object' && s.offset !== undefined && s.color !== undefined) {
              this.addColorStop(s.offset, s.color);
            }
          }
        }
      } else if (typeof (this as any)[key] !== 'undefined' || key in this) {
        (this as any)[key] = props[key];
      }
    }
    return this;
  }

  /** 复制（官方 `copy()`：start/end/半径/色标全带过去） */
  copy(): Brush {
    const b = new Brush(this._type);
    b.color = this.color;
    b._start = this._start.copy();
    b._startNoSpot = this._startNoSpot;
    b._end = this._end.copy();
    b._endNoSpot = this._endNoSpot;
    b.center = this.center.copy();
    b.focus = this.focus.copy();
    b.radius = this.radius;
    b._stops = this._stops.map(s => ({ ...s }));
    b._pattern = this._pattern;
    b._startRadius = this._startRadius;
    b._endRadius = this._endRadius;
    return b;
  }

  /** 创建 Canvas 渐变对象（官方 makeBrush：spot 分数×bounds + offsetX/offsetY；radial 半径按官方 NaN 默认） */
  _createCanvasGradient(ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }): CanvasGradient | null {
    if (this.type === BrushSolid) return null;
    const s: any = this._start;
    const e: any = this._end;
    if (this.type === BrushLinear) {
      const x1 = bounds.x + s.x * bounds.width + (s.offsetX || 0);
      const y1 = bounds.y + s.y * bounds.height + (s.offsetY || 0);
      const x2 = bounds.x + e.x * bounds.width + (e.offsetX || 0);
      const y2 = bounds.y + e.y * bounds.height + (e.offsetY || 0);
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      for (const stop of this._stops) {
        grad.addColorStop(stop.offset, stop.color);
      }
      return grad;
    }
    if (this.type === BrushRadial) {
      const fx = bounds.x + s.x * bounds.width + (s.offsetX || 0);
      const fy = bounds.y + s.y * bounds.height + (s.offsetY || 0);
      const cx = bounds.x + e.x * bounds.width + (e.offsetX || 0);
      const cy = bounds.y + e.y * bounds.height + (e.offsetY || 0);
      const maxWH = Math.max(bounds.width, bounds.height);
      let er = this._endRadius;
      let sr: number;
      if (isNaN(this._startRadius)) { sr = 0; er = maxWH / 2; }
      else { sr = this._startRadius; if (isNaN(er)) er = maxWH / 2; }
      const grad = ctx.createRadialGradient(fx, fy, sr, cx, cy, er);
      for (const stop of this._stops) {
        grad.addColorStop(stop.offset, stop.color);
      }
      return grad;
    }
    return null;
  }

  equals(b: Brush): boolean {
    if (!(b instanceof Brush)) return false;
    if (this.type !== b.type) return false;
    if (this.type === BrushSolid) return this.color === b.color;
    if (this._stops.length !== b._stops.length) return false;
    for (let i = 0; i < this._stops.length; i++) {
      if (this._stops[i].offset !== b._stops[i].offset ||
        this._stops[i].color !== b._stops[i].color) return false;
    }
    return true;
  }

  /** 创建纯色画刷 */
  static Solid(color: string): Brush {
    const b = new Brush(BrushSolid);
    b.color = color;
    return b;
  }

  /** 创建线性渐变画刷 */
  static Linear(startX: number, startY: number, endX: number, endY: number): Brush {
    const b = new Brush(BrushLinear);
    b.start = new Point(startX, startY);
    b.end = new Point(endX, endY);
    return b;
  }

  /** 创建径向渐变画刷（旧 API：center/focus/radius 为 max(w,h) 分数；renderer 走 start/end，
   *  这里同步把 start=focus、end=center 写进官方字段，endRadius 用官方默认 max/2 ≡ radius 0.5） */
  static Radial(centerX: number, centerY: number, radius: number, focusX?: number, focusY?: number): Brush {
    const b = new Brush(BrushRadial);
    b.center = new Point(centerX, centerY);
    b.radius = radius;
    b._start = new Point(focusX === undefined ? centerX : focusX, focusY === undefined ? centerY : focusY);
    b._startNoSpot = false;
    b._end = new Point(centerX, centerY);
    b._endNoSpot = false;
    return b;
  }

  /** 判断是否为 Brush */
  static isBrush(b: any): b is Brush {
    return b instanceof Brush;
  }

  /** 官方 U.wm：crypto.getRandomValues 单位浮点 */
  private static _wm(): number {
    const a = new Uint32Array(1);
    const c: any = typeof globalThis !== 'undefined' ? (globalThis as any).crypto : undefined;
    if (c && typeof c.getRandomValues === 'function') c.getRandomValues(a);
    else a[0] = Math.floor(Math.random() * 4294967296);
    return a[0] / 4294967296;
  }

  /** 官方 Brush.randomColor(min=128, max=max(min,255))：'#rrggbb'，经 crypto 随机 */
  static randomColor(min?: number, max?: number): string {
    if (min === undefined) min = 128;
    if (max === undefined) max = Math.max(min, 255);
    const e = Math.abs(max - min);
    let s = Math.floor(min + Brush._wm() * e).toString(16);
    let g = Math.floor(min + Brush._wm() * e).toString(16);
    let b = Math.floor(min + Brush._wm() * e).toString(16);
    if (s.length < 2) s = '0' + s;
    if (g.length < 2) g = '0' + g;
    if (b.length < 2) b = '0' + b;
    return '#' + s + g + b;
  }

  static darken(color: string, fraction?: number, space?: number): string {
    return Brush.darkenBy(color, fraction === undefined ? 0.2 : fraction, space);
  }

  static darkenBy(color: string, fraction: number, space?: number): string {
    return Brush._wd(color, -(fraction === undefined ? 0.2 : fraction), space === undefined ? 3 : space);
  }

  static lighten(color: string, fraction?: number, space?: number): string {
    return Brush.lightenBy(color, fraction === undefined ? 0.2 : fraction, space);
  }

  static lightenBy(color: string, fraction: number, space?: number): string {
    return Brush._wd(color, fraction === undefined ? 0.2 : fraction, space === undefined ? 3 : space);
  }

  /** 官方 sRGB gamma 解码（sRGB → 线性） */
  private static _yN(t: number): number {
    t /= 255;
    return t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
  }

  /** 官方 sRGB gamma 编码（线性 → sRGB） */
  private static _wN(t: number): number {
    return t <= 0.0031308 ? t * 12.92 : 1.055 * Math.pow(t, 1 / 2.4) - 0.055;
  }

  /**
   * 官方 Brush.Wd/Ho：解析颜色 → 按颜色空间调整明度（space=3 官方默认 OKLCh）→
   * 返回官方格式 "rgba(r, g, b, a)"。仅实现官方默认的 OKLCh（+未用到的 HSL/Lab 不实现，
   * space 非 3 时原样返回）。
   */
  private static _wd(color: string, amount: number, space: number): string {
    if (space !== 3) return color;
    const c = Color.parse(color);
    if (!c) return color;
    // sRGB → 线性 RGB → XYZ D65（官方 GD）
    const lr = Brush._yN(c.r);
    const lg = Brush._yN(c.g);
    const lb = Brush._yN(c.b);
    let x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
    let y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
    let z = 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb;
    // XYZ → OKLab（官方 h3）
    const l_ = Math.cbrt(0.8190224 * x + 0.3619062 * y - 0.1288737 * z);
    const m_ = Math.cbrt(0.03298366 * x + 0.9292868 * y + 0.03614466 * z);
    const s_ = Math.cbrt(0.04817719 * x + 0.2642395 * y + 0.6335478 * z);
    const labL = 0.2104542 * l_ + 0.7936177 * m_ - 0.004072046 * s_;
    const labA = 1.977998 * l_ - 2.428592 * m_ + 0.4505937 * s_;
    const labB = 0.02590403 * l_ + 0.7827717 * m_ - 0.8086757 * s_;
    // OKLab → OKLCh（官方 c3），调 L（官方 Wd case3：clamp(0,100, L+100*amount)）
    const hue = Math.atan2(labB, labA) * 180 / Math.PI;
    const chroma = Math.sqrt(labA * labA + labB * labB);
    const L = Math.min(100, Math.max(0, labL * 100 + 100 * amount)) / 100;
    // OKLCh → OKLab（官方 f3）
    const rad = (hue >= 0 ? hue : hue + 360) * Math.PI / 180;
    const a2 = chroma * Math.cos(rad);
    const b2 = chroma * Math.sin(rad);
    // OKLab → XYZ（官方 a3）
    let t1 = 0.9999999 * L + 0.3963377 * a2 + 0.2158037 * b2;
    let t2 = 1.000000009 * L - 0.1055613 * a2 - 0.06385417 * b2;
    let t3 = 1.00000005 * L - 0.08948418 * a2 - 1.291485 * b2;
    t1 = t1 * t1 * t1;
    t2 = t2 * t2 * t2;
    t3 = t3 * t3 * t3;
    x = 1.2268798 * t1 - 0.5578149 * t2 + 0.281391 * t3;
    y = -0.04057576 * t1 + 1.112286 * t2 - 0.07171106 * t3;
    z = -0.07637294 * t1 - 0.4214933 * t2 + 1.586924 * t3;
    // XYZ → 线性 RGB（官方 qD 的 3.2404542/-1.5371385/-0.4985314 矩阵）。
    // 早先这里漏了这一步，直接把 XYZ 当线性 RGB 做 gamma 编码，
    // Brush.darkenBy('#e74c3c',0.3) 算出 (78,47,0) 而官方是 (125,0,0)。
    const linR = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    const linG = -0.969266 * x + 1.8760108 * y + 0.041556 * z;
    const linB = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;
    // 线性 RGB → sRGB（官方 qD：round + clamp 0..255）
    let rr = Math.round(Brush._wN(linR) * 255);
    let gg = Math.round(Brush._wN(linG) * 255);
    let bb = Math.round(Brush._wN(linB) * 255);
    if (rr > 255) rr = 255; else if (rr < 0) rr = 0;
    if (gg > 255) gg = 255; else if (gg < 0) gg = 0;
    if (bb > 255) bb = 255; else if (bb < 0) bb = 0;
    return 'rgba(' + rr + ', ' + gg + ', ' + bb + ', ' + c.a + ')';
  }

  static isDark(color: string): boolean {
    const c = Color.parse(color);
    if (!c) return false;
    return (c.r * 0.299 + c.g * 0.587 + c.b * 0.114) < 128;
  }
  // ============ 官方 Brush API 对齐（阶段 5） ============

  private _startRadius: number = 0;
  /** 官方默认 endRadius=NaN → makeBrush 里取 max(w,h)/2 */
  private _endRadius: number = NaN;
  private _pattern: HTMLCanvasElement | HTMLImageElement | null = null;

  /** 官方 Brush.startRadius（Radial 起始半径） */
  get startRadius(): number {
    return this._startRadius;
  }
  set startRadius(value: number) {
    this._startRadius = value;
  }

  /** 官方 Brush.endRadius（Radial 结束半径） */
  get endRadius(): number {
    return this._endRadius;
  }
  set endRadius(value: number) {
    this._endRadius = value;
  }

  /** 官方 Brush.pattern（BrushType.Pattern 使用的位图） */
  get pattern(): HTMLCanvasElement | HTMLImageElement | null {
    return this._pattern;
  }
  set pattern(value: HTMLCanvasElement | HTMLImageElement | null) {
    this._pattern = value;
  }

  /**
   * 官方 Brush.colorStops：offset → color 的 Map 视图（本项目内部用 BrushStop[] 存储）。
   * 无色标时与官方一样返回 null。
   */
  get colorStops(): Map<number, string> | null {
    if (this._stops.length === 0) return null;
    const m = new Map<number, string>();
    for (let i = 0; i < this._stops.length; i++) {
      m.set(this._stops[i].offset, this._stops[i].color);
    }
    return m;
  }
  set colorStops(value: Map<number, string> | null) {
    if (value === null || value === undefined) {
      this._stops = [];
      return;
    }
    const arr: BrushStop[] = [];
    value.forEach((color: string, offset: number) => {
      arr.push({ offset, color });
    });
    arr.sort((a, b) => a.offset - b.offset);
    this._stops = arr;
  }

  /** 官方 Brush.toString */
  toString(): string {
    let str = 'Brush(';
    if (this.type === BrushSolid) {
      str += this.color;
    } else {
      str +=
        this.type === BrushLinear
          ? 'Linear '
          : this.type === BrushRadial
            ? 'Radial '
            : this.type === BrushPattern
              ? 'Pattern '
              : '(unknown) ';
      str += this.start + ' ' + this.end;
      const cs = this.colorStops;
      if (cs !== null) {
        cs.forEach((color: string, offset: number) => {
          str += ' ' + offset + ':' + color;
        });
      }
    }
    return str + ')';
  }

  /** 官方 Brush.lightenBy（实例版，就地变亮） */
  lightenBy(fraction?: number, mode?: EnumValue): this {
    const f = fraction === undefined || typeof fraction !== 'number' ? 0.2 : fraction;
    void mode;
    if (this.type === BrushSolid) {
      this.color = Brush.lightenBy(this.color, f);
    } else if (this.type === BrushLinear || this.type === BrushRadial) {
      const arr = this._stops.slice();
      this._stops = [];
      for (let i = 0; i < arr.length; i++) {
        this.addColorStop(arr[i].offset, Brush.lightenBy(arr[i].color, f));
      }
    }
    return this;
  }

  /** 官方 Brush.darkenBy（实例版，就地变暗） */
  darkenBy(fraction?: number, mode?: EnumValue): this {
    const f = fraction === undefined || typeof fraction !== 'number' ? 0.2 : fraction;
    void mode;
    if (this.type === BrushSolid) {
      this.color = Brush.darkenBy(this.color, f);
    } else if (this.type === BrushLinear || this.type === BrushRadial) {
      const arr = this._stops.slice();
      this._stops = [];
      for (let i = 0; i < arr.length; i++) {
        this.addColorStop(arr[i].offset, Brush.darkenBy(arr[i].color, f));
      }
    }
    return this;
  }

  /** 官方 Brush.isDark（实例版） */
  isDark(): boolean {
    if (this.type === BrushSolid) return Brush.isDark(this.color);
    if (this.type === BrushLinear || this.type === BrushRadial) {
      const stops = this._stops;
      if (stops.length === 0) return false;
      if (this.type === BrushRadial) {
        return Brush.isDark(stops[0].color);
      }
      const half = stops.find((s: BrushStop) => s.offset === 0.5);
      if (half !== undefined) return Brush.isDark(half.color);
      if (stops.length === 2) return Brush.isDark(Brush.mix(stops[0].color, stops[1].color));
      let i1 = -1;
      let i2 = -1;
      let d1 = 1;
      let d2 = 1;
      for (let i = 0; i < stops.length; i++) {
        const d = Math.abs(0.5 - stops[i].offset);
        if (d1 > d2) {
          if (d < d1) {
            i1 = i;
            d1 = d;
          }
        } else if (d < d2) {
          i2 = i;
          d2 = d;
        }
      }
      if (i1 > i2) {
        const ti = i1;
        i1 = i2;
        i2 = ti;
        const td = d1;
        d1 = d2;
        d2 = td;
      }
      if (i1 < 0 || i2 < 0) return Brush.isDark(stops[0].color);
      const span = d2 - d1;
      const t = span === 0 ? 0.5 : 1 - d2 / span;
      return Brush.isDark(Brush.mix(stops[i1].color, stops[i2].color, t));
    }
    return false;
  }

  // ---- 官方 Brush 静态成员（阶段 5） ----

  /** 官方 Brush.isValidColor */
  static isValidColor(color: string): boolean {
    const g: any = typeof globalThis !== 'undefined' ? globalThis : undefined;
    if (g !== undefined && g.CSS !== undefined && typeof g.CSS.supports === 'function') {
      return g.CSS.supports('color', color);
    }
    return true;
  }

  /** 官方 Brush.mix：把两个颜色按 fraction 混合 */
  static mix(color1: string, color2: string, fraction?: number): string {
    const f = fraction === undefined ? 0.5 : fraction;
    const c1 = Color.parse(color1);
    const c2 = Color.parse(color2);
    if (c1 === null) return color1;
    if (c2 === null) return color1;
    const r = Math.round((c2.r - c1.r) * f + c1.r);
    const g = Math.round((c2.g - c1.g) * f + c1.g);
    const b = Math.round((c2.b - c1.b) * f + c1.b);
    const a = Math.round((c2.a - c1.a) * f + c1.a);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  }

  /** @deprecated 用 ColorSpace.HSL */
  static readonly HSL: EnumValue = ColorSpaceHSL;
  /** @deprecated 用 BrushType.Pattern */
  static readonly Pattern: EnumValue = BrushPattern;
}

/** 色标 */
export interface BrushStop {
  offset: number;
  color: string;
}

/** BrushLike 类型 */
export type BrushLike = Brush | string | null;

/**
 * 颜色工具函数
 */
export namespace Color {
  /** 解析 CSS 颜色字符串为 RGBA */
  export function parse(color: string): { r: number; g: number; b: number; a: number } | null {
    if (!color || typeof color !== 'string') return null;
    color = color.trim().toLowerCase();

    // 命名颜色
    const named = NAMED_COLORS[color];
    if (named) return named;

    // #RGB, #RRGGBB, #RRGGBBAA
    if (color.charAt(0) === '#') {
      return parseHex(color);
    }

    // rgb/rgba
    const rgbaMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1]),
        g: parseInt(rgbaMatch[2]),
        b: parseInt(rgbaMatch[3]),
        a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
      };
    }

    return null;
  }

  function parseHex(hex: string): { r: number; g: number; b: number; a: number } | null {
    let h = hex.slice(1);
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    if (h.length === 4) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    }
    if (h.length === 6 || h.length === 8) {
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
      };
    }
    return null;
  }

  /** RGBA 转字符串 */
  export function toString(r: number, g: number, b: number, a: number = 1): string {
    if (a < 1) {
      return `rgba(${r},${g},${b},${a})`;
    }
    return `rgb(${r},${g},${b})`;
  }
}

/** 常用命名颜色 */
const NAMED_COLORS: Record<string, { r: number; g: number; b: number; a: number }> = {
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  black: { r: 0, g: 0, b: 0, a: 1 },
  white: { r: 255, g: 255, b: 255, a: 1 },
  red: { r: 255, g: 0, b: 0, a: 1 },
  green: { r: 0, g: 128, b: 0, a: 1 },
  blue: { r: 0, g: 0, b: 255, a: 1 },
  yellow: { r: 255, g: 255, b: 0, a: 1 },
  cyan: { r: 0, g: 255, b: 255, a: 1 },
  magenta: { r: 255, g: 0, b: 255, a: 1 },
  orange: { r: 255, g: 165, b: 0, a: 1 },
  purple: { r: 128, g: 0, b: 128, a: 1 },
  gray: { r: 128, g: 128, b: 128, a: 1 },
  grey: { r: 128, g: 128, b: 128, a: 1 },
  pink: { r: 255, g: 192, b: 203, a: 1 },
  brown: { r: 165, g: 42, b: 42, a: 1 },
  lime: { r: 0, g: 255, b: 0, a: 1 },
  navy: { r: 0, g: 0, b: 128, a: 1 },
  olive: { r: 128, g: 128, b: 0, a: 1 },
  maroon: { r: 128, g: 0, b: 0, a: 1 },
  teal: { r: 0, g: 128, b: 128, a: 1 },
  aqua: { r: 0, g: 255, b: 255, a: 1 },
  silver: { r: 192, g: 192, b: 192, a: 1 },
  fuchsia: { r: 255, g: 0, b: 255, a: 1 },

};
