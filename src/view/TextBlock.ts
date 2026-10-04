import { GraphObject } from './GraphObject';
import { Size } from '../core/Size';
import { Rect } from '../core/Rect';
import { EnumValue, WrapFit, WrapNone, WrapDesiredSize, WrapBreakAll, TextFormatTrim, TextFormatNone, OverflowClip, OverflowEllipsis, VerticalTop, VerticalCenter, VerticalBottom } from '../core/EnumValues';
import { Brush, BrushLike } from '../core/Brush';
import type { HTMLInfo } from '../tool/HTMLInfo';
import type { TextEditingTool } from '../tool/TextEditingTool';

export class TextBlock extends GraphObject {
  static readonly className: string = "TextBlock";

  static WrapFit: EnumValue = WrapFit;
  static WrapDesiredSize: EnumValue = WrapDesiredSize;
  static WrapNone: EnumValue = WrapNone;
  static WrapBreakAll: EnumValue = WrapBreakAll;
  static OverflowClip: EnumValue = OverflowClip;
  static OverflowEllipsis: EnumValue = OverflowEllipsis;
  static FormatTrim: EnumValue = TextFormatTrim;
  static FormatNone: EnumValue = TextFormatNone;
  static VerticalTop: EnumValue = VerticalTop;
  static VerticalCenter: EnumValue = VerticalCenter;
  static VerticalBottom: EnumValue = VerticalBottom;

  /** 官方 TextBlock 省略号（overflow = Ellipsis 时使用），默认 "..." */
  private static _ellipsis: string = '...';
  /** 官方基线位置回调，null 表示默认 `textHeight * 0.75` */
  private static _baseline: ((textBlock: TextBlock, textHeight: number) => number) | null = null;
  /** 官方下划线位置回调，null 表示默认 `textHeight * 0.8` */
  private static _underline: ((textBlock: TextBlock, textHeight: number) => number) | null = null;

  static getEllipsis(): string { return TextBlock._ellipsis; }
  static setEllipsis(val: string): void { TextBlock._ellipsis = val; }

  static getBaseline(): ((textBlock: TextBlock, textHeight: number) => number) | null { return TextBlock._baseline; }
  static setBaseline(value: ((textBlock: TextBlock, textHeight: number) => number) | null): void { TextBlock._baseline = value; }

  static getUnderline(): ((textBlock: TextBlock, textHeight: number) => number) | null { return TextBlock._underline; }
  static setUnderline(value: ((textBlock: TextBlock, textHeight: number) => number) | null): void { TextBlock._underline = value; }

  /** 官方 `TextBlock.isValidFont(font)`：优先用 CSS.supports，环境不支持时保守返回 true */
  static isValidFont(font: string): boolean {
    const g = typeof globalThis !== 'undefined' ? (globalThis as { CSS?: { supports?: (a: string, b: string) => boolean } }).CSS : undefined;
    if (g && typeof g.supports === 'function') {
      try {
        return g.supports('font', font);
      } catch (_e) {
        return true;
      }
    }
    return true;
  }

  private _text: string = '';
  private _font: string = '13px sans-serif';
  private _stroke: BrushLike = 'black';
  private _textAlign: string = 'start';
  private _isMultiline: boolean = true;
  private _editable: boolean = false;
  private _wrap: EnumValue = WrapDesiredSize;
  private _overflow: EnumValue = OverflowClip;
  private _lineCount: number = 1;
  private _spacingAbove: number = 0;
  private _spacingBelow: number = 0;
  private _isUnderline: boolean = false;
  private _isStrikethrough: boolean = false;
  private _verticalAlignment: EnumValue = VerticalCenter;
  private _textEditor: HTMLInfo | null = null;
  private _errorFunction: ((tool: TextEditingTool, oldString: string, newString: string) => void) | null = null;
  private _textValidation: ((thisTextBlock: TextBlock, oldString: string, newString: string) => boolean) | null = null;
  private _textEdited: ((thisTextBlock: TextBlock, oldString: string, newString: string) => void) | null = null;
  private _letterSpacing: string = '0px';
  private _wordSpacing: string = '0px';
  private _formatting: EnumValue = TextFormatTrim;
  private _maxLines: number = Infinity;
  private _choices: string[] | null = null;
  // graduatedFunction / graduatedSkip 继承自 GraphObject（官方都在 GraphObject 上）
  private _isOverflowed: boolean = false;

