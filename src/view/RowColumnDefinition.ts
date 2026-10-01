import { EnumValue, PanelTable, SizingDefault, SizingNone, SizingProp, StretchDefault } from '../core/EnumValues';
import { Margin, MarginLike } from '../core/Margin';
import { Spot } from '../core/Spot';
import { Binding } from '../model/Binding';
import { ensureHashId } from '../core/HashId';
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
export class RowColumnDefinition {
  static readonly className: string = "RowColumnDefinition";
  /** 官方 RowColumnDefinition 默认 isRow=true、index=0，因此默认行号为 0 */
  private _row: number = 0;
  private _column: number = NaN;
  private _height: number = NaN;
  private _width: number = NaN;
  private _minimum: number = 0;
  private _maximum: number = Infinity;
  private _sizing: EnumValue = SizingDefault;
  private _stretch: EnumValue = StretchDefault;
  private _alignment: Spot = Spot.Default;
  private _separatorStroke: any = null;
  private _separatorStrokeWidth: number = NaN;
  private _separatorDashArray: number[] | null = null;
  private _separatorPadding: Margin | null = null;
  private _background: any = null;
  private _coversSeparators: boolean = false;
  private _spanAllocation: ((elt: any, def: RowColumnDefinition, extra: number) => number) | null = null;

  /** 官方 Z：实际尺寸 */
  private _actual: number = 0;
  /** 官方 Mi：内容需求累计 */
  private _measured: number = 0;
  /** 官方 wt：位置偏移 */
  private _position: number = 0;
  /** 官方 rn：所属面板 */
  private _panel: Panel | null = null;

  constructor() {
  }

