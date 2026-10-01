import { EnumValue } from '../core/EnumValues';

class BindingMode extends EnumValue {
  constructor(name: string) {
    super(name);
  }
}

export class Binding {
  static readonly className: string = "Binding";
  static OneWay: EnumValue = new BindingMode('OneWay');
  static TwoWay: EnumValue = new BindingMode('TwoWay');

  public targetProperty: string;
  public sourceProperty: string;
  public conversion: ((value: any, targetObject: any, model: any) => any) | null;
  public backConversion: ((value: any, sourceData: any, model: any) => any) | null;
  public mode: EnumValue;
  public sourceObject: string | null;
  public name: string = '';
  /** 官方 ThemeBinding.themeConverter：主题取值后的转换（在普通 converter 之前） */
  public themeConverter: ((value: any, targetObject: any, model?: any) => any) | null;

  constructor(
    targetProperty?: string,
    sourceProperty?: string,
    conversion?: (value: any, targetObject: any, model: any) => any
  ) {
    const tgt = targetProperty !== undefined ? targetProperty : '';
    this.targetProperty = tgt;
    this.sourceProperty = sourceProperty !== undefined ? sourceProperty : tgt;
    this.conversion = conversion || null;
    this.backConversion = null;
    this.mode = Binding.OneWay;
    this.sourceObject = null;
    this.themeConverter = null;
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
    const b = new Binding();
    this.cloneProtected(b);
    return b;
  }

