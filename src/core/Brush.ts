import { EnumValue, BrushSolid, BrushLinear, BrushRadial } from './EnumValues';
import { Point } from './Point';

/**
 * Brush - 画刷
 * 支持 Solid（纯色）、Linear（线性渐变）、Radial（径向渐变）
 */
export class Brush {
  /** 画刷类型 */
  public type: EnumValue;
  /** 纯色颜色值 */
  public color: string;
  /** 渐变色标 */
  private _stops: BrushStop[];
  /** 线性渐变起点 */
  public start: Point;
  /** 线性渐变终点 */
  public end: Point;
  /** 径向渐变中心 */
  public center: Point;
  /** 径向渐变焦点 */
  public focus: Point;
  /** 径向渐变半径 */
  public radius: number;

  constructor(type?: EnumValue | string) {
    if (typeof type === 'string') {
      this.type = BrushSolid;
      this.color = type;
    } else {
      this.type = type || BrushSolid;
      this.color = '';
    }
    this._stops = [];
    this.start = new Point(0, 0);
    this.end = new Point(1, 0);
    this.center = new Point(0.5, 0.5);
    this.focus = new Point(0.5, 0.5);
    this.radius = 0.5;
  }

  /** 获取色标列表 */
  get stops(): BrushStop[] {
    return this._stops;
  }

  /** 添加色标 */
  addColorStop(offset: number, color: string): this {
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

  /** 复制 */
  copy(): Brush {
    const b = new Brush(this.type);
    b.color = this.color;
    b.start = this.start.copy();
    b.end = this.end.copy();
    b.center = this.center.copy();
    b.focus = this.focus.copy();
    b.radius = this.radius;
    b._stops = this._stops.map(s => ({ ...s }));
    return b;
  }

  /** 创建 Canvas 渐变对象 */
  _createCanvasGradient(ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }): CanvasGradient | null {
    if (this.type === BrushSolid) return null;
    if (this.type === BrushLinear) {
      const x1 = bounds.x + this.start.x * bounds.width;
      const y1 = bounds.y + this.start.y * bounds.height;
      const x2 = bounds.x + this.end.x * bounds.width;
      const y2 = bounds.y + this.end.y * bounds.height;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      for (const stop of this._stops) {
        grad.addColorStop(stop.offset, stop.color);
      }
      return grad;
    }
    if (this.type === BrushRadial) {
      const cx = bounds.x + this.center.x * bounds.width;
      const cy = bounds.y + this.center.y * bounds.height;
      const fx = bounds.x + this.focus.x * bounds.width;
      const fy = bounds.y + this.focus.y * bounds.height;
      const r = this.radius * Math.max(bounds.width, bounds.height);
      const grad = ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
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

  /** 创建径向渐变画刷 */
  static Radial(centerX: number, centerY: number, radius: number, focusX?: number, focusY?: number): Brush {
    const b = new Brush(BrushRadial);
    b.center = new Point(centerX, centerY);
    b.radius = radius;
    if (focusX !== undefined && focusY !== undefined) {
      b.focus = new Point(focusX, focusY);
    }
    return b;
  }

  /** 判断是否为 Brush */
  static isBrush(b: any): b is Brush {
    return b instanceof Brush;
  }

  static randomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  static darken(color: string, fraction?: number): string {
    return Brush.darkenBy(color, fraction || 0.2);
  }

  static darkenBy(color: string, fraction: number): string {
    const c = Color.parse(color);
    if (!c) return color;
    const f = 1 - fraction;
    return Color.toString(Math.round(c.r * f), Math.round(c.g * f), Math.round(c.b * f), c.a);
  }

  static lighten(color: string, fraction?: number): string {
    return Brush.lightenBy(color, fraction || 0.2);
  }

  static lightenBy(color: string, fraction: number): string {
    const c = Color.parse(color);
    if (!c) return color;
    return Color.toString(
      Math.round(c.r + (255 - c.r) * fraction),
      Math.round(c.g + (255 - c.g) * fraction),
      Math.round(c.b + (255 - c.b) * fraction),
      c.a
    );
  }

  static isDark(color: string): boolean {
    const c = Color.parse(color);
    if (!c) return false;
    return (c.r * 0.299 + c.g * 0.587 + c.b * 0.114) < 128;
  }
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
