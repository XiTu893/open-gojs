import { GraphObject } from './GraphObject';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { EnumValue, WrapFit, WrapNone, WrapDesiredSize, OverflowClip, OverflowEllipsis, VerticalTop, VerticalCenter, VerticalBottom } from '../core/EnumValues';
import { Brush, BrushLike } from '../core/Brush';

export class TextBlock extends GraphObject {

  static WrapFit: EnumValue = WrapFit;
  static WrapDesiredSize: EnumValue = WrapDesiredSize;
  static WrapNone: EnumValue = WrapNone;
  static OverflowClip: EnumValue = OverflowClip;
  static OverflowEllipsis: EnumValue = OverflowEllipsis;
  static VerticalTop: EnumValue = VerticalTop;
  static VerticalCenter: EnumValue = VerticalCenter;
  static VerticalBottom: EnumValue = VerticalBottom;

  private _text: string = '';
  private _font: string = '10px sans-serif';
  private _stroke: BrushLike = 'black';
  private _textAlign: string = 'start';
  private _isMultiline: boolean = true;
  private _editable: boolean = false;
  private _wrap: EnumValue = WrapFit;
  private _overflow: EnumValue = OverflowClip;
  private _lineCount: number = 1;
  private _spacingAbove: number = 0;
  private _spacingBelow: number = 0;
  private _isUnderline: boolean = false;
  private _isStrikethrough: boolean = false;
  private _verticalAlignment: EnumValue = VerticalCenter;

  constructor(text?: string | Partial<TextBlock>, init?: Partial<TextBlock>) {
    super();
    this._className = 'TextBlock';
    if (typeof text === 'string') {
      this._text = text;
      if (init) {
        this.set(init as Partial<TextBlock>);
      }
    } else if (text && typeof text === 'object') {
      this.set(text as Partial<TextBlock>);
    }
  }

  get text(): string { return this._text; }
  set text(val: string) {
    if (this._text !== val) {
      this._text = val;
      this._invalidateMeasure();
    }
  }

  get font(): string { return this._font; }
  set font(val: string) {
    if (this._font !== val) {
      this._font = val;
      this._invalidateMeasure();
    }
  }

  get stroke(): BrushLike { return this._stroke; }
  set stroke(val: BrushLike) {
    if (this._stroke !== val) {
      this._stroke = val;
    }
  }

  get textAlign(): string { return this._textAlign; }
  set textAlign(val: string) {
    if (this._textAlign !== val) {
      this._textAlign = val;
    }
  }

  get isMultiline(): boolean { return this._isMultiline; }
  set isMultiline(val: boolean) {
    if (this._isMultiline !== val) {
      this._isMultiline = val;
      this._invalidateMeasure();
    }
  }

  get editable(): boolean { return this._editable; }
  set editable(val: boolean) { this._editable = val; }

  get wrap(): EnumValue { return this._wrap; }
  set wrap(val: EnumValue) {
    if (this._wrap !== val) {
      this._wrap = val;
      this._invalidateMeasure();
    }
  }

  get overflow(): EnumValue { return this._overflow; }
  set overflow(val: EnumValue) {
    if (this._overflow !== val) {
      this._overflow = val;
      this._invalidateMeasure();
    }
  }

  get lineCount(): number { return this._lineCount; }

  get spacingAbove(): number { return this._spacingAbove; }
  set spacingAbove(val: number) {
    if (this._spacingAbove !== val) {
      this._spacingAbove = val;
      this._invalidateMeasure();
    }
  }

  get spacingBelow(): number { return this._spacingBelow; }
  set spacingBelow(val: number) {
    if (this._spacingBelow !== val) {
      this._spacingBelow = val;
      this._invalidateMeasure();
    }
  }

  get isUnderline(): boolean { return this._isUnderline; }
  set isUnderline(val: boolean) {
    if (this._isUnderline !== val) {
      this._isUnderline = val;
      this._invalidateMeasure();
    }
  }

  get isStrikethrough(): boolean { return this._isStrikethrough; }
  set isStrikethrough(val: boolean) {
    if (this._isStrikethrough !== val) {
      this._isStrikethrough = val;
      this._invalidateMeasure();
    }
  }