  // 官方 measure 缓存（Pi / eh / ko / Gn / He / Ci / qn）
  private _metricsWidth: number = 0;
  private _metricsConstraint: number = 0;
  private _metricsFontHeight: number | null = null;
  private _metricsLinesAdded: number = 0;
  private _metricsArrSize: number[] | null = null;
  private _metricsArrText: string[] | null = null;
  private _metricsText: string | null = null;

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
    // 官方语义：非 null 转字符串，null → ''
    const s = (val !== null && val !== undefined) ? String(val) : '';
    if (this._text !== s) {
      this._text = s;
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

  get textEditor(): HTMLInfo | null { return this._textEditor; }
  set textEditor(val: HTMLInfo | null) { this._textEditor = val; }

  get errorFunction(): ((tool: TextEditingTool, oldString: string, newString: string) => void) | null {
    return this._errorFunction;
  }
  set errorFunction(val: ((tool: TextEditingTool, oldString: string, newString: string) => void) | null) {
    this._errorFunction = val;
  }

  get textValidation(): ((thisTextBlock: TextBlock, oldString: string, newString: string) => boolean) | null {
    return this._textValidation;
  }
  set textValidation(val: ((thisTextBlock: TextBlock, oldString: string, newString: string) => boolean) | null) {
    this._textValidation = val;
  }

  get textEdited(): ((thisTextBlock: TextBlock, oldString: string, newString: string) => void) | null {
    return this._textEdited;
  }
  set textEdited(val: ((thisTextBlock: TextBlock, oldString: string, newString: string) => void) | null) {
    this._textEdited = val;
  }

  get letterSpacing(): string { return this._letterSpacing; }
  set letterSpacing(val: string) {
    if (this._letterSpacing !== val) {
      this._letterSpacing = val;
      this._invalidateMeasure();
    }
  }

  get wordSpacing(): string { return this._wordSpacing; }
  set wordSpacing(val: string) {
    if (this._wordSpacing !== val) {
      this._wordSpacing = val;
      this._invalidateMeasure();
    }
  }

  get formatting(): EnumValue { return this._formatting; }
  set formatting(val: EnumValue) {
    if (this._formatting !== val) {
      this._formatting = val;
      this._invalidateMeasure();
    }
  }

  get maxLines(): number { return this._maxLines; }
  set maxLines(val: number) {
    if (this._maxLines !== val) {
      this._maxLines = val;
      this._invalidateMeasure();
    }
  }

  get choices(): string[] | null { return this._choices; }
  set choices(val: string[] | null) { this._choices = val; }

  // graduatedStart / graduatedEnd 继承自 GraphObject



  /** 官方只读：measure 时因 maxLines 截断产生（`TextBlock.isOverflowed`） */
  get isOverflowed(): boolean { return this._isOverflowed; }

  /** 官方只读：单行文本高度（不含 spacingAbove/spacingBelow） */
  get lineHeight(): number {
    const canvas = TextBlock._tempCanvas as HTMLCanvasElement | null;
    const ctx = canvas !== null ? canvas.getContext('2d') : null;
    if (ctx === null) return 16;
    ctx.font = this._font;
    return this._getLineHeight(ctx, TextBlock._getFontSize(this._font));
  }

  /** 官方 measure 缓存的七元组：[maxLineWidth, measure 宽约束, fontHeight, 本次量测行数, arrSize, arrText, text] */
  getMetrics(): Array<number | number[] | string[] | string | null> {
    return [
      this._metricsWidth,
      this._metricsConstraint,
      this._metricsFontHeight,
      this._metricsLinesAdded,
      this._metricsArrSize,
      this._metricsArrText,
      this._metricsText !== null ? this._metricsText : '',
    ];
  }

  /** 官方 `TextBlock.metrics`：measure 结果快照 */
  get metrics(): { arrSize: number[]; arrText: Array<string | null>; maxLineWidth: number; fontHeight: number | null } {
    return {
      arrSize: this._metricsArrSize !== null ? this._metricsArrSize : [this._metricsWidth],
      arrText: this._metricsArrText !== null ? this._metricsArrText : [this._metricsText],
      maxLineWidth: this._metricsWidth,
      fontHeight: this._metricsFontHeight,
    };
  }

  /** 官方 `TextBlock.getStringWidth(str)`：用本对象字体量测字符串宽度 */
  getStringWidth(str: string): number {
    const canvas = TextBlock._tempCanvas as HTMLCanvasElement | null;
    const ctx = canvas !== null ? canvas.getContext('2d') : null;
    if (ctx === null) return str.length * 8;
    ctx.font = this._font;
    const w = ctx.measureText(str).width;
    return typeof w === 'number' && isFinite(w) ? w : str.length * 8;
  }

  get naturalSize(): Size {
    return new Size(this._naturalBounds.width, this._naturalBounds.height);
  }

  measure(width: number, height: number): void {
    this._measure(width, height);
  }

  _measure(widthConstraint: number, heightConstraint: number): void {
    this._isOverflowed = false;
    if (!this._text) {
      // 官方对空文本仍保留**一个空行**的高度：实测 connectionBoxNode 里那个
      // 宽度为 0 的 TextBlock，官方 naturalBounds = [0,0,0,13.72]，
      // 我们返回 [0,0,0,0]，导致整个节点少 13.73 高、连带连线路由与
      // documentBounds 全错。这里按同样规则补上行高。
      const canvas = TextBlock._tempCanvas;
      const ctx = canvas.getContext('2d')!;
      // 官方 hF：空文本 `return Pi=0, Te=1, s`，其中 s = max(0, ky()+spacing)，
      // ky() 用**本对象字体**测 "M" 的宽度 ×1.3。若不先设置 ctx.font，
      // 会沿用上次 measure 残留的字体（如 bold）导致行高偏大。
      ctx.font = this._font;
      this._applySpacing(ctx);
      const fontSize = TextBlock._getFontSize(this._font);
      const lh = this._getLineHeight(ctx, fontSize);
      const h = lh + this._spacingAbove + this._spacingBelow;
      this._naturalBounds = new Rect(0, 0, 0, h);
      this._measuredBounds = new Rect(0, 0, 0, h);
      this._lineCount = 1;
      this._metricsWidth = 0;
      this._metricsConstraint = widthConstraint;
      this._metricsFontHeight = null;
      this._metricsLinesAdded = 0;
      this._metricsArrSize = null;
      this._metricsArrText = null;
      this._metricsText = null;
      return;
    }

    // 官方 GraphObject.yt：measure 约束先按 maxSize 收紧（maxSize 是 wrap 约束的一部分），
    // TextBlock 随后按收紧后的约束换行 —— 例如 maxSize(160, NaN) 且约束为 Infinity 时按 160 换行。
    let wc = widthConstraint;
    let hc = heightConstraint;
    const ms = this.maxSize;
    if (wc > ms.width) wc = ms.width;
    if (hc > ms.height) hc = ms.height;

    const canvas = TextBlock._tempCanvas;
    const ctx = canvas.getContext('2d')!;
    const measured = this._measureText(ctx, wc);

    this._lineCount = measured.lineCount;
    this._naturalBounds = new Rect(0, 0, measured.width, measured.height);

    // 官方 measure 结束后写入的缓存（Pi / eh / ko / Gn / He / Ci / qn）
    this._metricsWidth = measured.width;
    this._metricsConstraint = widthConstraint;
    this._metricsFontHeight = measured.lineHeight;
    this._metricsLinesAdded = measured.lineCount;
    this._metricsArrSize = measured.lineWidths;
    this._metricsArrText = measured.lines;
    this._metricsText = this._text;

    const measuredWidth = Math.min(measured.width, wc);
    const measuredHeight = Math.min(measured.height, hc);
    this._measuredBounds = new Rect(0, 0, measuredWidth, measuredHeight);
    this._applySizeConstraints();
  }

  private _getLineHeight(ctx: CanvasRenderingContext2D, fontSize: number): number {
    // Match the official GoJS algorithm: the line height is derived from the
    // width of a capital "M" times 1.3. This is robust across browsers because
    // it does not depend on glyph-specific ascent/descent metrics (e.g. "M" has
    // no descender, so actualBoundingBoxDescent can be 0, which would clip the
    // bottom of descenders and the line).
    const m = ctx.measureText('M');
    const w = m.width;
    if (typeof w === 'number' && isFinite(w) && w > 0) {
      return w * 1.3;
    }
    return Math.ceil(fontSize * 1.2);
  }

  private _applySpacing(ctx: CanvasRenderingContext2D): void {
    const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string; wordSpacing?: string };
    c.letterSpacing = this._letterSpacing;
    c.wordSpacing = this._wordSpacing;
  }

