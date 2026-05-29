import { EnumValue, SizingNone } from '../core/EnumValues';

/**
 * RowColumnDefinition - defines the sizing and appearance of a row or column in a Table panel.
 */
export class RowColumnDefinition {
  private _row: number = NaN;
  private _column: number = NaN;
  private _height: number = NaN;
  private _width: number = NaN;
  private _minimum: number = 0;
  private _maximum: number = Infinity;
  private _sizing: EnumValue = SizingNone;
  private _separatorStroke: any = null;
  private _separatorStrokeWidth: number = 1;
  private _separatorDashArray: number[] | null = null;
  private _background: any = null;
  private _coversSeparators: boolean = false;

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

  get row(): number { return this._row; }
  set row(val: number) {
    if (this._row === val) return;
    this._row = val;
  }

  get column(): number { return this._column; }
  set column(val: number) {
    if (this._column === val) return;
    this._column = val;
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

  get background(): any { return this._background; }
  set background(val: any) {
    this._background = val;
  }

  get coversSeparators(): boolean { return this._coversSeparators; }
  set coversSeparators(val: boolean) {
    if (this._coversSeparators === val) return;
    this._coversSeparators = val;
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
    def._separatorStroke = this._separatorStroke;
    def._separatorStrokeWidth = this._separatorStrokeWidth;
    def._separatorDashArray = this._separatorDashArray ? [...this._separatorDashArray] : null;
    def._background = this._background;
    def._coversSeparators = this._coversSeparators;
    return def;
  }
}
