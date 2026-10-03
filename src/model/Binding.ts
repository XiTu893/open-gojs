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
  /** 官方 ThemeBinding.themeConverter：findValue 之后的转换 */
  public themeConverter: ((value: any, targetObject: any, model?: any) => any) | null;
  /** 官方 ThemeBinding.themeSource：findValue 的 theme 子路径（'colors' / 'levels' ...） */
  public themeSource: string | null;
  /** 官方 theme()/themeObject()/themeData()/themeModel() 建立的主题绑定（flags&16） */
  public isThemeBinding: boolean;

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
    this.themeSource = null;
    this.isThemeBinding = false;
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
    if (this.isToTheme) {
      return this._getThemeValue(data, targetObject, model);
    }

    let value: any;
    if (this.isFromModel) {
      value = model ? model.modelData[this.sourceProperty] : undefined;
    } else if (this.sourceObject !== null) {
      // 官方 ofObject：源是某个 GraphObject（sourceName 特殊值都指“绑定面板”本身）
      const srcObj = this._findSourceObject(targetObject);
      if (srcObj === null || srcObj === undefined) return undefined;
      value = this.sourceProperty === '' ? srcObj : srcObj[this.sourceProperty];
    } else {
      value = data ? (this.sourceProperty === '' ? data : data[this.sourceProperty]) : undefined;
    }
    // 官方 Binding.updateTarget：源值为 undefined 时整体跳过（不执行 converter、不赋值）
    if (value !== undefined && this.conversion) {
      value = this.conversion(value, targetObject, model);
    }
    return value;
  }

  /**
   * 官方 ThemeBinding 求值（GraphObject.qo - Binding.updateTarget - ThemeBinding.pv）：
   *  - theme()（sourceObject === 'theme'，官方 PT 标志）：key 直接用 sourceProperty，
   *    findValue 后接 themeConverter；
   *  - themeObject()/themeData()/themeModel()：先按 source 求源值，源值 undefined 整段跳过，
   *    再跑 converter 得到主题 key，findValue 后接 themeConverter。
   */
  private _getThemeValue(data: any, targetObject: any, model: any): any {
    const diagram = targetObject ? (targetObject as any).diagram : null;
    const tm = diagram ? diagram.themeManager : null;
    if (!tm) return undefined;

    let key: any;
    if (this.sourceObject === 'theme') {
      key = this.sourceProperty;
    } else {
      let srcObj: any;
      if (this.sourceObject === null) srcObj = data; // themeData：源 = data
      else if (this.sourceObject === 'model') srcObj = model ? model.modelData : undefined;
      else srcObj = this._findSourceObject(targetObject); // themeObject
      if (srcObj === null || srcObj === undefined) return undefined;
      let v: any = this.sourceProperty === '' ? srcObj : srcObj[this.sourceProperty];
      if (v === undefined) return undefined;
      if (this.conversion) v = this.conversion(v, targetObject, model);
      key = v;
    }

    const out = tm.findValue(key, this.themeSource, this.targetProperty);
    if (out === undefined) return undefined;
    return this.themeConverter ? this.themeConverter(out, targetObject, model) : out;
  }

  /**
   * 官方 GraphObject.CD(sourceName) + freezeBindings(Ut) 语义：
   * 官方在模板冻结时把所有子对象的绑定收集进 part.Xs，求值时 RN/DD 的 `this`=part，
   * 因此 sourceName='' → DD('')=this=**part**（实测官方 updateTarget 收到的源对象是 Node）。
   * 官方 RN 末尾的覆盖：'/'→elt.part、'.'→elt、'..'→elt.panel；
   * 本实现中绑定就挂在 elt（owner）上，故 ''/'/' 取 part、'.' 取自身、'..' 取所在面板。
   * 具名对象从 part.findObject(name) 找。
   */
  private _findSourceObject(targetObject: any): any {
    const name = this.sourceObject;
    if (name === '' || name === '/') {
      const part = targetObject ? (targetObject.part || null) : null;
      return part || targetObject || null;
    }
    if (name === '.') return targetObject || null;
    if (name === '..') {
      return targetObject ? (targetObject.panel || targetObject.part || null) : null;
    }
    const part = targetObject ? targetObject.part : null;
    if (part && typeof part.findObject === 'function') return part.findObject(name);
    return null;
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

  /** 官方 Binding.isToTheme：theme/themeObject/themeData/themeModel 的主题绑定（flags&16） */
  get isToTheme(): boolean {
    return this.isThemeBinding || this.sourceObject === 'theme';
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
    copy.themeSource = this.themeSource;
    copy.isThemeBinding = this.isThemeBinding;
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