  _measureText(
    ctx: CanvasRenderingContext2D,
    widthConstraint: number
  ): { width: number; height: number; lineCount: number; lines: string[]; lineWidths: number[]; lineHeight: number } {
    ctx.font = this._font;
    this._applySpacing(ctx);
    const fontSize = TextBlock._getFontSize(this._font);
    const lineHeight = this._getLineHeight(ctx, fontSize);

    if (this._wrap === WrapNone) {
      const m = ctx.measureText(this._text);
      const lines = [this._text];
      const lineWidths = [m.width];
      this._isOverflowed = false;
      return {
        width: m.width,
        height: lineHeight + this._spacingAbove + this._spacingBelow,
        lineCount: 1,
        lines,
        lineWidths,
        lineHeight,
      };
    }

    // 官方 hF：isMultiline=false 时先截断到第一个 \n，随后仍按宽度换行
    let rawText = this._text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    if (!this._isMultiline) {
      const nl = rawText.indexOf('\n');
      if (nl >= 0) rawText = rawText.substring(0, nl);
    }

    let wrapWidth = widthConstraint;
    if (this._wrap === WrapDesiredSize) {
      const dw = this.desiredSize;
      // 官方 Yd：desiredSize.width 为 NaN 时按**测量约束**换行
      //（faultTree 的 maxSize(100,NaN) → 约束被收紧为 100 → 两行）；
      // 只有 desiredSize.width 是有效数值时才按它换行。
      if (dw && dw.width > 0 && isFinite(dw.width)) {
        wrapWidth = dw.width;
      }
    }

    const lines = this._wrapText(ctx, rawText, wrapWidth);
    // 官方：超出 maxLines 时截断并置位 isOverflowed
    this._isOverflowed = false;
    if (this._maxLines !== Infinity && lines.length > this._maxLines) {
      lines.length = Math.max(0, Math.floor(this._maxLines));
      this._isOverflowed = true;
    }

    const lineWidths: number[] = [];
    let maxWidth = 0;
    for (const line of lines) {
      const w = ctx.measureText(line).width;
      lineWidths.push(w);
      if (w > maxWidth) maxWidth = w;
    }
    const totalHeight = lines.length * lineHeight + this._spacingAbove + this._spacingBelow;

    return {
      width: maxWidth,
      height: totalHeight,
      lineCount: lines.length,
      lines,
      lineWidths,
      lineHeight,
    };
  }