  get verticalAlignment(): EnumValue { return this._verticalAlignment; }
  set verticalAlignment(val: EnumValue) {
    if (this._verticalAlignment !== val) {
      this._verticalAlignment = val;
      this._invalidateMeasure();
    }
  }

  get naturalSize(): Size {
    return new Size(this._naturalBounds.width, this._naturalBounds.height);
  }

  measure(width: number, height: number): void {
    this._measure(width, height);
  }

  _measure(widthConstraint: number, heightConstraint: number): void {
    if (!this._text) {
      this._naturalBounds = new Rect(0, 0, 0, 0);
      this._measuredBounds = new Rect(0, 0, 0, 0);
      this._lineCount = 0;
      return;
    }

    const canvas = TextBlock._tempCanvas;
    const ctx = canvas.getContext('2d')!;
    const measured = this._measureText(ctx, widthConstraint);

    this._lineCount = measured.lineCount;
    this._naturalBounds = new Rect(0, 0, measured.width, measured.height);

    const measuredWidth = Math.min(measured.width, widthConstraint);
    const measuredHeight = Math.min(measured.height, heightConstraint);
    this._measuredBounds = new Rect(0, 0, measuredWidth, measuredHeight);
    this._applySizeConstraints();
  }

  _measureText(ctx: CanvasRenderingContext2D, widthConstraint: number): { width: number; height: number; lineCount: number } {
    ctx.font = this._font;

    if (!this._isMultiline || this._wrap === WrapNone) {
      const metrics = ctx.measureText(this._text);
      const fontSize = TextBlock._getFontSize(this._font);
      return {
        width: metrics.width,
        height: fontSize + this._spacingAbove + this._spacingBelow,
        lineCount: 1,
      };
    }

    let wrapWidth = widthConstraint;
    if (this._wrap === WrapDesiredSize) {
      const dw = this.desiredSize;
      if (dw && dw.width > 0 && isFinite(dw.width)) {
        wrapWidth = dw.width;
      } else {
        const metrics = ctx.measureText(this._text);
        const fontSize = TextBlock._getFontSize(this._font);
        return {
          width: metrics.width,
          height: fontSize + this._spacingAbove + this._spacingBelow,
          lineCount: 1,
        };
      }
    }

    const lines = this._wrapText(ctx, this._text, wrapWidth);
    const fontSize = TextBlock._getFontSize(this._font);
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight + this._spacingAbove + this._spacingBelow;
    let maxWidth = 0;
    for (const line of lines) {
      const m = ctx.measureText(line);
      if (m.width > maxWidth) maxWidth = m.width;
    }

    return {
      width: maxWidth,
      height: totalHeight,
      lineCount: lines.length,
    };
  }

  private _wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split('\n');

