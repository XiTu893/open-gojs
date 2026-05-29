import { EnumValue } from '../core/EnumValues';

class BindingMode extends EnumValue {
  constructor(name: string) {
    super(name);
  }
}

export class Binding {
  static OneWay: EnumValue = new BindingMode('OneWay');
  static TwoWay: EnumValue = new BindingMode('TwoWay');

  public targetProperty: string;
  public sourceProperty: string;
  public conversion: ((value: any, targetObject: any, model: any) => any) | null;
  public backConversion: ((value: any, sourceData: any, model: any) => any) | null;
  public mode: EnumValue;
  public sourceObject: string | null;
  public name: string = '';

  constructor(
    targetProperty: string,
    sourceProperty?: string,
    conversion?: (value: any, targetObject: any, model: any) => any
  ) {
    this.targetProperty = targetProperty;
    this.sourceProperty = sourceProperty || targetProperty;
    this.conversion = conversion || null;
    this.backConversion = null;
    this.mode = Binding.OneWay;
    this.sourceObject = null;
  }

  get isTwoWay(): boolean {
    return this.mode === Binding.TwoWay;
  }

  get isFromModel(): boolean {
    return this.sourceObject === 'model';
  }

  get isToData(): boolean {
    return !this.isFromModel && this.sourceObject === null;
  }

  makeTwoWay(backConversion?: (value: any, sourceData: any, model: any) => any): Binding {
    this.mode = Binding.TwoWay;
    this.backConversion = backConversion || null;
    return this;
  }

  ofModel(): Binding {
    this.sourceObject = 'model';
    return this;
  }

  ofObject(name?: string): Binding {
    this.sourceObject = name !== undefined ? name : '';
    return this;
  }

  copy(): Binding {
    const b = new Binding(this.targetProperty, this.sourceProperty, this.conversion || undefined);
    b.mode = this.mode;
    b.backConversion = this.backConversion;
    b.sourceObject = this.sourceObject;
    b.name = this.name;
    return b;
  }

  getValueFromSource(data: any, targetObject: any, model: any): any {
    let value: any;
    if (this.isFromModel) {
      value = model ? model.modelData[this.sourceProperty] : undefined;
    } else if (this.sourceObject !== null) {
      value = undefined;
    } else {
      value = data ? data[this.sourceProperty] : undefined;
    }
    if (this.conversion) {
      value = this.conversion(value, targetObject, model);
    }
    return value;
  }

  getValueFromTarget(targetValue: any, data: any, model: any): any {
    if (this.backConversion) {
      return this.backConversion(targetValue, data, model);
    }
    return targetValue;
  }

  toString(): string {
    let str = `Binding(${this.targetProperty}, ${this.sourceProperty}`;
    if (this.mode === Binding.TwoWay) str += ', TwoWay';
    if (this.sourceObject === 'model') str += ', ofModel';
    else if (this.sourceObject !== null) str += `, ofObject(${this.sourceObject})`;
    if (this.name) str += `, name=${this.name}`;
    str += ')';
    return str;
  }
}