  /**
   * 官方 TextBlock.XN/hF/cg 换行算法逐条复刻：
   * - token（cg）= 一段非分隔字符 + 其后的分隔字符；分隔字符集是 `[ \u200B\xAD]`
   *   （官方 TextBlock.q3，**不是** \s——Tab 不参与断词）。
   * - 每个段落先整段 trim（formatting===Trim），每行压入前再 trim，
   *   因此产生断行的那个分隔空格**不会**留在下一行行首（我们旧实现
   *   把空格拆成独立 token，断行后下一行以空格开头，导致行宽多算一个
   *   空格 → 比官方提前断行、行首多一个空格）。
   * - 只有单个 token 自身超过宽度时才按字符切分（官方内层 while），
   *   切剩的尾巴还会继续拼接后续 token。
   */
  private _wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const trim = this._formatting === TextFormatTrim;
    const isSep = (ch: string): boolean => ch === ' ' || ch === '\u200B' || ch === '\xAD';
    const cg = (t: string): string => {
      if (this._wrap === WrapBreakAll) return t.substring(0, 1);
      const n = t.length;
      let e = 0;
      for (; e < n && !isSep(t.charAt(e)); e++);
      for (; e < n && isSep(t.charAt(e)); e++);
      return e >= t.length ? t : t.substring(0, e);
    };
    const W = (s: string): number => ctx.measureText(s).width;

    const paragraphs = text.split('\n');
    for (const paragraph of paragraphs) {
      let f = trim ? paragraph.trim() : paragraph;
      if (f === '') {
        lines.push('');
        continue;
      }

      while (f.length > 0) {
        let d = cg(f);
        f = f.substring(d.length);

        // 单个 token 超宽：按字符切行（官方内层 while）
        while (W(d) > maxWidth) {
          let q = 1;
          let o = W(d.substring(0, q));
          while (o <= maxWidth) {
            q++;
            o = W(d.substring(0, q));
          }
          q--;
          if (q < 1) q = 1;
          const head = d.substring(0, q);
          if (head !== '') lines.push(head);
          d = d.substring(q);
        }

        // 拼接后续 token 直到超宽
        let m = cg(f);
        let o = W(d + m);
        while (m.length > 0 && o <= maxWidth) {
          d += m;
          f = f.substring(m.length);
          m = cg(f);
          const p = trim ? (d + m).trim() : d + m;
          o = W(p);
        }

        if (trim) d = d.trim();
        if (d === '') continue;
        if (d.charAt(d.length - 1) === '\xAD') d = d.substring(0, d.length - 1) + '\u2010';
        lines.push(d);
      }
    }