  set(props: Record<string, any>): this {
    if (!props) return this;
    const keys = Object.keys(props);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key in this) {
        (this as any)[key] = props[key];
      }
    }
    return this;
  }

  /** 官方 _a：设置所属面板 */
  _setPanel(panel: Panel | null): void {
    this._panel = panel;
  }

  get panel(): Panel | null { return this._panel; }

  get isRow(): boolean { return !isNaN(this._row); }

  get index(): number { return this.isRow ? this._row : this._column; }

  get row(): number { return this._row; }
  set row(val: number) {
    if (this._row === val) return;
    this._row = val;
    if (!isNaN(val)) this._column = NaN;
  }

  get column(): number { return this._column; }
  set column(val: number) {
    if (this._column === val) return;
    this._column = val;
    if (!isNaN(val)) this._row = NaN;
  }

  get height(): number { return this._height; }
  set height(val: number) {
    if (this._height === val) return;
    this._height = val;
  }

  get width(): number { return this._width; }
  set width(val: number) {
    if (this._width === val) return;
    this._width = val;
  }

  get minimum(): number { return this._minimum; }
  set minimum(val: number) {
    if (this._minimum === val) return;
    this._minimum = val;
  }

  get maximum(): number { return this._maximum; }
  set maximum(val: number) {
    if (this._maximum === val) return;
    this._maximum = val;
  }

  get sizing(): EnumValue { return this._sizing; }
  set sizing(val: EnumValue) {
    if (this._sizing === val) return;
    this._sizing = val;
  }

  get stretch(): EnumValue { return this._stretch; }
  set stretch(val: EnumValue) {
    if (this._stretch === val) return;
    this._stretch = val;
  }

  get alignment(): Spot { return this._alignment; }
  set alignment(val: Spot) {
    if (this._alignment === val) return;
    this._alignment = val;
  }

  get separatorStroke(): any { return this._separatorStroke; }
  set separatorStroke(val: any) {
    this._separatorStroke = val;
  }

  get separatorStrokeWidth(): number { return this._separatorStrokeWidth; }
  set separatorStrokeWidth(val: number) {
    if (this._separatorStrokeWidth === val) return;
    this._separatorStrokeWidth = val;
  }

  get separatorDashArray(): number[] | null { return this._separatorDashArray; }
  set separatorDashArray(val: number[] | null) {
    this._separatorDashArray = val;
  }

  get separatorPadding(): Margin | null { return this._separatorPadding; }
  set separatorPadding(val: MarginLike | null) {
    this._separatorPadding = val === null ? null : Margin.isMargin(val) ? val : new Margin(val as number);
  }

  get background(): any { return this._background; }
  set background(val: any) {
    this._background = val;
  }

  get coversSeparators(): boolean { return this._coversSeparators; }
  set coversSeparators(val: boolean) {
    this._coversSeparators = val;
  }

  get spanAllocation(): ((elt: any, def: RowColumnDefinition, extra: number) => number) | null {
    return this._spanAllocation;
  }
  set spanAllocation(val: ((elt: any, def: RowColumnDefinition, extra: number) => number) | null) {
    this._spanAllocation = val;
  }

  /** 官方 actual(Z) */
  get actual(): number { return this._actual; }
  set actual(val: number) {
    if (!isNaN(this._width) && !this.isRow || !isNaN(this._height) && this.isRow) {
      const fixed = this.isRow ? this._height : this._width;
      this._actual = Math.max(Math.min(this._maximum, fixed), this._minimum);
    } else {
      this._actual = Math.max(Math.min(this._maximum, val), this._minimum);
    }
  }

  /** 官方 measured(Mi) */
  get measured(): number { return this._measured; }
  set measured(val: number) { this._measured = val; }

  /** 官方 wt */
  get position(): number { return this._position; }
  set position(val: number) { this._position = val; }

  /** 官方 total = Z + spacing */
  get total(): number { return this._actual + this.computeEffectiveSpacing(); }

  /** 官方 mS：sizing Default → 面板 rowSizing/columnSizing */
  effectiveSizing(): EnumValue {
    if (this._sizing === SizingDefault) {
      const p = this._panel;
      if (p === null) return SizingNone;
      return this.isRow ? p.rowSizing : p.columnSizing;
    }
    return this._sizing;
  }

  /** 官方 computeEffectiveSpacingTop(t)：首个非零定义之前的分隔间距（上方/左方） */
  computeEffectiveSpacingTop(firstIdx: number): number {
    let stroke = 0;
    const panel = this._panel;
    if (this.index !== firstIdx) {
      let s = this._separatorStroke;
      if (s === null && panel !== null) s = this.isRow ? panel.defaultRowSeparatorStroke : panel.defaultColumnSeparatorStroke;
      if (s !== null && s !== undefined && s !== '') {
        stroke = this._separatorStrokeWidth;
        if (isNaN(stroke)) stroke = panel !== null ? (this.isRow ? panel.defaultRowSeparatorStrokeWidth : panel.defaultColumnSeparatorStrokeWidth) : 0;
      }
    }
    let pad = this._separatorPadding;
    if (pad === null) {
      if (panel !== null) pad = panel.defaultSeparatorPadding;
      else return stroke;
    }
    return stroke + (this.isRow ? pad.top : pad.left);
  }

  /** 官方 computeEffectiveSpacing() */
  computeEffectiveSpacing(): number {
    let stroke = 0;
    const panel = this._panel;
    let firstIdx = 0;
    const isRow = this.isRow;
    if (panel !== null && panel.type === PanelTable) {
      const defs = isRow ? panel._rowDefinitions : panel._columnDefinitions;
      for (let i = 0; i < defs.length; i++) {
        const d = defs[i];
        if (d !== undefined && d !== null && d._actual !== 0) {
          firstIdx = d.index;
          break;
        }
      }
    }
    if (this.index !== firstIdx) {
      let s = this._separatorStroke;
      if (s === null && panel !== null) s = isRow ? panel.defaultRowSeparatorStroke : panel.defaultColumnSeparatorStroke;
      if (s !== null && s !== undefined && s !== '') {
        stroke = this._separatorStrokeWidth;
        if (isNaN(stroke)) stroke = panel !== null ? (isRow ? panel.defaultRowSeparatorStrokeWidth : panel.defaultColumnSeparatorStrokeWidth) : 0;
      }
    }
    let pad = this._separatorPadding;
    if (pad === null) {
      if (panel !== null) pad = panel.defaultSeparatorPadding;
      else return stroke;
    }
    return stroke + (isRow ? pad.top + pad.bottom : pad.left + pad.right);
  }

  /** 官方 RowColumnDefinition.ek(other)：把 other 上已设置的值合并进本定义（供 Panel.addRowColumnDefinition 使用） */
  _setValuesFrom(other: RowColumnDefinition): void {
    if (!other) return;
    if (other.isRow) this._height = other._height;
    else this._width = other._width;
    this._minimum = other._minimum;
    this._maximum = other._maximum;
    this._alignment = other._alignment.copy();
    this._stretch = other._stretch;
    this._sizing = other._sizing;
    this._separatorPadding = other._separatorPadding ? other._separatorPadding.copy() : null;
    this._separatorStroke = other._separatorStroke;
    this._separatorStrokeWidth = other._separatorStrokeWidth;
    this._separatorDashArray = other._separatorDashArray ? [...other._separatorDashArray] : null;
    this._background = other._background;
    this._coversSeparators = other._coversSeparators;
    this._spanAllocation = other._spanAllocation;
  }

  /** 官方 Us：登记在本定义上的 Binding 列表 */
  private _bindings: Binding[] = [];

  /**
   * 官方 `RowColumnDefinition.bind(targetprop, sourceprop?, conv?, backconv?)`
   * 以及 `bind(binding)` 重载。
   * 官方 `Of(t,e,i,s)`：首参为 Binding 实例则直接登记，否则新建 Binding；
   * 指定 `backconv` 时自动切换为 TwoWay。
   */
  bind(
    bindingOrTargetProp: Binding | string,
    sourceprop?: string,
    conv?: (value: any, targetObject: any, model: any) => any,
    backconv?: (value: any, sourceData: any, model: any) => any
  ): this {
    const binding = typeof bindingOrTargetProp === 'string'
      ? new Binding(bindingOrTargetProp, sourceprop, conv)
      : bindingOrTargetProp;
    if (backconv !== undefined && backconv !== null) binding.makeTwoWay(backconv);
    this._bindings.push(binding);
    return this;
  }

  /**
   * 官方 `RowColumnDefinition.bindTwoWay(...)`：等价于 `bind(...)` 后调用 `Binding.makeTwoWay()`。
   * 官方 `s === void 0 && n.makeTwoWay()`（未显式给 backconv 时也做双向绑定）。
   */
  bindTwoWay(
    bindingOrTargetProp: Binding | string,
    sourceprop?: string,
    conv?: (value: any, targetObject: any, model: any) => any,
    backconv?: (value: any, sourceData: any, model: any) => any
  ): this {
    const binding = typeof bindingOrTargetProp === 'string'
      ? new Binding(bindingOrTargetProp, sourceprop, conv)
      : bindingOrTargetProp;
    binding.makeTwoWay(backconv);
    this._bindings.push(binding);
    return this;
  }

  theme(
    targetprop: string,
    sourceprop?: string,
    themeSource?: string,
    conv?: (value: any, targetObject: any, model: any) => any,
    themeconv?: (value: any, targetObject: any, model: any) => any
  ): this {
    const binding = new Binding(targetprop, sourceprop || targetprop, conv || themeconv);
    binding.sourceObject = themeSource || '';
    this._bindings.push(binding);
    return this;
  }

  themeData(
    targetprop: string,
    sourceprop?: string,
    themeSource?: string,
    conv?: (value: any, targetObject: any, model: any) => any,
    themeconv?: (value: any, targetObject: any, model: any) => any
  ): this {
    const binding = new Binding(targetprop, sourceprop || targetprop, conv || themeconv);
    binding.sourceObject = 'model';
    this._bindings.push(binding);
    return this;
  }

  themeObject(
    targetprop: string,
    sourceprop?: string,
    themeSource?: string,
    conv?: (value: any, targetObject: any, model: any) => any,
    themeconv?: (value: any, targetObject: any, model: any) => any,
    objectSrcname?: string
  ): this {
    const binding = new Binding(targetprop, sourceprop || targetprop, conv || themeconv);
    binding.sourceObject = objectSrcname !== undefined ? objectSrcname : (themeSource || '');
    this._bindings.push(binding);
    return this;
  }

  themeModel(
    targetprop: string,
    sourceprop?: string,
    themeSource?: string,
    conv?: (value: any, targetObject: any, model: any) => any,
    themeconv?: (value: any, targetObject: any, model: any) => any
  ): this {
    const binding = new Binding(targetprop, sourceprop || targetprop, conv || themeconv);
    binding.sourceObject = 'theme';
    this._bindings.push(binding);
    return this;
  }

  /** 官方：`"RowColumnDefinition (Row 0) #26"` / `"RowColumnDefinition (Column 3) #27"` */
  toString(): string {
    return `RowColumnDefinition (${this.isRow ? 'Row' : 'Column'} ${this.index}) #${ensureHashId(this)}`;
  }

  copy(): RowColumnDefinition {
    const def = new RowColumnDefinition();
    def._row = this._row;
    def._column = this._column;
    def._height = this._height;
    def._width = this._width;
    def._minimum = this._minimum;
    def._maximum = this._maximum;
    def._sizing = this._sizing;
    def._stretch = this._stretch;
    def._alignment = this._alignment;
    def._separatorStroke = this._separatorStroke;
    def._separatorStrokeWidth = this._separatorStrokeWidth;
    def._separatorDashArray = this._separatorDashArray ? [...this._separatorDashArray] : null;
    def._separatorPadding = this._separatorPadding;
    def._background = this._background;
    def._coversSeparators = this._coversSeparators;
    def._bindings = this._bindings.map(b => b.copy());
    return def;
  }

  static Default = SizingDefault;
  static None = SizingNone;
  static ProportionalExtra = SizingProp;
}