  getValueFromSource(data: any, targetObject: any, model: any): any {
    let value: any;
    if (this.isToTheme) {
      // 官方 ThemeBinding：主题取值 → themeConverter → converter
      const diagram = targetObject ? (targetObject as any).diagram : null;
      const tm = diagram ? diagram.themeManager : null;
      value = tm ? tm.findValue(this.sourceProperty, null, this.targetProperty) : undefined;
      if (value === undefined) return undefined;
      if (this.themeConverter) value = this.themeConverter(value, targetObject, model);
      if (this.conversion) value = this.conversion(value, targetObject, model);
      return value;
    } else if (this.isFromModel) {
      value = model ? model.modelData[this.sourceProperty] : undefined;
    } else if (this.sourceObject !== null) {
      value = undefined;
    } else {
      value = data ? (this.sourceProperty === '' ? data : data[this.sourceProperty]) : undefined;
    }
    // 官方 Binding.updateTarget：源值为 undefined 时整体跳过（不执行 converter、不赋值）
    if (value !== undefined && this.conversion) {
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

  // ============ 官方 Binding API 对齐（阶段 5） ============

  private _targetId: number = -1;

  /** 官方 Binding.targetId：绑定目标在同名对象中的序号 */
  get targetId(): number {
    return this._targetId;
  }
  set targetId(value: number) {
    this._targetId = value;
  }

  /** 官方 Binding.sourceName（本项目内部字段叫 sourceObject） */
  get sourceName(): string | null {
    return this.sourceObject;
  }
  set sourceName(value: string | null) {
    this.sourceObject = value;
  }

  /** 官方 Binding.converter（本项目内部字段叫 conversion） */
  get converter(): ((value: any, targetObject: any, model?: any) => any) | null {
    return this.conversion;
  }
  set converter(value: ((value: any, targetObject: any, model?: any) => any) | null) {
    this.conversion = value;
  }

  /** 官方 Binding.backConverter（本项目内部字段叫 backConversion） */
  get backConverter(): ((value: any, sourceData: any, model?: any) => any) | null {
    return this.backConversion;
  }
  set backConverter(value: ((value: any, sourceData: any, model?: any) => any) | null) {
    this.backConversion = value;
  }

  /** 官方 Binding.isToModel：源是 Model.modelData */
  get isToModel(): boolean {
    return this.sourceObject === 'model';
  }

  /** 官方 Binding.isToObject：源是某个 GraphObject（theme 绑定不算） */
  get isToObject(): boolean {
    return this.sourceObject !== null && this.sourceObject !== 'model' && !this.isToTheme;
  }

  /** 官方 Binding.isToTheme：theme() 建立的主题绑定（sourceObject === 'theme'） */
  get isToTheme(): boolean {
    return this.sourceObject === 'theme';
  }

  /** 官方 Binding.cloneProtected */
  cloneProtected(copy: Binding): void {
    copy.targetProperty = this.targetProperty;
    copy.targetId = this.targetId;
    copy.sourceProperty = this.sourceProperty;
    copy.sourceName = this.sourceName;
    copy.converter = this.converter;
    copy.backConverter = this.backConverter;
    copy.themeConverter = this.themeConverter;
    copy.mode = this.mode;
    copy.name = this.name;
  }

  /**
   * 官方 Binding.check：绑定建立前的静态校验。
   * 官方只在 Debug 下向控制台告警，这里保持无副作用（不产生任何输出）。
   */
  check(target: any): void {
    const tgtProp = this.targetProperty;
    const conv = this.converter;
    if (conv === null && tgtProp === '') return;
    if (tgtProp === 'name' && target !== null && typeof target === 'object') return;
  }

  /**
   * 官方 Binding.updateTarget：把源数据写到目标对象上。
   * 官方签名 updateTarget(target, srcData, srcPropName, themeContext)，
   * 第 4 参在官方是 ThemeManager，本项目用作"设置目标属性的写入器"。
   */
  updateTarget(target: any, srcData: any, srcPropName?: string, targetSetter?: any): void {
    const srcProp = this.sourceProperty;
    if (srcPropName !== undefined && srcProp !== '' && srcProp !== srcPropName) return;
    const tgtProp = this.targetProperty;
    const conv = this.converter;
    let value: any = srcData;
    if (srcProp !== '' && srcData !== null && srcData !== undefined) {
      value = srcData[srcProp];
    }
    if (value === undefined) return;
    if (conv === null) {
      if (tgtProp !== '') Binding._setTargetProperty(target, tgtProp, value, targetSetter);
    } else {
      try {
        const converted = conv(value, target);
        if (tgtProp !== '') Binding._setTargetProperty(target, tgtProp, converted, targetSetter);
      } catch (err) {
        // 官方：转换函数抛错时只告警，不影响其他绑定
      }
    }
  }

  /**
   * 官方 Binding.updateSource：TwoWay 绑定时把目标属性写回数据。
   * 第 4 参在官方是目标 Part/Panel，本项目用作"承载数据的对象"。
   */
  updateSource(target: any, srcData: any, srcPropName?: string, targetContext?: any): void {
    if (this.mode !== Binding.TwoWay) return;
    const tgtProp = this.targetProperty;
    if (srcPropName !== undefined && tgtProp !== '' && tgtProp !== srcPropName) return;
    const srcProp = this.sourceProperty;
    if (srcProp === '') return;
    const back = this.backConverter;
    let value: any = target;
    if (tgtProp !== '' && target !== null && target !== undefined) {
      value = target[tgtProp];
    }
    if (value === undefined) return;
    if (back === null) {
      Binding._setSourceProperty(srcData, srcProp, value);
    } else {
      try {
        const converted = back(value, srcData, null);
        if (converted !== undefined) Binding._setSourceProperty(srcData, srcProp, converted);
      } catch (err) {
        // 官方：反向转换函数抛错时只告警
      }
    }
    void targetContext;
  }

  private static _setTargetProperty(target: any, prop: string, value: any, setter: any): void {
    if (target === null || target === undefined) return;
    // 官方 Model.ft：属性写入包 try/catch，失败仅 console.log（U.et），不影响其他绑定
    try {
      if (setter !== null && setter !== undefined) {
        if (typeof setter === 'function') setter(target, prop, value);
        else if (typeof setter.ft === 'function') setter.ft(target, prop, value);
        else target[prop] = value;
        return;
      }
      target[prop] = value;
    } catch (err: any) {
      if (typeof console !== 'undefined' && console.log) {
        console.log('property set error: ' + (err && err.toString ? err.toString() : String(err)));
      }
    }
  }

  private static _setSourceProperty(data: any, prop: string, value: any): void {
    if (data === null || data === undefined) return;
    if (prop === '') return;
    if (typeof data === 'object') data[prop] = value;
  }

  /** 官方 Binding.parseEnum：把字符串解析成 ctor 上定义的枚举值 */
  static parseEnum(ctor: any, defval: any): (name: string) => any {
    if (ctor === null || ctor === undefined) {
      throw new Error('Binding.parseEnum:ctor must not be null');
    }
    return (name: string): any => {
      if (typeof name !== 'string') return defval;
      const asNumber = parseInt(name, 10);
      if (!isNaN(asNumber)) return asNumber;
      const found = ctor[name];
      return found === null || found === undefined ? defval : found;
    };
  }

  /** 官方 Binding.toString：把任意值转成可读字符串 */
  static toString(val?: any): string {
    if (val === undefined) return 'undefined';
    if (val === null) return 'null';
    return val.toString();
  }

}