    return lines.length > 0 ? lines : [''];
  }

  private static _getFontSize(font: string): number {
    const px = font.match(/(\d+(?:\.\d+)?)px/);
    if (px) {
      return parseFloat(px[1]);
    }
    // 官方 Font 大小单位换算：pt → px（1pt = 4/3px）
    const pt = font.match(/(\d+(?:\.\d+)?)pt\b/);
    if (pt) {
      return parseFloat(pt[1]) * 4 / 3;
    }
    const em = font.match(/(\d+(?:\.\d+)?)em\b/);
    if (em) {
      return parseFloat(em[1]) * 16;
    }
    const pct = font.match(/(\d+(?:\.\d+)?)%/);
    if (pct) {
      return parseFloat(pct[1]) * 0.16;
    }
    return 10;
  }

  private static _tempCanvas: HTMLCanvasElement = typeof document !== 'undefined'
    ? document.createElement('canvas')
    : null as any;

  /**
   * 官方 TextBlock 的对齐语义：textAlign 决定文本在自身 actualBounds 内的水平位置。
   * 返回 fillText 使用的锚点 x（文本左边缘），配合 ctx.textAlign='left'。
   */
  private _alignX(textWidth: number): number {
    const boxWidth = this._actualBounds.width || 0;
    if (this._textAlign === 'center') return (boxWidth - textWidth) / 2;
    if (this._textAlign === 'right' || this._textAlign === 'end') return boxWidth - textWidth;
    return 0;
  }

  _draw(ctx: CanvasRenderingContext2D): void {
    if (!this._text) return;

    ctx.save();
    ctx.font = this._font;
    this._applySpacing(ctx);
    // 对齐由 _alignX 自行换算成锚点 x（fillText 的 x 是文本左边缘），
    // 若同时把 ctx.textAlign 设为 center/right，文本会以 x=0 为锚点绘制而整体溢出到左侧。
    ctx.textAlign = 'left';
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
    const lineHeight = this._getLineHeight(ctx, fontSize);

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
          while (drawText.length > 0 && ctx.measureText(drawText + TextBlock._ellipsis).width > this._actualBounds.width) {
            drawText = drawText.slice(0, -1);
          }
          drawText += TextBlock._ellipsis;
        }
      }
      const singleWidth = ctx.measureText(drawText).width;
      ctx.fillText(drawText, this._alignX(singleWidth), yOffset);
      if (this._isUnderline || this._isStrikethrough) {
        const tw = singleWidth;
        const lx = this._alignX(tw);
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
            while (drawText.length > 0 && ctx.measureText(drawText + TextBlock._ellipsis).width > this._actualBounds.width) {
              drawText = drawText.slice(0, -1);
            }
            drawText += TextBlock._ellipsis;
          }
        }
        const lineY = yOffset + i * lineHeight;
        const lineWidth = ctx.measureText(drawText).width;
        ctx.fillText(drawText, this._alignX(lineWidth), lineY);
        if (this._isUnderline || this._isStrikethrough) {
          const tw = lineWidth;
          const lx = this._alignX(tw);
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
    tb._lineCount = this._lineCount;
    tb._textEditor = this._textEditor;
    tb._errorFunction = this._errorFunction;
    tb._textValidation = this._textValidation;
    tb._textEdited = this._textEdited;
    tb._letterSpacing = this._letterSpacing;
    tb._wordSpacing = this._wordSpacing;
    tb._formatting = this._formatting;
    tb._maxLines = this._maxLines;
    tb._choices = this._choices !== null ? this._choices.slice() : null;
    // graduated* 已由 GraphObject._copyPropertiesTo 复制
    // graduated* 已由 GraphObject._copyPropertiesTo 复制
    return tb;
  }
}

GraphObject.defineBuilder('TextBlock', TextBlock);
