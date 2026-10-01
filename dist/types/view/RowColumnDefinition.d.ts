import { EnumValue } from '../core/EnumValues';
import { Margin, MarginLike } from '../core/Margin';
import { Spot } from '../core/Spot';
import { Binding } from '../model/Binding';
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
    static readonly className: string;
    /** 官方 RowColumnDefinition 默认 isRow=true、index=0，因此默认行号为 0 */
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
    /** 官方 RowColumnDefinition.ek(other)：把 other 上已设置的值合并进本定义（供 Panel.addRowColumnDefinition 使用） */
    _setValuesFrom(other: RowColumnDefinition): void;
    /** 官方 Us：登记在本定义上的 Binding 列表 */
    private _bindings;
    /**
     * 官方 `RowColumnDefinition.bind(targetprop, sourceprop?, conv?, backconv?)`
     * 以及 `bind(binding)` 重载。
     * 官方 `Of(t,e,i,s)`：首参为 Binding 实例则直接登记，否则新建 Binding；
     * 指定 `backconv` 时自动切换为 TwoWay。
     */
    bind(bindingOrTargetProp: Binding | string, sourceprop?: string, conv?: (value: any, targetObject: any, model: any) => any, backconv?: (value: any, sourceData: any, model: any) => any): this;
    /**
     * 官方 `RowColumnDefinition.bindTwoWay(...)`：等价于 `bind(...)` 后调用 `Binding.makeTwoWay()`。
     * 官方 `s === void 0 && n.makeTwoWay()`（未显式给 backconv 时也做双向绑定）。
     */
    bindTwoWay(bindingOrTargetProp: Binding | string, sourceprop?: string, conv?: (value: any, targetObject: any, model: any) => any, backconv?: (value: any, sourceData: any, model: any) => any): this;
    theme(targetprop: string, sourceprop?: string, themeSource?: string, conv?: (value: any, targetObject: any, model: any) => any, themeconv?: (value: any, targetObject: any, model: any) => any): this;
    themeData(targetprop: string, sourceprop?: string, themeSource?: string, conv?: (value: any, targetObject: any, model: any) => any, themeconv?: (value: any, targetObject: any, model: any) => any): this;
    themeObject(targetprop: string, sourceprop?: string, themeSource?: string, conv?: (value: any, targetObject: any, model: any) => any, themeconv?: (value: any, targetObject: any, model: any) => any, objectSrcname?: string): this;
    themeModel(targetprop: string, sourceprop?: string, themeSource?: string, conv?: (value: any, targetObject: any, model: any) => any, themeconv?: (value: any, targetObject: any, model: any) => any): this;
    /** 官方：`"RowColumnDefinition (Row 0) #26"` / `"RowColumnDefinition (Column 3) #27"` */
    toString(): string;
    copy(): RowColumnDefinition;
    static Default: EnumValue;
    static None: EnumValue;
    static ProportionalExtra: EnumValue;
}
