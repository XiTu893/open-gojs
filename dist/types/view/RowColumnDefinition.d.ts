import { EnumValue } from '../core/EnumValues';
import { Margin, MarginLike } from '../core/Margin';
import { Spot } from '../core/Spot';
import type { Panel } from './Panel';
/**
 * RowColumnDefinition - defines the sizing and appearance of a row or column in a Table panel.
 *
 * 官方 RowColumnDefinition 语义移植：
 * - actual(Z): 实际计算尺寸（setter 按 minimum/maximum/width(height) 夹取）
 * - measured(Mi): 内容需求累计（measure 阶段填充）
 * - position(wt): arrange 前由 measure 写入的列/行起始位置
 * - sizing: Default → 取面板 rowSizing/columnSizing；None → 固定；ProportionalExtra → 按比例分配富余
 * - computeEffectiveSpacing/Top: 分隔线 + separatorPadding 的间距贡献
 */
export declare class RowColumnDefinition {
    private _row;
    private _column;
    private _height;
    private _width;
    private _minimum;
    private _maximum;
    private _sizing;
    private _stretch;
    private _alignment;
    private _separatorStroke;
    private _separatorStrokeWidth;
    private _separatorDashArray;
    private _separatorPadding;
    private _background;
    private _coversSeparators;
    private _spanAllocation;
    /** 官方 Z：实际尺寸 */
    private _actual;
    /** 官方 Mi：内容需求累计 */
    private _measured;
    /** 官方 wt：位置偏移 */
    private _position;
    /** 官方 rn：所属面板 */
    private _panel;
    constructor();
    set(props: Record<string, any>): this;
    /** 官方 _a：设置所属面板 */
    _setPanel(panel: Panel | null): void;
    get panel(): Panel | null;
    get isRow(): boolean;
    get index(): number;
    get row(): number;
    set row(val: number);
    get column(): number;
    set column(val: number);
    get height(): number;
    set height(val: number);
    get width(): number;
    set width(val: number);
    get minimum(): number;
    set minimum(val: number);
    get maximum(): number;
    set maximum(val: number);
    get sizing(): EnumValue;
    set sizing(val: EnumValue);
    get stretch(): EnumValue;
    set stretch(val: EnumValue);
    get alignment(): Spot;
    set alignment(val: Spot);
    get separatorStroke(): any;
    set separatorStroke(val: any);
    get separatorStrokeWidth(): number;
    set separatorStrokeWidth(val: number);
    get separatorDashArray(): number[] | null;
    set separatorDashArray(val: number[] | null);
    get separatorPadding(): Margin | null;
    set separatorPadding(val: MarginLike | null);
    get background(): any;
    set background(val: any);
    get coversSeparators(): boolean;
    set coversSeparators(val: boolean);
    get spanAllocation(): ((elt: any, def: RowColumnDefinition, extra: number) => number) | null;
    set spanAllocation(val: ((elt: any, def: RowColumnDefinition, extra: number) => number) | null);
    /** 官方 actual(Z) */
    get actual(): number;
    set actual(val: number);
    /** 官方 measured(Mi) */
    get measured(): number;
    set measured(val: number);
    /** 官方 wt */
    get position(): number;
    set position(val: number);
    /** 官方 total = Z + spacing */
    get total(): number;
    /** 官方 mS：sizing Default → 面板 rowSizing/columnSizing */
    effectiveSizing(): EnumValue;
    /** 官方 computeEffectiveSpacingTop(t)：首个非零定义之前的分隔间距（上方/左方） */
    computeEffectiveSpacingTop(firstIdx: number): number;
    /** 官方 computeEffectiveSpacing() */
    computeEffectiveSpacing(): number;
    copy(): RowColumnDefinition;
    static Default: EnumValue;
    static None: EnumValue;
    static ProportionalExtra: EnumValue;
}
