import { Diagram } from './Diagram';
import { EnumValue, AutoScaleUniform } from '../core/EnumValues';

export class Palette extends Diagram {

  constructor(divId: string | HTMLDivElement) {
    super(divId);
    this._autoScale = AutoScaleUniform;
    this._setupPalette();
  }

  get isReadOnly(): boolean {
    return true;
  }

  set isReadOnly(_val: boolean) {
  }

  get allowSelect(): boolean {
    return this._allowSelect;
  }

  set allowSelect(val: boolean) {
    this._allowSelect = val;
  }

  get allowDragOut(): boolean {
    return this._allowDragOut;
  }

  set allowDragOut(val: boolean) {
    this._allowDragOut = val;
  }

  get allowMove(): boolean {
    return false;
  }

  set allowMove(_val: boolean) {
  }

  get allowDelete(): boolean {
    return false;
  }

  set allowDelete(_val: boolean) {
  }

  get allowCopy(): boolean {
    return false;
  }

  set allowCopy(_val: boolean) {
  }

  get autoScale(): EnumValue {
    return this._autoScale || AutoScaleUniform;
  }

  set autoScale(val: EnumValue) {
    this._autoScale = val;
  }

  copy(): Palette {
    const palette = new Palette(this.div || '');
    palette._autoScale = this._autoScale;
    palette.allowSelect = this.allowSelect;
    palette.allowDragOut = this.allowDragOut;
    return palette;
  }

  private _setupPalette(): void {
    this._allowSelect = true;
    this._allowDragOut = true;
    this._allowMove = false;
    this._allowCopy = false;
    this._allowDelete = false;
    this._isReadOnly = true;
  }
}
