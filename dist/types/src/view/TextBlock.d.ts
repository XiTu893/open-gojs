import { GraphObject } from './GraphObject';
import { Size } from '../core/Size';
import { EnumValue } from '../core/EnumValues';
import { BrushLike } from '../core/Brush';
import type { HTMLInfo } from '../tool/HTMLInfo';
import type { TextEditingTool } from '../tool/TextEditingTool';
export declare class TextBlock extends GraphObject {
    static readonly className: string;
    static WrapFit: EnumValue;
    static WrapDesiredSize: EnumValue;
    static WrapNone: EnumValue;
    static WrapBreakAll: EnumValue;
    static OverflowClip: EnumValue;
    static OverflowEllipsis: EnumValue;
    static FormatTrim: EnumValue;
    static FormatNone: EnumValue;
    static VerticalTop: EnumValue;
    static VerticalCenter: EnumValue;
    static VerticalBottom: EnumValue;
    /** 官方 TextBlock 省略号（overflow = Ellipsis 时使用），默认 "..." */
    private static _ellipsis;
    /** 官方基线位置回调，null 表示默认 `textHeight * 0.75` */
    private static _baseline;
    /** 官方下划线位置回调，null 表示默认 `textHeight * 0.8` */
    private static _underline;
    static getEllipsis(): string;
    static setEllipsis(val: string): void;
    static getBaseline(): ((textBlock: TextBlock, textHeight: number) => number) | null;
    static setBaseline(value: ((textBlock: TextBlock, textHeight: number) => number) | null): void;
    static getUnderline(): ((textBlock: TextBlock, textHeight: number) => number) | null;
    static setUnderline(value: ((textBlock: TextBlock, textHeight: number) => number) | null): void;
    /** 官方 `TextBlock.isValidFont(font)`：优先用 CSS.supports，环境不支持时保守返回 true */
    static isValidFont(font: string): boolean;
    private _text;
    private _font;
    private _stroke;
    private _textAlign;
    private _isMultiline;
    private _editable;
    private _wrap;
    private _overflow;
    private _lineCount;
    private _spacingAbove;
    private _spacingBelow;
    private _isUnderline;
    private _isStrikethrough;
    private _verticalAlignment;
    private _textEditor;
    private _errorFunction;
    private _textValidation;
    private _textEdited;
    private _letterSpacing;
    private _wordSpacing;
    private _formatting;
    private _maxLines;
    private _choices;
    private _isOverflowed;
    private _metricsWidth;
    private _metricsConstraint;
    private _metricsFontHeight;
    private _metricsLinesAdded;
    private _metricsArrSize;
    private _metricsArrText;
    private _metricsText;
    constructor(text?: string | Partial<TextBlock>, init?: Partial<TextBlock>);
    get text(): string;
    set text(val: string);
    get font(): string;
    set font(val: string);
    get stroke(): BrushLike;
    set stroke(val: BrushLike);
    get textAlign(): string;
    set textAlign(val: string);
    get isMultiline(): boolean;
    set isMultiline(val: boolean);
    get editable(): boolean;
    set editable(val: boolean);
    get wrap(): EnumValue;
    set wrap(val: EnumValue);
    get overflow(): EnumValue;
    set overflow(val: EnumValue);
    get lineCount(): number;
    get spacingAbove(): number;
    set spacingAbove(val: number);
    get spacingBelow(): number;
    set spacingBelow(val: number);
    get isUnderline(): boolean;
    set isUnderline(val: boolean);
    get isStrikethrough(): boolean;
    set isStrikethrough(val: boolean);
    get verticalAlignment(): EnumValue;
    set verticalAlignment(val: EnumValue);
    get textEditor(): HTMLInfo | null;
    set textEditor(val: HTMLInfo | null);
    get errorFunction(): ((tool: TextEditingTool, oldString: string, newString: string) => void) | null;
    set errorFunction(val: ((tool: TextEditingTool, oldString: string, newString: string) => void) | null);
    get textValidation(): ((thisTextBlock: TextBlock, oldString: string, newString: string) => boolean) | null;
    set textValidation(val: ((thisTextBlock: TextBlock, oldString: string, newString: string) => boolean) | null);
    get textEdited(): ((thisTextBlock: TextBlock, oldString: string, newString: string) => void) | null;
    set textEdited(val: ((thisTextBlock: TextBlock, oldString: string, newString: string) => void) | null);
    get letterSpacing(): string;
    set letterSpacing(val: string);
    get wordSpacing(): string;
    set wordSpacing(val: string);
    get formatting(): EnumValue;
    set formatting(val: EnumValue);
    get maxLines(): number;
    set maxLines(val: number);
    get choices(): string[] | null;
    set choices(val: string[] | null);
    /** 官方只读：measure 时因 maxLines 截断产生（`TextBlock.isOverflowed`） */
    get isOverflowed(): boolean;
    /** 官方只读：单行文本高度（不含 spacingAbove/spacingBelow） */
    get lineHeight(): number;
    /** 官方 measure 缓存的七元组：[maxLineWidth, measure 宽约束, fontHeight, 本次量测行数, arrSize, arrText, text] */
    getMetrics(): Array<number | number[] | string[] | string | null>;
    /** 官方 `TextBlock.metrics`：measure 结果快照 */
    get metrics(): {
        arrSize: number[];
        arrText: Array<string | null>;
        maxLineWidth: number;
        fontHeight: number | null;
    };
    /** 官方 `TextBlock.getStringWidth(str)`：用本对象字体量测字符串宽度 */
    getStringWidth(str: string): number;
    get naturalSize(): Size;
    measure(width: number, height: number): void;
    _measure(widthConstraint: number, heightConstraint: number): void;
    private _getLineHeight;
    private _applySpacing;
    _measureText(ctx: CanvasRenderingContext2D, widthConstraint: number): {
        width: number;
        height: number;
        lineCount: number;
        lines: string[];
        lineWidths: number[];
        lineHeight: number;
    };
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
    private _wrapText;
    private static _getFontSize;
    private static _tempCanvas;
    /**
     * 官方 TextBlock 的对齐语义：textAlign 决定文本在自身 actualBounds 内的水平位置。
     * 返回 fillText 使用的锚点 x（文本左边缘），配合 ctx.textAlign='left'。
     */
    private _alignX;
    _draw(ctx: CanvasRenderingContext2D): void;
    copy(): TextBlock;
}