    for (const paragraph of paragraphs) {
      if (paragraph === '') {
        lines.push('');
        continue;
      }

      const words = paragraph.split(/(\s+)/);
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine.replace(/\s+$/, ''));
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine.replace(/\s+$/, ''));
      }
    }

    return lines.length > 0 ? lines : [''];
  }

  private static _getFontSize(font: string): number {
    const match = font.match(/(\d+(?:\.\d+)?)px/);
    if (match) {
      return parseFloat(match[1]);
    }
    return 10;
  }

  private static _tempCanvas: HTMLCanvasElement = typeof document !== 'undefined'
    ? document.createElement('canvas')
    : null as any;

  _draw(ctx: CanvasRenderingContext2D): void {
    if (!this._text) return;

    ctx.save();
    ctx.font = this._font;
    ctx.textAlign = this._textAlign as CanvasTextAlign;
    ctx.textBaseline = 'top';

    if (this._stroke) {
      if (Brush.isBrush(this._stroke)) {
        const brush = this._stroke as Brush;
        const grad = brush._createCanvasGradient(ctx, this._actualBounds);
        if (grad) ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = this._stroke as string;
      }
    }

    const fontSize = TextBlock._getFontSize(this._font);
    const lineHeight = fontSize * 1.2;

    if (this._overflow === OverflowClip) {
      ctx.beginPath();
      ctx.rect(this._actualBounds.x, this._actualBounds.y, this._actualBounds.width, this._actualBounds.height);
      ctx.clip();
    }

    const yOffset = this._spacingAbove;

    if (!this._isMultiline || this._wrap === WrapNone) {
      let drawText = this._text;
      if (this._overflow === OverflowEllipsis) {
        const metrics = ctx.measureText(this._text);
        if (metrics.width > this._actualBounds.width) {
          while (drawText.length > 0 && ctx.measureText(drawText + '...').width > this._actualBounds.width) {
            drawText = drawText.slice(0, -1);
          }
          drawText += '...';
        }
      }
      ctx.fillText(drawText, 0, yOffset);
      if (this._isUnderline || this._isStrikethrough) {
        const tw = ctx.measureText(drawText).width;
        let lx = 0;
        if (this._textAlign === 'center') lx = (this._actualBounds.width - tw) / 2;
        else if (this._textAlign === 'right' || this._textAlign === 'end') lx = this._actualBounds.width - tw;
        const lineY = yOffset + fontSize * 0.85;
        ctx.beginPath();
        if (this._isUnderline) {
          ctx.moveTo(lx, lineY);
          ctx.lineTo(lx + tw, lineY);
        }
        if (this._isStrikethrough) {
          const strikeY = yOffset + fontSize * 0.45;
          ctx.moveTo(lx, strikeY);
          ctx.lineTo(lx + tw, strikeY);
        }
        ctx.strokeStyle = typeof this._stroke === 'string' ? this._stroke : 'black';
        ctx.lineWidth = Math.max(1, fontSize / 12);
        ctx.stroke();
      }
    } else {
      const lines = this._wrapText(ctx, this._text, this._actualBounds.width || Infinity);
      for (let i = 0; i < lines.length; i++) {
        let drawText = lines[i];
        if (this._overflow === OverflowEllipsis && i === lines.length - 1) {
          const metrics = ctx.measureText(drawText);
          if (metrics.width > this._actualBounds.width) {
            while (drawText.length > 0 && ctx.measureText(drawText + '...').width > this._actualBounds.width) {
              drawText = drawText.slice(0, -1);
            }
            drawText += '...';
          }
        }
        const lineY = yOffset + i * lineHeight;
        ctx.fillText(drawText, 0, lineY);
        if (this._isUnderline || this._isStrikethrough) {
          const tw = ctx.measureText(drawText).width;
          let lx = 0;
          if (this._textAlign === 'center') lx = (this._actualBounds.width - tw) / 2;
          else if (this._textAlign === 'right' || this._textAlign === 'end') lx = this._actualBounds.width - tw;
          ctx.beginPath();
          if (this._isUnderline) {
            const ulY = lineY + fontSize * 0.85;
            ctx.moveTo(lx, ulY);
            ctx.lineTo(lx + tw, ulY);
          }
          if (this._isStrikethrough) {
            const stY = lineY + fontSize * 0.45;
            ctx.moveTo(lx, stY);
            ctx.lineTo(lx + tw, stY);
          }
          ctx.strokeStyle = typeof this._stroke === 'string' ? this._stroke : 'black';
          ctx.lineWidth = Math.max(1, fontSize / 12);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  copy(): TextBlock {
    const tb = new TextBlock();
    this._copyPropertiesTo(tb);
    tb._text = this._text;
    tb._font = this._font;
    tb._stroke = Brush.isBrush(this._stroke) ? this._stroke.copy() : this._stroke;
    tb._textAlign = this._textAlign;
    tb._isMultiline = this._isMultiline;
    tb._editable = this._editable;
    tb._wrap = this._wrap;
    tb._overflow = this._overflow;
    tb._spacingAbove = this._spacingAbove;
    tb._spacingBelow = this._spacingBelow;
    tb._isUnderline = this._isUnderline;
    tb._isStrikethrough = this._isStrikethrough;
    tb._verticalAlignment = this._verticalAlignment;
    return tb;
  }
}

GraphObject.defineBuilder('TextBlock', TextBlock);
