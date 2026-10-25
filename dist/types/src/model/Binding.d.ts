import { EnumValue } from '../core/EnumValues';
export declare class Binding {
    static readonly className: string;
    static OneWay: EnumValue;
    static TwoWay: EnumValue;
    targetProperty: string;
    sourceProperty: string;
    conversion: ((value: any, targetObject: any, model: any) => any) | null;
    backConversion: ((value: any, sourceData: any, model: any) => any) | null;
    mode: EnumValue;
    sourceObject: string | null;
    name: string;
    /** 官方 ThemeBinding.themeConverter：findValue 之后的转换 */
    themeConverter: ((value: any, targetObject: any, model?: any) => any) | null;
    /** 官方 ThemeBinding.themeSource：findValue 的 theme 子路径（'colors' / 'levels' ...） */
    themeSource: string | null;
    /** 官方 theme()/themeObject()/themeData()/themeModel() 建立的主题绑定（flags&16） */
    isThemeBinding: boolean;
    constructor(targetProperty?: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any);
    get isTwoWay(): boolean;
    get isFromModel(): boolean;
    get isToData(): boolean;
    makeTwoWay(backConversion?: (value: any, sourceData: any, model: any) => any): Binding;
    ofModel(): Binding;
    ofObject(name?: string): Binding;
    copy(): Binding;
    getValueFromSource(data: any, targetObject: any, model: any): any;
    /**
     * 官方 ThemeBinding 求值（GraphObject.qo - Binding.updateTarget - ThemeBinding.pv）：
     *  - theme()（sourceObject === 'theme'，官方 PT 标志）：key 直接用 sourceProperty，
     *    findValue 后接 themeConverter；
     *  - themeObject()/themeData()/themeModel()：先按 source 求源值，源值 undefined 整段跳过，
     *    再跑 converter 得到主题 key，findValue 后接 themeConverter。
     */
    private _getThemeValue;
    /**
     * 官方 GraphObject.CD(sourceName) + freezeBindings(Ut) 语义：
     * 官方在模板冻结时把所有子对象的绑定收集进 part.Xs，求值时 RN/DD 的 `this`=part，
     * 因此 sourceName='' → DD('')=this=**part**（实测官方 updateTarget 收到的源对象是 Node）。
     * 官方 RN 末尾的覆盖：'/'→elt.part、'.'→elt、'..'→elt.panel；
     * 本实现中绑定就挂在 elt（owner）上，故 ''/'/' 取 part、'.' 取自身、'..' 取所在面板。
     * 具名对象从 part.findObject(name) 找。
     */
    private _findSourceObject;
    getValueFromTarget(targetValue: any, data: any, model: any): any;
    toString(): string;
    private _targetId;
    /** 官方 Binding.targetId：绑定目标在同名对象中的序号 */
    get targetId(): number;
    set targetId(value: number);
    /** 官方 Binding.sourceName（本项目内部字段叫 sourceObject） */
    get sourceName(): string | null;
    set sourceName(value: string | null);
    /** 官方 Binding.converter（本项目内部字段叫 conversion） */
    get converter(): ((value: any, targetObject: any, model?: any) => any) | null;
    set converter(value: ((value: any, targetObject: any, model?: any) => any) | null);
    /** 官方 Binding.backConverter（本项目内部字段叫 backConversion） */
    get backConverter(): ((value: any, sourceData: any, model?: any) => any) | null;
    set backConverter(value: ((value: any, sourceData: any, model?: any) => any) | null);
    /** 官方 Binding.isToModel：源是 Model.modelData */
    get isToModel(): boolean;
    /** 官方 Binding.isToObject：源是某个 GraphObject（theme 绑定不算） */
    get isToObject(): boolean;
    /** 官方 Binding.isToTheme：theme/themeObject/themeData/themeModel 的主题绑定（flags&16） */
    get isToTheme(): boolean;
    /** 官方 Binding.cloneProtected */
    cloneProtected(copy: Binding): void;
    /**
     * 官方 Binding.check：绑定建立前的静态校验。
     * 官方只在 Debug 下向控制台告警，这里保持无副作用（不产生任何输出）。
     */
    check(target: any): void;
    /**
     * 官方 Binding.updateTarget：把源数据写到目标对象上。
     * 官方签名 updateTarget(target, srcData, srcPropName, themeContext)，
     * 第 4 参在官方是 ThemeManager，本项目用作"设置目标属性的写入器"。
     */
    updateTarget(target: any, srcData: any, srcPropName?: string, targetSetter?: any): void;
    /**
     * 官方 Binding.updateSource：TwoWay 绑定时把目标属性写回数据。
     * 第 4 参在官方是目标 Part/Panel，本项目用作"承载数据的对象"。
     */
    updateSource(target: any, srcData: any, srcPropName?: string, targetContext?: any): void;
    private static _setTargetProperty;
    private static _setSourceProperty;
    /** 官方 Binding.parseEnum：把字符串解析成 ctor 上定义的枚举值 */
    static parseEnum(ctor: any, defval: any): (name: string) => any;
    /** 官方 Binding.toString：把任意值转成可读字符串 */
    static toString(val?: any): string;
}
